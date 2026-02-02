import type { ColumnTypes } from "./ColumnTypes";
import type { UserRowTypes } from "./UserRowTypes";


export interface DynamicRows {
  row: UserRowTypes;
  columns: ColumnTypes[];
  onUpdate: (
    rowId: string,
    couId: string,
    val: string,
    type: "text" | "number",
    max: number
  ) => void;
  onSave: (rowId: string) => void;
  onEdit: (rowId: string) => void;
  onDelete: (rowId: string) => void;
}
