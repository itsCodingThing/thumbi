import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Spinner } from "./icons";

interface FullScreenLoaderProps {
  open: boolean;
}

export default function FullScreenLoader({ open }: FullScreenLoaderProps) {
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setOpenDialog(open);
  }, [open]);

  return (
    <Dialog open={openDialog}>
      <DialogContent className="w-fit" showCloseButton={false}>
        <Spinner />
      </DialogContent>
    </Dialog>
  );
}
