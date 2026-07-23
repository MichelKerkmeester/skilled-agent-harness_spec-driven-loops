// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Ledger Types
// ───────────────────────────────────────────────────────────────────

import type {
  EventEnvelope,
  JsonObject,
} from '../event-envelope/index.js';
import type { ReplayFingerprintDescriptor } from '../replay-fingerprint/index.js';
import type * as SharedReview from '../deep-review-ledger-schema/deep-review-ledger-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. IDENTITIES AND SHARED METADATA
// ───────────────────────────────────────────────────────────────────

export type AlignmentRunId = string;
export type SessionId = string;
export type AuthorityEpochId = string;
export type LaneId = string;
export type SubjectId = string;
export type RuleId = string;
export type ObservationId = string;
export type EvidenceId = string;
export type CandidateId = string;
export type FindingId = string;
export type VerificationId = string;
export type DeviationId = string;
export type ProofId = string;
export type Digest = string;
export type Fingerprint = string;
export type Version = string;
export type Uint32 = number;

export interface DeepAlignmentReplayMetadata extends JsonObject {
  readonly fingerprint_version: ReplayFingerprintDescriptor['fingerprint_version'];
  readonly final_digest: ReplayFingerprintDescriptor['final_digest'];
  readonly replay_input_digests: Record<string, string>;
}

export interface DeepAlignmentBaseScope extends JsonObject {
  readonly runId: AlignmentRunId;
  readonly sessionId: SessionId;
  readonly authorityEpochId: AuthorityEpochId;
}

export interface DeepAlignmentGenerationScope extends DeepAlignmentBaseScope {
  readonly generation: Uint32;
}

export interface DeepAlignmentIterationScope extends DeepAlignmentGenerationScope {
  readonly iterationId: string;
}

export interface DeepAlignmentDimensionScope extends DeepAlignmentIterationScope {
  readonly dimensionId: string;
}

export interface DeepAlignmentProtocolScope extends DeepAlignmentBaseScope {
  readonly protocolId: string;
}

export interface DeepAlignmentReportScope extends DeepAlignmentBaseScope {
  readonly reportRevisionId: string;
}

export interface DeepAlignmentFindingScope extends DeepAlignmentDimensionScope {
  readonly findingId: FindingId;
}

export interface DeepAlignmentLaneScope extends DeepAlignmentIterationScope {
  readonly laneId: LaneId;
}

export interface DeepAlignmentSubjectScope extends DeepAlignmentLaneScope {
  readonly subjectId: SubjectId;
}

export interface DeepAlignmentRuleScope extends DeepAlignmentSubjectScope {
  readonly ruleId: RuleId;
}

export interface DeepAlignmentObservationScope extends DeepAlignmentRuleScope {
  readonly observationId: ObservationId;
}

export interface DeepAlignmentEvidenceScope extends DeepAlignmentObservationScope {
  readonly evidenceId: EvidenceId;
}

export interface DeepAlignmentCandidateScope extends DeepAlignmentObservationScope {
  readonly candidateId: CandidateId;
}

export interface DeepAlignmentVerificationScope extends DeepAlignmentCandidateScope {
  readonly findingId: FindingId;
  readonly verificationId: VerificationId;
}

export interface DeepAlignmentProofScope extends DeepAlignmentVerificationScope {
  readonly proofId: ProofId;
}

export interface DeepAlignmentDeviationScope extends DeepAlignmentFindingScope {
  readonly deviationId: DeviationId;
}

export type DeepAlignmentScope =
  | DeepAlignmentBaseScope
  | DeepAlignmentGenerationScope
  | DeepAlignmentIterationScope
  | DeepAlignmentDimensionScope
  | DeepAlignmentProtocolScope
  | DeepAlignmentReportScope
  | DeepAlignmentFindingScope
  | DeepAlignmentLaneScope
  | DeepAlignmentSubjectScope
  | DeepAlignmentRuleScope
  | DeepAlignmentObservationScope
  | DeepAlignmentEvidenceScope
  | DeepAlignmentCandidateScope
  | DeepAlignmentVerificationScope
  | DeepAlignmentProofScope
  | DeepAlignmentDeviationScope;

// ───────────────────────────────────────────────────────────────────
// 2. SHARED REVIEW-LOOP PAYLOADS
// ───────────────────────────────────────────────────────────────────

