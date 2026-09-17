// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Projection Types
// ───────────────────────────────────────────────────────────────────

import type {
  ConvergenceQualityGateResults,
  DeepResearchEventStem,
  RawConvergenceSignals,
  ScoreVector,
  SourceLocator,
  PassageLocator,
  TrustedConvergenceSignals,
} from '../deep-research-ledger-schema/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. VERSION AND OUTCOME TYPES
// ───────────────────────────────────────────────────────────────────

export type DeepResearchModeStatus =
  | 'planned'
  | 'active'
  | 'paused'
  | 'awaiting-evidence'
  | 'converged'
  | 'incomplete'
  | 'blocked'
  | 'quarantined'
  | 'failed';

export type DeepResearchConvergenceEligibility =
  | 'CONTINUE'
  | 'STOP_ELIGIBLE'
  | 'INDETERMINATE';

export type DeepResearchConvergenceOutcome =
  | 'active'
  | 'blocked'
  | 'converged'
  | 'incomplete'
  | 'quarantined';

export type DeepResearchArtifactKind =
  | 'source-capture'
  | 'iteration-output'
  | 'research-report'
  | 'continuity-save';

export type DeepResearchArtifactValidity =
  | 'pending'
  | 'valid'
  | 'invalid'
  | 'unknown'
  | 'superseded'
  | 'unavailable';

export type DeepResearchFoldOutcome = 'projected' | 'rebuild_required';

export type DeepResearchRebuildReasonCode =
  | 'checkpoint-digest-mismatch'
  | 'codec-version-mismatch'
  | 'cursor-gap'
  | 'ordering-policy-mismatch'
  | 'projection-schema-mismatch'
  | 'reducer-version-mismatch'
  | 'source-truncated';

export type DeepResearchReducerErrorCode =
  | 'claim-version-conflict'
  | 'duplicate-event-conflict'
  | 'duplicate-owner'
  | 'duplicate-terminal-event'
  | 'event-not-deep-research'
  | 'event-schema-invalid'
  | 'impossible-status-transition'
  | 'projection-field-invalid'
  | 'projection-field-undeclared'
  | 'projection-not-frozen'
  | 'reducer-nondeterministic'
  | 'reducer-output-unowned'
  | 'run-identity-conflict'
  | 'run-not-initialized'
  | 'source-version-conflict'
  | 'state-mutated';

// ───────────────────────────────────────────────────────────────────
// 2. RUN AND RESEARCH-PLAN PROJECTIONS
// ───────────────────────────────────────────────────────────────────

export interface DeepResearchRunProjection {
  readonly runId: string | null;
  readonly lineageId: string | null;
  readonly generation: number;
  readonly charterDigest: string | null;
  readonly configDigest: string | null;
  readonly executorFingerprint: string | null;
  readonly replayFingerprint: string | null;
  readonly maxIterations: number;
  readonly convergencePolicyVersion: string | null;
  readonly initializationEventId: string | null;
}

export interface DeepResearchQuestionNode {
  readonly questionId: string;
  readonly normalizedQuestionDigest: string;
  readonly dependencyQuestionIds: string[];
  readonly requiredSourceClasses: string[];
  readonly disconfirmingQueryRecipeIds: string[];
  readonly budgetRef: string;
  readonly producerEventId: string;
}

export interface DeepResearchBranchNode {
  readonly questionId: string;
  readonly branchId: string;
  readonly semanticClusterId: string;
  readonly expectedYieldScoreVector: ScoreVector;
  readonly contradictionRisk: number;
  readonly impact: number;
  readonly independenceGain: number;
  readonly staleness: number;
  readonly expectedCost: number;
  readonly tieBreakKey: string;
  readonly reservationRef: string;
  readonly lifecycle: 'planned' | 'selected';
  readonly plannedEventId: string | null;
  readonly selectedEventId: string | null;
}

export interface DeepResearchFocusObligation {
  readonly iteration: number;
  readonly obligationId: string;
  readonly selectionScoreVector: ScoreVector;
  readonly visitCooldown: number;
  readonly policyVersion: string;
  readonly chosenBranchId: string | null;
  readonly chosenQuestionId: string | null;
  readonly producerEventId: string;
}

export interface DeepResearchResearchPlanProjection {
  readonly planDigest: string;
  readonly questions: DeepResearchQuestionNode[];
  readonly branches: DeepResearchBranchNode[];
  readonly focusObligations: DeepResearchFocusObligation[];
}

// ───────────────────────────────────────────────────────────────────
// 3. CLAIM-EVIDENCE-CONTRADICTION PROJECTION
// ───────────────────────────────────────────────────────────────────

