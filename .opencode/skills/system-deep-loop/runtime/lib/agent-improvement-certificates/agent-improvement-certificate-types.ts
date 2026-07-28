// MODULE: Agent Improvement Certificate Types

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonCertificateBundle,
  DeepImprovementCommonOfflineVerificationInput,
  DeepImprovementCommonReceiptIdentity,
} from '../deep-improvement-common-certificates/index.js';
import type { AgentImprovementLedgerEvent } from '../agent-improvement-ledger-schema/index.js';
import type {
  AgentImprovementArtifactKind,
  AgentImprovementSealedArtifactBinding,
} from '../agent-improvement-sealed-artifacts/index.js';
import type {
  BoundaryReceiptPayload,
  CertificationProfile,
  CertificationProviderRegistry,
} from '../receipts-and-effect-recovery/index.js';
import type { AuthorizedEvidenceWriter } from '../receipts-and-effect-recovery/index.js';
import type { DeriveReplayFingerprintInput } from '../replay-fingerprint/index.js';
import type { SealedArtifactStore } from '../sealed-reference-artifacts/index.js';
import type { EventProducer, EventTypeRegistry, JsonObject } from '../event-envelope/index.js';

export const AgentImprovementTransitionKinds = Object.freeze({
  PROPOSAL_CREATED: 'proposal-created',
  SCORE_REDUCED: 'score-reduced',
  BENCHMARK_EVIDENCE_RECORDED: 'benchmark-evidence-recorded',
} as const);

export type AgentImprovementTransitionKind =
  typeof AgentImprovementTransitionKinds[keyof typeof AgentImprovementTransitionKinds];

export type AgentImprovementTransitionOutcome =
  | 'completed'
  | 'inconclusive'
  | 'rejected';

export type AgentImprovementCertificateDisposition =
  | 'ABORT'
  | 'FAIL'
  | 'INSUFFICIENT_EVIDENCE'
  | 'PASS';

export type AgentImprovementOfflineVerificationVerdict =
  | 'valid'
  | 'invalid'
  | 'incomplete'
  | 'unverifiable';

export const AgentImprovementCertificateFailureCodes = Object.freeze({
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
  MISSING_EVIDENCE: 'MISSING_EVIDENCE',
  PROJECTION_INVALID: 'PROJECTION_INVALID',
  RECEIPT_CHAIN_INVALID: 'RECEIPT_CHAIN_INVALID',
  SCHEMA_INCOMPATIBLE: 'SCHEMA_INCOMPATIBLE',
  TRANSITION_UNAUTHORIZED: 'TRANSITION_UNAUTHORIZED',
  VISIBILITY_INVALID: 'VISIBILITY_INVALID',
} as const);

export type AgentImprovementCertificateFailureCode =
  typeof AgentImprovementCertificateFailureCodes[
    keyof typeof AgentImprovementCertificateFailureCodes
  ];

export interface AgentImprovementReceiptIdentity {
  readonly identityVersion: 1;
  readonly runId: string;
  readonly transitionKind: AgentImprovementTransitionKind;
  readonly logicalOperationId: string;
  readonly effectIdempotencyKey: string;
  readonly digest: string;
}

export interface AgentImprovementTransitionReceiptInput {
  readonly transitionKind: AgentImprovementTransitionKind;
  readonly logicalOperationId: string;
  readonly effectIdempotencyKey: string;
  readonly attemptNumber: number;
  readonly resultEventId: string;
  readonly inputArtifactQualifiedDigests: readonly string[];
  readonly outputArtifactQualifiedDigests: readonly string[];
  readonly evidenceArtifactQualifiedDigests: readonly string[];
}

export interface AgentImprovementTransitionReceiptFacts {
  readonly receiptVersion: 1;
  readonly identity: AgentImprovementReceiptIdentity;
  readonly predecessorReceiptDigests: readonly string[];
  readonly commonReceiptIdentities: readonly DeepImprovementCommonReceiptIdentity[];
  readonly runId: string;
  readonly transitionKind: AgentImprovementTransitionKind;
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
  readonly outcome: AgentImprovementTransitionOutcome;
  readonly substrateReplayFingerprint: string;
  readonly transitionFingerprint: string;
  readonly authorityEpoch: number;
}

export interface AgentImprovementTransitionReceipt {
  readonly facts: AgentImprovementTransitionReceiptFacts;
  readonly receiptDigest: string;
  readonly sharedReceipt: BoundaryReceiptPayload;
}

export type AgentImprovementCertificateArtifactRole =
  | 'benchmark-evidence'
  | 'proposal'
  | 'scoring-evidence';

export interface AgentImprovementCertificateArtifactClaim {
  readonly role: AgentImprovementCertificateArtifactRole;
  readonly expectedArtifactKind: AgentImprovementArtifactKind;
  readonly binding: AgentImprovementSealedArtifactBinding;
  readonly descriptorDigest: string;
  readonly contentDigest: string;
  readonly canonicalizationVersion: string;
}

