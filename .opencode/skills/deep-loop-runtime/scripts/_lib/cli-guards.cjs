// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Script CLI Guards                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const fs = require('node:fs');
const path = require('node:path');

let signalHandlersInstalled = false;

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

function sleepSync(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return;
  const buffer = new SharedArrayBuffer(4);
  const view = new Int32Array(buffer);
  Atomics.wait(view, 0, 0, ms);
}

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

module.exports = {
  acquireWriterLock,
  classifyExitCode,
  installSignalHandlers,
  maybeThrowTestFault,
  sleepSync,
  validateNamespaceValue,
};
