// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Killer
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { spawnSync } = require('node:child_process');
const core = require('./relaunch-core.cjs');
const nudge = require('./nudge.cjs');
const hopHistory = require('./hop-history.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 100;
const TRANSCRIPT_MISSING_GRACE_MS = 1000;
const SIGNAL_WAIT_MS = 5000;
const NOTIFICATION_TIMEOUT_MS = 3000;
const DEFAULT_IDLE_MS = 3000;
const DEFAULT_TIMEOUT_MS = 30000;
const LOCK_CREATING_WINDOW_MS = 5000;
// The lock outlives the killer's own worst-case lifetime so that a holder killed
// with SIGKILL cannot pin the loop once its pid is reused by another process.
const LOCK_LIFETIME_MARGIN_MS = 60000;
const LOCK_TAKEOVER_STALE_MS = 30000;
// A real mutex holder holds it for a re-check, an unlink and a create, never
// minutes, so an owner file whose pid is alive past this bound was reused by an
// unrelated process and must not pin the mutex forever.
const LOCK_TAKEOVER_MAX_HOLD_MS = 10 * 60 * 1000;
const TERMINATION_SIGNALS = ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT'];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

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
    idleMs: DEFAULT_IDLE_MS,
    timeoutMs: DEFAULT_TIMEOUT_MS,
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
    // EPERM means the pid now belongs to another user's process, not our target.
    if (error.code === 'ESRCH' || error.code === 'EPERM') return false;
    throw error;
  }
}

function transcriptMtime(transcriptPath) {
  try {
    return fs.statSync(transcriptPath).mtimeMs;
  } catch {
    return null;
  }
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
  let missingSince = previousMtime === null ? Date.now() : null;
  let unchangedSince = Date.now();

  while (Date.now() < deadline) {
    if (signalTracker.received() || !targetIsRunning(options.targetPid)) return false;
    const currentMtime = transcriptMtime(options.transcriptPath);
    // One missed stat is not a vanish: only a transcript that stays missing
    // through the grace window un-arms the session.
    if (currentMtime === null) {
      if (missingSince === null) missingSince = Date.now();
      if (Date.now() - missingSince >= TRANSCRIPT_MISSING_GRACE_MS) return false;
    } else {
      missingSince = null;
      if (currentMtime !== previousMtime) {
        previousMtime = currentMtime;
        unchangedSince = Date.now();
      } else if (Date.now() - unchangedSince >= options.idleMs) {
        return true;
      }
    }

    const remaining = deadline - Date.now();
    if (remaining > 0) await wait(Math.min(POLL_INTERVAL_MS, remaining));
  }
  return false;
}

function isLoopAncestor(targetPid, loopId) {
  // A failed read throws, so the killer refuses to signal rather than guess at ancestry.
  const table = core.readProcessTable({ throwOnFailure: true });

  const parents = core.parentMapFromTable(table);

  return hasAncestor(parents, targetPid, loopId);
}

