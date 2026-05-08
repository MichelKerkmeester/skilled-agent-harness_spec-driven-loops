// ───────────────────────────────────────────────────────────────
// MODULE: Routing Telemetry
// ───────────────────────────────────────────────────────────────
// In-process rolling counter of channel selection per routing decision.
// Surfaces graphChannelInvocationRate (and per-channel rates) for memory_health
// (REQ-004). Pure in-memory state — no persistence, resets on process restart.

// Feature catalog: Causal graph channel routing utilization

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS & STATE
----------------------------------------------------------------*/

type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';

const ALL_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;
const WINDOW_SIZE = 200;

const recentDecisions: ChannelName[][] = [];

/* ───────────────────────────────────────────────────────────────
   2. RECORDING
----------------------------------------------------------------*/

/**
 * Record one routing decision. Channels list is the final selectedChannels
 * after any preservation overrides.
 */
function recordInvocation(channels: readonly ChannelName[]): void {
  // Defensive copy + dedupe — preserves behavior when callers pass shared refs.
  const snapshot = [...new Set(channels)] as ChannelName[];
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
