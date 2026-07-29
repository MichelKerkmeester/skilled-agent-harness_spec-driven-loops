// MODULE: Model Benchmark Certificate Types

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonCertificateBundle,
  DeepImprovementCommonOfflineVerificationInput,
  DeepImprovementCommonReceiptIdentity,
} from '../deep-improvement-common-certificates/index.js';
import type { ModelBenchmarkLedgerEvent } from '../model-benchmark-ledger-schema/index.js';
import type {
  ModelBenchmarkArtifactKind,
  ModelBenchmarkSealedArtifactBinding,
} from '../model-benchmark-sealed-artifacts/index.js';
import type {
  BoundaryReceiptPayload,
  CertificationProfile,
  CertificationProviderRegistry,
} from '../receipts-and-effect-recovery/index.js';
import type { AuthorizedEvidenceWriter } from '../receipts-and-effect-recovery/index.js';
import type { DeriveReplayFingerprintInput } from '../replay-fingerprint/index.js';
import type { SealedArtifactStore } from '../sealed-reference-artifacts/index.js';
import type { EventProducer, EventTypeRegistry, JsonObject } from '../event-envelope/index.js';

export const ModelBenchmarkTransitionKinds = Object.freeze({
  BENCHMARK_STARTED: 'benchmark_started',
  MODEL_CELL_STARTED: 'model_cell_started',
  MODEL_CELL_COMPLETED: 'model_cell_completed',
  SCORE_MATRIX_REDUCED: 'score_matrix_reduced',
  JUDGE_CALIBRATED: 'judge_calibrated',
  CONTAMINATION_CHECKED: 'contamination_checked',
  DIAGNOSTIC_TAIL_ALLOCATED: 'diagnostic_tail_allocated',
  SELECTION_PROPOSED: 'selection_proposed',
  SELECTION_BLOCKED: 'selection_blocked',
  ABORTED: 'aborted',
  RESTORED: 'restored',
} as const);

export type ModelBenchmarkTransitionKind =
  typeof ModelBenchmarkTransitionKinds[keyof typeof ModelBenchmarkTransitionKinds];

export type ModelBenchmarkTransitionOutcome =
  | 'completed'
  | 'recovered'
  | 'uncertain'
  | 'vetoed';

export type ModelBenchmarkCertificateDisposition =
  | 'ABORT'
  | 'FAIL'
  | 'INSUFFICIENT_EVIDENCE'
  | 'PASS';

export type ModelBenchmarkOfflineVerificationVerdict =
  | 'valid'
  | 'invalid'
  | 'incomplete'
  | 'unverifiable';

export const ModelBenchmarkCertificateFailureCodes = Object.freeze({
  ARTIFACT_CLOSURE_INVALID: 'ARTIFACT_CLOSURE_INVALID',
  ARTIFACT_MISSING: 'ARTIFACT_MISSING',
  ARTIFACT_MUTATED: 'ARTIFACT_MUTATED',
  ARTIFACT_STALE: 'ARTIFACT_STALE',
  ARTIFACT_WRONG_KIND: 'ARTIFACT_WRONG_KIND',
  CERTIFICATE_INVALID: 'CERTIFICATE_INVALID',
  CERTIFICATION_INVALID: 'CERTIFICATION_INVALID',
  COMMON_VERIFICATION_INVALID: 'COMMON_VERIFICATION_INVALID',
  EPOCH_MISMATCH: 'EPOCH_MISMATCH',
  FINGERPRINT_MISMATCH: 'FINGERPRINT_MISMATCH',
  INCOMPLETE_RUN: 'INCOMPLETE_RUN',
  LEDGER_INVALID: 'LEDGER_INVALID',
  LIFECYCLE_INVALID: 'LIFECYCLE_INVALID',
  MISSING_EVIDENCE: 'MISSING_EVIDENCE',
  PROJECTION_INVALID: 'PROJECTION_INVALID',
  RECEIPT_CHAIN_INVALID: 'RECEIPT_CHAIN_INVALID',
  SCHEMA_INCOMPATIBLE: 'SCHEMA_INCOMPATIBLE',
  TRANSITION_UNAUTHORIZED: 'TRANSITION_UNAUTHORIZED',
  VISIBILITY_INVALID: 'VISIBILITY_INVALID',
} as const);

export type ModelBenchmarkCertificateFailureCode =
  typeof ModelBenchmarkCertificateFailureCodes[
    keyof typeof ModelBenchmarkCertificateFailureCodes
  ];

export interface ModelBenchmarkReceiptIdentity {
  readonly identityVersion: 1;
  readonly runId: string;
  readonly transitionKind: ModelBenchmarkTransitionKind;
  readonly logicalOperationId: string;
  readonly effectIdempotencyKey: string;
  readonly digest: string;
}

