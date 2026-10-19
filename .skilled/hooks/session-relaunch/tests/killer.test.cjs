// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Killer Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const childProcess = require('node:child_process');
const { spawn } = childProcess;
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const KILLER_PATH = path.resolve(__dirname, '../lib/killer.cjs');
const core = require('../lib/relaunch-core.cjs');
const SPEC_FOLDER = 'specs/hooks/001-session-relaunch';
const SPEC_FOLDER_SUFFIX = ` | Spec folder: ${SPEC_FOLDER}`
  + ' (carried from the handoff; Gate 3 answered in the sending session)';
const SKIP_SPEC_FOLDER_SUFFIX = ' | Spec folder: none'
  + ' (Gate 3 answered D, Skip, in the sending session)';

function createSandbox(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-killer-'));
  const repoRoot = path.join(root, 'repo');
  const xdgRuntimeDir = path.join(root, 'runtime');
  const home = path.join(root, 'home');
  const binDir = path.join(root, 'bin');
  fs.mkdirSync(repoRoot, { recursive: true });
  fs.mkdirSync(xdgRuntimeDir, { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  fs.mkdirSync(binDir, { recursive: true });
  fs.writeFileSync(path.join(binDir, 'ps'), [
    '#!/usr/bin/env bash',
    'printf "%s %s\\n" "$PPID" "$KILLER_PARENT_PID"',
    'printf "%s %s\\n" "$TARGET_PID" "$TARGET_PARENT_PID"',
    'printf "%s 1\\n" "$TEST_PROCESS_PID"',
    '',
  ].join('\n'), { mode: 0o755 });
  const env = {
    ...process.env,
    HOME: home,
    XDG_RUNTIME_DIR: xdgRuntimeDir,
    SESSION_RELAUNCH_REPO_ROOT: repoRoot,
    PATH: `${binDir}:${process.env.PATH}`,
    TEST_PROCESS_PID: String(process.pid),
  };
  for (const key of [
    'SKILLED_LOOP_ID',
    'SKILLED_LOOP_HOPS',
    'SKILLED_LOOP_NAME',
    'SESSION_RELAUNCH_MAX_HOPS',
    'SYSTEM_SESSION_RELAUNCH_DISABLED',
  ]) delete env[key];
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, repoRoot, xdgRuntimeDir, home, env };
}

function startTarget(sandbox, signalPath, exitDelayMs = 0) {
  const script = `
    process.on('SIGTERM', () => {
      require('node:fs').writeFileSync(process.env.SIGNAL_PATH, 'SIGTERM');
      setTimeout(() => process.exit(0), ${exitDelayMs});
    });
    setInterval(() => {}, 1000);
  `;
  return spawn(process.execPath, ['-e', script], {
    cwd: sandbox.repoRoot,
    env: { ...sandbox.env, SIGNAL_PATH: signalPath },
    stdio: 'ignore',
  });
}

function startPersistentProcess(sandbox) {
  return spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000);'], {
    cwd: sandbox.repoRoot,
    env: sandbox.env,
    stdio: 'ignore',
  });
}

function startCountingTarget(sandbox, signalPath, exitDelayMs = 0) {
  const script = `
    let signals = 0;
    process.on('SIGTERM', () => {
      signals += 1;
      require('node:fs').writeFileSync(process.env.SIGNAL_PATH, String(signals));
      setTimeout(() => process.exit(0), ${exitDelayMs});
    });
    setInterval(() => {}, 1000);
  `;
  return spawn(process.execPath, ['-e', script], {
    cwd: sandbox.repoRoot,
    env: { ...sandbox.env, SIGNAL_PATH: signalPath },
    stdio: 'ignore',
  });
}

function runKiller(sandbox, {
  loopId = String(process.pid),
  targetPid,
  transcriptPath,
  idleMs = 300,
  timeoutMs = 3000,
  targetParentPid = loopId,
}) {
  const env = {
    ...sandbox.env,
    SKILLED_LOOP_ID: String(loopId),
    KILLER_PARENT_PID: String(process.pid),
    TARGET_PID: String(targetPid),
    TARGET_PARENT_PID: String(targetParentPid),
  };
  const args = [
    KILLER_PATH,
    '--loop-id',
    String(loopId),
    '--target-pid',
    String(targetPid),
  ];
  if (transcriptPath) args.push('--transcript', transcriptPath);
  args.push(
    '--idle-ms',
    String(idleMs),
    '--timeout-ms',
    String(timeoutMs),
    '--no-notify',
  );
  return spawn(process.execPath, args, { cwd: sandbox.repoRoot, env, stdio: 'ignore' });
}

function installSigtermEsrchStub(sandbox, targetPid) {
  const preloadPath = path.join(sandbox.root, 'esrch-preload.cjs');
  const source = [
    "'use strict';",
    'const originalKill = process.kill.bind(process);',
    'process.kill = (pid, signal) => {',
    '  if (Number(pid) === Number(process.env.ESRCH_TARGET_PID)',
    '      && signal === "SIGTERM") {',
    '    const error = new Error("target disappeared");',
    '    error.code = "ESRCH";',
    '    throw error;',
    '  }',
    '  return originalKill(pid, signal);',
    '};',
    '',
  ].join('\n');
  fs.writeFileSync(preloadPath, source);
  const currentOptions = sandbox.env.NODE_OPTIONS || '';
  sandbox.env.NODE_OPTIONS = (currentOptions + ' --require=' + preloadPath).trim();
  sandbox.env.ESRCH_TARGET_PID = String(targetPid);
}

function installLivenessEpermStub(sandbox, targetPid) {
  const preloadPath = path.join(sandbox.root, 'liveness-eperm-preload.cjs');
  const source = [
    "'use strict';",
    'const originalKill = process.kill.bind(process);',
    'process.kill = (pid, signal) => {',
    '  if (Number(pid) === Number(process.env.EPERM_TARGET_PID) && signal === 0) {',
    '    const error = new Error("kill EPERM");',
    '    error.code = "EPERM";',
    '    throw error;',
    '  }',
    '  return originalKill(pid, signal);',
    '};',
    '',
  ].join('\n');
  fs.writeFileSync(preloadPath, source);
  const currentOptions = sandbox.env.NODE_OPTIONS || '';
  sandbox.env.NODE_OPTIONS = (currentOptions + ' --require=' + preloadPath).trim();
  sandbox.env.EPERM_TARGET_PID = String(targetPid);
}

function installUnlinkDelayStub(sandbox) {
  const preloadPath = path.join(sandbox.root, 'unlink-delay-preload.cjs');
  const source = [
    "'use strict';",
    'const fs = require("node:fs");',
    'const delayMs = Number(process.env.KILLER_LOCK_UNLINK_DELAY_MS || 0);',
    'const originalUnlinkSync = fs.unlinkSync;',
    'fs.unlinkSync = function (targetPath, ...args) {',
    '  if (delayMs > 0 && typeof targetPath === "string"',
    '      && /killer-.*\\.lock$/.test(targetPath)) {',
    '    const until = Date.now() + delayMs;',
    '    while (Date.now() < until) {}',
    '  }',
    '  return originalUnlinkSync.call(this, targetPath, ...args);',
    '};',
    '',
  ].join('\n');
  fs.writeFileSync(preloadPath, source);
  const currentOptions = sandbox.env.NODE_OPTIONS || '';
  sandbox.env.NODE_OPTIONS = (currentOptions + ' --require=' + preloadPath).trim();
}

