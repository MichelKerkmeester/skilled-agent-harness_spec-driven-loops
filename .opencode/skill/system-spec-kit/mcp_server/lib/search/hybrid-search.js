// ───────────────────────────────────────────────────────────────
// SEARCH: HYBRID SEARCH
// ───────────────────────────────────────────────────────────────
'use strict';

const { fuse_results } = require('./rrf-fusion');

/* ─────────────────────────────────────────────────────────────
   1. MODULE STATE
──────────────────────────────────────────────────────────────── */

// Database reference
let db = null;
let vector_search_fn = null;

/* ─────────────────────────────────────────────────────────────
   2. INITIALIZATION
──────────────────────────────────────────────────────────────── */

// Initialize hybrid search with database and vector search function
function init(database, vector_search) {
  if (!database) {
    throw new Error('[hybrid-search] init() requires a valid database instance');
  }
  if (typeof vector_search !== 'function') {
    throw new Error('[hybrid-search] init() requires vectorSearch to be a function');
  }
  db = database;
  vector_search_fn = vector_search;
}

/* ─────────────────────────────────────────────────────────────
   3. FTS5 SEARCH
──────────────────────────────────────────────────────────────── */

// Check if FTS5 table exists
function is_fts_available() {
  if (!db) return false;
  try {
    db.prepare('SELECT 1 FROM memory_fts LIMIT 1').get();
    return true;
  } catch {
    return false;
  }
}

// FTS5-only search
function fts_search(query_text, options = {}) {
  const { limit = 10, spec_folder = null } = options;

  // Escape FTS5 special characters and operators
  // P1-CODE-002: Added escaping for FTS5 boolean operators (AND, OR, NOT) and prefix operators (+, -)
  const escaped_query = query_text
    .replace(/"/g, '""')
    .replace(/[*:()^{}[\]]/g, ' ')
    .replace(/\b(AND|OR|NOT)\b/gi, ' ')
    .replace(/[+-]/g, ' ')
    .trim();

  if (!escaped_query) return [];

  const sql = `
    SELECT m.*,
           -rank as fts_score
    FROM memory_fts f
    JOIN memory_index m ON f.rowid = m.id
    WHERE memory_fts MATCH ?
    ${spec_folder ? 'AND m.spec_folder = ?' : ''}
    AND m.importance_tier != 'deprecated'
    ORDER BY rank
    LIMIT ?
  `;

  const params = spec_folder
    ? [escaped_query, spec_folder, limit]
    : [escaped_query, limit];

  try {
    return db.prepare(sql).all(...params);
  } catch (err) {
    console.warn('[hybrid-search] FTS5 query failed:', err.message);
    return [];
  }
}

/* ─────────────────────────────────────────────────────────────
   4. HYBRID SEARCH
──────────────────────────────────────────────────────────────── */

// Hybrid search combining vector and FTS5
function hybrid_search(query_embedding, query_text, options = {}) {
  if (!db) {
    console.warn('[hybrid-search] Database not initialized. Call init() first.');
    return [];
  }

  const { limit = 10, spec_folder = null, use_decay = true } = options;

  // Get vector results (2x limit for fusion headroom)
  const vector_results = vector_search_fn ?
    vector_search_fn(query_embedding, { limit: limit * 2, spec_folder, use_decay }) : [];

  // Get FTS5 results if available
  const fts_results = is_fts_available() ?
    fts_search(query_text, { limit: limit * 2, spec_folder }) : [];

  // If only one source has results, return those with RRF metadata for consistent shape
  if (vector_results.length === 0) {
    return fts_results.slice(0, limit).map((r, i) => ({
      ...r,
      rrf_score: 1 / (60 + i + 1), // RRF score based on rank position
      in_vector: false,
      in_fts: true,
      search_method: 'fts_only',
    }));
  }
  if (fts_results.length === 0) {
    return vector_results.slice(0, limit).map((r, i) => ({
      ...r,
      rrf_score: 1 / (60 + i + 1), // RRF score based on rank position
      in_vector: true,
      in_fts: false,
      search_method: 'vector_only',
    }));
  }

  // Fuse results using RRF
  return fuse_results(vector_results, fts_results, { limit });
}

// Search with automatic fallback
// Uses hybrid if both available, otherwise falls back to whichever is available
function search_with_fallback(query_embedding, query_text, options = {}) {
  const has_vector = query_embedding && vector_search_fn;
  const has_fts = is_fts_available();

  if (has_vector && has_fts) {
    return hybrid_search(query_embedding, query_text, options);
  } else if (has_vector) {
    return vector_search_fn(query_embedding, options);
  } else if (has_fts) {
    return fts_search(query_text, options);
  }

  console.warn('[hybrid-search] No search method available');
  return [];
}

/* ─────────────────────────────────────────────────────────────
   5. MODULE EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  init,
  is_fts_available,
  fts_search,
  hybrid_search,
  search_with_fallback,

  // Legacy aliases for backward compatibility
  isFtsAvailable: is_fts_available,
  ftsSearch: fts_search,
  hybridSearch: hybrid_search,
  searchWithFallback: search_with_fallback,
};
