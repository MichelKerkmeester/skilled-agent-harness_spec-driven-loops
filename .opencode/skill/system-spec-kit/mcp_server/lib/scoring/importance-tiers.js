// ───────────────────────────────────────────────────────────────
// SCORING: IMPORTANCE TIERS
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. TIER CONFIGURATION
──────────────────────────────────────────────────────────────── */

// Importance tier configuration definitions
// TierConfig: { value, searchBoost, decay, autoExpireDays, excludeFromSearch?, alwaysSurface?, maxTokens?, description }
const IMPORTANCE_TIERS = {
  constitutional: {
    value: 1.0,
    searchBoost: 3.0,
    decay: false,
    autoExpireDays: null,
    alwaysSurface: true,
    maxTokens: 2000,
    description: 'Core rules and constraints - always surface at top of results',
  },
  critical: {
    value: 1.0,
    searchBoost: 2.0,
    decay: false,
    autoExpireDays: null,
    description: 'Never expire, always surface first',
  },
  important: {
    value: 0.8,
    searchBoost: 1.5,
    decay: false,
    autoExpireDays: null,
    description: 'High priority, no decay',
  },
  normal: {
    value: 0.5,
    searchBoost: 1.0,
    decay: true,
    autoExpireDays: null,
    description: 'Standard memory',
  },
  temporary: {
    value: 0.3,
    searchBoost: 0.5,
    decay: true,
    autoExpireDays: 7,
    description: 'Session-scoped, auto-expires',
  },
  deprecated: {
    value: 0.1,
    searchBoost: 0.0,
    decay: false,
    autoExpireDays: null,
    excludeFromSearch: true,
    description: 'Hidden from search results',
  },
};

const VALID_TIERS = Object.keys(IMPORTANCE_TIERS);
const DEFAULT_TIER = 'normal';

/* ─────────────────────────────────────────────────────────────
   2. TIER CONFIGURATION FUNCTIONS
──────────────────────────────────────────────────────────────── */

// Get tier configuration by name (returns normal tier if invalid)
function get_tier_config(tier_name) {
  if (!tier_name || typeof tier_name !== 'string') {
    return IMPORTANCE_TIERS[DEFAULT_TIER];
  }
  return IMPORTANCE_TIERS[tier_name.toLowerCase()] || IMPORTANCE_TIERS[DEFAULT_TIER];
}

// Apply tier boost to a search score (critical=2x, important=1.5x, etc.)
function apply_tier_boost(score, tier) {
  if (typeof score !== 'number' || isNaN(score) || !isFinite(score)) {
    return 0;
  }
  const config = get_tier_config(tier);
  return score * config.searchBoost;
}

// Check if tier should be excluded from search (deprecated tier)
function is_excluded_from_search(tier) {
  const config = get_tier_config(tier);
  return config.excludeFromSearch === true;
}

// Check if tier allows decay over time (normal, temporary)
function allows_decay(tier) {
  const config = get_tier_config(tier);
  return config.decay === true;
}

// Get auto-expiration days for tier (null = never expires)
function get_auto_expire_days(tier) {
  const config = get_tier_config(tier);
  return config.autoExpireDays;
}

// Validate if tier name is valid
function is_valid_tier(tier) {
  if (!tier || typeof tier !== 'string') {
    return false;
  }
  return VALID_TIERS.includes(tier.toLowerCase());
}

// Get numeric importance value for tier (0.0-1.0)
function get_tier_value(tier) {
  const config = get_tier_config(tier);
  return config.value;
}

/* ─────────────────────────────────────────────────────────────
   3. SQL FILTER HELPERS
──────────────────────────────────────────────────────────────── */

// SQL WHERE clause for finding expired temporary memories
function get_expired_temporary_filter() {
  const temp_config = IMPORTANCE_TIERS.temporary;
  const days = temp_config.autoExpireDays;
  return `importance_tier = 'temporary' AND created_at < datetime('now', '-${days} days')`;
}

// SQL WHERE clause for searchable tiers (excludes deprecated)
function get_searchable_tiers_filter() {
  return "importance_tier != 'deprecated'";
}

// Check if tier should always surface in search (constitutional)
function should_always_surface(tier) {
  const config = get_tier_config(tier);
  return config.alwaysSurface === true;
}

// Get maximum token budget for tier (null = unlimited)
function get_max_tokens(tier) {
  const config = get_tier_config(tier);
  return config.maxTokens || null;
}

// SQL WHERE clause for constitutional tier
function get_constitutional_filter() {
  return "importance_tier = 'constitutional'";
}

/* ─────────────────────────────────────────────────────────────
   4. UTILITY FUNCTIONS
──────────────────────────────────────────────────────────────── */

// Normalize tier input to valid tier name (returns default if invalid)
function normalize_tier(tier) {
  if (!tier || typeof tier !== 'string') {
    return DEFAULT_TIER;
  }
  const normalized = tier.toLowerCase();
  return VALID_TIERS.includes(normalized) ? normalized : DEFAULT_TIER;
}

// Compare tiers for sorting (negative if A > B, positive if B > A)
function compare_tiers(tier_a, tier_b) {
  const value_a = get_tier_value(tier_a);
  const value_b = get_tier_value(tier_b);
  return value_b - value_a; // Higher value = more important, so reverse for descending sort
}

// Get all tiers sorted by importance (highest first)
function get_tiers_by_importance() {
  return [...VALID_TIERS].sort((a, b) => {
    return IMPORTANCE_TIERS[b].value - IMPORTANCE_TIERS[a].value;
  });
}

/* ─────────────────────────────────────────────────────────────
   5. MODULE EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Constants
  IMPORTANCE_TIERS,
  VALID_TIERS,
  DEFAULT_TIER,

  // Core functions
  get_tier_config,
  apply_tier_boost,
  is_excluded_from_search,
  allows_decay,
  get_auto_expire_days,
  is_valid_tier,
  get_tier_value,
  should_always_surface,
  get_max_tokens,

  // SQL helpers
  get_expired_temporary_filter,
  get_searchable_tiers_filter,
  get_constitutional_filter,

  // Utility functions
  normalize_tier,
  compare_tiers,
  get_tiers_by_importance,
};
