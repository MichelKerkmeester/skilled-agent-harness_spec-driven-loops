// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Ledger Types
// ───────────────────────────────────────────────────────────────────

import type {
  EventEnvelope,
  JsonObject,
} from '../event-envelope/index.js';
import type { ReplayFingerprintDescriptor } from '../replay-fingerprint/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. IDENTITIES AND SHARED METADATA
// ───────────────────────────────────────────────────────────────────

export type RunId = string;
export type LineageId = string;
export type QuestionId = string;
export type LogicalBranchId = string;
export type SourceVersionId = string;
export type EvidenceId = string;
export type ClaimId = string;
export type ClaimVersionId = string;
export type Digest = string;
export type Fingerprint = string;
export type Version = string;
export type Uint32 = number;

export interface DeepResearchReplayMetadata extends JsonObject {
  readonly fingerprint_version: ReplayFingerprintDescriptor['fingerprint_version'];
  readonly final_digest: ReplayFingerprintDescriptor['final_digest'];
  readonly replay_input_digests: Record<string, string>;
}

export interface DeepResearchBaseScope extends JsonObject {
  readonly runId: RunId;
  readonly lineageId: LineageId;
}

export interface DeepResearchQuestionScope extends DeepResearchBaseScope {
  readonly questionId: QuestionId;
}

export interface DeepResearchBranchScope extends DeepResearchQuestionScope {
  readonly branchId: LogicalBranchId;
}

export interface DeepResearchIterationScope extends DeepResearchBaseScope {
  readonly iteration: Uint32;
}

export interface DeepResearchSourceScope extends DeepResearchIterationScope {
  readonly sourceVersionId: SourceVersionId;
}

export interface DeepResearchEvidenceScope extends DeepResearchSourceScope {
  readonly evidenceId: EvidenceId;
}

export interface DeepResearchClaimScope extends DeepResearchIterationScope {
  readonly claimVersionId: ClaimVersionId;
}

export type DeepResearchScope =
  | DeepResearchBaseScope
  | DeepResearchQuestionScope
  | DeepResearchBranchScope
  | DeepResearchIterationScope
  | DeepResearchSourceScope
  | DeepResearchEvidenceScope
  | DeepResearchClaimScope;

// ───────────────────────────────────────────────────────────────────
// 2. PAYLOAD VALUE OBJECTS
// ───────────────────────────────────────────────────────────────────

export interface ScoreVector extends JsonObject {
  readonly expectedYield: number;
  readonly contradictionRisk: number;
  readonly impact: number;
  readonly independenceGain: number;
  readonly staleness: number;
  readonly expectedCost: number;
}

export interface SourceLocator extends JsonObject {
  readonly scheme: 'artifact' | 'file' | 'other' | 'url';
  readonly locatorDigest: Digest;
  readonly selector: string;
  readonly revision: string | null;
}

export interface PassageLocator extends JsonObject {
  readonly locatorDigest: Digest;
  readonly selector: string;
  readonly passageDigest: Digest;
}

export interface SourceEventRange extends JsonObject {
  readonly firstEventId: string;
  readonly lastEventId: string;
}

export interface RunCompletionCounts extends JsonObject {
  readonly iterations: Uint32;
  readonly sources: Uint32;
  readonly admittedEvidence: Uint32;
  readonly claims: Uint32;
}

// ───────────────────────────────────────────────────────────────────
// 3. EVENT PAYLOAD DATA
// ───────────────────────────────────────────────────────────────────

export interface RunInitializedData extends JsonObject {
  readonly generation: Uint32;
  readonly charterDigest: Digest;
  readonly configDigest: Digest;
  readonly executorFingerprint: Fingerprint;
  readonly replayFingerprint: Fingerprint;
  readonly maxIterations: Uint32;
  readonly convergencePolicyVersion: Version;
}

export interface RunResumedData extends JsonObject {
  readonly priorTailDigest: Digest;
  readonly sourceLineageId: LineageId;
  readonly resumeReason: string;
  readonly generation: Uint32;
  readonly compatibilityDecision: DeepResearchCompatibilityStatus;
  readonly recoveryReceiptRef: string;
}

