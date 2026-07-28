// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Shadow Parity Types
// ───────────────────────────────────────────────────────────────────

import type {
  DeepImprovementCommonEventStem,
  DeepImprovementCommonLedgerEvent,
  DeepImprovementCommonWireEventType,
  DeepImprovementScoreVector,
  DeepImprovementVariant,
} from '../deep-improvement-common-ledger-schema/index.js';
import type {
  DeepImprovementCommonCertificateBundle,
  DeepImprovementCommonOfflineVerificationInput,
  DeepImprovementCommonOfflineVerifierReceipt,
} from '../deep-improvement-common-certificates/index.js';
import type {
  DeepImprovementCommonResumeDecision as CommonResumeDecision,
  DeepImprovementCommonResumeRequest as CommonResumeRequest,
} from '../deep-improvement-common-resume-adapter/index.js';
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

export type DeepImprovementCommonParityResumeDecision = CommonResumeDecision;
export type DeepImprovementCommonParityResumeRequest = CommonResumeRequest;

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED MODE AND FIXTURE CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepImprovementCommonParityFixtureScenario =
  | 'healthy-progress'
  | 'candidate-rejection'
  | 'score-policy-change'
  | 'evaluator-epoch-change'
  | 'canary-leak'
  | 'canary-drift'
  | 'promotion-veto'
  | 'inconclusive-evidence'
  | 'rollback-target-preservation'
  | 'crash-resume'
  | 'duplicate-delivery'
  | 'unsupported-version';

export type DeepImprovementCommonLifecycleStage =
  | 'run'
  | 'candidate'
  | 'evaluation'
  | 'canary'
  | 'promotion'
  | 'rollback'
  | 'terminal';

export interface DeepImprovementCommonLifecycleEventMapping {
  readonly wireEventType: DeepImprovementCommonWireEventType;
  readonly lifecycleStage: DeepImprovementCommonLifecycleStage;
  readonly stepKey: string;
}

export interface DeepImprovementCommonBudgetLeaseInput {
  readonly leaseId: string;
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly maxIterations: number;
  readonly remainingIterations: number;
  readonly deadlineAt: string;
}

export interface DeepImprovementCommonFrozenParityInput {
  readonly baseSha: string;
  readonly runManifestDigest: string;
  readonly evaluatorCapsuleDigest: string;
  readonly fixtureSetDigest: string;
  readonly baselineDigest: string;
  readonly policyDigest: string;
  readonly initialStateDigest: string;
  readonly configurationDigest: string;
  readonly budgetLease: DeepImprovementCommonBudgetLeaseInput;
}

export type DeepImprovementCommonLegacyResumeEffectState =
  | 'compensation-required'
  | 'conflicted'
  | 'pending'
  | 'uncertain';

export interface DeepImprovementCommonLegacyResumeEffectRecord {
  readonly effectId: string;
  readonly logicalEffectId: string;
  readonly state: DeepImprovementCommonLegacyResumeEffectState;
  readonly attemptRefs: readonly string[];
}

export interface DeepImprovementCommonLegacyResumeSnapshot {
  readonly events: readonly DeepImprovementCommonLedgerEvent[];
  readonly effects?: readonly DeepImprovementCommonLegacyResumeEffectRecord[];
  readonly verifiedCertificateDigests?: readonly string[];
  readonly verifiedArtifactDigests?: readonly string[];
}

export interface DeepImprovementCommonLegacyResumeTail {
  readonly streamId: string;
  readonly streamSequence: number;
  readonly eventCount: number;
}

export interface DeepImprovementCommonLegacyResumeOracleResult {
  readonly decision: CommonResumeDecision;
  readonly eventTail: DeepImprovementCommonLegacyResumeTail;
  readonly freshProjection: DeepImprovementCommonParityProjection;
}

export interface DeepImprovementCommonLegacyResumeOracle {
  resume(
    request: CommonResumeRequest,
  ): Promise<DeepImprovementCommonLegacyResumeOracleResult>;
}

export interface DeepImprovementCommonResumeParityEvidence {
  readonly legacyDecision: CommonResumeDecision;
  readonly ledgerDecision: CommonResumeDecision;
  readonly legacyEventTailDigest: string;
  readonly ledgerEventTailDigest: string;
  readonly legacyFreshProjectionFingerprint: string;
  readonly ledgerFreshProjectionFingerprint: string;
}

