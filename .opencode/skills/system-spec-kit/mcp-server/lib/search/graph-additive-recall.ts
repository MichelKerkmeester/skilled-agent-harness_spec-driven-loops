// ───────────────────────────────────────────────────────────────
// MODULE: Graph Additive Recall
// ───────────────────────────────────────────────────────────────
// Feature flag: SPECKIT_TEMPORAL_EDGES (default: enabled / graduated)
//
// The graph edge channel feeds edge-neighbor candidates into the
// competitive weighted-RRF pool, and the degree channel re-ranks on causal-edge
// connectivity. Because those graph-family candidates compete for a truncated
// top-K window, a candidate the graph lane surfaced alone can win a slot and
// evict a lexical or vector hit that was already recalled on its own merit —
// paying nothing back when the edge that surfaced it is low-signal. The graph
// lane then costs recall instead of adding it.
//
// This module restores the additive contract: baseline lexical + vector hits
// keep their EXACT fused order and their top-K slots, and graph-only candidates
// (sourced solely from the graph / degree substrate) are reserved to the tail
// where they extend recall but can never displace a baseline hit. It mirrors
// the window/tail/promotion shape of channel-enforcement.ts — promotions are
// added outside the protected window, never substituted into it.

// ───────────────────────────────────────────────────────────────
// 1. INTERFACES

// ───────────────────────────────────────────────────────────────
/** A fused result item carrying channel-attribution metadata. */
export interface AttributedResult {
  id: number | string;
  score: number;
  source?: string;
  sources?: string[];
  [key: string]: unknown;
}

/** Metadata describing what the additive reorder did. */
export interface GraphAdditiveMetadata {
  /** True when the feature flag was enabled and the reorder was evaluated. */
  applied: boolean;
  /** Graph-only candidates moved out of the protected window into the tail. */
  reservedCount: number;
  /** Baseline candidates whose order and slots were preserved. */
  baselineCount: number;
}

/** Return value of applyGraphAdditiveRecall(). Preserves the caller's element type. */
export interface GraphAdditiveResult<T extends AttributedResult> {
  results: T[];
  graphAdditive: GraphAdditiveMetadata;
}

// ───────────────────────────────────────────────────────────────
// 2. MAIN EXPORT

// ───────────────────────────────────────────────────────────────
/**
 * Resolve the channel-attribution sources for a fused result, preferring the
 * explicit `sources` array and falling back to the single `source` field.
 */
function resolveSources(result: AttributedResult): string[] {
  const sourceList = (result as { sources?: unknown }).sources;
  if (Array.isArray(sourceList)) {
    const sources = sourceList.filter((value): value is string => typeof value === 'string');
    if (sources.length > 0) {
      return sources;
    }
  }
  return typeof result.source === 'string' && result.source.length > 0
    ? [result.source]
    : [];
}

// Channels derived purely from the causal-edge graph substrate. Neither carries
// an independent lexical or vector recall signal: `graph` is the edge-neighbor
// traversal channel and `degree` re-ranks on causal-edge connectivity. A
// candidate sourced only from these was surfaced by the graph lane alone.
const GRAPH_FAMILY_SOURCES = new Set(['graph', 'degree']);

/**
 * A candidate is graph-only when every channel that surfaced it belongs to the
 * graph family (graph / degree). Multi-source candidates that any baseline
 * lexical or vector channel also surfaced (vector, fts, bm25, keyword, …)
 * earned their position on independent recall signal, so they stay
 * baseline-protected and keep their slot.
 */
function isGraphOnly(result: AttributedResult): boolean {
  const sources = resolveSources(result);
  return sources.length > 0 && sources.every((source) => GRAPH_FAMILY_SOURCES.has(source));
}

/**
 * Reorder fused results so graph-only candidates are additive: baseline hits
 * keep their exact incoming order, and graph-only candidates are reserved to
 * the tail. A graph-only candidate can therefore never evict a baseline hit
 * from the top-K window — the graph lane can only extend recall, never shrink
 * it.
 *
 * Behaviour:
 *  - `enabled === false` → pass results through unchanged (byte-identical
 *    ordering) with `applied = false`, so the flag-off path is preserved.
 *  - `enabled === true` → stable-partition into baseline (any non-graph
 *    attribution present) and graph-only candidates, then concatenate
 *    `[...baseline, ...graphOnly]`. Both partitions preserve their incoming
 *    relative order.
 *
 * No scores are mutated and no candidates are dropped — only graph-only
 * candidates are deferred past the baseline so downstream truncation cannot
 * trade a recalled baseline hit for a graph-only one.
 *
 * @param fusedResults - Post-fusion, post-enforcement results in fused order.
 * @param enabled      - Whether the temporal-edges additive path is active.
 * @returns GraphAdditiveResult with the reordered list and metadata.
 */
export function applyGraphAdditiveRecall<T extends AttributedResult>(
  fusedResults: T[],
  enabled: boolean,
): GraphAdditiveResult<T> {
  if (!enabled) {
    return {
      results: fusedResults,
      graphAdditive: {
        applied: false,
        reservedCount: 0,
        baselineCount: fusedResults.length,
      },
    };
  }

  const baseline: T[] = [];
  const graphOnly: T[] = [];

  for (const result of fusedResults) {
    if (isGraphOnly(result)) {
      graphOnly.push(result);
    } else {
      baseline.push(result);
    }
  }

  // Nothing graph-only to reserve — leave the list untouched so the active
  // path is also a no-op when the graph lane contributed no isolated hit.
  if (graphOnly.length === 0) {
    return {
      results: fusedResults,
      graphAdditive: {
        applied: true,
        reservedCount: 0,
        baselineCount: baseline.length,
      },
    };
  }

  return {
    results: [...baseline, ...graphOnly],
    graphAdditive: {
      applied: true,
      reservedCount: graphOnly.length,
      baselineCount: baseline.length,
    },
  };
}
