// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment State+Deltas Projection Contract
// ───────────────────────────────────────────────────────────────────

import {
  DeepAlignmentWireEventTypes,
} from '../deep-alignment-ledger-schema/index.js';
import {
  legacyProjectionDigest,
  serializeLegacyJsonl,
} from './legacy-projection-fold.js';
import { requireProjectableManifestEntry } from './legacy-projection-manifest.js';

import type {
  EventReadResult,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  LegacyProjectionContract,
  LegacyProjectionSurfaceContract,
} from './legacy-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

// Negative-control hook for the projection surface's fan-out proof:
// when false, every delta-bearing event collapses into a single iter-001
// artifact instead of partitioning into one file per iteration, so the
// per-iteration delta count assertion can be shown to go red. Left true
// in production; flipped to false only by the negative-control run.
const PARTITION_DELTAS_BY_ITERATION = true;

export interface DeepAlignmentStateDeltasProjectionState extends JsonObject {
  readonly rows: readonly JsonObject[];
}

export interface CreateDeepAlignmentStateDeltasProjectionContractOptions {
  readonly ledgerId?: string;
  readonly streamIds?: readonly string[];
  readonly baseSha?: string;
}

// Stems that carry run/iteration lifecycle and produce the config,
// iteration, and event rows the alignment reducer parses off the state
// file. The iteration row (lane_completed) is what the reducer's
// buildLaneEntry filters by laneId and credits findings against; the
// config and event rows preserve the legacy state-log vocabulary the
// reducer's iterationRecords stream already speaks.
const STATE_BEARING_STEMS = Object.freeze(new Set([
  'deep_alignment.run_initialized',
  'deep_alignment.run_resumed',
  'deep_alignment.run_restarted',
  'deep_alignment.lane_completed',
  'deep_alignment.convergence_evaluated',
  'deep_alignment.graph_convergence_evaluated',
  'deep_alignment.blocked_stop_recorded',
  'deep_alignment.synthesis_started',
  'deep_alignment.review_report_committed',
  'deep_alignment.run_completed',
]));

// Stems that carry per-iteration adjudicated findings and produce the
// type:'finding' delta rows the reducer's loadDeltaPayloads reads. Each
// finding row wraps the adapter-shaped finding object under a `finding`
// key with a P0/P1/P2 severity, which is the exact shape buildLaneEntry
// unwraps via record.finding before counting it into the registry.
const DELTA_BEARING_STEMS = Object.freeze(new Set([
  'deep_alignment.claim_adjudication_recorded',
]));

// ───────────────────────────────────────────────────────────────────
// 2. ITERATION EXTRACTION
// ───────────────────────────────────────────────────────────────────

// The lifecycle and finding stems carry the iteration as a string
// identifier in scope.iterationId. The per-file naming contract
// (iter-NNN.jsonl) and the reducer's run/iteration fields both require a
// number, so the numeric portion is extracted.
function extractIterationNumber(
  scope: Record<string, unknown>,
): number | null {
  const raw = scope.iterationId;
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string') {
    const match = raw.match(/(\d+)/);
    if (match) return Number(match[1]);
  }
  return null;
}

// ───────────────────────────────────────────────────────────────────
// 3. STATE ROW BUILDER
// ───────────────────────────────────────────────────────────────────

