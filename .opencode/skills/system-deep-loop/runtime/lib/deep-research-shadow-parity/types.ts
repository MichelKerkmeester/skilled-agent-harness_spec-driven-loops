// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Shadow Parity Types
// ───────────────────────────────────────────────────────────────────

import type {
  DeepResearchLedgerEvent,
  DeepResearchWireEventType,
} from '../deep-research-ledger-schema/index.js';
import type {
  DeepResearchResumeDecision,
  DeepResearchResumeRequest,
} from '../deep-research-resume-adapter/index.js';
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

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED MODE AND FIXTURE CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepResearchParityFixtureScenario =
  | 'fresh-run'
  | 'multi-branch'
  | 'quarantined-evidence'
  | 'contradiction-supersession'
  | 'max-iteration-incomplete'
  | 'converged'
  | 'crash-resume'
  | 'source-mutation-refresh'
  | 'synthesis'
  | 'memory-save-handoff';

export type DeepResearchLifecycleStage =
  | 'init'
  | 'plan'
  | 'gather-analyze'
  | 'projection'
  | 'next-focus'
  | 'convergence'
  | 'synthesis'
  | 'resume'
  | 'memory-save'
  | 'terminal';

export interface DeepResearchLifecycleEventMapping {
  readonly wireEventType: DeepResearchWireEventType;
  readonly lifecycleStage: DeepResearchLifecycleStage;
  readonly stepKey: string;
}

export interface DeepResearchBudgetLeaseInput {
  readonly leaseId: string;
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly maxIterations: number;
  readonly remainingIterations: number;
  readonly deadlineAt: string;
}

export interface DeepResearchFrozenParityInput {
  readonly baseSha: string;
  readonly runManifestDigest: string;
  readonly sourceSnapshotDigest: string;
  readonly promptFingerprint: string;
  readonly modelFingerprint: string;
  readonly toolFingerprint: string;
  readonly initialStateDigest: string;
  readonly configurationDigest: string;
  readonly budgetLease: DeepResearchBudgetLeaseInput;
}

export type DeepResearchLegacyResumeEffectState =
  | 'compensation-required'
  | 'conflicted'
  | 'pending'
  | 'uncertain';

export interface DeepResearchLegacyResumeEffectRecord {
  readonly effectId: string;
  readonly logicalEffectId: string;
  readonly state: DeepResearchLegacyResumeEffectState;
  readonly attemptRefs: readonly string[];
}

export interface DeepResearchLegacyResumeSnapshot {
  readonly events: readonly DeepResearchLedgerEvent[];
  readonly effects?: readonly DeepResearchLegacyResumeEffectRecord[];
  readonly forensicReceiptDigests?: readonly string[];
  readonly verifiedArtifactDigests?: readonly string[];
}

export interface DeepResearchLegacyResumeTail {
  readonly streamId: string;
  readonly streamSequence: number;
  readonly eventCount: number;
}

export interface DeepResearchLegacyResumeOracleResult {
  readonly decision: DeepResearchResumeDecision;
  readonly eventTail: DeepResearchLegacyResumeTail;
  readonly freshProjection: DeepResearchParityProjection;
}

export interface DeepResearchLegacyResumeOracle {
  resume(
    request: DeepResearchResumeRequest,
  ): Promise<DeepResearchLegacyResumeOracleResult>;
}

export interface DeepResearchResumeParityEvidence {
  readonly legacyDecision: DeepResearchResumeDecision;
  readonly ledgerDecision: DeepResearchResumeDecision;
  readonly legacyEventTailDigest: string;
  readonly ledgerEventTailDigest: string;
  readonly legacyFreshProjectionFingerprint: string;
  readonly ledgerFreshProjectionFingerprint: string;
}

export interface DeepResearchParityFixture {
  readonly fixtureId: string;
  readonly scenario: DeepResearchParityFixtureScenario;
  readonly frozenInput: DeepResearchFrozenParityInput;
  readonly events: readonly DeepResearchLedgerEvent[];
  readonly expectedTerminalDecision: DeepResearchTerminalDecision;
  readonly resumeEvidence: DeepResearchResumeParityEvidence | null;
}

