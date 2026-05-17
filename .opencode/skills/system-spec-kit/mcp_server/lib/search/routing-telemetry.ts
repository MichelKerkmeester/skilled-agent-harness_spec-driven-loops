// ───────────────────────────────────────────────────────────────
// MODULE: Routing Telemetry
// ───────────────────────────────────────────────────────────────
// In-process rolling 200-decision window of channel selection per routing decision.
// Surfaces graphChannelInvocationRate (and per-channel rates) for memory_health
// (REQ-004). Pure in-memory state — no persistence, resets on process restart.

// Feature catalog: Query complexity router

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS & STATE
----------------------------------------------------------------*/

// SOURCE OF TRUTH: ../search/query-router.ts:35 (kept duplicated to avoid circular import).
type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';

const ALL_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;
const WINDOW_SIZE = 200;

const recentDecisions: ChannelName[][] = [];

/* ───────────────────────────────────────────────────────────────
   2. RECORDING
----------------------------------------------------------------*/

/**
 * Record one routing decision. Channels list is the final selectedChannels
 * after any preservation overrides and contributes to the rolling
 * 200-decision window.
 */
function recordInvocation(channels: readonly ChannelName[]): void {
  // Defensive copy — upstream query-router enforceMinimumChannels dedups.
  const snapshot = [...channels] as ChannelName[];
  recentDecisions.push(snapshot);
  while (recentDecisions.length > WINDOW_SIZE) {
    recentDecisions.shift();
  }
}

/* ───────────────────────────────────────────────────────────────
   3. SNAPSHOT
----------------------------------------------------------------*/

interface RoutingTelemetrySnapshot {
  totalRecorded: number;
  windowSize: number;
  channelInvocationCounts: Record<ChannelName, number>;
  channelInvocationRates: Record<ChannelName, number>;
  graphChannelInvocationRate: number;
}

/**
 * Return a new snapshot object for the current routing telemetry window.
 *
 * Fields include the number of recorded routing decisions, configured rolling
 * window size, per-channel invocation counts, per-channel invocation rates, and
 * the graph-channel invocation rate alias used by memory health. Counts and
 * rates use the current rolling 200-decision window as the denominator, not
 * process lifetime. `channelInvocationRates[channel]` is rounded to three
 * decimals from `channelInvocationCounts[channel] / totalRecorded`; when no
 * decisions are recorded, all rates are 0.
 *
 * A fresh snapshot object is allocated on every call. Callers should not mutate
 * the result expecting persistence across future snapshots.
 */
function getSnapshot(): RoutingTelemetrySnapshot {
  const counts: Record<ChannelName, number> = {
    vector: 0, fts: 0, bm25: 0, graph: 0, degree: 0,
  };
  for (const decision of recentDecisions) {
    for (const channel of decision) {
      counts[channel] += 1;
    }
  }
  const total = recentDecisions.length;
  const rates: Record<ChannelName, number> = {
    vector: 0, fts: 0, bm25: 0, graph: 0, degree: 0,
  };
  if (total > 0) {
    for (const channel of ALL_CHANNELS) {
      rates[channel] = Math.round((counts[channel] / total) * 1000) / 1000;
    }
  }
  return {
    totalRecorded: total,
    windowSize: WINDOW_SIZE,
    channelInvocationCounts: counts,
    channelInvocationRates: rates,
    graphChannelInvocationRate: rates.graph,
  };
}

/** Test-only / restart-equivalent reset. */
function resetRoutingTelemetry(): void {
  recentDecisions.length = 0;
}

/* ───────────────────────────────────────────────────────────────
   4. EXPORTS
----------------------------------------------------------------*/

export {
  recordInvocation,
  getSnapshot,
  resetRoutingTelemetry,
  WINDOW_SIZE,
  type ChannelName,
  type RoutingTelemetrySnapshot,
};
