// ───────────────────────────────────────────────────────────────────
// MODULE: Overlay Engine Lock Takeover Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// A run that is killed leaves its lock file behind, and every later run then
// refuses until someone deletes the file by hand. The engine clears such a lock
// only when it can show that the writer has ended, so each case here writes an
// owner line by hand and checks what `apply` makes of it. A line written before
// the engine recorded the host still names a process on the machine that ran
// it, and a takeover runs behind a marker file so two runs cannot both remove
// the same leftover.
//
// The last cases cover the array items an overlay appends: an entry dropped from
// the entry set has to leave the live file, while an item that changed after it
// was applied is refused instead of deleted, and one upstream ships itself at the
// pin stays in place with only its record dropped. One case then covers a root file an
// overlay owns: upstream's copy of it is what `pinnedSha256` records, and
// `status` has to say when that copy has moved on. The final cases audit the
// vendored tree against the pin for the files no overlay owns, which is drift a
// strict write check never sees.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
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

const engine = require('../overlay-engine.cjs');

const HOST = os.hostname();
const NOTE_PREFIX = 'note: took over the overlay lock of a run that has ended: ';
const REFUSAL = 'refuse: the overlay lock is held';
const UPSTREAM_AGENTS = 'upstream agents\n';
const OVERLAY_AGENTS = 'project agents\n';

// ─────────────────────────────────────────────────────────────────────────────
// 1. FIXTURE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a tree with one file overlay, so a run has real work to do.
 * @param {object} t The node:test context.
 * @returns {object} Fixture paths, its manifest and a `run` helper.
 */
function createLockFixture(t) {
  const fixture = createWorkspace(t, 'overlay-engine-lock-');
  writeFile(fixture.overlayDir, 'files/AGENTS.md', OVERLAY_AGENTS);
  writeFile(fixture.tree, 'AGENTS.md', UPSTREAM_AGENTS);
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    layoutLinks: [],
    overlays: [{
      id: 'agents-file',
      scope: 'file',
      source: 'files/AGENTS.md',
      destination: 'AGENTS.md',
      pinnedSha256: sha256(Buffer.from(UPSTREAM_AGENTS)),
    }],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);
  return fixture;
}

/**
 * Put an owner line into the fixture's lock file.
 * @param {object} fixture Fixture from createLockFixture.
 * @param {string} line Owner line, without its newline.
 * @returns {string} The bytes written, for a later comparison.
 */
function writeLock(fixture, line) {
  const bytes = line + '\n';
  fs.writeFileSync(fixture.lockPath, bytes);
  return bytes;
}

function ownerLine(pid, host) {
  return `overlay-engine apply pid=${pid} host=${host} 2026-01-01T00:00:00.000Z`;
}

/**
 * Run a child that has already exited, and return its process id.
 * @returns {number} A pid the kernel no longer answers for.
 */
function deadPid() {
  const finished = spawnSync(process.execPath, ['-e', '']);
  assert.equal(finished.status, 0);
  return finished.pid;
}

function noteLines(output) {
  return output.split('\n').filter((line) => line.startsWith(NOTE_PREFIX));
}

/**
 * Call a function with its console output captured, so a note line taken by a
 * run inside this process stays out of the test report.
 * @param {function} run Function to call.
 * @returns {{result: *, lines: string[]}} What it returned and what it printed.
 */
function quietly(run) {
  const lines = [];
  const realLog = console.log;
  console.log = (...args) => lines.push(args.join(' '));
  try {
    return { result: run(), lines };
  } finally {
    console.log = realLog;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. TAKING OVER A LOCK
// ─────────────────────────────────────────────────────────────────────────────

test('apply takes over a lock naming a dead pid on this host and clears the file', (t) => {
  const fixture = createLockFixture(t);
  const stale = writeLock(fixture, ownerLine(deadPid(), HOST));

  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.deepEqual(noteLines(applied.output), [NOTE_PREFIX + stale.trim()], applied.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'AGENTS.md'), 'utf8'), OVERLAY_AGENTS);
  assert.equal(fs.existsSync(fixture.lockPath), false);
});

test('apply takes over a lock line written before the engine recorded the host', (t) => {
  const fixture = createLockFixture(t);
  const stale = writeLock(fixture, `overlay-engine apply pid=${deadPid()} 2026-01-01T00:00:00.000Z`);

  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.deepEqual(noteLines(applied.output), [NOTE_PREFIX + stale.trim()], applied.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'AGENTS.md'), 'utf8'), OVERLAY_AGENTS);
  assert.equal(fs.existsSync(fixture.lockPath), false);
});

test('apply refuses while another run is taking the lock over, and clears a marker a killed run left', (t) => {
  const fixture = createLockFixture(t);
  const stale = writeLock(fixture, ownerLine(deadPid(), HOST));
  const takeoverPath = fixture.lockPath + '.takeover';
  fs.writeFileSync(takeoverPath, '');

  const blocked = fixture.run(['apply']);

  assert.equal(blocked.code, 2, blocked.output);
  assert.ok(blocked.output.includes(takeoverPath), blocked.output);
  assert.deepEqual(noteLines(blocked.output), [], blocked.output);
  assert.equal(fs.readFileSync(fixture.lockPath, 'utf8'), stale);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'AGENTS.md'), 'utf8'), UPSTREAM_AGENTS);

  // No live run can still be inside a marker this old, so it is cleared and the
  // takeover goes ahead instead of the lock blocking every later run for good.
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  fs.utimesSync(takeoverPath, fiveMinutesAgo, fiveMinutesAgo);
  const retried = fixture.run(['apply']);

  assert.equal(retried.code, 0, retried.output);
  assert.deepEqual(noteLines(retried.output), [NOTE_PREFIX + stale.trim()], retried.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'AGENTS.md'), 'utf8'), OVERLAY_AGENTS);
  assert.equal(fs.existsSync(takeoverPath), false);
});

test('a takeover refuses when another run replaces the stale lock in the gap before the removal', (t) => {
  const fixture = createLockFixture(t);
  writeLock(fixture, ownerLine(deadPid(), HOST));
  const takeoverPath = fixture.lockPath + '.takeover';
  const competing = ownerLine(process.pid, HOST) + '\n';
  const ctx = engine.createContext(fixture.tree);
  const realOpenSync = fs.openSync;
  let isInterleaved = false;
  // The other run removes the leftover and writes its own lock in the gap
  // between this run's read and its removal. The marker is what that gap ends
  // at, so injecting there is the narrowest place the race can start.
  fs.openSync = (target, flags, ...rest) => {
    if (!isInterleaved && target === takeoverPath && flags === 'wx') {
      isInterleaved = true;
      fs.unlinkSync(fixture.lockPath);
      fs.writeFileSync(fixture.lockPath, competing);
    }
    return realOpenSync.call(fs, target, flags, ...rest);
  };
  let taken;
  let printed;
  try {
    ({ result: taken, lines: printed } = quietly(() => engine.acquireLock(ctx, 'run-a')));
  } finally {
    fs.openSync = realOpenSync;
  }

  assert.equal(isInterleaved, true);
  assert.equal(taken.isHeld, false);
  assert.equal(taken.ownerLine, competing.trim());
  assert.deepEqual(printed.filter((line) => line.startsWith(NOTE_PREFIX)), []);
  assert.equal(fs.readFileSync(fixture.lockPath, 'utf8'), competing);
  assert.equal(fs.existsSync(takeoverPath), false);
});

