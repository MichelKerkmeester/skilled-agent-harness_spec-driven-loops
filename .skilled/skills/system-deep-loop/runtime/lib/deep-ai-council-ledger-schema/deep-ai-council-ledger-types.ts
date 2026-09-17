// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Ledger Types
// ───────────────────────────────────────────────────────────────────

import type {
  EventEnvelope,
  JsonObject,
} from '../event-envelope/index.js';
import type { ReplayFingerprintDescriptor } from '../replay-fingerprint/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. IDENTITIES AND SHARED METADATA
// ───────────────────────────────────────────────────────────────────

export type CouncilRunId = string;
export type RoundId = string;
export type SeatId = string;
export type CritiqueRoundId = string;
export type ProposalId = string;
export type CandidateId = string;
export type JudgmentId = string;
export type ArtifactId = string;
export type GateId = string;
export type Digest = string;
export type Fingerprint = string;
export type Version = string;
export type Uint32 = number;

export interface DeepAiCouncilReplayMetadata extends JsonObject {
  readonly fingerprint_version: ReplayFingerprintDescriptor['fingerprint_version'];
  readonly final_digest: ReplayFingerprintDescriptor['final_digest'];
  readonly replay_input_digests: Record<string, string>;
}

export interface DeepAiCouncilBaseScope extends JsonObject {
  readonly runId: CouncilRunId;
  readonly roundId: RoundId;
}

export interface DeepAiCouncilGenerationScope extends DeepAiCouncilBaseScope {
  readonly generation: Uint32;
}

export interface DeepAiCouncilSeatScope extends DeepAiCouncilBaseScope {
  readonly seatId: SeatId;
}

export interface DeepAiCouncilProposalScope extends DeepAiCouncilSeatScope {
  readonly proposalId: ProposalId;
}

export interface DeepAiCouncilCritiqueScope extends DeepAiCouncilSeatScope {
  readonly critiqueRoundId: CritiqueRoundId;
}

export interface DeepAiCouncilCandidateScope extends DeepAiCouncilBaseScope {
  readonly candidateId: CandidateId;
}

export interface DeepAiCouncilJudgmentScope extends DeepAiCouncilBaseScope {
  readonly judgmentId: JudgmentId;
}

export interface DeepAiCouncilStanceScope extends DeepAiCouncilCandidateScope {
  readonly seatId: SeatId;
}

export interface DeepAiCouncilArtifactScope extends DeepAiCouncilBaseScope {
  readonly artifactId: ArtifactId;
}

export interface DeepAiCouncilGateScope extends DeepAiCouncilBaseScope {
  readonly gateId: GateId;
}

export type DeepAiCouncilScope =
  | DeepAiCouncilBaseScope
  | DeepAiCouncilGenerationScope
  | DeepAiCouncilSeatScope
  | DeepAiCouncilProposalScope
  | DeepAiCouncilCritiqueScope
  | DeepAiCouncilCandidateScope
  | DeepAiCouncilJudgmentScope
  | DeepAiCouncilStanceScope
  | DeepAiCouncilArtifactScope
  | DeepAiCouncilGateScope;

// ───────────────────────────────────────────────────────────────────
// 2. PAYLOAD VALUE OBJECTS
// ───────────────────────────────────────────────────────────────────

export interface TargetReference extends JsonObject {
  readonly targetId: string;
  readonly targetType: 'artifact' | 'directory' | 'file' | 'repository' | 'symbol';
  readonly artifactRef: string;
  readonly targetVersion: Version;
  readonly contentDigest: Digest;
}

export interface RawScoreVector extends JsonObject {
  readonly quality: number;
  readonly feasibility: number;
  readonly novelty: number;
  readonly risk: number;
}

export interface PairwisePreferenceVector extends JsonObject {
  readonly candidateA: number;
  readonly candidateB: number;
  readonly abstain: number;
}

