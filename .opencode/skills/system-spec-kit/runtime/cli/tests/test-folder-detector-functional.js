// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Folder Detector Functional Tests                              ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Validate priority-chain and candidate-ranking behavior in       ║
// ║          detectSpecFolder()                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const path = require('path');
const __dirname = path.dirname(__filename);
const fs = require('fs');
const os = require('os');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────
*/

const SCRIPTS_DIR = path.join(__dirname, '..', 'dist');
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..', '..'); // actual project root
const PRIORITY_COMPARISON_OFFSET_MS = 60000;
const ONE_SECOND_MS = 1000;
const MTIME_SMALL_SKEW_MS = 300000;
const MTIME_LARGE_SKEW_MS = 1000000;

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
};

// A skip is only legitimate when it is caused by something about the machine or
// checkout this run happens to execute on, not by a defect this suite should be
// catching. Anything outside this list previously vanished as a silent skip,
// which let the whole file exit green while testing nothing — enforce the
// distinction here instead of trusting each call site to self-police it.
const DOCUMENTED_SKIP_REASONS = [
  'No specs directory found',
  'No spec folders exist',
  'No specs directories available',
  'Alignment prompt requires interactive confirmation',
];

/* ─────────────────────────────────────────────────────────────
   2. TEST UTILITIES
────────────────────────────────────────────────────────────────
*/

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
  const isDocumentedEnvironmentCondition = DOCUMENTED_SKIP_REASONS.some((allowed) => reason.startsWith(allowed));
  if (!isDocumentedEnvironmentCondition) {
    fail(testName, `Skip reason is not a documented environment condition, so it counts as a failure: ${reason}`);
    return;
  }
  results.skipped++;
  results.tests.push({ name: testName, status: 'SKIP', reason });
  log(`   ⏭️  ${testName} (skipped: ${reason})`);
}

// Spec folders live one level under a category/track directory (e.g.
// `system-spec-kit/049-memory-decommission`), not directly under the specs
// root. Returns the first numbered folder found, preferring a top-level match
// for backward compatibility, or null when the checkout truly has none.
function discoverSampleSpecFolder(specsDir) {
  const topEntries = fs.readdirSync(specsDir, { withFileTypes: true });

  const topLevelMatch = topEntries.find((entry) => entry.isDirectory() && /^\d{3}-/.test(entry.name));
  if (topLevelMatch) {
    return topLevelMatch.name;
  }

  for (const entry of topEntries) {
    if (!entry.isDirectory()) continue;
    const trackPath = path.join(specsDir, entry.name);
    let children;
    try {
      children = fs.readdirSync(trackPath, { withFileTypes: true });
    } catch (_err) {
      continue;
    }
    const childMatch = children.find((child) => child.isDirectory() && /^\d{3}-/.test(child.name));
    if (childMatch) {
      return path.join(entry.name, childMatch.name);
    }
  }

  return null;
}

/* ─────────────────────────────────────────────────────────────
   3. TEST: PRIORITY CHAIN INTEGRATION
   Verify that Priority 1 (CLI arg) and Priority 2 (JSON data) each
   short-circuit before automatic detection runs.
────────────────────────────────────────────────────────────────
*/

async function testPriority1OverridesAll() {
  log('\n🔬 PRIORITY CHAIN: Priority 1 (CLI arg) overrides automatic detection');

  try {
    // CONFIG is a mutable object. We can temporarily set SPEC_FOLDER_ARG.
    const { CONFIG, findActiveSpecsDir } = require(path.join(SCRIPTS_DIR, 'core'));
    const { detectSpecFolder } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));

    const specsDir = findActiveSpecsDir();
    if (!specsDir) {
      skip('T-FD05a: Priority 1 overrides automatic detection', 'No specs directory found');
      return;
    }

    // Find an existing spec folder to use as CLI arg (nested one level under its category/track)
    const sampleSpecFolder = discoverSampleSpecFolder(specsDir);
    if (!sampleSpecFolder) {
      skip('T-FD05a: Priority 1 overrides automatic detection', 'No spec folders exist');
      return;
    }

    const originalArg = CONFIG.SPEC_FOLDER_ARG;
    try {
      // Set CLI arg to a known existing folder
      CONFIG.SPEC_FOLDER_ARG = sampleSpecFolder;
      const result = await detectSpecFolder(null);

      if (result.endsWith(sampleSpecFolder)) {
        pass('T-FD05a: Priority 1 overrides automatic detection', `CLI arg "${sampleSpecFolder}" → result ends with it`);
      } else {
        fail('T-FD05a: Priority 1 overrides automatic detection', `Expected path ending with "${sampleSpecFolder}", got: ${result}`);
      }
    } finally {
      // Restore original value
      CONFIG.SPEC_FOLDER_ARG = originalArg;
    }
  } catch (err) {
    fail('T-FD05a: Priority 1 overrides automatic detection', err.message);
  }
}