export interface DeepResearchParityCaseRun {
  readonly caseDefinition: ParityCaseDefinition;
  readonly legacyBoundary: ParitySealedInputBoundary;
  readonly ledgerBoundary: ParitySealedInputBoundary;
  readonly fixture: DeepResearchParityFixture;
  readonly executors: DeepResearchParityExecutorPair;
  readonly shadowRootDirectory: string;
  readonly protectedRoots: readonly string[];
  readonly deterministicRuns?: number;
}

// ───────────────────────────────────────────────────────────────────
// 2. CANONICAL EVENT AND PROJECTION CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepResearchTerminalDecision =
  | 'active'
  | 'blocked'
  | 'completed'
  | 'converged'
  | 'incomplete'
  | 'quarantined';

export interface DeepResearchParityEventObservation {
  readonly eventId: string;
  readonly eventType: DeepResearchWireEventType;
  readonly logicalRunId: string;
  readonly logicalBranchId: string | null;
  readonly stepKey: string;
  readonly producerSequence: number;
  readonly causalEventIds: readonly string[];
  readonly stablePayloadDigest: string;
  readonly projectionFingerprint: string;
  readonly receiptRefs: readonly string[];
  readonly artifactRefs: readonly string[];
  readonly terminalDecision: DeepResearchTerminalDecision | null;
}

export type DeepResearchVolatileField =
  | 'correlation_id'
  | 'occurred_at'
  | 'recorded_at';

export interface DeepResearchVolatilityAllowance {
  readonly field: DeepResearchVolatileField;
  readonly valueKind: 'iso-timestamp' | 'transport-token';
  readonly owner: string;
  readonly volatilityReason: string;
  readonly semanticIdentity: false;
}

export interface DeepResearchProjectionBranch {
  readonly questionId: string;
  readonly branchId: string;
  readonly lifecycle: 'planned' | 'selected';
}

export interface DeepResearchProjectionSource {
  readonly sourceVersionId: string;
  readonly contentDigest: string;
  readonly parentSourceVersionId: string | null;
  readonly instructionScanResult: 'clean' | 'flagged' | 'unknown';
}

export interface DeepResearchProjectionEvidence {
  readonly evidenceId: string;
  readonly sourceVersionId: string;
  readonly disposition: 'admit' | 'degrade' | 'quarantine';
  readonly contaminationStatus: 'clean' | 'contaminated' | 'suspected' | 'unknown';
}

export interface DeepResearchProjectionClaim {
  readonly claimId: string;
  readonly claimVersionId: string;
  readonly relation: 'asserts' | 'contextualizes' | 'contradicts' | 'qualifies' | 'supports';
  readonly evidenceIds: readonly string[];
  readonly claimStatus: 'contested' | 'supported' | 'unresolved';
}

export interface DeepResearchProjectionSupersession {
  readonly priorClaimVersionId: string;
  readonly successorClaimVersionId: string;
}

export interface DeepResearchProjectionArtifact {
  readonly artifactKind: 'continuity-save' | 'iteration-output' | 'research-report' | 'source-capture';
  readonly digest: string;
  readonly validityState: 'invalid' | 'pending' | 'unknown' | 'valid';
  readonly receiptRefs: readonly string[];
}

export interface DeepResearchParityProjection {
  readonly runId: string | null;
  readonly lineageId: string | null;
  readonly generation: number;
  readonly questionIds: readonly string[];
  readonly branches: readonly DeepResearchProjectionBranch[];
  readonly sources: readonly DeepResearchProjectionSource[];
  readonly evidence: readonly DeepResearchProjectionEvidence[];
  readonly claims: readonly DeepResearchProjectionClaim[];
  readonly supersessions: readonly DeepResearchProjectionSupersession[];
  readonly activeClaimVersionIds: readonly string[];
  readonly contradictionClaimVersionIds: readonly string[];
  readonly nextFocusId: string | null;
  readonly convergenceDecision: 'blocked' | 'continue' | 'converged' | 'incomplete' | 'recover' | null;
  readonly convergenceOutcome: 'active' | 'blocked' | 'converged' | 'incomplete' | 'quarantined';
  readonly synthesisInputDigest: string | null;
  readonly reportDigest: string | null;
  readonly memorySaveState: 'completed' | 'failed' | 'none' | 'requested';
  readonly memorySaveDigest: string | null;
  readonly artifacts: readonly DeepResearchProjectionArtifact[];
  readonly terminalDecision: DeepResearchTerminalDecision;
  readonly resumeDecisionDigest: string | null;
}

