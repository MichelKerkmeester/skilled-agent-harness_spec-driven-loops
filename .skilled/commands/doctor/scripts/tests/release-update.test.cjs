#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Release Update Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { afterEach, test } = require('node:test');
const {
  compareVersions,
  enumerateUnits,
  latestTag,
  parseVersion,
  syntheticPathForUnit,
} = require('../release-update.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS AND FIXTURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const SCRIPT_PATH = path.join(__dirname, '..', 'release-update.cjs');
const HUB_A_FILE = '.skilled/skills/hub-a/references/a.md';
const HUB_B_FILE = '.skilled/skills/hub-b/SKILL.md';
const CHILD_FILE = '.skilled/skills/hub-b/child-c/references/c.md';
const HUB_D_FILE = '.skilled/skills/hub-d/SKILL.md';
const HUB_LOCAL_FILE = '.skilled/skills/hub-local/SKILL.md';
const EXECUTABLE_FILE = '.skilled/commands/fam/run.sh';
const SYMLINK_FILE = '.skilled/commands/fam/current-link';
const HUB_B_RELEASE_FILE = '.skilled/skills/hub-b/references/managed.md';
const HUB_A_LEAF_MANIFEST = '.skilled/skills/hub-a/leaf-manifest.json';
const HUB_A_GRAPH = '.skilled/skills/hub-a/graph-metadata.json';
const HUB_B_GRAPH = '.skilled/skills/hub-b/graph-metadata.json';
const fixtureRoots = new Set();

function git(repo, args) {
  return execFileSync('git', args, {
    cwd: repo,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();
}

function configureGit(repo) {
  git(repo, ['config', 'user.name', 'Release Update Fixture']);
  git(repo, ['config', 'user.email', 'release-update@example.invalid']);
}

function writeFile(repo, relative, content) {
  const target = path.join(repo, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function commitAll(repo, message) {
  git(repo, ['add', '--all']);
  git(repo, ['commit', '-q', '-m', message]);
}

function makeFixture({ mergeable = false, withModes = false, withHubBRelease = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'release-update-fixture-'));
  fixtureRoots.add(root);
  const upstream = path.join(root, 'upstream');
  const operator = path.join(root, 'operator');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  configureGit(upstream);
  writeFile(upstream, '.skilled/skills/hub-a/SKILL.md', '# hub-a\n');
  writeFile(upstream, HUB_A_FILE, '# a reference\nBase line\n');
  writeFile(upstream, HUB_B_FILE, '# hub-b\nBase hub instructions\n');
  writeFile(upstream, '.skilled/skills/hub-b/child-c/SKILL.md', '# child-c\n');
  writeFile(upstream, CHILD_FILE, 'first: base\nmiddle: stable\nlast: base\n');
  if (withHubBRelease) writeFile(upstream, HUB_B_RELEASE_FILE, 'base-managed\n');
  writeFile(upstream, '.skilled/commands/fam/x.md', '# command family\n');
  if (withModes) {
    writeFile(upstream, EXECUTABLE_FILE, '#!/bin/sh\necho base\n');
    fs.chmodSync(path.join(upstream, EXECUTABLE_FILE), 0o755);
    fs.symlinkSync('target-v1', path.join(upstream, SYMLINK_FILE));
  }
  commitAll(upstream, 'base release');
  git(upstream, ['tag', '-a', 'v1.0.0.0', '-m', 'release v1.0.0.0']);

  const baseTree = path.join(root, 'v1.0-tree');
  fs.cpSync(path.join(upstream, '.skilled'), path.join(baseTree, '.skilled'), { recursive: true });
  git(root, ['clone', '--quiet', upstream, operator]);
  configureGit(operator);

  writeFile(upstream, HUB_A_FILE, '# a reference\nRelease line\n');
  writeFile(
    upstream,
    CHILD_FILE,
    'first: release\nmiddle: stable\nlast: base\n',
  );
  writeFile(upstream, HUB_D_FILE, '# hub-d\nNew release skill\n');
  if (withHubBRelease) writeFile(upstream, HUB_B_RELEASE_FILE, 'release-managed\n');
  if (withModes) {
    writeFile(upstream, EXECUTABLE_FILE, '#!/bin/sh\necho release\n');
    fs.unlinkSync(path.join(upstream, SYMLINK_FILE));
    fs.symlinkSync('target-v2', path.join(upstream, SYMLINK_FILE));
  }
  commitAll(upstream, 'release changes');
  git(upstream, ['tag', '-a', 'v1.1.0.0', '-m', 'release v1.1.0.0']);
  git(upstream, ['tag', '-a', 'v1.10.0.0-beta.1', '-m', 'preview release']);

  writeFile(operator, HUB_B_FILE, '# hub-b\nOperator-only hub customization\n');
  writeFile(
    operator,
    CHILD_FILE,
    mergeable
      ? 'first: base\nmiddle: stable\nlast: operator\n'
      : 'first: operator\nmiddle: stable\nlast: base\n',
  );
  commitAll(operator, 'operator customizations');

  return { root, upstream, operator, baseTree };
}

function makeLocalOnlyFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'release-update-local-'));
  fixtureRoots.add(root);
  const upstream = path.join(root, 'upstream');
  const operator = path.join(root, 'operator');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  configureGit(upstream);
  writeFile(upstream, '.skilled/skills/hub-a/SKILL.md', '# hub-a\n');
  writeFile(upstream, HUB_A_FILE, '# a reference\nBase line\n');
  writeFile(upstream, HUB_B_FILE, '# hub-b\nBase hub instructions\n');
  commitAll(upstream, 'base release');
  git(upstream, ['tag', '-a', 'v1.0.0.0', '-m', 'release v1.0.0.0']);
  git(root, ['clone', '--quiet', upstream, operator]);
  configureGit(operator);
  writeFile(operator, HUB_A_FILE, '# a reference\nLocal line\n');
  writeFile(operator, HUB_LOCAL_FILE, '# hub-local\nLocally created skill\n');
  commitAll(operator, 'local edits');
  return { root, upstream, operator };
}

function makeRemovedFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'release-update-removed-'));
  fixtureRoots.add(root);
  const upstream = path.join(root, 'upstream');
  const operator = path.join(root, 'operator');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  configureGit(upstream);
  writeFile(upstream, '.skilled/skills/hub-a/SKILL.md', '# hub-a\n');
  writeFile(upstream, HUB_A_FILE, '# a reference\nBase line\n');
  writeFile(upstream, HUB_B_FILE, '# hub-b\nBase hub instructions\n');
  commitAll(upstream, 'base release');
  git(upstream, ['tag', '-a', 'v1.0.0.0', '-m', 'release v1.0.0.0']);
  git(root, ['clone', '--quiet', upstream, operator]);
  configureGit(operator);
  fs.rmSync(path.join(upstream, '.skilled/skills/hub-b'), { recursive: true });
  commitAll(upstream, 'drop hub-b from the release');
  git(upstream, ['tag', '-a', 'v1.1.0.0', '-m', 'release v1.1.0.0']);
  return { root, upstream, operator };
}

function graphMetadata(skillId, authoredNote, derivedStamp) {
  return JSON.stringify({
    schema_version: 2,
    skill_id: skillId,
    note: authoredNote,
    derived: { last_updated_at: derivedStamp, trigger_phrases: [skillId + ' ' + derivedStamp] },
  }, null, 2) + '\n';
}

// Upstream ships a leaf manifest and graph metadata; the release changes only an
// authored reference. The operator then regenerates both artifacts locally, as
// the generators do after any source change, and edits one authored field.
function makeGeneratedFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'release-update-generated-'));
  fixtureRoots.add(root);
  const upstream = path.join(root, 'upstream');
  const operator = path.join(root, 'operator');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  configureGit(upstream);
  writeFile(upstream, '.skilled/skills/hub-a/SKILL.md', '# hub-a\n');
  writeFile(upstream, HUB_A_FILE, '# a reference\nBase line\n');
  writeFile(upstream, HUB_A_LEAF_MANIFEST, '{\n  "leaves": ["base"]\n}\n');
  writeFile(upstream, HUB_A_GRAPH, graphMetadata('hub-a', 'authored', 'base'));
  writeFile(upstream, HUB_B_FILE, '# hub-b\nBase hub instructions\n');
  writeFile(upstream, HUB_B_GRAPH, graphMetadata('hub-b', 'authored', 'base'));
  commitAll(upstream, 'base release');
  git(upstream, ['tag', '-a', 'v1.0.0.0', '-m', 'release v1.0.0.0']);
  git(root, ['clone', '--quiet', upstream, operator]);
  configureGit(operator);
  writeFile(upstream, HUB_A_FILE, '# a reference\nRelease line\n');
  commitAll(upstream, 'release changes');
  git(upstream, ['tag', '-a', 'v1.1.0.0', '-m', 'release v1.1.0.0']);
  writeFile(operator, HUB_A_LEAF_MANIFEST, '{\n  "leaves": ["regenerated"]\n}\n');
  writeFile(operator, HUB_A_GRAPH, graphMetadata('hub-a', 'authored', 'regenerated'));
  writeFile(operator, HUB_B_GRAPH, graphMetadata('hub-b', 'operator edit', 'base'));
  commitAll(operator, 'local regeneration and one authored edit');
  return { root, upstream, operator };
}

// Stable and prerelease tags whose numeric order differs from their string order.
function makePrereleaseFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'release-update-prerelease-'));
  fixtureRoots.add(root);
  const upstream = path.join(root, 'upstream');
  const operator = path.join(root, 'operator');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  configureGit(upstream);
  writeFile(upstream, '.skilled/skills/hub-a/SKILL.md', '# hub-a\n');
  writeFile(upstream, HUB_A_FILE, '# a reference\nBase line\n');
  commitAll(upstream, 'base release');
  git(upstream, ['tag', '-a', 'v1.9.0.0', '-m', 'release v1.9.0.0']);
  git(root, ['clone', '--quiet', upstream, operator]);
  configureGit(operator);
  for (const tag of ['v1.10.0.0', 'v1.9.5.0-rc.1', 'v1.11.0.0-beta.1']) {
    writeFile(upstream, HUB_A_FILE, '# a reference\n' + tag + ' line\n');
    commitAll(upstream, 'changes for ' + tag);
    git(upstream, ['tag', '-a', tag, '-m', 'release ' + tag]);
  }
  return { root, upstream, operator };
}

// A base release v1.0.0.0 from `baseFiles`, an operator clone of it, and a
// v1.1.0.0 release that writes or (for a null value) deletes `releaseFiles`.
function makePair(baseFiles, releaseFiles) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'release-update-pair-'));
  fixtureRoots.add(root);
  const upstream = path.join(root, 'upstream');
  const operator = path.join(root, 'operator');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  configureGit(upstream);
  for (const [relative, content] of Object.entries(baseFiles)) {
    writeFile(upstream, relative, content);
  }
  commitAll(upstream, 'base release');
  git(upstream, ['tag', '-a', 'v1.0.0.0', '-m', 'release v1.0.0.0']);
  git(root, ['clone', '--quiet', upstream, operator]);
  configureGit(operator);
  for (const [relative, content] of Object.entries(releaseFiles)) {
    if (content === null) fs.rmSync(path.join(upstream, relative));
    else writeFile(upstream, relative, content);
  }
  commitAll(upstream, 'release changes');
  git(upstream, ['tag', '-a', 'v1.1.0.0', '-m', 'release v1.1.0.0']);
  return { root, upstream, operator };
}

// Run directories are gitignored in a real checkout; mirror that so later
// commits in a test never capture them.
function ignoreRuns(repo) {
  writeFile(repo, '.gitignore', '.skilled/release/runs/\n');
  commitAll(repo, 'ignore release runs');
}

