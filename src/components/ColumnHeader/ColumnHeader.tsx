import React, { useState } from "react";
import type { DynamicColumns } from "../../types/DynamicColumns";
import styles from "./ColumnHeader.module.css";

export const ColumnHeader: React.FC<DynamicColumns> = ({
  column,
  onRename,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(column.title);

  const handleSave = () => {
    if (tempTitle !== column.title) {
      onRename(column.id, tempTitle);
    }
    setIsEditing(false);
  };

  if (column.isSystem) {
    return (
      <th className={`${styles.headerCell} ${styles.systemHeader}`}>
        <div className={styles.displayContainer}>
          <span className={styles.title}>{column.title}</span> 
        </div>
      </th>
    );
  }

  return (
    <th className={styles.headerCell}>
      {isEditing ? (
        <div className={styles.editContainer}>
          <input
            className={styles.input}
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            autoFocus
          />
          <div className={styles.miniActions}>
            <button
              onClick={handleSave}
              className={styles.iconBtn}
              title="שמור"
            >
              ✅
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className={styles.iconBtn}
              title="ביטול"
            >
              ❌
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.displayContainer}>
          <span className={styles.title}>{column.title}</span>

          <div className={styles.actions}>
            <button
              onClick={() => { setTempTitle(column.title); setIsEditing(true); }}
              className={styles.iconBtn}
              title="שנה שם"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(column.id)}
              className={`${styles.iconBtn} ${styles.danger}`}
              title="מחק עמודה"
            >
              🗑️
            </button>
          </div>
        </div>
      )}
    </th>
  );
};
