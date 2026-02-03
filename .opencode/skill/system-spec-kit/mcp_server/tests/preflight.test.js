// ───────────────────────────────────────────────────────────────
// TESTS: PREFLIGHT VALIDATION (T067-T070)
// ───────────────────────────────────────────────────────────────
'use strict';

const assert = require('assert');
const path = require('path');

// Import the module under test
const preflight = require('../lib/validation/preflight.js');

/* ─────────────────────────────────────────────────────────────
   1. TEST CONFIGURATION
──────────────────────────────────────────────────────────────── */

const TEST_CONTENT_VALID = `# Test Memory

This is a test memory file with valid content.

<!-- ANCHOR:summary -->
This is the summary section.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:decisions -->
- Decision 1: Use preflight validation
- Decision 2: Support dry-run mode
<!-- /ANCHOR:decisions -->

## Trigger Phrases

- test preflight
- validate memory
`;

const TEST_CONTENT_UNCLOSED_ANCHOR = `# Test Memory

<!-- ANCHOR:summary -->
This anchor is never closed.

More content here.
`;

const TEST_CONTENT_INVALID_ANCHOR_ID = `# Test Memory

<!-- ANCHOR:invalid!id@here -->
Content
<!-- /ANCHOR:invalid!id@here -->
`;

const TEST_CONTENT_DUPLICATE_ANCHOR = `# Test Memory

<!-- ANCHOR:summary -->
First summary
<!-- /ANCHOR:summary -->

<!-- ANCHOR:summary -->
Duplicate summary
<!-- /ANCHOR:summary -->
`;

const TEST_CONTENT_SMALL = 'Hi';

const TEST_CONTENT_LARGE = 'x'.repeat(150000);

/* ─────────────────────────────────────────────────────────────
   2. ANCHOR FORMAT VALIDATION TESTS (T068, CHK-156)
──────────────────────────────────────────────────────────────── */

function test_anchor_validation_valid() {
  console.log('  Testing valid anchor format...');

  const result = preflight.validate_anchor_format(TEST_CONTENT_VALID);

  assert.strictEqual(result.valid, true, 'Should be valid');
  assert.strictEqual(result.errors.length, 0, 'Should have no errors');
  assert.ok(result.anchors.includes('summary'), 'Should find summary anchor');
  assert.ok(result.anchors.includes('decisions'), 'Should find decisions anchor');

  console.log('    PASS: Valid anchor format accepted');
}

function test_anchor_validation_unclosed() {
  console.log('  Testing unclosed anchor detection...');

  const result = preflight.validate_anchor_format(TEST_CONTENT_UNCLOSED_ANCHOR);

  assert.strictEqual(result.valid, false, 'Should be invalid');
  assert.ok(result.errors.length > 0, 'Should have errors');
  assert.ok(
    result.errors.some(e => e.code === preflight.PreflightErrorCodes.ANCHOR_UNCLOSED),
    'Should have ANCHOR_UNCLOSED error'
  );

  console.log('    PASS: Unclosed anchor detected');
}

function test_anchor_validation_invalid_id() {
  console.log('  Testing invalid anchor ID detection...');

  const result = preflight.validate_anchor_format(TEST_CONTENT_INVALID_ANCHOR_ID);

  assert.strictEqual(result.valid, false, 'Should be invalid');
  assert.ok(
    result.errors.some(e => e.code === preflight.PreflightErrorCodes.ANCHOR_ID_INVALID),
    'Should have ANCHOR_ID_INVALID error'
  );

  console.log('    PASS: Invalid anchor ID detected');
}

function test_anchor_validation_duplicate() {
  console.log('  Testing duplicate anchor ID detection...');

  const result = preflight.validate_anchor_format(TEST_CONTENT_DUPLICATE_ANCHOR);

  assert.strictEqual(result.valid, false, 'Should be invalid');
  assert.ok(
    result.errors.some(e => e.code === preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID),
    'Should have ANCHOR_FORMAT_INVALID error for duplicate'
  );

  console.log('    PASS: Duplicate anchor ID detected');
}

function test_anchor_validation_empty() {
  console.log('  Testing empty content handling...');

  const result = preflight.validate_anchor_format('');

  assert.strictEqual(result.valid, true, 'Should be valid (no anchors to validate)');
  assert.ok(result.warnings.length > 0 || result.anchors.length === 0, 'Should handle empty gracefully');

  console.log('    PASS: Empty content handled');
}

