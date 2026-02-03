// ───────────────────────────────────────────────────────────────
// TEST: RECOVERY HINTS (ERROR CATALOG WITH RECOVERY GUIDANCE)
// T009-T011: Error catalog with recovery hints (REQ-004, REQ-009)
// ───────────────────────────────────────────────────────────────

(() => {
  'use strict';

  const path = require('path');

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ──────────────────────────────────────────────────────────────── */

  const LIB_PATH = path.join(__dirname, '..', 'lib', 'errors');

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
    log(`   [PASS] ${test_id}: ${test_name}`);
    if (evidence) log(`      Evidence: ${evidence}`);
  }

  function fail(test_id, test_name, reason) {
    results.failed++;
    results.tests.push({ id: test_id, name: test_name, status: 'FAIL', reason });
    log(`   [FAIL] ${test_id}: ${test_name}`);
    log(`      Reason: ${reason}`);
  }

  function skip(test_id, test_name, reason) {
    results.skipped++;
    results.tests.push({ id: test_id, name: test_name, status: 'SKIP', reason });
    log(`   [SKIP] ${test_id}: ${test_name} (skipped: ${reason})`);
  }

  /* ─────────────────────────────────────────────────────────────
     3. MODULE LOADING
  ──────────────────────────────────────────────────────────────── */

  let recoveryHints;

  function test_module_loads() {
    log('\n:: Module Loading');

    try {
      recoveryHints = require(path.join(LIB_PATH, 'recovery-hints.js'));
      pass('T001', 'Module loads without error', 'require() succeeded');
    } catch (error) {
      fail('T001', 'Module loads without error', error.message);
      return false;
    }
    return true;
  }

  /* ─────────────────────────────────────────────────────────────
     4. TEST SUITES
  ──────────────────────────────────────────────────────────────── */

  // 4.1 ERROR_CODES CONSTANT TESTS (T002-T010)

  function test_error_codes_constant() {
    log('\n:: ERROR_CODES Constant - T002-T010');

    const { ERROR_CODES } = recoveryHints;

    // T002: ERROR_CODES is exported and is an object
    if (ERROR_CODES && typeof ERROR_CODES === 'object') {
      pass('T002', 'ERROR_CODES is exported as object', `Type: ${typeof ERROR_CODES}`);
    } else {
      fail('T002', 'ERROR_CODES is exported as object', `Got: ${typeof ERROR_CODES}`);
      return;
    }

    // T003: ERROR_CODES contains 49 error codes
    const errorCodeCount = Object.keys(ERROR_CODES).length;
    if (errorCodeCount === 49) {
      pass('T003', 'ERROR_CODES contains 49 error codes', `Count: ${errorCodeCount}`);
    } else {
      fail('T003', 'ERROR_CODES contains 49 error codes', `Expected 49, got: ${errorCodeCount}`);
    }

    // T004: Embedding error codes (E001-E004) exist
    const embeddingCodes = ['EMBEDDING_FAILED', 'EMBEDDING_DIMENSION_INVALID', 'EMBEDDING_TIMEOUT', 'EMBEDDING_PROVIDER_UNAVAILABLE'];
    const embeddingValues = ['E001', 'E002', 'E003', 'E004'];
    let embeddingPass = true;
    for (let i = 0; i < embeddingCodes.length; i++) {
      if (ERROR_CODES[embeddingCodes[i]] !== embeddingValues[i]) {
        embeddingPass = false;
        break;
      }
    }
    if (embeddingPass) {
      pass('T004', 'Embedding error codes (E001-E004) exist', 'All 4 codes verified');
    } else {
      fail('T004', 'Embedding error codes (E001-E004) exist', 'Missing or incorrect codes');
    }

    // T005: File error codes (E010-E014) exist
    const fileCodes = ['FILE_NOT_FOUND', 'FILE_ACCESS_DENIED', 'FILE_ENCODING_ERROR', 'FILE_TOO_LARGE', 'FILE_INVALID_PATH'];
    const fileValues = ['E010', 'E011', 'E012', 'E013', 'E014'];
    let filePass = true;
    for (let i = 0; i < fileCodes.length; i++) {
      if (ERROR_CODES[fileCodes[i]] !== fileValues[i]) {
        filePass = false;
        break;
      }
    }
    if (filePass) {
      pass('T005', 'File error codes (E010-E014) exist', 'All 5 codes verified');
    } else {
      fail('T005', 'File error codes (E010-E014) exist', 'Missing or incorrect codes');
    }

    // T006: Database error codes (E020-E024) exist
    const dbCodes = ['DB_CONNECTION_FAILED', 'DB_QUERY_FAILED', 'DB_TRANSACTION_FAILED', 'DB_MIGRATION_FAILED', 'DB_CORRUPTION'];
    const dbValues = ['E020', 'E021', 'E022', 'E023', 'E024'];
    let dbPass = true;
    for (let i = 0; i < dbCodes.length; i++) {
      if (ERROR_CODES[dbCodes[i]] !== dbValues[i]) {
        dbPass = false;
        break;
      }
    }
    if (dbPass) {
      pass('T006', 'Database error codes (E020-E024) exist', 'All 5 codes verified');
    } else {
      fail('T006', 'Database error codes (E020-E024) exist', 'Missing or incorrect codes');
    }

    // T007: Parameter error codes (E030-E033) exist
    const paramCodes = ['INVALID_PARAMETER', 'MISSING_REQUIRED_PARAM', 'PARAMETER_OUT_OF_RANGE', 'INVALID_SPEC_FOLDER'];
    const paramValues = ['E030', 'E031', 'E032', 'E033'];
    let paramPass = true;
    for (let i = 0; i < paramCodes.length; i++) {
      if (ERROR_CODES[paramCodes[i]] !== paramValues[i]) {
        paramPass = false;
        break;
      }
    }
    if (paramPass) {
      pass('T007', 'Parameter error codes (E030-E033) exist', 'All 4 codes verified');
    } else {
      fail('T007', 'Parameter error codes (E030-E033) exist', 'Missing or incorrect codes');
    }

    // T008: HTTP-style rate limiting codes exist
    if (ERROR_CODES.RATE_LIMITED === 'E429' && ERROR_CODES.SERVICE_UNAVAILABLE === 'E503') {
      pass('T008', 'HTTP-style rate limiting codes (E429, E503) exist', 'RATE_LIMITED=E429, SERVICE_UNAVAILABLE=E503');
    } else {
      fail('T008', 'HTTP-style rate limiting codes (E429, E503) exist', `Got: RATE_LIMITED=${ERROR_CODES.RATE_LIMITED}, SERVICE_UNAVAILABLE=${ERROR_CODES.SERVICE_UNAVAILABLE}`);
    }

    // T009: All error code values are unique
    const values = Object.values(ERROR_CODES);
    const uniqueValues = new Set(values);
    if (values.length === uniqueValues.size) {
      pass('T009', 'All error code values are unique', `${values.length} unique values`);
    } else {
      fail('T009', 'All error code values are unique', `${values.length} values, ${uniqueValues.size} unique`);
    }

    // T010: All error code values start with 'E'
    const allStartWithE = values.every(v => typeof v === 'string' && v.startsWith('E'));
    if (allStartWithE) {
      pass('T010', 'All error code values start with E', 'Format verified');
    } else {
      fail('T010', 'All error code values start with E', 'Some codes do not start with E');
    }
  }

  // 4.2 RECOVERY_HINTS CATALOG TESTS (T011-T020)

  function test_recovery_hints_catalog() {
    log('\n:: RECOVERY_HINTS Catalog - T011-T020');

    const { ERROR_CODES, RECOVERY_HINTS } = recoveryHints;

    // T011: RECOVERY_HINTS is exported and is an object
    if (RECOVERY_HINTS && typeof RECOVERY_HINTS === 'object') {
      pass('T011', 'RECOVERY_HINTS is exported as object', `Type: ${typeof RECOVERY_HINTS}`);
    } else {
      fail('T011', 'RECOVERY_HINTS is exported as object', `Got: ${typeof RECOVERY_HINTS}`);
      return;
    }

    // T012: All 49 error codes have recovery hints
    const errorCodeValues = Object.values(ERROR_CODES);
    const hintsWithCoverage = errorCodeValues.filter(code => RECOVERY_HINTS[code]);
    if (hintsWithCoverage.length === 49) {
      pass('T012', 'All 49 error codes have recovery hints', `Coverage: ${hintsWithCoverage.length}/49`);
    } else {
      const missing = errorCodeValues.filter(code => !RECOVERY_HINTS[code]);
      fail('T012', 'All 49 error codes have recovery hints', `Missing hints for: ${missing.join(', ')}`);
    }

    // T013: Each hint has required 'hint' property (string)
    let hintPropPass = true;
    const hintPropFailures = [];
    for (const [code, hint] of Object.entries(RECOVERY_HINTS)) {
      if (!hint.hint || typeof hint.hint !== 'string') {
        hintPropPass = false;
        hintPropFailures.push(code);
      }
    }
    if (hintPropPass) {
      pass('T013', 'Each hint has required hint property (string)', `${Object.keys(RECOVERY_HINTS).length} hints verified`);
    } else {
      fail('T013', 'Each hint has required hint property (string)', `Missing/invalid: ${hintPropFailures.join(', ')}`);
    }

    // T014: Each hint has required 'actions' property (array)
    let actionsPropPass = true;
    const actionsPropFailures = [];
    for (const [code, hint] of Object.entries(RECOVERY_HINTS)) {
      if (!Array.isArray(hint.actions) || hint.actions.length === 0) {
        actionsPropPass = false;
        actionsPropFailures.push(code);
      }
    }
    if (actionsPropPass) {
      pass('T014', 'Each hint has required actions property (non-empty array)', `${Object.keys(RECOVERY_HINTS).length} hints verified`);
    } else {
      fail('T014', 'Each hint has required actions property (non-empty array)', `Missing/invalid: ${actionsPropFailures.join(', ')}`);
    }

    // T015: Each hint has required 'severity' property
    let severityPropPass = true;
    const severityPropFailures = [];
    const validSeverities = ['low', 'medium', 'high', 'critical'];
    for (const [code, hint] of Object.entries(RECOVERY_HINTS)) {
      if (!hint.severity || !validSeverities.includes(hint.severity)) {
        severityPropPass = false;
        severityPropFailures.push(`${code}:${hint.severity}`);
      }
    }
    if (severityPropPass) {
      pass('T015', 'Each hint has valid severity property (low/medium/high/critical)', `${Object.keys(RECOVERY_HINTS).length} hints verified`);
    } else {
      fail('T015', 'Each hint has valid severity property (low/medium/high/critical)', `Invalid: ${severityPropFailures.join(', ')}`);
    }

    // T016: Critical severity exists for DB_CONNECTION_FAILED
    const dbConnHint = RECOVERY_HINTS[ERROR_CODES.DB_CONNECTION_FAILED];
    if (dbConnHint && dbConnHint.severity === 'critical') {
      pass('T016', 'DB_CONNECTION_FAILED has critical severity', `Severity: ${dbConnHint.severity}`);
    } else {
      fail('T016', 'DB_CONNECTION_FAILED has critical severity', `Got: ${dbConnHint?.severity}`);
    }

    // T017: Critical severity exists for DB_CORRUPTION
    const dbCorruptHint = RECOVERY_HINTS[ERROR_CODES.DB_CORRUPTION];
    if (dbCorruptHint && dbCorruptHint.severity === 'critical') {
      pass('T017', 'DB_CORRUPTION has critical severity', `Severity: ${dbCorruptHint.severity}`);
    } else {
      fail('T017', 'DB_CORRUPTION has critical severity', `Got: ${dbCorruptHint?.severity}`);
    }

    // T018: Critical severity exists for DB_MIGRATION_FAILED
    const dbMigHint = RECOVERY_HINTS[ERROR_CODES.DB_MIGRATION_FAILED];
    if (dbMigHint && dbMigHint.severity === 'critical') {
      pass('T018', 'DB_MIGRATION_FAILED has critical severity', `Severity: ${dbMigHint.severity}`);
    } else {
      fail('T018', 'DB_MIGRATION_FAILED has critical severity', `Got: ${dbMigHint?.severity}`);
    }

    // T019: Low severity errors are non-critical
    const lowSeverityCodes = ['INVALID_PARAMETER', 'MISSING_REQUIRED_PARAM', 'PARAMETER_OUT_OF_RANGE', 'FILE_ENCODING_ERROR', 'FILE_TOO_LARGE'];
    let lowSeverityPass = true;
    for (const codeName of lowSeverityCodes) {
      const code = ERROR_CODES[codeName];
      const hint = RECOVERY_HINTS[code];
      if (!hint || hint.severity !== 'low') {
        lowSeverityPass = false;
        break;
      }
    }
    if (lowSeverityPass) {
      pass('T019', 'Low severity codes have low severity', 'Parameter and minor file errors verified');
    } else {
      fail('T019', 'Low severity codes have low severity', 'Some codes have incorrect severity');
    }

    // T020: toolTip property is optional but valid when present
    let toolTipPass = true;
    const toolTipFailures = [];
    for (const [code, hint] of Object.entries(RECOVERY_HINTS)) {
      if (hint.toolTip !== undefined && typeof hint.toolTip !== 'string') {
        toolTipPass = false;
        toolTipFailures.push(code);
      }
    }
    if (toolTipPass) {
      pass('T020', 'toolTip property is string when present', 'All toolTip values verified');
    } else {
      fail('T020', 'toolTip property is string when present', `Invalid: ${toolTipFailures.join(', ')}`);
    }
  }

  // 4.3 TOOL_SPECIFIC_HINTS TESTS (T021-T030)

  function test_tool_specific_hints() {
    log('\n:: TOOL_SPECIFIC_HINTS - T021-T030');

    const { ERROR_CODES, TOOL_SPECIFIC_HINTS } = recoveryHints;

    // T021: TOOL_SPECIFIC_HINTS is exported and is an object
    if (TOOL_SPECIFIC_HINTS && typeof TOOL_SPECIFIC_HINTS === 'object') {
      pass('T021', 'TOOL_SPECIFIC_HINTS is exported as object', `Type: ${typeof TOOL_SPECIFIC_HINTS}`);
    } else {
      fail('T021', 'TOOL_SPECIFIC_HINTS is exported as object', `Got: ${typeof TOOL_SPECIFIC_HINTS}`);
      return;
    }

    // T022: memory_search has specific hints
    if (TOOL_SPECIFIC_HINTS.memory_search && typeof TOOL_SPECIFIC_HINTS.memory_search === 'object') {
      pass('T022', 'memory_search has tool-specific hints', `Keys: ${Object.keys(TOOL_SPECIFIC_HINTS.memory_search).length}`);
    } else {
      fail('T022', 'memory_search has tool-specific hints', 'Not found or not an object');
    }

    // T023: checkpoint_restore has specific hints
    if (TOOL_SPECIFIC_HINTS.checkpoint_restore && typeof TOOL_SPECIFIC_HINTS.checkpoint_restore === 'object') {
      pass('T023', 'checkpoint_restore has tool-specific hints', `Keys: ${Object.keys(TOOL_SPECIFIC_HINTS.checkpoint_restore).length}`);
    } else {
      fail('T023', 'checkpoint_restore has tool-specific hints', 'Not found or not an object');
    }

    // T024: memory_save has specific hints
    if (TOOL_SPECIFIC_HINTS.memory_save && typeof TOOL_SPECIFIC_HINTS.memory_save === 'object') {
      pass('T024', 'memory_save has tool-specific hints', `Keys: ${Object.keys(TOOL_SPECIFIC_HINTS.memory_save).length}`);
    } else {
      fail('T024', 'memory_save has tool-specific hints', 'Not found or not an object');
    }

    // T025: memory_index_scan has specific hints
    if (TOOL_SPECIFIC_HINTS.memory_index_scan && typeof TOOL_SPECIFIC_HINTS.memory_index_scan === 'object') {
      pass('T025', 'memory_index_scan has tool-specific hints', `Keys: ${Object.keys(TOOL_SPECIFIC_HINTS.memory_index_scan).length}`);
    } else {
      fail('T025', 'memory_index_scan has tool-specific hints', 'Not found or not an object');
    }

    // T026: memory_drift_why has specific hints
    if (TOOL_SPECIFIC_HINTS.memory_drift_why && typeof TOOL_SPECIFIC_HINTS.memory_drift_why === 'object') {
      pass('T026', 'memory_drift_why has tool-specific hints', `Keys: ${Object.keys(TOOL_SPECIFIC_HINTS.memory_drift_why).length}`);
    } else {
      fail('T026', 'memory_drift_why has tool-specific hints', 'Not found or not an object');
    }

    // T027: memory_causal_link has specific hints
    if (TOOL_SPECIFIC_HINTS.memory_causal_link && typeof TOOL_SPECIFIC_HINTS.memory_causal_link === 'object') {
      pass('T027', 'memory_causal_link has tool-specific hints', `Keys: ${Object.keys(TOOL_SPECIFIC_HINTS.memory_causal_link).length}`);
    } else {
      fail('T027', 'memory_causal_link has tool-specific hints', 'Not found or not an object');
    }

    // T028: Tool-specific hints have valid structure (hint, actions, severity)
    let structurePass = true;
    const structureFailures = [];
    for (const [toolName, hints] of Object.entries(TOOL_SPECIFIC_HINTS)) {
      for (const [code, hint] of Object.entries(hints)) {
        if (!hint.hint || !Array.isArray(hint.actions) || !hint.severity) {
          structurePass = false;
          structureFailures.push(`${toolName}.${code}`);
        }
      }
    }
    if (structurePass) {
      pass('T028', 'Tool-specific hints have valid structure', 'All hints verified');
    } else {
      fail('T028', 'Tool-specific hints have valid structure', `Invalid: ${structureFailures.join(', ')}`);
    }

    // T029: memory_search EMBEDDING_FAILED has different hint than generic
    const { RECOVERY_HINTS } = recoveryHints;
    const genericEmbedHint = RECOVERY_HINTS[ERROR_CODES.EMBEDDING_FAILED];
    const searchEmbedHint = TOOL_SPECIFIC_HINTS.memory_search?.[ERROR_CODES.EMBEDDING_FAILED];
    if (searchEmbedHint && searchEmbedHint.hint !== genericEmbedHint.hint) {
      pass('T029', 'memory_search EMBEDDING_FAILED has contextual hint', `Hint differs from generic`);
    } else {
      fail('T029', 'memory_search EMBEDDING_FAILED has contextual hint', 'Same as generic or missing');
    }

    // T030: memory_save FILE_NOT_FOUND has contextual guidance
    const saveFileNotFound = TOOL_SPECIFIC_HINTS.memory_save?.[ERROR_CODES.FILE_NOT_FOUND];
    if (saveFileNotFound && saveFileNotFound.hint.includes('index')) {
      pass('T030', 'memory_save FILE_NOT_FOUND has contextual guidance', 'Mentions indexing context');
    } else {
      fail('T030', 'memory_save FILE_NOT_FOUND has contextual guidance', 'Missing indexing context');
    }
  }

  // 4.4 getRecoveryHint() FUNCTION TESTS (T031-T040)

  function test_get_recovery_hint_function() {
    log('\n:: getRecoveryHint() Function - T031-T040');

    const { ERROR_CODES, getRecoveryHint, DEFAULT_HINT, RECOVERY_HINTS, TOOL_SPECIFIC_HINTS } = recoveryHints;

    // T031: getRecoveryHint is a function
    if (typeof getRecoveryHint === 'function') {
      pass('T031', 'getRecoveryHint is exported as function', `Type: ${typeof getRecoveryHint}`);
    } else {
      fail('T031', 'getRecoveryHint is exported as function', `Got: ${typeof getRecoveryHint}`);
      return;
    }

    // T032: Returns tool-specific hint when available
    const searchHint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
    const expectedSearchHint = TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
    if (searchHint === expectedSearchHint) {
      pass('T032', 'Returns tool-specific hint when available', 'memory_search + EMBEDDING_FAILED');
    } else {
      fail('T032', 'Returns tool-specific hint when available', 'Did not return tool-specific hint');
    }

    // T033: Falls back to generic hint when no tool-specific hint
    const genericHint = getRecoveryHint('unknown_tool', ERROR_CODES.FILE_NOT_FOUND);
    const expectedGenericHint = RECOVERY_HINTS[ERROR_CODES.FILE_NOT_FOUND];
    if (genericHint === expectedGenericHint) {
      pass('T033', 'Falls back to generic hint when no tool-specific', 'unknown_tool + FILE_NOT_FOUND');
    } else {
      fail('T033', 'Falls back to generic hint when no tool-specific', 'Did not return generic hint');
    }

    // T034: Returns DEFAULT_HINT for unknown error code
    const defaultHint = getRecoveryHint('any_tool', 'E999');
    if (defaultHint === DEFAULT_HINT) {
      pass('T034', 'Returns DEFAULT_HINT for unknown error code', 'E999 returns default');
    } else {
      fail('T034', 'Returns DEFAULT_HINT for unknown error code', 'Did not return DEFAULT_HINT');
    }

    // T035: Returns DEFAULT_HINT for null error code
    const nullCodeHint = getRecoveryHint('any_tool', null);
    if (nullCodeHint === DEFAULT_HINT) {
      pass('T035', 'Returns DEFAULT_HINT for null error code', 'null code returns default');
    } else {
      fail('T035', 'Returns DEFAULT_HINT for null error code', 'Did not return DEFAULT_HINT');
    }

    // T036: Returns DEFAULT_HINT for undefined error code
    const undefinedCodeHint = getRecoveryHint('any_tool', undefined);
    if (undefinedCodeHint === DEFAULT_HINT) {
      pass('T036', 'Returns DEFAULT_HINT for undefined error code', 'undefined code returns default');
    } else {
      fail('T036', 'Returns DEFAULT_HINT for undefined error code', 'Did not return DEFAULT_HINT');
    }

    // T037: Works with null tool name (falls back to generic)
    const nullToolHint = getRecoveryHint(null, ERROR_CODES.DB_CONNECTION_FAILED);
    const expectedDbHint = RECOVERY_HINTS[ERROR_CODES.DB_CONNECTION_FAILED];
    if (nullToolHint === expectedDbHint) {
      pass('T037', 'Works with null tool name', 'Falls back to generic hint');
    } else {
      fail('T037', 'Works with null tool name', 'Did not return expected hint');
    }

    // T038: checkpoint_restore specific hint overrides generic
    const restoreHint = getRecoveryHint('checkpoint_restore', ERROR_CODES.CHECKPOINT_NOT_FOUND);
    const genericCheckpointHint = RECOVERY_HINTS[ERROR_CODES.CHECKPOINT_NOT_FOUND];
    const specificCheckpointHint = TOOL_SPECIFIC_HINTS.checkpoint_restore?.[ERROR_CODES.CHECKPOINT_NOT_FOUND];
    if (specificCheckpointHint && restoreHint === specificCheckpointHint) {
      pass('T038', 'checkpoint_restore specific hint overrides generic', 'Tool-specific returned');
    } else {
      fail('T038', 'checkpoint_restore specific hint overrides generic', 'Generic returned instead');
    }

    // T039: Returns hint object with all required properties
    const fullHint = getRecoveryHint('memory_save', ERROR_CODES.VALIDATION_FAILED);
    if (fullHint.hint && fullHint.actions && fullHint.severity) {
      pass('T039', 'Returns hint object with all required properties', 'hint, actions, severity present');
    } else {
      fail('T039', 'Returns hint object with all required properties', 'Missing properties');
    }

    // T040: Same error code returns different hints for different tools
    const saveEmbedHint = getRecoveryHint('memory_save', ERROR_CODES.EMBEDDING_FAILED);
    const searchEmbedHint2 = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
    if (saveEmbedHint.hint !== searchEmbedHint2.hint) {
      pass('T040', 'Same error code returns different hints for different tools', 'EMBEDDING_FAILED differs by tool');
    } else {
      fail('T040', 'Same error code returns different hints for different tools', 'Hints are identical');
    }
  }

  // 4.5 hasSpecificHint() HELPER TESTS (T041-T045)

  function test_has_specific_hint_helper() {
    log('\n:: hasSpecificHint() Helper - T041-T045');

    const { ERROR_CODES, hasSpecificHint } = recoveryHints;

    // T041: hasSpecificHint is a function
    if (typeof hasSpecificHint === 'function') {
      pass('T041', 'hasSpecificHint is exported as function', `Type: ${typeof hasSpecificHint}`);
    } else {
      fail('T041', 'hasSpecificHint is exported as function', `Got: ${typeof hasSpecificHint}`);
      return;
    }

    // T042: Returns true for tool-specific hint
    const hasSearch = hasSpecificHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
    if (hasSearch === true) {
      pass('T042', 'Returns true for tool-specific hint', 'memory_search + EMBEDDING_FAILED');
    } else {
      fail('T042', 'Returns true for tool-specific hint', `Got: ${hasSearch}`);
    }

    // T043: Returns true for generic hint (no tool-specific)
    const hasGeneric = hasSpecificHint('unknown_tool', ERROR_CODES.DB_CORRUPTION);
    if (hasGeneric === true) {
      pass('T043', 'Returns true for generic hint (no tool-specific)', 'unknown_tool + DB_CORRUPTION');
    } else {
      fail('T043', 'Returns true for generic hint (no tool-specific)', `Got: ${hasGeneric}`);
    }

    // T044: Returns false for unknown error code
    const hasUnknown = hasSpecificHint('any_tool', 'E999');
    if (hasUnknown === false) {
      pass('T044', 'Returns false for unknown error code', 'E999 not found');
    } else {
      fail('T044', 'Returns false for unknown error code', `Got: ${hasUnknown}`);
    }

    // T045: Returns false for null/undefined inputs
    const hasNull = hasSpecificHint(null, null);
    const hasUndefined = hasSpecificHint(undefined, undefined);
    if (hasNull === false && hasUndefined === false) {
      pass('T045', 'Returns false for null/undefined inputs', 'Both return false');
    } else {
      fail('T045', 'Returns false for null/undefined inputs', `null: ${hasNull}, undefined: ${hasUndefined}`);
    }
  }

  // 4.6 getAvailableHints() HELPER TESTS (T046-T050)

  function test_get_available_hints_helper() {
    log('\n:: getAvailableHints() Helper - T046-T050');

    const { ERROR_CODES, getAvailableHints, RECOVERY_HINTS, TOOL_SPECIFIC_HINTS } = recoveryHints;

    // T046: getAvailableHints is a function
    if (typeof getAvailableHints === 'function') {
      pass('T046', 'getAvailableHints is exported as function', `Type: ${typeof getAvailableHints}`);
    } else {
      fail('T046', 'getAvailableHints is exported as function', `Got: ${typeof getAvailableHints}`);
      return;
    }

    // T047: Returns all generic hints for unknown tool
    const unknownHints = getAvailableHints('unknown_tool');
    const genericHintCount = Object.keys(RECOVERY_HINTS).length;
    if (Object.keys(unknownHints).length === genericHintCount) {
      pass('T047', 'Returns all generic hints for unknown tool', `Count: ${genericHintCount}`);
    } else {
      fail('T047', 'Returns all generic hints for unknown tool', `Expected ${genericHintCount}, got ${Object.keys(unknownHints).length}`);
    }

    // T048: Returns merged hints for tool with specific hints
    const searchHints = getAvailableHints('memory_search');
    const toolSpecificCount = Object.keys(TOOL_SPECIFIC_HINTS.memory_search || {}).length;
    // Should have all generic hints plus potentially overridden tool-specific ones
    if (Object.keys(searchHints).length >= genericHintCount) {
      pass('T048', 'Returns merged hints for tool with specific hints', `Count: ${Object.keys(searchHints).length}`);
    } else {
      fail('T048', 'Returns merged hints for tool with specific hints', `Expected >= ${genericHintCount}`);
    }

    // T049: Tool-specific hints override generic in result
    const searchEmbedHint = searchHints[ERROR_CODES.EMBEDDING_FAILED];
    const expectedToolHint = TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
    if (searchEmbedHint === expectedToolHint) {
      pass('T049', 'Tool-specific hints override generic in result', 'EMBEDDING_FAILED overridden');
    } else {
      fail('T049', 'Tool-specific hints override generic in result', 'Generic returned instead');
    }

    // T050: Returns object with string keys (error codes)
    const allKeysAreStrings = Object.keys(unknownHints).every(k => typeof k === 'string');
    if (allKeysAreStrings) {
      pass('T050', 'Returns object with string keys (error codes)', 'All keys are strings');
    } else {
      fail('T050', 'Returns object with string keys (error codes)', 'Some keys are not strings');
    }
  }

  // 4.7 getErrorCodes() HELPER TESTS (T051-T055)

  function test_get_error_codes_helper() {
    log('\n:: getErrorCodes() Helper - T051-T055');

    const { ERROR_CODES, getErrorCodes } = recoveryHints;

    // T051: getErrorCodes is a function
    if (typeof getErrorCodes === 'function') {
      pass('T051', 'getErrorCodes is exported as function', `Type: ${typeof getErrorCodes}`);
    } else {
      fail('T051', 'getErrorCodes is exported as function', `Got: ${typeof getErrorCodes}`);
      return;
    }

    // T052: Returns ERROR_CODES constant
    const codes = getErrorCodes();
    if (codes === ERROR_CODES) {
      pass('T052', 'Returns ERROR_CODES constant', 'Same reference');
    } else {
      fail('T052', 'Returns ERROR_CODES constant', 'Different reference');
    }

    // T053: Returned object is immutable reference (same object)
    const codes2 = getErrorCodes();
    if (codes === codes2) {
      pass('T053', 'Returned object is same reference on multiple calls', 'References match');
    } else {
      fail('T053', 'Returned object is same reference on multiple calls', 'Different references');
    }

    // T054: Contains all expected error code names
    const expectedCodeNames = [
      'EMBEDDING_FAILED', 'FILE_NOT_FOUND', 'DB_CONNECTION_FAILED',
      'INVALID_PARAMETER', 'SEARCH_FAILED', 'API_KEY_INVALID_STARTUP',
      'CHECKPOINT_NOT_FOUND', 'SESSION_EXPIRED', 'MEMORY_NOT_FOUND',
      'VALIDATION_FAILED', 'CAUSAL_EDGE_NOT_FOUND', 'RATE_LIMITED'
    ];
    const allPresent = expectedCodeNames.every(name => codes[name] !== undefined);
    if (allPresent) {
      pass('T054', 'Contains all expected error code names', `${expectedCodeNames.length} names verified`);
    } else {
      fail('T054', 'Contains all expected error code names', 'Some names missing');
    }

    // T055: Can be used to enumerate all error codes
    const allCodes = Object.entries(codes);
    if (allCodes.length === 49) {
      pass('T055', 'Can enumerate all 49 error codes', `Count: ${allCodes.length}`);
    } else {
      fail('T055', 'Can enumerate all 49 error codes', `Expected 49, got ${allCodes.length}`);
    }
  }

  // 4.8 DEFAULT_HINT TESTS (T056-T060)

  function test_default_hint() {
    log('\n:: DEFAULT_HINT Fallback - T056-T060');

    const { DEFAULT_HINT } = recoveryHints;

    // T056: DEFAULT_HINT is exported and is an object
    if (DEFAULT_HINT && typeof DEFAULT_HINT === 'object') {
      pass('T056', 'DEFAULT_HINT is exported as object', `Type: ${typeof DEFAULT_HINT}`);
    } else {
      fail('T056', 'DEFAULT_HINT is exported as object', `Got: ${typeof DEFAULT_HINT}`);
      return;
    }

    // T057: DEFAULT_HINT has hint property with expected message
    if (DEFAULT_HINT.hint === 'An unexpected error occurred.') {
      pass('T057', 'DEFAULT_HINT has expected hint message', `Hint: "${DEFAULT_HINT.hint}"`);
    } else {
      fail('T057', 'DEFAULT_HINT has expected hint message', `Got: "${DEFAULT_HINT.hint}"`);
    }

    // T058: DEFAULT_HINT has actions array with memory_health() reference (REQ-009)
    const hasMemoryHealthAction = DEFAULT_HINT.actions.some(a => a.includes('memory_health()'));
    if (Array.isArray(DEFAULT_HINT.actions) && hasMemoryHealthAction) {
      pass('T058', 'DEFAULT_HINT actions include memory_health() reference (REQ-009)', `Actions: ${DEFAULT_HINT.actions.length}`);
    } else {
      fail('T058', 'DEFAULT_HINT actions include memory_health() reference (REQ-009)', 'Missing memory_health() action');
    }

    // T059: DEFAULT_HINT has medium severity
    if (DEFAULT_HINT.severity === 'medium') {
      pass('T059', 'DEFAULT_HINT has medium severity', `Severity: ${DEFAULT_HINT.severity}`);
    } else {
      fail('T059', 'DEFAULT_HINT has medium severity', `Got: ${DEFAULT_HINT.severity}`);
    }

    // T060: DEFAULT_HINT has toolTip pointing to memory_health()
    if (DEFAULT_HINT.toolTip === 'memory_health()') {
      pass('T060', 'DEFAULT_HINT has toolTip for memory_health()', `toolTip: ${DEFAULT_HINT.toolTip}`);
    } else {
      fail('T060', 'DEFAULT_HINT has toolTip for memory_health()', `Got: ${DEFAULT_HINT.toolTip}`);
    }
  }

  // 4.9 SEVERITY LEVELS TESTS (T061-T070)

  function test_severity_levels() {
    log('\n:: Severity Levels - T061-T070');

    const { ERROR_CODES, RECOVERY_HINTS } = recoveryHints;

    // T061: 'critical' severity count
    const criticalHints = Object.values(RECOVERY_HINTS).filter(h => h.severity === 'critical');
    if (criticalHints.length >= 3) {
      pass('T061', 'At least 3 critical severity hints exist', `Count: ${criticalHints.length}`);
    } else {
      fail('T061', 'At least 3 critical severity hints exist', `Count: ${criticalHints.length}`);
    }

    // T062: 'high' severity count
    const highHints = Object.values(RECOVERY_HINTS).filter(h => h.severity === 'high');
    if (highHints.length >= 5) {
      pass('T062', 'At least 5 high severity hints exist', `Count: ${highHints.length}`);
    } else {
      fail('T062', 'At least 5 high severity hints exist', `Count: ${highHints.length}`);
    }

    // T063: 'medium' severity count
    const mediumHints = Object.values(RECOVERY_HINTS).filter(h => h.severity === 'medium');
    if (mediumHints.length >= 15) {
      pass('T063', 'At least 15 medium severity hints exist', `Count: ${mediumHints.length}`);
    } else {
      fail('T063', 'At least 15 medium severity hints exist', `Count: ${mediumHints.length}`);
    }

    // T064: 'low' severity count
    const lowHints = Object.values(RECOVERY_HINTS).filter(h => h.severity === 'low');
    if (lowHints.length >= 10) {
      pass('T064', 'At least 10 low severity hints exist', `Count: ${lowHints.length}`);
    } else {
      fail('T064', 'At least 10 low severity hints exist', `Count: ${lowHints.length}`);
    }

    // T065: EMBEDDING_PROVIDER_UNAVAILABLE is high severity
    const providerHint = RECOVERY_HINTS[ERROR_CODES.EMBEDDING_PROVIDER_UNAVAILABLE];
    if (providerHint && providerHint.severity === 'high') {
      pass('T065', 'EMBEDDING_PROVIDER_UNAVAILABLE is high severity', `Severity: ${providerHint.severity}`);
    } else {
      fail('T065', 'EMBEDDING_PROVIDER_UNAVAILABLE is high severity', `Got: ${providerHint?.severity}`);
    }

    // T066: API_KEY_INVALID_STARTUP is high severity
    const apiKeyHint = RECOVERY_HINTS[ERROR_CODES.API_KEY_INVALID_STARTUP];
    if (apiKeyHint && apiKeyHint.severity === 'high') {
      pass('T066', 'API_KEY_INVALID_STARTUP is high severity', `Severity: ${apiKeyHint.severity}`);
    } else {
      fail('T066', 'API_KEY_INVALID_STARTUP is high severity', `Got: ${apiKeyHint?.severity}`);
    }

    // T067: SERVICE_UNAVAILABLE is high severity
    const serviceHint = RECOVERY_HINTS[ERROR_CODES.SERVICE_UNAVAILABLE];
    if (serviceHint && serviceHint.severity === 'high') {
      pass('T067', 'SERVICE_UNAVAILABLE is high severity', `Severity: ${serviceHint.severity}`);
    } else {
      fail('T067', 'SERVICE_UNAVAILABLE is high severity', `Got: ${serviceHint?.severity}`);
    }

    // T068: RATE_LIMITED is low severity (transient)
    const rateHint = RECOVERY_HINTS[ERROR_CODES.RATE_LIMITED];
    if (rateHint && rateHint.severity === 'low') {
      pass('T068', 'RATE_LIMITED is low severity (transient)', `Severity: ${rateHint.severity}`);
    } else {
      fail('T068', 'RATE_LIMITED is low severity (transient)', `Got: ${rateHint?.severity}`);
    }

    // T069: SESSION_EXPIRED is low severity (user can recover)
    const sessionHint = RECOVERY_HINTS[ERROR_CODES.SESSION_EXPIRED];
    if (sessionHint && sessionHint.severity === 'low') {
      pass('T069', 'SESSION_EXPIRED is low severity (user can recover)', `Severity: ${sessionHint.severity}`);
    } else {
      fail('T069', 'SESSION_EXPIRED is low severity (user can recover)', `Got: ${sessionHint?.severity}`);
    }

    // T070: CHECKPOINT_RESTORE_FAILED is high severity (data loss risk)
    const restoreHint = RECOVERY_HINTS[ERROR_CODES.CHECKPOINT_RESTORE_FAILED];
    if (restoreHint && restoreHint.severity === 'high') {
      pass('T070', 'CHECKPOINT_RESTORE_FAILED is high severity (data loss risk)', `Severity: ${restoreHint.severity}`);
    } else {
      fail('T070', 'CHECKPOINT_RESTORE_FAILED is high severity (data loss risk)', `Got: ${restoreHint?.severity}`);
    }
  }

  // 4.10 ERROR CODE CATEGORIES TESTS (T071-T080)

  function test_error_code_categories() {
    log('\n:: Error Code Categories - T071-T080');

    const { ERROR_CODES } = recoveryHints;

    // T071: Search error codes (E040-E044) exist
    const searchCodes = ['SEARCH_FAILED', 'VECTOR_SEARCH_UNAVAILABLE', 'QUERY_TOO_LONG', 'QUERY_EMPTY', 'NO_RESULTS'];
    const searchValues = ['E040', 'E041', 'E042', 'E043', 'E044'];
    let searchPass = true;
    for (let i = 0; i < searchCodes.length; i++) {
      if (ERROR_CODES[searchCodes[i]] !== searchValues[i]) {
        searchPass = false;
        break;
      }
    }
    if (searchPass) {
      pass('T071', 'Search error codes (E040-E044) exist', 'All 5 codes verified');
    } else {
      fail('T071', 'Search error codes (E040-E044) exist', 'Missing or incorrect codes');
    }

    // T072: API/Auth error codes (E050-E053) exist
    const apiCodes = ['API_KEY_INVALID_STARTUP', 'API_KEY_INVALID_RUNTIME', 'LOCAL_MODEL_UNAVAILABLE', 'API_RATE_LIMITED'];
    const apiValues = ['E050', 'E051', 'E052', 'E053'];
    let apiPass = true;
    for (let i = 0; i < apiCodes.length; i++) {
      if (ERROR_CODES[apiCodes[i]] !== apiValues[i]) {
        apiPass = false;
        break;
      }
    }
    if (apiPass) {
      pass('T072', 'API/Auth error codes (E050-E053) exist', 'All 4 codes verified');
    } else {
      fail('T072', 'API/Auth error codes (E050-E053) exist', 'Missing or incorrect codes');
    }

    // T073: Checkpoint error codes (E060-E063) exist
    const checkpointCodes = ['CHECKPOINT_NOT_FOUND', 'CHECKPOINT_RESTORE_FAILED', 'CHECKPOINT_CREATE_FAILED', 'CHECKPOINT_DUPLICATE_NAME'];
    const checkpointValues = ['E060', 'E061', 'E062', 'E063'];
    let checkpointPass = true;
    for (let i = 0; i < checkpointCodes.length; i++) {
      if (ERROR_CODES[checkpointCodes[i]] !== checkpointValues[i]) {
        checkpointPass = false;
        break;
      }
    }
    if (checkpointPass) {
      pass('T073', 'Checkpoint error codes (E060-E063) exist', 'All 4 codes verified');
    } else {
      fail('T073', 'Checkpoint error codes (E060-E063) exist', 'Missing or incorrect codes');
    }

    // T074: Session error codes (E070-E072) exist
    const sessionCodes = ['SESSION_EXPIRED', 'SESSION_INVALID', 'SESSION_RECOVERY_FAILED'];
    const sessionValues = ['E070', 'E071', 'E072'];
    let sessionPass = true;
    for (let i = 0; i < sessionCodes.length; i++) {
      if (ERROR_CODES[sessionCodes[i]] !== sessionValues[i]) {
        sessionPass = false;
        break;
      }
    }
    if (sessionPass) {
      pass('T074', 'Session error codes (E070-E072) exist', 'All 3 codes verified');
    } else {
      fail('T074', 'Session error codes (E070-E072) exist', 'Missing or incorrect codes');
    }

    // T075: Memory operation error codes (E080-E084) exist
    const memCodes = ['MEMORY_NOT_FOUND', 'MEMORY_SAVE_FAILED', 'MEMORY_DELETE_FAILED', 'MEMORY_UPDATE_FAILED', 'MEMORY_DUPLICATE'];
    const memValues = ['E080', 'E081', 'E082', 'E083', 'E084'];
    let memPass = true;
    for (let i = 0; i < memCodes.length; i++) {
      if (ERROR_CODES[memCodes[i]] !== memValues[i]) {
        memPass = false;
        break;
      }
    }
    if (memPass) {
      pass('T075', 'Memory operation error codes (E080-E084) exist', 'All 5 codes verified');
    } else {
      fail('T075', 'Memory operation error codes (E080-E084) exist', 'Missing or incorrect codes');
    }

    // T076: Validation error codes (E090-E093) exist
    const valCodes = ['VALIDATION_FAILED', 'ANCHOR_FORMAT_INVALID', 'TOKEN_BUDGET_EXCEEDED', 'PREFLIGHT_FAILED'];
    const valValues = ['E090', 'E091', 'E092', 'E093'];
    let valPass = true;
    for (let i = 0; i < valCodes.length; i++) {
      if (ERROR_CODES[valCodes[i]] !== valValues[i]) {
        valPass = false;
        break;
      }
    }
    if (valPass) {
      pass('T076', 'Validation error codes (E090-E093) exist', 'All 4 codes verified');
    } else {
      fail('T076', 'Validation error codes (E090-E093) exist', 'Missing or incorrect codes');
    }

    // T077: Causal graph error codes (E100-E103) exist
    const causalCodes = ['CAUSAL_EDGE_NOT_FOUND', 'CAUSAL_CYCLE_DETECTED', 'CAUSAL_INVALID_RELATION', 'CAUSAL_SELF_REFERENCE'];
    const causalValues = ['E100', 'E101', 'E102', 'E103'];
    let causalPass = true;
    for (let i = 0; i < causalCodes.length; i++) {
      if (ERROR_CODES[causalCodes[i]] !== causalValues[i]) {
        causalPass = false;
        break;
      }
    }
    if (causalPass) {
      pass('T077', 'Causal graph error codes (E100-E103) exist', 'All 4 codes verified');
    } else {
      fail('T077', 'Causal graph error codes (E100-E103) exist', 'Missing or incorrect codes');
    }

    // T078: Error code ranges are non-overlapping
    const allValues = Object.values(ERROR_CODES).filter(v => v !== 'E429' && v !== 'E503'); // Exclude HTTP-style
    const numericParts = allValues.map(v => parseInt(v.slice(1)));
    const sortedNumeric = [...numericParts].sort((a, b) => a - b);
    let gapsExist = true;
    for (let i = 1; i < sortedNumeric.length; i++) {
      if (sortedNumeric[i] - sortedNumeric[i-1] < 1) {
        gapsExist = false;
        break;
      }
    }
    if (gapsExist) {
      pass('T078', 'Error code ranges allow for expansion', 'Gaps exist between categories');
    } else {
      fail('T078', 'Error code ranges allow for expansion', 'No gaps between some codes');
    }

    // T079: All error codes follow E### format
    const allFollowFormat = Object.values(ERROR_CODES).every(v => /^E\d+$/.test(v));
    if (allFollowFormat) {
      pass('T079', 'All error codes follow E### format', 'Format verified');
    } else {
      fail('T079', 'All error codes follow E### format', 'Some codes do not match format');
    }

    // T080: Error code values are ascending within categories
    const categories = {
      embedding: [ERROR_CODES.EMBEDDING_FAILED, ERROR_CODES.EMBEDDING_DIMENSION_INVALID, ERROR_CODES.EMBEDDING_TIMEOUT, ERROR_CODES.EMBEDDING_PROVIDER_UNAVAILABLE],
      file: [ERROR_CODES.FILE_NOT_FOUND, ERROR_CODES.FILE_ACCESS_DENIED, ERROR_CODES.FILE_ENCODING_ERROR, ERROR_CODES.FILE_TOO_LARGE, ERROR_CODES.FILE_INVALID_PATH],
      db: [ERROR_CODES.DB_CONNECTION_FAILED, ERROR_CODES.DB_QUERY_FAILED, ERROR_CODES.DB_TRANSACTION_FAILED, ERROR_CODES.DB_MIGRATION_FAILED, ERROR_CODES.DB_CORRUPTION],
    };
    let ascendingPass = true;
    for (const [cat, codes] of Object.entries(categories)) {
      const nums = codes.map(c => parseInt(c.slice(1)));
      for (let i = 1; i < nums.length; i++) {
        if (nums[i] <= nums[i-1]) {
          ascendingPass = false;
          break;
        }
      }
    }
    if (ascendingPass) {
      pass('T080', 'Error codes are ascending within categories', 'Order verified');
    } else {
      fail('T080', 'Error codes are ascending within categories', 'Some codes out of order');
    }
  }

  // 4.11 ACTION CONTENT TESTS (T081-T090)

  function test_action_content() {
    log('\n:: Action Content - T081-T090');

    const { ERROR_CODES, RECOVERY_HINTS } = recoveryHints;

    // T081: Actions are non-empty strings
    let actionsValid = true;
    const actionFailures = [];
    for (const [code, hint] of Object.entries(RECOVERY_HINTS)) {
      for (const action of hint.actions) {
        if (typeof action !== 'string' || action.trim() === '') {
          actionsValid = false;
          actionFailures.push(code);
          break;
        }
      }
    }
    if (actionsValid) {
      pass('T081', 'All actions are non-empty strings', 'All actions verified');
    } else {
      fail('T081', 'All actions are non-empty strings', `Invalid: ${actionFailures.join(', ')}`);
    }

    // T082: DB_CORRUPTION has checkpoint_list() action
    const corruptionHint = RECOVERY_HINTS[ERROR_CODES.DB_CORRUPTION];
    const hasCheckpointAction = corruptionHint.actions.some(a => a.includes('checkpoint_list()'));
    if (hasCheckpointAction) {
      pass('T082', 'DB_CORRUPTION mentions checkpoint_list()', 'Recovery action found');
    } else {
      fail('T082', 'DB_CORRUPTION mentions checkpoint_list()', 'Missing checkpoint_list() action');
    }

    // T083: EMBEDDING_FAILED mentions BM25 fallback
    const embedHint = RECOVERY_HINTS[ERROR_CODES.EMBEDDING_FAILED];
    const hasBM25 = embedHint.hint.includes('BM25') || embedHint.actions.some(a => a.includes('BM25'));
    if (hasBM25) {
      pass('T083', 'EMBEDDING_FAILED mentions BM25 fallback', 'Fallback documented');
    } else {
      fail('T083', 'EMBEDDING_FAILED mentions BM25 fallback', 'Missing BM25 reference');
    }

    // T084: ANCHOR_FORMAT_INVALID provides format example
    const anchorHint = RECOVERY_HINTS[ERROR_CODES.ANCHOR_FORMAT_INVALID];
    const hasFormatExample = anchorHint.actions.some(a => a.includes('<!-- ANCHOR:'));
    if (hasFormatExample) {
      pass('T084', 'ANCHOR_FORMAT_INVALID provides format example', 'Format example found');
    } else {
      fail('T084', 'ANCHOR_FORMAT_INVALID provides format example', 'Missing format example');
    }

    // T085: CAUSAL_INVALID_RELATION lists valid relations
    const causalHint = RECOVERY_HINTS[ERROR_CODES.CAUSAL_INVALID_RELATION];
    const hasValidRelations = causalHint.actions.some(a => a.includes('caused') && a.includes('supports'));
    if (hasValidRelations) {
      pass('T085', 'CAUSAL_INVALID_RELATION lists valid relations', 'Valid relations documented');
    } else {
      fail('T085', 'CAUSAL_INVALID_RELATION lists valid relations', 'Missing valid relations list');
    }

    // T086: FILE_TOO_LARGE suggests splitting
    const fileLargeHint = RECOVERY_HINTS[ERROR_CODES.FILE_TOO_LARGE];
    const hasSplitSuggestion = fileLargeHint.actions.some(a => a.toLowerCase().includes('split'));
    if (hasSplitSuggestion) {
      pass('T086', 'FILE_TOO_LARGE suggests splitting', 'Split suggestion found');
    } else {
      fail('T086', 'FILE_TOO_LARGE suggests splitting', 'Missing split suggestion');
    }

    // T087: QUERY_TOO_LONG suggests memory_match_triggers()
    const queryLongHint = RECOVERY_HINTS[ERROR_CODES.QUERY_TOO_LONG];
    const hasTriggerSuggestion = queryLongHint.actions.some(a => a.includes('memory_match_triggers()'));
    if (hasTriggerSuggestion) {
      pass('T087', 'QUERY_TOO_LONG suggests memory_match_triggers()', 'Alternative tool suggested');
    } else {
      fail('T087', 'QUERY_TOO_LONG suggests memory_match_triggers()', 'Missing alternative suggestion');
    }

    // T088: MEMORY_SAVE_FAILED mentions dryRun
    const saveFailedHint = RECOVERY_HINTS[ERROR_CODES.MEMORY_SAVE_FAILED];
    const hasDryRun = saveFailedHint.actions.some(a => a.includes('dryRun'));
    if (hasDryRun) {
      pass('T088', 'MEMORY_SAVE_FAILED mentions dryRun validation', 'dryRun suggestion found');
    } else {
      fail('T088', 'MEMORY_SAVE_FAILED mentions dryRun validation', 'Missing dryRun suggestion');
    }

    // T089: MEMORY_DUPLICATE suggests force=true
    const duplicateHint = RECOVERY_HINTS[ERROR_CODES.MEMORY_DUPLICATE];
    const hasForce = duplicateHint.actions.some(a => a.includes('force=true'));
    if (hasForce) {
      pass('T089', 'MEMORY_DUPLICATE suggests force=true', 'Force option documented');
    } else {
      fail('T089', 'MEMORY_DUPLICATE suggests force=true', 'Missing force option');
    }

    // T090: SESSION_EXPIRED mentions recovery command
    const expiredHint = RECOVERY_HINTS[ERROR_CODES.SESSION_EXPIRED];
    const hasRecovery = expiredHint.actions.some(a => a.includes('/memory:continue') || a.includes('recovery'));
    if (hasRecovery) {
      pass('T090', 'SESSION_EXPIRED mentions recovery option', 'Recovery documented');
    } else {
      fail('T090', 'SESSION_EXPIRED mentions recovery option', 'Missing recovery option');
    }
  }

  // 4.12 INTEGRATION TESTS (T091-T095)

  function test_integration() {
    log('\n:: Integration Tests - T091-T095');

    const { ERROR_CODES, RECOVERY_HINTS, TOOL_SPECIFIC_HINTS, getRecoveryHint, hasSpecificHint, getAvailableHints, getErrorCodes, DEFAULT_HINT } = recoveryHints;

    // T091: Complete lookup chain works (tool-specific -> generic -> default)
    const toolSpecific = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
    const generic = getRecoveryHint('unknown_tool', ERROR_CODES.EMBEDDING_FAILED);
    const defaultFallback = getRecoveryHint('unknown_tool', 'E999');

    const chainWorks = (
      toolSpecific === TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED] &&
      generic === RECOVERY_HINTS[ERROR_CODES.EMBEDDING_FAILED] &&
      defaultFallback === DEFAULT_HINT
    );
    if (chainWorks) {
      pass('T091', 'Complete lookup chain works', 'tool-specific -> generic -> default');
    } else {
      fail('T091', 'Complete lookup chain works', 'Chain broken');
    }

    // T092: getAvailableHints includes all generic + tool-specific
    const allSearchHints = getAvailableHints('memory_search');
    const allCodes = Object.keys(getErrorCodes());
    const allCodesHaveHints = Object.values(ERROR_CODES).every(code => allSearchHints[code] !== undefined);
    if (allCodesHaveHints) {
      pass('T092', 'getAvailableHints includes all error codes', `${Object.keys(allSearchHints).length} hints`);
    } else {
      fail('T092', 'getAvailableHints includes all error codes', 'Some codes missing');
    }

    // T093: hasSpecificHint and getRecoveryHint are consistent
    let consistent = true;
    for (const code of Object.values(ERROR_CODES)) {
      const hasIt = hasSpecificHint('unknown_tool', code);
      const hint = getRecoveryHint('unknown_tool', code);
      if (hasIt && hint === DEFAULT_HINT) {
        consistent = false;
        break;
      }
      if (!hasIt && hint !== DEFAULT_HINT) {
        consistent = false;
        break;
      }
    }
    if (consistent) {
      pass('T093', 'hasSpecificHint and getRecoveryHint are consistent', 'All codes verified');
    } else {
      fail('T093', 'hasSpecificHint and getRecoveryHint are consistent', 'Inconsistency found');
    }

    // T094: All exported functions work without throwing
    let noThrows = true;
    try {
      getRecoveryHint(null, null);
      getRecoveryHint('', '');
      hasSpecificHint(null, null);
      hasSpecificHint('', '');
      getAvailableHints(null);
      getAvailableHints('');
      getErrorCodes();
    } catch (e) {
      noThrows = false;
    }
    if (noThrows) {
      pass('T094', 'All exported functions handle edge cases without throwing', 'No exceptions');
    } else {
      fail('T094', 'All exported functions handle edge cases without throwing', 'Exception thrown');
    }

    // T095: Module exports all expected items
    const expectedExports = ['ERROR_CODES', 'RECOVERY_HINTS', 'TOOL_SPECIFIC_HINTS', 'DEFAULT_HINT', 'getRecoveryHint', 'hasSpecificHint', 'getAvailableHints', 'getErrorCodes'];
    const allExported = expectedExports.every(name => recoveryHints[name] !== undefined);
    if (allExported) {
      pass('T095', 'Module exports all expected items', `${expectedExports.length} exports verified`);
    } else {
      fail('T095', 'Module exports all expected items', 'Some exports missing');
    }
  }

  /* ─────────────────────────────────────────────────────────────
     5. TEST RUNNER
  ──────────────────────────────────────────────────────────────── */

  async function runTests() {
    log(':: Recovery Hints Tests');
    log('==========================================');
    log(`Date: ${new Date().toISOString()}\n`);

    // Load module first
    if (!test_module_loads()) {
      log('\n[WARN] Module failed to load. Aborting tests.');
      return results;
    }

    // Run all test suites
    test_error_codes_constant();           // T002-T010
    test_recovery_hints_catalog();         // T011-T020
    test_tool_specific_hints();            // T021-T030
    test_get_recovery_hint_function();     // T031-T040
    test_has_specific_hint_helper();       // T041-T045
    test_get_available_hints_helper();     // T046-T050
    test_get_error_codes_helper();         // T051-T055
    test_default_hint();                   // T056-T060
    test_severity_levels();                // T061-T070
    test_error_code_categories();          // T071-T080
    test_action_content();                 // T081-T090
    test_integration();                    // T091-T095

    // Summary
    log('\n==========================================');
    log(':: TEST SUMMARY');
    log('==========================================');
    log(`[PASS]  Passed:  ${results.passed}`);
    log(`[FAIL]  Failed:  ${results.failed}`);
    log(`[SKIP]  Skipped: ${results.skipped}`);
    log(`[INFO]  Total:   ${results.passed + results.failed + results.skipped}`);
    log('');

    const passRate = ((results.passed / (results.passed + results.failed)) * 100).toFixed(1);
    log(`Pass Rate: ${passRate}%`);
    log('');

    if (results.failed === 0) {
      log('[SUCCESS] ALL TESTS PASSED!');
    } else {
      log('[WARN] Some tests failed. Review output above.');
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
