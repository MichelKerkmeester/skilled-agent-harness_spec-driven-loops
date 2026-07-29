// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Shadow Parity Types
// ───────────────────────────────────────────────────────────────────

import type {
  ModelBenchmarkCertificateBundle,
  ModelBenchmarkOfflineVerificationInput,
  ModelBenchmarkOfflineVerifierReceipt,
} from '../model-benchmark-certificates/index.js';
import type {
  ModelBenchmarkEventStem,
  ModelBenchmarkLedgerEvent,
  ModelBenchmarkWireEventType,
  TrialMatrixKey,
} from '../model-benchmark-ledger-schema/index.js';
import type {
  ModelBenchmarkResumeDecision,
  ModelBenchmarkResumeRequest,
} from '../model-benchmark-resume-adapter/index.js';
import type { DeepImprovementCommonParityDiffClass } from '../deep-improvement-common-shadow-parity/index.js';
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

export type ModelBenchmarkParityFixtureScenario =
  | 'healthy-multi-model'
  | 'model-task-reversal'
  | 'paired-anchors'
  | 'adaptive-diagnostic-tail'
  | 'partial-matrix'
  | 'missing-usage'
  | 'judge-rubric-perturbation'
  | 'contamination-disclosure'
  | 'workload-tail'
  | 'score-policy-change'
  | 'replay'
  | 'resume'
  | 'duplicate-delivery'
  | 'late-completion'
  | 'shared-service-veto'
  | 'promotion-preparation'
  | 'telemetry-gap';

export type ModelBenchmarkLifecycleStage =
  | 'run'
  | 'design'
  | 'sealing'
  | 'admission'
  | 'dispatch'
  | 'observation'
  | 'scoring'
  | 'judge'
  | 'contamination'
  | 'validity'
  | 'selection'
  | 'shared-service'
  | 'resume'
  | 'terminal';

export interface ModelBenchmarkLifecycleEventMapping {
  readonly wireEventType: ModelBenchmarkWireEventType;
  readonly lifecycleStage: ModelBenchmarkLifecycleStage;
  readonly stepKey: string;
  readonly sharedService: boolean;
}

export interface ModelBenchmarkBudgetLeaseInput {
  readonly leaseId: string;
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly maxIterations: number;
  readonly remainingIterations: number;
  readonly deadlineAt: string;
}

export interface ModelBenchmarkFrozenParityInput {
  readonly baseSha: string;
  readonly runManifestDigest: string;
  readonly benchmarkRecipeDigest: string;
  readonly modelExecutorMatrixDigest: string;
  readonly taskFixtureSetDigest: string;
  readonly anchorPolicyDigest: string;
  readonly diagnosticPolicyDigest: string;
  readonly evaluatorEpochDigest: string;
  readonly judgeConfigurationDigest: string;
  readonly workloadProfileDigest: string;
  readonly contaminationVisibilityDigest: string;
  readonly seedPolicyDigest: string;
  readonly baselineDigest: string;
  readonly commonServiceContractDigest: string;
  readonly sealedArtifactContractDigest: string;
  readonly initialStateDigest: string;
  readonly configurationDigest: string;
  readonly budgetLease: ModelBenchmarkBudgetLeaseInput;
}

export interface ModelBenchmarkLegacyResumeSnapshot {
  readonly events: readonly ModelBenchmarkLedgerEvent[];
  readonly decision: ModelBenchmarkResumeDecision;
  readonly freshProjection: ModelBenchmarkParityProjection;
}

export interface ModelBenchmarkLegacyResumeOracleResult {
  readonly decision: ModelBenchmarkResumeDecision;
  readonly eventTail: Readonly<{
    streamId: string;
    streamSequence: number;
    eventCount: number;
  }>;
  readonly freshProjection: ModelBenchmarkParityProjection;
}

export interface ModelBenchmarkLegacyResumeOracle {
  resume(request: ModelBenchmarkResumeRequest): Promise<ModelBenchmarkLegacyResumeOracleResult>;
}

