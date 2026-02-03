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
────────────────────────────────────────────────────────────────*/

// REQ-017: 5-Factor Decay Composite weights
const FIVE_FACTOR_WEIGHTS = {
  temporal: 0.25,
  usage: 0.15,
  importance: 0.25,
  pattern: 0.20,
  citation: 0.15,
};

// Legacy 6-factor weights for backward compatibility
const DEFAULT_WEIGHTS = {
  similarity: 0.30,
  importance: 0.25,
  recency: 0.10,
  popularity: 0.15,
  tier_boost: 0.05,
  retrievability: 0.15,
};

// HIGH-003 FIX: Re-export DECAY_RATE for backward compatibility
const RECENCY_SCALE_DAYS = 1 / DECAY_RATE;

// REQ-017: FSRS v4 power-law formula R = (1 + 0.235 * t/S)^-0.5
const FSRS_FACTOR = 19 / 81;
const FSRS_DECAY = -0.5;

// REQ-017: Importance weight multipliers
// Aligned with IMPORTANCE_TIERS from importance-tiers.js (6 valid tiers)
// @see ./importance-tiers.js for canonical tier configuration
const IMPORTANCE_MULTIPLIERS = {
  constitutional: 2.0,
  critical: 1.5,
  important: 1.3,
  normal: 1.0,
  temporary: 0.6,
  deprecated: 0.1,
};

// Citation recency decay constants
const CITATION_DECAY_RATE = 0.1;
const CITATION_MAX_DAYS = 90;

// Pattern alignment bonus configuration
const PATTERN_ALIGNMENT_BONUSES = {
  exact_match: 0.3,
  partial_match: 0.15,
  semantic_threshold: 0.8,
  anchor_match: 0.25,
  type_match: 0.2,
};

/* ─────────────────────────────────────────────────────────────
   2. SCORE CALCULATIONS
────────────────────────────────────────────────────────────────*/

/**
 * T032: Calculate temporal/retrievability score (REQ-017 Factor 1)
 * Uses FSRS v4 power-law formula: R = (1 + 0.235 * t/S)^-0.5
 *
 * @param {Object} row - Memory row with stability and last_review fields
 * @returns {number} Retrievability score between 0 and 1
 */
function calculate_retrievability_score(row) {
  const stability = row.stability || 1.0;
  const last_review = row.last_review || row.updated_at || row.created_at;

  // BUG-007 FIX: Return neutral score when no timestamp (prevents NaN propagation)
  if (!last_review) {
    return 0.5;
  }

  const elapsed_ms = Date.now() - new Date(last_review).getTime();
  const elapsed_days = Math.max(0, elapsed_ms / (1000 * 60 * 60 * 24));

  if (fsrsScheduler && typeof fsrsScheduler.calculate_retrievability === 'function') {
    return fsrsScheduler.calculate_retrievability(stability, elapsed_days);
  }

  // Inline FSRS calculation (fallback when scheduler not available)
  const retrievability = Math.pow(1 + FSRS_FACTOR * (elapsed_days / stability), FSRS_DECAY);

  return Math.max(0, Math.min(1, retrievability));
}

const calculate_temporal_score = calculate_retrievability_score;

/**
 * T032: Calculate usage score (REQ-017 Factor 2)
 * Formula: min(1.5, 1.0 + accessCount * 0.05)
 * Normalized to 0-1 range for composite scoring
 *
 * @param {number} accessCount - Number of times memory was accessed
 * @returns {number} Usage score between 0 and 1
 */
function calculate_usage_score(accessCount) {
  const count = accessCount || 0;
  const usage_boost = Math.min(1.5, 1.0 + count * 0.05);
  return (usage_boost - 1.0) / 0.5;
}

/**
 * T032: Calculate importance score with multiplier (REQ-017 Factor 3)
 * Applies tier-specific multipliers: critical=1.5, high=1.2, normal=1.0, low=0.8
 *
 * @param {string} tier - Importance tier
 * @param {number} baseWeight - Base importance weight from row (0-1)
 * @returns {number} Importance score between 0 and 1
 */
