// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Shadow Parity Types
// ───────────────────────────────────────────────────────────────────

import type {
  SkillBenchmarkCertificateBundle,
  SkillBenchmarkOfflineVerificationInput,
  SkillBenchmarkOfflineVerifierReceipt,
} from '../skill-benchmark-certificates/index.js';
import type {
  SkillBenchmarkEventStem,
  SkillBenchmarkLedgerEvent,
  SkillBenchmarkWireEventType,
} from '../skill-benchmark-ledger-schema/index.js';
import type {
  SkillBenchmarkResumeDecision,
  SkillBenchmarkResumeRequest,
} from '../skill-benchmark-resume-adapter/index.js';
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

export type SkillBenchmarkParityFixtureScenario =
  | 'no-skill'
  | 'full-skill'
  | 'distractor'
  | 'skill-md-only'
  | 'references-ablated'
  | 'scripts-ablated'
  | 'compatibility-boundary'
  | 'negative-control'
  | 'pending-gold'
  | 'structural-only-gold'
  | 'score-policy-change'
  | 'replay'
  | 'resume'
  | 'duplicate-delivery'
  | 'quarantine-priority'
  | 'shared-service-veto'
  | 'certificate-withheld';

export type SkillBenchmarkLifecycleStage =
  | 'run'
  | 'design'
  | 'assignment'
  | 'scenario'
  | 'discovery'
  | 'loading'
  | 'invocation'
  | 'exposure'
  | 'trajectory'
  | 'observation'
  | 'scoring'
  | 'gold'
  | 'compatibility'
  | 'diagnostic'
  | 'certificate'
  | 'shared-service'
  | 'resume'
  | 'terminal';

export interface SkillBenchmarkLifecycleEventMapping {
  readonly wireEventType: SkillBenchmarkWireEventType;
  readonly lifecycleStage: SkillBenchmarkLifecycleStage;
  readonly stepKey: string;
  readonly sharedService: boolean;
}

export interface SkillBenchmarkBudgetLeaseInput {
  readonly leaseId: string;
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly maxIterations: number;
  readonly remainingIterations: number;
  readonly deadlineAt: string;
}

export interface SkillBenchmarkFrozenParityInput {
  readonly baseSha: string;
  readonly runManifestDigest: string;
  readonly scenarioManifestDigest: string;
  readonly treatmentMatrixDigest: string;
  readonly taskSetDigest: string;
  readonly skillBundleDigest: string;
  readonly registryDigest: string;
  readonly executorDescriptorDigest: string;
  readonly environmentDigest: string;
  readonly toolDigest: string;
  readonly permissionDigest: string;
  readonly dependencyDigest: string;
  readonly goldSnapshotDigest: string;
  readonly seedPolicyDigest: string;
  readonly evaluatorEpochDigest: string;
  readonly scoringPolicyDigest: string;
  readonly commonServiceContractDigest: string;
  readonly sealedArtifactContractDigest: string;
  readonly initialStateDigest: string;
  readonly configurationDigest: string;
  readonly budgetLease: SkillBenchmarkBudgetLeaseInput;
}

export interface SkillBenchmarkLegacyResumeSnapshot {
  readonly events: readonly SkillBenchmarkLedgerEvent[];
  readonly decision: SkillBenchmarkResumeDecision;
  readonly freshProjection: SkillBenchmarkParityProjection;
}

export interface SkillBenchmarkLegacyResumeOracleResult {
  readonly decision: SkillBenchmarkResumeDecision;
  readonly eventTail: Readonly<{
    streamId: string;
    streamSequence: number;
    eventCount: number;
  }>;
  readonly freshProjection: SkillBenchmarkParityProjection;
}

export interface SkillBenchmarkLegacyResumeOracle {
  resume(request: SkillBenchmarkResumeRequest): Promise<SkillBenchmarkLegacyResumeOracleResult>;
}

