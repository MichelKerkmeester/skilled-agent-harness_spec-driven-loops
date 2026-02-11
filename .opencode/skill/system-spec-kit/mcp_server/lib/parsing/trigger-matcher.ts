// ---------------------------------------------------------------
// MODULE: Trigger Matcher
// ---------------------------------------------------------------

import * as vectorIndex from '../search/vector-index';
import { escapeRegex } from '../utils/path-security';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

/** Trigger cache entry for a single phrase-to-memory mapping */
export interface TriggerCacheEntry {
  phrase: string;
  regex: RegExp;
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  importanceWeight: number;
}

/** Match result grouped by memory */
export interface TriggerMatch {
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  importanceWeight: number;
  matchedPhrases: string[];
  [key: string]: unknown;
}

/** Match result with additional statistics */
export interface TriggerMatchWithStats {
  matches: TriggerMatch[];
  stats: TriggerMatchStats;
}

/** Statistics about a trigger matching operation */
export interface TriggerMatchStats {
  promptLength: number;
  cacheSize: number;
  matchCount: number;
  totalMatchedPhrases: number;
  matchTimeMs: number;
}

/** Cache statistics */
export interface CacheStats {
  size: number;
  timestamp: number;
  ageMs: number | null;
  regexCacheSize: number;
  maxRegexCacheSize: number;
}

/** Memory result from getMemoriesByPhrase */
export interface MemoryByPhrase {
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  importanceWeight: number;
}

/** Execution time log entry */
export interface ExecutionLogEntry {
  timestamp: string;
  operation: string;
  durationMs: number;
  target: string;
  [key: string]: unknown;
}

/** Trigger matcher configuration */
export interface TriggerMatcherConfig {
  CACHE_TTL_MS: number;
  DEFAULT_LIMIT: number;
  MIN_PHRASE_LENGTH: number;
  MAX_PROMPT_LENGTH: number;
  WARN_THRESHOLD_MS: number;
  LOG_EXECUTION_TIME: boolean;
  MAX_REGEX_CACHE_SIZE: number;
}

/* ---------------------------------------------------------------
   2. CONFIGURATION
   --------------------------------------------------------------- */

export const CONFIG: TriggerMatcherConfig = {
  CACHE_TTL_MS: 60000,
  DEFAULT_LIMIT: 3,
  MIN_PHRASE_LENGTH: 3,
  MAX_PROMPT_LENGTH: 5000,
  WARN_THRESHOLD_MS: 30,
  LOG_EXECUTION_TIME: true,
  MAX_REGEX_CACHE_SIZE: 100,
};

/* ---------------------------------------------------------------
   3. EXECUTION TIME LOGGING
   --------------------------------------------------------------- */

/** Log hook execution time for monitoring and debugging */
export function logExecutionTime(operation: string, durationMs: number, details: Record<string, unknown> = {}): ExecutionLogEntry | undefined {
  if (!CONFIG.LOG_EXECUTION_TIME) {
    return;
  }

  const logEntry: ExecutionLogEntry = {
    timestamp: new Date().toISOString(),
    operation,
    durationMs: durationMs,
    target: durationMs < 50 ? 'PASS' : 'SLOW',
    ...details,
  };

  // Log to console for debugging
  if (durationMs >= CONFIG.WARN_THRESHOLD_MS) {
    console.warn(`[trigger-matcher] ${operation}: ${durationMs}ms (target <50ms)`, details);
  } else if (process.env.DEBUG_TRIGGER_MATCHER) {
    console.error(`[trigger-matcher] ${operation}: ${durationMs}ms`, details);
  }

  // Return the entry for test verification
  return logEntry;
}

/* ---------------------------------------------------------------
   4. TRIGGER CACHE
   --------------------------------------------------------------- */

// In-memory cache of trigger phrases for fast matching
let triggerCache: TriggerCacheEntry[] | null = null;
let cacheTimestamp: number = 0;

// T015: LRU cache for regex objects to prevent memory leaks
const regexLruCache: Map<string, RegExp> = new Map();

