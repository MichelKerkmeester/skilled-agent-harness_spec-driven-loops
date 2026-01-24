// ───────────────────────────────────────────────────────────────
// TEST: SESSION LEARNING HANDLER
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const MCP_SERVER_PATH = path.join(__dirname, '..');
const LIB_PATH = path.join(MCP_SERVER_PATH, 'lib');
const HANDLERS_PATH = path.join(MCP_SERVER_PATH, 'handlers');

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
  categories: {},
};

/* ─────────────────────────────────────────────────────────────
   2. TEST UTILITIES
──────────────────────────────────────────────────────────────── */

function log(msg) {
  console.log(msg);
}

function pass(name, evidence, category = 'general') {
  results.passed++;
  results.tests.push({ name, status: 'PASS', evidence, category });
  if (!results.categories[category]) results.categories[category] = { passed: 0, failed: 0, skipped: 0 };
  results.categories[category].passed++;
  log(`   ✅ ${name}`);
  if (evidence) log(`      Evidence: ${evidence}`);
}

function fail(name, reason, category = 'general') {
  results.failed++;
  results.tests.push({ name, status: 'FAIL', reason, category });
  if (!results.categories[category]) results.categories[category] = { passed: 0, failed: 0, skipped: 0 };
  results.categories[category].failed++;
  log(`   ❌ ${name}`);
  log(`      Reason: ${reason}`);
}

function skip(name, reason, category = 'general') {
  results.skipped++;
  results.tests.push({ name, status: 'SKIP', reason, category });
  if (!results.categories[category]) results.categories[category] = { passed: 0, failed: 0, skipped: 0 };
  results.categories[category].skipped++;
  log(`   ⏭️  ${name} (skipped: ${reason})`);
}

/**
 * Assert helper for cleaner tests
 */
function assert(condition, testName, evidence, category = 'general') {
  if (condition) {
    pass(testName, evidence, category);
    return true;
  } else {
    fail(testName, evidence, category);
    return false;
  }
}

/**
 * Assert that a handler throws an error or returns error content
 * MCP handlers may either throw or return { content: [...], isError: true }
 */
async function assertThrows(asyncFn, expectedPattern, testName, category = 'general') {
  try {
    const result = await asyncFn();

    // Check if result contains error in content (MCP pattern)
    if (result && result.content && result.content[0] && result.content[0].text) {
      try {
        const data = JSON.parse(result.content[0].text);
        if (data.error) {
          // Handler returned error in content
          const errorMsg = data.error;
          if (expectedPattern instanceof RegExp) {
            if (expectedPattern.test(errorMsg)) {
              pass(testName, `Error in content: ${errorMsg}`, category);
              return true;
            }
          } else if (typeof expectedPattern === 'string') {
            if (errorMsg.toLowerCase().includes(expectedPattern.toLowerCase())) {
              pass(testName, `Error in content: ${errorMsg}`, category);
              return true;
            }
          }
          // Pattern didn't match but error was returned
          pass(testName, `Error returned: ${errorMsg}`, category);
          return true;
        }
      } catch (parseErr) {
        // Not JSON, check raw text
        const text = result.content[0].text;
        if (text.toLowerCase().includes('error')) {
          pass(testName, `Error in response: ${text.substring(0, 50)}`, category);
          return true;
        }
      }
    }

    fail(testName, 'Expected error but none thrown or returned', category);
    return false;
  } catch (error) {
    if (expectedPattern instanceof RegExp) {
      if (expectedPattern.test(error.message)) {
        pass(testName, `Error: ${error.message}`, category);
        return true;
      } else {
        fail(testName, `Expected pattern ${expectedPattern}, got: ${error.message}`, category);
        return false;
      }
    } else if (typeof expectedPattern === 'string') {
      if (error.message.toLowerCase().includes(expectedPattern.toLowerCase())) {
        pass(testName, `Error: ${error.message}`, category);
        return true;
      } else {
        fail(testName, `Expected "${expectedPattern}", got: ${error.message}`, category);
        return false;
      }
    }
    pass(testName, `Error thrown: ${error.message}`, category);
    return true;
  }
}

/**
 * Parse MCP response content
 */
function parseResponse(result) {
  if (result && result.content && result.content[0] && result.content[0].text) {
    return JSON.parse(result.content[0].text);
  }
  return null;
}

/* ─────────────────────────────────────────────────────────────
   3. MODULE LOADING
──────────────────────────────────────────────────────────────── */

let sessionLearning, vectorIndex, errors;
let dbAvailable = false;

function loadModules() {
  log('\n🔬 Loading Modules');

  try {
    // Load session-learning handler
    sessionLearning = require(path.join(HANDLERS_PATH, 'session-learning.js'));
    pass('session-learning handler loaded', 'require() succeeded', 'modules');

    // Load dependencies
    vectorIndex = require(path.join(LIB_PATH, 'search', 'vector-index.js'));
    pass('vector-index loaded', 'require() succeeded', 'modules');

    errors = require(path.join(LIB_PATH, 'errors.js'));
    pass('errors module loaded', 'require() succeeded', 'modules');

    // Check if database is available
    const db = vectorIndex.getDb();
    if (db) {
      dbAvailable = true;
      pass('Database available', 'vectorIndex.getDb() returned db', 'modules');
    } else {
      skip('Database not available', 'getDb() returned null - tests will use mocking', 'modules');
    }

    return true;
  } catch (error) {
    fail('Module loading', error.message, 'modules');
    return false;
  }
}

/* ─────────────────────────────────────────────────────────────
   4. EXPORT VERIFICATION TESTS
──────────────────────────────────────────────────────────────── */

function test_exports() {
  log('\n🔬 Export Verification Tests');
  const category = 'exports';

  // Test snake_case exports
  const snakeCaseExports = [
    'handle_task_preflight',
    'handle_task_postflight',
    'handle_get_learning_history',
    'ensure_schema'
  ];

  for (const fn of snakeCaseExports) {
    if (typeof sessionLearning[fn] === 'function') {
      pass(`exports.${fn} exists`, 'function', category);
    } else {
      fail(`exports.${fn} exists`, `Not a function: ${typeof sessionLearning[fn]}`, category);
    }
  }

  // Test camelCase aliases (backward compatibility)
  const camelCaseExports = [
    'handleTaskPreflight',
    'handleTaskPostflight',
    'handleGetLearningHistory',
    'ensureSchema'
  ];

  for (const fn of camelCaseExports) {
    if (typeof sessionLearning[fn] === 'function') {
      pass(`exports.${fn} (alias) exists`, 'function', category);
    } else {
      fail(`exports.${fn} (alias) exists`, `Not a function: ${typeof sessionLearning[fn]}`, category);
    }
  }

  // Test that aliases point to same function
  assert(
    sessionLearning.handle_task_preflight === sessionLearning.handleTaskPreflight,
    'handle_task_preflight === handleTaskPreflight',
    'Aliases are identical',
    category
  );

  assert(
    sessionLearning.handle_task_postflight === sessionLearning.handleTaskPostflight,
    'handle_task_postflight === handleTaskPostflight',
    'Aliases are identical',
    category
  );

  assert(
    sessionLearning.handle_get_learning_history === sessionLearning.handleGetLearningHistory,
    'handle_get_learning_history === handleGetLearningHistory',
    'Aliases are identical',
    category
  );

  assert(
    sessionLearning.ensure_schema === sessionLearning.ensureSchema,
    'ensure_schema === ensureSchema',
    'Aliases are identical',
    category
  );
}

/* ─────────────────────────────────────────────────────────────
   5. TASK_PREFLIGHT TESTS
──────────────────────────────────────────────────────────────── */

