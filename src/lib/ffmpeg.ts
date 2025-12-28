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

export async function changeFormat(options: ChangeFormatOptions) {
	const { source, destination, format, reencode = true } = options;

	// without reencoding fast beacuse it only changes containers
	const args = ["-i", source, "-c", "copy", `${destination}.${format}`];

	if (reencode) {
		args.splice(2, 2);
	}

	const command = Command.sidecar("binaries/ffmpeg", args);
	await command.execute();
}

export async function generateThumbnail(source: string, destination: string) {
	const command = Command.sidecar("binaries/ffmpeg", [
		"-i",
		source,
		"-vf",
		"fps=1/10",
		`${destination}/thumbnail_%03d.jpg`,
	]);

	await command.execute();
}

const formatSchema = zod.object({
	streams: zod.array(
		zod.object({
			index: zod.number(),
			codec_name: zod.string(),
			codec_type: zod.string(),
			r_frame_rate: zod.string(),
		}),
	),
	format: zod.object({
		filename: zod.string(),
		format_name: zod.string(),
		format_long_name: zod.string(),
		duration: zod.string(),
		size: zod.string(),
		bit_rate: zod.string(),
	}),
});

export type FormatDetails = zod.output<typeof formatSchema>;

export async function probeVideo(source: string) {
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

	const parsedResponse = formatSchema.safeParse(JSON.parse(response));
	if (!parsedResponse.success) {
		throw new Error(`Failed to parse response: ${parsedResponse.error}`);
	}

	return parsedResponse.data;
}
