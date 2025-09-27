import { useContext, useMemo, useReducer, type ReactNode } from "react";
import {
  SelectSourceFileContext,
  type SourceFileInfo,
} from "@/components/select-source-file/context";
import reducer from "@/components/select-source-file/reducer";

interface ProviderProps {
  children: ReactNode;
}

const initialState: SourceFileInfo = {
  path: "",
};

export function useSelectSourceFile() {
  const context = useContext(SelectSourceFileContext);

  if (!context) {
    throw new Error(
      "useSelectSourceFile must be used within a SelectSourceFileProvier",
    );
  }

  return context;
}

export default function SelectSourceFileProvier({ children }: ProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <SelectSourceFileContext.Provider value={value}>
      {children}
    </SelectSourceFileContext.Provider>
  );
}
