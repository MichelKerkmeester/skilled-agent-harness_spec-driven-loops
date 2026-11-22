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

/**
 * Run identity, digests and limits folded from run lifecycle events; identity fields stay null until the run is
 * initialized.
 */
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

/**
 * A registered research question as folded into the plan, with its dependencies, required source classes and the event
 * that registered it.
 */
export interface DeepResearchQuestionNode {
  readonly questionId: string;
  readonly normalizedQuestionDigest: string;
  readonly dependencyQuestionIds: string[];
  readonly requiredSourceClasses: string[];
  readonly disconfirmingQueryRecipeIds: string[];
  readonly budgetRef: string;
  readonly producerEventId: string;
}

/** A planned or selected branch under a question, carrying its score vector, tie-break key and reservation. */
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

/**
 * The focus chosen for one iteration, with its score vector, visit cooldown and the branch or question chosen, either
 * of which may be null.
 */
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

/** The research plan folded from question, branch and focus events, with a digest over the plan. */
export interface DeepResearchResearchPlanProjection {
  readonly planDigest: string;
  readonly questions: DeepResearchQuestionNode[];
  readonly branches: DeepResearchBranchNode[];
  readonly focusObligations: DeepResearchFocusObligation[];
}

// ───────────────────────────────────────────────────────────────────
// 3. CLAIM-EVIDENCE-CONTRADICTION PROJECTION
// ───────────────────────────────────────────────────────────────────

/**
 * A captured source version as folded from `deep_research.source_captured`, keyed by iteration and source version id.
 */
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

/**
 * An evidence admission decision folded from `deep_research.evidence_admission_decided`, with its disposition and
 * contamination status.
 */
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

/**
 * One claim version folded from an assertion or relation event; the related claim version is null for a plain
 * assertion.
 */
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

/** A claim version replaced by a successor, with the reason, effective time and invalidation scope. */
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

/**
 * An open gap folded from `deep_research.gap_detected`, with the claims and questions it affects and proposed query
 * recipes.
 */
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

/**
 * The claim ledger view: sources, evidence, claim versions, supersessions, gap obligations and the claim versions still
 * active.
 */
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

/**
 * Lifecycle and signals for one iteration; the event ids and digests stay null until the matching start or completion
 * event is folded.
 */
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

/** The current iteration number with one record per iteration seen. */
export interface DeepResearchIterationProjection {
  readonly currentIteration: number;
  readonly records: DeepResearchIterationRecord[];
}

/** One convergence evaluation at a stream position, with its decision, raw and trusted signals and gate results. */
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

/** All convergence evaluations with the observed and finalized revisions and the resulting eligibility and outcome. */
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

/**
 * An artifact indexed from the ledger, with its kind, digest, schema version and the run, lineage and iteration that
 * produced it.
 */
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

/** The index of artifacts the ledger has recorded for the run. */
export interface DeepResearchArtifactIndexProjection {
  readonly artifacts: DeepResearchArtifactRecord[];
}

/** One mode status change and the event, stem and stream position that caused it. */
export interface DeepResearchStatusTransition {
  readonly state: DeepResearchModeStatus;
  readonly producerEventId: string;
  readonly producerStem: DeepResearchEventStem;
  readonly streamId: string;
  readonly logicalSequence: number;
  readonly transitionReason: string | null;
}

/** The current mode status, whether it is terminal and the transitions that led to it. */
export interface DeepResearchStatusProjection {
  readonly state: DeepResearchModeStatus;
  readonly terminal: boolean;
  readonly provenance: DeepResearchStatusTransition[];
}

// ───────────────────────────────────────────────────────────────────
// 6. REPLAY STATE AND PUBLIC RESULTS
// ───────────────────────────────────────────────────────────────────

/** Identity of an event already folded, kept so a repeated event can be detected by id and digest. */
export interface DeepResearchSeenEvent {
  readonly eventId: string;
  readonly eventDigest: string;
  readonly streamId: string;
  readonly streamSequence: number;
}

/**
 * Per-projection fold positions, one for each of the plan, claim ledger, iteration, convergence, artifact index and
 * status views.
 */
export interface DeepResearchProjectionCursors {
  readonly researchPlan: number;
  readonly claimLedger: number;
  readonly iteration: number;
  readonly convergence: number;
  readonly artifactIndex: number;
  readonly status: number;
}

/**
 * The full Deep Research projection: version stamps, every projection view, fold cursors and the events already seen.
 */
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

/**
 * A projection snapshot with its integrity digest and the source tail sequence it was taken at, so a fold can resume
 * from it.
 */
export interface DeepResearchProjectionCheckpoint {
  readonly projection: DeepResearchProjectionState;
  readonly integrityDigest: string;
  readonly sourceTailSequence: number;
}

/** Successful fold result: the projection, its integrity digest and a checkpoint for the next fold. */
export interface DeepResearchProjectedResult {
  readonly outcome: 'projected';
  readonly projection: DeepResearchProjectionState;
  readonly integrityDigest: string;
  readonly checkpoint: DeepResearchProjectionCheckpoint;
}

/** Fold result when the checkpoint or event stream cannot be trusted, listing the reason codes for a full rebuild. */
export interface DeepResearchRebuildRequiredResult {
  readonly outcome: 'rebuild_required';
  readonly reasonCodes: readonly DeepResearchRebuildReasonCode[];
}

export type DeepResearchFoldResult =
  | DeepResearchProjectedResult
  | DeepResearchRebuildRequiredResult;

/**
 * Optional checkpoint to resume from, the version stamps it must match and the tail sequence and contiguity the fold
 * must check.
 */
export interface DeepResearchFoldOptions {
  readonly checkpoint?: DeepResearchProjectionCheckpoint;
  readonly expectedSchemaVersion?: string;
  readonly expectedReducerVersion?: string;
  readonly expectedCodecVersion?: string;
  readonly expectedOrderingPolicyVersion?: string;
  readonly sourceTailSequence?: number;
  readonly requireContiguousTail?: boolean;
}

/**
 * Shadow-only view in the legacy state shape that leaves legacy authority unchanged and lists the fields it cannot
 * carry losslessly.
 */
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

/** Declares which reducer owns a persisted field, the event stems that feed it and the fold algebra it applies. */
export interface DeepResearchProjectionFieldOwnership {
  readonly field: DeepResearchPersistedField;
  readonly ownerReducerId: string;
  readonly inputStems: readonly DeepResearchEventStem[];
  readonly foldAlgebra: 'constant' | 'insert-sorted' | 'insert-sorted-and-derive';
  readonly immutableOutput: true;
}
