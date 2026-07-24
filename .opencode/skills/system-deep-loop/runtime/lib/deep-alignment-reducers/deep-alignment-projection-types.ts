// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Projection Types
// ───────────────────────────────────────────────────────────────────

import type {
  DeepAlignmentEventStem,
  DeepAlignmentPayloadMap,
  SemanticFingerprintParts,
  TargetReference,
} from '../deep-alignment-ledger-schema/index.js';
import type {
  SharedReviewLoopBackboneResult,
  SharedReviewLoopModeConfiguration,
} from '../deep-review-reducers/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. VERSION AND OUTCOME TYPES
// ───────────────────────────────────────────────────────────────────

export type DeepAlignmentModeStatus =
  | 'planned'
  | 'active'
  | 'paused'
  | 'converging'
  | 'complete'
  | 'incomplete'
  | 'blocked'
  | 'failed';

export type DeepAlignmentProjectionHealth = 'healthy' | 'blocked' | 'rebuild-required';
export type DeepAlignmentConvergenceOutcome =
  SharedReviewLoopBackboneResult['outcome'];
export type DeepAlignmentConvergenceEligibility =
  SharedReviewLoopBackboneResult['eligibility'];
export type DeepAlignmentFindingLifecycle =
  | 'candidate'
  | 'adjudicated'
  | 'accepted'
  | 'dismissed'
  | 'fixed';
export type DeepAlignmentPresentationSeverity = 'none' | 'P0' | 'P1' | 'P2';
export type DeepAlignmentVerdict =
  | 'PASS'
  | 'FAIL'
  | 'WARN'
  | 'INCONCLUSIVE'
  | 'NOT_APPLICABLE'
  | 'SKIP'
  | 'EXEMPT';
export type DeepAlignmentArtifactAvailability =
  | 'pending'
  | 'available'
  | 'unavailable'
  | 'superseded';
export type DeepAlignmentRebuildReasonCode =
  | 'checkpoint-digest-mismatch'
  | 'codec-version-mismatch'
  | 'cursor-gap'
  | 'ordering-policy-mismatch'
  | 'projection-schema-mismatch'
  | 'reducer-version-mismatch'
  | 'source-truncated';
export type DeepAlignmentReducerErrorCode =
  | 'duplicate-event-conflict'
  | 'duplicate-owner'
  | 'duplicate-terminal-event'
  | 'event-not-deep-alignment'
  | 'event-schema-invalid'
  | 'identity-conflict'
  | 'impossible-status-transition'
  | 'impossible-transition'
  | 'projection-field-invalid'
  | 'projection-field-undeclared'
  | 'projection-not-frozen'
  | 'reducer-nondeterministic'
  | 'reducer-output-unowned'
  | 'referential-integrity'
  | 'run-identity-conflict'
  | 'run-not-initialized'
  | 'state-mutated';

// ───────────────────────────────────────────────────────────────────
// 2. RUN AND SHARED REVIEW-LOOP PROJECTIONS
// ───────────────────────────────────────────────────────────────────

export interface DeepAlignmentRunProjection {
  readonly runId: string | null;
  readonly sessionId: string | null;
  readonly authorityEpochId: string | null;
  readonly generation: number;
  readonly target: TargetReference | null;
  readonly maxIterations: number;
  readonly convergencePolicyVersion: string | null;
  readonly alignmentModeContractDigest: string | null;
  readonly initializationEventId: string | null;
}

export interface DeepAlignmentScopeProjection {
  readonly targetSetDigest: string | null;
  readonly scopeClass: 'bounded' | 'repository' | 'targeted' | null;
  readonly targets: TargetReference[];
  readonly orderedDimensionIds: string[];
  readonly scopeEvidenceRefs: string[];
  readonly orderingPolicyVersion: string | null;
}

export interface DeepAlignmentCoverageCell {
  readonly iterationId: string;
  readonly dimensionId: string;
  readonly required: boolean;
  readonly status: 'pending' | 'started' | 'complete' | 'incomplete' | 'blocked';
  readonly passNumber: number;
  readonly searchCoverageDigest: string | null;
  readonly producerEventId: string;
}