async function testPriority2OverridesDb() {
  log('\n🔬 PRIORITY CHAIN: Priority 2 (JSON data) overrides automatic detection');

  try {
    const { CONFIG, findActiveSpecsDir } = require(path.join(SCRIPTS_DIR, 'core'));
    const { detectSpecFolder } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));

    const specsDir = findActiveSpecsDir();
    if (!specsDir) {
      skip('T-FD05b: Priority 2 overrides automatic detection', 'No specs directory found');
      return;
    }

    // Find an existing spec folder (nested one level under its category/track)
    const sampleSpecFolder = discoverSampleSpecFolder(specsDir);
    if (!sampleSpecFolder) {
      skip('T-FD05b: Priority 2 overrides automatic detection', 'No spec folders exist');
      return;
    }

    const originalArg = CONFIG.SPEC_FOLDER_ARG;
    try {
      // Ensure no CLI arg
      CONFIG.SPEC_FOLDER_ARG = null;

      // Call with collectedData containing SPEC_FOLDER
      // The alignment validator may interfere, so we pass minimal data
      const collectedData = {
        SPEC_FOLDER: sampleSpecFolder,
        userPrompts: [],
        observations: [],
        recentContext: [],
      };

      const result = await detectSpecFolder(collectedData);

      if (result.endsWith(sampleSpecFolder)) {
        pass('T-FD05b: Priority 2 overrides automatic detection', `Data SPEC_FOLDER "${sampleSpecFolder}" → result ends with it`);
      } else {
        // Not an environment condition — the alignment validator redirected away from the
        // JSON-provided folder, so Priority 2 did not actually win as this check requires.
        fail('T-FD05b: Priority 2 overrides automatic detection',
          `Alignment redirected from "${sampleSpecFolder}" to "${path.basename(result)}" instead of honoring the JSON-provided SPEC_FOLDER`);
      }
    } finally {
      CONFIG.SPEC_FOLDER_ARG = originalArg;
    }
  } catch (err) {
    // Alignment prompts can interrupt this non-interactive test environment.
    if (err.message.includes('retry attempts') || err.message.includes('stdin')) {
      skip('T-FD05b: Priority 2 overrides automatic detection', 'Alignment prompt requires interactive confirmation');
    } else {
      fail('T-FD05b: Priority 2 overrides automatic detection', err.message);
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   4. TEST: filterArchiveFolders EDGE CASES
────────────────────────────────────────────────────────────────
*/

async function testFilterArchiveFoldersEdgeCases() {
  log('\n🔬 FILTER ARCHIVE: Edge cases for filterArchiveFolders');

  try {
    const { filterArchiveFolders, ALIGNMENT_CONFIG } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));

    // Test 1: Empty array input
    const emptyResult = filterArchiveFolders([]);
    if (Array.isArray(emptyResult) && emptyResult.length === 0) {
      pass('T-FD07a: Empty array returns empty', 'Length: 0');
    } else {
      fail('T-FD07a: Empty array returns empty', `Got length: ${emptyResult.length}`);
    }

    // Test 2: No archive folders — all pass through
    const noArchive = ['001-feature', '002-bugfix', '003-refactor'];
    const noArchiveResult = filterArchiveFolders(noArchive);
    if (noArchiveResult.length === 3) {
      pass('T-FD07b: Non-archive folders all pass through', `All 3 retained`);
    } else {
      fail('T-FD07b: Non-archive folders all pass through', `Got ${noArchiveResult.length}`);
    }

    // Test 3: Mixed case archive detection
    const mixedCase = ['001-feature', 'Z_ARCHIVE', '002-other'];
    const mixedResult = filterArchiveFolders(mixedCase);
    // The filter lowercases and checks against ARCHIVE_PATTERNS
    if (!mixedResult.includes('Z_ARCHIVE') && mixedResult.length === 2) {
      pass('T-FD07c: Case-insensitive archive detection', 'Z_ARCHIVE removed');
    } else {
      fail('T-FD07c: Case-insensitive archive detection', `Result: ${mixedResult.join(', ')}`);
    }

    // Test 4: All folders are archives
    const allArchive = ALIGNMENT_CONFIG.ARCHIVE_PATTERNS.map((p, i) => `${String(i).padStart(3, '0')}-${p}-stuff`);
    const allArchiveResult = filterArchiveFolders(allArchive);
    if (allArchiveResult.length === 0) {
      pass('T-FD07d: All archive folders removed', 'Empty result');
    } else {
      fail('T-FD07d: All archive folders removed', `${allArchiveResult.length} remaining: ${allArchiveResult.join(', ')}`);
    }

    // Test 5: Verify ARCHIVE_PATTERNS contains expected patterns
    const expectedPatterns = ['archive', 'z_'];
    const hasExpected = expectedPatterns.every(p =>
      ALIGNMENT_CONFIG.ARCHIVE_PATTERNS.some(ap => ap.includes(p))
    );
    if (hasExpected) {
      pass('T-FD07e: ARCHIVE_PATTERNS has expected patterns', ALIGNMENT_CONFIG.ARCHIVE_PATTERNS.join(', '));
    } else {
      fail('T-FD07e: ARCHIVE_PATTERNS has expected patterns',
        `Missing expected. Actual: ${ALIGNMENT_CONFIG.ARCHIVE_PATTERNS.join(', ')}`);
    }
  } catch (err) {
    fail('T-FD07: filterArchiveFolders edge cases', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. TEST: NEW REGRESSION MATRIX (SESSION SELECTION BUG)
────────────────────────────────────────────────────────────────
*/

async function testArchiveCandidateExcludedWhenActiveExists() {
  log('\n🔬 REGRESSION: Active candidate preferred over archived candidate');

  try {
    const { TEST_HELPERS } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));
    if (!TEST_HELPERS || typeof TEST_HELPERS.rankSessionCandidates !== 'function') {
      fail('T-FD09a: Active beats archive candidate', 'TEST_HELPERS.rankSessionCandidates not available');
      return;
    }

    const now = Date.now();
    const ranked = TEST_HELPERS.rankSessionCandidates([
      { path: 'specs/999-z_archive-session-selection', recencyMs: now + PRIORITY_COMPARISON_OFFSET_MS },
      { path: '.opencode/specs/139-hybrid-rag-fusion/005-auto-detected-session-bug', recencyMs: now }
    ]);

    const expectedTop = '.opencode/specs/139-hybrid-rag-fusion/005-auto-detected-session-bug';
    if (
      ranked.length > 0 &&
      ranked[0].path === expectedTop &&
      ranked[0].quality &&
      ranked[0].quality.label === 'active'
    ) {
      pass('T-FD09a: Active beats archive candidate',
        `Top=${ranked[0].path} quality=${ranked[0].quality.label}`);
    } else {
      fail('T-FD09a: Active beats archive candidate', `Ranking result: ${JSON.stringify(ranked[0])}`);
    }
  } catch (err) {
    fail('T-FD09a: Active beats archive candidate', err.message);
  }
}

async function testAliasNormalizationDeterminism() {
  log('\n🔬 REGRESSION: Alias normalization deterministic between specs roots');

  try {
    const { TEST_HELPERS } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));
    if (!TEST_HELPERS || typeof TEST_HELPERS.normalizeSpecReferenceForLookup !== 'function') {
      fail('T-FD09b: Alias normalization deterministic', 'normalizeSpecReferenceForLookup not available');
      return;
    }

    const variants = [
      'specs/system-spec-kit/022-hybrid-rag-fusion',
      '.opencode/specs/system-spec-kit/022-hybrid-rag-fusion',
      'specs\\system-spec-kit\\022-hybrid-rag-fusion',
      'system-spec-kit/022-hybrid-rag-fusion'
    ];

    const normalized = variants.map((v) => TEST_HELPERS.normalizeSpecReferenceForLookup(v));
    const unique = Array.from(new Set(normalized));

    if (unique.length === 1 && unique[0] === 'system-spec-kit/022-hybrid-rag-fusion') {
      pass('T-FD09b: Alias normalization deterministic', `Canonical=${unique[0]}`);
    } else {
      fail('T-FD09b: Alias normalization deterministic',
        `Expected one canonical value, got: ${JSON.stringify(unique)}`);
    }
  } catch (err) {
    fail('T-FD09b: Alias normalization deterministic', err.message);
  }
}

