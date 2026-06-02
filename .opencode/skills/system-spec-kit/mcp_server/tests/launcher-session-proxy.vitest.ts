import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const proxyModulePath = join(repoRoot, '.opencode/bin/lib/launcher-session-proxy.cjs');

type PendingEntry = { frame: string; replayable: boolean };
type FrameSplitter = {
  push(chunk: string | Buffer): void;
  discard(): void;
  buffered(): string;
};
type PendingTracker = {
  pendingRequests: Map<string | number | null, PendingEntry>;
  handleClientFrame(frame: string): void;
  handleBackendFrame(frame: string): void;
  getCachedInitialize(): string | null;
};
type ProxyTesting = {
  classifyFrame(frame: string | Record<string, unknown>): boolean;
  createFrameSplitter(onFrame: (frame: string) => void): FrameSplitter;
  createPendingRequestsTracker(classify?: (frame: string) => boolean): PendingTracker;
};
type SessionProxy = { start(): Promise<void>; stop(): void };
type SessionProxyFactory = (options: Record<string, unknown>) => SessionProxy;

const { createSessionProxy, __testing } = require(proxyModulePath) as {
  createSessionProxy: SessionProxyFactory;
  __testing: ProxyTesting;
};

class FakeInput extends EventEmitter {
  public paused = false;

  public pause(): void {
    this.paused = true;
  }

  public resume(): void {
    this.paused = false;
  }

  public send(frameValue: string): void {
    this.emit('data', `${frameValue}\n`);
  }
}

class FakeOutput extends EventEmitter {
  public writes: string[] = [];
  public ended = false;
  public paused = false;

  public write(chunk: string): boolean {
    this.writes.push(String(chunk));
    return true;
  }

  public end(): void {
    this.ended = true;
  }

  public pause(): void {
    this.paused = true;
  }

  public resume(): void {
    this.paused = false;
  }
}

class FakeSocket extends EventEmitter {
  public writes: string[] = [];
  public destroyed = false;
  public ended = false;
  public paused = false;
  public onWrite?: (chunk: string) => void;

  public write(chunk: string): boolean {
    const text = String(chunk);
    this.writes.push(text);
    this.onWrite?.(text);
    return true;
  }

  public destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.emit('close');
  }

  public end(): void {
    this.ended = true;
  }

  public pause(): void {
    this.paused = true;
  }

  public resume(): void {
    this.paused = false;
  }
}

function frame(value: Record<string, unknown>): string {
  return JSON.stringify(value);
}

function toolCall(id: string | number, name: string): string {
  return frame({ jsonrpc: '2.0', id, method: 'tools/call', params: { name, arguments: {} } });
}

