// ───────────────────────────────────────────────────────────────────
// MODULE: Overlay Engine Behavior Fix Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Behaviors the engine adds over the two scripts it merges: one overlay-folder
// setting, one accepted-hash state for apply and check, retained paths that the
// overlay writes treated as outputs, an owned lock, ordered json-entry
// operations, the exact-path rule for protected names, and a guard that never
// writes.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const {
  ENGINE,
  createSyncFixture,
  createWorkspace,
  readJson,
  runEngine,
  sha256,
  writeFile,
  writeManifest,
} = require('./overlay-engine-fixtures.cjs');

const engine = require('../overlay-engine.cjs');

function seed(fixture) {
  const result = fixture.run(['apply']);
  assert.equal(result.code, 0, result.output);
  return result;
}

function treeDigest(root) {
  const rows = [];
  const walk = (dir) => {
    for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
      const absolute = path.join(dir, dirent.name);
      const rel = path.relative(root, absolute);
      if (dirent.isSymbolicLink()) rows.push(rel + ' -> ' + fs.readlinkSync(absolute));
      else if (dirent.isDirectory()) walk(absolute);
      else rows.push(rel + ' ' + sha256(fs.readFileSync(absolute)));
    }
  };
  walk(root);
  return rows.sort().join('\n');
}

function quietly(run) {
  const original = console.log;
  const lines = [];
  console.log = (...args) => lines.push(args.join(' '));
  try {
    return { code: run(), lines };
  } finally {
    console.log = original;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. OVERLAY FOLDER SETTING
// ─────────────────────────────────────────────────────────────────────────────

test('the overlay folder defaults to skilled-overlays when the tree has no setting file', (t) => {
  const fixture = createSyncFixture(t);
  assert.equal(engine.resolveOverlayDir(fixture.tree), 'skilled-overlays');
  const ctx = engine.createContext(fixture.tree);
  assert.equal(ctx.manifestPath, path.join(fixture.tree, 'skilled-overlays', 'overlay-manifest.json'));
  assert.equal(ctx.statePath, path.join(fixture.tree, 'skilled-overlays', 'sync-state.json'));
  assert.equal(ctx.lockPath, path.join(fixture.tree, 'skilled-overlays', '.build-lock'));
  seed(fixture);
  assert.ok(fs.existsSync(fixture.statePath));
});

test('the setting file names the overlay folder, and manifest, sources and state resolve inside it', (t) => {
  const fixture = createWorkspace(t, 'overlay-engine-setting-', { overlayFolder: 'barter-overlays' });
  writeFile(fixture.overlayDir, 'files/own.txt', 'own copy\n');
  writeFile(fixture.tree, 'own.txt', 'upstream copy\n');
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    layoutLinks: [],
    overlays: [{ id: 'own', scope: 'file', source: 'files/own.txt', destination: 'own.txt' }],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  assert.equal(engine.resolveOverlayDir(fixture.tree), 'barter-overlays');

  const applied = runEngine(['apply', '--root', fixture.tree], fixture.workspace);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'own.txt'), 'utf8'), 'own copy\n');
  assert.ok(fs.existsSync(path.join(fixture.tree, 'barter-overlays', 'sync-state.json')));
  assert.equal(fs.existsSync(path.join(fixture.tree, 'skilled-overlays')), false);
  const guarded = runEngine(['--guard', 'own.txt', '--root', fixture.tree], fixture.tree);
  assert.match(guarded.output, /owned by barter-overlays\/files\/own\.txt/);
});

test('the setting file is refused when it names an absolute path or a folder outside the tree', (t) => {
  const fixture = createSyncFixture(t);
  for (const value of ['/etc', '../outside', 'a/../../outside', '.', 'C:\\overlays']) {
    writeFile(fixture.tree, '.skilled-overlays.json', JSON.stringify({ overlayDir: value }));
    assert.throws(() => engine.resolveOverlayDir(fixture.tree), /\.skilled-overlays\.json/, value);
    const status = fixture.run(['status']);
    assert.equal(status.code, 2, value + ': ' + status.output);
    assert.match(status.output, /\.skilled-overlays\.json/);
  }
});

