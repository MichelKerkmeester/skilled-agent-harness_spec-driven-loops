// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Rollback Gate Types
// ───────────────────────────────────────────────────────────────────

import type {
  AuthoritySnapshot,
  AuthorityState,
  TransitionAuthorizationGateway,
  TransitionAuthorizationRequest,
} from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonGateDisposition,
  DeepImprovementCommonGateInputKind,
  DeepImprovementCommonGateReasonCode,
  DeepImprovementCommonGateVerdict,
  DeepImprovementCommonModeGateInput,
  DeepImprovementCommonRollbackWindowEvaluation,
  DeepImprovementCommonRollbackWindowExecution,
  DeepImprovementCommonRollbackWindowInput,
} from '../deep-improvement-common-rollback-gate/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type { InflightClassificationManifest } from '../inflight-state-classification/index.js';
import type {
  FencedLease,
  FencedLeaseCoordinator,
  ProtectedResourceIdentity,
} from '../locks-and-fencing/index.js';
import type {
  SkillBenchmarkOfflineVerificationInput,
} from '../skill-benchmark-certificates/index.js';
import type {
  SkillBenchmarkResumeParityEvidence,
} from '../skill-benchmark-shadow-parity/index.js';
import type {
  SkillBenchmarkSealedArtifactBinding,
} from '../skill-benchmark-sealed-artifacts/index.js';
import type { SealedArtifactStore } from '../sealed-reference-artifacts/index.js';
import type { ParityCaseManifest } from '../shadow-parity/index.js';

export const SKILL_BENCHMARK_ROLLBACK_GATE_SCHEMA_VERSION = 1;
export const SKILL_BENCHMARK_ROLLBACK_MINIMUM_DAYS = 14;
export const SKILL_BENCHMARK_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS = 5;

export type SkillBenchmarkGateInputKind = DeepImprovementCommonGateInputKind;
export type SkillBenchmarkGateDisposition = DeepImprovementCommonGateDisposition;
export type SkillBenchmarkGateVerdict = DeepImprovementCommonGateVerdict;
export type SkillBenchmarkGateReasonCode = DeepImprovementCommonGateReasonCode
  | 'COMMON_GATE_INVALID'
  | 'MODE_CERTIFICATE_INVALID';

export interface SkillBenchmarkGateInputDisposition {
  readonly input: SkillBenchmarkGateInputKind;
  readonly disposition: SkillBenchmarkGateDisposition;
  readonly reasonCode: SkillBenchmarkGateReasonCode | null;
  readonly evidenceDigest: string | null;
}

export type SkillBenchmarkLifecycleEvidenceKind =
  | 'benchmark-design'
  | 'treatment-assignment'
  | 'skill-discovery'
  | 'skill-loading'
  | 'skill-invocation'
  | 'resource-exposure'
  | 'trajectory-outcome'
  | 'gold-scoring'
  | 'compatibility-security'
  | 'effect-certificate'
  | 'abort'
  | 'restore'
  | 'replay'
  | 'resume'
  | 'duplicate-delivery'
  | 'unknown-effect';

export interface SkillBenchmarkLifecycleEvidenceRow {
  readonly kind: SkillBenchmarkLifecycleEvidenceKind;
  readonly fixtureId: string;
  readonly eventDigest: string;
  readonly receiptDigest: string;
  readonly status: 'covered';
}

export interface SkillBenchmarkVersionBindings {
  readonly eventEnvelopeVersion: number;
  readonly eventSchemaVersion: string;
  readonly reducerVersion: string;
  readonly projectionVersion: string;
}

export type SkillBenchmarkRollbackWindowExecution =
  DeepImprovementCommonRollbackWindowExecution;
export type SkillBenchmarkRollbackWindowInput =
  DeepImprovementCommonRollbackWindowInput;

export interface SkillBenchmarkRollbackWindowEvaluation
  extends Omit<
    DeepImprovementCommonRollbackWindowEvaluation,
    'minimumCalendarDays' | 'minimumSuccessfulAuthoritativeExecutions'
  > {
  readonly minimumCalendarDays: typeof SKILL_BENCHMARK_ROLLBACK_MINIMUM_DAYS;
  readonly minimumSuccessfulAuthoritativeExecutions:
    typeof SKILL_BENCHMARK_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS;
}