export interface RunRestartedData extends JsonObject {
  readonly priorTailDigest: Digest;
  readonly archivedLineageId: LineageId;
  readonly restartReason: string;
  readonly generation: Uint32;
  readonly compatibilityDecision: DeepResearchCompatibilityStatus;
  readonly recoveryReceiptRef: string;
}

export interface QuestionRegisteredData extends JsonObject {
  readonly normalizedQuestionDigest: Digest;
  readonly dependencyQuestionIds: string[];
  readonly requiredSourceClasses: string[];
  readonly disconfirmingQueryRecipeIds: string[];
  readonly budgetRef: string;
}

export interface BranchDecisionData extends JsonObject {
  readonly semanticClusterId: string;
  readonly expectedYieldScoreVector: ScoreVector;
  readonly contradictionRisk: number;
  readonly impact: number;
  readonly independenceGain: number;
  readonly staleness: number;
  readonly expectedCost: number;
  readonly tieBreakKey: string;
  readonly reservationRef: string;
}

export interface IterationStartedData extends JsonObject {
  readonly focusRef: string;
  readonly stateTailDigest: Digest;
  readonly strategyDigest: Digest;
  readonly status: 'started';
}

export interface IterationCompletedData extends JsonObject {
  readonly status: 'complete' | 'error' | 'insight' | 'stuck' | 'thought' | 'timeout';
  readonly rawNewInfoRatio: number;
  readonly trustedEvidenceYield: number;
  readonly outputDigest: Digest;
  readonly ruledOutApproachRefs: string[];
  readonly nextFocusCausationId: string;
}

export interface SourceCapturedData extends JsonObject {
  readonly sourceIdentityDigest: Digest;
  readonly locator: SourceLocator;
  readonly capturedAt: string;
  readonly contentDigest: Digest;
  readonly mediaType: string;
  readonly retrievalReceiptRef: string;
  readonly parentSourceVersionId: SourceVersionId | null;
  readonly instructionScanResult: 'clean' | 'flagged' | 'unknown';
}

export interface EvidenceAdmissionDecidedData extends JsonObject {
  readonly disposition: 'admit' | 'degrade' | 'quarantine';
  readonly passageLocators: PassageLocator[];
  readonly atomicClaimRefs: string[];
  readonly derivativeSourceGroup: string;
  readonly admissionPolicyVersion: Version;
  readonly contaminationStatus: 'clean' | 'contaminated' | 'suspected' | 'unknown';
  readonly reasonCode: string;
}

export interface ClaimAssertedData extends JsonObject {
  readonly claimId: ClaimId;
  readonly normalizedClaimDigest: Digest;
  readonly evidenceIds: string[];
  readonly independenceGroup: string;
  readonly rawConfidence: number;
  readonly claimStatus: 'contested' | 'supported' | 'unresolved';
}

export interface ClaimRelationRecordedData extends JsonObject {
  readonly claimId: ClaimId;
  readonly relatedClaimVersionId: ClaimVersionId;
  readonly evidenceIds: string[];
  readonly relation: 'contextualizes' | 'contradicts' | 'qualifies' | 'supports';
  readonly independenceGroup: string;
  readonly rawConfidence: number;
  readonly claimStatus: 'contested' | 'supported' | 'unresolved';
}

export interface ClaimSupersededData extends JsonObject {
  readonly priorClaimVersionId: ClaimVersionId;
  readonly successorClaimVersionId: ClaimVersionId;
  readonly supersessionReason: string;
  readonly effectiveAt: string;
  readonly replacementEvidenceIds: string[];
  readonly invalidationScope: string;
}

export interface GapDetectedData extends JsonObject {
  readonly obligationId: string;
  readonly gapKind: 'contradiction' | 'coverage' | 'source-diversity' | 'verification';
  readonly affectedClaimIds: string[];
  readonly affectedQuestionIds: string[];
  readonly criticality: number;
  readonly proposedQueryRecipeIds: string[];
}

export interface NextFocusSelectedData extends JsonObject {
  readonly obligationId: string;
  readonly selectionScoreVector: ScoreVector;
  readonly visitCooldown: Uint32;
  readonly policyVersion: Version;
  readonly chosenBranchId: LogicalBranchId | null;
  readonly chosenQuestionId: QuestionId | null;
}

