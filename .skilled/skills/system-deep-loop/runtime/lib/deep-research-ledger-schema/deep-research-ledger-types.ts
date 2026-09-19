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

// Run-now records are appended at the loop boundary, before any dissection of
// the run's research state, so they carry only the boundary bookkeeping a
// reader needs to correlate the sentinel with the iteration it dispatched.
export interface RunNowRequestedData extends JsonObject {
  readonly mode: string;
  readonly run: Uint32;
  readonly sessionId: string;
  readonly generation: Uint32;
  readonly sentinelPath: string;
}

export interface RunNowRejectedData extends RunNowRequestedData {
  readonly reason: string;
  readonly pauseSentinelPath: string;
}

export interface RunNowAcceptedData extends RunNowRequestedData {
  readonly dispatchEvent: string;
}

export type RunNowRestoredData = RunNowRequestedData;

// The synthesis report is the last write of a run, so its payload carries the
// reconciliation counts a reader needs to tell a complete report from one that
// only looked complete; nullable counts stay null when the source artifact was
// unreadable rather than collapsing to zero.
export interface SynthesisIncompleteData extends JsonObject {
  readonly mode: string;
  readonly severity: string;
  readonly totalIterations: Uint32;
  readonly answeredCount: Uint32;
  readonly totalQuestions: Uint32;
  readonly stopReason: string;
  readonly reason: string;
  readonly invariantFailures: string[];
  readonly missingArtifacts: JsonObject[];
  readonly registryFindingCount: Uint32 | null;
  readonly iterationFindingCount: Uint32;
  readonly countOnlyFindingCount: Uint32;
  readonly identifiableFindingCount: Uint32;
  readonly missingStructuredFindingCount: Uint32;
  readonly sourceFindingCount: Uint32 | null;
  readonly reconstructionGapCount: Uint32 | null;
  readonly stateParseFailureCount: Uint32;
}

export interface SynthesisCompleteData extends JsonObject {
  readonly totalIterations: Uint32;
  readonly answeredCount: Uint32;
  readonly totalQuestions: Uint32;
  readonly stopReason: string;
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

// The spec-protocol rows are written by the workflows as untyped state-log
// records, so each payload keeps the row's own field values verbatim: the
// upcaster lifts them unchanged and the projection writes the row back.
export interface SpecCheckResultData extends JsonObject {
  readonly folderState: string;
  readonly normalizedTopic: string;
  readonly specPath: string;
  readonly lockPath: string;
}

export interface SpecSeedCreatedData extends JsonObject {
  readonly folderState: string;
  readonly anchorsTouched: string[];
  readonly diffSummary: string;
  readonly seedMarkers: string[];
}

export interface SpecPreinitContextAddedData extends JsonObject {
  readonly folderState: string;
  readonly normalizedTopic: string;
  readonly specPath: string;
  readonly anchorsTouched: string[];
  readonly diffSummary: string;
}

export interface SpecPreinitContextDedupedData extends JsonObject {
  readonly folderState: string;
  readonly normalizedTopic: string;
  readonly specPath: string;
  readonly anchorsTouched: string[];
  readonly diffSummary: string;
}

export interface SpecMutationData extends JsonObject {
  readonly phase: string;
  readonly anchorsTouched: string[];
  readonly diffSummary: string;
  readonly generatedFence: string;
}

// The pre-init conflict row carries no fence or conflict kind; the
// post-synthesis row carries both, so they are null when the row omits them.
export interface SpecMutationConflictData extends JsonObject {
  readonly folderState: string;
  readonly reason: string;
  readonly specPath: string;
  readonly generatedFence: string | null;
  readonly conflictKind: string | null;
}

export interface SpecSynthesisDeferredData extends JsonObject {
  readonly reason: string;
  readonly generatedFence: string;
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
  'deep_research.run_now_requested',
  'deep_research.run_now_rejected',
  'deep_research.run_now_accepted',
  'deep_research.run_now_restored',
  'deep_research.synthesis_incomplete',
  'deep_research.synthesis_complete',
  'deep_research.spec_check_result',
  'deep_research.spec_seed_created',
  'deep_research.spec_preinit_context_added',
  'deep_research.spec_preinit_context_deduped',
  'deep_research.spec_mutation',
  'deep_research.spec_mutation_conflict',
  'deep_research.spec_synthesis_deferred',
] as const);

export type DeepResearchEventStem = typeof DeepResearchEventStems[number];

// A registration is only honest when every stem either has a mechanical
// producer or is explicitly reserved. `spoken` names the files that emit the
// stem; `reserved` records why nothing emits it yet and what would earn a
// producer. The stem-producer checker holds this table to the emitter surface
// on disk and fails when the two disagree.
export type DeepResearchStemProducerStatus =
  | { readonly status: 'spoken'; readonly producers: readonly string[] }
  | { readonly status: 'reserved'; readonly reason: string };

