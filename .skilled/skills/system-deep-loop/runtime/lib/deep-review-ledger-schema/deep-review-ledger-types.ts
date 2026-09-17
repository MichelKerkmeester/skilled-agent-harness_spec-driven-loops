// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Ledger Types
// ───────────────────────────────────────────────────────────────────

import type {
  EventEnvelope,
  JsonObject,
} from '../event-envelope/index.js';
import type { ReplayFingerprintDescriptor } from '../replay-fingerprint/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. IDENTITIES AND SHARED METADATA
// ───────────────────────────────────────────────────────────────────

export type ReviewRunId = string;
export type SessionId = string;
export type IterationId = string;
export type DimensionId = string;
export type CandidateId = string;
export type FindingId = string;
export type EvidenceId = string;
export type ProtocolId = string;
export type ReportRevisionId = string;
export type Digest = string;
export type Fingerprint = string;
export type Version = string;
export type Uint32 = number;

export interface DeepReviewReplayMetadata extends JsonObject {
  readonly fingerprint_version: ReplayFingerprintDescriptor['fingerprint_version'];
  readonly final_digest: ReplayFingerprintDescriptor['final_digest'];
  readonly replay_input_digests: Record<string, string>;
}

export interface DeepReviewBaseScope extends JsonObject {
  readonly runId: ReviewRunId;
  readonly sessionId: SessionId;
}

export interface DeepReviewGenerationScope extends DeepReviewBaseScope {
  readonly generation: Uint32;
}

export interface DeepReviewIterationScope extends DeepReviewGenerationScope {
  readonly iterationId: IterationId;
}

export interface DeepReviewDimensionScope extends DeepReviewIterationScope {
  readonly dimensionId: DimensionId;
}

export interface DeepReviewCandidateScope extends DeepReviewDimensionScope {
  readonly candidateId: CandidateId;
}

export interface DeepReviewFindingScope extends DeepReviewDimensionScope {
  readonly findingId: FindingId;
}

export interface DeepReviewAdjudicationScope extends DeepReviewCandidateScope {
  readonly findingId: FindingId;
}

export interface DeepReviewEvidenceScope extends DeepReviewCandidateScope {
  readonly evidenceId: EvidenceId;
}

export interface DeepReviewProtocolScope extends DeepReviewBaseScope {
  readonly protocolId: ProtocolId;
}

export interface DeepReviewReportScope extends DeepReviewBaseScope {
  readonly reportRevisionId: ReportRevisionId;
}

export type DeepReviewScope =
  | DeepReviewBaseScope
  | DeepReviewGenerationScope
  | DeepReviewIterationScope
  | DeepReviewDimensionScope
  | DeepReviewCandidateScope
  | DeepReviewFindingScope
  | DeepReviewAdjudicationScope
  | DeepReviewEvidenceScope
  | DeepReviewProtocolScope
  | DeepReviewReportScope;

// ───────────────────────────────────────────────────────────────────
// 2. PAYLOAD VALUE OBJECTS
// ───────────────────────────────────────────────────────────────────

export interface TargetReference extends JsonObject {
  readonly targetId: string;
  readonly targetType: 'artifact' | 'directory' | 'file' | 'repository' | 'symbol';
  readonly artifactRef: string;
  readonly sourceDigest: Digest;
  readonly contentDigest: Digest;
}

export interface EvidenceLocator extends JsonObject {
  readonly scheme: 'artifact' | 'file' | 'other';
  readonly artifactRef: string;
  readonly locatorDigest: Digest;
  readonly selector: string;
  readonly startLine: Uint32 | null;
  readonly endLine: Uint32 | null;
  readonly revision: string | null;
}

export interface SemanticFingerprintParts extends JsonObject {
  readonly algorithmVersion: Version;
  readonly semanticAnchorDigest: Digest;
  readonly normalizedContextDigest: Digest;
  readonly programSliceDigest: Digest;
  readonly renameMapVersion: Version;
  readonly baselineState: 'absent' | 'present' | 'unknown';
}

export interface SourceEventRange extends JsonObject {
  readonly firstEventId: string;
  readonly lastEventId: string;
}

export interface FindingCounts extends JsonObject {
  readonly candidates: Uint32;
  readonly adjudicated: Uint32;
  readonly p0: Uint32;
  readonly p1: Uint32;
  readonly p2: Uint32;
}

export interface RunCompletionCounts extends JsonObject {
  readonly dimensions: Uint32;
  readonly iterations: Uint32;
  readonly candidates: Uint32;
  readonly findings: Uint32;
  readonly evidence: Uint32;
}

export interface ConvergenceSignals extends JsonObject {
  readonly noveltyRatio: number;
  readonly coverageRatio: number;
  readonly findingStabilityRatio: number;
  readonly evidenceDensityRatio: number;
  readonly hotspotSaturationRatio: number;
  readonly observationDigest: Digest;
}

export interface GateResult extends JsonObject {
  readonly gateId: string;
  readonly status: 'fail' | 'pass' | 'unknown';
  readonly reasonCode: string;
  readonly evidenceDigest: Digest;
}

