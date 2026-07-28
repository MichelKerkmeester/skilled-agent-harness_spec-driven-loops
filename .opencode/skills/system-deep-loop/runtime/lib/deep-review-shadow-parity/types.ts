// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Shadow Parity Types
// ───────────────────────────────────────────────────────────────────

import type {
  DeepReviewLedgerEvent,
  DeepReviewWireEventType,
} from '../deep-review-ledger-schema/index.js';
import type {
  DeepReviewResumeDecision,
  DeepReviewResumeRequest,
} from '../deep-review-resume-adapter/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  ParityCaseDefinition,
  ParityCaseManifest,
  ParityCertificate,
  ParityCertificateRefusalCode,
  ParityDivergenceClass,
  ParityDivergenceRecord,
  ParityPathExecutor,
  ParitySealedInputBoundary,
  ShadowParityCaseResult,
} from '../shadow-parity/index.js';

export type DeepReviewParityFixtureScenario =
  | 'clean-review'
  | 'multiple-dimensions'
  | 'duplicate-candidates'
  | 'finding-updates'
  | 'fixed-preexisting-findings'
  | 'inconclusive-validation'
  | 'converged'
  | 'resumed-run'
  | 'deterministic-replay'
  | 'review-report';

export type DeepReviewLifecycleStage =
  | 'init'
  | 'scope'
  | 'dimension-pass'
  | 'findings-evidence'
  | 'convergence'
  | 'synthesis'
  | 'resume'
  | 'continuity-save'
  | 'terminal';

export interface DeepReviewLifecycleEventMapping {
  readonly wireEventType: DeepReviewWireEventType;
  readonly lifecycleStage: DeepReviewLifecycleStage;
  readonly stepKey: string;
}

export interface DeepReviewBudgetLeaseInput {
  readonly leaseId: string;
  readonly runId: string;
  readonly sessionId: string;
  readonly generation: number;
  readonly maxIterations: number;
  readonly remainingIterations: number;
  readonly deadlineAt: string;
}

export interface DeepReviewFrozenParityInput {
  readonly baseSha: string;
  readonly runManifestDigest: string;
  readonly sourceSnapshotDigest: string;
  readonly promptFingerprint: string;
  readonly modelFingerprint: string;
  readonly toolFingerprint: string;
  readonly initialStateDigest: string;
  readonly configurationDigest: string;
  readonly budgetLease: DeepReviewBudgetLeaseInput;
}

export type DeepReviewLegacyResumeEffectState =
  | 'applied'
  | 'conflicted'
  | 'pending'
  | 'uncertain';

export interface DeepReviewLegacyResumeEffectRecord {
  readonly effectId: string;
  readonly logicalEffectId: string;
  readonly state: DeepReviewLegacyResumeEffectState;
  readonly attemptRefs: readonly string[];
}

export interface DeepReviewLegacyResumeSnapshot {
  readonly events: readonly DeepReviewLedgerEvent[];
  readonly effects?: readonly DeepReviewLegacyResumeEffectRecord[];
  readonly priorCertificateDigest: string;
  readonly receiptChainDigest: string;
  readonly artifactSetDigest: string;
}

export interface DeepReviewLegacyResumeTail {
  readonly streamId: string;
  readonly streamSequence: number;
  readonly eventCount: number;
}

export interface DeepReviewLegacyResumeOracleResult {
  readonly decision: DeepReviewResumeDecision;
  readonly eventTail: DeepReviewLegacyResumeTail;
  readonly freshProjection: DeepReviewParityProjection;
}

export interface DeepReviewLegacyResumeOracle {
  resume(request: DeepReviewResumeRequest): Promise<DeepReviewLegacyResumeOracleResult>;
}

export interface DeepReviewResumeParityEvidence {
  readonly legacyDecision: DeepReviewResumeDecision;
  readonly ledgerDecision: DeepReviewResumeDecision;
  readonly legacyEventTailDigest: string;
  readonly ledgerEventTailDigest: string;
  readonly legacyFreshProjectionFingerprint: string;
  readonly ledgerFreshProjectionFingerprint: string;
}

export interface DeepReviewParityFixture {
  readonly fixtureId: string;
  readonly scenario: DeepReviewParityFixtureScenario;
  readonly frozenInput: DeepReviewFrozenParityInput;
  readonly events: readonly DeepReviewLedgerEvent[];
  readonly expectedTerminalDecision: DeepReviewTerminalDecision;
  readonly resumeEvidence: DeepReviewResumeParityEvidence | null;
}

export interface DeepReviewParityCaseRun {
  readonly caseDefinition: ParityCaseDefinition;
  readonly legacyBoundary: ParitySealedInputBoundary;
  readonly ledgerBoundary: ParitySealedInputBoundary;
  readonly fixture: DeepReviewParityFixture;
  readonly executors: DeepReviewParityExecutorPair;
  readonly shadowRootDirectory: string;
  readonly protectedRoots: readonly string[];
  readonly deterministicRuns?: number;
}

export type DeepReviewTerminalDecision =
  | 'active'
  | 'blocked'
  | 'completed'
  | 'converged'
  | 'incomplete'
  | 'quarantined';

