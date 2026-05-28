// -------------------------------------------------------------------
// TEST: Embedder provider dispose lifecycle
// -------------------------------------------------------------------

import { afterEach, describe, expect, it, vi } from 'vitest';

import { HfLocalProvider } from '../../shared/embeddings/providers/hf-local.js';
import type { IEmbeddingProvider } from '../../shared/types.js';

const hfMocks = vi.hoisted(() => ({
  pipeline: vi.fn(),
}));

vi.mock('@huggingface/transformers', () => ({
  pipeline: hfMocks.pipeline,
}));

const ORIGINAL_EXECUTION = process.env.SPECKIT_EMBEDDER_EXECUTION;

interface Deferred<T> {
  readonly promise: Promise<T>;
  readonly resolve: (value: T) => void;
  readonly reject: (error: unknown) => void;
}

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function vector(dim: number): Float32Array {
  const out = new Float32Array(dim);
  out[0] = 1;
  return out;
}

function mockProvider(overrides: Partial<IEmbeddingProvider> = {}): IEmbeddingProvider {
  return {
    generateEmbedding: vi.fn(async () => vector(3)),
    embedDocument: vi.fn(async () => vector(3)),
    embedQuery: vi.fn(async () => vector(3)),
    warmup: vi.fn(async () => true),
    getMetadata: vi.fn(() => ({ provider: 'hf-local', model: 'test-model', dim: 3, healthy: true })),
    getProfile: vi.fn(() => ({ provider: 'hf-local', model: 'test-model', dim: 3, dtype: 'q8', slug: 'hf-local__test-model__3__q8' })),
    healthCheck: vi.fn(async () => true),
    getProviderName: vi.fn(() => 'mock provider'),
    ...overrides,
  };
}

afterEach(() => {
  hfMocks.pipeline.mockReset();
  vi.restoreAllMocks();
  vi.resetModules();
  vi.doUnmock('../lib/embedders/sidecar-client.js');
  vi.doUnmock('@spec-kit/shared/embeddings');
  vi.doUnmock('@spec-kit/shared/embeddings/factory');
  if (ORIGINAL_EXECUTION === undefined) {
    delete process.env.SPECKIT_EMBEDDER_EXECUTION;
  } else {
    process.env.SPECKIT_EMBEDDER_EXECUTION = ORIGINAL_EXECUTION;
  }
});