test('a takeover leaves exactly the new owner line and no marker behind', (t) => {
  const fixture = createLockFixture(t);
  writeLock(fixture, ownerLine(deadPid(), HOST));
  const ctx = engine.createContext(fixture.tree);

  const { result: lock } = quietly(() => engine.acquireLock(ctx, 'run-a'));

  assert.equal(lock.isHeld, true);
  assert.equal(fs.readFileSync(fixture.lockPath, 'utf8'), lock.ownerLine + '\n');
  assert.equal(fs.existsSync(fixture.lockPath + '.takeover'), false);
  lock.release();
  assert.equal(fs.existsSync(fixture.lockPath), false);
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. KEEPING A LOCK THAT MAY STILL BE HELD
// ─────────────────────────────────────────────────────────────────────────────

test('apply refuses a lock naming a live pid on this host and leaves the file alone', (t) => {
  const fixture = createLockFixture(t);
  const held = writeLock(fixture, ownerLine(process.pid, HOST));

  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 2, applied.output);
  assert.ok(applied.output.includes(REFUSAL), applied.output);
  assert.deepEqual(noteLines(applied.output), [], applied.output);
  assert.equal(fs.readFileSync(fixture.lockPath, 'utf8'), held);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'AGENTS.md'), 'utf8'), UPSTREAM_AGENTS);
});

test('apply refuses a host-less lock line naming a live pid here', (t) => {
  const fixture = createLockFixture(t);
  const held = writeLock(fixture, `overlay-engine apply pid=${process.pid} 2026-01-01T00:00:00.000Z`);

  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 2, applied.output);
  assert.ok(applied.output.includes(REFUSAL), applied.output);
  assert.deepEqual(noteLines(applied.output), [], applied.output);
  assert.equal(fs.readFileSync(fixture.lockPath, 'utf8'), held);
});

test('apply refuses a lock with no pid in it and leaves the file alone', (t) => {
  const fixture = createLockFixture(t);
  const held = writeLock(fixture, 'orchestrator repin 2026-01-01T00:00:00.000Z');

  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 2, applied.output);
  assert.ok(applied.output.includes(REFUSAL), applied.output);
  assert.deepEqual(noteLines(applied.output), [], applied.output);
  assert.equal(fs.readFileSync(fixture.lockPath, 'utf8'), held);
});

test('apply refuses a lock naming a dead pid on another host and leaves the file alone', (t) => {
  const fixture = createLockFixture(t);
  const held = writeLock(fixture, ownerLine(deadPid(), 'some-other-host'));

  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 2, applied.output);
  assert.ok(applied.output.includes(REFUSAL), applied.output);
  assert.deepEqual(noteLines(applied.output), [], applied.output);
  assert.equal(fs.readFileSync(fixture.lockPath, 'utf8'), held);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. LAYOUT LINKS THE ENGINE MADE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a tree holding one layout link and the folders it can point at.
 * @param {object} t The node:test context.
 * @returns {object} Fixture paths, its manifest and a `run` helper.
 */
function createLayoutFixture(t) {
  const fixture = createWorkspace(t, 'overlay-engine-link-');
  for (const folder of ['alpha', 'beta', 'gamma']) {
    fs.mkdirSync(path.join(fixture.tree, folder), { recursive: true });
  }
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    layoutLinks: [{ path: 'skills', target: 'alpha' }],
    overlays: [],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);
  return fixture;
}

test('apply retargets a layout link the engine made when the manifest target changes', (t) => {
  const fixture = createLayoutFixture(t);
  const first = fixture.run(['apply']);
  assert.equal(first.code, 0, first.output);

  const linkPath = path.join(fixture.tree, 'skills');
  assert.equal(fs.readlinkSync(linkPath), 'alpha');

  fixture.manifest.layoutLinks = [{ path: 'skills', target: 'beta' }];
  writeManifest(fixture);

  const second = fixture.run(['apply']);

  assert.equal(second.code, 0, second.output);
  assert.equal(fs.readlinkSync(linkPath), 'beta');
  assert.deepEqual(readJson(fixture.statePath).links, { skills: 'beta' });
});

test('apply refuses a layout link the state does not record and leaves it alone', (t) => {
  const fixture = createLayoutFixture(t);
  const first = fixture.run(['apply']);
  assert.equal(first.code, 0, first.output);

  const linkPath = path.join(fixture.tree, 'skills');
  fs.unlinkSync(linkPath);
  fs.symlinkSync('gamma', linkPath);

  const refused = fixture.run(['apply']);

  assert.equal(refused.code, 1, refused.output);
  assert.match(refused.output, /skills exists but is not the link to alpha/);
  assert.equal(fs.readlinkSync(linkPath), 'gamma');
});