export interface DeepAlignmentPassOutcome {
  readonly iterationId: string;
  readonly dimensionId: string;
  readonly passNumber: number;
  readonly targetRefs: string[];
  readonly filesReviewed: string[];
  readonly searchCoverageDigest: string;
  readonly status: 'started' | 'complete' | 'incomplete' | 'blocked';
  readonly nextFocusRef: string;
  readonly producerEventId: string;
}

export interface DeepAlignmentObligation {
  readonly obligationId: string;
  readonly ownerLaneId: string | null;
  readonly kind:
    | 'applicability'
    | 'authority'
    | 'coverage'
    | 'evidence'
    | 'finding'
    | 'protocol'
    | 'verification';
  readonly required: boolean;
  readonly status: 'resolved' | 'unresolved' | 'blocked';
  readonly producerEventId: string;
}

export interface DeepAlignmentConvergenceEvaluation {
  readonly iterationId: string;
  readonly decision: 'blocked' | 'continue' | 'converged' | 'incomplete' | 'recover';
  readonly rawSignals: DeepAlignmentPayloadMap[
    'deep_alignment.convergence_evaluated'
  ]['rawSignals'];
  readonly weightedSignals: DeepAlignmentPayloadMap[
    'deep_alignment.convergence_evaluated'
  ]['weightedSignals'];
  readonly dimensionCoverageDigest: string;
  readonly protocolCoverageDigest: string;
  readonly findingStability: 'stable' | 'unstable' | 'unknown';
  readonly p0p1ResolutionState: 'blocked' | 'resolved' | 'unknown';
  readonly evidenceDensity: number;
  readonly hotspotSaturation: number;
  readonly policyFingerprint: string;
  readonly blockerIds: string[];
  readonly stopCandidate: boolean;
  readonly graphDecision: 'blocked' | 'continue' | 'converged' | 'unavailable' | null;
  readonly graphDigest: string | null;
  readonly producerEventId: string;
  readonly streamId: string;
}

export interface DeepAlignmentReviewLoopProjection {
  readonly configuration: SharedReviewLoopModeConfiguration;
  readonly scope: DeepAlignmentScopeProjection;
  readonly coverageCells: DeepAlignmentCoverageCell[];
  readonly passes: DeepAlignmentPassOutcome[];
  readonly obligations: DeepAlignmentObligation[];
  readonly evaluations: DeepAlignmentConvergenceEvaluation[];
  readonly currentIterationId: string | null;
  readonly eligibility: DeepAlignmentConvergenceEligibility;
  readonly outcome: DeepAlignmentConvergenceOutcome;
  readonly terminalDecision: 'blocked' | 'fail' | 'incomplete' | 'pass' | null;
  readonly blockerIds: string[];
  readonly lastAppliedSequence: number;
}

// ───────────────────────────────────────────────────────────────────
// 3. AUTHORITY, LANE, AND APPLICABILITY PROJECTIONS
// ───────────────────────────────────────────────────────────────────

export interface DeepAlignmentAuthorityReference {
  readonly authorityEpochId: string;
  readonly authorityId: string;
  readonly authorityCapsuleRef: string;
  readonly authoritySourceDigest: string;
  readonly compilerFingerprint: string;
  readonly profileDigest: string;
  readonly ruleIrDigest: string;
  readonly signatureDigest: string;
  readonly expiresAt: string;
  readonly rollbackRef: string | null;
  readonly producerEventId: string;
}

export interface DeepAlignmentAuthorityValidation {
  readonly authorityEpochId: string;
  readonly authorityReferenceEventId: string;
  readonly checks: DeepAlignmentPayloadMap[
    'deep_alignment.authority_validation_recorded'
  ]['checks'];
  readonly authorityStatus: DeepAlignmentPayloadMap[
    'deep_alignment.authority_validation_recorded'
  ]['authorityStatus'];
  readonly validationReceiptRefs: string[];
  readonly validatorFingerprint: string;
  readonly validationDigest: string;
  readonly blockedReasonCode: string | null;
  readonly producerEventId: string;
}