export interface ModelBenchmarkTransitionReceiptInput {
  readonly transitionKind: ModelBenchmarkTransitionKind;
  readonly logicalOperationId: string;
  readonly effectIdempotencyKey: string;
  readonly attemptNumber: number;
  readonly resultEventId: string;
  readonly inputArtifactQualifiedDigests: readonly string[];
  readonly outputArtifactQualifiedDigests: readonly string[];
  readonly evidenceArtifactQualifiedDigests: readonly string[];
}

export interface ModelBenchmarkTransitionReceiptFacts {
  readonly receiptVersion: 1;
  readonly identity: ModelBenchmarkReceiptIdentity;
  readonly predecessorReceiptDigests: readonly string[];
  readonly commonReceiptIdentities: readonly DeepImprovementCommonReceiptIdentity[];
  readonly runId: string;
  readonly transitionKind: ModelBenchmarkTransitionKind;
  readonly logicalOperationId: string;
  readonly effectIdempotencyKey: string;
  readonly attemptNumber: number;
  readonly resultEventId: string;
  readonly resultEventType: string;
  readonly resultEventDigest: string;
  readonly authorizationDecisionDigest: string;
  readonly fromHeadHash: string;
  readonly resultHeadHash: string;
  readonly inputArtifactQualifiedDigests: readonly string[];
  readonly outputArtifactQualifiedDigests: readonly string[];
  readonly evidenceArtifactQualifiedDigests: readonly string[];
  readonly outcome: ModelBenchmarkTransitionOutcome;
  readonly substrateReplayFingerprint: string;
  readonly transitionFingerprint: string;
  readonly authorityEpoch: number;
}

export interface ModelBenchmarkTransitionReceipt {
  readonly facts: ModelBenchmarkTransitionReceiptFacts;
  readonly receiptDigest: string;
  readonly sharedReceipt: BoundaryReceiptPayload;
}

export type ModelBenchmarkCertificateArtifactRole =
  | 'adaptive-diagnostic-selection'
  | 'benchmark-recipe'
  | 'common-anchor-selection'
  | 'contamination-lineage'
  | 'model-cell-input'
  | 'raw-cell-output'
  | 'run-manifest'
  | 'scoring-matrix'
  | 'selection-evidence'
  | 'validity-evidence'
  | 'workload-evidence';

export interface ModelBenchmarkCertificateArtifactClaim {
  readonly role: ModelBenchmarkCertificateArtifactRole;
  readonly expectedArtifactKind: ModelBenchmarkArtifactKind;
  readonly binding: ModelBenchmarkSealedArtifactBinding;
  readonly descriptorDigest: string;
  readonly contentDigest: string;
  readonly canonicalizationVersion: string;
}

export interface ModelBenchmarkRunCertificateBody {
  readonly certificateVersion: 1;
  readonly authority: 'dark-evidence-only';
  readonly mode: 'model-benchmark';
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly evaluatorEpochId: string;
  readonly canaryEpochId: string;
  readonly matrixProfileId: string;
  readonly matrixDigest: string;
  readonly workloadProfileDigest: string;
  readonly disposition: ModelBenchmarkCertificateDisposition;
  readonly selectionState: 'BLOCKED' | 'INCONCLUSIVE' | 'TIE' | 'WINNER';
  readonly winnerModelId: string | null;
  readonly matrixCoverage: number;
  readonly rankingState: 'blocked' | 'ranked' | 'unranked';
  readonly blockingCellKeys: readonly string[];
  readonly blockingVetoCodes: readonly string[];
  readonly unresolvedEvidenceRefs: readonly string[];
  readonly artifactClaims: readonly ModelBenchmarkCertificateArtifactClaim[];
  readonly artifactSetDigest: string;
  readonly namedDigestClosureRules: readonly [];
  readonly orderedDependencyClosure: readonly string[];
  readonly recipeQualifiedDigest: string;
  readonly runManifestQualifiedDigest: string;
  readonly modelCellInputQualifiedDigests: readonly string[];
  readonly rawObservationQualifiedDigests: readonly string[];
  readonly scoringMatrixQualifiedDigest: string;
  readonly commonAnchorQualifiedDigest: string;
  readonly diagnosticSelectionQualifiedDigest: string;
  readonly validityEvidenceQualifiedDigests: readonly string[];
  readonly contaminationEvidenceQualifiedDigests: readonly string[];
  readonly workloadEvidenceQualifiedDigests: readonly string[];
  readonly selectionEvidenceQualifiedDigest: string;
  readonly commonCertificateDigest: string;
  readonly commonReceiptIdentities: readonly DeepImprovementCommonReceiptIdentity[];
  readonly receiptIdentities: readonly ModelBenchmarkReceiptIdentity[];
  readonly receiptDigests: readonly string[];
  readonly receiptChainDigest: string;
  readonly substrateReplayFingerprint: string;
  readonly replayFingerprint: string;
  readonly replayFingerprintVersion: number;
  readonly projectionIntegrityDigest: string;
  readonly startHeadHash: string;
  readonly finalHeadHash: string;
}