function installRenameDelayStub(sandbox) {
  const preloadPath = path.join(sandbox.root, 'rename-delay-preload.cjs');
  const source = [
    "'use strict';",
    'const fs = require("node:fs");',
    'const delayMs = Number(process.env.KILLER_TAKEOVER_RENAME_DELAY_MS || 0);',
    'const originalRenameSync = fs.renameSync;',
    'fs.renameSync = function (sourcePath, targetPath, ...args) {',
    '  if (delayMs > 0 && typeof sourcePath === "string"',
    '      && /killer-.*\\.lock\\.takeover$/.test(sourcePath)) {',
    '    const until = Date.now() + delayMs;',
    '    while (Date.now() < until) {}',
    '  }',
    '  return originalRenameSync.call(this, sourcePath, targetPath, ...args);',
    '};',
    '',
  ].join('\n');
  fs.writeFileSync(preloadPath, source);
  const currentOptions = sandbox.env.NODE_OPTIONS || '';
  sandbox.env.NODE_OPTIONS = (currentOptions + ' --require=' + preloadPath).trim();
}

function installTakeoverStrayStub(sandbox) {
  const preloadPath = path.join(sandbox.root, 'takeover-stray-preload.cjs');
  const source = [
    "'use strict';",
    'const fs = require("node:fs");',
    'const originalWriteFileSync = fs.writeFileSync;',
    'fs.writeFileSync = function (targetPath, ...args) {',
    '  const result = originalWriteFileSync.call(this, targetPath, ...args);',
    '  if (typeof targetPath === "string"',
    '      && /killer-.*\\.lock\\.takeover\\/owner$/.test(targetPath)) {',
    '    const strayPath = targetPath.slice(0, targetPath.length - "owner".length)',
    '      + "stray";',
    '    originalWriteFileSync.call(this, strayPath, "leftover");',
    '  }',
    '  return result;',
    '};',
    '',
  ].join('\n');
  fs.writeFileSync(preloadPath, source);
  const currentOptions = sandbox.env.NODE_OPTIONS || '';
  sandbox.env.NODE_OPTIONS = (currentOptions + ' --require=' + preloadPath).trim();
}

function installTakeoverReplaceStub(sandbox) {
  const preloadPath = path.join(sandbox.root, 'takeover-replace-preload.cjs');
  const source = [
    "'use strict';",
    'const fs = require("node:fs");',
    'const path = require("node:path");',
    'const originalWriteFileSync = fs.writeFileSync;',
    'fs.writeFileSync = function (targetPath, ...args) {',
    '  const result = originalWriteFileSync.call(this, targetPath, ...args);',
    '  if (typeof targetPath === "string"',
    '      && /killer-.*\\.lock\\.takeover\\/owner$/.test(targetPath)) {',
    '    const mutexPath = path.dirname(targetPath);',
    '    fs.rmSync(mutexPath, { recursive: true, force: true });',
    '    fs.mkdirSync(mutexPath);',
    '  }',
    '  return result;',
    '};',
    '',
  ].join('\n');
  fs.writeFileSync(preloadPath, source);
  const currentOptions = sandbox.env.NODE_OPTIONS || '';
  sandbox.env.NODE_OPTIONS = (currentOptions + ' --require=' + preloadPath).trim();
}

function installTakeoverRemovalFailureStub(sandbox) {
  const preloadPath = path.join(sandbox.root, 'takeover-removal-failure-preload.cjs');
  const source = [
    "'use strict';",
    'const fs = require("node:fs");',
    'const originalRmSync = fs.rmSync;',
    'fs.rmSync = function (targetPath, ...args) {',
    '  if (typeof targetPath === "string"',
    '      && /killer-.*\\.lock\\.takeover$/.test(targetPath)) {',
    '    const error = new Error("mutex removal failed");',
    '    error.code = "EPERM";',
    '    throw error;',
    '  }',
    '  return originalRmSync.call(this, targetPath, ...args);',
    '};',
    '',
  ].join('\n');
  fs.writeFileSync(preloadPath, source);
  const currentOptions = sandbox.env.NODE_OPTIONS || '';
  sandbox.env.NODE_OPTIONS = (currentOptions + ' --require=' + preloadPath).trim();
}

function waitForExit(child, timeoutMs) {
  return new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) {
      resolve({ code: child.exitCode, signal: child.signalCode });
      return;
    }
    const timer = setTimeout(() => resolve({ timedOut: true }), timeoutMs);
    child.once('exit', (code, signal) => {
      clearTimeout(timer);
      resolve({ code, signal });
    });
  });
}

async function waitFor(predicate, timeoutMs = 1200) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return true;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  return predicate();
}

function createTranscript(sandbox) {
  const transcriptPath = path.join(sandbox.repoRoot, 'transcript.jsonl');
  fs.writeFileSync(transcriptPath, '{"type":"user","message":"still active"}\n');
  return transcriptPath;
}

function createRelaunchRecord(
  sandbox,
  loopId,
  runtime = 'claude',
  handoffPath = path.join(sandbox.repoRoot, 'handoff.md'),
  hops = 0,
) {
  core.preparePending({
    loopId: String(loopId),
    handoffPath,
    sessionId: 'session-killer-0001',
    runtime,
    name: null,
    cwd: sandbox.repoRoot,
    hops,
    env: sandbox.env,
  });
  core.arm({ loopId: String(loopId), cwd: sandbox.repoRoot, env: sandbox.env });
}

function writeSpecFolderNote(handoffPath, specFolder) {
  fs.mkdirSync(path.dirname(handoffPath), { recursive: true });
  fs.writeFileSync(handoffPath, `---\nspec_folder: ${specFolder}\n---\n`);
}

function lockPath(sandbox, loopId) {
  return path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', `killer-${loopId}.lock`);
}

// The owner line lands after the exclusive create that publishes the lock path, so a
// check for the path alone can read a lock whose owner is not written yet. Waiting on
// the recorded owner instead keeps a contender's write from racing that first write.
function waitForLockOwner(sandbox, loopId, ownerPid) {
  return waitFor(() => {
    try {
      const [recordedOwner] = fs.readFileSync(lockPath(sandbox, loopId), 'utf8').trim().split(/\s+/);
      return recordedOwner === String(ownerPid);
    } catch (error) {
      if (error.code === 'ENOENT') return false;
      throw error;
    }
  });
}

function readKillerLog(sandbox) {
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');
  return fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8') : '';
}

function takeoverLeftovers(sandbox, loopId) {
  const lock = lockPath(sandbox, loopId);
  const prefix = `${path.basename(lock)}.takeover`;
  return fs.readdirSync(path.dirname(lock)).filter((entry) => entry.startsWith(prefix));
}

function staleLockLeftovers(sandbox, loopId) {
  const lock = lockPath(sandbox, loopId);
  const prefix = `${path.basename(lock)}.stale-`;
  return fs.readdirSync(path.dirname(lock)).filter((entry) => entry.startsWith(prefix));
}

function killChild(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  try {
    child.kill('SIGKILL');
  } catch (error) {
    if (error.code !== 'ESRCH') throw error;
  }
}

test('ancestor walk stops when the process table repeats a pid', () => {
  const { hasAncestor } = require('../lib/killer.cjs');
  const cyclicParents = new Map([[10, 11], [11, 10]]);
  const unrelatedParents = new Map([[10, 11], [11, 1]]);
  assert.equal(hasAncestor(cyclicParents, 10, 99), false);
  assert.equal(hasAncestor(cyclicParents, 10, 10), false);
  assert.equal(hasAncestor(cyclicParents, 10, 11), true);
  assert.equal(hasAncestor(unrelatedParents, 10, 99), false);
});