export interface DeepImprovementCommonParityFixture {
  readonly fixtureId: string;
  readonly scenario: DeepImprovementCommonParityFixtureScenario;
  readonly variant: DeepImprovementVariant;
  readonly frozenInput: DeepImprovementCommonFrozenParityInput;
  readonly events: readonly DeepImprovementCommonLedgerEvent[];
  readonly expectedTerminalDecision: DeepImprovementCommonTerminalDecision;
  readonly resumeEvidence: DeepImprovementCommonResumeParityEvidence | null;
}

export interface DeepImprovementCommonModeCertificateVerification {
  readonly input: DeepImprovementCommonOfflineVerificationInput<JsonObject>;
}

export interface DeepImprovementCommonParityCaseRun {
  readonly caseDefinition: ParityCaseDefinition;
  readonly legacyBoundary: ParitySealedInputBoundary;
  readonly ledgerBoundary: ParitySealedInputBoundary;
  readonly fixture: DeepImprovementCommonParityFixture;
  readonly executors: DeepImprovementCommonParityExecutorPair;
  readonly modeCertificateVerification: DeepImprovementCommonModeCertificateVerification;
  readonly shadowRootDirectory: string;
  readonly protectedRoots: readonly string[];
  readonly deterministicRuns?: number;
}

// ───────────────────────────────────────────────────────────────────
// 2. CANONICAL EVENT AND PROJECTION CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepImprovementCommonTerminalDecision =
  | 'active'
  | 'aborted'
  | 'blocked'
  | 'completed'
  | 'inconclusive'
  | 'paused'
  | 'quarantined'
  | 'rolled-back'
  | 'shipped';

export interface DeepImprovementCommonLogicalEventIdentity {
  readonly eventStem: DeepImprovementCommonEventStem;
  readonly runId: string;
  readonly lineageId: string;
  readonly variant: DeepImprovementVariant;
  readonly candidateId: string | null;
  readonly evaluationEpochId: string | null;
  readonly fixtureId: string | null;
  readonly observationId: string | null;
  readonly canaryEpochId: string | null;
  readonly canarySuiteId: string | null;
  readonly promotionId: string | null;
  readonly baselineId: string | null;
  readonly producerSequence: number;
}

export interface DeepImprovementCommonParityEventObservation {
  readonly eventId: string;
  readonly eventType: DeepImprovementCommonWireEventType;
  readonly logicalIdentity: DeepImprovementCommonLogicalEventIdentity;
  readonly stepKey: string;
  readonly producerSequence: number;
  readonly causalLogicalIdentity: string | null;
  readonly stablePayloadDigest: string;
  readonly projectionFingerprint: string;
  readonly receiptRefs: readonly string[];
  readonly artifactRefs: readonly string[];
  readonly authorizationRefs: readonly string[];
  readonly terminalDecision: DeepImprovementCommonTerminalDecision | null;
}

export type DeepImprovementCommonVolatileField =
  | 'correlation_id'
  | 'occurred_at'
  | 'recorded_at';

export interface DeepImprovementCommonVolatilityAllowance {
  readonly field: DeepImprovementCommonVolatileField;
  readonly valueKind: 'iso-timestamp' | 'transport-token';
  readonly owner: 'deep-improvement-common-shadow-parity';
  readonly volatilityReason: string;
  readonly semanticIdentity: false;
}

export interface DeepImprovementCommonParityCandidate {
  readonly candidateId: string;
  readonly parentCandidateId: string | null;
  readonly proposalDigest: string;
  readonly candidateArtifactDigest: string | null;
  readonly stage: 'proposed' | 'generated' | 'rejected' | 'evaluating' | 'scored'
    | 'verified' | 'inconclusive' | 'failed';
}

export interface DeepImprovementCommonParityEvaluatorEpoch {
  readonly evaluationEpochId: string;
  readonly candidateId: string;
  readonly evaluatorRef: string;
  readonly evaluatorCapsuleDigest: string;
  readonly fixtureSetRef: string;
  readonly fixtureSetDigest: string;
  readonly scorePolicyVersion: string;
  readonly evaluationBudgetRef: string;
}

export interface DeepImprovementCommonParityRawObservation {
  readonly candidateId: string;
  readonly evaluationEpochId: string;
  readonly fixtureId: string;
  readonly observationId: string;
  readonly evaluatorRef: string;
  readonly fixtureRef: string;
  readonly rawObservationRef: string;
  readonly rawObservationDigest: string;
  readonly executionReceiptRef: string;
  readonly observationOutcome: 'error' | 'fail' | 'pass' | 'timeout';
}

