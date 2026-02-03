// ───────────────────────────────────────────────────────────────
// TEST: LAYER DEFINITIONS (7-Layer MCP Architecture)
// T060: Layer architecture with token budgets
// ───────────────────────────────────────────────────────────────

(() => {
  'use strict';

  const path = require('path');

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ──────────────────────────────────────────────────────────────── */

  const LIB_PATH = path.join(__dirname, '..', 'lib', 'architecture');

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

  function pass(test_id, test_name, evidence) {
    results.passed++;
    results.tests.push({ id: test_id, name: test_name, status: 'PASS', evidence });
    log(`   ✅ ${test_id}: ${test_name}`);
    if (evidence) log(`      Evidence: ${evidence}`);
  }

  function fail(test_id, test_name, reason) {
    results.failed++;
    results.tests.push({ id: test_id, name: test_name, status: 'FAIL', reason });
    log(`   ❌ ${test_id}: ${test_name}`);
    log(`      Reason: ${reason}`);
  }

  function skip(test_id, test_name, reason) {
    results.skipped++;
    results.tests.push({ id: test_id, name: test_name, status: 'SKIP', reason });
    log(`   ⏭️  ${test_id}: ${test_name} (skipped: ${reason})`);
  }

  /* ─────────────────────────────────────────────────────────────
     3. MODULE LOADING
  ──────────────────────────────────────────────────────────────── */

  let layerDefs;

  function test_module_loads() {
    log('\n🔬 Module Loading');

    try {
      layerDefs = require(path.join(LIB_PATH, 'layer-definitions.js'));
      pass('T060-001', 'Module loads without error', 'require() succeeded');
    } catch (error) {
      fail('T060-001', 'Module loads without error', error.message);
      return false;
    }
    return true;
  }

  /* ─────────────────────────────────────────────────────────────
     4. TEST SUITES
  ──────────────────────────────────────────────────────────────── */

  // 4.1 LAYER_DEFINITIONS OBJECT TESTS (T060-010 to T060-020)

  function test_layer_definitions_object() {
    log('\n🔬 LAYER_DEFINITIONS Object - T060-010 to T060-020');

    const { LAYER_DEFINITIONS } = layerDefs;

    // T060-010: LAYER_DEFINITIONS exists
    if (LAYER_DEFINITIONS && typeof LAYER_DEFINITIONS === 'object') {
      pass('T060-010', 'LAYER_DEFINITIONS exists and is an object', `Type: ${typeof LAYER_DEFINITIONS}`);
    } else {
      fail('T060-010', 'LAYER_DEFINITIONS exists and is an object', `Got: ${typeof LAYER_DEFINITIONS}`);
      return;
    }

    // T060-011: Has exactly 7 layers (L1-L7)
    const layerKeys = Object.keys(LAYER_DEFINITIONS);
    if (layerKeys.length === 7) {
      pass('T060-011', 'LAYER_DEFINITIONS has exactly 7 layers', `Keys: ${layerKeys.join(', ')}`);
    } else {
      fail('T060-011', 'LAYER_DEFINITIONS has exactly 7 layers', `Expected 7, got ${layerKeys.length}: ${layerKeys.join(', ')}`);
    }

    // T060-012: Contains L1 through L7
    const expectedLayers = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];
    const hasAllLayers = expectedLayers.every(l => LAYER_DEFINITIONS[l]);
    if (hasAllLayers) {
      pass('T060-012', 'Contains L1 through L7', `All layers present`);
    } else {
      const missing = expectedLayers.filter(l => !LAYER_DEFINITIONS[l]);
      fail('T060-012', 'Contains L1 through L7', `Missing: ${missing.join(', ')}`);
    }

    // T060-013: L1 is Orchestration layer
    if (LAYER_DEFINITIONS.L1 && LAYER_DEFINITIONS.L1.name === 'Orchestration') {
      pass('T060-013', 'L1 is Orchestration layer', `Name: ${LAYER_DEFINITIONS.L1.name}`);
    } else {
      fail('T060-013', 'L1 is Orchestration layer', `Got: ${LAYER_DEFINITIONS.L1?.name}`);
    }

    // T060-014: L2 is Core layer
    if (LAYER_DEFINITIONS.L2 && LAYER_DEFINITIONS.L2.name === 'Core') {
      pass('T060-014', 'L2 is Core layer', `Name: ${LAYER_DEFINITIONS.L2.name}`);
    } else {
      fail('T060-014', 'L2 is Core layer', `Got: ${LAYER_DEFINITIONS.L2?.name}`);
    }

    // T060-015: L3 is Discovery layer
    if (LAYER_DEFINITIONS.L3 && LAYER_DEFINITIONS.L3.name === 'Discovery') {
      pass('T060-015', 'L3 is Discovery layer', `Name: ${LAYER_DEFINITIONS.L3.name}`);
    } else {
      fail('T060-015', 'L3 is Discovery layer', `Got: ${LAYER_DEFINITIONS.L3?.name}`);
    }

    // T060-016: L4 is Mutation layer
    if (LAYER_DEFINITIONS.L4 && LAYER_DEFINITIONS.L4.name === 'Mutation') {
      pass('T060-016', 'L4 is Mutation layer', `Name: ${LAYER_DEFINITIONS.L4.name}`);
    } else {
      fail('T060-016', 'L4 is Mutation layer', `Got: ${LAYER_DEFINITIONS.L4?.name}`);
    }

    // T060-017: L5 is Lifecycle layer
    if (LAYER_DEFINITIONS.L5 && LAYER_DEFINITIONS.L5.name === 'Lifecycle') {
      pass('T060-017', 'L5 is Lifecycle layer', `Name: ${LAYER_DEFINITIONS.L5.name}`);
    } else {
      fail('T060-017', 'L5 is Lifecycle layer', `Got: ${LAYER_DEFINITIONS.L5?.name}`);
    }

    // T060-018: L6 is Analysis layer
    if (LAYER_DEFINITIONS.L6 && LAYER_DEFINITIONS.L6.name === 'Analysis') {
      pass('T060-018', 'L6 is Analysis layer', `Name: ${LAYER_DEFINITIONS.L6.name}`);
    } else {
      fail('T060-018', 'L6 is Analysis layer', `Got: ${LAYER_DEFINITIONS.L6?.name}`);
    }

    // T060-019: L7 is Maintenance layer
    if (LAYER_DEFINITIONS.L7 && LAYER_DEFINITIONS.L7.name === 'Maintenance') {
      pass('T060-019', 'L7 is Maintenance layer', `Name: ${LAYER_DEFINITIONS.L7.name}`);
    } else {
      fail('T060-019', 'L7 is Maintenance layer', `Got: ${LAYER_DEFINITIONS.L7?.name}`);
    }

    // T060-020: Each layer has required properties (id, name, description, tokenBudget, priority, useCase, tools)
    const requiredProps = ['id', 'name', 'description', 'tokenBudget', 'priority', 'useCase', 'tools'];
    let allHaveProps = true;
    const missingProps = [];

    for (const layerId of expectedLayers) {
      const layer = LAYER_DEFINITIONS[layerId];
      for (const prop of requiredProps) {
        if (layer[prop] === undefined) {
          allHaveProps = false;
          missingProps.push(`${layerId}.${prop}`);
        }
      }
    }

    if (allHaveProps) {
      pass('T060-020', 'Each layer has required properties', `All 7 layers have: ${requiredProps.join(', ')}`);
    } else {
      fail('T060-020', 'Each layer has required properties', `Missing: ${missingProps.join(', ')}`);
    }
  }

  // 4.2 TOOL_LAYER_MAP TESTS (T060-030 to T060-040)

  function test_tool_layer_map() {
    log('\n🔬 TOOL_LAYER_MAP - T060-030 to T060-040');

    const { TOOL_LAYER_MAP, LAYER_DEFINITIONS } = layerDefs;

    // T060-030: TOOL_LAYER_MAP exists
    if (TOOL_LAYER_MAP && typeof TOOL_LAYER_MAP === 'object') {
      pass('T060-030', 'TOOL_LAYER_MAP exists and is an object', `Type: ${typeof TOOL_LAYER_MAP}`);
    } else {
      fail('T060-030', 'TOOL_LAYER_MAP exists and is an object', `Got: ${typeof TOOL_LAYER_MAP}`);
      return;
    }

    // T060-031: memory_context maps to L1
    if (TOOL_LAYER_MAP['memory_context'] === 'L1') {
      pass('T060-031', 'memory_context maps to L1', `Got: ${TOOL_LAYER_MAP['memory_context']}`);
    } else {
      fail('T060-031', 'memory_context maps to L1', `Expected L1, got: ${TOOL_LAYER_MAP['memory_context']}`);
    }

    // T060-032: memory_search maps to L2
    if (TOOL_LAYER_MAP['memory_search'] === 'L2') {
      pass('T060-032', 'memory_search maps to L2', `Got: ${TOOL_LAYER_MAP['memory_search']}`);
    } else {
      fail('T060-032', 'memory_search maps to L2', `Expected L2, got: ${TOOL_LAYER_MAP['memory_search']}`);
    }

    // T060-033: memory_save maps to L2
    if (TOOL_LAYER_MAP['memory_save'] === 'L2') {
      pass('T060-033', 'memory_save maps to L2', `Got: ${TOOL_LAYER_MAP['memory_save']}`);
    } else {
      fail('T060-033', 'memory_save maps to L2', `Expected L2, got: ${TOOL_LAYER_MAP['memory_save']}`);
    }

    // T060-034: memory_list maps to L3
    if (TOOL_LAYER_MAP['memory_list'] === 'L3') {
      pass('T060-034', 'memory_list maps to L3', `Got: ${TOOL_LAYER_MAP['memory_list']}`);
    } else {
      fail('T060-034', 'memory_list maps to L3', `Expected L3, got: ${TOOL_LAYER_MAP['memory_list']}`);
    }

    // T060-035: memory_update maps to L4
    if (TOOL_LAYER_MAP['memory_update'] === 'L4') {
      pass('T060-035', 'memory_update maps to L4', `Got: ${TOOL_LAYER_MAP['memory_update']}`);
    } else {
      fail('T060-035', 'memory_update maps to L4', `Expected L4, got: ${TOOL_LAYER_MAP['memory_update']}`);
    }

    // T060-036: checkpoint_create maps to L5
    if (TOOL_LAYER_MAP['checkpoint_create'] === 'L5') {
      pass('T060-036', 'checkpoint_create maps to L5', `Got: ${TOOL_LAYER_MAP['checkpoint_create']}`);
    } else {
      fail('T060-036', 'checkpoint_create maps to L5', `Expected L5, got: ${TOOL_LAYER_MAP['checkpoint_create']}`);
    }

    // T060-037: memory_drift_why maps to L6
    if (TOOL_LAYER_MAP['memory_drift_why'] === 'L6') {
      pass('T060-037', 'memory_drift_why maps to L6', `Got: ${TOOL_LAYER_MAP['memory_drift_why']}`);
    } else {
      fail('T060-037', 'memory_drift_why maps to L6', `Expected L6, got: ${TOOL_LAYER_MAP['memory_drift_why']}`);
    }

    // T060-038: memory_index_scan maps to L7
    if (TOOL_LAYER_MAP['memory_index_scan'] === 'L7') {
      pass('T060-038', 'memory_index_scan maps to L7', `Got: ${TOOL_LAYER_MAP['memory_index_scan']}`);
    } else {
      fail('T060-038', 'memory_index_scan maps to L7', `Expected L7, got: ${TOOL_LAYER_MAP['memory_index_scan']}`);
    }

    // T060-039: All tools from LAYER_DEFINITIONS are in TOOL_LAYER_MAP
    let allToolsMapped = true;
    const unmappedTools = [];
    for (const [layerId, layer] of Object.entries(LAYER_DEFINITIONS)) {
      for (const tool of layer.tools) {
        if (!TOOL_LAYER_MAP[tool]) {
          allToolsMapped = false;
          unmappedTools.push(tool);
        }
      }
    }

    if (allToolsMapped) {
      pass('T060-039', 'All tools from LAYER_DEFINITIONS are in TOOL_LAYER_MAP', `All tools mapped`);
    } else {
      fail('T060-039', 'All tools from LAYER_DEFINITIONS are in TOOL_LAYER_MAP', `Unmapped: ${unmappedTools.join(', ')}`);
    }

    // T060-040: TOOL_LAYER_MAP entries match layer.tools definitions
    let allMappingsCorrect = true;
    const incorrectMappings = [];
    for (const [tool, layerId] of Object.entries(TOOL_LAYER_MAP)) {
      const layer = LAYER_DEFINITIONS[layerId];
      if (!layer || !layer.tools.includes(tool)) {
        allMappingsCorrect = false;
        incorrectMappings.push(`${tool} -> ${layerId}`);
      }
    }

    if (allMappingsCorrect) {
      pass('T060-040', 'TOOL_LAYER_MAP entries match layer.tools definitions', `All mappings correct`);
    } else {
      fail('T060-040', 'TOOL_LAYER_MAP entries match layer.tools definitions', `Incorrect: ${incorrectMappings.join(', ')}`);
    }
  }

  // 4.3 getLayerPrefix() TESTS (T060-050 to T060-055)

  function test_get_layer_prefix() {
    log('\n🔬 getLayerPrefix() - T060-050 to T060-055');

    const { getLayerPrefix } = layerDefs;

    // T060-050: getLayerPrefix exists and is a function
    if (typeof getLayerPrefix === 'function') {
      pass('T060-050', 'getLayerPrefix exists and is a function', `Type: ${typeof getLayerPrefix}`);
    } else {
      fail('T060-050', 'getLayerPrefix exists and is a function', `Got: ${typeof getLayerPrefix}`);
      return;
    }

    // T060-051: Returns correct prefix for L1 tool
    const l1Prefix = getLayerPrefix('memory_context');
    if (l1Prefix === '[L1:Orchestration]') {
      pass('T060-051', 'Returns correct prefix for L1 tool', `Got: ${l1Prefix}`);
    } else {
      fail('T060-051', 'Returns correct prefix for L1 tool', `Expected [L1:Orchestration], got: ${l1Prefix}`);
    }

    // T060-052: Returns correct prefix for L2 tool
    const l2Prefix = getLayerPrefix('memory_search');
    if (l2Prefix === '[L2:Core]') {
      pass('T060-052', 'Returns correct prefix for L2 tool', `Got: ${l2Prefix}`);
    } else {
      fail('T060-052', 'Returns correct prefix for L2 tool', `Expected [L2:Core], got: ${l2Prefix}`);
    }

    // T060-053: Returns correct prefix for L6 tool
    const l6Prefix = getLayerPrefix('memory_drift_why');
    if (l6Prefix === '[L6:Analysis]') {
      pass('T060-053', 'Returns correct prefix for L6 tool', `Got: ${l6Prefix}`);
    } else {
      fail('T060-053', 'Returns correct prefix for L6 tool', `Expected [L6:Analysis], got: ${l6Prefix}`);
    }

    // T060-054: Returns empty string for unknown tool
    const unknownPrefix = getLayerPrefix('unknown_tool');
    if (unknownPrefix === '') {
      pass('T060-054', 'Returns empty string for unknown tool', `Got: "${unknownPrefix}"`);
    } else {
      fail('T060-054', 'Returns empty string for unknown tool', `Expected "", got: "${unknownPrefix}"`);
    }

    // T060-055: Returns empty string for null/undefined
    const nullPrefix = getLayerPrefix(null);
    const undefinedPrefix = getLayerPrefix(undefined);
    if (nullPrefix === '' && undefinedPrefix === '') {
      pass('T060-055', 'Returns empty string for null/undefined', `null: "${nullPrefix}", undefined: "${undefinedPrefix}"`);
    } else {
      fail('T060-055', 'Returns empty string for null/undefined', `null: "${nullPrefix}", undefined: "${undefinedPrefix}"`);
    }
  }

  // 4.4 enhanceDescription() TESTS (T060-060 to T060-065)

  function test_enhance_description() {
    log('\n🔬 enhanceDescription() - T060-060 to T060-065');

    const { enhanceDescription } = layerDefs;

    // T060-060: enhanceDescription exists and is a function
    if (typeof enhanceDescription === 'function') {
      pass('T060-060', 'enhanceDescription exists and is a function', `Type: ${typeof enhanceDescription}`);
    } else {
      fail('T060-060', 'enhanceDescription exists and is a function', `Got: ${typeof enhanceDescription}`);
      return;
    }

    // T060-061: Prepends layer prefix to description
    const enhanced = enhanceDescription('memory_context', 'Unified entry point for context retrieval.');
    if (enhanced === '[L1:Orchestration] Unified entry point for context retrieval.') {
      pass('T060-061', 'Prepends layer prefix to description', `Got: ${enhanced}`);
    } else {
      fail('T060-061', 'Prepends layer prefix to description', `Expected prefix prepended, got: ${enhanced}`);
    }

    // T060-062: Handles L2 tool correctly
    const l2Enhanced = enhanceDescription('memory_save', 'Save a memory to the system.');
    if (l2Enhanced.startsWith('[L2:Core]')) {
      pass('T060-062', 'Handles L2 tool correctly', `Got: ${l2Enhanced}`);
    } else {
      fail('T060-062', 'Handles L2 tool correctly', `Expected [L2:Core] prefix, got: ${l2Enhanced}`);
    }

    // T060-063: Returns original description for unknown tool
    const unknownEnhanced = enhanceDescription('unknown_tool', 'Some description');
    if (unknownEnhanced === 'Some description') {
      pass('T060-063', 'Returns original description for unknown tool', `Got: ${unknownEnhanced}`);
    } else {
      fail('T060-063', 'Returns original description for unknown tool', `Expected original, got: ${unknownEnhanced}`);
    }

    // T060-064: Handles empty description
    const emptyEnhanced = enhanceDescription('memory_context', '');
    if (emptyEnhanced === '[L1:Orchestration] ') {
      pass('T060-064', 'Handles empty description', `Got: "${emptyEnhanced}"`);
    } else {
      fail('T060-064', 'Handles empty description', `Got: "${emptyEnhanced}"`);
    }

    // T060-065: Preserves special characters in description
    const specialEnhanced = enhanceDescription('memory_search', 'Search with "quotes" & <brackets>');
    if (specialEnhanced.includes('"quotes"') && specialEnhanced.includes('<brackets>')) {
      pass('T060-065', 'Preserves special characters in description', `Got: ${specialEnhanced}`);
    } else {
      fail('T060-065', 'Preserves special characters in description', `Got: ${specialEnhanced}`);
    }
  }

  // 4.5 getTokenBudget() TESTS (T060-070 to T060-080)

  function test_get_token_budget() {
    log('\n🔬 getTokenBudget() - T060-070 to T060-080');

    const { getTokenBudget } = layerDefs;

    // T060-070: getTokenBudget exists and is a function
    if (typeof getTokenBudget === 'function') {
      pass('T060-070', 'getTokenBudget exists and is a function', `Type: ${typeof getTokenBudget}`);
    } else {
      fail('T060-070', 'getTokenBudget exists and is a function', `Got: ${typeof getTokenBudget}`);
      return;
    }

    // T060-071: L1 token budget is 2000
    const l1Budget = getTokenBudget('memory_context');
    if (l1Budget === 2000) {
      pass('T060-071', 'L1 token budget is 2000', `Got: ${l1Budget}`);
    } else {
      fail('T060-071', 'L1 token budget is 2000', `Expected 2000, got: ${l1Budget}`);
    }

    // T060-072: L2 token budget is 1500
    const l2Budget = getTokenBudget('memory_search');
    if (l2Budget === 1500) {
      pass('T060-072', 'L2 token budget is 1500', `Got: ${l2Budget}`);
    } else {
      fail('T060-072', 'L2 token budget is 1500', `Expected 1500, got: ${l2Budget}`);
    }

    // T060-073: L3 token budget is 800
    const l3Budget = getTokenBudget('memory_list');
    if (l3Budget === 800) {
      pass('T060-073', 'L3 token budget is 800', `Got: ${l3Budget}`);
    } else {
      fail('T060-073', 'L3 token budget is 800', `Expected 800, got: ${l3Budget}`);
    }

    // T060-074: L4 token budget is 500
    const l4Budget = getTokenBudget('memory_update');
    if (l4Budget === 500) {
      pass('T060-074', 'L4 token budget is 500', `Got: ${l4Budget}`);
    } else {
      fail('T060-074', 'L4 token budget is 500', `Expected 500, got: ${l4Budget}`);
    }

    // T060-075: L5 token budget is 600
    const l5Budget = getTokenBudget('checkpoint_create');
    if (l5Budget === 600) {
      pass('T060-075', 'L5 token budget is 600', `Got: ${l5Budget}`);
    } else {
      fail('T060-075', 'L5 token budget is 600', `Expected 600, got: ${l5Budget}`);
    }

    // T060-076: L6 token budget is 1200
    const l6Budget = getTokenBudget('memory_drift_why');
    if (l6Budget === 1200) {
      pass('T060-076', 'L6 token budget is 1200', `Got: ${l6Budget}`);
    } else {
      fail('T060-076', 'L6 token budget is 1200', `Expected 1200, got: ${l6Budget}`);
    }

    // T060-077: L7 token budget is 1000
    const l7Budget = getTokenBudget('memory_index_scan');
    if (l7Budget === 1000) {
      pass('T060-077', 'L7 token budget is 1000', `Got: ${l7Budget}`);
    } else {
      fail('T060-077', 'L7 token budget is 1000', `Expected 1000, got: ${l7Budget}`);
    }

    // T060-078: Unknown tool returns default budget (1000)
    const unknownBudget = getTokenBudget('unknown_tool');
    if (unknownBudget === 1000) {
      pass('T060-078', 'Unknown tool returns default budget (1000)', `Got: ${unknownBudget}`);
    } else {
      fail('T060-078', 'Unknown tool returns default budget (1000)', `Expected 1000, got: ${unknownBudget}`);
    }

    // T060-079: Returns number type
    const budgetType = typeof getTokenBudget('memory_context');
    if (budgetType === 'number') {
      pass('T060-079', 'Returns number type', `Type: ${budgetType}`);
    } else {
      fail('T060-079', 'Returns number type', `Expected number, got: ${budgetType}`);
    }

    // T060-080: All L2 tools have same budget
    const l2Tools = ['memory_search', 'memory_save', 'memory_match_triggers'];
    const l2Budgets = l2Tools.map(t => getTokenBudget(t));
    const allSame = l2Budgets.every(b => b === 1500);
    if (allSame) {
      pass('T060-080', 'All L2 tools have same budget (1500)', `Budgets: ${l2Budgets.join(', ')}`);
    } else {
      fail('T060-080', 'All L2 tools have same budget (1500)', `Got: ${l2Budgets.join(', ')}`);
    }
  }

  // 4.6 getLayerInfo() TESTS (T060-090 to T060-095)

  function test_get_layer_info() {
    log('\n🔬 getLayerInfo() - T060-090 to T060-095');

    const { getLayerInfo } = layerDefs;

    // T060-090: getLayerInfo exists and is a function
    if (typeof getLayerInfo === 'function') {
      pass('T060-090', 'getLayerInfo exists and is a function', `Type: ${typeof getLayerInfo}`);
    } else {
      fail('T060-090', 'getLayerInfo exists and is a function', `Got: ${typeof getLayerInfo}`);
      return;
    }

    // T060-091: Returns layer object for valid tool
    const l1Info = getLayerInfo('memory_context');
    if (l1Info && l1Info.id === 'L1' && l1Info.name === 'Orchestration') {
      pass('T060-091', 'Returns layer object for valid tool', `Got: ${l1Info.id} - ${l1Info.name}`);
    } else {
      fail('T060-091', 'Returns layer object for valid tool', `Got: ${JSON.stringify(l1Info)}`);
    }

    // T060-092: Returns null for unknown tool
    const unknownInfo = getLayerInfo('unknown_tool');
    if (unknownInfo === null) {
      pass('T060-092', 'Returns null for unknown tool', `Got: ${unknownInfo}`);
    } else {
      fail('T060-092', 'Returns null for unknown tool', `Expected null, got: ${JSON.stringify(unknownInfo)}`);
    }

    // T060-093: Returns a copy (not the original object)
    const info1 = getLayerInfo('memory_context');
    const info2 = getLayerInfo('memory_context');
    if (info1 !== info2) {
      pass('T060-093', 'Returns a copy (not the original object)', 'Objects are different references');
    } else {
      fail('T060-093', 'Returns a copy (not the original object)', 'Same object reference returned');
    }

    // T060-094: Returned object has all required properties
    const l2Info = getLayerInfo('memory_search');
    const hasAllProps = l2Info && l2Info.id && l2Info.name && l2Info.description &&
                        l2Info.tokenBudget && l2Info.priority && l2Info.useCase && l2Info.tools;
    if (hasAllProps) {
      pass('T060-094', 'Returned object has all required properties', `Properties: id, name, description, tokenBudget, priority, useCase, tools`);
    } else {
      fail('T060-094', 'Returned object has all required properties', `Got: ${JSON.stringify(l2Info)}`);
    }

    // T060-095: Handles null/undefined gracefully
    const nullInfo = getLayerInfo(null);
    const undefinedInfo = getLayerInfo(undefined);
    if (nullInfo === null && undefinedInfo === null) {
      pass('T060-095', 'Handles null/undefined gracefully', `null: ${nullInfo}, undefined: ${undefinedInfo}`);
    } else {
      fail('T060-095', 'Handles null/undefined gracefully', `null: ${nullInfo}, undefined: ${undefinedInfo}`);
    }
  }

  // 4.7 getLayersByPriority() TESTS (T060-100 to T060-105)

  function test_get_layers_by_priority() {
    log('\n🔬 getLayersByPriority() - T060-100 to T060-105');

    const { getLayersByPriority } = layerDefs;

    // T060-100: getLayersByPriority exists and is a function
    if (typeof getLayersByPriority === 'function') {
      pass('T060-100', 'getLayersByPriority exists and is a function', `Type: ${typeof getLayersByPriority}`);
    } else {
      fail('T060-100', 'getLayersByPriority exists and is a function', `Got: ${typeof getLayersByPriority}`);
      return;
    }

    // T060-101: Returns an array
    const layers = getLayersByPriority();
    if (Array.isArray(layers)) {
      pass('T060-101', 'Returns an array', `Type: Array, length: ${layers.length}`);
    } else {
      fail('T060-101', 'Returns an array', `Got: ${typeof layers}`);
      return;
    }

    // T060-102: Returns 7 layers
    if (layers.length === 7) {
      pass('T060-102', 'Returns 7 layers', `Length: ${layers.length}`);
    } else {
      fail('T060-102', 'Returns 7 layers', `Expected 7, got: ${layers.length}`);
    }

    // T060-103: Layers are sorted by priority (ascending)
    let isSorted = true;
    for (let i = 1; i < layers.length; i++) {
      if (layers[i].priority < layers[i - 1].priority) {
        isSorted = false;
        break;
      }
    }
    if (isSorted) {
      pass('T060-103', 'Layers are sorted by priority (ascending)', `Priorities: ${layers.map(l => l.priority).join(', ')}`);
    } else {
      fail('T060-103', 'Layers are sorted by priority (ascending)', `Priorities: ${layers.map(l => l.priority).join(', ')}`);
    }

    // T060-104: First layer is L1 (priority 1)
    if (layers[0].id === 'L1' && layers[0].priority === 1) {
      pass('T060-104', 'First layer is L1 (priority 1)', `Got: ${layers[0].id} with priority ${layers[0].priority}`);
    } else {
      fail('T060-104', 'First layer is L1 (priority 1)', `Got: ${layers[0].id} with priority ${layers[0].priority}`);
    }

    // T060-105: Last layer is L7 (priority 7)
    const lastLayer = layers[layers.length - 1];
    if (lastLayer.id === 'L7' && lastLayer.priority === 7) {
      pass('T060-105', 'Last layer is L7 (priority 7)', `Got: ${lastLayer.id} with priority ${lastLayer.priority}`);
    } else {
      fail('T060-105', 'Last layer is L7 (priority 7)', `Got: ${lastLayer.id} with priority ${lastLayer.priority}`);
    }
  }

  // 4.8 getRecommendedLayers() TESTS (T060-110 to T060-120)

  function test_get_recommended_layers() {
    log('\n🔬 getRecommendedLayers() - T060-110 to T060-120');

    const { getRecommendedLayers } = layerDefs;

    // T060-110: getRecommendedLayers exists and is a function
    if (typeof getRecommendedLayers === 'function') {
      pass('T060-110', 'getRecommendedLayers exists and is a function', `Type: ${typeof getRecommendedLayers}`);
    } else {
      fail('T060-110', 'getRecommendedLayers exists and is a function', `Got: ${typeof getRecommendedLayers}`);
      return;
    }

    // T060-111: Returns array for 'search' task
    const searchLayers = getRecommendedLayers('search');
    if (Array.isArray(searchLayers) && searchLayers.length > 0) {
      pass('T060-111', 'Returns array for search task', `Got: ${searchLayers.join(', ')}`);
    } else {
      fail('T060-111', 'Returns array for search task', `Got: ${JSON.stringify(searchLayers)}`);
    }

    // T060-112: 'search' recommends L1 first
    if (searchLayers[0] === 'L1') {
      pass('T060-112', 'search recommends L1 first', `Got: ${searchLayers[0]}`);
    } else {
      fail('T060-112', 'search recommends L1 first', `Expected L1, got: ${searchLayers[0]}`);
    }

    // T060-113: 'browse' recommends L3 first
    const browseLayers = getRecommendedLayers('browse');
    if (browseLayers[0] === 'L3') {
      pass('T060-113', 'browse recommends L3 first', `Got: ${browseLayers[0]}`);
    } else {
      fail('T060-113', 'browse recommends L3 first', `Expected L3, got: ${browseLayers[0]}`);
    }

    // T060-114: 'modify' recommends L4 first
    const modifyLayers = getRecommendedLayers('modify');
    if (modifyLayers[0] === 'L4') {
      pass('T060-114', 'modify recommends L4 first', `Got: ${modifyLayers[0]}`);
    } else {
      fail('T060-114', 'modify recommends L4 first', `Expected L4, got: ${modifyLayers[0]}`);
    }

    // T060-115: 'checkpoint' recommends L5
    const checkpointLayers = getRecommendedLayers('checkpoint');
    if (checkpointLayers.includes('L5')) {
      pass('T060-115', 'checkpoint recommends L5', `Got: ${checkpointLayers.join(', ')}`);
    } else {
      fail('T060-115', 'checkpoint recommends L5', `Got: ${checkpointLayers.join(', ')}`);
    }

    // T060-116: 'analyze' recommends L6 first
    const analyzeLayers = getRecommendedLayers('analyze');
    if (analyzeLayers[0] === 'L6') {
      pass('T060-116', 'analyze recommends L6 first', `Got: ${analyzeLayers[0]}`);
    } else {
      fail('T060-116', 'analyze recommends L6 first', `Expected L6, got: ${analyzeLayers[0]}`);
    }

    // T060-117: 'maintenance' recommends L7 first
    const maintenanceLayers = getRecommendedLayers('maintenance');
    if (maintenanceLayers[0] === 'L7') {
      pass('T060-117', 'maintenance recommends L7 first', `Got: ${maintenanceLayers[0]}`);
    } else {
      fail('T060-117', 'maintenance recommends L7 first', `Expected L7, got: ${maintenanceLayers[0]}`);
    }

    // T060-118: Unknown task returns default layers
    const unknownLayers = getRecommendedLayers('unknown_task');
    if (Array.isArray(unknownLayers) && unknownLayers.length > 0) {
      pass('T060-118', 'Unknown task returns default layers', `Got: ${unknownLayers.join(', ')}`);
    } else {
      fail('T060-118', 'Unknown task returns default layers', `Got: ${JSON.stringify(unknownLayers)}`);
    }

    // T060-119: Default layers include L1 (orchestration)
    const defaultLayers = getRecommendedLayers('nonexistent');
    if (defaultLayers.includes('L1')) {
      pass('T060-119', 'Default layers include L1 (orchestration)', `Got: ${defaultLayers.join(', ')}`);
    } else {
      fail('T060-119', 'Default layers include L1 (orchestration)', `Got: ${defaultLayers.join(', ')}`);
    }

    // T060-120: Handles null/undefined gracefully
    const nullLayers = getRecommendedLayers(null);
    const undefinedLayers = getRecommendedLayers(undefined);
    if (Array.isArray(nullLayers) && Array.isArray(undefinedLayers)) {
      pass('T060-120', 'Handles null/undefined gracefully', `Both return arrays`);
    } else {
      fail('T060-120', 'Handles null/undefined gracefully', `null: ${typeof nullLayers}, undefined: ${typeof undefinedLayers}`);
    }
  }

  // 4.9 TOKEN BUDGETS VALIDATION (T060-130 to T060-140)

  function test_token_budgets_validation() {
    log('\n🔬 Token Budgets Validation - T060-130 to T060-140');

    const { LAYER_DEFINITIONS, getTokenBudget } = layerDefs;

    // T060-130: All layers have positive token budgets
    let allPositive = true;
    const budgets = {};
    for (const [layerId, layer] of Object.entries(LAYER_DEFINITIONS)) {
      budgets[layerId] = layer.tokenBudget;
      if (layer.tokenBudget <= 0) {
        allPositive = false;
      }
    }
    if (allPositive) {
      pass('T060-130', 'All layers have positive token budgets', JSON.stringify(budgets));
    } else {
      fail('T060-130', 'All layers have positive token budgets', JSON.stringify(budgets));
    }

    // T060-131: L1 has highest budget (2000)
    if (LAYER_DEFINITIONS.L1.tokenBudget === 2000) {
      pass('T060-131', 'L1 has budget of 2000', `Got: ${LAYER_DEFINITIONS.L1.tokenBudget}`);
    } else {
      fail('T060-131', 'L1 has budget of 2000', `Expected 2000, got: ${LAYER_DEFINITIONS.L1.tokenBudget}`);
    }

    // T060-132: L4 (Mutation) has lowest budget (500)
    const minBudget = Math.min(...Object.values(LAYER_DEFINITIONS).map(l => l.tokenBudget));
    if (LAYER_DEFINITIONS.L4.tokenBudget === 500 && minBudget === 500) {
      pass('T060-132', 'L4 (Mutation) has lowest budget (500)', `L4: ${LAYER_DEFINITIONS.L4.tokenBudget}, Min: ${minBudget}`);
    } else {
      fail('T060-132', 'L4 (Mutation) has lowest budget (500)', `L4: ${LAYER_DEFINITIONS.L4.tokenBudget}, Min: ${minBudget}`);
    }

    // T060-133: Token budgets are integers
    let allIntegers = true;
    for (const layer of Object.values(LAYER_DEFINITIONS)) {
      if (!Number.isInteger(layer.tokenBudget)) {
        allIntegers = false;
        break;
      }
    }
    if (allIntegers) {
      pass('T060-133', 'Token budgets are integers', 'All budgets are integers');
    } else {
      fail('T060-133', 'Token budgets are integers', 'Some budgets are not integers');
    }

    // T060-134: L2 budget > L3 budget (Core > Discovery)
    if (LAYER_DEFINITIONS.L2.tokenBudget > LAYER_DEFINITIONS.L3.tokenBudget) {
      pass('T060-134', 'L2 budget > L3 budget (Core > Discovery)', `L2: ${LAYER_DEFINITIONS.L2.tokenBudget}, L3: ${LAYER_DEFINITIONS.L3.tokenBudget}`);
    } else {
      fail('T060-134', 'L2 budget > L3 budget (Core > Discovery)', `L2: ${LAYER_DEFINITIONS.L2.tokenBudget}, L3: ${LAYER_DEFINITIONS.L3.tokenBudget}`);
    }

    // T060-135: L6 (Analysis) has second-highest budget (1200)
    const sortedBudgets = Object.values(LAYER_DEFINITIONS).map(l => l.tokenBudget).sort((a, b) => b - a);
    if (LAYER_DEFINITIONS.L6.tokenBudget === 1200) {
      pass('T060-135', 'L6 (Analysis) has budget of 1200', `Got: ${LAYER_DEFINITIONS.L6.tokenBudget}`);
    } else {
      fail('T060-135', 'L6 (Analysis) has budget of 1200', `Expected 1200, got: ${LAYER_DEFINITIONS.L6.tokenBudget}`);
    }

    // T060-136: Expected budget values: L1=2000, L2=1500, L3=800, L4=500, L5=600, L6=1200, L7=1000
    const expectedBudgets = { L1: 2000, L2: 1500, L3: 800, L4: 500, L5: 600, L6: 1200, L7: 1000 };
    let allMatch = true;
    const mismatches = [];
    for (const [layer, expected] of Object.entries(expectedBudgets)) {
      if (LAYER_DEFINITIONS[layer].tokenBudget !== expected) {
        allMatch = false;
        mismatches.push(`${layer}: expected ${expected}, got ${LAYER_DEFINITIONS[layer].tokenBudget}`);
      }
    }
    if (allMatch) {
      pass('T060-136', 'All expected budget values match', JSON.stringify(expectedBudgets));
    } else {
      fail('T060-136', 'All expected budget values match', mismatches.join(', '));
    }

    // T060-137: Total budget across all layers is 7600
    const totalBudget = Object.values(LAYER_DEFINITIONS).reduce((sum, l) => sum + l.tokenBudget, 0);
    const expectedTotal = 2000 + 1500 + 800 + 500 + 600 + 1200 + 1000;
    if (totalBudget === expectedTotal) {
      pass('T060-137', `Total budget across all layers is ${expectedTotal}`, `Got: ${totalBudget}`);
    } else {
      fail('T060-137', `Total budget across all layers is ${expectedTotal}`, `Expected ${expectedTotal}, got: ${totalBudget}`);
    }
  }

  // 4.10 getLayerDocumentation() TESTS (T060-150 to T060-155)

  function test_get_layer_documentation() {
    log('\n🔬 getLayerDocumentation() - T060-150 to T060-155');

    const { getLayerDocumentation } = layerDefs;

    // T060-150: getLayerDocumentation exists and is a function
    if (typeof getLayerDocumentation === 'function') {
      pass('T060-150', 'getLayerDocumentation exists and is a function', `Type: ${typeof getLayerDocumentation}`);
    } else {
      fail('T060-150', 'getLayerDocumentation exists and is a function', `Got: ${typeof getLayerDocumentation}`);
      return;
    }

    // T060-151: Returns a string
    const docs = getLayerDocumentation();
    if (typeof docs === 'string') {
      pass('T060-151', 'Returns a string', `Type: ${typeof docs}, length: ${docs.length}`);
    } else {
      fail('T060-151', 'Returns a string', `Got: ${typeof docs}`);
      return;
    }

    // T060-152: Contains markdown header
    if (docs.includes('# Memory System Layer Architecture')) {
      pass('T060-152', 'Contains markdown header', 'Header found');
    } else {
      fail('T060-152', 'Contains markdown header', 'Header not found');
    }

    // T060-153: Contains all layer IDs (L1-L7)
    const allLayersPresent = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'].every(id => docs.includes(id));
    if (allLayersPresent) {
      pass('T060-153', 'Contains all layer IDs (L1-L7)', 'All layer IDs found');
    } else {
      fail('T060-153', 'Contains all layer IDs (L1-L7)', 'Some layer IDs missing');
    }

    // T060-154: Contains token budget information
    if (docs.includes('Token Budget')) {
      pass('T060-154', 'Contains token budget information', 'Token Budget section found');
    } else {
      fail('T060-154', 'Contains token budget information', 'Token Budget section not found');
    }

    // T060-155: Contains layer names
    const allNamesPresent = ['Orchestration', 'Core', 'Discovery', 'Mutation', 'Lifecycle', 'Analysis', 'Maintenance'].every(name => docs.includes(name));
    if (allNamesPresent) {
      pass('T060-155', 'Contains all layer names', 'All layer names found');
    } else {
      fail('T060-155', 'Contains all layer names', 'Some layer names missing');
    }
  }

  // 4.11 LAYER TOOLS VALIDATION (T060-160 to T060-170)

  function test_layer_tools_validation() {
    log('\n🔬 Layer Tools Validation - T060-160 to T060-170');

    const { LAYER_DEFINITIONS } = layerDefs;

    // T060-160: L1 contains memory_context tool
    if (LAYER_DEFINITIONS.L1.tools.includes('memory_context')) {
      pass('T060-160', 'L1 contains memory_context tool', `Tools: ${LAYER_DEFINITIONS.L1.tools.join(', ')}`);
    } else {
      fail('T060-160', 'L1 contains memory_context tool', `Tools: ${LAYER_DEFINITIONS.L1.tools.join(', ')}`);
    }

    // T060-161: L2 contains core operations
    const l2Expected = ['memory_search', 'memory_save', 'memory_match_triggers'];
    const l2HasAll = l2Expected.every(t => LAYER_DEFINITIONS.L2.tools.includes(t));
    if (l2HasAll) {
      pass('T060-161', 'L2 contains core operations', `Tools: ${LAYER_DEFINITIONS.L2.tools.join(', ')}`);
    } else {
      fail('T060-161', 'L2 contains core operations', `Expected: ${l2Expected.join(', ')}, Got: ${LAYER_DEFINITIONS.L2.tools.join(', ')}`);
    }

    // T060-162: L3 contains discovery operations
    const l3Expected = ['memory_list', 'memory_stats', 'memory_health'];
    const l3HasAll = l3Expected.every(t => LAYER_DEFINITIONS.L3.tools.includes(t));
    if (l3HasAll) {
      pass('T060-162', 'L3 contains discovery operations', `Tools: ${LAYER_DEFINITIONS.L3.tools.join(', ')}`);
    } else {
      fail('T060-162', 'L3 contains discovery operations', `Expected: ${l3Expected.join(', ')}, Got: ${LAYER_DEFINITIONS.L3.tools.join(', ')}`);
    }

    // T060-163: L4 contains mutation operations
    const l4Expected = ['memory_update', 'memory_delete', 'memory_validate'];
    const l4HasAll = l4Expected.every(t => LAYER_DEFINITIONS.L4.tools.includes(t));
    if (l4HasAll) {
      pass('T060-163', 'L4 contains mutation operations', `Tools: ${LAYER_DEFINITIONS.L4.tools.join(', ')}`);
    } else {
      fail('T060-163', 'L4 contains mutation operations', `Expected: ${l4Expected.join(', ')}, Got: ${LAYER_DEFINITIONS.L4.tools.join(', ')}`);
    }

    // T060-164: L5 contains checkpoint operations
    const l5Expected = ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete'];
    const l5HasAll = l5Expected.every(t => LAYER_DEFINITIONS.L5.tools.includes(t));
    if (l5HasAll) {
      pass('T060-164', 'L5 contains checkpoint operations', `Tools: ${LAYER_DEFINITIONS.L5.tools.join(', ')}`);
    } else {
      fail('T060-164', 'L5 contains checkpoint operations', `Expected: ${l5Expected.join(', ')}, Got: ${LAYER_DEFINITIONS.L5.tools.join(', ')}`);
    }

    // T060-165: L6 contains analysis operations
    const l6Expected = ['memory_drift_why', 'task_preflight', 'task_postflight'];
    const l6HasSome = l6Expected.some(t => LAYER_DEFINITIONS.L6.tools.includes(t));
    if (l6HasSome) {
      pass('T060-165', 'L6 contains analysis operations', `Tools: ${LAYER_DEFINITIONS.L6.tools.join(', ')}`);
    } else {
      fail('T060-165', 'L6 contains analysis operations', `Expected some of: ${l6Expected.join(', ')}, Got: ${LAYER_DEFINITIONS.L6.tools.join(', ')}`);
    }

    // T060-166: L7 contains maintenance operations
    const l7Expected = ['memory_index_scan', 'memory_get_learning_history'];
    const l7HasAll = l7Expected.every(t => LAYER_DEFINITIONS.L7.tools.includes(t));
    if (l7HasAll) {
      pass('T060-166', 'L7 contains maintenance operations', `Tools: ${LAYER_DEFINITIONS.L7.tools.join(', ')}`);
    } else {
      fail('T060-166', 'L7 contains maintenance operations', `Expected: ${l7Expected.join(', ')}, Got: ${LAYER_DEFINITIONS.L7.tools.join(', ')}`);
    }

    // T060-167: All tools arrays are non-empty
    let allNonEmpty = true;
    const emptyLayers = [];
    for (const [layerId, layer] of Object.entries(LAYER_DEFINITIONS)) {
      if (!Array.isArray(layer.tools) || layer.tools.length === 0) {
        allNonEmpty = false;
        emptyLayers.push(layerId);
      }
    }
    if (allNonEmpty) {
      pass('T060-167', 'All tools arrays are non-empty', 'All layers have tools');
    } else {
      fail('T060-167', 'All tools arrays are non-empty', `Empty: ${emptyLayers.join(', ')}`);
    }

    // T060-168: No duplicate tools across layers
    const allTools = [];
    const duplicates = [];
    for (const layer of Object.values(LAYER_DEFINITIONS)) {
      for (const tool of layer.tools) {
        if (allTools.includes(tool)) {
          duplicates.push(tool);
        }
        allTools.push(tool);
      }
    }
    if (duplicates.length === 0) {
      pass('T060-168', 'No duplicate tools across layers', `Total unique tools: ${new Set(allTools).size}`);
    } else {
      fail('T060-168', 'No duplicate tools across layers', `Duplicates: ${duplicates.join(', ')}`);
    }

    // T060-169: Tools are strings
    let allStrings = true;
    const nonStrings = [];
    for (const layer of Object.values(LAYER_DEFINITIONS)) {
      for (const tool of layer.tools) {
        if (typeof tool !== 'string') {
          allStrings = false;
          nonStrings.push(tool);
        }
      }
    }
    if (allStrings) {
      pass('T060-169', 'All tools are strings', 'All tools are strings');
    } else {
      fail('T060-169', 'All tools are strings', `Non-strings: ${nonStrings.join(', ')}`);
    }

    // T060-170: Total tool count across all layers
    const totalTools = Object.values(LAYER_DEFINITIONS).reduce((sum, l) => sum + l.tools.length, 0);
    if (totalTools >= 15) {
      pass('T060-170', `Total tool count across all layers (>= 15)`, `Got: ${totalTools} tools`);
    } else {
      fail('T060-170', `Total tool count across all layers (>= 15)`, `Expected >= 15, got: ${totalTools}`);
    }
  }

  // 4.12 EDGE CASES (T060-180 to T060-190)

  function test_edge_cases() {
    log('\n🔬 Edge Cases - T060-180 to T060-190');

    const { getLayerPrefix, enhanceDescription, getTokenBudget, getLayerInfo, getRecommendedLayers, TOOL_LAYER_MAP } = layerDefs;

    // T060-180: Empty string tool name returns empty prefix
    const emptyPrefix = getLayerPrefix('');
    if (emptyPrefix === '') {
      pass('T060-180', 'Empty string tool name returns empty prefix', `Got: "${emptyPrefix}"`);
    } else {
      fail('T060-180', 'Empty string tool name returns empty prefix', `Got: "${emptyPrefix}"`);
    }

    // T060-181: Numeric tool name handled gracefully
    const numericPrefix = getLayerPrefix(123);
    if (numericPrefix === '') {
      pass('T060-181', 'Numeric tool name handled gracefully', `Got: "${numericPrefix}"`);
    } else {
      fail('T060-181', 'Numeric tool name handled gracefully', `Got: "${numericPrefix}"`);
    }

    // T060-182: Object tool name handled gracefully
    const objectPrefix = getLayerPrefix({});
    if (objectPrefix === '') {
      pass('T060-182', 'Object tool name handled gracefully', `Got: "${objectPrefix}"`);
    } else {
      fail('T060-182', 'Object tool name handled gracefully', `Got: "${objectPrefix}"`);
    }

    // T060-183: enhanceDescription with null description
    try {
      const nullDescEnhanced = enhanceDescription('memory_context', null);
      pass('T060-183', 'enhanceDescription with null description does not throw', `Got: ${nullDescEnhanced}`);
    } catch (error) {
      fail('T060-183', 'enhanceDescription with null description does not throw', error.message);
    }

    // T060-184: getTokenBudget returns default for empty string
    const emptyBudget = getTokenBudget('');
    if (emptyBudget === 1000) {
      pass('T060-184', 'getTokenBudget returns default (1000) for empty string', `Got: ${emptyBudget}`);
    } else {
      fail('T060-184', 'getTokenBudget returns default (1000) for empty string', `Expected 1000, got: ${emptyBudget}`);
    }

    // T060-185: getLayerInfo returns null for empty string
    const emptyInfo = getLayerInfo('');
    if (emptyInfo === null) {
      pass('T060-185', 'getLayerInfo returns null for empty string', `Got: ${emptyInfo}`);
    } else {
      fail('T060-185', 'getLayerInfo returns null for empty string', `Expected null, got: ${JSON.stringify(emptyInfo)}`);
    }

    // T060-186: getRecommendedLayers with empty string returns default
    const emptyLayers = getRecommendedLayers('');
    if (Array.isArray(emptyLayers) && emptyLayers.length > 0) {
      pass('T060-186', 'getRecommendedLayers with empty string returns default', `Got: ${emptyLayers.join(', ')}`);
    } else {
      fail('T060-186', 'getRecommendedLayers with empty string returns default', `Got: ${JSON.stringify(emptyLayers)}`);
    }

    // T060-187: TOOL_LAYER_MAP is frozen or immutable check
    const originalTool = Object.keys(TOOL_LAYER_MAP)[0];
    const originalValue = TOOL_LAYER_MAP[originalTool];
    try {
      TOOL_LAYER_MAP['test_mutation'] = 'L1';
      // If we got here without error, check if mutation worked
      if (TOOL_LAYER_MAP['test_mutation'] === 'L1') {
        // Object is mutable - this is acceptable behavior
        delete TOOL_LAYER_MAP['test_mutation'];
        pass('T060-187', 'TOOL_LAYER_MAP mutation check', 'Object is mutable (expected behavior)');
      } else {
        pass('T060-187', 'TOOL_LAYER_MAP mutation check', 'Object mutation silently ignored');
      }
    } catch (error) {
      pass('T060-187', 'TOOL_LAYER_MAP mutation check', 'Object is frozen (throws on mutation)');
    }

    // T060-188: Tool names with special characters
    const specialToolBudget = getTokenBudget('memory-search'); // Hyphen instead of underscore
    if (specialToolBudget === 1000) {
      pass('T060-188', 'Tool with special characters returns default budget', `Got: ${specialToolBudget}`);
    } else {
      fail('T060-188', 'Tool with special characters returns default budget', `Expected 1000, got: ${specialToolBudget}`);
    }

    // T060-189: Case sensitivity check
    const upperCaseBudget = getTokenBudget('MEMORY_CONTEXT');
    const lowerCaseBudget = getTokenBudget('memory_context');
    if (upperCaseBudget === 1000 && lowerCaseBudget === 2000) {
      pass('T060-189', 'Tool names are case sensitive', `UPPER: ${upperCaseBudget} (default), lower: ${lowerCaseBudget}`);
    } else {
      fail('T060-189', 'Tool names are case sensitive', `UPPER: ${upperCaseBudget}, lower: ${lowerCaseBudget}`);
    }

    // T060-190: Array tool name with multiple elements handled gracefully
    // Single-element array coerces to string, so test with multi-element array
    const arrayBudget = getTokenBudget(['memory_context', 'other']);
    if (arrayBudget === 1000) {
      pass('T060-190', 'Array tool name (multi-element) returns default budget', `Got: ${arrayBudget}`);
    } else {
      fail('T060-190', 'Array tool name (multi-element) returns default budget', `Expected 1000, got: ${arrayBudget}`);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     5. TEST RUNNER
  ──────────────────────────────────────────────────────────────── */

  async function runTests() {
    log('🧪 Layer Definitions Tests (7-Layer MCP Architecture)');
    log('======================================================');
    log(`Date: ${new Date().toISOString()}\n`);

    // Load module first
    if (!test_module_loads()) {
      log('\n⚠️  Module failed to load. Aborting tests.');
      return results;
    }

    // Run all tests in order
    test_layer_definitions_object();    // T060-010 to T060-020
    test_tool_layer_map();              // T060-030 to T060-040
    test_get_layer_prefix();            // T060-050 to T060-055
    test_enhance_description();         // T060-060 to T060-065
    test_get_token_budget();            // T060-070 to T060-080
    test_get_layer_info();              // T060-090 to T060-095
    test_get_layers_by_priority();      // T060-100 to T060-105
    test_get_recommended_layers();      // T060-110 to T060-120
    test_token_budgets_validation();    // T060-130 to T060-140
    test_get_layer_documentation();     // T060-150 to T060-155
    test_layer_tools_validation();      // T060-160 to T060-170
    test_edge_cases();                  // T060-180 to T060-190

    // Summary
    log('\n======================================================');
    log('📊 TEST SUMMARY');
    log('======================================================');
    log(`✅ Passed:  ${results.passed}`);
    log(`❌ Failed:  ${results.failed}`);
    log(`⏭️  Skipped: ${results.skipped}`);
    log(`📝 Total:   ${results.passed + results.failed + results.skipped}`);
    log('');

    const passRate = ((results.passed / (results.passed + results.failed)) * 100).toFixed(1);
    log(`📈 Pass Rate: ${passRate}%`);
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
    runTests().then((r) => {
      process.exit(r.failed > 0 ? 1 : 0);
    });
  }

  module.exports = { runTests };

})();