export type TargetReference = SharedReview.TargetReference;
export type SemanticFingerprintParts = SharedReview.SemanticFingerprintParts;
export type RunInitializedData = SharedReview.RunInitializedData;
export type RunResumedData = SharedReview.RunResumedData;
export type RunRestartedData = SharedReview.RunRestartedData;
export type ScopeResolvedData = SharedReview.ScopeResolvedData;
export type DimensionOrderedData = SharedReview.DimensionOrderedData;
export type ProtocolPlanRecordedData = SharedReview.ProtocolPlanRecordedData;
export type DimensionPassStartedData = SharedReview.DimensionPassStartedData;
export type DimensionPassCompletedData = SharedReview.DimensionPassCompletedData;
export type FindingLineageRecordedData = SharedReview.FindingLineageRecordedData;
export type FindingStateChangedData = SharedReview.FindingStateChangedData;
export type ConvergenceEvaluatedData = SharedReview.ConvergenceEvaluatedData;
export type GraphConvergenceEvaluatedData = SharedReview.GraphConvergenceEvaluatedData;
export type BlockedStopRecordedData = SharedReview.BlockedStopRecordedData;
export type PauseRecordedData = SharedReview.PauseRecordedData;
export type RecoveryStartedData = SharedReview.RecoveryStartedData;
export type SynthesisStartedData = SharedReview.SynthesisStartedData;
export type ReviewReportCommittedData = SharedReview.ReviewReportCommittedData;
export type ContinuitySaveRequestedData = SharedReview.ContinuitySaveRequestedData;
export type ContinuitySaveCompletedData = SharedReview.ContinuitySaveCompletedData;
export type ContinuitySaveFailedData = SharedReview.ContinuitySaveFailedData;
export type RunCompletedData = SharedReview.RunCompletedData;

// ───────────────────────────────────────────────────────────────────
// 3. DEEP ALIGNMENT VALUE OBJECTS
// ───────────────────────────────────────────────────────────────────

export type AuthorityValidationStatus =
  | 'expired'
  | 'invalid'
  | 'mixed'
  | 'rolled-back'
  | 'valid';

export type ValidationCheckStatus = 'fail' | 'pass' | 'unknown';

export interface AuthorityValidationChecks extends JsonObject {
  readonly parse: ValidationCheckStatus;
  readonly type: ValidationCheckStatus;
  readonly capability: ValidationCheckStatus;
  readonly ruleTests: ValidationCheckStatus;
  readonly coverage: ValidationCheckStatus;
  readonly expiry: ValidationCheckStatus;
  readonly rollback: ValidationCheckStatus;
  readonly signature: ValidationCheckStatus;
  readonly mixAndMatch: ValidationCheckStatus;
  readonly resultDigest: Digest;
}

export interface AlignmentEvidenceLocator extends JsonObject {
  readonly scheme: 'artifact' | 'file' | 'other';
  readonly artifactRef: string;
  readonly locatorDigest: Digest;
  readonly selector: string;
  readonly revision: string | null;
}

export interface ConformanceCounts extends JsonObject {
  readonly applicable: Uint32;
  readonly notApplicable: Uint32;
  readonly unresolved: Uint32;
  readonly untested: Uint32;
  readonly blocked: Uint32;
  readonly nonConformant: Uint32;
}

// ───────────────────────────────────────────────────────────────────
// 4. DEEP ALIGNMENT EVENT PAYLOAD DATA
// ───────────────────────────────────────────────────────────────────

export interface AuthorityReferenceBoundData extends JsonObject {
  readonly authorityId: string;
  readonly authorityCapsuleRef: string;
  readonly authoritySourceDigest: Digest;
  readonly compilerFingerprint: Fingerprint;
  readonly profileDigest: Digest;
  readonly ruleIrDigest: Digest;
  readonly signatureDigest: Digest;
  readonly expiresAt: string;
  readonly rollbackRef: string | null;
}

export interface AuthorityValidationRecordedData extends JsonObject {
  readonly authorityReferenceEventId: string;
  readonly checks: AuthorityValidationChecks;
  readonly authorityStatus: AuthorityValidationStatus;
  readonly validationReceiptRefs: string[];
  readonly validatorFingerprint: Fingerprint;
  readonly validationDigest: Digest;
  readonly blockedReasonCode: string | null;
}

