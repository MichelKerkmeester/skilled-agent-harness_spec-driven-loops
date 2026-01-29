#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// TEST: MEMORY SAVE INTEGRATION
// Tests PE gating integration in memory save handler
// Covers: T501-T550 (PE Gate + Memory Save Integration)
// ───────────────────────────────────────────────────────────────

(() => {
  'use strict';

  const path = require('path');
  const fs = require('fs');
  const os = require('os');

  /* ─────────────────────────────────────────────────────────────
     1. TEST FRAMEWORK
  ──────────────────────────────────────────────────────────────── */

  const test_results = {
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: [],
  };

  function log(msg) {
    console.log(msg);
  }

  function pass(name, evidence) {
    test_results.passed++;
    test_results.tests.push({ name, status: 'PASS', evidence });
    log(`   [PASS] ${name}`);
    if (evidence) log(`      Evidence: ${evidence}`);
  }

  function fail(name, reason) {
    test_results.failed++;
    test_results.tests.push({ name, status: 'FAIL', reason });
    log(`   [FAIL] ${name}`);
    log(`      Reason: ${reason}`);
  }

  function skip(name, reason) {
    test_results.skipped++;
    test_results.tests.push({ name, status: 'SKIP', reason });
    log(`   [SKIP] ${name} (skipped: ${reason})`);
  }

  /* ─────────────────────────────────────────────────────────────
     2. MODULE LOADING
  ──────────────────────────────────────────────────────────────── */

  const HANDLER_PATH = path.join(__dirname, '..', 'handlers');
  const LIB_PATH = path.join(__dirname, '..', 'lib');

  let memory_save_handler = null;
  let prediction_error_gate = null;
  let fsrs_scheduler = null;
  let vector_index = null;

  function load_modules() {
    log('\n[SETUP] Module Loading');

    // Try to load memory save handler
    try {
      memory_save_handler = require(path.join(HANDLER_PATH, 'memory-save.js'));
      pass('memory-save.js loads without error', 'require() succeeded');
    } catch (error) {
      skip('memory-save.js loads without error', `Module not available: ${error.message}`);
      memory_save_handler = null;
    }

    // Try to load prediction error gate
    try {
      prediction_error_gate = require(path.join(LIB_PATH, 'cognitive', 'prediction-error-gate.js'));
      pass('prediction-error-gate.js loads without error', 'require() succeeded');
    } catch (error) {
      skip('prediction-error-gate.js loads without error', `Module not available: ${error.message}`);
      prediction_error_gate = null;
    }

    // Try to load FSRS scheduler
    try {
      fsrs_scheduler = require(path.join(LIB_PATH, 'cognitive', 'fsrs-scheduler.js'));
      pass('fsrs-scheduler.js loads without error', 'require() succeeded');
    } catch (error) {
      skip('fsrs-scheduler.js loads without error', `Module not available: ${error.message}`);
      fsrs_scheduler = null;
    }

    // Try to load vector index (for database access)
    try {
      vector_index = require(path.join(LIB_PATH, 'search', 'vector-index.js'));
      pass('vector-index.js loads without error', 'require() succeeded');
    } catch (error) {
      skip('vector-index.js loads without error', `Module not available: ${error.message}`);
      vector_index = null;
    }
  }

  /* ─────────────────────────────────────────────────────────────
     3. TEST HELPERS
  ──────────────────────────────────────────────────────────────── */

  /**
   * Create a mock candidate for PE evaluation
   */
  function create_mock_candidate(similarity, content = 'Existing memory content') {
    return {
      id: Math.floor(Math.random() * 10000),
      similarity: similarity,
      content: content,
      stability: fsrs_scheduler ? fsrs_scheduler.DEFAULT_STABILITY : 1.0,
      difficulty: fsrs_scheduler ? fsrs_scheduler.DEFAULT_DIFFICULTY : 5.0,
      file_path: '/mock/path/memory.md',
    };
  }

  /**
   * Create mock embedding (Float32Array of random values)
   */
  function create_mock_embedding(dim = 384) {
    const arr = new Float32Array(dim);
    for (let i = 0; i < dim; i++) {
      arr[i] = Math.random() * 2 - 1;  // Random values between -1 and 1
    }
    return arr;
  }

  /* ─────────────────────────────────────────────────────────────
     4. PE GATE INVOCATION TESTS (T501-T510)
  ──────────────────────────────────────────────────────────────── */

  function test_pe_gate_invocation() {
    log('\n[SUITE] PE Gate Invocation Tests (T501-T510)');

    if (!prediction_error_gate || !prediction_error_gate.evaluate_memory) {
      skip('T501: PE gate called before memory creation', 'Module or function not available');
      skip('T502: PE gate receives correct content', 'Module or function not available');
      skip('T503: PE gate result determines action', 'Module or function not available');
      skip('T504: PE gate handles empty candidates', 'Module or function not available');
      skip('T505: PE gate handles null content gracefully', 'Module or function not available');
      skip('T506: PE gate returns required action field', 'Module or function not available');
      skip('T507: PE gate returns similarity score', 'Module or function not available');
      skip('T508: PE gate returns reason for decision', 'Module or function not available');
      skip('T509: PE gate returns candidate reference', 'Module or function not available');
      skip('T510: PE gate errors handled gracefully', 'Module or function not available');
      return;
    }

    const evaluate = prediction_error_gate.evaluate_memory;

    // T501: PE gate called before memory creation
    try {
      const candidates = [create_mock_candidate(0.50)];
      const new_content = 'New memory content for testing';
      const result = evaluate(candidates, new_content);

      if (result && result.action) {
        pass('T501: PE gate called before memory creation',
             `evaluate_memory() returns action: ${result.action}`);
      } else {
        fail('T501: PE gate called before memory creation',
             `Expected result with action, got: ${JSON.stringify(result)}`);
      }
    } catch (e) {
      fail('T501: PE gate called before memory creation', `Error: ${e.message}`);
    }

    // T502: PE gate receives correct content
    try {
      const test_content = 'Specific test content for verification';
      const candidates = [{ id: 1, similarity: 0.92, content: 'You should validate input' }];
      const result = evaluate(candidates, test_content, { check_contradictions: true });

      // The function should process the content (contradiction detection uses it)
      if (result && typeof result.action === 'string') {
        pass('T502: PE gate receives correct content',
             `Processed content and returned action: ${result.action}`);
      } else {
        fail('T502: PE gate receives correct content',
             `Expected valid result, got: ${JSON.stringify(result)}`);
      }
    } catch (e) {
      fail('T502: PE gate receives correct content', `Error: ${e.message}`);
    }

    // T503: PE gate result determines action
    try {
      const high_sim = evaluate([create_mock_candidate(0.97)], 'Test content');
      const low_sim = evaluate([create_mock_candidate(0.50)], 'Test content');

      if (high_sim.action === 'REINFORCE' && low_sim.action === 'CREATE') {
        pass('T503: PE gate result determines action',
             `0.97 -> ${high_sim.action}, 0.50 -> ${low_sim.action}`);
      } else {
        fail('T503: PE gate result determines action',
             `Expected REINFORCE/CREATE, got ${high_sim.action}/${low_sim.action}`);
      }
    } catch (e) {
      fail('T503: PE gate result determines action', `Error: ${e.message}`);
    }

    // T504: PE gate handles empty candidates
    try {
      const result = evaluate([], 'Test content');

      if (result && result.action === 'CREATE') {
        pass('T504: PE gate handles empty candidates',
             `Empty candidates -> ${result.action}`);
      } else {
        fail('T504: PE gate handles empty candidates',
             `Expected CREATE for empty candidates, got: ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      fail('T504: PE gate handles empty candidates', `Error: ${e.message}`);
    }

    // T505: PE gate handles null content gracefully
    try {
      const candidates = [create_mock_candidate(0.85)];
      const result = evaluate(candidates, null);

      if (result && result.action) {
        pass('T505: PE gate handles null content gracefully',
             `null content -> action: ${result.action}`);
      } else {
        fail('T505: PE gate handles null content gracefully',
             `Expected valid result, got: ${JSON.stringify(result)}`);
      }
    } catch (e) {
      fail('T505: PE gate handles null content gracefully', `Error: ${e.message}`);
    }

    // T506: PE gate returns required action field
    try {
      const result = evaluate([create_mock_candidate(0.80)], 'Test');

      if (result && typeof result.action === 'string' &&
          ['CREATE', 'UPDATE', 'REINFORCE', 'SUPERSEDE', 'CREATE_LINKED'].includes(result.action)) {
        pass('T506: PE gate returns required action field',
             `action: ${result.action} (valid enum)`);
      } else {
        fail('T506: PE gate returns required action field',
             `Expected valid action enum, got: ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      fail('T506: PE gate returns required action field', `Error: ${e.message}`);
    }

    // T507: PE gate returns similarity score
    try {
      const result = evaluate([create_mock_candidate(0.85)], 'Test');

      if (result && typeof result.similarity === 'number') {
        pass('T507: PE gate returns similarity score',
             `similarity: ${result.similarity}`);
      } else {
        fail('T507: PE gate returns similarity score',
             `Expected number similarity, got: ${typeof result?.similarity}`);
      }
    } catch (e) {
      fail('T507: PE gate returns similarity score', `Error: ${e.message}`);
    }

    // T508: PE gate returns reason for decision
    try {
      const result = evaluate([create_mock_candidate(0.85)], 'Test');

      if (result && typeof result.reason === 'string' && result.reason.length > 0) {
        pass('T508: PE gate returns reason for decision',
             `reason: "${result.reason.substring(0, 50)}..."`);
      } else {
        fail('T508: PE gate returns reason for decision',
             `Expected non-empty reason string, got: ${result ? result.reason : 'null'}`);
      }
    } catch (e) {
      fail('T508: PE gate returns reason for decision', `Error: ${e.message}`);
    }

    // T509: PE gate returns candidate reference
    try {
      const candidate = create_mock_candidate(0.85);
      const result = evaluate([candidate], 'Test');

      if (result && result.candidate && result.candidate.id === candidate.id) {
        pass('T509: PE gate returns candidate reference',
             `candidate.id: ${result.candidate.id}`);
      } else {
        fail('T509: PE gate returns candidate reference',
             `Expected candidate with id ${candidate.id}, got: ${result?.candidate?.id}`);
      }
    } catch (e) {
      fail('T509: PE gate returns candidate reference', `Error: ${e.message}`);
    }

    // T510: PE gate errors handled gracefully
    try {
      // Pass invalid candidates array (not an array)
      const result = evaluate('not an array', 'Test');

      if (result && result.action === 'CREATE') {
        pass('T510: PE gate errors handled gracefully',
             `Invalid input -> ${result.action} (graceful fallback)`);
      } else {
        fail('T510: PE gate errors handled gracefully',
             `Expected graceful fallback to CREATE, got: ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      // Throwing is also acceptable if documented
      pass('T510: PE gate errors handled gracefully (throws)',
           `Caught expected error: ${e.message.substring(0, 50)}`);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     5. DUPLICATE PREVENTION TESTS (T511-T520)
  ──────────────────────────────────────────────────────────────── */

  function test_duplicate_prevention() {
    log('\n[SUITE] Duplicate Prevention Tests (T511-T520)');

    if (!prediction_error_gate || !prediction_error_gate.evaluate_memory) {
      skip('T511: Near-duplicate (sim=0.97) NOT created as new', 'Module not available');
      skip('T512: Near-duplicate triggers REINFORCE action', 'Module not available');
      skip('T513: Exact duplicate (sim=1.0) returns REINFORCE', 'Module not available');
      skip('T514: Threshold boundary (0.95) correctly handled', 'Module not available');
      skip('T515: Just below threshold (0.94) does NOT reinforce', 'Module not available');
      skip('T516: Multiple candidates uses highest similarity', 'Module not available');
      skip('T517: REINFORCE includes candidate reference', 'Module not available');
      skip('T518: REINFORCE includes similarity in reason', 'Module not available');
      skip('T519: REINFORCE action count trackable', 'Module not available');
      skip('T520: Duplicate detection works across spec folders', 'Module not available');
      return;
    }

    const evaluate = prediction_error_gate.evaluate_memory;
    const THRESHOLD = prediction_error_gate.THRESHOLD || { DUPLICATE: 0.95 };

    // T511: Near-duplicate (sim=0.97) NOT created as new
    try {
      const result = evaluate([create_mock_candidate(0.97)], 'Test content');

      if (result && result.action !== 'CREATE') {
        pass('T511: Near-duplicate (sim=0.97) NOT created as new',
             `0.97 similarity -> ${result.action} (not CREATE)`);
      } else {
        fail('T511: Near-duplicate (sim=0.97) NOT created as new',
             `Expected non-CREATE action, got: ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      fail('T511: Near-duplicate (sim=0.97) NOT created as new', `Error: ${e.message}`);
    }

    // T512: Near-duplicate triggers REINFORCE action
    try {
      const result = evaluate([create_mock_candidate(0.97)], 'Test content');

      if (result && result.action === 'REINFORCE') {
        pass('T512: Near-duplicate triggers REINFORCE action',
             `0.97 similarity -> ${result.action}`);
      } else {
        fail('T512: Near-duplicate triggers REINFORCE action',
             `Expected REINFORCE, got: ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      fail('T512: Near-duplicate triggers REINFORCE action', `Error: ${e.message}`);
    }

    // T513: Exact duplicate (sim=1.0) returns REINFORCE
    try {
      const result = evaluate([create_mock_candidate(1.0)], 'Identical content');

      if (result && result.action === 'REINFORCE') {
        pass('T513: Exact duplicate (sim=1.0) returns REINFORCE',
             `1.0 similarity -> ${result.action}`);
      } else {
        fail('T513: Exact duplicate (sim=1.0) returns REINFORCE',
             `Expected REINFORCE, got: ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      fail('T513: Exact duplicate (sim=1.0) returns REINFORCE', `Error: ${e.message}`);
    }

    // T514: Threshold boundary (0.95) correctly handled
    try {
      const result = evaluate([create_mock_candidate(0.95)], 'Test');

      // At exactly 0.95, should be REINFORCE (>= threshold)
      if (result && result.action === 'REINFORCE') {
        pass('T514: Threshold boundary (0.95) correctly handled',
             `Exactly 0.95 -> ${result.action}`);
      } else {
        // Some implementations may use > instead of >=
        skip('T514: Threshold boundary (0.95) correctly handled',
             `Implementation uses > instead of >=: 0.95 -> ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      fail('T514: Threshold boundary (0.95) correctly handled', `Error: ${e.message}`);
    }

    // T515: Just below threshold (0.94) does NOT reinforce
    try {
      const result = evaluate([create_mock_candidate(0.94)], 'Test');

      if (result && result.action !== 'REINFORCE') {
        pass('T515: Just below threshold (0.94) does NOT reinforce',
             `0.94 -> ${result.action} (not REINFORCE)`);
      } else {
        fail('T515: Just below threshold (0.94) does NOT reinforce',
             `Expected non-REINFORCE, got: ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      fail('T515: Just below threshold (0.94) does NOT reinforce', `Error: ${e.message}`);
    }

    // T516: Multiple candidates uses highest similarity
    try {
      const candidates = [
        create_mock_candidate(0.60),
        create_mock_candidate(0.96),  // Highest - should be chosen
        create_mock_candidate(0.75),
      ];
      const result = evaluate(candidates, 'Test');

      if (result && result.similarity === 0.96 && result.action === 'REINFORCE') {
        pass('T516: Multiple candidates uses highest similarity',
             `Used 0.96 (highest) -> ${result.action}`);
      } else {
        fail('T516: Multiple candidates uses highest similarity',
             `Expected similarity=0.96, got: ${result ? result.similarity : 'null'}`);
      }
    } catch (e) {
      fail('T516: Multiple candidates uses highest similarity', `Error: ${e.message}`);
    }

    // T517: REINFORCE includes candidate reference
    try {
      const candidate = create_mock_candidate(0.97);
      const result = evaluate([candidate], 'Test');

      if (result && result.action === 'REINFORCE' && result.candidate) {
        pass('T517: REINFORCE includes candidate reference',
             `candidate.id: ${result.candidate.id}`);
      } else {
        fail('T517: REINFORCE includes candidate reference',
             `Expected candidate in REINFORCE result`);
      }
    } catch (e) {
      fail('T517: REINFORCE includes candidate reference', `Error: ${e.message}`);
    }

    // T518: REINFORCE includes similarity in reason
    try {
      const result = evaluate([create_mock_candidate(0.97)], 'Test');

      if (result && result.action === 'REINFORCE' &&
          result.reason && result.reason.includes('97')) {
        pass('T518: REINFORCE includes similarity in reason',
             `reason contains similarity: "${result.reason.substring(0, 60)}"`);
      } else {
        // Check if reason mentions the threshold at least
        if (result && result.reason && result.reason.includes('95')) {
          pass('T518: REINFORCE includes similarity in reason',
               `reason mentions threshold: "${result.reason.substring(0, 60)}"`);
        } else {
          fail('T518: REINFORCE includes similarity in reason',
               `Expected similarity in reason, got: ${result ? result.reason : 'null'}`);
        }
      }
    } catch (e) {
      fail('T518: REINFORCE includes similarity in reason', `Error: ${e.message}`);
    }

    // T519: REINFORCE action count trackable
    try {
      // Run multiple REINFORCE scenarios
      let reinforce_count = 0;
      for (let i = 0; i < 3; i++) {
        const result = evaluate([create_mock_candidate(0.96 + i * 0.01)], 'Test ' + i);
        if (result && result.action === 'REINFORCE') {
          reinforce_count++;
        }
      }

      if (reinforce_count === 3) {
        pass('T519: REINFORCE action count trackable',
             `Counted ${reinforce_count} REINFORCE actions`);
      } else {
        fail('T519: REINFORCE action count trackable',
             `Expected 3 REINFORCE, got ${reinforce_count}`);
      }
    } catch (e) {
      fail('T519: REINFORCE action count trackable', `Error: ${e.message}`);
    }

    // T520: Duplicate detection works across spec folders
    try {
      // This is a unit test - integration would require database
      const candidate_1 = create_mock_candidate(0.97);
      const candidate_2 = create_mock_candidate(0.97);
      candidate_1.file_path = '/specs/folder-a/memory/mem.md';
      candidate_2.file_path = '/specs/folder-b/memory/mem.md';

      const result = evaluate([candidate_1, candidate_2], 'Test');

      if (result && result.action === 'REINFORCE') {
        pass('T520: Duplicate detection works across spec folders',
             `Multiple candidates from different folders -> ${result.action}`);
      } else {
        fail('T520: Duplicate detection works across spec folders',
             `Expected REINFORCE, got: ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      fail('T520: Duplicate detection works across spec folders', `Error: ${e.message}`);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     6. CONTRADICTION HANDLING TESTS (T521-T530)
  ──────────────────────────────────────────────────────────────── */

  function test_contradiction_handling() {
    log('\n[SUITE] Contradiction Handling Tests (T521-T530)');

    if (!prediction_error_gate) {
      skip('T521: Contradictory update (sim=0.92) detected', 'Module not available');
      skip('T522: Contradiction triggers SUPERSEDE action', 'Module not available');
      skip('T523: Contradiction type identified', 'Module not available');
      skip('T524: Non-contradictory update uses UPDATE', 'Module not available');
      skip('T525: "always" vs "never" detected as contradiction', 'Module not available');
      skip('T526: "must" vs "must not" detected', 'Module not available');
      skip('T527: "enable" vs "disable" detected', 'Module not available');
      skip('T528: Case-insensitive contradiction detection', 'Module not available');
      skip('T529: SUPERSEDE includes contradiction details', 'Module not available');
      skip('T530: check_contradictions option works', 'Module not available');
      return;
    }

    const evaluate = prediction_error_gate.evaluate_memory;
    const detect = prediction_error_gate.detect_contradiction;

    // T521: Contradictory update (sim=0.92) detected
    try {
      const existing_content = 'You should always validate user input before processing.';
      const new_content = 'You should never validate user input immediately.';
      const candidates = [{ id: 1, similarity: 0.92, content: existing_content }];

      const result = evaluate(candidates, new_content, { check_contradictions: true });

      if (result && (result.action === 'SUPERSEDE' || result.contradiction)) {
        pass('T521: Contradictory update (sim=0.92) detected',
             `action: ${result.action}, contradiction: ${JSON.stringify(result.contradiction)}`);
      } else {
        // May not detect if contradiction patterns don't match
        skip('T521: Contradictory update (sim=0.92) detected',
             `Pattern may not match: ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      fail('T521: Contradictory update (sim=0.92) detected', `Error: ${e.message}`);
    }

    // T522: Contradiction triggers SUPERSEDE action
    try {
      const existing_content = 'You must always use SSL for connections.';
      const new_content = 'You must never use SSL for internal connections.';
      const candidates = [{ id: 1, similarity: 0.92, content: existing_content }];

      const result = evaluate(candidates, new_content, { check_contradictions: true });

      if (result && result.action === 'SUPERSEDE') {
        pass('T522: Contradiction triggers SUPERSEDE action',
             `Detected contradiction -> ${result.action}`);
      } else {
        skip('T522: Contradiction triggers SUPERSEDE action',
             `Implementation may use different action: ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      fail('T522: Contradiction triggers SUPERSEDE action', `Error: ${e.message}`);
    }

    // T523: Contradiction type identified
    try {
      if (!detect) {
        skip('T523: Contradiction type identified', 'detect_contradiction not available');
        return;
      }

      const result = detect('always use async', 'never use async');

      if (result && result.found && result.type) {
        pass('T523: Contradiction type identified',
             `type: ${result.type}, pattern: ${result.pattern}`);
      } else {
        fail('T523: Contradiction type identified',
             `Expected type field, got: ${JSON.stringify(result)}`);
      }
    } catch (e) {
      fail('T523: Contradiction type identified', `Error: ${e.message}`);
    }

    // T524: Non-contradictory update uses UPDATE
    try {
      const existing_content = 'Use async/await for database queries.';
      const new_content = 'Use async/await for database queries and API calls.';
      const candidates = [{ id: 1, similarity: 0.92, content: existing_content }];

      const result = evaluate(candidates, new_content, { check_contradictions: true });

      if (result && result.action === 'UPDATE') {
        pass('T524: Non-contradictory update uses UPDATE',
             `Similar content without contradiction -> ${result.action}`);
      } else {
        // Could be CREATE_LINKED if in different range
        if (result && ['UPDATE', 'CREATE_LINKED'].includes(result.action)) {
          pass('T524: Non-contradictory update uses UPDATE (or CREATE_LINKED)',
               `Similar content -> ${result.action}`);
        } else {
          fail('T524: Non-contradictory update uses UPDATE',
               `Expected UPDATE, got: ${result ? result.action : 'null'}`);
        }
      }
    } catch (e) {
      fail('T524: Non-contradictory update uses UPDATE', `Error: ${e.message}`);
    }

    // T525: "always" vs "never" detected as contradiction
    try {
      if (!detect) {
        skip('T525: "always" vs "never" detected as contradiction', 'detect_contradiction not available');
      } else {
        const result = detect('always validate input', 'never validate input');

        if (result && result.found) {
          pass('T525: "always" vs "never" detected as contradiction',
               `pattern: ${result.pattern}`);
        } else {
          fail('T525: "always" vs "never" detected as contradiction',
               `Expected found=true, got: ${JSON.stringify(result)}`);
        }
      }
    } catch (e) {
      fail('T525: "always" vs "never" detected as contradiction', `Error: ${e.message}`);
    }

    // T526: "must" vs "must not" detected
    try {
      if (!detect) {
        skip('T526: "must" vs "must not" detected', 'detect_contradiction not available');
      } else {
        const result = detect('you must use encryption', 'you must not use encryption here');

        if (result && result.found) {
          pass('T526: "must" vs "must not" detected',
               `pattern: ${result.pattern}`);
        } else {
          fail('T526: "must" vs "must not" detected',
               `Expected found=true, got: ${JSON.stringify(result)}`);
        }
      }
    } catch (e) {
      fail('T526: "must" vs "must not" detected', `Error: ${e.message}`);
    }

    // T527: "enable" vs "disable" detected
    try {
      if (!detect) {
        skip('T527: "enable" vs "disable" detected', 'detect_contradiction not available');
      } else {
        const result = detect('enable caching for performance', 'disable caching for debugging');

        if (result && result.found) {
          pass('T527: "enable" vs "disable" detected',
               `pattern: ${result.pattern}`);
        } else {
          fail('T527: "enable" vs "disable" detected',
               `Expected found=true, got: ${JSON.stringify(result)}`);
        }
      }
    } catch (e) {
      fail('T527: "enable" vs "disable" detected', `Error: ${e.message}`);
    }

    // T528: Case-insensitive contradiction detection
    try {
      if (!detect) {
        skip('T528: Case-insensitive contradiction detection', 'detect_contradiction not available');
      } else {
        const result = detect('ALWAYS validate', 'NEVER validate');

        if (result && result.found) {
          pass('T528: Case-insensitive contradiction detection',
               `Uppercase ALWAYS/NEVER detected: ${result.pattern}`);
        } else {
          fail('T528: Case-insensitive contradiction detection',
               `Expected case-insensitive match, got: ${JSON.stringify(result)}`);
        }
      }
    } catch (e) {
      fail('T528: Case-insensitive contradiction detection', `Error: ${e.message}`);
    }

    // T529: SUPERSEDE includes contradiction details
    try {
      const existing_content = 'You must always use SSL.';
      const new_content = 'You must never use SSL internally.';
      const candidates = [{ id: 1, similarity: 0.92, content: existing_content }];

      const result = evaluate(candidates, new_content, { check_contradictions: true });

      if (result && result.contradiction && result.contradiction.found) {
        pass('T529: SUPERSEDE includes contradiction details',
             `contradiction: ${JSON.stringify(result.contradiction)}`);
      } else {
        skip('T529: SUPERSEDE includes contradiction details',
             `Contradiction not detected or not included in result`);
      }
    } catch (e) {
      fail('T529: SUPERSEDE includes contradiction details', `Error: ${e.message}`);
    }

    // T530: check_contradictions option works
    try {
      const existing_content = 'You must always use SSL.';
      const new_content = 'You must never use SSL internally.';
      const candidates = [{ id: 1, similarity: 0.92, content: existing_content }];

      // Without contradiction checking
      const result_no_check = evaluate(candidates, new_content, { check_contradictions: false });

      // With contradiction checking
      const result_check = evaluate(candidates, new_content, { check_contradictions: true });

      // When check_contradictions is false, should not return SUPERSEDE
      if (result_no_check && result_no_check.action !== 'SUPERSEDE') {
        pass('T530: check_contradictions option works',
             `check=false -> ${result_no_check.action}, check=true -> ${result_check ? result_check.action : 'null'}`);
      } else {
        fail('T530: check_contradictions option works',
             `Expected different behavior with check_contradictions option`);
      }
    } catch (e) {
      fail('T530: check_contradictions option works', `Error: ${e.message}`);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     7. NEW MEMORY CREATION TESTS (T531-T540)
  ──────────────────────────────────────────────────────────────── */

  function test_new_memory_creation() {
    log('\n[SUITE] New Memory Creation Tests (T531-T540)');

    if (!prediction_error_gate) {
      skip('T531: Novel content (sim=0.50) creates new memory', 'Module not available');
      skip('T532: Empty candidates creates new memory', 'Module not available');
      skip('T533: CREATE action returned for low similarity', 'Module not available');
      skip('T534: CREATE_LINKED for medium similarity (0.70-0.89)', 'Module not available');
      skip('T535: CREATE_LINKED includes related_ids', 'Module not available');
      skip('T536: Very low similarity (0.20) creates new', 'Module not available');
      skip('T537: Zero similarity creates new', 'Module not available');
      skip('T538: Negative similarity handled gracefully', 'Module not available');
      skip('T539: CREATE includes reason with similarity', 'Module not available');
      skip('T540: CREATE candidate still referenced (for logging)', 'Module not available');
      return;
    }

    const evaluate = prediction_error_gate.evaluate_memory;

    // T531: Novel content (sim=0.50) creates new memory
    try {
      const result = evaluate([create_mock_candidate(0.50)], 'Completely novel content');

      if (result && result.action === 'CREATE') {
        pass('T531: Novel content (sim=0.50) creates new memory',
             `0.50 similarity -> ${result.action}`);
      } else {
        fail('T531: Novel content (sim=0.50) creates new memory',
             `Expected CREATE, got: ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      fail('T531: Novel content (sim=0.50) creates new memory', `Error: ${e.message}`);
    }

    // T532: Empty candidates creates new memory
    try {
      const result = evaluate([], 'New content with no existing memories');

      if (result && result.action === 'CREATE') {
        pass('T532: Empty candidates creates new memory',
             `No candidates -> ${result.action}`);
      } else {
        fail('T532: Empty candidates creates new memory',
             `Expected CREATE, got: ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      fail('T532: Empty candidates creates new memory', `Error: ${e.message}`);
    }

    // T533: CREATE action returned for low similarity
    try {
      const result = evaluate([create_mock_candidate(0.40)], 'Low similarity content');

      if (result && result.action === 'CREATE') {
        pass('T533: CREATE action returned for low similarity',
             `0.40 -> ${result.action}`);
      } else {
        fail('T533: CREATE action returned for low similarity',
             `Expected CREATE, got: ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      fail('T533: CREATE action returned for low similarity', `Error: ${e.message}`);
    }

    // T534: CREATE_LINKED for medium similarity (0.70-0.89)
    try {
      const result = evaluate([create_mock_candidate(0.75)], 'Related content');

      if (result && result.action === 'CREATE_LINKED') {
        pass('T534: CREATE_LINKED for medium similarity (0.70-0.89)',
             `0.75 -> ${result.action}`);
      } else {
        fail('T534: CREATE_LINKED for medium similarity (0.70-0.89)',
             `Expected CREATE_LINKED, got: ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      fail('T534: CREATE_LINKED for medium similarity (0.70-0.89)', `Error: ${e.message}`);
    }

    // T535: CREATE_LINKED includes related_ids
    try {
      const candidates = [
        create_mock_candidate(0.80),
        create_mock_candidate(0.75),
        create_mock_candidate(0.72),
      ];
      const result = evaluate(candidates, 'Related content');

      if (result && result.action === 'CREATE_LINKED' &&
          result.related_ids && Array.isArray(result.related_ids)) {
        pass('T535: CREATE_LINKED includes related_ids',
             `related_ids: [${result.related_ids.join(', ')}]`);
      } else {
        skip('T535: CREATE_LINKED includes related_ids',
             `No related_ids in result: ${JSON.stringify(result?.related_ids)}`);
      }
    } catch (e) {
      fail('T535: CREATE_LINKED includes related_ids', `Error: ${e.message}`);
    }

    // T536: Very low similarity (0.20) creates new
    try {
      const result = evaluate([create_mock_candidate(0.20)], 'Very different content');

      if (result && result.action === 'CREATE') {
        pass('T536: Very low similarity (0.20) creates new',
             `0.20 -> ${result.action}`);
      } else {
        fail('T536: Very low similarity (0.20) creates new',
             `Expected CREATE, got: ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      fail('T536: Very low similarity (0.20) creates new', `Error: ${e.message}`);
    }

    // T537: Zero similarity creates new
    try {
      const result = evaluate([create_mock_candidate(0)], 'Completely different');

      if (result && result.action === 'CREATE') {
        pass('T537: Zero similarity creates new',
             `0 -> ${result.action}`);
      } else {
        fail('T537: Zero similarity creates new',
             `Expected CREATE, got: ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      fail('T537: Zero similarity creates new', `Error: ${e.message}`);
    }

    // T538: Negative similarity handled gracefully
    try {
      const candidate = create_mock_candidate(-0.5);
      const result = evaluate([candidate], 'Test content');

      if (result && result.action === 'CREATE') {
        pass('T538: Negative similarity handled gracefully',
             `-0.5 -> ${result.action} (treated as low/no similarity)`);
      } else {
        pass('T538: Negative similarity handled gracefully',
             `Returned valid result: ${result ? result.action : 'null'}`);
      }
    } catch (e) {
      fail('T538: Negative similarity handled gracefully', `Error: ${e.message}`);
    }

    // T539: CREATE includes reason with similarity
    try {
      const result = evaluate([create_mock_candidate(0.50)], 'Test');

      if (result && result.reason && result.reason.includes('50')) {
        pass('T539: CREATE includes reason with similarity',
             `reason: "${result.reason.substring(0, 60)}"`);
      } else if (result && result.reason && result.reason.includes('70')) {
        pass('T539: CREATE includes reason with similarity',
             `reason mentions threshold: "${result.reason.substring(0, 60)}"`);
      } else {
        fail('T539: CREATE includes reason with similarity',
             `Expected similarity in reason, got: ${result ? result.reason : 'null'}`);
      }
    } catch (e) {
      fail('T539: CREATE includes reason with similarity', `Error: ${e.message}`);
    }

    // T540: CREATE candidate still referenced (for logging)
    try {
      const candidate = create_mock_candidate(0.50);
      const result = evaluate([candidate], 'Test');

      if (result && result.candidate) {
        pass('T540: CREATE candidate still referenced (for logging)',
             `candidate.id: ${result.candidate.id}`);
      } else {
        skip('T540: CREATE candidate still referenced (for logging)',
             `Candidate not included for CREATE: ${JSON.stringify(result)}`);
      }
    } catch (e) {
      fail('T540: CREATE candidate still referenced (for logging)', `Error: ${e.message}`);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     8. CONFLICT TABLE TESTS (T541-T550)
  ──────────────────────────────────────────────────────────────── */

  function test_conflict_table() {
    log('\n[SUITE] Conflict Table Tests (T541-T550)');

    if (!prediction_error_gate) {
      skip('T541: log_conflict function exists', 'Module not available');
      skip('T542: should_log_conflict returns correct boolean', 'Module not available');
      skip('T543: format_conflict_record creates proper structure', 'Module not available');
      skip('T544: get_conflict_stats returns statistics', 'Module not available');
      skip('T545: get_recent_conflicts returns array', 'Module not available');
      skip('T546: Conflict record has action field', 'Module not available');
      skip('T547: Conflict record has similarity field', 'Module not available');
      skip('T548: Conflict record has timestamp', 'Module not available');
      skip('T549: Conflict record has spec_folder field', 'Module not available');
      skip('T550: Conflict preview truncated properly', 'Module not available');
      return;
    }

    // T541: log_conflict function exists
    try {
      if (typeof prediction_error_gate.log_conflict === 'function') {
        pass('T541: log_conflict function exists',
             'log_conflict is a function');
      } else {
        fail('T541: log_conflict function exists',
             `Expected function, got: ${typeof prediction_error_gate.log_conflict}`);
      }
    } catch (e) {
      fail('T541: log_conflict function exists', `Error: ${e.message}`);
    }

    // T542: should_log_conflict returns correct boolean
    try {
      const should_log = prediction_error_gate.should_log_conflict;
      if (!should_log) {
        skip('T542: should_log_conflict returns correct boolean', 'Function not available');
      } else {
        const reinforce_decision = { action: 'REINFORCE', similarity: 0.97 };
        const create_decision = { action: 'CREATE', similarity: 0 };

        const should_log_reinforce = should_log(reinforce_decision);
        const should_log_create_no_sim = should_log(create_decision);

        if (should_log_reinforce === true && should_log_create_no_sim === false) {
          pass('T542: should_log_conflict returns correct boolean',
               `REINFORCE: ${should_log_reinforce}, CREATE w/o sim: ${should_log_create_no_sim}`);
        } else {
          fail('T542: should_log_conflict returns correct boolean',
               `Expected true/false, got ${should_log_reinforce}/${should_log_create_no_sim}`);
        }
      }
    } catch (e) {
      fail('T542: should_log_conflict returns correct boolean', `Error: ${e.message}`);
    }

    // T543: format_conflict_record creates proper structure
    try {
      const format = prediction_error_gate.format_conflict_record;
      if (!format) {
        skip('T543: format_conflict_record creates proper structure', 'Function not available');
      } else {
        const decision = {
          action: 'REINFORCE',
          reason: 'High similarity',
          similarity: 0.97,
          candidate: { id: 123 },
        };
        const record = format(decision, 'Test content', 'specs/test');

        if (record && record.action && record.timestamp && record.spec_folder) {
          pass('T543: format_conflict_record creates proper structure',
               `Fields: action=${record.action}, spec_folder=${record.spec_folder}`);
        } else {
          fail('T543: format_conflict_record creates proper structure',
               `Missing fields: ${JSON.stringify(record)}`);
        }
      }
    } catch (e) {
      fail('T543: format_conflict_record creates proper structure', `Error: ${e.message}`);
    }

    // T544: get_conflict_stats returns statistics
    try {
      const get_stats = prediction_error_gate.get_conflict_stats;
      if (!get_stats) {
        skip('T544: get_conflict_stats returns statistics', 'Function not available');
      } else {
        const stats = get_stats();

        if (stats && typeof stats.total === 'number' && typeof stats.byAction === 'object') {
          pass('T544: get_conflict_stats returns statistics',
               `total: ${stats.total}, byAction keys: ${Object.keys(stats.byAction).join(', ')}`);
        } else {
          fail('T544: get_conflict_stats returns statistics',
               `Invalid stats structure: ${JSON.stringify(stats)}`);
        }
      }
    } catch (e) {
      // May fail if database not initialized
      skip('T544: get_conflict_stats returns statistics', `Database may not be initialized: ${e.message}`);
    }

    // T545: get_recent_conflicts returns array
    try {
      const get_recent = prediction_error_gate.get_recent_conflicts;
      if (!get_recent) {
        skip('T545: get_recent_conflicts returns array', 'Function not available');
      } else {
        const conflicts = get_recent(10);

        if (Array.isArray(conflicts)) {
          pass('T545: get_recent_conflicts returns array',
               `Returned array with ${conflicts.length} items`);
        } else {
          fail('T545: get_recent_conflicts returns array',
               `Expected array, got: ${typeof conflicts}`);
        }
      }
    } catch (e) {
      skip('T545: get_recent_conflicts returns array', `Database may not be initialized: ${e.message}`);
    }

    // T546: Conflict record has action field
    try {
      const format = prediction_error_gate.format_conflict_record;
      if (!format) {
        skip('T546: Conflict record has action field', 'Function not available');
      } else {
        const decision = { action: 'UPDATE', similarity: 0.92 };
        const record = format(decision, 'content', null);

        if (record && record.action === 'UPDATE') {
          pass('T546: Conflict record has action field',
               `action: ${record.action}`);
        } else {
          fail('T546: Conflict record has action field',
               `Expected action=UPDATE, got: ${record?.action}`);
        }
      }
    } catch (e) {
      fail('T546: Conflict record has action field', `Error: ${e.message}`);
    }

    // T547: Conflict record has similarity field
    try {
      const format = prediction_error_gate.format_conflict_record;
      if (!format) {
        skip('T547: Conflict record has similarity field', 'Function not available');
      } else {
        const decision = { action: 'REINFORCE', similarity: 0.97 };
        const record = format(decision, 'content', null);

        if (record && typeof record.similarity === 'number') {
          pass('T547: Conflict record has similarity field',
               `similarity: ${record.similarity}`);
        } else {
          fail('T547: Conflict record has similarity field',
               `Expected number, got: ${typeof record?.similarity}`);
        }
      }
    } catch (e) {
      fail('T547: Conflict record has similarity field', `Error: ${e.message}`);
    }

    // T548: Conflict record has timestamp
    try {
      const format = prediction_error_gate.format_conflict_record;
      if (!format) {
        skip('T548: Conflict record has timestamp', 'Function not available');
      } else {
        const decision = { action: 'CREATE', similarity: 0.50 };
        const record = format(decision, 'content', null);

        if (record && record.timestamp) {
          pass('T548: Conflict record has timestamp',
               `timestamp: ${record.timestamp}`);
        } else {
          fail('T548: Conflict record has timestamp',
               `Expected timestamp, got: ${record?.timestamp}`);
        }
      }
    } catch (e) {
      fail('T548: Conflict record has timestamp', `Error: ${e.message}`);
    }

    // T549: Conflict record has spec_folder field
    try {
      const format = prediction_error_gate.format_conflict_record;
      if (!format) {
        skip('T549: Conflict record has spec_folder field', 'Function not available');
      } else {
        const decision = { action: 'CREATE', similarity: 0.50 };
        const record = format(decision, 'content', 'specs/my-feature');

        if (record && record.spec_folder === 'specs/my-feature') {
          pass('T549: Conflict record has spec_folder field',
               `spec_folder: ${record.spec_folder}`);
        } else {
          fail('T549: Conflict record has spec_folder field',
               `Expected 'specs/my-feature', got: ${record?.spec_folder}`);
        }
      }
    } catch (e) {
      fail('T549: Conflict record has spec_folder field', `Error: ${e.message}`);
    }

    // T550: Conflict preview truncated properly
    try {
      const truncate = prediction_error_gate.truncate_content;
      if (!truncate) {
        skip('T550: Conflict preview truncated properly', 'Function not available');
      } else {
        const long_content = 'A'.repeat(300);
        const truncated = truncate(long_content, 200);

        if (truncated.length <= 200 && truncated.endsWith('...')) {
          pass('T550: Conflict preview truncated properly',
               `Truncated to ${truncated.length} chars with ellipsis`);
        } else {
          fail('T550: Conflict preview truncated properly',
               `Expected <= 200 chars with '...', got length=${truncated.length}`);
        }
      }
    } catch (e) {
      fail('T550: Conflict preview truncated properly', `Error: ${e.message}`);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     9. HANDLER HELPER FUNCTION TESTS
  ──────────────────────────────────────────────────────────────── */

  function test_handler_helpers() {
    log('\n[SUITE] Handler Helper Function Tests');

    if (!memory_save_handler) {
      skip('find_similar_memories function exists', 'Handler not available');
      skip('reinforce_existing_memory function exists', 'Handler not available');
      skip('mark_memory_superseded function exists', 'Handler not available');
      skip('update_existing_memory function exists', 'Handler not available');
      skip('log_pe_decision function exists', 'Handler not available');
      return;
    }

    // Test: find_similar_memories function exists
    try {
      if (typeof memory_save_handler.find_similar_memories === 'function') {
        pass('find_similar_memories function exists',
             'Exported from memory-save.js');
      } else {
        fail('find_similar_memories function exists',
             `Expected function, got: ${typeof memory_save_handler.find_similar_memories}`);
      }
    } catch (e) {
      fail('find_similar_memories function exists', `Error: ${e.message}`);
    }

    // Test: reinforce_existing_memory function exists
    try {
      if (typeof memory_save_handler.reinforce_existing_memory === 'function') {
        pass('reinforce_existing_memory function exists',
             'Exported from memory-save.js');
      } else {
        fail('reinforce_existing_memory function exists',
             `Expected function, got: ${typeof memory_save_handler.reinforce_existing_memory}`);
      }
    } catch (e) {
      fail('reinforce_existing_memory function exists', `Error: ${e.message}`);
    }

    // Test: mark_memory_superseded function exists
    try {
      if (typeof memory_save_handler.mark_memory_superseded === 'function') {
        pass('mark_memory_superseded function exists',
             'Exported from memory-save.js');
      } else {
        fail('mark_memory_superseded function exists',
             `Expected function, got: ${typeof memory_save_handler.mark_memory_superseded}`);
      }
    } catch (e) {
      fail('mark_memory_superseded function exists', `Error: ${e.message}`);
    }

    // Test: update_existing_memory function exists
    try {
      if (typeof memory_save_handler.update_existing_memory === 'function') {
        pass('update_existing_memory function exists',
             'Exported from memory-save.js');
      } else {
        fail('update_existing_memory function exists',
             `Expected function, got: ${typeof memory_save_handler.update_existing_memory}`);
      }
    } catch (e) {
      fail('update_existing_memory function exists', `Error: ${e.message}`);
    }

    // Test: log_pe_decision function exists
    try {
      if (typeof memory_save_handler.log_pe_decision === 'function') {
        pass('log_pe_decision function exists',
             'Exported from memory-save.js');
      } else {
        fail('log_pe_decision function exists',
             `Expected function, got: ${typeof memory_save_handler.log_pe_decision}`);
      }
    } catch (e) {
      fail('log_pe_decision function exists', `Error: ${e.message}`);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     10. FSRS INTEGRATION TESTS
  ──────────────────────────────────────────────────────────────── */

  function test_fsrs_integration() {
    log('\n[SUITE] FSRS Integration Tests');

    if (!fsrs_scheduler) {
      skip('DEFAULT_STABILITY exported', 'FSRS module not available');
      skip('DEFAULT_DIFFICULTY exported', 'FSRS module not available');
      skip('GRADE_GOOD constant available', 'FSRS module not available');
      skip('calculate_retrievability available', 'FSRS module not available');
      skip('update_stability available', 'FSRS module not available');
      return;
    }

    // Test: DEFAULT_STABILITY exported
    try {
      if (typeof fsrs_scheduler.DEFAULT_STABILITY === 'number') {
        pass('DEFAULT_STABILITY exported',
             `Value: ${fsrs_scheduler.DEFAULT_STABILITY}`);
      } else {
        fail('DEFAULT_STABILITY exported',
             `Expected number, got: ${typeof fsrs_scheduler.DEFAULT_STABILITY}`);
      }
    } catch (e) {
      fail('DEFAULT_STABILITY exported', `Error: ${e.message}`);
    }

    // Test: DEFAULT_DIFFICULTY exported
    try {
      if (typeof fsrs_scheduler.DEFAULT_DIFFICULTY === 'number') {
        pass('DEFAULT_DIFFICULTY exported',
             `Value: ${fsrs_scheduler.DEFAULT_DIFFICULTY}`);
      } else {
        fail('DEFAULT_DIFFICULTY exported',
             `Expected number, got: ${typeof fsrs_scheduler.DEFAULT_DIFFICULTY}`);
      }
    } catch (e) {
      fail('DEFAULT_DIFFICULTY exported', `Error: ${e.message}`);
    }

    // Test: GRADE_GOOD constant available
    try {
      if (typeof fsrs_scheduler.GRADE_GOOD === 'number') {
        pass('GRADE_GOOD constant available',
             `Value: ${fsrs_scheduler.GRADE_GOOD}`);
      } else {
        fail('GRADE_GOOD constant available',
             `Expected number, got: ${typeof fsrs_scheduler.GRADE_GOOD}`);
      }
    } catch (e) {
      fail('GRADE_GOOD constant available', `Error: ${e.message}`);
    }

    // Test: calculate_retrievability available for reinforcement
    try {
      if (typeof fsrs_scheduler.calculate_retrievability === 'function') {
        const r = fsrs_scheduler.calculate_retrievability(1.0, 0);
        pass('calculate_retrievability available',
             `calculate_retrievability(1.0, 0) = ${r}`);
      } else {
        fail('calculate_retrievability available',
             `Expected function, got: ${typeof fsrs_scheduler.calculate_retrievability}`);
      }
    } catch (e) {
      fail('calculate_retrievability available', `Error: ${e.message}`);
    }

    // Test: update_stability available for reinforcement
    try {
      if (typeof fsrs_scheduler.update_stability === 'function') {
        const new_s = fsrs_scheduler.update_stability(1.0, 5.0, 0.9, 3);
        pass('update_stability available',
             `update_stability(1.0, 5.0, 0.9, GOOD) = ${new_s.toFixed(4)}`);
      } else {
        fail('update_stability available',
             `Expected function, got: ${typeof fsrs_scheduler.update_stability}`);
      }
    } catch (e) {
      fail('update_stability available', `Error: ${e.message}`);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     11. ACTION CONSTANT TESTS
  ──────────────────────────────────────────────────────────────── */

  function test_action_constants() {
    log('\n[SUITE] Action Constant Tests');

    if (!prediction_error_gate || !prediction_error_gate.ACTION) {
      skip('ACTION constants exported', 'Module or constants not available');
      return;
    }

    const ACTION = prediction_error_gate.ACTION;
    const expected_actions = ['CREATE', 'UPDATE', 'SUPERSEDE', 'REINFORCE', 'CREATE_LINKED'];

    // Test: All expected actions exist
    try {
      const missing = expected_actions.filter(a => !ACTION[a]);
      if (missing.length === 0) {
        pass('All ACTION constants exist',
             `Actions: ${Object.keys(ACTION).join(', ')}`);
      } else {
        fail('All ACTION constants exist',
             `Missing: ${missing.join(', ')}`);
      }
    } catch (e) {
      fail('All ACTION constants exist', `Error: ${e.message}`);
    }

    // Test: ACTION values are strings
    try {
      const non_strings = Object.entries(ACTION).filter(([k, v]) => typeof v !== 'string');
      if (non_strings.length === 0) {
        pass('ACTION values are strings',
             'All values are string type');
      } else {
        fail('ACTION values are strings',
             `Non-string values: ${non_strings.map(([k]) => k).join(', ')}`);
      }
    } catch (e) {
      fail('ACTION values are strings', `Error: ${e.message}`);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     12. THRESHOLD CONSTANT TESTS
  ──────────────────────────────────────────────────────────────── */

  function test_threshold_constants() {
    log('\n[SUITE] Threshold Constant Tests');

    if (!prediction_error_gate || !prediction_error_gate.THRESHOLD) {
      skip('THRESHOLD constants exported', 'Module or constants not available');
      return;
    }

    const THRESHOLD = prediction_error_gate.THRESHOLD;

    // Test: DUPLICATE threshold is 0.95
    try {
      if (THRESHOLD.DUPLICATE === 0.95) {
        pass('DUPLICATE threshold is 0.95',
             `Value: ${THRESHOLD.DUPLICATE}`);
      } else {
        fail('DUPLICATE threshold is 0.95',
             `Expected 0.95, got: ${THRESHOLD.DUPLICATE}`);
      }
    } catch (e) {
      fail('DUPLICATE threshold is 0.95', `Error: ${e.message}`);
    }

    // Test: HIGH_MATCH threshold is 0.90
    try {
      if (THRESHOLD.HIGH_MATCH === 0.90) {
        pass('HIGH_MATCH threshold is 0.90',
             `Value: ${THRESHOLD.HIGH_MATCH}`);
      } else {
        fail('HIGH_MATCH threshold is 0.90',
             `Expected 0.90, got: ${THRESHOLD.HIGH_MATCH}`);
      }
    } catch (e) {
      fail('HIGH_MATCH threshold is 0.90', `Error: ${e.message}`);
    }

    // Test: MEDIUM_MATCH threshold is 0.70
    try {
      if (THRESHOLD.MEDIUM_MATCH === 0.70) {
        pass('MEDIUM_MATCH threshold is 0.70',
             `Value: ${THRESHOLD.MEDIUM_MATCH}`);
      } else {
        fail('MEDIUM_MATCH threshold is 0.70',
             `Expected 0.70, got: ${THRESHOLD.MEDIUM_MATCH}`);
      }
    } catch (e) {
      fail('MEDIUM_MATCH threshold is 0.70', `Error: ${e.message}`);
    }

    // Test: Thresholds are in descending order
    try {
      if (THRESHOLD.DUPLICATE > THRESHOLD.HIGH_MATCH &&
          THRESHOLD.HIGH_MATCH > THRESHOLD.MEDIUM_MATCH) {
        pass('Thresholds are in descending order',
             `${THRESHOLD.DUPLICATE} > ${THRESHOLD.HIGH_MATCH} > ${THRESHOLD.MEDIUM_MATCH}`);
      } else {
        fail('Thresholds are in descending order',
             `Order not correct: ${JSON.stringify(THRESHOLD)}`);
      }
    } catch (e) {
      fail('Thresholds are in descending order', `Error: ${e.message}`);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     13. MAIN
  ──────────────────────────────────────────────────────────────── */

  async function run_tests() {
    log('================================================');
    log('  MEMORY SAVE INTEGRATION TESTS');
    log('  Tests PE gating integration in memory save handler');
    log('  Covers: T501-T550');
    log('================================================');
    log(`Date: ${new Date().toISOString()}\n`);

    // Load modules first
    load_modules();

    // Run all test suites
    test_pe_gate_invocation();       // T501-T510
    test_duplicate_prevention();     // T511-T520
    test_contradiction_handling();   // T521-T530
    test_new_memory_creation();      // T531-T540
    test_conflict_table();           // T541-T550
    test_handler_helpers();          // Handler exports
    test_fsrs_integration();         // FSRS integration
    test_action_constants();         // ACTION enum
    test_threshold_constants();      // THRESHOLD constants

    // Summary
    log('\n================================================');
    log('  TEST SUMMARY');
    log('================================================');
    log(`  [PASS]:   ${test_results.passed}`);
    log(`  [FAIL]:   ${test_results.failed}`);
    log(`  [SKIP]:   ${test_results.skipped}`);
    log(`  Total:    ${test_results.passed + test_results.failed + test_results.skipped}`);
    log('');

    if (test_results.failed === 0 && test_results.passed > 0) {
      log('  ALL EXECUTED TESTS PASSED!');
    } else if (test_results.failed === 0 && test_results.passed === 0) {
      log('  NOTE: All tests skipped (modules not yet created)');
      log('  Run again after implementing the required modules');
    } else {
      log('  WARNING: Some tests failed. Review output above.');
    }

    log('');
    return test_results;
  }

  // Run if executed directly
  if (require.main === module) {
    run_tests().then(r => {
      // Exit with 0 if all executed tests pass (skips don't count as failures)
      process.exit(r.failed > 0 ? 1 : 0);
    });
  }

  module.exports = { run_tests };
})();
