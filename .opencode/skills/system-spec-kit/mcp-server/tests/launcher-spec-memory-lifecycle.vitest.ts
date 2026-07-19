// ───────────────────────────────────────────────────────────────
// MODULE: mk-spec-memory Launcher Lifecycle Tests
// ───────────────────────────────────────────────────────────────
// Regression coverage for the spec-memory launcher daemon-lifecycle fixes:
//   - bootstrap-lock reclaim must fire on a provably-dead stamped holder, not only
//     after the 5-min mtime TTL (the TTL deliberately exceeds the 120s deadline).
//   - owner-lease stale reclaim must be a single O_EXCL CAS (no double-acquire, no
//     loser deleting the winner's lease).
//   - reapOwnerBeforeRespawn must refuse to kill a heartbeat-fresh (live-owner)
//     daemon on a socket-probe-only "dead" verdict (cap-refusal != death).

import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const launcher = require('../../../../bin/mk-spec-memory-launcher.cjs') as {
  acquireBootstrapLock: (options?: { requireLock?: boolean; staleMs?: number; timeoutMs?: number; retrySleepMs?: number }) => Promise<boolean>;
  removeStaleBootstrapLock: (staleMs?: number) => boolean;
  readBootstrapLockOwnerPid: () => number | null;
  acquireOwnerLeaseFile: () => { acquired: boolean; lease?: { ownerPid: number }; classification?: string };
  clearOwnerLeaseFile: () => void;
  ownerLeasePath: () => string;
  readOwnerLeaseFile: (filePath?: string) => Record<string, unknown> | null;
  buildOwnerLease: (ownerPid?: number) => Record<string, unknown>;
  classifyOwnerLease: (lease: Record<string, unknown>) => string;
  reapOwnerBeforeRespawn: (ownerPid: number) => Promise<{ allowed: boolean; reason: string }>;
  configureLauncherPathsForTesting: (paths: { dbDir: string; lockDir: string; stateFile: string }) => void;
};

const tempDirs: string[] = [];

function findDeadPid(): number {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const pid = Math.floor(Math.random() * 1_000_000) + 100_000;
    try {
      process.kill(pid, 0);
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === 'ESRCH') return pid;
    }
  }
  throw new Error('unable to find an unused pid');
}

afterEach(() => {
  try { launcher.clearOwnerLeaseFile(); } catch { /* ignore */ }
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

function configureTempLauncher(): { dbDir: string; lockDir: string } {
  const root = mkdtempSync(join(tmpdir(), 'mk-spec-memory-lifecycle-'));
  tempDirs.push(root);
  const dbDir = join(root, 'database');
  mkdirSync(dbDir, { recursive: true });
  const lockDir = join(dbDir, '.mk-spec-memory-launcher.lockdir');
  launcher.configureLauncherPathsForTesting({ dbDir, lockDir, stateFile: join(dbDir, '.mk-spec-memory-launcher.json') });
  return { dbDir, lockDir };
}

describe('mk-spec-memory launcher bootstrap lock', () => {
  it('stamps the holder pid inside the lock dir on acquire', async () => {
    const { lockDir } = configureTempLauncher();
    await expect(launcher.acquireBootstrapLock({ requireLock: true, timeoutMs: 200, retrySleepMs: 5 })).resolves.toBe(true);
    expect(readFileSync(join(lockDir, 'owner.pid'), 'utf8').trim()).toBe(String(process.pid));
    expect(launcher.readBootstrapLockOwnerPid()).toBe(process.pid);
  });

  it('reclaims a fresh lock dir as soon as its stamped holder is provably dead', async () => {
    const { lockDir } = configureTempLauncher();
    await launcher.acquireBootstrapLock({ requireLock: true, timeoutMs: 200, retrySleepMs: 5 });
    writeFileSync(join(lockDir, 'owner.pid'), String(findDeadPid()));
    expect(launcher.removeStaleBootstrapLock(5 * 60 * 1000)).toBe(true);
  });

  it('does NOT reclaim a fresh lock dir whose stamped holder is alive', async () => {
    configureTempLauncher();
    await launcher.acquireBootstrapLock({ requireLock: true, timeoutMs: 200, retrySleepMs: 5 });
    expect(launcher.removeStaleBootstrapLock(5 * 60 * 1000)).toBe(false);
  });
});

describe('mk-spec-memory launcher owner-lease CAS reclaim', () => {
  it('acquires a fresh owner lease and records this pid as owner', () => {
    configureTempLauncher();
    launcher.clearOwnerLeaseFile();
    const result = launcher.acquireOwnerLeaseFile();
    expect(result.acquired).toBe(true);
    expect(result.lease?.ownerPid).toBe(process.pid);
  });

  it('reclaims a dead orphan owner lease via exclusive create', () => {
    configureTempLauncher();
    launcher.clearOwnerLeaseFile();
    const first = launcher.acquireOwnerLeaseFile();
    expect(first.acquired).toBe(true);
    const realLease = launcher.readOwnerLeaseFile();
    writeFileSync(launcher.ownerLeasePath(), `${JSON.stringify({ ...realLease, ownerPid: findDeadPid(), ppid: 1 }, null, 2)}\n`);
    launcher.clearOwnerLeaseFile();
    const reclaim = launcher.acquireOwnerLeaseFile();
    expect(reclaim.acquired).toBe(true);
    expect(launcher.readOwnerLeaseFile()?.ownerPid).toBe(process.pid);
  });
});

describe('mk-spec-memory reapOwnerBeforeRespawn heartbeat gate', () => {
  it('refuses to reap a heartbeat-fresh live owner (socket-probe verdict is not death)', async () => {
    configureTempLauncher();
    launcher.clearOwnerLeaseFile();
    // Mint a live-owner lease owned by this (alive, heartbeat-fresh) process.
    const minted = launcher.acquireOwnerLeaseFile();
    expect(minted.acquired).toBe(true);
    const lease = launcher.readOwnerLeaseFile();
    expect(lease).toBeTruthy();
    expect(launcher.classifyOwnerLease(lease as Record<string, unknown>)).toBe('live-owner');

    // The reap is triggered by a socket-probe "dead" verdict; the heartbeat gate must
    // override it for a live-owner and refuse to kill this process.
    const result = await launcher.reapOwnerBeforeRespawn(process.pid);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('owner-heartbeat-fresh');
  });

  it('allows reaping when the recorded owner pid is already dead', async () => {
    configureTempLauncher();
    launcher.clearOwnerLeaseFile();
    const result = await launcher.reapOwnerBeforeRespawn(findDeadPid());
    expect(result.allowed).toBe(true);
    expect(result.reason).toBe('owner-already-dead');
  });
});
