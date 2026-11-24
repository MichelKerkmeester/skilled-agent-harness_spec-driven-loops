// ───────────────────────────────────────────────────────────────────
// MODULE: Launcher IPC Bridge Probe
// ───────────────────────────────────────────────────────────────────
import { EventEmitter } from 'node:events';
import net from 'node:net';
import { chmodSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const fs = require('node:fs') as typeof import('node:fs');
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const bridgeModulePath = join(repoRoot, '.skilled/bin/lib/launcher-ipc-bridge.cjs');
const { checkIpcSocketOwnership, getIpcSocketPath, resolveIpcSocketDir, maybeBridgeLeaseHolder, probeDaemon } = require(bridgeModulePath) as {
  checkIpcSocketOwnership: (socketPath: string) => string | null;
  getIpcSocketPath: (serviceName: string, options?: { dbDir?: string }) => string;
  resolveIpcSocketDir: (serviceName: string, options?: { dbDir?: string; socketDir?: string; env?: NodeJS.ProcessEnv }) => string;
  maybeBridgeLeaseHolder: (options: Record<string, unknown>) => Promise<{ action: string; reason?: string; socketPath?: string }>;
  probeDaemon: (socketPath: string, options: Record<string, unknown>) => Promise<{ status: string; reason?: string }>;
};

const originalSocketDir = process.env.SPECKIT_IPC_SOCKET_DIR;

class FakeSocket extends EventEmitter {
  public writes: string[] = [];
  public destroyed = false;

  public write(chunk: string): boolean {
    this.writes.push(String(chunk));
    return true;
  }

  public destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.emit('close');
  }
}

function createAliveConnect(): () => FakeSocket {
  return () => {
    const socket = new FakeSocket();
    socket.write = (chunk: string): boolean => {
      socket.writes.push(String(chunk));
      const request = JSON.parse(String(chunk).trim()) as { id: number };
      queueMicrotask(() => {
        socket.emit('data', `${JSON.stringify({ jsonrpc: '2.0', id: request.id, result: {} })}\n`);
      });
      return true;
    };
    queueMicrotask(() => socket.emit('connect'));
    return socket;
  };
}

function createWedgedConnect(): () => FakeSocket {
  return () => {
    const socket = new FakeSocket();
    queueMicrotask(() => socket.emit('connect'));
    return socket;
  };
}

function createNeverConnect(): () => FakeSocket {
  return () => new FakeSocket();
}

function createTrackedConnectOnly(sockets: FakeSocket[]): () => FakeSocket {
  return () => {
    const socket = new FakeSocket();
    sockets.push(socket);
    queueMicrotask(() => socket.emit('connect'));
    return socket;
  };
}

function createErrorConnect(): () => FakeSocket {
  return () => {
    const socket = new FakeSocket();
    queueMicrotask(() => socket.emit('error', new Error('ECONNREFUSED')));
    return socket;
  };
}

async function listenAt(server: net.Server, socketPath: string): Promise<void> {
  await new Promise<void>((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(socketPath, resolvePromise);
  });
}

async function closeServer(server: net.Server): Promise<void> {
  if (!server.listening) return;
  await new Promise<void>((resolvePromise, reject) => {
    server.close((error) => error ? reject(error) : resolvePromise());
  });
}

function fakeStats(
  uid: number,
  mode: number,
  kind: 'directory' | 'file' | 'socket' | 'symlink',
): ReturnType<typeof fs.lstatSync> {
  return {
    uid,
    mode,
    isDirectory: () => kind === 'directory',
    isSocket: () => kind === 'socket',
    isSymbolicLink: () => kind === 'symlink',
  } as ReturnType<typeof fs.lstatSync>;
}

