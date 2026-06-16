// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Script CLI Guards                                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

let signalHandlersInstalled = false;
const DEFAULT_WRITER_LOCK_MAX_WAIT_MS = 1_000;
const DEFAULT_WRITER_LOCK_RETRY_INTERVAL_MS = 25;
// A live holder that has held the lock longer than this is treated as stale
// (orphaned by an OOM/SIGKILL that left the file but whose pid was recycled, or
// a wedged process). Generous so a legitimately slow write is never reclaimed.
const DEFAULT_WRITER_LOCK_MAX_HOLD_MS = 60_000;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function findRepoRoot(startDir) {
  let current = path.resolve(startDir);
  let opencodeMatch = null;
  while (current !== path.dirname(current)) {
    // `.git` is the unambiguous repo-root marker; prefer it so nested `.opencode`
    // sandbox/residue dirs under skills/** cannot short-circuit detection.
    if (fs.existsSync(path.join(current, '.git'))) {
      return current;
    }
    if (opencodeMatch === null && fs.existsSync(path.join(current, '.opencode'))) {
      opencodeMatch = current;
    }
    current = path.dirname(current);
  }
  return opencodeMatch || path.resolve(startDir, '..', '..', '..', '..', '..');
}

const REPO_ROOT = findRepoRoot(__dirname);

function hasTraversalSegment(value) {
  return value.split(/[\\/]+/).some((segment) => segment === '..');
}

function isInsideRepo(resolvedPath) {
  const relative = path.relative(REPO_ROOT, resolvedPath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate a namespace-scoped value (specFolder, sessionId) for safety.
 * Rejects null bytes, `..` path traversal segments, and absolute paths
 * that escape the repository root.
 *
 * @param {string} value - The value to validate.
 * @param {string} key - Label for error messages (e.g. 'specFolder').
 * @param {Function} makeInputError - Factory that creates an InputValidation
 *   error from a message string.
 * @returns {string} The validated value, unchanged when valid.
 * @throws {Error} With code INPUT_VALIDATION on failure.
 */
function validateNamespaceValue(value, key, makeInputError) {
  if (value.includes('\0')) {
    throw makeInputError(`${key} must not contain null bytes`);
  }
  if (hasTraversalSegment(value)) {
    throw makeInputError(`${key} must not contain '..' path segments`);
  }
  if (path.isAbsolute(value) && !isInsideRepo(path.resolve(value))) {
    throw makeInputError(`${key} absolute path must stay inside the repository root`);
  }
  return value;
}

/**
 * Install one-shot signal handlers (SIGINT, SIGTERM) that run a cleanup
 * callback before exiting. Idempotent — subsequent calls are no-ops.
 *
 * @param {Function} cleanup - Cleanup callback invoked before process exit.
 */
function installSignalHandlers(cleanup) {
  if (signalHandlersInstalled) return;
  signalHandlersInstalled = true;

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => {
      try {
        cleanup();
      } finally {
        process.exit(signal === 'SIGINT' ? 130 : 143);
      }
    });
  }
}

/**
 * Map an error to a structured exit code for CLI scripts.
 *
 * @param {Error|Object} err - An error object, optionally carrying a `code`
 *   property.
 * @returns {number} Exit code: 1=script error, 2=DB/permissions error,
 *   3=input validation error.
 */
function classifyExitCode(err) {
  const code = err && typeof err === 'object' && 'code' in err ? err.code : undefined;
  if (code === 'INPUT_VALIDATION') return 3;
  if (
    code === 'DB_ERROR'
    || code === 'SQLITE_ERROR'
    || code === 'SQLITE_BUSY'
    || code === 'SQLITE_CANTOPEN'
    || code === 'EACCES'
    || code === 'EPERM'
    || code === 'ENOTDIR'
  ) {
    return 2;
  }
  return 1;
}

/**
 * Throw a synthetic fault when the DEEP_LOOP_TEST_FAULT environment
 * variable is set. Used by contract tests to verify that scripts
 * handle injected DB and script-level errors correctly.
 *
 * @throws {Error} With code DB_ERROR or generic script error.
 */
