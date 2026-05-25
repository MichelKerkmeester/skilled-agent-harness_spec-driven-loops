// TEST: CROSS ENCODER EXTENDED
import { describe, it, expect, beforeEach } from 'vitest';
import * as crossEncoder from '../lib/search/cross-encoder';
import type { RerankResult } from '../lib/search/cross-encoder';

/* ─────────────────────────────────────────────────────────────
   TEST UTILITIES
──────────────────────────────────────────────────────────────── */

function mockResult(id: number, content: string, rerankerScore: number): RerankResult & { content: string } {
  return {
    id,
    content,
    rerankerScore,
    score: rerankerScore,
    originalRank: id,
    provider: 'test',
    scoringMethod: 'cross-encoder' as const,
  };
}

/* ─────────────────────────────────────────────────────────────
   TESTS
──────────────────────────────────────────────────────────────── */

describe('Cross Encoder Extended Tests', () => {
  beforeEach(() => {
    crossEncoder.resetProvider();
    crossEncoder.resetSession();
  });

  describe('1. applyLengthPenalty', () => {
    it('preserves scores for short, medium, and long content', () => {
      const mixed = [
        mockResult(1, 'x', 1.0),
        mockResult(2, 'y'.repeat(100), 0.95),
        mockResult(3, 'z'.repeat(5000), 0.9),
      ];

      const results = crossEncoder.applyLengthPenalty(mixed);

      expect(results.map((row) => row.rerankerScore)).toEqual([1.0, 0.95, 0.9]);
      expect(results.map((row) => row.score)).toEqual([1.0, 0.95, 0.9]);
    });

    it('empty array returns empty array', () => {
      expect(crossEncoder.applyLengthPenalty([])).toEqual([]);
    });
  });

  describe('2. provider removal', () => {
    it('resolveProvider always returns null', () => {
      expect(crossEncoder.resolveProvider()).toBe(null);
      expect(crossEncoder.isRerankerAvailable()).toBe(false);
    });

    it('status reports no active provider', () => {
      const status = crossEncoder.getRerankerStatus();

      expect(status.available).toBe(false);
      expect(status.provider).toBe(null);
      expect(status.model).toBe(null);
    });
  });

  describe('3. D1 fallback behavior', () => {
    it('returns scored fallback rows without calling a provider', async () => {
      const docs = [
        { id: 'f1', content: 'alpha' },
        { id: 'f2', content: 'beta' },
        { id: 'f3', content: 'gamma' },
      ];

      const results = await crossEncoder.rerankResults('query', docs, { useCache: false });

      expect(results).toHaveLength(3);
      expect(results.map((row) => row.scoringMethod)).toEqual(['fallback', 'fallback', 'fallback']);
      expect(results.map((row) => row.provider)).toEqual(['none', 'none', 'none']);
      expect(results[0].score).toBeLessThanOrEqual(0.5);
      expect(results[0].score).toBeGreaterThan(results[1].score);
      expect(results[1].score).toBeGreaterThan(results[2].score);
    });

    it('respects limit while preserving fallback scores', async () => {
      const docs = Array.from({ length: 5 }, (_, index) => ({
        id: index,
        content: `doc ${index}`,
      }));

      const results = await crossEncoder.rerankResults('query', docs, { limit: 2 });

      expect(results).toHaveLength(2);
      expect(results.every((row) => row.scoringMethod === 'fallback')).toBe(true);
    });
  });

  describe('4. cache helpers', () => {
    it('cache key generation remains deterministic', () => {
      const key1 = crossEncoder.generateCacheKey('query', ['b', 'a']);
      const key2 = crossEncoder.generateCacheKey('query', ['a', 'b']);

      expect(key1).toBe(key2);
      expect(key1.startsWith('rerank-')).toBe(true);
    });

    it('cache bound enforcement evicts the oldest entry and records telemetry', () => {
      const { cache, enforceCacheBound, MAX_CACHE_ENTRIES } = crossEncoder.__testables;
      for (let i = 0; i <= MAX_CACHE_ENTRIES; i++) {
        cache.set(`entry-${i}`, { results: [], timestamp: i });
      }

      enforceCacheBound();

      expect(cache.size).toBe(MAX_CACHE_ENTRIES);
      expect(cache.has('entry-0')).toBe(false);
      expect(crossEncoder.getRerankerStatus().cache.evictions).toBe(1);
    });
  });
});
