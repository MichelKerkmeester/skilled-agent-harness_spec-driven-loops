// ───────────────────────────────────────────────────────────────
// trigger-matcher.js: Fast trigger phrase matching for memory retrieval
// ───────────────────────────────────────────────────────────────
'use strict';

const vector_index = require('./vector-index');
const { escape_regex: escapeRegex } = require('../../shared/utils');

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

const CONFIG = {
  CACHE_TTL_MS: 60000,      // Refresh cache every 60 seconds
  DEFAULT_LIMIT: 3,         // Max memories to return
  MIN_PHRASE_LENGTH: 3,     // Minimum phrase length to match
  MAX_PROMPT_LENGTH: 5000,  // Max prompt length to process
  WARN_THRESHOLD_MS: 30,    // Warn if matching takes longer
  LOG_EXECUTION_TIME: true, // Log all execution times (CHK069)
  MAX_REGEX_CACHE_SIZE: 100, // T015: Max regex objects to cache (LRU eviction)
};

/* ───────────────────────────────────────────────────────────────
   2. EXECUTION TIME LOGGING
   ─────────────────────────────────────────────────────────────── */

// Log hook execution time for monitoring and debugging
function log_execution_time(operation, duration_ms, details = {}) {
  if (!CONFIG.LOG_EXECUTION_TIME) {
    return;
  }

  const log_entry = {
    timestamp: new Date().toISOString(),
    operation,
    durationMs: duration_ms,
    target: duration_ms < 50 ? 'PASS' : 'SLOW',
    ...details,
  };

  // Log to console for debugging
  if (duration_ms >= CONFIG.WARN_THRESHOLD_MS) {
    console.warn(`[trigger-matcher] ${operation}: ${duration_ms}ms (target <50ms)`, details);
  } else if (process.env.DEBUG_TRIGGER_MATCHER) {
    console.log(`[trigger-matcher] ${operation}: ${duration_ms}ms`, details);
  }

  // Return the entry for test verification
  return log_entry;
}

/* ───────────────────────────────────────────────────────────────
   3. TRIGGER CACHE
   ─────────────────────────────────────────────────────────────── */

// In-memory cache of trigger phrases for fast matching
// Structure: Array<{phrase, memoryId, specFolder, filePath, importanceWeight, title}>
let trigger_cache = null;
let cache_timestamp = 0;

// T015: LRU cache for regex objects to prevent memory leaks
// Simple LRU implementation using Map (insertion order preserved)
const regex_lru_cache = new Map();

/**
 * Get or create a cached regex for a phrase (T015: LRU with size limit)
 * @param {string} phrase - The phrase to create regex for
 * @returns {RegExp} Pre-compiled regex with word boundaries
 */
function get_cached_regex(phrase) {
  // Check if already in cache
  if (regex_lru_cache.has(phrase)) {
    // Move to end (most recently used) by deleting and re-adding
    const regex = regex_lru_cache.get(phrase);
    regex_lru_cache.delete(phrase);
    regex_lru_cache.set(phrase, regex);
    return regex;
  }

  // Create new regex
  const regex = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'iu');

  // Evict oldest entry if at capacity (T015: LRU eviction)
  if (regex_lru_cache.size >= CONFIG.MAX_REGEX_CACHE_SIZE) {
    // Map.keys().next().value gives the oldest (first inserted) key
    const oldest_key = regex_lru_cache.keys().next().value;
    regex_lru_cache.delete(oldest_key);
  }

  // Add to cache
  regex_lru_cache.set(phrase, regex);
  return regex;
}

