import { EventEmitter } from 'node:events';
import { mkdtempSync, rmSync, closeSync, unlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

type ProcessRowsRunner = () => string | Array<Record<string, number>>;
type SignalFn = (pid: number, sig: number | string) => boolean;

const require = createRequire(import.meta.url);
const launcher = require('../../../../../bin/mk-spec-memory-launcher.cjs') as {
  acquireModelServerRespawnLockFile: (socketPath: string) => { acquired: boolean; fd?: number; path: string };
  buildLeaseObject: (childPid?: number | null, startedAt?: string, modelServerPid?: number | null) => Record<string, unknown>;
  createModelServerSupervisor: (options?: Record<string, unknown>) => ModelServerSupervisor;
  getModelServerWatchdogConfig: (env?: Record<string, string | undefined>, warn?: (message: string) => void) => Record<string, unknown>;
  modelServerRespawnLockPath: (socketPath: string) => string;
  startRssWatchdog: (childPid: number, options?: Record<string, unknown>) => NodeJS.Timeout;
};
const bridge = require('../../../../../bin/lib/launcher-ipc-bridge.cjs') as {
  probeModelServer: (socketPath: string, options: Record<string, unknown>) => Promise<{ status: string; reason?: string }>;
};

interface ModelServerSupervisor {
  clearTimers: () => void;
  getChild: () => FakeChild | null;
  getPid: () => number | null;
  launch: () => boolean;
  reapBeforeRespawn: (pid: number) => Promise<Record<string, unknown>>;
  reapProcessTree: (pid: number) => void;
}

class FakeChild extends EventEmitter {
  public exitCode: number | null = null;
  public signalCode: string | null = null;
  public killed = false;
  public readonly killCalls: Array<number | string> = [];

  constructor(public readonly pid: number) {
    super();
  }

  public kill(signal: number | string): boolean {
    this.killCalls.push(signal);
    this.killed = true;
    return true;
  }

  public exit(code: number | null = 1, signal: string | null = null): void {
    this.exitCode = code;
    this.signalCode = signal;
    this.emit('exit', code, signal);
  }
}

class FakeSocket extends EventEmitter {
  public destroyed = false;

  constructor(private readonly state: string | null) {
    super();
  }

  public write(): boolean {
    if (this.state === null) {
      queueMicrotask(() => this.emit('error', new Error('ECONNREFUSED')));
      return true;
    }
    const body = JSON.stringify({ state: this.state });
    const response = `HTTP/1.1 200 OK\r\ncontent-type: application/json\r\ncontent-length: ${Buffer.byteLength(body)}\r\n\r\n${body}`;
    queueMicrotask(() => {
      this.emit('data', Buffer.from(response));
      this.emit('end');
    });
    return true;
  }

  public destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.emit('close');
  }
}

function createSpawn(children: FakeChild[]) {
  return vi.fn(() => {
    const child = new FakeChild(5000 + children.length);
    children.push(child);
    return child;
  });
}

function releaseLock(lock: { acquired: boolean; fd?: number; path: string }): void {
  if (!lock.acquired) return;
  if (typeof lock.fd === 'number') closeSync(lock.fd);
  unlinkSync(lock.path);
}