export interface InformationSurface extends JsonObject {
  readonly role: 'detector' | 'generator' | 'orchestrator' | 'scorer' | 'test-gate';
  readonly capabilityRefs: string[];
  readonly visibleDigests: string[];
  readonly generatorIdentityVisible: boolean;
  readonly rationaleVisible: boolean;
  readonly peerScoresVisible: boolean;
  readonly voteCountsVisible: boolean;
  readonly independentJudgmentsCommitted: boolean;
}

export interface UsageCostReceipt extends JsonObject {
  readonly receiptRef: string;
  readonly inputTokens: Uint32;
  readonly outputTokens: Uint32;
  readonly costMicros: Uint32;
}

export interface IndependenceSnapshot extends JsonObject {
  readonly snapshotRef: string;
  readonly inputDigest: Digest;
  readonly calibrationRef: string;
  readonly effectiveSeatCount: number;
  readonly dependenceMeasure: number;
  readonly marginalGain: number;
}

export interface SourceEventRange extends JsonObject {
  readonly firstEventId: string;
  readonly lastEventId: string;
}

export interface RequiredSectionResult extends JsonObject {
  readonly sectionId: string;
  readonly status: 'fail' | 'pass' | 'unknown';
  readonly evidenceDigest: Digest;
}

export interface RequiredCheckResult extends JsonObject {
  readonly checkId: string;
  readonly status: 'fail' | 'pass' | 'unknown';
  readonly resultDigest: Digest;
}

export interface SeatOutcomeCounts extends JsonObject {
  readonly selected: Uint32;
  readonly dispatched: Uint32;
  readonly returned: Uint32;
  readonly failed: Uint32;
  readonly timedOut: Uint32;
}

export interface CouncilCompletionCounts extends JsonObject {
  readonly rounds: Uint32;
  readonly seats: Uint32;
  readonly proposals: Uint32;
  readonly judgments: Uint32;
}

// ───────────────────────────────────────────────────────────────────
// 3. EVENT PAYLOAD DATA
// ───────────────────────────────────────────────────────────────────

export interface RunInitializedData extends JsonObject {
  readonly target: TargetReference;
  readonly targetDigest: Digest;
  readonly taskClass: string;
  readonly configDigest: Digest;
  readonly strategyDigest: Digest;
  readonly convergencePolicyDigest: Digest;
  readonly testGatePolicyDigest: Digest;
  readonly maxRounds: Uint32;
  readonly minSeatCount: Uint32;
  readonly maxSeatCount: Uint32;
  readonly planningOnly: true;
  readonly initialReplayFingerprint: Fingerprint;
}

export interface RunResumedData extends JsonObject {
  readonly priorTailDigest: Digest;
  readonly sourceRunId: CouncilRunId;
  readonly resumeReason: string;
  readonly generation: Uint32;
  readonly compatibilityDecision: DeepAiCouncilCompatibilityStatus;
  readonly recoveryReceiptRef: string;
  readonly continuationScopeRef: string;
}

export interface RunRestartedData extends JsonObject {
  readonly priorTailDigest: Digest;
  readonly archivedLineageRef: string;
  readonly restartReason: string;
  readonly generation: Uint32;
  readonly compatibilityDecision: DeepAiCouncilCompatibilityStatus;
  readonly recoveryReceiptRef: string;
  readonly continuationScopeRef: string;
}

export interface RoundStartedData extends JsonObject {
  readonly roundNumber: Uint32;
  readonly executorBoundaryRef: string;
  readonly seatRosterDigest: Digest;
  readonly protocolVersion: Version;
  readonly promptPackDigest: Digest;
  readonly budgetRef: string;
  readonly priorRoundRef: string | null;
  readonly exposurePolicyVersion: Version;
  readonly informationSurface: InformationSurface;
}

export interface SeatSelectedData extends JsonObject {
  readonly strategyLens: string;
  readonly mandateDigest: Digest;
  readonly vantageFingerprint: Fingerprint;
  readonly modelFingerprint: Fingerprint;
  readonly independenceGroup: string;
  readonly capabilityDigest: Digest;
  readonly promptDigest: Digest;
  readonly selectionUtility: number;
  readonly selectionPolicyVersion: Version;
}

