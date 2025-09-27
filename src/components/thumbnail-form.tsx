import { useState, useTransition } from "react";
import { open as fileOpen } from "@tauri-apps/plugin-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { generateThumbnail } from "@/lib/ffmpeg";
import { useSelectSourceFile } from "@/components/select-source-file/proiver";

export default function ThumbnailForm() {
	const { state: sourceFile } = useSelectSourceFile();
	const [isPending, startTransition] = useTransition();
	const [path, setPath] = useState("");

	const whereToSave = async () => {
		const blob = await fileOpen({
			directory: true,
			multiple: false,
			title: "Select folder to save files in",
		});

		if (!blob) {
			throw new Error("select path where to save");
		}

		setPath(blob);
	};

	const genThumbnail = () => {
		console.log("thumbnail destination path", path);
		console.log("thumbnail source path", sourceFile.path);

		startTransition(async () => {
			await generateThumbnail(sourceFile.path, path);
		});
	};

	return (
		<Card>
			<CardContent>
				<div className="flex flex-col gap-2">
					<div className="flex gap-2">
						<Input
							type="text"
							placeholder="select where to store"
							defaultValue={path}
						/>
						<Button
							className="cursor-pointer"
							type="button"
							onClick={whereToSave}
						>
							select save
						</Button>
					</div>
					<Button
						className="cursor-pointer"
						type="button"
						onClick={genThumbnail}
						disabled={isPending}
					>
						generate thumbnails
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
