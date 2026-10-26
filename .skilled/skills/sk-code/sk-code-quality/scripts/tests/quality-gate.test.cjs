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

const { assertSnapshotUnchanged, buildRepo, trustRepoChecks } = require('./fixtures.cjs');
const { decideGate, nodeCheckRecords, nodeCheckResult, runDistAdapter } = require('../quality-gate.cjs');
const { findTool, spawnArgv, withGuard } = require('../lib/run-check.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const QUALITY_ROOT = path.resolve(__dirname, '..', '..');
const HUB_ROOT = path.dirname(QUALITY_ROOT);
const REAL_CHECKER = path.join(QUALITY_ROOT, 'scripts', 'check-comment-hygiene.sh');
const REAL_DIST_CHECKER = path.join(QUALITY_ROOT, 'scripts', 'check-dist-staleness.sh');
// A declared generated path sits under a folder the base layer excludes, so it is a
// stand-in for the built files a run must reach the dist adapter with.
const DECLARED_PATH = '.skilled/skills/system-spec-kit/runtime/cli/dist/spec/is-phase-parent.js';
const DECLARED_PACKAGE = DECLARED_PATH.split('/dist/')[0];
// The repository this hub lives in, which is the one the spec-folder checklist is scoped to.
const REPO_ROOT = path.resolve(HUB_ROOT, '..', '..', '..');
const SPEC_FOLDER_CHECKLIST = 'hub:system-spec-kit/references/workflows/spec-folder-authoring-checklist.md';
// The three surface-neutral rows: they hold no framework-specific house style, so they keep
// matching a .js file by its extension in any repository.
const STYLE_CHECKLISTS = Object.freeze([
  'hub:sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md',
  'hub:sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md',
  'hub:sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md',
]);
const COMPILER = path.resolve(HUB_ROOT, '..', '..', 'bin', 'lib', 'compiled-routing', '009-parent-hub-rollout', '001-sk-code', 'lib', 'registry-compiler.cjs');
// The freshness library the dist checker calls, read here so a case can ask for the
// read-only verdict without a shell in between.
const { checkFileFreshness, checkPackageFreshness } = require(path.join(HUB_ROOT, '..', 'system-spec-kit', 'runtime', 'cli', 'lib', 'dist-freshness.cjs'));

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
// JavaScript reads this as a control escape and Python's re refuses it, so the value
// passes the config validator and the hygiene checker is the one that rejects it.
const CHECKER_REFUSED_PATTERN = '\\cA';
// A nested set makes python warn on stderr before re refuses the bad escape that follows,
// so the checker's refusal is not the first line it writes there.
const NESTED_SET_REFUSED_PATTERN = '[[]\\cA';
const LAYER_STATE = '(?:present|absent|untrusted|broken|unknown)';
const CHECKER_OUTPUTS = new RegExp('^code-quality-run/v1 gate=(?:NO_BLOCKER_FOUND|BLOCKED|NOTHING_CHECKED|ERROR|UNVERIFIED) '
  + 'exit=[0-4] p0_blocking=\\d+ unverified=(?:none|[a-z0-9,-]+) unchecked=\\d+ '
  + `layers=pc:${LAYER_STATE},ci:${LAYER_STATE},pe:${LAYER_STATE}$`);
const ENVELOPE_KEYS = Object.freeze([
  'schema_version', 'status', 'modified_files', 'resolved_surface', 'checklists_loaded', 'checker_outputs',
  'p0_p1_p2_decisions', 'accepted_deferrals', 'verification_handoff', 'remaining_accepted_risk',
]);

// One outside declaration serves both cases below: the changed file falls inside the
// surface's markers in one and outside them in the other, so detection is the only
// difference between the two runs.
const OUTSIDE_SKILL = 'local-example';
const OUTSIDE_SURFACE = Object.freeze({ label: 'example', role: 'specific', pathMarkers: ['xsrc/'] });
const OUTSIDE_CHECKLIST = 'outside-checklist.md';
const OUTSIDE_CHECKLISTS = Object.freeze([Object.freeze({ extensions: ['.js'], file: OUTSIDE_CHECKLIST })]);

// Two skills that declare one label, and a third whose folder and skill id differ, so a
// case can tell a row that follows its skill from a row that follows a label, and a label
// that follows the folder from one that follows the skill id.
const SHARED_SURFACE = Object.freeze({ label: 'shared', role: 'specific', pathMarkers: ['asrc/'] });
const SHARED_CHECKLIST = 'alpha-checklist.md';
const PEER_SKILL = 'shared-peer';
const PEER_SURFACE = Object.freeze({ label: 'shared', role: 'specific', pathMarkers: ['bsrc/'] });
const PEER_CHECKLIST = 'beta-checklist.md';
const FOLDER_SKILL = 'local-folder';
const FOLDER_SURFACE = Object.freeze({ label: 'folder', role: 'specific', pathMarkers: ['fsrc/'] });
const UPPER_FOLDER_SKILL = 'Local-Folder';

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

// The freshness library maps a declared dist entry back to the package that built
// it, so a case seeds that package: its manifest, the entry's own sources and an
// empty node_modules, which is all provisioning asks for.
function declaredPackage() {
  return {
    [`${DECLARED_PACKAGE}/package.json`]: '{"name": "@spec-kit/cli"}\n',
    [`${DECLARED_PACKAGE}/tsconfig.json`]: '{"compilerOptions": {}}\n',
    [`${DECLARED_PACKAGE}/spec/is-phase-parent.ts`]: 'export const value = 1;\n',
    [DECLARED_PATH]: 'module.exports = 1;\n',
  };
}

// Explicit stamps, because a build that is fresh only by write order would make
// the case depend on how fast the fixture created its files.
function ageDeclaredPackage(repo, distNewer) {
  const older = (Date.now() - 120000) / 1000;
  const newer = (Date.now() - 60000) / 1000;
  for (const name of ['package.json', 'tsconfig.json', 'spec/is-phase-parent.ts']) {
    const stamp = distNewer ? older : newer;
    fs.utimesSync(path.join(repo.root, DECLARED_PACKAGE, name), stamp, stamp);
  }
  const distStamp = distNewer ? newer : older;
  fs.utimesSync(path.join(repo.root, DECLARED_PATH), distStamp, distStamp);
}

// The checker resolves its freshness library from the working directory, so a fixture
// tree holding its own library is a complete stand-in for a checker that cannot answer.
// The script under test is the shipped one, and the file it is handed is declared output.
function withUnassessableDist(libraryBody, body) {
  const temp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skq-unassessable-')));
  try {
    const library = path.join(temp, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli', 'lib', 'dist-freshness.cjs');
    fs.mkdirSync(path.dirname(library), { recursive: true });
    fs.writeFileSync(library, `${libraryBody}\n`);
    const file = { rel: 'dist/thing.js', abs: path.join(temp, 'dist', 'thing.js') };
    fs.mkdirSync(path.dirname(file.abs), { recursive: true });
    fs.writeFileSync(file.abs, 'module.exports = 1;\n');
    const python = findTool('python3', process.env);
    assert.ok(python, 'python3 is not on PATH, so this case cannot read the checker banner');
    const adapter = runDistAdapter([file], { env: { PATH: process.env.PATH }, cwd: temp, timeoutMs: 20000, script: REAL_DIST_CHECKER });
    const direct = spawnArgv([python, '-B', REAL_DIST_CHECKER, file.abs], {
      cwd: temp,
      env: { PATH: process.env.PATH, SPECKIT_DIST_AUTO_REBUILD: '0', SPECKIT_DIST_READ_ONLY: '1', SPECKIT_DIST_WORKSPACE_ROOT: temp },
      timeoutMs: 20000,
    });
    return body({ adapter, direct });
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
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

// A spec file this repository really keeps, found rather than named, so a case that proves the
// checklist stays here survives a packet that is archived or renamed. Breadth first and sorted,
// so the answer is the same on every machine.
function firstSpecFile() {
  const pending = [path.join(REPO_ROOT, 'specs')];
  while (pending.length > 0) {
    const dir = pending.shift();
    const entries = fs.readdirSync(dir, { withFileTypes: true })
      .sort((left, right) => (left.name < right.name ? -1 : 1));
    const named = entries.find((entry) => entry.isFile() && entry.name === 'spec.md');
    if (named) return path.join(dir, named.name);
    pending.push(...entries.filter((entry) => entry.isDirectory()).map((entry) => path.join(dir, entry.name)));
  }
  return null;
}

// The verdict fields two runs of the same idle change reproduce exactly. A duration or a
// config row differs between runs, so a case that only adds a declaration compares these.
function stableShape(verdict) {
  return {
    resolved_surface: verdict.resolved_surface,
    surfaces: verdict.surfaces,
    checklists: verdict.checklists.map((entry) => ({ ...entry })),
    checks: verdict.checks.map(({ id, origin, severity, required, state, files }) => ({ id, origin, severity, required, state, files })),
    findings: verdict.findings,
    coverage: verdict.coverage,
    summary: verdict.summary,
  };
}

// An outside skill is a sibling of the fixture hub that declares the hub's family, so a
// case can hand the runner a surface and a quality block it never ships with. The
// declaration reaches the runner only through the graph-metadata.json a real skill keeps.
// A row's file is written only when the row names one, so a case can also declare the
// shapes a metadata gate would refuse. A case that needs a block the `checklists`
// argument cannot express, such as one holding an unknown key, passes it whole.
function writeOutsideSkill(repo, name, surface, checklists, { skillId = name, quality } = {}) {
  const dir = path.join(path.dirname(repo.hub), name);
  fs.mkdirSync(dir, { recursive: true });
  const metadata = { schema_version: '1.0', skill_id: skillId, family: 'sk-code', surface_detection: surface, quality: quality === undefined ? { checklists } : quality };
  fs.writeFileSync(path.join(dir, 'graph-metadata.json'), `${JSON.stringify(metadata, null, 2)}\n`);
  for (const row of Array.isArray(checklists) ? checklists : []) {
    if (!row || typeof row.file !== 'string' || row.file === '') continue;
    const file = path.join(dir, row.file);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, '# Fixture checklist\n\nA stand-in for an outside skill checklist.\n');
  }
}

// A link is the one way a row can read as an inside path while resolving to a file the
// skill never shipped, so the link case skips on a platform that refuses to make one.
const SYMLINK_SUPPORT = (() => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'skq-link-'));
  try {
    fs.writeFileSync(path.join(dir, 'target'), '');
    fs.symlinkSync(path.join(dir, 'target'), path.join(dir, 'link'));
    return true;
  } catch {
    return false;
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
})();

// A link whose target is spelled in another case reaches the skill's own file only on a
// filesystem that ignores case, so the case link skips where the two spellings name two
// folders.
const CASE_INSENSITIVE_FS = (() => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'skq-case-'));
  try {
    fs.writeFileSync(path.join(dir, 'probe'), '');
    return fs.existsSync(path.join(dir, 'PROBE'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
})();

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

// A git that records every call before running the real one, so a case can count the
// workspace listings a run takes instead of trusting a claim about them.
function loggingGit(dir) {
  const bin = path.join(dir, 'git-bin');
  fs.mkdirSync(bin, { recursive: true });
  const log = path.join(dir, 'git-calls.log');
  const real = findTool('git', process.env);
  assert.ok(real, 'git is not on PATH, so this case cannot count the listings');
  const file = path.join(bin, 'git');
  fs.writeFileSync(file, `#!/bin/sh\nprintf '%s\\n' "$*" >> "$SKQ_FIXTURE_GIT_LOG"\nexec "${real}" "$@"\n`);
  fs.chmodSync(file, 0o755);
  return { bin, log };
}

function gitCalls(log) {
  try {
    return fs.readFileSync(log, 'utf8').split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

// One line per untracked listing, the walk that costs more than every other git call a
// run makes. A call that names the folders it was bounded to is still one listing.
function listingCalls(log) {
  return gitCalls(log).filter((line) => line.includes('ls-files --others'));
}

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

test('F15 outside skill: its quality checklist is listed under its public label', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, OUTSIDE_CHECKLISTS);
  const runs = assertSnapshotUnchanged(repo, () => ({ envelope: repo.run(['--format', 'envelope']), json: repo.run([]) }));
  const fields = Object.fromEntries(envelopeFields(runs.envelope.stdout));
  const listed = runs.json.verdict.checklists.find((entry) => entry.file.endsWith(`/${OUTSIDE_CHECKLIST}`));
  assert.ok(listed, 'the outside checklist was never listed');
  assert.match(listed.why, /^EXAMPLE surface, extensions \.js$/);
  assert.deepEqual(listed.files, ['xsrc/run.js']);
  assert.ok(fields.checklists_loaded.includes(OUTSIDE_CHECKLIST));
  assert.equal(fields.resolved_surface, 'EXAMPLE');
  assert.doesNotMatch(runs.envelope.stdout, /(?:^|[^A-Za-z0-9_.-])local-/m);
  assert.deepEqual(runs.json.verdict.errors, []);
}));

