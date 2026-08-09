// ───────────────────────────────────────────────────────────────────
// MODULE: Cutover Certificate & Rollback Window Types
// ───────────────────────────────────────────────────────────────────

import type { AuthorityState, RegisteredTransitionPolicy } from '../authorized-ledger/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  InflightClassificationManifest,
} from '../inflight-state-classification/index.js';
import type { MixedVersionOraclePass } from '../mixed-version-fixtures/index.js';
import type {
  BoundaryReceiptPayload,
  CertificationEnvelope,
} from '../receipts-and-effect-recovery/index.js';
import type { RollbackDrillCertificate } from '../rollback-drills/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. IDENTITY AND CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const CUTOVER_CERTIFICATE_SCHEMA_VERSION = 1;
export const CUTOVER_CERTIFICATE_EVENT_TYPE = 'deep-loop-cutover.ledger.certificate-issued';
export const ROLLBACK_WINDOW_MINIMUM_CALENDAR_DAYS = 14;
export const ROLLBACK_WINDOW_MINIMUM_SUCCESSFUL_EXECUTIONS = 5;

/** The eight mode identities each already producing their own migration-readiness certificate. */
export const CutoverCertificateModes = Object.freeze([
  'agent-improvement',
  'deep-ai-council',
  'deep-alignment',
  'deep-improvement-common',
  'deep-research',
  'deep-review',
  'model-benchmark',
  'skill-benchmark',
] as const);

export type CutoverCertificateMode = typeof CutoverCertificateModes[number];

// ───────────────────────────────────────────────────────────────────
// 2. CERTIFICATE EVIDENCE
// ───────────────────────────────────────────────────────────────────

/** Every reference this certificate binds, each independently content-addressed. */
export interface CutoverCertificateEvidenceBindings extends JsonObject {
  readonly modeGateCertificateDigest: string;
  readonly shadowParityEvidenceDigest: string;
  readonly rollbackDrillCertificateDigest: string;
  readonly mixedVersionReplayDigest: string;
  readonly classificationManifestDigest: string;
  readonly migrationReceiptDigests: string[];
  readonly approvingPolicyId: string;
  readonly approvingPolicyVersion: number;
  readonly approvingPolicyDigest: string;
}

export interface CutoverCertificateFacts extends JsonObject {
  readonly schemaVersion: typeof CUTOVER_CERTIFICATE_SCHEMA_VERSION;
  readonly certificateKind: 'cutover-authorization';
  readonly mode: CutoverCertificateMode;
  readonly candidateSha: string;
  readonly fromAuthorityState: 'cutover_ready';
  readonly toAuthorityState: 'new_authoritative_reversible';
  readonly fromAuthorityEpoch: number;
  readonly toAuthorityEpoch: number;
  readonly transitionDigest: string;
  readonly evidence: CutoverCertificateEvidenceBindings;
  readonly issuer: string;
  readonly issuedAt: string;
  readonly unresolvedBlockerCount: 0;
  readonly authorityMutation: false;
}

export interface CutoverCertificate extends JsonObject {
  readonly facts: CutoverCertificateFacts;
  readonly certificateDigest: string;
}

/** Already independently verified upstream artifacts this certificate binds by reference. */
export interface CutoverCertificateEvidenceSources {
  readonly modeGateCertificate: Readonly<{
    mode: CutoverCertificateMode;
    candidateSha: string;
    authorityEpoch: number;
    readiness: string;
    certificateDigest: string;
  }>;
  readonly shadowParity: Readonly<{
    mode: CutoverCertificateMode;
    candidateSha: string;
    exitStatus: string;
    evidenceDigest: string;
  }>;
  readonly rollbackDrillCertificate: RollbackDrillCertificate;
  readonly mixedVersionReplay: MixedVersionOraclePass;
  readonly classificationManifest: InflightClassificationManifest;
  readonly migrationReceipts: readonly BoundaryReceiptPayload[];
  readonly approvingPolicy: RegisteredTransitionPolicy;
}