export interface ReportSectionManifest extends JsonObject {
  readonly sectionIds: string[];
  readonly manifestDigest: Digest;
}

// ───────────────────────────────────────────────────────────────────
// 3. EVENT PAYLOAD DATA
// ───────────────────────────────────────────────────────────────────

export interface RunInitializedData extends JsonObject {
  readonly target: TargetReference;
  readonly lineageMode: 'fresh' | 'restart' | 'resume';
  readonly maxIterations: Uint32;
  readonly convergencePolicyVersion: Version;
  readonly reviewModeContractDigest: Digest;
  readonly initialReleaseReadinessState: 'blocked' | 'not-assessed' | 'ready';
}

export interface RunResumedData extends JsonObject {
  readonly priorTailDigest: Digest;
  readonly sourceSessionId: SessionId;
  readonly resumeReason: string;
  readonly continuedFromRunId: ReviewRunId;
  readonly compatibilityDecision: DeepReviewCompatibilityStatus;
  readonly recoveryReceiptRef: string;
}

export interface RunRestartedData extends JsonObject {
  readonly priorTailDigest: Digest;
  readonly archivedLineageId: string;
  readonly restartReason: string;
  readonly continuedFromRunId: ReviewRunId;
  readonly compatibilityDecision: DeepReviewCompatibilityStatus;
  readonly recoveryReceiptRef: string;
}

export interface ScopeResolvedData extends JsonObject {
  readonly targetSetDigest: Digest;
  readonly scopeClass: 'bounded' | 'repository' | 'targeted';
  readonly selectedTargets: TargetReference[];
  readonly omittedHighRiskTargetRefs: string[];
  readonly discoveryMethodIds: string[];
  readonly scopeEvidenceRefs: string[];
}

export interface DimensionOrderedData extends JsonObject {
  readonly orderedDimensionIds: string[];
  readonly riskRationale: string;
  readonly scopeEvidenceRefs: string[];
  readonly orderingPolicyVersion: Version;
}

export interface ProtocolPlanRecordedData extends JsonObject {
  readonly coreProtocolIds: string[];
  readonly overlayProtocolIds: string[];
  readonly applicability: 'applicable' | 'conditional' | 'not-applicable';
  readonly gateClass: 'blocking' | 'informational' | 'required';
  readonly contractVersion: Version;
  readonly plannedEvidenceSourceRefs: string[];
  readonly protocolPlanDigest: Digest;
}

export interface DimensionPassStartedData extends JsonObject {
  readonly passNumber: Uint32;
  readonly targetRefs: string[];
  readonly filesReviewed: string[];
  readonly searchCoverageDigest: Digest;
  readonly passStatus: 'started';
  readonly nextFocusRef: string;
}

export interface DimensionPassCompletedData extends JsonObject {
  readonly passNumber: Uint32;
  readonly targetRefs: string[];
  readonly filesReviewed: string[];
  readonly searchCoverageDigest: Digest;
  readonly passStatus: 'blocked' | 'complete' | 'incomplete';
  readonly rawFindingCounts: FindingCounts;
  readonly nextFocusRef: string;
}

export interface FindingCandidateEmittedData extends JsonObject {
  readonly targetRefs: string[];
  readonly evidenceRefs: string[];
  readonly claimTextDigest: Digest;
  readonly findingClass: string;
  readonly impact: number;
  readonly rawConfidence: number;
  readonly rawCandidateScore: number;
  readonly actionability: number;
  readonly reachability: number;
  readonly exploitability: number;
  readonly evidenceType: 'analyzer' | 'inspection' | 'runtime' | 'test';
  readonly evidenceScope: 'direct' | 'indirect' | 'partial';
  readonly rawObservationDigest: Digest;
  readonly semanticFingerprint: SemanticFingerprintParts;
  readonly sourcePassEventId: string;
}

export interface EvidenceObservedData extends JsonObject {
  readonly locator: EvidenceLocator;
  readonly observationKind: 'analyzer-output' | 'inspection' | 'runtime-witness' | 'test-result';
  readonly rawResultDigest: Digest;
  readonly sourceDigest: Digest;
  readonly contentDigest: Digest;
  readonly toolFingerprint: Fingerprint;
  readonly analyzerFingerprint: Fingerprint;
  readonly independentEvidenceClass: string;
  readonly causalProximityStatus: 'direct' | 'indirect' | 'unknown';
  readonly stabilityStatus: 'stable' | 'unstable' | 'unknown';
  readonly relevanceStatus: 'irrelevant' | 'relevant' | 'unknown';
  readonly supersedesEvidenceEventId: null;
}