export interface AuthorityEpochCompatibilityRecordedData extends JsonObject {
  readonly sourceAuthorityEpochId: AuthorityEpochId;
  readonly targetAuthorityEpochId: AuthorityEpochId;
  readonly compatibilityClass: DeepAlignmentCompatibilityStatus;
  readonly direction: 'backward' | 'forward';
  readonly affectedRuleIds: string[];
  readonly comparisonDigest: Digest;
  readonly reasonCode: string;
  readonly orderedUpcastPath: string[];
  readonly ambiguous: boolean;
  readonly lossy: boolean;
}

export interface LanePlanRecordedData extends JsonObject {
  readonly laneKind: 'deterministic' | 'reasoning-required' | 'relational' | 'schema';
  readonly orderedRuleIds: string[];
  readonly ruleIrRef: string;
  readonly ruleIrDigest: Digest;
  readonly verifierPolicyVersion: Version;
  readonly budgetRef: string;
  readonly requiredEvidenceClasses: string[];
  readonly planDigest: Digest;
}

export interface LaneStartedData extends JsonObject {
  readonly lanePlanEventId: string;
  readonly subjectSnapshotRef: string;
  readonly subjectSnapshotDigest: Digest;
  readonly authorityValidationEventId: string;
  readonly authorityValidationDigest: Digest;
  readonly status: 'started';
}

export interface SubjectSnapshotBoundData extends JsonObject {
  readonly subjectSnapshotRef: string;
  readonly subjectType: 'artifact' | 'directory' | 'file' | 'repository' | 'symbol';
  readonly subjectDigest: Digest;
  readonly sourceVersionRef: string;
  readonly capturedAt: string;
  readonly parentSnapshotRef: string | null;
  readonly receiptRef: string;
}

export interface LaneCompletedData extends JsonObject {
  readonly lanePlanEventId: string;
  readonly subjectSnapshotRef: string;
  readonly subjectSnapshotDigest: Digest;
  readonly authorityValidationEventId: string;
  readonly applicabilityDecisionRefs: string[];
  readonly observationRefs: string[];
  readonly verificationRefs: string[];
  readonly status: 'blocked' | 'complete' | 'incomplete';
  readonly counts: ConformanceCounts;
  readonly completionDigest: Digest;
  readonly blockedReasonCode: string | null;
}

export interface ApplicabilityEvaluatedData extends JsonObject {
  readonly predicateRef: string;
  readonly predicateDigest: Digest;
  readonly targetFactRefs: string[];
  readonly targetFactDigest: Digest;
  readonly result: 'applicable' | 'blocked' | 'not_applicable' | 'unresolved';
  readonly evaluatorFingerprint: Fingerprint;
  readonly authorityValidationEventId: string;
  readonly decisionDigest: Digest;
  readonly reasonCode: string;
}

export interface ObservationRecordedData extends JsonObject {
  readonly applicabilityDecisionId: string;
  readonly subjectSnapshotRef: string;
  readonly subjectSnapshotDigest: Digest;
  readonly detectorFingerprint: Fingerprint;
  readonly observationKind: 'deterministic' | 'reasoning' | 'relational' | 'schema';
  readonly rawResultDigest: Digest;
  readonly sourceDigest: Digest;
  readonly contentDigest: Digest;
  readonly evidenceClass: string;
  readonly freshness: 'fresh' | 'stale' | 'unknown';
  readonly causalRelevance: 'direct' | 'indirect' | 'unknown';
  readonly locator: AlignmentEvidenceLocator;
  readonly receiptRefs: string[];
}

export interface EvidenceReceiptBoundData extends JsonObject {
  readonly observationEventId: string;
  readonly receiptRef: string;
  readonly receiptDigest: Digest;
  readonly evidenceClass: string;
  readonly freshness: 'fresh' | 'stale' | 'unknown';
  readonly sourceDigest: Digest;
  readonly contentDigest: Digest;
  readonly toolFingerprint: Fingerprint;
  readonly capturedAt: string;
}

export interface ObservationReconciledData extends JsonObject {
  readonly observationEventId: string;
  readonly predecessorObservationEventId: string;
  readonly evidenceReceiptRefs: string[];
  readonly reconciliationOutcome: 'confirmed' | 'contradicted' | 'degraded' | 'superseded';
  readonly evidenceSetDigest: Digest;
  readonly reconcilerFingerprint: Fingerprint;
  readonly reasonCode: string;
}

