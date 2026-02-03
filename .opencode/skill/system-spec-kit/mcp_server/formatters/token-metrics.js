// ───────────────────────────────────────────────────────────────
// FORMATTERS: TOKEN METRICS
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. TOKEN ESTIMATION
────────────────────────────────────────────────────────────────*/

function estimate_tokens(text) {
  if (!text || typeof text !== 'string') return 0;
  // Average ~4 chars per token for English, ~2 for code
  return Math.ceil(text.length / 4);
}

/* ─────────────────────────────────────────────────────────────
   2. TOKEN METRICS CALCULATION
────────────────────────────────────────────────────────────────*/

function calculate_token_metrics(all_matches, returned_results) {
  // Estimate tokens if ALL matches returned full content
  const hypothetical_full_tokens = returned_results.reduce((sum, r) => {
    // For HOT tier, content is already full
    // For WARM tier, we saved tokens by using summary
    // For excluded COLD, we saved all tokens
    return sum + (r.tier === 'WARM' ? estimate_tokens(r.content) * 3 : estimate_tokens(r.content));
  }, 0);

  // Actual tokens returned
  const actual_tokens = returned_results.reduce((sum, r) => {
    return sum + estimate_tokens(r.content || '');
  }, 0);

  // Count by tier
  const hot_count = returned_results.filter(r => r.tier === 'HOT').length;
  const warm_count = returned_results.filter(r => r.tier === 'WARM').length;
  const cold_excluded = all_matches.length - returned_results.length;

  // Hot tokens (full content)
  const hot_tokens = returned_results
    .filter(r => r.tier === 'HOT')
    .reduce((sum, r) => sum + estimate_tokens(r.content || ''), 0);

  // Warm tokens (summaries)
  const warm_tokens = returned_results
    .filter(r => r.tier === 'WARM')
    .reduce((sum, r) => sum + estimate_tokens(r.content || ''), 0);

  // Estimate savings (WARM summaries ~1/3 of full content, COLD fully excluded)
  const estimated_savings = warm_count > 0 || cold_excluded > 0 ?
    Math.round((1 - actual_tokens / Math.max(hypothetical_full_tokens, 1)) * 100) : 0;

  return {
    actualTokens: actual_tokens,
    hotTokens: hot_tokens,
    warmTokens: warm_tokens,
    hotCount: hot_count,
    warmCount: warm_count,
    coldExcluded: cold_excluded,
    estimatedSavingsPercent: Math.max(0, estimated_savings),
    note: 'Token estimates use ~4 chars/token approximation'
  };
}

/* ─────────────────────────────────────────────────────────────
   3. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // snake_case exports
  estimate_tokens,
  calculate_token_metrics,

  // Backward compatibility aliases (camelCase → snake_case transition)
  estimateTokens: estimate_tokens,
  calculateTokenMetrics: calculate_token_metrics
};
