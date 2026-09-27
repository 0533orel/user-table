import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_COLUMNS, parseSnapshot, readSnapshot, validCell } from '../src/utils/tableStorage.ts';
const sample = () => ({ version: 1, columns: structuredClone(DEFAULT_COLUMNS), rows: [
  { id: 'row_1', isSaved: true, data: { name: 'Demo', phone: '0123456789', idCard: '012345678' } },
] });
test('JSON round trip preserves leading zeros and dynamic columns', () => {
  const value = sample();
  value.columns.push({ id: 'custom', title: 'Department', type: 'text', maxLength: 30, isSystem: false });
  value.rows[0].data.custom = 'Sales';
  const result = parseSnapshot(JSON.stringify(value));
  assert.equal(result.rows[0].data.phone, '0123456789');
  assert.equal(result.rows[0].data.custom, 'Sales');
});
test('rejects corrupt JSON, missing system columns and duplicate IDs', () => {
  assert.throws(() => parseSnapshot('{'));
  const missing = sample(); missing.columns.shift();
  assert.throws(() => parseSnapshot(JSON.stringify(missing)));
  const duplicate = sample(); duplicate.rows.push(duplicate.rows[0]);
  assert.throws(() => parseSnapshot(JSON.stringify(duplicate)));
});
test('rejects schema tampering, invalid numbers and oversized values', () => {
  const changed = sample(); changed.columns[0].isSystem = false;
  assert.throws(() => parseSnapshot(JSON.stringify(changed)));
  for (const phone of ['1e5', '+123', '12.3', '12345678901']) {
    const changed = sample(); changed.rows[0].data.phone = phone;
    assert.throws(() => parseSnapshot(JSON.stringify(changed)));
    assert.equal(validCell(phone, DEFAULT_COLUMNS[1]), false);
  }
});
test('corrupt storage is reported without overwriting it', () => {
  let writes = 0;
  globalThis.localStorage = { getItem: () => '{broken', setItem: () => writes++ };
  const result = readSnapshot();
  assert.ok(result.error);
  assert.equal(writes, 0);
});
test('empty-string storage is corrupt, while a missing key starts an empty table', () => {
  globalThis.localStorage = { getItem: () => '' };
  assert.ok(readSnapshot().error);
  globalThis.localStorage = { getItem: () => null };
  assert.equal(readSnapshot().error, null);
});
test('saved rows require required values; drafts may be incomplete', () => {
  const value = sample(); delete value.rows[0].data.name;
  assert.throws(() => parseSnapshot(JSON.stringify(value)));
  value.rows[0].isSaved = false;
  assert.equal(parseSnapshot(JSON.stringify(value)).rows.length, 1);
});
