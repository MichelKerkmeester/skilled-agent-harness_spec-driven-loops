// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Configured Check Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Each case commits a repository config that names one or more commands, seeds a
// change and runs the runner the way a user would. The commands are node one-liners
// started through this process's own node, so a case needs no tool beyond the one
// running it, and each one proves what it saw through its exit code alone. Every
// case except the mutating one also checks that the run left the fixture unchanged.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { assertSnapshotUnchanged, buildRepo } = require('./fixtures.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const NODE = process.execPath;
const CLEAN_GO = 'package a\n\nfunc A() {}\n';
const CHANGED_GO = 'package a\n\nfunc A() {}\nfunc B() {}\n';
const HOSTILE = '$(touch pwned); `touch pwned` | cat & ; * > out.txt';
// Started inside a check, this keeps a helper alive after the check itself ends, so a
// case can see whether the runner killed the whole group.
const FORK_HELPER = 'const c = require("child_process").spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], { stdio: "ignore" });'
  + ' require("fs").writeFileSync(process.argv[1], String(c.pid));';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function withRepo(options, body) {
  const repo = buildRepo(options);
  try {
    return body(repo);
  } finally {
    repo.cleanup();
  }
}

function config(value) {
  return `${JSON.stringify({ schemaVersion: 1, ...value }, null, 2)}\n`;
}

function check(verdict, id) {
  return verdict.checks.find((entry) => entry.id === id);
}

function alive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === 'EPERM';
  }
}

// A killed helper is reaped by the system shortly after, so the wait allows for that.
function deadWithin(pid, ms) {
  const pause = new Int32Array(new SharedArrayBuffer(4));
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (!alive(pid)) return true;
    Atomics.wait(pause, 0, 0, 50);
  }
  return !alive(pid);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. NAMED FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

test('F06 required tool absent: the check is SKIPPED_ABSENT with a repair line and the run is UNVERIFIED', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.sk-code/quality.json': config({ checks: [{ id: 'absent-tool', argv: ['sk-code-absent-tool', '{files}'], severity: 'P0' }] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 4);
  assert.equal(verdict.gate, 'UNVERIFIED');
  const row = check(verdict, 'absent-tool');
  assert.deepEqual([row.origin, row.state, row.required, row.requires], ['configured', 'SKIPPED_ABSENT', true, 'sk-code-absent-tool']);
  assert.equal(row.repair, "install 'sk-code-absent-tool' or remove the check from .sk-code/quality.json");
  assert.deepEqual(verdict.summary.unverified, ['absent-tool']);
}));

test('F07 check fails: a required P0 check that exits 1 is RAN_FAIL and blocks, and a failing P1 check does not', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.sk-code/quality.json': config({ checks: [
      { id: 'soft-fail', argv: [NODE, '-e', 'process.exit(1)'], severity: 'P1' },
      { id: 'hard-fail', argv: [NODE, '-e', 'process.exit(1)'], severity: 'P0' },
    ] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  assert.equal(verdict.gate, 'BLOCKED');
  assert.deepEqual([check(verdict, 'hard-fail').state, check(verdict, 'hard-fail').exit], ['RAN_FAIL', 1]);
  assert.deepEqual([check(verdict, 'soft-fail').state, check(verdict, 'soft-fail').required], ['RAN_FAIL', false]);

  repo.write({ '.sk-code/quality.json': config({ checks: [{ id: 'soft-fail', argv: [NODE, '-e', 'process.exit(1)'], severity: 'P1' }] }) });
  assert.equal(repo.run(['--config', '.sk-code/quality.json']).status, 0);
}));

test('F08 check mutates: a check that rewrites a tracked file ends the run with CHECK_MUTATED_WORKSPACE and keeps the change', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.sk-code/quality.json': config({ checks: [
      { id: 'rewriter', argv: [NODE, '-e', 'require("fs").appendFileSync("app.go", "func C() {}\\n")'], severity: 'P1' },
      { id: 'after', argv: [NODE, '-e', 'process.exit(0)'], severity: 'P1' },
    ] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  const { status, verdict } = repo.run([]);
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  const mutation = verdict.errors.find((entry) => entry.code === 'CHECK_MUTATED_WORKSPACE');
  assert.deepEqual([mutation.check, mutation.paths], ['rewriter', ['app.go']]);
  assert.equal(fs.readFileSync(path.join(repo.root, 'app.go'), 'utf8'), `${CHANGED_GO}func C() {}\n`);
  assert.equal(check(verdict, 'after').state, 'ERROR');
  assert.match(check(verdict, 'after').repair, /not run, because the workspace changed while rewriter ran/);
}));

