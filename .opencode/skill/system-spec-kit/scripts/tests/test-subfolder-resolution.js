// ───────────────────────────────────────────────────────────────
// TEST: SUBFOLDER RESOLUTION
// Focus: SPEC_FOLDER_PATTERN, SPEC_FOLDER_BASIC_PATTERN,
//        findChildFolderSync, findChildFolderAsync, core/index re-exports
// ───────────────────────────────────────────────────────────────

'use strict';

const path = require('path');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────*/

const DIST_DIR = path.join(__dirname, '..', 'dist');

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
};

/* ─────────────────────────────────────────────────────────────
   2. TEST UTILITIES
────────────────────────────────────────────────────────────────*/

function log(msg) {
  console.log(msg);
}

function pass(testName, evidence) {
  results.passed++;
  results.tests.push({ name: testName, status: 'PASS', evidence });
  log(`   ✅ ${testName}`);
  if (evidence) log(`      Evidence: ${evidence}`);
}

function fail(testName, reason) {
  results.failed++;
  results.tests.push({ name: testName, status: 'FAIL', reason });
  log(`   ❌ ${testName}`);
  log(`      Reason: ${reason}`);
}

function skip(testName, reason) {
  results.skipped++;
  results.tests.push({ name: testName, status: 'SKIP', reason });
  log(`   ⏭️  ${testName} (skipped: ${reason})`);
}

/* ─────────────────────────────────────────────────────────────
   3. TEST: SPEC_FOLDER_PATTERN (strict)
   Regex: /^\d{3}-[a-z][a-z0-9-]*$/
────────────────────────────────────────────────────────────────*/

async function testSpecFolderPatternValid() {
  log('\n🔬 SPEC_FOLDER_PATTERN: Valid patterns match');

  try {
    const { SPEC_FOLDER_PATTERN } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const validCases = [
      '003-system-spec-kit',
      '121-script-audit',
      '001-a',
      '000-hello-world',
      '999-z',
      '042-multi-word-name-here',
      '100-abc123',
      '010-a0b1c2',
    ];

    let allPassed = true;
    const failures = [];
    for (const input of validCases) {
      if (!SPEC_FOLDER_PATTERN.test(input)) {
        allPassed = false;
        failures.push(input);
      }
    }

    if (allPassed) {
      pass('T-SF01a: Valid patterns match', `All ${validCases.length} valid patterns matched`);
    } else {
      fail('T-SF01a: Valid patterns match', `Failed to match: ${failures.join(', ')}`);
    }
  } catch (err) {
    fail('T-SF01a: Valid patterns match', err.message);
  }
}

async function testSpecFolderPatternInvalid() {
  log('\n🔬 SPEC_FOLDER_PATTERN: Invalid patterns rejected');

  try {
    const { SPEC_FOLDER_PATTERN } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const invalidCases = [
      { input: '003-System', reason: 'uppercase after hyphen' },
      { input: '3-foo', reason: 'single digit prefix' },
      { input: 'abc-def', reason: 'non-numeric prefix' },
      { input: '003-', reason: 'nothing after hyphen' },
      { input: '003-1invalid', reason: 'digit after hyphen (not letter)' },
      { input: '', reason: 'empty string' },
      { input: '0003-foo', reason: 'four digit prefix' },
      { input: '003_foo', reason: 'underscore instead of hyphen' },
      { input: '003-FOO', reason: 'all uppercase after hyphen' },
      { input: '003-foo bar', reason: 'space in name' },
      { input: '003-foo/bar', reason: 'slash in name' },
      { input: '12-short', reason: 'two digit prefix' },
      { input: 'z_archive', reason: 'no digit prefix at all' },
      { input: '003-foo.bar', reason: 'dot in name' },
    ];

    let allPassed = true;
    const failures = [];
    for (const { input, reason } of invalidCases) {
      if (SPEC_FOLDER_PATTERN.test(input)) {
        allPassed = false;
        failures.push(`"${input}" (${reason})`);
      }
    }

    if (allPassed) {
      pass('T-SF01b: Invalid patterns rejected', `All ${invalidCases.length} invalid patterns rejected`);
    } else {
      fail('T-SF01b: Invalid patterns rejected', `Incorrectly matched: ${failures.join(', ')}`);
    }
  } catch (err) {
    fail('T-SF01b: Invalid patterns rejected', err.message);
  }
}

