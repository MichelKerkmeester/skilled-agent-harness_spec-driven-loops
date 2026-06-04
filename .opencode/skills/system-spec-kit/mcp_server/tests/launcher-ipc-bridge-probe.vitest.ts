import { EventEmitter } from 'node:events';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const bridgeModulePath = join(repoRoot, '.opencode/bin/lib/launcher-ipc-bridge.cjs');
const supervisionModulePath = join(repoRoot, '.opencode/bin/lib/model-server-supervision.cjs');
const { maybeBridgeLeaseHolder, probeDaemon, probeModelServer } = require(bridgeModulePath) as {
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
      serviceName: 'mk-spec-memory',
      leaseResult: { ownerPid: 123, startedAt: '2026-05-28T00:00:00.000Z' },
      loggerPrefix: 'test-launcher',
      connect: createAliveConnect(),
      bridge,
      probeTimeoutMs: 100,
    });

    expect(decision).toMatchObject({ action: 'bridge' });
    expect(bridge).toHaveBeenCalledTimes(1);
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
      serviceName: 'mk-spec-memory',
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
    process.env.SPECKIT_IPC_SOCKET_DIR = 'tcp://127.0.0.1:65535';
    const bridge = vi.fn();

    const decision = maybeBridgeLeaseHolder({
      serviceName: 'mk-spec-memory',
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

  afterEach(() => {
    process.env.SPECKIT_IPC_SOCKET_DIR = originalSocketDir;
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

  // (1) A freshly written mk-spec-memory lease now carries the owner's actual socket path.
  it('emits socketPath in the lease payload when the owner supplies one', () => {
    const lease = buildLeaseObject(4242, '2026-05-28T00:00:00.000Z', null, '/tmp/owner-env/daemon-ipc.sock');
    expect(lease.socketPath).toBe('/tmp/owner-env/daemon-ipc.sock');
  });

  // (4) Leases without a socketPath (legacy mk-spec-memory writes and every skill-advisor /
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
      serviceName: 'mk-spec-memory',
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
      serviceName: 'mk-spec-memory',
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
  // as a legacy mk-spec-memory lease, and a missing recomputed socket still reports no-bridge-socket.
  it('reports no-bridge-socket for a no-socketPath lease whose recomputed socket is absent', async () => {
    const divergentDir = tempDir('lease-advisor-');
    delete process.env.SPECKIT_IPC_SOCKET_DIR; // force recompute to resolve from dbDir, not host env

    const bridged: string[] = [];
    const decision = await maybeBridgeLeaseHolder({
      serviceName: 'mk-skill-advisor',
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
