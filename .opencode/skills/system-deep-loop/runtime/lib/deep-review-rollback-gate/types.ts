// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Rollback Gate Types
// ───────────────────────────────────────────────────────────────────

import type {
  AuthoritySnapshot,
  AuthorityState,
  TransitionAuthorizationRequest,
} from '../authorized-ledger/index.js';
import type {
  DeepReviewOfflineVerificationInput,
} from '../deep-review-certificates/index.js';
import type {
  DeepReviewResumeParityEvidence,
} from '../deep-review-shadow-parity/index.js';
import type {
  DeepReviewSealedArtifactBinding,
} from '../deep-review-sealed-artifacts/index.js';
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

export const DEEP_REVIEW_ROLLBACK_GATE_SCHEMA_VERSION = 1;
export const DEEP_REVIEW_ROLLBACK_MINIMUM_DAYS = 14;
export const DEEP_REVIEW_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS = 5;

export type DeepReviewGateInputKind =
  | 'shadow_parity'
  | 'sealed_artifacts'
  | 'certificates_receipts'
  | 'lifecycle_resume'
  | 'rollback_readiness';

export type DeepReviewGateDisposition =
  | 'ready'
  | 'blocked'
  | 'not_ready'
  | 'rollback_required';

export type DeepReviewGateVerdict =
  | 'pass'
  | 'blocked'
  | 'not_ready'
  | 'rollback_required';

export type DeepReviewGateReasonCode =
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

export interface DeepReviewGateInputDisposition {
  readonly input: DeepReviewGateInputKind;
  readonly disposition: DeepReviewGateDisposition;
  readonly reasonCode: DeepReviewGateReasonCode | null;
  readonly evidenceDigest: string | null;
}

export type DeepReviewLifecycleEvidenceKind =
  | 'init'
  | 'scope'
  | 'dimension-pass'
  | 'candidate-evidence'
  | 'adjudication-findings'
  | 'severity-projection'
  | 'convergence'
  | 'synthesis'
  | 'review-report'
  | 'crash-resume'
  | 'blocked-stop'
  | 'continuity-handoff';

export interface DeepReviewLifecycleEvidenceRow {
  readonly kind: DeepReviewLifecycleEvidenceKind;
  readonly fixtureId: string;
  readonly eventDigest: string;
  readonly receiptDigest: string;
  readonly status: 'covered';
}

export interface DeepReviewVersionBindings {
  readonly eventEnvelopeVersion: number;
  readonly eventSchemaVersion: string;
  readonly reducerVersion: string;
  readonly projectionVersion: string;
}

export interface DeepReviewRollbackWindowExecution {
  readonly executionId: string;
  readonly authorityState: AuthorityState;
  readonly authorityEpoch: number;
  readonly result: 'trusted-completion' | 'blocked' | 'failed' | 'incomplete' | 'abstained';
  readonly certificateDigest: string;
}

export interface DeepReviewRollbackWindowInput {
  readonly openedAt: string;
  readonly evaluatedAt: string;
  readonly executions: readonly DeepReviewRollbackWindowExecution[];
  readonly unresolvedEvidenceCount: number;
  readonly lowTraffic: boolean;
}

export interface DeepReviewRollbackWindowEvaluation {
  readonly state: 'open' | 'extended' | 'eligible_to_close';
  readonly elapsedCalendarDays: number;
  readonly successfulAuthoritativeExecutions: number;
  readonly minimumCalendarDays: typeof DEEP_REVIEW_ROLLBACK_MINIMUM_DAYS;
  readonly minimumSuccessfulAuthoritativeExecutions:
    typeof DEEP_REVIEW_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS;
  readonly unresolvedEvidenceCount: number;
  readonly lowTraffic: boolean;
  readonly windowClosed: false;
  readonly evaluationDigest: string;
}

export interface DeepReviewModeMigrationCertificate {
  readonly schemaVersion: typeof DEEP_REVIEW_ROLLBACK_GATE_SCHEMA_VERSION;
  readonly certificateKind: 'mode-migration-readiness';
  readonly mode: 'deep-review';
  readonly readiness: 'ready-for-phase-014-consideration';
  readonly candidateSha: string;
  readonly baseSha: string;
  readonly sharedContractDigest: string;
  readonly writeSetDigest: string;
  readonly versions: DeepReviewVersionBindings;
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
  readonly rollbackWindow: DeepReviewRollbackWindowEvaluation;
  readonly dispositions: readonly DeepReviewGateInputDisposition[];
  readonly unresolvedRiskIds: readonly string[];
  readonly authorityMutation: false;
  readonly rollbackWindowClosed: false;
  readonly cutoverCertificate: false;
  readonly certificateDigest: string;
}

export interface DeepReviewParityGateEvidence {
  readonly manifest: ParityCaseManifest;
  readonly modeGateInput: unknown;
  readonly receipts: readonly unknown[];
  readonly authorizationAuditRootDirectory: string;
  readonly authorizationAuditLedgerId: string;
}

