// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Deltas Projection Contract
// ───────────────────────────────────────────────────────────────────

import {
  DeepReviewWireEventTypes,
} from '../deep-review-ledger-schema/index.js';
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

// Negative-control hook for the projection contract's fan-out proof:
// when false, every delta-bearing event collapses into a single iter-001
// artifact instead of partitioning into one file per iteration. Left true
// in production; flipped to false only by the negative-control run to
// prove the fan-out assertion can go red.
const PARTITION_BY_ITERATION = true;

export interface DeepReviewDeltasProjectionState extends JsonObject {
  readonly rows: readonly JsonObject[];
}

export interface CreateDeepReviewDeltasProjectionContractOptions {
  readonly ledgerId?: string;
  readonly streamIds?: readonly string[];
  readonly baseSha?: string;
}

// The stems that carry per-iteration finding and evidence content. Each
// produces a type:'finding' delta row the legacy reducer's buildRegistry
// consumes via deltaRecordToFinding. Non-delta stems are ignored so each
// iteration file contains only its iteration's finding rows.
const DELTA_BEARING_STEMS = Object.freeze(new Set([
  'deep_review.finding_candidate_emitted',
  'deep_review.evidence_observed',
  'deep_review.claim_adjudication_recorded',
  'deep_review.finding_state_changed',
]));

// ───────────────────────────────────────────────────────────────────
// 2. ITERATION EXTRACTION
// ───────────────────────────────────────────────────────────────────

// The delta-bearing stems carry the iteration as a string identifier in
// scope.iterationId. The per-file naming contract (iter-NNN.jsonl) and the
// consumer's run field both require a number, so the numeric portion is
// extracted. data.passNumber is a fallback for stems that carry the pass
// number in data rather than scope.
function extractIterationNumber(
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
): number | null {
  const raw = scope.iterationId;
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string') {
    const match = raw.match(/(\d+)/);
    if (match) return Number(match[1]);
  }
  if (typeof data.passNumber === 'number' && Number.isFinite(data.passNumber)) {
    return data.passNumber;
  }
  return null;
}

// ───────────────────────────────────────────────────────────────────
// 3. ROW BUILDERS
// ───────────────────────────────────────────────────────────────────

