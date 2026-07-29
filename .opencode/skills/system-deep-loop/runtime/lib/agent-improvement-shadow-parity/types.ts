// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Shadow Parity Types
// ───────────────────────────────────────────────────────────────────

import type {
  AgentImprovementCertificateBundle,
  AgentImprovementOfflineVerificationInput,
  AgentImprovementOfflineVerifierReceipt,
} from '../agent-improvement-certificates/index.js';
import type {
  AgentImprovementEventStem,
  AgentImprovementLedgerEvent,
  AgentImprovementWireEventType,
} from '../agent-improvement-ledger-schema/index.js';
import type {
  AgentImprovementResumeDecision,
  AgentImprovementResumeRequest,
} from '../agent-improvement-resume-adapter/index.js';
import type {
  DeepImprovementCommonParityDiffClass,
} from '../deep-improvement-common-shadow-parity/index.js';
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

export type AgentImprovementParityFixtureScenario =
  | 'clean-proposal'
  | 'single-locus-repair'
  | 'multi-candidate-frontier'
  | 'known-locus-defect'
  | 'act-refuse-clarify'
  | 'authority-conflict'
  | 'tool-state-failure'
  | 'missing-evidence'
  | 'evaluator-epoch-change'
  | 'semantic-variants'
  | 'executor-transfer'
  | 'crash-resume'
  | 'duplicate-delivery'
  | 'promotion-veto'
  | 'rollback-preparation';

export type AgentImprovementLifecycleStage =
  | 'run'
  | 'definition'
  | 'agent-ir'
  | 'change-contract'
  | 'proposal'
  | 'causal-analysis'
  | 'evaluation'
  | 'coverage'
  | 'frontier'
  | 'transfer'
  | 'canary'
  | 'promotion'
  | 'resume'
  | 'rollback'
  | 'terminal';

export interface AgentImprovementLifecycleEventMapping {
  readonly wireEventType: AgentImprovementWireEventType;
  readonly lifecycleStage: AgentImprovementLifecycleStage;
  readonly stepKey: string;
  readonly sharedService: boolean;
}

export interface AgentImprovementBudgetLeaseInput {
  readonly leaseId: string;
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly maxIterations: number;
  readonly remainingIterations: number;
  readonly deadlineAt: string;
}

export interface AgentImprovementFrozenParityInput {
  readonly baseSha: string;
  readonly runManifestDigest: string;
  readonly targetAgentDigest: string;
  readonly baselineAgentDigest: string;
  readonly agentIrDigest: string;
  readonly inheritanceDigest: string;
  readonly evaluatorCapsuleDigest: string;
  readonly evaluatorEpochId: string;
  readonly fixtureRingsDigest: string;
  readonly executorDescriptorDigest: string;
  readonly environmentDigest: string;
  readonly toolReceiptsDigest: string;
  readonly commonServiceContractDigest: string;
  readonly initialStateDigest: string;
  readonly configurationDigest: string;
  readonly budgetLease: AgentImprovementBudgetLeaseInput;
}

export interface AgentImprovementLegacyResumeSnapshot {
  readonly events: readonly AgentImprovementLedgerEvent[];
  readonly decision: AgentImprovementResumeDecision;
  readonly freshProjection: AgentImprovementParityProjection;
}

export interface AgentImprovementLegacyResumeTail {
  readonly streamId: string;
  readonly streamSequence: number;
  readonly eventCount: number;
}

export interface AgentImprovementLegacyResumeOracleResult {
  readonly decision: AgentImprovementResumeDecision;
  readonly eventTail: AgentImprovementLegacyResumeTail;
  readonly freshProjection: AgentImprovementParityProjection;
}

export interface AgentImprovementLegacyResumeOracle {
  resume(
    request: AgentImprovementResumeRequest,
  ): Promise<AgentImprovementLegacyResumeOracleResult>;
}

export interface AgentImprovementResumeParityEvidence {
  readonly legacyDecision: AgentImprovementResumeDecision;
  readonly ledgerDecision: AgentImprovementResumeDecision;
  readonly legacyEventTailDigest: string;
  readonly ledgerEventTailDigest: string;
  readonly legacyFreshProjectionFingerprint: string;
  readonly ledgerFreshProjectionFingerprint: string;
}