function outputFrames(output: FakeOutput): Array<Record<string, unknown>> {
  return output.writes
    .flatMap((chunk) => chunk.split('\n'))
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

async function flushMicrotasks(count = 5): Promise<void> {
  for (let index = 0; index < count; index += 1) {
    await Promise.resolve();
  }
}

function createConnectedSocket(sockets: FakeSocket[], configure?: (socket: FakeSocket, index: number) => void): () => FakeSocket {
  return () => {
    const socket = new FakeSocket();
    sockets.push(socket);
    configure?.(socket, sockets.length - 1);
    queueMicrotask(() => socket.emit('connect'));
    return socket;
  };
}

function aliveProbe(): Promise<{ status: string; reason: string }> {
  return Promise.resolve({ status: 'alive', reason: 'test' });
}

// Drives a proxy to CONNECTED, caches protocol version 2025-06-18 from the first
// initialize response, leaves one replayable request pending, then recycles. The
// fresh socket (index 1) answers the internal re-handshake with `rehandshakeResult`
// (or stays silent when null), so callers can assert version-drift handling.
async function driveToRehandshake(
  rehandshakeResult: Record<string, unknown> | null,
): Promise<{ input: FakeInput; output: FakeOutput; sockets: FakeSocket[]; proxy: SessionProxy }> {
  const input = new FakeInput();
  const output = new FakeOutput();
  const sockets: FakeSocket[] = [];
  const initialize = frame({ jsonrpc: '2.0', id: 'init', method: 'initialize', params: {} });
  const request = toolCall('survivor', 'memory_search');
  const proxy = createSessionProxy({
    socketPath: 'tcp://127.0.0.1:65535',
    stdin: input,
    stdout: output,
    probe: aliveProbe,
    connect: createConnectedSocket(sockets, (socket, index) => {
      if (index !== 1) return;
      socket.onWrite = (chunk) => {
        const parsed = JSON.parse(chunk.trim()) as { id: string; method?: string };
        if (parsed.method === 'initialize' && rehandshakeResult !== null) {
          queueMicrotask(() => {
            socket.emit('data', `${frame({ jsonrpc: '2.0', id: parsed.id, result: rehandshakeResult })}\n`);
          });
        }
      };
    }),
    log: () => undefined,
    maxReattachAttempts: 3,
    maxColdStartAttempts: 1,
  });

  await proxy.start();
  input.send(initialize);
  sockets[0]?.emit('data', `${frame({ jsonrpc: '2.0', id: 'init', result: { protocolVersion: '2025-06-18' } })}\n`);
  await flushMicrotasks();
  input.send(request);
  await flushMicrotasks();
  sockets[0]?.emit('close');
  await flushMicrotasks(20);
  return { input, output, sockets, proxy };
}

describe('launcher session proxy frame engine', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('splits coalesced client frames and caches initialize by method', () => {
    const initialize = frame({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} });
    const initialized = frame({ jsonrpc: '2.0', method: 'notifications/initialized' });
    const search = toolCall(2, 'memory_search');
    const frames: string[] = [];
    const tracker = __testing.createPendingRequestsTracker();
    const splitter = __testing.createFrameSplitter((line) => {
      frames.push(line);
      tracker.handleClientFrame(line);
    });

    splitter.push(`${initialize}\n${initialized}\n${search}\n`);

    expect(frames).toEqual([initialize, initialized, search]);
    expect(tracker.getCachedInitialize()).toBe(initialize);

    const outOfPositionTracker = __testing.createPendingRequestsTracker();
    outOfPositionTracker.handleClientFrame(initialized);
    outOfPositionTracker.handleClientFrame(initialize);
    expect(outOfPositionTracker.getCachedInitialize()).toBe(initialize);
  });

  it('discards a truncated backend frame on close without clearing the pending request', () => {
    const tracker = __testing.createPendingRequestsTracker();
    const request = toolCall(7, 'memory_search');
    const emitted: string[] = [];
    const backendSplitter = __testing.createFrameSplitter((line) => {
      tracker.handleBackendFrame(line);
      emitted.push(`${line}\n`);
    });

    tracker.handleClientFrame(request);
    backendSplitter.push('{"jsonrpc":"2.0","id":7,"res');
    backendSplitter.discard();

    expect(emitted).toEqual([]);
    expect(tracker.pendingRequests.get(7)).toMatchObject({ frame: request, replayable: true });
  });

  it('classifies replayable and unsafe calls with default-deny for unknown tools', () => {
    const replayableTools = [
      'memory_search',
      'memory_context',
      'memory_match_triggers',
      'memory_quick_search',
      'memory_save',
      'session_bootstrap',
      'session_health',
      'session_resume',
      'session_status',
      'memory_stats',
      'checkpoint_list',
      'embedder_health',
      'memory_status',
    ];
    const unsafeTools = [
      'memory_delete',
      'memory_bulk_delete',
      'memory_update',
      'checkpoint_restore',
      'checkpoint_delete',
      'embedder_set',
      'memory_retention_sweep',
      'memory_ingest_start',
      'memory_ingest_cancel',
    ];

    for (const name of replayableTools) {
      expect(__testing.classifyFrame(toolCall(name, name))).toBe(true);
    }
    for (const name of unsafeTools) {
      expect(__testing.classifyFrame(toolCall(name, name))).toBe(false);
    }

    expect(__testing.classifyFrame(toolCall('unknown', 'unlisted_mutator'))).toBe(false);
    expect(__testing.classifyFrame(toolCall('unknown-status', 'something_status'))).toBe(false);
    expect(__testing.classifyFrame(toolCall('unknown-session', 'session_delete'))).toBe(false);
    expect(__testing.classifyFrame(frame({ jsonrpc: '2.0', id: 1, method: 'initialize' }))).toBe(true);
    expect(__testing.classifyFrame(frame({ jsonrpc: '2.0', id: 2, method: 'ping' }))).toBe(true);
    expect(__testing.classifyFrame(frame({ jsonrpc: '2.0', method: 'notifications/initialized' }))).toBe(true);
  });

  it('tracks pending requests and clears only matching result or error frames', () => {
    const tracker = __testing.createPendingRequestsTracker();
    const request = toolCall('req-1', 'memory_search');

    tracker.handleClientFrame(request);
    tracker.handleClientFrame(frame({ jsonrpc: '2.0', method: 'notifications/initialized' }));

    expect(tracker.pendingRequests.get('req-1')).toMatchObject({ frame: request, replayable: true });
    expect(tracker.pendingRequests.size).toBe(1);

    tracker.handleBackendFrame(frame({ jsonrpc: '2.0', id: 'other', result: {} }));
    expect(tracker.pendingRequests.has('req-1')).toBe(true);

    tracker.handleBackendFrame(frame({ jsonrpc: '2.0', id: 'req-1', result: { ok: true } }));
    expect(tracker.pendingRequests.has('req-1')).toBe(false);

    tracker.handleClientFrame(toolCall('req-2', 'memory_context'));
    tracker.handleBackendFrame(frame({ jsonrpc: '2.0', id: 'req-2', error: { code: -1, message: 'failed' } }));
    expect(tracker.pendingRequests.has('req-2')).toBe(false);
  });

  it('sends idle keepalive pings, consumes their replies, and fails unanswered pings', async () => {
    vi.useFakeTimers();
    const input = new FakeInput();
    const output = new FakeOutput();
    const sockets: FakeSocket[] = [];
    const logs: string[] = [];
    const proxy = createSessionProxy({
      socketPath: 'tcp://127.0.0.1:65535',
      stdin: input,
      stdout: output,
      probe: aliveProbe,
      connect: createConnectedSocket(sockets),
      log: (message: string) => logs.push(message),
      keepaliveIntervalMs: 10,
      keepaliveTimeoutMs: 25,
      maxReattachAttempts: 1,
      maxColdStartAttempts: 1,
    });

    await proxy.start();

    await vi.advanceTimersByTimeAsync(10);
    const firstPing = JSON.parse(sockets[0]?.writes.at(-1)?.trim() ?? '{}') as { id?: string; method?: string };
    expect(firstPing.method).toBe('ping');

    sockets[0]?.emit('data', `${frame({ jsonrpc: '2.0', id: firstPing.id, result: {} })}\n`);
    expect(outputFrames(output)).toEqual([]);

    await vi.advanceTimersByTimeAsync(10);
    const secondPing = JSON.parse(sockets[0]?.writes.at(-1)?.trim() ?? '{}') as { method?: string };
    expect(secondPing.method).toBe('ping');

    await vi.advanceTimersByTimeAsync(25);

    expect(sockets[0]?.destroyed).toBe(true);
    expect(logs.some((message) => message.includes('keepalive-timeout'))).toBe(true);
    proxy.stop();
  });

  it('rejects client requests that use the private keepalive id prefix', async () => {
    const input = new FakeInput();
    const output = new FakeOutput();
    const sockets: FakeSocket[] = [];
    const reservedId = '__launcher_session_proxy_keepalive__1';
    const request = frame({ jsonrpc: '2.0', id: reservedId, method: 'tools/list' });
    const proxy = createSessionProxy({
      socketPath: 'tcp://127.0.0.1:65535',
      stdin: input,
      stdout: output,
      probe: aliveProbe,
      connect: createConnectedSocket(sockets),
      log: () => undefined,
      maxReattachAttempts: 1,
      maxColdStartAttempts: 1,
    });

    await proxy.start();
    input.send(request);
    await flushMicrotasks();

    const reservedResponses = outputFrames(output).filter((parsed) => parsed.id === reservedId);
    expect(reservedResponses).toHaveLength(1);
    expect(reservedResponses[0]).toMatchObject({ id: reservedId, error: { code: -32600 } });
    expect(sockets[0]?.writes.some((chunk) => chunk.includes(reservedId))).toBe(false);
    proxy.stop();
  });

  it('returns exactly one retryable error for an id request queued during reattach exhaustion', async () => {
    vi.useFakeTimers();
    const input = new FakeInput();
    const output = new FakeOutput();
    const sockets: FakeSocket[] = [];
    let probeCalls = 0;
    const proxy = createSessionProxy({
      socketPath: 'tcp://127.0.0.1:65535',
      stdin: input,
      stdout: output,
      probe: () => {
        probeCalls += 1;
        return Promise.resolve(probeCalls === 1
          ? { status: 'alive', reason: 'startup' }
          : { status: 'dead', reason: 'gone' });
      },
      connect: createConnectedSocket(sockets),
      log: () => undefined,
      maxReattachAttempts: 1,
      maxColdStartAttempts: 1,
    });

    await proxy.start();
    sockets[0]?.emit('close');
    input.send(toolCall('gap-request', 'memory_search'));

    await vi.advanceTimersByTimeAsync(100);
    await flushMicrotasks();

    const retryable = outputFrames(output).filter((parsed) => parsed.id === 'gap-request');
    expect(retryable).toHaveLength(1);
    expect(retryable[0]).toMatchObject({ error: { code: -32001, data: { retryable: true } } });
    expect(output.ended).toBe(true);
  });

  it('primes coalesced post-handshake frames into the backend splitter', async () => {
    const input = new FakeInput();
    const output = new FakeOutput();
    const sockets: FakeSocket[] = [];
    const initialize = frame({ jsonrpc: '2.0', id: 'init', method: 'initialize', params: {} });
    const notification = frame({ jsonrpc: '2.0', method: 'notifications/progress', params: { ok: true } });
    const proxy = createSessionProxy({
      socketPath: 'tcp://127.0.0.1:65535',
      stdin: input,
      stdout: output,
      probe: aliveProbe,
      connect: createConnectedSocket(sockets, (socket, index) => {
        if (index !== 1) return;
        socket.onWrite = (chunk) => {
          const parsed = JSON.parse(chunk.trim()) as { id: string };
          queueMicrotask(() => {
            socket.emit('data', `${frame({ jsonrpc: '2.0', id: parsed.id, result: {} })}\n${notification}\n`);
          });
        };
      }),
      log: () => undefined,
      maxReattachAttempts: 3,
      maxColdStartAttempts: 1,
    });

    await proxy.start();
    input.send(initialize);
    sockets[0]?.emit('data', `${frame({ jsonrpc: '2.0', id: 'init', result: {} })}\n`);
    sockets[0]?.emit('close');
    await flushMicrotasks(10);

    expect(outputFrames(output)).toContainEqual(JSON.parse(notification) as Record<string, unknown>);
    proxy.stop();
  });

  it('continues reattaching after a fresh socket fails during replay', async () => {
    const input = new FakeInput();
    const output = new FakeOutput();
    const sockets: FakeSocket[] = [];
    const request = toolCall('replay-me', 'memory_search');
    const proxy = createSessionProxy({
      socketPath: 'tcp://127.0.0.1:65535',
      stdin: input,
      stdout: output,
      probe: aliveProbe,
      connect: createConnectedSocket(sockets, (socket, index) => {
        if (index !== 1) return;
        socket.onWrite = (chunk) => {
          if (chunk.includes('replay-me')) socket.emit('close');
        };
      }),
      log: () => undefined,
      maxReattachAttempts: 4,
      maxColdStartAttempts: 1,
    });

    await proxy.start();
    input.send(request);
    sockets[0]?.emit('close');
    await flushMicrotasks(20);

    expect(sockets.length).toBeGreaterThanOrEqual(3);
    expect(sockets[1]?.destroyed).toBe(true);
    expect(sockets[2]?.writes.some((chunk) => chunk.includes('replay-me'))).toBe(true);
    expect(input.paused).toBe(false);
    expect(output.ended).toBe(false);
    proxy.stop();
  });

  it('replays a pending request after a matching-version internal re-handshake', async () => {
    const { output, sockets, proxy } = await driveToRehandshake({ protocolVersion: '2025-06-18' });

    expect(sockets[1]?.writes.some((chunk) => chunk.includes('survivor'))).toBe(true);
    const mismatch = outputFrames(output).filter(
      (parsed) => (parsed.error as { code?: number } | undefined)?.code === -32002,
    );
    expect(mismatch).toHaveLength(0);
    expect(output.ended).toBe(false);
    proxy.stop();
  });

  it('fails closed when the internal re-handshake negotiates a different protocol version', async () => {
    const { output, sockets, proxy } = await driveToRehandshake({ protocolVersion: '2099-01-01' });

    const mismatch = outputFrames(output).filter(
      (parsed) => parsed.id === 'survivor' && (parsed.error as { code?: number } | undefined)?.code === -32002,
    );
    expect(mismatch).toHaveLength(1);
    expect((mismatch[0].error as { data?: { retryable?: boolean } }).data?.retryable).toBe(false);
    expect(sockets[1]?.writes.some((chunk) => chunk.includes('survivor'))).toBe(false);
    expect(output.ended).toBe(true);
    proxy.stop();
  });

  it('fails closed when a later re-handshake omits the previously negotiated protocol version', async () => {
    const { output, sockets, proxy } = await driveToRehandshake({});

    const mismatch = outputFrames(output).filter(
      (parsed) => parsed.id === 'survivor' && (parsed.error as { code?: number } | undefined)?.code === -32002,
    );
    expect(mismatch).toHaveLength(1);
    expect(sockets[1]?.writes.some((chunk) => chunk.includes('survivor'))).toBe(false);
    expect(output.ended).toBe(true);
    proxy.stop();
  });
});
