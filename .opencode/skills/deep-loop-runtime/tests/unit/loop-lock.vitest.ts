import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

import { describe, expect, it } from 'vitest';

import {
  acquireLoopLock,
  isStaleLoopLock,
  processAlive,
  refreshLoopLock,
  releaseLoopLock,
  type LoopLockData,
} from '../../lib/deep-loop/loop-lock.js';

function withTempLock(run: (lockPath: string) => void): void {
  const tempDir = mkdtempSync(join(tmpdir(), 'loop-lock-'));
  try {
    run(join(tempDir, '.deep-loop.lock'));
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function lockData(overrides: Partial<LoopLockData> = {}): LoopLockData {
  const now = new Date().toISOString();
  return {
    ownerPid: process.pid,
    startedAtIso: now,
    ttlMs: 300_000,
    lastHeartbeatIso: now,
    packetId: 'packet-004',
    runtimeKind: 'main',
    ...overrides,
  };
}

function knownDeadPid(): number {
  for (let pid = 999_999; pid > 900_000; pid -= 1) {
    if (!processAlive(pid)) return pid;
  }
  throw new Error('Could not find a known-dead pid for loop-lock test');
}

type ChildLockResult = {
  acquired: boolean;
  packetId: string;
  diskPacketId: string | null;
};

function runLockChild(lockPath: string, barrierPath: string, packetId: string): Promise<ChildLockResult> {
  const moduleUrl = new URL('../../lib/deep-loop/loop-lock.ts', import.meta.url).href;
  const script = `
    import { existsSync, readFileSync } from 'node:fs';
    import { acquireLoopLock } from ${JSON.stringify(moduleUrl)};
    const [lockPath, barrierPath, packetId] = process.argv.slice(1);
    const deadline = Date.now() + 2000;
    while (!existsSync(barrierPath)) {
      if (Date.now() > deadline) throw new Error('barrier timeout');
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 5);
    }
    const now = new Date().toISOString();
    const result = acquireLoopLock(lockPath, {
      ownerPid: process.pid,
      startedAtIso: now,
      ttlMs: 300000,
      lastHeartbeatIso: now,
      packetId,
      runtimeKind: 'cli-codex',
    });
    let diskPacketId = null;
    try { diskPacketId = JSON.parse(readFileSync(lockPath, 'utf8')).packet_id; } catch {}
    process.stdout.write(JSON.stringify({ acquired: result.acquired, packetId, diskPacketId }) + '\\n');
  `;

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e', script, lockPath, barrierPath, packetId], {
      cwd: join(process.cwd()),
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk: string) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `lock child exited ${code}`));
        return;
      }
      resolve(JSON.parse(stdout.trim()) as ChildLockResult);
    });
  });
}

describe('loop-lock', () => {
  it('acquires a new packet lock using the snake_case on-disk format', () => {
    withTempLock((lockPath) => {
      const result = acquireLoopLock(lockPath, lockData({ runtimeKind: 'cli-codex' }));

      expect(result).toMatchObject({ acquired: true });
      const disk = JSON.parse(readFileSync(lockPath, 'utf8'));
      expect(disk).toMatchObject({
        owner_pid: process.pid,
        ttl_ms: 300_000,
        packet_id: 'packet-004',
        runtime_kind: 'cli-codex',
      });
      expect(typeof disk.started_at_iso).toBe('string');
      expect(typeof disk.last_heartbeat_iso).toBe('string');
    });
  });

  it('refuses a second acquire while the current holder is alive and fresh', () => {
    withTempLock((lockPath) => {
      const first = lockData();
      expect(acquireLoopLock(lockPath, first)).toMatchObject({ acquired: true });

      const second = acquireLoopLock(lockPath, lockData({ packetId: 'packet-004-second' }));

      expect(second).toEqual({ acquired: false, holder: first });
    });
  });

  it('allows exactly one fresh cross-process acquire to win', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'loop-lock-'));
    try {
      const lockPath = join(tempDir, '.deep-loop.lock');
      const barrierPath = join(tempDir, 'go');
      const children = [
        runLockChild(lockPath, barrierPath, 'packet-004-a'),
        runLockChild(lockPath, barrierPath, 'packet-004-b'),
      ];

      await new Promise((resolve) => setTimeout(resolve, 50));
      await import('node:fs').then(({ writeFileSync }) => writeFileSync(barrierPath, 'go', 'utf8'));
      const results = await Promise.all(children);

      expect(results.filter((result) => result.acquired)).toHaveLength(1);
      expect(results.filter((result) => !result.acquired)).toHaveLength(1);
      const winner = results.find((result) => result.acquired);
      expect(JSON.parse(readFileSync(lockPath, 'utf8')).packet_id).toBe(winner?.packetId);
      expect(results.every((result) => result.diskPacketId === winner?.packetId)).toBe(true);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('refreshes and releases only when the owner pid matches', () => {
    withTempLock((lockPath) => {
      acquireLoopLock(lockPath, lockData());

      expect(refreshLoopLock(lockPath, process.pid + 100_000)).toBe(false);
      expect(refreshLoopLock(lockPath, process.pid, new Date('2026-05-22T12:03:00.000Z'))).toBe(true);
      expect(JSON.parse(readFileSync(lockPath, 'utf8')).last_heartbeat_iso).toBe('2026-05-22T12:03:00.000Z');

      expect(releaseLoopLock(lockPath, process.pid + 100_000)).toBe(false);
      expect(existsSync(lockPath)).toBe(true);
      expect(releaseLoopLock(lockPath, process.pid)).toBe(true);
      expect(existsSync(lockPath)).toBe(false);
    });
  });

  it('treats TTL-expired locks as stale', () => {
    const stale = lockData({
      lastHeartbeatIso: '2026-05-22T12:00:00.000Z',
      ttlMs: 1_000,
    });

    expect(isStaleLoopLock(stale, new Date('2026-05-22T12:00:03.001Z'))).toBe(true);
  });

  it('reclaims a lock whose owner pid is dead', () => {
    withTempLock((lockPath) => {
      const deadHolder = lockData({ ownerPid: knownDeadPid(), packetId: 'old-packet' });
      expect(acquireLoopLock(lockPath, deadHolder)).toMatchObject({ acquired: true });

      const replacement = lockData({ packetId: 'new-packet' });
      const result = acquireLoopLock(lockPath, replacement);

      expect(result).toEqual({ acquired: true, lock: replacement, reclaimed: deadHolder });
      expect(JSON.parse(readFileSync(lockPath, 'utf8')).packet_id).toBe('new-packet');
    });
  });

  it('allows a second run to acquire after the first holder releases', () => {
    withTempLock((lockPath) => {
      const first = lockData({ packetId: 'first' });
      const second = lockData({ packetId: 'second' });

      expect(acquireLoopLock(lockPath, first)).toMatchObject({ acquired: true });
      expect(acquireLoopLock(lockPath, second)).toMatchObject({ acquired: false });
      expect(releaseLoopLock(lockPath, process.pid)).toBe(true);
      expect(acquireLoopLock(lockPath, second)).toEqual({ acquired: true, lock: second });
    });
  });
});
