// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Withdraw Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const core = require('../lib/relaunch-core.cjs');
const nudge = require('../lib/nudge.cjs');
const { withdrawHandOver } = require('../lib/withdraw.cjs');

// The suite also runs from inside a looped session, whose wrapper exports these variables.
for (const key of Object.keys(process.env)) {
  if (key.startsWith('SKILLED_LOOP_')) delete process.env[key];
}

const SESSION_ID = 'session-withdraw-0000001';
const OTHER_SESSION_ID = 'session-withdraw-0000002';
const LOOP_ID = 'loop-withdraw-00000001';
const NOW = new Date('2026-10-24T12:00:00.000Z');

function createSandbox(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-withdraw-'));
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
  delete env.SKILLED_LOOP_ID;
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const historyFile = path.join(
    repoRoot, '.skilled', 'skills', '.state', 'session-relaunch', 'hop-history.log',
  );
  return { root, repoRoot, env, historyFile };
}

function writeRecord(sandbox, fields) {
  core.ensureStateDir(sandbox.env);
  fs.writeFileSync(core.relaunchFilePath(LOOP_ID, sandbox.env), JSON.stringify({
    version: 1,
    status: 'pending',
    loopId: LOOP_ID,
    handoff: path.join(sandbox.repoRoot, 'note.md'),
    sessionId: SESSION_ID,
    runtime: 'claude',
    cwd: sandbox.repoRoot,
    hops: 0,
    preparedAt: NOW.toISOString(),
    ...fields,
  }));
}

function withdraw(sandbox, options = {}) {
  return withdrawHandOver({
    loopId: LOOP_ID,
    reason: 'user-message',
    env: sandbox.env,
    now: NOW,
    ...options,
  });
}

function rearmOf(sandbox, sessionId = SESSION_ID) {
  try {
    return JSON.parse(fs.readFileSync(
      path.join(core.stateDir(sandbox.env), `nudge-${sessionId}.json`),
      'utf8',
    )).rearm ?? null;
  } catch {
    return null;
  }
}

function historyEvents(sandbox) {
  if (!fs.existsSync(sandbox.historyFile)) return [];
  return fs.readFileSync(sandbox.historyFile, 'utf8').trim().split('\n')
    .map((line) => line.split('\t')[1]);
}

test('an armed record is withdrawn with a pending grant and a history line', (t) => {
  const sandbox = createSandbox(t);
  writeRecord(sandbox, { status: 'armed', armedAt: NOW.toISOString(), armId: 'arm-1' });

  const disarmed = withdraw(sandbox, { sessionId: SESSION_ID, pending: 'none' });

  assert.equal(disarmed.status, 'disarmed');
  assert.equal(disarmed.disarmReason, 'user-message');
  assert.equal(core.readRelaunchFile(LOOP_ID, sandbox.env).status, 'disarmed');
  assert.deepEqual(rearmOf(sandbox), { pending: true });
  assert.deepEqual(historyEvents(sandbox), ['withdrawn']);
  assert.equal(nudge.handoffWithdrawn({
    sessionId: SESSION_ID,
    notePath: path.join(sandbox.repoRoot, 'note.md'),
    env: { ...sandbox.env, SKILLED_LOOP_ID: LOOP_ID },
  }), true);
});

test('a pending record counts only as the caller\'s policy says', (t) => {
  const sandbox = createSandbox(t);
  const cases = [
    { fields: {}, pending: 'deferred', withdrawn: false },
    { fields: { deferredAt: NOW.toISOString() }, pending: 'deferred', withdrawn: true },
    { fields: { deferredAt: NOW.toISOString() }, pending: 'none', withdrawn: false },
    { fields: {}, pending: 'any', withdrawn: true },
  ];
  for (const { fields, pending, withdrawn } of cases) {
    writeRecord(sandbox, fields);
    const disarmed = withdraw(sandbox, { sessionId: SESSION_ID, pending });
    assert.equal(disarmed !== null, withdrawn, JSON.stringify({ fields, pending }));
  }
});

test('another session\'s record and an already disarmed one are left alone', (t) => {
  const sandbox = createSandbox(t);
  writeRecord(sandbox, { status: 'armed', armedAt: NOW.toISOString() });

  assert.equal(withdraw(sandbox, { sessionId: OTHER_SESSION_ID, pending: 'none' }), null);
  assert.equal(core.readRelaunchFile(LOOP_ID, sandbox.env).status, 'armed');
  assert.equal(rearmOf(sandbox, OTHER_SESSION_ID), null);

  writeRecord(sandbox, { status: 'disarmed', disarmReason: 'killer-timeout' });
  assert.equal(withdraw(sandbox, { sessionId: SESSION_ID, pending: 'any' }), null);
  assert.deepEqual(historyEvents(sandbox), []);
});

test('without a session id any session\'s record is withdrawn, as a cancel does', (t) => {
  const sandbox = createSandbox(t);
  writeRecord(sandbox, { sessionId: OTHER_SESSION_ID });

  const disarmed = withdraw(sandbox, { reason: 'cancelled', pending: 'any' });

  assert.equal(disarmed.disarmReason, 'cancelled');
  assert.deepEqual(rearmOf(sandbox, OTHER_SESSION_ID), { pending: true });
});

test('a follow-up that fails is reported and never undoes the withdrawal', (t) => {
  const sandbox = createSandbox(t);
  writeRecord(sandbox, { status: 'armed', armedAt: NOW.toISOString() });
  const realRearm = nudge.rearmAfterWithdraw;
  nudge.rearmAfterWithdraw = () => {
    throw new Error('state write refused');
  };
  t.after(() => {
    nudge.rearmAfterWithdraw = realRearm;
  });
  const reported = [];

  const disarmed = withdraw(sandbox, {
    sessionId: SESSION_ID,
    pending: 'none',
    onError: (stage, error) => reported.push([stage, error.message]),
  });

  assert.equal(disarmed.status, 'disarmed');
  assert.deepEqual(reported, [['rearm', 'state write refused']]);
  assert.deepEqual(historyEvents(sandbox), ['withdrawn']);
});