function calculate_importance_score(tier, baseWeight) {
  const tierLower = (tier || 'normal').toLowerCase();
  const multiplier = IMPORTANCE_MULTIPLIERS[tierLower] || IMPORTANCE_MULTIPLIERS.normal;
  const base = baseWeight || 0.5;

  return Math.min(1, (base * multiplier) / 2.0);
}

/**
 * T033: Calculate citation recency score (REQ-017 Factor 5)
 * Decay based on days since last citation
 *
 * @param {Object} row - Memory row with last_cited field
 * @returns {number} Citation score between 0 and 1
 */
function calculate_citation_score(row) {
  const last_cited = row.last_cited || row.last_accessed || row.updated_at;

  if (!last_cited) {
    return 0.5;
  }

  const elapsed_ms = Date.now() - new Date(last_cited).getTime();
  const elapsed_days = Math.max(0, elapsed_ms / (1000 * 60 * 60 * 24));

  if (elapsed_days >= CITATION_MAX_DAYS) {
    return 0;
  }

  return 1 / (1 + elapsed_days * CITATION_DECAY_RATE);
}

/**
 * T034: Calculate pattern alignment score (REQ-017 Factor 4)
 * Bonus for matching query patterns
 *
 * @param {Object} row - Memory row with similarity, anchors, memory_type
 * @param {Object} options - Scoring options with query context
 * @returns {number} Pattern score between 0 and 1
 */