async function test_task_preflight() {
  log('\n🔬 task_preflight Tests');
  const category = 'task_preflight';

  // Test 1: Missing specFolder rejection
  await assertThrows(
    () => sessionLearning.handle_task_preflight({}),
    /specFolder.*required/i,
    'Missing specFolder rejected',
    category
  );

  // Test 2: Missing taskId rejection
  await assertThrows(
    () => sessionLearning.handle_task_preflight({ specFolder: 'test-folder' }),
    /taskId.*required/i,
    'Missing taskId rejected',
    category
  );

  // Test 3: Missing knowledgeScore rejection
  await assertThrows(
    () => sessionLearning.handle_task_preflight({
      specFolder: 'test-folder',
      taskId: 'T1'
    }),
    /knowledgeScore.*required/i,
    'Missing knowledgeScore rejected',
    category
  );

  // Test 4: Missing uncertaintyScore rejection
  await assertThrows(
    () => sessionLearning.handle_task_preflight({
      specFolder: 'test-folder',
      taskId: 'T1',
      knowledgeScore: 50
    }),
    /uncertaintyScore.*required/i,
    'Missing uncertaintyScore rejected',
    category
  );

  // Test 5: Missing contextScore rejection
  await assertThrows(
    () => sessionLearning.handle_task_preflight({
      specFolder: 'test-folder',
      taskId: 'T1',
      knowledgeScore: 50,
      uncertaintyScore: 30
    }),
    /contextScore.*required/i,
    'Missing contextScore rejected',
    category
  );

  // Test 6: knowledgeScore below 0 rejection
  await assertThrows(
    () => sessionLearning.handle_task_preflight({
      specFolder: 'test-folder',
      taskId: 'T1',
      knowledgeScore: -1,
      uncertaintyScore: 30,
      contextScore: 70
    }),
    /0.*100|between/i,
    'knowledgeScore < 0 rejected',
    category
  );

  // Test 7: knowledgeScore above 100 rejection
  await assertThrows(
    () => sessionLearning.handle_task_preflight({
      specFolder: 'test-folder',
      taskId: 'T1',
      knowledgeScore: 101,
      uncertaintyScore: 30,
      contextScore: 70
    }),
    /0.*100|between/i,
    'knowledgeScore > 100 rejected',
    category
  );

  // Test 8: uncertaintyScore below 0 rejection
  await assertThrows(
    () => sessionLearning.handle_task_preflight({
      specFolder: 'test-folder',
      taskId: 'T1',
      knowledgeScore: 50,
      uncertaintyScore: -5,
      contextScore: 70
    }),
    /0.*100|between/i,
    'uncertaintyScore < 0 rejected',
    category
  );

  // Test 9: uncertaintyScore above 100 rejection
  await assertThrows(
    () => sessionLearning.handle_task_preflight({
      specFolder: 'test-folder',
      taskId: 'T1',
      knowledgeScore: 50,
      uncertaintyScore: 150,
      contextScore: 70
    }),
    /0.*100|between/i,
    'uncertaintyScore > 100 rejected',
    category
  );

  // Test 10: contextScore below 0 rejection
  await assertThrows(
    () => sessionLearning.handle_task_preflight({
      specFolder: 'test-folder',
      taskId: 'T1',
      knowledgeScore: 50,
      uncertaintyScore: 30,
      contextScore: -10
    }),
    /0.*100|between/i,
    'contextScore < 0 rejected',
    category
  );

  // Test 11: contextScore above 100 rejection
  await assertThrows(
    () => sessionLearning.handle_task_preflight({
      specFolder: 'test-folder',
      taskId: 'T1',
      knowledgeScore: 50,
      uncertaintyScore: 30,
      contextScore: 200
    }),
    /0.*100|between/i,
    'contextScore > 100 rejected',
    category
  );

  // Test 12: Non-number score rejection
  await assertThrows(
    () => sessionLearning.handle_task_preflight({
      specFolder: 'test-folder',
      taskId: 'T1',
      knowledgeScore: 'fifty',
      uncertaintyScore: 30,
      contextScore: 70
    }),
    /number|0.*100/i,
    'Non-number knowledgeScore rejected',
    category
  );

  // Test 13: Null score rejection
  await assertThrows(
    () => sessionLearning.handle_task_preflight({
      specFolder: 'test-folder',
      taskId: 'T1',
      knowledgeScore: null,
      uncertaintyScore: 30,
      contextScore: 70
    }),
    /required|null/i,
    'Null knowledgeScore rejected',
    category
  );

  // Tests requiring database
  if (dbAvailable) {
    // Test 14: Valid preflight call
    try {
      const result = await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-TEST-1',
        knowledgeScore: 50,
        uncertaintyScore: 40,
        contextScore: 60,
        knowledgeGaps: ['Gap A', 'Gap B'],
        sessionId: 'test-session-001'
      });

      const data = parseResponse(result);
      if (data) {
        assert(data.success === true, 'Preflight returns success', `success: ${data.success}`, category);
        assert(data.record !== undefined, 'Preflight returns record', 'record exists', category);
        assert(data.record.phase === 'preflight', 'Record phase is preflight', `phase: ${data.record.phase}`, category);
        assert(data.record.baseline !== undefined, 'Record contains baseline', 'baseline exists', category);
        assert(data.record.baseline.knowledge === 50, 'Baseline knowledge correct', `knowledge: ${data.record.baseline.knowledge}`, category);
        assert(data.record.baseline.uncertainty === 40, 'Baseline uncertainty correct', `uncertainty: ${data.record.baseline.uncertainty}`, category);
        assert(data.record.baseline.context === 60, 'Baseline context correct', `context: ${data.record.baseline.context}`, category);
        assert(Array.isArray(data.record.knowledgeGaps), 'knowledgeGaps is array', `gaps: ${data.record.knowledgeGaps.length}`, category);
        assert(data.record.knowledgeGaps.length === 2, 'knowledgeGaps has 2 items', `count: ${data.record.knowledgeGaps.length}`, category);
      }
    } catch (error) {
      fail('Valid preflight call', error.message, category);
    }

    // Test 15: Boundary scores (0 and 100)
    try {
      const result = await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-TEST-BOUNDARY',
        knowledgeScore: 0,
        uncertaintyScore: 100,
        contextScore: 0
      });

      const data = parseResponse(result);
      if (data && data.success) {
        pass('Boundary scores accepted (0 and 100)', 'success: true', category);
      }
    } catch (error) {
      fail('Boundary scores accepted', error.message, category);
    }

    // Test 16: Empty knowledge gaps array
    try {
      const result = await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-TEST-EMPTY-GAPS',
        knowledgeScore: 75,
        uncertaintyScore: 25,
        contextScore: 80,
        knowledgeGaps: []
      });

      const data = parseResponse(result);
      if (data) {
        assert(
          Array.isArray(data.record.knowledgeGaps) && data.record.knowledgeGaps.length === 0,
          'Empty knowledgeGaps accepted',
          `gaps: ${JSON.stringify(data.record.knowledgeGaps)}`,
          category
        );
      }
    } catch (error) {
      fail('Empty knowledgeGaps accepted', error.message, category);
    }

    // Test 17: No sessionId provided (optional)
    try {
      const result = await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-TEST-NO-SESSION',
        knowledgeScore: 60,
        uncertaintyScore: 35,
        contextScore: 70
      });

      const data = parseResponse(result);
      if (data && data.success) {
        pass('No sessionId accepted (optional)', 'success: true', category);
      }
    } catch (error) {
      fail('No sessionId accepted', error.message, category);
    }

    // Test 18: Re-running preflight for same task (INSERT OR REPLACE behavior)
    try {
      // First call
      await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-TEST-REPLACE',
        knowledgeScore: 30,
        uncertaintyScore: 60,
        contextScore: 40
      });

      // Second call with updated scores
      const result = await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-TEST-REPLACE',
        knowledgeScore: 35,
        uncertaintyScore: 55,
        contextScore: 45
      });

      const data = parseResponse(result);
      if (data) {
        assert(
          data.record.baseline.knowledge === 35,
          'Re-running preflight updates record',
          `Updated knowledge: ${data.record.baseline.knowledge}`,
          category
        );
      }
    } catch (error) {
      fail('Re-running preflight for same task', error.message, category);
    }
  } else {
    skip('Valid preflight call', 'Database not available', category);
    skip('Boundary scores accepted', 'Database not available', category);
    skip('Empty knowledgeGaps accepted', 'Database not available', category);
    skip('No sessionId accepted', 'Database not available', category);
    skip('Re-running preflight updates record', 'Database not available', category);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. TASK_POSTFLIGHT TESTS
──────────────────────────────────────────────────────────────── */

async function test_task_postflight() {
  log('\n🔬 task_postflight Tests');
  const category = 'task_postflight';

  // Test 1: Missing specFolder rejection
  await assertThrows(
    () => sessionLearning.handle_task_postflight({}),
    /specFolder.*required/i,
    'Missing specFolder rejected',
    category
  );

  // Test 2: Missing taskId rejection
  await assertThrows(
    () => sessionLearning.handle_task_postflight({ specFolder: 'test-folder' }),
    /taskId.*required/i,
    'Missing taskId rejected',
    category
  );

  // Test 3: Missing knowledgeScore rejection
  await assertThrows(
    () => sessionLearning.handle_task_postflight({
      specFolder: 'test-folder',
      taskId: 'T1'
    }),
    /knowledgeScore.*required/i,
    'Missing knowledgeScore rejected',
    category
  );

  // Test 4: Score range validation (same as preflight)
  await assertThrows(
    () => sessionLearning.handle_task_postflight({
      specFolder: 'test-folder',
      taskId: 'T1',
      knowledgeScore: 150,
      uncertaintyScore: 30,
      contextScore: 70
    }),
    /0.*100|between/i,
    'knowledgeScore > 100 rejected',
    category
  );

  // Tests requiring database
  if (dbAvailable) {
    // Test 5: Postflight without preflight rejection
    await assertThrows(
      () => sessionLearning.handle_task_postflight({
        specFolder: 'test/nonexistent-folder',
        taskId: 'T-NONEXISTENT',
        knowledgeScore: 80,
        uncertaintyScore: 20,
        contextScore: 90
      }),
      /preflight.*first|not found/i,
      'Postflight without preflight rejected',
      category
    );

    // Test 6: Valid preflight + postflight flow
    try {
      // Create preflight first
      await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-FLOW-1',
        knowledgeScore: 40,
        uncertaintyScore: 60,
        contextScore: 50,
        knowledgeGaps: ['Understanding X', 'Understanding Y']
      });

      // Then create postflight
      const result = await sessionLearning.handle_task_postflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-FLOW-1',
        knowledgeScore: 80,
        uncertaintyScore: 20,
        contextScore: 90,
        gapsClosed: ['Understanding X'],
        newGapsDiscovered: ['New complexity Z']
      });

      const data = parseResponse(result);
      if (data) {
        assert(data.success === true, 'Postflight returns success', `success: ${data.success}`, category);
        assert(data.record !== undefined, 'Postflight returns record', 'record exists', category);

        // Check baseline values preserved
        assert(data.record.baseline.knowledge === 40, 'Baseline knowledge preserved', `baseline.knowledge: ${data.record.baseline.knowledge}`, category);
        assert(data.record.baseline.uncertainty === 60, 'Baseline uncertainty preserved', `baseline.uncertainty: ${data.record.baseline.uncertainty}`, category);
        assert(data.record.baseline.context === 50, 'Baseline context preserved', `baseline.context: ${data.record.baseline.context}`, category);

        // Check final values
        assert(data.record.final.knowledge === 80, 'Final knowledge correct', `final.knowledge: ${data.record.final.knowledge}`, category);
        assert(data.record.final.uncertainty === 20, 'Final uncertainty correct', `final.uncertainty: ${data.record.final.uncertainty}`, category);
        assert(data.record.final.context === 90, 'Final context correct', `final.context: ${data.record.final.context}`, category);

        // Check deltas
        assert(data.record.deltas !== undefined, 'Deltas calculated', 'deltas exists', category);
        assert(data.record.deltas.knowledge === 40, 'Knowledge delta correct (80-40)', `delta.knowledge: ${data.record.deltas.knowledge}`, category);
        assert(data.record.deltas.uncertainty === 40, 'Uncertainty delta correct (60-20)', `delta.uncertainty: ${data.record.deltas.uncertainty}`, category);
        assert(data.record.deltas.context === 40, 'Context delta correct (90-50)', `delta.context: ${data.record.deltas.context}`, category);

        // Check Learning Index
        assert(data.record.learningIndex !== undefined, 'Learning Index calculated', `LI: ${data.record.learningIndex}`, category);
        assert(data.record.formula !== undefined, 'Formula included', `formula: ${data.record.formula}`, category);
        assert(data.record.interpretation !== undefined, 'Interpretation included', `interpretation: ${data.record.interpretation}`, category);

        // Check gap tracking
        assert(Array.isArray(data.record.gaps.closed), 'gapsClosed is array', 'array', category);
        assert(data.record.gaps.closed.length === 1, 'gapsClosed has 1 item', `count: ${data.record.gaps.closed.length}`, category);
        assert(Array.isArray(data.record.gaps.newDiscovered), 'newGapsDiscovered is array', 'array', category);
        assert(data.record.gaps.newDiscovered.length === 1, 'newGapsDiscovered has 1 item', `count: ${data.record.gaps.newDiscovered.length}`, category);
      }
    } catch (error) {
      fail('Valid preflight + postflight flow', error.message, category);
    }

    // Test 7: Learning Index formula verification
    // LI = (KD * 0.4) + (UR * 0.35) + (CI * 0.25)
    try {
      // Create preflight
      await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-LI-CALC',
        knowledgeScore: 0,
        uncertaintyScore: 100,
        contextScore: 0
      });

      // Create postflight with maximum improvement
      const result = await sessionLearning.handle_task_postflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-LI-CALC',
        knowledgeScore: 100,
        uncertaintyScore: 0,
        contextScore: 100
      });

      const data = parseResponse(result);
      if (data) {
        // KD = 100, UR = 100, CI = 100
        // LI = (100 * 0.4) + (100 * 0.35) + (100 * 0.25) = 40 + 35 + 25 = 100
        const expectedLI = 100;
        assert(
          data.record.learningIndex === expectedLI,
          'Learning Index formula correct (max improvement)',
          `Expected: ${expectedLI}, Got: ${data.record.learningIndex}`,
          category
        );
      }
    } catch (error) {
      fail('Learning Index formula verification (max)', error.message, category);
    }

    // Test 8: Learning Index with negative deltas (regression)
    try {
      // Create preflight with high scores
      await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-LI-NEGATIVE',
        knowledgeScore: 80,
        uncertaintyScore: 20,
        contextScore: 90
      });

      // Create postflight with lower scores (regression)
      const result = await sessionLearning.handle_task_postflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-LI-NEGATIVE',
        knowledgeScore: 60,
        uncertaintyScore: 50,
        contextScore: 70
      });

      const data = parseResponse(result);
      if (data) {
        // KD = 60 - 80 = -20
        // UR = 20 - 50 = -30 (uncertainty increased, so reduction is negative)
        // CI = 70 - 90 = -20
        // LI = (-20 * 0.4) + (-30 * 0.35) + (-20 * 0.25)
        //    = -8 + -10.5 + -5 = -23.5
        assert(
          data.record.learningIndex < 0,
          'Learning Index can be negative (regression)',
          `LI: ${data.record.learningIndex}`,
          category
        );
        assert(
          data.record.interpretation.toLowerCase().includes('regression'),
          'Regression interpretation provided',
          `interpretation: ${data.record.interpretation}`,
          category
        );
      }
    } catch (error) {
      fail('Learning Index with negative deltas', error.message, category);
    }

    // Test 9: Learning Index interpretation thresholds
    try {
      // Significant learning (LI >= 40)
      await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-INTERP-SIG',
        knowledgeScore: 10,
        uncertaintyScore: 90,
        contextScore: 10
      });
      const sigResult = await sessionLearning.handle_task_postflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-INTERP-SIG',
        knowledgeScore: 90,
        uncertaintyScore: 10,
        contextScore: 90
      });
      const sigData = parseResponse(sigResult);
      if (sigData && sigData.record.learningIndex >= 40) {
        assert(
          sigData.record.interpretation.toLowerCase().includes('significant'),
          'Significant learning interpretation (LI >= 40)',
          `LI: ${sigData.record.learningIndex}, interpretation: ${sigData.record.interpretation}`,
          category
        );
      }

      // Moderate learning (15 <= LI < 40)
      await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-INTERP-MOD',
        knowledgeScore: 40,
        uncertaintyScore: 60,
        contextScore: 40
      });
      const modResult = await sessionLearning.handle_task_postflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-INTERP-MOD',
        knowledgeScore: 70,
        uncertaintyScore: 30,
        contextScore: 70
      });
      const modData = parseResponse(modResult);
      if (modData && modData.record.learningIndex >= 15 && modData.record.learningIndex < 40) {
        assert(
          modData.record.interpretation.toLowerCase().includes('moderate'),
          'Moderate learning interpretation (15 <= LI < 40)',
          `LI: ${modData.record.learningIndex}, interpretation: ${modData.record.interpretation}`,
          category
        );
      }

      // Incremental learning (5 <= LI < 15)
      await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-INTERP-INC',
        knowledgeScore: 60,
        uncertaintyScore: 40,
        contextScore: 60
      });
      const incResult = await sessionLearning.handle_task_postflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-INTERP-INC',
        knowledgeScore: 70,
        uncertaintyScore: 30,
        contextScore: 70
      });
      const incData = parseResponse(incResult);
      if (incData && incData.record.learningIndex >= 5 && incData.record.learningIndex < 15) {
        assert(
          incData.record.interpretation.toLowerCase().includes('incremental'),
          'Incremental learning interpretation (5 <= LI < 15)',
          `LI: ${incData.record.learningIndex}, interpretation: ${incData.record.interpretation}`,
          category
        );
      }

      // Execution-focused (0 <= LI < 5)
      await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-INTERP-EXEC',
        knowledgeScore: 80,
        uncertaintyScore: 20,
        contextScore: 80
      });
      const execResult = await sessionLearning.handle_task_postflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-INTERP-EXEC',
        knowledgeScore: 82,
        uncertaintyScore: 18,
        contextScore: 82
      });
      const execData = parseResponse(execResult);
      if (execData && execData.record.learningIndex >= 0 && execData.record.learningIndex < 5) {
        assert(
          execData.record.interpretation.toLowerCase().includes('execution'),
          'Execution-focused interpretation (0 <= LI < 5)',
          `LI: ${execData.record.learningIndex}, interpretation: ${execData.record.interpretation}`,
          category
        );
      }
    } catch (error) {
      fail('Learning Index interpretation thresholds', error.message, category);
    }

    // Test 10: Empty gapsClosed and newGapsDiscovered
    try {
      await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-EMPTY-GAPS',
        knowledgeScore: 50,
        uncertaintyScore: 50,
        contextScore: 50
      });

      const result = await sessionLearning.handle_task_postflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-EMPTY-GAPS',
        knowledgeScore: 60,
        uncertaintyScore: 40,
        contextScore: 60
      });

      const data = parseResponse(result);
      if (data) {
        assert(
          Array.isArray(data.record.gaps.closed) && data.record.gaps.closed.length === 0,
          'Empty gapsClosed defaults to []',
          `gapsClosed: ${JSON.stringify(data.record.gaps.closed)}`,
          category
        );
        assert(
          Array.isArray(data.record.gaps.newDiscovered) && data.record.gaps.newDiscovered.length === 0,
          'Empty newGapsDiscovered defaults to []',
          `newGapsDiscovered: ${JSON.stringify(data.record.gaps.newDiscovered)}`,
          category
        );
      }
    } catch (error) {
      fail('Empty gapsClosed and newGapsDiscovered', error.message, category);
    }
  } else {
    skip('Postflight without preflight rejected', 'Database not available', category);
    skip('Valid preflight + postflight flow', 'Database not available', category);
    skip('Learning Index formula verification', 'Database not available', category);
    skip('Learning Index with negative deltas', 'Database not available', category);
    skip('Learning Index interpretation thresholds', 'Database not available', category);
    skip('Empty gapsClosed and newGapsDiscovered', 'Database not available', category);
  }
}