export interface SkillBenchmarkResumeParityEvidence {
  readonly legacyDecision: SkillBenchmarkResumeDecision;
  readonly ledgerDecision: SkillBenchmarkResumeDecision;
  readonly legacyEventTailDigest: string;
  readonly ledgerEventTailDigest: string;
  readonly legacyFreshProjectionFingerprint: string;
  readonly ledgerFreshProjectionFingerprint: string;
}

export interface SkillBenchmarkParityFixture {
  readonly fixtureId: string;
  readonly scenario: SkillBenchmarkParityFixtureScenario;
  readonly frozenInput: SkillBenchmarkFrozenParityInput;
  readonly events: readonly SkillBenchmarkLedgerEvent[];
  readonly expectedTerminalDecision: SkillBenchmarkTerminalDecision;
  readonly resumeEvidence: SkillBenchmarkResumeParityEvidence | null;
  readonly commonParityReceiptDigest: string;
}

export interface SkillBenchmarkModeCertificateVerification {
  readonly input: SkillBenchmarkOfflineVerificationInput<JsonObject>;
}

export interface SkillBenchmarkParityCaseRun {
  readonly caseDefinition: ParityCaseDefinition;
  readonly legacyBoundary: ParitySealedInputBoundary;
  readonly ledgerBoundary: ParitySealedInputBoundary;
  readonly fixture: SkillBenchmarkParityFixture;
  readonly executors: SkillBenchmarkParityExecutorPair;
  readonly modeCertificateVerification: SkillBenchmarkModeCertificateVerification;
  readonly shadowRootDirectory: string;
  readonly protectedRoots: readonly string[];
  readonly deterministicRuns?: number;
}

export type SkillBenchmarkTerminalDecision =
  | 'active'
  | 'aborted'
  | 'blocked'
  | 'completed'
  | 'inconclusive'
  | 'paused'
  | 'quarantined'
  | 'selection-prepared';

export interface SkillBenchmarkLogicalEventIdentity {
  readonly eventStem: SkillBenchmarkEventStem;
  readonly runId: string;
  readonly lineageId: string;
  readonly benchmarkDesignId: string | null;
  readonly scenarioId: string | null;
  readonly assignmentId: string | null;
  readonly executionId: string | null;
  readonly skillBundleId: string | null;
  readonly resourceId: string | null;
  readonly milestoneId: string | null;
  readonly observationId: string | null;
  readonly certificateId: string | null;
  readonly logicalStep: string;
  readonly producerSequence: number;
}

export interface SkillBenchmarkParityEventObservation {
  readonly eventId: string;
  readonly eventType: SkillBenchmarkWireEventType;
  readonly logicalIdentity: SkillBenchmarkLogicalEventIdentity;
  readonly stepKey: string;
  readonly producerSequence: number;
  readonly causalLogicalIdentity: string | null;
  readonly stablePayloadDigest: string;
  readonly projectionFingerprint: string;
  readonly receiptRefs: readonly string[];
  readonly artifactRefs: readonly string[];
  readonly sharedServiceRefs: readonly string[];
  readonly treatmentRefs: readonly string[];
  readonly availabilityRefs: readonly string[];
  readonly invocationRefs: readonly string[];
  readonly exposureRefs: readonly string[];
  readonly trajectoryRefs: readonly string[];
  readonly outcomeRefs: readonly string[];
  readonly scoreRefs: readonly string[];
  readonly goldRefs: readonly string[];
  readonly costRefs: readonly string[];
  readonly compatibilityRefs: readonly string[];
  readonly securityProbeRefs: readonly string[];
  readonly authorizationRefs: readonly string[];
  readonly terminalDecision: SkillBenchmarkTerminalDecision | null;
}

export interface SkillBenchmarkVolatilityAllowance {
  readonly field: 'correlation_id' | 'occurred_at' | 'recorded_at';
  readonly valueKind: 'iso-timestamp' | 'transport-token';
  readonly owner: 'skill-benchmark-shadow-parity';
  readonly volatilityReason: string;
  readonly semanticIdentity: false;
}

