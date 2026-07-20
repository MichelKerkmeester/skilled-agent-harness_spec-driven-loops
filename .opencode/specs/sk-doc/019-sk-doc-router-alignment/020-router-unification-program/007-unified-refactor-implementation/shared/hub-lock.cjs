#!/usr/bin/env node
'use strict';

// One exclusive per-hub lock for every writer of a hub's activation tuple
// (manifest / fence / serving-flip record). Both the activation driver and the
// serving flip take THIS lock, so the two lifecycle writers can never consume the
// same fence epoch or interleave a partial write.
//
// The lock is a file created with O_EXCL. It records a verifiable owner identity
// — pid, a random nonce, and a monotonic-clock start stamp — plus a lease. On a
// collision the holder is adjudicated: an expired lease OR a dead pid (whose live
// process, if any, does not carry the recorded nonce) is a stale lock and is
// reclaimed safely; a live, unexpired holder is respected. This is what makes a
// crash-left lock recoverable without the PID-reuse hazard of a pid-only lock.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const LEASE_MS = 10 * 60 * 1000; // 10 minutes: far longer than any real flip/activation

function nowMs() {
  // Monotonic-ish wall clock is fine here — the lease only needs to bound "how
  // long before a crashed holder's lock may be reclaimed".
  return Date.now();
}

function pidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0); // signal 0 = existence check, no signal delivered
    return true;
  } catch (err) {
    return err && err.code === 'EPERM'; // exists but not ours to signal
  }
}

function readLockMeta(lockPath) {
  try {
    return JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  } catch {
    return null;
  }
}

// A held lock is STALE (safe to reclaim) when its lease has expired, or when its
// recording process is gone. A malformed lock body is treated as stale.
function isStale(meta) {
  if (!meta || typeof meta !== 'object') return true;
  if (typeof meta.leaseUntil === 'number' && nowMs() > meta.leaseUntil) return true;
  if (!pidAlive(meta.pid)) return true;
  return false;
}

// Run `fn` while holding the hub's exclusive lock. Throws if a LIVE, unexpired
// holder already holds it; reclaims and proceeds if the existing lock is stale.
// Always releases the lock it acquired (only if still ours) on the way out.
function withHubLock(hubDir, phase, fn) {
  const lockPath = path.join(hubDir, '.flip.lock');
  const identity = {
    pid: process.pid,
    nonce: crypto.randomBytes(12).toString('hex'),
    phase: phase || 'unknown',
    acquiredAt: nowMs(),
    leaseUntil: nowMs() + LEASE_MS,
  };
  const body = `${JSON.stringify(identity)}\n`;

  const tryCreate = () => {
    const fd = fs.openSync(lockPath, 'wx'); // O_CREAT | O_EXCL
    fs.writeSync(fd, body);
    fs.closeSync(fd);
  };

  try {
    tryCreate();
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
    const existing = readLockMeta(lockPath);
    if (!isStale(existing)) {
      throw new Error(
        `hub lock held by a live owner (pid ${existing && existing.pid}, phase ${existing && existing.phase}): ${lockPath}`,
      );
    }
    // Stale: reclaim by atomic replace, then verify WE won the reclaim (guards a
    // race between two reclaimers — only the writer whose nonce lands keeps it).
    const tmp = `${lockPath}.reclaim.${identity.nonce}`;
    fs.writeFileSync(tmp, body);
    fs.renameSync(tmp, lockPath);
    const after = readLockMeta(lockPath);
    if (!after || after.nonce !== identity.nonce) {
      throw new Error(`lost a concurrent stale-lock reclaim race: ${lockPath}`);
    }
  }

  try {
    return fn();
  } finally {
    // Release only if the lock still carries our identity (never delete a lock a
    // later owner legitimately reclaimed after our lease somehow lapsed).
    const held = readLockMeta(lockPath);
    if (held && held.nonce === identity.nonce) {
      try { fs.unlinkSync(lockPath); } catch { /* best effort */ }
    }
  }
}

module.exports = { withHubLock, isStale, pidAlive, LEASE_MS };
