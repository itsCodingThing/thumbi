import { atom, useAtom } from "jotai";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Spinner } from "./icons";

const showFullScreenLoading = atom(false);

export function useFullScreenLoader() {
	const [showScreenLoader, setScreenLoader] = useAtom(showFullScreenLoading);
	return { showScreenLoader, setScreenLoader };
}

export default function FullScreenLoader() {
	const { showScreenLoader } = useFullScreenLoader();

	return (
		<Dialog open={showScreenLoader}>
			<DialogContent className="w-fit" showCloseButton={false}>
				<Spinner />
			</DialogContent>
		</Dialog>
	);
}