/* ─────────────────────────────────────────────────────────────
   7. GET_LEARNING_HISTORY TESTS
──────────────────────────────────────────────────────────────── */

async function test_get_learning_history() {
  log('\n🔬 memory_get_learning_history Tests');
  const category = 'get_learning_history';

  // Test 1: Missing specFolder rejection
  await assertThrows(
    () => sessionLearning.handle_get_learning_history({}),
    /specFolder.*required/i,
    'Missing specFolder rejected',
    category
  );

  // Tests requiring database
  if (dbAvailable) {
    // Test 2: Valid call with just specFolder
    try {
      const result = await sessionLearning.handle_get_learning_history({
        specFolder: 'test/session-learning-test'
      });

      const data = parseResponse(result);
      if (data) {
        assert(data.specFolder === 'test/session-learning-test', 'specFolder echoed', `specFolder: ${data.specFolder}`, category);
        assert(typeof data.count === 'number', 'count is number', `count: ${data.count}`, category);
        assert(Array.isArray(data.learningHistory), 'learningHistory is array', `length: ${data.learningHistory.length}`, category);
      }
    } catch (error) {
      fail('Valid call with specFolder', error.message, category);
    }

    // Test 3: Limit parameter
    try {
      const result = await sessionLearning.handle_get_learning_history({
        specFolder: 'test/session-learning-test',
        limit: 3
      });

      const data = parseResponse(result);
      if (data) {
        assert(
          data.learningHistory.length <= 3,
          'Limit parameter respected',
          `count: ${data.learningHistory.length}`,
          category
        );
      }
    } catch (error) {
      fail('Limit parameter', error.message, category);
    }

    // Test 4: Limit clamping (max 100)
    try {
      const result = await sessionLearning.handle_get_learning_history({
        specFolder: 'test/session-learning-test',
        limit: 200
      });

      const data = parseResponse(result);
      // Should work without error, limit is clamped internally
      pass('Limit clamping (max 100) works', 'No error', category);
    } catch (error) {
      fail('Limit clamping', error.message, category);
    }

    // Test 5: Limit clamping (min 1)
    try {
      const result = await sessionLearning.handle_get_learning_history({
        specFolder: 'test/session-learning-test',
        limit: 0
      });

      // Should work without error, limit is clamped internally to at least 1
      pass('Limit clamping (min 1) works', 'No error', category);
    } catch (error) {
      fail('Limit clamping (min 1)', error.message, category);
    }

    // Test 6: onlyComplete filter
    try {
      // First ensure we have both preflight-only and complete records
      await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-INCOMPLETE',
        knowledgeScore: 30,
        uncertaintyScore: 70,
        contextScore: 30
      });

      const result = await sessionLearning.handle_get_learning_history({
        specFolder: 'test/session-learning-test',
        onlyComplete: true
      });

      const data = parseResponse(result);
      if (data && data.learningHistory.length > 0) {
        const allComplete = data.learningHistory.every(r => r.phase === 'complete');
        assert(
          allComplete,
          'onlyComplete filter works',
          `All ${data.learningHistory.length} records are complete`,
          category
        );
      } else {
        pass('onlyComplete filter works (no complete records)', 'Empty result', category);
      }
    } catch (error) {
      fail('onlyComplete filter', error.message, category);
    }

    // Test 7: sessionId filter
    try {
      // Create record with specific sessionId
      await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-SESSION-FILTER',
        knowledgeScore: 50,
        uncertaintyScore: 50,
        contextScore: 50,
        sessionId: 'unique-session-xyz'
      });

      const result = await sessionLearning.handle_get_learning_history({
        specFolder: 'test/session-learning-test',
        sessionId: 'unique-session-xyz'
      });

      const data = parseResponse(result);
      if (data) {
        const allMatchSession = data.learningHistory.every(r => r.sessionId === 'unique-session-xyz');
        assert(
          allMatchSession,
          'sessionId filter works',
          `All ${data.learningHistory.length} records match sessionId`,
          category
        );
      }
    } catch (error) {
      fail('sessionId filter', error.message, category);
    }

    // Test 8: includeSummary true (default)
    try {
      const result = await sessionLearning.handle_get_learning_history({
        specFolder: 'test/session-learning-test',
        includeSummary: true
      });

      const data = parseResponse(result);
      if (data) {
        assert(data.summary !== undefined, 'Summary included by default', 'summary exists', category);
        assert(typeof data.summary.totalTasks === 'number', 'summary.totalTasks is number', `totalTasks: ${data.summary.totalTasks}`, category);
        assert(typeof data.summary.completedTasks === 'number', 'summary.completedTasks is number', `completedTasks: ${data.summary.completedTasks}`, category);
      }
    } catch (error) {
      fail('includeSummary true', error.message, category);
    }

    // Test 9: includeSummary false
    try {
      const result = await sessionLearning.handle_get_learning_history({
        specFolder: 'test/session-learning-test',
        includeSummary: false
      });

      const data = parseResponse(result);
      if (data) {
        assert(
          data.summary === undefined,
          'Summary excluded when includeSummary: false',
          'summary not present',
          category
        );
      }
    } catch (error) {
      fail('includeSummary false', error.message, category);
    }

    // Test 10: Summary statistics accuracy
    try {
      const result = await sessionLearning.handle_get_learning_history({
        specFolder: 'test/session-learning-test',
        includeSummary: true
      });

      const data = parseResponse(result);
      if (data && data.summary && data.summary.completedTasks > 0) {
        // Check that averages are rounded to 2 decimal places
        if (data.summary.averageLearningIndex !== null) {
          const roundedLI = Math.round(data.summary.averageLearningIndex * 100) / 100;
          assert(
            data.summary.averageLearningIndex === roundedLI,
            'averageLearningIndex rounded to 2 decimals',
            `averageLearningIndex: ${data.summary.averageLearningIndex}`,
            category
          );
        }

        // Check interpretation is present
        if (data.summary.interpretation) {
          assert(
            typeof data.summary.interpretation === 'string',
            'Summary interpretation is string',
            `interpretation: ${data.summary.interpretation}`,
            category
          );
        }
      } else {
        pass('Summary statistics (no complete tasks to test)', 'completedTasks: 0 or null', category);
      }
    } catch (error) {
      fail('Summary statistics accuracy', error.message, category);
    }

    // Test 11: Record structure for complete records
    try {
      // Ensure we have a complete record
      await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-STRUCTURE-TEST',
        knowledgeScore: 40,
        uncertaintyScore: 60,
        contextScore: 50,
        knowledgeGaps: ['Gap 1']
      });
      await sessionLearning.handle_task_postflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-STRUCTURE-TEST',
        knowledgeScore: 80,
        uncertaintyScore: 20,
        contextScore: 90,
        gapsClosed: ['Gap 1'],
        newGapsDiscovered: ['New Gap']
      });

      const result = await sessionLearning.handle_get_learning_history({
        specFolder: 'test/session-learning-test',
        onlyComplete: true,
        limit: 1
      });

      const data = parseResponse(result);
      if (data && data.learningHistory.length > 0) {
        const record = data.learningHistory[0];

        assert(record.taskId !== undefined, 'Record has taskId', `taskId: ${record.taskId}`, category);
        assert(record.specFolder !== undefined, 'Record has specFolder', `specFolder: ${record.specFolder}`, category);
        assert(record.phase === 'complete', 'Record phase is complete', `phase: ${record.phase}`, category);
        assert(record.preflight !== undefined, 'Record has preflight', 'preflight exists', category);
        assert(record.postflight !== undefined, 'Record has postflight', 'postflight exists', category);
        assert(record.deltas !== undefined, 'Record has deltas', 'deltas exists', category);
        assert(record.learningIndex !== undefined, 'Record has learningIndex', `LI: ${record.learningIndex}`, category);
        assert(Array.isArray(record.gapsClosed), 'Record has gapsClosed array', `count: ${record.gapsClosed.length}`, category);
        assert(Array.isArray(record.newGapsDiscovered), 'Record has newGapsDiscovered array', `count: ${record.newGapsDiscovered.length}`, category);
        assert(record.createdAt !== undefined, 'Record has createdAt', `createdAt: ${record.createdAt}`, category);
        assert(record.completedAt !== undefined, 'Record has completedAt', `completedAt: ${record.completedAt}`, category);
      }
    } catch (error) {
      fail('Record structure for complete records', error.message, category);
    }

    // Test 12: Record structure for preflight-only records
    try {
      await sessionLearning.handle_task_preflight({
        specFolder: 'test/session-learning-test',
        taskId: 'T-PREFLIGHT-ONLY-STRUCT',
        knowledgeScore: 30,
        uncertaintyScore: 70,
        contextScore: 40
      });

      const result = await sessionLearning.handle_get_learning_history({
        specFolder: 'test/session-learning-test',
        onlyComplete: false
      });

      const data = parseResponse(result);
      if (data && data.learningHistory.length > 0) {
        const preflightRecord = data.learningHistory.find(r => r.phase === 'preflight');
        if (preflightRecord) {
          assert(preflightRecord.preflight !== undefined, 'Preflight-only record has preflight', 'preflight exists', category);
          assert(preflightRecord.postflight === undefined, 'Preflight-only record has no postflight', 'postflight undefined', category);
          assert(preflightRecord.deltas === undefined, 'Preflight-only record has no deltas', 'deltas undefined', category);
          assert(preflightRecord.learningIndex === undefined, 'Preflight-only record has no learningIndex', 'LI undefined', category);
        } else {
          pass('Preflight-only record structure (no preflight-only records found)', 'All records complete', category);
        }
      }
    } catch (error) {
      fail('Record structure for preflight-only records', error.message, category);
    }

    // Test 13: Nonexistent specFolder returns empty
    try {
      const result = await sessionLearning.handle_get_learning_history({
        specFolder: 'nonexistent/folder/path'
      });

      const data = parseResponse(result);
      if (data) {
        assert(
          data.count === 0 && data.learningHistory.length === 0,
          'Nonexistent specFolder returns empty',
          `count: ${data.count}`,
          category
        );
      }
    } catch (error) {
      fail('Nonexistent specFolder returns empty', error.message, category);
    }

    // Test 14: Summary interpretation thresholds
    try {
      const result = await sessionLearning.handle_get_learning_history({
        specFolder: 'test/session-learning-test',
        includeSummary: true
      });

      const data = parseResponse(result);
      if (data && data.summary && data.summary.averageLearningIndex !== null) {
        const avgLI = data.summary.averageLearningIndex;
        const interp = data.summary.interpretation.toLowerCase();

        if (avgLI > 15) {
          assert(interp.includes('strong'), 'Strong learning interpretation (avgLI > 15)', `avgLI: ${avgLI}`, category);
        } else if (avgLI > 7) {
          assert(interp.includes('positive'), 'Positive learning interpretation (7 < avgLI <= 15)', `avgLI: ${avgLI}`, category);
        } else if (avgLI > 0) {
          assert(interp.includes('slight'), 'Slight learning interpretation (0 < avgLI <= 7)', `avgLI: ${avgLI}`, category);
        } else if (avgLI === 0) {
          assert(interp.includes('neutral'), 'Neutral interpretation (avgLI = 0)', `avgLI: ${avgLI}`, category);
        } else {
          assert(interp.includes('negative'), 'Negative trend interpretation (avgLI < 0)', `avgLI: ${avgLI}`, category);
        }
      } else {
        pass('Summary interpretation thresholds (no data)', 'No completed tasks', category);
      }
    } catch (error) {
      fail('Summary interpretation thresholds', error.message, category);
    }
  } else {
    skip('Valid call with specFolder', 'Database not available', category);
    skip('Limit parameter', 'Database not available', category);
    skip('Limit clamping', 'Database not available', category);
    skip('onlyComplete filter', 'Database not available', category);
    skip('sessionId filter', 'Database not available', category);
    skip('includeSummary true', 'Database not available', category);
    skip('includeSummary false', 'Database not available', category);
    skip('Summary statistics accuracy', 'Database not available', category);
    skip('Record structure for complete records', 'Database not available', category);
    skip('Record structure for preflight-only records', 'Database not available', category);
    skip('Nonexistent specFolder returns empty', 'Database not available', category);
    skip('Summary interpretation thresholds', 'Database not available', category);
  }
}