export interface DeepAlignmentAuthorityCompatibility {
  readonly sourceAuthorityEpochId: string;
  readonly targetAuthorityEpochId: string;
  readonly compatibilityClass: DeepAlignmentPayloadMap[
    'deep_alignment.authority_epoch_compatibility_recorded'
  ]['compatibilityClass'];
  readonly direction: 'backward' | 'forward';
  readonly affectedRuleIds: string[];
  readonly comparisonDigest: string;
  readonly reasonCode: string;
  readonly orderedUpcastPath: string[];
  readonly ambiguous: boolean;
  readonly lossy: boolean;
  readonly producerEventId: string;
}

export interface DeepAlignmentAuthorityWitnessReplay {
  readonly proofId: string;
  readonly laneId: string;
  readonly subjectId: string;
  readonly sourceAuthorityEpochId: string;
  readonly targetAuthorityEpochId: string;
  readonly witnessEventId: string;
  readonly compatibilityDecisionEventId: string;
  readonly replayOutcome: 'accepted' | 'blocked' | 'degraded';
  readonly replayDigest: string;
  readonly producerEventId: string;
}

export interface DeepAlignmentAuthorityProjection {
  readonly references: DeepAlignmentAuthorityReference[];
  readonly validations: DeepAlignmentAuthorityValidation[];
  readonly compatibilities: DeepAlignmentAuthorityCompatibility[];
  readonly witnessReplays: DeepAlignmentAuthorityWitnessReplay[];
  readonly activeValidationEventId: string | null;
  readonly status: 'missing' | 'invalid' | 'valid';
}

export interface DeepAlignmentLanePlan {
  readonly laneId: string;
  readonly iterationId: string;
  readonly authorityEpochId: string;
  readonly laneKind: 'deterministic' | 'reasoning-required' | 'relational' | 'schema';
  readonly orderedRuleIds: string[];
  readonly ruleIrRef: string;
  readonly ruleIrDigest: string;
  readonly verifierPolicyVersion: string;
  readonly budgetRef: string;
  readonly requiredEvidenceClasses: string[];
  readonly planDigest: string;
  readonly producerEventId: string;
}

export interface DeepAlignmentSubjectSnapshot {
  readonly subjectId: string;
  readonly laneId: string;
  readonly subjectSnapshotRef: string;
  readonly subjectType: 'artifact' | 'directory' | 'file' | 'repository' | 'symbol';
  readonly subjectDigest: string;
  readonly sourceVersionRef: string;
  readonly capturedAt: string;
  readonly parentSnapshotRef: string | null;
  readonly receiptRef: string;
  readonly producerEventId: string;
}

export interface DeepAlignmentLaneState {
  readonly laneId: string;
  readonly iterationId: string;
  readonly lanePlanEventId: string;
  readonly authorityValidationEventId: string;
  readonly subjectSnapshotRef: string;
  readonly subjectSnapshotDigest: string;
  readonly status: 'planned' | 'started' | 'complete' | 'incomplete' | 'blocked';
  readonly counts: DeepAlignmentPayloadMap['deep_alignment.lane_completed']['counts'] | null;
  readonly applicabilityDecisionRefs: string[];
  readonly observationRefs: string[];
  readonly verificationRefs: string[];
  readonly completionDigest: string | null;
  readonly blockedReasonCode: string | null;
  readonly producerEventId: string;
}

export interface DeepAlignmentLanePlanProjection {
  readonly plans: DeepAlignmentLanePlan[];
  readonly subjects: DeepAlignmentSubjectSnapshot[];
  readonly lanes: DeepAlignmentLaneState[];
}

export interface DeepAlignmentApplicabilityDecision {
  readonly decisionId: string;
  readonly laneId: string;
  readonly subjectId: string;
  readonly ruleId: string;
  readonly authorityValidationEventId: string;
  readonly result: 'applicable' | 'blocked' | 'not_applicable' | 'unresolved';
  readonly predicateRef: string;
  readonly predicateDigest: string;
  readonly targetFactRefs: string[];
  readonly targetFactDigest: string;
  readonly evaluatorFingerprint: string;
  readonly decisionDigest: string;
  readonly reasonCode: string;
  readonly producerEventId: string;
}

