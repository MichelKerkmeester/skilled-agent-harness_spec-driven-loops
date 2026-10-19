// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Core Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  stateDir,
  ensureStateDir,
  relaunchFilePath,
  parseHandoff,
  validateHandoff,
  preparePending,
  arm,
  unarm,
  readRelaunchFile,
  shouldRelaunch,
  claimHandoff,
  completeHandoff,
  supersedeClaimed,
  appendLog,
  manualClaimCommand,
  validSpecFolder,
  findLoopChildPid,
  readProcessTable,
  liveKillerPid,
  lockIsExpired,
  readLockState,
} = require('../lib/relaunch-core.cjs');

const SESSION_ID = 'session-test-00000001';
const LOOP_ID = 'loop-test-00000001';
const NOW = new Date('2026-10-16T12:00:00.000Z');
const DEFAULT_SECTIONS = {
  Goal: 'Finish the session relaunch loop.',
  Done: 'The captured hook payloads are ready.',
  'Remaining work': 'Build the core and adapters.',
  'In-flight state': 'No child process is running.',
};

function createSandbox(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-core-'));
  const repoRoot = path.join(root, 'repo');
  const xdgRuntimeDir = path.join(root, 'runtime');
  fs.mkdirSync(repoRoot, { recursive: true });
  fs.mkdirSync(xdgRuntimeDir, { recursive: true });
  const env = {
    ...process.env,
    HOME: path.join(root, 'home'),
    XDG_RUNTIME_DIR: xdgRuntimeDir,
    SESSION_RELAUNCH_REPO_ROOT: repoRoot,
  };
  for (const key of [
    'SKILLED_LOOP_ID',
    'SKILLED_LOOP_HOPS',
    'SKILLED_LOOP_NAME',
    'SESSION_RELAUNCH_WINDOW_TOKENS',
    'SYSTEM_SESSION_RELAUNCH_DISABLED',
  ]) {
    delete env[key];
  }
  fs.mkdirSync(env.HOME, { recursive: true });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, repoRoot, xdgRuntimeDir, env };
}

function handoffText({
  status = 'open',
  sessionId = SESSION_ID,
  claimedBy,
  sections = {},
} = {}) {
  const values = { ...DEFAULT_SECTIONS, ...sections };
  const frontmatter = [
    '---',
    `status: ${status}`,
    `session_id: ${sessionId}`,
    ...(claimedBy === undefined ? [] : [`claimed_by: ${claimedBy}`]),
    `loop_id: ${LOOP_ID}`,
    'runtime: claude',
    'cwd: /tmp/session-relaunch',
    'spec_folder: specs/hooks/001-session-relaunch',
    `created_at: ${NOW.toISOString()}`,
    '---',
  ];
  const body = Object.entries(values)
    .filter(([, value]) => value !== undefined)
    .map(([heading, value]) => `## ${heading}\n${value}`);
  return `${frontmatter.join('\n')}\n${body.join('\n')}`;
}

function writeHandoff(sandbox, options = {}) {
  const sessionId = options.sessionId || SESSION_ID;
  const handoffPath = path.join(
    sandbox.repoRoot,
    '.skilled',
    'skills',
    '.state',
    'session-relaunch',
    'handoffs',
    `20261016T120000Z-${sessionId.slice(0, 8)}.md`,
  );
  fs.mkdirSync(path.dirname(handoffPath), { recursive: true });
  fs.writeFileSync(handoffPath, handoffText(options));
  return handoffPath;
}

function readNote(handoffPath) {
  return fs.readFileSync(handoffPath, 'utf8');
}

