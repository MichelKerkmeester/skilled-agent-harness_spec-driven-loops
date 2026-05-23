// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Script CLI Guards                                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

let signalHandlersInstalled = false;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function findRepoRoot(startDir) {
  let current = path.resolve(startDir);
  while (current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, '.opencode'))) {
      return current;
    }
    current = path.dirname(current);
  }
  return path.resolve(startDir, '..', '..', '..', '..', '..');
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

/**
 * Acquire an exclusive writer lock via `wx` file open on the given path.
 * Returns a release function that closes the file descriptor and removes
 * the lock file.
 *
 * @param {string} lockPath - Path to the lock file to create.
 * @returns {Function} Release function (call to unlock and clean up).
 * @throws {Error} With code DB_ERROR if the lock file already exists.
 */
function acquireWriterLock(lockPath) {
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  let fd;
  try {
    fd = fs.openSync(lockPath, 'wx');
  } catch (err) {
    const code = err && typeof err === 'object' && 'code' in err ? err.code : undefined;
    if (code === 'EEXIST') {
      const lockErr = new Error('coverage graph writer lock is held by another process');
      lockErr.code = 'DB_ERROR';
      throw lockErr;
    }
    throw err;
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
    fs.rmSync(lockPath, { force: true });
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
