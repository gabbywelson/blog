import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

// Dynamic import for heic-convert since it's a CommonJS module
async function convertHeicToPng(buffer: ArrayBuffer): Promise<Buffer> {
	console.log("[Upload API] Starting HEIC to PNG conversion...");
	console.log("[Upload API] Input buffer size:", buffer.byteLength, "bytes");

	const heicConvert = (await import("heic-convert")).default;
	const result = await heicConvert({
		buffer: Buffer.from(buffer),
		format: "PNG",
	});

	console.log(
		"[Upload API] Conversion complete, output size:",
		result.length,
		"bytes",
	);
	return Buffer.from(result);
}

function isHeicByName(filename: string): boolean {
	const extension = filename.toLowerCase().split(".").pop();
	return extension === "heic" || extension === "heif";
}

function isHeicByType(mimeType: string): boolean {
	return (
		mimeType === "image/heic" ||
		mimeType === "image/heif" ||
		mimeType === "image/heic-sequence" ||
		mimeType === "image/heif-sequence"
	);
}

function replaceExtension(filename: string, newExtension: string): string {
	const lastDotIndex = filename.lastIndexOf(".");
	if (lastDotIndex === -1) {
		return `${filename}.${newExtension}`;
	}
	return `${filename.slice(0, lastDotIndex)}.${newExtension}`;
}

// Generate a default filename based on timestamp
function generateFilename(extension: string = "png"): string {
	const now = new Date();
	const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
	return `upload-${timestamp}.${extension}`;
}

// Detect image type from buffer magic bytes
function detectImageType(buffer: Buffer): string | null {
	if (buffer.length < 12) return null;

	// PNG: 89 50 4E 47
	if (
		buffer[0] === 0x89 &&
		buffer[1] === 0x50 &&
		buffer[2] === 0x4e &&
		buffer[3] === 0x47
	) {
		return "image/png";
	}

	// JPEG: FF D8 FF
	if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
		return "image/jpeg";
	}

	// GIF: 47 49 46 38
	if (
		buffer[0] === 0x47 &&
		buffer[1] === 0x49 &&
		buffer[2] === 0x46 &&
		buffer[3] === 0x38
	) {
		return "image/gif";
	}

	// WebP: 52 49 46 46 ... 57 45 42 50
	if (
		buffer[0] === 0x52 &&
		buffer[1] === 0x49 &&
		buffer[2] === 0x46 &&
		buffer[3] === 0x46 &&
		buffer[8] === 0x57 &&
		buffer[9] === 0x45 &&
		buffer[10] === 0x42 &&
		buffer[11] === 0x50
	) {
		return "image/webp";
	}

	// HEIC/HEIF: Check for ftyp box with heic/heix/hevc/hevx/mif1/msf1
	if (
		buffer[4] === 0x66 &&
		buffer[5] === 0x74 &&
		buffer[6] === 0x79 &&
		buffer[7] === 0x70
	) {
		const brand = buffer.slice(8, 12).toString("ascii");
		if (["heic", "heix", "hevc", "hevx", "mif1", "msf1"].includes(brand)) {
			return "image/heic";
		}
	}

	return null;
}

function getExtensionForMimeType(mimeType: string): string {
	const map: Record<string, string> = {
		"image/png": "png",
		"image/jpeg": "jpg",
		"image/gif": "gif",
		"image/webp": "webp",
		"image/heic": "heic",
		"image/heif": "heic",
	};
	return map[mimeType] || "png";
}