function writeRelaunchRecord(sandbox, record) {
  const directory = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch');
  fs.mkdirSync(directory, { recursive: true });
  const filePath = path.join(directory, `relaunch-${record.loopId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(record));
  return filePath;
}

test('stateDir and relaunchFilePath use the isolated runtime directory', (t) => {
  const sandbox = createSandbox(t);
  assert.equal(stateDir(sandbox.env), path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch'));
  assert.equal(
    relaunchFilePath(LOOP_ID, sandbox.env),
    path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', `relaunch-${LOOP_ID}.json`),
  );
});

test('stateDir falls back to a per-user temp directory without a runtime dir', (t) => {
  const sandbox = createSandbox(t);
  const env = { ...sandbox.env };
  delete env.XDG_RUNTIME_DIR;

  const expectedName = typeof process.getuid === 'function'
    ? `skilled-relaunch-${process.getuid()}`
    : 'skilled-relaunch';
  assert.equal(stateDir(env), path.join(os.tmpdir(), expectedName));
  assert.ok(stateDir(env).endsWith(expectedName), stateDir(env));
  assert.equal(stateDir(sandbox.env), path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch'));
});

test('ensureStateDir refuses a state path that is a symlink', (t) => {
  const sandbox = createSandbox(t);
  const redirectTarget = path.join(sandbox.root, 'redirect-target');
  fs.mkdirSync(redirectTarget, { recursive: true });
  const targetMode = fs.statSync(redirectTarget).mode & 0o777;
  const statePath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch');
  fs.symlinkSync(redirectTarget, statePath, 'dir');

  assert.throws(
    () => ensureStateDir(sandbox.env),
    (error) => error instanceof Error && error.message.includes(statePath),
  );
  assert.equal(fs.statSync(redirectTarget).mode & 0o777, targetMode);
});

test('ensureStateDir refuses a state path that is a regular file', (t) => {
  const sandbox = createSandbox(t);
  const statePath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch');
  fs.writeFileSync(statePath, 'not a directory');

  assert.throws(
    () => ensureStateDir(sandbox.env),
    (error) => error instanceof Error && error.message.includes(statePath),
  );
});

test('ensureStateDir refuses a state directory owned by another user', (t) => {
  const getuid = process.getuid;
  if (typeof getuid !== 'function') return;

  const sandbox = createSandbox(t);
  const statePath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch');
  fs.mkdirSync(statePath, { recursive: true, mode: 0o700 });

  t.after(() => {
    process.getuid = getuid;
  });
  process.getuid = () => getuid.call(process) + 1;

  assert.throws(
    () => ensureStateDir(sandbox.env),
    (error) => error instanceof Error && error.message.includes(statePath),
  );
});

test('parseHandoff returns flat frontmatter and the four section bodies', (t) => {
  createSandbox(t);
  const parsed = parseHandoff(handoffText());
  assert.equal(parsed.frontmatter.status, 'open');
  assert.equal(parsed.frontmatter.session_id, SESSION_ID);
  assert.deepEqual(parsed.sections, DEFAULT_SECTIONS);
});

test('parseHandoff rejects text without frontmatter fences', (t) => {
  createSandbox(t);
  assert.throws(
    () => parseHandoff('## Goal\nNo frontmatter.'),
    (error) => /frontmatter/i.test(error.message),
  );
});

test('validateHandoff reports the path of a missing note', (t) => {
  const sandbox = createSandbox(t);
  const missingPath = path.join(sandbox.repoRoot, 'missing.md');
  assert.deepEqual(validateHandoff(missingPath, { sessionId: SESSION_ID }), {
    ok: false,
    reason: `handoff note not found: ${missingPath}`,
  });
});

test('validateHandoff rejects a note whose status is not open', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox, { status: 'claimed' });
  assert.equal(validateHandoff(handoffPath, { sessionId: SESSION_ID }).ok, false);
});

test('validateHandoff rejects a note from another session', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  assert.equal(validateHandoff(handoffPath, { sessionId: 'session-other-00001' }).ok, false);
});

for (const heading of ['Goal', 'Done', 'Remaining work', 'In-flight state']) {
  test(`validateHandoff rejects a missing ${heading} section`, (t) => {
    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox, { sections: { [heading]: undefined } });
    assert.equal(validateHandoff(handoffPath, { sessionId: SESSION_ID }).ok, false);
  });

  test(`validateHandoff rejects a blank ${heading} section`, (t) => {
    const sandbox = createSandbox(t);
    const handoffPath = writeHandoff(sandbox, { sections: { [heading]: '   ' } });
    assert.equal(validateHandoff(handoffPath, { sessionId: SESSION_ID }).ok, false);
  });
}

test('validateHandoff accepts a valid open note for the matching session', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  assert.deepEqual(validateHandoff(handoffPath, { sessionId: SESSION_ID }), { ok: true });
});

test('claimHandoff moves an open note to claimed with claim metadata', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  claimHandoff(handoffPath, { sessionId: SESSION_ID, now: NOW });
  const claimed = readNote(handoffPath);
  assert.match(claimed, /^status: claimed$/m);
  assert.match(claimed, /^claimed_at: /m);
  assert.match(claimed, new RegExp(`^claimed_by: ${SESSION_ID}$`, 'm'));
});

test('claimHandoff reports the path of a missing note', (t) => {
  const sandbox = createSandbox(t);
  const missingPath = path.join(sandbox.repoRoot, 'missing-claim.md');
  assert.throws(
    () => claimHandoff(missingPath, { sessionId: SESSION_ID, now: NOW }),
    (error) => error.message === `handoff note not found: ${missingPath}`,
  );
});

test('claimHandoff throws when the note has already been claimed', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox, { status: 'claimed' });
  assert.throws(
    () => claimHandoff(handoffPath, { sessionId: SESSION_ID, now: NOW }),
    /cannot claim handoff with status claimed/,
  );
});

test('completeHandoff moves a claimed note to done with completion metadata', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox, { status: 'claimed' });
  completeHandoff(handoffPath, { now: NOW });
  const completed = readNote(handoffPath);
  assert.match(completed, /^status: done$/m);
  assert.match(completed, /^completed_at: /m);
});

test('completeHandoff reports the path of a missing note', (t) => {
  const sandbox = createSandbox(t);
  const missingPath = path.join(sandbox.repoRoot, 'missing-complete.md');
  assert.throws(
    () => completeHandoff(missingPath, { now: NOW }),
    (error) => error.message === `handoff note not found: ${missingPath}`,
  );
});

test('completeHandoff throws when the note is still open', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  assert.throws(
    () => completeHandoff(handoffPath, { now: NOW }),
    /cannot complete handoff with status open/,
  );
});

test('supersedeClaimed completes this session note and names its replacement', (t) => {
  const sandbox = createSandbox(t);
  const directory = path.join(sandbox.repoRoot, 'handoffs');
  fs.mkdirSync(directory, { recursive: true });
  const oldPath = path.join(directory, 'old.md');
  const newPath = path.join(directory, 'new.md');
  fs.writeFileSync(oldPath, handoffText({ status: 'claimed', claimedBy: SESSION_ID }));
  fs.writeFileSync(newPath, handoffText());

  assert.deepEqual(
    supersedeClaimed(newPath, { sessionId: SESSION_ID, now: NOW }),
    [oldPath],
  );
  const completed = parseHandoff(readNote(oldPath)).frontmatter;
  assert.equal(completed.status, 'done');
  assert.equal(completed.completed_at, NOW.toISOString());
  assert.equal(completed.superseded_by, path.basename(newPath));
});

test('supersedeClaimed continues when one claimed note cannot be written', (t) => {
  const sandbox = createSandbox(t);
  const directory = path.join(sandbox.repoRoot, 'handoffs');
  fs.mkdirSync(directory, { recursive: true });
  const firstPath = path.join(directory, 'first.md');
  const secondPath = path.join(directory, 'second.md');
  const thirdPath = path.join(directory, 'third.md');
  const newPath = path.join(directory, 'new.md');
  for (const notePath of [firstPath, secondPath, thirdPath]) {
    fs.writeFileSync(notePath, handoffText({ status: 'claimed', claimedBy: SESSION_ID }));
  }
  fs.writeFileSync(newPath, handoffText());

  const originalRenameSync = fs.renameSync;
  fs.renameSync = function (sourcePath, targetPath, ...args) {
    if (targetPath === secondPath) {
      const error = new Error('permission denied');
      error.code = 'EACCES';
      throw error;
    }
    return originalRenameSync.call(this, sourcePath, targetPath, ...args);
  };
  t.after(() => {
    fs.renameSync = originalRenameSync;
  });

  const supersededPaths = supersedeClaimed(newPath, { sessionId: SESSION_ID, now: NOW });

  assert.deepEqual([...supersededPaths].sort(), [firstPath, thirdPath].sort());
  assert.equal(parseHandoff(readNote(firstPath)).frontmatter.status, 'done');
  assert.equal(parseHandoff(readNote(secondPath)).frontmatter.status, 'claimed');
  assert.equal(parseHandoff(readNote(thirdPath)).frontmatter.status, 'done');
});

for (const [label, sessionId] of [
  ['empty', ''],
  ['missing', undefined],
  ['multi-line', 'session\nid'],
]) {
  test(`supersedeClaimed rejects a ${label} session id`, (t) => {
    const sandbox = createSandbox(t);
    const directory = path.join(sandbox.repoRoot, 'handoffs');
    fs.mkdirSync(directory, { recursive: true });
    const oldPath = path.join(directory, 'old.md');
    const newPath = path.join(directory, 'new.md');
    fs.writeFileSync(oldPath, handoffText({ status: 'claimed', claimedBy: SESSION_ID }));
    fs.writeFileSync(newPath, handoffText());

    assert.throws(
      () => supersedeClaimed(newPath, { sessionId, now: NOW }),
      (error) => error.message === 'sessionId must be a non-empty single-line value',
    );
    assert.equal(parseHandoff(readNote(oldPath)).frontmatter.status, 'claimed');
  });
}

test('supersedeClaimed completes an open note this session wrote but never prepared', (t) => {
  const sandbox = createSandbox(t);
  const directory = path.join(sandbox.repoRoot, 'handoffs');
  fs.mkdirSync(directory, { recursive: true });
  const orphanPath = path.join(directory, 'orphan.md');
  const newPath = path.join(directory, 'new.md');
  fs.writeFileSync(orphanPath, handoffText());
  fs.writeFileSync(newPath, handoffText());

  assert.deepEqual(
    supersedeClaimed(newPath, { sessionId: SESSION_ID, now: NOW }),
    [orphanPath],
  );
  const completed = parseHandoff(readNote(orphanPath)).frontmatter;
  assert.equal(completed.status, 'done');
  assert.equal(completed.superseded_by, path.basename(newPath));
  assert.equal(parseHandoff(readNote(newPath)).frontmatter.status, 'open');
});

test('claim and complete pin a permissive note to owner-only access', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  fs.chmodSync(handoffPath, 0o644);
  claimHandoff(handoffPath, { sessionId: SESSION_ID, now: NOW });
  assert.equal(fs.statSync(handoffPath).mode & 0o777, 0o600);
});

test('supersedeClaimed leaves unrelated and malformed notes untouched', (t) => {
  const sandbox = createSandbox(t);
  const directory = path.join(sandbox.repoRoot, 'handoffs');
  fs.mkdirSync(directory, { recursive: true });
  const notes = [
    ['other-session.md', { status: 'claimed', claimedBy: 'session-other-00000002' }],
    ['open-other.md', { status: 'open', sessionId: 'session-other-00000002' }],
    ['done.md', { status: 'done', claimedBy: SESSION_ID }],
    ['new.md', { status: 'claimed', claimedBy: SESSION_ID }],
  ].map(([fileName, options]) => {
    const filePath = path.join(directory, fileName);
    fs.writeFileSync(filePath, handoffText(options));
    return filePath;
  });
  const malformedPath = path.join(directory, 'malformed.md');
  fs.writeFileSync(malformedPath, 'This note has no frontmatter.');
  const untouchedPaths = [...notes, malformedPath];
  const originals = untouchedPaths.map((filePath) => fs.readFileSync(filePath, 'utf8'));

  assert.deepEqual(
    supersedeClaimed(path.join(directory, 'new.md'), {
      sessionId: SESSION_ID,
      now: NOW,
    }),
    [],
  );
  untouchedPaths.forEach((filePath, index) => {
    assert.equal(fs.readFileSync(filePath, 'utf8'), originals[index]);
  });
});

test('preparePending writes the exact pending record shape', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  const record = preparePending({
    loopId: LOOP_ID,
    handoffPath,
    sessionId: SESSION_ID,
    runtime: 'claude',
    name: 'handoff-session',
    cwd: sandbox.repoRoot,
    hops: 2,
    env: sandbox.env,
    now: NOW,
  });
  assert.deepEqual(record, {
    version: 1,
    status: 'pending',
    loopId: LOOP_ID,
    handoff: handoffPath,
    sessionId: SESSION_ID,
    runtime: 'claude',
    name: 'handoff-session',
    cwd: sandbox.repoRoot,
    hops: 2,
    preparedAt: NOW.toISOString(),
  });
  assert.deepEqual(
    JSON.parse(fs.readFileSync(relaunchFilePath(LOOP_ID, sandbox.env), 'utf8')),
    record,
  );
});

test('arm changes pending to armed, records the live cwd, and is idempotent', (t) => {
  const sandbox = createSandbox(t);
  writeRelaunchRecord(sandbox, {
    version: 1,
    status: 'pending',
    loopId: LOOP_ID,
    handoff: '/tmp/handoff.md',
    sessionId: SESSION_ID,
    runtime: 'claude',
    name: null,
    cwd: '/tmp/old-cwd',
    hops: 3,
    preparedAt: NOW.toISOString(),
  });
  const liveCwd = path.join(sandbox.repoRoot, 'live-cwd');
  const armed = arm({ loopId: LOOP_ID, cwd: liveCwd, env: sandbox.env, now: NOW });
  assert.equal(armed.status, 'armed');
  assert.equal(armed.armedAt, NOW.toISOString());
  assert.equal(armed.cwd, liveCwd);
  const repeated = arm({
    loopId: LOOP_ID,
    cwd: '/tmp/ignored-cwd',
    env: sandbox.env,
    now: new Date(NOW.getTime() + 5000),
  });
  assert.deepEqual(repeated, armed);
});

test('arm returns null when no pending record exists', (t) => {
  const sandbox = createSandbox(t);
  assert.equal(arm({ loopId: LOOP_ID, cwd: sandbox.repoRoot, env: sandbox.env, now: NOW }), null);
});

test('arm returns null for every status except pending and armed', (t) => {
  const sandbox = createSandbox(t);
  for (const status of ['disarmed', 'claimed', 'done', 'unknown']) {
    writeRelaunchRecord(sandbox, { loopId: LOOP_ID, status });
    assert.equal(arm({ loopId: LOOP_ID, env: sandbox.env, now: NOW }), null);
  }
});

test('arm returns null when the record cannot be read', (t) => {
  const sandbox = createSandbox(t);
  const filePath = relaunchFilePath(LOOP_ID, sandbox.env);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify({ loopId: LOOP_ID, status: 'pending' }));
  const originalReadFileSync = fs.readFileSync;
  fs.readFileSync = function (readPath, ...args) {
    if (readPath === filePath) {
      const error = new Error('permission denied');
      error.code = 'EACCES';
      throw error;
    }
    return originalReadFileSync.call(this, readPath, ...args);
  };
  t.after(() => {
    fs.readFileSync = originalReadFileSync;
  });

  assert.equal(arm({ loopId: LOOP_ID, env: sandbox.env, now: NOW }), null);
});

test('unarm records disarmed status and the supplied reason', (t) => {
  const sandbox = createSandbox(t);
  writeRelaunchRecord(sandbox, { loopId: LOOP_ID, status: 'armed', armedAt: NOW.toISOString() });
  const record = unarm({ loopId: LOOP_ID, env: sandbox.env, reason: 'killer-timeout', now: NOW });
  assert.equal(record.status, 'disarmed');
  assert.equal(record.disarmReason, 'killer-timeout');
});

test('readRelaunchFile returns the parsed record or null when absent', (t) => {
  const sandbox = createSandbox(t);
  const record = { version: 1, status: 'pending', loopId: LOOP_ID };
  writeRelaunchRecord(sandbox, record);
  assert.deepEqual(readRelaunchFile(LOOP_ID, sandbox.env), record);
  assert.equal(readRelaunchFile('loop-missing', sandbox.env), null);
});

test('readRelaunchFile treats invalid JSON as absent and logs the loop id', (t) => {
  const sandbox = createSandbox(t);
  const filePath = relaunchFilePath(LOOP_ID, sandbox.env);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, '{invalid');

  assert.equal(readRelaunchFile(LOOP_ID, sandbox.env), null);
  const logPath = path.join(stateDir(sandbox.env), 'relaunch.log');
  const lines = fs.readFileSync(logPath, 'utf8').trimEnd().split('\n');
  assert.equal(lines.length, 1);
  assert.match(lines[0], new RegExp(' corrupt-relaunch-file loop=' + LOOP_ID + '$'));
});

test('readRelaunchFile still returns null when the corruption log write fails', (t) => {
  const sandbox = createSandbox(t);
  const filePath = relaunchFilePath(LOOP_ID, sandbox.env);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, '{invalid');
  fs.mkdirSync(path.join(stateDir(sandbox.env), 'relaunch.log'), { recursive: true });

  assert.equal(readRelaunchFile(LOOP_ID, sandbox.env), null);
});

test('shouldRelaunch declines when there is no record', (t) => {
  createSandbox(t);
  assert.deepEqual(
    shouldRelaunch(null, { now: NOW.getTime(), maxHops: 10, maxAgeMin: 10 }),
    { relaunch: false, reason: 'no-file' },
  );
});

test('shouldRelaunch declines a pending record', (t) => {
  createSandbox(t);
  assert.deepEqual(
    shouldRelaunch(
      { status: 'pending', hops: 0 },
      { now: NOW.getTime(), maxHops: 10, maxAgeMin: 10 },
    ),
    { relaunch: false, reason: 'not-armed' },
  );
});

test('shouldRelaunch accepts an armed record at exactly ten minutes old', (t) => {
  createSandbox(t);
  const armedAt = NOW.getTime();
  const result = shouldRelaunch(
    { status: 'armed', armedAt, hops: 0, handoff: '/repo/note.md', cwd: '/repo' },
    { now: armedAt + 10 * 60 * 1000, maxHops: 10, maxAgeMin: 10 },
  );
  assert.deepEqual(result, { relaunch: true });
});

test('shouldRelaunch declines a record armed in the future as stale', (t) => {
  createSandbox(t);
  const armedAt = NOW.getTime();
  assert.deepEqual(
    shouldRelaunch(
      { status: 'armed', armedAt, hops: 0 },
      { now: armedAt - 1, maxHops: 10, maxAgeMin: 10 },
    ),
    { relaunch: false, reason: 'stale' },
  );
});

test('shouldRelaunch declines an armed record one millisecond beyond ten minutes', (t) => {
  createSandbox(t);
  const armedAt = NOW.getTime();
  assert.deepEqual(
    shouldRelaunch(
      { status: 'armed', armedAt, hops: 0 },
      { now: armedAt + 10 * 60 * 1000 + 1, maxHops: 10, maxAgeMin: 10 },
    ),
    { relaunch: false, reason: 'stale' },
  );
});

test('shouldRelaunch accepts hop nine below the default cap', (t) => {
  createSandbox(t);
  assert.deepEqual(
    shouldRelaunch(
      { status: 'armed', armedAt: NOW.getTime(), hops: 9, handoff: '/repo/note.md', cwd: '/repo' },
      { now: NOW.getTime(), maxHops: 10, maxAgeMin: 10 },
    ),
    { relaunch: true },
  );
});

test('shouldRelaunch declines hop ten at the default cap', (t) => {
  createSandbox(t);
  assert.deepEqual(
    shouldRelaunch(
      { status: 'armed', armedAt: NOW.getTime(), hops: 10 },
      { now: NOW.getTime(), maxHops: 10, maxAgeMin: 10 },
    ),
    { relaunch: false, reason: 'hop-cap' },
  );
});

test('appendLog writes exactly one formatted line for every call', (t) => {
  const sandbox = createSandbox(t);
  appendLog('prepare', { loopId: LOOP_ID, status: 'pending' }, sandbox.env, NOW);
  appendLog(
    'arm',
    { loopId: LOOP_ID, status: 'armed' },
    sandbox.env,
    new Date(NOW.getTime() + 1000),
  );
  const logPath = path.join(stateDir(sandbox.env), 'relaunch.log');
  const lines = fs.readFileSync(logPath, 'utf8').trimEnd().split('\n');
  assert.deepEqual(lines, [
    `${NOW.toISOString()} prepare loopId=${LOOP_ID} status=pending`,
    `${new Date(NOW.getTime() + 1000).toISOString()} arm loopId=${LOOP_ID} status=armed`,
  ]);
});

test('appendLog restores private mode on an existing permissive log file', (t) => {
  const sandbox = createSandbox(t);
  const logPath = path.join(stateDir(sandbox.env), 'relaunch.log');
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.writeFileSync(logPath, '');
  fs.chmodSync(logPath, 0o644);

  appendLog('mode-repair', { loopId: LOOP_ID }, sandbox.env, NOW);

  assert.equal(fs.statSync(logPath).mode & 0o777, 0o600);
});

test('manualClaimCommand places the quoted seed where each runtime expects it', () => {
  const handoffPath = '/tmp/handoff.md';
  const seed = `"[session-relaunch] claim and continue handoff ${handoffPath}"`;
  const commands = {
    claude: `skilled-loop claude ${seed}`,
    pi: `skilled-loop pi ${seed}`,
    opencode: `skilled-loop opencode --prompt ${seed}`,
    codex: `skilled-loop codex ${seed}`,
    cursor: `skilled-loop cursor ${seed}`,
    hermes: `skilled-loop hermes chat -q ${seed}`,
    devin: `skilled-loop devin -- ${seed}`,
  };
  for (const [runtime, expected] of Object.entries(commands)) {
    assert.equal(manualClaimCommand(runtime, handoffPath), expected);
  }
});

test('manualClaimCommand carries packet and skip answers in the seed', () => {
  const handoffPath = '/tmp/handoff.md';
  const packetSuffix = ' | Spec folder: specs/hooks/001-session-relaunch'
    + ' (carried from the handoff; Gate 3 answered in the sending session)';
  const skipSuffix = ' | Spec folder: none (Gate 3 answered D, Skip, in the sending session)';

  assert.equal(
    manualClaimCommand('claude', handoffPath, 'specs/hooks/001-session-relaunch'),
    `skilled-loop claude "[session-relaunch] claim and continue handoff ${handoffPath}`
      + `${packetSuffix}"`,
  );
  assert.equal(
    manualClaimCommand('claude', handoffPath, 'none'),
    `skilled-loop claude "[session-relaunch] claim and continue handoff ${handoffPath}`
      + `${skipSuffix}"`,
  );
});

