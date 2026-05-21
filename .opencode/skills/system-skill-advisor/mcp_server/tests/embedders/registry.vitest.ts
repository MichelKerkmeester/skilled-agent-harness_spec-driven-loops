// ───────────────────────────────────────────────────────────────
// MODULE: Embedder registry tests
// ───────────────────────────────────────────────────────────────
// Phase 003/006 of the 016 umbrella aligned skill-advisor to the shared
// canonical registry. The previous skill-advisor-specific entries
// `embeddinggemma-300m` and `jina-embeddings-v2-base-code` were removed
// (phase 007 purge parity + text-only TS registry per content-type split).
// The previous `DEFAULT_EMBEDDER_NAME` constant was removed because the
// active default is now the `'auto'` sentinel that triggers the cascade.
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import {
  getAdapter,
  getManifest,
  MANIFESTS,
} from '../../lib/embedders/registry.js';

describe('skill-advisor embedder registry (shared canonical)', () => {
  it('exposes the shared canonical text-tuned manifests', () => {
    expect(MANIFESTS.length).toBeGreaterThanOrEqual(7);

    expect(MANIFESTS.map((manifest) => manifest.name)).toEqual(expect.arrayContaining([
      'nomic-embed-text-v1.5',
      'jina-embeddings-v3',
      'mxbai-embed-large-v1',
      'bge-m3',
    ]));

    expect(MANIFESTS.map((manifest) => manifest.name)).not.toEqual(expect.arrayContaining([
      'embeddinggemma-300m',
      'jina-embeddings-v2-base-code',
    ]));

    expect(getManifest('jina-embeddings-v3')).toEqual(expect.objectContaining({
      name: 'jina-embeddings-v3',
      dim: 1024,
      backend: 'ollama',
    }));
  });

  it('resolves jina-v3 to a valid Ollama adapter', () => {
    const adapter = getAdapter('jina-embeddings-v3');

    expect(adapter).toEqual(expect.objectContaining({
      name: 'jina-embeddings-v3',
      dim: 1024,
      backend: 'ollama',
    }));
    expect(adapter?.embed).toEqual(expect.any(Function));
    expect(adapter?.ready).toEqual(expect.any(Function));
  });

  it('returns undefined for the purged baseline (parity gate)', () => {
    expect(getManifest('embeddinggemma-300m')).toBeUndefined();
    expect(getAdapter('embeddinggemma-300m')).toBeUndefined();
  });
});
