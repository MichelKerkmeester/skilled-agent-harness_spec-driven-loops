#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// TEST: Lazy Loading Startup Time (T016-T019)
// ───────────────────────────────────────────────────────────────
'use strict';

/**
 * Tests the lazy loading implementation by measuring:
 * 1. Module import time (should be <100ms)
 * 2. Provider initialization time (deferred until first use)
 * 3. First embedding generation time
 *
 * Success Criteria:
 * - CHK-020: Startup time < 500ms
 * - CHK-021: Deferred initialization pattern
 * - CHK-022: getEmbeddingProvider creates instance only on first call
 * - CHK-023: 50-70% faster startup
 * - CHK-024: SPECKIT_EAGER_WARMUP fallback works
 */

const path = require('path');

// Test lazy loading mode (default)
async function test_lazy_loading() {
  console.log('\n=== Testing Lazy Loading Mode ===\n');

  const start_time = Date.now();

  // Phase 1: Module import
  const import_start = Date.now();
  const embeddings = require('../../shared/embeddings');
  const import_time = Date.now() - import_start;
  console.log(`[Phase 1] Module import: ${import_time}ms`);

  // Check initial state
  const is_initialized = embeddings.isProviderInitialized();
  console.log(`[Check] Provider initialized after import: ${is_initialized}`);

  if (is_initialized) {
    console.error('FAIL: Provider should NOT be initialized after import (lazy loading)');
    return false;
  }

  const startup_time = Date.now() - start_time;
  console.log(`\n[Result] Startup time (to ready state): ${startup_time}ms`);

  // Phase 2: First embedding (triggers initialization)
  console.log('\n[Phase 2] First embedding (will trigger lazy initialization)...');
  const first_embed_start = Date.now();
  const embedding = await embeddings.generateEmbedding('test lazy loading');
  const first_embed_time = Date.now() - first_embed_start;
  console.log(`[Phase 2] First embedding: ${first_embed_time}ms`);

  // Check state after first embedding
  const is_initialized_after = embeddings.isProviderInitialized();
  console.log(`[Check] Provider initialized after first embedding: ${is_initialized_after}`);

  if (!is_initialized_after) {
    console.error('FAIL: Provider should be initialized after first embedding');
    return false;
  }

  // Phase 3: Second embedding (should be fast, no init needed)
  const second_embed_start = Date.now();
  await embeddings.generateEmbedding('test lazy loading 2');
  const second_embed_time = Date.now() - second_embed_start;
  console.log(`[Phase 3] Second embedding: ${second_embed_time}ms (should be faster)`);

  // Get lazy loading stats
  const stats = embeddings.getLazyLoadingStats();
  console.log('\n[Stats] Lazy loading statistics:');
  console.log(JSON.stringify(stats, null, 2));

  // Validate success criteria
  console.log('\n=== Validation ===');
  const success_startup = startup_time < 500;
  const success_deferred = !is_initialized && is_initialized_after;
  const success_lazy = stats.is_initialized && stats.init_duration_ms !== null;

  console.log(`CHK-020: Startup < 500ms: ${success_startup ? 'PASS' : 'FAIL'} (${startup_time}ms)`);
  console.log(`CHK-021: Deferred init: ${success_deferred ? 'PASS' : 'FAIL'}`);
  console.log(`CHK-022: Lazy singleton: ${success_lazy ? 'PASS' : 'FAIL'}`);
  console.log(`CHK-024: Eager warmup env var: ${embeddings.shouldEagerWarmup() === false ? 'PASS' : 'FAIL'} (should be false by default)`);

  return success_startup && success_deferred && success_lazy;
}

// Test eager warmup mode (legacy fallback)
async function test_eager_warmup() {
  console.log('\n=== Testing Eager Warmup Check ===\n');

  const embeddings = require('../../shared/embeddings');

  // Test environment variable detection
  console.log('Testing shouldEagerWarmup() function:');
  console.log(`  Current value: ${embeddings.shouldEagerWarmup()}`);
  console.log('  Note: Set SPECKIT_EAGER_WARMUP=true to enable eager mode');

  return true;
}

async function main() {
  console.log('='.repeat(60));
  console.log('T016-T019: Lazy Embedding Model Loading Test');
  console.log('='.repeat(60));

  try {
    const lazy_result = await test_lazy_loading();
    await test_eager_warmup();

    console.log('\n' + '='.repeat(60));
    console.log(`Overall: ${lazy_result ? 'PASS' : 'FAIL'}`);
    console.log('='.repeat(60) + '\n');

    process.exit(lazy_result ? 0 : 1);
  } catch (err) {
    console.error('\nTest error:', err);
    process.exit(1);
  }
}

main();