test('validSpecFolder requires a numbered leaf and rejects traversal and line breaks', () => {
  for (const specFolder of [
    'specs/hooks/001-example',
    'specs/hooks/023-session-relaunch-loop/001-example',
  ]) {
    assert.equal(validSpecFolder(specFolder), true);
  }
  for (const specFolder of [
    '',
    'specs/hooks/session-relaunch',
    'specs/hooks/../001-example',
    'specs/hooks/001-example\r',
    'specs/hooks/001-example\n',
  ]) {
    assert.equal(validSpecFolder(specFolder), false);
  }
});

test('manualClaimCommand omits an unnumbered spec-folder answer', () => {
  const handoffPath = '/tmp/handoff.md';
  const expected = `skilled-loop claude "[session-relaunch] claim and continue handoff `
    + `${handoffPath}"`;

  assert.equal(
    manualClaimCommand('claude', handoffPath, 'specs/hooks/session-relaunch'),
    expected,
  );
});

test('manualClaimCommand omits empty and invalid spec-folder answers', () => {
  const handoffPath = '/tmp/handoff.md';
  const expected = `skilled-loop claude "[session-relaunch] claim and continue handoff `
    + `${handoffPath}"`;

  for (const specFolder of ['', 'specs/hooks/../outside', 'not-a-spec-folder']) {
    assert.equal(manualClaimCommand('claude', handoffPath, specFolder), expected);
  }
});

