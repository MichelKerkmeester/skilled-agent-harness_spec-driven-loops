// ───────────────────────────────────────────────────────────────────
// MODULE: Cycle Observation Projector
// ───────────────────────────────────────────────────────────────────

import {
  CLAIM_CONTINUITY_PROJECTION_SCHEMA_VERSION,
  CLAIM_CONTINUITY_REDUCER_VERSION,
  CLAIM_CONTINUITY_SCHEMA_VERSION,
  ClaimEpistemicStatuses,
  ClaimLifecycleStates,
  claimProjectionDigest,
} from '../claim-continuity/index.js';
import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import { immutableJsonClone } from '../event-envelope/canonical-json.js';
import {
  ContinuityIdentityKinds,
  continuityDigest,
  validateIdentityRef,
} from '../deep-loop/continuity-identity/index.js';
import {
  NEXT_FOCUS_SCORING_POLICY_VERSION,
  validateNextFocusCandidate,
} from '../next-focus/index.js';
import {
  CYCLE_BLOCKER_REDUCER_VERSION,
  CYCLE_COVERAGE_REDUCER_VERSION,
  CYCLE_DETECTOR_POLICY_VERSION,
  CYCLE_OBSERVATION_SCHEMA_VERSION,
  CYCLE_PROGRESS_SIGNAL_VERSION,
  assertCycleDetectorPolicy,
  resolveCycleDetectorPolicy,
} from './cycle-detection-policy.js';
import {
  CycleClaimChangeKinds,
  CycleDetectionError,
  CycleDetectionErrorCodes,
} from './cycle-detection-types.js';

import type {
  ClaimContinuityRecord,
  ClaimRelationshipRecord,
} from '../claim-continuity/index.js';
import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  ContinuityIdentityRef,
} from '../deep-loop/continuity-identity/index.js';
import type {
  NextFocusSelectedDecision,
  ScoredNextFocusCandidate,
} from '../next-focus/index.js';
import type {
  CompleteCycleProgressVector,
  CycleBlockerSnapshot,
  CycleClaimChange,
  CycleClaimFrontierSignaturePayload,
  CycleCompositeSignaturePayload,
  CycleContradictionIdentity,
  CycleCoverageSnapshot,
  CycleDetectorPolicy,
  CycleFocusFrontierIdentity,
  CycleFocusSignaturePayload,
  CycleIndependentEvidenceRef,
  CycleObservation,
  CycleProgressVector,
  CycleSignature,
  MissingCycleProgressVector,
  ProjectCycleObservationInput,
} from './cycle-detection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. VALIDATION HELPERS
// ───────────────────────────────────────────────────────────────────

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,511}$/;
const LIFECYCLE_STATES = new Set<string>(Object.values(ClaimLifecycleStates));
const EPISTEMIC_STATUSES = new Set<string>(Object.values(ClaimEpistemicStatuses));

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function requireIdentity(value: unknown, field: string): string {
  if (typeof value !== 'string' || !ID_PATTERN.test(value)) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_INPUT,
      `${field} must be a bounded stable identity`,
      { field },
    );
  }
  return value;
}

function requireHash(value: unknown, field: string): string {
  if (typeof value !== 'string' || !HASH_PATTERN.test(value)) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_INPUT,
      `${field} must be a lowercase SHA-256 digest`,
      { field },
    );
  }
  return value;
}

function requireBps(value: unknown, field: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0 || (value as number) > 10_000) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_INPUT,
      `${field} must be an integer from zero through ten thousand`,
      { field },
    );
  }
  return value as number;
}

function sortedUniqueIdentities(values: readonly string[], field: string): string[] {
  if (!Array.isArray(values)) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_INPUT,
      `${field} must be an array`,
      { field },
    );
  }
  const sorted = values.map((value) => requireIdentity(value, field)).sort(compareCodeUnits);
  if (new Set(sorted).size !== sorted.length) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_INPUT,
      `${field} must not contain duplicate identities`,
      { field },
    );
  }
  return sorted;
}

function sameCanonical(left: unknown, right: unknown): boolean {
  return canonicalJson(left) === canonicalJson(right);
}

function assertExactKeys(
  value: Readonly<Record<string, unknown>>,
  expected: readonly string[],
  field: string,
): void {
  const actual = Object.keys(value).sort(compareCodeUnits);
  const required = [...expected].sort(compareCodeUnits);
  if (!sameCanonical(actual, required)) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
      `${field} does not match its closed canonical schema`,
      { field },
    );
  }
}

function fingerprint(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function signature<TPayload extends JsonObject>(
  payload: TPayload,
): CycleSignature<TPayload> {
  const immutablePayload = immutableJsonClone(payload);
  return Object.freeze({
    payload: immutablePayload,
    fingerprint: fingerprint(immutablePayload),
  });
}

function progressCore(
  progress: CycleProgressVector,
): Omit<CycleProgressVector, 'progress_fingerprint'> {
  const { progress_fingerprint: ignored, ...core } = progress;
  void ignored;
  return core;
}

function assertWatermark(
  actual: string | null,
  expected: string,
  source: string,
): void {
  if (actual !== null && actual !== expected) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.MIXED_WATERMARK,
      'Cycle observation sources do not share one committed projection watermark',
      { source, expected, actual },
    );
  }
}

