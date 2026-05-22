import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  OWNER_LEASE_FILE_NAME,
  acquireOwnerLease,
  classifyOwner,
  readOwnerLease,
  refreshOwnerLease,
  releaseOwnerLease,
  type OwnerLeaseData,
} from '../../lib/owner-lease.js';
import { resolveCanonicalDbDir } from '../../lib/canonical-db-dir.js';

const tempDirs: string[] = [];

function tempRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'cg-owner-lease-'));
  tempDirs.push(dir);
  return dir;
}

function leaseFor(dbDir: string, patch: Partial<OwnerLeaseData> = {}): OwnerLeaseData {
  const now = '2026-05-22T00:00:00.000Z';
  return {
    ownerPid: process.pid,
    ppid: process.ppid,
    executablePath: process.execPath,
    startedAtIso: now,
    lastHeartbeatIso: now,
    ttlMs: 60_000,
    canonicalDbDir: resolveCanonicalDbDir(dbDir),
    ...patch,
  };
}

function writeLease(dbDir: string, lease: OwnerLeaseData): void {
  writeFileSync(join(resolveCanonicalDbDir(dbDir), OWNER_LEASE_FILE_NAME), `${JSON.stringify(lease, null, 2)}\n`);
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('owner lease lifecycle', () => {
  it('acquires, refreshes, and releases only for the matching owner', () => {
    const dbDir = join(tempRoot(), 'db');
    const acquired = acquireOwnerLease(dbDir, { ownerPid: 123, ppid: 1, executablePath: '/bin/node' });

    expect(acquired.acquired).toBe(true);
    expect(readOwnerLease(dbDir)?.ownerPid).toBe(123);
    expect(refreshOwnerLease(dbDir, 999)).toBe(false);
    expect(refreshOwnerLease(dbDir, 123, new Date('2026-05-22T00:01:00.000Z'))).toBe(true);
    expect(readOwnerLease(dbDir)?.lastHeartbeatIso).toBe('2026-05-22T00:01:00.000Z');
    expect(releaseOwnerLease(dbDir, 999)).toBe(false);
    expect(releaseOwnerLease(dbDir, 123)).toBe(true);
    expect(readOwnerLease(dbDir)).toBeNull();
  });

  it('refuses a same-effective-DB second owner while the first owner is live', () => {
    const dbDir = join(tempRoot(), 'db');
    const first = acquireOwnerLease(dbDir);
    const second = acquireOwnerLease(dbDir);

    expect(first.acquired).toBe(true);
    expect(second).toMatchObject({
      acquired: false,
      classification: 'live-owner',
    });
  });

  it('treats symlink aliases as the same owner boundary', () => {
    const root = tempRoot();
    const realDir = join(root, 'real-db');
    const aliasA = join(root, 'alias-a');
    const aliasB = join(root, 'alias-b');
    mkdirSync(realDir, { recursive: true });
    symlinkSync(realDir, aliasA, 'dir');
    symlinkSync(realDir, aliasB, 'dir');

    expect(acquireOwnerLease(aliasA).acquired).toBe(true);
    const second = acquireOwnerLease(aliasB);

    expect(second).toMatchObject({
      acquired: false,
      classification: 'live-owner',
    });
    const holder = readOwnerLease(realDir);
    expect(holder).not.toBeNull();
    expect(classifyOwner(holder!, { candidateDbDir: aliasB })).toBe('symlink-alias');
  });

  it('reclaims stale dead-PID leases by overwriting the lease file', () => {
    const dbDir = join(tempRoot(), 'db');
    writeLease(dbDir, leaseFor(dbDir, { ownerPid: 424242, ppid: 1 }));

    const result = acquireOwnerLease(dbDir, {
      ownerPid: 777,
      ppid: 1,
      processKill: () => {
        const error = new Error('not found') as NodeJS.ErrnoException;
        error.code = 'ESRCH';
        throw error;
      },
    });

    expect(result).toMatchObject({
      acquired: true,
      classification: 'stale-pid',
      reclaimed: { ownerPid: 424242 },
    });
    expect(readOwnerLease(dbDir)?.ownerPid).toBe(777);
  });

  it('classifies stale-heartbeat live-PID owners as reclaimable', () => {
    const dbDir = join(tempRoot(), 'db');
    const now = new Date('2026-05-22T00:03:00.001Z');
    const staleOwner = leaseFor(dbDir, {
      lastHeartbeatIso: '2026-05-22T00:00:00.000Z',
      ttlMs: 60_000,
    });

    expect(classifyOwner(staleOwner, {
      processKill: () => true,
      readParentPid: () => staleOwner.ppid,
      now,
    })).toBe('stale-heartbeat-reclaim');
  });

  it('keeps recent-heartbeat live-PID owners classified as live', () => {
    const dbDir = join(tempRoot(), 'db');
    const now = new Date('2026-05-22T00:00:00.100Z');
    const healthyOwner = leaseFor(dbDir, {
      lastHeartbeatIso: '2026-05-22T00:00:00.000Z',
      ttlMs: 60_000,
    });

    expect(classifyOwner(healthyOwner, {
      processKill: () => true,
      readParentPid: () => healthyOwner.ppid,
      now,
    })).toBe('live-owner');
  });

  it('keeps refreshed live-PID owners classified as live across multiple TTL windows', () => {
    const dbDir = join(tempRoot(), 'db');
    const baseMs = Date.parse('2026-05-22T00:00:00.000Z');
    const ttlMs = 300;
    const refreshIntervalMs = ttlMs / 3;
    const ownerPid = 1234;
    const ownerPpid = 5678;

    writeLease(dbDir, leaseFor(dbDir, {
      ownerPid,
      ppid: ownerPpid,
      lastHeartbeatIso: new Date(baseMs).toISOString(),
      ttlMs,
    }));

    for (let tick = 1; tick <= 12; tick += 1) {
      const now = new Date(baseMs + tick * refreshIntervalMs);
      expect(refreshOwnerLease(dbDir, ownerPid, now)).toBe(true);
      const refreshed = readOwnerLease(dbDir);

      expect(refreshed).not.toBeNull();
      expect(classifyOwner(refreshed!, {
        processKill: () => true,
        readParentPid: () => ownerPpid,
        now,
      })).toBe('live-owner');
    }
  });

  it('reclaims stale-heartbeat leases by overwriting the lease file', () => {
    const dbDir = join(tempRoot(), 'db');
    const base = new Date('2026-05-22T00:00:00.000Z');
    const initial = acquireOwnerLease(dbDir, {
      ownerPid: 424242,
      ppid: 1,
      executablePath: '/bin/node',
      now: base,
      ttlMs: 60_000,
    });

    expect(initial.acquired).toBe(true);
    writeLease(dbDir, {
      ...readOwnerLease(dbDir)!,
      lastHeartbeatIso: base.toISOString(),
    });

    const result = acquireOwnerLease(dbDir, {
      ownerPid: 777,
      ppid: 1,
      processKill: () => true,
      readParentPid: () => 1,
      now: new Date(base.getTime() + 180_001),
    });

    expect(result).toMatchObject({
      acquired: true,
      classification: 'stale-heartbeat-reclaim',
      reclaimed: { ownerPid: 424242 },
    });
    expect(readOwnerLease(dbDir)?.ownerPid).toBe(777);
  });

  it('classifies EPERM owners as unknown and does not reclaim them', () => {
    const dbDir = join(tempRoot(), 'db');
    writeLease(dbDir, leaseFor(dbDir, { ownerPid: 424242, ppid: 1 }));
    const processKill = () => {
      const error = new Error('permission denied') as NodeJS.ErrnoException;
      error.code = 'EPERM';
      throw error;
    };

    expect(classifyOwner(leaseFor(dbDir), { processKill })).toBe('unknown-eperm');
    const result = acquireOwnerLease(dbDir, {
      ownerPid: 777,
      processKill,
    });

    expect(result).toMatchObject({
      acquired: false,
      classification: 'unknown-eperm',
      holder: { ownerPid: 424242 },
    });
    expect(JSON.parse(readFileSync(join(resolveCanonicalDbDir(dbDir), OWNER_LEASE_FILE_NAME), 'utf8')).ownerPid).toBe(424242);
  });

  it('classifies PPID-1 orphans as reclaimable owner evidence', () => {
    const dbDir = join(tempRoot(), 'db');
    const orphan = leaseFor(dbDir, { ownerPid: 424242, ppid: 123 });
    const processKill = () => true;
    const readParentPid = () => 1;

    expect(classifyOwner(orphan, { processKill, readParentPid })).toBe('ppid-1-orphan');
    writeLease(dbDir, orphan);

    const result = acquireOwnerLease(dbDir, {
      ownerPid: 777,
      processKill,
      readParentPid,
    });

    expect(result).toMatchObject({
      acquired: true,
      classification: 'ppid-1-orphan',
      reclaimed: { ownerPid: 424242 },
    });
    expect(readOwnerLease(dbDir)?.ownerPid).toBe(777);
  });

  it('classifies child-survival after launcher death as orphan, not live owner', () => {
    const dbDir = join(tempRoot(), 'db');
    const childLease = leaseFor(dbDir, {
      ownerPid: 555,
      ppid: 444,
      executablePath: process.execPath,
    });

    expect(classifyOwner(childLease, {
      processKill: () => true,
      readParentPid: () => 1,
    })).toBe('ppid-1-orphan');
  });
});