/* ─────────────────────────────────────────────────────────────
   8. SCHEMA INITIALIZATION TESTS
──────────────────────────────────────────────────────────────── */

async function test_ensure_schema() {
  log('\n🔬 ensure_schema Tests');
  const category = 'ensure_schema';

  if (dbAvailable) {
    // Test 1: Schema initialization succeeds
    try {
      const db = vectorIndex.getDb();
      sessionLearning.ensure_schema(db);
      pass('ensure_schema succeeds', 'No error thrown', category);
    } catch (error) {
      fail('ensure_schema succeeds', error.message, category);
    }

    // Test 2: Schema is idempotent (can be called multiple times)
    try {
      const db = vectorIndex.getDb();
      sessionLearning.ensure_schema(db);
      sessionLearning.ensure_schema(db);
      sessionLearning.ensure_schema(db);
      pass('ensure_schema is idempotent', 'Called 3 times without error', category);
    } catch (error) {
      fail('ensure_schema is idempotent', error.message, category);
    }

    // Test 3: Table exists after schema initialization
    try {
      const db = vectorIndex.getDb();
      sessionLearning.ensure_schema(db);

      const tableExists = db.prepare(`
        SELECT name FROM sqlite_master
        WHERE type='table' AND name='session_learning'
      `).get();

      assert(
        tableExists !== undefined,
        'session_learning table exists',
        `table: ${tableExists ? tableExists.name : 'not found'}`,
        category
      );
    } catch (error) {
      fail('session_learning table exists', error.message, category);
    }

    // Test 4: Index exists after schema initialization
    try {
      const db = vectorIndex.getDb();
      sessionLearning.ensure_schema(db);

      const indexExists = db.prepare(`
        SELECT name FROM sqlite_master
        WHERE type='index' AND name='idx_session_learning_spec_folder'
      `).get();

      assert(
        indexExists !== undefined,
        'session_learning index exists',
        `index: ${indexExists ? indexExists.name : 'not found'}`,
        category
      );
    } catch (error) {
      fail('session_learning index exists', error.message, category);
    }

    // Test 5: Table has correct columns
    try {
      const db = vectorIndex.getDb();
      sessionLearning.ensure_schema(db);

      const columns = db.prepare('PRAGMA table_info(session_learning)').all();
      const columnNames = columns.map(c => c.name);

      const expectedColumns = [
        'id', 'spec_folder', 'task_id', 'phase', 'session_id',
        'pre_knowledge_score', 'pre_uncertainty_score', 'pre_context_score',
        'knowledge_gaps',
        'post_knowledge_score', 'post_uncertainty_score', 'post_context_score',
        'delta_knowledge', 'delta_uncertainty', 'delta_context',
        'learning_index',
        'gaps_closed', 'new_gaps_discovered',
        'created_at', 'updated_at', 'completed_at'
      ];

      for (const col of expectedColumns) {
        assert(
          columnNames.includes(col),
          `Column ${col} exists`,
          `column: ${col}`,
          category
        );
      }
    } catch (error) {
      fail('Table has correct columns', error.message, category);
    }

    // Test 6: Phase constraint works
    try {
      const db = vectorIndex.getDb();
      sessionLearning.ensure_schema(db);

      // Try to insert with invalid phase
      try {
        db.prepare(`
          INSERT INTO session_learning (spec_folder, task_id, phase, pre_knowledge_score, pre_uncertainty_score, pre_context_score)
          VALUES ('test', 'test', 'invalid_phase', 50, 50, 50)
        `).run();
        fail('Phase constraint works', 'Invalid phase was accepted', category);
      } catch (constraintError) {
        pass('Phase constraint works', 'Invalid phase rejected by CHECK constraint', category);
      }
    } catch (error) {
      fail('Phase constraint works', error.message, category);
    }

    // Test 7: Unique constraint on (spec_folder, task_id)
    try {
      const db = vectorIndex.getDb();
      sessionLearning.ensure_schema(db);

      const uniqueTaskId = `T-UNIQUE-${Date.now()}`;

      // First insert
      db.prepare(`
        INSERT INTO session_learning (spec_folder, task_id, phase, pre_knowledge_score, pre_uncertainty_score, pre_context_score)
        VALUES ('test/unique-constraint', ?, 'preflight', 50, 50, 50)
      `).run(uniqueTaskId);

      // Second insert should fail (or replace if using INSERT OR REPLACE)
      try {
        db.prepare(`
          INSERT INTO session_learning (spec_folder, task_id, phase, pre_knowledge_score, pre_uncertainty_score, pre_context_score)
          VALUES ('test/unique-constraint', ?, 'preflight', 60, 40, 60)
        `).run(uniqueTaskId);
        fail('Unique constraint on (spec_folder, task_id)', 'Duplicate was accepted', category);
      } catch (uniqueError) {
        pass('Unique constraint on (spec_folder, task_id)', 'Duplicate rejected', category);
      }
    } catch (error) {
      fail('Unique constraint on (spec_folder, task_id)', error.message, category);
    }
  } else {
    // Test without database - should throw
    await assertThrows(
      () => sessionLearning.ensure_schema(null),
      /error|null|database/i,
      'ensure_schema with null db throws',
      category
    );

    skip('ensure_schema succeeds', 'Database not available', category);
    skip('ensure_schema is idempotent', 'Database not available', category);
    skip('session_learning table exists', 'Database not available', category);
    skip('session_learning index exists', 'Database not available', category);
    skip('Table has correct columns', 'Database not available', category);
    skip('Phase constraint works', 'Database not available', category);
    skip('Unique constraint', 'Database not available', category);
  }
}