export interface DeepAlignmentApplicabilityCoverage {
  readonly laneId: string;
  readonly authorityValidationEventId: string;
  readonly subjectSnapshotDigest: string;
  readonly declaredApplicabilityEdgeRefs: string[];
  readonly applicableRuleIds: string[];
  readonly notApplicableRuleIds: string[];
  readonly unresolvedRuleIds: string[];
  readonly untestedRuleIds: string[];
  readonly blockedRuleIds: string[];
  readonly coverageDigest: string;
  readonly producerEventId: string;
}

export interface DeepAlignmentApplicabilityProjection {
  readonly decisions: DeepAlignmentApplicabilityDecision[];
  readonly coverage: DeepAlignmentApplicabilityCoverage[];
}

// ───────────────────────────────────────────────────────────────────
// 4. OBSERVATION, VERIFICATION, AND CONFORMANCE PROJECTIONS
// ───────────────────────────────────────────────────────────────────

export interface DeepAlignmentObservation {
  readonly observationId: string;
  readonly laneId: string;
  readonly subjectId: string;
  readonly ruleId: string;
  readonly applicabilityDecisionId: string;
  readonly subjectSnapshotRef: string;
  readonly subjectSnapshotDigest: string;
  readonly detectorFingerprint: string;
  readonly observationKind: 'deterministic' | 'reasoning' | 'relational' | 'schema';
  readonly rawResultDigest: string;
  readonly sourceDigest: string;
  readonly contentDigest: string;
  readonly evidenceClass: string;
  readonly freshness: 'fresh' | 'stale' | 'unknown';
  readonly causalRelevance: 'direct' | 'indirect' | 'unknown';
  readonly locator: DeepAlignmentPayloadMap['deep_alignment.observation_recorded']['locator'];
  readonly receiptRefs: string[];
  readonly producerEventId: string;
}

export interface DeepAlignmentEvidenceReceipt {
  readonly evidenceId: string;
  readonly observationId: string;
  readonly observationEventId: string;
  readonly laneId: string;
  readonly subjectId: string;
  readonly ruleId: string;
  readonly receiptRef: string;
  readonly receiptDigest: string;
  readonly evidenceClass: string;
  readonly freshness: 'fresh' | 'stale' | 'unknown';
  readonly sourceDigest: string;
  readonly contentDigest: string;
  readonly toolFingerprint: string;
  readonly capturedAt: string;
  readonly producerEventId: string;
}

export interface DeepAlignmentObservationReconciliation {
  readonly observationId: string;
  readonly observationEventId: string;
  readonly predecessorObservationEventId: string;
  readonly evidenceReceiptRefs: string[];
  readonly outcome: 'confirmed' | 'contradicted' | 'degraded' | 'superseded';
  readonly evidenceSetDigest: string;
  readonly reconcilerFingerprint: string;
  readonly reasonCode: string;
  readonly producerEventId: string;
}

export interface DeepAlignmentFindingCandidate {
  readonly candidateId: string;
  readonly laneId: string;
  readonly subjectId: string;
  readonly ruleId: string;
  readonly observationId: string;
  readonly observationEventId: string;
  readonly applicabilityDecisionId: string;
  readonly evidenceReceiptRefs: string[];
  readonly detectorFingerprint: string;
  readonly detectorBlindingDigest: string;
  readonly candidateClaimDigest: string;
  readonly findingClass: string;
  readonly rawImpact: number;
  readonly rawConfidence: number;
  readonly rawCandidateScore: number;
  readonly scorerFingerprint: string;
  readonly scoringPolicyVersion: string;
  readonly semanticFingerprint: SemanticFingerprintParts;
  readonly sourcePassEventId: string;
  readonly producerEventId: string;
}