const FAMILY_UNIT_KEYS = [
  'command:commands/fam', 'skill:hub-a', 'skill:hub-b', 'skill:hub-b/child-c',
];
const HOOKS_DIR_FILE = '.skilled/hooks/pre-commit';
const HOOKS_SKILL_FILE = '.skilled/skills/hooks/SKILL.md';

// A top-level hooks directory and a skill hub also named hooks, both changed by
// the release, so each is an update unit of its own.
function makeHooksPair() {
  return makePair(
    {
      '.skilled/skills/hub-a/SKILL.md': '# hub-a\n',
      [HOOKS_DIR_FILE]: '#!/bin/sh\necho base\n',
      [HOOKS_SKILL_FILE]: '# hooks skill\nBase\n',
    },
    {
      [HOOKS_DIR_FILE]: '#!/bin/sh\necho release\n',
      [HOOKS_SKILL_FILE]: '# hooks skill\nRelease\n',
    },
  );
}

function writeBase(repo, units) {
  const record = JSON.stringify({ schemaVersion: 1, units }, null, 2);
  writeFile(repo, '.skilled/release/base.json', record);
  commitAll(repo, 'base record');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readText(repo, relative) {
  return fs.readFileSync(path.join(repo, relative), 'utf8');
}

// A fresh repository holding a copy of the base release tree and no history
// shared with upstream, as a vendored or copied install has.
function makeVendor(fixture, name) {
  const vendor = path.join(fixture.root, name);
  fs.mkdirSync(vendor);
  git(vendor, ['init', '-q']);
  configureGit(vendor);
  const source = path.join(fixture.baseTree, '.skilled');
  fs.cpSync(source, path.join(vendor, '.skilled'), { recursive: true });
  commitAll(vendor, 'vendor framework tree');
  return vendor;
}

function decideFile(repo, runDir, filePath, decision) {
  return runCli(repo, 'decide', '--run', runDir, '--path', filePath, '--decision', decision);
}

function runRaw(...args) {
  const result = spawnSync(process.execPath, [SCRIPT_PATH, ...args], { encoding: 'utf8' });
  return { exitCode: result.status, stdout: result.stdout, stderr: result.stderr };
}

function runCli(repo, ...args) {
  const result = spawnSync(process.execPath, [
    SCRIPT_PATH,
    ...args,
    '--repo',
    repo,
    '--json',
  ], { encoding: 'utf8' });
  let document;
  try {
    document = JSON.parse(result.stdout);
  } catch (error) {
    throw new Error('CLI did not emit one JSON document: ' + result.stdout + '\n' + result.stderr);
  }
  return { exitCode: result.status, document, stdout: result.stdout, stderr: result.stderr };
}

// Finds a unit by its kind:name key, or by a name only one unit carries.
function unit(report, ref) {
  const found = report.units.filter((candidate) => candidate.key === ref || candidate.name === ref);
  assert.equal(found.length, 1, 'expected one unit ' + ref + ' in report');
  return found[0];
}

function runFile(plan, filePath) {
  return plan.files.find((file) => file.path === filePath);
}

function proposalPath(runDir, filePath) {
  return path.join(runDir, 'proposals', filePath.replace(/^\.skilled\//, ''));
}

afterEach(() => {
  for (const root of fixtureRoots) fs.rmSync(root, { recursive: true, force: true });
  fixtureRoots.clear();
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. VERSION AND UNIT BEHAVIOR
// ─────────────────────────────────────────────────────────────────────────────

test('versions compare by numeric segment and parser excludes no data', () => {
  assert.ok(parseVersion('v1.10.0.0-beta.1'));
  assert.equal(compareVersions('v1.10.0.0', 'v1.9.0.0'), 1);
  assert.equal(compareVersions('v1.1.0.0-beta.1', 'v1.1.0.0'), -1);
  assert.equal(parseVersion('not-a-release'), null);
});

test('latest-tag resolution excludes prereleases by default and orders numerically', () => {
  const tags = ['v1.9.0.0', 'v1.10.0.0', 'v1.9.5.0-rc.1', 'v1.11.0.0-beta.1', 'v1.2.0.0'];
  assert.equal(latestTag(tags), 'v1.10.0.0');
  assert.equal(latestTag(tags, true), 'v1.11.0.0-beta.1');
  assert.equal(latestTag(['v1.11.0.0-beta.1']), null);
});

test('unit enumeration separates hubs, child skills, command families, and root files', () => {
  const units = enumerateUnits([
    '.skilled/root.md',
    '.skilled/skills/hub-a/SKILL.md',
    '.skilled/skills/hub-b/SKILL.md',
    '.skilled/skills/hub-b/child-c/SKILL.md',
    '.skilled/skills/hub-b/child-c/references/c.md',
    '.skilled/commands/fam/x.md',
    '.skilled/hooks/pre-commit',
  ]);
  assert.deepEqual(units.map((entry) => entry.name), [
    '(root)', 'commands/fam', 'hooks', 'hub-a', 'hub-b', 'hub-b/child-c',
  ]);
});

test('prerelease identifiers compare numerically when both are numeric', () => {
  assert.equal(compareVersions('v1.0.0.0-rc.10', 'v1.0.0.0-rc.9'), 1);
  assert.equal(compareVersions('v1.0.0.0-rc.9', 'v1.0.0.0-rc.10'), -1);
  assert.equal(compareVersions('v1.0.0.0-alpha', 'v1.0.0.0-beta'), -1);
  assert.equal(compareVersions('v1.0.0.0-rc.1', 'v1.0.0.0-rc.1.1'), -1);
  assert.equal(compareVersions('v1.0.0.0-1', 'v1.0.0.0-alpha'), -1);
  const candidates = ['v1.0.0.0-rc.9', 'v1.0.0.0-rc.10', 'v1.0.0.0-rc.2'];
  assert.equal(latestTag(candidates, true), 'v1.0.0.0-rc.10');
});

test('a directory unit and a skill unit with the same name both survive enumeration', () => {
  const kinds = (units) => units.map((entry) => entry.kind + ':' + entry.name).sort();
  const units = enumerateUnits(['.skilled/hooks/a.sh', '.skilled/skills/hooks/SKILL.md']);
  assert.deepEqual(kinds(units), ['directory:hooks', 'skill:hooks']);
  for (const kind of ['directory', 'skill']) {
    const placeholder = syntheticPathForUnit('hooks', kind);
    assert.deepEqual(kinds(enumerateUnits([placeholder])), [kind + ':hooks']);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. CHECK AND ALIGN
// ─────────────────────────────────────────────────────────────────────────────

test('check selects the latest stable release and reports unit changes', () => {
  const fixture = makeFixture();
  const result = runCli(fixture.operator, 'check');
  assert.equal(result.exitCode, 0);
  const report = result.document;
  assert.equal(report.upstream.latest, 'v1.1.0.0');
  assert.equal(unit(report, 'hub-a').status, 'update');
  assert.equal(unit(report, 'hub-b/child-c').status, 'conflict');
  assert.equal(unit(report, 'hub-b').status, 'local');
  assert.equal(unit(report, 'hub-d').status, 'new');
  assert.equal(runFile(report, CHILD_FILE).conflictKind, 'conflicting');

  const offline = runCli(fixture.operator, 'check', '--offline');
  assert.equal(offline.exitCode, 0);
  assert.equal(offline.document.upstream.latest, 'unknown');
  assert.equal(offline.document.status, 'unknown');
  assert.doesNotMatch(JSON.stringify(offline.document), /\bcurrent\b/);
});

test('locally created and locally edited units report local without release updates', () => {
  const fixture = makeLocalOnlyFixture();
  const result = runCli(fixture.operator, 'check');
  assert.equal(result.exitCode, 0);
  const report = result.document;
  assert.equal(report.status, 'current');
  assert.notEqual(unit(report, 'hub-local').status, 'removed');
  assert.equal(unit(report, 'hub-local').status, 'local');
  assert.equal(unit(report, 'hub-a').status, 'local');
  assert.equal(unit(report, 'hub-b').status, 'current');
});

test('a unit present in the base and absent from the release reports removed', () => {
  const fixture = makeRemovedFixture();
  const result = runCli(fixture.operator, 'check');
  assert.equal(result.exitCode, 0);
  const report = result.document;
  assert.equal(unit(report, 'hub-a').status, 'current');
  assert.equal(unit(report, 'hub-b').status, 'removed');
  assert.equal(report.status, 'updates-available');
});

test('mergeable edits get a clean proposal and align writes only under its run directory', () => {
  const fixture = makeFixture({ mergeable: true });
  const dry = runCli(fixture.operator, 'align', '--dry-run');
  assert.equal(dry.exitCode, 0);
  assert.equal(fs.existsSync(dry.document.runDir), false);

  const aligned = runCli(fixture.operator, 'align');
  assert.equal(aligned.exitCode, 0);
  const runDir = aligned.document.runDir;
  const plan = JSON.parse(fs.readFileSync(path.join(runDir, 'plan.json'), 'utf8'));
  const conflict = runFile(plan, CHILD_FILE);
  assert.equal(conflict.conflictKind, 'mergeable');
  const proposal = fs.readFileSync(proposalPath(runDir, CHILD_FILE), 'utf8');
  assert.doesNotMatch(proposal, /^(<<<<<<<|=======|>>>>>>>)/m);
  assert.match(proposal, /first: release/);
  assert.match(proposal, /last: operator/);

  const status = git(fixture.operator, ['status', '--short', '--untracked-files=all']);
  assert.ok(status.split(/\r?\n/).every((line) => line.includes('.skilled/release/runs/')));
});

test('conflicting proposals reject merge and accept use-proposal after marker removal', () => {
  const fixture = makeFixture();
  const aligned = runCli(fixture.operator, 'align');
  assert.equal(aligned.exitCode, 0);
  const runDir = aligned.document.runDir;
  const plan = JSON.parse(fs.readFileSync(path.join(runDir, 'plan.json'), 'utf8'));
  const conflict = runFile(plan, CHILD_FILE);
  assert.equal(conflict.conflictKind, 'conflicting');
  const file = proposalPath(runDir, CHILD_FILE);
  assert.match(fs.readFileSync(file, 'utf8'), /^<<<<<<< local/m);

  const rejectedMerge = decideFile(fixture.operator, runDir, CHILD_FILE, 'merge');
  assert.equal(rejectedMerge.exitCode, 1);
  assert.match(rejectedMerge.document.error, /only for mergeable/);
  const rejectedProposal = decideFile(fixture.operator, runDir, CHILD_FILE, 'use-proposal');
  assert.equal(rejectedProposal.exitCode, 1);
  assert.match(rejectedProposal.document.error, /conflict markers/);

  fs.writeFileSync(file, 'first: operator and release\nmiddle: stable\nlast: base\n');
  const accepted = decideFile(fixture.operator, runDir, CHILD_FILE, 'use-proposal');
  assert.equal(accepted.exitCode, 0);
  assert.equal(accepted.document.decision, 'use-proposal');
  const decisions = JSON.parse(fs.readFileSync(path.join(runDir, 'decisions.json'), 'utf8'));
  assert.match(decisions.files[CHILD_FILE].proposalSha256, /^[0-9a-f]{64}$/);
});

test('locally regenerated artifacts are a generated class that never customizes a unit', () => {
  const fixture = makeGeneratedFixture();
  const result = runCli(fixture.operator, 'check');
  assert.equal(result.exitCode, 0, JSON.stringify(result.document));
  const report = result.document;
  const hubA = unit(report, 'hub-a');
  assert.equal(hubA.status, 'update');
  assert.equal(runFile(report, HUB_A_LEAF_MANIFEST).class, 'generated');
  assert.equal(runFile(report, HUB_A_GRAPH).class, 'generated');
  const regeneratePaths = hubA.regenerate.map((entry) => entry.path).sort();
  assert.deepEqual(regeneratePaths, [HUB_A_GRAPH, HUB_A_LEAF_MANIFEST].sort());
  const generatorRe = /generate-leaf-manifest|regenerate-skill-derived/;
  assert.ok(hubA.regenerate.every((entry) => generatorRe.test(entry.generator)));
  // An edit outside the derived block is authored, so it stays a customization.
  assert.equal(runFile(report, HUB_B_GRAPH).class, 'local-only');
  assert.equal(unit(report, 'hub-b').status, 'local');

  const dry = runCli(fixture.operator, 'apply', '--dry-run');
  assert.equal(dry.exitCode, 0, JSON.stringify(dry.document));
  const written = dry.document.writes.map((write) => write.path);
  assert.ok(written.includes(HUB_A_FILE));
  assert.ok(!written.includes(HUB_A_LEAF_MANIFEST) && !written.includes(HUB_A_GRAPH));
  const regenerated = dry.document.followUps.regenerate.flatMap((entry) => entry.paths).sort();
  assert.deepEqual(regenerated, [HUB_A_GRAPH, HUB_A_LEAF_MANIFEST].sort());
});

test('a graph-metadata release edit outside the derived block is taken, then regenerated', () => {
  const fixture = makeGeneratedFixture();
  writeFile(fixture.upstream, HUB_A_GRAPH, graphMetadata('hub-a', 'release note', 'base'));
  commitAll(fixture.upstream, 'release edits authored graph metadata');
  git(fixture.upstream, ['tag', '-a', 'v1.2.0.0', '-m', 'release v1.2.0.0']);
  const report = runCli(fixture.operator, 'check').document;
  const file = runFile(report, HUB_A_GRAPH);
  assert.equal(file.class, 'take-release');
  assert.equal(file.regenerate, true);
  assert.equal(unit(report, 'hub-a').status, 'update');
});

test('a copied tree reports a recorded base after record-base', () => {
  const fixture = makeFixture();
  const vendor = makeVendor(fixture, 'vendor-recorded');

  const before = runCli(vendor, 'check', '--remote', fixture.upstream);
  assert.equal(before.exitCode, 0, JSON.stringify(before.document));
  assert.equal(unit(before.document, 'hub-a').baseSource, 'inferred');
  assert.equal(before.document.baseRecording.needed, true);
  assert.match(before.document.baseRecording.action, /record-base --release/);

  const noTag = runCli(vendor, 'record-base', '--remote', fixture.upstream);
  assert.equal(noTag.exitCode, 1);
  assert.match(noTag.document.error, /name the release this tree was installed from/);

  const recordArgs = ['record-base', '--release', 'v1.0.0.0', '--remote', fixture.upstream];
  const recorded = runCli(vendor, ...recordArgs);
  assert.equal(recorded.exitCode, 0, JSON.stringify(recorded.document));
  assert.deepEqual(recorded.document.units, FAMILY_UNIT_KEYS);
  const base = JSON.parse(fs.readFileSync(path.join(vendor, '.skilled/release/base.json'), 'utf8'));
  assert.equal(base.units['skill:hub-a'].release, 'v1.0.0.0');
  assert.match(base.units['skill:hub-a'].tree, /^[0-9a-f]{64}$/);

  const after = runCli(vendor, 'check', '--remote', fixture.upstream);
  assert.equal(after.exitCode, 0, JSON.stringify(after.document));
  for (const key of recorded.document.units) {
    assert.equal(unit(after.document, key).baseSource, 'recorded', key);
  }
  assert.equal(unit(after.document, 'hub-a').status, 'update');
  assert.deepEqual(after.document.baseRecording.units, []);
  assert.equal(after.document.baseRecording.needed, false);

  const again = runCli(vendor, ...recordArgs);
  assert.equal(again.exitCode, 1);
  assert.match(again.document.error, /commit or discard it/);
});

test('latest-upstream resolution takes stable tags unless prereleases are opted in', () => {
  const fixture = makePrereleaseFixture();
  const stable = runCli(fixture.operator, 'check');
  assert.equal(stable.exitCode, 0, JSON.stringify(stable.document));
  assert.equal(stable.document.upstream.latest, 'v1.10.0.0');
  assert.equal(stable.document.release, 'v1.10.0.0');
  const opted = runCli(fixture.operator, 'check', '--include-prerelease');
  assert.equal(opted.exitCode, 0, JSON.stringify(opted.document));
  assert.equal(opted.document.upstream.latest, 'v1.11.0.0-beta.1');
  assert.equal(opted.document.release, 'v1.11.0.0-beta.1');
});

test('check survives a release that deletes an unedited changelog and extracts added ones', () => {
  const removed = '.skilled/skills/hub-a/changelog/v1.0.0.0.md';
  const added = '.skilled/skills/hub-a/changelog/v1.1.0.0.md';
  const fixture = makePair(
    { '.skilled/skills/hub-a/SKILL.md': '# hub-a\n', [removed]: '# v1.0.0.0\n' },
    { [removed]: null, [added]: '# v1.1.0.0\nNew behaviour\n' },
  );
  const result = runCli(fixture.operator, 'check');
  assert.equal(result.exitCode, 0, JSON.stringify(result.document));
  const hubA = unit(result.document, 'hub-a');
  assert.equal(hubA.status, 'update');
  assert.equal(runFile(result.document, removed).class, 'take-release');
  assert.deepEqual(hubA.changelogs, [{ path: added, content: '# v1.1.0.0\nNew behaviour\n' }]);
});

test('a recorded base for an unresolvable release never hides a directory unit', () => {
  const fixture = makePair(
    { '.skilled/skills/hub-a/SKILL.md': '# hub-a\n', '.skilled/hooks/pre-commit': '#!/bin/sh\n' },
    { '.skilled/skills/hub-a/SKILL.md': '# hub-a\nRelease\n' },
  );
  writeFile(fixture.operator, '.skilled/release/base.json', JSON.stringify({
    schemaVersion: 1,
    units: { hooks: { release: 'v9.0.0.0' } },
  }));
  commitAll(fixture.operator, 'base record for a release this clone never saw');
  const result = runCli(fixture.operator, 'check', '--offline');
  assert.equal(result.exitCode, 0, JSON.stringify(result.document));
  const hooks = result.document.units.filter((entry) => entry.name === 'hooks');
  assert.deepEqual(hooks.map((entry) => entry.kind), ['directory']);
});

test('a directory and a skill hub sharing a name stay separate through apply and rollback', () => {
  const fixture = makeHooksPair();
  ignoreRuns(fixture.operator);
  const basePath = path.join(fixture.operator, '.skilled/release/base.json');
  const recorded = runCli(fixture.operator, 'record-base', '--release', 'v1.0.0.0');
  assert.equal(recorded.exitCode, 0, JSON.stringify(recorded.document));
  assert.ok(recorded.document.units.includes('directory:hooks'));
  assert.ok(recorded.document.units.includes('skill:hooks'));
  const base = readJson(basePath);
  assert.equal(base.units['directory:hooks'].release, 'v1.0.0.0');
  assert.equal(base.units['skill:hooks'].release, 'v1.0.0.0');
  assert.notEqual(base.units['directory:hooks'].tree, base.units['skill:hooks'].tree);
  assert.equal(base.units.hooks, undefined);
  commitAll(fixture.operator, 'record the installed release');

  const report = runCli(fixture.operator, 'check').document;
  for (const key of ['directory:hooks', 'skill:hooks']) {
    assert.equal(unit(report, key).status, 'update', key);
    assert.equal(unit(report, key).baseSource, 'recorded', key);
  }
  assert.equal(runFile(report, HOOKS_DIR_FILE).unit, 'directory:hooks');
  assert.equal(runFile(report, HOOKS_SKILL_FILE).unit, 'skill:hooks');

  const aligned = runCli(fixture.operator, 'align');
  assert.equal(aligned.exitCode, 0, JSON.stringify(aligned.document));
  const runDir = aligned.document.runDir;
  const defer = (ref) => runCli(fixture.operator, 'decide', '--run', runDir,
    '--unit', ref, '--defer');
  const ambiguous = defer('hooks');
  assert.equal(ambiguous.exitCode, 1);
  assert.match(ambiguous.document.error, /ambiguous.*directory:hooks.*skill:hooks/);
  const deferred = defer('skill:hooks');
  assert.equal(deferred.exitCode, 0, JSON.stringify(deferred.document));
  const decisions = path.join(runDir, 'decisions.json');
  assert.deepEqual(readJson(decisions).deferredUnits, ['skill:hooks']);

  const applied = runCli(fixture.operator, 'apply', '--decisions', decisions);
  assert.equal(applied.exitCode, 0, JSON.stringify(applied.document));
  assert.deepEqual(applied.document.skippedUnits, [{ unit: 'skill:hooks', reason: 'deferred' }]);
  assert.ok(applied.document.appliedUnits.includes('directory:hooks'));
  assert.match(readText(fixture.operator, HOOKS_DIR_FILE), /echo release/);
  assert.match(readText(fixture.operator, HOOKS_SKILL_FILE), /Base/);
  const appliedBase = readJson(basePath);
  assert.equal(appliedBase.units['directory:hooks'].release, 'v1.1.0.0');
  assert.equal(appliedBase.units['skill:hooks'].release, 'v1.0.0.0');

  const rolledBack = runCli(fixture.operator, 'rollback', '--run', runDir);
  assert.equal(rolledBack.exitCode, 0, JSON.stringify(rolledBack.document));
  assert.match(readText(fixture.operator, HOOKS_DIR_FILE), /echo base/);
  assert.equal(readJson(basePath).units['directory:hooks'].release, 'v1.0.0.0');
});

test('an ambiguous --scope name is refused and the kind:name form selects one unit', () => {
  const fixture = makeHooksPair();
  const ambiguous = runCli(fixture.operator, 'check', '--scope', 'hooks');
  assert.equal(ambiguous.exitCode, 2);
  assert.match(ambiguous.document.error, /ambiguous/);
  assert.match(ambiguous.document.error, /directory:hooks/);
  assert.match(ambiguous.document.error, /kind:name/);
  const qualified = runCli(fixture.operator, 'check', '--scope', 'directory:hooks,hub-a');
  assert.equal(qualified.exitCode, 0, JSON.stringify(qualified.document));
  const keys = qualified.document.units.map((entry) => entry.key);
  assert.deepEqual(keys, ['directory:hooks', 'skill:hub-a']);
});

test('a name-only base.json record reads as the one unit with that name and is rewritten', () => {
  const fixture = makeFixture();
  writeBase(fixture.operator, { 'hub-a': { release: 'v1.0.0.0' } });
  const report = runCli(fixture.operator, 'check');
  assert.equal(report.exitCode, 0, JSON.stringify(report.document));
  assert.equal(unit(report.document, 'hub-a').baseSource, 'recorded-unverified');
  assert.ok(report.document.baseRecording.units.includes('skill:hub-a'));
  const applied = runCli(fixture.operator, 'apply');
  assert.equal(applied.exitCode, 0, JSON.stringify(applied.document));
  const base = readJson(path.join(fixture.operator, '.skilled/release/base.json'));
  assert.equal(base.units['skill:hub-a'].release, 'v1.1.0.0');
  assert.deepEqual(Object.keys(base.units).filter((key) => !key.includes(':')), []);
});

test('a name-only base.json record two units share is refused until record-base', () => {
  const fixture = makeHooksPair();
  writeBase(fixture.operator, { hooks: { release: 'v1.0.0.0' } });
  const refused = runCli(fixture.operator, 'check');
  assert.equal(refused.exitCode, 1);
  assert.match(refused.document.error, /base\.json record hooks is ambiguous/);
  assert.match(refused.document.error, /record-base/);
  const rewritten = runCli(fixture.operator, 'record-base', '--release', 'v1.0.0.0');
  assert.equal(rewritten.exitCode, 0, JSON.stringify(rewritten.document));
  const basePath = path.join(fixture.operator, '.skilled/release/base.json');
  const keys = Object.keys(readJson(basePath).units);
  assert.ok(keys.includes('directory:hooks') && keys.includes('skill:hooks'));
  assert.ok(!keys.includes('hooks'));
  commitAll(fixture.operator, 'rewrite the base record');
  assert.equal(runCli(fixture.operator, 'check').exitCode, 0);
});

test('a name-only deferral in an older decisions file still defers its unit', () => {
  const fixture = makeFixture();
  const aligned = runCli(fixture.operator, 'align');
  const decisions = path.join(aligned.document.runDir, 'decisions.json');
  const legacy = { schemaVersion: 1, files: {}, deferredUnits: ['hub-a'] };
  fs.writeFileSync(decisions, JSON.stringify(legacy));
  const applied = runCli(fixture.operator, 'apply', '--decisions', decisions);
  assert.equal(applied.exitCode, 0, JSON.stringify(applied.document));
  assert.ok(applied.document.skippedUnits.some((entry) => (
    entry.unit === 'skill:hub-a' && entry.reason === 'deferred'
  )));
  assert.match(readText(fixture.operator, HUB_A_FILE), /Base line/);
});

test('check --scope narrows the report and an unknown unit is a usage error', () => {
  const fixture = makeFixture();
  const scoped = runCli(fixture.operator, 'check', '--scope', 'hub-a,hub-d');
  assert.equal(scoped.exitCode, 0, JSON.stringify(scoped.document));
  assert.deepEqual(scoped.document.units.map((entry) => entry.name), ['hub-a', 'hub-d']);
  const scopedKeys = ['skill:hub-a', 'skill:hub-d'];
  assert.ok(scoped.document.files.every((file) => scopedKeys.includes(file.unit)));

  const unknown = runCli(fixture.operator, 'check', '--scope', 'hub-a,no-such-unit');
  assert.equal(unknown.exitCode, 2);
  assert.match(unknown.document.error, /unknown scope unit\(s\): no-such-unit/);
});

test('check --release compares against the named tag instead of the latest', () => {
  const fixture = makeFixture();
  const result = runCli(fixture.operator, 'check', '--release', 'v1.0.0.0');
  assert.equal(result.exitCode, 0, JSON.stringify(result.document));
  assert.equal(result.document.release, 'v1.0.0.0');
  assert.equal(result.document.upstream.latest, 'v1.1.0.0');
  assert.equal(unit(result.document, 'hub-a').status, 'current');
  assert.equal(unit(result.document, 'hub-b/child-c').status, 'local');
  assert.equal(result.document.status, 'current');
});

test('check without --json prints a plain-text summary', () => {
  const fixture = makeFixture();
  const result = runRaw('check', '--repo', fixture.operator);
  assert.equal(result.exitCode, 0, result.stderr);
  assert.match(result.stdout, /^release: v1\.1\.0\.0$/m);
  assert.match(result.stdout, /^upstream: v1\.1\.0\.0$/m);
  assert.match(result.stdout, /^status: updates-available$/m);
  assert.match(result.stdout, /^skill:hub-a: update \(ancestry\)$/m);
  assert.throws(() => JSON.parse(result.stdout));
});

test('align reads uncommitted and untracked local content from the worktree', () => {
  const fixture = makeFixture();
  writeFile(fixture.operator, CHILD_FILE, 'first: uncommitted\nmiddle: stable\nlast: base\n');
  writeFile(fixture.operator, HUB_D_FILE, '# hub-d\nOperator draft\n');
  const aligned = runCli(fixture.operator, 'align');
  assert.equal(aligned.exitCode, 0, JSON.stringify(aligned.document));
  const runDir = aligned.document.runDir;
  assert.match(fs.readFileSync(proposalPath(runDir, CHILD_FILE), 'utf8'), /first: uncommitted/);
  assert.match(fs.readFileSync(proposalPath(runDir, HUB_D_FILE), 'utf8'), /Operator draft/);
  const evidence = path.join(runDir, 'evidence', HUB_D_FILE.replace(/^\.skilled\//, '') + '.md');
  assert.match(fs.readFileSync(evidence, 'utf8'), /^\+Operator draft$/m);
});

test('align --out writes the run to the named directory and refuses a non-empty one', () => {
  const fixture = makeFixture();
  const out = path.join(fixture.root, 'chosen-run');
  const aligned = runCli(fixture.operator, 'align', '--out', out);
  assert.equal(aligned.exitCode, 0, JSON.stringify(aligned.document));
  assert.equal(aligned.document.runDir, fs.realpathSync(out));
  assert.equal(aligned.document.externalRunDir, true);
  assert.ok(fs.existsSync(path.join(out, 'plan.json')));
  assert.ok(fs.existsSync(path.join(out, 'decisions.json')));

  const again = runCli(fixture.operator, 'align', '--out', out);
  assert.equal(again.exitCode, 1);
  assert.match(again.document.error, /not empty/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. APPLY AND ROLLBACK
// ─────────────────────────────────────────────────────────────────────────────

test('apply dry-run writes nothing and apply updates only uncustomized units by default', () => {
  const fixture = makeFixture();
  const aligned = runCli(fixture.operator, 'align');
  assert.equal(aligned.exitCode, 0);
  const runDir = aligned.document.runDir;
  const beforeStatus = git(fixture.operator, ['status', '--short', '--untracked-files=all']);
  const beforeA = readText(fixture.operator, HUB_A_FILE);
  const dry = runCli(fixture.operator, 'apply', '--dry-run');
  assert.equal(dry.exitCode, 0);
  assert.equal(fs.existsSync(path.join(fixture.operator, '.skilled/release/base.json')), false);
  assert.equal(fs.existsSync(path.join(fixture.operator, '.skilled/release/.apply.lock')), false);
  assert.equal(fs.existsSync(path.join(runDir, 'rollback.json')), false);
  assert.equal(readText(fixture.operator, HUB_A_FILE), beforeA);
  assert.equal(git(fixture.operator, ['status', '--short', '--untracked-files=all']), beforeStatus);

  const applied = runCli(fixture.operator, 'apply');
  assert.equal(applied.exitCode, 0, JSON.stringify(applied.document));
  assert.match(readText(fixture.operator, HUB_A_FILE), /Release line/);
  assert.equal(fs.existsSync(path.join(fixture.operator, HUB_D_FILE)), true);
  assert.match(readText(fixture.operator, HUB_B_FILE), /Operator-only/);
  assert.match(readText(fixture.operator, CHILD_FILE), /first: operator/);
  const base = readJson(path.join(fixture.operator, '.skilled/release/base.json'));
  assert.equal(base.units['skill:hub-a'].release, 'v1.1.0.0');
  assert.equal(base.units['skill:hub-d'].release, 'v1.1.0.0');
  assert.equal(base.units['skill:hub-b'], undefined);
});

test('apply binds to the dry-run release and refuses a plan that changed', () => {
  const fixture = makeFixture();
  const preview = runCli(fixture.operator, 'apply', '--dry-run');
  assert.equal(preview.exitCode, 0, JSON.stringify(preview.document));
  assert.equal(preview.document.release, 'v1.1.0.0');
  assert.equal(preview.document.runDir, null);
  assert.match(preview.document.planDigest, /^[0-9a-f]{64}$/);

  writeFile(fixture.upstream, HUB_A_FILE, '# a reference\nThird line\n');
  commitAll(fixture.upstream, 'third release');
  git(fixture.upstream, ['tag', '-a', 'v1.2.0.0', '-m', 'release v1.2.0.0']);
  const pinned = runCli(
    fixture.operator,
    'apply',
    '--release',
    'v1.1.0.0',
    '--plan-digest',
    preview.document.planDigest,
  );
  assert.equal(pinned.exitCode, 0, JSON.stringify(pinned.document));
  assert.equal(pinned.document.release, 'v1.1.0.0');
  assert.equal(readText(fixture.operator, HUB_A_FILE), '# a reference\nRelease line\n');

  const changedFixture = makeFixture();
  const changedPreview = runCli(changedFixture.operator, 'apply', '--dry-run');
  assert.equal(changedPreview.exitCode, 0, JSON.stringify(changedPreview.document));
  writeFile(changedFixture.operator, HUB_A_FILE, '# a reference\nOperator line\n');
  commitAll(changedFixture.operator, 'change planned file');
  const refused = runCli(
    changedFixture.operator,
    'apply',
    '--plan-digest',
    changedPreview.document.planDigest,
  );
  assert.equal(refused.exitCode, 1, JSON.stringify(refused.document));
  assert.match(refused.document.error, /plan changed since the dry-run/);
  assert.equal(fs.existsSync(path.join(changedFixture.operator, HUB_D_FILE)), false);

  const malformed = runCli(changedFixture.operator, 'apply', '--plan-digest', 'xyz');
  assert.equal(malformed.exitCode, 2);
});

test('a second apply names the uncommitted release record and the commit remedy', () => {
  const fixture = makeFixture({ withHubBRelease: true });
  ignoreRuns(fixture.operator);
  const firstApply = runCli(fixture.operator, 'apply');
  assert.equal(firstApply.exitCode, 0, JSON.stringify(firstApply.document));

  const aligned = runCli(fixture.operator, 'align');
  assert.equal(aligned.exitCode, 0, JSON.stringify(aligned.document));
  const adoptRelease = decideFile(
    fixture.operator,
    aligned.document.runDir,
    HUB_B_RELEASE_FILE,
    'adopt-release',
  );
  assert.equal(adoptRelease.exitCode, 0, JSON.stringify(adoptRelease.document));
  const keepLocal = decideFile(
    fixture.operator,
    aligned.document.runDir,
    CHILD_FILE,
    'keep-local',
  );
  assert.equal(keepLocal.exitCode, 0, JSON.stringify(keepLocal.document));

  const secondApply = runCli(
    fixture.operator,
    'apply',
    '--decisions',
    path.join(aligned.document.runDir, 'decisions.json'),
  );
  assert.equal(secondApply.exitCode, 1);
  assert.match(secondApply.document.error, /\.skilled\/release\/base\.json/);
  assert.match(secondApply.document.error, /Commit it/);
});

test('a bare apply refuses an alignment run that holds operator decisions', () => {
  const fixture = makeFixture({ withHubBRelease: true });
  const aligned = runCli(fixture.operator, 'align');
  assert.equal(aligned.exitCode, 0, JSON.stringify(aligned.document));
  const decision = decideFile(
    fixture.operator,
    aligned.document.runDir,
    HUB_B_RELEASE_FILE,
    'adopt-release',
  );
  assert.equal(decision.exitCode, 0, JSON.stringify(decision.document));

  const bareApply = runCli(fixture.operator, 'apply');
  assert.equal(bareApply.exitCode, 1);
  assert.match(bareApply.document.error, /holds operator decisions/);
  assert.match(bareApply.document.error, /--decisions/);
  assert.equal(fs.existsSync(path.join(aligned.document.runDir, 'rollback.json')), false);

  const decidedApply = runCli(
    fixture.operator,
    'apply',
    '--decisions',
    path.join(aligned.document.runDir, 'decisions.json'),
  );
  assert.equal(decidedApply.exitCode, 0, JSON.stringify(decidedApply.document));
});

test('an explicit older release reports downgrade and apply leaves the unit alone', () => {
  const fixture = makeFixture();
  ignoreRuns(fixture.operator);
  const firstApply = runCli(fixture.operator, 'apply');
  assert.equal(firstApply.exitCode, 0, JSON.stringify(firstApply.document));
  commitAll(fixture.operator, 'record installed release');

  const olderCheck = runCli(fixture.operator, 'check', '--release', 'v1.0.0.0');
  assert.equal(olderCheck.exitCode, 0, JSON.stringify(olderCheck.document));
  assert.equal(unit(olderCheck.document, 'skill:hub-a').status, 'downgrade');

  const olderApply = runCli(fixture.operator, 'apply', '--release', 'v1.0.0.0');
  assert.equal(olderApply.exitCode, 0, JSON.stringify(olderApply.document));
  assert.ok(olderApply.document.skippedUnits.some((entry) => (
    entry.unit === 'skill:hub-a' && entry.reason === 'downgrade'
  )));
  assert.equal(readText(fixture.operator, HUB_A_FILE), '# a reference\nRelease line\n');
});

test(
  'regenerated trigger-index and route manifests are generated and name their generators',
  () => {
    const triggerIndex = '.skilled/skills/system-spec-kit/runtime/data/trigger-index.json';
    const reference = '.skilled/skills/system-spec-kit/references/r.md';
    const routeManifest = '.skilled/bin/lib/compiled-routing/013-live-activation/'
      + 'activation/sk-doc/manifest.json';
    const binTool = '.skilled/bin/tool.cjs';
    const fixture = makePair(
      {
        '.skilled/skills/system-spec-kit/SKILL.md': '# system-spec-kit\n',
        [triggerIndex]: '{"v":1}\n',
        [reference]: 'base\n',
        [routeManifest]: '{"generation":1}\n',
        [binTool]: 'base\n',
      },
      {
        [reference]: 'release\n',
        [binTool]: 'release\n',
      },
    );
    writeFile(fixture.operator, triggerIndex, '{"v":2}\n');
    writeFile(fixture.operator, routeManifest, '{"generation":2}\n');
    commitAll(fixture.operator, 'regenerate derived files');

    const checked = runCli(fixture.operator, 'check');
    assert.equal(checked.exitCode, 0, JSON.stringify(checked.document));
    assert.equal(runFile(checked.document, triggerIndex).class, 'generated');
    assert.equal(runFile(checked.document, routeManifest).class, 'generated');
    assert.equal(unit(checked.document, 'skill:system-spec-kit').status, 'update');
    assert.equal(unit(checked.document, 'directory:bin').status, 'update');

    const preview = runCli(fixture.operator, 'apply', '--dry-run');
    assert.equal(preview.exitCode, 0, JSON.stringify(preview.document));
    const writes = preview.document.writes.map((entry) => entry.path);
    assert.ok(writes.includes(reference));
    assert.ok(writes.includes(binTool));
    assert.ok(!writes.includes(triggerIndex));
    assert.ok(!writes.includes(routeManifest));
    const generators = preview.document.followUps.regenerate.map((entry) => entry.generator);
    assert.ok(generators.some((generator) => /generate-trigger-index\.mjs/.test(generator)));
    assert.ok(generators.some((generator) => /compiled-route-manifest\.cjs/.test(generator)));
  },
);

test('apply writes a customized unit only after decide records its release files', () => {
  const defaultFixture = makeFixture({ withHubBRelease: true });
  const defaultAlignment = runCli(defaultFixture.operator, 'align');
  assert.equal(defaultAlignment.exitCode, 0);
  const defaultPlan = readJson(path.join(defaultAlignment.document.runDir, 'plan.json'));
  assert.equal(unit(defaultPlan, 'hub-b').status, 'customized');
  const defaultApply = runCli(defaultFixture.operator, 'apply');
  assert.equal(defaultApply.exitCode, 0);
  assert.equal(readText(defaultFixture.operator, HUB_B_RELEASE_FILE), 'base-managed\n');

  const decidedFixture = makeFixture({ withHubBRelease: true });
  const decidedAlignment = runCli(decidedFixture.operator, 'align');
  assert.equal(decidedAlignment.exitCode, 0);
  const decisionsPath = path.join(decidedAlignment.document.runDir, 'decisions.json');
  const preview = runCli(decidedFixture.operator, 'apply', '--decisions', decisionsPath, '--dry-run');
  assert.equal(preview.exitCode, 0, JSON.stringify(preview.document));
  assert.ok(preview.document.skippedUnits.some((entry) => (
    entry.unit === 'skill:hub-b' && entry.reason === 'no decisions'
  )));
  assert.ok(!preview.document.writes.some((write) => write.path === HUB_B_RELEASE_FILE));
  assert.equal(readText(decidedFixture.operator, HUB_B_RELEASE_FILE), 'base-managed\n');

  const decided = decideFile(
    decidedFixture.operator,
    decidedAlignment.document.runDir,
    HUB_B_RELEASE_FILE,
    'adopt-release',
  );
  assert.equal(decided.exitCode, 0, JSON.stringify(decided.document));
  const decidedApply = runCli(decidedFixture.operator, 'apply', '--decisions', decisionsPath);
  assert.equal(decidedApply.exitCode, 0, JSON.stringify(decidedApply.document));
  assert.equal(readText(decidedFixture.operator, HUB_B_RELEASE_FILE), 'release-managed\n');
});

test('apply skips a unit whose changing files are only partly decided and keeps its base', () => {
  const fixture = makePair(
    {
      '.skilled/skills/hub-a/SKILL.md': '# hub-a\n',
      '.skilled/skills/hub-a/references/a.md': 'base a\n',
      '.skilled/skills/hub-a/references/b.md': 'base b\n',
    },
    {
      '.skilled/skills/hub-a/references/a.md': 'release a\n',
      '.skilled/skills/hub-a/references/b.md': 'release b\n',
    },
  );
  const aFile = '.skilled/skills/hub-a/references/a.md';
  const bFile = '.skilled/skills/hub-a/references/b.md';
  writeFile(fixture.operator, aFile, 'operator a\n');
  commitAll(fixture.operator, 'customize one file');
  ignoreRuns(fixture.operator);

  const firstAlignment = runCli(fixture.operator, 'align');
  assert.equal(firstAlignment.exitCode, 0, JSON.stringify(firstAlignment.document));
  const firstDecision = decideFile(
    fixture.operator,
    firstAlignment.document.runDir,
    aFile,
    'keep-local',
  );
  assert.equal(firstDecision.exitCode, 0, JSON.stringify(firstDecision.document));
  const firstApply = runCli(
    fixture.operator,
    'apply',
    '--decisions',
    path.join(firstAlignment.document.runDir, 'decisions.json'),
  );
  assert.equal(firstApply.exitCode, 0, JSON.stringify(firstApply.document));
  assert.deepEqual(firstApply.document.skippedUnits, [
    { unit: 'skill:hub-a', reason: 'undecided files', paths: [bFile] },
  ]);
  assert.equal(readText(fixture.operator, bFile), 'base b\n');
  assert.equal(readJson(path.join(fixture.operator, '.skilled/release/base.json')).units['skill:hub-a'], undefined);
  assert.equal(fs.existsSync(path.join(fixture.operator, '.skilled/release/divergence.json')), false);

  commitAll(fixture.operator, 'record partial decision result');
  const checked = runCli(fixture.operator, 'check');
  assert.equal(checked.exitCode, 0, JSON.stringify(checked.document));
  const hub = unit(checked.document, 'skill:hub-a');
  assert.equal(hub.status, 'conflict');
  assert.equal(runFile(checked.document, bFile).class, 'take-release');

  const secondAlignment = runCli(fixture.operator, 'align');
  assert.equal(secondAlignment.exitCode, 0, JSON.stringify(secondAlignment.document));
  const secondDecision = decideFile(
    fixture.operator,
    secondAlignment.document.runDir,
    bFile,
    'adopt-release',
  );
  assert.equal(secondDecision.exitCode, 0, JSON.stringify(secondDecision.document));
  const secondApply = runCli(
    fixture.operator,
    'apply',
    '--decisions',
    path.join(secondAlignment.document.runDir, 'decisions.json'),
  );
  assert.equal(secondApply.exitCode, 0, JSON.stringify(secondApply.document));
  assert.deepEqual(secondApply.document.skippedUnits, [
    { unit: 'skill:hub-a', reason: 'undecided files', paths: [aFile] },
  ]);
  assert.equal(readText(fixture.operator, bFile), 'base b\n');
});

test('apply without a run plans update and new units and refuses decisions without a run', () => {
  const fixture = makeFixture();
  const runsDir = path.join(fixture.operator, '.skilled/release/runs');
  const dry = runCli(fixture.operator, 'apply', '--dry-run');
  assert.equal(dry.exitCode, 0, JSON.stringify(dry.document));
  assert.equal(dry.document.withoutRun, true);
  const written = dry.document.writes.map((write) => write.path);
  assert.ok(written.includes(HUB_A_FILE));
  assert.ok(written.includes(HUB_D_FILE));
  assert.ok(written.includes('.skilled/release/base.json'));
  assert.ok(!written.includes(CHILD_FILE));
  assert.ok(dry.document.skippedUnits.some((entry) => (
    entry.unit === 'skill:hub-b/child-c' && entry.reason === 'no decisions'
  )));
  assert.equal(fs.existsSync(runsDir), false);

  const loose = path.join(fixture.root, 'loose-decisions.json');
  fs.writeFileSync(loose, JSON.stringify({ schemaVersion: 1, files: {}, deferredUnits: [] }));
  const refused = runCli(fixture.operator, 'apply', '--dry-run', '--decisions', loose);
  assert.equal(refused.exitCode, 1);
  assert.match(refused.document.error, /needs its alignment run/);

  const applied = runCli(fixture.operator, 'apply');
  assert.equal(applied.exitCode, 0, JSON.stringify(applied.document));
  assert.match(readText(fixture.operator, HUB_A_FILE), /Release line/);
  assert.match(readText(fixture.operator, CHILD_FILE), /first: operator/);
  assert.ok(fs.existsSync(path.join(applied.document.runDir, 'plan.json')));
  const rolledBack = runCli(fixture.operator, 'rollback', '--run', applied.document.runDir);
  assert.equal(rolledBack.exitCode, 0, JSON.stringify(rolledBack.document));
  assert.match(readText(fixture.operator, HUB_A_FILE), /Base line/);
  assert.equal(fs.existsSync(path.join(fixture.operator, HUB_D_FILE)), false);
});

test('apply refuses a target with staged or unstaged worktree changes', () => {
  const fixture = makeFixture();
  assert.equal(runCli(fixture.operator, 'align').exitCode, 0);
  fs.appendFileSync(path.join(fixture.operator, HUB_A_FILE), 'dirty target\n');
  const result = runCli(fixture.operator, 'apply');
  assert.equal(result.exitCode, 1);
  assert.match(result.document.error, /staged or unstaged changes/);
});

test('apply refuses a local blob that drifted after alignment even after it is committed', () => {
  const fixture = makeFixture();
  const aligned = runCli(fixture.operator, 'align');
  writeFile(fixture.operator, HUB_A_FILE, '# a reference\nCommitted after align\n');
  commitAll(fixture.operator, 'change after alignment');
  const decisions = path.join(aligned.document.runDir, 'decisions.json');
  const result = runCli(fixture.operator, 'apply', '--decisions', decisions);
  assert.equal(result.exitCode, 1);
  assert.match(result.document.error, /drift since align: local blob changed/);
  assert.ok(fs.existsSync(path.join(aligned.document.runDir, 'plan.json')));
});

test('rollback restores prior bytes and removes files added by apply', () => {
  const fixture = makeFixture();
  const beforeA = fs.readFileSync(path.join(fixture.operator, HUB_A_FILE));
  const aligned = runCli(fixture.operator, 'align');
  const runDir = aligned.document.runDir;
  const applied = runCli(fixture.operator, 'apply');
  assert.equal(applied.exitCode, 0, JSON.stringify(applied.document));
  assert.equal(fs.existsSync(path.join(fixture.operator, HUB_D_FILE)), true);
  const rolledBack = runCli(fixture.operator, 'rollback', '--run', runDir);
  assert.equal(rolledBack.exitCode, 0);
  assert.deepEqual(fs.readFileSync(path.join(fixture.operator, HUB_A_FILE)), beforeA);
  assert.equal(fs.existsSync(path.join(fixture.operator, HUB_D_FILE)), false);
  assert.equal(fs.existsSync(path.join(fixture.operator, '.skilled/release/base.json')), false);
});

test('rollback --dry-run previews restored and skipped paths and writes nothing', () => {
  const fixture = makeFixture();
  const applied = runCli(fixture.operator, 'apply');
  assert.equal(applied.exitCode, 0, JSON.stringify(applied.document));
  const runDir = applied.document.runDir;

  const preview = runCli(fixture.operator, 'rollback', '--run', runDir, '--dry-run');
  assert.equal(preview.exitCode, 0, JSON.stringify(preview.document));
  assert.equal(preview.document.dryRun, true);
  assert.ok(preview.document.restored.includes(HUB_A_FILE));
  assert.ok(preview.document.restored.includes(HUB_D_FILE));
  assert.match(readText(fixture.operator, HUB_A_FILE), /Release line/);
  assert.equal(fs.existsSync(path.join(fixture.operator, '.skilled/release/.apply.lock')), false);

  writeFile(fixture.operator, HUB_A_FILE, 'edited after apply\n');
  const secondPreview = runCli(fixture.operator, 'rollback', '--run', runDir, '--dry-run');
  assert.equal(secondPreview.exitCode, 0, JSON.stringify(secondPreview.document));
  assert.ok(secondPreview.document.skipped.includes(HUB_A_FILE));
  assert.equal(readText(fixture.operator, HUB_A_FILE), 'edited after apply\n');
  assert.equal(fs.existsSync(path.join(fixture.operator, '.skilled/release/.apply.lock')), false);
});

test('apply and rollback preserve executable mode and symlink targets', () => {
  const fixture = makeFixture({ withModes: true });
  const aligned = runCli(fixture.operator, 'align');
  assert.equal(aligned.exitCode, 0);
  const applied = runCli(fixture.operator, 'apply');
  assert.equal(applied.exitCode, 0, JSON.stringify(applied.document));
  assert.equal(fs.statSync(path.join(fixture.operator, EXECUTABLE_FILE)).mode & 0o777, 0o755);
  assert.equal(fs.lstatSync(path.join(fixture.operator, SYMLINK_FILE)).isSymbolicLink(), true);
  assert.equal(fs.readlinkSync(path.join(fixture.operator, SYMLINK_FILE)), 'target-v2');

  const rolledBack = runCli(fixture.operator, 'rollback', '--run', aligned.document.runDir);
  assert.equal(rolledBack.exitCode, 0);
  assert.equal(fs.statSync(path.join(fixture.operator, EXECUTABLE_FILE)).mode & 0o777, 0o755);
  assert.equal(fs.lstatSync(path.join(fixture.operator, SYMLINK_FILE)).isSymbolicLink(), true);
  assert.equal(fs.readlinkSync(path.join(fixture.operator, SYMLINK_FILE)), 'target-v1');
});

test('a second apply without decisions plans from the current check, not the applied run', () => {
  const fixture = makeFixture();
  ignoreRuns(fixture.operator);
  const first = runCli(fixture.operator, 'apply');
  assert.equal(first.exitCode, 0, JSON.stringify(first.document));
  commitAll(fixture.operator, 'take v1.1.0.0');
  writeFile(fixture.upstream, HUB_A_FILE, '# a reference\nSecond release line\n');
  commitAll(fixture.upstream, 'second release');
  git(fixture.upstream, ['tag', '-a', 'v1.2.0.0', '-m', 'release v1.2.0.0']);

  const second = runCli(fixture.operator, 'apply', '--release', 'v1.2.0.0');
  assert.equal(second.exitCode, 0, JSON.stringify(second.document));
  assert.equal(second.document.release, 'v1.2.0.0');
  assert.equal(second.document.withoutRun, true);
  assert.notEqual(second.document.runDir, first.document.runDir);
  assert.match(readText(fixture.operator, HUB_A_FILE), /Second release line/);
});

test('apply honours decided files and deferred units, and kept-local reaches the ledger', () => {
  const fixture = makeFixture({ withHubBRelease: true });
  ignoreRuns(fixture.operator);
  const aligned = runCli(fixture.operator, 'align');
  assert.equal(aligned.exitCode, 0, JSON.stringify(aligned.document));
  const runDir = aligned.document.runDir;
  const adopted = decideFile(fixture.operator, runDir, HUB_B_RELEASE_FILE, 'adopt-release');
  assert.equal(adopted.exitCode, 0, JSON.stringify(adopted.document));
  assert.equal(decideFile(fixture.operator, runDir, CHILD_FILE, 'keep-local').exitCode, 0);
  const deferred = runCli(fixture.operator, 'decide', '--run', runDir,
    '--unit', 'hub-a', '--defer');
  assert.equal(deferred.exitCode, 0, JSON.stringify(deferred.document));
  assert.equal(deferred.document.deferred, true);
  const decisionsPath = path.join(runDir, 'decisions.json');
  const decisions = readJson(decisionsPath);
  assert.equal(decisions.files[HUB_B_RELEASE_FILE].decision, 'adopt-release');
  assert.equal(decisions.files[CHILD_FILE].decision, 'keep-local');
  assert.deepEqual(decisions.deferredUnits, ['skill:hub-a']);

  const applied = runCli(fixture.operator, 'apply', '--decisions', decisionsPath);
  assert.equal(applied.exitCode, 0, JSON.stringify(applied.document));
  assert.ok(applied.document.skippedUnits.some((entry) => (
    entry.unit === 'skill:hub-a' && entry.reason === 'deferred'
  )));
  assert.match(readText(fixture.operator, HUB_A_FILE), /Base line/);
  assert.equal(readText(fixture.operator, HUB_B_RELEASE_FILE), 'release-managed\n');
  assert.match(readText(fixture.operator, CHILD_FILE), /first: operator/);
  const ledger = readJson(path.join(fixture.operator, '.skilled/release/divergence.json'));
  const ledgerRows = ledger.entries.map((entry) => [entry.path, entry.decision]);
  assert.deepEqual(ledgerRows, [[CHILD_FILE, 'keep-local']]);
  const base = readJson(path.join(fixture.operator, '.skilled/release/base.json'));
  assert.equal(base.units['skill:hub-a'], undefined);
  assert.equal(base.units['skill:hub-b'].release, 'v1.1.0.0');

  commitAll(fixture.operator, 'apply v1.1.0.0 with decisions');
  const report = runCli(fixture.operator, 'check').document;
  assert.equal(runFile(report, CHILD_FILE).class, 'kept-local');
  assert.equal(unit(report, 'hub-b/child-c').status, 'local');
});

test('binary and deleted-in-release conflicts can adopt the release', () => {
  const logo = '.skilled/skills/hub-a/assets/logo.bin';
  const old = '.skilled/skills/hub-a/references/old.md';
  const releaseLogo = Buffer.from([0, 1, 2, 3, 0, 9]);
  const fixture = makePair(
    {
      '.skilled/skills/hub-a/SKILL.md': '# hub-a\n',
      [logo]: Buffer.from([0, 1, 2]),
      [old]: 'base\n',
    },
    { [logo]: releaseLogo, [old]: null },
  );
  writeFile(fixture.operator, logo, Buffer.from([0, 7, 7]));
  writeFile(fixture.operator, old, 'operator edit\n');
  commitAll(fixture.operator, 'operator edits');
  const aligned = runCli(fixture.operator, 'align');
  assert.equal(aligned.exitCode, 0, JSON.stringify(aligned.document));
  const runDir = aligned.document.runDir;
  const plan = readJson(path.join(runDir, 'plan.json'));
  assert.equal(runFile(plan, logo).conflictKind, 'binary');
  assert.equal(runFile(plan, old).conflictKind, 'deleted-in-release');
  for (const filePath of [logo, old]) {
    const decided = decideFile(fixture.operator, runDir, filePath, 'adopt-release');
    assert.equal(decided.exitCode, 0, JSON.stringify(decided.document));
  }
  const decisions = path.join(runDir, 'decisions.json');
  const applied = runCli(fixture.operator, 'apply', '--decisions', decisions);
  assert.equal(applied.exitCode, 0, JSON.stringify(applied.document));
  assert.deepEqual(fs.readFileSync(path.join(fixture.operator, logo)), releaseLogo);
  assert.equal(fs.existsSync(path.join(fixture.operator, old)), false);
});

test('apply refuses a --release mismatch, a held lock and an already applied run', () => {
  const fixture = makeFixture();
  ignoreRuns(fixture.operator);
  const aligned = runCli(fixture.operator, 'align');
  const runDir = aligned.document.runDir;
  const decisions = path.join(runDir, 'decisions.json');
  const mismatch = runCli(fixture.operator, 'apply', '--decisions', decisions,
    '--release', 'v1.0.0.0');
  assert.equal(mismatch.exitCode, 1);
  assert.match(mismatch.document.error, /--release does not match the alignment plan/);

  const lock = path.join(fixture.operator, '.skilled/release/.apply.lock');
  writeFile(fixture.operator, '.skilled/release/.apply.lock', '{}\n');
  const locked = runCli(fixture.operator, 'apply', '--decisions', decisions);
  assert.equal(locked.exitCode, 1);
  assert.match(locked.document.error, /apply lock already exists/);
  assert.ok(fs.existsSync(lock));
  assert.match(readText(fixture.operator, HUB_A_FILE), /Base line/);
  fs.rmSync(lock);

  assert.equal(runCli(fixture.operator, 'apply', '--decisions', decisions).exitCode, 0);
  commitAll(fixture.operator, 'take v1.1.0.0');
  const again = runCli(fixture.operator, 'apply', '--decisions', decisions);
  assert.equal(again.exitCode, 1);
  assert.match(again.document.error, /already applied/);
  assert.match(again.document.error, /align/);
});

test('a signal while the apply lock is held cannot strand the lock', () => {
  const fixture = makeFixture();
  ignoreRuns(fixture.operator);
  const preload = path.join(fixture.root, 'terminate-on-lock.cjs');
  fs.writeFileSync(preload, [
    "const fs = require('node:fs');",
    'const originalOpenSync = fs.openSync;',
    'fs.openSync = function openSync(filePath, flags, ...args) {',
    '  const descriptor = originalOpenSync.call(fs, filePath, flags, ...args);',
    "  if (filePath.endsWith('.apply.lock') && flags === 'wx') process.kill(process.pid, 'SIGTERM');",
    '  return descriptor;',
    '};',
  ].join('\n') + '\n');

  const applied = spawnSync(process.execPath, [
    '--require',
    preload,
    SCRIPT_PATH,
    'apply',
    '--repo',
    fixture.operator,
    '--json',
  ], { encoding: 'utf8' });
  const lock = path.join(fixture.operator, '.skilled/release/.apply.lock');
  assert.ok(applied.signal === 'SIGTERM' || applied.status === 143,
    JSON.stringify({ status: applied.status, signal: applied.signal, stderr: applied.stderr }));
  assert.equal(fs.existsSync(lock), false);
  assert.match(readText(fixture.operator, HUB_A_FILE), /Release line/);

  const runsDir = path.join(fixture.operator, '.skilled/release/runs');
  const runDir = path.join(runsDir, fs.readdirSync(runsDir)[0]);
  assert.equal(fs.existsSync(path.join(runDir, 'rollback.json')), true);
  const rolledBack = runCli(fixture.operator, 'rollback', '--run', runDir);
  assert.equal(rolledBack.exitCode, 0, JSON.stringify(rolledBack.document));
  assert.match(readText(fixture.operator, HUB_A_FILE), /Base line/);
});

test('a signal deferred during apply still ends the process after the lock is released', () => {
  const fixture = makeFixture();
  ignoreRuns(fixture.operator);
  const preload = path.join(fixture.root, 'terminate-on-lock.cjs');
  fs.writeFileSync(preload, [
    "const fs = require('node:fs');",
    'const originalOpenSync = fs.openSync;',
    'fs.openSync = function openSync(filePath, flags, ...args) {',
    '  const descriptor = originalOpenSync.call(fs, filePath, flags, ...args);',
    "  if (filePath.endsWith('.apply.lock') && flags === 'wx') process.kill(process.pid, 'SIGTERM');",
    '  return descriptor;',
    '};',
  ].join('\n') + '\n');

  const applied = spawnSync(process.execPath, [
    '--require',
    preload,
    SCRIPT_PATH,
    'apply',
    '--repo',
    fixture.operator,
    '--json',
  ], { encoding: 'utf8' });
  const lock = path.join(fixture.operator, '.skilled/release/.apply.lock');
  assert.equal(fs.existsSync(lock), false);
  assert.ok(applied.signal === 'SIGTERM' || applied.status === 143,
    JSON.stringify({ status: applied.status, signal: applied.signal, stderr: applied.stderr }));

  const runsDir = path.join(fixture.operator, '.skilled/release/runs');
  const runDir = path.join(runsDir, fs.readdirSync(runsDir)[0]);
  assert.equal(fs.existsSync(path.join(runDir, 'rollback.json')), true);
  const rolledBack = runCli(fixture.operator, 'rollback', '--run', runDir);
  assert.equal(rolledBack.exitCode, 0, JSON.stringify(rolledBack.document));
  assert.match(readText(fixture.operator, HUB_A_FILE), /Base line/);
});

test('a stale apply lock is reported with its recovery and only unlock clears it', () => {
  const fixture = makeFixture();
  ignoreRuns(fixture.operator);
  const applied = runCli(fixture.operator, 'apply');
  assert.equal(applied.exitCode, 0, JSON.stringify(applied.document));
  const runDir = applied.document.runDir;
  const lock = path.join(fixture.operator, '.skilled/release/.apply.lock');
  const deadPid = spawnSync(process.execPath, ['-e', '']).pid;
  writeFile(fixture.operator, '.skilled/release/.apply.lock', JSON.stringify({
    pid: deadPid,
    startedAt: '2026-01-01T00:00:00.000Z',
    command: 'apply',
    runDir,
  }) + '\n');

  const blockedApply = runCli(fixture.operator, 'apply', '--dry-run');
  assert.equal(blockedApply.exitCode, 1);
  assert.match(blockedApply.document.error, /apply lock already exists/);
  assert.match(blockedApply.document.error, /stale/);
  assert.match(blockedApply.document.error, /unlock/);
  assert.ok(blockedApply.document.error.includes(runDir));

  const blockedRollback = runCli(fixture.operator, 'rollback', '--run', runDir);
  assert.equal(blockedRollback.exitCode, 1);
  assert.match(blockedRollback.document.error, /stale/);

  const preview = runCli(fixture.operator, 'unlock', '--dry-run');
  assert.equal(preview.exitCode, 0, JSON.stringify(preview.document));
  assert.equal(preview.document.lock, 'stale');
  assert.equal(preview.document.removable, true);
  assert.equal(preview.document.rollbackRecorded, true);
  assert.equal(preview.document.removed, false);
  assert.ok(fs.existsSync(lock));

  const unlocked = runCli(fixture.operator, 'unlock');
  assert.equal(unlocked.exitCode, 0, JSON.stringify(unlocked.document));
  assert.equal(unlocked.document.removed, true);
  assert.equal(fs.existsSync(lock), false);
  const rolledBack = runCli(fixture.operator, 'rollback', '--run', runDir);
  assert.equal(rolledBack.exitCode, 0, JSON.stringify(rolledBack.document));
  assert.match(readText(fixture.operator, HUB_A_FILE), /Base line/);

  writeFile(fixture.operator, '.skilled/release/.apply.lock', JSON.stringify({
    pid: process.pid,
    startedAt: new Date().toISOString(),
    command: 'apply',
    runDir,
  }) + '\n');
  const live = runCli(fixture.operator, 'unlock');
  assert.equal(live.exitCode, 1);
  assert.match(live.document.error, /held by running process/);
  assert.equal(fs.existsSync(lock), true);

  writeFile(fixture.operator, '.skilled/release/.apply.lock', '{}\n');
  const unknown = runCli(fixture.operator, 'unlock');
  assert.equal(unknown.exitCode, 1);
  assert.match(unknown.document.error, /no readable owner/);
  assert.equal(fs.existsSync(lock), true);
});

test('a write failure partway through apply names the rollback command for its run', {
  skip: typeof process.getuid === 'function' && process.getuid() === 0
    ? 'root ignores permissions'
    : false,
}, () => {
  const fixture = makeFixture();
  const aligned = runCli(fixture.operator, 'align');
  const runDir = aligned.document.runDir;
  // A read-only skills directory lets the hub-a update land and then blocks the
  // new hub-d directory, which is the partial tree the error has to explain.
  const skills = path.join(fixture.operator, '.skilled/skills');
  fs.chmodSync(skills, 0o555);
  let failed;
  try {
    failed = runCli(fixture.operator, 'apply');
  } finally {
    fs.chmodSync(skills, 0o755);
  }
  assert.equal(failed.exitCode, 1);
  assert.match(failed.document.error, /release-update\.cjs rollback --repo \S+ --run /);
  assert.ok(failed.document.error.includes(runDir), failed.document.error);
  assert.match(readText(fixture.operator, HUB_A_FILE), /Release line/);
  assert.equal(fs.existsSync(path.join(fixture.operator, '.skilled/release/.apply.lock')), false);
  const rolledBack = runCli(fixture.operator, 'rollback', '--run', runDir);
  assert.equal(rolledBack.exitCode, 0, JSON.stringify(rolledBack.document));
  assert.match(readText(fixture.operator, HUB_A_FILE), /Base line/);
});

test('rollback refuses to run while an apply lock exists', () => {
  const fixture = makeFixture();
  const aligned = runCli(fixture.operator, 'align');
  const runDir = aligned.document.runDir;
  assert.equal(runCli(fixture.operator, 'apply').exitCode, 0);
  const lock = path.join(fixture.operator, '.skilled/release/.apply.lock');
  fs.writeFileSync(lock, '{}\n');
  const refused = runCli(fixture.operator, 'rollback', '--run', runDir);
  assert.equal(refused.exitCode, 1);
  assert.match(refused.document.error, /apply lock already exists/);
  assert.match(readText(fixture.operator, HUB_A_FILE), /Release line/);
  fs.rmSync(lock);
  assert.equal(runCli(fixture.operator, 'rollback', '--run', runDir).exitCode, 0);
  assert.equal(fs.existsSync(lock), false);
});

test('apply refuses a plan path outside the unit it is planned under', () => {
  const fixture = makeFixture();
  writeFile(fixture.operator, 'README.md', '# operator readme\n');
  commitAll(fixture.operator, 'add a readme outside .skilled');
  const aligned = runCli(fixture.operator, 'align');
  const runDir = aligned.document.runDir;
  const planPath = path.join(runDir, 'plan.json');
  const original = readJson(planPath);
  const decisions = path.join(runDir, 'decisions.json');
  const state = (spec) => ({ mode: '100644', blob: git(fixture.operator, ['rev-parse', spec]) });
  // Each tampered entry passes the drift checks: its local and release states
  // are the real ones, so only unit confinement stands between it and a write.
  const tampered = [
    {
      path: HUB_B_FILE,
      local: state('HEAD:' + HUB_B_FILE),
      release: state(original.releaseCommit + ':' + HUB_B_FILE),
    },
    { path: 'README.md', local: state('HEAD:README.md'), release: null },
  ];
  for (const entry of tampered) {
    const before = readText(fixture.operator, entry.path);
    const plan = { ...original, files: [...original.files] };
    plan.files.push({
      unit: 'skill:hub-a', class: 'take-release', conflictKind: null, base: entry.local, ...entry,
    });
    fs.writeFileSync(planPath, JSON.stringify(plan));
    const refused = runCli(fixture.operator, 'apply', '--decisions', decisions);
    assert.equal(refused.exitCode, 1, entry.path + ': ' + JSON.stringify(refused.document));
    assert.match(refused.document.error, /outside unit skill:hub-a/);
    assert.equal(readText(fixture.operator, entry.path), before, entry.path);
  }
});

test('rollback reports a path edited after apply as skipped and exits 1', () => {
  const fixture = makeFixture();
  const aligned = runCli(fixture.operator, 'align');
  const runDir = aligned.document.runDir;
  assert.equal(runCli(fixture.operator, 'apply').exitCode, 0);
  writeFile(fixture.operator, HUB_A_FILE, 'edited after apply\n');
  const rolledBack = runCli(fixture.operator, 'rollback', '--run', runDir);
  assert.equal(rolledBack.exitCode, 1);
  assert.equal(rolledBack.document.ok, false);
  assert.deepEqual(rolledBack.document.skipped, [HUB_A_FILE]);
  assert.ok(rolledBack.document.restored.includes(HUB_D_FILE));
  assert.equal(fs.existsSync(path.join(fixture.operator, HUB_D_FILE)), false);
  assert.equal(readText(fixture.operator, HUB_A_FILE), 'edited after apply\n');
});

test('a missing run, proposal or rollback record is reported with what to do next', () => {
  const fixture = makeFixture({ withHubBRelease: true });
  const missingRunDir = path.join(fixture.root, 'no-such-run');
  const missingRun = runCli(fixture.operator, 'rollback', '--run', missingRunDir);
  assert.equal(missingRun.exitCode, 1);
  assert.match(missingRun.document.error, /run directory not found: .*no-such-run/);
  assert.doesNotMatch(missingRun.document.error, /ENOENT|lstat/);

  const aligned = runCli(fixture.operator, 'align');
  const runDir = aligned.document.runDir;
  const noProposal = runCli(fixture.operator, 'decide', '--run', runDir,
    '--path', HUB_B_RELEASE_FILE, '--decision', 'use-proposal');
  assert.equal(noProposal.exitCode, 1);
  assert.match(noProposal.document.error, /no proposal for .*managed\.md/);
  assert.doesNotMatch(noProposal.document.error, /ENOENT|lstat/);

  const notApplied = runCli(fixture.operator, 'rollback', '--run', runDir);
  assert.equal(notApplied.exitCode, 1);
  assert.match(notApplied.document.error, /no rollback\.json/);
});

test('decide rejects bad flag combinations, unplanned paths and unknown units', () => {
  const fixture = makeFixture();
  const aligned = runCli(fixture.operator, 'align');
  const runDir = aligned.document.runDir;
  const combinations = [
    ['--path', CHILD_FILE],
    ['--decision', 'keep-local'],
    ['--defer'],
    ['--unit', 'hub-a'],
    ['--unit', 'hub-a', '--defer', '--path', CHILD_FILE],
    ['--path', CHILD_FILE, '--decision', 'keep-local', '--unit', 'hub-a'],
  ];
  for (const args of combinations) {
    const result = runCli(fixture.operator, 'decide', '--run', runDir, ...args);
    assert.equal(result.exitCode, 2, args.join(' '));
    assert.match(result.document.error, /decide requires --run/);
  }
  const noRun = runCli(fixture.operator, 'decide',
    '--path', CHILD_FILE, '--decision', 'keep-local');
  assert.equal(noRun.exitCode, 2);

  const unplanned = runCli(fixture.operator, 'decide', '--run', runDir,
    '--path', '.skilled/skills/hub-a/SKILL.md', '--decision', 'keep-local');
  assert.equal(unplanned.exitCode, 1);
  assert.match(unplanned.document.error, /not a planned file/);
  const unknownUnit = runCli(fixture.operator, 'decide', '--run', runDir,
    '--unit', 'no-such-unit', '--defer');
  assert.equal(unknownUnit.exitCode, 1);
  assert.match(unknownUnit.document.error, /unit is not in the alignment plan/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. VENDORED BASE INFERENCE
// ─────────────────────────────────────────────────────────────────────────────

test('vendored tree infers the release base without shared history', () => {
  const fixture = makeFixture();
  const vendor = makeVendor(fixture, 'vendor');
  const report = runCli(vendor, 'check', '--remote', fixture.upstream);
  assert.equal(report.exitCode, 0, JSON.stringify(report.document) + '\n' + report.stderr);
  assert.equal(report.document.upstream.latest, 'v1.1.0.0');
  assert.equal(unit(report.document, 'hub-a').baseSource, 'inferred');
  assert.equal(unit(report.document, 'hub-a').status, 'update');
});

test('a copied tree names its framework remote once and later checks use it', () => {
  const fixture = makeFixture();
  const vendor = makeVendor(fixture, 'vendor-remote');
  const emptyRemote = path.join(fixture.root, 'operator-upstream.git');
  git(fixture.root, ['init', '--bare', '-q', emptyRemote]);
  git(vendor, ['remote', 'add', 'origin', emptyRemote]);

  const withoutFrameworkRemote = runCli(vendor, 'check');
  assert.equal(withoutFrameworkRemote.exitCode, 0,
    JSON.stringify(withoutFrameworkRemote.document));
  assert.equal(withoutFrameworkRemote.document.upstream.status, 'unknown');
  assert.match(withoutFrameworkRemote.document.upstream.error,
    /lists no stable vN\.N\.N\.N release tags/);

  const namedRemote = runCli(vendor, 'check', '--remote', fixture.upstream);
  assert.equal(namedRemote.exitCode, 0, JSON.stringify(namedRemote.document));
  assert.ok(namedRemote.document.baseRecording.action.includes('--remote'));

  const recorded = runCli(vendor, 'record-base', '--release', 'v1.0.0.0',
    '--remote', fixture.upstream);
  assert.equal(recorded.exitCode, 0, JSON.stringify(recorded.document));
  const basePath = path.join(vendor, '.skilled/release/base.json');
  assert.equal(readJson(basePath).remote, fixture.upstream);
  commitAll(vendor, 'record the framework remote');

  const after = runCli(vendor, 'check');
  assert.equal(after.exitCode, 0, JSON.stringify(after.document));
  assert.equal(after.document.upstream.latest, 'v1.1.0.0');
  assert.equal(unit(after.document, 'skill:hub-a').status, 'update');
  assert.equal(unit(after.document, 'skill:hub-a').baseSource, 'recorded');

  const rejectedFlag = runCli(vendor, 'check', '--remote=-uevil');
  assert.equal(rejectedFlag.exitCode, 2);

  const base = readJson(basePath);
  base.remote = '-uevil';
  fs.writeFileSync(basePath, JSON.stringify(base, null, 2) + '\n');
  const rejectedRecord = runCli(vendor, 'check');
  assert.equal(rejectedRecord.exitCode, 1);
  assert.match(rejectedRecord.document.error, /base\.json remote/);
});

test('the shipped release ignore rule covers runs and the apply lock but not base records', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'release-update-ignore-'));
  fixtureRoots.add(root);
  git(root, ['init', '-q']);
  const ignoreSource = path.join(__dirname, '..', '..', '..', '..', 'release', '.gitignore');
  const ignoreTarget = path.join(root, '.skilled/release/.gitignore');
  fs.mkdirSync(path.dirname(ignoreTarget), { recursive: true });
  fs.copyFileSync(ignoreSource, ignoreTarget);

  for (const filePath of ['.skilled/release/runs/x', '.skilled/release/.apply.lock']) {
    const result = spawnSync('git', ['check-ignore', '-q', filePath], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, filePath);
  }
  for (const filePath of ['.skilled/release/base.json', '.skilled/release/divergence.json']) {
    const result = spawnSync('git', ['check-ignore', '-q', filePath], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(result.status, 1, filePath);
  }
});

test('a copied tree needs no further base recording after record-base and a commit', () => {
  const fixture = makeFixture();
  const vendor = makeVendor(fixture, 'vendor-base-recorded');
  const recorded = runCli(vendor, 'record-base', '--release', 'v1.0.0.0',
    '--remote', fixture.upstream);
  assert.equal(recorded.exitCode, 0, JSON.stringify(recorded.document));
  commitAll(vendor, 'record the installed framework base');

  const checked = runCli(vendor, 'check', '--remote', fixture.upstream);
  assert.equal(checked.exitCode, 0, JSON.stringify(checked.document));
  assert.equal(checked.document.baseRecording.needed, false);
  assert.deepEqual(checked.document.baseRecording.units, []);
  assert.equal(checked.document.units.some((entry) => entry.key === 'directory:release'), false);
});

test('record-base refuses a release that is not the nearest to the local tree', () => {
  const fixture = makeFixture();
  const vendor = makeVendor(fixture, 'vendor-nearest-release');
  const refused = runCli(vendor, 'record-base', '--release', 'v1.1.0.0',
    '--remote', fixture.upstream);
  assert.equal(refused.exitCode, 1);
  assert.match(refused.document.error, /not the nearest/);
  assert.match(refused.document.error, /skill:hub-a/);
  assert.match(refused.document.error, /v1\.0\.0\.0/);
  assert.equal(fs.existsSync(path.join(vendor, '.skilled/release/base.json')), false);

  const dryRun = runCli(vendor, 'record-base', '--release', 'v1.0.0.0',
    '--remote', fixture.upstream, '--dry-run');
  assert.equal(dryRun.exitCode, 0, JSON.stringify(dryRun.document));
  assert.equal(dryRun.document.verified, true);

  const trusted = runCli(vendor, 'record-base', '--release', 'v1.1.0.0',
    '--remote', fixture.upstream, '--trust-release');
  assert.equal(trusted.exitCode, 0, JSON.stringify(trusted.document));
  assert.equal(trusted.document.verified, false);

  const offline = runCli(fixture.operator, 'record-base', '--release', 'v1.0.0.0', '--offline');
  assert.equal(offline.exitCode, 1);
  assert.match(offline.document.error, /--trust-release/);
  const offlineTrusted = runCli(fixture.operator, 'record-base', '--release', 'v1.0.0.0',
    '--offline', '--trust-release');
  assert.equal(offlineTrusted.exitCode, 0, JSON.stringify(offlineTrusted.document));
  assert.equal(offlineTrusted.document.verified, false);
});

test('record-base --dry-run names the units it would record and writes nothing', () => {
  const fixture = makeFixture();
  const vendor = makeVendor(fixture, 'vendor-dry-run');
  const result = runCli(vendor, 'record-base', '--release', 'v1.0.0.0',
    '--remote', fixture.upstream, '--dry-run');
  assert.equal(result.exitCode, 0, JSON.stringify(result.document));
  assert.equal(result.document.dryRun, true);
  assert.deepEqual(result.document.units, FAMILY_UNIT_KEYS);
  assert.equal(fs.existsSync(path.join(vendor, '.skilled/release/base.json')), false);
  assert.equal(git(vendor, ['status', '--short', '--untracked-files=all']), '');
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. CLI HELP AND USAGE
// ─────────────────────────────────────────────────────────────────────────────

test('help names every subcommand with its parser options and exits 0', () => {
  const result = spawnSync(process.execPath, [SCRIPT_PATH, '--help'], { encoding: 'utf8' });
  assert.equal(result.status, 0);
  for (const name of ['check', 'align', 'decide', 'apply', 'rollback', 'record-base']) {
    assert.match(result.stdout, new RegExp('^  ' + name + '\\b', 'm'), 'help should name ' + name);
  }
  assert.match(result.stdout, /--out/);
  assert.match(result.stdout, /--defer/);
  assert.match(result.stdout, /--decisions/);
  assert.match(result.stdout, /--include-prerelease/);
  assert.match(result.stdout, /Exit codes/);
  assert.match(result.stdout, /\.skilled\/release\/runs\//);
  assert.match(result.stdout, /\.skilled\/release\/base\.json/);
  assert.match(result.stdout, /\.skilled\/release\/divergence\.json/);

  const subcommand = runRaw('apply', '--help');
  assert.equal(subcommand.exitCode, 0);
  assert.match(subcommand.stdout, /--decisions/);
});

test('an unknown subcommand exits 2 and prints usage once', () => {
  const result = spawnSync(process.execPath, [SCRIPT_PATH, 'frobnicate'], { encoding: 'utf8' });
  assert.equal(result.status, 2);
  assert.equal((result.stderr.match(/Usage: release-update\.cjs/g) || []).length, 1);
});

test('the parser rejects malformed arguments with exit 2 and a prefixed message', () => {
  const cases = [
    [[], /missing subcommand/],
    [['check', '--bogus'], /unknown option for check: --bogus/],
    [['check', '--offline', '--offline'], /duplicate option: --offline/],
    [['check', '--scope'], /--scope requires a value/],
    [['check', '--scope', '--offline'], /--scope requires a value/],
    [['check', '--offline=yes'], /--offline does not take a value/],
    [['check', '--release', 'banana'], /--release must be a version tag/],
    [['check', 'stray'], /unexpected argument: stray/],
  ];
  for (const [args, pattern] of cases) {
    const result = runRaw(...args);
    const label = args.join(' ') || '(no arguments)';
    assert.equal(result.exitCode, 2, label);
    assert.match(result.stderr, pattern, label);
    assert.ok(result.stderr.startsWith('[release-update] '), label + ': ' + result.stderr);
    assert.match(result.stderr, /^Usage: release-update\.cjs/m, label);
  }
});

// These subcommands never read the selection options, so the parser refuses them.
for (const command of ['decide', 'rollback']) {
  const removed = [
    ['--remote', 'origin'], ['--release', 'v1.0.0.0'], ['--scope', 'all'], ['--offline'],
  ];
  for (const [option, value] of removed) {
    test(command + ' rejects ' + option + ' as an unknown option', () => {
      const args = [command, '--run', 'unused-run', option];
      if (value) args.push(value);
      const result = runRaw(...args);
      assert.equal(result.exitCode, 2, result.stderr);
      assert.match(result.stderr, new RegExp('unknown option for ' + command + ': ' + option));
    });
  }
}
