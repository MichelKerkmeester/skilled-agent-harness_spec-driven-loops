// ───────────────────────────────────────────────────────────────
// MODULE: Embedder registry tests
// ───────────────────────────────────────────────────────────────
// The umbrella aligned skill-advisor to the shared canonical registry.
// The registry intentionally exposes one local Ollama text embedder; older
// secondary and cloud entries stay removed.
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import {
  getAdapter,
  getManifest,
  MANIFESTS,
} from '../../lib/embedders/registry.js';

describe('skill-advisor embedder registry (shared canonical)', () => {
  it('exposes the shared canonical text-tuned manifests', () => {
    expect(MANIFESTS).toHaveLength(1);

    expect(MANIFESTS.map((manifest) => manifest.name)).toEqual([
      'nomic-embed-text-v1.5',
    ]);

    expect(MANIFESTS.map((manifest) => manifest.name)).not.toEqual(expect.arrayContaining([
      'embeddinggemma-300m',
      'jina-embeddings-v2-base-code',
    ]));

    expect(getManifest('nomic-embed-text-v1.5')).toEqual(expect.objectContaining({
      name: 'nomic-embed-text-v1.5',
      dim: 768,
      backend: 'ollama',
    }));
  });

  it('resolves nomic text to a valid Ollama adapter', () => {
    const adapter = getAdapter('nomic-embed-text-v1.5');

    expect(adapter).toEqual(expect.objectContaining({
      name: 'nomic-embed-text-v1.5',
      dim: 768,
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
