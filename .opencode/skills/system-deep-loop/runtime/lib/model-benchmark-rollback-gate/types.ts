// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Rollback Gate Types
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
  ModelBenchmarkOfflineVerificationInput,
} from '../model-benchmark-certificates/index.js';
import type {
  ModelBenchmarkResumeParityEvidence,
} from '../model-benchmark-shadow-parity/index.js';
import type {
  ModelBenchmarkSealedArtifactBinding,
} from '../model-benchmark-sealed-artifacts/index.js';
import type { SealedArtifactStore } from '../sealed-reference-artifacts/index.js';
import type { ParityCaseManifest } from '../shadow-parity/index.js';

export const MODEL_BENCHMARK_ROLLBACK_GATE_SCHEMA_VERSION = 1;
export const MODEL_BENCHMARK_ROLLBACK_MINIMUM_DAYS = 14;
export const MODEL_BENCHMARK_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS = 5;

export type ModelBenchmarkGateInputKind = DeepImprovementCommonGateInputKind;
export type ModelBenchmarkGateDisposition = DeepImprovementCommonGateDisposition;
export type ModelBenchmarkGateVerdict = DeepImprovementCommonGateVerdict;
export type ModelBenchmarkGateReasonCode = DeepImprovementCommonGateReasonCode
  | 'COMMON_GATE_INVALID'
  | 'MODE_CERTIFICATE_INVALID';

export interface ModelBenchmarkGateInputDisposition {
  readonly input: ModelBenchmarkGateInputKind;
  readonly disposition: ModelBenchmarkGateDisposition;
  readonly reasonCode: ModelBenchmarkGateReasonCode | null;
  readonly evidenceDigest: string | null;
}

export type ModelBenchmarkLifecycleEvidenceKind =
  | 'benchmark-start'
  | 'model-cell'
  | 'score-matrix'
  | 'judge-calibration'
  | 'contamination-check'
  | 'diagnostic-tail'
  | 'selection'
  | 'abort'
  | 'restore'
  | 'replay'
  | 'resume'
  | 'duplicate-delivery'
  | 'unknown-effect';

export interface ModelBenchmarkLifecycleEvidenceRow {
  readonly kind: ModelBenchmarkLifecycleEvidenceKind;
  readonly fixtureId: string;
  readonly eventDigest: string;
  readonly receiptDigest: string;
  readonly status: 'covered';
}

export interface ModelBenchmarkVersionBindings {
  readonly eventEnvelopeVersion: number;
  readonly eventSchemaVersion: string;
  readonly reducerVersion: string;
  readonly projectionVersion: string;
}

export type ModelBenchmarkRollbackWindowExecution =
  DeepImprovementCommonRollbackWindowExecution;
export type ModelBenchmarkRollbackWindowInput =
  DeepImprovementCommonRollbackWindowInput;

export interface ModelBenchmarkRollbackWindowEvaluation
  extends Omit<
    DeepImprovementCommonRollbackWindowEvaluation,
    'minimumCalendarDays' | 'minimumSuccessfulAuthoritativeExecutions'
  > {
  readonly minimumCalendarDays: typeof MODEL_BENCHMARK_ROLLBACK_MINIMUM_DAYS;
  readonly minimumSuccessfulAuthoritativeExecutions:
    typeof MODEL_BENCHMARK_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS;
}

export interface ModelBenchmarkModeMigrationCertificate {
  readonly schemaVersion: typeof MODEL_BENCHMARK_ROLLBACK_GATE_SCHEMA_VERSION;
  readonly certificateKind: 'mode-migration-readiness';
  readonly mode: 'model-benchmark';
  readonly readiness: 'ready-for-phase-014-consideration';
  readonly candidateSha: string;
  readonly baseSha: string;
  // These descriptors are committed here; their authoritative source remains external.
  readonly sharedContractDigest: string;
  readonly writeSetDigest: string;
  readonly versions: ModelBenchmarkVersionBindings;
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly evaluatorEpochId: string;
  readonly canaryEpochId: string;
  readonly matrixProfileId: string;
  readonly matrixDigest: string;
  readonly workloadProfileDigest: string;
  readonly selectionState: 'BLOCKED' | 'INCONCLUSIVE' | 'TIE' | 'WINNER';
  readonly winnerModelId: string | null;
  readonly matrixCoverage: number;
  readonly rankingState: 'blocked' | 'ranked' | 'unranked';
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
  readonly rollbackWindow: ModelBenchmarkRollbackWindowEvaluation;
  readonly dispositions: readonly ModelBenchmarkGateInputDisposition[];
  // An empty list is required locally; completeness belongs to the authoritative risk registry.
  readonly unresolvedRiskIds: readonly string[];
  readonly authorityMutation: false;
  readonly rollbackWindowClosed: false;
  readonly cutoverCertificate: false;
  readonly selectionApplied: false;
  readonly legacyWriterRetired: false;
  readonly certificateDigest: string;
}

export interface ModelBenchmarkParityGateEvidence {
  readonly manifest: ParityCaseManifest;
  readonly modeGateInput: unknown;
  readonly receipts: readonly unknown[];
  readonly authorizationAuditRootDirectory: string;
  readonly authorizationAuditLedgerId: string;
}