/* ─────────────────────────────────────────────────────────────
   3. DUPLICATE DETECTION TESTS (T069, CHK-157)
──────────────────────────────────────────────────────────────── */

function test_duplicate_check_no_database() {
  console.log('  Testing duplicate check without database...');

  const result = preflight.check_duplicate(
    { content: TEST_CONTENT_VALID },
    { check_exact: true }
  );

  assert.strictEqual(result.is_duplicate, false, 'Should not find duplicate without database');
  assert.ok(result.content_hash, 'Should compute content hash');
  assert.strictEqual(result.content_hash.length, 64, 'Hash should be SHA-256 (64 hex chars)');

  console.log('    PASS: Duplicate check without database');
}

function test_content_hash_computation() {
  console.log('  Testing content hash computation...');

  const hash1 = preflight.compute_content_hash(TEST_CONTENT_VALID);
  const hash2 = preflight.compute_content_hash(TEST_CONTENT_VALID);
  const hash3 = preflight.compute_content_hash(TEST_CONTENT_VALID + ' ');

  assert.strictEqual(hash1, hash2, 'Same content should produce same hash');
  assert.notStrictEqual(hash1, hash3, 'Different content should produce different hash');

  console.log('    PASS: Content hash computation correct');
}

/* ─────────────────────────────────────────────────────────────
   4. TOKEN BUDGET ESTIMATION TESTS (T070, CHK-158)
──────────────────────────────────────────────────────────────── */

function test_token_estimation() {
  console.log('  Testing token estimation...');

  const content = 'a'.repeat(350); // 350 chars ~ 100 tokens at 3.5 chars/token
  const tokens = preflight.estimate_tokens(content);

  assert.ok(tokens >= 90 && tokens <= 110, `Should estimate ~100 tokens, got ${tokens}`);

  console.log('    PASS: Token estimation correct');
}

function test_token_budget_within() {
  console.log('  Testing token budget within limits...');

  const result = preflight.check_token_budget(TEST_CONTENT_VALID, {
    max_tokens: 8000,
  });

  assert.strictEqual(result.within_budget, true, 'Should be within budget');
  assert.ok(result.estimated_tokens > 0, 'Should estimate tokens');
  assert.ok(result.percentage_used < 1, 'Should be under 100%');

  console.log('    PASS: Token budget within limits');
}

function test_token_budget_exceeded() {
  console.log('  Testing token budget exceeded...');

  const result = preflight.check_token_budget(TEST_CONTENT_LARGE, {
    max_tokens: 1000,
  });

  assert.strictEqual(result.within_budget, false, 'Should exceed budget');
  assert.ok(result.errors.length > 0, 'Should have errors');
  assert.ok(
    result.errors.some(e => e.code === preflight.PreflightErrorCodes.TOKEN_BUDGET_EXCEEDED),
    'Should have TOKEN_BUDGET_EXCEEDED error'
  );

  console.log('    PASS: Token budget exceeded detected');
}

function test_token_budget_warning() {
  console.log('  Testing token budget warning...');

  const content = 'a'.repeat(2800); // ~800 tokens
  const result = preflight.check_token_budget(content, {
    max_tokens: 1000,
    warning_threshold: 0.7,
  });

  assert.strictEqual(result.within_budget, true, 'Should be within budget');
  assert.ok(result.warnings.length > 0, 'Should have warnings');

  console.log('    PASS: Token budget warning generated');
}

/* ─────────────────────────────────────────────────────────────
   5. CONTENT SIZE VALIDATION TESTS
──────────────────────────────────────────────────────────────── */

function test_content_size_valid() {
  console.log('  Testing valid content size...');

  const result = preflight.validate_content_size(TEST_CONTENT_VALID);

  assert.strictEqual(result.valid, true, 'Should be valid');
  assert.ok(result.content_length > 0, 'Should measure content length');

  console.log('    PASS: Valid content size accepted');
}

function test_content_size_too_small() {
  console.log('  Testing content too small...');

  const result = preflight.validate_content_size(TEST_CONTENT_SMALL, {
    min_length: 10,
  });

  assert.strictEqual(result.valid, false, 'Should be invalid');
  assert.ok(
    result.errors.some(e => e.code === preflight.PreflightErrorCodes.CONTENT_TOO_SMALL),
    'Should have CONTENT_TOO_SMALL error'
  );

  console.log('    PASS: Content too small detected');
}

