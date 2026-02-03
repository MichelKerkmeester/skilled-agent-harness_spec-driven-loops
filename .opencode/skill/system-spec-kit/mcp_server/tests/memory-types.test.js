// ───────────────────────────────────────────────────────────────
// TEST: MEMORY TYPES (T068-T082)
// ───────────────────────────────────────────────────────────────

(() => {
  'use strict';

  const path = require('path');

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ──────────────────────────────────────────────────────────────── */

  const CONFIG_PATH = path.join(__dirname, '..', 'lib', 'config');

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

  let memoryTypes;
  let typeInference;

  function loadModules() {
    log('\n🔬 Loading Modules');

    try {
      memoryTypes = require(path.join(CONFIG_PATH, 'memory-types.js'));
      log('   ✅ memory-types.js loaded');
    } catch (error) {
      log(`   ❌ Failed to load memory-types.js: ${error.message}`);
      return false;
    }

    try {
      typeInference = require(path.join(CONFIG_PATH, 'type-inference.js'));
      log('   ✅ type-inference.js loaded');
    } catch (error) {
      log(`   ❌ Failed to load type-inference.js: ${error.message}`);
      return false;
    }

    return true;
  }

  /* ─────────────────────────────────────────────────────────────
     4. TEST SUITES
  ──────────────────────────────────────────────────────────────── */

  // 4.1 MEMORY_TYPES OBJECT STRUCTURE (T068)

  function test_memory_types_structure() {
    log('\n🔬 Memory Types Structure - T068');

    // T068: Test MEMORY_TYPES object contains 9 types
    const types = Object.keys(memoryTypes.MEMORY_TYPES);
    const expectedTypes = [
      'working',
      'episodic',
      'prospective',
      'implicit',
      'declarative',
      'procedural',
      'semantic',
      'autobiographical',
      'meta-cognitive',
    ];

    if (types.length === 9) {
      const hasAll = expectedTypes.every((t) => types.includes(t));
      if (hasAll) {
        pass('T068', 'MEMORY_TYPES contains 9 types', `Types: ${types.join(', ')}`);
      } else {
        const missing = expectedTypes.filter((t) => !types.includes(t));
        fail('T068', 'MEMORY_TYPES contains 9 types', `Missing types: ${missing.join(', ')}`);
      }
    } else {
      fail('T068', 'MEMORY_TYPES contains 9 types', `Expected 9, got ${types.length}: ${types.join(', ')}`);
    }
  }

  // 4.2 HALF-LIFE VALUES (T069-T077)

  function test_half_life_values() {
    log('\n🔬 Half-Life Values - T069-T077');

    const { MEMORY_TYPES, HALF_LIVES_DAYS } = memoryTypes;

    // T069: Working memory half-life = 1 day
    if (MEMORY_TYPES.working.halfLifeDays === 1) {
      pass('T069', 'Working memory half-life = 1 day', `Got: ${MEMORY_TYPES.working.halfLifeDays}`);
    } else {
      fail('T069', 'Working memory half-life = 1 day', `Expected 1, got: ${MEMORY_TYPES.working.halfLifeDays}`);
    }

    // T070: Episodic memory half-life = 7 days
    if (MEMORY_TYPES.episodic.halfLifeDays === 7) {
      pass('T070', 'Episodic memory half-life = 7 days', `Got: ${MEMORY_TYPES.episodic.halfLifeDays}`);
    } else {
      fail('T070', 'Episodic memory half-life = 7 days', `Expected 7, got: ${MEMORY_TYPES.episodic.halfLifeDays}`);
    }

    // T071: Prospective memory half-life = 14 days
    if (MEMORY_TYPES.prospective.halfLifeDays === 14) {
      pass('T071', 'Prospective memory half-life = 14 days', `Got: ${MEMORY_TYPES.prospective.halfLifeDays}`);
    } else {
      fail('T071', 'Prospective memory half-life = 14 days', `Expected 14, got: ${MEMORY_TYPES.prospective.halfLifeDays}`);
    }

    // T072: Implicit memory half-life = 30 days
    if (MEMORY_TYPES.implicit.halfLifeDays === 30) {
      pass('T072', 'Implicit memory half-life = 30 days', `Got: ${MEMORY_TYPES.implicit.halfLifeDays}`);
    } else {
      fail('T072', 'Implicit memory half-life = 30 days', `Expected 30, got: ${MEMORY_TYPES.implicit.halfLifeDays}`);
    }

    // T073: Declarative memory half-life = 60 days
    if (MEMORY_TYPES.declarative.halfLifeDays === 60) {
      pass('T073', 'Declarative memory half-life = 60 days', `Got: ${MEMORY_TYPES.declarative.halfLifeDays}`);
    } else {
      fail('T073', 'Declarative memory half-life = 60 days', `Expected 60, got: ${MEMORY_TYPES.declarative.halfLifeDays}`);
    }

    // T074: Procedural memory half-life = 90 days
    if (MEMORY_TYPES.procedural.halfLifeDays === 90) {
      pass('T074', 'Procedural memory half-life = 90 days', `Got: ${MEMORY_TYPES.procedural.halfLifeDays}`);
    } else {
      fail('T074', 'Procedural memory half-life = 90 days', `Expected 90, got: ${MEMORY_TYPES.procedural.halfLifeDays}`);
    }

    // T075: Semantic memory half-life = 180 days
    if (MEMORY_TYPES.semantic.halfLifeDays === 180) {
      pass('T075', 'Semantic memory half-life = 180 days', `Got: ${MEMORY_TYPES.semantic.halfLifeDays}`);
    } else {
      fail('T075', 'Semantic memory half-life = 180 days', `Expected 180, got: ${MEMORY_TYPES.semantic.halfLifeDays}`);
    }

    // T076: Autobiographical memory half-life = 365 days
    if (MEMORY_TYPES.autobiographical.halfLifeDays === 365) {
      pass('T076', 'Autobiographical memory half-life = 365 days', `Got: ${MEMORY_TYPES.autobiographical.halfLifeDays}`);
    } else {
      fail('T076', 'Autobiographical memory half-life = 365 days', `Expected 365, got: ${MEMORY_TYPES.autobiographical.halfLifeDays}`);
    }

    // T077: Meta-cognitive memory half-life = null (no decay)
    if (MEMORY_TYPES['meta-cognitive'].halfLifeDays === null) {
      pass('T077', 'Meta-cognitive memory half-life = null (no decay)', `Got: ${MEMORY_TYPES['meta-cognitive'].halfLifeDays}`);
    } else {
      fail('T077', 'Meta-cognitive memory half-life = null (no decay)', `Expected null, got: ${MEMORY_TYPES['meta-cognitive'].halfLifeDays}`);
    }

    // Also verify HALF_LIVES_DAYS lookup object matches
    log('\n   Verifying HALF_LIVES_DAYS lookup consistency...');
    const lookupMatch =
      HALF_LIVES_DAYS.working === 1 &&
      HALF_LIVES_DAYS.episodic === 7 &&
      HALF_LIVES_DAYS.prospective === 14 &&
      HALF_LIVES_DAYS.implicit === 30 &&
      HALF_LIVES_DAYS.declarative === 60 &&
      HALF_LIVES_DAYS.procedural === 90 &&
      HALF_LIVES_DAYS.semantic === 180 &&
      HALF_LIVES_DAYS.autobiographical === 365 &&
      HALF_LIVES_DAYS['meta-cognitive'] === null;

    if (lookupMatch) {
      log('   ✅ HALF_LIVES_DAYS lookup object is consistent with MEMORY_TYPES');
    } else {
      log('   ⚠️  HALF_LIVES_DAYS lookup object has inconsistencies');
    }
  }

  // 4.3 TYPE INFERENCE TESTS (T078-T082)

  function test_type_inference() {
    log('\n🔬 Type Inference - T078-T082');

    // T078: Test type inference from file path patterns
    const pathTests = [
      { path: '/project/scratch/temp-notes.md', expected: 'working' },
      { path: '/project/session-1-summary.md', expected: 'episodic' },
      { path: '/project/debug-log.md', expected: 'episodic' },
      { path: '/project/todo-list.md', expected: 'prospective' },
      { path: '/project/next-steps.md', expected: 'prospective' },
      { path: '/project/workflow-guide.md', expected: 'implicit' },
      { path: '/project/implementation-summary.md', expected: 'declarative' },
      { path: '/project/spec.md', expected: 'declarative' },
      { path: '/project/setup-guide.md', expected: 'procedural' },
      { path: '/project/checklist.md', expected: 'procedural' },
      { path: '/project/architecture.md', expected: 'semantic' },
      { path: '/project/decision-record.md', expected: 'semantic' },
      { path: '/project/changelog.md', expected: 'autobiographical' },
      { path: '/project/milestone.md', expected: 'autobiographical' },
      { path: '/project/constitutional-rules.md', expected: 'meta-cognitive' },
      { path: '/project/CLAUDE.md', expected: 'meta-cognitive' },
    ];

    let pathPassed = 0;
    let pathFailed = 0;

    for (const test of pathTests) {
      const result = typeInference.infer_type_from_path(test.path);
      if (result === test.expected) {
        pathPassed++;
      } else {
        pathFailed++;
        log(`      Path "${test.path}": expected ${test.expected}, got ${result}`);
      }
    }

    if (pathFailed === 0) {
      pass('T078', 'Type inference from file path patterns', `All ${pathPassed} path patterns matched correctly`);
    } else {
      fail('T078', 'Type inference from file path patterns', `${pathFailed}/${pathTests.length} patterns failed`);
    }

    // T079: Test type inference from frontmatter
    const frontmatterTests = [
      { content: '---\nmemory_type: episodic\n---\n# Test', expected: 'episodic' },
      { content: '---\nmemoryType: procedural\n---\n# Test', expected: 'procedural' },
      { content: '---\nmemory_type: "semantic"\n---\n# Test', expected: 'semantic' },
      { content: "---\nmemoryType: 'working'\n---\n# Test", expected: 'working' },
    ];

    let fmPassed = 0;
    let fmFailed = 0;

    for (const test of frontmatterTests) {
      const result = typeInference.extract_explicit_type(test.content);
      if (result === test.expected) {
        fmPassed++;
      } else {
        fmFailed++;
        log(`      Frontmatter test failed: expected ${test.expected}, got ${result}`);
      }
    }

    if (fmFailed === 0) {
      pass('T079', 'Type inference from frontmatter', `All ${fmPassed} frontmatter tests passed`);
    } else {
      fail('T079', 'Type inference from frontmatter', `${fmFailed}/${frontmatterTests.length} tests failed`);
    }

    // T080: Test type inference from importance_tier mapping
    const tierTests = [
      { content: '---\nimportance_tier: constitutional\n---', expected: 'meta-cognitive' },
      { content: '---\nimportanceTier: critical\n---', expected: 'semantic' },
      { content: '---\nimportance_tier: important\n---', expected: 'declarative' },
      { content: '---\nimportance_tier: normal\n---', expected: 'declarative' },
      { content: '---\nimportance_tier: temporary\n---', expected: 'working' },
      { content: '---\nimportance_tier: deprecated\n---', expected: 'episodic' },
      { content: '[CONSTITUTIONAL] This is a rule', expected: 'meta-cognitive' },
      { content: '[CRITICAL] Important info', expected: 'semantic' },
    ];

    let tierPassed = 0;
    let tierFailed = 0;

    for (const test of tierTests) {
      const result = typeInference.infer_type_from_tier(test.content);
      if (result === test.expected) {
        tierPassed++;
      } else {
        tierFailed++;
        log(`      Tier test failed: expected ${test.expected}, got ${result}`);
      }
    }

    if (tierFailed === 0) {
      pass('T080', 'Type inference from importance_tier mapping', `All ${tierPassed} tier mappings correct`);
    } else {
      fail('T080', 'Type inference from importance_tier mapping', `${tierFailed}/${tierTests.length} tests failed`);
    }

    // T081: Test type inference from keywords in title
    const keywordTests = [
      { title: 'Session Summary for Jan 15', expected: 'episodic' },
      { title: 'Debug session notes', expected: 'episodic' },
      { title: 'TODO: Fix bug in nav', expected: 'prospective' },
      { title: 'Next steps for project', expected: 'prospective' },
      { title: 'Code Pattern: Error Handling', expected: 'implicit' },
      { title: 'Best practice for validation', expected: 'implicit' },
      { title: 'Implementation Details', expected: 'declarative' },
      { title: 'API Reference', expected: 'declarative' },
      { title: 'How to deploy', expected: 'procedural' },
      { title: 'Setup Guide', expected: 'procedural' },
      { title: 'Architecture Decision', expected: 'semantic' },
      { title: 'Design Principles', expected: 'semantic' },
      { title: 'Project History', expected: 'autobiographical' },
      { title: 'Milestone: v1.0 Release', expected: 'autobiographical' },
      { title: 'Constitutional Rule: No Force Push', expected: 'meta-cognitive' },
      { title: 'Coding Standard', expected: 'meta-cognitive' },
    ];

    let kwPassed = 0;
    let kwFailed = 0;

    for (const test of keywordTests) {
      const result = typeInference.infer_type_from_keywords(test.title, [], '');
      if (result === test.expected) {
        kwPassed++;
      } else {
        kwFailed++;
        log(`      Keyword "${test.title}": expected ${test.expected}, got ${result}`);
      }
    }

    if (kwFailed === 0) {
      pass('T081', 'Type inference from keywords in title', `All ${kwPassed} keyword tests passed`);
    } else {
      fail('T081', 'Type inference from keywords in title', `${kwFailed}/${keywordTests.length} tests failed`);
    }

    // T082: Test default type fallback when no pattern matches
    const defaultResult = typeInference.infer_memory_type({
      filePath: '/project/random-file-xyz.md',
      content: '# Just some random content\n\nNo special markers here.',
      title: 'Random File',
      triggerPhrases: [],
    });

    if (defaultResult.type === 'declarative' && defaultResult.source === 'default') {
      pass('T082', 'Default type fallback when no pattern matches', `Type: ${defaultResult.type}, Source: ${defaultResult.source}, Confidence: ${defaultResult.confidence}`);
    } else {
      fail('T082', 'Default type fallback when no pattern matches', `Expected type=declarative, source=default. Got type=${defaultResult.type}, source=${defaultResult.source}`);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     5. TEST RUNNER
  ──────────────────────────────────────────────────────────────── */

  async function runTests() {
    log('🧪 Memory Types Tests (T068-T082)');
    log('==========================================');
    log(`Date: ${new Date().toISOString()}\n`);

    // Load modules first
    if (!loadModules()) {
      log('\n⚠️  Module loading failed. Aborting tests.');
      return results;
    }

    // Run all tests in order
    test_memory_types_structure();  // T068
    test_half_life_values();        // T069-T077
    test_type_inference();          // T078-T082

    // Summary
    log('\n==========================================');
    log('📊 TEST SUMMARY');
    log('==========================================');
    log(`✅ Passed:  ${results.passed}`);
    log(`❌ Failed:  ${results.failed}`);
    log(`⏭️  Skipped: ${results.skipped}`);
    log(`📝 Total:   ${results.passed + results.failed + results.skipped}`);
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