export interface ModelBenchmarkRunCertificate {
  readonly body: ModelBenchmarkRunCertificateBody;
  readonly certificateDigest: string;
  readonly sharedCertificationReceipt: BoundaryReceiptPayload;
}

export interface ModelBenchmarkCertificateBundle {
  readonly bundleVersion: 1;
  readonly certificate: ModelBenchmarkRunCertificate;
  readonly receipts: readonly ModelBenchmarkTransitionReceipt[];
  readonly commonBundle: DeepImprovementCommonCertificateBundle;
}

export interface ModelBenchmarkTransitionReceiptSubstrate {
  readonly writer: AuthorizedEvidenceWriter;
  readonly registry: EventTypeRegistry;
  readonly producer: EventProducer;
}

export interface ModelBenchmarkTransitionReceiptContext {
  readonly runId: string;
  readonly substrateReplayFingerprint: string;
  readonly priorReceipts: readonly ModelBenchmarkTransitionReceipt[];
  readonly commonReceiptIdentities: readonly DeepImprovementCommonReceiptIdentity[];
  readonly ledgerEvents: readonly VerifiedLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly artifactBindings: readonly ModelBenchmarkSealedArtifactBinding[];
  readonly certificationProfile: CertificationProfile;
  readonly providers: CertificationProviderRegistry;
  readonly receiptSubstrate: ModelBenchmarkTransitionReceiptSubstrate;
  readonly issuer: string;
  readonly issuedAt: string;
  readonly evaluatorEpochId: string;
  readonly verificationTime: string;
}

export interface ModelBenchmarkCertificateIssuerInput<TState extends JsonObject> {
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly projectionEvents: readonly ModelBenchmarkLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly artifactBindings: readonly ModelBenchmarkSealedArtifactBinding[];
  readonly transitionReceipts: readonly ModelBenchmarkTransitionReceiptInput[];
  readonly replay: DeriveReplayFingerprintInput<TState>;
  readonly commonVerification: DeepImprovementCommonOfflineVerificationInput<JsonObject>;
  readonly certificationProfile: CertificationProfile;
  readonly providers: CertificationProviderRegistry;
  readonly receiptSubstrate: ModelBenchmarkTransitionReceiptSubstrate;
  readonly issuer: string;
  readonly issuedAt: string;
  readonly verificationTime: string;
}

export interface ModelBenchmarkOfflineVerificationInput<TState extends JsonObject> {
  readonly bundle: unknown;
  readonly projectionEvents: readonly ModelBenchmarkLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly replay: DeriveReplayFingerprintInput<TState>;
  readonly commonVerification: DeepImprovementCommonOfflineVerificationInput<JsonObject>;
  readonly providers: CertificationProviderRegistry;
  readonly verificationTime: string;
}

export interface ModelBenchmarkOfflineVerificationFailure {
  readonly verdict: Exclude<ModelBenchmarkOfflineVerificationVerdict, 'valid'>;
  readonly code: ModelBenchmarkCertificateFailureCode;
  readonly evidenceLocation: string;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly failureReason: string;
  readonly evidenceDigest: string;
}

export interface ModelBenchmarkOfflineVerifierReceipt {
  readonly receiptVersion: 1;
  readonly certificateDigest: string;
  readonly verifierVersion: string;
  readonly rulesetDigest: string;
  readonly replayFingerprint: string;
  readonly evidenceDigests: readonly string[];
  readonly verificationDigest: string;
}

export interface ModelBenchmarkOfflineVerificationSuccess {
  readonly verdict: 'valid';
  readonly certificateDigest: string;
  readonly replayFingerprint: string;
  readonly projectionIntegrityDigest: string;
  readonly receiptChainDigest: string;
  readonly artifactSetDigest: string;
  readonly verificationReceipt: ModelBenchmarkOfflineVerifierReceipt;
}

export type ModelBenchmarkOfflineVerificationResult =
  | ModelBenchmarkOfflineVerificationFailure
  | ModelBenchmarkOfflineVerificationSuccess;

export class ModelBenchmarkCertificateError extends Error {
  public readonly code: ModelBenchmarkCertificateFailureCode;
  public readonly evidenceLocation: string;
  public readonly expectedDigest: string | null;
  public readonly actualDigest: string | null;

  public constructor(
    code: ModelBenchmarkCertificateFailureCode,
    evidenceLocation: string,
    failureReason: string,
    expectedDigest: string | null = null,
    actualDigest: string | null = null,
  ) {
    super(failureReason);
    this.name = 'ModelBenchmarkCertificateError';
    this.code = code;
    this.evidenceLocation = evidenceLocation;
    this.expectedDigest = expectedDigest;
    this.actualDigest = actualDigest;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
