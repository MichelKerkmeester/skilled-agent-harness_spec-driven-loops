// ---------------------------------------------------------------
// MODULE: RSF Fusion (Relative Score Fusion)
// Single-pair variant: normalizes scores relative to each source's
// score distribution before combining.
// Sprint 3, Task T002a — Hybrid RAG Fusion Refinement
// ---------------------------------------------------------------

import type { RrfItem, RankedList } from './rrf-fusion';

/* ---------------------------------------------------------------
   1. INTERFACES
   --------------------------------------------------------------- */

/** Result of RSF fusion: an RrfItem augmented with normalized fused score and source tracking. */
interface RsfResult extends RrfItem {
  /** Relative Score Fusion score, clamped to [0, 1]. */
  rsfScore: number;
  /** Sources that contributed to this result. */
  sources: string[];
  /** Per-source normalized scores. */
  sourceScores: Record<string, number>;
}

/* ---------------------------------------------------------------
   2. HELPERS
   --------------------------------------------------------------- */

/**
 * Extract a raw score from an RrfItem.
 * Checks for `score` first, then `similarity`, then falls back
 * to rank-based scoring: 1 - rank / total.
 */
function extractScore(item: RrfItem, rank: number, total: number): number {
  if (typeof item.score === 'number' && isFinite(item.score)) {
    return item.score;
  }
  if (typeof item.similarity === 'number' && isFinite(item.similarity)) {
    return item.similarity;
  }
  // Rank-based fallback: top item gets ~1.0, last gets ~0.0
  if (total <= 1) return 1.0;
  return 1 - rank / total;
}

/**
 * Min-max normalize a value within [min, max].
 * If max === min (all scores identical), returns 1.0.
 */
function minMaxNormalize(value: number, min: number, max: number): number {
  if (max === min) return 1.0;
  return (value - min) / (max - min);
}

/**
 * Clamp a value to [0, 1].
 */
function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

/* ---------------------------------------------------------------
   3. CORE FUNCTION
   --------------------------------------------------------------- */

/**
 * Fuse two ranked result lists using Relative Score Fusion (single-pair).
 *
 * Algorithm:
 * 1. For each list, extract raw scores and compute min/max
 * 2. Normalize each item's score within its source via min-max
 * 3. Items in both lists: fusedScore = (normalizedA + normalizedB) / 2
 * 4. Items in one list only: fusedScore = normalizedScore * 0.5 (single-source penalty)
 * 5. Sort descending by rsfScore
 * 6. All scores clamped to [0, 1]
 */
function fuseResultsRsf(listA: RankedList, listB: RankedList): RsfResult[] {
  const itemsA = listA.results;
  const itemsB = listB.results;

  // Handle both-empty case
  if (itemsA.length === 0 && itemsB.length === 0) {
    return [];
  }

  // --- Step 1: Extract raw scores ---
  const scoresA = itemsA.map((item, i) => extractScore(item, i, itemsA.length));
  const scoresB = itemsB.map((item, i) => extractScore(item, i, itemsB.length));

  // --- Step 2: Compute min/max per source ---
  const minA = scoresA.length > 0 ? Math.min(...scoresA) : 0;
  const maxA = scoresA.length > 0 ? Math.max(...scoresA) : 0;
  const minB = scoresB.length > 0 ? Math.min(...scoresB) : 0;
  const maxB = scoresB.length > 0 ? Math.max(...scoresB) : 0;

  // --- Step 3: Normalize and collect into maps ---
  const normalizedMapA = new Map<number | string, { item: RrfItem; normalizedScore: number }>();
  for (let i = 0; i < itemsA.length; i++) {
    const normalized = minMaxNormalize(scoresA[i], minA, maxA);
    normalizedMapA.set(itemsA[i].id, { item: itemsA[i], normalizedScore: normalized });
  }

  const normalizedMapB = new Map<number | string, { item: RrfItem; normalizedScore: number }>();
  for (let i = 0; i < itemsB.length; i++) {
    const normalized = minMaxNormalize(scoresB[i], minB, maxB);
    normalizedMapB.set(itemsB[i].id, { item: itemsB[i], normalizedScore: normalized });
  }

  // --- Step 4: Fuse ---
  const resultMap = new Map<number | string, RsfResult>();

  // All IDs from both lists
  const allIds = new Set<number | string>([
    ...normalizedMapA.keys(),
    ...normalizedMapB.keys(),
  ]);

  for (const id of allIds) {
    const entryA = normalizedMapA.get(id);
    const entryB = normalizedMapB.get(id);

    let rsfScore: number;
    const sources: string[] = [];
    const sourceScores: Record<string, number> = {};

    // Merge item properties (prefer A, overlay B)
    let mergedItem: RrfItem;

    if (entryA && entryB) {
      // Item in both lists: average the normalized scores
      rsfScore = (entryA.normalizedScore + entryB.normalizedScore) / 2;
      sources.push(listA.source, listB.source);
      sourceScores[listA.source] = entryA.normalizedScore;
      sourceScores[listB.source] = entryB.normalizedScore;
      mergedItem = { ...entryB.item, ...entryA.item };
    } else if (entryA) {
      // Item in A only: apply single-source penalty
      rsfScore = entryA.normalizedScore * 0.5;
      sources.push(listA.source);
      sourceScores[listA.source] = entryA.normalizedScore;
      mergedItem = { ...entryA.item };
    } else {
      // Item in B only: apply single-source penalty
      rsfScore = entryB!.normalizedScore * 0.5;
      sources.push(listB.source);
      sourceScores[listB.source] = entryB!.normalizedScore;
      mergedItem = { ...entryB!.item };
    }

    // Clamp to [0, 1]
    rsfScore = clamp01(rsfScore);

    resultMap.set(id, {
      ...mergedItem,
      rsfScore,
      sources,
      sourceScores,
    });
  }

  // --- Step 5: Sort descending by rsfScore ---
  return Array.from(resultMap.values())
    .sort((a, b) => b.rsfScore - a.rsfScore);
}

/* ---------------------------------------------------------------
   4. FEATURE FLAG
   --------------------------------------------------------------- */

/**
 * Check if RSF fusion is enabled via the SPECKIT_RSF_FUSION env var.
 * Defaults to false (opt-in). Set SPECKIT_RSF_FUSION=true to enable.
 */
function isRsfEnabled(): boolean {
  return process.env.SPECKIT_RSF_FUSION === 'true';
}

/* ---------------------------------------------------------------
   5. EXPORTS
   --------------------------------------------------------------- */

export {
  fuseResultsRsf,
  isRsfEnabled,
  extractScore,
  minMaxNormalize,
  clamp01,
};

export type {
  RsfResult,
};