test('manualClaimCommand escapes shell-sensitive characters in the handoff path', () => {
  assert.equal(
    manualClaimCommand('claude', '/tmp/hand "off" `a` $b \\c.md'),
    'skilled-loop claude "[session-relaunch] claim and continue handoff '
      + '/tmp/hand \\"off\\" \\`a\\` \\$b \\\\c.md"',
  );
});

test('manualClaimCommand ignores inherited Object properties as runtime names', () => {
  const seed = '"[session-relaunch] claim and continue handoff /tmp/handoff.md"';
  assert.equal(manualClaimCommand('__proto__', '/tmp/handoff.md'), `skilled-loop __proto__ ${seed}`);
  assert.equal(
    manualClaimCommand('constructor', '/tmp/handoff.md'),
    `skilled-loop constructor ${seed}`,
  );
});

test('manualClaimCommand closes double quotes around a single-quoted bang', () => {
  assert.equal(
    manualClaimCommand('claude', '/tmp/han!doff.md'),
    `skilled-loop claude "[session-relaunch] claim and continue handoff `
      + `/tmp/han"'!'"doff.md"`,
  );
});

test('manualClaimCommand preserves a bang path in interactive bash', () => {
  const handoffPath = '/tmp/han!doff.md';
  const manualCommand = manualClaimCommand('claude', handoffPath);
  const commandArgument = manualCommand.slice('skilled-loop claude '.length);
  const bashResult = spawnSync('/bin/bash', ['--norc', '--noprofile', '-i'], {
    input: `set -H\nprintf '[%s]\\n' ${commandArgument}\n`,
    encoding: 'utf8',
  });
  const output = bashResult.stdout + bashResult.stderr;
  const expectedSeed = `[session-relaunch] claim and continue handoff ${handoffPath}`;

  assert.equal(bashResult.status, 0, output);
  assert.doesNotMatch(output, /event not found/);
  assert.ok(output.includes(`[${expectedSeed}]`), output);
});

