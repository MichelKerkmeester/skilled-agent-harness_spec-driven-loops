// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Resume Adapter Types
// ───────────────────────────────────────────────────────────────────

import type {
  AppendOnlyLedger,
} from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonBranchResumeDecision,
  DeepImprovementCommonCompatibilityComponentDecision,
  DeepImprovementCommonEffectResumeDecision,
  DeepImprovementCommonResumeComponentOutcome,
  DeepImprovementCommonResumeDecision,
  DeepImprovementCommonResumeDisposition,
} from '../deep-improvement-common-resume-adapter/index.js';
import type {
  SkillBenchmarkCertificateBundle,
  SkillBenchmarkOfflineVerificationInput,
  SkillBenchmarkOfflineVerificationResult,
} from '../skill-benchmark-certificates/index.js';
import type {
  SkillBenchmarkProjectionCheckpoint,
  SkillBenchmarkProjectionState,
  SkillBenchmarkRebuildReasonCode,
  SkillBenchmarkStreamTail,
} from '../skill-benchmark-reducers/index.js';
import type {
  JsonObject,
} from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED INPUT CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type SkillBenchmarkResumeCompatibilityComponent =
  | 'tool'
  | 'model'
  | 'policy'
  | 'target'
  | 'schema'
  | 'manifest'
  | 'treatment'
  | 'skill-bundle'
  | 'registry'
  | 'executor'
  | 'permission'
  | 'environment'
  | 'gold'
  | 'evaluator'
  | 'reducer'
  | 'scoring-policy'
  | 'adapter'
  | 'codec';

export interface SkillBenchmarkResumeComponentFact {
  readonly component: SkillBenchmarkResumeCompatibilityComponent;
  readonly version: string;
  readonly digest: string;
}

export interface SkillBenchmarkResumeFingerprint {
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
  readonly componentFacts: readonly SkillBenchmarkResumeComponentFact[];
  readonly finalDigest: string;
}

export interface SkillBenchmarkMigrationRegistryEntry {
  readonly component: SkillBenchmarkResumeCompatibilityComponent;
  readonly fromVersion: string;
  readonly fromDigest: string;
  readonly toVersion: string;
  readonly toDigest: string;
  readonly outcome: 'compatible' | 'migrate' | 'pin-old-runtime';
  readonly revision: string;
}

export interface SkillBenchmarkMigrationRegistry {
  readonly registryVersion: 1;
  readonly entries: readonly SkillBenchmarkMigrationRegistryEntry[];
  readonly registryDigest: string;
}

export interface SkillBenchmarkPersistedRunLease {
  readonly runId: string;
  readonly leaseId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly deadlineAt: string;
  readonly remainingMs: number;
  readonly certificateDigest: string;
  readonly replayFingerprint: string;
}

export interface SkillBenchmarkResumeRequest {
  readonly runId: string;
  readonly idempotencyKey: string;
  readonly requestedAt: string;
  readonly resumeReason: string;
  readonly currentInputs: readonly SkillBenchmarkResumeComponentFact[];
  readonly migrationRegistry: SkillBenchmarkMigrationRegistry;
  readonly lease: SkillBenchmarkPersistedRunLease;
  readonly checkpoint: SkillBenchmarkProjectionCheckpoint | null;
  readonly priorRunBundle: SkillBenchmarkCertificateBundle;
}

export interface SkillBenchmarkResumeAdapterOptions<
  TState extends JsonObject = JsonObject,
> {
  readonly verification: Omit<
    SkillBenchmarkOfflineVerificationInput<TState>,
    'bundle'
  >;
  readonly effectLedger: AppendOnlyLedger;
  readonly trustedMigrationRegistryDigests: readonly string[];
}

// ───────────────────────────────────────────────────────────────────
// 2. DECISION ALGEBRA
// ───────────────────────────────────────────────────────────────────

export type SkillBenchmarkResumeDisposition =
  DeepImprovementCommonResumeDisposition;

export type SkillBenchmarkResumeComponentOutcome =
  DeepImprovementCommonResumeComponentOutcome;

export interface SkillBenchmarkCompatibilityComponentDecision {
  readonly component: SkillBenchmarkResumeCompatibilityComponent;
  readonly persistedVersion: string;
  readonly persistedDigest: string;
  readonly installedVersion: string;
  readonly installedDigest: string;
  readonly outcome: SkillBenchmarkResumeComponentOutcome;
  readonly revision: string | null;
  readonly decisionReason: string;
}

export type SkillBenchmarkSharedCompatibilityComponentDecision =
  DeepImprovementCommonCompatibilityComponentDecision;

export type SkillBenchmarkSharedBranchResumeDecision =
  DeepImprovementCommonBranchResumeDecision;

export type SkillBenchmarkEffectResumeDecision =
  DeepImprovementCommonEffectResumeDecision;