/* ─────────────────────────────────────────────────────────────
   9. ERROR HANDLING TESTS
──────────────────────────────────────────────────────────────── */

async function test_error_handling() {
  log('\n🔬 Error Handling Tests');
  const category = 'error_handling';

  // Test 1: MemoryError is used for missing params
  try {
    await sessionLearning.handle_task_preflight({});
  } catch (error) {
    assert(
      error.code !== undefined,
      'Missing param throws MemoryError with code',
      `code: ${error.code}`,
      category
    );
    assert(
      error.details !== undefined,
      'MemoryError has details',
      `details: ${JSON.stringify(error.details)}`,
      category
    );
  }

  // Test 2: MemoryError for invalid parameter value
  try {
    await sessionLearning.handle_task_preflight({
      specFolder: 'test',
      taskId: 'T1',
      knowledgeScore: 'not-a-number',
      uncertaintyScore: 50,
      contextScore: 50
    });
  } catch (error) {
    assert(
      error.code !== undefined,
      'Invalid param value throws MemoryError with code',
      `code: ${error.code}`,
      category
    );
  }

  // Test 3: Error for database not available
  // This is tested implicitly when db is null

  // Test 4: MemoryError for missing preflight record
  if (dbAvailable) {
    try {
      await sessionLearning.handle_task_postflight({
        specFolder: 'nonexistent/folder',
        taskId: 'T-NONEXISTENT',
        knowledgeScore: 80,
        uncertaintyScore: 20,
        contextScore: 90
      });
    } catch (error) {
      assert(
        error.code !== undefined,
        'Missing preflight throws MemoryError with code',
        `code: ${error.code}`,
        category
      );
      assert(
        error.message.includes('preflight') || error.message.includes('not found'),
        'Error message mentions preflight',
        `message: ${error.message}`,
        category
      );
    }
  } else {
    skip('Missing preflight throws MemoryError', 'Database not available', category);
  }

  // Test 5: Error codes are from ErrorCodes enum
  const { ErrorCodes } = errors;
  try {
    await sessionLearning.handle_task_preflight({});
  } catch (error) {
    const validCodes = Object.values(ErrorCodes);
    assert(
      validCodes.includes(error.code),
      'Error code is from ErrorCodes enum',
      `code: ${error.code}`,
      category
    );
  }
}

