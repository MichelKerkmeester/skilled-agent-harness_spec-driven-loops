// MODULE: Skill Benchmark Certificate Types

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonCertificateBundle,
  DeepImprovementCommonOfflineVerificationInput,
  DeepImprovementCommonReceiptIdentity,
} from '../deep-improvement-common-certificates/index.js';
import type { SkillBenchmarkLedgerEvent } from '../skill-benchmark-ledger-schema/index.js';
import type {
  SkillBenchmarkArtifactKind,
  SkillBenchmarkSealedArtifactBinding,
} from '../skill-benchmark-sealed-artifacts/index.js';
import type {
  BoundaryReceiptPayload,
  CertificationProfile,
  CertificationProviderRegistry,
} from '../receipts-and-effect-recovery/index.js';
import type { AuthorizedEvidenceWriter } from '../receipts-and-effect-recovery/index.js';
import type { DeriveReplayFingerprintInput } from '../replay-fingerprint/index.js';
import type { SealedArtifactStore } from '../sealed-reference-artifacts/index.js';
import type { EventProducer, EventTypeRegistry, JsonObject } from '../event-envelope/index.js';

export const SkillBenchmarkTransitionKinds = Object.freeze({
  DESIGN_PLANNED: 'design_planned',
  TREATMENT_ASSIGNED: 'treatment_assigned',
  SCENARIO_STARTED: 'scenario_started',
  SCENARIO_FINISHED: 'scenario_finished',
  SCENARIO_ABORTED: 'scenario_aborted',
  SKILL_DISCOVERED: 'skill_discovered',
  SKILL_LOADED: 'skill_loaded',
  SKILL_INVOKED: 'skill_invoked',
  RESOURCE_EXPOSED: 'resource_exposed',
  MILESTONE_OBSERVED: 'milestone_observed',
  TRAJECTORY_RECORDED: 'trajectory_recorded',
  OUTCOME_RECORDED: 'outcome_recorded',
  GOLD_INTEGRITY_RECORDED: 'gold_integrity_recorded',
  SCORE_OBSERVED: 'score_observed',
  COMPATIBILITY_OBSERVED: 'compatibility_observed',
  NEGATIVE_TRANSFER_OBSERVED: 'negative_transfer_observed',
  SECURITY_PROBE_RECORDED: 'security_probe_recorded',
  RUN_CLOSED: 'run_closed',
  CERTIFICATE_ISSUED: 'certificate_issued',
  CERTIFICATE_WITHHELD: 'certificate_withheld',
  CERTIFICATE_EXPIRED: 'certificate_expired',
  ABORTED: 'aborted',
  RESTORED: 'restored',
} as const);

export type SkillBenchmarkTransitionKind =
  typeof SkillBenchmarkTransitionKinds[keyof typeof SkillBenchmarkTransitionKinds];

export type SkillBenchmarkTransitionOutcome =
  | 'completed'
  | 'recovered'
  | 'uncertain'
  | 'vetoed';

export type SkillBenchmarkCertificateDisposition =
  | 'ABORT'
  | 'FAIL'
  | 'INSUFFICIENT_EVIDENCE'
  | 'PASS';

export type SkillBenchmarkOfflineVerificationVerdict =
  | 'valid'
  | 'invalid'
  | 'incomplete'
  | 'unverifiable'
  | 'unsupported';

export const SkillBenchmarkCertificateFailureCodes = Object.freeze({
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
  UNSUPPORTED_VERSION: 'UNSUPPORTED_VERSION',
  VISIBILITY_INVALID: 'VISIBILITY_INVALID',
} as const);

export type SkillBenchmarkCertificateFailureCode =
  typeof SkillBenchmarkCertificateFailureCodes[
    keyof typeof SkillBenchmarkCertificateFailureCodes
  ];

export interface SkillBenchmarkReceiptIdentity {
  readonly identityVersion: 1;
  readonly runId: string;
  readonly transitionKind: SkillBenchmarkTransitionKind;
  readonly logicalOperationId: string;
  readonly effectIdempotencyKey: string;
  readonly digest: string;
}

export interface SkillBenchmarkTransitionReceiptInput {
  readonly transitionKind: SkillBenchmarkTransitionKind;
  readonly logicalOperationId: string;
  readonly effectIdempotencyKey: string;
  readonly attemptNumber: number;
  readonly resultEventId: string;
  readonly inputArtifactQualifiedDigests: readonly string[];
  readonly outputArtifactQualifiedDigests: readonly string[];
  readonly evidenceArtifactQualifiedDigests: readonly string[];
}

