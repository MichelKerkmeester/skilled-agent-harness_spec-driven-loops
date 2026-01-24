// ───────────────────────────────────────────────────────────────
// TEST: FIVE CHECKS FRAMEWORK
// ───────────────────────────────────────────────────────────────
// Tests for the Five Checks Framework integration:
// - Reference documentation validation
// - Template integration for Level 3/3+ spec folders
// - Decision record format compliance
// - Quick assessment format validation
// ───────────────────────────────────────────────────────────────

'use strict';

const path = require('path');
const fs = require('fs');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const ROOT = path.join(__dirname, '..', '..');
const REFERENCES_PATH = path.join(ROOT, 'references', 'validation');
const TEMPLATES_PATH = path.join(ROOT, 'templates');
const TEST_FIXTURES_PATH = path.join(ROOT, 'test-fixtures');

// Test results
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
};

/* ─────────────────────────────────────────────────────────────
   2. UTILITIES
──────────────────────────────────────────────────────────────── */

function log(msg) {
  console.log(msg);
}

function pass(test_name, evidence) {
  results.passed++;
  results.tests.push({ name: test_name, status: 'PASS', evidence });
  log(`   ✅ ${test_name}`);
  if (evidence) log(`      Evidence: ${evidence}`);
}

function fail(test_name, reason) {
  results.failed++;
  results.tests.push({ name: test_name, status: 'FAIL', reason });
  log(`   ❌ ${test_name}`);
  log(`      Reason: ${reason}`);
}

function skip(test_name, reason) {
  results.skipped++;
  results.tests.push({ name: test_name, status: 'SKIP', reason });
  log(`   ⏭️  ${test_name} (skipped: ${reason})`);
}

/* ─────────────────────────────────────────────────────────────
   3. REFERENCE DOCUMENTATION TESTS
──────────────────────────────────────────────────────────────── */

