// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Projection Types
// ───────────────────────────────────────────────────────────────────

import type {
  DeepImprovementCommonEventStem,
  DeepImprovementScoreVector,
  DeepImprovementVariant,
} from '../deep-improvement-common-ledger-schema/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. VERSION, STATUS, AND ERROR TYPES
// ───────────────────────────────────────────────────────────────────

export type DeepImprovementCommonWorkstream =
  | 'deep-improvement-common'
  | DeepImprovementVariant;

export type DeepImprovementCommonRunState =
  | 'planned'
  | 'active'
  | 'paused'
  | 'completed'
  | 'aborted'
  | 'quarantined';

export type DeepImprovementCommonModeState =
  | 'planned'
  | 'active'
  | 'paused'
  | 'awaiting-evaluation'
  | 'offline-accepted'
  | 'awaiting-canary'
  | 'promotion-proposed'
  | 'ship-eligible'
  | 'shadow'
  | 'canary'
  | 'shipped'
  | 'inconclusive'
  | 'blocked'
  | 'quarantined'
  | 'aborted'
  | 'rolled-back'
  | 'completed'
  | 'failed';

export type DeepImprovementCommonCandidateStage =
  | 'proposed'
  | 'generated'
  | 'rejected'
  | 'evaluating'
  | 'scored'
  | 'verified'
  | 'inconclusive'
  | 'failed';

export type DeepImprovementCommonCanaryStage =
  | 'not-started'
  | 'sealed'
  | 'executed'
  | 'passed'
  | 'failed'
  | 'vetoed';

export type DeepImprovementCommonPromotionStage =
  | 'not-proposed'
  | 'proposed'
  | 'authorized'
  | 'denied'
  | 'shadow'
  | 'canary'
  | 'paused'
  | 'aborted'
  | 'rolled-back'
  | 'shipped';

export type DeepImprovementCommonAuthorityState =
  | 'legacy'
  | 'shadow'
  | 'canary'
  | 'eligible'
  | 'authorized'
  | 'authoritative'
  | 'denied'
  | 'rollback-required'
  | 'restored';

export type DeepImprovementCommonArtifactKind =
  | 'proposal'
  | 'candidate'
  | 'raw-observation'
  | 'normalized-score'
  | 'verification'
  | 'canary-suite'
  | 'canary-observation'
  | 'promotion-receipt'
  | 'rollback-receipt'
  | 'run-checkpoint';

export type DeepImprovementCommonArtifactAvailability =
  | 'available'
  | 'pending'
  | 'invalid'
  | 'unavailable'
  | 'superseded';

export type DeepImprovementCommonFoldOutcome =
  | 'projected'
  | 'rebuild_required';

export type DeepImprovementCommonRebuildReasonCode =
  | 'checkpoint-digest-mismatch'
  | 'codec-version-mismatch'
  | 'cursor-gap'
  | 'event-order-invalid'
  | 'ordering-policy-mismatch'
  | 'projection-schema-mismatch'
  | 'reducer-version-mismatch'
  | 'source-truncated';

export type DeepImprovementCommonReducerErrorCode =
  | 'duplicate-event-conflict'
  | 'duplicate-owner'
  | 'event-not-deep-improvement-common'
  | 'event-schema-invalid'
  | 'impossible-status-transition'
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
// 2. RUN AND ITERATION/CONVERGENCE PROJECTIONS
// ───────────────────────────────────────────────────────────────────

export interface DeepImprovementCommonRunProjection {
  readonly runId: string | null;
  readonly lineageId: string | null;
  readonly variant: DeepImprovementVariant | null;
  readonly generation: number;
  readonly charterDigest: string | null;
  readonly configDigest: string | null;
  readonly operatorRef: string | null;
  readonly serviceContractVersion: string | null;
  readonly replayFingerprint: string | null;
  readonly maxIterations: number;
  readonly initializationEventId: string | null;
  readonly state: DeepImprovementCommonRunState;
}