export interface SeatDispatchedData extends JsonObject {
  readonly dispatchReceiptRef: string;
  readonly logicalBranchRef: string;
  readonly attempt: Uint32;
  readonly budgetLeaseRef: string;
  readonly capabilityDigest: Digest;
  readonly promptDigest: Digest;
  readonly informationSurface: InformationSurface;
}

export interface ProposalObservedData extends JsonObject {
  readonly targetVersion: Version;
  readonly responseStatus: 'failed' | 'partial' | 'returned' | 'timeout';
  readonly proposalDigest: Digest;
  readonly artifactRef: string;
  readonly artifactDigest: Digest;
  readonly rawScores: RawScoreVector;
  readonly rawConfidence: number;
  readonly usage: UsageCostReceipt;
  readonly evidenceRefs: string[];
  readonly outputSchemaVersion: Version;
  readonly observationDigest: Digest;
  readonly informationSurface: InformationSurface;
}

export interface SeatReturnedData extends ProposalObservedData {
  readonly failureReason: string | null;
  readonly timeoutReason: string | null;
}

export interface CritiqueRoundStartedData extends JsonObject {
  readonly sourceProposalIds: string[];
  readonly visibleInformationPolicyVersion: Version;
  readonly inputDigest: Digest;
  readonly informationSurface: InformationSurface;
}

export interface CritiqueRecordedData extends JsonObject {
  readonly sourceProposalIds: string[];
  readonly critiqueArtifactRef: string;
  readonly critiqueArtifactDigest: Digest;
  readonly referencedClaimRefs: string[];
  readonly rawSeverity: number;
  readonly rawConfidence: number;
  readonly challengeDisposition: 'accepted' | 'contested' | 'rejected' | 'unresolved';
  readonly causalProposalRefs: string[];
  readonly informationSurface: InformationSurface;
}

export interface CandidateBlindedData extends JsonObject {
  readonly sourceProposalIds: string[];
  readonly candidateAliasDigest: Digest;
  readonly shuffleSeedDigest: Digest;
  readonly visibleCandidateDigest: Digest;
  readonly artifactRef: string;
  readonly artifactDigest: Digest;
  readonly targetVersion: Version;
  readonly redactionPolicyVersion: Version;
  readonly informationSurface: InformationSurface;
}

export interface PairwiseJudgmentRecordedData extends JsonObject {
  readonly candidateAId: CandidateId;
  readonly candidateBId: CandidateId;
  readonly orderToken: 'a-first' | 'b-first';
  readonly judgeProfileFingerprint: Fingerprint;
  readonly rawPreference: PairwisePreferenceVector;
  readonly rawConfidence: number;
  readonly judgmentStatus: 'abstained' | 'consistent' | 'inconsistent';
  readonly inputDigest: Digest;
  readonly calibrationRef: string;
  readonly informationSurface: InformationSurface;
  readonly supersedesJudgmentId: null;
}

export interface BiasAuditRecordedData extends JsonObject {
  readonly candidateAId: CandidateId;
  readonly candidateBId: CandidateId;
  readonly pairedJudgmentIds: string[];
  readonly biasFeatureCodes: string[];
  readonly detectorResult: 'flagged' | 'inconclusive' | 'passed';
  readonly inconsistencyStatus: 'consistent' | 'inconsistent' | 'unknown';
  readonly rawBiasScore: number;
  readonly inputDigest: Digest;
  readonly detectorFingerprint: Fingerprint;
}

export interface AdjudicationDecisionData extends JsonObject {
  readonly candidateSetDigest: Digest;
  readonly protocolVersion: Version;
  readonly rubricVersion: Version;
  readonly rawScores: RawScoreVector;
  readonly calibratedScores: RawScoreVector;
  readonly supportMass: number;
  readonly oppositionMass: number;
  readonly independence: IndependenceSnapshot;
  readonly minorityRefs: string[];
  readonly contradictionRefs: string[];
  readonly vetoFindingRefs: string[];
  readonly disposition: 'selected' | 'unresolved';
  readonly selectedCandidateId: CandidateId | null;
  readonly evaluatorReceiptRef: string;
  readonly sourceJudgmentIds: string[];
}

