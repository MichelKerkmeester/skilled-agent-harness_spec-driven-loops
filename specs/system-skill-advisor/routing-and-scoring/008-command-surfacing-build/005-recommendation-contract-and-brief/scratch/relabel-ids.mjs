#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Advisor id relabel
// ───────────────────────────────────────────────────────────────────
// Rewrites the four retired umbrella ids to their per-command ids inside
// JSON string values only. The change list records the file, row id and
// field of every changed value, never the value itself, so no corpus
// prompt is read out or printed.
// ───────────────────────────────────────────────────────────────────

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const RUNTIME_REL = '.skilled/skills/system-skill-advisor/runtime';
const LIST_NAME = 'relabel-list.txt';
const MAX_ROOT_WALK_DEPTH = 14;

const OLD_TO_NEW = new Map([
  ['command-spec-kit-plan', 'command-speckit-plan'],
  ['command-spec-kit-complete', 'command-speckit-complete'],
  ['command-spec-kit-implement', 'command-speckit-implement'],
  ['command-spec-kit-resume', 'command-speckit-resume'],
]);

const OLD_ID_TEST = /command-spec-kit-(?:plan|complete|implement|resume)\b/;
const OLD_ID_PATTERN = /command-spec-kit-(?:plan|complete|implement|resume)\b/g;

const TARGET_FILES = [
  'scripts/routing-accuracy/holdout-prompts.jsonl',
  'scripts/fixtures/gate2-golden-prompts.jsonl',
  'scripts/fixtures/skill-advisor-regression-cases.jsonl',
  'tests/parity/fixtures/local-native-approved-divergences.json',
];

// ───────────────────────────────────────────────────────────────────
// 2. PATH RESOLUTION
// ───────────────────────────────────────────────────────────────────

// Anchor every path to this module's own location. The probe is launched
// from arbitrary working directories, so a CWD-relative path would find
// the wrong checkout or nothing at all.
const scriptDir = dirname(fileURLToPath(import.meta.url));

function findRepoRoot() {
  let current = scriptDir;
  for (let depth = 0; depth < MAX_ROOT_WALK_DEPTH; depth += 1) {
    if (existsSync(join(current, RUNTIME_REL))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  return null;
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

// ───────────────────────────────────────────────────────────────────
// 3. VALUE RELABEL
// ───────────────────────────────────────────────────────────────────

// A field path names the value's position inside its row, so a reader can
// find the change without the old or new text being written down.
function formatFieldPath(segments) {
  let text = '';
  for (const segment of segments) {
    if (typeof segment === 'number') {
      text += `[${segment}]`;
    } else if (text === '') {
      text = segment;
    } else {
      text += `.${segment}`;
    }
  }
  return text;
}

// Walk every string value. Objects and arrays are rebuilt so the caller can
// serialize the result, while every non-string value is returned untouched.
function relabelNode(node, segments, rowId, changes) {
  if (typeof node === 'string') {
    const next = node.replace(OLD_ID_PATTERN, (match) => OLD_TO_NEW.get(match));
    if (next !== node) {
      changes.push({ rowId, field: formatFieldPath(segments) });
    }
    return next;
  }

  if (Array.isArray(node)) {
    return node.map((item, index) => relabelNode(item, [...segments, index], rowId, changes));
  }

  if (node !== null && typeof node === 'object') {
    const next = {};
    for (const [key, value] of Object.entries(node)) {
      next[key] = relabelNode(value, [...segments, key], rowId, changes);
    }
    return next;
  }

  return node;
}

// ───────────────────────────────────────────────────────────────────
// 4. FILE REWRITE
// ───────────────────────────────────────────────────────────────────

// One JSON object per line. A line without an old id is copied byte for
// byte. A line that changes must already round-trip exactly, otherwise the
// serializer would reformat fields the relabel does not own.
function processJsonl(filePath, changes) {
  const text = readFileSync(filePath, 'utf8');
  const lines = text.split('\n');

  const nextLines = lines.map((line) => {
    if (line === '' || !OLD_ID_TEST.test(line)) {
      return line;
    }

    const parsed = JSON.parse(line);
    const rowId = typeof parsed.id === 'string' ? parsed.id : 'UNKNOWN';

    if (JSON.stringify(parsed) !== line) {
      fail(`${basename(filePath)} row ${rowId} does not round-trip, refusing to reformat it`);
    }

    const rowChanges = [];
    const next = relabelNode(parsed, [], rowId, rowChanges);
    if (rowChanges.length === 0) {
      return line;
    }

    changes.push(...rowChanges.map((change) => ({ file: basename(filePath), ...change })));
    return JSON.stringify(next);
  });

  writeFileSync(filePath, nextLines.join('\n'), 'utf8');
}

// A single pretty-printed document. Each entry carries its own id, which is
// the row id a change belongs to.
function processJson(filePath, changes) {
  const text = readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(text);

  if (JSON.stringify(parsed, null, 2) + '\n' !== text) {
    fail(`${basename(filePath)} does not round-trip at two-space indent, refusing to reformat it`);
  }

  if (!Array.isArray(parsed.entries)) {
    fail(`${basename(filePath)} has no entries array`);
  }

  parsed.entries = parsed.entries.map((entry) => {
    const rowId = typeof entry?.id === 'string' ? entry.id : 'UNKNOWN';
    const rowChanges = [];
    const next = relabelNode(entry, [], rowId, rowChanges);
    changes.push(...rowChanges.map((change) => ({ file: basename(filePath), ...change })));
    return next;
  });

  writeFileSync(filePath, JSON.stringify(parsed, null, 2) + '\n', 'utf8');
}

// ───────────────────────────────────────────────────────────────────
// 5. MAIN
// ───────────────────────────────────────────────────────────────────

function main() {
  const root = findRepoRoot();
  if (root === null) {
    fail(`cannot find the advisor runtime above ${scriptDir}`);
  }

  const runtimeDir = join(root, RUNTIME_REL);
  const listPath = join(scriptDir, LIST_NAME);
  const changes = [];

  for (const relativePath of TARGET_FILES) {
    const filePath = join(runtimeDir, relativePath);
    if (!existsSync(filePath)) {
      fail(`missing target file ${relativePath}`);
    }

    if (relativePath.endsWith('.jsonl')) {
      processJsonl(filePath, changes);
    } else {
      processJson(filePath, changes);
    }
  }

  const rows = changes.map((change) => `${change.file} ${change.rowId} ${change.field}`);
  writeFileSync(listPath, rows.length === 0 ? '' : `${rows.join('\n')}\n`, 'utf8');

  process.stdout.write(`relabeled ${changes.length} values in ${TARGET_FILES.length} files\n`);
}

main();
