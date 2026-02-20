// ---------------------------------------------------------------
// MODULE: MMR Reranker
// Maximal Marginal Relevance for post-fusion diversity pruning.
// C138-P1: Reduces redundancy while preserving relevance in
// search results by balancing similarity to query vs. similarity
// to already-selected results.
// C138-P2: Graph-Guided MMR augments diversity with topological
// distance from the SGQS skill graph (T012).
// ---------------------------------------------------------------

import { isGraphMMREnabled } from './graph-flags';

/* ---------------------------------------------------------------
   1. CONSTANTS
   --------------------------------------------------------------- */

/** Default maximum number of candidates to process before MMR selection. */
const DEFAULT_MAX_CANDIDATES = 20;

/** Maximum graph distance used to normalise BFS path length to [0,1]. */
const MAX_DIST = 10;

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

/**
 * Minimal structural view of the SkillGraph needed for BFS distance computation.
 * We use a local interface rather than importing from scripts/sgqs/types directly
 * to keep the dependency boundary clean.
 */
interface SkillGraphLike {
  nodes: Map<string, { id: string; labels: string[]; properties: Record<string, unknown>; path: string }>;
  edges: { source: string; target: string }[];
  /** node ID → outbound neighbour IDs */
  outbound: Map<string, string[]>;
}

/** Configuration for the MMR reranking pass. */
export interface MMRConfig {
  /** Trade-off weight: 0 = maximum diversity, 1 = maximum relevance. */
  lambda: number;
  /** Maximum number of results to return. */
  limit: number;
  /** Hard cap on input candidates processed before MMR (default 20). */
  maxCandidates?: number;
  /**
   * Optional caller-supplied function that returns the graph topological
   * distance between two candidate node IDs.  When provided and
   * isGraphMMREnabled() is true the diversity term blends cosine similarity
   * with normalised graph distance (graphAlpha controls the blend).
   */
  graphDistanceFn?: (idA: number | string, idB: number | string) => number;
  /**
   * Blend weight for graph-guided MMR diversity.
   * diversity = graphAlpha * cosine_sim + (1 - graphAlpha) * (1 - graph_dist / MAX_DIST)
   * Default: 0.5
   */
  graphAlpha?: number;
}

/* ---------------------------------------------------------------
   3. CORE FUNCTIONS
   --------------------------------------------------------------- */

/**
 * Compute the BFS shortest-path length between two nodes in a SkillGraph.
 *
 * Traversal follows the `outbound` adjacency map (directed edges).
 * Returns MAX_DIST when the target is unreachable or either node is absent.
 *
 * @param graph  - The SkillGraph adjacency structure
 * @param idA    - Source node ID
 * @param idB    - Target node ID
 * @returns      Integer hop count in [0, MAX_DIST]
 */
export function computeGraphDistance(
  graph: SkillGraphLike,
  idA: string,
  idB: string,
): number {
  if (idA === idB) return 0;

  const visited = new Set<string>();
  const queue: Array<{ id: string; depth: number }> = [{ id: idA, depth: 0 }];
  visited.add(idA);

  while (queue.length > 0) {
    // Non-null safe: loop condition guarantees queue.length > 0 before shift()
    const current = queue.shift()!;
    if (current.depth >= MAX_DIST) continue;

    const neighbours = graph.outbound.get(current.id) ?? [];
    for (const neighbour of neighbours) {
      if (neighbour === idB) return current.depth + 1;
      if (!visited.has(neighbour)) {
        visited.add(neighbour);
        queue.push({ id: neighbour, depth: current.depth + 1 });
      }
    }
  }

  return MAX_DIST;
}

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
  // P1-4 FIX: Use minimum length to prevent undefined access when vectors differ in size
  const len = Math.min(a.length, b.length);
  if (len === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < len; i++) {
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
  const {
    lambda: rawLambda,
    limit,
    maxCandidates = DEFAULT_MAX_CANDIDATES,
    graphDistanceFn,
    graphAlpha = 0.5,
  } = config;

  // Clamp lambda to [0, 1] to guard against caller mistakes.
  // Values outside this range invert relevance or diversity weighting.
  const lambda = Math.max(0, Math.min(1, rawLambda));

  // Determine whether graph-guided MMR diversity is active.
  // Both the feature flag AND the caller-supplied distance function are required.
  const useGraphMMR = isGraphMMREnabled() && typeof graphDistanceFn === 'function';

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

      // Find maximum diversity-adjusted similarity to any already-selected result.
      // When graph-guided MMR is active, blend cosine with normalised graph distance:
      //   diversity(Di, Dj) = alpha * cosine_sim + (1 - alpha) * (1 - dist / MAX_DIST)
      // When flag is off or no distance function is provided, pure cosine is used.
      let maxSim = -Infinity;
      for (const sel of selected) {
        let sim: number;
        if (useGraphMMR) {
          const cosineSim = computeCosine(pool[i].embedding, sel.embedding);
          // Non-null safe: useGraphMMR is true only when graphDistanceFn is a function (checked above)
          const dist = graphDistanceFn!(pool[i].id, sel.id);
          const normDist = Math.min(dist, MAX_DIST) / MAX_DIST;
          sim = graphAlpha * cosineSim + (1 - graphAlpha) * (1 - normDist);
        } else {
          sim = computeCosine(pool[i].embedding, sel.embedding);
        }
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

export { DEFAULT_MAX_CANDIDATES, MAX_DIST };
export type { SkillGraphLike };