async function testRankingResistsMtimeSkew() {
  log('\n🔬 REGRESSION: Ranking resists raw mtime skew');

  try {
    const { TEST_HELPERS } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));
    if (!TEST_HELPERS || typeof TEST_HELPERS.rankAutoDetectCandidates !== 'function') {
      fail('T-FD09c: Ranking resists mtime skew', 'rankAutoDetectCandidates not available');
      return;
    }

    const now = Date.now();
    const rankedByQuality = TEST_HELPERS.rankAutoDetectCandidates([
      {
        path: '/tmp/older-active',
        relativePath: '139-hybrid-rag-fusion/005-auto-detected-session-bug',
        mtimeMs: now - MTIME_SMALL_SKEW_MS
      },
      {
        path: '/tmp/newer-archive',
        relativePath: '999-z_archive-session-selection',
        mtimeMs: now + MTIME_SMALL_SKEW_MS
      }
    ]);

    const rankedByStableId = TEST_HELPERS.rankAutoDetectCandidates([
      {
        path: '/tmp/high-id-older',
        relativePath: '220-high-id-parent/010-phase',
        mtimeMs: now - MTIME_LARGE_SKEW_MS
      },
      {
        path: '/tmp/low-id-newer',
        relativePath: '219-low-id-parent/999-phase',
        mtimeMs: now + MTIME_LARGE_SKEW_MS
      }
    ]);

    const qualityPass = rankedByQuality.length > 0 &&
      rankedByQuality[0].relativePath === '139-hybrid-rag-fusion/005-auto-detected-session-bug';
    const idPass = rankedByStableId.length > 0 &&
      rankedByStableId[0].relativePath === '220-high-id-parent/010-phase';

    if (qualityPass && idPass) {
      pass('T-FD09c: Ranking resists mtime skew',
        `Top quality=${rankedByQuality[0].relativePath}; Top id=${rankedByStableId[0].relativePath}`);
    } else {
      fail('T-FD09c: Ranking resists mtime skew',
        `qualityTop=${rankedByQuality[0] ? rankedByQuality[0].relativePath : 'none'}, idTop=${rankedByStableId[0] ? rankedByStableId[0].relativePath : 'none'}`);
    }
  } catch (err) {
    fail('T-FD09c: Ranking resists mtime skew', err.message);
  }
}

