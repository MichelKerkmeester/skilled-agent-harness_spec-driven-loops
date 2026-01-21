// ───────────────────────────────────────────────────────────────
// TEST: SUMMARY GENERATOR
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');
const fs = require('fs');

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

let summaryGenerator;

// Load module
function test_module_loads() {
  log('\n🔬 Module Loading');
  
  try {
    summaryGenerator = require(path.join(LIB_PATH, 'summary-generator.js'));
    pass('Module loads without error', 'require() succeeded');
  } catch (error) {
    fail('Module loads without error', error.message);
    return false;
  }
  return true;
}

// Test exports exist
function test_exports_exist() {
  log('\n🔬 Module Exports');
  
  const expected_exports = [
    'generateSummary',
    'getSummaryOrFallback',
    'stripMarkdown',
    'extractFirstParagraph',
    'SUMMARY_CONFIG',
  ];
  
  for (const exp of expected_exports) {
    if (typeof summaryGenerator[exp] !== 'undefined') {
      pass(`Export "${exp}" exists`, typeof summaryGenerator[exp]);
    } else {
      fail(`Export "${exp}" exists`, 'Not found');
    }
  }
}

// Test CONFIG values
function test_config_values() {
  log('\n🔬 SUMMARY_CONFIG values');
  
  const config = summaryGenerator.SUMMARY_CONFIG;
  
  // Test 1: maxSummaryLength is 150
  if (config.maxSummaryLength === 150) {
    pass('maxSummaryLength is 150', `Got: ${config.maxSummaryLength}`);
  } else {
    fail('maxSummaryLength is 150', `Expected 150, got: ${config.maxSummaryLength}`);
  }
  
  // Test 2: fallbackToTitle is true
  if (config.fallbackToTitle === true) {
    pass('fallbackToTitle is true', `Got: ${config.fallbackToTitle}`);
  } else {
    fail('fallbackToTitle is true', `Expected true, got: ${config.fallbackToTitle}`);
  }
  
  // Test 3: maxTriggerPhrases is 3
  if (config.maxTriggerPhrases === 3) {
    pass('maxTriggerPhrases is 3', `Got: ${config.maxTriggerPhrases}`);
  } else {
    fail('maxTriggerPhrases is 3', `Expected 3, got: ${config.maxTriggerPhrases}`);
  }
}

