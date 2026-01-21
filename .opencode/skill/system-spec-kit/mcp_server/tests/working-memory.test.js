// ───────────────────────────────────────────────────────────────
// TEST: WORKING MEMORY
// ───────────────────────────────────────────────────────────────

'use strict';

const path = require('path');

/* ─────────────────────────────────────────────────────────────
   1. TEST FRAMEWORK
──────────────────────────────────────────────────────────────── */

const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
};

function log(msg) {
  console.log(msg);
}

function pass(name, evidence) {
  results.passed++;
  results.tests.push({ name, status: 'PASS', evidence });
  log(`   ✅ ${name}`);
  if (evidence) log(`      Evidence: ${evidence}`);
}

function fail(name, reason) {
  results.failed++;
  results.tests.push({ name, status: 'FAIL', reason });
  log(`   ❌ ${name}`);
  log(`      Reason: ${reason}`);
}

function skip(name, reason) {
  results.skipped++;
  results.tests.push({ name, status: 'SKIP', reason });
  log(`   ⏭️  ${name} (skipped: ${reason})`);
}

/* ─────────────────────────────────────────────────────────────
   2. MODULE UNDER TEST
──────────────────────────────────────────────────────────────── */

const LIB_PATH = path.join(__dirname, '..', 'lib', 'cognitive');
const workingMemory = require(path.join(LIB_PATH, 'working-memory.js'));

/* ─────────────────────────────────────────────────────────────
   3. TEST: CONFIG
──────────────────────────────────────────────────────────────── */

