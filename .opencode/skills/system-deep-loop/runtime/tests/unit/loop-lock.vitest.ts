import { afterEach, describe, expect, it, vi } from 'vitest';

import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  acquireLoopLock,
  DEFAULT_LOOP_LOCK_HEARTBEAT_INTERVAL_MS,
  isStaleLoopLock,
  processAlive,
  refreshLoopLock,
  releaseLoopLock,
  startHeartbeat,
  stopHeartbeat,
  type LoopLockData,
} from '../../lib/deep-loop/loop-lock.js';
import { createHermeticEnv } from '../helpers/spawn-cjs.js';

type LockDataWithNonce = LoopLockData & { acquireNonce?: string };

/**
 * Creates a temporary lock file path for loop-lock tests.
 */
function withTempLock(run: (lockPath: string) => void): void {
  const tempDir = mkdtempSync(join(tmpdir(), 'loop-lock-'));
  try {
    run(join(tempDir, '.deep-loop.lock'));
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

/**
 * Returns a default LoopLockData payload with optional overrides.
 */
function lockData(overrides: Partial<LoopLockData> = {}): LoopLockData {
  const now = new Date().toISOString();
  return {
    ownerPid: process.pid,
    startedAtIso: now,
    ttlMs: 300_000,
    lastHeartbeatIso: now,
    packetId: 'packet-004',
    runtimeKind: 'main',
    phase: 'running',
    lastActivityIso: now,
    ...overrides,
  };
}

/**
 * Writes a lock file in the public on-disk snake_case format.
 */
function writeSerializedLock(lockPath: string, data: LockDataWithNonce, includeAcquireNonce = true): void {
  const serialized: Record<string, unknown> = {
    owner_pid: data.ownerPid,
    started_at_iso: data.startedAtIso,
    ttl_ms: data.ttlMs,
    last_heartbeat_iso: data.lastHeartbeatIso,
    packet_id: data.packetId,
    runtime_kind: data.runtimeKind,
    phase: data.phase,
    last_activity_iso: data.lastActivityIso,
  };
  if (includeAcquireNonce && typeof data.acquireNonce === 'string') {
    serialized.acquire_nonce = data.acquireNonce;
  }
  writeFileSync(lockPath, `${JSON.stringify(serialized, null, 2)}\n`, 'utf8');
}

/**
 * Finds a known-dead PID to use as a stale lock holder in loop-lock tests.
 */
function knownDeadPid(): number {
  for (let pid = 999_999; pid > 900_000; pid -= 1) {
    if (!processAlive(pid)) return pid;
  }
  throw new Error('Could not find a known-dead pid for loop-lock test');
}

afterEach(() => {
  stopHeartbeat();
  vi.useRealTimers();
});

type ChildLockResult = {
  acquired: boolean;
  packetId: string;
};

/**
 * Spawns a child process that acquires a loop lock after a barrier is released.
 */
function runLockChild(lockPath: string, barrierPath: string, packetId: string): Promise<ChildLockResult> {
  const moduleUrl = new URL('../../lib/deep-loop/loop-lock.ts', import.meta.url).href;
  const script = `
    import { existsSync } from 'node:fs';
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
      runtimeKind: 'cli-claude-code',
    });
    process.stdout.write(JSON.stringify({ acquired: result.acquired, packetId }) + '\\n');
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
      const result = acquireLoopLock(lockPath, lockData({ runtimeKind: 'cli-claude-code' }));

      expect(result).toMatchObject({ acquired: true });
      if (!result.acquired) throw new Error('Expected lock acquisition');
      const disk = JSON.parse(readFileSync(lockPath, 'utf8'));
      expect(disk).toMatchObject({
        owner_pid: process.pid,
        ttl_ms: 300_000,
        packet_id: 'packet-004',
        runtime_kind: 'cli-claude-code',
        phase: 'running',
      });
      expect(typeof disk.acquire_nonce).toBe('string');
      expect(disk.acquire_nonce).toBe((result.lock as LockDataWithNonce).acquireNonce);
      expect(typeof disk.started_at_iso).toBe('string');
      expect(typeof disk.last_heartbeat_iso).toBe('string');
      expect(typeof disk.last_activity_iso).toBe('string');
    });
  });

  it('refuses a second acquire while the current holder is alive and fresh', () => {
    withTempLock((lockPath) => {
      const first = lockData();
      expect(acquireLoopLock(lockPath, first)).toMatchObject({ acquired: true });

      const second = acquireLoopLock(lockPath, lockData({ packetId: 'packet-004-second' }));

      expect(second).toMatchObject({
        acquired: false,
        holder: {
          ownerPid: first.ownerPid,
          packetId: first.packetId,
        },
      });
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
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('refreshes and releases only when the owner pid matches', () => {
    withTempLock((lockPath) => {
      const acquired = acquireLoopLock(lockPath, lockData());
      expect(acquired).toMatchObject({ acquired: true });
      if (!acquired.acquired) throw new Error('Expected lock acquisition');
      const acquireNonce = acquired.lock.acquireNonce;

      expect(refreshLoopLock(lockPath, process.pid + 100_000, new Date(), { acquireNonce })).toBe(false);
      expect(refreshLoopLock(lockPath, process.pid, new Date('2026-05-22T12:03:00.000Z'), { acquireNonce })).toBe(true);
      const refreshed = JSON.parse(readFileSync(lockPath, 'utf8'));
      expect(refreshed.last_heartbeat_iso).toBe('2026-05-22T12:03:00.000Z');
      expect(refreshed.last_activity_iso).toBe('2026-05-22T12:03:00.000Z');
      expect(refreshed.phase).toBe('running');

      expect(releaseLoopLock(lockPath, process.pid + 100_000, acquireNonce)).toBe(false);
      expect(existsSync(lockPath)).toBe(true);
      expect(releaseLoopLock(lockPath, process.pid, acquireNonce)).toBe(true);
      expect(existsSync(lockPath)).toBe(false);
    });
  });

  it('refreshes lock metadata on heartbeat cadence until stopped', () => {
    const env = createHermeticEnv('loop-lock-heartbeat');
    try {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-05-22T12:00:00.000Z'));
      const lockPath = join(env.tmpDir, '.deep-loop.lock');

      const acquired = acquireLoopLock(lockPath, lockData({ phase: 'paused' }));
      expect(acquired).toMatchObject({ acquired: true });
      if (!acquired.acquired) throw new Error('Expected lock acquisition');
      startHeartbeat({ lockPath, ownerPid: process.pid, phase: 'paused', acquireNonce: acquired.lock.acquireNonce }, 1_000);

      vi.advanceTimersByTime(1_000);
      expect(JSON.parse(readFileSync(lockPath, 'utf8')).last_heartbeat_iso).toBe('2026-05-22T12:00:01.000Z');
      vi.advanceTimersByTime(1_000);
      expect(JSON.parse(readFileSync(lockPath, 'utf8')).last_heartbeat_iso).toBe('2026-05-22T12:00:02.000Z');
      vi.advanceTimersByTime(1_000);
      const refreshed = JSON.parse(readFileSync(lockPath, 'utf8'));
      expect(refreshed).toMatchObject({
        phase: 'paused',
        last_heartbeat_iso: '2026-05-22T12:00:03.000Z',
        last_activity_iso: '2026-05-22T12:00:03.000Z',
      });

      stopHeartbeat();
      vi.advanceTimersByTime(DEFAULT_LOOP_LOCK_HEARTBEAT_INTERVAL_MS);
      expect(JSON.parse(readFileSync(lockPath, 'utf8')).last_heartbeat_iso).toBe('2026-05-22T12:00:03.000Z');
    } finally {
      env.cleanup();
    }
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

      expect(result).toMatchObject({
        acquired: true,
        lock: {
          ownerPid: replacement.ownerPid,
          packetId: replacement.packetId,
        },
        reclaimed: {
          ownerPid: deadHolder.ownerPid,
          packetId: deadHolder.packetId,
        },
      });
      expect(JSON.parse(readFileSync(lockPath, 'utf8')).packet_id).toBe('new-packet');
    });
  });

  it('reclaims a corrupt lock file instead of wedging on EEXIST', () => {
    withTempLock((lockPath) => {
      writeFileSync(lockPath, 'not json', 'utf8');

      const result = acquireLoopLock(lockPath, lockData({ packetId: 'after-corrupt' }));

      expect(result).toMatchObject({ acquired: true });
      expect(JSON.parse(readFileSync(lockPath, 'utf8'))).toMatchObject({
        owner_pid: process.pid,
        packet_id: 'after-corrupt',
      });
    });
  });

  it('allows a second run to acquire after the first holder releases', () => {
    withTempLock((lockPath) => {
      const first = lockData({ packetId: 'first' });
      const second = lockData({ packetId: 'second' });

      const firstAcquired = acquireLoopLock(lockPath, first);
      expect(firstAcquired).toMatchObject({ acquired: true });
      if (!firstAcquired.acquired) throw new Error('Expected lock acquisition');
      expect(acquireLoopLock(lockPath, second)).toMatchObject({ acquired: false });
      expect(releaseLoopLock(lockPath, process.pid, firstAcquired.lock.acquireNonce)).toBe(true);
      expect(acquireLoopLock(lockPath, second)).toMatchObject({
        acquired: true,
        lock: {
          ownerPid: second.ownerPid,
          packetId: second.packetId,
        },
      });
    });
  });

  it('does not clobber a lock reclaimed after a stale refresh read', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'loop-lock-'));
    const lockPath = join(tempDir, '.deep-loop.lock');
    let staleReadJson: string | null = null;
    vi.resetModules();
    vi.doMock('node:fs', async () => {
      const actual = await vi.importActual<typeof import('node:fs')>('node:fs');
      return {
        ...actual,
        readFileSync(path: Parameters<typeof readFileSync>[0], options?: Parameters<typeof readFileSync>[1]) {
          if (typeof path === 'string' && path === lockPath && staleReadJson !== null) {
            const result = staleReadJson;
            staleReadJson = null;
            return result;
          }
          return actual.readFileSync(path, options);
        },
      };
    });

    try {
      const loopLock = await import('../../lib/deep-loop/loop-lock.js');
      const acquired = loopLock.acquireLoopLock(lockPath, lockData({ packetId: 'packet-a' }));
      expect(acquired).toMatchObject({ acquired: true });
      if (!acquired.acquired) throw new Error('Expected lock acquisition');
      staleReadJson = readFileSync(lockPath, 'utf8');

      const replacement = lockData({
        ownerPid: process.pid + 100_000,
        packetId: 'packet-b',
      }) as LockDataWithNonce;
      replacement.acquireNonce = 'replacement-nonce';
      writeSerializedLock(lockPath, replacement);

      const refreshed = loopLock.refreshLoopLock(lockPath, process.pid, new Date('2026-05-22T12:05:00.000Z'), {
        acquireNonce: acquired.lock.acquireNonce,
      });

      expect(refreshed).toBe(false);
      expect(JSON.parse(readFileSync(lockPath, 'utf8'))).toMatchObject({
        owner_pid: replacement.ownerPid,
        packet_id: 'packet-b',
        acquire_nonce: 'replacement-nonce',
      });
    } finally {
      vi.doUnmock('node:fs');
      vi.resetModules();
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('refreshes and releases legacy locks without acquire_nonce', () => {
    withTempLock((lockPath) => {
      writeSerializedLock(lockPath, lockData({ packetId: 'legacy-packet' }), false);

      expect(refreshLoopLock(lockPath, process.pid, new Date('2026-05-22T12:04:00.000Z'))).toBe(true);
      const refreshed = JSON.parse(readFileSync(lockPath, 'utf8'));
      expect(refreshed).toMatchObject({
        owner_pid: process.pid,
        packet_id: 'legacy-packet',
        last_heartbeat_iso: '2026-05-22T12:04:00.000Z',
      });
      expect(refreshed).not.toHaveProperty('acquire_nonce');
      expect(releaseLoopLock(lockPath, process.pid)).toBe(true);
      expect(existsSync(lockPath)).toBe(false);
    });
  });

  it('rejects refresh and release of a nonce-bearing lock unless the caller nonce matches', () => {
    withTempLock((lockPath) => {
      const acquired = acquireLoopLock(lockPath, lockData({ packetId: 'nonce-packet' }));
      expect(acquired).toMatchObject({ acquired: true });
      if (!acquired.acquired) throw new Error('Expected lock acquisition');
      const acquireNonce = acquired.lock.acquireNonce;
      expect(typeof acquireNonce).toBe('string');

      // Missing nonce is rejected; the on-disk lock is left untouched.
      expect(refreshLoopLock(lockPath, process.pid, new Date('2026-05-22T12:10:00.000Z'))).toBe(false);
      // A wrong nonce is rejected too.
      expect(
        refreshLoopLock(lockPath, process.pid, new Date('2026-05-22T12:10:00.000Z'), { acquireNonce: 'wrong-nonce' }),
      ).toBe(false);
      const untouched = JSON.parse(readFileSync(lockPath, 'utf8'));
      expect(untouched.last_heartbeat_iso).toBe(acquired.lock.lastHeartbeatIso);
      expect(untouched.acquire_nonce).toBe(acquireNonce);

      // The correct nonce succeeds.
      expect(refreshLoopLock(lockPath, process.pid, new Date('2026-05-22T12:10:00.000Z'), { acquireNonce })).toBe(true);
      const refreshed = JSON.parse(readFileSync(lockPath, 'utf8'));
      expect(refreshed.last_heartbeat_iso).toBe('2026-05-22T12:10:00.000Z');
      expect(refreshed.acquire_nonce).toBe(acquireNonce);

      // Same rule applies to release: missing or wrong nonce is rejected.
      expect(releaseLoopLock(lockPath, process.pid)).toBe(false);
      expect(releaseLoopLock(lockPath, process.pid, 'wrong-nonce')).toBe(false);
      expect(existsSync(lockPath)).toBe(true);

      // The correct nonce releases the lock.
      expect(releaseLoopLock(lockPath, process.pid, acquireNonce)).toBe(true);
      expect(existsSync(lockPath)).toBe(false);
    });
  });

  it('keeps legacy nonce-less locks permissive even when a caller nonce is supplied', () => {
    withTempLock((lockPath) => {
      writeSerializedLock(lockPath, lockData({ packetId: 'legacy-with-caller-nonce' }), false);

      expect(
        refreshLoopLock(lockPath, process.pid, new Date('2026-05-22T12:11:00.000Z'), { acquireNonce: 'caller-supplied-nonce' }),
      ).toBe(true);
      const refreshed = JSON.parse(readFileSync(lockPath, 'utf8'));
      expect(refreshed.last_heartbeat_iso).toBe('2026-05-22T12:11:00.000Z');
      expect(refreshed).not.toHaveProperty('acquire_nonce');

      expect(releaseLoopLock(lockPath, process.pid, 'caller-supplied-nonce')).toBe(true);
      expect(existsSync(lockPath)).toBe(false);
    });
  });

  it('does not remove a live host-local socket while probing for stale cleanup', async () => {
    const env = createHermeticEnv('loop-lock-host-local-live-socket');
    const connectAttempts: string[] = [];
    vi.resetModules();
    vi.doMock('node:net', () => {
      class FakeServer {
        once(): this {
          return this;
        }

        off(): this {
          return this;
        }

        listen(socketPath: string, callback: () => void): this {
          writeFileSync(socketPath, 'socket', 'utf8');
          queueMicrotask(callback);
          return this;
        }

        unref(): this {
          return this;
        }

        close(callback?: () => void): this {
          callback?.();
          return this;
        }
      }

      return {
        createServer: () => new FakeServer(),
        createConnection: (socketPath: string) => {
          const socket = {
            once(event: string, listener: () => void) {
              if (event === 'connect') {
                connectAttempts.push(socketPath);
                queueMicrotask(listener);
              }
              return socket;
            },
            setTimeout() {
              return socket;
            },
            destroy() {
              return socket;
            },
          };
          return socket;
        },
      };
    });

    try {
      const firstLoopLock = await import('../../lib/deep-loop/loop-lock.js');
      const lockPath = join(env.tmpDir, '.deep-loop.lock');
      const first = await firstLoopLock.acquireLoopLock(lockPath, lockData({ packetId: 'first' }), {
        hostLocalSingleFlight: true,
      });
      const socketPath = firstLoopLock.getLoopLockHostLocalSocketPath(lockPath);

      expect(first).toMatchObject({ acquired: true });
      expect(existsSync(socketPath)).toBe(true);

      unlinkSync(lockPath);
      vi.resetModules();
      const secondLoopLock = await import('../../lib/deep-loop/loop-lock.js');
      const second = await secondLoopLock.acquireLoopLock(lockPath, lockData({ packetId: 'second' }), {
        hostLocalSingleFlight: true,
      });

      expect(second).toMatchObject({ acquired: false });
      expect(connectAttempts).toEqual([socketPath]);
      expect(existsSync(socketPath)).toBe(true);
      rmSync(socketPath, { force: true });
    } finally {
      vi.doUnmock('node:net');
      vi.resetModules();
      env.cleanup();
    }
  });
});
