#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Quality Config Doctor Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the config doctor as a process against throwaway git repositories, so each
// verdict is read through its exit code and STATUS line, the two things the /doctor
// route reads. The repositories come from the quality gate's own fixture builder, so
// both suites isolate git the same way.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const QUALITY_ROOT = path.resolve(__dirname, '../../../../skills/sk-code/sk-code-quality');
const { assertSnapshotUnchanged, buildRepo } = require(path.join(QUALITY_ROOT, 'scripts', 'tests', 'fixtures.cjs'));
const { validateConfig } = require(path.join(QUALITY_ROOT, 'scripts', 'lib', 'quality-config.cjs'));

const SCRIPT = path.resolve(__dirname, '..', 'sk-code-quality-config.cjs');
const TARGET = '.sk-code/quality.json';
const PACKAGE = `${JSON.stringify({ name: 'fixture', scripts: { lint: 'eslint .', test: 'node --test' } }, null, 2)}\n`;

function withRepo(options, body) {
  const repo = buildRepo({ hub: 'real', ...options });
  try {
    return body(repo);
  } finally {
    repo.cleanup();
  }
}

function doctor(repo, args, { cwd = repo.root, env = {} } = {}) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], { cwd, env: { ...repo.env, ...env }, encoding: 'utf8' });
  const lines = result.stdout.trimEnd().split('\n');
  let payload = null;
  if (args.includes('--json')) {
    try {
      payload = JSON.parse(lines.slice(0, -1).join('\n'));
    } catch {
      payload = null;
    }
  }
  return { status: result.status, stdout: result.stdout, stderr: result.stderr, last: lines[lines.length - 1], payload };
}

function porcelain(repo) {
  return repo.git(['status', '--porcelain']);
}

