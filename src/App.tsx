import "./App.css";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { open as fileOpen } from "@tauri-apps/plugin-dialog";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import FullScreenLoader from "./components/full-screen-loader";
import generateThumbnail from "./lib/generate-thumbnail";

function App() {
	const [isPending, startTransition] = useTransition();
	const [path, setPath] = useState({
		sourceFile: "",
		destination: "",
		ffmpegPath: "",
	});

	const selectFile = async () => {
		const blob = await fileOpen({
			multiple: false,
			directory: false,
		});

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

		if (!blob) {
			throw new Error("select path where to save");
		}

		setPath({ ...path, destination: blob });
	};

	const genThumbnail = async () => {
		startTransition(async () => {
			await whereToSave();
			await generateThumbnail(path.sourceFile, path.destination);
		});
	};

	return (
		<main className="container min-h-svh flex items-center justify-center bg-black">
			<FullScreenLoader open={isPending} />
			<Card>
				<CardContent>
					<form className="grid gap-4">
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
						<Button type="button" onClick={genThumbnail} disabled={isPending}>
							generate thumbnails
						</Button>
					</form>
				</CardContent>
			</Card>
		</main>
	);
}

export default App;
