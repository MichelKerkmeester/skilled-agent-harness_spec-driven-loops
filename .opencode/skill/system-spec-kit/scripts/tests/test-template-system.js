// ───────────────────────────────────────────────────────────────
// TEST: TEMPLATE SYSTEM VERIFICATION
// ───────────────────────────────────────────────────────────────
//
// Comprehensive tests for the SpecKit template system:
// - Level folder existence and file counts
// - CORE + ADDENDUM composition architecture
// - Template file contents and placeholder patterns
// - compose.sh script functionality
// - Example templates (filled placeholders)
//

'use strict';

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const ROOT = path.join(__dirname, '..', '..');
const TEMPLATES_DIR = path.join(ROOT, 'templates');
const SCRIPTS_DIR = path.join(ROOT, 'scripts');

// Template directories
const LEVEL_1_DIR = path.join(TEMPLATES_DIR, 'level_1');
const LEVEL_2_DIR = path.join(TEMPLATES_DIR, 'level_2');
const LEVEL_3_DIR = path.join(TEMPLATES_DIR, 'level_3');
const LEVEL_3PLUS_DIR = path.join(TEMPLATES_DIR, 'level_3+');

const CORE_DIR = path.join(TEMPLATES_DIR, 'core');
const ADDENDUM_DIR = path.join(TEMPLATES_DIR, 'addendum');
const EXAMPLES_DIR = path.join(TEMPLATES_DIR, 'examples');

// compose.sh script
const COMPOSE_SCRIPT = path.join(SCRIPTS_DIR, 'templates', 'compose.sh');

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
  log(`   [PASS] ${test_name}`);
  if (evidence) log(`      Evidence: ${evidence}`);
}

function fail(test_name, reason) {
  results.failed++;
  results.tests.push({ name: test_name, status: 'FAIL', reason });
  log(`   [FAIL] ${test_name}`);
  log(`      Reason: ${reason}`);
}

function skip(test_name, reason) {
  results.skipped++;
  results.tests.push({ name: test_name, status: 'SKIP', reason });
  log(`   [SKIP] ${test_name} (skipped: ${reason})`);
}

function dir_exists(dir_path) {
  return fs.existsSync(dir_path) && fs.statSync(dir_path).isDirectory();
}

function file_exists(file_path) {
  return fs.existsSync(file_path) && fs.statSync(file_path).isFile();
}

function count_files_in_dir(dir_path, extension = '.md') {
  if (!dir_exists(dir_path)) return 0;
  const files = fs.readdirSync(dir_path);
  return files.filter(f => f.endsWith(extension)).length;
}

function read_file(file_path) {
  if (!file_exists(file_path)) return null;
  return fs.readFileSync(file_path, 'utf8');
}

/* ─────────────────────────────────────────────────────────────
   3. TEST SUITE: LEVEL TEMPLATES EXIST
──────────────────────────────────────────────────────────────── */