export interface SkillBenchmarkModeMigrationCertificate {
  readonly schemaVersion: typeof SKILL_BENCHMARK_ROLLBACK_GATE_SCHEMA_VERSION;
  readonly certificateKind: 'mode-migration-readiness';
  readonly mode: 'skill-benchmark';
  readonly readiness: 'ready-for-phase-014-consideration';
  readonly candidateSha: string;
  readonly baseSha: string;
  // These descriptors are committed here; their authoritative source remains external.
  readonly sharedContractDigest: string;
  readonly writeSetDigest: string;
  readonly versions: SkillBenchmarkVersionBindings;
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly evaluatorEpochId: string;
  readonly canaryEpochId: string;
  readonly benchmarkDesignId: string;
  readonly designDigest: string;
  readonly taskSetDigest: string;
  readonly skillBundleDigest: string;
  readonly registryDigest: string;
  readonly executorDigest: string;
  readonly environmentDigest: string;
  readonly dependencyDigest: string;
  readonly workloadDigest: string;
  readonly disposition: 'PASS';
  readonly requiredScenarioCount: number;
  readonly assignedScenarioCount: number;
  readonly acceptedGoldScenarioCount: number;
  readonly treatmentArms: readonly string[];
  readonly evidenceSetDigest: string;
  readonly validityDomainDigest: string;
  readonly fixtureIds: readonly string[];
  readonly streamDigests: readonly string[];
  readonly artifactDigests: readonly string[];
  readonly receiptDigests: readonly string[];
  readonly runCertificateDigest: string;
  readonly commonGateCertificateDigest: string;
  readonly commonRunCertificateDigest: string;
  readonly replayFingerprint: string;
  readonly projectionIntegrityDigest: string;
  readonly receiptChainDigest: string;
  readonly artifactSetDigest: string;
  readonly verifierIdentity: string;
  readonly verifierVersion: string;
  readonly authorityState: 'legacy_authoritative';
  readonly authorityEpoch: number;
  readonly rollbackAnchorDigest: string;
  // The window is structurally checked and deduplicated; historical origin is correlated later.
  readonly rollbackWindow: SkillBenchmarkRollbackWindowEvaluation;
  readonly dispositions: readonly SkillBenchmarkGateInputDisposition[];
  // An empty list is required locally; completeness belongs to the authoritative risk registry.
  readonly unresolvedRiskIds: readonly string[];
  readonly authorityMutation: false;
  readonly rollbackWindowClosed: false;
  readonly cutoverCertificate: false;
  readonly effectCertificateApplied: false;
  readonly legacyWriterRetired: false;
  readonly certificateDigest: string;
}

export interface SkillBenchmarkParityGateEvidence {
  readonly manifest: ParityCaseManifest;
  readonly modeGateInput: unknown;
  readonly receipts: readonly unknown[];
  readonly authorizationAuditRootDirectory: string;
  readonly authorizationAuditLedgerId: string;
}

export interface SkillBenchmarkSealedGateEvidence {
  readonly store: SealedArtifactStore;
  readonly bindings: readonly SkillBenchmarkSealedArtifactBinding[];
}

export interface SkillBenchmarkCertificateGateEvidence<TState extends JsonObject> {
  readonly verificationInput: SkillBenchmarkOfflineVerificationInput<TState>;
}

export interface SkillBenchmarkModeGateInput<TState extends JsonObject> {
  readonly candidateSha: string;
  readonly baseSha: string;
  readonly sharedContractDigest: string;
  readonly writeSetDigest: string;
  readonly versions: SkillBenchmarkVersionBindings;
  readonly verifierIdentity: string;
  readonly verifierVersion: string;
  readonly authority: AuthoritySnapshot;
  // Common services remain authoritative through their complete, independently evaluated input.
  readonly commonGateInput: DeepImprovementCommonModeGateInput<JsonObject>;
  readonly parity: SkillBenchmarkParityGateEvidence | null;
  readonly sealedArtifacts: SkillBenchmarkSealedGateEvidence | null;
  readonly certificates: SkillBenchmarkCertificateGateEvidence<TState> | null;
  readonly resumeEvidence: SkillBenchmarkResumeParityEvidence | null;
  // Labels classify authenticated identities; the substrate has no dedicated lifecycle-kind handle.
  readonly lifecycle: readonly SkillBenchmarkLifecycleEvidenceRow[];
  readonly rollbackWindow: SkillBenchmarkRollbackWindowInput;
  readonly unresolvedRiskIds: readonly string[];
}