function assertRequiredWatermark(
  actual: unknown,
  expected: string,
  source: string,
): void {
  const required = requireIdentity(actual, `${source}.projection_watermark`);
  if (required !== expected) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.MIXED_WATERMARK,
      'Cycle observation sources do not share one committed projection watermark',
      { source, expected, actual: required },
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. SOURCE SNAPSHOT FACTORIES
// ───────────────────────────────────────────────────────────────────

/** Canonicalize a typed coverage summary before it can enter a state signature. */
export function createCycleCoverageSnapshot(
  input: {
    readonly projection_watermark: string;
    readonly reducer_version: string;
    readonly path_coverage_bps: number;
    readonly community_coverage_bps: number;
    readonly covered_path_ids: readonly string[];
    readonly covered_community_ids: readonly string[];
  },
): CycleCoverageSnapshot {
  const core = {
    projection_watermark: requireIdentity(
      input.projection_watermark,
      'coverage.projection_watermark',
    ),
    reducer_version: requireIdentity(input.reducer_version, 'coverage.reducer_version'),
    path_coverage_bps: requireBps(input.path_coverage_bps, 'coverage.path_coverage_bps'),
    community_coverage_bps: requireBps(
      input.community_coverage_bps,
      'coverage.community_coverage_bps',
    ),
    covered_path_ids: sortedUniqueIdentities(input.covered_path_ids, 'coverage.covered_path_ids'),
    covered_community_ids: sortedUniqueIdentities(
      input.covered_community_ids,
      'coverage.covered_community_ids',
    ),
  };
  if (core.reducer_version !== CYCLE_COVERAGE_REDUCER_VERSION) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.UNSUPPORTED_VERSION,
      'Coverage summary reducer version is not registered',
      { reducerVersion: core.reducer_version },
    );
  }
  return immutableJsonClone({
    ...core,
    source_fingerprint: fingerprint(core),
  });
}

/** Canonicalize unresolved blocker identities without presentation labels. */
export function createCycleBlockerSnapshot(
  input: {
    readonly projection_watermark: string;
    readonly reducer_version: string;
    readonly unresolved_blocker_ids: readonly string[];
  },
): CycleBlockerSnapshot {
  const core = {
    projection_watermark: requireIdentity(
      input.projection_watermark,
      'blockers.projection_watermark',
    ),
    reducer_version: requireIdentity(input.reducer_version, 'blockers.reducer_version'),
    unresolved_blocker_ids: sortedUniqueIdentities(
      input.unresolved_blocker_ids,
      'blockers.unresolved_blocker_ids',
    ),
  };
  if (core.reducer_version !== CYCLE_BLOCKER_REDUCER_VERSION) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.UNSUPPORTED_VERSION,
      'Blocker summary reducer version is not registered',
      { reducerVersion: core.reducer_version },
    );
  }
  return immutableJsonClone({
    ...core,
    source_fingerprint: fingerprint(core),
  });
}

function canonicalEvidence(
  values: readonly CycleIndependentEvidenceRef[],
): CycleIndependentEvidenceRef[] {
  const normalized = values.map((value) => ({
    evidence_ref: requireIdentity(value.evidence_ref, 'progress.evidence_ref'),
    independence_key: requireIdentity(value.independence_key, 'progress.independence_key'),
  })).sort((left, right) => (
    compareCodeUnits(left.evidence_ref, right.evidence_ref)
      || compareCodeUnits(left.independence_key, right.independence_key)
  ));
  const keys = normalized.map((value) => `${value.evidence_ref}\u0000${value.independence_key}`);
  if (new Set(keys).size !== keys.length) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_INPUT,
      'Independent evidence entries must be unique',
    );
  }
  return normalized;
}

function canonicalClaimChanges(values: readonly CycleClaimChange[]): CycleClaimChange[] {
  const normalized = values.map((value) => {
    const claimRef = validateIdentityRef(value.claim_ref, ContinuityIdentityKinds.CLAIM);
    if (
      !LIFECYCLE_STATES.has(value.lifecycle_after)
      || !EPISTEMIC_STATUSES.has(value.epistemic_after)
      || (value.lifecycle_before !== null && !LIFECYCLE_STATES.has(value.lifecycle_before))
      || (value.epistemic_before !== null && !EPISTEMIC_STATUSES.has(value.epistemic_before))
    ) {
      throw new CycleDetectionError(
        CycleDetectionErrorCodes.INVALID_INPUT,
        'Claim progress contains an unknown lifecycle or epistemic state',
        { claimId: claimRef.id },
      );
    }
    const isMaterial = value.kind === CycleClaimChangeKinds.MINT
      ? value.lifecycle_before === null && value.epistemic_before === null
      : value.kind === CycleClaimChangeKinds.LIFECYCLE
        ? value.lifecycle_before !== null && value.lifecycle_before !== value.lifecycle_after
        : value.kind === CycleClaimChangeKinds.EPISTEMIC
          && value.epistemic_before !== null
          && value.epistemic_before !== value.epistemic_after;
    if (!isMaterial) {
      throw new CycleDetectionError(
        CycleDetectionErrorCodes.INVALID_INPUT,
        'Claim progress must describe a mint or a material typed transition',
        { claimId: claimRef.id, kind: value.kind },
      );
    }
    return { ...value, claim_ref: claimRef };
  }).sort((left, right) => (
    compareCodeUnits(left.claim_ref.id, right.claim_ref.id)
      || compareCodeUnits(left.kind, right.kind)
  ));
  const keys = normalized.map((value) => `${value.claim_ref.id}\u0000${value.kind}`);
  if (new Set(keys).size !== keys.length) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_INPUT,
      'Claim progress must not repeat one typed transition identity',
    );
  }
  return normalized;
}

