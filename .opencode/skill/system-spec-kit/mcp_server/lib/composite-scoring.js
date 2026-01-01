// ───────────────────────────────────────────────────────────────
// COMPOSITE-SCORING: Multi-factor relevance ranking for memories
// ───────────────────────────────────────────────────────────────
'use strict';

const { get_tier_config } = require('./importance-tiers');
const { calculate_popularity_score } = require('./access-tracker');

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

const DEFAULT_WEIGHTS = {
  similarity: 0.35,
  importance: 0.25,
  recency: 0.20,
  popularity: 0.10,
  tier_boost: 0.10,
};

const RECENCY_SCALE_DAYS = 30;

/* ───────────────────────────────────────────────────────────────
   2. SCORE CALCULATIONS
   ─────────────────────────────────────────────────────────────── */

// Exponential decay: e^(-age_days / scale_days)
function calculate_recency_score(timestamp, scale_days = RECENCY_SCALE_DAYS) {
  const ts = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
  const age_days = (Date.now() - ts) / (1000 * 60 * 60 * 24);
  return Math.exp(-age_days / scale_days);
}

function get_tier_boost(tier) {
  const boosts = {
    constitutional: 1.0,
    critical: 1.0,
    important: 0.8,
    normal: 0.5,
    temporary: 0.3,
    deprecated: 0.0,
  };
  return boosts[tier] || 0.5;
}

function calculate_composite_score(row, options = {}) {
  const weights = { ...DEFAULT_WEIGHTS, ...options.weights };

  const similarity = (row.similarity || 0) / 100;
  const importance = row.importance_weight || 0.5;
  const timestamp = row.updated_at || row.created_at;
  const recency_score = calculate_recency_score(timestamp);
  const popularity_score = calculate_popularity_score(row.access_count || 0);
  const tier_boost = get_tier_boost(row.importance_tier);

  const composite = (
    similarity * weights.similarity +
    importance * weights.importance +
    recency_score * weights.recency +
    popularity_score * weights.popularity +
    tier_boost * weights.tier_boost
  );

  return Math.min(1, composite);
}

/* ───────────────────────────────────────────────────────────────
   3. BATCH OPERATIONS
   ─────────────────────────────────────────────────────────────── */

function apply_composite_scoring(results, options = {}) {
  const scored = results.map(row => ({
    ...row,
    composite_score: calculate_composite_score(row, options),
    _scoring: {
      similarity: (row.similarity || 0) / 100,
      importance: row.importance_weight || 0.5,
      recency: calculate_recency_score(row.updated_at || row.created_at),
      popularity: calculate_popularity_score(row.access_count || 0),
      tier_boost: get_tier_boost(row.importance_tier),
    },
  }));

  return scored.sort((a, b) => b.composite_score - a.composite_score);
}

function get_score_breakdown(row, options = {}) {
  const weights = { ...DEFAULT_WEIGHTS, ...options.weights };

  const similarity = (row.similarity || 0) / 100;
  const importance = row.importance_weight || 0.5;
  const recency_score = calculate_recency_score(row.updated_at || row.created_at);
  const popularity_score = calculate_popularity_score(row.access_count || 0);
  const tier_boost = get_tier_boost(row.importance_tier);

  return {
    factors: {
      similarity: { value: similarity, weight: weights.similarity, contribution: similarity * weights.similarity },
      importance: { value: importance, weight: weights.importance, contribution: importance * weights.importance },
      recency: { value: recency_score, weight: weights.recency, contribution: recency_score * weights.recency },
      popularity: { value: popularity_score, weight: weights.popularity, contribution: popularity_score * weights.popularity },
      tier_boost: { value: tier_boost, weight: weights.tier_boost, contribution: tier_boost * weights.tier_boost },
    },
    total: calculate_composite_score(row, options),
  };
}

/* ───────────────────────────────────────────────────────────────
   4. EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  DEFAULT_WEIGHTS,
  RECENCY_SCALE_DAYS,
  calculate_recency_score,
  get_tier_boost,
  calculate_composite_score,
  apply_composite_scoring,
  get_score_breakdown,
};
