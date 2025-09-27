import { useState, useTransition } from "react";
import { save as fileSave } from "@tauri-apps/plugin-dialog";

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
import { useSelectSourceFile } from "@/components/select-source-file/proiver";

function FormatSelector({ onChange }: { onChange(f: VideoFormat): void }) {
	return (
		<Select
			onValueChange={(v) => {
				if (isSupportedVideoFormat(v)) {
					onChange(v);
				}
			}}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Format" />
			</SelectTrigger>
			<SelectContent>
				{SupportedVideoFormats.map((f) => (
					<SelectItem value={f} key={f}>
						{f}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export default function FormatForm() {
	const { state: sourceFile } = useSelectSourceFile();
	const [path, setPath] = useState("");
	const [format, setFormat] = useState<VideoFormat>("mp4");
	const [isPending, startTransition] = useTransition();

	const selectSave = async () => {
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

		setPath(blob);
	};

	const change = () => {
		console.log("file format", format);
		console.log("save path", path);
		console.log("source path", sourceFile.path);

		startTransition(async () => {
			await changeFormat({
				source: sourceFile.path,
				destination: path,
				format,
			});
		});
	};

	return (
		<Card>
			<CardContent>
				<form className="grid gap-4">
					<div className="flex gap-2">
						<Input
							type="text"
							placeholder="select where to store"
							defaultValue={path}
						/>
						<Button
							className="cursor-pointer"
							type="button"
							onClick={selectSave}
						>
							select save
						</Button>
						<FormatSelector onChange={(f) => setFormat(f)} />
					</div>
					<Button
						disabled={isPending}
						className="cursor-pointer"
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
