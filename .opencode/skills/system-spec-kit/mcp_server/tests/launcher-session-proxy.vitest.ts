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
  resolveColdStartAttempts(): number;
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

  it('reassembles a multibyte frame split across chunk boundaries without U+FFFD corruption', () => {
    // The payload mixes CJK (3-byte) and an emoji (4-byte surrogate pair) so a naive
    // per-chunk chunk.toString('utf8') would drop replacement chars at every split.
    const payload = '日本語テスト 😀 mixed 한국어';
    const frameValue = frame({ jsonrpc: '2.0', id: 'mb', method: 'tools/call', params: { name: 'memory_search', text: payload } });
    const frameBytes = Buffer.from(`${frameValue}\n`, 'utf8');

    const received: string[] = [];
    const splitter = __testing.createFrameSplitter((line) => received.push(line));

    // Split at every byte offset so each boundary lands mid-multibyte-sequence at least once.
    for (let cut = 1; cut < frameBytes.length; cut += 1) {
      received.length = 0;
      splitter.discard();
      splitter.push(frameBytes.subarray(0, cut));
      splitter.push(frameBytes.subarray(cut));

      expect(received).toHaveLength(1);
      expect(received[0]).not.toContain('�');
      const parsed = JSON.parse(received[0]) as { params: { text: string } };
      expect(parsed.params.text).toBe(payload);
    }
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

  it('does not restart the reattach loop after give-up while stop is deferred by output backpressure', async () => {
    vi.useFakeTimers();
    const input = new FakeInput();
    const sockets: FakeSocket[] = [];
    const logs: string[] = [];
    let probeCalls = 0;

    // Output stays under backpressure (write returns false) so requestOutputEnd defers stop()
    // until a drain that never arrives. Before the fix this kept state='REATTACHING', letting
    // the ensureReattachRunning guard kick off a fresh 40-attempt loop.
    class BackpressuredOutput extends FakeOutput {
      public write(chunk: string): boolean {
        this.writes.push(String(chunk));
        return false;
      }
    }
    const output = new BackpressuredOutput();

    const proxy = createSessionProxy({
      socketPath: 'tcp://127.0.0.1:65535',
      stdin: input,
      stdout: output,
      probe: () => {
        probeCalls += 1;
        // First probe (cold start) is alive; every reattach probe is dead, forcing give-up.
        return Promise.resolve(probeCalls === 1
          ? { status: 'alive', reason: 'startup' }
          : { status: 'dead', reason: 'gone' });
      },
      connect: createConnectedSocket(sockets),
      log: (message: string) => logs.push(message),
      maxReattachAttempts: 2,
      maxColdStartAttempts: 1,
    });

    await proxy.start();
    // Leave a pending request so give-up has a frame to enqueue (triggering the deferred stop()).
    input.send(toolCall('stuck', 'memory_search'));
    await flushMicrotasks();
    sockets[0]?.emit('close');

    await vi.advanceTimersByTimeAsync(5000);
    await flushMicrotasks(30);
    const probesAfterGiveUp = probeCalls;
    await vi.advanceTimersByTimeAsync(5000);
    await flushMicrotasks(30);

    // No fresh reattach loop must start after give-up: probe count is stable and the guard's
    // restart log never fires. stop() stays deferred (output never drained) — that is expected.
    expect(logs.some((message) => message.includes('reattach loop guard restarting'))).toBe(false);
    expect(probeCalls).toBe(probesAfterGiveUp);
    proxy.stop();
  });

  describe('resolveColdStartAttempts (cold-start bound)', () => {
    const savedEnv = process.env.SPECKIT_PROXY_COLD_START_ATTEMPTS;
    afterEach(() => {
      if (savedEnv === undefined) delete process.env.SPECKIT_PROXY_COLD_START_ATTEMPTS;
      else process.env.SPECKIT_PROXY_COLD_START_ATTEMPTS = savedEnv;
    });

    it('defaults to a bounded 30 attempts (not the old ~176s / 120-attempt silent window)', () => {
      delete process.env.SPECKIT_PROXY_COLD_START_ATTEMPTS;
      expect(__testing.resolveColdStartAttempts()).toBe(30);
    });

    it('honors a positive SPECKIT_PROXY_COLD_START_ATTEMPTS override', () => {
      process.env.SPECKIT_PROXY_COLD_START_ATTEMPTS = '8';
      expect(__testing.resolveColdStartAttempts()).toBe(8);
    });

    it('falls back to the default for non-positive or non-numeric env', () => {
      process.env.SPECKIT_PROXY_COLD_START_ATTEMPTS = '0';
      expect(__testing.resolveColdStartAttempts()).toBe(30);
      process.env.SPECKIT_PROXY_COLD_START_ATTEMPTS = 'nope';
      expect(__testing.resolveColdStartAttempts()).toBe(30);
    });
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

  it('keeps a queued request alive when stdin closes during reattach', async () => {
    const input = new FakeInput();
    const output = new FakeOutput();
    const sockets: FakeSocket[] = [];
    const connectFreshSocket: Array<() => void> = [];
    const request = toolCall('stdin-ended', 'memory_search');
    const response = frame({ jsonrpc: '2.0', id: 'stdin-ended', result: { ok: true } });
    const proxy = createSessionProxy({
      socketPath: 'tcp://127.0.0.1:65535',
      stdin: input,
      stdout: output,
      probe: aliveProbe,
      connect: () => {
        const socket = new FakeSocket();
        sockets.push(socket);
        socket.onWrite = (chunk) => {
          if (!chunk.includes('stdin-ended')) return;
          queueMicrotask(() => {
            socket.emit('data', `${response}\n`);
            socket.emit('close');
          });
        };
        if (sockets.length === 1) {
          queueMicrotask(() => socket.emit('connect'));
        } else {
          connectFreshSocket.push(() => socket.emit('connect'));
        }
        return socket;
      },
      log: () => undefined,
      maxReattachAttempts: 3,
      maxColdStartAttempts: 1,
    });

    await proxy.start();
    sockets[0]?.emit('close');
    await flushMicrotasks();
    input.send(request);
    input.emit('end');
    input.emit('close');
    connectFreshSocket.shift()?.();
    await flushMicrotasks(20);

    expect(sockets[1]?.writes.some((chunk) => chunk.includes('stdin-ended'))).toBe(true);
    expect(outputFrames(output)).toContainEqual(JSON.parse(response) as Record<string, unknown>);
    expect(output.ended).toBe(true);
    proxy.stop();
  });

  it('does not double-send initialize when the backend dies before answering it', async () => {
    const input = new FakeInput();
    const output = new FakeOutput();
    const sockets: FakeSocket[] = [];
    const initialize = frame({ jsonrpc: '2.0', id: 'init', method: 'initialize', params: {} });
    const proxy = createSessionProxy({
      socketPath: 'tcp://127.0.0.1:65535',
      stdin: input,
      stdout: output,
      probe: aliveProbe,
      connect: createConnectedSocket(sockets, (socket, index) => {
        if (index !== 1) return;
        // The fresh backend answers the internal re-handshake initialize.
        socket.onWrite = (chunk) => {
          const parsed = JSON.parse(chunk.trim()) as { id: string; method?: string };
          if (parsed.method === 'initialize') {
            queueMicrotask(() => {
              socket.emit('data', `${frame({ jsonrpc: '2.0', id: parsed.id, result: { protocolVersion: '2025-06-18' } })}\n`);
            });
          }
        };
      }),
      log: () => undefined,
      maxReattachAttempts: 3,
      maxColdStartAttempts: 1,
    });

    await proxy.start();
    // Client sends initialize; the first backend dies BEFORE answering it, so initialize
    // stays pending and is carried into the reattach replay snapshot.
    input.send(initialize);
    await flushMicrotasks();
    sockets[0]?.emit('close');
    await flushMicrotasks(20);

    // The fresh socket must receive initialize exactly once (the internal handshake), never a
    // second time from replaySnapshot. A duplicate would re-run backend initialize side effects.
    const initializeWrites = (sockets[1]?.writes ?? []).filter((chunk) => chunk.includes('"method":"initialize"'));
    expect(initializeWrites).toHaveLength(1);

    // The client receives exactly one initialize response (forwarded from the handshake).
    const clientInitResponses = outputFrames(output).filter(
      (parsed) => parsed.id === 'init' && Object.prototype.hasOwnProperty.call(parsed, 'result'),
    );
    expect(clientInitResponses).toHaveLength(1);
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
