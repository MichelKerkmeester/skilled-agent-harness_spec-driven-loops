/**
 * RRF Fusion Module - Reciprocal Rank Fusion for hybrid search
 * @module lib/rrf-fusion
 * @version 11.0.0
 *
 * Implements score fusion for hybrid search combining vector similarity
 * and full-text search results using Reciprocal Rank Fusion (RRF).
 *
 * RRF Formula: combined_rank = 1/(k + rank_vec) + 1/(k + rank_fts)
 *
 * References:
 * - Cormack et al. "Reciprocal Rank Fusion outperforms Condorcet and
 *   individual Rank Learning Methods" (SIGIR 2009)
 */

'use strict';

// Default RRF constant (standard value from literature)
const DEFAULT_K = 60;

// Convergence bonus: 10% boost for results appearing in both methods
const CONVERGENCE_BONUS = 0.1;

/**
 * Fuse vector and FTS results using Reciprocal Rank Fusion
 *
 * RRF is a robust method for combining ranked lists that:
 * - Does not require score normalization
 * - Is resistant to outliers
 * - Works well even when result sets have different characteristics
 *
 * @param {Array<Object>} vectorResults - Vector search results with similarity scores
 * @param {Array<Object>} ftsResults - FTS5 results with rank scores
 * @param {Object} [options={}] - Fusion options
 * @param {number} [options.limit=10] - Maximum number of results to return
 * @param {number} [options.k=60] - RRF constant (higher = more weight to lower ranks)
 * @returns {Array<Object>} Fused and ranked results with RRF metadata
 *
 * @example
 * const vectorResults = [
 *   { id: 1, title: 'Doc A', similarity: 0.95 },
 *   { id: 2, title: 'Doc B', similarity: 0.85 }
 * ];
 * const ftsResults = [
 *   { id: 2, title: 'Doc B', rank: 1 },
 *   { id: 3, title: 'Doc C', rank: 2 }
 * ];
 * const fused = fuseResults(vectorResults, ftsResults, { limit: 5 });
 * // Returns: [{ id: 2, rrfScore: 0.133, inVector: true, inFts: true, ... }, ...]
 */
function fuseResults(vectorResults, ftsResults, options = {}) {
  const { limit = 10, k = DEFAULT_K } = options;

  // Build rank maps (1-indexed ranks)
  const vectorRanks = new Map();
  vectorResults.forEach((r, i) => vectorRanks.set(r.id, i + 1));

  const ftsRanks = new Map();
  ftsResults.forEach((r, i) => ftsRanks.set(r.id, i + 1));

  // Collect all unique IDs from both result sets
  const allIds = new Set([
    ...vectorResults.map(r => r.id),
    ...ftsResults.map(r => r.id)
  ]);

  // Calculate RRF scores for each unique result
  const scored = [];
  for (const id of allIds) {
    const vecRank = vectorRanks.get(id);
    const ftsRank = ftsRanks.get(id);

    // Apply RRF formula: sum of 1/(k + rank) for each method
    let rrfScore = 0;
    if (vecRank) rrfScore += 1 / (k + vecRank);
    if (ftsRank) rrfScore += 1 / (k + ftsRank);

    // Convergence bonus: reward results found by both methods
    // This indicates higher confidence in relevance
    let convergenceBonus = 0;
    if (vecRank && ftsRank) {
      convergenceBonus = CONVERGENCE_BONUS;
    }

    // Get the result object from either source (prefer vector for richer data)
    const result = vectorResults.find(r => r.id === id) ||
                   ftsResults.find(r => r.id === id);

    scored.push({
      ...result,
      rrfScore: rrfScore + convergenceBonus,
      inVector: !!vecRank,
      inFts: !!ftsRank,
      vectorRank: vecRank || null,
      ftsRank: ftsRank || null
    });
  }

  // Sort by RRF score (descending) and limit results
  return scored
    .sort((a, b) => b.rrfScore - a.rrfScore)
    .slice(0, limit);
}

/**
 * Advanced score fusion combining semantic similarity and keyword matching
 *
 * This function provides fine-grained control over score fusion with:
 * - Base score from the stronger signal (max of semantic/keyword)
 * - Convergence bonus when both methods agree
 * - Original term bonus for exact query word matches
 *
 * @param {number} semanticSim - Semantic similarity score (0-1)
 * @param {number} keywordScore - Keyword match score (0-1)
 * @param {number} originalMatches - Count of original query terms matched exactly
 * @returns {number} Fused score, capped at 1.0
 *
 * @example
 * // High semantic match, moderate keyword match, 2 exact terms
 * const score = fuseScoresAdvanced(0.85, 0.6, 2);
 * // Returns: ~0.95 (0.85 base + 0.15 convergence + 0.2 original term bonus, capped)
 */
function fuseScoresAdvanced(semanticSim, keywordScore, originalMatches) {
  // Base score: take the stronger signal
  const baseScore = Math.max(semanticSim, keywordScore);

  // Convergence bonus: both methods have positive scores
  // Use the weaker score as basis (indicates agreement strength)
  let convergenceBonus = 0;
  if (semanticSim > 0 && keywordScore > 0) {
    convergenceBonus = Math.min(semanticSim, keywordScore) * 0.25;
  }

  // Original term bonus: exact query words found in content
  // Cap at 0.2 (2 terms max contribution)
  const originalBonus = Math.min(originalMatches * 0.1, 0.2);

  // Return combined score, capped at 1.0
  return Math.min(baseScore + convergenceBonus + originalBonus, 1.0);
}

/**
 * Calculate how many original query terms appear in content
 *
 * Only counts terms longer than 3 characters to avoid
 * matching common short words (a, the, is, etc.)
 *
 * @param {string} query - Original search query
 * @param {string} content - Content to check for term matches
 * @returns {number} Count of matching terms (terms > 3 chars that appear in content)
 *
 * @example
 * const matches = countOriginalTermMatches('semantic search implementation', 'Implementation of semantic indexing');
 * // Returns: 2 ('semantic' and 'implementation' match)
 */
function countOriginalTermMatches(query, content) {
  // Tokenize query into lowercase terms
  const queryTerms = query.toLowerCase().split(/\s+/);
  const contentLower = content.toLowerCase();

  let matches = 0;
  for (const term of queryTerms) {
    // Only count terms longer than 3 characters
    // This filters out common short words
    if (term.length > 3 && contentLower.includes(term)) {
      matches++;
    }
  }

  return matches;
}

module.exports = {
  fuseResults,
  fuseScoresAdvanced,
  countOriginalTermMatches,
  DEFAULT_K,
  CONVERGENCE_BONUS
};