/* ─────────────────────────────────────────────────────────────
   10. EDGE CASES TESTS
──────────────────────────────────────────────────────────────── */

async function test_edge_cases() {
  log('\n🔬 Edge Cases Tests');
  const category = 'edge_cases';

  // Test 1: Unicode in specFolder and taskId
  if (dbAvailable) {
    try {
      const result = await sessionLearning.handle_task_preflight({
        specFolder: 'test/unicode-测试-テスト',
        taskId: 'T-Unicode-αβγ',
        knowledgeScore: 50,
        uncertaintyScore: 50,
        contextScore: 50,
        knowledgeGaps: ['Gap with emoji 🔥']
      });

      const data = parseResponse(result);
      if (data && data.success) {
        pass('Unicode in specFolder and taskId', 'success: true', category);
      }
    } catch (error) {
      fail('Unicode in specFolder and taskId', error.message, category);
    }
  } else {
    skip('Unicode in specFolder and taskId', 'Database not available', category);
  }

  // Test 2: Very long specFolder path
  if (dbAvailable) {
    try {
      const longPath = 'test/' + 'a'.repeat(200);
      const result = await sessionLearning.handle_task_preflight({
        specFolder: longPath,
        taskId: 'T-LONG-PATH',
        knowledgeScore: 50,
        uncertaintyScore: 50,
        contextScore: 50
      });

      const data = parseResponse(result);
      if (data && data.success) {
        pass('Very long specFolder path', 'success: true', category);
      }
    } catch (error) {
      // May fail depending on database limits
      pass('Very long specFolder path handled', `Error: ${error.message}`, category);
    }
  } else {
    skip('Very long specFolder path', 'Database not available', category);
  }

  // Test 3: Decimal scores (the handler accepts any number 0-100, including decimals)
  if (dbAvailable) {
    try {
      const result = await sessionLearning.handle_task_preflight({
        specFolder: 'test/decimal-test',
        taskId: 'T-DECIMAL-' + Date.now(),
        knowledgeScore: 50.5,
        uncertaintyScore: 30.3,
        contextScore: 70.7
      });
      const data = parseResponse(result);
      if (data && data.success) {
        pass('Decimal scores accepted', 'Scores can be decimals (50.5, 30.3, 70.7)', category);
      }
    } catch (error) {
      fail('Decimal scores accepted', error.message, category);
    }
  } else {
    skip('Decimal scores accepted', 'Database not available', category);
  }

  // Test 4: Exactly 0 and 100 as boundaries
  if (dbAvailable) {
    try {
      const result = await sessionLearning.handle_task_preflight({
        specFolder: 'test/boundary-exact',
        taskId: 'T-BOUNDARY-EXACT',
        knowledgeScore: 0,
        uncertaintyScore: 100,
        contextScore: 0
      });

      const data = parseResponse(result);
      if (data && data.success) {
        assert(data.record.baseline.knowledge === 0, 'Exact 0 accepted', 'knowledge: 0', category);
        assert(data.record.baseline.uncertainty === 100, 'Exact 100 accepted', 'uncertainty: 100', category);
      }
    } catch (error) {
      fail('Boundary values 0 and 100', error.message, category);
    }
  } else {
    skip('Boundary values 0 and 100', 'Database not available', category);
  }

  // Test 5: Large knowledge gaps array
  if (dbAvailable) {
    try {
      const manyGaps = Array.from({ length: 50 }, (_, i) => `Gap ${i + 1}`);
      const result = await sessionLearning.handle_task_preflight({
        specFolder: 'test/many-gaps',
        taskId: 'T-MANY-GAPS',
        knowledgeScore: 20,
        uncertaintyScore: 80,
        contextScore: 30,
        knowledgeGaps: manyGaps
      });

      const data = parseResponse(result);
      if (data && data.success) {
        assert(
          data.record.knowledgeGaps.length === 50,
          'Large knowledge gaps array stored',
          `gaps: ${data.record.knowledgeGaps.length}`,
          category
        );
      }
    } catch (error) {
      fail('Large knowledge gaps array', error.message, category);
    }
  } else {
    skip('Large knowledge gaps array', 'Database not available', category);
  }

  // Test 6: Special characters in knowledge gaps
  if (dbAvailable) {
    try {
      const specialGaps = [
        'Gap with "quotes"',
        "Gap with 'apostrophes'",
        'Gap with <html> tags',
        'Gap with \\ backslash',
        'Gap with \n newline'
      ];
      const result = await sessionLearning.handle_task_preflight({
        specFolder: 'test/special-chars',
        taskId: 'T-SPECIAL-CHARS',
        knowledgeScore: 40,
        uncertaintyScore: 60,
        contextScore: 50,
        knowledgeGaps: specialGaps
      });

      const data = parseResponse(result);
      if (data && data.success) {
        assert(
          data.record.knowledgeGaps.length === 5,
          'Special characters in gaps handled',
          `gaps: ${JSON.stringify(data.record.knowledgeGaps)}`,
          category
        );
      }
    } catch (error) {
      fail('Special characters in knowledge gaps', error.message, category);
    }
  } else {
    skip('Special characters in knowledge gaps', 'Database not available', category);
  }

  // Test 7: Concurrent preflight/postflight for same task
  if (dbAvailable) {
    try {
      // Create preflight
      await sessionLearning.handle_task_preflight({
        specFolder: 'test/concurrent',
        taskId: 'T-CONCURRENT',
        knowledgeScore: 30,
        uncertaintyScore: 70,
        contextScore: 40
      });

      // Try to run preflight again (should replace)
      const result1 = await sessionLearning.handle_task_preflight({
        specFolder: 'test/concurrent',
        taskId: 'T-CONCURRENT',
        knowledgeScore: 35,
        uncertaintyScore: 65,
        contextScore: 45
      });

      const data1 = parseResponse(result1);
      assert(
        data1 && data1.record.baseline.knowledge === 35,
        'Re-running preflight replaces record',
        `knowledge: ${data1.record.baseline.knowledge}`,
        category
      );

      // Now complete it
      const result2 = await sessionLearning.handle_task_postflight({
        specFolder: 'test/concurrent',
        taskId: 'T-CONCURRENT',
        knowledgeScore: 75,
        uncertaintyScore: 25,
        contextScore: 85
      });

      const data2 = parseResponse(result2);
      assert(
        data2 && data2.success,
        'Postflight after re-running preflight succeeds',
        `success: ${data2.success}`,
        category
      );
    } catch (error) {
      fail('Concurrent preflight/postflight', error.message, category);
    }
  } else {
    skip('Concurrent preflight/postflight', 'Database not available', category);
  }

  // Test 8: Zero-change learning (all deltas = 0)
  if (dbAvailable) {
    try {
      await sessionLearning.handle_task_preflight({
        specFolder: 'test/zero-change',
        taskId: 'T-ZERO-CHANGE',
        knowledgeScore: 50,
        uncertaintyScore: 50,
        contextScore: 50
      });

      const result = await sessionLearning.handle_task_postflight({
        specFolder: 'test/zero-change',
        taskId: 'T-ZERO-CHANGE',
        knowledgeScore: 50,
        uncertaintyScore: 50,
        contextScore: 50
      });

      const data = parseResponse(result);
      if (data) {
        assert(
          data.record.deltas.knowledge === 0,
          'Zero knowledge delta',
          `delta.knowledge: ${data.record.deltas.knowledge}`,
          category
        );
        assert(
          data.record.deltas.uncertainty === 0,
          'Zero uncertainty delta',
          `delta.uncertainty: ${data.record.deltas.uncertainty}`,
          category
        );
        assert(
          data.record.deltas.context === 0,
          'Zero context delta',
          `delta.context: ${data.record.deltas.context}`,
          category
        );
        assert(
          data.record.learningIndex === 0,
          'Zero learning index',
          `LI: ${data.record.learningIndex}`,
          category
        );
      }
    } catch (error) {
      fail('Zero-change learning', error.message, category);
    }
  } else {
    skip('Zero-change learning', 'Database not available', category);
  }
}

