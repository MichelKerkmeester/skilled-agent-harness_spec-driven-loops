// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Shadow Parity Types
// ───────────────────────────────────────────────────────────────────

import type {
  DeepAiCouncilLedgerEvent,
  DeepAiCouncilWireEventType,
} from '../deep-ai-council-ledger-schema/index.js';
import type {
  DeepAiCouncilResumeDecision,
  DeepAiCouncilResumeRequest,
} from '../deep-ai-council-resume-adapter/index.js';
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

export type DeepAiCouncilParityFixtureScenario =
  | 'normal-completion'
  | 'multi-round-deliberation'
  | 'seat-timeout'
  | 'seat-error'
  | 'unresolved-contradiction'
  | 'max-round-non-convergence'
  | 'partial-artifact-persistence'
  | 'rollback'
  | 'resume-boundaries'
  | 'blinded-adjudication';

export type DeepAiCouncilLifecycleStage =
  | 'init'
  | 'deliberation'
  | 'critique'
  | 'adjudication'
  | 'convergence'
  | 'synthesis'
  | 'artifacts'
  | 'test-gate'
  | 'rollback'
  | 'resume'
  | 'terminal';

export interface DeepAiCouncilLifecycleEventMapping {
  readonly wireEventType: DeepAiCouncilWireEventType;
  readonly lifecycleStage: DeepAiCouncilLifecycleStage;
  readonly stepKey: string;
}

export interface DeepAiCouncilBudgetLeaseInput {
  readonly leaseId: string;
  readonly runId: string;
  readonly roundId: string;
  readonly generation: number;
  readonly remainingMs: number;
  readonly replayFingerprint: string;
  readonly deadlineAt: string;
}

export interface DeepAiCouncilFrozenParityInput {
  readonly baseSha: string;
  readonly runManifestDigest: string;
  readonly sourceSnapshotDigest: string;
  readonly promptFingerprint: string;
  readonly modelFingerprint: string;
  readonly toolFingerprint: string;
  readonly initialStateDigest: string;
  readonly configurationDigest: string;
  readonly budgetLease: DeepAiCouncilBudgetLeaseInput;
}

export type DeepAiCouncilLegacyResumeEffectState =
  | 'compensation-required'
  | 'conflicted'
  | 'pending'
  | 'uncertain';

export interface DeepAiCouncilLegacyResumeEffectRecord {
  readonly effectId: string;
  readonly logicalEffectId: string;
  readonly state: DeepAiCouncilLegacyResumeEffectState;
  readonly attemptRefs: readonly string[];
}

export interface DeepAiCouncilLegacyResumeSnapshot {
  readonly events: readonly DeepAiCouncilLedgerEvent[];
  readonly effects?: readonly DeepAiCouncilLegacyResumeEffectRecord[];
  readonly forensicReceiptDigests?: readonly string[];
  readonly verifiedArtifactDigests?: readonly string[];
}

export interface DeepAiCouncilLegacyResumeTail {
  readonly streamId: string;
  readonly streamSequence: number;
  readonly eventCount: number;
}

export interface DeepAiCouncilLegacyResumeOracleResult {
  readonly decision: DeepAiCouncilResumeDecision;
  readonly eventTail: DeepAiCouncilLegacyResumeTail;
  readonly freshProjection: DeepAiCouncilParityProjection;
}

export interface DeepAiCouncilLegacyResumeOracle {
  resume(
    request: DeepAiCouncilResumeRequest,
  ): Promise<DeepAiCouncilLegacyResumeOracleResult>;
}

export interface DeepAiCouncilResumeParityEvidence {
  readonly legacyDecision: DeepAiCouncilResumeDecision;
  readonly ledgerDecision: DeepAiCouncilResumeDecision;
  readonly legacyEventTailDigest: string;
  readonly ledgerEventTailDigest: string;
  readonly legacyFreshProjectionFingerprint: string;
  readonly ledgerFreshProjectionFingerprint: string;
}

export interface DeepAiCouncilParityFixture {
  readonly fixtureId: string;
  readonly scenario: DeepAiCouncilParityFixtureScenario;
  readonly frozenInput: DeepAiCouncilFrozenParityInput;
  readonly events: readonly DeepAiCouncilLedgerEvent[];
  readonly expectedTerminalDecision: DeepAiCouncilTerminalDecision;
  readonly resumeEvidence: DeepAiCouncilResumeParityEvidence | null;
}

