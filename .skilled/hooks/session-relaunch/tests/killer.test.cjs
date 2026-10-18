// ────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Killer Tests
// ────────────────────────────────────────────────────────────────
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
const SKIP_SPEC_FOLDER_SUFFIX = ' | Spec folder: none (Gate 3 answered D)'
  + ' Skip in the sending session)';

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
    REPO_ROOT: repoRoot,
    PATH: `${binDir}:${process.env.PATH}`,
    TEST_PROCESS_PID: String(process.pid),
  };
  for (const key of [
    'SKILLED_LOOP_ID',
    'SKILLED_LOOP_HOPS',
    'SKILLED_LOOP_NAME',
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
) {
  core.preparePending({
    loopId: String(loopId),
    handoffPath,
    sessionId: 'session-killer-0001',
    runtime,
    name: null,
    cwd: sandbox.repoRoot,
    hops: 0,
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

function readKillerLog(sandbox) {
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');
  return fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8') : '';
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
