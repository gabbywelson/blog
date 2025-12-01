declare module "heic-convert" {
	interface ConvertOptions {
		buffer: Buffer;
		format: "PNG" | "JPEG";
		quality?: number;
	}

	interface ConvertResult {
		(options: ConvertOptions): Promise<Uint8Array>;
	}

	const convert: ConvertResult;
	export default convert;
}
