// ───────────────────────────────────────────────────────────────────
// MODULE: Cycle Detection Types
// ───────────────────────────────────────────────────────────────────

import type {
  DurableAppendReceipt,
  PolicyReference,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  ClaimContinuityFrontier,
  ClaimContinuityState,
  ClaimEpistemicStatus,
  ClaimLifecycleState,
} from '../claim-continuity/index.js';
import type {
  ContinuityIdentityRef,
} from '../deep-loop/continuity-identity/index.js';
import type {
  NextFocusSelectedDecision,
} from '../next-focus/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. POLICY AND SOURCE CONTRACTS
// ───────────────────────────────────────────────────────────────────

/** Schema, reducer and policy versions of every source projection the cycle detector reads. */
export interface CycleDetectorSourceVersions extends JsonObject {
  readonly claim_continuity_schema_version: number;
  readonly claim_reducer_version: string;
  readonly claim_projection_schema_version: string;
  readonly next_focus_policy_version: string;
  readonly coverage_reducer_version: string;
  readonly blocker_reducer_version: string;
  readonly progress_signal_version: string;
  readonly event_envelope_version: number;
  readonly replay_fingerprint_version: number;
}

/** Immutable sensitivity and source-version contract for one detector generation. */
export interface CycleDetectorPolicy extends JsonObject {
  readonly policy_version: string;
  readonly policy_digest: string;
  readonly observation_schema_version: number;
  readonly history_schema_version: number;
  readonly history_reducer_version: string;
  readonly progress_gate_version: string;
  readonly history_window: number;
  readonly max_period: number;
  readonly minimum_traversals: number;
  readonly repetition_window: number;
  readonly occurrence_threshold: number;
  readonly coverage_gain_floor_bps: number;
  readonly source_versions: CycleDetectorSourceVersions;
}

/** Ledger position as ledger id, sequence and record hash. */
export interface CycleLedgerCursor extends JsonObject {
  readonly ledger_id: string;
  readonly sequence: number;
  readonly record_hash: string;
}

/** The run, iteration, ledger cursor and projection watermark an observation is taken at. */
export interface CycleBoundaryInput {
  readonly runLineageId: string;
  readonly iteration: number;
  readonly ledgerCursor: CycleLedgerCursor;
  readonly projectionWatermark: string;
}

/** Path and community coverage, in basis points and covered ids, at one projection watermark. */
export interface CycleCoverageSnapshot extends JsonObject {
  readonly projection_watermark: string;
  readonly reducer_version: string;
  readonly path_coverage_bps: number;
  readonly community_coverage_bps: number;
  readonly covered_path_ids: string[];
  readonly covered_community_ids: string[];
  readonly source_fingerprint: string;
}

/** Unresolved blocker ids at one projection watermark, with the reducer version that produced them. */
export interface CycleBlockerSnapshot extends JsonObject {
  readonly projection_watermark: string;
  readonly reducer_version: string;
  readonly unresolved_blocker_ids: string[];
  readonly source_fingerprint: string;
}

/** An evidence reference with the independence key used to tell new evidence from repeats. */
export interface CycleIndependentEvidenceRef extends JsonObject {
  readonly evidence_ref: string;
  readonly independence_key: string;
}

export const CycleClaimChangeKinds = {
  MINT: 'mint',
  LIFECYCLE: 'lifecycle',
  EPISTEMIC: 'epistemic',
} as const;

export type CycleClaimChangeKind =
  typeof CycleClaimChangeKinds[keyof typeof CycleClaimChangeKinds];

/**
 * A material claim change, as lifecycle and epistemic status before and after; the before values are null for a new
 * claim.
 */
export interface CycleClaimChange extends JsonObject {
  readonly kind: CycleClaimChangeKind;
  readonly claim_ref: ContinuityIdentityRef;
  readonly lifecycle_before: ClaimLifecycleState | null;
  readonly lifecycle_after: ClaimLifecycleState;
  readonly epistemic_before: ClaimEpistemicStatus | null;
  readonly epistemic_after: ClaimEpistemicStatus;
}

/**
 * Progress signals for an iteration when every field was available: new evidence, claim changes, resolutions and
 * coverage.
 */
export interface CompleteCycleProgressVector extends JsonObject {
  readonly status: 'complete';
  readonly signal_version: string;
  readonly projection_watermark: string;
  readonly new_independent_evidence: CycleIndependentEvidenceRef[];
  readonly material_claim_changes: CycleClaimChange[];
  readonly resolved_contradiction_ids: string[];
  readonly resolved_blocker_ids: string[];
  readonly path_coverage_bps: number;
  readonly community_coverage_bps: number;
  readonly progress_fingerprint: string;
}