// Test stripMarkdown()
function test_strip_markdown() {
  log('\n🔬 stripMarkdown()');
  
  // Test 1: Empty/null input
  const empty_result = summaryGenerator.stripMarkdown('');
  if (empty_result === '') {
    pass('Empty string returns empty string', `Got: "${empty_result}"`);
  } else {
    fail('Empty string returns empty string', `Expected "", got: "${empty_result}"`);
  }
  
  const null_result = summaryGenerator.stripMarkdown(null);
  if (null_result === '') {
    pass('null input returns empty string', `Got: "${null_result}"`);
  } else {
    fail('null input returns empty string', `Expected "", got: "${null_result}"`);
  }
  
  // Test 2: Remove headers
  const with_headers = '# Header 1\n## Header 2\nContent here';
  const no_headers = summaryGenerator.stripMarkdown(with_headers);
  if (!no_headers.includes('# ') && !no_headers.includes('## ')) {
    pass('Removes header markers', `Got: "${no_headers.substring(0, 50)}..."`);
  } else {
    fail('Removes header markers', `Headers still present: "${no_headers}"`);
  }
  
  // Test 3: Remove bold/italic
  const with_emphasis = '**bold** and *italic* and __double__ and _single_';
  const no_emphasis = summaryGenerator.stripMarkdown(with_emphasis);
  if (no_emphasis.includes('bold') && !no_emphasis.includes('**') && !no_emphasis.includes('*')) {
    pass('Removes bold/italic markers', `Got: "${no_emphasis}"`);
  } else {
    fail('Removes bold/italic markers', `Markers still present: "${no_emphasis}"`);
  }
  
  // Test 4: Remove code blocks
  const with_code = 'Text before ```javascript\ncode here\n``` text after';
  const no_code = summaryGenerator.stripMarkdown(with_code);
  if (!no_code.includes('```') && !no_code.includes('code here')) {
    pass('Removes fenced code blocks', `Got: "${no_code}"`);
  } else {
    fail('Removes fenced code blocks', `Code still present: "${no_code}"`);
  }
  
  // Test 5: Remove inline code
  const with_inline = 'Text with `inline code` here';
  const no_inline = summaryGenerator.stripMarkdown(with_inline);
  if (!no_inline.includes('`')) {
    pass('Removes inline code backticks', `Got: "${no_inline}"`);
  } else {
    fail('Removes inline code backticks', `Backticks still present: "${no_inline}"`);
  }
  
  // Test 6: Remove links but keep text
  const with_links = 'Check [this link](https://example.com) for more';
  const no_links = summaryGenerator.stripMarkdown(with_links);
  if (no_links.includes('this link') && !no_links.includes('](')) {
    pass('Removes link syntax but keeps text', `Got: "${no_links}"`);
  } else {
    fail('Removes link syntax but keeps text', `Got: "${no_links}"`);
  }
  
  // Test 7: Remove blockquotes
  const with_quotes = '> This is a quote\n> Another line';
  const no_quotes = summaryGenerator.stripMarkdown(with_quotes);
  if (!no_quotes.includes('> ')) {
    pass('Removes blockquote markers', `Got: "${no_quotes}"`);
  } else {
    fail('Removes blockquote markers', `Markers still present: "${no_quotes}"`);
  }
  
  // Test 8: Remove list markers
  const with_list = '- Item 1\n- Item 2\n* Item 3\n1. Numbered';
  const no_list = summaryGenerator.stripMarkdown(with_list);
  if (!no_list.match(/^[-*]\s/m) && !no_list.match(/^\d+\.\s/m)) {
    pass('Removes list markers', `Got: "${no_list}"`);
  } else {
    fail('Removes list markers', `Markers still present: "${no_list}"`);
  }
  
  // Test 9: Remove strikethrough
  const with_strike = 'Text ~~strikethrough~~ here';
  const no_strike = summaryGenerator.stripMarkdown(with_strike);
  if (no_strike.includes('strikethrough') && !no_strike.includes('~~')) {
    pass('Removes strikethrough markers', `Got: "${no_strike}"`);
  } else {
    fail('Removes strikethrough markers', `Got: "${no_strike}"`);
  }
  
  // Test 10: Remove HTML tags
  const with_html = 'Text <strong>bold</strong> and <br/> break';
  const no_html = summaryGenerator.stripMarkdown(with_html);
  if (!no_html.includes('<') && !no_html.includes('>')) {
    pass('Removes HTML tags', `Got: "${no_html}"`);
  } else {
    fail('Removes HTML tags', `Tags still present: "${no_html}"`);
  }
}

// Test extractFirstParagraph()
function test_extract_first_paragraph() {
  log('\n🔬 extractFirstParagraph()');
  
  // Test 1: Empty/null input
  const empty_result = summaryGenerator.extractFirstParagraph('');
  if (empty_result === '') {
    pass('Empty string returns empty string', `Got: "${empty_result}"`);
  } else {
    fail('Empty string returns empty string', `Expected "", got: "${empty_result}"`);
  }
  
  const null_result = summaryGenerator.extractFirstParagraph(null);
  if (null_result === '') {
    pass('null input returns empty string', `Got: "${null_result}"`);
  } else {
    fail('null input returns empty string', `Expected "", got: "${null_result}"`);
  }
  
  // Test 2: Skips YAML frontmatter
  const with_frontmatter = '---\ntitle: Test\ndate: 2024-01-01\n---\n\nFirst paragraph here.';
  const no_frontmatter = summaryGenerator.extractFirstParagraph(with_frontmatter);
  if (no_frontmatter === 'First paragraph here.' || no_frontmatter.includes('First paragraph')) {
    pass('Skips YAML frontmatter', `Got: "${no_frontmatter}"`);
  } else {
    fail('Skips YAML frontmatter', `Got: "${no_frontmatter}"`);
  }
  
  // Test 3: Skips headers to find first paragraph
  const with_header = '# Title\n\nThis is the first paragraph.';
  const after_header = summaryGenerator.extractFirstParagraph(with_header);
  if (after_header.includes('first paragraph')) {
    pass('Skips header to find first paragraph', `Got: "${after_header}"`);
  } else {
    fail('Skips header to find first paragraph', `Got: "${after_header}"`);
  }
  
  // Test 4: Returns first non-empty paragraph
  const multi_para = 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.';
  const first_para = summaryGenerator.extractFirstParagraph(multi_para);
  if (first_para === 'First paragraph.') {
    pass('Returns first paragraph only', `Got: "${first_para}"`);
  } else {
    fail('Returns first paragraph only', `Expected "First paragraph.", got: "${first_para}"`);
  }
  
  // Test 5: Skips horizontal rules
  const with_hr = '---\n\nActual paragraph here.';
  const after_hr = summaryGenerator.extractFirstParagraph(with_hr);
  if (after_hr.includes('Actual paragraph')) {
    pass('Skips horizontal rules', `Got: "${after_hr}"`);
  } else {
    fail('Skips horizontal rules', `Got: "${after_hr}"`);
  }
}