async function testLowConfidenceConfirmationAndFallbackContract() {
  log('\n🔬 REGRESSION: Low-confidence confirmation/fallback contract');

  try {
    const { TEST_HELPERS } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));
    if (!TEST_HELPERS ||
        typeof TEST_HELPERS.decideSessionAction !== 'function' ||
        typeof TEST_HELPERS.decideAutoDetectAction !== 'function') {
      fail('T-FD09d: Low-confidence contract', 'decision helpers not available');
      return;
    }

    const now = Date.now();
    const ambiguousSessionInputs = [
      { path: 'specs/120-active-session-a', recencyMs: now },
      { path: '.opencode/specs/121-active-session-b', recencyMs: now + ONE_SECOND_MS }
    ];
    const ambiguousAutoInputs = [
      { path: '/tmp/a', relativePath: '300-parent/001-phase-a', mtimeMs: now },
      { path: '/tmp/b', relativePath: '300-parent/001-phase-b', mtimeMs: now + ONE_SECOND_MS }
    ];

    const sessionInteractive = TEST_HELPERS.decideSessionAction(ambiguousSessionInputs, true);
    const sessionNonInteractive = TEST_HELPERS.decideSessionAction(ambiguousSessionInputs, false);
    const autoInteractive = TEST_HELPERS.decideAutoDetectAction(ambiguousAutoInputs, true);
    const autoNonInteractive = TEST_HELPERS.decideAutoDetectAction(ambiguousAutoInputs, false);

    const contractPass =
      sessionInteractive.action === 'confirm' &&
      sessionNonInteractive.action === 'skip' &&
      autoInteractive.action === 'confirm' &&
      autoNonInteractive.action === 'fallback';

    if (contractPass) {
      pass('T-FD09d: Low-confidence contract',
        `session=[${sessionInteractive.action}/${sessionNonInteractive.action}] auto=[${autoInteractive.action}/${autoNonInteractive.action}]`);
    } else {
      fail('T-FD09d: Low-confidence contract',
        `session=[${sessionInteractive.action}/${sessionNonInteractive.action}] auto=[${autoInteractive.action}/${autoNonInteractive.action}]`);
    }
  } catch (err) {
    fail('T-FD09d: Low-confidence contract', err.message);
  }
}