export interface FindingCandidateEmittedData extends JsonObject {
  readonly observationEventId: string;
  readonly applicabilityDecisionId: string;
  readonly evidenceReceiptRefs: string[];
  readonly detectorFingerprint: Fingerprint;
  readonly detectorBlindingDigest: Digest;
  readonly candidateClaimDigest: Digest;
  readonly findingClass: string;
  readonly rawImpact: number;
  readonly rawConfidence: number;
  readonly rawCandidateScore: number;
  readonly scorerFingerprint: Fingerprint;
  readonly scoringPolicyVersion: Version;
  readonly semanticFingerprint: SemanticFingerprintParts;
  readonly sourcePassEventId: string;
}

export interface FindingVerificationRecordedData extends JsonObject {
  readonly candidateEventId: string;
  readonly observationEventId: string;
  readonly authorityValidationEventId: string;
  readonly subjectSnapshotRef: string;
  readonly subjectSnapshotDigest: Digest;
  readonly applicabilityDecisionId: string;
  readonly evidenceReceiptRefs: string[];
  readonly verifierFingerprint: Fingerprint;
  readonly verifierIndependenceDigest: Digest;
  readonly proofWitnessRefs: string[];
  readonly verificationMode: 'deterministic' | 'independent-reasoning' | 'relational' | 'schema';
  readonly result: 'blocked' | 'confirmed' | 'disproved' | 'inconclusive';
  readonly rawImpact: number;
  readonly rawConfidence: number;
  readonly evidenceStrength: number;
  readonly counterevidenceRefs: string[];
  readonly verificationDigest: Digest;
}

export interface ProofWitnessRecordedData extends JsonObject {
  readonly verificationEventId: string;
  readonly witnessKind: 'boundary' | 'negative' | 'positive' | 'stateful';
  readonly artifactRef: string;
  readonly witnessDigest: Digest;
  readonly sourceDigest: Digest;
  readonly locator: AlignmentEvidenceLocator;
  readonly minimized: boolean;
  readonly minimizerFingerprint: Fingerprint;
  readonly replayRecipeRef: string;
  readonly replayRecipeDigest: Digest;
  readonly outcome: 'contradicts' | 'inconclusive' | 'supports';
  readonly receiptRefs: string[];
}

export interface ClaimAdjudicationRecordedData extends JsonObject {
  readonly candidateEventId: string;
  readonly verificationEventId: string;
  readonly observationEventId: string;
  readonly claimDigest: Digest;
  readonly evidenceReceiptRefs: string[];
  readonly proofWitnessRefs: string[];
  readonly counterevidenceRefs: string[];
  readonly verifierFingerprint: Fingerprint;
  readonly assessorFingerprint: Fingerprint;
  readonly authorityValidationEventId: string;
  readonly applicabilityDecisionId: string;
  readonly subjectSnapshotDigest: Digest;
  readonly finalSeverity: 'none' | 'P0' | 'P1' | 'P2';
  readonly impact: number;
  readonly confidence: number;
  readonly outcome: 'accepted' | 'blocked' | 'deferred' | 'disproved' | 'rejected';
  readonly transition: 'candidate-to-finding' | 'candidate-to-rejected' | 'finding-reaffirmed';
  readonly adjudicationDigest: Digest;
  readonly predecessorAdjudicationEventId: string | null;
}

export interface ConformanceAssessmentRecordedData extends JsonObject {
  readonly adjudicationEventId: string;
  readonly adjudicationPayloadDigest: Digest;
  readonly authorityValidationEventId: string;
  readonly authorityValidationDigest: Digest;
  readonly authorityStatus: 'valid';
  readonly subjectSnapshotRef: string;
  readonly subjectSnapshotDigest: Digest;
  readonly applicabilityDecisionId: string;
  readonly applicabilityOutcome: 'applicable' | 'blocked' | 'not_applicable' | 'unresolved';
  readonly verificationEventId: string;
  readonly verifierFingerprint: Fingerprint;
  readonly proofWitnessRefs: string[];
  readonly evidenceReceiptRefs: string[];
  readonly conformanceStatus:
    | 'blocked'
    | 'conformant'
    | 'inconclusive'
    | 'non_conformant'
    | 'not_applicable'
    | 'untested';
  readonly impact: number;
  readonly confidence: number;
  readonly assessmentPolicyVersion: Version;
  readonly assessmentDigest: Digest;
}