test('F15 negative: a file outside the outside surface\'s markers lists no outside checklist', () => withRepo({
  hub: 'sibling',
  change: { 'ysrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, OUTSIDE_CHECKLISTS);
  const runs = assertSnapshotUnchanged(repo, () => ({ envelope: repo.run(['--format', 'envelope']), json: repo.run([]) }));
  const fields = Object.fromEntries(envelopeFields(runs.envelope.stdout));
  assert.deepEqual(surfaceOf(runs.json.verdict, 'ysrc/run.js'), ['UNKNOWN']);
  assert.deepEqual(runs.json.verdict.checklists.filter((entry) => entry.file.endsWith(`/${OUTSIDE_CHECKLIST}`)), []);
  assert.ok(!fields.checklists_loaded.includes(OUTSIDE_CHECKLIST));
  assert.doesNotMatch(fields.resolved_surface, /EXAMPLE/);
  assert.deepEqual(runs.json.verdict.errors, []);
}));

test('F42 outside skill escape: a row outside the skill folder is refused, never read and never listed', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  const escapeRows = [
    Object.freeze({ extensions: ['.js'], file: '../../../SECRET.md' }),
    Object.freeze({ extensions: ['.js'], file: '../sk-code/SKILL.md' }),
    Object.freeze({ extensions: ['.js'], file: '/etc/hosts' }),
  ];
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, escapeRows);
  // The first two rows name a file that really sits above the skill folder, so a reader
  // that followed the row out would find it and list it.
  fs.writeFileSync(path.join(repo.parent, 'SECRET.md'), '# Escaped fixture\n');
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.code), escapeRows.map(() => 'CHECKLIST_OUTSIDE_SKILL'));
  escapeRows.forEach((row, index) => {
    const entry = verdict.config.errors[index];
    assert.match(entry.message, new RegExp(`^EXAMPLE quality\\.checklists\\[${index}\\] `));
    assert.ok(entry.message.includes(JSON.stringify(row.file)), entry.message);
    assert.equal(typeof entry.repair, 'string');
  });
  assert.deepEqual(checklistFiles(verdict).filter((file) => file.startsWith(`hub:${OUTSIDE_SKILL}/`)), []);
  assert.deepEqual(surfaceOf(verdict, 'xsrc/run.js'), ['EXAMPLE']);
  assert.equal(check(verdict, 'syntax-node').state, 'RAN_CLEAN');
}));

test('F43 outside skill row shape: every malformed row is skipped by name and the run is otherwise the same', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  const good = Object.freeze({ extensions: ['.js'], file: OUTSIDE_CHECKLIST });
  const malformed = [
    [null, /must be a JSON object/],
    [Object.freeze({ extensions: ['.js'] }), /file must name a \.md path/],
    [Object.freeze({ extensions: ['.js'], file: 42 }), /file must name a \.md path/],
    [Object.freeze({ file: 'no-selector.md' }), /names no selector/],
    [Object.freeze({ extensions: '.js', file: 'string-extensions.md' }), /extensions must be a non-empty array/],
    [Object.freeze({ extensions: ['.js'], file: '' }), /file must name a \.md path/],
  ];
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [good]);
  const baseline = assertSnapshotUnchanged(repo, () => repo.run([]));
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [...malformed.map(([row]) => row), good]);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.code), malformed.map(() => 'CHECKLIST_ROW_INVALID'));
  malformed.forEach(([, pattern], index) => {
    const entry = verdict.config.errors[index];
    assert.match(entry.message, new RegExp(`^EXAMPLE quality\\.checklists\\[${index}\\] `));
    assert.match(entry.message, pattern);
  });
  assert.deepEqual(stableShape(verdict), stableShape(baseline.verdict));
  const listed = verdict.checklists.find((entry) => entry.file.endsWith(`/${OUTSIDE_CHECKLIST}`));
  assert.ok(listed, 'the well-formed row stopped listing');
  assert.deepEqual(listed.files, ['xsrc/run.js']);
}));

test('F44 shared label: two outside skills each list only the row they shipped', () => withRepo({
  hub: 'sibling',
  change: { 'asrc/run.js': 'module.exports = 1;\n', 'bsrc/run.js': 'module.exports = 2;\n' },
}, (repo) => {
  writeOutsideSkill(repo, OUTSIDE_SKILL, SHARED_SURFACE, [Object.freeze({ extensions: ['.js'], file: SHARED_CHECKLIST })]);
  writeOutsideSkill(repo, PEER_SKILL, PEER_SURFACE, [Object.freeze({ extensions: ['.js'], file: PEER_CHECKLIST })]);
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.deepEqual(verdict.resolved_surface, ['SHARED']);
  const ownRow = (skill, checklist) => verdict.checklists.find((entry) => entry.file === `hub:${skill}/${checklist}`);
  const alpha = ownRow(OUTSIDE_SKILL, SHARED_CHECKLIST);
  const beta = ownRow(PEER_SKILL, PEER_CHECKLIST);
  assert.ok(alpha && beta, 'an outside row was never listed');
  assert.deepEqual(alpha.files, ['asrc/run.js']);
  assert.deepEqual(beta.files, ['bsrc/run.js']);
  assert.deepEqual(verdict.config.errors, []);
}));