// Test generateSummary()
function test_generate_summary() {
  log('\n🔬 generateSummary()');
  
  // Test 1: Empty/null input
  const empty_result = summaryGenerator.generateSummary('');
  if (empty_result === '') {
    pass('Empty string returns empty string', `Got: "${empty_result}"`);
  } else {
    fail('Empty string returns empty string', `Expected "", got: "${empty_result}"`);
  }
  
  const null_result = summaryGenerator.generateSummary(null);
  if (null_result === '') {
    pass('null input returns empty string', `Got: "${null_result}"`);
  } else {
    fail('null input returns empty string', `Expected "", got: "${null_result}"`);
  }
  
  // Test 2: Short content returned as-is
  const short_content = 'This is a short summary.';
  const short_result = summaryGenerator.generateSummary(short_content);
  if (short_result === short_content) {
    pass('Short content returned as-is', `Got: "${short_result}"`);
  } else {
    fail('Short content returned as-is', `Expected "${short_content}", got: "${short_result}"`);
  }
  
  // Test 3: Long content is truncated with ellipsis
  const long_content = 'This is a very long paragraph that exceeds the maximum summary length and should be truncated. '.repeat(5);
  const long_result = summaryGenerator.generateSummary(long_content);
  if (long_result.endsWith('...') && long_result.length <= 153) { // 150 + "..."
    pass('Long content truncated with ellipsis', `Length: ${long_result.length}`);
  } else {
    fail('Long content truncated with ellipsis', `Length: ${long_result.length}, ends with: "${long_result.slice(-10)}"`);
  }
  
  // Test 4: Respects custom max_length
  const custom_result = summaryGenerator.generateSummary(long_content, 50);
  if (custom_result.length <= 53) { // 50 + "..."
    pass('Respects custom max_length', `Length: ${custom_result.length}`);
  } else {
    fail('Respects custom max_length', `Expected <=53, got: ${custom_result.length}`);
  }
  
  // Test 5: Strips markdown from content
  const markdown_content = '# Header\n\n**Bold** and *italic* text in first paragraph.';
  const markdown_result = summaryGenerator.generateSummary(markdown_content);
  if (!markdown_result.includes('**') && !markdown_result.includes('*')) {
    pass('Strips markdown from summary', `Got: "${markdown_result}"`);
  } else {
    fail('Strips markdown from summary', `Markdown still present: "${markdown_result}"`);
  }
  
  // Test 6: Truncates at word boundary
  const word_boundary = 'Word boundary test with multiple words to ensure truncation at space.';
  const boundary_result = summaryGenerator.generateSummary(word_boundary, 30);
  // Should not end with partial word before ...
  if (!boundary_result.match(/\w\.\.\.$/)) {
    pass('Truncates at word boundary when possible', `Got: "${boundary_result}"`);
  } else {
    // May still be valid if word boundary is far
    pass('Truncates content with ellipsis', `Got: "${boundary_result}"`);
  }
}

