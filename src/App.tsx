import "./App.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { open as fileOpen } from "@tauri-apps/plugin-dialog";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { LoaderCircleIcon } from "lucide-react";

function App() {
	const [isLoading, setIsLoading] = useState(false);
	const [path, setPath] = useState({
		sourceFile: "",
		destination: "",
		ffmpegPath: "",
	});

	const selectBinFile = async () => {
		const blob = await fileOpen({
			multiple: false,
			directory: false,
		});
		console.log(blob);

		if (blob) {
			setPath({ ...path, ffmpegPath: blob });
		}
	};

	const selectFile = async () => {
		const blob = await fileOpen({
			multiple: false,
			directory: false,
		});
		console.log(blob);

		if (blob) {
			setPath({ ...path, sourceFile: blob });
		}
	};

	const whereToSave = async () => {
		const blob = await fileOpen({
			directory: true,
			multiple: false,
			title: "Select folder to save files in",
		});
		console.log(blob);

		if (blob) {
			setPath({ ...path, destination: blob });
		}
	};

	const genThumbnail = async () => {
		setIsLoading(true);

		try {
			const result = await invoke("generate_thumbnail", {
				sourceFile: path.sourceFile,
				destination: path.destination,
				ffmpegPath: path.ffmpegPath,
			});
			console.log("function generate_thumbnail is called: ", result);
		} catch (error) {
			console.log(error);
		}

		setIsLoading(false);
	};

	return (
		<main className="container min-h-svh p-1 bg-red-300">
			<Card>
				<CardContent>
					<form className="grid gap-4">
						<div className="flex gap-2">
							<Input
								type="text"
								placeholder="select ffmpeg version"
								defaultValue={path.ffmpegPath}
							/>
							<Button type="button" onClick={selectBinFile}>
								select bin
							</Button>
						</div>
						<div className="flex gap-2">
							<Input
								type="text"
								placeholder="select video file"
								defaultValue={path.sourceFile}
							/>
							<Button type="button" onClick={selectFile}>
								select file
							</Button>
						</div>
						<div className="flex gap-2">
							<Input
								type="text"
								placeholder="location to save files"
								defaultValue={path.destination}
							/>
							<Button type="button" onClick={whereToSave}>
								save file
							</Button>
						</div>
						<Button type="button" onClick={genThumbnail} disabled={isLoading}>
							{isLoading ? <LoaderCircleIcon className="animate-spin" /> : null}
							generate thumbnails
						</Button>
					</form>
				</CardContent>
			</Card>
		</main>
	);
}

export default App;
