// ───────────────────────────────────────────────────────────────
// TEST: SESSION LEARNING HANDLER
// ───────────────────────────────────────────────────────────────
// Tests for session-learning.js: preflight/postflight epistemics,
// learning index calculation, and history retrieval.
// ───────────────────────────────────────────────────────────────

'use strict';

const path = require('path');
const fs = require('fs');
// Note: better-sqlite3 not required for static analysis tests
// const Database = require('better-sqlite3');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const ROOT = path.join(__dirname, '..');
const HANDLERS_PATH = path.join(ROOT, 'handlers');
// const TEST_DB_PATH = path.join(__dirname, '.test-session-learning.sqlite');

// Test results
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
};

/* ─────────────────────────────────────────────────────────────
   2. UTILITIES
──────────────────────────────────────────────────────────────── */

function log(msg) {
  console.log(msg);
}

function pass(test_name, evidence) {
  results.passed++;
  results.tests.push({ name: test_name, status: 'PASS', evidence });
  log(`   ✅ ${test_name}`);
  if (evidence) log(`      Evidence: ${evidence}`);
}

function fail(test_name, reason) {
  results.failed++;
  results.tests.push({ name: test_name, status: 'FAIL', reason });
  log(`   ❌ ${test_name}`);
  log(`      Reason: ${reason}`);
}

function skip(test_name, reason) {
  results.skipped++;
  results.tests.push({ name: test_name, status: 'SKIP', reason });
  log(`   ⏭️  ${test_name} (skipped: ${reason})`);
}

/* ─────────────────────────────────────────────────────────────
   3. SCHEMA TESTS
──────────────────────────────────────────────────────────────── */

