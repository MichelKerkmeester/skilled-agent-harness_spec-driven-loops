// ───────────────────────────────────────────────────────────────
// COGNITIVE: TIER CLASSIFIER (5-STATE MODEL)
// ───────────────────────────────────────────────────────────────
'use strict';

const fs = require('fs');
const path = require('path');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────*/

/** Parse threshold from env var with validation */
function parse_threshold(envVar, defaultVal) {
  const parsed = parseFloat(process.env[envVar]);
  return !isNaN(parsed) && parsed >= 0 && parsed <= 1 ? parsed : defaultVal;
}

/** Parse integer limit from env var with validation */
function parse_limit(envVar, defaultVal) {
  const parsed = parseInt(process.env[envVar], 10);
  return !isNaN(parsed) && parsed > 0 ? parsed : defaultVal;
}

// REQ-081: 5-State Model thresholds based on retrievability R = e^(-t/S)
const STATE_THRESHOLDS = {
  HOT: 0.80,
  WARM: 0.25,
  COLD: 0.05,
  DORMANT: 0.02,
};

const ARCHIVED_DAYS_THRESHOLD = 90;

const TIER_CONFIG = {
  hotThreshold: parse_threshold('HOT_THRESHOLD', STATE_THRESHOLDS.HOT),
  warmThreshold: parse_threshold('WARM_THRESHOLD', STATE_THRESHOLDS.WARM),
  coldThreshold: parse_threshold('COLD_THRESHOLD', STATE_THRESHOLDS.COLD),
  archivedDaysThreshold: parse_limit('ARCHIVED_DAYS_THRESHOLD', ARCHIVED_DAYS_THRESHOLD),
  maxHotMemories: parse_limit('MAX_HOT_MEMORIES', 5),
  maxWarmMemories: parse_limit('MAX_WARM_MEMORIES', 10),
  summaryFallbackLength: 150,
};

// Validate threshold ordering (HOT > WARM > COLD)
if (TIER_CONFIG.hotThreshold <= TIER_CONFIG.warmThreshold) {
  console.warn('[tier-classifier] Invalid thresholds: HOT must be > WARM. Using defaults.');
  TIER_CONFIG.hotThreshold = STATE_THRESHOLDS.HOT;
  TIER_CONFIG.warmThreshold = STATE_THRESHOLDS.WARM;
}
if (TIER_CONFIG.warmThreshold <= TIER_CONFIG.coldThreshold) {
  console.warn('[tier-classifier] Invalid thresholds: WARM must be > COLD. Using defaults.');
  TIER_CONFIG.warmThreshold = STATE_THRESHOLDS.WARM;
  TIER_CONFIG.coldThreshold = STATE_THRESHOLDS.COLD;
}

/* ─────────────────────────────────────────────────────────────
   1.5 TYPE-SPECIFIC HALF-LIVES (REQ-002, T008)
────────────────────────────────────────────────────────────────*/

// Lazy-load memory types to avoid circular dependencies
let memoryTypesModule = null;

/** Get memory types module (lazy loaded) */
function get_memory_types_module() {
  if (memoryTypesModule !== null) {
    return memoryTypesModule;
  }

  try {
    memoryTypesModule = require('../config/memory-types');
    return memoryTypesModule;
  } catch (error) {
    console.warn('[tier-classifier] memory-types module not available:', error.message);
    memoryTypesModule = false;
    return null;
  }
}

/**
 * Get effective half-life for a memory based on its type (REQ-002, CHK-017)
 * Priority: explicit half_life_days > memory_type lookup > default
 *
 * @param {Object} memory - Memory object
 * @returns {number|null} Half-life in days, or null for no decay
 */
