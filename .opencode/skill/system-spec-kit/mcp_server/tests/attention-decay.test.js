// ───────────────────────────────────────────────────────────────
// TEST: attention-decay.js
// Unit tests for cognitive attention decay module
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

const LIB_PATH = path.join(__dirname, '..', 'lib');
const attentionDecay = require(path.join(LIB_PATH, 'attention-decay.js'));

/* ─────────────────────────────────────────────────────────────
   3. TEST: DECAY_CONFIG
──────────────────────────────────────────────────────────────── */

function test_DECAY_CONFIG() {
  log('\n🔬 DECAY_CONFIG');

  // Test 1: DECAY_CONFIG is exported
  if (attentionDecay.DECAY_CONFIG) {
    pass('DECAY_CONFIG is exported', 'Object exists');
  } else {
    fail('DECAY_CONFIG is exported', 'Not found');
    return;
  }

  // Test 2: defaultDecayRate exists and is valid
  const defaultRate = attentionDecay.DECAY_CONFIG.defaultDecayRate;
  if (typeof defaultRate === 'number' && defaultRate >= 0 && defaultRate <= 1) {
    pass('defaultDecayRate is valid', `Value: ${defaultRate}`);
  } else {
    fail('defaultDecayRate is valid', `Invalid: ${defaultRate}`);
  }

  // Test 3: decayRateByTier has all expected tiers
  const tiers = attentionDecay.DECAY_CONFIG.decayRateByTier;
  const expectedTiers = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];
  const missingTiers = expectedTiers.filter(t => tiers[t] === undefined);
  if (missingTiers.length === 0) {
    pass('All importance tiers defined', expectedTiers.join(', '));
  } else {
    fail('All importance tiers defined', `Missing: ${missingTiers.join(', ')}`);
  }

  // Test 4: minScoreThreshold exists
  const minThreshold = attentionDecay.DECAY_CONFIG.minScoreThreshold;
  if (typeof minThreshold === 'number' && minThreshold > 0 && minThreshold < 1) {
    pass('minScoreThreshold is valid', `Value: ${minThreshold}`);
  } else {
    fail('minScoreThreshold is valid', `Invalid: ${minThreshold}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. TEST: init()
──────────────────────────────────────────────────────────────── */

function test_init() {
  log('\n🔬 init()');

  // Test 1: Throws when database is null
  try {
    attentionDecay.init(null);
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
    attentionDecay.init(undefined);
    fail('init(undefined) throws error', 'No error thrown');
  } catch (e) {
    if (e.message.includes('Database reference is required')) {
      pass('init(undefined) throws error', e.message);
    } else {
      fail('init(undefined) throws error', `Wrong error: ${e.message}`);
    }
  }

  // Test 3: Accepts valid database object
  const mockDb = { prepare: () => {}, exec: () => {} };
  try {
    attentionDecay.init(mockDb);
    const db = attentionDecay.getDb();
    if (db === mockDb) {
      pass('init(validDb) stores reference', 'getDb() returns same object');
    } else {
      fail('init(validDb) stores reference', 'getDb() returns different object');
    }
  } catch (e) {
    fail('init(validDb) stores reference', e.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. TEST: getDecayRate()
──────────────────────────────────────────────────────────────── */

function test_getDecayRate() {
  log('\n🔬 getDecayRate()');

  // Test 1: Constitutional tier returns 1.0 (no decay)
  const constRate = attentionDecay.getDecayRate('constitutional');
  if (constRate === 1.0) {
    pass('constitutional tier returns 1.0', `Rate: ${constRate}`);
  } else {
    fail('constitutional tier returns 1.0', `Got: ${constRate}`);
  }

  // Test 2: Critical tier returns 1.0 (no decay)
  const critRate = attentionDecay.getDecayRate('critical');
  if (critRate === 1.0) {
    pass('critical tier returns 1.0', `Rate: ${critRate}`);
  } else {
    fail('critical tier returns 1.0', `Got: ${critRate}`);
  }

  // Test 3: Normal tier returns 0.80
  const normRate = attentionDecay.getDecayRate('normal');
  if (normRate === 0.80) {
    pass('normal tier returns 0.80', `Rate: ${normRate}`);
  } else {
    fail('normal tier returns 0.80', `Got: ${normRate}`);
  }

  // Test 4: Temporary tier returns 0.60
  const tempRate = attentionDecay.getDecayRate('temporary');
  if (tempRate === 0.60) {
    pass('temporary tier returns 0.60', `Rate: ${tempRate}`);
  } else {
    fail('temporary tier returns 0.60', `Got: ${tempRate}`);
  }

  // Test 5: Case insensitive (CONSTITUTIONAL)
  const upperRate = attentionDecay.getDecayRate('CONSTITUTIONAL');
  if (upperRate === 1.0) {
    pass('getDecayRate is case-insensitive', `CONSTITUTIONAL -> ${upperRate}`);
  } else {
    fail('getDecayRate is case-insensitive', `Got: ${upperRate}`);
  }

  // Test 6: Unknown tier returns default
  const unknownRate = attentionDecay.getDecayRate('unknown_tier');
  const defaultRate = attentionDecay.DECAY_CONFIG.defaultDecayRate;
  if (unknownRate === defaultRate) {
    pass('unknown tier returns default', `Rate: ${unknownRate}`);
  } else {
    fail('unknown tier returns default', `Expected ${defaultRate}, got ${unknownRate}`);
  }

  // Test 7: null tier returns default
  const nullRate = attentionDecay.getDecayRate(null);
  if (nullRate === defaultRate) {
    pass('null tier returns default', `Rate: ${nullRate}`);
  } else {
    fail('null tier returns default', `Expected ${defaultRate}, got ${nullRate}`);
  }

  // Test 8: undefined tier returns default
  const undefRate = attentionDecay.getDecayRate(undefined);
  if (undefRate === defaultRate) {
    pass('undefined tier returns default', `Rate: ${undefRate}`);
  } else {
    fail('undefined tier returns default', `Expected ${defaultRate}, got ${undefRate}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. TEST: calculateDecayedScore() - Core Decay Logic
──────────────────────────────────────────────────────────────── */

function test_calculateDecayedScore() {
  log('\n🔬 calculateDecayedScore()');

  const calc = attentionDecay.calculateDecayedScore;

  // Test 1: No decay when rate is 1.0
  const noDecay = calc(1.0, 5, 1.0);
  if (noDecay === 1.0) {
    pass('Rate 1.0 produces no decay', `1.0 after 5 turns = ${noDecay}`);
  } else {
    fail('Rate 1.0 produces no decay', `Expected 1.0, got ${noDecay}`);
  }

  // Test 2: Zero turns = no change
  const zeroTurns = calc(0.8, 0, 0.5);
  if (zeroTurns === 0.8) {
    pass('Zero turns produces no change', `0.8 stays ${zeroTurns}`);
  } else {
    fail('Zero turns produces no change', `Expected 0.8, got ${zeroTurns}`);
  }

  // Test 3: Exponential decay calculation (0.8 rate, 1 turn)
  const oneDecay = calc(1.0, 1, 0.8);
  if (Math.abs(oneDecay - 0.8) < 0.0001) {
    pass('1 turn with 0.8 rate = 0.8', `Result: ${oneDecay}`);
  } else {
    fail('1 turn with 0.8 rate = 0.8', `Expected 0.8, got ${oneDecay}`);
  }

  // Test 4: Exponential decay (0.8 rate, 2 turns = 0.64)
  const twoDecay = calc(1.0, 2, 0.8);
  if (Math.abs(twoDecay - 0.64) < 0.0001) {
    pass('2 turns with 0.8 rate = 0.64', `Result: ${twoDecay}`);
  } else {
    fail('2 turns with 0.8 rate = 0.64', `Expected 0.64, got ${twoDecay}`);
  }

  // Test 5: Exponential decay (0.8 rate, 3 turns = 0.512)
  const threeDecay = calc(1.0, 3, 0.8);
  if (Math.abs(threeDecay - 0.512) < 0.0001) {
    pass('3 turns with 0.8 rate = 0.512', `Result: ${threeDecay}`);
  } else {
    fail('3 turns with 0.8 rate = 0.512', `Expected 0.512, got ${threeDecay}`);
  }

  // Test 6: Score below threshold returns 0 (BUG-005 validation)
  const veryLow = calc(0.001, 10, 0.5);
  if (veryLow === 0) {
    pass('Score below threshold returns 0', `Result: ${veryLow}`);
  } else {
    fail('Score below threshold returns 0', `Expected 0, got ${veryLow}`);
  }

  // Test 7: NaN currentScore returns 0 (BUG-005)
  const nanScore = calc(NaN, 1, 0.8);
  if (nanScore === 0) {
    pass('NaN currentScore returns 0', `Result: ${nanScore}`);
  } else {
    fail('NaN currentScore returns 0', `Expected 0, got ${nanScore}`);
  }

  // Test 8: NaN turnsElapsed returns current score (BUG-005)
  const nanTurns = calc(0.5, NaN, 0.8);
  if (nanTurns === 0.5) {
    pass('NaN turnsElapsed returns currentScore', `Result: ${nanTurns}`);
  } else {
    fail('NaN turnsElapsed returns currentScore', `Expected 0.5, got ${nanTurns}`);
  }

  // Test 9: NaN decayRate uses default (BUG-005)
  const nanRate = calc(1.0, 1, NaN);
  const expectedWithDefault = 1.0 * attentionDecay.DECAY_CONFIG.defaultDecayRate;
  if (Math.abs(nanRate - expectedWithDefault) < 0.0001) {
    pass('NaN decayRate uses default', `Result: ${nanRate}`);
  } else {
    fail('NaN decayRate uses default', `Expected ${expectedWithDefault}, got ${nanRate}`);
  }

  // Test 10: Negative turns returns current score
  const negTurns = calc(0.7, -5, 0.8);
  if (negTurns === 0.7) {
    pass('Negative turns returns currentScore', `Result: ${negTurns}`);
  } else {
    fail('Negative turns returns currentScore', `Expected 0.7, got ${negTurns}`);
  }

  // Test 11: Decay rate > 1 uses default
  const highRate = calc(1.0, 1, 1.5);
  if (Math.abs(highRate - expectedWithDefault) < 0.0001) {
    pass('Rate > 1 uses default', `Result: ${highRate}`);
  } else {
    fail('Rate > 1 uses default', `Expected ${expectedWithDefault}, got ${highRate}`);
  }

  // Test 12: Decay rate < 0 uses default
  const negRate = calc(1.0, 1, -0.5);
  if (Math.abs(negRate - expectedWithDefault) < 0.0001) {
    pass('Rate < 0 uses default', `Result: ${negRate}`);
  } else {
    fail('Rate < 0 uses default', `Expected ${expectedWithDefault}, got ${negRate}`);
  }

  // Test 13: Result never produces Infinity (edge case)
  const infCheck = calc(1.0, 1000000, 0.99999);
  if (isFinite(infCheck)) {
    pass('Large turns never produces Infinity', `Result: ${infCheck}`);
  } else {
    fail('Large turns never produces Infinity', `Got Infinity`);
  }

  // Test 14: Result never produces NaN from valid inputs
  const nanCheck = calc(0.5, 5, 0.8);
  if (!isNaN(nanCheck)) {
    pass('Valid inputs never produce NaN', `Result: ${nanCheck}`);
  } else {
    fail('Valid inputs never produce NaN', `Got NaN`);
  }
}

/* ─────────────────────────────────────────────────────────────
   7. TEST: Database-dependent functions (without DB)
──────────────────────────────────────────────────────────────── */

function test_db_dependent_without_db() {
  log('\n🔬 Database-dependent functions (no DB initialized)');

  // Reset db to null for these tests
  // We can't easily do this without modifying the module
  // So we test that they gracefully handle missing DB scenarios

  // Test applyDecay with invalid session
  const decayResult = attentionDecay.applyDecay('', 5);
  if (decayResult && decayResult.decayedCount === 0) {
    pass('applyDecay with empty sessionId returns {decayedCount: 0}', `Result: ${JSON.stringify(decayResult)}`);
  } else {
    fail('applyDecay with empty sessionId returns {decayedCount: 0}', `Got: ${JSON.stringify(decayResult)}`);
  }

  // Test applyDecay with null session
  const nullSession = attentionDecay.applyDecay(null, 5);
  if (nullSession && nullSession.decayedCount === 0) {
    pass('applyDecay with null sessionId returns {decayedCount: 0}', `Result: ${JSON.stringify(nullSession)}`);
  } else {
    fail('applyDecay with null sessionId returns {decayedCount: 0}', `Got: ${JSON.stringify(nullSession)}`);
  }

  // Test applyDecay with invalid turn
  const invalidTurn = attentionDecay.applyDecay('test-session', -1);
  if (invalidTurn && invalidTurn.decayedCount === 0) {
    pass('applyDecay with negative turn returns {decayedCount: 0}', `Result: ${JSON.stringify(invalidTurn)}`);
  } else {
    fail('applyDecay with negative turn returns {decayedCount: 0}', `Got: ${JSON.stringify(invalidTurn)}`);
  }

  // Test activateMemory with invalid session
  const activateEmpty = attentionDecay.activateMemory('', 1, 5);
  if (activateEmpty === false) {
    pass('activateMemory with empty sessionId returns false', `Result: ${activateEmpty}`);
  } else {
    fail('activateMemory with empty sessionId returns false', `Got: ${activateEmpty}`);
  }

  // Test activateMemory with null memoryId
  const activateNull = attentionDecay.activateMemory('test', null, 5);
  if (activateNull === false) {
    pass('activateMemory with null memoryId returns false', `Result: ${activateNull}`);
  } else {
    fail('activateMemory with null memoryId returns false', `Got: ${activateNull}`);
  }

  // Test activateMemory with invalid turn
  const activateNegTurn = attentionDecay.activateMemory('test', 1, -5);
  if (activateNegTurn === false) {
    pass('activateMemory with negative turn returns false', `Result: ${activateNegTurn}`);
  } else {
    fail('activateMemory with negative turn returns false', `Got: ${activateNegTurn}`);
  }

  // Test getActiveMemories with invalid session
  const activeEmpty = attentionDecay.getActiveMemories('');
  if (Array.isArray(activeEmpty) && activeEmpty.length === 0) {
    pass('getActiveMemories with empty sessionId returns []', `Result: []`);
  } else {
    fail('getActiveMemories with empty sessionId returns []', `Got: ${JSON.stringify(activeEmpty)}`);
  }

  // Test clearSession with invalid session
  const clearEmpty = attentionDecay.clearSession('');
  if (clearEmpty === 0) {
    pass('clearSession with empty sessionId returns 0', `Result: ${clearEmpty}`);
  } else {
    fail('clearSession with empty sessionId returns 0', `Got: ${clearEmpty}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   8. TEST: Module exports
──────────────────────────────────────────────────────────────── */

function test_exports() {
  log('\n🔬 Module Exports');

  const expectedExports = [
    'init',
    'getDb',
    'applyDecay',
    'getDecayRate',
    'activateMemory',
    'calculateDecayedScore',
    'getActiveMemories',
    'clearSession',
    'DECAY_CONFIG',
  ];

  for (const name of expectedExports) {
    if (attentionDecay[name] !== undefined) {
      const type = typeof attentionDecay[name];
      pass(`Export: ${name}`, `Type: ${type}`);
    } else {
      fail(`Export: ${name}`, 'Not found');
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   9. MAIN
──────────────────────────────────────────────────────────────── */

async function runTests() {
  log('🧪 Attention Decay Module Tests');
  log('================================');
  log(`Date: ${new Date().toISOString()}\n`);

  // Run all tests
  test_DECAY_CONFIG();
  test_init();
  test_getDecayRate();
  test_calculateDecayedScore();
  test_db_dependent_without_db();
  test_exports();

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