test('killer signals an idle target and releases its lock', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 6500);
    assert.equal(result.timedOut, undefined, 'killer should exit after signaling an idle target');
    assert.equal(result.code, 0);
    assert.equal(fs.readFileSync(signalPath, 'utf8'), 'SIGTERM');
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
  } finally {
    killChild(killer);
    killChild(target);
  }
});

test('killer signals an idle armed target after --idle-ms without a transcript', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal-no-transcript');
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, idleMs: 100 });
  try {
    const result = await waitForExit(killer, 2500);
    assert.equal(result.timedOut, undefined, 'killer should exit after the idle interval');
    assert.equal(result.code, 0);
    assert.equal(fs.readFileSync(signalPath, 'utf8'), 'SIGTERM');
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
  } finally {
    killChild(killer);
    killChild(target);
  }
});

test('killer never signals a target that is not a descendant of SKILLED_LOOP_ID', async (t) => {
  const sandbox = createSandbox(t);
  const loopProcess = spawn('sleep', ['30'], {
    cwd: sandbox.repoRoot,
    env: sandbox.env,
    stdio: 'ignore',
  });
  const target = spawn('sleep', ['30'], {
    cwd: sandbox.repoRoot,
    env: sandbox.env,
    stdio: 'ignore',
  });
  let killer;

  try {
    const waitForSpawn = (child) => new Promise((resolve, reject) => {
      child.once('spawn', resolve);
      child.once('error', reject);
    });
    await Promise.all([waitForSpawn(loopProcess), waitForSpawn(target)]);

    const loopId = String(loopProcess.pid);
    const transcriptPath = createTranscript(sandbox);
    createRelaunchRecord(sandbox, loopId);
    killer = runKiller(sandbox, {
      loopId,
      targetPid: target.pid,
      transcriptPath,
      idleMs: 50,
      timeoutMs: 500,
      targetParentPid: String(process.pid),
    });

    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(loopProcess.signalCode, null);
    assert.equal(target.exitCode, null, 'the sibling target should remain alive');
    assert.equal(target.signalCode, null, 'the killer should not signal the sibling target');
    assert.equal(process.kill(loopProcess.pid, 0), true);
    assert.equal(process.kill(target.pid, 0), true);
    assert.match(readKillerLog(sandbox), /killer-refused-target/);
    assert.equal(core.readRelaunchFile(loopId, sandbox.env).status, 'armed');
  } finally {
    killChild(killer);
    killChild(target);
    killChild(loopProcess);
  }
});

test('killer does not signal when the relaunch record is missing', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.existsSync(signalPath), false);
    assert.equal(process.kill(target.pid, 0), true);
    assert.match(readKillerLog(sandbox), /killer-no-armed-record/);
  } finally {
    killChild(killer);
    killChild(target);
  }
});

test('killer refuses loop id 1 and leaves the target alive', async (t) => {
  const sandbox = createSandbox(t);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  const killer = runKiller(sandbox, { loopId: '1', targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 1);
    assert.equal(fs.existsSync(signalPath), false);
    assert.equal(process.kill(target.pid, 0), true);
  } finally {
    killChild(killer);
    killChild(target);
  }
});

test('killer keeps the record armed when the target exits during its grace period', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, signalPath, 800);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  const killer = runKiller(sandbox, {
    loopId,
    targetPid: target.pid,
    transcriptPath,
    idleMs: 400,
    timeoutMs: 450,
  });
  try {
    const result = await waitForExit(killer, 6500);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.readFileSync(signalPath, 'utf8'), 'SIGTERM');
    const record = JSON.parse(fs.readFileSync(
      path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', `relaunch-${loopId}.json`),
      'utf8',
    ));
    assert.equal(record.status, 'armed');
    assert.doesNotMatch(readKillerLog(sandbox), /killer-timeout/);
  } finally {
    killChild(killer);
    killChild(target);
  }
});

test('killer treats an EPERM liveness probe as a target that is already gone', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  installLivenessEpermStub(sandbox, target.pid);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    const killerLog = readKillerLog(sandbox);
    assert.doesNotMatch(killerLog, /killer-error/);
    assert.doesNotMatch(killerLog, /killer-timeout/);
    assert.equal(result.code, 0);
    assert.equal(fs.existsSync(signalPath), false);
    assert.equal(process.kill(target.pid, 0), true);
    assert.equal(core.readRelaunchFile(loopId, sandbox.env).status, 'armed');
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
  } finally {
    killChild(killer);
    killChild(target);
  }
});

test('killer times out on an active transcript, unarms and releases its lock', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, path.join(sandbox.root, 'target-signal'));
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  const touchTimer = setInterval(() => {
    const now = new Date();
    fs.utimesSync(transcriptPath, now, now);
  }, 100);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 5000);
    assert.equal(result.timedOut, undefined, 'killer should stop after its configured timeout');
    assert.equal(result.code, 0);
    assert.equal(process.kill(target.pid, 0), true);
    const recordPath = path.join(
      sandbox.xdgRuntimeDir,
      'skilled-relaunch',
      `relaunch-${loopId}.json`,
    );
    const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
    assert.equal(record.status, 'disarmed');
    assert.equal(record.disarmReason, 'killer-timeout');
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
  } finally {
    clearInterval(touchTimer);
    killChild(killer);
    killChild(target);
  }
});

test('a second killer respects the lock held by the first killer', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const transcriptPath = createTranscript(sandbox);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  const touchTimer = setInterval(() => {
    const now = new Date();
    fs.utimesSync(transcriptPath, now, now);
  }, 100);
  const first = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  let second;
  try {
    assert.equal(
      await waitFor(() => fs.existsSync(lockPath(sandbox, loopId))),
      true,
      'first killer should hold the lock',
    );
    second = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
    const secondResult = await waitForExit(second, 2000);
    assert.equal(secondResult.timedOut, undefined);
    assert.equal(process.kill(target.pid, 0), true);
    assert.equal(fs.existsSync(signalPath), false);
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), true);
    const firstResult = await waitForExit(first, 5000);
    assert.equal(firstResult.timedOut, undefined);
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
    assert.match(readKillerLog(sandbox), /killer-lock-held/);
  } finally {
    clearInterval(touchTimer);
    killChild(second);
    killChild(first);
    killChild(target);
  }
});

test('killer logs and respects a lock held by a live owner', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  fs.writeFileSync(lockPath(sandbox, loopId), `${process.pid} ${new Date().toISOString()}\n`);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.existsSync(signalPath), false);
    assert.equal(process.kill(target.pid, 0), true);
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), true);
    assert.match(readKillerLog(sandbox), /killer-lock-held/);
  } finally {
    killChild(killer);
    killChild(target);
  }
});

test('killer takes over a lock whose live owner recorded a past expiry', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  // A killer killed with SIGKILL leaves this pid behind, and pid reuse can keep
  // it alive long after the lock stopped meaning anything.
  const createdIso = new Date(Date.now() - 120000).toISOString();
  const expiresIso = new Date(Date.now() - 60000).toISOString();
  fs.writeFileSync(lockPath(sandbox, loopId), `${process.pid} ${createdIso} ${expiresIso}\n`);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 6500);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.readFileSync(signalPath, 'utf8'), 'SIGTERM');
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
    assert.match(readKillerLog(sandbox), /killer-lock-stale/);
  } finally {
    killChild(killer);
    killChild(target);
  }
});