export interface ModelBenchmarkResumeParityEvidence {
  readonly legacyDecision: ModelBenchmarkResumeDecision;
  readonly ledgerDecision: ModelBenchmarkResumeDecision;
  readonly legacyEventTailDigest: string;
  readonly ledgerEventTailDigest: string;
  readonly legacyFreshProjectionFingerprint: string;
  readonly ledgerFreshProjectionFingerprint: string;
}

export interface ModelBenchmarkParityFixture {
  readonly fixtureId: string;
  readonly scenario: ModelBenchmarkParityFixtureScenario;
  readonly frozenInput: ModelBenchmarkFrozenParityInput;
  readonly events: readonly ModelBenchmarkLedgerEvent[];
  readonly expectedTerminalDecision: ModelBenchmarkTerminalDecision;
  readonly resumeEvidence: ModelBenchmarkResumeParityEvidence | null;
  readonly commonParityReceiptDigest: string;
}

export interface ModelBenchmarkModeCertificateVerification {
  readonly input: ModelBenchmarkOfflineVerificationInput<JsonObject>;
}

export interface ModelBenchmarkParityCaseRun {
  readonly caseDefinition: ParityCaseDefinition;
  readonly legacyBoundary: ParitySealedInputBoundary;
  readonly ledgerBoundary: ParitySealedInputBoundary;
  readonly fixture: ModelBenchmarkParityFixture;
  readonly executors: ModelBenchmarkParityExecutorPair;
  readonly modeCertificateVerification: ModelBenchmarkModeCertificateVerification;
  readonly shadowRootDirectory: string;
  readonly protectedRoots: readonly string[];
  readonly deterministicRuns?: number;
}

export type ModelBenchmarkTerminalDecision =
  | 'active'
  | 'aborted'
  | 'blocked'
  | 'completed'
  | 'inconclusive'
  | 'paused'
  | 'quarantined'
  | 'selection-prepared';

export interface ModelBenchmarkLogicalEventIdentity {
  readonly eventStem: ModelBenchmarkEventStem;
  readonly runId: string;
  readonly lineageId: string;
  readonly matrixCellKey: string | null;
  readonly trialId: string | null;
  readonly taskInstanceId: string | null;
  readonly taskFamilyId: string | null;
  readonly candidateId: string | null;
  readonly modelFingerprint: string | null;
  readonly executionPath: string | null;
  readonly pairedBlockId: string | null;
  readonly protocolVariant: string | null;
  readonly perturbationId: string | null;
  readonly logicalStep: string;
  readonly producerSequence: number;
}

export interface ModelBenchmarkParityEventObservation {
  readonly eventId: string;
  readonly eventType: ModelBenchmarkWireEventType;
  readonly logicalIdentity: ModelBenchmarkLogicalEventIdentity;
  readonly stepKey: string;
  readonly producerSequence: number;
  readonly causalLogicalIdentity: string | null;
  readonly stablePayloadDigest: string;
  readonly projectionFingerprint: string;
  readonly receiptRefs: readonly string[];
  readonly artifactRefs: readonly string[];
  readonly sharedServiceRefs: readonly string[];
  readonly matrixRefs: readonly string[];
  readonly evaluatorRefs: readonly string[];
  readonly contaminationRefs: readonly string[];
  readonly validityRefs: readonly string[];
  readonly workloadRefs: readonly string[];
  readonly authorizationRefs: readonly string[];
  readonly terminalDecision: ModelBenchmarkTerminalDecision | null;
}

export interface ModelBenchmarkVolatilityAllowance {
  readonly field: 'correlation_id' | 'occurred_at' | 'recorded_at';
  readonly valueKind: 'iso-timestamp' | 'transport-token';
  readonly owner: 'model-benchmark-shadow-parity';
  readonly volatilityReason: string;
  readonly semanticIdentity: false;
}

export interface ModelBenchmarkParityCell {
  readonly cellKey: string;
  readonly trialId: string;
  readonly matrixKey: TrialMatrixKey;
  readonly disposition: string;
  readonly sourceEventId: string;
  readonly rawResultDigest: string | null;
  readonly rawObservationDigest: string | null;
  readonly scoreDigest: string | null;
  readonly usageDigest: string | null;
  readonly latencyDigest: string | null;
}

