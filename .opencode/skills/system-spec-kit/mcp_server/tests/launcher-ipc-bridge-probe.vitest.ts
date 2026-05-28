import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const bridgeModulePath = join(repoRoot, '.opencode/bin/lib/launcher-ipc-bridge.cjs');
const { maybeBridgeLeaseHolder, probeDaemon } = require(bridgeModulePath) as {
  maybeBridgeLeaseHolder: (options: Record<string, unknown>) => Promise<{ action: string; reason?: string }>;
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

function createErrorConnect(): () => FakeSocket {
  return () => {
    const socket = new FakeSocket();
    queueMicrotask(() => socket.emit('error', new Error('ECONNREFUSED')));
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
    await expect(probeDaemon('tcp://127.0.0.1:65535', { connect, timeoutMs: 100 })).resolves.toMatchObject({
      status: 'alive',
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

  it('classifies an accepted but non-responsive daemon as dead within the timeout', async () => {
    vi.useFakeTimers();

    const result = probeDaemon('tcp://127.0.0.1:65535', {
      connect: createWedgedConnect(),
      timeoutMs: 25,
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
    process.env.SPECKIT_IPC_SOCKET_DIR = 'tcp://127.0.0.1:65535';
    const bridge = vi.fn();

    const decision = maybeBridgeLeaseHolder({
      serviceName: 'mk-spec-memory',
      leaseResult: { ownerPid: 123, startedAt: '2026-05-28T00:00:00.000Z' },
      loggerPrefix: 'test-launcher',
      connect: createWedgedConnect(),
      bridge,
      probeTimeoutMs: 25,
    });

    await vi.advanceTimersByTimeAsync(25);
    await expect(decision).resolves.toMatchObject({ action: 'respawn', reason: 'timeout' });
    expect(bridge).not.toHaveBeenCalled();
  });
});
