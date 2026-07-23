// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Rollback Gate Types
// ───────────────────────────────────────────────────────────────────

import type {
  AuthoritySnapshot,
  AuthorityState,
  TransitionAuthorizationRequest,
} from '../authorized-ledger/index.js';
import type {
  DeepResearchOfflineVerificationInput,
} from '../deep-research-certificates/index.js';
import type {
  DeepResearchResumeParityEvidence,
} from '../deep-research-shadow-parity/index.js';
import type {
  DeepResearchSealedArtifactBinding,
} from '../deep-research-sealed-artifacts/index.js';
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

export const DEEP_RESEARCH_ROLLBACK_GATE_SCHEMA_VERSION = 1;
export const DEEP_RESEARCH_ROLLBACK_MINIMUM_DAYS = 14;
export const DEEP_RESEARCH_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS = 5;

export type DeepResearchGateInputKind =
  | 'shadow_parity'
  | 'sealed_artifacts'
  | 'certificates_receipts'
  | 'lifecycle_resume'
  | 'rollback_readiness';

export type DeepResearchGateDisposition =
  | 'ready'
  | 'blocked'
  | 'not_ready'
  | 'rollback_required';

export type DeepResearchGateVerdict =
  | 'pass'
  | 'blocked'
  | 'not_ready'
  | 'rollback_required';

export type DeepResearchGateReasonCode =
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

export interface DeepResearchGateInputDisposition {
  readonly input: DeepResearchGateInputKind;
  readonly disposition: DeepResearchGateDisposition;
  readonly reasonCode: DeepResearchGateReasonCode | null;
  readonly evidenceDigest: string | null;
}

export type DeepResearchLifecycleEvidenceKind =
  | 'init'
  | 'gather-analyze'
  | 'convergence'
  | 'synthesis'
  | 'memory-save'
  | 'crash-resume'
  | 'source-refresh'
  | 'quarantine'
  | 'contradiction'
  | 'incomplete-run';

export interface DeepResearchLifecycleEvidenceRow {
  readonly kind: DeepResearchLifecycleEvidenceKind;
  readonly fixtureId: string;
  readonly eventDigest: string;
  readonly receiptDigest: string;
  readonly status: 'covered';
}

export interface DeepResearchVersionBindings {
  readonly eventEnvelopeVersion: number;
  readonly eventSchemaVersion: string;
  readonly reducerVersion: string;
  readonly projectionVersion: string;
}

export interface DeepResearchRollbackWindowExecution {
  readonly executionId: string;
  readonly authorityState: AuthorityState;
  readonly authorityEpoch: number;
  readonly result: 'trusted-completion' | 'blocked' | 'failed' | 'incomplete' | 'abstained';
  readonly certificateDigest: string;
}

export interface DeepResearchRollbackWindowInput {
  readonly openedAt: string;
  readonly evaluatedAt: string;
  readonly executions: readonly DeepResearchRollbackWindowExecution[];
  readonly unresolvedEvidenceCount: number;
  readonly lowTraffic: boolean;
}

export interface DeepResearchRollbackWindowEvaluation {
  readonly state: 'open' | 'extended' | 'eligible_to_close';
  readonly elapsedCalendarDays: number;
  readonly successfulAuthoritativeExecutions: number;
  readonly minimumCalendarDays: typeof DEEP_RESEARCH_ROLLBACK_MINIMUM_DAYS;
  readonly minimumSuccessfulAuthoritativeExecutions:
    typeof DEEP_RESEARCH_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS;
  readonly unresolvedEvidenceCount: number;
  readonly lowTraffic: boolean;
  readonly windowClosed: false;
  readonly evaluationDigest: string;
}

export interface DeepResearchModeMigrationCertificate {
  readonly schemaVersion: typeof DEEP_RESEARCH_ROLLBACK_GATE_SCHEMA_VERSION;
  readonly certificateKind: 'mode-migration-readiness';
  readonly mode: 'deep-research';
  readonly readiness: 'ready-for-phase-014-consideration';
  readonly candidateSha: string;
  readonly baseSha: string;
  readonly sharedContractDigest: string;
  readonly writeSetDigest: string;
  readonly versions: DeepResearchVersionBindings;
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
  readonly rollbackWindow: DeepResearchRollbackWindowEvaluation;
  readonly dispositions: readonly DeepResearchGateInputDisposition[];
  readonly unresolvedRiskIds: readonly string[];
  readonly authorityMutation: false;
  readonly rollbackWindowClosed: false;
  readonly cutoverCertificate: false;
  readonly certificateDigest: string;
}

export interface DeepResearchParityGateEvidence {
  readonly manifest: ParityCaseManifest;
  readonly modeGateInput: unknown;
  readonly receipts: readonly unknown[];
  readonly authorizationAuditRootDirectory: string;
  readonly authorizationAuditLedgerId: string;
}