export interface DeepImprovementCommonEvaluatorEpoch {
  readonly evaluationEpochId: string;
  readonly candidateId: string;
  readonly evaluatorRef: string;
  readonly evaluatorCapsuleDigest: string;
  readonly fixtureSetRef: string;
  readonly fixtureSetDigest: string;
  readonly scorePolicyVersion: string;
  readonly scoreWriteBackendRef: string;
  readonly evaluationBudgetRef: string;
  readonly sealedEventId: string;
  readonly startedEventId: string | null;
}

export interface DeepImprovementCommonCandidateProgress {
  readonly candidateId: string;
  readonly stage: DeepImprovementCommonCandidateStage;
  readonly proposalEventId: string;
  readonly generatedEventId: string | null;
  readonly terminalEventId: string | null;
}

export interface DeepImprovementCommonCanaryRecord {
  readonly candidateId: string;
  readonly canaryEpochId: string;
  readonly canarySuiteId: string;
  readonly stage: DeepImprovementCommonCanaryStage;
  readonly suiteEventId: string;
  readonly executionEventIds: string[];
  readonly gateEventId: string | null;
}

export interface DeepImprovementCommonPromotionRecord {
  readonly promotionId: string;
  readonly candidateId: string;
  readonly baselineId: string;
  readonly stage: DeepImprovementCommonPromotionStage;
  readonly requestedRollout: 'canary' | 'shadow' | null;
  readonly proposalEventId: string;
  readonly authorizationEventId: string | null;
  readonly rolloutEventIds: string[];
  readonly terminalEventId: string | null;
}

export interface DeepImprovementCommonHardVeto {
  readonly candidateId: string;
  readonly vetoCode: string;
  readonly source:
    | 'canary'
    | 'evaluator-integrity'
    | 'promotion'
    | 'verification';
  readonly evidenceRef: string;
  readonly evidenceDigest: string;
  readonly producerEventId: string;
}

export interface DeepImprovementCommonIterationConvergenceProjection {
  readonly currentIteration: number;
  readonly evaluatorEpochs: DeepImprovementCommonEvaluatorEpoch[];
  readonly candidates: DeepImprovementCommonCandidateProgress[];
  readonly canaries: DeepImprovementCommonCanaryRecord[];
  readonly promotions: DeepImprovementCommonPromotionRecord[];
  readonly evaluationBudgetRefs: string[];
  readonly unresolvedEvidenceRefs: string[];
  readonly hardVetoes: DeepImprovementCommonHardVeto[];
  readonly stopReason:
    | 'blockedStop'
    | 'converged'
    | 'error'
    | 'manualStop'
    | 'maxIterationsReached'
    | 'stuckRecovery'
    | null;
  readonly sessionOutcome:
    | 'advisoryOnly'
    | 'keptBaseline'
    | 'promoted'
    | 'rolledBack'
    | null;
  readonly convergenceDisposition:
    | 'active'
    | 'aborted'
    | 'blocked'
    | 'converged'
    | 'inconclusive'
    | 'quarantined';
}

// ───────────────────────────────────────────────────────────────────
// 3. CANDIDATE AND ARTIFACT INDEX
// ───────────────────────────────────────────────────────────────────

export interface DeepImprovementCommonCandidateRecord {
  readonly candidateId: string;
  readonly parentCandidateId: string | null;
  readonly proposalRef: string;
  readonly proposalDigest: string;
  readonly targetRef: string;
  readonly targetDigest: string;
  readonly mutationOperatorRef: string;
  readonly mutationOperatorVersion: string;
  readonly proposalPolicyVersion: string;
  readonly proposalEventId: string;
  readonly candidateArtifactRef: string | null;
  readonly candidateArtifactDigest: string | null;
  readonly generationReceiptRef: string | null;
  readonly generatedEventId: string | null;
  readonly activeProfileRef: string | null;
}

