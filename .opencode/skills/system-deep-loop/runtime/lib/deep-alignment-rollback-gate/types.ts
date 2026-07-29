// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Rollback Gate Types
// ───────────────────────────────────────────────────────────────────

import type {
  AuthoritySnapshot,
  AuthorityState,
  TransitionAuthorizationGateway,
  TransitionAuthorizationRequest,
} from '../authorized-ledger/index.js';
import type {
  DeepAlignmentOfflineVerificationInput,
} from '../deep-alignment-certificates/index.js';
import type {
  DeepAlignmentResumeParityEvidence,
} from '../deep-alignment-shadow-parity/index.js';
import type {
  DeepAlignmentSealedArtifactBinding,
} from '../deep-alignment-sealed-artifacts/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type { HealthAggregate } from '../health-degeneration-harness/index.js';
import type {
  FencedLease,
  FencedLeaseCoordinator,
  ProtectedResourceIdentity,
} from '../locks-and-fencing/index.js';
import type {
  InflightClassificationManifest,
} from '../inflight-state-classification/index.js';
import type { ParityCaseManifest } from '../shadow-parity/index.js';
import type { Phase014RollbackEvidenceInput } from '../rollback-drills/index.js';
import type { SealedArtifactStore } from '../sealed-reference-artifacts/index.js';

export const DEEP_ALIGNMENT_ROLLBACK_GATE_SCHEMA_VERSION = 1;
export const DEEP_ALIGNMENT_ROLLBACK_MINIMUM_DAYS = 14;
export const DEEP_ALIGNMENT_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS = 5;

export type DeepAlignmentGateInputKind =
  | 'shadow_parity'
  | 'sealed_artifacts'
  | 'certificates_receipts'
  | 'lifecycle_resume'
  | 'rollback_readiness';

export type DeepAlignmentGateDisposition =
  | 'ready'
  | 'blocked'
  | 'not_ready'
  | 'rollback_required';

export type DeepAlignmentGateVerdict =
  | 'pass'
  | 'blocked'
  | 'not_ready'
  | 'rollback_required';

export type DeepAlignmentGateReasonCode =
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

export interface DeepAlignmentGateInputDisposition {
  readonly input: DeepAlignmentGateInputKind;
  readonly disposition: DeepAlignmentGateDisposition;
  readonly reasonCode: DeepAlignmentGateReasonCode | null;
  readonly evidenceDigest: string | null;
}

export type DeepAlignmentLifecycleEvidenceKind =
  | 'init'
  | 'authority'
  | 'lane-scope'
  | 'applicability'
  | 'observation-evidence'
  | 'finding-verification-proof'
  | 'adjudication-conformance'
  | 'deviation-witness'
  | 'coverage'
  | 'convergence'
  | 'synthesis-report'
  | 'crash-resume'
  | 'blocked-stop'
  | 'continuity-handoff';

export interface DeepAlignmentLifecycleEvidenceRow {
  readonly kind: DeepAlignmentLifecycleEvidenceKind;
  readonly fixtureId: string;
  readonly eventDigest: string;
  readonly receiptDigest: string;
  readonly status: 'covered';
}

export interface DeepAlignmentVersionBindings {
  readonly eventEnvelopeVersion: number;
  readonly eventSchemaVersion: string;
  readonly reducerVersion: string;
  readonly projectionVersion: string;
}

export interface DeepAlignmentRollbackWindowExecution {
  readonly executionId: string;
  readonly authorityState: AuthorityState;
  readonly authorityEpoch: number;
  readonly result: 'trusted-completion' | 'blocked' | 'failed' | 'incomplete' | 'abstained';
  readonly certificateDigest: string;
}

export interface DeepAlignmentRollbackWindowInput {
  readonly openedAt: string;
  readonly evaluatedAt: string;
  readonly executions: readonly DeepAlignmentRollbackWindowExecution[];
  readonly unresolvedEvidenceCount: number;
  readonly lowTraffic: boolean;
}

export interface DeepAlignmentRollbackWindowEvaluation {
  readonly state: 'open' | 'extended' | 'eligible_to_close';
  readonly elapsedCalendarDays: number;
  readonly successfulAuthoritativeExecutions: number;
  readonly minimumCalendarDays: typeof DEEP_ALIGNMENT_ROLLBACK_MINIMUM_DAYS;
  readonly minimumSuccessfulAuthoritativeExecutions:
    typeof DEEP_ALIGNMENT_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS;
  readonly unresolvedEvidenceCount: number;
  readonly lowTraffic: boolean;
  readonly windowClosed: false;
  readonly evaluationDigest: string;
}

export interface DeepAlignmentRollbackWindowDenial {
  readonly state: 'invalid';
  readonly reasonCode: 'EVIDENCE_MALFORMED';
  readonly windowClosed: false;
  readonly evaluationDigest: null;
}

export type DeepAlignmentRollbackWindowResult =
  | DeepAlignmentRollbackWindowEvaluation
  | DeepAlignmentRollbackWindowDenial;

export interface DeepAlignmentModeMigrationCertificate {
  readonly schemaVersion: typeof DEEP_ALIGNMENT_ROLLBACK_GATE_SCHEMA_VERSION;
  readonly certificateKind: 'mode-migration-readiness';
  readonly mode: 'deep-alignment';
  readonly readiness: 'ready-for-phase-014-consideration';
  readonly candidateSha: string;
  readonly baseSha: string;
  readonly sharedContractDigest: string;
  readonly writeSetDigest: string;
  readonly versions: DeepAlignmentVersionBindings;
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
  readonly rollbackWindow: DeepAlignmentRollbackWindowEvaluation;
  readonly dispositions: readonly DeepAlignmentGateInputDisposition[];
  readonly unresolvedRiskIds: readonly string[];
  readonly authorityMutation: false;
  readonly rollbackWindowClosed: false;
  readonly cutoverCertificate: false;
  readonly certificateDigest: string;
}