export interface KnownDeviationRecordedData extends JsonObject {
  readonly originalFindingEventId: string;
  readonly originalFindingDigest: Digest;
  readonly conformanceAssessmentEventId: string;
  readonly authorityEpochRef: string;
  readonly verifierFingerprint: Fingerprint;
  readonly issuerId: string;
  readonly rationale: string;
  readonly scopePredicateRef: string;
  readonly scopePredicateDigest: Digest;
  readonly subjectSnapshotDigest: Digest;
  readonly expiresAt: string | null;
  readonly invalidationConditionRefs: string[];
  readonly status: 'active';
}

export interface KnownDeviationInvalidatedData extends JsonObject {
  readonly deviationEventId: string;
  readonly originalFindingEventId: string;
  readonly authorityEpochRef: string;
  readonly verifierFingerprint: Fingerprint;
  readonly subjectSnapshotDigest: Digest;
  readonly invalidationTrigger:
    | 'authority-changed'
    | 'expired'
    | 'scope-changed'
    | 'subject-changed'
    | 'verifier-changed';
  readonly invalidationEvidenceRefs: string[];
  readonly invalidationDigest: Digest;
  readonly reactivatedFindingEventId: string | null;
  readonly invalidatedAt: string;
}

export interface ApplicabilityCoverageRecordedData extends JsonObject {
  readonly authorityValidationEventId: string;
  readonly subjectSnapshotDigest: Digest;
  readonly declaredApplicabilityEdgeRefs: string[];
  readonly applicableRuleIds: string[];
  readonly notApplicableRuleIds: string[];
  readonly unresolvedRuleIds: string[];
  readonly untestedRuleIds: string[];
  readonly blockedRuleIds: string[];
  readonly coverageDigest: Digest;
}

export interface AuthorityWitnessReplayedData extends JsonObject {
  readonly sourceAuthorityEpochId: AuthorityEpochId;
  readonly targetAuthorityEpochId: AuthorityEpochId;
  readonly witnessEventId: string;
  readonly proofDigest: Digest;
  readonly affectedRuleIds: string[];
  readonly compatibilityClass: DeepAlignmentCompatibilityStatus;
  readonly compatibilityDecisionEventId: string;
  readonly replayOutcome: 'accepted' | 'blocked' | 'degraded';
  readonly verifierFingerprint: Fingerprint;
  readonly subjectSnapshotDigest: Digest;
  readonly replayDigest: Digest;
}

// ───────────────────────────────────────────────────────────────────
// 5. EVENT UNION
// ───────────────────────────────────────────────────────────────────

export const DEEP_ALIGNMENT_SHARED_REVIEW_BACKBONE = Object.freeze({
  'deep_alignment.run_initialized': 'deep_review.run_initialized',
  'deep_alignment.run_resumed': 'deep_review.run_resumed',
  'deep_alignment.run_restarted': 'deep_review.run_restarted',
  'deep_alignment.scope_resolved': 'deep_review.scope_resolved',
  'deep_alignment.dimension_ordered': 'deep_review.dimension_ordered',
  'deep_alignment.protocol_plan_recorded': 'deep_review.protocol_plan_recorded',
  'deep_alignment.dimension_pass_started': 'deep_review.dimension_pass_started',
  'deep_alignment.dimension_pass_completed': 'deep_review.dimension_pass_completed',
  'deep_alignment.finding_lineage_recorded': 'deep_review.finding_lineage_recorded',
  'deep_alignment.finding_state_changed': 'deep_review.finding_state_changed',
  'deep_alignment.convergence_evaluated': 'deep_review.convergence_evaluated',
  'deep_alignment.graph_convergence_evaluated': 'deep_review.graph_convergence_evaluated',
  'deep_alignment.blocked_stop_recorded': 'deep_review.blocked_stop_recorded',
  'deep_alignment.pause_recorded': 'deep_review.pause_recorded',
  'deep_alignment.recovery_started': 'deep_review.recovery_started',
  'deep_alignment.synthesis_started': 'deep_review.synthesis_started',
  'deep_alignment.review_report_committed': 'deep_review.review_report_committed',
  'deep_alignment.continuity_save_requested': 'deep_review.continuity_save_requested',
  'deep_alignment.continuity_save_completed': 'deep_review.continuity_save_completed',
  'deep_alignment.continuity_save_failed': 'deep_review.continuity_save_failed',
  'deep_alignment.run_completed': 'deep_review.run_completed',
} as const);

