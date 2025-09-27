import { open as fileOpen } from "@tauri-apps/plugin-dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSelectSourceFile } from "@/components/select-source-file/proiver";

export default function SourceFile() {
	const { state, dispatch } = useSelectSourceFile();

	const selectFile = async () => {
		const blob = await fileOpen({
			multiple: false,
			directory: false,
		});

		if (blob) {
			dispatch({ type: "UPDATE_PATH", payload: { path: blob } });
		}
	};

	return (
		<Card>
			<CardContent>
				<div className="flex gap-2">
					<Input
						type="text"
						placeholder="select video file"
						defaultValue={state.path}
					/>
					<Button onClick={selectFile} className="cursor-pointer" type="button">
						select file
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