export interface DeepReviewParityEventObservation {
  readonly eventId: string;
  readonly eventType: DeepReviewWireEventType;
  readonly logicalRunId: string;
  readonly logicalDimensionId: string | null;
  readonly logicalFindingId: string | null;
  readonly stepKey: string;
  readonly producerSequence: number;
  readonly causalEventIds: readonly string[];
  readonly stablePayloadDigest: string;
  readonly projectionFingerprint: string;
  readonly receiptRefs: readonly string[];
  readonly artifactRefs: readonly string[];
  readonly terminalDecision: DeepReviewTerminalDecision | null;
}

export type DeepReviewVolatileField =
  | 'correlation_id'
  | 'occurred_at'
  | 'recorded_at';

export interface DeepReviewVolatilityAllowance {
  readonly field: DeepReviewVolatileField;
  readonly valueKind: 'iso-timestamp' | 'transport-token';
  readonly owner: string;
  readonly volatilityReason: string;
  readonly semanticIdentity: false;
}

export interface DeepReviewProjectionPass {
  readonly iterationId: string;
  readonly dimensionId: string;
  readonly passNumber: number;
  readonly status: 'started' | 'complete' | 'incomplete' | 'blocked';
  readonly filesReviewed: readonly string[];
  readonly searchCoverageDigest: string;
}

export interface DeepReviewProjectionEvidence {
  readonly evidenceId: string;
  readonly candidateId: string;
  readonly contentDigest: string;
  readonly relevanceStatus: 'irrelevant' | 'relevant' | 'unknown';
  readonly stabilityStatus: 'stable' | 'unstable' | 'unknown';
}

export interface DeepReviewProjectionFinding {
  readonly findingId: string;
  readonly candidateId: string;
  readonly dimensionId: string;
  readonly claimDigest: string;
  readonly findingClass: string;
  readonly impact: number;
  readonly confidence: number;
  readonly reachability: number;
  readonly exploitability: number;
  readonly evidenceRefs: readonly string[];
  readonly evidenceScope: 'direct' | 'indirect' | 'partial';
  readonly lifecycle: 'candidate' | 'adjudicated' | 'accepted' | 'dismissed' | 'fixed';
  readonly presentationSeverity: 'none' | 'P0' | 'P1' | 'P2';
}

export interface DeepReviewProjectionLineage {
  readonly findingId: string;
  readonly relation:
    | 'absent'
    | 'disproved'
    | 'fixed'
    | 'introduced'
    | 'preexisting'
    | 'unchanged'
    | 'updated';
  readonly predecessorEventId: string;
}

export interface DeepReviewProjectionArtifact {
  readonly artifactKind:
    | 'raw-finding'
    | 'evidence'
    | 'adjudication'
    | 'challenge-attempt'
    | 'proof-receipt'
    | 'suppression-record'
    | 'verification-output'
    | 'review-report'
    | 'continuity-save';
  readonly digest: string;
  readonly validityState: 'invalid' | 'pending' | 'unknown' | 'valid';
  readonly receiptRefs: readonly string[];
}

export interface DeepReviewParityProjection {
  readonly runId: string | null;
  readonly sessionId: string | null;
  readonly generation: number;
  readonly targetIds: readonly string[];
  readonly orderedDimensionIds: readonly string[];
  readonly passes: readonly DeepReviewProjectionPass[];
  readonly evidence: readonly DeepReviewProjectionEvidence[];
  readonly findings: readonly DeepReviewProjectionFinding[];
  readonly lineage: readonly DeepReviewProjectionLineage[];
  readonly activeFindingIds: readonly string[];
  readonly hardVetoFindingIds: readonly string[];
  readonly convergenceDecision:
    | 'blocked'
    | 'continue'
    | 'converged'
    | 'incomplete'
    | 'recover'
    | null;
  readonly convergenceOutcome: 'active' | 'blocked' | 'converged' | 'incomplete';
  readonly reportDigest: string | null;
  readonly reportOrder: readonly string[];
  readonly continuitySaveState: 'completed' | 'failed' | 'none' | 'requested';
  readonly continuitySaveDigest: string | null;
  readonly artifacts: readonly DeepReviewProjectionArtifact[];
  readonly terminalDecision: DeepReviewTerminalDecision;
  readonly resumeDecisionDigest: string | null;
}

export type DeepReviewParityFaultKind =
  | 'artifact'
  | 'causal-link'
  | 'drop-event'
  | 'duplicate-event'
  | 'extra-event'
  | 'payload'
  | 'projection'
  | 'receipt'
  | 'reorder-event'
  | 'terminal-decision';

export interface DeepReviewParityFaultInjection {
  readonly path: 'ledger' | 'legacy';
  readonly kind: DeepReviewParityFaultKind;
  readonly eventIndex: number;
}

export interface DeepReviewPathEvidence {
  readonly path: 'ledger' | 'legacy';
  readonly runIndex: number;
  readonly streamDigest: string;
  readonly projectionFingerprint: string;
  readonly observations: readonly DeepReviewParityEventObservation[];
}

