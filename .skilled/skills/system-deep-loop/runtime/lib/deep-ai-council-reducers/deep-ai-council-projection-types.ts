// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Projection Types
// ───────────────────────────────────────────────────────────────────

import type {
  DeepAiCouncilEventStem,
  InformationSurface,
  IndependenceSnapshot,
  PairwisePreferenceVector,
  RawScoreVector,
  RequiredCheckResult,
  RequiredSectionResult,
  SourceEventRange,
  TargetReference,
  UsageCostReceipt,
} from '../deep-ai-council-ledger-schema/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC OUTCOME TYPES
// ───────────────────────────────────────────────────────────────────

export type DeepAiCouncilModeStatus =
  | 'planned'
  | 'admitted'
  | 'deliberating'
  | 'critiquing'
  | 'adjudicating'
  | 'converging'
  | 'testing'
  | 'complete'
  | 'incomplete'
  | 'non-converged'
  | 'blocked'
  | 'failed';

export type DeepAiCouncilConvergenceOutcome =
  | 'active'
  | 'blocked'
  | 'converged'
  | 'incomplete'
  | 'non-converged';

export type DeepAiCouncilPresentationKind =
  | 'factual-posterior'
  | 'blinded-plan-posterior'
  | 'debate-escalation'
  | 'plural-value-disagreement';

export type DeepAiCouncilFoldOutcome = 'projected' | 'rebuild_required';

export type DeepAiCouncilRebuildReasonCode =
  | 'checkpoint-digest-mismatch'
  | 'codec-version-mismatch'
  | 'cursor-gap'
  | 'event-order-invalid'
  | 'ordering-policy-mismatch'
  | 'predecessor-digest-mismatch'
  | 'projection-schema-mismatch'
  | 'reducer-version-mismatch'
  | 'source-truncated'
  | 'stream-identity-mismatch';

export type DeepAiCouncilReducerErrorCode =
  | 'duplicate-event-conflict'
  | 'duplicate-owner'
  | 'duplicate-terminal-event'
  | 'event-not-deep-ai-council'
  | 'event-schema-invalid'
  | 'impossible-status-transition'
  | 'phantom-source-reference'
  | 'projection-field-invalid'
  | 'projection-field-undeclared'
  | 'projection-not-frozen'
  | 'reducer-nondeterministic'
  | 'reducer-output-unowned'
  | 'run-identity-conflict'
  | 'run-not-initialized'
  | 'state-mutated'
  | 'tail-integrity-mismatch';

// ───────────────────────────────────────────────────────────────────
// 2. RUN AND SEAT PROJECTIONS
// ───────────────────────────────────────────────────────────────────

export interface DeepAiCouncilRunProjection {
  readonly runId: string | null;
  readonly roundId: string | null;
  readonly generation: number;
  readonly target: TargetReference | null;
  readonly targetDigest: string | null;
  readonly configDigest: string | null;
  readonly strategyDigest: string | null;
  readonly convergencePolicyDigest: string | null;
  readonly testGatePolicyDigest: string | null;
  readonly maxRounds: number;
  readonly minSeatCount: number;
  readonly maxSeatCount: number;
  readonly planningOnly: true;
  readonly initialReplayFingerprint: string | null;
  readonly initializationEventId: string | null;
}

export interface DeepAiCouncilRoundRecord {
  readonly roundId: string;
  readonly roundNumber: number;
  readonly protocolVersion: string;
  readonly exposurePolicyVersion: string;
  readonly seatRosterDigest: string;
  readonly promptPackDigest: string;
  readonly budgetRef: string;
  readonly priorRoundRef: string | null;
  readonly informationSurface: InformationSurface;
  readonly producerEventId: string;
}