test('manualClaimCommand uses a single-token template and keeps its default otherwise', () => {
  const handoffPath = '/tmp/handoff.md';
  const defaultCommand =
    `skilled-loop claude "[session-relaunch] claim and continue handoff ${handoffPath}"`;
  const previousTemplate = process.env.SKILLED_LOOP_MANUAL_TEMPLATE;

  try {
    delete process.env.SKILLED_LOOP_MANUAL_TEMPLATE;
    assert.equal(manualClaimCommand('claude', handoffPath), defaultCommand);

    process.env.SKILLED_LOOP_MANUAL_TEMPLATE =
      "skilled-loop claude '--model' 'selected model' "
      + '"[session-relaunch] claim and continue handoff @@HANDOFF@@"';
    assert.equal(
      manualClaimCommand('claude', handoffPath),
      "skilled-loop claude '--model' 'selected model' "
        + `"[session-relaunch] claim and continue handoff ${handoffPath}"`,
    );

    for (const template of [
      'skilled-loop claude without a handoff token',
      'skilled-loop claude @@HANDOFF@@@@HANDOFF@@',
    ]) {
      process.env.SKILLED_LOOP_MANUAL_TEMPLATE = template;
      assert.equal(manualClaimCommand('claude', handoffPath), defaultCommand);
    }
  } finally {
    if (previousTemplate === undefined) {
      delete process.env.SKILLED_LOOP_MANUAL_TEMPLATE;
    } else {
      process.env.SKILLED_LOOP_MANUAL_TEMPLATE = previousTemplate;
    }
  }
});