export type DeepAlignmentSharedBackboneStem =
  keyof typeof DEEP_ALIGNMENT_SHARED_REVIEW_BACKBONE;

export const DeepAlignmentEventStems = Object.freeze([
  'deep_alignment.run_initialized',
  'deep_alignment.run_resumed',
  'deep_alignment.run_restarted',
  'deep_alignment.authority_reference_bound',
  'deep_alignment.authority_validation_recorded',
  'deep_alignment.authority_epoch_compatibility_recorded',
  'deep_alignment.scope_resolved',
  'deep_alignment.dimension_ordered',
  'deep_alignment.protocol_plan_recorded',
  'deep_alignment.lane_plan_recorded',
  'deep_alignment.lane_started',
  'deep_alignment.subject_snapshot_bound',
  'deep_alignment.applicability_evaluated',
  'deep_alignment.dimension_pass_started',
  'deep_alignment.observation_recorded',
  'deep_alignment.evidence_receipt_bound',
  'deep_alignment.observation_reconciled',
  'deep_alignment.finding_candidate_emitted',
  'deep_alignment.finding_verification_recorded',
  'deep_alignment.proof_witness_recorded',
  'deep_alignment.claim_adjudication_recorded',
  'deep_alignment.conformance_assessment_recorded',
  'deep_alignment.finding_lineage_recorded',
  'deep_alignment.finding_state_changed',
  'deep_alignment.known_deviation_recorded',
  'deep_alignment.known_deviation_invalidated',
  'deep_alignment.applicability_coverage_recorded',
  'deep_alignment.authority_witness_replayed',
  'deep_alignment.dimension_pass_completed',
  'deep_alignment.lane_completed',
  'deep_alignment.convergence_evaluated',
  'deep_alignment.graph_convergence_evaluated',
  'deep_alignment.blocked_stop_recorded',
  'deep_alignment.pause_recorded',
  'deep_alignment.recovery_started',
  'deep_alignment.synthesis_started',
  'deep_alignment.review_report_committed',
  'deep_alignment.continuity_save_requested',
  'deep_alignment.continuity_save_completed',
  'deep_alignment.continuity_save_failed',
  'deep_alignment.run_completed',
] as const);

export type DeepAlignmentEventStem = typeof DeepAlignmentEventStems[number];

export const DeepAlignmentWireEventTypes = Object.freeze(
  Object.fromEntries(DeepAlignmentEventStems.map((stem) => [
    stem,
    stem.replace(/^deep_alignment\./u, 'deep-alignment.ledger.').replaceAll('_', '-'),
  ])) as Readonly<Record<DeepAlignmentEventStem, string>>,
);

export type DeepAlignmentWireEventType =
  typeof DeepAlignmentWireEventTypes[DeepAlignmentEventStem];

