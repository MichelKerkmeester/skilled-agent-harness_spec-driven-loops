// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Projection Types
// ───────────────────────────────────────────────────────────────────

import type {
  ConvergenceSignals,
  DeepReviewEventStem,
  EvidenceLocator,
  SemanticFingerprintParts,
  TargetReference,
} from '../deep-review-ledger-schema/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. VERSION AND OUTCOME TYPES
// ───────────────────────────────────────────────────────────────────

export type DeepReviewModeStatus =
  | 'planned'
  | 'active'
  | 'paused'
  | 'converging'
  | 'complete'
  | 'incomplete'
  | 'blocked'
  | 'failed';

export type DeepReviewProjectionHealth = 'healthy' | 'blocked' | 'rebuild-required';
export type DeepReviewConvergenceEligibility =
  | 'CONTINUE'
  | 'STOP_ELIGIBLE'
  | 'INDETERMINATE';
export type DeepReviewConvergenceOutcome =
  | 'active'
  | 'blocked'
  | 'converged'
  | 'incomplete';
export type DeepReviewFindingLifecycle =
  | 'candidate'
  | 'adjudicated'
  | 'accepted'
  | 'dismissed'
  | 'fixed';
export type DeepReviewPresentationSeverity = 'none' | 'P0' | 'P1' | 'P2';
export type DeepReviewArtifactAvailability =
  | 'pending'
  | 'available'
  | 'unavailable'
  | 'superseded';
export type DeepReviewArtifactKind =
  | 'raw-finding'
  | 'evidence'
  | 'adjudication'
  | 'challenge-attempt'
  | 'proof-receipt'
  | 'suppression-record'
  | 'verification-output'
  | 'review-report'
  | 'continuity-save';
export type DeepReviewRebuildReasonCode =
  | 'checkpoint-digest-mismatch'
  | 'codec-version-mismatch'
  | 'cursor-gap'
  | 'ordering-policy-mismatch'
  | 'projection-schema-mismatch'
  | 'reducer-version-mismatch'
  | 'source-truncated';
export type DeepReviewReducerErrorCode =
  | 'duplicate-event-conflict'
  | 'duplicate-owner'
  | 'duplicate-terminal-event'
  | 'event-not-deep-review'
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
// 2. RUN AND SHARED REVIEW-LOOP PROJECTIONS
// ───────────────────────────────────────────────────────────────────

export interface SharedReviewLoopModeConfiguration {
  readonly mode: 'review' | 'alignment';
  readonly requiredCoveragePolicy: 'all-required-cells';
  readonly hardVetoClasses: readonly string[];
  readonly terminalDecisionPolicy: 'typed-transition-only';
}

export interface SharedReviewLoopBackboneInput {
  readonly requiredDimensionIds: readonly string[];
  readonly completedDimensionIds: readonly string[];
  readonly unresolvedObligationIds: readonly string[];
  readonly explicitBlockerIds: readonly string[];
  readonly blockingFindingIds: readonly string[];
  readonly hardVetoFindingIds: readonly string[];
  readonly p0p1ResolutionState: 'blocked' | 'resolved' | 'unknown';
  readonly findingStability: 'stable' | 'unstable' | 'unknown';
  readonly decision: 'blocked' | 'continue' | 'converged' | 'incomplete' | 'recover';
  readonly stopCandidate: boolean;
  readonly graphDecision: 'blocked' | 'continue' | 'converged' | 'unavailable' | null;
}

export interface SharedReviewLoopBackboneResult {
  readonly eligibility: DeepReviewConvergenceEligibility;
  readonly outcome: DeepReviewConvergenceOutcome;
  readonly blockerIds: string[];
}

export interface DeepReviewRunProjection {
  readonly runId: string | null;
  readonly sessionId: string | null;
  readonly generation: number;
  readonly target: TargetReference | null;
  readonly maxIterations: number;
  readonly convergencePolicyVersion: string | null;
  readonly reviewModeContractDigest: string | null;
  readonly initializationEventId: string | null;
}

export interface DeepReviewScopeProjection {
  readonly targetSetDigest: string | null;
  readonly scopeClass: 'bounded' | 'repository' | 'targeted' | null;
  readonly targets: TargetReference[];
  readonly orderedDimensionIds: string[];
  readonly scopeEvidenceRefs: string[];
  readonly orderingPolicyVersion: string | null;
}

export interface DeepReviewCoverageCell {
  readonly iterationId: string;
  readonly dimensionId: string;
  readonly required: boolean;
  readonly status: 'pending' | 'started' | 'complete' | 'incomplete' | 'blocked';
  readonly passNumber: number;
  readonly searchCoverageDigest: string | null;
  readonly producerEventId: string;
}