test('a state file without link records still loads and reports an in-sync tree', (t) => {
  const fixture = createLayoutFixture(t);
  const first = fixture.run(['apply']);
  assert.equal(first.code, 0, first.output);

  const state = readJson(fixture.statePath);
  delete state.links;
  fs.writeFileSync(fixture.statePath, JSON.stringify(state, null, 2) + '\n');

  const status = fixture.run(['status']);

  assert.equal(status.code, 0, status.output);
  assert.match(status.output, /RESULT: PASSED/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. ITEMS A DROPPED ENTRY LEAVES BEHIND
// ─────────────────────────────────────────────────────────────────────────────

const UPSTREAM_HOOK = { id: 'session-start', event: 'SessionStart' };
const ALPHA_HOOK = { id: 'alpha', event: 'Alpha' };
const BETA_HOOK = { id: 'beta', event: 'Beta' };
const GAMMA_HOOK = { id: 'gamma', event: 'Gamma' };

/**
 * Build a tree holding one entry set that appends keyed items to a live array.
 * @param {object} t The node:test context.
 * @param {object[]} liveItems Items the live file already holds.
 * @param {object[]} entryItems Items the entry set starts out appending.
 * @returns {object} Fixture paths, its manifest and helpers to rewrite the entry
 *   set and read the live file.
 */
function createItemsFixture(t, liveItems, entryItems) {
  const fixture = createWorkspace(t, 'overlay-engine-items-');
  const seed = JSON.stringify({ hooks: liveItems }, null, 2) + '\n';
  writeFile(fixture.tree, 'registry.json', seed);
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    layoutLinks: [],
    overlays: [{
      id: 'hook-registry',
      scope: 'json-entry',
      source: 'json/registry.json',
      destination: 'registry.json',
      pinnedSha256: sha256(Buffer.from(seed)),
    }],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);
  fixture.writeEntries = (items) => {
    const entrySet = {
      target: 'registry.json',
      style: { indent: 2, primitiveArrays: 'multiline' },
      operations: [{ op: 'appendItems', path: ['hooks'], identityKey: 'id', items }],
    };
    writeFile(fixture.overlayDir, 'json/registry.json', JSON.stringify(entrySet, null, 2) + '\n');
  };
  fixture.livePath = path.join(fixture.tree, 'registry.json');
  fixture.readHooks = () => readJson(fixture.livePath).hooks;
  fixture.recordedItems = () => readJson(fixture.statePath).items['registry.json'];
  fixture.writeEntries(entryItems);
  return fixture;
}

test('apply removes an appended item the entry set drops', (t) => {
  const fixture = createItemsFixture(t, [UPSTREAM_HOOK], [ALPHA_HOOK, BETA_HOOK]);
  const seeded = fixture.run(['apply']);
  assert.equal(seeded.code, 0, seeded.output);
  assert.deepEqual(fixture.readHooks(), [UPSTREAM_HOOK, ALPHA_HOOK, BETA_HOOK]);

  fixture.writeEntries([ALPHA_HOOK]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.deepEqual(fixture.readHooks(), [UPSTREAM_HOOK, ALPHA_HOOK]);
});

test('apply refuses to remove a dropped item that was edited after it was applied', (t) => {
  const fixture = createItemsFixture(t, [UPSTREAM_HOOK], [ALPHA_HOOK, BETA_HOOK]);
  assert.equal(fixture.run(['apply']).code, 0);

  writeFile(fixture.tree, 'registry.json', fs.readFileSync(fixture.livePath, 'utf8').replace('"Beta"', '"Edited"'));
  const liveBefore = fs.readFileSync(fixture.livePath, 'utf8');
  fixture.writeEntries([ALPHA_HOOK]);

  const refused = fixture.run(['apply']);

  assert.equal(refused.code, 1, refused.output);
  assert.match(refused.output, /was edited after it was applied/);
  assert.equal(fs.readFileSync(fixture.livePath, 'utf8'), liveBefore);
});

test('apply keeps a listed item recorded and reports nothing to change', (t) => {
  const fixture = createItemsFixture(t, [UPSTREAM_HOOK], [ALPHA_HOOK, BETA_HOOK]);
  assert.equal(fixture.run(['apply']).code, 0);

  const second = fixture.run(['apply']);

  assert.equal(second.code, 0, second.output);
  assert.equal(second.output.trim(), '0 changed');
  const records = fixture.recordedItems();
  assert.deepEqual(records.map((record) => record.item.id), ['alpha', 'beta']);
  assert.deepEqual(records.map((record) => record.path), [['hooks'], ['hooks']]);
});

test('apply leaves an upstream item alone when the entry set stops listing it', (t) => {
  const fixture = createItemsFixture(t, [UPSTREAM_HOOK], [UPSTREAM_HOOK, ALPHA_HOOK]);
  const seeded = fixture.run(['apply']);
  assert.equal(seeded.code, 0, seeded.output);
  assert.deepEqual(fixture.recordedItems().map((record) => record.item.id), ['alpha']);

  fixture.writeEntries([ALPHA_HOOK]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.deepEqual(fixture.readHooks(), [UPSTREAM_HOOK, ALPHA_HOOK]);
});

/**
 * Build a tree whose entry set appends to a file an upstream checkout also
 * holds, so the pin's copy can be given the same item later on.
 * @param {object} t The node:test context.
 * @param {object[]} liveItems Items the live file and upstream both start with.
 * @param {object[]} entryItems Items the entry set starts out appending.
 * @returns {object} Fixture paths, its manifest, its upstream checkout and
 *   helpers to rewrite the entry set and read the live file.
 */
function createPinnedItemsFixture(t, liveItems, entryItems) {
  const fixture = createWorkspace(t, 'overlay-engine-items-pin-');
  const seed = JSON.stringify({ hooks: liveItems }, null, 2) + '\n';
  const upstream = path.join(fixture.workspace, 'upstream');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  writeFile(upstream, 'registry.json', seed);
  const commit = commitAll(upstream, 'pinned copy');
  writeFile(fixture.tree, 'registry.json', seed);
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', checkout: upstream, commit },
    layoutLinks: [],
    overlays: [{
      id: 'hook-registry',
      scope: 'json-entry',
      source: 'json/registry.json',
      destination: 'registry.json',
      pinnedSha256: sha256(Buffer.from(seed)),
    }],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.upstream = upstream;
  fixture.run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);
  fixture.writeEntries = (items) => {
    const entrySet = {
      target: 'registry.json',
      style: { indent: 2, primitiveArrays: 'inline' },
      operations: [{ op: 'appendItems', path: ['hooks'], identityKey: 'id', items }],
    };
    writeFile(fixture.overlayDir, 'json/registry.json', JSON.stringify(entrySet, null, 2) + '\n');
  };
  fixture.livePath = path.join(fixture.tree, 'registry.json');
  fixture.readHooks = () => readJson(fixture.livePath).hooks;
  fixture.recordedItems = () => (readJson(fixture.statePath).items || {})['registry.json'] || [];
  fixture.writeEntries(entryItems);
  return fixture;
}

test('apply keeps a dropped item that upstream ships at the pin', (t) => {
  const fixture = createPinnedItemsFixture(t, [UPSTREAM_HOOK], [GAMMA_HOOK]);
  const seeded = fixture.run(['apply']);
  assert.equal(seeded.code, 0, seeded.output);
  assert.deepEqual(fixture.readHooks(), [UPSTREAM_HOOK, GAMMA_HOOK]);

  // Upstream's copy gains the same item, so the line in the live file is now
  // upstream's own and only this overlay's record of it is out of date.
  writeFile(fixture.upstream, 'registry.json', fs.readFileSync(fixture.livePath));
  fixture.manifest.pin.commit = commitAll(fixture.upstream, 'upstream ships gamma');
  writeManifest(fixture);

  fixture.writeEntries([]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.deepEqual(fixture.readHooks(), [UPSTREAM_HOOK, GAMMA_HOOK]);
  assert.deepEqual(fixture.recordedItems(), []);
});

test('apply removes a dropped item that sits at the head of the live array', (t) => {
  const fixture = createItemsFixture(t, [UPSTREAM_HOOK, BETA_HOOK], [ALPHA_HOOK]);
  // A head insert puts the added item before upstream's own line, so the comma
  // that has to go with it is the one after it rather than the one before.
  writeFile(fixture.overlayDir, 'json/registry.json', JSON.stringify({
    target: 'registry.json',
    style: { indent: 2, primitiveArrays: 'multiline' },
    operations: [{
      op: 'insertItems',
      path: ['hooks'],
      identityKey: 'id',
      before: UPSTREAM_HOOK,
      items: [ALPHA_HOOK],
    }],
  }, null, 2) + '\n');

  const seeded = fixture.run(['apply']);
  assert.equal(seeded.code, 0, seeded.output);
  assert.deepEqual(fixture.readHooks(), [ALPHA_HOOK, UPSTREAM_HOOK, BETA_HOOK]);

  fixture.writeEntries([]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.deepEqual(JSON.parse(fs.readFileSync(fixture.livePath, 'utf8')),
    { hooks: [UPSTREAM_HOOK, BETA_HOOK] });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. ROOT FILES AN OVERLAY WAS PINNED FROM
// ─────────────────────────────────────────────────────────────────────────────

// A file overlay may own a root file, and `pinnedSha256` records upstream's copy
// of it as it stood when the overlay was taken. A re-pin never copies a root
// file, so `status` is the only place that notices upstream moving on first.
const GIT_CONFIG = [
  '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
  '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', '-c', 'init.defaultBranch=main',
  '-c', 'core.excludesFile=/dev/null',
];
const UPSTREAM_AGENTS_V2 = 'upstream agents v2\n';
const STALE_LINE = 'STALE    root-file AGENTS.md: upstream changed it since overlay agents-file was pinned; ' +
  'rebase the overlay, then update its pinnedSha256';

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
 * Build a tree whose file overlay owns a root file, with an upstream checkout
 * holding the copy that overlay was pinned from.
 * @param {object} t The node:test context.
 * @returns {object} Fixture paths, its manifest and a `run` helper.
 */
function createRootFileFixture(t) {
  const fixture = createWorkspace(t, 'overlay-engine-root-pin-');
  const upstream = path.join(fixture.workspace, 'upstream');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  writeFile(upstream, 'AGENTS.md', UPSTREAM_AGENTS);
  const commit = commitAll(upstream, 'pinned copy');
  writeFile(fixture.overlayDir, 'files/AGENTS.md', OVERLAY_AGENTS);
  writeFile(fixture.tree, 'AGENTS.md', UPSTREAM_AGENTS);
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', checkout: upstream, commit },
    repin: { rootFiles: ['AGENTS.md'] },
    layoutLinks: [],
    overlays: [{
      id: 'agents-file',
      scope: 'file',
      source: 'files/AGENTS.md',
      destination: 'AGENTS.md',
      pinnedSha256: sha256(Buffer.from(UPSTREAM_AGENTS)),
    }],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.manifestPath = path.join(fixture.overlayDir, 'overlay-manifest.json');
  fixture.run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);
  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  return fixture;
}

function staleLines(output) {
  return output.split('\n').filter((line) => line.startsWith('STALE'));
}

test('status passes while an owned root file matches the pinned upstream copy', (t) => {
  const fixture = createRootFileFixture(t);

  const status = fixture.run(['status']);

  assert.equal(status.code, 0, status.output);
  assert.deepEqual(staleLines(status.output), [], status.output);
  assert.match(status.output, /RESULT: PASSED/);
});

test('status reports an owned root file whose pinned copy upstream has moved on from', (t) => {
  const fixture = createRootFileFixture(t);
  // The hash stands in for upstream's new bytes: only the pin is out of date,
  // while the live file still holds what the overlay last wrote.
  fixture.manifest.overlays[0].pinnedSha256 = sha256(Buffer.from(UPSTREAM_AGENTS_V2));
  writeManifest(fixture);

  const status = fixture.run(['status']);
  const report = JSON.parse(fixture.run(['status', '--json']).stdout);

  assert.equal(status.code, 1, status.output);
  assert.deepEqual(staleLines(status.output), [STALE_LINE], status.output);
  assert.match(status.output, /RESULT: FAILED/);
  assert.deepEqual(report.staleRootFiles, [{ path: 'AGENTS.md', overlay: 'agents-file' }]);
  assert.equal(report.result, 'FAILED');
});

// The same pin guards a marked-section overlay on a root file: it records
// upstream's copy of the file whose block the overlay writes, so an upstream
// move has to surface even though the entry rewrites only the text between the
// markers.
const AGENTS_BLOCK = '\n<!-- BEGIN BLOCK -->\nproject agents\n<!-- END BLOCK -->\n';
const MARKED_STALE_LINE = 'STALE    root-file AGENTS.md: upstream changed it since overlay agents-marked was ' +
  'pinned; rebase the overlay, then update its pinnedSha256';

/**
 * Build a tree whose marked-section overlay owns a root file, with an upstream
 * checkout holding the copy that overlay appends its block to.
 * @param {object} t The node:test context.
 * @returns {object} Fixture paths, its manifest and a `run` helper.
 */
function createMarkedRootFileFixture(t) {
  const fixture = createWorkspace(t, 'overlay-engine-marked-root-');
  const upstream = path.join(fixture.workspace, 'upstream');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  writeFile(upstream, 'AGENTS.md', UPSTREAM_AGENTS);
  const commit = commitAll(upstream, 'pinned copy');
  writeFile(fixture.overlayDir, 'AGENTS.md', AGENTS_BLOCK);
  writeFile(fixture.overlayDir, 'AGENTS.base.md', UPSTREAM_AGENTS);
  writeFile(fixture.tree, 'AGENTS.md', UPSTREAM_AGENTS);
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', checkout: upstream, commit },
    repin: { rootFiles: ['AGENTS.md'] },
    layoutLinks: [],
    overlays: [{
      id: 'agents-marked',
      scope: 'marked-section',
      source: 'AGENTS.md',
      base: 'AGENTS.base.md',
      fragment: 'AGENTS.md',
      destination: 'AGENTS.md',
      beginMarker: '<!-- BEGIN BLOCK -->',
      endMarker: '<!-- END BLOCK -->',
      pinnedSha256: sha256(Buffer.from(UPSTREAM_AGENTS)),
    }],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);
  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  return fixture;
}

test('status passes while a marked-section overlay root file matches the pinned upstream copy', (t) => {
  const fixture = createMarkedRootFileFixture(t);

  const status = fixture.run(['status']);

  assert.equal(status.code, 0, status.output);
  assert.deepEqual(staleLines(status.output), [], status.output);
  assert.match(status.output, /RESULT: PASSED/);
});

test('status reports a marked-section overlay root file whose pinned copy upstream has moved on from', (t) => {
  const fixture = createMarkedRootFileFixture(t);
  // Only the pin is out of date: the live file still holds the block this
  // overlay wrote, so no destination line can see the move.
  fixture.manifest.overlays[0].pinnedSha256 = sha256(Buffer.from(UPSTREAM_AGENTS_V2));
  writeManifest(fixture);

  const status = fixture.run(['status']);
  const report = JSON.parse(fixture.run(['status', '--json']).stdout);

  assert.equal(status.code, 1, status.output);
  assert.deepEqual(staleLines(status.output), [MARKED_STALE_LINE], status.output);
  assert.match(status.output, /RESULT: FAILED/);
  assert.deepEqual(report.staleRootFiles, [{ path: 'AGENTS.md', overlay: 'agents-marked' }]);
  assert.equal(report.result, 'FAILED');
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. SOURCES KEPT OFF THE LAYOUT
// ─────────────────────────────────────────────────────────────────────────────

// An overlay's copy belongs inside the overlay folder at its destination path
// with the leading dot dropped. A copy kept elsewhere still applies, so `status`
// names where it belongs while leaving the run's result alone.
const ENGINE_COMMAND = 'node .skilled/commands/doctor/scripts/overlay-engine.cjs';
const PLACE_DESTINATION = '.skilled/skills/hub/place.md';
const PLACE_LAYOUT = 'skilled/skills/hub/place.md';
const UPSTREAM_PLACE = 'upstream place\n';
const OVERLAY_PLACE = 'overlay place\n';

/**
 * Build a tree whose one file overlay keeps its copy where `source` names.
 * @param {object} t The node:test context.
 * @param {string} source Where the overlay's copy sits, relative to its folder.
 * @returns {object} Fixture paths, its manifest and a `run` helper.
 */
function createLayoutSourceFixture(t, source) {
  const fixture = createWorkspace(t, 'overlay-engine-off-layout-');
  writeFile(fixture.overlayDir, source, OVERLAY_PLACE);
  writeFile(fixture.tree, PLACE_DESTINATION, UPSTREAM_PLACE);
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    layoutLinks: [],
    overlays: [{
      id: 'hub-place',
      scope: 'file',
      source,
      destination: PLACE_DESTINATION,
      pinnedSha256: sha256(Buffer.from(UPSTREAM_PLACE)),
    }],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);
  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  return fixture;
}

function layoutLines(output) {
  return output.split('\n').filter((line) => line.startsWith('LAYOUT'));
}

test('status names a source kept off the layout without failing the run', (t) => {
  const offLayout = createLayoutSourceFixture(t, 'custom/place.md');

  const status = offLayout.run(['status']);
  const report = JSON.parse(offLayout.run(['status', '--json']).stdout);
  const onLayout = createLayoutSourceFixture(t, PLACE_LAYOUT);
  const settled = onLayout.run(['status']);

  assert.equal(status.code, 0, status.output);
  assert.match(status.output, /RESULT: PASSED/);
  assert.deepEqual(layoutLines(status.output), [
    `LAYOUT   hub-place: source custom/place.md belongs at ${PLACE_LAYOUT}; run ${ENGINE_COMMAND} apply --relayout`,
  ], status.output);
  assert.deepEqual(report.offLayout, [
    { overlay: 'hub-place', field: 'source', from: 'custom/place.md', to: PLACE_LAYOUT },
  ]);
  assert.equal(settled.code, 0, settled.output);
  assert.deepEqual(layoutLines(settled.output), [], settled.output);
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. MOVING SOURCES ONTO THE LAYOUT
// ─────────────────────────────────────────────────────────────────────────────

// The status line tells the operator to run a command that moves each copy onto
// its layout path. Each case here checks one promise of that run: every scope
// lands where the layout puts it, a path already holding something stops the run
// before it writes, and a tree already on the layout is left alone.
const DIR_DESTINATION = '.skilled/skills/hub/bundle';
const DIR_LAYOUT = 'skilled/skills/hub/bundle';
const JSON_DESTINATION = '.claude/settings.json';
const JSON_LAYOUT = 'claude/settings.json';
const MARKED_DESTINATION = '.pi/AGENTS.md';
const MARKED_LAYOUT = 'pi/AGENTS.md';
const MARKED_BASE_LAYOUT = 'pi/AGENTS.base.md';
const UPSTREAM_SETTINGS = '{"name": "widget"}\n';
const UPSTREAM_MARKED = '# Header\n';
const BLOCK_FRAGMENT = '\n<!-- BEGIN BLOCK -->\nold block\n<!-- END BLOCK -->\n';
const README_TEXT = 'directory one\n';

/**
 * Build a tree with one off-layout copy of every destination-writing scope.
 * @param {object} t The node:test context.
 * @returns {object} Fixture paths, its manifest and a `run` helper.
 */
function createRelayoutFixture(t) {
  const fixture = createWorkspace(t, 'overlay-engine-relayout-');
  writeFile(fixture.overlayDir, 'custom/place.md', OVERLAY_PLACE);
  writeFile(fixture.overlayDir, 'custom/bundle/readme.md', README_TEXT);
  writeFile(fixture.overlayDir, 'custom/entries.json', JSON.stringify({
    target: 'settings.json',
    style: { indent: 2, primitiveArrays: 'inline' },
    operations: [{ op: 'insertObjectKeys', path: [], entries: [{ key: 'enabled', value: true }] }],
  }, null, 2) + '\n');
  writeFile(fixture.overlayDir, 'custom/AGENTS.md', BLOCK_FRAGMENT);
  writeFile(fixture.overlayDir, 'custom/AGENTS.base.md', UPSTREAM_MARKED);
  writeFile(fixture.tree, PLACE_DESTINATION, UPSTREAM_PLACE);
  writeFile(fixture.tree, DIR_DESTINATION + '/readme.md', README_TEXT);
  writeFile(fixture.tree, JSON_DESTINATION, UPSTREAM_SETTINGS);
  writeFile(fixture.tree, MARKED_DESTINATION, UPSTREAM_MARKED);
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    layoutLinks: [],
    overlays: [
      {
        id: 'hub-place',
        scope: 'file',
        source: 'custom/place.md',
        destination: PLACE_DESTINATION,
        pinnedSha256: sha256(Buffer.from(UPSTREAM_PLACE)),
      },
      {
        id: 'hub-bundle',
        scope: 'directory',
        source: 'custom/bundle',
        destination: DIR_DESTINATION,
      },
      {
        id: 'hub-settings',
        scope: 'json-entry',
        source: 'custom/entries.json',
        destination: JSON_DESTINATION,
        pinnedSha256: sha256(Buffer.from(UPSTREAM_SETTINGS)),
      },
      {
        id: 'hub-marked',
        scope: 'marked-section',
        source: 'custom/AGENTS.md',
        base: 'custom/AGENTS.base.md',
        fragment: 'custom/AGENTS.md',
        destination: MARKED_DESTINATION,
        beginMarker: '<!-- BEGIN BLOCK -->',
        endMarker: '<!-- END BLOCK -->',
        pinnedSha256: sha256(Buffer.from(UPSTREAM_MARKED)),
      },
    ],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.manifestPath = path.join(fixture.overlayDir, 'overlay-manifest.json');
  fixture.run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);
  return fixture;
}

function movedLines(output) {
  return output.split('\n').filter((line) => line.startsWith('moved ')).sort();
}

function backupFolder(fixture, output) {
  const line = output.split('\n').find((candidate) => candidate.startsWith('backup '));
  assert.ok(line, output);
  return path.join(fixture.tree, line.slice('backup '.length));
}

test('relayout moves every off-layout source onto its layout path', (t) => {
  const fixture = createRelayoutFixture(t);
  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);

  const relayout = fixture.run(['apply', '--relayout']);

  assert.equal(relayout.code, 0, relayout.output);
  assert.deepEqual(movedLines(relayout.output), [
    `moved custom/AGENTS.base.md -> ${MARKED_BASE_LAYOUT}`,
    `moved custom/AGENTS.md -> ${MARKED_LAYOUT}`,
    `moved custom/bundle -> ${DIR_LAYOUT}`,
    `moved custom/entries.json -> ${JSON_LAYOUT}`,
    `moved custom/place.md -> ${PLACE_LAYOUT}`,
  ]);
  const lines = relayout.output.trimEnd().split('\n');
  assert.equal(lines[lines.length - 2], '5 moved');
  assert.equal(lines[lines.length - 1], `run ${ENGINE_COMMAND} apply`);
  for (const relativePath of [PLACE_LAYOUT, DIR_LAYOUT + '/readme.md', JSON_LAYOUT, MARKED_LAYOUT, MARKED_BASE_LAYOUT]) {
    assert.equal(fs.existsSync(path.join(fixture.overlayDir, relativePath)), true, relativePath);
  }
  assert.equal(fs.existsSync(path.join(fixture.overlayDir, 'custom')), false);

  const manifest = readJson(fixture.manifestPath);
  assert.deepEqual(manifest.overlays.map((entry) => [entry.id, entry.source, entry.fragment, entry.base]), [
    ['hub-place', PLACE_LAYOUT, undefined, undefined],
    ['hub-bundle', DIR_LAYOUT, undefined, undefined],
    ['hub-settings', JSON_LAYOUT, undefined, undefined],
    ['hub-marked', MARKED_LAYOUT, MARKED_LAYOUT, MARKED_BASE_LAYOUT],
  ]);

  const backup = backupFolder(fixture, relayout.output);
  const backedUp = (relativePath) => fs.readFileSync(path.join(backup, 'skilled-overlays', relativePath), 'utf8');
  assert.equal(backedUp('custom/place.md'), OVERLAY_PLACE);
  assert.equal(backedUp('custom/bundle/readme.md'), README_TEXT);
  assert.equal(backedUp('custom/AGENTS.base.md'), UPSTREAM_MARKED);
  assert.ok(fs.existsSync(path.join(backup, 'skilled-overlays', 'overlay-manifest.json')));

  const reapplied = fixture.run(['apply']);
  const status = fixture.run(['status']);

  assert.equal(reapplied.code, 0, reapplied.output);
  assert.equal(status.code, 0, status.output);
  assert.deepEqual(layoutLines(status.output), [], status.output);
});

// The backup is a copy of the folder about to move, so it has to obey the same
// read rule as apply: a token-named file the entry does not name by its exact
// path is skipped, and the move, which only renames, still carries it along.
test('relayout backs up no file its read rule refuses to open', (t) => {
  const fixture = createWorkspace(t, 'overlay-engine-relayout-protected-');
  const secret = 'SECRET-BYTES-123\n';
  writeFile(fixture.overlayDir, 'custom/bundle/readme.md', README_TEXT);
  writeFile(fixture.overlayDir, 'custom/bundle/assets/api-token.js', secret);
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    layoutLinks: [],
    overlays: [{
      id: 'hub-bundle',
      scope: 'directory',
      source: 'custom/bundle',
      destination: DIR_DESTINATION,
    }],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  const run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);

  const relayout = run(['apply', '--relayout']);

  assert.equal(relayout.code, 0, relayout.output);
  assert.equal(relayout.output.split('\n').includes('skipped custom/bundle/assets/api-token.js'), true, relayout.output);
  assert.deepEqual(movedLines(relayout.output), [`moved custom/bundle -> ${DIR_LAYOUT}`]);
  const backup = backupFolder(fixture, relayout.output);
  assert.equal(fs.existsSync(path.join(backup, 'skilled-overlays/custom/bundle/assets/api-token.js')), false);
  assert.equal(fs.readFileSync(path.join(backup, 'skilled-overlays/custom/bundle/readme.md'), 'utf8'), README_TEXT);
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, DIR_LAYOUT, 'assets/api-token.js'), 'utf8'), secret);
});

test('relayout refuses to move a source whose layout path is already taken', (t) => {
  const fixture = createWorkspace(t, 'overlay-engine-relayout-blocked-');
  writeFile(fixture.overlayDir, 'custom/place.md', OVERLAY_PLACE);
  writeFile(fixture.overlayDir, PLACE_LAYOUT, 'already here\n');
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    layoutLinks: [],
    overlays: [{
      id: 'hub-place',
      scope: 'file',
      source: 'custom/place.md',
      destination: PLACE_DESTINATION,
      pinnedSha256: sha256(Buffer.from(UPSTREAM_PLACE)),
    }],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  const manifestPath = path.join(fixture.overlayDir, 'overlay-manifest.json');
  const before = fs.readFileSync(manifestPath);
  const run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);

  const relayout = run(['apply', '--relayout']);

  assert.equal(relayout.code, 2, relayout.output);
  assert.match(relayout.output, /refuse: /);
  assert.deepEqual(movedLines(relayout.output), [], relayout.output);
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'custom/place.md'), 'utf8'), OVERLAY_PLACE);
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, PLACE_LAYOUT), 'utf8'), 'already here\n');
  assert.deepEqual(fs.readFileSync(manifestPath), before);
});

