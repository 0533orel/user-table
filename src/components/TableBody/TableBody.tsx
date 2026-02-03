import React from 'react';
import { TableRow } from '../TableRow/TableRow';
import type { TableBodyTypes } from '../../types/TableBodyTypes';


export const TableBody: React.FC<TableBodyTypes> = ({ 
  rows, 
  columns, 
  onUpdate, 
  onSave, 
  onEdit, 
  onDelete 
}) => {
  return (
    <tbody>
      {rows.map((row) => (
        <TableRow
          key={row.id}
          row={row}
          columns={columns}
          onUpdate={onUpdate}
          onSave={onSave}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </tbody>
  );
};