export interface DeepResearchSourceRecord {
  readonly iteration: number;
  readonly sourceVersionId: string;
  readonly sourceIdentityDigest: string;
  readonly locator: SourceLocator;
  readonly capturedAt: string;
  readonly contentDigest: string;
  readonly mediaType: string;
  readonly retrievalReceiptRef: string;
  readonly parentSourceVersionId: string | null;
  readonly instructionScanResult: 'clean' | 'flagged' | 'unknown';
  readonly producerEventId: string;
}

export interface DeepResearchEvidenceRecord {
  readonly iteration: number;
  readonly sourceVersionId: string;
  readonly evidenceId: string;
  readonly disposition: 'admit' | 'degrade' | 'quarantine';
  readonly passageLocators: PassageLocator[];
  readonly atomicClaimRefs: string[];
  readonly derivativeSourceGroup: string;
  readonly admissionPolicyVersion: string;
  readonly contaminationStatus: 'clean' | 'contaminated' | 'suspected' | 'unknown';
  readonly reasonCode: string;
  readonly producerEventId: string;
}

export interface DeepResearchClaimRecord {
  readonly iteration: number;
  readonly claimId: string;
  readonly claimVersionId: string;
  readonly normalizedClaimDigest: string | null;
  readonly relatedClaimVersionId: string | null;
  readonly relation: 'asserts' | 'contextualizes' | 'contradicts' | 'qualifies' | 'supports';
  readonly evidenceIds: string[];
  readonly independenceGroup: string;
  readonly rawConfidence: number;
  readonly claimStatus: 'contested' | 'supported' | 'unresolved';
  readonly producerEventId: string;
}

export interface DeepResearchClaimSupersession {
  readonly iteration: number;
  readonly priorClaimVersionId: string;
  readonly successorClaimVersionId: string;
  readonly supersessionReason: string;
  readonly effectiveAt: string;
  readonly replacementEvidenceIds: string[];
  readonly invalidationScope: string;
  readonly producerEventId: string;
}

export interface DeepResearchGapObligation {
  readonly iteration: number;
  readonly obligationId: string;
  readonly gapKind: 'contradiction' | 'coverage' | 'source-diversity' | 'verification';
  readonly affectedClaimIds: string[];
  readonly affectedQuestionIds: string[];
  readonly criticality: number;
  readonly proposedQueryRecipeIds: string[];
  readonly producerEventId: string;
}

export interface DeepResearchClaimEvidenceProjection {
  readonly sources: DeepResearchSourceRecord[];
  readonly evidence: DeepResearchEvidenceRecord[];
  readonly claims: DeepResearchClaimRecord[];
  readonly supersessions: DeepResearchClaimSupersession[];
  readonly gapObligations: DeepResearchGapObligation[];
  readonly activeClaimVersionIds: string[];
  readonly contradictionClaimVersionIds: string[];
}

// ───────────────────────────────────────────────────────────────────
// 4. ITERATION AND CONVERGENCE PROJECTIONS
// ───────────────────────────────────────────────────────────────────

export interface DeepResearchIterationRecord {
  readonly iteration: number;
  readonly lifecycle: 'planned' | 'started' | 'complete' | 'error' | 'insight'
    | 'stuck' | 'thought' | 'timeout';
  readonly focusRef: string | null;
  readonly stateTailDigest: string | null;
  readonly strategyDigest: string | null;
  readonly startedEventId: string | null;
  readonly completedEventId: string | null;
  readonly rawNewInfoRatio: number | null;
  readonly trustedEvidenceYield: number | null;
  readonly outputDigest: string | null;
  readonly ruledOutApproachRefs: string[];
  readonly nextFocusCausationId: string | null;
}

export interface DeepResearchIterationProjection {
  readonly currentIteration: number;
  readonly records: DeepResearchIterationRecord[];
}

export interface DeepResearchConvergenceEvaluation {
  readonly iteration: number;
  readonly streamId: string;
  readonly logicalSequence: number;
  readonly decision: 'blocked' | 'continue' | 'converged' | 'incomplete' | 'recover';
  readonly rawSignals: RawConvergenceSignals;
  readonly trustedSignals: TrustedConvergenceSignals;
  readonly qualityGateResults: ConvergenceQualityGateResults;
  readonly blockerIds: string[];
  readonly policyFingerprint: string;
  readonly evaluatorFingerprint: string;
  readonly evidenceTailHash: string;
  readonly incompleteReason: string | null;
  readonly recoveryReason: string | null;
  readonly producerEventId: string;
}

export interface DeepResearchConvergenceProjection {
  readonly evaluations: DeepResearchConvergenceEvaluation[];
  readonly observedRevision: string | null;
  readonly finalizedRevision: string | null;
  readonly eligibility: DeepResearchConvergenceEligibility;
  readonly outcome: DeepResearchConvergenceOutcome;
  readonly trustedEvidenceYield: number;
  readonly rawNewInfoRatio: number;
  readonly blockerIds: string[];
}