export interface DeepAlignmentFindingVerification {
  readonly verificationId: string;
  readonly findingId: string;
  readonly candidateId: string;
  readonly observationId: string;
  readonly candidateEventId: string;
  readonly observationEventId: string;
  readonly authorityValidationEventId: string;
  readonly subjectSnapshotRef: string;
  readonly subjectSnapshotDigest: string;
  readonly applicabilityDecisionId: string;
  readonly evidenceReceiptRefs: string[];
  readonly verifierFingerprint: string;
  readonly verifierIndependenceDigest: string;
  readonly proofWitnessRefs: string[];
  readonly verificationMode:
    | 'deterministic'
    | 'independent-reasoning'
    | 'relational'
    | 'schema';
  readonly result: 'blocked' | 'confirmed' | 'disproved' | 'inconclusive';
  readonly rawImpact: number;
  readonly rawConfidence: number;
  readonly evidenceStrength: number;
  readonly counterevidenceRefs: string[];
  readonly verificationDigest: string;
  readonly producerEventId: string;
}

export interface DeepAlignmentProofWitness {
  readonly proofId: string;
  readonly findingId: string;
  readonly candidateId: string;
  readonly verificationId: string;
  readonly verificationEventId: string;
  readonly witnessKind: 'boundary' | 'negative' | 'positive' | 'stateful';
  readonly artifactRef: string;
  readonly witnessDigest: string;
  readonly sourceDigest: string;
  readonly locator: DeepAlignmentPayloadMap['deep_alignment.proof_witness_recorded']['locator'];
  readonly minimized: boolean;
  readonly minimizerFingerprint: string;
  readonly replayRecipeRef: string;
  readonly replayRecipeDigest: string;
  readonly outcome: 'contradicts' | 'inconclusive' | 'supports';
  readonly receiptRefs: string[];
  readonly producerEventId: string;
}

export interface DeepAlignmentAdjudication {
  readonly findingId: string;
  readonly candidateId: string;
  readonly verificationId: string;
  readonly observationId: string;
  readonly candidateEventId: string;
  readonly verificationEventId: string;
  readonly observationEventId: string;
  readonly claimDigest: string;
  readonly evidenceReceiptRefs: string[];
  readonly proofWitnessRefs: string[];
  readonly counterevidenceRefs: string[];
  readonly verifierFingerprint: string;
  readonly assessorFingerprint: string;
  readonly authorityValidationEventId: string;
  readonly applicabilityDecisionId: string;
  readonly subjectSnapshotDigest: string;
  readonly impact: number;
  readonly confidence: number;
  readonly outcome: 'accepted' | 'blocked' | 'deferred' | 'disproved' | 'rejected';
  readonly transition: 'candidate-to-finding' | 'candidate-to-rejected' | 'finding-reaffirmed';
  readonly adjudicationDigest: string;
  readonly predecessorAdjudicationEventId: string | null;
  readonly derivedSeverity: DeepAlignmentPresentationSeverity;
  readonly hardVeto: boolean;
  readonly producerEventId: string;
}

export interface DeepAlignmentFinding {
  readonly findingId: string;
  readonly candidateId: string;
  readonly laneId: string;
  readonly subjectId: string;
  readonly ruleId: string;
  readonly observationId: string;
  readonly findingClass: string;
  readonly lifecycle: DeepAlignmentFindingLifecycle;
  readonly adjudicationOutcome: DeepAlignmentAdjudication['outcome'] | null;
  readonly impact: number;
  readonly confidence: number;
  readonly derivedSeverity: DeepAlignmentPresentationSeverity;
  readonly hardVeto: boolean;
  readonly candidateEventId: string;
  readonly verificationEventId: string | null;
  readonly adjudicationEventId: string | null;
  readonly predecessorEventId: string | null;
}

export interface DeepAlignmentConformanceAssessment {
  readonly findingId: string;
  readonly laneId: string;
  readonly subjectId: string;
  readonly ruleId: string;
  readonly adjudicationEventId: string;
  readonly verificationEventId: string;
  readonly authorityValidationEventId: string;
  readonly applicabilityDecisionId: string;
  readonly conformanceStatus:
    | 'blocked'
    | 'conformant'
    | 'inconclusive'
    | 'non_conformant'
    | 'not_applicable'
    | 'untested';
  readonly rawImpact: number;
  readonly rawConfidence: number;
  readonly verifierFingerprint: string;
  readonly proofWitnessRefs: string[];
  readonly evidenceReceiptRefs: string[];
  readonly assessmentPolicyVersion: string;
  readonly assessmentDigest: string;
  readonly producerEventId: string;
}