function test_content_size_too_large() {
  console.log('  Testing content too large...');

  const result = preflight.validate_content_size(TEST_CONTENT_LARGE, {
    max_length: 100000,
  });

  assert.strictEqual(result.valid, false, 'Should be invalid');
  assert.ok(
    result.errors.some(e => e.code === preflight.PreflightErrorCodes.CONTENT_TOO_LARGE),
    'Should have CONTENT_TOO_LARGE error'
  );

  console.log('    PASS: Content too large detected');
}

/* ─────────────────────────────────────────────────────────────
   6. UNIFIED PREFLIGHT TESTS (T067, CHK-159, CHK-160)
──────────────────────────────────────────────────────────────── */

function test_run_preflight_pass() {
  console.log('  Testing run_preflight with valid content...');

  const result = preflight.run_preflight(
    { content: TEST_CONTENT_VALID, file_path: '/test/memory.md', spec_folder: 'test-spec' },
    { check_anchors: true, check_tokens: true, check_size: true }
  );

  assert.strictEqual(result.pass, true, 'Should pass validation');
  assert.ok(result.details.checks_run.length > 0, 'Should run checks');

  console.log('    PASS: Valid preflight passed');
}

function test_run_preflight_fail() {
  console.log('  Testing run_preflight with invalid content...');

  const result = preflight.run_preflight(
    { content: TEST_CONTENT_LARGE, file_path: '/test/memory.md', spec_folder: 'test-spec' },
    { check_anchors: true, check_tokens: true, check_size: true }
  );

  assert.strictEqual(result.pass, false, 'Should fail validation');
  assert.ok(result.errors.length > 0, 'Should have errors');

  console.log('    PASS: Invalid preflight failed');
}

function test_run_preflight_dry_run() {
  console.log('  Testing dry-run mode (CHK-160)...');

  const result = preflight.run_preflight(
    { content: TEST_CONTENT_LARGE, file_path: '/test/memory.md', spec_folder: 'test-spec' },
    { dry_run: true, check_anchors: true, check_tokens: true, check_size: true }
  );

  // In dry-run mode, pass is always true (doesn't block)
  assert.strictEqual(result.pass, true, 'Dry-run should always pass');
  assert.strictEqual(result.dry_run, true, 'Should be marked as dry-run');
  assert.strictEqual(result.dry_run_would_pass, false, 'Should indicate would have failed');

  console.log('    PASS: Dry-run mode working');
}

function test_run_preflight_partial_checks() {
  console.log('  Testing selective check disabling...');

  // Content with unclosed anchor but skip anchor validation
  const result = preflight.run_preflight(
    { content: TEST_CONTENT_UNCLOSED_ANCHOR, file_path: '/test/memory.md', spec_folder: 'test-spec' },
    { check_anchors: false, check_tokens: true, check_size: true }
  );

  assert.strictEqual(result.pass, true, 'Should pass when anchor check disabled');
  assert.ok(!result.details.checks_run.includes('anchor_format'), 'Should not run anchor check');

  console.log('    PASS: Selective check disabling works');
}

/* ─────────────────────────────────────────────────────────────
   7. ERROR CLASS TESTS (T157)
──────────────────────────────────────────────────────────────── */

function test_preflight_error_class() {
  console.log('  Testing PreflightError class (T157)...');

  const error = new preflight.PreflightError(
    preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID,
    'Test error message',
    { recoverable: true, suggestion: 'Fix the anchors' }
  );

  assert.strictEqual(error.code, preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID);
  assert.strictEqual(error.message, 'Test error message');
  assert.strictEqual(error.recoverable, true);
  assert.strictEqual(error.suggestion, 'Fix the anchors');
  assert.strictEqual(error.name, 'PreflightError');

  // Test JSON serialization
  const json = error.toJSON();
  assert.ok(json.code, 'JSON should have code');
  assert.ok(json.message, 'JSON should have message');

  console.log('    PASS: PreflightError class works correctly');
}

