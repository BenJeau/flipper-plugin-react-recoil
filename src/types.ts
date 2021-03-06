import { theme } from "flipper-plugin";

export enum AtomLoadableState {
  hasValue = "hasValue",
  loading = "loading",
  hasError = "hasError",
}

export const stateTagColor: Record<AtomLoadableState, string> = {
  hasError: theme.errorColor,
  hasValue: theme.textColorSecondary,
  loading: theme.warningColor,
};

export interface IncomingRowData {
  atom: string;
  date: string;
  content: any;
  state: AtomLoadableState;
}

export interface RowData extends IncomingRowData {
  id: string;
}

export type Selection = "logs" | "atoms";

export type PluginEvents = {
  newRow: IncomingRowData;
};