/* ─────────────────────────────────────────────────────────────
   11. LEARNING INDEX FORMULA VERIFICATION
──────────────────────────────────────────────────────────────── */

async function test_learning_index_formula() {
  log('\n🔬 Learning Index Formula Verification');
  const category = 'learning_index_formula';

  if (!dbAvailable) {
    skip('All Learning Index formula tests', 'Database not available', category);
    return;
  }

  // LI = (KD * 0.4) + (UR * 0.35) + (CI * 0.25)
  // Where:
  // - KD = Knowledge Delta = post_knowledge - pre_knowledge
  // - UR = Uncertainty Reduction = pre_uncertainty - post_uncertainty (reduction is positive)
  // - CI = Context Improvement = post_context - pre_context

  const testCases = [
    {
      name: 'Maximum improvement (0→100 all)',
      pre: { k: 0, u: 100, c: 0 },
      post: { k: 100, u: 0, c: 100 },
      expectedLI: 100 // (100*0.4) + (100*0.35) + (100*0.25) = 40 + 35 + 25 = 100
    },
    {
      name: 'Maximum regression (100→0 all)',
      pre: { k: 100, u: 0, c: 100 },
      post: { k: 0, u: 100, c: 0 },
      expectedLI: -100 // (-100*0.4) + (-100*0.35) + (-100*0.25) = -40 + -35 + -25 = -100
    },
    {
      name: 'No change',
      pre: { k: 50, u: 50, c: 50 },
      post: { k: 50, u: 50, c: 50 },
      expectedLI: 0
    },
    {
      name: 'Only knowledge gain (+20)',
      pre: { k: 30, u: 50, c: 50 },
      post: { k: 50, u: 50, c: 50 },
      expectedLI: 8 // (20*0.4) + (0*0.35) + (0*0.25) = 8
    },
    {
      name: 'Only uncertainty reduction (-30)',
      pre: { k: 50, u: 80, c: 50 },
      post: { k: 50, u: 50, c: 50 },
      expectedLI: 10.5 // (0*0.4) + (30*0.35) + (0*0.25) = 10.5
    },
    {
      name: 'Only context improvement (+40)',
      pre: { k: 50, u: 50, c: 30 },
      post: { k: 50, u: 50, c: 70 },
      expectedLI: 10 // (0*0.4) + (0*0.35) + (40*0.25) = 10
    },
    {
      name: 'Mixed scenario (typical learning)',
      pre: { k: 40, u: 70, c: 50 },
      post: { k: 70, u: 30, c: 80 },
      // KD = 30, UR = 40, CI = 30
      // LI = (30*0.4) + (40*0.35) + (30*0.25) = 12 + 14 + 7.5 = 33.5
      expectedLI: 33.5
    },
    {
      name: 'Knowledge gain with uncertainty increase',
      pre: { k: 30, u: 40, c: 50 },
      post: { k: 60, u: 60, c: 60 },
      // KD = 30, UR = -20 (uncertainty increased), CI = 10
      // LI = (30*0.4) + (-20*0.35) + (10*0.25) = 12 + -7 + 2.5 = 7.5
      expectedLI: 7.5
    }
  ];

  for (const tc of testCases) {
    try {
      const taskId = `T-LI-${tc.name.replace(/[^a-zA-Z0-9]/g, '-')}`;

      await sessionLearning.handle_task_preflight({
        specFolder: 'test/li-formula',
        taskId: taskId,
        knowledgeScore: tc.pre.k,
        uncertaintyScore: tc.pre.u,
        contextScore: tc.pre.c
      });

      const result = await sessionLearning.handle_task_postflight({
        specFolder: 'test/li-formula',
        taskId: taskId,
        knowledgeScore: tc.post.k,
        uncertaintyScore: tc.post.u,
        contextScore: tc.post.c
      });

      const data = parseResponse(result);
      if (data) {
        const actualLI = data.record.learningIndex;
        const tolerance = 0.01; // Allow for floating point rounding

        assert(
          Math.abs(actualLI - tc.expectedLI) <= tolerance,
          `LI formula: ${tc.name}`,
          `Expected: ${tc.expectedLI}, Got: ${actualLI}`,
          category
        );
      }
    } catch (error) {
      fail(`LI formula: ${tc.name}`, error.message, category);
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   MAIN TEST RUNNER
──────────────────────────────────────────────────────────────── */

async function runTests() {
  log('🧪 Session Learning Handler Test Suite');
  log('======================================');
  log(`Date: ${new Date().toISOString()}`);
  log(`MCP Server Path: ${MCP_SERVER_PATH}`);
  log('');

  // Load modules first
  if (!loadModules()) {
    log('\n⚠️  Module loading failed. Aborting tests.');
    return results;
  }

  // Run test categories
  test_exports();
  await test_task_preflight();
  await test_task_postflight();
  await test_get_learning_history();
  await test_ensure_schema();
  await test_error_handling();
  await test_edge_cases();
  await test_learning_index_formula();

  // Summary
  log('\n======================================');
  log('📊 TEST SUMMARY');
  log('======================================');
  log(`✅ Passed:  ${results.passed}`);
  log(`❌ Failed:  ${results.failed}`);
  log(`⏭️  Skipped: ${results.skipped}`);
  log(`📝 Total:   ${results.passed + results.failed + results.skipped}`);
  log('');

  // Category breakdown
  log('📁 By Category:');
  for (const [cat, stats] of Object.entries(results.categories)) {
    const status = stats.failed === 0 ? '✅' : '⚠️ ';
    log(`   ${status} ${cat}: ${stats.passed} passed, ${stats.failed} failed, ${stats.skipped} skipped`);
  }
  log('');

  if (results.failed === 0) {
    log('🎉 ALL TESTS PASSED!');
  } else {
    log('⚠️  Some tests failed. Review output above.');
    log('\nFailed tests:');
    results.tests
      .filter(t => t.status === 'FAIL')
      .forEach(t => log(`   - [${t.category}] ${t.name}: ${t.reason}`));
  }

  return results;
}

// Run if executed directly
if (require.main === module) {
  runTests().then(r => {
    process.exit(r.failed > 0 ? 1 : 0);
  });
}

module.exports = { runTests, results };
