/**
 * Composite Scoring Module - Multi-factor memory ranking
 * @module lib/composite-scoring
 * @version 11.0.0
 */

'use strict';

const { getTierConfig } = require('./importance-tiers');
const { calculatePopularityScore } = require('./access-tracker');

// Default weights (configurable)
const DEFAULT_WEIGHTS = {
  similarity: 0.35,
  importance: 0.25,
  recency: 0.20,
  popularity: 0.10,
  tierBoost: 0.10
};

// Recency half-life in days
const RECENCY_HALF_LIFE_DAYS = 30;

/**
 * Calculate recency score using exponential decay
 * @param {string|number} timestamp - Created/updated timestamp
 * @param {number} [halfLifeDays=30] - Half-life in days
 * @returns {number} Score 0-1
 */
function calculateRecencyScore(timestamp, halfLifeDays = RECENCY_HALF_LIFE_DAYS) {
  const ts = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
  const ageMs = Date.now() - ts;
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  return Math.exp(-ageDays / halfLifeDays);
}

/**
 * Get tier boost multiplier
 * @param {string} tier - Importance tier
 * @returns {number} Boost value 0-1
 */
function getTierBoost(tier) {
  const boosts = {
    critical: 1.0,
    important: 0.8,
    normal: 0.5,
    temporary: 0.3,
    deprecated: 0.0
  };
  return boosts[tier] || 0.5;
}

/**
 * Calculate composite score from multiple factors
 * @param {Object} row - Memory row with all fields
 * @param {Object} [options]
 * @param {Object} [options.weights] - Override default weights
 * @returns {number} Composite score 0-1
 */
function calculateCompositeScore(row, options = {}) {
  const weights = { ...DEFAULT_WEIGHTS, ...options.weights };

  // Base similarity (normalized to 0-1)
  const similarity = (row.similarity || 0) / 100;

  // Importance tier weight
  const importance = row.importance_weight || 0.5;

  // Recency score
  const timestamp = row.updated_at || row.created_at;
  const recencyScore = calculateRecencyScore(timestamp);

  // Popularity score (from access count)
  const popularityScore = calculatePopularityScore(row.access_count || 0);

  // Tier boost
  const tierBoost = getTierBoost(row.importance_tier);

  // Weighted combination
  const composite = (
    similarity * weights.similarity +
    importance * weights.importance +
    recencyScore * weights.recency +
    popularityScore * weights.popularity +
    tierBoost * weights.tierBoost
  );

  return Math.min(1, composite);
}

/**
 * Apply composite scoring to search results
 * @param {Array} results - Search results with similarity scores
 * @param {Object} [options] - Scoring options
 * @returns {Array} Results with composite scores, sorted
 */
function applyCompositeScoring(results, options = {}) {
  const scored = results.map(row => ({
    ...row,
    compositeScore: calculateCompositeScore(row, options),
    _scoring: {
      similarity: (row.similarity || 0) / 100,
      importance: row.importance_weight || 0.5,
      recency: calculateRecencyScore(row.updated_at || row.created_at),
      popularity: calculatePopularityScore(row.access_count || 0),
      tierBoost: getTierBoost(row.importance_tier)
    }
  }));

  // Sort by composite score descending
  return scored.sort((a, b) => b.compositeScore - a.compositeScore);
}

/**
 * Get score breakdown for debugging/display
 * @param {Object} row - Memory row
 * @param {Object} [options]
 * @returns {Object} Detailed score breakdown
 */
function getScoreBreakdown(row, options = {}) {
  const weights = { ...DEFAULT_WEIGHTS, ...options.weights };

  const similarity = (row.similarity || 0) / 100;
  const importance = row.importance_weight || 0.5;
  const recencyScore = calculateRecencyScore(row.updated_at || row.created_at);
  const popularityScore = calculatePopularityScore(row.access_count || 0);
  const tierBoost = getTierBoost(row.importance_tier);

  return {
    factors: {
      similarity: { value: similarity, weight: weights.similarity, contribution: similarity * weights.similarity },
      importance: { value: importance, weight: weights.importance, contribution: importance * weights.importance },
      recency: { value: recencyScore, weight: weights.recency, contribution: recencyScore * weights.recency },
      popularity: { value: popularityScore, weight: weights.popularity, contribution: popularityScore * weights.popularity },
      tierBoost: { value: tierBoost, weight: weights.tierBoost, contribution: tierBoost * weights.tierBoost }
    },
    total: calculateCompositeScore(row, options)
  };
}

module.exports = {
  DEFAULT_WEIGHTS,
  RECENCY_HALF_LIFE_DAYS,
  calculateRecencyScore,
  getTierBoost,
  calculateCompositeScore,
  applyCompositeScoring,
  getScoreBreakdown
};