export interface DeepAlignmentPayloadMap {
  readonly 'deep_alignment.run_initialized': RunInitializedData;
  readonly 'deep_alignment.run_resumed': RunResumedData;
  readonly 'deep_alignment.run_restarted': RunRestartedData;
  readonly 'deep_alignment.authority_reference_bound': AuthorityReferenceBoundData;
  readonly 'deep_alignment.authority_validation_recorded': AuthorityValidationRecordedData;
  readonly 'deep_alignment.authority_epoch_compatibility_recorded':
    AuthorityEpochCompatibilityRecordedData;
  readonly 'deep_alignment.scope_resolved': ScopeResolvedData;
  readonly 'deep_alignment.dimension_ordered': DimensionOrderedData;
  readonly 'deep_alignment.protocol_plan_recorded': ProtocolPlanRecordedData;
  readonly 'deep_alignment.lane_plan_recorded': LanePlanRecordedData;
  readonly 'deep_alignment.lane_started': LaneStartedData;
  readonly 'deep_alignment.subject_snapshot_bound': SubjectSnapshotBoundData;
  readonly 'deep_alignment.applicability_evaluated': ApplicabilityEvaluatedData;
  readonly 'deep_alignment.dimension_pass_started': DimensionPassStartedData;
  readonly 'deep_alignment.observation_recorded': ObservationRecordedData;
  readonly 'deep_alignment.evidence_receipt_bound': EvidenceReceiptBoundData;
  readonly 'deep_alignment.observation_reconciled': ObservationReconciledData;
  readonly 'deep_alignment.finding_candidate_emitted': FindingCandidateEmittedData;
  readonly 'deep_alignment.finding_verification_recorded': FindingVerificationRecordedData;
  readonly 'deep_alignment.proof_witness_recorded': ProofWitnessRecordedData;
  readonly 'deep_alignment.claim_adjudication_recorded': ClaimAdjudicationRecordedData;
  readonly 'deep_alignment.conformance_assessment_recorded': ConformanceAssessmentRecordedData;
  readonly 'deep_alignment.finding_lineage_recorded': FindingLineageRecordedData;
  readonly 'deep_alignment.finding_state_changed': FindingStateChangedData;
  readonly 'deep_alignment.known_deviation_recorded': KnownDeviationRecordedData;
  readonly 'deep_alignment.known_deviation_invalidated': KnownDeviationInvalidatedData;
  readonly 'deep_alignment.applicability_coverage_recorded': ApplicabilityCoverageRecordedData;
  readonly 'deep_alignment.authority_witness_replayed': AuthorityWitnessReplayedData;
  readonly 'deep_alignment.dimension_pass_completed': DimensionPassCompletedData;
  readonly 'deep_alignment.lane_completed': LaneCompletedData;
  readonly 'deep_alignment.convergence_evaluated': ConvergenceEvaluatedData;
  readonly 'deep_alignment.graph_convergence_evaluated': GraphConvergenceEvaluatedData;
  readonly 'deep_alignment.blocked_stop_recorded': BlockedStopRecordedData;
  readonly 'deep_alignment.pause_recorded': PauseRecordedData;
  readonly 'deep_alignment.recovery_started': RecoveryStartedData;
  readonly 'deep_alignment.synthesis_started': SynthesisStartedData;
  readonly 'deep_alignment.review_report_committed': ReviewReportCommittedData;
  readonly 'deep_alignment.continuity_save_requested': ContinuitySaveRequestedData;
  readonly 'deep_alignment.continuity_save_completed': ContinuitySaveCompletedData;
  readonly 'deep_alignment.continuity_save_failed': ContinuitySaveFailedData;
  readonly 'deep_alignment.run_completed': RunCompletedData;
}

export interface DeepAlignmentScopeMap {
  readonly 'deep_alignment.run_initialized': DeepAlignmentGenerationScope;
  readonly 'deep_alignment.run_resumed': DeepAlignmentGenerationScope;
  readonly 'deep_alignment.run_restarted': DeepAlignmentGenerationScope;
  readonly 'deep_alignment.authority_reference_bound': DeepAlignmentBaseScope;
  readonly 'deep_alignment.authority_validation_recorded': DeepAlignmentBaseScope;
  readonly 'deep_alignment.authority_epoch_compatibility_recorded': DeepAlignmentBaseScope;
  readonly 'deep_alignment.scope_resolved': DeepAlignmentBaseScope;
  readonly 'deep_alignment.dimension_ordered': DeepAlignmentBaseScope;
  readonly 'deep_alignment.protocol_plan_recorded': DeepAlignmentProtocolScope;
  readonly 'deep_alignment.lane_plan_recorded': DeepAlignmentLaneScope;
  readonly 'deep_alignment.lane_started': DeepAlignmentLaneScope;
  readonly 'deep_alignment.subject_snapshot_bound': DeepAlignmentSubjectScope;
  readonly 'deep_alignment.applicability_evaluated': DeepAlignmentRuleScope;
  readonly 'deep_alignment.dimension_pass_started': DeepAlignmentDimensionScope;
  readonly 'deep_alignment.observation_recorded': DeepAlignmentObservationScope;
  readonly 'deep_alignment.evidence_receipt_bound': DeepAlignmentEvidenceScope;
  readonly 'deep_alignment.observation_reconciled': DeepAlignmentObservationScope;
  readonly 'deep_alignment.finding_candidate_emitted': DeepAlignmentCandidateScope;
  readonly 'deep_alignment.finding_verification_recorded': DeepAlignmentVerificationScope;
  readonly 'deep_alignment.proof_witness_recorded': DeepAlignmentProofScope;
  readonly 'deep_alignment.claim_adjudication_recorded': DeepAlignmentVerificationScope;
  readonly 'deep_alignment.conformance_assessment_recorded': DeepAlignmentVerificationScope;
  readonly 'deep_alignment.finding_lineage_recorded': DeepAlignmentFindingScope;
  readonly 'deep_alignment.finding_state_changed': DeepAlignmentFindingScope;
  readonly 'deep_alignment.known_deviation_recorded': DeepAlignmentDeviationScope;
  readonly 'deep_alignment.known_deviation_invalidated': DeepAlignmentDeviationScope;
  readonly 'deep_alignment.applicability_coverage_recorded': DeepAlignmentLaneScope;
  readonly 'deep_alignment.authority_witness_replayed': DeepAlignmentProofScope;
  readonly 'deep_alignment.dimension_pass_completed': DeepAlignmentDimensionScope;
  readonly 'deep_alignment.lane_completed': DeepAlignmentLaneScope;
  readonly 'deep_alignment.convergence_evaluated': DeepAlignmentIterationScope;
  readonly 'deep_alignment.graph_convergence_evaluated': DeepAlignmentIterationScope;
  readonly 'deep_alignment.blocked_stop_recorded': DeepAlignmentIterationScope;
  readonly 'deep_alignment.pause_recorded': DeepAlignmentIterationScope;
  readonly 'deep_alignment.recovery_started': DeepAlignmentDimensionScope;
  readonly 'deep_alignment.synthesis_started': DeepAlignmentReportScope;
  readonly 'deep_alignment.review_report_committed': DeepAlignmentReportScope;
  readonly 'deep_alignment.continuity_save_requested': DeepAlignmentBaseScope;
  readonly 'deep_alignment.continuity_save_completed': DeepAlignmentBaseScope;
  readonly 'deep_alignment.continuity_save_failed': DeepAlignmentBaseScope;
  readonly 'deep_alignment.run_completed': DeepAlignmentBaseScope;
}

