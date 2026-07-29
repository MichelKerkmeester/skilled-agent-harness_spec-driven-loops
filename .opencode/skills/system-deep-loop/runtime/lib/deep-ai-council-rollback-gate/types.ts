// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Rollback Gate Types
// ───────────────────────────────────────────────────────────────────

import type {
  AuthoritySnapshot,
  AuthorityState,
  TransitionAuthorizationRequest,
} from '../authorized-ledger/index.js';
import type {
  DeepAiCouncilOfflineVerificationInput,
} from '../deep-ai-council-certificates/index.js';
import type {
  DeepAiCouncilResumeParityEvidence,
} from '../deep-ai-council-shadow-parity/index.js';
import type {
  DeepAiCouncilSealedArtifactBinding,
} from '../deep-ai-council-sealed-artifacts/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  HealthAggregate,
} from '../health-degeneration-harness/index.js';
import type {
  FencedLease,
  FencedLeaseCoordinator,
  ProtectedResourceIdentity,
} from '../locks-and-fencing/index.js';
import type {
  InflightClassificationManifest,
} from '../inflight-state-classification/index.js';
import type {
  ParityCaseManifest,
} from '../shadow-parity/index.js';
import type {
  Phase014RollbackEvidenceInput,
} from '../rollback-drills/index.js';
import type { SealedArtifactStore } from '../sealed-reference-artifacts/index.js';
import type { TransitionAuthorizationGateway } from '../authorized-ledger/index.js';

export const DEEP_AI_COUNCIL_ROLLBACK_GATE_SCHEMA_VERSION = 1;
export const DEEP_AI_COUNCIL_ROLLBACK_MINIMUM_DAYS = 14;
export const DEEP_AI_COUNCIL_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS = 5;

export type DeepAiCouncilGateInputKind =
  | 'shadow_parity'
  | 'sealed_artifacts'
  | 'certificates_receipts'
  | 'lifecycle_resume'
  | 'rollback_readiness';

export type DeepAiCouncilGateDisposition =
  | 'ready'
  | 'blocked'
  | 'not_ready'
  | 'rollback_required';

export type DeepAiCouncilGateVerdict =
  | 'pass'
  | 'blocked'
  | 'not_ready'
  | 'rollback_required';

export type DeepAiCouncilGateReasonCode =
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

export interface DeepAiCouncilGateInputDisposition {
  readonly input: DeepAiCouncilGateInputKind;
  readonly disposition: DeepAiCouncilGateDisposition;
  readonly reasonCode: DeepAiCouncilGateReasonCode | null;
  readonly evidenceDigest: string | null;
}

export type DeepAiCouncilLifecycleEvidenceKind =
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

export interface DeepAiCouncilLifecycleEvidenceRow {
  readonly kind: DeepAiCouncilLifecycleEvidenceKind;
  readonly fixtureId: string;
  readonly eventDigest: string;
  readonly receiptDigest: string;
  readonly status: 'covered';
}

export interface DeepAiCouncilVersionBindings {
  readonly eventEnvelopeVersion: number;
  readonly eventSchemaVersion: string;
  readonly reducerVersion: string;
  readonly projectionVersion: string;
}

export interface DeepAiCouncilRollbackWindowExecution {
  readonly executionId: string;
  readonly authorityState: AuthorityState;
  readonly authorityEpoch: number;
  readonly result: 'trusted-completion' | 'blocked' | 'failed' | 'incomplete' | 'abstained';
  readonly certificateDigest: string;
}

export interface DeepAiCouncilRollbackWindowInput {
  readonly openedAt: string;
  readonly evaluatedAt: string;
  readonly executions: readonly DeepAiCouncilRollbackWindowExecution[];
  readonly unresolvedEvidenceCount: number;
  readonly lowTraffic: boolean;
}

export interface DeepAiCouncilRollbackWindowEvaluation {
  readonly state: 'open' | 'extended' | 'eligible_to_close';
  readonly elapsedCalendarDays: number;
  readonly successfulAuthoritativeExecutions: number;
  readonly minimumCalendarDays: typeof DEEP_AI_COUNCIL_ROLLBACK_MINIMUM_DAYS;
  readonly minimumSuccessfulAuthoritativeExecutions:
    typeof DEEP_AI_COUNCIL_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS;
  readonly unresolvedEvidenceCount: number;
  readonly lowTraffic: boolean;
  readonly windowClosed: false;
  readonly evaluationDigest: string;
}

export interface DeepAiCouncilModeMigrationCertificate {
  readonly schemaVersion: typeof DEEP_AI_COUNCIL_ROLLBACK_GATE_SCHEMA_VERSION;
  readonly certificateKind: 'mode-migration-readiness';
  readonly mode: 'deep-ai-council';
  readonly readiness: 'ready-for-phase-014-consideration';
  readonly candidateSha: string;
  readonly baseSha: string;
  readonly sharedContractDigest: string;
  readonly writeSetDigest: string;
  readonly versions: DeepAiCouncilVersionBindings;
  readonly fixtureIds: readonly string[];
  readonly streamDigests: readonly string[];
  readonly artifactDigests: readonly string[];
  readonly receiptDigests: readonly string[];
  readonly runCertificateDigest: string;
  readonly replayFingerprint: string;
  readonly verifierIdentity: string;
  readonly verifierVersion: string;
  readonly authorityState: 'legacy_authoritative';
  readonly authorityEpoch: number;
  readonly rollbackAnchorDigest: string;
  readonly rollbackWindow: DeepAiCouncilRollbackWindowEvaluation;
  readonly dispositions: readonly DeepAiCouncilGateInputDisposition[];
  readonly unresolvedRiskIds: readonly string[];
  readonly authorityMutation: false;
  readonly rollbackWindowClosed: false;
  readonly cutoverCertificate: false;
  readonly certificateDigest: string;
}

