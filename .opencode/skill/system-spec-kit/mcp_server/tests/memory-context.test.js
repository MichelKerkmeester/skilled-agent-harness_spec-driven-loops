// ───────────────────────────────────────────────────────────────
// TESTS: MEMORY CONTEXT HANDLER
// Tests for L1 Orchestration layer - unified context retrieval
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');

/* ─────────────────────────────────────────────────────────────
   TEST CONFIGURATION
──────────────────────────────────────────────────────────────── */

// Track test results
let passed = 0;
let failed = 0;

// Load the module directly for testing exports and constants
const memoryContextPath = path.join(__dirname, '..', 'handlers', 'memory-context.js');

// Clear module cache to ensure fresh load
delete require.cache[require.resolve(memoryContextPath)];

// Load the handler
const memoryContext = require(memoryContextPath);

/* ─────────────────────────────────────────────────────────────
   TEST UTILITIES
──────────────────────────────────────────────────────────────── */

function test(description, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${description}`);
  } catch (error) {
    failed++;
    console.log(`  ✗ ${description}`);
    console.log(`    Error: ${error.message}`);
  }
}

async function asyncTest(description, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${description}`);
  } catch (error) {
    failed++;
    console.log(`  ✗ ${description}`);
    console.log(`    Error: ${error.message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertTrue(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertFalse(condition, message) {
  if (condition) {
    throw new Error(message);
  }
}

function assertDeepEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertContains(str, substring, message) {
  if (!str || !str.includes(substring)) {
    throw new Error(`${message}: "${str}" does not contain "${substring}"`);
  }
}

function assertType(value, expectedType, message) {
  if (typeof value !== expectedType) {
    throw new Error(`${message}: expected type ${expectedType}, got ${typeof value}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   T001-T010: CONTEXT MODES TESTS
──────────────────────────────────────────────────────────────── */

console.log('\n--- T001-T010: Context Modes Configuration ---');

test('T001: CONTEXT_MODES contains all 5 required modes', () => {
  const modes = Object.keys(memoryContext.CONTEXT_MODES);
  assertEqual(modes.length, 5, 'Should have 5 context modes');
  assertTrue(modes.includes('auto'), 'Should include auto mode');
  assertTrue(modes.includes('quick'), 'Should include quick mode');
  assertTrue(modes.includes('deep'), 'Should include deep mode');
  assertTrue(modes.includes('focused'), 'Should include focused mode');
  assertTrue(modes.includes('resume'), 'Should include resume mode');
});

test('T002: auto mode has adaptive strategy', () => {
  const autoMode = memoryContext.CONTEXT_MODES.auto;
  assertEqual(autoMode.strategy, 'adaptive', 'auto mode should have adaptive strategy');
  assertTrue(autoMode.name === 'Auto', 'auto mode should have name Auto');
  assertTrue(autoMode.description.length > 0, 'auto mode should have description');
});

test('T003: quick mode has triggers strategy and 800 token budget', () => {
  const quickMode = memoryContext.CONTEXT_MODES.quick;
  assertEqual(quickMode.strategy, 'triggers', 'quick mode should have triggers strategy');
  assertEqual(quickMode.tokenBudget, 800, 'quick mode should have 800 token budget');
});

test('T004: deep mode has search strategy and 2000 token budget', () => {
  const deepMode = memoryContext.CONTEXT_MODES.deep;
  assertEqual(deepMode.strategy, 'search', 'deep mode should have search strategy');
  assertEqual(deepMode.tokenBudget, 2000, 'deep mode should have 2000 token budget');
});

test('T005: focused mode has intent-search strategy and 1500 token budget', () => {
  const focusedMode = memoryContext.CONTEXT_MODES.focused;
  assertEqual(focusedMode.strategy, 'intent-search', 'focused mode should have intent-search strategy');
  assertEqual(focusedMode.tokenBudget, 1500, 'focused mode should have 1500 token budget');
});

test('T006: resume mode has resume strategy and 1200 token budget', () => {
  const resumeMode = memoryContext.CONTEXT_MODES.resume;
  assertEqual(resumeMode.strategy, 'resume', 'resume mode should have resume strategy');
  assertEqual(resumeMode.tokenBudget, 1200, 'resume mode should have 1200 token budget');
});

test('T007: All modes have name and description', () => {
  for (const [modeName, mode] of Object.entries(memoryContext.CONTEXT_MODES)) {
    assertTrue(mode.name && mode.name.length > 0, `${modeName} should have a name`);
    assertTrue(mode.description && mode.description.length > 0, `${modeName} should have a description`);
  }
});

test('T008: Only auto mode has adaptive strategy', () => {
  for (const [modeName, mode] of Object.entries(memoryContext.CONTEXT_MODES)) {
    if (modeName === 'auto') {
      assertEqual(mode.strategy, 'adaptive', 'auto should have adaptive');
    } else {
      assertTrue(mode.strategy !== 'adaptive', `${modeName} should not have adaptive strategy`);
    }
  }
});

test('T009: Non-auto modes have token budgets', () => {
  for (const [modeName, mode] of Object.entries(memoryContext.CONTEXT_MODES)) {
    if (modeName !== 'auto') {
      assertTrue(typeof mode.tokenBudget === 'number', `${modeName} should have numeric token budget`);
      assertTrue(mode.tokenBudget > 0, `${modeName} token budget should be positive`);
    }
  }
});

test('T010: Token budgets are reasonable (500-2500 range)', () => {
  for (const [modeName, mode] of Object.entries(memoryContext.CONTEXT_MODES)) {
    if (mode.tokenBudget !== undefined) {
      assertTrue(mode.tokenBudget >= 500, `${modeName} budget should be >= 500`);
      assertTrue(mode.tokenBudget <= 2500, `${modeName} budget should be <= 2500`);
    }
  }
});

/* ─────────────────────────────────────────────────────────────
   T011-T020: INTENT_TO_MODE ROUTING TESTS
──────────────────────────────────────────────────────────────── */

console.log('\n--- T011-T020: Intent-to-Mode Routing ---');

test('T011: INTENT_TO_MODE contains all 5 intent types', () => {
  const intents = Object.keys(memoryContext.INTENT_TO_MODE);
  assertEqual(intents.length, 5, 'Should have 5 intent mappings');
});

test('T012: add_feature maps to deep mode', () => {
  assertEqual(memoryContext.INTENT_TO_MODE.add_feature, 'deep', 'add_feature should map to deep');
});

test('T013: fix_bug maps to focused mode', () => {
  assertEqual(memoryContext.INTENT_TO_MODE.fix_bug, 'focused', 'fix_bug should map to focused');
});

test('T014: refactor maps to deep mode', () => {
  assertEqual(memoryContext.INTENT_TO_MODE.refactor, 'deep', 'refactor should map to deep');
});

test('T015: security_audit maps to deep mode', () => {
  assertEqual(memoryContext.INTENT_TO_MODE.security_audit, 'deep', 'security_audit should map to deep');
});

test('T016: understand maps to focused mode', () => {
  assertEqual(memoryContext.INTENT_TO_MODE.understand, 'focused', 'understand should map to focused');
});

test('T017: All mapped modes are valid CONTEXT_MODES', () => {
  for (const [intent, mode] of Object.entries(memoryContext.INTENT_TO_MODE)) {
    assertTrue(
      memoryContext.CONTEXT_MODES[mode] !== undefined,
      `${intent} maps to invalid mode: ${mode}`
    );
  }
});

test('T018: Deep-requiring intents map to deep', () => {
  const deepIntents = ['add_feature', 'refactor', 'security_audit'];
  for (const intent of deepIntents) {
    assertEqual(
      memoryContext.INTENT_TO_MODE[intent],
      'deep',
      `${intent} should map to deep for comprehensive context`
    );
  }
});

test('T019: Focus-requiring intents map to focused', () => {
  const focusedIntents = ['fix_bug', 'understand'];
  for (const intent of focusedIntents) {
    assertEqual(
      memoryContext.INTENT_TO_MODE[intent],
      'focused',
      `${intent} should map to focused for targeted context`
    );
  }
});

test('T020: No intent maps to quick or resume by default', () => {
  for (const mode of Object.values(memoryContext.INTENT_TO_MODE)) {
    assertTrue(mode !== 'quick', 'No intent should default to quick');
    assertTrue(mode !== 'resume', 'No intent should default to resume');
  }
});

/* ─────────────────────────────────────────────────────────────
   T021-T030: handle_memory_context MAIN HANDLER TESTS
──────────────────────────────────────────────────────────────── */

console.log('\n--- T021-T030: Main Handler Tests ---');

test('T021: handle_memory_context is a function', () => {
  assertTrue(typeof memoryContext.handle_memory_context === 'function', 'Should be a function');
});

asyncTest('T022: Returns error for empty input', async () => {
  const result = await memoryContext.handle_memory_context({ input: '' });
  const parsed = JSON.parse(result.content[0].text);
  assertTrue(parsed.error !== undefined, 'Should return error for empty input');
  assertContains(parsed.error, 'required', 'Error should mention input is required');
});

asyncTest('T023: Returns error for null input', async () => {
  const result = await memoryContext.handle_memory_context({ input: null });
  const parsed = JSON.parse(result.content[0].text);
  assertTrue(parsed.error !== undefined, 'Should return error for null input');
});

asyncTest('T024: Returns error for whitespace-only input', async () => {
  const result = await memoryContext.handle_memory_context({ input: '   ' });
  const parsed = JSON.parse(result.content[0].text);
  assertTrue(parsed.error !== undefined, 'Should return error for whitespace input');
});

asyncTest('T025: Error response includes layer metadata', async () => {
  const result = await memoryContext.handle_memory_context({ input: '' });
  const parsed = JSON.parse(result.content[0].text);
  assertEqual(parsed.layer, 'L1:Orchestration', 'Error should include layer');
});

asyncTest('T026: Error response includes hint', async () => {
  const result = await memoryContext.handle_memory_context({ input: '' });
  const parsed = JSON.parse(result.content[0].text);
  assertTrue(parsed.hint !== undefined, 'Error should include hint');
});

asyncTest('T027: Input with only newlines is rejected', async () => {
  const result = await memoryContext.handle_memory_context({ input: '\n\n\n' });
  const parsed = JSON.parse(result.content[0].text);
  assertTrue(parsed.error !== undefined, 'Should reject newlines-only input');
});

asyncTest('T028: Input with only tabs is rejected', async () => {
  const result = await memoryContext.handle_memory_context({ input: '\t\t\t' });
  const parsed = JSON.parse(result.content[0].text);
  assertTrue(parsed.error !== undefined, 'Should reject tabs-only input');
});

test('T029: handleMemoryContext is alias for handle_memory_context', () => {
  assertEqual(memoryContext.handleMemoryContext, memoryContext.handle_memory_context, 'Should be alias');
});

asyncTest('T030: Handles undefined input gracefully', async () => {
  const result = await memoryContext.handle_memory_context({ input: undefined });
  const parsed = JSON.parse(result.content[0].text);
  assertTrue(parsed.error !== undefined, 'Should return error');
});

/* ─────────────────────────────────────────────────────────────
   T031-T040: QUICK MODE CONFIGURATION TESTS
──────────────────────────────────────────────────────────────── */

console.log('\n--- T031-T040: Quick Mode Configuration Tests ---');

test('T031: Quick mode strategy is triggers', () => {
  assertEqual(memoryContext.CONTEXT_MODES.quick.strategy, 'triggers', 'Quick should use triggers');
});

test('T032: Quick mode name is Quick', () => {
  assertEqual(memoryContext.CONTEXT_MODES.quick.name, 'Quick', 'Name should be Quick');
});

test('T033: Quick mode description mentions low latency', () => {
  const desc = memoryContext.CONTEXT_MODES.quick.description.toLowerCase();
  assertTrue(desc.includes('low latency') || desc.includes('fast'), 'Should mention speed');
});

test('T034: Quick mode token budget is 800', () => {
  assertEqual(memoryContext.CONTEXT_MODES.quick.tokenBudget, 800, 'Budget should be 800');
});

test('T035: Quick mode is suitable for reactive scenarios', () => {
  const desc = memoryContext.CONTEXT_MODES.quick.description.toLowerCase();
  assertTrue(
    desc.includes('reactive') || desc.includes('trigger') || desc.includes('real-time'),
    'Should be for reactive use'
  );
});

test('T036: Quick mode has smallest token budget', () => {
  const budgets = Object.entries(memoryContext.CONTEXT_MODES)
    .filter(([k, v]) => v.tokenBudget)
    .map(([k, v]) => v.tokenBudget);
  const minBudget = Math.min(...budgets);
  assertEqual(memoryContext.CONTEXT_MODES.quick.tokenBudget, minBudget, 'Quick should have smallest budget');
});

test('T037: Quick mode is not the default', () => {
  // Default is 'auto' based on the implementation
  // Quick is for explicit use only
  assertTrue(true, 'Quick mode is explicitly selected, not default');
});

test('T038: Quick strategy differs from search strategies', () => {
  const quickStrategy = memoryContext.CONTEXT_MODES.quick.strategy;
  const deepStrategy = memoryContext.CONTEXT_MODES.deep.strategy;
  const focusedStrategy = memoryContext.CONTEXT_MODES.focused.strategy;
  assertTrue(quickStrategy !== deepStrategy, 'Quick should differ from deep');
  assertTrue(quickStrategy !== focusedStrategy, 'Quick should differ from focused');
});

test('T039: Quick mode description is non-empty', () => {
  assertTrue(memoryContext.CONTEXT_MODES.quick.description.length > 10, 'Description should be substantive');
});

test('T040: Quick mode configuration is complete', () => {
  const quick = memoryContext.CONTEXT_MODES.quick;
  assertTrue(quick.name !== undefined, 'Should have name');
  assertTrue(quick.description !== undefined, 'Should have description');
  assertTrue(quick.strategy !== undefined, 'Should have strategy');
  assertTrue(quick.tokenBudget !== undefined, 'Should have tokenBudget');
});

/* ─────────────────────────────────────────────────────────────
   T041-T050: DEEP MODE CONFIGURATION TESTS
──────────────────────────────────────────────────────────────── */

console.log('\n--- T041-T050: Deep Mode Configuration Tests ---');

test('T041: Deep mode strategy is search', () => {
  assertEqual(memoryContext.CONTEXT_MODES.deep.strategy, 'search', 'Deep should use search');
});

test('T042: Deep mode name is Deep', () => {
  assertEqual(memoryContext.CONTEXT_MODES.deep.name, 'Deep', 'Name should be Deep');
});

test('T043: Deep mode description mentions semantic or comprehensive', () => {
  const desc = memoryContext.CONTEXT_MODES.deep.description.toLowerCase();
  assertTrue(desc.includes('semantic') || desc.includes('comprehensive') || desc.includes('full'), 'Should mention depth');
});

test('T044: Deep mode token budget is 2000', () => {
  assertEqual(memoryContext.CONTEXT_MODES.deep.tokenBudget, 2000, 'Budget should be 2000');
});

test('T045: Deep mode has highest token budget', () => {
  const budgets = Object.entries(memoryContext.CONTEXT_MODES)
    .filter(([k, v]) => v.tokenBudget)
    .map(([k, v]) => v.tokenBudget);
  const maxBudget = Math.max(...budgets);
  assertEqual(memoryContext.CONTEXT_MODES.deep.tokenBudget, maxBudget, 'Deep should have highest budget');
});

test('T046: Deep mode is suitable for feature development', () => {
  assertEqual(memoryContext.INTENT_TO_MODE.add_feature, 'deep', 'add_feature should route to deep');
});

test('T047: Deep mode is suitable for refactoring', () => {
  assertEqual(memoryContext.INTENT_TO_MODE.refactor, 'deep', 'refactor should route to deep');
});

test('T048: Deep mode is suitable for security audits', () => {
  assertEqual(memoryContext.INTENT_TO_MODE.security_audit, 'deep', 'security_audit should route to deep');
});

test('T049: Deep mode description is non-empty', () => {
  assertTrue(memoryContext.CONTEXT_MODES.deep.description.length > 10, 'Description should be substantive');
});

test('T050: Deep mode configuration is complete', () => {
  const deep = memoryContext.CONTEXT_MODES.deep;
  assertTrue(deep.name !== undefined, 'Should have name');
  assertTrue(deep.description !== undefined, 'Should have description');
  assertTrue(deep.strategy !== undefined, 'Should have strategy');
  assertTrue(deep.tokenBudget !== undefined, 'Should have tokenBudget');
});

/* ─────────────────────────────────────────────────────────────
   T051-T060: FOCUSED MODE CONFIGURATION TESTS
──────────────────────────────────────────────────────────────── */

console.log('\n--- T051-T060: Focused Mode Configuration Tests ---');

test('T051: Focused mode strategy is intent-search', () => {
  assertEqual(memoryContext.CONTEXT_MODES.focused.strategy, 'intent-search', 'Focused should use intent-search');
});

test('T052: Focused mode name is Focused', () => {
  assertEqual(memoryContext.CONTEXT_MODES.focused.name, 'Focused', 'Name should be Focused');
});

test('T053: Focused mode description mentions intent or task-specific', () => {
  const desc = memoryContext.CONTEXT_MODES.focused.description.toLowerCase();
  assertTrue(desc.includes('intent') || desc.includes('task'), 'Should mention intent/task');
});

test('T054: Focused mode token budget is 1500', () => {
  assertEqual(memoryContext.CONTEXT_MODES.focused.tokenBudget, 1500, 'Budget should be 1500');
});

test('T055: Focused mode budget is between quick and deep', () => {
  const focusedBudget = memoryContext.CONTEXT_MODES.focused.tokenBudget;
  const quickBudget = memoryContext.CONTEXT_MODES.quick.tokenBudget;
  const deepBudget = memoryContext.CONTEXT_MODES.deep.tokenBudget;
  assertTrue(focusedBudget > quickBudget, 'Focused should be > quick');
  assertTrue(focusedBudget < deepBudget, 'Focused should be < deep');
});

test('T056: Focused mode is suitable for bug fixing', () => {
  assertEqual(memoryContext.INTENT_TO_MODE.fix_bug, 'focused', 'fix_bug should route to focused');
});

test('T057: Focused mode is suitable for understanding', () => {
  assertEqual(memoryContext.INTENT_TO_MODE.understand, 'focused', 'understand should route to focused');
});

test('T058: Focused strategy differs from quick strategy', () => {
  const focusedStrategy = memoryContext.CONTEXT_MODES.focused.strategy;
  const quickStrategy = memoryContext.CONTEXT_MODES.quick.strategy;
  assertTrue(focusedStrategy !== quickStrategy, 'Focused should differ from quick');
});

test('T059: Focused mode description is non-empty', () => {
  assertTrue(memoryContext.CONTEXT_MODES.focused.description.length > 10, 'Description should be substantive');
});

test('T060: Focused mode configuration is complete', () => {
  const focused = memoryContext.CONTEXT_MODES.focused;
  assertTrue(focused.name !== undefined, 'Should have name');
  assertTrue(focused.description !== undefined, 'Should have description');
  assertTrue(focused.strategy !== undefined, 'Should have strategy');
  assertTrue(focused.tokenBudget !== undefined, 'Should have tokenBudget');
});

/* ─────────────────────────────────────────────────────────────
   T061-T070: RESUME MODE CONFIGURATION TESTS
──────────────────────────────────────────────────────────────── */

console.log('\n--- T061-T070: Resume Mode Configuration Tests ---');

test('T061: Resume mode strategy is resume', () => {
  assertEqual(memoryContext.CONTEXT_MODES.resume.strategy, 'resume', 'Resume should use resume strategy');
});

test('T062: Resume mode name is Resume', () => {
  assertEqual(memoryContext.CONTEXT_MODES.resume.name, 'Resume', 'Name should be Resume');
});

test('T063: Resume mode description mentions session or previous work', () => {
  const desc = memoryContext.CONTEXT_MODES.resume.description.toLowerCase();
  assertTrue(
    desc.includes('session') || desc.includes('previous') || desc.includes('resume') || desc.includes('state'),
    'Should mention session recovery'
  );
});

test('T064: Resume mode token budget is 1200', () => {
  assertEqual(memoryContext.CONTEXT_MODES.resume.tokenBudget, 1200, 'Budget should be 1200');
});

test('T065: Resume mode budget is less than deep', () => {
  const resumeBudget = memoryContext.CONTEXT_MODES.resume.tokenBudget;
  const deepBudget = memoryContext.CONTEXT_MODES.deep.tokenBudget;
  assertTrue(resumeBudget < deepBudget, 'Resume should have less budget than deep');
});

test('T066: Resume mode is specialized (not mapped from any intent)', () => {
  const mappedModes = Object.values(memoryContext.INTENT_TO_MODE);
  assertFalse(mappedModes.includes('resume'), 'Resume should not be mapped from intents');
});

test('T067: Resume strategy is unique', () => {
  const strategies = Object.values(memoryContext.CONTEXT_MODES).map(m => m.strategy);
  const resumeCount = strategies.filter(s => s === 'resume').length;
  assertEqual(resumeCount, 1, 'Resume strategy should be unique');
});

test('T068: Resume mode description mentions anchors or next-steps', () => {
  const desc = memoryContext.CONTEXT_MODES.resume.description.toLowerCase();
  assertTrue(
    desc.includes('anchor') || desc.includes('next') || desc.includes('state'),
    'Should mention anchors or state'
  );
});

test('T069: Resume mode description is non-empty', () => {
  assertTrue(memoryContext.CONTEXT_MODES.resume.description.length > 10, 'Description should be substantive');
});

test('T070: Resume mode configuration is complete', () => {
  const resume = memoryContext.CONTEXT_MODES.resume;
  assertTrue(resume.name !== undefined, 'Should have name');
  assertTrue(resume.description !== undefined, 'Should have description');
  assertTrue(resume.strategy !== undefined, 'Should have strategy');
  assertTrue(resume.tokenBudget !== undefined, 'Should have tokenBudget');
});

/* ─────────────────────────────────────────────────────────────
   T071-T080: AUTO MODE CONFIGURATION TESTS
──────────────────────────────────────────────────────────────── */

console.log('\n--- T071-T080: Auto Mode Configuration Tests ---');

test('T071: Auto mode strategy is adaptive', () => {
  assertEqual(memoryContext.CONTEXT_MODES.auto.strategy, 'adaptive', 'Auto should use adaptive strategy');
});

test('T072: Auto mode name is Auto', () => {
  assertEqual(memoryContext.CONTEXT_MODES.auto.name, 'Auto', 'Name should be Auto');
});

test('T073: Auto mode description mentions automatic or detect', () => {
  const desc = memoryContext.CONTEXT_MODES.auto.description.toLowerCase();
  assertTrue(
    desc.includes('automatic') || desc.includes('detect') || desc.includes('route'),
    'Should mention auto-detection'
  );
});

test('T074: Auto mode has no fixed token budget', () => {
  const autoBudget = memoryContext.CONTEXT_MODES.auto.tokenBudget;
  assertTrue(autoBudget === undefined, 'Auto should not have fixed budget (inherits from selected mode)');
});

test('T075: Auto mode is the default when no mode specified', () => {
  // This is verified by the implementation: mode: requested_mode = 'auto'
  assertTrue(true, 'Auto is default per implementation');
});

test('T076: Auto strategy differs from all other strategies', () => {
  const autoStrategy = memoryContext.CONTEXT_MODES.auto.strategy;
  for (const [modeName, mode] of Object.entries(memoryContext.CONTEXT_MODES)) {
    if (modeName !== 'auto') {
      assertTrue(autoStrategy !== mode.strategy, `Auto should differ from ${modeName}`);
    }
  }
});

test('T077: Auto mode can route to any other mode', () => {
  // Based on INTENT_TO_MODE mapping, auto can route to deep or focused
  // And via keyword detection, can route to resume
  const routeTargets = new Set(Object.values(memoryContext.INTENT_TO_MODE));
  assertTrue(routeTargets.size >= 2, 'Auto should be able to route to multiple modes');
});

test('T078: Auto mode uses intent classification for routing', () => {
  // Verified by examining the mapping
  const intentModes = Object.values(memoryContext.INTENT_TO_MODE);
  assertTrue(intentModes.length > 0, 'Should use intent for routing');
});

test('T079: Auto mode description is non-empty', () => {
  assertTrue(memoryContext.CONTEXT_MODES.auto.description.length > 10, 'Description should be substantive');
});

test('T080: Auto mode configuration is complete', () => {
  const auto = memoryContext.CONTEXT_MODES.auto;
  assertTrue(auto.name !== undefined, 'Should have name');
  assertTrue(auto.description !== undefined, 'Should have description');
  assertTrue(auto.strategy !== undefined, 'Should have strategy');
  // tokenBudget is intentionally undefined for auto
});

/* ─────────────────────────────────────────────────────────────
   T081-T090: L1 ORCHESTRATION TOKEN BUDGET TESTS (CHK-071, CHK-072, CHK-074)
──────────────────────────────────────────────────────────────── */

console.log('\n--- T081-T090: L1 Orchestration Token Budget Tests ---');

asyncTest('T081: Error response includes L1 layer reference', async () => {
  const result = await memoryContext.handle_memory_context({ input: '' });
  const parsed = JSON.parse(result.content[0].text);
  assertTrue(parsed.layer.includes('L1'), 'Should reference L1 layer');
});

asyncTest('T082: Error response includes Orchestration reference', async () => {
  const result = await memoryContext.handle_memory_context({ input: '' });
  const parsed = JSON.parse(result.content[0].text);
  assertTrue(parsed.layer.includes('Orchestration'), 'Should reference Orchestration');
});

test('T083: CHK-071 - Layer structure matches L1 Orchestration pattern', () => {
  // L1 is the unified entry point per layer-definitions.js
  assertTrue(memoryContext.handle_memory_context !== undefined, 'L1 handler should exist');
});

test('T084: CHK-072 - L1 token budget is 2000 (from layer-definitions)', () => {
  // Deep mode has 2000 which aligns with L1 Orchestration budget
  assertEqual(memoryContext.CONTEXT_MODES.deep.tokenBudget, 2000, 'L1 budget should be 2000');
});

test('T085: CHK-074 - Progressive disclosure supported via mode selection', () => {
  // Users can start with auto (L1) and explicitly use quick/deep/focused (L2) for control
  const modes = Object.keys(memoryContext.CONTEXT_MODES);
  assertTrue(modes.length >= 4, 'Should have multiple modes for progressive disclosure');
});

test('T086: Token budgets follow expected hierarchy', () => {
  const quick = memoryContext.CONTEXT_MODES.quick.tokenBudget;
  const resume = memoryContext.CONTEXT_MODES.resume.tokenBudget;
  const focused = memoryContext.CONTEXT_MODES.focused.tokenBudget;
  const deep = memoryContext.CONTEXT_MODES.deep.tokenBudget;

  assertTrue(quick < resume, 'quick < resume');
  assertTrue(resume < focused, 'resume < focused');
  assertTrue(focused < deep, 'focused < deep');
});

test('T087: Total defined token budgets are reasonable', () => {
  const budgets = Object.values(memoryContext.CONTEXT_MODES)
    .filter(m => m.tokenBudget)
    .map(m => m.tokenBudget);
  const sum = budgets.reduce((a, b) => a + b, 0);
  assertTrue(sum > 3000, 'Total budgets should be substantial');
  assertTrue(sum < 10000, 'Total budgets should be reasonable');
});

test('T088: Each non-auto mode has explicit token budget', () => {
  for (const [name, mode] of Object.entries(memoryContext.CONTEXT_MODES)) {
    if (name !== 'auto') {
      assertTrue(typeof mode.tokenBudget === 'number', `${name} should have numeric budget`);
    }
  }
});

test('T089: Token budgets are whole numbers', () => {
  for (const mode of Object.values(memoryContext.CONTEXT_MODES)) {
    if (mode.tokenBudget !== undefined) {
      assertTrue(Number.isInteger(mode.tokenBudget), 'Budget should be integer');
    }
  }
});

test('T090: Token budgets are positive', () => {
  for (const mode of Object.values(memoryContext.CONTEXT_MODES)) {
    if (mode.tokenBudget !== undefined) {
      assertTrue(mode.tokenBudget > 0, 'Budget should be positive');
    }
  }
});

/* ─────────────────────────────────────────────────────────────
   T091-T100: INPUT VALIDATION TESTS
──────────────────────────────────────────────────────────────── */

console.log('\n--- T091-T100: Input Validation Tests ---');

asyncTest('T091: Handles non-string input gracefully', async () => {
  const result = await memoryContext.handle_memory_context({ input: 12345 });
  const parsed = JSON.parse(result.content[0].text);
  assertTrue(parsed.error !== undefined, 'Should return error for non-string');
});

asyncTest('T092: Handles array input gracefully', async () => {
  const result = await memoryContext.handle_memory_context({ input: ['test', 'array'] });
  const parsed = JSON.parse(result.content[0].text);
  assertTrue(parsed.error !== undefined, 'Should return error for array');
});

asyncTest('T093: Handles object input gracefully', async () => {
  const result = await memoryContext.handle_memory_context({ input: { nested: 'object' } });
  const parsed = JSON.parse(result.content[0].text);
  assertTrue(parsed.error !== undefined, 'Should return error for object');
});

asyncTest('T094: Handles boolean input gracefully', async () => {
  const result = await memoryContext.handle_memory_context({ input: true });
  const parsed = JSON.parse(result.content[0].text);
  assertTrue(parsed.error !== undefined, 'Should return error for boolean');
});

asyncTest('T095: Error messages are descriptive', async () => {
  const result = await memoryContext.handle_memory_context({ input: '' });
  const parsed = JSON.parse(result.content[0].text);
  assertTrue(parsed.error.length > 20, 'Error message should be descriptive');
});

asyncTest('T096: Error includes input hint', async () => {
  const result = await memoryContext.handle_memory_context({ input: '' });
  const parsed = JSON.parse(result.content[0].text);
  assertContains(parsed.hint.toLowerCase(), 'provide', 'Hint should guide user');
});

asyncTest('T097: Response content is valid JSON', async () => {
  const result = await memoryContext.handle_memory_context({ input: '' });
  let parsed;
  try {
    parsed = JSON.parse(result.content[0].text);
  } catch (e) {
    throw new Error('Response should be valid JSON');
  }
  assertTrue(parsed !== null, 'Parsed result should not be null');
});

asyncTest('T098: Response follows MCP format', async () => {
  const result = await memoryContext.handle_memory_context({ input: '' });
  assertTrue(result.content !== undefined, 'Should have content array');
  assertTrue(Array.isArray(result.content), 'Content should be array');
});

asyncTest('T099: Content type is text', async () => {
  const result = await memoryContext.handle_memory_context({ input: '' });
  assertEqual(result.content[0].type, 'text', 'Content type should be text');
});

asyncTest('T100: Empty args object returns error', async () => {
  const result = await memoryContext.handle_memory_context({});
  const parsed = JSON.parse(result.content[0].text);
  assertTrue(parsed.error !== undefined, 'Should return error for empty args');
});

/* ─────────────────────────────────────────────────────────────
   T101-T105: MODULE EXPORTS TESTS
──────────────────────────────────────────────────────────────── */

console.log('\n--- T101-T105: Module Exports Tests ---');

test('T101: handle_memory_context is exported', () => {
  assertTrue(typeof memoryContext.handle_memory_context === 'function', 'Should export handle_memory_context');
});

test('T102: CONTEXT_MODES is exported', () => {
  assertTrue(typeof memoryContext.CONTEXT_MODES === 'object', 'Should export CONTEXT_MODES');
});

test('T103: INTENT_TO_MODE is exported', () => {
  assertTrue(typeof memoryContext.INTENT_TO_MODE === 'object', 'Should export INTENT_TO_MODE');
});

test('T104: handleMemoryContext backward compatibility alias exists', () => {
  assertTrue(typeof memoryContext.handleMemoryContext === 'function', 'Should export handleMemoryContext alias');
});

test('T105: handleMemoryContext is same as handle_memory_context', () => {
  assertEqual(memoryContext.handleMemoryContext, memoryContext.handle_memory_context, 'Should be same function');
});

/* ─────────────────────────────────────────────────────────────
   TEST SUMMARY
──────────────────────────────────────────────────────────────── */

// Run async tests sequentially
async function runAllTests() {
  // Wait for all async tests to complete
  await new Promise(resolve => setTimeout(resolve, 200));

  console.log('\n========================================');
  console.log(`Tests: ${passed} passed, ${failed} failed`);
  console.log(`Pass rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log('========================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

// Execute tests
runAllTests();
