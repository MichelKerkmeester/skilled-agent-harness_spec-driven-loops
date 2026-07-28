// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Shadow Parity Types
// ───────────────────────────────────────────────────────────────────

import type {
  DeepAlignmentLedgerEvent,
  DeepAlignmentWireEventType,
} from '../deep-alignment-ledger-schema/index.js';
import type {
  DeepAlignmentOfflineVerificationInput,
  DeepAlignmentOfflineVerificationSuccess,
} from '../deep-alignment-certificates/index.js';
import type {
  DeepAlignmentResumeDecision,
  DeepAlignmentResumeRequest,
} from '../deep-alignment-resume-adapter/index.js';
import type { JsonObject, JsonValue } from '../event-envelope/index.js';
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

export type DeepAlignmentParityFixtureScenario =
  | 'fresh-run'
  | 'concurrent-lanes'
  | 'retry'
  | 'late-completion'
  | 'authority-change'
  | 'applicability'
  | 'known-deviation'
  | 'authority-conflict'
  | 'deterministic-replay'
  | 'report-handoff';

export type DeepAlignmentLifecycleStage =
  | 'init'
  | 'authority'
  | 'scope'
  | 'lane'
  | 'observation-evidence'
  | 'finding-proof'
  | 'adjudication-deviation'
  | 'convergence'
  | 'report-handoff'
  | 'resume'
  | 'terminal';

export interface DeepAlignmentLifecycleEventMapping {
  readonly wireEventType: DeepAlignmentWireEventType;
  readonly lifecycleStage: DeepAlignmentLifecycleStage;
  readonly stepKey: string;
}

export interface DeepAlignmentBudgetLeaseInput {
  readonly leaseId: string;
  readonly runId: string;
  readonly sessionId: string;
  readonly generation: number;
  readonly maxIterations: number;
  readonly remainingIterations: number;
  readonly deadlineAt: string;
}

export interface DeepAlignmentFrozenParityInput {
  readonly baseSha: string;
  readonly runManifestDigest: string;
  readonly targetDigest: string;
  readonly authorityCapsuleDigest: string;
  readonly authorityEpochId: string;
  readonly verifierFingerprint: string;
  readonly laneConfigurationDigest: string;
  readonly reviewLoopContractVersion: string;
  readonly executorCapabilityDigest: string;
  readonly fixtureSeed: string;
  readonly initialStateDigest: string;
  readonly configurationDigest: string;
  readonly budgetLease: DeepAlignmentBudgetLeaseInput;
}

export type DeepAlignmentLegacyResumeEffectState =
  | 'applied'
  | 'conflicted'
  | 'pending'
  | 'uncertain';

export interface DeepAlignmentLegacyResumeEffectRecord {
  readonly effectId: string;
  readonly logicalEffectId: string;
  readonly state: DeepAlignmentLegacyResumeEffectState;
  readonly attemptRefs: readonly string[];
}

export interface DeepAlignmentLegacyResumeSnapshot {
  readonly events: readonly DeepAlignmentLedgerEvent[];
  readonly effects?: readonly DeepAlignmentLegacyResumeEffectRecord[];
  readonly priorCertificateDigest: string;
  readonly receiptChainDigest: string;
  readonly artifactSetDigest: string;
}

export interface DeepAlignmentLegacyResumeTail {
  readonly streamId: string;
  readonly streamSequence: number;
  readonly eventCount: number;
}

export interface DeepAlignmentLegacyResumeOracleResult {
  readonly decision: DeepAlignmentResumeDecision;
  readonly eventTail: DeepAlignmentLegacyResumeTail;
  readonly freshProjection: DeepAlignmentParityProjection;
}

export interface DeepAlignmentLegacyResumeOracle {
  resume(request: DeepAlignmentResumeRequest): Promise<DeepAlignmentLegacyResumeOracleResult>;
}

export interface DeepAlignmentResumeParityEvidence {
  readonly legacyDecision: DeepAlignmentResumeDecision;
  readonly ledgerDecision: DeepAlignmentResumeDecision;
  readonly legacyEventTailDigest: string;
  readonly ledgerEventTailDigest: string;
  readonly legacyFreshProjectionFingerprint: string;
  readonly ledgerFreshProjectionFingerprint: string;
}