// Load all trigger phrases from the index into memory
// Uses lazy loading with TTL-based cache refresh
function load_trigger_cache() {
  const now = Date.now();

  // Return cached data if still valid
  if (trigger_cache && (now - cache_timestamp) < CONFIG.CACHE_TTL_MS) {
    return trigger_cache;
  }

  try {
    // Initialize database if needed
    vector_index.initializeDb();
    const db = vector_index.getDb();

    // Null check for database
    if (!db) {
      console.warn('[trigger-matcher] Database not initialized');
      return [];
    }

    const rows = db.prepare(`
      SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight
      FROM memory_index
      WHERE trigger_phrases IS NOT NULL
        AND trigger_phrases != '[]'
        AND trigger_phrases != ''
        AND embedding_status = 'success'
    `).all();

    // Build flat cache for fast iteration
    trigger_cache = [];
    for (const row of rows) {
      let phrases;
      try {
        phrases = JSON.parse(row.trigger_phrases);
      } catch {
        continue; // Skip invalid JSON
      }

      if (!Array.isArray(phrases)) {
        continue;
      }

      for (const phrase of phrases) {
        if (typeof phrase !== 'string' || phrase.length < CONFIG.MIN_PHRASE_LENGTH) {
          continue;
        }

        const phrase_lower = normalize_unicode(phrase, false);
        trigger_cache.push({
          phrase: phrase_lower, // Pre-normalized for fast comparison
          regex: get_cached_regex(phrase_lower), // T015: Use LRU-cached regex
          memoryId: row.id,
          specFolder: row.spec_folder,
          filePath: row.file_path,
          title: row.title,
          importanceWeight: row.importance_weight || 0.5,
        });
      }
    }

    cache_timestamp = now;
    return trigger_cache;
  } catch (error) {
    // Return empty array on error - don't block the hook
    console.warn(`[trigger-matcher] Cache load failed: ${error.message}`);
    return [];
  }
}

// Clear the trigger cache (useful for testing or after updates)
function clear_cache() {
  trigger_cache = null;
  cache_timestamp = 0;
  regex_lru_cache.clear(); // T015: Also clear the regex LRU cache
}

// Get cache statistics
function get_cache_stats() {
  return {
    size: trigger_cache ? trigger_cache.length : 0,
    timestamp: cache_timestamp,
    ageMs: cache_timestamp ? Date.now() - cache_timestamp : null,
    regexCacheSize: regex_lru_cache.size, // T015: Include regex cache size
    maxRegexCacheSize: CONFIG.MAX_REGEX_CACHE_SIZE,
  };
}

/* ───────────────────────────────────────────────────────────────
   4. STRING MATCHING
   ─────────────────────────────────────────────────────────────── */

// Normalize string for Unicode-safe comparison
// - NFC normalization (canonical composition)
// - Lowercase
// - Optional: remove diacritics for accent-insensitive search
function normalize_unicode(str, strip_accents = false) {
  if (!str) {
    return '';
  }
  
  // Step 1: NFC normalization (compose characters)
  let normalized = str.normalize('NFC');
  
  // Step 2: Optional accent stripping (NFKD + remove combining marks)
  if (strip_accents) {
    normalized = normalized
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove combining diacritical marks
  }
  
  // Step 3: Case-fold (locale-independent lowercase)
  normalized = normalized.toLowerCase();
  
  return normalized;
}

// Check if a phrase exists in text with word boundaries
function match_phrase_with_boundary(text, phrase, precompiled_regex = null) {
  // Use pre-compiled regex if available (from cache), otherwise compile on-the-fly
  if (precompiled_regex) {
    return precompiled_regex.test(text);
  }
  // Fallback for direct calls without pre-compiled regex
  const escaped = escapeRegex(phrase);
  const regex = new RegExp(`\\b${escaped}\\b`, 'iu');
  return regex.test(text);
}

/* ───────────────────────────────────────────────────────────────
   5. MAIN MATCHING FUNCTION
   ─────────────────────────────────────────────────────────────── */

