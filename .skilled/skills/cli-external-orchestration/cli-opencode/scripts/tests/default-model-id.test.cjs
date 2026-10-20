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

// The generated runtime copies ship outside the skill root, so they are found and
// reported from the repository root instead.
const REPO_ROOT = path.resolve(SKILL_ROOT, '..', '..', '..', '..');
const HERMES_SKILL = path.join(REPO_ROOT, '.hermes', 'skills', 'cli-opencode', 'SKILL.md');

// The opencode-go default, as `opencode models opencode-go` lists it.
const DEFAULT_ID = 'opencode-go/deepseek-v4.1-flash';

// The id the gateway retired, assembled from fragments so this file does not itself
// spell the dead slug: a search for it across the skill should return the dated
// record and nothing else.
const RETIRED_SLUG = `deepseek-v4${'-flash'}`;
const RETIRED_ID = `opencode-go/${RETIRED_SLUG}`;

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

// A character after the id makes a different id, so a sibling slug that merely starts
// the same way is not a match.
const RETIRED_ID_PATTERN = new RegExp(`${escapeRegExp(RETIRED_ID)}(?![\\w.-])`);

// The bare slug, for a document that drops the provider prefix while naming the same
// retired model. A leading word character, `/`, `.` or `-` means a longer slug rather
// than this one, so a Cline-prefixed id and the rostered form are left to the pattern
// above.
const RETIRED_SLUG_PATTERN = new RegExp(`(?<![\\w/.-])${escapeRegExp(RETIRED_SLUG)}(?![\\w.-])`);

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

// OpenCode 1 pins a model with `--model <id>` and OpenCode 2 with `-m <id>` plus an
// effort suffix (`#max`). The id runs to the next space, so a closing backtick or
// quote ends it, and the suffix is stripped so both spellings compare equal.
const MODEL_SELECTOR_PATTERN = /(?<![\w-])(--model|-m)\s+([^\s`'"]+)/g;

function modelSelectors(markdown) {
  return [...markdown.matchAll(MODEL_SELECTOR_PATTERN)].map((match) => ({
    flag: match[1],
    id: match[2].replace(/#.*$/, '').replace(/[`'"]+$/, ''),
    text: match[0],
  }));
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

function relativeToRepoRoot(file) {
  return path.relative(REPO_ROOT, file).split(path.sep).join('/');
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

  // Both dispatch forms ship there as copyable commands, so every selector is a
  // dispatch an operator may run: one that pins another model is drift, however the
  // surrounding prose reads.
  const selectors = modelSelectors(section.join('\n'));

  for (const flag of ['--model', '-m']) {
    assert.ok(
      selectors.some((selector) => selector.flag === flag),
      `the Default Invocation section has no "${flag} <id>" selector`,
    );
  }

  const differing = selectors
    .filter((selector) => selector.id !== DEFAULT_ID)
    .map((selector) => selector.text);
  assert.equal(
    differing.join('\n'),
    '',
    `every model selector in the Default Invocation section must pin ${DEFAULT_ID}, but these do not:\n${differing.join('\n')}`,
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. NO CURRENT DOCUMENT DISPATCHES THE RETIRED ID
// ─────────────────────────────────────────────────────────────────────────────

test('no current doc names the retired opencode-go id or its bare slug', () => {
  const offenders = [];

  const scan = (file, relative) => {
    const dated = DATED_RECORDS.filter((record) => record.file === relative);

    read(file)
      .split('\n')
      .forEach((line, index) => {
        if (!RETIRED_ID_PATTERN.test(line) && !RETIRED_SLUG_PATTERN.test(line)) return;
        if (dated.some((record) => line.startsWith(record.linePrefix))) return;
        offenders.push(`${relative}:${index + 1}`);
      });
  };

  for (const file of documents(SKILL_ROOT)) scan(file, relativeToSkillRoot(file));

  // The Hermes runtime carries a generated copy of this skill, so the same id must not
  // reappear there; a checkout that has not built it yet has nothing to scan.
  if (fs.existsSync(HERMES_SKILL)) scan(HERMES_SKILL, relativeToRepoRoot(HERMES_SKILL));

  assert.equal(
    offenders.join('\n'),
    '',
    `${RETIRED_ID} and its bare slug are retired, but they are still named at:\n${offenders.join('\n')}`,
  );
});