function lockIsFresh(lockPath) {
  try {
    return Date.now() - fs.statSync(lockPath).mtimeMs < LOCK_CREATING_WINDOW_MS;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

// A directory can claim the lock path, and unlink refuses a directory. Renaming
// frees the path in one step and leaves the non-file to be removed with its
// contents, so the create that follows never meets a half-removed lock.
function removeStaleLock(lockPath) {
  let stats;
  try {
    stats = fs.statSync(lockPath);
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }

  if (stats.isFile()) {
    try {
      fs.unlinkSync(lockPath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    return;
  }

  const stalePath = `${lockPath}.stale-${process.pid}-${randomUUID()}`;
  try {
    fs.renameSync(lockPath, stalePath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return;
  }
  fs.rmSync(stalePath, { recursive: true, force: true });
}

function createLock(lockPath, timeoutMs) {
  const createdMs = Date.now();
  const expiresMs = createdMs + timeoutMs + SIGNAL_WAIT_MS + NOTIFICATION_TIMEOUT_MS
    + LOCK_LIFETIME_MARGIN_MS;
  const descriptor = fs.openSync(lockPath, 'wx', 0o600);
  try {
    fs.writeFileSync(
      descriptor,
      `${process.pid} ${new Date(createdMs).toISOString()} ${new Date(expiresMs).toISOString()}\n`,
      'utf8',
    );
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

// A killer that stalls past its own lock expiry loses the lock to a contender,
// so the path can name another owner by the time this killer exits; unlinking it
// unconditionally would delete that owner's lock and admit a third killer to the
// same loop. Only the recorded owner may release, and a vanished lock needs none.
function releaseLock(lockPath, loopId, environment) {
  const { ownerPid } = core.readLockState(lockPath);
  if (ownerPid === null) return;
  if (ownerPid !== process.pid) {
    log('killer-lock-not-owned', environment, { loopId, ownerPid });
    return;
  }

  try {
    fs.unlinkSync(lockPath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

// A killer that dies between the rename and the removal strands the renamed
// directory, a takeover mutex or a non-file lock; the next mutex holder sweeps
// both kinds of leftover past the stale window.
function sweepStaleTakeovers(lockPath) {
  const directory = path.dirname(lockPath);
  const prefixes = [
    `${path.basename(lockPath)}.takeover.stale-`,
    `${path.basename(lockPath)}.stale-`,
  ];
  let entries;
  try {
    entries = fs.readdirSync(directory);
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }
  for (const entry of entries) {
    if (!prefixes.some((prefix) => entry.startsWith(prefix))) continue;
    const stalePath = path.join(directory, entry);
    let stats;
    try {
      stats = fs.statSync(stalePath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      continue;
    }
    if (
      !stats.isDirectory()
      || Date.now() - stats.mtimeMs <= LOCK_TAKEOVER_STALE_MS
    ) continue;
    fs.rmSync(stalePath, { recursive: true, force: true });
  }
}

// A stalled takeover can lose its mutex name to a contender that creates a
// fresh directory at the same path; the inode recorded at creation keeps the
// release from removing a mutex this killer does not own.
function removeOwnMutex(mutexPath, mutexInode) {
  let stats;
  try {
    stats = fs.statSync(mutexPath);
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }
  if (stats.ino !== mutexInode) return;
  fs.rmSync(mutexPath, { recursive: true, force: true });
}

// A mutex whose owner pid is alive is still stale once the directory outlives
// the longest hold a real holder needs, because that pid then belongs to an
// unrelated process. A vanished mutex needs no exclusion: the caller's rename
// finds it gone and stops the takeover hunt.
function mutexExceededHoldBound(mutexPath) {
  try {
    return Date.now() - fs.statSync(mutexPath).mtimeMs > LOCK_TAKEOVER_MAX_HOLD_MS;
  } catch (error) {
    if (error.code === 'ENOENT') return true;
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function acquireLock(lockPath, loopId, environment, timeoutMs) {
  try {
    return createLock(lockPath, timeoutMs);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }

  const { ownerPid, expired } = core.readLockState(lockPath);
  if (ownerPid === null && lockIsFresh(lockPath)) {
    log('killer-lock-held', environment, { loopId });
    return null;
  }
  if (core.isProcessAlive(ownerPid) && !expired) {
    log('killer-lock-held', environment, { loopId, ownerPid });
    return null;
  }

  // One killer at a time holds the takeover mutex while it re-checks the lock
  // owner. The pid recorded inside the mutex decides staleness while the
  // directory is young, but a real holder holds it for a re-check, an unlink
  // and a create, never minutes, so a mutex past the hold bound is stale even
  // though its pid is alive: that pid was reused by an unrelated process.
  const mutexPath = `${lockPath}.takeover`;
  const mutexOwnerPath = path.join(mutexPath, 'owner');
  let mutexHeld = false;
  let mutexInode;
  for (let attempt = 0; attempt < 2 && !mutexHeld; attempt += 1) {
    let created = false;
    try {
      fs.mkdirSync(mutexPath);
      created = true;
      mutexInode = fs.statSync(mutexPath).ino;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }

    if (created) {
      try {
        fs.writeFileSync(mutexOwnerPath, `${process.pid}\n`, { flag: 'wx' });
      } catch (error) {
        removeOwnMutex(mutexPath, mutexInode);
        throw error;
      }
      mutexHeld = true;
      continue;
    }

    if (attempt === 1) break;

    let mutexOwnerPid;
    try {
      mutexOwnerPid = core.lockOwnerPid(mutexOwnerPath);
    } catch (error) {
      // A non-directory at the mutex path has no owner file; any other read
      // failure is a real error, not an ownerless mutex.
      if (error.code !== 'ENOTDIR') throw error;
      mutexOwnerPid = null;
    }
    let staleMutex;
    if (mutexOwnerPid === null) {
      try {
        staleMutex = Date.now() - fs.statSync(mutexPath).mtimeMs > LOCK_TAKEOVER_STALE_MS;
      } catch (statError) {
        if (statError.code !== 'ENOENT') throw statError;
        break;
      }
    } else {
      staleMutex = !core.isProcessAlive(mutexOwnerPid) || mutexExceededHoldBound(mutexPath);
    }
    if (!staleMutex) break;

    const staleMutexPath = `${mutexPath}.stale-${process.pid}-${randomUUID()}`;
    try {
      fs.renameSync(mutexPath, staleMutexPath);
    } catch (renameError) {
      if (renameError.code !== 'ENOENT') throw renameError;
      break;
    }
    fs.rmSync(staleMutexPath, { recursive: true, force: true });
  }
  if (!mutexHeld) {
    log('killer-lock-held', environment, { loopId });
    return null;
  }

  try {
    sweepStaleTakeovers(lockPath);
    const { ownerPid: guardedOwnerPid, expired: guardedExpired } = core.readLockState(lockPath);
    if (guardedOwnerPid === null && lockIsFresh(lockPath)) {
      log('killer-lock-held', environment, { loopId });
      return null;
    }
    if (core.isProcessAlive(guardedOwnerPid) && !guardedExpired) {
      log('killer-lock-held', environment, { loopId, ownerPid: guardedOwnerPid });
      return null;
    }

    log('killer-lock-stale', environment, { loopId, ownerPid: guardedOwnerPid });
    removeStaleLock(lockPath);

    try {
      return createLock(lockPath, timeoutMs);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      log('killer-lock-held', environment, { loopId });
      return null;
    }
  } finally {
    try {
      removeOwnMutex(mutexPath, mutexInode);
    } catch (error) {
      // A release failure cannot undo the takeover's result; the lock already
      // returned and throwing here would strand it.
      log('killer-mutex-release-error', environment, {
        loopId,
        code: error.code,
      });
    }
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
  // A later prepare can arm a different note, or re-arm the same one, while this killer
  // waits. That record still needs its own killer, so the stale snapshot must not disarm
  // or notify for it. A re-arm keeps the path but always stamps a new armedAt.
  const current = core.readRelaunchFile(options.loopId, environment);
  const currentHandoff = typeof current?.handoff === 'string' ? current.handoff : '';
  if (
    currentHandoff !== handoffPath
    || (current?.status === 'armed' && current.armedAt !== record?.armedAt)
  ) {
    log('killer-timeout-superseded', environment, {
      watched: handoffPath,
      current: currentHandoff,
    });
    return;
  }
  const runtime = typeof record?.runtime === 'string' && record.runtime
    ? record.runtime
    : 'claude';
  if (record?.status === 'armed' && handoffPath) {
    core.unarm({
      loopId: options.loopId,
      reason: 'killer-timeout',
      expectedStatus: 'armed',
      expectedHandoff: handoffPath,
      expectedArmedAt: record.armedAt,
      env: environment,
    });
  }
  log('killer-timeout', environment, { targetPid: options.targetPid });
  if (handoffPath) hopHistory.recordHop('timed-out', handoffPath, { env: environment, runtime });
  if (!options.noNotify && handoffPath) {
    notifyManualClaim(handoffPath, runtime, specFolderFromHandoff(handoffPath), environment);
  }
}

function notifyManualClaim(filePath, runtime, specFolder, environment) {
  // A notice has no stderr, so an unusable template is logged and its reason rides in the
  // subtitle; otherwise the operator sees a plain command with no hint their options were lost.
  const templateProblem = core.manualTemplateProblem(environment);
  if (templateProblem) log('killer-manual-template', environment, { problem: templateProblem });
  const command = core.manualClaimCommand(runtime, filePath, specFolder, environment);
  const escapedCommand = JSON.stringify(command);
  const subtitle = templateProblem
    ? ' subtitle ' + JSON.stringify(`Manual template ignored: ${templateProblem}`)
    : '';
  try {
    spawnSync('osascript', [
      '-e',
      'display notification ' + escapedCommand
        + ' with title "Session relaunch needs attention (killer timed out)"' + subtitle,
    ], {
      encoding: 'utf8',
      timeout: NOTIFICATION_TIMEOUT_MS,
      stdio: 'ignore',
    });
  } catch {
    // Notification delivery is best-effort because it cannot change handoff state.
  }
}

// The wrapper accepts a record only below its hop cap, and the count it compares is the
// record's own. A cap lowered after a record was prepared therefore leaves an armed record
// the wrapper declines, which is what this reads: the same cap resolution the adapters use,
// against the count written into the record. A record without a usable count keeps the
// existing signal path, because the wrapper still owns that decision.
function recordReachedHopLimit(record, environment) {
  const hops = Number(record?.hops);
  if (!Number.isInteger(hops) || hops < 0) return false;
  return nudge.hopLimitReached({ ...environment, SKILLED_LOOP_HOPS: String(hops) });
}

async function supervise(options, environment, signalTracker) {
  const watchedRecord = core.readRelaunchFile(options.loopId, environment);
  const deadline = Date.now() + options.timeoutMs;
  const idle = await waitForIdle(options, deadline, signalTracker);
  if (!idle || signalTracker.received()) {
    if (signalTracker.received() || !targetIsRunning(options.targetPid)) return;
    recordTimeout(options, environment, watchedRecord);
    return;
  } else {
    const record = core.readRelaunchFile(options.loopId, environment);
    if (record?.status !== 'armed') {
      log('killer-no-armed-record', environment, { loopId: options.loopId });
      return;
    }
    if (signalTracker.received()) return;
    if (!targetIsRunning(options.targetPid)) return;

    // Past the cap the wrapper declines the record, so a signal here would end a session
    // that no relaunch follows. The record is unarmed and its note left for the operator's
    // own claim instead; the handoff guard keeps this from disarming a note a later prepare
    // armed, because that note still needs its own killer. No notification is raised: with
    // no relaunch pending, the manual claim is already what the session was told to do.
    if (recordReachedHopLimit(record, environment)) {
      const handoffPath = typeof record.handoff === 'string' ? record.handoff : '';
      if (handoffPath) {
        core.unarm({
          loopId: options.loopId,
          reason: 'hop-cap',
          expectedStatus: 'armed',
          expectedHandoff: handoffPath,
          env: environment,
        });
      }
      log('killer-hop-cap', environment, {
        targetPid: options.targetPid,
        hops: record.hops,
      });
      return;
    }

    // The wrapper also declines a record past its age limit, and it reads the record only
    // once the target has exited, which can take the whole grace period after the signal.
    // Freshness is therefore judged at the end of that period, with the wrapper's own rule,
    // so a session is never ended for a relaunch the wrapper will refuse as stale. The note
    // stays open for a fresh prepare or the operator's own claim.
    if (!nudge.armedRecordStillCurrent(record, environment, Date.now() + SIGNAL_WAIT_MS)) {
      const handoffPath = typeof record.handoff === 'string' ? record.handoff : '';
      if (handoffPath) {
        core.unarm({
          loopId: options.loopId,
          reason: 'stale',
          expectedStatus: 'armed',
          expectedHandoff: handoffPath,
          env: environment,
        });
      }
      log('killer-stale', environment, { targetPid: options.targetPid, armedAt: record.armedAt });
      return;
    }

    // The ancestry snapshot goes last so the pid-reuse window ahead of the signal
    // stays as small as it can be: Node exposes no pidfd handle, so a pid reaped
    // and reused between this snapshot and the signal cannot be ruled out.
    if (!isLoopAncestor(options.targetPid, Number(options.loopId))) {
      log('killer-refused-target', environment, { targetPid: options.targetPid });
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

  const stateDirectory = core.ensureStateDir(environment);
  const lockPath = path.join(stateDirectory, 'killer-' + options.loopId + '.lock');
  const signalTracker = createSignalTracker();
  let lockDescriptor;
  try {
    lockDescriptor = acquireLock(lockPath, options.loopId, environment, options.timeoutMs);
    if (lockDescriptor === null) return;
    await supervise(options, environment, signalTracker);
  } finally {
    signalTracker.dispose();
    if (lockDescriptor !== undefined && lockDescriptor !== null) {
      try {
        fs.closeSync(lockDescriptor);
      } finally {
        releaseLock(lockPath, options.loopId, environment);
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { main, parseArguments, isLoopAncestor, hasAncestor };