test('only the setting reader in the engine mentions the overlayDir key', () => {
  const lines = fs.readFileSync(ENGINE, 'utf8').split('\n');
  const start = lines.findIndex((line) => line.startsWith('function resolveOverlayDir('));
  const end = lines.findIndex((line, index) => index > start && line === '}');
  assert.ok(start >= 0 && end > start);
  const hits = lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => /overlayDir/.test(line));
  assert.ok(hits.length > 0);
  for (const { line, index } of hits) {
    assert.ok(index > start && index < end, `overlayDir read outside resolveOverlayDir at line ${index + 1}: ${line}`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. ONE ACCEPTED-HASH STATE FOR APPLY AND CHECK
// ─────────────────────────────────────────────────────────────────────────────

test('a re-pinned overlay whose source changed applies over its last applied copy with no restore step', (t) => {
  const fixture = createSyncFixture(t);
  seed(fixture);
  // The re-pin moves the pin and the upstream hash of the guarded file, while
  // the tree still holds the last copy this overlay applied, and the overlay
  // source itself changed in the same re-pin.
  fixture.manifest.pin.commit = 'pin-two';
  fixture.manifest.overlays[0].pinnedSha256 = sha256(Buffer.from('pinned file v2\n'));
  writeManifest(fixture);
  writeFile(fixture.overlayDir, 'files/guarded.txt', 'overlay two\n');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'guarded.txt'), 'utf8'), 'overlay one\n');

  const before = fixture.run(['status']);
  assert.equal(before.code, 1, before.output);
  assert.match(before.output, /overlay-edited guarded\.txt/);
  assert.doesNotMatch(before.output, /rebase the overlay/);
  assert.doesNotMatch(before.output, /MISS\s+guarded-file: upstream changed/);
  assert.match(before.output, /MISS\s+guarded-file: 1 path\(s\) out of sync \(guarded\.txt\)/);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'guarded.txt'), 'utf8'), 'overlay two\n');

  const after = fixture.run(['status']);
  assert.equal(after.code, 0, after.output);
  assert.match(after.output, /RESULT: PASSED/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. RETAINED PATHS THE OVERLAY ALSO WRITES
// ─────────────────────────────────────────────────────────────────────────────

test('a retained path that the overlay also replaces is reported, guarded and capturable', (t) => {
  const fixture = createSyncFixture(t);
  const skillRoot = fixture.manifest.overlays.find((entry) => entry.id === 'skill-root');
  skillRoot.retained.push({ path: 'SKILL.md' });
  writeManifest(fixture);
  seed(fixture);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'skill/SKILL.md'), 'utf8'), 'overlay skill\n');

  writeFile(fixture.overlayDir, 'skill-root-source/SKILL.md', 'overlay skill two\n');
  const status = fixture.run(['status']);
  assert.equal(status.code, 1, status.output);
  assert.match(status.output, /overlay-edited skill\/SKILL\.md {2}\(overlay: skilled-overlays\/skill-root-source\/SKILL\.md\)/);

  const guarded = fixture.run(['--guard', 'skill/SKILL.md'], fixture.tree);
  assert.equal(guarded.code, 1, guarded.output);
  assert.match(guarded.output, /refuse: skill\/SKILL\.md is owned by skilled-overlays\/skill-root-source\/SKILL\.md/);
  // A retained path inside a replaced folder is still the vendor's own file.
  assert.equal(fixture.run(['--guard', 'skill/docs/vendor-guide.md'], fixture.tree).code, 0);
  assert.equal(fixture.run(['--guard', 'skill/vendor.md'], fixture.tree).code, 0);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'skill/SKILL.md'), 'utf8'), 'overlay skill two\n');
  assert.equal(fixture.run(['status']).code, 0);

  writeFile(fixture.tree, 'skill/SKILL.md', 'live skill edit\n');
  assert.match(fixture.run(['status']).output, /live-edited skill\/SKILL\.md/);
  const captured = fixture.run(['apply', '--capture', 'skill/SKILL.md']);
  assert.equal(captured.code, 0, captured.output);
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'skill-root-source/SKILL.md'), 'utf8'), 'live skill edit\n');
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. THE ENGINE'S OWN LOCK
// ─────────────────────────────────────────────────────────────────────────────

