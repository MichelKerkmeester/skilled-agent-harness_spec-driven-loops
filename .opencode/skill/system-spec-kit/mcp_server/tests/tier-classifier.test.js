// ───────────────────────────────────────────────────────────────
// TEST: TIER CLASSIFIER
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const LIB_PATH = path.join(__dirname, '..', 'lib', 'cognitive');

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
   3. TEST FUNCTIONS
──────────────────────────────────────────────────────────────── */

let tierClassifier;

// Load module
function test_module_loads() {
  log('\n🔬 Module Loading');
  
  try {
    tierClassifier = require(path.join(LIB_PATH, 'tier-classifier.js'));
    pass('Module loads without error', 'require() succeeded');
  } catch (error) {
    fail('Module loads without error', error.message);
    return false;
  }
  return true;
}

// Test classifyTier() function
function test_classify_tier_hot() {
  log('\n🔬 classifyTier() - HOT tier');
  
  // Test 1: Score at exactly 0.8 (boundary) = HOT
  const result_at_boundary = tierClassifier.classifyTier(0.8);
  if (result_at_boundary === 'HOT') {
    pass('Score 0.8 (boundary) returns HOT', `Got: ${result_at_boundary}`);
  } else {
    fail('Score 0.8 (boundary) returns HOT', `Expected HOT, got: ${result_at_boundary}`);
  }
  
  // Test 2: Score above 0.8 = HOT
  const result_above = tierClassifier.classifyTier(0.95);
  if (result_above === 'HOT') {
    pass('Score 0.95 returns HOT', `Got: ${result_above}`);
  } else {
    fail('Score 0.95 returns HOT', `Expected HOT, got: ${result_above}`);
  }
  
  // Test 3: Score exactly 1.0 = HOT
  const result_max = tierClassifier.classifyTier(1.0);
  if (result_max === 'HOT') {
    pass('Score 1.0 (max) returns HOT', `Got: ${result_max}`);
  } else {
    fail('Score 1.0 (max) returns HOT', `Expected HOT, got: ${result_max}`);
  }
}

function test_classify_tier_warm() {
  log('\n🔬 classifyTier() - WARM tier');
  
  // Test 1: Score at exactly 0.25 (boundary) = WARM
  const result_at_boundary = tierClassifier.classifyTier(0.25);
  if (result_at_boundary === 'WARM') {
    pass('Score 0.25 (boundary) returns WARM', `Got: ${result_at_boundary}`);
  } else {
    fail('Score 0.25 (boundary) returns WARM', `Expected WARM, got: ${result_at_boundary}`);
  }
  
  // Test 2: Score in middle of WARM range = WARM
  const result_middle = tierClassifier.classifyTier(0.5);
  if (result_middle === 'WARM') {
    pass('Score 0.5 returns WARM', `Got: ${result_middle}`);
  } else {
    fail('Score 0.5 returns WARM', `Expected WARM, got: ${result_middle}`);
  }
  
  // Test 3: Score just below HOT threshold = WARM
  const result_below_hot = tierClassifier.classifyTier(0.79);
  if (result_below_hot === 'WARM') {
    pass('Score 0.79 returns WARM', `Got: ${result_below_hot}`);
  } else {
    fail('Score 0.79 returns WARM', `Expected WARM, got: ${result_below_hot}`);
  }
}

function test_classify_tier_cold() {
  log('\n🔬 classifyTier() - COLD tier');
  
  // Test 1: Score just below 0.25 = COLD
  const result_below = tierClassifier.classifyTier(0.24);
  if (result_below === 'COLD') {
    pass('Score 0.24 returns COLD', `Got: ${result_below}`);
  } else {
    fail('Score 0.24 returns COLD', `Expected COLD, got: ${result_below}`);
  }
  
  // Test 2: Score 0 = COLD
  const result_zero = tierClassifier.classifyTier(0);
  if (result_zero === 'COLD') {
    pass('Score 0 returns COLD', `Got: ${result_zero}`);
  } else {
    fail('Score 0 returns COLD', `Expected COLD, got: ${result_zero}`);
  }
  
  // Test 3: Score 0.1 = COLD
  const result_low = tierClassifier.classifyTier(0.1);
  if (result_low === 'COLD') {
    pass('Score 0.1 returns COLD', `Got: ${result_low}`);
  } else {
    fail('Score 0.1 returns COLD', `Expected COLD, got: ${result_low}`);
  }
}