export interface DeepAlignmentKnownDeviation {
  readonly deviationId: string;
  readonly findingId: string;
  readonly originalFindingEventId: string;
  readonly conformanceAssessmentEventId: string;
  readonly authorityEpochRef: string;
  readonly verifierFingerprint: string;
  readonly issuerId: string;
  readonly rationale: string;
  readonly scopePredicateRef: string;
  readonly scopePredicateDigest: string;
  readonly subjectSnapshotDigest: string;
  readonly expiresAt: string | null;
  readonly invalidationConditionRefs: string[];
  readonly status: 'active' | 'invalidated';
  readonly invalidationEventId: string | null;
  readonly producerEventId: string;
}

export interface DeepAlignmentLaneVerdict {
  readonly laneId: string;
  readonly verdict: DeepAlignmentVerdict;
  readonly blockerIds: string[];
  readonly findingIds: string[];
}

export interface DeepAlignmentConformanceProjection {
  readonly observations: DeepAlignmentObservation[];
  readonly reconciliations: DeepAlignmentObservationReconciliation[];
  readonly candidates: DeepAlignmentFindingCandidate[];
  readonly verifications: DeepAlignmentFindingVerification[];
  readonly adjudications: DeepAlignmentAdjudication[];
  readonly findings: DeepAlignmentFinding[];
  readonly assessments: DeepAlignmentConformanceAssessment[];
  readonly deviations: DeepAlignmentKnownDeviation[];
  readonly laneVerdicts: DeepAlignmentLaneVerdict[];
  readonly overallVerdict: DeepAlignmentVerdict;
  readonly activeFindingIds: string[];
  readonly hardVetoFindingIds: string[];
}

export interface DeepAlignmentProofWitnessProjection {
  readonly evidenceReceipts: DeepAlignmentEvidenceReceipt[];
  readonly witnesses: DeepAlignmentProofWitness[];
}

// ───────────────────────────────────────────────────────────────────
// 5. ARTIFACT, STATUS, AND PUBLIC RESULTS
// ───────────────────────────────────────────────────────────────────

export interface DeepAlignmentArtifactRecord {
  readonly artifactId: string;
  readonly logicalArtifactId: string;
  readonly artifactKind:
    | 'authority-reference'
    | 'subject-snapshot'
    | 'observation'
    | 'evidence-receipt'
    | 'verification'
    | 'proof-witness'
    | 'adjudication'
    | 'conformance-assessment'
    | 'known-deviation'
    | 'review-report'
    | 'continuity-save';
  readonly producerEventId: string;
  readonly ownerEntityId: string;
  readonly reviewedInputIdentity: string;
  readonly contentDigest: string;
  readonly availability: DeepAlignmentArtifactAvailability;
  readonly freshness: 'fresh' | 'stale' | 'unknown';
  readonly authorityEpochId: string;
  readonly verifierRevision: string | null;
  readonly supersedesArtifactIds: string[];
  readonly supersededByArtifactIds: string[];
}

export interface DeepAlignmentStatusTransition {
  readonly state: DeepAlignmentModeStatus;
  readonly producerEventId: string;
  readonly producerStem: DeepAlignmentEventStem;
  readonly streamId: string;
  readonly logicalSequence: number;
  readonly blockingReason: string | null;
}

export interface DeepAlignmentStatusProjection {
  readonly state: DeepAlignmentModeStatus;
  readonly terminal: boolean;
  readonly health: DeepAlignmentProjectionHealth;
  readonly activeContractVersions: string[];
  readonly activeAuthorityEpochs: string[];
  readonly laneStatuses: ReadonlyArray<{
    readonly laneId: string;
    readonly status: DeepAlignmentLaneState['status'];
  }>;
  readonly lastAppliedSequence: number;
  readonly blockingReason: string | null;
  readonly shadowParityState: 'not-run';
  readonly provenance: DeepAlignmentStatusTransition[];
}