test('relayout reports nothing to move on a tree already on the layout', (t) => {
  const fixture = createWorkspace(t, 'overlay-engine-relayout-settled-');
  writeFile(fixture.overlayDir, PLACE_LAYOUT, OVERLAY_PLACE);
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    layoutLinks: [],
    overlays: [{
      id: 'hub-place',
      scope: 'file',
      source: PLACE_LAYOUT,
      destination: PLACE_DESTINATION,
      pinnedSha256: sha256(Buffer.from(UPSTREAM_PLACE)),
    }],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  const run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);

  const relayout = run(['apply', '--relayout']);

  assert.equal(relayout.code, 0, relayout.output);
  assert.equal(relayout.output.trim(), '0 moved');
  assert.equal(fs.existsSync(path.join(fixture.overlayDir, 'relayout-runs')), false);
});

// A tree upgraded from a release that kept no link records in its state has
// nothing the follow-up apply accepts as proof the live link is the engine's
// own, so the run that moves the bytes has to move the link with them. A path
// holding a stranger's link is left for that apply to report.
const BUNDLE_LINK = 'bundle-view';
const STRANGER_TARGET = 'elsewhere';
const BUNDLE_LINK_TARGET = 'skilled-overlays/custom/bundle';
const BUNDLE_RELINKED_TARGET = 'skilled-overlays/skilled/skills/hub/bundle';