test('killer leaves a lock that a contender claimed while it supervised', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const transcriptPath = createTranscript(sandbox);
  const target = startPersistentProcess(sandbox);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  const touchTimer = setInterval(() => {
    const now = new Date();
    fs.utimesSync(transcriptPath, now, now);
  }, 100);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath, timeoutMs: 1500 });
  try {
    assert.equal(
      await waitForLockOwner(sandbox, loopId, killer.pid),
      true,
      'killer should take the lock before the contender claims it',
    );
    // A killer that outlives its own lock loses it to a contender; that contender's
    // lock has to outlive this exit, or a third killer is let in on a live loop.
    const contenderCreatedIso = new Date().toISOString();
    const contenderExpiresIso = new Date(Date.now() + 60000).toISOString();
    const contenderLock = `${process.pid} ${contenderCreatedIso} ${contenderExpiresIso}\n`;
    fs.writeFileSync(lockPath(sandbox, loopId), contenderLock);
    const result = await waitForExit(killer, 5000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(
      fs.existsSync(lockPath(sandbox, loopId)),
      true,
      'the contender lock must survive this killer exit',
    );
    assert.equal(fs.readFileSync(lockPath(sandbox, loopId), 'utf8'), contenderLock);
    const lockLine = readKillerLog(sandbox)
      .split('\n')
      .find((line) => line.includes('killer-lock-not-owned'));
    assert.ok(lockLine, 'the killer should record that the lock changed owner');
    assert.ok(lockLine.includes(`ownerPid=${process.pid}`), lockLine);
    assert.ok(lockLine.includes(`loopId=${loopId}`), lockLine);
    assert.match(readKillerLog(sandbox), /killer-timeout/);
    assert.equal(process.kill(target.pid, 0), true);
  } finally {
    clearInterval(touchTimer);
    killChild(killer);
    killChild(target);
  }
});

test('killer removes its own lock when no contender claimed it', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const transcriptPath = createTranscript(sandbox);
  const target = startPersistentProcess(sandbox);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  const touchTimer = setInterval(() => {
    const now = new Date();
    fs.utimesSync(transcriptPath, now, now);
  }, 100);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath, timeoutMs: 400 });
  try {
    const result = await waitForExit(killer, 5000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
    assert.doesNotMatch(readKillerLog(sandbox), /killer-lock-not-owned/);
  } finally {
    clearInterval(touchTimer);
    killChild(killer);
    killChild(target);
  }
});

test('killer holds an empty lock younger than five seconds', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  fs.writeFileSync(lockPath(sandbox, loopId), '');
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.existsSync(signalPath), false);
    assert.equal(process.kill(target.pid, 0), true);
    assert.equal(fs.readFileSync(lockPath(sandbox, loopId), 'utf8'), '');
    assert.match(readKillerLog(sandbox), /killer-lock-held/);
  } finally {
    killChild(killer);
    killChild(target);
  }
});

test('killer holds a fresh directory at the lock path', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  fs.mkdirSync(lockPath(sandbox, loopId));
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.existsSync(signalPath), false);
    assert.equal(process.kill(target.pid, 0), true);
    assert.equal(fs.statSync(lockPath(sandbox, loopId)).isDirectory(), true);
    assert.doesNotMatch(readKillerLog(sandbox), /killer-error/);
    assert.match(readKillerLog(sandbox), /killer-lock-held/);
  } finally {
    killChild(killer);
    killChild(target);
  }
});

test('killer takes over a stale directory at the lock path', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  // A directory at the lock path records no owner, and one older than the
  // creating window cannot belong to a killer mid-create, so it pins the loop
  // exactly like a stale file and has to be taken over the same way.
  fs.mkdirSync(lockPath(sandbox, loopId));
  const oldStamp = new Date(Date.now() - 10000);
  fs.utimesSync(lockPath(sandbox, loopId), oldStamp, oldStamp);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.readFileSync(signalPath, 'utf8'), 'SIGTERM');
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
    assert.deepEqual(staleLockLeftovers(sandbox, loopId), []);
    assert.doesNotMatch(readKillerLog(sandbox), /killer-error/);
    assert.match(readKillerLog(sandbox), /killer-lock-stale/);
  } finally {
    killChild(killer);
    killChild(target);
  }
});

test('killer logs target-gone when SIGTERM races with target exit', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  installSigtermEsrchStub(sandbox, target.pid);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.existsSync(signalPath), false);
    assert.equal(process.kill(target.pid, 0), true);
    assert.equal(core.readRelaunchFile(loopId, sandbox.env).status, 'armed');
    assert.match(readKillerLog(sandbox), /target-gone/);
  } finally {
    killChild(killer);
    killChild(target);
  }
});

test('killer refuses to signal a disarmed record', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  core.unarm({ loopId, env: sandbox.env, reason: 'test-disarmed' });
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.existsSync(signalPath), false);
    assert.equal(process.kill(target.pid, 0), true);
    assert.equal(core.readRelaunchFile(loopId, sandbox.env).status, 'disarmed');
    assert.match(readKillerLog(sandbox), /killer-no-armed-record/);
  } finally {
    killChild(killer);
    killChild(target);
  }
});

// A record prepared before the cap was lowered still arms, but the wrapper declines its
// hop, so signalling would end a session that no relaunch can follow. The killer leaves
// the note for the operator's own claim instead.
test('killer unarms an armed record at the hop limit without signalling', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId, 'claude', path.join(sandbox.repoRoot, 'handoff.md'), 2);
  sandbox.env.SESSION_RELAUNCH_MAX_HOPS = '2';
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 3000);
    assert.equal(result.timedOut, undefined, 'killer should stop at the hop limit');
    assert.equal(result.code, 0);
    assert.equal(fs.existsSync(signalPath), false, 'the hop cap must stop the signal');
    assert.equal(process.kill(target.pid, 0), true);
    const record = core.readRelaunchFile(loopId, sandbox.env);
    assert.equal(record.status, 'disarmed');
    assert.equal(record.disarmReason, 'hop-cap');
    const killerLog = readKillerLog(sandbox);
    assert.match(killerLog, /killer-hop-cap/);
    assert.doesNotMatch(killerLog, /killer-signal/);
    assert.doesNotMatch(killerLog, /killer-timeout/);
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
  } finally {
    killChild(killer);
    killChild(target);
  }
});

test('killer still signals an armed record below the hop limit', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId, 'claude', path.join(sandbox.repoRoot, 'handoff.md'), 1);
  sandbox.env.SESSION_RELAUNCH_MAX_HOPS = '2';
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 6500);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.readFileSync(signalPath, 'utf8'), 'SIGTERM');
    assert.doesNotMatch(readKillerLog(sandbox), /killer-hop-cap/);
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
  } finally {
    killChild(killer);
    killChild(target);
  }
});

test('killer logs a disarmed record before refusing a non-descendant target', async (t) => {
  const sandbox = createSandbox(t);
  const loopProcess = spawn('sleep', ['30'], {
    cwd: sandbox.repoRoot,
    env: sandbox.env,
    stdio: 'ignore',
  });
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, signalPath);
  let killer;

  try {
    const waitForSpawn = (child) => new Promise((resolve, reject) => {
      child.once('spawn', resolve);
      child.once('error', reject);
    });
    await Promise.all([waitForSpawn(loopProcess), waitForSpawn(target)]);
    const loopId = String(loopProcess.pid);
    createRelaunchRecord(sandbox, loopId);
    core.unarm({ loopId, env: sandbox.env, reason: 'test-disarmed' });
    killer = runKiller(sandbox, {
      loopId,
      targetPid: target.pid,
      transcriptPath,
      idleMs: 50,
      timeoutMs: 500,
      targetParentPid: String(process.pid),
    });

    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.existsSync(signalPath), false, 'a disarmed record must not signal');
    assert.equal(process.kill(target.pid, 0), true);
    // The disarmed record must end the wait before the ancestry probe, or this
    // exit would be logged as a refusal of a relaunch that was never armed.
    const killerLog = readKillerLog(sandbox);
    assert.match(killerLog, /killer-no-armed-record/);
    assert.doesNotMatch(
      killerLog,
      /killer-refused-target/,
      'a disarmed record must not reach the ancestry refusal',
    );
  } finally {
    killChild(killer);
    killChild(target);
    killChild(loopProcess);
  }
});

