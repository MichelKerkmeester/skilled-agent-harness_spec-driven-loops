// ───────────────────────────────────────────────────────────────
// COGNITIVE: TIER CLASSIFIER
// ───────────────────────────────────────────────────────────────
'use strict';

const fs = require('fs');
const path = require('path');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

/**
 * Parse threshold from env var with validation
 * Falls back to default if invalid or NaN
 * @param {string} envVar - Environment variable name
 * @param {number} defaultVal - Default value if invalid
 * @returns {number} Validated threshold between 0 and 1
 */
function parse_threshold(envVar, defaultVal) {
  const parsed = parseFloat(process.env[envVar]);
  return !isNaN(parsed) && parsed >= 0 && parsed <= 1 ? parsed : defaultVal;
}

/**
 * Parse integer limit from env var with validation
 * Falls back to default if invalid or NaN
 * @param {string} envVar - Environment variable name
 * @param {number} defaultVal - Default value if invalid
 * @returns {number} Validated positive integer
 */
function parse_limit(envVar, defaultVal) {
  const parsed = parseInt(process.env[envVar], 10);
  return !isNaN(parsed) && parsed > 0 ? parsed : defaultVal;
}

/**
 * Tier configuration with environment variable overrides
 * HOT_THRESHOLD: Controls how long memories stay in HOT tier (default: 0.8)
 *   - Lower values (e.g., 0.7) = memories stay HOT longer (more full content, more tokens)
 *   - Higher values (e.g., 0.85) = memories drop to WARM faster (more summaries, fewer tokens)
 *   - With decay rate 0.80: 0.8 threshold = ~1 turn HOT, 0.7 threshold = ~2 turns HOT
 * WARM_THRESHOLD: Controls when memories become COLD and are excluded (default: 0.25)
 */
const TIER_CONFIG = {
  hotThreshold: parse_threshold('HOT_THRESHOLD', 0.8),
  warmThreshold: parse_threshold('WARM_THRESHOLD', 0.25),
  // score < warmThreshold = COLD (not returned)
  maxHotMemories: parse_limit('MAX_HOT_MEMORIES', 5),
  maxWarmMemories: parse_limit('MAX_WARM_MEMORIES', 10),
  summaryFallbackLength: 150,  // First N chars if no summary field
};

// BUG-011: Validate threshold ordering (HOT must be > WARM)
if (TIER_CONFIG.hotThreshold <= TIER_CONFIG.warmThreshold) {
  console.warn('[tier-classifier] Invalid thresholds: HOT must be > WARM. Using defaults.');
  TIER_CONFIG.hotThreshold = 0.8;
  TIER_CONFIG.warmThreshold = 0.25;
}

/* ─────────────────────────────────────────────────────────────
   2. TIER CLASSIFICATION
──────────────────────────────────────────────────────────────── */

/**
 * Classify a memory into HOT, WARM, or COLD tier based on attention score
 * @param {number} attentionScore - Score between 0.0 and 1.0
 * @returns {'HOT' | 'WARM' | 'COLD'} The tier classification
 */
function classify_tier(attentionScore) {
  // Handle edge cases
  if (typeof attentionScore !== 'number' || isNaN(attentionScore)) {
    return 'COLD';
  }

  // Clamp score to valid range
  const score = Math.max(0, Math.min(1, attentionScore));

  if (score >= TIER_CONFIG.hotThreshold) {
    return 'HOT';
  }

  if (score >= TIER_CONFIG.warmThreshold) {
    return 'WARM';
  }

  return 'COLD';
}

/* ─────────────────────────────────────────────────────────────
   3. CONTENT RETRIEVAL BY TIER
──────────────────────────────────────────────────────────────── */

/**
 * Get appropriate content for a memory based on its tier
 * - HOT: Full content (read from file)
 * - WARM: Summary field (or first N chars if no summary)
 * - COLD: null (not returned)
 *
 * @param {object} memory - Memory object with filePath and summary fields
 * @param {'HOT' | 'WARM' | 'COLD'} tier - The tier classification
 * @returns {string | null} Content appropriate for the tier
 */
function get_tiered_content(memory, tier) {
  if (!memory || typeof memory !== 'object') {
    return null;
  }

  switch (tier) {
    case 'HOT':
      return get_full_content(memory);

    case 'WARM':
      return get_summary_content(memory);

    case 'COLD':
    default:
      return null;
  }
}

/**
 * Read full content from memory file
 * @param {object} memory - Memory object with filePath
 * @returns {string | null} Full file content or null if unavailable
 */