async function testCategoryRootedBareChildResolvesFromSessionPaths() {
  log('\n🔬 REGRESSION: Bare child resolves from category-rooted parent cache');

  const { getSpecsDirectories } = require(path.join(SCRIPTS_DIR, 'core', 'config'));
  const specsDirs = getSpecsDirectories().filter(dir => fs.existsSync(dir));
  if (specsDirs.length === 0) {
    skip('T-FD09f: Category-rooted bare child resolution', 'No specs directories available');
    return;
  }

  const token = `${Date.now().toString(36)}-cr`;
  const categoryName = `02--detector-category-${token}`;
  const parentName = `997-detector-parent-${token}`;
  const childName = `996-detector-child-${token}`;
  const createdPath = path.join(specsDirs[0], categoryName, parentName, childName);

  try {
    fs.mkdirSync(createdPath, { recursive: true });
    const { TEST_HELPERS } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));

    const resolved = await TEST_HELPERS.resolveSessionSpecFolderPaths(childName, [specsDirs[0]]);
    if (resolved.includes(createdPath)) {
      pass('T-FD09f: Category-rooted bare child resolution', createdPath);
    } else {
      fail('T-FD09f: Category-rooted bare child resolution', `Resolved: ${JSON.stringify(resolved)}`);
    }
  } catch (err) {
    fail('T-FD09f: Category-rooted bare child resolution', err.message);
  } finally {
    try { fs.rmSync(path.join(specsDirs[0], categoryName), { recursive: true, force: true }); } catch (_) {}
  }
}

async function testCategoryRootedAutoDetectDiscovery() {
  log('\n🔬 REGRESSION: Auto-detect discovers category-rooted spec folders');

  const { getSpecsDirectories } = require(path.join(SCRIPTS_DIR, 'core', 'config'));
  const specsDirs = getSpecsDirectories().filter(dir => fs.existsSync(dir));
  if (specsDirs.length === 0) {
    skip('T-FD09g: Category-rooted auto-detect discovery', 'No specs directories available');
    return;
  }

  const token = `${Date.now().toString(36)}-ad`;
  const categoryName = `02--auto-category-${token}`;
  const parentName = `997-auto-parent-${token}`;
  const childName = `996-auto-child-${token}`;
  const categoryPath = path.join(specsDirs[0], categoryName);
  const parentPath = path.join(categoryPath, parentName);
  const childPath = path.join(parentPath, childName);

  try {
    fs.mkdirSync(childPath, { recursive: true });
    const { TEST_HELPERS } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));
    const candidates = await TEST_HELPERS.collectAutoDetectCandidates([specsDirs[0]]);
    const relativePaths = candidates.map((candidate) => candidate.relativePath);

    if (
      relativePaths.includes(`${categoryName}/${parentName}`) &&
      relativePaths.includes(`${categoryName}/${parentName}/${childName}`)
    ) {
      pass('T-FD09g: Category-rooted auto-detect discovery', relativePaths.filter((item) => item.includes(token)).join(', '));
    } else {
      fail('T-FD09g: Category-rooted auto-detect discovery', `Missing expected paths in ${JSON.stringify(relativePaths)}`);
    }
  } catch (err) {
    fail('T-FD09g: Category-rooted auto-detect discovery', err.message);
  } finally {
    try { fs.rmSync(categoryPath, { recursive: true, force: true }); } catch (_) {}
  }
}

