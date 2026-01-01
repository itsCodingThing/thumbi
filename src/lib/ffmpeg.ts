import { Command } from "@tauri-apps/plugin-shell";
import * as zod from "zod";

export const SupportedVideoFormats = ["avi", "mp4", "mkv"] as const;
export type VideoFormat = (typeof SupportedVideoFormats)[number];

export function isSupportedVideoFormat(value: string): value is VideoFormat {
	return SupportedVideoFormats.some((f) => f === value);
}

interface ChangeFormatOptions {
	source: string;
	destination: string;
	format: VideoFormat;
	reencode?: boolean;
}

const FileInfoSchema = zod.object({
	streams: zod.array(
		zod.object({
			index: zod.number().default(0),
			codec_name: zod.string().default("N/A"),
			codec_type: zod.string().default("N/A"),
			r_frame_rate: zod.string().default("N/A"),
		}),
	),
	format: zod.object({
		filename: zod.string().default("N/A"),
		format_name: zod.string().default("N/A"),
		format_long_name: zod.string().default("N/A"),
		duration: zod.string().default("N/A"),
		size: zod.string().default("N/A"),
		bit_rate: zod.string().default("N/A"),
	}),
});
export type FileInfo = zod.output<typeof FileInfoSchema>;

class Ffmpeg {
	#config = {
		gpuSupport: false,
	};

	config() {
		return this.#config;
	}

	toggleGpuSupport(toggle: boolean) {
		this.#config.gpuSupport = toggle;
	}

	async changeEncoding(options: ChangeFormatOptions) {
		const { source, destination, format, reencode = true } = options;

		// without reencoding fast beacuse it only changes containers
		const args = ["-i", source, "-c", "copy", `${destination}.${format}`];

		if (reencode) {
			args.splice(2, 2);
		}

		const command = Command.sidecar("binaries/ffmpeg", args);
		await command.execute();
	}

	async generateThumbnails(source: string, destination: string) {
		const command = Command.sidecar("binaries/ffmpeg", [
			"-i",
			source,
			"-vf",
			"fps=1/10",
			`${destination}/thumbnail_%03d.jpg`,
		]);

		await command.execute();
	}

	async probeVideo(source: string) {
		const command = Command.sidecar(
			"binaries/ffprobe",
			[
				"-v",
				"quiet",
				"-print_format",
				"json",
				"-show_format",
				"-show_streams",
				source,
			],
			{ encoding: "utf-8" },
		);

		const output = await command.execute();
		const response = output.stdout;

		const parsedResponse = FileInfoSchema.safeParse(JSON.parse(response));
		if (!parsedResponse.success) {
			throw new Error(`Failed to parse response: ${parsedResponse.error}`);
		}

		return parsedResponse.data;
	}
}

export const ffmpeg = new Ffmpeg();
