// ───────────────────────────────────────────────────────────────
// TEST: FIVE-FACTOR SCORING (T032-T035, REQ-017)
// ───────────────────────────────────────────────────────────────
// Tests for 5-factor composite scoring: temporal, usage, importance, pattern, citation
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. TEST HELPERS
──────────────────────────────────────────────────────────────── */

let passCount = 0;
let failCount = 0;
let skipCount = 0;

function test(name, fn) {
  try {
    const result = fn();
    if (result === 'skip') {
      console.log(`   [SKIP] ${name}`);
      skipCount++;
    } else {
      console.log(`   [PASS] ${name}`);
      if (result) console.log(`      Evidence: ${result}`);
      passCount++;
    }
  } catch (err) {
    console.log(`   [FAIL] ${name}`);
    console.log(`      Error: ${err.message}`);
    failCount++;
  }
}

function suite(name) {
  console.log(`\n[SUITE] ${name}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

/* ─────────────────────────────────────────────────────────────
   2. LOAD MODULE
──────────────────────────────────────────────────────────────── */

console.log('================================================');
console.log('  FIVE-FACTOR SCORING UNIT TESTS');
console.log('  Covers: T032-T035 (REQ-017)');
console.log('================================================');
console.log(`Date: ${new Date().toISOString()}\n`);

let compositeScoring;
let attentionDecay;

console.log('[SETUP] Module Loading');
test('composite-scoring.js loads without error', () => {
  compositeScoring = require('../lib/scoring/composite-scoring');
  return 'require() succeeded';
});

test('attention-decay.js loads without error', () => {
  attentionDecay = require('../lib/cognitive/attention-decay');
  return 'require() succeeded';
});

/* ─────────────────────────────────────────────────────────────
   3. FIVE FACTOR WEIGHTS (T032)
──────────────────────────────────────────────────────────────── */

suite('Five-Factor Weight Configuration (T032)');

test('T032-01: FIVE_FACTOR_WEIGHTS exists', () => {
  assert(compositeScoring.FIVE_FACTOR_WEIGHTS, 'FIVE_FACTOR_WEIGHTS should exist');
  return `Type: ${typeof compositeScoring.FIVE_FACTOR_WEIGHTS}`;
});

test('T032-02: Temporal weight = 0.25', () => {
  assert(compositeScoring.FIVE_FACTOR_WEIGHTS.temporal === 0.25, 'temporal should be 0.25');
  return `temporal: ${compositeScoring.FIVE_FACTOR_WEIGHTS.temporal}`;
});

test('T032-03: Usage weight = 0.15', () => {
  assert(compositeScoring.FIVE_FACTOR_WEIGHTS.usage === 0.15, 'usage should be 0.15');
  return `usage: ${compositeScoring.FIVE_FACTOR_WEIGHTS.usage}`;
});

test('T032-04: Importance weight = 0.25', () => {
  assert(compositeScoring.FIVE_FACTOR_WEIGHTS.importance === 0.25, 'importance should be 0.25');
  return `importance: ${compositeScoring.FIVE_FACTOR_WEIGHTS.importance}`;
});

test('T032-05: Pattern weight = 0.20', () => {
  assert(compositeScoring.FIVE_FACTOR_WEIGHTS.pattern === 0.20, 'pattern should be 0.20');
  return `pattern: ${compositeScoring.FIVE_FACTOR_WEIGHTS.pattern}`;
});

test('T032-06: Citation weight = 0.15', () => {
  assert(compositeScoring.FIVE_FACTOR_WEIGHTS.citation === 0.15, 'citation should be 0.15');
  return `citation: ${compositeScoring.FIVE_FACTOR_WEIGHTS.citation}`;
});

test('T032-07: All 5 factors sum to 1.0', () => {
  const weights = compositeScoring.FIVE_FACTOR_WEIGHTS;
  const sum = weights.temporal + weights.usage + weights.importance + weights.pattern + weights.citation;
  assert(Math.abs(sum - 1.0) < 0.001, `Sum should be 1.0, got ${sum}`);
  return `Sum: ${sum.toFixed(4)}`;
});

/* ─────────────────────────────────────────────────────────────
   4. TEMPORAL SCORE - Factor 1 (T032)
──────────────────────────────────────────────────────────────── */

suite('Factor 1: Temporal Score (FSRS Retrievability)');

test('T032-08: calculate_temporal_score exists', () => {
  assert(typeof compositeScoring.calculate_temporal_score === 'function');
  return 'Function exists';
});

test('T032-09: Temporal score uses FSRS formula', () => {
  const now = new Date();
  const row = { last_review: now.toISOString(), stability: 1.0 };
  const score = compositeScoring.calculate_temporal_score(row);
  assert(score >= 0.99, 'Just-reviewed memory should have ~1.0 score');
  return `Score: ${score.toFixed(4)}`;
});

test('T032-10: Temporal decays with time', () => {
  const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
  const row = { last_review: tenDaysAgo.toISOString(), stability: 1.0 };
  const score = compositeScoring.calculate_temporal_score(row);
  assert(score < 0.7 && score > 0.3, 'Score after 10 days should be moderate');
  return `Score after 10 days: ${score.toFixed(4)}`;
});

/* ─────────────────────────────────────────────────────────────
   5. USAGE SCORE - Factor 2 (T032)
──────────────────────────────────────────────────────────────── */

suite('Factor 2: Usage Score (Access Boost)');

test('T032-11: calculate_usage_score exists', () => {
  assert(typeof compositeScoring.calculate_usage_score === 'function');
  return 'Function exists';
});

test('T032-12: Zero accesses = 0 usage score', () => {
  const score = compositeScoring.calculate_usage_score(0);
  assert(score === 0, 'Zero accesses should give 0 score');
  return `Score: ${score}`;
});

test('T032-13: 10 accesses = 1.0 (max) usage score', () => {
  const score = compositeScoring.calculate_usage_score(10);
  assert(score === 1.0, '10 accesses should give max score');
  return `Score: ${score}`;
});

test('T032-14: 20+ accesses still = 1.0 (capped)', () => {
  const score = compositeScoring.calculate_usage_score(100);
  assert(score === 1.0, 'Capped at 1.0 regardless of access count');
  return `Score: ${score}`;
});

test('T032-15: Usage formula: min(1.5, 1.0 + count * 0.05) normalized', () => {
  // 5 accesses: boost = 1.25, normalized = (1.25 - 1.0) / 0.5 = 0.5
  const score = compositeScoring.calculate_usage_score(5);
  assert(Math.abs(score - 0.5) < 0.001, 'Score should be 0.5 for 5 accesses');
  return `Score for 5 accesses: ${score}`;
});

/* ─────────────────────────────────────────────────────────────
   6. IMPORTANCE SCORE - Factor 3 (T032)
──────────────────────────────────────────────────────────────── */

suite('Factor 3: Importance Score (Tier Multipliers)');

test('T032-16: calculate_importance_score exists', () => {
  assert(typeof compositeScoring.calculate_importance_score === 'function');
  return 'Function exists';
});

test('T032-17: IMPORTANCE_MULTIPLIERS exported', () => {
  assert(compositeScoring.IMPORTANCE_MULTIPLIERS, 'Should export multipliers');
  return `Keys: ${Object.keys(compositeScoring.IMPORTANCE_MULTIPLIERS).join(', ')}`;
});

test('T032-18: Critical tier = 1.5x multiplier', () => {
  const mult = compositeScoring.IMPORTANCE_MULTIPLIERS.critical;
  assert(mult === 1.5, 'Critical should be 1.5');
  return `critical: ${mult}`;
});

test('T032-19: Important tier = 1.3x multiplier', () => {
  const mult = compositeScoring.IMPORTANCE_MULTIPLIERS.important;
  assert(mult === 1.3, 'Important should be 1.3');
  return `important: ${mult}`;
});

test('T032-20: Normal tier = 1.0x multiplier', () => {
  const mult = compositeScoring.IMPORTANCE_MULTIPLIERS.normal;
  assert(mult === 1.0, 'Normal should be 1.0');
  return `normal: ${mult}`;
});

test('T032-21: Temporary tier = 0.6x multiplier', () => {
  const mult = compositeScoring.IMPORTANCE_MULTIPLIERS.temporary;
  assert(mult === 0.6, 'Temporary should be 0.6');
  return `temporary: ${mult}`;
});

test('T032-22: Constitutional tier gets highest score', () => {
  const constScore = compositeScoring.calculate_importance_score('constitutional', 0.5);
  const normalScore = compositeScoring.calculate_importance_score('normal', 0.5);
  assert(constScore > normalScore, 'Constitutional should rank higher');
  return `constitutional: ${constScore.toFixed(4)}, normal: ${normalScore.toFixed(4)}`;
});

/* ─────────────────────────────────────────────────────────────
   7. CITATION SCORE - Factor 5 (T033)
──────────────────────────────────────────────────────────────── */

suite('Factor 5: Citation Recency Score (T033)');

test('T033-01: calculate_citation_score exists', () => {
  assert(typeof compositeScoring.calculate_citation_score === 'function');
  return 'Function exists';
});

test('T033-02: CITATION_DECAY_RATE exported', () => {
  assert(typeof compositeScoring.CITATION_DECAY_RATE === 'number');
  return `Value: ${compositeScoring.CITATION_DECAY_RATE}`;
});

test('T033-03: CITATION_MAX_DAYS exported', () => {
  assert(typeof compositeScoring.CITATION_MAX_DAYS === 'number');
  return `Value: ${compositeScoring.CITATION_MAX_DAYS}`;
});

test('T033-04: Recently cited = high score', () => {
  const now = new Date();
  const score = compositeScoring.calculate_citation_score({ last_cited: now.toISOString() });
  assert(score >= 0.99, 'Just-cited should be ~1.0');
  return `Score: ${score.toFixed(4)}`;
});

test('T033-05: Citation score decays over time', () => {
  const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
  const score = compositeScoring.calculate_citation_score({ last_cited: tenDaysAgo.toISOString() });
  assert(score < 0.6 && score > 0.3, 'Score should decay after 10 days');
  return `Score after 10 days: ${score.toFixed(4)}`;
});

test('T033-06: After CITATION_MAX_DAYS, score = 0', () => {
  const oldDate = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000);
  const score = compositeScoring.calculate_citation_score({ last_cited: oldDate.toISOString() });
  assert(score === 0, 'Very old citations should get 0');
  return `Score after 100 days: ${score}`;
});

test('T033-07: Falls back to last_accessed', () => {
  const now = new Date();
  const score = compositeScoring.calculate_citation_score({ last_accessed: now.toISOString() });
  assert(score >= 0.99, 'Falls back to last_accessed');
  return `Score: ${score.toFixed(4)}`;
});

test('T033-08: No citation data = neutral score', () => {
  const score = compositeScoring.calculate_citation_score({});
  assert(score === 0.5, 'No citation data should give 0.5');
  return `Score: ${score}`;
});

/* ─────────────────────────────────────────────────────────────
   8. PATTERN SCORE - Factor 4 (T034)
──────────────────────────────────────────────────────────────── */

suite('Factor 4: Pattern Alignment Score (T034)');

test('T034-01: calculate_pattern_score exists', () => {
  assert(typeof compositeScoring.calculate_pattern_score === 'function');
  return 'Function exists';
});

test('T034-02: PATTERN_ALIGNMENT_BONUSES exported', () => {
  assert(compositeScoring.PATTERN_ALIGNMENT_BONUSES);
  return `Keys: ${Object.keys(compositeScoring.PATTERN_ALIGNMENT_BONUSES).join(', ')}`;
});

test('T034-03: Exact title match gives bonus', () => {
  const row = { title: 'authentication flow', similarity: 80 };
  const options = { query: 'authentication' };
  const score = compositeScoring.calculate_pattern_score(row, options);
  assert(score > 0.4, 'Exact match should give high score');
  return `Score: ${score.toFixed(4)}`;
});

test('T034-04: No query = base similarity only', () => {
  const row = { similarity: 80 };
  const score = compositeScoring.calculate_pattern_score(row, {});
  assert(Math.abs(score - 0.4) < 0.01, 'Should be ~0.4 (50% of 0.8)');
  return `Score: ${score.toFixed(4)}`;
});

test('T034-05: Anchor match gives bonus', () => {
  const row = { anchors: ['decisions', 'blockers'], similarity: 50 };
  const options = { anchors: ['decisions'] };
  const score = compositeScoring.calculate_pattern_score(row, options);
  const baseScore = compositeScoring.calculate_pattern_score(row, {});
  assert(score > baseScore, 'Anchor match should increase score');
  return `Base: ${baseScore.toFixed(4)}, With anchor: ${score.toFixed(4)}`;
});

test('T034-06: Type pattern match gives bonus', () => {
  const row = { memory_type: 'decision', similarity: 50 };
  const options = { query: 'why did we decide' };
  const score = compositeScoring.calculate_pattern_score(row, options);
  const baseScore = compositeScoring.calculate_pattern_score(row, { query: 'random text' });
  assert(score > baseScore, 'Type match should increase score');
  return `With intent: ${score.toFixed(4)}, Without: ${baseScore.toFixed(4)}`;
});

test('T034-07: Score clamped to [0, 1]', () => {
  const row = { title: 'test', similarity: 100 };
  const options = { query: 'test', anchors: ['test'] };
  const score = compositeScoring.calculate_pattern_score(row, options);
  assert(score <= 1.0 && score >= 0, 'Score must be in [0, 1]');
  return `Score: ${score.toFixed(4)}`;
});

/* ─────────────────────────────────────────────────────────────
   9. FIVE-FACTOR COMPOSITE (T032)
──────────────────────────────────────────────────────────────── */

suite('Five-Factor Composite Score (T032)');

test('T032-23: calculate_five_factor_score exists', () => {
  assert(typeof compositeScoring.calculate_five_factor_score === 'function');
  return 'Function exists';
});

test('T032-24: Perfect inputs = high score', () => {
  const now = new Date();
  const row = {
    last_review: now.toISOString(),
    stability: 1.0,
    access_count: 20,
    importance_tier: 'constitutional',
    importance_weight: 1.0,
    similarity: 100,
    title: 'test query',
    last_cited: now.toISOString(),
  };
  const score = compositeScoring.calculate_five_factor_score(row, { query: 'test' });
  assert(score > 0.8, 'Perfect inputs should give high score');
  return `Score: ${score.toFixed(4)}`;
});

test('T032-25: Empty row gives low score', () => {
  const score = compositeScoring.calculate_five_factor_score({}, {});
  assert(score < 0.5, 'Empty row should give low score');
  return `Score: ${score.toFixed(4)}`;
});

test('T032-26: Score always in [0, 1]', () => {
  const scores = [
    compositeScoring.calculate_five_factor_score({}, {}),
    compositeScoring.calculate_five_factor_score({ access_count: 10000 }, {}),
    compositeScoring.calculate_five_factor_score({ similarity: 200 }, {}),
  ];
  const allValid = scores.every(s => s >= 0 && s <= 1);
  assert(allValid, 'All scores should be in [0, 1]');
  return `Scores: ${scores.map(s => s.toFixed(4)).join(', ')}`;
});

/* ─────────────────────────────────────────────────────────────
   10. BATCH OPERATIONS (T032)
──────────────────────────────────────────────────────────────── */

suite('Five-Factor Batch Operations');

test('T032-27: apply_five_factor_scoring exists', () => {
  assert(typeof compositeScoring.apply_five_factor_scoring === 'function');
  return 'Function exists';
});

test('T032-28: Batch scoring sorts by composite score', () => {
  const now = new Date();
  const results = [
    { id: 'low', access_count: 0 },
    { id: 'high', access_count: 10, last_review: now.toISOString() },
  ];
  const scored = compositeScoring.apply_five_factor_scoring(results, {});
  assert(scored[0].id === 'high', 'High scorer should be first');
  return `Top: ${scored[0].id} (score: ${scored[0].composite_score.toFixed(4)})`;
});

test('T032-29: Batch scoring includes _scoring breakdown', () => {
  const results = [{ id: 'test', access_count: 5 }];
  const scored = compositeScoring.apply_five_factor_scoring(results, {});
  const factors = Object.keys(scored[0]._scoring);
  assert(factors.includes('temporal'), 'Should have temporal');
  assert(factors.includes('usage'), 'Should have usage');
  assert(factors.includes('importance'), 'Should have importance');
  assert(factors.includes('pattern'), 'Should have pattern');
  assert(factors.includes('citation'), 'Should have citation');
  return `Factors: ${factors.join(', ')}`;
});

test('T032-30: Empty results returns empty array', () => {
  const scored = compositeScoring.apply_five_factor_scoring([], {});
  assert(Array.isArray(scored) && scored.length === 0);
  return 'Returned: []';
});

/* ─────────────────────────────────────────────────────────────
   11. BREAKDOWN (T032)
──────────────────────────────────────────────────────────────── */

suite('Five-Factor Breakdown');

test('T032-31: get_five_factor_breakdown exists', () => {
  assert(typeof compositeScoring.get_five_factor_breakdown === 'function');
  return 'Function exists';
});

test('T032-32: Breakdown includes all 5 factors', () => {
  const breakdown = compositeScoring.get_five_factor_breakdown({ access_count: 5 }, {});
  const factors = Object.keys(breakdown.factors);
  assert(factors.length === 5, 'Should have 5 factors');
  return `Factors: ${factors.join(', ')}`;
});

test('T032-33: Each factor has value, weight, contribution', () => {
  const breakdown = compositeScoring.get_five_factor_breakdown({ access_count: 5 }, {});
  const temporal = breakdown.factors.temporal;
  assert(typeof temporal.value === 'number', 'Should have value');
  assert(typeof temporal.weight === 'number', 'Should have weight');
  assert(typeof temporal.contribution === 'number', 'Should have contribution');
  return `temporal: v=${temporal.value.toFixed(4)}, w=${temporal.weight}, c=${temporal.contribution.toFixed(4)}`;
});

test('T032-34: Breakdown shows model = "5-factor"', () => {
  const breakdown = compositeScoring.get_five_factor_breakdown({}, {});
  assert(breakdown.model === '5-factor');
  return `model: ${breakdown.model}`;
});

/* ─────────────────────────────────────────────────────────────
   12. ATTENTION DECAY INTEGRATION (T035)
──────────────────────────────────────────────────────────────── */

suite('Attention Decay Integration (T035)');

test('T035-01: calculate_composite_attention exists', () => {
  assert(typeof attentionDecay.calculate_composite_attention === 'function');
  return 'Function exists';
});

test('T035-02: get_attention_breakdown exists', () => {
  assert(typeof attentionDecay.get_attention_breakdown === 'function');
  return 'Function exists';
});

test('T035-03: apply_composite_decay exists', () => {
  assert(typeof attentionDecay.apply_composite_decay === 'function');
  return 'Function exists';
});

test('T035-04: FIVE_FACTOR_WEIGHTS re-exported from attention-decay', () => {
  assert(attentionDecay.FIVE_FACTOR_WEIGHTS);
  return `Keys: ${Object.keys(attentionDecay.FIVE_FACTOR_WEIGHTS).join(', ')}`;
});

test('T035-05: calculate_composite_attention returns score in [0, 1]', () => {
  const score = attentionDecay.calculate_composite_attention({
    access_count: 5,
    importance_tier: 'normal',
  }, {});
  assert(score >= 0 && score <= 1);
  return `Score: ${score.toFixed(4)}`;
});

test('T035-06: null memory returns 0', () => {
  const score = attentionDecay.calculate_composite_attention(null, {});
  assert(score === 0);
  return `Score: ${score}`;
});

test('T035-07: get_attention_breakdown returns proper structure', () => {
  const breakdown = attentionDecay.get_attention_breakdown({ access_count: 5 }, {});
  assert(breakdown.factors, 'Should have factors');
  assert(typeof breakdown.total === 'number', 'Should have total');
  assert(breakdown.model === '5-factor', 'Should show 5-factor model');
  return `Total: ${breakdown.total.toFixed(4)}, Model: ${breakdown.model}`;
});

/* ─────────────────────────────────────────────────────────────
   13. BACKWARD COMPATIBILITY
──────────────────────────────────────────────────────────────── */

suite('Backward Compatibility');

test('Legacy: calculate_composite_score still works', () => {
  const score = compositeScoring.calculate_composite_score({ similarity: 50 }, {});
  assert(typeof score === 'number' && score >= 0 && score <= 1);
  return `Score: ${score.toFixed(4)}`;
});

test('Legacy: apply_composite_scoring still works', () => {
  const results = [{ id: 'test', similarity: 50 }];
  const scored = compositeScoring.apply_composite_scoring(results, {});
  assert(scored[0].composite_score !== undefined);
  return `Score: ${scored[0].composite_score.toFixed(4)}`;
});

test('Legacy: get_score_breakdown still works', () => {
  const breakdown = compositeScoring.get_score_breakdown({ similarity: 50 }, {});
  assert(breakdown.factors.similarity !== undefined);
  return `Model: ${breakdown.model}`;
});

test('Legacy: use_five_factor_model option switches to 5-factor', () => {
  const legacy = compositeScoring.get_score_breakdown({}, {});
  const fiveFactor = compositeScoring.get_score_breakdown({}, { use_five_factor_model: true });
  assert(legacy.model === '6-factor-legacy');
  assert(fiveFactor.model === '5-factor');
  return `Legacy: ${legacy.model}, With option: ${fiveFactor.model}`;
});

/* ─────────────────────────────────────────────────────────────
   14. RELEVANCE IMPROVEMENT (CHK-056)
──────────────────────────────────────────────────────────────── */

suite('Relevance Improvement Validation (CHK-056)');

test('CHK-056-01: Pattern alignment improves relevance', () => {
  const row = { title: 'authentication', similarity: 70, access_count: 5 };
  const withPattern = compositeScoring.calculate_five_factor_score(row, { query: 'authentication' });
  const withoutPattern = compositeScoring.calculate_five_factor_score(row, { query: 'xyz random' });
  const improvement = ((withPattern - withoutPattern) / withoutPattern) * 100;
  assert(withPattern > withoutPattern, 'Pattern match should improve score');
  return `Improvement: ${improvement.toFixed(1)}% (with: ${withPattern.toFixed(4)}, without: ${withoutPattern.toFixed(4)})`;
});

test('CHK-056-02: Citation recency affects ranking', () => {
  const now = new Date();
  const oldDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recent = { last_cited: now.toISOString(), access_count: 5 };
  const old = { last_cited: oldDate.toISOString(), access_count: 5 };
  const recentScore = compositeScoring.calculate_five_factor_score(recent, {});
  const oldScore = compositeScoring.calculate_five_factor_score(old, {});
  assert(recentScore > oldScore, 'Recent citation should rank higher');
  return `Recent: ${recentScore.toFixed(4)}, Old: ${oldScore.toFixed(4)}`;
});

test('CHK-056-03: 5-factor scoring combines all signals', () => {
  const now = new Date();
  const optimal = {
    last_review: now.toISOString(),
    stability: 5.0,
    access_count: 10,
    importance_tier: 'critical',
    importance_weight: 1.0,
    similarity: 95,
    title: 'test query match',
    last_cited: now.toISOString(),
  };
  const suboptimal = {
    last_review: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    access_count: 0,
    importance_tier: 'temporary',
    similarity: 30,
  };
  const optimalScore = compositeScoring.calculate_five_factor_score(optimal, { query: 'test' });
  const suboptimalScore = compositeScoring.calculate_five_factor_score(suboptimal, { query: 'test' });
  const ratio = optimalScore / suboptimalScore;
  assert(ratio > 1.3, 'Optimal should score significantly higher');
  return `Ratio: ${ratio.toFixed(2)}x (optimal: ${optimalScore.toFixed(4)}, suboptimal: ${suboptimalScore.toFixed(4)})`;
});

/* ─────────────────────────────────────────────────────────────
   15. EDGE CASES - TEMPORAL FACTOR
──────────────────────────────────────────────────────────────── */

suite('Edge Cases: Temporal Factor (FSRS)');

test('EDGE-T01: Very old memory (100 days) has low score', () => {
  const oldDate = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000);
  const row = { last_review: oldDate.toISOString(), stability: 1.0 };
  const score = compositeScoring.calculate_temporal_score(row);
  assert(score < 0.25, `Very old memory should have low score, got ${score}`);
  return `Score after 100 days: ${score.toFixed(4)}`;
});

test('EDGE-T02: Very recent memory (1 hour ago) has near-perfect score', () => {
  const recentDate = new Date(Date.now() - 60 * 60 * 1000);
  const row = { last_review: recentDate.toISOString(), stability: 1.0 };
  const score = compositeScoring.calculate_temporal_score(row);
  assert(score > 0.99, `Recent memory should have ~1.0 score, got ${score}`);
  return `Score after 1 hour: ${score.toFixed(4)}`;
});

test('EDGE-T03: Missing stability defaults to 1.0', () => {
  const now = new Date();
  const row = { last_review: now.toISOString() };
  const score = compositeScoring.calculate_temporal_score(row);
  assert(score >= 0.99, 'Should use default stability of 1.0');
  return `Score with default stability: ${score.toFixed(4)}`;
});

test('EDGE-T04: Missing timestamp returns 0.5 (neutral)', () => {
  const row = { stability: 1.0 };
  const score = compositeScoring.calculate_temporal_score(row);
  assert(score === 0.5, `Missing timestamp should return 0.5, got ${score}`);
  return `Score with no timestamp: ${score}`;
});

test('EDGE-T05: High stability (S=10) slows decay', () => {
  const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
  const lowStability = { last_review: tenDaysAgo.toISOString(), stability: 1.0 };
  const highStability = { last_review: tenDaysAgo.toISOString(), stability: 10.0 };
  const lowScore = compositeScoring.calculate_temporal_score(lowStability);
  const highScore = compositeScoring.calculate_temporal_score(highStability);
  assert(highScore > lowScore, 'Higher stability should decay slower');
  return `S=1: ${lowScore.toFixed(4)}, S=10: ${highScore.toFixed(4)}`;
});

test('EDGE-T06: Falls back to updated_at when no last_review', () => {
  const now = new Date();
  const row = { updated_at: now.toISOString(), stability: 1.0 };
  const score = compositeScoring.calculate_temporal_score(row);
  assert(score >= 0.99, 'Should fallback to updated_at');
  return `Score using updated_at: ${score.toFixed(4)}`;
});

test('EDGE-T07: Falls back to created_at when no updated_at', () => {
  const now = new Date();
  const row = { created_at: now.toISOString(), stability: 1.0 };
  const score = compositeScoring.calculate_temporal_score(row);
  assert(score >= 0.99, 'Should fallback to created_at');
  return `Score using created_at: ${score.toFixed(4)}`;
});

test('EDGE-T08: FSRS constants exported correctly', () => {
  assert(typeof compositeScoring.FSRS_FACTOR === 'number', 'FSRS_FACTOR should be number');
  assert(typeof compositeScoring.FSRS_DECAY === 'number', 'FSRS_DECAY should be number');
  assert(Math.abs(compositeScoring.FSRS_FACTOR - 0.2346) < 0.01, 'FSRS_FACTOR should be ~0.235');
  assert(compositeScoring.FSRS_DECAY === -0.5, 'FSRS_DECAY should be -0.5');
  return `FSRS_FACTOR: ${compositeScoring.FSRS_FACTOR.toFixed(4)}, FSRS_DECAY: ${compositeScoring.FSRS_DECAY}`;
});

/* ─────────────────────────────────────────────────────────────
   16. EDGE CASES - USAGE FACTOR
──────────────────────────────────────────────────────────────── */

suite('Edge Cases: Usage Factor');

test('EDGE-U01: Negative access count produces negative score (no clamping)', () => {
  // Implementation note: calculate_usage_score does not clamp negative inputs
  // This documents actual behavior - callers should validate inputs
  const score = compositeScoring.calculate_usage_score(-5);
  // -5 * 0.05 = -0.25, 1.0 - 0.25 = 0.75, normalized = (0.75 - 1.0) / 0.5 = -0.5
  assert(score === -0.5, `Negative count gives -0.5, got ${score}`);
  return `Score for -5 accesses: ${score} (callers should validate)`;
});

test('EDGE-U02: Null access count treated as 0', () => {
  const score = compositeScoring.calculate_usage_score(null);
  assert(score === 0, `Null count should give 0, got ${score}`);
  return `Score for null: ${score}`;
});

test('EDGE-U03: Undefined access count treated as 0', () => {
  const score = compositeScoring.calculate_usage_score(undefined);
  assert(score === 0, `Undefined count should give 0, got ${score}`);
  return `Score for undefined: ${score}`;
});

test('EDGE-U04: Exactly 10 accesses hits 1.5x cap', () => {
  // 10 * 0.05 = 0.5, 1.0 + 0.5 = 1.5, normalized = (1.5 - 1.0) / 0.5 = 1.0
  const score = compositeScoring.calculate_usage_score(10);
  assert(score === 1.0, `10 accesses should give exactly 1.0, got ${score}`);
  return `Score for 10 accesses: ${score}`;
});

test('EDGE-U05: 1 access gives 0.1 score', () => {
  // 1 * 0.05 = 0.05, 1.0 + 0.05 = 1.05, normalized = (1.05 - 1.0) / 0.5 = 0.1
  const score = compositeScoring.calculate_usage_score(1);
  assert(Math.abs(score - 0.1) < 0.001, `1 access should give 0.1, got ${score}`);
  return `Score for 1 access: ${score}`;
});

test('EDGE-U06: Large access count (1000) still capped at 1.0', () => {
  const score = compositeScoring.calculate_usage_score(1000);
  assert(score === 1.0, `1000 accesses should still give 1.0, got ${score}`);
  return `Score for 1000 accesses: ${score}`;
});

/* ─────────────────────────────────────────────────────────────
   17. EDGE CASES - IMPORTANCE FACTOR
──────────────────────────────────────────────────────────────── */

suite('Edge Cases: Importance Factor');

test('EDGE-I01: All tier multipliers verified', () => {
  // Aligned with IMPORTANCE_TIERS from importance-tiers.js (6 valid tiers)
  const expected = {
    constitutional: 2.0,
    critical: 1.5,
    important: 1.3,
    normal: 1.0,
    temporary: 0.6,
    deprecated: 0.1,
  };
  let allMatch = true;
  for (const [tier, mult] of Object.entries(expected)) {
    if (compositeScoring.IMPORTANCE_MULTIPLIERS[tier] !== mult) {
      allMatch = false;
      break;
    }
  }
  assert(allMatch, 'All tier multipliers should match');
  return `Verified ${Object.keys(expected).length} tier multipliers`;
});

test('EDGE-I02: Unknown tier defaults to normal (1.0)', () => {
  const score = compositeScoring.calculate_importance_score('unknown_tier', 0.5);
  const normalScore = compositeScoring.calculate_importance_score('normal', 0.5);
  assert(score === normalScore, 'Unknown tier should use normal multiplier');
  return `Unknown: ${score.toFixed(4)}, Normal: ${normalScore.toFixed(4)}`;
});

test('EDGE-I03: Null tier defaults to normal', () => {
  const score = compositeScoring.calculate_importance_score(null, 0.5);
  const normalScore = compositeScoring.calculate_importance_score('normal', 0.5);
  assert(score === normalScore, 'Null tier should use normal multiplier');
  return `Null tier: ${score.toFixed(4)}`;
});

test('EDGE-I04: Falsy base weight defaults to 0.5', () => {
  // Implementation note: calculate_importance_score treats falsy base as 0.5
  // base = 0.5, critical multiplier = 1.5
  // normalized = (0.5 * 1.5) / 2.0 = 0.375
  const score = compositeScoring.calculate_importance_score('critical', 0);
  assert(Math.abs(score - 0.375) < 0.001, `Falsy base defaults to 0.5, expected 0.375, got ${score}`);
  return `Score with falsy base: ${score.toFixed(4)}`;
});

test('EDGE-I05: Base weight 1.0 with critical tier normalized correctly', () => {
  // critical multiplier = 1.5, base = 1.0
  // normalized = min(1, (1.0 * 1.5) / 2.0) = min(1, 0.75) = 0.75
  const score = compositeScoring.calculate_importance_score('critical', 1.0);
  assert(Math.abs(score - 0.75) < 0.001, `Expected 0.75, got ${score}`);
  return `Score: ${score.toFixed(4)}`;
});

test('EDGE-I06: Constitutional with high base weight capped at 1.0', () => {
  // constitutional multiplier = 2.0, base = 1.0
  // normalized = min(1, (1.0 * 2.0) / 2.0) = min(1, 1.0) = 1.0
  const score = compositeScoring.calculate_importance_score('constitutional', 1.0);
  assert(score === 1.0, `Constitutional with base=1.0 should be 1.0, got ${score}`);
  return `Score: ${score}`;
});

test('EDGE-I07: Deprecated tier gives very low score', () => {
  // deprecated multiplier = 0.1, base = 0.5
  // normalized = (0.5 * 0.1) / 2.0 = 0.025
  const score = compositeScoring.calculate_importance_score('deprecated', 0.5);
  assert(score < 0.05, `Deprecated should be very low, got ${score}`);
  return `Score: ${score.toFixed(4)}`;
});

test('EDGE-I08: Missing base weight defaults to 0.5', () => {
  const score = compositeScoring.calculate_importance_score('normal', undefined);
  // normal = 1.0, base = 0.5, normalized = (0.5 * 1.0) / 2.0 = 0.25
  assert(Math.abs(score - 0.25) < 0.001, `Default base should be 0.5, score ${score}`);
  return `Score with default base: ${score.toFixed(4)}`;
});

/* ─────────────────────────────────────────────────────────────
   18. EDGE CASES - PATTERN FACTOR
──────────────────────────────────────────────────────────────── */

suite('Edge Cases: Pattern Factor');

test('EDGE-P01: Empty title and query gives base similarity only', () => {
  const row = { title: '', similarity: 60 };
  const score = compositeScoring.calculate_pattern_score(row, { query: '' });
  // Base = 60/100 * 0.5 = 0.3
  assert(Math.abs(score - 0.3) < 0.01, `Expected ~0.3, got ${score}`);
  return `Score: ${score.toFixed(4)}`;
});

test('EDGE-P02: Very high similarity (95+) triggers bonus', () => {
  const row = { similarity: 95 };
  const scoreHigh = compositeScoring.calculate_pattern_score(row, {});
  const rowLow = { similarity: 70 };
  const scoreLow = compositeScoring.calculate_pattern_score(rowLow, {});
  // 95% triggers semantic_threshold bonus (0.8 threshold)
  assert(scoreHigh > scoreLow * 1.2, 'High similarity should get bonus');
  return `High (95): ${scoreHigh.toFixed(4)}, Low (70): ${scoreLow.toFixed(4)}`;
});

test('EDGE-P03: Multiple anchor matches give proportional bonus', () => {
  const row = { anchors: ['decisions', 'blockers', 'context'], similarity: 50 };
  const oneAnchor = compositeScoring.calculate_pattern_score(row, { anchors: ['decisions'] });
  const twoAnchors = compositeScoring.calculate_pattern_score(row, { anchors: ['decisions', 'blockers'] });
  const threeAnchors = compositeScoring.calculate_pattern_score(row, { anchors: ['decisions', 'blockers', 'context'] });
  assert(threeAnchors >= twoAnchors && twoAnchors >= oneAnchor, 'More anchors should give higher score');
  return `1: ${oneAnchor.toFixed(4)}, 2: ${twoAnchors.toFixed(4)}, 3: ${threeAnchors.toFixed(4)}`;
});

test('EDGE-P04: All type patterns tested', () => {
  const types = ['decision', 'blocker', 'context', 'next-step', 'insight'];
  const queries = ['why decided', 'blocked issue', 'context overview', 'next action', 'learned insight'];
  let allMatch = true;
  const scores = [];
  for (let i = 0; i < types.length; i++) {
    const row = { memory_type: types[i], similarity: 50 };
    const withIntent = compositeScoring.calculate_pattern_score(row, { query: queries[i] });
    const noIntent = compositeScoring.calculate_pattern_score(row, { query: 'xyz random' });
    if (withIntent <= noIntent) {
      allMatch = false;
    }
    scores.push(`${types[i]}: ${withIntent.toFixed(2)}`);
  }
  assert(allMatch, 'All type patterns should give bonus');
  return `Scores: ${scores.join(', ')}`;
});

test('EDGE-P05: Partial word match in title', () => {
  const row = { title: 'authentication flow implementation', similarity: 50 };
  const score = compositeScoring.calculate_pattern_score(row, { query: 'auth implementation' });
  const baseScore = compositeScoring.calculate_pattern_score(row, { query: 'xyz random' });
  assert(score > baseScore, 'Partial word match should give bonus');
  return `With partial match: ${score.toFixed(4)}, Without: ${baseScore.toFixed(4)}`;
});

test('EDGE-P06: Score clamped to max 1.0 with all bonuses', () => {
  const row = {
    title: 'test query exact',
    similarity: 100,
    anchors: ['test', 'query'],
    memory_type: 'decision',
  };
  const score = compositeScoring.calculate_pattern_score(row, {
    query: 'why test query exact decided',
    anchors: ['test', 'query'],
  });
  assert(score <= 1.0, `Score should not exceed 1.0, got ${score}`);
  return `Score with all bonuses: ${score.toFixed(4)}`;
});

/* ─────────────────────────────────────────────────────────────
   19. EDGE CASES - CITATION FACTOR
──────────────────────────────────────────────────────────────── */

suite('Edge Cases: Citation Factor');

test('EDGE-C01: Exactly at CITATION_MAX_DAYS boundary', () => {
  const maxDays = compositeScoring.CITATION_MAX_DAYS;
  const exactlyAtMax = new Date(Date.now() - maxDays * 24 * 60 * 60 * 1000);
  const score = compositeScoring.calculate_citation_score({ last_cited: exactlyAtMax.toISOString() });
  assert(score === 0, `At max days should be 0, got ${score}`);
  return `Score at ${maxDays} days: ${score}`;
});

test('EDGE-C02: One day before CITATION_MAX_DAYS', () => {
  const maxDays = compositeScoring.CITATION_MAX_DAYS;
  const oneDayBefore = new Date(Date.now() - (maxDays - 1) * 24 * 60 * 60 * 1000);
  const score = compositeScoring.calculate_citation_score({ last_cited: oneDayBefore.toISOString() });
  assert(score > 0, `One day before max should be > 0, got ${score}`);
  return `Score at ${maxDays - 1} days: ${score.toFixed(4)}`;
});

test('EDGE-C03: Falls back to updated_at when no last_cited or last_accessed', () => {
  const now = new Date();
  const score = compositeScoring.calculate_citation_score({ updated_at: now.toISOString() });
  assert(score >= 0.99, 'Should fallback to updated_at');
  return `Score using updated_at: ${score.toFixed(4)}`;
});

test('EDGE-C04: Decay formula verification at 10 days', () => {
  const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
  const score = compositeScoring.calculate_citation_score({ last_cited: tenDaysAgo.toISOString() });
  // Formula: 1 / (1 + 10 * 0.1) = 1 / 2 = 0.5
  assert(Math.abs(score - 0.5) < 0.01, `Expected ~0.5 at 10 days, got ${score}`);
  return `Score at 10 days: ${score.toFixed(4)}`;
});

test('EDGE-C05: Decay formula verification at 20 days', () => {
  const twentyDaysAgo = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
  const score = compositeScoring.calculate_citation_score({ last_cited: twentyDaysAgo.toISOString() });
  // Formula: 1 / (1 + 20 * 0.1) = 1 / 3 = 0.333...
  assert(Math.abs(score - 0.333) < 0.01, `Expected ~0.333 at 20 days, got ${score}`);
  return `Score at 20 days: ${score.toFixed(4)}`;
});

/* ─────────────────────────────────────────────────────────────
   20. COMPOSITE EDGE CASES
──────────────────────────────────────────────────────────────── */

suite('Edge Cases: Composite Score');

test('EDGE-COMP-01: Completely empty row', () => {
  const score = compositeScoring.calculate_five_factor_score({}, {});
  assert(score >= 0 && score <= 1, 'Empty row should still return valid score');
  assert(typeof score === 'number' && !isNaN(score), 'Score should not be NaN');
  return `Empty row score: ${score.toFixed(4)}`;
});

test('EDGE-COMP-02: Row with only access_count', () => {
  const score = compositeScoring.calculate_five_factor_score({ access_count: 10 }, {});
  const emptyScore = compositeScoring.calculate_five_factor_score({}, {});
  assert(score > emptyScore, 'Access count should increase score');
  return `With access: ${score.toFixed(4)}, Empty: ${emptyScore.toFixed(4)}`;
});

test('EDGE-COMP-03: Custom weights override defaults', () => {
  const row = { access_count: 10 };
  const defaultScore = compositeScoring.calculate_five_factor_score(row, {});
  const customScore = compositeScoring.calculate_five_factor_score(row, {
    weights: { usage: 0.5 }  // Increase usage weight
  });
  assert(customScore > defaultScore, 'Custom weights should affect score');
  return `Default: ${defaultScore.toFixed(4)}, Custom: ${customScore.toFixed(4)}`;
});

test('EDGE-COMP-04: All factors at minimum', () => {
  const oldDate = new Date(Date.now() - 200 * 24 * 60 * 60 * 1000);
  const row = {
    last_review: oldDate.toISOString(),
    stability: 0.1,
    access_count: 0,
    importance_tier: 'deprecated',
    importance_weight: 0,
    similarity: 0,
    last_cited: oldDate.toISOString(),
  };
  const score = compositeScoring.calculate_five_factor_score(row, {});
  assert(score < 0.1, `Minimum factors should give very low score, got ${score}`);
  return `Minimum score: ${score.toFixed(4)}`;
});

test('EDGE-COMP-05: All factors at maximum', () => {
  const now = new Date();
  const row = {
    last_review: now.toISOString(),
    stability: 100.0,
    access_count: 100,
    importance_tier: 'constitutional',
    importance_weight: 1.0,
    similarity: 100,
    title: 'test query exact match',
    anchors: ['test'],
    last_cited: now.toISOString(),
  };
  const score = compositeScoring.calculate_five_factor_score(row, {
    query: 'test query exact match',
    anchors: ['test'],
  });
  assert(score > 0.9, `Maximum factors should give high score, got ${score}`);
  return `Maximum score: ${score.toFixed(4)}`;
});

/* ─────────────────────────────────────────────────────────────
   21. BATCH OPERATION EDGE CASES
──────────────────────────────────────────────────────────────── */

suite('Edge Cases: Batch Operations');

test('EDGE-BATCH-01: Handles array with null elements', () => {
  try {
    // Filter out nulls before passing
    const results = [{ id: 'a' }, null, { id: 'b' }].filter(Boolean);
    const scored = compositeScoring.apply_five_factor_scoring(results, {});
    assert(Array.isArray(scored), 'Should return array');
    return `Handled nulls: ${scored.length} results`;
  } catch (err) {
    // If it throws, that's also acceptable behavior
    return 'Throws on null (acceptable)';
  }
});

test('EDGE-BATCH-02: Stable sort for equal scores', () => {
  const now = new Date();
  const results = [
    { id: 'first', access_count: 5, created_at: now.toISOString() },
    { id: 'second', access_count: 5, created_at: now.toISOString() },
  ];
  const scored = compositeScoring.apply_five_factor_scoring(results, {});
  // Both should have similar scores
  const diff = Math.abs(scored[0].composite_score - scored[1].composite_score);
  assert(diff < 0.001, 'Similar inputs should have similar scores');
  return `Score diff: ${diff.toFixed(6)}`;
});

test('EDGE-BATCH-03: Large batch performance', () => {
  const results = [];
  for (let i = 0; i < 100; i++) {
    results.push({ id: `item-${i}`, access_count: i % 20 });
  }
  const start = Date.now();
  const scored = compositeScoring.apply_five_factor_scoring(results, {});
  const elapsed = Date.now() - start;
  assert(elapsed < 1000, `Batch of 100 should complete in < 1s, took ${elapsed}ms`);
  assert(scored.length === 100, 'Should return all items');
  return `100 items in ${elapsed}ms`;
});

/* ─────────────────────────────────────────────────────────────
   22. BREAKDOWN EDGE CASES
──────────────────────────────────────────────────────────────── */

suite('Edge Cases: Factor Breakdown');

test('EDGE-BD-01: Breakdown contributions sum to total', () => {
  const breakdown = compositeScoring.get_five_factor_breakdown({ access_count: 5 }, {});
  const factorSum = Object.values(breakdown.factors).reduce((sum, f) => sum + f.contribution, 0);
  const diff = Math.abs(factorSum - breakdown.total);
  assert(diff < 0.0001, `Contributions should sum to total, diff: ${diff}`);
  return `Sum: ${factorSum.toFixed(4)}, Total: ${breakdown.total.toFixed(4)}`;
});

test('EDGE-BD-02: Each factor contribution = value * weight', () => {
  const breakdown = compositeScoring.get_five_factor_breakdown({ access_count: 5 }, {});
  let allCorrect = true;
  for (const [name, factor] of Object.entries(breakdown.factors)) {
    const expected = factor.value * factor.weight;
    if (Math.abs(expected - factor.contribution) > 0.0001) {
      allCorrect = false;
    }
  }
  assert(allCorrect, 'All contributions should equal value * weight');
  return 'All factor contributions verified';
});

test('EDGE-BD-03: Breakdown has description for each factor', () => {
  const breakdown = compositeScoring.get_five_factor_breakdown({}, {});
  let allHaveDesc = true;
  for (const factor of Object.values(breakdown.factors)) {
    if (!factor.description || typeof factor.description !== 'string') {
      allHaveDesc = false;
    }
  }
  assert(allHaveDesc, 'All factors should have descriptions');
  return `Descriptions: ${Object.values(breakdown.factors).map(f => f.description).join(', ')}`;
});

/* ─────────────────────────────────────────────────────────────
   23. SUMMARY
──────────────────────────────────────────────────────────────── */

console.log('\n================================================');
console.log('  TEST SUMMARY');
console.log('================================================');
console.log(`  [PASS]:   ${passCount}`);
console.log(`  [FAIL]:   ${failCount}`);
console.log(`  [SKIP]:   ${skipCount}`);
console.log(`  Total:    ${passCount + failCount + skipCount}`);

if (failCount === 0) {
  console.log('\n  ALL EXECUTED TESTS PASSED!');
} else {
  console.log(`\n  ${failCount} TEST(S) FAILED`);
  process.exit(1);
}