// ───────────────────────────────────────────────────────────────────
// 3. FAULT AND EXECUTOR EVIDENCE CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepResearchParityFaultKind =
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

export interface DeepResearchParityFaultInjection {
  readonly path: 'ledger' | 'legacy';
  readonly kind: DeepResearchParityFaultKind;
  readonly eventIndex: number;
}

export interface DeepResearchPathEvidence {
  readonly path: 'ledger' | 'legacy';
  readonly runIndex: number;
  readonly streamDigest: string;
  readonly projectionFingerprint: string;
  readonly observations: readonly DeepResearchParityEventObservation[];
}

export interface DeepResearchParityExecutorPair {
  readonly legacy: ParityPathExecutor<DeepResearchParityReplayState>;
  readonly ledger: ParityPathExecutor<DeepResearchParityReplayState>;
  readonly evidence: () => readonly DeepResearchPathEvidence[];
  readonly substrateImportsReal: true;
}

export type DeepResearchParityReplayState = JsonObject & {
  readonly eventIds: string[];
  readonly eventCanonicalJson: string[];
  readonly projectionCanonicalJson: string;
  readonly projectionFingerprint: string;
  readonly observationCanonicalJson: string[];
};

// ───────────────────────────────────────────────────────────────────
// 4. DIFF, RECEIPT, AND MODE-GATE CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepResearchParityDiffClass =
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

export type DeepResearchParityDiffDisposition = 'unexplained';

export interface DeepResearchParityDiffRecord {
  readonly diffId: string;
  readonly fixtureId: string;
  readonly class: DeepResearchParityDiffClass;
  readonly eventIndex: number;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly disposition: DeepResearchParityDiffDisposition;
  readonly owner: string;
  readonly dispositionReason: string;
  readonly trustedStateProof: string;
}

export type DeepResearchParityExitStatus = 'blocked' | 'green';

export interface DeepResearchParityCertificateEvidenceBinding {
  readonly fixtureId: string;
  readonly legacyStreamDigest: string;
  readonly ledgerStreamDigest: string;
  readonly legacyProjectionFingerprint: string;
  readonly ledgerProjectionFingerprint: string;
  readonly caseEvidenceDigest: string;
  readonly referenceSetDigest: string;
  readonly attestationFinalDigests: readonly string[];
}

export interface DeepResearchParityReceipt {
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
  readonly exitStatus: DeepResearchParityExitStatus;
  readonly diffDispositions: readonly DeepResearchParityDiffRecord[];
  readonly parityCertificate: ParityCertificate | null;
  readonly certificateEvidenceBindings:
    readonly DeepResearchParityCertificateEvidenceBinding[];
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

export type DeepResearchModeGateBlockReasonCode =
  | 'CERTIFICATE_UNVERIFIABLE'
  | 'DIFF_UNEXPLAINED'
  | 'FIXTURE_FAILURE'
  | 'MISSING_RECEIPT'
  | 'NONDETERMINISTIC_REPLAY'
  | 'RECEIPT_MALFORMED'
  | 'RECEIPT_STALE'
  | 'ZERO_FIXTURES';

export interface DeepResearchModeGateInput {
  readonly schemaVersion: string;
  readonly mode: 'deep-research';
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
  readonly blockingReasonCode: DeepResearchModeGateBlockReasonCode | null;
  readonly gateInputDigest: string;
}

export interface DeepResearchParityCaseOutcome {
  readonly result: ShadowParityCaseResult;
  readonly receipt: DeepResearchParityReceipt;
}

export interface DeepResearchParitySuiteResult {
  readonly manifest: ParityCaseManifest;
  readonly caseResults: readonly ShadowParityCaseResult[];
  readonly receipts: readonly DeepResearchParityReceipt[];
  readonly certificate: ParityCertificate | null;
  readonly divergence: ParityDivergenceRecord | null;
  readonly modeGateInput: DeepResearchModeGateInput;
}
