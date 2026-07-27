// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Certificate Types
// ───────────────────────────────────────────────────────────────────

import type { LedgerHeadFacts } from '../receipts-and-effect-recovery/index.js';
import type {
  DeepReviewConvergenceEligibility,
  DeepReviewConvergenceOutcome,
  DeepReviewModeStatus,
} from '../deep-review-reducers/index.js';
import type {
  DeepReviewSealedArtifactBinding,
} from '../deep-review-sealed-artifacts/index.js';
import type {
  BoundaryReceiptPayload,
  CertificationProfile,
  CertificationProviderRegistry,
} from '../receipts-and-effect-recovery/index.js';
import type { AuthorizedEvidenceWriter } from '../receipts-and-effect-recovery/index.js';
import type {
  DeriveReplayFingerprintInput,
} from '../replay-fingerprint/index.js';
import type { SealedArtifactStore } from '../sealed-reference-artifacts/index.js';
import type { DeepReviewLedgerEvent } from '../deep-review-ledger-schema/index.js';
import type {
  EventProducer,
  EventTypeRegistry,
  JsonObject,
} from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED VOCABULARIES
// ───────────────────────────────────────────────────────────────────

export const DeepReviewTransitionKinds = Object.freeze({
  INIT: 'init',
  SCOPE: 'scope',
  PASS: 'dimension-pass',
  CANDIDATE: 'candidate',
  EVIDENCE: 'evidence',
  ADJUDICATION: 'adjudication',
  LINEAGE: 'lineage',
  REVIEW_DEPTH: 'review-depth',
  CONVERGENCE: 'convergence',
  BLOCKED_STOP: 'blocked-stop',
  SYNTHESIS: 'synthesis',
  REPORT: 'report',
  CONTINUITY: 'continuity',
  COMPLETION: 'completion',
  RECOVERY: 'recovery',
} as const);

export type DeepReviewTransitionKind =
  typeof DeepReviewTransitionKinds[keyof typeof DeepReviewTransitionKinds];

export type DeepReviewTransitionDisposition =
  | 'applied'
  | 'blocked'
  | 'failed'
  | 'in_doubt'
  | 'incomplete'
  | 'quarantined'
  | 'succeeded';

export type DeepReviewCertificateLifecycleResult =
  | 'blocked'
  | 'failed'
  | 'incomplete'
  | 'trusted-completion';

export type DeepReviewOfflineVerificationVerdict =
  | 'valid'
  | 'invalid'
  | 'incomplete'
  | 'unverifiable';

export const DeepReviewCertificateFailureCodes = Object.freeze({
  ARTIFACT_INVALID: 'ARTIFACT_INVALID',
  AUTHORIZATION_INVALID: 'AUTHORIZATION_INVALID',
  CERTIFICATE_INVALID: 'CERTIFICATE_INVALID',
  CERTIFICATION_INVALID: 'CERTIFICATION_INVALID',
  CONVERGENCE_INVALID: 'CONVERGENCE_INVALID',
  EVIDENCE_INCOMPLETE: 'EVIDENCE_INCOMPLETE',
  LEDGER_INVALID: 'LEDGER_INVALID',
  PROJECTION_INVALID: 'PROJECTION_INVALID',
  RECEIPT_CHAIN_INVALID: 'RECEIPT_CHAIN_INVALID',
  RECEIPT_MISSING: 'RECEIPT_MISSING',
  REPLAY_INVALID: 'REPLAY_INVALID',
  STATUS_INVALID: 'STATUS_INVALID',
  UNSUPPORTED_VERSION: 'UNSUPPORTED_VERSION',
} as const);

export type DeepReviewCertificateFailureCode =
  typeof DeepReviewCertificateFailureCodes[
    keyof typeof DeepReviewCertificateFailureCodes
  ];

// ───────────────────────────────────────────────────────────────────
// 2. RECEIPT AND CERTIFICATE CONTRACTS
// ───────────────────────────────────────────────────────────────────

export interface DeepReviewTransitionReceiptInput {
  readonly transitionKind: DeepReviewTransitionKind;
  readonly logicalOperationId: string;
  readonly attemptIds: readonly string[];
  readonly resultEventId: string;
  readonly inputArtifactQualifiedDigests: readonly string[];
  readonly outputArtifactQualifiedDigests: readonly string[];
}

export interface DeepReviewTransitionReceiptFacts {
  readonly receiptVersion: 1;
  readonly runId: string;
  readonly transitionId: string;
  readonly transitionKind: DeepReviewTransitionKind;
  readonly logicalOperationId: string;
  readonly attemptIds: readonly string[];
  readonly resultEventId: string;
  readonly resultEventType: string;
  readonly resultEventDigest: string;
  readonly authorizationDecisionDigest: string;
  readonly fromHead: LedgerHeadFacts;
  readonly resultHead: LedgerHeadFacts;
  readonly inputArtifactQualifiedDigests: readonly string[];
  readonly outputArtifactQualifiedDigests: readonly string[];
  readonly resultDisposition: DeepReviewTransitionDisposition;
  readonly dispositionReason: string;
  readonly replayFingerprint: string;
  readonly authorityEpoch: number;
  readonly priorReceiptDigest: string | null;
}

export interface DeepReviewTransitionReceipt {
  readonly facts: DeepReviewTransitionReceiptFacts;
  readonly receiptDigest: string;
  readonly sharedReceipt: BoundaryReceiptPayload;
}