test('F09 discovered only: a package.json lint script is suggested with its config entry and never runs', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    'package.json': `${JSON.stringify({ name: 'fixture', scripts: {
      lint: 'node -e "require(\'fs\').writeFileSync(\'canary\', \'ran\')"',
      'format:check': 'prettier --write .',
      fix: 'eslint --fix .',
    } }, null, 2)}\n`,
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.deepEqual(verdict.suggested_checks, [{
    id: 'lint',
    source: 'package.json',
    reason: 'package.json defines a lint script',
    entry: { id: 'lint', argv: ['npm', 'run', 'lint'], languages: ['javascript', 'typescript'], requires: 'npm', severity: 'P1', required: false },
  }]);
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
}));

// ─────────────────────────────────────────────────────────────────────────────
// 5. TRUST BOUNDARY AND SPAWN
// ─────────────────────────────────────────────────────────────────────────────

test('no git: a configured check reports ERROR with GUARD_UNAVAILABLE, starts nothing and leaves the run UNVERIFIED', () => withRepo({
  git: false,
  base: {
    'app.go': CHANGED_GO,
    '.sk-code/quality.json': config({ checks: [{ id: 'canary', argv: [NODE, '-e', 'require("fs").writeFileSync("canary", "ran")'], severity: 'P0' }] }),
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', 'app.go']));
  assert.equal(status, 4);
  const row = check(verdict, 'canary');
  assert.deepEqual([row.state, row.code], ['ERROR', 'GUARD_UNAVAILABLE']);
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
}));

test('argv: shell metacharacters reach the program as literal text, and no shell reads them', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.sk-code/quality.json': config({ checks: [{
      id: 'literal',
      argv: [NODE, '-e', `process.exit(process.argv[1] === ${JSON.stringify(HOSTILE)} ? 0 : 1)`, HOSTILE],
      severity: 'P0',
    }] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.equal(check(verdict, 'literal').state, 'RAN_CLEAN');
  assert.ok(!fs.existsSync(path.join(repo.root, 'pwned')));
  assert.ok(!fs.existsSync(path.join(repo.root, 'out.txt')));
}));

test('timeout: a check over its deadline is TIMEOUT, and the runner kills the whole process group', () => {
  const pids = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skq-pids-')));
  try {
    const stalled = path.join(pids, 'stalled');
    const exited = path.join(pids, 'exited');
    withRepo({
      base: {
        'app.go': CLEAN_GO,
        '.sk-code/quality.json': config({ checks: [
          { id: 'stall', argv: [NODE, '-e', `${FORK_HELPER} setInterval(() => {}, 1000);`, stalled], severity: 'P0', timeoutSec: 0.5 },
          { id: 'leave', argv: [NODE, '-e', `${FORK_HELPER} process.exit(0);`, exited], severity: 'P1' },
        ] }),
      },
      change: { 'app.go': CHANGED_GO },
    }, (repo) => {
      const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
      assert.equal(status, 4);
      assert.equal(check(verdict, 'stall').state, 'TIMEOUT');
      assert.equal(check(verdict, 'leave').state, 'RAN_CLEAN');
      assert.ok(deadWithin(Number(fs.readFileSync(stalled, 'utf8')), 3000), 'the helper of the stalled check survived');
      assert.ok(deadWithin(Number(fs.readFileSync(exited, 'utf8')), 3000), 'the helper of the finished check survived');
    });
  } finally {
    fs.rmSync(pids, { recursive: true, force: true });
  }
});

test('--no-run lists configured checks with their planned runs and spawns none, and the flags accept configured ids', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.sk-code/quality.json': config({ checks: [{ id: 'canary', argv: [NODE, '-e', 'require("fs").writeFileSync("canary", "ran")', '{files}'], severity: 'P0' }] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  assertSnapshotUnchanged(repo, () => {
    const listed = repo.run(['--no-run']);
    assert.equal(listed.status, 4);
    const row = check(listed.verdict, 'canary');
    assert.equal(row.state, 'LISTED');
    assert.deepEqual(row.runs.map((run) => [run.cwd, run.argv.at(-1), run.state]), [['.', 'app.go', 'LISTED']]);
    const skipped = repo.run(['--no-run', '--skip', 'canary']);
    assert.equal(check(skipped.verdict, 'canary').state, 'SKIPPED_BY_FLAG');
    const only = repo.run(['--no-run', '--only', 'canary']);
    assert.equal(check(only.verdict, 'canary').state, 'LISTED');
    assert.equal(check(only.verdict, 'comment-hygiene').state, 'SKIPPED_BY_FLAG');
  });
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
}));

