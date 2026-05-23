// MODULE: Deep-Loop Lock

import { closeSync, existsSync, fsyncSync, openSync, readFileSync, renameSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

// ───── TYPE DEFINITIONS ─────

import type { ExecutorKind } from './executor-config.js';

export interface LoopLockData {
  ownerPid: number;
  startedAtIso: string;
  ttlMs: number;
  lastHeartbeatIso: string;
  packetId: string;
  runtimeKind: ExecutorKind | 'main';
}

export type LoopLockAcquireResult =
  | { acquired: true; lock: LoopLockData; reclaimed?: LoopLockData }
  | { acquired: false; holder: LoopLockData };

// ───── DOMAIN ERRORS ─────

export class LoopLockHeldError extends Error {
  holder: LoopLockData;

  constructor(holder: LoopLockData) {
    super(`Deep-loop lock is held by pid ${holder.ownerPid} for packet ${holder.packetId}`);
    this.name = 'LoopLockHeldError';
    this.holder = holder;
  }
}

// ───── HELPERS ─────

type SerializedLoopLockData = {
  owner_pid: number;
  started_at_iso: string;
  ttl_ms: number;
  last_heartbeat_iso: string;
  packet_id: string;
  runtime_kind: ExecutorKind | 'main';
};

function fsyncPath(path: string): void {
  let fd: number | undefined;
  try {
    fd = openSync(path, 'r');
    fsyncSync(fd);
  } finally {
    if (typeof fd === 'number') {
      closeSync(fd);
    }
  }
}

function makeTempPath(targetPath: string): string {
  return `${targetPath}.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
}

function serializeLock(data: LoopLockData): SerializedLoopLockData {
  return {
    owner_pid: data.ownerPid,
    started_at_iso: data.startedAtIso,
    ttl_ms: data.ttlMs,
    last_heartbeat_iso: data.lastHeartbeatIso,
    packet_id: data.packetId,
    runtime_kind: data.runtimeKind,
  };
}

function deserializeLock(raw: unknown): LoopLockData | null {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  const candidate = raw as Partial<SerializedLoopLockData>;
  if (
    !Number.isInteger(candidate.owner_pid) ||
    typeof candidate.started_at_iso !== 'string' ||
    !Number.isInteger(candidate.ttl_ms) ||
    typeof candidate.last_heartbeat_iso !== 'string' ||
    typeof candidate.packet_id !== 'string' ||
    typeof candidate.runtime_kind !== 'string'
  ) {
    return null;
  }

  const ownerPid = candidate.owner_pid as number;
  const ttlMs = candidate.ttl_ms as number;

  return {
    ownerPid,
    startedAtIso: candidate.started_at_iso,
    ttlMs,
    lastHeartbeatIso: candidate.last_heartbeat_iso,
    packetId: candidate.packet_id,
    runtimeKind: candidate.runtime_kind as ExecutorKind | 'main',
  };
}

function readLoopLock(lockPath: string): LoopLockData | null {
  try {
    return deserializeLock(JSON.parse(readFileSync(lockPath, 'utf8')));
  } catch {
    return null;
  }
}

function writeLoopLockAtomic(lockPath: string, data: LoopLockData): void {
  const tempPath = makeTempPath(lockPath);
  try {
    writeFileSync(tempPath, `${JSON.stringify(serializeLock(data), null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
    fsyncPath(tempPath);
    renameSync(tempPath, lockPath);
    try {
      fsyncPath(dirname(lockPath));
    } catch {
    }
  } catch (error: unknown) {
    rmSync(tempPath, { force: true });
    throw error;
  }
}

function writeLoopLockExclusive(lockPath: string, data: LoopLockData): boolean {
  let fd: number | undefined;
  try {
    fd = openSync(lockPath, 'wx');
    writeFileSync(fd, `${JSON.stringify(serializeLock(data), null, 2)}\n`, { encoding: 'utf8' });
    fsyncSync(fd);
  } catch (error: unknown) {
    const code = error && typeof error === 'object' && 'code' in error ? (error as NodeJS.ErrnoException).code : undefined;
    if (code === 'EEXIST') {
      return false;
    }
    throw error;
  } finally {
    if (typeof fd === 'number') {
      closeSync(fd);
    }
  }

  try {
    fsyncPath(dirname(lockPath));
  } catch {
  }
  return true;
}

// ───── EXPORTS ─────

/**
 * Check whether a process is still alive.
 *
 * Uses kill(pid, 0) as a POSIX signal check. Returns true for
 * processes the current user has permission to signal.
 *
 * @param pid - Process ID to check.
 * @returns True if the process exists and is reachable.
 */
export function processAlive(pid: number): boolean {
  if (!Number.isInteger(pid) || pid <= 0) {
    return false;
  }

  try {
    process.kill(pid, 0);
    return true;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'ESRCH') return false;
      if (error.code === 'EPERM') return true;
    }
    return true;
  }
}