export interface SkillBenchmarkBranchResumeDecision {
  readonly scenarioId: string;
  readonly assignmentId: string;
  readonly designCellId: string;
  readonly pairedReplicateId: string;
  readonly treatmentArm: string;
  readonly logicalOperationId: string;
  readonly receiptIdentityDigest: string;
  readonly disposition: 'reuse' | 'reexecute' | 'reject';
  readonly evidenceEventIds: readonly string[];
  readonly decisionReason: string;
}

export interface SkillBenchmarkInvalidationDecision {
  readonly changedComponents:
    readonly SkillBenchmarkResumeCompatibilityComponent[];
  readonly invalidatedScenarioIds: readonly string[];
  readonly recoveryRequiredEffectIds: readonly string[];
  readonly scoreRebuildRequired: boolean;
  readonly newLineageRequired: boolean;
}

export interface SkillBenchmarkResumeDecision {
  readonly decisionVersion: 1;
  readonly decisionId: string;
  readonly idempotencyKey: string;
  readonly requestDigest: string;
  readonly decisionDigest: string;
  readonly authority: 'dark-evidence-only';
  readonly legacyAuthority: 'unchanged';
  readonly productionCompletion: false;
  readonly disposition: SkillBenchmarkResumeDisposition;
  readonly priorCertificateDisposition: string | null;
  readonly offlineVerificationVerdict:
    SkillBenchmarkOfflineVerificationResult['verdict'];
  readonly persistedFingerprint: SkillBenchmarkResumeFingerprint | null;
  readonly currentFingerprint: SkillBenchmarkResumeFingerprint | null;
  readonly compatibility:
    readonly SkillBenchmarkCompatibilityComponentDecision[];
  readonly branches: readonly SkillBenchmarkBranchResumeDecision[];
  readonly effects: readonly SkillBenchmarkEffectResumeDecision[];
  readonly invalidation: SkillBenchmarkInvalidationDecision;
  readonly sharedDecision: DeepImprovementCommonResumeDecision | null;
  readonly lease: SkillBenchmarkPersistedRunLease;
  readonly decisionReason: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. CONTINUITY PROJECTION
// ───────────────────────────────────────────────────────────────────

export type SkillBenchmarkContinuityStep =
  | 'run-identity'
  | 'treatment-design'
  | 'scenario-setup'
  | 'skill-path'
  | 'trajectory-outcome'
  | 'gold-scoring'
  | 'shared-status'
  | 'terminal-or-blocked';

export interface SkillBenchmarkContinuityLadderRow {
  readonly step: SkillBenchmarkContinuityStep;
  readonly eventFamilies: readonly string[];
  readonly reducerFields: readonly string[];
  readonly reentryActions: readonly (
    'reuse' | 'reexecute' | 'compensate' | 'reject'
  )[];
}

export interface SkillBenchmarkContinuityProjection {
  readonly authority: 'shadow-only';
  readonly productionCompletion: false;
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly seenEventIds: readonly string[];
  readonly streamTails: readonly SkillBenchmarkStreamTail[];
  readonly currentStep: SkillBenchmarkContinuityStep;
  readonly runState: string;
  readonly modeState: string;
  readonly scenarioIds: readonly string[];
  readonly completeScenarioIds: readonly string[];
  readonly incompleteScenarioIds: readonly string[];
  readonly discoveredScenarioIds: readonly string[];
  readonly invokedScenarioIds: readonly string[];
  readonly outcomeScenarioIds: readonly string[];
  readonly scoredScenarioIds: readonly string[];
  readonly blockingVetoCodes: readonly string[];
  readonly collectionComplete: boolean;
  readonly scoringComplete: boolean;
  readonly certificateReady: boolean;
  readonly terminal: boolean;
}

export interface SkillBenchmarkAuthenticatedTail {
  readonly ledgerId: string;
  readonly rangeStartSequence: number;
  readonly rangeEndSequence: number;
  readonly startHeadHash: string;
  readonly finalHeadHash: string;
  readonly streamTails: readonly SkillBenchmarkStreamTail[];
  readonly eventCount: number;
}

export type SkillBenchmarkResumeRebuildReasonCode =
  | SkillBenchmarkRebuildReasonCode
  | 'authenticated-history-invalid'
  | 'certificate-unverified'
  | 'frontier-mismatch';

export interface SkillBenchmarkResumeResult {
  readonly status: 'decided';
  readonly decision: SkillBenchmarkResumeDecision;
  readonly continuity: SkillBenchmarkContinuityProjection | null;
  readonly projection: SkillBenchmarkProjectionState | null;
  readonly checkpoint: SkillBenchmarkProjectionCheckpoint | null;
  readonly authenticatedTail: SkillBenchmarkAuthenticatedTail | null;
  readonly reasonCodes: readonly SkillBenchmarkResumeRebuildReasonCode[];
  readonly offlineVerification: SkillBenchmarkOfflineVerificationResult;
}