describe('launcher-owned hf model server supervision', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('stays lazy until first demand calls launch', () => {
    const children: FakeChild[] = [];
    const spawnFn = createSpawn(children);
    const supervisor = launcher.createModelServerSupervisor({
      spawnFn,
      startDemandListener: false,
      writeLease: () => undefined,
      watchdogConfig: () => ({ enabled: false, maxRssMb: null, intervalMs: 1000, consecutiveBreaches: 1, graceMs: 7000 }),
    });

    expect(spawnFn).not.toHaveBeenCalled();
    expect(supervisor.getPid()).toBeNull();

    expect(supervisor.launch()).toBe(true);
    expect(spawnFn).toHaveBeenCalledWith(
      process.execPath,
      [expect.stringContaining('hf-model-server.cjs')],
      expect.objectContaining({ stdio: 'inherit' }),
    );
    expect(supervisor.getPid()).toBe(children[0].pid);
    supervisor.clearTimers();
  });

  it('relaunches and then gives up with a guard independent from the daemon guard', async () => {
    vi.useFakeTimers();
    const children: FakeChild[] = [];
    const logs: string[] = [];
    const writeLease = vi.fn();
    const supervisor = launcher.createModelServerSupervisor({
      spawnFn: createSpawn(children),
      startDemandListener: false,
      writeLease,
      log: (message: string) => logs.push(message),
      crashLoopConfig: () => ({ maxDeaths: 2, windowMs: 1000, initialBackoffMs: 25, maxBackoffMs: 100 }),
      watchdogConfig: () => ({ enabled: false, maxRssMb: null, intervalMs: 1000, consecutiveBreaches: 1, graceMs: 7000 }),
    });

    expect(supervisor.launch()).toBe(true);
    children[0].exit(1, null);
    await vi.advanceTimersByTimeAsync(25);

    expect(children).toHaveLength(2);
    children[1].exit(1, null);

    expect(logs.some((line) => line.includes('daemon remains running'))).toBe(true);
    expect(logs.some((line) => line.includes('modelServerPid removed from lease'))).toBe(true);
    expect(writeLease).toHaveBeenCalled();
    supervisor.clearTimers();
  });

  it('does not clear model-server give-up cooldown on spawn and arms it after load-crash give-up', () => {
    const children: FakeChild[] = [];
    const writeGiveUpUntil = vi.fn(() => true);
    const supervisor = launcher.createModelServerSupervisor({
      spawnFn: createSpawn(children),
      startDemandListener: false,
      writeLease: () => undefined,
      writeGiveUpUntil,
      nowMs: () => 1000,
      giveUpCooldownMs: 500,
      crashLoopConfig: () => ({ maxDeaths: 1, windowMs: 1000, initialBackoffMs: 25, maxBackoffMs: 100 }),
      watchdogConfig: () => ({ enabled: false, maxRssMb: null, intervalMs: 1000, consecutiveBreaches: 1, graceMs: 7000 }),
    });

    expect(supervisor.launch()).toBe(true);
    expect(writeGiveUpUntil).not.toHaveBeenCalled();

    children[0].exit(1, null);

    expect(writeGiveUpUntil).toHaveBeenCalledTimes(1);
    expect(writeGiveUpUntil).toHaveBeenCalledWith(1500);
    supervisor.clearTimers();
  });

  it('generalized RSS watchdog samples the model-server pid tree and uses model-server env names', async () => {
    vi.useFakeTimers();
    const snapshots: number[][] = [];
    const breaches: Record<string, unknown>[] = [];
    let timer: NodeJS.Timeout | null = null;
    const runner = vi.fn(() => `
      1 0 100
      777 1 2048
      778 777 2048
    `);

    launcher.startRssWatchdog(777, {
      config: launcher.getModelServerWatchdogConfig({
        SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB: '1',
        SPECKIT_HF_MODEL_SERVER_RSS_SELF_EXIT: '1',
        SPECKIT_LAUNCHER_RSS_WATCHDOG_INTERVAL_MS: '10',
        SPECKIT_LAUNCHER_RSS_CONSECUTIVE_BREACHES: '1',
      }),
      label: 'hf-model-server',
      runner,
      timerState: {
        get: () => timer,
        set: (nextTimer: NodeJS.Timeout | null) => {
          timer = nextTimer;
        },
      },
      snapshot: {
        set: (pids: number[]) => snapshots.push(pids),
      },
      onBreach: (config: Record<string, unknown>) => {
        breaches.push(config);
      },
    });

    await vi.advanceTimersByTimeAsync(10);

    expect(runner).toHaveBeenCalledTimes(1);
    expect(snapshots).toEqual([[778]]);
    expect(breaches).toHaveLength(1);
    expect(breaches[0]).toMatchObject({ selfExitEnv: 'SPECKIT_HF_MODEL_SERVER_RSS_SELF_EXIT' });
    if (timer) clearInterval(timer);
  });

  it('adds modelServerPid to the lease and reaps the model tree on the signal-path helper', () => {
    const lease = launcher.buildLeaseObject(111, '2026-05-29T00:00:00.000Z', 222);
    expect(lease).toMatchObject({
      childPid: 111,
      modelServerPid: 222,
      startedAt: '2026-05-29T00:00:00.000Z',
    });

    const signals: Array<[number, number | string]> = [];
    const supervisor = launcher.createModelServerSupervisor({
      startDemandListener: false,
      processRowsRunner: (() => `
        1 0 100
        222 1 1024
        223 222 2048
      `) satisfies ProcessRowsRunner,
      signal: ((pid: number, sig: number | string) => {
        if (sig === 0) return true;
        signals.push([pid, sig]);
        return true;
      }) satisfies SignalFn,
      writeLease: () => undefined,
    });

    supervisor.reapProcessTree(222);
    expect(signals).toEqual([[-223, 'SIGTERM'], [223, 'SIGTERM']]);
  });

  it('uses a socket-local hf-embed respawn lock and reaps stale model pid before replacement', async () => {
    const socketDir = mkdtempSync(join('/private/tmp', 'launcher-model-lock-'));
    const socketPath = join(socketDir, 'hf-embed.sock');
    const first = launcher.acquireModelServerRespawnLockFile(socketPath);
    const second = launcher.acquireModelServerRespawnLockFile(socketPath);

    try {
      expect(first.acquired).toBe(true);
      expect(second).toMatchObject({ acquired: false, path: launcher.modelServerRespawnLockPath(socketPath) });
    } finally {
      releaseLock(first);
      rmSync(socketDir, { recursive: true, force: true });
    }

    const signals: Array<[number, number | string]> = [];
    const supervisor = launcher.createModelServerSupervisor({
      startDemandListener: false,
      liveness: () => 'alive',
      waitForExit: vi.fn(async () => false),
      processRowsRunner: () => '333 1 1024',
      signal: (pid: number, sig: number | string) => {
        signals.push([pid, sig]);
        return true;
      },
      writeLease: () => undefined,
    });

    await supervisor.reapBeforeRespawn(333);
    expect(signals).toEqual([[333, 'SIGTERM'], [333, 'SIGKILL']]);
  });

  it('probeModelServer treats ready/loading as alive and error/connect failure as dead', async () => {
    const connectForState = (state: string | null) => () => {
      const socket = new FakeSocket(state);
      queueMicrotask(() => socket.emit('connect'));
      return socket;
    };

    await expect(bridge.probeModelServer('tcp://127.0.0.1:65535', {
      connect: connectForState('ready'),
      timeoutMs: 100,
    })).resolves.toMatchObject({ status: 'alive', reason: 'health-ready' });
    await expect(bridge.probeModelServer('tcp://127.0.0.1:65535', {
      connect: connectForState('loading'),
      timeoutMs: 100,
    })).resolves.toMatchObject({ status: 'alive', reason: 'health-loading' });
    await expect(bridge.probeModelServer('tcp://127.0.0.1:65535', {
      connect: connectForState('error'),
      timeoutMs: 100,
    })).resolves.toMatchObject({ status: 'dead', reason: 'health-error' });
    await expect(bridge.probeModelServer('tcp://127.0.0.1:65535', {
      connect: connectForState(null),
      timeoutMs: 100,
    })).resolves.toMatchObject({ status: 'dead' });
  });
});