/**
 * Determine whether a loop lock has expired or the owner process is dead.
 *
 * A lock is stale if the owner PID no longer exists or the heartbeat
 * has exceeded twice the TTL.
 *
 * @param data - The loop lock data to check.
 * @param now - Reference timestamp (defaults to now).
 * @returns True if the lock is stale and can be reclaimed.
 */
export function isStaleLoopLock(data: LoopLockData, now: Date = new Date()): boolean {
  const heartbeatMs = Date.parse(data.lastHeartbeatIso);
  const ttlMs = Number.isFinite(data.ttlMs) ? data.ttlMs : 0;
  const expired = !Number.isFinite(heartbeatMs) || now.getTime() - heartbeatMs > ttlMs * 2;

  return expired || !processAlive(data.ownerPid);
}

/**
 * Acquire the deep-loop lock, reclaiming stale locks automatically.
 *
 * @param lockPath - File path for the lock file.
 * @param data - Lock metadata for the acquiring process.
 * @returns Result indicating whether the lock was acquired and by whom.
 */
export function acquireLoopLock(lockPath: string, data: LoopLockData): LoopLockAcquireResult {
  const holder = existsSync(lockPath) ? readLoopLock(lockPath) : null;
  if (holder && !isStaleLoopLock(holder)) {
    return { acquired: false, holder };
  }

  if (!holder) {
    if (writeLoopLockExclusive(lockPath, data)) {
      return { acquired: true, lock: data };
    }
    const current = readLoopLock(lockPath);
    return { acquired: false, holder: current ?? data };
  }

  writeLoopLockAtomic(lockPath, data);
  return holder ? { acquired: true, lock: data, reclaimed: holder } : { acquired: true, lock: data };
}

/**
 * Refresh the loop lock heartbeat for the owning process.
 *
 * @param lockPath - File path for the lock file.
 * @param ownerPid - PID of the owning process (must match current owner).
 * @param now - Reference timestamp (defaults to now).
 * @returns True if the heartbeat was successfully refreshed.
 */
export function refreshLoopLock(lockPath: string, ownerPid: number, now: Date = new Date()): boolean {
  const holder = existsSync(lockPath) ? readLoopLock(lockPath) : null;
  if (!holder || holder.ownerPid !== ownerPid) {
    return false;
  }

  writeLoopLockAtomic(lockPath, {
    ...holder,
    lastHeartbeatIso: now.toISOString(),
  });
  return true;
}

/**
 * Release the loop lock for the owning process.
 *
 * @param lockPath - File path for the lock file.
 * @param ownerPid - PID of the owning process (must match current owner).
 * @returns True if the lock was successfully released.
 */
export function releaseLoopLock(lockPath: string, ownerPid: number): boolean {
  const holder = existsSync(lockPath) ? readLoopLock(lockPath) : null;
  if (!holder || holder.ownerPid !== ownerPid) {
    return false;
  }

  unlinkSync(lockPath);
  return true;
}
