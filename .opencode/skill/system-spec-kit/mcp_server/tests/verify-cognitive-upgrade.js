// ───────────────────────────────────────────────────────────────
// COGNITIVE: VERIFY COGNITIVE UPGRADE
// ───────────────────────────────────────────────────────────────
'use strict';

/**
 * Verification Script
 * Comprehensive verification of all cognitive memory upgrade implementation changes.
 */

const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('  COGNITIVE MEMORY UPGRADE - COMPREHENSIVE VERIFICATION');
console.log('═══════════════════════════════════════════════════════════════════');

// Change to mcp_server directory
process.chdir(path.join(__dirname, '..'));

/* ─────────────────────────────────────────────────────────────
   1. FILE EXISTENCE CHECK
──────────────────────────────────────────────────────────────── */

const files = [
  'lib/cognitive/fsrs-scheduler.js',
  'lib/cognitive/prediction-error-gate.js',
  'lib/cognitive/tier-classifier.js',
  'lib/cognitive/attention-decay.js',
  'lib/scoring/composite-scoring.js',
  'handlers/memory-save.js',
  'handlers/memory-search.js',
  'lib/search/vector-index.js',
  'tests/fsrs-scheduler.test.js',
];

console.log('\n[1] FILE EXISTENCE CHECK');
let all_files_exist = true;
files.forEach(f => {
  const exists = fs.existsSync(f);
  if (!exists) all_files_exist = false;
  console.log('  ' + (exists ? '✓' : '✗') + ' ' + f);
});

/* ─────────────────────────────────────────────────────────────
   2. MODULE LOADING CHECK
──────────────────────────────────────────────────────────────── */

console.log('\n[2] MODULE LOADING CHECK');
const modules = {};
let all_modules_load = true;

try {
  modules.fsrs = require('../lib/cognitive/fsrs-scheduler');
  console.log('  ✓ fsrs-scheduler.js loads');
} catch (e) {
  console.log('  ✗ fsrs-scheduler.js:', e.message);
  all_modules_load = false;
}

try {
  modules.pe = require('../lib/cognitive/prediction-error-gate');
  console.log('  ✓ prediction-error-gate.js loads');
} catch (e) {
  console.log('  ✗ prediction-error-gate.js:', e.message);
  all_modules_load = false;
}

try {
  modules.tier = require('../lib/cognitive/tier-classifier');
  console.log('  ✓ tier-classifier.js loads');
} catch (e) {
  console.log('  ✗ tier-classifier.js:', e.message);
  all_modules_load = false;
}

try {
  modules.decay = require('../lib/cognitive/attention-decay');
  console.log('  ✓ attention-decay.js loads');
} catch (e) {
  console.log('  ✗ attention-decay.js:', e.message);
  all_modules_load = false;
}

try {
  modules.scoring = require('../lib/scoring/composite-scoring');
  console.log('  ✓ composite-scoring.js loads');
} catch (e) {
  console.log('  ✗ composite-scoring.js:', e.message);
  all_modules_load = false;
}

/* ─────────────────────────────────────────────────────────────
   3. KEY FUNCTIONS CHECK
──────────────────────────────────────────────────────────────── */

console.log('\n[3] KEY FUNCTIONS CHECK');
let all_functions_exist = true;
const checks = [
  ['FSRS', 'calculate_retrievability', modules.fsrs && modules.fsrs.calculate_retrievability],
  ['FSRS', 'update_stability', modules.fsrs && modules.fsrs.update_stability],
  ['PE Gate', 'evaluate_memory', modules.pe && modules.pe.evaluate_memory],
  ['PE Gate', 'detect_contradiction', modules.pe && modules.pe.detect_contradiction],
  ['Tier', 'classifyState', modules.tier && modules.tier.classifyState],
  ['Tier', 'STATE_THRESHOLDS', modules.tier && modules.tier.STATE_THRESHOLDS],
  ['Decay', 'calculateRetrievabilityDecay', modules.decay && modules.decay.calculateRetrievabilityDecay],
  ['Decay', 'applyFsrsDecay', modules.decay && modules.decay.applyFsrsDecay],
  ['Scoring', 'calculate_retrievability_score', modules.scoring && modules.scoring.calculate_retrievability_score],
  ['Scoring', 'retrievability weight', modules.scoring && modules.scoring.DEFAULT_WEIGHTS && modules.scoring.DEFAULT_WEIGHTS.retrievability],
];

