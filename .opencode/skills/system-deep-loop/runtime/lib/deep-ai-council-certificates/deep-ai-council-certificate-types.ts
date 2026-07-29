// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Certificate Types
// ───────────────────────────────────────────────────────────────────

import type { LedgerHeadFacts } from '../receipts-and-effect-recovery/index.js';
import type {
  DeepAiCouncilConvergenceOutcome,
  DeepAiCouncilModeStatus,
} from '../deep-ai-council-reducers/index.js';
import type {
  DeepAiCouncilSealedArtifactBinding,
} from '../deep-ai-council-sealed-artifacts/index.js';
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
import type { DeepAiCouncilLedgerEvent } from '../deep-ai-council-ledger-schema/index.js';
import type {
  EventProducer,
  EventTypeRegistry,
  JsonObject,
} from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED VOCABULARIES
// ───────────────────────────────────────────────────────────────────

export const DeepAiCouncilTransitionKinds = Object.freeze({
  INIT: 'init',
  SEAT_SELECT_DISPATCH: 'seat-select-dispatch',
  SEAT_RETURN: 'seat-return',
  CRITIQUE_ROUND: 'critique-round',
  CANDIDATE_BLIND_JUDGE: 'candidate-blind-judge',
  SYNTHESIS: 'synthesis',
  CONVERGENCE: 'convergence',
  ARTIFACT_COMMIT: 'artifact-commit',
  COUNCIL_TEST_GATE: 'council-test-gate',
  RECOVERY: 'recovery',
  COMPLETE: 'complete',
} as const);

export type DeepAiCouncilTransitionKind =
  typeof DeepAiCouncilTransitionKinds[keyof typeof DeepAiCouncilTransitionKinds];

export type DeepAiCouncilTransitionDisposition =
  | 'applied'
  | 'blocked'
  | 'failed'
  | 'in_doubt'
  | 'incomplete'
  | 'quarantined'
  | 'succeeded';

export type DeepAiCouncilCertificateLifecycleResult =
  | 'blocked'
  | 'failed'
  | 'incomplete'
  | 'quarantined'
  | 'trusted-completion';

export type DeepAiCouncilOfflineVerificationVerdict =
  | 'valid'
  | 'invalid'
  | 'incomplete'
  | 'unverifiable';

export const DeepAiCouncilCertificateFailureCodes = Object.freeze({
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
  TEST_GATE_INVALID: 'TEST_GATE_INVALID',
  UNSUPPORTED_VERSION: 'UNSUPPORTED_VERSION',
} as const);

export type DeepAiCouncilCertificateFailureCode =
  typeof DeepAiCouncilCertificateFailureCodes[
    keyof typeof DeepAiCouncilCertificateFailureCodes
  ];

// ───────────────────────────────────────────────────────────────────
// 2. RECEIPT AND CERTIFICATE CONTRACTS
// ───────────────────────────────────────────────────────────────────

export interface DeepAiCouncilTransitionReceiptInput {
  readonly transitionKind: DeepAiCouncilTransitionKind;
  readonly logicalOperationId: string;
  readonly attemptIds: readonly string[];
  readonly resultEventId: string;
  readonly inputArtifactQualifiedDigests: readonly string[];
  readonly outputArtifactQualifiedDigests: readonly string[];
}

export interface DeepAiCouncilTransitionReceiptFacts {
  readonly receiptVersion: 1;
  readonly runId: string;
  readonly transitionId: string;
  readonly transitionKind: DeepAiCouncilTransitionKind;
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
  readonly resultDisposition: DeepAiCouncilTransitionDisposition;
  readonly dispositionReason: string;
  readonly replayFingerprint: string;
  readonly authorityEpoch: number;
  readonly priorReceiptDigest: string | null;
}

export interface DeepAiCouncilTransitionReceipt {
  readonly facts: DeepAiCouncilTransitionReceiptFacts;
  readonly receiptDigest: string;
  readonly sharedReceipt: BoundaryReceiptPayload;
}

export interface DeepAiCouncilTransitionReceiptSubstrate {
  readonly writer: AuthorizedEvidenceWriter;
  readonly registry: EventTypeRegistry;
  readonly producer: EventProducer;
}

export interface DeepAiCouncilCertificateArtifactClaim {
  readonly binding: DeepAiCouncilSealedArtifactBinding;
  readonly descriptorDigest: string;
  readonly contentDigest: string;
  readonly canonicalizationVersion: string;
}

export interface DeepAiCouncilCertificateConvergenceEvidence {
  readonly outcome: DeepAiCouncilConvergenceOutcome;
  readonly eligible: boolean;
  readonly evaluationEventId: string;
  readonly decision: 'blocked' | 'continue' | 'converged' | 'incomplete' | 'non-converged';
  readonly rawAgreement: number;
  readonly calibratedSupport: number;
  readonly effectiveSeatCount: number;
  readonly blockerIds: readonly string[];
}

