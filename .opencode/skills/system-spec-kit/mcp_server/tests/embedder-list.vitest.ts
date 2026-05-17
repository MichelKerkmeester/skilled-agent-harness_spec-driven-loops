// -------------------------------------------------------------------
// TEST: Embedder List Handler (016/003)
// -------------------------------------------------------------------

import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  checkDatabaseUpdated: vi.fn(async () => false),
  getDb: vi.fn(() => ({})),
  getActiveEmbedder: vi.fn(() => ({ name: 'embeddinggemma-300m', dim: 768 })),
  listManifests: vi.fn(() => [
    { name: 'embeddinggemma-300m', dim: 768, backend: 'llama-cpp', notes: 'baseline' },
    { name: 'mxbai-embed-large-v1', dim: 1024, backend: 'ollama' },
  ]),
  readyGemma: vi.fn(async () => true),
  readyMxbai: vi.fn(async () => false),
}));

vi.mock('../core/index.js', () => ({
  checkDatabaseUpdated: mocks.checkDatabaseUpdated,
}));

vi.mock('../lib/search/vector-index-store.js', () => ({
  get_db: mocks.getDb,
}));

vi.mock('../lib/embedders/index.js', () => ({
  getActiveEmbedder: mocks.getActiveEmbedder,
  listManifests: mocks.listManifests,
  getAdapter: (name: string) => {
    if (name === 'embeddinggemma-300m') return { ready: mocks.readyGemma };
    if (name === 'mxbai-embed-large-v1') return { ready: mocks.readyMxbai };
    return undefined;
  },
}));

import { handleEmbedderList } from '../handlers/embedder-list.js';

function dataFrom(response: { content: Array<{ text: string }> }): unknown {
  return JSON.parse(response.content[0]?.text ?? '{}').data;
}

describe('embedder_list', () => {
  it('returns manifests with active and readiness flags', async () => {
    const data = dataFrom(await handleEmbedderList());

    expect(data).toEqual([
      {
        name: 'embeddinggemma-300m',
        dim: 768,
        backend: 'llama-cpp',
        active: true,
        ready: true,
        notes: 'baseline',
      },
      {
        name: 'mxbai-embed-large-v1',
        dim: 1024,
        backend: 'ollama',
        active: false,
        ready: false,
      },
    ]);
  });

  it('treats adapter probe failures as not ready', async () => {
    mocks.readyGemma.mockRejectedValueOnce(new Error('backend down'));

    const data = dataFrom(await handleEmbedderList()) as Array<{ name: string; ready: boolean }>;

    expect(data.find((entry) => entry.name === 'embeddinggemma-300m')?.ready).toBe(false);
  });
});
