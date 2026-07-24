#!/usr/bin/env node
'use strict';

// One exclusive per-hub lock for every writer of a hub's activation tuple
// (manifest / fence / serving-flip record). Both the activation driver and the
// serving flip take THIS lock, so the two lifecycle writers can never consume the
// same fence epoch or interleave a partial write.
//
// The lock is a DIRECTORY created with mkdir — an atomic, exclusive create. On the
// common (no-stale) path this elects exactly one winner with no race, unlike a
// write-then-rename file where two contenders can each read back their own value
// and both believe they won. Owner identity (pid + random nonce + lease) lives in
// `owner.json` inside the lock dir. On collision the holder is adjudicated: a live,
// unexpired holder is respected; a stale holder (expired lease OR dead pid) is
// reclaimed by clearing the dead lock dir and re-racing the atomic mkdir.
//
// Honest limits (documented, not hidden): this is a cooperative advisory lock in
// zero-dependency Node. A perfectly race-free reclaim of a stale lock needs OS
// advisory locking (flock/fcntl), which the stdlib does not expose. The reclaim
// below re-checks staleness immediately before clearing to narrow the window, but a
// pathological same-instant reclaim of one stale lock by two operators is not fully
// excluded. PID reuse within an unexpired lease is bounded by the lease (10 min),
// not detected. In practice the tuple writers run one-operator-at-a-time behind a
// default-off flag, so the residual is a theoretical edge, not an operational one.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const LEASE_MS = 10 * 60 * 1000; // far longer than any real flip/activation

function pidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return err && err.code === 'EPERM';
  }
}

function readOwner(ownerPath) {
  try {
    return JSON.parse(fs.readFileSync(ownerPath, 'utf8'));
  } catch {
    return null;
  }
}

// A held lock is STALE (safe to reclaim) when its lease has expired or its recording
// process is gone. A missing/malformed owner record is treated as stale.
function isStale(meta) {
  if (!meta || typeof meta !== 'object') return true;
  if (typeof meta.leaseUntil === 'number' && Date.now() > meta.leaseUntil) return true;
  if (!pidAlive(meta.pid)) return true;
  return false;
}

// Run `fn` while holding the hub's exclusive lock (mkdir-elected). Throws if a live,
// unexpired holder already holds it; reclaims and proceeds if the existing lock is
// stale. Releases only the lock it still owns.
function withHubLock(hubDir, phase, fn) {
  const lockDir = path.join(hubDir, '.flip.lock');
  const ownerPath = path.join(lockDir, 'owner.json');
  const identity = {
    pid: process.pid,
    nonce: crypto.randomBytes(12).toString('hex'),
    phase: phase || 'unknown',
    acquiredAt: Date.now(),
    leaseUntil: Date.now() + LEASE_MS,
  };
  const body = `${JSON.stringify(identity)}\n`;

  const acquire = () => {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      try {
        fs.mkdirSync(lockDir); // atomic exclusive create — the winner election
        fs.writeFileSync(ownerPath, body);
        return true;
      } catch (e) {
        if (e.code !== 'EEXIST') throw e;
        const meta = readOwner(ownerPath);
        if (!isStale(meta)) return false; // a live holder owns it
        // Stale: re-check right before clearing (narrows the reclaim window), then
        // move the dead lock aside and re-race the atomic mkdir. If our rename lost
        // (ENOENT), another reclaimer already cleared it — loop and re-race anyway.
        if (!isStale(readOwner(ownerPath))) return false;
        const quarantine = `${lockDir}.stale.${identity.nonce}.${attempt}`;
        try {
          fs.renameSync(lockDir, quarantine);
          fs.rmSync(quarantine, { recursive: true, force: true });
        } catch (re) {
          if (re.code !== 'ENOENT') throw re;
        }
      }
    }
    return false;
  };

  if (!acquire()) {
    const meta = readOwner(ownerPath);
    throw new Error(
      `hub lock held by a live owner (pid ${meta && meta.pid}, phase ${meta && meta.phase}): ${lockDir}`,
    );
  }

  try {
    return fn();
  } finally {
    // Release only if the lock still carries our identity (never remove a lock a
    // later owner legitimately took after our lease somehow lapsed).
    const held = readOwner(ownerPath);
    if (held && held.nonce === identity.nonce) {
      try { fs.rmSync(lockDir, { recursive: true, force: true }); } catch { /* best effort */ }
    }
  }
}

module.exports = { withHubLock, isStale, pidAlive, LEASE_MS };
