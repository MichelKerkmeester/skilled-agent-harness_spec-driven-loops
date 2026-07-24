// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Sealed Artifact Types
// ───────────────────────────────────────────────────────────────────

import type {
  CertificateValidityDomain,
  SkillBenchmarkPayloadMap,
  SkillBenchmarkSpecificEventStem,
} from '../skill-benchmark-ledger-schema/index.js';
import type {
  DeepImprovementCommonArtifactKind,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import type {
  SealDescriptor,
  SealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';

export const SkillBenchmarkArtifactKinds = Object.freeze({
  BENCHMARK_DESIGN: 'skill-benchmark-benchmark-design',
  SKILL_BUNDLE_SNAPSHOT: 'skill-benchmark-skill-bundle-snapshot',
  SCENARIO_GOLD_MANIFEST: 'skill-benchmark-scenario-gold-manifest',
  RUN_ASSIGNMENT: 'skill-benchmark-run-assignment',
  EXPOSURE_OBSERVATION: 'skill-benchmark-exposure-observation',
  CAUSAL_SCORE_OBSERVATION: 'skill-benchmark-causal-score-observation',
  EFFECT_CERTIFICATE_INPUT: 'skill-benchmark-effect-certificate-input',
} as const);

export type SkillBenchmarkArtifactKind =
  typeof SkillBenchmarkArtifactKinds[keyof typeof SkillBenchmarkArtifactKinds];

export type SkillBenchmarkArtifactLifecycle =
  | 'assignment'
  | 'bundle'
  | 'certificate-input'
  | 'design'
  | 'exposure'
  | 'scenario'
  | 'scoring';

export type SkillBenchmarkArtifactMaterialFamily =
  | 'assignment'
  | 'bundle'
  | 'certificate'
  | 'design'
  | 'exposure'
  | 'gold'
  | 'scoring';

export interface SkillBenchmarkArtifactKindRegistration {
  readonly artifactKind: SkillBenchmarkArtifactKind;
  readonly lifecycle: SkillBenchmarkArtifactLifecycle;
  readonly materialFamily: SkillBenchmarkArtifactMaterialFamily;
  readonly canonicalizationVersion: string;
  readonly mediaType: string;
}

export interface SkillBenchmarkArtifactLocator {
  readonly scheme: 'artifact' | 'file' | 'ledger' | 'url';
  readonly locatorDigest: string;
  readonly selector: string;
  readonly revision: string | null;
}

export interface SkillBenchmarkArtifactEventBinding<
  TStem extends SkillBenchmarkSpecificEventStem = SkillBenchmarkSpecificEventStem,
> {
  readonly eventStem: TStem;
  readonly eventId: string;
  readonly payloadDigest: string;
}

export type SkillBenchmarkEventData<
  TStem extends SkillBenchmarkSpecificEventStem,
> = SkillBenchmarkPayloadMap[TStem];

export interface SkillBenchmarkArtifactDependency {
  readonly purpose: string;
  readonly artifactKind: SkillBenchmarkArtifactKind | DeepImprovementCommonArtifactKind;
  readonly reference: SealedArtifactReference;
}

export interface SkillBenchmarkArtifactMaterialBase<
  TStem extends SkillBenchmarkSpecificEventStem,
> {
  readonly schemaVersion: string;
  readonly artifactId: string;
  readonly dependencyReferences: readonly SkillBenchmarkArtifactDependency[];
  readonly originEvent: SkillBenchmarkArtifactEventBinding<TStem>;
  readonly producerVersion: string;
  readonly locator: SkillBenchmarkArtifactLocator;
}

export type SkillBenchmarkTreatmentArm =
  | 'auto-route'
  | 'compatibility-boundary'
  | 'component-ablation'
  | 'control'
  | 'distractor'
  | 'forced-activation'
  | 'no-skill'
  | 'placebo';

export type SkillBenchmarkResourceClass =
  | 'asset'
  | 'instruction'
  | 'reference'
  | 'script'
  | 'template';

export type SkillBenchmarkGoldPolicy =
  | 'negative'
  | 'pending'
  | 'scored'
  | 'structural-only';

export type SkillBenchmarkGoldIntegrityStatus = 'accepted' | 'blocked' | 'pending';

export interface SkillBenchmarkBenchmarkDesignMaterial
  extends SkillBenchmarkArtifactMaterialBase<'skill_benchmark.run_planned'> {
  readonly randomizationSeed: number;
  readonly replicateCount: number;
  readonly blockingFactorCodes: readonly string[];
  readonly treatmentArms: readonly SkillBenchmarkTreatmentArm[];
  readonly assignmentPolicyVersion: string;
  readonly registryDigest: string;
  readonly workloadDigest: string;
  readonly designCellDigests: readonly string[];
}

export interface SkillBenchmarkSkillBundleSnapshotMaterial
  extends SkillBenchmarkArtifactMaterialBase<'skill_benchmark.skill_discovered'> {
  readonly bundleDigest: string;
  readonly skillTreeDigest: string;
  readonly packageManifestDigest: string;
  readonly resourceManifestDigest: string;
  readonly resourceDigests: readonly string[];
  readonly resourceClasses: readonly SkillBenchmarkResourceClass[];
  readonly permissionDigest: string;
  readonly dependencyCompatibilityDigest: string;
  readonly registryDigest: string;
  readonly visibilityCommitmentDigest: string;
}

export interface SkillBenchmarkScenarioGoldManifestMaterial
  extends SkillBenchmarkArtifactMaterialBase<'skill_benchmark.gold_integrity_recorded'> {
  readonly scenarioId: string;
  readonly taskRecipeDigest: string;
  readonly constraintSetDigest: string;
  readonly deterministicCheckSetDigest: string;
  readonly dynamicReferenceSetDigest: string;
  readonly negativeControlSetDigest: string;
  readonly goldPolicy: SkillBenchmarkGoldPolicy;
  readonly goldProvenanceRef: string;
  readonly goldProvenanceDigest: string;
  readonly expectedCoverageRatio: number;
  readonly mutationSensitivityRef: string;
  readonly mutationSensitivityDigest: string;
  readonly hiddenOracleCommitmentDigest: string;
  readonly integrityStatus: SkillBenchmarkGoldIntegrityStatus;
}

export interface SkillBenchmarkRunAssignmentMaterial
  extends SkillBenchmarkArtifactMaterialBase<'skill_benchmark.treatment_assigned'> {
  readonly designCellId: string;
  readonly treatmentArm: SkillBenchmarkTreatmentArm;
  readonly randomizationSeed: number;
  readonly propensity: number;
  readonly replicateIndex: number;
  readonly pairedReplicateId: string;
  readonly taskRef: string;
  readonly taskDigest: string;
  readonly skillBundleRef: string;
  readonly skillBundleDigest: string;
  readonly executorDescriptorRef: string;
  readonly executorDescriptorDigest: string;
  readonly environmentRef: string;
  readonly environmentDigest: string;
  readonly toolDigest: string;
  readonly permissionDigest: string;
  readonly dependencyDigest: string;
  readonly registryDigest: string;
  readonly workloadDigest: string;
  readonly evaluatorEpochId: string;
  readonly evaluatorCapsuleReference: SealedArtifactReference;
}

export interface SkillBenchmarkExposureObservationMaterial
  extends SkillBenchmarkArtifactMaterialBase<'skill_benchmark.resource_exposed'> {
  readonly assignmentId: string;
  readonly assignmentDigest: string;
  readonly bundleDigest: string;
  readonly evaluatorEpochId: string;
  readonly discoveryEvidenceRef: string;
  readonly discoveryEvidenceDigest: string;
  readonly loadingEvidenceRef: string;
  readonly loadingEvidenceDigest: string;
  readonly invocationEvidenceRef: string;
  readonly invocationEvidenceDigest: string;
  readonly resourceCanaryRef: string;
  readonly resourceCanaryDigest: string;
  readonly canaryStatus: 'clean' | 'not-applicable' | 'triggered';
  readonly keyPointCoverageDigest: string;
  readonly keyPointOrderDigest: string;
  readonly milestoneEvidenceDigest: string;
  readonly finalArtifactRef: string | null;
  readonly finalArtifactDigest: string | null;
  readonly costMicrounits: number;
  readonly latencyMs: number;
  readonly tokenCount: number;
  readonly securityProbeDigest: string;
  readonly visibilityStatus: 'candidate-redacted' | 'downstream' | 'withheld';
  readonly canaryEpochReference: SealedArtifactReference;
}

export interface SkillBenchmarkRawScoreAxis {
  readonly dimensionCode: string;
  readonly rawScore: number;
  readonly measurementRef: string;
  readonly measurementDigest: string;
}

export interface SkillBenchmarkCausalScoreObservationMaterial
  extends SkillBenchmarkArtifactMaterialBase<'skill_benchmark.score_observed'> {
  readonly assignmentId: string;
  readonly assignmentDigest: string;
  readonly outcomeRef: string;
  readonly outcomeDigest: string;
  readonly scenarioGoldManifestReference: SealedArtifactReference;
  readonly evaluatorCapsuleReference: SealedArtifactReference;
  readonly canaryEpochReference: SealedArtifactReference;
  readonly rawOutputRef: string;
  readonly rawOutputDigest: string;
  readonly deterministicResultsRef: string;
  readonly deterministicResultsDigest: string;
  readonly dynamicReferenceResultsRef: string;
  readonly dynamicReferenceResultsDigest: string;
  readonly constraintCoverageRef: string;
  readonly constraintCoverageDigest: string;
  readonly rawScoreAxes: readonly SkillBenchmarkRawScoreAxis[];
  readonly inputTokenCount: number;
  readonly outputTokenCount: number;
  readonly totalTokenCount: number;
  readonly latencyMs: number;
  readonly costMicrounits: number;
  readonly compatibilityStatus: 'compatible' | 'incompatible' | 'unknown';
  readonly negativeTransferEvidenceDigest: string | null;
  readonly securityProbeEvidenceDigest: string | null;
  readonly goldPolicy: SkillBenchmarkGoldPolicy;
  readonly goldIntegrityStatus: SkillBenchmarkGoldIntegrityStatus;
  readonly numeratorEligible: boolean;
  readonly evaluatorEpochId: string;
}

export type SkillBenchmarkCertificateValidityDomain = Pick<
  CertificateValidityDomain,
  | 'taskSetDigest'
  | 'skillBundleDigest'
  | 'registryDigest'
  | 'executorDigest'
  | 'environmentDigest'
  | 'dependencyDigest'
  | 'workloadDigest'
  | 'validityPolicyVersion'
>;

export interface SkillBenchmarkEffectCertificateInputMaterial
  extends SkillBenchmarkArtifactMaterialBase<'skill_benchmark.effect_certificate_issued'> {
  readonly evidenceSetDigest: string;
  readonly pairedDeltaDigests: readonly string[];
  readonly confidenceIntervalRef: string;
  readonly confidenceIntervalDigest: string;
  readonly componentAblationDigests: readonly string[];
  readonly compatibilitySliceDigests: readonly string[];
  readonly negativeTransferDigests: readonly string[];
  readonly costSecurityDeltaDigest: string;
  readonly validityDomain: SkillBenchmarkCertificateValidityDomain;
  readonly expiryTriggers: readonly (
    | 'bundle-drift'
    | 'dependency-drift'
    | 'environment-drift'
    | 'evaluator-drift'
    | 'registry-drift'
    | 'time-limit'
    | 'workload-drift'
  )[];
  readonly withheldEvidenceDigests: readonly string[];
  readonly evaluatorEpochId: string;
  readonly evaluatorCapsuleReference: SealedArtifactReference;
  readonly canaryEpochReference: SealedArtifactReference;
  readonly promotionEvidenceReference: SealedArtifactReference;
}

export interface SkillBenchmarkArtifactMaterialByKind {
  readonly 'skill-benchmark-benchmark-design': SkillBenchmarkBenchmarkDesignMaterial;
  readonly 'skill-benchmark-skill-bundle-snapshot': SkillBenchmarkSkillBundleSnapshotMaterial;
  readonly 'skill-benchmark-scenario-gold-manifest': SkillBenchmarkScenarioGoldManifestMaterial;
  readonly 'skill-benchmark-run-assignment': SkillBenchmarkRunAssignmentMaterial;
  readonly 'skill-benchmark-exposure-observation': SkillBenchmarkExposureObservationMaterial;
  readonly 'skill-benchmark-causal-score-observation': SkillBenchmarkCausalScoreObservationMaterial;
  readonly 'skill-benchmark-effect-certificate-input': SkillBenchmarkEffectCertificateInputMaterial;
}

export type SkillBenchmarkArtifactMaterial =
  SkillBenchmarkArtifactMaterialByKind[SkillBenchmarkArtifactKind];

export type SkillBenchmarkArtifactEventReference = string;

export interface SkillBenchmarkSealedArtifactBinding<
  TKind extends SkillBenchmarkArtifactKind = SkillBenchmarkArtifactKind,
> {
  readonly bindingVersion: 1;
  readonly artifactKind: TKind;
  readonly eventReference: SkillBenchmarkArtifactEventReference;
  readonly reference: SealedArtifactReference;
}

export interface SkillBenchmarkVerifiedSealedArtifact<
  TKind extends SkillBenchmarkArtifactKind = SkillBenchmarkArtifactKind,
> {
  readonly binding: SkillBenchmarkSealedArtifactBinding<TKind>;
  readonly descriptor: SealDescriptor;
  readonly bytes: readonly number[];
}
