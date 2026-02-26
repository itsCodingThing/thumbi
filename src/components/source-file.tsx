import { atom, useAtom } from "jotai";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fileOpen } from "@/lib/file-dialog";
import { type FileInfo, probeVideo } from "@/lib/ffmpeg";
import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FolderUploadIcon } from "@/components/icons";

interface SourceFileState {
	filePath: string;
	fileInfo: FileInfo | null;
}

const sourceFile = atom<SourceFileState>({
	filePath: "",
	fileInfo: null,
});

export function useSourceFile() {
	return useAtom(sourceFile);
}

export default function SourceFile() {
	const [sourceFile, setSourceFile] = useSourceFile();
	const [isPending, startTransition] = useTransition();

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
					const result = await probeVideo(blob);

					setSourceFile((file) => ({ ...file, fileInfo: result }));
				} catch (error) {
					toast.error(`unable to probe file: ${error}`);
				}
			});

			setSourceFile((file) => ({ ...file, filePath: blob }));
		} catch (error) {
			toast.error(`unable to select path: ${error}`);
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<Card>
				<CardHeader>
					<CardTitle>File Info</CardTitle>
					<CardDescription>basic stats of selected file</CardDescription>

					{sourceFile.filePath && (
						<CardAction>
							<Button className="cursor-pointer" onClick={selectFile}>
								<FolderUploadIcon />
								Change
							</Button>
						</CardAction>
					)}
				</CardHeader>
				<CardContent>
					{isPending ? (
						<p>loading file info....</p>
					) : sourceFile.fileInfo ? (
						<>
							<p>name: {sourceFile.fileInfo.format.filename}</p>
							<p>size: {sourceFile.fileInfo.format.size} MB</p>
							<p>duration: {sourceFile.fileInfo.format.duration} Min</p>
							<p>fps: {sourceFile.fileInfo.format.fps}</p>
						</>
					) : (
						<div className="flex flex-col gap-2">
							<Input
								disabled
								type="text"
								placeholder="select video file"
								defaultValue={sourceFile.filePath}
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
					<div className="flex items-center gap-2">
						<Label htmlFor="gpu">GPU</Label>
						<Switch id="gpu" className="cursor-pointer" />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
