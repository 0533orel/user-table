import type { ColumnTypes } from '../types/ColumnTypes';
import type { UserRowTypes } from '../types/UserRowTypes';
export const STORAGE_KEY = 'user-table-v1';
export const DEFAULT_COLUMNS: ColumnTypes[] = [
  { id: 'name', title: 'שם מלא', type: 'text', maxLength: 20, isSystem: true, required: true },
  { id: 'phone', title: 'מספר פלאפון', type: 'number', maxLength: 10, isSystem: true, required: true },
  { id: 'idCard', title: 'תעודת זהות', type: 'number', maxLength: 9, isSystem: true, required: true },
];
export type Snapshot = { version: 1; columns: ColumnTypes[]; rows: UserRowTypes[] };
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const safeId = (v: unknown): v is string => typeof v === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(v) && !['__proto__', 'constructor', 'prototype'].includes(v);
export function validCell(value: string, column: ColumnTypes) {
  return value.length <= column.maxLength && (column.type !== 'number' || /^\d*$/.test(value));
}
export function parseSnapshot(raw: string): Snapshot {
  const data: unknown = JSON.parse(raw);
  if (!object(data) || data.version !== 1 || !Array.isArray(data.columns) || !Array.isArray(data.rows)
      || data.columns.length > 100 || data.rows.length > 10000) throw new Error('קובץ טבלה לא תקין');
  const ids = new Set<string>(), titles = new Set<string>();
  const columns = data.columns.map((v: unknown): ColumnTypes => {
    if (!object(v) || !safeId(v.id) || typeof v.title !== 'string' || !v.title.trim()
      || v.title !== v.title.trim() || v.title.length > 30 || ids.has(v.id) || titles.has(v.title)
      || !['text','number'].includes(String(v.type)) || !Number.isInteger(v.maxLength)
      || Number(v.maxLength) < 1 || Number(v.maxLength) > 1000 || typeof v.isSystem !== 'boolean'
      || (v.required !== undefined && typeof v.required !== 'boolean')) throw new Error('עמודות לא תקינות');
    ids.add(v.id); titles.add(v.title);
    return { id: v.id, title: v.title, type: v.type as 'text' | 'number', maxLength: Number(v.maxLength), isSystem: v.isSystem, required: v.required as boolean | undefined };
  });
  for (const system of DEFAULT_COLUMNS) {
    const column = columns.find(c => c.id === system.id);
    if (!column || column.title !== system.title || column.type !== system.type || column.maxLength !== system.maxLength || !column.isSystem || !column.required)
      throw new Error('עמודות המערכת חסרות או שונו');
  }
  if (columns.some(c => c.isSystem && !DEFAULT_COLUMNS.some(s => s.id === c.id))) throw new Error('עמודת מערכת לא מוכרת');
  const rowIds = new Set<string>();
  const rows = data.rows.map((v: unknown): UserRowTypes => {
    if (!object(v) || !safeId(v.id) || rowIds.has(v.id) || typeof v.isSaved !== 'boolean' || !object(v.data)) throw new Error('שורות לא תקינות');
    rowIds.add(v.id);
    const values: Record<string, string> = {};
    for (const [key, value] of Object.entries(v.data)) {
      const column = columns.find(c => c.id === key);
      if (!column || typeof value !== 'string' || !validCell(value, column)) throw new Error('תא לא תקין');
      values[key] = value;
    }
    if (v.isSaved && columns.some(c => c.required && !values[c.id]?.trim())) throw new Error('שדה חובה חסר');
    return { id: v.id, isSaved: v.isSaved, data: values };
  });
  return { version: 1, columns, rows };
}
export function readSnapshot(): { snapshot: Snapshot; error: string | null } {
  const empty: Snapshot = { version: 1, columns: DEFAULT_COLUMNS, rows: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return { snapshot: raw !== null ? parseSnapshot(raw) : empty, error: null };
  } catch {
    return { snapshot: empty, error: 'לא ניתן לקרוא את השמירה המקומית. המקור לא נדרס; אפשר לייבא גיבוי תקין.' };
  }
}
