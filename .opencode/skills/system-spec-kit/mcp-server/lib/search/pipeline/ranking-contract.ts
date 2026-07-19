// ───────────────────────────────────────────────────────────────
// MODULE: Ranking Contract
// ───────────────────────────────────────────────────────────────

import { resolveEffectiveScore } from './types.js';
import type { PipelineRow } from './types.js';

/**
 * Stage 2 graph-walk additive bonus cap.
 *
 * Centralized here so deterministic ordering rules and additive graph-bonus
 * bounds share one contract surface.
 */
export const STAGE2_GRAPH_BONUS_CAP = 0.03;

/**
 * Clamp a Stage 2 graph-derived additive bonus to the bounded contract.
 *
 * The contract is strictly additive and never allows negative graph bonuses.
 */
export function clampStage2GraphBonus(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(STAGE2_GRAPH_BONUS_CAP, value));
}

function resolveContentHashTieValue(row: Record<string, unknown> & { id: number }): string | null {
  const value = row.content_hash;
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function compareContentHashTieValue(
  a: Record<string, unknown> & { id: number },
  b: Record<string, unknown> & { id: number },
): number {
  const aHash = resolveContentHashTieValue(a);
  const bHash = resolveContentHashTieValue(b);

  if (aHash !== null || bHash !== null) {
    const aKey = aHash ?? String(a.id);
    const bKey = bHash ?? String(b.id);
    const hashCompare = aKey.localeCompare(bKey);
    if (hashCompare !== 0) return hashCompare;
  }

  return a.id - b.id;
}

/**
 * Compare rows deterministically so ties resolve the same way across runs.
 *
 * Primary score delegates to resolveEffectiveScore so sorting, filtering, and
 * score resolution always agree.
 * Tiebreaker on raw similarity is preserved (different purpose than score resolution).
 *
 * @param a - First ranked row.
 * @param b - Second ranked row.
 * @returns Negative when `a` should sort before `b`.
 */
export function compareDeterministicRows(
  a: Record<string, unknown> & { id: number },
  b: Record<string, unknown> & { id: number },
): number {
  const aScore = resolveEffectiveScore(a as PipelineRow);
  const bScore = resolveEffectiveScore(b as PipelineRow);

  if (bScore !== aScore) return bScore - aScore;

  // Tiebreaker: raw similarity (preserve existing behavior)
  const aSimilarity = typeof a.similarity === 'number' && Number.isFinite(a.similarity) ? a.similarity : 0;
  const bSimilarity = typeof b.similarity === 'number' && Number.isFinite(b.similarity) ? b.similarity : 0;
  if (bSimilarity !== aSimilarity) return bSimilarity - aSimilarity;

  return compareContentHashTieValue(a, b);
}

/**
 * Sort a result set with the deterministic ranking contract.
 *
 * @param rows - Ranked rows to sort without mutating the input array.
 * @returns Copy of the input rows sorted with deterministic tie-breaking.
 */
export function sortDeterministicRows<T extends Record<string, unknown> & { id: number }>(rows: T[]): T[] {
  return [...rows].sort(compareDeterministicRows);
}