export interface EvidenceReconciledData extends JsonObject {
  readonly locator: EvidenceLocator;
  readonly observationKind: 'analyzer-output' | 'inspection' | 'runtime-witness' | 'test-result';
  readonly rawResultDigest: Digest;
  readonly sourceDigest: Digest;
  readonly contentDigest: Digest;
  readonly toolFingerprint: Fingerprint;
  readonly analyzerFingerprint: Fingerprint;
  readonly independentEvidenceClass: string;
  readonly causalProximityStatus: 'direct' | 'indirect' | 'unknown';
  readonly stabilityStatus: 'stable' | 'unstable' | 'unknown';
  readonly relevanceStatus: 'irrelevant' | 'relevant' | 'unknown';
  readonly supersedesEvidenceEventId: string;
  readonly reconciliationOutcome: 'confirmed' | 'contradicted' | 'degraded' | 'superseded';
  readonly evidenceSetDigest: Digest;
}

export interface ClaimAdjudicationRecordedData extends JsonObject {
  readonly claimDigest: Digest;
  readonly evidenceRefs: string[];
  readonly counterevidenceSoughtRefs: string[];
  readonly alternativeExplanationDigest: Digest;
  readonly finalSeverity: 'none' | 'P0' | 'P1' | 'P2';
  readonly impact: number;
  readonly confidence: number;
  readonly downgradeTrigger: 'confidence-floor' | 'counterevidence' | 'none' | 'scope-limited';
  readonly transition: 'candidate-to-finding' | 'candidate-to-rejected' | 'finding-reaffirmed';
  readonly validatorFingerprint: Fingerprint;
  readonly adjudicationOutcome: 'accepted' | 'deferred' | 'disproved' | 'rejected';
  readonly predecessorAdjudicationEventId: string | null;
}

export interface FindingLineageRecordedData extends JsonObject {
  readonly priorFingerprint: SemanticFingerprintParts;
  readonly currentFingerprint: SemanticFingerprintParts;
  readonly lineageRelation:
    | 'absent'
    | 'disproved'
    | 'fixed'
    | 'introduced'
    | 'preexisting'
    | 'unchanged'
    | 'updated';
  readonly baselineStatus: 'absent' | 'present' | 'unknown';
  readonly evidenceSetDigest: Digest;
  readonly predecessorEventRef: string;
}

export interface FindingStateChangedData extends JsonObject {
  readonly priorFingerprint: SemanticFingerprintParts;
  readonly currentFingerprint: SemanticFingerprintParts;
  readonly priorState: 'accepted' | 'adjudicated' | 'candidate' | 'dismissed' | 'fixed';
  readonly currentState: 'accepted' | 'adjudicated' | 'candidate' | 'dismissed' | 'fixed';
  readonly priorSeverity: 'none' | 'P0' | 'P1' | 'P2';
  readonly currentSeverity: 'none' | 'P0' | 'P1' | 'P2';
  readonly adjudicationEventId: string;
  readonly adjudicationPayloadDigest: Digest;
  readonly changeReason: string;
  readonly evidenceSetDigest: Digest;
  readonly predecessorEventRef: string;
}

export interface ReviewDepthRecordedData extends JsonObject {
  readonly reviewDepthSchemaVersion: Version;
  readonly applicability: 'applicable' | 'conditional' | 'not-applicable';
  readonly targetSelectionDigest: Digest;
  readonly requiredBugClasses: string[];
  readonly coveredBugClasses: string[];
  readonly ruledOutBugClasses: string[];
  readonly deferredBugClasses: string[];
  readonly blockedBugClasses: string[];
  readonly searchLedgerRowDigests: string[];
  readonly graphStatus: 'available' | 'degraded' | 'unavailable';
  readonly semanticSearchStatus: 'available' | 'degraded' | 'unavailable';
}

export interface ConvergenceEvaluatedData extends JsonObject {
  readonly rawSignals: ConvergenceSignals;
  readonly weightedSignals: ConvergenceSignals;
  readonly dimensionCoverageDigest: Digest;
  readonly protocolCoverageDigest: Digest;
  readonly findingStability: 'stable' | 'unstable' | 'unknown';
  readonly p0p1ResolutionState: 'blocked' | 'resolved' | 'unknown';
  readonly evidenceDensity: number;
  readonly hotspotSaturation: number;
  readonly decision: 'blocked' | 'continue' | 'converged' | 'incomplete' | 'recover';
  readonly policyFingerprint: Fingerprint;
  readonly blockerIds: string[];
  readonly stopCandidate: boolean;
}

export interface GraphConvergenceEvaluatedData extends ConvergenceEvaluatedData {
  readonly graphDecision: 'blocked' | 'continue' | 'converged' | 'unavailable';
  readonly graphDigest: Digest;
}

export interface BlockedStopRecordedData extends JsonObject {
  readonly blockedGateIds: string[];
  readonly gateResults: GateResult[];
  readonly activeFindingCounts: FindingCounts;
  readonly recoveryStrategy: string;
  readonly targetDimensionId: DimensionId;
  readonly originatingConvergenceEventId: string;
  readonly appendPosition: Uint32;
}

export interface PauseRecordedData extends JsonObject {
  readonly normalizedStopReason: string;
  readonly sentinelCause: string;
  readonly fromIterationId: IterationId;
  readonly strategy: string;
  readonly targetDimensionId: DimensionId | null;
  readonly outcome: 'paused';
  readonly lineageRef: string;
  readonly priorTailDigest: Digest;
}

