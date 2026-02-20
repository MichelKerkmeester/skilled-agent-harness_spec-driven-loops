// ---------------------------------------------------------------
// MODULE: MMR Reranker
// Maximal Marginal Relevance for post-fusion diversity pruning.
// C138-P1: Reduces redundancy while preserving relevance in
// search results by balancing similarity to query vs. similarity
// to already-selected results.
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. CONSTANTS
   --------------------------------------------------------------- */

/** Default maximum number of candidates to process before MMR selection. */
const DEFAULT_MAX_CANDIDATES = 20;

/* ---------------------------------------------------------------
   2. INTERFACES
   --------------------------------------------------------------- */

/** A search result candidate eligible for MMR reranking. */
export interface MMRCandidate {
  id: number | string;
  /** Relevance score from the upstream retrieval system. */
  score: number;
  /** Dense embedding vector for similarity computation. */
  embedding: Float32Array;
  content?: string;
}

/** Configuration for the MMR reranking pass. */
export interface MMRConfig {
  /** Trade-off weight: 0 = maximum diversity, 1 = maximum relevance. */
  lambda: number;
  /** Maximum number of results to return. */
  limit: number;
  /** Hard cap on input candidates processed before MMR (default 20). */
  maxCandidates?: number;
}

/* ---------------------------------------------------------------
   3. CORE FUNCTIONS
   --------------------------------------------------------------- */

/**
 * Compute cosine similarity between two embedding vectors.
 * Returns 0 when either vector has zero magnitude to avoid division by zero.
 *
 * @param a - First embedding vector (Float32Array or number array)
 * @param b - Second embedding vector (Float32Array or number array)
 * @returns Cosine similarity in range [-1, 1]
 */
export function computeCosine(
  a: Float32Array | number[],
  b: Float32Array | number[],
): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  // Guard: return 0 for zero-magnitude vectors to avoid NaN
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Apply Maximal Marginal Relevance reranking to diversify search results.
 *
 * MMR greedily selects candidates using the formula:
 *   MMR(Di) = lambda * Sim(Di, Q) - (1 - lambda) * max(Sim(Di, Dj)) for Dj in selected
 *
 * Where `Sim(Di, Q)` is approximated by the upstream relevance score, and
 * `Sim(Di, Dj)` is the cosine similarity between embeddings.
 *
 * @param candidates - Scored candidates with embeddings, sorted by relevance
 * @param config - MMR configuration (lambda, limit, maxCandidates)
 * @returns Diverse, reranked subset of candidates up to `limit` length
 */
export function applyMMR(
  candidates: MMRCandidate[],
  config: MMRConfig,
): MMRCandidate[] {
  const { lambda, limit, maxCandidates = DEFAULT_MAX_CANDIDATES } = config;

  // N-cap: only process top-N candidates to bound O(N²) complexity
  const pool = candidates.slice(0, maxCandidates);
  if (pool.length === 0) return [];

  const selected: MMRCandidate[] = [];
  const remaining = new Set(pool.map((_, i) => i));

  // First pick: highest relevance score (pure relevance, no selected set yet)
  let bestIdx = 0;
  let bestScore = -Infinity;
  for (const i of remaining) {
    if (pool[i].score > bestScore) {
      bestScore = pool[i].score;
      bestIdx = i;
    }
  }
  selected.push(pool[bestIdx]);
  remaining.delete(bestIdx);

  // Iteratively select by MMR score until limit is reached or pool exhausted
  while (selected.length < limit && remaining.size > 0) {
    let mmrBestIdx = -1;
    let mmrBestScore = -Infinity;

    for (const i of remaining) {
      const relevance = pool[i].score;

      // Find maximum similarity to any already-selected result
      let maxSim = -Infinity;
      for (const sel of selected) {
        const sim = computeCosine(pool[i].embedding, sel.embedding);
        if (sim > maxSim) maxSim = sim;
      }

      // MMR objective: balance relevance against redundancy with selected set
      const mmrScore = lambda * relevance - (1 - lambda) * maxSim;
      if (mmrScore > mmrBestScore) {
        mmrBestScore = mmrScore;
        mmrBestIdx = i;
      }
    }

    if (mmrBestIdx >= 0) {
      selected.push(pool[mmrBestIdx]);
      remaining.delete(mmrBestIdx);
    } else {
      // No valid candidate found (should not occur with a non-empty remaining set)
      break;
    }
  }

  return selected;
}

/* ---------------------------------------------------------------
   4. EXPORTS
   --------------------------------------------------------------- */

export { DEFAULT_MAX_CANDIDATES };
