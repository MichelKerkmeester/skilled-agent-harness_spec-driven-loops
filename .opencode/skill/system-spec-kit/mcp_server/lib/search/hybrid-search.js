// ───────────────────────────────────────────────────────────────
// SEARCH: HYBRID SEARCH
// ───────────────────────────────────────────────────────────────
'use strict';

const {
  fuse_results,
  fuse_results_multi,
  unified_search,
  is_rrf_enabled,
  SOURCE_TYPES,
} = require('./rrf-fusion');

const bm25Index = require('./bm25-index');

/* ─────────────────────────────────────────────────────────────
   1. MODULE STATE
────────────────────────────────────────────────────────────────*/

let db = null;
let vector_search_fn = null;
let graph_search_fn = null;

/* ─────────────────────────────────────────────────────────────
   2. INITIALIZATION
────────────────────────────────────────────────────────────────*/

function init(database, vector_search, graph_search = null) {
  if (!database) {
    throw new Error('[hybrid-search] init() requires a valid database instance');
  }
  if (typeof vector_search !== 'function') {
    throw new Error('[hybrid-search] init() requires vectorSearch to be a function');
  }
  db = database;
  vector_search_fn = vector_search;
  graph_search_fn = typeof graph_search === 'function' ? graph_search : null;
}

/* ─────────────────────────────────────────────────────────────
   3. BM25 SEARCH
────────────────────────────────────────────────────────────────*/

// Perform BM25 search using the in-memory index
function bm25_search(query_text, options = {}) {
  const { limit = 10, spec_folder = null } = options;

  if (!bm25Index.is_bm25_enabled()) {
    return [];
  }

  try {
    const bm25 = bm25Index.get_index();
    const stats = bm25.get_stats();

    // If BM25 index is empty, return empty results
    if (stats.total_documents === 0) {
      return [];
    }

    return bm25.search(query_text, { limit, spec_folder });
  } catch (err) {
    console.warn('[hybrid-search] BM25 search failed:', err.message);
    return [];
  }
}

// Check if BM25 index is available and populated
function is_bm25_available() {
  if (!bm25Index.is_bm25_enabled()) {
    return false;
  }

  try {
    const bm25 = bm25Index.get_index();
    return bm25.get_stats().total_documents > 0;
  } catch {
    return false;
  }
}

// Get combined lexical results from FTS5 and BM25
function combined_lexical_search(query_text, options = {}) {
  const { limit = 10, spec_folder = null } = options;

  // Get results from both sources
  const fts_results = is_fts_available()
    ? fts_search(query_text, { limit: limit * 2, spec_folder })
    : [];

  const bm25_results = is_bm25_available()
    ? bm25_search(query_text, { limit: limit * 2, spec_folder })
    : [];

  // If only one source, return those results
  if (fts_results.length === 0) return bm25_results.slice(0, limit);
  if (bm25_results.length === 0) return fts_results.slice(0, limit);

  // Merge results, using highest score per ID
  const merged = new Map();

  // Add FTS5 results
  for (const result of fts_results) {
    merged.set(result.id, {
      ...result,
      fts_score: result.fts_score || 0,
      bm25_score: 0,
      source: 'fts5',
    });
  }

  // Add/update with BM25 results
  for (const result of bm25_results) {
    const existing = merged.get(result.id);
    if (existing) {
      // Merge scores - take max for combined ranking
      existing.bm25_score = result.bm25_score || 0;
      existing.source = 'both';
    } else {
      merged.set(result.id, {
        ...result,
        fts_score: 0,
        bm25_score: result.bm25_score || 0,
        source: 'bm25',
      });
    }
  }

  // Sort by combined score (average of normalized scores)
  const results = Array.from(merged.values());

  // Normalize and combine scores for ranking
  const max_fts = Math.max(...results.map(r => r.fts_score || 0), 1);
  const max_bm25 = Math.max(...results.map(r => r.bm25_score || 0), 1);

  for (const result of results) {
    const norm_fts = (result.fts_score || 0) / max_fts;
    const norm_bm25 = (result.bm25_score || 0) / max_bm25;
    // Combined score: prefer results found by both
    result.combined_lexical_score = (norm_fts + norm_bm25) / 2;
  }

  return results
    .sort((a, b) => b.combined_lexical_score - a.combined_lexical_score)
    .slice(0, limit);
}