export interface SkillBenchmarkTransitionReceiptFacts {
  readonly receiptVersion: 1;
  readonly identity: SkillBenchmarkReceiptIdentity;
  readonly predecessorReceiptDigests: readonly string[];
  readonly commonReceiptIdentities: readonly DeepImprovementCommonReceiptIdentity[];
  readonly runId: string;
  readonly transitionKind: SkillBenchmarkTransitionKind;
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
  readonly outcome: SkillBenchmarkTransitionOutcome;
  readonly substrateReplayFingerprint: string;
  readonly transitionFingerprint: string;
  readonly authorityEpoch: number;
}

export interface SkillBenchmarkTransitionReceipt {
  readonly facts: SkillBenchmarkTransitionReceiptFacts;
  readonly receiptDigest: string;
  readonly sharedReceipt: BoundaryReceiptPayload;
}

export type SkillBenchmarkCertificateArtifactRole =
  | 'benchmark-design'
  | 'causal-score-observation'
  | 'effect-certificate-input'
  | 'exposure-observation'
  | 'run-assignment'
  | 'scenario-gold-manifest'
  | 'skill-bundle-snapshot';

export interface SkillBenchmarkNamedDigestClosureRule {
  readonly containingArtifactKind: SkillBenchmarkArtifactKind;
  readonly referenceField: 'assignmentId' | 'skillBundleRef';
  readonly digestField: 'assignmentDigest' | 'skillBundleDigest';
  readonly expectedArtifactKind: SkillBenchmarkArtifactKind;
}

export interface SkillBenchmarkCertificateArtifactClaim {
  readonly role: SkillBenchmarkCertificateArtifactRole;
  readonly expectedArtifactKind: SkillBenchmarkArtifactKind;
  readonly binding: SkillBenchmarkSealedArtifactBinding;
  readonly descriptorDigest: string;
  readonly contentDigest: string;
  readonly canonicalizationVersion: string;
}

export interface SkillBenchmarkRunCertificateBody {
  readonly certificateVersion: 1;
  readonly authority: 'dark-evidence-only';
  readonly mode: 'skill-benchmark';
  readonly certificateSchema: 'skill-effect-certificate.v1';
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly evaluatorEpochId: string;
  readonly canaryEpochId: string;
  readonly benchmarkDesignId: string;
  readonly designDigest: string;
  readonly taskSetDigest: string;
  readonly skillBundleDigest: string;
  readonly registryDigest: string;
  readonly executorDigest: string;
  readonly environmentDigest: string;
  readonly dependencyDigest: string;
  readonly workloadDigest: string;
  readonly disposition: SkillBenchmarkCertificateDisposition;
  readonly modeState: 'issued';
  readonly certificateState: 'issued';
  readonly requiredScenarioCount: number;
  readonly assignedScenarioCount: number;
  readonly acceptedGoldScenarioCount: number;
  readonly collectionComplete: true;
  readonly scoringComplete: true;
  readonly certificateReady: true;
  readonly treatmentArms: readonly string[];
  readonly blockingVetoCodes: readonly string[];
  readonly blockerCodes: readonly string[];
  readonly evidenceSetDigest: string;
  readonly validityDomainDigest: string;
  readonly expiryTriggers: readonly string[];
  readonly artifactClaims: readonly SkillBenchmarkCertificateArtifactClaim[];
  readonly artifactSetDigest: string;
  readonly namedDigestClosureRules: readonly SkillBenchmarkNamedDigestClosureRule[];
  readonly orderedDependencyClosure: readonly string[];
  readonly benchmarkDesignQualifiedDigest: string;
  readonly skillBundleQualifiedDigest: string;
  readonly goldManifestQualifiedDigests: readonly string[];
  readonly runAssignmentQualifiedDigests: readonly string[];
  readonly exposureObservationQualifiedDigests: readonly string[];
  readonly causalScoreObservationQualifiedDigests: readonly string[];
  readonly certificateInputQualifiedDigest: string;
  readonly commonCertificateDigest: string;
  readonly commonReceiptIdentities: readonly DeepImprovementCommonReceiptIdentity[];
  readonly receiptIdentities: readonly SkillBenchmarkReceiptIdentity[];
  readonly receiptDigests: readonly string[];
  readonly receiptChainDigest: string;
  readonly substrateReplayFingerprint: string;
  readonly replayFingerprint: string;
  readonly replayFingerprintVersion: number;
  readonly projectionIntegrityDigest: string;
  readonly startHeadHash: string;
  readonly finalHeadHash: string;
}

export interface SkillBenchmarkRunCertificate {
  readonly body: SkillBenchmarkRunCertificateBody;
  readonly certificateDigest: string;
  readonly sharedCertificationReceipt: BoundaryReceiptPayload;
}

