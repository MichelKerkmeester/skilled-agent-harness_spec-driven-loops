/**
 * Importance Tiers Module - Six-tier memory prioritization
 *
 * Implements a 6-tier importance classification system for semantic memories.
 * Each tier has different search boost multipliers, decay behavior, and
 * auto-expiration settings.
 *
 * Tier Overview:
 * | Tier          | Value | Search Boost | Decay | Auto-Expire | Use Case                    |
 * |---------------|-------|--------------|-------|-------------|-----------------------------|
 * | constitutional| 1.0   | 3.0x         | No    | Never       | Always-surface core rules   |
 * | critical      | 1.0   | 2.0x         | No    | Never       | Architecture decisions      |
 * | important     | 0.8   | 1.5x         | No    | Never       | Key implementations         |
 * | normal        | 0.5   | 1.0x         | Yes   | Never       | Standard memories           |
 * | temporary     | 0.3   | 0.5x         | Yes   | 7 days      | Session notes               |
 * | deprecated    | 0.1   | 0.0x         | N/A   | Manual      | Hidden from search          |
 *
 * @module lib/importance-tiers
 * @version 12.0.0
 */

'use strict';

/**
 * Importance tier configuration definitions
 * @constant {Object.<string, TierConfig>}
 * @typedef {Object} TierConfig
 * @property {number} value - Numeric importance value (0.0-1.0)
 * @property {number} searchBoost - Multiplier applied to search scores
 * @property {boolean} decay - Whether the memory decays over time
 * @property {number|null} autoExpireDays - Days until auto-expiration (null = never)
 * @property {boolean} [excludeFromSearch] - If true, excluded from search results
 * @property {boolean} [alwaysSurface] - If true, always included in search results regardless of query
 * @property {number} [maxTokens] - Maximum token budget for this tier in results
 * @property {string} description - Human-readable description of the tier
 */
const IMPORTANCE_TIERS = {
  constitutional: {
    value: 1.0,
    searchBoost: 3.0,
    decay: false,
    autoExpireDays: null,
    alwaysSurface: true,
    maxTokens: 500,
    description: 'Core rules and constraints - always surface at top of results'
  },
  critical: {
    value: 1.0,
    searchBoost: 2.0,
    decay: false,
    autoExpireDays: null,
    description: 'Never expire, always surface first'
  },
  important: {
    value: 0.8,
    searchBoost: 1.5,
    decay: false,
    autoExpireDays: null,
    description: 'High priority, no decay'
  },
  normal: {
    value: 0.5,
    searchBoost: 1.0,
    decay: true,
    autoExpireDays: null,
    description: 'Standard memory'
  },
  temporary: {
    value: 0.3,
    searchBoost: 0.5,
    decay: true,
    autoExpireDays: 7,
    description: 'Session-scoped, auto-expires'
  },
  deprecated: {
    value: 0.1,
    searchBoost: 0.0,
    decay: false,
    autoExpireDays: null,
    excludeFromSearch: true,
    description: 'Hidden from search results'
  }
};

/**
 * Array of valid tier names
 * @constant {string[]}
 */
const VALID_TIERS = Object.keys(IMPORTANCE_TIERS);

/**
 * Default tier used when an invalid tier is specified
 * @constant {string}
 */
const DEFAULT_TIER = 'normal';

/**
 * Get tier configuration by name
 *
 * Returns the full configuration object for the specified tier.
 * If the tier name is invalid, returns the normal tier config.
 *
 * @param {string} tierName - The name of the importance tier
 * @returns {TierConfig} The tier configuration object
 * @example
 * const config = getTierConfig('critical');
 * // Returns: { value: 1.0, searchBoost: 2.0, decay: false, ... }
 *
 * const defaultConfig = getTierConfig('invalid');
 * // Returns: normal tier config (fallback)
 */
function getTierConfig(tierName) {
  if (!tierName || typeof tierName !== 'string') {
    return IMPORTANCE_TIERS[DEFAULT_TIER];
  }
  return IMPORTANCE_TIERS[tierName.toLowerCase()] || IMPORTANCE_TIERS[DEFAULT_TIER];
}

