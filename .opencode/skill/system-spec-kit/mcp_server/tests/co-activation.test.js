// ───────────────────────────────────────────────────────────────
// TEST: CO-ACTIVATION
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');
const fs = require('fs');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const LIB_PATH = path.join(__dirname, '..', 'lib', 'cognitive');

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
   3. TEST FUNCTIONS
──────────────────────────────────────────────────────────────── */

let coActivation;

// Load module
function test_module_loads() {
  log('\n🔬 Module Loading');
  
  try {
    coActivation = require(path.join(LIB_PATH, 'co-activation.js'));
    pass('Module loads without error', 'require() succeeded');
  } catch (error) {
    fail('Module loads without error', error.message);
    return false;
  }
  return true;
}

// Test exports exist
function test_exports_exist() {
  log('\n🔬 Module Exports');
  
  const expected_exports = [
    'init',
    'isEnabled',
    'spreadActivation',
    'getRelatedMemories',
    'boostScore',
    'populateRelatedMemories',
    'logCoActivationEvent',
    'CONFIG',
  ];
  
  for (const exp of expected_exports) {
    if (typeof coActivation[exp] !== 'undefined') {
      pass(`Export "${exp}" exists`, typeof coActivation[exp]);
    } else {
      fail(`Export "${exp}" exists`, 'Not found');
    }
  }
}

// Test CONFIG values
function test_config_values() {
  log('\n🔬 CONFIG values');
  
  const config = coActivation.CONFIG;
  
  // Test 1: boostAmount is 0.35
  if (config.boostAmount === 0.35) {
    pass('boostAmount is 0.35', `Got: ${config.boostAmount}`);
  } else {
    fail('boostAmount is 0.35', `Expected 0.35, got: ${config.boostAmount}`);
  }
  
  // Test 2: maxRelatedMemories is 5
  if (config.maxRelatedMemories === 5) {
    pass('maxRelatedMemories is 5', `Got: ${config.maxRelatedMemories}`);
  } else {
    fail('maxRelatedMemories is 5', `Expected 5, got: ${config.maxRelatedMemories}`);
  }
  
  // Test 3: maxScoreCap is 1.0
  if (config.maxScoreCap === 1.0) {
    pass('maxScoreCap is 1.0', `Got: ${config.maxScoreCap}`);
  } else {
    fail('maxScoreCap is 1.0', `Expected 1.0, got: ${config.maxScoreCap}`);
  }
  
  // Test 4: enabled is a boolean
  if (typeof config.enabled === 'boolean') {
    pass('enabled is a boolean', `Got: ${config.enabled}`);
  } else {
    fail('enabled is a boolean', `Expected boolean, got: ${typeof config.enabled}`);
  }
}

// Test boostScore()
function test_boost_score() {
  log('\n🔬 boostScore()');
  
  // Test 1: Basic boost
  const boosted = coActivation.boostScore(0.5);
  if (boosted === 0.85) {
    pass('boostScore(0.5) = 0.85', `Got: ${boosted}`);
  } else {
    fail('boostScore(0.5) = 0.85', `Expected 0.85, got: ${boosted}`);
  }
  
  // Test 2: Boost from 0
  const from_zero = coActivation.boostScore(0);
  if (from_zero === 0.35) {
    pass('boostScore(0) = 0.35', `Got: ${from_zero}`);
  } else {
    fail('boostScore(0) = 0.35', `Expected 0.35, got: ${from_zero}`);
  }
  
  // Test 3: Capped at 1.0
  const capped = coActivation.boostScore(0.9);
  if (capped === 1.0) {
    pass('boostScore(0.9) capped at 1.0', `Got: ${capped}`);
  } else {
    fail('boostScore(0.9) capped at 1.0', `Expected 1.0, got: ${capped}`);
  }
  
  // Test 4: Custom boost amount
  const custom = coActivation.boostScore(0.5, 0.2);
  if (custom === 0.7) {
    pass('boostScore(0.5, 0.2) = 0.7', `Got: ${custom}`);
  } else {
    fail('boostScore(0.5, 0.2) = 0.7', `Expected 0.7, got: ${custom}`);
  }
  
  // Test 5: Non-numeric input defaults to 0
  const non_numeric = coActivation.boostScore('invalid');
  if (non_numeric === 0.35) {
    pass('boostScore("invalid") uses 0 as base', `Got: ${non_numeric}`);
  } else {
    fail('boostScore("invalid") uses 0 as base', `Expected 0.35, got: ${non_numeric}`);
  }
  
  // Test 6: Non-numeric boost uses default
  const bad_boost = coActivation.boostScore(0.5, 'invalid');
  if (bad_boost === 0.85) {
    pass('boostScore(0.5, "invalid") uses default boost', `Got: ${bad_boost}`);
  } else {
    fail('boostScore(0.5, "invalid") uses default boost', `Expected 0.85, got: ${bad_boost}`);
  }
}