export interface SkillBenchmarkModeGateResult {
  readonly verdict: SkillBenchmarkGateVerdict;
  readonly dispositions: readonly SkillBenchmarkGateInputDisposition[];
  readonly certificate: SkillBenchmarkModeMigrationCertificate | null;
}

export type SkillBenchmarkRollbackOperation =
  | 'rollback'
  | 'unquarantine'
  | 'verifier-replacement'
  | 'authority-restoration';

export type SkillBenchmarkDestructiveRollbackIntent =
  | 'none'
  | 'truncate-ledger'
  | 'rewrite-sealed-artifact'
  | 'non-reproduction-proof';

export interface SkillBenchmarkRollbackRequest {
  readonly configurationVersion?: string;
  readonly operation?: SkillBenchmarkRollbackOperation;
  readonly currentAuthority?: AuthoritySnapshot | Readonly<{ state: string; epoch: number }>;
  readonly expectedAuthorityEpoch?: number;
  readonly gateCertificate?: SkillBenchmarkModeMigrationCertificate | null;
  readonly gateInput?: SkillBenchmarkModeGateInput<JsonObject>;
  readonly authorizationRequest?: TransitionAuthorizationRequest;
  readonly rollbackReason?: string;
  readonly admissionState?: 'frozen' | 'open';
  readonly classificationManifest?: InflightClassificationManifest;
  readonly resumeEvidence?: SkillBenchmarkResumeParityEvidence;
  readonly writerResource?: ProtectedResourceIdentity;
  // The tuple is validated and bound; the coordinator proves ownership and token supersession.
  readonly staleWriterLease?: FencedLease;
  readonly destructiveIntent?: SkillBenchmarkDestructiveRollbackIntent;
  // Retention values are equality-checked assertions because this adapter has no store-total handle.
  readonly retainedEventCountBefore?: number;
  readonly retainedEventCountAfter?: number;
  readonly retainedArtifactCountBefore?: number;
  readonly retainedArtifactCountAfter?: number;
  readonly rollbackAnchorDigest?: string;
}

export type SkillBenchmarkRollbackDenialReasonCode =
  | 'ABSENT_GATE_CERTIFICATE'
  | 'AUTHORIZATION_DENIED'
  | 'DESTRUCTIVE_ROLLBACK_REJECTED'
  | 'EVIDENCE_INCOMPLETE'
  | 'GATEWAY_FAILURE'
  | 'MISSING_CONFIGURATION'
  | 'STALE_AUTHORITY_EPOCH'
  | 'UNKNOWN_STATE'
  | 'WRITER_FENCE_FAILED';

export interface SkillBenchmarkRollbackCertificate {
  readonly schemaVersion: typeof SKILL_BENCHMARK_ROLLBACK_GATE_SCHEMA_VERSION;
  readonly certificateKind: 'non-destructive-rollback';
  readonly mode: 'skill-benchmark';
  readonly operation: SkillBenchmarkRollbackOperation;
  readonly policyVersion: string;
  readonly decisionId: string;
  readonly requestDigest: string;
  readonly evidenceDigest: string;
  readonly rollbackReason: string;
  readonly fromAuthorityState: AuthorityState;
  readonly fromAuthorityEpoch: number;
  readonly restoredAuthorityState: 'legacy_authoritative';
  readonly restoredAuthorityEpoch: number;
  readonly writerFenceToken: number;
  readonly writerResourceDigest: string;
  readonly classificationDigest: string;
  readonly resumeEvidenceDigest: string;
  readonly rollbackAnchorDigest: string;
  readonly retainedEventCount: number;
  readonly retainedArtifactCount: number;
  readonly admissionFrozen: true;
  readonly staleWriterDenied: true;
  readonly eventDeletionCount: 0;
  readonly artifactRewriteCount: 0;
  readonly authorityMutation: false;
  readonly phase014RestorationRequired: true;
  readonly certificateDigest: string;
}

export interface SkillBenchmarkRollbackDecision {
  readonly disposition: 'authorized' | 'denied';
  readonly authorityState: 'legacy_authoritative';
  readonly ledgerAuthority: 'denied';
  readonly reasonCode: SkillBenchmarkRollbackDenialReasonCode | null;
  readonly gatewayDecisionId: string | null;
  readonly certificate: SkillBenchmarkRollbackCertificate | null;
}

export interface SkillBenchmarkRollbackSwitchOptions {
  readonly gateway: TransitionAuthorizationGateway;
  readonly fencingCoordinator: FencedLeaseCoordinator;
}
