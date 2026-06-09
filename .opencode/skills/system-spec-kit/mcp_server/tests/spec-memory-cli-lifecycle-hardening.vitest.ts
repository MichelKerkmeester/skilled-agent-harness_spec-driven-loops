// -----------------------------------------------------------------------------
// MODULE: Spec Memory CLI Lifecycle Hardening Tests
// -----------------------------------------------------------------------------

import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

interface ProbeResult {
  readonly status: 'alive' | 'dead';
  readonly reason?: string;
}

interface BridgeModule {
  readonly probeLeaseHolderWithRetries: (socketPath: string, options?: {
    readonly probe?: (socketPath: string, options: { readonly timeoutMs?: number; readonly deepProbe?: boolean }) => ProbeResult | Promise<ProbeResult>;
    readonly firstTimeoutMs?: number;
    readonly retryTimeoutMs?: number;
    readonly retryBackoffMs?: number;
    readonly attempts?: number;
    readonly sleepFn?: (ms: number) => Promise<void>;
    readonly onRetry?: (attempt: number, totalAttempts: number, result: ProbeResult) => void;
  }) => Promise<ProbeResult>;
  readonly resolveLeaseProbeAttempts: (env?: Record<string, string | undefined>) => number;
}

interface RespawnLock {
  readonly acquired: boolean;
  readonly fd?: number;
  readonly path: string;
  readonly reason?: string;
}

interface SupervisionModule {
  readonly acquireRespawnLockFileAt: (lockPath: string, label?: string, options?: { readonly liveness?: (pid: number) => string }) => RespawnLock;
  readonly releaseRespawnLockFile: (lock: RespawnLock) => void;
}

interface FakeChild {
  readonly pid: number;
  exitCode: number | null;
  signalCode: NodeJS.Signals | null;
  readonly kill: (signal: NodeJS.Signals) => boolean;
}

interface LauncherModule {
  readonly daemonReelectionEnabled: (env?: Record<string, string | undefined>) => boolean;
  readonly recycleDaemonInPlace: (graceMs: number, deps?: {
    readonly getContextChild?: () => FakeChild | null;
    readonly hfControl?: {
      readonly clearTimers: () => void;
      readonly stopDemandListener: () => Promise<void>;
      readonly getChild: () => FakeChild | null;
      readonly reapProcessTree: (pid: number) => void;
    };
    readonly isChildRunning?: (child: FakeChild | null) => boolean;
    readonly waitForChildExit?: (child: FakeChild, graceMs: number) => Promise<boolean>;
    readonly clearLease?: () => void;
    readonly clearWatchdog?: () => void;
    readonly isRecycleInProgress?: () => boolean;
    readonly setRecycleInProgress?: (value: boolean) => void;
    readonly log?: (message: string) => void;
  }) => Promise<void>;
}

interface RuntimeScope {
  readonly rootDir: string;
  readonly socketDir: string;
  readonly memoryDbPath: string;
}

const bridge = require('../../../../bin/lib/launcher-ipc-bridge.cjs') as BridgeModule;
const supervision = require('../../../../bin/lib/model-server-supervision.cjs') as SupervisionModule;
const launcher = require('../../../../bin/mk-spec-memory-launcher.cjs') as LauncherModule;

const tempDirs: string[] = [];
const originalEnv = new Map<string, string | undefined>();
for (const key of ['SPECKIT_IPC_SOCKET_DIR', 'SPECKIT_DAEMON_REELECTION', 'MEMORY_DB_PATH', 'SPECKIT_LEASE_PROBE_RETRIES']) {
  originalEnv.set(key, process.env[key]);
}

