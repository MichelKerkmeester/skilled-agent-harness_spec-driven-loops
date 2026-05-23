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

  it('does not expose DirectProviderAdapter.ready through direct router adapters (F74)', async () => {
    const router = await loadRouter();

    process.env.SPECKIT_EMBEDDER_EXECUTION = 'direct';
    const adapter = router.getEmbedderAdapter('openai', 'text-embedding-3-small', 1536);

    expect('ready' in adapter).toBe(false);
  });
});