/** Build an explicit complete progress vector; empty arrays are observed no-progress data. */
export function createCycleProgressVector(
  input: {
    readonly projection_watermark: string;
    readonly new_independent_evidence: readonly CycleIndependentEvidenceRef[];
    readonly material_claim_changes: readonly CycleClaimChange[];
    readonly resolved_contradiction_ids: readonly string[];
    readonly resolved_blocker_ids: readonly string[];
    readonly path_coverage_bps: number;
    readonly community_coverage_bps: number;
  },
): CompleteCycleProgressVector {
  const core = {
    status: 'complete' as const,
    signal_version: CYCLE_PROGRESS_SIGNAL_VERSION,
    projection_watermark: requireIdentity(
      input.projection_watermark,
      'progress.projection_watermark',
    ),
    new_independent_evidence: canonicalEvidence(input.new_independent_evidence),
    material_claim_changes: canonicalClaimChanges(input.material_claim_changes),
    resolved_contradiction_ids: sortedUniqueIdentities(
      input.resolved_contradiction_ids,
      'progress.resolved_contradiction_ids',
    ),
    resolved_blocker_ids: sortedUniqueIdentities(
      input.resolved_blocker_ids,
      'progress.resolved_blocker_ids',
    ),
    path_coverage_bps: requireBps(input.path_coverage_bps, 'progress.path_coverage_bps'),
    community_coverage_bps: requireBps(
      input.community_coverage_bps,
      'progress.community_coverage_bps',
    ),
  };
  return immutableJsonClone({
    ...core,
    progress_fingerprint: fingerprint(core),
  });
}

/** Represent absent progress data explicitly so it cannot become no-progress evidence. */
export function createMissingCycleProgressVector(
  projectionWatermark: string | null,
  missingFields: readonly string[],
): MissingCycleProgressVector {
  const core = {
    status: 'missing' as const,
    signal_version: CYCLE_PROGRESS_SIGNAL_VERSION,
    projection_watermark: projectionWatermark === null
      ? null
      : requireIdentity(projectionWatermark, 'progress.projection_watermark'),
    missing_fields: sortedUniqueIdentities(missingFields, 'progress.missing_fields'),
  };
  if (core.missing_fields.length === 0) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_INPUT,
      'Missing progress data must name at least one absent field',
    );
  }
  return immutableJsonClone({
    ...core,
    progress_fingerprint: fingerprint(core),
  });
}

/** Verify a stored progress vector before it influences cycle classification. */
export function verifyCycleProgressVector(progress: CycleProgressVector): void {
  if (progress.signal_version !== CYCLE_PROGRESS_SIGNAL_VERSION) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.UNSUPPORTED_VERSION,
      'Progress signal version is not registered',
      { signalVersion: progress.signal_version },
    );
  }
  if (fingerprint(progressCore(progress) as JsonValue) !== progress.progress_fingerprint) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
      'Progress vector fingerprint does not match its canonical fields',
    );
  }
  if (progress.status === 'complete') {
    const rebuilt = createCycleProgressVector(progress);
    if (!sameCanonical(rebuilt, progress)) {
      throw new CycleDetectionError(
        CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
        'Progress vector is not in canonical typed order',
      );
    }
  } else {
    const rebuilt = createMissingCycleProgressVector(
      progress.projection_watermark,
      progress.missing_fields,
    );
    if (!sameCanonical(rebuilt, progress)) {
      throw new CycleDetectionError(
        CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
        'Missing progress vector is not in canonical typed order',
      );
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. TYPED SIGNATURE PROJECTION
// ───────────────────────────────────────────────────────────────────

function recordedCandidateSetFingerprint(
  frontier: readonly ScoredNextFocusCandidate[],
): string {
  return fingerprint(frontier.map((entry) => ({
    rank: entry.rank,
    candidate: entry.candidate,
    coverageGapBps: entry.coverageGapBps,
    contradictionUrgencyBps: entry.contradictionUrgencyBps,
    noveltyDecayBps: entry.noveltyDecayBps,
    scoreBps: entry.scoreBps,
  })));
}

function validateNextFocusDecision(
  decision: NextFocusSelectedDecision,
  input: ProjectCycleObservationInput,
): CycleFocusSignaturePayload {
  const boundary = input.boundary;
  if (
    decision.outcome !== 'next_focus_selected'
    || decision.policyVersion !== NEXT_FOCUS_SCORING_POLICY_VERSION
    || decision.identity.policyVersion !== NEXT_FOCUS_SCORING_POLICY_VERSION
    || decision.identity.runId !== boundary.runLineageId
    || decision.identity.sourceIteration !== boundary.iteration
    || decision.identity.projectionWatermark !== boundary.projectionWatermark
    || decision.sourceSnapshot.projectionWatermark !== boundary.projectionWatermark
    || decision.selectedCandidate.projectionWatermark !== boundary.projectionWatermark
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.MIXED_WATERMARK,
      'Next-focus decision is not bound to the cycle observation boundary',
    );
  }
  const expectedDecisionId = `next-focus-${fingerprint(decision.identity as unknown as JsonValue)}`;
  const expectedSourceFingerprint = fingerprint({
    projectionWatermark: decision.sourceSnapshot.projectionWatermark,
    projectionVersion: decision.sourceSnapshot.projectionVersion,
    evidenceIds: decision.sourceSnapshot.evidenceIds,
  });
  if (
    decision.decisionId !== expectedDecisionId
    || decision.sourceSnapshot.sourceFingerprint !== expectedSourceFingerprint
    || decision.rankedFrontier.length === 0
    || !sameCanonical(decision.selectedCandidate, decision.rankedFrontier[0].candidate)
    || decision.candidateSetFingerprint !== recordedCandidateSetFingerprint(decision.rankedFrontier)
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
      'Next-focus decision does not match its recorded deterministic identity',
      { decisionId: decision.decisionId },
    );
  }
  const typedFrontier: CycleFocusFrontierIdentity[] = decision.rankedFrontier.map(
    (entry, index) => {
      const candidateValidation = validateNextFocusCandidate(entry.candidate);
      if (
        !candidateValidation.valid
        || entry.rank !== index + 1
        || entry.candidate.projectionWatermark !== boundary.projectionWatermark
        || entry.candidate.projectionVersion !== decision.sourceSnapshot.projectionVersion
        || entry.candidate.sourceFingerprint !== decision.sourceSnapshot.sourceFingerprint
      ) {
        throw new CycleDetectionError(
          CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
          'Next-focus frontier candidates must remain valid, contiguous, and watermark-bound',
        );
      }
      return {
        rank: entry.rank,
        candidate_id: requireIdentity(entry.candidate.id, 'candidate.id'),
        region_kind: requireIdentity(entry.candidate.regionKind, 'candidate.regionKind'),
        region_id: requireIdentity(entry.candidate.regionId, 'candidate.regionId'),
      };
    },
  );
  return immutableJsonClone({
    signature_schema_version: CYCLE_OBSERVATION_SCHEMA_VERSION,
    policy_version: NEXT_FOCUS_SCORING_POLICY_VERSION,
    selected_candidate: {
      candidate_id: requireIdentity(decision.selectedCandidate.id, 'selectedCandidate.id'),
      region_kind: requireIdentity(
        decision.selectedCandidate.regionKind,
        'selectedCandidate.regionKind',
      ),
      region_id: requireIdentity(
        decision.selectedCandidate.regionId,
        'selectedCandidate.regionId',
      ),
    },
    typed_candidate_frontier: typedFrontier,
    typed_candidate_set_fingerprint: fingerprint(typedFrontier),
  });
}

