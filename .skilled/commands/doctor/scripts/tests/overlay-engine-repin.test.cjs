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
const FOREIGN_LOCK = 'orchestrator repin pid=4242 2026-11-06T08:00:00Z\n';

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
 * @param {{movesOwned?: boolean}} [options] Whether upstream also changes owned files.
 * @returns {object} Fixture paths, commits and a `run` helper.
 */
function createRepinFixture(t, options = {}) {
  const fixture = createWorkspace(t, 'overlay-engine-repin-');
  const { workspace, tree, overlayDir } = fixture;
  const upstream = path.join(workspace, 'upstream');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  writeEntries(upstream, OLD_ENTRIES);
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
  assert.match(staged.output, /^RESULT: STAGED$/m);
  assert.doesNotMatch(staged.output, /^rollback:/m);

  assert.equal(treeDigest(fixture.tree), before);
  assert.equal(read(stageDir, '.skilled/skills/hub/ROUTER.md'), 'router v2\n');
  assert.equal(readJson(path.join(stageDir, 'skilled-overlays/overlay-manifest.json')).pin.commit, fixture.newCommit.slice(0, 10));
  // The stage skips the regenerate and verify steps.
  assert.equal(read(stageDir, '.codex/hooks.json'), '{}\n');
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
