import { describe, it, expect } from 'vitest';

// ───────────────────────────────────────────────────────────────
// TEST: Lazy Loading Startup Time (T016-T019)
// ───────────────────────────────────────────────────────────────
// Tests the lazy loading implementation by measuring:
// 1. Module import time (should be <100ms)
// 2. Provider initialization time (deferred until first use)
// 3. First embedding generation time
//
// Success Criteria:
// - CHK-020: Startup time < 500ms
// - CHK-021: Deferred initialization pattern
// - CHK-022: getEmbeddingProvider creates instance only on first call
// - CHK-023: 50-70% faster startup
// - CHK-024: SPECKIT_EAGER_WARMUP fallback works
//
// Original: lazy-loading.test.js
// Deferred: requires ../../shared/dist/embeddings/ (measures module load times)

// Commented out — external module not available in vitest context
// import * as embeddings from '../../shared/dist/embeddings';

describe.skip('Lazy Loading Startup Time (T016-T019) [deferred - requires external API/startup fixtures]', () => {
  describe('Lazy loading mode', () => {
    it('should import module in under 500ms (CHK-020)', () => {
      // const startTime = Date.now();
      // const embeddings = require('../../shared/dist/embeddings');
      // const importTime = Date.now() - startTime;
      // expect(importTime).toBeLessThan(500);
    });

    it('should NOT initialize provider on import (CHK-021)', () => {
      // const embeddings = require('../../shared/dist/embeddings');
      // expect(embeddings.isProviderInitialized()).toBe(false);
    });

    it('should initialize provider on first embedding call (CHK-022)', async () => {
      // const embeddings = require('../../shared/dist/embeddings');
      // expect(embeddings.isProviderInitialized()).toBe(false);
      // await embeddings.generateEmbedding('test lazy loading');
      // expect(embeddings.isProviderInitialized()).toBe(true);
    });

    it('should be faster on second embedding (no re-init)', async () => {
      // const embeddings = require('../../shared/dist/embeddings');
      // await embeddings.generateEmbedding('test lazy loading');
      // const start = Date.now();
      // await embeddings.generateEmbedding('test lazy loading 2');
      // const secondTime = Date.now() - start;
      // expect(secondTime).toBeLessThan(1000); // Should be noticeably faster
    });

    it('should report lazy loading stats after initialization', async () => {
      // const embeddings = require('../../shared/dist/embeddings');
      // await embeddings.generateEmbedding('test lazy loading');
      // const stats = embeddings.getLazyLoadingStats();
      // expect(stats.isInitialized).toBe(true);
      // expect(stats.initDurationMs).not.toBeNull();
    });
  });

  describe('Eager warmup check (CHK-024)', () => {
    it('should have shouldEagerWarmup() return false by default', () => {
      // const embeddings = require('../../shared/dist/embeddings');
      // expect(embeddings.shouldEagerWarmup()).toBe(false);
    });
  });
});