function sortedClaimRefs(refs: readonly ContinuityIdentityRef[]): ContinuityIdentityRef[] {
  const validated = refs.map((ref) => validateIdentityRef(ref, ContinuityIdentityKinds.CLAIM));
  validated.sort((left, right) => compareCodeUnits(left.id, right.id));
  if (new Set(validated.map((ref) => ref.id)).size !== validated.length) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_TYPED_IDENTITY,
      'Claim frontier contains duplicate typed claim references',
    );
  }
  return validated;
}

function activeRecord(
  records: Readonly<Record<string, ClaimContinuityRecord>>,
  ref: ContinuityIdentityRef,
): ClaimContinuityRecord {
  const record = records[ref.id];
  if (
    !record
    || record.claim_ref.id !== ref.id
    || record.lifecycle !== ClaimLifecycleStates.ACTIVE
    || !EPISTEMIC_STATUSES.has(record.epistemic_status)
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_TYPED_IDENTITY,
      'Active claim frontier does not match its typed claim projection',
      { claimId: ref.id },
    );
  }
  return record;
}

function contradictionIdentity(
  relationship: ClaimRelationshipRecord,
): CycleContradictionIdentity {
  const left = validateIdentityRef(
    relationship.source_claim_ref,
    ContinuityIdentityKinds.CLAIM,
  );
  const right = validateIdentityRef(
    relationship.target_claim_ref,
    ContinuityIdentityKinds.CLAIM,
  );
  const [first, second] = left.id < right.id ? [left, right] : [right, left];
  return {
    relationship_id: requireIdentity(
      relationship.relationship_id,
      'relationship.relationship_id',
    ),
    left_claim_ref: first,
    right_claim_ref: second,
  };
}