// Match user prompt against trigger phrases using exact string matching
// Uses case-insensitive substring matching with word boundary awareness
// Performance target: <50ms (NFR-P03)
function match_trigger_phrases(user_prompt, limit = CONFIG.DEFAULT_LIMIT) {
  const start_time = Date.now();

  // Validation
  if (!user_prompt || typeof user_prompt !== 'string') {
    return [];
  }

  // Truncate very long prompts
  const prompt = user_prompt.length > CONFIG.MAX_PROMPT_LENGTH
    ? user_prompt.substring(0, CONFIG.MAX_PROMPT_LENGTH)
    : user_prompt;

  const prompt_normalized = normalize_unicode(prompt, false);

  // Load cache (fast if already loaded)
  const cache = load_trigger_cache();

  if (cache.length === 0) {
    return [];
  }

  // Match against all cached phrases
  // Group matches by memory ID
  const matches_by_memory = new Map();

  for (const entry of cache) {
    if (match_phrase_with_boundary(prompt_normalized, entry.phrase, entry.regex)) {
      const key = entry.memoryId;

      if (!matches_by_memory.has(key)) {
        matches_by_memory.set(key, {
          memoryId: entry.memoryId,
          specFolder: entry.specFolder,
          filePath: entry.filePath,
          title: entry.title,
          importanceWeight: entry.importanceWeight,
          matchedPhrases: [],
        });
      }

      matches_by_memory.get(key).matchedPhrases.push(entry.phrase);
    }
  }

  // Sort by: 1) Number of matched phrases (desc), 2) Importance weight (desc)
  const results = Array.from(matches_by_memory.values())
    .sort((a, b) => {
      const phrase_diff = b.matchedPhrases.length - a.matchedPhrases.length;
      if (phrase_diff !== 0) {
        return phrase_diff;
      }
      return b.importanceWeight - a.importanceWeight;
    })
    .slice(0, limit);

  // Performance logging (CHK069)
  const elapsed = Date.now() - start_time;
  log_execution_time('match_trigger_phrases', elapsed, {
    promptLength: prompt.length,
    cacheSize: cache.length,
    matchCount: results.length,
    totalPhrases: results.reduce((sum, m) => sum + m.matchedPhrases.length, 0),
  });

  return results;
}

// Match trigger phrases with additional stats
function match_trigger_phrases_with_stats(user_prompt, limit = CONFIG.DEFAULT_LIMIT) {
  const start_time = Date.now();
  const cache = load_trigger_cache();
  const matches = match_trigger_phrases(user_prompt, limit);
  const elapsed = Date.now() - start_time;

  return {
    matches,
    stats: {
      promptLength: (user_prompt || '').length,
      cacheSize: cache.length,
      matchCount: matches.length,
      totalMatchedPhrases: matches.reduce((sum, m) => sum + m.matchedPhrases.length, 0),
      matchTimeMs: elapsed,
    },
  };
}

// Get all unique trigger phrases in the cache
function get_all_phrases() {
  const cache = load_trigger_cache();
  return [...new Set(cache.map(e => e.phrase))];
}

// Get memories by trigger phrase
function get_memories_by_phrase(phrase) {
  const cache = load_trigger_cache();
  const phrase_lower = phrase.toLowerCase();

  const memory_ids = new Set();
  const results = [];

  for (const entry of cache) {
    if (entry.phrase === phrase_lower && !memory_ids.has(entry.memoryId)) {
      memory_ids.add(entry.memoryId);
      results.push({
        memoryId: entry.memoryId,
        specFolder: entry.specFolder,
        filePath: entry.filePath,
        title: entry.title,
        importanceWeight: entry.importanceWeight,
      });
    }
  }

  return results;
}

// Refresh trigger cache (forces reload on next access)
function refresh_trigger_cache() {
  clear_cache();
  return load_trigger_cache();
}

/* ───────────────────────────────────────────────────────────────
   6. MODULE EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  matchTriggerPhrases: match_trigger_phrases,
  matchTriggerPhrasesWithStats: match_trigger_phrases_with_stats,
  loadTriggerCache: load_trigger_cache,
  clearCache: clear_cache,
  getCacheStats: get_cache_stats,
  getAllPhrases: get_all_phrases,
  getMemoriesByPhrase: get_memories_by_phrase,
  refreshTriggerCache: refresh_trigger_cache,
  // Expose internals for testing (escapeRegex now from shared/utils)
  escapeRegex,
  normalizeUnicode: normalize_unicode,
  matchPhraseWithBoundary: match_phrase_with_boundary,
  // Configuration
  CONFIG,
  // CHK069: Execution time logging
  logExecutionTime: log_execution_time,
};
