// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Certificate Types
// ───────────────────────────────────────────────────────────────────

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type { DeepImprovementCommonLedgerEvent } from '../deep-improvement-common-ledger-schema/index.js';
import type {
  DeepImprovementCommonArtifactKind,
  DeepImprovementCommonSealedArtifactBinding,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import type {
  BoundaryReceiptPayload,
  CertificationProfile,
  CertificationProviderRegistry,
} from '../receipts-and-effect-recovery/index.js';
import type { AuthorizedEvidenceWriter } from '../receipts-and-effect-recovery/index.js';
import type { DeriveReplayFingerprintInput } from '../replay-fingerprint/index.js';
import type { SealedArtifactStore } from '../sealed-reference-artifacts/index.js';
import type { EventProducer, EventTypeRegistry, JsonObject } from '../event-envelope/index.js';

export const DeepImprovementCommonTransitionKinds = Object.freeze({
  EVALUATOR_EPOCH_ESTABLISHED: 'evaluator-epoch-established',
  CANDIDATE_GENERATED: 'candidate-generated',
  EVALUATION_STARTED: 'evaluation-started',
  CANDIDATE_SCORED: 'candidate-scored',
  CANARY_CHECKED: 'canary-checked',
  PROMOTION_PROPOSED: 'promotion-proposed',
  PROMOTION_AUTHORIZED: 'promotion-authorized',
  PROMOTION_BLOCKED: 'promotion-blocked',
  GUARDED_PROMOTION: 'guarded-promotion',
  ABORTED: 'aborted',
  RESTORED: 'restored',
} as const);

export type DeepImprovementCommonTransitionKind =
  typeof DeepImprovementCommonTransitionKinds[
    keyof typeof DeepImprovementCommonTransitionKinds
  ];

export type DeepImprovementCommonTransitionOutcome =
  | 'completed'
  | 'recovered'
  | 'uncertain'
  | 'vetoed';

export type DeepImprovementCommonCertificateVerdict =
  | 'PASS'
  | 'FAIL'
  | 'ABORT'
  | 'INSUFFICIENT_EVIDENCE';

export type DeepImprovementCommonOfflineVerificationVerdict =
  | 'valid'
  | 'invalid'
  | 'incomplete'
  | 'unverifiable'
  | 'unsupported';

export const DeepImprovementCommonCertificateFailureCodes = Object.freeze({
  ARTIFACT_CLOSURE_INVALID: 'ARTIFACT_CLOSURE_INVALID',
  ARTIFACT_MISSING: 'ARTIFACT_MISSING',
  ARTIFACT_MUTATED: 'ARTIFACT_MUTATED',
  ARTIFACT_STALE: 'ARTIFACT_STALE',
  ARTIFACT_WRONG_KIND: 'ARTIFACT_WRONG_KIND',
  AUTHORIZATION_INVALID: 'AUTHORIZATION_INVALID',
  CERTIFICATE_INVALID: 'CERTIFICATE_INVALID',
  CERTIFICATION_INVALID: 'CERTIFICATION_INVALID',
  EVIDENCE_INCOMPLETE: 'EVIDENCE_INCOMPLETE',
  LEDGER_INVALID: 'LEDGER_INVALID',
  PROJECTION_INVALID: 'PROJECTION_INVALID',
  RECEIPT_CHAIN_INVALID: 'RECEIPT_CHAIN_INVALID',
  RECEIPT_MISSING: 'RECEIPT_MISSING',
  REPLAY_INVALID: 'REPLAY_INVALID',
  TRANSITION_INVALID: 'TRANSITION_INVALID',
  UNSUPPORTED_VERSION: 'UNSUPPORTED_VERSION',
  VISIBILITY_INVALID: 'VISIBILITY_INVALID',
} as const);

export type DeepImprovementCommonCertificateFailureCode =
  typeof DeepImprovementCommonCertificateFailureCodes[
    keyof typeof DeepImprovementCommonCertificateFailureCodes
  ];

export interface DeepImprovementCommonReceiptIdentity {
  readonly identityVersion: 1;
  readonly runId: string;
  readonly transitionKind: DeepImprovementCommonTransitionKind;
  readonly logicalOperationId: string;
  readonly effectIdempotencyKey: string;
  readonly digest: string;
}

export interface DeepImprovementCommonTransitionReceiptInput {
  readonly transitionKind: DeepImprovementCommonTransitionKind;
  readonly logicalOperationId: string;
  readonly effectIdempotencyKey: string;
  readonly attemptNumber: number;
  readonly resultEventId: string;
  readonly inputArtifactQualifiedDigests: readonly string[];
  readonly outputArtifactQualifiedDigests: readonly string[];
  readonly evidenceArtifactQualifiedDigests: readonly string[];
}

export interface DeepImprovementCommonTransitionReceiptFacts {
  readonly receiptVersion: 1;
  readonly identity: DeepImprovementCommonReceiptIdentity;
  readonly predecessorReceiptIdentities: readonly DeepImprovementCommonReceiptIdentity[];
  readonly predecessorReceiptDigests: readonly string[];
  readonly runId: string;
  readonly transitionKind: DeepImprovementCommonTransitionKind;
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
  readonly outcome: DeepImprovementCommonTransitionOutcome;
  readonly uncertaintyState: 'known' | 'unknown-effect';
  readonly serviceVersion: string;
  readonly replayFingerprint: string;
  readonly transitionFingerprint: string;
  readonly authorityEpoch: number;
}

export interface DeepImprovementCommonTransitionReceipt {
  readonly facts: DeepImprovementCommonTransitionReceiptFacts;
  readonly receiptDigest: string;
  readonly sharedReceipt: BoundaryReceiptPayload;
}

export interface DeepImprovementCommonCertificateArtifactClaim {
  readonly binding: DeepImprovementCommonSealedArtifactBinding;
  readonly descriptorDigest: string;
  readonly contentDigest: string;
  readonly canonicalizationVersion: string;
}

export interface DeepImprovementCommonNamedDigestClosureRule {
  readonly containingArtifactKind: DeepImprovementCommonArtifactKind;
  readonly field: 'unresolvedEvidenceDigests[]' | 'vetoEvidenceDigests[]';
  readonly expectedArtifactKind: DeepImprovementCommonArtifactKind;
}

export interface DeepImprovementCommonRunCertificateBody {
  readonly certificateVersion: 1;
  readonly authority: 'dark-evidence-only';
  readonly sharedContractId: 'deep-improvement-common-certificates';
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly evaluatorEpochId: string;
  readonly candidateId: string;
  readonly baselineId: string;
  readonly canaryEpochId: string;
  readonly verdict: DeepImprovementCommonCertificateVerdict;
  readonly artifactClaims: readonly DeepImprovementCommonCertificateArtifactClaim[];
  readonly artifactSetDigest: string;
  readonly evaluatorCapsuleQualifiedDigest: string;
  readonly candidateInputQualifiedDigest: string;
  readonly baselineInputQualifiedDigest: string;
  readonly rawObservationQualifiedDigests: readonly string[];
  readonly canaryEpochQualifiedDigest: string;
  readonly promotionEvidenceQualifiedDigest: string;
  readonly namedDigestClosureRules: readonly DeepImprovementCommonNamedDigestClosureRule[];
  readonly orderedDependencyClosure: readonly string[];
  readonly receiptIdentities: readonly DeepImprovementCommonReceiptIdentity[];
  readonly receiptDigests: readonly string[];
  readonly receiptChainDigest: string;
  readonly substrateReplayFingerprint: string;
  readonly replayFingerprint: string;
  readonly replayFingerprintVersion: number;
  readonly projectionIntegrityDigest: string;
  readonly evaluatorPolicyDigest: string;
  readonly budgetDigest: string;
  readonly vetoEvidenceDigests: readonly string[];
  readonly startHeadHash: string;
  readonly finalHeadHash: string;
}

export interface DeepImprovementCommonRunCertificate {
  readonly body: DeepImprovementCommonRunCertificateBody;
  readonly certificateDigest: string;
  readonly sharedCertificationReceipt: BoundaryReceiptPayload;
}

export interface DeepImprovementCommonCertificateBundle {
  readonly bundleVersion: 1;
  readonly certificate: DeepImprovementCommonRunCertificate;
  readonly receipts: readonly DeepImprovementCommonTransitionReceipt[];
}

export interface DeepImprovementCommonTransitionReceiptSubstrate {
  readonly writer: AuthorizedEvidenceWriter;
  readonly registry: EventTypeRegistry;
  readonly producer: EventProducer;
}

export interface DeepImprovementCommonTransitionReceiptContext {
  readonly runId: string;
  readonly replayFingerprint: string;
  readonly priorReceipts: readonly DeepImprovementCommonTransitionReceipt[];
  readonly ledgerEvents: readonly VerifiedLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly artifactBindings: readonly DeepImprovementCommonSealedArtifactBinding[];
  readonly certificationProfile: CertificationProfile;
  readonly providers: CertificationProviderRegistry;
  readonly receiptSubstrate: DeepImprovementCommonTransitionReceiptSubstrate;
  readonly serviceVersion: string;
  readonly issuer: string;
  readonly issuedAt: string;
  readonly verificationTime: string;
}

export interface DeepImprovementCommonCertificateIssuerInput<TState extends JsonObject> {
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly projectionEvents: readonly DeepImprovementCommonLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly artifactBindings: readonly DeepImprovementCommonSealedArtifactBinding[];
  readonly transitionReceipts: readonly DeepImprovementCommonTransitionReceiptInput[];
  readonly replay: DeriveReplayFingerprintInput<TState>;
  readonly certificationProfile: CertificationProfile;
  readonly providers: CertificationProviderRegistry;
  readonly receiptSubstrate: DeepImprovementCommonTransitionReceiptSubstrate;
  readonly serviceVersion: string;
  readonly issuer: string;
  readonly issuedAt: string;
  readonly verificationTime: string;
}

export interface DeepImprovementCommonOfflineVerificationInput<TState extends JsonObject> {
  readonly bundle: unknown;
  readonly projectionEvents: readonly DeepImprovementCommonLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly replay: DeriveReplayFingerprintInput<TState>;
  readonly providers: CertificationProviderRegistry;
  readonly verificationTime: string;
}

export interface DeepImprovementCommonOfflineVerificationFailure {
  readonly verdict: Exclude<DeepImprovementCommonOfflineVerificationVerdict, 'valid'>;
  readonly code: DeepImprovementCommonCertificateFailureCode;
  readonly evidenceLocation: string;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly failureReason: string;
  readonly evidenceDigest: string;
}

export interface DeepImprovementCommonOfflineVerifierReceipt {
  readonly receiptVersion: 1;
  readonly certificateDigest: string;
  readonly verifierVersion: string;
  readonly rulesetDigest: string;
  readonly replayFingerprint: string;
  readonly evidenceDigests: readonly string[];
  readonly verificationDigest: string;
}

export interface DeepImprovementCommonOfflineVerificationSuccess {
  readonly verdict: 'valid';
  readonly certificateDigest: string;
  readonly replayFingerprint: string;
  readonly projectionIntegrityDigest: string;
  readonly receiptChainDigest: string;
  readonly artifactSetDigest: string;
  readonly verificationReceipt: DeepImprovementCommonOfflineVerifierReceipt;
}

export type DeepImprovementCommonOfflineVerificationResult =
  | DeepImprovementCommonOfflineVerificationFailure
  | DeepImprovementCommonOfflineVerificationSuccess;

export class DeepImprovementCommonCertificateError extends Error {
  public readonly code: DeepImprovementCommonCertificateFailureCode;
  public readonly evidenceLocation: string;
  public readonly expectedDigest: string | null;
  public readonly actualDigest: string | null;

  public constructor(
    code: DeepImprovementCommonCertificateFailureCode,
    evidenceLocation: string,
    failureReason: string,
    expectedDigest: string | null = null,
    actualDigest: string | null = null,
  ) {
    super(failureReason);
    this.name = 'DeepImprovementCommonCertificateError';
    this.code = code;
    this.evidenceLocation = evidenceLocation;
    this.expectedDigest = expectedDigest;
    this.actualDigest = actualDigest;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