export const DEEP_RESEARCH_STEM_PRODUCERS = Object.freeze({
  'deep_research.run_initialized': { status: 'reserved', reason: 'No writer emits it today: runs open with the flat config row. The run-open step would speak it once initialization appends its charter and executor fingerprint.' },
  'deep_research.run_resumed': { status: 'reserved', reason: 'No writer emits it today: resume rebuilds the flat config and state in place. The resume step would speak it once a resumed run records its compatibility decision as an event.' },
  'deep_research.run_restarted': { status: 'reserved', reason: 'No writer emits it today: restart rebinds the flat config in place. The restart step would speak it once the archived lineage and restart reason are appended.' },
  'deep_research.question_registered': { status: 'reserved', reason: 'No writer emits it today: questions are flat rows in the state log. A question step would speak it once registration appends its dependency and source-class contract.' },
  'deep_research.branch_planned': { status: 'reserved', reason: 'No writer emits it today: branch plans live in strategy prose. A branch step would speak it once a planned branch and its budget are appended.' },
  'deep_research.branch_selected': { status: 'reserved', reason: 'No writer emits it today: selection is a strategy update. A branch step would speak it once the selected branch and its rationale are appended.' },
  'deep_research.iteration_started': { status: 'reserved', reason: 'No writer emits it today: iteration opening is a flat row. An iteration step would speak it once a pass opens with its focus ref.' },
  'deep_research.iteration_completed': { status: 'reserved', reason: 'No writer emits it today: completion is a flat row folded by the reducer. An iteration step would speak it once completion appends its ratio and ruled-out approaches.' },
  'deep_research.source_captured': { status: 'reserved', reason: 'No writer emits it today: captured sources live in the source log. A source step would speak it once capture appends its version and digests.' },
  'deep_research.evidence_admission_decided': { status: 'reserved', reason: 'No writer emits it today: admission is reducer-derived. An admission step would speak it once an admitted or rejected source is appended with its reasons.' },
  'deep_research.claim_asserted': { status: 'reserved', reason: 'No writer emits it today: claims live in the evidence registry. A claim step would speak it once assertion appends its scope and evidence refs.' },
  'deep_research.claim_relation_recorded': { status: 'reserved', reason: 'No writer emits it today: relations are reducer-derived. A claim step would speak it once a support or contradiction link is appended.' },
  'deep_research.claim_superseded': { status: 'reserved', reason: 'No writer emits it today: supersession is computed from claim versions. A claim step would speak it once a superseding version is appended.' },
  'deep_research.gap_detected': { status: 'reserved', reason: 'No writer emits it today: gaps live in strategy prose. A gap step would speak it once detection appends the missing coverage it found.' },
  'deep_research.next_focus_selected': { status: 'reserved', reason: 'No writer emits it today: next focus is computed into the strategy file. A focus step would speak it once selection appends its candidates and choice.' },
  'deep_research.convergence_evaluated': { status: 'reserved', reason: 'No writer emits it today: convergence is recomputed from flat rows. A convergence step would speak it once the decision is appended rather than inferred.' },
  'deep_research.convergence_blocked': { status: 'reserved', reason: 'No writer emits it today: blocked convergence is a flat event. A convergence step would speak it once blocker ids and the incomplete reason are appended.' },
  'deep_research.synthesis_started': { status: 'reserved', reason: 'No writer emits it today: synthesis is a workflow phase. The synthesis step would speak it once the report phase opens with its source range.' },
  'deep_research.synthesis_committed': { status: 'reserved', reason: 'No writer emits it today: the research report is written as a file. The synthesis step would speak it once the report digest is appended.' },
  'deep_research.memory_save_requested': { status: 'reserved', reason: 'No writer emits it today: continuity saves route through the save command. The save step would speak it once a request is appended for replay.' },
  'deep_research.memory_save_completed': { status: 'reserved', reason: 'No writer emits it today: the save command writes its own artifacts. The save step would speak it once completion records its persistence receipts.' },
  'deep_research.memory_save_failed': { status: 'reserved', reason: 'No writer emits it today: a failed save surfaces to the operator directly. The save step would speak it once failure records its retryable reason code.' },
  'deep_research.run_completed': { status: 'reserved', reason: 'No writer emits it today: closure is the reducer inference from flat rows. The finalization step would speak it once terminal status and counts are appended.' },
  'deep_research.run_now_requested': { status: 'spoken', producers: ['.skilled/commands/deep/assets/deep-research-auto.yaml'] },
  'deep_research.run_now_rejected': { status: 'spoken', producers: ['.skilled/commands/deep/assets/deep-research-auto.yaml'] },
  'deep_research.run_now_accepted': { status: 'spoken', producers: ['.skilled/commands/deep/assets/deep-research-auto.yaml'] },
  'deep_research.run_now_restored': { status: 'spoken', producers: ['.skilled/commands/deep/assets/deep-research-auto.yaml'] },
  'deep_research.synthesis_incomplete': { status: 'spoken', producers: ['.skilled/commands/deep/assets/deep-research-auto.yaml', '.skilled/commands/deep/assets/deep-research-confirm.yaml'] },
  'deep_research.synthesis_complete': { status: 'spoken', producers: ['.skilled/commands/deep/assets/deep-research-auto.yaml', '.skilled/commands/deep/assets/deep-research-confirm.yaml'] },
  'deep_research.spec_check_result': { status: 'reserved', reason: 'No workflow stages it: the research workflows write the legacy spec-protocol row, which the append gateway upcasts to this stem. A workflow step would speak it once it stages the stem itself.' },
  'deep_research.spec_seed_created': { status: 'reserved', reason: 'No workflow stages it: the research workflows write the legacy spec-protocol row, which the append gateway upcasts to this stem. A workflow step would speak it once it stages the stem itself.' },
  'deep_research.spec_preinit_context_added': { status: 'reserved', reason: 'No workflow stages it: the research workflows write the legacy spec-protocol row, which the append gateway upcasts to this stem. A workflow step would speak it once it stages the stem itself.' },
  'deep_research.spec_preinit_context_deduped': { status: 'reserved', reason: 'No workflow stages it: the research workflows write the legacy spec-protocol row, which the append gateway upcasts to this stem. A workflow step would speak it once it stages the stem itself.' },
  'deep_research.spec_mutation': { status: 'reserved', reason: 'No workflow stages it: the research workflows write the legacy spec-protocol row, which the append gateway upcasts to this stem. A workflow step would speak it once it stages the stem itself.' },
  'deep_research.spec_mutation_conflict': { status: 'reserved', reason: 'No workflow stages it: the research workflows write the legacy spec-protocol row, which the append gateway upcasts to this stem. A workflow step would speak it once it stages the stem itself.' },
  'deep_research.spec_synthesis_deferred': { status: 'reserved', reason: 'No workflow stages it: the research workflows write the legacy spec-protocol row, which the append gateway upcasts to this stem. A workflow step would speak it once it stages the stem itself.' },
} as const satisfies Readonly<Record<DeepResearchEventStem, DeepResearchStemProducerStatus>>);

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
  'deep_research.run_now_requested': 'deep-research.ledger.run-now-requested',
  'deep_research.run_now_rejected': 'deep-research.ledger.run-now-rejected',
  'deep_research.run_now_accepted': 'deep-research.ledger.run-now-accepted',
  'deep_research.run_now_restored': 'deep-research.ledger.run-now-restored',
  'deep_research.synthesis_incomplete': 'deep-research.ledger.synthesis-incomplete',
  'deep_research.synthesis_complete': 'deep-research.ledger.synthesis-complete',
  'deep_research.spec_check_result': 'deep-research.ledger.spec-check-result',
  'deep_research.spec_seed_created': 'deep-research.ledger.spec-seed-created',
  'deep_research.spec_preinit_context_added': 'deep-research.ledger.spec-preinit-context-added',
  'deep_research.spec_preinit_context_deduped': 'deep-research.ledger.spec-preinit-context-deduped',
  'deep_research.spec_mutation': 'deep-research.ledger.spec-mutation',
  'deep_research.spec_mutation_conflict': 'deep-research.ledger.spec-mutation-conflict',
  'deep_research.spec_synthesis_deferred': 'deep-research.ledger.spec-synthesis-deferred',
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
  readonly 'deep_research.run_now_requested': RunNowRequestedData;
  readonly 'deep_research.run_now_rejected': RunNowRejectedData;
  readonly 'deep_research.run_now_accepted': RunNowAcceptedData;
  readonly 'deep_research.run_now_restored': RunNowRestoredData;
  readonly 'deep_research.synthesis_incomplete': SynthesisIncompleteData;
  readonly 'deep_research.synthesis_complete': SynthesisCompleteData;
  readonly 'deep_research.spec_check_result': SpecCheckResultData;
  readonly 'deep_research.spec_seed_created': SpecSeedCreatedData;
  readonly 'deep_research.spec_preinit_context_added': SpecPreinitContextAddedData;
  readonly 'deep_research.spec_preinit_context_deduped': SpecPreinitContextDedupedData;
  readonly 'deep_research.spec_mutation': SpecMutationData;
  readonly 'deep_research.spec_mutation_conflict': SpecMutationConflictData;
  readonly 'deep_research.spec_synthesis_deferred': SpecSynthesisDeferredData;
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
  readonly 'deep_research.run_now_requested': DeepResearchBaseScope;
  readonly 'deep_research.run_now_rejected': DeepResearchBaseScope;
  readonly 'deep_research.run_now_accepted': DeepResearchBaseScope;
  readonly 'deep_research.run_now_restored': DeepResearchBaseScope;
  readonly 'deep_research.synthesis_incomplete': DeepResearchBaseScope;
  readonly 'deep_research.synthesis_complete': DeepResearchBaseScope;
  readonly 'deep_research.spec_check_result': DeepResearchBaseScope;
  readonly 'deep_research.spec_seed_created': DeepResearchBaseScope;
  readonly 'deep_research.spec_preinit_context_added': DeepResearchBaseScope;
  readonly 'deep_research.spec_preinit_context_deduped': DeepResearchBaseScope;
  readonly 'deep_research.spec_mutation': DeepResearchBaseScope;
  readonly 'deep_research.spec_mutation_conflict': DeepResearchBaseScope;
  readonly 'deep_research.spec_synthesis_deferred': DeepResearchBaseScope;
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
  readonly scope: DeepResearchScope;
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
  readonly scope: DeepResearchScope;
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