describe('HfLocalProvider.dispose', () => {
  it('waits for the raw native run before synchronously disposing the session', async () => {
    const runStarted = deferred<void>();
    let runSettled = false;
    const dispose = vi.fn(() => {
      if (!runSettled) {
        throw new Error('native abort: disposed during raw run');
      }
    });
    const extractor = Object.assign(
      vi.fn(() => {
        runStarted.resolve();
        return new Promise<{ data: Float32Array }>((resolve) => {
          setImmediate(() => {
            runSettled = true;
            resolve({ data: vector(3) });
          });
        });
      }),
      { dispose, model: { sessions: { only: {} } } },
    );
    const provider = new HfLocalProvider({ model: 'mock-model', dim: 3, maxTextLength: 100 });
    provider.extractor = extractor as NonNullable<typeof provider.extractor>;

    const embedding = provider.generateEmbedding('raw-run');
    await runStarted.promise;
    const disposed = provider.dispose();
    await Promise.resolve();

    expect(dispose).not.toHaveBeenCalled();
    await expect(embedding).resolves.toEqual(vector(3));
    await expect(disposed).resolves.toBeUndefined();
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it('disposes a model that finishes loading after dispose starts without running inference', async () => {
    const loadStarted = deferred<void>();
    const loadedExtractor = deferred<NonNullable<HfLocalProvider['extractor']>>();
    const dispose = vi.fn();
    const extractor = Object.assign(
      vi.fn(async () => ({ data: vector(3) })),
      { dispose, model: { sessions: { only: {} } } },
    ) as NonNullable<HfLocalProvider['extractor']>;

    hfMocks.pipeline.mockImplementationOnce(() => {
      loadStarted.resolve();
      return loadedExtractor.promise;
    });

    const provider = new HfLocalProvider({ model: 'mock-model', dim: 3, maxTextLength: 100 });
    const embedding = provider.generateEmbedding('cold-load');
    await loadStarted.promise;
    const disposed = provider.dispose();
    await Promise.resolve();

    expect(dispose).not.toHaveBeenCalled();
    loadedExtractor.resolve(extractor);

    await expect(embedding).rejects.toThrow('has been disposed');
    await expect(disposed).resolves.toBeUndefined();
    expect(extractor).not.toHaveBeenCalled();
    expect(dispose).toHaveBeenCalledTimes(1);
  });
});

describe('execution-router provider teardown', () => {
  async function importRouterWithMocks(provider: IEmbeddingProvider = mockProvider()) {
    let nextPid = 1000;
    const shutdownPids: number[] = [];
    class MockSidecarClient {
      readonly name: string;
      readonly dim: number;
      readonly dimensions: number;
      readonly backend: string;
      private pid: number | null = null;
      private requestCount = 0;

      constructor(options: { readonly model: string; readonly dimensions: number; readonly backend?: string }) {
        this.name = options.model;
        this.dimensions = options.dimensions;
        this.dim = options.dimensions;
        this.backend = options.backend ?? 'sentence-transformers';
      }

      async embed(texts: ReadonlyArray<string>): Promise<Float32Array[]> {
        if (this.pid === null) {
          this.pid = nextPid;
          nextPid += 1;
        }
        this.requestCount += 1;
        return texts.map(() => vector(this.dimensions));
      }

      getWorkerInfo(): { readonly pid: number; readonly request_count: number } | null {
        if (this.pid === null) {
          return null;
        }
        return { pid: this.pid, request_count: this.requestCount };
      }

      async shutdown(): Promise<void> {
        if (this.pid !== null) {
          shutdownPids.push(this.pid);
        }
        this.pid = null;
      }
    }

    vi.doMock('../lib/embedders/sidecar-client.js', () => ({
      SidecarClient: MockSidecarClient,
      toBackendKind: (providerName: string | undefined) => (providerName === 'ollama' ? 'ollama' : 'sentence-transformers'),
    }));
    vi.doMock('@spec-kit/shared/embeddings', () => ({
      getStartupEmbeddingProfile: () => ({ provider: 'hf-local', model: 'mock-model', dim: 3 }),
    }));
    vi.doMock('@spec-kit/shared/embeddings/factory', () => ({
      createEmbeddingsProvider: vi.fn(async () => provider),
    }));

    const router = await import('../lib/embedders/execution-router.js');
    return { router, shutdownPids };
  }

  it('recycles the active auto-policy sidecar so the next embed re-forks', async () => {
    process.env.SPECKIT_EMBEDDER_EXECUTION = 'auto';
    const { router, shutdownPids } = await importRouterWithMocks();

    const first = router.getEmbedderAdapter('hf-local', 'sidecar-model', 3);
    await first.embed(['one']);
    const firstPid = router.getSidecarWorkerSnapshot()['hf-local:sidecar-model']?.pid;

    await router.teardownEmbedderAfterSwap('hf-local', 'sidecar-model');
    const second = router.getEmbedderAdapter('hf-local', 'sidecar-model', 3);
    await second.embed(['two']);
    const secondPid = router.getSidecarWorkerSnapshot()['hf-local:sidecar-model']?.pid;

    expect(shutdownPids).toEqual([firstPid]);
    expect(secondPid).toBeDefined();
    expect(secondPid).not.toBe(firstPid);
  });

  it('disposes the direct-policy factory-backed adapter provider on swap teardown', async () => {
    process.env.SPECKIT_EMBEDDER_EXECUTION = 'direct';
    const dispose = vi.fn(async () => undefined);
    const provider = mockProvider({ dispose });
    const { router } = await importRouterWithMocks(provider);

    const adapter = router.getEmbedderAdapter('hf-local', 'direct-model', 3);
    await adapter.embed(['one']);
    expect(router.getDirectAdapterCacheKeys()).toEqual(['hf-local:direct-model']);

    await router.teardownEmbedderAfterSwap('hf-local', 'direct-model');

    expect(dispose).toHaveBeenCalledTimes(1);
    expect(router.getDirectAdapterCacheKeys()).toEqual([]);
  });
});