const FOREIGN_LOCK = 'orchestrator repin pid=4242 2026-11-06T08:00:00Z\n';

test('apply refuses while the lock is held, naming the owner line and the lock file, and writes nothing', (t) => {
  const fixture = createSyncFixture(t);
  seed(fixture);
  writeFile(fixture.overlayDir, 'files/guarded.txt', 'overlay two\n');
  fs.writeFileSync(fixture.lockPath, FOREIGN_LOCK);
  const before = treeDigest(fixture.tree);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 2, applied.output);
  assert.match(applied.output, /orchestrator repin pid=4242 2026-11-06T08:00:00Z/);
  assert.ok(applied.output.includes(fixture.lockPath), applied.output);
  assert.equal(treeDigest(fixture.tree), before);
  assert.equal(fs.readFileSync(fixture.lockPath, 'utf8'), FOREIGN_LOCK);
});

test('capture refuses while the lock is held', (t) => {
  const fixture = createSyncFixture(t);
  seed(fixture);
  writeFile(fixture.tree, 'directory-live/readme.md', 'hand edit\n');
  fs.writeFileSync(fixture.lockPath, FOREIGN_LOCK);

  const captured = fixture.run(['apply', '--capture', 'directory-live/readme.md']);
  assert.equal(captured.code, 2, captured.output);
  assert.match(captured.output, /orchestrator repin pid=4242/);
  assert.ok(captured.output.includes(fixture.lockPath), captured.output);
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'directory-source/readme.md'), 'utf8'), 'directory one\n');
  assert.equal(fs.readFileSync(fixture.lockPath, 'utf8'), FOREIGN_LOCK);
});

test('apply holds the lock while it runs and removes it when done, also after a failed step', (t) => {
  const fixture = createSyncFixture(t);
  const probe = 'const fs = require("fs"); const lock = "skilled-overlays/.build-lock";' +
    'fs.writeFileSync("lock-seen.txt", fs.existsSync(lock) ? fs.readFileSync(lock, "utf8") : "no lock");';
  fixture.manifest.regenerate = [{ id: 'probe', argv: ['node', '-e', probe] }];
  writeManifest(fixture);
  seed(fixture);
  assert.match(fs.readFileSync(path.join(fixture.tree, 'lock-seen.txt'), 'utf8'), /^overlay-engine apply pid=\d+ \d{4}-\d\d-\d\dT/);
  assert.equal(fs.existsSync(fixture.lockPath), false);

  fixture.manifest.regenerate = [{ id: 'fails', argv: ['node', '-e', 'process.exit(3)'] }];
  writeManifest(fixture);
  writeFile(fixture.overlayDir, 'files/guarded.txt', 'overlay two\n');
  const failed = fixture.run(['apply']);
  assert.equal(failed.code, 1, failed.output);
  assert.match(failed.output, /regen fails: FAILED exit=3/);
  assert.equal(fs.existsSync(fixture.lockPath), false);
});

