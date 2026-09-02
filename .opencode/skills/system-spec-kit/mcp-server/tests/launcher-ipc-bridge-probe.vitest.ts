import { EventEmitter } from 'node:events';
import net from 'node:net';
import { mkdirSync, mkdtempSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const bridgeModulePath = join(repoRoot, '.opencode/bin/lib/launcher-ipc-bridge.cjs');
const supervisionModulePath = join(repoRoot, '.opencode/bin/lib/model-server-supervision.cjs');
const { getIpcSocketPath, resolveIpcSocketDir, maybeBridgeLeaseHolder, probeDaemon, probeModelServer } = require(bridgeModulePath) as {
  getIpcSocketPath: (serviceName: string, options?: { dbDir?: string }) => string;
  maybeBridgeLeaseHolder: (options: Record<string, unknown>) => Promise<{ action: string; reason?: string; socketPath?: string }>;
  probeDaemon: (socketPath: string, options: Record<string, unknown>) => Promise<{ status: string; reason?: string }>;
  probeModelServer: (socketPath: string, options: Record<string, unknown>) => Promise<{ status: string; reason?: string }>;
};
const { buildLeaseObject } = require(supervisionModulePath) as {
  buildLeaseObject: (
    childPid?: number | null,
    startedAt?: string | null,
    modelServerPid?: number | null,
    socketPath?: string | null,
  ) => Record<string, unknown>;
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

function createModelHealthConnect(body: Record<string, unknown>): () => FakeSocket {
  return () => {
    const socket = new FakeSocket();
    socket.write = (chunk: string): boolean => {
      socket.writes.push(String(chunk));
      const responseBody = JSON.stringify(body);
      const response = `HTTP/1.1 200 OK\r\ncontent-type: application/json\r\ncontent-length: ${Buffer.byteLength(responseBody)}\r\n\r\n${responseBody}`;
      queueMicrotask(() => {
        socket.emit('data', Buffer.from(response));
        socket.emit('end');
      });
      return true;
    };
    queueMicrotask(() => socket.emit('connect'));
    return socket;
  };
}

describe('launcher IPC bridge liveness probe', () => {
  afterEach(() => {
    process.env.SPECKIT_IPC_SOCKET_DIR = originalSocketDir;
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
      serviceName: 'system-spec-memory',
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
      serviceName: 'system-spec-memory',
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
      serviceName: 'system-spec-memory',
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

  it('classifies over-age model-server loading per load attempt but keeps fresh or legacy loading alive', async () => {
    await expect(probeModelServer('tcp://127.0.0.1:65535', {
      connect: createModelHealthConnect({ state: 'loading', loadStartedAt: 1000 }),
      loadingMaxMs: 150,
      nowMs: () => 1200,
      timeoutMs: 100,
    })).resolves.toMatchObject({ status: 'dead', reason: 'loading-wedged' });

    await expect(probeModelServer('tcp://127.0.0.1:65535', {
      connect: createModelHealthConnect({ state: 'loading', loadStartedAt: 1000, loadProgressAt: 1125 }),
      loadingMaxMs: 150,
      nowMs: () => 1200,
      timeoutMs: 100,
    })).resolves.toMatchObject({ status: 'alive', reason: 'health-loading' });

    await expect(probeModelServer('tcp://127.0.0.1:65535', {
      connect: createModelHealthConnect({ state: 'loading', loadStartedAt: 1100 }),
      loadingMaxMs: 150,
      nowMs: () => 1200,
      timeoutMs: 100,
    })).resolves.toMatchObject({ status: 'alive', reason: 'health-loading' });

    await expect(probeModelServer('tcp://127.0.0.1:65535', {
      connect: createModelHealthConnect({ state: 'loading' }),
      loadingMaxMs: 150,
      nowMs: () => 1200,
      timeoutMs: 100,
    })).resolves.toMatchObject({ status: 'alive', reason: 'health-loading' });
  });

  it('returns a respawn verdict when the liveness probe is dead', async () => {
    vi.useFakeTimers();
    // Single-probe respawn verdict: the consecutive-failure retry has its own coverage in
    // launcher-reap-hardening.vitest.ts, so pin retries off to keep this timing assertion focused.
    process.env.SPECKIT_LEASE_PROBE_RETRIES = '0';
    process.env.SPECKIT_IPC_SOCKET_DIR = 'tcp://127.0.0.1:65535';
    const bridge = vi.fn();

    const decision = maybeBridgeLeaseHolder({
      serviceName: 'system-spec-memory',
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
  const originalSocketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
  const originalSocketScope = process.env.SPECKIT_IPC_SOCKET_SCOPE;

  afterEach(() => {
    process.env.SPECKIT_IPC_SOCKET_DIR = originalSocketDir;
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

  // (1) A freshly written system-spec-memory lease now carries the owner's actual socket path.
  it('emits socketPath in the lease payload when the owner supplies one', () => {
    const lease = buildLeaseObject(4242, '2026-05-28T00:00:00.000Z', null, '/tmp/owner-env/daemon-ipc.sock');
    expect(lease.socketPath).toBe('/tmp/owner-env/daemon-ipc.sock');
  });

  // (4) Leases without a socketPath (legacy system-spec-memory writes and every skill-advisor /
  // code-index lease, which never records one) omit the field entirely so existing readers and
  // the recompute fallback are unaffected.
  it('omits socketPath entirely when no owner path is supplied', () => {
    const lease = buildLeaseObject(4242, '2026-05-28T00:00:00.000Z');
    expect(Object.prototype.hasOwnProperty.call(lease, 'socketPath')).toBe(false);
  });

  // (2) The bridge prefers the stored path when present and still on disk, even when the env-based
  // recompute would resolve a different (divergent worktree) directory.
  it('bridges to the stored socketPath instead of the recomputed one', async () => {
    const ownerDir = tempDir('lease-owner-sock-');
    const storedSocket = join(ownerDir, 'daemon-ipc.sock');
    writeFileSync(storedSocket, '');
    // Divergent recompute target: a directory with no live socket, mimicking a secondary launcher's
    // worktree env. If the bridge recomputed from this dir it would report no-bridge-socket.
    const divergentDir = tempDir('lease-divergent-');
    delete process.env.SPECKIT_IPC_SOCKET_DIR; // force recompute to resolve from dbDir, not host env

    const bridged: string[] = [];
    const decision = await maybeBridgeLeaseHolder({
      serviceName: 'system-spec-memory',
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

  // (3) A legacy lease WITHOUT socketPath still bridges via the recompute fallback.
  it('falls back to the recomputed socket path for a legacy lease without socketPath', async () => {
    const ownerDir = tempDir('lease-legacy-sock-');
    const recomputedSocket = join(ownerDir, 'daemon-ipc.sock');
    writeFileSync(recomputedSocket, '');
    // The recompute resolves SPECKIT_IPC_SOCKET_DIR -> <dir>/daemon-ipc.sock.
    process.env.SPECKIT_IPC_SOCKET_DIR = ownerDir;

    const bridged: string[] = [];
    const decision = await maybeBridgeLeaseHolder({
      serviceName: 'system-spec-memory',
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

  // (4) A skill-advisor / code-index style lease (no socketPath) is unaffected: same recompute path
  // as a legacy system-spec-memory lease, and a missing recomputed socket still reports no-bridge-socket.
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
});

describe('socket addresses stay inside the platform limit', () => {
  // A unix socket address is capped by sockaddr_un.sun_path. A service whose
  // socket sits beside its database inherits the checkout prefix, and bind then
  // fails with EINVAL, which names neither the length nor the path.
  const SUN_PATH_LIMIT = 104;

  it('keeps every service socket short enough to bind', () => {
    for (const service of ['system-spec-memory', 'system-skill-advisor']) {
      const socketPath = getIpcSocketPath(service, {});
      expect(Buffer.byteLength(socketPath, 'utf8')).toBeLessThan(SUN_PATH_LIMIT);
    }
  });

  it('relocates a directory that would overflow, and leaves a short one alone', () => {
    const longDir = `/tmp/${'d'.repeat(140)}`;
    const relocated = resolveIpcSocketDir('system-spec-memory', { socketDir: longDir, env: {} });
    expect(relocated).not.toBe(longDir);
    expect(Buffer.byteLength(join(relocated, 'daemon-ipc.sock'), 'utf8')).toBeLessThan(SUN_PATH_LIMIT);

    const shortDir = '/tmp/fits-fine';
    expect(resolveIpcSocketDir('system-spec-memory', { socketDir: shortDir, env: {} })).toBe(shortDir);
  });

  it('resolves to the same address when its own answer is fed back in', () => {
    const first = resolveIpcSocketDir('system-spec-memory', { env: {} });
    const second = resolveIpcSocketDir('system-spec-memory', { env: { SPECKIT_IPC_SOCKET_DIR: first } });
    expect(second).toBe(first);
  });

  it('actually binds at the address it hands out', async () => {
    const socketPath = getIpcSocketPath('system-spec-memory', {});
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
