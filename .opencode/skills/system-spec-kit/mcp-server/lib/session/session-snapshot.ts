// ───────────────────────────────────────────────────────────────
// MODULE: Session Snapshot
// ───────────────────────────────────────────────────────────────
// Lightweight read-only snapshot of session state.
// Aggregates metrics and priming status into a single object for
// buildServerInstructions() and agent bootstrap.

import { getSessionMetrics, computeQualityScore, getLastToolCallAt } from './context-metrics.js';
import { isSessionPrimed, getLastActiveSessionId } from '../../hooks/memory-surface.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

export interface SessionSnapshot {
  specFolder: string | null;
  currentTask: string | null;
  sessionQuality: 'healthy' | 'degraded' | 'critical' | 'unknown';
  lastToolCallAgoMs: number | null;
  primed: boolean;
  routingRecommendation: string;
}

/* ───────────────────────────────────────────────────────────────
   2. PUBLIC API
──────────────────────────────────────────────────────────────── */

/** Build a read-only snapshot of the current session state. */
export function getSessionSnapshot(): SessionSnapshot {
  const now = Date.now();

  // Metrics (safe — in-memory only)
  let specFolder: string | null = null;
  let currentTask: string | null = null;
  try {
    const metrics = getSessionMetrics() as ReturnType<typeof getSessionMetrics> & {
      currentTask?: unknown;
    };
    specFolder = metrics.currentSpecFolder;
    if (typeof metrics.currentTask === 'string' || metrics.currentTask === null) {
      currentTask = metrics.currentTask;
    }
  } catch { /* metrics unavailable */ }

  // Quality score
  let sessionQuality: SessionSnapshot['sessionQuality'] = 'unknown';
  try {
    const qs = computeQualityScore();
    sessionQuality = qs.level;
  } catch { /* unknown */ }

  // Last tool call
  let lastToolCallAgoMs: number | null = null;
  try {
    const last = getLastToolCallAt();
    if (last !== null) lastToolCallAgoMs = now - last;
  } catch { /* null */ }

  // Priming status
  let primed = false;
  try {
    const primingSessionId = getLastActiveSessionId();
    primed = primingSessionId ? isSessionPrimed(primingSessionId) : false;
  } catch { /* not primed */ }

  // Structural lookups once routed to a graph index; text search is now the
  // only retrieval surface, so the recommendation no longer branches.
  const routingRecommendation = 'exact text/regex → Grep';

  return {
    specFolder,
    currentTask,
    sessionQuality,
    lastToolCallAgoMs,
    primed,
    routingRecommendation,
  };
}