export interface RecoveryStartedData extends JsonObject {
  readonly normalizedStopReason: string;
  readonly recoveryCause: string;
  readonly fromIterationId: IterationId;
  readonly strategy: string;
  readonly targetDimensionId: DimensionId;
  readonly outcome: 'recovery-started';
  readonly lineageRef: string;
  readonly priorTailDigest: Digest;
  readonly originatingPauseEventId: string;
}

export interface SynthesisStartedData extends JsonObject {
  readonly finalizedEventRange: SourceEventRange;
  readonly findingRegistryInputDigest: Digest;
  readonly deduplicationPolicyDigest: Digest;
  readonly verdictInputDigests: string[];
  readonly unresolvedFindingIds: string[];
  readonly deferredFindingIds: string[];
}

export interface ReviewReportCommittedData extends SynthesisStartedData {
  readonly reportDigest: Digest;
  readonly sectionManifest: ReportSectionManifest;
  readonly reportReceiptRef: string;
}

export interface ContinuitySaveRequestedData extends JsonObject {
  readonly targetPacket: string;
  readonly continuityPayloadDigest: Digest;
  readonly sourceEventRange: SourceEventRange;
  readonly route: string;
  readonly mergeMode: string;
}

export interface ContinuitySaveCompletedData extends ContinuitySaveRequestedData {
  readonly persistenceReceiptRefs: string[];
  readonly continuityFingerprint: Fingerprint;
}

export interface ContinuitySaveFailedData extends ContinuitySaveRequestedData {
  readonly retryable: boolean;
  readonly failureReasonCode: string;
}

export interface RunCompletedData extends JsonObject {
  readonly terminalStatus: 'blocked' | 'completed' | 'incomplete';
  readonly convergenceEventId: string;
  readonly synthesisEventId: string;
  readonly reportEventId: string;
  readonly continuityEventId: string;
  readonly finalLedgerTailHash: Digest;
  readonly counts: RunCompletionCounts;
  readonly verdict: 'blocked' | 'fail' | 'incomplete' | 'pass';
  readonly completionReason: string | null;
  readonly incompleteReason: string | null;
}

// ───────────────────────────────────────────────────────────────────
// 4. EVENT UNION
// ───────────────────────────────────────────────────────────────────

// Run-level bookkeeping rows: the migration marker, the recovery baseline, the
// synthesis reconciliation and the claim-adjudication gate all describe the run
// itself rather than one dimension pass, so they carry run-level counts and the
// artifact identities a reader has to re-check after a projection refresh.
export interface MigrationRecordedData extends JsonObject {
  readonly mode: string;
  readonly legacyArtifacts: string[];
  readonly canonicalArtifacts: string[];
}

export interface RecoveryBaselineRecordedData extends JsonObject {
  readonly mode: string;
  readonly iteration: Uint32;
  readonly recoveryBaselineCommit: string;
  readonly worktree: string;
}

export interface SynthesisIncompleteData extends JsonObject {
  readonly mode: string;
  readonly severity: string;
  readonly totalIterations: Uint32;
  readonly activeP0: Uint32;
  readonly activeP1: Uint32;
  readonly activeP2: Uint32;
  readonly dimensionCoverage: number;
  readonly verdict: string;
  readonly releaseReadinessState: string;
  readonly stopReason: string;
  readonly reason: string;
  readonly invariantFailures: string[];
  readonly missingArtifacts: JsonObject[];
  readonly registryFindingCount: Uint32 | null;
  readonly iterationFindingCount: Uint32;
  readonly identifiableFindingCount: Uint32;
  readonly missingStructuredFindingCount: Uint32;
  readonly stateParseFailureCount: Uint32;
}

export interface SynthesisCompleteData extends JsonObject {
  readonly mode: string;
  readonly totalIterations: Uint32;
  readonly activeP0: Uint32;
  readonly activeP1: Uint32;
  readonly activeP2: Uint32;
  readonly dimensionCoverage: number;
  readonly verdict: string;
  readonly releaseReadinessState: string;
  readonly stopReason: string;
}

// The convergence gate reads this row's `passed` flag, so it stays a separate
// lightweight stem from the heavier per-finding adjudication record. The name
// is canonical in its own right, not a legacy alias: the two stems carry
// closed, disjoint payloads (gate summary versus typed per-finding record), so
// a producer that holds only gate counts writes this stem and must not be
// read as a shortened spelling of the typed one.
export interface ClaimAdjudicationData extends JsonObject {
  readonly mode: string;
  readonly run: Uint32;
  readonly passed: boolean;
  readonly activeP0P1: Uint32;
  readonly missingPackets: string[];
  readonly reason: string | null;
  readonly sessionId: string;
  readonly generation: Uint32;
}

