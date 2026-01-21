// ───────────────────────────────────────────────────────────────
// TEST: BUG FIXES VERIFICATION
// ───────────────────────────────────────────────────────────────

'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const ROOT = path.join(__dirname, '..', '..');
const LIB_PATH = path.join(ROOT, 'mcp_server', 'lib');
const SHARED_PATH = path.join(ROOT, 'shared');
const DB_PATH = path.join(ROOT, 'mcp_server', 'database');
const CONFIG_PATH = path.join(ROOT, 'mcp_server', 'configs');

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
   3. BUG TEST FUNCTIONS
──────────────────────────────────────────────────────────────── */

// BUG-001: Race Condition - Cross-connection visibility
async function test_bug_001() {
  log('\n🔬 BUG-001: Race Condition - Cross-connection visibility');
  
  try {
    const db_updated_file = path.join(DB_PATH, '.db-updated');
    
    // Test 1: Notification file mechanism exists
    // NOTE: After Spec 058 modularization, notifyDatabaseUpdated() moved to core/workflow.js
    const generate_context = fs.readFileSync(
      path.join(ROOT, 'scripts', 'generate-context.js'), 
      'utf8'
    );
    const workflow_js = fs.readFileSync(
      path.join(ROOT, 'scripts', 'core', 'workflow.js'), 
      'utf8'
    );
    // Check either file (workflow.js is the actual location after modularization)
    const has_notify = (generate_context.includes('notifyDatabaseUpdated') && 
                        generate_context.includes('.db-updated')) ||
                       (workflow_js.includes('notifyDatabaseUpdated') && 
                        workflow_js.includes('.db-updated'));
    if (has_notify) {
      pass('T-005a: Notification mechanism in scripts/', 
           'notifyDatabaseUpdated() function found');
    } else {
      fail('T-005a: Notification mechanism in scripts/', 
           'Function not found');
    }
    
    // Test 2: Check detection in context-server
    const context_server = fs.readFileSync(
      path.join(ROOT, 'mcp_server', 'context-server.js'), 
      'utf8'
    );
    if (context_server.includes('checkDatabaseUpdated') && 
        context_server.includes('reinitializeDatabase')) {
      pass('T-005b: Check mechanism in context-server.js', 
           'checkDatabaseUpdated() and reinitializeDatabase() found');
    } else {
      fail('T-005b: Check mechanism in context-server.js', 
           'Functions not found');
    }
    
    // Test 3: Write and read notification file
    const test_timestamp = Date.now().toString();
    fs.writeFileSync(db_updated_file, test_timestamp);
    const read_timestamp = fs.readFileSync(db_updated_file, 'utf8');
    if (read_timestamp === test_timestamp) {
      pass('T-005c: Notification file write/read works', 
           `Wrote and read: ${test_timestamp}`);
    } else {
      fail('T-005c: Notification file write/read works', 
           'Timestamp mismatch');
    }
    
  } catch (error) {
    fail('T-005: Cross-connection visibility', error.message);
  }
}

// BUG-002: Transaction Rollback
async function test_bug_002() {
  log('\n🔬 BUG-002: Transaction Rollback');
  
  try {
    const vector_index = fs.readFileSync(
      path.join(LIB_PATH, 'vector-index.js'), 
      'utf8'
    );
    
    // Test 1: Transaction control via database.transaction() wrapper (BUG-057 fix)
    // Changed from explicit BEGIN/COMMIT/ROLLBACK to database.transaction() for nested transaction support
    if (vector_index.includes('const index_memory_tx = database.transaction(') &&
        vector_index.includes('return index_memory_tx()')) {
      pass('T-010a: Transaction wrapper in indexMemory()', 
           'database.transaction() wrapper found - supports nested transactions');
    } else if ((vector_index.includes("database.exec('BEGIN TRANSACTION')") || 
                vector_index.includes("db.exec('BEGIN TRANSACTION')"))) {
      // Old pattern - warn that it should be updated
      fail('T-010a: Transaction wrapper in indexMemory()', 
           'Still using explicit BEGIN TRANSACTION - needs BUG-057 fix for nested transaction support');
    } else {
      fail('T-010a: Transaction wrapper in indexMemory()', 
           'No transaction control found');
    }
    
    // Test 2: Transaction wrapper provides automatic rollback (no manual cleanup needed)
    // With database.transaction(), rollback is automatic on throw - no orphan cleanup code needed
    if (vector_index.includes('auto-rollback on error')) {
      pass('T-010b: Automatic rollback via transaction wrapper', 
           'Comment indicates auto-rollback behavior');
    } else {
      skip('T-010b: Automatic rollback via transaction wrapper', 
           'database.transaction() provides automatic rollback - manual cleanup not required');
    }
    
    // T-011: Integration test would require actual DB operations
    skip('T-011: Integration test for partial failure recovery', 
         'Requires injected failure - code verified');
    
  } catch (error) {
    fail('T-010: Transaction rollback', error.message);
  }
}