async function testApprovedRootContainmentRejectsSymlinkEscape() {
  log('\n🔬 REGRESSION: Approved-root containment rejects symlink escapes');

  const { getSpecsDirectories } = require(path.join(SCRIPTS_DIR, 'core', 'config'));
  const specsDirs = getSpecsDirectories().filter(dir => fs.existsSync(dir));
  if (specsDirs.length === 0) {
    skip('T-FD09h: Canonical containment rejects symlink escape', 'No specs directories available');
    return;
  }

  const token = `${Date.now().toString(36)}-sl`;
  const outsideRoot = fs.mkdtempSync(path.join(os.tmpdir(), `folder-detector-outside-${token}-`));
  const escapedTarget = path.join(outsideRoot, `996-symlink-child-${token}`);
  const symlinkPath = path.join(specsDirs[0], `998-symlink-escape-${token}`);

  try {
    fs.mkdirSync(escapedTarget, { recursive: true });
    fs.symlinkSync(outsideRoot, symlinkPath, 'dir');
    const { TEST_HELPERS } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));
    const result = TEST_HELPERS.isUnderApprovedSpecsRoots(path.join(symlinkPath, path.basename(escapedTarget)));

    if (result === false) {
      pass('T-FD09h: Canonical containment rejects symlink escape', 'Symlinked path rejected outside approved roots');
    } else {
      fail('T-FD09h: Canonical containment rejects symlink escape', 'Symlinked path was incorrectly accepted');
    }
  } catch (err) {
    fail('T-FD09h: Canonical containment rejects symlink escape', err.message);
  } finally {
    try { fs.rmSync(symlinkPath, { recursive: true, force: true }); } catch (_) {}
    try { fs.rmSync(outsideRoot, { recursive: true, force: true }); } catch (_) {}
  }
}

/* ─────────────────────────────────────────────────────────────
   6. MAIN TEST RUNNER
────────────────────────────────────────────────────────────────
*/

async function main() {
  log('\n═══════════════════════════════════════════════════════════════');
  log('TEST: Folder Detector Functional Tests');
  log('═══════════════════════════════════════════════════════════════');

  // Category 1: Priority Chain Integration
  log('\n── Category 1: Priority Chain Integration ──\n');
  await testPriority1OverridesAll();
  await testPriority2OverridesDb();

  // Category 2: filterArchiveFolders Edge Cases
  log('\n── Category 2: filterArchiveFolders Edge Cases ──\n');
  await testFilterArchiveFoldersEdgeCases();

  // Category 3: Session-Selection Regressions
  log('\n── Category 3: Session-Selection Regressions ──\n');
  await testArchiveCandidateExcludedWhenActiveExists();
  await testAliasNormalizationDeterminism();
  await testRankingResistsMtimeSkew();
  await testLowConfidenceConfirmationAndFallbackContract();
  await testCategoryRootedBareChildResolvesFromSessionPaths();
  await testCategoryRootedAutoDetectDiscovery();
  await testApprovedRootContainmentRejectsSymlinkEscape();

  // Results summary
  log('\n═══════════════════════════════════════════════════════════════');
  log(`RESULTS: ${results.passed} passed, ${results.failed} failed, ${results.skipped} skipped`);
  log('═══════════════════════════════════════════════════════════════\n');

  const checksRan = results.passed + results.failed;
  if (checksRan === 0) {
    log('[folder-detector-functional] Every check skipped — zero checks ran, so this run proves nothing.');
    process.exit(1);
  }

  if (results.failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('[folder-detector-functional] Test runner fatal error:', err);
  process.exit(1);
});
