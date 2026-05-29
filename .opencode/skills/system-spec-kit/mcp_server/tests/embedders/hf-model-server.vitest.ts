// -------------------------------------------------------------------
// TEST: HF model server
// -------------------------------------------------------------------

import { createRequire } from 'node:module';
import { mkdtempSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const repoRoot = resolve(fileURLToPath(new URL('../../../../../..', import.meta.url)));
const serverModule = require(join(repoRoot, '.opencode/bin/hf-model-server.cjs')) as {
  createHfModelServer: (options?: Record<string, unknown>) => HfModelServer;
  INFERENCE_DRAIN_TIMEOUT_MS: number;
  resolveListenTarget: (options?: Record<string, unknown>) => string;
  toConnectionOptions: (socketPath: string) => string | { host: string; port: number };
};

interface HfModelServer {
  listen: (target?: string) => Promise<HfModelServerHandle>;
  close: (options?: { disposeModel?: boolean }) => Promise<void>;
  dispose: () => Promise<void>;
  inject: <T = Record<string, unknown>>(method: string, routePath: string, body?: unknown) => Promise<JsonResponse<T>>;
}

interface HfModelServerHandle {
  endpoint: string;
  socketPath: string;
  close: (options?: { disposeModel?: boolean }) => Promise<void>;
  inject: <T = Record<string, unknown>>(method: string, routePath: string, body?: unknown) => Promise<JsonResponse<T>>;
}

interface JsonResponse<T = Record<string, unknown>> {
  statusCode: number;
  body: T;
}

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
}

type FakeExtractor = ((text: string, options: { pooling: string; normalize: boolean }) => Promise<{ data: Float32Array }>) & {
  calls: string[];
  dispose: ReturnType<typeof vi.fn>;
  model: { sessions: Record<string, unknown> };
};

const tempDirs: string[] = [];
const apps: HfModelServer[] = [];

function deferred<T>(): Deferred<T> {
  let resolvePromise!: (value: T) => void;
  let rejectPromise!: (error: unknown) => void;
  const promise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  return {
    promise,
    resolve: resolvePromise,
    reject: rejectPromise,
  };
}

function tempDir(prefix: string): string {
  const dir = mkdtempSync(join('/private/tmp', prefix));
  tempDirs.push(dir);
  return dir;
}

function createFakeExtractor(dim = 4, sessions: Record<string, unknown> = { main: {} }): FakeExtractor {
  const calls: string[] = [];
  const extractor = (async (text: string) => {
    calls.push(text);
    return {
      data: new Float32Array(Array.from({ length: dim }, (_value, index) => text.length + index)),
    };
  }) as FakeExtractor;
  extractor.calls = calls;
  extractor.dispose = vi.fn(async () => undefined);
  extractor.model = { sessions };
  return extractor;
}

async function waitForReady(handle: HfModelServerHandle): Promise<Record<string, unknown>> {
  const deadline = Date.now() + 1000;
  while (Date.now() <= deadline) {
    const health = await handle.inject('GET', '/api/health');
    if (health.body.state === 'ready') {
      return health.body;
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 10));
  }
  throw new Error('Timed out waiting for hf-model-server ready state');
}

async function startServer(options: Record<string, unknown>, target: string): Promise<HfModelServerHandle> {
  const app = serverModule.createHfModelServer({
    logger: {
      error: () => undefined,
      warn: () => undefined,
    },
    listen: async (_server: unknown, listenTarget: string) => {
      if (listenTarget === 'tcp://127.0.0.1:0') {
        return 'tcp://127.0.0.1:49152';
      }
      return listenTarget;
    },
    ...options,
  });
  apps.push(app);
  return await app.listen(target);
}

