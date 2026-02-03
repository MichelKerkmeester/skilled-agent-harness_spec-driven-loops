// ───────────────────────────────────────────────────────────────
// TESTS: SESSION MANAGER (T001-T008)
// ───────────────────────────────────────────────────────────────
// T001-T008: Core session deduplication functionality
// REQ-001: Session Deduplication - Hash-based duplicate prevention
'use strict';

const assert = require('assert');
const path = require('path');
const Database = require('better-sqlite3');

// Import session manager
const sessionManager = require('../lib/session/session-manager.js');

/* ─────────────────────────────────────────────────────────────
   1. TEST CONFIGURATION
──────────────────────────────────────────────────────────────── */

const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
};

let testDb;

/* ─────────────────────────────────────────────────────────────
   2. TEST UTILITIES
──────────────────────────────────────────────────────────────── */

function log(msg) {
  console.log(msg);
}

function pass(testId, testName, evidence) {
  results.passed++;
  results.tests.push({ id: testId, name: testName, status: 'PASS', evidence });
  log(`   ✅ ${testId}: ${testName}`);
  if (evidence) log(`      Evidence: ${evidence}`);
}

function fail(testId, testName, reason) {
  results.failed++;
  results.tests.push({ id: testId, name: testName, status: 'FAIL', reason });
  log(`   ❌ ${testId}: ${testName}`);
  log(`      Reason: ${reason}`);
}

function skip(testId, testName, reason) {
  results.skipped++;
  results.tests.push({ id: testId, name: testName, status: 'SKIP', reason });
  log(`   ⏭️  ${testId}: ${testName} (skipped: ${reason})`);
}

/**
 * Create a fresh database and initialize session manager
 */
function setup() {
  // Create in-memory database for testing
  testDb = new Database(':memory:');

  // Initialize session manager
  const result = sessionManager.init(testDb);
  if (!result.success) {
    throw new Error(`Failed to initialize session manager: ${result.error}`);
  }
}

/**
 * Clean up database after tests
 */
function teardown() {
  if (testDb) {
    testDb.close();
    testDb = null;
  }
}

/**
 * Reset database between tests for isolation
 */
function resetDb() {
  if (testDb) {
    // Clear the session_sent_memories table
    try {
      testDb.exec('DELETE FROM session_sent_memories');
    } catch (e) {
      // Table might not exist yet
    }
  }
}

/**
 * Create a mock memory object
 * @param {object} overrides - Properties to override defaults
 * @returns {object} Memory object
 */
function createMemory(overrides = {}) {
  return {
    id: 1,
    file_path: '/specs/test-spec/memory/test.md',
    anchor_id: 'test-anchor',
    content_hash: null,
    title: 'Test Memory',
    ...overrides,
  };
}

/* ─────────────────────────────────────────────────────────────
   3. T001: SESSION MANAGER INSTANTIATION
──────────────────────────────────────────────────────────────── */

