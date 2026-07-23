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

import type * as fsTypes from 'node:fs';
import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
// CJS require gives a mutable module object (unlike the ESM namespace import above),
// which is required for vi.spyOn — and it's the exact same fs object the launcher's own
// `require('fs')` resolves to, so spying here intercepts the launcher's internal calls too.
const fs = require('node:fs') as typeof fsTypes;
const launcher = require('../../../../bin/mk-spec-memory-launcher.cjs') as {
  acquireBootstrapLock: (options?: { requireLock?: boolean; staleMs?: number; timeoutMs?: number; retrySleepMs?: number }) => Promise<boolean>;
  removeStaleBootstrapLock: (staleMs?: number) => boolean;
  readBootstrapLockOwnerPid: () => number | null;
  acquireOwnerLeaseFile: () => { acquired: boolean; lease?: { ownerPid: number; leaseId?: string }; holder?: { ownerPid?: number; leaseId?: string }; classification?: string };
  clearOwnerLeaseFile: () => void;
  ownerLeasePath: () => string;
  readOwnerLeaseFile: (filePath?: string) => (Record<string, unknown> & { leaseId?: string }) | null;
  buildOwnerLease: (ownerPid?: number) => Record<string, unknown> & { leaseId: string };
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

  // Reproduces a two-launcher TOCTOU interleaving: a racer (B) completes its own full
  // acquire cycle in the window between this process's (A's) classify-as-stale read and
  // its immediately-before-unlink re-validation. Without the leaseId fence, A's unlink
  // would remove B's freshly-installed lease instead of the original stale one.
  it('refuses to unlink a racing launcher\'s fresh lease when interleaved mid-reclaim', () => {
    configureTempLauncher();
    launcher.clearOwnerLeaseFile();

    const first = launcher.acquireOwnerLeaseFile();
    expect(first.acquired).toBe(true);
    const originalLease = launcher.readOwnerLeaseFile();

    // Seed a stale lease (dead owner) that racer A will classify as reclaimable.
    const staleLeaseContent = `${JSON.stringify({ ...originalLease, ownerPid: findDeadPid(), ppid: 1 }, null, 2)}\n`;
    writeFileSync(launcher.ownerLeasePath(), staleLeaseContent);
    launcher.clearOwnerLeaseFile();

    // Racer B's winning fresh lease — a distinct leaseId, installed as a side effect of A's
    // OWN first read below (simulating B's full acquire cycle completing in that exact gap).
    const racingLease = launcher.buildOwnerLease(process.pid);
    const racingLeaseContent = `${JSON.stringify(racingLease, null, 2)}\n`;

    const realReadFileSync = fs.readFileSync.bind(fs);
    let ownerLeaseReadCount = 0;
    const spy = vi.spyOn(fs, 'readFileSync').mockImplementation((...args: Parameters<typeof fs.readFileSync>) => {
      const [filePath] = args;
      if (typeof filePath === 'string' && filePath === launcher.ownerLeasePath()) {
        ownerLeaseReadCount += 1;
        if (ownerLeaseReadCount === 1) {
          writeFileSync(launcher.ownerLeasePath(), racingLeaseContent);
          return staleLeaseContent;
        }
      }
      return realReadFileSync(...(args as Parameters<typeof fs.readFileSync>));
    });

    let attempt: ReturnType<typeof launcher.acquireOwnerLeaseFile>;
    try {
      attempt = launcher.acquireOwnerLeaseFile();
    } finally {
      spy.mockRestore();
    }

    expect(attempt.acquired).toBe(false);
    expect(attempt.holder?.leaseId).toBe(racingLease.leaseId);
    // Racer B's fresh lease must survive completely untouched — this is the fence's whole point.
    expect(launcher.readOwnerLeaseFile()?.leaseId).toBe(racingLease.leaseId);
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