test('manualClaimCommand keeps dollar sequences literal inside the template fill', () => {
  const template =
    'skilled-loop claude "[session-relaunch] claim and continue handoff @@HANDOFF@@"';
  const previousTemplate = process.env.SKILLED_LOOP_MANUAL_TEMPLATE;

  try {
    process.env.SKILLED_LOOP_MANUAL_TEMPLATE = template;
    for (const marker of ['$&', "$'", '$$', '$`', '$1']) {
      const handoffPath = `/tmp/handoff-${marker}-note.md`;
      const escapedPath = handoffPath
        .replace(/[\\"$`]/g, '\\$&')
        .replace(/!/g, "\"'!'\"");
      assert.equal(
        manualClaimCommand('claude', handoffPath),
        template.split('@@HANDOFF@@').join(escapedPath),
      );
    }
  } finally {
    if (previousTemplate === undefined) {
      delete process.env.SKILLED_LOOP_MANUAL_TEMPLATE;
    } else {
      process.env.SKILLED_LOOP_MANUAL_TEMPLATE = previousTemplate;
    }
  }
});

test('appendLog keeps every line when eight processes append concurrently', async (t) => {
  const sandbox = createSandbox(t);
  const corePath = path.resolve(__dirname, '../lib/relaunch-core.cjs');
  const workerCount = 8;
  const linesPerWorker = 25;
  const startAt = Date.now() + 750;
  const workers = [];
  for (let worker = 0; worker < workerCount; worker += 1) {
    const script = [
      `const core = require(${JSON.stringify(corePath)});`,
      `const env = { XDG_RUNTIME_DIR: ${JSON.stringify(sandbox.xdgRuntimeDir)} };`,
      `while (Date.now() < ${startAt}) {}`,
      `for (let index = 0; index < ${linesPerWorker}; index += 1) {`,
      `  core.appendLog('concurrent', { worker: ${worker}, index }, env);`,
      '}',
      '',
    ].join('\n');
    workers.push(spawn(process.execPath, ['-e', script], { stdio: 'ignore' }));
  }
  const exitCodes = await Promise.all(workers.map((worker) => new Promise((resolve) => {
    worker.once('error', () => resolve(-1));
    worker.once('exit', (code) => resolve(code ?? -1));
  })));
  assert.deepEqual(exitCodes, Array(workerCount).fill(0));

  const logPath = path.join(stateDir(sandbox.env), 'relaunch.log');
  const lines = fs.readFileSync(logPath, 'utf8').trimEnd().split('\n');
  assert.equal(lines.length, workerCount * linesPerWorker);
  const written = new Set(lines.map((line) => line.split(' ').slice(2).join(' ')));
  assert.equal(written.size, workerCount * linesPerWorker);
});

test('appendLog starts the next event on its own line after a partial line', (t) => {
  const sandbox = createSandbox(t);
  const logPath = path.join(stateDir(sandbox.env), 'relaunch.log');
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.writeFileSync(logPath, 'partial');

  appendLog('after-partial', { loopId: LOOP_ID }, sandbox.env, NOW);

  const lines = fs.readFileSync(logPath, 'utf8').split('\n');
  assert.equal(lines[0], 'partial');
  assert.match(lines[1], /after-partial loopId=loop-test-00000001/);
  assert.equal(lines[2], '');

  appendLog('after-full', { loopId: LOOP_ID }, sandbox.env, NOW);
  const updated = fs.readFileSync(logPath, 'utf8').split('\n');
  assert.equal(updated[3], '');
  assert.match(updated[2], /after-full loopId=loop-test-00000001/);
});

test('appendLog rejects a short write instead of reporting success', (t) => {
  const sandbox = createSandbox(t);
  const originalWriteSync = fs.writeSync;
  fs.writeSync = (descriptor, text) => {
    originalWriteSync(descriptor, String(text).slice(0, 10));
    return 10;
  };

  try {
    assert.throws(
      () => appendLog('short-write', { loopId: LOOP_ID }, sandbox.env, NOW),
      /relaunch log short write: wrote 10 of \d+ bytes/,
    );
  } finally {
    fs.writeSync = originalWriteSync;
  }
});

test('findLoopChildPid selects the ancestor directly below the loop', () => {
  const table = '41 50\n50 60\n60 100\n100 1\n';
  assert.equal(findLoopChildPid('100', { pid: 41, processTable: table }), 60);
  assert.equal(findLoopChildPid('999', { pid: 41, processTable: table }), null);
  assert.equal(findLoopChildPid('loop-id', { pid: 41, processTable: table }), null);
  assert.equal(findLoopChildPid('100', { pid: 41, processTable: null }), null);
});

test('readProcessTable returns null instead of blocking on a stuck ps', (t) => {
  const sandbox = createSandbox(t);
  const binDir = path.join(sandbox.root, 'bin');
  fs.mkdirSync(binDir, { recursive: true });
  fs.writeFileSync(path.join(binDir, 'ps'), '#!/bin/sh\nsleep 5\n', { mode: 0o755 });
  const originalPath = process.env.PATH;
  process.env.PATH = [binDir, originalPath || ''].join(path.delimiter);
  t.after(() => {
    process.env.PATH = originalPath;
  });

  const startedAt = Date.now();

  assert.equal(readProcessTable(), null);
  assert.ok(Date.now() - startedAt < 4000, 'a stuck ps read must be bounded below the 5s shim');
});

test('readProcessTable bounds the ps spawn with a timeout', (t) => {
  const modulePath = require.resolve('../lib/relaunch-core.cjs');
  const childProcess = require('node:child_process');
  const originalSpawnSync = childProcess.spawnSync;
  const calls = [];
  childProcess.spawnSync = (command, args, options) => {
    calls.push({ command, args, options });
    return {
      error: Object.assign(new Error('spawnSync ps ETIMEDOUT'), { code: 'ETIMEDOUT' }),
      status: null,
      stdout: '',
      stderr: '',
    };
  };
  delete require.cache[modulePath];
  t.after(() => {
    childProcess.spawnSync = originalSpawnSync;
    delete require.cache[modulePath];
  });

  const boundedCore = require('../lib/relaunch-core.cjs');

  assert.equal(boundedCore.readProcessTable(), null);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].command, 'ps');
  assert.ok(
    Number.isInteger(calls[0].options.timeout)
      && calls[0].options.timeout > 0
      && calls[0].options.timeout <= 5000,
    `ps read must carry a bounded timeout, got ${calls[0].options.timeout}`,
  );
});

