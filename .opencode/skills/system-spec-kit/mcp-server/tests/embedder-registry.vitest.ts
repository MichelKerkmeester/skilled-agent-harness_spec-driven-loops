// ───────────────────────────────────────────────────────────────
// TEST: Embedder registry
// ───────────────────────────────────────────────────────────────
// Pure types + frozen manifest tests. No runtime adapter wiring is
// Validated here (that's)
// ───────────────────────────────────────────────────────────────

import { describe, it, expect } from 'vitest';
import {
  getManifest,
  listManifests,
} from '../lib/embedders/registry.js';
import { listSupportedDimensions } from '@spec-kit/shared/embeddings/registry.js';
import type { EmbedderManifest } from '@spec-kit/shared/embeddings/types.js';

describe('016/001 EmbedderRegistry', () => {
  it('lists the nomic manifest in declaration order', () => {
    const all = listManifests();
    expect(all).toHaveLength(1);
    expect(all[0]?.name).toBe('nomic-embed-text-v1.5');
    expect(all.map((m) => m.name)).toEqual([
      'nomic-embed-text-v1.5',
    ]);
  });

  it('getManifest returns the matching manifest by canonical name', () => {
    const nomic = getManifest('nomic-embed-text-v1.5');
    expect(nomic).toBeDefined();
    expect(nomic?.dim).toBe(768);
    expect(nomic?.backend).toBe('ollama');
    expect(nomic?.ollamaName).toBe('nomic-embed-text:v1.5');
    expect(nomic?.maxInputChars).toBe(5000);
  });

  it('getManifest returns undefined for unknown name', () => {
    expect(getManifest('made-up-embedder')).toBeUndefined();
    expect(getManifest('')).toBeUndefined();
  });

  it('nomic-embed-text-v1.5 declares prefix tokens (required by the model)', () => {
    const nomic = getManifest('nomic-embed-text-v1.5');
    expect(nomic?.prefixQuery).toBe('search_query: ');
    expect(nomic?.prefixDocument).toBe('search_document: ');
    expect(nomic?.maxInputChars).toBe(5000);
  });

  it('removed local alternatives are not registered as menu entries', () => {
    expect(getManifest('legacy-local-alternative')).toBeUndefined();
  });

  it('listSupportedDimensions returns unique sorted dim values', () => {
    const dims = listSupportedDimensions();
    expect(dims).toEqual([768]);
  });

  it('every manifest declares a positive integer dim', () => {
    for (const m of listManifests()) {
      expect(m.dim).toBeGreaterThan(0);
      expect(Number.isInteger(m.dim)).toBe(true);
    }
  });

  it('every manifest declares a known backend kind', () => {
    const knownBackends = new Set(['ollama', 'api', 'sentence-transformers']);
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