checks.forEach(function(c) {
  const mod = c[0], fn = c[1], val = c[2];
  const exists = typeof val === 'function' || (val !== undefined && val !== null);
  if (!exists) all_functions_exist = false;
  console.log('  ' + (exists ? '✓' : '✗') + ' ' + mod + '.' + fn);
});

/* ─────────────────────────────────────────────────────────────
   4. FSRS FORMULA VERIFICATION
──────────────────────────────────────────────────────────────── */

console.log('\n[4] FSRS FORMULA VERIFICATION');
let fsrs_correct = true;
if (modules.fsrs) {
  const r0 = modules.fsrs.calculate_retrievability(1.0, 0);
  const r1 = modules.fsrs.calculate_retrievability(1.0, 1);
  const expected_r1 = Math.pow(1 + (19/81) * 1, -0.5);

  if (r0 !== 1.0) fsrs_correct = false;
  if (Math.abs(r1 - expected_r1) > 0.0001) fsrs_correct = false;

  console.log('  ' + (r0 === 1.0 ? '✓' : '✗') + ' R(S=1, t=0) = ' + r0 + ' (expected: 1.0)');
  console.log('  ' + (Math.abs(r1 - expected_r1) < 0.0001 ? '✓' : '✗') + ' R(S=1, t=1) = ' + r1.toFixed(4) + ' (expected: ' + expected_r1.toFixed(4) + ')');
}

/* ─────────────────────────────────────────────────────────────
   5. PE GATE THRESHOLDS
──────────────────────────────────────────────────────────────── */

console.log('\n[5] PE GATE THRESHOLDS');
let pe_correct = true;
if (modules.pe && modules.pe.THRESHOLD) {
  const t = modules.pe.THRESHOLD;
  if (t.DUPLICATE !== 0.95) pe_correct = false;
  if (t.HIGH_MATCH !== 0.90) pe_correct = false;
  if (t.MEDIUM_MATCH !== 0.70) pe_correct = false;

  console.log('  ' + (t.DUPLICATE === 0.95 ? '✓' : '✗') + ' DUPLICATE: ' + t.DUPLICATE + ' (expected: 0.95)');
  console.log('  ' + (t.HIGH_MATCH === 0.90 ? '✓' : '✗') + ' HIGH_MATCH: ' + t.HIGH_MATCH + ' (expected: 0.90)');
  console.log('  ' + (t.MEDIUM_MATCH === 0.70 ? '✓' : '✗') + ' MEDIUM_MATCH: ' + t.MEDIUM_MATCH + ' (expected: 0.70)');
}

/* ─────────────────────────────────────────────────────────────
   6. SCORING WEIGHTS
──────────────────────────────────────────────────────────────── */

console.log('\n[6] SCORING WEIGHTS');
let weights_correct = true;
if (modules.scoring && modules.scoring.DEFAULT_WEIGHTS) {
  const w = modules.scoring.DEFAULT_WEIGHTS;
  console.log('  Weights:', JSON.stringify(w));
  const sum = Object.values(w).reduce(function(a, b) { return a + b; }, 0);
  if (sum !== 1) weights_correct = false;
  if (w.retrievability !== 0.15) weights_correct = false;

  console.log('  Sum: ' + sum + ' (expected: 1.0)');
  console.log('  ' + (sum === 1 ? '✓' : '✗') + ' Weights sum to 1.0');
  console.log('  ' + (w.retrievability === 0.15 ? '✓' : '✗') + ' Retrievability weight: ' + w.retrievability + ' (expected: 0.15)');
}

/* ─────────────────────────────────────────────────────────────
   7. 5-STATE MODEL
──────────────────────────────────────────────────────────────── */

console.log('\n[7] 5-STATE MODEL');
let states_correct = true;
if (modules.tier && modules.tier.STATE_THRESHOLDS) {
  const states = modules.tier.STATE_THRESHOLDS;
  console.log('  States:', JSON.stringify(states));
  const has_all_states = states.HOT !== undefined && states.WARM !== undefined &&
                       states.COLD !== undefined && states.DORMANT !== undefined;
  if (!has_all_states) states_correct = false;

  console.log('  ' + (has_all_states ? '✓' : '✗') + ' All states defined (HOT, WARM, COLD, DORMANT)');
  console.log('  Archived threshold: ' + modules.tier.ARCHIVED_DAYS_THRESHOLD + ' days');
}

