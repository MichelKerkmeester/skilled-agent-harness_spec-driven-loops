// ───────────────────────────────────────────────────────────────────
// MODULE: Overlay Engine Re-Pin Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// `repin` moves a vendored tree to a new upstream commit. Each fixture builds a
// throwaway git repository with two commits as the upstream, extracts the first
// commit as the vendored tree, and seeds the overlay state with `apply`, so the
// re-pin starts from a tree that passes `status`.

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
  // A global ignore file can hide runtime folders such as `.opencode/`.
  '-c', 'core.excludesFile=/dev/null',
];
const SETTINGS_UPSTREAM = '{"hooks": []}\n';
const ROLLBACK_LINE = /^rollback: node \.skilled\/commands\/doctor\/scripts\/overlay-engine\.cjs repin --rollback (\S+)/m;
const FOREIGN_LOCK = 'orchestrator repin pid=4242 host=some-other-host 2026-11-06T08:00:00Z\n';

const OLD_ENTRIES = {
  '.skilled/skills/hub/ROUTER.md': 'router v1\n',
  '.skilled/skills/hub/SKILL.md': 'skill v1\n',
  '.skilled/skills/hub/fix.md': 'fix v1\n',
  '.skilled/skills/hub/stable.md': 'stable\n',
  '.skilled/skills/hub/old-folder/old.md': 'old\n',
  '.skilled/scripts/hook.sh': { content: '#!/bin/sh\nexit 0\n', mode: 0o755 },
  '.claude/settings.json': SETTINGS_UPSTREAM,
  '.claude/agents/a.md': 'agent v1\n',
  '.codex/config.toml': 'model = "x"\n',
  '.codex/hooks.json': '{}\n',
  '.codex/gone.md': 'gone\n',
  '.opencode/scripts': { link: '../.skilled/scripts' },
  'AGENTS.md': 'upstream agents\n',
};

const NEW_CHANGES = {
  '.skilled/skills/hub/ROUTER.md': 'router v2\n',
  '.skilled/skills/hub/old-folder/old.md': null,
  '.skilled/skills/hub/added.md': 'added\n',
  '.skilled/skills/hub/new-folder/x.md': 'x\n',
  '.claude/agents/a.md': 'agent v2\n',
  '.claude/new.md': 'new\n',
  '.codex/gone.md': null,
  'AGENTS.md': 'upstream agents v2\n',
};

// Upstream also moves two owned files: one the overlay must be rebased onto,
// and one upstream adopted byte for byte, which makes its overlay dead weight.
const MOVED_OWNED_CHANGES = {
  '.skilled/skills/hub/SKILL.md': 'skill v2\n',
  '.skilled/skills/hub/fix.md': 'fix v2\n',
};

const BASE_COPY = [
  '.claude/agents/a.md',
  '.claude/new.md',
  '.claude/settings.json',
  '.codex/config.toml',
  '.codex/hooks.json',
  '.opencode/scripts',
  '.skilled/skills/hub/ROUTER.md',
  '.skilled/skills/hub/added.md',
  '.skilled/skills/hub/new-folder/x.md',
];
const BASE_DELETE = ['.codex/gone.md', '.skilled/skills/hub/old-folder/old.md'];

const GENERATE = "require('fs').writeFileSync('.codex/hooks.json', 'generated\\n')";
const VERIFY = "process.exit(require('fs').readFileSync('.codex/hooks.json', 'utf8') === 'generated\\n' ? 0 : 1)";

function git(cwd, args) {
  const result = spawnSync('git', [...GIT_CONFIG, '-C', cwd, ...args], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error('git ' + args.join(' ') + ': ' + result.stderr);
  return result.stdout.trim();
}

function writeEntries(root, entries) {
  for (const [relativePath, value] of Object.entries(entries)) {
    const filePath = path.join(root, relativePath);
    fs.rmSync(filePath, { recursive: true, force: true });
    if (value === null) continue;
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    if (typeof value === 'object' && value.link) {
      fs.symlinkSync(value.link, filePath);
    } else if (typeof value === 'object') {
      fs.writeFileSync(filePath, value.content);
      fs.chmodSync(filePath, value.mode);
    } else {
      fs.writeFileSync(filePath, value);
    }
  }
}

function extractCommit(upstream, commit, destination, scratch) {
  const archive = path.join(scratch, 'old.tar');
  git(upstream, ['archive', '--format=tar', '-o', archive, commit]);
  const result = spawnSync('tar', ['-xf', archive, '-C', destination], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error('tar: ' + result.stderr);
  fs.rmSync(archive);
}

/**
 * Every file, link and folder below a root, with file modes and hashes.
 * @param {string} root Folder to describe.
 * @param {(relativePath: string) => boolean} [skip] Paths to leave out.
 * @returns {string} One sorted line per entry.
 */
function treeDigest(root, skip = () => false) {
  const rows = [];
  const walk = (dir) => {
    for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
      const absolute = path.join(dir, dirent.name);
      const rel = path.relative(root, absolute).split(path.sep).join('/');
      if (skip(rel)) continue;
      const stats = fs.lstatSync(absolute);
      if (stats.isSymbolicLink()) {
        rows.push(rel + ' -> ' + fs.readlinkSync(absolute));
      } else if (stats.isDirectory()) {
        rows.push(rel + '/');
        walk(absolute);
      } else {
        rows.push(rel + ' ' + (stats.mode & 0o777).toString(8) + ' ' + sha256(fs.readFileSync(absolute)));
      }
    }
  };
  walk(root);
  return rows.sort().join('\n');
}

function skipRunState(rel) {
  return rel === 'skilled-overlays/repin-runs' || rel.startsWith('skilled-overlays/repin-runs/');
}

/**
 * Build an upstream repository with two commits and a vendored tree at the first.
 * @param {object} t The node:test context.
 * @param {{movesOwned?: boolean, overlayFolder?: string, siblingOverlayFolder?: string}} [options]
 *   Whether upstream also changes owned files, and where the overlay folder sits.
 * @returns {object} Fixture paths, commits and a `run` helper.
 */
function createRepinFixture(t, options = {}) {
  const fixture = createWorkspace(t, 'overlay-engine-repin-', {
    overlayFolder: options.overlayFolder,
    siblingOverlayFolder: options.siblingOverlayFolder,
  });
  const { workspace, tree, overlayDir } = fixture;
  const upstream = path.join(workspace, 'upstream');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  writeEntries(upstream, OLD_ENTRIES);
  if (options.oldEntries) writeEntries(upstream, options.oldEntries);
  git(upstream, ['add', '-A']);
  git(upstream, ['commit', '-q', '-m', 'old']);
  const oldCommit = git(upstream, ['rev-parse', 'HEAD']);
  writeEntries(upstream, NEW_CHANGES);
  if (options.movesOwned) writeEntries(upstream, MOVED_OWNED_CHANGES);
  if (options.newEntries) writeEntries(upstream, options.newEntries);
  git(upstream, ['add', '-A']);
  git(upstream, ['commit', '-q', '-m', 'new']);
  const newCommit = git(upstream, ['rev-parse', 'HEAD']);

  extractCommit(upstream, oldCommit, tree, workspace);
  writeFile(overlayDir, 'files/settings.json', '{"hooks": ["project"]}\n');
  writeFile(overlayDir, 'files/SKILL.md', 'project skill\n');
  writeFile(overlayDir, 'files/fix.md', 'fix v2\n');
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: oldCommit.slice(0, 10) },
    layoutLinks: [],
    overlays: [
      {
        id: 'settings',
        scope: 'file',
        source: 'files/settings.json',
        destination: '.claude/settings.json',
        pinnedSha256: sha256(Buffer.from(SETTINGS_UPSTREAM)),
      },
      {
        id: 'hub-skill',
        scope: 'file',
        source: 'files/SKILL.md',
        destination: '.skilled/skills/hub/SKILL.md',
        pinnedSha256: sha256(Buffer.from('skill v1\n')),
      },
      {
        id: 'hub-fix',
        scope: 'file',
        source: 'files/fix.md',
        destination: '.skilled/skills/hub/fix.md',
        pinnedSha256: sha256(Buffer.from('fix v1\n')),
      },
    ],
    regenerate: [{ id: 'codex-hooks', argv: ['node', '-e', GENERATE], outputs: ['.codex/hooks.json'] }],
    verifyGenerated: [{ id: 'codex-hooks', argv: ['node', '-e', VERIFY], expect: 'exit-0' }],
  };
  writeManifest(fixture);
  fixture.upstream = upstream;
  fixture.oldCommit = oldCommit;
  fixture.newCommit = newCommit;
  fixture.manifestPath = path.join(overlayDir, 'overlay-manifest.json');
  fixture.runsDir = path.join(overlayDir, 'repin-runs');
  fixture.run = (args, cwd = workspace) => runEngine([...args, '--root', tree], cwd);
  fixture.repin = (extra = []) => fixture.run(['repin', '--upstream', upstream, '--to', newCommit.slice(0, 10), ...extra]);
  fixture.digest = () => treeDigest(tree, skipRunState);

  const seeded = fixture.run(['apply']);
  assert.equal(seeded.code, 0, seeded.output);
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  return fixture;
}