/* ─────────────────────────────────────────────────────────────
   4. FTS5 SEARCH
────────────────────────────────────────────────────────────────*/
function is_fts_available() {
  if (!db) return false;
  try {
    db.prepare('SELECT 1 FROM memory_fts LIMIT 1').get();
    return true;
  } catch {
    return false;
  }
}

// FTS5-only search (includes all memories regardless of embedding_status)
function fts_search(query_text, options = {}) {
  const { limit = 10, spec_folder = null } = options;

  // Escape FTS5 special characters and operators
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
   5. HYBRID SEARCH
────────────────────────────────────────────────────────────────*/

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

// Enhanced hybrid search with vector, BM25/FTS5, and optional graph sources
function hybrid_search_enhanced(query_embedding, query_text, options = {}) {
  if (!db) {
    console.warn('[hybrid-search] Database not initialized. Call init() first.');
    return { results: [], metadata: { error: 'Database not initialized' } };
  }

  const {
    limit = 10,
    spec_folder = null,
    use_decay = true,
    include_graph = true,
    use_bm25 = true,
    memory_id = null,
  } = options;

  // Collect results from all available sources
  const fetch_limit = limit * 2; // 2x limit for fusion headroom

  // Vector search (semantic)
  const vector_results = vector_search_fn
    ? vector_search_fn(query_embedding, { limit: fetch_limit, spec_folder, use_decay })
    : [];

  // T031: Combined lexical search (FTS5 + BM25) or FTS5-only
  // When use_bm25 is true, combines both sources for better keyword coverage
  let lexical_results = [];
  let bm25_doc_count = 0;

  if (use_bm25 && is_bm25_available()) {
    lexical_results = combined_lexical_search(query_text, { limit: fetch_limit, spec_folder });
    try {
      bm25_doc_count = bm25Index.get_index().get_stats().total_documents;
    } catch { /* ignore */ }
  } else if (is_fts_available()) {
    lexical_results = fts_search(query_text, { limit: fetch_limit, spec_folder });
  }

  // Graph search (causal) - optional, requires graph_search_fn and memory_id
  let graph_results = [];
  if (include_graph && graph_search_fn && memory_id) {
    try {
      graph_results = graph_search_fn(memory_id, { limit: fetch_limit, spec_folder });
    } catch (err) {
      console.warn('[hybrid-search] Graph search failed:', err.message);
    }
  }

  // Use unified search for RRF fusion with full metadata
  const { results, metadata } = unified_search(
    {
      vector: vector_results,
      bm25: lexical_results,
      graph: graph_results,
    },
    { limit }
  );

  // Add search context to metadata
  return {
    results,
    metadata: {
      ...metadata,
      query_text_length: query_text?.length || 0,
      has_embedding: !!query_embedding,
      spec_folder_filter: spec_folder,
      graph_enabled: include_graph && !!graph_search_fn,
      bm25_enabled: use_bm25,
      bm25_available: is_bm25_available(),
      bm25_doc_count,
    },
  };
}

// Search with automatic fallback to whichever method is available
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
   6. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  init,
  is_fts_available,
  fts_search,
  hybrid_search,
  hybrid_search_enhanced,
  search_with_fallback,

  // BM25 search functions
  bm25_search,
  is_bm25_available,
  combined_lexical_search,

  // Re-export RRF utilities for convenience
  is_rrf_enabled,
  unified_search,
  SOURCE_TYPES,

  // Legacy aliases for backward compatibility
  isFtsAvailable: is_fts_available,
  ftsSearch: fts_search,
  hybridSearch: hybrid_search,
  hybridSearchEnhanced: hybrid_search_enhanced,
  searchWithFallback: search_with_fallback,
  bm25Search: bm25_search,
  isBm25Available: is_bm25_available,
  combinedLexicalSearch: combined_lexical_search,
};