export interface DeepAlignmentSeenEvent {
  readonly eventId: string;
  readonly eventDigest: string;
  readonly stem: DeepAlignmentEventStem;
  readonly streamId: string;
  readonly streamSequence: number;
}

export interface DeepAlignmentProjectionCursors {
  readonly reviewLoop: number;
  readonly authorityAlignment: number;
  readonly lanePlan: number;
  readonly applicability: number;
  readonly conformance: number;
  readonly proofWitness: number;
  readonly artifactIndex: number;
  readonly status: number;
}

export interface DeepAlignmentProjectionState {
  readonly schemaVersion: string;
  readonly reducerVersion: string;
  readonly codecVersion: string;
  readonly orderingPolicyVersion: string;
  readonly run: DeepAlignmentRunProjection;
  readonly reviewLoop: DeepAlignmentReviewLoopProjection;
  readonly authorityAlignment: DeepAlignmentAuthorityProjection;
  readonly lanePlan: DeepAlignmentLanePlanProjection;
  readonly applicability: DeepAlignmentApplicabilityProjection;
  readonly conformance: DeepAlignmentConformanceProjection;
  readonly proofWitness: DeepAlignmentProofWitnessProjection;
  readonly artifactIndex: {
    readonly artifacts: DeepAlignmentArtifactRecord[];
  };
  readonly status: DeepAlignmentStatusProjection;
  readonly cursors: DeepAlignmentProjectionCursors;
  readonly seenEvents: DeepAlignmentSeenEvent[];
}

export type DeepAlignmentPersistedField = keyof DeepAlignmentProjectionState & string;

export interface DeepAlignmentProjectionCheckpoint {
  readonly projection: DeepAlignmentProjectionState;
  readonly integrityDigest: string;
  readonly sourceTailSequence: number;
  readonly sourceTailEventDigest: string;
}

export interface DeepAlignmentProjectedResult {
  readonly outcome: 'projected';
  readonly projection: DeepAlignmentProjectionState;
  readonly integrityDigest: string;
  readonly checkpoint: DeepAlignmentProjectionCheckpoint;
}

export interface DeepAlignmentRebuildRequiredResult {
  readonly outcome: 'rebuild_required';
  readonly reasonCodes: readonly DeepAlignmentRebuildReasonCode[];
}

export type DeepAlignmentFoldResult =
  | DeepAlignmentProjectedResult
  | DeepAlignmentRebuildRequiredResult;

export interface DeepAlignmentFoldOptions {
  readonly checkpoint?: DeepAlignmentProjectionCheckpoint;
  readonly expectedSchemaVersion?: string;
  readonly expectedReducerVersion?: string;
  readonly expectedCodecVersion?: string;
  readonly expectedOrderingPolicyVersion?: string;
  readonly sourceTailSequence?: number;
  readonly requireContiguousTail?: boolean;
}

export interface DeepAlignmentLegacyProjection {
  readonly authority: 'shadow-only';
  readonly legacyAuthority: 'unchanged';
  readonly iteration: string | null;
  readonly status: DeepAlignmentModeStatus;
  readonly terminalDecision: 'blocked' | 'fail' | 'incomplete' | 'pass' | null;
  readonly lanes: DeepAlignmentLaneState[];
  readonly applicability: DeepAlignmentApplicabilityDecision[];
  readonly verdicts: DeepAlignmentLaneVerdict[];
  readonly artifacts: DeepAlignmentArtifactRecord[];
  readonly projectionHealth: DeepAlignmentProjectionHealth;
  readonly parityFingerprint: string;
}

export interface DeepAlignmentProjectionFieldOwnership {
  readonly field: DeepAlignmentPersistedField;
  readonly ownerReducerId: string;
  readonly inputStems: readonly DeepAlignmentEventStem[];
  readonly foldAlgebra: 'constant' | 'insert-sorted' | 'insert-sorted-and-derive';
  readonly immutableOutput: true;
}