export interface AgentImprovementParityFixture {
  readonly fixtureId: string;
  readonly scenario: AgentImprovementParityFixtureScenario;
  readonly frozenInput: AgentImprovementFrozenParityInput;
  readonly events: readonly AgentImprovementLedgerEvent[];
  readonly expectedTerminalDecision: AgentImprovementTerminalDecision;
  readonly resumeEvidence: AgentImprovementResumeParityEvidence | null;
  readonly commonParityReceiptDigest: string;
}

export interface AgentImprovementModeCertificateVerification {
  readonly input: AgentImprovementOfflineVerificationInput<JsonObject>;
}

export interface AgentImprovementParityCaseRun {
  readonly caseDefinition: ParityCaseDefinition;
  readonly legacyBoundary: ParitySealedInputBoundary;
  readonly ledgerBoundary: ParitySealedInputBoundary;
  readonly fixture: AgentImprovementParityFixture;
  readonly executors: AgentImprovementParityExecutorPair;
  readonly modeCertificateVerification: AgentImprovementModeCertificateVerification;
  readonly shadowRootDirectory: string;
  readonly protectedRoots: readonly string[];
  readonly deterministicRuns?: number;
}

// ───────────────────────────────────────────────────────────────────
// 2. CANONICAL EVENT AND PROJECTION CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type AgentImprovementTerminalDecision =
  | 'active'
  | 'blocked'
  | 'completed'
  | 'inconclusive'
  | 'paused'
  | 'quarantined'
  | 'rolled-back'
  | 'shipped';

export interface AgentImprovementLogicalEventIdentity {
  readonly eventStem: AgentImprovementEventStem;
  readonly runId: string;
  readonly lineageId: string;
  readonly candidateId: string | null;
  readonly agentDefinitionId: string | null;
  readonly agentIrId: string | null;
  readonly agentChangeId: string | null;
  readonly mutationId: string | null;
  readonly behaviorFamilyId: string | null;
  readonly evaluationEpochId: string | null;
  readonly experimentId: string | null;
  readonly interventionId: string | null;
  readonly manifestId: string | null;
  readonly exposureEpochId: string | null;
  readonly trialId: string | null;
  readonly logicalStep: string;
  readonly producerSequence: number;
}

export interface AgentImprovementParityEventObservation {
  readonly eventId: string;
  readonly eventType: AgentImprovementWireEventType;
  readonly logicalIdentity: AgentImprovementLogicalEventIdentity;
  readonly stepKey: string;
  readonly producerSequence: number;
  readonly causalLogicalIdentity: string | null;
  readonly changedLocusIds: readonly string[];
  readonly lineageRefs: readonly string[];
  readonly stablePayloadDigest: string;
  readonly projectionFingerprint: string;
  readonly receiptRefs: readonly string[];
  readonly artifactRefs: readonly string[];
  readonly sharedServiceRefs: readonly string[];
  readonly authorizationRefs: readonly string[];
  readonly terminalDecision: AgentImprovementTerminalDecision | null;
}

export type AgentImprovementVolatileField =
  | 'correlation_id'
  | 'occurred_at'
  | 'recorded_at';

export interface AgentImprovementVolatilityAllowance {
  readonly field: AgentImprovementVolatileField;
  readonly valueKind: 'iso-timestamp' | 'transport-token';
  readonly owner: 'agent-improvement-shadow-parity';
  readonly volatilityReason: string;
  readonly semanticIdentity: false;
}

export interface AgentImprovementParityAgentIr {
  readonly agentDefinitionId: string;
  readonly agentIrId: string;
  readonly agentIrDigest: string;
  readonly schemaVersion: string;
  readonly componentIds: readonly string[];
  readonly inheritedClauseIds: readonly string[];
  readonly mutableLocusIds: readonly string[];
  readonly compilerFingerprint: string;
}

export interface AgentImprovementParityProposal {
  readonly candidateId: string;
  readonly parentCandidateId: string | null;
  readonly agentChangeId: string;
  readonly mutationId: string;
  readonly lifecycle: 'proposed' | 'rejected';
  readonly targetLocusIds: readonly string[];
  readonly diagnosticEvidenceRefs: readonly string[];
  readonly proposalDigest: string;
  readonly rejectionReasonCode: string | null;
}