function config(value) {
  return `${JSON.stringify({ schemaVersion: 1, ...value }, null, 2)}\n`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. INIT
// ─────────────────────────────────────────────────────────────────────────────

test('init dry run: prints the plan, writes nothing and leaves git status empty', () => withRepo({
  base: { 'package.json': PACKAGE },
}, (repo) => {
  const result = assertSnapshotUnchanged(repo, () => doctor(repo, ['init', '--json']));
  assert.equal(result.status, 0);
  assert.equal(result.last, 'STATUS=OK MODE=DRY_RUN');
  assert.deepEqual(result.payload.checks.map((item) => [item.id, item.required]), [['lint', false]]);
  assert.equal(porcelain(repo), '');
  assert.ok(!fs.existsSync(path.join(repo.root, TARGET)));
}));

test('init apply: creates the file once, and a second apply refuses with CONFIG_EXISTS and keeps it byte-identical', () => withRepo({
  base: { 'package.json': PACKAGE },
}, (repo) => {
  const first = doctor(repo, ['init', '--apply']);
  assert.equal(first.status, 0);
  assert.equal(first.last, 'STATUS=OK MODE=APPLIED');
  const target = path.join(repo.root, TARGET);
  const written = fs.readFileSync(target);
  const parsed = JSON.parse(written.toString('utf8'));
  assert.deepEqual(validateConfig(parsed), []);
  assert.deepEqual(parsed.checks.map((entry) => [entry.id, entry.required]), [['lint', false]]);
  assert.deepEqual(fs.readdirSync(path.dirname(target)), ['quality.json']);

  const second = assertSnapshotUnchanged(repo, () => doctor(repo, ['init', '--apply']));
  assert.equal(second.status, 1);
  assert.equal(second.last, 'STATUS=FAIL MODE=REFUSED ERROR=CONFIG_EXISTS');
  assert.ok(fs.readFileSync(target).equals(written));
  const dry = doctor(repo, ['init']);
  assert.equal(dry.status, 1);
  assert.equal(dry.last, 'STATUS=FAIL MODE=DRY_RUN ERROR=CONFIG_EXISTS');
}));

test('init apply: a .sk-code folder that resolves outside the repository is refused, and nothing is written there', () => withRepo({}, (repo) => {
  const outside = path.join(repo.parent, 'elsewhere');
  fs.mkdirSync(outside);
  fs.symlinkSync(outside, path.join(repo.root, '.sk-code'));
  const result = doctor(repo, ['init', '--apply']);
  assert.equal(result.status, 1);
  assert.match(result.last, /^STATUS=FAIL MODE=REFUSED ERROR=OUTSIDE_REPOSITORY /);
  assert.deepEqual(fs.readdirSync(outside), []);
}));

// ─────────────────────────────────────────────────────────────────────────────
// 3. STATUS AND CHECK
// ─────────────────────────────────────────────────────────────────────────────

test('no command starts: status, check and init never run a configured check', () => withRepo({
  base: {
    'package.json': PACKAGE,
    [TARGET]: config({ checks: [{ id: 'canary', argv: [process.execPath, '-e', 'require("fs").writeFileSync("canary", "ran")'], severity: 'P0' }] }),
  },
}, (repo) => {
  assertSnapshotUnchanged(repo, () => {
    for (const args of [['status'], ['status', '--json'], ['check'], ['init']]) doctor(repo, args);
  });
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
  // The script holds no way to start a process at all, which a reviewer can check by
  // reading one file.
  assert.doesNotMatch(fs.readFileSync(SCRIPT, 'utf8'), /spawn|execFile|exec(Sync)?\(/);
}));

test('status: PASS for a found tool, DEGRADED with a repair line for an absent one, and SKIP for a suggestion only', () => withRepo({
  base: {
    'package.json': PACKAGE,
    [TARGET]: config({ checks: [
      { id: 'found', argv: [process.execPath, '-e', '0'], severity: 'P1' },
      { id: 'absent', argv: ['sk-code-absent-tool'], severity: 'P0' },
    ] }),
  },
}, (repo) => {
  const result = assertSnapshotUnchanged(repo, () => doctor(repo, ['status', '--json']));
  assert.equal(result.status, 0);
  assert.equal(result.last, 'STATUS=DEGRADED SOURCE="repo"');
  const states = Object.fromEntries(result.payload.tools.map((row) => [row.tool, row.state]));
  assert.deepEqual(states, { [process.execPath]: 'PASS', 'sk-code-absent-tool': 'DEGRADED', npm: 'SKIP' });
  const absent = result.payload.tools.find((row) => row.tool === 'sk-code-absent-tool');
  assert.equal(absent.repair, `install 'sk-code-absent-tool' or remove absent from ${TARGET}`);
  assert.deepEqual(Object.keys(result.payload.layers).sort(), ['ci_hygiene', 'post_edit', 'pre_commit_hygiene']);
}));

test('status and check: an invalid config is CONFIG_INVALID with exit 1, and a missing --config path is CONFIG_PATH_MISSING', () => withRepo({
  base: { [TARGET]: config({ bogus: true, checks: [{ id: 'x', argv: 'npm run lint', severity: 'P1' }] }) },
}, (repo) => {
  const status = doctor(repo, ['status']);
  assert.equal(status.status, 1);
  assert.equal(status.last, 'STATUS=FAIL SOURCE="repo" ERROR=CONFIG_INVALID');
  const checked = doctor(repo, ['check', '--json']);
  assert.equal(checked.status, 1);
  assert.equal(checked.last, 'STATUS=FAIL SOURCE="repo" ERRORS=2 ERROR=CONFIG_INVALID');
  assert.deepEqual(checked.payload.config.errors.map((entry) => entry.field).sort(), ['bogus', 'checks[0].argv']);
  const missing = doctor(repo, ['check', '--config', 'missing.json']);
  assert.equal(missing.status, 1);
  assert.equal(missing.last, 'STATUS=FAIL SOURCE="cli" ERRORS=1 ERROR=CONFIG_PATH_MISSING');
  const valid = path.join(repo.parent, 'valid.json');
  fs.writeFileSync(valid, config({}));
  assert.equal(doctor(repo, ['check', '--config', valid]).last, 'STATUS=OK SOURCE="cli" ERRORS=0');
}));

// ─────────────────────────────────────────────────────────────────────────────
// 4. HELP AND USAGE
// ─────────────────────────────────────────────────────────────────────────────

test('help: -h and --help print the usage and exit 0, and a usage error or a folder outside git exits 2', () => withRepo({}, (repo) => {
  for (const flag of ['-h', '--help']) {
    const result = doctor(repo, ['init', '--apply', flag]);
    assert.equal(result.status, 0, flag);
    assert.match(result.stdout, /^Usage: /);
    assert.ok(!fs.existsSync(path.join(repo.root, TARGET)));
  }
  const usage = doctor(repo, ['-h']).stdout;
  const source = fs.readFileSync(SCRIPT, 'utf8');
  const parsed = [...source.matchAll(/arg === '(--[a-z-]+)'/g)].map((match) => match[1]);
  assert.ok(parsed.length >= 4);
  for (const flag of [...parsed, 'status', 'check', 'init', 'skcode.qualityConfig', TARGET]) assert.ok(usage.includes(flag), flag);
  for (const code of ['0  ', '1  ', '2  ']) assert.ok(usage.includes(`  ${code}`), code);

  const unknown = doctor(repo, ['repair']);
  assert.equal(unknown.status, 2);
  assert.match(unknown.last, /^STATUS=FAIL ERROR=USAGE /);
  const plain = path.join(repo.parent, 'plain');
  fs.mkdirSync(plain);
  const outside = doctor(repo, ['status'], { cwd: plain });
  assert.equal(outside.status, 2);
  assert.match(outside.last, /^STATUS=FAIL ERROR=NO_GIT_REPOSITORY /);
}));
