#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Lane Residue Gate Tests
// ───────────────────────────────────────────────────────────────────
// Makes the retired embedding lane's residue check block the doctor tests:
// repo mode must pass on this checkout, and a fixture repository whose one
// tracked file holds a lane term must fail it. The term is read from the
// check's own vocabulary, so this file names none and needs no allowlist row.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { pathToFileURL } = require('node:url');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS AND HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(__dirname, '../../../../..');
const CHECK = path.join(REPO_ROOT, '.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs');

// A git hook exports these, and they would point the fixture's git calls at
// this repository's index instead.
const GIT_VARIABLES = ['GIT_DIR', 'GIT_INDEX_FILE', 'GIT_WORK_TREE'];

function cleanEnv() {
  const env = { ...process.env };
  for (const key of GIT_VARIABLES) delete env[key];
  return env;
}

function runRepoMode(root, extraArgs = []) {
  return spawnSync(process.execPath, [CHECK, 'repo', '--root', root, ...extraArgs], {
    encoding: 'utf8',
    env: cleanEnv(),
    maxBuffer: 64 * 1024 * 1024,
  });
}

function git(root, ...args) {
  const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8', env: cleanEnv() });
  assert.equal(result.status, 0, `git ${args.join(' ')} failed: ${result.stderr}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('repo mode passes on this checkout', () => {
  assert.ok(fs.existsSync(CHECK), `the residue check is missing at ${CHECK}`);
  const run = runRepoMode(REPO_ROOT);

  assert.equal(run.status, 0, `${run.stdout}${run.stderr}`);
  assert.match(run.stdout, /^live {8}: 0$/m);
});

test('a lane term planted in a tracked file fails repo mode', async (t) => {
  const { IDENTIFIER_TERMS } = await import(pathToFileURL(CHECK).href);
  const term = IDENTIFIER_TERMS[0];
  assert.equal(typeof term, 'string');

  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'lane-residue-gate-'));
  t.after(() => fs.rmSync(base, { force: true, recursive: true }));
  const root = path.join(base, 'repo');
  const hooks = path.join(base, 'hooks');
  fs.mkdirSync(root);
  fs.mkdirSync(hooks);
  git(root, 'init', '-q');
  git(root, 'config', 'user.email', 'fixture@example.invalid');
  git(root, 'config', 'user.name', 'Fixture');
  git(root, 'config', 'commit.gpgsign', 'false');
  git(root, 'config', 'core.hooksPath', hooks);
  fs.mkdirSync(path.join(root, 'docs'));
  fs.writeFileSync(path.join(root, 'docs', 'notes.md'), `Start ${term} before the scan.\n`, 'utf8');
  git(root, 'add', '-A');
  git(root, 'commit', '-q', '-m', 'fixture');
  const allowlist = path.join(base, 'allowlist.json');
  fs.writeFileSync(allowlist, JSON.stringify({ entries: [] }), 'utf8');

  const run = runRepoMode(root, ['--allowlist', allowlist, '--json']);

  assert.equal(run.status, 1, `${run.stdout}${run.stderr}`);
  const report = JSON.parse(run.stdout);
  assert.deepEqual(report.live, [{ matched: { identifier: [term] }, path: 'docs/notes.md' }]);
});