/**
 * Build a tree whose off-layout directory source stands behind a live link, in
 * a state file that records no links.
 * @param {object} t The node:test context.
 * @returns {object} Fixture paths, its manifest and a `run` helper.
 */
function createRelayoutLinkFixture(t) {
  const fixture = createWorkspace(t, 'overlay-engine-relayout-link-');
  writeFile(fixture.overlayDir, 'custom/bundle/readme.md', README_TEXT);
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    layoutLinks: [{ path: BUNDLE_LINK, target: BUNDLE_LINK_TARGET }],
    overlays: [{
      id: 'hub-bundle',
      scope: 'directory',
      source: 'custom/bundle',
      destination: DIR_DESTINATION,
    }],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.manifestPath = path.join(fixture.overlayDir, 'overlay-manifest.json');
  fixture.linkPath = path.join(fixture.tree, BUNDLE_LINK);
  fs.symlinkSync(BUNDLE_LINK_TARGET, fixture.linkPath);
  fixture.run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  const state = readJson(fixture.statePath);
  delete state.links;
  fs.writeFileSync(fixture.statePath, JSON.stringify(state, null, 2) + '\n');
  return fixture;
}

function relinkedLines(output) {
  return output.split('\n').filter((line) => line.startsWith('relinked '));
}

test('relayout retargets a live layout link whose target it moved', (t) => {
  const fixture = createRelayoutLinkFixture(t);
  assert.equal(fs.readlinkSync(fixture.linkPath), BUNDLE_LINK_TARGET);

  const relayout = fixture.run(['apply', '--relayout']);

  assert.equal(relayout.code, 0, relayout.output);
  assert.deepEqual(relinkedLines(relayout.output), [`relinked ${BUNDLE_LINK} -> ${BUNDLE_RELINKED_TARGET}`], relayout.output);
  assert.equal(readJson(fixture.manifestPath).layoutLinks[0].target, BUNDLE_RELINKED_TARGET);
  assert.equal(fs.readlinkSync(fixture.linkPath), BUNDLE_RELINKED_TARGET);
  assert.equal(fs.readFileSync(path.join(fixture.linkPath, 'readme.md'), 'utf8'), README_TEXT);

  const reapplied = fixture.run(['apply']);
  const status = fixture.run(['status']);

  assert.equal(reapplied.code, 0, reapplied.output);
  assert.equal(status.code, 0, status.output);
  assert.match(status.output, /RESULT: PASSED/);
  assert.equal(fs.readlinkSync(fixture.linkPath), BUNDLE_RELINKED_TARGET);
});