function calculate_pattern_score(row, options = {}) {
  let score = 0;
  const query = options.query || '';
  const queryLower = query.toLowerCase();

  const similarity = (row.similarity || 0) / 100;
  score = similarity * 0.5;

  if (row.title && queryLower) {
    const titleLower = row.title.toLowerCase();
    if (titleLower.includes(queryLower) || queryLower.includes(titleLower)) {
      score += PATTERN_ALIGNMENT_BONUSES.exact_match;
    } else {
      // Partial match: check for word overlap
      const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
      const titleWords = titleLower.split(/\s+/);
      const matches = queryWords.filter(qw => titleWords.some(tw => tw.includes(qw)));
      if (matches.length > 0 && queryWords.length > 0) {
        score += PATTERN_ALIGNMENT_BONUSES.partial_match * (matches.length / queryWords.length);
      }
    }
  }

  if (row.anchors && options.anchors) {
    const rowAnchors = Array.isArray(row.anchors) ? row.anchors : [row.anchors];
    const queryAnchors = Array.isArray(options.anchors) ? options.anchors : [options.anchors];
    const anchorMatches = queryAnchors.filter(qa =>
      rowAnchors.some(ra => ra && qa && ra.toLowerCase().includes(qa.toLowerCase()))
    );
    if (anchorMatches.length > 0 && queryAnchors.length > 0) {
      score += PATTERN_ALIGNMENT_BONUSES.anchor_match * (anchorMatches.length / queryAnchors.length);
    }
  }

  if (row.memory_type && queryLower) {
    const typeMap = {
      'decision': ['why', 'decided', 'chose', 'reason'],
      'blocker': ['stuck', 'blocked', 'issue', 'problem'],
      'context': ['context', 'background', 'overview'],
      'next-step': ['next', 'todo', 'action', 'plan'],
      'insight': ['learned', 'insight', 'discovery', 'found'],
    };
    const intentKeywords = typeMap[row.memory_type] || [];
    const hasTypeMatch = intentKeywords.some(kw => queryLower.includes(kw));
    if (hasTypeMatch) {
      score += PATTERN_ALIGNMENT_BONUSES.type_match;
    }
  }

  if (similarity >= PATTERN_ALIGNMENT_BONUSES.semantic_threshold) {
    score += (similarity - PATTERN_ALIGNMENT_BONUSES.semantic_threshold) * 0.5;
  }

  return Math.max(0, Math.min(1, score));
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

/* ─────────────────────────────────────────────────────────────
   3. COMPOSITE SCORING FUNCTIONS
────────────────────────────────────────────────────────────────*/

/**
 * T032: Calculate 5-factor composite score (REQ-017)
 * Factors: temporal, usage, importance, pattern, citation
 *
 * @param {Object} row - Memory row with all required fields
 * @param {Object} options - Scoring options
 * @param {Object} options.weights - Custom weights (defaults to FIVE_FACTOR_WEIGHTS)
 * @param {string} options.query - Query string for pattern matching
 * @param {Array} options.anchors - Anchors for pattern matching
 * @returns {number} Composite score between 0 and 1
 */
function calculate_five_factor_score(row, options = {}) {
  const weights = { ...FIVE_FACTOR_WEIGHTS, ...options.weights };
  const tier = row.importance_tier || 'normal';

  const temporal_score = calculate_temporal_score(row);
  const usage_score = calculate_usage_score(row.access_count || 0);
  const importance_score = calculate_importance_score(tier, row.importance_weight);
  const pattern_score = calculate_pattern_score(row, options);
  const citation_score = calculate_citation_score(row);

  const composite = (
    temporal_score * weights.temporal +
    usage_score * weights.usage +
    importance_score * weights.importance +
    pattern_score * weights.pattern +
    citation_score * weights.citation
  );

  return Math.max(0, Math.min(1, composite));
}

/**
 * Legacy 6-factor composite score for backward compatibility
 * Use calculate_five_factor_score for REQ-017 compliant scoring
 */
function calculate_composite_score(row, options = {}) {
  if (options.use_five_factor_model) {
    return calculate_five_factor_score(row, options);
  }

  const weights = { ...DEFAULT_WEIGHTS, ...options.weights };

  const similarity = (row.similarity || 0) / 100;
  const importance = row.importance_weight || 0.5;
  const timestamp = row.updated_at || row.created_at;
  const tier = row.importance_tier || 'normal';
  // HIGH-003 FIX: Pass tier for constitutional exemption
  const recency_score = calculate_recency_score(timestamp, tier);
  const popularity_score = calculate_popularity_score(row.access_count || 0);
  const tier_boost = get_tier_boost(tier);
  const retrievability_score = calculate_retrievability_score(row);

  const composite = (
    similarity * weights.similarity +
    importance * weights.importance +
    recency_score * weights.recency +
    popularity_score * weights.popularity +
    tier_boost * weights.tier_boost +
    retrievability_score * weights.retrievability
  );

  return Math.max(0, Math.min(1, composite));
}

/* ─────────────────────────────────────────────────────────────
   4. BATCH OPERATIONS
────────────────────────────────────────────────────────────────*/

/**
 * T032: Apply 5-factor scoring to a batch of results
 *
 * @param {Array} results - Array of memory rows
 * @param {Object} options - Scoring options
 * @returns {Array} Scored and sorted results
 */
function apply_five_factor_scoring(results, options = {}) {
  const scored = results.map(row => ({
    ...row,
    composite_score: calculate_five_factor_score(row, options),
    _scoring: {
      temporal: calculate_temporal_score(row),
      usage: calculate_usage_score(row.access_count || 0),
      importance: calculate_importance_score(row.importance_tier || 'normal', row.importance_weight),
      pattern: calculate_pattern_score(row, options),
      citation: calculate_citation_score(row),
    },
  }));

  return scored.sort((a, b) => b.composite_score - a.composite_score);
}

/**
 * Legacy batch scoring for backward compatibility
 */
function apply_composite_scoring(results, options = {}) {
  if (options.use_five_factor_model) {
    return apply_five_factor_scoring(results, options);
  }

  const scored = results.map(row => {
    const tier = row.importance_tier || 'normal';
    return {
      ...row,
      composite_score: calculate_composite_score(row, options),
      _scoring: {
        similarity: (row.similarity || 0) / 100,
        importance: row.importance_weight || 0.5,
        recency: calculate_recency_score(row.updated_at || row.created_at, tier),
        popularity: calculate_popularity_score(row.access_count || 0),
        tier_boost: get_tier_boost(tier),
        retrievability: calculate_retrievability_score(row),
      },
    };
  });

  return scored.sort((a, b) => b.composite_score - a.composite_score);
}

/**
 * T032: Get 5-factor score breakdown
 *
 * @param {Object} row - Memory row
 * @param {Object} options - Scoring options
 * @returns {Object} Detailed factor breakdown
 */
function get_five_factor_breakdown(row, options = {}) {
  const weights = { ...FIVE_FACTOR_WEIGHTS, ...options.weights };
  const tier = row.importance_tier || 'normal';

  const temporal = calculate_temporal_score(row);
  const usage = calculate_usage_score(row.access_count || 0);
  const importance = calculate_importance_score(tier, row.importance_weight);
  const pattern = calculate_pattern_score(row, options);
  const citation = calculate_citation_score(row);

  return {
    factors: {
      temporal: { value: temporal, weight: weights.temporal, contribution: temporal * weights.temporal, description: 'FSRS retrievability decay' },
      usage: { value: usage, weight: weights.usage, contribution: usage * weights.usage, description: 'Access frequency boost' },
      importance: { value: importance, weight: weights.importance, contribution: importance * weights.importance, description: 'Tier-based importance' },
      pattern: { value: pattern, weight: weights.pattern, contribution: pattern * weights.pattern, description: 'Query pattern alignment' },
      citation: { value: citation, weight: weights.citation, contribution: citation * weights.citation, description: 'Citation recency' },
    },
    total: calculate_five_factor_score(row, options),
    model: '5-factor',
  };
}

/**
 * Legacy score breakdown for backward compatibility
 */
function get_score_breakdown(row, options = {}) {
  if (options.use_five_factor_model) {
    return get_five_factor_breakdown(row, options);
  }

  const weights = { ...DEFAULT_WEIGHTS, ...options.weights };
  const tier = row.importance_tier || 'normal';

  const similarity = (row.similarity || 0) / 100;
  const importance = row.importance_weight || 0.5;
  const recency = calculate_recency_score(row.updated_at || row.created_at, tier);
  const popularity = calculate_popularity_score(row.access_count || 0);
  const tierBoost = get_tier_boost(tier);
  const retrievability = calculate_retrievability_score(row);

  return {
    factors: {
      similarity: { value: similarity, weight: weights.similarity, contribution: similarity * weights.similarity },
      importance: { value: importance, weight: weights.importance, contribution: importance * weights.importance },
      recency: { value: recency, weight: weights.recency, contribution: recency * weights.recency },
      popularity: { value: popularity, weight: weights.popularity, contribution: popularity * weights.popularity },
      tier_boost: { value: tierBoost, weight: weights.tier_boost, contribution: tierBoost * weights.tier_boost },
      retrievability: { value: retrievability, weight: weights.retrievability, contribution: retrievability * weights.retrievability },
    },
    total: calculate_composite_score(row, options),
    model: '6-factor-legacy',
  };
}

/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Configuration
  DEFAULT_WEIGHTS,
  FIVE_FACTOR_WEIGHTS,
  RECENCY_SCALE_DAYS,
  IMPORTANCE_MULTIPLIERS,
  CITATION_DECAY_RATE,
  CITATION_MAX_DAYS,
  PATTERN_ALIGNMENT_BONUSES,
  FSRS_FACTOR,
  FSRS_DECAY,

  // 5-factor scoring functions (REQ-017)
  calculate_temporal_score,
  calculate_usage_score,
  calculate_importance_score,
  calculate_pattern_score,
  calculate_citation_score,
  calculate_five_factor_score,
  apply_five_factor_scoring,
  get_five_factor_breakdown,

  // Legacy functions (backward compatibility)
  calculate_recency_score,
  get_tier_boost,
  calculate_retrievability_score,
  calculate_composite_score,
  apply_composite_scoring,
  get_score_breakdown,
};