/**
 * Apply tier boost to a search score
 *
 * Multiplies the base search score by the tier's search boost factor.
 * Critical memories get 2x boost, important get 1.5x, etc.
 *
 * @param {number} score - The base search score (typically 0.0-1.0)
 * @param {string} tier - The importance tier name
 * @returns {number} The boosted score
 * @example
 * applyTierBoost(0.8, 'critical');  // Returns: 1.6 (0.8 * 2.0)
 * applyTierBoost(0.8, 'important'); // Returns: 1.2 (0.8 * 1.5)
 * applyTierBoost(0.8, 'normal');    // Returns: 0.8 (0.8 * 1.0)
 * applyTierBoost(0.8, 'temporary'); // Returns: 0.4 (0.8 * 0.5)
 * applyTierBoost(0.8, 'deprecated');// Returns: 0.0 (0.8 * 0.0)
 */
function applyTierBoost(score, tier) {
  if (typeof score !== 'number' || isNaN(score)) {
    return 0;
  }
  const config = getTierConfig(tier);
  return score * config.searchBoost;
}

/**
 * Check if a tier should be excluded from search results
 *
 * Deprecated memories are hidden from regular search to reduce noise
 * while still preserving them for manual access.
 *
 * @param {string} tier - The importance tier name
 * @returns {boolean} True if the tier should be excluded from search
 * @example
 * isExcludedFromSearch('deprecated'); // Returns: true
 * isExcludedFromSearch('normal');     // Returns: false
 */
function isExcludedFromSearch(tier) {
  const config = getTierConfig(tier);
  return config.excludeFromSearch === true;
}

/**
 * Check if a tier allows decay over time
 *
 * Normal and temporary memories can decay (reduce in relevance),
 * while critical and important memories maintain their importance.
 *
 * @param {string} tier - The importance tier name
 * @returns {boolean} True if the tier allows decay
 * @example
 * allowsDecay('normal');    // Returns: true
 * allowsDecay('temporary'); // Returns: true
 * allowsDecay('critical');  // Returns: false
 * allowsDecay('important'); // Returns: false
 */
function allowsDecay(tier) {
  const config = getTierConfig(tier);
  return config.decay === true;
}

/**
 * Get the auto-expiration days for a tier
 *
 * Returns the number of days until memories in this tier auto-expire.
 * Most tiers never expire (null), but temporary memories expire after 7 days.
 *
 * @param {string} tier - The importance tier name
 * @returns {number|null} Days until expiration, or null if never expires
 * @example
 * getAutoExpireDays('temporary'); // Returns: 7
 * getAutoExpireDays('normal');    // Returns: null
 * getAutoExpireDays('critical');  // Returns: null
 */
function getAutoExpireDays(tier) {
  const config = getTierConfig(tier);
  return config.autoExpireDays;
}

/**
 * Validate if a tier name is valid
 *
 * @param {string} tier - The tier name to validate
 * @returns {boolean} True if the tier name is valid
 * @example
 * isValidTier('critical');  // Returns: true
 * isValidTier('important'); // Returns: true
 * isValidTier('invalid');   // Returns: false
 * isValidTier(null);        // Returns: false
 */
function isValidTier(tier) {
  if (!tier || typeof tier !== 'string') {
    return false;
  }
  return VALID_TIERS.includes(tier.toLowerCase());
}

/**
 * Get the numeric importance value for a tier
 *
 * Returns the base importance value (0.0-1.0) for the specified tier.
 * This value is used for sorting and prioritization.
 *
 * @param {string} tier - The importance tier name
 * @returns {number} The importance value (0.0-1.0)
 * @example
 * getTierValue('critical');  // Returns: 1.0
 * getTierValue('important'); // Returns: 0.8
 * getTierValue('normal');    // Returns: 0.5
 */
function getTierValue(tier) {
  const config = getTierConfig(tier);
  return config.value;
}

/**
 * Get SQL WHERE clause for finding expired temporary memories
 *
 * Returns a SQL fragment to identify temporary memories that have
 * exceeded their 7-day lifespan and are eligible for cleanup.
 *
 * @returns {string} SQL WHERE clause for expired temporary memories
 * @example
 * const whereClause = getExpiredTemporaryFilter();
 * // Returns: "importance_tier = 'temporary' AND created_at < datetime('now', '-7 days')"
 */
function getExpiredTemporaryFilter() {
  const tempConfig = IMPORTANCE_TIERS.temporary;
  const days = tempConfig.autoExpireDays;
  return `importance_tier = 'temporary' AND created_at < datetime('now', '-${days} days')`;
}