function test_preflight_error_structure() {
  console.log('  Testing PreflightError structure completeness (T157)...');

  // Test with minimal arguments
  const minError = new preflight.PreflightError('TEST001', 'Minimal error');
  assert.strictEqual(minError.name, 'PreflightError', 'Should have name property');
  assert.strictEqual(minError.code, 'TEST001', 'Should store code');
  assert.strictEqual(minError.message, 'Minimal error', 'Should store message');
  assert.strictEqual(minError.recoverable, false, 'Should default recoverable to false');
  assert.strictEqual(minError.suggestion, null, 'Should default suggestion to null');
  assert.deepStrictEqual(minError.details, {}, 'Should default details to empty object');

  // Test toJSON includes all fields
  const json = minError.toJSON();
  assert.ok('code' in json, 'toJSON should include code');
  assert.ok('message' in json, 'toJSON should include message');
  assert.ok('details' in json, 'toJSON should include details');
  assert.ok('recoverable' in json, 'toJSON should include recoverable');
  assert.ok('suggestion' in json, 'toJSON should include suggestion');

  console.log('    PASS: PreflightError structure complete');
}

/* ─────────────────────────────────────────────────────────────
   8. PREFLIGHT ERROR CODES ENUM TESTS (T158)
──────────────────────────────────────────────────────────────── */

function test_preflight_error_codes_enum() {
  console.log('  Testing PreflightErrorCodes enum values (T158)...');

  const codes = preflight.PreflightErrorCodes;

  // Anchor-related codes (PF001-PF003)
  assert.strictEqual(codes.ANCHOR_FORMAT_INVALID, 'PF001', 'ANCHOR_FORMAT_INVALID should be PF001');
  assert.strictEqual(codes.ANCHOR_UNCLOSED, 'PF002', 'ANCHOR_UNCLOSED should be PF002');
  assert.strictEqual(codes.ANCHOR_ID_INVALID, 'PF003', 'ANCHOR_ID_INVALID should be PF003');

  // Duplicate-related codes (PF010-PF012)
  assert.strictEqual(codes.DUPLICATE_DETECTED, 'PF010', 'DUPLICATE_DETECTED should be PF010');
  assert.strictEqual(codes.DUPLICATE_EXACT, 'PF011', 'DUPLICATE_EXACT should be PF011');
  assert.strictEqual(codes.DUPLICATE_SIMILAR, 'PF012', 'DUPLICATE_SIMILAR should be PF012');

  // Token-related codes (PF020-PF021)
  assert.strictEqual(codes.TOKEN_BUDGET_EXCEEDED, 'PF020', 'TOKEN_BUDGET_EXCEEDED should be PF020');
  assert.strictEqual(codes.TOKEN_BUDGET_WARNING, 'PF021', 'TOKEN_BUDGET_WARNING should be PF021');

  // Content size codes (PF030-PF031)
  assert.strictEqual(codes.CONTENT_TOO_LARGE, 'PF030', 'CONTENT_TOO_LARGE should be PF030');
  assert.strictEqual(codes.CONTENT_TOO_SMALL, 'PF031', 'CONTENT_TOO_SMALL should be PF031');

  // Verify all expected codes exist
  const expectedCodes = [
    'ANCHOR_FORMAT_INVALID', 'ANCHOR_UNCLOSED', 'ANCHOR_ID_INVALID',
    'DUPLICATE_DETECTED', 'DUPLICATE_EXACT', 'DUPLICATE_SIMILAR',
    'TOKEN_BUDGET_EXCEEDED', 'TOKEN_BUDGET_WARNING',
    'CONTENT_TOO_LARGE', 'CONTENT_TOO_SMALL'
  ];

  for (const codeName of expectedCodes) {
    assert.ok(codeName in codes, `${codeName} should exist in PreflightErrorCodes`);
  }

  console.log('    PASS: PreflightErrorCodes enum values correct');
}

/* ─────────────────────────────────────────────────────────────
   9. ANCHOR FORMAT VALIDATION - EXTENDED TESTS (T159-T162)
──────────────────────────────────────────────────────────────── */

function test_anchor_valid_id_formats() {
  console.log('  Testing valid anchor ID formats (T159)...');

  // Test various valid ID formats
  const validIdContent = `
<!-- ANCHOR:simple -->content<!-- /ANCHOR:simple -->
<!-- ANCHOR:with-hyphens -->content<!-- /ANCHOR:with-hyphens -->
<!-- ANCHOR:spec-folder/section -->content<!-- /ANCHOR:spec-folder/section -->
<!-- ANCHOR:001-numbered -->content<!-- /ANCHOR:001-numbered -->
<!-- ANCHOR:CamelCase123 -->content<!-- /ANCHOR:CamelCase123 -->
`;

  const result = preflight.validate_anchor_format(validIdContent);

  assert.strictEqual(result.valid, true, 'All valid ID formats should pass');
  assert.strictEqual(result.anchors.length, 5, 'Should find 5 valid anchors');
  assert.ok(result.anchors.includes('simple'), 'Should include simple ID');
  assert.ok(result.anchors.includes('with-hyphens'), 'Should include hyphenated ID');
  assert.ok(result.anchors.includes('spec-folder/section'), 'Should include path-style ID');

  console.log('    PASS: Valid anchor ID formats accepted');
}

