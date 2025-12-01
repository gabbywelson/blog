"use server";

import { put, del, list, copy } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;
  const folder = formData.get("folder") as string | null;

  if (!file) {
    return { error: "No file provided" };
  }

  // Validate file type (images only)
  if (!file.type.startsWith("image/")) {
    return { error: "Only image files are allowed" };
  }

  // Validate file size (max 4.5MB for Vercel Blob free tier)
  const maxSize = 4.5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { error: "File size must be less than 4.5MB" };
  }

  try {
    // Build pathname with optional folder prefix
    const pathname = folder ? `${folder}/${file.name}` : file.name;

    const result = await put(pathname, file, {
      access: "public",
    });

    revalidatePath("/admin");

    // Return blob with all required properties for the UI
    return {
      success: true,
      blob: {
        url: result.url,
        pathname: result.pathname,
        size: file.size,
        uploadedAt: new Date(),
      },
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload file" };
  }
}

export async function deleteFile(url: string) {
  try {
    await del(url);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { error: "Failed to delete file" };
  }
}

export async function listFiles(prefix?: string) {
  try {
    const { blobs } = await list(prefix ? { prefix } : undefined);
    return { success: true, blobs };
  } catch (error) {
    console.error("List error:", error);
    return { error: "Failed to list files", blobs: [] };
  }
}

export async function renameFile(sourceUrl: string, newPathname: string) {
  try {
    // Copy to new path
    const result = await copy(sourceUrl, newPathname, { access: "public" });

    // Delete original
    await del(sourceUrl);

    revalidatePath("/admin");

    return {
      success: true,
      blob: {
        url: result.url,
        pathname: result.pathname,
        size: result.size,
        uploadedAt: result.uploadedAt,
      },
    };
  } catch (error) {
    console.error("Rename error:", error);
    return { error: "Failed to rename file" };
  }
}

export async function moveToFolder(
  sourceUrl: string,
  folderPath: string,
  filename: string
) {
  const newPathname = folderPath ? `${folderPath}/${filename}` : filename;
  return renameFile(sourceUrl, newPathname);
}