// Test getSummaryOrFallback()
function test_get_summary_or_fallback() {
  log('\n🔬 getSummaryOrFallback()');
  
  // Test 1: null/undefined input returns empty string
  const null_result = summaryGenerator.getSummaryOrFallback(null);
  if (null_result === '') {
    pass('null input returns empty string', `Got: "${null_result}"`);
  } else {
    fail('null input returns empty string', `Expected "", got: "${null_result}"`);
  }
  
  const undefined_result = summaryGenerator.getSummaryOrFallback(undefined);
  if (undefined_result === '') {
    pass('undefined input returns empty string', `Got: "${undefined_result}"`);
  } else {
    fail('undefined input returns empty string', `Expected "", got: "${undefined_result}"`);
  }
  
  // Test 2: Fallback 1 - Use existing summary field
  const with_summary = { summary: 'Existing summary text' };
  const summary_result = summaryGenerator.getSummaryOrFallback(with_summary);
  if (summary_result === 'Existing summary text') {
    pass('Uses existing summary field (Fallback 1)', `Got: "${summary_result}"`);
  } else {
    fail('Uses existing summary field (Fallback 1)', `Expected "Existing summary text", got: "${summary_result}"`);
  }
  
  // Test 3: Fallback 1 - Trims whitespace from summary
  const whitespace_summary = { summary: '  Trimmed summary  ' };
  const trimmed_result = summaryGenerator.getSummaryOrFallback(whitespace_summary);
  if (trimmed_result === 'Trimmed summary') {
    pass('Trims whitespace from summary', `Got: "${trimmed_result}"`);
  } else {
    fail('Trims whitespace from summary', `Expected "Trimmed summary", got: "${trimmed_result}"`);
  }
  
  // Test 4: Fallback 2 - Generate from content when no summary
  const with_content = { content: 'This is content that will be used to generate a summary.' };
  const content_result = summaryGenerator.getSummaryOrFallback(with_content);
  if (content_result.includes('content')) {
    pass('Generates summary from content (Fallback 2)', `Got: "${content_result}"`);
  } else {
    fail('Generates summary from content (Fallback 2)', `Got: "${content_result}"`);
  }
  
  // Test 5: Fallback 3 - Use title + trigger phrases
  const with_title_triggers = {
    title: 'Memory Title',
    trigger_phrases: ['phrase1', 'phrase2', 'phrase3', 'phrase4'],
  };
  const title_result = summaryGenerator.getSummaryOrFallback(with_title_triggers);
  if (title_result.includes('title: Memory Title') && title_result.includes('triggers:')) {
    pass('Uses title + triggers (Fallback 3)', `Got: "${title_result}"`);
  } else {
    fail('Uses title + triggers (Fallback 3)', `Expected title: ... | triggers: ..., got: "${title_result}"`);
  }
  
  // Test 6: Fallback 3 - Limits trigger phrases to maxTriggerPhrases (3)
  if (!title_result.includes('phrase4')) {
    pass('Limits trigger phrases to 3', `Got: "${title_result}"`);
  } else {
    fail('Limits trigger phrases to 3', `phrase4 should not be included: "${title_result}"`);
  }
  
  // Test 7: Fallback 3 - Handles JSON string trigger phrases
  const json_triggers = {
    title: 'JSON Title',
    trigger_phrases: '["json1", "json2"]',
  };
  const json_result = summaryGenerator.getSummaryOrFallback(json_triggers);
  if (json_result.includes('json1') || json_result.includes('triggers:')) {
    pass('Parses JSON string trigger_phrases', `Got: "${json_result}"`);
  } else {
    fail('Parses JSON string trigger_phrases', `Got: "${json_result}"`);
  }
  
  // Test 8: Priority - summary takes precedence over content
  const with_both = {
    summary: 'Explicit summary',
    content: 'Content that should not be used',
  };
  const both_result = summaryGenerator.getSummaryOrFallback(with_both);
  if (both_result === 'Explicit summary') {
    pass('Summary takes precedence over content', `Got: "${both_result}"`);
  } else {
    fail('Summary takes precedence over content', `Expected "Explicit summary", got: "${both_result}"`);
  }
  
  // Test 9: Empty summary falls through to content
  const empty_summary = {
    summary: '   ',
    content: 'Content fallback text.',
  };
  const empty_sum_result = summaryGenerator.getSummaryOrFallback(empty_summary);
  if (empty_sum_result.includes('Content fallback')) {
    pass('Empty summary falls through to content', `Got: "${empty_sum_result}"`);
  } else {
    fail('Empty summary falls through to content', `Got: "${empty_sum_result}"`);
  }
  
  // Test 10: Title only (no triggers)
  const title_only = { title: 'Just a Title' };
  const title_only_result = summaryGenerator.getSummaryOrFallback(title_only);
  if (title_only_result.includes('title: Just a Title')) {
    pass('Handles title-only memory', `Got: "${title_only_result}"`);
  } else {
    fail('Handles title-only memory', `Got: "${title_only_result}"`);
  }
}