export interface DeepAlignmentParityFixture {
  readonly fixtureId: string;
  readonly scenario: DeepAlignmentParityFixtureScenario;
  readonly frozenInput: DeepAlignmentFrozenParityInput;
  readonly events: readonly DeepAlignmentLedgerEvent[];
  readonly expectedTerminalDecision: DeepAlignmentTerminalDecision;
  readonly resumeEvidence: DeepAlignmentResumeParityEvidence | null;
}

export interface DeepAlignmentParityCaseRun {
  readonly caseDefinition: ParityCaseDefinition;
  readonly legacyBoundary: ParitySealedInputBoundary;
  readonly ledgerBoundary: ParitySealedInputBoundary;
  readonly fixture: DeepAlignmentParityFixture;
  readonly executors: DeepAlignmentParityExecutorPair;
  readonly shadowRootDirectory: string;
  readonly protectedRoots: readonly string[];
  readonly deterministicRuns?: number;
}

// ───────────────────────────────────────────────────────────────────
// 2. CANONICAL EVENT AND PROJECTION CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepAlignmentTerminalDecision =
  | 'active'
  | 'blocked'
  | 'completed'
  | 'failed'
  | 'incomplete';

export interface DeepAlignmentParityEventObservation {
  readonly eventId: string;
  readonly eventType: DeepAlignmentWireEventType;
  readonly logicalRunId: string;
  readonly authorityEpochId: string;
  readonly logicalLaneId: string | null;
  readonly logicalSubjectId: string | null;
  readonly logicalRuleId: string | null;
  readonly logicalFindingId: string | null;
  readonly stepKey: string;
  readonly producerSequence: number;
  readonly causalEventIds: readonly string[];
  readonly stablePayloadDigest: string;
  readonly projectionFingerprint: string;
  readonly receiptRefs: readonly string[];
  readonly artifactRefs: readonly string[];
  readonly terminalDecision: DeepAlignmentTerminalDecision | null;
}

export type DeepAlignmentVolatileField =
  | 'correlation_id'
  | 'occurred_at'
  | 'recorded_at';

export interface DeepAlignmentVolatilityAllowance {
  readonly field: DeepAlignmentVolatileField;
  readonly valueKind: 'iso-timestamp' | 'transport-token';
  readonly owner: string;
  readonly volatilityReason: string;
  readonly semanticIdentity: false;
}

export interface DeepAlignmentParityProjection {
  readonly runId: string | null;
  readonly sessionId: string | null;
  readonly authorityEpochId: string | null;
  readonly generation: number;
  readonly authorityStatus: 'invalid' | 'missing' | 'valid';
  readonly authorityReferences: readonly JsonValue[];
  readonly authorityValidations: readonly JsonValue[];
  readonly authorityCompatibilities: readonly JsonValue[];
  readonly lanes: readonly JsonValue[];
  readonly applicabilityDecisions: readonly JsonValue[];
  readonly applicabilityCoverage: readonly JsonValue[];
  readonly observations: readonly JsonValue[];
  readonly evidenceReceipts: readonly JsonValue[];
  readonly findings: readonly JsonValue[];
  readonly deviations: readonly JsonValue[];
  readonly proofWitnesses: readonly JsonValue[];
  readonly laneVerdicts: readonly JsonValue[];
  readonly overallVerdict: string;
  readonly reviewLoopOutcome: string;
  readonly reviewLoopEligibility: string;
  readonly activeFindingIds: readonly string[];
  readonly hardVetoFindingIds: readonly string[];
  readonly artifactDigests: readonly string[];
  readonly terminalDecision: DeepAlignmentTerminalDecision;
  readonly publicGauges: Readonly<Record<string, number>>;
  readonly reportDigest: string | null;
  readonly continuitySaveDigest: string | null;
  readonly resumeDecisionDigest: string | null;
}

// ───────────────────────────────────────────────────────────────────
// 3. FAULT AND EXECUTOR EVIDENCE CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepAlignmentParityFaultKind =
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

export interface DeepAlignmentParityFaultInjection {
  readonly path: 'ledger' | 'legacy';
  readonly kind: DeepAlignmentParityFaultKind;
  readonly eventIndex: number;
}

