// ───────────────────────────────────────────────────────────────
// TEST: Embedder registry (016/001)
// ───────────────────────────────────────────────────────────────
// Pure types + frozen manifest tests. No runtime adapter wiring is
// validated here (that's phase 016/002+).
// ───────────────────────────────────────────────────────────────

import { describe, it, expect } from 'vitest';
import {
  getManifest,
  listManifests,
  listSupportedDimensions,
} from '../lib/embedders/registry.js';
import type { EmbedderManifest } from '../lib/embedders/index.js';

describe('016/001 EmbedderRegistry', () => {
  it('lists 6 manifests in declaration order, baseline first', () => {
    const all = listManifests();
    expect(all).toHaveLength(6);
    expect(all[0]?.name).toBe('embeddinggemma-300m');
    expect(all.map((m) => m.name)).toEqual([
      'embeddinggemma-300m',
      'nomic-embed-text-v1.5',
      'mxbai-embed-large-v1',
      'bge-small-en-v1.5',
      'bge-large-en-v1.5',
      'jina-embeddings-v3',
    ]);
  });

  it('getManifest returns the matching manifest by canonical name', () => {
    const mxbai = getManifest('mxbai-embed-large-v1');
    expect(mxbai).toBeDefined();
    expect(mxbai?.dim).toBe(1024);
    expect(mxbai?.backend).toBe('ollama');
    expect(mxbai?.ollamaName).toBe('mxbai-embed-large:latest');
    expect(mxbai?.maxInputChars).toBe(1200);
  });

  it('getManifest returns undefined for unknown name', () => {
    expect(getManifest('made-up-embedder')).toBeUndefined();
    expect(getManifest('')).toBeUndefined();
  });

  it('nomic-embed-text-v1.5 declares prefix tokens (required by the model)', () => {
    const nomic = getManifest('nomic-embed-text-v1.5');
    expect(nomic?.prefixQuery).toBe('search_query: ');
    expect(nomic?.prefixDocument).toBe('search_document: ');
    expect(nomic?.maxInputChars).toBe(8000);
  });

  it('embeddinggemma-300m baseline does NOT declare prefix tokens', () => {
    const gemma = getManifest('embeddinggemma-300m');
    expect(gemma?.prefixQuery).toBeUndefined();
    expect(gemma?.prefixDocument).toBeUndefined();
    expect(gemma?.backend).toBe('llama-cpp');
  });

  it('listSupportedDimensions returns unique sorted dim values', () => {
    const dims = listSupportedDimensions();
    expect(dims).toEqual([384, 768, 1024]);
  });

  it('every manifest declares a positive integer dim', () => {
    for (const m of listManifests()) {
      expect(m.dim).toBeGreaterThan(0);
      expect(Number.isInteger(m.dim)).toBe(true);
    }
  });

  it('every manifest declares a known backend kind', () => {
    const knownBackends = new Set(['ollama', 'llama-cpp', 'api', 'sentence-transformers']);
    for (const m of listManifests()) {
      expect(knownBackends.has(m.backend)).toBe(true);
    }
  });

  it('ollama-backed manifests declare ollamaName (for `ollama pull <name>`)', () => {
    const ollamaManifests = listManifests().filter((m) => m.backend === 'ollama');
    expect(ollamaManifests.length).toBeGreaterThan(0);
    for (const m of ollamaManifests) {
      expect(m.ollamaName).toBeDefined();
      expect(m.ollamaName?.length).toBeGreaterThan(0);
    }
  });

  it('manifest list is frozen at runtime', () => {
    const all = listManifests();
    // ReadonlyArray + Object.freeze => attempted push should throw in strict mode
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (all as any).push({} as EmbedderManifest);
    }).toThrow();
  });
});