export interface DeepImprovementCommonArtifactRecord {
  readonly artifactId: string;
  readonly logicalArtifactId: string;
  readonly artifactKind: DeepImprovementCommonArtifactKind;
  readonly reference: string;
  readonly digest: string;
  readonly producerEventId: string;
  readonly candidateId: string | null;
  readonly evaluationEpochId: string | null;
  readonly availability: DeepImprovementCommonArtifactAvailability;
  readonly receiptRefs: string[];
  readonly supersedesArtifactIds: string[];
  readonly supersededByArtifactIds: string[];
}

export interface DeepImprovementCommonRawObservation {
  readonly candidateId: string;
  readonly evaluationEpochId: string;
  readonly fixtureId: string;
  readonly observationId: string;
  readonly evaluatorRef: string;
  readonly fixtureRef: string;
  readonly rawObservationRef: string;
  readonly rawObservationDigest: string;
  readonly executionReceiptRef: string;
  readonly observationOutcome: 'error' | 'fail' | 'pass' | 'timeout';
  readonly producerEventId: string;
}

export interface DeepImprovementCommonDerivedScore {
  readonly candidateId: string;
  readonly evaluationEpochId: string;
  readonly observationEventIds: string[];
  readonly observationSetDigest: string;
  readonly scorePolicyVersion: string;
  readonly scorerFingerprint: string;
  readonly scoreWriteBackendRef: string;
  readonly scoreVector: DeepImprovementScoreVector;
  readonly normalizationReceiptRef: string;
  readonly producerEventId: string;
}

export interface DeepImprovementCommonArtifactIndexProjection {
  readonly candidates: DeepImprovementCommonCandidateRecord[];
  readonly artifacts: DeepImprovementCommonArtifactRecord[];
  readonly rawObservations: DeepImprovementCommonRawObservation[];
  readonly derivedScores: DeepImprovementCommonDerivedScore[];
}

// ───────────────────────────────────────────────────────────────────
// 4. SHARED PER-MODE STATUS PROJECTION
// ───────────────────────────────────────────────────────────────────

export interface DeepImprovementCommonProfileIncumbent {
  readonly profileRef: string;
  readonly candidateId: string;
  readonly promotionEventId: string;
}

export interface DeepImprovementCommonStatusTransition {
  readonly state: DeepImprovementCommonModeState;
  readonly producerEventId: string;
  readonly producerStem: DeepImprovementCommonEventStem;
  readonly logicalSequence: number;
  readonly transitionReason: string | null;
}

export interface DeepImprovementCommonModeStatus {
  readonly workstream: DeepImprovementCommonWorkstream;
  readonly state: DeepImprovementCommonModeState;
  readonly evaluatorEpochId: string | null;
  readonly activeProfileRef: string | null;
  readonly currentIncumbentCandidateId: string | null;
  readonly candidateStage: DeepImprovementCommonCandidateStage | null;
  readonly canaryStage: DeepImprovementCommonCanaryStage;
  readonly promotionStage: DeepImprovementCommonPromotionStage;
  readonly authorityState: DeepImprovementCommonAuthorityState;
  readonly rollbackTargetBaselineId: string | null;
  readonly blockingVetoCodes: string[];
  readonly profileIncumbents: DeepImprovementCommonProfileIncumbent[];
  readonly terminal: boolean;
  readonly provenance: DeepImprovementCommonStatusTransition[];
}

export interface DeepImprovementCommonModeStatusProjection {
  readonly statuses: DeepImprovementCommonModeStatus[];
}

// ───────────────────────────────────────────────────────────────────
// 5. REPLAY STATE AND PUBLIC RESULTS
// ───────────────────────────────────────────────────────────────────

export interface DeepImprovementCommonSeenEvent {
  readonly eventId: string;
  readonly eventDigest: string;
  readonly payloadDigest: string;
  readonly stem: DeepImprovementCommonEventStem;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly candidateId: string | null;
  readonly evaluationEpochId: string | null;
  readonly canaryEpochId: string | null;
  readonly promotionId: string | null;
}

