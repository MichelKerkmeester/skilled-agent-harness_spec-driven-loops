#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: cli-opencode Default Model Id Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// The roster, the skill's default invocation and every scenario document name the
// opencode-go default, and they drifted apart when the gateway retired an id: the
// roster moved to the live slug while the docs kept dispatching the dead one. The
// roster is the single source, and these tests hold the rest of the tree to it.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const SKILL_ROOT = path.resolve(__dirname, '..', '..');
const ROSTER = path.join(SKILL_ROOT, 'references', 'providers-and-models.md');
const SKILL = path.join(SKILL_ROOT, 'SKILL.md');

// The opencode-go default, as `opencode models opencode-go` lists it.
const DEFAULT_ID = 'opencode-go/deepseek-v4.1-flash';

// The id the gateway retired. Anything after it makes a different id, so a sibling
// slug that merely starts the same way is not a match. It is assembled from fragments
// so this file does not itself spell the dead slug: a search for it across the skill
// should return the dated record and nothing else.
const RETIRED_ID = `opencode-go/deepseek-v4${'-flash'}`;

const DATED_RECORDS = [
  // A dated record keeps the id it recorded, so a coverage note written against the
  // old slug stays untouched when the roster moves.
  {
    file: 'manual-testing-playbook/manual-testing-playbook.md',
    linePrefix: 'Coverage note (2026-04-26):',
  },
];

// History is what these trees are for, and rewriting it would falsify the record.
const SKIPPED_DIRECTORIES = new Set(['changelog', 'benchmark']);

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const RETIRED_ID_PATTERN = new RegExp(`${escapeRegExp(RETIRED_ID)}(?![\\w.-])`);

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

// The rows under one `### <provider>` heading as cell arrays, with the header and the
// separator dropped. The next heading of any level ends the block, so a table cannot
// borrow a default from the provider documented below it.
function rosterRows(markdown, provider) {
  const lines = markdown.split('\n');
  const start = lines.findIndex((line) => line.trim() === `### ${provider}`);
  assert.notEqual(start, -1, `providers-and-models.md has no "### ${provider}" heading`);

  const rows = [];
  for (const line of lines.slice(start + 1)) {
    if (/^#{1,6} /.test(line)) break;
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;
    const cells = trimmed.split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.every((cell) => /^:?-{2,}:?$/.test(cell))) continue;
    if (cells[0] === 'Model id') continue;
    rows.push(cells);
  }
  return rows;
}

// Every document the skill ships, minus the historical trees.
function documents(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRECTORIES.has(entry.name)) found.push(...documents(full));
    } else if (entry.isFile() && /\.(md|json)$/.test(entry.name)) {
      found.push(full);
    }
  }
  return found;
}

function relativeToSkillRoot(file) {
  return path.relative(SKILL_ROOT, file).split(path.sep).join('/');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. THE ROSTER IS THE SINGLE SOURCE
// ─────────────────────────────────────────────────────────────────────────────

test('the roster names one opencode-go default', () => {
  const rows = rosterRows(read(ROSTER), 'opencode-go');
  assert.ok(rows.length > 0, 'the opencode-go table lists no rows');

  const defaults = rows.filter((cells) => cells[1] === '✓');
  assert.equal(
    defaults.length,
    1,
    `the opencode-go table marks ${defaults.length} rows as the default`,
  );

  const id = defaults[0][0].replace(/^`|`$/g, '');
  assert.equal(id, DEFAULT_ID);
});

test("SKILL.md's default invocation names the roster default", () => {
  const lines = read(SKILL).split('\n');
  const start = lines.findIndex((line) => line.startsWith('### Default Invocation'));
  assert.notEqual(start, -1, 'SKILL.md has no "### Default Invocation" section');

  const section = [];
  for (const line of lines.slice(start + 1)) {
    if (/^#{1,3} /.test(line)) break;
    section.push(line);
  }

  assert.ok(
    section.some((line) => line.includes(DEFAULT_ID)),
    `the Default Invocation section does not name ${DEFAULT_ID}`,
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. NO CURRENT DOCUMENT DISPATCHES THE RETIRED ID
// ─────────────────────────────────────────────────────────────────────────────

test('no current doc names the retired opencode-go id', () => {
  const offenders = [];

  for (const file of documents(SKILL_ROOT)) {
    const relative = relativeToSkillRoot(file);
    const dated = DATED_RECORDS.filter((record) => record.file === relative);

    read(file)
      .split('\n')
      .forEach((line, index) => {
        if (!RETIRED_ID_PATTERN.test(line)) return;
        if (dated.some((record) => line.startsWith(record.linePrefix))) return;
        offenders.push(`${relative}:${index + 1}`);
      });
  }

  assert.equal(
    offenders.join('\n'),
    '',
    `${RETIRED_ID} is retired, but it is still named at:\n${offenders.join('\n')}`,
  );
});