export interface DeepAiCouncilSeatRecord {
  readonly roundId: string;
  readonly seatId: string;
  readonly strategyLens: string;
  readonly mandateDigest: string;
  readonly vantageFingerprint: string;
  readonly modelFingerprint: string;
  readonly independenceGroup: string;
  readonly capabilityDigest: string;
  readonly promptDigest: string;
  readonly selectionUtility: number;
  readonly selectionPolicyVersion: string;
  readonly selectedEventId: string;
  readonly dispatchEventId: string | null;
  readonly dispatchReceiptRef: string | null;
  readonly logicalBranchRef: string | null;
  readonly attempt: number;
  readonly budgetLeaseRef: string | null;
}

export interface DeepAiCouncilProposalRecord {
  readonly roundId: string;
  readonly seatId: string;
  readonly proposalId: string;
  readonly targetVersion: string;
  readonly responseStatus: 'failed' | 'partial' | 'returned' | 'timeout';
  readonly proposalDigest: string;
  readonly artifactRef: string;
  readonly artifactDigest: string;
  readonly rawScores: RawScoreVector;
  readonly rawConfidence: number;
  readonly usage: UsageCostReceipt;
  readonly evidenceRefs: string[];
  readonly outputSchemaVersion: string;
  readonly observationDigest: string;
  readonly informationSurface: InformationSurface;
  readonly failureReason: string | null;
  readonly timeoutReason: string | null;
  readonly observedEventId: string;
  readonly returnedEventId: string | null;
}

export interface DeepAiCouncilSeatsProjection {
  readonly rounds: DeepAiCouncilRoundRecord[];
  readonly seats: DeepAiCouncilSeatRecord[];
  readonly proposals: DeepAiCouncilProposalRecord[];
}

// ───────────────────────────────────────────────────────────────────
// 3. CRITIQUE AND BLINDED ADJUDICATION PROJECTIONS
// ───────────────────────────────────────────────────────────────────

export interface DeepAiCouncilCritiqueRoundRecord {
  readonly roundId: string;
  readonly critiqueRoundId: string;
  readonly seatId: string;
  readonly sourceProposalIds: string[];
  readonly visibleInformationPolicyVersion: string;
  readonly inputDigest: string;
  readonly informationSurface: InformationSurface;
  readonly producerEventId: string;
}

export interface DeepAiCouncilCritiqueRecord {
  readonly roundId: string;
  readonly critiqueRoundId: string;
  readonly seatId: string;
  readonly sourceProposalIds: string[];
  readonly critiqueArtifactRef: string;
  readonly critiqueArtifactDigest: string;
  readonly referencedClaimRefs: string[];
  readonly rawSeverity: number;
  readonly rawConfidence: number;
  readonly challengeDisposition: 'accepted' | 'contested' | 'rejected' | 'unresolved';
  readonly causalProposalRefs: string[];
  readonly informationSurface: InformationSurface;
  readonly producerEventId: string;
}

export interface DeepAiCouncilCritiqueProjection {
  readonly rounds: DeepAiCouncilCritiqueRoundRecord[];
  readonly critiques: DeepAiCouncilCritiqueRecord[];
}

export interface DeepAiCouncilBlindedCandidateRecord {
  readonly roundId: string;
  readonly candidateId: string;
  readonly sourceProposalIds: string[];
  readonly candidateAliasDigest: string;
  readonly shuffleSeedDigest: string;
  readonly visibleCandidateDigest: string;
  readonly artifactRef: string;
  readonly artifactDigest: string;
  readonly targetVersion: string;
  readonly redactionPolicyVersion: string;
  readonly informationSurface: InformationSurface;
  readonly producerEventId: string;
}

export interface DeepAiCouncilPairwiseJudgmentRecord {
  readonly roundId: string;
  readonly judgmentId: string;
  readonly candidateAId: string;
  readonly candidateBId: string;
  readonly orderToken: 'a-first' | 'b-first';
  readonly judgeProfileFingerprint: string;
  readonly rawPreference: PairwisePreferenceVector;
  readonly rawConfidence: number;
  readonly judgmentStatus: 'abstained' | 'consistent' | 'inconsistent';
  readonly inputDigest: string;
  readonly calibrationRef: string;
  readonly informationSurface: InformationSurface;
  readonly producerEventId: string;
}