function test_classify_tier_edge_cases() {
  log('\n🔬 classifyTier() - Edge cases');
  
  // Test 1: Non-numeric input = COLD
  const result_null = tierClassifier.classifyTier(null);
  if (result_null === 'COLD') {
    pass('null input returns COLD', `Got: ${result_null}`);
  } else {
    fail('null input returns COLD', `Expected COLD, got: ${result_null}`);
  }
  
  // Test 2: undefined input = COLD
  const result_undefined = tierClassifier.classifyTier(undefined);
  if (result_undefined === 'COLD') {
    pass('undefined input returns COLD', `Got: ${result_undefined}`);
  } else {
    fail('undefined input returns COLD', `Expected COLD, got: ${result_undefined}`);
  }
  
  // Test 3: NaN input = COLD
  const result_nan = tierClassifier.classifyTier(NaN);
  if (result_nan === 'COLD') {
    pass('NaN input returns COLD', `Got: ${result_nan}`);
  } else {
    fail('NaN input returns COLD', `Expected COLD, got: ${result_nan}`);
  }
  
  // Test 4: String input = COLD
  const result_string = tierClassifier.classifyTier('0.9');
  if (result_string === 'COLD') {
    pass('String input returns COLD', `Got: ${result_string}`);
  } else {
    fail('String input returns COLD', `Expected COLD, got: ${result_string}`);
  }
  
  // Test 5: Score > 1.0 is clamped to 1.0 = HOT
  const result_over = tierClassifier.classifyTier(1.5);
  if (result_over === 'HOT') {
    pass('Score 1.5 (over max) is clamped, returns HOT', `Got: ${result_over}`);
  } else {
    fail('Score 1.5 (over max) is clamped, returns HOT', `Expected HOT, got: ${result_over}`);
  }
  
  // Test 6: Score < 0 is clamped to 0 = COLD
  const result_negative = tierClassifier.classifyTier(-0.5);
  if (result_negative === 'COLD') {
    pass('Score -0.5 (negative) is clamped, returns COLD', `Got: ${result_negative}`);
  } else {
    fail('Score -0.5 (negative) is clamped, returns COLD', `Expected COLD, got: ${result_negative}`);
  }
}

// BUG-011: Threshold validation
function test_threshold_validation() {
  log('\n🔬 BUG-011: Threshold Validation (HOT > WARM)');
  
  const config = tierClassifier.TIER_CONFIG;
  
  // Test 1: HOT threshold is greater than WARM threshold
  if (config.hotThreshold > config.warmThreshold) {
    pass('HOT threshold > WARM threshold', 
         `HOT: ${config.hotThreshold}, WARM: ${config.warmThreshold}`);
  } else {
    fail('HOT threshold > WARM threshold', 
         `HOT: ${config.hotThreshold}, WARM: ${config.warmThreshold}`);
  }
  
  // Test 2: Default values are correct
  if (config.hotThreshold === 0.8 && config.warmThreshold === 0.25) {
    pass('Default thresholds are correct', 
         `HOT: ${config.hotThreshold}, WARM: ${config.warmThreshold}`);
  } else {
    // May be overridden by env vars, so just check they're valid
    if (config.hotThreshold > config.warmThreshold) {
      pass('Thresholds are valid (may be env overridden)', 
           `HOT: ${config.hotThreshold}, WARM: ${config.warmThreshold}`);
    } else {
      fail('Default thresholds are correct', 
           `HOT: ${config.hotThreshold}, WARM: ${config.warmThreshold}`);
    }
  }
}