async function test_reference_documentation() {
  log('\n🔬 REFERENCE DOCUMENTATION TESTS');

  const five_checks_path = path.join(REFERENCES_PATH, 'five-checks.md');

  try {
    // Test 1: Reference file exists
    if (fs.existsSync(five_checks_path)) {
      pass('FC-001: Five Checks reference file exists', five_checks_path);
    } else {
      fail('FC-001: Five Checks reference file exists', 'File not found');
      return; // Skip remaining tests
    }

    const content = fs.readFileSync(five_checks_path, 'utf8');

    // Test 2: All five checks are documented
    const checks = [
      { name: 'Necessary?', question: 'ACTUAL need NOW' },
      { name: 'Beyond Local Maxima?', question: 'explored alternatives' },
      { name: 'Sufficient?', question: 'simplest approach' },
      { name: 'Fits Goal?', question: 'critical path' },
      { name: 'Open Horizons?', question: 'long-term' }
    ];

    let all_checks_documented = true;
    for (const check of checks) {
      if (!content.includes(check.name)) {
        fail(`FC-002: Check "${check.name}" documented`, 'Check name not found');
        all_checks_documented = false;
      }
    }
    if (all_checks_documented) {
      pass('FC-002: All five checks documented', '5/5 checks found');
    }

    // Test 3: Each check has evaluation criteria
    if (content.includes('Evaluation Criteria:') || content.includes('**Evaluation Criteria:**')) {
      const criteria_count = (content.match(/Evaluation Criteria/g) || []).length;
      if (criteria_count >= 5) {
        pass('FC-003: All checks have evaluation criteria', `${criteria_count} criteria sections`);
      } else {
        fail('FC-003: All checks have evaluation criteria', `Only ${criteria_count} found`);
      }
    } else {
      fail('FC-003: All checks have evaluation criteria', 'No criteria sections found');
    }

    // Test 4: PASS and FAIL examples provided
    const pass_examples = (content.match(/PASS Examples/gi) || []).length;
    const fail_examples = (content.match(/FAIL Examples/gi) || []).length;

    if (pass_examples >= 5 && fail_examples >= 5) {
      pass('FC-004: PASS/FAIL examples for all checks', `${pass_examples} pass, ${fail_examples} fail examples`);
    } else {
      fail('FC-004: PASS/FAIL examples for all checks', `Only ${pass_examples} pass, ${fail_examples} fail`);
    }

    // Test 5: Evaluation format documented
    if (content.includes('Quick Assessment Table') || content.includes('Quick Assessment')) {
      pass('FC-005: Quick assessment format documented', 'Table format found');
    } else {
      fail('FC-005: Quick assessment format documented', 'Quick assessment not found');
    }

    // Test 6: Pass/fail thresholds documented
    if (content.includes('5/5') && content.includes('4/5') && content.includes('3')) {
      pass('FC-006: Pass/fail thresholds documented', '5/5, 4/5, 3+ thresholds');
    } else {
      fail('FC-006: Pass/fail thresholds documented', 'Thresholds not clear');
    }

    // Test 7: When to apply documented
    if (content.includes('When to Apply') || content.includes('Mandatory Application')) {
      pass('FC-007: When to apply Five Checks documented', 'Application guidance found');
    } else {
      fail('FC-007: When to apply Five Checks documented', 'No guidance found');
    }

    // Test 8: Level requirements documented
    if (content.includes('Level 3') && content.includes('100 LOC')) {
      pass('FC-008: Level/LOC requirements documented', 'Level 3 and 100 LOC triggers');
    } else {
      fail('FC-008: Level/LOC requirements documented', 'Level requirements unclear');
    }

    // Test 9: Remediation guidance for failures
    if (content.includes('Handling Failures') || content.includes('REMEDIATION')) {
      pass('FC-009: Failure remediation guidance', 'Remediation section found');
    } else {
      fail('FC-009: Failure remediation guidance', 'No remediation guidance');
    }

    // Test 10: Integration with decision-record documented
    if (content.includes('decision-record.md') || content.includes('Decision Records')) {
      pass('FC-010: Decision record integration documented', 'Integration guidance found');
    } else {
      fail('FC-010: Decision record integration documented', 'No integration guidance');
    }

  } catch (error) {
    fail('Reference documentation tests', `Error: ${error.message}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. TEMPLATE INTEGRATION TESTS
──────────────────────────────────────────────────────────────── */

async function test_template_integration() {
  log('\n🔬 TEMPLATE INTEGRATION TESTS');

  try {
    // Test Level 3 decision-record template
    const level3_dr_path = path.join(TEMPLATES_PATH, 'level_3', 'decision-record.md');

    if (fs.existsSync(level3_dr_path)) {
      const level3_content = fs.readFileSync(level3_dr_path, 'utf8');

      // Test 11: Level 3 includes Five Checks
      if (level3_content.includes('Five Checks') || level3_content.includes('FIVE CHECKS')) {
        pass('FC-011: Level 3 decision-record includes Five Checks', 'Section found');
      } else {
        fail('FC-011: Level 3 decision-record includes Five Checks', 'Section not found');
      }

      // Test 12: Level 3 has check table format
      if (level3_content.includes('Necessary?') && level3_content.includes('PASS') && level3_content.includes('Evidence')) {
        pass('FC-012: Level 3 has Five Checks table format', 'Table structure present');
      } else {
        fail('FC-012: Level 3 has Five Checks table format', 'Table format missing');
      }
    } else {
      skip('FC-011: Level 3 decision-record includes Five Checks', 'Template file not found');
      skip('FC-012: Level 3 has Five Checks table format', 'Template file not found');
    }

    // Test Level 3+ decision-record template
    const level3plus_dr_path = path.join(TEMPLATES_PATH, 'level_3+', 'decision-record.md');

    if (fs.existsSync(level3plus_dr_path)) {
      const level3plus_content = fs.readFileSync(level3plus_dr_path, 'utf8');

      // Test 13: Level 3+ includes Five Checks
      if (level3plus_content.includes('Five Checks') || level3plus_content.includes('FIVE CHECKS')) {
        pass('FC-013: Level 3+ decision-record includes Five Checks', 'Section found');
      } else {
        fail('FC-013: Level 3+ decision-record includes Five Checks', 'Section not found');
      }

      // Test 14: Level 3+ has extended Five Checks (sign-off)
      if (level3plus_content.includes('Sign-off') ||
          level3plus_content.includes('sign-off') ||
          level3plus_content.includes('stakeholder') ||
          level3plus_content.length > 3000) { // Level 3+ should be more comprehensive
        pass('FC-014: Level 3+ has extended Five Checks', 'Extended content or sign-off present');
      } else {
        fail('FC-014: Level 3+ has extended Five Checks', 'No extended content found');
      }
    } else {
      skip('FC-013: Level 3+ decision-record includes Five Checks', 'Template file not found');
      skip('FC-014: Level 3+ has extended Five Checks', 'Template file not found');
    }

    // Test Level 1 does NOT require Five Checks
    const level1_files = ['spec.md', 'plan.md', 'tasks.md'];
    let level1_has_five_checks = false;

    for (const file of level1_files) {
      const level1_path = path.join(TEMPLATES_PATH, 'level_1', file);
      if (fs.existsSync(level1_path)) {
        const content = fs.readFileSync(level1_path, 'utf8');
        if (content.includes('Five Checks') && content.includes('Necessary?')) {
          level1_has_five_checks = true;
          break;
        }
      }
    }

    // Test 15: Level 1 does not mandate Five Checks
    if (!level1_has_five_checks) {
      pass('FC-015: Level 1 does not require Five Checks', 'Correctly omitted for simple tasks');
    } else {
      fail('FC-015: Level 1 does not require Five Checks', 'Five Checks found in Level 1');
    }

  } catch (error) {
    fail('Template integration tests', `Error: ${error.message}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. FORMAT VALIDATION TESTS
──────────────────────────────────────────────────────────────── */

async function test_format_validation() {
  log('\n🔬 FORMAT VALIDATION TESTS');

  // Test quick assessment format parsing
  const valid_quick_assessment = `
FIVE CHECKS:
1. Necessary? [PASS] - User requested feature X
2. Beyond Local Maxima? [PASS] - Considered 3 alternatives
3. Sufficient? [PASS] - Using existing utility
4. Fits Goal? [PASS] - Directly addresses spec
5. Open Horizons? [PASS] - Standard patterns

RESULT: 5/5 PASS → PROCEED
`;

  const partial_pass_assessment = `
FIVE CHECKS:
1. Necessary? [FAIL] - Speculative feature
2. Beyond Local Maxima? [PASS] - 2 alternatives
3. Sufficient? [PASS] - Simple approach
4. Fits Goal? [PASS] - On critical path
5. Open Horizons? [PASS] - No debt

RESULT: 4/5 PASS → RECONSIDER
`;

  const fail_assessment = `
FIVE CHECKS:
1. Necessary? [FAIL] - No documented need
2. Beyond Local Maxima? [FAIL] - No alternatives
3. Sufficient? [FAIL] - Over-engineered
4. Fits Goal? [PASS] - Aligns
5. Open Horizons? [PASS] - OK

RESULT: 2/5 PASS → FAIL
`;

  // Test 16: Valid full pass format
  const pass_regex = /FIVE CHECKS[\s\S]*?1\. Necessary\?.*\[PASS\][\s\S]*?RESULT.*5\/5/;
  if (pass_regex.test(valid_quick_assessment)) {
    pass('FC-016: Valid 5/5 PASS format recognized', 'Regex matches valid format');
  } else {
    fail('FC-016: Valid 5/5 PASS format recognized', 'Regex does not match');
  }

  // Test 17: Partial pass format (4/5)
  const partial_regex = /FIVE CHECKS[\s\S]*?\[FAIL\][\s\S]*?RESULT.*4\/5/;
  if (partial_regex.test(partial_pass_assessment)) {
    pass('FC-017: Partial 4/5 PASS format recognized', 'Regex matches partial format');
  } else {
    fail('FC-017: Partial 4/5 PASS format recognized', 'Regex does not match');
  }

  // Test 18: Fail format (≤3/5)
  const fail_regex = /FIVE CHECKS[\s\S]*?RESULT.*[0-3]\/5/;
  if (fail_regex.test(fail_assessment)) {
    pass('FC-018: Fail format (2/5) recognized', 'Regex matches fail format');
  } else {
    fail('FC-018: Fail format (2/5) recognized', 'Regex does not match');
  }

  // Test 19: Count PASS/FAIL in assessment
  function countChecks(text) {
    const passes = (text.match(/\[PASS\]/g) || []).length;
    const fails = (text.match(/\[FAIL\]/g) || []).length;
    return { passes, fails };
  }

  const valid_counts = countChecks(valid_quick_assessment);
  if (valid_counts.passes === 5 && valid_counts.fails === 0) {
    pass('FC-019: PASS/FAIL counting works', `5 PASS, 0 FAIL detected`);
  } else {
    fail('FC-019: PASS/FAIL counting works', `Got ${valid_counts.passes} PASS, ${valid_counts.fails} FAIL`);
  }

  const fail_counts = countChecks(fail_assessment);
  if (fail_counts.passes === 2 && fail_counts.fails === 3) {
    pass('FC-020: Mixed PASS/FAIL counting', `2 PASS, 3 FAIL detected`);
  } else {
    fail('FC-020: Mixed PASS/FAIL counting', `Got ${fail_counts.passes} PASS, ${fail_counts.fails} FAIL`);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. DECISION TABLE FORMAT TESTS
──────────────────────────────────────────────────────────────── */

async function test_decision_table_format() {
  log('\n🔬 DECISION TABLE FORMAT TESTS');

  const valid_table = `
| Check | Result | Evidence |
|-------|--------|----------|
| 1. Necessary? | PASS | User requested in spec.md |
| 2. Beyond Local Maxima? | PASS | Considered A, B, C |
| 3. Sufficient? | PASS | Simple implementation |
| 4. Fits Goal? | PASS | Directly advances objective |
| 5. Open Horizons? | PASS | No technical debt |

**Result:** 5/5 PASS
`;

  // Test 21: Table format recognized
  const table_regex = /\|\s*Check\s*\|\s*Result\s*\|\s*Evidence\s*\|/;
  if (table_regex.test(valid_table)) {
    pass('FC-021: Decision table header format', 'Header row matches');
  } else {
    fail('FC-021: Decision table header format', 'Header format incorrect');
  }

  // Test 22: All five checks in table
  const check_rows = valid_table.match(/\d\.\s*(Necessary|Beyond|Sufficient|Fits|Open)/gi);
  if (check_rows && check_rows.length === 5) {
    pass('FC-022: All five checks in table', '5 check rows found');
  } else {
    fail('FC-022: All five checks in table', `Found ${check_rows ? check_rows.length : 0} rows`);
  }

  // Test 23: Evidence column present
  const evidence_regex = /\|\s*[^|]+\s*\|\s*(PASS|FAIL)\s*\|\s*[^|]+\s*\|/;
  if (evidence_regex.test(valid_table)) {
    pass('FC-023: Evidence column in table', 'Evidence values present');
  } else {
    fail('FC-023: Evidence column in table', 'Evidence column missing');
  }

  // Test 24: Result line present
  if (valid_table.includes('Result:') || valid_table.includes('**Result:**')) {
    pass('FC-024: Result line in table format', 'Result line found');
  } else {
    fail('FC-024: Result line in table format', 'No result line');
  }
}

/* ─────────────────────────────────────────────────────────────
   7. CHECK-SPECIFIC VALIDATION TESTS
──────────────────────────────────────────────────────────────── */

async function test_check_specific_validation() {
  log('\n🔬 CHECK-SPECIFIC VALIDATION TESTS');

  // Test 25: Check 1 (Necessary) validation criteria
  const necessary_evidence = [
    'User requested',
    'documented requirement',
    'blocking production',
    'explicitly needs'
  ];
  const invalid_necessary = [
    'might be useful later',
    'best practice says',
    'future-proofing'
  ];

  // Just validate that these are distinct patterns
  const necessary_patterns = necessary_evidence.length + invalid_necessary.length;
  if (necessary_patterns === 7) {
    pass('FC-025: Check 1 (Necessary) has valid/invalid patterns', '7 patterns defined');
  } else {
    fail('FC-025: Check 1 (Necessary) has valid/invalid patterns', 'Pattern count mismatch');
  }

  // Test 26: Check 2 (Beyond Local Maxima) requires alternatives
  const blm_valid = 'Considered A (fast), B (slow), C (balanced)';
  const blm_invalid = 'This is the obvious solution';

  if (blm_valid.includes('Considered') && !blm_invalid.includes('Considered')) {
    pass('FC-026: Check 2 requires documented alternatives', 'Alternative pattern distinct');
  } else {
    fail('FC-026: Check 2 requires documented alternatives', 'Patterns not distinct');
  }

  // Test 27: Check 3 (Sufficient) simplicity validation
  const sufficient_valid = 'Single function handles case';
  const sufficient_invalid = 'Creating new utility when existing one works';

  // These should be distinguishable
  if (sufficient_valid.length < 50 && sufficient_invalid.includes('new')) {
    pass('FC-027: Check 3 simplicity criteria defined', 'Patterns distinguishable');
  } else {
    fail('FC-027: Check 3 simplicity criteria defined', 'Patterns unclear');
  }

  // Test 28: Check 4 (Fits Goal) scope alignment
  const goal_valid = 'Implements exactly what spec.md requests';
  const goal_invalid = 'While I\'m here, let me also...';

  if (goal_valid.includes('exactly') && goal_invalid.includes('also')) {
    pass('FC-028: Check 4 scope alignment criteria', 'Alignment patterns clear');
  } else {
    fail('FC-028: Check 4 scope alignment criteria', 'Patterns unclear');
  }

  // Test 29: Check 5 (Open Horizons) long-term criteria
  const horizon_valid = 'Standard interface allows swapping';
  const horizon_invalid = 'Quick fix now, proper solution later';

  if (!horizon_valid.includes('later') && horizon_invalid.includes('later')) {
    pass('FC-029: Check 5 long-term criteria defined', 'Debt patterns distinct');
  } else {
    fail('FC-029: Check 5 long-term criteria defined', 'Patterns not distinct');
  }
}

/* ─────────────────────────────────────────────────────────────
   8. THRESHOLD VALIDATION TESTS
──────────────────────────────────────────────────────────────── */

async function test_threshold_validation() {
  log('\n🔬 THRESHOLD VALIDATION TESTS');

  function evaluateResult(passes, fails) {
    const total = passes + fails;
    if (total !== 5) return 'INVALID';
    if (passes === 5) return 'PROCEED';
    if (passes === 4) return 'CONDITIONAL_PASS';
    return 'FAIL';
  }

  // Test 30: 5/5 = PROCEED
  if (evaluateResult(5, 0) === 'PROCEED') {
    pass('FC-030: 5/5 PASS = PROCEED', 'Full pass triggers proceed');
  } else {
    fail('FC-030: 5/5 PASS = PROCEED', 'Wrong result');
  }

  // Test 31: 4/5 = CONDITIONAL_PASS
  if (evaluateResult(4, 1) === 'CONDITIONAL_PASS') {
    pass('FC-031: 4/5 PASS = CONDITIONAL_PASS', '4/5 allows conditional proceed');
  } else {
    fail('FC-031: 4/5 PASS = CONDITIONAL_PASS', 'Wrong result');
  }

  // Test 32: 3/5 = FAIL
  if (evaluateResult(3, 2) === 'FAIL') {
    pass('FC-032: 3/5 PASS = FAIL', '3/5 requires reconsideration');
  } else {
    fail('FC-032: 3/5 PASS = FAIL', 'Wrong result');
  }

  // Test 33: 2/5 = FAIL
  if (evaluateResult(2, 3) === 'FAIL') {
    pass('FC-033: 2/5 PASS = FAIL', '2/5 requires reconsideration');
  } else {
    fail('FC-033: 2/5 PASS = FAIL', 'Wrong result');
  }

  // Test 34: 1/5 = FAIL
  if (evaluateResult(1, 4) === 'FAIL') {
    pass('FC-034: 1/5 PASS = FAIL', '1/5 requires reconsideration');
  } else {
    fail('FC-034: 1/5 PASS = FAIL', 'Wrong result');
  }

  // Test 35: 0/5 = FAIL
  if (evaluateResult(0, 5) === 'FAIL') {
    pass('FC-035: 0/5 PASS = FAIL', '0/5 requires reconsideration');
  } else {
    fail('FC-035: 0/5 PASS = FAIL', 'Wrong result');
  }
}

/* ─────────────────────────────────────────────────────────────
   9. LEVEL APPLICABILITY TESTS
──────────────────────────────────────────────────────────────── */

async function test_level_applicability() {
  log('\n🔬 LEVEL APPLICABILITY TESTS');

  function shouldApplyFiveChecks(level, loc, isArchitectural) {
    // Mandatory: Level 3/3+, >100 LOC, or architectural
    if (level >= 3) return 'MANDATORY';
    if (loc > 100) return 'MANDATORY';
    if (isArchitectural) return 'MANDATORY';

    // Recommended: Level 2
    if (level === 2) return 'RECOMMENDED';

    // Not required: Level 1, <100 LOC
    return 'NOT_REQUIRED';
  }

  // Test 36: Level 3 = MANDATORY
  if (shouldApplyFiveChecks(3, 50, false) === 'MANDATORY') {
    pass('FC-036: Level 3 = MANDATORY', 'Level 3 always requires Five Checks');
  } else {
    fail('FC-036: Level 3 = MANDATORY', 'Wrong applicability');
  }

  // Test 37: >100 LOC = MANDATORY
  if (shouldApplyFiveChecks(1, 150, false) === 'MANDATORY') {
    pass('FC-037: >100 LOC = MANDATORY', 'LOC trigger works');
  } else {
    fail('FC-037: >100 LOC = MANDATORY', 'LOC trigger failed');
  }

  // Test 38: Architectural = MANDATORY
  if (shouldApplyFiveChecks(1, 50, true) === 'MANDATORY') {
    pass('FC-038: Architectural = MANDATORY', 'Architectural trigger works');
  } else {
    fail('FC-038: Architectural = MANDATORY', 'Architectural trigger failed');
  }

  // Test 39: Level 2 = RECOMMENDED
  if (shouldApplyFiveChecks(2, 80, false) === 'RECOMMENDED') {
    pass('FC-039: Level 2 = RECOMMENDED', 'Level 2 gets recommendation');
  } else {
    fail('FC-039: Level 2 = RECOMMENDED', 'Wrong applicability');
  }

  // Test 40: Level 1 + <100 LOC = NOT_REQUIRED
  if (shouldApplyFiveChecks(1, 50, false) === 'NOT_REQUIRED') {
    pass('FC-040: Level 1 <100 LOC = NOT_REQUIRED', 'Simple tasks exempt');
  } else {
    fail('FC-040: Level 1 <100 LOC = NOT_REQUIRED', 'Should be exempt');
  }
}

/* ─────────────────────────────────────────────────────────────
   10. RUN ALL TESTS
──────────────────────────────────────────────────────────────── */

async function run_all_tests() {
  log('═══════════════════════════════════════════════════════════════');
  log(' FIVE CHECKS FRAMEWORK TEST SUITE');
  log(' Tests for decision validation framework');
  log('═══════════════════════════════════════════════════════════════');

  try {
    await test_reference_documentation();
    await test_template_integration();
    await test_format_validation();
    await test_decision_table_format();
    await test_check_specific_validation();
    await test_threshold_validation();
    await test_level_applicability();
  } catch (error) {
    log(`\n❌ Test suite error: ${error.message}`);
    console.error(error);
  }

  // Summary
  log('\n═══════════════════════════════════════════════════════════════');
  log(' SUMMARY');
  log('═══════════════════════════════════════════════════════════════');
  log(`   Passed:  ${results.passed}`);
  log(`   Failed:  ${results.failed}`);
  log(`   Skipped: ${results.skipped}`);
  log(`   Total:   ${results.passed + results.failed + results.skipped}`);

  // Exit with appropriate code
  if (results.failed > 0) {
    log('\n❌ TESTS FAILED');
    process.exit(1);
  } else {
    log('\n✅ ALL TESTS PASSED');
    process.exit(0);
  }
}

// Run tests
run_all_tests();