test('liveKillerPid returns a live lock owner and null otherwise', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = 'loop-live-killer-0001';
  const lockPath = path.join(stateDir(sandbox.env), `killer-${loopId}.lock`);

  assert.equal(liveKillerPid(loopId, sandbox.env), null);
  assert.equal(liveKillerPid('../escape', sandbox.env), null);

  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  fs.writeFileSync(lockPath, `${process.pid} ${new Date().toISOString()}\n`);
  assert.equal(liveKillerPid(loopId, sandbox.env), process.pid);

  const deadOwner = spawn(process.execPath, ['-e', 'process.exit(0);'], { stdio: 'ignore' });
  await new Promise((resolve) => deadOwner.once('exit', resolve));
  fs.writeFileSync(lockPath, `${deadOwner.pid} ${new Date().toISOString()}\n`);
  assert.equal(liveKillerPid(loopId, sandbox.env), null);

  fs.writeFileSync(lockPath, '');
  assert.equal(liveKillerPid(loopId, sandbox.env), null);
});

test('liveKillerPid ignores a lock whose recorded expiry has passed', (t) => {
  const sandbox = createSandbox(t);
  const loopId = 'loop-lock-expiry-0001';
  const lockPath = path.join(stateDir(sandbox.env), `killer-${loopId}.lock`);
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  const createdIso = new Date(Date.now() - 60000).toISOString();

  fs.writeFileSync(
    lockPath,
    `${process.pid} ${createdIso} ${new Date(Date.now() - 1000).toISOString()}\n`,
  );
  assert.equal(liveKillerPid(loopId, sandbox.env), null);

  fs.writeFileSync(
    lockPath,
    `${process.pid} ${createdIso} ${new Date(Date.now() + 60000).toISOString()}\n`,
  );
  assert.equal(liveKillerPid(loopId, sandbox.env), process.pid);
});

test('liveKillerPid ages out a legacy lock without an expiry field', (t) => {
  const sandbox = createSandbox(t);
  const loopId = 'loop-lock-legacy-0001';
  const lockPath = path.join(stateDir(sandbox.env), `killer-${loopId}.lock`);
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });

  fs.writeFileSync(
    lockPath,
    `${process.pid} ${new Date(Date.now() - 11 * 60 * 1000).toISOString()}\n`,
  );
  assert.equal(liveKillerPid(loopId, sandbox.env), null);

  fs.writeFileSync(lockPath, `${process.pid} ${new Date().toISOString()}\n`);
  assert.equal(liveKillerPid(loopId, sandbox.env), process.pid);
});

test('liveKillerPid reads the killer lock once so a vanished lock reports no owner', (t) => {
  const sandbox = createSandbox(t);
  const loopId = 'loop-lock-single-read-0001';
  const lockPath = path.join(stateDir(sandbox.env), `killer-${loopId}.lock`);
  const originalReadFileSync = fs.readFileSync;
  let lockReads = 0;
  fs.readFileSync = function (readPath, ...args) {
    if (readPath === lockPath) {
      lockReads += 1;
      if (lockReads === 1) {
        return `${process.pid} ${new Date().toISOString()} `
          + `${new Date(Date.now() + 60000).toISOString()}\n`;
      }
      const error = new Error('no such file or directory');
      error.code = 'ENOENT';
      throw error;
    }
    return originalReadFileSync.call(this, readPath, ...args);
  };
  t.after(() => {
    fs.readFileSync = originalReadFileSync;
  });

  assert.equal(liveKillerPid(loopId, sandbox.env), process.pid);
  assert.equal(lockReads, 1);
});