test('relayout leaves a live link that points somewhere of its own unchanged', (t) => {
  const fixture = createRelayoutLinkFixture(t);
  fs.unlinkSync(fixture.linkPath);
  fs.symlinkSync(STRANGER_TARGET, fixture.linkPath);

  const relayout = fixture.run(['apply', '--relayout']);

  assert.equal(relayout.code, 0, relayout.output);
  assert.deepEqual(relinkedLines(relayout.output), [], relayout.output);
  assert.equal(fs.readlinkSync(fixture.linkPath), STRANGER_TARGET);
  assert.equal(readJson(fixture.manifestPath).layoutLinks[0].target, BUNDLE_RELINKED_TARGET);
});

// A separate command word would need its own route, so relayout rides on apply
// as a flag, and the parser refuses it anywhere but there.
test('relayout is a flag of apply, so a bare command word and a rival flag are refused', (t) => {
  const fixture = createWorkspace(t, 'overlay-engine-relayout-misuse-');
  const run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);

  for (const args of [['relayout'], ['apply', '--relayout', '--adopt', 'taken.md']]) {
    const result = run(args);
    assert.equal(result.code, 2, args.join(' ') + ': ' + result.output);
    assert.match(result.stdout, /^usage: node overlay-engine\.cjs status/, args.join(' '));
  }
});

