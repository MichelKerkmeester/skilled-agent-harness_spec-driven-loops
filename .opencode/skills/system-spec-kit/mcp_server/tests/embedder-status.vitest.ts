// -------------------------------------------------------------------
// TEST: Embedder Status Handler (016/003)
// -------------------------------------------------------------------

import { describe, expect, it, vi } from 'vitest';

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

const mocks = vi.hoisted(() => ({
  checkDatabaseUpdated: vi.fn(async () => false),
  db: {},
  getActiveJob: vi.fn(() => baseJob),
  getJobStatus: vi.fn(() => baseJob),
  estimateEta: vi.fn(() => 10),
}));

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

import { handleEmbedderStatus } from '../handlers/embedder-status.js';

function dataFrom(response: { content: Array<{ text: string }> }): Record<string, unknown> {
  return JSON.parse(response.content[0]?.text ?? '{}').data as Record<string, unknown>;
}

describe('embedder_status', () => {
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

  it('returns a requested job by id', async () => {
    const data = dataFrom(await handleEmbedderStatus({ jobId: 'emb-swap-test' }));

    expect(mocks.getJobStatus).toHaveBeenCalledWith('emb-swap-test', mocks.db);
    expect(data.status).toBe('running');
  });

  it('returns idle when no active job exists', async () => {
    mocks.getActiveJob.mockReturnValueOnce(null);

    const data = dataFrom(await handleEmbedderStatus({}));

    expect(data).toEqual({
      jobId: null,
      status: 'idle',
      total: 0,
      processed: 0,
      eta: null,
    });
  });
});
