// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Runner Fixture Helpers
// ───────────────────────────────────────────────────────────────────
'use strict';

// Every fixture is a throwaway repository built from quoted strings, and every case hands the
// runner the change it seeded. The constants and helpers here are the ones more than one part
// of the gate suite shares: the paths and labels the cases read back, the verdict fields they
// assert on, and the stand-ins that make a check fail, stall or write. No case changes this
// process's environment: each one hands its variables to the child it starts.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { buildRepo } = require('./fixtures.cjs');
const { runDistAdapter } = require('../quality-gate.cjs');
const { findTool, spawnArgv } = require('../lib/run-check.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS AND HELPERS
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
// The JavaScript and CSS house-style rows belong to the SKILLED surface, so a .js file that
// resolves to no surface in a foreign repository must never be handed them by its extension.
const STYLE_CHECKLISTS = Object.freeze([
  'hub:sk-code/sk-code-skilled/assets/checklists/js-css-style/overview-header-and-comments.md',
  'hub:sk-code/sk-code-skilled/assets/checklists/js-css-style/naming-init-formatting-and-css.md',
  'hub:sk-code/sk-code-skilled/assets/checklists/js-css-style/verification-quick-reference-and-related.md',
]);
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
// 3. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

// Only the names a part reaches for are exported, so adding one here is the signal that a
// second part of the suite now depends on it.
module.exports = {
  QUALITY_ROOT,
  HUB_ROOT,
  REAL_CHECKER,
  DECLARED_PATH,
  DECLARED_PACKAGE,
  REPO_ROOT,
  SPEC_FOLDER_CHECKLIST,
  STYLE_CHECKLISTS,
  COMPILER,
  ADR_LABEL,
  REQ_SHORT,
  REQ_LONG,
  TASK_LABEL,
  AWS_KEY,
  AWS_KEY_TWO,
  GITHUB_TOKEN,
  OPEN,
  MIDDLE,
  CLOSE,
  PASS_WORD,
  CHECKER_REFUSED_PATTERN,
  NESTED_SET_REFUSED_PATTERN,
  CHECKER_OUTPUTS,
  ENVELOPE_KEYS,
  OUTSIDE_SKILL,
  OUTSIDE_SURFACE,
  OUTSIDE_CHECKLIST,
  OUTSIDE_CHECKLISTS,
  SHARED_SURFACE,
  SHARED_CHECKLIST,
  PEER_SKILL,
  PEER_SURFACE,
  PEER_CHECKLIST,
  FOLDER_SKILL,
  FOLDER_SURFACE,
  UPPER_FOLDER_SKILL,
  withRepo,
  check,
  declaredPackage,
  ageDeclaredPackage,
  withUnassessableDist,
  hygieneFindings,
  checklistFiles,
  surfaceOf,
  firstSpecFile,
  stableShape,
  writeOutsideSkill,
  SYMLINK_SUPPORT,
  CASE_INSENSITIVE_FS,
  fakePython,
  onlyNodeOnPath,
  envelopeFields,
  leaksKey,
  HYGIENE_REPORT,
  loggingGit,
  listingCalls,
};
