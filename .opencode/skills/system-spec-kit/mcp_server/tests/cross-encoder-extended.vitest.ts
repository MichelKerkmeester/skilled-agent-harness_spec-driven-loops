// TEST: CROSS ENCODER EXTENDED
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import * as crossEncoder from '../lib/search/cross-encoder';
import type { RerankDocument, RerankResult } from '../lib/search/cross-encoder';

/* ─────────────────────────────────────────────────────────────
   TEST UTILITIES
──────────────────────────────────────────────────────────────── */

const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;

function resetEnv() {
  delete process.env.SPECKIT_CROSS_ENCODER;
  delete process.env.RERANKER_LOCAL;
  crossEncoder.resetProvider();
  crossEncoder.resetSession();
}

function restoreAll() {
  process.env.SPECKIT_CROSS_ENCODER = originalEnv.SPECKIT_CROSS_ENCODER;
  process.env.RERANKER_LOCAL = originalEnv.RERANKER_LOCAL;
  if (!originalEnv.SPECKIT_CROSS_ENCODER) delete process.env.SPECKIT_CROSS_ENCODER;
  if (!originalEnv.RERANKER_LOCAL) delete process.env.RERANKER_LOCAL;
  globalThis.fetch = originalFetch;
  crossEncoder.resetProvider();
  crossEncoder.resetSession();
}

/** Helper: create a mock RerankResult-like object */
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

