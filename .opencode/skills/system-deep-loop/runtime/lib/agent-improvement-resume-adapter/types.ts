// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Resume Adapter Types
// ───────────────────────────────────────────────────────────────────

import type { AppendOnlyLedger } from '../authorized-ledger/index.js';
import type {
  AgentImprovementCertificateBundle,
  AgentImprovementOfflineVerificationInput,
  AgentImprovementOfflineVerificationResult,
} from '../agent-improvement-certificates/index.js';
import type {
  AgentImprovementProjectionCheckpoint,
  AgentImprovementProjectionState,
  AgentImprovementRebuildReasonCode,
  AgentImprovementStreamFrontier,
} from '../agent-improvement-reducers/index.js';
import type {
  DeepImprovementCommonBranchResumeDecision,
  DeepImprovementCommonCompatibilityComponentDecision,
  DeepImprovementCommonEffectResumeDecision,
  DeepImprovementCommonResumeComponentOutcome,
  DeepImprovementCommonResumeDecision,
  DeepImprovementCommonResumeDisposition,
} from '../deep-improvement-common-resume-adapter/index.js';
import type { JsonObject } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED INPUT CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type AgentImprovementResumeCompatibilityComponent =
  | 'tool'
  | 'model'
  | 'policy'
  | 'target'
  | 'schema'
  | 'agent-ir'
  | 'change-contract'
  | 'mutation-operator'
  | 'behavior-manifest'
  | 'evaluator'
  | 'executor'
  | 'profile'
  | 'topology'
  | 'upcaster'
  | 'reducer'
  | 'adapter'
  | 'codec';

export interface AgentImprovementResumeComponentFact {
  readonly component: AgentImprovementResumeCompatibilityComponent;
  readonly version: string;
  readonly digest: string;
}

export interface AgentImprovementResumeFingerprint {
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
  readonly componentFacts: readonly AgentImprovementResumeComponentFact[];
  readonly finalDigest: string;
}

export interface AgentImprovementMigrationRegistryEntry {
  readonly component: AgentImprovementResumeCompatibilityComponent;
  readonly fromVersion: string;
  readonly fromDigest: string;
  readonly toVersion: string;
  readonly toDigest: string;
  readonly outcome: 'compatible' | 'migrate' | 'pin-old-runtime';
  readonly revision: string;
}

export interface AgentImprovementMigrationRegistry {
  readonly registryVersion: 1;
  readonly entries: readonly AgentImprovementMigrationRegistryEntry[];
  readonly registryDigest: string;
}

export interface AgentImprovementPersistedRunLease {
  readonly runId: string;
  readonly leaseId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly deadlineAt: string;
  readonly remainingMs: number;
  readonly certificateDigest: string;
  readonly replayFingerprint: string;
}

export interface AgentImprovementResumeRequest {
  readonly runId: string;
  readonly idempotencyKey: string;
  readonly requestedAt: string;
  readonly resumeReason: string;
  readonly currentInputs: readonly AgentImprovementResumeComponentFact[];
  readonly migrationRegistry: AgentImprovementMigrationRegistry;
  readonly lease: AgentImprovementPersistedRunLease;
  readonly checkpoint: AgentImprovementProjectionCheckpoint | null;
  readonly priorRunBundle: AgentImprovementCertificateBundle;
}

export interface AgentImprovementResumeAdapterOptions<
  TState extends JsonObject = JsonObject,
> {
  readonly verification: Omit<
    AgentImprovementOfflineVerificationInput<TState>,
    'bundle'
  >;
  readonly effectLedger: AppendOnlyLedger;
  readonly trustedMigrationRegistryDigests: readonly string[];
}

// ───────────────────────────────────────────────────────────────────
// 2. DECISION ALGEBRA
// ───────────────────────────────────────────────────────────────────

export type AgentImprovementResumeDisposition =
  DeepImprovementCommonResumeDisposition;
export type AgentImprovementResumeComponentOutcome =
  DeepImprovementCommonResumeComponentOutcome;
export type AgentImprovementSharedCompatibilityComponentDecision =
  DeepImprovementCommonCompatibilityComponentDecision;
export type AgentImprovementSharedBranchResumeDecision =
  DeepImprovementCommonBranchResumeDecision;
export type AgentImprovementEffectResumeDecision =
  DeepImprovementCommonEffectResumeDecision;

export interface AgentImprovementCompatibilityComponentDecision {
  readonly component: AgentImprovementResumeCompatibilityComponent;
  readonly persistedVersion: string;
  readonly persistedDigest: string;
  readonly installedVersion: string;
  readonly installedDigest: string;
  readonly outcome: AgentImprovementResumeComponentOutcome;
  readonly revision: string | null;
  readonly decisionReason: string;
}

