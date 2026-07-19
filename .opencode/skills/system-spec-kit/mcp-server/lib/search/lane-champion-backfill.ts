// ───────────────────────────────────────────────────────────────
// MODULE: Lane Champion Backfill
// ───────────────────────────────────────────────────────────────
// Feature flag: SPECKIT_LANE_CHAMPION_BACKFILL (default: OFF / opt-in)
//
// Fusion blends every lane (vector / fts / bm25 / trigger) into one ranked
// list, but a candidate that a single lane ranked first can still finish below
// the fused top-K when no other lane corroborates it. That lane's strongest
// belief then never reaches the user even though a tail slot sits empty. This
// module backfills those empty tail slots with each base lane's CHAMPION — its
// highest-ranked candidate not already in the fused top-K.
//
// It reuses the per-lane result arrays the hybrid pipeline already populated
// (semanticResults, ftsChannelResults, bm25ChannelResults, triggerChannelResults),
// so there is no new query, no re-embedding, and no re-scoring. The contract is
// strictly additive: champions are appended past the baseline window and can only
// occupy slots the baseline did not claim. A champion never reorders, rescores,
// or evicts a fused hit — it can only extend recall into otherwise-empty tail.

// ───────────────────────────────────────────────────────────────
// 1. INTERFACES

// ───────────────────────────────────────────────────────────────
/** Minimal shape of a result this module reads and emits. */
export interface BackfillResult {
  id: number | string;
  score: number;
  source?: string;
  sources?: string[];
  [key: string]: unknown;
}

/** A base lane's ranked candidate list, in lane-rank order (best first). */
export interface LaneCandidates {
  /** Lane name recorded on the backfilled candidate's source. */
  lane: string;
  /** Lane candidates, already ordered by this lane's own ranking. */
  results: Array<{ id: number | string; [key: string]: unknown }>;
}

/** Metadata describing what the backfill did. */
export interface BackfillMetadata {
  /** True when the flag was on and the backfill was evaluated. */
  applied: boolean;
  /** Champions actually appended to the tail. */
  appendedCount: number;
  /** Per-lane count of champions appended (only lanes that contributed). */
  perLane: Record<string, number>;
}

/** Return value of applyLaneChampionBackfill(). Preserves caller element type. */
export interface BackfillOutput<T extends BackfillResult> {
  results: T[];
  backfill: BackfillMetadata;
}

export interface BackfillOptions {
  /** Cap on total champions appended across all lanes. Default: lane count. */
  maxAppend?: number;
}

// ───────────────────────────────────────────────────────────────
// 2. INTERNAL HELPERS

// ───────────────────────────────────────────────────────────────
/**
 * Stable canonical id so a lane champion already present in the fused window is
 * recognised regardless of numeric-vs-string id representation.
 */
function canonicalId(id: number | string): string {
  return typeof id === 'number' ? String(id) : id.trim();
}

// ───────────────────────────────────────────────────────────────
// 3. MAIN EXPORT

// ───────────────────────────────────────────────────────────────
/**
 * Append each base lane's champion (its top candidate not already fused) to the
 * tail of the fused result list.
 *
 * Behaviour:
 *  - `enabled === false` → pass the list through unchanged (byte-identical
 *    ordering, `applied = false`), preserving the flag-off path.
 *  - `enabled === true` → for each lane, walk its ranked candidates and take the
 *    first whose id is not already in the fused list; append it to the tail under
 *    a `lane-champion:<lane>` source. Each lane contributes at most one champion;
 *    a champion already claimed by an earlier lane is not duplicated.
 *
 * The fused baseline keeps its exact order and slots. Appended champions are
 * scored strictly below the weakest baseline hit so a downstream score re-sort
 * cannot lift a champion above a fused result. A champion can therefore only fill
 * an empty tail slot — never evict a baseline top-K hit.
 *
 * @param fusedResults - Post-fusion results in fused order (the protected window).
 * @param lanes        - Base lane candidate lists in lane-rank order.
 * @param enabled      - Whether SPECKIT_LANE_CHAMPION_BACKFILL is active.
 * @param options      - Optional total-append cap.
 */
export function applyLaneChampionBackfill<T extends BackfillResult>(
  fusedResults: T[],
  lanes: LaneCandidates[],
  enabled: boolean,
  options: BackfillOptions = {},
): BackfillOutput<T> {
  if (!enabled || lanes.length === 0) {
    return {
      results: fusedResults,
      backfill: { applied: false, appendedCount: 0, perLane: {} },
    };
  }

  // Claimed = the fused window plus anything an earlier lane already backfilled,
  // so no id is appended twice and no baseline hit is shadowed.
  const claimed = new Set(fusedResults.map((result) => canonicalId(result.id)));
  const maxAppend = options.maxAppend ?? lanes.length;
  const weakestBaselineScore = fusedResults.reduce(
    (min, result) => (typeof result.score === 'number' && result.score < min ? result.score : min),
    Number.POSITIVE_INFINITY,
  );
  const tailScoreBase = Number.isFinite(weakestBaselineScore) ? weakestBaselineScore : 0;

  const appended: T[] = [];
  const perLane: Record<string, number> = {};

  for (const lane of lanes) {
    if (appended.length >= maxAppend) break;
    for (const candidate of lane.results) {
      const canonical = canonicalId(candidate.id);
      if (claimed.has(canonical)) continue; // already fused or backfilled
      claimed.add(canonical);
      // Strictly-decreasing tail score keeps champions below every baseline hit
      // and stable across a downstream re-sort; the epsilon step avoids ties.
      const tailScore = tailScoreBase - 1e-6 * (appended.length + 1);
      appended.push({
        ...candidate,
        id: candidate.id,
        score: tailScore,
        source: `lane-champion:${lane.lane}`,
        sources: [`lane-champion:${lane.lane}`],
      } as unknown as T);
      perLane[lane.lane] = (perLane[lane.lane] ?? 0) + 1;
      break; // one champion per lane
    }
  }

  if (appended.length === 0) {
    return {
      results: fusedResults,
      backfill: { applied: true, appendedCount: 0, perLane: {} },
    };
  }

  return {
    results: [...fusedResults, ...appended],
    backfill: {
      applied: true,
      appendedCount: appended.length,
      perLane,
    },
  };
}