export interface StanceRecordedData extends JsonObject {
  readonly candidateOrPlanRef: string;
  readonly priorStanceEventId: string | null;
  readonly currentStance: 'abstain' | 'oppose' | 'support' | 'uncertain';
  readonly rawRationaleDigest: Digest;
  readonly evidenceRef: string;
  readonly influenceObservationDigest: Digest;
}

export interface StanceFlippedData extends JsonObject {
  readonly candidateOrPlanRef: string;
  readonly priorStanceEventId: string;
  readonly priorStance: 'abstain' | 'oppose' | 'support' | 'uncertain';
  readonly currentStance: 'abstain' | 'oppose' | 'support' | 'uncertain';
  readonly flipDirection: 'away-from-support' | 'toward-support';
  readonly rawRationaleDigest: Digest;
  readonly evidenceRef: string;
  readonly influenceObservationDigest: Digest;
}

export interface DeliberationSynthesizedData extends JsonObject {
  readonly inputEventRange: SourceEventRange;
  readonly candidateSetDigest: Digest;
  readonly planDisposition: 'selected' | 'unresolved';
  readonly selectedPlanDigest: Digest;
  readonly disagreementRefs: string[];
  readonly minorityRefs: string[];
  readonly synthesisPolicyFingerprint: Fingerprint;
  readonly evaluatorFingerprint: Fingerprint;
  readonly reportDraftRef: string;
  readonly synthesisReceiptRef: string;
}

export interface ConvergenceEvaluatedData extends JsonObject {
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
}

export interface RoundEndedData extends JsonObject {
  readonly roundStatus: 'blocked' | 'complete' | 'incomplete' | 'non-converged';
  readonly convergenceEventId: string;
  readonly acceptedCandidateRefs: string[];
  readonly rejectedCandidateRefs: string[];
  readonly unresolvedCandidateRefs: string[];
  readonly seatOutcomeCounts: SeatOutcomeCounts;
  readonly lateResultDisposition: 'discarded' | 'none' | 'retained-for-audit';
  readonly finalRoundTailDigest: Digest;
  readonly continuationDecision: 'complete' | 'continue' | 'recover' | 'stop';
}

export interface ArtifactCommittedData extends JsonObject {
  readonly artifactKind: string;
  readonly safeRelativePath: string;
  readonly schemaVersion: Version;
  readonly byteDigest: Digest;
  readonly contentDigest: Digest;
  readonly requiredSectionResults: RequiredSectionResult[];
  readonly sourceEventRange: SourceEventRange;
  readonly supersedesArtifactId: null;
  readonly rollbackRef: string | null;
}

export interface ArtifactSupersededData extends JsonObject {
  readonly artifactKind: string;
  readonly safeRelativePath: string;
  readonly schemaVersion: Version;
  readonly byteDigest: Digest;
  readonly contentDigest: Digest;
  readonly requiredSectionResults: RequiredSectionResult[];
  readonly sourceEventRange: SourceEventRange;
  readonly priorArtifactId: ArtifactId;
  readonly successorArtifactId: ArtifactId;
  readonly supersessionReason: string;
  readonly rollbackRef: string | null;
}

export interface CouncilTestGateEvaluatedData extends JsonObject {
  readonly testSuiteDigest: Digest;
  readonly fixtureManifestDigest: Digest;
  readonly baselineFingerprint: Fingerprint;
  readonly candidateFingerprint: Fingerprint;
  readonly requiredCheckResults: RequiredCheckResult[];
  readonly criticalFailureRefs: string[];
  readonly metamorphicCheckDigest: Digest;
  readonly biasCheckDigest: Digest;
  readonly artifactCompleteness: 'complete' | 'incomplete' | 'unknown';
  readonly verdict: 'blocked' | 'fail' | 'pass';
  readonly gateReceiptRef: string;
  readonly informationSurface: InformationSurface;
}

