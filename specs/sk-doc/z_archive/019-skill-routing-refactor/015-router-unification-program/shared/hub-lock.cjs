// ───────────────────────────────────────────────────────────────
// MODULE: Per-Hub Activation Lock
// ───────────────────────────────────────────────────────────────
//
// Serializes every manifest/fence write for one hub through a single on-disk
// lock, so an activation and a serving flip can never consume the same fence
// epoch concurrently. Reconstructed from its two call sites after the original
// module was found to have never been committed; the contract is unchanged:
// withHubLock(hubDir, label, fn) runs fn under an exclusive per-hub lock and
// returns fn's result.

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const LOCK_BASENAME = '.hub-lock';

// A lock whose owning process is gone is stale debris from a crashed run, not
// a live mutual-exclusion claim — reclaim it instead of deadlocking forever.
function lockIsStale(lockPath) {
  let pid;
  try {
    pid = Number.parseInt(fs.readFileSync(lockPath, 'utf8').split('\n')[0], 10);
  } catch {
    return true;
  }
  if (!Number.isInteger(pid) || pid <= 0) return true;
  try {
    process.kill(pid, 0);
    return false;
  } catch (error) {
    return error && error.code === 'ESRCH';
  }
}

/**
 * Run fn under an exclusive per-hub lock.
 *
 * @param {string} hubDir - The hub's activation directory (must exist).
 * @param {string} label - Short operation label recorded inside the lock file.
 * @param {Function} fn - Critical section; its return value is passed through.
 * @returns {*} fn's return value.
 */
function withHubLock(hubDir, label, fn) {
  const lockPath = path.join(hubDir, LOCK_BASENAME);
  let fd = null;
  try {
    fd = fs.openSync(lockPath, 'wx');
  } catch (error) {
    if (error && error.code === 'EEXIST' && lockIsStale(lockPath)) {
      fs.rmSync(lockPath, { force: true });
      fd = fs.openSync(lockPath, 'wx');
    } else {
      throw new Error(`hub is locked by another operation (${lockPath}); retry after it finishes`);
    }
  }
  try {
    fs.writeSync(fd, `${process.pid}\n${label}\n${new Date().toISOString()}\n`);
    return fn();
  } finally {
    try { fs.closeSync(fd); } catch { /* already closed */ }
    fs.rmSync(lockPath, { force: true });
  }
}

module.exports = { withHubLock };