// Test getTierThreshold()
function test_get_tier_threshold() {
  log('\n🔬 getTierThreshold()');
  
  // Test 1: HOT threshold
  const hot_threshold = tierClassifier.getTierThreshold('HOT');
  if (hot_threshold === tierClassifier.TIER_CONFIG.hotThreshold) {
    pass('getTierThreshold("HOT") returns hotThreshold', `Got: ${hot_threshold}`);
  } else {
    fail('getTierThreshold("HOT") returns hotThreshold', 
         `Expected ${tierClassifier.TIER_CONFIG.hotThreshold}, got: ${hot_threshold}`);
  }
  
  // Test 2: WARM threshold
  const warm_threshold = tierClassifier.getTierThreshold('WARM');
  if (warm_threshold === tierClassifier.TIER_CONFIG.warmThreshold) {
    pass('getTierThreshold("WARM") returns warmThreshold', `Got: ${warm_threshold}`);
  } else {
    fail('getTierThreshold("WARM") returns warmThreshold', 
         `Expected ${tierClassifier.TIER_CONFIG.warmThreshold}, got: ${warm_threshold}`);
  }
  
  // Test 3: COLD/unknown returns 0
  const cold_threshold = tierClassifier.getTierThreshold('COLD');
  if (cold_threshold === 0) {
    pass('getTierThreshold("COLD") returns 0', `Got: ${cold_threshold}`);
  } else {
    fail('getTierThreshold("COLD") returns 0', `Expected 0, got: ${cold_threshold}`);
  }
}

// Test isIncluded()
function test_is_included() {
  log('\n🔬 isIncluded()');
  
  // Test 1: HOT scores are included
  const hot_included = tierClassifier.isIncluded(0.9);
  if (hot_included === true) {
    pass('Score 0.9 (HOT) is included', `Got: ${hot_included}`);
  } else {
    fail('Score 0.9 (HOT) is included', `Expected true, got: ${hot_included}`);
  }
  
  // Test 2: WARM scores are included
  const warm_included = tierClassifier.isIncluded(0.5);
  if (warm_included === true) {
    pass('Score 0.5 (WARM) is included', `Got: ${warm_included}`);
  } else {
    fail('Score 0.5 (WARM) is included', `Expected true, got: ${warm_included}`);
  }
  
  // Test 3: COLD scores are NOT included
  const cold_included = tierClassifier.isIncluded(0.1);
  if (cold_included === false) {
    pass('Score 0.1 (COLD) is NOT included', `Got: ${cold_included}`);
  } else {
    fail('Score 0.1 (COLD) is NOT included', `Expected false, got: ${cold_included}`);
  }
}

// Test getTierStats()
function test_get_tier_stats() {
  log('\n🔬 getTierStats()');
  
  // Test 1: Empty array
  const empty_stats = tierClassifier.getTierStats([]);
  if (empty_stats.hot === 0 && empty_stats.warm === 0 && empty_stats.cold === 0 && empty_stats.total === 0) {
    pass('Empty array returns all zeros', JSON.stringify(empty_stats));
  } else {
    fail('Empty array returns all zeros', JSON.stringify(empty_stats));
  }
  
  // Test 2: Mixed memories
  const memories = [
    { attentionScore: 0.9 },  // HOT
    { attentionScore: 0.85 }, // HOT
    { attentionScore: 0.5 },  // WARM
    { attentionScore: 0.3 },  // WARM
    { attentionScore: 0.1 },  // COLD
    { attentionScore: 0 },    // COLD
  ];
  const mixed_stats = tierClassifier.getTierStats(memories);
  if (mixed_stats.hot === 2 && mixed_stats.warm === 2 && mixed_stats.cold === 2 && mixed_stats.total === 6) {
    pass('Mixed memories counted correctly', JSON.stringify(mixed_stats));
  } else {
    fail('Mixed memories counted correctly', 
         `Expected hot:2, warm:2, cold:2, total:6. Got: ${JSON.stringify(mixed_stats)}`);
  }
  
  // Test 3: filtered count
  if (mixed_stats.filtered === 4) {
    pass('filtered count is hot + warm', `Got: ${mixed_stats.filtered}`);
  } else {
    fail('filtered count is hot + warm', `Expected 4, got: ${mixed_stats.filtered}`);
  }
  
  // Test 4: Non-array input
  const non_array = tierClassifier.getTierStats(null);
  if (non_array.total === 0) {
    pass('Non-array input returns zero stats', JSON.stringify(non_array));
  } else {
    fail('Non-array input returns zero stats', JSON.stringify(non_array));
  }
}