function get_effective_half_life(memory) {
  if (!memory || typeof memory !== 'object') {
    return 60; // Default to declarative half-life
  }

  // Priority 1: Explicit half_life_days override
  if (typeof memory.half_life_days === 'number' && memory.half_life_days > 0) {
    return memory.half_life_days;
  }
  if (typeof memory.halfLifeDays === 'number' && memory.halfLifeDays > 0) {
    return memory.halfLifeDays;
  }

  // Priority 2: Look up by memory_type
  const memoryType = memory.memory_type || memory.memoryType;
  if (memoryType) {
    const typesModule = get_memory_types_module();
    if (typesModule) {
      const halfLife = typesModule.get_half_life(memoryType);
      if (halfLife !== undefined) {
        return halfLife;
      }
    }
  }

  // Priority 3: Infer from importance_tier
  const importanceTier = memory.importance_tier || memory.importanceTier;
  if (importanceTier) {
    if (['constitutional', 'critical'].includes(importanceTier)) {
      return null;
    }
    if (importanceTier === 'temporary') {
      return 1;
    }
  }

  if (typeof memory.decay_half_life_days === 'number' && memory.decay_half_life_days > 0) {
    return memory.decay_half_life_days;
  }

  return 60;
}

/**
 * Calculate stability from half-life for FSRS compatibility.
 * FSRS stability = time for retrievability to reach target (default 90%).
 * Half-life = time for retrievability to reach 50%.
 *
 * Converting: stability = half_life * log(0.9) / log(0.5) ≈ half_life * 0.152
 *
 * @param {number|null} halfLifeDays - Half-life in days
 * @returns {number} FSRS stability value
 */
function half_life_to_stability(halfLifeDays) {
  if (halfLifeDays === null || halfLifeDays === undefined) {
    return 365;
  }
  if (typeof halfLifeDays !== 'number' || halfLifeDays <= 0) {
    return 1.0;
  }

  // FSRS uses R = (1 + f * t/S)^d where f ≈ 0.235, d = -0.5
  // For half-life calculation: 0.5 = (1 + 0.235 * t_half/S)^(-0.5)
  // Solving: S = 0.235 * t_half / (0.5^(-2) - 1) = 0.235 * t_half / 3
  // Simplified: stability ≈ half_life * 0.078
  // But for better tier differentiation, we use a linear scaling:
  // stability = half_life (1 day half-life = 1 day stability)
  return halfLifeDays;
}

/* ─────────────────────────────────────────────────────────────
   2. FSRS INTEGRATION (LAZY LOADED)
────────────────────────────────────────────────────────────────*/

let fsrsScheduler = null;

/** Attempt to load FSRS scheduler module (lazy to avoid circular deps) */
function get_fsrs_scheduler() {
  if (fsrsScheduler !== null) {
    return fsrsScheduler;
  }

  try {
    fsrsScheduler = require('./fsrs-scheduler');
    return fsrsScheduler;
  } catch (error) {
    fsrsScheduler = false;
    return null;
  }
}

/**
 * Calculate retrievability score using type-specific half-lives (REQ-002, T008)
 *
 * Priority order:
 * 1. Pre-computed retrievability
 * 2. Explicit stability via FSRS (memory has stability field)
 * 3. Type-specific half-life decay (T008 - primary decay method)
 * 4. Legacy attention score fallback
 *
 * T008 Design Decision:
 * - Memories WITH explicit stability use FSRS power-law decay
 * - Memories WITHOUT explicit stability use type-based half-life decay
 * - This allows FSRS-trained memories to use learned parameters while
 *   new memories use cognitively-appropriate type-specific decay rates
 *
 * @param {Object} memory - Memory object
 * @returns {number} Retrievability score (0.0 to 1.0)
 */
function calculate_retrievability(memory) {
  if (!memory || typeof memory !== 'object') {
    return 0;
  }

  if (typeof memory.retrievability === 'number' && !isNaN(memory.retrievability)) {
    return Math.max(0, Math.min(1, memory.retrievability));
  }

  const halfLifeDays = get_effective_half_life(memory);

  if (halfLifeDays === null) {
    return 1.0;
  }

  const lastReview = memory.last_review || memory.lastReview || memory.updated_at || memory.created_at;
  const lastAccess = memory.lastAccess || memory.last_access || lastReview;

  if (!lastAccess) {
    if (typeof memory.attentionScore === 'number' && !isNaN(memory.attentionScore)) {
      return Math.max(0, Math.min(1, memory.attentionScore));
    }
    return 0;
  }

  const elapsedDays = calculate_days_since(lastAccess);

  // FSRS-trained memories use FSRS formula to preserve learned parameters
  if (typeof memory.stability === 'number' && memory.stability > 0) {
    const scheduler = get_fsrs_scheduler();
    if (scheduler && typeof scheduler.calculate_retrievability === 'function') {
      try {
        return scheduler.calculate_retrievability(memory.stability, elapsedDays);
      } catch (error) {
        console.warn(`[tier-classifier] FSRS calculation failed: ${error.message}`);
        // Fall through to half-life decay
      }
    }

    const retrievability = Math.exp(-elapsedDays / memory.stability);
    return Math.max(0, Math.min(1, retrievability));
  }

  // REQ-017: Half-life decay R(t) = 0.5^(t / half_life)
  if (halfLifeDays > 0) {
    const retrievability = Math.pow(0.5, elapsedDays / halfLifeDays);
    return Math.max(0, Math.min(1, retrievability));
  }

  if (typeof memory.attentionScore === 'number' && !isNaN(memory.attentionScore)) {
    return Math.max(0, Math.min(1, memory.attentionScore));
  }

  return 0;
}