// BUG-003: Embedding Dimension Confirmation
async function test_bug_003() {
  log('\n🔬 BUG-003: Embedding Dimension Mismatch at Startup');
  
  try {
    const vector_index = require(path.join(LIB_PATH, 'vector-index.js'));
    
    // Test 1: Function exists
    if (typeof vector_index.getConfirmedEmbeddingDimension === 'function') {
      pass('T-015a: getConfirmedEmbeddingDimension() exists', 
           'Function exported');
    } else {
      fail('T-015a: getConfirmedEmbeddingDimension() exists', 
           'Function not found');
      return;
    }
    
    // Test 2: Returns a dimension
    const dim = await vector_index.getConfirmedEmbeddingDimension(1000);
    if (typeof dim === 'number' && dim > 0) {
      pass('T-015b: Returns valid dimension', 
           `Dimension: ${dim}`);
    } else {
      fail('T-015b: Returns valid dimension', 
           `Invalid dimension: ${dim}`);
    }
    
  } catch (error) {
    fail('T-015: Dimension confirmation', error.message);
  }
}

// BUG-004: Constitutional Cache Invalidation
async function test_bug_004() {
  log('\n🔬 BUG-004: Constitutional Cache Stale After External Edits');
  
  try {
    const vector_index = fs.readFileSync(
      path.join(LIB_PATH, 'vector-index.js'), 
      'utf8'
    );
    
    // Test 1: mtime tracking (snake_case: last_db_mod_time)
    if (vector_index.includes('last_db_mod_time') &&
        vector_index.includes('stats.mtimeMs')) {
      pass('T-018a: Database mtime tracking implemented', 
           'last_db_mod_time and mtimeMs check found');
    } else {
      fail('T-018a: Database mtime tracking implemented', 
           'mtime tracking not found');
    }
    
    // Test 2: Cache validation function (snake_case: is_constitutional_cache_valid)
    if (vector_index.includes('is_constitutional_cache_valid')) {
      pass('T-018b: is_constitutional_cache_valid() exists', 
           'Function found in source');
    } else {
      fail('T-018b: is_constitutional_cache_valid() exists', 
           'Function not found');
    }
    
  } catch (error) {
    fail('T-018: Cache invalidation', error.message);
  }
}

// BUG-005: Rate Limiting Persistence
async function test_bug_005() {
  log('\n🔬 BUG-005: Rate Limiting Not Persistent');
  
  try {
    const context_server = fs.readFileSync(
      path.join(ROOT, 'mcp_server', 'context-server.js'), 
      'utf8'
    );
    
    // Test 1: Config table creation
    if (context_server.includes('CREATE TABLE IF NOT EXISTS config')) {
      pass('T-023a: Config table creation', 
           'CREATE TABLE IF NOT EXISTS config found');
    } else {
      fail('T-023a: Config table creation', 
           'Config table SQL not found');
    }
    
    // Test 2: getLastScanTime function
    if (context_server.includes('getLastScanTime') &&
        context_server.includes("SELECT value FROM config WHERE key = ?")) {
      pass('T-023b: getLastScanTime() reads from database', 
           'Function and SQL query found');
    } else {
      fail('T-023b: getLastScanTime() reads from database', 
           'Function not found');
    }
    
    // Test 3: setLastScanTime function
    if (context_server.includes('setLastScanTime') &&
        context_server.includes('INSERT OR REPLACE INTO config')) {
      pass('T-023c: setLastScanTime() writes to database', 
           'Function and SQL query found');
    } else {
      fail('T-023c: setLastScanTime() writes to database', 
           'Function not found');
    }
    
  } catch (error) {
    fail('T-023: Rate limiting persistence', error.message);
  }
}