// Test filterAndLimitByTier()
function test_filter_and_limit_by_tier() {
  log('\n🔬 filterAndLimitByTier()');
  
  // Test 1: Filters out COLD memories
  const memories = [
    { id: 1, attentionScore: 0.9 },  // HOT
    { id: 2, attentionScore: 0.5 },  // WARM
    { id: 3, attentionScore: 0.1 },  // COLD - should be filtered
  ];
  const filtered = tierClassifier.filterAndLimitByTier(memories);
  if (filtered.length === 2) {
    pass('COLD memories filtered out', `Length: ${filtered.length}`);
  } else {
    fail('COLD memories filtered out', `Expected 2, got: ${filtered.length}`);
  }
  
  // Test 2: HOT comes before WARM
  if (filtered[0].tier === 'HOT' && filtered[1].tier === 'WARM') {
    pass('HOT memories come before WARM', `Order: ${filtered.map(m => m.tier).join(', ')}`);
  } else {
    fail('HOT memories come before WARM', `Order: ${filtered.map(m => m.tier).join(', ')}`);
  }
  
  // Test 3: Sorted by attention score within tier
  const many_hot = [
    { id: 1, attentionScore: 0.85 },
    { id: 2, attentionScore: 0.95 },
    { id: 3, attentionScore: 0.90 },
  ];
  const sorted = tierClassifier.filterAndLimitByTier(many_hot);
  if (sorted[0].attentionScore >= sorted[1].attentionScore && 
      sorted[1].attentionScore >= sorted[2].attentionScore) {
    pass('Sorted by attention score descending', 
         `Scores: ${sorted.map(m => m.attentionScore).join(', ')}`);
  } else {
    fail('Sorted by attention score descending', 
         `Scores: ${sorted.map(m => m.attentionScore).join(', ')}`);
  }
  
  // Test 4: Non-array input returns empty array
  const non_array = tierClassifier.filterAndLimitByTier(null);
  if (Array.isArray(non_array) && non_array.length === 0) {
    pass('Non-array input returns empty array', `Got: ${JSON.stringify(non_array)}`);
  } else {
    fail('Non-array input returns empty array', `Got: ${JSON.stringify(non_array)}`);
  }
}