export interface DeepReviewPassOutcome {
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

export interface DeepReviewObligation {
  readonly obligationId: string;
  readonly kind: 'coverage' | 'evidence' | 'finding' | 'protocol' | 'review-depth';
  readonly required: boolean;
  readonly status: 'resolved' | 'unresolved' | 'blocked';
  readonly producerEventId: string;
}

export interface DeepReviewConvergenceEvaluation {
  readonly iterationId: string;
  readonly decision: 'blocked' | 'continue' | 'converged' | 'incomplete' | 'recover';
  readonly rawSignals: ConvergenceSignals;
  readonly weightedSignals: ConvergenceSignals;
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
}

export interface DeepReviewIterationConvergenceProjection {
  readonly configuration: SharedReviewLoopModeConfiguration;
  readonly scope: DeepReviewScopeProjection;
  readonly coverageCells: DeepReviewCoverageCell[];
  readonly passes: DeepReviewPassOutcome[];
  readonly obligations: DeepReviewObligation[];
  readonly evaluations: DeepReviewConvergenceEvaluation[];
  readonly currentIterationId: string | null;
  readonly eligibility: DeepReviewConvergenceEligibility;
  readonly outcome: DeepReviewConvergenceOutcome;
  readonly terminalDecision: 'blocked' | 'fail' | 'incomplete' | 'pass' | null;
  readonly blockerIds: string[];
  readonly lastAppliedSequence: number;
}

// ───────────────────────────────────────────────────────────────────
// 3. FINDING AND PRESENTATION PROJECTIONS
// ───────────────────────────────────────────────────────────────────

export interface DeepReviewEvidenceRecord {
  readonly evidenceId: string;
  readonly candidateId: string;
  readonly locator: EvidenceLocator;
  readonly observationKind: 'analyzer-output' | 'inspection' | 'runtime-witness' | 'test-result';
  readonly rawResultDigest: string;
  readonly sourceDigest: string;
  readonly contentDigest: string;
  readonly independentEvidenceClass: string;
  readonly causalProximityStatus: 'direct' | 'indirect' | 'unknown';
  readonly stabilityStatus: 'stable' | 'unstable' | 'unknown';
  readonly relevanceStatus: 'irrelevant' | 'relevant' | 'unknown';
  readonly supersedesEvidenceEventId: string | null;
  readonly producerEventId: string;
}

export interface DeepReviewFindingRecord {
  readonly findingId: string;
  readonly candidateId: string;
  readonly dimensionId: string;
  readonly sourcePassEventId: string;
  readonly claimDigest: string;
  readonly findingClass: string;
  readonly evidenceRefs: string[];
  readonly impact: number;
  readonly confidence: number;
  readonly reachability: number;
  readonly exploitability: number;
  readonly evidenceStrength: number;
  readonly evidenceType: 'analyzer' | 'inspection' | 'runtime' | 'test';
  readonly evidenceScope: 'direct' | 'indirect' | 'partial';
  readonly lifecycle: DeepReviewFindingLifecycle;
  readonly adjudicationOutcome: 'accepted' | 'deferred' | 'disproved' | 'rejected' | null;
  readonly semanticFingerprint: SemanticFingerprintParts;
  readonly hardVeto: boolean;
  readonly presentationSeverity: DeepReviewPresentationSeverity;
  readonly candidateEventId: string;
  readonly adjudicationEventId: string | null;
  readonly predecessorEventId: string | null;
}

export interface DeepReviewFindingLineage {
  readonly findingId: string;
  readonly priorFingerprint: SemanticFingerprintParts;
  readonly currentFingerprint: SemanticFingerprintParts;
  readonly relation:
    | 'absent'
    | 'disproved'
    | 'fixed'
    | 'introduced'
    | 'preexisting'
    | 'unchanged'
    | 'updated';
  readonly predecessorEventId: string;
  readonly producerEventId: string;
}

export interface DeepReviewFindingProjection {
  readonly findings: DeepReviewFindingRecord[];
  readonly evidence: DeepReviewEvidenceRecord[];
  readonly lineage: DeepReviewFindingLineage[];
  readonly activeFindingIds: string[];
  readonly hardVetoFindingIds: string[];
}

// ───────────────────────────────────────────────────────────────────
// 4. ARTIFACT AND STATUS PROJECTIONS
// ───────────────────────────────────────────────────────────────────

export interface DeepReviewArtifactRecord {
  readonly artifactId: string;
  readonly logicalArtifactId: string;
  readonly artifactKind: DeepReviewArtifactKind;
  readonly producerEventId: string;
  readonly reviewedInputIdentity: string;
  readonly contentDigest: string;
  readonly availability: DeepReviewArtifactAvailability;
  readonly supersedesArtifactIds: string[];
  readonly supersededByArtifactIds: string[];
}

export interface DeepReviewArtifactIndexProjection {
  readonly artifacts: DeepReviewArtifactRecord[];
}

export interface DeepReviewStatusTransition {
  readonly state: DeepReviewModeStatus;
  readonly producerEventId: string;
  readonly producerStem: DeepReviewEventStem;
  readonly streamId: string;
  readonly logicalSequence: number;
  readonly blockingReason: string | null;
}

export interface DeepReviewStatusProjection {
  readonly state: DeepReviewModeStatus;
  readonly terminal: boolean;
  readonly health: DeepReviewProjectionHealth;
  readonly activeContractVersions: string[];
  readonly lastAppliedSequence: number;
  readonly blockingReason: string | null;
  readonly shadowParityState: 'not-run';
  readonly provenance: DeepReviewStatusTransition[];
}

// ───────────────────────────────────────────────────────────────────
// 5. REPLAY STATE AND PUBLIC RESULTS
// ───────────────────────────────────────────────────────────────────

export interface DeepReviewSeenEvent {
  readonly eventId: string;
  readonly eventDigest: string;
  readonly stem: DeepReviewEventStem;
  readonly streamId: string;
  readonly streamSequence: number;
}

export interface DeepReviewProjectionCursors {
  readonly reviewLoop: number;
  readonly findings: number;
  readonly artifactIndex: number;
  readonly status: number;
}

export interface DeepReviewProjectionState {
  readonly schemaVersion: string;
  readonly reducerVersion: string;
  readonly codecVersion: string;
  readonly orderingPolicyVersion: string;
  readonly run: DeepReviewRunProjection;
  readonly reviewLoop: DeepReviewIterationConvergenceProjection;
  readonly findingLedger: DeepReviewFindingProjection;
  readonly artifactIndex: DeepReviewArtifactIndexProjection;
  readonly status: DeepReviewStatusProjection;
  readonly cursors: DeepReviewProjectionCursors;
  readonly seenEvents: DeepReviewSeenEvent[];
}

export type DeepReviewPersistedField = keyof DeepReviewProjectionState & string;

export interface DeepReviewProjectionCheckpoint {
  readonly projection: DeepReviewProjectionState;
  readonly integrityDigest: string;
  readonly sourceTailSequence: number;
  readonly sourceTailEventDigest: string;
}

export interface DeepReviewProjectedResult {
  readonly outcome: 'projected';
  readonly projection: DeepReviewProjectionState;
  readonly integrityDigest: string;
  readonly checkpoint: DeepReviewProjectionCheckpoint;
}

export interface DeepReviewRebuildRequiredResult {
  readonly outcome: 'rebuild_required';
  readonly reasonCodes: readonly DeepReviewRebuildReasonCode[];
}

export type DeepReviewFoldResult =
  | DeepReviewProjectedResult
  | DeepReviewRebuildRequiredResult;

export interface DeepReviewFoldOptions {
  readonly checkpoint?: DeepReviewProjectionCheckpoint;
  readonly expectedSchemaVersion?: string;
  readonly expectedReducerVersion?: string;
  readonly expectedCodecVersion?: string;
  readonly expectedOrderingPolicyVersion?: string;
  readonly sourceTailSequence?: number;
  readonly requireContiguousTail?: boolean;
}

export interface DeepReviewLegacyProjection {
  readonly authority: 'shadow-only';
  readonly legacyAuthority: 'unchanged';
  readonly iteration: string | null;
  readonly status: DeepReviewModeStatus;
  readonly terminalDecision: 'blocked' | 'fail' | 'incomplete' | 'pass' | null;
  readonly coverage: DeepReviewCoverageCell[];
  readonly findings: DeepReviewFindingRecord[];
  readonly artifacts: DeepReviewArtifactRecord[];
  readonly projectionHealth: DeepReviewProjectionHealth;
  readonly parityFingerprint: string;
}

export interface DeepReviewProjectionFieldOwnership {
  readonly field: DeepReviewPersistedField;
  readonly ownerReducerId: string;
  readonly inputStems: readonly DeepReviewEventStem[];
  readonly foldAlgebra: 'constant' | 'insert-sorted' | 'insert-sorted-and-derive';
  readonly immutableOutput: true;
}
