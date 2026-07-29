// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Resume Adapter Types
// ───────────────────────────────────────────────────────────────────

import type {
  AppendOnlyLedger,
  DurableAppendReceipt,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../authorized-ledger/index.js';
import type {
  DeepReviewCertificateBundle,
} from '../deep-review-certificates/index.js';
import type {
  DeepReviewCompatibilityStatus,
} from '../deep-review-ledger-schema/index.js';
import type {
  DeepReviewProjectionCheckpoint,
  DeepReviewProjectionState,
  DeepReviewRebuildReasonCode,
} from '../deep-review-reducers/index.js';
import type {
  EventProducer,
  EventTypeRegistry,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  CertificationProviderRegistry,
} from '../receipts-and-effect-recovery/index.js';
import type {
  DeriveReplayFingerprintInput,
  FingerprintVersionRegistry,
} from '../replay-fingerprint/index.js';
import type {
  SealedArtifactStore,
} from '../sealed-reference-artifacts/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED INPUT CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepReviewResumeCompatibilityComponent =
  | 'adapter'
  | 'codec'
  | 'manifest'
  | 'model'
  | 'policy'
  | 'reducer'
  | 'replay'
  | 'schema'
  | 'target'
  | 'tool';

export interface DeepReviewResumeFingerprint {
  readonly fingerprintVersion: number;
  readonly manifestRevision: string;
  readonly targetDigest: string;
  readonly toolVersion: string;
  readonly modelVersion: string;
  readonly reducerVersion: string;
  readonly adapterVersion: string;
  readonly schemaVersion: string;
  readonly codecVersion: string;
  readonly policyVersion: string;
  readonly replayFingerprint: string;
  readonly certificateDigest: string;
  readonly finalDigest: string;
}

export interface DeepReviewMigrationRegistryEntry {
  readonly component: DeepReviewResumeCompatibilityComponent;
  readonly fromVersion: string;
  readonly toVersion: string;
  readonly outcome: 'compatible' | 'migrate' | 'pin-old-runtime';
  readonly revision: string;
}

export interface DeepReviewAuthenticatedMigrationRegistry {
  readonly registryVersion: 1;
  readonly authorityEpoch: number;
  readonly entries: readonly DeepReviewMigrationRegistryEntry[];
  readonly registryDigest: string;
}

export interface DeepReviewPersistedRunLease {
  readonly runId: string;
  readonly sessionId: string;
  readonly leaseId: string;
  readonly generation: number;
  readonly deadlineAt: string;
  readonly remainingMs: number;
  readonly replayFingerprint: string;
}

export interface DeepReviewResumeRequest {
  readonly runId: string;
  readonly manifestRevision: string;
  readonly idempotencyKey: string;
  readonly requestedAt: string;
  readonly resumeReason: string;
  readonly persistedFingerprint: DeepReviewResumeFingerprint;
  readonly currentFingerprint: DeepReviewResumeFingerprint;
  readonly lease: DeepReviewPersistedRunLease;
  readonly checkpoint: DeepReviewProjectionCheckpoint | null;
  readonly priorCertificateBundle: DeepReviewCertificateBundle;
}

export type DeepReviewReplayProjection = DeepReviewProjectionState & JsonObject;

export interface DeepReviewResumeAdapterOptions {
  readonly ledger: AppendOnlyLedger;
  readonly effectLedger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  readonly policies: TransitionPolicyRegistry;
  readonly eventRegistry: EventTypeRegistry;
  readonly fingerprintVersions: FingerprintVersionRegistry;
  readonly artifactStore: SealedArtifactStore;
  readonly certificateReplay: DeriveReplayFingerprintInput<DeepReviewReplayProjection>;
  readonly certificateProviders: CertificationProviderRegistry;
  readonly installedFingerprint: DeepReviewResumeFingerprint;
  readonly migrationRegistry: DeepReviewAuthenticatedMigrationRegistry;
  readonly trustedMigrationRegistryDigest: string;
  readonly producer: EventProducer;
  readonly policyId: string;
  readonly policyVersion: number;
  readonly actorId: string;
  readonly capabilityId: string;
  readonly authorityEpoch: number;
  readonly priorStateVersion: string;
  readonly enableDarkDispatch?: boolean;
  readonly passDispatcher?: DeepReviewPassDispatcher;
}

// ───────────────────────────────────────────────────────────────────
// 2. DECISION ALGEBRA
// ───────────────────────────────────────────────────────────────────

export type DeepReviewResumeDisposition =
  | 'reuse'
  | 'reexecute'
  | 'compensate'
  | 'reconcile'
  | 'reject'
  | 'blocked';

export type DeepReviewResumeReuseDisposition =
  | 'exact-reuse'
  | 'compatible'
  | 'migrate'
  | 'pin-old-runtime'
  | 'blocked';

export type DeepReviewManifestDisposition =
  | 'original'
  | 'restart'
  | 'reject';

export interface DeepReviewCompatibilityComponentDecision {
  readonly component: DeepReviewResumeCompatibilityComponent;
  readonly persistedVersion: string;
  readonly installedVersion: string;
  readonly outcome: DeepReviewCompatibilityStatus;
  readonly revision: string | null;
  readonly decisionReason: string;
}

export interface DeepReviewPassResumeDecision {
  readonly logicalPassId: string;
  readonly iterationId: string;
  readonly dimensionId: string;
  readonly passNumber: number;
  readonly manifestRevision: string;
  readonly retryKey: string;
  readonly disposition: 'reuse' | 'reexecute' | 'reject';
  readonly attemptId: string | null;
  readonly evidenceEventIds: readonly string[];
  readonly decisionReason: string;
}

export interface DeepReviewEffectResumeDecision {
  readonly effectId: string;
  readonly logicalEffectId: string;
  readonly applicationState: 'applied' | 'not-applied' | 'unknown';
  readonly disposition: 'reuse' | 'reexecute' | 'reconcile' | 'blocked';
  readonly attemptRefs: readonly string[];
  readonly nextAttemptId: string | null;
  readonly decisionReason: string;
}

export interface DeepReviewInvalidationDecision {
  readonly targetChanged: boolean;
  readonly reopenedDimensionIds: readonly string[];
  readonly invalidatedFindingIds: readonly string[];
  readonly reopenedObligationIds: readonly string[];
  readonly convergenceReopened: boolean;
  readonly reportReopened: boolean;
}

export interface DeepReviewResumeDecision {
  readonly decisionVersion: 1;
  readonly decisionId: string;
  readonly decisionDigest: string;
  readonly authority: 'dark-evidence-only';
  readonly legacyAuthority: 'unchanged';
  readonly productionCompletion: false;
  readonly reuseDisposition: DeepReviewResumeReuseDisposition;
  readonly compatibilityOutcome: DeepReviewCompatibilityStatus;
  readonly manifestDisposition: DeepReviewManifestDisposition;
  readonly compatibility: readonly DeepReviewCompatibilityComponentDecision[];
  readonly passes: readonly DeepReviewPassResumeDecision[];
  readonly effects: readonly DeepReviewEffectResumeDecision[];
  readonly invalidation: DeepReviewInvalidationDecision;
  readonly lease: DeepReviewPersistedRunLease;
  readonly priorCertificateDigest: string;
  readonly receiptChainDigest: string;
  readonly artifactSetDigest: string;
  readonly decisionReason: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. CONTINUITY PROJECTION
// ───────────────────────────────────────────────────────────────────

export type DeepReviewContinuityStep =
  | 'init'
  | 'scope'
  | 'dimension-pass'
  | 'findings/evidence'
  | 'convergence'
  | 'review-report'
  | 'continuity-save';

export interface DeepReviewContinuityLadderRow {
  readonly step: DeepReviewContinuityStep;
  readonly eventFamilies: readonly string[];
  readonly reducerFields: readonly string[];
  readonly reentryActions: readonly DeepReviewResumeDisposition[];
}

export interface DeepReviewContinuityProjection {
  readonly authority: 'shadow-only';
  readonly productionCompletion: false;
  readonly runId: string;
  readonly sessionId: string;
  readonly generation: number;
  readonly lastAppliedSeq: number;
  readonly seenEventIds: readonly string[];
  readonly currentStep: DeepReviewContinuityStep;
  readonly initialized: boolean;
  readonly orderedDimensionIds: readonly string[];
  readonly activeDimensionId: string | null;
  readonly activePassId: string | null;
  readonly unresolvedCandidateIds: readonly string[];
  readonly unresolvedEvidenceIds: readonly string[];
  readonly unresolvedObligationIds: readonly string[];
  readonly convergenceOutcome: 'active' | 'blocked' | 'converged' | 'incomplete';
  readonly reportState: 'none' | 'started' | 'committed' | 'rebuild-required';
  readonly reportRevision: string | null;
  readonly continuitySaveState: 'none' | 'requested' | 'completed' | 'failed' | 'reconcile';
  readonly terminalState: 'active' | 'blocked' | 'completed' | 'failed' | 'incomplete';
  readonly incomplete: boolean;
}

export interface DeepReviewAuthenticatedTail {
  readonly ledgerId: string;
  readonly ledgerSequence: number;
  readonly recordHash: string;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly eventCount: number;
}

export interface DeepReviewResumeExecutionPoolEntry {
  readonly logicalPassId: string;
  readonly iterationId: string;
  readonly dimensionId: string;
  readonly passNumber: number;
  readonly manifestRevision: string;
  readonly retryKey: string;
  readonly attemptId: string;
}

export interface DeepReviewResumeResult {
  readonly status: 'appended' | 'idempotent';
  readonly decision: DeepReviewResumeDecision;
  readonly continuity: DeepReviewContinuityProjection;
  readonly projection: DeepReviewProjectionState;
  readonly checkpoint: DeepReviewProjectionCheckpoint;
  readonly authenticatedTail: DeepReviewAuthenticatedTail;
  readonly executionPool: readonly DeepReviewResumeExecutionPoolEntry[];
  readonly appendReceipt: DurableAppendReceipt;
  readonly dispatchedPasses: number;
}

export type DeepReviewResumeRebuildReasonCode =
  | DeepReviewRebuildReasonCode
  | 'certificate-frontier-mismatch'
  | 'prior-certificate-incomplete'
  | 'prior-certificate-invalid'
  | 'prior-certificate-unverifiable';

export interface DeepReviewResumeRebuildRequiredResult {
  readonly status: 'rebuild_required';
  readonly reasonCodes: readonly DeepReviewResumeRebuildReasonCode[];
  readonly authenticatedTail: DeepReviewAuthenticatedTail | null;
}

export type DeepReviewResumeAdapterResult =
  | DeepReviewResumeResult
  | DeepReviewResumeRebuildRequiredResult;

export interface DeepReviewPassDispatcher {
  dispatch(entry: DeepReviewResumeExecutionPoolEntry): Promise<void>;
}
