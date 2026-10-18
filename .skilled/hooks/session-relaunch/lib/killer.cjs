// ────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Killer
// ────────────────────────────────────────────────────────────────
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const core = require('./relaunch-core.cjs');

const POLL_INTERVAL_MS = 100;
const SIGNAL_WAIT_MS = 5000;
const NOTIFICATION_TIMEOUT_MS = 3000;
const LOCK_CREATING_WINDOW_MS = 5000;
const TERMINATION_SIGNALS = ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT'];

function parseInteger(value, optionName, minimum = 1) {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    throw new Error(optionName + ' must be an integer');
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < minimum) {
    throw new Error(optionName + ' is out of range');
  }
  return parsed;
}

function parseArguments(argv) {
  const options = {
    loopId: null,
    targetPid: null,
    transcriptPath: null,
    idleMs: 3000,
    timeoutMs: 30000,
    noNotify: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--no-notify') {
      options.noNotify = true;
      continue;
    }

    if (![
      '--loop-id',
      '--target-pid',
      '--transcript',
      '--idle-ms',
      '--timeout-ms',
    ].includes(argument)) {
      throw new Error('unknown argument: ' + argument);
    }
    const value = argv[index + 1];
    if (value === undefined) throw new Error(argument + ' requires a value');
    index += 1;

    if (argument === '--loop-id') options.loopId = value;
    if (argument === '--target-pid') options.targetPid = parseInteger(value, argument);
    if (argument === '--transcript') options.transcriptPath = value;
    if (argument === '--idle-ms') options.idleMs = parseInteger(value, argument);
    if (argument === '--timeout-ms') options.timeoutMs = parseInteger(value, argument);
  }

  if (!options.loopId || !options.targetPid) {
    throw new Error('required: --loop-id and --target-pid');
  }
  parseInteger(options.loopId, '--loop-id', 0);
  return options;
}

function log(event, environment, fields = {}) {
  core.appendLog(event, fields, environment);
}

