#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Fable Mode Check Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the fable-mode diagnostic as a process against throwaway lineage
// directories, so a status is only ever OK when something was measured.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const SCRIPT = path.resolve(__dirname, '..', 'fable-mode-check.cjs');

// Enough prose paragraphs (each at least 40 characters) for every prose metric
// to return a number from the iteration-markdown fallback.
const PARAGRAPH = 'The suite passes and `validate.sh` confirmed the packet, done with evidence.';
const ITERATION = Array.from({ length: 10 }, () => PARAGRAPH).join('\n\n');

const roots = [];

function tempDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fable-mode-check-'));
  roots.push(dir);
  return dir;
}

function lineageDir() {
  const dir = tempDir();
  fs.mkdirSync(path.join(dir, 'iterations'));
  fs.writeFileSync(path.join(dir, 'iterations', 'iteration-001.md'), ITERATION);
  return dir;
}

function baselineFile() {
  const file = path.join(tempDir(), 'baseline.json');
  fs.writeFileSync(file, JSON.stringify({ aggregate: { medianWordsPerMsg_median: 10 } }));
  return file;
}

function run(args) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
  return { status: result.status, out: `${result.stdout}${result.stderr}` };
}

test.after(() => {
  for (const dir of roots) fs.rmSync(dir, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. HAPPY PATH AND ERROR PATH
// ─────────────────────────────────────────────────────────────────────────────

test('a measurable lineage renders metrics against the baseline and exits 0', () => {
  const baseline = baselineFile();
  const { status, out } = run(['--dir', lineageDir(), '--baseline', baseline]);
  assert.equal(status, 0, out);
  assert.match(out, /median words\/msg\s+\d+ {2}\(Δ/);
  assert.match(out, /STATUS=OK fable-mode/);
});

test('the positional target form still works', () => {
  const { status, out } = run([lineageDir(), '--baseline', baselineFile()]);
  assert.equal(status, 0, out);
});

test('a missing target is a checker error, exit 2', () => {
  const { status, out } = run(['--dir', path.join(tempDir(), 'absent')]);
  assert.equal(status, 2, out);
  assert.match(out, /STATUS=ERROR fable-mode: target not found/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. REGRESSIONS: NEVER OK AFTER MEASURING NOTHING
// ─────────────────────────────────────────────────────────────────────────────

test('a target that is a file, not a directory, is exit 2', () => {
  const file = path.join(tempDir(), 'note.md');
  fs.writeFileSync(file, '# not a lineage\n');
  const { status, out } = run(['--dir', file]);
  assert.equal(status, 2, out);
  assert.match(out, /STATUS=ERROR fable-mode: target is not a directory/);
});

test('an explicit baseline that fails to load is exit 2', () => {
  const missing = path.join(tempDir(), 'nonexistent.json');
  const { status, out } = run(['--dir', lineageDir(), '--baseline', missing]);
  assert.equal(status, 2, out);
  assert.match(out, /STATUS=ERROR fable-mode: baseline could not be loaded/);
});

test('a directory with nothing measurable is not OK and exits non-zero', () => {
  const { status, out } = run(['--dir', tempDir(), '--baseline', baselineFile()]);
  assert.equal(status, 2, out);
  assert.doesNotMatch(out, /STATUS=OK/);
  assert.match(out, /STATUS=ERROR fable-mode: nothing measured/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. REGRESSIONS: ARGUMENT PARSING
// ─────────────────────────────────────────────────────────────────────────────

test('a flag whose value is another flag is rejected with usage', () => {
  const { status, out } = run(['--baseline', '--dir', lineageDir()]);
  assert.equal(status, 2, out);
  assert.match(out, /--baseline needs a value/);
  assert.match(out, /Usage: fable-mode-check\.cjs/);
});

test('an unknown flag is rejected with usage', () => {
  const { status, out } = run(['--dir', lineageDir(), '--bogus']);
  assert.equal(status, 2, out);
  assert.match(out, /unknown argument: --bogus/);
  assert.match(out, /Usage: fable-mode-check\.cjs/);
});