export interface DeepAlignmentParityGateEvidence {
  readonly manifest: ParityCaseManifest;
  readonly modeGateInput: unknown;
  readonly receipts: readonly unknown[];
  readonly authorizationAuditRootDirectory: string;
  readonly authorizationAuditLedgerId: string;
}

export interface DeepAlignmentSealedGateEvidence {
  readonly store: SealedArtifactStore;
  readonly bindings: readonly DeepAlignmentSealedArtifactBinding[];
}

export interface DeepAlignmentCertificateGateEvidence<TState extends JsonObject> {
  readonly verificationInput: DeepAlignmentOfflineVerificationInput<TState>;
}

export interface DeepAlignmentRollbackGateEvidence {
  readonly phase014Evidence: Phase014RollbackEvidenceInput;
  readonly classificationManifest: InflightClassificationManifest;
  readonly healthAggregate: HealthAggregate;
  readonly rollbackAnchorDigest: string;
}

export interface DeepAlignmentModeGateInput<TState extends JsonObject> {
  readonly candidateSha: string;
  readonly baseSha: string;
  readonly sharedContractDigest: string;
  readonly writeSetDigest: string;
  readonly versions: DeepAlignmentVersionBindings;
  readonly verifierIdentity: string;
  readonly verifierVersion: string;
  readonly authority: AuthoritySnapshot;
  readonly parity: DeepAlignmentParityGateEvidence | null;
  readonly sealedArtifacts: DeepAlignmentSealedGateEvidence | null;
  readonly certificates: DeepAlignmentCertificateGateEvidence<TState> | null;
  readonly resumeEvidence: DeepAlignmentResumeParityEvidence | null;
  readonly lifecycle: readonly DeepAlignmentLifecycleEvidenceRow[];
  readonly rollback: DeepAlignmentRollbackGateEvidence | null;
  readonly rollbackWindow: DeepAlignmentRollbackWindowInput;
  readonly unresolvedRiskIds: readonly string[];
}

export interface DeepAlignmentModeGateResult {
  readonly verdict: DeepAlignmentGateVerdict;
  readonly dispositions: readonly DeepAlignmentGateInputDisposition[];
  readonly certificate: DeepAlignmentModeMigrationCertificate | null;
}

export type DeepAlignmentRollbackOperation =
  | 'rollback'
  | 'unquarantine'
  | 'verifier-replacement'
  | 'authority-restoration';

export type DeepAlignmentDestructiveRollbackIntent =
  | 'none'
  | 'truncate-ledger'
  | 'rewrite-sealed-artifact'
  | 'non-reproduction-proof';

export interface DeepAlignmentRollbackRequest {
  readonly configurationVersion?: string;
  readonly operation?: DeepAlignmentRollbackOperation;
  readonly currentAuthority?: AuthoritySnapshot | Readonly<{ state: string; epoch: number }>;
  readonly expectedAuthorityEpoch?: number;
  readonly gateCertificate?: DeepAlignmentModeMigrationCertificate | null;
  readonly gateInput?: DeepAlignmentModeGateInput<JsonObject>;
  readonly authorizationRequest?: TransitionAuthorizationRequest;
  readonly rollbackReason?: string;
  readonly admissionState?: 'frozen' | 'open';
  readonly classificationManifest?: InflightClassificationManifest;
  readonly resumeEvidence?: DeepAlignmentResumeParityEvidence;
  readonly writerResource?: ProtectedResourceIdentity;
  readonly staleWriterLease?: FencedLease;
  readonly destructiveIntent?: DeepAlignmentDestructiveRollbackIntent;
  readonly retainedEventCountBefore?: number;
  readonly retainedEventCountAfter?: number;
  readonly retainedArtifactCountBefore?: number;
  readonly retainedArtifactCountAfter?: number;
  readonly rollbackAnchorDigest?: string;
}

export type DeepAlignmentRollbackDenialReasonCode =
  | 'ABSENT_GATE_CERTIFICATE'
  | 'AUTHORIZATION_DENIED'
  | 'DESTRUCTIVE_ROLLBACK_REJECTED'
  | 'EVIDENCE_INCOMPLETE'
  | 'GATEWAY_FAILURE'
  | 'MISSING_CONFIGURATION'
  | 'STALE_AUTHORITY_EPOCH'
  | 'UNKNOWN_STATE'
  | 'WRITER_FENCE_FAILED';

export interface DeepAlignmentRollbackCertificate {
  readonly schemaVersion: typeof DEEP_ALIGNMENT_ROLLBACK_GATE_SCHEMA_VERSION;
  readonly certificateKind: 'non-destructive-rollback';
  readonly mode: 'deep-alignment';
  readonly operation: DeepAlignmentRollbackOperation;
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

export interface DeepAlignmentRollbackDecision {
  readonly disposition: 'authorized' | 'denied';
  readonly authorityState: 'legacy_authoritative';
  readonly ledgerAuthority: 'denied';
  readonly reasonCode: DeepAlignmentRollbackDenialReasonCode | null;
  readonly gatewayDecisionId: string | null;
  readonly certificate: DeepAlignmentRollbackCertificate | null;
}

export interface DeepAlignmentRollbackSwitchOptions {
  readonly gateway: TransitionAuthorizationGateway;
  readonly fencingCoordinator: FencedLeaseCoordinator;
}