/** Progress vector for an iteration where some signals were unavailable, naming the missing fields. */
export interface MissingCycleProgressVector extends JsonObject {
  readonly status: 'missing';
  readonly signal_version: string;
  readonly projection_watermark: string | null;
  readonly missing_fields: string[];
  readonly progress_fingerprint: string;
}

export type CycleProgressVector =
  | CompleteCycleProgressVector
  | MissingCycleProgressVector;

/**
 * Every projection an observation is built from: boundary, next-focus decision, claim frontier and state, coverage,
 * blockers and progress.
 */
export interface ProjectCycleObservationInput {
  readonly boundary: CycleBoundaryInput;
  readonly nextFocusDecision: NextFocusSelectedDecision;
  readonly claimFrontier: ClaimContinuityFrontier;
  readonly claimState: Readonly<ClaimContinuityState>;
  readonly claimProjectionWatermark: string;
  readonly coverage: CycleCoverageSnapshot;
  readonly blockers: CycleBlockerSnapshot;
  readonly progress: CycleProgressVector;
  readonly detectorPolicyVersion?: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. OBSERVATION AND HISTORY
// ───────────────────────────────────────────────────────────────────

/** Candidate and region identity of a next-focus candidate, as used inside a focus signature. */
export interface CycleFocusCandidateIdentity extends JsonObject {
  readonly candidate_id: string;
  readonly region_kind: string;
  readonly region_id: string;
}

/** A ranked next-focus candidate inside the typed candidate frontier of a focus signature. */
export interface CycleFocusFrontierIdentity extends JsonObject {
  readonly rank: number;
  readonly candidate_id: string;
  readonly region_kind: string;
  readonly region_id: string;
}

/** Fingerprinted content of a focus signature: the selected candidate and the ranked candidate frontier. */
export interface CycleFocusSignaturePayload extends JsonObject {
  readonly signature_schema_version: number;
  readonly policy_version: string;
  readonly selected_candidate: CycleFocusCandidateIdentity;
  readonly typed_candidate_frontier: CycleFocusFrontierIdentity[];
  readonly typed_candidate_set_fingerprint: string;
}

/** One active claim reduced to its reference, lifecycle and epistemic status for a claim-frontier signature. */
export interface CycleClaimStateIdentity extends JsonObject {
  readonly claim_ref: ContinuityIdentityRef;
  readonly lifecycle: ClaimLifecycleState;
  readonly epistemic_status: ClaimEpistemicStatus;
}

/** An unresolved contradiction between two claims, identified by its relationship id. */
export interface CycleContradictionIdentity extends JsonObject {
  readonly relationship_id: string;
  readonly left_claim_ref: ContinuityIdentityRef;
  readonly right_claim_ref: ContinuityIdentityRef;
}

/** Fingerprinted content of a claim-frontier signature: active claims, unresolved matches and contradictions. */
export interface CycleClaimFrontierSignaturePayload extends JsonObject {
  readonly signature_schema_version: number;
  readonly claim_reducer_version: string;
  readonly claim_projection_schema_version: string;
  readonly active_claims: CycleClaimStateIdentity[];
  readonly unresolved_match_ids: string[];
  readonly unresolved_contradictions: CycleContradictionIdentity[];
}

/**
 * Fingerprinted content of the composite signature, joining the focus and claim fingerprints with coverage and
 * blockers.
 */
export interface CycleCompositeSignaturePayload extends JsonObject {
  readonly signature_schema_version: number;
  readonly detector_policy_version: string;
  readonly focus_fingerprint: string;
  readonly claim_frontier_fingerprint: string;
  readonly coverage_reducer_version: string;
  readonly path_coverage_bps: number;
  readonly community_coverage_bps: number;
  readonly covered_path_ids: string[];
  readonly covered_community_ids: string[];
  readonly blocker_reducer_version: string;
  readonly unresolved_blocker_ids: string[];
}

/** A signature payload together with the fingerprint used to compare it across iterations. */
export interface CycleSignature<TPayload extends JsonObject> extends JsonObject {
  readonly payload: TPayload;
  readonly fingerprint: string;
}

/** Digests and fingerprints of the source projections an observation was built from, so it can be traced back. */
export interface CycleObservationSourceEvidence extends JsonObject {
  readonly next_focus_decision_id: string;
  readonly next_focus_recorded_candidate_set_fingerprint: string;
  readonly next_focus_source_fingerprint: string;
  readonly claim_frontier_digest: string;
  readonly claim_projection_digest: string;
  readonly claim_replay_final_digest: string;
  readonly coverage_source_fingerprint: string;
  readonly blocker_source_fingerprint: string;
}

/** Replay-stable semantic state captured at one committed iteration watermark. */
export interface CycleObservation extends JsonObject {
  readonly schema_version: number;
  readonly observation_id: string;
  readonly detector_policy_version: string;
  readonly detector_policy_digest: string;
  readonly run_lineage_id: string;
  readonly iteration: number;
  readonly ledger_cursor: CycleLedgerCursor;
  readonly projection_watermark: string;
  readonly focus_signature: CycleSignature<CycleFocusSignaturePayload>;
  readonly claim_frontier_signature: CycleSignature<CycleClaimFrontierSignaturePayload>;
  readonly composite_state_signature: CycleSignature<CycleCompositeSignaturePayload>;
  readonly progress: CycleProgressVector;
  readonly source_evidence: CycleObservationSourceEvidence;
  readonly observation_fingerprint: string;
}

/** Identity of the most recently evicted observation, marking where the bounded history was cut. */
export interface CycleHistoryEvictionBoundary extends JsonObject {
  readonly iteration: number;
  readonly ledger_cursor: CycleLedgerCursor;
  readonly observation_id: string;
  readonly observation_fingerprint: string;
}

/** Disposable latest-window projection with a hash-chained eviction boundary. */
export interface CycleHistoryProjection extends JsonObject {
  readonly schema_version: number;
  readonly reducer_version: string;
  readonly detector_policy_version: string;
  readonly detector_policy_digest: string;
  readonly run_lineage_id: string | null;
  readonly observations: CycleObservation[];
  readonly evicted_count: number;
  readonly evicted_through: CycleHistoryEvictionBoundary | null;
  readonly eviction_chain_hash: string;
  readonly history_hash: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. PROGRESS AND DETECTION RESULTS
// ───────────────────────────────────────────────────────────────────

export const CycleProgressVerdicts = {
  PROGRESS: 'progress',
  NO_PROGRESS: 'no_progress',
  NOT_EVALUABLE: 'not_evaluable',
} as const;

export type CycleProgressVerdict =
  typeof CycleProgressVerdicts[keyof typeof CycleProgressVerdicts];

/** Progress gate verdict over an iteration window, with its basis and the coverage gain in basis points when known. */
export interface CycleProgressAssessment extends JsonObject {
  readonly gate_version: string;
  readonly verdict: CycleProgressVerdict;
  readonly basis: string[];
  readonly start_iteration: number;
  readonly end_iteration: number;
  readonly path_coverage_gain_bps: number | null;
  readonly community_coverage_gain_bps: number | null;
}

export const CycleSignatureKinds = {
  FOCUS: 'focus',
  CLAIM_FRONTIER: 'claim_frontier',
  COMPOSITE_STATE: 'composite_state',
} as const;

export type CycleSignatureKind =
  typeof CycleSignatureKinds[keyof typeof CycleSignatureKinds];

/** One iteration in a cycle trace, as its ledger cursor and signature fingerprint. */
export interface CycleTraceEntry extends JsonObject {
  readonly iteration: number;
  readonly ledger_cursor: CycleLedgerCursor;
  readonly fingerprint: string;
}

/**
 * Evidence for a detected cycle: signature kind, period, occurrences, the iteration and cursor span, its trace and the
 * progress assessment.
 */
export interface CycleEvidence extends JsonObject {
  readonly run_lineage_id: string;
  readonly detector_policy_version: string;
  readonly signature_kind: CycleSignatureKind;
  readonly period: number;
  readonly occurrence_count: number;
  readonly start_iteration: number;
  readonly end_iteration: number;
  readonly start_cursor: CycleLedgerCursor;
  readonly end_cursor: CycleLedgerCursor;
  readonly source_fingerprints: string[];
  readonly trace: CycleTraceEntry[];
  readonly progress_assessment: CycleProgressAssessment;
}

export const CycleEvaluationStatuses = {
  NOT_EVALUABLE: 'not_evaluable',
  NO_CYCLE: 'no_cycle',
  CYCLE_SUSPECTED: 'cycle_suspected',
  CYCLE_CONFIRMED: 'cycle_confirmed',
  CYCLE_CLEARED: 'cycle_cleared',
} as const;

export type CycleEvaluationStatus =
  typeof CycleEvaluationStatuses[keyof typeof CycleEvaluationStatuses];

/** Detector result when the history cannot be evaluated, with the reason. */
export interface CycleNotEvaluableResult {
  readonly status: 'not_evaluable';
  readonly reason: string;
  readonly detectorPolicyVersion: string;
}

/** Detector result when no cycle was found among the evaluated observations. */
export interface CycleNoCycleResult {
  readonly status: 'no_cycle';
  readonly detectorPolicyVersion: string;
  readonly evaluatedObservationCount: number;
}

/**
 * Detector result for a suspected, confirmed or cleared cycle, with the primary evidence and optionally the full
 * evidence set.
 */
export interface CycleEvidenceResult {
  readonly status: 'cycle_suspected' | 'cycle_confirmed' | 'cycle_cleared';
  readonly detectorPolicyVersion: string;
  readonly evidence: CycleEvidence;
  readonly evidenceSet?: readonly CycleEvidence[];
}

export type CycleEvaluationResult =
  | CycleNotEvaluableResult
  | CycleNoCycleResult
  | CycleEvidenceResult;

// ───────────────────────────────────────────────────────────────────
// 4. HEALTH EVENTS AND CLOCK HANDOFF
// ───────────────────────────────────────────────────────────────────

export type CycleHealthState =
  | 'cycle_suspected'
  | 'cycle_confirmed'
  | 'cycle_cleared';

/** Ledger payload of a cycle health event, carrying the cycle evidence fields and their digest. */
export interface CycleHealthEventPayload extends JsonObject {
  readonly health_event_id: string;
  readonly health_state: CycleHealthState;
  readonly run_lineage_id: string;
  readonly detector_policy_version: string;
  readonly detector_policy_digest: string;
  readonly signature_kind: CycleSignatureKind;
  readonly period: number;
  readonly occurrence_count: number;
  readonly start_cursor: CycleLedgerCursor;
  readonly end_cursor: CycleLedgerCursor;
  readonly start_iteration: number;
  readonly end_iteration: number;
  readonly progress_assessment: CycleProgressAssessment;
  readonly source_fingerprints: string[];
  readonly trace: CycleTraceEntry[];
  readonly evidence_digest: string;
}

/** Stream position, timestamps, producer, authority epoch and correlation ids for a cycle health event envelope. */
export interface CycleHealthEventEnvelopeInput {
  readonly streamId: string;
  readonly streamSequence: number;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly producer: EventProducer;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
}

/** Outcome of recording a cycle health event, appended or idempotent, with its durable receipt. */
export interface CycleHealthRecordResult {
  readonly status: 'appended' | 'idempotent';
  readonly receipt: DurableAppendReceipt;
}

/** Mode, actor, capability, evidence digest and policy the gateway authorizes a cycle health write against. */
export interface CycleHealthWriteContext {
  readonly mode: string;
  readonly actorId: string;
  readonly capabilityId: string;
  readonly evidenceDigest: string;
  readonly policy: PolicyReference;
}

/** Evidence-only input whose type cannot represent an authoritative stop decision. */
export interface CycleStoppingClockInput extends JsonObject {
  readonly source: 'cycle_detection';
  readonly authority: 'evidence_only';
  readonly health_event_id: string;
  readonly health_state: CycleHealthState;
  readonly evidence_digest: string;
  readonly contributes_to_stopping_clock: boolean;
  readonly severity_bps: number;
  readonly stop_decision: null;
}

// ───────────────────────────────────────────────────────────────────
// 5. ERRORS
// ───────────────────────────────────────────────────────────────────

export const CycleDetectionErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  MIXED_WATERMARK: 'MIXED_WATERMARK',
  UNSUPPORTED_VERSION: 'UNSUPPORTED_VERSION',
  INVALID_TYPED_IDENTITY: 'INVALID_TYPED_IDENTITY',
  SIGNATURE_MISMATCH: 'SIGNATURE_MISMATCH',
  HISTORY_GAP: 'HISTORY_GAP',
  HISTORY_CONFLICT: 'HISTORY_CONFLICT',
  AUTHORIZATION_DENIED: 'AUTHORIZATION_DENIED',
  EVENT_CONFLICT: 'EVENT_CONFLICT',
} as const;

export type CycleDetectionErrorCode =
  typeof CycleDetectionErrorCodes[keyof typeof CycleDetectionErrorCodes];

/** Bounded fail-closed error that never substitutes an unverified comparison. */
export class CycleDetectionError extends Error {
  public readonly code: CycleDetectionErrorCode;
  public readonly details: Readonly<Record<string, JsonValue>>;

  public constructor(
    code: CycleDetectionErrorCode,
    message: string,
    details: Readonly<Record<string, JsonValue>> = {},
  ) {
    super(message);
    this.name = 'CycleDetectionError';
    this.code = code;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
