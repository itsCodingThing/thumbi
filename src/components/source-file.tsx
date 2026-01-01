import { atom, useAtom } from "jotai";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fileOpen } from "@/lib/file-dialog";
import { type FileInfo, ffmpeg } from "@/lib/ffmpeg";
import { useTransition } from "react";

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
					const result = await ffmpeg.probeVideo(blob);

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
				<CardContent>
					{isPending ? (
						<p>loading file info....</p>
					) : sourceFile.fileInfo ? (
						<>
							<p>name: {sourceFile.fileInfo.format.filename}</p>
							<p>size: {Number(sourceFile.fileInfo.format.size) / 1000} MB</p>
							<p>duration: {sourceFile.fileInfo.format.duration}</p>
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
					GPU <input type="checkbox" defaultChecked={true} />
				</CardContent>
			</Card>
		</div>
	);
}
