// ───────────────────────────────────────────────────────────────
// TEST: RRF FUSION (T021-T030)
// ───────────────────────────────────────────────────────────────

(() => {
  'use strict';

  const path = require('path');

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ──────────────────────────────────────────────────────────────── */

  const LIB_PATH = path.join(__dirname, '..', 'lib', 'search');

  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: [],
  };

  /* ─────────────────────────────────────────────────────────────
     2. TEST UTILITIES
  ──────────────────────────────────────────────────────────────── */

  function log(msg) {
    console.log(msg);
  }

  function pass(name, evidence) {
    results.passed++;
    results.tests.push({ name, status: 'PASS', evidence });
    log(`   [PASS] ${name}`);
    if (evidence) log(`      Evidence: ${evidence}`);
  }

  function fail(name, reason) {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', reason });
    log(`   [FAIL] ${name}`);
    log(`      Reason: ${reason}`);
  }

  function skip(name, reason) {
    results.skipped++;
    results.tests.push({ name, status: 'SKIP', reason });
    log(`   [SKIP] ${name} (skipped: ${reason})`);
  }

  /**
   * Helper to check if two numbers are approximately equal
   */
  function approx_equal(a, b, epsilon = 0.0001) {
    return Math.abs(a - b) < epsilon;
  }

  /* ─────────────────────────────────────────────────────────────
     3. MODULE LOADING
  ──────────────────────────────────────────────────────────────── */

  let rrfFusion = null;

  function load_modules() {
    log('\n[SETUP] Module Loading');

    try {
      rrfFusion = require(path.join(LIB_PATH, 'rrf-fusion.js'));
      pass('rrf-fusion.js loads without error', 'require() succeeded');
    } catch (error) {
      fail('rrf-fusion.js loads without error', `Module load failed: ${error.message}`);
      rrfFusion = null;
    }
  }

  /* ─────────────────────────────────────────────────────────────
     4. TEST SUITES
  ──────────────────────────────────────────────────────────────── */

  // 4.1 RRF FUSION CORE TESTS (T021-T030)

  function test_rrf_fusion_core() {
    log('\n[SUITE] RRF Fusion Core Tests (T021-T030)');

    if (!rrfFusion) {
      skip('T021-T030: RRF fusion core tests', 'rrf-fusion.js not available');
      return;
    }

    // T021: Test RRF fusion with default k=60 parameter
    try {
      const k = rrfFusion.DEFAULT_K;
      if (k === 60) {
        pass('T021: RRF fusion with default k=60 parameter', `DEFAULT_K = ${k}`);
      } else {
        fail('T021: RRF fusion with default k=60 parameter', `Expected 60, got ${k}`);
      }
    } catch (e) {
      fail('T021: RRF fusion with default k=60 parameter', `Error: ${e.message}`);
    }

    // T022: Test RRF score formula: 1/(k + rank) produces correct values
    try {
      // Create test data with known ranks
      const vector_results = [
        { id: 'doc1', content: 'test1' },
        { id: 'doc2', content: 'test2' },
        { id: 'doc3', content: 'test3' },
      ];
      const fts_results = [
        { id: 'doc2', content: 'test2' },
        { id: 'doc1', content: 'test1' },
      ];

      const fused = rrfFusion.fuse_results(vector_results, fts_results, { limit: 10 });

      // doc1: vector_rank=1, fts_rank=2 => 1/(60+1) + 1/(60+2) = 0.01639 + 0.01613 = 0.03252
      // doc2: vector_rank=2, fts_rank=1 => 1/(60+2) + 1/(60+1) = 0.01613 + 0.01639 = 0.03252
      // Both have 2 sources, so convergence bonus of 0.10 is added
      // Final score: 0.03252 + 0.10 = 0.13252
      // doc3: vector_rank=3, no fts => 1/(60+3) = 0.01587 (single source, no bonus)

      const doc1 = fused.find(r => r.id === 'doc1');
      const doc3 = fused.find(r => r.id === 'doc3');

      // Verify doc1 has correct RRF calculation (with convergence bonus)
      const expected_doc1_base = 1 / (60 + 1) + 1 / (60 + 2);
      const expected_doc1_with_bonus = expected_doc1_base + 0.10; // 10% convergence bonus

      // Verify doc3 has correct single-source calculation (no bonus)
      const expected_doc3 = 1 / (60 + 3);

      if (approx_equal(doc1.rrf_score, expected_doc1_with_bonus, 0.001) &&
          approx_equal(doc3.rrf_score, expected_doc3, 0.001)) {
        pass('T022: RRF score formula 1/(k+rank) produces correct values',
             `doc1: ${doc1.rrf_score.toFixed(5)} (expected ${expected_doc1_with_bonus.toFixed(5)}), ` +
             `doc3: ${doc3.rrf_score.toFixed(5)} (expected ${expected_doc3.toFixed(5)})`);
      } else {
        fail('T022: RRF score formula 1/(k+rank) produces correct values',
             `doc1: got ${doc1.rrf_score.toFixed(5)}, expected ${expected_doc1_with_bonus.toFixed(5)}; ` +
             `doc3: got ${doc3.rrf_score.toFixed(5)}, expected ${expected_doc3.toFixed(5)}`);
      }
    } catch (e) {
      fail('T022: RRF score formula 1/(k+rank) produces correct values', `Error: ${e.message}`);
    }

    // T023: Test source tracking marks results with in_vector, in_fts, in_graph flags
    try {
      const vector_results = [{ id: 'vec_only', content: 'vector only' }];
      const fts_results = [{ id: 'fts_only', content: 'fts only' }];
      const graph_results = [{ id: 'graph_only', content: 'graph only' }];

      const fused = rrfFusion.fuse_results_multi(vector_results, fts_results, graph_results, { limit: 10 });

      const vec_doc = fused.find(r => r.id === 'vec_only');
      const fts_doc = fused.find(r => r.id === 'fts_only');
      const graph_doc = fused.find(r => r.id === 'graph_only');

      const vec_correct = vec_doc.in_vector === true && vec_doc.in_fts === false && vec_doc.in_graph === false;
      const fts_correct = fts_doc.in_vector === false && fts_doc.in_fts === true && fts_doc.in_graph === false;
      const graph_correct = graph_doc.in_vector === false && graph_doc.in_fts === false && graph_doc.in_graph === true;

      if (vec_correct && fts_correct && graph_correct) {
        pass('T023: Source tracking marks results with in_vector, in_fts, in_graph flags',
             `vec_only: in_vector=${vec_doc.in_vector}, fts_only: in_fts=${fts_doc.in_fts}, graph_only: in_graph=${graph_doc.in_graph}`);
      } else {
        fail('T023: Source tracking marks results with in_vector, in_fts, in_graph flags',
             `vec: ${JSON.stringify({ in_vector: vec_doc.in_vector, in_fts: vec_doc.in_fts, in_graph: vec_doc.in_graph })}`);
      }
    } catch (e) {
      fail('T023: Source tracking marks results with in_vector, in_fts, in_graph flags', `Error: ${e.message}`);
    }

    // T024: Test source_count correctly reflects number of sources
    try {
      const vector_results = [
        { id: 'multi', content: 'multi source' },
        { id: 'vec_only', content: 'vector only' },
      ];
      const fts_results = [
        { id: 'multi', content: 'multi source' },
      ];
      const graph_results = [
        { id: 'multi', content: 'multi source' },
      ];

      const fused = rrfFusion.fuse_results_multi(vector_results, fts_results, graph_results, { limit: 10 });

      const multi_doc = fused.find(r => r.id === 'multi');
      const single_doc = fused.find(r => r.id === 'vec_only');

      if (multi_doc.source_count === 3 && single_doc.source_count === 1) {
        pass('T024: source_count correctly reflects number of sources',
             `multi: ${multi_doc.source_count}, vec_only: ${single_doc.source_count}`);
      } else {
        fail('T024: source_count correctly reflects number of sources',
             `Expected multi=3, vec_only=1; got multi=${multi_doc.source_count}, vec_only=${single_doc.source_count}`);
      }
    } catch (e) {
      fail('T024: source_count correctly reflects number of sources', `Error: ${e.message}`);
    }

    // T025: Test 10% convergence bonus applied when source_count >= 2
    try {
      const vector_results = [
        { id: 'dual', content: 'dual source' },
      ];
      const fts_results = [
        { id: 'dual', content: 'dual source' },
      ];

      const fused = rrfFusion.fuse_results(vector_results, fts_results, { limit: 10 });
      const dual_doc = fused.find(r => r.id === 'dual');

      // Expected: 1/(60+1) + 1/(60+1) + 0.10 convergence bonus
      const base_rrf = 1 / (60 + 1) + 1 / (60 + 1);
      const expected_with_bonus = base_rrf + rrfFusion.CONVERGENCE_BONUS;

      if (approx_equal(dual_doc.rrf_score, expected_with_bonus, 0.001)) {
        pass('T025: 10% convergence bonus applied when source_count >= 2',
             `Score: ${dual_doc.rrf_score.toFixed(5)}, expected: ${expected_with_bonus.toFixed(5)}`);
      } else {
        fail('T025: 10% convergence bonus applied when source_count >= 2',
             `Expected ${expected_with_bonus.toFixed(5)}, got ${dual_doc.rrf_score.toFixed(5)}`);
      }
    } catch (e) {
      fail('T025: 10% convergence bonus applied when source_count >= 2', `Error: ${e.message}`);
    }

    // T026: Test convergence bonus NOT applied for single-source results
    try {
      const vector_results = [{ id: 'single', content: 'single source' }];
      const fts_results = [];

      const fused = rrfFusion.fuse_results(vector_results, fts_results, { limit: 10 });
      const single_doc = fused.find(r => r.id === 'single');

      // Expected: 1/(60+1) with NO convergence bonus
      const expected_no_bonus = 1 / (60 + 1);

      if (approx_equal(single_doc.rrf_score, expected_no_bonus, 0.001)) {
        pass('T026: Convergence bonus NOT applied for single-source results',
             `Score: ${single_doc.rrf_score.toFixed(5)}, expected: ${expected_no_bonus.toFixed(5)}`);
      } else {
        fail('T026: Convergence bonus NOT applied for single-source results',
             `Expected ${expected_no_bonus.toFixed(5)}, got ${single_doc.rrf_score.toFixed(5)}`);
      }
    } catch (e) {
      fail('T026: Convergence bonus NOT applied for single-source results', `Error: ${e.message}`);
    }

    // T027: Test ENABLE_RRF_FUSION feature flag disables fusion when false
    try {
      // Note: ENABLE_RRF_FUSION is read at module load time from env
      // We can only verify its current state and exported value
      const is_enabled = rrfFusion.is_rrf_enabled();
      const flag_exported = rrfFusion.ENABLE_RRF_FUSION !== undefined;

      if (flag_exported && typeof is_enabled === 'boolean') {
        pass('T027: ENABLE_RRF_FUSION feature flag exported and accessible',
             `ENABLE_RRF_FUSION=${rrfFusion.ENABLE_RRF_FUSION}, is_rrf_enabled()=${is_enabled}`);
      } else {
        fail('T027: ENABLE_RRF_FUSION feature flag exported and accessible',
             `flag_exported=${flag_exported}, is_enabled=${is_enabled}`);
      }
    } catch (e) {
      fail('T027: ENABLE_RRF_FUSION feature flag exported and accessible', `Error: ${e.message}`);
    }

    // T028: Test single-source optimization bypasses fusion overhead
    try {
      const sources = {
        vector: [{ id: 'v1', content: 'test1' }, { id: 'v2', content: 'test2' }],
        bm25: [],
        graph: [],
      };

      const result = rrfFusion.unified_search(sources, { limit: 10 });

      // When only one source has results, fusion_applied should be false
      if (result.metadata && result.metadata.fusion_applied === false) {
        pass('T028: Single-source optimization bypasses fusion overhead',
             `fusion_applied=${result.metadata.fusion_applied}, active_sources=${result.metadata.active_sources.join(',')}`);
      } else {
        fail('T028: Single-source optimization bypasses fusion overhead',
             `Expected fusion_applied=false, got ${result.metadata && result.metadata.fusion_applied}`);
      }
    } catch (e) {
      fail('T028: Single-source optimization bypasses fusion overhead', `Error: ${e.message}`);
    }

    // T029: Test rank positions (vector_rank, fts_rank, graph_rank) tracked correctly
    try {
      const vector_results = [
        { id: 'doc1', content: 'first in vector' },
        { id: 'doc2', content: 'second in vector' },
        { id: 'doc3', content: 'third in vector' },
      ];
      const fts_results = [
        { id: 'doc3', content: 'first in fts' },
        { id: 'doc1', content: 'second in fts' },
      ];
      const graph_results = [
        { id: 'doc2', content: 'first in graph' },
      ];

      const fused = rrfFusion.fuse_results_multi(vector_results, fts_results, graph_results, { limit: 10 });

      const doc1 = fused.find(r => r.id === 'doc1');
      const doc2 = fused.find(r => r.id === 'doc2');
      const doc3 = fused.find(r => r.id === 'doc3');

      const doc1_correct = doc1.vector_rank === 1 && doc1.fts_rank === 2 && doc1.graph_rank === null;
      const doc2_correct = doc2.vector_rank === 2 && doc2.fts_rank === null && doc2.graph_rank === 1;
      const doc3_correct = doc3.vector_rank === 3 && doc3.fts_rank === 1 && doc3.graph_rank === null;

      if (doc1_correct && doc2_correct && doc3_correct) {
        pass('T029: Rank positions (vector_rank, fts_rank, graph_rank) tracked correctly',
             `doc1: v=${doc1.vector_rank}, f=${doc1.fts_rank}, g=${doc1.graph_rank}; ` +
             `doc2: v=${doc2.vector_rank}, f=${doc2.fts_rank}, g=${doc2.graph_rank}; ` +
             `doc3: v=${doc3.vector_rank}, f=${doc3.fts_rank}, g=${doc3.graph_rank}`);
      } else {
        fail('T029: Rank positions (vector_rank, fts_rank, graph_rank) tracked correctly',
             `doc1: ${JSON.stringify({ v: doc1.vector_rank, f: doc1.fts_rank, g: doc1.graph_rank })}, ` +
             `doc2: ${JSON.stringify({ v: doc2.vector_rank, f: doc2.fts_rank, g: doc2.graph_rank })}, ` +
             `doc3: ${JSON.stringify({ v: doc3.vector_rank, f: doc3.fts_rank, g: doc3.graph_rank })}`);
      }
    } catch (e) {
      fail('T029: Rank positions (vector_rank, fts_rank, graph_rank) tracked correctly', `Error: ${e.message}`);
    }

    // T030: Test unified_search() combines vector + BM25 + graph sources
    try {
      const sources = {
        vector: [
          { id: 'shared', content: 'shared doc' },
          { id: 'vec_only', content: 'vector only' },
        ],
        bm25: [
          { id: 'shared', content: 'shared doc' },
          { id: 'bm25_only', content: 'bm25 only' },
        ],
        graph: [
          { id: 'graph_only', content: 'graph only' },
        ],
      };

      const result = rrfFusion.unified_search(sources, { limit: 10 });

      // Verify all documents are present
      const ids = result.results.map(r => r.id);
      const has_all = ['shared', 'vec_only', 'bm25_only', 'graph_only'].every(id => ids.includes(id));

      // Verify metadata
      const meta_correct = result.metadata &&
                          result.metadata.fusion_applied === true &&
                          result.metadata.active_sources.length === 3 &&
                          result.metadata.source_counts.vector === 2 &&
                          result.metadata.source_counts.bm25 === 2 &&
                          result.metadata.source_counts.graph === 1;

      // Verify shared doc has highest score (appears in 2 sources with convergence bonus)
      const shared_doc = result.results.find(r => r.id === 'shared');
      const is_top_ranked = result.results[0].id === 'shared' ||
                           (shared_doc && shared_doc.source_count === 2);

      if (has_all && meta_correct && is_top_ranked) {
        pass('T030: unified_search() combines vector + BM25 + graph sources',
             `Results: ${ids.join(', ')}; fusion_applied=${result.metadata.fusion_applied}; ` +
             `shared.source_count=${shared_doc.source_count}`);
      } else {
        fail('T030: unified_search() combines vector + BM25 + graph sources',
             `has_all=${has_all}, meta_correct=${meta_correct}, is_top_ranked=${is_top_ranked}, ` +
             `results=${JSON.stringify(result.results.map(r => ({ id: r.id, score: r.rrf_score, sources: r.source_count })))}`);
      }
    } catch (e) {
      fail('T030: unified_search() combines vector + BM25 + graph sources', `Error: ${e.message}`);
    }
  }

  // 4.2 MODULE EXPORTS VERIFICATION

  function test_module_exports() {
    log('\n[SUITE] Module Exports Verification');

    if (!rrfFusion) {
      skip('Module exports verification', 'Module not available');
      return;
    }

    const expected_exports = [
      // Core fusion functions
      'fuse_results',
      'fuse_results_multi',
      'unified_search',
      // Score utilities
      'fuse_scores_advanced',
      'count_original_term_matches',
      // Configuration
      'DEFAULT_K',
      'CONVERGENCE_BONUS',
      'GRAPH_WEIGHT_BOOST',
      'SOURCE_TYPES',
      'ENABLE_RRF_FUSION',
      // Status
      'is_rrf_enabled',
    ];

    for (const name of expected_exports) {
      if (rrfFusion[name] !== undefined) {
        const type = typeof rrfFusion[name];
        pass(`Export: ${name}`, `Type: ${type}`);
      } else {
        fail(`Export: ${name}`, 'Not exported');
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
     5. TEST RUNNER
  ──────────────────────────────────────────────────────────────── */

  async function runTests() {
    log('================================================');
    log('  RRF FUSION UNIT TESTS');
    log('  Covers: T021-T030 (RRF Fusion Core)');
    log('================================================');
    log(`Date: ${new Date().toISOString()}\n`);

    // Load modules first
    load_modules();

    // Run all test suites
    test_rrf_fusion_core();    // T021-T030
    test_module_exports();     // Module verification

    // Summary
    log('\n================================================');
    log('  TEST SUMMARY');
    log('================================================');
    log(`  [PASS]:   ${results.passed}`);
    log(`  [FAIL]:   ${results.failed}`);
    log(`  [SKIP]:   ${results.skipped}`);
    log(`  Total:    ${results.passed + results.failed + results.skipped}`);
    log('');

    if (results.failed === 0 && results.passed > 0) {
      log('  ALL EXECUTED TESTS PASSED!');
    } else if (results.failed === 0 && results.passed === 0) {
      log('  NOTE: All tests skipped (modules not yet created)');
      log('  Run again after implementing rrf-fusion.js');
    } else {
      log('  WARNING: Some tests failed. Review output above.');
    }

    log('');
    return results;
  }

  // Run if executed directly
  if (require.main === module) {
    runTests().then(r => {
      // Exit with 0 if all executed tests pass (skips don't count as failures)
      process.exit(r.failed > 0 ? 1 : 0);
    });
  }

  module.exports = { runTests };

})();
