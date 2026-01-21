// ───────────────────────────────────────────────────────────────
// SEARCH: RRF FUSION
// ───────────────────────────────────────────────────────────────
'use strict';

// Score fusion for hybrid search using Reciprocal Rank Fusion (RRF).
// Formula: combined_rank = 1/(k + rank_vec) + 1/(k + rank_fts)
// Ref: Cormack et al. "Reciprocal Rank Fusion outperforms Condorcet" (SIGIR 2009)

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const DEFAULT_K = 60;           // Standard RRF constant from literature
const CONVERGENCE_BONUS = 0.1;  // 10% boost for results in both methods

/* ─────────────────────────────────────────────────────────────
   2. CORE FUNCTIONS
──────────────────────────────────────────────────────────────── */

// RRF fusion: robust combination that doesn't require score normalization
function fuse_results(vector_results, fts_results, options = {}) {
  const { limit = 10, k = DEFAULT_K } = options;

  // Build rank maps (1-indexed)
  const vector_ranks = new Map();
  vector_results.forEach((r, i) => vector_ranks.set(r.id, i + 1));

  const fts_ranks = new Map();
  fts_results.forEach((r, i) => fts_ranks.set(r.id, i + 1));

  // HIGH-005 FIX: Build ID-to-result maps for O(1) lookups instead of O(n) find()
  // This reduces overall complexity from O(n*m) to O(n+m)
  const vector_results_by_id = new Map();
  vector_results.forEach(r => vector_results_by_id.set(r.id, r));

  const fts_results_by_id = new Map();
  fts_results.forEach(r => fts_results_by_id.set(r.id, r));

  const all_ids = new Set([
    ...vector_results.map(r => r.id),
    ...fts_results.map(r => r.id),
  ]);

  const scored = [];
  for (const id of all_ids) {
    const vec_rank = vector_ranks.get(id);
    const fts_rank = fts_ranks.get(id);

    // RRF: sum of 1/(k + rank) for each method
    let rrf_score = 0;
    if (vec_rank) rrf_score += 1 / (k + vec_rank);
    if (fts_rank) rrf_score += 1 / (k + fts_rank);

    // Convergence bonus: reward results found by both methods
    const convergence_bonus = (vec_rank && fts_rank) ? CONVERGENCE_BONUS : 0;

    // HIGH-005 FIX: O(1) map lookup instead of O(n) find()
    const result = vector_results_by_id.get(id) || fts_results_by_id.get(id);

    scored.push({
      ...result,
      rrf_score: rrf_score + convergence_bonus,
      in_vector: !!vec_rank,
      in_fts: !!fts_rank,
      vector_rank: vec_rank || null,
      fts_rank: fts_rank || null,
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
   3. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  fuse_results,
  fuse_scores_advanced,
  count_original_term_matches,
  DEFAULT_K,
  CONVERGENCE_BONUS,
};