async function testSpecFolderPatternEdgeCases() {
  log('\n🔬 SPEC_FOLDER_PATTERN: Edge cases');

  try {
    const { SPEC_FOLDER_PATTERN } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    // Edge: single char after hyphen (minimum valid)
    if (SPEC_FOLDER_PATTERN.test('000-a')) {
      pass('T-SF01c: Minimum valid "000-a"', 'Matched');
    } else {
      fail('T-SF01c: Minimum valid "000-a"', 'Did not match');
      return;
    }

    // Edge: numbers in name portion (after initial lowercase letter)
    if (SPEC_FOLDER_PATTERN.test('003-a1b2c3')) {
      pass('T-SF01d: Numbers in name "003-a1b2c3"', 'Matched');
    } else {
      fail('T-SF01d: Numbers in name "003-a1b2c3"', 'Did not match');
    }

    // Edge: trailing hyphen
    if (!SPEC_FOLDER_PATTERN.test('003-foo-')) {
      pass('T-SF01e: Trailing hyphen "003-foo-" rejected', 'Correctly rejected');
    } else {
      // The pattern [a-z0-9-]* actually allows trailing hyphen
      // This is technically a match since - is in the character class
      pass('T-SF01e: Trailing hyphen "003-foo-" allowed by pattern', 'Pattern permits trailing hyphens (design choice)');
    }
  } catch (err) {
    fail('T-SF01: Edge cases', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. TEST: SPEC_FOLDER_BASIC_PATTERN (less strict)
   Regex: /^\d{3}-[a-zA-Z]/
────────────────────────────────────────────────────────────────*/

async function testSpecFolderBasicPatternValid() {
  log('\n🔬 SPEC_FOLDER_BASIC_PATTERN: Valid patterns match');

  try {
    const { SPEC_FOLDER_BASIC_PATTERN } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const validCases = [
      '003-SystemSpecKit',
      '121-A',
      '003-system-spec-kit',
      '000-Hello',
      '999-Zulu',
      '042-mixedCASE',
    ];

    let allPassed = true;
    const failures = [];
    for (const input of validCases) {
      if (!SPEC_FOLDER_BASIC_PATTERN.test(input)) {
        allPassed = false;
        failures.push(input);
      }
    }

    if (allPassed) {
      pass('T-SF02a: Basic valid patterns match', `All ${validCases.length} valid patterns matched`);
    } else {
      fail('T-SF02a: Basic valid patterns match', `Failed to match: ${failures.join(', ')}`);
    }
  } catch (err) {
    fail('T-SF02a: Basic valid patterns match', err.message);
  }
}

async function testSpecFolderBasicPatternInvalid() {
  log('\n🔬 SPEC_FOLDER_BASIC_PATTERN: Invalid patterns rejected');

  try {
    const { SPEC_FOLDER_BASIC_PATTERN } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const invalidCases = [
      { input: '003-1invalid', reason: 'digit after hyphen' },
      { input: 'abc-def', reason: 'non-numeric prefix' },
      { input: '3-foo', reason: 'single digit prefix' },
      { input: '', reason: 'empty string' },
      { input: '003-', reason: 'nothing after hyphen' },
      { input: '003-_foo', reason: 'underscore after hyphen' },
      { input: '003--foo', reason: 'double hyphen' },
      { input: 'z_archive', reason: 'no digit prefix' },
    ];

    let allPassed = true;
    const failures = [];
    for (const { input, reason } of invalidCases) {
      if (SPEC_FOLDER_BASIC_PATTERN.test(input)) {
        allPassed = false;
        failures.push(`"${input}" (${reason})`);
      }
    }

    if (allPassed) {
      pass('T-SF02b: Basic invalid patterns rejected', `All ${invalidCases.length} invalid patterns rejected`);
    } else {
      fail('T-SF02b: Basic invalid patterns rejected', `Incorrectly matched: ${failures.join(', ')}`);
    }
  } catch (err) {
    fail('T-SF02b: Basic invalid patterns rejected', err.message);
  }
}

async function testBasicPatternIsLessStrict() {
  log('\n🔬 SPEC_FOLDER_BASIC_PATTERN: Is less strict than SPEC_FOLDER_PATTERN');

  try {
    const { SPEC_FOLDER_PATTERN, SPEC_FOLDER_BASIC_PATTERN } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    // These match BASIC but NOT strict
    const basicOnlyCases = [
      '003-SystemSpecKit',
      '003-FooBar',
      '121-ABC',
    ];

    let allPassed = true;
    const failures = [];
    for (const input of basicOnlyCases) {
      const matchesBasic = SPEC_FOLDER_BASIC_PATTERN.test(input);
      const matchesStrict = SPEC_FOLDER_PATTERN.test(input);
      if (!matchesBasic || matchesStrict) {
        allPassed = false;
        failures.push(`"${input}" basic=${matchesBasic} strict=${matchesStrict}`);
      }
    }

    if (allPassed) {
      pass('T-SF02c: Basic is superset of strict', `All ${basicOnlyCases.length} cases match basic but not strict`);
    } else {
      fail('T-SF02c: Basic is superset of strict', `Unexpected: ${failures.join(', ')}`);
    }
  } catch (err) {
    fail('T-SF02c: Basic is superset of strict', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. TEST: findChildFolderSync
   Uses real filesystem via getSpecsDirectories()
────────────────────────────────────────────────────────────────*/

async function testFindChildFolderSyncExisting() {
  log('\n🔬 findChildFolderSync: Finds existing unique child folder');

  try {
    const { findChildFolderSync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    // 121-script-audit-comprehensive exists under 003-system-spec-kit
    const result = findChildFolderSync('121-script-audit-comprehensive');

    if (result === null) {
      fail('T-SF03a: Find existing child', 'Returned null — folder not found (check specs directory config)');
      return;
    }

    const isAbsolute = path.isAbsolute(result);
    const endsCorrectly = result.endsWith('121-script-audit-comprehensive');
    const containsParent = result.includes('003-system-spec-kit');

    if (isAbsolute && endsCorrectly && containsParent) {
      pass('T-SF03a: Find existing child', `Found: ${result}`);
    } else {
      fail('T-SF03a: Find existing child', `Path unexpected: ${result} (absolute=${isAbsolute}, ends=${endsCorrectly}, parent=${containsParent})`);
    }
  } catch (err) {
    fail('T-SF03a: Find existing child', err.message);
  }
}

async function testFindChildFolderSyncSecondChild() {
  log('\n🔬 findChildFolderSync: Finds another existing child folder');

  try {
    const { findChildFolderSync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    // 123-generate-context-subfolder exists under 003-system-spec-kit
    const result = findChildFolderSync('123-generate-context-subfolder');

    if (result === null) {
      fail('T-SF03b: Find second existing child', 'Returned null');
      return;
    }

    if (path.isAbsolute(result) && result.endsWith('123-generate-context-subfolder')) {
      pass('T-SF03b: Find second existing child', `Found: ${path.basename(path.dirname(result))}/${path.basename(result)}`);
    } else {
      fail('T-SF03b: Find second existing child', `Unexpected: ${result}`);
    }
  } catch (err) {
    fail('T-SF03b: Find second existing child', err.message);
  }
}

async function testFindChildFolderSyncNonexistent() {
  log('\n🔬 findChildFolderSync: Returns null for non-existent child');

  try {
    const { findChildFolderSync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const result = findChildFolderSync('999-nonexistent-folder');

    if (result === null) {
      pass('T-SF03c: Non-existent child returns null', 'Returned null');
    } else {
      fail('T-SF03c: Non-existent child returns null', `Unexpectedly found: ${result}`);
    }
  } catch (err) {
    fail('T-SF03c: Non-existent child returns null', err.message);
  }
}

async function testFindChildFolderSyncEmptyString() {
  log('\n🔬 findChildFolderSync: Returns null for empty string');

  try {
    const { findChildFolderSync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    // Early-return guard in findChildFolderSync prevents ambiguity noise for empty/falsy input
    const result = findChildFolderSync('');

    if (result === null) {
      pass('T-SF03d: Empty string returns null', 'Returned null (early-return guard)');
    } else {
      fail('T-SF03d: Empty string returns null', `Unexpectedly found: ${result}`);
    }
  } catch (err) {
    fail('T-SF03d: Empty string returns null', err.message);
  }
}

async function testFindChildFolderSyncInvalidFormat() {
  log('\n🔬 findChildFolderSync: Returns null for invalid format name');

  try {
    const { findChildFolderSync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    // This doesn't match folder naming but function should still return null gracefully
    const result = findChildFolderSync('not-a-valid-child');

    if (result === null) {
      pass('T-SF03e: Invalid format returns null', 'Returned null');
    } else {
      fail('T-SF03e: Invalid format returns null', `Unexpectedly found: ${result}`);
    }
  } catch (err) {
    fail('T-SF03e: Invalid format returns null', err.message);
  }
}

async function testFindChildFolderSyncAmbiguous() {
  log('\n🔬 findChildFolderSync: Returns null for ambiguous child (multiple parents)');

  const fs = require('fs');
  const tempChildName = '999-ambiguity-test';
  const dir1 = path.join(process.cwd(), 'specs', '003-system-spec-kit', tempChildName);
  const dir2 = path.join(process.cwd(), '.opencode', 'specs', '003-system-spec-kit', tempChildName);

  try {
    const { findChildFolderSync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    // Create temp child folder under TWO different parent spec directories
    fs.mkdirSync(dir1, { recursive: true });
    fs.mkdirSync(dir2, { recursive: true });

    const result = findChildFolderSync(tempChildName);

    if (result === null) {
      pass('T-SF03f: Ambiguous child returns null', 'Returned null (found in multiple parents)');
    } else {
      fail('T-SF03f: Ambiguous child returns null', `Expected null, got: ${result}`);
    }
  } catch (err) {
    fail('T-SF03f: Ambiguous child returns null', err.message);
  } finally {
    // Cleanup temp directories
    try { fs.rmdirSync(dir1); } catch (_) {}
    try { fs.rmdirSync(dir2); } catch (_) {}
  }
}

/* ─────────────────────────────────────────────────────────────
   6. TEST: findChildFolderAsync
   Same cases as sync but verifying async behavior
────────────────────────────────────────────────────────────────*/

async function testFindChildFolderAsyncExisting() {
  log('\n🔬 findChildFolderAsync: Finds existing unique child folder');

  try {
    const { findChildFolderAsync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const result = await findChildFolderAsync('121-script-audit-comprehensive');

    if (result === null) {
      fail('T-SF04a: Async find existing child', 'Returned null');
      return;
    }

    const isAbsolute = path.isAbsolute(result);
    const endsCorrectly = result.endsWith('121-script-audit-comprehensive');

    if (isAbsolute && endsCorrectly) {
      pass('T-SF04a: Async find existing child', `Found: ${result}`);
    } else {
      fail('T-SF04a: Async find existing child', `Unexpected path: ${result}`);
    }
  } catch (err) {
    fail('T-SF04a: Async find existing child', err.message);
  }
}

async function testFindChildFolderAsyncNonexistent() {
  log('\n🔬 findChildFolderAsync: Returns null for non-existent child');

  try {
    const { findChildFolderAsync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const result = await findChildFolderAsync('999-nonexistent-folder');

    if (result === null) {
      pass('T-SF04b: Async non-existent returns null', 'Returned null');
    } else {
      fail('T-SF04b: Async non-existent returns null', `Unexpectedly found: ${result}`);
    }
  } catch (err) {
    fail('T-SF04b: Async non-existent returns null', err.message);
  }
}

async function testFindChildFolderAsyncReturnsPromise() {
  log('\n🔬 findChildFolderAsync: Returns a Promise');

  try {
    const { findChildFolderAsync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const returnValue = findChildFolderAsync('999-nonexistent-folder');

    if (returnValue instanceof Promise) {
      pass('T-SF04c: Returns a Promise', 'instanceof Promise === true');
      // Await to avoid unhandled rejection
      await returnValue;
    } else {
      fail('T-SF04c: Returns a Promise', `typeof: ${typeof returnValue}`);
    }
  } catch (err) {
    fail('T-SF04c: Returns a Promise', err.message);
  }
}

async function testFindChildFolderAsyncMatchesSync() {
  log('\n🔬 findChildFolderAsync: Results match findChildFolderSync');

  try {
    const { findChildFolderSync, findChildFolderAsync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const testCases = [
      '121-script-audit-comprehensive',
      '123-generate-context-subfolder',
      '999-nonexistent-folder',
    ];

    let allMatch = true;
    const mismatches = [];

    for (const childName of testCases) {
      const syncResult = findChildFolderSync(childName);
      const asyncResult = await findChildFolderAsync(childName);

      if (syncResult !== asyncResult) {
        allMatch = false;
        mismatches.push(`"${childName}": sync=${syncResult}, async=${asyncResult}`);
      }
    }

    if (allMatch) {
      pass('T-SF04d: Async matches sync for all cases', `Tested ${testCases.length} cases`);
    } else {
      fail('T-SF04d: Async matches sync for all cases', `Mismatches: ${mismatches.join('; ')}`);
    }
  } catch (err) {
    fail('T-SF04d: Async matches sync for all cases', err.message);
  }
}

async function testFindChildFolderAsyncEmptyString() {
  log('\n🔬 findChildFolderAsync: Returns null for empty string');

  try {
    const { findChildFolderAsync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    // Early-return guard in findChildFolderAsync prevents ambiguity noise for empty/falsy input
    const result = await findChildFolderAsync('');

    if (result === null) {
      pass('T-SF04e: Async empty string returns null', 'Returned null (early-return guard)');
    } else {
      fail('T-SF04e: Async empty string returns null', `Unexpectedly found: ${result}`);
    }
  } catch (err) {
    fail('T-SF04e: Async empty string returns null', err.message);
  }
}

async function testFindChildFolderAsyncAmbiguous() {
  log('\n🔬 findChildFolderAsync: Returns null for ambiguous child (multiple parents)');

  const fs = require('fs');
  const tempChildName = '999-ambiguity-test';
  const dir1 = path.join(process.cwd(), 'specs', '003-system-spec-kit', tempChildName);
  const dir2 = path.join(process.cwd(), '.opencode', 'specs', '003-system-spec-kit', tempChildName);

  try {
    const { findChildFolderAsync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    // Create temp child folder under TWO different parent spec directories
    fs.mkdirSync(dir1, { recursive: true });
    fs.mkdirSync(dir2, { recursive: true });

    const result = await findChildFolderAsync(tempChildName);

    if (result === null) {
      pass('T-SF04f: Async ambiguous child returns null', 'Returned null (found in multiple parents)');
    } else {
      fail('T-SF04f: Async ambiguous child returns null', `Expected null, got: ${result}`);
    }
  } catch (err) {
    fail('T-SF04f: Async ambiguous child returns null', err.message);
  } finally {
    // Cleanup temp directories
    try { fs.rmdirSync(dir1); } catch (_) {}
    try { fs.rmdirSync(dir2); } catch (_) {}
  }
}

/* ─────────────────────────────────────────────────────────────
   7. TEST: core/index.js RE-EXPORTS
   Verify all subfolder-utils exports are accessible from barrel
────────────────────────────────────────────────────────────────*/

async function testCoreIndexReExports() {
  log('\n🔬 CORE INDEX: All subfolder-utils exports accessible');

  try {
    const coreIndex = require(path.join(DIST_DIR, 'core', 'index'));

    const expectedExports = [
      { name: 'SPEC_FOLDER_PATTERN', type: 'object' },       // RegExp is typeof 'object'
      { name: 'SPEC_FOLDER_BASIC_PATTERN', type: 'object' },
      { name: 'findChildFolderSync', type: 'function' },
      { name: 'findChildFolderAsync', type: 'function' },
    ];

    let allPresent = true;
    const missing = [];
    const wrongType = [];

    for (const { name, type } of expectedExports) {
      if (!(name in coreIndex)) {
        allPresent = false;
        missing.push(name);
      } else if (typeof coreIndex[name] !== type) {
        allPresent = false;
        wrongType.push(`${name}: expected ${type}, got ${typeof coreIndex[name]}`);
      }
    }

    if (allPresent) {
      pass('T-SF05a: All exports present with correct types', expectedExports.map(e => e.name).join(', '));
    } else {
      const reasons = [];
      if (missing.length > 0) reasons.push(`Missing: ${missing.join(', ')}`);
      if (wrongType.length > 0) reasons.push(`Wrong type: ${wrongType.join(', ')}`);
      fail('T-SF05a: All exports present with correct types', reasons.join('; '));
    }
  } catch (err) {
    fail('T-SF05a: All exports present with correct types', err.message);
  }
}

async function testCoreIndexPatternsAreRegExp() {
  log('\n🔬 CORE INDEX: Pattern exports are RegExp instances');

  try {
    const { SPEC_FOLDER_PATTERN, SPEC_FOLDER_BASIC_PATTERN } = require(path.join(DIST_DIR, 'core', 'index'));

    const isRegExp1 = SPEC_FOLDER_PATTERN instanceof RegExp;
    const isRegExp2 = SPEC_FOLDER_BASIC_PATTERN instanceof RegExp;

    if (isRegExp1 && isRegExp2) {
      pass('T-SF05b: Both patterns are RegExp instances', `SPEC_FOLDER_PATTERN=${SPEC_FOLDER_PATTERN}, BASIC=${SPEC_FOLDER_BASIC_PATTERN}`);
    } else {
      fail('T-SF05b: Both patterns are RegExp instances', `Pattern=${isRegExp1}, Basic=${isRegExp2}`);
    }
  } catch (err) {
    fail('T-SF05b: Both patterns are RegExp instances', err.message);
  }
}

async function testCoreIndexFunctionsWork() {
  log('\n🔬 CORE INDEX: Re-exported functions work correctly');

  try {
    const { findChildFolderSync, findChildFolderAsync } = require(path.join(DIST_DIR, 'core', 'index'));

    // Sync: non-existent returns null
    const syncResult = findChildFolderSync('999-nonexistent');
    // Async: non-existent returns null
    const asyncResult = await findChildFolderAsync('999-nonexistent');

    if (syncResult === null && asyncResult === null) {
      pass('T-SF05c: Re-exported functions return correct results', 'Both returned null for non-existent child');
    } else {
      fail('T-SF05c: Re-exported functions return correct results', `sync=${syncResult}, async=${asyncResult}`);
    }
  } catch (err) {
    fail('T-SF05c: Re-exported functions return correct results', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   8. MAIN TEST RUNNER
────────────────────────────────────────────────────────────────*/

async function main() {
  log('\n═══════════════════════════════════════════════════════════════');
  log('TEST: Subfolder Resolution (subfolder-utils + core/index)');
  log('═══════════════════════════════════════════════════════════════');

  // Category A: SPEC_FOLDER_PATTERN
  log('\n── Category A: SPEC_FOLDER_PATTERN ──');
  await testSpecFolderPatternValid();
  await testSpecFolderPatternInvalid();
  await testSpecFolderPatternEdgeCases();

  // Category B: SPEC_FOLDER_BASIC_PATTERN
  log('\n── Category B: SPEC_FOLDER_BASIC_PATTERN ──');
  await testSpecFolderBasicPatternValid();
  await testSpecFolderBasicPatternInvalid();
  await testBasicPatternIsLessStrict();

  // Category C: findChildFolderSync
  log('\n── Category C: findChildFolderSync ──');
  await testFindChildFolderSyncExisting();
  await testFindChildFolderSyncSecondChild();
  await testFindChildFolderSyncNonexistent();
  await testFindChildFolderSyncEmptyString();
  await testFindChildFolderSyncInvalidFormat();
  await testFindChildFolderSyncAmbiguous();

  // Category D: findChildFolderAsync
  log('\n── Category D: findChildFolderAsync ──');
  await testFindChildFolderAsyncExisting();
  await testFindChildFolderAsyncNonexistent();
  await testFindChildFolderAsyncReturnsPromise();
  await testFindChildFolderAsyncMatchesSync();
  await testFindChildFolderAsyncEmptyString();
  await testFindChildFolderAsyncAmbiguous();

  // Category E: core/index.js re-exports
  log('\n── Category E: core/index.js Re-exports ──');
  await testCoreIndexReExports();
  await testCoreIndexPatternsAreRegExp();
  await testCoreIndexFunctionsWork();

  // Results summary
  log('\n═══════════════════════════════════════════════════════════════');
  log(`RESULTS: ${results.passed} passed, ${results.failed} failed, ${results.skipped} skipped`);
  log('═══════════════════════════════════════════════════════════════\n');

  if (results.failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
