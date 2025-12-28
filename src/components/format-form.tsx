import { useState, useTransition } from "react";
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
import { useSourceFile } from "@/components/select-source-file/proiver";
import { fileSave } from "@/lib/file-dialog";

export default function FormatForm() {
  const { sourceFile } = useSourceFile();
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
        <form className="grid grid-cols-2 gap-2">
          <Input
            disabled
            className="col-span-2"
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
            disabled={isPending}
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