export interface AgentImprovementBranchResumeDecision {
  readonly candidateId: string;
  readonly mutationId: string;
  readonly profileRefs: readonly string[];
  readonly behaviorFamilyIds: readonly string[];
  readonly logicalOperationId: string;
  readonly receiptIdentityDigest: string;
  readonly disposition: 'reuse' | 'reexecute' | 'compensate' | 'reject';
  readonly evidenceEventIds: readonly string[];
  readonly decisionReason: string;
}

export interface AgentImprovementInvalidationDecision {
  readonly changedComponents:
    readonly AgentImprovementResumeCompatibilityComponent[];
  readonly invalidatedCandidateIds: readonly string[];
  readonly recoveryRequiredEffectIds: readonly string[];
  readonly scoreRebuildRequired: boolean;
  readonly newLineageRequired: boolean;
}

export interface AgentImprovementResumeDecision {
  readonly decisionVersion: 1;
  readonly decisionId: string;
  readonly idempotencyKey: string;
  readonly requestDigest: string;
  readonly decisionDigest: string;
  readonly authority: 'dark-evidence-only';
  readonly legacyAuthority: 'unchanged';
  readonly productionCompletion: false;
  readonly disposition: AgentImprovementResumeDisposition;
  readonly priorCertificateDisposition: string | null;
  readonly offlineVerificationVerdict:
    AgentImprovementOfflineVerificationResult['verdict'];
  readonly persistedFingerprint: AgentImprovementResumeFingerprint | null;
  readonly currentFingerprint: AgentImprovementResumeFingerprint | null;
  readonly compatibility:
    readonly AgentImprovementCompatibilityComponentDecision[];
  readonly branches: readonly AgentImprovementBranchResumeDecision[];
  readonly effects: readonly AgentImprovementEffectResumeDecision[];
  readonly invalidation: AgentImprovementInvalidationDecision;
  readonly sharedDecision: DeepImprovementCommonResumeDecision | null;
  readonly lease: AgentImprovementPersistedRunLease;
  readonly decisionReason: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. CONTINUITY PROJECTION
// ───────────────────────────────────────────────────────────────────

export type AgentImprovementContinuityStep =
  | 'run-identity'
  | 'agent-ir-and-change-contract'
  | 'candidate-generation'
  | 'behavior-experiment'
  | 'evaluation-and-scoring'
  | 'canary-and-promotion'
  | 'terminal-or-blocked';

export interface AgentImprovementContinuityLadderRow {
  readonly step: AgentImprovementContinuityStep;
  readonly eventFamilies: readonly string[];
  readonly reducerFields: readonly string[];
  readonly reentryActions: readonly (
    'reuse' | 'reexecute' | 'compensate' | 'reject'
  )[];
}

export interface AgentImprovementContinuityProjection {
  readonly authority: 'shadow-only';
  readonly productionCompletion: false;
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly seenEventIds: readonly string[];
  readonly streamTails: readonly AgentImprovementStreamFrontier[];
  readonly currentStep: AgentImprovementContinuityStep;
  readonly activeAgentIrId: string | null;
  readonly activeMutationId: string | null;
  readonly candidateIds: readonly string[];
  readonly componentIds: readonly string[];
  readonly inheritedClauseIds: readonly string[];
  readonly behaviorFamilyIds: readonly string[];
  readonly profileRefs: readonly string[];
  readonly evaluationEpochIds: readonly string[];
  readonly scoredCandidateIds: readonly string[];
  readonly canaryEpochIds: readonly string[];
  readonly promotionIds: readonly string[];
  readonly unresolvedEvidenceRefs: readonly string[];
  readonly blockingVetoCodes: readonly string[];
  readonly terminal: boolean;
}

export interface AgentImprovementAuthenticatedTail {
  readonly ledgerId: string;
  readonly rangeStartSequence: number;
  readonly rangeEndSequence: number;
  readonly startHeadHash: string;
  readonly finalHeadHash: string;
  readonly streamTails: readonly AgentImprovementStreamFrontier[];
  readonly eventCount: number;
}

export type AgentImprovementResumeRebuildReasonCode =
  | AgentImprovementRebuildReasonCode
  | 'authenticated-history-invalid'
  | 'certificate-unverified'
  | 'frontier-mismatch';

export interface AgentImprovementResumeResult {
  readonly status: 'decided';
  readonly decision: AgentImprovementResumeDecision;
  readonly continuity: AgentImprovementContinuityProjection | null;
  readonly projection: AgentImprovementProjectionState | null;
  readonly checkpoint: AgentImprovementProjectionCheckpoint | null;
  readonly authenticatedTail: AgentImprovementAuthenticatedTail | null;
  readonly reasonCodes: readonly AgentImprovementResumeRebuildReasonCode[];
  readonly offlineVerification: AgentImprovementOfflineVerificationResult;
}
