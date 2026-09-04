import { EventEmitter } from 'node:events';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const mss = require('../../../../../bin/lib/model-server-supervision.cjs') as {
  HF_MODEL_SERVER_PID_FILE_NAME: string;
  createModelServerControl: (deps?: Record<string, unknown>) => {
    startDemandListener: (options?: Record<string, unknown>) => Promise<Record<string, unknown>>;
    stopDemandListener: () => Promise<void>;
    clearTimers: () => void;
  };
  getModelServerIdleConfig: (env?: Record<string, string | undefined>) => { enabled: boolean; timeoutMs: number };
};

class FakeChild extends EventEmitter {
  public exitCode: number | null = null;
  public signalCode: string | null = null;
  public readonly killCalls: Array<number | string> = [];

  constructor(public readonly pid: number) {
    super();
  }

  public kill(signal: number | string): boolean {
    this.killCalls.push(signal);
    return true;
  }
}

function createPidAccessors(socketPath: string) {
  const pidPath = join(dirname(socketPath), mss.HF_MODEL_SERVER_PID_FILE_NAME);
  return {
    path: pidPath,
    write: vi.fn((pid: number | null) => {
      if (!Number.isInteger(pid) || pid <= 0) {
        try {
          unlinkSync(pidPath);
        } catch {
          // Cleared is the desired state.
        }
        return;
      }
      mkdirSync(dirname(pidPath), { recursive: true, mode: 0o700 });
      const tmp = `${pidPath}.tmp.${process.pid}`;
      writeFileSync(tmp, JSON.stringify({ pid }, null, 2), { mode: 0o600 });
      renameSync(tmp, pidPath);
    }),
    read: vi.fn(() => {
      try {
        const parsed = JSON.parse(readFileSync(pidPath, 'utf8')) as { pid?: unknown };
        return Number.isInteger(parsed.pid) && Number(parsed.pid) > 0 ? Number(parsed.pid) : null;
      } catch {
        return null;
      }
    }),
  };
}

function createFakeHttpServerHarness() {
  const handlers: Array<(request: { url: string; method: string }, response: {
    writeHead: (statusCode: number, headers: Record<string, unknown>) => void;
    end: (body: string) => void;
  }) => void> = [];
  const listenCalls: string[] = [];
  return {
    handlers,
    listenCalls,
    createServer(handler: (request: { url: string; method: string }, response: {
      writeHead: (statusCode: number, headers: Record<string, unknown>) => void;
      end: (body: string) => void;
    }) => void) {
      handlers.push(handler);
      const server = new EventEmitter() as EventEmitter & {
        listen: (socketPath: string) => void;
        close: (callback?: () => void) => void;
      };
      server.listen = (socketPath: string) => {
        listenCalls.push(socketPath);
        writeFileSync(socketPath, 'fake-bound-socket', 'utf8');
        queueMicrotask(() => server.emit('listening'));
      };
      server.close = (callback?: () => void) => {
        queueMicrotask(() => callback?.());
      };
      return server;
    },
  };
}

function invokeDemand(handler: ReturnType<typeof createFakeHttpServerHarness>['handlers'][number]): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    handler(
      { url: '/api/health', method: 'GET' },
      {
        writeHead() {
          // Status is covered in the existing cross-launcher tests.
        },
        end(body) {
          resolve(JSON.parse(body) as Record<string, unknown>);
        },
      },
    );
  });
}

async function flushAsyncWork(): Promise<void> {
  for (let attempt = 0; attempt < 10; attempt++) {
    await Promise.resolve();
  }
}

