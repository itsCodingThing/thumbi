import type { SourceFileInfo } from "@/components/select-source-file/context";

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? { type: Key }
    : { type: Key; payload: M[Key] };
}[keyof M];

type Payload = {
  UPDATE_PATH: { path: string };
  REMOVE_TODO: { id: string };
};

export type Action = ActionMap<Payload>;

export default function reducer(
  state: SourceFileInfo,
  action: Action,
): SourceFileInfo {
  switch (action.type) {
    case "UPDATE_PATH": {
      return { ...state, path: action.payload.path };
    }
    default:
      return state;
  }
}
