import type { ColumnTypes } from "./ColumnTypes";

export interface TableHeadtypes {
  columns: ColumnTypes[];
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onAddColumn: (title: string) => void;
}