function test_anchor_unique_ids_enforcement() {
  console.log('  Testing unique anchor ID enforcement (T160)...');

  const duplicateContent = `
<!-- ANCHOR:unique1 -->First unique<!-- /ANCHOR:unique1 -->
<!-- ANCHOR:unique2 -->Second unique<!-- /ANCHOR:unique2 -->
<!-- ANCHOR:unique1 -->Duplicate of first<!-- /ANCHOR:unique1 -->
`;

  const result = preflight.validate_anchor_format(duplicateContent);

  assert.strictEqual(result.valid, false, 'Duplicate IDs should fail');
  assert.ok(result.errors.length >= 1, 'Should have at least one error');

  const dupError = result.errors.find(e =>
    e.message && e.message.includes('Duplicate anchor ID')
  );
  assert.ok(dupError, 'Should report duplicate anchor error');
  assert.ok(dupError.anchor_id === 'unique1', 'Should identify the duplicate ID');

  console.log('    PASS: Unique ID enforcement working');
}

function test_anchor_matching_open_close_tags() {
  console.log('  Testing matching open/close anchor tags (T161)...');

  // Valid matching tags
  const matchingContent = `
<!-- ANCHOR:test-section -->
This section has matching tags.
<!-- /ANCHOR:test-section -->
`;

  const result = preflight.validate_anchor_format(matchingContent);

  assert.strictEqual(result.valid, true, 'Matching tags should be valid');
  assert.strictEqual(result.anchors.length, 1, 'Should find one valid anchor');
  assert.strictEqual(result.anchors[0], 'test-section', 'Should record the anchor ID');

  // Test case insensitivity for anchor/ANCHOR
  const mixedCaseContent = `
<!-- anchor:lowercase -->content<!-- /ANCHOR:lowercase -->
<!-- ANCHOR:uppercase -->content<!-- /anchor:uppercase -->
`;

  const mixedResult = preflight.validate_anchor_format(mixedCaseContent);
  assert.strictEqual(mixedResult.valid, true, 'Mixed case should work');
  assert.strictEqual(mixedResult.anchors.length, 2, 'Should find both anchors');

  console.log('    PASS: Matching open/close tags validated');
}

function test_anchor_unclosed_detection_detailed() {
  console.log('  Testing unclosed anchor detection (T162)...');

  const unclosedContent = `
<!-- ANCHOR:closed-ok -->This is closed properly<!-- /ANCHOR:closed-ok -->
<!-- ANCHOR:never-closed -->
This anchor tag is never closed.
More content follows.
`;

  const result = preflight.validate_anchor_format(unclosedContent);

  assert.strictEqual(result.valid, false, 'Unclosed anchor should fail');
  assert.ok(result.anchors.includes('closed-ok'), 'Should find the closed anchor');

  const unclosedError = result.errors.find(e =>
    e.code === preflight.PreflightErrorCodes.ANCHOR_UNCLOSED
  );
  assert.ok(unclosedError, 'Should have ANCHOR_UNCLOSED error');
  assert.strictEqual(unclosedError.anchor_id, 'never-closed', 'Should identify unclosed anchor');
  assert.ok(unclosedError.suggestion, 'Should provide suggestion for fix');

  console.log('    PASS: Unclosed anchor detection working');
}

/* ─────────────────────────────────────────────────────────────
   10. DUPLICATE DETECTION - EXTENDED TESTS (T163-T164)
──────────────────────────────────────────────────────────────── */