export interface RollbackRecordedData extends JsonObject {
  readonly rollbackReason: string;
  readonly supersededEventRefs: string[];
  readonly supersededArtifactRefs: string[];
  readonly failedGateRef: string | null;
  readonly recoveryReceiptRef: string;
  readonly restoredLegacyPathRef: string;
  readonly authorizationRef: string;
}

export interface CouncilCompleteData extends JsonObject {
  readonly terminalStatus: 'completed' | 'incomplete' | 'non-converged';
  readonly convergenceEventId: string;
  readonly finalDeliberationEventId: string;
  readonly artifactManifestRef: string;
  readonly councilTestGateEventId: string;
  readonly finalLedgerTailDigest: Digest;
  readonly counts: CouncilCompletionCounts;
  readonly recommendationOrUserDecisionRef: string;
  readonly terminalReason: string;
}

// ───────────────────────────────────────────────────────────────────
// 4. EVENT UNION
// ───────────────────────────────────────────────────────────────────

export const DeepAiCouncilEventStems = Object.freeze([
  'ai_council.run_initialized',
  'ai_council.run_resumed',
  'ai_council.run_restarted',
  'ai_council.round_started',
  'ai_council.seat_selected',
  'ai_council.seat_dispatched',
  'ai_council.proposal_observed',
  'ai_council.seat_returned',
  'ai_council.critique_round_started',
  'ai_council.critique_recorded',
  'ai_council.candidate_blinded',
  'ai_council.pairwise_judgment_recorded',
  'ai_council.bias_audit_recorded',
  'ai_council.adjudication_decision',
  'ai_council.stance_recorded',
  'ai_council.stance_flipped',
  'ai_council.deliberation_synthesized',
  'ai_council.convergence_evaluated',
  'ai_council.convergence_blocked',
  'ai_council.round_ended',
  'ai_council.artifact_committed',
  'ai_council.artifact_superseded',
  'ai_council.council_test_gate_evaluated',
  'ai_council.rollback_recorded',
  'ai_council.council_complete',
] as const);

export type DeepAiCouncilEventStem = typeof DeepAiCouncilEventStems[number];

export const DeepAiCouncilWireEventTypes = Object.freeze({
  'ai_council.run_initialized': 'deep-ai-council.ledger.run-initialized',
  'ai_council.run_resumed': 'deep-ai-council.ledger.run-resumed',
  'ai_council.run_restarted': 'deep-ai-council.ledger.run-restarted',
  'ai_council.round_started': 'deep-ai-council.ledger.round-started',
  'ai_council.seat_selected': 'deep-ai-council.ledger.seat-selected',
  'ai_council.seat_dispatched': 'deep-ai-council.ledger.seat-dispatched',
  'ai_council.proposal_observed': 'deep-ai-council.ledger.proposal-observed',
  'ai_council.seat_returned': 'deep-ai-council.ledger.seat-returned',
  'ai_council.critique_round_started': 'deep-ai-council.ledger.critique-round-started',
  'ai_council.critique_recorded': 'deep-ai-council.ledger.critique-recorded',
  'ai_council.candidate_blinded': 'deep-ai-council.ledger.candidate-blinded',
  'ai_council.pairwise_judgment_recorded':
    'deep-ai-council.ledger.pairwise-judgment-recorded',
  'ai_council.bias_audit_recorded': 'deep-ai-council.ledger.bias-audit-recorded',
  'ai_council.adjudication_decision': 'deep-ai-council.ledger.adjudication-decision',
  'ai_council.stance_recorded': 'deep-ai-council.ledger.stance-recorded',
  'ai_council.stance_flipped': 'deep-ai-council.ledger.stance-flipped',
  'ai_council.deliberation_synthesized': 'deep-ai-council.ledger.deliberation-synthesized',
  'ai_council.convergence_evaluated': 'deep-ai-council.ledger.convergence-evaluated',
  'ai_council.convergence_blocked': 'deep-ai-council.ledger.convergence-blocked',
  'ai_council.round_ended': 'deep-ai-council.ledger.round-ended',
  'ai_council.artifact_committed': 'deep-ai-council.ledger.artifact-committed',
  'ai_council.artifact_superseded': 'deep-ai-council.ledger.artifact-superseded',
  'ai_council.council_test_gate_evaluated':
    'deep-ai-council.ledger.council-test-gate-evaluated',
  'ai_council.rollback_recorded': 'deep-ai-council.ledger.rollback-recorded',
  'ai_council.council_complete': 'deep-ai-council.ledger.council-complete',
} as const satisfies Readonly<Record<DeepAiCouncilEventStem, string>>);

