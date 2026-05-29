// -------------------------------------------------------------------
// TEST: Embedder Status Handler
// -------------------------------------------------------------------

import { beforeEach, describe, expect, it, vi } from 'vitest';

const baseJob = {
  id: 'emb-swap-test',
  fromName: 'auto',
  toName: 'mxbai-embed-large-v1',
  toDim: 1024,
  total: 20,
  processed: 10,
  status: 'running',
  startedAt: new Date(Date.now() - 10_000).toISOString(),
  updatedAt: new Date().toISOString(),
};

const mocks = vi.hoisted(() => {
  const healthCheck = vi.fn(async () => true);
  const getMetadata = vi.fn(() => ({
    provider: 'hf-local',
    model: 'nomic-ai/nomic-embed-text-v1.5',
    dim: 768,
    dtype: 'q8',
    healthy: true,
    serverState: 'loading',
    loaded: false,
    loadTimeMs: null,
    loadStartedAt: '2026-05-29T12:00:00.000Z',
    loadProgressAt: '2026-05-29T12:00:10.000Z',
    baseUrl: '/tmp/hf-embed.sock',
    requestCount: 0,
  }));

  return {
    checkDatabaseUpdated: vi.fn(async () => false),
    db: {},
    getActiveJob: vi.fn(),
    getJobStatus: vi.fn(),
    estimateEta: vi.fn(),
    getProviderInfo: vi.fn(() => ({
      provider: 'hf-local',
      requestedProvider: 'hf-local',
      effectiveProvider: 'hf-local',
      dimensionChanged: false,
      reason: 'Local fallback provider',
      config: {
        EMBEDDINGS_PROVIDER: 'auto',
        HF_EMBEDDINGS_MODEL: 'nomic-ai/nomic-embed-text-v1.5',
      },
    })),
    healthCheck,
    getMetadata,
    // Must be a `function` (not an arrow) so `new HfLocalProvider()` returns the
    // object — vitest v4 cannot construct an arrow-implementation mock and would
    // hand back an empty `this`, making healthCheck undefined → modelServer null.
    HfLocalProvider: vi.fn(function HfLocalProviderMock() {
      return { healthCheck, getMetadata };
    }),
  };
});

vi.mock('../core/index.js', () => ({
  checkDatabaseUpdated: mocks.checkDatabaseUpdated,
}));

vi.mock('../lib/search/vector-index-store.js', () => ({
  get_db: () => mocks.db,
}));

vi.mock('../lib/embedders/reindex.js', () => ({
  getActiveJob: mocks.getActiveJob,
  getJobStatus: mocks.getJobStatus,
  estimateEta: mocks.estimateEta,
}));

vi.mock('@spec-kit/shared/embeddings/factory', () => ({
  getProviderInfo: mocks.getProviderInfo,
}));

vi.mock('@spec-kit/shared/embeddings/providers/hf-local', () => ({
  HfLocalProvider: mocks.HfLocalProvider,
}));

import { handleEmbedderStatus } from '../handlers/embedder-status.js';

function dataFrom(response: { content: Array<{ text: string }> }): Record<string, unknown> {
  return JSON.parse(response.content[0]?.text ?? '{}').data as Record<string, unknown>;
}

describe('embedder_status', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getActiveJob.mockReturnValue(baseJob);
    mocks.getJobStatus.mockReturnValue(baseJob);
    mocks.estimateEta.mockReturnValue(10);
  });

  it('returns the active job when jobId is omitted', async () => {
    const data = dataFrom(await handleEmbedderStatus({}));

    expect(mocks.getActiveJob).toHaveBeenCalledWith(mocks.db);
    expect(data).toMatchObject({
      jobId: 'emb-swap-test',
      status: 'running',
      total: 20,
      processed: 10,
      eta: 10,
      fromName: 'auto',
      toName: 'mxbai-embed-large-v1',
    });
  });

  it('includes provider resolution and hf-local model-server status', async () => {
    const data = dataFrom(await handleEmbedderStatus({}));

    expect(data.embeddings).toMatchObject({
      provider: {
        provider: 'hf-local',
        requestedProvider: 'hf-local',
        effectiveProvider: 'hf-local',
        dimensionChanged: false,
      },
      modelServer: {
        provider: 'hf-local',
        model: 'nomic-ai/nomic-embed-text-v1.5',
        dim: 768,
        healthy: true,
        serverState: 'loading',
        loaded: false,
        loadStartedAt: '2026-05-29T12:00:00.000Z',
        loadProgressAt: '2026-05-29T12:00:10.000Z',
      },
    });
    expect(mocks.HfLocalProvider).toHaveBeenCalledTimes(1);
    expect(mocks.healthCheck).toHaveBeenCalledTimes(1);
  });

  it('degrades gracefully (no crash) when getProviderInfo throws on a misconfigured provider', async () => {
    mocks.getProviderInfo.mockImplementationOnce(() => {
      throw new Error('Invalid EMBEDDINGS_PROVIDER "bogus"');
    });

    const data = dataFrom(await handleEmbedderStatus({}));
    const embeddings = data.embeddings as Record<string, unknown>;

    // The job status still resolves; the embeddings sub-object reports the error instead of throwing.
    expect(data.status).toBe('running');
    expect(embeddings.provider).toBeNull();
    expect(embeddings.modelServer).toBeNull();
    expect(embeddings.modelServerError).toContain('Invalid EMBEDDINGS_PROVIDER');
    expect(mocks.HfLocalProvider).not.toHaveBeenCalled();
  });

  it('returns a requested job by id', async () => {
    const data = dataFrom(await handleEmbedderStatus({ jobId: 'emb-swap-test' }));

    expect(mocks.getJobStatus).toHaveBeenCalledWith('emb-swap-test', mocks.db);
    expect(data.status).toBe('running');
  });

  it('returns idle when no active job exists', async () => {
    mocks.getActiveJob.mockReturnValueOnce(null);

    const data = dataFrom(await handleEmbedderStatus({}));

    expect(data).toMatchObject({
      jobId: null,
      status: 'idle',
      total: 0,
      processed: 0,
      eta: null,
    });
  });
});
