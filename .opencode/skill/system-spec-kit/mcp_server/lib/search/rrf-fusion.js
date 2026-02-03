// ───────────────────────────────────────────────────────────────
// SEARCH: RRF FUSION
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION

   Reciprocal Rank Fusion (RRF) for hybrid search score fusion.
   Formula: combined = 1/(k + rank_vec) + 1/(k + rank_fts) + 1/(k + rank_graph)
   Ref: Cormack et al. "RRF outperforms Condorcet" (SIGIR 2009)

   REQ-011: RRF Search Fusion Enhancement
   - k=60 industry standard
   - 10% convergence bonus for multi-source results
   - 1.5x graph weight boost for unique discoveries
────────────────────────────────────────────────────────────────*/

const ENABLE_RRF_FUSION = process.env.ENABLE_RRF_FUSION !== 'false';
const DEFAULT_K = 60;
const CONVERGENCE_BONUS = 0.10;
const GRAPH_WEIGHT_BOOST = 1.5;

const SOURCE_TYPES = {
  VECTOR: 'vector',
  BM25: 'bm25',
  GRAPH: 'graph',
};

/* ─────────────────────────────────────────────────────────────
   2. CORE FUNCTIONS
────────────────────────────────────────────────────────────────*/

// Legacy 2-source fusion for backward compatibility
function fuse_results(vector_results, fts_results, options = {}) {
  return fuse_results_multi(vector_results, fts_results, [], options);
}

// Multi-source RRF fusion (vector, BM25/FTS, graph)
function fuse_results_multi(vector_results, fts_results, graph_results = [], options = {}) {
  const {
    limit = 10,
    k = DEFAULT_K,
    enable_graph_boost = true,
  } = options;

  // If RRF fusion is disabled, return vector results with basic metadata
  if (!ENABLE_RRF_FUSION) {
    return vector_results.slice(0, limit).map((r, i) => ({
      ...r,
      rrf_score: 1 / (k + i + 1),
      sources: [SOURCE_TYPES.VECTOR],
      source_count: 1,
      in_vector: true,
      in_fts: false,
      in_graph: false,
      vector_rank: i + 1,
      fts_rank: null,
      graph_rank: null,
    }));
  }

  // Build rank maps (1-indexed)
  const vector_ranks = new Map();
  vector_results.forEach((r, i) => vector_ranks.set(r.id, i + 1));

  const fts_ranks = new Map();
  fts_results.forEach((r, i) => fts_ranks.set(r.id, i + 1));

  const graph_ranks = new Map();
  graph_results.forEach((r, i) => graph_ranks.set(r.id, i + 1));

  // HIGH-005 FIX: Build ID-to-result maps for O(1) lookups instead of O(n) find()
  // This reduces overall complexity from O(n*m) to O(n+m)
  const vector_results_by_id = new Map();
  vector_results.forEach(r => vector_results_by_id.set(r.id, r));

  const fts_results_by_id = new Map();
  fts_results.forEach(r => fts_results_by_id.set(r.id, r));

  const graph_results_by_id = new Map();
  graph_results.forEach(r => graph_results_by_id.set(r.id, r));

  // Collect all unique IDs
  const all_ids = new Set([
    ...vector_results.map(r => r.id),
    ...fts_results.map(r => r.id),
    ...graph_results.map(r => r.id),
  ]);

  const scored = [];
  for (const id of all_ids) {
    const vec_rank = vector_ranks.get(id);
    const fts_rank = fts_ranks.get(id);
    const graph_rank = graph_ranks.get(id);

    // RRF: sum of 1/(k + rank) for each method
    let rrf_score = 0;
    if (vec_rank) rrf_score += 1 / (k + vec_rank);
    if (fts_rank) rrf_score += 1 / (k + fts_rank);
    if (graph_rank) rrf_score += 1 / (k + graph_rank);

    // Count sources for convergence calculation
    const sources = [];
    if (vec_rank) sources.push(SOURCE_TYPES.VECTOR);
    if (fts_rank) sources.push(SOURCE_TYPES.BM25);
    if (graph_rank) sources.push(SOURCE_TYPES.GRAPH);
    const source_count = sources.length;

    // Convergence bonus: reward results found by 2+ methods (CHK-042)
    // Multi-source agreement indicates higher relevance
    const convergence_bonus = source_count >= 2 ? CONVERGENCE_BONUS : 0;

    // Graph weight boost: 1.5x for graph-only discoveries (CHK-043)
    // These are unique discoveries from causal relationships not found by semantic/lexical search
    const is_graph_only = !!(graph_rank && !vec_rank && !fts_rank);
    const graph_boost = (is_graph_only && enable_graph_boost) ? GRAPH_WEIGHT_BOOST : 1.0;

    // Final score: (base RRF + convergence bonus) * graph boost
    const final_score = (rrf_score + convergence_bonus) * graph_boost;

    // O(1) map lookup: prefer vector > fts > graph for result metadata
    const result = vector_results_by_id.get(id)
      || fts_results_by_id.get(id)
      || graph_results_by_id.get(id);

    scored.push({
      ...result,
      rrf_score: final_score,
      sources,
      source_count,
      is_graph_only,
      in_vector: !!vec_rank,
      in_fts: !!fts_rank,
      in_graph: !!graph_rank,
      vector_rank: vec_rank || null,
      fts_rank: fts_rank || null,
      graph_rank: graph_rank || null,
    });
  }

  return scored.sort((a, b) => b.rrf_score - a.rrf_score).slice(0, limit);
}

