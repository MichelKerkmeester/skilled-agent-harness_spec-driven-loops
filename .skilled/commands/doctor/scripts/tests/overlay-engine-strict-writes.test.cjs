// ───────────────────────────────────────────────────────────────────
// MODULE: Overlay Engine Strict Writes Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// With "strictWrites": true in the manifest, a write under a vendored root has
// to go through an overlay. Each fixture builds a throwaway upstream repository
// with two commits, extracts the first as the vendored tree, and commits that
// tree to a repository of its own, so the guard, adopt and the commit check all
// run against real git state.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { spawnSync } = require('node:child_process');

const {
  createWorkspace,
  readJson,
  runEngine,
  sha256,
  writeFile,
  writeManifest,
} = require('./overlay-engine-fixtures.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 1. FIXTURE
// ─────────────────────────────────────────────────────────────────────────────

const GIT_CONFIG = [
  '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
  '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', '-c', 'init.defaultBranch=main',
  '-c', 'core.excludesFile=/dev/null',
];
const ENGINE_COMMAND = 'node .skilled/commands/doctor/scripts/overlay-engine.cjs';
const FIX_UPSTREAM = 'fix v1\n';

const OLD_ENTRIES = {
  '.skilled/skills/hub/SKILL.md': 'skill v1\n',
  '.skilled/skills/hub/fix.md': FIX_UPSTREAM,
  '.skilled/skills/hub/stable.md': 'stable\n',
  '.claude/agents/a.md': 'agent v1\n',
  'AGENTS.md': 'upstream agents\n',
  'REPO RULES.md': 'upstream rules\n',
  'README.md': 'upstream readme\n',
};

const NEW_CHANGES = {
  '.skilled/skills/hub/SKILL.md': 'skill v2\n',
  'AGENTS.md': 'upstream agents v2\n',
  'REPO RULES.md': 'upstream rules v2\n',
  'README.md': 'upstream readme v2\n',
};

function git(cwd, args) {
  const result = spawnSync('git', [...GIT_CONFIG, '-C', cwd, ...args], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error('git ' + args.join(' ') + ': ' + result.stderr);
  return result.stdout.trim();
}

function commitAll(cwd, message) {
  git(cwd, ['add', '-A']);
  git(cwd, ['commit', '-q', '-m', message]);
  return git(cwd, ['rev-parse', 'HEAD']);
}

/**
 * Build a vendored tree that is its own git repository, with one owned folder,
 * one owned root file and a manifest that turns the write checks on.
 * @param {object} t The node:test context.
 * @param {{isStrict?: boolean}} [options] `isStrict: false` leaves the setting out.
 * @returns {object} Fixture paths, commits, manifest and a `run` helper.
 */
function createStrictFixture(t, options = {}) {
  const fixture = createWorkspace(t, 'overlay-engine-strict-');
  const { workspace, tree, overlayDir } = fixture;
  const upstream = path.join(workspace, 'upstream');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  for (const [relativePath, value] of Object.entries(OLD_ENTRIES)) writeFile(upstream, relativePath, value);
  const oldCommit = commitAll(upstream, 'old');
  for (const [relativePath, value] of Object.entries(NEW_CHANGES)) writeFile(upstream, relativePath, value);
  const newCommit = commitAll(upstream, 'new');

  for (const [relativePath, value] of Object.entries(OLD_ENTRIES)) writeFile(tree, relativePath, value);
  // Left out of the tree's first commit, so a test can stage upstream's own bytes.
  fs.rmSync(path.join(tree, '.skilled/skills/hub/stable.md'));
  writeFile(tree, '.gitignore', '.skilled/skills/.state/\nskilled-overlays/sync-state.json\nskilled-overlays/.build-lock\n');
  writeFile(overlayDir, 'skills/own/SKILL.md', 'project skill\n');
  writeFile(overlayDir, 'files/AGENTS.md', 'project agents\n');
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', checkout: upstream, commit: oldCommit },
    ...(options.isStrict === false ? {} : { strictWrites: true }),
    generated: ['.claude/agents/**', '.skilled/**/graph-metadata.json'],
    repin: { runtimeFolders: ['.claude'], rootFiles: ['AGENTS.md', 'REPO RULES.md'] },
    layoutLinks: [],
    overlays: [
      { id: 'own-skill', scope: 'directory', source: 'skills/own', destination: '.skilled/skills/own' },
      {
        id: 'agents-file',
        scope: 'file',
        source: 'files/AGENTS.md',
        destination: 'AGENTS.md',
        pinnedSha256: sha256(Buffer.from(OLD_ENTRIES['AGENTS.md'])),
      },
    ],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.upstream = upstream;
  fixture.oldCommit = oldCommit;
  fixture.newCommit = newCommit;
  fixture.manifestPath = path.join(overlayDir, 'overlay-manifest.json');
  fixture.run = (args, cwd = tree) => runEngine([...args, '--root', tree], cwd);
  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  git(tree, ['init', '-q']);
  commitAll(tree, 'vendored tree');
  return fixture;
}

function entryFor(fixture, destination) {
  return readJson(fixture.manifestPath).overlays.find((entry) => entry.destination === destination);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. GUARD
// ─────────────────────────────────────────────────────────────────────────────

test('the guard refuses a new file under a vendored root and names where to create it', (t) => {
  const fixture = createStrictFixture(t);

  const elsewhere = fixture.run(['--guard', '.skilled/skills/brand/docs/new.md']);
  assert.equal(elsewhere.code, 1, elsewhere.output);
  assert.match(elsewhere.stdout, /^refuse: \.skilled\/skills\/brand\/docs\/new\.md is a new file in the vendored tree/);
  assert.ok(elsewhere.stdout.includes('create it as skilled-overlays/skilled/skills/brand/docs/new.md'), elsewhere.stdout);
  // The whole missing folder is one unit, so a new skill becomes one entry.
  assert.ok(elsewhere.stdout.includes(ENGINE_COMMAND + ' apply --adopt .skilled/skills/brand\n'), elsewhere.stdout);

  const inOwnedFolder = fixture.run(['--guard', '.skilled/skills/own/extra.md']);
  assert.equal(inOwnedFolder.code, 1, inOwnedFolder.output);
  assert.ok(inOwnedFolder.stdout.includes('is a new file inside overlay own-skill; create it as ' +
    'skilled-overlays/skills/own/extra.md, then run ' + ENGINE_COMMAND + ' apply'), inOwnedFolder.stdout);
});

test('the guard refuses an edit to a vendored file no overlay owns, and leaves the rest of the tree alone', (t) => {
  const fixture = createStrictFixture(t);

  const upstreamFile = fixture.run(['--guard', '.skilled/skills/hub/fix.md']);
  assert.equal(upstreamFile.code, 1, upstreamFile.output);
  assert.ok(upstreamFile.stdout.includes('is a vendored file no overlay owns, so a re-pin would overwrite this edit; ' +
    'run ' + ENGINE_COMMAND + ' apply --adopt .skilled/skills/hub/fix.md, then edit skilled-overlays/skilled/skills/hub/fix.md'),
  upstreamFile.stdout);

  const rootFile = fixture.run(['--guard', 'REPO RULES.md']);
  assert.equal(rootFile.code, 1, rootFile.output);
  assert.ok(rootFile.stdout.includes(ENGINE_COMMAND + ' apply --adopt "REPO RULES.md", then edit skilled-overlays/REPO RULES.md'),
    rootFile.stdout);

  // An owned path keeps the message it had before the setting existed.
  const owned = fixture.run(['--guard', '.skilled/skills/own/SKILL.md']);
  assert.equal(owned.code, 1, owned.output);
  assert.match(owned.stdout, /is owned by skilled-overlays\/skills\/own\/SKILL\.md; edit the overlay/);

  // A root file the manifest does not name, and the overlay folder, are the project's own.
  for (const projectPath of ['README.md', 'docs/new.md', 'skilled-overlays/skills/own/new.md']) {
    const result = fixture.run(['--guard', projectPath]);
    assert.equal(result.code, 0, projectPath + ': ' + result.output);
    assert.equal(result.stdout, 'allow\n');
  }
});

test('the guard allows a generated path and a path git ignores', (t) => {
  const fixture = createStrictFixture(t);
  const allowed = [
    '.claude/agents/a.md',
    '.claude/agents/nested/new.md',
    '.skilled/skills/hub/graph-metadata.json',
    '.skilled/skills/.state/run.json',
  ];
  for (const relativePath of allowed) {
    const result = fixture.run(['--guard', relativePath]);
    assert.equal(result.code, 0, relativePath + ': ' + result.output);
    assert.equal(result.stdout, 'allow\n');
  }
  // The same runtime folder outside the generated globs is still checked.
  assert.equal(fixture.run(['--guard', '.claude/settings.json']).code, 1);
});

test('with the setting off the guard allows every path no overlay owns, and the commit check checks nothing', (t) => {
  const fixture = createStrictFixture(t, { isStrict: false });
  for (const relativePath of ['.skilled/skills/brand/new.md', '.skilled/skills/hub/fix.md', 'REPO RULES.md',
    '.skilled/skills/own/extra.md']) {
    const result = fixture.run(['--guard', relativePath]);
    assert.equal(result.code, 0, relativePath + ': ' + result.output);
    assert.equal(result.stdout, 'allow\n');
  }
  assert.equal(fixture.run(['--guard', '.skilled/skills/own/SKILL.md']).code, 1);

  writeFile(fixture.tree, '.skilled/skills/hub/fix.md', 'edited in place\n');
  git(fixture.tree, ['add', '-A']);
  const commitCheck = fixture.run(['pre-commit']);
  assert.equal(commitCheck.code, 0, commitCheck.output);
  assert.match(commitCheck.stdout, /^allow: strictWrites is off/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. ADOPT
// ─────────────────────────────────────────────────────────────────────────────

test('adopt turns a new folder into a directory entry, lists its token-named source file and applies', (t) => {
  const fixture = createStrictFixture(t);
  writeFile(fixture.tree, '.skilled/skills/brand/SKILL.md', 'brand skill\n');
  writeFile(fixture.tree, '.skilled/skills/brand/design-tokens.md', 'tokens doc\n');
  const before = fs.readFileSync(fixture.manifestPath, 'utf8');

  const adopted = fixture.run(['apply', '--adopt', '.skilled/skills/brand']);
  assert.equal(adopted.code, 0, adopted.output);
  assert.ok(adopted.stdout.includes('adopted .skilled/skills/brand as skilled-overlays/skilled/skills/brand ' +
    '(directory entry adopted-skilled-skills-brand)'), adopted.stdout);

  const entry = entryFor(fixture, '.skilled/skills/brand');
  assert.deepEqual(
    { id: entry.id, scope: entry.scope, source: entry.source, protectedPaths: entry.protectedPaths },
    { id: 'adopted-skilled-skills-brand', scope: 'directory', source: 'skilled/skills/brand', protectedPaths: ['design-tokens.md'] },
  );
  assert.equal(entry.pinnedSha256, undefined);
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'skilled/skills/brand/SKILL.md'), 'utf8'), 'brand skill\n');
  // The entry is appended; every byte the manifest held before is still there.
  const after = fs.readFileSync(fixture.manifestPath, 'utf8');
  const insertedAt = before.lastIndexOf('}', before.indexOf('"regenerate"')) + 1;
  assert.equal(after.slice(0, insertedAt), before.slice(0, insertedAt));
  assert.ok(after.endsWith(before.slice(insertedAt)));

  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  const guard = fixture.run(['--guard', '.skilled/skills/brand/SKILL.md']);
  assert.match(guard.stdout, /is owned by skilled-overlays\/skilled\/skills\/brand\/SKILL\.md/);
});

test('adopt pins an upstream file to the upstream bytes, not to the edited live copy', (t) => {
  const fixture = createStrictFixture(t);
  writeFile(fixture.tree, '.skilled/skills/hub/fix.md', 'fix edited in place\n');

  const adopted = fixture.run(['apply', '--adopt', '.skilled/skills/hub/fix.md']);
  assert.equal(adopted.code, 0, adopted.output);
  const entry = entryFor(fixture, '.skilled/skills/hub/fix.md');
  assert.equal(entry.scope, 'file');
  assert.equal(entry.pinnedSha256, sha256(Buffer.from(FIX_UPSTREAM)));
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'skilled/skills/hub/fix.md'), 'utf8'), 'fix edited in place\n');
  assert.equal(fixture.run(['status']).code, 0);

  // A named root file is adopted the same way.
  const rootFile = fixture.run(['apply', '--adopt', 'REPO RULES.md']);
  assert.equal(rootFile.code, 0, rootFile.output);
  assert.equal(entryFor(fixture, 'REPO RULES.md').pinnedSha256, sha256(Buffer.from(OLD_ENTRIES['REPO RULES.md'])));
});