test('readLockState reports the owner and expiry from one read', (t) => {
  const sandbox = createSandbox(t);
  const lockPath = path.join(sandbox.root, 'killer-lock-state.lock');
  const createdIso = new Date(Date.now() - 60000).toISOString();

  assert.deepEqual(readLockState(path.join(sandbox.root, 'killer-lock-state-absent.lock')), {
    ownerPid: null,
    expired: false,
  });

  fs.writeFileSync(
    lockPath,
    `${process.pid} ${createdIso} ${new Date(Date.now() - 1000).toISOString()}\n`,
  );
  assert.deepEqual(readLockState(lockPath), { ownerPid: process.pid, expired: true });

  fs.writeFileSync(
    lockPath,
    `${process.pid} ${createdIso} ${new Date(Date.now() + 60000).toISOString()}\n`,
  );
  assert.deepEqual(readLockState(lockPath), { ownerPid: process.pid, expired: false });

  fs.writeFileSync(
    lockPath,
    `${process.pid} ${new Date(Date.now() - 11 * 60 * 1000).toISOString()}\n`,
  );
  assert.deepEqual(readLockState(lockPath), { ownerPid: process.pid, expired: true });
});

test('lockIsExpired keeps an unparseable lock', (t) => {
  const sandbox = createSandbox(t);
  const lockPath = path.join(sandbox.root, 'killer-unparseable.lock');

  assert.equal(lockIsExpired(path.join(sandbox.root, 'killer-absent.lock')), false);
  fs.writeFileSync(lockPath, `${process.pid} not-a-timestamp\n`);
  assert.equal(lockIsExpired(lockPath), false);
  assert.equal(lockIsExpired(lockPath, Date.now() + 60 * 60 * 1000), false);
});

test('manual claim commands balance their parentheses for every spec answer', () => {
  for (const specFolder of ['none', 'specs/hooks/001-example', '']) {
    const command = manualClaimCommand('claude', '/tmp/handoff.md', specFolder);
    assert.equal(
      (command.match(/\(/g) || []).length,
      (command.match(/\)/g) || []).length,
      command,
    );
  }
});

const relaunchCore = require('../lib/relaunch-core.cjs');

test('shouldRelaunch declines a fresh armed record that names no handoff or no cwd', (t) => {
  createSandbox(t);
  const fresh = { status: 'armed', armedAt: NOW.getTime(), hops: 0 };
  const options = { now: NOW.getTime(), maxHops: 10, maxAgeMin: 10 };
  for (const record of [
    { ...fresh, cwd: '/repo' },
    { ...fresh, handoff: '/repo/note.md' },
    { ...fresh, handoff: '', cwd: '/repo' },
    { ...fresh, handoff: '/repo/note.md', cwd: 42 },
  ]) {
    assert.deepEqual(
      shouldRelaunch(record, options),
      { relaunch: false, reason: 'incomplete-record' },
      JSON.stringify(record),
    );
  }
  // Staleness still wins, so a reader that only asks about age keeps its answer.
  assert.deepEqual(
    shouldRelaunch({ ...fresh, armedAt: NOW.getTime() - 11 * 60 * 1000 }, options),
    { relaunch: false, reason: 'stale' },
  );
});

test('claimHandoff updates a status key written with a space before the colon', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  fs.writeFileSync(handoffPath, readNote(handoffPath).replace('status: open', 'status : open'));

  claimHandoff(handoffPath, { sessionId: SESSION_ID, now: NOW });

  const parsed = parseHandoff(readNote(handoffPath));
  assert.equal(parsed.frontmatter.status, 'claimed');
  assert.equal(readNote(handoffPath).match(/^\s*status\s*:/gm).length, 1);
});

test('noteState classifies a note as missing, invalid, open, claimed or done', (t) => {
  const sandbox = createSandbox(t);
  const { noteState } = relaunchCore;
  const handoffPath = writeHandoff(sandbox);
  assert.equal(noteState(handoffPath), 'open');
  fs.writeFileSync(handoffPath, handoffText({ status: 'claimed', claimedBy: SESSION_ID }));
  assert.equal(noteState(handoffPath), 'claimed');
  fs.writeFileSync(handoffPath, handoffText({ status: 'done' }));
  assert.equal(noteState(handoffPath), 'done');
  fs.writeFileSync(handoffPath, handoffText({ status: 'archived' }));
  assert.equal(noteState(handoffPath), 'invalid');
  fs.writeFileSync(handoffPath, 'status: open\n');
  assert.equal(noteState(handoffPath), 'invalid');
  assert.equal(noteState(path.join(sandbox.repoRoot, 'absent.md')), 'missing');
  assert.equal(noteState(''), 'missing');
  assert.equal(noteState(undefined), 'missing');
  // A directory at the note path is unreadable as a note, not absent.
  assert.equal(noteState(sandbox.repoRoot), 'invalid');
});

test('resolveKillerTarget keeps a preferred pid inside the loop and otherwise walks to the loop child', () => {
  const { resolveKillerTarget } = relaunchCore;
  // 41 is the hook, 50 its shell, 60 the runtime below loop 100; 70 is a sibling of the loop.
  const table = '41 50\n50 60\n60 100\n100 1\n70 1\n';
  assert.equal(resolveKillerTarget('100', { preferredPid: '60', pid: 41, processTable: table }), 60);
  assert.equal(resolveKillerTarget('100', { preferredPid: 50, pid: 41, processTable: table }), 50);
  assert.equal(resolveKillerTarget('100', { preferredPid: '70', pid: 41, processTable: table }), 60);
  assert.equal(resolveKillerTarget('100', { preferredPid: 'abc', pid: 41, processTable: table }), 60);
  assert.equal(resolveKillerTarget('100', { preferredPid: '100', pid: 41, processTable: table }), 60);
  assert.equal(resolveKillerTarget('100', { pid: 41, processTable: table }), 60);
  assert.equal(resolveKillerTarget('999', { preferredPid: '60', pid: 41, processTable: table }), null);
  assert.equal(resolveKillerTarget('loop-id', { pid: 41, processTable: table }), null);
});