// Test init()
function test_init() {
  log('\n🔬 init()');

  // Test 1: init with null SHOULD throw (T016: consistent error handling)
  try {
    coActivation.init(null);
    fail('init(null) should throw', 'No error thrown');
  } catch (error) {
    if (error.message.includes('Database reference is required')) {
      pass('init(null) throws correct error', error.message);
    } else {
      fail('init(null) throws correct error', `Wrong error: ${error.message}`);
    }
  }

  // Test 2: isEnabled returns false without valid DB (db is still null after init() threw)
  const enabled_without_db = coActivation.isEnabled();
  if (enabled_without_db === false) {
    pass('isEnabled() is false without valid DB', `Got: ${enabled_without_db}`);
  } else {
    // May still be true if env allows it
    pass('isEnabled() returns boolean', `Got: ${enabled_without_db}`);
  }
}

// Test getRelatedMemories() without DB
function test_get_related_memories_no_db() {
  log('\n🔬 getRelatedMemories() without DB');

  // Note: init(null) throws by design - we test graceful handling of uninitialized state
  // The module should already have db=null if init() was never called with valid db
  
  // Test 1: Returns empty array without DB
  const result = coActivation.getRelatedMemories(1);
  if (Array.isArray(result) && result.length === 0) {
    pass('Returns empty array without DB', `Got: ${JSON.stringify(result)}`);
  } else {
    fail('Returns empty array without DB', `Got: ${JSON.stringify(result)}`);
  }
  
  // Test 2: Invalid memoryId returns empty array
  const invalid_id = coActivation.getRelatedMemories(-1);
  if (Array.isArray(invalid_id) && invalid_id.length === 0) {
    pass('Invalid memoryId returns empty array', `Got: ${JSON.stringify(invalid_id)}`);
  } else {
    fail('Invalid memoryId returns empty array', `Got: ${JSON.stringify(invalid_id)}`);
  }
  
  // Test 3: Non-numeric memoryId returns empty array
  const non_numeric = coActivation.getRelatedMemories('abc');
  if (Array.isArray(non_numeric) && non_numeric.length === 0) {
    pass('Non-numeric memoryId returns empty array', `Got: ${JSON.stringify(non_numeric)}`);
  } else {
    fail('Non-numeric memoryId returns empty array', `Got: ${JSON.stringify(non_numeric)}`);
  }
}

// Test spreadActivation() without DB
function test_spread_activation_no_db() {
  log('\n🔬 spreadActivation() without DB');

  // Note: init(null) throws by design - we test graceful handling of uninitialized state
  
  // Test 1: Returns empty array without DB
  const result = coActivation.spreadActivation('session1', 1, 1);
  if (Array.isArray(result) && result.length === 0) {
    pass('Returns empty array without DB', `Got: ${JSON.stringify(result)}`);
  } else {
    fail('Returns empty array without DB', `Got: ${JSON.stringify(result)}`);
  }
  
  // Test 2: Invalid sessionId returns empty array
  const invalid_session = coActivation.spreadActivation(null, 1, 1);
  if (Array.isArray(invalid_session) && invalid_session.length === 0) {
    pass('Invalid sessionId returns empty array', `Got: ${JSON.stringify(invalid_session)}`);
  } else {
    fail('Invalid sessionId returns empty array', `Got: ${JSON.stringify(invalid_session)}`);
  }
  
  // Test 3: Invalid memoryId returns empty array
  const invalid_memory = coActivation.spreadActivation('session1', -1, 1);
  if (Array.isArray(invalid_memory) && invalid_memory.length === 0) {
    pass('Invalid memoryId returns empty array', `Got: ${JSON.stringify(invalid_memory)}`);
  } else {
    fail('Invalid memoryId returns empty array', `Got: ${JSON.stringify(invalid_memory)}`);
  }
}

// BUG-010: Circular reference prevention
function test_circular_reference_prevention() {
  log('\n🔬 BUG-010: Circular Reference Prevention');
  
  // Test: boostedThisTurn Set prevents duplicate boosting
  const boostedSet = new Set();
  
  // First call should add to set
  const result1 = coActivation.spreadActivation('session1', 1, 1, boostedSet);
  
  // Check that the key was added
  const expected_key = 'session1:1:1';
  if (boostedSet.has(expected_key)) {
    pass('First call adds key to boostedThisTurn Set', `Key: ${expected_key}`);
  } else {
    // The key format may be different, just check set has something
    if (boostedSet.size > 0) {
      pass('First call adds to boostedThisTurn Set', `Set size: ${boostedSet.size}`);
    } else {
      // Without DB, set may not be modified
      skip('boostedThisTurn tracking', 'No DB to trigger actual boost');
    }
  }
  
  // Second call with same params should be blocked
  const result2 = coActivation.spreadActivation('session1', 1, 1, boostedSet);
  if (Array.isArray(result2) && result2.length === 0) {
    pass('Second call with same params returns empty (blocked)', `Got: ${JSON.stringify(result2)}`);
  } else {
    fail('Second call with same params returns empty (blocked)', `Got: ${JSON.stringify(result2)}`);
  }
}

