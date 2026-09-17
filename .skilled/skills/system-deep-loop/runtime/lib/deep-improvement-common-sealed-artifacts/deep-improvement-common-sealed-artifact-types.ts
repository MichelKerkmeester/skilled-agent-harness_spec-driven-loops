// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Sealed Artifact Types
// ───────────────────────────────────────────────────────────────────

import type {
  CanaryEpochId,
  CanarySuiteSealedData,
  CandidateGeneratedData,
  CandidateId,
  CandidateProposedData,
  Digest,
  EvaluationEpochId,
  EvaluationEpochSealedData,
  EvaluationObservationRecordedData,
  DeepImprovementCommonEventStem,
  LineageId,
  PromotionId,
  PromotionProposedData,
} from '../deep-improvement-common-ledger-schema/index.js';
import type {
  SealDescriptor,
  SealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';

export const DeepImprovementCommonArtifactKinds = Object.freeze({
  EVALUATOR_CAPSULE: 'deep-improvement-common-evaluator-capsule',
  CANDIDATE_INPUT: 'deep-improvement-common-candidate-input',
  BASELINE_INPUT: 'deep-improvement-common-baseline-input',
  RAW_TRIAL_OUTPUT: 'deep-improvement-common-raw-trial-output',
  CANARY_EPOCH: 'deep-improvement-common-canary-epoch',
  PROMOTION_EVIDENCE: 'deep-improvement-common-promotion-evidence',
} as const);

export type DeepImprovementCommonArtifactKind =
  typeof DeepImprovementCommonArtifactKinds[
    keyof typeof DeepImprovementCommonArtifactKinds
  ];

export type DeepImprovementCommonArtifactLifecycle =
  | 'canary'
  | 'evaluation'
  | 'promotion'
  | 'trial';

export type DeepImprovementCommonArtifactMaterialFamily =
  | 'baseline'
  | 'canary'
  | 'candidate'
  | 'evaluator'
  | 'promotion'
  | 'trial';

export interface DeepImprovementCommonArtifactKindRegistration {
  readonly artifactKind: DeepImprovementCommonArtifactKind;
  readonly lifecycle: DeepImprovementCommonArtifactLifecycle;
  readonly materialFamily: DeepImprovementCommonArtifactMaterialFamily;
  readonly canonicalizationVersion: string;
  readonly mediaType: string;
}

export interface DeepImprovementCommonArtifactLocator {
  readonly scheme: 'artifact' | 'file' | 'ledger' | 'url';
  readonly locatorDigest: Digest;
  readonly selector: string;
  readonly revision: string | null;
}

export interface DeepImprovementCommonArtifactEventBinding {
  readonly eventStem: DeepImprovementCommonEventStem;
  readonly eventId: string;
  readonly payloadDigest: Digest;
}

export interface DeepImprovementCommonArtifactDependency {
  readonly purpose: string;
  readonly reference: SealedArtifactReference;
}

export interface DeepImprovementCommonArtifactBaseMaterial {
  readonly schemaVersion: string;
  readonly artifactId: string;
  readonly dependencyReferences: readonly DeepImprovementCommonArtifactDependency[];
  readonly originEvent: DeepImprovementCommonArtifactEventBinding;
  readonly producerVersion: string;
  readonly locator: DeepImprovementCommonArtifactLocator;
}

export interface DeepImprovementBudgetPolicy {
  readonly maxQueries: number;
  readonly maxBytes: number;
  readonly maxWallClockMs: number;
  readonly maxCostMicros: number;
}

export interface DeepImprovementVisibilityPolicy {
  readonly candidateView: 'commitment-only' | 'verdict-band';
  readonly hiddenFixtures: 'withheld';
  readonly exactScores: 'withheld';
  readonly evaluatorInternals: 'withheld';
  readonly terminalEvidence: 'withheld';
}

export interface DeepImprovementEvaluatorCapsuleMaterial
  extends DeepImprovementCommonArtifactBaseMaterial {
  readonly evaluatorEpochId: EvaluationEpochId;
  readonly evaluatorImplementationDigest: EvaluationEpochSealedData['evaluatorCapsuleDigest'];
  readonly evaluatorSchemaDigest: Digest;
  readonly rubricDigest: Digest;
  readonly policyDigest: Digest;
  readonly fixtureManifestDigest: EvaluationEpochSealedData['fixtureSetDigest'];
  readonly hiddenAnchorCommitmentDigest: Digest;
  readonly calibrationDigest: Digest;
  readonly normalizationDigest: Digest;
  readonly environmentDigest: Digest;
  readonly capabilityDigest: Digest;
  readonly visibilityPolicy: DeepImprovementVisibilityPolicy;
  readonly budgetPolicy: DeepImprovementBudgetPolicy;
}

export interface DeepImprovementCandidateInputMaterial
  extends DeepImprovementCommonArtifactBaseMaterial {
  readonly candidateId: CandidateId;
  readonly lineageId: LineageId;
  readonly evaluatorEpochId: EvaluationEpochId;
  readonly parentCandidateReference: SealedArtifactReference | null;
  readonly mutationOperatorReference: CandidateProposedData['mutationOperatorRef'];
  readonly mutationOperatorVersion: CandidateProposedData['mutationOperatorVersion'];
  readonly profileScopeDigest: Digest;
  readonly modelConfigurationDigest: Digest;
  readonly promptConfigurationDigest: Digest;
  readonly toolConfigurationDigest: Digest;
  readonly selectedFixtureManifestDigest: Digest;
  readonly seed: number;
  readonly sourceArtifactReferences: readonly SealedArtifactReference[];
}

export interface DeepImprovementBaselineInputMaterial
  extends DeepImprovementCommonArtifactBaseMaterial {
  readonly baselineId: string;
  readonly lineageId: LineageId;
  readonly evaluatorEpochId: EvaluationEpochId;
  readonly incumbentReference: SealedArtifactReference;
  readonly profileScopeDigest: Digest;
  readonly modelConfigurationDigest: Digest;
  readonly promptConfigurationDigest: Digest;
  readonly toolConfigurationDigest: Digest;
  readonly selectedFixtureManifestDigest: Digest;
  readonly seed: number;
  readonly sourceArtifactReferences: readonly SealedArtifactReference[];
}

export interface DeepImprovementScoreComponent {
  readonly dimensionCode: string;
  readonly rawScore: number;
  readonly normalizedScore: number;
  readonly weight: number;
}

export interface DeepImprovementScoreVector {
  readonly components: readonly DeepImprovementScoreComponent[];
  readonly aggregateScore: number;
  readonly uncertainty: number;
}

export interface DeepImprovementRawTrialCaseObservation {
  readonly caseId: string;
  readonly outputDigest: Digest;
  readonly outputReference: SealedArtifactReference;
  readonly scoreVectorDigest: Digest;
}

export interface DeepImprovementUsageObservation {
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly totalTokens: number;
  readonly costMicros: number;
  readonly latencyMs: number;
}

export interface DeepImprovementIntegrityObservation {
  readonly status: 'confirmed' | 'disputed' | 'inconclusive';
  readonly detectorDigest: Digest;
  readonly evidenceDigest: Digest;
}

export interface DeepImprovementRawTrialOutputMaterial
  extends DeepImprovementCommonArtifactBaseMaterial {
  readonly trialId: string;
  readonly candidateInputReference: SealedArtifactReference;
  readonly baselineInputReference: SealedArtifactReference;
  readonly evaluatorCapsuleReference: SealedArtifactReference;
  readonly evaluationEpochId: EvaluationEpochId;
  readonly fixtureId: EvaluationObservationRecordedData['fixtureRef'];
  readonly caseObservations: readonly DeepImprovementRawTrialCaseObservation[];
  readonly rawScoreVector: DeepImprovementScoreVector;
  readonly traceReferences: readonly SealedArtifactReference[];
  readonly usage: DeepImprovementUsageObservation;
  readonly executionEnvironmentDigest: Digest;
  readonly integrityObservations: readonly DeepImprovementIntegrityObservation[];
  readonly normalizationVersion: string;
}

export interface DeepImprovementLeakagePolicy {
  readonly literalLeakDetection: 'required';
  readonly semanticLeakDetection: 'required';
  readonly candidateVisibleContent: 'withheld';
}

export type DeepImprovementCanaryLifecycle = 'active' | 'burned' | 'retired' | 'sealed';

export interface DeepImprovementCanaryEpochMaterial
  extends DeepImprovementCommonArtifactBaseMaterial {
  readonly canaryEpochId: CanaryEpochId;
  readonly evaluatorEpochId: EvaluationEpochId;
  readonly suiteId: string;
  readonly lifecycle: DeepImprovementCanaryLifecycle;
  readonly suiteManifestDigest: CanarySuiteSealedData['suiteDigest'];
  readonly hiddenAnchorCommitmentDigest: CanarySuiteSealedData['protectedMaterialDigest'];
  readonly adversarialSuiteDigest: Digest;
  readonly metamorphicSuiteDigest: Digest;
  readonly crossDomainSuiteDigest: Digest;
  readonly leakagePolicy: DeepImprovementLeakagePolicy;
  readonly freshnessWindowSeconds: number;
  readonly sealedAt: string;
  readonly expiresAt: string;
  readonly supersedesReference: SealedArtifactReference | null;
}

export type DeepImprovementPromotionResult = 'fail' | 'inconclusive' | 'pass';

export interface DeepImprovementPromotionEvidenceMaterial
  extends DeepImprovementCommonArtifactBaseMaterial {
  readonly promotionId: PromotionId;
  readonly evaluatorEpochId: EvaluationEpochId;
  readonly candidateInputReference: SealedArtifactReference;
  readonly baselineInputReference: SealedArtifactReference;
  readonly evaluatorCapsuleReference: SealedArtifactReference;
  readonly canaryEpochReference: SealedArtifactReference;
  readonly targetRepairEvidenceReference: SealedArtifactReference;
  readonly baselinePreservationEvidenceReference: SealedArtifactReference;
  readonly criticalDimensionEvidenceReference: SealedArtifactReference;
  readonly evaluatorIntegrityEvidenceReference: SealedArtifactReference;
  readonly canaryOutcomeEvidenceReference: SealedArtifactReference;
  readonly uncertaintyEvidenceReference: SealedArtifactReference;
  readonly costEvidenceReference: SealedArtifactReference;
  readonly rollbackTargetReference: SealedArtifactReference;
  readonly targetRepair: DeepImprovementPromotionResult;
  readonly baselinePreservation: DeepImprovementPromotionResult;
  readonly criticalDimensions: DeepImprovementPromotionResult;
  readonly evaluatorIntegrity: DeepImprovementPromotionResult;
  readonly canaryOutcome: DeepImprovementPromotionResult;
  readonly uncertaintyLowerBound: number;
  readonly uncertaintyThreshold: number;
  readonly costMicros: number;
  readonly costLimitMicros: number;
  readonly unresolvedEvidenceDigests: readonly Digest[];
  readonly vetoEvidenceDigests: readonly Digest[];
  readonly admissibility: 'eligible' | 'ineligible';
}

export interface DeepImprovementCommonArtifactMaterialByKind {
  readonly 'deep-improvement-common-evaluator-capsule': DeepImprovementEvaluatorCapsuleMaterial;
  readonly 'deep-improvement-common-candidate-input': DeepImprovementCandidateInputMaterial;
  readonly 'deep-improvement-common-baseline-input': DeepImprovementBaselineInputMaterial;
  readonly 'deep-improvement-common-raw-trial-output': DeepImprovementRawTrialOutputMaterial;
  readonly 'deep-improvement-common-canary-epoch': DeepImprovementCanaryEpochMaterial;
  readonly 'deep-improvement-common-promotion-evidence': DeepImprovementPromotionEvidenceMaterial;
}

export type DeepImprovementCommonArtifactMaterial =
  DeepImprovementCommonArtifactMaterialByKind[DeepImprovementCommonArtifactKind];

export interface DeepImprovementCommonSealedArtifactBinding<
  TKind extends DeepImprovementCommonArtifactKind = DeepImprovementCommonArtifactKind,
> {
  readonly bindingVersion: 1;
  readonly artifactKind: TKind;
  readonly eventReference: string;
  readonly reference: SealedArtifactReference;
}

export interface DeepImprovementVerifiedSealedArtifact<
  TKind extends DeepImprovementCommonArtifactKind = DeepImprovementCommonArtifactKind,
> {
  readonly binding: DeepImprovementCommonSealedArtifactBinding<TKind>;
  readonly descriptor: SealDescriptor;
  readonly bytes: readonly number[];
  readonly material: DeepImprovementCommonArtifactMaterialByKind[TKind];
}

export type DeepImprovementArtifactConsumer =
  | 'agent-improvement'
  | 'deep-improvement-common'
  | 'downstream'
  | 'model-benchmark'
  | 'skill-benchmark';

export type DeepImprovementArtifactAccessRole =
  | 'canary'
  | 'candidate'
  | 'evaluator'
  | 'promotion'
  | 'downstream';

export interface DeepImprovementArtifactReadPolicy {
  readonly consumer?: DeepImprovementArtifactConsumer;
  readonly accessRole?: DeepImprovementArtifactAccessRole;
  readonly requiredEvaluationEpochId?: EvaluationEpochId;
  readonly requiredCanaryEpochId?: CanaryEpochId;
  readonly requireFreshCanary?: boolean;
  readonly now?: Date | (() => Date);
}

export const DeepImprovementArtifactReadFailureCodes = Object.freeze({
  ACCESS_DENIED: 'ACCESS_DENIED',
  DEPENDENCY_MISMATCH: 'DEPENDENCY_MISMATCH',
  EPOCH_MISMATCH: 'EPOCH_MISMATCH',
  LEAK_DETECTED: 'LEAK_DETECTED',
  PROMOTION_INELIGIBLE: 'PROMOTION_INELIGIBLE',
  STALE_CANARY: 'STALE_CANARY',
} as const);

export type DeepImprovementArtifactReadFailureCode =
  typeof DeepImprovementArtifactReadFailureCodes[
    keyof typeof DeepImprovementArtifactReadFailureCodes
  ];

export class DeepImprovementArtifactReadError extends Error {
  public readonly code: DeepImprovementArtifactReadFailureCode;
  public readonly details: Readonly<Record<string, string | number | boolean | null>>;

  public constructor(
    code: DeepImprovementArtifactReadFailureCode,
    message: string,
    details: Readonly<Record<string, string | number | boolean | null>> = {},
  ) {
    super(message);
    this.name = 'DeepImprovementArtifactReadError';
    this.code = code;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface DeepImprovementCandidateFacingView {
  readonly viewVersion: 1;
  readonly artifactKind: typeof DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE;
  readonly evaluatorEpochId: EvaluationEpochId;
  readonly evaluatorCommitmentDigest: Digest;
  readonly fixtureManifestCommitmentDigest: Digest;
  readonly hiddenAnchorCommitmentDigest: Digest;
  readonly calibrationCommitmentDigest: Digest;
  readonly normalizationCommitmentDigest: Digest;
  readonly visibilityPolicy: Pick<
    DeepImprovementVisibilityPolicy,
    'candidateView' | 'hiddenFixtures' | 'exactScores' | 'evaluatorInternals'
  >;
  readonly budgetPolicy: Pick<DeepImprovementBudgetPolicy, 'maxQueries' | 'maxBytes'>;
}

export type DeepImprovementEvaluatorCapsuleEventData = EvaluationEpochSealedData;
export type DeepImprovementCandidateEventData = CandidateGeneratedData | CandidateProposedData;
export type DeepImprovementObservationEventData = EvaluationObservationRecordedData;
export type DeepImprovementPromotionEventData = PromotionProposedData;

export interface DeepImprovementCommonSealedArtifactContract {
  readonly owner: 'deep-improvement-common';
  readonly consumers: readonly [
    'deep-improvement-common',
    'agent-improvement',
    'model-benchmark',
    'skill-benchmark',
  ];
  readonly artifactKinds: readonly DeepImprovementCommonArtifactKind[];
  readonly canonicalizationVersion: string;
  readonly mediaType: string;
  readonly bindingVersion: 1;
}
