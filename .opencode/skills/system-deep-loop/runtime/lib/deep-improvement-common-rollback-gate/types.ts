// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Rollback Gate Types
// ───────────────────────────────────────────────────────────────────

import type {
  AuthoritySnapshot,
  AuthorityState,
  TransitionAuthorizationGateway,
  TransitionAuthorizationRequest,
} from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonOfflineVerificationInput,
} from '../deep-improvement-common-certificates/index.js';
import type {
  DeepImprovementCommonResumeParityEvidence,
} from '../deep-improvement-common-shadow-parity/index.js';
import type {
  DeepImprovementCommonSealedArtifactBinding,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type { HealthAggregate } from '../health-degeneration-harness/index.js';
import type { InflightClassificationManifest } from '../inflight-state-classification/index.js';
import type {
  FencedLease,
  FencedLeaseCoordinator,
  ProtectedResourceIdentity,
} from '../locks-and-fencing/index.js';
import type { Phase014RollbackEvidenceInput } from '../rollback-drills/index.js';
import type { SealedArtifactStore } from '../sealed-reference-artifacts/index.js';
import type { ParityCaseManifest } from '../shadow-parity/index.js';

export const DEEP_IMPROVEMENT_COMMON_ROLLBACK_GATE_SCHEMA_VERSION = 1;
export const DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_DAYS = 14;
export const DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS = 5;

export type DeepImprovementCommonGateInputKind =
  | 'shadow_parity'
  | 'sealed_artifacts'
  | 'certificates_receipts'
  | 'lifecycle_resume'
  | 'rollback_readiness';

export type DeepImprovementCommonGateDisposition =
  | 'ready'
  | 'blocked'
  | 'not_ready'
  | 'rollback_required';

export type DeepImprovementCommonGateVerdict =
  | 'pass'
  | 'blocked'
  | 'not_ready'
  | 'rollback_required';

export type DeepImprovementCommonGateReasonCode =
  | 'AUTHORIZED_PARITY_EVIDENCE_MISSING'
  | 'CERTIFICATE_RECEIPT_INVALID'
  | 'EVIDENCE_CONTRADICTORY'
  | 'EVIDENCE_MALFORMED'
  | 'EVIDENCE_MISSING'
  | 'EVIDENCE_STALE'
  | 'HEALTH_NOT_GREEN'
  | 'LIFECYCLE_INCOMPLETE'
  | 'PARITY_INVALID'
  | 'REPLAY_NONDETERMINISTIC'
  | 'RESUME_INVALID'
  | 'ROLLBACK_REHEARSAL_INVALID'
  | 'SEALED_ARTIFACT_INVALID'
  | 'UNRESOLVED_RISK';

export interface DeepImprovementCommonGateInputDisposition {
  readonly input: DeepImprovementCommonGateInputKind;
  readonly disposition: DeepImprovementCommonGateDisposition;
  readonly reasonCode: DeepImprovementCommonGateReasonCode | null;
  readonly evidenceDigest: string | null;
}

export type DeepImprovementCommonLifecycleEvidenceKind =
  | 'evaluator-epoch'
  | 'candidate-lineage'
  | 'raw-evaluation'
  | 'score-normalization'
  | 'canary-execution'
  | 'guarded-promotion'
  | 'abort'
  | 'restore'
  | 'replay'
  | 'resume'
  | 'duplicate-delivery'
  | 'unknown-effect'
  | 'incomplete-evidence';

export interface DeepImprovementCommonLifecycleEvidenceRow {
  readonly kind: DeepImprovementCommonLifecycleEvidenceKind;
  readonly fixtureId: string;
  readonly eventDigest: string;
  readonly receiptDigest: string;
  readonly status: 'covered';
}

export interface DeepImprovementCommonVersionBindings {
  readonly eventEnvelopeVersion: number;
  readonly eventSchemaVersion: string;
  readonly reducerVersion: string;
  readonly projectionVersion: string;
}

export interface DeepImprovementCommonRollbackWindowExecution {
  readonly executionId: string;
  readonly authorityState: AuthorityState;
  readonly authorityEpoch: number;
  readonly result: 'trusted-completion' | 'blocked' | 'failed' | 'incomplete' | 'abstained';
  readonly certificateDigest: string;
}

export interface DeepImprovementCommonRollbackWindowInput {
  readonly openedAt: string;
  readonly evaluatedAt: string;
  readonly executions: readonly DeepImprovementCommonRollbackWindowExecution[];
  readonly unresolvedEvidenceCount: number;
  readonly lowTraffic: boolean;
}

export interface DeepImprovementCommonRollbackWindowEvaluation {
  readonly state: 'open' | 'extended' | 'eligible_to_close';
  readonly elapsedCalendarDays: number;
  readonly successfulAuthoritativeExecutions: number;
  readonly minimumCalendarDays: typeof DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_DAYS;
  readonly minimumSuccessfulAuthoritativeExecutions:
    typeof DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS;
  readonly unresolvedEvidenceCount: number;
  readonly lowTraffic: boolean;
  readonly windowClosed: false;
  readonly evaluationDigest: string;
}

export interface DeepImprovementCommonModeMigrationCertificate {
  readonly schemaVersion: typeof DEEP_IMPROVEMENT_COMMON_ROLLBACK_GATE_SCHEMA_VERSION;
  readonly certificateKind: 'mode-migration-readiness';
  readonly mode: 'deep-improvement-common';
  readonly readiness: 'ready-for-phase-014-consideration';
  readonly candidateSha: string;
  readonly baseSha: string;
  readonly sharedContractDigest: string;
  readonly writeSetDigest: string;
  readonly versions: DeepImprovementCommonVersionBindings;
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly evaluatorEpochId: string;
  readonly candidateId: string;
  readonly baselineId: string;
  readonly canaryEpochId: string;
  readonly fixtureIds: readonly string[];
  readonly streamDigests: readonly string[];
  readonly artifactDigests: readonly string[];
  readonly receiptDigests: readonly string[];
  readonly runCertificateDigest: string;
  readonly replayFingerprint: string;
  readonly projectionIntegrityDigest: string;
  readonly receiptChainDigest: string;
  readonly artifactSetDigest: string;
  readonly verifierIdentity: string;
  readonly verifierVersion: string;
  readonly authorityState: 'legacy_authoritative';
  readonly authorityEpoch: number;
  readonly rollbackAnchorDigest: string;
  readonly rollbackWindow: DeepImprovementCommonRollbackWindowEvaluation;
  readonly dispositions: readonly DeepImprovementCommonGateInputDisposition[];
  readonly unresolvedRiskIds: readonly string[];
  readonly authorityMutation: false;
  readonly rollbackWindowClosed: false;
  readonly cutoverCertificate: false;
  readonly certificateDigest: string;
}

export interface DeepImprovementCommonParityGateEvidence {
  readonly manifest: ParityCaseManifest;
  readonly modeGateInput: unknown;
  readonly receipts: readonly unknown[];
  readonly authorizationAuditRootDirectory: string;
  readonly authorizationAuditLedgerId: string;
}

export interface DeepImprovementCommonSealedGateEvidence {
  readonly store: SealedArtifactStore;
  readonly bindings: readonly DeepImprovementCommonSealedArtifactBinding[];
}

export interface DeepImprovementCommonCertificateGateEvidence<TState extends JsonObject> {
  readonly verificationInput: DeepImprovementCommonOfflineVerificationInput<TState>;
}

export interface DeepImprovementCommonRollbackGateEvidence {
  readonly phase014Evidence: Phase014RollbackEvidenceInput;
  readonly classificationManifest: InflightClassificationManifest;
  readonly healthAggregate: HealthAggregate;
  readonly rollbackAnchorDigest: string;
}

export interface DeepImprovementCommonModeGateInput<TState extends JsonObject> {
  readonly candidateSha: string;
  readonly baseSha: string;
  readonly sharedContractDigest: string;
  readonly writeSetDigest: string;
  readonly versions: DeepImprovementCommonVersionBindings;
  readonly verifierIdentity: string;
  readonly verifierVersion: string;
  readonly authority: AuthoritySnapshot;
  readonly parity: DeepImprovementCommonParityGateEvidence | null;
  readonly sealedArtifacts: DeepImprovementCommonSealedGateEvidence | null;
  readonly certificates: DeepImprovementCommonCertificateGateEvidence<TState> | null;
  readonly resumeEvidence: DeepImprovementCommonResumeParityEvidence | null;
  readonly lifecycle: readonly DeepImprovementCommonLifecycleEvidenceRow[];
  readonly rollback: DeepImprovementCommonRollbackGateEvidence | null;
  readonly rollbackWindow: DeepImprovementCommonRollbackWindowInput;
  readonly unresolvedRiskIds: readonly string[];
}

export interface DeepImprovementCommonModeGateResult {
  readonly verdict: DeepImprovementCommonGateVerdict;
  readonly dispositions: readonly DeepImprovementCommonGateInputDisposition[];
  readonly certificate: DeepImprovementCommonModeMigrationCertificate | null;
}

export type DeepImprovementCommonRollbackOperation =
  | 'rollback'
  | 'unquarantine'
  | 'verifier-replacement'
  | 'authority-restoration';

export type DeepImprovementCommonDestructiveRollbackIntent =
  | 'none'
  | 'truncate-ledger'
  | 'rewrite-sealed-artifact'
  | 'non-reproduction-proof';

export interface DeepImprovementCommonRollbackRequest {
  readonly configurationVersion?: string;
  readonly operation?: DeepImprovementCommonRollbackOperation;
  readonly currentAuthority?: AuthoritySnapshot | Readonly<{ state: string; epoch: number }>;
  readonly expectedAuthorityEpoch?: number;
  readonly gateCertificate?: DeepImprovementCommonModeMigrationCertificate | null;
  readonly gateInput?: DeepImprovementCommonModeGateInput<JsonObject>;
  readonly authorizationRequest?: TransitionAuthorizationRequest;
  readonly rollbackReason?: string;
  readonly admissionState?: 'frozen' | 'open';
  readonly classificationManifest?: InflightClassificationManifest;
  readonly resumeEvidence?: DeepImprovementCommonResumeParityEvidence;
  readonly writerResource?: ProtectedResourceIdentity;
  readonly staleWriterLease?: FencedLease;
  readonly destructiveIntent?: DeepImprovementCommonDestructiveRollbackIntent;
  readonly retainedEventCountBefore?: number;
  readonly retainedEventCountAfter?: number;
  readonly retainedArtifactCountBefore?: number;
  readonly retainedArtifactCountAfter?: number;
  readonly rollbackAnchorDigest?: string;
}

export type DeepImprovementCommonRollbackDenialReasonCode =
  | 'ABSENT_GATE_CERTIFICATE'
  | 'AUTHORIZATION_DENIED'
  | 'DESTRUCTIVE_ROLLBACK_REJECTED'
  | 'EVIDENCE_INCOMPLETE'
  | 'GATEWAY_FAILURE'
  | 'MISSING_CONFIGURATION'
  | 'STALE_AUTHORITY_EPOCH'
  | 'UNKNOWN_STATE'
  | 'WRITER_FENCE_FAILED';

export interface DeepImprovementCommonRollbackCertificate {
  readonly schemaVersion: typeof DEEP_IMPROVEMENT_COMMON_ROLLBACK_GATE_SCHEMA_VERSION;
  readonly certificateKind: 'non-destructive-rollback';
  readonly mode: 'deep-improvement-common';
  readonly operation: DeepImprovementCommonRollbackOperation;
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

export interface DeepImprovementCommonRollbackDecision {
  readonly disposition: 'authorized' | 'denied';
  readonly authorityState: 'legacy_authoritative';
  readonly ledgerAuthority: 'denied';
  readonly reasonCode: DeepImprovementCommonRollbackDenialReasonCode | null;
  readonly gatewayDecisionId: string | null;
  readonly certificate: DeepImprovementCommonRollbackCertificate | null;
}

export interface DeepImprovementCommonRollbackSwitchOptions {
  readonly gateway: TransitionAuthorizationGateway;
  readonly fencingCoordinator: FencedLeaseCoordinator;
}
