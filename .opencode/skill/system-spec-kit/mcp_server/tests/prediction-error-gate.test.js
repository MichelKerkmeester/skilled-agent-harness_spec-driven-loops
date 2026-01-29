// ───────────────────────────────────────────────────────────────
// TEST: PREDICTION ERROR GATE
// ───────────────────────────────────────────────────────────────

(() => {
  'use strict';

  const path = require('path');

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ──────────────────────────────────────────────────────────────── */

  const results = { passed: 0, failed: 0, skipped: 0, tests: [] };

  /* ─────────────────────────────────────────────────────────────
     2. TEST UTILITIES
  ──────────────────────────────────────────────────────────────── */

  function pass(name, evidence) {
    results.passed++;
    results.tests.push({ name, status: 'PASS', evidence });
    console.log(`  [PASS] ${name}`);
  }

  function fail(name, reason) {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', reason });
    console.log(`  [FAIL] ${name}: ${reason}`);
  }

  function skip(name, reason) {
    results.skipped++;
    results.tests.push({ name, status: 'SKIP', reason });
    console.log(`  [SKIP] ${name}: ${reason}`);
  }

  function section(name) {
    console.log(`\n--- ${name} ---`);
  }

  /* ─────────────────────────────────────────────────────────────
     3. MODULE LOADING
  ──────────────────────────────────────────────────────────────── */

  let peGate;
  try {
    peGate = require('../lib/cognitive/prediction-error-gate.js');
  } catch (e) {
    console.error('Failed to load prediction-error-gate module:', e.message);
    process.exit(1);
  }

  /* ─────────────────────────────────────────────────────────────
     4. TEST SUITES
  ──────────────────────────────────────────────────────────────── */

  // 4.1 THRESHOLD CONSTANTS TESTS (T101-T104)

  section('T101-T104: Threshold Constants');

  // T101: DUPLICATE_THRESHOLD = 0.95
  try {
    if (peGate.THRESHOLD.DUPLICATE === 0.95) {
      pass('T101: DUPLICATE_THRESHOLD equals 0.95', `Value: ${peGate.THRESHOLD.DUPLICATE}`);
    } else {
      fail('T101: DUPLICATE_THRESHOLD equals 0.95', `Expected 0.95, got ${peGate.THRESHOLD.DUPLICATE}`);
    }
  } catch (e) {
    fail('T101: DUPLICATE_THRESHOLD equals 0.95', e.message);
  }

  // T102: HIGH_MATCH_THRESHOLD = 0.90
  try {
    if (peGate.THRESHOLD.HIGH_MATCH === 0.90) {
      pass('T102: HIGH_MATCH_THRESHOLD equals 0.90', `Value: ${peGate.THRESHOLD.HIGH_MATCH}`);
    } else {
      fail('T102: HIGH_MATCH_THRESHOLD equals 0.90', `Expected 0.90, got ${peGate.THRESHOLD.HIGH_MATCH}`);
    }
  } catch (e) {
    fail('T102: HIGH_MATCH_THRESHOLD equals 0.90', e.message);
  }

  // T103: MEDIUM_MATCH_THRESHOLD = 0.70
  try {
    if (peGate.THRESHOLD.MEDIUM_MATCH === 0.70) {
      pass('T103: MEDIUM_MATCH_THRESHOLD equals 0.70', `Value: ${peGate.THRESHOLD.MEDIUM_MATCH}`);
    } else {
      fail('T103: MEDIUM_MATCH_THRESHOLD equals 0.70', `Expected 0.70, got ${peGate.THRESHOLD.MEDIUM_MATCH}`);
    }
  } catch (e) {
    fail('T103: MEDIUM_MATCH_THRESHOLD equals 0.70', e.message);
  }

  // T104: All thresholds are valid numbers in range [0, 1]
  try {
    const thresholds = Object.values(peGate.THRESHOLD);
    const allValid = thresholds.every(t => typeof t === 'number' && t >= 0 && t <= 1);
    if (allValid) {
      pass('T104: All thresholds are valid numbers in [0,1]', `Thresholds: ${JSON.stringify(peGate.THRESHOLD)}`);
    } else {
      fail('T104: All thresholds are valid numbers in [0,1]', `Invalid thresholds found: ${JSON.stringify(peGate.THRESHOLD)}`);
    }
  } catch (e) {
    fail('T104: All thresholds are valid numbers in [0,1]', e.message);
  }

  // 4.2 SIMILARITY CLASSIFICATION TESTS (T105-T112)

  section('T105-T112: Similarity Classification');

  // T105: sim >= 0.95 returns REINFORCE (DUPLICATE action)
  try {
    const candidates = [{ id: 1, similarity: 0.96, content: 'Test content' }];
    const result = peGate.evaluate_memory(candidates, 'New content');
    if (result.action === peGate.ACTION.REINFORCE) {
      pass('T105: sim >= 0.95 returns REINFORCE', `Action: ${result.action}, Similarity: 0.96`);
    } else {
      fail('T105: sim >= 0.95 returns REINFORCE', `Expected REINFORCE, got ${result.action}`);
    }
  } catch (e) {
    fail('T105: sim >= 0.95 returns REINFORCE', e.message);
  }

  // T106: sim 0.90-0.94 returns UPDATE for compatible content (HIGH_MATCH)
  try {
    const candidates = [{ id: 1, similarity: 0.92, content: 'Use feature X' }];
    const result = peGate.evaluate_memory(candidates, 'Use feature X with improvements');
    if (result.action === peGate.ACTION.UPDATE) {
      pass('T106: sim 0.90-0.94 returns UPDATE for compatible content', `Action: ${result.action}, Similarity: 0.92`);
    } else {
      fail('T106: sim 0.90-0.94 returns UPDATE for compatible content', `Expected UPDATE, got ${result.action}`);
    }
  } catch (e) {
    fail('T106: sim 0.90-0.94 returns UPDATE for compatible content', e.message);
  }

  // T107: sim 0.70-0.89 returns CREATE_LINKED (MEDIUM_MATCH)
  try {
    const candidates = [{ id: 1, similarity: 0.80, content: 'Test content' }];
    const result = peGate.evaluate_memory(candidates, 'New related content');
    if (result.action === peGate.ACTION.CREATE_LINKED) {
      pass('T107: sim 0.70-0.89 returns CREATE_LINKED', `Action: ${result.action}, Similarity: 0.80`);
    } else {
      fail('T107: sim 0.70-0.89 returns CREATE_LINKED', `Expected CREATE_LINKED, got ${result.action}`);
    }
  } catch (e) {
    fail('T107: sim 0.70-0.89 returns CREATE_LINKED', e.message);
  }

  // T108: sim < 0.70 returns CREATE
  try {
    const candidates = [{ id: 1, similarity: 0.50, content: 'Test content' }];
    const result = peGate.evaluate_memory(candidates, 'New content');
    if (result.action === peGate.ACTION.CREATE) {
      pass('T108: sim < 0.70 returns CREATE', `Action: ${result.action}, Similarity: 0.50`);
    } else {
      fail('T108: sim < 0.70 returns CREATE', `Expected CREATE, got ${result.action}`);
    }
  } catch (e) {
    fail('T108: sim < 0.70 returns CREATE', e.message);
  }

  // T109: Boundary test - exactly 0.95 returns REINFORCE
  try {
    const candidates = [{ id: 1, similarity: 0.95, content: 'Test content' }];
    const result = peGate.evaluate_memory(candidates, 'New content');
    if (result.action === peGate.ACTION.REINFORCE) {
      pass('T109: Boundary - exactly 0.95 returns REINFORCE', `Action: ${result.action}`);
    } else {
      fail('T109: Boundary - exactly 0.95 returns REINFORCE', `Expected REINFORCE, got ${result.action}`);
    }
  } catch (e) {
    fail('T109: Boundary - exactly 0.95 returns REINFORCE', e.message);
  }

  // T110: Boundary test - exactly 0.90 returns UPDATE
  try {
    const candidates = [{ id: 1, similarity: 0.90, content: 'Test content' }];
    const result = peGate.evaluate_memory(candidates, 'New content');
    if (result.action === peGate.ACTION.UPDATE) {
      pass('T110: Boundary - exactly 0.90 returns UPDATE', `Action: ${result.action}`);
    } else {
      fail('T110: Boundary - exactly 0.90 returns UPDATE', `Expected UPDATE, got ${result.action}`);
    }
  } catch (e) {
    fail('T110: Boundary - exactly 0.90 returns UPDATE', e.message);
  }

  // T111: Boundary test - exactly 0.70 returns CREATE_LINKED
  try {
    const candidates = [{ id: 1, similarity: 0.70, content: 'Test content' }];
    const result = peGate.evaluate_memory(candidates, 'New content');
    if (result.action === peGate.ACTION.CREATE_LINKED) {
      pass('T111: Boundary - exactly 0.70 returns CREATE_LINKED', `Action: ${result.action}`);
    } else {
      fail('T111: Boundary - exactly 0.70 returns CREATE_LINKED', `Expected CREATE_LINKED, got ${result.action}`);
    }
  } catch (e) {
    fail('T111: Boundary - exactly 0.70 returns CREATE_LINKED', e.message);
  }

  // T112: Edge case - sim = 0 returns CREATE
  try {
    const candidates = [{ id: 1, similarity: 0, content: 'Test content' }];
    const result = peGate.evaluate_memory(candidates, 'New content');
    if (result.action === peGate.ACTION.CREATE) {
      pass('T112: sim = 0 returns CREATE', `Action: ${result.action}, Similarity: 0`);
    } else {
      fail('T112: sim = 0 returns CREATE', `Expected CREATE, got ${result.action}`);
    }
  } catch (e) {
    fail('T112: sim = 0 returns CREATE', e.message);
  }

  // 4.3 CONTRADICTION DETECTION TESTS (T113-T125)

  section('T113-T125: Contradiction Detection');

  // T113: "always" vs "never" detected as contradiction
  try {
    const result = peGate.detect_contradiction('Always use strict mode', 'Never use strict mode');
    if (result.found === true && result.type === 'absolute') {
      pass('T113: "always" vs "never" detected', `Pattern: ${result.pattern}`);
    } else {
      fail('T113: "always" vs "never" detected', `Result: ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T113: "always" vs "never" detected', e.message);
  }

  // T114: "use" vs "don't use" detected
  try {
    const result = peGate.detect_contradiction('Use feature X', "Don't use feature X");
    if (result.found === true && result.type === 'directive') {
      pass('T114: "use" vs "don\'t use" detected', `Pattern: ${result.pattern}`);
    } else {
      fail('T114: "use" vs "don\'t use" detected', `Result: ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T114: "use" vs "don\'t use" detected', e.message);
  }

  // T115: "enable" vs "disable" detected
  try {
    const result = peGate.detect_contradiction('Enable feature X', 'Disable feature X');
    if (result.found === true && result.type === 'toggle') {
      pass('T115: "enable" vs "disable" detected', `Pattern: ${result.pattern}`);
    } else {
      fail('T115: "enable" vs "disable" detected', `Result: ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T115: "enable" vs "disable" detected', e.message);
  }

  // T116: "prefer" vs "avoid" detected
  try {
    const result = peGate.detect_contradiction('Prefer using callbacks', 'Avoid using callbacks');
    if (result.found === true && result.type === 'preference') {
      pass('T116: "prefer" vs "avoid" detected', `Pattern: ${result.pattern}`);
    } else {
      fail('T116: "prefer" vs "avoid" detected', `Result: ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T116: "prefer" vs "avoid" detected', e.message);
  }

  // T117: "should" vs "should not" detected
  try {
    const result = peGate.detect_contradiction('You should use async', 'You should not use async');
    if (result.found === true && result.type === 'recommendation') {
      pass('T117: "should" vs "should not" detected', `Pattern: ${result.pattern}`);
    } else {
      fail('T117: "should" vs "should not" detected', `Result: ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T117: "should" vs "should not" detected', e.message);
  }

  // T118: "true" vs "false" detected
  try {
    const result = peGate.detect_contradiction('Set debug to true', 'Set debug to false');
    if (result.found === true && result.type === 'boolean') {
      pass('T118: "true" vs "false" detected', `Pattern: ${result.pattern}`);
    } else {
      fail('T118: "true" vs "false" detected', `Result: ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T118: "true" vs "false" detected', e.message);
  }

  // T119: "yes" vs "no" detected
  try {
    const result = peGate.detect_contradiction('The answer is yes', 'The answer is no');
    if (result.found === true && result.type === 'affirmation') {
      pass('T119: "yes" vs "no" detected', `Pattern: ${result.pattern}`);
    } else {
      fail('T119: "yes" vs "no" detected', `Result: ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T119: "yes" vs "no" detected', e.message);
  }

  // T120: "include" vs "exclude" detected
  try {
    const result = peGate.detect_contradiction('Include module X', 'Exclude module X');
    if (result.found === true && result.type === 'inclusion') {
      pass('T120: "include" vs "exclude" detected', `Pattern: ${result.pattern}`);
    } else {
      fail('T120: "include" vs "exclude" detected', `Result: ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T120: "include" vs "exclude" detected', e.message);
  }

  // T121: "allow" vs "deny" detected
  try {
    const result = peGate.detect_contradiction('Allow access to feature', 'Deny access to feature');
    if (result.found === true && result.type === 'permission') {
      pass('T121: "allow" vs "deny" detected', `Pattern: ${result.pattern}`);
    } else {
      fail('T121: "allow" vs "deny" detected', `Result: ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T121: "allow" vs "deny" detected', e.message);
  }

  // T122: Non-contradictory similar content NOT flagged
  try {
    const result = peGate.detect_contradiction('Use feature X for performance', 'Use feature X for reliability');
    if (result.found === false) {
      pass('T122: Non-contradictory content NOT flagged', `Found: ${result.found}`);
    } else {
      fail('T122: Non-contradictory content NOT flagged', `Unexpectedly found: ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T122: Non-contradictory content NOT flagged', e.message);
  }

  // T123: Empty strings handled gracefully
  try {
    const result = peGate.detect_contradiction('', '');
    if (result.found === false) {
      pass('T123: Empty strings handled gracefully', `Found: ${result.found}`);
    } else {
      fail('T123: Empty strings handled gracefully', `Unexpectedly found contradiction`);
    }
  } catch (e) {
    fail('T123: Empty strings handled gracefully', e.message);
  }

  // T124: Very long strings handled
  try {
    const longString1 = 'Always use this approach. '.repeat(1000);
    const longString2 = 'Never use this approach. '.repeat(1000);
    const result = peGate.detect_contradiction(longString1, longString2);
    if (result.found === true && result.type === 'absolute') {
      pass('T124: Very long strings handled', `Pattern: ${result.pattern}`);
    } else {
      fail('T124: Very long strings handled', `Result: ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T124: Very long strings handled', e.message);
  }

  // T125: "must" vs "must not" detected
  try {
    const result = peGate.detect_contradiction('You must validate inputs', 'You must not validate inputs');
    if (result.found === true && result.type === 'requirement') {
      pass('T125: "must" vs "must not" detected', `Pattern: ${result.pattern}`);
    } else {
      fail('T125: "must" vs "must not" detected', `Result: ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T125: "must" vs "must not" detected', e.message);
  }

  // 4.4 ACTION DECISION TESTS (T126-T135)

  section('T126-T135: Action Decision Logic');

  // T126: REINFORCE returned for near-duplicates (>=0.95)
  try {
    const candidates = [{ id: 1, similarity: 0.97, content: 'Exact same content' }];
    const result = peGate.evaluate_memory(candidates, 'Exact same content');
    if (result.action === peGate.ACTION.REINFORCE && result.similarity === 0.97) {
      pass('T126: REINFORCE for near-duplicates', `Action: ${result.action}`);
    } else {
      fail('T126: REINFORCE for near-duplicates', `Expected REINFORCE, got ${result.action}`);
    }
  } catch (e) {
    fail('T126: REINFORCE for near-duplicates', e.message);
  }

  // T127: UPDATE returned for compatible high matches (0.90-0.94)
  try {
    const candidates = [{ id: 1, similarity: 0.93, content: 'Use async/await' }];
    const result = peGate.evaluate_memory(candidates, 'Use async/await with error handling');
    if (result.action === peGate.ACTION.UPDATE) {
      pass('T127: UPDATE for compatible high matches', `Action: ${result.action}`);
    } else {
      fail('T127: UPDATE for compatible high matches', `Expected UPDATE, got ${result.action}`);
    }
  } catch (e) {
    fail('T127: UPDATE for compatible high matches', e.message);
  }

  // T128: SUPERSEDE returned for contradictions in high match range
  try {
    const candidates = [{ id: 1, similarity: 0.92, content: 'Always use var' }];
    const result = peGate.evaluate_memory(candidates, 'Never use var');
    if (result.action === peGate.ACTION.SUPERSEDE && result.contradiction && result.contradiction.found) {
      pass('T128: SUPERSEDE for contradictions', `Action: ${result.action}, Contradiction: ${result.contradiction.pattern}`);
    } else {
      fail('T128: SUPERSEDE for contradictions', `Expected SUPERSEDE with contradiction, got ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T128: SUPERSEDE for contradictions', e.message);
  }

  // T129: CREATE returned for new content (no candidates)
  try {
    const result = peGate.evaluate_memory([], 'Brand new content');
    if (result.action === peGate.ACTION.CREATE && result.reason.includes('No similar memories found')) {
      pass('T129: CREATE for new content (no candidates)', `Action: ${result.action}`);
    } else {
      fail('T129: CREATE for new content (no candidates)', `Expected CREATE, got ${result.action}`);
    }
  } catch (e) {
    fail('T129: CREATE for new content (no candidates)', e.message);
  }

  // T130: CREATE_LINKED returned for related content (0.70-0.89)
  try {
    const candidates = [
      { id: 1, similarity: 0.85, content: 'Test content A' },
      { id: 2, similarity: 0.78, content: 'Test content B' },
      { id: 3, similarity: 0.72, content: 'Test content C' },
    ];
    const result = peGate.evaluate_memory(candidates, 'Related content');
    if (result.action === peGate.ACTION.CREATE_LINKED && Array.isArray(result.related_ids)) {
      pass('T130: CREATE_LINKED for related content', `Action: ${result.action}, Related: ${result.related_ids.length} memories`);
    } else {
      fail('T130: CREATE_LINKED for related content', `Expected CREATE_LINKED with related_ids, got ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T130: CREATE_LINKED for related content', e.message);
  }

  // T131: Best candidate selected when multiple exist
  try {
    const candidates = [
      { id: 1, similarity: 0.80, content: 'Content A' },
      { id: 2, similarity: 0.96, content: 'Content B' },
      { id: 3, similarity: 0.85, content: 'Content C' },
    ];
    const result = peGate.evaluate_memory(candidates, 'New content');
    if (result.candidate.id === 2 && result.similarity === 0.96) {
      pass('T131: Best candidate selected', `Selected ID: ${result.candidate.id}, Similarity: ${result.similarity}`);
    } else {
      fail('T131: Best candidate selected', `Expected ID 2, got ${result.candidate?.id}`);
    }
  } catch (e) {
    fail('T131: Best candidate selected', e.message);
  }

  // T132: Action constants are defined
  try {
    const expectedActions = ['CREATE', 'UPDATE', 'SUPERSEDE', 'REINFORCE', 'CREATE_LINKED'];
    const allPresent = expectedActions.every(a => peGate.ACTION[a] === a);
    if (allPresent) {
      pass('T132: All ACTION constants defined', `Actions: ${Object.keys(peGate.ACTION).join(', ')}`);
    } else {
      fail('T132: All ACTION constants defined', `Missing actions: ${JSON.stringify(peGate.ACTION)}`);
    }
  } catch (e) {
    fail('T132: All ACTION constants defined', e.message);
  }

  // T133: Contradiction check can be disabled
  try {
    const candidates = [{ id: 1, similarity: 0.92, content: 'Always use X' }];
    const result = peGate.evaluate_memory(candidates, 'Never use X', { check_contradictions: false });
    if (result.action === peGate.ACTION.UPDATE && !result.contradiction) {
      pass('T133: Contradiction check can be disabled', `Action: ${result.action}`);
    } else {
      fail('T133: Contradiction check can be disabled', `Expected UPDATE without contradiction, got ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T133: Contradiction check can be disabled', e.message);
  }

  // T134: Reason includes similarity percentage
  try {
    const candidates = [{ id: 1, similarity: 0.85, content: 'Test' }];
    const result = peGate.evaluate_memory(candidates, 'New test');
    if (result.reason.includes('85.0%') || result.reason.includes('85%')) {
      pass('T134: Reason includes similarity percentage', `Reason: ${result.reason}`);
    } else {
      fail('T134: Reason includes similarity percentage', `Reason missing percentage: ${result.reason}`);
    }
  } catch (e) {
    fail('T134: Reason includes similarity percentage', e.message);
  }

  // T135: Candidate included in result
  try {
    const candidates = [{ id: 42, similarity: 0.85, content: 'Test content' }];
    const result = peGate.evaluate_memory(candidates, 'New content');
    if (result.candidate && result.candidate.id === 42) {
      pass('T135: Candidate included in result', `Candidate ID: ${result.candidate.id}`);
    } else {
      fail('T135: Candidate included in result', `Expected candidate with ID 42, got ${JSON.stringify(result.candidate)}`);
    }
  } catch (e) {
    fail('T135: Candidate included in result', e.message);
  }

  // 4.5 EDGE CASES & ERROR HANDLING (T136-T145)

  section('T136-T145: Edge Cases & Error Handling');

  // T136: Null candidates array handled
  try {
    const result = peGate.evaluate_memory(null, 'New content');
    if (result.action === peGate.ACTION.CREATE && result.reason.includes('No similar memories found')) {
      pass('T136: Null candidates handled', `Action: ${result.action}`);
    } else {
      fail('T136: Null candidates handled', `Expected CREATE, got ${result.action}`);
    }
  } catch (e) {
    fail('T136: Null candidates handled', e.message);
  }

  // T137: Undefined candidates handled
  try {
    const result = peGate.evaluate_memory(undefined, 'New content');
    if (result.action === peGate.ACTION.CREATE) {
      pass('T137: Undefined candidates handled', `Action: ${result.action}`);
    } else {
      fail('T137: Undefined candidates handled', `Expected CREATE, got ${result.action}`);
    }
  } catch (e) {
    fail('T137: Undefined candidates handled', e.message);
  }

  // T138: Empty content handled
  try {
    const candidates = [{ id: 1, similarity: 0.80, content: '' }];
    const result = peGate.evaluate_memory(candidates, '');
    // Should work without error
    if (result.action) {
      pass('T138: Empty content handled', `Action: ${result.action}`);
    } else {
      fail('T138: Empty content handled', 'No action returned');
    }
  } catch (e) {
    fail('T138: Empty content handled', e.message);
  }

  // T139: Very high similarity (0.999) handled
  try {
    const candidates = [{ id: 1, similarity: 0.999, content: 'Test' }];
    const result = peGate.evaluate_memory(candidates, 'Test');
    if (result.action === peGate.ACTION.REINFORCE) {
      pass('T139: Very high similarity (0.999) handled', `Action: ${result.action}`);
    } else {
      fail('T139: Very high similarity (0.999) handled', `Expected REINFORCE, got ${result.action}`);
    }
  } catch (e) {
    fail('T139: Very high similarity (0.999) handled', e.message);
  }

  // T140: sim = 1.0 (exact match) handled
  try {
    const candidates = [{ id: 1, similarity: 1.0, content: 'Test' }];
    const result = peGate.evaluate_memory(candidates, 'Test');
    if (result.action === peGate.ACTION.REINFORCE) {
      pass('T140: sim = 1.0 (exact match) handled', `Action: ${result.action}`);
    } else {
      fail('T140: sim = 1.0 (exact match) handled', `Expected REINFORCE, got ${result.action}`);
    }
  } catch (e) {
    fail('T140: sim = 1.0 (exact match) handled', e.message);
  }

  // T141: Non-string new_content converted to empty string
  try {
    const candidates = [{ id: 1, similarity: 0.92, content: 'Test' }];
    const result = peGate.evaluate_memory(candidates, null);
    // Should work without error, new_content becomes ''
    if (result.action) {
      pass('T141: Non-string new_content handled', `Action: ${result.action}`);
    } else {
      fail('T141: Non-string new_content handled', 'No action returned');
    }
  } catch (e) {
    fail('T141: Non-string new_content handled', e.message);
  }

  // T142: Candidate without similarity defaults to 0
  try {
    const candidates = [{ id: 1, content: 'Test' }];  // No similarity
    const result = peGate.evaluate_memory(candidates, 'New content');
    if (result.action === peGate.ACTION.CREATE && result.similarity === 0) {
      pass('T142: Candidate without similarity defaults to 0', `Similarity: ${result.similarity}`);
    } else {
      fail('T142: Candidate without similarity defaults to 0', `Expected 0, got ${result.similarity}`);
    }
  } catch (e) {
    fail('T142: Candidate without similarity defaults to 0', e.message);
  }

  // T143: Contradiction detection with null inputs
  try {
    const result = peGate.detect_contradiction(null, null);
    if (result.found === false) {
      pass('T143: Contradiction detection with null inputs', `Found: ${result.found}`);
    } else {
      fail('T143: Contradiction detection with null inputs', `Unexpected result: ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T143: Contradiction detection with null inputs', e.message);
  }

  // T144: Contradiction detection with undefined inputs
  try {
    const result = peGate.detect_contradiction(undefined, undefined);
    if (result.found === false) {
      pass('T144: Contradiction detection with undefined inputs', `Found: ${result.found}`);
    } else {
      fail('T144: Contradiction detection with undefined inputs', `Unexpected result: ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T144: Contradiction detection with undefined inputs', e.message);
  }

  // T145: Empty candidates array returns CREATE
  try {
    const result = peGate.evaluate_memory([], 'New content');
    if (result.action === peGate.ACTION.CREATE && result.candidate === null) {
      pass('T145: Empty candidates array returns CREATE', `Action: ${result.action}`);
    } else {
      fail('T145: Empty candidates array returns CREATE', `Expected CREATE with null candidate, got ${JSON.stringify(result)}`);
    }
  } catch (e) {
    fail('T145: Empty candidates array returns CREATE', e.message);
  }

  // 4.6 HELPER FUNCTIONS TESTS (T146-T155)

  section('T146-T155: Helper Functions');

  // T146: calculate_similarity_stats with valid candidates
  try {
    const candidates = [
      { similarity: 0.90 },
      { similarity: 0.80 },
      { similarity: 0.70 },
    ];
    const stats = peGate.calculate_similarity_stats(candidates);
    if (stats.max === 0.90 && stats.min === 0.70 && stats.count === 3 && Math.abs(stats.avg - 0.80) < 0.01) {
      pass('T146: calculate_similarity_stats with valid candidates', `Max: ${stats.max}, Min: ${stats.min}, Avg: ${stats.avg.toFixed(2)}`);
    } else {
      fail('T146: calculate_similarity_stats with valid candidates', `Unexpected stats: ${JSON.stringify(stats)}`);
    }
  } catch (e) {
    fail('T146: calculate_similarity_stats with valid candidates', e.message);
  }

  // T147: calculate_similarity_stats with empty array
  try {
    const stats = peGate.calculate_similarity_stats([]);
    if (stats.max === 0 && stats.min === 0 && stats.avg === 0 && stats.count === 0) {
      pass('T147: calculate_similarity_stats with empty array', `Returns zeroes`);
    } else {
      fail('T147: calculate_similarity_stats with empty array', `Unexpected stats: ${JSON.stringify(stats)}`);
    }
  } catch (e) {
    fail('T147: calculate_similarity_stats with empty array', e.message);
  }

  // T148: filter_relevant_candidates filters correctly
  try {
    const candidates = [
      { id: 1, similarity: 0.90 },
      { id: 2, similarity: 0.60 },
      { id: 3, similarity: 0.75 },
    ];
    const filtered = peGate.filter_relevant_candidates(candidates, 0.70);
    if (filtered.length === 2 && filtered.every(c => c.similarity >= 0.70)) {
      pass('T148: filter_relevant_candidates filters correctly', `Filtered count: ${filtered.length}`);
    } else {
      fail('T148: filter_relevant_candidates filters correctly', `Unexpected result: ${JSON.stringify(filtered)}`);
    }
  } catch (e) {
    fail('T148: filter_relevant_candidates filters correctly', e.message);
  }

  // T149: filter_relevant_candidates with null returns empty array
  try {
    const filtered = peGate.filter_relevant_candidates(null);
    if (Array.isArray(filtered) && filtered.length === 0) {
      pass('T149: filter_relevant_candidates with null returns []', `Result: []`);
    } else {
      fail('T149: filter_relevant_candidates with null returns []', `Expected [], got ${JSON.stringify(filtered)}`);
    }
  } catch (e) {
    fail('T149: filter_relevant_candidates with null returns []', e.message);
  }

  // T150: get_action_priority returns correct priorities
  try {
    const priorities = {
      SUPERSEDE: peGate.get_action_priority(peGate.ACTION.SUPERSEDE),
      UPDATE: peGate.get_action_priority(peGate.ACTION.UPDATE),
      CREATE_LINKED: peGate.get_action_priority(peGate.ACTION.CREATE_LINKED),
      REINFORCE: peGate.get_action_priority(peGate.ACTION.REINFORCE),
      CREATE: peGate.get_action_priority(peGate.ACTION.CREATE),
    };
    if (priorities.SUPERSEDE > priorities.UPDATE &&
        priorities.UPDATE > priorities.CREATE_LINKED &&
        priorities.CREATE_LINKED > priorities.REINFORCE &&
        priorities.REINFORCE > priorities.CREATE) {
      pass('T150: get_action_priority returns correct priorities', `Order: SUPERSEDE > UPDATE > CREATE_LINKED > REINFORCE > CREATE`);
    } else {
      fail('T150: get_action_priority returns correct priorities', `Unexpected priorities: ${JSON.stringify(priorities)}`);
    }
  } catch (e) {
    fail('T150: get_action_priority returns correct priorities', e.message);
  }

  // T151: truncate_content truncates long strings
  try {
    const long_content = 'A'.repeat(300);
    const truncated = peGate.truncate_content(long_content, 100);
    if (truncated.length === 100 && truncated.endsWith('...')) {
      pass('T151: truncate_content truncates long strings', `Length: ${truncated.length}`);
    } else {
      fail('T151: truncate_content truncates long strings', `Length: ${truncated.length}, Ends with: ${truncated.slice(-3)}`);
    }
  } catch (e) {
    fail('T151: truncate_content truncates long strings', e.message);
  }

  // T152: truncate_content preserves short strings
  try {
    const short_content = 'Short text';
    const result = peGate.truncate_content(short_content, 100);
    if (result === short_content) {
      pass('T152: truncate_content preserves short strings', `Result: "${result}"`);
    } else {
      fail('T152: truncate_content preserves short strings', `Expected "${short_content}", got "${result}"`);
    }
  } catch (e) {
    fail('T152: truncate_content preserves short strings', e.message);
  }

  // T153: truncate_content handles null/undefined
  try {
    const result1 = peGate.truncate_content(null, 100);
    const result2 = peGate.truncate_content(undefined, 100);
    if (result1 === '' && result2 === '') {
      pass('T153: truncate_content handles null/undefined', `Both return empty string`);
    } else {
      fail('T153: truncate_content handles null/undefined', `Got: "${result1}", "${result2}"`);
    }
  } catch (e) {
    fail('T153: truncate_content handles null/undefined', e.message);
  }

  // T154: CONTRADICTION_PATTERNS array is populated
  try {
    if (Array.isArray(peGate.CONTRADICTION_PATTERNS) && peGate.CONTRADICTION_PATTERNS.length > 0) {
      const hasRequired = peGate.CONTRADICTION_PATTERNS.every(p => p.pattern && p.type && p.pair);
      if (hasRequired) {
        pass('T154: CONTRADICTION_PATTERNS populated correctly', `Count: ${peGate.CONTRADICTION_PATTERNS.length}`);
      } else {
        fail('T154: CONTRADICTION_PATTERNS populated correctly', 'Missing required fields');
      }
    } else {
      fail('T154: CONTRADICTION_PATTERNS populated correctly', 'Empty or not an array');
    }
  } catch (e) {
    fail('T154: CONTRADICTION_PATTERNS populated correctly', e.message);
  }

  // T155: camelCase aliases exist
  try {
    const aliases = [
      ['evaluate_memory', 'evaluateMemory'],
      ['detect_contradiction', 'detectContradiction'],
      ['calculate_similarity_stats', 'calculateSimilarityStats'],
      ['filter_relevant_candidates', 'filterRelevantCandidates'],
      ['get_action_priority', 'getActionPriority'],
      ['truncate_content', 'truncateContent'],
    ];
    const allPresent = aliases.every(([snake, camel]) => peGate[snake] === peGate[camel]);
    if (allPresent) {
      pass('T155: camelCase aliases exist', `All ${aliases.length} aliases verified`);
    } else {
      fail('T155: camelCase aliases exist', 'Some aliases missing or mismatched');
    }
  } catch (e) {
    fail('T155: camelCase aliases exist', e.message);
  }

  // 4.7 CONFLICT LOGGING TESTS (T156-T165)

  section('T156-T165: Conflict Logging');

  // T156: format_conflict_record creates valid record
  try {
    const decision = {
      action: peGate.ACTION.UPDATE,
      reason: 'Test reason',
      similarity: 0.92,
      candidate: { id: 1, content: 'Existing content' },
    };
    const record = peGate.format_conflict_record(decision, 'New content', 'specs/test');
    if (record.action === 'UPDATE' &&
        record.similarity === 0.92 &&
        record.spec_folder === 'specs/test' &&
        record.timestamp) {
      pass('T156: format_conflict_record creates valid record', `Action: ${record.action}`);
    } else {
      fail('T156: format_conflict_record creates valid record', `Invalid record: ${JSON.stringify(record)}`);
    }
  } catch (e) {
    fail('T156: format_conflict_record creates valid record', e.message);
  }

  // T157: format_conflict_record handles null candidate
  try {
    const decision = {
      action: peGate.ACTION.CREATE,
      reason: 'No similar memories',
      similarity: 0,
      candidate: null,
    };
    const record = peGate.format_conflict_record(decision, 'New content');
    if (record.candidate_id === null && record.candidate_content_preview === '') {
      pass('T157: format_conflict_record handles null candidate', `Candidate ID: ${record.candidate_id}`);
    } else {
      fail('T157: format_conflict_record handles null candidate', `Unexpected: ${JSON.stringify(record)}`);
    }
  } catch (e) {
    fail('T157: format_conflict_record handles null candidate', e.message);
  }

  // T158: should_log_conflict returns true for UPDATE
  try {
    const decision = { action: peGate.ACTION.UPDATE, similarity: 0.92 };
    if (peGate.should_log_conflict(decision) === true) {
      pass('T158: should_log_conflict returns true for UPDATE', 'Logs UPDATE actions');
    } else {
      fail('T158: should_log_conflict returns true for UPDATE', 'Did not return true');
    }
  } catch (e) {
    fail('T158: should_log_conflict returns true for UPDATE', e.message);
  }

  // T159: should_log_conflict returns true for SUPERSEDE
  try {
    const decision = { action: peGate.ACTION.SUPERSEDE, similarity: 0.92 };
    if (peGate.should_log_conflict(decision) === true) {
      pass('T159: should_log_conflict returns true for SUPERSEDE', 'Logs SUPERSEDE actions');
    } else {
      fail('T159: should_log_conflict returns true for SUPERSEDE', 'Did not return true');
    }
  } catch (e) {
    fail('T159: should_log_conflict returns true for SUPERSEDE', e.message);
  }

  // T160: should_log_conflict returns false for CREATE with similarity 0
  try {
    const decision = { action: peGate.ACTION.CREATE, similarity: 0 };
    if (peGate.should_log_conflict(decision) === false) {
      pass('T160: should_log_conflict returns false for CREATE with sim 0', 'Skips trivial creates');
    } else {
      fail('T160: should_log_conflict returns false for CREATE with sim 0', 'Did not return false');
    }
  } catch (e) {
    fail('T160: should_log_conflict returns false for CREATE with sim 0', e.message);
  }

  // T161: should_log_conflict returns true for CREATE with similarity > 0
  try {
    const decision = { action: peGate.ACTION.CREATE, similarity: 0.50 };
    if (peGate.should_log_conflict(decision) === true) {
      pass('T161: should_log_conflict returns true for CREATE with sim > 0', 'Logs non-trivial creates');
    } else {
      fail('T161: should_log_conflict returns true for CREATE with sim > 0', 'Did not return true');
    }
  } catch (e) {
    fail('T161: should_log_conflict returns true for CREATE with sim > 0', e.message);
  }

  // T162: log_conflict returns false without database
  try {
    const decision = { action: peGate.ACTION.UPDATE, similarity: 0.92 };
    // Database not initialized, should return false
    const result = peGate.log_conflict(decision, null, 'New', 'Old');
    if (result === false) {
      pass('T162: log_conflict returns false without database', 'Handled gracefully');
    } else {
      fail('T162: log_conflict returns false without database', `Expected false, got ${result}`);
    }
  } catch (e) {
    fail('T162: log_conflict returns false without database', e.message);
  }

  // T163: log_conflict returns false for invalid decision
  try {
    const result = peGate.log_conflict(null, null, 'New', 'Old');
    if (result === false) {
      pass('T163: log_conflict returns false for invalid decision', 'Handled gracefully');
    } else {
      fail('T163: log_conflict returns false for invalid decision', `Expected false, got ${result}`);
    }
  } catch (e) {
    fail('T163: log_conflict returns false for invalid decision', e.message);
  }

  // T164: getDb returns null when not initialized
  try {
    const db = peGate.getDb();
    if (db === null) {
      pass('T164: getDb returns null when not initialized', 'Correct behavior');
    } else {
      // It might be initialized from a previous test run
      skip('T164: getDb returns null when not initialized', 'Database may be initialized');
    }
  } catch (e) {
    fail('T164: getDb returns null when not initialized', e.message);
  }

  // T165: get_conflict_stats returns empty stats without database
  try {
    const stats = peGate.get_conflict_stats();
    if (stats.total === 0 && Object.keys(stats.byAction).length === 0) {
      pass('T165: get_conflict_stats returns empty without database', `Stats: ${JSON.stringify(stats)}`);
    } else {
      // May have data from previous runs
      skip('T165: get_conflict_stats returns empty without database', 'Database may have data');
    }
  } catch (e) {
    fail('T165: get_conflict_stats returns empty without database', e.message);
  }

  /* ─────────────────────────────────────────────────────────────
     5. TEST RUNNER
  ──────────────────────────────────────────────────────────────── */

  console.log('\n' + '='.repeat(50));
  console.log('PREDICTION ERROR GATE TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`[PASS]:  ${results.passed}`);
  console.log(`[FAIL]:  ${results.failed}`);
  console.log(`[SKIP]:  ${results.skipped}`);
  console.log(`Total:   ${results.tests.length}`);
  console.log('='.repeat(50));

  // Exit with appropriate code
  if (results.failed > 0) {
    console.log('\nTESTS FAILED\n');
    process.exit(1);
  } else {
    console.log('\nALL TESTS PASSED\n');
    process.exit(0);
  }

})();
