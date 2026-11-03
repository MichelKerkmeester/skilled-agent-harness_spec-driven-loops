// ───────────────────────────────────────────────────────────────────
// MODULE: Decision Capture Runtime Coverage Tests
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const RUNTIMES = ['Claude', 'Codex', 'Cursor', 'Devin', 'OpenCode', 'Pi'];
const EXPECTED_NO_SURFACE = [];
const README_PATH = process.env.DECISION_CAPTURE_README_PATH
  ?? fileURLToPath(new URL('../../README.md', import.meta.url));
const VALID_REASON_STATES = /^(?:by-design: |n\/a: |~ partial: |unverified: )\S(?:.*\S)?$/;

function checkRuntimeRow(row) {
  const cells = row.trim().split('|').slice(1, -1).map((cell) => cell.trim());
  const runtimeCells = cells.slice(1);
  const violations = [];

  if (runtimeCells.length !== RUNTIMES.length) {
    violations.push(`expected ${RUNTIMES.length} runtime cells, found ${runtimeCells.length}`);
  }

  runtimeCells.forEach((cell, index) => {
    if (cell === '✓ covered' || VALID_REASON_STATES.test(cell)) return;

    const runtime = RUNTIMES[index] ?? `cell ${index + 1}`;
    violations.push(`${runtime} cell must be covered or include a known state and a non-empty reason: ${cell}`);
  });

  const noSurfaceRuntimes = runtimeCells.flatMap((cell, index) => (
    cell.startsWith('n/a:') ? [RUNTIMES[index]] : []
  ));

  return { runtimeCells, violations, noSurfaceRuntimes };
}

function makeRow(runtimeCells) {
  return `| \`decision-capture\` | ${runtimeCells.join(' | ')} |`;
}

test('the README decision-capture row follows the runtime-cell convention', () => {
  const readme = readFileSync(README_PATH, 'utf8');
  const lines = readme.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => (
    line.trim() === '| Concern | Claude | Codex | Cursor | Devin | OpenCode | Pi |'
  ));
  const row = lines.slice(headerIndex + 2).find((line) => line.startsWith('| `decision-capture` |'));

  assert.notEqual(headerIndex, -1, 'README must contain the runtime coverage table');
  assert.ok(row, 'README must contain the decision-capture coverage row');

  const result = checkRuntimeRow(row);
  assert.deepEqual(result.violations, []);
  assert.equal(result.runtimeCells.length, 6);
  assert.deepEqual(result.noSurfaceRuntimes, EXPECTED_NO_SURFACE);
});

test('a bare n/a state is rejected', () => {
  const result = checkRuntimeRow(makeRow([
    '✓ covered', 'n/a', '✓ covered', '✓ covered', '✓ covered', '✓ covered',
  ]));

  assert.equal(result.violations.length, 1);
});

test('n/a with an empty reason is rejected', () => {
  const result = checkRuntimeRow(makeRow([
    '✓ covered', 'n/a: ', '✓ covered', '✓ covered', '✓ covered', '✓ covered',
  ]));

  assert.equal(result.violations.length, 1);
});

test('an unknown state is rejected', () => {
  const result = checkRuntimeRow(makeRow([
    '✓ covered', 'unsupported: no question tool', '✓ covered', '✓ covered', '✓ covered', '✓ covered',
  ]));

  assert.equal(result.violations.length, 1);
});

test('a row with five runtime cells is rejected', () => {
  const result = checkRuntimeRow(makeRow([
    '✓ covered', '✓ covered', '✓ covered', '✓ covered', '✓ covered',
  ]));

  assert.deepEqual(result.violations, ['expected 6 runtime cells, found 5']);
});

test('a valid n/a cell passes and is reported as no-surface', () => {
  const result = checkRuntimeRow(makeRow([
    '✓ covered', 'n/a: no question tool', '✓ covered', '✓ covered', '✓ covered', '✓ covered',
  ]));

  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.noSurfaceRuntimes, ['Codex']);
});