function read(root, relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

// A link is hashed by its target text, the way the backup records it.
function entryHash(root, relativePath) {
  const filePath = path.join(root, relativePath);
  let stats;
  try {
    stats = fs.lstatSync(filePath);
  } catch {
    return null;
  }
  return sha256(stats.isSymbolicLink() ? Buffer.from(fs.readlinkSync(filePath)) : fs.readFileSync(filePath));
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. A MOVED PIN OVER THE PINNED UPSTREAM BYTES
// ─────────────────────────────────────────────────────────────────────────────

test('after a moved pin, a destination holding its pinned upstream bytes is overlay-edited, not upstream-moved', (t) => {
  const fixture = createRepinFixture(t);
  // The re-copy puts the pinned upstream bytes back over the applied overlay.
  writeFile(fixture.tree, '.claude/settings.json', SETTINGS_UPSTREAM);
  fixture.manifest.pin.commit = 'pin-two';
  writeManifest(fixture);

  const status = fixture.run(['status']);
  assert.equal(status.code, 1, status.output);
  assert.match(status.output, /overlay-edited \.claude\/settings\.json/);
  assert.doesNotMatch(status.output, /^upstream-moved /m);
  assert.match(status.output, /upstream-moved=0/);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(read(fixture.tree, '.claude/settings.json'), '{"hooks": ["project"]}\n');
  assert.equal(fixture.run(['status']).code, 0);
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. LIVE RUN, BACKUP AND ROLLBACK
// ─────────────────────────────────────────────────────────────────────────────

test('a live repin backs up every touched path before its first write, then copies, applies and passes', (t) => {
  const fixture = createRepinFixture(t);
  const before = new Map();
  for (const rel of BASE_COPY.concat(BASE_DELETE)) {
    const hash = entryHash(fixture.tree, rel);
    if (hash !== null) before.set(rel, hash);
  }

  const result = fixture.repin();
  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /^copy 9 paths, delete 2 paths$/m);
  assert.match(result.output, /^RESULT: PASSED$/m);

  const runs = fs.readdirSync(fixture.runsDir);
  assert.equal(runs.length, 1);
  const runDir = path.join(fixture.runsDir, runs[0]);
  const backup = readJson(path.join(runDir, 'backup.json'));
  const touched = backup.entries.filter((entry) => entry.group === 'copy' || entry.group === 'delete');
  assert.deepEqual(touched.map((entry) => entry.path).sort(), BASE_COPY.concat(BASE_DELETE).sort());
  for (const entry of touched) {
    if (!entry.existed) {
      assert.equal(before.has(entry.path), false, entry.path);
      continue;
    }
    // The recorded hash is the pre-run one, so the backup was read before any write.
    assert.equal(entry.sha256, before.get(entry.path), entry.path);
    if (entry.kind === 'file') {
      assert.equal(sha256(fs.readFileSync(path.join(runDir, 'backup', entry.path))), entry.sha256, entry.path);
    }
  }
  assert.ok(backup.entries.some((entry) => entry.path === 'skilled-overlays/overlay-manifest.json'));
  assert.ok(readJson(path.join(runDir, 'report.json')));

  assert.equal(read(fixture.tree, '.skilled/skills/hub/ROUTER.md'), 'router v2\n');
  assert.equal(read(fixture.tree, '.skilled/skills/hub/new-folder/x.md'), 'x\n');
  assert.equal(fs.existsSync(path.join(fixture.tree, '.skilled/skills/hub/old-folder')), false);
  assert.equal(fs.existsSync(path.join(fixture.tree, '.codex/gone.md')), false);
  assert.equal(read(fixture.tree, '.claude/settings.json'), '{"hooks": ["project"]}\n');
  assert.equal(read(fixture.tree, '.codex/hooks.json'), 'generated\n');
  assert.equal(read(fixture.tree, 'AGENTS.md'), 'upstream agents\n');
  assert.equal(readJson(fixture.manifestPath).pin.commit, fixture.newCommit.slice(0, 10));
  assert.equal(readJson(path.join(fixture.overlayDir, 'sync-state.json')).pin, fixture.newCommit.slice(0, 10));
  assert.equal(fs.existsSync(fixture.lockPath), false);

  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.equal(fixture.run(['apply']).output.trim(), '0 changed');
});

test('a failure after the backup names the run, and --rollback restores the tree byte for byte so status passes', (t) => {
  const fixture = createRepinFixture(t);
  // The step fails only once the re-pin has copied the new commit in.
  fixture.manifest.regenerate.push({
    id: 'fails-after-copy',
    argv: ['node', '-e', "process.exit(require('fs').existsSync('.skilled/skills/hub/added.md') ? 3 : 0)"],
  });
  writeManifest(fixture);
  assert.equal(fixture.run(['apply']).code, 0);
  const before = fixture.digest();

  const failed = fixture.repin();
  assert.equal(failed.code, 1, failed.output);
  assert.match(failed.output, /^RESULT: FAILED$/m);
  const match = failed.output.match(ROLLBACK_LINE);
  assert.ok(match, failed.output);
  assert.notEqual(fixture.digest(), before);

  const rolledBack = fixture.run(['repin', '--rollback', match[1]]);
  assert.equal(rolledBack.code, 0, rolledBack.output);
  assert.equal(fixture.digest(), before);
  assert.equal(fs.existsSync(fixture.lockPath), false);
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.match(status.output, /RESULT: PASSED/);
});

test('--rollback restores the Python cache in a folder a directory overlay stopped shipping', (t) => {
  const fixture = createRepinFixture(t);
  const { tree, overlayDir } = fixture;
  writeFile(overlayDir, 'vendor/keep/a.py', 'a\n');
  writeFile(overlayDir, 'vendor/sub/b.py', 'b\n');
  fixture.manifest.overlays.push({ id: 'vendor', scope: 'directory', source: 'vendor', destination: '.skilled/vendor' });
  fixture.manifest.regenerate.push({
    id: 'fails-after-copy',
    argv: ['node', '-e', "process.exit(require('fs').existsSync('.skilled/skills/hub/added.md') ? 3 : 0)"],
  });
  writeManifest(fixture);
  assert.equal(fixture.run(['apply']).code, 0);
  const cacheBytes = Buffer.from([0x55, 0x0d, 0x0d, 0x0a, 0x00, 0xff, 0x63]);
  const cachePath = path.join(tree, '.skilled/vendor/sub/__pycache__/b.cpython-39.pyc');
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, cacheBytes);
  fs.rmSync(path.join(overlayDir, 'vendor/sub'), { recursive: true });

  const failed = fixture.repin();
  assert.equal(failed.code, 1, failed.output);
  const match = failed.output.match(ROLLBACK_LINE);
  assert.ok(match, failed.output);
  assert.equal(fs.existsSync(path.join(tree, '.skilled/vendor/sub')), false);

  const rolledBack = fixture.run(['repin', '--rollback', match[1]]);
  assert.equal(rolledBack.code, 0, rolledBack.output);
  assert.equal(fs.readFileSync(path.join(tree, '.skilled/vendor/sub/b.py'), 'utf8'), 'b\n');
  assert.deepEqual(fs.readFileSync(cachePath), cacheBytes);
});

test('--rollback refuses a backed-up file whose bytes no longer match the recorded hash', (t) => {
  const fixture = createRepinFixture(t);
  const result = fixture.repin();
  assert.equal(result.code, 0, result.output);
  const runId = fs.readdirSync(fixture.runsDir)[0];
  const backupFile = path.join(fixture.runsDir, runId, 'backup', '.skilled/skills/hub/ROUTER.md');
  fs.writeFileSync(backupFile, 'tampered\n');
  const after = fixture.digest();

  const rolledBack = fixture.run(['repin', '--rollback', runId]);
  assert.equal(rolledBack.code, 2, rolledBack.output);
  assert.match(rolledBack.output, /\.skilled\/skills\/hub\/ROUTER\.md/);
  assert.equal(fixture.digest(), after);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. REFUSALS BEFORE ANY WRITE
// ─────────────────────────────────────────────────────────────────────────────

test('an unowned file edited in place refuses the repin, names the path and writes nothing', (t) => {
  const fixture = createRepinFixture(t);
  writeFile(fixture.tree, '.skilled/skills/hub/ROUTER.md', 'router fixed in place\n');
  const before = treeDigest(fixture.tree);

  const result = fixture.repin();
  assert.equal(result.code, 2, result.output);
  assert.match(result.output, /unowned \.skilled\/skills\/hub\/ROUTER\.md differs from the old pin/);
  // The applied overlay and the regenerated output differ from the pin too, and
  // are owned, so they are not named.
  assert.doesNotMatch(result.output, /unowned \.claude\/settings\.json/);
  assert.doesNotMatch(result.output, /unowned \.codex\/hooks\.json/);
  assert.equal(treeDigest(fixture.tree), before);
  assert.equal(fs.existsSync(fixture.runsDir), false);
});

test('a project file at a path upstream ships for the first time refuses the repin', (t) => {
  const fixture = createRepinFixture(t);
  writeFile(fixture.tree, '.claude/new.md', 'project notes\n');
  const before = treeDigest(fixture.tree);

  const result = fixture.repin();
  assert.equal(result.code, 2, result.output);
  assert.match(result.output, /unowned \.claude\/new\.md is not in the old pin, and the tree holds its own copy there/);
  assert.equal(treeDigest(fixture.tree), before);

  // The same bytes upstream now ships are no loss, so they pass.
  writeFile(fixture.tree, '.claude/new.md', 'new\n');
  assert.equal(fixture.repin().code, 0);
});

test('a .env path upstream ships refuses the repin before any read or write', (t) => {
  const fixture = createRepinFixture(t, { newEntries: { '.claude/.env': 'SECRET=upstream\n' } });
  const before = treeDigest(fixture.tree);

  const result = fixture.repin();
  assert.equal(result.code, 2, result.output);
  assert.match(result.output, /\.claude\/\.env is a \.env path, which is never read/);
  assert.equal(treeDigest(fixture.tree), before);
  assert.equal(fs.existsSync(fixture.runsDir), false);
});

test('a repin to the commit already pinned reports nothing to copy and writes nothing', (t) => {
  const fixture = createRepinFixture(t);
  const before = treeDigest(fixture.tree);
  for (const target of [fixture.oldCommit, fixture.oldCommit.slice(0, 10)]) {
    const result = fixture.run(['repin', '--upstream', fixture.upstream, '--to', target]);
    assert.equal(result.code, 0, result.output);
    assert.match(result.output, /^nothing to copy$/m);
    assert.equal(treeDigest(fixture.tree), before);
  }
});

test('a commit missing from the upstream exits 2 before any write', (t) => {
  const fixture = createRepinFixture(t);
  const before = treeDigest(fixture.tree);
  const missingTarget = fixture.run(['repin', '--upstream', fixture.upstream, '--to', 'deadbeefdeadbeef']);
  assert.equal(missingTarget.code, 2, missingTarget.output);
  assert.match(missingTarget.output, /deadbeefdeadbeef is not a commit in /);
  assert.equal(treeDigest(fixture.tree), before);

  fixture.manifest.pin.commit = 'feedfacefeedface';
  writeManifest(fixture);
  const pinned = treeDigest(fixture.tree);
  const missingPin = fixture.repin();
  assert.equal(missingPin.code, 2, missingPin.output);
  assert.match(missingPin.output, /feedfacefeedface is not a commit in /);
  assert.equal(treeDigest(fixture.tree), pinned);
});

test('repin refuses while another run holds the lock, and while status shows a live edit', (t) => {
  const fixture = createRepinFixture(t);
  fs.writeFileSync(fixture.lockPath, FOREIGN_LOCK);
  const before = treeDigest(fixture.tree);
  const locked = fixture.repin();
  assert.equal(locked.code, 2, locked.output);
  assert.match(locked.output, /orchestrator repin pid=4242/);
  assert.equal(treeDigest(fixture.tree), before);
  assert.equal(fs.readFileSync(fixture.lockPath, 'utf8'), FOREIGN_LOCK);
  fs.unlinkSync(fixture.lockPath);

  writeFile(fixture.tree, '.claude/settings.json', '{"hooks": ["edited live"]}\n');
  const edited = treeDigest(fixture.tree);
  const liveEdit = fixture.repin();
  assert.equal(liveEdit.code, 2, liveEdit.output);
  assert.match(liveEdit.output, /live-edited \.claude\/settings\.json/);
  assert.match(liveEdit.output, /refuse: status shows/);
  assert.equal(treeDigest(fixture.tree), edited);
  assert.equal(fs.existsSync(fixture.lockPath), false);
});

test('repin.exclude keeps a real folder where upstream ships a link', (t) => {
  const fixture = createRepinFixture(t);
  fs.unlinkSync(path.join(fixture.tree, '.opencode/scripts'));
  writeFile(fixture.tree, '.opencode/scripts/git-hooks/pre-commit', '#!/bin/sh\n# project hook\n');

  // Without the exclude, the folder is unowned drift the copy would replace.
  const before = treeDigest(fixture.tree);
  const refused = fixture.repin();
  assert.equal(refused.code, 2, refused.output);
  assert.match(refused.output, /unowned \.opencode\/scripts differs from the old pin/);
  assert.equal(treeDigest(fixture.tree), before);

  fixture.manifest.repin = { exclude: ['.opencode/scripts'] };
  writeManifest(fixture);
  const result = fixture.repin();
  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /^copy 8 paths, delete 2 paths$/m);
  assert.ok(fs.lstatSync(path.join(fixture.tree, '.opencode/scripts')).isDirectory());
  assert.equal(read(fixture.tree, '.opencode/scripts/git-hooks/pre-commit'), '#!/bin/sh\n# project hook\n');
  assert.equal(read(fixture.tree, '.claude/agents/a.md'), 'agent v2\n');
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. STAGE
// ─────────────────────────────────────────────────────────────────────────────

test('repin --stage builds the re-pinned tree in a copy, reports both groups and leaves the live tree untouched', (t) => {
  const fixture = createRepinFixture(t, { movesOwned: true });
  const stageDir = path.join(fixture.workspace, 'stage');
  const before = treeDigest(fixture.tree);

  const staged = fixture.repin(['--stage', stageDir]);
  assert.equal(staged.code, 1, staged.output);
  assert.match(staged.output, /^copy 11 paths, delete 2 paths$/m);
  assert.match(staged.output, /^blocked hub-skill: upstream-moved \.skilled\/skills\/hub\/SKILL\.md$/m);
  assert.match(staged.output, /^equals-upstream hub-fix$/m);
  assert.doesNotMatch(staged.output, /^equals-upstream (settings|hub-skill)$/m);
  assert.match(staged.output, /^RESULT: BLOCKED$/m);
  assert.doesNotMatch(staged.output, /^RESULT: STAGED$/m);
  assert.doesNotMatch(staged.output, /^rollback:/m);

  assert.equal(treeDigest(fixture.tree), before);
  assert.equal(read(stageDir, '.skilled/skills/hub/ROUTER.md'), 'router v2\n');
  assert.equal(readJson(path.join(stageDir, 'skilled-overlays/overlay-manifest.json')).pin.commit, fixture.newCommit.slice(0, 10));
  // The stage skips the regenerate and verify steps, and says so.
  assert.equal(read(stageDir, '.codex/hooks.json'), '{}\n');
  assert.match(staged.output, /^stage skipped 1 regenerate and 1 verify step\(s\); the live run runs them$/m);
});

test('repin --stage treats an upstream addition inside a removed folder as removed', (t) => {
  const fixture = createRepinFixture(t, {
    newEntries: { '.skilled/skills/hub/old-folder/new-file.md': 'new inside removed folder\n' },
  });
  writeFile(fixture.overlayDir, 'hub-root/stable.md', 'stable\n');
  fixture.manifest.overlays.push({
    id: 'hub-root',
    scope: 'skill-root',
    source: 'hub-root',
    destination: '.skilled/skills/hub',
    replace: ['stable.md'],
    remove: ['old-folder'],
  });
  writeManifest(fixture);
  fs.rmSync(path.join(fixture.tree, '.skilled/skills/hub/old-folder'), { recursive: true, force: true });
  const seeded = fixture.run(['apply']);
  assert.equal(seeded.code, 0, seeded.output);
  assert.equal(fixture.run(['status']).code, 0);

  const stageDir = path.join(fixture.workspace, 'stage');
  const staged = fixture.repin(['--stage', stageDir]);
  assert.equal(staged.code, 0, staged.output);
  assert.match(staged.output, /^RESULT: STAGED$/m);
  assert.doesNotMatch(staged.output, /^blocked hub-root:/m);
  assert.doesNotMatch(staged.output, /live-edited \.skilled\/skills\/hub\/old-folder/m);
  assert.equal(fs.existsSync(path.join(stageDir, '.skilled/skills/hub/old-folder/new-file.md')), false);
  assert.equal(read(stageDir, '.skilled/skills/hub/stable.md'), 'stable\n');
});

test('repin --stage treats an upstream addition inside a replaced folder as overlay-owned, and a hand-added file as live-edited', (t) => {
  const fixture = createRepinFixture(t, {
    newEntries: { '.skilled/skills/hub/replaced/sub/f.md': 'upstream addition\n' },
  });
  writeFile(fixture.overlayDir, 'hub-root/replaced/keep.md', 'overlay keep\n');
  fixture.manifest.overlays.push({
    id: 'hub-root',
    scope: 'skill-root',
    source: 'hub-root',
    destination: '.skilled/skills/hub',
    replace: ['replaced'],
    remove: [],
  });
  writeManifest(fixture);
  const seeded = fixture.run(['apply']);
  assert.equal(seeded.code, 0, seeded.output);
  assert.equal(fixture.run(['status']).code, 0);

  const stageDir = path.join(fixture.workspace, 'stage');
  const staged = fixture.repin(['--stage', stageDir]);
  assert.equal(staged.code, 0, staged.output);
  assert.match(staged.output, /^RESULT: STAGED$/m);
  assert.doesNotMatch(staged.output, /^blocked hub-root:/m);
  assert.doesNotMatch(staged.output, /live-edited \.skilled\/skills\/hub\/replaced/m);
  assert.equal(fs.existsSync(path.join(stageDir, '.skilled/skills/hub/replaced/sub/f.md')), false);
  assert.equal(read(stageDir, '.skilled/skills/hub/replaced/keep.md'), 'overlay keep\n');

  writeFile(fixture.tree, '.skilled/skills/hub/replaced/other.md', 'hand added\n');
  const handStage = path.join(fixture.workspace, 'stage-hand');
  const handAdded = fixture.repin(['--stage', handStage]);
  assert.equal(handAdded.code, 2, handAdded.output);
  assert.match(handAdded.output, /live-edited \.skilled\/skills\/hub\/replaced\/other\.md/);
  assert.match(handAdded.output, /refuse: status shows/);
  assert.equal(read(fixture.tree, '.skilled/skills/hub/replaced/other.md'), 'hand added\n');
});

test('repin --stage treats an upstream change inside a replaced folder as overlay-owned', (t) => {
  const fixture = createRepinFixture(t, {
    oldEntries: { '.skilled/skills/hub/replaced/sub/f.md': 'upstream v1\n' },
    newEntries: { '.skilled/skills/hub/replaced/sub/f.md': 'upstream v2\n' },
  });
  writeFile(fixture.overlayDir, 'hub-root/replaced/keep.md', 'overlay keep\n');
  fixture.manifest.overlays.push({
    id: 'hub-root',
    scope: 'skill-root',
    source: 'hub-root',
    destination: '.skilled/skills/hub',
    replace: ['replaced'],
    remove: [],
  });
  writeManifest(fixture);

  const stageDir = path.join(fixture.workspace, 'stage');
  const staged = fixture.repin(['--stage', stageDir]);
  assert.equal(staged.code, 0, staged.output);
  assert.match(staged.output, /^RESULT: STAGED$/m);
  assert.doesNotMatch(staged.output, /^blocked hub-root:/m);
  assert.doesNotMatch(staged.output, /live-edited \.skilled\/skills\/hub\/replaced/m);
  assert.equal(fs.existsSync(path.join(stageDir, '.skilled/skills/hub/replaced/sub/f.md')), false);
  assert.equal(read(stageDir, '.skilled/skills/hub/replaced/keep.md'), 'overlay keep\n');
});

test('repin --stage refuses a folder that is not empty or that sits inside the live tree', (t) => {
  const fixture = createRepinFixture(t);
  const before = treeDigest(fixture.tree);
  const busy = path.join(fixture.workspace, 'busy');
  writeFile(busy, 'keep.txt', 'keep\n');

  const notEmpty = fixture.repin(['--stage', busy]);
  assert.equal(notEmpty.code, 2, notEmpty.output);
  assert.match(notEmpty.output, /stage folder is not empty/);
  assert.equal(read(busy, 'keep.txt'), 'keep\n');

  const inside = fixture.repin(['--stage', path.join(fixture.tree, 'stage')]);
  assert.equal(inside.code, 2, inside.output);
  assert.match(inside.output, /stage folder sits inside the tree/);
  assert.equal(treeDigest(fixture.tree), before);
});

test('a misused repin command line prints the usage and exits 2', (t) => {
  const fixture = createRepinFixture(t);
  for (const args of [
    ['repin'],
    ['repin', '--upstream', fixture.upstream],
    ['repin', '--to', fixture.newCommit],
    ['repin', '--rollback', 'x', '--to', fixture.newCommit],
    ['status', '--upstream', fixture.upstream],
  ]) {
    const result = fixture.run(args);
    assert.equal(result.code, 2, args.join(' ') + ': ' + result.output);
    assert.match(result.output, /^usage: node overlay-engine\.cjs status/, args.join(' '));
    assert.match(result.output, /repin --upstream <dir> --to <commit>/, args.join(' '));
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. WHAT A RE-PIN COPIES, WHAT IT LEAVES, AND WHAT STOPS IT
// ─────────────────────────────────────────────────────────────────────────────

test('a re-pin copies .dsh with the other runtime folders when the manifest names none', (t) => {
  const fixture = createRepinFixture(t, { newEntries: { '.dsh/skills/hub.md': 'dsh hub\n' } });
  const result = fixture.repin();
  assert.equal(result.code, 0, result.output);
  // The base set plus the one new .dsh file, and nothing else.
  assert.match(result.output, /^copy 10 paths, delete 2 paths$/m);
  assert.equal(read(fixture.tree, '.dsh/skills/hub.md'), 'dsh hub\n');
});

test('a re-pin copies .vibe with the other runtime folders when the manifest names none', (t) => {
  const fixture = createRepinFixture(t, { newEntries: { '.vibe/hooks.toml': 'vibe hooks\n' } });
  const result = fixture.repin();
  assert.equal(result.code, 0, result.output);
  // The base set plus the one new .vibe file, and nothing else.
  assert.match(result.output, /^copy 10 paths, delete 2 paths$/m);
  assert.equal(read(fixture.tree, '.vibe/hooks.toml'), 'vibe hooks\n');
});

test('a re-pin lists upstream changes it does not copy and skips a top-level link', (t) => {
  const fixture = createRepinFixture(t, {
    newEntries: { 'repo-rules/new-rule.md': 'rule\n', 'specs/notes.md': 'notes\n', 'docs/guide.md': 'guide\n' },
  });
  // The project keeps its own repo-rules folder and links specs elsewhere; it has no docs folder.
  writeFile(fixture.tree, 'repo-rules/local.md', 'local rule\n');
  fs.symlinkSync('../project-specs', path.join(fixture.tree, 'specs'));
  fixture.manifest.repin = { exclude: ['.claude/new.md'] };
  writeManifest(fixture);

  const result = fixture.repin(['--json']);
  assert.equal(result.code, 0, result.output);
  const report = JSON.parse(result.stdout);
  assert.deepEqual(report.notCopied, ['.claude/new.md', 'AGENTS.md', 'repo-rules/new-rule.md']);
  assert.ok(report.lines.some((line) => /^not-copied 3 upstream change\(s\) outside .*; carry them over by hand/.test(line)), report.lines.join('\n'));
  // The project's own copy of a root file is never overwritten.
  assert.equal(read(fixture.tree, 'AGENTS.md'), 'upstream agents\n');
  assert.equal(fs.existsSync(path.join(fixture.tree, 'repo-rules/new-rule.md')), false);
});

test('a nested overlay folder hides only its own paths from the not-copied list', (t) => {
  const fixture = createRepinFixture(t, {
    overlayFolder: 'project/overlays',
    newEntries: { 'project/README.md': 'readme\n', 'project/overlays/upstream.md': 'x\n' },
  });

  const result = fixture.repin(['--json']);
  assert.equal(result.code, 0, result.output);
  const report = JSON.parse(result.stdout);
  assert.ok(report.notCopied.includes('project/README.md'), report.notCopied.join('\n'));
  assert.equal(report.notCopied.includes('project/overlays/upstream.md'), false, report.notCopied.join('\n'));
});

test('a re-pin over a refused overlay stops before the backup and writes nothing', (t) => {
  const fixture = createRepinFixture(t);
  writeFile(fixture.overlayDir, 'files/.env.local', 'SECRET=1\n');
  fixture.manifest.overlays.push({ id: 'env', scope: 'file', source: 'files/.env.local', destination: '.env.local' });
  writeManifest(fixture);
  const before = treeDigest(fixture.tree);

  const result = fixture.repin();
  assert.equal(result.code, 2, result.output);
  assert.match(result.output, /^blocked env: refused refusing to inspect a protected path: files\/\.env\.local/m);
  assert.match(result.output, /^refuse: status shows 1 refused overlay\(s\); fix them before a re-pin$/m);
  assert.equal(treeDigest(fixture.tree), before);
  assert.equal(fs.existsSync(fixture.runsDir), false);
});

test('a re-pin replaces an unowned link with the folder the new pin ships there', (t) => {
  const fixture = createRepinFixture(t, {
    oldEntries: {
      '.skilled/changelog/target/v1.md': 'target v1\n',
      '.skilled/changelog/alias': { link: 'target' },
    },
    newEntries: {
      '.skilled/changelog/alias': null,
      '.skilled/changelog/alias/v1.md': 'alias v1\n',
      '.skilled/changelog/alias/v2.md': 'alias v2\n',
    },
  });

  const result = fixture.repin();
  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /^RESULT: PASSED$/m);
  assert.equal(fs.lstatSync(path.join(fixture.tree, '.skilled/changelog/alias')).isDirectory(), true);
  assert.equal(read(fixture.tree, '.skilled/changelog/alias/v1.md'), 'alias v1\n');
  assert.equal(read(fixture.tree, '.skilled/changelog/alias/v2.md'), 'alias v2\n');
  // The link's old target is not the re-pin's to touch.
  assert.equal(read(fixture.tree, '.skilled/changelog/target/v1.md'), 'target v1\n');
});

test('a re-pin still refuses a new upstream file that a project link already reaches', (t) => {
  const fixture = createRepinFixture(t, {
    newEntries: { '.skilled/changelog/alias/v1.md': 'alias v1\n' },
  });
  writeFile(fixture.tree, '.skilled/changelog/target/v1.md', 'project v1\n');
  fs.symlinkSync('target', path.join(fixture.tree, '.skilled/changelog/alias'));
  const before = treeDigest(fixture.tree);

  const result = fixture.repin();
  assert.equal(result.code, 2, result.output);
  assert.match(result.output, /unowned \.skilled\/changelog\/alias\/v1\.md is not in the old pin, and the tree holds its own copy there/);
  assert.equal(treeDigest(fixture.tree), before);
});

test('repin --stage treats an upstream addition inside a directory overlay as overlay-owned, and a hand-added file as live-edited', (t) => {
  const fixture = createRepinFixture(t, {
    oldEntries: { '.skilled/skills/owned/keep.md': 'upstream keep\n' },
    newEntries: { '.skilled/skills/owned/sub/f.md': 'upstream addition\n' },
  });
  writeFile(fixture.overlayDir, 'owned/keep.md', 'overlay keep\n');
  fixture.manifest.overlays.push({
    id: 'owned-dir',
    scope: 'directory',
    source: 'owned',
    destination: '.skilled/skills/owned',
  });
  writeManifest(fixture);
  const seeded = fixture.run(['apply']);
  assert.equal(seeded.code, 0, seeded.output);
  assert.equal(fixture.run(['status']).code, 0);

  const stageDir = path.join(fixture.workspace, 'stage');
  const staged = fixture.repin(['--stage', stageDir]);
  assert.equal(staged.code, 0, staged.output);
  assert.match(staged.output, /^RESULT: STAGED$/m);
  assert.doesNotMatch(staged.output, /^blocked owned-dir:/m);
  assert.equal(fs.existsSync(path.join(stageDir, '.skilled/skills/owned/sub/f.md')), false);
  assert.equal(read(stageDir, '.skilled/skills/owned/keep.md'), 'overlay keep\n');

  writeFile(fixture.tree, '.skilled/skills/owned/other.md', 'hand added\n');
  const handStage = path.join(fixture.workspace, 'stage-hand');
  const handAdded = fixture.repin(['--stage', handStage]);
  assert.equal(handAdded.code, 2, handAdded.output);
  assert.match(handAdded.output, /live-edited \.skilled\/skills\/owned\/other\.md/);
  assert.equal(read(fixture.tree, '.skilled/skills/owned/other.md'), 'hand added\n');
});

test('a folder overlay rebased onto the new pin applies after the copy, and one that is not stays upstream-moved', (t) => {
  const fixture = createRepinFixture(t, {
    oldEntries: { '.skilled/skills/owned/keep.md': 'upstream keep v1\n' },
    newEntries: { '.skilled/skills/owned/keep.md': 'upstream keep v2\n' },
  });
  writeFile(fixture.overlayDir, 'owned/keep.md', 'overlay keep\n');
  const entry = {
    id: 'owned-dir',
    scope: 'directory',
    source: 'owned',
    destination: '.skilled/skills/owned',
  };
  fixture.manifest.overlays.push(entry);
  writeManifest(fixture);
  const seeded = fixture.run(['apply']);
  assert.equal(seeded.code, 0, seeded.output);
  assert.equal(fixture.run(['status']).code, 0);

  // No record of a rebase: upstream's change still needs a person.
  const plainStage = path.join(fixture.workspace, 'stage-plain');
  const plain = fixture.repin(['--stage', plainStage]);
  assert.equal(plain.code, 1, plain.output);
  assert.match(plain.output, /^blocked owned-dir: upstream-moved \.skilled\/skills\/owned\/keep\.md$/m);
  assert.match(plain.output, /^RESULT: BLOCKED$/m);

  // A rebase onto some other commit says nothing about this one.
  entry.rebasedOnto = fixture.oldCommit.slice(0, 10);
  writeManifest(fixture);
  const staleStage = path.join(fixture.workspace, 'stage-stale');
  const stale = fixture.repin(['--stage', staleStage]);
  assert.equal(stale.code, 1, stale.output);
  assert.match(stale.output, /^blocked owned-dir: upstream-moved \.skilled\/skills\/owned\/keep\.md$/m);

  entry.rebasedOnto = fixture.newCommit.slice(0, 10);
  writeManifest(fixture);
  const live = fixture.repin();
  assert.equal(live.code, 0, live.output);
  assert.doesNotMatch(live.output, /^blocked owned-dir:/m);
  assert.match(live.output, /^RESULT: PASSED$/m);
  assert.equal(read(fixture.tree, '.skilled/skills/owned/keep.md'), 'overlay keep\n');
});

// A regenerate step can rewrite a file an overlay owns. The engine has to name
// the step, because the upstream diff for that file holds nothing.
test('a live repin names the regenerate step that rewrote a file an overlay owns, not upstream-moved', (t) => {
  const fixture = createRepinFixture(t);
  // The step rewrites the owned file only once the re-pin has copied the new commit in.
  fixture.manifest.regenerate.push({
    id: 'rewrites-owned',
    argv: ['node', '-e', "const fs = require('fs'); if (fs.existsSync('.skilled/skills/hub/added.md')) " +
      "fs.writeFileSync('.skilled/skills/hub/SKILL.md', 'regenerated skill\\n')"],
  });
  writeManifest(fixture);
  assert.equal(fixture.run(['apply']).code, 0);

  const failed = fixture.repin();
  assert.equal(failed.code, 1, failed.output);
  assert.match(failed.output, /^RESULT: FAILED$/m);
  assert.match(failed.output,
    /^regenerated \.skilled\/skills\/hub\/SKILL\.md {2}\(overlay: skilled-overlays\/files\/SKILL\.md\) {2}step: rewrites-owned {2}fix: /m);
  assert.doesNotMatch(failed.output, /^upstream-moved \.skilled\/skills\/hub\/SKILL\.md/m);
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. A SET DROPPED BEFORE A RE-PIN
// ─────────────────────────────────────────────────────────────────────────────

const SET_DESTINATION = '.codex/baseline.json';
const SET_SOURCE = 'json/baseline.json';

function setDocument(top, other) {
  return JSON.stringify({ rows: { a: { top }, b: { top: other } } }, null, 2) + '\n';
}

function writeSetOperations(fixture, operations) {
  writeFile(fixture.overlayDir, SET_SOURCE, JSON.stringify({
    target: SET_DESTINATION,
    style: { indent: 2, primitiveArrays: 'inline' },
    operations,
  }, null, 2) + '\n');
}

test('a live repin returns a dropped set to the value the new pin holds and keeps the set that stays', (t) => {
  const fixture = createRepinFixture(t, {
    oldEntries: { [SET_DESTINATION]: setDocument('sk-code', 'old') },
    newEntries: { [SET_DESTINATION]: setDocument('sk-review', 'new') },
  });
  const dropped = { op: 'set', path: ['rows', 'a', 'top'], value: 'sk-doc' };
  const kept = { op: 'set', path: ['rows', 'b', 'top'], value: 'project' };
  writeSetOperations(fixture, [dropped, kept]);
  fixture.manifest.overlays.push({
    id: 'baseline-set',
    scope: 'json-entry',
    source: SET_SOURCE,
    destination: SET_DESTINATION,
    pinnedSha256: sha256(Buffer.from(setDocument('sk-code', 'old'))),
  });
  writeManifest(fixture);
  const seeded = fixture.run(['apply']);
  assert.equal(seeded.code, 0, seeded.output);
  assert.equal(read(fixture.tree, SET_DESTINATION), setDocument('sk-doc', 'project'));

  // The entry set is rebased onto the new pin and one set leaves it.
  writeSetOperations(fixture, [kept]);
  fixture.manifest.overlays[3].pinnedSha256 = sha256(Buffer.from(setDocument('sk-review', 'new')));
  writeManifest(fixture);
  const result = fixture.repin();

  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /^RESULT: PASSED$/m);
  // The dropped set must not survive the re-pin, and its value comes from the
  // new pin, not from the pin it was applied over.
  assert.equal(read(fixture.tree, SET_DESTINATION), setDocument('sk-review', 'project'));
  const sets = readJson(path.join(fixture.overlayDir, 'sync-state.json')).sets[SET_DESTINATION];
  assert.deepEqual(sets.map((entry) => entry.path), [kept.path]);
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.equal(fixture.run(['apply']).output.trim(), '0 changed');
});

test('a live repin restores a dropped set in a json-entry file at the tree root from the new commit', (t) => {
  const fixture = createRepinFixture(t, {
    oldEntries: { 'baseline.json': setDocument('sk-code', 'old') },
    newEntries: { 'baseline.json': setDocument('sk-review', 'old') },
  });
  const dropped = { op: 'set', path: ['rows', 'a', 'top'], value: 'sk-doc' };
  writeFile(fixture.overlayDir, SET_SOURCE, JSON.stringify({
    target: 'baseline.json',
    style: { indent: 2, primitiveArrays: 'inline' },
    operations: [dropped],
  }, null, 2) + '\n');
  fixture.manifest.overlays.push({
    id: 'baseline-set',
    scope: 'json-entry',
    source: SET_SOURCE,
    destination: 'baseline.json',
    pinnedSha256: sha256(Buffer.from(setDocument('sk-code', 'old'))),
  });
  writeManifest(fixture);
  assert.equal(fixture.run(['apply']).code, 0);

  writeFile(fixture.overlayDir, SET_SOURCE, JSON.stringify({
    target: 'baseline.json',
    style: { indent: 2, primitiveArrays: 'inline' },
    operations: [],
  }, null, 2) + '\n');
  const result = fixture.repin();

  // The copy leaves a root file alone, so the restore reads the new commit itself.
  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /^RESULT: PASSED$/m);
  assert.equal(read(fixture.tree, 'baseline.json'), setDocument('sk-review', 'old'));
});

test('a re-pin stops before the backup when a json-entry file it leaves in place cannot be restored at the new pin', (t) => {
  const listDestination = '.codex/list.json';
  const list = (rows) => JSON.stringify({ rows }, null, 2) + '\n';
  const fixture = createRepinFixture(t, {
    oldEntries: { [listDestination]: list([{ id: 'A', top: 'a' }, { id: 'B', top: 'b' }]) },
    newEntries: { [listDestination]: list([{ id: 'B', top: 'b' }, { id: 'A', top: 'a' }]) },
  });
  const writeList = (operations) => writeFile(fixture.overlayDir, 'json/list.json', JSON.stringify({
    target: listDestination,
    style: { indent: 2, primitiveArrays: 'inline' },
    operations,
  }, null, 2) + '\n');
  writeList([{ op: 'set', path: ['rows', 1, 'top'], value: 'v' }]);
  fixture.manifest.overlays.push({
    id: 'list-set',
    scope: 'json-entry',
    source: 'json/list.json',
    destination: listDestination,
    pinnedSha256: sha256(Buffer.from(list([{ id: 'A', top: 'a' }, { id: 'B', top: 'b' }]))),
  });
  fixture.manifest.repin = { exclude: [listDestination] };
  writeManifest(fixture);
  assert.equal(fixture.run(['apply']).code, 0);

  writeList([]);
  const before = treeDigest(fixture.tree);
  const result = fixture.repin();

  // Index 1 is B in the live file and A at the new pin, so neither value is right.
  assert.equal(result.code, 2, result.output);
  assert.match(result.output, /^blocked list-set: refused cannot apply the entry set to \.codex\/list\.json: cannot restore the dropped set at rows\.1\.top: its path goes through an array whose items differ from the pinned copy/m);
  assert.match(result.output, /^refuse: 1 json-entry overlay\(s\) the copy leaves in place cannot be applied at the new pin; for a refused array, put it back to the copy at the current pin by hand, run apply, then re-pin$/m);
  assert.equal(treeDigest(fixture.tree), before);
  assert.equal(fs.existsSync(fixture.runsDir), false);
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. UPSTREAM CONTENT AN OVERLAY WRITES OVER
// ─────────────────────────────────────────────────────────────────────────────

// A re-pin copies upstream's change in and the overlay writes over it at once,
// so the report is the only place the loss can show before the next re-pin.

function addJsonOverlay(fixture, id, destination, oldText, operations) {
  const source = `json/${id}.json`;
  writeFile(fixture.overlayDir, source, JSON.stringify({
    target: destination,
    style: { indent: 2, primitiveArrays: 'inline' },
    operations,
  }, null, 2) + '\n');
  const entry = { id, scope: 'json-entry', source, destination, pinnedSha256: sha256(Buffer.from(oldText)) };
  fixture.manifest.overlays.push(entry);
  writeManifest(fixture);
  const seeded = fixture.run(['apply']);
  assert.equal(seeded.code, 0, seeded.output);
  return entry;
}

function stageReport(stageDir) {
  const runsDir = path.join(stageDir, 'skilled-overlays', 'repin-runs');
  const [runId] = fs.readdirSync(runsDir);
  return readJson(path.join(runsDir, runId, 'report.json'));
}

test('a re-pin names each upstream change a json-entry set or setKeyOnItem writes over', (t) => {
  const destination = '.codex/list.json';
  const oldText = JSON.stringify({ rows: ['a', 'b'], name: 'v1', keep: 'k', items: [{ id: 'A', top: 'a' }] }, null, 2) + '\n';
  const newText = JSON.stringify({ rows: ['a', 'b', 'c'], name: 'v2', keep: 'k', items: [{ id: 'A', top: 'a2' }] }, null, 2) + '\n';
  const fixture = createRepinFixture(t, { oldEntries: { [destination]: oldText }, newEntries: { [destination]: newText } });
  const entry = addJsonOverlay(fixture, 'list-set', destination, oldText, [
    { op: 'set', path: ['rows'], value: ['a', 'project'] },
    { op: 'set', path: ['name'], value: 'project' },
    { op: 'set', path: ['keep'], value: 'mine' },
    { op: 'setKeyOnItem', path: ['items'], identityKey: 'id', match: { id: 'A' }, key: 'top', value: 'mine' },
  ]);
  // The entry set is rebased onto the new pin, so nothing blocks the re-pin.
  entry.pinnedSha256 = sha256(Buffer.from(newText));
  writeManifest(fixture);

  const stageDir = path.join(fixture.workspace, 'stage');
  const staged = fixture.repin(['--stage', stageDir]);

  assert.equal(staged.code, 0, staged.output);
  assert.match(staged.output, /^RESULT: STAGED$/m);
  const lost = staged.output.split('\n').filter((line) => line.startsWith('upstream-lost '));
  // "b" left the array at the old pin already and "keep" did not move upstream,
  // so neither is a loss this re-pin causes.
  assert.deepEqual(lost, [
    'upstream-lost list-set: set at rows drops "c", which upstream added to .codex/list.json; add it to the set\'s value if it applies',
    'upstream-lost list-set: set at name overwrites the value upstream changed in .codex/list.json; carry the change into the set if it applies',
    'upstream-lost list-set: setKeyOnItem of top on the item matching id=A at items overwrites the value upstream changed in .codex/list.json; carry the change into the operation if it applies',
  ]);
  assert.equal(stageReport(stageDir).upstreamLost.length, 3);
});

test('a re-pin names each upstream file a directory overlay removes after the copy', (t) => {
  const fixture = createRepinFixture(t, {
    oldEntries: { '.skilled/skills/owned/keep.md': 'upstream keep\n', '.skilled/skills/owned/gone.md': 'gone v1\n' },
    newEntries: { '.skilled/skills/owned/sub/f.md': 'upstream addition\n', '.skilled/skills/owned/gone.md': 'gone v2\n' },
  });
  // The checkout lets the first apply tell its own removal of gone.md apart from a hand delete.
  fixture.manifest.pin.checkout = fixture.upstream;
  writeFile(fixture.overlayDir, 'owned/keep.md', 'overlay keep\n');
  fixture.manifest.overlays.push({ id: 'owned-dir', scope: 'directory', source: 'owned', destination: '.skilled/skills/owned' });
  writeManifest(fixture);
  const seeded = fixture.run(['apply']);
  assert.equal(seeded.code, 0, seeded.output);

  const stageDir = path.join(fixture.workspace, 'stage');
  const staged = fixture.repin(['--stage', stageDir]);

  assert.equal(staged.code, 0, staged.output);
  assert.equal(fs.existsSync(path.join(stageDir, '.skilled/skills/owned/sub/f.md')), false);
  assert.deepEqual(staged.output.split('\n').filter((line) => line.startsWith('upstream-lost ')), [
    'upstream-lost owned-dir: the directory overlay removes .skilled/skills/owned/gone.md, which upstream changed; add it to skilled-overlays/owned if it applies',
    'upstream-lost owned-dir: the directory overlay removes .skilled/skills/owned/sub/f.md, which upstream added; add it to skilled-overlays/owned if it applies',
  ]);
  assert.equal(stageReport(stageDir).upstreamLost.length, 2);
});

test('a re-pin notes an insert whose before anchor upstream removed', (t) => {
  const destination = '.codex/anchor.json';
  const oldText = JSON.stringify({ rows: [{ id: 'A' }, { id: 'B' }] }, null, 2) + '\n';
  const newText = JSON.stringify({ rows: [{ id: 'B' }] }, null, 2) + '\n';
  const fixture = createRepinFixture(t, { oldEntries: { [destination]: oldText }, newEntries: { [destination]: newText } });
  const entry = addJsonOverlay(fixture, 'anchor-set', destination, oldText, [
    { op: 'insertItems', path: ['rows'], identityKey: 'id', before: { id: 'A' }, items: [{ id: 'X' }] },
  ]);
  entry.pinnedSha256 = sha256(Buffer.from(newText));
  writeManifest(fixture);

  const stageDir = path.join(fixture.workspace, 'stage');
  const staged = fixture.repin(['--stage', stageDir]);

  assert.equal(staged.code, 0, staged.output);
  assert.match(staged.output, /^NOTE {5}anchor-set: insertItems before "A" at rows finds no such item, so its items go at the end of the array; point before at an item the file holds$/m);
  assert.deepEqual(readJson(path.join(stageDir, destination)).rows, [{ id: 'B' }, { id: 'X' }]);
});

test('a re-pin names each upstream file a skill-root overlay removes from a folder it replaces', (t) => {
  const root = '.skilled/skills/sr';
  const fixture = createRepinFixture(t, {
    oldEntries: {
      [`${root}/SKILL.md`]: 'upstream skill\n',
      [`${root}/docs/a.md`]: 'upstream a\n',
      [`${root}/docs/gone.md`]: 'gone v1\n',
      [`${root}/docs/vendor.md`]: 'vendor v1\n',
    },
    newEntries: {
      [`${root}/docs/new.md`]: 'upstream addition\n',
      [`${root}/docs/gone.md`]: 'gone v2\n',
      [`${root}/docs/vendor.md`]: 'vendor v2\n',
    },
  });
  // The checkout lets the first apply tell its own removal of gone.md apart from a hand delete.
  fixture.manifest.pin.checkout = fixture.upstream;
  writeFile(fixture.overlayDir, 'sr/SKILL.md', 'project skill\n');
  writeFile(fixture.overlayDir, 'sr/docs/a.md', 'project a\n');
  fixture.manifest.overlays.push({
    id: 'sr-root',
    scope: 'skill-root',
    source: 'sr',
    destination: root,
    replace: ['SKILL.md', 'docs'],
    remove: [],
    retained: [{ path: 'docs/vendor.md' }],
  });
  writeManifest(fixture);
  const seeded = fixture.run(['apply']);
  assert.equal(seeded.code, 0, seeded.output);

  const stageDir = path.join(fixture.workspace, 'stage');
  const staged = fixture.repin(['--stage', stageDir]);

  assert.equal(staged.code, 0, staged.output);
  assert.equal(fs.existsSync(path.join(stageDir, root, 'docs/new.md')), false);
  // A retained file is kept as upstream ships it, so its change is not a loss.
  assert.deepEqual(staged.output.split('\n').filter((line) => line.startsWith('upstream-lost ')), [
    'upstream-lost sr-root: the skill-root overlay removes .skilled/skills/sr/docs/gone.md, which upstream changed; add it to skilled-overlays/sr/docs if it applies',
    'upstream-lost sr-root: the skill-root overlay removes .skilled/skills/sr/docs/new.md, which upstream added; add it to skilled-overlays/sr/docs if it applies',
  ]);
  assert.equal(stageReport(stageDir).upstreamLost.length, 2);
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. AN OVERLAY FOLDER BESIDE THE TREE
// ─────────────────────────────────────────────────────────────────────────────

// The setting file can name a folder beside the tree as `../<name>`. Its files
// are outside the tree, so the backup records them against the overlay root, a
// rollback restores them there, and a stage copies the folder beside the copy.

const SIBLING = { siblingOverlayFolder: 'overlays' };
const OVERLAY_STATE_FILES = ['overlay-manifest.json', 'sync-state.json'];

// The overlay folder as the setting file names it, relative to the tree.
function overlayLabel(fixture) {
  return path.relative(fixture.tree, fixture.overlayDir).split(path.sep).join('/');
}

// Where a stage puts the tree copy and the overlay folder copy.
function stagedRoots(fixture, stageDir) {
  const label = overlayLabel(fixture);
  if (label.startsWith('../')) {
    return {
      tree: path.join(stageDir, path.basename(fixture.tree)),
      overlay: path.join(stageDir, path.basename(fixture.overlayDir)),
    };
  }
  return { tree: stageDir, overlay: path.join(stageDir, ...label.split('/')) };
}

function readBytes(root, relativePath) {
  const filePath = path.join(root, relativePath);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath) : null;
}

function onlyRunDir(fixture) {
  const runs = fs.readdirSync(fixture.runsDir);
  assert.equal(runs.length, 1, runs.join('\n'));
  return path.join(fixture.runsDir, runs[0]);
}

test('a live repin with a sibling overlay folder backs up its files against the overlay root', (t) => {
  const fixture = createRepinFixture(t, SIBLING);
  const before = new Map(OVERLAY_STATE_FILES.map((name) => [name, sha256(fs.readFileSync(path.join(fixture.overlayDir, name)))]));

  const result = fixture.repin();
  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /^RESULT: PASSED$/m);

  const runDir = onlyRunDir(fixture);
  const backup = readJson(path.join(runDir, 'backup.json'));
  const overlayEntries = backup.entries.filter((entry) => entry.area === 'overlay');
  for (const name of OVERLAY_STATE_FILES) {
    const entry = overlayEntries.find((candidate) => candidate.path === name);
    assert.ok(entry, name + ' is not an overlay entry: ' + JSON.stringify(backup.entries));
    assert.equal(entry.existed, true, name);
    assert.equal(entry.sha256, before.get(name), name);
    assert.equal(sha256(fs.readFileSync(path.join(runDir, 'overlay-backup', name))), entry.sha256, name);
  }
  for (const entry of overlayEntries) {
    assert.equal(path.posix.isAbsolute(entry.path) || entry.path.split('/').includes('..'), false, entry.path);
  }
  for (const entry of backup.entries.filter((candidate) => candidate.area === undefined)) {
    assert.equal(entry.path.startsWith('../'), false, entry.path);
  }
  assert.equal(readJson(fixture.manifestPath).pin.commit, fixture.newCommit.slice(0, 10));
  assert.equal(readJson(fixture.statePath).pin, fixture.newCommit.slice(0, 10));
  assert.equal(fixture.run(['status']).code, 0);
});

test('an in-tree backup records no area, so every entry is a tree path', (t) => {
  const fixture = createRepinFixture(t);
  const before = fixture.digest();

  const result = fixture.repin();
  assert.equal(result.code, 0, result.output);
  const runDir = onlyRunDir(fixture);
  const backup = readJson(path.join(runDir, 'backup.json'));
  assert.ok(backup.entries.length > 0);
  for (const entry of backup.entries) assert.equal(Object.hasOwn(entry, 'area'), false, JSON.stringify(entry));
  assert.ok(backup.entries.some((entry) => entry.path === 'skilled-overlays/overlay-manifest.json'));
  assert.equal(fs.existsSync(path.join(runDir, 'overlay-backup')), false);

  const rolledBack = fixture.run(['repin', '--rollback', path.basename(runDir)]);
  assert.equal(rolledBack.code, 0, rolledBack.output);
  assert.equal(fixture.digest(), before);
});

test('--rollback of a sibling-folder run restores the manifest pin and sync-state.json in the overlay folder', (t) => {
  const fixture = createRepinFixture(t, SIBLING);
  const treeBefore = fixture.digest();
  const bytesBefore = new Map(OVERLAY_STATE_FILES.map((name) => [name, readBytes(fixture.overlayDir, name)]));

  const result = fixture.repin();
  assert.equal(result.code, 0, result.output);
  const runId = path.basename(onlyRunDir(fixture));
  assert.notEqual(readJson(fixture.manifestPath).pin.commit, fixture.oldCommit.slice(0, 10));

  const rolledBack = fixture.run(['repin', '--rollback', runId]);
  assert.equal(rolledBack.code, 0, rolledBack.output);
  assert.match(rolledBack.output, /^RESULT: PASSED$/m);
  assert.equal(fixture.digest(), treeBefore);
  for (const name of OVERLAY_STATE_FILES) {
    assert.deepEqual(readBytes(fixture.overlayDir, name), bytesBefore.get(name), name);
  }
  assert.equal(readJson(fixture.manifestPath).pin.commit, fixture.oldCommit.slice(0, 10));
  assert.equal(fs.existsSync(fixture.lockPath), false);
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
});

test('repin --stage with a sibling overlay folder stages both folders and writes nothing in the live overlay folder', (t) => {
  const fixture = createRepinFixture(t, SIBLING);
  const stageDir = path.join(fixture.workspace, 'stage');
  const treeBefore = treeDigest(fixture.tree);
  const overlayBefore = treeDigest(fixture.overlayDir);
  const bytesBefore = new Map(OVERLAY_STATE_FILES.map((name) => [name, readBytes(fixture.overlayDir, name)]));
  assert.equal(fs.existsSync(fixture.runsDir), false);

  const staged = fixture.repin(['--stage', stageDir]);
  assert.equal(staged.code, 0, staged.output);
  assert.match(staged.output, /^RESULT: STAGED$/m);

  const roots = stagedRoots(fixture, stageDir);
  assert.equal(read(roots.tree, '.skilled/skills/hub/ROUTER.md'), 'router v2\n');
  assert.equal(readJson(path.join(roots.overlay, 'overlay-manifest.json')).pin.commit, fixture.newCommit.slice(0, 10));

  assert.equal(treeDigest(fixture.tree), treeBefore);
  for (const name of OVERLAY_STATE_FILES) {
    assert.deepEqual(readBytes(fixture.overlayDir, name), bytesBefore.get(name), name);
  }
  assert.equal(fs.existsSync(fixture.runsDir), false);
  assert.equal(treeDigest(fixture.overlayDir), overlayBefore);
});

// The path a stage names for the staged tree is what a later status takes as
// --root, so it has to be the folder holding the staged setting file.
function stagedTreeLine(output) {
  const match = /^staged tree root: (.+)$/m.exec(output);
  return match ? match[1] : null;
}

// A staged copy has no project install, so its generated checks can still miss.
// What matters here is that status found the staged manifest and judged every
// overlay against it.
function assertStatusReadsStage(root, cwd) {
  const result = runEngine(['status', '--root', root], cwd);
  assert.doesNotMatch(result.output, /no overlay manifest/, result.output);
  assert.match(result.output, /^in-sync=\d+ /m, result.output);
  assert.notEqual(result.code, 2, result.output);
}

test('repin --stage with a sibling overlay folder names a staged tree root that status reads', (t) => {
  const fixture = createRepinFixture(t, SIBLING);
  const stageDir = path.join(fixture.workspace, 'stage');
  const staged = fixture.repin(['--stage', stageDir]);
  assert.equal(staged.code, 0, staged.output);
  const roots = stagedRoots(fixture, stageDir);
  assert.ok(staged.output.includes('staged a copy of the tree in ' + stageDir), staged.output);
  const printed = stagedTreeLine(staged.output);
  assert.equal(printed, roots.tree, staged.output);
  assertStatusReadsStage(printed, fixture.workspace);

  const jsonStage = path.join(fixture.workspace, 'stage-json');
  const jsonRun = fixture.repin(['--stage', jsonStage, '--json']);
  assert.equal(jsonRun.code, 0, jsonRun.output);
  const report = JSON.parse(jsonRun.stdout);
  assert.equal(report.stage, jsonStage);
  assert.equal(report.stagedRoot, stagedRoots(fixture, jsonStage).tree);
  assertStatusReadsStage(report.stagedRoot, fixture.workspace);
});

test('repin --stage with an in-tree overlay folder reports the stage folder as the staged tree root', (t) => {
  const fixture = createRepinFixture(t);
  const stageDir = path.join(fixture.workspace, 'stage');
  const staged = fixture.repin(['--stage', stageDir]);
  assert.equal(staged.code, 0, staged.output);
  assert.equal(stagedTreeLine(staged.output), null, staged.output);
  assertStatusReadsStage(stageDir, fixture.workspace);

  const jsonStage = path.join(fixture.workspace, 'stage-json');
  const report = JSON.parse(fixture.repin(['--stage', jsonStage, '--json']).stdout);
  assert.equal(report.stage, jsonStage);
  assert.equal(report.stagedRoot, report.stage);
});

test('repin --stage refuses a stage folder inside the live sibling overlay folder', (t) => {
  const fixture = createRepinFixture(t, SIBLING);
  const stageDir = path.join(fixture.overlayDir, 'stage');
  const treeBefore = treeDigest(fixture.tree);
  const overlayBefore = treeDigest(fixture.overlayDir);

  const refused = fixture.repin(['--stage', stageDir]);
  assert.equal(refused.code, 2, refused.output);
  assert.match(refused.output, /^refuse:/m);
  assert.equal(fs.existsSync(stageDir), false);
  assert.equal(treeDigest(fixture.overlayDir), overlayBefore);
  assert.equal(treeDigest(fixture.tree), treeBefore);
});

test('a layout link reaching into the sibling overlay folder passes live, and its staged copy resolves into the staged overlay folder', (t) => {
  const fixture = createRepinFixture(t, SIBLING);
  const linkPath = '.skilled/changelog/x';
  writeFile(fixture.overlayDir, 'changelog/v1.md', 'overlay changelog\n');
  const target = path.relative(
    path.dirname(path.join(fixture.tree, linkPath)),
    path.join(fixture.overlayDir, 'changelog'),
  ).split(path.sep).join('/');
  fixture.manifest.layoutLinks.push({ path: linkPath, target });
  writeManifest(fixture);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(fs.readlinkSync(path.join(fixture.tree, linkPath)), target);
  assert.equal(read(fixture.tree, linkPath + '/v1.md'), 'overlay changelog\n');
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);

  const stageDir = path.join(fixture.workspace, 'stage');
  const staged = fixture.repin(['--stage', stageDir]);
  assert.equal(staged.code, 0, staged.output);
  const roots = stagedRoots(fixture, stageDir);
  const resolved = fs.realpathSync(path.join(roots.tree, linkPath));
  const stagedOverlay = fs.realpathSync(roots.overlay);
  const liveOverlay = fs.realpathSync(fixture.overlayDir);
  assert.ok(resolved.startsWith(stagedOverlay + path.sep), resolved);
  assert.equal(resolved === liveOverlay || resolved.startsWith(liveOverlay + path.sep), false, resolved);
});

test('a re-pin line names a sibling overlay folder as the setting file gives it', (t) => {
  const fixture = createRepinFixture(t, SIBLING);
  fixture.manifest.regenerate.push({
    id: 'rewrites-owned',
    argv: ['node', '-e', "const fs = require('fs'); if (fs.existsSync('.skilled/skills/hub/added.md')) " +
      "fs.writeFileSync('.skilled/skills/hub/SKILL.md', 'regenerated skill\\n')"],
  });
  writeManifest(fixture);
  assert.equal(fixture.run(['apply']).code, 0);

  const failed = fixture.repin();
  assert.equal(failed.code, 1, failed.output);
  const label = overlayLabel(fixture);
  assert.ok(failed.output.includes(`(overlay: ${label}/files/SKILL.md)`), failed.output);
});

// A backup.json edited after a sibling run must not steer a rollback out of the
// overlay folder or into an area the engine never wrote.
const SIBLING_TAMPERED_ENTRIES = [
  ['an overlay entry reaching into the tree', (entry) => ({ ...entry, path: '../tree/x' })],
  ['an overlay entry climbing out through a folder', (entry) => ({ ...entry, path: 'a/../../x' })],
  ['an entry naming an unknown area', (entry) => ({ ...entry, area: 'elsewhere' })],
];

for (const [label, tamper] of SIBLING_TAMPERED_ENTRIES) {
  test(`--rollback of a sibling-folder run refuses ${label} and changes nothing`, (t) => {
    const fixture = createRepinFixture(t, SIBLING);
    const result = fixture.repin();
    assert.equal(result.code, 0, result.output);
    const runDir = onlyRunDir(fixture);
    const backupPath = path.join(runDir, 'backup.json');
    const backup = readJson(backupPath);
    const index = backup.entries.findIndex((entry) => entry.area === 'overlay');
    assert.ok(index >= 0, JSON.stringify(backup.entries));
    backup.entries[index] = tamper(backup.entries[index]);
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2) + '\n');
    const treeBefore = treeDigest(fixture.tree);
    const overlayBefore = treeDigest(fixture.overlayDir);

    const rolledBack = fixture.run(['repin', '--rollback', path.basename(runDir)]);
    assert.equal(rolledBack.code, 2, rolledBack.output);
    assert.equal(treeDigest(fixture.tree), treeBefore);
    assert.equal(treeDigest(fixture.overlayDir), overlayBefore);
  });
}

test('repin --stage with a sibling overlay folder refuses the workspace holding both folders', (t) => {
  const fixture = createRepinFixture(t, SIBLING);
  const treeBefore = treeDigest(fixture.tree);
  const overlayBefore = treeDigest(fixture.overlayDir);

  const refused = fixture.repin(['--stage', fixture.workspace]);
  assert.equal(refused.code, 2, refused.output);
  assert.match(refused.output, /^refuse:/m);
  assert.equal(treeDigest(fixture.tree), treeBefore);
  assert.equal(treeDigest(fixture.overlayDir), overlayBefore);
});