test('F45 outside skill folder and skill id: the hub label follows the folder and no private folder prints', () => withRepo({
  hub: 'sibling',
  change: { 'fsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  writeOutsideSkill(repo, FOLDER_SKILL, FOLDER_SURFACE, OUTSIDE_CHECKLISTS, { skillId: 'folder-identity' });
  const runs = assertSnapshotUnchanged(repo, () => ({ envelope: repo.run(['--format', 'envelope']), json: repo.run([]) }));
  const listed = runs.json.verdict.checklists.find((entry) => entry.file.endsWith(`/${OUTSIDE_CHECKLIST}`));
  assert.ok(listed, 'the row the folder names was never listed');
  assert.equal(listed.file, `hub:${FOLDER_SKILL}/${OUTSIDE_CHECKLIST}`);
  assert.ok(fs.existsSync(listed.path), `${listed.path} is not the file the skill shipped`);
  assert.deepEqual(runs.json.verdict.config.errors, []);
  assert.deepEqual(runs.json.verdict.resolved_surface, ['FOLDER']);
  const fields = Object.fromEntries(envelopeFields(runs.envelope.stdout));
  assert.ok(fields.checklists_loaded.includes(`hub:<FOLDER>/${OUTSIDE_CHECKLIST}`), fields.checklists_loaded);
  assert.doesNotMatch(runs.envelope.stdout, /(?:^|[^A-Za-z0-9_.-])local-/m);
}));

test('F46 outside skill link escape: a row that links out of the skill folder is refused', { skip: !SYMLINK_SUPPORT && 'symbolic links are unavailable' }, () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  const outside = path.join(repo.parent, 'outside');
  fs.mkdirSync(outside);
  fs.writeFileSync(path.join(repo.parent, 'SECRET.md'), '# Escaped fixture\n');
  fs.writeFileSync(path.join(outside, 'x.md'), '# Escaped fixture\n');
  const linkRows = [
    Object.freeze({ extensions: ['.js'], file: 'link.md' }),
    Object.freeze({ extensions: ['.js'], file: 'd/x.md' }),
    Object.freeze({ extensions: ['.js'], file: 'gone.md' }),
  ];
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, linkRows);
  // The helper writes a stub at each row path, so the three inside paths a link takes over
  // start as regular files and are replaced here: one names a file above the skill folder,
  // one a folder above it, and one a target that is not there at all.
  const skillDir = path.join(path.dirname(repo.hub), OUTSIDE_SKILL);
  fs.rmSync(path.join(skillDir, 'link.md'));
  fs.symlinkSync(path.join(repo.parent, 'SECRET.md'), path.join(skillDir, 'link.md'));
  fs.rmSync(path.join(skillDir, 'd'), { recursive: true, force: true });
  fs.symlinkSync(outside, path.join(skillDir, 'd'));
  fs.rmSync(path.join(skillDir, 'gone.md'));
  fs.symlinkSync(path.join(skillDir, 'nowhere.md'), path.join(skillDir, 'gone.md'));
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.code), ['CHECKLIST_OUTSIDE_SKILL', 'CHECKLIST_OUTSIDE_SKILL', 'CHECKLIST_MISSING']);
  // The two rows that read out are refused before a path is tested. The third has no
  // target to resolve, so it is a row whose file is not there, never a path outside.
  assert.deepEqual(checklistFiles(verdict).filter((file) => file.startsWith(`hub:${OUTSIDE_SKILL}/`)), [`hub:${OUTSIDE_SKILL}/gone.md`]);
  assert.deepEqual(surfaceOf(verdict, 'xsrc/run.js'), ['EXAMPLE']);
}));

test('F47 shared hub label: an outside skill that reuses a hub label pulls no hub row', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  const reused = Object.freeze({ label: 'skilled', role: 'specific', pathMarkers: ['xsrc/'] });
  writeOutsideSkill(repo, OUTSIDE_SKILL, reused, OUTSIDE_CHECKLISTS);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.equal(verdict.gate, 'NO_BLOCKER_FOUND');
  assert.deepEqual(surfaceOf(verdict, 'xsrc/run.js'), ['SKILLED']);
  const own = verdict.checklists.find((entry) => entry.file === `hub:${OUTSIDE_SKILL}/${OUTSIDE_CHECKLIST}`);
  assert.ok(own, 'the row the skill shipped was never listed');
  assert.deepEqual(own.files, ['xsrc/run.js']);
  // A hub row from a mode's detection block reads `hub:<hub>/...` and names its owner's
  // surface in `why`, so the row a reused label would pull is the one that says SKILLED
  // surface. The outside row names its own folder instead, and the base-layer rows name
  // no owner at all.
  assert.deepEqual(verdict.checklists.filter((entry) => entry.file.startsWith('hub:sk-code/') && entry.why.startsWith('SKILLED surface')), []);
  assert.deepEqual(verdict.config.errors, []);
}));

test('F48 shared skill id: two skills with one id each list only the row they shipped', () => withRepo({
  hub: 'sibling',
  change: { 'asrc/run.js': 'module.exports = 1;\n', 'bsrc/run.js': 'module.exports = 2;\n' },
}, (repo) => {
  const identity = Object.freeze({ skillId: 'shared-identity' });
  writeOutsideSkill(repo, OUTSIDE_SKILL, SHARED_SURFACE, [Object.freeze({ extensions: ['.js'], file: SHARED_CHECKLIST })], identity);
  writeOutsideSkill(repo, PEER_SKILL, PEER_SURFACE, [Object.freeze({ extensions: ['.js'], file: PEER_CHECKLIST })], identity);
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  const alpha = verdict.checklists.find((entry) => entry.file === `hub:${OUTSIDE_SKILL}/${SHARED_CHECKLIST}`);
  const beta = verdict.checklists.find((entry) => entry.file === `hub:${PEER_SKILL}/${PEER_CHECKLIST}`);
  assert.ok(alpha && beta, 'a row one of the skills shipped was never listed');
  assert.deepEqual(alpha.files, ['asrc/run.js']);
  assert.deepEqual(beta.files, ['bsrc/run.js']);
  assert.deepEqual(verdict.config.errors, []);
}));

test('F49 outside skill dot segments: a .. segment is refused and a dotted name is not', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  const dotted = Object.freeze({ extensions: ['.js'], file: '..notes.md' });
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [
    Object.freeze({ extensions: ['.js'], file: 'a/../c.md' }),
    Object.freeze({ extensions: ['.js'], file: `./../${OUTSIDE_SKILL}/c.md` }),
    dotted,
  ]);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  const errors = verdict.config.errors;
  assert.deepEqual(errors.map((entry) => entry.code), ['CHECKLIST_ROW_INVALID', 'CHECKLIST_ROW_INVALID']);
  assert.match(errors[0].message, /^EXAMPLE quality\.checklists\[0\] names "a\/\.\.\/c\.md", which holds a \.\. segment$/);
  assert.match(errors[1].message, /^EXAMPLE quality\.checklists\[1\] names "\.\/\.\.\/local-example\/c\.md", which holds a \.\. segment$/);
  const own = verdict.checklists.find((entry) => entry.file === `hub:${OUTSIDE_SKILL}/${dotted.file}`);
  assert.ok(own, 'the row whose name only begins with dots was refused');
  assert.deepEqual(own.files, ['xsrc/run.js']);
}));

test('F50 outside skill block shape: a quality block a reader cannot follow is refused', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  // One block carries an unknown key beside a string where the list belongs, the other
  // carries an empty list. Neither can name a row, and neither may read as no block. The
  // peer's surface reaches no scoped file, so only the block the change reaches gates.
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [], { quality: { checklists: 'nope', command: 'x' } });
  writeOutsideSkill(repo, PEER_SKILL, PEER_SURFACE, [], { quality: { checklists: [] } });
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.code), ['CHECKLIST_ROW_INVALID', 'CHECKLIST_ROW_INVALID']);
  assert.deepEqual(verdict.config.warnings.map((entry) => entry.code), ['CHECKLIST_ROW_INVALID']);
  const messages = verdict.config.errors.map((entry) => entry.message);
  assert.match(messages[0], /^EXAMPLE quality holds unknown key command\. A skill names checklists only, never a command$/);
  assert.match(messages[1], /^EXAMPLE quality checklists must be a non-empty array$/);
  assert.match(verdict.config.warnings[0].message, /^SHARED quality checklists must be a non-empty array$/);
  assert.equal(typeof verdict.config.warnings[0].repair, 'string');
  assert.deepEqual(verdict.checklists.filter((entry) => /^(?:EXAMPLE|SHARED) surface/.test(entry.why)), []);
  assert.deepEqual(surfaceOf(verdict, 'xsrc/run.js'), ['EXAMPLE']);
}));

test('F52 outside skill block type: a quality value that is not an object is refused', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  // A string or a null where the block belongs names no row, and neither may read as
  // a skill that declared nothing. Only the peer's block reaches no scoped file.
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [], { quality: 'nope' });
  writeOutsideSkill(repo, PEER_SKILL, PEER_SURFACE, [], { quality: null });
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.message), ['EXAMPLE quality must be a JSON object']);
  assert.deepEqual(verdict.config.warnings.map((entry) => entry.message), ['SHARED quality must be a JSON object']);
}));