export type DeepAiCouncilWireEventType =
  typeof DeepAiCouncilWireEventTypes[DeepAiCouncilEventStem];

export interface DeepAiCouncilPayloadMap {
  readonly 'ai_council.run_initialized': RunInitializedData;
  readonly 'ai_council.run_resumed': RunResumedData;
  readonly 'ai_council.run_restarted': RunRestartedData;
  readonly 'ai_council.round_started': RoundStartedData;
  readonly 'ai_council.seat_selected': SeatSelectedData;
  readonly 'ai_council.seat_dispatched': SeatDispatchedData;
  readonly 'ai_council.proposal_observed': ProposalObservedData;
  readonly 'ai_council.seat_returned': SeatReturnedData;
  readonly 'ai_council.critique_round_started': CritiqueRoundStartedData;
  readonly 'ai_council.critique_recorded': CritiqueRecordedData;
  readonly 'ai_council.candidate_blinded': CandidateBlindedData;
  readonly 'ai_council.pairwise_judgment_recorded': PairwiseJudgmentRecordedData;
  readonly 'ai_council.bias_audit_recorded': BiasAuditRecordedData;
  readonly 'ai_council.adjudication_decision': AdjudicationDecisionData;
  readonly 'ai_council.stance_recorded': StanceRecordedData;
  readonly 'ai_council.stance_flipped': StanceFlippedData;
  readonly 'ai_council.deliberation_synthesized': DeliberationSynthesizedData;
  readonly 'ai_council.convergence_evaluated': ConvergenceEvaluatedData;
  readonly 'ai_council.convergence_blocked': ConvergenceEvaluatedData;
  readonly 'ai_council.round_ended': RoundEndedData;
  readonly 'ai_council.artifact_committed': ArtifactCommittedData;
  readonly 'ai_council.artifact_superseded': ArtifactSupersededData;
  readonly 'ai_council.council_test_gate_evaluated': CouncilTestGateEvaluatedData;
  readonly 'ai_council.rollback_recorded': RollbackRecordedData;
  readonly 'ai_council.council_complete': CouncilCompleteData;
}

