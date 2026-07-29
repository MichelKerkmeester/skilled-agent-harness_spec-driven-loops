// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Resume Adapter Types
// ───────────────────────────────────────────────────────────────────

import type {
  AppendOnlyLedger,
} from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonCertificateBundle,
  DeepImprovementCommonOfflineVerificationInput,
  DeepImprovementCommonOfflineVerificationResult,
} from '../deep-improvement-common-certificates/index.js';
import type {
  DeepImprovementCommonCompatibilityStatus,
} from '../deep-improvement-common-ledger-schema/index.js';
import type {
  DeepImprovementCommonProjectionCheckpoint,
  DeepImprovementCommonProjectionState,
  DeepImprovementCommonRebuildReasonCode,
} from '../deep-improvement-common-reducers/index.js';
import type {
  JsonObject,
} from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED INPUT CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type DeepImprovementCommonResumeCompatibilityComponent =
  | 'model'
  | 'policy'
  | 'schema'
  | 'target'
  | 'tool';

export interface DeepImprovementCommonResumeComponentFact {
  readonly component: DeepImprovementCommonResumeCompatibilityComponent;
  readonly version: string;
  readonly digest: string;
}

export interface DeepImprovementCommonResumeFingerprint {
  readonly fingerprintVersion: 1;
  readonly runId: string;
  readonly certificateDigest: string;
  readonly replayFingerprint: string;
  readonly reducerVersion: string;
  readonly adapterVersion: string;
  readonly schemaVersion: string;
  readonly codecVersion: string;
  readonly artifactSetDigest: string;
  readonly receiptChainDigest: string;
  readonly componentFacts: readonly DeepImprovementCommonResumeComponentFact[];
  readonly finalDigest: string;
}

export interface DeepImprovementCommonMigrationRegistryEntry {
  readonly component: DeepImprovementCommonResumeCompatibilityComponent;
  readonly fromVersion: string;
  readonly fromDigest: string;
  readonly toVersion: string;
  readonly toDigest: string;
  readonly outcome: 'compatible' | 'migrate' | 'pin-old-runtime';
  readonly revision: string;
}

export interface DeepImprovementCommonMigrationRegistry {
  readonly registryVersion: 1;
  readonly entries: readonly DeepImprovementCommonMigrationRegistryEntry[];
  readonly registryDigest: string;
}

export interface DeepImprovementCommonPersistedRunLease {
  readonly runId: string;
  readonly leaseId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly deadlineAt: string;
  readonly remainingMs: number;
  readonly certificateDigest: string;
  readonly replayFingerprint: string;
}

export interface DeepImprovementCommonResumeRequest {
  readonly runId: string;
  readonly idempotencyKey: string;
  readonly requestedAt: string;
  readonly resumeReason: string;
  readonly currentInputs: readonly DeepImprovementCommonResumeComponentFact[];
  readonly migrationRegistry: DeepImprovementCommonMigrationRegistry;
  readonly lease: DeepImprovementCommonPersistedRunLease;
  readonly checkpoint: DeepImprovementCommonProjectionCheckpoint | null;
  readonly priorRunBundle: DeepImprovementCommonCertificateBundle;
}

export interface DeepImprovementCommonResumeAdapterOptions<
  TState extends JsonObject = JsonObject,
> {
  readonly verification: Omit<
    DeepImprovementCommonOfflineVerificationInput<TState>,
    'bundle'
  >;
  readonly effectLedger: AppendOnlyLedger;
  readonly trustedMigrationRegistryDigests: readonly string[];
}

// ───────────────────────────────────────────────────────────────────
// 2. DECISION ALGEBRA
// ───────────────────────────────────────────────────────────────────

export type DeepImprovementCommonResumeDisposition =
  | 'exact-reuse'
  | 'compatible'
  | 'migrate'
  | 'rebuild-required'
  | 'blocked';

export type DeepImprovementCommonResumeComponentOutcome =
  | 'exact'
  | 'compatible'
  | 'migrate'
  | 'pin-old-runtime'
  | 'incompatible';

export interface DeepImprovementCommonCompatibilityComponentDecision {
  readonly component: DeepImprovementCommonResumeCompatibilityComponent;
  readonly persistedVersion: string;
  readonly persistedDigest: string;
  readonly installedVersion: string;
  readonly installedDigest: string;
  readonly outcome: DeepImprovementCommonResumeComponentOutcome;
  readonly revision: string | null;
  readonly decisionReason: string;
}

export type DeepImprovementCommonOperationKind =
  | 'candidate-generation'
  | 'evaluation'
  | 'scoring'
  | 'canary'
  | 'promotion'
  | 'terminal';

