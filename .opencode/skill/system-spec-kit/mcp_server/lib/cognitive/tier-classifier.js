// ───────────────────────────────────────────────────────────────
// COGNITIVE: TIER CLASSIFIER (5-STATE MODEL)
// ───────────────────────────────────────────────────────────────
'use strict';

const fs = require('fs');
const path = require('path');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

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

// COGNITIVE-081: 5-State Model Thresholds based on retrievability R = e^(-t/S)
const STATE_THRESHOLDS = {
  HOT: 0.80,
  WARM: 0.25,
  COLD: 0.05,
  DORMANT: 0.02,
};

const ARCHIVED_DAYS_THRESHOLD = 90;

// COGNITIVE-081: Tier config with env var overrides for tuning
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
   2. FSRS INTEGRATION (LAZY LOADED)
──────────────────────────────────────────────────────────────── */

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

/** Calculate retrievability score using FSRS or fallback */
function calculate_retrievability(memory) {
  if (!memory || typeof memory !== 'object') {
    return 0;
  }

  // Check pre-computed retrievability FIRST (highest priority)
  if (typeof memory.retrievability === 'number' && !isNaN(memory.retrievability)) {
    return Math.max(0, Math.min(1, memory.retrievability));
  }

  // FSRS calculation (second priority) - only if we have timestamp data
  const lastReview = memory.last_review || memory.lastReview || memory.updated_at || memory.created_at;
  if (lastReview) {
    const scheduler = get_fsrs_scheduler();
    if (scheduler && typeof scheduler.calculate_retrievability === 'function') {
      try {
        const elapsedDays = scheduler.calculate_elapsed_days(lastReview);
        return scheduler.calculate_retrievability(memory.stability || 1.0, elapsedDays);
      } catch (error) {
        console.warn(`[tier-classifier] FSRS calculation failed: ${error.message}`);
      }
    }
  }

  // COGNITIVE-081: Fallback using stability and elapsed time
  if (typeof memory.stability === 'number' && memory.stability > 0) {
    const lastAccess = memory.lastAccess || memory.last_access || memory.lastReview || memory.created_at;
    if (lastAccess) {
      const elapsedDays = calculate_days_since(lastAccess);
      return Math.exp(-elapsedDays / memory.stability);
    }
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
──────────────────────────────────────────────────────────────── */

/** Classify memory into one of 5 states: HOT, WARM, COLD, DORMANT, ARCHIVED */
function classify_state(memory) {
  if (!memory || typeof memory !== 'object') {
    return 'DORMANT';
  }

  // COGNITIVE-081: Check ARCHIVED first (90+ days inactive)
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
──────────────────────────────────────────────────────────────── */

// COGNITIVE-081: Content delivery rules - HOT=full, WARM=summary, others=null
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

  // COGNITIVE-081: Find word boundary for clean truncation
  let truncated = fullContent.substring(0, TIER_CONFIG.summaryFallbackLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > TIER_CONFIG.summaryFallbackLength * 0.7) {
    truncated = truncated.substring(0, lastSpace);
  }

  return truncated + '...';
}

/* ─────────────────────────────────────────────────────────────
   5. FILTERING AND LIMITING (5-STATE)
──────────────────────────────────────────────────────────────── */

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
──────────────────────────────────────────────────────────────── */

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
──────────────────────────────────────────────────────────────── */

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
──────────────────────────────────────────────────────────────── */

module.exports = {
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
  classifyTier: classify_tier,
  getTieredContent: get_tiered_content,
  filterAndLimitByTier: filter_and_limit_by_tier,
  formatTieredResponse: format_tiered_response,
  getTierStats: get_tier_stats,
  isIncluded: is_included,
  getTierThreshold: get_tier_threshold,
  getFullContent: get_full_content,
  getSummaryContent: get_summary_content,
  getFsrsScheduler: get_fsrs_scheduler,
  TIER_CONFIG,
  STATE_THRESHOLDS,
  ARCHIVED_DAYS_THRESHOLD,
  CONTENT_RULES,
};
