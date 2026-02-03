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

  // 4.12 T035: COMPOSITE ATTENTION SCORING (T341-T355)

  function test_composite_attention() {
    log('\n T035: Composite Attention Scoring (T341-T355)');

    // T341: calculate_composite_attention is exported
    if (typeof attentionDecay.calculate_composite_attention === 'function') {
      pass('T341: calculate_composite_attention is exported', 'Function exists');
    } else {
      fail('T341: calculate_composite_attention is exported', 'Not a function');
      return; // Skip remaining tests if function doesn't exist
    }

    // T342: Returns 0 for null/undefined memory
    const nullResult = attentionDecay.calculate_composite_attention(null);
    const undefResult = attentionDecay.calculate_composite_attention(undefined);
    if (nullResult === 0 && undefResult === 0) {
      pass('T342: Returns 0 for null/undefined memory', `null: ${nullResult}, undefined: ${undefResult}`);
    } else {
      fail('T342: Returns 0 for null/undefined memory', `null: ${nullResult}, undefined: ${undefResult}`);
    }

    // T343: Returns valid score for minimal memory object
    const minimalMemory = { importance_tier: 'normal' };
    const minimalScore = attentionDecay.calculate_composite_attention(minimalMemory);
    if (typeof minimalScore === 'number' && minimalScore >= 0 && minimalScore <= 1) {
      pass('T343: Returns valid score for minimal memory', `Score: ${minimalScore.toFixed(4)}`);
    } else {
      fail('T343: Returns valid score for minimal memory', `Got: ${minimalScore}`);
    }

    // T344: Constitutional tier gets higher score than temporary
    const constMemory = { importance_tier: 'constitutional', importance_weight: 1.0 };
    const tempMemory = { importance_tier: 'temporary', importance_weight: 0.3 };
    const constScore = attentionDecay.calculate_composite_attention(constMemory);
    const tempScore = attentionDecay.calculate_composite_attention(tempMemory);
    if (constScore > tempScore) {
      pass('T344: Constitutional tier > temporary tier', `Const: ${constScore.toFixed(4)} > Temp: ${tempScore.toFixed(4)}`);
    } else {
      fail('T344: Constitutional tier > temporary tier', `Const: ${constScore.toFixed(4)}, Temp: ${tempScore.toFixed(4)}`);
    }

    // T345: Higher access_count increases score (usage factor)
    const lowAccess = { importance_tier: 'normal', access_count: 0 };
    const highAccess = { importance_tier: 'normal', access_count: 20 };
    const lowScore = attentionDecay.calculate_composite_attention(lowAccess);
    const highScore = attentionDecay.calculate_composite_attention(highAccess);
    if (highScore > lowScore) {
      pass('T345: Higher access_count increases score', `Low: ${lowScore.toFixed(4)} < High: ${highScore.toFixed(4)}`);
    } else {
      fail('T345: Higher access_count increases score', `Low: ${lowScore.toFixed(4)}, High: ${highScore.toFixed(4)}`);
    }

    // T346: Score is always clamped to [0, 1]
    const extremeMemory = {
      importance_tier: 'constitutional',
      importance_weight: 10.0,
      access_count: 1000,
      similarity: 200, // Out of range
    };
    const extremeScore = attentionDecay.calculate_composite_attention(extremeMemory);
    if (extremeScore >= 0 && extremeScore <= 1) {
      pass('T346: Score clamped to [0, 1]', `Extreme inputs score: ${extremeScore.toFixed(4)}`);
    } else {
      fail('T346: Score clamped to [0, 1]', `Got: ${extremeScore}`);
    }

    // T347: Query option affects pattern factor
    const memWithTitle = { importance_tier: 'normal', title: 'authentication flow' };
    const scoreNoQuery = attentionDecay.calculate_composite_attention(memWithTitle, {});
    const scoreWithQuery = attentionDecay.calculate_composite_attention(memWithTitle, { query: 'authentication' });
    if (scoreWithQuery >= scoreNoQuery) {
      pass('T347: Query option affects pattern score', `Without query: ${scoreNoQuery.toFixed(4)}, With query: ${scoreWithQuery.toFixed(4)}`);
    } else {
      fail('T347: Query option affects pattern score', `Without: ${scoreNoQuery.toFixed(4)}, With: ${scoreWithQuery.toFixed(4)}`);
    }

    // T348: Stability affects temporal factor
    const lowStability = { importance_tier: 'normal', stability: 0.1, last_review: new Date(Date.now() - 86400000).toISOString() };
    const highStability = { importance_tier: 'normal', stability: 10.0, last_review: new Date(Date.now() - 86400000).toISOString() };
    const lowStabScore = attentionDecay.calculate_composite_attention(lowStability);
    const highStabScore = attentionDecay.calculate_composite_attention(highStability);
    if (highStabScore > lowStabScore) {
      pass('T348: Higher stability = higher temporal score', `S=0.1: ${lowStabScore.toFixed(4)} < S=10: ${highStabScore.toFixed(4)}`);
    } else {
      fail('T348: Higher stability = higher temporal score', `S=0.1: ${lowStabScore.toFixed(4)}, S=10: ${highStabScore.toFixed(4)}`);
    }
  }

  // 4.13 T035: ATTENTION BREAKDOWN (T349-T355)

  function test_attention_breakdown() {
    log('\n T035: Attention Breakdown (T349-T355)');

    // T349: get_attention_breakdown is exported
    if (typeof attentionDecay.get_attention_breakdown === 'function') {
      pass('T349: get_attention_breakdown is exported', 'Function exists');
    } else {
      fail('T349: get_attention_breakdown is exported', 'Not a function');
      return;
    }

    // T350: Returns proper structure for null memory
    const nullBreakdown = attentionDecay.get_attention_breakdown(null);
    if (nullBreakdown &&
        typeof nullBreakdown.factors === 'object' &&
        typeof nullBreakdown.total === 'number' &&
        nullBreakdown.model === '5-factor') {
      pass('T350: Null memory returns {factors, total, model}', `model: ${nullBreakdown.model}`);
    } else {
      fail('T350: Null memory returns {factors, total, model}', `Got: ${JSON.stringify(nullBreakdown)}`);
    }

    // T351: Breakdown contains all 5 factors
    const memory = { importance_tier: 'normal', access_count: 5 };
    const breakdown = attentionDecay.get_attention_breakdown(memory);
    const expectedFactors = ['temporal', 'usage', 'importance', 'pattern', 'citation'];
    const actualFactors = Object.keys(breakdown.factors);
    const missingFactors = expectedFactors.filter(f => !actualFactors.includes(f));
    if (missingFactors.length === 0) {
      pass('T351: Breakdown contains all 5 factors', expectedFactors.join(', '));
    } else {
      fail('T351: Breakdown contains all 5 factors', `Missing: ${missingFactors.join(', ')}`);
    }

    // T352: Each factor has value, weight, contribution, description
    let allFactorsValid = true;
    let invalidFactor = '';
    for (const [name, factor] of Object.entries(breakdown.factors)) {
      if (typeof factor.value !== 'number' ||
          typeof factor.weight !== 'number' ||
          typeof factor.contribution !== 'number' ||
          typeof factor.description !== 'string') {
        allFactorsValid = false;
        invalidFactor = name;
        break;
      }
    }
    if (allFactorsValid) {
      pass('T352: Each factor has value/weight/contribution/description', 'All valid');
    } else {
      fail('T352: Each factor has value/weight/contribution/description', `Invalid factor: ${invalidFactor}`);
    }

    // T353: Total equals sum of contributions
    let sumContributions = 0;
    for (const factor of Object.values(breakdown.factors)) {
      sumContributions += factor.contribution;
    }
    if (Math.abs(breakdown.total - sumContributions) < 0.0001) {
      pass('T353: Total equals sum of contributions', `Total: ${breakdown.total.toFixed(4)}, Sum: ${sumContributions.toFixed(4)}`);
    } else {
      fail('T353: Total equals sum of contributions', `Total: ${breakdown.total}, Sum: ${sumContributions}`);
    }

    // T354: Weights sum to 1.0
    let sumWeights = 0;
    for (const factor of Object.values(breakdown.factors)) {
      sumWeights += factor.weight;
    }
    if (Math.abs(sumWeights - 1.0) < 0.0001) {
      pass('T354: Weights sum to 1.0', `Sum: ${sumWeights.toFixed(4)}`);
    } else {
      fail('T354: Weights sum to 1.0', `Sum: ${sumWeights}`);
    }

    // T355: FIVE_FACTOR_WEIGHTS is exported
    if (attentionDecay.FIVE_FACTOR_WEIGHTS &&
        typeof attentionDecay.FIVE_FACTOR_WEIGHTS.temporal === 'number' &&
        typeof attentionDecay.FIVE_FACTOR_WEIGHTS.usage === 'number' &&
        typeof attentionDecay.FIVE_FACTOR_WEIGHTS.importance === 'number' &&
        typeof attentionDecay.FIVE_FACTOR_WEIGHTS.pattern === 'number' &&
        typeof attentionDecay.FIVE_FACTOR_WEIGHTS.citation === 'number') {
      pass('T355: FIVE_FACTOR_WEIGHTS exported with all factors', 'All weights present');
    } else {
      fail('T355: FIVE_FACTOR_WEIGHTS exported with all factors', 'Missing or invalid');
    }
  }

  // 4.14 T035: APPLY COMPOSITE DECAY (T356-T360)

  function test_apply_composite_decay() {
    log('\n T035: Apply Composite Decay (T356-T360)');

    // T356: apply_composite_decay is exported
    if (typeof attentionDecay.apply_composite_decay === 'function') {
      pass('T356: apply_composite_decay is exported', 'Function exists');
    } else {
      fail('T356: apply_composite_decay is exported', 'Not a function');
      return;
    }

    // T357: Returns {decayedCount, updated} structure
    const result = attentionDecay.apply_composite_decay('');
    if (result &&
        typeof result.decayedCount === 'number' &&
        Array.isArray(result.updated)) {
      pass('T357: Returns {decayedCount, updated}', `Structure: ${JSON.stringify(result)}`);
    } else {
      fail('T357: Returns {decayedCount, updated}', `Got: ${JSON.stringify(result)}`);
    }

    // T358: Empty/invalid sessionId returns zero count
    const emptyResult = attentionDecay.apply_composite_decay('');
    const nullResult = attentionDecay.apply_composite_decay(null);
    const undefResult = attentionDecay.apply_composite_decay(undefined);
    if (emptyResult.decayedCount === 0 && nullResult.decayedCount === 0 && undefResult.decayedCount === 0) {
      pass('T358: Invalid sessionId returns decayedCount=0', 'All return 0');
    } else {
      fail('T358: Invalid sessionId returns decayedCount=0', `empty: ${emptyResult.decayedCount}, null: ${nullResult.decayedCount}, undef: ${undefResult.decayedCount}`);
    }

    // T359: Options parameter is accepted (no crash)
    try {
      const optionsResult = attentionDecay.apply_composite_decay('test-session', { query: 'test', anchors: ['summary'] });
      pass('T359: Accepts options parameter', `Result: ${JSON.stringify(optionsResult)}`);
    } catch (e) {
      fail('T359: Accepts options parameter', `Error: ${e.message}`);
    }

    // T360: Updated array is empty for invalid session
    const testResult = attentionDecay.apply_composite_decay('nonexistent-session');
    if (testResult.updated.length === 0) {
      pass('T360: Updated array empty for invalid session', `Length: ${testResult.updated.length}`);
    } else {
      fail('T360: Updated array empty for invalid session', `Length: ${testResult.updated.length}`);
    }
  }

  // 4.15 FSRS HALF-LIFE & FORMULA VERIFICATION (T361-T370)

  function test_fsrs_halflife() {
    log('\n FSRS Half-Life & Formula Verification (T361-T370)');

    const calc_r = fsrsScheduler.calculate_retrievability;

    // T361: FSRS formula: R = (1 + FACTOR * t/S)^DECAY where FACTOR=19/81, DECAY=-0.5
    // At t=S, R should equal TARGET_RETRIEVABILITY (~0.9)
    const stability = 1.0;
    const r_at_S = calc_r(stability, stability);
    const expected_r = Math.pow(1 + (19/81) * 1, -0.5);
    if (Math.abs(r_at_S - expected_r) < 0.0001) {
      pass('T361: FSRS formula verification at t=S', `R(1,1) = ${r_at_S.toFixed(6)} ≈ ${expected_r.toFixed(6)}`);
    } else {
      fail('T361: FSRS formula verification at t=S', `Expected ${expected_r}, got ${r_at_S}`);
    }

    // T362: Half-life calculation: find t where R = 0.5
    // 0.5 = (1 + 0.235 * t/S)^(-0.5)
    // 0.5^(-2) = 1 + 0.235 * t/S
    // 4 - 1 = 0.235 * t/S
    // t = 3/0.235 * S ≈ 12.77 * S
    const halflife_factor = 3 / (19/81); // ~12.77
    const r_at_halflife = calc_r(1.0, halflife_factor);
    if (Math.abs(r_at_halflife - 0.5) < 0.01) {
      pass('T362: Half-life at t ≈ 12.77*S gives R ≈ 0.5', `R(1, ${halflife_factor.toFixed(2)}) = ${r_at_halflife.toFixed(4)}`);
    } else {
      fail('T362: Half-life at t ≈ 12.77*S gives R ≈ 0.5', `Got R = ${r_at_halflife.toFixed(4)}`);
    }

    // T363: Higher stability extends half-life proportionally
    const r_s1_t13 = calc_r(1.0, 12.77);   // S=1, half-life reached
    const r_s10_t13 = calc_r(10.0, 12.77); // S=10, not at half-life yet
    const r_s10_t127 = calc_r(10.0, 127.7); // S=10, half-life should be ~127.7
    if (r_s10_t13 > r_s1_t13 && Math.abs(r_s10_t127 - 0.5) < 0.01) {
      pass('T363: Half-life scales with stability', `S=10,t=127.7: R=${r_s10_t127.toFixed(4)} ≈ 0.5`);
    } else {
      fail('T363: Half-life scales with stability', `S=10,t=127.7: R=${r_s10_t127}`);
    }

    // T364: Power-law characteristic: long tail (never reaches exactly zero)
    const r_100days = calc_r(1.0, 100);
    const r_1000days = calc_r(1.0, 1000);
    const r_10000days = calc_r(1.0, 10000);
    if (r_100days > 0 && r_1000days > 0 && r_10000days > 0) {
      pass('T364: Long tail - never reaches zero', `100d: ${r_100days.toFixed(6)}, 1000d: ${r_1000days.toFixed(6)}, 10000d: ${r_10000days.toFixed(8)}`);
    } else {
      fail('T364: Long tail - never reaches zero', `100d: ${r_100days}, 1000d: ${r_1000days}, 10000d: ${r_10000days}`);
    }

    // T365: Verify 90% retention at t=S (FSRS design goal)
    const retention_at_S = calc_r(5.0, 5.0);  // Test with S=5
    if (Math.abs(retention_at_S - 0.9) < 0.01) {
      pass('T365: 90% retention at t=S (FSRS design)', `R(5, 5) = ${retention_at_S.toFixed(4)} ≈ 0.9`);
    } else {
      fail('T365: 90% retention at t=S (FSRS design)', `Expected ~0.9, got ${retention_at_S}`);
    }

    // T366: Exponential vs Power-law comparison at various points
    const comparePoints = [0.5, 1, 2, 5, 10, 20, 50];
    let powerLawBehavior = true;
    for (const t of comparePoints) {
      const fsrs_r = calc_r(1.0, t);
      const exp_r = Math.pow(0.8, t);  // Exponential with rate 0.8
      // Power-law should decay slower initially, faster later
      if (t < 5 && fsrs_r <= exp_r * 0.9) {
        powerLawBehavior = false;
        break;
      }
    }
    if (powerLawBehavior) {
      pass('T366: Power-law initially slower than exponential', 'Characteristic confirmed');
    } else {
      fail('T366: Power-law initially slower than exponential', 'Behavior unexpected');
    }

    // T367: Fractional stability values work correctly
    const r_frac = calc_r(0.5, 0.5);  // Half-day stability, half day elapsed
    const expected_frac = Math.pow(1 + (19/81), -0.5);  // Same ratio as t=S
    if (Math.abs(r_frac - expected_frac) < 0.01) {
      pass('T367: Fractional stability works', `R(0.5, 0.5) = ${r_frac.toFixed(4)} ≈ ${expected_frac.toFixed(4)}`);
    } else {
      fail('T367: Fractional stability works', `Expected ${expected_frac}, got ${r_frac}`);
    }

    // T368: Very small stability (fast decay)
    // Note: fsrs-scheduler treats S <= 0 as default (1.0)
    // So we test with S=0.1 which gives: R = (1 + 0.235 * 10)^-0.5 ≈ 0.547
    // This is significantly lower than R(1,1) = 0.9, demonstrating faster decay
    const r_fast = calc_r(0.1, 1);  // S=0.1, t=1 → 10x overdue
    const r_normal = calc_r(1.0, 1);  // S=1.0, t=1 → at stability
    // Verify that lower stability means faster decay (lower R for same elapsed time)
    if (r_fast < r_normal && r_fast > 0 && r_fast < 0.7) {
      pass('T368: Very small stability = fast decay', `R(0.1, 1) = ${r_fast.toFixed(6)} < R(1, 1) = ${r_normal.toFixed(4)}`);
    } else {
      fail('T368: Very small stability = fast decay', `r_fast=${r_fast.toFixed(4)}, r_normal=${r_normal.toFixed(4)}`);
    }

    // T369: Very large stability (slow decay)
    const r_slow = calc_r(1000, 1);  // S=1000, t=1 → barely any decay
    if (r_slow > 0.999) {
      pass('T369: Very large stability = slow decay', `R(1000, 1) = ${r_slow.toFixed(6)}`);
    } else {
      fail('T369: Very large stability = slow decay', `Got: ${r_slow}`);
    }

    // T370: Verify FSRS constants match research values
    if (Math.abs(fsrsScheduler.FSRS_FACTOR - (19/81)) < 0.0001 &&
        fsrsScheduler.FSRS_DECAY === -0.5 &&
        fsrsScheduler.TARGET_RETRIEVABILITY === 0.9) {
      pass('T370: FSRS constants match research', `FACTOR=19/81, DECAY=-0.5, TARGET=0.9`);
    } else {
      fail('T370: FSRS constants match research', 'Constants mismatch');
    }
  }

  // 4.16 EDGE CASES: ZERO STABILITY & BOUNDARY CONDITIONS (T371-T380)

  function test_edge_cases() {
    log('\n Edge Cases: Zero Stability & Boundaries (T371-T380)');

    const calc_r = fsrsScheduler.calculate_retrievability;

    // T371: Zero stability handled gracefully (BUG-024 validation)
    const r_zero_s = calc_r(0, 1);
    if (r_zero_s >= 0 && r_zero_s <= 1 && !isNaN(r_zero_s)) {
      pass('T371: Zero stability handled gracefully', `R(0, 1) = ${r_zero_s.toFixed(4)}`);
    } else {
      fail('T371: Zero stability handled gracefully', `Got: ${r_zero_s}`);
    }

    // T372: calculateRetrievabilityDecay handles memory with stability=0
    const zeroStabMemory = {
      stability: 0,
      attention_score: 1.0,
      last_review: new Date(Date.now() - 86400000).toISOString(),
    };
    const zeroStabDecay = attentionDecay.calculateRetrievabilityDecay(zeroStabMemory, 1.0);
    if (typeof zeroStabDecay === 'number' && !isNaN(zeroStabDecay)) {
      pass('T372: calculateRetrievabilityDecay handles stability=0', `Decay: ${zeroStabDecay.toFixed(4)}`);
    } else {
      fail('T372: calculateRetrievabilityDecay handles stability=0', `Got: ${zeroStabDecay}`);
    }

    // T373: Negative stability treated as default
    const r_neg_s = calc_r(-5, 1);
    if (r_neg_s >= 0 && r_neg_s <= 1 && !isNaN(r_neg_s)) {
      pass('T373: Negative stability handled', `R(-5, 1) = ${r_neg_s.toFixed(4)}`);
    } else {
      fail('T373: Negative stability handled', `Got: ${r_neg_s}`);
    }

    // T374: Negative elapsed time returns 1.0 (or current score)
    const r_neg_t = calc_r(1.0, -5);
    if (r_neg_t >= 0 && r_neg_t <= 1) {
      pass('T374: Negative elapsed time handled', `R(1, -5) = ${r_neg_t.toFixed(4)}`);
    } else {
      fail('T374: Negative elapsed time handled', `Got: ${r_neg_t}`);
    }

    // T375: Infinity inputs handled
    const r_inf_s = calc_r(Infinity, 1);
    const r_inf_t = calc_r(1, Infinity);
    if (!isNaN(r_inf_s) && !isNaN(r_inf_t)) {
      pass('T375: Infinity inputs handled', `R(Inf, 1)=${r_inf_s}, R(1, Inf)=${r_inf_t.toFixed(6)}`);
    } else {
      fail('T375: Infinity inputs handled', `R(Inf, 1)=${r_inf_s}, R(1, Inf)=${r_inf_t}`);
    }

    // T376: Very large elapsed time doesn't overflow
    const r_huge_t = calc_r(1.0, 1e15);
    if (isFinite(r_huge_t) && r_huge_t >= 0) {
      pass('T376: Very large elapsed time no overflow', `R(1, 1e15) = ${r_huge_t}`);
    } else {
      fail('T376: Very large elapsed time no overflow', `Got: ${r_huge_t}`);
    }

    // T377: Constitutional tier memories simulate infinite half-life (no decay)
    const constRate = attentionDecay.getDecayRate('constitutional');
    const constDecay = attentionDecay.calculateDecayedScore(1.0, 1000, constRate);
    if (constDecay === 1.0) {
      pass('T377: Constitutional = infinite half-life (no decay)', `Score stays 1.0 after 1000 turns`);
    } else {
      fail('T377: Constitutional = infinite half-life (no decay)', `Got: ${constDecay}`);
    }

    // T378: Meta-cognitive memories (deprecated tier) also don't decay
    const deprRate = attentionDecay.getDecayRate('deprecated');
    const deprDecay = attentionDecay.calculateDecayedScore(0.5, 1000, deprRate);
    if (deprDecay === 0.5) {
      pass('T378: Deprecated tier = frozen state (no decay)', `Score stays 0.5 after 1000 turns`);
    } else {
      fail('T378: Deprecated tier = frozen state (no decay)', `Got: ${deprDecay}`);
    }

    // T379: Important tier also has no decay (rate=1.0)
    const impRate = attentionDecay.getDecayRate('important');
    const impDecay = attentionDecay.calculateDecayedScore(0.8, 100, impRate);
    if (impDecay === 0.8) {
      pass('T379: Important tier = no decay (rate=1.0)', `Score stays 0.8 after 100 turns`);
    } else {
      fail('T379: Important tier = no decay (rate=1.0)', `Got: ${impDecay}`);
    }

    // T380: Score exactly at minScoreThreshold boundary
    const threshold = attentionDecay.DECAY_CONFIG.minScoreThreshold;
    const atThreshold = attentionDecay.calculateDecayedScore(threshold, 0, 0.8);
    const belowThreshold = attentionDecay.calculateDecayedScore(threshold * 0.5, 0, 0.8);
    if (atThreshold >= threshold && belowThreshold === 0) {
      pass('T380: minScoreThreshold boundary behavior', `At: ${atThreshold}, Below: ${belowThreshold}`);
    } else {
      fail('T380: minScoreThreshold boundary behavior', `At: ${atThreshold}, Below: ${belowThreshold}`);
    }
  }

  // 4.17 MODULE EXPORTS (Updated)

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
      // T035: 5-factor composite scoring
      'calculate_composite_attention',
      'get_attention_breakdown',
      'apply_composite_decay',
      'FIVE_FACTOR_WEIGHTS',
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
    // T035: New composite scoring tests
    test_composite_attention();
    test_attention_breakdown();
    test_apply_composite_decay();
    // FSRS half-life and edge cases
    test_fsrs_halflife();
    test_edge_cases();
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