export interface DeepAlignmentLedgerPayload<
  TStem extends DeepAlignmentEventStem,
> extends JsonObject {
  readonly stem: TStem;
  readonly eventVersion: 1;
  readonly scope: DeepAlignmentScopeMap[TStem];
  readonly prevEventHash: Digest;
  readonly payloadDigest: Digest;
  readonly replay: DeepAlignmentReplayMetadata;
  readonly data: DeepAlignmentPayloadMap[TStem];
}

export type DeepAlignmentEventEnvelope<
  TStem extends DeepAlignmentEventStem = DeepAlignmentEventStem,
> = EventEnvelope & {
  readonly event_type: typeof DeepAlignmentWireEventTypes[TStem];
  readonly event_version: 1;
  readonly payload: DeepAlignmentLedgerPayload<TStem>;
};

export type DeepAlignmentLedgerEvent = {
  readonly [TStem in DeepAlignmentEventStem]: DeepAlignmentEventEnvelope<TStem>;
}[DeepAlignmentEventStem];

// ───────────────────────────────────────────────────────────────────
// 6. COMPATIBILITY TYPES
// ───────────────────────────────────────────────────────────────────

export type DeepAlignmentCompatibilityStatus =
  | 'blocked'
  | 'compatible'
  | 'degraded'
  | 'exact'
  | 'migrate'
  | 'pin-old-runtime';

export interface DeepAlignmentCompatibilityDecision {
  readonly status: DeepAlignmentCompatibilityStatus;
  readonly reasonCode: string;
  readonly targetStem: DeepAlignmentEventStem | null;
  readonly sourceVersion: number | null;
  readonly targetVersion: 1;
}

export interface LegacyUpcastContext {
  readonly scope:
    | DeepAlignmentBaseScope
    | DeepAlignmentGenerationScope
    | DeepAlignmentIterationScope
    | DeepAlignmentLaneScope;
  readonly prevEventHash: Digest;
  readonly replay: DeepAlignmentReplayMetadata;
}

export interface LegacyUpcastCandidate {
  readonly status: 'migrated';
  readonly targetStem: DeepAlignmentEventStem;
  readonly eventVersion: 1;
  readonly originalRecordDigest: Digest;
  readonly upcasterFingerprint: Fingerprint;
  readonly warnings: readonly string[];
  readonly scope:
    | DeepAlignmentBaseScope
    | DeepAlignmentGenerationScope
    | DeepAlignmentIterationScope
    | DeepAlignmentLaneScope;
  readonly prevEventHash: Digest;
  readonly replay: DeepAlignmentReplayMetadata;
  readonly data: JsonObject;
}

export type LegacyUpcastResult =
  | LegacyUpcastCandidate
  | {
    readonly status: 'refused';
    readonly decision: DeepAlignmentCompatibilityDecision;
  };
