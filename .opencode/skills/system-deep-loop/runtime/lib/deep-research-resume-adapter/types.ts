// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Resume Adapter Types
// ───────────────────────────────────────────────────────────────────

import type {
  AppendOnlyLedger,
  DurableAppendReceipt,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../authorized-ledger/index.js';
import type {
  DeepResearchCompatibilityStatus,
} from '../deep-research-ledger-schema/index.js';
import type {
  DeepResearchTransitionReceipt,
} from '../deep-research-certificates/index.js';
import type {
  DeepResearchProjectionCheckpoint,
  DeepResearchProjectionState,
  DeepResearchRebuildReasonCode,
} from '../deep-research-reducers/index.js';
import type {
  DeepResearchSealedArtifactBinding,
} from '../deep-research-sealed-artifacts/index.js';
import type {
  EventProducer,
  EventTypeRegistry,
} from '../event-envelope/index.js';
import type { FingerprintVersionRegistry } from '../replay-fingerprint/index.js';
import type { SealedArtifactStore } from '../sealed-reference-artifacts/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED INPUT CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepResearchResumeCompatibilityComponent =
  | 'adapter'
  | 'codec'
  | 'manifest'
  | 'policy'
  | 'reducer'
  | 'schema';

export interface DeepResearchResumeFingerprint {
  readonly fingerprintVersion: number;
  readonly manifestRevision: string;
  readonly reducerVersion: string;
  readonly adapterVersion: string;
  readonly schemaVersion: string;
  readonly codecVersion: string;
  readonly policyVersion: string;
  readonly finalDigest: string;
}

export interface DeepResearchResumeCompatibilityRule {
  readonly component: DeepResearchResumeCompatibilityComponent;
  readonly fromVersion: string;
  readonly toVersion: string;
  readonly outcome: 'compatible' | 'migrate' | 'pin-old-runtime';
  readonly revision: string;
}

export interface DeepResearchPersistedRunLease {
  readonly runId: string;
  readonly leaseId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly deadlineAt: string;
  readonly remainingMs: number;
  readonly replayFingerprint: string;
}

export interface DeepResearchResumeRequest {
  readonly runId: string;
  readonly manifestRevision: string;
  readonly idempotencyKey: string;
  readonly requestedAt: string;
  readonly resumeReason: string;
  readonly persistedFingerprint: DeepResearchResumeFingerprint;
  readonly installedFingerprint: DeepResearchResumeFingerprint;
  readonly compatibilityRules: readonly DeepResearchResumeCompatibilityRule[];
  readonly lease: DeepResearchPersistedRunLease;
  readonly checkpoint: DeepResearchProjectionCheckpoint | null;
  readonly artifactBindings: readonly DeepResearchSealedArtifactBinding[];
  readonly transitionReceipts: readonly DeepResearchTransitionReceipt[];
}

export interface DeepResearchResumeAdapterOptions {
  readonly ledger: AppendOnlyLedger;
  readonly effectLedger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  readonly policies: TransitionPolicyRegistry;
  readonly eventRegistry: EventTypeRegistry;
  readonly fingerprintVersions: FingerprintVersionRegistry;
  readonly artifactStore: SealedArtifactStore;
  readonly producer: EventProducer;
  readonly policyId: string;
  readonly policyVersion: number;
  readonly actorId: string;
  readonly capabilityId: string;
  readonly authorityEpoch: number;
  readonly priorStateVersion: string;
  readonly enableDarkDispatch?: boolean;
  readonly branchDispatcher?: DeepResearchBranchDispatcher;
}

// ───────────────────────────────────────────────────────────────────
// 2. DECISION ALGEBRA
// ───────────────────────────────────────────────────────────────────

export type DeepResearchResumeDisposition =
  | 'reuse'
  | 'reexecute'
  | 'compensate'
  | 'reconcile'
  | 'reject'
  | 'blocked';

export type DeepResearchManifestDisposition =
  | 'original'
  | 'restart'
  | 'reject';

export interface DeepResearchCompatibilityComponentDecision {
  readonly component: DeepResearchResumeCompatibilityComponent;
  readonly persistedVersion: string;
  readonly installedVersion: string;
  readonly outcome: DeepResearchCompatibilityStatus;
  readonly revision: string | null;
  readonly decisionReason: string;
}

export interface DeepResearchBranchResumeDecision {
  readonly logicalLeafId: string;
  readonly manifestRevision: string;
  readonly retryKey: string;
  readonly disposition: 'reuse' | 'reexecute' | 'compensate' | 'reject';
  readonly attemptId: string | null;
  readonly evidenceEventIds: readonly string[];
  readonly decisionReason: string;
}

export interface DeepResearchEffectResumeDecision {
  readonly effectId: string;
  readonly logicalEffectId: string;
  readonly disposition: 'reexecute' | 'compensate' | 'reconcile' | 'blocked';
  readonly attemptRefs: readonly string[];
  readonly nextAttemptId: string | null;
  readonly decisionReason: string;
}

export interface DeepResearchInvalidationDecision {
  readonly changedSourceVersionIds: readonly string[];
  readonly invalidatedEvidenceIds: readonly string[];
  readonly invalidatedClaimVersionIds: readonly string[];
  readonly reopenedQuestionIds: readonly string[];
  readonly reopenedLogicalLeafIds: readonly string[];
  readonly synthesisReopened: boolean;
}

export interface DeepResearchResumeDecision {
  readonly decisionVersion: 1;
  readonly decisionId: string;
  readonly decisionDigest: string;
  readonly authority: 'dark-evidence-only';
  readonly legacyAuthority: 'unchanged';
  readonly productionCompletion: false;
  readonly compatibilityOutcome: DeepResearchCompatibilityStatus;
  readonly manifestDisposition: DeepResearchManifestDisposition;
  readonly compatibility: readonly DeepResearchCompatibilityComponentDecision[];
  readonly branches: readonly DeepResearchBranchResumeDecision[];
  readonly effects: readonly DeepResearchEffectResumeDecision[];
  readonly invalidation: DeepResearchInvalidationDecision;
  readonly lease: DeepResearchPersistedRunLease;
  readonly forensicReceiptDigests: readonly string[];
  readonly verifiedArtifactDigests: readonly string[];
  readonly decisionReason: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. CONTINUITY PROJECTION
// ───────────────────────────────────────────────────────────────────

export type DeepResearchContinuityStep =
  | 'init'
  | 'plan/frontier'
  | 'gather/analyze'
  | 'convergence'
  | 'synthesis'
  | 'memory-save';

export interface DeepResearchContinuityLadderRow {
  readonly step: DeepResearchContinuityStep;
  readonly eventFamilies: readonly string[];
  readonly reducerFields: readonly string[];
  readonly reentryActions: readonly DeepResearchResumeDisposition[];
}

export interface DeepResearchContinuityProjection {
  readonly authority: 'shadow-only';
  readonly productionCompletion: false;
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly lastAppliedSeq: number;
  readonly seenEventIds: readonly string[];
  readonly currentStep: DeepResearchContinuityStep;
  readonly initialized: boolean;
  readonly plannedLogicalLeafIds: readonly string[];
  readonly selectedLogicalLeafIds: readonly string[];
  readonly sourceVersionIds: readonly string[];
  readonly admittedEvidenceIds: readonly string[];
  readonly activeClaimVersionIds: readonly string[];
  readonly contradictionClaimVersionIds: readonly string[];
  readonly convergenceOutcome: 'active' | 'blocked' | 'converged' | 'incomplete' | 'quarantined';
  readonly convergenceFinalizedRevision: string | null;
  readonly synthesisState: 'none' | 'started' | 'committed' | 'rebuild-required';
  readonly synthesisRevision: string | null;
  readonly memorySaveState: 'none' | 'requested' | 'completed' | 'failed' | 'reconcile';
  readonly memorySaveRevision: string | null;
  readonly terminalState: 'active' | 'blocked' | 'completed' | 'failed' | 'incomplete' | 'quarantined';
  readonly incomplete: boolean;
}

export interface DeepResearchAuthenticatedTail {
  readonly ledgerId: string;
  readonly ledgerSequence: number;
  readonly recordHash: string;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly eventCount: number;
}

export interface DeepResearchResumeExecutionPoolEntry {
  readonly logicalLeafId: string;
  readonly manifestRevision: string;
  readonly retryKey: string;
  readonly attemptId: string;
}

export interface DeepResearchResumeResult {
  readonly status: 'appended' | 'idempotent';
  readonly decision: DeepResearchResumeDecision;
  readonly continuity: DeepResearchContinuityProjection;
  readonly projection: DeepResearchProjectionState;
  readonly checkpoint: DeepResearchProjectionCheckpoint;
  readonly authenticatedTail: DeepResearchAuthenticatedTail;
  readonly executionPool: readonly DeepResearchResumeExecutionPoolEntry[];
  readonly appendReceipt: DurableAppendReceipt;
  readonly dispatchedBranches: number;
}

export interface DeepResearchResumeRebuildRequiredResult {
  readonly status: 'rebuild_required';
  readonly reasonCodes: readonly DeepResearchRebuildReasonCode[];
  readonly authenticatedTail: DeepResearchAuthenticatedTail;
}

export type DeepResearchResumeAdapterResult =
  | DeepResearchResumeResult
  | DeepResearchResumeRebuildRequiredResult;

export interface DeepResearchBranchDispatcher {
  dispatch(entry: DeepResearchResumeExecutionPoolEntry): Promise<void>;
}
