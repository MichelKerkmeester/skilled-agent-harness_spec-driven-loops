// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Certificate Types
// ───────────────────────────────────────────────────────────────────

import type { LedgerHeadFacts } from '../receipts-and-effect-recovery/index.js';
import type {
  DeepAlignmentConvergenceEligibility,
  DeepAlignmentConvergenceOutcome,
  DeepAlignmentModeStatus,
} from '../deep-alignment-reducers/index.js';
import type {
  DeepAlignmentSealedArtifactBinding,
} from '../deep-alignment-sealed-artifacts/index.js';
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
import type { DeepAlignmentLedgerEvent } from '../deep-alignment-ledger-schema/index.js';
import type {
  EventProducer,
  EventTypeRegistry,
  JsonObject,
} from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED VOCABULARIES
// ───────────────────────────────────────────────────────────────────

export const DeepAlignmentTransitionKinds = Object.freeze({
  INIT: 'init',
  AUTHORITY: 'authority',
  SCOPE: 'scope',
  LANE: 'lane',
  SUBJECT: 'subject',
  APPLICABILITY: 'applicability',
  PASS: 'dimension-pass',
  OBSERVATION: 'observation',
  CANDIDATE: 'candidate',
  EVIDENCE: 'evidence',
  VERIFICATION: 'verification',
  PROOF: 'proof',
  ADJUDICATION: 'adjudication',
  CONFORMANCE: 'conformance',
  LINEAGE: 'lineage',
  DEVIATION: 'deviation',
  WITNESS_REPLAY: 'witness-replay',
  COVERAGE: 'coverage',
  CONVERGENCE: 'convergence',
  BLOCKED_STOP: 'blocked-stop',
  SYNTHESIS: 'synthesis',
  REPORT: 'report',
  CONTINUITY: 'continuity',
  COMPLETION: 'completion',
  RECOVERY: 'recovery',
} as const);

export type DeepAlignmentTransitionKind =
  typeof DeepAlignmentTransitionKinds[keyof typeof DeepAlignmentTransitionKinds];

export type DeepAlignmentTransitionDisposition =
  | 'applied'
  | 'blocked'
  | 'failed'
  | 'in_doubt'
  | 'incomplete'
  | 'quarantined'
  | 'succeeded';

export type DeepAlignmentCertificateLifecycleResult =
  | 'blocked'
  | 'failed'
  | 'incomplete'
  | 'trusted-completion';

export type DeepAlignmentOfflineVerificationVerdict =
  | 'valid'
  | 'invalid'
  | 'incomplete'
  | 'unverifiable';