test('killer breaks a stale lock and proceeds', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const deadOwner = spawn(process.execPath, ['-e', 'process.exit(0);'], { stdio: 'ignore' });
  await new Promise((resolve) => deadOwner.once('exit', resolve));
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  fs.writeFileSync(lockPath(sandbox, loopId), `${deadOwner.pid} ${new Date().toISOString()}\n`);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.readFileSync(signalPath, 'utf8'), 'SIGTERM');
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
    assert.match(readKillerLog(sandbox), /killer-lock-stale/);
  } finally {
    killChild(killer);
    killChild(target);
    killChild(deadOwner);
  }
});

test('killer timeout notification escapes a quoted handoff path', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const handoffPath = path.join(sandbox.repoRoot, 'handoff-"quoted".md');
  writeSpecFolderNote(handoffPath, SPEC_FOLDER);
  const target = startPersistentProcess(sandbox);
  await new Promise((resolve) => target.once('spawn', resolve));
  sandbox.env.SKILLED_LOOP_ID = loopId;
  createRelaunchRecord(sandbox, loopId, 'pi', handoffPath);

  const realSpawnSync = childProcess.spawnSync;
  const notifications = [];
  childProcess.spawnSync = (command, args, options) => {
    if (command === 'osascript') {
      notifications.push(args.join(' '));
      return { status: 0, stdout: '', stderr: '' };
    }
    return realSpawnSync(command, args, options);
  };

  try {
    const killerModulePath = require.resolve('../lib/killer.cjs');
    delete require.cache[killerModulePath];
    const { main } = require(killerModulePath);
    await main([
      '--loop-id', loopId,
      '--target-pid', String(target.pid),
      '--idle-ms', '200',
      '--timeout-ms', '50',
    ], sandbox.env);

    const record = core.readRelaunchFile(loopId, sandbox.env);
    assert.equal(record.status, 'disarmed');
    assert.equal(record.disarmReason, 'killer-timeout');
    assert.equal(notifications.length, 1);
    const notification = notifications[0].match(
      /display notification ("(?:\\.|[^"\\])*") with title /,
    );
    assert.ok(notification, 'osascript should receive a quoted notification string');
    const command = JSON.parse(notification[1]);
    const escapedHandoffPath = handoffPath.replace(/"/g, '\\"');
    assert.equal(
      command,
      `skilled-loop pi "[session-relaunch] claim and continue handoff ${escapedHandoffPath}`
        + `${SPEC_FOLDER_SUFFIX}"`,
    );
  } finally {
    childProcess.spawnSync = realSpawnSync;
    killChild(target);
  }
});

test('killer timeout notification uses the runtime seed form', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const handoffPath = path.join(sandbox.repoRoot, 'handoff.md');
  writeSpecFolderNote(handoffPath, SPEC_FOLDER);
  const target = startPersistentProcess(sandbox);
  await new Promise((resolve) => target.once('spawn', resolve));
  sandbox.env.SKILLED_LOOP_ID = loopId;
  createRelaunchRecord(sandbox, loopId, 'hermes', handoffPath);

  const realSpawnSync = childProcess.spawnSync;
  const notifications = [];
  childProcess.spawnSync = (command, args, options) => {
    if (command === 'osascript') {
      notifications.push(args.join(' '));
      return { status: 0, stdout: '', stderr: '' };
    }
    return realSpawnSync(command, args, options);
  };

  try {
    const killerModulePath = require.resolve('../lib/killer.cjs');
    delete require.cache[killerModulePath];
    const { main } = require(killerModulePath);
    await main([
      '--loop-id', loopId,
      '--target-pid', String(target.pid),
      '--idle-ms', '200',
      '--timeout-ms', '50',
    ], sandbox.env);

    assert.equal(notifications.length, 1);
    const notification = notifications[0].match(
      /display notification ("(?:\\.|[^"\\])*") with title /,
    );
    assert.ok(notification, 'osascript should receive a quoted notification string');
    const expected = [
      'skilled-loop hermes chat -q "[session-relaunch] ',
      `claim and continue handoff ${handoffPath}${SPEC_FOLDER_SUFFIX}"`,
    ].join('');
    assert.equal(JSON.parse(notification[1]), expected);
  } finally {
    childProcess.spawnSync = realSpawnSync;
    killChild(target);
  }
});

for (const { label, specFolder } of [
  { label: 'none', specFolder: 'none' },
  { label: 'empty', specFolder: '' },
  { label: 'hand-edited unnumbered', specFolder: 'specs/hooks/session-relaunch' },
]) {
  const description = label === 'hand-edited unnumbered'
    ? 'omits an invalid hand-edited folder'
    : `carries the ${label} spec-folder answer`;
  test(`killer timeout notice ${description}`, async (t) => {
    const sandbox = createSandbox(t);
    const loopId = String(process.pid);
    const handoffPath = path.join(sandbox.repoRoot, 'handoff.md');
    writeSpecFolderNote(handoffPath, specFolder);
    const target = startPersistentProcess(sandbox);
    await new Promise((resolve) => target.once('spawn', resolve));
    sandbox.env.SKILLED_LOOP_ID = loopId;
    createRelaunchRecord(sandbox, loopId, 'claude', handoffPath);

    const realSpawnSync = childProcess.spawnSync;
    const notifications = [];
    childProcess.spawnSync = (command, args, options) => {
      if (command === 'osascript') {
        notifications.push(args.join(' '));
        return { status: 0, stdout: '', stderr: '' };
      }
      return realSpawnSync(command, args, options);
    };

    try {
      const killerModulePath = require.resolve('../lib/killer.cjs');
      delete require.cache[killerModulePath];
      const { main } = require(killerModulePath);
      await main([
        '--loop-id', loopId,
        '--target-pid', String(target.pid),
        '--idle-ms', '200',
        '--timeout-ms', '50',
      ], sandbox.env);

      assert.equal(notifications.length, 1);
      const notification = notifications[0].match(
        /display notification ("(?:\\.|[^"\\])*") with title /,
      );
      assert.ok(notification, 'osascript should receive a quoted notification string');
      const suffix = specFolder === 'none' ? SKIP_SPEC_FOLDER_SUFFIX : '';
      assert.equal(JSON.parse(notification[1]),
        `skilled-loop claude "[session-relaunch] claim and continue handoff ${handoffPath}`
          + `${suffix}"`);
    } finally {
      childProcess.spawnSync = realSpawnSync;
      killChild(target);
    }
  });
}