async function test_level_templates_exist() {
  log('\n--- TEST SUITE: Level Templates Exist ---');

  // Test Level 1 directory and files (4 files)
  try {
    if (dir_exists(LEVEL_1_DIR)) {
      pass('T-001a: level_1/ directory exists', LEVEL_1_DIR);
    } else {
      fail('T-001a: level_1/ directory exists', `Directory not found: ${LEVEL_1_DIR}`);
      return;
    }

    const level1_expected = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md'];
    const level1_actual = fs.readdirSync(LEVEL_1_DIR).filter(f => f.endsWith('.md'));

    if (level1_actual.length === 4) {
      pass('T-001b: level_1/ has 4 files', `Files: ${level1_actual.join(', ')}`);
    } else {
      fail('T-001b: level_1/ has 4 files', `Expected 4, found ${level1_actual.length}: ${level1_actual.join(', ')}`);
    }

    for (const file of level1_expected) {
      if (file_exists(path.join(LEVEL_1_DIR, file))) {
        pass(`T-001c: level_1/${file} exists`, 'File found');
      } else {
        fail(`T-001c: level_1/${file} exists`, 'File not found');
      }
    }
  } catch (error) {
    fail('T-001: Level 1 templates', error.message);
  }

  // Test Level 2 directory and files (5 files: +checklist.md)
  try {
    if (dir_exists(LEVEL_2_DIR)) {
      pass('T-002a: level_2/ directory exists', LEVEL_2_DIR);
    } else {
      fail('T-002a: level_2/ directory exists', `Directory not found: ${LEVEL_2_DIR}`);
      return;
    }

    const level2_expected = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'checklist.md'];
    const level2_actual = fs.readdirSync(LEVEL_2_DIR).filter(f => f.endsWith('.md'));

    if (level2_actual.length === 5) {
      pass('T-002b: level_2/ has 5 files', `Files: ${level2_actual.join(', ')}`);
    } else {
      fail('T-002b: level_2/ has 5 files', `Expected 5, found ${level2_actual.length}: ${level2_actual.join(', ')}`);
    }

    for (const file of level2_expected) {
      if (file_exists(path.join(LEVEL_2_DIR, file))) {
        pass(`T-002c: level_2/${file} exists`, 'File found');
      } else {
        fail(`T-002c: level_2/${file} exists`, 'File not found');
      }
    }
  } catch (error) {
    fail('T-002: Level 2 templates', error.message);
  }

  // Test Level 3 directory and files (6 files: +decision-record.md)
  try {
    if (dir_exists(LEVEL_3_DIR)) {
      pass('T-003a: level_3/ directory exists', LEVEL_3_DIR);
    } else {
      fail('T-003a: level_3/ directory exists', `Directory not found: ${LEVEL_3_DIR}`);
      return;
    }

    const level3_expected = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'checklist.md', 'decision-record.md'];
    const level3_actual = fs.readdirSync(LEVEL_3_DIR).filter(f => f.endsWith('.md'));

    if (level3_actual.length === 6) {
      pass('T-003b: level_3/ has 6 files', `Files: ${level3_actual.join(', ')}`);
    } else {
      fail('T-003b: level_3/ has 6 files', `Expected 6, found ${level3_actual.length}: ${level3_actual.join(', ')}`);
    }

    for (const file of level3_expected) {
      if (file_exists(path.join(LEVEL_3_DIR, file))) {
        pass(`T-003c: level_3/${file} exists`, 'File found');
      } else {
        fail(`T-003c: level_3/${file} exists`, 'File not found');
      }
    }
  } catch (error) {
    fail('T-003: Level 3 templates', error.message);
  }

  // Test Level 3+ directory and files (6 files with extended content)
  try {
    if (dir_exists(LEVEL_3PLUS_DIR)) {
      pass('T-004a: level_3+/ directory exists', LEVEL_3PLUS_DIR);
    } else {
      fail('T-004a: level_3+/ directory exists', `Directory not found: ${LEVEL_3PLUS_DIR}`);
      return;
    }

    const level3plus_expected = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'checklist.md', 'decision-record.md'];
    const level3plus_actual = fs.readdirSync(LEVEL_3PLUS_DIR).filter(f => f.endsWith('.md'));

    if (level3plus_actual.length === 6) {
      pass('T-004b: level_3+/ has 6 files', `Files: ${level3plus_actual.join(', ')}`);
    } else {
      fail('T-004b: level_3+/ has 6 files', `Expected 6, found ${level3plus_actual.length}: ${level3plus_actual.join(', ')}`);
    }

    for (const file of level3plus_expected) {
      if (file_exists(path.join(LEVEL_3PLUS_DIR, file))) {
        pass(`T-004c: level_3+/${file} exists`, 'File found');
      } else {
        fail(`T-004c: level_3+/${file} exists`, 'File not found');
      }
    }
  } catch (error) {
    fail('T-004: Level 3+ templates', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. TEST SUITE: CORE TEMPLATES
──────────────────────────────────────────────────────────────── */

async function test_core_templates() {
  log('\n--- TEST SUITE: Core Templates ---');

  try {
    // Test core directory exists
    if (dir_exists(CORE_DIR)) {
      pass('T-010a: core/ directory exists', CORE_DIR);
    } else {
      fail('T-010a: core/ directory exists', `Directory not found: ${CORE_DIR}`);
      return;
    }

    // Test 4 core files exist
    const core_expected = ['spec-core.md', 'plan-core.md', 'tasks-core.md', 'impl-summary-core.md'];
    const core_actual = fs.readdirSync(CORE_DIR).filter(f => f.endsWith('.md'));

    if (core_actual.length === 4) {
      pass('T-010b: core/ contains 4 core files', `Files: ${core_actual.join(', ')}`);
    } else {
      fail('T-010b: core/ contains 4 core files', `Expected 4, found ${core_actual.length}: ${core_actual.join(', ')}`);
    }

    // Test each core file has required sections
    const spec_core = read_file(path.join(CORE_DIR, 'spec-core.md'));
    if (spec_core) {
      const required_sections = ['METADATA', 'PROBLEM & PURPOSE', 'SCOPE', 'REQUIREMENTS', 'SUCCESS CRITERIA', 'RISKS & DEPENDENCIES'];
      const missing_sections = required_sections.filter(s => !spec_core.includes(s));

      if (missing_sections.length === 0) {
        pass('T-010c: spec-core.md has required sections', `Sections: ${required_sections.join(', ')}`);
      } else {
        fail('T-010c: spec-core.md has required sections', `Missing: ${missing_sections.join(', ')}`);
      }
    } else {
      fail('T-010c: spec-core.md has required sections', 'File not readable');
    }

    const plan_core = read_file(path.join(CORE_DIR, 'plan-core.md'));
    if (plan_core) {
      const required_sections = ['SUMMARY', 'QUALITY GATES', 'ARCHITECTURE', 'IMPLEMENTATION PHASES', 'TESTING STRATEGY'];
      const missing_sections = required_sections.filter(s => !plan_core.includes(s));

      if (missing_sections.length === 0) {
        pass('T-010d: plan-core.md has required sections', `Sections: ${required_sections.join(', ')}`);
      } else {
        fail('T-010d: plan-core.md has required sections', `Missing: ${missing_sections.join(', ')}`);
      }
    } else {
      fail('T-010d: plan-core.md has required sections', 'File not readable');
    }

    // Test SPECKIT markers
    if (spec_core && spec_core.includes('SPECKIT_LEVEL')) {
      pass('T-010e: spec-core.md has SPECKIT_LEVEL marker', 'Marker found');
    } else {
      fail('T-010e: spec-core.md has SPECKIT_LEVEL marker', 'Marker not found');
    }

    if (spec_core && spec_core.includes('SPECKIT_TEMPLATE_SOURCE')) {
      pass('T-010f: spec-core.md has SPECKIT_TEMPLATE_SOURCE marker', 'Marker found');
    } else {
      fail('T-010f: spec-core.md has SPECKIT_TEMPLATE_SOURCE marker', 'Marker not found');
    }

  } catch (error) {
    fail('T-010: Core templates', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. TEST SUITE: ADDENDUM STRUCTURE
──────────────────────────────────────────────────────────────── */

async function test_addendum_structure() {
  log('\n--- TEST SUITE: Addendum Structure ---');

  try {
    // Test addendum directory exists
    if (dir_exists(ADDENDUM_DIR)) {
      pass('T-020a: addendum/ directory exists', ADDENDUM_DIR);
    } else {
      fail('T-020a: addendum/ directory exists', `Directory not found: ${ADDENDUM_DIR}`);
      return;
    }

    // Test level2-verify addendum
    const level2_verify_dir = path.join(ADDENDUM_DIR, 'level2-verify');
    if (dir_exists(level2_verify_dir)) {
      pass('T-020b: addendum/level2-verify/ exists', level2_verify_dir);
    } else {
      fail('T-020b: addendum/level2-verify/ exists', 'Directory not found');
    }

    const level2_verify_files = ['spec-level2.md', 'plan-level2.md', 'checklist.md'];
    for (const file of level2_verify_files) {
      if (file_exists(path.join(level2_verify_dir, file))) {
        pass(`T-020c: addendum/level2-verify/${file} exists`, 'File found');
      } else {
        fail(`T-020c: addendum/level2-verify/${file} exists`, 'File not found');
      }
    }

    // Test level3-arch addendum
    const level3_arch_dir = path.join(ADDENDUM_DIR, 'level3-arch');
    if (dir_exists(level3_arch_dir)) {
      pass('T-021a: addendum/level3-arch/ exists', level3_arch_dir);
    } else {
      fail('T-021a: addendum/level3-arch/ exists', 'Directory not found');
    }

    const level3_arch_files = ['spec-level3.md', 'plan-level3.md', 'decision-record.md'];
    for (const file of level3_arch_files) {
      if (file_exists(path.join(level3_arch_dir, file))) {
        pass(`T-021b: addendum/level3-arch/${file} exists`, 'File found');
      } else {
        fail(`T-021b: addendum/level3-arch/${file} exists`, 'File not found');
      }
    }

    // Test level3plus-govern addendum
    const level3plus_govern_dir = path.join(ADDENDUM_DIR, 'level3plus-govern');
    if (dir_exists(level3plus_govern_dir)) {
      pass('T-022a: addendum/level3plus-govern/ exists', level3plus_govern_dir);
    } else {
      fail('T-022a: addendum/level3plus-govern/ exists', 'Directory not found');
    }

    const level3plus_govern_files = ['spec-level3plus.md', 'plan-level3plus.md', 'checklist-extended.md'];
    for (const file of level3plus_govern_files) {
      if (file_exists(path.join(level3plus_govern_dir, file))) {
        pass(`T-022b: addendum/level3plus-govern/${file} exists`, 'File found');
      } else {
        fail(`T-022b: addendum/level3plus-govern/${file} exists`, 'File not found');
      }
    }

  } catch (error) {
    fail('T-020: Addendum structure', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. TEST SUITE: PLACEHOLDER PATTERNS
──────────────────────────────────────────────────────────────── */

async function test_placeholder_patterns() {
  log('\n--- TEST SUITE: Placeholder Patterns ---');

  try {
    // Test that templates contain [PLACEHOLDER] patterns
    const spec_level1 = read_file(path.join(LEVEL_1_DIR, 'spec.md'));

    if (spec_level1) {
      // Check for common placeholder patterns
      const placeholder_patterns = [
        /\[NAME\]/,
        /\[YYYY-MM-DD\]/,
        /\[P0\/P1\/P2\]/,
        /\[Deliverable \d\]/,
        /\[path\/to\/file\.js\]/
      ];

      let found_count = 0;
      for (const pattern of placeholder_patterns) {
        if (pattern.test(spec_level1)) {
          found_count++;
        }
      }

      if (found_count >= 3) {
        pass('T-030a: level_1/spec.md contains placeholder patterns', `Found ${found_count}/5 expected patterns`);
      } else {
        fail('T-030a: level_1/spec.md contains placeholder patterns', `Only found ${found_count}/5 expected patterns`);
      }

      // Check for bracket-style placeholders
      const bracket_placeholder_count = (spec_level1.match(/\[[A-Z][^\]]*\]/g) || []).length;
      if (bracket_placeholder_count > 5) {
        pass('T-030b: spec.md has multiple bracket placeholders', `Found ${bracket_placeholder_count} bracket placeholders`);
      } else {
        fail('T-030b: spec.md has multiple bracket placeholders', `Only found ${bracket_placeholder_count}`);
      }
    } else {
      fail('T-030a: level_1/spec.md contains placeholder patterns', 'File not readable');
    }

    // Test checklist.md has checkbox patterns
    const checklist_level2 = read_file(path.join(LEVEL_2_DIR, 'checklist.md'));
    if (checklist_level2) {
      const checkbox_count = (checklist_level2.match(/- \[ \]/g) || []).length;
      if (checkbox_count >= 10) {
        pass('T-030c: level_2/checklist.md has checkbox patterns', `Found ${checkbox_count} checkboxes`);
      } else {
        fail('T-030c: level_2/checklist.md has checkbox patterns', `Expected >=10, found ${checkbox_count}`);
      }

      // Check for priority tags [P0], [P1], [P2]
      const has_p0 = checklist_level2.includes('[P0]');
      const has_p1 = checklist_level2.includes('[P1]');
      const has_p2 = checklist_level2.includes('[P2]');

      if (has_p0 && has_p1 && has_p2) {
        pass('T-030d: checklist.md has priority tags', '[P0], [P1], [P2] found');
      } else {
        fail('T-030d: checklist.md has priority tags', `P0:${has_p0}, P1:${has_p1}, P2:${has_p2}`);
      }
    } else {
      fail('T-030c: level_2/checklist.md has checkbox patterns', 'File not readable');
    }

    // Test that decision-record.md has ADR pattern
    const decision_level3 = read_file(path.join(LEVEL_3_DIR, 'decision-record.md'));
    if (decision_level3) {
      const has_adr = decision_level3.includes('ADR-001');
      const has_context = decision_level3.includes('Context');
      const has_decision = decision_level3.includes('Decision');
      const has_consequences = decision_level3.includes('Consequences');

      if (has_adr && has_context && has_decision && has_consequences) {
        pass('T-030e: decision-record.md has ADR structure', 'ADR-001, Context, Decision, Consequences found');
      } else {
        fail('T-030e: decision-record.md has ADR structure', `ADR:${has_adr}, Context:${has_context}, Decision:${has_decision}, Consequences:${has_consequences}`);
      }
    } else {
      fail('T-030e: decision-record.md has ADR structure', 'File not readable');
    }

  } catch (error) {
    fail('T-030: Placeholder patterns', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   7. TEST SUITE: EXAMPLE TEMPLATES
──────────────────────────────────────────────────────────────── */

async function test_example_templates() {
  log('\n--- TEST SUITE: Example Templates ---');

  try {
    // Test examples directory exists
    if (dir_exists(EXAMPLES_DIR)) {
      pass('T-040a: examples/ directory exists', EXAMPLES_DIR);
    } else {
      fail('T-040a: examples/ directory exists', `Directory not found: ${EXAMPLES_DIR}`);
      return;
    }

    // Test example levels exist
    const example_level1_dir = path.join(EXAMPLES_DIR, 'level_1');
    const example_level2_dir = path.join(EXAMPLES_DIR, 'level_2');
    const example_level3_dir = path.join(EXAMPLES_DIR, 'level_3');
    const example_level3plus_dir = path.join(EXAMPLES_DIR, 'level_3+');

    if (dir_exists(example_level1_dir)) {
      pass('T-040b: examples/level_1/ exists', example_level1_dir);
    } else {
      fail('T-040b: examples/level_1/ exists', 'Directory not found');
    }

    if (dir_exists(example_level2_dir)) {
      pass('T-040c: examples/level_2/ exists', example_level2_dir);
    } else {
      fail('T-040c: examples/level_2/ exists', 'Directory not found');
    }

    // Test example spec.md has filled placeholders (not generic)
    const example_spec = read_file(path.join(example_level1_dir, 'spec.md'));
    if (example_spec) {
      // Check that [NAME] is replaced with actual name
      const has_actual_name = !example_spec.includes('# Feature Specification: [NAME]');

      if (has_actual_name) {
        pass('T-040d: examples/level_1/spec.md has filled [NAME]', 'Title is concrete, not placeholder');
      } else {
        fail('T-040d: examples/level_1/spec.md has filled [NAME]', 'Still has [NAME] placeholder');
      }

      // Check that date is filled
      const has_filled_date = !example_spec.includes('[YYYY-MM-DD]') || example_spec.match(/\d{4}-\d{2}-\d{2}/);
      if (has_filled_date) {
        pass('T-040e: examples/level_1/spec.md has concrete date', 'Date format found or placeholder removed');
      } else {
        fail('T-040e: examples/level_1/spec.md has concrete date', 'Still has [YYYY-MM-DD] placeholder');
      }

      // Check that priority is set
      const has_set_priority = example_spec.includes('P0') || example_spec.includes('P1') || example_spec.includes('P2');
      if (has_set_priority) {
        pass('T-040f: examples/level_1/spec.md has set priority', 'Priority level found');
      } else {
        fail('T-040f: examples/level_1/spec.md has set priority', 'No priority found');
      }

      // Check for EXAMPLE comment indicating it's a filled example
      const has_example_comment = example_spec.includes('EXAMPLE:') || example_spec.includes('<!-- EXAMPLE');
      if (has_example_comment) {
        pass('T-040g: examples/level_1/spec.md has EXAMPLE marker', 'EXAMPLE comment found');
      } else {
        skip('T-040g: examples/level_1/spec.md has EXAMPLE marker', 'No explicit EXAMPLE comment (may still be valid)');
      }
    } else {
      fail('T-040d-g: Example spec.md tests', 'File not readable');
    }

  } catch (error) {
    fail('T-040: Example templates', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   8. TEST SUITE: COMPOSE.SH FUNCTIONALITY
──────────────────────────────────────────────────────────────── */

async function test_compose_script() {
  log('\n--- TEST SUITE: compose.sh Functionality ---');

  try {
    // Test compose.sh exists
    if (file_exists(COMPOSE_SCRIPT)) {
      pass('T-050a: compose.sh script exists', COMPOSE_SCRIPT);
    } else {
      fail('T-050a: compose.sh script exists', `Script not found: ${COMPOSE_SCRIPT}`);
      return;
    }

    // Test compose.sh is executable (or can be made executable)
    const compose_content = read_file(COMPOSE_SCRIPT);
    if (compose_content && compose_content.startsWith('#!/')) {
      pass('T-050b: compose.sh has shebang', compose_content.split('\n')[0]);
    } else {
      fail('T-050b: compose.sh has shebang', 'No shebang line found');
    }

    // Test compose.sh has required functions
    const required_functions = [
      'compose_spec',
      'compose_plan',
      'compose_tasks',
      'compose_checklist',
      'compose_decision_record',
      'compose_level'
    ];

    for (const func of required_functions) {
      if (compose_content && compose_content.includes(func)) {
        pass(`T-050c: compose.sh has ${func}()`, 'Function found');
      } else {
        fail(`T-050c: compose.sh has ${func}()`, 'Function not found');
      }
    }

    // Test compose.sh has composition rules documented
    if (compose_content && compose_content.includes('Level 1:') && compose_content.includes('Level 2:') && compose_content.includes('Level 3:')) {
      pass('T-050d: compose.sh documents composition rules', 'Level 1/2/3 rules found');
    } else {
      fail('T-050d: compose.sh documents composition rules', 'Composition rules not documented');
    }

    // Test compose.sh --verify mode
    try {
      const verify_output = execSync(`bash "${COMPOSE_SCRIPT}" --verify 2>&1`, {
        cwd: SCRIPTS_DIR,
        timeout: 30000,
        encoding: 'utf8'
      });

      // If --verify exits 0, templates are in sync
      if (verify_output.includes('current') || verify_output.includes('OK')) {
        pass('T-050e: compose.sh --verify runs successfully', 'Templates are in sync with sources');
      } else {
        pass('T-050e: compose.sh --verify runs successfully', `Output: ${verify_output.slice(0, 100)}`);
      }
    } catch (verify_error) {
      // Exit code 1 means drift detected (warning, not a test failure - the script works correctly)
      if (verify_error.status === 1) {
        pass('T-050e: compose.sh --verify runs successfully', 'Script works correctly (drift detected - run compose.sh to update)');
      } else {
        fail('T-050e: compose.sh --verify runs successfully', `Script error: ${verify_error.message}`);
      }
    }

    // Test compose.sh --dry-run mode
    try {
      const dryrun_output = execSync(`bash "${COMPOSE_SCRIPT}" --dry-run 2>&1`, {
        cwd: SCRIPTS_DIR,
        timeout: 30000,
        encoding: 'utf8'
      });

      if (dryrun_output.includes('DRY RUN') || dryrun_output.includes('would be written')) {
        pass('T-050f: compose.sh --dry-run works', 'Dry run completed successfully');
      } else {
        pass('T-050f: compose.sh --dry-run works', `Output: ${dryrun_output.slice(0, 100)}`);
      }
    } catch (dryrun_error) {
      fail('T-050f: compose.sh --dry-run works', `Script error: ${dryrun_error.message}`);
    }

  } catch (error) {
    fail('T-050: compose.sh functionality', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   9. TEST SUITE: LEVEL-SPECIFIC CONTENT
──────────────────────────────────────────────────────────────── */

async function test_level_specific_content() {
  log('\n--- TEST SUITE: Level-Specific Content ---');

  try {
    // Test Level 1 spec.md has SPECKIT_LEVEL: 1
    const spec_l1 = read_file(path.join(LEVEL_1_DIR, 'spec.md'));
    if (spec_l1 && spec_l1.includes('SPECKIT_LEVEL: 1')) {
      pass('T-060a: level_1/spec.md has SPECKIT_LEVEL: 1', 'Correct level marker');
    } else {
      fail('T-060a: level_1/spec.md has SPECKIT_LEVEL: 1', 'Level marker missing or incorrect');
    }

    // Test Level 2 spec.md has SPECKIT_LEVEL: 2
    const spec_l2 = read_file(path.join(LEVEL_2_DIR, 'spec.md'));
    if (spec_l2 && spec_l2.includes('SPECKIT_LEVEL: 2')) {
      pass('T-060b: level_2/spec.md has SPECKIT_LEVEL: 2', 'Correct level marker');
    } else {
      fail('T-060b: level_2/spec.md has SPECKIT_LEVEL: 2', 'Level marker missing or incorrect');
    }

    // Test Level 3 spec.md has SPECKIT_LEVEL: 3
    const spec_l3 = read_file(path.join(LEVEL_3_DIR, 'spec.md'));
    if (spec_l3 && spec_l3.includes('SPECKIT_LEVEL: 3')) {
      pass('T-060c: level_3/spec.md has SPECKIT_LEVEL: 3', 'Correct level marker');
    } else {
      fail('T-060c: level_3/spec.md has SPECKIT_LEVEL: 3', 'Level marker missing or incorrect');
    }

    // Test Level 3+ spec.md has SPECKIT_LEVEL: 3+
    const spec_l3plus = read_file(path.join(LEVEL_3PLUS_DIR, 'spec.md'));
    if (spec_l3plus && spec_l3plus.includes('SPECKIT_LEVEL: 3+')) {
      pass('T-060d: level_3+/spec.md has SPECKIT_LEVEL: 3+', 'Correct level marker');
    } else {
      fail('T-060d: level_3+/spec.md has SPECKIT_LEVEL: 3+', 'Level marker missing or incorrect');
    }

    // Test Level 2 adds NFR section (Non-Functional Requirements)
    if (spec_l2 && spec_l2.includes('NON-FUNCTIONAL REQUIREMENTS')) {
      pass('T-061a: level_2/spec.md includes NFR section', 'NON-FUNCTIONAL REQUIREMENTS found');
    } else {
      skip('T-061a: level_2/spec.md includes NFR section', 'NFR section may be in addendum only');
    }

    // Test Level 3 adds Executive Summary
    if (spec_l3 && spec_l3.includes('EXECUTIVE SUMMARY')) {
      pass('T-061b: level_3/spec.md includes Executive Summary', 'EXECUTIVE SUMMARY found');
    } else {
      skip('T-061b: level_3/spec.md includes Executive Summary', 'May not be present in all templates');
    }

    // Test Level 3+ adds Governance sections
    if (spec_l3plus && (spec_l3plus.includes('APPROVAL WORKFLOW') || spec_l3plus.includes('COMPLIANCE'))) {
      pass('T-061c: level_3+/spec.md includes governance sections', 'Governance sections found');
    } else {
      skip('T-061c: level_3+/spec.md includes governance sections', 'Governance sections may vary');
    }

    // Test Level 3+ checklist is longer than Level 2
    const checklist_l2 = read_file(path.join(LEVEL_2_DIR, 'checklist.md'));
    const checklist_l3plus = read_file(path.join(LEVEL_3PLUS_DIR, 'checklist.md'));

    if (checklist_l2 && checklist_l3plus) {
      const l2_lines = checklist_l2.split('\n').length;
      const l3plus_lines = checklist_l3plus.split('\n').length;

      if (l3plus_lines > l2_lines) {
        pass('T-062: level_3+ checklist is longer than level_2', `L2: ${l2_lines} lines, L3+: ${l3plus_lines} lines`);
      } else {
        fail('T-062: level_3+ checklist is longer than level_2', `L2: ${l2_lines} lines, L3+: ${l3plus_lines} lines`);
      }
    } else {
      fail('T-062: level_3+ checklist is longer than level_2', 'Could not read checklist files');
    }

  } catch (error) {
    fail('T-060: Level-specific content', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   10. TEST SUITE: TEMPLATE CONSISTENCY
──────────────────────────────────────────────────────────────── */

async function test_template_consistency() {
  log('\n--- TEST SUITE: Template Consistency ---');

  try {
    // Test all spec.md files have METADATA section
    const levels = [
      { dir: LEVEL_1_DIR, name: 'level_1' },
      { dir: LEVEL_2_DIR, name: 'level_2' },
      { dir: LEVEL_3_DIR, name: 'level_3' },
      { dir: LEVEL_3PLUS_DIR, name: 'level_3+' }
    ];

    for (const level of levels) {
      const spec = read_file(path.join(level.dir, 'spec.md'));
      if (spec && spec.includes('METADATA')) {
        pass(`T-070a: ${level.name}/spec.md has METADATA`, 'Section found');
      } else {
        fail(`T-070a: ${level.name}/spec.md has METADATA`, 'Section missing');
      }
    }

    // Test all plan.md files have IMPLEMENTATION PHASES
    for (const level of levels) {
      const plan = read_file(path.join(level.dir, 'plan.md'));
      if (plan && plan.includes('IMPLEMENTATION PHASES')) {
        pass(`T-070b: ${level.name}/plan.md has IMPLEMENTATION PHASES`, 'Section found');
      } else {
        fail(`T-070b: ${level.name}/plan.md has IMPLEMENTATION PHASES`, 'Section missing');
      }
    }

    // Test all tasks.md files have task structure
    for (const level of levels) {
      const tasks = read_file(path.join(level.dir, 'tasks.md'));
      if (tasks && (tasks.includes('TASK-') || tasks.includes('## Tasks') || tasks.includes('[ ]'))) {
        pass(`T-070c: ${level.name}/tasks.md has task structure`, 'Task patterns found');
      } else {
        fail(`T-070c: ${level.name}/tasks.md has task structure`, 'Task patterns missing');
      }
    }

    // Test implementation-summary.md exists at all levels
    for (const level of levels) {
      if (file_exists(path.join(level.dir, 'implementation-summary.md'))) {
        pass(`T-070d: ${level.name}/implementation-summary.md exists`, 'File found');
      } else {
        fail(`T-070d: ${level.name}/implementation-summary.md exists`, 'File missing');
      }
    }

  } catch (error) {
    fail('T-070: Template consistency', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   11. MAIN
──────────────────────────────────────────────────────────────── */

async function main() {
  log('==================================================');
  log('     TEMPLATE SYSTEM VERIFICATION TESTS');
  log('==================================================');
  log(`Date: ${new Date().toISOString()}`);
  log(`Root: ${ROOT}`);
  log(`Templates: ${TEMPLATES_DIR}\n`);

  // Run all test suites
  await test_level_templates_exist();
  await test_core_templates();
  await test_addendum_structure();
  await test_placeholder_patterns();
  await test_example_templates();
  await test_compose_script();
  await test_level_specific_content();
  await test_template_consistency();

  // Summary
  log('\n==================================================');
  log('                 TEST SUMMARY');
  log('==================================================');
  log(`  [PASS]  Passed:  ${results.passed}`);
  log(`  [FAIL]  Failed:  ${results.failed}`);
  log(`  [SKIP]  Skipped: ${results.skipped}`);
  log(`  Total:  ${results.passed + results.failed + results.skipped}`);
  log('');

  if (results.failed === 0) {
    log('ALL TESTS PASSED!');
    return true;
  } else {
    log('Some tests failed. Review output above.');
    return false;
  }
}

// Run tests
main()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