// A field edit is looked up by the entry id, so a manifest that names one id
// twice cannot be rewritten in full. That has to stop the run before it moves
// a byte, or the copies sit at their layout paths while the manifest, which is
// never edited, still names the old ones.
test('relayout refuses a manifest that names one id twice before it moves anything', (t) => {
  const fixture = createWorkspace(t, 'overlay-engine-relayout-duplicate-');
  const first = 'first copy\n';
  const second = 'second copy\n';
  writeFile(fixture.overlayDir, 'custom/a.md', first);
  writeFile(fixture.overlayDir, 'custom/b.md', second);
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    layoutLinks: [],
    overlays: [
      { id: 'dup', scope: 'file', source: 'custom/a.md', destination: '.skilled/skills/hub/a.md' },
      { id: 'dup', scope: 'file', source: 'custom/b.md', destination: '.skilled/skills/hub/b.md' },
    ],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  const manifestPath = path.join(fixture.overlayDir, 'overlay-manifest.json');
  const before = fs.readFileSync(manifestPath);
  const run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);

  const relayout = run(['apply', '--relayout']);

  assert.equal(relayout.code, 2, relayout.output);
  assert.match(relayout.output, /^refuse: /m);
  assert.deepEqual(movedLines(relayout.output), [], relayout.output);
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'custom/a.md'), 'utf8'), first);
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'custom/b.md'), 'utf8'), second);
  assert.deepEqual(fs.readFileSync(manifestPath), before);
  assert.equal(fs.existsSync(path.join(fixture.overlayDir, 'relayout-runs')), false);
});

// Two entries can name one copy and still disagree about where it belongs, and
// then there is no single move that puts that copy on the layout, so the run
// stops rather than picking one of the two destinations.
test('relayout refuses a copy two entries would move to different paths', (t) => {
  const fixture = createWorkspace(t, 'overlay-engine-relayout-claimed-');
  writeFile(fixture.overlayDir, 'custom/place.md', OVERLAY_PLACE);
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    layoutLinks: [],
    overlays: [
      { id: 'hub-place', scope: 'file', source: 'custom/place.md', destination: PLACE_DESTINATION },
      { id: 'note-place', scope: 'file', source: 'custom/place.md', destination: '.claude/skills/hub/place.md' },
    ],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  const manifestPath = path.join(fixture.overlayDir, 'overlay-manifest.json');
  const before = fs.readFileSync(manifestPath);
  const run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);

  const relayout = run(['apply', '--relayout']);

  assert.equal(relayout.code, 2, relayout.output);
  assert.equal(relayout.output.trim(), `refuse: custom/place.md is claimed by ${PLACE_LAYOUT} and ` +
    'claude/skills/hub/place.md; one copy cannot move to both');
  assert.deepEqual(movedLines(relayout.output), [], relayout.output);
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'custom/place.md'), 'utf8'), OVERLAY_PLACE);
  assert.equal(fs.existsSync(path.join(fixture.overlayDir, PLACE_LAYOUT)), false);
  assert.equal(fs.existsSync(path.join(fixture.overlayDir, 'claude/skills/hub/place.md')), false);
  assert.deepEqual(fs.readFileSync(manifestPath), before);
  assert.equal(fs.existsSync(path.join(fixture.overlayDir, 'relayout-runs')), false);
});

// Two copies aimed at one destination would have to share a single layout path,
// so whichever copy the run moved, the other would sit at a path the manifest no
// longer names. Both stay where they are until the manifest names one destination.
test('relayout refuses two copies whose destinations land on one layout path', (t) => {
  const fixture = createWorkspace(t, 'overlay-engine-relayout-one-path-');
  const first = 'first copy\n';
  const second = 'second copy\n';
  writeFile(fixture.overlayDir, 'custom/a.md', first);
  writeFile(fixture.overlayDir, 'custom/b.md', second);
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    layoutLinks: [],
    overlays: [
      { id: 'hub-a', scope: 'file', source: 'custom/a.md', destination: '.skilled/skills/hub/a.md' },
      { id: 'hub-b', scope: 'file', source: 'custom/b.md', destination: '.skilled/skills/hub/a.md' },
    ],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  const manifestPath = path.join(fixture.overlayDir, 'overlay-manifest.json');
  const before = fs.readFileSync(manifestPath);
  const run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);

  const relayout = run(['apply', '--relayout']);

  assert.equal(relayout.code, 2, relayout.output);
  assert.equal(relayout.output.trim(), 'refuse: custom/a.md and custom/b.md both belong at skilled/skills/hub/a.md');
  assert.deepEqual(movedLines(relayout.output), [], relayout.output);
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'custom/a.md'), 'utf8'), first);
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'custom/b.md'), 'utf8'), second);
  assert.equal(fs.existsSync(path.join(fixture.overlayDir, 'skilled/skills/hub/a.md')), false);
  assert.deepEqual(fs.readFileSync(manifestPath), before);
  assert.equal(fs.existsSync(path.join(fixture.overlayDir, 'relayout-runs')), false);
});

// Moving a folder carries the copies inside it, so a second move out of that
// folder would find its own path gone half-way through the run. The copies stay
// put, and the operator moves the folder and the copy inside it in two runs.
test('relayout refuses two copies that sit one inside the other', (t) => {
  const fixture = createWorkspace(t, 'overlay-engine-relayout-nested-');
  writeFile(fixture.overlayDir, 'custom/bundle/readme.md', README_TEXT);
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    layoutLinks: [],
    overlays: [
      { id: 'hub-bundle', scope: 'directory', source: 'custom/bundle', destination: DIR_DESTINATION },
      { id: 'hub-readme', scope: 'file', source: 'custom/bundle/readme.md', destination: '.claude/readme.md' },
    ],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  const manifestPath = path.join(fixture.overlayDir, 'overlay-manifest.json');
  const before = fs.readFileSync(manifestPath);
  const run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);

  const relayout = run(['apply', '--relayout']);

  assert.equal(relayout.code, 2, relayout.output);
  assert.equal(relayout.output.trim(), 'refuse: custom/bundle and custom/bundle/readme.md sit one inside the other; ' +
    'they have to move in separate runs');
  assert.deepEqual(movedLines(relayout.output), [], relayout.output);
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'custom/bundle/readme.md'), 'utf8'), README_TEXT);
  assert.equal(fs.existsSync(path.join(fixture.overlayDir, DIR_LAYOUT)), false);
  assert.equal(fs.existsSync(path.join(fixture.overlayDir, 'claude/readme.md')), false);
  assert.deepEqual(fs.readFileSync(manifestPath), before);
  assert.equal(fs.existsSync(path.join(fixture.overlayDir, 'relayout-runs')), false);
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. AUDITING THE VENDORED TREE
// ─────────────────────────────────────────────────────────────────────────────

// A strict write check sees only the writes an agent makes, so a tree that has
// already drifted from its pin looks clean to `status` until the audit is asked
// for. This case builds an upstream commit that carries a link, a vendored tree
// of its own that has drifted, and checks that `--audit` names the three kinds
// of drift while a plain `status` on the same tree still passes.

const AUDIT_UPSTREAM = {
  '.skilled/skills/hub/a.md': 'a upstream\n',
  '.skilled/skills/hub/b.md': 'b upstream\n',
  '.skilled/skills/hub/owned.md': 'owned upstream\n',
  '.skilled/gen/out.json': '{"out": "upstream"}\n',
};

