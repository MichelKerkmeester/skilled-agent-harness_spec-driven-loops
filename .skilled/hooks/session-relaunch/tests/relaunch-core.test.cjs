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
const relaunchCore = require('../lib/relaunch-core.cjs');
const {
  stateDir,
  ensureStateDir,
  relaunchFilePath,
  parseHandoff,
  validateHandoff,
  preparePending,
  arm,
  unarm,
  markDeferred,
  markSignalled,
  withdrawRecord,
  readRelaunchFile,
  shouldRelaunch,
  claimHandoff,
  completeHandoff,
  supersedeClaimed,
  appendLog,
  manualClaimCommand,
  validSpecFolder,
  findLoopChildPid,
  hostRuntimePid,
  nestedUnderLoop,
  dropNestedLoop,
  readProcessTable,
  liveKillerPid,
  lockIsExpired,
  readLockState,
  goalPacketProblem,
  goalSwitchOn,
  resolveGoalPacket,
  recordGoalPacket,
} = relaunchCore;

// The suite also runs from inside a looped session, whose wrapper exports these variables,
// and a case that reads the default environment would then describe the outer loop.
for (const key of Object.keys(process.env)) {
  if (key.startsWith('SKILLED_LOOP_')) delete process.env[key];
}
// The goal reader honors this override, so a value inherited from an operator shell would
// send the record lookups to a directory these cases never wrote.
delete process.env.OPENCODE_GOAL_STATE_DIR;

const SESSION_ID = 'session-test-00000001';
const LOOP_ID = 'loop-test-00000001';
const NOW = new Date('2026-10-16T12:00:00.000Z');
const DEFAULT_SECTIONS = {
  Goal: 'Finish the session relaunch loop.',
  Done: 'The captured hook payloads are ready.',
  'Remaining work': 'Build the core and adapters.',
  'In-flight state': 'No child process is running.',
};
// A runtime launched from a tool shell sits two processes below its loop: the shell it
// started from, then the loop's own runtime.
const NESTED_PROCESS_TABLE = [
  '300 250 pi',
  '250 200 zsh',
  '200 100 claude',
  '100 1 bash',
  '',
].join('\n');

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

// A claim lands under the note's lock, so a supersede that read the note outside it could
// write back a stale copy over the claim. The lock has to cover the read and the write.
test('supersedeClaimed reads and rewrites each candidate note under its lock', (t) => {
  const sandbox = createSandbox(t);
  const directory = path.join(sandbox.repoRoot, 'handoffs');
  fs.mkdirSync(directory, { recursive: true });
  const oldPath = path.join(directory, 'old.md');
  const orphanPath = path.join(directory, 'orphan.md');
  const newPath = path.join(directory, 'new.md');
  fs.writeFileSync(oldPath, handoffText({ status: 'claimed', claimedBy: SESSION_ID }));
  fs.writeFileSync(orphanPath, handoffText());
  fs.writeFileSync(newPath, handoffText());

  const realReadFileSync = fs.readFileSync;
  const realRenameSync = fs.renameSync;
  const lockHeldAt = [];
  fs.readFileSync = (target, ...rest) => {
    const resolved = path.resolve(String(target));
    if (resolved === oldPath || resolved === orphanPath) {
      lockHeldAt.push(['read', resolved, fs.existsSync(`${resolved}.lock`)]);
    }
    return realReadFileSync(target, ...rest);
  };
  fs.renameSync = (from, to) => {
    const resolved = path.resolve(String(to));
    if (resolved === oldPath || resolved === orphanPath) {
      lockHeldAt.push(['write', resolved, fs.existsSync(`${resolved}.lock`)]);
    }
    return realRenameSync(from, to);
  };
  t.after(() => {
    fs.readFileSync = realReadFileSync;
    fs.renameSync = realRenameSync;
  });

  assert.equal(supersedeClaimed(newPath, { sessionId: SESSION_ID, now: NOW }).length, 2);

  assert.deepEqual(
    lockHeldAt.sort((a, b) => `${a[1]}${a[0]}`.localeCompare(`${b[1]}${b[0]}`)),
    [
      ['read', oldPath, true],
      ['write', oldPath, true],
      ['read', orphanPath, true],
      ['write', orphanPath, true],
    ].sort((a, b) => `${a[1]}${a[0]}`.localeCompare(`${b[1]}${b[0]}`)),
  );
  assert.equal(fs.existsSync(`${oldPath}.lock`), false);
  assert.equal(fs.existsSync(`${orphanPath}.lock`), false);
  assert.equal(fs.existsSync(`${newPath}.lock`), false);
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

test('arm changes pending to armed, records the live cwd, and a re-arm restamps both', (t) => {
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
  // A re-arm only reaches an armed record once its killer is gone, so the age the
  // wrapper checks restarts with the killer that replaces it, from the live cwd.
  const later = new Date(NOW.getTime() + 5000);
  const repeated = arm({ loopId: LOOP_ID, cwd: '/tmp/later-cwd', env: sandbox.env, now: later });
  assert.equal(repeated.armedAt, later.toISOString());
  assert.equal(repeated.cwd, '/tmp/later-cwd');
  assert.notEqual(repeated.armId, armed.armId);
  assert.deepEqual(readRelaunchFile(LOOP_ID, sandbox.env), repeated);
});

test('arm stamps a fresh armId on every arm even in the same millisecond', (t) => {
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
    hops: 0,
    preparedAt: NOW.toISOString(),
  });
  const first = arm({ loopId: LOOP_ID, cwd: '/tmp/cwd', env: sandbox.env, now: NOW });
  const second = arm({ loopId: LOOP_ID, cwd: '/tmp/cwd', env: sandbox.env, now: NOW });

  assert.equal(typeof first.armId, 'string');
  assert.ok(first.armId.length > 0);
  assert.equal(second.armedAt, first.armedAt);
  assert.notEqual(second.armId, first.armId);
  assert.deepEqual(readRelaunchFile(LOOP_ID, sandbox.env), second);
});