export const DeepAlignmentCertificateFailureCodes = Object.freeze({
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

export type DeepAlignmentCertificateFailureCode =
  typeof DeepAlignmentCertificateFailureCodes[
    keyof typeof DeepAlignmentCertificateFailureCodes
  ];

// ───────────────────────────────────────────────────────────────────
// 2. RECEIPT AND CERTIFICATE CONTRACTS
// ───────────────────────────────────────────────────────────────────

export interface DeepAlignmentTransitionReceiptInput {
  readonly transitionKind: DeepAlignmentTransitionKind;
  readonly logicalOperationId: string;
  readonly attemptIds: readonly string[];
  readonly resultEventId: string;
  readonly inputArtifactQualifiedDigests: readonly string[];
  readonly outputArtifactQualifiedDigests: readonly string[];
}

export interface DeepAlignmentTransitionReceiptFacts {
  readonly receiptVersion: 1;
  readonly runId: string;
  readonly transitionId: string;
  readonly transitionKind: DeepAlignmentTransitionKind;
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
  readonly resultDisposition: DeepAlignmentTransitionDisposition;
  readonly dispositionReason: string;
  readonly replayFingerprint: string;
  readonly authorityEpoch: number;
  readonly priorReceiptDigest: string | null;
}

export interface DeepAlignmentTransitionReceipt {
  readonly facts: DeepAlignmentTransitionReceiptFacts;
  readonly receiptDigest: string;
  readonly sharedReceipt: BoundaryReceiptPayload;
}

export interface DeepAlignmentTransitionReceiptSubstrate {
  readonly writer: AuthorizedEvidenceWriter;
  readonly registry: EventTypeRegistry;
  readonly producer: EventProducer;
}

export interface DeepAlignmentCertificateArtifactClaim {
  readonly binding: DeepAlignmentSealedArtifactBinding;
  readonly descriptorDigest: string;
  readonly contentDigest: string;
  readonly canonicalizationVersion: string;
}

export interface DeepAlignmentNamedDigestClosureRule {
  readonly containingArtifactKind: DeepAlignmentSealedArtifactBinding['artifactKind'];
  readonly field: string;
  readonly expectedArtifactKinds: readonly DeepAlignmentSealedArtifactBinding['artifactKind'][];
  readonly cardinality: 'array' | 'scalar';
  readonly allowEmpty: boolean;
}

export interface DeepAlignmentCertificateAuthorityEvidence {
  readonly authorityEpochId: string;
  readonly authorityId: string;
  readonly authorityCapsuleRef: string;
  readonly validationEventId: string;
  readonly validationDigest: string;
}

export interface DeepAlignmentCertificateApplicabilityEvidence {
  readonly coverageDigest: string;
  readonly unresolvedRuleIds: readonly string[];
  readonly blockedRuleIds: readonly string[];
}

export interface DeepAlignmentCertificateConformanceEvidence {
  readonly overallVerdict: string;
  readonly activeFindingIds: readonly string[];
  readonly hardVetoFindingIds: readonly string[];
}

export interface DeepAlignmentCertificateConvergenceEvidence {
  readonly eligibility: DeepAlignmentConvergenceEligibility;
  readonly outcome: DeepAlignmentConvergenceOutcome;
  readonly evaluationEventId: string;
  readonly policyFingerprint: string;
  readonly evaluatorFingerprint: string;
  readonly evidenceTailHash: string;
  readonly blockerIds: readonly string[];
}

export interface DeepAlignmentCertificateStatusEvidence {
  readonly state: DeepAlignmentModeStatus;
  readonly terminal: boolean;
  readonly statusEventId: string;
}

export interface DeepAlignmentRunCertificateBody {
  readonly certificateVersion: 1;
  readonly authority: 'dark-evidence-only';
  readonly runId: string;
  readonly sessionId: string;
  readonly generation: number;
  readonly lifecycleResult: DeepAlignmentCertificateLifecycleResult;
  readonly startHead: LedgerHeadFacts;
  readonly finalHead: LedgerHeadFacts;
  readonly artifactClaims: readonly DeepAlignmentCertificateArtifactClaim[];
  readonly artifactSetDigest: string;
  readonly namedDigestClosureRules: readonly DeepAlignmentNamedDigestClosureRule[];
  readonly orderedDependencyClosureDigest: string;
  readonly receiptDigests: readonly string[];
  readonly receiptChainDigest: string;
  readonly replayFingerprint: string;
  readonly replayFingerprintVersion: number;
  readonly projectionIntegrityDigest: string;
  readonly authorityEvidence: DeepAlignmentCertificateAuthorityEvidence;
  readonly applicabilityEvidence: DeepAlignmentCertificateApplicabilityEvidence;
  readonly conformanceEvidence: DeepAlignmentCertificateConformanceEvidence;
  readonly convergenceEvidence: DeepAlignmentCertificateConvergenceEvidence;
  readonly statusEvidence: DeepAlignmentCertificateStatusEvidence;
  readonly outputArtifactQualifiedDigests: readonly string[];
  readonly openObligationIds: readonly string[];
}

export interface DeepAlignmentRunCertificate {
  readonly body: DeepAlignmentRunCertificateBody;
  readonly certificateDigest: string;
  readonly sharedCertificationReceipt: BoundaryReceiptPayload;
}

export interface DeepAlignmentCertificateBundle {
  readonly bundleVersion: 1;
  readonly certificate: DeepAlignmentRunCertificate;
  readonly receipts: readonly DeepAlignmentTransitionReceipt[];
}

// ───────────────────────────────────────────────────────────────────
// 3. ISSUANCE AND OFFLINE VERIFICATION
// ───────────────────────────────────────────────────────────────────

export interface DeepAlignmentCertificateIssuerInput<TState extends JsonObject> {
  readonly runId: string;
  readonly sessionId: string;
  readonly generation: number;
  readonly projectionEvents: readonly DeepAlignmentLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly artifactBindings: readonly DeepAlignmentSealedArtifactBinding[];
  readonly transitionReceipts: readonly DeepAlignmentTransitionReceiptInput[];
  readonly replay: DeriveReplayFingerprintInput<TState>;
  readonly certificationProfile: CertificationProfile;
  readonly providers: CertificationProviderRegistry;
  readonly receiptSubstrate: DeepAlignmentTransitionReceiptSubstrate;
  readonly issuer: string;
  readonly issuedAt: string;
}

export interface DeepAlignmentOfflineVerificationInput<TState extends JsonObject> {
  readonly bundle: unknown;
  readonly projectionEvents: readonly DeepAlignmentLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly replay: DeriveReplayFingerprintInput<TState>;
  readonly providers: CertificationProviderRegistry;
}

export interface DeepAlignmentOfflineVerificationFailure {
  readonly verdict: Exclude<DeepAlignmentOfflineVerificationVerdict, 'valid'>;
  readonly code: DeepAlignmentCertificateFailureCode;
  readonly evidenceLocation: string;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly failureReason: string;
  readonly evidenceDigest: string;
}

export interface DeepAlignmentOfflineVerificationSuccess {
  readonly verdict: 'valid';
  readonly certificateDigest: string;
  readonly replayFingerprint: string;
  readonly projectionIntegrityDigest: string;
  readonly receiptChainDigest: string;
  readonly artifactSetDigest: string;
}

export type DeepAlignmentOfflineVerificationResult =
  | DeepAlignmentOfflineVerificationFailure
  | DeepAlignmentOfflineVerificationSuccess;

/** Bounded typed exception used internally and by strict issuance parsers. */
export class DeepAlignmentCertificateError extends Error {
  public readonly code: DeepAlignmentCertificateFailureCode;
  public readonly evidenceLocation: string;
  public readonly expectedDigest: string | null;
  public readonly actualDigest: string | null;

  public constructor(
    code: DeepAlignmentCertificateFailureCode,
    evidenceLocation: string,
    failureReason: string,
    expectedDigest: string | null = null,
    actualDigest: string | null = null,
  ) {
    super(failureReason);
    this.name = 'DeepAlignmentCertificateError';
    this.code = code;
    this.evidenceLocation = evidenceLocation;
    this.expectedDigest = expectedDigest;
    this.actualDigest = actualDigest;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
