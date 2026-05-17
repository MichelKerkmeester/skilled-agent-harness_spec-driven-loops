// ───────────────────────────────────────────────────────────────
// MODULE: Embedder registry tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import {
  DEFAULT_EMBEDDER_NAME,
  getAdapter,
  getManifest,
  MANIFESTS,
} from '../../lib/embedders/registry.js';

describe('skill-advisor embedder registry', () => {
  it('declares the required manifests with jina-v3 as the default', () => {
    expect(MANIFESTS.length).toBeGreaterThanOrEqual(4);
    expect(DEFAULT_EMBEDDER_NAME).toBe('jina-embeddings-v3');

    expect(MANIFESTS.map((manifest) => manifest.name)).toEqual(expect.arrayContaining([
      'embeddinggemma-300m',
      'jina-embeddings-v3',
      'nomic-embed-text-v1.5',
      'jina-embeddings-v2-base-code',
    ]));
    expect(getManifest(DEFAULT_EMBEDDER_NAME)).toEqual(expect.objectContaining({
      name: DEFAULT_EMBEDDER_NAME,
      dim: 1024,
      backend: 'ollama',
    }));
  });

  it('resolves jina-v3 to a valid adapter', () => {
    const adapter = getAdapter('jina-embeddings-v3');

    expect(adapter).toEqual(expect.objectContaining({
      name: 'jina-embeddings-v3',
      dim: 1024,
      backend: 'ollama',
    }));
    expect(adapter?.embed).toEqual(expect.any(Function));
    expect(adapter?.ready).toEqual(expect.any(Function));
  });
});