export interface RawConvergenceSignals extends JsonObject {
  readonly newInfoRatio: number;
  readonly contradictionRisk: number;
  readonly citationDrift: number;
  readonly observationDigest: Digest;
}

export interface TrustedConvergenceSignals extends JsonObject {
  readonly evidenceYield: number;
  readonly independentSourceRatio: number;
  readonly supportedClaimRatio: number;
  readonly assessmentDigest: Digest;
}

export type ConvergenceGateStatus = 'fail' | 'pass' | 'unknown';

export interface ConvergenceQualityGateResults extends JsonObject {
  readonly sourceDiversity: ConvergenceGateStatus;
  readonly contradictionResolution: ConvergenceGateStatus;
  readonly citationIntegrity: ConvergenceGateStatus;
  readonly policyVersion: Version;
  readonly resultDigest: Digest;
}

export interface ConvergenceDecisionData extends JsonObject {
  readonly decision: 'blocked' | 'continue' | 'converged' | 'incomplete' | 'recover';
  readonly rawSignals: RawConvergenceSignals;
  readonly trustedSignals: TrustedConvergenceSignals;
  readonly qualityGateResults: ConvergenceQualityGateResults;
  readonly blockerIds: string[];
  readonly policyFingerprint: Fingerprint;
  readonly evaluatorFingerprint: Fingerprint;
  readonly evidenceTailHash: Digest;
  readonly incompleteReason: string | null;
  readonly recoveryReason: string | null;
}

export interface SynthesisStartedData extends JsonObject {
  readonly admittedLedgerRevision: string;
  readonly selectedClaimVersionSetDigest: Digest;
  readonly synthesisPolicyDigest: Digest;
  readonly reportRevision: string;
  readonly unresolvedClaimIds: string[];
  readonly contestedClaimIds: string[];
}

export interface SynthesisCommittedData extends SynthesisStartedData {
  readonly reportDigest: Digest;
  readonly citationEventIds: string[];
  readonly synthesisReceiptRef: string;
}

export interface MemorySaveRequestedData extends JsonObject {
  readonly targetPacket: string;
  readonly continuityPayloadDigest: Digest;
  readonly route: string;
  readonly mergeMode: string;
  readonly sourceEventRange: SourceEventRange;
}

export interface MemorySaveCompletedData extends MemorySaveRequestedData {
  readonly persistenceReceiptRefs: string[];
  readonly continuityFingerprint: Fingerprint;
}

export interface MemorySaveFailedData extends MemorySaveRequestedData {
  readonly retryable: boolean;
  readonly failureReason: string;
}

export interface RunCompletedData extends JsonObject {
  readonly terminalStatus: 'blocked' | 'completed' | 'incomplete';
  readonly convergenceEventId: string;
  readonly synthesisEventId: string;
  readonly memorySaveEventId: string;
  readonly finalLedgerTailHash: Digest;
  readonly counts: RunCompletionCounts;
  readonly completionReason: string | null;
  readonly incompleteReason: string | null;
}

// ───────────────────────────────────────────────────────────────────
// 4. EVENT UNION
// ───────────────────────────────────────────────────────────────────

export const DeepResearchEventStems = Object.freeze([
  'deep_research.run_initialized',
  'deep_research.run_resumed',
  'deep_research.run_restarted',
  'deep_research.question_registered',
  'deep_research.branch_planned',
  'deep_research.branch_selected',
  'deep_research.iteration_started',
  'deep_research.iteration_completed',
  'deep_research.source_captured',
  'deep_research.evidence_admission_decided',
  'deep_research.claim_asserted',
  'deep_research.claim_relation_recorded',
  'deep_research.claim_superseded',
  'deep_research.gap_detected',
  'deep_research.next_focus_selected',
  'deep_research.convergence_evaluated',
  'deep_research.convergence_blocked',
  'deep_research.synthesis_started',
  'deep_research.synthesis_committed',
  'deep_research.memory_save_requested',
  'deep_research.memory_save_completed',
  'deep_research.memory_save_failed',
  'deep_research.run_completed',
] as const);