// A malformed declaration is reported whether or not the change reaches it. The two cases
// below hold one row and differ only in the scoped file, so surface detection is the whole
// difference between a warning and a gate.
test('outside skill fault: a malformed row whose surface reaches no scoped file never gates', () => withRepo({
  hub: 'sibling',
  change: { 'ysrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [Object.freeze({ file: 'no-selector.md' })]);
  const runs = assertSnapshotUnchanged(repo, () => ({ json: repo.run([]), text: repo.run(['--format', 'text']) }));
  assert.equal(runs.json.status, 0);
  assert.equal(runs.json.verdict.gate, 'NO_BLOCKER_FOUND');
  assert.deepEqual(runs.json.verdict.config.errors, []);
  assert.deepEqual(runs.json.verdict.config.warnings.map((entry) => entry.code), ['CHECKLIST_ROW_INVALID']);
  assert.match(runs.json.verdict.config.warnings[0].message, /^EXAMPLE quality\.checklists\[0\] names no selector/);
  assert.equal(typeof runs.json.verdict.config.warnings[0].repair, 'string');
  assert.deepEqual(surfaceOf(runs.json.verdict, 'ysrc/run.js'), ['UNKNOWN']);
  assert.match(runs.text.stdout, /^warning CHECKLIST_ROW_INVALID: EXAMPLE quality\.checklists\[0\] names no selector/m);
}));

test('outside skill fault: the same malformed row with a scoped file its surface reaches gates', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [Object.freeze({ file: 'no-selector.md' })]);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.code), ['CHECKLIST_ROW_INVALID']);
  assert.match(verdict.config.errors[0].message, /^EXAMPLE quality\.checklists\[0\] names no selector/);
  assert.deepEqual(verdict.config.warnings, []);
  assert.deepEqual(surfaceOf(verdict, 'xsrc/run.js'), ['EXAMPLE']);
}));

test('outside skill fault: one scoped file the surface reaches among several it does not still gates', () => withRepo({
  hub: 'sibling',
  change: {
    'xsrc/run.js': 'module.exports = 1;\n',
    'ysrc/a.js': 'module.exports = 2;\n',
    'ysrc/b.js': 'module.exports = 3;\n',
    'ysrc/c.js': 'module.exports = 4;\n',
  },
}, (repo) => {
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [Object.freeze({ file: 'no-selector.md' })]);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.code), ['CHECKLIST_ROW_INVALID']);
  assert.match(verdict.config.errors[0].message, /^EXAMPLE quality\.checklists\[0\] names no selector/);
  assert.deepEqual(verdict.config.warnings, []);
  assert.deepEqual(surfaceOf(verdict, 'xsrc/run.js'), ['EXAMPLE']);
  assert.deepEqual(surfaceOf(verdict, 'ysrc/a.js'), ['UNKNOWN']);
}));

test('outside skill fault: --explain reports a fault whose surface reaches no file as a warning', () => withRepo({
  hub: 'inside',
  base: { '.skilled/tools/x.js': 'module.exports = 1;\n' },
}, (repo) => {
  // The skill reuses the hub's own label, so the label this file resolves to is the one the
  // fault carries while the folder that declared it detected nothing.
  writeOutsideSkill(repo, OUTSIDE_SKILL, Object.freeze({ label: 'skilled', role: 'specific', pathMarkers: ['xsrc/'] }), [],
    { quality: { checklists: 'nope' } });
  const explained = assertSnapshotUnchanged(repo, () => repo.run(['--explain', '.skilled/tools/x.js']));
  assert.equal(explained.status, 2);
  assert.deepEqual(explained.verdict.surfaces, ['SKILLED']);
  assert.deepEqual(explained.verdict.errors, []);
  assert.deepEqual(explained.verdict.config.warnings.map((entry) => entry.message),
    ['SKILLED quality checklists must be a non-empty array']);
}));

test('F51 outside skill folder row: a row that names a folder is reported missing', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  const row = Object.freeze({ extensions: ['.js'], file: 'notes.md' });
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [row]);
  // A folder spelled like a checklist satisfies an existence test and nothing else.
  const target = path.join(path.dirname(repo.hub), OUTSIDE_SKILL, row.file);
  fs.rmSync(target);
  fs.mkdirSync(target);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.code), ['CHECKLIST_MISSING']);
  assert.match(verdict.config.errors[0].message, /notes\.md is declared but .*notes\.md is not a regular file$/);
}));

test('F53 outside skill folder link without a file: the row is refused outside and never listed', { skip: !SYMLINK_SUPPORT && 'symbolic links are unavailable' }, () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  const row = Object.freeze({ extensions: ['.js'], file: 'd/gone.md' });
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [row]);
  // The helper writes a stub for the row, so the folder it sits in is replaced here by a
  // link whose target holds no checklist. The name reads as an inside path until the
  // link is resolved, and the folder it resolves through is the one that decides.
  const skillDir = path.join(path.dirname(repo.hub), OUTSIDE_SKILL);
  fs.rmSync(path.join(skillDir, 'd'), { recursive: true, force: true });
  fs.mkdirSync(path.join(repo.parent, 'outside'));
  fs.symlinkSync(path.join(repo.parent, 'outside'), path.join(skillDir, 'd'));
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.code), ['CHECKLIST_OUTSIDE_SKILL']);
  assert.match(verdict.config.errors[0].message, /^EXAMPLE quality\.checklists\[0\] names "d\/gone\.md", which lies outside the skill folder$/);
  assert.deepEqual(checklistFiles(verdict).filter((file) => file.startsWith(`hub:${OUTSIDE_SKILL}/`)), []);
}));

test('F54 private folder in another case: the envelope carries the label, never the folder', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  writeOutsideSkill(repo, UPPER_FOLDER_SKILL, OUTSIDE_SURFACE, OUTSIDE_CHECKLISTS, { skillId: 'public-id' });
  const runs = assertSnapshotUnchanged(repo, () => ({ envelope: repo.run(['--format', 'envelope']), json: repo.run([]) }));
  const listed = runs.json.verdict.checklists.find((entry) => entry.file === `hub:${UPPER_FOLDER_SKILL}/${OUTSIDE_CHECKLIST}`);
  assert.ok(listed, 'the row the folder names was never listed');
  assert.deepEqual(listed.files, ['xsrc/run.js']);
  assert.deepEqual(runs.json.verdict.config.errors, []);
  assert.deepEqual(runs.json.verdict.resolved_surface, ['EXAMPLE']);
  const fields = Object.fromEntries(envelopeFields(runs.envelope.stdout));
  assert.ok(fields.checklists_loaded.includes(`hub:<EXAMPLE>/${OUTSIDE_CHECKLIST}`), fields.checklists_loaded);
  // The match ignores case, because a repository that ignores case lets the same folder
  // be tracked under another spelling, and that spelling is just as private.
  assert.doesNotMatch(runs.envelope.stdout, /(?:^|[^A-Za-z0-9_.-])local-/im);
  assert.doesNotMatch(runs.envelope.stdout, new RegExp(UPPER_FOLDER_SKILL, 'i'));
}));

test('F55 outside skill link in another case: a link to the skill\'s own file reads inside', {
  skip: (!SYMLINK_SUPPORT && 'symbolic links are unavailable') || (!CASE_INSENSITIVE_FS && 'the filesystem distinguishes case'),
}, () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  const skillDir = path.join(path.dirname(repo.hub), OUTSIDE_SKILL);
  const row = Object.freeze({ extensions: ['.js'], file: 'l.md' });
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [row]);
  // The row's stub is replaced by a link whose target spells the skill folder in the
  // other case. Both ends resolve to the one folder on disk, so the row names the
  // skill's own file and no path outside it.
  fs.writeFileSync(path.join(skillDir, 'c.md'), '# Fixture checklist\n');
  fs.rmSync(path.join(skillDir, row.file));
  fs.symlinkSync(path.join(path.dirname(repo.hub), OUTSIDE_SKILL.toUpperCase(), 'c.md'), path.join(skillDir, row.file));
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.equal(verdict.gate, 'NO_BLOCKER_FOUND');
  assert.deepEqual(verdict.config.errors, []);
  const listed = verdict.checklists.find((entry) => entry.file === `hub:${OUTSIDE_SKILL}/${row.file}`);
  assert.ok(listed, 'the row that links to the skill\'s own file was refused');
  assert.deepEqual(listed.files, ['xsrc/run.js']);
  assert.equal(fs.realpathSync.native(listed.path), fs.realpathSync.native(path.join(skillDir, 'c.md')));
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

// The base layer excludes every dist folder, and it also declares the built files this
// repository holds. A declared path reaches the dist adapter alone, and the fixture
// package is fresh, so an empty banner is a real verdict rather than a silent skip.
test('F20 declared generated path: the dist adapter reads it and no other check does', () => withRepo({
  change: declaredPackage(),
}, (repo) => {
  fs.mkdirSync(path.join(repo.root, DECLARED_PACKAGE, 'node_modules'), { recursive: true });
  ageDeclaredPackage(repo, true);
  const { status, verdict, fresh } = assertSnapshotUnchanged(repo, () => {
    // The direct verdict proves which package and entry the lookup chose, and the
    // snapshot proves the read-only call wrote no cache record beside the build.
    const direct = checkFileFreshness(path.join(repo.root, DECLARED_PATH), { workspaceRoot: repo.root, readOnly: true });
    return { fresh: direct, ...repo.run(['--files', DECLARED_PATH]) };
  });
  assert.deepEqual([fresh.packageId, fresh.entry, fresh.status], ['system-spec-kit/runtime/cli', 'is-phase-parent', 'fresh']);
  const dist = check(verdict, 'dist-staleness');
  assert.deepEqual([dist.state, dist.files, dist.repair], ['RAN_CLEAN', 1, null]);
  assert.deepEqual(verdict.findings, []);
  assert.deepEqual(verdict.coverage.unchecked, []);
  assert.equal(verdict.coverage.files_checked, 1);
  assert.deepEqual(verdict.surfaces, []);
  for (const entry of verdict.checks.filter((row) => row.id !== 'dist-staleness')) {
    assert.equal(entry.state, 'NOT_APPLICABLE', `${entry.id} read the built file`);
  }
  assert.equal(status, 0);
}));