/** Calculate days elapsed since a timestamp */
function calculate_days_since(timestamp) {
  if (!timestamp) {
    return Infinity;
  }

  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return Infinity;
    }
    const now = Date.now();
    const elapsed = now - date.getTime();
    return elapsed / (1000 * 60 * 60 * 24);
  } catch (error) {
    return Infinity;
  }
}

/* ─────────────────────────────────────────────────────────────
   3. STATE CLASSIFICATION (5-STATE MODEL)
────────────────────────────────────────────────────────────────*/

/** Classify memory into one of 5 states: HOT, WARM, COLD, DORMANT, ARCHIVED */
function classify_state(memory) {
  if (!memory || typeof memory !== 'object') {
    return 'DORMANT';
  }

  const lastAccess = memory.lastAccess || memory.last_access || memory.lastReview || memory.created_at;
  if (lastAccess) {
    const daysSinceAccess = calculate_days_since(lastAccess);
    if (daysSinceAccess >= TIER_CONFIG.archivedDaysThreshold) {
      return 'ARCHIVED';
    }
  }

  const retrievability = calculate_retrievability(memory);

  if (retrievability >= TIER_CONFIG.hotThreshold) {
    return 'HOT';
  }
  if (retrievability >= TIER_CONFIG.warmThreshold) {
    return 'WARM';
  }
  if (retrievability >= TIER_CONFIG.coldThreshold) {
    return 'COLD';
  }
  return 'DORMANT';
}

/** Legacy: Classify into HOT, WARM, or COLD (3-tier backward compatible) */
function classify_tier(attentionScore) {
  if (typeof attentionScore !== 'number' || isNaN(attentionScore)) {
    return 'COLD';
  }

  const score = Math.max(0, Math.min(1, attentionScore));

  if (score >= TIER_CONFIG.hotThreshold) {
    return 'HOT';
  }
  if (score >= TIER_CONFIG.warmThreshold) {
    return 'WARM';
  }
  return 'COLD';
}

/** Map 5-state to 3-tier for backward compatibility */
function state_to_tier(state) {
  switch (state) {
    case 'HOT':
      return 'HOT';
    case 'WARM':
      return 'WARM';
    case 'COLD':
    case 'DORMANT':
    case 'ARCHIVED':
    default:
      return 'COLD';
  }
}

/* ─────────────────────────────────────────────────────────────
   4. CONTENT RETRIEVAL BY STATE
────────────────────────────────────────────────────────────────*/

const CONTENT_RULES = {
  HOT: 'full',
  WARM: 'summary',
  COLD: null,
  DORMANT: null,
  ARCHIVED: null,
};

/** Get content for memory based on its state */
function get_state_content(memory, state) {
  if (!memory || typeof memory !== 'object') {
    return null;
  }

  const contentRule = CONTENT_RULES[state];

  switch (contentRule) {
    case 'full':
      return get_full_content(memory);
    case 'summary':
      return get_summary_content(memory);
    default:
      return null;
  }
}

/** Legacy: Get content based on tier */
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

