import type { ColumnTypes } from "./ColumnTypes";

export interface DynamicColumns {
  column: ColumnTypes;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}
