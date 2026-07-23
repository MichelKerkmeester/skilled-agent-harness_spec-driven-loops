// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Certificate Types
// ───────────────────────────────────────────────────────────────────

import type { LedgerHeadFacts } from '../receipts-and-effect-recovery/index.js';
import type {
  DeepResearchConvergenceEligibility,
  DeepResearchConvergenceOutcome,
  DeepResearchModeStatus,
} from '../deep-research-reducers/index.js';
import type {
  DeepResearchSealedArtifactBinding,
} from '../deep-research-sealed-artifacts/index.js';
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
import type { DeepResearchLedgerEvent } from '../deep-research-ledger-schema/index.js';
import type {
  EventProducer,
  EventTypeRegistry,
  JsonObject,
} from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED VOCABULARIES
// ───────────────────────────────────────────────────────────────────

export const DeepResearchTransitionKinds = Object.freeze({
  INIT: 'init',
  GATHER: 'gather',
  ANALYZE: 'analyze',
  CONVERGENCE: 'convergence',
  SYNTHESIS: 'synthesis',
  MEMORY_SAVE: 'memory-save',
  RECOVERY: 'recovery',
} as const);

export type DeepResearchTransitionKind =
  typeof DeepResearchTransitionKinds[keyof typeof DeepResearchTransitionKinds];

export type DeepResearchTransitionDisposition =
  | 'applied'
  | 'blocked'
  | 'failed'
  | 'in_doubt'
  | 'incomplete'
  | 'quarantined'
  | 'succeeded';

export type DeepResearchCertificateLifecycleResult =
  | 'blocked'
  | 'failed'
  | 'incomplete'
  | 'quarantined'
  | 'trusted-completion';

export type DeepResearchOfflineVerificationVerdict =
  | 'valid'
  | 'invalid'
  | 'incomplete'
  | 'unverifiable';

