// ───────────────────────────────────────────────────────────────────
// MODULE: Model Server Idle Eviction
// ───────────────────────────────────────────────────────────────────
import { tmpdir } from 'node:os';
import { EventEmitter } from 'node:events';
import { realpathSync, existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

// A short, real temp root. Unix socket paths are capped near 104 bytes, so the
// platform tmpdir (deep under /var/folders on macOS) is too long; /tmp resolves to
// /private/tmp on macOS and to itself on Linux, which is what the socket checks need.
const TMP_ROOT = realpathSync(process.platform === 'win32' ? tmpdir() : '/tmp');

const require = createRequire(import.meta.url);
const mss = require('../../../../../bin/lib/model-server-supervision.cjs') as {
  HF_MODEL_SERVER_PID_FILE_NAME: string;
  HF_MODEL_SERVER_RESPAWN_LOCK_FILE_NAME: string;
  createModelServerControl: (deps?: Record<string, unknown>) => {
    startDemandListener: (options?: Record<string, unknown>) => Promise<Record<string, unknown>>;
    stopDemandListener: () => Promise<void>;
    clearTimers: () => void;
    reapRecordedBeforeRespawn: (socketPath: string, options?: Record<string, unknown>) => Promise<Record<string, unknown>>;
  };
  getModelServerIdleConfig: (env?: Record<string, string | undefined>) => { enabled: boolean; timeoutMs: number };
  readProcessCommand: (pid: number) => string | null;
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
    const dir = mkdtempSync(join(TMP_ROOT, prefix));
    tempDirs.push(dir);
    return dir;
  }

  function createOrphanDemandHarness(options: {
    parentPid?: number | null;
    command?: string | null;
    commandSequence?: Array<string | null>;
    env?: Record<string, string | undefined>;
    liveness?: (pid: number) => 'alive' | 'dead' | 'unknown-eperm';
    probeReason?: string;
    waitForExit?: (pid: number, timeoutMs: number) => Promise<boolean>;
  } = {}) {
    const socketDir = tempDir('hf-orphan-reap-');
    const socketPath = join(socketDir, 'hf-embed.sock');
    const pid = 8301;
    const pidAccessors = createPidAccessors(socketPath);
    pidAccessors.write(pid);
    writeFileSync(socketPath, 'existing model server socket', 'utf8');
    const serverHarness = createFakeHttpServerHarness();
    const commandSequence = [...(options.commandSequence || [])];
    const getCommand = vi.fn(() => {
      if (commandSequence.length > 0) return commandSequence.shift() ?? null;
      return options.command === undefined ? '/usr/bin/node /tmp/hf-model-server.cjs' : options.command;
    });
    const getParentPid = vi.fn(() => (options.parentPid === undefined ? 1 : options.parentPid));
    const signal = vi.fn(() => true);
    const writeGiveUpUntil = vi.fn();
    const log = vi.fn();
    const control = mss.createModelServerControl({
      log,
      env: options.env || {},
      dbDir: () => socketDir,
      bridge: {
        probeModelServer: vi.fn(async () => ({ status: 'alive', reason: options.probeReason || 'health-ready' })),
      },
      writeModelServerPid: pidAccessors.write,
      readModelServerPid: pidAccessors.read,
      writeGiveUpUntil,
      getParentPid,
      getCommand,
      liveness: options.liveness || (() => 'alive'),
      signal,
      processRowsRunner: () => '',
      waitForExit: options.waitForExit || (async () => true),
      httpCreateServer: serverHarness.createServer,
    });

    return { control, getCommand, getParentPid, log, pid, pidAccessors, signal, socketDir, socketPath, serverHarness, writeGiveUpUntil };
  }

  it('defaults to ten minutes and handles invalid or disabled idle timeout values', () => {
    expect(mss.getModelServerIdleConfig({})).toMatchObject({ enabled: true, timeoutMs: 600000 });
    expect(mss.getModelServerIdleConfig({ SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN: '' })).toMatchObject({
      enabled: true,
      timeoutMs: 600000,
    });
    expect(mss.getModelServerIdleConfig({ SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN: 'abc' })).toMatchObject({
      enabled: true,
      timeoutMs: 600000,
    });
    expect(mss.getModelServerIdleConfig({ SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN: '0.001' })).toMatchObject({
      enabled: true,
      timeoutMs: 60,
    });
    expect(mss.getModelServerIdleConfig({ SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN: '0' })).toMatchObject({
      enabled: false,
      timeoutMs: 0,
    });
    expect(mss.getModelServerIdleConfig({ SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN: '-5' })).toMatchObject({
      enabled: false,
      timeoutMs: 0,
    });
  });

  it('reads a command string for the current Node process', () => {
    const command = mss.readProcessCommand(process.pid);

    expect(typeof command).toBe('string');
    expect(command?.toLowerCase()).toContain('node');
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

  it('reaps an orphaned model server, listens for demand, and does not arm give-up cooldown', async () => {
    const liveness = vi.fn()
      .mockReturnValueOnce('alive')
      .mockReturnValueOnce('alive')
      .mockReturnValue('dead');
    const harness = createOrphanDemandHarness({ probeReason: 'socket-alive', liveness });

    await expect(harness.control.startDemandListener({ socketPath: harness.socketPath })).resolves.toMatchObject({
      started: true,
      socketPath: harness.socketPath,
    });

    expect(harness.getParentPid).toHaveBeenCalledWith(harness.pid);
    expect(harness.getCommand).toHaveBeenCalledTimes(2);
    expect(harness.signal).toHaveBeenCalledWith(harness.pid, 'SIGTERM');
    expect(harness.serverHarness.listenCalls).toEqual([harness.socketPath]);
    expect(harness.log).toHaveBeenCalledWith(expect.stringContaining('orphaned model server (parent PID 1) is being reaped'));
    expect(harness.log).toHaveBeenCalledWith(expect.stringContaining(`reaping orphaned hf-model-server pid ${harness.pid} (parent PID 1)`));
    expect(harness.pidAccessors.write).toHaveBeenLastCalledWith(null);
    expect(harness.pidAccessors.read()).toBeNull();
    expect(harness.writeGiveUpUntil).toHaveBeenCalledWith(null, expect.any(String));
    expect(harness.writeGiveUpUntil).not.toHaveBeenCalledWith(expect.any(Number));
    await harness.control.stopDemandListener();
  });

  it('does not signal when the recorded pid changes after the command re-check', async () => {
    const harness = createOrphanDemandHarness({ probeReason: 'socket-alive' });
    harness.getCommand.mockImplementation(() => {
      if (harness.getCommand.mock.calls.length === 2) harness.pidAccessors.write(harness.pid + 1);
      return '/usr/bin/node /tmp/hf-model-server.cjs';
    });

    await expect(harness.control.startDemandListener({ socketPath: harness.socketPath })).resolves.toMatchObject({
      started: false,
      reason: 'model-server-alive',
    });

    expect(harness.pidAccessors.read()).toBe(harness.pid + 1);
    expect(harness.signal).not.toHaveBeenCalled();
    expect(existsSync(harness.socketPath)).toBe(true);
    expect(harness.log).toHaveBeenCalledWith(expect.stringContaining('recorded pid changed'));
    await expect(harness.control.reapRecordedBeforeRespawn(harness.socketPath, { expectedPid: harness.pid })).resolves.toMatchObject({
      allowed: false,
      reason: 'model-server-pid-changed',
    });
    expect(harness.signal).not.toHaveBeenCalled();
    await harness.control.stopDemandListener();
  });

  it('does not reap an orphan candidate whose recorded pid is already dead', async () => {
    const harness = createOrphanDemandHarness({
      liveness: () => 'dead',
      probeReason: 'socket-alive',
    });

    await expect(harness.control.startDemandListener({ socketPath: harness.socketPath })).resolves.toMatchObject({
      started: false,
      reason: 'model-server-alive',
    });

    expect(harness.getParentPid).not.toHaveBeenCalled();
    expect(harness.getCommand).not.toHaveBeenCalled();
    expect(harness.signal).not.toHaveBeenCalled();
    expect(existsSync(harness.socketPath)).toBe(true);
    await harness.control.stopDemandListener();
  });

  it('keeps the socket when the pid stays alive after SIGKILL', async () => {
    const harness = createOrphanDemandHarness({
      liveness: () => 'alive',
      probeReason: 'socket-alive',
      waitForExit: async () => false,
    });

    await expect(harness.control.startDemandListener({ socketPath: harness.socketPath })).resolves.toMatchObject({
      started: false,
      reason: 'model-server-alive',
    });

    expect(harness.signal).toHaveBeenNthCalledWith(1, harness.pid, 'SIGTERM');
    expect(harness.signal).toHaveBeenNthCalledWith(2, harness.pid, 'SIGKILL');
    expect(existsSync(harness.socketPath)).toBe(true);
    expect(harness.serverHarness.listenCalls).toEqual([]);
    expect(harness.pidAccessors.write).not.toHaveBeenCalledWith(null);
    expect(harness.writeGiveUpUntil).not.toHaveBeenCalledWith(null, expect.any(String));
    expect(existsSync(join(harness.socketDir, mss.HF_MODEL_SERVER_RESPAWN_LOCK_FILE_NAME))).toBe(false);
    await harness.control.stopDemandListener();
  });

  it('backs off without signalling when orphan reaping is disabled', async () => {
    const harness = createOrphanDemandHarness({
      env: { SPECKIT_HF_MODEL_SERVER_ORPHAN_REAP: '0' },
      probeReason: 'socket-alive',
    });

    await expect(harness.control.startDemandListener({ socketPath: harness.socketPath })).resolves.toMatchObject({
      started: false,
      reason: 'model-server-alive',
    });

    expect(harness.getParentPid).not.toHaveBeenCalled();
    expect(harness.getCommand).not.toHaveBeenCalled();
    expect(harness.signal).not.toHaveBeenCalled();
    expect(existsSync(harness.socketPath)).toBe(true);
    await harness.control.stopDemandListener();
  });

  it('does not reap a model server owned by a live launcher', async () => {
    const harness = createOrphanDemandHarness({ parentPid: 8200 });

    await expect(harness.control.startDemandListener({ socketPath: harness.socketPath })).resolves.toMatchObject({
      started: false,
      reason: 'model-server-alive',
    });

    expect(harness.signal).not.toHaveBeenCalled();
    expect(harness.serverHarness.listenCalls).toEqual([]);
    await harness.control.stopDemandListener();
  });

  it('does not reap a recorded pid running a different command', async () => {
    const harness = createOrphanDemandHarness({ command: '/usr/bin/node /tmp/other-server.cjs' });

    await expect(harness.control.startDemandListener({ socketPath: harness.socketPath })).resolves.toMatchObject({
      started: false,
      reason: 'model-server-alive',
    });

    expect(harness.getCommand).toHaveBeenCalledTimes(1);
    expect(harness.signal).not.toHaveBeenCalled();
    expect(harness.serverHarness.listenCalls).toEqual([]);
    await harness.control.stopDemandListener();
  });

  it('does not reap when the recorded pid parent cannot be read', async () => {
    const harness = createOrphanDemandHarness({ parentPid: null });

    await expect(harness.control.startDemandListener({ socketPath: harness.socketPath })).resolves.toMatchObject({
      started: false,
      reason: 'model-server-alive',
    });

    expect(harness.getCommand).not.toHaveBeenCalled();
    expect(harness.signal).not.toHaveBeenCalled();
    expect(harness.serverHarness.listenCalls).toEqual([]);
    await harness.control.stopDemandListener();
  });

  it('does not reap when the recorded pid command cannot be read', async () => {
    const harness = createOrphanDemandHarness({ command: null });

    await expect(harness.control.startDemandListener({ socketPath: harness.socketPath })).resolves.toMatchObject({
      started: false,
      reason: 'model-server-alive',
    });

    expect(harness.signal).not.toHaveBeenCalled();
    expect(harness.serverHarness.listenCalls).toEqual([]);
    await harness.control.stopDemandListener();
  });

  it('re-checks the recorded pid command before reaping and releases the lock on mismatch', async () => {
    const harness = createOrphanDemandHarness({
      commandSequence: [
        '/usr/bin/node /tmp/hf-model-server.cjs',
        '/usr/bin/node /tmp/other-server.cjs',
      ],
    });

    await expect(harness.control.startDemandListener({ socketPath: harness.socketPath })).resolves.toMatchObject({
      started: false,
      reason: 'model-server-alive',
    });

    expect(harness.getCommand).toHaveBeenCalledTimes(2);
    expect(harness.signal).not.toHaveBeenCalled();
    expect(harness.serverHarness.listenCalls).toEqual([]);
    expect(existsSync(harness.socketPath)).toBe(true);
    expect(harness.log).toHaveBeenCalledWith(expect.stringContaining('orphan reap aborted'));
    expect(existsSync(join(harness.socketDir, mss.HF_MODEL_SERVER_RESPAWN_LOCK_FILE_NAME))).toBe(false);
    await harness.control.stopDemandListener();
  });
});
