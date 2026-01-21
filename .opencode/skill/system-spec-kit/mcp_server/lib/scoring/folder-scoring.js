// ───────────────────────────────────────────────────────────────
// SCORING: FOLDER SCORING
// ───────────────────────────────────────────────────────────────
'use strict';

// TODO: Phase 2 - will be used for popularity-weighted scoring
// const { calculate_popularity_score } = require('../storage/access-tracker');

/* ─────────────────────────────────────────────────────────────
   1. CONSTANTS
──────────────────────────────────────────────────────────────── */

/**
 * Archive detection patterns (Decision D2)
 * Folders matching these are deprioritized in rankings
 */
const ARCHIVE_PATTERNS = [
  /z_archive\//i,      // Standard archive folder
  /\/scratch\//i,      // Temporary work
  /\/test-/i,          // Test prefixed subfolders
  /-test\//i,          // Test suffixed folders
  /\/prototype\//i,    // Prototype folders
];

/**
 * Importance tier weights (Decision D7)
 * Linear scaling from constitutional (1.0) to deprecated (0.0)
 */
const TIER_WEIGHTS = {
  constitutional: 1.0,
  critical: 0.8,
  important: 0.6,
  normal: 0.4,
  temporary: 0.2,
  deprecated: 0.0,
};

/**
 * Composite score weights for folders (Decision D1)
 * Recency is highest because primary use case is "resume recent work"
 */
const SCORE_WEIGHTS = {
  recency: 0.40,
  importance: 0.30,
  activity: 0.20,
  validation: 0.10,
};

/**
 * Decay rate for recency scoring (Decision D4)
 * 0.10 = 50% score at 10 days, 59% at 7 days
 */
const DECAY_RATE = 0.10;

/**
 * Maximum memories counted for activity score
 * Activity score = min(1, memory_count / MAX_ACTIVITY_MEMORIES)
 */
const MAX_ACTIVITY_MEMORIES = 5;

/**
 * Default validation score (placeholder until real user feedback tracking)
 */
const DEFAULT_VALIDATION_SCORE = 0.5;

/**
 * Tier priority order (highest to lowest)
 */
const TIER_ORDER = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];

/**
 * Archive pattern to multiplier mapping (Decision D2)
 * Consolidates pattern matching to eliminate duplication
 */