// A review lane that produced no iteration file still owes the reducer an
// iteration row, so this payload carries `type` explicitly: the projected row
// has to stay `type: "iteration"` or the iteration vanishes from every count.
export interface IterationErrorRecordedData extends JsonObject {
  readonly type: 'iteration';
  readonly iteration: Uint32;
  readonly run: Uint32;
  readonly mode: string;
  readonly status: 'error';
  readonly focus: string;
  readonly dimensions: string[];
  readonly filesReviewed: string[];
  readonly findingsCount: Uint32;
  readonly findingsSummary: JsonObject;
  readonly findingsNew: JsonObject;
  readonly findingDetails: JsonObject[];
  readonly traceabilityChecks: JsonObject;
  readonly newFindingsRatio: number;
  readonly durationMs: Uint32;
  readonly sessionId: string;
  readonly generation: Uint32;
  readonly lineageMode: string;
}

export const DeepReviewEventStems = Object.freeze([
  'deep_review.run_initialized',
  'deep_review.run_resumed',
  'deep_review.run_restarted',
  'deep_review.scope_resolved',
  'deep_review.dimension_ordered',
  'deep_review.protocol_plan_recorded',
  'deep_review.dimension_pass_started',
  'deep_review.dimension_pass_completed',
  'deep_review.finding_candidate_emitted',
  'deep_review.evidence_observed',
  'deep_review.evidence_reconciled',
  'deep_review.claim_adjudication_recorded',
  'deep_review.finding_lineage_recorded',
  'deep_review.finding_state_changed',
  'deep_review.review_depth_recorded',
  'deep_review.convergence_evaluated',
  'deep_review.graph_convergence_evaluated',
  'deep_review.blocked_stop_recorded',
  'deep_review.pause_recorded',
  'deep_review.recovery_started',
  'deep_review.synthesis_started',
  'deep_review.review_report_committed',
  'deep_review.continuity_save_requested',
  'deep_review.continuity_save_completed',
  'deep_review.continuity_save_failed',
  'deep_review.run_completed',
  'deep_review.migration',
  'deep_review.recovery_baseline',
  'deep_review.synthesis_incomplete',
  'deep_review.synthesis_complete',
  'deep_review.claim_adjudication',
  'deep_review.iteration_error',
] as const);

export type DeepReviewEventStem = typeof DeepReviewEventStems[number];

// A registration is only honest when every stem either has a mechanical
// producer or is explicitly reserved. `spoken` names the files that emit the
// stem; `reserved` records why nothing emits it yet and what would earn a
// producer. The stem-producer checker holds this table to the emitter surface
// on disk and fails when the two disagree.
export type DeepReviewStemProducerStatus =
  | { readonly status: 'spoken'; readonly producers: readonly string[] }
  | { readonly status: 'reserved'; readonly reason: string };