export interface AgentImprovementRunCertificateBody {
  readonly certificateVersion: 1;
  readonly authority: 'dark-evidence-only';
  readonly mode: 'agent-improvement';
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly candidateId: string;
  readonly parentCandidateId: string | null;
  readonly agentIrDigest: string;
  readonly changeContractDigest: string;
  readonly mutationProposalDigest: string;
  readonly evaluationEpochId: string;
  readonly canaryEpochId: string;
  readonly disposition: AgentImprovementCertificateDisposition;
  readonly artifactClaims: readonly AgentImprovementCertificateArtifactClaim[];
  readonly artifactSetDigest: string;
  readonly namedDigestClosureRules: readonly [];
  readonly orderedDependencyClosure: readonly string[];
  readonly commonCertificateDigest: string;
  readonly commonReceiptIdentities: readonly DeepImprovementCommonReceiptIdentity[];
  readonly receiptIdentities: readonly AgentImprovementReceiptIdentity[];
  readonly receiptDigests: readonly string[];
  readonly receiptChainDigest: string;
  readonly substrateReplayFingerprint: string;
  readonly replayFingerprint: string;
  readonly replayFingerprintVersion: number;
  readonly projectionIntegrityDigest: string;
  readonly startHeadHash: string;
  readonly finalHeadHash: string;
}

export interface AgentImprovementRunCertificate {
  readonly body: AgentImprovementRunCertificateBody;
  readonly certificateDigest: string;
  readonly sharedCertificationReceipt: BoundaryReceiptPayload;
}

export interface AgentImprovementCertificateBundle {
  readonly bundleVersion: 1;
  readonly certificate: AgentImprovementRunCertificate;
  readonly receipts: readonly AgentImprovementTransitionReceipt[];
  readonly commonBundle: DeepImprovementCommonCertificateBundle;
}

export interface AgentImprovementTransitionReceiptSubstrate {
  readonly writer: AuthorizedEvidenceWriter;
  readonly registry: EventTypeRegistry;
  readonly producer: EventProducer;
}

export interface AgentImprovementTransitionReceiptContext {
  readonly runId: string;
  readonly substrateReplayFingerprint: string;
  readonly priorReceipts: readonly AgentImprovementTransitionReceipt[];
  readonly commonReceiptIdentities: readonly DeepImprovementCommonReceiptIdentity[];
  readonly ledgerEvents: readonly VerifiedLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly artifactBindings: readonly AgentImprovementSealedArtifactBinding[];
  readonly certificationProfile: CertificationProfile;
  readonly providers: CertificationProviderRegistry;
  readonly receiptSubstrate: AgentImprovementTransitionReceiptSubstrate;
  readonly issuer: string;
  readonly issuedAt: string;
  readonly evaluationEpochId: string;
}

export interface AgentImprovementCertificateIssuerInput<TState extends JsonObject> {
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly projectionEvents: readonly AgentImprovementLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly artifactBindings: readonly AgentImprovementSealedArtifactBinding[];
  readonly transitionReceipts: readonly AgentImprovementTransitionReceiptInput[];
  readonly replay: DeriveReplayFingerprintInput<TState>;
  readonly commonVerification: DeepImprovementCommonOfflineVerificationInput<JsonObject>;
  readonly certificationProfile: CertificationProfile;
  readonly providers: CertificationProviderRegistry;
  readonly receiptSubstrate: AgentImprovementTransitionReceiptSubstrate;
  readonly issuer: string;
  readonly issuedAt: string;
}

export interface AgentImprovementOfflineVerificationInput<TState extends JsonObject> {
  readonly bundle: unknown;
  readonly projectionEvents: readonly AgentImprovementLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly replay: DeriveReplayFingerprintInput<TState>;
  readonly commonVerification: DeepImprovementCommonOfflineVerificationInput<JsonObject>;
  readonly providers: CertificationProviderRegistry;
}

export interface AgentImprovementOfflineVerificationFailure {
  readonly verdict: Exclude<AgentImprovementOfflineVerificationVerdict, 'valid'>;
  readonly code: AgentImprovementCertificateFailureCode;
  readonly evidenceLocation: string;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly failureReason: string;
  readonly evidenceDigest: string;
}

export interface AgentImprovementOfflineVerifierReceipt {
  readonly receiptVersion: 1;
  readonly certificateDigest: string;
  readonly verifierVersion: string;
  readonly rulesetDigest: string;
  readonly replayFingerprint: string;
  readonly evidenceDigests: readonly string[];
  readonly verificationDigest: string;
}

export interface AgentImprovementOfflineVerificationSuccess {
  readonly verdict: 'valid';
  readonly certificateDigest: string;
  readonly replayFingerprint: string;
  readonly projectionIntegrityDigest: string;
  readonly receiptChainDigest: string;
  readonly artifactSetDigest: string;
  readonly verificationReceipt: AgentImprovementOfflineVerifierReceipt;
}

export type AgentImprovementOfflineVerificationResult =
  | AgentImprovementOfflineVerificationFailure
  | AgentImprovementOfflineVerificationSuccess;

export class AgentImprovementCertificateError extends Error {
  public readonly code: AgentImprovementCertificateFailureCode;
  public readonly evidenceLocation: string;
  public readonly expectedDigest: string | null;
  public readonly actualDigest: string | null;

  public constructor(
    code: AgentImprovementCertificateFailureCode,
    evidenceLocation: string,
    failureReason: string,
    expectedDigest: string | null = null,
    actualDigest: string | null = null,
  ) {
    super(failureReason);
    this.name = 'AgentImprovementCertificateError';
    this.code = code;
    this.evidenceLocation = evidenceLocation;
    this.expectedDigest = expectedDigest;
    this.actualDigest = actualDigest;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