test('package cwd: a {files} check runs once per package folder and receives only that package\'s files', () => withRepo({
  base: {
    'pkg/a/package.json': '{"name": "a"}\n',
    'pkg/b/Cargo.toml': '[package]\nname = "b"\n',
    '.sk-code/quality.json': config({ checks: [{
      id: 'per-package',
      // Exits 0 only when every file it was handed exists from where it started.
      argv: [NODE, '-e', 'process.exit(process.argv.slice(1).every((f) => require("fs").existsSync(f)) ? 0 : 1)', '{files}'],
      languages: ['javascript'],
      cwd: 'package',
      severity: 'P0',
    }] }),
  },
  change: { 'pkg/a/x.js': 'module.exports = 1;\n', 'pkg/b/src/y.js': 'module.exports = 2;\n', 'z.js': 'module.exports = 3;\n', '-dash.js': 'module.exports = 4;\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  const row = check(verdict, 'per-package');
  assert.equal(row.state, 'RAN_CLEAN');
  assert.deepEqual(row.runs.map((run) => [run.cwd, run.argv.slice(3), run.state]), [
    ['.', ['./-dash.js', 'z.js'], 'RAN_CLEAN'],
    ['pkg/a', ['x.js'], 'RAN_CLEAN'],
    ['pkg/b', ['src/y.js'], 'RAN_CLEAN'],
  ]);
}));

// A program named with a slash is a repository file, so a run in a package folder
// starts the file the presence probe found rather than one under that folder.
test('relative program: a slash argv[0] starts from the repository root whatever cwd says', () => {
  const marks = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skq-marks-')));
  try {
    const marker = path.join(marks, 'started');
    withRepo({
      base: {
        'tools/lint.sh': `#!/bin/sh\nprintf '%s\\n' started > '${marker}'\n`,
        'pkg/package.json': '{"name": "pkg"}\n',
        '.sk-code/quality.json': config({ checks: [{
          id: 'lint',
          argv: ['./tools/lint.sh', '{files}'],
          languages: ['python'],
          cwd: 'package',
          severity: 'P0',
        }] }),
      },
      change: { 'pkg/a.py': 'def a():\n    return 1\n' },
      modes: { 'tools/lint.sh': 0o755 },
    }, (repo) => {
      const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
      assert.equal(status, 0);
      const row = check(verdict, 'lint');
      assert.deepEqual([row.state, row.runs.map((run) => run.cwd)], ['RAN_CLEAN', ['pkg']]);
      assert.equal(fs.readFileSync(marker, 'utf8'), 'started\n');
    });
  } finally {
    fs.rmSync(marks, { recursive: true, force: true });
  }
});

test('NOT_APPLICABLE: a check whose selectors match no file in scope never starts', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.sk-code/quality.json': config({ checks: [{ id: 'docs-only', argv: [NODE, '-e', 'require("fs").writeFileSync("canary", "ran")'], paths: ['docs/**'], severity: 'P0' }] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.deepEqual([check(verdict, 'docs-only').state, check(verdict, 'docs-only').files], ['NOT_APPLICABLE', 0]);
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
}));

test('generated: a row whose paths match a changed file runs as a configured check, even under an excluded folder', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.sk-code/quality.json': config({ generated: [{
      paths: ['dist/**'],
      argv: [NODE, '-e', 'process.exit(require("fs").existsSync(process.argv[1]) ? 0 : 1)', '{files}'],
      severity: 'P0',
    }] }),
  },
  change: { 'dist/out.js': 'module.exports = 1;\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  const row = check(verdict, 'generated-1');
  assert.deepEqual([row.origin, row.state, row.required, row.runs[0].argv.at(-1)], ['generated', 'RAN_CLEAN', true, 'dist/out.js']);
  assert.equal(verdict.coverage.files_checked, 1);
  assert.deepEqual(verdict.coverage.unchecked, []);
}));