export interface ModelBenchmarkSealedGateEvidence {
  readonly store: SealedArtifactStore;
  readonly bindings: readonly ModelBenchmarkSealedArtifactBinding[];
}

export interface ModelBenchmarkCertificateGateEvidence<TState extends JsonObject> {
  readonly verificationInput: ModelBenchmarkOfflineVerificationInput<TState>;
}

export interface ModelBenchmarkModeGateInput<TState extends JsonObject> {
  readonly candidateSha: string;
  readonly baseSha: string;
  readonly sharedContractDigest: string;
  readonly writeSetDigest: string;
  readonly versions: ModelBenchmarkVersionBindings;
  readonly verifierIdentity: string;
  readonly verifierVersion: string;
  readonly authority: AuthoritySnapshot;
  // Common services remain authoritative through their complete, independently evaluated input.
  readonly commonGateInput: DeepImprovementCommonModeGateInput<JsonObject>;
  readonly parity: ModelBenchmarkParityGateEvidence | null;
  readonly sealedArtifacts: ModelBenchmarkSealedGateEvidence | null;
  readonly certificates: ModelBenchmarkCertificateGateEvidence<TState> | null;
  readonly resumeEvidence: ModelBenchmarkResumeParityEvidence | null;
  // Labels classify distinct authenticated identities; they are not dedicated substrate kinds.
  readonly lifecycle: readonly ModelBenchmarkLifecycleEvidenceRow[];
  readonly rollbackWindow: ModelBenchmarkRollbackWindowInput;
  readonly unresolvedRiskIds: readonly string[];
}

export interface ModelBenchmarkModeGateResult {
  readonly verdict: ModelBenchmarkGateVerdict;
  readonly dispositions: readonly ModelBenchmarkGateInputDisposition[];
  readonly certificate: ModelBenchmarkModeMigrationCertificate | null;
}

export type ModelBenchmarkRollbackOperation =
  | 'rollback'
  | 'unquarantine'
  | 'verifier-replacement'
  | 'authority-restoration';

export type ModelBenchmarkDestructiveRollbackIntent =
  | 'none'
  | 'truncate-ledger'
  | 'rewrite-sealed-artifact'
  | 'non-reproduction-proof';

export interface ModelBenchmarkRollbackRequest {
  readonly configurationVersion?: string;
  readonly operation?: ModelBenchmarkRollbackOperation;
  readonly currentAuthority?: AuthoritySnapshot | Readonly<{ state: string; epoch: number }>;
  readonly expectedAuthorityEpoch?: number;
  readonly gateCertificate?: ModelBenchmarkModeMigrationCertificate | null;
  readonly gateInput?: ModelBenchmarkModeGateInput<JsonObject>;
  readonly authorizationRequest?: TransitionAuthorizationRequest;
  readonly rollbackReason?: string;
  readonly admissionState?: 'frozen' | 'open';
  readonly classificationManifest?: InflightClassificationManifest;
  readonly resumeEvidence?: ModelBenchmarkResumeParityEvidence;
  readonly writerResource?: ProtectedResourceIdentity;
  // The tuple is validated and bound; the coordinator proves resource and token supersession.
  readonly staleWriterLease?: FencedLease;
  readonly destructiveIntent?: ModelBenchmarkDestructiveRollbackIntent;
  // Retention values are equality-checked assertions because this adapter has no store-total handle.
  readonly retainedEventCountBefore?: number;
  readonly retainedEventCountAfter?: number;
  readonly retainedArtifactCountBefore?: number;
  readonly retainedArtifactCountAfter?: number;
  readonly rollbackAnchorDigest?: string;
}

export type ModelBenchmarkRollbackDenialReasonCode =
  | 'ABSENT_GATE_CERTIFICATE'
  | 'AUTHORIZATION_DENIED'
  | 'DESTRUCTIVE_ROLLBACK_REJECTED'
  | 'EVIDENCE_INCOMPLETE'
  | 'GATEWAY_FAILURE'
  | 'MISSING_CONFIGURATION'
  | 'STALE_AUTHORITY_EPOCH'
  | 'UNKNOWN_STATE'
  | 'WRITER_FENCE_FAILED';

export interface ModelBenchmarkRollbackCertificate {
  readonly schemaVersion: typeof MODEL_BENCHMARK_ROLLBACK_GATE_SCHEMA_VERSION;
  readonly certificateKind: 'non-destructive-rollback';
  readonly mode: 'model-benchmark';
  readonly operation: ModelBenchmarkRollbackOperation;
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

export interface ModelBenchmarkRollbackDecision {
  readonly disposition: 'authorized' | 'denied';
  readonly authorityState: 'legacy_authoritative';
  readonly ledgerAuthority: 'denied';
  readonly reasonCode: ModelBenchmarkRollbackDenialReasonCode | null;
  readonly gatewayDecisionId: string | null;
  readonly certificate: ModelBenchmarkRollbackCertificate | null;
}

export interface ModelBenchmarkRollbackSwitchOptions {
  readonly gateway: TransitionAuthorizationGateway;
  readonly fencingCoordinator: FencedLeaseCoordinator;
}
