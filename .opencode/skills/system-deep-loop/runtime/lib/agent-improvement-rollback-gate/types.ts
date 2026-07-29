// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Rollback Gate Types
// ───────────────────────────────────────────────────────────────────

import type {
  AuthoritySnapshot,
  AuthorityState,
  TransitionAuthorizationGateway,
  TransitionAuthorizationRequest,
} from '../authorized-ledger/index.js';
import type {
  AgentImprovementOfflineVerificationInput,
} from '../agent-improvement-certificates/index.js';
import type {
  AgentImprovementResumeParityEvidence,
} from '../agent-improvement-shadow-parity/index.js';
import type {
  AgentImprovementSealedArtifactBinding,
} from '../agent-improvement-sealed-artifacts/index.js';
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
import type { SealedArtifactStore } from '../sealed-reference-artifacts/index.js';
import type { ParityCaseManifest } from '../shadow-parity/index.js';

export const AGENT_IMPROVEMENT_ROLLBACK_GATE_SCHEMA_VERSION = 1;
export const AGENT_IMPROVEMENT_ROLLBACK_MINIMUM_DAYS = 14;
export const AGENT_IMPROVEMENT_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS = 5;

export type AgentImprovementGateInputKind = DeepImprovementCommonGateInputKind;
export type AgentImprovementGateDisposition = DeepImprovementCommonGateDisposition;
export type AgentImprovementGateVerdict = DeepImprovementCommonGateVerdict;
export type AgentImprovementGateReasonCode = DeepImprovementCommonGateReasonCode
  | 'COMMON_GATE_INVALID'
  | 'MODE_CERTIFICATE_INVALID';

export interface AgentImprovementGateInputDisposition {
  readonly input: AgentImprovementGateInputKind;
  readonly disposition: AgentImprovementGateDisposition;
  readonly reasonCode: AgentImprovementGateReasonCode | null;
  readonly evidenceDigest: string | null;
}

export type AgentImprovementLifecycleEvidenceKind =
  | 'agent-ir'
  | 'change-contract'
  | 'proposal'
  | 'causal-analysis'
  | 'behavior-coverage'
  | 'transfer'
  | 'canary'
  | 'promotion'
  | 'abort'
  | 'restore'
  | 'replay'
  | 'resume'
  | 'unknown-effect';

export interface AgentImprovementLifecycleEvidenceRow {
  readonly kind: AgentImprovementLifecycleEvidenceKind;
  readonly fixtureId: string;
  readonly eventDigest: string;
  readonly receiptDigest: string;
  readonly status: 'covered';
}

export interface AgentImprovementVersionBindings {
  readonly eventEnvelopeVersion: number;
  readonly eventSchemaVersion: string;
  readonly reducerVersion: string;
  readonly projectionVersion: string;
}

export type AgentImprovementRollbackWindowExecution =
  DeepImprovementCommonRollbackWindowExecution;
export type AgentImprovementRollbackWindowInput =
  DeepImprovementCommonRollbackWindowInput;

export interface AgentImprovementRollbackWindowEvaluation
  extends Omit<
    DeepImprovementCommonRollbackWindowEvaluation,
    'minimumCalendarDays' | 'minimumSuccessfulAuthoritativeExecutions'
  > {
  readonly minimumCalendarDays: typeof AGENT_IMPROVEMENT_ROLLBACK_MINIMUM_DAYS;
  readonly minimumSuccessfulAuthoritativeExecutions:
    typeof AGENT_IMPROVEMENT_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS;
}

export interface AgentImprovementModeMigrationCertificate {
  readonly schemaVersion: typeof AGENT_IMPROVEMENT_ROLLBACK_GATE_SCHEMA_VERSION;
  readonly certificateKind: 'mode-migration-readiness';
  readonly mode: 'agent-improvement';
  readonly readiness: 'ready-for-phase-014-consideration';
  readonly candidateSha: string;
  readonly baseSha: string;
  // These descriptors are committed here; their authoritative source remains external.
  readonly sharedContractDigest: string;
  readonly writeSetDigest: string;
  readonly versions: AgentImprovementVersionBindings;
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly candidateId: string;
  readonly parentCandidateId: string | null;
  readonly agentIrDigest: string;
  readonly changeContractDigest: string;
  readonly mutationProposalDigest: string;
  readonly evaluationEpochId: string;
  readonly canaryEpochId: string;
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
  readonly rollbackWindow: AgentImprovementRollbackWindowEvaluation;
  readonly dispositions: readonly AgentImprovementGateInputDisposition[];
  // An empty list is required locally; completeness belongs to the authoritative risk registry.
  readonly unresolvedRiskIds: readonly string[];
  readonly authorityMutation: false;
  readonly rollbackWindowClosed: false;
  readonly cutoverCertificate: false;
  readonly candidateDispatched: false;
  readonly legacyWriterRetired: false;
  readonly certificateDigest: string;
}

export interface AgentImprovementParityGateEvidence {
  readonly manifest: ParityCaseManifest;
  readonly modeGateInput: unknown;
  readonly receipts: readonly unknown[];
  readonly authorizationAuditRootDirectory: string;
  readonly authorizationAuditLedgerId: string;
}