export interface DeepAiCouncilParityCaseRun {
  readonly caseDefinition: ParityCaseDefinition;
  readonly legacyBoundary: ParitySealedInputBoundary;
  readonly ledgerBoundary: ParitySealedInputBoundary;
  readonly fixture: DeepAiCouncilParityFixture;
  readonly executors: DeepAiCouncilParityExecutorPair;
  readonly shadowRootDirectory: string;
  readonly protectedRoots: readonly string[];
  readonly deterministicRuns?: number;
}

// ───────────────────────────────────────────────────────────────────
// 2. CANONICAL EVENT AND PROJECTION CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepAiCouncilTerminalDecision =
  | 'active'
  | 'blocked'
  | 'completed'
  | 'converged'
  | 'incomplete'
  | 'non-converged'
  | 'quarantined';

export interface DeepAiCouncilParityEventObservation {
  readonly eventId: string;
  readonly eventType: DeepAiCouncilWireEventType;
  readonly logicalRunId: string;
  readonly logicalBranchId: string | null;
  readonly stepKey: string;
  readonly producerSequence: number;
  readonly causalEventIds: readonly string[];
  readonly stablePayloadDigest: string;
  readonly projectionFingerprint: string;
  readonly receiptRefs: readonly string[];
  readonly artifactRefs: readonly string[];
  readonly terminalDecision: DeepAiCouncilTerminalDecision | null;
}

export type DeepAiCouncilVolatileField =
  | 'correlation_id'
  | 'occurred_at'
  | 'recorded_at';

export interface DeepAiCouncilVolatilityAllowance {
  readonly field: DeepAiCouncilVolatileField;
  readonly valueKind: 'iso-timestamp' | 'transport-token';
  readonly owner: string;
  readonly volatilityReason: string;
  readonly semanticIdentity: false;
}

export interface DeepAiCouncilProjectionBranch {
  readonly questionId: string;
  readonly branchId: string;
  readonly lifecycle: 'planned' | 'selected';
}

export interface DeepAiCouncilProjectionSource {
  readonly sourceVersionId: string;
  readonly contentDigest: string;
  readonly parentSourceVersionId: string | null;
  readonly instructionScanResult: 'clean' | 'flagged' | 'unknown';
}

export interface DeepAiCouncilProjectionEvidence {
  readonly evidenceId: string;
  readonly sourceVersionId: string;
  readonly disposition: 'admit' | 'degrade' | 'quarantine';
  readonly contaminationStatus: 'clean' | 'contaminated' | 'suspected' | 'unknown';
}

export interface DeepAiCouncilProjectionClaim {
  readonly claimId: string;
  readonly claimVersionId: string;
  readonly relation: 'asserts' | 'contextualizes' | 'contradicts' | 'qualifies' | 'supports';
  readonly evidenceIds: readonly string[];
  readonly claimStatus: 'contested' | 'supported' | 'unresolved';
}

export interface DeepAiCouncilProjectionSupersession {
  readonly priorClaimVersionId: string;
  readonly successorClaimVersionId: string;
}

export interface DeepAiCouncilProjectionArtifact {
  readonly artifactKind:
    | 'candidate'
    | 'critique'
    | 'proposal'
    | 'synthesis'
    | string;
  readonly digest: string;
  readonly validityState: 'invalid' | 'pending' | 'unknown' | 'valid';
  readonly receiptRefs: readonly string[];
}

export interface DeepAiCouncilParityProjection {
  readonly runId: string | null;
  readonly roundId: string | null;
  readonly generation: number;
  readonly roundIds: readonly string[];
  readonly seatIds: readonly string[];
  readonly proposalIds: readonly string[];
  readonly critiqueRoundIds: readonly string[];
  readonly candidateIds: readonly string[];
  readonly judgmentIds: readonly string[];
  readonly minorityRefs: readonly string[];
  readonly contradictionRefs: readonly string[];
  readonly convergenceDecision:
    | 'blocked'
    | 'continue'
    | 'converged'
    | 'incomplete'
    | 'non-converged'
    | null;
  readonly convergenceOutcome:
    | 'active'
    | 'blocked'
    | 'converged'
    | 'incomplete'
    | 'non-converged';
  readonly synthesisInputDigest: string | null;
  readonly selectedPlanDigest: string | null;
  readonly testGateVerdict: 'blocked' | 'fail' | 'pass' | 'unknown';
  readonly artifacts: readonly DeepAiCouncilProjectionArtifact[];
  readonly terminalDecision: DeepAiCouncilTerminalDecision;
  readonly resumeDecisionDigest: string | null;
}