test('a caller that already holds the lock can run apply inside it without releasing it', (t) => {
  const fixture = createSyncFixture(t);
  const ctx = engine.createContext(fixture.tree);
  const lock = engine.acquireLock(ctx, 'test multi-step');
  assert.equal(lock.isHeld, true);
  try {
    const insideRun = quietly(() => engine.commandApply(ctx, { lock }));
    assert.equal(insideRun.code, 0, insideRun.lines.join('\n'));
    assert.match(fs.readFileSync(ctx.lockPath, 'utf8'), /^test multi-step pid=/);
    const other = quietly(() => engine.commandApply(ctx));
    assert.equal(other.code, 2);
    assert.match(other.lines.join('\n'), /test multi-step pid=/);
  } finally {
    lock.release();
  }
  assert.equal(fs.existsSync(ctx.lockPath), false);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. ORDERED JSON-ENTRY OPERATIONS
// ─────────────────────────────────────────────────────────────────────────────

test('a setKeyOnItem on an item the same entry set inserts applies in order', (t) => {
  const fixture = createSyncFixture(t);
  const listSeed = '{\n  "items": [\n    {\n      "id": "a"\n    }\n  ]\n}\n';
  writeFile(fixture.tree, 'list.json', listSeed);
  writeFile(fixture.overlayDir, 'json/list.json', JSON.stringify({
    target: 'list.json',
    style: { indent: 2, primitiveArrays: 'inline' },
    operations: [
      { op: 'insertItems', path: ['items'], identityKey: 'id', items: [{ id: 'b' }] },
      { op: 'setKeyOnItem', path: ['items'], identityKey: 'id', match: { id: 'b' }, key: 'enabled', value: true },
    ],
  }, null, 2) + '\n');
  fixture.manifest.overlays.push({
    id: 'ordered-list',
    scope: 'json-entry',
    source: 'json/list.json',
    destination: 'list.json',
    pinnedSha256: sha256(Buffer.from(listSeed)),
  });
  writeManifest(fixture);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.deepEqual(readJson(path.join(fixture.tree, 'list.json')), { items: [{ id: 'a' }, { id: 'b', enabled: true }] });
  assert.equal(fixture.run(['apply']).output.trim(), '0 changed');
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. PROTECTED NAMES PASS ONLY BY EXACT MANIFEST PATH
// ─────────────────────────────────────────────────────────────────────────────

test('an exact file entry for a token-named destination applies', (t) => {
  const fixture = createSyncFixture(t);
  writeFile(fixture.overlayDir, 'files/tokens.css', ':root { --gap: 4px; }\n');
  writeFile(fixture.overlayDir, 'files/design-tokens.json', '{"gap": 4}\n');
  fixture.manifest.overlays.push(
    { id: 'tokens-css', scope: 'file', source: 'files/tokens.css', destination: 'assets/tokens.css' },
    { id: 'tokens-json', scope: 'file', source: 'files/design-tokens.json', destination: 'assets/design-tokens.json' },
  );
  writeManifest(fixture);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'assets/tokens.css'), 'utf8'), ':root { --gap: 4px; }\n');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'assets/design-tokens.json'), 'utf8'), '{"gap": 4}\n');
  assert.equal(fixture.run(['status']).code, 0);

  writeFile(fixture.tree, 'assets/design-tokens.json', '{"gap": 8}\n');
  const captured = fixture.run(['apply', '--capture', 'assets/design-tokens.json']);
  assert.equal(captured.code, 0, captured.output);
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'files/design-tokens.json'), 'utf8'), '{"gap": 8}\n');
});

test('a token-named file met while walking a directory or skill-root entry blocks only its own entry', (t) => {
  for (const [label, relativePath, hint] of [
    ['directory', 'directory-live/tokens.css', 'add "tokens.css" to this entry\'s protectedPaths'],
    ['skill-root', 'skill/docs/tokens.css', 'add "docs/tokens.css" to this entry\'s protectedPaths'],
  ]) {
    const fixture = createSyncFixture(t);
    seed(fixture);
    writeFile(fixture.overlayDir, 'files/guarded.txt', 'overlay two\n');
    writeFile(fixture.tree, relativePath, ':root {}\n');
    const before = treeDigest(fixture.tree);
    const status = fixture.run(['status']);
    assert.equal(status.code, 1, label + ': ' + status.output);
    assert.match(status.output, /^MISS +\S+: refusing to inspect a protected path/m, label);
    assert.ok(status.output.includes(hint), label + ': ' + status.output);
    // The refusal no longer hides the rest of the report.
    assert.match(status.output, /overlay-edited guarded\.txt/, label);
    assert.match(status.output, /^RESULT: FAILED$/m, label);
    const applied = fixture.run(['apply']);
    assert.equal(applied.code, 1, label + ': ' + applied.output);
    assert.match(applied.output, /^BLOCKED +\S+: refusing to inspect a protected path/m, label);
    assert.equal(treeDigest(fixture.tree), before, label + ': apply wrote while an entry was refused');
  }
  const fixture = createSyncFixture(t);
  seed(fixture);
  const captured = fixture.run(['apply', '--capture', 'directory-live/access-token.txt']);
  assert.equal(captured.code, 2, captured.output);
  assert.match(captured.output, /protected capture path/);
});