function validateClaimProjection(
  input: ProjectCycleObservationInput,
  policy: CycleDetectorPolicy,
): CycleClaimFrontierSignaturePayload {
  const frontier = input.claimFrontier;
  const state = input.claimState;
  if (
    frontier.schema_version !== CLAIM_CONTINUITY_SCHEMA_VERSION
    || state.schema_version !== CLAIM_CONTINUITY_SCHEMA_VERSION
    || frontier.claim_reducer_version !== CLAIM_CONTINUITY_REDUCER_VERSION
    || state.reducer_version !== CLAIM_CONTINUITY_REDUCER_VERSION
    || frontier.claim_projection_schema_version !== CLAIM_CONTINUITY_PROJECTION_SCHEMA_VERSION
    || frontier.claim_replay_fingerprint.fingerprint_version
      !== policy.source_versions.replay_fingerprint_version
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.UNSUPPORTED_VERSION,
      'Claim continuity projection version is not registered for cycle comparison',
    );
  }
  const { frontier_digest: ignored, ...frontierCore } = frontier;
  void ignored;
  if (
    continuityDigest(frontierCore as JsonObject) !== frontier.frontier_digest
    || claimProjectionDigest(state) !== frontier.claim_projection_digest
    || state.identity_projection_digest !== frontier.identity_projection_digest
    || state.last_applied_ledger_sequence !== frontier.claim_ledger_cursor.sequence
    || frontier.claim_projection_digest !== frontier.claim_replay_fingerprint.projection_digest
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
      'Claim frontier is not bound to the supplied canonical claim projection',
    );
  }
  requireHash(frontier.claim_ledger_cursor.record_hash, 'claim_ledger_cursor.record_hash');
  requireIdentity(frontier.claim_ledger_cursor.ledger_id, 'claim_ledger_cursor.ledger_id');
  requireHash(
    frontier.continuity_identity_frontier_digest,
    'continuity_identity_frontier_digest',
  );
  requireHash(frontier.identity_projection_digest, 'identity_projection_digest');
  requireHash(
    frontier.claim_replay_fingerprint.event_registry_digest,
    'claim_replay_fingerprint.event_registry_digest',
  );
  requireHash(frontier.claim_replay_fingerprint.final_digest, 'claim_replay_fingerprint.final_digest');
  if (
    frontier.claim_replay_fingerprint.run_id !== input.boundary.runLineageId
    || frontier.claim_replay_fingerprint.range_end_sequence
      !== frontier.claim_ledger_cursor.sequence
    || !Number.isSafeInteger(frontier.claim_replay_fingerprint.range_start_sequence)
    || frontier.claim_replay_fingerprint.range_start_sequence < 1
    || frontier.claim_replay_fingerprint.range_start_sequence
      > frontier.claim_replay_fingerprint.range_end_sequence
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
      'Claim replay identity is not bound to the observation lineage and ledger cursor',
    );
  }
  const refs = sortedClaimRefs(frontier.active_claim_refs);
  const projectedActive = Object.values(state.records)
    .filter((record) => record.lifecycle === ClaimLifecycleStates.ACTIVE)
    .map((record) => record.claim_ref);
  if (!sameCanonical(refs, sortedClaimRefs(projectedActive))) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_TYPED_IDENTITY,
      'Claim frontier omits or adds an active typed claim reference',
    );
  }
  const unresolvedMatchIds = sortedUniqueIdentities(
    frontier.unresolved_match_ids,
    'claim_frontier.unresolved_match_ids',
  );
  if (!sameCanonical(unresolvedMatchIds, [...state.unresolved_match_ids].sort(compareCodeUnits))) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
      'Claim frontier unresolved matches differ from the canonical projection',
    );
  }
  const contradictions = Object.values(state.relationships)
    .filter((relationship) => (
      relationship.active && relationship.relationship_kind === 'contradiction'
    ))
    .map(contradictionIdentity)
    .sort((left, right) => compareCodeUnits(left.relationship_id, right.relationship_id));
  return immutableJsonClone({
    signature_schema_version: CYCLE_OBSERVATION_SCHEMA_VERSION,
    claim_reducer_version: CLAIM_CONTINUITY_REDUCER_VERSION,
    claim_projection_schema_version: CLAIM_CONTINUITY_PROJECTION_SCHEMA_VERSION,
    active_claims: refs.map((ref) => {
      const record = activeRecord(state.records, ref);
      return {
        claim_ref: ref,
        lifecycle: record.lifecycle,
        epistemic_status: record.epistemic_status,
      };
    }),
    unresolved_match_ids: unresolvedMatchIds,
    unresolved_contradictions: contradictions,
  });
}

function verifiedCoverage(snapshot: CycleCoverageSnapshot): CycleCoverageSnapshot {
  const rebuilt = createCycleCoverageSnapshot({
    projection_watermark: snapshot.projection_watermark,
    reducer_version: snapshot.reducer_version,
    path_coverage_bps: snapshot.path_coverage_bps,
    community_coverage_bps: snapshot.community_coverage_bps,
    covered_path_ids: snapshot.covered_path_ids,
    covered_community_ids: snapshot.covered_community_ids,
  });
  if (!sameCanonical(rebuilt, snapshot)) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
      'Coverage snapshot does not match its canonical fingerprint',
    );
  }
  return rebuilt;
}

function verifiedBlockers(snapshot: CycleBlockerSnapshot): CycleBlockerSnapshot {
  const rebuilt = createCycleBlockerSnapshot({
    projection_watermark: snapshot.projection_watermark,
    reducer_version: snapshot.reducer_version,
    unresolved_blocker_ids: snapshot.unresolved_blocker_ids,
  });
  if (!sameCanonical(rebuilt, snapshot)) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
      'Blocker snapshot does not match its canonical fingerprint',
    );
  }
  return rebuilt;
}

function assertProgressMatchesProjection(
  progress: CycleProgressVector,
  state: Readonly<ProjectCycleObservationInput['claimState']>,
  coverage: CycleCoverageSnapshot,
  blockers: CycleBlockerSnapshot,
): void {
  if (progress.status === 'missing') return;
  if (
    progress.path_coverage_bps !== coverage.path_coverage_bps
    || progress.community_coverage_bps !== coverage.community_coverage_bps
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
      'Progress coverage values do not match the committed coverage projection',
    );
  }
  for (const change of progress.material_claim_changes) {
    const record = state.records[change.claim_ref.id];
    if (
      !record
      || record.lifecycle !== change.lifecycle_after
      || record.epistemic_status !== change.epistemic_after
    ) {
      throw new CycleDetectionError(
        CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
        'Material claim progress does not match the committed claim projection',
        { claimId: change.claim_ref.id },
      );
    }
  }
  const activeContradictions = new Set(Object.values(state.relationships)
    .filter((relationship) => (
      relationship.active && relationship.relationship_kind === 'contradiction'
    ))
    .map((relationship) => relationship.relationship_id));
  if (progress.resolved_contradiction_ids.some((id) => activeContradictions.has(id))) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
      'Resolved contradiction progress remains active at the committed watermark',
    );
  }
  const unresolvedBlockers = new Set(blockers.unresolved_blocker_ids);
  if (progress.resolved_blocker_ids.some((id) => unresolvedBlockers.has(id))) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
      'Resolved blocker progress remains unresolved at the committed watermark',
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. OBSERVATION PROJECTOR
// ───────────────────────────────────────────────────────────────────