export interface DeepImprovementCommonProjectionCursors {
  readonly iterationConvergence: number;
  readonly artifactIndex: number;
  readonly modeStatus: number;
}

export interface DeepImprovementCommonProjectionState {
  readonly schemaVersion: string;
  readonly reducerVersion: string;
  readonly codecVersion: string;
  readonly orderingPolicyVersion: string;
  readonly run: DeepImprovementCommonRunProjection;
  readonly iterationConvergence: DeepImprovementCommonIterationConvergenceProjection;
  readonly artifactIndex: DeepImprovementCommonArtifactIndexProjection;
  readonly modeStatus: DeepImprovementCommonModeStatusProjection;
  readonly cursors: DeepImprovementCommonProjectionCursors;
  readonly seenEvents: DeepImprovementCommonSeenEvent[];
}

export type DeepImprovementCommonPersistedField =
  keyof DeepImprovementCommonProjectionState & string;

export interface DeepImprovementCommonProjectionCheckpoint {
  readonly projection: DeepImprovementCommonProjectionState;
  readonly integrityDigest: string;
  readonly sourceTailSequence: number;
}

export interface DeepImprovementCommonProjectedResult {
  readonly outcome: 'projected';
  readonly projection: DeepImprovementCommonProjectionState;
  readonly integrityDigest: string;
  readonly checkpoint: DeepImprovementCommonProjectionCheckpoint;
}

export interface DeepImprovementCommonRebuildRequiredResult {
  readonly outcome: 'rebuild_required';
  readonly reasonCodes: readonly DeepImprovementCommonRebuildReasonCode[];
}

export type DeepImprovementCommonFoldResult =
  | DeepImprovementCommonProjectedResult
  | DeepImprovementCommonRebuildRequiredResult;

export interface DeepImprovementCommonFoldOptions {
  readonly checkpoint?: DeepImprovementCommonProjectionCheckpoint;
  readonly expectedSchemaVersion?: string;
  readonly expectedReducerVersion?: string;
  readonly expectedCodecVersion?: string;
  readonly expectedOrderingPolicyVersion?: string;
  readonly sourceTailSequence?: number;
}

export interface DeepImprovementCommonLegacyProjection {
  readonly authority: 'shadow-only';
  readonly legacyAuthority: 'unchanged';
  readonly variant: DeepImprovementVariant | null;
  readonly runState: DeepImprovementCommonRunState;
  readonly iteration: number;
  readonly candidateId: string | null;
  readonly candidateStage: DeepImprovementCommonCandidateStage | null;
  readonly aggregateScore: number | null;
  readonly canaryStage: DeepImprovementCommonCanaryStage;
  readonly promotionStage: DeepImprovementCommonPromotionStage;
  readonly stopReason: DeepImprovementCommonIterationConvergenceProjection['stopReason'];
  readonly sessionOutcome: DeepImprovementCommonIterationConvergenceProjection['sessionOutcome'];
  readonly hardVetoCodes: string[];
}

export interface DeepImprovementCommonCandidateView {
  readonly authority: 'derived-redacted';
  readonly workstream: 'deep-improvement-common';
  readonly runState: DeepImprovementCommonRunState;
  readonly iteration: number;
  readonly candidateStage: DeepImprovementCommonCandidateStage | null;
  readonly canaryStage: DeepImprovementCommonCanaryStage;
  readonly promotionStage: DeepImprovementCommonPromotionStage;
  readonly decisionBand: 'blocked' | 'eligible' | 'pending' | 'terminal';
}

export interface DeepImprovementCommonProjectionFieldOwnership {
  readonly field: DeepImprovementCommonPersistedField;
  readonly ownerReducerId: string;
  readonly inputStems: readonly DeepImprovementCommonEventStem[];
  readonly foldAlgebra: 'constant' | 'insert-sorted' | 'insert-sorted-and-derive';
  readonly immutableOutput: true;
}