test('killer timeout logs without notice when its record is missing', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const handoffPath = path.join(sandbox.repoRoot, 'handoff.md');
  writeSpecFolderNote(handoffPath, SPEC_FOLDER);
  const target = startPersistentProcess(sandbox);
  await new Promise((resolve) => target.once('spawn', resolve));
  sandbox.env.SKILLED_LOOP_ID = loopId;
  createRelaunchRecord(sandbox, loopId, 'claude', handoffPath);
  fs.unlinkSync(path.join(
    sandbox.xdgRuntimeDir,
    'skilled-relaunch',
    `relaunch-${loopId}.json`,
  ));

  const realSpawnSync = childProcess.spawnSync;
  const notifications = [];
  childProcess.spawnSync = (command, args, options) => {
    if (command === 'osascript') {
      notifications.push(args.join(' '));
      return { status: 0, stdout: '', stderr: '' };
    }
    return realSpawnSync(command, args, options);
  };

  try {
    const killerModulePath = require.resolve('../lib/killer.cjs');
    delete require.cache[killerModulePath];
    const { main } = require(killerModulePath);
    await main([
      '--loop-id', loopId,
      '--target-pid', String(target.pid),
      '--idle-ms', '200',
      '--timeout-ms', '50',
    ], sandbox.env);

    assert.match(readKillerLog(sandbox), /killer-timeout/);
    assert.equal(notifications.length, 0);
  } finally {
    childProcess.spawnSync = realSpawnSync;
    killChild(target);
  }
});

test('killer timeout keeps a re-prepared pending record and still logs and notifies', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const handoffPath = path.join(sandbox.repoRoot, 'handoff.md');
  writeSpecFolderNote(handoffPath, SPEC_FOLDER);
  const target = startPersistentProcess(sandbox);
  await new Promise((resolve) => target.once('spawn', resolve));
  sandbox.env.SKILLED_LOOP_ID = loopId;
  createRelaunchRecord(sandbox, loopId, 'claude', handoffPath);

  const realSpawnSync = childProcess.spawnSync;
  const notifications = [];
  childProcess.spawnSync = (command, args, options) => {
    if (command === 'osascript') {
      notifications.push(args.join(' '));
      return { status: 0, stdout: '', stderr: '' };
    }
    return realSpawnSync(command, args, options);
  };

  try {
    const killerModulePath = require.resolve('../lib/killer.cjs');
    delete require.cache[killerModulePath];
    const { main } = require(killerModulePath);
    const timeout = main([
      '--loop-id', loopId,
      '--target-pid', String(target.pid),
      '--idle-ms', '200',
      '--timeout-ms', '100',
    ], sandbox.env);
    await new Promise((resolve) => setTimeout(resolve, 10));
    core.preparePending({
      loopId,
      handoffPath,
      sessionId: 'session-killer-0001',
      runtime: 'claude',
      name: null,
      cwd: sandbox.repoRoot,
      hops: 0,
      env: sandbox.env,
    });
    await timeout;

    assert.equal(core.readRelaunchFile(loopId, sandbox.env).status, 'pending');
    assert.match(readKillerLog(sandbox), /killer-timeout/);
    assert.equal(notifications.length, 1);
  } finally {
    childProcess.spawnSync = realSpawnSync;
    killChild(target);
  }
});

test('killer timeout leaves a newer armed handoff to the killer that owns it', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const handoffPath = path.join(sandbox.repoRoot, 'handoff-a.md');
  const newerHandoffPath = path.join(sandbox.repoRoot, 'handoff-b.md');
  writeSpecFolderNote(handoffPath, SPEC_FOLDER);
  writeSpecFolderNote(newerHandoffPath, SPEC_FOLDER);
  const target = startPersistentProcess(sandbox);
  await new Promise((resolve) => target.once('spawn', resolve));
  sandbox.env.SKILLED_LOOP_ID = loopId;
  createRelaunchRecord(sandbox, loopId, 'claude', handoffPath);
  const transcriptPath = createTranscript(sandbox);
  const touchTimer = setInterval(() => {
    const now = new Date();
    fs.utimesSync(transcriptPath, now, now);
  }, 50);

  const realSpawnSync = childProcess.spawnSync;
  const notifications = [];
  childProcess.spawnSync = (command, args, options) => {
    if (command === 'osascript') {
      notifications.push(args.join(' '));
      return { status: 0, stdout: '', stderr: '' };
    }
    return realSpawnSync(command, args, options);
  };

  try {
    const killerModulePath = require.resolve('../lib/killer.cjs');
    delete require.cache[killerModulePath];
    const { main } = require(killerModulePath);
    const timeout = main([
      '--loop-id', loopId,
      '--target-pid', String(target.pid),
      '--transcript', transcriptPath,
      '--idle-ms', '200',
      '--timeout-ms', '700',
    ], sandbox.env);

    await new Promise((resolve) => setTimeout(resolve, 20));
    core.preparePending({
      loopId,
      handoffPath: newerHandoffPath,
      sessionId: 'session-killer-0002',
      runtime: 'claude',
      name: null,
      cwd: sandbox.repoRoot,
      hops: 0,
      env: sandbox.env,
    });
    core.arm({ loopId, cwd: sandbox.repoRoot, env: sandbox.env });
    await timeout;

    const record = core.readRelaunchFile(loopId, sandbox.env);
    assert.equal(record.status, 'armed', 'the newer handoff must stay armed for its own killer');
    assert.equal(record.handoff, newerHandoffPath);

    const killerLog = readKillerLog(sandbox);
    const supersededLine = killerLog
      .split('\n')
      .find((line) => line.includes('killer-timeout-superseded'));
    assert.ok(supersededLine, 'the timeout should record that a newer handoff took over');
    assert.ok(supersededLine.includes(`watched=${handoffPath}`), supersededLine);
    assert.ok(supersededLine.includes(`current=${newerHandoffPath}`), supersededLine);
    assert.doesNotMatch(killerLog, /^\S+ killer-timeout /m);
    assert.equal(notifications.length, 0, 'the stale note must not raise a manual-claim notice');
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
  } finally {
    clearInterval(touchTimer);
    childProcess.spawnSync = realSpawnSync;
    killChild(target);
  }
});

test('killer records a timeout when the transcript vanishes while it waits', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    assert.equal(
      await waitFor(() => fs.existsSync(lockPath(sandbox, loopId))),
      true,
      'killer should acquire its lock before the transcript is removed',
    );
    fs.unlinkSync(transcriptPath);
    const result = await waitForExit(killer, 2500);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(core.readRelaunchFile(loopId, sandbox.env).status, 'disarmed');
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
    assert.equal(fs.existsSync(signalPath), false);
    assert.equal(process.kill(target.pid, 0), true);
  } finally {
    killChild(killer);
    killChild(target);
  }
});

test('killer survives one transient transcript stat failure and still signals', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  sandbox.env.SKILLED_LOOP_ID = loopId;

  const realStatSync = fs.statSync;
  let injected = false;
  fs.statSync = function (statPath, ...args) {
    if (!injected && String(statPath) === transcriptPath) {
      injected = true;
      const error = new Error('transient stat failure');
      error.code = 'ENOENT';
      throw error;
    }
    return realStatSync.call(this, statPath, ...args);
  };

  try {
    const killerModulePath = require.resolve('../lib/killer.cjs');
    delete require.cache[killerModulePath];
    const { main } = require(killerModulePath);
    await main([
      '--loop-id', loopId,
      '--target-pid', String(target.pid),
      '--transcript', transcriptPath,
      '--idle-ms', '200',
      '--timeout-ms', '5000',
      '--no-notify',
    ], sandbox.env);

    assert.equal(injected, true, 'the transient stat failure should have been injected');
    assert.equal(
      fs.existsSync(signalPath),
      true,
      'one missed stat should not disarm a live session',
    );
    assert.equal(fs.readFileSync(signalPath, 'utf8'), 'SIGTERM');
  } finally {
    fs.statSync = realStatSync;
    killChild(target);
  }
});

