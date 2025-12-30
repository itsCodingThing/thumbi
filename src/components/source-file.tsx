import { atom, useAtom } from "jotai";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fileOpen } from "@/lib/file-dialog";
import { probeVideo } from "@/lib/ffmpeg";

const sourceFilePath = atom("");

export function useSourceFilePath() {
	return useAtom(sourceFilePath);
}

export default function SourceFile() {
	const [sourcePath, setSourcePath] = useSourceFilePath();

	const selectFile = async () => {
		try {
			const blob = await fileOpen({
				multiple: false,
				directory: false,
			});

			if (!blob) {
				throw new Error("no path");
			}

			const result = await probeVideo(blob);
			console.log(result);

			setSourcePath(blob);
		} catch (error) {
			toast.error("unable to select path");
			console.log(error);
		}
	};

	return (
		<Card>
			<CardContent>
				<div className="flex flex-col gap-2">
					<Input
						disabled
						type="text"
						placeholder="select video file"
						defaultValue={sourcePath}
					/>
					<Button onClick={selectFile} className="cursor-pointer" type="button">
						select file
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