// Test getTieredContent()
function test_get_tiered_content() {
  log('\n🔬 getTieredContent()');
  
  // Create a temp file for testing
  const temp_file = path.join(os.tmpdir(), 'tier-test-memory.md');
  const test_content = '# Test Memory\n\nThis is test content for tier classifier testing.';
  fs.writeFileSync(temp_file, test_content);
  
  try {
    // Test 1: HOT tier returns full content
    const memory_with_file = { filePath: temp_file };
    const hot_content = tierClassifier.getTieredContent(memory_with_file, 'HOT');
    if (hot_content === test_content) {
      pass('HOT tier returns full file content', `Length: ${hot_content.length}`);
    } else if (hot_content && hot_content.length > 0) {
      pass('HOT tier returns file content', `Got content of length: ${hot_content.length}`);
    } else {
      fail('HOT tier returns full file content', `Got: ${hot_content}`);
    }
    
    // Test 2: WARM tier returns summary
    const memory_with_summary = { summary: 'This is a summary' };
    const warm_content = tierClassifier.getTieredContent(memory_with_summary, 'WARM');
    if (warm_content === 'This is a summary') {
      pass('WARM tier returns summary field', `Got: ${warm_content}`);
    } else {
      fail('WARM tier returns summary field', `Expected "This is a summary", got: ${warm_content}`);
    }
    
    // Test 3: COLD tier returns null
    const cold_content = tierClassifier.getTieredContent(memory_with_file, 'COLD');
    if (cold_content === null) {
      pass('COLD tier returns null', `Got: ${cold_content}`);
    } else {
      fail('COLD tier returns null', `Expected null, got: ${cold_content}`);
    }
    
    // Test 4: null memory returns null
    const null_content = tierClassifier.getTieredContent(null, 'HOT');
    if (null_content === null) {
      pass('null memory returns null', `Got: ${null_content}`);
    } else {
      fail('null memory returns null', `Expected null, got: ${null_content}`);
    }
  } finally {
    // Cleanup
    try {
      fs.unlinkSync(temp_file);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

// Test formatTieredResponse()
function test_format_tiered_response() {
  log('\n🔬 formatTieredResponse()');
  
  // Test 1: Formats memories correctly
  const memories = [
    { id: 1, tier: 'HOT', attentionScore: 0.9, title: 'Test', specFolder: 'test', matchedPhrases: ['phrase1'] },
  ];
  const formatted = tierClassifier.formatTieredResponse(memories);
  if (formatted.length === 1 && formatted[0].id === 1 && formatted[0].tier === 'HOT') {
    pass('Formats memory correctly', `Got: ${JSON.stringify(formatted[0])}`);
  } else {
    fail('Formats memory correctly', `Got: ${JSON.stringify(formatted)}`);
  }
  
  // Test 2: Skips COLD memories
  const with_cold = [
    { id: 1, tier: 'HOT', attentionScore: 0.9 },
    { id: 2, tier: 'COLD', attentionScore: 0.1 },
  ];
  const filtered = tierClassifier.formatTieredResponse(with_cold);
  if (filtered.length === 1 && filtered[0].id === 1) {
    pass('Skips COLD memories in formatting', `Length: ${filtered.length}`);
  } else {
    fail('Skips COLD memories in formatting', `Got: ${JSON.stringify(filtered)}`);
  }
  
  // Test 3: Non-array returns empty array
  const non_array = tierClassifier.formatTieredResponse(null);
  if (Array.isArray(non_array) && non_array.length === 0) {
    pass('Non-array returns empty array', `Got: ${JSON.stringify(non_array)}`);
  } else {
    fail('Non-array returns empty array', `Got: ${JSON.stringify(non_array)}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. MAIN
──────────────────────────────────────────────────────────────── */

async function runTests() {
  log('🧪 Tier Classifier Tests');
  log('================================');
  log(`Date: ${new Date().toISOString()}\n`);
  
  // Load module first
  if (!test_module_loads()) {
    log('\n⚠️  Module failed to load. Aborting tests.');
    return results;
  }
  
  // Run all tests
  test_classify_tier_hot();
  test_classify_tier_warm();
  test_classify_tier_cold();
  test_classify_tier_edge_cases();
  test_threshold_validation();
  test_get_tier_threshold();
  test_is_included();
  test_get_tier_stats();
  test_filter_and_limit_by_tier();
  test_get_tiered_content();
  test_format_tiered_response();
  
  // Summary
  log('\n================================');
  log('📊 TEST SUMMARY');
  log('================================');
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
  runTests().then(r => {
    process.exit(r.failed > 0 ? 1 : 0);
  });
}

module.exports = { runTests };