/** Project one canonical semantic observation from one committed source watermark. */
export function projectCycleObservation(
  input: ProjectCycleObservationInput,
): CycleObservation {
  const policy = resolveCycleDetectorPolicy(
    input.detectorPolicyVersion ?? CYCLE_DETECTOR_POLICY_VERSION,
  );
  const boundary = input.boundary;
  requireIdentity(boundary.runLineageId, 'boundary.runLineageId');
  requireIdentity(boundary.projectionWatermark, 'boundary.projectionWatermark');
  requireIdentity(boundary.ledgerCursor.ledger_id, 'boundary.ledgerCursor.ledger_id');
  requireHash(boundary.ledgerCursor.record_hash, 'boundary.ledgerCursor.record_hash');
  if (!Number.isSafeInteger(boundary.iteration) || boundary.iteration <= 0) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_INPUT,
      'Cycle observation iteration must be a positive safe integer',
    );
  }
  if (!Number.isSafeInteger(boundary.ledgerCursor.sequence) || boundary.ledgerCursor.sequence <= 0) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_INPUT,
      'Cycle observation ledger cursor must be a positive safe integer',
    );
  }
  assertRequiredWatermark(
    input.claimProjectionWatermark,
    boundary.projectionWatermark,
    'claim',
  );
  assertWatermark(input.coverage.projection_watermark, boundary.projectionWatermark, 'coverage');
  assertWatermark(input.blockers.projection_watermark, boundary.projectionWatermark, 'blockers');
  assertWatermark(input.progress.projection_watermark, boundary.projectionWatermark, 'progress');
  verifyCycleProgressVector(input.progress);

  const focusPayload = validateNextFocusDecision(input.nextFocusDecision, input);
  const claimPayload = validateClaimProjection(input, policy);
  const coverage = verifiedCoverage(input.coverage);
  const blockers = verifiedBlockers(input.blockers);
  assertProgressMatchesProjection(input.progress, input.claimState, coverage, blockers);
  const focusSignature = signature(focusPayload);
  const claimSignature = signature(claimPayload);
  const compositePayload: CycleCompositeSignaturePayload = immutableJsonClone({
    signature_schema_version: CYCLE_OBSERVATION_SCHEMA_VERSION,
    detector_policy_version: policy.policy_version,
    focus_fingerprint: focusSignature.fingerprint,
    claim_frontier_fingerprint: claimSignature.fingerprint,
    coverage_reducer_version: coverage.reducer_version,
    path_coverage_bps: coverage.path_coverage_bps,
    community_coverage_bps: coverage.community_coverage_bps,
    covered_path_ids: coverage.covered_path_ids,
    covered_community_ids: coverage.covered_community_ids,
    blocker_reducer_version: blockers.reducer_version,
    unresolved_blocker_ids: blockers.unresolved_blocker_ids,
  });
  const compositeSignature = signature(compositePayload);
  const observationId = `cycle-observation-${fingerprint({
    run_lineage_id: boundary.runLineageId,
    iteration: boundary.iteration,
    ledger_cursor: boundary.ledgerCursor,
  })}`;
  const core = {
    schema_version: CYCLE_OBSERVATION_SCHEMA_VERSION,
    observation_id: observationId,
    detector_policy_version: policy.policy_version,
    detector_policy_digest: policy.policy_digest,
    run_lineage_id: boundary.runLineageId,
    iteration: boundary.iteration,
    ledger_cursor: boundary.ledgerCursor,
    projection_watermark: boundary.projectionWatermark,
    focus_signature: focusSignature,
    claim_frontier_signature: claimSignature,
    composite_state_signature: compositeSignature,
    progress: input.progress,
    source_evidence: {
      next_focus_decision_id: input.nextFocusDecision.decisionId,
      next_focus_recorded_candidate_set_fingerprint:
        input.nextFocusDecision.candidateSetFingerprint,
      next_focus_source_fingerprint: input.nextFocusDecision.sourceSnapshot.sourceFingerprint,
      claim_frontier_digest: input.claimFrontier.frontier_digest,
      claim_projection_digest: input.claimFrontier.claim_projection_digest,
      claim_replay_final_digest: input.claimFrontier.claim_replay_fingerprint.final_digest,
      coverage_source_fingerprint: coverage.source_fingerprint,
      blocker_source_fingerprint: blockers.source_fingerprint,
    },
  };
  return immutableJsonClone({
    ...core,
    observation_fingerprint: fingerprint(core),
  }) as CycleObservation;
}