export interface DeepAiCouncilBiasAuditRecord {
  readonly roundId: string;
  readonly judgmentId: string;
  readonly candidateAId: string;
  readonly candidateBId: string;
  readonly pairedJudgmentIds: string[];
  readonly biasFeatureCodes: string[];
  readonly detectorResult: 'flagged' | 'inconclusive' | 'passed';
  readonly inconsistencyStatus: 'consistent' | 'inconsistent' | 'unknown';
  readonly rawBiasScore: number;
  readonly inputDigest: string;
  readonly detectorFingerprint: string;
  readonly producerEventId: string;
}

export interface DeepAiCouncilAdjudicationRecord {
  readonly roundId: string;
  readonly candidateSetDigest: string;
  readonly protocolVersion: string;
  readonly rubricVersion: string;
  readonly rawScores: RawScoreVector;
  readonly calibratedScores: RawScoreVector;
  readonly supportMass: number;
  readonly oppositionMass: number;
  readonly independence: IndependenceSnapshot;
  readonly minorityRefs: string[];
  readonly contradictionRefs: string[];
  readonly vetoFindingRefs: string[];
  readonly disposition: 'selected' | 'unresolved';
  readonly selectedCandidateId: string | null;
  readonly evaluatorReceiptRef: string;
  readonly sourceJudgmentIds: string[];
  readonly producerEventId: string;
}

export interface DeepAiCouncilBlindedAdjudicationProjection {
  readonly candidates: DeepAiCouncilBlindedCandidateRecord[];
  readonly judgments: DeepAiCouncilPairwiseJudgmentRecord[];
  readonly biasAudits: DeepAiCouncilBiasAuditRecord[];
  readonly decisions: DeepAiCouncilAdjudicationRecord[];
}

// ───────────────────────────────────────────────────────────────────
// 4. CONVERGENCE AND PRESENTATION PROJECTIONS
// ───────────────────────────────────────────────────────────────────

export interface DeepAiCouncilStanceRecord {
  readonly roundId: string;
  readonly candidateId: string;
  readonly seatId: string;
  readonly candidateOrPlanRef: string;
  readonly priorStanceEventId: string | null;
  readonly priorStance: 'abstain' | 'oppose' | 'support' | 'uncertain' | null;
  readonly currentStance: 'abstain' | 'oppose' | 'support' | 'uncertain';
  readonly flipDirection: 'away-from-support' | 'toward-support' | null;
  readonly rawRationaleDigest: string;
  readonly evidenceRef: string;
  readonly influenceObservationDigest: string;
  readonly producerEventId: string;
}

export interface DeepAiCouncilDeliberationRecord {
  readonly roundId: string;
  readonly inputEventRange: SourceEventRange;
  readonly candidateSetDigest: string;
  readonly planDisposition: 'selected' | 'unresolved';
  readonly selectedPlanDigest: string;
  readonly disagreementRefs: string[];
  readonly minorityRefs: string[];
  readonly synthesisPolicyFingerprint: string;
  readonly evaluatorFingerprint: string;
  readonly reportDraftRef: string;
  readonly synthesisReceiptRef: string;
  readonly producerEventId: string;
}

export interface DeepAiCouncilConvergenceEvaluation {
  readonly roundId: string;
  readonly decision: 'blocked' | 'continue' | 'converged' | 'incomplete' | 'non-converged';
  readonly rawAgreement: number;
  readonly rawStability: number;
  readonly calibratedSupport: number;
  readonly effectiveSeatCount: number;
  readonly independence: IndependenceSnapshot;
  readonly judgeProfileRefs: string[];
  readonly qualityWitnessRefs: string[];
  readonly invarianceWitnessRefs: string[];
  readonly minorityRefs: string[];
  readonly contradictionRefs: string[];
  readonly vetoFindingRefs: string[];
  readonly requiredGateResultRefs: string[];
  readonly budgetStateRef: string;
  readonly coverageStateRef: string;
  readonly blockerIds: string[];
  readonly recoveryOrEscalationReason: string | null;
  readonly producerEventId: string;
}

