import { atom, useAtom } from "jotai";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fileOpen } from "@/lib/file-dialog";
import { type FileInfo, ffmpeg } from "@/lib/ffmpeg";
import { useState, useTransition } from "react";

const sourceFilePath = atom("");

export function useSourceFilePath() {
	return useAtom(sourceFilePath);
}

export default function SourceFile() {
	const [sourcePath, setSourcePath] = useSourceFilePath();
	const [isPending, startTransition] = useTransition();
	const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

	const selectFile = async () => {
		try {
			const blob = await fileOpen({
				multiple: false,
				directory: false,
			});

			if (!blob) {
				throw new Error("no path");
			}

			startTransition(async () => {
				try {
					const result = await ffmpeg.probeVideo(blob);

					setFileInfo(result);
				} catch (error) {
					toast.error(`unable to probe file: ${error}`);
				}
			});

			setSourcePath(blob);
		} catch (error) {
			toast.error(`unable to select path: ${error}`);
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<Card>
				<CardContent>
					{isPending ? (
						<p>loading file info....</p>
					) : fileInfo ? (
						<>
							<p>name: {fileInfo.format.filename}</p>
							<p>size: {Number(fileInfo.format.size) / 1000} MB</p>
							<p>duration: {fileInfo.format.duration}</p>
						</>
					) : (
						<div className="flex flex-col gap-2">
							<Input
								disabled
								type="text"
								placeholder="select video file"
								defaultValue={sourcePath}
							/>
							<Button
								onClick={selectFile}
								className="cursor-pointer"
								type="button"
							>
								select file
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
			<Card>
				<CardContent>
					GPU <input type="checkbox" />
				</CardContent>
			</Card>
		</div>
	);
}