export interface ModelBenchmarkParityProjection {
  readonly runId: string | null;
  readonly lineageId: string | null;
  readonly generation: number;
  readonly runState: string;
  readonly designIds: readonly string[];
  readonly trialBlockIds: readonly string[];
  readonly cells: readonly ModelBenchmarkParityCell[];
  readonly rawObservationDigests: readonly string[];
  readonly scorePolicyVersions: readonly string[];
  readonly scoreVectorDigests: readonly string[];
  readonly uncertaintyDigests: readonly string[];
  readonly judgeEvidenceDigests: readonly string[];
  readonly contaminationEvidenceDigests: readonly string[];
  readonly exposureEvidenceDigests: readonly string[];
  readonly validityStates: readonly string[];
  readonly validityUnknownCodes: readonly string[];
  readonly workloadEvidenceDigests: readonly string[];
  readonly usageEvidenceDigests: readonly string[];
  readonly latencyEvidenceDigests: readonly string[];
  readonly selectionEvidenceDigests: readonly string[];
  readonly commonAnchorRefs: readonly string[];
  readonly adaptiveDiagnosticRefs: readonly string[];
  readonly sharedServiceRefs: readonly string[];
  readonly unresolvedEvidenceRefs: readonly string[];
  readonly blockingVetoCodes: readonly string[];
  readonly matrixCoverage: number;
  readonly rankingState: string;
  readonly terminalDecision: ModelBenchmarkTerminalDecision;
  readonly resumeDecisionDigest: string | null;
}

export type ModelBenchmarkParityDiffClass =
  | DeepImprovementCommonParityDiffClass
  | 'input-inequality'
  | 'score'
  | 'evaluator-integrity'
  | 'contamination'
  | 'validity'
  | 'workload'
  | 'usage'
  | 'latency'
  | 'shared-reference'
  | 'resume-continuity';

export type ModelBenchmarkParityFaultKind =
  | 'artifact'
  | 'authorization'
  | 'causal-link'
  | 'contamination'
  | 'drop-event'
  | 'duplicate-event'
  | 'evaluator-integrity'
  | 'extra-event'
  | 'input-inequality'
  | 'latency'
  | 'malformed'
  | 'nondeterministic'
  | 'payload'
  | 'projection'
  | 'receipt'
  | 'reference-digest'
  | 'reorder-event'
  | 'resume-continuity'
  | 'score'
  | 'shared-reference'
  | 'stale'
  | 'telemetry-gap'
  | 'terminal-decision'
  | 'unauthorized'
  | 'unsupported-version'
  | 'usage'
  | 'validity'
  | 'workload';

export interface ModelBenchmarkParityFaultInjection {
  readonly path: 'ledger' | 'legacy';
  readonly kind: ModelBenchmarkParityFaultKind;
  readonly eventIndex: number;
}

export interface ModelBenchmarkPathEvidence {
  readonly path: 'ledger' | 'legacy';
  readonly implementationKind: 'modeled-legacy-oracle' | 'typed-ledger-pipeline';
  readonly runIndex: number;
  readonly streamDigest: string;
  readonly projectionFingerprint: string;
  readonly observations: readonly ModelBenchmarkParityEventObservation[];
}

export interface ModelBenchmarkParityExecutorPair {
  readonly legacy: ParityPathExecutor<ModelBenchmarkParityReplayState>;
  readonly ledger: ParityPathExecutor<ModelBenchmarkParityReplayState>;
  readonly evidence: () => readonly ModelBenchmarkPathEvidence[];
  readonly legacyOracleImplementation: 'modeled-legacy-oracle';
  readonly ledgerImplementation: 'typed-ledger-pipeline';
  readonly commonParityContractId: 'deep-improvement-common-shadow-parity';
  readonly substrateImportsReal: true;
}

export type ModelBenchmarkParityReplayState = JsonObject & {
  readonly eventIds: string[];
  readonly eventCanonicalJson: string[];
  readonly projectionCanonicalJson: string;
  readonly projectionFingerprint: string;
  readonly observationCanonicalJson: string[];
};