export interface DeepAiCouncilCertificateStatusEvidence {
  readonly state: DeepAiCouncilModeStatus;
  readonly terminal: boolean;
  readonly statusEventId: string;
}

export interface DeepAiCouncilCertificateTestGateEvidence {
  readonly verdict: 'blocked' | 'fail' | 'pass' | 'unknown';
  readonly evaluationEventId: string;
  readonly testSuiteDigest: string;
  readonly fixtureManifestDigest: string;
  readonly artifactCompleteness: 'complete' | 'incomplete' | 'unknown';
  readonly criticalFailureRefs: readonly string[];
}

export interface DeepAiCouncilRunCertificateBody {
  readonly certificateVersion: 1;
  readonly authority: 'dark-evidence-only';
  readonly runId: string;
  readonly roundId: string;
  readonly generation: number;
  readonly lifecycleResult: DeepAiCouncilCertificateLifecycleResult;
  readonly startHead: LedgerHeadFacts;
  readonly finalHead: LedgerHeadFacts;
  readonly artifactClaims: readonly DeepAiCouncilCertificateArtifactClaim[];
  readonly artifactSetDigest: string;
  readonly orderedDependencyClosureDigest: string;
  readonly receiptDigests: readonly string[];
  readonly receiptChainDigest: string;
  readonly replayFingerprint: string;
  readonly replayFingerprintVersion: number;
  readonly projectionIntegrityDigest: string;
  readonly convergenceEvidence: DeepAiCouncilCertificateConvergenceEvidence;
  readonly statusEvidence: DeepAiCouncilCertificateStatusEvidence;
  readonly testGateEvidence: DeepAiCouncilCertificateTestGateEvidence;
  readonly outputArtifactQualifiedDigests: readonly string[];
  readonly openObligationIds: readonly string[];
}

export interface DeepAiCouncilRunCertificate {
  readonly body: DeepAiCouncilRunCertificateBody;
  readonly certificateDigest: string;
  readonly sharedCertificationReceipt: BoundaryReceiptPayload;
}

export interface DeepAiCouncilCertificateBundle {
  readonly bundleVersion: 1;
  readonly certificate: DeepAiCouncilRunCertificate;
  readonly receipts: readonly DeepAiCouncilTransitionReceipt[];
}

// ───────────────────────────────────────────────────────────────────
// 3. ISSUANCE AND OFFLINE VERIFICATION
// ───────────────────────────────────────────────────────────────────

export interface DeepAiCouncilCertificateIssuerInput<TState extends JsonObject> {
  readonly runId: string;
  readonly roundId: string;
  readonly generation: number;
  readonly projectionEvents: readonly DeepAiCouncilLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly artifactBindings: readonly DeepAiCouncilSealedArtifactBinding[];
  readonly transitionReceipts: readonly DeepAiCouncilTransitionReceiptInput[];
  readonly replay: DeriveReplayFingerprintInput<TState>;
  readonly certificationProfile: CertificationProfile;
  readonly providers: CertificationProviderRegistry;
  readonly receiptSubstrate: DeepAiCouncilTransitionReceiptSubstrate;
  readonly issuer: string;
  readonly issuedAt: string;
}

export interface DeepAiCouncilOfflineVerificationInput<TState extends JsonObject> {
  readonly bundle: unknown;
  readonly projectionEvents: readonly DeepAiCouncilLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly replay: DeriveReplayFingerprintInput<TState>;
  readonly providers: CertificationProviderRegistry;
}

export interface DeepAiCouncilOfflineVerificationFailure {
  readonly verdict: Exclude<DeepAiCouncilOfflineVerificationVerdict, 'valid'>;
  readonly code: DeepAiCouncilCertificateFailureCode;
  readonly evidenceLocation: string;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly failureReason: string;
  readonly evidenceDigest: string;
}

export interface DeepAiCouncilOfflineVerificationSuccess {
  readonly verdict: 'valid';
  readonly certificateDigest: string;
  readonly replayFingerprint: string;
  readonly projectionIntegrityDigest: string;
  readonly receiptChainDigest: string;
  readonly artifactSetDigest: string;
}

export type DeepAiCouncilOfflineVerificationResult =
  | DeepAiCouncilOfflineVerificationFailure
  | DeepAiCouncilOfflineVerificationSuccess;

/** Bounded typed exception used internally and by strict issuance parsers. */
export class DeepAiCouncilCertificateError extends Error {
  public readonly code: DeepAiCouncilCertificateFailureCode;
  public readonly evidenceLocation: string;
  public readonly expectedDigest: string | null;
  public readonly actualDigest: string | null;

  public constructor(
    code: DeepAiCouncilCertificateFailureCode,
    evidenceLocation: string,
    failureReason: string,
    expectedDigest: string | null = null,
    actualDigest: string | null = null,
  ) {
    super(failureReason);
    this.name = 'DeepAiCouncilCertificateError';
    this.code = code;
    this.evidenceLocation = evidenceLocation;
    this.expectedDigest = expectedDigest;
    this.actualDigest = actualDigest;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