function test_duplicate_exact_match_via_hash() {
  console.log('  Testing exact duplicate match via content hash (T163)...');

  const testContent = 'Test memory content for exact match detection';
  const contentHash = preflight.compute_content_hash(testContent);

  // Create mock database with prepare().get() that returns matching hash
  const mockDatabase = {
    prepare: (sql) => ({
      get: (...params) => {
        // Simulate finding an exact match
        if (params[0] === contentHash) {
          return { id: 42, file_path: '/specs/test/memory/existing.md' };
        }
        return null;
      }
    })
  };

  const result = preflight.check_duplicate(
    { content: testContent, database: mockDatabase },
    { check_exact: true }
  );

  assert.strictEqual(result.is_duplicate, true, 'Should detect exact duplicate');
  assert.strictEqual(result.duplicate_type, 'exact', 'Should identify as exact match');
  assert.strictEqual(result.existing_id, 42, 'Should return existing memory ID');
  assert.strictEqual(result.existing_path, '/specs/test/memory/existing.md', 'Should return file path');
  assert.strictEqual(result.similarity, 1.0, 'Exact match should have similarity 1.0');
  assert.strictEqual(result.content_hash, contentHash, 'Should include content hash');

  console.log('    PASS: Exact duplicate detection via hash working');
}

function test_duplicate_no_exact_match() {
  console.log('  Testing no exact duplicate match...');

  const testContent = 'Unique content that has no duplicate';

  // Mock database that returns no match
  const mockDatabase = {
    prepare: () => ({
      get: () => null
    })
  };

  const result = preflight.check_duplicate(
    { content: testContent, database: mockDatabase },
    { check_exact: true }
  );

  assert.strictEqual(result.is_duplicate, false, 'Should not find duplicate');
  assert.strictEqual(result.duplicate_type, null, 'Should have no duplicate type');
  assert.ok(result.content_hash, 'Should still compute hash');

  console.log('    PASS: No exact duplicate correctly detected');
}

function test_duplicate_similar_match_via_vector() {
  console.log('  Testing similar duplicate match via vector (T164)...');

  const testContent = 'Test memory content for similarity detection';
  const mockEmbedding = new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5]);

  // Mock find_similar function that returns high similarity match
  const mockFindSimilar = (embedding, options) => {
    // Simulate finding a similar memory with 0.97 similarity (above 0.95 threshold)
    return [
      {
        id: 99,
        file_path: '/specs/test/memory/similar.md',
        similarity: 0.97
      }
    ];
  };

  const result = preflight.check_duplicate(
    {
      content: testContent,
      embedding: mockEmbedding,
      find_similar: mockFindSimilar
    },
    { check_exact: false, check_similar: true, similarity_threshold: 0.95 }
  );

  assert.strictEqual(result.is_duplicate, true, 'Should detect similar duplicate');
  assert.strictEqual(result.duplicate_type, 'similar', 'Should identify as similar match');
  assert.strictEqual(result.existing_id, 99, 'Should return similar memory ID');
  assert.strictEqual(result.similarity, 0.97, 'Should return similarity score');

  console.log('    PASS: Similar duplicate detection via vector working');
}

function test_duplicate_similar_below_threshold() {
  console.log('  Testing similar match below threshold...');

  const testContent = 'Test content';
  const mockEmbedding = new Float32Array([0.1, 0.2, 0.3]);

  // Mock returning similarity below threshold
  const mockFindSimilar = () => [
    { id: 100, file_path: '/test.md', similarity: 0.80 }
  ];

  const result = preflight.check_duplicate(
    { content: testContent, embedding: mockEmbedding, find_similar: mockFindSimilar },
    { check_exact: false, check_similar: true, similarity_threshold: 0.95 }
  );

  assert.strictEqual(result.is_duplicate, false, 'Should not flag as duplicate below threshold');
  assert.strictEqual(result.duplicate_type, null, 'Should have no duplicate type');

  console.log('    PASS: Below-threshold similarity correctly ignored');
}

/* ─────────────────────────────────────────────────────────────
   11. TOKEN BUDGET - EXTENDED TESTS (T165-T166)
──────────────────────────────────────────────────────────────── */