export interface AgentImprovementSealedGateEvidence {
  readonly store: SealedArtifactStore;
  readonly bindings: readonly AgentImprovementSealedArtifactBinding[];
}

export interface AgentImprovementCertificateGateEvidence<TState extends JsonObject> {
  readonly verificationInput: AgentImprovementOfflineVerificationInput<TState>;
}

export interface AgentImprovementModeGateInput<TState extends JsonObject> {
  readonly candidateSha: string;
  readonly baseSha: string;
  readonly sharedContractDigest: string;
  readonly writeSetDigest: string;
  readonly versions: AgentImprovementVersionBindings;
  readonly verifierIdentity: string;
  readonly verifierVersion: string;
  readonly authority: AuthoritySnapshot;
  // Common services remain authoritative through their complete, independently evaluated input.
  readonly commonGateInput: DeepImprovementCommonModeGateInput<JsonObject>;
  readonly parity: AgentImprovementParityGateEvidence | null;
  readonly sealedArtifacts: AgentImprovementSealedGateEvidence | null;
  readonly certificates: AgentImprovementCertificateGateEvidence<TState> | null;
  readonly resumeEvidence: AgentImprovementResumeParityEvidence | null;
  // Labels classify distinct authenticated identities; they are not dedicated substrate kinds.
  readonly lifecycle: readonly AgentImprovementLifecycleEvidenceRow[];
  readonly rollbackWindow: AgentImprovementRollbackWindowInput;
  readonly unresolvedRiskIds: readonly string[];
}

export interface AgentImprovementModeGateResult {
  readonly verdict: AgentImprovementGateVerdict;
  readonly dispositions: readonly AgentImprovementGateInputDisposition[];
  readonly certificate: AgentImprovementModeMigrationCertificate | null;
}

export type AgentImprovementRollbackOperation =
  | 'rollback'
  | 'unquarantine'
  | 'verifier-replacement'
  | 'authority-restoration';

export type AgentImprovementDestructiveRollbackIntent =
  | 'none'
  | 'truncate-ledger'
  | 'rewrite-sealed-artifact'
  | 'non-reproduction-proof';

export interface AgentImprovementRollbackRequest {
  readonly configurationVersion?: string;
  readonly operation?: AgentImprovementRollbackOperation;
  readonly currentAuthority?: AuthoritySnapshot | Readonly<{ state: string; epoch: number }>;
  readonly expectedAuthorityEpoch?: number;
  readonly gateCertificate?: AgentImprovementModeMigrationCertificate | null;
  readonly gateInput?: AgentImprovementModeGateInput<JsonObject>;
  readonly authorizationRequest?: TransitionAuthorizationRequest;
  readonly rollbackReason?: string;
  readonly admissionState?: 'frozen' | 'open';
  readonly classificationManifest?: InflightClassificationManifest;
  readonly resumeEvidence?: AgentImprovementResumeParityEvidence;
  readonly writerResource?: ProtectedResourceIdentity;
  // The tuple is validated and bound; the coordinator proves resource and token supersession.
  readonly staleWriterLease?: FencedLease;
  readonly destructiveIntent?: AgentImprovementDestructiveRollbackIntent;
  // Retention values are equality-checked assertions because this adapter has no store-total handle.
  readonly retainedEventCountBefore?: number;
  readonly retainedEventCountAfter?: number;
  readonly retainedArtifactCountBefore?: number;
  readonly retainedArtifactCountAfter?: number;
  readonly rollbackAnchorDigest?: string;
}

export type AgentImprovementRollbackDenialReasonCode =
  | 'ABSENT_GATE_CERTIFICATE'
  | 'AUTHORIZATION_DENIED'
  | 'DESTRUCTIVE_ROLLBACK_REJECTED'
  | 'EVIDENCE_INCOMPLETE'
  | 'GATEWAY_FAILURE'
  | 'MISSING_CONFIGURATION'
  | 'STALE_AUTHORITY_EPOCH'
  | 'UNKNOWN_STATE'
  | 'WRITER_FENCE_FAILED';

export interface AgentImprovementRollbackCertificate {
  readonly schemaVersion: typeof AGENT_IMPROVEMENT_ROLLBACK_GATE_SCHEMA_VERSION;
  readonly certificateKind: 'non-destructive-rollback';
  readonly mode: 'agent-improvement';
  readonly operation: AgentImprovementRollbackOperation;
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

export interface AgentImprovementRollbackDecision {
  readonly disposition: 'authorized' | 'denied';
  readonly authorityState: 'legacy_authoritative';
  readonly ledgerAuthority: 'denied';
  readonly reasonCode: AgentImprovementRollbackDenialReasonCode | null;
  readonly gatewayDecisionId: string | null;
  readonly certificate: AgentImprovementRollbackCertificate | null;
}

export interface AgentImprovementRollbackSwitchOptions {
  readonly gateway: TransitionAuthorizationGateway;
  readonly fencingCoordinator: FencedLeaseCoordinator;
}