export const DeepResearchCertificateFailureCodes = Object.freeze({
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

export type DeepResearchCertificateFailureCode =
  typeof DeepResearchCertificateFailureCodes[
    keyof typeof DeepResearchCertificateFailureCodes
  ];

// ───────────────────────────────────────────────────────────────────
// 2. RECEIPT AND CERTIFICATE CONTRACTS
// ───────────────────────────────────────────────────────────────────

export interface DeepResearchTransitionReceiptInput {
  readonly transitionKind: DeepResearchTransitionKind;
  readonly logicalOperationId: string;
  readonly attemptIds: readonly string[];
  readonly resultEventId: string;
  readonly inputArtifactQualifiedDigests: readonly string[];
  readonly outputArtifactQualifiedDigests: readonly string[];
}

export interface DeepResearchTransitionReceiptFacts {
  readonly receiptVersion: 1;
  readonly runId: string;
  readonly transitionId: string;
  readonly transitionKind: DeepResearchTransitionKind;
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
  readonly resultDisposition: DeepResearchTransitionDisposition;
  readonly dispositionReason: string;
  readonly replayFingerprint: string;
  readonly authorityEpoch: number;
  readonly priorReceiptDigest: string | null;
}

export interface DeepResearchTransitionReceipt {
  readonly facts: DeepResearchTransitionReceiptFacts;
  readonly receiptDigest: string;
  readonly sharedReceipt: BoundaryReceiptPayload;
}

export interface DeepResearchTransitionReceiptSubstrate {
  readonly writer: AuthorizedEvidenceWriter;
  readonly registry: EventTypeRegistry;
  readonly producer: EventProducer;
}

export interface DeepResearchCertificateArtifactClaim {
  readonly binding: DeepResearchSealedArtifactBinding;
  readonly descriptorDigest: string;
  readonly contentDigest: string;
  readonly canonicalizationVersion: string;
}

export interface DeepResearchCertificateConvergenceEvidence {
  readonly eligibility: DeepResearchConvergenceEligibility;
  readonly outcome: DeepResearchConvergenceOutcome;
  readonly evaluationEventId: string;
  readonly policyFingerprint: string;
  readonly evaluatorFingerprint: string;
  readonly evidenceTailHash: string;
  readonly blockerIds: readonly string[];
}

export interface DeepResearchCertificateStatusEvidence {
  readonly state: DeepResearchModeStatus;
  readonly terminal: boolean;
  readonly statusEventId: string;
}

export interface DeepResearchRunCertificateBody {
  readonly certificateVersion: 1;
  readonly authority: 'dark-evidence-only';
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly lifecycleResult: DeepResearchCertificateLifecycleResult;
  readonly startHead: LedgerHeadFacts;
  readonly finalHead: LedgerHeadFacts;
  readonly artifactClaims: readonly DeepResearchCertificateArtifactClaim[];
  readonly artifactSetDigest: string;
  readonly receiptDigests: readonly string[];
  readonly receiptChainDigest: string;
  readonly replayFingerprint: string;
  readonly replayFingerprintVersion: number;
  readonly projectionIntegrityDigest: string;
  readonly convergenceEvidence: DeepResearchCertificateConvergenceEvidence;
  readonly statusEvidence: DeepResearchCertificateStatusEvidence;
  readonly outputArtifactQualifiedDigests: readonly string[];
  readonly openObligationIds: readonly string[];
}

export interface DeepResearchRunCertificate {
  readonly body: DeepResearchRunCertificateBody;
  readonly certificateDigest: string;
  readonly sharedCertificationReceipt: BoundaryReceiptPayload;
}

export interface DeepResearchCertificateBundle {
  readonly bundleVersion: 1;
  readonly certificate: DeepResearchRunCertificate;
  readonly receipts: readonly DeepResearchTransitionReceipt[];
}

// ───────────────────────────────────────────────────────────────────
// 3. ISSUANCE AND OFFLINE VERIFICATION
// ───────────────────────────────────────────────────────────────────

export interface DeepResearchCertificateIssuerInput<TState extends JsonObject> {
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly projectionEvents: readonly DeepResearchLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly artifactBindings: readonly DeepResearchSealedArtifactBinding[];
  readonly transitionReceipts: readonly DeepResearchTransitionReceiptInput[];
  readonly replay: DeriveReplayFingerprintInput<TState>;
  readonly certificationProfile: CertificationProfile;
  readonly providers: CertificationProviderRegistry;
  readonly receiptSubstrate: DeepResearchTransitionReceiptSubstrate;
  readonly issuer: string;
  readonly issuedAt: string;
}

export interface DeepResearchOfflineVerificationInput<TState extends JsonObject> {
  readonly bundle: unknown;
  readonly projectionEvents: readonly DeepResearchLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly replay: DeriveReplayFingerprintInput<TState>;
  readonly providers: CertificationProviderRegistry;
}

export interface DeepResearchOfflineVerificationFailure {
  readonly verdict: Exclude<DeepResearchOfflineVerificationVerdict, 'valid'>;
  readonly code: DeepResearchCertificateFailureCode;
  readonly evidenceLocation: string;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly failureReason: string;
  readonly evidenceDigest: string;
}

export interface DeepResearchOfflineVerificationSuccess {
  readonly verdict: 'valid';
  readonly certificateDigest: string;
  readonly replayFingerprint: string;
  readonly projectionIntegrityDigest: string;
  readonly receiptChainDigest: string;
  readonly artifactSetDigest: string;
}

export type DeepResearchOfflineVerificationResult =
  | DeepResearchOfflineVerificationFailure
  | DeepResearchOfflineVerificationSuccess;

/** Bounded typed exception used internally and by strict issuance parsers. */
export class DeepResearchCertificateError extends Error {
  public readonly code: DeepResearchCertificateFailureCode;
  public readonly evidenceLocation: string;
  public readonly expectedDigest: string | null;
  public readonly actualDigest: string | null;

  public constructor(
    code: DeepResearchCertificateFailureCode,
    evidenceLocation: string,
    failureReason: string,
    expectedDigest: string | null = null,
    actualDigest: string | null = null,
  ) {
    super(failureReason);
    this.name = 'DeepResearchCertificateError';
    this.code = code;
    this.evidenceLocation = evidenceLocation;
    this.expectedDigest = expectedDigest;
    this.actualDigest = actualDigest;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