export interface AgentImprovementParityCausalEvidence {
  readonly candidateId: string;
  readonly behaviorFamilyId: string;
  readonly experimentId: string;
  readonly interventionId: string | null;
  readonly kind: 'trace-slice' | 'known-defect' | 'counterfactual' | 'ablation';
  readonly clauseIds: readonly string[];
  readonly componentIds: readonly string[];
  readonly locusIds: readonly string[];
  readonly rawObservationDigest: string;
  readonly outcome: string;
  readonly uncertainty: number;
}

export interface AgentImprovementParityCoverage {
  readonly candidateId: string;
  readonly evaluationEpochId: string;
  readonly behaviorFamilyId: string;
  readonly clauseIds: readonly string[];
  readonly authorityConflictCaseIds: readonly string[];
  readonly negativeCapabilityCaseIds: readonly string[];
  readonly semanticVariantIds: readonly string[];
  readonly outcome: 'covered' | 'insufficient-evidence' | 'partial';
  readonly criticalInvariantOutcome: 'fail' | 'pass' | 'unknown';
}

export interface AgentImprovementParityTransfer {
  readonly candidateId: string;
  readonly evaluationEpochId: string;
  readonly trialId: string;
  readonly sourceExecutorFingerprint: string;
  readonly targetExecutorFingerprint: string;
  readonly verifierFingerprint: string;
  readonly behaviorFamilyIds: readonly string[];
  readonly rawObservationDigest: string;
  readonly outcome: 'fail' | 'inconclusive' | 'pass';
}

export interface AgentImprovementParityManifestExposure {
  readonly evaluationEpochId: string;
  readonly manifestId: string;
  readonly exposureEpochId: string;
  readonly manifestDigest: string;
  readonly evaluatorCapsuleDigest: string;
  readonly ringCodes: readonly string[];
  readonly exposureKind: 'activated' | 'retired' | 'sealed';
  readonly authorizationDigest: string | null;
}

export interface AgentImprovementParityProjection {
  readonly runId: string | null;
  readonly lineageId: string | null;
  readonly generation: number;
  readonly agentIrs: readonly AgentImprovementParityAgentIr[];
  readonly proposals: readonly AgentImprovementParityProposal[];
  readonly causalEvidence: readonly AgentImprovementParityCausalEvidence[];
  readonly coverage: readonly AgentImprovementParityCoverage[];
  readonly transfers: readonly AgentImprovementParityTransfer[];
  readonly manifests: readonly AgentImprovementParityManifestExposure[];
  readonly candidateIds: readonly string[];
  readonly evaluatorEpochIds: readonly string[];
  readonly rawTrialDigests: readonly string[];
  readonly scorePolicyVersions: readonly string[];
  readonly familyOutcomeDigests: readonly string[];
  readonly frontierCandidateIds: readonly string[];
  readonly ablationDigests: readonly string[];
  readonly canaryDisposition: string | null;
  readonly promotionDisposition: string | null;
  readonly rollbackTargetBaselineId: string | null;
  readonly unresolvedEvidenceRefs: readonly string[];
  readonly blockingVetoCodes: readonly string[];
  readonly terminalDecision: AgentImprovementTerminalDecision;
  readonly resumeDecisionDigest: string | null;
}

// ───────────────────────────────────────────────────────────────────
// 3. FAULT AND EXECUTOR EVIDENCE CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type AgentImprovementParityDiffClass =
  | DeepImprovementCommonParityDiffClass
  | 'changed-locus'
  | 'coverage'
  | 'evaluator-epoch'
  | 'lineage'
  | 'resume-continuity'
  | 'transfer';

export type AgentImprovementParityFaultKind =
  | 'artifact'
  | 'authorization'
  | 'canary'
  | 'causal-link'
  | 'changed-locus'
  | 'coverage'
  | 'drop-event'
  | 'duplicate-event'
  | 'evaluator-epoch'
  | 'evaluator-integrity'
  | 'extra-event'
  | 'lineage'
  | 'malformed'
  | 'nondeterministic'
  | 'payload'
  | 'projection'
  | 'promotion'
  | 'receipt'
  | 'reference-digest'
  | 'reorder-event'
  | 'resume-continuity'
  | 'stale'
  | 'telemetry-gap'
  | 'terminal-decision'
  | 'transfer'
  | 'unsupported-version';

export interface AgentImprovementParityFaultInjection {
  readonly path: 'ledger' | 'legacy';
  readonly kind: AgentImprovementParityFaultKind;
  readonly eventIndex: number;
}