// The counter case: the same declared path with a source newer than its build must
// report stale and name the file, which only a real check against the package can do.
test('F20b declared generated path: a newer source reports stale and names the file', () => withRepo({
  change: declaredPackage(),
}, (repo) => {
  fs.mkdirSync(path.join(repo.root, DECLARED_PACKAGE, 'node_modules'), { recursive: true });
  ageDeclaredPackage(repo, false);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', DECLARED_PATH]));
  const dist = check(verdict, 'dist-staleness');
  assert.deepEqual([dist.state, dist.files], ['RAN_FAIL', 1]);
  assert.deepEqual(verdict.findings.map((entry) => [entry.file, entry.rule, entry.blocking]),
    [[DECLARED_PATH, 'dist.stale', false]]);
  assert.equal(status, 0);
}));

// The spec-folder checklist is a framework-specific standard, so it is scoped to the repository
// that owns this hub. A foreign repository with a specs/ folder would otherwise be handed a
// standard the runner cannot check, while the surface-neutral .js rows stay because they carry
// no house style.
test('F21 foreign repository: a specs/ folder lists no spec-folder checklist', () => withRepo({
  hub: 'real',
  change: {
    'specs/demo/spec.md': '# Demo\n\nA fixture specification.\n',
    'specs/demo/notes.js': 'module.exports = 1;\n',
  },
}, (repo) => {
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.deepEqual(surfaceOf(verdict, 'specs/demo/spec.md'), ['UNKNOWN']);
  assert.deepEqual(surfaceOf(verdict, 'specs/demo/notes.js'), ['UNKNOWN']);
  const files = checklistFiles(verdict);
  assert.ok(!files.includes(SPEC_FOLDER_CHECKLIST), 'a foreign repository was handed the spec-folder checklist');
  for (const file of STYLE_CHECKLISTS) assert.ok(files.includes(file), `${file} left a foreign .js file`);
}));

// The same row still lists for this repository's own spec docs, which resolve to no surface, so
// the scope is the repository boundary and not the file's label.
test('F22 own repository: a spec file keeps the spec-folder checklist', () => withRepo({ hub: 'real' }, (repo) => {
  const spec = firstSpecFile();
  assert.ok(spec, 'this repository keeps no spec.md under specs/');
  const rel = path.relative(REPO_ROOT, spec);
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', rel], { cwd: REPO_ROOT }));
  assert.ok(checklistFiles(verdict).includes(SPEC_FOLDER_CHECKLIST), 'this repository lost its own spec-folder checklist');
}));

// A dist check that holds no verdict is not a clean build. Each shape below is a checker
// that cannot answer, so the row has to read as an error and the banner has to name the
// file and the reason rather than leaving the file looking verified.
test('F30 a throwing checker: the dist check errors', () => withUnassessableDist(
  'throw new Error("fixture checker exploded");', ({ adapter, direct }) => {
    assert.equal(adapter.check.state, 'ERROR');
    assert.deepEqual(adapter.findings, []);
    assert.equal(direct.exit, 0);
    assert.match(direct.stdout, /^DIST FRESHNESS CHECK ERROR: .*dist\/thing\.js -- the checker exited 1/);
  }));

test('F31 a checker that exits 64: the dist check errors', () => withUnassessableDist(
  'process.stderr.write("fixture checker refused\\n");\nprocess.exit(64);', ({ adapter, direct }) => {
    assert.equal(adapter.check.state, 'ERROR');
    assert.deepEqual(adapter.findings, []);
    assert.equal(direct.exit, 0);
    assert.match(direct.stdout, /^DIST FRESHNESS CHECK ERROR: .*dist\/thing\.js -- the checker exited 64 without printing a verdict: fixture checker refused/);
  }));

test('F32 an unprovisioned checker: the dist check errors', () => withUnassessableDist(
  'process.stdout.write(JSON.stringify({ status: "unprovisioned" }) + "\\n");', ({ adapter, direct }) => {
    assert.equal(adapter.check.state, 'ERROR');
    assert.deepEqual(adapter.findings, []);
    assert.equal(direct.exit, 0);
    assert.match(direct.stdout, /^DIST FRESHNESS CHECK ERROR: .*dist\/thing\.js -- the package is not provisioned/);
  }));

test('F33 a silent checker: the dist check errors', () => withUnassessableDist('', ({ adapter, direct }) => {
  assert.equal(adapter.check.state, 'ERROR');
  assert.deepEqual(adapter.findings, []);
  assert.equal(direct.exit, 0);
  assert.match(direct.stdout, /^DIST FRESHNESS CHECK ERROR: .*dist\/thing\.js -- the checker printed no verdict/);
}));

// A hook that names the checker outright is the plainest spelling there is, and a plain name is
// not a broken one. Each line a case names below is a whole hook body, so the case states one
// spelling and nothing else beside it.
function hookLayer(repo, line) {
  const hook = path.join(repo.root, '.git', 'hooks', 'pre-commit');
  fs.writeFileSync(hook, `#!/bin/sh\n${line}\n`);
  fs.chmodSync(hook, 0o755);
  return repo.run(['--files', 'app.go']).verdict.layers.pre_commit_hygiene;
}

// The checker a hook names is proven by the file the path lands on, so a case seeds that file at
// the folder shape a hook builds its path from and lets each spelling speak for itself.
function runnableChecker(repo) {
  const file = path.join(repo.root, 'tools', 'check-comment-hygiene.sh');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, '#!/bin/sh\nexit 0\n');
  fs.chmodSync(file, 0o755);
  return file;
}

test('F34 plain checker spellings: a hook naming the path outright reads present', () => withRepo({
  change: { 'app.go': 'package a\n' },
}, (repo) => {
  runnableChecker(repo);
  for (const line of [
    'tools/check-comment-hygiene.sh',
    './tools/check-comment-hygiene.sh',
    'sh tools/check-comment-hygiene.sh',
    'bash tools/check-comment-hygiene.sh',
    'tools/check-comment-hygiene.sh || true',
    'cd "$(dirname "$0")/../.." && tools/check-comment-hygiene.sh',
  ]) assert.equal(hookLayer(repo, line), 'present', line);
}));

// A substitution nests, so a spelling that closes more than one of them before the path is
// still one path. A parameter default puts a brace pair in the prefix, and a hook that climbs
// out of the folder it runs in still lands on the same file.
test('F35 substitution spellings: a hook that builds the path reads present', () => withRepo({
  change: { 'app.go': 'package a\n' },
}, (repo) => {
  runnableChecker(repo);
  for (const line of [
    '${ROOT:-.}/tools/check-comment-hygiene.sh',
    '"${ROOT:-.}/tools/check-comment-hygiene.sh"',
    '"$(dirname "$0")/../../tools/check-comment-hygiene.sh"',
    '$(cd "$(dirname "$0")" && pwd)/../../tools/check-comment-hygiene.sh',
  ]) assert.equal(hookLayer(repo, line), 'present', line);
}));

// The spellings that already read present keep it, and a hook whose path lands on no file is
// still installed and unable to run rather than installed and working.
test('F36 variable spellings: the shapes that read present keep it and a missing checker stays broken', () => withRepo({
  change: { 'app.go': 'package a\n' },
}, (repo) => {
  const root = path.join(repo.root, 'check-comment-hygiene.sh');
  fs.writeFileSync(root, '#!/bin/sh\nexit 0\n');
  fs.chmodSync(root, 0o755);
  const tools = runnableChecker(repo);
  for (const line of [
    'bash "$ROOT/check-comment-hygiene.sh"',
    '"$ROOT"/tools/check-comment-hygiene.sh',
    '$(git rev-parse --show-toplevel)/tools/check-comment-hygiene.sh',
    '"$(git rev-parse --show-toplevel)/tools/check-comment-hygiene.sh"',
  ]) assert.equal(hookLayer(repo, line), 'present', line);

  fs.rmSync(tools);
  assert.equal(hookLayer(repo, 'tools/check-comment-hygiene.sh'), 'broken');
  assert.equal(hookLayer(repo, '"$(dirname "$0")/../../tools/check-comment-hygiene.sh"'), 'broken');
}));

// A call inside a comment is a call nobody makes, so a hook whose only mention of the checker
// is commented out names no checker at all. A # inside a quote is text, so the mention there
// still counts as one.
test('F37 a commented-out call names no checker and a quoted # stays text', () => withRepo({
  change: { 'app.go': 'package a\n' },
}, (repo) => {
  assert.equal(hookLayer(repo, '# tools/check-comment-hygiene.sh is disabled'), 'absent');
  assert.equal(hookLayer(repo, '# exec sh "$(dirname "$0")/../../tools/check-comment-hygiene.sh"'), 'absent');
  runnableChecker(repo);
  assert.equal(hookLayer(repo, 'echo "# tools/check-comment-hygiene.sh"'), 'present');
}));

