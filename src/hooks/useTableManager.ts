import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from '../context/SnackbarContext/useSnackbar';
import { useDialog } from '../context/DialogContext/useDialog';
import { parseSnapshot, readSnapshot, STORAGE_KEY, validCell } from '../utils/tableStorage';

export const useTableManager = () => {
  const { showSnackbar } = useSnackbar();
  const { showConfirm } = useDialog();
  const [initial] = useState(readSnapshot);
  const [table, setTable] = useState(initial.snapshot);
  const [storageBlocked, setStorageBlocked] = useState(!!initial.error);
  const [storageError, setStorageError] = useState<string | null>(initial.error);
  const { columns, rows } = table;
  useEffect(() => {
    if (storageBlocked) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(table));
      // Clear only storage failures, never overwrite corrupt source data automatically.
    } catch { showSnackbar('השמירה בדפדפן נכשלה. יש לייצא גיבוי לפני סגירת הדף.', 'error'); }
  }, [table, storageBlocked, showSnackbar]);

  const addColumn = useCallback((raw: string) => {
    const title = raw.trim();
    if (!title || title.length > 15 || columns.some(c => c.title === title) || columns.length >= 100) {
      showSnackbar('שם עמודה ריק, כפול או ארוך מדי, או שהגעת למגבלת העמודות', 'error'); return;
    }
    setTable(t => ({ ...t, columns: [...t.columns, { id: 'col_' + crypto.randomUUID(), title, type: 'text', maxLength: 30, isSystem: false }] }));
  }, [columns, showSnackbar]);
  const updateColumnTitle = useCallback((id: string, raw: string) => {
    const title = raw.trim(), col = columns.find(c => c.id === id);
    if (!col || col.isSystem || !title || title.length > 15 || columns.some(c => c.id !== id && c.title === title)) {
      showSnackbar('לא ניתן לשנות את שם העמודה לערך זה', 'error'); return;
    }
    setTable(t => ({ ...t, columns: t.columns.map(c => c.id === id ? { ...c, title } : c) }));
    showSnackbar('שם העמודה עודכן', 'success');
  }, [columns, showSnackbar]);
  const deleteColumn = useCallback(async (id: string) => {
    if (columns.find(c => c.id === id)?.isSystem) return;
    if (!await showConfirm('מחיקת העמודה תמחק את הנתונים שלה. להמשיך?')) return;
    setTable(t => ({
      ...t, columns: t.columns.filter(c => c.id !== id),
      rows: t.rows.map(row => ({ ...row, data: Object.fromEntries(Object.entries(row.data).filter(([key]) => key !== id)) })),
    }));
  }, [columns, showConfirm]);
  const addRow = useCallback(() => {
    setTable(t => t.rows.length >= 10000 ? t : ({ ...t, rows: [...t.rows, { id: 'row_' + crypto.randomUUID(), isSaved: false, data: {} }] }));
  }, []);
  const editRow = useCallback((id: string) => {
    setTable(t => ({ ...t, rows: t.rows.map(r => r.id === id ? { ...r, isSaved: false } : r) }));
  }, []);
  const saveRow = useCallback((id: string) => {
    const row = rows.find(r => r.id === id);
    if (!row || columns.some(c => (c.required && !row.data[c.id]?.trim()) || !validCell(row.data[c.id] || '', c))) {
      showSnackbar('יש להשלים את שדות החובה ולתקן ערכים לא תקינים', 'error'); return;
    }
    setTable(t => ({ ...t, rows: t.rows.map(r => r.id === id ? { ...r, isSaved: true } : r) }));
    showSnackbar('השורה נשמרה בטבלה; השמירה בדפדפן מתבצעת אוטומטית', 'success');
  }, [rows, columns, showSnackbar]);
  const updateCell = useCallback((rowId: string, colId: string, value: string) => {
    const col = columns.find(c => c.id === colId);
    if (!col || !validCell(value, col)) return;
    setTable(t => ({ ...t, rows: t.rows.map(r => r.id === rowId ? { ...r, data: { ...r.data, [colId]: value } } : r) }));
  }, [columns]);
  const deleteRow = useCallback(async (id: string) => {
    if (await showConfirm('למחוק את השורה?')) setTable(t => ({ ...t, rows: t.rows.filter(r => r.id !== id) }));
  }, [showConfirm]);
  const exportTable = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(table, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'user-table.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const importTable = async (file: File) => {
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('הקובץ גדול מדי (עד 5MB)');
      const snapshot = parseSnapshot(await file.text());
      if (!await showConfirm('ייבוא יחליף את הטבלה הנוכחית. להמשיך?')) return;
      setTable(snapshot); setStorageBlocked(false); setStorageError(null);
      showSnackbar('הגיבוי יובא', 'success');
    } catch (error) { showSnackbar(error instanceof Error ? error.message : 'הייבוא נכשל', 'error'); }
  };
  return { columns, rows, addColumn, addRow, updateColumnTitle, deleteColumn, editRow, saveRow,
    updateCell, deleteRow, exportTable, importTable, storageError };
};
