// ───────────────────────────────────────────────────────────────
// UTILS: TOKEN BUDGET
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

// Token estimation: ~3.5 chars/token for mixed English/code content
const TOKEN_CONFIG = {
  max_tokens: parseInt(process.env.MCP_MAX_TOKENS || '25000', 10),
  safety_buffer: parseFloat(process.env.MCP_TOKEN_SAFETY_BUFFER || '0.8'),
  chars_per_token: parseFloat(process.env.MCP_CHARS_PER_TOKEN || '3.5'),
  min_items: parseInt(process.env.MCP_MIN_ITEMS || '1', 10),
};

/* ─────────────────────────────────────────────────────────────
   2. CORE FUNCTIONS
──────────────────────────────────────────────────────────────── */

function estimate_tokens(content) {
  if (content === null || content === undefined) {
    return 0;
  }
  const text = typeof content === 'string' ? content : JSON.stringify(content);
  return Math.max(1, Math.ceil(text.length / TOKEN_CONFIG.chars_per_token));
}

// Truncates results to fit token budget, always includes at least min_items
function truncate_to_token_limit(results, config = TOKEN_CONFIG) {
  if (!Array.isArray(results) || results.length === 0) {
    return {
      results: [],
      tokens_used: 0,
      truncated: false,
      original_count: results?.length || 0,
      returned_count: 0,
    };
  }

  const effective_config = { ...TOKEN_CONFIG, ...config };
  const max_tokens = effective_config.max_tokens * effective_config.safety_buffer;

  let total_tokens = 0;
  const truncated = [];

  for (const result of results) {
    const result_tokens = estimate_tokens(result);

    if (total_tokens + result_tokens > max_tokens &&
        truncated.length >= effective_config.min_items) {
      break;
    }

    truncated.push(result);
    total_tokens += result_tokens;
  }

  return {
    results: truncated,
    tokens_used: total_tokens,
    truncated: results.length > truncated.length,
    original_count: results.length,
    returned_count: truncated.length,
  };
}

function format_truncation_message(truncation_result) {
  if (!truncation_result || !truncation_result.truncated) {
    return null;
  }
  return `Results truncated: showing ${truncation_result.returned_count} of ${truncation_result.original_count} (${truncation_result.tokens_used} tokens used)`;
}

function fits_within_budget(content, config = TOKEN_CONFIG) {
  const effective_config = { ...TOKEN_CONFIG, ...config };
  const max_tokens = effective_config.max_tokens * effective_config.safety_buffer;
  return estimate_tokens(content) <= max_tokens;
}

function get_remaining_budget(used_tokens, config = TOKEN_CONFIG) {
  const effective_config = { ...TOKEN_CONFIG, ...config };
  const max_tokens = effective_config.max_tokens * effective_config.safety_buffer;
  return Math.max(0, max_tokens - used_tokens);
}

/* ─────────────────────────────────────────────────────────────
   3. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  TOKEN_CONFIG,
  estimate_tokens,
  truncate_to_token_limit,
  format_truncation_message,
  fits_within_budget,
  get_remaining_budget,
};
