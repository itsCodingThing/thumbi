import { useState } from "react";
import { open as fileOpen } from "@tauri-apps/plugin-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useFullScreenLoader } from "@/components/full-screen-loader";
import { useSourceFile } from "@/components/source-file";
import { generateThumbnails } from "@/lib/ffmpeg";
import { Slider } from "@/components/ui/slider";

export default function ThumbnailForm() {
	const { setScreenLoader } = useFullScreenLoader();
	const [sourceFile] = useSourceFile();
	const [destination, setDestination] = useState("");
	const [thumbs, setThumbs] = useState(0);

	const whereToSave = async () => {
		const blob = await fileOpen({
			directory: true,
			multiple: false,
			title: "Select folder to save files in",
		});

		if (!blob) {
			throw new Error("select path where to save");
		}

		setDestination(blob);
	};

	const genThumbnail = async () => {
		setScreenLoader(true);
		await generateThumbnails(sourceFile.filePath, destination, {
			count: thumbs,
		});
		setScreenLoader(false);
	};

	return (
		<Card>
			<CardContent>
				<div className="grid grid-cols-2 gap-2">
					{sourceFile.fileInfo ? (
						<div className="col-span-2 flex gap-2 cursor-pointer">
							<Slider
								className="w-full"
								min={1}
								max={100}
								defaultValue={[thumbs]}
								onValueChange={(val) => {
									setThumbs(val[0]);
								}}
							/>
							<span>{thumbs}</span>
						</div>
					) : null}
					<Input
						disabled
						type="text"
						placeholder="select where to store"
						defaultValue={destination}
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