export interface DeepReviewParityExecutorPair {
  readonly legacy: ParityPathExecutor<DeepReviewParityReplayState>;
  readonly ledger: ParityPathExecutor<DeepReviewParityReplayState>;
  readonly evidence: () => readonly DeepReviewPathEvidence[];
  readonly substrateImportsReal: true;
  readonly legacyOracleKind: 'independent-legacy-model';
}

export type DeepReviewParityReplayState = JsonObject & {
  readonly eventIds: string[];
  readonly eventCanonicalJson: string[];
  readonly projectionCanonicalJson: string;
  readonly projectionFingerprint: string;
  readonly observationCanonicalJson: string[];
};

export type DeepReviewParityDiffClass =
  | 'artifact'
  | 'causal-link'
  | 'duplicated'
  | 'extra'
  | 'missing'
  | 'payload'
  | 'projection'
  | 'receipt'
  | 'reordered'
  | 'terminal-decision';

export type DeepReviewParityDiffDisposition = 'unexplained';

export interface DeepReviewParityDiffRecord {
  readonly diffId: string;
  readonly fixtureId: string;
  readonly class: DeepReviewParityDiffClass;
  readonly eventIndex: number;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly disposition: DeepReviewParityDiffDisposition;
  readonly owner: string;
  readonly dispositionReason: string;
  readonly trustedStateProof: string;
}

export type DeepReviewParityExitStatus = 'blocked' | 'green';

export interface DeepReviewParityCertificateEvidenceBinding {
  readonly fixtureId: string;
  readonly legacyStreamDigest: string;
  readonly ledgerStreamDigest: string;
  readonly legacyProjectionFingerprint: string;
  readonly ledgerProjectionFingerprint: string;
  readonly caseEvidenceDigest: string;
  readonly referenceSetDigest: string;
  readonly attestationFinalDigests: readonly string[];
}

export interface DeepReviewParityReceipt {
  readonly schemaVersion: string;
  readonly receiptId: string;
  readonly baseSha: string;
  readonly runManifestDigest: string;
  readonly eventSchemaVersion: string;
  readonly reducerVersion: string;
  readonly comparatorVersion: string;
  readonly projectionVersion: string;
  readonly comparatorConfigDigest: string;
  readonly fixtureId: string;
  readonly legacyStreamDigest: string;
  readonly ledgerStreamDigest: string;
  readonly legacyProjectionFingerprint: string;
  readonly ledgerProjectionFingerprint: string;
  readonly exitStatus: DeepReviewParityExitStatus;
  readonly diffDispositions: readonly DeepReviewParityDiffRecord[];
  readonly parityCertificate: ParityCertificate | null;
  readonly certificateEvidenceBindings:
    readonly DeepReviewParityCertificateEvidenceBinding[];
  readonly parityCertificateDigest: string | null;
  readonly certificateStatus: 'issued' | 'refused';
  readonly certificateRefusalCode: ParityCertificateRefusalCode | null;
  readonly genericDivergenceId: string | null;
  readonly genericDivergenceClass: ParityDivergenceClass | null;
  readonly authorityState: 'legacy-authoritative';
  readonly authorityMutation: false;
  readonly cutoverCertificate: false;
  readonly reproducibilityDigest: string;
  readonly receiptDigest: string;
}

export type DeepReviewModeGateBlockReasonCode =
  | 'CERTIFICATE_UNVERIFIABLE'
  | 'DIFF_UNEXPLAINED'
  | 'FIXTURE_FAILURE'
  | 'MISSING_RECEIPT'
  | 'NONDETERMINISTIC_REPLAY'
  | 'RECEIPT_MALFORMED'
  | 'RECEIPT_STALE'
  | 'ZERO_FIXTURES';

export interface DeepReviewModeGateInput {
  readonly schemaVersion: string;
  readonly mode: 'deep-review';
  readonly baseSha: string;
  readonly manifestDigest: string;
  readonly fixtureIds: readonly string[];
  readonly parityReceiptDigests: readonly string[];
  readonly exitStatus: 'blocked' | 'pass';
  readonly zeroUnexplainedDiffs: boolean;
  readonly allReceiptsPresent: boolean;
  readonly deterministicReplay: boolean;
  readonly authorityState: 'legacy-authoritative';
  readonly authorityMutation: false;
  readonly rollbackReadinessAuthorized: false;
  readonly cutoverAuthorized: false;
  readonly blockingReasonCode: DeepReviewModeGateBlockReasonCode | null;
  readonly gateInputDigest: string;
}

export interface DeepReviewParityCaseOutcome {
  readonly result: ShadowParityCaseResult;
  readonly receipt: DeepReviewParityReceipt;
}

export interface DeepReviewParitySuiteResult {
  readonly manifest: ParityCaseManifest;
  readonly caseResults: readonly ShadowParityCaseResult[];
  readonly receipts: readonly DeepReviewParityReceipt[];
  readonly certificate: ParityCertificate | null;
  readonly divergence: ParityDivergenceRecord | null;
  readonly modeGateInput: DeepReviewModeGateInput;
}
