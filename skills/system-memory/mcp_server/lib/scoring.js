/**
 * Scoring Module - Memory decay and importance calculations
 * @module lib/scoring
 * @version 11.0.0
 *
 * Implements exponential decay scoring for memory relevance.
 * Formula: adjusted_score = similarity_score + (decay_weight * e^(-age_days / scale_days))
 *
 * Decay Effects Table (with default config: decayWeight=0.3, scaleDays=90):
 * ┌─────────────┬──────────────┬─────────────────┐
 * │ Age (days)  │ Decay Boost  │ Boost % of Max  │
 * ├─────────────┼──────────────┼─────────────────┤
 * │ 0           │ 0.300        │ 100%            │
 * │ 7           │ 0.278        │ 93%             │
 * │ 30          │ 0.215        │ 72%             │
 * │ 60          │ 0.154        │ 51%             │
 * │ 90          │ 0.110        │ 37%             │
 * │ 180         │ 0.041        │ 14%             │
 * │ 365         │ 0.005        │ 2%              │
 * └─────────────┴──────────────┴─────────────────┘
 *
 * Note: Pinned memories bypass decay entirely (always get full boost).
 */

'use strict';

// Default decay configuration
const DECAY_CONFIG = {
  decayWeight: 0.3,   // Maximum boost for new memories (30% of similarity scale)
  scaleDays: 90,      // Time constant in days (not half-life, but decay scale)
  enabled: true       // Can be disabled globally
};

/**
 * Parse timestamp to Date object
 * @private
 * @param {number|string|Date} timestamp - Unix timestamp (ms), ISO string, or Date
 * @returns {Date} Parsed date
 */
function parseTimestamp(timestamp) {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  if (typeof timestamp === 'number') {
    // Handle both seconds and milliseconds
    // If number is less than 1e12, assume seconds (before year 2001 in ms)
    if (timestamp < 1e12) {
      return new Date(timestamp * 1000);
    }
    return new Date(timestamp);
  }
  return new Date();
}

/**
 * Calculate age in days from timestamp to now
 * @private
 * @param {number|string|Date} createdAt - Creation timestamp
 * @returns {number} Age in fractional days
 */