/**
 * Get SQL WHERE clause for searchable tiers only
 *
 * Returns a SQL fragment to exclude deprecated memories from search results.
 *
 * @returns {string} SQL WHERE clause for searchable memories
 * @example
 * const whereClause = getSearchableTiersFilter();
 * // Returns: "importance_tier != 'deprecated'"
 */
function getSearchableTiersFilter() {
  return "importance_tier != 'deprecated'";
}

/**
 * Check if a tier should always be surfaced in search results
 *
 * Constitutional memories are always included regardless of query relevance.
 *
 * @param {string} tier - The importance tier name
 * @returns {boolean} True if the tier should always be surfaced
 * @example
 * shouldAlwaysSurface('constitutional'); // Returns: true
 * shouldAlwaysSurface('critical');       // Returns: false
 */
function shouldAlwaysSurface(tier) {
  const config = getTierConfig(tier);
  return config.alwaysSurface === true;
}

/**
 * Get the maximum token budget for a tier
 *
 * Returns the max tokens allowed for this tier in results.
 * Returns null if no limit is set.
 *
 * @param {string} tier - The importance tier name
 * @returns {number|null} Max tokens or null if unlimited
 * @example
 * getMaxTokens('constitutional'); // Returns: 500
 * getMaxTokens('critical');       // Returns: null
 */
function getMaxTokens(tier) {
  const config = getTierConfig(tier);
  return config.maxTokens || null;
}

/**
 * Get SQL WHERE clause for constitutional tier (always-surface memories)
 *
 * @returns {string} SQL WHERE clause for constitutional memories
 */
function getConstitutionalFilter() {
  return "importance_tier = 'constitutional'";
}

/**
 * Normalize tier input to valid tier name
 *
 * Converts input to lowercase and validates. Returns default tier if invalid.
 *
 * @param {string} tier - The tier input to normalize
 * @returns {string} A valid tier name
 * @example
 * normalizeTier('CRITICAL'); // Returns: 'critical'
 * normalizeTier('Normal');   // Returns: 'normal'
 * normalizeTier('invalid');  // Returns: 'normal' (default)
 * normalizeTier(null);       // Returns: 'normal' (default)
 */
function normalizeTier(tier) {
  if (!tier || typeof tier !== 'string') {
    return DEFAULT_TIER;
  }
  const normalized = tier.toLowerCase();
  return VALID_TIERS.includes(normalized) ? normalized : DEFAULT_TIER;
}

/**
 * Get tier comparison for sorting (higher value = more important)
 *
 * @param {string} tierA - First tier name
 * @param {string} tierB - Second tier name
 * @returns {number} Negative if A > B, positive if B > A, 0 if equal
 * @example
 * compareTiers('critical', 'normal');  // Returns: negative (critical is more important)
 * compareTiers('normal', 'critical');  // Returns: positive (normal is less important)
 * compareTiers('normal', 'normal');    // Returns: 0
 */
function compareTiers(tierA, tierB) {
  const valueA = getTierValue(tierA);
  const valueB = getTierValue(tierB);
  return valueB - valueA; // Higher value = more important, so reverse for descending sort
}

/**
 * Get all tiers sorted by importance (highest first)
 *
 * @returns {string[]} Array of tier names sorted by importance
 * @example
 * getTiersByImportance();
 * // Returns: ['critical', 'important', 'normal', 'temporary', 'deprecated']
 */
function getTiersByImportance() {
  return [...VALID_TIERS].sort((a, b) => {
    return IMPORTANCE_TIERS[b].value - IMPORTANCE_TIERS[a].value;
  });
}

module.exports = {
  // Constants
  IMPORTANCE_TIERS,
  VALID_TIERS,
  DEFAULT_TIER,

  // Core functions
  getTierConfig,
  applyTierBoost,
  isExcludedFromSearch,
  allowsDecay,
  getAutoExpireDays,
  isValidTier,
  getTierValue,
  shouldAlwaysSurface,
  getMaxTokens,

  // SQL helpers
  getExpiredTemporaryFilter,
  getSearchableTiersFilter,
  getConstitutionalFilter,

  // Utility functions
  normalizeTier,
  compareTiers,
  getTiersByImportance
};