export interface DeepAiCouncilScopeMap {
  readonly 'ai_council.run_initialized': DeepAiCouncilBaseScope;
  readonly 'ai_council.run_resumed': DeepAiCouncilGenerationScope;
  readonly 'ai_council.run_restarted': DeepAiCouncilGenerationScope;
  readonly 'ai_council.round_started': DeepAiCouncilBaseScope;
  readonly 'ai_council.seat_selected': DeepAiCouncilSeatScope;
  readonly 'ai_council.seat_dispatched': DeepAiCouncilSeatScope;
  readonly 'ai_council.proposal_observed': DeepAiCouncilProposalScope;
  readonly 'ai_council.seat_returned': DeepAiCouncilProposalScope;
  readonly 'ai_council.critique_round_started': DeepAiCouncilCritiqueScope;
  readonly 'ai_council.critique_recorded': DeepAiCouncilCritiqueScope;
  readonly 'ai_council.candidate_blinded': DeepAiCouncilCandidateScope;
  readonly 'ai_council.pairwise_judgment_recorded': DeepAiCouncilJudgmentScope;
  readonly 'ai_council.bias_audit_recorded': DeepAiCouncilJudgmentScope;
  readonly 'ai_council.adjudication_decision': DeepAiCouncilBaseScope;
  readonly 'ai_council.stance_recorded': DeepAiCouncilStanceScope;
  readonly 'ai_council.stance_flipped': DeepAiCouncilStanceScope;
  readonly 'ai_council.deliberation_synthesized': DeepAiCouncilBaseScope;
  readonly 'ai_council.convergence_evaluated': DeepAiCouncilBaseScope;
  readonly 'ai_council.convergence_blocked': DeepAiCouncilBaseScope;
  readonly 'ai_council.round_ended': DeepAiCouncilBaseScope;
  readonly 'ai_council.artifact_committed': DeepAiCouncilArtifactScope;
  readonly 'ai_council.artifact_superseded': DeepAiCouncilArtifactScope;
  readonly 'ai_council.council_test_gate_evaluated': DeepAiCouncilGateScope;
  readonly 'ai_council.rollback_recorded': DeepAiCouncilBaseScope;
  readonly 'ai_council.council_complete': DeepAiCouncilBaseScope;
}

export interface DeepAiCouncilLedgerPayload<
  TStem extends DeepAiCouncilEventStem,
> extends JsonObject {
  readonly stem: TStem;
  readonly eventVersion: 1;
  readonly scope: DeepAiCouncilScopeMap[TStem];
  readonly prevEventHash: Digest;
  readonly payloadDigest: Digest;
  readonly replay: DeepAiCouncilReplayMetadata;
  readonly data: DeepAiCouncilPayloadMap[TStem];
}

export type DeepAiCouncilEventEnvelope<
  TStem extends DeepAiCouncilEventStem = DeepAiCouncilEventStem,
> = EventEnvelope & {
  readonly event_type: typeof DeepAiCouncilWireEventTypes[TStem];
  readonly event_version: 1;
  readonly payload: DeepAiCouncilLedgerPayload<TStem>;
};

export type DeepAiCouncilLedgerEvent = {
  readonly [TStem in DeepAiCouncilEventStem]: DeepAiCouncilEventEnvelope<TStem>;
}[DeepAiCouncilEventStem];

// ───────────────────────────────────────────────────────────────────
// 5. COMPATIBILITY TYPES
// ───────────────────────────────────────────────────────────────────

export type DeepAiCouncilCompatibilityStatus =
  | 'blocked'
  | 'compatible'
  | 'exact'
  | 'migrate'
  | 'pin-old-runtime';

export interface DeepAiCouncilCompatibilityDecision {
  readonly status: DeepAiCouncilCompatibilityStatus;
  readonly reasonCode: string;
  readonly targetStem: DeepAiCouncilEventStem | null;
  readonly sourceVersion: number | null;
  readonly targetVersion: 1;
}

export interface LegacyDeepAiCouncilUpcastContext {
  readonly scope: DeepAiCouncilBaseScope | DeepAiCouncilGenerationScope;
  readonly prevEventHash: Digest;
  readonly replay: DeepAiCouncilReplayMetadata;
}

export interface LegacyDeepAiCouncilUpcastCandidate {
  readonly status: 'migrated';
  readonly targetStem: DeepAiCouncilEventStem;
  readonly eventVersion: 1;
  readonly originalRecordDigest: Digest;
  readonly upcasterFingerprint: Fingerprint;
  readonly warnings: readonly string[];
  readonly scope: DeepAiCouncilScope;
  readonly prevEventHash: Digest;
  readonly replay: DeepAiCouncilReplayMetadata;
  readonly data: JsonObject;
}

export type LegacyDeepAiCouncilUpcastResult =
  | LegacyDeepAiCouncilUpcastCandidate
  | {
    readonly status: 'refused';
    readonly decision: DeepAiCouncilCompatibilityDecision;
  };