export interface DeepAiCouncilParityGateEvidence {
  readonly manifest: ParityCaseManifest;
  readonly modeGateInput: unknown;
  readonly receipts: readonly unknown[];
  readonly authorizationAuditRootDirectory: string;
  readonly authorizationAuditLedgerId: string;
}

export interface DeepAiCouncilSealedGateEvidence {
  readonly store: SealedArtifactStore;
  readonly bindings: readonly DeepAiCouncilSealedArtifactBinding[];
}

export interface DeepAiCouncilCertificateGateEvidence<TState extends JsonObject> {
  readonly verificationInput: DeepAiCouncilOfflineVerificationInput<TState>;
}

export interface DeepAiCouncilRollbackGateEvidence {
  readonly phase014Evidence: Phase014RollbackEvidenceInput;
  readonly classificationManifest: InflightClassificationManifest;
  readonly healthAggregate: HealthAggregate;
  readonly rollbackAnchorDigest: string;
}

export interface DeepAiCouncilModeGateInput<TState extends JsonObject> {
  readonly candidateSha: string;
  readonly baseSha: string;
  readonly sharedContractDigest: string;
  readonly writeSetDigest: string;
  readonly versions: DeepAiCouncilVersionBindings;
  readonly verifierIdentity: string;
  readonly verifierVersion: string;
  readonly authority: AuthoritySnapshot;
  readonly parity: DeepAiCouncilParityGateEvidence | null;
  readonly sealedArtifacts: DeepAiCouncilSealedGateEvidence | null;
  readonly certificates: DeepAiCouncilCertificateGateEvidence<TState> | null;
  readonly resumeEvidence: DeepAiCouncilResumeParityEvidence | null;
  readonly lifecycle: readonly DeepAiCouncilLifecycleEvidenceRow[];
  readonly rollback: DeepAiCouncilRollbackGateEvidence | null;
  readonly rollbackWindow: DeepAiCouncilRollbackWindowInput;
  readonly unresolvedRiskIds: readonly string[];
}

export interface DeepAiCouncilModeGateResult {
  readonly verdict: DeepAiCouncilGateVerdict;
  readonly dispositions: readonly DeepAiCouncilGateInputDisposition[];
  readonly certificate: DeepAiCouncilModeMigrationCertificate | null;
}

export type DeepAiCouncilRollbackOperation =
  | 'rollback'
  | 'unquarantine'
  | 'verifier-replacement'
  | 'authority-restoration';

export type DeepAiCouncilDestructiveRollbackIntent =
  | 'none'
  | 'truncate-ledger'
  | 'rewrite-sealed-artifact'
  | 'non-reproduction-proof';

export interface DeepAiCouncilRollbackRequest {
  readonly configurationVersion?: string;
  readonly operation?: DeepAiCouncilRollbackOperation;
  readonly currentAuthority?: AuthoritySnapshot | Readonly<{ state: string; epoch: number }>;
  readonly expectedAuthorityEpoch?: number;
  readonly gateCertificate?: DeepAiCouncilModeMigrationCertificate | null;
  readonly gateInput?: DeepAiCouncilModeGateInput<JsonObject>;
  readonly authorizationRequest?: TransitionAuthorizationRequest;
  readonly rollbackReason?: string;
  readonly admissionState?: 'frozen' | 'open';
  readonly classificationManifest?: InflightClassificationManifest;
  readonly resumeEvidence?: DeepAiCouncilResumeParityEvidence;
  readonly writerResource?: ProtectedResourceIdentity;
  readonly staleWriterLease?: FencedLease;
  readonly destructiveIntent?: DeepAiCouncilDestructiveRollbackIntent;
  readonly retainedEventCountBefore?: number;
  readonly retainedEventCountAfter?: number;
  readonly retainedArtifactCountBefore?: number;
  readonly retainedArtifactCountAfter?: number;
  readonly rollbackAnchorDigest?: string;
}

export type DeepAiCouncilRollbackDenialReasonCode =
  | 'ABSENT_GATE_CERTIFICATE'
  | 'AUTHORIZATION_DENIED'
  | 'DESTRUCTIVE_ROLLBACK_REJECTED'
  | 'EVIDENCE_INCOMPLETE'
  | 'GATEWAY_FAILURE'
  | 'MISSING_CONFIGURATION'
  | 'STALE_AUTHORITY_EPOCH'
  | 'UNKNOWN_STATE'
  | 'WRITER_FENCE_FAILED';

export interface DeepAiCouncilRollbackCertificate {
  readonly schemaVersion: typeof DEEP_AI_COUNCIL_ROLLBACK_GATE_SCHEMA_VERSION;
  readonly certificateKind: 'non-destructive-rollback';
  readonly mode: 'deep-ai-council';
  readonly operation: DeepAiCouncilRollbackOperation;
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

export interface DeepAiCouncilRollbackDecision {
  readonly disposition: 'authorized' | 'denied';
  readonly authorityState: 'legacy_authoritative';
  readonly ledgerAuthority: 'denied';
  readonly reasonCode: DeepAiCouncilRollbackDenialReasonCode | null;
  readonly gatewayDecisionId: string | null;
  readonly certificate: DeepAiCouncilRollbackCertificate | null;
}

export interface DeepAiCouncilRollbackSwitchOptions {
  readonly gateway: TransitionAuthorizationGateway;
  readonly fencingCoordinator: FencedLeaseCoordinator;
}
