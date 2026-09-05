// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Projections Projection Contract
// ───────────────────────────────────────────────────────────────────

import {
  DeepResearchWireEventTypes,
} from '../deep-research-ledger-schema/index.js';
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
  LegacyProjectionJsonObject,
  LegacyProjectionSurfaceContract,
} from './legacy-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. PREMISE CHECK — only the findings registry is ledger-foldable
// ───────────────────────────────────────────────────────────────────

// The research-projections census surface is mixed:
//   deep-research-findings-registry.json, deep-research-dashboard.md,
//   research.md, resource-map.md
// Only the findings registry is a structured ledger fold: the
// source_captured, evidence_admission_decided, claim_asserted,
// claim_relation_recorded, and claim_superseded stems carry the
// source, evidence, claim, and supersession records that populate it.
// The dashboard, research.md, and resource-map.md are authored prose
// whose narrative framing the ledger does not carry as bytes — the
// ledger records digests and identifiers, not the markdown prose a
// human author composes around them. Projecting fabricated prose
// would be dishonest, so this contract folds only the findings
// registry and omits the three prose artifacts, recording the gap
// rather than inventing bytes. This mirrors the council config-state
// contract's omission of ai-council-config.json.

// ───────────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────────

// Negative-control hook for the projection contract's findings-registry
// proof: when false, claim_asserted and claim_relation_recorded collapse
// to no claim rows so the registry's claims array is empty instead of
// carrying the asserted claims. Left true in production; flipped to false
// only by the negative-control run to prove the claims assertion can go
// red.
const EMIT_CLAIMS = true;

export interface DeepResearchProjectionsProjectionState extends LegacyProjectionJsonObject {
  readonly sources: readonly JsonObject[];
  readonly evidence: readonly LegacyProjectionJsonObject[];
  readonly claims: readonly LegacyProjectionJsonObject[];
  readonly supersessions: readonly LegacyProjectionJsonObject[];
}

export interface CreateDeepResearchProjectionsProjectionContractOptions {
  readonly ledgerId?: string;
  readonly streamIds?: readonly string[];
  readonly baseSha?: string;
}