// A generated row the repository declares carries its own command and its own paths, so the
// path it names is that row's input even though the base layer marks the path as built output
// and the exclude list hides it. A required P0 row that fails blocks the run.
test('F38 a repository generated row runs on its declared path and blocks', () => withRepo({
  change: { '.skilled/skills/sk-design/sk-design-md-generator/backend/dist/cli.js': 'module.exports = 7;\n' },
}, (repo) => {
  const declared = '.skilled/skills/sk-design/sk-design-md-generator/backend/dist/cli.js';
  trustRepoChecks(repo);
  repo.write({
    '.sk-code/quality.json': `${JSON.stringify({
      schemaVersion: 1,
      generated: [{
        id: 'own-gen',
        argv: [process.execPath, '-e', 'process.exit(7)', '{files}'],
        paths: [declared],
        severity: 'P0',
        required: true,
      }],
    })}\n`,
  });
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', declared]));
  const row = check(verdict, 'own-gen');
  assert.deepEqual([row.origin, row.state, row.files], ['generated', 'RAN_FAIL', 1]);
  assert.equal(row.runs[0].exit, 7);
  assert.equal(verdict.gate, 'BLOCKED');
  assert.equal(status, 1);
}));

// A generated row the repository declares is a command with its own paths, so a source path
// it names is that row's input wherever the file sits. A required P0 row that fails blocks.
test('F39 a repository generated row runs on a path outside every declared folder', () => withRepo({
  change: { 'gen/schema.js': 'module.exports = 7;\n' },
}, (repo) => {
  trustRepoChecks(repo);
  repo.write({
    '.sk-code/quality.json': `${JSON.stringify({
      schemaVersion: 1,
      generated: [{
        id: 'own-gen',
        argv: [process.execPath, '-e', 'process.exit(7)', '{files}'],
        paths: ['gen/schema.js'],
        severity: 'P0',
        required: true,
      }],
    })}\n`,
  });
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', 'gen/schema.js']));
  const row = check(verdict, 'own-gen');
  assert.deepEqual([row.origin, row.state, row.files], ['generated', 'RAN_FAIL', 1]);
  assert.equal(row.runs[0].exit, 7);
  assert.equal(verdict.gate, 'BLOCKED');
  assert.equal(status, 1);
}));

// A path no built-in check reads is still that row's input, so a file the sensors leave
// unchecked does not hide a failing command.
test('F40 a repository generated row runs on a path no built-in check reads', () => withRepo({
  change: { 'gen/out.txt': 'built output\n' },
}, (repo) => {
  trustRepoChecks(repo);
  repo.write({
    '.sk-code/quality.json': `${JSON.stringify({
      schemaVersion: 1,
      generated: [{
        id: 'own-gen',
        argv: [process.execPath, '-e', 'process.exit(7)', '{files}'],
        paths: ['gen/out.txt'],
        severity: 'P0',
        required: true,
      }],
    })}\n`,
  });
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', 'gen/out.txt']));
  const row = check(verdict, 'own-gen');
  assert.deepEqual([row.origin, row.state, row.files], ['generated', 'RAN_FAIL', 1]);
  assert.equal(verdict.gate, 'BLOCKED');
  assert.equal(status, 1);
}));

// An escaped quote outside quotes opens no quote, so the comment line after it is still a
// comment and names no checker.
test('F41 an escaped quote opens no quote and the comment below it stays a comment', () => withRepo({
  change: { 'app.go': 'package a\n' },
}, (repo) => {
  runnableChecker(repo);
  const hook = path.join(repo.root, '.git', 'hooks', 'pre-commit');
  fs.writeFileSync(hook, "#!/bin/sh\necho don\\'t\n# tools/check-comment-hygiene.sh\n");
  fs.chmodSync(hook, 0o755);
  assert.equal(repo.run(['--files', 'app.go']).verdict.layers.pre_commit_hygiene, 'absent');
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

    const target = path.join(repo.root, 'fresh.md');
    const bin = fakePython(repo.parent, `require("fs").writeFileSync(process.env.SKQ_FIXTURE_TARGET, "changed\\n");\n${HYGIENE_REPORT}`);
    const run = repo.run([], { env: { PATH: `${bin}${path.delimiter}${repo.env.PATH}`, SKQ_FIXTURE_TARGET: target } });
    assert.equal(run.status, 3);
    assert.equal(run.verdict.gate, 'ERROR');
    const [error] = run.verdict.errors;
    assert.equal(error.code, 'CHECK_MUTATED_WORKSPACE');
    assert.equal(error.check, 'comment-hygiene');
    // The file did not exist when the run listed the workspace, and the closing snapshot
    // finds it anyway, so bounding the listing did not cost the guard a path it watched.
    assert.deepEqual(error.paths, ['fresh.md']);
    assert.equal(fs.readFileSync(target, 'utf8'), 'changed\n');
  });
});

// The guard hashes the folders the scope reaches, so a write inside one is seen and a write
// outside one is not. The bound is what keeps a run from walking the whole tree, and the
// cases hold both halves of it so a later change to the bound has to be deliberate.
test('unit: guard boundary: a write inside the folders the scope reaches is caught', () => withRepo({
  base: { 'app.js': 'module.exports = 1;\n' },
  change: { 'nested/app.js': 'module.exports = 2;\n' },
}, (repo) => {
  const context = { root: repo.root, git: true, files: ['nested/app.js'], env: repo.env, folders: ['nested'] };
  const created = path.join(repo.root, 'nested', 'created.js');
  const outcome = withGuard(context, () => fs.writeFileSync(created, 'module.exports = 3;\n'));
  assert.deepEqual(outcome.mutated, ['nested/created.js']);
}));

test('unit: guard boundary: a write outside the folders the scope reaches is not caught', () => withRepo({
  base: { 'app.js': 'module.exports = 1;\n' },
  change: { 'nested/app.js': 'module.exports = 2;\n' },
}, (repo) => {
  const context = { root: repo.root, git: true, files: ['nested/app.js'], env: repo.env, folders: ['nested'] };
  const outcome = withGuard(context, () => fs.writeFileSync(path.join(repo.root, 'elsewhere.js'), 'module.exports = 4;\n'));
  assert.deepEqual(outcome.mutated, [], 'a write outside the folders the scope reaches ended up inside the watch');
}));

// An ignored path is outside the watch because hashing the ones a folder holds costs more
// than the run's budget allows, measured at the folder the runner itself lives in as well
// as at the repository root. The case holds that boundary, so adding a watch means changing it.
test('unit: guard boundary: an ignored record a check writes stays outside the watch', () => withRepo({
  base: { '.gitignore': 'cache/\n', 'nested/app.js': 'module.exports = 1;\n' },
  change: { 'nested/app.js': 'module.exports = 1;\n\nmodule.exports.b = 2;\n' },
}, (repo) => {
  const record = path.join(repo.root, 'nested', 'cache', 'record.json');
  const body = `require("fs").mkdirSync(${JSON.stringify(path.dirname(record))}, { recursive: true });\n`
    + `require("fs").writeFileSync(${JSON.stringify(record)}, ${JSON.stringify('{}\n')});\n${HYGIENE_REPORT}`;
  const bin = fakePython(repo.parent, body);
  const run = repo.run([], { env: { PATH: `${bin}${path.delimiter}${repo.env.PATH}` } });
  assert.ok(run.verdict, run.stderr);
  assert.equal(check(run.verdict, 'comment-hygiene').state, 'RAN_CLEAN');
  assert.deepEqual(run.verdict.errors, [], 'a record written under an ignored folder ended up inside the watch');
  assert.notEqual(run.status, 3);
  assert.equal(fs.readFileSync(record, 'utf8'), '{}\n');
}));

// A named-file scope takes no listing of its own, so the guard has to bound its own to the
// folders those files sit in. Without that, a check could create a file beside one and the
// run would still read clean.
test('unit: files scope guard', () => withRepo({
  base: { 'src/a.go': 'package a\n' },
  change: { 'src/a.go': 'package a\n\nfunc A() {}\n' },
}, (repo) => {
  const created = path.join(repo.root, 'src', 'new.txt');
  const bin = fakePython(repo.parent, `require("fs").writeFileSync(${JSON.stringify(created)}, "x\\n");\n${HYGIENE_REPORT}`);
  const run = repo.run(['--files', 'src/a.go'], { env: { PATH: `${bin}${path.delimiter}${repo.env.PATH}` } });
  assert.equal(run.status, 3);
  const [error] = run.verdict.errors;
  assert.equal(error.code, 'CHECK_MUTATED_WORKSPACE');
  assert.deepEqual(error.paths, ['src/new.txt']);
  assert.equal(fs.readFileSync(created, 'utf8'), 'x\n');
}));

