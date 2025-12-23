/**
 * Token Budget Module - Response size management
 *
 * Prevents "Response exceeds maximum allowed tokens" errors by providing
 * utilities for estimating token counts and truncating results to fit
 * within MCP response limits.
 *
 * @module lib/token-budget
 * @version 11.0.0
 */

'use strict';

/**
 * Token configuration with environment overrides
 * @type {Object}
 * @property {number} maxTokens - Maximum allowed tokens (default: 25000)
 * @property {number} safetyBuffer - Safety buffer multiplier (default: 0.8 = 80%)
 * @property {number} charsPerToken - Average characters per token (default: 3.5)
 * @property {number} minItems - Minimum items to always include (default: 1)
 */
const TOKEN_CONFIG = {
  maxTokens: parseInt(process.env.MCP_MAX_TOKENS || '25000', 10),
  safetyBuffer: parseFloat(process.env.MCP_TOKEN_SAFETY_BUFFER || '0.8'),
  charsPerToken: parseFloat(process.env.MCP_CHARS_PER_TOKEN || '3.5'),
  minItems: parseInt(process.env.MCP_MIN_ITEMS || '1', 10)
};

/**
 * Estimate token count for content
 *
 * Uses a character-based approximation since exact tokenization
 * varies by model. The default ratio of 3.5 chars/token is a
 * conservative estimate for mixed English/code content.
 *
 * @param {string|Object} content - Content to estimate (strings or objects)
 * @returns {number} Estimated token count (always >= 1)
 * @example
 * estimateTokens('Hello world'); // ~3 tokens
 * estimateTokens({ key: 'value' }); // ~5 tokens
 */
function estimateTokens(content) {
  if (content === null || content === undefined) {
    return 0;
  }

  const text = typeof content === 'string' ? content : JSON.stringify(content);
  return Math.max(1, Math.ceil(text.length / TOKEN_CONFIG.charsPerToken));
}

/**
 * Truncate results to fit token budget
 *
 * Iterates through results, accumulating token counts until the budget
 * is exhausted. Always includes at least `minItems` results regardless
 * of token count to ensure some data is returned.
 *
 * @param {Array} results - Search results array to truncate
 * @param {Object} [config=TOKEN_CONFIG] - Override configuration
 * @param {number} [config.maxTokens] - Maximum token limit
 * @param {number} [config.safetyBuffer] - Safety buffer multiplier (0-1)
 * @param {number} [config.charsPerToken] - Characters per token estimate
 * @param {number} [config.minItems] - Minimum items to include
 * @returns {Object} Truncation result object
 * @returns {Array} returns.results - Truncated results array
 * @returns {number} returns.tokensUsed - Total tokens in returned results
 * @returns {boolean} returns.truncated - Whether results were truncated
 * @returns {number} returns.originalCount - Original number of results
 * @returns {number} returns.returnedCount - Number of results returned
 * @example
 * const { results, truncated } = truncateToTokenLimit(searchResults);
 * if (truncated) {
 *   console.log('Results were truncated to fit token budget');
 * }
 */
function truncateToTokenLimit(results, config = TOKEN_CONFIG) {
  // Handle edge cases
  if (!Array.isArray(results)) {
    return {
      results: [],
      tokensUsed: 0,
      truncated: false,
      originalCount: 0,
      returnedCount: 0
    };
  }

  if (results.length === 0) {
    return {
      results: [],
      tokensUsed: 0,
      truncated: false,
      originalCount: 0,
      returnedCount: 0
    };
  }

  // Merge provided config with defaults
  const effectiveConfig = { ...TOKEN_CONFIG, ...config };
  const maxTokens = effectiveConfig.maxTokens * effectiveConfig.safetyBuffer;

  let totalTokens = 0;
  const truncated = [];

  for (const result of results) {
    const resultTokens = estimateTokens(result);

    // Check if we'd exceed the budget, but always include minItems
    if (totalTokens + resultTokens > maxTokens &&
        truncated.length >= effectiveConfig.minItems) {
      break;
    }

    truncated.push(result);
    totalTokens += resultTokens;
  }

  return {
    results: truncated,
    tokensUsed: totalTokens,
    truncated: results.length > truncated.length,
    originalCount: results.length,
    returnedCount: truncated.length
  };
}

/**
 * Format truncation message for MCP response
 *
 * Generates a human-readable message explaining the truncation.
 * Returns null if no truncation occurred.
 *
 * @param {Object} truncationResult - Result from truncateToTokenLimit
 * @param {boolean} truncationResult.truncated - Whether truncation occurred
 * @param {number} truncationResult.returnedCount - Number of results returned
 * @param {number} truncationResult.originalCount - Original number of results
 * @param {number} truncationResult.tokensUsed - Tokens used by returned results
 * @returns {string|null} Human-readable truncation message, or null if not truncated
 * @example
 * const result = truncateToTokenLimit(searchResults);
 * const message = formatTruncationMessage(result);
 * if (message) {
 *   response.metadata = { truncationNote: message };
 * }
 */
function formatTruncationMessage(truncationResult) {
  if (!truncationResult || !truncationResult.truncated) {
    return null;
  }

  return `Results truncated: showing ${truncationResult.returnedCount} of ${truncationResult.originalCount} (${truncationResult.tokensUsed} tokens used)`;
}

/**
 * Check if content fits within token budget
 *
 * Quick check to determine if content would fit without truncation.
 *
 * @param {string|Object} content - Content to check
 * @param {Object} [config=TOKEN_CONFIG] - Override configuration
 * @returns {boolean} True if content fits within budget
 * @example
 * if (!fitsWithinBudget(largeResponse)) {
 *   response = summarize(response);
 * }
 */
function fitsWithinBudget(content, config = TOKEN_CONFIG) {
  const effectiveConfig = { ...TOKEN_CONFIG, ...config };
  const maxTokens = effectiveConfig.maxTokens * effectiveConfig.safetyBuffer;
  return estimateTokens(content) <= maxTokens;
}

/**
 * Get remaining token budget
 *
 * Calculate how many tokens are available after accounting for
 * already-used tokens.
 *
 * @param {number} usedTokens - Tokens already consumed
 * @param {Object} [config=TOKEN_CONFIG] - Override configuration
 * @returns {number} Remaining token budget (minimum 0)
 * @example
 * const remaining = getRemainingBudget(headerTokens);
 * const bodyResults = truncateToTokenLimit(results, { maxTokens: remaining });
 */
function getRemainingBudget(usedTokens, config = TOKEN_CONFIG) {
  const effectiveConfig = { ...TOKEN_CONFIG, ...config };
  const maxTokens = effectiveConfig.maxTokens * effectiveConfig.safetyBuffer;
  return Math.max(0, maxTokens - usedTokens);
}

module.exports = {
  TOKEN_CONFIG,
  estimateTokens,
  truncateToTokenLimit,
  formatTruncationMessage,
  fitsWithinBudget,
  getRemainingBudget
};
