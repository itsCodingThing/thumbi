import { createContext, type Dispatch } from "react";
import type { Action } from "@/components/select-source-file/reducer";

export interface SourceFileInfo {
  path: string;
}

interface SourceFileState {
  sourceFile: SourceFileInfo;
  dispatch: Dispatch<Action>;
}

export const SelectSourceFileContext = createContext<SourceFileState | null>(
  null,
);
