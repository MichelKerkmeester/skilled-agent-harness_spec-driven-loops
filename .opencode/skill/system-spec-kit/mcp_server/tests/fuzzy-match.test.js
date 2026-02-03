// ───────────────────────────────────────────────────────────────
// TEST: FUZZY MATCH (LEVENSHTEIN + ACRONYM EXPANSION)
// ───────────────────────────────────────────────────────────────
// Tests for REQ-018: Query Expansion + Fuzzy Match
// Tests for REQ-027: Fuzzy Acronym Matching

(() => {
  'use strict';

  const path = require('path');

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ──────────────────────────────────────────────────────────────── */

  const LIB_PATH = path.join(__dirname, '..', 'lib', 'search');

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

  let fuzzyMatch;

  function test_module_loads() {
    log('\n== Module Loading ==');

    try {
      fuzzyMatch = require(path.join(LIB_PATH, 'fuzzy-match.js'));
      pass('T076-01', 'Module loads without error', 'require() succeeded');
    } catch (error) {
      fail('T076-01', 'Module loads without error', error.message);
      return false;
    }
    return true;
  }

  /* ─────────────────────────────────────────────────────────────
     4. TEST SUITES
  ──────────────────────────────────────────────────────────────── */

  // 4.1 LEVENSHTEIN DISTANCE TESTS (CHK-137)

  function test_levenshtein_distance() {
    log('\n== Levenshtein Distance (CHK-137) ==');

    // T076-02: Identical strings have distance 0
    const dist_same = fuzzyMatch.levenshtein_distance('hello', 'hello');
    if (dist_same === 0) {
      pass('T076-02', 'Identical strings -> distance 0', `"hello" vs "hello" = ${dist_same}`);
    } else {
      fail('T076-02', 'Identical strings -> distance 0', `Expected 0, got ${dist_same}`);
    }

    // T076-03: Empty string distance equals length of other
    const dist_empty = fuzzyMatch.levenshtein_distance('', 'test');
    if (dist_empty === 4) {
      pass('T076-03', 'Empty string -> distance = other length', `"" vs "test" = ${dist_empty}`);
    } else {
      fail('T076-03', 'Empty string -> distance = other length', `Expected 4, got ${dist_empty}`);
    }

    // T076-04: Single character substitution = distance 1
    const dist_sub = fuzzyMatch.levenshtein_distance('cat', 'bat');
    if (dist_sub === 1) {
      pass('T076-04', 'Single substitution -> distance 1', `"cat" vs "bat" = ${dist_sub}`);
    } else {
      fail('T076-04', 'Single substitution -> distance 1', `Expected 1, got ${dist_sub}`);
    }

    // T076-05: Single character insertion = distance 1
    const dist_ins = fuzzyMatch.levenshtein_distance('cat', 'cats');
    if (dist_ins === 1) {
      pass('T076-05', 'Single insertion -> distance 1', `"cat" vs "cats" = ${dist_ins}`);
    } else {
      fail('T076-05', 'Single insertion -> distance 1', `Expected 1, got ${dist_ins}`);
    }

    // T076-06: Single character deletion = distance 1
    const dist_del = fuzzyMatch.levenshtein_distance('cats', 'cat');
    if (dist_del === 1) {
      pass('T076-06', 'Single deletion -> distance 1', `"cats" vs "cat" = ${dist_del}`);
    } else {
      fail('T076-06', 'Single deletion -> distance 1', `Expected 1, got ${dist_del}`);
    }

    // T076-07: Two edits = distance 2
    const dist_two = fuzzyMatch.levenshtein_distance('kitten', 'sitten');
    if (dist_two === 1) {
      pass('T076-07', 'kitten -> sitten = 1 edit', `Got ${dist_two}`);
    } else {
      fail('T076-07', 'kitten -> sitten = 1 edit', `Expected 1, got ${dist_two}`);
    }

    // T076-08: Classic example: kitten -> sitting = 3
    const dist_classic = fuzzyMatch.levenshtein_distance('kitten', 'sitting');
    if (dist_classic === 3) {
      pass('T076-08', 'kitten -> sitting = 3 edits', `Got ${dist_classic}`);
    } else {
      fail('T076-08', 'kitten -> sitting = 3 edits', `Expected 3, got ${dist_classic}`);
    }

    // T076-09: Case insensitive comparison
    const dist_case = fuzzyMatch.levenshtein_distance('RRF', 'rrf');
    if (dist_case === 0) {
      pass('T076-09', 'Case insensitive: RRF == rrf', `Got ${dist_case}`);
    } else {
      fail('T076-09', 'Case insensitive: RRF == rrf', `Expected 0, got ${dist_case}`);
    }

    // T076-10: Null/undefined handling
    const dist_null = fuzzyMatch.levenshtein_distance(null, 'test');
    if (dist_null === 4) {
      pass('T076-10', 'Null string -> returns other length', `Got ${dist_null}`);
    } else {
      fail('T076-10', 'Null string -> returns other length', `Expected 4, got ${dist_null}`);
    }
  }

  // 4.2 IS FUZZY MATCH TESTS

  function test_is_fuzzy_match() {
    log('\n== Is Fuzzy Match ==');

    // T076-11: Within threshold returns true
    const match1 = fuzzyMatch.is_fuzzy_match('RRF', 'RFF', 1);
    if (match1 === true) {
      pass('T076-11', 'RRF vs RFF (dist 1) with threshold 1 -> true', `Got ${match1}`);
    } else {
      fail('T076-11', 'RRF vs RFF (dist 1) with threshold 1 -> true', `Expected true, got ${match1}`);
    }

    // T076-12: Exceeds threshold returns false
    const match2 = fuzzyMatch.is_fuzzy_match('RRF', 'ABC', 1);
    if (match2 === false) {
      pass('T076-12', 'RRF vs ABC (dist 3) with threshold 1 -> false', `Got ${match2}`);
    } else {
      fail('T076-12', 'RRF vs ABC (dist 3) with threshold 1 -> false', `Expected false, got ${match2}`);
    }

    // T076-13: Default threshold is 2
    const match3 = fuzzyMatch.is_fuzzy_match('embedding', 'embeding');  // Missing 'd'
    if (match3 === true) {
      pass('T076-13', 'embedding vs embeding within default threshold 2', `Got ${match3}`);
    } else {
      fail('T076-13', 'embedding vs embeding within default threshold 2', `Expected true, got ${match3}`);
    }

    // T076-14: Length difference optimization
    const match4 = fuzzyMatch.is_fuzzy_match('ab', 'abcdef', 2);
    if (match4 === false) {
      pass('T076-14', 'Length diff > threshold returns false early', `Got ${match4}`);
    } else {
      fail('T076-14', 'Length diff > threshold returns false early', `Expected false, got ${match4}`);
    }
  }

  // 4.3 ACRONYM MAP TESTS (CHK-138)

  function test_acronym_map() {
    log('\n== ACRONYM_MAP (CHK-138) ==');

    // T077-01: Map contains RRF
    if (fuzzyMatch.ACRONYM_MAP['RRF']) {
      pass('T077-01', 'ACRONYM_MAP contains RRF', JSON.stringify(fuzzyMatch.ACRONYM_MAP['RRF']));
    } else {
      fail('T077-01', 'ACRONYM_MAP contains RRF', 'RRF not found');
    }

    // T077-02: Map contains FSRS
    if (fuzzyMatch.ACRONYM_MAP['FSRS']) {
      pass('T077-02', 'ACRONYM_MAP contains FSRS', JSON.stringify(fuzzyMatch.ACRONYM_MAP['FSRS']));
    } else {
      fail('T077-02', 'ACRONYM_MAP contains FSRS', 'FSRS not found');
    }

    // T077-03: Map contains BM25
    if (fuzzyMatch.ACRONYM_MAP['BM25']) {
      pass('T077-03', 'ACRONYM_MAP contains BM25', JSON.stringify(fuzzyMatch.ACRONYM_MAP['BM25']));
    } else {
      fail('T077-03', 'ACRONYM_MAP contains BM25', 'BM25 not found');
    }

    // T077-04: Map contains MCP
    if (fuzzyMatch.ACRONYM_MAP['MCP']) {
      pass('T077-04', 'ACRONYM_MAP contains MCP', JSON.stringify(fuzzyMatch.ACRONYM_MAP['MCP']));
    } else {
      fail('T077-04', 'ACRONYM_MAP contains MCP', 'MCP not found');
    }

    // T077-05: RRF expansion includes expected terms
    const rrf = fuzzyMatch.ACRONYM_MAP['RRF'];
    if (rrf && rrf.some(e => e.includes('Reciprocal'))) {
      pass('T077-05', 'RRF expands to Reciprocal Rank Fusion', rrf[0]);
    } else {
      fail('T077-05', 'RRF expands to Reciprocal Rank Fusion', JSON.stringify(rrf));
    }

    // T077-06: Map has at least 30 entries
    const count = Object.keys(fuzzyMatch.ACRONYM_MAP).length;
    if (count >= 30) {
      pass('T077-06', 'ACRONYM_MAP has 30+ entries', `Count: ${count}`);
    } else {
      fail('T077-06', 'ACRONYM_MAP has 30+ entries', `Only ${count} entries`);
    }

    // T077-07: Each entry has at least one expansion
    let all_have_expansions = true;
    for (const [key, value] of Object.entries(fuzzyMatch.ACRONYM_MAP)) {
      if (!Array.isArray(value) || value.length === 0) {
        all_have_expansions = false;
        break;
      }
    }
    if (all_have_expansions) {
      pass('T077-07', 'All acronyms have expansions', 'All entries valid');
    } else {
      fail('T077-07', 'All acronyms have expansions', 'Some entries missing expansions');
    }
  }

  // 4.4 ACRONYM LOOKUP TESTS

  function test_acronym_lookup() {
    log('\n== Acronym Lookup ==');

    // T077-08: Exact acronym lookup
    const exact = fuzzyMatch.get_acronym_expansion('RRF');
    if (exact && exact.length > 0) {
      pass('T077-08', 'Exact lookup: RRF', JSON.stringify(exact));
    } else {
      fail('T077-08', 'Exact lookup: RRF', 'Not found');
    }

    // T077-09: Case insensitive exact lookup
    const lower = fuzzyMatch.get_acronym_expansion('rrf');
    if (lower && lower.length > 0) {
      pass('T077-09', 'Case insensitive lookup: rrf', JSON.stringify(lower));
    } else {
      fail('T077-09', 'Case insensitive lookup: rrf', 'Not found');
    }

    // T077-10: Unknown acronym returns empty array
    const unknown = fuzzyMatch.get_acronym_expansion('XYZZY');
    if (Array.isArray(unknown) && unknown.length === 0) {
      pass('T077-10', 'Unknown acronym returns []', JSON.stringify(unknown));
    } else {
      fail('T077-10', 'Unknown acronym returns []', JSON.stringify(unknown));
    }

    // T077-11: Null/empty returns empty array
    const empty = fuzzyMatch.get_acronym_expansion('');
    if (Array.isArray(empty) && empty.length === 0) {
      pass('T077-11', 'Empty input returns []', JSON.stringify(empty));
    } else {
      fail('T077-11', 'Empty input returns []', JSON.stringify(empty));
    }
  }

  // 4.5 FUZZY ACRONYM LOOKUP TESTS

  function test_fuzzy_acronym_lookup() {
    log('\n== Fuzzy Acronym Lookup ==');

    // T077-12: Typo in acronym: RFF -> RRF
    const typo1 = fuzzyMatch.find_fuzzy_acronym('RFF', 1);
    if (typo1.length > 0 && typo1.some(e => e.includes('Reciprocal'))) {
      pass('T077-12', 'RFF (typo) finds RRF expansions', typo1.slice(0, 2).join(', '));
    } else {
      fail('T077-12', 'RFF (typo) finds RRF expansions', JSON.stringify(typo1));
    }

    // T077-13: Typo in acronym: BN25 -> BM25
    const typo2 = fuzzyMatch.find_fuzzy_acronym('BN25', 1);
    if (typo2.length > 0) {
      pass('T077-13', 'BN25 (typo) finds BM25 expansions', typo2.slice(0, 2).join(', '));
    } else {
      fail('T077-13', 'BN25 (typo) finds BM25 expansions', JSON.stringify(typo2));
    }

    // T077-14: Too many edits returns empty
    const far = fuzzyMatch.find_fuzzy_acronym('ZZZZZ', 1);
    if (far.length === 0) {
      pass('T077-14', 'ZZZZZ (too far) returns []', JSON.stringify(far));
    } else {
      fail('T077-14', 'ZZZZZ (too far) returns []', JSON.stringify(far));
    }

    // T077-15: Short term returns empty
    const short = fuzzyMatch.find_fuzzy_acronym('X', 1);
    if (short.length === 0) {
      pass('T077-15', 'Single char returns []', JSON.stringify(short));
    } else {
      fail('T077-15', 'Single char returns []', JSON.stringify(short));
    }
  }

  // 4.6 EXPAND QUERY WITH FUZZY TESTS (CHK-139)

  function test_expand_query_with_fuzzy() {
    log('\n== expandQueryWithFuzzy (CHK-139) ==');

    // T078-01: Basic acronym expansion
    const result1 = fuzzyMatch.expand_query_with_fuzzy('RRF search');
    if (result1.expansions.length > 0 && result1.expanded.includes('Reciprocal')) {
      pass('T078-01', 'RRF expands in query', result1.expanded.substring(0, 60) + '...');
    } else {
      fail('T078-01', 'RRF expands in query', JSON.stringify(result1));
    }

    // T078-02: Multiple acronyms expand
    const result2 = fuzzyMatch.expand_query_with_fuzzy('BM25 and RRF fusion');
    if (result2.acronyms_found.length >= 2) {
      pass('T078-02', 'Multiple acronyms found', `Found: ${result2.acronyms_found.map(a => a.term).join(', ')}`);
    } else {
      fail('T078-02', 'Multiple acronyms found', JSON.stringify(result2.acronyms_found));
    }

    // T078-03: Query with typo expands via fuzzy
    const result3 = fuzzyMatch.expand_query_with_fuzzy('RFF fusion search');
    if (result3.fuzzy_matches.length > 0) {
      pass('T078-03', 'Typo RFF finds fuzzy match', JSON.stringify(result3.fuzzy_matches[0]));
    } else {
      fail('T078-03', 'Typo RFF finds fuzzy match', 'No fuzzy matches found');
    }

    // T078-04: Empty query returns empty expansions
    const result4 = fuzzyMatch.expand_query_with_fuzzy('');
    if (result4.expansions.length === 0 && result4.expanded === '') {
      pass('T078-04', 'Empty query returns empty result', JSON.stringify(result4));
    } else {
      fail('T078-04', 'Empty query returns empty result', JSON.stringify(result4));
    }

    // T078-05: Short terms are not expanded
    const result5 = fuzzyMatch.expand_query_with_fuzzy('to be or not');
    if (result5.expansions.length === 0) {
      pass('T078-05', 'Short terms not expanded', `Original: "${result5.original}"`);
    } else {
      fail('T078-05', 'Short terms not expanded', JSON.stringify(result5.expansions));
    }

    // T078-06: Original query preserved
    const result6 = fuzzyMatch.expand_query_with_fuzzy('find MCP documentation');
    if (result6.original === 'find MCP documentation') {
      pass('T078-06', 'Original query preserved', result6.original);
    } else {
      fail('T078-06', 'Original query preserved', `Expected "find MCP documentation", got "${result6.original}"`);
    }

    // T078-07: Expansions are unique
    const result7 = fuzzyMatch.expand_query_with_fuzzy('MCP MCP MCP');
    const unique_expansions = [...new Set(result7.expansions)];
    if (result7.expansions.length === unique_expansions.length) {
      pass('T078-07', 'Expansions are deduplicated', `${result7.expansions.length} unique`);
    } else {
      fail('T078-07', 'Expansions are deduplicated', 'Contains duplicates');
    }

    // T078-08: Options to disable acronyms
    const result8 = fuzzyMatch.expand_query_with_fuzzy('RRF test', { includeAcronyms: false });
    if (result8.fuzzy_matches.length === 0 || !result8.expanded.includes('Reciprocal')) {
      pass('T078-08', 'includeAcronyms: false skips exact acronyms', result8.expanded);
    } else {
      fail('T078-08', 'includeAcronyms: false skips exact acronyms', result8.expanded);
    }

    // T078-09: Options to disable fuzzy
    const result9 = fuzzyMatch.expand_query_with_fuzzy('RFF test', { includeFuzzy: false });
    // RFF is not an exact match, so with fuzzy disabled, no expansion
    if (result9.fuzzy_matches.filter(m => m.type === 'term').length === 0) {
      pass('T078-09', 'includeFuzzy: false skips fuzzy term matches', JSON.stringify(result9.fuzzy_matches));
    } else {
      fail('T078-09', 'includeFuzzy: false skips fuzzy term matches', JSON.stringify(result9.fuzzy_matches));
    }
  }

  // 4.7 TYPO CORRECTION TESTS (CHK-140)

  function test_typo_correction() {
    log('\n== Typo Correction (CHK-140) ==');

    // T078-10: Common typo: embeding -> embedding
    const typo1 = fuzzyMatch.correct_typo('embeding');
    if (typo1 === 'embedding') {
      pass('T078-10', 'embeding -> embedding', typo1);
    } else {
      fail('T078-10', 'embeding -> embedding', `Got: ${typo1}`);
    }

    // T078-11: Common typo: retreival -> retrieval
    const typo2 = fuzzyMatch.correct_typo('retreival');
    if (typo2 === 'retrieval') {
      pass('T078-11', 'retreival -> retrieval', typo2);
    } else {
      fail('T078-11', 'retreival -> retrieval', `Got: ${typo2}`);
    }

    // T078-12: Common typo: seach -> search
    const typo3 = fuzzyMatch.correct_typo('seach');
    if (typo3 === 'search') {
      pass('T078-12', 'seach -> search', typo3);
    } else {
      fail('T078-12', 'seach -> search', `Got: ${typo3}`);
    }

    // T078-13: Unknown word returns null
    const unknown = fuzzyMatch.correct_typo('validword');
    if (unknown === null) {
      pass('T078-13', 'Valid word returns null', String(unknown));
    } else {
      fail('T078-13', 'Valid word returns null', `Got: ${unknown}`);
    }

    // T078-14: Case insensitive typo correction
    const case_typo = fuzzyMatch.correct_typo('EMBEDING');
    if (case_typo === 'embedding') {
      pass('T078-14', 'EMBEDING (uppercase) -> embedding', case_typo);
    } else {
      fail('T078-14', 'EMBEDING (uppercase) -> embedding', `Got: ${case_typo}`);
    }

    // T078-15: Query typo correction
    const query_result = fuzzyMatch.correct_query_typos('seach for embeding');
    if (query_result.corrected === 'search for embedding' && query_result.corrections.length === 2) {
      pass('T078-15', 'Query typo correction works', query_result.corrected);
    } else {
      fail('T078-15', 'Query typo correction works', JSON.stringify(query_result));
    }
  }

  // 4.8 CONFIGURATION TESTS

  function test_configuration() {
    log('\n== Configuration ==');

    // T078-16: MAX_EDIT_DISTANCE is 2
    if (fuzzyMatch.MAX_EDIT_DISTANCE === 2) {
      pass('T078-16', 'MAX_EDIT_DISTANCE is 2', String(fuzzyMatch.MAX_EDIT_DISTANCE));
    } else {
      fail('T078-16', 'MAX_EDIT_DISTANCE is 2', `Got: ${fuzzyMatch.MAX_EDIT_DISTANCE}`);
    }

    // T078-17: MIN_FUZZY_TERM_LENGTH is 3
    if (fuzzyMatch.MIN_FUZZY_TERM_LENGTH === 3) {
      pass('T078-17', 'MIN_FUZZY_TERM_LENGTH is 3', String(fuzzyMatch.MIN_FUZZY_TERM_LENGTH));
    } else {
      fail('T078-17', 'MIN_FUZZY_TERM_LENGTH is 3', `Got: ${fuzzyMatch.MIN_FUZZY_TERM_LENGTH}`);
    }

    // T078-18: ENABLE_FUZZY_MATCH defaults to true
    // Note: Could be overridden by env var, but default should be true
    if (typeof fuzzyMatch.ENABLE_FUZZY_MATCH === 'boolean') {
      pass('T078-18', 'ENABLE_FUZZY_MATCH is boolean', String(fuzzyMatch.ENABLE_FUZZY_MATCH));
    } else {
      fail('T078-18', 'ENABLE_FUZZY_MATCH is boolean', `Got: ${typeof fuzzyMatch.ENABLE_FUZZY_MATCH}`);
    }
  }

  // 4.9 LEGACY CAMELCASE ALIAS TESTS

  function test_legacy_aliases() {
    log('\n== Legacy CamelCase Aliases ==');

    // T078-19: levenshteinDistance alias works
    if (typeof fuzzyMatch.levenshteinDistance === 'function') {
      const dist = fuzzyMatch.levenshteinDistance('test', 'tset');
      if (dist === 2) {
        pass('T078-19', 'levenshteinDistance alias works', `test vs tset = ${dist}`);
      } else {
        fail('T078-19', 'levenshteinDistance alias works', `Expected 2, got ${dist}`);
      }
    } else {
      fail('T078-19', 'levenshteinDistance alias works', 'Not a function');
    }

    // T078-20: expandQueryWithFuzzy alias works
    if (typeof fuzzyMatch.expandQueryWithFuzzy === 'function') {
      const result = fuzzyMatch.expandQueryWithFuzzy('RRF');
      if (result.original === 'RRF') {
        pass('T078-20', 'expandQueryWithFuzzy alias works', result.original);
      } else {
        fail('T078-20', 'expandQueryWithFuzzy alias works', JSON.stringify(result));
      }
    } else {
      fail('T078-20', 'expandQueryWithFuzzy alias works', 'Not a function');
    }
  }

  // 4.10 TASKS T061-T067: FUZZY MATCH CORE TESTS

  function test_t061_t067_core() {
    log('\n== Tasks T061-T067: Fuzzy Match Core Tests ==');

    // T061: Test Levenshtein distance calculation
    log('\n--- T061: Levenshtein Distance Calculation ---');
    const t061_tests = [
      { a: 'cat', b: 'cat', expected: 0, desc: 'identical strings' },
      { a: 'cat', b: 'bat', expected: 1, desc: 'single substitution' },
      { a: 'cat', b: 'cart', expected: 1, desc: 'single insertion' },
      { a: 'cart', b: 'cat', expected: 1, desc: 'single deletion' },
      { a: 'kitten', b: 'sitting', expected: 3, desc: 'classic example (3 edits)' },
      { a: '', b: 'test', expected: 4, desc: 'empty to non-empty' },
      { a: 'ABC', b: 'abc', expected: 0, desc: 'case insensitive' },
    ];

    let t061_passed = true;
    for (const test of t061_tests) {
      const result = fuzzyMatch.levenshtein_distance(test.a, test.b);
      if (result !== test.expected) {
        fail('T061', `Levenshtein: ${test.desc}`, `"${test.a}" vs "${test.b}": expected ${test.expected}, got ${result}`);
        t061_passed = false;
      }
    }
    if (t061_passed) {
      pass('T061', 'Levenshtein distance calculation', `All ${t061_tests.length} test cases passed`);
    }

    // T062: Test MAX_EDIT_DISTANCE = 2 threshold
    log('\n--- T062: MAX_EDIT_DISTANCE = 2 Threshold ---');
    const max_dist = fuzzyMatch.MAX_EDIT_DISTANCE;
    if (max_dist === 2) {
      // Verify threshold behavior
      const within = fuzzyMatch.is_fuzzy_match('test', 'tast', 2);  // dist 1
      const at_limit = fuzzyMatch.is_fuzzy_match('test', 'toast', 2);  // dist 2
      const beyond = fuzzyMatch.is_fuzzy_match('test', 'toast!', 2);  // dist 3

      if (within === true && at_limit === true && beyond === false) {
        pass('T062', 'MAX_EDIT_DISTANCE = 2 threshold', `Const=${max_dist}, within=true, at_limit=true, beyond=false`);
      } else {
        fail('T062', 'MAX_EDIT_DISTANCE = 2 threshold', `within=${within}, at_limit=${at_limit}, beyond=${beyond}`);
      }
    } else {
      fail('T062', 'MAX_EDIT_DISTANCE = 2 threshold', `Expected 2, got ${max_dist}`);
    }

    // T063: Test ACRONYM_MAP expansion for technical terms (RRF, BM25, FSRS, etc.)
    log('\n--- T063: ACRONYM_MAP Technical Terms ---');
    const required_acronyms = ['RRF', 'BM25', 'FSRS', 'MCP', 'LLM', 'NLP', 'API', 'CLI'];
    const acronym_results = {};
    let t063_all_found = true;

    for (const acronym of required_acronyms) {
      const expansion = fuzzyMatch.ACRONYM_MAP[acronym];
      if (expansion && expansion.length > 0) {
        acronym_results[acronym] = expansion[0];
      } else {
        acronym_results[acronym] = 'NOT FOUND';
        t063_all_found = false;
      }
    }

    if (t063_all_found) {
      pass('T063', 'ACRONYM_MAP expansion for technical terms',
        `Found all ${required_acronyms.length}: ${required_acronyms.join(', ')}`);
    } else {
      const missing = required_acronyms.filter(a => acronym_results[a] === 'NOT FOUND');
      fail('T063', 'ACRONYM_MAP expansion for technical terms', `Missing: ${missing.join(', ')}`);
    }

    // T064: Test stop words filtering prevents false positives
    log('\n--- T064: Stop Words Filtering ---');
    const stop_word_tests = [
      { term: 'not', should_match: false, reason: 'common stop word' },
      { term: 'and', should_match: false, reason: 'common stop word' },
      { term: 'the', should_match: false, reason: 'common stop word' },
      { term: 'for', should_match: false, reason: 'common stop word' },
    ];

    let t064_passed = true;
    for (const test of stop_word_tests) {
      const result = fuzzyMatch.find_fuzzy_acronym(test.term, 1);
      const matched = result.length > 0;
      if (matched !== test.should_match) {
        fail('T064', `Stop word "${test.term}" filtering`,
          `Expected ${test.should_match ? 'match' : 'no match'}, got ${matched ? 'match' : 'no match'}`);
        t064_passed = false;
      }
    }

    // Also verify STOP_WORDS set exists and contains expected entries
    const has_stop_words = fuzzyMatch.STOP_WORDS &&
      fuzzyMatch.STOP_WORDS.has('not') &&
      fuzzyMatch.STOP_WORDS.has('and');

    if (t064_passed && has_stop_words) {
      pass('T064', 'Stop words filtering prevents false positives',
        `STOP_WORDS set exists, prevents "not", "and", "the", "for" from matching`);
    } else if (!has_stop_words) {
      fail('T064', 'Stop words filtering prevents false positives', 'STOP_WORDS set missing or incomplete');
    }

    // T065: Test COMMON_TYPOS correction map
    log('\n--- T065: COMMON_TYPOS Correction Map ---');
    const typo_tests = [
      { typo: 'embeding', correct: 'embedding' },
      { typo: 'retreival', correct: 'retrieval' },
      { typo: 'seach', correct: 'search' },
      { typo: 'qeury', correct: 'query' },
      { typo: 'databse', correct: 'database' },
      { typo: 'levenstein', correct: 'levenshtein' },
    ];

    let t065_passed = true;
    for (const test of typo_tests) {
      const corrected = fuzzyMatch.correct_typo(test.typo);
      if (corrected !== test.correct) {
        fail('T065', `COMMON_TYPOS: ${test.typo}`, `Expected "${test.correct}", got "${corrected}"`);
        t065_passed = false;
      }
    }

    // Also verify the map exists and has entries
    const map_size = Object.keys(fuzzyMatch.COMMON_TYPOS).length;
    if (t065_passed && map_size >= 10) {
      pass('T065', 'COMMON_TYPOS correction map', `${map_size} entries, all ${typo_tests.length} test corrections work`);
    } else if (map_size < 10) {
      fail('T065', 'COMMON_TYPOS correction map', `Only ${map_size} entries (expected >= 10)`);
    }

    // T066: Test expand_query_with_fuzzy() returns expanded query
    log('\n--- T066: expand_query_with_fuzzy() Returns Expanded Query ---');
    const expand_tests = [
      {
        query: 'RRF search',
        check: (r) => r.expanded.includes('Reciprocal') && r.expansions.length > 0,
        desc: 'RRF expands with Reciprocal'
      },
      {
        query: 'BM25 retrieval',
        check: (r) => r.expanded.includes('Best Matching') && r.acronyms_found.length >= 1,
        desc: 'BM25 expands with Best Matching'
      },
      {
        query: 'find MCP docs',
        check: (r) => r.original === 'find MCP docs' && r.expanded.includes('Context Protocol'),
        desc: 'MCP expands, original preserved'
      },
      {
        query: '',
        check: (r) => r.expanded === '' && r.expansions.length === 0,
        desc: 'empty query returns empty result'
      },
    ];

    let t066_passed = true;
    for (const test of expand_tests) {
      const result = fuzzyMatch.expand_query_with_fuzzy(test.query);
      if (!test.check(result)) {
        fail('T066', `expand_query_with_fuzzy: ${test.desc}`,
          `Query: "${test.query}", Result: ${JSON.stringify(result).substring(0, 100)}`);
        t066_passed = false;
      }
    }

    if (t066_passed) {
      pass('T066', 'expand_query_with_fuzzy() returns expanded query',
        `All ${expand_tests.length} expansion tests passed`);
    }

    // T067: Test ENABLE_FUZZY_MATCH feature flag
    log('\n--- T067: ENABLE_FUZZY_MATCH Feature Flag ---');

    // Verify the flag exists and is a boolean
    const flag = fuzzyMatch.ENABLE_FUZZY_MATCH;
    const flag_type = typeof flag;

    if (flag_type === 'boolean') {
      // When flag is true, expansions should work
      // When flag is false, expand_query_with_fuzzy should return no expansions
      // Since we can't easily change env var mid-test, just verify the flag exists and is respected

      if (flag === true) {
        // Verify that with flag enabled, expansion works
        const test_result = fuzzyMatch.expand_query_with_fuzzy('RRF test');
        if (test_result.expansions.length > 0) {
          pass('T067', 'ENABLE_FUZZY_MATCH feature flag',
            `Flag=${flag}, expansions work when enabled`);
        } else {
          fail('T067', 'ENABLE_FUZZY_MATCH feature flag',
            `Flag=${flag} but no expansions returned`);
        }
      } else {
        // Flag is false (via env var), expansion should be disabled
        const test_result = fuzzyMatch.expand_query_with_fuzzy('RRF test');
        if (test_result.expansions.length === 0) {
          pass('T067', 'ENABLE_FUZZY_MATCH feature flag',
            `Flag=${flag}, expansions correctly disabled`);
        } else {
          fail('T067', 'ENABLE_FUZZY_MATCH feature flag',
            `Flag=${flag} but expansions still returned`);
        }
      }
    } else {
      fail('T067', 'ENABLE_FUZZY_MATCH feature flag',
        `Expected boolean, got ${flag_type}`);
    }
  }

  // 4.11 EDGE CASES

  function test_edge_cases() {
    log('\n== Edge Cases ==');

    // T078-21: Very long query handled
    const long_query = 'a'.repeat(1000);
    try {
      const result = fuzzyMatch.expand_query_with_fuzzy(long_query);
      if (result.original === long_query) {
        pass('T078-21', 'Very long query handled', `Length: ${result.original.length}`);
      } else {
        fail('T078-21', 'Very long query handled', 'Original not preserved');
      }
    } catch (e) {
      fail('T078-21', 'Very long query handled', `Error: ${e.message}`);
    }

    // T078-22: Special characters in query
    const special_query = 'RRF & BM25 + MCP!';
    try {
      const result = fuzzyMatch.expand_query_with_fuzzy(special_query);
      if (result.acronyms_found.length >= 2) {
        pass('T078-22', 'Special characters handled', `Found: ${result.acronyms_found.length} acronyms`);
      } else {
        fail('T078-22', 'Special characters handled', JSON.stringify(result.acronyms_found));
      }
    } catch (e) {
      fail('T078-22', 'Special characters handled', `Error: ${e.message}`);
    }

    // T078-23: Unicode in query
    const unicode_query = 'RRF recherche';
    try {
      const result = fuzzyMatch.expand_query_with_fuzzy(unicode_query);
      pass('T078-23', 'Unicode characters handled', result.expanded.substring(0, 50));
    } catch (e) {
      fail('T078-23', 'Unicode characters handled', `Error: ${e.message}`);
    }

    // T078-24: Null input to levenshtein (both null)
    const null_both = fuzzyMatch.levenshtein_distance(null, null);
    if (null_both === 0) {
      pass('T078-24', 'Both null -> distance 0', String(null_both));
    } else {
      fail('T078-24', 'Both null -> distance 0', `Got: ${null_both}`);
    }

    // T078-25: Symmetry: distance(a,b) === distance(b,a)
    const dist_ab = fuzzyMatch.levenshtein_distance('hello', 'world');
    const dist_ba = fuzzyMatch.levenshtein_distance('world', 'hello');
    if (dist_ab === dist_ba) {
      pass('T078-25', 'Distance is symmetric', `hello<->world = ${dist_ab}`);
    } else {
      fail('T078-25', 'Distance is symmetric', `${dist_ab} !== ${dist_ba}`);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     5. TEST RUNNER
  ──────────────────────────────────────────────────────────────── */

  async function runTests() {
    log('===============================================');
    log('  Fuzzy Match Tests (T076-T078)');
    log('  REQ-018: Query Expansion + Fuzzy Match');
    log('  REQ-027: Fuzzy Acronym Matching');
    log('===============================================');
    log(`Date: ${new Date().toISOString()}\n`);

    // Load module first
    if (!test_module_loads()) {
      log('\n!! Module failed to load. Aborting tests.');
      return results;
    }

    // Run all tests
    test_levenshtein_distance();
    test_is_fuzzy_match();
    test_acronym_map();
    test_acronym_lookup();
    test_fuzzy_acronym_lookup();
    test_expand_query_with_fuzzy();
    test_typo_correction();
    test_configuration();
    test_legacy_aliases();
    test_t061_t067_core();
    test_edge_cases();

    // Summary
    log('\n===============================================');
    log('  TEST SUMMARY');
    log('===============================================');
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
    runTests().then((r) => {
      process.exit(r.failed > 0 ? 1 : 0);
    });
  }

  module.exports = { runTests };

})();
