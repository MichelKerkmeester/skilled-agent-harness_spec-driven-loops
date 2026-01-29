// ───────────────────────────────────────────────────────────────
// SCORING: COMPOSITE SCORING
// ───────────────────────────────────────────────────────────────
'use strict';

const { get_tier_config } = require('./importance-tiers');
const { calculate_popularity_score } = require('../storage/access-tracker');
// HIGH-003 FIX: Import unified recency scoring from folder-scoring
const { compute_recency_score, DECAY_RATE } = require('./folder-scoring');

// COGNITIVE-079: FSRS Scheduler for retrievability calculations
// Try to import, fallback to inline calculation if not yet available
let fsrsScheduler = null;
try {
  fsrsScheduler = require('../cognitive/fsrs-scheduler');
} catch (_) {
  // fsrs-scheduler not yet implemented, use inline calculation
}

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

// COGNITIVE-079: Updated weights to include retrievability factor
// Weights adjusted to sum to 1.0 with new FSRS-based retrievability
const DEFAULT_WEIGHTS = {
  similarity: 0.30,       // Reduced from 0.35 - semantic match still primary
  importance: 0.25,       // Unchanged - importance tier weight
  recency: 0.15,          // Reduced from 0.20 - retrievability captures decay better
  popularity: 0.10,       // Unchanged - access frequency boost
  tier_boost: 0.05,       // Reduced from 0.10 - less emphasis on tier alone
  retrievability: 0.15,   // NEW: FSRS-based memory strength factor
};

// HIGH-003 FIX: Re-export DECAY_RATE for backward compatibility
const RECENCY_SCALE_DAYS = 1 / DECAY_RATE; // Convert decay rate to equivalent scale (10 days)

// COGNITIVE-079: FSRS Constants for retrievability calculation
// From FSRS v4 research: R = (1 + FACTOR * t/S)^DECAY
const FSRS_FACTOR = 19 / 81;  // ~0.2346 - empirically derived from 100M+ reviews
const FSRS_DECAY = -0.5;      // Power-law decay exponent

/* ─────────────────────────────────────────────────────────────
   2. SCORE CALCULATIONS
──────────────────────────────────────────────────────────────── */

/**
 * COGNITIVE-079: Calculate retrievability score for a memory row
 * Uses FSRS v4 power-law formula: R = (1 + FACTOR * t/S)^DECAY
 *
 * @param {Object} row - Memory row with stability and last_review fields
 * @returns {number} Retrievability score between 0 and 1
 */
function calculate_retrievability_score(row) {
  // Get stability from row, default to 1.0 for backward compatibility
  const stability = row.stability || 1.0;

  // Get last review time, fallback to updated_at, then created_at
  const last_review = row.last_review || row.updated_at || row.created_at;

  // BUG-007 FIX: Return neutral score when no timestamp available (prevents NaN propagation)
  if (!last_review) {
    return 0.5;
  }

  // Calculate elapsed days since last review
  const elapsed_ms = Date.now() - new Date(last_review).getTime();
  const elapsed_days = Math.max(0, elapsed_ms / (1000 * 60 * 60 * 24));

  // Use fsrs-scheduler if available, otherwise calculate inline
  if (fsrsScheduler && typeof fsrsScheduler.calculate_retrievability === 'function') {
    return fsrsScheduler.calculate_retrievability(stability, elapsed_days);
  }

  // Inline FSRS calculation (fallback when scheduler not yet available)
  // R = (1 + FACTOR * t/S)^DECAY where t = elapsed_days, S = stability
  const retrievability = Math.pow(1 + FSRS_FACTOR * (elapsed_days / stability), FSRS_DECAY);

  // Clamp to [0, 1] range
  return Math.max(0, Math.min(1, retrievability));
}

// HIGH-003 FIX: Wrapper around unified compute_recency_score from folder-scoring
// Maintains backward compatibility with existing callers while using single implementation
function calculate_recency_score(timestamp, tier = 'normal') {
  return compute_recency_score(timestamp, tier, DECAY_RATE);
}

