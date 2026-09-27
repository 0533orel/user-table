import React from "react";
import styles from "./TableRow.module.css";
import type { DynamicRows } from "../../types/DynamicRows";

export const TableRow = React.memo(
  ({ row, columns, onUpdate, onSave, onEdit, onDelete }: DynamicRows) => {

    return (
      <tr className={row.isSaved ? styles.readOnlyRow : styles.editingRow}>
        {columns.map((col) => (
          <td key={col.id} className={styles.cell}>
            {row.isSaved ? (
              <span className={styles.text}>{row.data[col.id || "-"]}</span>
            ) : (
              <input
                type={col.type === "number" ? "tel" : "text"}
                className={styles.input}
                value={row.data[col.id] || ""}
                onChange={(e) =>
                  onUpdate(
                    row.id,
                    col.id,
                    e.target.value,
                    col.type,
                    col.maxLength,
                  )
                }
                placeholder={`הכנס ${col.title}`}
              />
            )}
          </td>
        ))}
        <td className={styles.actionCell}>
          <div className={styles.actionsContainer}>
            {row.isSaved ? (
            <button onClick={() => onEdit(row.id)} className={styles.editBtn} title="ערוך">
              ✏️
            </button>
          ) : (
            <button onClick={() => onSave(row.id)} className={styles.saveBtn} title="שמור">
              💾
            </button>
          )}

          <button onClick={() => onDelete(row.id)} className={styles.deleteBtn} title="מחק">
            🗑️
          </button>
          </div>
        </td>
      </tr>
    );
  },
);