export const DEEP_REVIEW_STEM_PRODUCERS = Object.freeze({
  'deep_review.run_initialized': { status: 'reserved', reason: 'No writer emits it today: runs open with the flat config row. The run-open step would speak it once initialization records target and policy through the gateway.' },
  'deep_review.run_resumed': { status: 'reserved', reason: 'No writer emits it today: resume rebuilds the flat config and state in place. The resume step would speak it once a resumed run records its compatibility decision as an event.' },
  'deep_review.run_restarted': { status: 'reserved', reason: 'No writer emits it today: restart rebinds the flat config in place. The restart step would speak it once the archived lineage and restart reason are appended.' },
  'deep_review.scope_resolved': { status: 'reserved', reason: 'No writer emits it today: scope lives in workflow step text. A scope step would speak it once selected and omitted targets are appended with their digests.' },
  'deep_review.dimension_ordered': { status: 'reserved', reason: 'No writer emits it today: dimension order is computed in the workflow. An ordering step would speak it once the order and its policy version are appended.' },
  'deep_review.protocol_plan_recorded': { status: 'reserved', reason: 'No writer emits it today: the protocol plan is an operator-facing asset. A plan step would speak it once protocol selection and its contract digest are appended.' },
  'deep_review.dimension_pass_started': { status: 'reserved', reason: 'No writer emits it today: a pass opens implicitly in the iteration record. A pass-lifecycle step would speak it once each pass opens its own event.' },
  'deep_review.dimension_pass_completed': { status: 'reserved', reason: 'No writer emits it today: pass completion folds from the iteration row. A pass-lifecycle step would speak it once a pass closes with coverage and finding counts.' },
  'deep_review.finding_candidate_emitted': { status: 'reserved', reason: 'No writer emits it today: candidates live in iteration prose and delta rows. The adjudication step would speak it once candidates enter the ledger as typed events.' },
  'deep_review.evidence_observed': { status: 'reserved', reason: 'No writer emits it today: evidence stays in iteration files. An evidence step would speak it once captured evidence is appended for reconciliation.' },
  'deep_review.evidence_reconciled': { status: 'reserved', reason: 'No writer emits it today: reconciliation is reducer-derived. An evidence step would speak it once an evidence set outcome is appended under the gateway.' },
  'deep_review.claim_adjudication_recorded': { status: 'reserved', reason: 'No writer emits it today: the workflow writes the flat gate summary instead. A typed-adjudication step would speak it once per-finding records are appended for the projection arms.' },
  'deep_review.finding_lineage_recorded': { status: 'reserved', reason: 'No writer emits it today: lineage is computed in the registry. A lineage step would speak it once registry transitions are appended as fingerprint pairs.' },
  'deep_review.finding_state_changed': { status: 'reserved', reason: 'No writer emits it today: state changes are reducer-derived. A state step would speak it once registry transitions are appended under the gateway.' },
  'deep_review.review_depth_recorded': { status: 'reserved', reason: 'No writer emits it today: depth accounting is derived from the report. A depth step would speak it once coverage and ruled-out classes are appended as proof.' },
  'deep_review.convergence_evaluated': { status: 'reserved', reason: 'No writer emits it today: convergence is recomputed by the reducer from flat rows. A convergence step would speak it once the decision is appended rather than inferred.' },
  'deep_review.graph_convergence_evaluated': { status: 'reserved', reason: 'No writer emits it today: graph convergence folds from flat graph events. A graph step would speak it once the graph decision and digest are appended.' },
  'deep_review.blocked_stop_recorded': { status: 'reserved', reason: 'No writer emits it today: blocked stops are flat events the reducer reads. A stop step would speak it once the blocked gates are appended through the gateway.' },
  'deep_review.pause_recorded': { status: 'reserved', reason: 'No writer emits it today: a pause is a sentinel file. The pause step would speak it once the stop reason and lineage ref are appended as an event.' },
  'deep_review.recovery_started': { status: 'reserved', reason: 'No writer emits it today: recovery runs through the detached-dispatch branch. A recovery step would speak it once a resumed-from-stop run appends its originating pause.' },
  'deep_review.synthesis_started': { status: 'reserved', reason: 'No writer emits it today: synthesis is a workflow phase. The synthesis step would speak it once the report phase opens with its finalized event range.' },
  'deep_review.review_report_committed': { status: 'reserved', reason: 'No writer emits it today: reports are written as files. The synthesis step would speak it once the report digest and section manifest are appended.' },
  'deep_review.continuity_save_requested': { status: 'reserved', reason: 'No writer emits it today: continuity saves route through the save command. The save step would speak it once a request is appended for replay.' },
  'deep_review.continuity_save_completed': { status: 'reserved', reason: 'No writer emits it today: the save command writes its own artifacts. The save step would speak it once completion records its persistence receipts.' },
  'deep_review.continuity_save_failed': { status: 'reserved', reason: 'No writer emits it today: a failed save surfaces to the operator directly. The save step would speak it once failure records its retryable reason code.' },
  'deep_review.run_completed': { status: 'reserved', reason: 'No writer emits it today: closure is the reducer inference from flat rows. The finalization step would speak it once terminal status and counts are appended.' },
  'deep_review.migration': { status: 'spoken', producers: ['.skilled/commands/deep/assets/deep-review-auto.yaml', '.skilled/commands/deep/assets/deep-review-confirm.yaml'] },
  'deep_review.recovery_baseline': { status: 'spoken', producers: ['.skilled/commands/deep/assets/deep-review-auto.yaml'] },
  'deep_review.synthesis_incomplete': { status: 'spoken', producers: ['.skilled/commands/deep/assets/deep-review-auto.yaml', '.skilled/commands/deep/assets/deep-review-confirm.yaml'] },
  'deep_review.synthesis_complete': { status: 'spoken', producers: ['.skilled/commands/deep/assets/deep-review-auto.yaml', '.skilled/commands/deep/assets/deep-review-confirm.yaml'] },
  'deep_review.claim_adjudication': { status: 'spoken', producers: ['.skilled/commands/deep/assets/deep-review-auto.yaml', '.skilled/commands/deep/assets/deep-review-confirm.yaml'] },
  'deep_review.iteration_error': { status: 'spoken', producers: ['.skilled/commands/deep/assets/deep-review-auto.yaml', '.skilled/commands/deep/assets/deep-review-confirm.yaml'] },
} as const satisfies Readonly<Record<DeepReviewEventStem, DeepReviewStemProducerStatus>>);

