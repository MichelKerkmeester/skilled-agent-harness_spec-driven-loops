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
    expect(testables.resolveExecutionPolicy('direct')).toBe('direct');
  });

  it('keeps policy resolution pure and logs invalid policy from the logging seam (F31)', async () => {
    const testables = await loadTestables();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(testables.resolveExecutionPolicy('invalid-policy')).toBe('auto');
    expect(warnSpy).not.toHaveBeenCalled();

    testables.logPolicyResolution('invalid-policy', 'auto');
    expect(warnSpy).toHaveBeenCalledWith(
      '[embedder-execution] Invalid SPECKIT_EMBEDDER_EXECUTION="invalid-policy"; using auto',
    );
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

  it('registers one shared async signal handler for SIGINT, SIGTERM, and SIGHUP (F53+F58)', async () => {
    const testables = await loadTestables();
    const onceSpy = vi.spyOn(process, 'once').mockImplementation(() => process);

    testables.registerShutdownHooks();

    const signalCalls = onceSpy.mock.calls.filter(([event]) => ['SIGINT', 'SIGTERM', 'SIGHUP'].includes(String(event)));
    expect(signalCalls.map(([event]) => event)).toEqual(['SIGINT', 'SIGTERM', 'SIGHUP']);
    expect(new Set(signalCalls.map(([, handler]) => handler)).size).toBe(1);
    expect(signalCalls[0][1].constructor.name).toBe('AsyncFunction');
  });

  it('treats duplicate SIGTERM re-entry as a no-op and warns once (F51)', async () => {
    const testables = await loadTestables();
    const onceSpy = vi.spyOn(process, 'once').mockImplementation(() => process);
    const killSpy = vi.spyOn(process, 'kill').mockImplementation(() => true);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    testables.registerShutdownHooks();
    const signalHandler = onceSpy.mock.calls
      .find(([event]) => event === 'SIGTERM')?.[1] as ((signal: NodeJS.Signals) => Promise<void>) | undefined;

    expect(signalHandler).toBeDefined();
    await signalHandler!('SIGTERM');
    await signalHandler!('SIGTERM');
    await new Promise<void>((resolve) => {
      setImmediate(resolve);
    });

    expect(killSpy).toHaveBeenCalledTimes(1);
    expect(killSpy).toHaveBeenCalledWith(process.pid, 'SIGTERM');
    expect(warnSpy).toHaveBeenCalledWith(
      '[embedder-execution] Ignoring duplicate SIGTERM while sidecar shutdown is already in progress',
    );
  });

  it('clears direct provider credential cache when the active adapter rotates (F90)', async () => {
    const router = await loadRouter();
    const testables = await loadTestables();
    const events: unknown[] = [];
    const unsubscribe = testables.onCredentialCacheInvalidation((event) => events.push(event));

    try {
      process.env.SPECKIT_EMBEDDER_EXECUTION = 'direct';
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

  it('resolves invalid sidecar dimensions at the router layer before worker dispatch (F10)', async () => {
    const router = await loadRouter();

    process.env.SPECKIT_EMBEDDER_EXECUTION = 'sidecar';
    mockState.profile = {
      provider: 'hf-local',
      model: 'default-model',
      dim: 384,
    };

    const adapter = router.getEmbedderAdapter('hf-local', 'default-model', 0);

    expect((adapter as unknown as { dimensions: number }).dimensions).toBe(384);
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

    process.env.SPECKIT_EMBEDDER_EXECUTION = 'direct';
    const adapter = router.getEmbedderAdapter('ollama', 'nomic-embed-text-v1.5', 2);
    const vectors = await adapter.embed(['hello'], { inputType: 'query' });

    expect(vectors).toEqual([new Float32Array([1, 2])]);
    expect(registryEmbed).toHaveBeenCalledWith(['hello'], { inputType: 'query' });
    expect(mockState.createEmbeddingsProvider).not.toHaveBeenCalled();
    expect('ready' in adapter).toBe(false);
  });

  it('does not expose DirectProviderAdapter.ready through direct router adapters (F74)', async () => {
    const router = await loadRouter();

    process.env.SPECKIT_EMBEDDER_EXECUTION = 'direct';
    const adapter = router.getEmbedderAdapter('openai', 'text-embedding-3-small', 1536);

    expect('ready' in adapter).toBe(false);
  });
});