export interface DeepAlignmentPathEvidence {
  readonly path: 'ledger' | 'legacy';
  readonly runIndex: number;
  readonly streamDigest: string;
  readonly projectionFingerprint: string;
  readonly observations: readonly DeepAlignmentParityEventObservation[];
}

export interface DeepAlignmentParityExecutorPair {
  readonly legacy: ParityPathExecutor<DeepAlignmentParityReplayState>;
  readonly ledger: ParityPathExecutor<DeepAlignmentParityReplayState>;
  readonly evidence: () => readonly DeepAlignmentPathEvidence[];
  readonly substrateImportsReal: true;
  readonly legacyOracleKind: 'independent-legacy-model';
  readonly sharedReviewLoopContract: 'imported-phase-012-backbone';
}

export type DeepAlignmentParityReplayState = JsonObject & {
  readonly eventIds: string[];
  readonly eventCanonicalJson: string[];
  readonly projectionCanonicalJson: string;
  readonly projectionFingerprint: string;
  readonly observationCanonicalJson: string[];
};

// ───────────────────────────────────────────────────────────────────
// 4. DIFF, RECEIPT, CERTIFICATE, AND MODE-GATE CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepAlignmentParityDiffClass =
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

export type DeepAlignmentParityDiffDisposition = 'unexplained';

export interface DeepAlignmentParityDiffRecord {
  readonly diffId: string;
  readonly fixtureId: string;
  readonly class: DeepAlignmentParityDiffClass;
  readonly eventIndex: number;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly disposition: DeepAlignmentParityDiffDisposition;
  readonly owner: string;
  readonly dispositionReason: string;
  readonly trustedStateProof: string;
}

export type DeepAlignmentParityExitStatus = 'blocked' | 'green';

export interface DeepAlignmentParityCertificateEvidenceBinding {
  readonly fixtureId: string;
  readonly legacyStreamDigest: string;
  readonly ledgerStreamDigest: string;
  readonly legacyProjectionFingerprint: string;
  readonly ledgerProjectionFingerprint: string;
  readonly caseEvidenceDigest: string;
  readonly referenceSetDigest: string;
  readonly attestationFinalDigests: readonly string[];
}

export interface DeepAlignmentParityReceipt {
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
  readonly exitStatus: DeepAlignmentParityExitStatus;
  readonly diffDispositions: readonly DeepAlignmentParityDiffRecord[];
  readonly parityCertificate: ParityCertificate | null;
  readonly certificateEvidenceBindings:
    readonly DeepAlignmentParityCertificateEvidenceBinding[];
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

export type DeepAlignmentModeGateBlockReasonCode =
  | 'CERTIFICATE_UNVERIFIABLE'
  | 'DIFF_UNEXPLAINED'
  | 'FIXTURE_FAILURE'
  | 'MISSING_RECEIPT'
  | 'NONDETERMINISTIC_REPLAY'
  | 'RECEIPT_MALFORMED'
  | 'RECEIPT_STALE'
  | 'ZERO_FIXTURES';

export interface DeepAlignmentModeGateInput {
  readonly schemaVersion: string;
  readonly mode: 'deep-alignment';
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
  readonly blockingReasonCode: DeepAlignmentModeGateBlockReasonCode | null;
  readonly gateInputDigest: string;
}

export interface DeepAlignmentParityCaseOutcome {
  readonly result: ShadowParityCaseResult;
  readonly receipt: DeepAlignmentParityReceipt;
}

export interface DeepAlignmentParitySuiteResult {
  readonly manifest: ParityCaseManifest;
  readonly caseResults: readonly ShadowParityCaseResult[];
  readonly receipts: readonly DeepAlignmentParityReceipt[];
  readonly certificate: ParityCertificate | null;
  readonly divergence: ParityDivergenceRecord | null;
  readonly modeGateInput: DeepAlignmentModeGateInput;
}

export type DeepAlignmentModeCertificateVerificationInput<TState extends JsonObject> =
  DeepAlignmentOfflineVerificationInput<TState>;
export type DeepAlignmentModeCertificateVerificationSuccess =
  DeepAlignmentOfflineVerificationSuccess;