export interface CutoverCertificateRequest {
  readonly mode: CutoverCertificateMode;
  readonly candidateSha: string;
  readonly fromAuthorityEpoch: number;
  readonly issuer: string;
  readonly issuedAt: string;
  readonly evidence: CutoverCertificateEvidenceSources;
}

export type CutoverCertificateRejectionReasonCode =
  | 'AUTHORITY_EPOCH_INVALID'
  | 'CANDIDATE_SHA_INVALID'
  | 'CANDIDATE_SHA_MISMATCH'
  | 'CERTIFICATE_MALFORMED'
  | 'CLASSIFICATION_MANIFEST_INVALID'
  | 'MIGRATION_RECEIPT_INVALID'
  | 'MIXED_VERSION_REPLAY_FAILED'
  | 'MODE_MISMATCH'
  | 'PARITY_NOT_GREEN'
  | 'POLICY_INVALID'
  | 'READINESS_NOT_READY'
  | 'ROLLBACK_DRILL_NOT_PASSED';

export type CutoverCertificateAssemblyResult =
  | Readonly<{ verdict: 'issued'; certificate: CutoverCertificate }>
  | Readonly<{ verdict: 'rejected'; reasonCode: CutoverCertificateRejectionReasonCode }>;

export interface CutoverCertificateVerificationExpectation {
  readonly mode: CutoverCertificateMode;
  readonly candidateSha: string;
  readonly fromAuthorityEpoch: number;
  readonly policyId: string;
  readonly policyVersion: number;
  readonly policyDigest: string;
}

export type CutoverCertificateVerificationResult =
  | Readonly<{ verdict: 'valid' }>
  | Readonly<{ verdict: 'rejected'; reasonCode: CutoverCertificateRejectionReasonCode }>;

// ───────────────────────────────────────────────────────────────────
// 3. ROLLBACK WINDOW
// ───────────────────────────────────────────────────────────────────

export interface RollbackWindowExecution {
  readonly executionId: string;
  readonly authorityState: AuthorityState;
  readonly authorityEpoch: number;
  readonly result: 'trusted-completion' | 'blocked' | 'failed' | 'incomplete' | 'abstained';
  readonly certificateDigest: string;
}

export interface RollbackWindowOpenRequest {
  readonly mode: CutoverCertificateMode;
  readonly cutoverCertificateDigest: string;
  readonly rollbackAnchorDigest: string;
  readonly retainedLegacyAssetDigests: readonly string[];
  readonly openedAt: string;
  readonly openingAuthorityEpoch: number;
}

export interface RollbackWindowRecord {
  readonly mode: CutoverCertificateMode;
  readonly cutoverCertificateDigest: string;
  readonly rollbackAnchorDigest: string;
  readonly retainedLegacyAssetDigests: readonly string[];
  readonly openedAt: string;
  readonly openingAuthorityEpoch: number;
  readonly monitorCursor: string;
  readonly recordDigest: string;
}

export interface RollbackWindowEvaluationInput {
  readonly evaluatedAt: string;
  readonly executions: readonly RollbackWindowExecution[];
  readonly unresolvedEvidenceCount: number;
  readonly lowTraffic: boolean;
}

export interface RollbackWindowEvaluation {
  readonly state: 'open' | 'extended' | 'eligible_to_close';
  readonly elapsedCalendarDays: number;
  readonly successfulAuthoritativeExecutions: number;
  readonly minimumCalendarDays: typeof ROLLBACK_WINDOW_MINIMUM_CALENDAR_DAYS;
  readonly minimumSuccessfulAuthoritativeExecutions:
    typeof ROLLBACK_WINDOW_MINIMUM_SUCCESSFUL_EXECUTIONS;
  readonly unresolvedEvidenceCount: number;
  readonly lowTraffic: boolean;
  readonly evaluationDigest: string;
}

// ───────────────────────────────────────────────────────────────────
// 4. MONITORED SIGNALS AND REVERT DECISION
// ───────────────────────────────────────────────────────────────────

export const MonitoredSignalFamilies = Object.freeze([
  'health',
  'parity-drift',
  'replay',
  'authorization',
  'receipt',
  'budget',
  'state-reconciliation',
] as const);