describe('hf model server idle eviction', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    vi.restoreAllMocks();
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  function tempDir(prefix: string): string {
    const dir = mkdtempSync(join('/private/tmp', prefix));
    tempDirs.push(dir);
    return dir;
  }

  it('parses fractional idle minutes and stays disabled by default', () => {
    expect(mss.getModelServerIdleConfig({})).toMatchObject({ enabled: false, timeoutMs: 0 });
    expect(mss.getModelServerIdleConfig({ SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN: '0.001' })).toMatchObject({
      enabled: true,
      timeoutMs: 60,
    });
    expect(mss.getModelServerIdleConfig({ SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN: '0' })).toMatchObject({ enabled: false });
  });

  it('evicts only after a successful idle embed and re-arms the lazy demand listener', async () => {
    const socketDir = tempDir('hf-idle-evict-');
    const socketPath = join(socketDir, 'hf-embed.sock');
    const pidAccessors = createPidAccessors(socketPath);
    const serverHarness = createFakeHttpServerHarness();
    const intervalCallbacks: Array<() => void> = [];
    const clearIntervalFn = vi.fn();
    const child = new FakeChild(8101);
    const bridge = {
      probeModelServer: vi.fn(async () => ({
        status: 'alive',
        reason: 'health-ready',
        health: { lastSuccessfulEmbedAt: 1000, inFlight: 0 },
      })),
    };
    const control = mss.createModelServerControl({
      log: () => undefined,
      env: { SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN: '0.001' },
      dbDir: () => socketDir,
      bridge,
      spawnFn: vi.fn(() => child),
      writeModelServerPid: pidAccessors.write,
      readModelServerPid: pidAccessors.read,
      httpCreateServer: serverHarness.createServer,
      setInterval: (callback: () => void, timeoutMs: number) => {
        expect(timeoutMs).toBe(60);
        intervalCallbacks.push(callback);
        return { unref: vi.fn() };
      },
      clearInterval: clearIntervalFn,
      processRowsRunner: () => `${child.pid} 1 1024`,
      nowMs: () => 1061,
      watchdogConfig: () => ({ enabled: false, maxRssMb: null, intervalMs: 1000, consecutiveBreaches: 1, graceMs: 7000 }),
    });

    await expect(control.startDemandListener({ socketPath })).resolves.toMatchObject({ started: true, socketPath });
    expect(intervalCallbacks).toHaveLength(1);
    await expect(invokeDemand(serverHarness.handlers[0])).resolves.toMatchObject({ modelServerLaunchRequested: true });
    expect(pidAccessors.read()).toBe(child.pid);

    intervalCallbacks[0]();
    await flushAsyncWork();

    expect(bridge.probeModelServer).toHaveBeenCalledWith(socketPath, { timeoutMs: 1000 });
    expect(pidAccessors.write).toHaveBeenLastCalledWith(null);
    expect(pidAccessors.read()).toBeNull();
    expect(serverHarness.handlers).toHaveLength(2);
    expect(serverHarness.listenCalls).toEqual([socketPath, socketPath]);
    control.clearTimers();
    await control.stopDemandListener();
    expect(clearIntervalFn).toHaveBeenCalled();
  });

  it('never evicts on unsafe probe health', async () => {
    const socketDir = tempDir('hf-idle-safe-');
    const socketPath = join(socketDir, 'hf-embed.sock');
    const pidAccessors = createPidAccessors(socketPath);
    const serverHarness = createFakeHttpServerHarness();
    const intervalCallbacks: Array<() => void> = [];
    const child = new FakeChild(8201);
    const control = mss.createModelServerControl({
      log: () => undefined,
      env: { SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN: '0.001' },
      dbDir: () => socketDir,
      bridge: {
        probeModelServer: vi.fn(async () => ({
          status: 'alive',
          reason: 'health-ready',
          health: { lastSuccessfulEmbedAt: 1000, inFlight: 1 },
        })),
      },
      spawnFn: vi.fn(() => child),
      writeModelServerPid: pidAccessors.write,
      readModelServerPid: pidAccessors.read,
      httpCreateServer: serverHarness.createServer,
      setInterval: (callback: () => void) => {
        intervalCallbacks.push(callback);
        return { unref: vi.fn() };
      },
      clearInterval: vi.fn(),
      nowMs: () => 2000,
      watchdogConfig: () => ({ enabled: false, maxRssMb: null, intervalMs: 1000, consecutiveBreaches: 1, graceMs: 7000 }),
    });

    await control.startDemandListener({ socketPath });
    await invokeDemand(serverHarness.handlers[0]);
    intervalCallbacks[0]();
    await flushAsyncWork();

    expect(pidAccessors.read()).toBe(child.pid);
    expect(pidAccessors.write).not.toHaveBeenCalledWith(null);
    expect(serverHarness.handlers).toHaveLength(1);
    expect(existsSync(pidAccessors.path)).toBe(true);
    control.clearTimers();
    await control.stopDemandListener();
  });
});