/** Helper: create a mock fetch that returns a controlled response */
function mockFetch(status: number, body: unknown, shouldThrow = false): void {
  globalThis.fetch = vi.fn(async (..._args: Parameters<typeof fetch>): Promise<Response> => {
    if (shouldThrow) throw new Error('Network error');
    return new Response(JSON.stringify(body), {
      status,
      statusText: status === 200 ? 'OK' : 'Internal Server Error',
      headers: { 'Content-Type': 'application/json' },
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   TESTS
──────────────────────────────────────────────────────────────── */

describe('Cross Encoder Extended Tests', () => {
  beforeEach(() => {
    resetEnv();
  });

  afterAll(() => {
    restoreAll();
  });

  // ───────────────────────────────────────────────────────────────
  // 1. APPLYLENGTHPENALTY
  // ───────────────────────────────────────────────────────────────
  describe('1. applyLengthPenalty', () => {
    it('short content no longer changes reranker scores', () => {
      const shortContent = mockResult(1, 'hi', 0.8);
      const results = crossEncoder.applyLengthPenalty([shortContent]);
      expect(results.length).toBe(1);
      expect(results[0].rerankerScore).toBeCloseTo(0.8, 9);
    });

    it('medium content remains unchanged', () => {
      const medContent = mockResult(2, 'a'.repeat(500), 0.8);
      const results = crossEncoder.applyLengthPenalty([medContent]);
      expect(results[0].rerankerScore).toBeCloseTo(0.8, 9);
    });

    it('long content no longer changes reranker scores', () => {
      const longContent = mockResult(3, 'b'.repeat(3000), 0.8);
      const results = crossEncoder.applyLengthPenalty([longContent]);
      expect(results[0].rerankerScore).toBeCloseTo(0.8, 9);
    });

    it('missing content is still a no-op', () => {
      const noContent: RerankResult = {
        id: 4,
        rerankerScore: 1.0,
        score: 1.0,
        originalRank: 0,
        provider: 'test',
        scoringMethod: 'cross-encoder',
      };
      const results = crossEncoder.applyLengthPenalty([noContent]);
      expect(results[0].rerankerScore).toBeCloseTo(1.0, 9);
    });

    it('empty array returns empty array', () => {
      const results = crossEncoder.applyLengthPenalty([]);
      expect(results.length).toBe(0);
    });

    it('mixed lengths preserve scores and ordering', () => {
      const mixed = [
        mockResult(1, 'x', 1.0),
        mockResult(2, 'y'.repeat(100), 0.95),
        mockResult(3, 'z'.repeat(5000), 0.9),
      ];
      const results = crossEncoder.applyLengthPenalty(mixed);
      expect(results[0].rerankerScore).toBeCloseTo(1.0, 9);
      expect(results[0].score).toBeCloseTo(1.0, 9);
      expect(results[1].rerankerScore).toBeCloseTo(0.95, 9);
      expect(results[1].score).toBeCloseTo(0.95, 9);
      expect(results[2].rerankerScore).toBeCloseTo(0.9, 9);
      expect(results[2].score).toBeCloseTo(0.9, 9);
    });

    it('boundary at exactly 50 chars (no penalty)', () => {
      const boundary50 = mockResult(10, 'c'.repeat(50), 0.6);
      const results = crossEncoder.applyLengthPenalty([boundary50]);
      expect(results[0].rerankerScore).toBeCloseTo(0.6, 9);
    });

    it('boundary at exactly 2000 chars (no penalty)', () => {
      const boundary2000 = mockResult(11, 'd'.repeat(2000), 0.6);
      const results = crossEncoder.applyLengthPenalty([boundary2000]);
      expect(results[0].rerankerScore).toBeCloseTo(0.6, 9);
    });
  });

  // 022/013: rerankVoyage + rerankCohere tests removed alongside the
  // cloud reranker provider purge. The local sidecar path is still
  // exercised by describe(4. rerankLocal) below.

  // ───────────────────────────────────────────────────────────────
  // 4. RERANKLOCAL
  // ───────────────────────────────────────────────────────────────
  describe('4. rerankLocal', () => {
    it('successful response returns sorted results', async () => {
      mockFetch(200, {
        results: [
          { index: 1, relevance_score: 0.91 },
          { index: 0, relevance_score: 0.44 },
        ],
      });

      const docs: RerankDocument[] = [
        { id: 'loc-a', content: 'local doc one' },
        { id: 'loc-b', content: 'local doc two' },
      ];
      const results = await crossEncoder.rerankLocal('local query', docs);

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);
      expect(results[0].rerankerScore).toBeGreaterThanOrEqual(results[1].rerankerScore);
      expect(results[0].provider).toBe('local');
      expect(results[0].scoringMethod).toBe('cross-encoder');
    });

    it('originalRank tracks input position', async () => {
      mockFetch(200, {
        results: [
          { index: 2, relevance_score: 0.8 },
          { index: 0, relevance_score: 0.6 },
          { index: 1, relevance_score: 0.3 },
        ],
      });

      const docs: RerankDocument[] = [
        { id: 'a', content: 'one' },
        { id: 'b', content: 'two' },
        { id: 'c', content: 'three' },
      ];
      const results = await crossEncoder.rerankLocal('query', docs);

      const topResult = results[0]; // index 2 → id 'c', score 0.8
      expect(topResult.id).toBe('c');
      expect(topResult.originalRank).toBe(2);
    });

    it('throws on non-OK HTTP response', async () => {
      mockFetch(502, { error: 'Bad Gateway' });

      await expect(
        crossEncoder.rerankLocal('query', [{ id: 1, content: 'doc' }])
      ).rejects.toThrow(/Local rerank failed: 502/);
    });

    it('throws on network error', async () => {
      mockFetch(0, null, true);

      await expect(
        crossEncoder.rerankLocal('query', [{ id: 1, content: 'doc' }])
      ).rejects.toThrow('Network error');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5. RERANKRESULTS WITH PROVIDER-SPECIFIC PATHS
  // ───────────────────────────────────────────────────────────────
  describe('5. rerankResults (provider paths)', () => {
    it('routes to local sidecar when SPECKIT_CROSS_ENCODER=true + RERANKER_LOCAL=true', async () => {
      process.env.SPECKIT_CROSS_ENCODER = 'true';
      process.env.RERANKER_LOCAL = 'true';
      mockFetch(200, {
        results: [
          { index: 0, relevance_score: 0.77 },
        ],
      });

      const docs = [{ id: 1, content: 'a'.repeat(100) }];
      const results = await crossEncoder.rerankResults('query', docs, { useCache: false });

      expect(results.length).toBe(1);
      expect(results[0].provider).toBe('local');
      expect(results[0].scoringMethod).toBe('cross-encoder');
      // Length penalty applied: 100 chars is medium → *1.0
      expect(results[0].rerankerScore).toBeCloseTo(0.77, 9);
    });

    it('returns fallback when SPECKIT_CROSS_ENCODER set but RERANKER_LOCAL not set', async () => {
      process.env.SPECKIT_CROSS_ENCODER = 'true';
      // RERANKER_LOCAL intentionally absent
      mockFetch(200, {
        results: [
          { index: 0, relevance_score: 0.55 },
        ],
      });

      const docs = [{ id: 3, content: 'c'.repeat(100) }];
      const results = await crossEncoder.rerankResults('query', docs, { useCache: false });

      expect(results.length).toBe(1);
      expect(results[0].provider).toBe('none');
      expect(results[0].scoringMethod).toBe('fallback');
    });

    it('keeps provider scores unchanged after removing the length penalty', async () => {
      process.env.SPECKIT_CROSS_ENCODER = 'true';
      process.env.RERANKER_LOCAL = 'true';
      mockFetch(200, {
        results: [
          { index: 0, relevance_score: 1.0 },
        ],
      });

      const docs = [{ id: 4, content: 'tiny' }];
      const results = await crossEncoder.rerankResults('q', docs, { useCache: false });

      expect(results[0].rerankerScore).toBeCloseTo(1.0, 9);
    });

    it('provider error falls back gracefully', async () => {
      process.env.SPECKIT_CROSS_ENCODER = 'true';
      process.env.RERANKER_LOCAL = 'true';
      mockFetch(500, { error: 'Internal error' });

      const docs = [{ id: 5, content: 'doc content' }];
      const results = await crossEncoder.rerankResults('query', docs, { useCache: false });

      // Provider failed → should fall back gracefully (not throw)
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(1);
      expect(results[0].provider).toBe('fallback');
      expect(results[0].scoringMethod).toBe('fallback');
    });

    it('no provider returns fallback with correct scoringMethod', async () => {
      // No provider → fallback scoring with scoringMethod = 'fallback'
      const docs = [
        { id: 'f1', content: 'alpha' },
        { id: 'f2', content: 'beta' },
      ];
      const results = await crossEncoder.rerankResults('query', docs, { useCache: false });

      expect(results.length).toBe(2);
      expect(results[0].provider).toBe('none');
      expect(results[0].scoringMethod).toBe('fallback');
      // P3-16: fallback scores in 0-0.5 range, first > second
      expect(results[0].score).toBeLessThanOrEqual(0.5);
      expect(results[0].score).toBeGreaterThan(results[1].score);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 6. RERANKRESULTS CACHING BEHAVIOR
  // ───────────────────────────────────────────────────────────────
  describe('6. rerankResults (caching)', () => {
    it('second call with same input uses cache', async () => {
      process.env.SPECKIT_CROSS_ENCODER = 'true';
      process.env.RERANKER_LOCAL = 'true';

      let fetchCallCount = 0;
      globalThis.fetch = vi.fn(async (..._args: Parameters<typeof fetch>): Promise<Response> => {
        fetchCallCount++;
        return new Response(JSON.stringify({ results: [{ index: 0, relevance_score: 0.8 }] }), {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const docs = [{ id: 'cache-1', content: 'a'.repeat(100) }];

      // First call — should hit the API
      await crossEncoder.rerankResults('cache query', docs, { useCache: true });
      expect(fetchCallCount).toBe(1);

      // Second call with same query+docs — should use cache
      await crossEncoder.rerankResults('cache query', docs, { useCache: true });
      expect(fetchCallCount).toBe(1);

      const status = crossEncoder.getRerankerStatus();
      expect(status.cache.hits).toBe(1);
      expect(status.cache.misses).toBe(1);
      expect(status.cache.staleHits).toBe(0);
    });

    it('same IDs with changed content miss cache', async () => {
      process.env.SPECKIT_CROSS_ENCODER = 'true';
      process.env.RERANKER_LOCAL = 'true';

      let fetchCallCount = 0;
      globalThis.fetch = vi.fn(async (..._args: Parameters<typeof fetch>): Promise<Response> => {
        fetchCallCount++;
        const relevanceScore = fetchCallCount === 1 ? 0.25 : 0.91;
        return new Response(JSON.stringify({ results: [{ index: 0, relevance_score: relevanceScore }] }), {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const firstDocs = [{ id: 'content-drift', content: 'original payload' }];
      const secondDocs = [{ id: 'content-drift', content: 'updated payload' }];

      const firstResults = await crossEncoder.rerankResults('content-aware cache', firstDocs, { useCache: true });
      const secondResults = await crossEncoder.rerankResults('content-aware cache', secondDocs, { useCache: true });

      expect(fetchCallCount).toBe(2);
      expect(firstResults[0].rerankerScore).toBeCloseTo(0.25, 9);
      expect(secondResults[0].rerankerScore).toBeCloseTo(0.91, 9);

      const status = crossEncoder.getRerankerStatus();
      expect(status.cache.hits).toBe(0);
      expect(status.cache.misses).toBe(2);
      expect(status.cache.staleHits).toBe(0);
    });

    it('expired cache entry records stale-hit and eviction telemetry', async () => {
      process.env.SPECKIT_CROSS_ENCODER = 'true';
      process.env.RERANKER_LOCAL = 'true';

      let fetchCallCount = 0;
      globalThis.fetch = vi.fn(async (..._args: Parameters<typeof fetch>): Promise<Response> => {
        fetchCallCount++;
        return new Response(JSON.stringify({ results: [{ index: 0, relevance_score: 0.8 }] }), {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const docs = [{ id: 'stale-1', content: 'cache me' }];
      await crossEncoder.rerankResults('stale query', docs, { useCache: true });

      const cacheKey = crossEncoder.generateCacheKey('stale query', docs, 'local');
      const cached = crossEncoder.__testables.cache.get(cacheKey);
      expect(cached).toBeDefined();
      if (cached) {
        crossEncoder.__testables.cache.set(cacheKey, {
          ...cached,
          timestamp: Date.now() - 300_001,
        });
      }

      await crossEncoder.rerankResults('stale query', docs, { useCache: true });

      expect(fetchCallCount).toBe(2);
      const status = crossEncoder.getRerankerStatus();
      expect(status.cache.hits).toBe(0);
      expect(status.cache.misses).toBe(2);
      expect(status.cache.staleHits).toBe(1);
      expect(status.cache.evictions).toBe(1);
    });

    it('cache bound enforcement evicts the oldest entry and records telemetry', () => {
      const { cache, enforceCacheBound, MAX_CACHE_ENTRIES } = crossEncoder.__testables;
      for (let i = 0; i <= MAX_CACHE_ENTRIES; i++) {
        cache.set(`entry-${i}`, { results: [], timestamp: i });
      }

      enforceCacheBound();

      expect(cache.size).toBe(MAX_CACHE_ENTRIES);
      expect(cache.has('entry-0')).toBe(false);
      const status = crossEncoder.getRerankerStatus();
      expect(status.cache.evictions).toBe(1);
    });

    it('useCache=false bypasses cache', async () => {
      process.env.SPECKIT_CROSS_ENCODER = 'true';
      process.env.RERANKER_LOCAL = 'true';

      let fetchCallCount = 0;
      globalThis.fetch = vi.fn(async (..._args: Parameters<typeof fetch>): Promise<Response> => {
        fetchCallCount++;
        return new Response(JSON.stringify({ results: [{ index: 0, relevance_score: 0.8 }] }), {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const docs = [{ id: 'nc-1', content: 'a'.repeat(100) }];

      // Call with useCache: false — should always hit API
      await crossEncoder.rerankResults('no-cache query', docs, { useCache: false });
      expect(fetchCallCount).toBe(1);

      await crossEncoder.rerankResults('no-cache query', docs, { useCache: false });
      expect(fetchCallCount).toBe(2);

      const status = crossEncoder.getRerankerStatus();
      expect(status.cache.hits).toBe(0);
      expect(status.cache.misses).toBe(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 7. RERANKRESULTS LATENCY TRACKING
  // ───────────────────────────────────────────────────────────────
  describe('7. rerankResults (latency tracking)', () => {
    it('tracks latency after successful provider call', async () => {
      process.env.SPECKIT_CROSS_ENCODER = 'true';
      process.env.RERANKER_LOCAL = 'true';
      mockFetch(200, { results: [{ index: 0, relevance_score: 0.5 }] });

      const docs = [{ id: 'lat-1', content: 'a'.repeat(100) }];
      await crossEncoder.rerankResults('latency-test', docs, { useCache: false });

      const status = crossEncoder.getRerankerStatus();
      expect(status.latency.count).toBeGreaterThanOrEqual(1);
      expect(status.latency.avg).toBeGreaterThanOrEqual(0);
      expect(status.cache.entries).toBe(0);
    });
  });

  // 022/013: describe('8. Provider priority') removed alongside the
  // Voyage/Cohere cloud reranker purge. Local is now the only provider.
});