export interface DeepReviewTransitionReceiptSubstrate {
  readonly writer: AuthorizedEvidenceWriter;
  readonly registry: EventTypeRegistry;
  readonly producer: EventProducer;
}

export interface DeepReviewCertificateArtifactClaim {
  readonly binding: DeepReviewSealedArtifactBinding;
  readonly descriptorDigest: string;
  readonly contentDigest: string;
  readonly canonicalizationVersion: string;
}

export interface DeepReviewNamedDigestClosureRule {
  readonly containingArtifactKind: DeepReviewSealedArtifactBinding['artifactKind'];
  readonly field: string;
  readonly expectedArtifactKinds: readonly DeepReviewSealedArtifactBinding['artifactKind'][];
  readonly cardinality: 'array' | 'scalar';
}

export interface DeepReviewCertificateConvergenceEvidence {
  readonly eligibility: DeepReviewConvergenceEligibility;
  readonly outcome: DeepReviewConvergenceOutcome;
  readonly evaluationEventId: string;
  readonly policyFingerprint: string;
  readonly evaluatorFingerprint: string;
  readonly evidenceTailHash: string;
  readonly blockerIds: readonly string[];
}

export interface DeepReviewCertificateStatusEvidence {
  readonly state: DeepReviewModeStatus;
  readonly terminal: boolean;
  readonly statusEventId: string;
}

export interface DeepReviewRunCertificateBody {
  readonly certificateVersion: 1;
  readonly authority: 'dark-evidence-only';
  readonly runId: string;
  readonly sessionId: string;
  readonly generation: number;
  readonly lifecycleResult: DeepReviewCertificateLifecycleResult;
  readonly startHead: LedgerHeadFacts;
  readonly finalHead: LedgerHeadFacts;
  readonly artifactClaims: readonly DeepReviewCertificateArtifactClaim[];
  readonly artifactSetDigest: string;
  readonly namedDigestClosureRules: readonly DeepReviewNamedDigestClosureRule[];
  readonly orderedDependencyClosureDigest: string;
  readonly receiptDigests: readonly string[];
  readonly receiptChainDigest: string;
  readonly replayFingerprint: string;
  readonly replayFingerprintVersion: number;
  readonly projectionIntegrityDigest: string;
  readonly convergenceEvidence: DeepReviewCertificateConvergenceEvidence;
  readonly statusEvidence: DeepReviewCertificateStatusEvidence;
  readonly outputArtifactQualifiedDigests: readonly string[];
  readonly openObligationIds: readonly string[];
}

export interface DeepReviewRunCertificate {
  readonly body: DeepReviewRunCertificateBody;
  readonly certificateDigest: string;
  readonly sharedCertificationReceipt: BoundaryReceiptPayload;
}

export interface DeepReviewCertificateBundle {
  readonly bundleVersion: 1;
  readonly certificate: DeepReviewRunCertificate;
  readonly receipts: readonly DeepReviewTransitionReceipt[];
}

// ───────────────────────────────────────────────────────────────────
// 3. ISSUANCE AND OFFLINE VERIFICATION
// ───────────────────────────────────────────────────────────────────

export interface DeepReviewCertificateIssuerInput<TState extends JsonObject> {
  readonly runId: string;
  readonly sessionId: string;
  readonly generation: number;
  readonly projectionEvents: readonly DeepReviewLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly artifactBindings: readonly DeepReviewSealedArtifactBinding[];
  readonly transitionReceipts: readonly DeepReviewTransitionReceiptInput[];
  readonly replay: DeriveReplayFingerprintInput<TState>;
  readonly certificationProfile: CertificationProfile;
  readonly providers: CertificationProviderRegistry;
  readonly receiptSubstrate: DeepReviewTransitionReceiptSubstrate;
  readonly issuer: string;
  readonly issuedAt: string;
}

export interface DeepReviewOfflineVerificationInput<TState extends JsonObject> {
  readonly bundle: unknown;
  readonly projectionEvents: readonly DeepReviewLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly replay: DeriveReplayFingerprintInput<TState>;
  readonly providers: CertificationProviderRegistry;
}

export interface DeepReviewOfflineVerificationFailure {
  readonly verdict: Exclude<DeepReviewOfflineVerificationVerdict, 'valid'>;
  readonly code: DeepReviewCertificateFailureCode;
  readonly evidenceLocation: string;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly failureReason: string;
  readonly evidenceDigest: string;
}

export interface DeepReviewOfflineVerificationSuccess {
  readonly verdict: 'valid';
  readonly certificateDigest: string;
  readonly replayFingerprint: string;
  readonly projectionIntegrityDigest: string;
  readonly receiptChainDigest: string;
  readonly artifactSetDigest: string;
}

export type DeepReviewOfflineVerificationResult =
  | DeepReviewOfflineVerificationFailure
  | DeepReviewOfflineVerificationSuccess;

/** Bounded typed exception used internally and by strict issuance parsers. */
export class DeepReviewCertificateError extends Error {
  public readonly code: DeepReviewCertificateFailureCode;
  public readonly evidenceLocation: string;
  public readonly expectedDigest: string | null;
  public readonly actualDigest: string | null;

  public constructor(
    code: DeepReviewCertificateFailureCode,
    evidenceLocation: string,
    failureReason: string,
    expectedDigest: string | null = null,
    actualDigest: string | null = null,
  ) {
    super(failureReason);
    this.name = 'DeepReviewCertificateError';
    this.code = code;
    this.evidenceLocation = evidenceLocation;
    this.expectedDigest = expectedDigest;
    this.actualDigest = actualDigest;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