test('adopt refuses what it cannot own and writes nothing', (t) => {
  const fixture = createStrictFixture(t);
  writeFile(fixture.tree, '.skilled/skills/secrets/api-token.json', '{"value": "x"}\n');
  const before = fs.readFileSync(fixture.manifestPath, 'utf8');
  const refusals = [
    ['.claude/agents/a.md', /is on the manifest's generated list/],
    ['.skilled/skills/own/SKILL.md', /overlaps overlay own-skill/],
    ['.skilled/skills/hub', /upstream ships 2 file\(s\) under \.skilled\/skills\/hub, such as \.skilled\/skills\/hub\/SKILL\.md/],
    ['.skilled/skills/secrets', /api-token\.json is a protected path and cannot be an overlay/],
    ['.skilled/skills/absent.md', /nothing to adopt; create skilled-overlays\/skilled\/skills\/absent\.md first/],
    ['README.md', /is not under a vendored root \(\.skilled, \.claude\) and is not a file named in repin\.rootFiles/],
  ];
  for (const [target, pattern] of refusals) {
    const result = fixture.run(['apply', '--adopt', target]);
    assert.equal(result.code, 2, target + ': ' + result.output);
    assert.match(result.stdout, pattern, target);
  }
  assert.equal(fs.readFileSync(fixture.manifestPath, 'utf8'), before);
  assert.equal(fs.existsSync(path.join(fixture.overlayDir, 'skilled')), false);

  // A link inside the overlay folder must not carry the copy out of it.
  const outside = path.join(fixture.workspace, 'outside');
  fs.mkdirSync(outside);
  fs.symlinkSync(outside, path.join(fixture.overlayDir, 'skilled'));
  const linked = fixture.run(['apply', '--adopt', '.skilled/skills/hub/fix.md']);
  assert.equal(linked.code, 2, linked.output);
  assert.match(linked.stdout, /resolves outside the overlay folder through a link/);
  assert.deepEqual(fs.readdirSync(outside), []);
  assert.equal(fs.readFileSync(fixture.manifestPath, 'utf8'), before);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. COMMIT CHECK
// ─────────────────────────────────────────────────────────────────────────────

test('pre-commit refuses a staged vendored change no overlay owns, and passes owned, generated and upstream-equal ones', (t) => {
  const fixture = createStrictFixture(t);
  assert.equal(fixture.run(['pre-commit']).stdout, 'allow\n');

  writeFile(fixture.overlayDir, 'skills/own/SKILL.md', 'project skill two\n');
  assert.equal(fixture.run(['apply']).code, 0);
  writeFile(fixture.tree, '.claude/agents/a.md', 'regenerated\n');
  writeFile(fixture.tree, '.skilled/skills/hub/stable.md', OLD_ENTRIES['.skilled/skills/hub/stable.md']);
  writeFile(fixture.tree, 'README.md', 'project readme\n');
  git(fixture.tree, ['add', '-A']);
  const clean = fixture.run(['pre-commit']);
  assert.equal(clean.code, 0, clean.output);
  assert.equal(clean.stdout, 'allow\n');

  writeFile(fixture.tree, '.skilled/skills/hub/fix.md', 'edited in place\n');
  writeFile(fixture.tree, '.skilled/skills/brand/new.md', 'new\n');
  fs.rmSync(path.join(fixture.tree, '.skilled/skills/hub/SKILL.md'));
  writeFile(fixture.tree, 'REPO RULES.md', 'project rules\n');
  git(fixture.tree, ['add', '-A']);
  const refused = fixture.run(['pre-commit']);
  assert.equal(refused.code, 1, refused.output);
  const lines = refused.stdout.split('\n').filter((line) => line.startsWith('refuse: ')).sort();
  assert.deepEqual(lines, [
    'refuse: staged change to .skilled/skills/brand/new.md is under a vendored root and no overlay owns it',
    'refuse: staged change to .skilled/skills/hub/fix.md is under a vendored root and no overlay owns it',
    'refuse: staged change to REPO RULES.md is under a vendored root and no overlay owns it',
    'refuse: staged deletion of .skilled/skills/hub/SKILL.md is under a vendored root and no overlay owns it',
  ]);

  // A commit that moves the pin is a re-pin, which ran its own drift scan.
  const manifest = readJson(fixture.manifestPath);
  manifest.pin.commit = fixture.newCommit;
  fs.writeFileSync(fixture.manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  git(fixture.tree, ['add', '-A']);
  const repinCommit = fixture.run(['pre-commit']);
  assert.equal(repinCommit.code, 0, repinCommit.output);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. ROOT FILES
// ─────────────────────────────────────────────────────────────────────────────

test('a staged re-pin names each listed root file upstream changed, owned or not', (t) => {
  const fixture = createStrictFixture(t);
  const stageDir = path.join(fixture.workspace, 'stage');
  const staged = fixture.run(['repin', '--upstream', fixture.upstream, '--to', fixture.newCommit,
    '--stage', stageDir, '--json']);
  const report = JSON.parse(staged.stdout);
  assert.equal(report.result, 'STAGED', staged.output);
  assert.deepEqual(report.rootFiles, [
    { path: 'AGENTS.md', owned: true },
    { path: 'REPO RULES.md', owned: false },
  ]);
  assert.ok(report.lines.includes('root-file AGENTS.md changed upstream; rebase the overlay that owns it'),
    report.lines.join('\n'));
  assert.ok(report.lines.some((line) => line.startsWith('root-file REPO RULES.md changed upstream and no overlay owns it; ' +
    'carry the change over by hand')), report.lines.join('\n'));
  // The path holds a space, so the command the line names quotes it.
  assert.ok(report.lines.some((line) => line.includes(ENGINE_COMMAND + ' apply --adopt "REPO RULES.md" ')), report.lines.join('\n'));
  // README.md changed upstream too, but the manifest does not name it as a root file.
  assert.equal(report.lines.some((line) => line.startsWith('root-file README.md')), false);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'REPO RULES.md'), 'utf8'), OLD_ENTRIES['REPO RULES.md']);
});

test('--adopt and pre-commit reject a misused command line', (t) => {
  const fixture = createStrictFixture(t);
  for (const args of [['apply', '--adopt'], ['apply', '--adopt', 'a.md', '--capture', 'b.md'],
    ['status', '--adopt', 'a.md'], ['pre-commit', '--json'], ['pre-commit', 'extra'], ['pre-commit', '--adopt', 'a.md']]) {
    const result = fixture.run(args);
    assert.equal(result.code, 2, args.join(' ') + ': ' + result.output);
    assert.match(result.stdout, /^usage: /);
  }
});
