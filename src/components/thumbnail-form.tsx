import { useState } from "react";
import { open as fileOpen } from "@tauri-apps/plugin-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { generateThumbnail } from "@/lib/ffmpeg";
import { useSourceFile } from "@/components/select-source-file/proiver";
import { useFullScreenLoader } from "@/components/full-screen-loader";

export default function ThumbnailForm() {
	const { setScreenLoader } = useFullScreenLoader();
	const { sourceFile } = useSourceFile();
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

	const genThumbnail = async () => {
		setScreenLoader(true);
		await generateThumbnail(sourceFile.path, path);
		setScreenLoader(false);
	};

	return (
		<Card>
			<CardContent>
				<div className="grid grid-cols-2 gap-2">
					<Input
						disabled
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
					<Button
						className="cursor-pointer col-span-2"
						type="button"
						onClick={genThumbnail}
					>
						generate thumbnails
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