export const DeepReviewWireEventTypes = Object.freeze({
  'deep_review.run_initialized': 'deep-review.ledger.run-initialized',
  'deep_review.run_resumed': 'deep-review.ledger.run-resumed',
  'deep_review.run_restarted': 'deep-review.ledger.run-restarted',
  'deep_review.scope_resolved': 'deep-review.ledger.scope-resolved',
  'deep_review.dimension_ordered': 'deep-review.ledger.dimension-ordered',
  'deep_review.protocol_plan_recorded': 'deep-review.ledger.protocol-plan-recorded',
  'deep_review.dimension_pass_started': 'deep-review.ledger.dimension-pass-started',
  'deep_review.dimension_pass_completed': 'deep-review.ledger.dimension-pass-completed',
  'deep_review.finding_candidate_emitted': 'deep-review.ledger.finding-candidate-emitted',
  'deep_review.evidence_observed': 'deep-review.ledger.evidence-observed',
  'deep_review.evidence_reconciled': 'deep-review.ledger.evidence-reconciled',
  'deep_review.claim_adjudication_recorded': 'deep-review.ledger.claim-adjudication-recorded',
  'deep_review.finding_lineage_recorded': 'deep-review.ledger.finding-lineage-recorded',
  'deep_review.finding_state_changed': 'deep-review.ledger.finding-state-changed',
  'deep_review.review_depth_recorded': 'deep-review.ledger.review-depth-recorded',
  'deep_review.convergence_evaluated': 'deep-review.ledger.convergence-evaluated',
  'deep_review.graph_convergence_evaluated': 'deep-review.ledger.graph-convergence-evaluated',
  'deep_review.blocked_stop_recorded': 'deep-review.ledger.blocked-stop-recorded',
  'deep_review.pause_recorded': 'deep-review.ledger.pause-recorded',
  'deep_review.recovery_started': 'deep-review.ledger.recovery-started',
  'deep_review.synthesis_started': 'deep-review.ledger.synthesis-started',
  'deep_review.review_report_committed': 'deep-review.ledger.review-report-committed',
  'deep_review.continuity_save_requested': 'deep-review.ledger.continuity-save-requested',
  'deep_review.continuity_save_completed': 'deep-review.ledger.continuity-save-completed',
  'deep_review.continuity_save_failed': 'deep-review.ledger.continuity-save-failed',
  'deep_review.run_completed': 'deep-review.ledger.run-completed',
  'deep_review.migration': 'deep-review.ledger.migration',
  'deep_review.recovery_baseline': 'deep-review.ledger.recovery-baseline',
  'deep_review.synthesis_incomplete': 'deep-review.ledger.synthesis-incomplete',
  'deep_review.synthesis_complete': 'deep-review.ledger.synthesis-complete',
  'deep_review.claim_adjudication': 'deep-review.ledger.claim-adjudication',
  'deep_review.iteration_error': 'deep-review.ledger.iteration-error',
} as const satisfies Readonly<Record<DeepReviewEventStem, string>>);

export type DeepReviewWireEventType =
  typeof DeepReviewWireEventTypes[DeepReviewEventStem];

export interface DeepReviewPayloadMap {
  readonly 'deep_review.run_initialized': RunInitializedData;
  readonly 'deep_review.run_resumed': RunResumedData;
  readonly 'deep_review.run_restarted': RunRestartedData;
  readonly 'deep_review.scope_resolved': ScopeResolvedData;
  readonly 'deep_review.dimension_ordered': DimensionOrderedData;
  readonly 'deep_review.protocol_plan_recorded': ProtocolPlanRecordedData;
  readonly 'deep_review.dimension_pass_started': DimensionPassStartedData;
  readonly 'deep_review.dimension_pass_completed': DimensionPassCompletedData;
  readonly 'deep_review.finding_candidate_emitted': FindingCandidateEmittedData;
  readonly 'deep_review.evidence_observed': EvidenceObservedData;
  readonly 'deep_review.evidence_reconciled': EvidenceReconciledData;
  readonly 'deep_review.claim_adjudication_recorded': ClaimAdjudicationRecordedData;
  readonly 'deep_review.finding_lineage_recorded': FindingLineageRecordedData;
  readonly 'deep_review.finding_state_changed': FindingStateChangedData;
  readonly 'deep_review.review_depth_recorded': ReviewDepthRecordedData;
  readonly 'deep_review.convergence_evaluated': ConvergenceEvaluatedData;
  readonly 'deep_review.graph_convergence_evaluated': GraphConvergenceEvaluatedData;
  readonly 'deep_review.blocked_stop_recorded': BlockedStopRecordedData;
  readonly 'deep_review.pause_recorded': PauseRecordedData;
  readonly 'deep_review.recovery_started': RecoveryStartedData;
  readonly 'deep_review.synthesis_started': SynthesisStartedData;
  readonly 'deep_review.review_report_committed': ReviewReportCommittedData;
  readonly 'deep_review.continuity_save_requested': ContinuitySaveRequestedData;
  readonly 'deep_review.continuity_save_completed': ContinuitySaveCompletedData;
  readonly 'deep_review.continuity_save_failed': ContinuitySaveFailedData;
  readonly 'deep_review.run_completed': RunCompletedData;
  readonly 'deep_review.migration': MigrationRecordedData;
  readonly 'deep_review.recovery_baseline': RecoveryBaselineRecordedData;
  readonly 'deep_review.synthesis_incomplete': SynthesisIncompleteData;
  readonly 'deep_review.synthesis_complete': SynthesisCompleteData;
  readonly 'deep_review.claim_adjudication': ClaimAdjudicationData;
  readonly 'deep_review.iteration_error': IterationErrorRecordedData;
}