export interface SkillBenchmarkCertificateBundle {
  readonly bundleVersion: 1;
  readonly certificate: SkillBenchmarkRunCertificate;
  readonly receipts: readonly SkillBenchmarkTransitionReceipt[];
  readonly commonBundle: DeepImprovementCommonCertificateBundle;
}

export interface SkillBenchmarkTransitionReceiptSubstrate {
  readonly writer: AuthorizedEvidenceWriter;
  readonly registry: EventTypeRegistry;
  readonly producer: EventProducer;
}

export interface SkillBenchmarkTransitionReceiptContext {
  readonly runId: string;
  readonly substrateReplayFingerprint: string;
  readonly priorReceipts: readonly SkillBenchmarkTransitionReceipt[];
  readonly commonReceiptIdentities: readonly DeepImprovementCommonReceiptIdentity[];
  readonly ledgerEvents: readonly VerifiedLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly artifactBindings: readonly SkillBenchmarkSealedArtifactBinding[];
  readonly certificationProfile: CertificationProfile;
  readonly providers: CertificationProviderRegistry;
  readonly receiptSubstrate: SkillBenchmarkTransitionReceiptSubstrate;
  readonly issuer: string;
  readonly issuedAt: string;
  readonly evaluatorEpochId: string;
  readonly canaryEpochId: string;
  readonly verificationTime: string;
}

export interface SkillBenchmarkCertificateIssuerInput<TState extends JsonObject> {
  readonly runId: string;
  readonly lineageId: string;
  readonly generation: number;
  readonly projectionEvents: readonly SkillBenchmarkLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly artifactBindings: readonly SkillBenchmarkSealedArtifactBinding[];
  readonly transitionReceipts: readonly SkillBenchmarkTransitionReceiptInput[];
  readonly replay: DeriveReplayFingerprintInput<TState>;
  readonly commonVerification: DeepImprovementCommonOfflineVerificationInput<JsonObject>;
  readonly certificationProfile: CertificationProfile;
  readonly providers: CertificationProviderRegistry;
  readonly receiptSubstrate: SkillBenchmarkTransitionReceiptSubstrate;
  readonly issuer: string;
  readonly issuedAt: string;
  readonly verificationTime: string;
}

export interface SkillBenchmarkOfflineVerificationInput<TState extends JsonObject> {
  readonly bundle: unknown;
  readonly projectionEvents: readonly SkillBenchmarkLedgerEvent[];
  readonly artifactStore: SealedArtifactStore;
  readonly replay: DeriveReplayFingerprintInput<TState>;
  readonly commonVerification: DeepImprovementCommonOfflineVerificationInput<JsonObject>;
  readonly providers: CertificationProviderRegistry;
  readonly verificationTime: string;
}

export interface SkillBenchmarkOfflineVerificationFailure {
  readonly verdict: Exclude<SkillBenchmarkOfflineVerificationVerdict, 'valid'>;
  readonly code: SkillBenchmarkCertificateFailureCode;
  readonly evidenceLocation: string;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly failureReason: string;
  readonly evidenceDigest: string;
}

export interface SkillBenchmarkOfflineVerifierReceipt {
  readonly receiptVersion: 1;
  readonly certificateDigest: string;
  readonly verifierVersion: string;
  readonly rulesetDigest: string;
  readonly replayFingerprint: string;
  readonly evidenceDigests: readonly string[];
  readonly verificationDigest: string;
}

export interface SkillBenchmarkOfflineVerificationSuccess {
  readonly verdict: 'valid';
  readonly certificateDigest: string;
  readonly replayFingerprint: string;
  readonly projectionIntegrityDigest: string;
  readonly receiptChainDigest: string;
  readonly artifactSetDigest: string;
  readonly verificationReceipt: SkillBenchmarkOfflineVerifierReceipt;
}

export type SkillBenchmarkOfflineVerificationResult =
  | SkillBenchmarkOfflineVerificationFailure
  | SkillBenchmarkOfflineVerificationSuccess;

export class SkillBenchmarkCertificateError extends Error {
  public readonly code: SkillBenchmarkCertificateFailureCode;
  public readonly evidenceLocation: string;
  public readonly expectedDigest: string | null;
  public readonly actualDigest: string | null;

  public constructor(
    code: SkillBenchmarkCertificateFailureCode,
    evidenceLocation: string,
    failureReason: string,
    expectedDigest: string | null = null,
    actualDigest: string | null = null,
  ) {
    super(failureReason);
    this.name = 'SkillBenchmarkCertificateError';
    this.code = code;
    this.evidenceLocation = evidenceLocation;
    this.expectedDigest = expectedDigest;
    this.actualDigest = actualDigest;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