export interface DeepReviewSealedGateEvidence {
  readonly store: SealedArtifactStore;
  readonly bindings: readonly DeepReviewSealedArtifactBinding[];
}

export interface DeepReviewCertificateGateEvidence<TState extends JsonObject> {
  readonly verificationInput: DeepReviewOfflineVerificationInput<TState>;
}

export interface DeepReviewRollbackGateEvidence {
  readonly phase014Evidence: Phase014RollbackEvidenceInput;
  readonly classificationManifest: InflightClassificationManifest;
  readonly healthAggregate: HealthAggregate;
  readonly rollbackAnchorDigest: string;
}

export interface DeepReviewModeGateInput<TState extends JsonObject> {
  readonly candidateSha: string;
  readonly baseSha: string;
  readonly sharedContractDigest: string;
  readonly writeSetDigest: string;
  readonly versions: DeepReviewVersionBindings;
  readonly verifierIdentity: string;
  readonly verifierVersion: string;
  readonly authority: AuthoritySnapshot;
  readonly parity: DeepReviewParityGateEvidence | null;
  readonly sealedArtifacts: DeepReviewSealedGateEvidence | null;
  readonly certificates: DeepReviewCertificateGateEvidence<TState> | null;
  readonly resumeEvidence: DeepReviewResumeParityEvidence | null;
  readonly lifecycle: readonly DeepReviewLifecycleEvidenceRow[];
  readonly rollback: DeepReviewRollbackGateEvidence | null;
  readonly rollbackWindow: DeepReviewRollbackWindowInput;
  readonly unresolvedRiskIds: readonly string[];
}

export interface DeepReviewModeGateResult {
  readonly verdict: DeepReviewGateVerdict;
  readonly dispositions: readonly DeepReviewGateInputDisposition[];
  readonly certificate: DeepReviewModeMigrationCertificate | null;
}

export type DeepReviewRollbackOperation =
  | 'rollback'
  | 'unquarantine'
  | 'verifier-replacement'
  | 'authority-restoration';

export type DeepReviewDestructiveRollbackIntent =
  | 'none'
  | 'truncate-ledger'
  | 'rewrite-sealed-artifact'
  | 'non-reproduction-proof';

export interface DeepReviewRollbackRequest {
  readonly configurationVersion?: string;
  readonly operation?: DeepReviewRollbackOperation;
  readonly currentAuthority?: AuthoritySnapshot | Readonly<{ state: string; epoch: number }>;
  readonly expectedAuthorityEpoch?: number;
  readonly gateCertificate?: DeepReviewModeMigrationCertificate | null;
  readonly gateInput?: DeepReviewModeGateInput<JsonObject>;
  readonly authorizationRequest?: TransitionAuthorizationRequest;
  readonly rollbackReason?: string;
  readonly admissionState?: 'frozen' | 'open';
  readonly classificationManifest?: InflightClassificationManifest;
  readonly resumeEvidence?: DeepReviewResumeParityEvidence;
  readonly writerResource?: ProtectedResourceIdentity;
  readonly staleWriterLease?: FencedLease;
  readonly destructiveIntent?: DeepReviewDestructiveRollbackIntent;
  readonly retainedEventCountBefore?: number;
  readonly retainedEventCountAfter?: number;
  readonly retainedArtifactCountBefore?: number;
  readonly retainedArtifactCountAfter?: number;
  readonly rollbackAnchorDigest?: string;
}

export type DeepReviewRollbackDenialReasonCode =
  | 'ABSENT_GATE_CERTIFICATE'
  | 'AUTHORIZATION_DENIED'
  | 'DESTRUCTIVE_ROLLBACK_REJECTED'
  | 'EVIDENCE_INCOMPLETE'
  | 'GATEWAY_FAILURE'
  | 'MISSING_CONFIGURATION'
  | 'STALE_AUTHORITY_EPOCH'
  | 'UNKNOWN_STATE'
  | 'WRITER_FENCE_FAILED';

export interface DeepReviewRollbackCertificate {
  readonly schemaVersion: typeof DEEP_REVIEW_ROLLBACK_GATE_SCHEMA_VERSION;
  readonly certificateKind: 'non-destructive-rollback';
  readonly mode: 'deep-review';
  readonly operation: DeepReviewRollbackOperation;
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

export interface DeepReviewRollbackDecision {
  readonly disposition: 'authorized' | 'denied';
  readonly authorityState: 'legacy_authoritative';
  readonly ledgerAuthority: 'denied';
  readonly reasonCode: DeepReviewRollbackDenialReasonCode | null;
  readonly gatewayDecisionId: string | null;
  readonly certificate: DeepReviewRollbackCertificate | null;
}

export interface DeepReviewRollbackSwitchOptions {
  readonly gateway: TransitionAuthorizationGateway;
  readonly fencingCoordinator: FencedLeaseCoordinator;
}