export interface DeepReviewScopeMap {
  readonly 'deep_review.run_initialized': DeepReviewGenerationScope;
  readonly 'deep_review.run_resumed': DeepReviewGenerationScope;
  readonly 'deep_review.run_restarted': DeepReviewGenerationScope;
  readonly 'deep_review.scope_resolved': DeepReviewBaseScope;
  readonly 'deep_review.dimension_ordered': DeepReviewBaseScope;
  readonly 'deep_review.protocol_plan_recorded': DeepReviewProtocolScope;
  readonly 'deep_review.dimension_pass_started': DeepReviewDimensionScope;
  readonly 'deep_review.dimension_pass_completed': DeepReviewDimensionScope;
  readonly 'deep_review.finding_candidate_emitted': DeepReviewCandidateScope;
  readonly 'deep_review.evidence_observed': DeepReviewEvidenceScope;
  readonly 'deep_review.evidence_reconciled': DeepReviewEvidenceScope;
  readonly 'deep_review.claim_adjudication_recorded': DeepReviewAdjudicationScope;
  readonly 'deep_review.finding_lineage_recorded': DeepReviewFindingScope;
  readonly 'deep_review.finding_state_changed': DeepReviewFindingScope;
  readonly 'deep_review.review_depth_recorded': DeepReviewIterationScope;
  readonly 'deep_review.convergence_evaluated': DeepReviewIterationScope;
  readonly 'deep_review.graph_convergence_evaluated': DeepReviewIterationScope;
  readonly 'deep_review.blocked_stop_recorded': DeepReviewIterationScope;
  readonly 'deep_review.pause_recorded': DeepReviewIterationScope;
  readonly 'deep_review.recovery_started': DeepReviewDimensionScope;
  readonly 'deep_review.synthesis_started': DeepReviewReportScope;
  readonly 'deep_review.review_report_committed': DeepReviewReportScope;
  readonly 'deep_review.continuity_save_requested': DeepReviewBaseScope;
  readonly 'deep_review.continuity_save_completed': DeepReviewBaseScope;
  readonly 'deep_review.continuity_save_failed': DeepReviewBaseScope;
  readonly 'deep_review.run_completed': DeepReviewBaseScope;
  readonly 'deep_review.migration': DeepReviewBaseScope;
  readonly 'deep_review.recovery_baseline': DeepReviewBaseScope;
  readonly 'deep_review.synthesis_incomplete': DeepReviewBaseScope;
  readonly 'deep_review.synthesis_complete': DeepReviewBaseScope;
  readonly 'deep_review.claim_adjudication': DeepReviewBaseScope;
  readonly 'deep_review.iteration_error': DeepReviewBaseScope;
}

export interface DeepReviewLedgerPayload<
  TStem extends DeepReviewEventStem,
> extends JsonObject {
  readonly stem: TStem;
  readonly eventVersion: 1;
  readonly scope: DeepReviewScopeMap[TStem];
  readonly prevEventHash: Digest;
  readonly payloadDigest: Digest;
  readonly replay: DeepReviewReplayMetadata;
  readonly data: DeepReviewPayloadMap[TStem];
}

export type DeepReviewEventEnvelope<
  TStem extends DeepReviewEventStem = DeepReviewEventStem,
> = EventEnvelope & {
  readonly event_type: typeof DeepReviewWireEventTypes[TStem];
  readonly event_version: 1;
  readonly payload: DeepReviewLedgerPayload<TStem>;
};

export type DeepReviewLedgerEvent = {
  readonly [TStem in DeepReviewEventStem]: DeepReviewEventEnvelope<TStem>;
}[DeepReviewEventStem];

// ───────────────────────────────────────────────────────────────────
// 5. COMPATIBILITY TYPES
// ───────────────────────────────────────────────────────────────────

export type DeepReviewCompatibilityStatus =
  | 'blocked'
  | 'compatible'
  | 'exact'
  | 'migrate'
  | 'pin-old-runtime';

export interface DeepReviewCompatibilityDecision {
  readonly status: DeepReviewCompatibilityStatus;
  readonly reasonCode: string;
  readonly targetStem: DeepReviewEventStem | null;
  readonly sourceVersion: number | null;
  readonly targetVersion: 1;
}

export interface LegacyUpcastContext {
  readonly scope:
    | DeepReviewBaseScope
    | DeepReviewGenerationScope
    | DeepReviewDimensionScope;
  readonly prevEventHash: Digest;
  readonly replay: DeepReviewReplayMetadata;
}

export interface LegacyUpcastCandidate {
  readonly status: 'migrated';
  readonly targetStem: DeepReviewEventStem;
  readonly eventVersion: 1;
  readonly originalRecordDigest: Digest;
  readonly upcasterFingerprint: Fingerprint;
  readonly warnings: readonly string[];
  readonly scope:
    | DeepReviewBaseScope
    | DeepReviewGenerationScope
    | DeepReviewDimensionScope;
  readonly prevEventHash: Digest;
  readonly replay: DeepReviewReplayMetadata;
  readonly data: JsonObject;
}

export type LegacyUpcastResult =
  | LegacyUpcastCandidate
  | {
    readonly status: 'refused';
    readonly decision: DeepReviewCompatibilityDecision;
  };
