// -------------------------------------------------------------------
// TEST: Embedder Set Handler (016/003)
// -------------------------------------------------------------------

import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  checkDatabaseUpdated: vi.fn(async () => false),
  db: {},
  getManifest: vi.fn((name: string) => (
    name === 'mxbai-embed-large-v1'
      ? { name, dim: 1024, backend: 'ollama' }
      : undefined
  )),
  ensureVecTableForDim: vi.fn(),
  startReindex: vi.fn(() => 'emb-swap-test'),
  getJobStatus: vi.fn(() => ({
    id: 'emb-swap-test',
    fromName: 'auto',
    toName: 'mxbai-embed-large-v1',
    toDim: 1024,
    total: 10,
    processed: 0,
    status: 'queued',
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
  estimateEta: vi.fn(() => null),
}));

vi.mock('../core/index.js', () => ({
  checkDatabaseUpdated: mocks.checkDatabaseUpdated,
}));

vi.mock('../lib/search/vector-index-store.js', () => ({
  get_db: () => mocks.db,
}));

vi.mock('../lib/embedders/index.js', () => ({
  getManifest: mocks.getManifest,
  ensureVecTableForDim: mocks.ensureVecTableForDim,
}));

vi.mock('../lib/embedders/reindex.js', () => ({
  startReindex: mocks.startReindex,
  getJobStatus: mocks.getJobStatus,
  estimateEta: mocks.estimateEta,
}));

import { handleEmbedderSet } from '../handlers/embedder-set.js';

function dataFrom(response: { content: Array<{ text: string }> }): Record<string, unknown> {
  return JSON.parse(response.content[0]?.text ?? '{}').data as Record<string, unknown>;
}

describe('embedder_set', () => {
  it('validates the manifest, ensures vec table, and queues reindex', async () => {
    const data = dataFrom(await handleEmbedderSet({ name: 'mxbai-embed-large-v1' }));

    expect(mocks.ensureVecTableForDim).toHaveBeenCalledWith(mocks.db, 1024);
    expect(mocks.startReindex).toHaveBeenCalledWith({ toName: 'mxbai-embed-large-v1' }, { db: mocks.db });
    expect(data).toEqual({
      jobId: 'emb-swap-test',
      eta: null,
      status: 'queued',
    });
  });

  it('throws UNKNOWN_EMBEDDER for unknown names', async () => {
    await expect(handleEmbedderSet({ name: 'missing-model' })).rejects.toMatchObject({
      name: 'UNKNOWN_EMBEDDER',
      code: 'UNKNOWN_EMBEDDER',
    });
  });
});