function get_full_content(memory) {
  if (!memory.filePath) {
    return null;
  }

  try {
    // Check if file exists
    if (!fs.existsSync(memory.filePath)) {
      console.warn(`[tier-classifier] File not found: ${memory.filePath}`);
      return null;
    }

    const content = fs.readFileSync(memory.filePath, 'utf-8');
    return content;
  } catch (error) {
    console.warn(`[tier-classifier] Error reading file ${memory.filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Get summary content for WARM tier
 * Uses summary field if available, otherwise first N characters of content
 * @param {object} memory - Memory object with summary and/or filePath
 * @returns {string | null} Summary content or null if unavailable
 */
function get_summary_content(memory) {
  // Prefer explicit summary field
  if (memory.summary && typeof memory.summary === 'string' && memory.summary.trim()) {
    return memory.summary.trim();
  }

  // Fallback: Read file and truncate
  const fullContent = get_full_content(memory);
  if (!fullContent) {
    return null;
  }

  // Return first N characters with ellipsis if truncated
  if (fullContent.length <= TIER_CONFIG.summaryFallbackLength) {
    return fullContent;
  }

  // Find a good break point (word boundary)
  let truncated = fullContent.substring(0, TIER_CONFIG.summaryFallbackLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > TIER_CONFIG.summaryFallbackLength * 0.7) {
    truncated = truncated.substring(0, lastSpace);
  }

  return truncated + '...';
}

/* ─────────────────────────────────────────────────────────────
   4. FILTERING AND LIMITING
──────────────────────────────────────────────────────────────── */

/**
 * Filter out COLD memories and limit HOT/WARM counts
 * - Filters out COLD tier memories (not returned)
 * - Limits HOT to maxHotMemories (default 5)
 * - Limits WARM to maxWarmMemories (default 10)
 *
 * @param {Array<object>} memories - Array of memories with attentionScore
 * @returns {Array<object>} Filtered and limited memories with tier assigned
 */
function filter_and_limit_by_tier(memories) {
  if (!Array.isArray(memories)) {
    return [];
  }

  // Classify and separate by tier
  const hotMemories = [];
  const warmMemories = [];

  for (const memory of memories) {
    const attentionScore = memory.attentionScore || 0;
    const tier = classify_tier(attentionScore);

    if (tier === 'HOT') {
      hotMemories.push({ ...memory, tier, attentionScore });
    } else if (tier === 'WARM') {
      warmMemories.push({ ...memory, tier, attentionScore });
    }
    // COLD memories are not included
  }

  // Sort by attention score (descending) within each tier
  hotMemories.sort((a, b) => b.attentionScore - a.attentionScore);
  warmMemories.sort((a, b) => b.attentionScore - a.attentionScore);

  // Apply limits
  const limitedHot = hotMemories.slice(0, TIER_CONFIG.maxHotMemories);
  const limitedWarm = warmMemories.slice(0, TIER_CONFIG.maxWarmMemories);

  // Combine: HOT first, then WARM
  return [...limitedHot, ...limitedWarm];
}

/* ─────────────────────────────────────────────────────────────
   5. RESPONSE FORMATTING
──────────────────────────────────────────────────────────────── */

/**
 * Format memories into tiered response format
 * Each memory includes tier info and appropriate content depth
 *
 * @param {Array<object>} memories - Array of memories with tier and attentionScore
 * @returns {Array<object>} Formatted response array
 */
function format_tiered_response(memories) {
  if (!Array.isArray(memories)) {
    return [];
  }

  const response = [];

  for (const memory of memories) {
    const tier = memory.tier || classify_tier(memory.attentionScore || 0);

    // Skip COLD memories
    if (tier === 'COLD') {
      continue;
    }

    const content = get_tiered_content(memory, tier);

    response.push({
      id: memory.id || memory.memoryId,
      specFolder: memory.specFolder || memory.spec_folder,
      filePath: memory.filePath || memory.file_path,
      title: memory.title,
      tier,
      attentionScore: memory.attentionScore || 0,
      content,
      matchedPhrases: memory.matchedPhrases || [],
    });
  }

  return response;
}

/* ─────────────────────────────────────────────────────────────
   6. UTILITY FUNCTIONS
──────────────────────────────────────────────────────────────── */

/**
 * Get tier statistics for a set of memories
 * @param {Array<object>} memories - Array of memories with attentionScore
 * @returns {object} Statistics about tier distribution
 */
function get_tier_stats(memories) {
  if (!Array.isArray(memories)) {
    return { hot: 0, warm: 0, cold: 0, total: 0 };
  }

  let hot = 0;
  let warm = 0;
  let cold = 0;

  for (const memory of memories) {
    const tier = classify_tier(memory.attentionScore || 0);

    switch (tier) {
      case 'HOT':
        hot++;
        break;
      case 'WARM':
        warm++;
        break;
      case 'COLD':
        cold++;
        break;
    }
  }

  return {
    hot,
    warm,
    cold,
    total: memories.length,
    filtered: hot + warm, // Memories that would be returned
  };
}

/**
 * Check if attention score qualifies for inclusion (not COLD)
 * @param {number} attentionScore - Score between 0.0 and 1.0
 * @returns {boolean} True if memory should be included
 */
function is_included(attentionScore) {
  return classify_tier(attentionScore) !== 'COLD';
}

/**
 * Get the threshold for a specific tier
 * @param {'HOT' | 'WARM'} tier - The tier to get threshold for
 * @returns {number} The threshold value
 */
function get_tier_threshold(tier) {
  switch (tier) {
    case 'HOT':
      return TIER_CONFIG.hotThreshold;
    case 'WARM':
      return TIER_CONFIG.warmThreshold;
    default:
      return 0;
  }
}

/* ─────────────────────────────────────────────────────────────
   7. MODULE EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Main functions
  classifyTier: classify_tier,
  getTieredContent: get_tiered_content,
  filterAndLimitByTier: filter_and_limit_by_tier,
  formatTieredResponse: format_tiered_response,

  // Utility functions
  getTierStats: get_tier_stats,
  isIncluded: is_included,
  getTierThreshold: get_tier_threshold,

  // Internal functions (exposed for testing)
  getFullContent: get_full_content,
  getSummaryContent: get_summary_content,

  // Configuration
  TIER_CONFIG,
};