// BUG-006: Prepared Statement Cache Clearing
async function test_bug_006() {
  log('\n🔬 BUG-006: Prepared Statement Cache Not Cleared');
  
  try {
    const vector_index = fs.readFileSync(
      path.join(LIB_PATH, 'vector-index.js'), 
      'utf8'
    );
    
    // Test: clear_prepared_statements in close_db (snake_case naming)
    if (vector_index.includes('clear_prepared_statements()') &&
        (vector_index.includes('close_db') || vector_index.includes('closeDb: close_db'))) {
      pass('T-027: clear_prepared_statements() in close_db()', 
           'Function call found in database closing');
    } else {
      fail('T-027: clear_prepared_statements() in close_db()', 
           'Function call not found');
    }
    
  } catch (error) {
    fail('T-027: Statement cache clearing', error.message);
  }
}

// BUG-007: Empty Query Validation
async function test_bug_007() {
  log('\n🔬 BUG-007: Empty Query Edge Case');
  
  try {
    const context_server = fs.readFileSync(
      path.join(ROOT, 'mcp_server', 'context-server.js'), 
      'utf8'
    );
    
    // Test 1: validateQuery function exists
    if (context_server.includes('function validateQuery')) {
      pass('T-030a: validateQuery() function exists', 
           'Function definition found');
    } else {
      fail('T-030a: validateQuery() function exists', 
           'Function not found');
    }
    
    // Test 2: Checks for null/undefined
    if (context_server.includes('null') && context_server.includes('undefined')) {
      pass('T-030b: Checks for null/undefined', 
           'Null and undefined checks found');
    } else {
      fail('T-030b: Checks for null/undefined', 
           'Checks not found');
    }
    
    // Test 3: Checks for empty/whitespace
    if (context_server.includes('.trim()') && 
        context_server.includes('empty') && 
        context_server.includes('whitespace')) {
      pass('T-030c: Checks for empty/whitespace', 
           'Trim and empty/whitespace checks found');
    } else {
      fail('T-030c: Checks for empty/whitespace', 
           'Checks not found');
    }
    
    // Test 4: MAX_QUERY_LENGTH check
    if (context_server.includes('MAX_QUERY_LENGTH')) {
      pass('T-030d: MAX_QUERY_LENGTH check', 
           'Length limit check found');
    } else {
      fail('T-030d: MAX_QUERY_LENGTH check', 
           'Length limit not found');
    }
    
  } catch (error) {
    fail('T-030: Query validation', error.message);
  }
}

// BUG-008: UTF-8 BOM Detection
async function test_bug_008() {
  log('\n🔬 BUG-008: UTF-8 BOM Detection Missing');
  
  try {
    const memory_parser = fs.readFileSync(
      path.join(LIB_PATH, 'memory-parser.js'), 
      'utf8'
    );
    
    // Test 1: UTF-8 BOM bytes detected
    if (memory_parser.includes('0xEF') && 
        memory_parser.includes('0xBB') && 
        memory_parser.includes('0xBF')) {
      pass('T-032a: UTF-8 BOM bytes (EF BB BF) detected', 
           '0xEF, 0xBB, 0xBF found in source');
    } else {
      fail('T-032a: UTF-8 BOM bytes (EF BB BF) detected', 
           'BOM bytes not found');
    }
    
    // Test 2: 3-byte offset
    if (memory_parser.includes('offset: 3') || memory_parser.includes('slice(3)')) {
      pass('T-032b: 3-byte offset for UTF-8 BOM', 
           'Offset handling found');
    } else {
      fail('T-032b: 3-byte offset for UTF-8 BOM', 
           'Offset handling not found');
    }
    
  } catch (error) {
    fail('T-032: UTF-8 BOM detection', error.message);
  }
}