test('a re-arm makes an armed record older than the age limit relaunchable again', (t) => {
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
    hops: 0,
    preparedAt: NOW.toISOString(),
  });
  const firstArm = new Date(NOW.getTime() - 20 * 60 * 1000);
  arm({ loopId: LOOP_ID, cwd: '/tmp/old-cwd', env: sandbox.env, now: firstArm });
  assert.deepEqual(
    shouldRelaunch(readRelaunchFile(LOOP_ID, sandbox.env), { now: NOW.getTime(), maxAgeMin: 10 }),
    { relaunch: false, reason: 'stale' },
  );

  arm({ loopId: LOOP_ID, cwd: '/tmp/live-cwd', env: sandbox.env, now: NOW });

  assert.deepEqual(
    shouldRelaunch(readRelaunchFile(LOOP_ID, sandbox.env), { now: NOW.getTime(), maxAgeMin: 10 }),
    { relaunch: true },
  );
});

// Some runtimes exit 130 on SIGTERM as well as on an interrupt, so the stamp is how the
// wrapper tells the killer's signal from the operator's. It must name only the arm the
// killer watched, and a later arm must not inherit it.
test('markSignalled stamps only the armed record it was given, and a re-arm clears it', (t) => {
  const sandbox = createSandbox(t);
  writeRelaunchRecord(sandbox, {
    version: 1,
    status: 'pending',
    loopId: LOOP_ID,
    handoff: '/tmp/handoff.md',
    sessionId: SESSION_ID,
    runtime: 'opencode',
    cwd: '/tmp/cwd',
    hops: 0,
    preparedAt: NOW.toISOString(),
  });
  const armed = arm({ loopId: LOOP_ID, cwd: '/tmp/cwd', env: sandbox.env, now: NOW });
  const expected = { handoff: armed.handoff, armId: armed.armId, armedAt: armed.armedAt };

  assert.equal(
    markSignalled({ loopId: LOOP_ID, ...expected, armId: 'another-arm', env: sandbox.env }),
    null,
  );
  assert.equal(
    markSignalled({ loopId: LOOP_ID, ...expected, handoff: '/tmp/other.md', env: sandbox.env }),
    null,
  );
  assert.equal(readRelaunchFile(LOOP_ID, sandbox.env).signalledAt, undefined);

  const signalled = markSignalled({ loopId: LOOP_ID, ...expected, env: sandbox.env, now: NOW });
  assert.equal(signalled.signalledAt, NOW.toISOString());
  assert.equal(readRelaunchFile(LOOP_ID, sandbox.env).signalledAt, NOW.toISOString());

  const rearmed = arm({ loopId: LOOP_ID, cwd: '/tmp/cwd', env: sandbox.env, now: NOW });
  assert.equal(Object.hasOwn(rearmed, 'signalledAt'), false);
  assert.equal(Object.hasOwn(readRelaunchFile(LOOP_ID, sandbox.env), 'signalledAt'), false);

  unarm({ loopId: LOOP_ID, reason: 'cancelled', env: sandbox.env });
  assert.equal(
    markSignalled({ loopId: LOOP_ID, handoff: rearmed.handoff, armId: rearmed.armId, env: sandbox.env }),
    null,
  );
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

test('unarm leaves the record armed when expectedArmId is stale', (t) => {
  const sandbox = createSandbox(t);
  writeRelaunchRecord(sandbox, {
    loopId: LOOP_ID,
    status: 'armed',
    armedAt: NOW.toISOString(),
    armId: 'arm-current-0001',
  });

  assert.equal(unarm({
    loopId: LOOP_ID,
    env: sandbox.env,
    reason: 'killer-timeout',
    expectedArmId: 'arm-stale-0001',
    now: NOW,
  }), null);
  assert.equal(readRelaunchFile(LOOP_ID, sandbox.env).status, 'armed');
});

test('unarm disarms the record when expectedArmId matches', (t) => {
  const sandbox = createSandbox(t);
  writeRelaunchRecord(sandbox, {
    loopId: LOOP_ID,
    status: 'armed',
    armedAt: NOW.toISOString(),
    armId: 'arm-current-0001',
  });

  const record = unarm({
    loopId: LOOP_ID,
    env: sandbox.env,
    reason: 'killer-timeout',
    expectedArmId: 'arm-current-0001',
    now: NOW,
  });
  assert.equal(record.status, 'disarmed');
  assert.equal(record.armId, 'arm-current-0001');
  assert.deepEqual(readRelaunchFile(LOOP_ID, sandbox.env), record);
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
  assert.equal(
    manualClaimCommand('__proto__', '/tmp/handoff.md'),
    `skilled-loop __proto__ ${seed}`,
  );
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

test('appendLog waits for an in-flight append before peeking the last byte', async (t) => {
  const sandbox = createSandbox(t);
  const corePath = path.resolve(__dirname, '../lib/relaunch-core.cjs');
  const logPath = path.join(stateDir(sandbox.env), 'relaunch.log');
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  // Another appender is mid-write: its line has no terminator yet and it holds the lock.
  fs.writeFileSync(logPath, 'torn');
  fs.mkdirSync(`${logPath}.lock`);

  const script = [
    `const core = require(${JSON.stringify(corePath)});`,
    `core.appendLog('waiter', { step: 1 }, { XDG_RUNTIME_DIR: ${JSON.stringify(sandbox.xdgRuntimeDir)} });`,
    '',
  ].join('\n');
  const waiter = spawn(process.execPath, ['-e', script], { stdio: 'ignore' });
  const waiterExit = new Promise((resolve) => {
    waiter.once('error', () => resolve(-1));
    waiter.once('exit', (code) => resolve(code ?? -1));
  });
  let waitTimer;
  const waitElapsed = new Promise((resolve) => {
    waitTimer = setTimeout(resolve, 500);
  });
  await Promise.race([waiterExit, waitElapsed]);
  clearTimeout(waitTimer);

  fs.appendFileSync(logPath, '-completed\n');
  fs.rmdirSync(`${logPath}.lock`);
  assert.equal(await waiterExit, 0);

  const lines = fs.readFileSync(logPath, 'utf8').split('\n');
  assert.equal(lines[0], 'torn-completed');
  assert.match(lines[1], / waiter step=1$/);
  assert.equal(lines[2], '');
  assert.equal(lines.length, 3);
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

test('hostRuntimePid skips shells above the caller', () => {
  const table = [
    '500 400 node',
    '400 300 /bin/zsh',
    '300 200 -/bin/bash',
    '200 100 claude',
    '100 1 bash',
    '',
  ].join('\n');
  assert.equal(hostRuntimePid({ pid: 500, processTable: table }), 200);
});

test('hostRuntimePid returns the direct parent when it is not a shell', () => {
  const table = [
    '500 400 node',
    '400 100 /Applications/Some App.app/Contents/MacOS/Some App',
    '100 1 bash',
    '',
  ].join('\n');
  assert.equal(hostRuntimePid({ pid: 500, processTable: table }), 400);
});

test('hostRuntimePid returns null for a missing table or a broken chain', () => {
  assert.equal(hostRuntimePid({ pid: 500, processTable: '' }), null);
  assert.equal(hostRuntimePid({ pid: 500, processTable: 'not a process table' }), null);
  assert.equal(hostRuntimePid({ pid: 500, processTable: '500 400 node\n' }), null);
  // Every ancestor is a shell and one belongs to its own past, so the walk never settles.
  assert.equal(hostRuntimePid({ pid: 500, processTable: '500 400 zsh\n400 500 zsh\n' }), null);
});

test('nestedUnderLoop is false for the loop child and a shim grandchild', () => {
  const child = ['200 100 claude', '100 1 bash', ''].join('\n');
  const shimmed = ['210 205 pi', '205 100 sh', '100 1 bash', ''].join('\n');
  assert.equal(nestedUnderLoop('100', { hostPid: 200, processTable: child }), false);
  assert.equal(nestedUnderLoop('100', { hostPid: 210, processTable: shimmed }), false);
});

test('nestedUnderLoop is true for a runtime started from the loop runtime shell', () => {
  assert.equal(
    nestedUnderLoop('100', { hostPid: 300, processTable: NESTED_PROCESS_TABLE }),
    true,
  );
});

test('nestedUnderLoop is false for an unrelated or invalid loop id', () => {
  for (const loopId of ['999', 'loop-id', '', '0']) {
    assert.equal(
      nestedUnderLoop(loopId, { hostPid: 300, processTable: NESTED_PROCESS_TABLE }),
      false,
      loopId,
    );
  }
  for (const loopPid of ['300', '100']) {
    assert.equal(
      nestedUnderLoop(loopPid, { hostPid: Number(loopPid), processTable: NESTED_PROCESS_TABLE }),
      false,
      loopPid,
    );
  }
});

test('dropNestedLoop removes the loop variables for a nested run', (t) => {
  // A dropped loop writes a log line, so the runtime directory must be the sandbox's.
  const { xdgRuntimeDir } = createSandbox(t);
  const env = {
    SKILLED_LOOP_ID: '100',
    SKILLED_LOOP_RUNTIME: 'pi',
    SKILLED_LOOP_HOPS: '2',
    XDG_RUNTIME_DIR: xdgRuntimeDir,
    OTHER: 'x',
  };
  assert.equal(
    dropNestedLoop(env, { hostPid: 300, processTable: NESTED_PROCESS_TABLE }),
    true,
  );
  assert.deepEqual(env, { XDG_RUNTIME_DIR: xdgRuntimeDir, OTHER: 'x' });
});

test('dropNestedLoop keeps the loop variables for the loop own runtime', () => {
  const env = {
    SKILLED_LOOP_ID: '100',
    SKILLED_LOOP_RUNTIME: 'claude',
    SKILLED_LOOP_HOPS: '1',
    OTHER: 'x',
  };
  assert.equal(
    dropNestedLoop(env, { hostPid: 200, processTable: NESTED_PROCESS_TABLE }),
    false,
  );
  assert.deepEqual(env, {
    SKILLED_LOOP_ID: '100',
    SKILLED_LOOP_RUNTIME: 'claude',
    SKILLED_LOOP_HOPS: '1',
    OTHER: 'x',
  });
});

test('dropNestedLoop does nothing outside the loop', () => {
  const env = { SKILLED_LOOP_RUNTIME: 'pi', OTHER: 'x' };
  assert.equal(
    dropNestedLoop(env, { hostPid: 300, processTable: NESTED_PROCESS_TABLE }),
    false,
  );
  assert.deepEqual(env, { SKILLED_LOOP_RUNTIME: 'pi', OTHER: 'x' });

  const unset = { SKILLED_LOOP_ID: '', OTHER: 'x' };
  assert.equal(
    dropNestedLoop(unset, { hostPid: 300, processTable: NESTED_PROCESS_TABLE }),
    false,
  );
  assert.deepEqual(unset, { SKILLED_LOOP_ID: '', OTHER: 'x' });
});

test('dropNestedLoop resolves the host from pid when hostPid is omitted', (t) => {
  const { xdgRuntimeDir } = createSandbox(t);
  const table = [
    '310 300 node',
    '300 250 pi',
    '250 200 zsh',
    '200 100 claude',
    '100 1 bash',
    '',
  ].join('\n');
  const env = {
    SKILLED_LOOP_ID: '100',
    SKILLED_LOOP_RUNTIME: 'pi',
    SKILLED_LOOP_HOPS: '1',
    XDG_RUNTIME_DIR: xdgRuntimeDir,
  };
  // The hook's parent is the nested runtime, so the walk from pid meets it before any shell.
  assert.equal(dropNestedLoop(env, { pid: 310, processTable: table }), true);
  assert.deepEqual(env, { XDG_RUNTIME_DIR: xdgRuntimeDir });
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
  assert.equal(calls[0].options.timeout, boundedCore.PROCESS_TABLE_TIMEOUT_MS);
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

test('resolveKillerTarget keeps a preferred pid inside the loop or walks to its child', () => {
  const { resolveKillerTarget } = relaunchCore;
  // 41 is the hook, 50 its shell, 60 the runtime below loop 100; 70 is a sibling of the loop.
  const table = '41 50\n50 60\n60 100\n100 1\n70 1\n';
  assert.equal(
    resolveKillerTarget('100', { preferredPid: '60', pid: 41, processTable: table }),
    60,
  );
  assert.equal(
    resolveKillerTarget('100', { preferredPid: 50, pid: 41, processTable: table }),
    50,
  );
  assert.equal(
    resolveKillerTarget('100', { preferredPid: '70', pid: 41, processTable: table }),
    60,
  );
  assert.equal(
    resolveKillerTarget('100', { preferredPid: 'abc', pid: 41, processTable: table }),
    60,
  );
  assert.equal(
    resolveKillerTarget('100', { preferredPid: '100', pid: 41, processTable: table }),
    60,
  );
  assert.equal(resolveKillerTarget('100', { pid: 41, processTable: table }), 60);
  assert.equal(
    resolveKillerTarget('999', { preferredPid: '60', pid: 41, processTable: table }),
    null,
  );
  assert.equal(resolveKillerTarget('loop-id', { pid: 41, processTable: table }), null);
});

test('armableRecord gives every arm path one verdict, ownership before state', (t) => {
  const sandbox = createSandbox(t);
  const { armableRecord } = relaunchCore;
  const mine = { loopId: LOOP_ID, sessionId: SESSION_ID, runtime: 'codex', status: 'pending' };
  const caller = { loopId: LOOP_ID, sessionId: SESSION_ID, runtime: 'codex', env: sandbox.env };
  const refused = (reason) => ({ armable: false, reason });

  assert.deepEqual(armableRecord(mine, caller), { armable: true, reason: 'pending' });
  assert.deepEqual(armableRecord(null, caller), refused('no-record'));
  assert.deepEqual(armableRecord({ ...mine, loopId: 'loop-other' }, caller), refused('other-loop'));
  assert.deepEqual(
    armableRecord({ ...mine, sessionId: 'other' }, caller),
    refused('other-session'),
  );
  // A missing session on both sides is no match, so an unnamed payload never arms.
  assert.deepEqual(
    armableRecord({ ...mine, sessionId: undefined }, { ...caller, sessionId: undefined }),
    refused('other-session'),
  );
  assert.deepEqual(armableRecord({ ...mine, runtime: 'claude' }, caller), refused('other-runtime'));
  // A caller that names no runtime takes any; a record without one was prepared for Claude.
  assert.deepEqual(
    armableRecord({ ...mine, runtime: 'hermes' }, { ...caller, runtime: undefined }),
    { armable: true, reason: 'pending' },
  );
  const unnamed = { ...mine };
  delete unnamed.runtime;
  assert.deepEqual(
    armableRecord(unnamed, { ...caller, runtime: 'claude' }),
    { armable: true, reason: 'pending' },
  );
  assert.deepEqual(armableRecord(unnamed, caller), refused('other-runtime'));
  for (const status of ['disarmed', 'claimed', 'done', undefined]) {
    assert.deepEqual(armableRecord({ ...mine, status }, caller), refused('not-armable'));
  }

  const armedRecord = { ...mine, status: 'armed' };
  assert.deepEqual(armableRecord(armedRecord, caller), { armable: true, reason: 'killer-gone' });
  ensureStateDir(sandbox.env);
  fs.writeFileSync(
    path.join(stateDir(sandbox.env), `killer-${LOOP_ID}.lock`),
    `${process.pid} ${new Date().toISOString()}\n`,
  );
  assert.deepEqual(armableRecord(armedRecord, caller), refused('killer-live'));
});

test('the core owns the handoff sections and the runtime list as frozen exports', () => {
  assert.deepEqual(
    relaunchCore.HANDOFF_SECTIONS,
    ['Goal', 'Done', 'Remaining work', 'In-flight state'],
  );
  assert.equal(Object.isFrozen(relaunchCore.HANDOFF_SECTIONS), true);
  assert.deepEqual(
    relaunchCore.RUNTIMES,
    ['claude', 'pi', 'opencode', 'codex', 'cursor', 'hermes', 'devin'],
  );
  assert.equal(Object.isFrozen(relaunchCore.RUNTIMES), true);
});

test('readProcessTable asks for the command column on request and honors a shorter bound', (t) => {
  const sandbox = createSandbox(t);
  const binDir = path.join(sandbox.root, 'bin');
  fs.mkdirSync(binDir, { recursive: true });
  fs.writeFileSync(path.join(binDir, 'ps'), [
    '#!/bin/sh',
    'if [ -n "$PS_TEST_SLEEP" ]; then exec sleep "$PS_TEST_SLEEP"; fi',
    'printf "%s\\n" "$*"',
    '',
  ].join('\n'), { mode: 0o755 });
  const originalPath = process.env.PATH;
  process.env.PATH = [binDir, originalPath || ''].join(path.delimiter);
  t.after(() => {
    process.env.PATH = originalPath;
    delete process.env.PS_TEST_SLEEP;
  });

  assert.equal(readProcessTable(), '-A -o pid=,ppid=\n');
  assert.equal(readProcessTable({ withCommand: true }), '-A -o pid=,ppid=,comm=\n');

  process.env.PS_TEST_SLEEP = '1';
  const startedAt = Date.now();
  assert.equal(readProcessTable({ timeoutMs: 100 }), null);
  assert.ok(Date.now() - startedAt < 900, 'the caller bound must replace the default one');
  assert.throws(
    () => readProcessTable({ timeoutMs: 100, throwOnFailure: true }),
    /spawnSync ps ETIMEDOUT/,
  );
});

test('manualClaimCommand reads the template from the environment it is given', (t) => {
  const handoffPath = '/tmp/handoff.md';
  const defaultCommand = 'skilled-loop claude "[session-relaunch] claim and continue handoff '
    + `${handoffPath}"`;
  const previousTemplate = process.env.SKILLED_LOOP_MANUAL_TEMPLATE;
  t.after(() => {
    if (previousTemplate === undefined) delete process.env.SKILLED_LOOP_MANUAL_TEMPLATE;
    else process.env.SKILLED_LOOP_MANUAL_TEMPLATE = previousTemplate;
  });
  delete process.env.SKILLED_LOOP_MANUAL_TEMPLATE;
  const template = 'skilled-loop claude --model x '
    + '"[session-relaunch] claim and continue handoff @@HANDOFF@@"';

  assert.equal(
    manualClaimCommand('claude', handoffPath, '', { SKILLED_LOOP_MANUAL_TEMPLATE: template }),
    `skilled-loop claude --model x "[session-relaunch] claim and continue handoff ${handoffPath}"`,
  );
  process.env.SKILLED_LOOP_MANUAL_TEMPLATE = template;
  assert.equal(manualClaimCommand('claude', handoffPath, '', {}), defaultCommand);
});

test('manualTemplateProblem names a template the manual command has to fall back from', () => {
  const { manualTemplateProblem } = relaunchCore;
  assert.equal(manualTemplateProblem({}), null);
  assert.equal(manualTemplateProblem({ SKILLED_LOOP_MANUAL_TEMPLATE: '' }), null);
  assert.equal(manualTemplateProblem({ SKILLED_LOOP_MANUAL_TEMPLATE: 'run @@HANDOFF@@' }), null);
  assert.match(
    manualTemplateProblem({ SKILLED_LOOP_MANUAL_TEMPLATE: 'run plain' }),
    /holds no @@HANDOFF@@ placeholder/,
  );
  assert.match(
    manualTemplateProblem({ SKILLED_LOOP_MANUAL_TEMPLATE: 'run --name @@HANDOFF@@ "@@HANDOFF@@"' }),
    /holds 2 @@HANDOFF@@ placeholders/,
  );
});

test("payloadEventName applies each runtime's rule for a payload that names no event", () => {
  const { payloadEventName } = relaunchCore;
  for (const runtime of ['claude', 'codex', 'hermes']) {
    assert.equal(
      payloadEventName({ hook_event_name: 'Stop' }, { runtime, expected: 'Stop' }),
      'Stop',
    );
    assert.equal(
      payloadEventName({ hook_event_name: 'SessionEnd' }, { runtime, expected: 'Stop' }),
      null,
    );
  }
  // Claude takes any named event and infers an unnamed one from the payload's shape.
  assert.equal(
    payloadEventName({ hook_event_name: 'PostToolUse' }, { runtime: 'claude' }),
    'PostToolUse',
  );
  assert.equal(payloadEventName({ prompt: 'hi' }, { runtime: 'claude' }), 'UserPromptSubmit');
  assert.equal(
    payloadEventName({ hook_event_name: '', prompt: 'hi' }, { runtime: 'claude' }),
    'UserPromptSubmit',
  );
  assert.equal(payloadEventName({}, { runtime: 'claude' }), 'PostToolUse');
  // Hermes takes an omitted name as its event, never a present malformed one.
  const sessionEnd = { runtime: 'hermes', expected: 'on_session_end' };
  assert.equal(payloadEventName({}, sessionEnd), 'on_session_end');
  assert.equal(payloadEventName({ hook_event_name: null }, sessionEnd), null);
  assert.equal(payloadEventName({ hook_event_name: '' }, sessionEnd), null);
  // Codex refuses a payload that names no event.
  assert.equal(payloadEventName({}, { runtime: 'codex', expected: 'Stop' }), null);
  assert.equal(payloadEventName(null, { runtime: 'codex', expected: 'Stop' }), null);
});

test('isEntrypoint matches a directly run or linked module and nothing else', (t) => {
  const { pathToFileURL } = require('node:url');
  const sandbox = createSandbox(t);
  const { isEntrypoint } = relaunchCore;
  const realDirectory = path.join(sandbox.root, 'real');
  fs.mkdirSync(realDirectory);
  const scriptPath = path.join(realDirectory, 'entry.mjs');
  fs.writeFileSync(scriptPath, '');
  const linkedDirectory = path.join(sandbox.root, 'linked');
  fs.symlinkSync(realDirectory, linkedDirectory);
  // Node hands an ES module its real path, whatever path the process was started with.
  const moduleUrl = pathToFileURL(fs.realpathSync(scriptPath)).href;

  assert.equal(isEntrypoint(moduleUrl, scriptPath), true);
  assert.equal(isEntrypoint(moduleUrl, path.join(linkedDirectory, 'entry.mjs')), true);
  assert.equal(isEntrypoint(moduleUrl, path.join(sandbox.root, 'missing.mjs')), false);
  assert.equal(isEntrypoint(moduleUrl, undefined), false);
});

test('shouldRelaunch reads a Date clock the way it reads epoch milliseconds', (t) => {
  createSandbox(t);
  const armedAt = NOW.getTime();
  assert.deepEqual(
    shouldRelaunch(
      { status: 'armed', armedAt, hops: 0, handoff: '/repo/note.md', cwd: '/repo' },
      { now: new Date(armedAt + 60 * 1000), maxHops: 10, maxAgeMin: 10 },
    ),
    { relaunch: true },
  );
});

test('shouldRelaunch reports a hand-over the session called off as withdrawn', (t) => {
  createSandbox(t);
  const options = { now: NOW.getTime(), maxHops: 10, maxAgeMin: 10 };
  for (const disarmReason of ['cancelled', 'user-message']) {
    assert.deepEqual(
      shouldRelaunch({ status: 'disarmed', disarmReason, hops: 0 }, options),
      { relaunch: false, reason: 'withdrawn' },
      disarmReason,
    );
  }
  // A disarm the session did not choose still reads as an unarmed record.
  assert.deepEqual(
    shouldRelaunch({ status: 'disarmed', disarmReason: 'killer-timeout', hops: 0 }, options),
    { relaunch: false, reason: 'not-armed' },
  );
});

test('dropNestedLoop removes every loop variable, manual template included', (t) => {
  const { xdgRuntimeDir } = createSandbox(t);
  const env = {
    SKILLED_LOOP_ID: '100',
    SKILLED_LOOP_RUNTIME: 'pi',
    SKILLED_LOOP_HOPS: '2',
    SKILLED_LOOP_MANUAL_TEMPLATE: 'outer --seed "{{handoff}}"',
    SKILLED_LOOP_MODEL: 'outer-model',
    SKILLED_LOOP_NAME: 'outer',
    SKILLED_LOOP_PROVIDER: 'outer-provider',
    XDG_RUNTIME_DIR: xdgRuntimeDir,
    OTHER: 'x',
  };
  assert.equal(
    dropNestedLoop(env, { hostPid: 300, processTable: NESTED_PROCESS_TABLE }),
    true,
  );
  assert.deepEqual(env, { XDG_RUNTIME_DIR: xdgRuntimeDir, OTHER: 'x' });
});

// The lock helper is a mkdir lock, so a lock taken shows up as a mkdir of `<path>.lock`.
function trackLocks(t) {
  const realMkdirSync = fs.mkdirSync;
  const taken = [];
  fs.mkdirSync = (target, ...rest) => {
    const result = realMkdirSync(target, ...rest);
    if (String(target).endsWith('.lock')) taken.push(String(target));
    return result;
  };
  t.after(() => {
    fs.mkdirSync = realMkdirSync;
  });
  return taken;
}

test('arm, unarm and markDeferred each take the record lock once and release it', (t) => {
  const sandbox = createSandbox(t);
  const recordPath = relaunchFilePath(LOOP_ID, sandbox.env);
  const taken = trackLocks(t);
  writeRelaunchRecord(sandbox, {
    loopId: LOOP_ID,
    status: 'pending',
    handoff: '/repo/note.md',
    sessionId: SESSION_ID,
  });

  assert.equal(markDeferred({ loopId: LOOP_ID, env: sandbox.env, now: NOW }).status, 'pending');
  assert.equal(arm({ loopId: LOOP_ID, env: sandbox.env, now: NOW }).status, 'armed');
  assert.equal(
    unarm({ loopId: LOOP_ID, env: sandbox.env, reason: 'cancelled', now: NOW }).status,
    'disarmed',
  );

  assert.deepEqual(taken, Array(3).fill(`${recordPath}.lock`));
  assert.equal(fs.existsSync(`${recordPath}.lock`), false);
});

test('preparePending writes the record under the record lock', (t) => {
  const sandbox = createSandbox(t);
  const recordPath = relaunchFilePath(LOOP_ID, sandbox.env);
  const taken = trackLocks(t);
  const realRenameSync = fs.renameSync;
  const heldAtWrite = [];
  fs.renameSync = (from, to) => {
    if (path.resolve(String(to)) === path.resolve(recordPath)) {
      heldAtWrite.push(fs.existsSync(`${recordPath}.lock`));
    }
    return realRenameSync(from, to);
  };
  t.after(() => {
    fs.renameSync = realRenameSync;
  });

  preparePending({
    loopId: LOOP_ID,
    handoffPath: '/repo/note.md',
    sessionId: SESSION_ID,
    cwd: '/repo',
    env: sandbox.env,
    now: NOW,
  });

  assert.deepEqual(heldAtWrite, [true]);
  assert.deepEqual(taken, [`${recordPath}.lock`]);
  assert.equal(fs.existsSync(`${recordPath}.lock`), false);
});

test('withdrawRecord takes the record lock once and disarms only a record it accepts', (t) => {
  const sandbox = createSandbox(t);
  const recordPath = relaunchFilePath(LOOP_ID, sandbox.env);
  const taken = trackLocks(t);
  writeRelaunchRecord(sandbox, {
    loopId: LOOP_ID,
    status: 'armed',
    handoff: '/repo/note.md',
    sessionId: SESSION_ID,
  });
  const seen = [];

  const refused = withdrawRecord({
    loopId: LOOP_ID,
    reason: 'user-message',
    accept: (record) => {
      seen.push(record.status);
      return false;
    },
    env: sandbox.env,
    now: NOW,
  });
  assert.equal(refused, null);
  assert.equal(readRelaunchFile(LOOP_ID, sandbox.env).status, 'armed');

  const withdrawn = withdrawRecord({
    loopId: LOOP_ID,
    reason: 'user-message',
    accept: (record) => record.status === 'armed',
    env: sandbox.env,
    now: NOW,
  });
  assert.equal(withdrawn.status, 'disarmed');
  assert.equal(withdrawn.disarmReason, 'user-message');
  assert.deepEqual(seen, ['armed']);
  // The inner disarm must not take the lock the withdraw already holds.
  assert.deepEqual(taken, [`${recordPath}.lock`, `${recordPath}.lock`]);

  const absent = withdrawRecord({
    loopId: 'loop-absent-00000001',
    reason: 'user-message',
    accept: () => true,
    env: sandbox.env,
  });
  assert.equal(absent, null);
  assert.equal(fs.existsSync(`${recordPath}.lock`), false);
});

test('claimHandoff and completeHandoff each take the note lock and release it', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  const taken = trackLocks(t);

  claimHandoff(handoffPath, { sessionId: SESSION_ID, now: NOW });
  assert.throws(
    () => claimHandoff(handoffPath, { sessionId: 'session-test-00000002', now: NOW }),
    /cannot claim handoff with status claimed/,
  );
  completeHandoff(handoffPath, { now: NOW });

  assert.deepEqual(taken, Array(3).fill(`${handoffPath}.lock`));
  assert.equal(fs.existsSync(`${handoffPath}.lock`), false);
  assert.match(readNote(handoffPath), /^status: done$/m);
  assert.match(readNote(handoffPath), new RegExp(`^claimed_by: ${SESSION_ID}$`, 'm'));
});

// ─────────────────────────────────────────────────────────────────────────────
// GOAL PACKET
// ─────────────────────────────────────────────────────────────────────────────

const GOAL_PARENT = 'specs/hooks/023-session-relaunch-loop';
const GOAL_PACKET = `${GOAL_PARENT}/025-goal-binding-record-and-launcher`;
const GOAL_HEADLINE = '# Goal: Session relaunch loop';
const GOAL_SESSION_ID = 'ses_goalpacket0001';
// sha256 of GOAL_SESSION_ID: the file name OpenCode keeps a session's goal record under.
const GOAL_SESSION_DIGEST = '654f6cbd49ac65da0027b794a9bb1e73db42845d372541ff5f09d8f3783f7d8a';

function writeGoalPacket(root, packet = GOAL_PACKET, text = `${GOAL_HEADLINE}\n`) {
  fs.mkdirSync(path.join(root, packet), { recursive: true });
  fs.writeFileSync(path.join(root, packet, 'goal.md'), text);
}

// Goal records live under the checkout's own state directory, which is also what marks the
// directory as the workspace root for the record reader.
function goalRecordPath(root, runtime, sessionId = GOAL_SESSION_ID) {
  const goalCore = require('../../goal/lib/goal-core.cjs');
  return runtime === 'opencode'
    ? path.join(goalCore.resolveStateDir({ workspace: root }), `${GOAL_SESSION_DIGEST}.json`)
    : goalCore.statePath({ scope: { workspace: root, runtime, sessionId } });
}

function writeGoalRecord(root, runtime, record, sessionId = GOAL_SESSION_ID) {
  const filePath = goalRecordPath(root, runtime, sessionId);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(record));
}

function writeClaudeLog(sandbox, entries, sessionId = GOAL_SESSION_ID) {
  const configDirectory = path.join(sandbox.root, 'claude-config');
  const logPath = path.join(configDirectory, 'projects', '-some-project', `${sessionId}.jsonl`);
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.writeFileSync(logPath, entries.map((entry) => JSON.stringify(entry)).join('\n') + '\n');
  return { ...sandbox.env, CLAUDE_CONFIG_DIR: configDirectory };
}

function goalStatus(fields) {
  return { type: 'attachment', attachment: { type: 'goal_status', ...fields } };
}

test('goalPacketProblem accepts a packet whose goal.md is real and refuses everything else', (t) => {
  const sandbox = createSandbox(t);
  writeGoalPacket(sandbox.repoRoot);
  const outside = path.join(sandbox.root, 'outside');
  fs.mkdirSync(outside);
  fs.writeFileSync(path.join(outside, 'goal.md'), GOAL_HEADLINE);
  const linkedPacket = 'specs/hooks/030-linked-packet';
  fs.mkdirSync(path.join(sandbox.repoRoot, 'specs/hooks'), { recursive: true });
  fs.symlinkSync(outside, path.join(sandbox.repoRoot, linkedPacket));
  const linkedGoal = 'specs/hooks/031-linked-goal';
  fs.mkdirSync(path.join(sandbox.repoRoot, linkedGoal), { recursive: true });
  fs.symlinkSync(
    path.join(outside, 'goal.md'),
    path.join(sandbox.repoRoot, linkedGoal, 'goal.md'),
  );
  const noGoal = 'specs/hooks/032-no-goal';
  fs.mkdirSync(path.join(sandbox.repoRoot, noGoal), { recursive: true });
  const goalDirectory = 'specs/hooks/033-goal-directory';
  fs.mkdirSync(path.join(sandbox.repoRoot, goalDirectory, 'goal.md'), { recursive: true });
  const roots = [sandbox.repoRoot];

  assert.equal(goalPacketProblem(GOAL_PACKET, roots), null);
  const cases = [
    { packet: '', reason: /repo-relative packet path/ },
    { packet: '../outside', reason: /repo-relative packet path/ },
    { packet: path.join(sandbox.root, 'outside'), reason: /repo-relative packet path/ },
    { packet: `${GOAL_PACKET} ${GOAL_PACKET}`, reason: /repo-relative packet path/ },
    { packet: `${GOAL_PACKET}\n${GOAL_PACKET}`, reason: /repo-relative packet path/ },
    { packet: 'specs/hooks/../024-other', reason: /repo-relative packet path/ },
    { packet: linkedPacket, reason: /resolves outside the repository/ },
    { packet: linkedGoal, reason: /resolves outside the repository/ },
    { packet: noGoal, reason: /holds no goal\.md/ },
    { packet: goalDirectory, reason: /holds no goal\.md/ },
    { packet: 'specs/hooks/034-missing', reason: /holds no goal\.md/ },
  ];
  for (const { packet, reason } of cases) {
    assert.match(goalPacketProblem(packet, roots), reason, JSON.stringify(packet));
  }
});

test('goalPacketProblem accepts a packet that only a second root holds', (t) => {
  const sandbox = createSandbox(t);
  const worktree = path.join(sandbox.root, 'worktree');
  writeGoalPacket(worktree);

  assert.match(goalPacketProblem(GOAL_PACKET, [sandbox.repoRoot]), /holds no goal\.md/);
  assert.equal(goalPacketProblem(GOAL_PACKET, [sandbox.repoRoot, worktree]), null);
});

test('goalSwitchOn is on unless the operator turns it off', () => {
  for (const value of [undefined, '', '1', 'on', 'yes', 'anything']) {
    assert.equal(goalSwitchOn({ SESSION_RELAUNCH_GOAL: value }), true, String(value));
  }
  for (const value of ['0', 'false', 'OFF', ' no ']) {
    assert.equal(goalSwitchOn({ SESSION_RELAUNCH_GOAL: value }), false, String(value));
  }
  assert.equal(goalSwitchOn({}), true);
});

for (const runtime of ['opencode', 'pi', 'devin', 'cursor', 'hermes']) {
  test(`resolveGoalPacket reads the ${runtime} goal record`, (t) => {
    const sandbox = createSandbox(t);
    writeGoalPacket(sandbox.repoRoot);
    const roots = [sandbox.repoRoot];
    const resolve = () => resolveGoalPacket({
      runtime, sessionId: GOAL_SESSION_ID, roots, env: sandbox.env,
    });

    assert.equal(resolve(), '', 'no record');
    writeGoalRecord(sandbox.repoRoot, runtime, { status: 'active', packetPath: GOAL_PACKET });
    assert.equal(resolve(), GOAL_PACKET);
    writeGoalRecord(sandbox.repoRoot, runtime, { status: 'paused', packetPath: GOAL_PACKET });
    assert.equal(resolve(), '', 'a paused goal is not carried');
    writeGoalRecord(sandbox.repoRoot, runtime, { status: 'active', objective: 'free text only' });
    assert.equal(resolve(), '', 'a goal with no packet');
    writeGoalRecord(sandbox.repoRoot, runtime, {
      status: 'active', packetPath: 'specs/hooks/040-gone',
    });
    assert.equal(resolve(), '', 'a packet that lost its goal.md');
    fs.writeFileSync(goalRecordPath(sandbox.repoRoot, runtime), '{not json');
    assert.equal(resolve(), '', 'an unreadable record');
  });
}

test('resolveGoalPacket keys a record by the session, so another session finds nothing', (t) => {
  const sandbox = createSandbox(t);
  writeGoalPacket(sandbox.repoRoot);
  writeGoalRecord(sandbox.repoRoot, 'pi', { status: 'active', packetPath: GOAL_PACKET });

  assert.equal(resolveGoalPacket({
    runtime: 'pi', sessionId: 'ses_someone_else', roots: [sandbox.repoRoot], env: sandbox.env,
  }), '');
  assert.equal(resolveGoalPacket({
    runtime: 'opencode', sessionId: GOAL_SESSION_ID, roots: [sandbox.repoRoot], env: sandbox.env,
  }), '', 'a Pi record is not an OpenCode goal');
});

test('resolveGoalPacket gives a Codex sender no packet, whatever the spec folder holds', (t) => {
  const sandbox = createSandbox(t);
  const roots = [sandbox.repoRoot];
  writeGoalPacket(sandbox.repoRoot, GOAL_PARENT);
  writeGoalPacket(sandbox.repoRoot);

  for (const specFolder of [GOAL_PACKET, GOAL_PARENT, '', 'none']) {
    assert.equal(resolveGoalPacket({
      runtime: 'codex', sessionId: GOAL_SESSION_ID, specFolder, roots, env: sandbox.env,
    }), '', JSON.stringify(specFolder));
  }
});

test('resolveGoalPacket follows the Claude session log goal entries', (t) => {
  const sandbox = createSandbox(t);
  writeGoalPacket(sandbox.repoRoot, GOAL_PARENT);
  const roots = [sandbox.repoRoot];
  const claude = (entries, specFolder = GOAL_PACKET) => resolveGoalPacket({
    runtime: 'claude',
    sessionId: GOAL_SESSION_ID,
    specFolder,
    roots,
    env: writeClaudeLog(sandbox, entries),
  });
  const active = goalStatus({ met: false, sentinel: true, condition: `${GOAL_HEADLINE}\n\nbody` });

  assert.equal(claude([active]), GOAL_PARENT);
  assert.equal(claude([active, goalStatus({ met: false, condition: active.attachment.condition })]), GOAL_PARENT);
  assert.equal(claude([active, goalStatus({ met: true, condition: active.attachment.condition })]), '');
  assert.equal(claude([active, goalStatus({
    met: false, failed: true, condition: active.attachment.condition,
  })]), '');
  assert.equal(claude([active, {
    type: 'system',
    subtype: 'local_command',
    content: '<command-name>/goal</command-name><command-args>clear</command-args>',
  }]), '');
  assert.equal(claude([{ type: 'user', message: { content: 'hello' } }]), '', 'no goal entry');
  assert.equal(claude([goalStatus({ met: false, condition: '# Goal: A different goal\n' })]), '',
    'a goal whose text no packet carries');
  assert.equal(claude([goalStatus({
    met: false, condition: `${GOAL_HEADLINE}\nsee ${GOAL_PARENT}/goal.md`,
  })], 'none'), GOAL_PARENT, 'a packet the text names');
});

test('resolveGoalPacket answers empty when no Claude log can be read', (t) => {
  const sandbox = createSandbox(t);
  writeGoalPacket(sandbox.repoRoot, GOAL_PARENT);
  writeGoalPacket(sandbox.repoRoot);
  const roots = [sandbox.repoRoot];
  const claude = (env, sessionId = GOAL_SESSION_ID) => resolveGoalPacket({
    runtime: 'claude', sessionId, specFolder: GOAL_PACKET, roots, env,
  });
  const missingConfig = { ...sandbox.env, CLAUDE_CONFIG_DIR: path.join(sandbox.root, 'no-such-config') };

  assert.equal(claude(missingConfig), '', 'no projects folder');
  assert.equal(claude(missingConfig, '../escape'), '', 'a session id that is not a file name');

  const configDirectory = path.join(sandbox.root, 'claude-config');
  fs.mkdirSync(path.join(configDirectory, 'projects', '-some-project', `${GOAL_SESSION_ID}.jsonl`), {
    recursive: true,
  });
  assert.equal(claude({ ...sandbox.env, CLAUDE_CONFIG_DIR: configDirectory }), '', 'an unreadable log');
  fs.rmSync(path.join(configDirectory, 'projects', '-some-project', `${GOAL_SESSION_ID}.jsonl`), {
    recursive: true,
  });
  assert.equal(claude({ ...sandbox.env, CLAUDE_CONFIG_DIR: configDirectory }), '', 'a project folder with no log');
});

test('resolveGoalPacket widens the Claude log tail past one large entry', (t) => {
  const sandbox = createSandbox(t);
  writeGoalPacket(sandbox.repoRoot, GOAL_PARENT);
  const filler = { type: 'user', message: { content: 'x'.repeat(400000) } };
  const env = writeClaudeLog(sandbox, [
    goalStatus({ met: false, sentinel: true, condition: `${GOAL_HEADLINE}\nbody` }),
    filler,
  ]);

  assert.equal(resolveGoalPacket({
    runtime: 'claude', sessionId: GOAL_SESSION_ID, specFolder: GOAL_PACKET,
    roots: [sandbox.repoRoot], env,
  }), GOAL_PARENT);
});

test('resolveGoalPacket answers empty for an unknown runtime or a missing session', (t) => {
  const sandbox = createSandbox(t);
  writeGoalPacket(sandbox.repoRoot);
  const roots = [sandbox.repoRoot];

  assert.equal(resolveGoalPacket({
    runtime: 'mystery', sessionId: GOAL_SESSION_ID, specFolder: GOAL_PACKET, roots,
  }), '');
  assert.equal(resolveGoalPacket({ runtime: 'codex', specFolder: GOAL_PACKET, roots }), '');
  assert.equal(resolveGoalPacket({}), '');
});

test('recordGoalPacket writes, replaces and removes the field and skips an unchanged note', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  const taken = trackLocks(t);
  const field = () => parseHandoff(readNote(handoffPath)).frontmatter.goal_packet;

  assert.equal(recordGoalPacket(handoffPath, ''), false, 'nothing to remove');
  assert.equal(recordGoalPacket(handoffPath, GOAL_PACKET), true);
  assert.equal(field(), GOAL_PACKET);
  assert.equal(recordGoalPacket(handoffPath, GOAL_PACKET), false, 'the same value');
  assert.equal(recordGoalPacket(handoffPath, GOAL_PARENT), true);
  assert.equal(field(), GOAL_PARENT, 'a held value is replaced');
  assert.equal(recordGoalPacket(handoffPath, ''), true);
  assert.equal(field(), undefined);
  assert.doesNotMatch(readNote(handoffPath), /goal_packet/);
  assert.equal(parseHandoff(readNote(handoffPath)).frontmatter.status, 'open');
  assert.deepEqual(taken, Array(5).fill(`${handoffPath}.lock`));
  assert.equal(fs.existsSync(`${handoffPath}.lock`), false);
});

test('recordGoalPacket removes an empty field the note holds', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = writeHandoff(sandbox);
  fs.writeFileSync(handoffPath, readNote(handoffPath).replace(/^(status: .*)$/m, '$1\ngoal_packet: '));

  assert.equal(recordGoalPacket(handoffPath, ''), true);
  assert.doesNotMatch(readNote(handoffPath), /goal_packet/);
});
