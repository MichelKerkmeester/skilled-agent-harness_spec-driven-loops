// ───────────────────────────────────────────────────────────────────
// MODULE: Code Graph Owner Lease
// ───────────────────────────────────────────────────────────────────

import {
  closeSync,
  existsSync,
  fsyncSync,
  openSync,
  readFileSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

import { resolveCanonicalDbDir } from './canonical-db-dir.js';

export interface OwnerLeaseData {
  ownerPid: number;
  ppid: number;
  executablePath: string;
  startedAtIso: string;
  lastHeartbeatIso: string;
  ttlMs: number;
  canonicalDbDir: string;
}

export type OwnerClassification =
  | 'live-owner'
  | 'stale-pid'
  | 'stale-heartbeat-reclaim'
  | 'ppid-1-orphan'
  | 'symlink-alias'
  | 'unknown-eperm';

export type OwnerLeaseAcquireResult =
  | { acquired: true; lease: OwnerLeaseData; leasePath: string; reclaimed?: OwnerLeaseData; classification?: OwnerClassification }
  | { acquired: false; holder: OwnerLeaseData; leasePath: string; classification: OwnerClassification };

export interface OwnerLeaseOptions {
  readonly ownerPid?: number;
  readonly ppid?: number;
  readonly executablePath?: string;
  readonly ttlMs?: number;
  readonly now?: Date;
  readonly processKill?: (pid: number, signal: 0) => boolean;
  readonly readParentPid?: (pid: number) => number | null;
}

export interface OwnerClassificationOptions {
  readonly processKill?: (pid: number, signal: 0) => boolean;
  readonly readParentPid?: (pid: number) => number | null;
  readonly candidateDbDir?: string;
  readonly now?: Date;
}

const OWNER_LEASE_FILE_NAME = '.code-graph-owner.json';
const DEFAULT_TTL_MS = 60_000;

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

function ownerLeasePath(canonicalDbDir: string): string {
  return join(canonicalDbDir, OWNER_LEASE_FILE_NAME);
}

function isOwnerLeaseData(raw: unknown): raw is OwnerLeaseData {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return false;
  const candidate = raw as Partial<OwnerLeaseData>;
  return (
    Number.isInteger(candidate.ownerPid) &&
    Number.isInteger(candidate.ppid) &&
    typeof candidate.executablePath === 'string' &&
    typeof candidate.startedAtIso === 'string' &&
    typeof candidate.lastHeartbeatIso === 'string' &&
    Number.isInteger(candidate.ttlMs) &&
    typeof candidate.canonicalDbDir === 'string'
  );
}

function writeOwnerLeaseAtomic(leasePath: string, data: OwnerLeaseData): void {
  const tempPath = makeTempPath(leasePath);
  try {
    writeFileSync(tempPath, `${JSON.stringify(data, null, 2)}\n`, { encoding: 'utf8', flag: 'wx', mode: 0o600 });
    fsyncPath(tempPath);
    renameSync(tempPath, leasePath);
    try {
      fsyncPath(dirname(leasePath));
    } catch {
      // Directory fsync is best-effort on local filesystems.
    }
  } catch (error) {
    rmSync(tempPath, { force: true });
    throw error;
  }
}

function getProcessLiveness(
  pid: number,
  processKill: (pid: number, signal: 0) => boolean = process.kill,
): 'alive' | 'dead' | 'unknown-eperm' {
  if (!Number.isInteger(pid) || pid <= 0) return 'dead';

  try {
    processKill(pid, 0);
    return 'alive';
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'ESRCH') return 'dead';
      if (error.code === 'EPERM') return 'unknown-eperm';
    }
    return 'alive';
  }
}

export function processAlive(pid: number): boolean {
  return getProcessLiveness(pid) !== 'dead';
}

function isHeartbeatStale(lease: OwnerLeaseData, now: Date = new Date()): boolean {
  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
  const ttlMs = Number.isFinite(lease.ttlMs) ? lease.ttlMs : 0;
  return !Number.isFinite(heartbeatMs) || now.getTime() - heartbeatMs > ttlMs * 2;
}

export function getOwnerLeasePath(dbDir: string): string {
  return ownerLeasePath(resolveCanonicalDbDir(dbDir));
}

