// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Projections Projection Contract
// ───────────────────────────────────────────────────────────────────

import {
  DeepReviewWireEventTypes,
} from '../deep-review-ledger-schema/index.js';
import {
  legacyProjectionDigest,
  serializeLegacyJson,
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
// 1. PREMISE CHECK — only the findings registry is ledger-foldable
// ───────────────────────────────────────────────────────────────────

// The review-projections census surface is mixed:
//   deep-review-findings-registry.json, deep-review-dashboard.md,
//   review-report.md
// Only the findings registry is a structured ledger fold: the
// finding_candidate_emitted, evidence_observed, evidence_reconciled,
// claim_adjudication_recorded, and finding_lineage_recorded stems carry
// the finding, evidence, adjudication, and lineage records that populate
// it. The dashboard and review-report.md are authored prose whose
// narrative framing the ledger does not carry as bytes — the ledger
// records digests, identifiers, and scalar scores, not the markdown
// prose a human author composes around them. Projecting fabricated prose
// would be dishonest, so this contract folds only the findings registry
// and omits the two prose artifacts, recording the gap rather than
// inventing bytes. This mirrors the council config-state contract's
// omission of ai-council-config.json.

// ───────────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────────

// Negative-control hook for the projection contract's findings-registry
// proof: when false, finding_candidate_emitted collapses to no finding
// rows so the registry's findings array is empty instead of carrying the
// emitted candidates. Left true in production; flipped to false only by
// the negative-control run to prove the findings assertion can go red.
const EMIT_FINDINGS = true;

export interface DeepReviewProjectionsProjectionState extends JsonObject {
  readonly findings: readonly JsonObject[];
  readonly evidence: readonly JsonObject[];
  readonly adjudications: readonly JsonObject[];
  readonly lineage: readonly JsonObject[];
}

export interface CreateDeepReviewProjectionsProjectionContractOptions {
  readonly ledgerId?: string;
  readonly streamIds?: readonly string[];
  readonly baseSha?: string;
}

// The stems that carry the structured records the findings registry
// holds. Every other review stem (run lifecycle, scope, dimension pass,
// convergence, synthesis, continuity) produces prose or scalar state the
// registry does not carry — only these five feed the registry's arrays.
const REGISTRY_BEARING_STEMS = Object.freeze(new Set([
  'deep_review.finding_candidate_emitted',
  'deep_review.evidence_observed',
  'deep_review.evidence_reconciled',
  'deep_review.claim_adjudication_recorded',
  'deep_review.finding_lineage_recorded',
]));

// ───────────────────────────────────────────────────────────────────
// 3. RECORD BUILDERS
// ───────────────────────────────────────────────────────────────────

// Each builder maps one ledger event to the registry row shape, populating
// only the fields the ledger carries. Fields the ledger does not carry
// (e.g. a human-authored summary) are omitted rather than fabricated.

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function asStringArray(value: unknown): readonly string[] {
  return Array.isArray(value)
    ? Object.freeze(value.filter((v): v is string => typeof v === 'string'))
    : Object.freeze([]);
}

function buildFindingRecord(
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string,
): JsonObject {
  return Object.freeze({
    candidateId: asString(scope.candidateId),
    dimensionId: asString(scope.dimensionId),
    findingClass: asString(data.findingClass),
    claimTextDigest: asString(data.claimTextDigest),
    evidenceRefs: asStringArray(data.evidenceRefs),
    targetRefs: asStringArray(data.targetRefs),
    impact: asNumber(data.impact),
    rawConfidence: asNumber(data.rawConfidence),
    reachability: asNumber(data.reachability),
    exploitability: asNumber(data.exploitability),
    evidenceType: asString(data.evidenceType),
    evidenceScope: asString(data.evidenceScope),
    rawObservationDigest: asString(data.rawObservationDigest),
    sourcePassEventId: asString(data.sourcePassEventId),
    producerEventTimestamp: occurredAt,
  });
}

function buildEvidenceRecord(
  stem: string,
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string,
): JsonObject {
  // evidence_observed carries supersedesEvidenceEventId: null (a fresh
  // observation); evidence_reconciled carries a non-null predecessor and
  // a reconciliationOutcome. Both populate the same registry row shape so
  // the registry's evidence array holds every observation in arrival
  // order, with the reconciliation fields left empty for fresh
  // observations rather than fabricated.
  const isReconciled = stem === 'deep_review.evidence_reconciled';
  return Object.freeze({
    evidenceId: asString(scope.evidenceId),
    candidateId: asString(scope.candidateId),
    dimensionId: asString(scope.dimensionId),
    observationKind: asString(data.observationKind),
    rawResultDigest: asString(data.rawResultDigest),
    sourceDigest: asString(data.sourceDigest),
    contentDigest: asString(data.contentDigest),
    independentEvidenceClass: asString(data.independentEvidenceClass),
    causalProximityStatus: asString(data.causalProximityStatus),
    stabilityStatus: asString(data.stabilityStatus),
    relevanceStatus: asString(data.relevanceStatus),
    supersedesEvidenceEventId: isReconciled
      ? asString(data.supersedesEvidenceEventId)
      : '',
    reconciliationOutcome: isReconciled
      ? asString(data.reconciliationOutcome)
      : '',
    producerEventTimestamp: occurredAt,
  });
}

function buildAdjudicationRecord(
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string,
): JsonObject {
  return Object.freeze({
    findingId: asString(scope.findingId),
    candidateId: asString(scope.candidateId),
    dimensionId: asString(scope.dimensionId),
    claimDigest: asString(data.claimDigest),
    evidenceRefs: asStringArray(data.evidenceRefs),
    finalSeverity: asString(data.finalSeverity),
    impact: asNumber(data.impact),
    confidence: asNumber(data.confidence),
    adjudicationOutcome: asString(data.adjudicationOutcome),
    transition: asString(data.transition),
    downgradeTrigger: asString(data.downgradeTrigger),
    predecessorAdjudicationEventId: asString(data.predecessorAdjudicationEventId),
    producerEventTimestamp: occurredAt,
  });
}

function buildLineageRecord(
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string,
): JsonObject {
  return Object.freeze({
    findingId: asString(scope.findingId),
    dimensionId: asString(scope.dimensionId),
    lineageRelation: asString(data.lineageRelation),
    baselineStatus: asString(data.baselineStatus),
    predecessorEventRef: asString(data.predecessorEventRef),
    producerEventTimestamp: occurredAt,
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. ARTIFACT FACTORY
// ───────────────────────────────────────────────────────────────────

function buildFindingsRegistryArtifact(
  foldId: string,
  serializerId: string,
  legacyWriter: string,
  readers: readonly string[],
  ledgerId: string,
  streamIds: readonly string[],
  baseSha: string,
  baseBytes: Uint8Array,
  acceptedEventVersions: Readonly<Record<string, readonly number[]>>,
): LegacyProjectionContract<DeepReviewProjectionsProjectionState> {
  const emptyState = Object.freeze({
    findings: Object.freeze([]),
    evidence: Object.freeze([]),
    adjudications: Object.freeze([]),
    lineage: Object.freeze([]),
  });
  return {
    artifactId: 'review-projections:findings-registry',
    censusSurfaceId: 'review-projections',
    ledgerId,
    streamIds,
    relativePath: 'review/deep-review-findings-registry.json',
    format: 'json',
    refreshBoundary: 'lifecycle',
    foldId,
    reducerId: 'legacy-deep-review-projections-reducer',
    projectionVersion: 'legacy-review-projections@1',
    reducerVersion: 'deep-review-projections-reducer@1',
    serializerId,
    legacyWriter,
    readers,
    base: {
      baseSha,
      baseDigest: legacyProjectionDigest(baseBytes),
      bytes: baseBytes,
      state: emptyState,
      ledgerHead: Object.freeze({
        ledgerId,
        sequence: 0,
        recordHash: '0'.repeat(64),
      }),
    },
    acceptedEventVersions,
    reduce(
      state: Readonly<DeepReviewProjectionsProjectionState>,
      event: Readonly<EventReadResult>,
    ): DeepReviewProjectionsProjectionState {
      const envelope = event.effective.envelope;
      const payload = envelope.payload as Record<string, unknown> | undefined;
      if (!payload || typeof payload !== 'object') {
        return state;
      }
      const stem = typeof payload.stem === 'string' ? payload.stem : null;
      if (!stem || !REGISTRY_BEARING_STEMS.has(stem)) {
        return state;
      }
      const scope = (payload.scope && typeof payload.scope === 'object')
        ? (payload.scope as Record<string, unknown>)
        : {};
      const data = (payload.data && typeof payload.data === 'object')
        ? (payload.data as Record<string, unknown>)
        : {};
      const occurredAt = envelope.occurred_at;
      if (stem === 'deep_review.finding_candidate_emitted') {
        // The negative-control hook suppresses the findings array: when
        // false, candidate emissions produce no rows so the registry's
        // findings array stays empty and the load-bearing assertion goes
        // red instead of silently passing on a degenerate fold.
        if (!EMIT_FINDINGS) {
          return state;
        }
        return {
          ...state,
          findings: Object.freeze([...state.findings, Object.freeze(buildFindingRecord(scope, data, occurredAt))]),
        };
      }
      if (stem === 'deep_review.evidence_observed'
        || stem === 'deep_review.evidence_reconciled') {
        return {
          ...state,
          evidence: Object.freeze([...state.evidence, Object.freeze(buildEvidenceRecord(stem, scope, data, occurredAt))]),
        };
      }
      if (stem === 'deep_review.claim_adjudication_recorded') {
        return {
          ...state,
          adjudications: Object.freeze([...state.adjudications, Object.freeze(buildAdjudicationRecord(scope, data, occurredAt))]),
        };
      }
      if (stem === 'deep_review.finding_lineage_recorded') {
        return {
          ...state,
          lineage: Object.freeze([...state.lineage, Object.freeze(buildLineageRecord(scope, data, occurredAt))]),
        };
      }
      return state;
    },
    serialize(state: Readonly<DeepReviewProjectionsProjectionState>): Uint8Array {
      return serializeLegacyJson({
        findings: state.findings,
        evidence: state.evidence,
        adjudications: state.adjudications,
        lineage: state.lineage,
      } as unknown as JsonObject);
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. SURFACE CONTRACT FACTORY
// ───────────────────────────────────────────────────────────────────

/** Build a projection surface that folds deep-review ledger events into the ledger-derivable findings registry. */
export function createDeepReviewProjectionsProjectionContract(
  options?: CreateDeepReviewProjectionsProjectionContractOptions,
): LegacyProjectionSurfaceContract {
  const manifestEntry = requireProjectableManifestEntry('review-projections');
  const ledgerId = options?.ledgerId ?? 'deep-review-ledger';
  const streamIds = options?.streamIds ?? Object.freeze([ledgerId]);
  const baseSha = options?.baseSha ?? '0'.repeat(40);
  const baseBytes = serializeLegacyJson({
    findings: [],
    evidence: [],
    adjudications: [],
    lineage: [],
  } as unknown as JsonObject);

  const acceptedEventVersions: Record<string, readonly number[]> = {};
  for (const wireType of Object.values(DeepReviewWireEventTypes)) {
    acceptedEventVersions[wireType] = Object.freeze([1]);
  }
  const frozenAccepted = Object.freeze(acceptedEventVersions);

  const foldId = manifestEntry.foldId ?? 'legacy-review-projections-fold@1';
  const serializerId = manifestEntry.serializerId ?? 'legacy-pretty-json-v1';
  const legacyWriter = manifestEntry.legacyWriter;
  const readers = manifestEntry.readers;

  return {
    surfaceId: 'review-projections',
    ledgerId,
    buildArtifacts(_events: readonly EventReadResult[]): readonly LegacyProjectionContract<any>[] {
      // The findings registry is a single lifecycle-replacement JSON
      // artifact; the two prose files in the mixed surface are omitted
      // (see the premise check above), so the surface projects exactly
      // one artifact regardless of the event stream.
      return [buildFindingsRegistryArtifact(
        foldId, serializerId, legacyWriter, readers,
        ledgerId, streamIds, baseSha, baseBytes, frozenAccepted,
      )];
    },
  };
}
