// ───────────────────────────────────────────────────────────────
// TEST: Embedder execution router
// ───────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => ({
  createEmbeddingsProvider: vi.fn(),
  getAdapter: vi.fn(),
  profile: {
    provider: 'hf-local',
    model: 'default-model',
    dim: 384,
  },
}));

vi.mock('@spec-kit/shared/embeddings', () => ({
  getStartupEmbeddingProfile: () => mockState.profile,
}));

vi.mock('@spec-kit/shared/embeddings/factory', () => ({
  createEmbeddingsProvider: mockState.createEmbeddingsProvider,
}));

vi.mock('../../lib/embedders/registry.js', () => ({
  getAdapter: mockState.getAdapter,
}));

async function loadRouter() {
  return import('../../lib/embedders/execution-router.js');
}

async function loadTestables() {
  const mod = await import('../../lib/embedders/execution-router.testables.js');
  return mod.__embedderExecutionRouterTestables;
}

describe('execution router', () => {
  const originalExecutionPolicy = process.env.SPECKIT_EMBEDDER_EXECUTION;

  beforeEach(async () => {
    delete process.env.SPECKIT_EMBEDDER_EXECUTION;
    mockState.getAdapter.mockReset();
    mockState.createEmbeddingsProvider.mockReset();
    mockState.createEmbeddingsProvider.mockImplementation(async ({ model }: { model: string }) => ({
      embedDocument: vi.fn(async () => new Float32Array(model === 'model-a' ? [1, 0] : [0, 1])),
      embedQuery: vi.fn(async () => new Float32Array(model === 'model-a' ? [2, 0] : [0, 2])),
    }));
    mockState.profile = {
      provider: 'hf-local',
      model: 'default-model',
      dim: 384,
    };
    const testables = await loadTestables();
    testables.clear();
  });

  afterEach(() => {
    if (originalExecutionPolicy === undefined) {
      delete process.env.SPECKIT_EMBEDDER_EXECUTION;
    } else {
      process.env.SPECKIT_EMBEDDER_EXECUTION = originalExecutionPolicy;
    }
    vi.restoreAllMocks();
  });

  it('keeps the testables aggregate out of the production router module (F6)', async () => {
    const router = await loadRouter();
    const testables = await loadTestables();

    expect('__embedderExecutionRouterTestables' in router).toBe(false);
    expect(testables.resolveDimensions('hf-local', 'default-model', 123)).toBe(123);
  });

  it('resolves dimensions from config override or default profile only (F52)', async () => {
    const testables = await loadTestables();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(testables.resolveDimensions('openai', 'text-embedding-3-small', 1536)).toBe(1536);
    expect(warnSpy).not.toHaveBeenCalled();

    mockState.profile = {
      provider: 'openai',
      model: 'text-embedding-3-small',
      dim: 512,
    };

    expect(testables.resolveDimensions('openai', 'text-embedding-3-small')).toBe(512);
    expect(mockState.getAdapter).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('warns when default fallback dimensions do not match requested provider/model (F61)', async () => {
    const testables = await loadTestables();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    mockState.profile = {
      provider: 'hf-local',
      model: 'default-model',
      dim: 384,
    };

    expect(testables.resolveDimensions('openai', 'text-embedding-3-large')).toBe(384);
    expect(warnSpy).toHaveBeenCalledWith(
      '[embedder-execution] Falling back to default dimensions 384 for openai:text-embedding-3-large; default profile is hf-local:default-model',
    );
  });

  it('clears direct provider credential cache when the active adapter rotates (F90)', async () => {
    const router = await loadRouter();
    const testables = await loadTestables();
    const events: unknown[] = [];
    const unsubscribe = testables.onCredentialCacheInvalidation((event) => events.push(event));

    try {
      const adapterA = router.getEmbedderAdapter('openai', 'model-a', 2);
      await adapterA.embed(['first']);

      expect(testables.getDirectAdapterCacheKeys()).toEqual(['openai:model-a']);

      const adapterB = router.getEmbedderAdapter('voyage', 'model-b', 2);
      await adapterB.embed(['second']);

      expect(testables.getDirectAdapterCacheKeys()).toEqual(['voyage:model-b']);
      expect(mockState.createEmbeddingsProvider).toHaveBeenCalledTimes(2);
      expect(events).toContainEqual({
        reason: 'active-adapter-rotated',
        previousKey: 'openai:model-a',
        nextKey: 'voyage:model-b',
        clearedDirectAdapterKeys: ['openai:model-a'],
        staleWindow: 'until-next-adapter-resolution',
      });
    } finally {
      unsubscribe();
    }
  });

  it('routes hf-local through the factory-backed direct adapter by default', async () => {
    const router = await loadRouter();

    mockState.profile = {
      provider: 'hf-local',
      model: 'model-a',
      dim: 2,
    };

    const adapter = router.getEmbedderAdapter('hf-local', 'model-a', 2);
    const vectors = await adapter.embed(['hello'], { inputType: 'query' });

    expect(vectors).toEqual([new Float32Array([2, 0])]);
    expect(adapter.backend).toBe('sentence-transformers');
    expect(mockState.createEmbeddingsProvider).toHaveBeenCalledWith({
      provider: 'hf-local',
      model: 'model-a',
      dim: 2,
      warmup: false,
    });
    expect(mockState.getAdapter).not.toHaveBeenCalled();
  });

  it('accepts SPECKIT_EMBEDDER_EXECUTION as an ignored one-release no-op', async () => {
    const router = await loadRouter();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    process.env.SPECKIT_EMBEDDER_EXECUTION = 'sidecar';
    const first = router.getEmbedderAdapter('hf-local', 'model-a', 2);
    await first.embed(['one']);
    const second = router.getEmbedderAdapter('openai', 'model-b', 2);
    await second.embed(['two']);

    expect(mockState.createEmbeddingsProvider).toHaveBeenCalledWith({
      provider: 'hf-local',
      model: 'model-a',
      dim: 2,
      warmup: false,
    });
    expect(mockState.createEmbeddingsProvider).toHaveBeenCalledWith({
      provider: 'openai',
      model: 'model-b',
      dim: 2,
      warmup: false,
    });
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      '[embedder-execution] SPECKIT_EMBEDDER_EXECUTION="sidecar" is deprecated and ignored; using direct provider routing',
    );
  });

  it('delegates registered Ollama direct adapters without the factory-backed provider path (F64)', async () => {
    const router = await loadRouter();
    const registryEmbed = vi.fn(async () => [new Float32Array([1, 2])]);
    mockState.getAdapter.mockReturnValue({
      name: 'nomic-embed-text-v1.5',
      dim: 2,
      backend: 'ollama',
      ready: vi.fn(),
      embed: registryEmbed,
    });

    const adapter = router.getEmbedderAdapter('ollama', 'nomic-embed-text-v1.5', 2);
    const vectors = await adapter.embed(['hello'], { inputType: 'query' });

    expect(vectors).toEqual([new Float32Array([1, 2])]);
    expect(registryEmbed).toHaveBeenCalledWith(['hello'], { inputType: 'query' });
    expect(mockState.createEmbeddingsProvider).not.toHaveBeenCalled();
    expect('ready' in adapter).toBe(false);
  });

  it('does not expose DirectProviderAdapter.ready through direct router adapters (F74)', async () => {
    const router = await loadRouter();

    const adapter = router.getEmbedderAdapter('openai', 'text-embedding-3-small', 1536);

    expect('ready' in adapter).toBe(false);
  });

  it('disposes the factory-backed direct adapter provider on swap teardown', async () => {
    const router = await loadRouter();
    const testables = await loadTestables();
    const dispose = vi.fn(async () => undefined);
    mockState.createEmbeddingsProvider.mockResolvedValueOnce({
      embedDocument: vi.fn(async () => new Float32Array([1, 0])),
      embedQuery: vi.fn(async () => new Float32Array([2, 0])),
      dispose,
    });

    const adapter = router.getEmbedderAdapter('hf-local', 'model-a', 2);
    await adapter.embed(['one']);
    expect(testables.getDirectAdapterCacheKeys()).toEqual(['hf-local:model-a']);

    await router.teardownEmbedderAfterSwap('hf-local', 'model-a');

    expect(dispose).toHaveBeenCalledTimes(1);
    expect(testables.getDirectAdapterCacheKeys()).toEqual([]);
  });
});
