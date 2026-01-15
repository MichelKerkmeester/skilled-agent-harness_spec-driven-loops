/**
 * @fileoverview SK-004 Memory Surface Hook - Auto-surfaces relevant memories
 * @module mcp_server/hooks/memory-surface
 *
 * Automatically surfaces constitutional and triggered memories for memory-aware
 * tools. Constitutional memories are cached for 1 minute to reduce database queries.
 *
 * @version 1.0.0
 */
'use strict';

const path = require('path');

// Lib modules (resolved relative to parent mcp_server directory)
const LIB_DIR = path.join(__dirname, '../lib');
const vectorIndex = require(path.join(LIB_DIR, 'vector-index.js'));
const triggerMatcher = require(path.join(LIB_DIR, 'trigger-matcher.js'));

/* ───────────────────────────────────────────────────────────────
   SK-004: MEMORY SURFACE HOOK CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

/**
 * Set of tools that trigger automatic memory surfacing
 * @type {Set<string>}
 */
const MEMORY_AWARE_TOOLS = new Set([
  'memory_search',
  'memory_match_triggers',
  'memory_list',
  'memory_save',
  'memory_index_scan'
]);

// Constitutional memory cache
let constitutional_cache = null;
let constitutional_cache_time = 0;
const CONSTITUTIONAL_CACHE_TTL = 60000; // 1 minute

/* ───────────────────────────────────────────────────────────────
   SK-004: CONTEXT EXTRACTION
   ─────────────────────────────────────────────────────────────── */

/**
 * Extract context hint from tool arguments for memory surfacing
 * @param {Object} args - Tool call arguments
 * @returns {string|null} Context hint or null
 */
function extract_context_hint(args) {
  if (!args || typeof args !== 'object') return null;

  const context_fields = ['query', 'prompt', 'specFolder', 'filePath'];
  for (const field of context_fields) {
    if (args[field] && typeof args[field] === 'string' && args[field].length >= 3) {
      return args[field];
    }
  }

  // Join concepts array if present
  if (args.concepts && Array.isArray(args.concepts) && args.concepts.length > 0) {
    return args.concepts.join(' ');
  }

  return null;
}

/* ───────────────────────────────────────────────────────────────
   SK-004: CONSTITUTIONAL MEMORIES
   ─────────────────────────────────────────────────────────────── */

/**
 * Get constitutional memories with caching
 * Constitutional memories are always surfaced regardless of query context.
 * Results are cached for CONSTITUTIONAL_CACHE_TTL milliseconds.
 * @returns {Promise<Array>} Constitutional memories
 */
async function get_constitutional_memories() {
  const now = Date.now();

  if (constitutional_cache && (now - constitutional_cache_time) < CONSTITUTIONAL_CACHE_TTL) {
    return constitutional_cache;
  }

  try {
    const db = vectorIndex.getDb();
    if (!db) return [];

    const rows = db.prepare(`
      SELECT id, spec_folder, file_path, title, trigger_phrases, importance_tier
      FROM memory_index
      WHERE importance_tier = 'constitutional'
      AND embedding_status = 'success'
      ORDER BY created_at DESC
      LIMIT 10
    `).all();

    constitutional_cache = rows.map(r => ({
      id: r.id,
      specFolder: r.spec_folder,
      filePath: r.file_path,
      title: r.title,
      importanceTier: r.importance_tier
    }));
    constitutional_cache_time = now;

    return constitutional_cache;
  } catch (err) {
    console.warn('[SK-004] Failed to fetch constitutional memories:', err.message);
    return [];
  }
}

/**
 * Clear the constitutional memory cache
 * Useful when memories are updated or deleted
 */
function clear_constitutional_cache() {
  constitutional_cache = null;
  constitutional_cache_time = 0;
}

/* ───────────────────────────────────────────────────────────────
   SK-004: AUTO-SURFACE MEMORIES
   ─────────────────────────────────────────────────────────────── */

/**
 * Auto-surface memories based on context hint
 * SK-004: Memory Surface Hook
 *
 * Surfaces two types of memories:
 * 1. Constitutional memories - always surfaced (cached)
 * 2. Triggered memories - matched via fast phrase matching
 *
 * @param {string} context_hint - Context from tool arguments
 * @returns {Promise<Object|null>} Surfaced context or null
 */
async function auto_surface_memories(context_hint) {
  const start_time = Date.now();

  try {
    // Get constitutional memories (always surface)
    const constitutional = await get_constitutional_memories();

    // Get triggered memories via fast phrase matching
    const triggered = triggerMatcher.matchTriggerPhrases(context_hint, 5);

    const latency_ms = Date.now() - start_time;

    // Only return if we have something to surface
    if (constitutional.length === 0 && triggered.length === 0) {
      return null;
    }

    return {
      constitutional: constitutional,
      triggered: triggered.map(t => ({
        memory_id: t.memoryId,
        spec_folder: t.specFolder,
        title: t.title,
        matched_phrases: t.matchedPhrases,
      })),
      surfaced_at: new Date().toISOString(),
      latency_ms: latency_ms,
    };
  } catch (err) {
    console.warn('[SK-004] Auto-surface failed:', err.message);
    return null;
  }
}

/**
 * Check if a tool is memory-aware (should trigger memory surfacing)
 * @param {string} toolName - Name of the tool
 * @returns {boolean} True if the tool is memory-aware
 */
function is_memory_aware_tool(toolName) {
  return MEMORY_AWARE_TOOLS.has(toolName);
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  // Constants
  MEMORY_AWARE_TOOLS,
  CONSTITUTIONAL_CACHE_TTL,

  // snake_case exports
  extract_context_hint,
  get_constitutional_memories,
  clear_constitutional_cache,
  auto_surface_memories,
  is_memory_aware_tool,

  // Backward compatibility aliases (camelCase)
  extractContextHint: extract_context_hint,
  getConstitutionalMemories: get_constitutional_memories,
  clearConstitutionalCache: clear_constitutional_cache,
  autoSurfaceMemories: auto_surface_memories,
  isMemoryAwareTool: is_memory_aware_tool
};