// The untracked side of a scope is the largest cost of a run, so a run reads it once and
// hands it to the guard. A named-file scope reads none of it for the scope itself, and the
// guard bounds its own listing to the folder each named file sits in.
test('unit: scope listing', () => {
  const temp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skq-listing-')));
  try {
    const git = loggingGit(temp);
    withRepo({ change: { 'app.js': 'module.exports = 1;\n', 'nested/peer.js': 'module.exports = 2;\n' } }, (repo) => {
      const env = { PATH: `${git.bin}${path.delimiter}${repo.env.PATH}`, SKQ_FIXTURE_GIT_LOG: git.log };
      const worktree = repo.run([], { env });
      assert.ok(worktree.verdict, worktree.stderr);
      const calls = listingCalls(git.log);
      assert.equal(calls.length, 2, `a worktree run listed the untracked files ${calls.length} times, not once for the scope and once for the guard`);
      assert.doesNotMatch(calls[0], / -- /, 'the scope listed its tree through a bound it does not have');
      assert.match(calls[1], / -- \.$/, 'the guard listed the whole tree instead of the folders the scope reaches');

      fs.rmSync(git.log, { force: true });
      const named = repo.run(['--files', 'app.js'], { env });
      assert.ok(named.verdict, named.stderr);
      // The scope still lists nothing for a named-file run, because it hashes those paths by
      // name, and the guard bounds its own listings to the folder the named file sits in.
      const namedCalls = listingCalls(git.log);
      assert.deepEqual(namedCalls.filter((call) => !call.includes(' -- ')), [],
        'a named-file run listed its tree for the scope');
      for (const call of namedCalls) assert.match(call, / -- \.$/, 'a named-file run listed outside the folder its file sits in');
    });
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

// A guard that is handed the listing hashes it and takes none of its own before the work
// runs, and its closing snapshot lists again inside the folders the scope reaches, so a
// path a check creates while it runs is still seen.
test('unit: guard snapshot source', () => {
  const temp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skq-guard-source-')));
  try {
    const git = loggingGit(temp);
    withRepo({ change: { 'app.js': 'module.exports = 1;\n' } }, (repo) => {
      repo.write({ 'peer.js': 'module.exports = 2;\n' });
      const env = { ...repo.env, PATH: `${git.bin}${path.delimiter}${repo.env.PATH}`, SKQ_FIXTURE_GIT_LOG: git.log };
      const context = { root: repo.root, git: true, files: ['app.js'], env, untracked: ['peer.js'], folders: ['.'] };
      const outcome = withGuard(context, () => fs.appendFileSync(path.join(repo.root, 'peer.js'), '// edit\n'));
      assert.deepEqual(outcome.mutated, ['peer.js']);
      assert.equal(listingCalls(git.log).length, 1, 'the opening snapshot listed instead of hashing the run listing');

      fs.rmSync(git.log, { force: true });
      const named = repo.run(['--files', 'app.js'], { env: { PATH: env.PATH, SKQ_FIXTURE_GIT_LOG: git.log } });
      assert.ok(named.verdict, named.stderr);
      // A named-file scope takes no listing of its own, and every guard listing under it is
      // bounded to the folder the named file sits in.
      const namedCalls = listingCalls(git.log);
      assert.deepEqual(namedCalls.filter((call) => !call.includes(' -- ')), [],
        'a named-file run listed its tree for the scope');
      for (const call of namedCalls) assert.match(call, / -- \.$/, 'a named-file run listed outside the folder its file sits in');
    });
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

// A declared generated path is output, so only the dist adapter reads it. A configured
// command that would match it by path stays NOT_APPLICABLE, and a repository exclude can
// still take a declared path out of the run.
test('unit: configured skips generated', () => withRepo({
  change: declaredPackage(),
}, (repo) => {
  fs.mkdirSync(path.join(repo.root, DECLARED_PACKAGE, 'node_modules'), { recursive: true });
  ageDeclaredPackage(repo, true);
  const config = (extra) => `${JSON.stringify({
    schemaVersion: 1,
    checks: [{ id: 'js-lint', argv: [process.execPath, '-e', 'process.exit(9)', '{files}'], paths: ['**/*.js'], severity: 'P1' }],
    ...extra,
  })}\n`;
  repo.write({ '.sk-code/quality.json': config({}) });
  const declared = assertSnapshotUnchanged(repo, () => repo.run(['--files', DECLARED_PATH]));
  assert.equal(declared.status, 0);
  assert.deepEqual([check(declared.verdict, 'js-lint').state, check(declared.verdict, 'js-lint').files], ['NOT_APPLICABLE', 0]);
  assert.deepEqual([check(declared.verdict, 'dist-staleness').state, check(declared.verdict, 'dist-staleness').files], ['RAN_CLEAN', 1]);

  repo.write({ '.sk-code/quality.json': config({ exclude: [DECLARED_PATH] }) });
  const excluded = assertSnapshotUnchanged(repo, () => repo.run(['--files', DECLARED_PATH]));
  assert.equal(excluded.status, 2);
  assert.deepEqual([check(excluded.verdict, 'dist-staleness').state, check(excluded.verdict, 'dist-staleness').files], ['NOT_APPLICABLE', 0]);
  assert.deepEqual(excluded.verdict.coverage.unchecked, [{ file: DECLARED_PATH, reason: 'excluded' }]);
}));

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

test('unit: config fault: a pattern the checker cannot compile ends the run as a config error', () => withRepo({
  base: {
    '.sk-code/quality.json': `${JSON.stringify({ schemaVersion: 1, commentHygiene: { extraPatterns: [CHECKER_REFUSED_PATTERN] } })}\n`,
  },
  change: { 'app.go': 'package a\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.equal(verdict.errors[0].code, 'CONFIG_INVALID');
  const [field] = verdict.config.errors;
  assert.equal(field.code, 'CONFIG_INVALID');
  assert.equal(field.field, 'commentHygiene.extraPatterns');
  assert.match(field.message, /--extra-pattern/);

  const runnerFlag = fakePython(path.join(repo.parent, 'own-flag'),
    'process.stderr.write("ERROR: --json needs a value\\n"); process.exit(3);');
  const refused = assertSnapshotUnchanged(repo, () => repo.run([], { env: { PATH: `${runnerFlag}${path.delimiter}${repo.env.PATH}` } }));
  assert.equal(refused.status, 4);
  assert.equal(check(refused.verdict, 'comment-hygiene').state, 'ERROR');
  assert.deepEqual(refused.verdict.config.errors, []);
}));

test('unit: config fault: a checker warning above its refusal still names the field', () => withRepo({
  base: {
    '.sk-code/quality.json': `${JSON.stringify({ schemaVersion: 1, commentHygiene: { extraPatterns: [NESTED_SET_REFUSED_PATTERN] } })}\n`,
  },
  change: { 'app.go': 'package a\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.equal(verdict.errors[0].code, 'CONFIG_INVALID');
  const [field] = verdict.config.errors;
  assert.equal(field.code, 'CONFIG_INVALID');
  assert.equal(field.field, 'commentHygiene.extraPatterns');
  assert.match(field.message, /--extra-pattern/);
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
  const checkerText = '#!/bin/sh\nexit 0\n';
  withRepo({
    change: {
      'app.go': 'package a\n',
      'check-comment-hygiene.sh': checkerText,
      '.claude/settings.json': JSON.stringify({ hooks: { PostToolUse: [{ command: 'node .skilled/hooks/post-edit-quality/claude/adapter.cjs' }] } }),
    },
    modes: { 'check-comment-hygiene.sh': 0o755 },
  }, (repo) => {
    const hook = path.join(repo.root, '.git', 'hooks', 'pre-commit');
    const checker = path.join(repo.root, 'check-comment-hygiene.sh');
    fs.writeFileSync(hook, hookText);
    fs.chmodSync(hook, 0o755);
    fs.mkdirSync(path.join(repo.root, '.github'));
    fs.writeFileSync(path.join(repo.root, '.github', 'workflows'), 'a file where a folder belongs\n');
    const first = assertSnapshotUnchanged(repo, () => repo.run(['--files', 'app.go'])).verdict.layers;
    assert.deepEqual(first, { pre_commit_hygiene: 'present', ci_hygiene: 'unknown', post_edit: 'broken' });

    // A hook that spells the checker from a quoted variable, or from a command
    // substitution, puts a quote or a closing parenthesis between the variable and the
    // path, so the token read alone looks absolute at the filesystem root. Both forms
    // still resolve under the repository root.
    const toolsChecker = path.join(repo.root, 'tools', 'check-comment-hygiene.sh');
    fs.mkdirSync(path.dirname(toolsChecker), { recursive: true });
    fs.writeFileSync(toolsChecker, checkerText);
    fs.chmodSync(toolsChecker, 0o755);
    for (const quoted of ['"$ROOT"/tools/check-comment-hygiene.sh', '"$(git rev-parse --show-toplevel)/tools/check-comment-hygiene.sh']) {
      fs.writeFileSync(hook, `#!/bin/sh\nexec python3 ${quoted} "$@"\n`);
      fs.chmodSync(hook, 0o755);
      assert.equal(repo.run(['--files', 'app.go']).verdict.layers.pre_commit_hygiene, 'present', quoted);
    }
    fs.writeFileSync(hook, hookText);

    // A hook naming a path no file sits at, and one naming a file git could not run,
    // both read installed and unable to run rather than installed and working.
    fs.rmSync(checker);
    assert.equal(repo.run(['--files', 'app.go']).verdict.layers.pre_commit_hygiene, 'broken');
    fs.writeFileSync(checker, checkerText);
    fs.chmodSync(checker, 0o644);
    assert.equal(repo.run(['--files', 'app.go']).verdict.layers.pre_commit_hygiene, 'broken');
    fs.chmodSync(checker, 0o755);

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
    // The foreign hook names a checker that resolves in this repository, so the trust
    // gate is the only thing that decided the earlier reading and the checker then
    // proves runnable here.
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
  const named = path.join(repo.parent, 'named-quality.json');
  fs.writeFileSync(named, '{"schemaVersion": 1}\n');
  assertSnapshotUnchanged(repo, () => {
    assert.equal(repo.run([]).status, 0);
    const configured = repo.run(['--config', named]);
    assert.equal(configured.status, 0);
    assert.deepEqual([configured.verdict.config.source, configured.verdict.config.path], ['cli', named]);
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

    for (const args of [['--config'], ['--only', 'sk-code-absent-check'], ['--timeout', '0'],
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
      'elif name.startswith("unmatched"):',
      '    print("DIST FRESHNESS CHECK UNMATCHED: /tmp/unmatched.js -- no package owns this path")',
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
    const unmapped = runDistAdapter([file('unmatched.js')], options).check;
    assert.equal(unmapped.state, 'ERROR');
    assert.match(unmapped.repair, /dist\/unmatched\.js/);
    // The same verdict through the real checker, so the line the adapter parses is
    // the one the shipped script prints rather than only the stand-in's.
    const realChecker = path.join(QUALITY_ROOT, 'scripts', 'check-dist-staleness.sh');
    fs.writeFileSync(path.join(temp, 'undeclared.js'), 'module.exports = 1;\n');
    const realUnmapped = runDistAdapter([{ rel: 'dist/undeclared.js', abs: path.join(temp, 'undeclared.js') }],
      { env: { PATH: process.env.PATH }, cwd: temp, timeoutMs: 20000, script: realChecker }).check;
    assert.equal(realUnmapped.state, 'ERROR');
    assert.match(realUnmapped.repair, /dist\/undeclared\.js/);
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

// A freshness check writes its cache record beside the dist entry it read, and a gate
// run promises to write nothing. The read-only mode has to return the same verdict and
// leave no record, while the writable default still records the build it checked.
test('unit: dist read-only', () => {
  const temp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skq-fresh-')));
  try {
    const packageRoot = path.join(temp, '.skilled', 'skills', 'system-spec-kit', 'shared');
    const distDir = path.join(packageRoot, 'dist');
    fs.mkdirSync(distDir, { recursive: true });
    fs.writeFileSync(path.join(packageRoot, 'tsconfig.json'), '{"compilerOptions": {}}\n');
    fs.writeFileSync(path.join(packageRoot, 'index.ts'), 'export const value = 1;\n');
    fs.writeFileSync(path.join(distDir, 'tsconfig.tsbuildinfo'), '{"build": "current"}\n');
    const past = (Date.now() - 60000) / 1000;
    for (const name of ['tsconfig.json', 'index.ts']) fs.utimesSync(path.join(packageRoot, name), past, past);
    const records = () => fs.readdirSync(distDir).filter((name) => name.startsWith('.dist-freshness-'));

    const readOnly = checkPackageFreshness('system-spec-kit/shared', { workspaceRoot: temp, readOnly: true });
    assert.equal(readOnly.status, 'fresh');
    assert.deepEqual([readOnly.stale, readOnly.origin], [false, 'checker']);
    assert.deepEqual(records(), []);

    const writable = checkPackageFreshness('system-spec-kit/shared', { workspaceRoot: temp });
    assert.deepEqual([writable.status, writable.stale, writable.sourceHash, writable.distHash],
      [readOnly.status, readOnly.stale, readOnly.sourceHash, readOnly.distHash]);
    assert.equal(records().length, 1);
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

// Twelve files put the list past the pool bound on any machine, so the two faults are
// found by different children and have to come back at their own input index. Each
// expected reason is read from the same `node --check` the sequential loop started, so
// this case pins the record-to-finding mapping rather than a node version's wording.
const POOL_CHANGE = Object.freeze({
  'src/bad-end.js': 'function oops(\n',
  'src/bad-token.js': 'const a = ;\n',
  ...Object.fromEntries(Array.from({ length: 10 }, (_, index) => [`src/clean-${index + 1}.js`, `module.exports = ${index + 1};\n`])),
});

test('unit: node pool: twelve changed files keep both syntax errors and the reasons a sequential check produced', () => withRepo({
  change: POOL_CHANGE,
}, (repo) => {
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  const expected = ['src/bad-end.js', 'src/bad-token.js'].map((rel) => {
    const direct = spawnArgv([process.execPath, '--check', path.join(repo.root, rel)], { cwd: repo.root });
    assert.equal(direct.state, 'RAN_FAIL', `${rel} did not fail node --check`);
    const where = /:(\d+)\s*$/.exec(direct.stderr.split('\n')[0]);
    return [rel, Number(where[1]), `node --check: ${/^(?:SyntaxError|Error): (.*)$/m.exec(direct.stderr)[1]}`];
  });
  assert.deepEqual(verdict.findings.map((entry) => [entry.file, entry.line, entry.reason]), expected);
  assert.deepEqual(verdict.findings.map((entry) => [entry.rule, entry.confidence, entry.blocking]),
    [['syntax.js', 'heuristic', false], ['syntax.js', 'heuristic', false]]);
  assert.deepEqual([check(verdict, 'syntax-node').state, check(verdict, 'syntax-node').files], ['RAN_FAIL', 12]);
}));

// A fault at the head of the list is claimed by the first child whatever the pool does, so
// this change puts its one fault in the middle of eleven files, where only a record that
// came back at its own index lands in the right place. The reference runs one `node
// --check` after another in the order the runner lists the files.
const MID_POOL_CHANGE = Object.freeze(Object.fromEntries(Array.from({ length: 11 }, (_, index) => {
  const name = `src/part-${String(index + 1).padStart(2, '0')}.js`;
  return [name, index === 5 ? 'const a = ;\n' : `module.exports = ${index + 1};\n`];
})));

test('unit: node pool: a syntax error in the middle of a long list matches a sequential check file by file', () => withRepo({
  change: MID_POOL_CHANGE,
}, (repo) => {
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  const order = Object.keys(MID_POOL_CHANGE).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  assert.equal(order[5], 'src/part-06.js', 'the fault does not sort into the middle of the list');
  const expected = [];
  for (const rel of order) {
    const direct = spawnArgv([process.execPath, '--check', path.join(repo.root, rel)], { cwd: repo.root });
    if (direct.state !== 'RAN_FAIL') continue;
    const where = /:(\d+)\s*$/.exec(direct.stderr.split('\n')[0]);
    const message = /^(?:SyntaxError|Error): (.*)$/m.exec(direct.stderr);
    expected.push([rel, where ? Number(where[1]) : null, `node --check: ${message ? message[1] : direct.stderr.trim().split('\n').pop()}`,
      'syntax.js', 'heuristic']);
  }
  assert.deepEqual(expected.map((entry) => entry[0]), ['src/part-06.js'], 'the sequential reference found a different fault');
  const found = verdict.findings.filter((entry) => entry.check === 'syntax-node');
  assert.deepEqual(found.map((entry) => [entry.file, entry.line, entry.reason, entry.rule, entry.confidence]), expected);
  assert.deepEqual([check(verdict, 'syntax-node').state, check(verdict, 'syntax-node').files], ['RAN_FAIL', 11]);
}));

// A child killed by a signal leaves no exit status and no message, so its record has to read
// as a check that never returned, never as a clean file or a syntax error with no text. A
// helper that died part way prints a short list, which the parent must refuse whole.
test('unit: node pool: a killed child reads ERROR and a short record list is refused', () => {
  assert.deepEqual(nodeCheckResult({ file: 'a.js', status: null, stderr: '', timedOut: false, error: 'killed by SIGKILL' }),
    { state: 'ERROR', stderr: '' });
  assert.deepEqual(nodeCheckResult({ file: 'a.js', status: null, stderr: '', timedOut: true, error: null }),
    { state: 'TIMEOUT', stderr: '' });
  assert.equal(nodeCheckResult({ file: 'a.js', status: 1, stderr: 'x', timedOut: false, error: null }).state, 'RAN_FAIL');
  assert.equal(nodeCheckResult({ file: 'a.js', status: 0, stderr: '', timedOut: false, error: null }).state, 'RAN_CLEAN');

  const one = { file: 'a.js', status: 0, stderr: '', timedOut: false, error: null };
  assert.deepEqual(nodeCheckRecords(JSON.stringify([one, { ...one, file: 'b.js' }]), 2).map((record) => record.file), ['a.js', 'b.js']);
  assert.equal(nodeCheckRecords(JSON.stringify([one]), 2), null);
  assert.equal(nodeCheckRecords('[{"file":"a.js","status":0,"stderr":""', 1), null);
  assert.equal(nodeCheckRecords(JSON.stringify([{ file: 'a.js', status: 0 }]), 1), null);
});

// No file the check reads means no helper to start, so the row keeps the state it was
// built with and no time was spent on it.
test('unit: node pool: a change with no .js or .mjs file never starts the helper and reads NOT_APPLICABLE', () => withRepo({
  change: { 'data.json': '{"a": 1}\n', 'lib/run.cjs': 'module.exports = 1;\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  const row = check(verdict, 'syntax-node');
  assert.deepEqual([row.state, row.files, row.duration_ms], ['NOT_APPLICABLE', 0, 0]);
  assert.deepEqual(verdict.findings.filter((entry) => entry.check === 'syntax-node'), []);
}));

// The pool hands each child the check's own deadline, so a deadline this short stops every
// child before node can start. The result has to read the way the sequential loop reported a
// check that never returned: TIMEOUT, no finding, and a required check left without evidence.
test('unit: node pool: a deadline no child can meet reports TIMEOUT and leaves the run UNVERIFIED', () => withRepo({
  change: Object.fromEntries(Array.from({ length: 4 }, (_, index) => [`src/any-${index + 1}.js`, `module.exports = ${index + 1};\n`])),
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--timeout', '0.0004']));
  assert.equal(status, 4);
  assert.equal(verdict.gate, 'UNVERIFIED');
  assert.equal(check(verdict, 'syntax-node').state, 'TIMEOUT');
  assert.deepEqual(verdict.findings.filter((entry) => entry.check === 'syntax-node'), []);
  assert.ok(verdict.summary.unverified.includes('syntax-node'));
}));
