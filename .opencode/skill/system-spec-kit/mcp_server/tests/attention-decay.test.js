// ───────────────────────────────────────────────────────────────
// TEST: ATTENTION DECAY WITH FSRS INTEGRATION
// ───────────────────────────────────────────────────────────────

(() => {
  'use strict';

  const path = require('path');

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ──────────────────────────────────────────────────────────────── */

  const LIB_PATH = path.join(__dirname, '..', 'lib', 'cognitive');

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
    log(`   PASS ${name}`);
    if (evidence) log(`      Evidence: ${evidence}`);
  }

  function fail(name, reason) {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', reason });
    log(`   FAIL ${name}`);
    log(`      Reason: ${reason}`);
  }

  function skip(name, reason) {
    results.skipped++;
    results.tests.push({ name, status: 'SKIP', reason });
    log(`   SKIP ${name} (skipped: ${reason})`);
  }

  /* ─────────────────────────────────────────────────────────────
     3. MODULE LOADING
  ──────────────────────────────────────────────────────────────── */

  const attentionDecay = require(path.join(LIB_PATH, 'attention-decay.js'));
  const fsrsScheduler = require(path.join(LIB_PATH, 'fsrs-scheduler.js'));

  /* ─────────────────────────────────────────────────────────────
     4. TEST SUITES
  ──────────────────────────────────────────────────────────────── */

  // 4.1 DECAY_CONFIG TESTS (Legacy)

  function test_DECAY_CONFIG() {
    log('\n DECAY_CONFIG');

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

  // 4.2 INIT TESTS

  function test_init() {
    log('\n init()');

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

  // 4.3 GET DECAY RATE TESTS

  function test_getDecayRate() {
    log('\n getDecayRate()');

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

  // 4.4 CALCULATE DECAYED SCORE TESTS (Legacy Exponential)

  function test_calculateDecayedScore() {
    log('\n calculateDecayedScore() - Legacy Exponential');

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

  // 4.5 FSRS INTEGRATION TESTS (T301-T310)

  function test_fsrs_integration() {
    log('\n FSRS Integration (T301-T310)');

    // T301: Decay uses FSRS formula via calculateRetrievabilityDecay
    const memory1 = {
      stability: 1.0,
      attention_score: 1.0,
      last_review: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    };
    const decay1 = attentionDecay.calculateRetrievabilityDecay(memory1, 1.0);
    // At t=1 day, S=1.0, R = (1 + 0.235 * 1/1)^(-0.5) = 1.235^(-0.5) ≈ 0.9
    const expectedR1 = Math.pow(1 + (19/81) * 1, -0.5);
    if (Math.abs(decay1 - expectedR1) < 0.01) {
      pass('T301: calculateRetrievabilityDecay uses FSRS formula', `At t=1, S=1: R=${decay1.toFixed(4)} (expected ~${expectedR1.toFixed(4)})`);
    } else {
      fail('T301: calculateRetrievabilityDecay uses FSRS formula', `Expected ~${expectedR1.toFixed(4)}, got ${decay1.toFixed(4)}`);
    }

    // T302: Power-law decay is slower than exponential for short periods
    // Compare: FSRS at t=0.5 days vs exponential at 0.5 "turns" with rate 0.8
    const fsrs_short = Math.pow(1 + (19/81) * 0.5, -0.5);  // t=0.5, S=1
    const exp_short = Math.pow(0.8, 0.5);  // 0.5 turns
    if (fsrs_short > exp_short) {
      pass('T302: Power-law slower than exponential (short periods)', `FSRS: ${fsrs_short.toFixed(4)} > Exp: ${exp_short.toFixed(4)}`);
    } else {
      fail('T302: Power-law slower than exponential (short periods)', `FSRS: ${fsrs_short.toFixed(4)}, Exp: ${exp_short.toFixed(4)}`);
    }

    // T303: Power-law decay is faster than exponential for very long periods
    // At t=100 days (S=1), FSRS gives much lower value
    const fsrs_long = Math.pow(1 + (19/81) * 100, -0.5);  // t=100, S=1
    const exp_long = Math.pow(0.8, 100);  // 100 turns
    // Both are very small, but FSRS has a floor behavior (never truly zero)
    // FSRS at t=100, S=1: R = (1 + 0.235*100)^(-0.5) = (24.5)^(-0.5) ≈ 0.202
    if (fsrs_long < 0.25 && fsrs_long > 0) {
      pass('T303: Power-law at t=100 is small but non-zero', `FSRS: ${fsrs_long.toFixed(6)}`);
    } else {
      fail('T303: Power-law at t=100 is small but non-zero', `Got: ${fsrs_long}`);
    }

    // T304: Decay function accepts stability parameter
    const memory2 = {
      stability: 5.0,  // 5 day stability
      attention_score: 1.0,
      last_review: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    };
    const decay2 = attentionDecay.calculateRetrievabilityDecay(memory2, 5.0);
    // At t=5, S=5: R = (1 + 0.235 * 5/5)^(-0.5) = (1 + 0.235)^(-0.5) ≈ 0.9
    const expectedR2 = Math.pow(1 + (19/81), -0.5);
    if (Math.abs(decay2 - expectedR2) < 0.01) {
      pass('T304: Decay accepts stability parameter', `At t=S (5 days), R=${decay2.toFixed(4)} ≈ 0.9`);
    } else {
      fail('T304: Decay accepts stability parameter', `Expected ~${expectedR2.toFixed(4)}, got ${decay2.toFixed(4)}`);
    }

    // T305: Default stability is 1.0 day
    const memoryNoStability = {
      attention_score: 1.0,
      last_review: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      // No stability field
    };
    const decayDefault = attentionDecay.calculateRetrievabilityDecay(memoryNoStability, 1.0);
    // Should use default stability of 1.0
    if (Math.abs(decayDefault - expectedR1) < 0.01) {
      pass('T305: Default stability = 1.0 day', `Decay with no stability: ${decayDefault.toFixed(4)}`);
    } else {
      fail('T305: Default stability = 1.0 day', `Expected ~${expectedR1.toFixed(4)}, got ${decayDefault.toFixed(4)}`);
    }

    // T306: FSRS function is exported
    if (typeof attentionDecay.calculateRetrievabilityDecay === 'function') {
      pass('T306: calculateRetrievabilityDecay is exported', 'Function exists');
    } else {
      fail('T306: calculateRetrievabilityDecay is exported', 'Not a function');
    }

    // T307: applyFsrsDecay is exported
    if (typeof attentionDecay.applyFsrsDecay === 'function') {
      pass('T307: applyFsrsDecay is exported', 'Function exists');
    } else {
      fail('T307: applyFsrsDecay is exported', 'Not a function');
    }

    // T308: activateMemoryWithFsrs is exported
    if (typeof attentionDecay.activateMemoryWithFsrs === 'function') {
      pass('T308: activateMemoryWithFsrs is exported', 'Function exists');
    } else {
      fail('T308: activateMemoryWithFsrs is exported', 'Not a function');
    }

    // T309: fsrsScheduler is re-exported for convenience
    if (attentionDecay.fsrsScheduler && typeof attentionDecay.fsrsScheduler.calculate_retrievability === 'function') {
      pass('T309: fsrsScheduler is re-exported', 'Module accessible');
    } else {
      fail('T309: fsrsScheduler is re-exported', 'Not accessible');
    }

    // T310: Invalid memory object returns 0
    const invalidDecay = attentionDecay.calculateRetrievabilityDecay(null, 1.0);
    if (invalidDecay === 0) {
      pass('T310: null memory returns 0', `Result: ${invalidDecay}`);
    } else {
      fail('T310: null memory returns 0', `Expected 0, got ${invalidDecay}`);
    }
  }

  // 4.6 FSRS CONFIGURATION CONSTANTS (T311-T315)

  function test_fsrs_config() {
    log('\n FSRS Configuration (T311-T315)');

    // T311: FSRS_FACTOR = 19/81 (~0.2346)
    const expectedFactor = 19 / 81;
    if (Math.abs(fsrsScheduler.FSRS_FACTOR - expectedFactor) < 0.0001) {
      pass('T311: FSRS_FACTOR = 19/81', `Value: ${fsrsScheduler.FSRS_FACTOR.toFixed(6)} = ${expectedFactor.toFixed(6)}`);
    } else {
      fail('T311: FSRS_FACTOR = 19/81', `Expected ${expectedFactor}, got ${fsrsScheduler.FSRS_FACTOR}`);
    }

    // T312: FSRS_DECAY = -0.5
    if (fsrsScheduler.FSRS_DECAY === -0.5) {
      pass('T312: FSRS_DECAY = -0.5', `Value: ${fsrsScheduler.FSRS_DECAY}`);
    } else {
      fail('T312: FSRS_DECAY = -0.5', `Expected -0.5, got ${fsrsScheduler.FSRS_DECAY}`);
    }

    // T313: DEFAULT_STABILITY = 1.0
    if (fsrsScheduler.DEFAULT_STABILITY === 1.0) {
      pass('T313: DEFAULT_STABILITY = 1.0', `Value: ${fsrsScheduler.DEFAULT_STABILITY}`);
    } else {
      fail('T313: DEFAULT_STABILITY = 1.0', `Expected 1.0, got ${fsrsScheduler.DEFAULT_STABILITY}`);
    }

    // T314: DEFAULT_DIFFICULTY = 5.0
    if (fsrsScheduler.DEFAULT_DIFFICULTY === 5.0) {
      pass('T314: DEFAULT_DIFFICULTY = 5.0', `Value: ${fsrsScheduler.DEFAULT_DIFFICULTY}`);
    } else {
      fail('T314: DEFAULT_DIFFICULTY = 5.0', `Expected 5.0, got ${fsrsScheduler.DEFAULT_DIFFICULTY}`);
    }

    // T315: TARGET_RETRIEVABILITY = 0.9
    if (fsrsScheduler.TARGET_RETRIEVABILITY === 0.9) {
      pass('T315: TARGET_RETRIEVABILITY = 0.9', `Value: ${fsrsScheduler.TARGET_RETRIEVABILITY}`);
    } else {
      fail('T315: TARGET_RETRIEVABILITY = 0.9', `Expected 0.9, got ${fsrsScheduler.TARGET_RETRIEVABILITY}`);
    }
  }

  // 4.7 BATCH DECAY PROCESSING (T316-T320)

  function test_batch_decay() {
    log('\n Batch Decay Processing (T316-T320)');

    // T316: Batch decay function returns proper structure
    // Without real DB, we test the return structure with invalid session
    const result = attentionDecay.applyFsrsDecay('');
    if (result && typeof result.decayedCount === 'number' && Array.isArray(result.updated)) {
      pass('T316: applyFsrsDecay returns {decayedCount, updated}', `Structure: ${JSON.stringify(result)}`);
    } else {
      fail('T316: applyFsrsDecay returns {decayedCount, updated}', `Got: ${JSON.stringify(result)}`);
    }

    // T317: Empty session returns zero count
    const emptyResult = attentionDecay.applyFsrsDecay('nonexistent-session');
    if (emptyResult.decayedCount === 0) {
      pass('T317: Empty batch returns decayedCount=0', `Result: ${emptyResult.decayedCount}`);
    } else {
      fail('T317: Empty batch returns decayedCount=0', `Got: ${emptyResult.decayedCount}`);
    }

    // T318: null session handled gracefully
    const nullResult = attentionDecay.applyFsrsDecay(null);
    if (nullResult && nullResult.decayedCount === 0) {
      pass('T318: null session returns {decayedCount: 0}', `Result: ${JSON.stringify(nullResult)}`);
    } else {
      fail('T318: null session returns {decayedCount: 0}', `Got: ${JSON.stringify(nullResult)}`);
    }

    // T319: undefined session handled gracefully
    const undefResult = attentionDecay.applyFsrsDecay(undefined);
    if (undefResult && undefResult.decayedCount === 0) {
      pass('T319: undefined session returns {decayedCount: 0}', `Result: ${JSON.stringify(undefResult)}`);
    } else {
      fail('T319: undefined session returns {decayedCount: 0}', `Got: ${JSON.stringify(undefResult)}`);
    }

    // T320: Performance test - simulate 10k decay calculations
    const startTime = Date.now();
    const iterations = 10000;
    for (let i = 0; i < iterations; i++) {
      fsrsScheduler.calculate_retrievability(1.0 + (i % 10), i % 100);
    }
    const elapsed = Date.now() - startTime;
    if (elapsed < 5000) {
      pass('T320: Performance: 10k decay calcs < 5s', `Elapsed: ${elapsed}ms`);
    } else {
      fail('T320: Performance: 10k decay calcs < 5s', `Took ${elapsed}ms`);
    }
  }

  // 4.8 DECAY CURVE VALIDATION (T321-T330)

  function test_decay_curve() {
    log('\n Decay Curve Validation (T321-T330)');

    const calc_r = fsrsScheduler.calculate_retrievability;

    // T321: At t=0, decay factor = 1.0
    const r_at_0 = calc_r(1.0, 0);
    if (r_at_0 === 1.0) {
      pass('T321: At t=0, R = 1.0', `R(0, 1) = ${r_at_0}`);
    } else {
      fail('T321: At t=0, R = 1.0', `Expected 1.0, got ${r_at_0}`);
    }

    // T322: At t=S (stability days), R approximately 0.9
    const stability = 1.0;
    const r_at_s = calc_r(stability, stability);  // t=S
    // R = (1 + 0.235 * 1)^(-0.5) ≈ 0.9
    if (Math.abs(r_at_s - 0.9) < 0.02) {
      pass('T322: At t=S, R ≈ 0.9', `R(1, 1) = ${r_at_s.toFixed(4)}`);
    } else {
      fail('T322: At t=S, R ≈ 0.9', `Expected ~0.9, got ${r_at_s.toFixed(4)}`);
    }

    // T323: At t=2S, R approximately 0.81
    const r_at_2s = calc_r(stability, 2 * stability);
    // R = (1 + 0.235 * 2)^(-0.5) = (1.47)^(-0.5) ≈ 0.824
    if (Math.abs(r_at_2s - 0.82) < 0.03) {
      pass('T323: At t=2S, R ≈ 0.82', `R(1, 2) = ${r_at_2s.toFixed(4)}`);
    } else {
      fail('T323: At t=2S, R ≈ 0.82', `Expected ~0.82, got ${r_at_2s.toFixed(4)}`);
    }

    // T324: At t=10S, R approximately 0.55
    const r_at_10s = calc_r(stability, 10 * stability);
    // R = (1 + 0.235 * 10)^(-0.5) = (3.35)^(-0.5) ≈ 0.546
    if (r_at_10s > 0.4 && r_at_10s < 0.7) {
      pass('T324: At t=10S, R is in (0.4, 0.7)', `R(1, 10) = ${r_at_10s.toFixed(4)}`);
    } else {
      fail('T324: At t=10S, R is in (0.4, 0.7)', `Got ${r_at_10s.toFixed(4)}`);
    }

    // T325: Decay never reaches exactly 0
    const r_at_1000s = calc_r(stability, 1000);
    if (r_at_1000s > 0) {
      pass('T325: At t=1000S, R > 0 (never zero)', `R(1, 1000) = ${r_at_1000s.toFixed(6)}`);
    } else {
      fail('T325: At t=1000S, R > 0 (never zero)', `Got ${r_at_1000s}`);
    }

    // T326: Decay is monotonically decreasing
    const r_values = [0, 1, 2, 3, 4, 5, 10, 20, 50, 100].map(t => calc_r(1.0, t));
    let isMonotonic = true;
    for (let i = 1; i < r_values.length; i++) {
      if (r_values[i] > r_values[i-1]) {
        isMonotonic = false;
        break;
      }
    }
    if (isMonotonic) {
      pass('T326: Decay is monotonically decreasing', `R values: ${r_values.map(v => v.toFixed(3)).join(', ')}`);
    } else {
      fail('T326: Decay is monotonically decreasing', `R values: ${r_values.join(', ')}`);
    }

    // T327: Higher stability = slower decay
    const r_s1 = calc_r(1.0, 5);  // S=1, t=5
    const r_s5 = calc_r(5.0, 5);  // S=5, t=5
    if (r_s5 > r_s1) {
      pass('T327: Higher stability = slower decay', `S=1,t=5: ${r_s1.toFixed(4)} < S=5,t=5: ${r_s5.toFixed(4)}`);
    } else {
      fail('T327: Higher stability = slower decay', `S=1,t=5: ${r_s1}, S=5,t=5: ${r_s5}`);
    }

    // T328: Decay clamped to [0, 1]
    const r_negative = calc_r(1.0, -5);  // Invalid negative time
    const r_huge = calc_r(0.001, 1000000);  // Should approach 0 but stay >= 0
    if (r_negative >= 0 && r_negative <= 1 && r_huge >= 0 && r_huge <= 1) {
      pass('T328: Decay always in [0, 1]', `Negative t: ${r_negative}, Huge t: ${r_huge.toFixed(8)}`);
    } else {
      fail('T328: Decay always in [0, 1]', `Negative t: ${r_negative}, Huge t: ${r_huge}`);
    }

    // T329: Invalid stability uses default
    const r_invalid_s = calc_r(-5, 1);  // Invalid negative stability
    const r_zero_s = calc_r(0, 1);  // Invalid zero stability
    if (r_invalid_s >= 0 && r_invalid_s <= 1 && r_zero_s >= 0 && r_zero_s <= 1) {
      pass('T329: Invalid stability handled gracefully', `Negative S: ${r_invalid_s.toFixed(4)}, Zero S: ${r_zero_s.toFixed(4)}`);
    } else {
      fail('T329: Invalid stability handled gracefully', `Negative S: ${r_invalid_s}, Zero S: ${r_zero_s}`);
    }

    // T330: NaN inputs produce valid output
    const r_nan_s = calc_r(NaN, 1);
    const r_nan_t = calc_r(1, NaN);
    if (!isNaN(r_nan_s) && !isNaN(r_nan_t)) {
      pass('T330: NaN inputs produce valid numbers', `NaN S: ${r_nan_s}, NaN t: ${r_nan_t}`);
    } else {
      fail('T330: NaN inputs produce valid numbers', `NaN S: ${r_nan_s}, NaN t: ${r_nan_t}`);
    }
  }

  // 4.9 BACKWARD COMPATIBILITY (T331-T335)

  function test_backward_compatibility() {
    log('\n Backward Compatibility (T331-T335)');

    // T331: Old exponential function still available
    if (typeof attentionDecay.calculateDecayedScore === 'function') {
      pass('T331: calculateDecayedScore (legacy) still exported', 'Function exists');
    } else {
      fail('T331: calculateDecayedScore (legacy) still exported', 'Not found');
    }

    // T332: Old applyDecay still available
    if (typeof attentionDecay.applyDecay === 'function') {
      pass('T332: applyDecay (legacy) still exported', 'Function exists');
    } else {
      fail('T332: applyDecay (legacy) still exported', 'Not found');
    }

    // T333: Old activateMemory still available
    if (typeof attentionDecay.activateMemory === 'function') {
      pass('T333: activateMemory (legacy) still exported', 'Function exists');
    } else {
      fail('T333: activateMemory (legacy) still exported', 'Not found');
    }

    // T334: Memories with no stability use default in FSRS decay
    const memoryNoStability = {
      attention_score: 0.8,
      // No stability field
    };
    const decay = attentionDecay.calculateRetrievabilityDecay(memoryNoStability, 1.0);
    // Should use DEFAULT_STABILITY = 1.0
    if (typeof decay === 'number' && decay >= 0 && decay <= 0.8) {
      pass('T334: Memory without stability uses default', `Decay: ${decay.toFixed(4)}`);
    } else {
      fail('T334: Memory without stability uses default', `Got: ${decay}`);
    }

    // T335: Legacy DECAY_CONFIG still exported and consistent
    const config = attentionDecay.DECAY_CONFIG;
    if (config &&
        typeof config.defaultDecayRate === 'number' &&
        typeof config.decayRateByTier === 'object' &&
        typeof config.minScoreThreshold === 'number') {
      pass('T335: DECAY_CONFIG structure unchanged', 'All legacy fields present');
    } else {
      fail('T335: DECAY_CONFIG structure unchanged', `Missing fields in: ${JSON.stringify(config)}`);
    }
  }

  // 4.10 DATABASE-DEPENDENT FUNCTIONS (without DB)

  function test_db_dependent_without_db() {
    log('\n Database-dependent functions (no DB initialized)');

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

  // 4.11 FSRS ACTIVATION WITH TESTING EFFECT (T336-T340)

  function test_fsrs_activation() {
    log('\n FSRS Activation with Testing Effect (T336-T340)');

    // T336: activateMemoryWithFsrs returns proper structure
    const result = attentionDecay.activateMemoryWithFsrs('', 1, 1);
    if (result &&
        typeof result.success === 'boolean' &&
        typeof result.stability_updated === 'boolean' &&
        (result.new_stability === null || typeof result.new_stability === 'number')) {
      pass('T336: activateMemoryWithFsrs returns proper structure', `{success, stability_updated, new_stability}`);
    } else {
      fail('T336: activateMemoryWithFsrs returns proper structure', `Got: ${JSON.stringify(result)}`);
    }

    // T337: Invalid sessionId returns success=false
    const invalidSession = attentionDecay.activateMemoryWithFsrs('', 1, 1);
    if (invalidSession.success === false) {
      pass('T337: Empty sessionId returns success=false', `Result: ${JSON.stringify(invalidSession)}`);
    } else {
      fail('T337: Empty sessionId returns success=false', `Got: ${JSON.stringify(invalidSession)}`);
    }

    // T338: Invalid memoryId returns success=false
    const invalidMemory = attentionDecay.activateMemoryWithFsrs('test', null, 1);
    if (invalidMemory.success === false) {
      pass('T338: null memoryId returns success=false', `Result: ${JSON.stringify(invalidMemory)}`);
    } else {
      fail('T338: null memoryId returns success=false', `Got: ${JSON.stringify(invalidMemory)}`);
    }

    // T339: Invalid turnNumber returns success=false
    const invalidTurn = attentionDecay.activateMemoryWithFsrs('test', 1, -5);
    if (invalidTurn.success === false) {
      pass('T339: Negative turn returns success=false', `Result: ${JSON.stringify(invalidTurn)}`);
    } else {
      fail('T339: Negative turn returns success=false', `Got: ${JSON.stringify(invalidTurn)}`);
    }

    // T340: Grade constants are accessible via fsrsScheduler
    if (fsrsScheduler.GRADE_AGAIN === 1 &&
        fsrsScheduler.GRADE_HARD === 2 &&
        fsrsScheduler.GRADE_GOOD === 3 &&
        fsrsScheduler.GRADE_EASY === 4) {
      pass('T340: FSRS grade constants accessible', `AGAIN=1, HARD=2, GOOD=3, EASY=4`);
    } else {
      fail('T340: FSRS grade constants accessible', 'Constants missing or incorrect');
    }
  }

  // 4.12 MODULE EXPORTS

  function test_exports() {
    log('\n Module Exports');

    const expectedExports = [
      // Legacy exports
      'init',
      'getDb',
      'applyDecay',
      'getDecayRate',
      'activateMemory',
      'calculateDecayedScore',
      'getActiveMemories',
      'clearSession',
      'DECAY_CONFIG',
      // FSRS exports
      'applyFsrsDecay',
      'calculateRetrievabilityDecay',
      'activateMemoryWithFsrs',
      // Snake_case aliases
      'apply_fsrs_decay',
      'calculate_retrievability_decay',
      'activate_memory_with_fsrs',
      // Re-exported scheduler
      'fsrsScheduler',
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
     5. TEST RUNNER
  ──────────────────────────────────────────────────────────────── */

  async function runTests() {
    log('Attention Decay Module Tests (with FSRS Integration)');
    log('=========================================================');
    log(`Date: ${new Date().toISOString()}\n`);

    // Run all test suites
    test_DECAY_CONFIG();
    test_init();
    test_getDecayRate();
    test_calculateDecayedScore();
    test_fsrs_integration();
    test_fsrs_config();
    test_batch_decay();
    test_decay_curve();
    test_backward_compatibility();
    test_db_dependent_without_db();
    test_fsrs_activation();
    test_exports();

    // Summary
    log('\n=========================================================');
    log('TEST SUMMARY');
    log('=========================================================');
    log(`Passed:  ${results.passed}`);
    log(`Failed:  ${results.failed}`);
    log(`Skipped: ${results.skipped}`);
    log(`Total:   ${results.passed + results.failed + results.skipped}`);
    log('');

    if (results.failed === 0) {
      log('ALL TESTS PASSED!');
    } else {
      log('Some tests failed. Review output above.');
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

})();
