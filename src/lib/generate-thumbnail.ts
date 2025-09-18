import { Command } from "@tauri-apps/plugin-shell";

export default async function generateThumbnail(
	source: string,
	destination: string,
) {
	try {
		const command = Command.sidecar("binaries/ffmpeg", [
			"-i",
			source,
			"-vf",
			"fps=1/10",
			`${destination}/thumbnail_%03d.jpg`,
		]);

		const output = await command.execute();
		const response = output.stdout;

		console.log("function generate_thumbnail is called: ", response);
	} catch (error) {
		console.log(error);
	}
}
