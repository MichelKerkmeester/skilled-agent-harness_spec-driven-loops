// ───────────────────────────────────────────────────────────────
// MODULE: Model-server demand listener probe-vs-demand discrimination
// ───────────────────────────────────────────────────────────────
// A launcher liveness probe must never be treated as embed demand. The
// demand HTTP listener distinguishes an internal probe (carrying the
// x-speckit-probe: liveness marker) from a genuine consumer demand: the
// probe returns a non-spawning reply, while a request WITHOUT the marker
// still reaches the spawn path. This guards against a sibling launcher's
// boot-time health check waking — and, on hosts where the local model is
// unsupported, crash-looping — a model server no consumer needs.

import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const supervisionModulePath = resolve(repoRoot, '.opencode/bin/lib/model-server-supervision.cjs');
const { createModelServerControl } = require(supervisionModulePath) as {
  createModelServerControl: (deps: Record<string, unknown>) => {
    start: (options?: Record<string, unknown>) => Promise<{ started: boolean; reason?: string }>;
    clearTimers: () => void;
  };
};

const SOCKET_PATH = 'tcp://127.0.0.1:65500';

// Minimal stand-in for an http.IncomingMessage as seen by the demand handler.
interface FakeRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
}

// Minimal stand-in for an http.ServerResponse: captures the status + JSON body the handler writes.
class FakeResponse {
  public statusCode = 0;
  public body = '';
  public headers: Record<string, unknown> = {};

  public writeHead(statusCode: number, headers: Record<string, unknown>): void {
    this.statusCode = statusCode;
    this.headers = headers;
  }

  public end(body: string): void {
    this.body = body;
  }

  public get payload(): Record<string, unknown> {
    return this.body ? (JSON.parse(this.body) as Record<string, unknown>) : {};
  }
}

// A fake http.Server that captures the demand handler and resolves listen() synchronously, so the
// test can invoke the handler directly without binding a real socket.
class FakeHttpServer {
  public readonly handler: (request: FakeRequest, response: FakeResponse) => void;
  private listeners: Record<string, Array<(...args: unknown[]) => void>> = {};

  constructor(handler: (request: FakeRequest, response: FakeResponse) => void) {
    this.handler = handler;
  }

  public on(event: string, cb: (...args: unknown[]) => void): this {
    (this.listeners[event] ||= []).push(cb);
    return this;
  }

  public once(event: string, cb: (...args: unknown[]) => void): this {
    return this.on(event, cb);
  }

  public off(): this {
    return this;
  }

  public listen(): void {
    queueMicrotask(() => {
      for (const cb of this.listeners.listening || []) cb();
    });
  }

  public close(cb?: () => void): void {
    cb?.();
  }

  public address(): { port: number } {
    return { port: 65500 };
  }
}

interface Harness {
  start: (options?: Record<string, unknown>) => Promise<{ started: boolean; reason?: string }>;
  clearTimers: () => void;
  capturedServer: FakeHttpServer | null;
  spawnCalls: number;
}

function buildHarness(): Harness {
  const harness: Harness = {
    start: async () => ({ started: false }),
    clearTimers: () => undefined,
    capturedServer: null,
    spawnCalls: 0,
  };

  const control = createModelServerControl({
    log: () => undefined,
    env: {},
    // tcp:// socket path keeps prepareModelServerDemandTarget off the filesystem.
    resolveSocketPath: () => SOCKET_PATH,
    // No active give-up cooldown, so a genuine demand reaches the spawn path.
    readGiveUpUntil: () => 0,
    liveness: () => 'dead',
    readModelServerPid: () => null,
    // Observe whether launch() reached the spawn primitive. A fake child satisfies launch()'s pid +
    // event-wiring contract so it returns cleanly.
    spawnFn: (): { pid: number; on: () => void } => {
      harness.spawnCalls += 1;
      return { pid: 4242, on: () => undefined };
    },
    processRowsRunner: () => [],
    setInterval: () => ({ unref: () => undefined }),
    clearInterval: () => undefined,
    setTimeout: () => ({ unref: () => undefined }),
    clearTimeout: () => undefined,
    httpCreateServer: (handler: (request: FakeRequest, response: FakeResponse) => void) => {
      const server = new FakeHttpServer(handler);
      harness.capturedServer = server;
      return server;
    },
  });

  harness.start = control.start;
  harness.clearTimers = control.clearTimers;
  return harness;
}

describe('model-server demand listener: probe vs demand', () => {
  let harness: Harness;

  afterEach(() => {
    harness?.clearTimers();
    vi.restoreAllMocks();
  });

  async function armHandler(): Promise<(request: FakeRequest, response: FakeResponse) => void> {
    harness = buildHarness();
    // skipPrepare avoids the respawn-lock/filesystem prep; we only need the captured demand handler.
    const result = await harness.start({ skipPrepare: true, socketPath: SOCKET_PATH });
    expect(result.started).toBe(true);
    const server = harness.capturedServer;
    if (!server) throw new Error('demand http server was not created');
    return server.handler.bind(server);
  }

  it('returns a non-spawning liveness reply for a probe-marked request', async () => {
    const handler = await armHandler();
    const response = new FakeResponse();
    handler(
      { method: 'GET', url: '/api/health', headers: { 'x-speckit-probe': 'liveness' } },
      response,
    );

    expect(harness.spawnCalls).toBe(0);
    expect(response.statusCode).toBe(503);
    expect(response.payload).toMatchObject({ state: 'no-resident', reason: 'liveness-probe' });
  });

  it('is case-insensitive on the probe marker value', async () => {
    const handler = await armHandler();
    const response = new FakeResponse();
    handler(
      { method: 'GET', url: '/api/health', headers: { 'x-speckit-probe': 'LIVENESS' } },
      response,
    );

    expect(harness.spawnCalls).toBe(0);
    expect(response.payload).toMatchObject({ reason: 'liveness-probe' });
  });

  it('reaches the spawn path for a genuine demand without the probe marker', async () => {
    const handler = await armHandler();
    const response = new FakeResponse();
    handler({ method: 'GET', url: '/api/health', headers: {} }, response);

    expect(harness.spawnCalls).toBe(1);
    expect(response.payload).toMatchObject({ modelServerLaunchRequested: true });
  });
});