// Each delta-bearing stem maps to a type:'finding' row in the exact shape
// the legacy reducer's deltaRecordToFinding reads. Rows without a severity
// (candidate and evidence rows) are valid JSONL but are silently dropped
// by the consumer; rows with finalSeverity (adjudication and state-change)
// are the ones that populate the finding registry.
function buildDeltaRow(
  stem: string,
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  iteration: number,
  occurredAt: string,
): JsonObject {
  const base: JsonObject = {
    type: 'finding',
    iteration,
    timestamp: occurredAt,
  };

  if (stem === 'deep_review.finding_candidate_emitted') {
    return Object.freeze({
      ...base,
      id: typeof scope.candidateId === 'string' ? scope.candidateId : '',
      findingClass: typeof data.findingClass === 'string' ? data.findingClass : '',
      status: 'candidate',
      title: '',
      evidenceRefs: Array.isArray(data.evidenceRefs) ? data.evidenceRefs : [],
      content_hash: typeof data.claimTextDigest === 'string' ? data.claimTextDigest : '',
    });
  }

  if (stem === 'deep_review.evidence_observed') {
    return Object.freeze({
      ...base,
      id: typeof scope.candidateId === 'string' ? scope.candidateId : '',
      status: 'evidence-observed',
      title: '',
      evidenceType: typeof data.observationKind === 'string' ? data.observationKind : '',
      content_hash: typeof data.rawResultDigest === 'string' ? data.rawResultDigest : '',
    });
  }

  if (stem === 'deep_review.claim_adjudication_recorded') {
    const severity = typeof data.finalSeverity === 'string' ? data.finalSeverity : '';
    return Object.freeze({
      ...base,
      id: typeof scope.findingId === 'string' ? scope.findingId : '',
      severity,
      finalSeverity: severity,
      status: typeof data.adjudicationOutcome === 'string' ? data.adjudicationOutcome : '',
      findingClass: '',
      title: '',
      claim: typeof data.transition === 'string' ? data.transition : '',
      content_hash: typeof data.claimDigest === 'string' ? data.claimDigest : '',
    });
  }

  // deep_review.finding_state_changed
  const severity = typeof data.currentSeverity === 'string' ? data.currentSeverity : '';
  return Object.freeze({
    ...base,
    id: typeof scope.findingId === 'string' ? scope.findingId : '',
    severity,
    finalSeverity: severity,
    status: typeof data.currentState === 'string' ? data.currentState : '',
    findingClass: '',
    title: '',
    claim: typeof data.changeReason === 'string' ? data.changeReason : '',
    content_hash: typeof data.adjudicationPayloadDigest === 'string' ? data.adjudicationPayloadDigest : '',
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
): LegacyProjectionContract<DeepReviewDeltasProjectionState> {
  const padded = String(iteration).padStart(3, '0');
  return {
    artifactId: `review-deltas:iter-${padded}`,
    censusSurfaceId: 'review-deltas',
    ledgerId,
    streamIds,
    relativePath: `review/deltas/iter-${padded}.jsonl`,
    format: 'jsonl',
    refreshBoundary: 'event',
    foldId,
    reducerId: 'legacy-deep-review-deltas-reducer',
    projectionVersion: 'legacy-review-deltas@1',
    reducerVersion: 'deep-review-deltas-reducer@1',
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
      state: Readonly<DeepReviewDeltasProjectionState>,
      event: Readonly<EventReadResult>,
    ): DeepReviewDeltasProjectionState {
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
      const eventIteration = extractIterationNumber(scope, data);
      // When filterIteration is null (collapsed mode), accept all
      // delta-bearing events into the single artifact. Otherwise only
      // accept events belonging to this artifact's iteration.
      if (filterIteration !== null && eventIteration !== filterIteration) {
        return state;
      }
      const effectiveIteration = eventIteration ?? iteration;
      const row = buildDeltaRow(stem, scope, data, effectiveIteration, envelope.occurred_at);
      return { rows: Object.freeze([...state.rows, Object.freeze(row)]) };
    },
    serialize(state: Readonly<DeepReviewDeltasProjectionState>): Uint8Array {
      return serializeLegacyJsonl(state.rows);
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. SURFACE CONTRACT FACTORY
// ───────────────────────────────────────────────────────────────────

/** Build a projection surface that fans deep-review ledger events out into one per-iteration delta file. */
export function createDeepReviewDeltasProjectionContract(
  options?: CreateDeepReviewDeltasProjectionContractOptions,
): LegacyProjectionSurfaceContract {
  const manifestEntry = requireProjectableManifestEntry('review-deltas');
  const ledgerId = options?.ledgerId ?? 'deep-review-ledger';
  const streamIds = options?.streamIds ?? Object.freeze([ledgerId]);
  const baseSha = options?.baseSha ?? '0'.repeat(40);
  const baseBytes = serializeLegacyJsonl([]);

  const acceptedEventVersions: Record<string, readonly number[]> = {};
  for (const wireType of Object.values(DeepReviewWireEventTypes)) {
    acceptedEventVersions[wireType] = Object.freeze([1]);
  }
  const frozenAccepted = Object.freeze(acceptedEventVersions);

  const foldId = manifestEntry.foldId ?? 'legacy-review-deltas-fold@1';
  const serializerId = manifestEntry.serializerId ?? 'legacy-jsonl-row-v1';
  const legacyWriter = manifestEntry.legacyWriter;
  const readers = manifestEntry.readers;

  return {
    surfaceId: 'review-deltas',
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
        const data = (payload.data && typeof payload.data === 'object')
          ? (payload.data as Record<string, unknown>)
          : {};
        const iter = extractIterationNumber(scope, data);
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