/** Recompute every stored digest before a history reducer compares observations. */
export function verifyCycleObservation(observation: CycleObservation): void {
  const policy = assertCycleDetectorPolicy(
    observation.detector_policy_version,
    observation.detector_policy_digest,
  );
  if (observation.schema_version !== policy.observation_schema_version) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.UNSUPPORTED_VERSION,
      'Cycle observation schema version is not registered',
      { schemaVersion: observation.schema_version },
    );
  }
  assertExactKeys(observation, [
    'schema_version',
    'observation_id',
    'detector_policy_version',
    'detector_policy_digest',
    'run_lineage_id',
    'iteration',
    'ledger_cursor',
    'projection_watermark',
    'focus_signature',
    'claim_frontier_signature',
    'composite_state_signature',
    'progress',
    'source_evidence',
    'observation_fingerprint',
  ], 'observation');
  assertExactKeys(observation.ledger_cursor, [
    'ledger_id',
    'sequence',
    'record_hash',
  ], 'observation.ledger_cursor');
  requireIdentity(observation.run_lineage_id, 'observation.run_lineage_id');
  requireIdentity(observation.projection_watermark, 'observation.projection_watermark');
  requireIdentity(observation.ledger_cursor.ledger_id, 'observation.ledger_cursor.ledger_id');
  requireHash(observation.ledger_cursor.record_hash, 'observation.ledger_cursor.record_hash');
  if (
    !Number.isSafeInteger(observation.iteration)
    || observation.iteration <= 0
    || !Number.isSafeInteger(observation.ledger_cursor.sequence)
    || observation.ledger_cursor.sequence <= 0
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_INPUT,
      'Stored cycle observation has an invalid iteration or ledger cursor',
    );
  }
  const expectedObservationId = `cycle-observation-${fingerprint({
    run_lineage_id: observation.run_lineage_id,
    iteration: observation.iteration,
    ledger_cursor: observation.ledger_cursor,
  })}`;
  if (observation.observation_id !== expectedObservationId) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
      'Stored cycle observation identity does not match its boundary',
    );
  }
  verifyCycleProgressVector(observation.progress);
  assertWatermark(
    observation.progress.projection_watermark,
    observation.projection_watermark,
    'stored-progress',
  );
  assertExactKeys(observation.focus_signature, ['payload', 'fingerprint'], 'focus_signature');
  assertExactKeys(
    observation.claim_frontier_signature,
    ['payload', 'fingerprint'],
    'claim_frontier_signature',
  );
  assertExactKeys(
    observation.composite_state_signature,
    ['payload', 'fingerprint'],
    'composite_state_signature',
  );
  const focus = observation.focus_signature.payload;
  assertExactKeys(focus, [
    'signature_schema_version',
    'policy_version',
    'selected_candidate',
    'typed_candidate_frontier',
    'typed_candidate_set_fingerprint',
  ], 'focus_signature.payload');
  assertExactKeys(
    focus.selected_candidate,
    ['candidate_id', 'region_kind', 'region_id'],
    'focus_signature.payload.selected_candidate',
  );
  if (
    focus.signature_schema_version !== policy.observation_schema_version
    || focus.policy_version !== policy.source_versions.next_focus_policy_version
    || focus.typed_candidate_frontier.length === 0
    || fingerprint(focus.typed_candidate_frontier) !== focus.typed_candidate_set_fingerprint
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.UNSUPPORTED_VERSION,
      'Stored focus signature uses an unknown schema or inconsistent typed frontier',
    );
  }
  const candidateIds = new Set<string>();
  focus.typed_candidate_frontier.forEach((candidate, index) => {
    assertExactKeys(
      candidate,
      ['rank', 'candidate_id', 'region_kind', 'region_id'],
      'focus_signature.payload.typed_candidate_frontier',
    );
    requireIdentity(candidate.candidate_id, 'focus.candidate_id');
    requireIdentity(candidate.region_kind, 'focus.region_kind');
    requireIdentity(candidate.region_id, 'focus.region_id');
    if (candidate.rank !== index + 1 || candidateIds.has(candidate.candidate_id)) {
      throw new CycleDetectionError(
        CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
        'Stored focus frontier ranks or candidate identities are ambiguous',
      );
    }
    candidateIds.add(candidate.candidate_id);
  });
  const selected = focus.typed_candidate_frontier[0];
  if (
    selected.candidate_id !== focus.selected_candidate.candidate_id
    || selected.region_kind !== focus.selected_candidate.region_kind
    || selected.region_id !== focus.selected_candidate.region_id
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
      'Stored selected focus does not match the ranked typed frontier',
    );
  }
  const claims = observation.claim_frontier_signature.payload;
  assertExactKeys(claims, [
    'signature_schema_version',
    'claim_reducer_version',
    'claim_projection_schema_version',
    'active_claims',
    'unresolved_match_ids',
    'unresolved_contradictions',
  ], 'claim_frontier_signature.payload');
  if (
    claims.signature_schema_version !== policy.observation_schema_version
    || claims.claim_reducer_version !== policy.source_versions.claim_reducer_version
    || claims.claim_projection_schema_version
      !== policy.source_versions.claim_projection_schema_version
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.UNSUPPORTED_VERSION,
      'Stored claim-frontier signature uses an unknown reducer generation',
    );
  }
  const claimIds: string[] = [];
  for (const entry of claims.active_claims) {
    assertExactKeys(
      entry,
      ['claim_ref', 'lifecycle', 'epistemic_status'],
      'claim_frontier_signature.payload.active_claims',
    );
    assertExactKeys(entry.claim_ref, ['id', 'kind', 'schema_version'], 'claim_ref');
    const ref = validateIdentityRef(entry.claim_ref, ContinuityIdentityKinds.CLAIM);
    if (
      entry.lifecycle !== ClaimLifecycleStates.ACTIVE
      || !EPISTEMIC_STATUSES.has(entry.epistemic_status)
    ) {
      throw new CycleDetectionError(
        CycleDetectionErrorCodes.INVALID_TYPED_IDENTITY,
        'Stored active claim has an invalid lifecycle or epistemic state',
      );
    }
    claimIds.push(ref.id);
  }
  if (!sameCanonical(claimIds, [...new Set(claimIds)].sort(compareCodeUnits))) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_TYPED_IDENTITY,
      'Stored active claims are not unique and canonically sorted',
    );
  }
  if (!sameCanonical(
    claims.unresolved_match_ids,
    sortedUniqueIdentities(claims.unresolved_match_ids, 'unresolved_match_ids'),
  )) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
      'Stored unresolved matches are not in canonical order',
    );
  }
  const contradictionIds: string[] = [];
  for (const contradiction of claims.unresolved_contradictions) {
    assertExactKeys(
      contradiction,
      ['relationship_id', 'left_claim_ref', 'right_claim_ref'],
      'claim_frontier_signature.payload.unresolved_contradictions',
    );
    validateIdentityRef(contradiction.left_claim_ref, ContinuityIdentityKinds.CLAIM);
    validateIdentityRef(contradiction.right_claim_ref, ContinuityIdentityKinds.CLAIM);
    contradictionIds.push(requireIdentity(
      contradiction.relationship_id,
      'contradiction.relationship_id',
    ));
  }
  if (!sameCanonical(
    contradictionIds,
    [...new Set(contradictionIds)].sort(compareCodeUnits),
  )) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
      'Stored contradictions are not unique and canonically sorted',
    );
  }
  const composite = observation.composite_state_signature.payload;
  assertExactKeys(composite, [
    'signature_schema_version',
    'detector_policy_version',
    'focus_fingerprint',
    'claim_frontier_fingerprint',
    'coverage_reducer_version',
    'path_coverage_bps',
    'community_coverage_bps',
    'covered_path_ids',
    'covered_community_ids',
    'blocker_reducer_version',
    'unresolved_blocker_ids',
  ], 'composite_state_signature.payload');
  if (
    composite.signature_schema_version !== policy.observation_schema_version
    || composite.detector_policy_version !== policy.policy_version
    || composite.focus_fingerprint !== observation.focus_signature.fingerprint
    || composite.claim_frontier_fingerprint !== observation.claim_frontier_signature.fingerprint
    || composite.coverage_reducer_version !== policy.source_versions.coverage_reducer_version
    || composite.blocker_reducer_version !== policy.source_versions.blocker_reducer_version
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.UNSUPPORTED_VERSION,
      'Stored composite signature does not match its policy and component signatures',
    );
  }
  requireBps(composite.path_coverage_bps, 'composite.path_coverage_bps');
  requireBps(composite.community_coverage_bps, 'composite.community_coverage_bps');
  for (const [values, field] of [
    [composite.covered_path_ids, 'composite.covered_path_ids'],
    [composite.covered_community_ids, 'composite.covered_community_ids'],
    [composite.unresolved_blocker_ids, 'composite.unresolved_blocker_ids'],
  ] as const) {
    if (!sameCanonical(values, sortedUniqueIdentities(values, field))) {
      throw new CycleDetectionError(
        CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
        `${field} is not in canonical order`,
      );
    }
  }
  assertExactKeys(observation.source_evidence, [
    'next_focus_decision_id',
    'next_focus_recorded_candidate_set_fingerprint',
    'next_focus_source_fingerprint',
    'claim_frontier_digest',
    'claim_projection_digest',
    'claim_replay_final_digest',
    'coverage_source_fingerprint',
    'blocker_source_fingerprint',
  ], 'source_evidence');
  requireIdentity(observation.source_evidence.next_focus_decision_id, 'next_focus_decision_id');
  for (const [value, field] of [
    [observation.source_evidence.next_focus_recorded_candidate_set_fingerprint, 'candidate_set'],
    [observation.source_evidence.next_focus_source_fingerprint, 'next_focus_source'],
    [observation.source_evidence.claim_frontier_digest, 'claim_frontier'],
    [observation.source_evidence.claim_projection_digest, 'claim_projection'],
    [observation.source_evidence.claim_replay_final_digest, 'claim_replay'],
    [observation.source_evidence.coverage_source_fingerprint, 'coverage_source'],
    [observation.source_evidence.blocker_source_fingerprint, 'blocker_source'],
  ] as const) {
    requireHash(value, `source_evidence.${field}`);
  }
  const signatures: readonly CycleSignature<JsonObject>[] = [
    observation.focus_signature,
    observation.claim_frontier_signature,
    observation.composite_state_signature,
  ];
  if (signatures.some((entry) => fingerprint(entry.payload) !== entry.fingerprint)) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
      'Cycle observation contains a signature that does not match its canonical payload',
      { observationId: observation.observation_id },
    );
  }
  const { observation_fingerprint: ignored, ...core } = observation;
  void ignored;
  if (fingerprint(core as JsonValue) !== observation.observation_fingerprint) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.SIGNATURE_MISMATCH,
      'Cycle observation fingerprint does not match its canonical fields',
      { observationId: observation.observation_id },
    );
  }
}
