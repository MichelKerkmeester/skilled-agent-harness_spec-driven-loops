/**
 * Trigger Phrase Matcher
 *
 * Fast exact string matching for proactive memory surfacing.
 * Uses in-memory cache with TTL for <50ms hook execution.
 *
 * IMPORTANT: This does NOT use embeddings - pure string operations only.
 * Embedding generation takes 300-500ms, hook timeout is 50ms.
 *
 * @module lib/trigger-matcher
 * @version 10.0.0
 */

'use strict';

const vectorIndex = require('./vector-index');

// ───────────────────────────────────────────────────────────────
// CONFIGURATION
// ───────────────────────────────────────────────────────────────

const CONFIG = {
  CACHE_TTL_MS: 60000,      // Refresh cache every 60 seconds
  DEFAULT_LIMIT: 3,         // Max memories to return
  MIN_PHRASE_LENGTH: 3,     // Minimum phrase length to match
  MAX_PROMPT_LENGTH: 5000,  // Max prompt length to process
  WARN_THRESHOLD_MS: 30,    // Warn if matching takes longer
  LOG_EXECUTION_TIME: true  // Log all execution times (CHK069)
};

// ───────────────────────────────────────────────────────────────
// EXECUTION TIME LOGGING (CHK069)
// ───────────────────────────────────────────────────────────────

/**
 * Log hook execution time for monitoring and debugging
 * @param {string} operation - Name of the operation
 * @param {number} durationMs - Duration in milliseconds
 * @param {Object} details - Additional details to log
 */
function logExecutionTime(operation, durationMs, details = {}) {
  if (!CONFIG.LOG_EXECUTION_TIME) return;

  const logEntry = {
    timestamp: new Date().toISOString(),
    operation,
    durationMs,
    target: durationMs < 50 ? 'PASS' : 'SLOW',
    ...details
  };

  // Log to console for debugging
  if (durationMs >= CONFIG.WARN_THRESHOLD_MS) {
    console.warn(`[trigger-matcher] ${operation}: ${durationMs}ms (target <50ms)`, details);
  } else if (process.env.DEBUG_TRIGGER_MATCHER) {
    console.log(`[trigger-matcher] ${operation}: ${durationMs}ms`, details);
  }

  // Return the entry for test verification
  return logEntry;
}

// ───────────────────────────────────────────────────────────────
// TRIGGER CACHE
// ───────────────────────────────────────────────────────────────

/**
 * In-memory cache of trigger phrases for fast matching
 * Structure: Array<{phrase, memoryId, specFolder, filePath, importanceWeight, title}>
 */
let triggerCache = null;
let cacheTimestamp = 0;

/**
 * Load all trigger phrases from the index into memory.
 * Uses lazy loading with TTL-based cache refresh.
 *
 * @returns {Array} - Cached trigger entries
 */
function loadTriggerCache() {
  const now = Date.now();

  // Return cached data if still valid
  if (triggerCache && (now - cacheTimestamp) < CONFIG.CACHE_TTL_MS) {
    return triggerCache;
  }

  try {
    // Initialize database if needed
    vectorIndex.initializeDb();
    const db = vectorIndex.getDb();

    const rows = db.prepare(`
      SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight
      FROM memory_index
      WHERE trigger_phrases IS NOT NULL
        AND trigger_phrases != '[]'
        AND trigger_phrases != ''
        AND embedding_status = 'success'
    `).all();

    // Build flat cache for fast iteration
    triggerCache = [];
    for (const row of rows) {
      let phrases;
      try {
        phrases = JSON.parse(row.trigger_phrases);
      } catch {
        continue; // Skip invalid JSON
      }

      if (!Array.isArray(phrases)) continue;

      for (const phrase of phrases) {
        if (typeof phrase !== 'string' || phrase.length < CONFIG.MIN_PHRASE_LENGTH) {
          continue;
        }

        triggerCache.push({
          phrase: phrase.toLowerCase(), // Pre-lowercase for fast comparison
          memoryId: row.id,
          specFolder: row.spec_folder,
          filePath: row.file_path,
          title: row.title,
          importanceWeight: row.importance_weight || 0.5
        });
      }
    }

    cacheTimestamp = now;
    return triggerCache;
  } catch (error) {
    // Return empty array on error - don't block the hook
    console.warn(`[trigger-matcher] Cache load failed: ${error.message}`);
    return [];
  }
}

/**
 * Clear the trigger cache (useful for testing or after updates)
 */
function clearCache() {
  triggerCache = null;
  cacheTimestamp = 0;
}

/**
 * Get cache statistics
 * @returns {Object} - { size, timestamp, ageMs }
 */
function getCacheStats() {
  return {
    size: triggerCache ? triggerCache.length : 0,
    timestamp: cacheTimestamp,
    ageMs: cacheTimestamp ? Date.now() - cacheTimestamp : null
  };
}

// ───────────────────────────────────────────────────────────────
// STRING MATCHING
// ───────────────────────────────────────────────────────────────

/**
 * Escape special regex characters
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check if a phrase exists in text with word boundaries
 * @param {string} text - Text to search in (lowercase)
 * @param {string} phrase - Phrase to find (lowercase)
 * @returns {boolean} - True if phrase found at word boundary
 */