function test_token_estimation_ratio() {
  console.log('  Testing token estimation ~3.5 chars/token ratio (T165)...');

  // Test with exact character counts for clear verification
  const chars_per_token = 3.5;

  // 350 characters should yield 100 tokens
  const content350 = 'a'.repeat(350);
  const tokens350 = preflight.estimate_tokens(content350);
  const expectedTokens350 = Math.ceil(350 / chars_per_token);
  assert.strictEqual(tokens350, expectedTokens350, `350 chars should be ${expectedTokens350} tokens`);

  // 700 characters should yield 200 tokens
  const content700 = 'b'.repeat(700);
  const tokens700 = preflight.estimate_tokens(content700);
  const expectedTokens700 = Math.ceil(700 / chars_per_token);
  assert.strictEqual(tokens700, expectedTokens700, `700 chars should be ${expectedTokens700} tokens`);

  // 35 characters should yield 10 tokens
  const content35 = 'c'.repeat(35);
  const tokens35 = preflight.estimate_tokens(content35);
  const expectedTokens35 = Math.ceil(35 / chars_per_token);
  assert.strictEqual(tokens35, expectedTokens35, `35 chars should be ${expectedTokens35} tokens`);

  // Verify the ratio: tokens * 3.5 should approximately equal chars
  const content1000 = 'd'.repeat(1000);
  const tokens1000 = preflight.estimate_tokens(content1000);
  const inferredRatio = 1000 / tokens1000;
  assert.ok(
    inferredRatio >= 3.4 && inferredRatio <= 3.6,
    `Inferred ratio ${inferredRatio.toFixed(2)} should be ~3.5`
  );

  console.log('    PASS: Token estimation uses ~3.5 chars/token ratio');
}

function test_token_budget_warning_at_80_percent() {
  console.log('  Testing token budget warning at 80% threshold (T166)...');

  // With max_tokens=1000 and warning_threshold=0.8, warning triggers at 800+ tokens
  // 800 tokens * 3.5 chars/token = 2800 chars (before overhead)
  // But check_token_budget adds ~150 token overhead, so we need to account for that
  // To get ~850 tokens estimated (after 150 overhead), we need ~700 raw tokens
  // 700 tokens * 3.5 = 2450 chars

  const content = 'x'.repeat(2450); // Should yield ~700 tokens
  const result = preflight.check_token_budget(content, {
    max_tokens: 1000,
    warning_threshold: 0.8,
    include_embedding_overhead: true
  });

  // Verify: ~700 content tokens + 150 overhead = ~850 tokens = 85% of 1000
  assert.strictEqual(result.within_budget, true, 'Should be within budget');
  assert.ok(result.percentage_used >= 0.8, `Percentage used (${(result.percentage_used * 100).toFixed(1)}%) should be >= 80%`);
  assert.ok(result.warnings.length > 0, 'Should have warning at 80%+ usage');

  const warning = result.warnings[0];
  assert.strictEqual(warning.code, preflight.PreflightErrorCodes.TOKEN_BUDGET_WARNING, 'Should have TOKEN_BUDGET_WARNING code');
  assert.ok(warning.suggestion, 'Warning should include suggestion');

  console.log('    PASS: Token budget warning triggers at 80% threshold');
}

function test_token_budget_no_warning_below_threshold() {
  console.log('  Testing no warning below 80% threshold...');

  // Content that yields ~50% usage
  const content = 'y'.repeat(1000); // ~286 tokens + 150 overhead = ~436 tokens = 43.6% of 1000
  const result = preflight.check_token_budget(content, {
    max_tokens: 1000,
    warning_threshold: 0.8,
    include_embedding_overhead: true
  });

  assert.strictEqual(result.within_budget, true, 'Should be within budget');
  assert.ok(result.percentage_used < 0.8, `Percentage used (${(result.percentage_used * 100).toFixed(1)}%) should be < 80%`);
  assert.strictEqual(result.warnings.length, 0, 'Should have no warnings below threshold');

  console.log('    PASS: No warning below 80% threshold');
}

/* ─────────────────────────────────────────────────────────────
   12. RUN_PREFLIGHT COMBINED TESTS (T156)
──────────────────────────────────────────────────────────────── */

function test_run_preflight_combines_all_checks() {
  console.log('  Testing run_preflight() combines all validation checks (T156)...');

  const validContent = `# Test Memory

<!-- ANCHOR:summary -->
Test summary content here.
<!-- /ANCHOR:summary -->

This is additional content to ensure size validation passes.
`;

  const result = preflight.run_preflight(
    {
      content: validContent,
      file_path: '/specs/test/memory/test.md',
      spec_folder: 'test-spec'
    },
    {
      check_anchors: true,
      check_tokens: true,
      check_size: true,
      check_duplicates: true
    }
  );

  // Verify all checks were run
  assert.ok(result.details.checks_run.includes('content_size'), 'Should run content_size check');
  assert.ok(result.details.checks_run.includes('anchor_format'), 'Should run anchor_format check');
  assert.ok(result.details.checks_run.includes('token_budget'), 'Should run token_budget check');
  assert.ok(result.details.checks_run.includes('duplicate_check'), 'Should run duplicate_check check');

  // Verify details are populated
  assert.ok(result.details.content_size, 'Should have content_size details');
  assert.ok(result.details.anchor_format, 'Should have anchor_format details');
  assert.ok(result.details.token_budget, 'Should have token_budget details');
  assert.ok(result.details.duplicate_check, 'Should have duplicate_check details');

  // Verify overall pass status
  assert.strictEqual(result.pass, true, 'Valid content should pass all checks');
  assert.strictEqual(result.errors.length, 0, 'Should have no errors');

  console.log('    PASS: run_preflight() combines all validation checks');
}