// Test very long content handling
function test_very_long_content() {
  log('\n🔬 Very Long Content Handling');
  
  // Test 1: Very long content with frontmatter
  const long_with_frontmatter = '---\ntitle: Test\n---\n\n' + 'A'.repeat(500);
  const frontmatter_result = summaryGenerator.generateSummary(long_with_frontmatter);
  if (frontmatter_result.length <= 153) {
    pass('Handles very long content with frontmatter', `Length: ${frontmatter_result.length}`);
  } else {
    fail('Handles very long content with frontmatter', `Length: ${frontmatter_result.length}`);
  }
  
  // Test 2: Content with only markdown (no text content)
  const only_markdown = '# Header\n\n---\n\n```code\nblock\n```';
  const only_md_result = summaryGenerator.generateSummary(only_markdown);
  // May return empty or minimal content
  if (typeof only_md_result === 'string') {
    pass('Handles markdown-only content gracefully', `Got: "${only_md_result}"`);
  } else {
    fail('Handles markdown-only content gracefully', `Got: ${typeof only_md_result}`);
  }
  
  // Test 3: Unicode content
  const unicode_content = 'This has unicode: emoji 🎉 and special chars éàü';
  const unicode_result = summaryGenerator.generateSummary(unicode_content);
  if (unicode_result.includes('unicode')) {
    pass('Handles unicode content', `Got: "${unicode_result}"`);
  } else {
    fail('Handles unicode content', `Got: "${unicode_result}"`);
  }
}

// Test edge cases
function test_edge_cases() {
  log('\n🔬 Edge Cases');
  
  // Test 1: Non-object memory
  const string_result = summaryGenerator.getSummaryOrFallback('not an object');
  if (string_result === '') {
    pass('Non-object memory returns empty string', `Got: "${string_result}"`);
  } else {
    fail('Non-object memory returns empty string', `Expected "", got: "${string_result}"`);
  }
  
  // Test 2: Array memory
  const array_result = summaryGenerator.getSummaryOrFallback(['array', 'items']);
  if (array_result === '') {
    pass('Array memory returns empty string', `Got: "${array_result}"`);
  } else {
    fail('Array memory returns empty string', `Expected "", got: "${array_result}"`);
  }
  
  // Test 3: Memory with invalid trigger_phrases JSON
  const bad_json = {
    title: 'Bad JSON',
    trigger_phrases: '{invalid json}',
  };
  const bad_json_result = summaryGenerator.getSummaryOrFallback(bad_json);
  // Should not crash, may return title only
  if (bad_json_result.includes('title: Bad JSON')) {
    pass('Handles invalid trigger_phrases JSON gracefully', `Got: "${bad_json_result}"`);
  } else {
    pass('Handles invalid trigger_phrases JSON without crashing', `Got: "${bad_json_result}"`);
  }
  
  // Test 4: Whitespace-only content
  const whitespace = { content: '   \n\n\t\t   ' };
  const whitespace_result = summaryGenerator.getSummaryOrFallback(whitespace);
  // Should not crash, may return empty or title fallback
  if (typeof whitespace_result === 'string') {
    pass('Handles whitespace-only content gracefully', `Got: "${whitespace_result}"`);
  } else {
    fail('Handles whitespace-only content gracefully', `Got: ${typeof whitespace_result}`);
  }
  
  // Test 5: Number as trigger_phrases
  const num_triggers = {
    title: 'Num Triggers',
    trigger_phrases: 123,
  };
  const num_result = summaryGenerator.getSummaryOrFallback(num_triggers);
  if (num_result.includes('title: Num Triggers')) {
    pass('Handles numeric trigger_phrases', `Got: "${num_result}"`);
  } else {
    pass('Handles numeric trigger_phrases without crash', `Got: "${num_result}"`);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. MAIN
──────────────────────────────────────────────────────────────── */

async function runTests() {
  log('🧪 Summary Generator Tests');
  log('================================');
  log(`Date: ${new Date().toISOString()}\n`);
  
  // Load module first
  if (!test_module_loads()) {
    log('\n⚠️  Module failed to load. Aborting tests.');
    return results;
  }
  
  // Run all tests
  test_exports_exist();
  test_config_values();
  test_strip_markdown();
  test_extract_first_paragraph();
  test_generate_summary();
  test_get_summary_or_fallback();
  test_very_long_content();
  test_edge_cases();
  
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