export interface DeepImprovementCommonParityScore {
  readonly candidateId: string;
  readonly evaluationEpochId: string;
  readonly observationEventIds: readonly string[];
  readonly observationSetDigest: string;
  readonly scorePolicyVersion: string;
  readonly scorerFingerprint: string;
  readonly scoreVector: DeepImprovementScoreVector;
  readonly normalizationReceiptRef: string;
}

export interface DeepImprovementCommonParityCanary {
  readonly candidateId: string;
  readonly canaryEpochId: string;
  readonly canarySuiteId: string;
  readonly stage: 'not-started' | 'sealed' | 'executed' | 'passed' | 'failed' | 'vetoed';
  readonly suiteDigest: string;
  readonly observationDigests: readonly string[];
  readonly decisionReceiptRefs: readonly string[];
}

export interface DeepImprovementCommonParityPromotion {
  readonly promotionId: string;
  readonly candidateId: string;
  readonly baselineId: string;
  readonly stage: 'not-proposed' | 'proposed' | 'authorized' | 'denied' | 'shadow'
    | 'canary' | 'paused' | 'aborted' | 'rolled-back' | 'shipped';
  readonly requestedRollout: 'canary' | 'shadow' | null;
  readonly externalAuthorizationRef: string | null;
  readonly rollbackTargetBaselineId: string | null;
  readonly receiptRefs: readonly string[];
}

export interface DeepImprovementCommonParityVeto {
  readonly candidateId: string;
  readonly vetoCode: string;
  readonly source: 'canary' | 'evaluator-integrity' | 'promotion' | 'verification';
  readonly evidenceRef: string;
  readonly evidenceDigest: string;
}

export interface DeepImprovementCommonParityProjection {
  readonly runId: string | null;
  readonly lineageId: string | null;
  readonly variant: DeepImprovementVariant | null;
  readonly generation: number;
  readonly runState: 'planned' | 'active' | 'paused' | 'completed' | 'aborted' | 'quarantined';
  readonly candidates: readonly DeepImprovementCommonParityCandidate[];
  readonly evaluatorEpochs: readonly DeepImprovementCommonParityEvaluatorEpoch[];
  readonly rawObservations: readonly DeepImprovementCommonParityRawObservation[];
  readonly scores: readonly DeepImprovementCommonParityScore[];
  readonly canaries: readonly DeepImprovementCommonParityCanary[];
  readonly promotions: readonly DeepImprovementCommonParityPromotion[];
  readonly hardVetoes: readonly DeepImprovementCommonParityVeto[];
  readonly evaluationBudgetRefs: readonly string[];
  readonly unresolvedEvidenceRefs: readonly string[];
  readonly rollbackTargetBaselineId: string | null;
  readonly stopReason: string | null;
  readonly sessionOutcome: string | null;
  readonly terminalDecision: DeepImprovementCommonTerminalDecision;
  readonly resumeDecisionDigest: string | null;
}

// ───────────────────────────────────────────────────────────────────
// 3. FAULT AND EXECUTOR EVIDENCE CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepImprovementCommonParityFaultKind =
  | 'artifact'
  | 'authorization'
  | 'canary'
  | 'causal-link'
  | 'drop-event'
  | 'duplicate-event'
  | 'evaluator-integrity'
  | 'extra-event'
  | 'malformed'
  | 'nondeterministic'
  | 'payload'
  | 'projection'
  | 'promotion'
  | 'receipt'
  | 'reference-digest'
  | 'reorder-event'
  | 'stale'
  | 'telemetry-gap'
  | 'terminal-decision'
  | 'unsupported-version';

export interface DeepImprovementCommonParityFaultInjection {
  readonly path: 'ledger' | 'legacy';
  readonly kind: DeepImprovementCommonParityFaultKind;
  readonly eventIndex: number;
}

export interface DeepImprovementCommonPathEvidence {
  readonly path: 'ledger' | 'legacy';
  readonly implementationKind: 'modeled-legacy-oracle' | 'typed-ledger-pipeline';
  readonly runIndex: number;
  readonly streamDigest: string;
  readonly projectionFingerprint: string;
  readonly observations: readonly DeepImprovementCommonParityEventObservation[];
}

export interface DeepImprovementCommonParityExecutorPair {
  readonly legacy: ParityPathExecutor<DeepImprovementCommonParityReplayState>;
  readonly ledger: ParityPathExecutor<DeepImprovementCommonParityReplayState>;
  readonly evidence: () => readonly DeepImprovementCommonPathEvidence[];
  readonly legacyOracleImplementation: 'modeled-legacy-oracle';
  readonly ledgerImplementation: 'typed-ledger-pipeline';
  readonly substrateImportsReal: true;
}

