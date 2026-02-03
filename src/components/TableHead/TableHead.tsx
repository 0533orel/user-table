import React from 'react';
import { ColumnHeader } from '../ColumnHeader/ColumnHeader';
import styles from './TableHead.module.css'; 
import type { ColumnTypes } from '../../types/ColumnTypes';
import { useDialog } from '../../context/DialogContext/DialogContext';

interface TableHeadProps {
  columns: ColumnTypes[];
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onAddColumn: (title: string) => void;
}

export const TableHead: React.FC<TableHeadProps> = ({ columns, onRename, onDelete, onAddColumn }) => {
  const { showPrompt } = useDialog();

  const handleAddClick = async () => {
    const title = await showPrompt("הכנס שם לעמודה חדשה:");
    
    if (title) {
      onAddColumn(title);
    }
  };

  return (
    <thead>
      <tr>
        {columns.map((col) => (
          <ColumnHeader
            key={col.id}
            column={col}
            onRename={onRename}
            onDelete={onDelete}
          />
        ))}
        <th className={styles.addColumnHeader}>
          <button
            onClick={handleAddClick}
            className={styles.circleBtn}
            title="הוסף עמודה"
          >
            +
          </button>
        </th>
      </tr>
    </thead>
  );
};