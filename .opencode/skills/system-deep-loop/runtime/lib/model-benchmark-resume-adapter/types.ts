// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Resume Adapter Types
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
  DeepImprovementCommonResumeResult,
} from '../deep-improvement-common-resume-adapter/index.js';
import type {
  ModelBenchmarkCertificateBundle,
  ModelBenchmarkOfflineVerificationInput,
  ModelBenchmarkOfflineVerificationResult,
} from '../model-benchmark-certificates/index.js';
import type {
  ModelBenchmarkProjectionCheckpoint,
  ModelBenchmarkProjectionState,
  ModelBenchmarkRebuildReasonCode,
} from '../model-benchmark-reducers/index.js';
import type {
  JsonObject,
} from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED INPUT CONTRACTS
// ───────────────────────────────────────────────────────────────────

export type ModelBenchmarkResumeCompatibilityComponent =
  | 'tool'
  | 'model'
  | 'policy'
  | 'target'
  | 'schema'
  | 'manifest'
  | 'recipe'
  | 'prompt'
  | 'workload'
  | 'matrix'
  | 'evaluator'
  | 'judge'
  | 'contamination'
  | 'validity'
  | 'projection-schema'
  | 'reducer'
  | 'scoring-policy'
  | 'adapter'
  | 'codec';

export interface ModelBenchmarkResumeComponentFact {
  readonly component: ModelBenchmarkResumeCompatibilityComponent;
  readonly version: string;
  readonly digest: string;
}

export interface ModelBenchmarkResumeFingerprint {
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
  readonly componentFacts: readonly ModelBenchmarkResumeComponentFact[];
  readonly finalDigest: string;
}

export interface ModelBenchmarkMigrationRegistryEntry {
  readonly component: ModelBenchmarkResumeCompatibilityComponent;
  readonly fromVersion: string;
  readonly fromDigest: string;
  readonly toVersion: string;
  readonly toDigest: string;
  readonly outcome: 'compatible' | 'migrate' | 'pin-old-runtime';
  readonly revision: string;
}

export interface ModelBenchmarkMigrationRegistry {
  readonly registryVersion: 1;
  readonly entries: readonly ModelBenchmarkMigrationRegistryEntry[];
  readonly registryDigest: string;
}

export interface ModelBenchmarkPersistedRunLease {
  readonly runId: string;
  readonly leaseId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly deadlineAt: string;
  readonly remainingMs: number;
  readonly certificateDigest: string;
  readonly replayFingerprint: string;
}

export interface ModelBenchmarkResumeRequest {
  readonly runId: string;
  readonly idempotencyKey: string;
  readonly requestedAt: string;
  readonly resumeReason: string;
  readonly currentInputs: readonly ModelBenchmarkResumeComponentFact[];
  readonly migrationRegistry: ModelBenchmarkMigrationRegistry;
  readonly lease: ModelBenchmarkPersistedRunLease;
  readonly checkpoint: ModelBenchmarkProjectionCheckpoint | null;
  readonly priorRunBundle: ModelBenchmarkCertificateBundle;
}

export interface ModelBenchmarkResumeAdapterOptions<
  TState extends JsonObject = JsonObject,
> {
  readonly verification: Omit<
    ModelBenchmarkOfflineVerificationInput<TState>,
    'bundle'
  >;
  readonly effectLedger: AppendOnlyLedger;
  readonly trustedMigrationRegistryDigests: readonly string[];
}

// ───────────────────────────────────────────────────────────────────
// 2. DECISION ALGEBRA
// ───────────────────────────────────────────────────────────────────

export type ModelBenchmarkResumeDisposition =
  DeepImprovementCommonResumeDisposition;

export type ModelBenchmarkResumeComponentOutcome =
  DeepImprovementCommonResumeComponentOutcome;

export interface ModelBenchmarkCompatibilityComponentDecision {
  readonly component: ModelBenchmarkResumeCompatibilityComponent;
  readonly persistedVersion: string;
  readonly persistedDigest: string;
  readonly installedVersion: string;
  readonly installedDigest: string;
  readonly outcome: ModelBenchmarkResumeComponentOutcome;
  readonly revision: string | null;
  readonly decisionReason: string;
}

export type ModelBenchmarkSharedCompatibilityComponentDecision =
  DeepImprovementCommonCompatibilityComponentDecision;

export type ModelBenchmarkSharedBranchResumeDecision =
  DeepImprovementCommonBranchResumeDecision;

export type ModelBenchmarkEffectResumeDecision =
  DeepImprovementCommonEffectResumeDecision;

export interface ModelBenchmarkBranchResumeDecision {
  readonly cellKey: string;
  readonly trialId: string;
  readonly candidateId: string;
  readonly taskInstanceId: string;
  readonly taskFamilyId: string;
  readonly pairedBlockId: string;
  readonly workloadProfileId: string;
  readonly logicalOperationId: string;
  readonly receiptIdentityDigest: string;
  readonly disposition:
    | 'reuse'
    | 'reconcile'
    | 'reexecute'
    | 'compensate'
    | 'unknown'
    | 'block';
  readonly evidenceEventIds: readonly string[];
  readonly decisionReason: string;
}

