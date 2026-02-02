import React from "react";
import { useTableManager } from "../../hooks/useTableManager";
import { TableRow } from "../TableRow/TableRow";
import { ColumnHeader } from "../ColumnHeader/ColumnHeader";
import styles from "./UserTable.module.css";

export const UserTable: React.FC = () => {
  const {
    columns,
    rows,
    addRow,
    addColumn,
    updateCell,
    saveRow,
    editRow,
    deleteRow,
    updateColumnTitle,
    deleteColumn,
  } = useTableManager();

  const handleAddColumn = () => {
    const title = prompt("הכנס שם לעמודה חדשה");
    if (title) addColumn(title);
  };

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <ColumnHeader
                key={col.id}
                column={col}
                onRename={updateColumnTitle}
                onDelete={deleteColumn}
              />
            ))}
            <th className={styles.addColumnHeader}>
              <button
                onClick={handleAddColumn}
                className={styles.circleBtn}
                title="הוסף עמודה"
              >
                +
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              row={row}
              columns={columns}
              onUpdate={updateCell}
              onSave={saveRow}
              onEdit={editRow}
              onDelete={deleteRow}
            />
          ))}
        </tbody>
      </table>
      <div className={styles.addRowContainer}>
        <button onClick={addRow} className={styles.addRecordBtn}>
          + הוסף משתמש חדש
        </button>
      </div>
    </div>
  );
};
