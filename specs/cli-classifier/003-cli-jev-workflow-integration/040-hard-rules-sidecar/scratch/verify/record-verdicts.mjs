#!/usr/bin/env node
// Record dispatch hard-rule verdicts for a fixed command corpus, before and after the rules
// move out of SKILL.md frontmatter into a sibling sidecar, then compare the recordings byte
// for byte. The recordings are the evidence: an equivalence claim between two runs is only
// worth anything if both runs are reproducible.
//
// Three properties make the runs reproducible on any host:
//   - a stub bin directory prepended to PATH holds an executable for every binary an
//     availability check looks for, so the checks resolve identically everywhere;
//   - every corpus row pins the violation ids it must produce, so a rule that stopped firing
//     fails loudly instead of letting two empty recordings look equal;
//   - the repository-aware sk-git rows run in a throwaway repository built to the exact state
//     their rules discriminate on, never in the real worktree.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { GIT_CHECKS } from '../../../../../../.skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs';
import { createGitContext } from '../../../../../../.skilled/skills/sk-git/scripts/lib/git-context.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../../../');
const CORPUS = path.join(HERE, 'corpus.json');

// Skill name → packet folder under `.skilled/skills`. The engine reader resolves the sidecar
// from the SKILL.md path, so the folder is all this runner needs to find both files.
const PACKET_PATHS = {
  'cli-opencode': 'cli-external-orchestration/cli-opencode',
  'cli-claude-code': 'cli-external-orchestration/cli-claude-code',
  'cli-codex': 'cli-external-orchestration/cli-codex',
  'cli-cursor': 'cli-external-orchestration/cli-cursor',
  'cli-devin': 'cli-external-orchestration/cli-devin',
  'cli-pi': 'cli-external-orchestration/cli-pi',
  'cli-hermes': 'cli-external-orchestration/cli-hermes',
  'cli-jev': 'cli-classifier/cli-jev',
  'sk-git': 'sk-git',
};

// Throwaway repositories and stub binaries live in a per-invocation directory under the system
// temp root, so the runner works on any host and leaves no scratch state behind when it exits.
const SCRATCHPAD_TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'record-verdicts-'));
process.on('exit', () => fs.rmSync(SCRATCHPAD_TMP, { recursive: true, force: true }));

// The only PATH value that makes an availability check refuse: an empty or missing PATH passes
// by design, and a directory that exists could hold the binary.
const POISONED_PATH = '/nonexistent-dir-for-this-corpus';
const STUB_BINARIES = ['codex', 'cursor-agent', 'devin', 'pi', 'hermes', 'jev'];
const ORIGINAL_PATH = process.env.PATH || '';

// git resolves its repository and configuration from these variables in preference to the
// working directory, so a parent launched inside another worktree would aim the throwaway
// repository's git calls at that other repository. Strip them at startup: children spawned
// through the context reader inherit this process's environment.
const GIT_ENV_REDIRECTORS = [
  'GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE',
  'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES',
  'GIT_CONFIG', 'GIT_CONFIG_GLOBAL', 'GIT_CONFIG_SYSTEM', 'GIT_CONFIG_COUNT',
  'GIT_NAMESPACE', 'GIT_CEILING_DIRECTORIES',
];
for (const name of GIT_ENV_REDIRECTORS) delete process.env[name];

function fail(message) {
  process.stderr.write(`record-verdicts: ${message}\n`);
  process.exit(1);
}

// ── Corpus ───────────────────────────────────────────────────────────────────

function readCorpus() {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(CORPUS, 'utf8'));
  } catch (err) {
    fail(`cannot read corpus.json: ${err.message}`);
  }
  const rows = parsed?.rows;
  if (!Array.isArray(rows) || rows.length === 0) fail('corpus.json carries no rows');
  for (const row of rows) {
    if (typeof row.skill !== 'string' || !PACKET_PATHS[row.skill]) {
      fail(`corpus row names an unknown skill: ${JSON.stringify(row.skill)}`);
    }
    if (typeof row.name !== 'string' || typeof row.command !== 'string') {
      fail(`corpus row ${row.skill}/${row.name} needs a name and a command`);
    }
    if (!Array.isArray(row.expect) || !row.expect.every((id) => typeof id === 'string')) {
      fail(`corpus row ${row.skill}/${row.name} needs an expect list of ids`);
    }
    if (row.path !== undefined && row.path !== 'poisoned') {
      fail(`corpus row ${row.skill}/${row.name} declares an unknown path mode: ${row.path}`);
    }
  }
  const skills = new Set(rows.map((row) => row.skill));
  for (const skill of Object.keys(PACKET_PATHS)) {
    if (!skills.has(skill)) fail(`corpus has no rows for ${skill}`);
  }
  return rows;
}