function stubLstat(stats: Map<string, ReturnType<typeof fs.lstatSync>>): string[] {
  const inspected: string[] = [];
  vi.spyOn(fs, 'lstatSync').mockImplementation(((target: string | Buffer | URL) => {
    const targetPath = resolve(String(target));
    inspected.push(targetPath);
    const result = stats.get(targetPath);
    if (result) return result;
    const error = new Error(`missing ${targetPath}`) as NodeJS.ErrnoException;
    error.code = 'ENOENT';
    throw error;
  }) as typeof fs.lstatSync);
  return inspected;
}

describe('launcher IPC bridge liveness probe', () => {
  afterEach(() => {
    // Assigning an absent original back would store the string "undefined", which resolves to a
    // real-looking directory and hides the service's own socket path from later suites.
    if (originalSocketDir === undefined) delete process.env.SPECKIT_IPC_SOCKET_DIR;
    else process.env.SPECKIT_IPC_SOCKET_DIR = originalSocketDir;
    delete process.env.SPECKIT_LEASE_PROBE_RETRIES;
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('classifies a matching JSON-RPC initialize response as alive and bridges', async () => {
    const connect = createAliveConnect();
    await expect(probeDaemon('tcp://127.0.0.1:65535', { connect, timeoutMs: 100, deepProbe: true })).resolves.toMatchObject({
      status: 'alive',
      reason: 'json-rpc-reply',
    });

    process.env.SPECKIT_IPC_SOCKET_DIR = 'tcp://127.0.0.1:65535';
    const bridge = vi.fn();
    const decision = await maybeBridgeLeaseHolder({
      serviceName: 'system-skill-advisor',
      leaseResult: { ownerPid: 123, startedAt: '2026-05-28T00:00:00.000Z' },
      loggerPrefix: 'test-launcher',
      connect: createAliveConnect(),
      bridge,
      probeTimeoutMs: 100,
    });

    expect(decision).toMatchObject({ action: 'bridge' });
    expect(bridge).toHaveBeenCalledTimes(1);
  });

  it('forwards the confirmed-alive probe result to the bridge so it can skip a redundant re-probe (REQ-007)', async () => {
    process.env.SPECKIT_IPC_SOCKET_DIR = 'tcp://127.0.0.1:65535';
    const bridge = vi.fn();
    await maybeBridgeLeaseHolder({
      serviceName: 'system-skill-advisor',
      leaseResult: { ownerPid: 123, startedAt: '2026-05-28T00:00:00.000Z' },
      loggerPrefix: 'test-launcher',
      connect: createAliveConnect(),
      bridge,
      probeTimeoutMs: 100,
    });

    expect(bridge).toHaveBeenCalledTimes(1);
    const [, bridgeOptions] = bridge.mock.calls[0] as [string, { initialReadyResult?: { status?: string } }];
    expect(bridgeOptions.initialReadyResult).toMatchObject({ status: 'alive' });
  });

  it('awaits an async bridge before resolving the bridge decision', async () => {
    process.env.SPECKIT_IPC_SOCKET_DIR = 'tcp://127.0.0.1:65535';
    const order: string[] = [];
    let releaseBridge: () => void = () => undefined;
    const bridgeGate = new Promise<void>((resolvePromise) => {
      releaseBridge = resolvePromise;
    });
    const bridge = vi.fn(async () => {
      order.push('bridge-start');
      await bridgeGate;
      order.push('bridge-end');
    });

    const decision = maybeBridgeLeaseHolder({
      serviceName: 'system-skill-advisor',
      leaseResult: { ownerPid: 123, startedAt: '2026-05-28T00:00:00.000Z' },
      loggerPrefix: 'test-launcher',
      connect: createAliveConnect(),
      bridge,
      probeTimeoutMs: 100,
    }).then((value) => {
      order.push('decision-resolved');
      return value;
    });

    // Let the probe settle and the bridge start; the decision must still be pending
    // because maybeBridgeLeaseHolder awaits the async bridge (the reconnecting proxy).
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 10));
    expect(order).toEqual(['bridge-start']);

    releaseBridge();
    await expect(decision).resolves.toMatchObject({ action: 'bridge' });
    expect(order).toEqual(['bridge-start', 'bridge-end', 'decision-resolved']);
  });

  it('classifies connect success as alive without deepProbe', async () => {
    const sockets: FakeSocket[] = [];

    await expect(probeDaemon('tcp://127.0.0.1:65535', {
      connect: createTrackedConnectOnly(sockets),
      timeoutMs: 25,
    })).resolves.toMatchObject({ status: 'alive', reason: 'connect-ok' });

    expect(sockets[0]?.writes).toEqual([]);
  });

  it('honors SPECKIT_PROBE_TIMEOUT_MS when no explicit timeout is supplied', async () => {
    vi.useFakeTimers();

    const result = probeDaemon('tcp://127.0.0.1:65535', {
      connect: createNeverConnect(),
      env: { SPECKIT_PROBE_TIMEOUT_MS: '25' },
    });

    await vi.advanceTimersByTimeAsync(25);
    await expect(result).resolves.toMatchObject({ status: 'dead', reason: 'timeout' });
  });

  it('classifies an accepted but non-responsive daemon as dead within the timeout when deepProbe is enabled', async () => {
    vi.useFakeTimers();

    const result = probeDaemon('tcp://127.0.0.1:65535', {
      connect: createWedgedConnect(),
      timeoutMs: 25,
      deepProbe: true,
    });

    await vi.advanceTimersByTimeAsync(25);
    await expect(result).resolves.toMatchObject({ status: 'dead', reason: 'timeout' });
  });

  it('classifies a connection error as dead', async () => {
    await expect(probeDaemon('tcp://127.0.0.1:65535', {
      connect: createErrorConnect(),
      timeoutMs: 100,
    })).resolves.toMatchObject({ status: 'dead' });
  });

  it('returns a respawn verdict when the liveness probe is dead', async () => {
    vi.useFakeTimers();
    // Single-probe respawn verdict: the consecutive-failure retry has its own coverage in
    // launcher-reap-hardening.vitest.ts, so pin retries off to keep this timing assertion focused.
    process.env.SPECKIT_LEASE_PROBE_RETRIES = '0';
    process.env.SPECKIT_IPC_SOCKET_DIR = 'tcp://127.0.0.1:65535';
    const bridge = vi.fn();

    const decision = maybeBridgeLeaseHolder({
      serviceName: 'system-skill-advisor',
      leaseResult: { ownerPid: 123, startedAt: '2026-05-28T00:00:00.000Z' },
      loggerPrefix: 'test-launcher',
      connect: createNeverConnect(),
      bridge,
      probeTimeoutMs: 25,
    });

    await vi.advanceTimersByTimeAsync(25);
    await expect(decision).resolves.toMatchObject({ action: 'respawn', reason: 'timeout' });
    expect(bridge).not.toHaveBeenCalled();
  });
});

