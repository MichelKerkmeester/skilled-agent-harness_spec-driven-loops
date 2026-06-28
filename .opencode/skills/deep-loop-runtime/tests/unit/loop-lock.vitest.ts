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
      runtimeKind: 'cli-codex',
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
      const result = acquireLoopLock(lockPath, lockData({ runtimeKind: 'cli-codex' }));

      expect(result).toMatchObject({ acquired: true });
      const disk = JSON.parse(readFileSync(lockPath, 'utf8'));
      expect(disk).toMatchObject({
        owner_pid: process.pid,
        ttl_ms: 300_000,
        packet_id: 'packet-004',
        runtime_kind: 'cli-codex',
        phase: 'running',
      });
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
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('refreshes and releases only when the owner pid matches', () => {
    withTempLock((lockPath) => {
      acquireLoopLock(lockPath, lockData());

      expect(refreshLoopLock(lockPath, process.pid + 100_000)).toBe(false);
      expect(refreshLoopLock(lockPath, process.pid, new Date('2026-05-22T12:03:00.000Z'))).toBe(true);
      const refreshed = JSON.parse(readFileSync(lockPath, 'utf8'));
      expect(refreshed.last_heartbeat_iso).toBe('2026-05-22T12:03:00.000Z');
      expect(refreshed.last_activity_iso).toBe('2026-05-22T12:03:00.000Z');
      expect(refreshed.phase).toBe('running');

      expect(releaseLoopLock(lockPath, process.pid + 100_000)).toBe(false);
      expect(existsSync(lockPath)).toBe(true);
      expect(releaseLoopLock(lockPath, process.pid)).toBe(true);
      expect(existsSync(lockPath)).toBe(false);
    });
  });

  it('refreshes lock metadata on heartbeat cadence until stopped', () => {
    const env = createHermeticEnv('loop-lock-heartbeat');
    try {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-05-22T12:00:00.000Z'));
      const lockPath = join(env.tmpDir, '.deep-loop.lock');

      expect(acquireLoopLock(lockPath, lockData({ phase: 'paused' }))).toMatchObject({ acquired: true });
      startHeartbeat({ lockPath, ownerPid: process.pid, phase: 'paused' }, 1_000);

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