export function getCachedRegex(phrase: string): RegExp {
  // Check if already in cache
  if (regexLruCache.has(phrase)) {
    // Move to end (most recently used) by deleting and re-adding
    const regex = regexLruCache.get(phrase)!;
    regexLruCache.delete(phrase);
    regexLruCache.set(phrase, regex);
    return regex;
  }

  // BUG-026 FIX: Unicode-aware word boundary
  const escaped = escapeRegex(phrase);
  const regex = new RegExp(
    `(?:^|[^a-zA-Z0-9\u00C0-\u00FF])${escaped}(?:[^a-zA-Z0-9\u00C0-\u00FF]|$)`,
    'iu'
  );

  // Evict oldest entry if at capacity (T015: LRU eviction)
  if (regexLruCache.size >= CONFIG.MAX_REGEX_CACHE_SIZE) {
    const oldestKey = regexLruCache.keys().next().value;
    if (oldestKey !== undefined) {
      regexLruCache.delete(oldestKey);
    }
  }

  // Add to cache
  regexLruCache.set(phrase, regex);
  return regex;
}

/** Load all trigger phrases from the index into memory */
export function loadTriggerCache(): TriggerCacheEntry[] {
  const now = Date.now();

  // Return cached data if still valid
  if (triggerCache && (now - cacheTimestamp) < CONFIG.CACHE_TTL_MS) {
    return triggerCache;
  }

  try {
    // Initialize database if needed
    vectorIndex.initializeDb();
    const db = vectorIndex.getDb();

    // Null check for database
    if (!db) {
      console.warn('[trigger-matcher] Database not initialized. Server may still be starting up.');
      return [];
    }

    const rows = db.prepare(`
      SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight
      FROM memory_index
      WHERE trigger_phrases IS NOT NULL
        AND trigger_phrases != '[]'
        AND trigger_phrases != ''
        AND embedding_status = 'success'
    `).all() as Array<{
      id: number;
      spec_folder: string;
      file_path: string;
      title: string | null;
      trigger_phrases: string;
      importance_weight: number | null;
    }>;

    // Build flat cache for fast iteration
    triggerCache = [];
    for (const row of rows) {
      let phrases: unknown;
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

        const phraseLower = normalizeUnicode(phrase, false);
        triggerCache.push({
          phrase: phraseLower,
          regex: getCachedRegex(phraseLower),
          memoryId: row.id,
          specFolder: row.spec_folder,
          filePath: row.file_path,
          title: row.title,
          importanceWeight: row.importance_weight || 0.5,
        });
      }
    }

    cacheTimestamp = now;
    return triggerCache;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[trigger-matcher] Cache load failed: ${message}`);
    return [];
  }
}

/** Clear the trigger cache (useful for testing or after updates) */
export function clearCache(): void {
  triggerCache = null;
  cacheTimestamp = 0;
  regexLruCache.clear();
}

/** Get cache statistics */
export function getCacheStats(): CacheStats {
  return {
    size: triggerCache ? triggerCache.length : 0,
    timestamp: cacheTimestamp,
    ageMs: cacheTimestamp ? Date.now() - cacheTimestamp : null,
    regexCacheSize: regexLruCache.size,
    maxRegexCacheSize: CONFIG.MAX_REGEX_CACHE_SIZE,
  };
}

/* ---------------------------------------------------------------
   5. STRING MATCHING
   --------------------------------------------------------------- */

/** Normalize string for Unicode-safe comparison */
export function normalizeUnicode(str: string, stripAccents: boolean = false): string {
  if (!str) {
    return '';
  }

  // Step 1: NFC normalization (compose characters)
  let normalized = str.normalize('NFC');

  // Step 2: Optional accent stripping (NFKD + remove combining marks)
  if (stripAccents) {
    normalized = normalized
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  // Step 3: Case-fold (locale-independent lowercase)
  normalized = normalized.toLowerCase();

  return normalized;
}

/** Check if a phrase exists in text with word boundaries */
export function matchPhraseWithBoundary(text: string, phrase: string, precompiledRegex: RegExp | null = null): boolean {
  if (precompiledRegex) {
    return precompiledRegex.test(text);
  }
  // Fallback for direct calls without pre-compiled regex
  const escaped = escapeRegex(phrase);
  const regex = new RegExp(
    `(?:^|[^a-zA-Z0-9\u00C0-\u00FF])${escaped}(?:[^a-zA-Z0-9\u00C0-\u00FF]|$)`,
    'iu'
  );
  return regex.test(text);
}

/* ---------------------------------------------------------------
   6. MAIN MATCHING FUNCTION
   --------------------------------------------------------------- */

/** Match user prompt against trigger phrases using exact string matching */
export function matchTriggerPhrases(userPrompt: string, limit: number = CONFIG.DEFAULT_LIMIT): TriggerMatch[] {
  const startTime = Date.now();

  // Validation
  if (!userPrompt || typeof userPrompt !== 'string') {
    return [];
  }

  // Truncate very long prompts
  const prompt = userPrompt.length > CONFIG.MAX_PROMPT_LENGTH
    ? userPrompt.substring(0, CONFIG.MAX_PROMPT_LENGTH)
    : userPrompt;

  const promptNormalized = normalizeUnicode(prompt, false);

  // Load cache (fast if already loaded)
  const cache = loadTriggerCache();

  if (cache.length === 0) {
    return [];
  }

  // Match against all cached phrases
  const matchesByMemory = new Map<number, TriggerMatch>();

  for (const entry of cache) {
    if (matchPhraseWithBoundary(promptNormalized, entry.phrase, entry.regex)) {
      const key = entry.memoryId;

      if (!matchesByMemory.has(key)) {
        matchesByMemory.set(key, {
          memoryId: entry.memoryId,
          specFolder: entry.specFolder,
          filePath: entry.filePath,
          title: entry.title,
          importanceWeight: entry.importanceWeight,
          matchedPhrases: [],
        });
      }

      matchesByMemory.get(key)!.matchedPhrases.push(entry.phrase);
    }
  }

  // Sort by: 1) Number of matched phrases (desc), 2) Importance weight (desc)
  const results = Array.from(matchesByMemory.values())
    .sort((a, b) => {
      const phraseDiff = b.matchedPhrases.length - a.matchedPhrases.length;
      if (phraseDiff !== 0) {
        return phraseDiff;
      }
      return b.importanceWeight - a.importanceWeight;
    })
    .slice(0, limit);

  // Performance logging (CHK069)
  const elapsed = Date.now() - startTime;
  logExecutionTime('match_trigger_phrases', elapsed, {
    promptLength: prompt.length,
    cacheSize: cache.length,
    matchCount: results.length,
    totalPhrases: results.reduce((sum, m) => sum + m.matchedPhrases.length, 0),
  });

  return results;
}

/** Match trigger phrases with additional stats */
export function matchTriggerPhrasesWithStats(userPrompt: string, limit: number = CONFIG.DEFAULT_LIMIT): TriggerMatchWithStats {
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
      matchTimeMs: elapsed,
    },
  };
}

/** Get all unique trigger phrases in the cache */
export function getAllPhrases(): string[] {
  const cache = loadTriggerCache();
  return [...new Set(cache.map(e => e.phrase))];
}

/** Get memories by trigger phrase */
export function getMemoriesByPhrase(phrase: string): MemoryByPhrase[] {
  const cache = loadTriggerCache();
  const phraseLower = phrase.toLowerCase();

  const memoryIds = new Set<number>();
  const results: MemoryByPhrase[] = [];

  for (const entry of cache) {
    if (entry.phrase === phraseLower && !memoryIds.has(entry.memoryId)) {
      memoryIds.add(entry.memoryId);
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

/** Refresh trigger cache (forces reload on next access) */
export function refreshTriggerCache(): TriggerCacheEntry[] {
  clearCache();
  return loadTriggerCache();
}

/* ---------------------------------------------------------------
   7. MODULE EXPORTS (CommonJS compatibility)
   --------------------------------------------------------------- */

module.exports = {
  matchTriggerPhrases,
  matchTriggerPhrasesWithStats,
  loadTriggerCache,
  clearCache,
  getCacheStats,
  getAllPhrases,
  getMemoriesByPhrase,
  refreshTriggerCache,
  // Expose internals for testing
  escapeRegex,
  normalizeUnicode,
  matchPhraseWithBoundary,
  // Configuration
  CONFIG,
  // CHK069: Execution time logging
  logExecutionTime,
};