export type DeepResearchEventStem = typeof DeepResearchEventStems[number];

export const DeepResearchWireEventTypes = Object.freeze({
  'deep_research.run_initialized': 'deep-research.ledger.run-initialized',
  'deep_research.run_resumed': 'deep-research.ledger.run-resumed',
  'deep_research.run_restarted': 'deep-research.ledger.run-restarted',
  'deep_research.question_registered': 'deep-research.ledger.question-registered',
  'deep_research.branch_planned': 'deep-research.ledger.branch-planned',
  'deep_research.branch_selected': 'deep-research.ledger.branch-selected',
  'deep_research.iteration_started': 'deep-research.ledger.iteration-started',
  'deep_research.iteration_completed': 'deep-research.ledger.iteration-completed',
  'deep_research.source_captured': 'deep-research.ledger.source-captured',
  'deep_research.evidence_admission_decided': 'deep-research.ledger.evidence-admission-decided',
  'deep_research.claim_asserted': 'deep-research.ledger.claim-asserted',
  'deep_research.claim_relation_recorded': 'deep-research.ledger.claim-relation-recorded',
  'deep_research.claim_superseded': 'deep-research.ledger.claim-superseded',
  'deep_research.gap_detected': 'deep-research.ledger.gap-detected',
  'deep_research.next_focus_selected': 'deep-research.ledger.next-focus-selected',
  'deep_research.convergence_evaluated': 'deep-research.ledger.convergence-evaluated',
  'deep_research.convergence_blocked': 'deep-research.ledger.convergence-blocked',
  'deep_research.synthesis_started': 'deep-research.ledger.synthesis-started',
  'deep_research.synthesis_committed': 'deep-research.ledger.synthesis-committed',
  'deep_research.memory_save_requested': 'deep-research.ledger.memory-save-requested',
  'deep_research.memory_save_completed': 'deep-research.ledger.memory-save-completed',
  'deep_research.memory_save_failed': 'deep-research.ledger.memory-save-failed',
  'deep_research.run_completed': 'deep-research.ledger.run-completed',
} as const satisfies Readonly<Record<DeepResearchEventStem, string>>);

export type DeepResearchWireEventType =
  typeof DeepResearchWireEventTypes[DeepResearchEventStem];

export interface DeepResearchPayloadMap {
  readonly 'deep_research.run_initialized': RunInitializedData;
  readonly 'deep_research.run_resumed': RunResumedData;
  readonly 'deep_research.run_restarted': RunRestartedData;
  readonly 'deep_research.question_registered': QuestionRegisteredData;
  readonly 'deep_research.branch_planned': BranchDecisionData;
  readonly 'deep_research.branch_selected': BranchDecisionData;
  readonly 'deep_research.iteration_started': IterationStartedData;
  readonly 'deep_research.iteration_completed': IterationCompletedData;
  readonly 'deep_research.source_captured': SourceCapturedData;
  readonly 'deep_research.evidence_admission_decided': EvidenceAdmissionDecidedData;
  readonly 'deep_research.claim_asserted': ClaimAssertedData;
  readonly 'deep_research.claim_relation_recorded': ClaimRelationRecordedData;
  readonly 'deep_research.claim_superseded': ClaimSupersededData;
  readonly 'deep_research.gap_detected': GapDetectedData;
  readonly 'deep_research.next_focus_selected': NextFocusSelectedData;
  readonly 'deep_research.convergence_evaluated': ConvergenceDecisionData;
  readonly 'deep_research.convergence_blocked': ConvergenceDecisionData;
  readonly 'deep_research.synthesis_started': SynthesisStartedData;
  readonly 'deep_research.synthesis_committed': SynthesisCommittedData;
  readonly 'deep_research.memory_save_requested': MemorySaveRequestedData;
  readonly 'deep_research.memory_save_completed': MemorySaveCompletedData;
  readonly 'deep_research.memory_save_failed': MemorySaveFailedData;
  readonly 'deep_research.run_completed': RunCompletedData;
}