describe('lease socketPath: stored owner path preferred over recomputed', () => {
  const tempDirs: string[] = [];
  const servers: net.Server[] = [];
  const originalSocketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
  const originalSocketScope = process.env.SPECKIT_IPC_SOCKET_SCOPE;

  afterEach(async () => {
    while (servers.length > 0) {
      const server = servers.pop();
      if (server) await closeServer(server);
    }
    if (originalSocketDir === undefined) delete process.env.SPECKIT_IPC_SOCKET_DIR;
    else process.env.SPECKIT_IPC_SOCKET_DIR = originalSocketDir;
    if (originalSocketScope === undefined) delete process.env.SPECKIT_IPC_SOCKET_SCOPE;
    else process.env.SPECKIT_IPC_SOCKET_SCOPE = originalSocketScope;
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  function tempDir(prefix: string): string {
    const dir = mkdtempSync(join(tmpdir(), prefix));
    tempDirs.push(dir);
    return dir;
  }

  it('scopes advisor sockets by database under the shared default socket directory', () => {
    const firstDbDir = tempDir('lease-scope-first-');
    const secondDbDir = tempDir('lease-scope-second-');
    process.env.SPECKIT_IPC_SOCKET_DIR = '/tmp/system-skill-advisor';
    delete process.env.SPECKIT_IPC_SOCKET_SCOPE;

    const firstSocket = getIpcSocketPath('system-skill-advisor', { dbDir: firstDbDir });
    const secondSocket = getIpcSocketPath('system-skill-advisor', { dbDir: secondDbDir });

    expect(firstSocket).toMatch(/^\/tmp\/system-skill-advisor\/[0-9a-f]{12}\/daemon-ipc\.sock$/);
    expect(secondSocket).not.toBe(firstSocket);
  });

  // (2) The bridge prefers the stored path when present and still on disk, even when the env-based
  // recompute would resolve a different (divergent worktree) directory.
  it('bridges to the stored socketPath instead of the recomputed one', async () => {
    const ownerDir = tempDir('lease-owner-sock-');
    const storedSocket = join(ownerDir, 'daemon-ipc.sock');
    const server = net.createServer();
    servers.push(server);
    await listenAt(server, storedSocket);
    // Divergent recompute target: a directory with no live socket, mimicking a secondary launcher's
    // worktree env. If the bridge recomputed from this dir it would report no-bridge-socket.
    const divergentDir = tempDir('lease-divergent-');
    // Point the recompute at the divergent directory itself, which keeps it off the shared default
    // socket directory. That matters because a database-scoped socket refuses a stored path from
    // another database; the next test pins that guard.
    process.env.SPECKIT_IPC_SOCKET_DIR = divergentDir;

    const bridged: string[] = [];
    const decision = await maybeBridgeLeaseHolder({
      serviceName: 'system-skill-advisor',
      leaseResult: { ownerPid: 123, startedAt: '2026-05-28T00:00:00.000Z', socketPath: storedSocket },
      loggerPrefix: 'test-launcher',
      dbDir: divergentDir,
      connect: createAliveConnect(),
      bridge: (socketPath: string) => {
        bridged.push(socketPath);
      },
      probeTimeoutMs: 100,
    });

    expect(decision).toMatchObject({ action: 'bridge', socketPath: storedSocket });
    expect(bridged).toEqual([storedSocket]);
  });

  // (2b) Under the shared default socket directory the address is scoped by database, so a stored
  // path from a different database is not the owner of this one. Trusting it would bridge a client
  // to another database's daemon, so the scoped recompute wins even though the stored path exists.
  it('refuses a stored socketPath that does not match the database-scoped address', async () => {
    const foreignDir = tempDir('lease-foreign-sock-');
    const foreignSocket = join(foreignDir, 'daemon-ipc.sock');
    writeFileSync(foreignSocket, '');
    const dbDir = tempDir('lease-scoped-db-');
    process.env.SPECKIT_IPC_SOCKET_DIR = '/tmp/system-skill-advisor';
    delete process.env.SPECKIT_IPC_SOCKET_SCOPE;

    const bridged: string[] = [];
    const decision = await maybeBridgeLeaseHolder({
      serviceName: 'system-skill-advisor',
      leaseResult: { ownerPid: 123, startedAt: '2026-05-28T00:00:00.000Z', socketPath: foreignSocket },
      loggerPrefix: 'test-launcher',
      dbDir,
      connect: createAliveConnect(),
      bridge: (socketPath: string) => {
        bridged.push(socketPath);
      },
      probeTimeoutMs: 100,
    });

    expect(decision).toMatchObject({ action: 'report', reason: 'no-bridge-socket' });
    expect(decision.socketPath).toMatch(/^\/tmp\/system-skill-advisor\/[0-9a-f]{12}\/daemon-ipc\.sock$/);
    expect(bridged).toEqual([]);
  });

  // (3) A legacy lease WITHOUT socketPath still bridges via the recompute fallback.
  it('falls back to the recomputed socket path for a legacy lease without socketPath', async () => {
    const ownerDir = tempDir('lease-legacy-sock-');
    const recomputedSocket = join(ownerDir, 'daemon-ipc.sock');
    const server = net.createServer();
    servers.push(server);
    await listenAt(server, recomputedSocket);
    // The recompute resolves SPECKIT_IPC_SOCKET_DIR -> <dir>/daemon-ipc.sock.
    process.env.SPECKIT_IPC_SOCKET_DIR = ownerDir;

    const bridged: string[] = [];
    const decision = await maybeBridgeLeaseHolder({
      serviceName: 'system-skill-advisor',
      leaseResult: { ownerPid: 123, startedAt: '2026-05-28T00:00:00.000Z' },
      loggerPrefix: 'test-launcher',
      dbDir: ownerDir,
      connect: createAliveConnect(),
      bridge: (socketPath: string) => {
        bridged.push(socketPath);
      },
      probeTimeoutMs: 100,
    });

    expect(decision).toMatchObject({ action: 'bridge', socketPath: recomputedSocket });
    expect(bridged).toEqual([recomputedSocket]);
  });

  // (4) A lease without a socketPath falls back to the recompute path, and a missing recomputed
  // socket still reports no-bridge-socket.
  it('reports no-bridge-socket for a no-socketPath lease whose recomputed socket is absent', async () => {
    const divergentDir = tempDir('lease-advisor-');
    delete process.env.SPECKIT_IPC_SOCKET_DIR; // force recompute to resolve from dbDir, not host env

    const bridged: string[] = [];
    const decision = await maybeBridgeLeaseHolder({
      serviceName: 'system-skill-advisor',
      leaseResult: { ownerPid: 123, startedAt: '2026-05-28T00:00:00.000Z' },
      loggerPrefix: 'test-launcher',
      dbDir: divergentDir,
      connect: createAliveConnect(),
      bridge: (socketPath: string) => {
        bridged.push(socketPath);
      },
      probeTimeoutMs: 100,
    });

    expect(decision).toMatchObject({ action: 'report', reason: 'no-bridge-socket' });
    expect(bridged).toEqual([]);
  });

  it('refuses a stored path that is a regular file before probing or bridging', async () => {
    const ownerDir = tempDir('lease-not-socket-');
    const socketPath = join(ownerDir, 'daemon-ipc.sock');
    writeFileSync(socketPath, 'not a socket');
    process.env.SPECKIT_IPC_SOCKET_DIR = ownerDir;
    const connect = vi.fn(createAliveConnect());
    const bridge = vi.fn();

    const decision = await maybeBridgeLeaseHolder({
      serviceName: 'system-skill-advisor',
      leaseResult: { ownerPid: 123, startedAt: '2026-05-28T00:00:00.000Z', socketPath },
      loggerPrefix: 'test-launcher',
      connect,
      bridge,
      probeTimeoutMs: 100,
    });

    expect(decision).toMatchObject({ action: 'report', reason: 'socket-not-owned', socketPath });
    expect(connect).not.toHaveBeenCalled();
    expect(bridge).not.toHaveBeenCalled();
  });
});

describe('checkIpcSocketOwnership', () => {
  const tempDirs: string[] = [];
  const servers: net.Server[] = [];
  const originalSocketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
  const originalSocketScope = process.env.SPECKIT_IPC_SOCKET_SCOPE;
  const originalGetuidDescriptor = Object.getOwnPropertyDescriptor(process, 'getuid');

  afterEach(async () => {
    while (servers.length > 0) {
      const server = servers.pop();
      if (server) await closeServer(server);
    }
    if (originalSocketDir === undefined) delete process.env.SPECKIT_IPC_SOCKET_DIR;
    else process.env.SPECKIT_IPC_SOCKET_DIR = originalSocketDir;
    if (originalSocketScope === undefined) delete process.env.SPECKIT_IPC_SOCKET_SCOPE;
    else process.env.SPECKIT_IPC_SOCKET_SCOPE = originalSocketScope;
    if (originalGetuidDescriptor) Object.defineProperty(process, 'getuid', originalGetuidDescriptor);
    else delete (process as NodeJS.Process & { getuid?: () => number }).getuid;
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
    vi.restoreAllMocks();
  });

  function tempDir(prefix: string): string {
    const dir = mkdtempSync(join(tmpdir(), prefix));
    tempDirs.push(dir);
    return dir;
  }

  it('refuses a scope directory owned by another uid', () => {
    const sharedDir = '/tmp/system-skill-advisor';
    const scopeDir = join(sharedDir, 'abcdef012345');
    const socketPath = join(scopeDir, 'daemon-ipc.sock');
    process.env.SPECKIT_IPC_SOCKET_DIR = sharedDir;
    vi.spyOn(process, 'getuid').mockReturnValue(501);
    const inspected = stubLstat(new Map([
      [resolve(sharedDir), fakeStats(501, 0o40700, 'directory')],
      [resolve(scopeDir), fakeStats(502, 0o40700, 'directory')],
    ]));

    expect(checkIpcSocketOwnership(socketPath)).toContain(`${scopeDir} owned by uid 502, not 501`);
    expect(inspected).toEqual([resolve(sharedDir), resolve(scopeDir)]);
  });

  it('checks ownership of the shared parent before the scoped directory', () => {
    const sharedDir = '/tmp/system-skill-advisor';
    const scopeDir = join(sharedDir, 'abcdef012345');
    const socketPath = join(scopeDir, 'daemon-ipc.sock');
    process.env.SPECKIT_IPC_SOCKET_DIR = sharedDir;
    vi.spyOn(process, 'getuid').mockReturnValue(501);
    const inspected = stubLstat(new Map([
      [resolve(sharedDir), fakeStats(502, 0o40700, 'directory')],
      [resolve(scopeDir), fakeStats(501, 0o40700, 'directory')],
    ]));

    expect(checkIpcSocketOwnership(socketPath)).toContain(`${sharedDir} owned by uid 502, not 501`);
    expect(inspected).toEqual([resolve(sharedDir)]);
  });

  it.each([
    { mode: 0o770, label: 'group-writable' },
    { mode: 0o777, label: 'world-writable' },
  ])('refuses a $label socket directory before probing', async ({ mode }) => {
    const socketDir = tempDir('socket-open-mode-');
    const socketPath = join(socketDir, 'daemon-ipc.sock');
    process.env.SPECKIT_IPC_SOCKET_DIR = socketDir;
    const server = net.createServer();
    servers.push(server);
    await listenAt(server, socketPath);
    chmodSync(socketDir, mode);
    const connect = vi.fn(createAliveConnect());
    const bridge = vi.fn();

    const decision = await maybeBridgeLeaseHolder({
      serviceName: 'system-skill-advisor',
      leaseResult: { ownerPid: 123, startedAt: '2026-05-28T00:00:00.000Z', socketPath },
      loggerPrefix: 'test-launcher',
      connect,
      bridge,
      probeTimeoutMs: 100,
    });

    expect(decision).toMatchObject({ action: 'report', reason: 'socket-not-owned', socketPath });
    expect(connect).not.toHaveBeenCalled();
    expect(bridge).not.toHaveBeenCalled();
  });

  it('refuses a socket directory reached through a symlink before probing', async () => {
    const parentDir = tempDir('socket-symlink-');
    const realDir = join(parentDir, 'real');
    const linkedDir = join(parentDir, 'linked');
    mkdirSync(realDir, { mode: 0o700 });
    symlinkSync(realDir, linkedDir);
    const realSocketPath = join(realDir, 'daemon-ipc.sock');
    const socketPath = join(linkedDir, 'daemon-ipc.sock');
    const server = net.createServer();
    servers.push(server);
    await listenAt(server, realSocketPath);
    process.env.SPECKIT_IPC_SOCKET_DIR = linkedDir;
    const connect = vi.fn(createAliveConnect());
    const bridge = vi.fn();

    const decision = await maybeBridgeLeaseHolder({
      serviceName: 'system-skill-advisor',
      leaseResult: { ownerPid: 123, startedAt: '2026-05-28T00:00:00.000Z', socketPath },
      loggerPrefix: 'test-launcher',
      connect,
      bridge,
      probeTimeoutMs: 100,
    });

    expect(decision).toMatchObject({ action: 'report', reason: 'socket-not-owned', socketPath });
    expect(connect).not.toHaveBeenCalled();
    expect(bridge).not.toHaveBeenCalled();
  });

  it('rejects a regular file at the socket path', () => {
    const socketDir = tempDir('socket-file-');
    const socketPath = join(socketDir, 'daemon-ipc.sock');
    process.env.SPECKIT_IPC_SOCKET_DIR = socketDir;
    writeFileSync(socketPath, 'not a socket');

    expect(checkIpcSocketOwnership(socketPath)).toContain(`not a socket: ${socketPath}`);
  });

  it('rejects a symlink at the socket path', () => {
    const socketDir = tempDir('socket-node-symlink-');
    const socketPath = join(socketDir, 'daemon-ipc.sock');
    process.env.SPECKIT_IPC_SOCKET_DIR = socketDir;
    symlinkSync(join(socketDir, 'target.sock'), socketPath);

    expect(checkIpcSocketOwnership(socketPath)).toContain(`symlink at ${socketPath}`);
  });

  it('accepts a socket in the current user’s private directory', async () => {
    const socketDir = tempDir('socket-owned-');
    const socketPath = join(socketDir, 'daemon-ipc.sock');
    process.env.SPECKIT_IPC_SOCKET_DIR = socketDir;
    const server = net.createServer();
    servers.push(server);
    await listenAt(server, socketPath);

    expect(checkIpcSocketOwnership(socketPath)).toBeNull();
  });

  it('checks only the worktree socket directory and does not walk into its home parent', () => {
    const fakeHome = tempDir('fake-home-');
    const sharedDir = join(fakeHome, '.spk-wt-sock');
    const socketDir = join(sharedDir, 'claude-x');
    mkdirSync(socketDir, { recursive: true });
    process.env.SPECKIT_IPC_SOCKET_DIR = socketDir;
    const inspected: string[] = [];
    const originalLstatSync = fs.lstatSync;
    vi.spyOn(fs, 'lstatSync').mockImplementation(((target: string | Buffer | URL) => {
      const targetPath = resolve(String(target));
      inspected.push(targetPath);
      return originalLstatSync(target as string);
    }) as typeof fs.lstatSync);

    expect(checkIpcSocketOwnership(join(socketDir, 'daemon-ipc.sock'))).toBeNull();
    expect(inspected).toContain(resolve(socketDir));
    expect(inspected).not.toContain(resolve('/tmp'));
    expect(inspected).not.toContain(resolve(fakeHome));
    expect(inspected).not.toContain(resolve(sharedDir));
  });

  it('checks the shared parent and scope without walking higher directories', () => {
    const sharedDir = '/tmp/system-skill-advisor';
    const scopeDir = join(sharedDir, 'abcdef012345');
    const socketPath = join(scopeDir, 'daemon-ipc.sock');
    const fakeHome = '/tmp/fake-home';
    process.env.SPECKIT_IPC_SOCKET_DIR = sharedDir;
    vi.spyOn(process, 'getuid').mockReturnValue(501);
    const inspected = stubLstat(new Map([
      [resolve(sharedDir), fakeStats(501, 0o40700, 'directory')],
      [resolve(scopeDir), fakeStats(501, 0o40700, 'directory')],
      [resolve(socketPath), fakeStats(501, 0o140755, 'socket')],
    ]));

    expect(checkIpcSocketOwnership(socketPath)).toBeNull();
    expect(inspected).toContain(resolve(sharedDir));
    expect(inspected).toContain(resolve(scopeDir));
    expect(inspected).toContain(resolve(socketPath));
    expect(inspected).not.toContain(resolve('/tmp'));
    expect(inspected).not.toContain(resolve(fakeHome));
    expect(inspected.some((targetPath) => targetPath.includes('.spk-wt-sock'))).toBe(false);
  });

  it('does not inspect paths for a tcp endpoint', () => {
    const lstat = vi.spyOn(fs, 'lstatSync');

    expect(checkIpcSocketOwnership('tcp://127.0.0.1:65535')).toBeNull();
    expect(lstat).not.toHaveBeenCalled();
  });

  it('does not inspect paths when the platform has no uid lookup', () => {
    const lstat = vi.spyOn(fs, 'lstatSync');
    Object.defineProperty(process, 'getuid', { configurable: true, value: undefined });

    expect(checkIpcSocketOwnership('/tmp/system-skill-advisor/daemon-ipc.sock')).toBeNull();
    expect(lstat).not.toHaveBeenCalled();
  });

  it('allows an absent socket path and an absent socket directory', () => {
    const socketDir = tempDir('socket-missing-node-');
    process.env.SPECKIT_IPC_SOCKET_DIR = socketDir;

    expect(checkIpcSocketOwnership(join(socketDir, 'daemon-ipc.sock'))).toBeNull();
    expect(checkIpcSocketOwnership(join(socketDir, 'missing', 'daemon-ipc.sock'))).toBeNull();
  });
});

describe('socket addresses stay inside the platform limit', () => {
  // A unix socket address is capped by sockaddr_un.sun_path. A service whose
  // socket sits beside its database inherits the checkout prefix, and bind then
  // fails with EINVAL, which names neither the length nor the path.
  const SUN_PATH_LIMIT = 104;

  it('keeps the service socket short enough to bind', () => {
    const socketPath = getIpcSocketPath('system-skill-advisor', {});
    expect(Buffer.byteLength(socketPath, 'utf8')).toBeLessThan(SUN_PATH_LIMIT);
  });

  it('relocates a directory that would overflow, and leaves a short one alone', () => {
    const longDir = `/tmp/${'d'.repeat(140)}`;
    const relocated = resolveIpcSocketDir('system-skill-advisor', { socketDir: longDir, env: {} });
    expect(relocated).not.toBe(longDir);
    expect(Buffer.byteLength(join(relocated, 'daemon-ipc.sock'), 'utf8')).toBeLessThan(SUN_PATH_LIMIT);

    const shortDir = '/tmp/fits-fine';
    expect(resolveIpcSocketDir('system-skill-advisor', { socketDir: shortDir, env: {} })).toBe(shortDir);
  });

  it('resolves to the same address when its own answer is fed back in', () => {
    const first = resolveIpcSocketDir('system-skill-advisor', { env: {} });
    const second = resolveIpcSocketDir('system-skill-advisor', { env: { SPECKIT_IPC_SOCKET_DIR: first } });
    expect(second).toBe(first);
  });

  it('actually binds at the address it hands out', async () => {
    const socketPath = getIpcSocketPath('system-skill-advisor', {});
    mkdirSync(dirname(socketPath), { recursive: true });
    try { unlinkSync(socketPath); } catch { /* absent is the normal case */ }
    const server = net.createServer();
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.listen(socketPath, resolve);
    });
    await new Promise<void>((resolve) => server.close(() => resolve()));
    try { unlinkSync(socketPath); } catch { /* already gone */ }
  });
});