export interface DeepAiCouncilPluralOutcomeProjection {
  readonly kind: DeepAiCouncilPresentationKind;
  readonly selectedCandidateId: string | null;
  readonly rawProposalEventIds: string[];
  readonly rawJudgmentEventIds: string[];
  readonly adjudicationEventIds: string[];
  readonly minorityRefs: string[];
  readonly contradictionRefs: string[];
  readonly vetoFindingRefs: string[];
  readonly unresolvedValueRefs: string[];
  readonly reopenConditionRefs: string[];
}

export interface DeepAiCouncilConvergenceProjection {
  readonly stances: DeepAiCouncilStanceRecord[];
  readonly deliberations: DeepAiCouncilDeliberationRecord[];
  readonly evaluations: DeepAiCouncilConvergenceEvaluation[];
  readonly outcome: DeepAiCouncilConvergenceOutcome;
  readonly eligible: boolean;
  readonly blockerIds: string[];
  readonly hardVetoRefs: string[];
  readonly rawAgreement: number;
  readonly calibratedSupport: number;
  readonly effectiveSeatCount: number;
  readonly presentation: DeepAiCouncilPluralOutcomeProjection;
}

// ───────────────────────────────────────────────────────────────────
// 5. ARTIFACT, TEST-GATE, AND STATUS PROJECTIONS
// ───────────────────────────────────────────────────────────────────

export interface DeepAiCouncilArtifactRecord {
  readonly artifactId: string;
  readonly logicalArtifactId: string;
  readonly roundId: string;
  readonly artifactKind: string;
  readonly safeRelativePath: string;
  readonly schemaVersion: string;
  readonly byteDigest: string;
  readonly contentDigest: string;
  readonly requiredSectionResults: RequiredSectionResult[];
  readonly sourceEventRange: SourceEventRange;
  readonly producerEventId: string;
  readonly availability: 'available' | 'superseded';
  readonly supersedesArtifactIds: string[];
  readonly supersededByArtifactIds: string[];
  readonly rollbackRef: string | null;
}

export interface DeepAiCouncilArtifactsProjection {
  readonly records: DeepAiCouncilArtifactRecord[];
}

export interface DeepAiCouncilTestGateRecord {
  readonly gateId: string;
  readonly roundId: string;
  readonly testSuiteDigest: string;
  readonly fixtureManifestDigest: string;
  readonly baselineFingerprint: string;
  readonly candidateFingerprint: string;
  readonly requiredCheckResults: RequiredCheckResult[];
  readonly criticalFailureRefs: string[];
  readonly metamorphicCheckDigest: string;
  readonly biasCheckDigest: string;
  readonly artifactCompleteness: 'complete' | 'incomplete' | 'unknown';
  readonly verdict: 'blocked' | 'fail' | 'pass';
  readonly gateReceiptRef: string;
  readonly informationSurface: InformationSurface;
  readonly producerEventId: string;
}

export interface DeepAiCouncilTestGateProjection {
  readonly evaluations: DeepAiCouncilTestGateRecord[];
  readonly verdict: 'blocked' | 'fail' | 'pass' | 'unknown';
}

export interface DeepAiCouncilStatusTransition {
  readonly state: DeepAiCouncilModeStatus;
  readonly producerEventId: string;
  readonly producerStem: DeepAiCouncilEventStem;
  readonly streamSequence: number;
  readonly blockingReason: string | null;
}

export interface DeepAiCouncilStatusProjection {
  readonly state: DeepAiCouncilModeStatus;
  readonly terminal: boolean;
  readonly projectionHealth: 'healthy' | 'blocked';
  readonly admission: 'admitted' | 'pending';
  readonly shadowParity: 'not-run';
  readonly modeGate: 'off';
  readonly blockingReason: string | null;
  readonly provenance: DeepAiCouncilStatusTransition[];
}