const ARCHIVE_MULTIPLIERS = [
  { pattern: /z_archive\//i, multiplier: 0.1, type: 'archive' },
  { pattern: /\/scratch\//i, multiplier: 0.2, type: 'scratch' },
  { pattern: /\/test-/i, multiplier: 0.2, type: 'test' },
  { pattern: /-test\//i, multiplier: 0.2, type: 'test' },
  { pattern: /\/prototype\//i, multiplier: 0.2, type: 'prototype' },
];

/* ─────────────────────────────────────────────────────────────
   2. ARCHIVE DETECTION
──────────────────────────────────────────────────────────────── */

/**
 * Check if a folder path matches archive patterns
 * Uses ARCHIVE_MULTIPLIERS for centralized pattern management
 * @param {string} folder_path - The folder path to check
 * @returns {boolean} True if folder is archived/test/scratch
 */
function is_archived(folder_path) {
  if (!folder_path) return false;
  return ARCHIVE_MULTIPLIERS.some(({ pattern }) => pattern.test(folder_path));
}

/**
 * Get the score multiplier for archived folders (Decision D2)
 * Uses ARCHIVE_MULTIPLIERS for centralized pattern-to-multiplier mapping
 * @param {string} folder_path - The folder path to check
 * @returns {number} Multiplier (0.1 for z_archive, 0.2 for scratch/test, 1.0 for active)
 */
function get_archive_multiplier(folder_path) {
  if (!folder_path) return 1.0;
  const match = ARCHIVE_MULTIPLIERS.find(({ pattern }) => pattern.test(folder_path));
  return match ? match.multiplier : 1.0;
}

/* ─────────────────────────────────────────────────────────────
   3. RECENCY SCORING
──────────────────────────────────────────────────────────────── */

/**
 * Compute recency score with inverse decay (Decision D4, D8)
 * Constitutional tier is exempt from decay (always returns 1.0)
 * 
 * Formula: score = 1 / (1 + days * decayRate)
 * At rate 0.10: 7 days = 0.59, 10 days = 0.50, 30 days = 0.25
 * 
 * @param {string} timestamp - ISO timestamp of last update
 * @param {string} [tier='normal'] - Importance tier (constitutional exempt from decay)
 * @param {number} [decay_rate=0.10] - Decay rate
 * @returns {number} Score from 0.0 to 1.0
 */
function compute_recency_score(timestamp, tier = 'normal', decay_rate = DECAY_RATE) {
  // Decision D8: Constitutional tier exempt from decay
  if (tier === 'constitutional') {
    return 1.0;
  }

  const now = Date.now();
  const updated = new Date(timestamp).getTime();

  // Handle invalid timestamps gracefully
  if (isNaN(updated)) {
    return 0.5; // Fallback to neutral score
  }

  const days_since = (now - updated) / (1000 * 60 * 60 * 24);

  // Prevent negative days (future timestamps)
  if (days_since < 0) {
    return 1.0;
  }

  return 1 / (1 + days_since * decay_rate);
}

/* ─────────────────────────────────────────────────────────────
   4. PATH UTILITIES
──────────────────────────────────────────────────────────────── */

/**
 * Simplify folder path for display
 * Extracts leaf folder name and marks archived folders
 * 
 * @param {string} full_path - Full folder path (e.g., "005-anobel.com/012-form-input")
 * @returns {string} Simplified name (e.g., "012-form-input" or "044-test (archived)")
 */
function simplify_folder_path(full_path) {
  if (!full_path) return 'unknown';

  const parts = full_path.split('/');
  const leaf = parts[parts.length - 1] || parts[parts.length - 2] || 'unknown';

  return is_archived(full_path) ? `${leaf} (archived)` : leaf;
}

/* ─────────────────────────────────────────────────────────────
   5. FOLDER SCORING
──────────────────────────────────────────────────────────────── */

/**
 * Compute composite score for a single folder (Decision D1)
 * 
 * Formula: score = (recency*0.4 + importance*0.3 + activity*0.2 + validation*0.1) * archiveMultiplier
 * 
 * @param {string} folder_path - Folder path
 * @param {Array<object>} folder_memories - Array of memory objects in this folder
 * @returns {object} Score breakdown { score, recencyScore, importanceScore, activityScore, validationScore }
 */
function compute_single_folder_score(folder_path, folder_memories) {
  if (!folder_memories || folder_memories.length === 0) {
    return {
      score: 0,
      recencyScore: 0,
      importanceScore: 0,
      activityScore: 0,
      validationScore: DEFAULT_VALIDATION_SCORE,
    };
  }

  // Recency: best score from any memory in folder
  const recency_score = Math.max(...folder_memories.map(m =>
    compute_recency_score(m.updatedAt || m.updated_at || m.createdAt || m.created_at, m.importanceTier || m.importance_tier)
  ));

  // Activity: capped at MAX_ACTIVITY_MEMORIES for max score
  const activity_score = Math.min(1, folder_memories.length / MAX_ACTIVITY_MEMORIES);

  // Importance: weighted average of tiers
  const importance_sum = folder_memories.reduce((sum, m) => {
    const tier = m.importanceTier || m.importance_tier || 'normal';
    return sum + (TIER_WEIGHTS[tier] ?? TIER_WEIGHTS.normal);
  }, 0);
  const importance_score = importance_sum / folder_memories.length;

  // Validation: placeholder until real user feedback tracking (Phase 3)
  const validation_score = DEFAULT_VALIDATION_SCORE;

  // Composite score
  const raw_score = (
    SCORE_WEIGHTS.recency * recency_score +
    SCORE_WEIGHTS.importance * importance_score +
    SCORE_WEIGHTS.activity * activity_score +
    SCORE_WEIGHTS.validation * validation_score
  );

  // Apply archive multiplier (Decision D2)
  const final_score = raw_score * get_archive_multiplier(folder_path);

  return {
    score: Math.round(final_score * 1000) / 1000,
    recencyScore: Math.round(recency_score * 1000) / 1000,
    importanceScore: Math.round(importance_score * 1000) / 1000,
    activityScore: Math.round(activity_score * 1000) / 1000,
    validationScore: validation_score,
  };
}

/**
 * Find the highest importance tier among memories
 * @param {Array<Object>} memories - Array of memory objects with importanceTier property
 * @returns {string} The highest tier found, or 'normal' if array is empty or no tiers found
 */
function find_top_tier(memories) {
  if (!memories || memories.length === 0) return 'normal';

  const tiers = memories.map(m => m.importanceTier || m.importance_tier || 'normal');
  return TIER_ORDER.find(t => tiers.includes(t)) || 'normal';
}

/**
 * Find the most recent activity timestamp among memories
 * @param {Array<Object>} memories - Array of memory objects with updatedAt or createdAt properties
 * @returns {string} ISO timestamp of most recent activity, or current time if no valid dates found
 */
function find_last_activity(memories) {
  if (!memories || memories.length === 0) {
    return new Date().toISOString();
  }

  const timestamps = memories.map(m => {
    const ts = m.updatedAt || m.updated_at || m.createdAt || m.created_at;
    return new Date(ts).getTime();
  }).filter(t => !isNaN(t));

  if (timestamps.length === 0) {
    return new Date().toISOString();
  }

  return new Date(Math.max(...timestamps)).toISOString();
}

/* ─────────────────────────────────────────────────────────────
   6. MAIN COMPUTATION
──────────────────────────────────────────────────────────────── */

/**
 * @typedef {object} FolderScore
 * @property {string} folder - Full folder path
 * @property {string} simplified - Leaf name with "(archived)" suffix if applicable
 * @property {number} count - Memory count in folder
 * @property {number} score - Composite score 0.0-1.0
 * @property {number} recencyScore - Recency component 0.0-1.0
 * @property {number} importanceScore - Importance component 0.0-1.0
 * @property {number} activityScore - Activity component 0.0-1.0
 * @property {number} validationScore - Validation component 0.0-1.0
 * @property {string} lastActivity - ISO timestamp of most recent activity
 * @property {boolean} isArchived - Whether folder matches archive patterns
 * @property {string} topTier - Highest importance tier in folder
 */

/**
 * Compute scores for all folders from a set of memories
 * 
 * @param {Array<object>} memories - Array of memory objects (from memory_list or similar)
 * @param {object} [options={}] - Computation options
 * @param {string[]} [options.excludePatterns] - Additional patterns to exclude (regex strings)
 * @param {boolean} [options.includeArchived=false] - Whether to include archived folders
 * @param {number} [options.limit] - Maximum folders to return (undefined = all)
 * @returns {FolderScore[]} Array of folder scores, sorted by score descending
 */
function compute_folder_scores(memories, options = {}) {
  const {
    excludePatterns = [],
    includeArchived = false,
    limit,
  } = options;

  if (!memories || !Array.isArray(memories) || memories.length === 0) {
    return [];
  }

  // Build additional exclude patterns with error logging
  const extra_patterns = excludePatterns
    .filter(p => typeof p === 'string')
    .map(p => {
      try {
        return new RegExp(p, 'i');
      } catch (err) {
        console.warn(`[folder-scoring] Invalid exclude pattern '${p}': ${err.message}`);
        return null;
      }
    })
    .filter(Boolean);

  // Group memories by folder
  const folder_map = new Map();
  for (const memory of memories) {
    const folder = memory.specFolder || memory.spec_folder || 'unknown';
    if (!folder_map.has(folder)) {
      folder_map.set(folder, []);
    }
    folder_map.get(folder).push(memory);
  }

  // Compute scores for each folder
  const folder_scores = [];
  for (const [folder, folder_memories] of folder_map) {
    const is_archived_folder = is_archived(folder);

    // Skip archived unless includeArchived is true
    if (is_archived_folder && !includeArchived) continue;

    // Skip if matches extra exclude patterns
    const excluded_by_extra = extra_patterns.some(p => p.test(folder));
    if (excluded_by_extra) continue;

    const scores = compute_single_folder_score(folder, folder_memories);
    const top_tier = find_top_tier(folder_memories);
    const last_activity = find_last_activity(folder_memories);

    folder_scores.push({
      folder,
      simplified: simplify_folder_path(folder),
      count: folder_memories.length,
      score: scores.score,
      recencyScore: scores.recencyScore,
      importanceScore: scores.importanceScore,
      activityScore: scores.activityScore,
      validationScore: scores.validationScore,
      lastActivity: last_activity,
      isArchived: is_archived_folder,
      topTier: top_tier,
    });
  }

  // Sort by score descending
  folder_scores.sort((a, b) => b.score - a.score);

  // Apply limit if specified
  if (typeof limit === 'number' && limit > 0) {
    return folder_scores.slice(0, limit);
  }

  return folder_scores;
}

/* ─────────────────────────────────────────────────────────────
   7. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Main function
  compute_folder_scores,

  // Archive detection
  is_archived,
  get_archive_multiplier,

  // Scoring utilities
  compute_recency_score,
  compute_single_folder_score,
  simplify_folder_path,
  find_top_tier,
  find_last_activity,

  // Constants
  ARCHIVE_PATTERNS,
  TIER_WEIGHTS,
  SCORE_WEIGHTS,
  DECAY_RATE,
  TIER_ORDER,
};