function maybeThrowTestFault() {
  if (process.env.DEEP_LOOP_TEST_FAULT === 'db') {
    const err = new Error('Injected DB fault for deep-loop script contract tests');
    err.code = 'DB_ERROR';
    throw err;
  }
  if (process.env.DEEP_LOOP_TEST_FAULT === 'script') {
    throw new Error('Injected script fault for deep-loop script contract tests');
  }
}

/**
 * Synchronous sleep using Atomics.wait on a shared buffer.
 *
 * @param {number} ms - Milliseconds to sleep. Non-positive values are
 *   ignored.
 */
function sleepSync(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return;
  const buffer = new SharedArrayBuffer(4);
  const view = new Int32Array(buffer);
  Atomics.wait(view, 0, 0, ms);
}

function readNonNegativeEnvNumber(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

/**
 * Test whether a process id is currently alive. `process.kill(pid, 0)` sends
 * no signal but performs the existence/permission check: ESRCH means the pid
 * is gone (stale), EPERM means it exists but is owned by another user (alive),
 * and success means it exists. Non-positive or non-integer pids are treated as
 * dead so a malformed lock cannot pin live status.
 *
 * @param {number} pid - The process id to probe.
 * @returns {boolean} True if the pid appears to belong to a live process.
 */
function isPidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    const code = err && typeof err === 'object' && 'code' in err ? err.code : undefined;
    // EPERM: process exists but we may not signal it — still alive.
    return code === 'EPERM';
  }
}

/**
 * Decide whether an existing lock file is stale and may be reclaimed.
 * Reads and parses defensively: a missing, empty, half-written, or non-JSON
 * lock file is stale only once it has aged past the grace window (the holder
 * may be mid-write between openSync and writeSync), so a freshly created peer
 * lock is never deleted out from under it.
 *
 * @param {string} lockPath - Path to the candidate lock file.
 * @param {number} maxHoldMs - Maximum age before a lock is considered stale.
 * @returns {boolean} True if the lock is stale and safe to remove.
 */
function isWriterLockStale(lockPath, maxHoldMs) {
  let raw;
  try {
    raw = fs.readFileSync(lockPath, 'utf8');
  } catch (err) {
    const code = err && typeof err === 'object' && 'code' in err ? err.code : undefined;
    // Vanished between EEXIST and read — already gone, so retrying openSync wins.
    if (code === 'ENOENT') return true;
    // Cannot read it (e.g. permissions); leave it to the maxWait path.
    return false;
  }

  let parsed = null;
  try {
    const trimmed = typeof raw === 'string' ? raw.trim() : '';
    if (trimmed) parsed = JSON.parse(trimmed);
  } catch {
    parsed = null;
  }

  const pid = parsed && typeof parsed === 'object' ? Number(parsed.pid) : NaN;
  const tsFromBody = parsed && typeof parsed === 'object' ? Number(parsed.ts) : NaN;
  let ageMs = Number.POSITIVE_INFINITY;
  if (Number.isFinite(tsFromBody)) {
    ageMs = Date.now() - tsFromBody;
  } else {
    // No usable timestamp in the body (half-written or legacy) — fall back to
    // the file's mtime so a brand-new empty lock is granted its grace window.
    try {
      ageMs = Date.now() - fs.statSync(lockPath).mtimeMs;
    } catch {
      ageMs = Number.POSITIVE_INFINITY;
    }
  }

  // A live holder inside the hold window owns the lock; respect it.
  if (Number.isInteger(pid) && pid > 0 && isPidAlive(pid) && ageMs < maxHoldMs) {
    return false;
  }
  // Dead pid, or any lock older than the hold window, is reclaimable. A lock
  // with no parseable pid is stale only after it has aged past the window.
  return ageMs >= maxHoldMs || (Number.isInteger(pid) && pid > 0 && !isPidAlive(pid));
}

/**
 * Read and parse the lock file body, returning the stored nonce (or null).
 * Defensive on every failure path: a missing, empty, half-written, or non-JSON
 * file — and a body without a string `nonce` — all yield null, which callers
 * treat as "not mine". This is the ownership check both the P0 acquire re-read
 * and the P1 release use, so a lost race never deletes a peer's valid lock.
 *
 * @param {string} lockPath - Path to the lock file.
 * @returns {string|null} The stored nonce when present and well-formed, else null.
 */