export interface DeepResearchScopeMap {
  readonly 'deep_research.run_initialized': DeepResearchBaseScope;
  readonly 'deep_research.run_resumed': DeepResearchBaseScope;
  readonly 'deep_research.run_restarted': DeepResearchBaseScope;
  readonly 'deep_research.question_registered': DeepResearchQuestionScope;
  readonly 'deep_research.branch_planned': DeepResearchBranchScope;
  readonly 'deep_research.branch_selected': DeepResearchBranchScope;
  readonly 'deep_research.iteration_started': DeepResearchIterationScope;
  readonly 'deep_research.iteration_completed': DeepResearchIterationScope;
  readonly 'deep_research.source_captured': DeepResearchSourceScope;
  readonly 'deep_research.evidence_admission_decided': DeepResearchEvidenceScope;
  readonly 'deep_research.claim_asserted': DeepResearchClaimScope;
  readonly 'deep_research.claim_relation_recorded': DeepResearchClaimScope;
  readonly 'deep_research.claim_superseded': DeepResearchClaimScope;
  readonly 'deep_research.gap_detected': DeepResearchIterationScope;
  readonly 'deep_research.next_focus_selected': DeepResearchIterationScope;
  readonly 'deep_research.convergence_evaluated': DeepResearchIterationScope;
  readonly 'deep_research.convergence_blocked': DeepResearchIterationScope;
  readonly 'deep_research.synthesis_started': DeepResearchBaseScope;
  readonly 'deep_research.synthesis_committed': DeepResearchBaseScope;
  readonly 'deep_research.memory_save_requested': DeepResearchBaseScope;
  readonly 'deep_research.memory_save_completed': DeepResearchBaseScope;
  readonly 'deep_research.memory_save_failed': DeepResearchBaseScope;
  readonly 'deep_research.run_completed': DeepResearchBaseScope;
}

export interface DeepResearchLedgerPayload<
  TStem extends DeepResearchEventStem,
> extends JsonObject {
  readonly stem: TStem;
  readonly eventVersion: 1;
  readonly scope: DeepResearchScopeMap[TStem];
  readonly prevEventHash: Digest;
  readonly payloadDigest: Digest;
  readonly replay: DeepResearchReplayMetadata;
  readonly data: DeepResearchPayloadMap[TStem];
}

export type DeepResearchEventEnvelope<
  TStem extends DeepResearchEventStem = DeepResearchEventStem,
> = EventEnvelope & {
  readonly event_type: typeof DeepResearchWireEventTypes[TStem];
  readonly event_version: 1;
  readonly payload: DeepResearchLedgerPayload<TStem>;
};

export type DeepResearchLedgerEvent = {
  readonly [TStem in DeepResearchEventStem]: DeepResearchEventEnvelope<TStem>;
}[DeepResearchEventStem];

// ───────────────────────────────────────────────────────────────────
// 5. COMPATIBILITY TYPES
// ───────────────────────────────────────────────────────────────────

export type DeepResearchCompatibilityStatus =
  | 'blocked'
  | 'compatible'
  | 'exact'
  | 'migrate'
  | 'pin-old-runtime';

export interface DeepResearchCompatibilityDecision {
  readonly status: DeepResearchCompatibilityStatus;
  readonly reasonCode: string;
  readonly targetStem: DeepResearchEventStem | null;
  readonly sourceVersion: number | null;
  readonly targetVersion: 1;
}

export interface LegacyUpcastContext {
  readonly scope: DeepResearchBaseScope | DeepResearchIterationScope;
  readonly prevEventHash: Digest;
  readonly replay: DeepResearchReplayMetadata;
}

export interface LegacyUpcastCandidate {
  readonly status: 'migrated';
  readonly targetStem: DeepResearchEventStem;
  readonly eventVersion: 1;
  readonly originalRecordDigest: Digest;
  readonly upcasterFingerprint: Fingerprint;
  readonly warnings: readonly string[];
  readonly scope: DeepResearchBaseScope | DeepResearchIterationScope;
  readonly prevEventHash: Digest;
  readonly replay: DeepResearchReplayMetadata;
  readonly data: JsonObject;
}

export type LegacyUpcastResult =
  | LegacyUpcastCandidate
  | {
    readonly status: 'refused';
    readonly decision: DeepResearchCompatibilityDecision;
  };