function test_run_preflight_aggregates_errors() {
  console.log('  Testing run_preflight() aggregates errors from multiple checks...');

  // Content with size issue (too small) - this will definitely fail
  const tinyContent = 'Hi';  // Less than min_length (10)

  const result = preflight.run_preflight(
    { content: tinyContent, file_path: '/test.md', spec_folder: 'test' },
    {
      check_anchors: true,
      check_tokens: true,
      check_size: true,
      strict_anchors: false  // Keep anchor errors as warnings
    }
  );

  assert.strictEqual(result.pass, false, 'Should fail with content too small');
  assert.ok(result.errors.length >= 1, 'Should have at least one error');

  // Verify the error is from content size check
  const sizeError = result.errors.find(e =>
    e.code === preflight.PreflightErrorCodes.CONTENT_TOO_SMALL
  );
  assert.ok(sizeError, 'Should have CONTENT_TOO_SMALL error');

  // Verify checks were still run
  assert.ok(result.details.checks_run.length > 0, 'Should record which checks ran');
  assert.ok(result.details.checks_run.includes('content_size'), 'Should include content_size check');

  console.log('    PASS: run_preflight() aggregates errors correctly');
}

/* ─────────────────────────────────────────────────────────────
   13. TEST RUNNER
──────────────────────────────────────────────────────────────── */

function run_all_tests() {
  console.log('='.repeat(60));
  console.log('PREFLIGHT VALIDATION TESTS (T067-T070, T156-T166)');
  console.log('='.repeat(60));

  let passed = 0;
  let failed = 0;

  const tests = [
    // Anchor validation tests (T068, CHK-156)
    test_anchor_validation_valid,
    test_anchor_validation_unclosed,
    test_anchor_validation_invalid_id,
    test_anchor_validation_duplicate,
    test_anchor_validation_empty,

    // Duplicate detection tests (T069, CHK-157)
    test_duplicate_check_no_database,
    test_content_hash_computation,

    // Token budget tests (T070, CHK-158)
    test_token_estimation,
    test_token_budget_within,
    test_token_budget_exceeded,
    test_token_budget_warning,

    // Content size tests
    test_content_size_valid,
    test_content_size_too_small,
    test_content_size_too_large,

    // Unified preflight tests (T067, CHK-159, CHK-160)
    test_run_preflight_pass,
    test_run_preflight_fail,
    test_run_preflight_dry_run,
    test_run_preflight_partial_checks,

    // Error class tests (T157)
    test_preflight_error_class,
    test_preflight_error_structure,

    // Error codes enum tests (T158)
    test_preflight_error_codes_enum,

    // Extended anchor validation tests (T159-T162)
    test_anchor_valid_id_formats,
    test_anchor_unique_ids_enforcement,
    test_anchor_matching_open_close_tags,
    test_anchor_unclosed_detection_detailed,

    // Extended duplicate detection tests (T163-T164)
    test_duplicate_exact_match_via_hash,
    test_duplicate_no_exact_match,
    test_duplicate_similar_match_via_vector,
    test_duplicate_similar_below_threshold,

    // Extended token budget tests (T165-T166)
    test_token_estimation_ratio,
    test_token_budget_warning_at_80_percent,
    test_token_budget_no_warning_below_threshold,

    // Extended run_preflight tests (T156)
    test_run_preflight_combines_all_checks,
    test_run_preflight_aggregates_errors,
  ];

  for (const test of tests) {
    try {
      test();
      passed++;
    } catch (err) {
      failed++;
      console.error(`    FAIL: ${test.name}`);
      console.error(`      ${err.message}`);
    }
  }

  console.log('='.repeat(60));
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(60));

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests if executed directly
if (require.main === module) {
  run_all_tests();
}

module.exports = { run_all_tests };