test('killer gives up when the transcript stays missing past the stat grace window', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = path.join(sandbox.repoRoot, 'transcript.jsonl');
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  sandbox.env.SKILLED_LOOP_ID = loopId;

  const killerModulePath = require.resolve('../lib/killer.cjs');
  delete require.cache[killerModulePath];
  const { main } = require(killerModulePath);
  try {
    const startedAt = Date.now();
    await main([
      '--loop-id', loopId,
      '--target-pid', String(target.pid),
      '--transcript', transcriptPath,
      '--idle-ms', '200',
      '--timeout-ms', '5000',
      '--no-notify',
    ], sandbox.env);
    const elapsedMs = Date.now() - startedAt;

    assert.ok(
      elapsedMs >= 1000,
      `killer should keep watching through the grace window, exited in ${elapsedMs}ms`,
    );
    assert.equal(fs.existsSync(signalPath), false);
    assert.equal(process.kill(target.pid, 0), true);
    const record = core.readRelaunchFile(loopId, sandbox.env);
    assert.equal(record.status, 'disarmed');
    assert.equal(record.disarmReason, 'killer-timeout');
  } finally {
    killChild(target);
  }
});

test('two killers cannot both claim the same stale lock', async (t) => {
  const sandbox = createSandbox(t);
  installUnlinkDelayStub(sandbox);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const deadOwner = spawn(process.execPath, ['-e', 'process.exit(0);'], { stdio: 'ignore' });
  await new Promise((resolve) => deadOwner.once('exit', resolve));
  const target = startCountingTarget(sandbox, signalPath, 1500);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  fs.writeFileSync(lockPath(sandbox, loopId), `${deadOwner.pid} ${new Date().toISOString()}\n`);
  sandbox.env.KILLER_LOCK_UNLINK_DELAY_MS = '400';
  const first = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  sandbox.env.KILLER_LOCK_UNLINK_DELAY_MS = '800';
  const second = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  delete sandbox.env.KILLER_LOCK_UNLINK_DELAY_MS;
  const killers = [first, second];
  try {
    const results = await Promise.all(killers.map((killer) => waitForExit(killer, 8000)));
    assert.deepEqual(
      results.map((result) => result.timedOut),
      [undefined, undefined],
      'both killers should exit',
    );
    const signalLines = readKillerLog(sandbox)
      .split('\n')
      .filter((line) => line.includes('killer-signal'));
    assert.equal(signalLines.length, 1);
    const signals = fs.existsSync(signalPath) ? fs.readFileSync(signalPath, 'utf8') : '0';
    assert.equal(signals, '1');
  } finally {
    for (const killer of killers) killChild(killer);
    killChild(target);
    killChild(deadOwner);
  }
});

test('killer reclaims a takeover mutex whose recorded owner is dead', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const deadOwner = spawn(process.execPath, ['-e', 'process.exit(0);'], { stdio: 'ignore' });
  await new Promise((resolve) => deadOwner.once('exit', resolve));
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  fs.writeFileSync(lockPath(sandbox, loopId), `${deadOwner.pid} ${new Date().toISOString()}\n`);
  const mutexPath = `${lockPath(sandbox, loopId)}.takeover`;
  fs.mkdirSync(mutexPath);
  fs.writeFileSync(path.join(mutexPath, 'owner'), `${deadOwner.pid}\n`);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.readFileSync(signalPath, 'utf8'), 'SIGTERM');
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
    assert.deepEqual(takeoverLeftovers(sandbox, loopId), []);
    assert.match(readKillerLog(sandbox), /killer-lock-stale/);
  } finally {
    killChild(killer);
    killChild(target);
    killChild(deadOwner);
  }
});

test('killer leaves a takeover mutex to its live owner even when the directory is old', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const deadOwner = spawn(process.execPath, ['-e', 'process.exit(0);'], { stdio: 'ignore' });
  await new Promise((resolve) => deadOwner.once('exit', resolve));
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  fs.writeFileSync(lockPath(sandbox, loopId), `${deadOwner.pid} ${new Date().toISOString()}\n`);
  const mutexPath = `${lockPath(sandbox, loopId)}.takeover`;
  fs.mkdirSync(mutexPath);
  fs.writeFileSync(path.join(mutexPath, 'owner'), `${process.pid}\n`);
  const oldStamp = new Date(Date.now() - 60000);
  fs.utimesSync(mutexPath, oldStamp, oldStamp);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.existsSync(signalPath), false);
    assert.equal(process.kill(target.pid, 0), true);
    assert.match(readKillerLog(sandbox), /killer-lock-held/);
  } finally {
    killChild(killer);
    killChild(target);
    killChild(deadOwner);
  }
});

test('killer reclaims a takeover mutex whose live owner outlived the hold bound', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const deadOwner = spawn(process.execPath, ['-e', 'process.exit(0);'], { stdio: 'ignore' });
  await new Promise((resolve) => deadOwner.once('exit', resolve));
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  fs.writeFileSync(lockPath(sandbox, loopId), `${deadOwner.pid} ${new Date().toISOString()}\n`);
  const mutexPath = `${lockPath(sandbox, loopId)}.takeover`;
  fs.mkdirSync(mutexPath);
  fs.writeFileSync(path.join(mutexPath, 'owner'), `${process.pid}\n`);
  const killers = [];
  try {
    const freshKiller = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
    killers.push(freshKiller);
    const freshResult = await waitForExit(freshKiller, 2000);
    assert.equal(freshResult.timedOut, undefined);
    assert.equal(freshResult.code, 0);
    assert.match(readKillerLog(sandbox), /killer-lock-held/);
    assert.equal(fs.existsSync(signalPath), false);
    assert.equal(process.kill(target.pid, 0), true);
    assert.equal(fs.existsSync(mutexPath), true);

    const oldStamp = new Date(Date.now() - 11 * 60 * 1000);
    fs.utimesSync(mutexPath, oldStamp, oldStamp);
    const agedKiller = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
    killers.push(agedKiller);
    const agedResult = await waitForExit(agedKiller, 2000);
    assert.equal(agedResult.timedOut, undefined);
    assert.equal(agedResult.code, 0);
    assert.match(readKillerLog(sandbox), /killer-lock-stale/);
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
    assert.equal(fs.readFileSync(signalPath, 'utf8'), 'SIGTERM');
    assert.deepEqual(takeoverLeftovers(sandbox, loopId), []);
  } finally {
    for (const killer of killers) killChild(killer);
    killChild(target);
    killChild(deadOwner);
  }
});

test('killer sweeps an old leftover takeover directory but keeps a fresh one', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const deadOwner = spawn(process.execPath, ['-e', 'process.exit(0);'], { stdio: 'ignore' });
  await new Promise((resolve) => deadOwner.once('exit', resolve));
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  fs.writeFileSync(lockPath(sandbox, loopId), `${deadOwner.pid} ${new Date().toISOString()}\n`);
  const stalePrefix = `${lockPath(sandbox, loopId)}.takeover.stale-`;
  const oldLeftover = `${stalePrefix}111111`;
  const freshLeftover = `${stalePrefix}222222`;
  for (const leftover of [oldLeftover, freshLeftover]) {
    fs.mkdirSync(leftover);
    fs.writeFileSync(path.join(leftover, 'owner'), `${deadOwner.pid}\n`);
    fs.writeFileSync(path.join(leftover, 'stray'), 'leftover');
  }
  const oldStamp = new Date(Date.now() - 60000);
  fs.utimesSync(oldLeftover, oldStamp, oldStamp);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.readFileSync(signalPath, 'utf8'), 'SIGTERM');
    assert.equal(fs.existsSync(oldLeftover), false);
    assert.equal(fs.existsSync(freshLeftover), true);
    assert.match(readKillerLog(sandbox), /killer-lock-stale/);
  } finally {
    killChild(killer);
    killChild(target);
    killChild(deadOwner);
  }
});