function createSignalTracker() {
  let receivedSignal = null;
  const handlers = new Map();

  for (const signal of TERMINATION_SIGNALS) {
    const handler = () => {
      receivedSignal = signal;
    };
    handlers.set(signal, handler);
    process.on(signal, handler);
  }

  return {
    received: () => receivedSignal,
    dispose: () => {
      for (const [signal, handler] of handlers) {
        process.removeListener(signal, handler);
      }
    },
  };
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function targetIsRunning(targetPid) {
  try {
    process.kill(targetPid, 0);
    return true;
  } catch (error) {
    if (error.code === 'ESRCH') return false;
    throw error;
  }
}

function transcriptMtime(transcriptPath) {
  return fs.statSync(transcriptPath).mtimeMs;
}

function hasAncestor(parents, processId, ancestorId) {
  const visited = new Set([processId]);
  let parentPid = parents.get(processId);

  while (parentPid !== undefined && parentPid > 0) {
    if (visited.has(parentPid)) return false;
    if (parentPid === ancestorId) return true;
    visited.add(parentPid);
    parentPid = parents.get(parentPid);
  }
  return false;
}

async function waitForIdle(options, deadline, signalTracker) {
  if (!options.transcriptPath) {
    const idleAt = Date.now() + options.idleMs;
    while (Date.now() < idleAt && Date.now() < deadline) {
      if (signalTracker.received() || !targetIsRunning(options.targetPid)) return false;
      const remaining = Math.min(idleAt - Date.now(), deadline - Date.now());
      if (remaining > 0) await wait(Math.min(POLL_INTERVAL_MS, remaining));
    }
    return Date.now() >= idleAt
      && Date.now() <= deadline
      && targetIsRunning(options.targetPid);
  }

  let previousMtime = transcriptMtime(options.transcriptPath);
  let unchangedSince = Date.now();

  while (Date.now() < deadline) {
    if (signalTracker.received() || !targetIsRunning(options.targetPid)) return false;
    const currentMtime = transcriptMtime(options.transcriptPath);
    if (currentMtime !== previousMtime) {
      previousMtime = currentMtime;
      unchangedSince = Date.now();
    } else if (Date.now() - unchangedSince >= options.idleMs) {
      return true;
    }

    const remaining = deadline - Date.now();
    if (remaining > 0) await wait(Math.min(POLL_INTERVAL_MS, remaining));
  }
  return false;
}

function isLoopAncestor(targetPid, loopId) {
  const result = spawnSync('ps', ['-A', '-o', 'pid=,ppid='], {
    encoding: 'utf8',
    timeout: 2000,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error('ps exited with status ' + result.status);

  const parents = new Map();
  for (const line of result.stdout.split(/\r?\n/)) {
    const match = line.trim().match(/^(\d+)\s+(\d+)$/);
    if (match) parents.set(Number(match[1]), Number(match[2]));
  }

  return hasAncestor(parents, targetPid, loopId);
}

function lockOwnerPid(lockPath) {
  let lockContents;
  try {
    lockContents = fs.readFileSync(lockPath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EACCES') return null;
    throw error;
  }
  const ownerPid = Number(lockContents.trim().split(/\s+/, 1)[0]);
  return Number.isSafeInteger(ownerPid) && ownerPid > 0 ? ownerPid : null;
}

function lockIsFresh(lockPath) {
  try {
    return Date.now() - fs.statSync(lockPath).mtimeMs < LOCK_CREATING_WINDOW_MS;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

function isProcessAlive(pid) {
  if (!Number.isSafeInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (error.code === 'ESRCH') return false;
    if (error.code === 'EPERM') return true;
    throw error;
  }
}

function createLock(lockPath) {
  const descriptor = fs.openSync(lockPath, 'wx', 0o600);
  try {
    fs.writeFileSync(descriptor, `${process.pid} ${new Date().toISOString()}\n`, 'utf8');
    return descriptor;
  } catch (error) {
    try {
      fs.closeSync(descriptor);
    } finally {
      try {
        fs.unlinkSync(lockPath);
      } catch (unlinkError) {
        if (unlinkError.code !== 'ENOENT') throw unlinkError;
      }
    }
    throw error;
  }
}

function acquireLock(lockPath, loopId, environment) {
  try {
    return createLock(lockPath);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }

  const ownerPid = lockOwnerPid(lockPath);
  if (ownerPid === null && lockIsFresh(lockPath)) {
    log('killer-lock-held', environment, { loopId });
    return null;
  }
  if (isProcessAlive(ownerPid)) {
    log('killer-lock-held', environment, { loopId, ownerPid });
    return null;
  }

  log('killer-lock-stale', environment, { loopId, ownerPid });
  try {
    fs.unlinkSync(lockPath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  try {
    return createLock(lockPath);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    log('killer-lock-held', environment, { loopId });
    return null;
  }
}

function specFolderFromHandoff(handoffPath) {
  if (!handoffPath) return '';
  try {
    const note = core.parseHandoff(fs.readFileSync(handoffPath, 'utf8'));
    return typeof note.frontmatter.spec_folder === 'string'
      ? note.frontmatter.spec_folder
      : '';
  } catch {
    return '';
  }
}

function recordTimeout(options, environment, record) {
  const handoffPath = typeof record?.handoff === 'string' ? record.handoff : '';
  const runtime = typeof record?.runtime === 'string' && record.runtime
    ? record.runtime
    : 'claude';
  if (record?.status === 'armed' && handoffPath) {
    core.unarm({
      loopId: options.loopId,
      reason: 'killer-timeout',
      expectedStatus: 'armed',
      expectedHandoff: handoffPath,
      env: environment,
    });
  }
  log('killer-timeout', environment, { targetPid: options.targetPid });
  if (!options.noNotify && handoffPath) {
    notifyManualClaim(handoffPath, runtime, specFolderFromHandoff(handoffPath));
  }
}

function notifyManualClaim(filePath, runtime, specFolder) {
  const command = core.manualClaimCommand(runtime, filePath, specFolder);
  const escapedCommand = JSON.stringify(command);
  try {
    spawnSync('osascript', [
      '-e',
      'display notification ' + escapedCommand + ' with title "Session relaunch needs attention"',
    ], {
      encoding: 'utf8',
      timeout: NOTIFICATION_TIMEOUT_MS,
      stdio: 'ignore',
    });
  } catch {
    // Notification delivery is best-effort because it cannot change handoff state.
  }
}

async function supervise(options, environment, signalTracker) {
  const watchedRecord = core.readRelaunchFile(options.loopId, environment);
  const deadline = Date.now() + options.timeoutMs;
  const idle = await waitForIdle(options, deadline, signalTracker);
  if (!idle || signalTracker.received()) {
    if (signalTracker.received() || !targetIsRunning(options.targetPid)) return;
    if (Date.now() >= deadline) recordTimeout(options, environment, watchedRecord);
    return;
  } else {
    if (!isLoopAncestor(options.targetPid, Number(options.loopId))) {
      log('killer-refused-target', environment, { targetPid: options.targetPid });
      return;
    }
    if (signalTracker.received()) return;
    if (!targetIsRunning(options.targetPid)) return;

    const record = core.readRelaunchFile(options.loopId, environment);
    if (record?.status !== 'armed') {
      log('killer-no-armed-record', environment, { loopId: options.loopId });
      return;
    }

    try {
      process.kill(options.targetPid, 'SIGTERM');
    } catch (error) {
      if (error.code !== 'ESRCH') throw error;
      log('target-gone', environment, { targetPid: options.targetPid });
      return;
    }
    log('killer-signal', environment, { targetPid: options.targetPid, signal: 'SIGTERM' });

    // Start a fresh grace period after SIGTERM so the idle deadline cannot shorten shutdown.
    const signalDeadline = Date.now() + SIGNAL_WAIT_MS;
    while (Date.now() < signalDeadline && !signalTracker.received()) {
      if (!targetIsRunning(options.targetPid)) return;
      await wait(Math.min(POLL_INTERVAL_MS, signalDeadline - Date.now()));
    }
  }

  if (signalTracker.received() || !targetIsRunning(options.targetPid)) return;
  recordTimeout(options, environment, watchedRecord);
}

async function main(argv = process.argv.slice(2), environment = process.env) {
  const options = parseArguments(argv);
  if (Number(options.loopId) <= 1) {
    log('killer-refused-loop-id', environment, { loopId: options.loopId });
    process.exitCode = 1;
    return;
  }
  if (String(environment.SKILLED_LOOP_ID || '') !== options.loopId) {
    throw new Error('--loop-id must match SKILLED_LOOP_ID');
  }

  const stateDirectory = core.stateDir(environment);
  fs.mkdirSync(stateDirectory, { recursive: true, mode: 0o700 });
  const lockPath = path.join(stateDirectory, 'killer-' + options.loopId + '.lock');
  const signalTracker = createSignalTracker();
  let lockDescriptor;
  try {
    lockDescriptor = acquireLock(lockPath, options.loopId, environment);
    if (lockDescriptor === null) return;
    await supervise(options, environment, signalTracker);
  } finally {
    signalTracker.dispose();
    if (lockDescriptor !== undefined && lockDescriptor !== null) {
      try {
        fs.closeSync(lockDescriptor);
      } finally {
        try {
          fs.unlinkSync(lockPath);
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
        }
      }
    }
  }
}

if (require.main === module) {
  main().catch((error) => {
    try {
      log('killer-error', process.env, { message: error.message });
    } catch {
      process.stderr.write('could not record killer error\n');
    }
    process.stderr.write(error.message + '\n');
    process.exitCode = 1;
  });
}

module.exports = { main, parseArguments, isLoopAncestor, hasAncestor };