export async function POST(request: NextRequest) {
	console.log("\n" + "=".repeat(60));
	console.log("[Upload API] ===== NEW UPLOAD REQUEST =====");
	console.log("[Upload API] Timestamp:", new Date().toISOString());
	console.log("[Upload API] Method:", request.method);
	console.log("[Upload API] URL:", request.url);

	// Log all headers for debugging
	console.log("[Upload API] --- Headers ---");
	request.headers.forEach((value, key) => {
		// Mask the auth token for security
		if (key.toLowerCase() === "authorization") {
			const masked = value.length > 15 ? value.slice(0, 15) + "..." : value;
			console.log(`[Upload API]   ${key}: ${masked}`);
		} else {
			console.log(`[Upload API]   ${key}: ${value}`);
		}
	});

	// Check for bearer token authentication
	const authHeader = request.headers.get("authorization");
	const expectedToken = process.env.UPLOAD_API_TOKEN;

	console.log("[Upload API] --- Auth Check ---");
	console.log("[Upload API] Has auth header:", !!authHeader);
	console.log(
		"[Upload API] Auth header starts with 'Bearer ':",
		authHeader?.startsWith("Bearer "),
	);
	console.log("[Upload API] UPLOAD_API_TOKEN env var is set:", !!expectedToken);

	if (!expectedToken) {
		console.log(
			"[Upload API] ❌ REJECTED: UPLOAD_API_TOKEN not set in environment",
		);
		return NextResponse.json(
			{ error: "Server misconfigured: UPLOAD_API_TOKEN not set" },
			{ status: 500 },
		);
	}

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		console.log(
			"[Upload API] ❌ REJECTED: Missing or invalid Authorization header",
		);
		console.log("[Upload API] Received auth header:", authHeader || "(none)");
		return NextResponse.json(
			{ error: "Missing or invalid Authorization header" },
			{ status: 401 },
		);
	}

	const token = authHeader.slice(7); // Remove "Bearer " prefix
	if (token !== expectedToken) {
		console.log("[Upload API] ❌ REJECTED: Token mismatch");
		console.log("[Upload API] Token length received:", token.length);
		console.log("[Upload API] Token length expected:", expectedToken.length);
		console.log(
			"[Upload API] First 10 chars match:",
			token.slice(0, 10) === expectedToken.slice(0, 10),
		);
		return NextResponse.json({ error: "Invalid token" }, { status: 401 });
	}

	console.log("[Upload API] ✅ Auth passed");

	const contentType = request.headers.get("content-type") || "";
	console.log("[Upload API] --- Detecting Upload Method ---");
	console.log("[Upload API] Content-Type:", contentType);

	try {
		let fileBuffer: Buffer;
		let filename: string;
		let mimeType: string;
		let folder: string | null = null;

		// METHOD 1: JSON with base64-encoded image (best for iOS Shortcuts)
		if (contentType.includes("application/json")) {
			console.log("[Upload API] 📦 Method: JSON with base64 image");

			let json: { image?: string; filename?: string; folder?: string };
			try {
				const rawBody = await request.text();
				console.log(
					"[Upload API] Raw JSON body length:",
					rawBody.length,
					"chars",
				);
				console.log(
					"[Upload API] Raw JSON body preview:",
					rawBody.slice(0, 200) + (rawBody.length > 200 ? "..." : ""),
				);
				json = JSON.parse(rawBody);
				console.log("[Upload API] JSON parsed successfully");
				console.log("[Upload API] JSON keys:", Object.keys(json).join(", "));

				// Log each field's value type and length
				for (const [key, value] of Object.entries(json)) {
					if (typeof value === "string") {
						console.log(
							`[Upload API]   "${key}": string, length=${
								value.length
							}, preview="${value.slice(0, 50)}${
								value.length > 50 ? "..." : ""
							}"`,
						);
					} else {
						console.log(
							`[Upload API]   "${key}": ${typeof value}, value=${JSON.stringify(
								value,
							)}`,
						);
					}
				}
			} catch (e) {
				console.log("[Upload API] ❌ Failed to parse JSON:", e);
				return NextResponse.json(
					{ error: "Invalid JSON body" },
					{ status: 400 },
				);
			}

			if (!json.image || json.image.length === 0) {
				console.log("[Upload API] ❌ Missing or empty 'image' field in JSON");
				console.log(
					"[Upload API] 'image' value:",
					json.image === undefined
						? "undefined"
						: json.image === null
							? "null"
							: `"${json.image}"`,
				);
				return NextResponse.json(
					{
						error: "Missing 'image' field with base64-encoded image data",
						hint: "In iOS Shortcuts, make sure the Base64 Encoded result is connected to the 'image' field value",
					},
					{ status: 400 },
				);
			}

			console.log(
				"[Upload API] Base64 image length:",
				json.image.length,
				"chars",
			);
			console.log("[Upload API] Provided filename:", json.filename || "(none)");
			console.log("[Upload API] Provided folder:", json.folder || "(none)");

			// Decode base64
			try {
				// Handle data URLs (e.g., "data:image/png;base64,...")
				let base64Data = json.image;
				if (base64Data.includes(",")) {
					console.log(
						"[Upload API] Detected data URL format, extracting base64 portion",
					);
					base64Data = base64Data.split(",")[1];
				}
				fileBuffer = Buffer.from(base64Data, "base64");
				console.log(
					"[Upload API] Decoded buffer size:",
					fileBuffer.length,
					"bytes",
				);
			} catch (e) {
				console.log("[Upload API] ❌ Failed to decode base64:", e);
				return NextResponse.json(
					{ error: "Invalid base64 image data" },
					{ status: 400 },
				);
			}

			// Detect image type from buffer
			const detectedType = detectImageType(fileBuffer);
			console.log(
				"[Upload API] Detected image type from bytes:",
				detectedType || "(unknown)",
			);

			if (json.filename) {
				filename = json.filename;
				mimeType = detectedType || "image/png";
			} else {
				mimeType = detectedType || "image/png";
				filename = generateFilename(getExtensionForMimeType(mimeType));
			}

			folder = json.folder || null;
		}

		// METHOD 2: Raw binary body (Request Body: File in Shortcuts)
		else if (
			contentType.includes("image/") ||
			contentType.includes("application/octet-stream") ||
			!contentType.includes("multipart/form-data")
		) {
			console.log("[Upload API] 📦 Method: Raw binary body");

			// Get filename from query param or header
			const url = new URL(request.url);
			filename =
				url.searchParams.get("filename") ||
				request.headers.get("x-filename") ||
				"";
			folder =
				url.searchParams.get("folder") ||
				request.headers.get("x-folder") ||
				null;

			console.log(
				"[Upload API] Filename from params/header:",
				filename || "(none)",
			);
			console.log(
				"[Upload API] Folder from params/header:",
				folder || "(none)",
			);

			try {
				const arrayBuffer = await request.arrayBuffer();
				fileBuffer = Buffer.from(arrayBuffer);
				console.log("[Upload API] Raw body size:", fileBuffer.length, "bytes");
			} catch (e) {
				console.log("[Upload API] ❌ Failed to read request body:", e);
				return NextResponse.json(
					{ error: "Failed to read request body" },
					{ status: 400 },
				);
			}

			if (fileBuffer.length === 0) {
				console.log("[Upload API] ❌ Empty request body");
				return NextResponse.json(
					{ error: "Empty request body" },
					{ status: 400 },
				);
			}

			// Detect image type
			const detectedType = detectImageType(fileBuffer);
			console.log(
				"[Upload API] Detected image type from bytes:",
				detectedType || "(unknown)",
			);

			if (contentType.includes("image/")) {
				mimeType = contentType.split(";")[0];
			} else {
				mimeType = detectedType || "image/png";
			}

			if (!filename) {
				filename = generateFilename(getExtensionForMimeType(mimeType));
				console.log("[Upload API] Generated filename:", filename);
			}
		}

		// METHOD 3: Multipart form data (original method)
		else {
			console.log("[Upload API] 📦 Method: Multipart form data");

			let formData: FormData;
			try {
				formData = await request.formData();
				console.log("[Upload API] FormData parsed successfully");
			} catch (formError) {
				console.log("[Upload API] ❌ Failed to parse FormData:", formError);
				return NextResponse.json(
					{ error: "Failed to parse form data" },
					{ status: 400 },
				);
			}

			// Log all form data keys
			console.log("[Upload API] --- Form Data Contents ---");
			const formDataKeys: string[] = [];
			formData.forEach((value, key) => {
				formDataKeys.push(key);
				if (value instanceof File) {
					console.log(
						`[Upload API]   ${key}: [File] name="${value.name}", type="${value.type}", size=${value.size} bytes`,
					);
				} else {
					console.log(`[Upload API]   ${key}: "${value}"`);
				}
			});
			console.log("[Upload API] Total form fields:", formDataKeys.length);

			const file = formData.get("file") as File | null;
			folder = (formData.get("folder") as string) || null;

			if (!file || file.size === 0) {
				console.log("[Upload API] ❌ No file provided or file is empty");
				return NextResponse.json(
					{ error: "No file provided" },
					{ status: 400 },
				);
			}

			fileBuffer = Buffer.from(await file.arrayBuffer());
			filename = file.name;
			mimeType = file.type || detectImageType(fileBuffer) || "image/png";
		}

		// === COMMON PROCESSING ===
		console.log("[Upload API] --- Processing Image ---");
		console.log("[Upload API] Filename:", filename);
		console.log("[Upload API] MIME type:", mimeType);
		console.log("[Upload API] Buffer size:", fileBuffer.length, "bytes");
		console.log("[Upload API] Folder:", folder || "(root)");

		// Validate it's an image
		const isHeic = isHeicByType(mimeType) || isHeicByName(filename);
		const isValidImage =
			mimeType.startsWith("image/") || isHeic || detectImageType(fileBuffer);

		console.log("[Upload API] Is HEIC:", isHeic);
		console.log("[Upload API] Is valid image:", !!isValidImage);

		if (!isValidImage) {
			console.log("[Upload API] ❌ Not a valid image");
			return NextResponse.json(
				{ error: "Only image files are allowed" },
				{ status: 400 },
			);
		}

		// Validate file size (max 10MB)
		const maxSize = 10 * 1024 * 1024;
		if (fileBuffer.length > maxSize) {
			console.log(
				"[Upload API] ❌ File too large:",
				fileBuffer.length,
				"bytes",
			);
			return NextResponse.json(
				{
					error: `File size must be less than 10MB. Received: ${(
						fileBuffer.length / 1024 / 1024
					).toFixed(2)}MB`,
				},
				{ status: 400 },
			);
		}

		// Convert HEIC to PNG if necessary
		if (isHeic) {
			console.log("[Upload API] --- HEIC Conversion ---");
			try {
				// Convert Buffer to ArrayBuffer for the conversion function
				const arrayBuffer = new Uint8Array(fileBuffer).buffer;
				fileBuffer = await convertHeicToPng(arrayBuffer);
				filename = replaceExtension(filename, "png");
				mimeType = "image/png";
				console.log("[Upload API] ✅ HEIC conversion successful");
				console.log("[Upload API] New filename:", filename);
			} catch (conversionError) {
				console.log("[Upload API] ❌ HEIC conversion failed:", conversionError);
				return NextResponse.json(
					{ error: "Failed to convert HEIC image" },
					{ status: 500 },
				);
			}
		}

		// Upload to blob storage
		const pathname = folder ? `${folder}/${filename}` : filename;
		console.log("[Upload API] --- Upload to Blob Storage ---");
		console.log("[Upload API] Target pathname:", pathname);
		console.log("[Upload API] Content-Type for upload:", mimeType);

		const result = await put(pathname, fileBuffer, {
			access: "public",
			contentType: mimeType,
		});

		console.log("[Upload API] ✅ Upload successful!");
		console.log("[Upload API] Result URL:", result.url);
		console.log("[Upload API] Result pathname:", result.pathname);
		console.log("=".repeat(60) + "\n");

		return NextResponse.json({
			success: true,
			url: result.url,
			pathname: result.pathname,
			markdown: `![${filename.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}](${
				result.url
			})`,
		});
	} catch (error) {
		console.log("[Upload API] ❌ UNEXPECTED ERROR:");
		console.error("[Upload API]", error);
		console.log("=".repeat(60) + "\n");
		return NextResponse.json(
			{ error: "Failed to upload file" },
			{ status: 500 },
		);
	}
}