export interface ModelBenchmarkInvalidationDecision {
  readonly changedComponents:
    readonly ModelBenchmarkResumeCompatibilityComponent[];
  readonly invalidatedCellKeys: readonly string[];
  readonly recoveryRequiredEffectIds: readonly string[];
  readonly scoreRebuildRequired: boolean;
  readonly newLineageRequired: boolean;
}

export interface ModelBenchmarkResumeDecision {
  readonly decisionVersion: 1;
  readonly decisionId: string;
  readonly idempotencyKey: string;
  readonly requestDigest: string;
  readonly decisionDigest: string;
  readonly authority: 'dark-evidence-only';
  readonly legacyAuthority: 'unchanged';
  readonly productionCompletion: false;
  readonly disposition: ModelBenchmarkResumeDisposition;
  readonly priorCertificateDisposition: string | null;
  readonly offlineVerificationVerdict:
    ModelBenchmarkOfflineVerificationResult['verdict'];
  readonly persistedFingerprint: ModelBenchmarkResumeFingerprint | null;
  readonly currentFingerprint: ModelBenchmarkResumeFingerprint | null;
  readonly compatibility:
    readonly ModelBenchmarkCompatibilityComponentDecision[];
  readonly branches: readonly ModelBenchmarkBranchResumeDecision[];
  readonly effects: readonly ModelBenchmarkEffectResumeDecision[];
  readonly invalidation: ModelBenchmarkInvalidationDecision;
  readonly sharedDecision: DeepImprovementCommonResumeDecision | null;
  readonly lease: ModelBenchmarkPersistedRunLease;
  readonly decisionReason: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. CONTINUITY PROJECTION
// ───────────────────────────────────────────────────────────────────

export type ModelBenchmarkContinuityStep =
  | 'run-identity'
  | 'design-and-workload'
  | 'matrix-dispatch'
  | 'evidence-collection'
  | 'scoring-and-validity'
  | 'selection'
  | 'shared-status'
  | 'terminal-or-blocked';

export interface ModelBenchmarkContinuityLadderRow {
  readonly step: ModelBenchmarkContinuityStep;
  readonly eventFamilies: readonly string[];
  readonly reducerFields: readonly string[];
  readonly reentryActions: readonly (
    'reuse' | 'reconcile' | 'reexecute' | 'compensate' | 'unknown' | 'block'
  )[];
}

export interface ModelBenchmarkContinuityProjection {
  readonly authority: 'shadow-only';
  readonly productionCompletion: false;
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly lastAppliedSeq: number;
  readonly seenEventIds: readonly string[];
  readonly streamFrontiers: readonly {
    readonly streamId: string;
    readonly lastSequence: number;
  }[];
  readonly currentStep: ModelBenchmarkContinuityStep;
  readonly runState: string;
  readonly terminalOutcome: string | null;
  readonly cellKeys: readonly string[];
  readonly reusableCellKeys: readonly string[];
  readonly pendingCellKeys: readonly string[];
  readonly unknownCellKeys: readonly string[];
  readonly scoredCellKeys: readonly string[];
  readonly validEvidencePlanIds: readonly string[];
  readonly unresolvedEvidenceRefs: readonly string[];
  readonly matrixCoverage: number;
  readonly rankingState: string;
  readonly blockingVetoCodes: readonly string[];
  readonly terminal: boolean;
}

export interface ModelBenchmarkAuthenticatedTail {
  readonly ledgerId: string;
  readonly rangeStartSequence: number;
  readonly rangeEndSequence: number;
  readonly startHeadHash: string;
  readonly finalHeadHash: string;
  readonly streamFrontiers: readonly {
    readonly streamId: string;
    readonly lastSequence: number;
    readonly eventId: string;
  }[];
  readonly eventCount: number;
}

export type ModelBenchmarkResumeRebuildReasonCode =
  | ModelBenchmarkRebuildReasonCode
  | 'authenticated-history-invalid'
  | 'certificate-unverified'
  | 'frontier-mismatch';

export interface ModelBenchmarkResumeResult {
  readonly status: 'decided';
  readonly decision: ModelBenchmarkResumeDecision;
  readonly continuity: ModelBenchmarkContinuityProjection | null;
  readonly projection: ModelBenchmarkProjectionState | null;
  readonly checkpoint: ModelBenchmarkProjectionCheckpoint | null;
  readonly authenticatedTail: ModelBenchmarkAuthenticatedTail | null;
  readonly reasonCodes: readonly ModelBenchmarkResumeRebuildReasonCode[];
  readonly offlineVerification: ModelBenchmarkOfflineVerificationResult;
  readonly common: DeepImprovementCommonResumeResult | null;
}