function readLockNonce(lockPath) {
  let raw;
  try {
    raw = fs.readFileSync(lockPath, 'utf8');
  } catch {
    return null;
  }
  let parsed = null;
  try {
    const trimmed = typeof raw === 'string' ? raw.trim() : '';
    if (trimmed) parsed = JSON.parse(trimmed);
  } catch {
    return null;
  }
  if (parsed && typeof parsed === 'object' && typeof parsed.nonce === 'string' && parsed.nonce) {
    return parsed.nonce;
  }
  return null;
}

/**
 * Acquire an exclusive writer lock via `wx` file open on the given path.
 * Returns a release function that closes the file descriptor and removes
 * the lock file. Retries briefly on contention so parallel test files and
 * near-simultaneous runtime callers do not fail on transient writer overlap.
 *
 * Self-heals orphaned locks: the owner pid, a creation timestamp, and a unique
 * per-acquisition nonce are written into the lock file. On EEXIST a lock held by
 * a dead pid (or one older than the max-hold age) is reclaimed (best-effort
 * remove, then retry). A lock held by a LIVE pid inside the age window keeps the
 * original maxWait/retry-deadline-then-throw behavior.
 *
 * The nonce closes two mutual-exclusion races against a concurrent reclaimer:
 *  - Acquire: after `wx` + stamp, the file is re-read; if it no longer carries
 *    THIS acquisition's nonce (a peer rmSync'd ours and recreated theirs in the
 *    window), the fd is closed and the acquire loop re-evaluated. The lock is
 *    only considered held once the on-disk body carries our nonce.
 *  - Release: the lock is removed only if its on-disk body still carries our
 *    nonce. If we were reclaimed mid-write, release skips the rmSync (but still
 *    closes the fd) so it never deletes the new holder's lock.
 *
 * @param {string} lockPath - Path to the lock file to create.
 * @returns {Function} Release function (call to unlock and clean up).
 * @throws {Error} With code DB_ERROR if the lock remains held after retry.
 */