export type MonitoredSignalFamily = typeof MonitoredSignalFamilies[number];

export type MonitoredSignalSeverity = 'clear' | 'warning' | 'revert';

export interface MonitoredSignalReading {
  readonly family: MonitoredSignalFamily;
  readonly severity: MonitoredSignalSeverity;
  readonly observedAt: string;
  readonly evidenceDigest: string;
  readonly reasonCode: string | null;
}

export type RollbackWindowSignalDecisionKind = 'continue' | 'extend' | 'operator_stop' | 'revert';

export interface RollbackWindowSignalDecision {
  readonly decision: RollbackWindowSignalDecisionKind;
  readonly triggeredBy: readonly MonitoredSignalFamily[];
  readonly reasonCodes: readonly string[];
  readonly decisionDigest: string;
}

// ───────────────────────────────────────────────────────────────────
// 5. REVERT AND CLOSURE
// ───────────────────────────────────────────────────────────────────

export interface RollbackRevertSequenceRequest {
  readonly windowRecord: RollbackWindowRecord;
  readonly triggerDecision: RollbackWindowSignalDecision;
  readonly admissionsFrozenAt: string;
  readonly spineFencedAt: string;
  readonly reconciliationDigest: string;
  readonly restoredAuthorityEpoch: number;
  readonly retainedEventCountBefore: number;
  readonly retainedEventCountAfter: number;
  readonly retainedArtifactCountBefore: number;
  readonly retainedArtifactCountAfter: number;
  readonly rollbackCertificateDigest: string;
}

export interface RollbackRevertSequenceRecord {
  readonly mode: CutoverCertificateMode;
  readonly windowRecordDigest: string;
  readonly triggerDecision: RollbackWindowSignalDecision;
  readonly admissionsFrozenAt: string;
  readonly spineFencedAt: string;
  readonly reconciliationDigest: string;
  readonly restoredAuthorityState: 'legacy_authoritative';
  readonly restoredAuthorityEpoch: number;
  readonly retainedEventCountBefore: number;
  readonly retainedEventCountAfter: number;
  readonly retainedArtifactCountBefore: number;
  readonly retainedArtifactCountAfter: number;
  readonly eventDeletionCount: 0;
  readonly artifactRewriteCount: 0;
  readonly rollbackCertificateDigest: string;
  readonly recordDigest: string;
}

export interface RollbackWindowClosureRequest {
  readonly windowRecord: RollbackWindowRecord;
  readonly evaluation: RollbackWindowEvaluation;
  readonly signalDecision: RollbackWindowSignalDecision;
  readonly closureDecidedAt: string;
}

export interface RollbackWindowClosureFacts {
  readonly mode: CutoverCertificateMode;
  readonly windowRecordDigest: string;
  readonly finalEvaluation: RollbackWindowEvaluation;
  readonly successfulAuthoritativeExecutions: number;
  readonly retainedAssetDigests: readonly string[];
  readonly closureDecidedAt: string;
  readonly handoffReady: true;
}

export interface RollbackWindowClosureEvidence {
  readonly facts: RollbackWindowClosureFacts;
  readonly certification: CertificationEnvelope;
  readonly closureDigest: string;
}

export type RollbackWindowRejectionReasonCode =
  | 'CROSS_MODE_REJECTED'
  | 'DESTRUCTIVE_ROLLBACK_REJECTED'
  | 'DUPLICATE_CONFLICTING_RECORD'
  | 'RECORD_MALFORMED'
  | 'STALE_TRIGGER_DECISION'
  | 'UNRESOLVED_SIGNAL'
  | 'WINDOW_NOT_ELIGIBLE';

export type RollbackRevertSequenceResult =
  | Readonly<{ verdict: 'recorded'; record: RollbackRevertSequenceRecord }>
  | Readonly<{ verdict: 'rejected'; reasonCode: RollbackWindowRejectionReasonCode }>;

export type RollbackWindowClosureResult =
  | Readonly<{ verdict: 'closed'; closure: RollbackWindowClosureEvidence }>
  | Readonly<{ verdict: 'rejected'; reasonCode: RollbackWindowRejectionReasonCode }>;