function restoreEnv(): void {
  for (const [key, value] of originalEnv) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function createRuntimeScope(): RuntimeScope {
  const rootDir = mkdtempSync(join(tmpdir(), 'spec-memory-lifecycle-'));
  const socketDir = join(rootDir, 'ipc');
  mkdirSync(socketDir, { recursive: true, mode: 0o700 });
  tempDirs.push(rootDir);
  process.env.SPECKIT_IPC_SOCKET_DIR = socketDir;
  process.env.SPECKIT_DAEMON_REELECTION = '0';
  process.env.MEMORY_DB_PATH = join(rootDir, 'memory.sqlite');
  return { rootDir, socketDir, memoryDbPath: process.env.MEMORY_DB_PATH };
}

function cleanup(): void {
  restoreEnv();
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
}

afterEach(() => {
  cleanup();
});

afterAll(() => {
  cleanup();
});

describe('spec-memory CLI lifecycle hardening', () => {
  it('requires consecutive deep-probe failures before an idle reap can respawn', async () => {
    createRuntimeScope();
    process.env.SPECKIT_LEASE_PROBE_RETRIES = '2';
    const attempts = bridge.resolveLeaseProbeAttempts(process.env);
    const seenProbeOptions: Array<{ readonly timeoutMs?: number; readonly deepProbe?: boolean }> = [];
    const retries: Array<{ readonly attempt: number; readonly totalAttempts: number; readonly reason?: string }> = [];
    const results: ProbeResult[] = [
      { status: 'dead', reason: 'first-miss' },
      { status: 'dead', reason: 'second-miss' },
      { status: 'alive', reason: 'json-rpc-reply' },
    ];

    const result = await bridge.probeLeaseHolderWithRetries('unused.sock', {
      attempts,
      firstTimeoutMs: 500,
      retryTimeoutMs: 25,
      retryBackoffMs: 1,
      probe: (_socketPath, options) => {
        seenProbeOptions.push(options);
        return results.shift() ?? { status: 'dead', reason: 'exhausted' };
      },
      sleepFn: async () => undefined,
      onRetry: (attempt, totalAttempts, probeResult) => retries.push({ attempt, totalAttempts, reason: probeResult.reason }),
    });

    expect(launcher.daemonReelectionEnabled(process.env)).toBe(false);
    expect(attempts).toBe(3);
    expect(result.status).toBe('alive');
    expect(seenProbeOptions).toHaveLength(3);
    expect(seenProbeOptions.every((options) => options.deepProbe === true)).toBe(true);
    expect(retries.map((retry) => retry.reason)).toEqual(['first-miss', 'second-miss']);
  });

  it('serializes idle reap respawn attempts with the respawn lock after all probes fail', async () => {
    const scope = createRuntimeScope();
    process.env.SPECKIT_LEASE_PROBE_RETRIES = '1';
    const attempts = bridge.resolveLeaseProbeAttempts(process.env);
    const result = await bridge.probeLeaseHolderWithRetries('unused.sock', {
      attempts,
      retryBackoffMs: 1,
      probe: () => ({ status: 'dead', reason: 'closed-before-reply' }),
      sleepFn: async () => undefined,
    });
    const lockPath = join(scope.rootDir, 'respawn.lock');
    const first = supervision.acquireRespawnLockFileAt(lockPath, 'respawn', { liveness: () => 'alive' });
    const second = supervision.acquireRespawnLockFileAt(lockPath, 'respawn', { liveness: () => 'alive' });

    try {
      expect(launcher.daemonReelectionEnabled(process.env)).toBe(false);
      expect(result.status).toBe('dead');
      expect(first.acquired).toBe(true);
      expect(second.acquired).toBe(false);
    } finally {
      supervision.releaseRespawnLockFile(first);
      supervision.releaseRespawnLockFile(second);
    }

    const third = supervision.acquireRespawnLockFileAt(lockPath, 'respawn', { liveness: () => 'alive' });
    try {
      expect(third.acquired).toBe(true);
    } finally {
      supervision.releaseRespawnLockFile(third);
    }
  });

  it('transparent recycle sends SIGTERM without clearing the daemon lease', async () => {
    createRuntimeScope();
    const signals: NodeJS.Signals[] = [];
    const child: FakeChild = {
      pid: 4242,
      exitCode: null,
      signalCode: null,
      kill(signal: NodeJS.Signals): boolean {
        signals.push(signal);
        this.signalCode = signal;
        return true;
      },
    };
    let clearLeaseCalls = 0;
    let recycleInProgress = false;

    await launcher.recycleDaemonInPlace(25, {
      getContextChild: () => child,
      hfControl: {
        clearTimers: () => undefined,
        stopDemandListener: async () => undefined,
        getChild: () => null,
        reapProcessTree: () => undefined,
      },
      isChildRunning: (candidate) => Boolean(candidate && candidate.exitCode === null),
      waitForChildExit: async (candidate) => {
        candidate.exitCode = 0;
        return true;
      },
      clearLease: () => {
        clearLeaseCalls += 1;
      },
      clearWatchdog: () => undefined,
      isRecycleInProgress: () => recycleInProgress,
      setRecycleInProgress: (value) => {
        recycleInProgress = value;
      },
      log: () => undefined,
    });

    expect(signals).toEqual(['SIGTERM']);
    expect(clearLeaseCalls).toBe(0);
    expect(recycleInProgress).toBe(true);
  });
});