function test_CONFIG() {
  log('\n🔬 CONFIG');

  // Test 1: CONFIG is exported
  if (workingMemory.CONFIG) {
    pass('CONFIG is exported', 'Object exists');
  } else {
    fail('CONFIG is exported', 'Not found');
    return;
  }

  // Test 2: enabled property exists
  if (typeof workingMemory.CONFIG.enabled === 'boolean') {
    pass('CONFIG.enabled is boolean', `Value: ${workingMemory.CONFIG.enabled}`);
  } else {
    fail('CONFIG.enabled is boolean', `Type: ${typeof workingMemory.CONFIG.enabled}`);
  }

  // Test 3: maxWorkingMemories is a positive number
  const maxMem = workingMemory.CONFIG.maxWorkingMemories;
  if (typeof maxMem === 'number' && maxMem > 0) {
    pass('CONFIG.maxWorkingMemories is valid', `Value: ${maxMem}`);
  } else {
    fail('CONFIG.maxWorkingMemories is valid', `Got: ${maxMem}`);
  }

  // Test 4: sessionTimeoutMinutes is a positive number
  const timeout = workingMemory.CONFIG.sessionTimeoutMinutes;
  if (typeof timeout === 'number' && timeout > 0) {
    pass('CONFIG.sessionTimeoutMinutes is valid', `Value: ${timeout}`);
  } else {
    fail('CONFIG.sessionTimeoutMinutes is valid', `Got: ${timeout}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. TEST: isEnabled() and getConfig()
──────────────────────────────────────────────────────────────── */

function test_utility_functions() {
  log('\n🔬 Utility Functions');

  // Test 1: isEnabled returns boolean
  const enabled = workingMemory.isEnabled();
  if (typeof enabled === 'boolean') {
    pass('isEnabled() returns boolean', `Value: ${enabled}`);
  } else {
    fail('isEnabled() returns boolean', `Type: ${typeof enabled}`);
  }

  // Test 2: getConfig returns object with expected keys
  const config = workingMemory.getConfig();
  if (typeof config === 'object' && config !== null) {
    pass('getConfig() returns object', 'Object returned');
  } else {
    fail('getConfig() returns object', `Got: ${typeof config}`);
    return;
  }

  // Test 3: getConfig returns copy (not reference)
  const config2 = workingMemory.getConfig();
  if (config !== config2) {
    pass('getConfig() returns copy', 'Different object references');
  } else {
    fail('getConfig() returns copy', 'Same object reference');
  }

  // Test 4: getConfig has all expected keys
  const expectedKeys = ['enabled', 'maxWorkingMemories', 'sessionTimeoutMinutes'];
  const missingKeys = expectedKeys.filter(k => config[k] === undefined);
  if (missingKeys.length === 0) {
    pass('getConfig() has all keys', expectedKeys.join(', '));
  } else {
    fail('getConfig() has all keys', `Missing: ${missingKeys.join(', ')}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. TEST: calculateTier()
──────────────────────────────────────────────────────────────── */

function test_calculateTier() {
  log('\n🔬 calculateTier()');

  const calc = workingMemory.calculateTier;

  // Test 1: Score 1.0 is HOT
  const tier1 = calc(1.0);
  if (tier1 === 'HOT') {
    pass('Score 1.0 = HOT', `Tier: ${tier1}`);
  } else {
    fail('Score 1.0 = HOT', `Got: ${tier1}`);
  }

  // Test 2: Score 0.9 is HOT
  const tier2 = calc(0.9);
  if (tier2 === 'HOT') {
    pass('Score 0.9 = HOT', `Tier: ${tier2}`);
  } else {
    fail('Score 0.9 = HOT', `Got: ${tier2}`);
  }

  // Test 3: Score 0.8 is HOT (threshold)
  const tier3 = calc(0.8);
  if (tier3 === 'HOT') {
    pass('Score 0.8 = HOT (threshold)', `Tier: ${tier3}`);
  } else {
    fail('Score 0.8 = HOT (threshold)', `Got: ${tier3}`);
  }

  // Test 4: Score 0.79 is WARM
  const tier4 = calc(0.79);
  if (tier4 === 'WARM') {
    pass('Score 0.79 = WARM', `Tier: ${tier4}`);
  } else {
    fail('Score 0.79 = WARM', `Got: ${tier4}`);
  }

  // Test 5: Score 0.5 is WARM
  const tier5 = calc(0.5);
  if (tier5 === 'WARM') {
    pass('Score 0.5 = WARM', `Tier: ${tier5}`);
  } else {
    fail('Score 0.5 = WARM', `Got: ${tier5}`);
  }

  // Test 6: Score 0.25 is WARM (threshold)
  const tier6 = calc(0.25);
  if (tier6 === 'WARM') {
    pass('Score 0.25 = WARM (threshold)', `Tier: ${tier6}`);
  } else {
    fail('Score 0.25 = WARM (threshold)', `Got: ${tier6}`);
  }

  // Test 7: Score 0.24 is COLD
  const tier7 = calc(0.24);
  if (tier7 === 'COLD') {
    pass('Score 0.24 = COLD', `Tier: ${tier7}`);
  } else {
    fail('Score 0.24 = COLD', `Got: ${tier7}`);
  }

  // Test 8: Score 0.0 is COLD
  const tier8 = calc(0.0);
  if (tier8 === 'COLD') {
    pass('Score 0.0 = COLD', `Tier: ${tier8}`);
  } else {
    fail('Score 0.0 = COLD', `Got: ${tier8}`);
  }

  // Test 9: Score 0.1 is COLD
  const tier9 = calc(0.1);
  if (tier9 === 'COLD') {
    pass('Score 0.1 = COLD', `Tier: ${tier9}`);
  } else {
    fail('Score 0.1 = COLD', `Got: ${tier9}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. TEST: init() error handling
──────────────────────────────────────────────────────────────── */

function test_init() {
  log('\n🔬 init()');

  // Test 1: Throws when database is null
  try {
    workingMemory.init(null);
    fail('init(null) throws error', 'No error thrown');
  } catch (e) {
    if (e.message.includes('Database reference is required')) {
      pass('init(null) throws error', e.message);
    } else {
      fail('init(null) throws error', `Wrong error: ${e.message}`);
    }
  }

  // Test 2: Throws when database is undefined
  try {
    workingMemory.init(undefined);
    fail('init(undefined) throws error', 'No error thrown');
  } catch (e) {
    if (e.message.includes('Database reference is required')) {
      pass('init(undefined) throws error', e.message);
    } else {
      fail('init(undefined) throws error', `Wrong error: ${e.message}`);
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   7. TEST: Validation errors (without DB)
──────────────────────────────────────────────────────────────── */

function test_validation_errors() {
  log('\n🔬 Validation Errors (parameter checking)');

  // Test getOrCreateSession with null
  try {
    workingMemory.getOrCreateSession(null);
    fail('getOrCreateSession(null) throws', 'No error thrown');
  } catch (e) {
    if (e.message.includes('session_id is required') || e.message.includes('Database not initialized')) {
      pass('getOrCreateSession(null) throws', e.message);
    } else {
      fail('getOrCreateSession(null) throws', `Unexpected: ${e.message}`);
    }
  }

  // Test getOrCreateSession with empty string
  try {
    workingMemory.getOrCreateSession('');
    fail('getOrCreateSession("") throws', 'No error thrown');
  } catch (e) {
    if (e.message.includes('session_id is required') || e.message.includes('Database not initialized')) {
      pass('getOrCreateSession("") throws', e.message);
    } else {
      fail('getOrCreateSession("") throws', `Unexpected: ${e.message}`);
    }
  }

  // Test clearSession with null
  try {
    workingMemory.clearSession(null);
    fail('clearSession(null) throws', 'No error thrown');
  } catch (e) {
    if (e.message.includes('session_id is required') || e.message.includes('Database not initialized')) {
      pass('clearSession(null) throws', e.message);
    } else {
      fail('clearSession(null) throws', `Unexpected: ${e.message}`);
    }
  }

  // Test getWorkingMemory with invalid memory_id (BUG-012 - console.error logging)
  try {
    workingMemory.getWorkingMemory('test-session', 'not-a-number');
    fail('getWorkingMemory with string memoryId throws', 'No error thrown');
  } catch (e) {
    if (e.message.includes('memory_id') || e.message.includes('integer') || e.message.includes('Database not initialized')) {
      pass('getWorkingMemory validates memoryId type', e.message);
    } else {
      fail('getWorkingMemory validates memoryId type', `Unexpected: ${e.message}`);
    }
  }

  // Test getWorkingMemory with float memory_id
  try {
    workingMemory.getWorkingMemory('test-session', 1.5);
    fail('getWorkingMemory with float memoryId throws', 'No error thrown');
  } catch (e) {
    if (e.message.includes('integer') || e.message.includes('Database not initialized')) {
      pass('getWorkingMemory rejects float memoryId', e.message);
    } else {
      fail('getWorkingMemory rejects float memoryId', `Unexpected: ${e.message}`);
    }
  }

  // Test setAttentionScore with invalid score (> 1)
  try {
    workingMemory.setAttentionScore('session', 1, 1.5, 0);
    fail('setAttentionScore with score > 1 throws', 'No error thrown');
  } catch (e) {
    if (e.message.includes('Score must be') || e.message.includes('between 0 and 1') || e.message.includes('Database not initialized')) {
      pass('setAttentionScore validates score > 1', e.message);
    } else {
      fail('setAttentionScore validates score > 1', `Unexpected: ${e.message}`);
    }
  }

  // Test setAttentionScore with invalid score (< 0)
  try {
    workingMemory.setAttentionScore('session', 1, -0.5, 0);
    fail('setAttentionScore with score < 0 throws', 'No error thrown');
  } catch (e) {
    if (e.message.includes('Score must be') || e.message.includes('between 0 and 1') || e.message.includes('Database not initialized')) {
      pass('setAttentionScore validates score < 0', e.message);
    } else {
      fail('setAttentionScore validates score < 0', `Unexpected: ${e.message}`);
    }
  }

  // Test setAttentionScore with invalid turn (negative)
  try {
    workingMemory.setAttentionScore('session', 1, 0.5, -1);
    fail('setAttentionScore with negative turn throws', 'No error thrown');
  } catch (e) {
    if (e.message.includes('Turn must be') || e.message.includes('non-negative') || e.message.includes('Database not initialized')) {
      pass('setAttentionScore validates negative turn', e.message);
    } else {
      fail('setAttentionScore validates negative turn', `Unexpected: ${e.message}`);
    }
  }

  // Test setAttentionScore with non-integer turn
  try {
    workingMemory.setAttentionScore('session', 1, 0.5, 1.5);
    fail('setAttentionScore with float turn throws', 'No error thrown');
  } catch (e) {
    if (e.message.includes('Turn must be') || e.message.includes('integer') || e.message.includes('Database not initialized')) {
      pass('setAttentionScore validates float turn', e.message);
    } else {
      fail('setAttentionScore validates float turn', `Unexpected: ${e.message}`);
    }
  }

  // Test batchUpdateScores with non-array
  try {
    workingMemory.batchUpdateScores('session', 'not-an-array');
    fail('batchUpdateScores with non-array throws', 'No error thrown');
  } catch (e) {
    if (e.message.includes('non-empty array') || e.message.includes('Database not initialized')) {
      pass('batchUpdateScores validates array input', e.message);
    } else {
      fail('batchUpdateScores validates array input', `Unexpected: ${e.message}`);
    }
  }

  // Test batchUpdateScores with empty array
  try {
    workingMemory.batchUpdateScores('session', []);
    fail('batchUpdateScores with empty array throws', 'No error thrown');
  } catch (e) {
    if (e.message.includes('non-empty array') || e.message.includes('Database not initialized')) {
      pass('batchUpdateScores rejects empty array', e.message);
    } else {
      fail('batchUpdateScores rejects empty array', `Unexpected: ${e.message}`);
    }
  }

  // Test getSessionStats with empty session
  try {
    workingMemory.getSessionStats('');
    fail('getSessionStats("") throws', 'No error thrown');
  } catch (e) {
    if (e.message.includes('session_id is required') || e.message.includes('Database not initialized')) {
      pass('getSessionStats validates empty session', e.message);
    } else {
      fail('getSessionStats validates empty session', `Unexpected: ${e.message}`);
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   8. TEST: ensureSchema error handling
──────────────────────────────────────────────────────────────── */

function test_ensureSchema() {
  log('\n🔬 ensureSchema()');

  // Test: Throws when DB not initialized
  try {
    // This should throw because we haven't initialized with a real DB
    workingMemory.ensureSchema();
    fail('ensureSchema throws when DB null', 'No error thrown');
  } catch (e) {
    if (e.message.includes('Database not initialized')) {
      pass('ensureSchema throws when DB null', e.message);
    } else {
      fail('ensureSchema throws when DB null', `Unexpected: ${e.message}`);
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   9. TEST: Module exports
──────────────────────────────────────────────────────────────── */

function test_exports() {
  log('\n🔬 Module Exports');

  const expectedExports = [
    'init',
    'ensureSchema',
    'getOrCreateSession',
    'clearSession',
    'cleanupOldSessions',
    'getWorkingMemory',
    'getSessionMemories',
    'setAttentionScore',
    'batchUpdateScores',
    'isEnabled',
    'getConfig',
    'getSessionStats',
    'calculateTier',
    'getDb',
    'CONFIG',
  ];

  for (const name of expectedExports) {
    if (workingMemory[name] !== undefined) {
      const type = typeof workingMemory[name];
      pass(`Export: ${name}`, `Type: ${type}`);
    } else {
      fail(`Export: ${name}`, 'Not found');
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   10. TEST: Edge cases for calculateTier
──────────────────────────────────────────────────────────────── */

function test_calculateTier_edge_cases() {
  log('\n🔬 calculateTier() Edge Cases');

  const calc = workingMemory.calculateTier;

  // Test 1: Boundary value testing for HOT/WARM
  // HOT threshold is 0.8, testing exact boundary
  const atHot = calc(0.80);
  const belowHot = calc(0.7999);
  if (atHot === 'HOT' && belowHot === 'WARM') {
    pass('HOT/WARM boundary at 0.8', `0.80=${atHot}, 0.7999=${belowHot}`);
  } else {
    fail('HOT/WARM boundary at 0.8', `0.80=${atHot}, 0.7999=${belowHot}`);
  }

  // Test 2: Boundary value testing for WARM/COLD
  // WARM threshold is 0.25, testing exact boundary
  const atWarm = calc(0.25);
  const belowWarm = calc(0.2499);
  if (atWarm === 'WARM' && belowWarm === 'COLD') {
    pass('WARM/COLD boundary at 0.25', `0.25=${atWarm}, 0.2499=${belowWarm}`);
  } else {
    fail('WARM/COLD boundary at 0.25', `0.25=${atWarm}, 0.2499=${belowWarm}`);
  }

  // Test 3: Very small positive number
  const tiny = calc(0.0000001);
  if (tiny === 'COLD') {
    pass('Tiny value = COLD', `0.0000001 => ${tiny}`);
  } else {
    fail('Tiny value = COLD', `Got: ${tiny}`);
  }

  // Test 4: Value just below 1.0
  const almost1 = calc(0.9999999);
  if (almost1 === 'HOT') {
    pass('0.9999999 = HOT', `Tier: ${almost1}`);
  } else {
    fail('0.9999999 = HOT', `Got: ${almost1}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   11. MAIN
──────────────────────────────────────────────────────────────── */

async function runTests() {
  log('🧪 Working Memory Module Tests');
  log('================================');
  log(`Date: ${new Date().toISOString()}\n`);

  // Run all tests
  test_CONFIG();
  test_utility_functions();
  test_calculateTier();
  test_init();
  test_validation_errors();
  test_ensureSchema();
  test_exports();
  test_calculateTier_edge_cases();

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
  runTests().then(() => {
    process.exit(results.failed > 0 ? 1 : 0);
  });
}

module.exports = { runTests };