/**
 * Build an upstream commit with a link in it, and a vendored tree of its own
 * that has drifted: one edited file no overlay owns, one edited file an overlay
 * owns, one edited generated output, no link, and a tracked stray file.
 * @param {object} t The node:test context.
 * @returns {object} Fixture paths and a `run` helper.
 */
function createAuditFixture(t) {
  const fixture = createWorkspace(t, 'overlay-engine-audit-');
  const { workspace, tree, overlayDir } = fixture;
  const upstream = path.join(workspace, 'upstream');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  for (const [relativePath, value] of Object.entries(AUDIT_UPSTREAM)) writeFile(upstream, relativePath, value);
  fs.symlinkSync('a.md', path.join(upstream, '.skilled/skills/hub/link'));
  const commit = commitAll(upstream, 'pin');

  writeFile(tree, '.skilled/skills/hub/a.md', AUDIT_UPSTREAM['.skilled/skills/hub/a.md']);
  writeFile(tree, '.skilled/skills/hub/b.md', 'b edited in the tree\n');
  writeFile(tree, '.skilled/skills/hub/owned.md', AUDIT_UPSTREAM['.skilled/skills/hub/owned.md']);
  writeFile(tree, '.skilled/gen/out.json', '{"out": "generated here"}\n');
  writeFile(overlayDir, 'skilled/skills/hub/owned.md', 'owned from the overlay\n');
  writeFile(tree, '.gitignore', 'skilled-overlays/sync-state.json\nskilled-overlays/.build-lock\n');
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', checkout: upstream, commit },
    generated: ['.skilled/gen/**'],
    layoutLinks: [],
    overlays: [{
      id: 'owned-file',
      scope: 'file',
      source: 'skilled/skills/hub/owned.md',
      destination: '.skilled/skills/hub/owned.md',
      pinnedSha256: sha256(Buffer.from(AUDIT_UPSTREAM['.skilled/skills/hub/owned.md'])),
    }],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.run = (args) => runEngine([...args, '--root', tree], workspace);
  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);

  writeFile(tree, '.skilled/skills/hub/stray.md', 'no upstream copy\n');
  git(tree, ['init', '-q']);
  commitAll(tree, 'vendored tree');
  return fixture;
}

test('status --audit names the vendored drift no overlay owns and plain status stays quiet', (t) => {
  const fixture = createAuditFixture(t);

  const plain = fixture.run(['status']);
  assert.equal(plain.code, 0, plain.output);
  assert.match(plain.stdout, /^RESULT: PASSED$/m);
  assert.deepEqual(plain.stdout.split('\n').filter((line) => /^(AUDIT|audit=)/.test(line)), [], plain.output);

  const audited = fixture.run(['status', '--audit']);
  assert.equal(audited.code, 1, audited.output);
  assert.deepEqual(audited.stdout.split('\n').filter((line) => line.startsWith('AUDIT    ')), [
    'AUDIT    differs .skilled/skills/hub/b.md',
    'AUDIT    missing .skilled/skills/hub/link',
    'AUDIT    extra .skilled/skills/hub/stray.md',
  ], audited.output);
  assert.match(audited.stdout, /^audit=3$/m);
  assert.match(audited.stdout, /^RESULT: FAILED$/m);
});

const LINE_ENDING_PATH = '.skilled/skills/hub/lines.md';

/**
 * Build a tree whose pin stores one unowned vendored file with CRLF lines while
 * the tree's own copy holds LF, the drift only the audit reports.
 * @param {object} t The node:test context.
 * @returns {object} Fixture paths and a `run` helper.
 */
function createLineEndingFixture(t) {
  const fixture = createWorkspace(t, 'overlay-engine-audit-line-endings-');
  const upstream = path.join(fixture.workspace, 'upstream');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  // The commit has to keep the CRLF bytes as written, so no checkout rule may
  // fold them into LF before the blob is made.
  git(upstream, ['config', 'core.autocrlf', 'false']);
  writeFile(upstream, LINE_ENDING_PATH, 'one\r\ntwo\r\n');
  const commit = commitAll(upstream, 'pin');
  writeFile(fixture.tree, LINE_ENDING_PATH, 'one\ntwo\n');
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', checkout: upstream, commit },
    layoutLinks: [],
    overlays: [],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  git(fixture.tree, ['init', '-q']);
  commitAll(fixture.tree, 'vendored tree');
  fixture.run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);
  return fixture;
}

test('status --audit lists an unowned vendored file whose line endings differ from the pin', (t) => {
  const fixture = createLineEndingFixture(t);
  // The pin holds CRLF bytes and the tree holds LF, so the two blobs differ even
  // though the text reads the same. A re-pin refuses that, so the audit names it.
  assert.match(git(fixture.manifest.pin.checkout,
    ['cat-file', 'blob', `${fixture.manifest.pin.commit}:${LINE_ENDING_PATH}`]), /one\r\ntwo/);

  const audited = fixture.run(['status', '--audit']);

  assert.equal(audited.code, 1, audited.output);
  assert.deepEqual(audited.stdout.split('\n').filter((line) => line.startsWith('AUDIT    ')), [
    `AUDIT    differs ${LINE_ENDING_PATH}`,
  ], audited.output);
  assert.match(audited.stdout, /^audit=1$/m);
  assert.match(audited.stdout, /^RESULT: FAILED$/m);
});

const AUDIT_SKIP_LINE = 'AUDIT    skipped: no upstream checkout at the pin';

/**
 * Build a tree whose manifest pins a commit the checkout cannot hand back:
 * either the folder is no repository at all, or it never fetched the commit.
 * @param {object} t The node:test context.
 * @param {'no-repository'|'no-commit'} kind Which way the pin cannot be read.
 * @returns {object} Fixture paths and a `run` helper.
 */
function createUnreadablePinFixture(t, kind) {
  const fixture = createWorkspace(t, 'overlay-engine-audit-pin-');
  const upstream = path.join(fixture.workspace, 'upstream');
  fs.mkdirSync(upstream);
  writeFile(upstream, '.skilled/skills/hub/a.md', 'a upstream\n');
  let commit = '0'.repeat(40);
  if (kind === 'no-commit') {
    git(upstream, ['init', '-q']);
    commitAll(upstream, 'pin');
    commit = 'f'.repeat(40);
  }
  writeFile(fixture.tree, '.skilled/skills/hub/a.md', 'a upstream\n');
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', checkout: upstream, commit },
    layoutLinks: [],
    overlays: [],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);
  return fixture;
}

function auditLines(output) {
  return output.split('\n').filter((line) => line.startsWith('AUDIT'));
}

test('status --audit skips the audit when the pinned checkout is no repository', (t) => {
  const fixture = createUnreadablePinFixture(t, 'no-repository');

  const audited = fixture.run(['status', '--audit']);

  assert.equal(audited.code, 0, audited.output);
  assert.deepEqual(auditLines(audited.stdout), [AUDIT_SKIP_LINE], audited.output);
  assert.match(audited.stdout, /^audit=0$/m);
});

test('status --audit skips the audit when the checkout lacks the pinned commit', (t) => {
  const fixture = createUnreadablePinFixture(t, 'no-commit');

  const audited = fixture.run(['status', '--audit']);

  assert.equal(audited.code, 0, audited.output);
  assert.deepEqual(auditLines(audited.stdout), [AUDIT_SKIP_LINE], audited.output);
  assert.match(audited.stdout, /^audit=0$/m);
});