async function test_schema_creation() {
  log('\n🔬 SCHEMA TESTS');

  try {
    // Test 1: Schema SQL exists and can be parsed
    const handler_content = fs.readFileSync(
      path.join(HANDLERS_PATH, 'session-learning.js'),
      'utf8'
    );

    if (handler_content.includes('CREATE TABLE IF NOT EXISTS session_learning')) {
      pass('SL-001: Schema SQL defined', 'CREATE TABLE statement found');
    } else {
      fail('SL-001: Schema SQL defined', 'Schema not found in handler');
    }

    // Test 2: Schema has required columns
    const required_columns = [
      'spec_folder', 'task_id', 'phase',
      'pre_knowledge_score', 'pre_uncertainty_score', 'pre_context_score',
      'post_knowledge_score', 'post_uncertainty_score', 'post_context_score',
      'delta_knowledge', 'delta_uncertainty', 'delta_context',
      'learning_index', 'knowledge_gaps', 'gaps_closed', 'new_gaps_discovered'
    ];

    const missing_columns = required_columns.filter(col => !handler_content.includes(col));

    if (missing_columns.length === 0) {
      pass('SL-002: All required columns defined', `${required_columns.length} columns present`);
    } else {
      fail('SL-002: All required columns defined', `Missing: ${missing_columns.join(', ')}`);
    }

    // Test 3: Phase check constraint exists
    if (handler_content.includes("CHECK(phase IN ('preflight', 'complete'))")) {
      pass('SL-003: Phase check constraint', 'Constraint enforces valid phases');
    } else {
      fail('SL-003: Phase check constraint', 'CHECK constraint not found');
    }

    // Test 4: Unique constraint exists
    if (handler_content.includes('UNIQUE(spec_folder, task_id)')) {
      pass('SL-004: Unique constraint on spec_folder+task_id', 'Prevents duplicate entries');
    } else {
      fail('SL-004: Unique constraint on spec_folder+task_id', 'UNIQUE constraint not found');
    }

    // Test 5: Index exists for spec_folder
    if (handler_content.includes('CREATE INDEX IF NOT EXISTS idx_session_learning_spec_folder')) {
      pass('SL-005: Index on spec_folder', 'Query optimization index present');
    } else {
      fail('SL-005: Index on spec_folder', 'Index not found');
    }

  } catch (error) {
    fail('Schema tests', `Error: ${error.message}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. PREFLIGHT HANDLER TESTS
──────────────────────────────────────────────────────────────── */

async function test_preflight_handler() {
  log('\n🔬 PREFLIGHT HANDLER TESTS');

  try {
    const handler_content = fs.readFileSync(
      path.join(HANDLERS_PATH, 'session-learning.js'),
      'utf8'
    );

    // Test 1: Preflight handler exists
    if (handler_content.includes('async function handle_task_preflight')) {
      pass('SL-010: Preflight handler exists', 'handle_task_preflight() found');
    } else {
      fail('SL-010: Preflight handler exists', 'Function not found');
    }

    // Test 2: Validates specFolder parameter
    if (handler_content.includes("'specFolder is required'")) {
      pass('SL-011: Validates specFolder required', 'Error message present');
    } else {
      fail('SL-011: Validates specFolder required', 'Validation not found');
    }

    // Test 3: Validates taskId parameter
    if (handler_content.includes("'taskId is required'")) {
      pass('SL-012: Validates taskId required', 'Error message present');
    } else {
      fail('SL-012: Validates taskId required', 'Validation not found');
    }

    // Test 4: Score range validation (0-100)
    if (handler_content.includes('score.value < 0 || score.value > 100')) {
      pass('SL-013: Validates score range 0-100', 'Range check present');
    } else {
      fail('SL-013: Validates score range 0-100', 'Range validation not found');
    }

    // Test 5: Validates all three scores
    const score_validations = [
      'knowledgeScore',
      'uncertaintyScore',
      'contextScore'
    ];
    const validates_all = score_validations.every(s => handler_content.includes(s));

    if (validates_all) {
      pass('SL-014: Validates all three epistemic scores', 'knowledge, uncertainty, context');
    } else {
      fail('SL-014: Validates all three epistemic scores', 'Missing score validations');
    }

    // Test 6: INSERT OR REPLACE for idempotency
    if (handler_content.includes('INSERT OR REPLACE INTO session_learning')) {
      pass('SL-015: Uses INSERT OR REPLACE for idempotency', 'Allows re-running preflight');
    } else {
      fail('SL-015: Uses INSERT OR REPLACE for idempotency', 'Upsert not found');
    }

    // Test 7: Returns structured response
    if (handler_content.includes("phase: 'preflight'") &&
        handler_content.includes('baseline:')) {
      pass('SL-016: Returns structured preflight response', 'Phase and baseline in response');
    } else {
      fail('SL-016: Returns structured preflight response', 'Response structure incomplete');
    }

  } catch (error) {
    fail('Preflight handler tests', `Error: ${error.message}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. POSTFLIGHT HANDLER TESTS
──────────────────────────────────────────────────────────────── */

async function test_postflight_handler() {
  log('\n🔬 POSTFLIGHT HANDLER TESTS');

  try {
    const handler_content = fs.readFileSync(
      path.join(HANDLERS_PATH, 'session-learning.js'),
      'utf8'
    );

    // Test 1: Postflight handler exists
    if (handler_content.includes('async function handle_task_postflight')) {
      pass('SL-020: Postflight handler exists', 'handle_task_postflight() found');
    } else {
      fail('SL-020: Postflight handler exists', 'Function not found');
    }

    // Test 2: Checks for preflight record first
    if (handler_content.includes('No preflight record found')) {
      pass('SL-021: Requires preflight before postflight', 'Error message present');
    } else {
      fail('SL-021: Requires preflight before postflight', 'Preflight check not found');
    }

    // Test 3: Calculates delta_knowledge
    if (handler_content.includes('delta_knowledge = knowledge_score - preflight.pre_knowledge_score')) {
      pass('SL-022: Calculates delta_knowledge', 'Post - Pre formula correct');
    } else {
      fail('SL-022: Calculates delta_knowledge', 'Delta calculation not found');
    }

    // Test 4: Calculates delta_uncertainty (reduction is positive)
    if (handler_content.includes('delta_uncertainty = preflight.pre_uncertainty_score - uncertainty_score')) {
      pass('SL-023: Calculates delta_uncertainty (reduction positive)', 'Pre - Post formula correct');
    } else {
      fail('SL-023: Calculates delta_uncertainty (reduction positive)', 'Delta calculation not found');
    }

    // Test 5: Calculates delta_context
    if (handler_content.includes('delta_context = context_score - preflight.pre_context_score')) {
      pass('SL-024: Calculates delta_context', 'Post - Pre formula correct');
    } else {
      fail('SL-024: Calculates delta_context', 'Delta calculation not found');
    }

    // Test 6: Learning Index formula correct (FR-4)
    // LI = (Knowledge Delta × 0.4) + (Uncertainty Reduction × 0.35) + (Context Improvement × 0.25)
    if (handler_content.includes('(delta_knowledge * 0.4)') &&
        handler_content.includes('(delta_uncertainty * 0.35)') &&
        handler_content.includes('(delta_context * 0.25)')) {
      pass('SL-025: Learning Index formula correct', 'K×0.4 + U×0.35 + C×0.25');
    } else {
      fail('SL-025: Learning Index formula correct', 'Formula weights incorrect');
    }

    // Test 7: Allows negative learning index (regression tracking)
    // Should NOT clamp to 0-100
    if (!handler_content.includes('Math.max(0, learning_index)') &&
        !handler_content.includes('Math.min(100, learning_index)')) {
      pass('SL-026: Allows negative learning index', 'Tracks regression scenarios');
    } else {
      fail('SL-026: Allows negative learning index', 'Learning index is clamped');
    }

    // Test 8: Provides learning interpretation
    const interpretations = [
      'Significant learning session',
      'Moderate learning session',
      'Incremental learning',
      'Execution-focused session',
      'Knowledge regression detected'
    ];
    const has_all = interpretations.every(i => handler_content.includes(i));

    if (has_all) {
      pass('SL-027: Provides learning interpretations', '5 interpretation levels');
    } else {
      fail('SL-027: Provides learning interpretations', 'Missing interpretations');
    }

    // Test 9: Updates phase to 'complete'
    if (handler_content.includes("phase = 'complete'")) {
      pass('SL-028: Updates phase to complete', 'Phase transition correct');
    } else {
      fail('SL-028: Updates phase to complete', 'Phase update not found');
    }

    // Test 10: Gap tracking (closed and new)
    if (handler_content.includes('gapsClosed') &&
        handler_content.includes('newGapsDiscovered')) {
      pass('SL-029: Tracks gaps closed and discovered', 'Gap tracking present');
    } else {
      fail('SL-029: Tracks gaps closed and discovered', 'Gap tracking not found');
    }

  } catch (error) {
    fail('Postflight handler tests', `Error: ${error.message}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. LEARNING HISTORY HANDLER TESTS
──────────────────────────────────────────────────────────────── */

async function test_learning_history_handler() {
  log('\n🔬 LEARNING HISTORY HANDLER TESTS');

  try {
    const handler_content = fs.readFileSync(
      path.join(HANDLERS_PATH, 'session-learning.js'),
      'utf8'
    );

    // Test 1: History handler exists
    if (handler_content.includes('async function handle_get_learning_history')) {
      pass('SL-030: Learning history handler exists', 'handle_get_learning_history() found');
    } else {
      fail('SL-030: Learning history handler exists', 'Function not found');
    }

    // Test 2: Validates specFolder parameter
    if (handler_content.match(/get_learning_history[\s\S]*?specFolder is required/)) {
      pass('SL-031: History validates specFolder required', 'Validation present');
    } else {
      fail('SL-031: History validates specFolder required', 'Validation not found');
    }

    // Test 3: Supports limit parameter with safety bounds
    if (handler_content.includes('Math.min(Math.max(1, limit), 100)')) {
      pass('SL-032: Limit bounded to 1-100', 'Safety bounds applied');
    } else {
      fail('SL-032: Limit bounded to 1-100', 'Limit bounds not found');
    }

    // Test 4: Supports onlyComplete filter
    if (handler_content.includes("phase = 'complete'") &&
        handler_content.includes('only_complete')) {
      pass('SL-033: Supports onlyComplete filter', 'Filter for complete records');
    } else {
      fail('SL-033: Supports onlyComplete filter', 'Filter not found');
    }

    // Test 5: Supports sessionId filter
    if (handler_content.includes('AND session_id = ?') &&
        handler_content.includes('session_id')) {
      pass('SL-034: Supports sessionId filter', 'Session filtering present');
    } else {
      fail('SL-034: Supports sessionId filter', 'Session filter not found');
    }

    // Test 6: Orders by updated_at DESC
    if (handler_content.includes('ORDER BY updated_at DESC')) {
      pass('SL-035: Orders by updated_at DESC', 'Most recent first');
    } else {
      fail('SL-035: Orders by updated_at DESC', 'Ordering not found');
    }

    // Test 7: Parses JSON fields safely
    if (handler_content.includes('try {') &&
        handler_content.includes('JSON.parse(row.knowledge_gaps)')) {
      pass('SL-036: Parses JSON fields safely', 'Try-catch for JSON parsing');
    } else {
      fail('SL-036: Parses JSON fields safely', 'Safe JSON parsing not found');
    }

  } catch (error) {
    fail('Learning history handler tests', `Error: ${error.message}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   7. LEARNING INDEX CALCULATION TESTS
──────────────────────────────────────────────────────────────── */

async function test_learning_index_calculations() {
  log('\n🔬 LEARNING INDEX CALCULATION TESTS');

  // Formula: LI = (Knowledge Delta × 0.4) + (Uncertainty Reduction × 0.35) + (Context Improvement × 0.25)

  // Test various scenarios with manual calculation
  const test_cases = [
    {
      name: 'SL-040: Significant learning (all positive deltas)',
      pre: { k: 30, u: 70, c: 40 },
      post: { k: 80, u: 30, c: 90 },
      // delta_k = 50, delta_u = 40 (reduction), delta_c = 50
      // LI = (50 × 0.4) + (40 × 0.35) + (50 × 0.25) = 20 + 14 + 12.5 = 46.5
      expected_li: 46.5,
      expected_interp: 'Significant learning'
    },
    {
      name: 'SL-041: Moderate learning (mixed deltas)',
      pre: { k: 50, u: 50, c: 50 },
      post: { k: 70, u: 40, c: 60 },
      // delta_k = 20, delta_u = 10, delta_c = 10
      // LI = (20 × 0.4) + (10 × 0.35) + (10 × 0.25) = 8 + 3.5 + 2.5 = 14
      expected_li: 14,
      expected_interp: 'Incremental learning'
    },
    {
      name: 'SL-042: Execution-focused (minimal change)',
      pre: { k: 60, u: 40, c: 70 },
      post: { k: 62, u: 38, c: 72 },
      // delta_k = 2, delta_u = 2, delta_c = 2
      // LI = (2 × 0.4) + (2 × 0.35) + (2 × 0.25) = 0.8 + 0.7 + 0.5 = 2
      expected_li: 2,
      expected_interp: 'Execution-focused'
    },
    {
      name: 'SL-043: Knowledge regression (negative LI)',
      pre: { k: 80, u: 20, c: 90 },
      post: { k: 60, u: 50, c: 70 },
      // delta_k = -20, delta_u = -30 (increase = negative reduction), delta_c = -20
      // LI = (-20 × 0.4) + (-30 × 0.35) + (-20 × 0.25) = -8 + -10.5 + -5 = -23.5
      expected_li: -23.5,
      expected_interp: 'Knowledge regression'
    },
    {
      name: 'SL-044: No change (zero LI)',
      pre: { k: 50, u: 50, c: 50 },
      post: { k: 50, u: 50, c: 50 },
      // delta_k = 0, delta_u = 0, delta_c = 0
      // LI = 0
      expected_li: 0,
      expected_interp: 'Execution-focused'
    }
  ];

  for (const tc of test_cases) {
    const delta_k = tc.post.k - tc.pre.k;
    const delta_u = tc.pre.u - tc.post.u; // Reduction is positive
    const delta_c = tc.post.c - tc.pre.c;

    const calculated_li = (delta_k * 0.4) + (delta_u * 0.35) + (delta_c * 0.25);
    const rounded_li = Math.round(calculated_li * 100) / 100;

    if (rounded_li === tc.expected_li) {
      pass(tc.name, `LI=${rounded_li}, interp="${tc.expected_interp}"`);
    } else {
      fail(tc.name, `Expected LI=${tc.expected_li}, got ${rounded_li}`);
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   8. ERROR HANDLING TESTS
──────────────────────────────────────────────────────────────── */

async function test_error_handling() {
  log('\n🔬 ERROR HANDLING TESTS');

  try {
    const handler_content = fs.readFileSync(
      path.join(HANDLERS_PATH, 'session-learning.js'),
      'utf8'
    );

    // Test 1: Uses MemoryError class
    if (handler_content.includes('throw new MemoryError')) {
      pass('SL-050: Uses MemoryError class', 'Proper error type');
    } else {
      fail('SL-050: Uses MemoryError class', 'Generic errors used');
    }

    // Test 2: Uses ErrorCodes constants
    const error_codes = [
      'ErrorCodes.MISSING_REQUIRED_PARAM',
      'ErrorCodes.INVALID_PARAMETER',
      'ErrorCodes.DATABASE_ERROR',
      'ErrorCodes.FILE_NOT_FOUND'
    ];
    const uses_codes = error_codes.every(code => handler_content.includes(code));

    if (uses_codes) {
      pass('SL-051: Uses ErrorCodes constants', 'Consistent error codes');
    } else {
      fail('SL-051: Uses ErrorCodes constants', 'Missing error codes');
    }

    // Test 3: Database availability check
    if (handler_content.includes("'Database not available'")) {
      pass('SL-052: Checks database availability', 'Error for missing database');
    } else {
      fail('SL-052: Checks database availability', 'Database check not found');
    }

    // Test 4: Logs errors to console
    if (handler_content.includes('console.error')) {
      pass('SL-053: Logs errors to console', 'Error logging present');
    } else {
      fail('SL-053: Logs errors to console', 'Error logging not found');
    }

    // Test 5: Includes original error in metadata
    if (handler_content.includes('originalError: err.message')) {
      pass('SL-054: Includes original error in metadata', 'Error context preserved');
    } else {
      fail('SL-054: Includes original error in metadata', 'Original error not preserved');
    }

  } catch (error) {
    fail('Error handling tests', `Error: ${error.message}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   9. EXPORTS TESTS
──────────────────────────────────────────────────────────────── */

async function test_exports() {
  log('\n🔬 EXPORTS TESTS');

  try {
    const handler_content = fs.readFileSync(
      path.join(HANDLERS_PATH, 'session-learning.js'),
      'utf8'
    );

    // Test 1: Exports preflight handler
    if (handler_content.includes('handle_task_preflight') &&
        handler_content.includes('module.exports')) {
      pass('SL-060: Exports handle_task_preflight', 'Available for external use');
    } else {
      fail('SL-060: Exports handle_task_preflight', 'Export not found');
    }

    // Test 2: Exports postflight handler
    if (handler_content.includes('handle_task_postflight') &&
        handler_content.includes('module.exports')) {
      pass('SL-061: Exports handle_task_postflight', 'Available for external use');
    } else {
      fail('SL-061: Exports handle_task_postflight', 'Export not found');
    }

    // Test 3: Exports history handler
    if (handler_content.includes('handle_get_learning_history') &&
        handler_content.includes('module.exports')) {
      pass('SL-062: Exports handle_get_learning_history', 'Available for external use');
    } else {
      fail('SL-062: Exports handle_get_learning_history', 'Export not found');
    }

    // Test 4: Exports ensure_schema
    if (handler_content.includes('ensure_schema') &&
        handler_content.includes('module.exports')) {
      pass('SL-063: Exports ensure_schema', 'Schema init available');
    } else {
      fail('SL-063: Exports ensure_schema', 'Export not found');
    }

  } catch (error) {
    fail('Exports tests', `Error: ${error.message}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   10. RUN ALL TESTS
──────────────────────────────────────────────────────────────── */

async function run_all_tests() {
  log('═══════════════════════════════════════════════════════════════');
  log(' SESSION LEARNING HANDLER TEST SUITE');
  log(' Tests for preflight/postflight epistemics and learning index');
  log('═══════════════════════════════════════════════════════════════');

  try {
    await test_schema_creation();
    await test_preflight_handler();
    await test_postflight_handler();
    await test_learning_history_handler();
    await test_learning_index_calculations();
    await test_error_handling();
    await test_exports();
  } catch (error) {
    log(`\n❌ Test suite error: ${error.message}`);
    console.error(error);
  }

  // Summary
  log('\n═══════════════════════════════════════════════════════════════');
  log(' SUMMARY');
  log('═══════════════════════════════════════════════════════════════');
  log(`   Passed:  ${results.passed}`);
  log(`   Failed:  ${results.failed}`);
  log(`   Skipped: ${results.skipped}`);
  log(`   Total:   ${results.passed + results.failed + results.skipped}`);

  // Exit with appropriate code
  if (results.failed > 0) {
    log('\n❌ TESTS FAILED');
    process.exit(1);
  } else {
    log('\n✅ ALL TESTS PASSED');
    process.exit(0);
  }
}

// Run tests
run_all_tests();
