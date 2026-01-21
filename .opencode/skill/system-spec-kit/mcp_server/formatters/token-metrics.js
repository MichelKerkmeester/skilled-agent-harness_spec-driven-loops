// ───────────────────────────────────────────────────────────────
// FORMATTERS: TOKEN METRICS
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. TOKEN ESTIMATION
──────────────────────────────────────────────────────────────── */

/**
 * Estimate token count for text content
 * Uses ~4 chars per token approximation for English text
 * @param {string} text - Text to estimate tokens for
 * @returns {number} Estimated token count
 */
function estimate_tokens(text) {
  if (!text || typeof text !== 'string') return 0;
  // Average ~4 chars per token for English, ~2 for code
  return Math.ceil(text.length / 4);
}

/* ─────────────────────────────────────────────────────────────
   2. TOKEN METRICS CALCULATION
──────────────────────────────────────────────────────────────── */

/**
 * Calculate token savings from tiered content injection
 * Compares hypothetical full content vs actual tiered content
 *
 * Tier behavior:
 * - HOT: Full content returned (no savings)
 * - WARM: Summary returned (~1/3 of full content)
 * - COLD: Excluded entirely (100% savings)
 *
 * @param {Array} all_matches - All matched memories (before tier filtering)
 * @param {Array} returned_results - Tiered results actually returned
 * @returns {Object} Token metrics with savings estimate
 * @returns {number} returns.actualTokens - Total tokens in returned content
 * @returns {number} returns.hotTokens - Tokens from HOT tier results
 * @returns {number} returns.warmTokens - Tokens from WARM tier results
 * @returns {number} returns.hotCount - Number of HOT tier results
 * @returns {number} returns.warmCount - Number of WARM tier results
 * @returns {number} returns.coldExcluded - Number of COLD results excluded
 * @returns {number} returns.estimatedSavingsPercent - Percentage of tokens saved
 * @returns {string} returns.note - Explanation of estimation method
 */
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
──────────────────────────────────────────────────────────────── */

module.exports = {
  // snake_case exports
  estimate_tokens,
  calculate_token_metrics,

  // Backward compatibility aliases (camelCase → snake_case transition)
  estimateTokens: estimate_tokens,
  calculateTokenMetrics: calculate_token_metrics
};