/** Read full content from memory file */
function get_full_content(memory) {
  if (!memory.filePath) {
    return null;
  }

  try {
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

/** Get summary content - uses summary field or truncates full content */
function get_summary_content(memory) {
  if (memory.summary && typeof memory.summary === 'string' && memory.summary.trim()) {
    return memory.summary.trim();
  }

  const fullContent = get_full_content(memory);
  if (!fullContent) {
    return null;
  }

  if (fullContent.length <= TIER_CONFIG.summaryFallbackLength) {
    return fullContent;
  }

  let truncated = fullContent.substring(0, TIER_CONFIG.summaryFallbackLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > TIER_CONFIG.summaryFallbackLength * 0.7) {
    truncated = truncated.substring(0, lastSpace);
  }

  return truncated + '...';
}

/* ─────────────────────────────────────────────────────────────
   5. FILTERING AND LIMITING (5-STATE)
────────────────────────────────────────────────────────────────*/

/** Filter memories by state and apply limits (HOT max 5, WARM max 10) */
function filter_and_limit_by_state(memories) {
  if (!Array.isArray(memories)) {
    return [];
  }

  const hotMemories = [];
  const warmMemories = [];
  const coldMemories = [];
  const dormantMemories = [];
  const archivedMemories = [];

  for (const memory of memories) {
    const state = classify_state(memory);
    const retrievability = calculate_retrievability(memory);
    const enriched = { ...memory, state, retrievability };

    switch (state) {
      case 'HOT':
        hotMemories.push(enriched);
        break;
      case 'WARM':
        warmMemories.push(enriched);
        break;
      case 'COLD':
        coldMemories.push(enriched);
        break;
      case 'DORMANT':
        dormantMemories.push(enriched);
        break;
      case 'ARCHIVED':
        archivedMemories.push(enriched);
        break;
    }
  }

  hotMemories.sort((a, b) => b.retrievability - a.retrievability);
  warmMemories.sort((a, b) => b.retrievability - a.retrievability);

  const limitedHot = hotMemories.slice(0, TIER_CONFIG.maxHotMemories);
  const limitedWarm = warmMemories.slice(0, TIER_CONFIG.maxWarmMemories);

  return [...limitedHot, ...limitedWarm];
}

/** Legacy: Filter and limit by tier */
function filter_and_limit_by_tier(memories) {
  if (!Array.isArray(memories)) {
    return [];
  }

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
  }

  hotMemories.sort((a, b) => b.attentionScore - a.attentionScore);
  warmMemories.sort((a, b) => b.attentionScore - a.attentionScore);

  const limitedHot = hotMemories.slice(0, TIER_CONFIG.maxHotMemories);
  const limitedWarm = warmMemories.slice(0, TIER_CONFIG.maxWarmMemories);

  return [...limitedHot, ...limitedWarm];
}

/* ─────────────────────────────────────────────────────────────
   6. RESPONSE FORMATTING
────────────────────────────────────────────────────────────────*/

/** Format memories into state-aware response (5-state) */
function format_state_response(memories) {
  if (!Array.isArray(memories)) {
    return [];
  }

  const response = [];

  for (const memory of memories) {
    const state = memory.state || classify_state(memory);

    if (state === 'COLD' || state === 'DORMANT' || state === 'ARCHIVED') {
      continue;
    }

    const content = get_state_content(memory, state);
    const retrievability = memory.retrievability || calculate_retrievability(memory);

    response.push({
      id: memory.id || memory.memoryId,
      specFolder: memory.specFolder || memory.spec_folder,
      filePath: memory.filePath || memory.file_path,
      title: memory.title,
      state,
      tier: state_to_tier(state),
      retrievability,
      attentionScore: memory.attentionScore || retrievability,
      content,
      matchedPhrases: memory.matchedPhrases || [],
    });
  }

  return response;
}

/** Legacy: Format memories into tiered response */
function format_tiered_response(memories) {
  if (!Array.isArray(memories)) {
    return [];
  }

  const response = [];

  for (const memory of memories) {
    const tier = memory.tier || classify_tier(memory.attentionScore || 0);

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
   7. UTILITY FUNCTIONS
────────────────────────────────────────────────────────────────*/

/** Get state statistics for a set of memories */
function get_state_stats(memories) {
  if (!Array.isArray(memories)) {
    return { hot: 0, warm: 0, cold: 0, dormant: 0, archived: 0, total: 0 };
  }

  let hot = 0;
  let warm = 0;
  let cold = 0;
  let dormant = 0;
  let archived = 0;

  for (const memory of memories) {
    const state = classify_state(memory);

    switch (state) {
      case 'HOT':
        hot++;
        break;
      case 'WARM':
        warm++;
        break;
      case 'COLD':
        cold++;
        break;
      case 'DORMANT':
        dormant++;
        break;
      case 'ARCHIVED':
        archived++;
        break;
    }
  }

  return {
    hot,
    warm,
    cold,
    dormant,
    archived,
    total: memories.length,
    active: hot + warm,
    tracked: hot + warm + cold,
  };
}

/** Legacy: Get tier statistics */
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
    filtered: hot + warm,
  };
}

/** Check if memory qualifies for context inclusion */
function is_context_included(memory) {
  const state = classify_state(memory);
  return state === 'HOT' || state === 'WARM';
}

/** Legacy: Check if attention score qualifies for inclusion */
function is_included(attentionScore) {
  return classify_tier(attentionScore) !== 'COLD';
}

/** Get the threshold for a specific state */
function get_state_threshold(state) {
  switch (state) {
    case 'HOT':
      return TIER_CONFIG.hotThreshold;
    case 'WARM':
      return TIER_CONFIG.warmThreshold;
    case 'COLD':
      return TIER_CONFIG.coldThreshold;
    case 'DORMANT':
      return 0;
    default:
      return 0;
  }
}

/** Legacy: Get the threshold for a tier */
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

/** Check if memory should be archived (90+ days inactive) */
function should_archive(memory) {
  if (!memory || typeof memory !== 'object') {
    return false;
  }

  const lastAccess = memory.lastAccess || memory.last_access || memory.lastReview || memory.created_at;
  if (!lastAccess) {
    return false;
  }

  const daysSinceAccess = calculate_days_since(lastAccess);
  return daysSinceAccess >= TIER_CONFIG.archivedDaysThreshold;
}

/** Get all archived memories from a set */
function get_archived_memories(memories) {
  if (!Array.isArray(memories)) {
    return [];
  }
  return memories.filter(memory => classify_state(memory) === 'ARCHIVED');
}

/** Get all dormant memories from a set */
function get_dormant_memories(memories) {
  if (!Array.isArray(memories)) {
    return [];
  }
  return memories.filter(memory => classify_state(memory) === 'DORMANT');
}

/* ─────────────────────────────────────────────────────────────
   8. MODULE EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // 5-State classification (primary API)
  classifyState: classify_state,
  calculateRetrievability: calculate_retrievability,
  getStateContent: get_state_content,
  filterAndLimitByState: filter_and_limit_by_state,
  formatStateResponse: format_state_response,
  getStateStats: get_state_stats,
  isContextIncluded: is_context_included,
  getStateThreshold: get_state_threshold,
  stateToTier: state_to_tier,
  shouldArchive: should_archive,
  getArchivedMemories: get_archived_memories,
  getDormantMemories: get_dormant_memories,
  calculateDaysSince: calculate_days_since,

  // Type-specific half-lives (REQ-002, T008)
  getEffectiveHalfLife: get_effective_half_life,
  halfLifeToStability: half_life_to_stability,
  getMemoryTypesModule: get_memory_types_module,

  // Legacy 3-tier classification (backward compatibility)
  classifyTier: classify_tier,
  getTieredContent: get_tiered_content,
  filterAndLimitByTier: filter_and_limit_by_tier,
  formatTieredResponse: format_tiered_response,
  getTierStats: get_tier_stats,
  isIncluded: is_included,
  getTierThreshold: get_tier_threshold,

  // Content helpers
  getFullContent: get_full_content,
  getSummaryContent: get_summary_content,

  // FSRS integration
  getFsrsScheduler: get_fsrs_scheduler,

  // Configuration constants
  TIER_CONFIG,
  STATE_THRESHOLDS,
  ARCHIVED_DAYS_THRESHOLD,
  CONTENT_RULES,

  // Snake_case aliases for new functions
  get_effective_half_life,
  half_life_to_stability,
  get_memory_types_module,
  classify_state,
  calculate_retrievability,
  calculate_days_since,
};
