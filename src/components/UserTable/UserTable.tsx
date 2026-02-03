import React from "react";
import { useTableManager } from "../../hooks/useTableManager";
import { TableHead } from "../TableHead/TableHead";
import { TableBody } from "../TableBody/TableBody";
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


  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <TableHead
        columns={columns}
        onRename={updateColumnTitle}
        onDelete={deleteColumn}
        onAddColumn={addColumn}
        />

        <TableBody
        rows={rows}
        columns={columns}
        onUpdate={updateCell}
        onSave={saveRow}
        onEdit={editRow}
        onDelete={deleteRow}
        />
      </table>
      <div className={styles.addRowContainer}>
        <button onClick={addRow} className={styles.addRecordBtn}>
          + הוסף משתמש חדש
        </button>
      </div>
    </div>
  );
};