function calculateAgeDays(createdAt) {
  const created = parseTimestamp(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return Math.max(0, diffDays); // Ensure non-negative
}

/**
 * Calculate memory decay boost based on age
 *
 * Uses exponential decay: boost = decayWeight * e^(-age_days / scale_days)
 *
 * @param {number|string|Date} createdAt - Unix timestamp (ms or s), ISO string, or Date
 * @param {Object} [options={}] - Configuration options
 * @param {number} [options.decayWeight=0.3] - Maximum boost for brand new memories
 * @param {number} [options.scaleDays=90] - Decay time constant in days
 * @returns {number} Decay boost value (0 to decayWeight)
 *
 * @example
 * // New memory (today)
 * calculateDecayBoost(Date.now()); // ~0.3
 *
 * @example
 * // 90-day old memory
 * const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
 * calculateDecayBoost(ninetyDaysAgo); // ~0.11
 */
function calculateDecayBoost(createdAt, options = {}) {
  const {
    decayWeight = DECAY_CONFIG.decayWeight,
    scaleDays = DECAY_CONFIG.scaleDays
  } = options;

  // If decay is disabled globally, return 0 (no boost)
  if (!DECAY_CONFIG.enabled) {
    return 0;
  }

  const ageDays = calculateAgeDays(createdAt);

  // Exponential decay formula: weight * e^(-age/scale)
  const boost = decayWeight * Math.exp(-ageDays / scaleDays);

  return boost;
}

/**
 * Adjust similarity score with time decay
 *
 * Combines raw similarity with recency boost to favor newer memories
 * while still respecting semantic relevance.
 *
 * @param {number} similarity - Raw similarity score (0-100 scale)
 * @param {number|string|Date} createdAt - Creation timestamp
 * @param {Object} [options={}] - Configuration options
 * @param {boolean} [options.isPinned=false] - If true, memory doesn't decay (full boost)
 * @param {number} [options.decayWeight=0.3] - Maximum decay boost
 * @param {number} [options.scaleDays=90] - Decay time constant
 * @returns {number} Adjusted score with decay applied
 *
 * @example
 * // New memory with 85% similarity
 * adjustScoreWithDecay(85, Date.now()); // ~85.3
 *
 * @example
 * // Pinned memory always gets full boost
 * adjustScoreWithDecay(70, '2020-01-01', { isPinned: true }); // ~70.3
 *
 * @example
 * // Old memory gets reduced boost
 * const yearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
 * adjustScoreWithDecay(80, yearAgo); // ~80.005
 */
function adjustScoreWithDecay(similarity, createdAt, options = {}) {
  const {
    isPinned = false,
    decayWeight = DECAY_CONFIG.decayWeight,
    scaleDays = DECAY_CONFIG.scaleDays
  } = options;

  // Validate similarity score
  const validSimilarity = Math.max(0, Math.min(100, similarity));

  // If decay is disabled globally, return raw similarity
  if (!DECAY_CONFIG.enabled) {
    return validSimilarity;
  }

  let boost;

  if (isPinned) {
    // Pinned memories don't decay - always get full boost
    boost = decayWeight;
  } else {
    // Calculate time-based decay boost
    boost = calculateDecayBoost(createdAt, { decayWeight, scaleDays });
  }

  // Apply boost to similarity score
  // Boost is already on 0-1 scale (as percentage), so we multiply by 100 for the 0-100 scale
  const adjustedScore = validSimilarity + (boost * 100);

  return adjustedScore;
}

/**
 * Get decay boost for display (0-100 percentage scale)
 *
 * Useful for UI display showing how much recency boost a memory receives.
 *
 * @param {number} ageDays - Age in days
 * @param {Object} [options={}] - Configuration options
 * @param {number} [options.decayWeight=0.3] - Maximum decay boost
 * @param {number} [options.scaleDays=90] - Decay time constant
 * @returns {number} Boost percentage (0-100)
 *
 * @example
 * getDecayBoostPercentage(0);   // 100 (brand new)
 * getDecayBoostPercentage(90);  // ~37 (after 90 days)
 * getDecayBoostPercentage(365); // ~2 (after a year)
 */
function getDecayBoostPercentage(ageDays, options = {}) {
  const {
    decayWeight = DECAY_CONFIG.decayWeight,
    scaleDays = DECAY_CONFIG.scaleDays
  } = options;

  // If decay is disabled, show 0% boost
  if (!DECAY_CONFIG.enabled) {
    return 0;
  }

  // Calculate what percentage of max boost this age receives
  const decayFactor = Math.exp(-ageDays / scaleDays);
  const percentage = decayFactor * 100;

  return Math.round(percentage * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate the effective half-life of the decay
 *
 * The half-life is the number of days until boost drops to 50% of initial.
 * With exponential decay: half_life = scale_days * ln(2) ≈ scale_days * 0.693
 *
 * @param {number} [scaleDays=90] - Decay time constant
 * @returns {number} Half-life in days
 *
 * @example
 * getHalfLife(90); // ~62.4 days
 */
function getHalfLife(scaleDays = DECAY_CONFIG.scaleDays) {
  return scaleDays * Math.LN2;
}

/**
 * Batch adjust scores for multiple memories
 *
 * Efficiently process multiple memories at once.
 *
 * @param {Array<Object>} memories - Array of { similarity, createdAt, isPinned? }
 * @param {Object} [options={}] - Decay configuration options
 * @returns {Array<Object>} Memories with adjustedScore added
 *
 * @example
 * const memories = [
 *   { id: 1, similarity: 85, createdAt: Date.now() },
 *   { id: 2, similarity: 90, createdAt: '2024-01-01', isPinned: true }
 * ];
 * batchAdjustScores(memories);
 * // Returns: [{ ...memory, adjustedScore: number }, ...]
 */
function batchAdjustScores(memories, options = {}) {
  return memories.map(memory => ({
    ...memory,
    adjustedScore: adjustScoreWithDecay(
      memory.similarity,
      memory.createdAt,
      {
        isPinned: memory.isPinned || false,
        ...options
      }
    )
  }));
}

module.exports = {
  // Core functions
  calculateDecayBoost,
  adjustScoreWithDecay,
  getDecayBoostPercentage,

  // Utility functions
  getHalfLife,
  batchAdjustScores,

  // Configuration
  DECAY_CONFIG
};