function test_T001_session_manager_instantiation() {
  log('\n🔬 T001: SessionManager class instantiation with default config');

  try {
    // Verify module exports exist
    const requiredExports = [
      'init',
      'ensureSchema',
      'getDb',
      'generateMemoryHash',
      'shouldSendMemory',
      'markMemorySent',
      'isEnabled',
      'getConfig',
    ];

    const missingExports = requiredExports.filter(exp => typeof sessionManager[exp] !== 'function');

    if (missingExports.length > 0) {
      fail('T001', 'SessionManager exports all required functions',
        `Missing exports: ${missingExports.join(', ')}`);
      return;
    }

    // Verify default config
    const config = sessionManager.getConfig();

    if (typeof config.sessionTtlMinutes !== 'number') {
      fail('T001', 'Default config has sessionTtlMinutes',
        `sessionTtlMinutes is ${typeof config.sessionTtlMinutes}`);
      return;
    }

    if (typeof config.maxEntriesPerSession !== 'number') {
      fail('T001', 'Default config has maxEntriesPerSession',
        `maxEntriesPerSession is ${typeof config.maxEntriesPerSession}`);
      return;
    }

    if (typeof config.enabled !== 'boolean') {
      fail('T001', 'Default config has enabled flag',
        `enabled is ${typeof config.enabled}`);
      return;
    }

    // Verify init was successful
    if (!sessionManager.getDb()) {
      fail('T001', 'Database reference set after init', 'getDb() returned null');
      return;
    }

    pass('T001', 'SessionManager instantiates with default config',
      `Config: TTL=${config.sessionTtlMinutes}min, maxEntries=${config.maxEntriesPerSession}, enabled=${config.enabled}`);

  } catch (error) {
    fail('T001', 'SessionManager class instantiation', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. T002: HASH GENERATION
──────────────────────────────────────────────────────────────── */

function test_T002_hash_generation() {
  log('\n🔬 T002: Hash generation for memory content fingerprinting');

  try {
    // Test 1: Hash generation with content_hash
    const memory1 = createMemory({ content_hash: 'abc123def456' });
    const hash1 = sessionManager.generateMemoryHash(memory1);

    if (typeof hash1 !== 'string' || hash1.length !== 16) {
      fail('T002', 'Hash generated with content_hash',
        `Expected 16-char string, got: ${typeof hash1} (length: ${hash1?.length})`);
      return;
    }

    // Test 2: Hash generation with id + anchor_id + file_path (fallback)
    const memory2 = createMemory({
      id: 42,
      anchor_id: 'decisions',
      file_path: '/specs/test/memory/dec.md'
    });
    const hash2 = sessionManager.generateMemoryHash(memory2);

    if (typeof hash2 !== 'string' || hash2.length !== 16) {
      fail('T002', 'Hash generated with id fallback',
        `Expected 16-char string, got: ${typeof hash2} (length: ${hash2?.length})`);
      return;
    }

    // Test 3: Same input produces same hash (deterministic)
    const hash1b = sessionManager.generateMemoryHash(memory1);
    if (hash1 !== hash1b) {
      fail('T002', 'Hash is deterministic',
        `Same input produced different hashes: ${hash1} vs ${hash1b}`);
      return;
    }

    // Test 4: Different inputs produce different hashes
    if (hash1 === hash2) {
      fail('T002', 'Different inputs produce different hashes',
        `Both hashes were identical: ${hash1}`);
      return;
    }

    // Test 5: Null memory throws error
    try {
      sessionManager.generateMemoryHash(null);
      fail('T002', 'Null memory throws error', 'No error was thrown');
      return;
    } catch (e) {
      // Expected
    }

    pass('T002', 'Hash generation works correctly',
      `hash1=${hash1}, hash2=${hash2}, deterministic=true, null-check=pass`);

  } catch (error) {
    fail('T002', 'Hash generation for memory fingerprinting', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. T003: shouldSendMemory() RETURNS TRUE FOR NEW MEMORIES
──────────────────────────────────────────────────────────────── */

function test_T003_should_send_new_memory() {
  log('\n🔬 T003: shouldSendMemory() returns true for new memories');

  try {
    resetDb();

    const sessionId = 'test-session-T003';
    const memory = createMemory({ id: 100, anchor_id: 'new-memory' });

    // New memory should return true
    const shouldSend = sessionManager.shouldSendMemory(sessionId, memory);

    if (shouldSend !== true) {
      fail('T003', 'New memory should be sent',
        `shouldSendMemory returned ${shouldSend}, expected true`);
      return;
    }

    // Test with just a memory ID (number)
    const shouldSend2 = sessionManager.shouldSendMemory(sessionId, 999);
    if (shouldSend2 !== true) {
      fail('T003', 'New memory ID should be sent',
        `shouldSendMemory(number) returned ${shouldSend2}, expected true`);
      return;
    }

    pass('T003', 'shouldSendMemory() returns true for new memories',
      'Both memory object and memory ID correctly returned true');

  } catch (error) {
    fail('T003', 'shouldSendMemory() for new memories', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. T004: shouldSendMemory() RETURNS FALSE FOR ALREADY-SENT
──────────────────────────────────────────────────────────────── */

function test_T004_should_not_send_duplicate() {
  log('\n🔬 T004: shouldSendMemory() returns false for already-sent memories');

  try {
    resetDb();

    const sessionId = 'test-session-T004';
    const memory = createMemory({ id: 200, anchor_id: 'sent-memory' });

    // First check - should be true (new memory)
    const firstCheck = sessionManager.shouldSendMemory(sessionId, memory);
    if (firstCheck !== true) {
      fail('T004', 'First check returns true',
        `First shouldSendMemory returned ${firstCheck}`);
      return;
    }

    // Mark as sent
    const markResult = sessionManager.markMemorySent(sessionId, memory);
    if (!markResult.success) {
      fail('T004', 'markMemorySent succeeds',
        `markMemorySent failed: ${markResult.error}`);
      return;
    }

    // Second check - should be false (already sent)
    const secondCheck = sessionManager.shouldSendMemory(sessionId, memory);
    if (secondCheck !== false) {
      fail('T004', 'Second check returns false',
        `After marking as sent, shouldSendMemory returned ${secondCheck}, expected false`);
      return;
    }

    pass('T004', 'shouldSendMemory() returns false for already-sent memories',
      'Memory correctly blocked after being marked as sent');

  } catch (error) {
    fail('T004', 'shouldSendMemory() for already-sent memories', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   7. T005: markMemorySent() TRACKS SENT MEMORY IDS
──────────────────────────────────────────────────────────────── */

function test_T005_mark_memory_sent_tracking() {
  log('\n🔬 T005: markMemorySent() correctly tracks sent memory IDs');

  try {
    resetDb();

    const sessionId = 'test-session-T005';
    const memories = [
      createMemory({ id: 301, anchor_id: 'memory-a' }),
      createMemory({ id: 302, anchor_id: 'memory-b' }),
      createMemory({ id: 303, anchor_id: 'memory-c' }),
    ];

    // Mark each memory as sent and verify
    for (const memory of memories) {
      const result = sessionManager.markMemorySent(sessionId, memory);

      if (!result.success) {
        fail('T005', `markMemorySent for memory ${memory.id}`,
          `Failed: ${result.error}`);
        return;
      }

      if (typeof result.hash !== 'string' || result.hash.length !== 16) {
        fail('T005', 'markMemorySent returns hash',
          `Expected 16-char hash, got: ${result.hash}`);
        return;
      }
    }

    // Verify all are now blocked
    let allBlocked = true;
    for (const memory of memories) {
      if (sessionManager.shouldSendMemory(sessionId, memory) !== false) {
        allBlocked = false;
        break;
      }
    }

    if (!allBlocked) {
      fail('T005', 'All marked memories are blocked',
        'Some memories were not properly tracked');
      return;
    }

    // Verify database state
    const count = testDb.prepare(`
      SELECT COUNT(*) as count FROM session_sent_memories WHERE session_id = ?
    `).get(sessionId);

    if (count.count !== 3) {
      fail('T005', 'Database contains correct number of entries',
        `Expected 3 entries, found ${count.count}`);
      return;
    }

    pass('T005', 'markMemorySent() correctly tracks sent memory IDs',
      `Tracked ${count.count} memories, all correctly blocked`);

  } catch (error) {
    fail('T005', 'markMemorySent() tracking', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   8. T006: SESSION ID GENERATION IS UNIQUE
──────────────────────────────────────────────────────────────── */

function test_T006_session_id_uniqueness() {
  log('\n🔬 T006: Session ID generation is unique per session');

  try {
    resetDb();

    // Test that different sessions maintain separate tracking
    const session1 = 'session-unique-001';
    const session2 = 'session-unique-002';
    const memory = createMemory({ id: 400, anchor_id: 'shared-memory' });

    // Mark memory as sent in session1
    sessionManager.markMemorySent(session1, memory);

    // Session1 should block the memory
    const session1Check = sessionManager.shouldSendMemory(session1, memory);
    if (session1Check !== false) {
      fail('T006', 'Session1 blocks sent memory',
        `Session1 shouldSendMemory returned ${session1Check}`);
      return;
    }

    // Session2 should NOT block the same memory (different session)
    const session2Check = sessionManager.shouldSendMemory(session2, memory);
    if (session2Check !== true) {
      fail('T006', 'Session2 allows same memory',
        `Session2 shouldSendMemory returned ${session2Check}, expected true`);
      return;
    }

    // Mark in session2 and verify isolation
    sessionManager.markMemorySent(session2, memory);

    // Now both should block
    const session1CheckAgain = sessionManager.shouldSendMemory(session1, memory);
    const session2CheckAgain = sessionManager.shouldSendMemory(session2, memory);

    if (session1CheckAgain !== false || session2CheckAgain !== false) {
      fail('T006', 'Both sessions block after marking',
        `Session1: ${session1CheckAgain}, Session2: ${session2CheckAgain}`);
      return;
    }

    // Verify database state shows separate entries
    const entries = testDb.prepare(`
      SELECT session_id FROM session_sent_memories ORDER BY session_id
    `).all();

    const sessions = new Set(entries.map(e => e.session_id));
    if (sessions.size !== 2) {
      fail('T006', 'Separate entries per session in database',
        `Expected 2 unique sessions, found ${sessions.size}`);
      return;
    }

    pass('T006', 'Session ID generation is unique per session',
      'Sessions maintain independent memory tracking');

  } catch (error) {
    fail('T006', 'Session ID uniqueness', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   9. T007: MEMORY FILTERING REMOVES DUPLICATES
──────────────────────────────────────────────────────────────── */

function test_T007_filter_search_results() {
  log('\n🔬 T007: Memory filtering removes duplicates from search results');

  try {
    resetDb();

    const sessionId = 'test-session-T007';

    // Create search results with 5 memories
    const searchResults = [
      createMemory({ id: 501, anchor_id: 'result-1' }),
      createMemory({ id: 502, anchor_id: 'result-2' }),
      createMemory({ id: 503, anchor_id: 'result-3' }),
      createMemory({ id: 504, anchor_id: 'result-4' }),
      createMemory({ id: 505, anchor_id: 'result-5' }),
    ];

    // Mark 2 memories as already sent
    sessionManager.markMemorySent(sessionId, searchResults[1]); // 502
    sessionManager.markMemorySent(sessionId, searchResults[3]); // 504

    // Filter the search results
    const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, searchResults);

    // Should have 3 results remaining
    if (filtered.length !== 3) {
      fail('T007', 'Filtered results count',
        `Expected 3 results, got ${filtered.length}`);
      return;
    }

    // Verify correct IDs remain
    const filteredIds = filtered.map(m => m.id);
    const expectedIds = [501, 503, 505];
    const idsMatch = expectedIds.every(id => filteredIds.includes(id));

    if (!idsMatch) {
      fail('T007', 'Correct memories filtered',
        `Expected IDs [501, 503, 505], got [${filteredIds.join(', ')}]`);
      return;
    }

    // Verify dedup stats
    if (dedupStats.filtered !== 2) {
      fail('T007', 'Dedup stats filtered count',
        `Expected 2 filtered, got ${dedupStats.filtered}`);
      return;
    }

    if (dedupStats.total !== 5) {
      fail('T007', 'Dedup stats total count',
        `Expected 5 total, got ${dedupStats.total}`);
      return;
    }

    if (!dedupStats.enabled) {
      fail('T007', 'Dedup stats enabled flag',
        'Expected enabled=true');
      return;
    }

    pass('T007', 'Memory filtering removes duplicates from search results',
      `Filtered ${dedupStats.filtered}/${dedupStats.total} duplicates, ${filtered.length} remaining`);

  } catch (error) {
    fail('T007', 'Memory filtering', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   10. T008: DEDUP_SAVINGS_TOKENS CALCULATION
──────────────────────────────────────────────────────────────── */

function test_T008_dedup_savings_tokens() {
  log('\n🔬 T008: dedup_savings_tokens calculation accuracy');

  try {
    resetDb();

    const sessionId = 'test-session-T008';

    // Create search results - assuming ~200 tokens per memory (from implementation)
    const searchResults = [
      createMemory({ id: 601, anchor_id: 'result-1' }),
      createMemory({ id: 602, anchor_id: 'result-2' }),
      createMemory({ id: 603, anchor_id: 'result-3' }),
      createMemory({ id: 604, anchor_id: 'result-4' }),
    ];

    // Mark 3 memories as already sent
    sessionManager.markMemorySent(sessionId, searchResults[0]); // 601
    sessionManager.markMemorySent(sessionId, searchResults[1]); // 602
    sessionManager.markMemorySent(sessionId, searchResults[2]); // 603

    // Filter the search results
    const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, searchResults);

    // Verify token savings estimate exists
    if (!dedupStats.tokenSavingsEstimate) {
      fail('T008', 'Token savings estimate exists',
        'tokenSavingsEstimate is missing from dedupStats');
      return;
    }

    // Implementation uses ~200 tokens per memory
    // 3 filtered * 200 = ~600 tokens
    const expectedSavings = '~600 tokens';
    if (dedupStats.tokenSavingsEstimate !== expectedSavings) {
      fail('T008', 'Token savings calculation',
        `Expected "${expectedSavings}", got "${dedupStats.tokenSavingsEstimate}"`);
      return;
    }

    // Test with no duplicates - should show 0
    resetDb();
    const { dedupStats: noSavingsStats } = sessionManager.filterSearchResults(sessionId, searchResults);

    if (noSavingsStats.tokenSavingsEstimate !== '0') {
      fail('T008', 'Zero savings when no duplicates',
        `Expected "0", got "${noSavingsStats.tokenSavingsEstimate}"`);
      return;
    }

    pass('T008', 'dedup_savings_tokens calculation accuracy',
      `Saved ${expectedSavings} (3 duplicates * ~200 tokens)`);

  } catch (error) {
    fail('T008', 'dedup_savings_tokens calculation', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   11. TEST RUNNER
──────────────────────────────────────────────────────────────── */

function runTests() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  SESSION MANAGER TESTS (T001-T008)');
  console.log('  Testing core session deduplication functionality');
  console.log('═══════════════════════════════════════════════════════════════');

  try {
    setup();

    // Run all tests
    test_T001_session_manager_instantiation();
    test_T002_hash_generation();
    test_T003_should_send_new_memory();
    test_T004_should_not_send_duplicate();
    test_T005_mark_memory_sent_tracking();
    test_T006_session_id_uniqueness();
    test_T007_filter_search_results();
    test_T008_dedup_savings_tokens();

  } catch (error) {
    console.error(`\n💥 Test setup/teardown error: ${error.message}`);
    console.error(error.stack);
  } finally {
    teardown();
  }

  // Print summary
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`   ✅ Passed:  ${results.passed}`);
  console.log(`   ❌ Failed:  ${results.failed}`);
  console.log(`   ⏭️  Skipped: ${results.skipped}`);
  console.log(`   📊 Total:   ${results.passed + results.failed + results.skipped}`);
  console.log('═══════════════════════════════════════════════════════════════');

  // Exit with appropriate code
  if (results.failed > 0) {
    console.log('\n❌ TESTS FAILED\n');
    process.exit(1);
  } else {
    console.log('\n✅ ALL TESTS PASSED\n');
    process.exit(0);
  }
}

// Run tests if executed directly
if (require.main === module) {
  runTests();
}

// Export for programmatic use
module.exports = {
  runTests,
  results,
};
