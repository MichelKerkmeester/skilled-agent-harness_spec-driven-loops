// ───────────────────────────────────────────────────────────────
// MODULE: CocoIndex Daemon Probe
// ───────────────────────────────────────────────────────────────
// Feature catalog: Warm server / daemon mode

import { existsSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

type CocoIndexDaemonStatus = 'reachable' | 'unreachable' | 'degraded';
type CocoIndexLogCapState = 'ok' | 'missing' | 'over_cap' | 'unknown';

interface PidLockHolder {
  pid: number;
  startedAt: string | null;
}

interface CocoIndexDaemonProbe {
  status: CocoIndexDaemonStatus;
  socketPath: string;
  pidPath: string;
  logPath: string;
  lockPath: string;
  spawnLockPath: string;
  pidLockHolder: PidLockHolder | null;
  logCapState: CocoIndexLogCapState;
  checkedAt: string;
  ttlMs: number;
  reason: string | null;
}

const DEFAULT_TTL_MS = 30_000;
const DEFAULT_LOG_CAP_BYTES = 10 * 1024 * 1024;

let cachedProbe: CocoIndexDaemonProbe | null = null;
let cachedAt = 0;

function getDaemonDir(): string {
  return process.env.COCOINDEX_CODE_DIR?.trim() || join(homedir(), '.cocoindex_code');
}

function getTtlMs(): number {
  const parsed = Number.parseInt(process.env.SPECKIT_COCOINDEX_DAEMON_PROBE_TTL_MS ?? '', 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_TTL_MS;
}

function getLogCapBytes(): number {
  const parsed = Number.parseInt(process.env.SPECKIT_COCOINDEX_LOG_CAP_BYTES ?? '', 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_LOG_CAP_BYTES;
}

function isPidAlive(pid: number): boolean {
  if (!Number.isInteger(pid) || pid <= 0) return false;

  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readPid(pidPath: string): number | null {
  try {
    const raw = readFileSync(pidPath, 'utf8').trim();
    const parsed = Number.parseInt(raw, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function readPidLockHolder(pidPath: string): PidLockHolder | null {
  const pid = readPid(pidPath);
  if (!pid || !isPidAlive(pid)) {
    return null;
  }

  let startedAt: string | null = null;
  try {
    startedAt = statSync(pidPath).mtime.toISOString();
  } catch {
    startedAt = null;
  }

  return { pid, startedAt };
}

function getLogCapState(logPath: string): CocoIndexLogCapState {
  try {
    const stat = statSync(logPath);
    return stat.size > getLogCapBytes() ? 'over_cap' : 'ok';
  } catch {
    return existsSync(logPath) ? 'unknown' : 'missing';
  }
}

function buildProbe(): CocoIndexDaemonProbe {
  const daemonDir = getDaemonDir();
  const socketPath = join(daemonDir, 'daemon.sock');
  const pidPath = join(daemonDir, 'daemon.pid');
  const logPath = join(daemonDir, 'daemon.log');
  const lockPath = join(daemonDir, 'daemon.lock');
  const spawnLockPath = join(daemonDir, 'daemon.spawn-lock');
  const pidLockHolder = readPidLockHolder(pidPath);
  const socketExists = existsSync(socketPath);
  const lockExists = existsSync(lockPath);
  const logCapState = getLogCapState(logPath);

  let status: CocoIndexDaemonStatus = 'unreachable';
  let reason: string | null = null;
  if (pidLockHolder && socketExists && logCapState !== 'over_cap') {
    status = 'reachable';
  } else if (pidLockHolder && (socketExists || lockExists)) {
    status = 'degraded';
    reason = socketExists ? 'daemon log state degraded' : 'pid alive but socket missing';
  } else if (pidLockHolder) {
    status = 'degraded';
    reason = 'pid alive but daemon lock/socket evidence missing';
  } else {
    reason = existsSync(pidPath) ? 'pid file is stale or unreadable' : 'daemon pid file missing';
  }

  if (logCapState === 'over_cap' && status === 'reachable') {
    status = 'degraded';
    reason = 'daemon log exceeds configured cap';
  }

  return {
    status,
    socketPath,
    pidPath,
    logPath,
    lockPath,
    spawnLockPath,
    pidLockHolder,
    logCapState,
    checkedAt: new Date().toISOString(),
    ttlMs: getTtlMs(),
    reason,
  };
}

function probeCocoIndexDaemon(options: { force?: boolean } = {}): CocoIndexDaemonProbe {
  const ttlMs = getTtlMs();
  const now = Date.now();
  if (!options.force && cachedProbe && now - cachedAt < ttlMs) {
    return { ...cachedProbe, ttlMs };
  }

  cachedProbe = buildProbe();
  cachedAt = now;
  return { ...cachedProbe };
}

function resetCocoIndexDaemonProbeCache(): void {
  cachedProbe = null;
  cachedAt = 0;
}

export {
  DEFAULT_TTL_MS,
  DEFAULT_LOG_CAP_BYTES,
  probeCocoIndexDaemon,
  resetCocoIndexDaemonProbeCache,
};

export type {
  CocoIndexDaemonStatus,
  CocoIndexLogCapState,
  CocoIndexDaemonProbe,
  PidLockHolder,
};
