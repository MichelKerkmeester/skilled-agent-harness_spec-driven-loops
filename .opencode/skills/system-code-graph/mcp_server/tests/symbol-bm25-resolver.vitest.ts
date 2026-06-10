// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Symbol BM25 Resolver Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  CODE_GRAPH_BM25_SYMBOL_RESOLVER_ENV,
  isCodeGraphBm25SymbolResolverEnabled,
  resolveSymbolBm25Candidates,
  SYMBOL_BM25_FIELD_WEIGHTS,
  SymbolPackedBm25Index,
  type SymbolBm25Document,
} from '../lib/symbol-bm25-resolver.js';

function symbol(overrides: Partial<SymbolBm25Document> & Pick<SymbolBm25Document, 'symbolId'>): SymbolBm25Document {
  return {
    symbolId: overrides.symbolId,
    fqName: overrides.fqName ?? overrides.name ?? overrides.symbolId,
    name: overrides.name ?? overrides.fqName?.split('.').pop() ?? overrides.symbolId,
    kind: overrides.kind ?? 'function',
    filePath: overrides.filePath ?? `src/${overrides.symbolId}.ts`,
    startLine: overrides.startLine ?? 1,
    signature: overrides.signature ?? '',
    docstring: overrides.docstring ?? '',
  };
}

describe('symbol BM25 resolver', () => {
  it('is default-off unless the fallback feature flag is enabled', () => {
    expect(isCodeGraphBm25SymbolResolverEnabled({})).toBe(false);
    expect(isCodeGraphBm25SymbolResolverEnabled({ [CODE_GRAPH_BM25_SYMBOL_RESOLVER_ENV]: 'fallback' })).toBe(true);
    expect(isCodeGraphBm25SymbolResolverEnabled({ [CODE_GRAPH_BM25_SYMBOL_RESOLVER_ENV]: 'off' })).toBe(false);
  });

  it('packs postings into typed arrays and clears mutable postings', () => {
    const index = new SymbolPackedBm25Index([
      symbol({ symbolId: 'alpha', name: 'Alpha Router' }),
      symbol({ symbolId: 'beta', name: 'Beta Router' }),
    ]);
    const stats = index.getFootprintStats();

    expect(stats.documentCount).toBe(2);
    expect(stats.termCount).toBeGreaterThan(0);
    expect(stats.postingCount).toBeGreaterThan(0);
    expect(stats.typedArrayBytes).toBeGreaterThan(0);
    expect(stats.mutablePostingCount).toBe(0);
  });

  it('weights symbol name and fqName above repeated docstring and file path text', () => {
    const matches = resolveSymbolBm25Candidates('auth guard', [
      symbol({ symbolId: 'name-hit', name: 'Auth Guard' }),
      symbol({ symbolId: 'fq-hit', fqName: 'security.AuthGuard', name: 'Guard' }),
      symbol({ symbolId: 'docstring-hit', name: 'Generic Helper', docstring: 'auth guard auth guard auth guard' }),
      symbol({ symbolId: 'path-hit', name: 'Route', filePath: 'src/auth/guard.ts' }),
    ], { limit: 4 });

    expect(SYMBOL_BM25_FIELD_WEIGHTS.name).toBeGreaterThan(SYMBOL_BM25_FIELD_WEIGHTS.fqName);
    expect(SYMBOL_BM25_FIELD_WEIGHTS.fqName).toBeGreaterThan(SYMBOL_BM25_FIELD_WEIGHTS.docstring);
    expect(matches.map((match) => match.symbolId).slice(0, 2)).toEqual(['name-hit', 'fq-hit']);
    expect(matches[0].evidence).toContain('field:name');
    expect(matches.every((match) => match.disambiguationOnly)).toBe(true);
  });

  it('uses identifier trigrams so a near-miss symbol query can suggest candidates', () => {
    const matches = resolveSymbolBm25Candidates('handleMemryContext', [
      symbol({
        symbolId: 'target-symbol',
        fqName: 'handlers.memoryContext.handleMemoryContext',
        name: 'handleMemoryContext',
      }),
      symbol({
        symbolId: 'unrelated-symbol',
        fqName: 'handlers.session.handleSessionStart',
        name: 'handleSessionStart',
      }),
    ], { limit: 2 });

    expect(matches[0]).toMatchObject({
      symbolId: 'target-symbol',
      name: 'handleMemoryContext',
      disambiguationOnly: true,
    });
    expect(matches[0].evidence.some((entry) => entry.startsWith('bm25:tri:'))).toBe(true);
  });
});
