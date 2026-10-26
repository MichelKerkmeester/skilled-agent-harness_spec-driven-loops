// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Runner Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Each named fixture seeds one change in a throwaway repository, runs the runner the
// way a user would and checks part of the verdict. Every label the hygiene checker
// must catch is joined at run time, so this file never carries one in its own text,
// and every secret is joined from fragments for the same reason. No case changes
// this process's environment: each one hands its variables to the child it starts.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { assertSnapshotUnchanged, buildRepo } = require('./fixtures.cjs');
const { decideGate, runDistAdapter } = require('../quality-gate.cjs');
const { findTool, spawnArgv, withGuard } = require('../lib/run-check.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const QUALITY_ROOT = path.resolve(__dirname, '..', '..');
const HUB_ROOT = path.dirname(QUALITY_ROOT);
const REAL_CHECKER = path.join(QUALITY_ROOT, 'scripts', 'check-comment-hygiene.sh');
const COMPILER = path.resolve(HUB_ROOT, '..', '..', 'bin', 'lib', 'compiled-routing', '009-parent-hub-rollout', '001-sk-code', 'lib', 'registry-compiler.cjs');

const ADR_LABEL = ['ADR', '12'].join('-');
const REQ_SHORT = ['REQ', '4'].join('-');
const REQ_LONG = ['REQ', '12'].join('-');
const TASK_LABEL = 'T' + '043';
const AWS_KEY = ['AK', 'IA', 'ABCDEFGHIJKLMNOP'].join('');
const AWS_KEY_TWO = ['AK', 'IA', 'QRSTUVWXYZ234567'].join('');
const GITHUB_TOKEN = ['gh', 'p_', 'abcdefghijklmnopqrstuvwxyz0123456789'].join('');
const OPEN = '<'.repeat(7);
const MIDDLE = '='.repeat(7);
const CLOSE = '>'.repeat(7);
const PASS_WORD = /\bpass(?:ed|es|ing)?\b/i;
const LAYER_STATE = '(?:present|absent|untrusted|broken|unknown)';
const CHECKER_OUTPUTS = new RegExp('^code-quality-run/v1 gate=(?:NO_BLOCKER_FOUND|BLOCKED|NOTHING_CHECKED|ERROR|UNVERIFIED) '
  + 'exit=[0-4] p0_blocking=\\d+ unverified=(?:none|[a-z0-9,-]+) unchecked=\\d+ '
  + `layers=pc:${LAYER_STATE},ci:${LAYER_STATE},pe:${LAYER_STATE}$`);
const ENVELOPE_KEYS = Object.freeze([
  'schema_version', 'status', 'modified_files', 'resolved_surface', 'checklists_loaded', 'checker_outputs',
  'p0_p1_p2_decisions', 'accepted_deferrals', 'verification_handoff', 'remaining_accepted_risk',
]);

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

function check(verdict, id) {
  return verdict.checks.find((entry) => entry.id === id);
}

function hygieneFindings(verdict) {
  return verdict.findings.filter((entry) => entry.check === 'comment-hygiene');
}

function checklistFiles(verdict) {
  return verdict.checklists.map((entry) => entry.file);
}

function surfaceOf(verdict, file) {
  const entry = verdict.surfaces.find((item) => item.file === file);
  return entry ? entry.labels : null;
}

// A stand-in for python3 that runs node code, so a case can make the hygiene call
// fail, stall or write without touching the real checker.
function fakePython(dir, body) {
  const bin = path.join(dir, 'fake-bin');
  fs.mkdirSync(bin, { recursive: true });
  const file = path.join(bin, 'python3');
  fs.writeFileSync(file, `#!${process.execPath}\n${body}\n`);
  fs.chmodSync(file, 0o755);
  return bin;
}

function onlyNodeOnPath(dir) {
  const bin = path.join(dir, 'node-only');
  fs.mkdirSync(bin, { recursive: true });
  fs.symlinkSync(process.execPath, path.join(bin, 'node'));
  return bin;
}

function envelopeFields(text) {
  const lines = text.trim().split('\n');
  assert.equal(lines[0], 'CODE_QUALITY_RESULT v1');
  return lines.slice(1).map((line) => {
    const at = line.indexOf(': ');
    return [line.slice(0, at), line.slice(at + 2)];
  });
}

// A parser or an excerpt limit can cut a key short, so any eight characters of it in a
// row count as a leak.
function leaksKey(output, key) {
  for (let at = 0; at + 8 <= key.length; at += 1) if (output.includes(key.slice(at, at + 8))) return true;
  return false;
}

const HYGIENE_REPORT = 'process.stdout.write(JSON.stringify({ schema: "comment-hygiene/v1", exit_code: 0, files: [] }));';

// ─────────────────────────────────────────────────────────────────────────────
// 4. NAMED FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

test('F01 foreign polyglot: seven seeded labels block and the surface stays unknown', () => withRepo({
  base: { 'README.txt': 'fixture\n' },
  change: {
    'a.go': 'package a\n\n// see ' + ADR_LABEL + '\nfunc A() {}\n',
    'b.rs': 'fn main() {}\n// fixes issue #88\n',
    'c.yaml': 'key: 1 # packet 042\n',
    'd.css': '.a { color: red; } /* ' + REQ_SHORT + ' */\n',
    'e.py': 'def f():\n    """Implements ' + REQ_LONG + '."""\n    return 1\n',
    'f.ts': 'const u = 1; // see specs/demo/001-alpha/spec.md and https://example.com/docs\n',
    'g.mts': 'export const a = 1; // ' + TASK_LABEL + '\n',
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  assert.equal(verdict.gate, 'BLOCKED');
  assert.deepEqual(verdict.resolved_surface, ['unknown']);
  const blocking = hygieneFindings(verdict).filter((entry) => entry.blocking && entry.confidence === 'exact');
  assert.equal(blocking.length, 7);
  assert.deepEqual(blocking.map((entry) => entry.file).sort(), ['a.go', 'b.rs', 'c.yaml', 'd.css', 'e.py', 'f.ts', 'g.mts']);
  assert.ok(blocking.every((entry) => entry.severity === 'P0' && entry.origin === 'changed-line'));
}));

test('F02 false-positive set: measurement, encoding and standard names raise nothing', () => withRepo({
  change: {
    'notes.js': '// 100/250\n// UTF-8\n// SHA-256\n// RFC 7231\n// HTTP 404\n// CWE-79\nmodule.exports = 1;\n',
    'notes.py': '# 100/250\n# UTF-8\n# SHA-256\n# RFC 7231\n# HTTP 404\n# CWE-79\nVALUE = 1\n',
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.equal(verdict.gate, 'NO_BLOCKER_FOUND');
  assert.deepEqual(verdict.findings, []);
}));

test('F03 touched-file debt: an old label on an unchanged line is debt, not a blocker', () => withRepo({
  base: { 'app.go': 'package a\n\n// see ' + ADR_LABEL + '\nfunc A() {}\n' },
  change: {
    'app.go': 'package a\n\n// see ' + ADR_LABEL + '\nfunc A() {}\nfunc B() {}\n',
    'extra.js': 'module.exports = 1;\ndebugger;\n',
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.equal(verdict.gate, 'NO_BLOCKER_FOUND');
  assert.equal(verdict.layers.ci_hygiene, 'absent');
  assert.equal(verdict.layers.pre_commit_hygiene, 'absent');
  const debt = hygieneFindings(verdict);
  assert.equal(debt.length, 1);
  assert.deepEqual([debt[0].file, debt[0].line, debt[0].origin, debt[0].severity, debt[0].blocking], ['app.go', 3, 'touched-file', 'P1', false]);
  assert.equal(verdict.summary.touched_file_debt, 1);
  const leftover = verdict.findings.find((entry) => entry.check === 'debug-leftovers');
  assert.deepEqual([leftover.file, leftover.line, leftover.origin, leftover.blocking], ['extra.js', 2, 'changed-line', false]);
}));

test('F04 touched-file debt with a whole-file layer: the CI job makes the old label block', () => withRepo({
  base: {
    'app.go': 'package a\n\n// see ' + ADR_LABEL + '\nfunc A() {}\n',
    '.github/workflows/hygiene.yml': 'name: hygiene\non: push\njobs:\n  scan:\n    runs-on: ubuntu-latest\n    steps:\n      - run: python3 scripts/check-comment-hygiene.sh app.go\n',
  },
  change: { 'app.go': 'package a\n\n// see ' + ADR_LABEL + '\nfunc A() {}\nfunc B() {}\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  assert.equal(verdict.layers.ci_hygiene, 'present');
  const [entry] = hygieneFindings(verdict);
  assert.equal(entry.origin, 'touched-file');
  assert.equal(entry.blocking, true);
  assert.match(entry.reason, /CI hygiene job/);
}));

test('F05 nothing applicable: a language with no comment family and a binary are listed as unchecked', () => withRepo({
  change: {
    'main.zig': 'const std = @import("std");\n',
    'blob.js': Buffer.from([0x50, 0x00, 0x01, 0x02]),
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 2);
  assert.equal(verdict.gate, 'NOTHING_CHECKED');
  assert.deepEqual(verdict.coverage.unchecked, [
    { file: 'blob.js', reason: 'binary' },
    { file: 'main.zig', reason: 'no comment family' },
  ]);
}));

test('F10 no git: named files run with every line changed, and no scope fails closed', () => withRepo({
  git: false,
  change: { 'a.py': 'x = 1  # see ' + ADR_LABEL + '\n' },
}, (repo) => {
  fs.writeFileSync(path.join(repo.parent, 'outside.py'), 'y = 2\n');
  assertSnapshotUnchanged(repo, () => {
    const bare = repo.run([]);
    assert.equal(bare.status, 3);
    assert.equal(bare.verdict.gate, 'ERROR');
    assert.equal(bare.verdict.errors[0].code, 'NO_GIT_REPOSITORY');
    const named = repo.run(['--files', 'a.py']);
    assert.equal(named.status, 1);
    assert.equal(named.verdict.scope.mode, 'files');
    const [entry] = hygieneFindings(named.verdict);
    assert.deepEqual([entry.origin, entry.blocking], ['changed-line', true]);
    assert.equal(repo.run(['--files', 'missing.py']).verdict.errors[0].code, 'FILE_NOT_FOUND');
    assert.equal(repo.run(['--files', '../outside.py']).verdict.errors[0].code, 'FILE_OUTSIDE_ROOT');
  });
}));

test('F12 conflict and secret: both block and the key never reaches the output', () => withRepo({
  change: {
    'app.go': ['package a', OPEN + ' HEAD', 'var a = 1', MIDDLE, 'var a = 2', CLOSE + ' topic', 'var key = "' + AWS_KEY + '"', ''].join('\n'),
  },
}, (repo) => {
  const { status, verdict, stdout } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  const exact = verdict.findings.filter((entry) => entry.severity === 'P0' && entry.confidence === 'exact' && entry.blocking);
  assert.deepEqual(exact.map((entry) => [entry.rule, entry.line]), [['conflict.marker', 2], ['secret.aws-access-key', 7]]);
  assert.equal(exact[1].excerpt, null);
  for (const output of [stdout, repo.run(['--format', 'text']).stdout, repo.run(['--format', 'envelope']).stdout]) {
    assert.ok(!output.includes(AWS_KEY));
  }
}));

test('F13 shebang dispatch: the shebang picks the parser before the extension does', () => withRepo({
  change: {
    'tool.sh': '#!/usr/bin/env python3\nimport sys\nprint(sys.argv)\n',
    'bad.sh': '#!/bin/bash\nif true; then\n  echo hi\n',
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  assert.equal(check(verdict, 'syntax-python').state, 'RAN_CLEAN');
  assert.equal(check(verdict, 'syntax-shell').state, 'RAN_FAIL');
  const parse = verdict.findings.filter((entry) => entry.rule.startsWith('syntax.'));
  assert.deepEqual(parse.map((entry) => [entry.file, entry.rule, entry.severity, entry.blocking]), [['bad.sh', 'syntax.shell', 'P0', true]]);
}));

test('F14 CI target: a changed workflow lists the CI checklist the real hub declares', () => withRepo({
  hub: 'real',
  change: { '.github/workflows/x.yml': 'name: x\non: push\njobs:\n  a:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo hi\n' },
}, (repo) => {
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  const files = checklistFiles(verdict);
  assert.ok(files.includes('hub:sk-code/sk-code-ci/references/ci-workflow-standards.md'));
  assert.ok(files.includes('hub:sk-code/shared/references/universal/code-quality-standards.md'));
  assert.equal(check(verdict, 'syntax-yaml').files, 1);
}));

test('F16 SKILLED target: a hub file gets the house checklist and the override never moves a command', () => withRepo({
  hub: 'inside',
  base: { '.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh': '#!/usr/bin/env node\n' + HYGIENE_REPORT + '\n' },
  change: {
    '.skilled/skills/demo/run.py': 'import sys\nprint(sys.argv)\n',
    'src/run.py': 'x = 1  # see ' + ADR_LABEL + '\n',
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.ok(verdict.resolved_surface.includes('SKILLED'));
  assert.deepEqual(surfaceOf(verdict, '.skilled/skills/demo/run.py'), ['SKILLED']);
  assert.deepEqual(surfaceOf(verdict, 'src/run.py'), ['UNKNOWN']);
  const house = verdict.checklists.find((entry) => entry.file === 'hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md');
  assert.deepEqual(house.files, ['.skilled/skills/demo/run.py']);
  assert.ok(checklistFiles(verdict).includes('hub:sk-code/shared/references/universal/code-quality-standards.md'));
  assert.equal(check(verdict, 'comment-hygiene').argv[3], REAL_CHECKER);
  assert.equal(status, 1);
  assert.equal(hygieneFindings(verdict)[0].file, 'src/run.py');
}));

test('F17 python3 absent: hygiene is skipped, never clean, and the run is unverified', () => withRepo({
  change: { 'a.js': 'module.exports = 1;\n' },
}, (repo) => {
  const bin = onlyNodeOnPath(repo.parent);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', 'a.js'], { env: { PATH: bin } }));
  assert.equal(status, 4);
  assert.equal(verdict.gate, 'UNVERIFIED');
  const hygiene = check(verdict, 'comment-hygiene');
  assert.equal(hygiene.state, 'SKIPPED_ABSENT');
  assert.match(hygiene.repair, /python3/);
  assert.ok(verdict.summary.unverified.includes('comment-hygiene'));
  assert.equal(check(verdict, 'conflict-markers').state, 'RAN_CLEAN');
  assert.equal(check(verdict, 'syntax-node').state, 'RAN_CLEAN');
}));

test('F18 heuristic .js: JSX in a plain .js file is a heuristic finding that does not block', () => withRepo({
  change: { 'view.js': 'const a = <div>hi</div>;\nmodule.exports = a;\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.equal(verdict.gate, 'NO_BLOCKER_FOUND');
  const [entry] = verdict.findings.filter((item) => item.rule === 'syntax.js');
  assert.deepEqual([entry.confidence, entry.blocking], ['heuristic', false]);
  assert.equal(verdict.summary.p0_heuristic, 1);
}));

// ─────────────────────────────────────────────────────────────────────────────
// 5. UNIT CASES
// ─────────────────────────────────────────────────────────────────────────────

test('unit: argv spawn and guard', () => {
  const temp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skq-spawn-')));
  try {
    assert.equal(spawnArgv([process.execPath, '-e', 'process.exit(0)']).state, 'RAN_CLEAN');
    const failed = spawnArgv([process.execPath, '-e', 'process.exit(5)']);
    assert.deepEqual([failed.state, failed.exit], ['RAN_FAIL', 5]);
    assert.equal(spawnArgv([path.join(temp, 'sk-code-absent-tool')]).state, 'ERROR');
    assert.equal(spawnArgv([process.execPath, '-e', 'setTimeout(() => {}, 5000)'], { timeoutMs: 200 }).state, 'TIMEOUT');
    const literal = '$(touch pwned); echo hi';
    const echoed = spawnArgv([process.execPath, '-e', 'process.stdout.write(process.argv[1])', literal], { cwd: temp });
    assert.equal(echoed.stdout, literal);
    assert.ok(!fs.existsSync(path.join(temp, 'pwned')));
    const preload = spawnArgv([process.execPath, '-p', 'String(process.env.NODE_OPTIONS)'], {
      env: { ...process.env, NODE_OPTIONS: '--require /nonexistent/preload.cjs' },
    });
    assert.deepEqual([preload.state, preload.stdout.trim()], ['RAN_CLEAN', 'undefined']);
    assert.equal(findTool('sk-code-absent-tool', { PATH: temp }), null);
    assert.equal(findTool('node', { PATH: path.dirname(process.execPath) }), path.join(path.dirname(process.execPath), 'node'));
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }

  withRepo({ base: { 'notes.md': 'base\n', 'app.go': 'package a\n' }, change: { 'app.go': 'package a\n\nfunc A() {}\n' } }, (repo) => {
    const context = { root: repo.root, git: true, files: ['app.go'], env: repo.env };
    const first = withGuard(context, () => fs.appendFileSync(path.join(repo.root, 'notes.md'), 'edit\n'));
    assert.deepEqual(first.mutated, ['notes.md']);
    const second = withGuard(context, () => 'quiet', first.after);
    assert.deepEqual([second.value, second.mutated], ['quiet', []]);

    const target = path.join(repo.root, 'notes.md');
    const bin = fakePython(repo.parent, `require("fs").appendFileSync(process.env.SKQ_FIXTURE_TARGET, "changed\\n");\n${HYGIENE_REPORT}`);
    const run = repo.run([], { env: { PATH: `${bin}${path.delimiter}${repo.env.PATH}`, SKQ_FIXTURE_TARGET: target } });
    assert.equal(run.status, 3);
    assert.equal(run.verdict.gate, 'ERROR');
    const [error] = run.verdict.errors;
    assert.equal(error.code, 'CHECK_MUTATED_WORKSPACE');
    assert.equal(error.check, 'comment-hygiene');
    assert.deepEqual(error.paths, ['notes.md']);
    assert.equal(fs.readFileSync(target, 'utf8'), 'base\nedit\nchanged\n');
  });
});

test('unit: checker failure', () => withRepo({ change: { 'app.go': 'package a\n' } }, (repo) => {
  const garbage = fakePython(path.join(repo.parent, 'garbage'), 'process.stdout.write("not json"); process.exit(1);');
  const broken = assertSnapshotUnchanged(repo, () => repo.run([], { env: { PATH: `${garbage}${path.delimiter}${repo.env.PATH}` } }));
  assert.equal(broken.status, 4);
  assert.equal(check(broken.verdict, 'comment-hygiene').state, 'ERROR');
  const usage = fakePython(path.join(repo.parent, 'usage'),
    'process.stdout.write(JSON.stringify({ schema: "comment-hygiene/v1", exit_code: 3, files: [] })); process.exit(3);');
  const refused = repo.run([], { env: { PATH: `${usage}${path.delimiter}${repo.env.PATH}` } });
  assert.equal(refused.status, 4);
  assert.equal(check(refused.verdict, 'comment-hygiene').state, 'ERROR');
}));

test('unit: exit precedence', () => {
  const blocker = { blocking: true, severity: 'P0', confidence: 'exact' };
  const skipped = { id: 'comment-hygiene', origin: 'builtin', severity: 'P0', required: true, state: 'SKIPPED_ABSENT' };
  const optional = { id: 'syntax-toml', origin: 'builtin', severity: 'P0', required: false, state: 'SKIPPED_ABSENT' };
  const error = { code: 'GIT_FAILED', message: 'x' };
  const cases = [
    [{ errors: [error], findings: [blocker], checks: [skipped], filesChecked: 1 }, 'ERROR', 3],
    [{ findings: [blocker], checks: [skipped], filesChecked: 1 }, 'BLOCKED', 1],
    [{ checks: [skipped], filesChecked: 0 }, 'UNVERIFIED', 4],
    [{ checks: [optional], filesChecked: 0 }, 'NOTHING_CHECKED', 2],
    [{ findings: [{ ...blocker, confidence: 'heuristic' }], checks: [optional], filesChecked: 1 }, 'NO_BLOCKER_FOUND', 0],
  ];
  for (const [input, gate, exitCode] of cases) {
    const decision = decideGate(input);
    assert.deepEqual([decision.gate, decision.exit_code], [gate, exitCode], JSON.stringify(input));
  }

  withRepo({}, (repo) => {
    const empty = assertSnapshotUnchanged(repo, () => repo.run([]));
    assert.deepEqual([empty.status, empty.verdict.gate, empty.verdict.coverage.files_total], [2, 'NOTHING_CHECKED', 0]);
    repo.write({ 'big.go': 'package a\n' + '// filler line\n'.repeat(160000) });
    const big = assertSnapshotUnchanged(repo, () => repo.run([]));
    assert.equal(big.status, 2);
    assert.deepEqual(big.verdict.coverage.unchecked, [{ file: 'big.go', reason: 'size' }]);
    fs.writeFileSync(path.join(repo.hub, 'mode-registry.json'), '{ not json');
    const internal = repo.run([]);
    assert.deepEqual([internal.status, internal.verdict.gate, internal.verdict.errors[0].code], [3, 'ERROR', 'INTERNAL_ERROR']);
    assert.doesNotMatch(internal.stdout + internal.stderr, /\n\s+at /);
    const missingHub = repo.run([], { env: { SK_CODE_QUALITY_HUB_ROOT: path.join(repo.parent, 'no-hub') } });
    assert.equal(missingHub.verdict.errors[0].code, 'HUB_ROOT_INVALID');
  });

  withRepo({ change: { 'a.js': ['module.exports = 1;', OPEN + ' HEAD', ''].join('\n') } }, (repo) => {
    const bin = onlyNodeOnPath(repo.parent);
    const env = { env: { PATH: bin } };
    const json = assertSnapshotUnchanged(repo, () => repo.run(['--files', 'a.js'], env));
    assert.equal(json.status, 1);
    assert.equal(json.verdict.gate, 'BLOCKED');
    assert.ok(json.verdict.summary.unverified.includes('comment-hygiene'));
    for (const output of [json.stdout, repo.run(['--files', 'a.js', '--format', 'text'], env).stdout,
      repo.run(['--files', 'a.js', '--format', 'envelope'], env).stdout]) {
      assert.doesNotMatch(output, PASS_WORD);
    }
  });
});

test('unit: layers', () => {
  const hookText = '#!/bin/sh\nexec python3 "$ROOT/check-comment-hygiene.sh" "$@"\n';
  withRepo({
    change: {
      'app.go': 'package a\n',
      '.claude/settings.json': JSON.stringify({ hooks: { PostToolUse: [{ command: 'node .skilled/hooks/post-edit-quality/claude/adapter.cjs' }] } }),
    },
  }, (repo) => {
    const hook = path.join(repo.root, '.git', 'hooks', 'pre-commit');
    fs.writeFileSync(hook, hookText);
    fs.chmodSync(hook, 0o755);
    fs.mkdirSync(path.join(repo.root, '.github'));
    fs.writeFileSync(path.join(repo.root, '.github', 'workflows'), 'a file where a folder belongs\n');
    const first = assertSnapshotUnchanged(repo, () => repo.run(['--files', 'app.go'])).verdict.layers;
    assert.deepEqual(first, { pre_commit_hygiene: 'present', ci_hygiene: 'unknown', post_edit: 'broken' });

    fs.chmodSync(hook, 0o644);
    fs.rmSync(path.join(repo.root, '.github', 'workflows'));
    repo.write({
      '.github/workflows/hygiene.yml': 'on: push\njobs:\n  a:\n    runs-on: ubuntu-latest\n    steps:\n      - run: python3 check-comment-hygiene.sh\n',
      '.skilled/hooks/post-edit-quality/claude/adapter.cjs': 'module.exports = 1;\n',
    });
    const second = repo.run(['--files', 'app.go']).verdict.layers;
    assert.deepEqual(second, { pre_commit_hygiene: 'broken', ci_hygiene: 'present', post_edit: 'present' });

    const other = path.join(repo.parent, 'other');
    fs.mkdirSync(path.join(other, 'hooks'), { recursive: true });
    repo.git(['-C', other, 'init', '-q']);
    fs.writeFileSync(path.join(other, 'hooks', 'pre-commit'), `${hookText}# gated by skilled.trustRepoHooks\n`);
    fs.chmodSync(path.join(other, 'hooks', 'pre-commit'), 0o755);
    repo.git(['config', 'core.hooksPath', path.join(other, 'hooks')]);
    assert.equal(repo.run(['--files', 'app.go']).verdict.layers.pre_commit_hygiene, 'untrusted');
    repo.git(['config', '--local', 'skilled.trustRepoHooks', 'true']);
    assert.equal(repo.run(['--files', 'app.go']).verdict.layers.pre_commit_hygiene, 'present');
  });
  withRepo({ change: { 'app.go': 'package a\n' } }, (repo) => {
    assert.deepEqual(repo.run(['--files', 'app.go']).verdict.layers, { pre_commit_hygiene: 'absent', ci_hygiene: 'absent', post_edit: 'absent' });
  });
});

test('unit: compiler rejects', () => {
  const { compileRegistry, validateQualityDeclarations } = require(COMPILER);
  const readHub = () => ({
    registry: JSON.parse(fs.readFileSync(path.join(HUB_ROOT, 'mode-registry.json'), 'utf8')),
    hubRouter: JSON.parse(fs.readFileSync(path.join(HUB_ROOT, 'hub-router.json'), 'utf8')),
  });
  const compile = ({ registry, hubRouter }) => {
    const skillMarkdown = fs.readFileSync(path.join(HUB_ROOT, 'SKILL.md'), 'utf8');
    return compileRegistry({
      activationGeneration: 1,
      hubRouter,
      registry,
      skillMarkdown,
      sourceBytes: {
        'SKILL.md': Buffer.from(skillMarkdown, 'utf8'),
        'hub-router.json': Buffer.from(JSON.stringify(hubRouter), 'utf8'),
        'mode-registry.json': Buffer.from(JSON.stringify(registry), 'utf8'),
      },
    });
  };
  assert.ok(compile(readHub()).policy);
  const skilledRows = (registry) => registry.modes.find((mode) => mode.workflowMode === 'sk-code-skilled').quality.checklists;
  const broken = [
    (registry) => { registry.modes.find((mode) => mode.workflowMode === 'sk-code-quality').quality = { checklists: [{ paths: ['**'], file: 'a.md' }] }; },
    (registry) => { skilledRows(registry)[0].role = 'fallback'; },
    (registry) => { delete skilledRows(registry)[0].paths; },
    (registry) => { skilledRows(registry)[0].paths = []; },
    (registry) => { skilledRows(registry)[4].extensions = ['js']; },
    (registry) => { skilledRows(registry)[0].file = '../outside.md'; },
    (registry) => { skilledRows(registry)[0].file = 'sk-code-skilled/run.sh'; },
    (registry) => { registry.modes.find((mode) => mode.workflowMode === 'sk-code-ci').quality.commands = [['make', 'lint']]; },
    (registry) => { registry.modes.find((mode) => mode.workflowMode === 'sk-code-ci').quality = { checklists: [] }; },
  ];
  for (const mutate of broken) {
    const hub = readHub();
    mutate(hub.registry);
    assert.throws(() => validateQualityDeclarations(hub.registry), (error) => error.code === 'QUALITY_DECLARATION_INVALID', mutate.toString());
    assert.throws(() => compile(hub), (error) => error.code === 'QUALITY_DECLARATION_INVALID', mutate.toString());
  }
});

test('unit: real-path guard', () => withRepo({
  hub: 'inside',
  base: {
    '.skilled/skills/demo/inside.py': 'A = 1\n',
    '.skilled/skills/my tool/a b.py': 'B = 1\n',
    'other dir/c.py': 'C = 1\n',
    'src/d.py': 'D = 1\n',
  },
}, (repo) => {
  const elsewhere = path.join(repo.parent, 'elsewhere');
  fs.mkdirSync(path.join(elsewhere, '.skilled'), { recursive: true });
  fs.writeFileSync(path.join(elsewhere, '.skilled', 'tool.py'), 'E = 1\n');
  repo.git(['-C', elsewhere, 'init', '-q']);
  const privateDir = path.join(repo.parent, 'private', 'local-example');
  fs.mkdirSync(privateDir, { recursive: true });
  fs.writeFileSync(path.join(privateDir, 'f.py'), 'F = 1\n');
  fs.symlinkSync(elsewhere, path.join(repo.root, 'vendor'));
  fs.symlinkSync(privateDir, path.join(repo.root, '.skilled', 'skills', 'local-example'));
  fs.symlinkSync(path.join(repo.root, '.skilled', 'skills', 'demo'), path.join(repo.root, 'alias'));
  const files = [
    'vendor/.skilled/tool.py',
    '.skilled/skills/local-example/f.py',
    'src/../.skilled/skills/demo/inside.py',
    '.skilled/../src/d.py',
    '.skilled/skills/my tool/a b.py',
    'other dir/c.py',
    'alias/inside.py',
  ];
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', ...files]));
  assert.deepEqual(surfaceOf(verdict, 'vendor/.skilled/tool.py'), ['UNKNOWN']);
  assert.deepEqual(surfaceOf(verdict, '.skilled/skills/local-example/f.py'), ['UNKNOWN']);
  assert.deepEqual(surfaceOf(verdict, '.skilled/skills/demo/inside.py'), ['SKILLED']);
  assert.deepEqual(surfaceOf(verdict, 'src/d.py'), ['UNKNOWN']);
  assert.deepEqual(surfaceOf(verdict, '.skilled/skills/my tool/a b.py'), ['SKILLED']);
  assert.deepEqual(surfaceOf(verdict, 'other dir/c.py'), ['UNKNOWN']);
  assert.deepEqual(surfaceOf(verdict, 'alias/inside.py'), ['SKILLED']);
}));

test('unit: envelope', () => withRepo({ change: { 'app.go': 'package a\n' } }, (repo) => {
  const { status, stdout } = assertSnapshotUnchanged(repo, () => repo.run(['--format', 'envelope']));
  assert.equal(status, 0);
  const fields = envelopeFields(stdout);
  assert.deepEqual(fields.map(([key]) => key), ENVELOPE_KEYS);
  const value = Object.fromEntries(fields);
  assert.equal(value.schema_version, 'code-quality/v1');
  assert.equal(value.status, 'advisory');
  assert.equal(value.modified_files, 'app.go');
  assert.match(value.checker_outputs, CHECKER_OUTPUTS);
  for (const key of ['p0_p1_p2_decisions', 'accepted_deferrals', 'remaining_accepted_risk']) assert.equal(value[key], 'PENDING_AGENT_JUDGMENT');
  assert.equal(value.verification_handoff, 'workflow-verify.md');

  const failed = repo.run(['--format', 'envelope', '--files', 'missing.go']);
  assert.equal(failed.status, 3);
  assert.match(Object.fromEntries(envelopeFields(failed.stdout)).checker_outputs, /^code-quality-run\/v1 gate=ERROR exit=3 /);
}));

test('unit: private label', () => withRepo({
  hub: 'inside',
  base: {
    '.skilled/skills/local-example/graph-metadata.json': JSON.stringify({
      skill_id: 'local-example',
      family: 'sk-code',
      surface_detection: { label: 'example', role: 'specific', pathMarkers: ['local-example/'] },
    }),
  },
  change: {
    '.skilled/skills/local-example/run.js': 'module.exports = 1;\n',
    '.local-env.sh': 'echo hi\n',
    'nonlocal-config.js': 'module.exports = 2;\n',
    'docs/(local-draft).js': 'module.exports = 3;\n',
  },
}, (repo) => {
  const { stdout } = assertSnapshotUnchanged(repo, () => repo.run(['--format', 'envelope']));
  const value = Object.fromEntries(envelopeFields(stdout));
  assert.equal(value.resolved_surface, 'EXAMPLE, SKILLED');
  assert.ok(stdout.includes('EXAMPLE'));
  assert.doesNotMatch(stdout, /(?:^|[^A-Za-z0-9_.-])local-/m);
  assert.deepEqual(value.modified_files.split(', ').sort(),
    ['.local-env.sh', '.skilled/skills/<EXAMPLE>/run.js', 'docs/(<PRIVATE>).js', 'nonlocal-config.js']);
}));

test('unit: flags', () => withRepo({
  base: { 'app.go': 'package a\n\n// see ' + ADR_LABEL + '\nfunc A() {}\n' },
  change: { 'app.go': 'package a\n\n// see ' + ADR_LABEL + '\nfunc A() {}\nfunc B() {}\n' },
}, (repo) => {
  const canary = path.join(repo.parent, 'canary');
  const spy = fakePython(repo.parent, `require("fs").writeFileSync(${JSON.stringify(canary)}, "ran");\n${HYGIENE_REPORT}`);
  const spyPath = { env: { PATH: `${spy}${path.delimiter}${repo.env.PATH}` } };
  assertSnapshotUnchanged(repo, () => {
    assert.equal(repo.run([]).status, 0);
    const whole = repo.run(['--lines', 'file']);
    assert.equal(whole.status, 1);
    assert.equal(hygieneFindings(whole.verdict)[0].origin, 'changed-line');

    const only = repo.run(['--only', 'conflict-markers,secrets']);
    assert.equal(only.status, 4);
    assert.equal(check(only.verdict, 'comment-hygiene').state, 'SKIPPED_BY_FLAG');
    assert.equal(check(only.verdict, 'conflict-markers').state, 'RAN_CLEAN');
    assert.equal(repo.run(['--skip', 'comment-hygiene']).verdict.summary.unverified[0], 'comment-hygiene');

    const listed = repo.run(['--no-run'], spyPath);
    assert.equal(listed.status, 4);
    const hygiene = check(listed.verdict, 'comment-hygiene');
    assert.equal(hygiene.state, 'LISTED');
    assert.deepEqual(hygiene.argv.slice(-2), ['--', '{files}']);
    assert.equal(check(listed.verdict, 'secrets').state, 'RAN_CLEAN');

    const explained = repo.run(['--explain', 'app.go'], spyPath);
    assert.equal(explained.status, 2);
    assert.equal(explained.verdict.schema, 'code-quality-explain/v1');
    assert.equal(explained.verdict.language, 'go');
    assert.equal(explained.verdict.checks.find((item) => item.id === 'comment-hygiene').applies, true);
    assert.equal(explained.verdict.checks.find((item) => item.id === 'syntax-python').applies, false);
    assert.ok(explained.verdict.checklists.every((item) => typeof item.why === 'string' && item.why.length > 0));
    assert.ok(!fs.existsSync(canary));

    for (const args of [['--config', '/dev/null'], ['--only', 'sk-code-absent-check'], ['--timeout', '0'],
      ['--format', 'yaml'], ['--worktree', '--files', 'app.go'], ['--lines', 'some']]) {
      const refused = repo.run(args);
      assert.equal(refused.status, 3, args.join(' '));
      assert.equal(refused.verdict.errors[0].code, 'USAGE', args.join(' '));
    }
  });

  const stall = fakePython(path.join(repo.parent, 'stall'), 'setTimeout(() => {}, 10000);');
  const slow = repo.run(['--timeout', '0.3'], { env: { PATH: `${stall}${path.delimiter}${repo.env.PATH}` } });
  assert.equal(slow.status, 4);
  assert.equal(check(slow.verdict, 'comment-hygiene').state, 'TIMEOUT');
  const tiny = repo.run(['--timeout', '0.0004'], { env: { PATH: `${stall}${path.delimiter}${repo.env.PATH}` } });
  assert.equal(check(tiny.verdict, 'comment-hygiene').state, 'TIMEOUT');

  repo.git(['add', '-A']);
  repo.git(['commit', '-q', '--no-verify', '-m', 'second']);
  const ranged = repo.run(['--base', 'HEAD~1']);
  assert.deepEqual([ranged.verdict.scope.mode, ranged.verdict.scope.files], ['base', ['app.go']]);
  assert.equal(repo.run(['--base', 'sk-code-absent-ref']).verdict.errors[0].code, 'BASE_NOT_FOUND');
}));

test('unit: dist adapter', () => {
  const temp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skq-dist-')));
  try {
    const script = path.join(temp, 'fake-dist.py');
    fs.writeFileSync(script, [
      'import os, sys',
      'name = os.path.basename(sys.argv[1])',
      'if os.environ.get("SPECKIT_DIST_AUTO_REBUILD") != "0":',
      '    print("rebuild was left on")',
      'elif name.startswith("stale"):',
      '    print("STALE DIST WARNING: fixture-package -- run: npm run build")',
      'elif name.startswith("broken"):',
      '    print("DIST FRESHNESS CHECK ERROR: fixture-package -- could not verify")',
      'elif name.startswith("noisy"):',
      '    print("something else entirely")',
      '',
    ].join('\n'));
    const file = (name) => ({ rel: `dist/${name}`, abs: path.join(temp, name) });
    const env = { PATH: process.env.PATH, SPECKIT_DIST_AUTO_REBUILD: '1' };
    const options = { env, script, cwd: temp, timeoutMs: 20000 };

    const stale = runDistAdapter([file('stale.js')], options);
    assert.equal(stale.check.state, 'RAN_FAIL');
    assert.deepEqual(stale.check.argv, ['python3', '-B', script, '{file}']);
    assert.deepEqual(stale.findings.map((entry) => [entry.rule, entry.severity, entry.blocking]), [['dist.stale', 'P1', false]]);
    assert.equal(runDistAdapter([file('fresh.js')], options).check.state, 'RAN_CLEAN');
    assert.equal(runDistAdapter([file('broken.js')], options).check.state, 'ERROR');
    assert.equal(runDistAdapter([file('noisy.js')], options).check.state, 'ERROR');
    assert.equal(runDistAdapter([file('stale.js')], { ...options, noRun: true }).check.state, 'LISTED');
    assert.equal(runDistAdapter([file('stale.js')], { ...options, env: { ...env, SYSTEM_DIST_FRESHNESS_DISABLED: '1' } }).check.state, 'SKIPPED_BY_FLAG');
    const flags = path.join(temp, 'hook-flags.env');
    fs.writeFileSync(flags, 'SYSTEM_DIST_FRESHNESS_DISABLED="true"  # off for this case\n');
    assert.equal(runDistAdapter([file('stale.js')], { ...options, env: { ...env, HOOK_FLAGS_CONFIG: flags } }).check.state, 'SKIPPED_BY_FLAG');
    assert.equal(runDistAdapter([file('stale.js')], { ...options, env: { PATH: temp } }).check.state, 'SKIPPED_ABSENT');
    assert.equal(runDistAdapter([], options).check.state, 'NOT_APPLICABLE');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('unit: target map', () => {
  const skill = fs.readFileSync(path.join(QUALITY_ROOT, 'SKILL.md'), 'utf8');
  const section = (skill.split('### Target-Path Checklist Map')[1] || '').split(/\n#{2,3} /)[0];
  assert.ok(section.includes('| Owner |'), 'the target map table is missing');
  const rows = section.split('\n').filter((line) => line.startsWith('| ')).slice(2)
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()))
    .map(([owner, applies, checklist]) => ({
      owner,
      selectors: [...applies.matchAll(/`([^`]+)`/g)].map((match) => match[1]),
      checklist: checklist.replace(/`/g, ''),
    }));
  const tokens = (row) => ['paths', 'extensions', 'contentMarkers'].flatMap((key) => row[key] || []);
  const skillsDir = path.dirname(HUB_ROOT);
  const expected = [];
  const defaults = JSON.parse(fs.readFileSync(path.join(QUALITY_ROOT, 'assets', 'quality-defaults.json'), 'utf8'));
  for (const row of defaults.checklists) {
    const file = path.join(skillsDir, row.file.slice('hub:'.length));
    expected.push({ owner: 'quality defaults', selectors: tokens(row), checklist: path.relative(QUALITY_ROOT, file) });
  }
  const registry = JSON.parse(fs.readFileSync(path.join(HUB_ROOT, 'mode-registry.json'), 'utf8'));
  for (const mode of registry.modes) {
    const owner = mode.surfaceDetection ? mode.surfaceDetection.label.toUpperCase() : mode.workflowMode;
    for (const row of (mode.quality && mode.quality.checklists) || []) {
      expected.push({ owner, selectors: tokens(row), checklist: path.relative(QUALITY_ROOT, path.join(HUB_ROOT, row.file)) });
    }
  }
  assert.deepEqual(rows, expected);
});

test('unit: secret redaction: a key on a line that fails to parse, or past the excerpt limit, never prints', () => withRepo({
  change: {
    'a.mjs': 'export const k = 1 ' + AWS_KEY + ';\n',
    'b.cjs': 'const k = 1 ' + GITHUB_TOKEN + ';\n',
    'c.json': '{"k": ' + AWS_KEY_TWO + '}\n',
    'd.js': '// see ' + REQ_LONG + ' ' + 'x'.repeat(165) + ' ' + AWS_KEY + '\nmodule.exports = 1;\n',
  },
}, (repo) => {
  const { status, verdict, stdout } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  const parse = verdict.findings.filter((entry) => entry.rule.startsWith('syntax.'));
  assert.deepEqual(parse.map((entry) => [entry.file, entry.rule]), [['a.mjs', 'syntax.mjs'], ['b.cjs', 'syntax.cjs'], ['c.json', 'syntax.json']]);
  assert.ok(parse.every((entry) => /withheld/.test(entry.reason)));
  const [label] = hygieneFindings(verdict);
  assert.deepEqual([label.file, label.excerpt], ['d.js', null]);
  for (const output of [stdout, repo.run(['--format', 'text']).stdout, repo.run(['--format', 'envelope']).stdout]) {
    for (const key of [AWS_KEY, AWS_KEY_TWO, GITHUB_TOKEN]) assert.ok(!leaksKey(output, key), `part of ${key.slice(0, 4)} printed`);
  }
}));

test('unit: sensors: a marker or a key in a file with no comment family still blocks', () => withRepo({
  change: {
    'README.md': [OPEN + ' HEAD', 'a', MIDDLE, 'b', CLOSE + ' topic', ''].join('\n'),
    '.env': 'AWS_KEY=' + AWS_KEY + '\n',
    'notes.md': 'debugger;\n',
  },
}, (repo) => {
  const { status, verdict, stdout } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  assert.equal(verdict.gate, 'BLOCKED');
  assert.deepEqual(verdict.findings.map((entry) => [entry.file, entry.rule, entry.line, entry.blocking]),
    [['.env', 'secret.aws-access-key', 1, true], ['README.md', 'conflict.marker', 1, true]]);
  assert.deepEqual(verdict.coverage.unchecked.map((entry) => entry.reason), ['no comment family', 'no comment family', 'no comment family']);
  assert.equal(verdict.coverage.files_checked, 0);
  assert.ok(!leaksKey(stdout, AWS_KEY));
}));

test('unit: jsonc: tool configs parse as JSONC, and another .json that parses only as JSONC does not block', () => withRepo({
  change: {
    '.vscode/settings.json': '{\n  // editor\n  "a": 1,\n}\n',
    '.devcontainer/devcontainer.json': '{\n  // image\n  "a": 1\n}\n',
    '.eslintrc.json': '{\n  /* rules */\n  "a": 1\n}\n',
    'data.json': '{\n  // note\n  "a": 1\n}\n',
    'broken.json': '{"a": }\n',
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  assert.deepEqual(verdict.findings.map((entry) => [entry.file, entry.rule, entry.confidence, entry.blocking]),
    [['broken.json', 'syntax.json', 'exact', true], ['data.json', 'syntax.json', 'heuristic', false]]);
}));

test('unit: changed lines: a tracked file whose name holds a space keeps its changed lines', () => withRepo({
  base: { 'a b.js': 'module.exports = 1;\n', 'é f.py': 'A = 1\n' },
  change: { 'a b.js': 'module.exports = 1;\n// see ' + ADR_LABEL + '\n', 'é f.py': 'A = 1\n# see ' + REQ_LONG + '\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  assert.deepEqual(hygieneFindings(verdict).map((entry) => [entry.file, entry.line, entry.origin, entry.blocking]),
    [['a b.js', 2, 'changed-line', true], ['é f.py', 2, 'changed-line', true]]);
}));