// Advanced fusion: base (max) + convergence bonus + original term bonus
function fuse_scores_advanced(semantic_sim, keyword_score, original_matches) {
  const base_score = Math.max(semantic_sim, keyword_score);

  // Convergence: use weaker score as basis (indicates agreement strength)
  let convergence_bonus = 0;
  if (semantic_sim > 0 && keyword_score > 0) {
    convergence_bonus = Math.min(semantic_sim, keyword_score) * 0.25;
  }

  // Original term bonus capped at 0.2 (2 terms max)
  const original_bonus = Math.min(original_matches * 0.1, 0.2);

  return Math.min(base_score + convergence_bonus + original_bonus, 1.0);
}

// Count query terms (>3 chars) appearing in content
function count_original_term_matches(query, content) {
  const query_terms = query.toLowerCase().split(/\s+/);
  const content_lower = content.toLowerCase();

  let matches = 0;
  for (const term of query_terms) {
    if (term.length > 3 && content_lower.includes(term)) {
      matches++;
    }
  }
  return matches;
}

/* ─────────────────────────────────────────────────────────────
   3. UNIFIED SEARCH ENTRY POINT
────────────────────────────────────────────────────────────────*/

// Recommended entry point for hybrid search
function unified_search(sources = {}, options = {}) {
  const {
    vector = [],
    bm25 = [],
    graph = [],
  } = sources;

  const { limit = 10 } = options;

  // Track which sources are active
  const active_sources = [];
  if (vector.length > 0) active_sources.push(SOURCE_TYPES.VECTOR);
  if (bm25.length > 0) active_sources.push(SOURCE_TYPES.BM25);
  if (graph.length > 0) active_sources.push(SOURCE_TYPES.GRAPH);

  // If only one source has results, skip fusion overhead
  if (active_sources.length <= 1) {
    const single_source = vector.length > 0 ? vector
      : bm25.length > 0 ? bm25
        : graph;
    const source_type = vector.length > 0 ? SOURCE_TYPES.VECTOR
      : bm25.length > 0 ? SOURCE_TYPES.BM25
        : SOURCE_TYPES.GRAPH;

    const results = single_source.slice(0, limit).map((r, i) => ({
      ...r,
      rrf_score: 1 / (DEFAULT_K + i + 1),
      sources: [source_type],
      source_count: 1,
      is_graph_only: source_type === SOURCE_TYPES.GRAPH,
      in_vector: source_type === SOURCE_TYPES.VECTOR,
      in_fts: source_type === SOURCE_TYPES.BM25,
      in_graph: source_type === SOURCE_TYPES.GRAPH,
      vector_rank: source_type === SOURCE_TYPES.VECTOR ? i + 1 : null,
      fts_rank: source_type === SOURCE_TYPES.BM25 ? i + 1 : null,
      graph_rank: source_type === SOURCE_TYPES.GRAPH ? i + 1 : null,
    }));

    return {
      results,
      metadata: {
        fusion_enabled: ENABLE_RRF_FUSION,
        active_sources,
        source_counts: {
          vector: vector.length,
          bm25: bm25.length,
          graph: graph.length,
        },
        fusion_applied: false,
        k: DEFAULT_K,
      },
    };
  }

  // Apply multi-source RRF fusion
  const results = fuse_results_multi(vector, bm25, graph, options);

  // Calculate convergence statistics
  const multi_source_count = results.filter(r => r.source_count >= 2).length;
  const graph_only_count = results.filter(r => r.is_graph_only).length;

  return {
    results,
    metadata: {
      fusion_enabled: ENABLE_RRF_FUSION,
      active_sources,
      source_counts: {
        vector: vector.length,
        bm25: bm25.length,
        graph: graph.length,
      },
      fusion_applied: true,
      k: options.k || DEFAULT_K,
      convergence_bonus: CONVERGENCE_BONUS,
      graph_weight_boost: GRAPH_WEIGHT_BOOST,
      // Statistics for observability
      stats: {
        total_results: results.length,
        multi_source_results: multi_source_count,
        graph_only_discoveries: graph_only_count,
      },
    },
  };
}

function is_rrf_enabled() {
  return ENABLE_RRF_FUSION;
}

/* ─────────────────────────────────────────────────────────────
   4. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Core fusion functions
  fuse_results,
  fuse_results_multi,
  unified_search,

  // Score utilities
  fuse_scores_advanced,
  count_original_term_matches,

  // Configuration
  DEFAULT_K,
  CONVERGENCE_BONUS,
  GRAPH_WEIGHT_BOOST,
  SOURCE_TYPES,
  ENABLE_RRF_FUSION,

  // Status
  is_rrf_enabled,
};