test('a walked token-named file passes only when its entry lists the exact path in protectedPaths', (t) => {
  const fixture = createSyncFixture(t);
  writeFile(fixture.overlayDir, 'directory-source/assets/tokens.css', ':root { --gap: 4px; }\n');
  writeFile(fixture.overlayDir, 'directory-source/references/design-tokens.md', '# Tokens\n');
  const directoryEntry = fixture.manifest.overlays.find((entry) => entry.id === 'directory-files');
  directoryEntry.protectedPaths = ['assets/tokens.css', 'references/design-tokens.md'];
  writeManifest(fixture);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'directory-live/assets/tokens.css'), 'utf8'), ':root { --gap: 4px; }\n');
  assert.equal(fixture.run(['status']).code, 0);

  writeFile(fixture.tree, 'directory-live/assets/tokens.css', ':root { --gap: 8px; }\n');
  const captured = fixture.run(['apply', '--capture', 'directory-live/assets/tokens.css']);
  assert.equal(captured.code, 0, captured.output);
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'directory-source/assets/tokens.css'), 'utf8'), ':root { --gap: 8px; }\n');

  writeFile(fixture.tree, 'directory-live/access-token.txt', 'secret\n');
  const unlisted = fixture.run(['status']);
  assert.equal(unlisted.code, 1, unlisted.output);
  assert.match(unlisted.output, /refusing to inspect a protected path: directory-live\/access-token\.txt; if the overlay owns it, add "access-token\.txt"/);
});

test('a protectedPaths value that escapes its entry or names a .env file is refused', (t) => {
  for (const value of ['../guarded.txt', '/tmp/tokens.css', 'assets/.env.local']) {
    const fixture = createSyncFixture(t);
    fixture.manifest.overlays.find((entry) => entry.id === 'directory-files').protectedPaths = [value];
    writeManifest(fixture);
    const status = fixture.run(['status']);
    assert.equal(status.code, 2, value + ': ' + status.output);
    assert.match(status.output, /protectedPaths/, value);
  }
});

test('a .env file is refused even when a manifest entry names it exactly', (t) => {
  const fixture = createSyncFixture(t);
  writeFile(fixture.overlayDir, 'files/.env.local', 'SECRET=1\n');
  fixture.manifest.overlays.push({ id: 'env', scope: 'file', source: 'files/.env.local', destination: '.env.local' });
  writeManifest(fixture);
  const status = fixture.run(['status']);
  assert.equal(status.code, 1, status.output);
  assert.match(status.output, /^MISS +env: refusing to inspect a protected path: files\/\.env\.local; a \.env file is never read/m);
  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 1, applied.output);
  assert.equal(fs.existsSync(path.join(fixture.tree, '.env.local')), false);
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. THE GUARD NEVER WRITES
// ─────────────────────────────────────────────────────────────────────────────

test('the guard answers on an out-of-sync tree without applying anything', (t) => {
  const fixture = createSyncFixture(t);
  seed(fixture);
  writeFile(fixture.overlayDir, 'files/guarded.txt', 'overlay two\n');
  const before = treeDigest(fixture.tree);

  for (const target of ['guarded.txt', 'directory-live/readme.md', 'skill/SKILL.md', 'unowned.txt']) {
    const answer = fixture.run(['--guard', target], fixture.tree);
    assert.ok([0, 1].includes(answer.code), target + ': ' + answer.output);
  }
  assert.equal(treeDigest(fixture.tree), before);
  assert.match(fixture.run(['status']).output, /overlay-edited guarded\.txt/);
});
