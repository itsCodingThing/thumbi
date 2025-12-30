import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
	SupportedVideoFormats,
	type VideoFormat,
	changeFormat,
	isSupportedVideoFormat,
} from "@/lib/ffmpeg";
import { fileSave } from "@/lib/file-dialog";
import { toast } from "sonner";
import { useFullScreenLoader } from "@/components/full-screen-loader";
import { useSourceFilePath } from "@/components/source-file";

export default function FormatForm() {
	const { setScreenLoader } = useFullScreenLoader();
	const [sourcePath] = useSourceFilePath();
	const [destination, setDestination] = useState("");
	const [format, setFormat] = useState<VideoFormat>("mp4");

	const selectSave = async () => {
		try {
			const blob = await fileSave({
				filters: [
					{
						name: "Save File",
						extensions: SupportedVideoFormats.slice(),
					},
				],
			});

			if (!blob) {
				throw new Error("select path where to save");
			}

			setDestination(blob);
		} catch (error) {
			toast.error("unable to select destination path");
			console.log(error);
		}
	};

	const change = async () => {
		setScreenLoader(true);

		try {
			await changeFormat({
				source: sourcePath,
				destination: destination,
				format,
			});
		} catch (error) {
			toast.error("unable to change format");
			console.log(error);
		}

		setScreenLoader(false);
	};

	return (
		<Card>
			<CardContent>
				<form className="grid grid-cols-2 gap-2">
					<Input
						disabled
						className="col-span-2"
						type="text"
						placeholder="select where to store"
						defaultValue={destination}
					/>
					<Button className="cursor-pointer" type="button" onClick={selectSave}>
						select save
					</Button>
					<Select
						onValueChange={(v) => {
							if (isSupportedVideoFormat(v)) {
								setFormat(v);
							}
						}}
					>
						<SelectTrigger className="cursor-pointer w-full">
							<SelectValue placeholder="Format" />
						</SelectTrigger>
						<SelectContent>
							{SupportedVideoFormats.map((f) => (
								<SelectItem className="cursor-pointer" value={f} key={f}>
									{f}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						className="col-span-2 cursor-pointer"
						type="button"
						onClick={change}
					>
						change format
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