export function readOwnerLease(dbDir: string): OwnerLeaseData | null {
  const canonicalDbDir = resolveCanonicalDbDir(dbDir);
  try {
    const parsed = JSON.parse(readFileSync(ownerLeasePath(canonicalDbDir), 'utf8')) as unknown;
    return isOwnerLeaseData(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function readProcessParentPid(pid: number): number | null {
  if (!Number.isInteger(pid) || pid <= 0) return null;

  if (process.platform === 'linux') {
    try {
      const status = readFileSync(`/proc/${pid}/status`, 'utf8');
      const match = /^PPid:\s+(\d+)$/m.exec(status);
      return match ? Number.parseInt(match[1], 10) : null;
    } catch {
      return null;
    }
  }

  try {
    const output = execFileSync('ps', ['-o', 'ppid=', '-p', String(pid)], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return output ? Number.parseInt(output, 10) : null;
  } catch {
    return null;
  }
}

export function classifyOwner(
  lease: OwnerLeaseData,
  options: OwnerClassificationOptions = {},
): OwnerClassification {
  const liveness = getProcessLiveness(lease.ownerPid, options.processKill);
  if (liveness === 'dead') return 'stale-pid';
  if (liveness === 'unknown-eperm') return 'unknown-eperm';

  const actualPpid = (options.readParentPid ?? readProcessParentPid)(lease.ownerPid);
  if (actualPpid !== null && actualPpid !== lease.ppid && actualPpid === 1) {
    return 'ppid-1-orphan';
  }

  if (isHeartbeatStale(lease, options.now)) {
    return 'stale-heartbeat-reclaim';
  }

  if (options.candidateDbDir) {
    const candidateResolved = resolve(options.candidateDbDir);
    const candidateCanonical = resolveCanonicalDbDir(options.candidateDbDir);
    if (candidateCanonical === lease.canonicalDbDir && candidateResolved !== lease.canonicalDbDir) {
      return 'symlink-alias';
    }
  }

  return 'live-owner';
}

export function acquireOwnerLease(dbDir: string, options: OwnerLeaseOptions = {}): OwnerLeaseAcquireResult {
  const canonicalDbDir = resolveCanonicalDbDir(dbDir);
  const leasePath = ownerLeasePath(canonicalDbDir);
  const existing = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
  const now = options.now ?? new Date();
  let existingClassification: OwnerClassification | undefined;

  if (existing) {
    const classification = classifyOwner(existing, {
      processKill: options.processKill,
      readParentPid: options.readParentPid,
      now,
    });
    existingClassification = classification;
    if (
      classification === 'live-owner' ||
      classification === 'symlink-alias' ||
      classification === 'unknown-eperm'
    ) {
      return { acquired: false, holder: existing, leasePath, classification };
    }
  }

  const lease: OwnerLeaseData = {
    ownerPid: options.ownerPid ?? process.pid,
    ppid: options.ppid ?? process.ppid,
    executablePath: options.executablePath ?? process.execPath,
    startedAtIso: now.toISOString(),
    lastHeartbeatIso: now.toISOString(),
    ttlMs: options.ttlMs ?? DEFAULT_TTL_MS,
    canonicalDbDir,
  };

  writeOwnerLeaseAtomic(leasePath, lease);
  return existing
    ? { acquired: true, lease, leasePath, reclaimed: existing, classification: existingClassification }
    : { acquired: true, lease, leasePath };
}

export function refreshOwnerLease(
  dbDir: string,
  ownerPid: number,
  now: Date = new Date(),
  patch: Partial<Pick<OwnerLeaseData, 'ownerPid' | 'ppid' | 'executablePath'>> = {},
): boolean {
  const canonicalDbDir = resolveCanonicalDbDir(dbDir);
  const leasePath = ownerLeasePath(canonicalDbDir);
  const holder = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
  if (!holder || holder.ownerPid !== ownerPid) return false;

  writeOwnerLeaseAtomic(leasePath, {
    ...holder,
    ...patch,
    lastHeartbeatIso: now.toISOString(),
  });
  return true;
}

export function releaseOwnerLease(dbDir: string, ownerPid: number): boolean {
  const canonicalDbDir = resolveCanonicalDbDir(dbDir);
  const leasePath = ownerLeasePath(canonicalDbDir);
  const holder = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
  if (!holder || holder.ownerPid !== ownerPid) return false;

  unlinkSync(leasePath);
  return true;
}

export { OWNER_LEASE_FILE_NAME };
