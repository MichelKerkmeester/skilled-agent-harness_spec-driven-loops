import { EventEmitter } from 'node:events';
import { closeSync, existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const mss = require('../../../../../bin/lib/model-server-supervision.cjs') as typeof import('../../../../../bin/lib/model-server-supervision.cjs');
const launcher = require('../../../../../bin/mk-spec-memory-launcher.cjs') as {
  acquireModelServerRespawnLockFile: (socketPath: string) => { acquired: boolean; fd?: number; path: string };
  modelServerRespawnLockPath: (socketPath: string) => string;
  resolveModelServerSocketPath: (env?: Record<string, string | undefined>, options?: { dbDir?: string }) => string;
};

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

function createSpawn(children: FakeChild[]) {
  return vi.fn(() => {
    const child = new FakeChild(7000 + children.length);
    children.push(child);
    return child;
  });
}

function releaseLock(lock: { acquired: boolean; fd?: number; path: string }): void {
  if (!lock.acquired) return;
  if (typeof lock.fd === 'number') closeSync(lock.fd);
  unlinkSync(lock.path);
}

function createPidAccessors(socketPath: string, ownerLauncher: string) {
  const normalizedPidPath = join(socketPath.startsWith('tcp://') ? '/private/tmp' : dirname(socketPath), mss.HF_MODEL_SERVER_PID_FILE_NAME);
  return {
    path: normalizedPidPath,
    write(pid: number | null): void {
      if (!Number.isInteger(pid) || pid <= 0) {
        try {
          unlinkSync(normalizedPidPath);
        } catch {
          // Missing pid file is the desired cleared state.
        }
        return;
      }
      mkdirSync(dirname(normalizedPidPath), { recursive: true, mode: 0o700 });
      const tmp = `${normalizedPidPath}.tmp.${process.pid}`;
      writeFileSync(tmp, JSON.stringify({
        pid,
        startedAt: new Date().toISOString(),
        ownerLauncher,
        socketPath,
      }, null, 2), { mode: 0o600 });
      renameSync(tmp, normalizedPidPath);
    },
    read(): number | null {
      try {
        const parsed = JSON.parse(readFileSync(normalizedPidPath, 'utf8')) as { pid?: unknown };
        return Number.isInteger(parsed.pid) && Number(parsed.pid) > 0 ? Number(parsed.pid) : null;
      } catch {
        return null;
      }
    },
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

function invokeDemand(handler: ReturnType<typeof createFakeHttpServerHarness>['handlers'][number]): Promise<{
  statusCode: number;
  body: Record<string, unknown>;
}> {
  return new Promise((resolve) => {
    let statusCode = 0;
    handler(
      { url: '/api/health', method: 'GET' },
      {
        writeHead(nextStatusCode) {
          statusCode = nextStatusCode;
        },
        end(body) {
          resolve({ statusCode, body: JSON.parse(body) as Record<string, unknown> });
        },
      },
    );
  });
}

describe('cross-launcher hf model server supervision', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    vi.useRealTimers();
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

  it('resolves the shared model-server socket with mk-spec-memory precedence', () => {
    const systemSpecKitDbDir = tempDir('system-spec-kit-db-');
    const defaultFromLib = mss.resolveModelServerSocketPath({}, { dbDir: systemSpecKitDbDir });
    const defaultFromLauncher = launcher.resolveModelServerSocketPath({}, { dbDir: systemSpecKitDbDir });

    expect(defaultFromLib).toBe(defaultFromLauncher);
    expect(defaultFromLib).toBe(join(systemSpecKitDbDir, 'hf-embed.sock'));
    expect(mss.resolveModelServerSocketPath({ HF_EMBED_SERVER_URL: 'http://127.0.0.1:31337', SPECKIT_IPC_SOCKET_DIR: '/tmp/ignored' }, { dbDir: systemSpecKitDbDir })).toBe('tcp://127.0.0.1:31337');
    expect(mss.resolveModelServerSocketPath({ SPECKIT_IPC_SOCKET_DIR: 'tcp://127.0.0.1:41414' }, { dbDir: systemSpecKitDbDir })).toBe('tcp://127.0.0.1:41414');
    expect(mss.resolveModelServerSocketPath({ SPECKIT_IPC_SOCKET_DIR: '/tmp/shared-hf' }, { dbDir: systemSpecKitDbDir })).toBe('/tmp/shared-hf/hf-embed.sock');
  });

  it('lets one launcher own the socket-keyed demand listener and spawn once', async () => {
    const socketDir = tempDir('hf-cross-single-winner-');
    const socketPath = join(socketDir, 'hf-embed.sock');
    const lockPath = launcher.modelServerRespawnLockPath(socketPath);
    const children: FakeChild[] = [];
    const spawnFn = createSpawn(children);
    const bridge = { probeModelServer: vi.fn(async () => ({ status: 'dead', reason: 'test-dead' })) };
    const pidAccessors = createPidAccessors(socketPath, 'test');
    const serverHarness = createFakeHttpServerHarness();

    const first = mss.createModelServerControl({
      log: () => undefined,
      env: {},
      rootDir: process.cwd(),
      opencodeDir: join(process.cwd(), '.opencode'),
      dbDir: () => socketDir,
      bridge,
      spawnFn,
      writeModelServerPid: pidAccessors.write,
      readModelServerPid: pidAccessors.read,
      httpCreateServer: serverHarness.createServer,
      watchdogConfig: () => ({ enabled: false, maxRssMb: null, intervalMs: 1000, consecutiveBreaches: 1, graceMs: 7000 }),
    });
    const second = mss.createModelServerControl({
      log: () => undefined,
      env: {},
      rootDir: process.cwd(),
      opencodeDir: join(process.cwd(), '.opencode'),
      dbDir: () => socketDir,
      bridge,
      spawnFn,
      writeModelServerPid: pidAccessors.write,
      readModelServerPid: pidAccessors.read,
      httpCreateServer: serverHarness.createServer,
      watchdogConfig: () => ({ enabled: false, maxRssMb: null, intervalMs: 1000, consecutiveBreaches: 1, graceMs: 7000 }),
    });

    const firstStart = await first.startDemandListener({ socketPath });
    const secondStart = await second.startDemandListener({ socketPath });
    expect(firstStart).toMatchObject({ started: true, socketPath });
    expect(secondStart).toMatchObject({ started: false, reason: 'model-server-respawn-lock-held', lockPath });
    expect(serverHarness.listenCalls).toEqual([socketPath]);

    const demand = await invokeDemand(serverHarness.handlers[0]);
    expect(demand.statusCode).toBe(503);
    expect(demand.body).toMatchObject({ state: 'loading', modelServerLaunchRequested: true, launched: true });
    expect(spawnFn).toHaveBeenCalledTimes(1);
    expect(children).toHaveLength(1);
    expect(pidAccessors.read()).toBe(children[0].pid);
    first.clearTimers();
    await first.stopDemandListener();
    await second.stopDemandListener();
  });

  it('allows advisor-style absent-mk-spec-memory demand to launch and write the shared pid file', async () => {
    const socketDir = tempDir('hf-cross-absent-memory-');
    const socketPath = join(socketDir, 'hf-embed.sock');
    writeFileSync(socketPath, 'stale socket placeholder', 'utf8');
    const children: FakeChild[] = [];
    const pidAccessors = createPidAccessors(socketPath, 'mk-skill-advisor');
    const readPid = vi.fn(pidAccessors.read);
    const bridge = { probeModelServer: vi.fn(async () => ({ status: 'dead', reason: 'closed-before-reply' })) };
    const serverHarness = createFakeHttpServerHarness();
    const control = mss.createModelServerControl({
      log: () => undefined,
      env: {},
      rootDir: process.cwd(),
      opencodeDir: join(process.cwd(), '.opencode'),
      dbDir: () => socketDir,
      bridge,
      spawnFn: createSpawn(children),
      writeModelServerPid: pidAccessors.write,
      readModelServerPid: readPid,
      httpCreateServer: serverHarness.createServer,
      watchdogConfig: () => ({ enabled: false, maxRssMb: null, intervalMs: 1000, consecutiveBreaches: 1, graceMs: 7000 }),
    });

    await expect(control.startDemandListener({ socketPath })).resolves.toMatchObject({ started: true, socketPath });
    expect(bridge.probeModelServer).toHaveBeenCalledWith(socketPath, { timeoutMs: 1000 });
    expect(readPid).toHaveBeenCalledTimes(1);

    expect(serverHarness.listenCalls).toEqual([socketPath]);
    const demand = await invokeDemand(serverHarness.handlers[0]);
    expect(demand.body).toMatchObject({ modelServerLaunchRequested: true, launched: true });
    expect(existsSync(pidAccessors.path)).toBe(true);
    expect(pidAccessors.read()).toBe(children[0].pid);
    control.clearTimers();
    await control.stopDemandListener();
  });

  it('reads another launcher shared pid and reaps under the socket lock without double-spawning', async () => {
    const socketDir = tempDir('hf-cross-pid-roundtrip-');
    const socketPath = join(socketDir, 'hf-embed.sock');
    const aChildren: FakeChild[] = [];
    const bChildren: FakeChild[] = [];
    const aPidAccessors = createPidAccessors(socketPath, 'mk-spec-memory');
    const bPidAccessors = createPidAccessors(socketPath, 'mk-skill-advisor');
    const controlA = mss.createModelServerControl({
      log: () => undefined,
      env: {},
      rootDir: process.cwd(),
      opencodeDir: join(process.cwd(), '.opencode'),
      dbDir: () => socketDir,
      bridge: {},
      spawnFn: createSpawn(aChildren),
      writeModelServerPid: aPidAccessors.write,
      readModelServerPid: aPidAccessors.read,
      watchdogConfig: () => ({ enabled: false, maxRssMb: null, intervalMs: 1000, consecutiveBreaches: 1, graceMs: 7000 }),
    });
    expect(controlA.launch()).toBe(true);
    expect(aPidAccessors.read()).toBe(aChildren[0].pid);

    const signals: Array<[number, number | string]> = [];
    const controlB = mss.createModelServerControl({
      log: () => undefined,
      env: {},
      rootDir: process.cwd(),
      opencodeDir: join(process.cwd(), '.opencode'),
      dbDir: () => socketDir,
      bridge: {},
      spawnFn: createSpawn(bChildren),
      writeModelServerPid: bPidAccessors.write,
      readModelServerPid: bPidAccessors.read,
      liveness: () => 'alive',
      waitForExit: vi.fn(async () => false),
      processRowsRunner: () => `${aChildren[0].pid} 1 1024`,
      signal: (pid: number, sig: number | string) => {
        if (sig === 0) return true;
        signals.push([pid, sig]);
        return true;
      },
      watchdogConfig: () => ({ enabled: false, maxRssMb: null, intervalMs: 1000, consecutiveBreaches: 1, graceMs: 7000 }),
    });

    await expect(controlB.reapRecordedBeforeRespawn(socketPath)).resolves.toMatchObject({ allowed: true, reaped: true, reason: 'model-server-reaped' });
    expect(signals).toEqual([[aChildren[0].pid, 'SIGTERM'], [aChildren[0].pid, 'SIGKILL']]);
    expect(bChildren).toHaveLength(0);

    const postReapLock = launcher.acquireModelServerRespawnLockFile(socketPath);
    try {
      expect(postReapLock.acquired).toBe(true);
    } finally {
      releaseLock(postReapLock);
    }
    controlA.clearTimers();
    controlB.clearTimers();
  });

  it('backs off (does not clobber) when a sibling has spawned but not yet bound the socket', async () => {
    // Spawn->bind window: a sibling launcher wrote the shared pid (alive child) but its model server
    // has not yet bound the UDS, so no socket file exists and the demand lock is momentarily free.
    const socketDir = tempDir('hf-cross-booting-window-');
    const socketPath = join(socketDir, 'hf-embed.sock');
    const pidAccessors = createPidAccessors(socketPath, 'mk-spec-memory');
    const livePid = 6543;
    pidAccessors.write(livePid);
    const children: FakeChild[] = [];
    const spawnFn = createSpawn(children);
    const bridge = { probeModelServer: vi.fn(async () => ({ status: 'dead', reason: 'unreachable' })) };
    const serverHarness = createFakeHttpServerHarness();
    const control = mss.createModelServerControl({
      log: () => undefined,
      env: {},
      rootDir: process.cwd(),
      opencodeDir: join(process.cwd(), '.opencode'),
      dbDir: () => socketDir,
      bridge,
      spawnFn,
      liveness: (pid: number) => (pid === livePid ? 'alive' : 'dead'),
      writeModelServerPid: pidAccessors.write,
      readModelServerPid: pidAccessors.read,
      httpCreateServer: serverHarness.createServer,
      watchdogConfig: () => ({ enabled: false, maxRssMb: null, intervalMs: 1000, consecutiveBreaches: 1, graceMs: 7000 }),
    });

    const result = await control.startDemandListener({ socketPath });
    expect(result).toMatchObject({ started: false, reason: 'model-server-booting' });
    expect(serverHarness.listenCalls).toEqual([]);
    expect(spawnFn).not.toHaveBeenCalled();
    expect(bridge.probeModelServer).not.toHaveBeenCalled();
    expect(pidAccessors.read()).toBe(livePid);
    // The demand lock must be released after backing off so a legitimate later attempt can proceed.
    const lock = launcher.acquireModelServerRespawnLockFile(socketPath);
    expect(lock.acquired).toBe(true);
    releaseLock(lock);
    control.clearTimers();
  });

  it('falls through to bind when the recorded pid is dead (sibling spawned then crashed before bind)', async () => {
    // Crash-during-boot: the shared pid records a sibling child that has since died. The no-socket
    // branch must NOT back off — a dead recorded pid means there is no resident to protect, so this
    // launcher proceeds to own the demand listener.
    const socketDir = tempDir('hf-cross-dead-pid-');
    const socketPath = join(socketDir, 'hf-embed.sock');
    const pidAccessors = createPidAccessors(socketPath, 'mk-spec-memory');
    const deadPid = 6544;
    pidAccessors.write(deadPid);
    const children: FakeChild[] = [];
    const spawnFn = createSpawn(children);
    const bridge = { probeModelServer: vi.fn(async () => ({ status: 'dead', reason: 'unreachable' })) };
    const serverHarness = createFakeHttpServerHarness();
    const control = mss.createModelServerControl({
      log: () => undefined,
      env: {},
      rootDir: process.cwd(),
      opencodeDir: join(process.cwd(), '.opencode'),
      dbDir: () => socketDir,
      bridge,
      spawnFn,
      liveness: () => 'dead',
      writeModelServerPid: pidAccessors.write,
      readModelServerPid: pidAccessors.read,
      httpCreateServer: serverHarness.createServer,
      watchdogConfig: () => ({ enabled: false, maxRssMb: null, intervalMs: 1000, consecutiveBreaches: 1, graceMs: 7000 }),
    });

    const result = await control.startDemandListener({ socketPath });
    expect(result).toMatchObject({ started: true, socketPath });
    expect(serverHarness.listenCalls).toEqual([socketPath]);
    expect(spawnFn).not.toHaveBeenCalled(); // spawn is demand-driven, not on listener start
    control.clearTimers();
    await control.stopDemandListener();
  });
});