export interface AgentImprovementPathEvidence {
  readonly path: 'ledger' | 'legacy';
  readonly implementationKind: 'modeled-legacy-oracle' | 'typed-ledger-pipeline';
  readonly runIndex: number;
  readonly streamDigest: string;
  readonly projectionFingerprint: string;
  readonly observations: readonly AgentImprovementParityEventObservation[];
}

export interface AgentImprovementParityExecutorPair {
  readonly legacy: ParityPathExecutor<AgentImprovementParityReplayState>;
  readonly ledger: ParityPathExecutor<AgentImprovementParityReplayState>;
  readonly evidence: () => readonly AgentImprovementPathEvidence[];
  readonly legacyOracleImplementation: 'modeled-legacy-oracle';
  readonly ledgerImplementation: 'typed-ledger-pipeline';
  readonly commonParityContractId: 'deep-improvement-common-shadow-parity';
  readonly substrateImportsReal: true;
}

export type AgentImprovementParityReplayState = JsonObject & {
  readonly eventIds: string[];
  readonly eventCanonicalJson: string[];
  readonly projectionCanonicalJson: string;
  readonly projectionFingerprint: string;
  readonly observationCanonicalJson: string[];
};

// ───────────────────────────────────────────────────────────────────
// 4. DIFF, RECEIPT, AND MODE-GATE CONTRACTS
// ───────────────────────────────────────────────────────────────────

export interface AgentImprovementParityDiffRecord {
  readonly diffId: string;
  readonly fixtureId: string;
  readonly class: AgentImprovementParityDiffClass;
  readonly eventIndex: number;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly disposition: 'unexplained';
  readonly owner: 'agent-improvement-mode-owner';
  readonly dispositionReason: string;
  readonly trustedStateProof: string;
}

export interface AgentImprovementParityCertificateEvidenceBinding {
  readonly fixtureId: string;
  readonly legacyStreamDigest: string;
  readonly ledgerStreamDigest: string;
  readonly legacyProjectionFingerprint: string;
  readonly ledgerProjectionFingerprint: string;
  readonly caseEvidenceDigest: string;
  readonly referenceSetDigest: string;
  readonly attestationFinalDigests: readonly string[];
}

export interface AgentImprovementModeCertificateBinding {
  readonly bundle: AgentImprovementCertificateBundle;
  readonly certificateDigest: string;
  readonly verificationReceipt: AgentImprovementOfflineVerifierReceipt;
  readonly manifestDigest: string;
  readonly comparatorVersion: string;
  readonly caseSetDigest: string;
  readonly bindingDigest: string;
}

export interface AgentImprovementParityReceipt {
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
  readonly diffDispositions: readonly AgentImprovementParityDiffRecord[];
  readonly parityCertificate: ParityCertificate | null;
  readonly certificateEvidenceBindings:
    readonly AgentImprovementParityCertificateEvidenceBinding[];
  readonly parityCertificateDigest: string | null;
  readonly modeCertificateBinding: AgentImprovementModeCertificateBinding | null;
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

export type AgentImprovementModeGateBlockReasonCode =
  | 'CERTIFICATE_UNVERIFIABLE'
  | 'DIFF_UNEXPLAINED'
  | 'FIXTURE_FAILURE'
  | 'MISSING_RECEIPT'
  | 'NONDETERMINISTIC_REPLAY'
  | 'RECEIPT_MALFORMED'
  | 'RECEIPT_STALE'
  | 'ZERO_FIXTURES';

export interface AgentImprovementModeGateInput {
  readonly schemaVersion: string;
  readonly mode: 'agent-improvement';
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
  readonly blockingReasonCode: AgentImprovementModeGateBlockReasonCode | null;
  readonly gateInputDigest: string;
}

export interface AgentImprovementParityCaseOutcome {
  readonly result: ShadowParityCaseResult;
  readonly receipt: AgentImprovementParityReceipt;
}

export interface AgentImprovementParitySuiteResult {
  readonly manifest: ParityCaseManifest;
  readonly caseResults: readonly ShadowParityCaseResult[];
  readonly receipts: readonly AgentImprovementParityReceipt[];
  readonly certificate: ParityCertificate | null;
  readonly divergence: ParityDivergenceRecord | null;
  readonly modeGateInput: AgentImprovementModeGateInput;
}