test('killer reclaims a stale takeover directory that holds extra files', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const deadOwner = spawn(process.execPath, ['-e', 'process.exit(0);'], { stdio: 'ignore' });
  await new Promise((resolve) => deadOwner.once('exit', resolve));
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  fs.writeFileSync(lockPath(sandbox, loopId), `${deadOwner.pid} ${new Date().toISOString()}\n`);
  const mutexPath = `${lockPath(sandbox, loopId)}.takeover`;
  fs.mkdirSync(mutexPath);
  fs.writeFileSync(path.join(mutexPath, 'owner'), `${deadOwner.pid}\n`);
  fs.writeFileSync(path.join(mutexPath, 'stray'), 'leftover');
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.readFileSync(signalPath, 'utf8'), 'SIGTERM');
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
    assert.deepEqual(takeoverLeftovers(sandbox, loopId), []);
    assert.match(readKillerLog(sandbox), /killer-lock-stale/);
  } finally {
    killChild(killer);
    killChild(target);
    killChild(deadOwner);
  }
});

test('killer reclaims the takeover when a stale leftover already holds its pid', async (t) => {
  const sandbox = createSandbox(t);
  installRenameDelayStub(sandbox);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const deadOwner = spawn(process.execPath, ['-e', 'process.exit(0);'], { stdio: 'ignore' });
  await new Promise((resolve) => deadOwner.once('exit', resolve));
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  fs.writeFileSync(lockPath(sandbox, loopId), `${deadOwner.pid} ${new Date().toISOString()}\n`);
  const mutexPath = `${lockPath(sandbox, loopId)}.takeover`;
  fs.mkdirSync(mutexPath);
  fs.writeFileSync(path.join(mutexPath, 'owner'), `${deadOwner.pid}\n`);
  sandbox.env.KILLER_TAKEOVER_RENAME_DELAY_MS = '400';
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  delete sandbox.env.KILLER_TAKEOVER_RENAME_DELAY_MS;
  const collision = `${mutexPath}.stale-${killer.pid}`;
  fs.mkdirSync(collision);
  fs.writeFileSync(path.join(collision, 'junk'), 'leftover');
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.readFileSync(signalPath, 'utf8'), 'SIGTERM');
    assert.equal(fs.existsSync(collision), true);
    assert.match(readKillerLog(sandbox), /killer-lock-stale/);
  } finally {
    killChild(killer);
    killChild(target);
    killChild(deadOwner);
  }
});

test('killer releases a takeover directory that gained a stray file', async (t) => {
  const sandbox = createSandbox(t);
  installTakeoverStrayStub(sandbox);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const deadOwner = spawn(process.execPath, ['-e', 'process.exit(0);'], { stdio: 'ignore' });
  await new Promise((resolve) => deadOwner.once('exit', resolve));
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  fs.writeFileSync(lockPath(sandbox, loopId), `${deadOwner.pid} ${new Date().toISOString()}\n`);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.readFileSync(signalPath, 'utf8'), 'SIGTERM');
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
    assert.deepEqual(takeoverLeftovers(sandbox, loopId), []);
    assert.match(readKillerLog(sandbox), /killer-lock-stale/);
  } finally {
    killChild(killer);
    killChild(target);
    killChild(deadOwner);
  }
});

test('killer leaves a takeover directory a contender replaced while it was held', async (t) => {
  const sandbox = createSandbox(t);
  installTakeoverReplaceStub(sandbox);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const deadOwner = spawn(process.execPath, ['-e', 'process.exit(0);'], { stdio: 'ignore' });
  await new Promise((resolve) => deadOwner.once('exit', resolve));
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  fs.writeFileSync(lockPath(sandbox, loopId), `${deadOwner.pid} ${new Date().toISOString()}\n`);
  const mutexPath = `${lockPath(sandbox, loopId)}.takeover`;
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.readFileSync(signalPath, 'utf8'), 'SIGTERM');
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
    assert.equal(
      fs.existsSync(mutexPath),
      true,
      'a takeover directory the killer did not create should survive the release',
    );
  } finally {
    killChild(killer);
    killChild(target);
    killChild(deadOwner);
  }
});

test('killer exits non-zero when the takeover owner cannot be read', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const deadOwner = spawn(process.execPath, ['-e', 'process.exit(0);'], { stdio: 'ignore' });
  await new Promise((resolve) => deadOwner.once('exit', resolve));
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  fs.writeFileSync(lockPath(sandbox, loopId), `${deadOwner.pid} ${new Date().toISOString()}\n`);
  const mutexPath = `${lockPath(sandbox, loopId)}.takeover`;
  fs.mkdirSync(mutexPath);
  // A self-referential link keeps this a read failure no owner file can explain,
  // which is the case the killer must surface instead of taking the mutex over.
  fs.symlinkSync('owner', path.join(mutexPath, 'owner'));
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 1);
    assert.equal(fs.existsSync(signalPath), false);
    assert.equal(process.kill(target.pid, 0), true);
    assert.match(readKillerLog(sandbox), /killer-error/);
  } finally {
    killChild(killer);
    killChild(target);
    killChild(deadOwner);
  }
});

test('killer keeps its result when the takeover removal throws', async (t) => {
  const sandbox = createSandbox(t);
  installTakeoverRemovalFailureStub(sandbox);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const transcriptPath = createTranscript(sandbox);
  const deadOwner = spawn(process.execPath, ['-e', 'process.exit(0);'], { stdio: 'ignore' });
  await new Promise((resolve) => deadOwner.once('exit', resolve));
  const target = startTarget(sandbox, signalPath);
  await new Promise((resolve) => target.once('spawn', resolve));
  createRelaunchRecord(sandbox, loopId);
  fs.writeFileSync(lockPath(sandbox, loopId), `${deadOwner.pid} ${new Date().toISOString()}\n`);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath });
  try {
    const result = await waitForExit(killer, 2000);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.readFileSync(signalPath, 'utf8'), 'SIGTERM');
    assert.equal(fs.existsSync(lockPath(sandbox, loopId)), false);
    assert.match(readKillerLog(sandbox), /killer-mutex-release-error .*code=EPERM/);
  } finally {
    killChild(killer);
    killChild(target);
    killChild(deadOwner);
  }
});

test('killer restores a permissive state directory to private mode', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const stateDirectory = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch');
  fs.mkdirSync(stateDirectory, { recursive: true });
  fs.chmodSync(stateDirectory, 0o755);
  const target = startPersistentProcess(sandbox);
  await new Promise((resolve) => target.once('spawn', resolve));
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, idleMs: 5000 });
  try {
    assert.equal(
      await waitFor(() => fs.existsSync(lockPath(sandbox, loopId))),
      true,
      'killer should acquire its lock before it is signalled',
    );
    killer.kill('SIGTERM');
    const result = await waitForExit(killer, 2500);
    assert.equal(result.timedOut, undefined);
    assert.equal(result.code, 0);
    assert.equal(fs.statSync(stateDirectory).mode & 0o777, 0o700);
  } finally {
    killChild(killer);
    killChild(target);
  }
});
