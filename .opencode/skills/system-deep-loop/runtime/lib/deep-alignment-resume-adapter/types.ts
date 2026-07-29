// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Resume Adapter Types
// ───────────────────────────────────────────────────────────────────

import type {
  AppendOnlyLedger,
  DurableAppendReceipt,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../authorized-ledger/index.js';
import type {
  DeepAlignmentCertificateBundle,
} from '../deep-alignment-certificates/index.js';
import type {
  DeepAlignmentProjectionCheckpoint,
  DeepAlignmentProjectionState,
  DeepAlignmentRebuildReasonCode,
} from '../deep-alignment-reducers/index.js';
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

export type DeepAlignmentResumeCompatibilityComponent =
  | 'adapter'
  | 'authority'
  | 'codec'
  | 'manifest'
  | 'model'
  | 'policy'
  | 'reducer'
  | 'replay'
  | 'schema'
  | 'target'
  | 'tool'
  | 'verifier';

export interface DeepAlignmentResumeFingerprint {
  readonly fingerprintVersion: number;
  readonly manifestRevision: string;
  readonly authorityEpochId: string;
  readonly targetDigest: string;
  readonly toolVersion: string;
  readonly modelVersion: string;
  readonly verifierVersion: string;
  readonly reducerVersion: string;
  readonly adapterVersion: string;
  readonly schemaVersion: string;
  readonly codecVersion: string;
  readonly policyVersion: string;
  readonly replayFingerprint: string;
  readonly certificateDigest: string;
  readonly finalDigest: string;
}

export interface DeepAlignmentMigrationRegistryEntry {
  readonly component: DeepAlignmentResumeCompatibilityComponent;
  readonly fromVersion: string;
  readonly toVersion: string;
  readonly outcome: 'compatible' | 'migrate' | 'pin-old-runtime';
  readonly revision: string;
}

export interface DeepAlignmentAuthenticatedMigrationRegistry {
  readonly registryVersion: 1;
  readonly authorityEpoch: number;
  readonly entries: readonly DeepAlignmentMigrationRegistryEntry[];
  readonly registryDigest: string;
}

export interface DeepAlignmentPersistedRunLease {
  readonly runId: string;
  readonly sessionId: string;
  readonly leaseId: string;
  readonly generation: number;
  readonly deadlineAt: string;
  readonly remainingMs: number;
  readonly replayFingerprint: string;
}

export interface DeepAlignmentResumeRequest {
  readonly runId: string;
  readonly manifestRevision: string;
  readonly idempotencyKey: string;
  readonly requestedAt: string;
  readonly resumeReason: string;
  readonly persistedFingerprint: DeepAlignmentResumeFingerprint;
  readonly currentFingerprint: DeepAlignmentResumeFingerprint;
  readonly lease: DeepAlignmentPersistedRunLease;
  readonly checkpoint: DeepAlignmentProjectionCheckpoint | null;
  readonly priorCertificateBundle: DeepAlignmentCertificateBundle;
}

export type DeepAlignmentReplayProjection = DeepAlignmentProjectionState & JsonObject;

export interface DeepAlignmentResumeAdapterOptions {
  readonly ledger: AppendOnlyLedger;
  readonly effectLedger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  readonly policies: TransitionPolicyRegistry;
  readonly eventRegistry: EventTypeRegistry;
  readonly fingerprintVersions: FingerprintVersionRegistry;
  readonly artifactStore: SealedArtifactStore;
  readonly certificateReplay: DeriveReplayFingerprintInput<DeepAlignmentReplayProjection>;
  readonly certificateProviders: CertificationProviderRegistry;
  readonly installedFingerprint: DeepAlignmentResumeFingerprint;
  readonly migrationRegistry: DeepAlignmentAuthenticatedMigrationRegistry;
  readonly trustedMigrationRegistryDigest: string;
  readonly producer: EventProducer;
  readonly policyId: string;
  readonly policyVersion: number;
  readonly actorId: string;
  readonly capabilityId: string;
  readonly authorityEpoch: number;
  readonly priorStateVersion: string;
  readonly enableDarkDispatch?: boolean;
  readonly branchDispatcher?: DeepAlignmentBranchDispatcher;
}

// ───────────────────────────────────────────────────────────────────
// 2. DECISION ALGEBRA
// ───────────────────────────────────────────────────────────────────

export type DeepAlignmentResumeDisposition =
  | 'reuse'
  | 'reexecute'
  | 'compensate'
  | 'reconcile'
  | 'reject'
  | 'blocked';

export type DeepAlignmentResumeReuseDisposition =
  | 'exact-reuse'
  | 'compatible'
  | 'migrate'
  | 'pin-old-runtime'
  | 'blocked';

export type DeepAlignmentResumeCompatibilityOutcome =
  | 'exact'
  | 'compatible'
  | 'migrate'
  | 'pin-old-runtime'
  | 'blocked';

export type DeepAlignmentManifestDisposition =
  | 'original'
  | 'restart'
  | 'reject';

export interface DeepAlignmentCompatibilityComponentDecision {
  readonly component: DeepAlignmentResumeCompatibilityComponent;
  readonly persistedVersion: string;
  readonly installedVersion: string;
  readonly outcome: DeepAlignmentResumeCompatibilityOutcome;
  readonly revision: string | null;
  readonly decisionReason: string;
}

export interface DeepAlignmentBranchResumeDecision {
  readonly logicalBranchId: string;
  readonly iterationId: string;
  readonly laneId: string;
  readonly authorityEpochId: string;
  readonly subjectSnapshotDigest: string | null;
  readonly manifestRevision: string;
  readonly retryKey: string;
  readonly disposition: 'reuse' | 'reexecute' | 'reconcile' | 'reject';
  readonly attemptId: string | null;
  readonly evidenceEventIds: readonly string[];
  readonly decisionReason: string;
}

export interface DeepAlignmentEffectResumeDecision {
  readonly effectId: string;
  readonly logicalEffectId: string;
  readonly applicationState: 'applied' | 'not-applied' | 'unknown';
  readonly disposition: 'reuse' | 'reexecute' | 'reconcile' | 'blocked';
  readonly attemptRefs: readonly string[];
  readonly nextAttemptId: string | null;
  readonly decisionReason: string;
}

export interface DeepAlignmentInvalidationDecision {
  readonly targetChanged: boolean;
  readonly authorityChanged: boolean;
  readonly verifierChanged: boolean;
  readonly reopenedLaneIds: readonly string[];
  readonly invalidatedFindingIds: readonly string[];
  readonly reopenedObligationIds: readonly string[];
  readonly reopenedProofIds: readonly string[];
  readonly convergenceReopened: boolean;
  readonly reportReopened: boolean;
}

export interface DeepAlignmentResumeDecision {
  readonly decisionVersion: 1;
  readonly decisionId: string;
  readonly decisionDigest: string;
  readonly authority: 'dark-evidence-only';
  readonly legacyAuthority: 'unchanged';
  readonly productionCompletion: false;
  readonly reuseDisposition: DeepAlignmentResumeReuseDisposition;
  readonly compatibilityOutcome: DeepAlignmentResumeCompatibilityOutcome;
  readonly manifestDisposition: DeepAlignmentManifestDisposition;
  readonly compatibility: readonly DeepAlignmentCompatibilityComponentDecision[];
  readonly branches: readonly DeepAlignmentBranchResumeDecision[];
  readonly effects: readonly DeepAlignmentEffectResumeDecision[];
  readonly invalidation: DeepAlignmentInvalidationDecision;
  readonly lease: DeepAlignmentPersistedRunLease;
  readonly priorCertificateDigest: string;
  readonly receiptChainDigest: string;
  readonly artifactSetDigest: string;
  readonly decisionReason: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. CONTINUITY PROJECTION
// ───────────────────────────────────────────────────────────────────

export type DeepAlignmentContinuityStep =
  | 'init'
  | 'authority'
  | 'lane/scope'
  | 'observation/evidence'
  | 'finding/proof'
  | 'adjudication/deviation'
  | 'convergence'
  | 'report/handoff';

export interface DeepAlignmentContinuityLadderRow {
  readonly step: DeepAlignmentContinuityStep;
  readonly eventFamilies: readonly string[];
  readonly reducerFields: readonly string[];
  readonly reentryActions: readonly DeepAlignmentResumeDisposition[];
}

export interface DeepAlignmentContinuityProjection {
  readonly authority: 'shadow-only';
  readonly productionCompletion: false;
  readonly runId: string;
  readonly sessionId: string;
  readonly generation: number;
  readonly authorityEpochId: string | null;
  readonly lastAppliedSeq: number;
  readonly seenEventIds: readonly string[];
  readonly currentStep: DeepAlignmentContinuityStep;
  readonly initialized: boolean;
  readonly orderedLaneIds: readonly string[];
  readonly activeLaneId: string | null;
  readonly activeSubjectId: string | null;
  readonly activeRuleId: string | null;
  readonly unresolvedObservationIds: readonly string[];
  readonly unresolvedFindingIds: readonly string[];
  readonly unresolvedProofIds: readonly string[];
  readonly unresolvedObligationIds: readonly string[];
  readonly convergenceOutcome: 'active' | 'blocked' | 'converged' | 'incomplete';
  readonly reportState: 'none' | 'started' | 'committed' | 'rebuild-required';
  readonly reportRevision: string | null;
  readonly continuitySaveState: 'none' | 'requested' | 'completed' | 'failed' | 'reconcile';
  readonly terminalState: 'active' | 'blocked' | 'completed' | 'failed' | 'incomplete';
  readonly incomplete: boolean;
}

export interface DeepAlignmentAuthenticatedTail {
  readonly ledgerId: string;
  readonly ledgerSequence: number;
  readonly recordHash: string;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly eventCount: number;
}

export interface DeepAlignmentResumeExecutionPoolEntry {
  readonly logicalBranchId: string;
  readonly iterationId: string;
  readonly laneId: string;
  readonly authorityEpochId: string;
  readonly subjectSnapshotDigest: string | null;
  readonly manifestRevision: string;
  readonly retryKey: string;
  readonly attemptId: string;
}

export interface DeepAlignmentResumeResult {
  readonly status: 'appended' | 'idempotent';
  readonly decision: DeepAlignmentResumeDecision;
  readonly continuity: DeepAlignmentContinuityProjection;
  readonly projection: DeepAlignmentProjectionState;
  readonly checkpoint: DeepAlignmentProjectionCheckpoint;
  readonly authenticatedTail: DeepAlignmentAuthenticatedTail;
  readonly executionPool: readonly DeepAlignmentResumeExecutionPoolEntry[];
  readonly appendReceipt: DurableAppendReceipt;
  readonly dispatchedBranches: number;
}

export type DeepAlignmentResumeRebuildReasonCode =
  | DeepAlignmentRebuildReasonCode
  | 'certificate-frontier-mismatch'
  | 'prior-certificate-incomplete'
  | 'prior-certificate-invalid'
  | 'prior-certificate-unverifiable';

export interface DeepAlignmentResumeRebuildRequiredResult {
  readonly status: 'rebuild_required';
  readonly reasonCodes: readonly DeepAlignmentResumeRebuildReasonCode[];
  readonly authenticatedTail: DeepAlignmentAuthenticatedTail | null;
}

export type DeepAlignmentResumeAdapterResult =
  | DeepAlignmentResumeResult
  | DeepAlignmentResumeRebuildRequiredResult;

export interface DeepAlignmentBranchDispatcher {
  dispatch(entry: DeepAlignmentResumeExecutionPoolEntry): Promise<void>;
}