export interface SkillBenchmarkParityCell {
  readonly scenarioId: string;
  readonly assignmentId: string;
  readonly executionId: string | null;
  readonly treatmentArm: string;
  readonly pairedReplicateId: string;
  readonly disposition: string;
  readonly sourceEventId: string;
  readonly availabilityDigest: string | null;
  readonly invocationDigest: string | null;
  readonly exposureDigest: string | null;
  readonly trajectoryDigest: string | null;
  readonly outcomeDigest: string | null;
  readonly scoreDigest: string | null;
  readonly goldDigest: string | null;
  readonly costDigest: string | null;
}

export interface SkillBenchmarkParityProjection {
  readonly runId: string | null;
  readonly lineageId: string | null;
  readonly generation: number;
  readonly runState: string;
  readonly designIds: readonly string[];
  readonly cells: readonly SkillBenchmarkParityCell[];
  readonly availabilityEvidenceDigests: readonly string[];
  readonly invocationEvidenceDigests: readonly string[];
  readonly exposureEvidenceDigests: readonly string[];
  readonly milestoneEvidenceDigests: readonly string[];
  readonly trajectoryEvidenceDigests: readonly string[];
  readonly outcomeEvidenceDigests: readonly string[];
  readonly scorePolicyVersions: readonly string[];
  readonly scoreVectorDigests: readonly string[];
  readonly goldEvidenceDigests: readonly string[];
  readonly costEvidenceDigests: readonly string[];
  readonly compatibilityEvidenceDigests: readonly string[];
  readonly negativeTransferEvidenceDigests: readonly string[];
  readonly securityProbeEvidenceDigests: readonly string[];
  readonly certificateEvidenceDigests: readonly string[];
  readonly sharedServiceRefs: readonly string[];
  readonly unresolvedEvidenceRefs: readonly string[];
  readonly blockingVetoCodes: readonly string[];
  readonly treatmentCoverage: number;
  readonly scoringState: string;
  readonly terminalDecision: SkillBenchmarkTerminalDecision;
  readonly resumeDecisionDigest: string | null;
}

export type SkillBenchmarkParityDiffClass =
  | DeepImprovementCommonParityDiffClass
  | 'input-inequality'
  | 'treatment'
  | 'availability'
  | 'invocation'
  | 'exposure'
  | 'trajectory'
  | 'outcome'
  | 'score'
  | 'gold'
  | 'cost'
  | 'compatibility'
  | 'security-probe'
  | 'quarantine-priority'
  | 'shared-reference'
  | 'resume-continuity';

export type SkillBenchmarkParityFaultKind =
  | 'artifact'
  | 'authorization'
  | 'availability'
  | 'causal-link'
  | 'compatibility'
  | 'cost'
  | 'drop-event'
  | 'duplicate-event'
  | 'exposure'
  | 'extra-event'
  | 'gold'
  | 'input-inequality'
  | 'invocation'
  | 'malformed'
  | 'nondeterministic'
  | 'outcome'
  | 'payload'
  | 'projection'
  | 'quarantine-priority'
  | 'receipt'
  | 'reference-digest'
  | 'reorder-event'
  | 'resume-continuity'
  | 'score'
  | 'security-probe'
  | 'shared-reference'
  | 'stale'
  | 'telemetry-gap'
  | 'terminal-decision'
  | 'trajectory'
  | 'treatment'
  | 'unauthorized'
  | 'unsupported-version';

export interface SkillBenchmarkParityFaultInjection {
  readonly path: 'ledger' | 'legacy';
  readonly kind: SkillBenchmarkParityFaultKind;
  readonly eventIndex: number;
}

export interface SkillBenchmarkPathEvidence {
  readonly path: 'ledger' | 'legacy';
  readonly implementationKind: 'modeled-legacy-oracle' | 'typed-ledger-pipeline';
  readonly runIndex: number;
  readonly streamDigest: string;
  readonly projectionFingerprint: string;
  readonly observations: readonly SkillBenchmarkParityEventObservation[];
}