const skillOrder = (rows) => [...new Set(rows.map((row) => row.skill))];
const rowsFor = (rows, skill) => rows.filter((row) => row.skill === skill);
const skillDir = (skill) => path.join(REPO, '.skilled', 'skills', PACKET_PATHS[skill]);

// ── Canonical recordings ─────────────────────────────────────────────────────
// Fixed key order, two-space indentation and a trailing newline, so a byte comparison between
// two runs isolates a value change instead of a formatting one. Arrays keep engine order.

const canonicalRules = (rules) =>
  rules.map((rule) => ({ id: rule.id, check: rule.check, message: rule.message, severity: rule.severity }));

const canonicalViolations = (violations) =>
  violations.map((v) => ({ id: v.id, severity: v.severity, message: v.message, check: v.check, passed: v.passed }));

function writeRecording(file, value) {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  for (const root of [REPO, SCRATCHPAD_TMP]) {
    if (text.includes(root)) fail(`refusing to write ${file}: an absolute path would enter the recording`);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

// ── Throwaway run environment ────────────────────────────────────────────────

function makeRunRoot() {
  const root = fs.mkdtempSync(path.join(SCRATCHPAD_TMP, 'verdict-run-'));
  process.on('exit', () => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function makeStubBin(dir) {
  fs.mkdirSync(dir, { recursive: true });
  for (const name of STUB_BINARIES) {
    const binary = path.join(dir, name);
    fs.writeFileSync(binary, '');
    fs.chmodSync(binary, 0o755);
  }
  return dir;
}

// The state the scoped-drop and hard-reset rules discriminate on: a modified tracked file and
// an untracked file inside `src/`, so a pathspec commit over `src` drops the new file and a
// hard reset discards the tracked modification.
function makeViolatingRepo(dir) {
  const git = (...args) =>
    execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  fs.mkdirSync(dir, { recursive: true });
  git('init', '-q');
  git('config', 'core.hooksPath', path.join(dir, '.no-hooks'));
  git('config', 'user.email', 'test@example.invalid');
  git('config', 'user.name', 'Test');
  git('config', 'commit.gpgsign', 'false');
  fs.mkdirSync(path.join(dir, 'src'));
  fs.writeFileSync(path.join(dir, 'src', 'tracked.txt'), 'a\n');
  git('add', 'src/tracked.txt');
  git('commit', '-q', '-m', 'seed');
  fs.writeFileSync(path.join(dir, 'src', 'tracked.txt'), 'b\n');
  fs.writeFileSync(path.join(dir, 'src', 'untracked.txt'), 'never committed\n');
  return dir;
}

function prepareRun() {
  const root = makeRunRoot();
  return {
    stub: makeStubBin(path.join(root, 'stub')),
    repo: makeViolatingRepo(path.join(root, 'repo')),
  };
}

// ── Engine + evaluation ──────────────────────────────────────────────────────

async function loadEngine() {
  return import(pathToFileURL(path.join(REPO, '.skilled', 'hooks', 'dispatch', 'lib', 'dispatch-rule-checks.mjs')).href);
}

// Evaluate every row for one skill under the PATH the row declares and assert the recorded ids
// against the corpus. A mismatch is collected rather than thrown so one run reports every row
// that drifted, but it still fails the run: two identical recordings are not evidence when the
// corpus that pinned them never fired.
function evaluateRows(engine, rows, skill, rules, run) {
  const isGit = skill === 'sk-git';
  const effective = isGit ? rules.filter((rule) => GIT_CHECKS[rule.check]) : rules;
  const options = isGit ? { checks: GIT_CHECKS, context: createGitContext(run.repo) } : {};
  const recorded = [];
  const mismatches = [];
  for (const row of rows) {
    process.env.PATH =
      row.path === 'poisoned' ? POISONED_PATH : `${run.stub}${path.delimiter}${ORIGINAL_PATH}`;
    let violations;
    try {
      violations = engine.evaluate(row.command, effective, options);
    } finally {
      process.env.PATH = ORIGINAL_PATH;
    }
    const ids = violations.map((v) => v.id);
    if (JSON.stringify(ids) !== JSON.stringify(row.expect)) {
      mismatches.push(`${skill}/${row.name}: expected ${JSON.stringify(row.expect)} but recorded ${JSON.stringify(ids)}`);
    }
    recorded.push(canonicalViolations(violations));
  }
  return { recorded, mismatches };
}

// ── Modes ────────────────────────────────────────────────────────────────────

async function modeBefore() {
  const engine = await loadEngine();
  if (typeof engine.parseHardRules !== 'function') {
    fail('the engine no longer exports parseHardRules; --before must run from the frontmatter state');
  }
  const rows = readCorpus();
  const run = prepareRun();
  const failures = [];
  for (const skill of skillOrder(rows)) {
    const skillMd = path.join(skillDir(skill), 'SKILL.md');
    if (!fs.existsSync(skillMd)) fail(`SKILL.md missing for ${skill}`);
    const rules = engine.parseHardRules(fs.readFileSync(skillMd, 'utf8'));
    writeRecording(path.join(HERE, 'before', `${skill}.rules.json`), canonicalRules(rules));
    const { recorded, mismatches } = evaluateRows(engine, rowsFor(rows, skill), skill, rules, run);
    writeRecording(path.join(HERE, 'before', `${skill}.verdicts.json`), recorded);
    failures.push(...mismatches);
    process.stdout.write(`before ${skill}: ${rules.length} rules, ${recorded.length} rows\n`);
  }
  for (const failure of failures) process.stderr.write(`row mismatch: ${failure}\n`);
  if (failures.length) process.exit(1);
}

async function modeAfter() {
  const engine = await loadEngine();
  const rows = readCorpus();
  const run = prepareRun();
  const failures = [];
  for (const skill of skillOrder(rows)) {
    const beforeFile = path.join(HERE, 'before', `${skill}.rules.json`);
    if (!fs.existsSync(beforeFile)) fail(`before snapshot missing for ${skill}; run --before first`);
    const beforeBytes = fs.readFileSync(beforeFile);
    const sidecar = path.join(skillDir(skill), 'hard-rules.json');
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(sidecar, 'utf8'));
    } catch (err) {
      fail(`cannot read the sidecar for ${skill}: ${err.message}`);
    }
    if (!Array.isArray(parsed)) fail(`the sidecar for ${skill} is not a bare array`);
    const rules = canonicalRules(parsed);
    const afterBytes = Buffer.from(`${JSON.stringify(rules, null, 2)}\n`, 'utf8');
    writeRecording(path.join(HERE, 'after', `${skill}.rules.json`), rules);
    const rulesEqual = afterBytes.equals(beforeBytes);
    if (!rulesEqual) failures.push(`${skill}: sidecar rules differ from the before snapshot`);
    const { recorded, mismatches } = evaluateRows(engine, rowsFor(rows, skill), skill, rules, run);
    writeRecording(path.join(HERE, 'after', `${skill}.verdicts.json`), recorded);
    failures.push(...mismatches);
    process.stdout.write(
      `after ${skill}: ${rules.length} rules, ${recorded.length} rows${rulesEqual ? '' : ' (RULES DIFFER)'}\n`,
    );
  }
  for (const failure of failures) process.stderr.write(`after failure: ${failure}\n`);
  if (failures.length) process.exit(1);
}

function filesEqual(a, b) {
  if (!fs.existsSync(a) || !fs.existsSync(b)) return false;
  return fs.readFileSync(a).equals(fs.readFileSync(b));
}

function modeCompare() {
  const rows = readCorpus();
  let allEqual = true;
  for (const skill of skillOrder(rows)) {
    const count = rowsFor(rows, skill).length;
    const rulesEqual = filesEqual(
      path.join(HERE, 'before', `${skill}.rules.json`),
      path.join(HERE, 'after', `${skill}.rules.json`),
    );
    const verdictsEqual = filesEqual(
      path.join(HERE, 'before', `${skill}.verdicts.json`),
      path.join(HERE, 'after', `${skill}.verdicts.json`),
    );
    if (rulesEqual && verdictsEqual) {
      process.stdout.write(`equal ${skill} ${count} rows\n`);
      continue;
    }
    allEqual = false;
    const differing = [rulesEqual ? null : 'rules', verdictsEqual ? null : 'verdicts'].filter(Boolean).join('+');
    process.stderr.write(`differ ${skill} (${differing})\n`);
    process.stdout.write(`differ ${skill} ${count} rows\n`);
  }
  process.exit(allEqual ? 0 : 1);
}

const MODES = { '--before': modeBefore, '--after': modeAfter, '--compare': modeCompare };

const mode = process.argv[2];
if (!Object.hasOwn(MODES, mode ?? '')) {
  process.stderr.write('usage: record-verdicts.mjs --before | --after | --compare\n');
  process.exit(2);
}
await MODES[mode]();