export interface ModelBenchmarkParityDiffRecord {
  readonly diffId: string;
  readonly fixtureId: string;
  readonly class: ModelBenchmarkParityDiffClass;
  readonly eventIndex: number;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly disposition: 'unexplained';
  readonly owner: 'model-benchmark-mode-owner';
  readonly dispositionReason: string;
  readonly trustedStateProof: string;
}

export interface ModelBenchmarkParityCertificateEvidenceBinding {
  readonly fixtureId: string;
  readonly legacyStreamDigest: string;
  readonly ledgerStreamDigest: string;
  readonly legacyProjectionFingerprint: string;
  readonly ledgerProjectionFingerprint: string;
  readonly caseEvidenceDigest: string;
  readonly referenceSetDigest: string;
  readonly attestationFinalDigests: readonly string[];
}

export interface ModelBenchmarkModeCertificateBinding {
  readonly bundle: ModelBenchmarkCertificateBundle;
  readonly certificateDigest: string;
  readonly verificationReceipt: ModelBenchmarkOfflineVerifierReceipt;
  readonly manifestDigest: string;
  readonly comparatorVersion: string;
  readonly caseSetDigest: string;
  readonly bindingDigest: string;
}

export interface ModelBenchmarkParityReceipt {
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
  readonly caseSetDigest: string;
  readonly legacyStreamDigest: string;
  readonly ledgerStreamDigest: string;
  readonly legacyProjectionFingerprint: string;
  readonly ledgerProjectionFingerprint: string;
  readonly commonParityContractId: 'deep-improvement-common-shadow-parity';
  readonly commonComparatorVersion: string;
  readonly commonParityReceiptDigest: string;
  readonly exitStatus: 'blocked' | 'green';
  readonly diffDispositions: readonly ModelBenchmarkParityDiffRecord[];
  readonly parityCertificate: ParityCertificate | null;
  readonly certificateEvidenceBindings: readonly ModelBenchmarkParityCertificateEvidenceBinding[];
  readonly parityCertificateDigest: string | null;
  readonly modeCertificateBinding: ModelBenchmarkModeCertificateBinding | null;
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

export type ModelBenchmarkModeGateBlockReasonCode =
  | 'CERTIFICATE_UNVERIFIABLE'
  | 'DIFF_UNEXPLAINED'
  | 'FIXTURE_FAILURE'
  | 'MISSING_RECEIPT'
  | 'NONDETERMINISTIC_REPLAY'
  | 'RECEIPT_MALFORMED'
  | 'RECEIPT_STALE'
  | 'ZERO_FIXTURES';

export interface ModelBenchmarkModeGateInput {
  readonly schemaVersion: string;
  readonly mode: 'model-benchmark';
  readonly baseSha: string;
  readonly manifestDigest: string;
  readonly fixtureIds: readonly string[];
  readonly parityReceiptDigests: readonly string[];
  readonly exitStatus: 'blocked' | 'pass';
  readonly zeroUnexplainedDiffs: boolean;
  readonly allReceiptsPresent: boolean;
  readonly deterministicReplay: boolean;
  readonly certificatesVerified: boolean;
  readonly authorityState: 'legacy-authoritative';
  readonly authorityMutation: false;
  readonly rollbackReadinessAuthorized: false;
  readonly cutoverAuthorized: false;
  readonly blockingReasonCode: ModelBenchmarkModeGateBlockReasonCode | null;
  readonly gateInputDigest: string;
}

export interface ModelBenchmarkParityCaseOutcome {
  readonly result: ShadowParityCaseResult;
  readonly receipt: ModelBenchmarkParityReceipt;
}

export interface ModelBenchmarkParitySuiteResult {
  readonly manifest: ParityCaseManifest;
  readonly caseResults: readonly ShadowParityCaseResult[];
  readonly receipts: readonly ModelBenchmarkParityReceipt[];
  readonly certificate: ParityCertificate | null;
  readonly divergence: ParityDivergenceRecord | null;
  readonly modeGateInput: ModelBenchmarkModeGateInput;
}