describe('hf-model-server.cjs', () => {
  afterEach(async () => {
    vi.useRealTimers();
    while (apps.length > 0) {
      const app = apps.pop();
      if (app) {
        await app.close({ disposeModel: false });
      }
    }
    while (tempDirs.length > 0) {
      rmSync(tempDirs.pop()!, { recursive: true, force: true });
    }
  });

  it('does not bind or load a model when the module is required', () => {
    expect(serverModule.createHfModelServer).toEqual(expect.any(Function));
  });

  it('resolves default Unix-socket and tcp listen targets', () => {
    const socketDir = tempDir('hf-model-server-target-');
    expect(serverModule.resolveListenTarget({ env: { SPECKIT_IPC_SOCKET_DIR: socketDir } })).toBe(join(socketDir, 'hf-embed.sock'));
    expect(serverModule.resolveListenTarget({ env: { SPECKIT_IPC_SOCKET_DIR: 'tcp://127.0.0.1:0' } })).toBe('tcp://127.0.0.1:0');
    expect(serverModule.resolveListenTarget({ env: { HF_EMBED_SERVER_URL: 'tcp://127.0.0.1:31337' } })).toBe('tcp://127.0.0.1:31337');
    expect(serverModule.toConnectionOptions('tcp://127.0.0.1:31337')).toEqual({
      host: '127.0.0.1',
      port: 31337,
    });
  });

  it('answers health while loading on a Unix socket, then reports ready metadata', async () => {
    const load = deferred<FakeExtractor>();
    const extractor = createFakeExtractor(3);
    const loadModel = vi.fn(async () => ({
      extractor: await load.promise,
      device: 'cpu',
      loadTimeMs: 42,
    }));
    const socketPath = join(tempDir('hf-model-server-uds-'), 'hf-embed.sock');
    const handle = await startServer({ loadModel, selfWarmInput: 'warm' }, socketPath);

    const loading = await handle.inject('GET', '/api/health');
    expect(loading.statusCode).toBe(200);
    expect(loading.body).toMatchObject({
      state: 'loading',
      model: 'nomic-ai/nomic-embed-text-v1.5',
      dim: null,
      device: null,
      loadTimeMs: null,
      loadStartedAt: expect.any(Number),
      lastSuccessfulEmbedAt: null,
      inFlight: 0,
    });

    load.resolve(extractor);
    const ready = await waitForReady(handle);

    expect(ready).toMatchObject({
      state: 'ready',
      dim: 3,
      device: 'cpu',
      loadTimeMs: 42,
      loadStartedAt: expect.any(Number),
      lastSuccessfulEmbedAt: null,
      inFlight: 0,
    });
    expect(extractor.calls).toEqual(['warm']);
    expect(loadModel).toHaveBeenCalledTimes(1);
  });

  it('re-stamps loadProgressAt when a device fallback starts a new load attempt', async () => {
    const load = deferred<FakeExtractor>();
    const enteredCpuAttempt = deferred<void>();
    const extractor = createFakeExtractor(3);
    const loadModel = vi.fn(async (options: {
      onLoadAttemptStart?: (attempt: Record<string, unknown>) => void;
    }) => {
      options.onLoadAttemptStart?.({ device: 'mps', startedAt: 1000, timeoutMs: 120000 });
      options.onLoadAttemptStart?.({ device: 'cpu', startedAt: 2000, timeoutMs: 120000 });
      enteredCpuAttempt.resolve();
      return {
        extractor: await load.promise,
        device: 'cpu',
        loadTimeMs: 250,
      };
    });
    const socketPath = join(tempDir('hf-model-server-progress-'), 'hf-embed.sock');
    const handle = await startServer({ loadModel, selfWarm: false }, socketPath);

    await enteredCpuAttempt.promise;
    const loading = await handle.inject('GET', '/api/health');
    expect(loading.body).toMatchObject({
      state: 'loading',
      loadStartedAt: expect.any(Number),
      loadProgressAt: 2000,
    });

    load.resolve(extractor);
    await waitForReady(handle);
  });

  it('awaits the in-flight load for tcp embeds and derives dim from runtime output', async () => {
    const load = deferred<FakeExtractor>();
    const extractor = createFakeExtractor(4);
    const loadModel = vi.fn(async () => ({
      extractor: await load.promise,
      device: 'cpu',
      loadTimeMs: 7,
    }));
    const handle = await startServer({ loadModel, selfWarmInput: 'warm' }, 'tcp://127.0.0.1:0');

    let settled = false;
    const embedPromise = handle.inject<{
      embeddings: number[][];
      dim: number;
    }>('POST', '/api/embed', {
      model: 'nomic-ai/nomic-embed-text-v1.5',
      input: ['abc'],
      inputType: 'query',
    }).then((response) => {
      settled = true;
      return response;
    });

    await new Promise((resolvePromise) => setTimeout(resolvePromise, 25));
    expect(settled).toBe(false);

    load.resolve(extractor);
    const response = await embedPromise;

    expect(response.statusCode).toBe(200);
    expect(response.body.dim).toBe(4);
    expect(response.body.embeddings).toEqual([[3, 4, 5, 6]]);
    expect(extractor.calls).toEqual(['warm', 'abc']);
    expect(loadModel).toHaveBeenCalledTimes(1);
  });

  it('reports in-flight native runs and stamps lastSuccessfulEmbedAt after successful embeds', async () => {
    const run = deferred<{ data: Float32Array }>();
    const extractor = (async () => await run.promise) as FakeExtractor;
    extractor.calls = [];
    extractor.dispose = vi.fn(async () => undefined);
    extractor.model = { sessions: { main: {} } };
    const loadModel = vi.fn(async () => ({ extractor, device: 'cpu', loadTimeMs: 1 }));
    const handle = await startServer({ loadModel, selfWarm: false }, 'tcp://127.0.0.1:0');
    await waitForReady(handle);

    const embedPromise = handle.inject<{ embeddings: number[][]; dim: number }>('POST', '/api/embed', {
      input: ['slow'],
    });
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 10));

    const during = await handle.inject('GET', '/api/health');
    expect(during.body).toMatchObject({
      state: 'ready',
      inFlight: 1,
      lastSuccessfulEmbedAt: null,
    });

    run.resolve({ data: new Float32Array([1, 2, 3]) });
    const response = await embedPromise;
    expect(response.statusCode).toBe(200);

    const after = await handle.inject('GET', '/api/health');
    expect(after.body).toMatchObject({
      state: 'ready',
      inFlight: 0,
      lastSuccessfulEmbedAt: expect.any(Number),
    });
  });

  it('bounds dispose drain for uncancellable native runs at the inference drain timeout', async () => {
    const run = deferred<{ data: Float32Array }>();
    const extractor = (async () => await run.promise) as FakeExtractor;
    extractor.calls = [];
    extractor.dispose = vi.fn(async () => undefined);
    extractor.model = { sessions: { main: {} } };
    const loadModel = vi.fn(async () => ({ extractor, device: 'cpu', loadTimeMs: 1 }));
    const handle = await startServer({ loadModel, selfWarm: false }, 'tcp://127.0.0.1:0');
    await waitForReady(handle);
    vi.useFakeTimers();
    const app = apps.pop();
    expect(app).toBeDefined();

    const embedPromise = handle.inject('POST', '/api/embed', { input: ['stuck'] });
    void embedPromise.catch(() => undefined);
    await vi.advanceTimersByTimeAsync(0);

    const disposePromise = app!.dispose();
    const disposeAssertion = expect(disposePromise).rejects.toThrow(`native inference drain after ${serverModule.INFERENCE_DRAIN_TIMEOUT_MS}ms`);
    await vi.advanceTimersByTimeAsync(serverModule.INFERENCE_DRAIN_TIMEOUT_MS);
    await disposeAssertion;

    run.resolve({ data: new Float32Array([1, 2]) });
    await expect(embedPromise).resolves.toMatchObject({ statusCode: 200 });
    await app!.close({ disposeModel: false });
  });

  it('rejects dispose when the loaded extractor does not expose exactly one native session', async () => {
    const extractor = createFakeExtractor(2, { first: {}, second: {} });
    const loadModel = vi.fn(async () => ({
      extractor,
      device: 'cpu',
      loadTimeMs: 1,
    }));
    const handle = await startServer({ loadModel, selfWarmInput: 'warm' }, 'tcp://127.0.0.1:0');
    await waitForReady(handle);
    const app = apps.pop();

    await expect(app?.dispose()).rejects.toThrow('Expected exactly one native session before dispose, got 2');
    await app?.close({ disposeModel: false });
    expect(extractor.dispose).not.toHaveBeenCalled();
  });

  it('stays ready when self-warm fails (model loaded; phase-004 probe must not see error)', async () => {
    const calls: string[] = [];
    const extractor = (async (text: string) => {
      calls.push(text);
      if (text === 'warm') {
        throw new Error('self-warm boom');
      }
      return { data: new Float32Array([text.length, text.length + 1]) };
    }) as FakeExtractor;
    extractor.calls = calls;
    extractor.dispose = vi.fn(async () => undefined);
    extractor.model = { sessions: { main: {} } };
    const loadModel = vi.fn(async () => ({ extractor, device: 'cpu', loadTimeMs: 5 }));
    const handle = await startServer({ loadModel, selfWarmInput: 'warm' }, 'tcp://127.0.0.1:0');

    // Despite the self-warm throw, the model loaded, so health must reach 'ready'.
    const ready = await waitForReady(handle);
    expect(ready.state).toBe('ready');

    const embed = await handle.inject<{ embeddings: number[][]; dim: number }>('POST', '/api/embed', { input: ['abc'] });
    expect(embed.statusCode).toBe(200);
    expect(embed.body.dim).toBe(2);
  });

  it('returns 400 (not a leaky 500) for a null embed body', async () => {
    const extractor = createFakeExtractor(2);
    const loadModel = vi.fn(async () => ({ extractor, device: 'cpu', loadTimeMs: 1 }));
    const handle = await startServer({ loadModel, selfWarmInput: 'warm' }, 'tcp://127.0.0.1:0');
    await waitForReady(handle);

    const response = await handle.inject('POST', '/api/embed', null);
    expect(response.statusCode).toBe(400);
  });
});
