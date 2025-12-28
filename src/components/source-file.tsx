import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSourceFile } from "@/components/select-source-file/proiver";
import { toast } from "sonner";
import { fileOpen } from "@/lib/file-dialog";

export default function SourceFile() {
  const { sourceFile, dispatch } = useSourceFile();

  const selectFile = async () => {
    try {
      const blob = await fileOpen({
        multiple: false,
        directory: false,
      });

      if (!blob) {
        throw new Error("no path")
      }

      dispatch({ type: "UPDATE_PATH", payload: { path: blob } });
    } catch (error) {
      toast.error("unable to select path");
      console.log(error)
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
            defaultValue={sourceFile.path}
          />
          <Button onClick={selectFile} className="cursor-pointer" type="button">
            select file
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