export interface DeepImprovementCommonBranchResumeDecision {
  readonly logicalOperationId: string;
  readonly operationKind: DeepImprovementCommonOperationKind;
  readonly receiptIdentityDigest: string;
  readonly disposition: 'reuse' | 'reexecute' | 'compensate' | 'reject';
  readonly evidenceEventIds: readonly string[];
  readonly decisionReason: string;
}

export interface DeepImprovementCommonEffectResumeDecision {
  readonly effectId: string;
  readonly logicalEffectId: string;
  readonly applicationState: 'applied' | 'not-applied' | 'unknown';
  readonly disposition: 'reuse' | 'reexecute' | 'compensate' | 'reconcile' | 'blocked';
  readonly intentEventId: string;
  readonly evidenceRefs: readonly string[];
  readonly decisionReason: string;
}

export interface DeepImprovementCommonInvalidationDecision {
  readonly changedComponents: readonly DeepImprovementCommonResumeCompatibilityComponent[];
  readonly invalidatedOperationIds: readonly string[];
  readonly recoveryRequiredEffectIds: readonly string[];
  readonly rebuildRequired: boolean;
}

export interface DeepImprovementCommonResumeDecision {
  readonly decisionVersion: 1;
  readonly decisionId: string;
  readonly idempotencyKey: string;
  readonly requestDigest: string;
  readonly decisionDigest: string;
  readonly authority: 'dark-evidence-only';
  readonly legacyAuthority: 'unchanged';
  readonly productionCompletion: false;
  readonly disposition: DeepImprovementCommonResumeDisposition;
  readonly compatibilityOutcome: DeepImprovementCommonCompatibilityStatus;
  readonly priorCertificateVerdict: string | null;
  readonly offlineVerificationVerdict:
    DeepImprovementCommonOfflineVerificationResult['verdict'];
  readonly persistedFingerprint: DeepImprovementCommonResumeFingerprint | null;
  readonly currentFingerprint: DeepImprovementCommonResumeFingerprint | null;
  readonly compatibility: readonly DeepImprovementCommonCompatibilityComponentDecision[];
  readonly branches: readonly DeepImprovementCommonBranchResumeDecision[];
  readonly effects: readonly DeepImprovementCommonEffectResumeDecision[];
  readonly invalidation: DeepImprovementCommonInvalidationDecision;
  readonly lease: DeepImprovementCommonPersistedRunLease;
  readonly decisionReason: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. CONTINUITY PROJECTION
// ───────────────────────────────────────────────────────────────────

export type DeepImprovementCommonContinuityStep =
  | 'run-identity'
  | 'candidate-generation'
  | 'evaluation'
  | 'scoring'
  | 'canary'
  | 'promotion'
  | 'terminal-or-blocked';

export interface DeepImprovementCommonContinuityLadderRow {
  readonly step: DeepImprovementCommonContinuityStep;
  readonly eventFamilies: readonly string[];
  readonly reducerFields: readonly string[];
  readonly reentryActions: readonly (
    'reuse' | 'reexecute' | 'compensate' | 'reject'
  )[];
}

export interface DeepImprovementCommonContinuityProjection {
  readonly authority: 'shadow-only';
  readonly productionCompletion: false;
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly lastAppliedSeq: number;
  readonly seenEventIds: readonly string[];
  readonly currentStep: DeepImprovementCommonContinuityStep;
  readonly runState: string;
  readonly candidateIds: readonly string[];
  readonly evaluatorEpochIds: readonly string[];
  readonly scoredCandidateIds: readonly string[];
  readonly canaryEpochIds: readonly string[];
  readonly promotionIds: readonly string[];
  readonly terminal: boolean;
  readonly blockingVetoCodes: readonly string[];
}

export interface DeepImprovementCommonAuthenticatedTail {
  readonly ledgerId: string;
  readonly rangeStartSequence: number;
  readonly rangeEndSequence: number;
  readonly startHeadHash: string;
  readonly finalHeadHash: string;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly eventCount: number;
}

export type DeepImprovementCommonResumeRebuildReasonCode =
  | DeepImprovementCommonRebuildReasonCode
  | 'authenticated-history-invalid'
  | 'certificate-unverified'
  | 'frontier-mismatch';

export interface DeepImprovementCommonResumeResult {
  readonly status: 'decided';
  readonly decision: DeepImprovementCommonResumeDecision;
  readonly continuity: DeepImprovementCommonContinuityProjection | null;
  readonly projection: DeepImprovementCommonProjectionState | null;
  readonly checkpoint: DeepImprovementCommonProjectionCheckpoint | null;
  readonly authenticatedTail: DeepImprovementCommonAuthenticatedTail | null;
  readonly reasonCodes: readonly DeepImprovementCommonResumeRebuildReasonCode[];
  readonly offlineVerification: DeepImprovementCommonOfflineVerificationResult;
}