export interface DeepResearchSealedGateEvidence {
  readonly store: SealedArtifactStore;
  readonly bindings: readonly DeepResearchSealedArtifactBinding[];
}

export interface DeepResearchCertificateGateEvidence<TState extends JsonObject> {
  readonly verificationInput: DeepResearchOfflineVerificationInput<TState>;
}

export interface DeepResearchRollbackGateEvidence {
  readonly phase014Evidence: Phase014RollbackEvidenceInput;
  readonly classificationManifest: InflightClassificationManifest;
  readonly healthAggregate: HealthAggregate;
  readonly rollbackAnchorDigest: string;
}

export interface DeepResearchModeGateInput<TState extends JsonObject> {
  readonly candidateSha: string;
  readonly baseSha: string;
  readonly sharedContractDigest: string;
  readonly writeSetDigest: string;
  readonly versions: DeepResearchVersionBindings;
  readonly verifierIdentity: string;
  readonly verifierVersion: string;
  readonly authority: AuthoritySnapshot;
  readonly parity: DeepResearchParityGateEvidence | null;
  readonly sealedArtifacts: DeepResearchSealedGateEvidence | null;
  readonly certificates: DeepResearchCertificateGateEvidence<TState> | null;
  readonly resumeEvidence: DeepResearchResumeParityEvidence | null;
  readonly lifecycle: readonly DeepResearchLifecycleEvidenceRow[];
  readonly rollback: DeepResearchRollbackGateEvidence | null;
  readonly rollbackWindow: DeepResearchRollbackWindowInput;
  readonly unresolvedRiskIds: readonly string[];
}

export interface DeepResearchModeGateResult {
  readonly verdict: DeepResearchGateVerdict;
  readonly dispositions: readonly DeepResearchGateInputDisposition[];
  readonly certificate: DeepResearchModeMigrationCertificate | null;
}

export type DeepResearchRollbackOperation =
  | 'rollback'
  | 'unquarantine'
  | 'verifier-replacement'
  | 'authority-restoration';

export type DeepResearchDestructiveRollbackIntent =
  | 'none'
  | 'truncate-ledger'
  | 'rewrite-sealed-artifact'
  | 'non-reproduction-proof';

export interface DeepResearchRollbackRequest {
  readonly configurationVersion?: string;
  readonly operation?: DeepResearchRollbackOperation;
  readonly currentAuthority?: AuthoritySnapshot | Readonly<{ state: string; epoch: number }>;
  readonly expectedAuthorityEpoch?: number;
  readonly gateCertificate?: DeepResearchModeMigrationCertificate | null;
  readonly gateInput?: DeepResearchModeGateInput<JsonObject>;
  readonly authorizationRequest?: TransitionAuthorizationRequest;
  readonly rollbackReason?: string;
  readonly admissionState?: 'frozen' | 'open';
  readonly classificationManifest?: InflightClassificationManifest;
  readonly resumeEvidence?: DeepResearchResumeParityEvidence;
  readonly writerResource?: ProtectedResourceIdentity;
  readonly staleWriterLease?: FencedLease;
  readonly destructiveIntent?: DeepResearchDestructiveRollbackIntent;
  readonly retainedEventCountBefore?: number;
  readonly retainedEventCountAfter?: number;
  readonly retainedArtifactCountBefore?: number;
  readonly retainedArtifactCountAfter?: number;
  readonly rollbackAnchorDigest?: string;
}

export type DeepResearchRollbackDenialReasonCode =
  | 'ABSENT_GATE_CERTIFICATE'
  | 'AUTHORIZATION_DENIED'
  | 'DESTRUCTIVE_ROLLBACK_REJECTED'
  | 'EVIDENCE_INCOMPLETE'
  | 'GATEWAY_FAILURE'
  | 'MISSING_CONFIGURATION'
  | 'STALE_AUTHORITY_EPOCH'
  | 'UNKNOWN_STATE'
  | 'WRITER_FENCE_FAILED';

export interface DeepResearchRollbackCertificate {
  readonly schemaVersion: typeof DEEP_RESEARCH_ROLLBACK_GATE_SCHEMA_VERSION;
  readonly certificateKind: 'non-destructive-rollback';
  readonly mode: 'deep-research';
  readonly operation: DeepResearchRollbackOperation;
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

export interface DeepResearchRollbackDecision {
  readonly disposition: 'authorized' | 'denied';
  readonly authorityState: 'legacy_authoritative';
  readonly ledgerAuthority: 'denied';
  readonly reasonCode: DeepResearchRollbackDenialReasonCode | null;
  readonly gatewayDecisionId: string | null;
  readonly certificate: DeepResearchRollbackCertificate | null;
}

export interface DeepResearchRollbackSwitchOptions {
  readonly gateway: TransitionAuthorizationGateway;
  readonly fencingCoordinator: FencedLeaseCoordinator;
}
