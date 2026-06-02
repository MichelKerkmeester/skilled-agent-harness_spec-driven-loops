import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const bridgeModulePath = join(repoRoot, '.opencode/bin/lib/launcher-ipc-bridge.cjs');
const { maybeBridgeLeaseHolder, probeDaemon, probeModelServer } = require(bridgeModulePath) as {
  maybeBridgeLeaseHolder: (options: Record<string, unknown>) => Promise<{ action: string; reason?: string }>;
  probeDaemon: (socketPath: string, options: Record<string, unknown>) => Promise<{ status: string; reason?: string }>;
  probeModelServer: (socketPath: string, options: Record<string, unknown>) => Promise<{ status: string; reason?: string }>;
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
