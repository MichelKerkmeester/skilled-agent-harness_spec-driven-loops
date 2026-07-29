// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Resume Adapter Types
// ───────────────────────────────────────────────────────────────────

import type {
  AppendOnlyLedger,
  DurableAppendReceipt,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../authorized-ledger/index.js';
import type {
  DeepAiCouncilCertificateBundle,
} from '../deep-ai-council-certificates/index.js';
import type {
  DeepAiCouncilCompatibilityStatus,
} from '../deep-ai-council-ledger-schema/index.js';
import type {
  DeepAiCouncilProjectionCheckpoint,
  DeepAiCouncilProjectionState,
  DeepAiCouncilRebuildReasonCode,
} from '../deep-ai-council-reducers/index.js';
import type {
  EventProducer,
  EventTypeRegistry,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  CertificationProviderRegistry,
} from '../receipts-and-effect-recovery/index.js';
import type {
  FingerprintVersionRegistry,
  ReplayComponentRegistry,
  ReplayExecutionInput,
} from '../replay-fingerprint/index.js';
import type { SealedArtifactStore } from '../sealed-reference-artifacts/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED INPUT CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepAiCouncilResumeCompatibilityComponent =
  | 'adapter'
  | 'codec'
  | 'judge'
  | 'manifest'
  | 'model'
  | 'policy'
  | 'reducer'
  | 'schema'
  | 'target'
  | 'tool';

export interface DeepAiCouncilResumeFingerprint {
  readonly fingerprintVersion: number;
  readonly manifestRevision: string;
  readonly reducerVersion: string;
  readonly adapterVersion: string;
  readonly schemaVersion: string;
  readonly codecVersion: string;
  readonly policyVersion: string;
  readonly targetDigest: string;
  readonly toolFingerprint: string;
  readonly modelFingerprint: string;
  readonly judgeFingerprint: string;
  readonly finalDigest: string;
}

export interface DeepAiCouncilResumeCompatibilityRule {
  readonly component: DeepAiCouncilResumeCompatibilityComponent;
  readonly fromVersion: string;
  readonly toVersion: string;
  readonly outcome: 'compatible' | 'migrate' | 'pin-old-runtime';
  readonly revision: string;
}

export interface DeepAiCouncilAuthenticatedMigrationRegistry {
  readonly registryVersion: 1;
  readonly revision: string;
  readonly rules: readonly DeepAiCouncilResumeCompatibilityRule[];
  readonly registryDigest: string;
}

export interface DeepAiCouncilPersistedRunLease {
  readonly runId: string;
  readonly roundId: string;
  readonly leaseId: string;
  readonly generation: number;
  readonly deadlineAt: string;
  readonly remainingMs: number;
  readonly replayFingerprint: string;
}

export interface DeepAiCouncilResumeRequest {
  readonly runId: string;
  readonly roundId: string;
  readonly manifestRevision: string;
  readonly idempotencyKey: string;
  readonly requestedAt: string;
  readonly resumeReason: string;
  readonly persistedFingerprint: DeepAiCouncilResumeFingerprint;
  readonly installedFingerprint: DeepAiCouncilResumeFingerprint;
  readonly migrationRegistry: DeepAiCouncilAuthenticatedMigrationRegistry;
  readonly lease: DeepAiCouncilPersistedRunLease;
  readonly checkpoint: DeepAiCouncilProjectionCheckpoint | null;
  readonly certificateBundle: DeepAiCouncilCertificateBundle;
}

export type DeepAiCouncilReplayProjection = DeepAiCouncilProjectionState & JsonObject;

export interface DeepAiCouncilCertificateVerificationContext {
  readonly eventRegistry: EventTypeRegistry;
  readonly versionRegistry: FingerprintVersionRegistry;
  readonly componentRegistry: ReplayComponentRegistry<DeepAiCouncilReplayProjection>;
  readonly rangeStartSequence: number;
  readonly rangeEndSequence: number;
  readonly replay: ReplayExecutionInput<DeepAiCouncilReplayProjection>;
  readonly providers: CertificationProviderRegistry;
}

export interface DeepAiCouncilResumeAdapterOptions {
  readonly ledger: AppendOnlyLedger;
  readonly effectLedger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  readonly policies: TransitionPolicyRegistry;
  readonly eventRegistry: EventTypeRegistry;
  readonly fingerprintVersions: FingerprintVersionRegistry;
  readonly artifactStore: SealedArtifactStore;
  readonly certificateVerification: DeepAiCouncilCertificateVerificationContext;
  readonly trustedMigrationRegistryDigests: readonly string[];
  readonly producer: EventProducer;
  readonly policyId: string;
  readonly policyVersion: number;
  readonly actorId: string;
  readonly capabilityId: string;
  readonly authorityEpoch: number;
  readonly priorStateVersion: string;
  readonly packetPointer: string;
  readonly enableDarkDispatch?: boolean;
  readonly branchDispatcher?: DeepAiCouncilBranchDispatcher;
}

// ───────────────────────────────────────────────────────────────────
// 2. DECISION ALGEBRA
// ───────────────────────────────────────────────────────────────────

export type DeepAiCouncilResumeDisposition =
  | 'reuse'
  | 'reexecute'
  | 'reconcile'
  | 'wait'
  | 'blocked';

export type DeepAiCouncilResumeDecisionDisposition =
  | 'exact-reuse'
  | 'compatible'
  | 'migrate'
  | 'blocked';

export type DeepAiCouncilManifestDisposition =
  | 'original'
  | 'restart'
  | 'reject';

export interface DeepAiCouncilCompatibilityComponentDecision {
  readonly component: DeepAiCouncilResumeCompatibilityComponent;
  readonly persistedVersion: string;
  readonly installedVersion: string;
  readonly outcome: DeepAiCouncilCompatibilityStatus;
  readonly revision: string | null;
  readonly decisionReason: string;
}

export interface DeepAiCouncilBranchResumeDecision {
  readonly logicalBranchId: string;
  readonly seatId: string;
  readonly roundId: string;
  readonly retryKey: string;
  readonly disposition: 'reuse' | 'reexecute' | 'wait' | 'blocked';
  readonly attemptId: string | null;
  readonly evidenceEventIds: readonly string[];
  readonly decisionReason: string;
}

export interface DeepAiCouncilEffectResumeDecision {
  readonly effectId: string;
  readonly logicalEffectId: string;
  readonly disposition: 'reexecute' | 'reconcile' | 'blocked';
  readonly attemptRefs: readonly string[];
  readonly nextAttemptId: string | null;
  readonly decisionReason: string;
}

export interface DeepAiCouncilInvalidationDecision {
  readonly changedComponents: readonly DeepAiCouncilResumeCompatibilityComponent[];
  readonly invalidatedLogicalBranchIds: readonly string[];
  readonly invalidatedArtifactIds: readonly string[];
  readonly convergenceReopened: boolean;
  readonly testGateReopened: boolean;
}

export interface DeepAiCouncilResumeDecision {
  readonly decisionVersion: 1;
  readonly decisionId: string;
  readonly decisionDigest: string;
  readonly authority: 'dark-evidence-only';
  readonly legacyAuthority: 'unchanged';
  readonly productionCompletion: false;
  readonly disposition: DeepAiCouncilResumeDecisionDisposition;
  readonly compatibilityOutcome: DeepAiCouncilCompatibilityStatus;
  readonly manifestDisposition: DeepAiCouncilManifestDisposition;
  readonly compatibility: readonly DeepAiCouncilCompatibilityComponentDecision[];
  readonly branches: readonly DeepAiCouncilBranchResumeDecision[];
  readonly effects: readonly DeepAiCouncilEffectResumeDecision[];
  readonly invalidation: DeepAiCouncilInvalidationDecision;
  readonly lease: DeepAiCouncilPersistedRunLease;
  readonly certificateDigest: string;
  readonly receiptDigests: readonly string[];
  readonly verifiedArtifactDigests: readonly string[];
  readonly persistedResumeFingerprint: string;
  readonly installedResumeFingerprint: string;
  readonly decisionReason: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. CONTINUITY PROJECTION
// ───────────────────────────────────────────────────────────────────

export type DeepAiCouncilContinuityStep =
  | 'init'
  | 'deliberation'
  | 'critique'
  | 'convergence'
  | 'artifacts'
  | 'council-test-gate'
  | 'complete';

export interface DeepAiCouncilContinuityLadderRow {
  readonly step: DeepAiCouncilContinuityStep;
  readonly eventFamilies: readonly string[];
  readonly reducerFields: readonly string[];
  readonly reentryActions: readonly DeepAiCouncilResumeDisposition[];
}

export interface DeepAiCouncilContinuityProjection {
  readonly authority: 'shadow-only';
  readonly productionCompletion: false;
  readonly packetPointer: string;
  readonly runId: string;
  readonly roundId: string;
  readonly generation: number;
  readonly lastAppliedSeq: number;
  readonly seenEventIds: readonly string[];
  readonly currentStep: DeepAiCouncilContinuityStep;
  readonly recentAction: string;
  readonly nextSafeAction: string;
  readonly blockers: readonly string[];
  readonly progress: number;
  readonly openQuestions: readonly string[];
  readonly answeredQuestions: readonly string[];
  readonly logicalBranchIds: readonly string[];
  readonly completedLogicalBranchIds: readonly string[];
  readonly critiqueRoundIds: readonly string[];
  readonly minorityClaimIds: readonly string[];
  readonly artifactIds: readonly string[];
  readonly convergenceOutcome: DeepAiCouncilProjectionState['convergence']['outcome'];
  readonly gateVerdict: DeepAiCouncilProjectionState['testGate']['verdict'];
  readonly terminalState: DeepAiCouncilProjectionState['status']['state'];
}

export interface DeepAiCouncilAuthenticatedTail {
  readonly ledgerId: string;
  readonly ledgerSequence: number;
  readonly recordHash: string;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly eventCount: number;
}

export interface DeepAiCouncilResumeExecutionPoolEntry {
  readonly logicalBranchId: string;
  readonly seatId: string;
  readonly roundId: string;
  readonly retryKey: string;
  readonly attemptId: string;
}

export interface DeepAiCouncilResumeResult {
  readonly status: 'appended' | 'idempotent';
  readonly decision: DeepAiCouncilResumeDecision;
  readonly continuity: DeepAiCouncilContinuityProjection;
  readonly projection: DeepAiCouncilProjectionState;
  readonly checkpoint: DeepAiCouncilProjectionCheckpoint;
  readonly authenticatedTail: DeepAiCouncilAuthenticatedTail;
  readonly executionPool: readonly DeepAiCouncilResumeExecutionPoolEntry[];
  readonly appendReceipt: DurableAppendReceipt;
  readonly dispatchedBranches: number;
}

export type DeepAiCouncilResumeRebuildReasonCode =
  | DeepAiCouncilRebuildReasonCode
  | 'certificate-unverified'
  | 'certificate-head-mismatch'
  | 'certificate-lifecycle-untrusted';

export interface DeepAiCouncilResumeRebuildRequiredResult {
  readonly status: 'rebuild_required';
  readonly reasonCodes: readonly DeepAiCouncilResumeRebuildReasonCode[];
  readonly authenticatedTail: DeepAiCouncilAuthenticatedTail;
}

export type DeepAiCouncilResumeAdapterResult =
  | DeepAiCouncilResumeResult
  | DeepAiCouncilResumeRebuildRequiredResult;

export interface DeepAiCouncilBranchDispatcher {
  dispatch(entry: DeepAiCouncilResumeExecutionPoolEntry): Promise<void>;
}