export type DeepImprovementCommonParityReplayState = JsonObject & {
  readonly eventIds: string[];
  readonly eventCanonicalJson: string[];
  readonly projectionCanonicalJson: string;
  readonly projectionFingerprint: string;
  readonly observationCanonicalJson: string[];
};

// ───────────────────────────────────────────────────────────────────
// 4. DIFF, RECEIPT, AND MODE-GATE CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepImprovementCommonParityDiffClass =
  | 'artifact'
  | 'causal-link'
  | 'canary'
  | 'duplicated'
  | 'evaluator-integrity'
  | 'extra'
  | 'malformed'
  | 'missing'
  | 'nondeterministic'
  | 'payload'
  | 'projection'
  | 'promotion'
  | 'receipt'
  | 'reference-digest'
  | 'reordered'
  | 'stale'
  | 'telemetry-gap'
  | 'terminal-decision'
  | 'unauthorized'
  | 'unsupported-version';

export type DeepImprovementCommonParityDiffDisposition = 'unexplained';

export interface DeepImprovementCommonParityDiffRecord {
  readonly diffId: string;
  readonly fixtureId: string;
  readonly class: DeepImprovementCommonParityDiffClass;
  readonly eventIndex: number;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly disposition: DeepImprovementCommonParityDiffDisposition;
  readonly owner: 'deep-improvement-common-mode-owner';
  readonly dispositionReason: string;
  readonly trustedStateProof: string;
}

export type DeepImprovementCommonParityExitStatus = 'blocked' | 'green';

export interface DeepImprovementCommonParityCertificateEvidenceBinding {
  readonly fixtureId: string;
  readonly legacyStreamDigest: string;
  readonly ledgerStreamDigest: string;
  readonly legacyProjectionFingerprint: string;
  readonly ledgerProjectionFingerprint: string;
  readonly caseEvidenceDigest: string;
  readonly referenceSetDigest: string;
  readonly attestationFinalDigests: readonly string[];
}

export interface DeepImprovementCommonModeCertificateBinding {
  readonly bundle: DeepImprovementCommonCertificateBundle;
  readonly certificateDigest: string;
  readonly verificationReceipt: DeepImprovementCommonOfflineVerifierReceipt;
  readonly manifestDigest: string;
  readonly comparatorVersion: string;
  readonly caseSetDigest: string;
  readonly bindingDigest: string;
}

export interface DeepImprovementCommonParityReceipt {
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
  readonly exitStatus: DeepImprovementCommonParityExitStatus;
  readonly diffDispositions: readonly DeepImprovementCommonParityDiffRecord[];
  readonly parityCertificate: ParityCertificate | null;
  readonly certificateEvidenceBindings:
    readonly DeepImprovementCommonParityCertificateEvidenceBinding[];
  readonly parityCertificateDigest: string | null;
  readonly modeCertificateBinding: DeepImprovementCommonModeCertificateBinding | null;
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

export type DeepImprovementCommonModeGateBlockReasonCode =
  | 'CERTIFICATE_UNVERIFIABLE'
  | 'DIFF_UNEXPLAINED'
  | 'FIXTURE_FAILURE'
  | 'MISSING_RECEIPT'
  | 'NONDETERMINISTIC_REPLAY'
  | 'RECEIPT_MALFORMED'
  | 'RECEIPT_STALE'
  | 'ZERO_FIXTURES';

export interface DeepImprovementCommonModeGateInput {
  readonly schemaVersion: string;
  readonly mode: 'deep-improvement-common';
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
  readonly blockingReasonCode: DeepImprovementCommonModeGateBlockReasonCode | null;
  readonly gateInputDigest: string;
}

export interface DeepImprovementCommonParityCaseOutcome {
  readonly result: ShadowParityCaseResult;
  readonly receipt: DeepImprovementCommonParityReceipt;
}

export interface DeepImprovementCommonParitySuiteResult {
  readonly manifest: ParityCaseManifest;
  readonly caseResults: readonly ShadowParityCaseResult[];
  readonly receipts: readonly DeepImprovementCommonParityReceipt[];
  readonly certificate: ParityCertificate | null;
  readonly divergence: ParityDivergenceRecord | null;
  readonly modeGateInput: DeepImprovementCommonModeGateInput;
}