function acquireWriterLock(lockPath) {
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  const maxWaitMs = readNonNegativeEnvNumber('DEEP_LOOP_WRITER_LOCK_MAX_WAIT_MS', DEFAULT_WRITER_LOCK_MAX_WAIT_MS);
  const retryIntervalMs = readNonNegativeEnvNumber('DEEP_LOOP_WRITER_LOCK_RETRY_INTERVAL_MS', DEFAULT_WRITER_LOCK_RETRY_INTERVAL_MS);
  const maxHoldMs = readNonNegativeEnvNumber('DEEP_LOOP_WRITER_LOCK_MAX_HOLD_MS', DEFAULT_WRITER_LOCK_MAX_HOLD_MS);
  const deadline = Date.now() + maxWaitMs;
  // Cap reclaim attempts so a never-removable or re-stamped stale lock falls
  // through to the maxWait/throw path instead of spinning indefinitely.
  const MAX_RECLAIM_ATTEMPTS = 8;
  let reclaimAttempts = 0;
  // Unique per acquisition. Stamped into the lock body so a concurrent reclaimer
  // that rmSync's our file and recreates its own is detectable: the on-disk
  // nonce will no longer be ours. Drives both the acquire re-read and release.
  const nonce = randomUUID();
  let fd;

  while (true) {
    try {
      fd = fs.openSync(lockPath, 'wx');
      // Stamp owner pid + creation time + nonce so other acquirers can detect a
      // stale (dead-pid or aged-out) lock and so we can prove ownership. A write
      // failure must not forfeit a lock we legitimately hold — staleness then
      // falls back to mtime (still fresh). But without a stamped nonce we cannot
      // distinguish our own lock from a peer's at re-read/release time, so on a
      // stamp failure fall through to the contention path and retry rather than
      // claim an unverifiable lock.
      let stamped = false;
      try {
        fs.writeSync(fd, JSON.stringify({ pid: process.pid, ts: Date.now(), nonce }));
        stamped = true;
      } catch {
        // Could not stamp; treat as not-acquired and recover below.
      }
      if (!stamped) {
        // Release the half-formed lock so a peer (or our own retry) can take it,
        // then loop to re-acquire cleanly.
        try {
          fs.closeSync(fd);
        } catch {
          // best-effort
        }
        fd = undefined;
        try {
          // Only remove if it is the file we just (unstamped) created. Empty
          // body → readLockNonce returns null → not ours, so skip; otherwise a
          // peer beat us between open and here.
          if (readLockNonce(lockPath) === null) fs.rmSync(lockPath, { force: true });
        } catch {
          // best-effort
        }
        const remainingMs = deadline - Date.now();
        if (maxWaitMs <= 0 || remainingMs <= 0) {
          const lockErr = new Error('deep-loop graph writer lock could not be stamped');
          lockErr.code = 'DB_ERROR';
          throw lockErr;
        }
        sleepSync(Math.min(retryIntervalMs, remainingMs));
        continue;
      }
      // P0 close: re-read the file we just stamped. If a peer reclaimed (rmSync)
      // our lock and recreated its own in the window between our openSync and
      // this read, the on-disk nonce will not be ours — we are NOT the holder.
      // Close our (now unlinked or foreign) fd and loop to re-evaluate, rather
      // than entering the critical section on a lock someone else owns.
      if (readLockNonce(lockPath) !== nonce) {
        try {
          fs.closeSync(fd);
        } catch {
          // best-effort
        }
        fd = undefined;
        const remainingMs = deadline - Date.now();
        if (maxWaitMs <= 0 || remainingMs <= 0) {
          const lockErr = new Error('deep-loop graph writer lock is held by another process');
          lockErr.code = 'DB_ERROR';
          throw lockErr;
        }
        sleepSync(Math.min(retryIntervalMs, remainingMs));
        continue;
      }
      break;
    } catch (err) {
      const code = err && typeof err === 'object' && 'code' in err ? err.code : undefined;
      if (code !== 'EEXIST') throw err;

      // Stale-lock reclamation: if the holder is dead or the lock has aged out,
      // remove it and retry the open. This can itself race a second reclaimer,
      // so loop — on a re-thrown EEXIST we re-evaluate staleness next pass.
      // Bounded by a reclaim-attempt cap so a pathological never-removable lock
      // (or a peer that keeps re-stamping a stale ts) cannot spin forever.
      if (reclaimAttempts < MAX_RECLAIM_ATTEMPTS && isWriterLockStale(lockPath, maxHoldMs)) {
        reclaimAttempts += 1;
        try {
          fs.rmSync(lockPath, { force: true });
        } catch {
          // Another reclaimer may have removed it first; the retry settles it.
        }
        continue;
      }

      const remainingMs = deadline - Date.now();
      if (maxWaitMs <= 0 || remainingMs <= 0) {
        const lockErr = new Error('deep-loop graph writer lock is held by another process');
        lockErr.code = 'DB_ERROR';
        throw lockErr;
      }
      sleepSync(Math.min(retryIntervalMs, remainingMs));
    }
  }

  return () => {
    if (typeof fd === 'number') {
      try {
        fs.closeSync(fd);
      } catch {
        // Best-effort cleanup during process teardown.
      }
      fd = undefined;
    }
    // P1 close: only remove the lock if its on-disk body still carries OUR
    // nonce. If we were reclaimed while holding the critical section (our write
    // aged past maxHoldMs, or the P0 race), the file now belongs to a new
    // holder — deleting it would break their mutual exclusion. A missing,
    // half-written, or foreign-nonce file all read as "not mine" → skip rmSync.
    try {
      if (readLockNonce(lockPath) === nonce) {
        fs.rmSync(lockPath, { force: true });
      }
    } catch {
      // Best-effort: never throw from release/teardown.
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  acquireWriterLock,
  classifyExitCode,
  installSignalHandlers,
  maybeThrowTestFault,
  sleepSync,
  validateNamespaceValue,
};