/* ─────────────────────────────────────────────────────────────
   8. HANDLER INTEGRATIONS
──────────────────────────────────────────────────────────────── */

console.log('\n[8] HANDLER INTEGRATIONS');
let handlers_correct = true;
try {
  const save = require('../handlers/memory-save');
  const has_pe_functions = save.find_similar_memories && save.reinforce_existing_memory && save.log_pe_decision;
  if (!has_pe_functions) handlers_correct = false;
  console.log('  ' + (has_pe_functions ? '✓' : '✗') + ' memory-save.js has PE gate functions');
} catch (e) {
  console.log('  ✗ memory-save.js:', e.message);
  handlers_correct = false;
}

try {
  const search = require('../handlers/memory-search');
  const search_content = fs.readFileSync('handlers/memory-search.js', 'utf8');
  const has_testing_effect = search_content.includes('strengthen_on_access');
  if (!has_testing_effect) handlers_correct = false;
  console.log('  ' + (has_testing_effect ? '✓' : '✗') + ' memory-search.js has testing effect');
} catch (e) {
  console.log('  ✗ memory-search.js:', e.message);
  handlers_correct = false;
}

/* ─────────────────────────────────────────────────────────────
   9. SCHEMA CHANGES
──────────────────────────────────────────────────────────────── */

console.log('\n[9] SCHEMA CHANGES');
let schema_correct = true;
try {
  const vector_content = fs.readFileSync('lib/search/vector-index.js', 'utf8');
  const has_stability = vector_content.includes('stability REAL');
  const has_difficulty = vector_content.includes('difficulty REAL');
  const has_last_review = vector_content.includes('last_review TEXT');
  const has_review_count = vector_content.includes('review_count INTEGER');
  const has_conflicts_table = vector_content.includes('memory_conflicts');

  if (!has_stability || !has_difficulty || !has_last_review || !has_review_count || !has_conflicts_table) {
    schema_correct = false;
  }

  console.log('  ' + (has_stability ? '✓' : '✗') + ' stability column');
  console.log('  ' + (has_difficulty ? '✓' : '✗') + ' difficulty column');
  console.log('  ' + (has_last_review ? '✓' : '✗') + ' last_review column');
  console.log('  ' + (has_review_count ? '✓' : '✗') + ' review_count column');
  console.log('  ' + (has_conflicts_table ? '✓' : '✗') + ' memory_conflicts table');
} catch (e) {
  console.log('  ✗ Schema check failed:', e.message);
  schema_correct = false;
}

/* ─────────────────────────────────────────────────────────────
   10. SUMMARY
──────────────────────────────────────────────────────────────── */

console.log('\n═══════════════════════════════════════════════════════════════════');
console.log('  VERIFICATION SUMMARY');
console.log('═══════════════════════════════════════════════════════════════════');

const all_pass = all_files_exist && all_modules_load && all_functions_exist &&
                fsrs_correct && pe_correct && weights_correct && states_correct &&
                handlers_correct && schema_correct;

console.log('  [1] Files exist:        ' + (all_files_exist ? '✓ PASS' : '✗ FAIL'));
console.log('  [2] Modules load:       ' + (all_modules_load ? '✓ PASS' : '✗ FAIL'));
console.log('  [3] Functions exist:    ' + (all_functions_exist ? '✓ PASS' : '✗ FAIL'));
console.log('  [4] FSRS formula:       ' + (fsrs_correct ? '✓ PASS' : '✗ FAIL'));
console.log('  [5] PE thresholds:      ' + (pe_correct ? '✓ PASS' : '✗ FAIL'));
console.log('  [6] Scoring weights:    ' + (weights_correct ? '✓ PASS' : '✗ FAIL'));
console.log('  [7] 5-state model:      ' + (states_correct ? '✓ PASS' : '✗ FAIL'));
console.log('  [8] Handler integration:' + (handlers_correct ? '✓ PASS' : '✗ FAIL'));
console.log('  [9] Schema changes:     ' + (schema_correct ? '✓ PASS' : '✗ FAIL'));

console.log('\n  OVERALL: ' + (all_pass ? '✓ ALL CHECKS PASS' : '✗ SOME CHECKS FAILED'));
console.log('═══════════════════════════════════════════════════════════════════');

process.exit(all_pass ? 0 : 1);