// ───────────────────────────────────────────────────────────────────
// 3. FAULT AND EXECUTOR EVIDENCE CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepAiCouncilParityFaultKind =
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

export interface DeepAiCouncilParityFaultInjection {
  readonly path: 'ledger' | 'legacy';
  readonly kind: DeepAiCouncilParityFaultKind;
  readonly eventIndex: number;
}

export interface DeepAiCouncilPathEvidence {
  readonly path: 'ledger' | 'legacy';
  readonly runIndex: number;
  readonly streamDigest: string;
  readonly projectionFingerprint: string;
  readonly observations: readonly DeepAiCouncilParityEventObservation[];
}

export interface DeepAiCouncilParityExecutorPair {
  readonly legacy: ParityPathExecutor<DeepAiCouncilParityReplayState>;
  readonly ledger: ParityPathExecutor<DeepAiCouncilParityReplayState>;
  readonly evidence: () => readonly DeepAiCouncilPathEvidence[];
  readonly legacyOracleKind: 'independent-legacy-model';
  readonly substrateImportsReal: true;
}

export type DeepAiCouncilParityReplayState = JsonObject & {
  readonly eventIds: string[];
  readonly eventCanonicalJson: string[];
  readonly projectionCanonicalJson: string;
  readonly projectionFingerprint: string;
  readonly observationCanonicalJson: string[];
};

// ───────────────────────────────────────────────────────────────────
// 4. DIFF, RECEIPT, AND MODE-GATE CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepAiCouncilParityDiffClass =
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

export type DeepAiCouncilParityDiffDisposition = 'unexplained';

export interface DeepAiCouncilParityDiffRecord {
  readonly diffId: string;
  readonly fixtureId: string;
  readonly class: DeepAiCouncilParityDiffClass;
  readonly eventIndex: number;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly disposition: DeepAiCouncilParityDiffDisposition;
  readonly owner: string;
  readonly dispositionReason: string;
  readonly trustedStateProof: string;
}

export type DeepAiCouncilParityExitStatus = 'blocked' | 'green';

export interface DeepAiCouncilParityCertificateEvidenceBinding {
  readonly fixtureId: string;
  readonly legacyStreamDigest: string;
  readonly ledgerStreamDigest: string;
  readonly legacyProjectionFingerprint: string;
  readonly ledgerProjectionFingerprint: string;
  readonly caseEvidenceDigest: string;
  readonly referenceSetDigest: string;
  readonly attestationFinalDigests: readonly string[];
}

export interface DeepAiCouncilParityReceipt {
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
  readonly exitStatus: DeepAiCouncilParityExitStatus;
  readonly diffDispositions: readonly DeepAiCouncilParityDiffRecord[];
  readonly parityCertificate: ParityCertificate | null;
  readonly certificateEvidenceBindings:
    readonly DeepAiCouncilParityCertificateEvidenceBinding[];
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

export type DeepAiCouncilModeGateBlockReasonCode =
  | 'CERTIFICATE_UNVERIFIABLE'
  | 'DIFF_UNEXPLAINED'
  | 'FIXTURE_FAILURE'
  | 'MISSING_RECEIPT'
  | 'NONDETERMINISTIC_REPLAY'
  | 'RECEIPT_MALFORMED'
  | 'RECEIPT_STALE'
  | 'ZERO_FIXTURES';

export interface DeepAiCouncilModeGateInput {
  readonly schemaVersion: string;
  readonly mode: 'deep-ai-council';
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
  readonly blockingReasonCode: DeepAiCouncilModeGateBlockReasonCode | null;
  readonly gateInputDigest: string;
}

export interface DeepAiCouncilParityCaseOutcome {
  readonly result: ShadowParityCaseResult;
  readonly receipt: DeepAiCouncilParityReceipt;
}

export interface DeepAiCouncilParitySuiteResult {
  readonly manifest: ParityCaseManifest;
  readonly caseResults: readonly ShadowParityCaseResult[];
  readonly receipts: readonly DeepAiCouncilParityReceipt[];
  readonly certificate: ParityCertificate | null;
  readonly divergence: ParityDivergenceRecord | null;
  readonly modeGateInput: DeepAiCouncilModeGateInput;
}