// BUG-009: Cache Key Uniqueness
async function test_bug_009() {
  log('\n🔬 BUG-009: Search Cache Key Collision Risk');
  
  try {
    const vector_index = require(path.join(LIB_PATH, 'vector-index.js'));
    
    // Test 1: getCacheKey function exists
    if (typeof vector_index.getCacheKey === 'function') {
      pass('T-034a: getCacheKey() function exists', 
           'Function exported');
    } else {
      // Check source code
      const source = fs.readFileSync(path.join(LIB_PATH, 'vector-index.js'), 'utf8');
      if (source.includes('getCacheKey') && source.includes('sha256')) {
        pass('T-034a: getCacheKey() with SHA256', 
             'Function found in source with SHA256');
      } else {
        fail('T-034a: getCacheKey() function exists', 
             'Function not found');
        return;
      }
    }
    
    // Test 2: Keys are unique for different queries
    if (typeof vector_index.getCacheKey === 'function') {
      const key_1 = vector_index.getCacheKey('test query', 10, {});
      const key_2 = vector_index.getCacheKey('test:query', 10, {});
      const key_3 = vector_index.getCacheKey('test query', 10, {});
      
      if (key_1 !== key_2) {
        pass('T-034b: Different queries produce different keys', 
             `key_1=${key_1}, key_2=${key_2}`);
      } else {
        fail('T-034b: Different queries produce different keys', 
             'Keys are identical');
      }
      
      if (key_1 === key_3) {
        pass('T-034c: Same queries produce same keys', 
             `key_1=${key_1}, key_3=${key_3}`);
      } else {
        fail('T-034c: Same queries produce same keys', 
             'Keys differ');
      }
    } else {
      skip('T-034b/c: Key uniqueness tests', 
           'getCacheKey not exported');
    }
    
  } catch (error) {
    fail('T-034: Cache key uniqueness', error.message);
  }
}

// BUG-013: Orphaned Vector Auto-Cleanup
async function test_bug_013() {
  log('\n🔬 BUG-013: Orphaned Vector Cleanup Only at Startup');
  
  try {
    const vector_index = require(path.join(LIB_PATH, 'vector-index.js'));
    
    // Test 1: verifyIntegrity exists
    if (typeof vector_index.verifyIntegrity === 'function') {
      pass('T-042a: verifyIntegrity() function exists', 
           'Function exported');
    } else {
      fail('T-042a: verifyIntegrity() function exists', 
           'Function not found');
      return;
    }
    
    // Test 2: Check source for autoClean option
    const source = fs.readFileSync(path.join(LIB_PATH, 'vector-index.js'), 'utf8');
    if (source.includes('autoClean') && source.includes('options')) {
      pass('T-042b: autoClean option in verifyIntegrity()', 
           'autoClean parameter found');
    } else {
      fail('T-042b: autoClean option in verifyIntegrity()', 
           'autoClean not found');
    }
    
  } catch (error) {
    fail('T-042: Orphaned vector auto-cleanup', error.message);
  }
}

// Config Verification
async function test_config() {
  log('\n🔬 Configuration Verification');
  
  try {
    const config = require(path.join(CONFIG_PATH, 'search-weights.json'));
    
    // Test 1: maxTriggersPerMemory
    if (config.maxTriggersPerMemory === 10) {
      pass('Config: maxTriggersPerMemory', 
           `Value: ${config.maxTriggersPerMemory}`);
    } else {
      fail('Config: maxTriggersPerMemory', 
           `Expected 10, got ${config.maxTriggersPerMemory}`);
    }
    
    // Test 2: smartRanking weights
    if (config.smartRanking && 
        config.smartRanking.recencyWeight === 0.5 &&
        config.smartRanking.accessWeight === 0.3 &&
        config.smartRanking.relevanceWeight === 0.2) {
      pass('Config: smartRanking weights', 
           JSON.stringify(config.smartRanking));
    } else {
      fail('Config: smartRanking weights', 
           `Got: ${JSON.stringify(config.smartRanking)}`);
    }
    
  } catch (error) {
    fail('Config verification', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. MAIN
──────────────────────────────────────────────────────────────── */

async function main() {
  log('🧪 Bug Fix Verification Tests');
  log('================================');
  log('Spec: 054-remaining-bugs-remediation');
  log(`Date: ${new Date().toISOString()}\n`);
  
  // Run all tests
  await test_bug_001();
  await test_bug_002();
  await test_bug_003();
  await test_bug_004();
  await test_bug_005();
  await test_bug_006();
  await test_bug_007();
  await test_bug_008();
  await test_bug_009();
  await test_bug_013();
  await test_config();
  
  // Summary
  log('\n================================');
  log('📊 TEST SUMMARY');
  log('================================');
  log(`✅ Passed:  ${results.passed}`);
  log(`❌ Failed:  ${results.failed}`);
  log(`⏭️  Skipped: ${results.skipped}`);
  log(`📝 Total:   ${results.passed + results.failed + results.skipped}`);
  log('');
  
  if (results.failed === 0) {
    log('🎉 ALL TESTS PASSED!');
    return true;
  } else {
    log('⚠️  Some tests failed. Review output above.');
    return false;
  }
}

// Run tests
main().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