export interface SkillBenchmarkParityExecutorPair {
  readonly legacy: ParityPathExecutor<SkillBenchmarkParityReplayState>;
  readonly ledger: ParityPathExecutor<SkillBenchmarkParityReplayState>;
  readonly evidence: () => readonly SkillBenchmarkPathEvidence[];
  readonly legacyOracleImplementation: 'modeled-legacy-oracle';
  readonly ledgerImplementation: 'typed-ledger-pipeline';
  readonly commonParityContractId: 'deep-improvement-common-shadow-parity';
  readonly substrateImportsReal: true;
}

export type SkillBenchmarkParityReplayState = JsonObject & {
  readonly eventIds: string[];
  readonly eventCanonicalJson: string[];
  readonly projectionCanonicalJson: string;
  readonly projectionFingerprint: string;
  readonly observationCanonicalJson: string[];
};

export interface SkillBenchmarkParityDiffRecord {
  readonly diffId: string;
  readonly fixtureId: string;
  readonly class: SkillBenchmarkParityDiffClass;
  readonly eventIndex: number;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly disposition: 'unexplained';
  readonly owner: 'skill-benchmark-mode-owner';
  readonly dispositionReason: string;
  readonly trustedStateProof: string;
}

export interface SkillBenchmarkParityCertificateEvidenceBinding {
  readonly fixtureId: string;
  readonly legacyStreamDigest: string;
  readonly ledgerStreamDigest: string;
  readonly legacyProjectionFingerprint: string;
  readonly ledgerProjectionFingerprint: string;
  readonly caseEvidenceDigest: string;
  readonly referenceSetDigest: string;
  readonly attestationFinalDigests: readonly string[];
}

export interface SkillBenchmarkModeCertificateBinding {
  readonly bundle: SkillBenchmarkCertificateBundle;
  readonly certificateDigest: string;
  readonly verificationReceipt: SkillBenchmarkOfflineVerifierReceipt;
  readonly manifestDigest: string;
  readonly comparatorVersion: string;
  readonly caseSetDigest: string;
  readonly bindingDigest: string;
}

export interface SkillBenchmarkParityReceipt {
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
  readonly diffDispositions: readonly SkillBenchmarkParityDiffRecord[];
  readonly parityCertificate: ParityCertificate | null;
  readonly certificateEvidenceBindings: readonly SkillBenchmarkParityCertificateEvidenceBinding[];
  readonly parityCertificateDigest: string | null;
  readonly modeCertificateBinding: SkillBenchmarkModeCertificateBinding | null;
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

export type SkillBenchmarkModeGateBlockReasonCode =
  | 'CERTIFICATE_UNVERIFIABLE'
  | 'DIFF_UNEXPLAINED'
  | 'FIXTURE_FAILURE'
  | 'MISSING_RECEIPT'
  | 'NONDETERMINISTIC_REPLAY'
  | 'RECEIPT_MALFORMED'
  | 'RECEIPT_STALE'
  | 'ZERO_FIXTURES';

export interface SkillBenchmarkModeGateInput {
  readonly schemaVersion: string;
  readonly mode: 'skill-benchmark';
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
  readonly blockingReasonCode: SkillBenchmarkModeGateBlockReasonCode | null;
  readonly gateInputDigest: string;
}

export interface SkillBenchmarkParityCaseOutcome {
  readonly result: ShadowParityCaseResult;
  readonly receipt: SkillBenchmarkParityReceipt;
}

export interface SkillBenchmarkParitySuiteResult {
  readonly manifest: ParityCaseManifest;
  readonly caseResults: readonly ShadowParityCaseResult[];
  readonly receipts: readonly SkillBenchmarkParityReceipt[];
  readonly certificate: ParityCertificate | null;
  readonly divergence: ParityDivergenceRecord | null;
  readonly modeGateInput: SkillBenchmarkModeGateInput;
}