// Maps each state-bearing stem to the row vocabulary the alignment
// reducer's state-log parser consumes: config (run_initialized),
// iteration (lane_completed), and event rows for the remaining
// lifecycle stems. The iteration row carries laneId so buildLaneEntry
// can filter it per lane and credit delta findings against it.
function buildStateRow(
  stem: string,
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string,
): JsonObject | null {
  if (stem === 'deep_alignment.run_initialized') {
    return Object.freeze({
      type: 'config',
      topic: typeof scope.runId === 'string' ? scope.runId : 'deep-alignment',
      maxIterations: typeof data.maxIterations === 'number' ? data.maxIterations : 0,
      generation: typeof scope.generation === 'number' ? scope.generation : 1,
      timestamp: occurredAt,
    });
  }

  if (stem === 'deep_alignment.run_resumed') {
    return Object.freeze({
      type: 'event',
      event: 'resumed',
      sessionId: typeof scope.runId === 'string' ? scope.runId : '',
      parentSessionId: typeof data.sourceSessionId === 'string' ? data.sourceSessionId : '',
      generation: typeof scope.generation === 'number' ? scope.generation : 1,
      reason: typeof data.resumeReason === 'string' ? data.resumeReason : 'resumed',
      timestamp: occurredAt,
    });
  }

  if (stem === 'deep_alignment.run_restarted') {
    return Object.freeze({
      type: 'event',
      event: 'restarted',
      sessionId: typeof scope.runId === 'string' ? scope.runId : '',
      parentSessionId: typeof data.archivedLineageId === 'string' ? data.archivedLineageId : '',
      generation: typeof scope.generation === 'number' ? scope.generation : 1,
      reason: typeof data.restartReason === 'string' ? data.restartReason : 'restarted',
      timestamp: occurredAt,
    });
  }

  if (stem === 'deep_alignment.lane_completed') {
    const iter = extractIterationNumber(scope);
    return Object.freeze({
      type: 'iteration',
      laneId: typeof scope.laneId === 'string' ? scope.laneId : '',
      iteration: iter ?? 0,
      run: iter ?? 0,
      status: typeof data.status === 'string' ? data.status : 'incomplete',
      timestamp: occurredAt,
    });
  }

  if (stem === 'deep_alignment.convergence_evaluated') {
    const iter = extractIterationNumber(scope);
    return Object.freeze({
      type: 'event',
      event: 'graph_convergence',
      iteration: iter ?? 0,
      run: iter ?? 0,
      decision: typeof data.decision === 'string' ? data.decision : 'continue',
      timestamp: occurredAt,
    });
  }

  if (stem === 'deep_alignment.graph_convergence_evaluated') {
    const iter = extractIterationNumber(scope);
    return Object.freeze({
      type: 'event',
      event: 'graph_convergence',
      iteration: iter ?? 0,
      run: iter ?? 0,
      decision: typeof data.graphDecision === 'string' ? data.graphDecision
        : (typeof data.decision === 'string' ? data.decision : 'continue'),
      timestamp: occurredAt,
    });
  }

  if (stem === 'deep_alignment.blocked_stop_recorded') {
    const iter = extractIterationNumber(scope);
    return Object.freeze({
      type: 'event',
      event: 'blocked_stop',
      iteration: iter ?? 0,
      run: iter ?? 0,
      blockedBy: Array.isArray(data.blockedGateIds) ? data.blockedGateIds : [],
      stopReason: typeof data.recoveryStrategy === 'string' ? data.recoveryStrategy : 'blocked',
      recoveryStrategy: typeof data.recoveryStrategy === 'string' ? data.recoveryStrategy : '',
      timestamp: occurredAt,
    });
  }

  if (stem === 'deep_alignment.synthesis_started') {
    return Object.freeze({
      type: 'event',
      event: 'synthesis_started',
      timestamp: occurredAt,
    });
  }

  if (stem === 'deep_alignment.review_report_committed') {
    return Object.freeze({
      type: 'event',
      event: 'synthesis_complete',
      timestamp: occurredAt,
    });
  }

  // deep_alignment.run_completed
  return Object.freeze({
    type: 'event',
    event: 'run_completed',
    terminalStatus: typeof data.terminalStatus === 'string' ? data.terminalStatus : 'completed',
    timestamp: occurredAt,
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. DELTA ROW BUILDER
// ───────────────────────────────────────────────────────────────────

// Wraps the adjudicated finding in the exact shape the reducer's
// buildLaneEntry unwraps: a type:'finding' row carrying laneId (so it
// filters per lane) and a nested `finding` object whose severity the
// registry counts. contentHash gives a stable dedup key across
// iterations so a re-adjudicated finding counts once.
function buildDeltaRow(
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  iteration: number,
  occurredAt: string,
): JsonObject {
  const severity = typeof data.finalSeverity === 'string' ? data.finalSeverity : '';
  return Object.freeze({
    type: 'finding',
    laneId: typeof scope.laneId === 'string' ? scope.laneId : '',
    iteration,
    finding: Object.freeze({
      severity,
      type: 'conformance',
      message: typeof data.transition === 'string' ? data.transition : '',
      findingId: typeof scope.findingId === 'string' ? scope.findingId : '',
      outcome: typeof data.outcome === 'string' ? data.outcome : '',
      contentHash: typeof data.adjudicationDigest === 'string' ? data.adjudicationDigest : '',
    }),
    timestamp: occurredAt,
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. STATE ARTIFACT FACTORY
// ───────────────────────────────────────────────────────────────────

function buildStateArtifact(
  foldId: string,
  serializerId: string,
  legacyWriter: string,
  readers: readonly string[],
  ledgerId: string,
  streamIds: readonly string[],
  baseSha: string,
  baseBytes: Uint8Array,
  acceptedEventVersions: Readonly<Record<string, readonly number[]>>,
): LegacyProjectionContract<DeepAlignmentStateDeltasProjectionState> {
  return {
    artifactId: 'alignment-state',
    censusSurfaceId: 'alignment-state-deltas',
    ledgerId,
    streamIds,
    relativePath: 'alignment/deep-alignment-state.jsonl',
    format: 'jsonl',
    refreshBoundary: 'event',
    foldId,
    reducerId: 'legacy-deep-alignment-state-reducer',
    projectionVersion: 'legacy-alignment-state@1',
    reducerVersion: 'deep-alignment-state-reducer@1',
    serializerId,
    legacyWriter,
    readers,
    base: {
      baseSha,
      baseDigest: legacyProjectionDigest(baseBytes),
      bytes: baseBytes,
      state: Object.freeze({ rows: Object.freeze([]) }),
      ledgerHead: Object.freeze({
        ledgerId,
        sequence: 0,
        recordHash: '0'.repeat(64),
      }),
    },
    acceptedEventVersions,
    reduce(
      state: Readonly<DeepAlignmentStateDeltasProjectionState>,
      event: Readonly<EventReadResult>,
    ): DeepAlignmentStateDeltasProjectionState {
      const envelope = event.effective.envelope;
      const payload = envelope.payload as Record<string, unknown> | undefined;
      if (!payload || typeof payload !== 'object') {
        return state;
      }
      const stem = typeof payload.stem === 'string' ? payload.stem : null;
      if (!stem || !STATE_BEARING_STEMS.has(stem)) {
        return state;
      }
      const scope = (payload.scope && typeof payload.scope === 'object')
        ? (payload.scope as Record<string, unknown>)
        : {};
      const data = (payload.data && typeof payload.data === 'object')
        ? (payload.data as Record<string, unknown>)
        : {};
      const row = buildStateRow(stem, scope, data, envelope.occurred_at);
      if (row === null) {
        return state;
      }
      return { rows: Object.freeze([...state.rows, Object.freeze(row)]) };
    },
    serialize(state: Readonly<DeepAlignmentStateDeltasProjectionState>): Uint8Array {
      return serializeLegacyJsonl(state.rows);
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 6. DELTA ARTIFACT FACTORY
// ───────────────────────────────────────────────────────────────────

function buildDeltaArtifact(
  iteration: number,
  filterIteration: number | null,
  foldId: string,
  serializerId: string,
  legacyWriter: string,
  readers: readonly string[],
  ledgerId: string,
  streamIds: readonly string[],
  baseSha: string,
  baseBytes: Uint8Array,
  acceptedEventVersions: Readonly<Record<string, readonly number[]>>,
): LegacyProjectionContract<DeepAlignmentStateDeltasProjectionState> {
  const padded = String(iteration).padStart(3, '0');
  return {
    artifactId: `alignment-deltas:iter-${padded}`,
    censusSurfaceId: 'alignment-state-deltas',
    ledgerId,
    streamIds,
    relativePath: `alignment/deltas/iter-${padded}.jsonl`,
    format: 'jsonl',
    refreshBoundary: 'event',
    foldId,
    reducerId: 'legacy-deep-alignment-deltas-reducer',
    projectionVersion: 'legacy-alignment-deltas@1',
    reducerVersion: 'deep-alignment-deltas-reducer@1',
    serializerId,
    legacyWriter,
    readers,
    base: {
      baseSha,
      baseDigest: legacyProjectionDigest(baseBytes),
      bytes: baseBytes,
      state: Object.freeze({ rows: Object.freeze([]) }),
      ledgerHead: Object.freeze({
        ledgerId,
        sequence: 0,
        recordHash: '0'.repeat(64),
      }),
    },
    acceptedEventVersions,
    reduce(
      state: Readonly<DeepAlignmentStateDeltasProjectionState>,
      event: Readonly<EventReadResult>,
    ): DeepAlignmentStateDeltasProjectionState {
      const envelope = event.effective.envelope;
      const payload = envelope.payload as Record<string, unknown> | undefined;
      if (!payload || typeof payload !== 'object') {
        return state;
      }
      const stem = typeof payload.stem === 'string' ? payload.stem : null;
      if (!stem || !DELTA_BEARING_STEMS.has(stem)) {
        return state;
      }
      const scope = (payload.scope && typeof payload.scope === 'object')
        ? (payload.scope as Record<string, unknown>)
        : {};
      const data = (payload.data && typeof payload.data === 'object')
        ? (payload.data as Record<string, unknown>)
        : {};
      const eventIteration = extractIterationNumber(scope);
      // When filterIteration is null (collapsed mode), accept all
      // delta-bearing events into the single artifact. Otherwise only
      // accept events belonging to this artifact's iteration.
      if (filterIteration !== null && eventIteration !== filterIteration) {
        return state;
      }
      const effectiveIteration = eventIteration ?? iteration;
      const row = buildDeltaRow(scope, data, effectiveIteration, envelope.occurred_at);
      return { rows: Object.freeze([...state.rows, Object.freeze(row)]) };
    },
    serialize(state: Readonly<DeepAlignmentStateDeltasProjectionState>): Uint8Array {
      return serializeLegacyJsonl(state.rows);
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 7. SURFACE CONTRACT FACTORY
// ───────────────────────────────────────────────────────────────────

/** Build a projection surface that folds deep-alignment ledger events into one state file plus one per-iteration delta file. */
export function createDeepAlignmentStateDeltasProjectionContract(
  options?: CreateDeepAlignmentStateDeltasProjectionContractOptions,
): LegacyProjectionSurfaceContract {
  const manifestEntry = requireProjectableManifestEntry('alignment-state-deltas');
  const ledgerId = options?.ledgerId ?? 'deep-alignment-ledger';
  const streamIds = options?.streamIds ?? Object.freeze([ledgerId]);
  const baseSha = options?.baseSha ?? '0'.repeat(40);
  const baseBytes = serializeLegacyJsonl([]);

  const acceptedEventVersions: Record<string, readonly number[]> = {};
  for (const wireType of Object.values(DeepAlignmentWireEventTypes)) {
    acceptedEventVersions[wireType] = Object.freeze([1]);
  }
  const frozenAccepted = Object.freeze(acceptedEventVersions);

  const foldId = manifestEntry.foldId ?? 'legacy-alignment-state-deltas-fold@1';
  const serializerId = manifestEntry.serializerId ?? 'legacy-jsonl-row-v1';
  const legacyWriter = manifestEntry.legacyWriter;
  const readers = manifestEntry.readers;

  return {
    surfaceId: 'alignment-state-deltas',
    ledgerId,
    buildArtifacts(events: readonly EventReadResult[]): readonly LegacyProjectionContract<any>[] {
      const stateArtifact = buildStateArtifact(
        foldId, serializerId, legacyWriter, readers,
        ledgerId, streamIds, baseSha, baseBytes, frozenAccepted,
      );

      if (!PARTITION_DELTAS_BY_ITERATION) {
        return [
          stateArtifact,
          buildDeltaArtifact(
            1, null,
            foldId, serializerId, legacyWriter, readers,
            ledgerId, streamIds, baseSha, baseBytes, frozenAccepted,
          ),
        ];
      }

      const iterations = new Set<number>();
      for (const event of events) {
        const payload = event.effective.envelope.payload as Record<string, unknown> | undefined;
        if (!payload || typeof payload !== 'object') continue;
        const stem = typeof payload.stem === 'string' ? payload.stem : null;
        if (!stem || !DELTA_BEARING_STEMS.has(stem)) continue;
        const scope = (payload.scope && typeof payload.scope === 'object')
          ? (payload.scope as Record<string, unknown>)
          : {};
        const iter = extractIterationNumber(scope);
        if (iter !== null) iterations.add(iter);
      }
      const deltaArtifacts = [...iterations].sort((a, b) => a - b).map((iter) =>
        buildDeltaArtifact(
          iter, iter,
          foldId, serializerId, legacyWriter, readers,
          ledgerId, streamIds, baseSha, baseBytes, frozenAccepted,
        ),
      );
      return [stateArtifact, ...deltaArtifacts];
    },
  };
}
