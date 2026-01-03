import { Command } from "@tauri-apps/plugin-shell";
import * as zod from "zod";

export const SupportedVideoFormats = ["avi", "mp4", "mkv"] as const;
export type VideoFormat = (typeof SupportedVideoFormats)[number];

export function isSupportedVideoFormat(value: string): value is VideoFormat {
	return SupportedVideoFormats.some((f) => f === value);
}

const FileInfoSchema = zod.object({
	streams: zod.array(
		zod.object({
			index: zod.number().default(0),
			codec_name: zod.string().default("N/A"),
			codec_type: zod.string().default("N/A"),
			r_frame_rate: zod
				.string()
				.default("N/A")
				.transform((val) => {
					if (val === "N/A") {
						return 0;
					}

					const fps = Number(val.split("/")[0]);
					if (!Number.isInteger(fps)) {
						return 0;
					}

					return fps;
				}),
		}),
	),
	format: zod.object({
		filename: zod.string().default("N/A"),
		format_name: zod.string().default("N/A"),
		duration: zod
			.string()
			.default("N/A")
			.transform((val) => {
				if (val === "N/A") {
					return "0";
				}

				const duration = (Number(val) / 60).toFixed(2);
				return duration;
			}),
		size: zod
			.string()
			.default("N/A")
			.transform((val) => {
				if (val === "N/A") {
					return "0";
				}

				const size = (Number(val) / (1000 * 1000)).toFixed(2);
				return size;
			}),
		bit_rate: zod.string().default("N/A"),
	}),
});
export type FileInfo = zod.output<typeof FileInfoSchema> & {
	format: { fps: number };
};

interface ChangeEncodingOptions {
	format: VideoFormat;
	reencode?: boolean;
}

export async function changeEncoding(
	source: string,
	destination: string,
	options: ChangeEncodingOptions,
) {
	const { format, reencode = true } = options;

	// without reencoding fast beacuse it only changes containers
	const args = ["-i", source, "-c", "copy", `${destination}.${format}`];

	if (reencode) {
		args.splice(2, 2);
	}

	const command = Command.sidecar("binaries/ffmpeg", args);
	await command.execute();
}

interface ThumbnailOptions {
	count?: number;
	quality?: "high" | "low";
	format?: "jpg" | "png";
}
export async function generateThumbnails(
	source: string,
	destination: string,
	options: ThumbnailOptions = {},
) {
	const ops: Required<ThumbnailOptions> = {
		count: options.count ?? 10,
		quality: options.quality ?? "low",
		format: options.format ?? "jpg",
	};

	const file = await probeVideo(source);
	const duration = Number(file.format.duration) * 60;
	const step = Math.floor(duration / ops.count);

	const args = [
		"-i",
		source,
		"-vf",
		`fps=1/${step}`,
		`${destination}/thumbnail_%03d.${ops.format}`,
	];

	const command = Command.sidecar("binaries/ffmpeg", args);
	await command.execute();
}

export async function probeVideo(source: string) {
	const args = [
		"-v",
		"quiet",
		"-print_format",
		"json",
		"-show_format",
		"-show_streams",
		source,
	];
	const command = Command.sidecar("binaries/ffprobe", args);

	const output = await command.execute();
	const response = output.stdout;

	const parsedResponse = FileInfoSchema.safeParse(JSON.parse(response));
	if (!parsedResponse.success) {
		throw new Error(`Failed to parse response: ${parsedResponse.error}`);
	}

	return {
		streams: parsedResponse.data.streams,
		format: {
			...parsedResponse.data.format,
			fps:
				parsedResponse.data.streams.find((val) => val.codec_type === "video")
					?.r_frame_rate ?? 0,
		},
	};
}