function matchPhraseWithBoundary(text, phrase) {
  // For single words, use word boundary
  // For multi-word phrases, check for whole phrase
  const escaped = escapeRegex(phrase);
  const regex = new RegExp(`\\b${escaped}\\b`, 'i');
  return regex.test(text);
}

// ───────────────────────────────────────────────────────────────
// MAIN MATCHING FUNCTION
// ───────────────────────────────────────────────────────────────

/**
 * Match user prompt against trigger phrases using exact string matching.
 * Uses case-insensitive substring matching with word boundary awareness.
 *
 * @param {string} userPrompt - The user's input prompt
 * @param {number} limit - Maximum memories to return (default: 3)
 * @returns {Array<Object>} - Matching memories sorted by relevance
 *
 * Performance target: <50ms (NFR-P03)
 */
function matchTriggerPhrases(userPrompt, limit = CONFIG.DEFAULT_LIMIT) {
  const startTime = Date.now();

  // Validation
  if (!userPrompt || typeof userPrompt !== 'string') {
    return [];
  }

  // Truncate very long prompts
  const prompt = userPrompt.length > CONFIG.MAX_PROMPT_LENGTH
    ? userPrompt.substring(0, CONFIG.MAX_PROMPT_LENGTH)
    : userPrompt;

  const promptLower = prompt.toLowerCase();

  // Load cache (fast if already loaded)
  const cache = loadTriggerCache();

  if (cache.length === 0) {
    return [];
  }

  // Match against all cached phrases
  // Group matches by memory ID
  const matchesByMemory = new Map();

  for (const entry of cache) {
    if (matchPhraseWithBoundary(promptLower, entry.phrase)) {
      const key = entry.memoryId;

      if (!matchesByMemory.has(key)) {
        matchesByMemory.set(key, {
          memoryId: entry.memoryId,
          specFolder: entry.specFolder,
          filePath: entry.filePath,
          title: entry.title,
          importanceWeight: entry.importanceWeight,
          matchedPhrases: []
        });
      }

      matchesByMemory.get(key).matchedPhrases.push(entry.phrase);
    }
  }

  // Sort by: 1) Number of matched phrases (desc), 2) Importance weight (desc)
  const results = Array.from(matchesByMemory.values())
    .sort((a, b) => {
      const phraseDiff = b.matchedPhrases.length - a.matchedPhrases.length;
      if (phraseDiff !== 0) return phraseDiff;
      return b.importanceWeight - a.importanceWeight;
    })
    .slice(0, limit);

  // Performance logging (CHK069)
  const elapsed = Date.now() - startTime;
  logExecutionTime('matchTriggerPhrases', elapsed, {
    promptLength: prompt.length,
    cacheSize: cache.length,
    matchCount: results.length,
    totalPhrases: results.reduce((sum, m) => sum + m.matchedPhrases.length, 0)
  });

  return results;
}

/**
 * Match trigger phrases with additional stats
 * @param {string} userPrompt - User input
 * @param {number} limit - Max results
 * @returns {Object} - { matches: Array, stats: Object }
 */
function matchTriggerPhrasesWithStats(userPrompt, limit = CONFIG.DEFAULT_LIMIT) {
  const startTime = Date.now();
  const cache = loadTriggerCache();
  const matches = matchTriggerPhrases(userPrompt, limit);
  const elapsed = Date.now() - startTime;

  return {
    matches,
    stats: {
      promptLength: (userPrompt || '').length,
      cacheSize: cache.length,
      matchCount: matches.length,
      totalMatchedPhrases: matches.reduce((sum, m) => sum + m.matchedPhrases.length, 0),
      matchTimeMs: elapsed
    }
  };
}

/**
 * Get all unique trigger phrases in the cache
 * @returns {string[]} - Array of unique phrases
 */
function getAllPhrases() {
  const cache = loadTriggerCache();
  return [...new Set(cache.map(e => e.phrase))];
}

/**
 * Get memories by trigger phrase
 * @param {string} phrase - Exact phrase to search for
 * @returns {Array} - Memories containing this phrase
 */
function getMemoriesByPhrase(phrase) {
  const cache = loadTriggerCache();
  const phraseLower = phrase.toLowerCase();

  const memoryIds = new Set();
  const results = [];

  for (const entry of cache) {
    if (entry.phrase === phraseLower && !memoryIds.has(entry.memoryId)) {
      memoryIds.add(entry.memoryId);
      results.push({
        memoryId: entry.memoryId,
        specFolder: entry.specFolder,
        filePath: entry.filePath,
        title: entry.title,
        importanceWeight: entry.importanceWeight
      });
    }
  }

  return results;
}

// ───────────────────────────────────────────────────────────────
// EXPORTS
// ───────────────────────────────────────────────────────────────

module.exports = {
  matchTriggerPhrases,
  matchTriggerPhrasesWithStats,
  loadTriggerCache,
  clearCache,
  getCacheStats,
  getAllPhrases,
  getMemoriesByPhrase,
  // Expose internals for testing
  escapeRegex,
  matchPhraseWithBoundary,
  // Configuration
  CONFIG,
  // CHK069: Execution time logging
  logExecutionTime
};
