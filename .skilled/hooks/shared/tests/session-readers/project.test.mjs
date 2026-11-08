// ───────────────────────────────────────────────────────────────────
// MODULE: Projection Tests
// ───────────────────────────────────────────────────────────────────
// The projection owns the entry-list contract: one stable id per entry, a
// zero-based sequence, an ISO timestamp, role-discriminated blocks and paired
// tool results. When the shared schema is published, the same suite validates
// every projected item against it instead of a hand-maintained fixture.

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import Ajv2020 from 'ajv/dist/2020.js';

import {
  PROJECTION_ERRORS,
  isoOr,
  projectEntries,
  textBlock,
  toolCallBlock,
} from '../../session-readers/project.mjs';

const REPO_ROOT = fileURLToPath(new URL('../../../../../', import.meta.url));
const SCHEMA_PATH = join(
  REPO_ROOT,
  '.skilled',
  'skills',
  'system-spec-kit',
  'runtime',
  'hooks',
  'lib',
  'history',
  'history-entry.schema.json',
);

function record(id, role, content, extra = {}) {
  return { id, role, timestamp: '2026-11-07T12:00:00.000Z', content, ...extra };
}

function pairedEntries() {
  return [
    record('u1', 'user', [textBlock('Read the file.')]),
    record('a1', 'assistant', [textBlock('Reading it now.'), toolCallBlock({ id: 'call-1', name: 'read', arguments: { path: 'file.txt' } })]),
    record('r1', 'toolResult', [textBlock('file contents')], { toolCallId: 'call-1' }),
    record('a2', 'assistant', [textBlock('The file holds one line.')]),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. PROJECTION CONTRACT
// ─────────────────────────────────────────────────────────────────────────────

test('the projection assigns id, role, sequence, timestamp and paired tool results', () => {
  const result = projectEntries(pairedEntries());
  assert.equal(result.ok, true);
  assert.deepEqual(result.items.map((item) => item.id), ['u1', 'a1', 'r1', 'a2']);
  assert.deepEqual(result.items.map((item) => item.sequence), [0, 1, 2, 3]);
  assert.deepEqual(result.items.map((item) => item.role), ['user', 'assistant', 'toolResult', 'assistant']);
  for (const item of result.items) {
    assert.equal(typeof item.id, 'string');
    assert.equal(Number.isInteger(item.sequence), true);
    assert.equal(Number.isNaN(Date.parse(item.timestamp)), false);
  }
  assert.equal(result.items[2].toolCallId, 'call-1');
});

test('an orphan tool result is rejected', () => {
  const result = projectEntries([
    record('u1', 'user', [textBlock('Hello')]),
    record('r1', 'toolResult', [textBlock('unowned')], { toolCallId: 'call-1' }),
  ]);
  assert.deepEqual(result, { ok: false, reason: PROJECTION_ERRORS.ORPHAN_TOOL_RESULT });
});

test('a duplicate tool result is rejected', () => {
  const result = projectEntries([
    record('a1', 'assistant', [toolCallBlock({ id: 'call-1', name: 'read', arguments: {} })]),
    record('r1', 'toolResult', [textBlock('once')], { toolCallId: 'call-1' }),
    record('r2', 'toolResult', [textBlock('twice')], { toolCallId: 'call-1' }),
  ]);
  assert.deepEqual(result, { ok: false, reason: PROJECTION_ERRORS.DUPLICATE_TOOL_RESULT });
});

test('a mismatched tool result is rejected', () => {
  const result = projectEntries([
    record('a1', 'assistant', [toolCallBlock({ id: 'call-1', name: 'read', arguments: {} })]),
    record('r1', 'toolResult', [textBlock('other')], { toolCallId: 'call-2' }),
  ]);
  assert.deepEqual(result, { ok: false, reason: PROJECTION_ERRORS.MISMATCHED_TOOL_RESULT });
});

test('a duplicate tool call is rejected', () => {
  const result = projectEntries([
    record('a1', 'assistant', [toolCallBlock({ id: 'call-1', name: 'read', arguments: {} })]),
    record('r1', 'toolResult', [textBlock('once')], { toolCallId: 'call-1' }),
    record('a2', 'assistant', [toolCallBlock({ id: 'call-1', name: 'read', arguments: {} })]),
  ]);
  assert.deepEqual(result, { ok: false, reason: PROJECTION_ERRORS.DUPLICATE_TOOL_CALL });
});

test('an incomplete tool turn in the middle of a list is rejected', () => {
  const result = projectEntries([
    record('a1', 'assistant', [toolCallBlock({ id: 'call-1', name: 'read', arguments: {} })]),
    record('u1', 'user', [textBlock('Interrupting.')]),
  ]);
  assert.deepEqual(result, { ok: false, reason: PROJECTION_ERRORS.INCOMPLETE_TOOL_RESULTS });
});

test('a tool turn still streaming at the end of the file is accepted', () => {
  const result = projectEntries([
    record('u1', 'user', [textBlock('Read the file.')]),
    record('a1', 'assistant', [toolCallBlock({ id: 'call-1', name: 'read', arguments: {} })]),
  ]);
  assert.equal(result.ok, true);
  assert.equal(result.items.length, 2);
});

test('a duplicate entry id is rejected', () => {
  const result = projectEntries([
    record('same', 'user', [textBlock('one')]),
    record('same', 'user', [textBlock('two')]),
  ]);
  assert.deepEqual(result, { ok: false, reason: PROJECTION_ERRORS.DUPLICATE_ENTRY_ID });
});

test('an out-of-range numeric timestamp falls back instead of failing the read', () => {
  assert.equal(isoOr(1e20, 'fallback'), 'fallback');
  assert.equal(isoOr(8_640_000_000_000_001, 'fallback'), 'fallback');

  const result = projectEntries([
    record('u1', 'user', [textBlock('Hello')], { timestamp: 1e20 }),
  ]);
  assert.equal(result.ok, true);
  assert.equal(result.items[0].timestamp, new Date(0).toISOString());
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. PUBLISHED SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

if (!existsSync(SCHEMA_PATH)) {
  test('schema: not published', { skip: 'history-entry.schema.json has not been published yet' }, () => {});
} else {
  const schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'));
  const validateItem = new Ajv2020({ allErrors: true, strict: false }).compile(schema);

  test('schema: valid', () => {
    const result = projectEntries(pairedEntries());
    assert.equal(result.ok, true);
    for (const item of result.items) {
      const valid = validateItem(item);
      assert.equal(valid, true, `item ${item.id} does not conform: ${JSON.stringify(validateItem.errors)}`);
    }
    console.log('schema: valid');
  });
}