// ───────────────────────────────────────────────────────────────────
// 5. ARTIFACT AND STATUS PROJECTIONS
// ───────────────────────────────────────────────────────────────────

export interface DeepResearchArtifactRecord {
  readonly artifactId: string;
  readonly logicalArtifactId: string;
  readonly artifactKind: DeepResearchArtifactKind;
  readonly digest: string;
  readonly schemaVersion: string;
  readonly producerEventId: string;
  readonly streamId: string;
  readonly logicalSequence: number;
  readonly runId: string;
  readonly lineageId: string;
  readonly iteration: number | null;
  readonly branchId: string | null;
  readonly receiptRefs: string[];
  readonly observedValidityState: Exclude<DeepResearchArtifactValidity, 'superseded'>;
  readonly validityState: DeepResearchArtifactValidity;
  readonly supersedesArtifactIds: string[];
  readonly supersededByArtifactIds: string[];
}

export interface DeepResearchArtifactIndexProjection {
  readonly artifacts: DeepResearchArtifactRecord[];
}

export interface DeepResearchStatusTransition {
  readonly state: DeepResearchModeStatus;
  readonly producerEventId: string;
  readonly producerStem: DeepResearchEventStem;
  readonly streamId: string;
  readonly logicalSequence: number;
  readonly transitionReason: string | null;
}

export interface DeepResearchStatusProjection {
  readonly state: DeepResearchModeStatus;
  readonly terminal: boolean;
  readonly provenance: DeepResearchStatusTransition[];
}

// ───────────────────────────────────────────────────────────────────
// 6. REPLAY STATE AND PUBLIC RESULTS
// ───────────────────────────────────────────────────────────────────

export interface DeepResearchSeenEvent {
  readonly eventId: string;
  readonly eventDigest: string;
  readonly streamId: string;
  readonly streamSequence: number;
}

export interface DeepResearchProjectionCursors {
  readonly researchPlan: number;
  readonly claimLedger: number;
  readonly iteration: number;
  readonly convergence: number;
  readonly artifactIndex: number;
  readonly status: number;
}

export interface DeepResearchProjectionState {
  readonly schemaVersion: string;
  readonly reducerVersion: string;
  readonly codecVersion: string;
  readonly orderingPolicyVersion: string;
  readonly run: DeepResearchRunProjection;
  readonly researchPlan: DeepResearchResearchPlanProjection;
  readonly claimLedger: DeepResearchClaimEvidenceProjection;
  readonly iterations: DeepResearchIterationProjection;
  readonly convergence: DeepResearchConvergenceProjection;
  readonly artifactIndex: DeepResearchArtifactIndexProjection;
  readonly status: DeepResearchStatusProjection;
  readonly cursors: DeepResearchProjectionCursors;
  readonly seenEvents: DeepResearchSeenEvent[];
}

export type DeepResearchPersistedField = keyof DeepResearchProjectionState & string;

export interface DeepResearchProjectionCheckpoint {
  readonly projection: DeepResearchProjectionState;
  readonly integrityDigest: string;
  readonly sourceTailSequence: number;
}

export interface DeepResearchProjectedResult {
  readonly outcome: 'projected';
  readonly projection: DeepResearchProjectionState;
  readonly integrityDigest: string;
  readonly checkpoint: DeepResearchProjectionCheckpoint;
}

export interface DeepResearchRebuildRequiredResult {
  readonly outcome: 'rebuild_required';
  readonly reasonCodes: readonly DeepResearchRebuildReasonCode[];
}

export type DeepResearchFoldResult =
  | DeepResearchProjectedResult
  | DeepResearchRebuildRequiredResult;

export interface DeepResearchFoldOptions {
  readonly checkpoint?: DeepResearchProjectionCheckpoint;
  readonly expectedSchemaVersion?: string;
  readonly expectedReducerVersion?: string;
  readonly expectedCodecVersion?: string;
  readonly expectedOrderingPolicyVersion?: string;
  readonly sourceTailSequence?: number;
  readonly requireContiguousTail?: boolean;
}

export interface DeepResearchLegacyProjection {
  readonly authority: 'shadow-only';
  readonly legacyAuthority: 'unchanged';
  readonly iteration: number;
  readonly status: DeepResearchModeStatus;
  readonly newInfoRatio: number;
  readonly trustedEvidenceYield: number;
  readonly nextFocusRef: string | null;
  readonly lossyFields: string[];
}

export interface DeepResearchProjectionFieldOwnership {
  readonly field: DeepResearchPersistedField;
  readonly ownerReducerId: string;
  readonly inputStems: readonly DeepResearchEventStem[];
  readonly foldAlgebra: 'constant' | 'insert-sorted' | 'insert-sorted-and-derive';
  readonly immutableOutput: true;
}