// ───────────────────────────────────────────────────────────────────
// 6. REPLAY STATE AND PUBLIC RESULTS
// ───────────────────────────────────────────────────────────────────

export interface DeepAiCouncilSeenEvent {
  readonly eventId: string;
  readonly eventDigest: string;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly stem: DeepAiCouncilEventStem;
}

export interface DeepAiCouncilProjectionCursors {
  readonly councilSeats: number;
  readonly critique: number;
  readonly blindedAdjudication: number;
  readonly convergence: number;
  readonly artifacts: number;
  readonly testGate: number;
  readonly status: number;
}

export interface DeepAiCouncilProjectionState {
  readonly schemaVersion: string;
  readonly reducerVersion: string;
  readonly codecVersion: string;
  readonly orderingPolicyVersion: string;
  readonly run: DeepAiCouncilRunProjection;
  readonly councilSeats: DeepAiCouncilSeatsProjection;
  readonly critique: DeepAiCouncilCritiqueProjection;
  readonly blindedAdjudication: DeepAiCouncilBlindedAdjudicationProjection;
  readonly convergence: DeepAiCouncilConvergenceProjection;
  readonly artifacts: DeepAiCouncilArtifactsProjection;
  readonly testGate: DeepAiCouncilTestGateProjection;
  readonly status: DeepAiCouncilStatusProjection;
  readonly cursors: DeepAiCouncilProjectionCursors;
  readonly seenEvents: DeepAiCouncilSeenEvent[];
}

export type DeepAiCouncilPersistedField = keyof DeepAiCouncilProjectionState & string;

export interface DeepAiCouncilProjectionCheckpoint {
  readonly projection: DeepAiCouncilProjectionState;
  readonly integrityDigest: string;
  readonly sourceTailSequence: number;
  readonly sourceTailDigest: string;
}

export interface DeepAiCouncilProjectedResult {
  readonly outcome: 'projected';
  readonly projection: DeepAiCouncilProjectionState;
  readonly integrityDigest: string;
  readonly checkpoint: DeepAiCouncilProjectionCheckpoint;
}

export interface DeepAiCouncilRebuildRequiredResult {
  readonly outcome: 'rebuild_required';
  readonly reasonCodes: readonly DeepAiCouncilRebuildReasonCode[];
}

export type DeepAiCouncilFoldResult =
  | DeepAiCouncilProjectedResult
  | DeepAiCouncilRebuildRequiredResult;

export interface DeepAiCouncilFoldOptions {
  readonly checkpoint?: DeepAiCouncilProjectionCheckpoint;
  readonly expectedSchemaVersion?: string;
  readonly expectedReducerVersion?: string;
  readonly expectedCodecVersion?: string;
  readonly expectedOrderingPolicyVersion?: string;
  readonly sourceTailSequence?: number;
  readonly sourceTailDigest?: string;
  readonly requireContiguousTail?: boolean;
}

export interface DeepAiCouncilLegacyProjection {
  readonly authority: 'shadow-only';
  readonly legacyAuthority: 'unchanged';
  readonly roundId: string | null;
  readonly status: DeepAiCouncilModeStatus;
  readonly seatCount: number;
  readonly proposalCount: number;
  readonly selectedCandidateId: string | null;
  readonly convergenceOutcome: DeepAiCouncilConvergenceOutcome;
  readonly artifactIds: string[];
  readonly gateVerdict: 'blocked' | 'fail' | 'pass' | 'unknown';
  readonly terminal: boolean;
  readonly lossyFields: string[];
}

export interface DeepAiCouncilProjectionFieldOwnership {
  readonly field: DeepAiCouncilPersistedField;
  readonly ownerReducerId: string;
  readonly inputStems: readonly DeepAiCouncilEventStem[];
  readonly foldAlgebra: 'constant' | 'insert-sorted' | 'insert-sorted-and-derive';
  readonly immutableOutput: true;
}
