// ───────────────────────────────────────────────────────────────
// SCORING: DECAY FUNCTIONS
// ───────────────────────────────────────────────────────────────
'use strict';

// Exponential decay scoring for memory relevance.
// Formula: adjusted_score = similarity + (decay_weight * e^(-age_days / scale_days))
//
// Decay Effects (decay_weight=0.3, scale_days=90):
// Age 0d=100%, 7d=93%, 30d=72%, 90d=37%, 180d=14%, 365d=2%
// Pinned memories bypass decay (always full boost).

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const DECAY_CONFIG = {
  decay_weight: 0.3,   // Max boost for new memories (30% of similarity scale)
  scale_days: 90,      // Decay time constant (not half-life)
  enabled: true,
};

/* ─────────────────────────────────────────────────────────────
   2. UTILITY FUNCTIONS
──────────────────────────────────────────────────────────────── */

function parse_timestamp(timestamp) {
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === 'string') return new Date(timestamp);
  if (typeof timestamp === 'number') {
    // Handle both seconds and milliseconds (< 1e12 = seconds)
    return timestamp < 1e12 ? new Date(timestamp * 1000) : new Date(timestamp);
  }
  return new Date();
}

function calculate_age_days(created_at) {
  const created = parse_timestamp(created_at);
  const diff_ms = Date.now() - created.getTime();
  return Math.max(0, diff_ms / (1000 * 60 * 60 * 24));
}

/* ─────────────────────────────────────────────────────────────
   3. DECAY CALCULATIONS
──────────────────────────────────────────────────────────────── */

// Calculate decay boost: decay_weight * e^(-age_days / scale_days)
function calculate_decay_boost(created_at, options = {}) {
  const { decay_weight = DECAY_CONFIG.decay_weight, scale_days = DECAY_CONFIG.scale_days } = options;

  if (!DECAY_CONFIG.enabled) return 0;

  const age_days = calculate_age_days(created_at);
  return decay_weight * Math.exp(-age_days / scale_days);
}

// Adjust similarity score with time decay (pinned memories get full boost)
function adjust_score_with_decay(similarity, created_at, options = {}) {
  const {
    is_pinned = false,
    decay_weight = DECAY_CONFIG.decay_weight,
    scale_days = DECAY_CONFIG.scale_days,
  } = options;

  const valid_similarity = Math.max(0, Math.min(100, similarity));
  if (!DECAY_CONFIG.enabled) return valid_similarity;

  const boost = is_pinned
    ? decay_weight
    : calculate_decay_boost(created_at, { decay_weight, scale_days });

  // Boost on 0-1 scale, multiply by 100 for 0-100 scale, cap at 100
  return Math.min(100, valid_similarity + (boost * 100));
}

// Returns boost percentage (0-100) for display
function get_decay_boost_percentage(age_days, options = {}) {
  const { scale_days = DECAY_CONFIG.scale_days } = options;

  if (!DECAY_CONFIG.enabled) return 0;

  const decay_factor = Math.exp(-age_days / scale_days);
  return Math.round(decay_factor * 10000) / 100;
}

// Half-life = scale_days * ln(2) ≈ scale_days * 0.693
function get_half_life(scale_days = DECAY_CONFIG.scale_days) {
  return scale_days * Math.LN2;
}

/* ─────────────────────────────────────────────────────────────
   4. BATCH OPERATIONS
──────────────────────────────────────────────────────────────── */

function batch_adjust_scores(memories, options = {}) {
  return memories.map(memory => ({
    ...memory,
    adjusted_score: adjust_score_with_decay(
      memory.similarity,
      memory.created_at,
      { is_pinned: memory.is_pinned || false, ...options }
    ),
  }));
}

/* ─────────────────────────────────────────────────────────────
   5. VALIDATION
──────────────────────────────────────────────────────────────── */

function validate_config(config) {
  const errors = [];

  // Validate hybrid search weights sum to 1.0
  if (config.hybrid_search) {
    const { fts_weight, vector_weight } = config.hybrid_search;
    if (typeof fts_weight === 'number' && typeof vector_weight === 'number') {
      if (Math.abs((fts_weight + vector_weight) - 1.0) > 0.01) {
        errors.push('hybrid_search: fts_weight + vector_weight must equal 1.0');
      }
    }
  }

  // Validate memory decay settings
  if (config.memory_decay) {
    const { scale_days, decay_weight } = config.memory_decay;
    if (typeof scale_days === 'number' && scale_days <= 0) {
      errors.push('memory_decay.scale_days must be positive');
    }
    if (typeof decay_weight === 'number' && (decay_weight < 0 || decay_weight > 1)) {
      errors.push('memory_decay.decay_weight must be between 0 and 1');
    }
  }

  // Validate composite scoring weights sum to 1.0
  if (config.composite_scoring?.weights) {
    const weights = Object.values(config.composite_scoring.weights);
    const sum = weights.reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1.0) > 0.01) {
      errors.push('composite_scoring.weights must sum to 1.0');
    }
  }

  if (errors.length > 0) {
    console.error('[scoring] Config validation errors:', errors);
  }

  return errors.length === 0;
}

/* ─────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  calculate_decay_boost,
  adjust_score_with_decay,
  get_decay_boost_percentage,
  get_half_life,
  batch_adjust_scores,
  validate_config,
  DECAY_CONFIG,
};