// The stems that carry the structured records the findings registry
// holds. Every other research stem (run lifecycle, iteration, gap,
// convergence, synthesis) produces prose or scalar state that the
// registry does not carry — only these five feed the registry's four
// arrays.
const REGISTRY_BEARING_STEMS = Object.freeze(new Set([
  'deep_research.source_captured',
  'deep_research.evidence_admission_decided',
  'deep_research.claim_asserted',
  'deep_research.claim_relation_recorded',
  'deep_research.claim_superseded',
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

function iterationFrom(scope: Record<string, unknown>): number {
  const raw = scope.iteration;
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) return raw;
  if (typeof raw === 'string') {
    const match = raw.match(/(\d+)/);
    if (match) return Number(match[1]);
  }
  return 0;
}

function buildSourceRecord(
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string,
): JsonObject {
  return Object.freeze({
    iteration: iterationFrom(scope),
    sourceVersionId: asString(scope.sourceVersionId),
    sourceIdentityDigest: asString(data.sourceIdentityDigest),
    contentDigest: asString(data.contentDigest),
    mediaType: asString(data.mediaType),
    retrievalReceiptRef: asString(data.retrievalReceiptRef),
    instructionScanResult: asString(data.instructionScanResult),
    capturedAt: asString(data.capturedAt),
    producerEventTimestamp: occurredAt,
  });
}

function buildEvidenceRecord(
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string,
): LegacyProjectionJsonObject {
  return Object.freeze({
    iteration: iterationFrom(scope),
    sourceVersionId: asString(scope.sourceVersionId),
    evidenceId: asString(scope.evidenceId),
    disposition: asString(data.disposition),
    atomicClaimRefs: asStringArray(data.atomicClaimRefs),
    derivativeSourceGroup: asString(data.derivativeSourceGroup),
    admissionPolicyVersion: asString(data.admissionPolicyVersion),
    contaminationStatus: asString(data.contaminationStatus),
    reasonCode: asString(data.reasonCode),
    producerEventTimestamp: occurredAt,
  });
}

function buildClaimRecord(
  stem: string,
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string,
): LegacyProjectionJsonObject {
  // claim_asserted carries no relatedClaimVersionId and asserts the
  // 'asserts' relation; claim_relation_recorded carries an explicit
  // relatedClaimVersionId and relation. Both populate the same registry
  // row shape so the registry's claims array holds every asserted and
  // related claim in arrival order.
  const relation = stem === 'deep_research.claim_asserted'
    ? 'asserts'
    : asString(data.relation);
  return Object.freeze({
    iteration: iterationFrom(scope),
    claimVersionId: asString(scope.claimVersionId),
    claimId: asString(data.claimId),
    relatedClaimVersionId: stem === 'deep_research.claim_asserted'
      ? ''
      : asString(data.relatedClaimVersionId),
    relation,
    normalizedClaimDigest: asString(data.normalizedClaimDigest),
    evidenceIds: asStringArray(data.evidenceIds),
    independenceGroup: asString(data.independenceGroup),
    rawConfidence: asNumber(data.rawConfidence),
    claimStatus: asString(data.claimStatus),
    producerEventTimestamp: occurredAt,
  });
}

function buildSupersessionRecord(
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string,
): LegacyProjectionJsonObject {
  return Object.freeze({
    iteration: iterationFrom(scope),
    priorClaimVersionId: asString(data.priorClaimVersionId),
    successorClaimVersionId: asString(data.successorClaimVersionId),
    supersessionReason: asString(data.supersessionReason),
    effectiveAt: asString(data.effectiveAt),
    replacementEvidenceIds: asStringArray(data.replacementEvidenceIds),
    invalidationScope: asString(data.invalidationScope),
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
): LegacyProjectionContract<DeepResearchProjectionsProjectionState> {
  const emptyState = Object.freeze({
    sources: Object.freeze([]),
    evidence: Object.freeze([]),
    claims: Object.freeze([]),
    supersessions: Object.freeze([]),
  });
  return {
    artifactId: 'research-projections:findings-registry',
    censusSurfaceId: 'research-projections',
    ledgerId,
    streamIds,
    relativePath: 'research/deep-research-findings-registry.json',
    format: 'json',
    refreshBoundary: 'lifecycle',
    foldId,
    reducerId: 'legacy-deep-research-projections-reducer',
    projectionVersion: 'legacy-research-projections@1',
    reducerVersion: 'deep-research-projections-reducer@1',
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
      state: Readonly<DeepResearchProjectionsProjectionState>,
      event: Readonly<EventReadResult>,
    ): DeepResearchProjectionsProjectionState {
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
      if (stem === 'deep_research.source_captured') {
        return {
          ...state,
          sources: Object.freeze([...state.sources, Object.freeze(buildSourceRecord(scope, data, occurredAt))]),
        };
      }
      if (stem === 'deep_research.evidence_admission_decided') {
        return {
          ...state,
          evidence: Object.freeze([...state.evidence, Object.freeze(buildEvidenceRecord(scope, data, occurredAt))]),
        };
      }
      if (stem === 'deep_research.claim_asserted'
        || stem === 'deep_research.claim_relation_recorded') {
        // The negative-control hook suppresses the claims array: when
        // false, claim-bearing events produce no rows so the registry's
        // claims array stays empty and the load-bearing assertion goes
        // red instead of silently passing on a degenerate fold.
        if (!EMIT_CLAIMS) {
          return state;
        }
        return {
          ...state,
          claims: Object.freeze([...state.claims, Object.freeze(buildClaimRecord(stem, scope, data, occurredAt))]),
        };
      }
      if (stem === 'deep_research.claim_superseded') {
        return {
          ...state,
          supersessions: Object.freeze([...state.supersessions, Object.freeze(buildSupersessionRecord(scope, data, occurredAt))]),
        };
      }
      return state;
    },
    serialize(state: Readonly<DeepResearchProjectionsProjectionState>): Uint8Array {
      return serializeLegacyJson({
        sources: state.sources,
        evidence: state.evidence,
        claims: state.claims,
        supersessions: state.supersessions,
      } as unknown as JsonObject);
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. SURFACE CONTRACT FACTORY
// ───────────────────────────────────────────────────────────────────

/** Build a projection surface that folds deep-research ledger events into the ledger-derivable findings registry. */
export function createDeepResearchProjectionsProjectionContract(
  options?: CreateDeepResearchProjectionsProjectionContractOptions,
): LegacyProjectionSurfaceContract {
  const manifestEntry = requireProjectableManifestEntry('research-projections');
  const ledgerId = options?.ledgerId ?? 'deep-research-ledger';
  const streamIds = options?.streamIds ?? Object.freeze([ledgerId]);
  const baseSha = options?.baseSha ?? '0'.repeat(40);
  const baseBytes = serializeLegacyJson({
    sources: [],
    evidence: [],
    claims: [],
    supersessions: [],
  } as unknown as JsonObject);

  const acceptedEventVersions: Record<string, readonly number[]> = {};
  for (const wireType of Object.values(DeepResearchWireEventTypes)) {
    acceptedEventVersions[wireType] = Object.freeze([1]);
  }
  const frozenAccepted = Object.freeze(acceptedEventVersions);

  const foldId = manifestEntry.foldId ?? 'legacy-research-projections-fold@1';
  const serializerId = manifestEntry.serializerId ?? 'legacy-pretty-json-v1';
  const legacyWriter = manifestEntry.legacyWriter;
  const readers = manifestEntry.readers;

  return {
    surfaceId: 'research-projections',
    ledgerId,
    buildArtifacts(_events: readonly EventReadResult[]): readonly LegacyProjectionContract<any>[] {
      // The findings registry is a single lifecycle-replacement JSON
      // artifact; the three prose files in the mixed surface are omitted
      // (see the premise check above), so the surface projects exactly
      // one artifact regardless of the event stream.
      return [buildFindingsRegistryArtifact(
        foldId, serializerId, legacyWriter, readers,
        ledgerId, streamIds, baseSha, baseBytes, frozenAccepted,
      )];
    },
  };
}
