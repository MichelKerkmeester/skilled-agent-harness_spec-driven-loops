// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Deltas Projection Contract
// ───────────────────────────────────────────────────────────────────

import {
  DeepResearchWireEventTypes,
} from '../deep-research-ledger-schema/index.js';
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
  LegacyProjectionJsonObject,
  LegacyProjectionSurfaceContract,
} from './legacy-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

// Negative-control hook for the projection contract's fan-out proof:
// when false, every delta-bearing event collapses into a single iter-001
// artifact instead of partitioning into one file per iteration. Left true
// in production; flipped to false only by the negative-control run to
// prove the fan-out assertion can go red.
const PARTITION_BY_ITERATION = true;

export interface DeepResearchDeltasProjectionState extends LegacyProjectionJsonObject {
  readonly rows: readonly JsonObject[];
}

export interface CreateDeepResearchDeltasProjectionContractOptions {
  readonly ledgerId?: string;
  readonly streamIds?: readonly string[];
  readonly baseSha?: string;
}

// The iteration-completed stem is the only stem that carries a complete
// per-iteration delta row. The legacy upcaster maps a legacy type:'iteration'
// record to this stem, and the real consumer (verify-iteration) requires at
// least one type:'iteration' record per delta file. Other iteration-scoped
// stems (started, gap_detected, convergence) do not produce delta rows —
// the legacy delta files carry only completed-iteration records.
const DELTA_BEARING_STEMS = Object.freeze(new Set([
  'deep_research.iteration_completed',
]));

// ───────────────────────────────────────────────────────────────────
// 2. ITERATION EXTRACTION
// ───────────────────────────────────────────────────────────────────

// The iteration-completed stem carries the iteration as a positive integer
// in scope.iteration. The per-file naming contract (iter-NNN.jsonl) and the
// consumer's iteration match both require this number.
function extractIterationNumber(
  scope: Record<string, unknown>,
): number | null {
  const raw = scope.iteration;
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) return raw;
  if (typeof raw === 'string') {
    const match = raw.match(/(\d+)/);
    if (match) return Number(match[1]);
  }
  return null;
}

// ───────────────────────────────────────────────────────────────────
// 3. ROW BUILDER
// ───────────────────────────────────────────────────────────────────

// Each iteration-completed event maps to a type:'iteration' row in the exact
// shape the legacy upcaster reverses and the real consumer (verify-iteration)
// reads. Only ledger-derivable fields are populated; fields lost during upcast
// (e.g. findingsCount) are omitted rather than fabricated. The consumer
// requires only type:'iteration' to accept the file; the remaining fields
// preserve the legacy row shape for any future reader without inventing data.
function buildDeltaRow(
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  iteration: number,
  occurredAt: string,
): JsonObject {
  return Object.freeze({
    type: 'iteration',
    schemaVersion: 1,
    sessionId: typeof scope.runId === 'string' ? scope.runId : '',
    parentSessionId: typeof scope.lineageId === 'string' ? scope.lineageId : '',
    run: iteration,
    status: typeof data.status === 'string' ? data.status : 'complete',
    newInfoRatio: typeof data.rawNewInfoRatio === 'number'
      ? data.rawNewInfoRatio
      : 0,
    timestamp: occurredAt,
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. ARTIFACT FACTORY
// ───────────────────────────────────────────────────────────────────

function buildIterationArtifact(
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
): LegacyProjectionContract<DeepResearchDeltasProjectionState> {
  const padded = String(iteration).padStart(3, '0');
  return {
    artifactId: `research-deltas:iter-${padded}`,
    censusSurfaceId: 'research-deltas',
    ledgerId,
    streamIds,
    relativePath: `research/deltas/iter-${padded}.jsonl`,
    format: 'jsonl',
    refreshBoundary: 'event',
    foldId,
    reducerId: 'legacy-deep-research-deltas-reducer',
    projectionVersion: 'legacy-research-deltas@1',
    reducerVersion: 'deep-research-deltas-reducer@1',
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
      state: Readonly<DeepResearchDeltasProjectionState>,
      event: Readonly<EventReadResult>,
    ): DeepResearchDeltasProjectionState {
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
    serialize(state: Readonly<DeepResearchDeltasProjectionState>): Uint8Array {
      return serializeLegacyJsonl(state.rows);
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. SURFACE CONTRACT FACTORY
// ───────────────────────────────────────────────────────────────────

/** Build a projection surface that fans deep-research ledger events out into one per-iteration delta file. */
export function createDeepResearchDeltasProjectionContract(
  options?: CreateDeepResearchDeltasProjectionContractOptions,
): LegacyProjectionSurfaceContract {
  const manifestEntry = requireProjectableManifestEntry('research-deltas');
  const ledgerId = options?.ledgerId ?? 'deep-research-ledger';
  const streamIds = options?.streamIds ?? Object.freeze([ledgerId]);
  const baseSha = options?.baseSha ?? '0'.repeat(40);
  const baseBytes = serializeLegacyJsonl([]);

  const acceptedEventVersions: Record<string, readonly number[]> = {};
  for (const wireType of Object.values(DeepResearchWireEventTypes)) {
    acceptedEventVersions[wireType] = Object.freeze([1]);
  }
  const frozenAccepted = Object.freeze(acceptedEventVersions);

  const foldId = manifestEntry.foldId ?? 'legacy-research-deltas-fold@1';
  const serializerId = manifestEntry.serializerId ?? 'legacy-jsonl-row-v1';
  const legacyWriter = manifestEntry.legacyWriter;
  const readers = manifestEntry.readers;

  return {
    surfaceId: 'research-deltas',
    ledgerId,
    buildArtifacts(events: readonly EventReadResult[]): readonly LegacyProjectionContract<any>[] {
      if (!PARTITION_BY_ITERATION) {
        return [buildIterationArtifact(
          1, null,
          foldId, serializerId, legacyWriter, readers,
          ledgerId, streamIds, baseSha, baseBytes, frozenAccepted,
        )];
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
      return [...iterations].sort((a, b) => a - b).map((iter) =>
        buildIterationArtifact(
          iter, iter,
          foldId, serializerId, legacyWriter, readers,
          ledgerId, streamIds, baseSha, baseBytes, frozenAccepted,
        ),
      );
    },
  };
}
