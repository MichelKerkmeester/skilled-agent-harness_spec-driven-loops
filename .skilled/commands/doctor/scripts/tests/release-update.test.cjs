#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ release-update.test — release planning, apply, and recovery coverage       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
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

function unit(report, name) {
  const found = report.units.find((candidate) => candidate.name === name);
  assert.ok(found, 'expected unit ' + name + ' in report');
  return found;
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

test('latest-tag resolution excludes prereleases by default and orders numerically either way', () => {
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

  const rejectedMerge = runCli(fixture.operator, 'decide', '--run', runDir, '--path', CHILD_FILE, '--decision', 'merge');
  assert.equal(rejectedMerge.exitCode, 1);
  assert.match(rejectedMerge.document.error, /only for mergeable/);
  const rejectedProposal = runCli(fixture.operator, 'decide', '--run', runDir, '--path', CHILD_FILE, '--decision', 'use-proposal');
  assert.equal(rejectedProposal.exitCode, 1);
  assert.match(rejectedProposal.document.error, /conflict markers/);

  fs.writeFileSync(file, 'first: operator and release\nmiddle: stable\nlast: base\n');
  const accepted = runCli(fixture.operator, 'decide', '--run', runDir, '--path', CHILD_FILE, '--decision', 'use-proposal');
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
  assert.deepEqual(hubA.regenerate.map((entry) => entry.path).sort(), [HUB_A_GRAPH, HUB_A_LEAF_MANIFEST].sort());
  assert.ok(hubA.regenerate.every((entry) => /generate-leaf-manifest|regenerate-skill-derived/.test(entry.generator)));
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
  const vendor = path.join(fixture.root, 'vendor-recorded');
  fs.mkdirSync(vendor);
  git(vendor, ['init', '-q']);
  configureGit(vendor);
  fs.cpSync(path.join(fixture.baseTree, '.skilled'), path.join(vendor, '.skilled'), { recursive: true });
  commitAll(vendor, 'vendor framework tree');

  const before = runCli(vendor, 'check', '--remote', fixture.upstream);
  assert.equal(before.exitCode, 0, JSON.stringify(before.document));
  assert.equal(unit(before.document, 'hub-a').baseSource, 'inferred');
  assert.equal(before.document.baseRecording.needed, true);
  assert.match(before.document.baseRecording.action, /record-base --release/);

  const noTag = runCli(vendor, 'record-base', '--remote', fixture.upstream);
  assert.equal(noTag.exitCode, 1);
  assert.match(noTag.document.error, /name the release this tree was installed from/);

  const recorded = runCli(vendor, 'record-base', '--release', 'v1.0.0.0', '--remote', fixture.upstream);
  assert.equal(recorded.exitCode, 0, JSON.stringify(recorded.document));
  assert.deepEqual(recorded.document.units, ['commands/fam', 'hub-a', 'hub-b', 'hub-b/child-c']);
  const base = JSON.parse(fs.readFileSync(path.join(vendor, '.skilled/release/base.json'), 'utf8'));
  assert.equal(base.units['hub-a'].release, 'v1.0.0.0');
  assert.match(base.units['hub-a'].tree, /^[0-9a-f]{64}$/);

  const after = runCli(vendor, 'check', '--remote', fixture.upstream);
  assert.equal(after.exitCode, 0, JSON.stringify(after.document));
  for (const name of recorded.document.units) {
    assert.equal(unit(after.document, name).baseSource, 'recorded', name);
  }
  assert.equal(unit(after.document, 'hub-a').status, 'update');
  assert.deepEqual(after.document.baseRecording.units, ['hub-d']);

  const again = runCli(vendor, 'record-base', '--release', 'v1.0.0.0', '--remote', fixture.upstream);
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. APPLY AND ROLLBACK
// ─────────────────────────────────────────────────────────────────────────────

test('apply dry-run writes nothing and apply updates only uncustomized units by default', () => {
  const fixture = makeFixture();
  const aligned = runCli(fixture.operator, 'align');
  assert.equal(aligned.exitCode, 0);
  const runDir = aligned.document.runDir;
  const beforeStatus = git(fixture.operator, ['status', '--short', '--untracked-files=all']);
  const beforeA = fs.readFileSync(path.join(fixture.operator, HUB_A_FILE), 'utf8');
  const dry = runCli(fixture.operator, 'apply', '--dry-run');
  assert.equal(dry.exitCode, 0);
  assert.equal(fs.existsSync(path.join(fixture.operator, '.skilled/release/base.json')), false);
  assert.equal(fs.existsSync(path.join(fixture.operator, '.skilled/release/.apply.lock')), false);
  assert.equal(fs.existsSync(path.join(runDir, 'rollback.json')), false);
  assert.equal(fs.readFileSync(path.join(fixture.operator, HUB_A_FILE), 'utf8'), beforeA);
  assert.equal(git(fixture.operator, ['status', '--short', '--untracked-files=all']), beforeStatus);

  const applied = runCli(fixture.operator, 'apply');
  assert.equal(applied.exitCode, 0, JSON.stringify(applied.document));
  assert.match(fs.readFileSync(path.join(fixture.operator, HUB_A_FILE), 'utf8'), /Release line/);
  assert.equal(fs.existsSync(path.join(fixture.operator, HUB_D_FILE)), true);
  assert.match(fs.readFileSync(path.join(fixture.operator, HUB_B_FILE), 'utf8'), /Operator-only/);
  assert.match(fs.readFileSync(path.join(fixture.operator, CHILD_FILE), 'utf8'), /first: operator/);
  const base = JSON.parse(fs.readFileSync(path.join(fixture.operator, '.skilled/release/base.json'), 'utf8'));
  assert.equal(base.units['hub-a'].release, 'v1.1.0.0');
  assert.equal(base.units['hub-d'].release, 'v1.1.0.0');
  assert.equal(base.units['hub-b'], undefined);
});

test('apply leaves customized-unit release files alone unless a decisions file is named', () => {
  const defaultFixture = makeFixture({ withHubBRelease: true });
  const defaultAlignment = runCli(defaultFixture.operator, 'align');
  assert.equal(defaultAlignment.exitCode, 0);
  const defaultPlan = JSON.parse(fs.readFileSync(path.join(defaultAlignment.document.runDir, 'plan.json'), 'utf8'));
  assert.equal(unit(defaultPlan, 'hub-b').status, 'customized');
  const defaultApply = runCli(defaultFixture.operator, 'apply');
  assert.equal(defaultApply.exitCode, 0);
  assert.equal(fs.readFileSync(path.join(defaultFixture.operator, HUB_B_RELEASE_FILE), 'utf8'), 'base-managed\n');

  const decidedFixture = makeFixture({ withHubBRelease: true });
  const decidedAlignment = runCli(decidedFixture.operator, 'align');
  assert.equal(decidedAlignment.exitCode, 0);
  const decisionsPath = path.join(decidedAlignment.document.runDir, 'decisions.json');
  const decidedApply = runCli(decidedFixture.operator, 'apply', '--decisions', decisionsPath);
  assert.equal(decidedApply.exitCode, 0, JSON.stringify(decidedApply.document));
  assert.equal(fs.readFileSync(path.join(decidedFixture.operator, HUB_B_RELEASE_FILE), 'utf8'), 'release-managed\n');
});

test('apply without an alignment run plans update and new units and refuses decisions without a run', () => {
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
  assert.ok(dry.document.skippedUnits.some((entry) => entry.unit === 'hub-b/child-c' && entry.reason === 'no decisions'));
  assert.equal(fs.existsSync(runsDir), false);

  const loose = path.join(fixture.root, 'loose-decisions.json');
  fs.writeFileSync(loose, JSON.stringify({ schemaVersion: 1, files: {}, deferredUnits: [] }));
  const refused = runCli(fixture.operator, 'apply', '--dry-run', '--decisions', loose);
  assert.equal(refused.exitCode, 1);
  assert.match(refused.document.error, /needs its alignment run/);

  const applied = runCli(fixture.operator, 'apply');
  assert.equal(applied.exitCode, 0, JSON.stringify(applied.document));
  assert.match(fs.readFileSync(path.join(fixture.operator, HUB_A_FILE), 'utf8'), /Release line/);
  assert.match(fs.readFileSync(path.join(fixture.operator, CHILD_FILE), 'utf8'), /first: operator/);
  assert.ok(fs.existsSync(path.join(applied.document.runDir, 'plan.json')));
  const rolledBack = runCli(fixture.operator, 'rollback', '--run', applied.document.runDir);
  assert.equal(rolledBack.exitCode, 0, JSON.stringify(rolledBack.document));
  assert.match(fs.readFileSync(path.join(fixture.operator, HUB_A_FILE), 'utf8'), /Base line/);
  assert.equal(fs.existsSync(path.join(fixture.operator, HUB_D_FILE)), false);
});

test('apply refuses a target with staged or unstaged worktree changes', () => {
  const fixture = makeFixture();
  const aligned = runCli(fixture.operator, 'align');
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
  const result = runCli(fixture.operator, 'apply');
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

// ─────────────────────────────────────────────────────────────────────────────
// 6. VENDORED BASE INFERENCE
// ─────────────────────────────────────────────────────────────────────────────

test('vendored tree infers the release base without shared history', () => {
  const fixture = makeFixture();
  const vendor = path.join(fixture.root, 'vendor');
  fs.mkdirSync(vendor);
  git(vendor, ['init', '-q']);
  configureGit(vendor);
  fs.cpSync(path.join(fixture.baseTree, '.skilled'), path.join(vendor, '.skilled'), { recursive: true });
  commitAll(vendor, 'vendor framework tree');
  const report = runCli(vendor, 'check', '--remote', fixture.upstream);
  assert.equal(report.exitCode, 0, JSON.stringify(report.document) + '\n' + report.stderr);
  assert.equal(report.document.upstream.latest, 'v1.1.0.0');
  assert.equal(unit(report.document, 'hub-a').baseSource, 'inferred');
  assert.equal(unit(report.document, 'hub-a').status, 'update');
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

  const subcommand = spawnSync(process.execPath, [SCRIPT_PATH, 'apply', '--help'], { encoding: 'utf8' });
  assert.equal(subcommand.status, 0);
  assert.match(subcommand.stdout, /--decisions/);
});

test('an unknown subcommand exits 2 and prints usage once', () => {
  const result = spawnSync(process.execPath, [SCRIPT_PATH, 'frobnicate'], { encoding: 'utf8' });
  assert.equal(result.status, 2);
  assert.equal((result.stderr.match(/Usage: release-update\.cjs/g) || []).length, 1);
});