// BUG-013 FIX: Use centralized tier values from importance-tiers.js
// to ensure consistent tier weights across the codebase
function get_tier_boost(tier) {
  const tier_config = get_tier_config(tier);
  return tier_config.value;
}

function calculate_composite_score(row, options = {}) {
  const weights = { ...DEFAULT_WEIGHTS, ...options.weights };

  const similarity = (row.similarity || 0) / 100;
  const importance = row.importance_weight || 0.5;
  const timestamp = row.updated_at || row.created_at;
  const tier = row.importance_tier || 'normal';
  // HIGH-003 FIX: Pass tier to recency calculation for constitutional exemption
  const recency_score = calculate_recency_score(timestamp, tier);
  const popularity_score = calculate_popularity_score(row.access_count || 0);
  const tier_boost = get_tier_boost(tier);
  // COGNITIVE-079: Add FSRS-based retrievability score
  const retrievability_score = calculate_retrievability_score(row);

  const composite = (
    similarity * weights.similarity +
    importance * weights.importance +
    recency_score * weights.recency +
    popularity_score * weights.popularity +
    tier_boost * weights.tier_boost +
    retrievability_score * weights.retrievability  // COGNITIVE-079: NEW
  );

  return Math.max(0, Math.min(1, composite));
}

/* ─────────────────────────────────────────────────────────────
   3. BATCH OPERATIONS
──────────────────────────────────────────────────────────────── */

function apply_composite_scoring(results, options = {}) {
  const scored = results.map(row => {
    const tier = row.importance_tier || 'normal';
    return {
      ...row,
      composite_score: calculate_composite_score(row, options),
      _scoring: {
        similarity: (row.similarity || 0) / 100,
        importance: row.importance_weight || 0.5,
        // HIGH-003 FIX: Pass tier to recency calculation
        recency: calculate_recency_score(row.updated_at || row.created_at, tier),
        popularity: calculate_popularity_score(row.access_count || 0),
        tier_boost: get_tier_boost(tier),
        // COGNITIVE-079: Add FSRS-based retrievability to scoring breakdown
        retrievability: calculate_retrievability_score(row),
      },
    };
  });

  return scored.sort((a, b) => b.composite_score - a.composite_score);
}

function get_score_breakdown(row, options = {}) {
  const weights = { ...DEFAULT_WEIGHTS, ...options.weights };
  const tier = row.importance_tier || 'normal';

  const similarity = (row.similarity || 0) / 100;
  const importance = row.importance_weight || 0.5;
  // HIGH-003 FIX: Pass tier to recency calculation
  const recency_score = calculate_recency_score(row.updated_at || row.created_at, tier);
  const popularity_score = calculate_popularity_score(row.access_count || 0);
  const tier_boost = get_tier_boost(tier);
  // COGNITIVE-079: Add FSRS-based retrievability
  const retrievability_score = calculate_retrievability_score(row);

  return {
    factors: {
      similarity: { value: similarity, weight: weights.similarity, contribution: similarity * weights.similarity },
      importance: { value: importance, weight: weights.importance, contribution: importance * weights.importance },
      recency: { value: recency_score, weight: weights.recency, contribution: recency_score * weights.recency },
      popularity: { value: popularity_score, weight: weights.popularity, contribution: popularity_score * weights.popularity },
      tier_boost: { value: tier_boost, weight: weights.tier_boost, contribution: tier_boost * weights.tier_boost },
      // COGNITIVE-079: Add retrievability factor to breakdown
      retrievability: { value: retrievability_score, weight: weights.retrievability, contribution: retrievability_score * weights.retrievability },
    },
    total: calculate_composite_score(row, options),
  };
}

/* ─────────────────────────────────────────────────────────────
   4. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  DEFAULT_WEIGHTS,
  RECENCY_SCALE_DAYS,
  // COGNITIVE-079: Export FSRS constants for external use
  FSRS_FACTOR,
  FSRS_DECAY,
  calculate_recency_score,
  get_tier_boost,
  // COGNITIVE-079: Export retrievability helper
  calculate_retrievability_score,
  calculate_composite_score,
  apply_composite_scoring,
  get_score_breakdown,
};