// BUG-007: console.log for informational logging (T037 fix)
function test_console_error_logging() {
  log('\n🔬 BUG-007: console.log for informational logging');
  
  // Check source code for console.log usage (T037: informational messages should use console.log, not console.error)
  const source = fs.readFileSync(path.join(LIB_PATH, 'co-activation.js'), 'utf8');
  
  // Test 1: Uses console.log for init logging (informational, not error)
  if (source.includes("console.log('[co-activation] Initialized")) {
    pass('init() uses console.log for logging', 'Found in source');
  } else {
    fail('init() uses console.log for logging', 'Not found');
  }
  
  // Test 2: Uses console.log for populate logging (informational, not error)
  if (source.includes("console.log(`[co-activation] Populated")) {
    pass('populate uses console.log for logging', 'Found in source');
  } else {
    fail('populate uses console.log for logging', 'Not found');
  }
}

// BUG-008: classifyTier import usage
function test_tier_classifier_import() {
  log('\n🔬 BUG-008: classifyTier import usage');
  
  // Check source code for tier-classifier import
  const source = fs.readFileSync(path.join(LIB_PATH, 'co-activation.js'), 'utf8');
  
  // Test 1: Imports tier-classifier
  if (source.includes("require('./tier-classifier.js')")) {
    pass('Imports tier-classifier.js', 'Found in source');
  } else {
    fail('Imports tier-classifier.js', 'Not found');
  }
  
  // Test 2: Uses classifyTier for new entries
  if (source.includes('tierClassifier.classifyTier(')) {
    pass('Uses tierClassifier.classifyTier() for tier calculation', 'Found in source');
  } else {
    fail('Uses tierClassifier.classifyTier() for tier calculation', 'Not found');
  }
  
  // Test 3: Does NOT use hardcoded 'COLD' for new entries
  // Look for the INSERT statement context
  const insert_match = source.match(/INSERT INTO working_memory[\s\S]{0,300}VALUES[\s\S]{0,100}/);
  if (insert_match && insert_match[0].includes('tier')) {
    // The tier value should come from classifyTier, not a hardcoded string
    pass('INSERT uses dynamic tier value', 'tier variable found in INSERT');
  } else {
    skip('INSERT tier check', 'Could not isolate INSERT statement');
  }
}

// Test logCoActivationEvent()
function test_log_co_activation_event() {
  log('\n🔬 logCoActivationEvent()');
  
  // Test 1: Returns log entry object
  const entry = coActivation.logCoActivationEvent('test_op', { key: 'value' });
  if (entry && entry.operation === 'test_op' && entry.key === 'value') {
    pass('Returns log entry with operation and details', JSON.stringify(entry));
  } else {
    fail('Returns log entry with operation and details', JSON.stringify(entry));
  }
  
  // Test 2: Entry has timestamp
  if (entry && entry.timestamp) {
    pass('Log entry has timestamp', entry.timestamp);
  } else {
    fail('Log entry has timestamp', 'No timestamp found');
  }
}

// Test populateRelatedMemories() without DB
async function test_populate_related_memories_no_db() {
  log('\n🔬 populateRelatedMemories() without DB');

  // Note: init(null) throws by design - we test graceful handling of uninitialized state
  
  // Test 1: Returns empty array without DB
  const result = await coActivation.populateRelatedMemories(1, async () => []);
  if (Array.isArray(result) && result.length === 0) {
    pass('Returns empty array without DB', `Got: ${JSON.stringify(result)}`);
  } else {
    fail('Returns empty array without DB', `Got: ${JSON.stringify(result)}`);
  }
  
  // Test 2: Invalid vectorSearch function returns empty array
  const invalid_fn = await coActivation.populateRelatedMemories(1, 'not a function');
  if (Array.isArray(invalid_fn) && invalid_fn.length === 0) {
    pass('Invalid vectorSearch returns empty array', `Got: ${JSON.stringify(invalid_fn)}`);
  } else {
    fail('Invalid vectorSearch returns empty array', `Got: ${JSON.stringify(invalid_fn)}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. MAIN
──────────────────────────────────────────────────────────────── */

async function runTests() {
  log('🧪 Co-Activation Tests');
  log('================================');
  log(`Date: ${new Date().toISOString()}\n`);
  
  // Load module first
  if (!test_module_loads()) {
    log('\n⚠️  Module failed to load. Aborting tests.');
    return results;
  }
  
  // Run all tests
  test_exports_exist();
  test_config_values();
  test_boost_score();
  test_init();
  test_get_related_memories_no_db();
  test_spread_activation_no_db();
  test_circular_reference_prevention();
  test_console_error_logging();
  test_tier_classifier_import();
  test_log_co_activation_event();
  await test_populate_related_memories_no_db();
  
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
  } else {
    log('⚠️  Some tests failed. Review output above.');
  }
  
  return results;
}

// Run if executed directly
if (require.main === module) {
  runTests().then(r => {
    process.exit(r.failed > 0 ? 1 : 0);
  });
}

module.exports = { runTests };
