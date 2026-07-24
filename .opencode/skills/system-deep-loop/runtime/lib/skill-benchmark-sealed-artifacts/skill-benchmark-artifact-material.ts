// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Artifact Material
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes } from '../event-envelope/index.js';
import {
  isSkillBenchmarkSpecificEventStem,
} from '../skill-benchmark-ledger-schema/index.js';
import {
  ArtifactCanonicalizerRegistry,
  SealedArtifactError,
  SealedArtifactErrorCodes,
  parseSealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_ARTIFACT_CANONICALIZATION_VERSION,
  DEEP_IMPROVEMENT_COMMON_ARTIFACT_MEDIA_TYPE,
  DEEP_IMPROVEMENT_COMMON_SEALED_ARTIFACT_CONTRACT,
  DeepImprovementCommonArtifactKinds,
  createDeepImprovementCommonArtifactCanonicalizerRegistry,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import {
  SkillBenchmarkArtifactKinds,
} from './skill-benchmark-sealed-artifact-types.js';

import type {
  ArtifactCanonicalizerDefinition,
  SealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import type {
  SkillBenchmarkArtifactDependency,
  SkillBenchmarkArtifactEventBinding,
  SkillBenchmarkArtifactKind,
  SkillBenchmarkArtifactKindRegistration,
  SkillBenchmarkArtifactLocator,
  SkillBenchmarkArtifactMaterialBase,
  SkillBenchmarkArtifactMaterialByKind,
  SkillBenchmarkBenchmarkDesignMaterial,
  SkillBenchmarkCausalScoreObservationMaterial,
  SkillBenchmarkCertificateValidityDomain,
  SkillBenchmarkEffectCertificateInputMaterial,
  SkillBenchmarkExposureObservationMaterial,
  SkillBenchmarkRawScoreAxis,
  SkillBenchmarkResourceClass,
  SkillBenchmarkRunAssignmentMaterial,
  SkillBenchmarkScenarioGoldManifestMaterial,
  SkillBenchmarkSkillBundleSnapshotMaterial,
  SkillBenchmarkTreatmentArm,
} from './skill-benchmark-sealed-artifact-types.js';
import type {
  SkillBenchmarkSpecificEventStem,
} from '../skill-benchmark-ledger-schema/index.js';

export const SKILL_BENCHMARK_ARTIFACT_SCHEMA_VERSION =
  'skill-benchmark-artifact@1';
export const SKILL_BENCHMARK_ARTIFACT_CANONICALIZATION_VERSION =
  'skill-benchmark-binding@1';
export const SKILL_BENCHMARK_ARTIFACT_MEDIA_TYPE =
  'application/vnd.openai.skill-benchmark-binding+json';

const REGISTRY_ROWS = [
  [SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN, 'design', 'design'],
  [SkillBenchmarkArtifactKinds.SKILL_BUNDLE_SNAPSHOT, 'bundle', 'bundle'],
  [SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST, 'scenario', 'gold'],
  [SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT, 'assignment', 'assignment'],
  [SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION, 'exposure', 'exposure'],
  [SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION, 'scoring', 'scoring'],
  [SkillBenchmarkArtifactKinds.EFFECT_CERTIFICATE_INPUT, 'certificate-input', 'certificate'],
] as const;

export const SKILL_BENCHMARK_ARTIFACT_KIND_REGISTRY:
  readonly SkillBenchmarkArtifactKindRegistration[] = Object.freeze(
    REGISTRY_ROWS.map(([artifactKind, lifecycle, materialFamily]) => Object.freeze({
      artifactKind,
      lifecycle,
      materialFamily,
      canonicalizationVersion: SKILL_BENCHMARK_ARTIFACT_CANONICALIZATION_VERSION,
      mediaType: SKILL_BENCHMARK_ARTIFACT_MEDIA_TYPE,
    })),
  );

const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;
const CODE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._/@-]{0,127}$/;
const SELECTOR_PATTERN = /^(?:#[A-Za-z0-9_-]+|[A-Za-z][A-Za-z0-9_-]*(?::[A-Za-z0-9._/#:@?=&%+\-]+)?|\/[A-Za-z0-9._~:/?#\[\]@!$&'()*+,;=%+\-]+)$/u;
const MAX_ARRAY_ENTRIES = 256;
const MAX_DEPENDENCIES = 128;
const MAX_SELECTOR_SPACES = 16;
const MAX_UINT32 = 0xffffffff;

const BASE_FIELDS = [
  'schemaVersion',
  'artifactId',
  'dependencyReferences',
  'originEvent',
  'producerVersion',
  'locator',
] as const;
const EVENT_FIELDS = ['eventStem', 'eventId', 'payloadDigest'] as const;
const LOCATOR_FIELDS = ['scheme', 'locatorDigest', 'selector', 'revision'] as const;
const DEPENDENCY_FIELDS = ['purpose', 'artifactKind', 'reference'] as const;

const BENCHMARK_DESIGN_FIELDS = [
  ...BASE_FIELDS,
  'randomizationSeed', 'replicateCount', 'blockingFactorCodes', 'treatmentArms',
  'assignmentPolicyVersion', 'registryDigest', 'workloadDigest', 'designCellDigests',
] as const;
const SKILL_BUNDLE_FIELDS = [
  ...BASE_FIELDS,
  'bundleDigest', 'skillTreeDigest', 'packageManifestDigest', 'resourceManifestDigest',
  'resourceDigests', 'resourceClasses', 'permissionDigest', 'dependencyCompatibilityDigest',
  'registryDigest', 'visibilityCommitmentDigest',
] as const;
const SCENARIO_GOLD_FIELDS = [
  ...BASE_FIELDS,
  'scenarioId', 'taskRecipeDigest', 'constraintSetDigest', 'deterministicCheckSetDigest',
  'dynamicReferenceSetDigest', 'negativeControlSetDigest', 'goldPolicy', 'goldProvenanceRef',
  'goldProvenanceDigest', 'expectedCoverageRatio', 'mutationSensitivityRef',
  'mutationSensitivityDigest', 'hiddenOracleCommitmentDigest', 'integrityStatus',
] as const;
const RUN_ASSIGNMENT_FIELDS = [
  ...BASE_FIELDS,
  'designCellId', 'treatmentArm', 'randomizationSeed', 'propensity', 'replicateIndex',
  'pairedReplicateId', 'taskRef', 'taskDigest', 'skillBundleRef', 'skillBundleDigest',
  'executorDescriptorRef', 'executorDescriptorDigest', 'environmentRef', 'environmentDigest',
  'toolDigest', 'permissionDigest', 'dependencyDigest', 'registryDigest', 'workloadDigest',
  'evaluatorEpochId', 'evaluatorCapsuleReference',
] as const;
const EXPOSURE_FIELDS = [
  ...BASE_FIELDS,
  'assignmentId', 'assignmentDigest', 'bundleDigest', 'evaluatorEpochId',
  'discoveryEvidenceRef', 'discoveryEvidenceDigest', 'loadingEvidenceRef',
  'loadingEvidenceDigest', 'invocationEvidenceRef', 'invocationEvidenceDigest',
  'resourceCanaryRef', 'resourceCanaryDigest', 'canaryStatus', 'keyPointCoverageDigest',
  'keyPointOrderDigest', 'milestoneEvidenceDigest', 'finalArtifactRef', 'finalArtifactDigest',
  'costMicrounits', 'latencyMs', 'tokenCount', 'securityProbeDigest', 'visibilityStatus',
  'canaryEpochReference',
] as const;
const SCORE_FIELDS = [
  ...BASE_FIELDS,
  'assignmentId', 'assignmentDigest', 'outcomeRef', 'outcomeDigest',
  'scenarioGoldManifestReference', 'evaluatorCapsuleReference', 'canaryEpochReference',
  'rawOutputRef', 'rawOutputDigest', 'deterministicResultsRef', 'deterministicResultsDigest',
  'dynamicReferenceResultsRef', 'dynamicReferenceResultsDigest', 'constraintCoverageRef',
  'constraintCoverageDigest', 'rawScoreAxes', 'inputTokenCount', 'outputTokenCount',
  'totalTokenCount', 'latencyMs', 'costMicrounits', 'compatibilityStatus',
  'negativeTransferEvidenceDigest', 'securityProbeEvidenceDigest', 'goldPolicy',
  'goldIntegrityStatus', 'numeratorEligible', 'evaluatorEpochId',
] as const;
const CERTIFICATE_INPUT_FIELDS = [
  ...BASE_FIELDS,
  'evidenceSetDigest', 'pairedDeltaDigests', 'confidenceIntervalRef',
  'confidenceIntervalDigest', 'componentAblationDigests', 'compatibilitySliceDigests',
  'negativeTransferDigests', 'costSecurityDeltaDigest', 'validityDomain', 'expiryTriggers',
  'withheldEvidenceDigests', 'evaluatorEpochId', 'evaluatorCapsuleReference',
  'canaryEpochReference', 'promotionEvidenceReference',
] as const;

const OWN_ARTIFACT_KIND_SET: ReadonlySet<string> = new Set(
  SKILL_BENCHMARK_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind),
);
const COMMON_ARTIFACT_KIND_SET: ReadonlySet<string> = new Set(
  DEEP_IMPROVEMENT_COMMON_SEALED_ARTIFACT_CONTRACT.artifactKinds,
);
const REGISTERED_ARTIFACT_KIND_SET: ReadonlySet<string> = new Set([
  ...OWN_ARTIFACT_KIND_SET,
  ...COMMON_ARTIFACT_KIND_SET,
]);

function invalidMaterial(artifactKind: string, field: string): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.INVALID_INPUT,
    'canonicalization',
    'Skill Benchmark artifact material violates its closed field contract',
    { artifactKind, field },
  );
}

function unsupportedArtifactKind(artifactKind: never): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.UNSUPPORTED_ARTIFACT_KIND,
    'canonicalization',
    'Skill Benchmark artifact kind is not registered',
    { artifactKind: String(artifactKind) },
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasExactFields(
  value: Record<string, unknown>,
  fields: readonly string[],
): boolean {
  const expected = new Set(fields);
  return Object.keys(value).length === fields.length
    && Object.keys(value).every((field) => expected.has(field));
}

function requireRecord(
  artifactKind: SkillBenchmarkArtifactKind,
  input: unknown,
  fields: readonly string[],
): Record<string, unknown> {
  if (!isRecord(input) || !hasExactFields(input, fields)) {
    return invalidMaterial(artifactKind, 'shape');
  }
  return input;
}

function requireToken(
  artifactKind: SkillBenchmarkArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !TOKEN_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireCode(
  artifactKind: SkillBenchmarkArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !CODE_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireDigest(
  artifactKind: SkillBenchmarkArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !DIGEST_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireNullableDigest(
  artifactKind: SkillBenchmarkArtifactKind,
  field: string,
  value: unknown,
): string | null {
  return value === null ? null : requireDigest(artifactKind, field, value);
}

function requireDigestArray(
  artifactKind: SkillBenchmarkArtifactKind,
  field: string,
  value: unknown,
  minimum = 0,
): readonly string[] {
  if (
    !Array.isArray(value)
    || value.length < minimum
    || value.length > MAX_ARRAY_ENTRIES
    || !value.every((entry) => typeof entry === 'string' && DIGEST_PATTERN.test(entry))
  ) {
    return invalidMaterial(artifactKind, field);
  }
  return Object.freeze([...value]);
}

function requireTokenArray(
  artifactKind: SkillBenchmarkArtifactKind,
  field: string,
  value: unknown,
  minimum = 0,
): readonly string[] {
  if (
    !Array.isArray(value)
    || value.length < minimum
    || value.length > MAX_ARRAY_ENTRIES
    || !value.every((entry) => typeof entry === 'string' && TOKEN_PATTERN.test(entry))
  ) {
    return invalidMaterial(artifactKind, field);
  }
  return Object.freeze([...value]);
}

function requireEnum<T extends string>(
  artifactKind: SkillBenchmarkArtifactKind,
  field: string,
  value: unknown,
  allowed: readonly T[],
): T {
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    return invalidMaterial(artifactKind, field);
  }
  return value as T;
}

function requireEnumArray<T extends string>(
  artifactKind: SkillBenchmarkArtifactKind,
  field: string,
  value: unknown,
  allowed: readonly T[],
  minimum = 0,
): readonly T[] {
  if (
    !Array.isArray(value)
    || value.length < minimum
    || value.length > MAX_ARRAY_ENTRIES
    || !value.every((entry) => typeof entry === 'string' && allowed.includes(entry as T))
  ) {
    return invalidMaterial(artifactKind, field);
  }
  return Object.freeze([...value]) as readonly T[];
}

function requireUint32(
  artifactKind: SkillBenchmarkArtifactKind,
  field: string,
  value: unknown,
): number {
  if (
    typeof value !== 'number'
    || !Number.isSafeInteger(value)
    || value < 0
    || value > MAX_UINT32
  ) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireFiniteNumber(
  artifactKind: SkillBenchmarkArtifactKind,
  field: string,
  value: unknown,
): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < -1_000_000_000 || value > 1_000_000_000) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireRatio(
  artifactKind: SkillBenchmarkArtifactKind,
  field: string,
  value: unknown,
): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireLocator(
  artifactKind: SkillBenchmarkArtifactKind,
  value: unknown,
): SkillBenchmarkArtifactLocator {
  const locator = requireRecord(artifactKind, value, LOCATOR_FIELDS);
  const scheme = requireEnum(artifactKind, 'locator.scheme', locator.scheme, [
    'artifact', 'file', 'ledger', 'url',
  ] as const);
  if (
    typeof locator.selector !== 'string'
    || locator.selector.length === 0
    || locator.selector.length > 256
    || !SELECTOR_PATTERN.test(locator.selector)
    || (locator.selector.match(/\s/gu)?.length ?? 0) > MAX_SELECTOR_SPACES
  ) {
    return invalidMaterial(artifactKind, 'locator.selector');
  }
  return Object.freeze({
    scheme,
    locatorDigest: requireDigest(artifactKind, 'locator.locatorDigest', locator.locatorDigest),
    selector: locator.selector,
    revision: locator.revision === null
      ? null
      : requireToken(artifactKind, 'locator.revision', locator.revision),
  });
}

function requireReference(
  artifactKind: SkillBenchmarkArtifactKind,
  field: string,
  value: unknown,
): SealedArtifactReference {
  let reference: SealedArtifactReference;
  try {
    reference = parseSealedArtifactReference(value);
  } catch {
    return invalidMaterial(artifactKind, field);
  }
  if (!REGISTERED_ARTIFACT_KIND_SET.has(reference.artifact_kind)) {
    return invalidMaterial(artifactKind, `${field}.artifact_kind`);
  }
  return reference;
}

function requireCommonReference(
  artifactKind: SkillBenchmarkArtifactKind,
  field: string,
  value: unknown,
  expectedKind?: string,
): SealedArtifactReference {
  const reference = requireReference(artifactKind, field, value);
  if (
    !COMMON_ARTIFACT_KIND_SET.has(reference.artifact_kind)
    || (expectedKind !== undefined && reference.artifact_kind !== expectedKind)
  ) {
    return invalidMaterial(artifactKind, `${field}.artifact_kind`);
  }
  return reference;
}

function requireOwnReference(
  artifactKind: SkillBenchmarkArtifactKind,
  field: string,
  value: unknown,
  expectedKind: SkillBenchmarkArtifactKind,
): SealedArtifactReference {
  const reference = requireReference(artifactKind, field, value);
  if (
    !OWN_ARTIFACT_KIND_SET.has(reference.artifact_kind)
    || reference.artifact_kind !== expectedKind
  ) {
    return invalidMaterial(artifactKind, `${field}.artifact_kind`);
  }
  return reference;
}

function requireEvent<TStem extends SkillBenchmarkSpecificEventStem>(
  artifactKind: SkillBenchmarkArtifactKind,
  value: unknown,
  expectedStem: TStem,
): SkillBenchmarkArtifactEventBinding<TStem> {
  const event = requireRecord(artifactKind, value, EVENT_FIELDS);
  if (
    typeof event.eventStem !== 'string'
    || !isSkillBenchmarkSpecificEventStem(event.eventStem)
    || event.eventStem !== expectedStem
  ) {
    return invalidMaterial(artifactKind, 'originEvent.eventStem');
  }
  return Object.freeze({
    eventStem: expectedStem,
    eventId: requireToken(artifactKind, 'originEvent.eventId', event.eventId),
    payloadDigest: requireDigest(artifactKind, 'originEvent.payloadDigest', event.payloadDigest),
  });
}

function requireDependencies(
  artifactKind: SkillBenchmarkArtifactKind,
  value: unknown,
): readonly SkillBenchmarkArtifactDependency[] {
  if (!Array.isArray(value) || value.length > MAX_DEPENDENCIES) {
    return invalidMaterial(artifactKind, 'dependencyReferences');
  }
  const seen = new Set<string>();
  return Object.freeze(value.map((entry, index) => {
    const dependency = requireRecord(artifactKind, entry, DEPENDENCY_FIELDS);
    const purpose = requireCode(artifactKind, `dependencyReferences[${index}].purpose`, dependency.purpose);
    if (typeof dependency.artifactKind !== 'string' || !REGISTERED_ARTIFACT_KIND_SET.has(dependency.artifactKind)) {
      return invalidMaterial(artifactKind, `dependencyReferences[${index}].artifactKind`);
    }
    const reference = requireReference(
      artifactKind,
      `dependencyReferences[${index}].reference`,
      dependency.reference,
    );
    if (reference.artifact_kind !== dependency.artifactKind) {
      return invalidMaterial(artifactKind, `dependencyReferences[${index}].reference.artifact_kind`);
    }
    if (seen.has(reference.qualified_digest)) {
      return invalidMaterial(artifactKind, `dependencyReferences[${index}].reference`);
    }
    seen.add(reference.qualified_digest);
    return Object.freeze({
      purpose,
      artifactKind: dependency.artifactKind as SkillBenchmarkArtifactDependency['artifactKind'],
      reference,
    });
  }));
}

function requireBase<TStem extends SkillBenchmarkSpecificEventStem>(
  artifactKind: SkillBenchmarkArtifactKind,
  value: Record<string, unknown>,
  expectedStem: TStem,
): SkillBenchmarkArtifactMaterialBase<TStem> {
  return Object.freeze({
    schemaVersion: requireToken(artifactKind, 'schemaVersion', value.schemaVersion),
    artifactId: requireToken(artifactKind, 'artifactId', value.artifactId),
    dependencyReferences: requireDependencies(artifactKind, value.dependencyReferences),
    originEvent: requireEvent(artifactKind, value.originEvent, expectedStem),
    producerVersion: requireToken(artifactKind, 'producerVersion', value.producerVersion),
    locator: requireLocator(artifactKind, value.locator),
  });
}

const TREATMENT_ARMS = [
  'auto-route', 'compatibility-boundary', 'component-ablation', 'control',
  'distractor', 'forced-activation', 'no-skill', 'placebo',
] as const satisfies readonly SkillBenchmarkTreatmentArm[];
const RESOURCE_CLASSES = [
  'asset', 'instruction', 'reference', 'script', 'template',
] as const satisfies readonly SkillBenchmarkResourceClass[];
const GOLD_POLICIES = ['negative', 'pending', 'scored', 'structural-only'] as const;
const GOLD_INTEGRITY_STATUSES = ['accepted', 'blocked', 'pending'] as const;
const EXPIRY_TRIGGERS = [
  'bundle-drift', 'dependency-drift', 'environment-drift', 'evaluator-drift',
  'registry-drift', 'time-limit', 'workload-drift',
] as const;

function parseBenchmarkDesign(
  artifactKind: SkillBenchmarkArtifactKind,
  input: unknown,
): SkillBenchmarkBenchmarkDesignMaterial {
  const value = requireRecord(artifactKind, input, BENCHMARK_DESIGN_FIELDS);
  const base = requireBase(artifactKind, value, 'skill_benchmark.run_planned');
  return Object.freeze({
    ...base,
    randomizationSeed: requireUint32(artifactKind, 'randomizationSeed', value.randomizationSeed),
    replicateCount: requireUint32(artifactKind, 'replicateCount', value.replicateCount),
    blockingFactorCodes: requireTokenArray(artifactKind, 'blockingFactorCodes', value.blockingFactorCodes),
    treatmentArms: requireEnumArray(artifactKind, 'treatmentArms', value.treatmentArms, TREATMENT_ARMS, 1),
    assignmentPolicyVersion: requireToken(artifactKind, 'assignmentPolicyVersion', value.assignmentPolicyVersion),
    registryDigest: requireDigest(artifactKind, 'registryDigest', value.registryDigest),
    workloadDigest: requireDigest(artifactKind, 'workloadDigest', value.workloadDigest),
    designCellDigests: requireDigestArray(artifactKind, 'designCellDigests', value.designCellDigests, 1),
  });
}

function parseSkillBundleSnapshot(
  artifactKind: SkillBenchmarkArtifactKind,
  input: unknown,
): SkillBenchmarkSkillBundleSnapshotMaterial {
  const value = requireRecord(artifactKind, input, SKILL_BUNDLE_FIELDS);
  const base = requireBase(artifactKind, value, 'skill_benchmark.skill_discovered');
  const resourceDigests = requireDigestArray(artifactKind, 'resourceDigests', value.resourceDigests, 1);
  const resourceClasses = requireEnumArray(artifactKind, 'resourceClasses', value.resourceClasses, RESOURCE_CLASSES, 1);
  if (resourceDigests.length !== resourceClasses.length) {
    return invalidMaterial(artifactKind, 'resourceClasses');
  }
  return Object.freeze({
    ...base,
    bundleDigest: requireDigest(artifactKind, 'bundleDigest', value.bundleDigest),
    skillTreeDigest: requireDigest(artifactKind, 'skillTreeDigest', value.skillTreeDigest),
    packageManifestDigest: requireDigest(artifactKind, 'packageManifestDigest', value.packageManifestDigest),
    resourceManifestDigest: requireDigest(artifactKind, 'resourceManifestDigest', value.resourceManifestDigest),
    resourceDigests,
    resourceClasses,
    permissionDigest: requireDigest(artifactKind, 'permissionDigest', value.permissionDigest),
    dependencyCompatibilityDigest: requireDigest(
      artifactKind,
      'dependencyCompatibilityDigest',
      value.dependencyCompatibilityDigest,
    ),
    registryDigest: requireDigest(artifactKind, 'registryDigest', value.registryDigest),
    visibilityCommitmentDigest: requireDigest(
      artifactKind,
      'visibilityCommitmentDigest',
      value.visibilityCommitmentDigest,
    ),
  });
}

function parseScenarioGoldManifest(
  artifactKind: SkillBenchmarkArtifactKind,
  input: unknown,
): SkillBenchmarkScenarioGoldManifestMaterial {
  const value = requireRecord(artifactKind, input, SCENARIO_GOLD_FIELDS);
  const base = requireBase(artifactKind, value, 'skill_benchmark.gold_integrity_recorded');
  return Object.freeze({
    ...base,
    scenarioId: requireToken(artifactKind, 'scenarioId', value.scenarioId),
    taskRecipeDigest: requireDigest(artifactKind, 'taskRecipeDigest', value.taskRecipeDigest),
    constraintSetDigest: requireDigest(artifactKind, 'constraintSetDigest', value.constraintSetDigest),
    deterministicCheckSetDigest: requireDigest(
      artifactKind,
      'deterministicCheckSetDigest',
      value.deterministicCheckSetDigest,
    ),
    dynamicReferenceSetDigest: requireDigest(
      artifactKind,
      'dynamicReferenceSetDigest',
      value.dynamicReferenceSetDigest,
    ),
    negativeControlSetDigest: requireDigest(
      artifactKind,
      'negativeControlSetDigest',
      value.negativeControlSetDigest,
    ),
    goldPolicy: requireEnum(artifactKind, 'goldPolicy', value.goldPolicy, GOLD_POLICIES),
    goldProvenanceRef: requireToken(artifactKind, 'goldProvenanceRef', value.goldProvenanceRef),
    goldProvenanceDigest: requireDigest(artifactKind, 'goldProvenanceDigest', value.goldProvenanceDigest),
    expectedCoverageRatio: requireRatio(artifactKind, 'expectedCoverageRatio', value.expectedCoverageRatio),
    mutationSensitivityRef: requireToken(
      artifactKind,
      'mutationSensitivityRef',
      value.mutationSensitivityRef,
    ),
    mutationSensitivityDigest: requireDigest(
      artifactKind,
      'mutationSensitivityDigest',
      value.mutationSensitivityDigest,
    ),
    hiddenOracleCommitmentDigest: requireDigest(
      artifactKind,
      'hiddenOracleCommitmentDigest',
      value.hiddenOracleCommitmentDigest,
    ),
    integrityStatus: requireEnum(
      artifactKind,
      'integrityStatus',
      value.integrityStatus,
      GOLD_INTEGRITY_STATUSES,
    ),
  });
}

function parseRunAssignment(
  artifactKind: SkillBenchmarkArtifactKind,
  input: unknown,
): SkillBenchmarkRunAssignmentMaterial {
  const value = requireRecord(artifactKind, input, RUN_ASSIGNMENT_FIELDS);
  const base = requireBase(artifactKind, value, 'skill_benchmark.treatment_assigned');
  return Object.freeze({
    ...base,
    designCellId: requireToken(artifactKind, 'designCellId', value.designCellId),
    treatmentArm: requireEnum(artifactKind, 'treatmentArm', value.treatmentArm, TREATMENT_ARMS),
    randomizationSeed: requireUint32(artifactKind, 'randomizationSeed', value.randomizationSeed),
    propensity: requireRatio(artifactKind, 'propensity', value.propensity),
    replicateIndex: requireUint32(artifactKind, 'replicateIndex', value.replicateIndex),
    pairedReplicateId: requireToken(artifactKind, 'pairedReplicateId', value.pairedReplicateId),
    taskRef: requireToken(artifactKind, 'taskRef', value.taskRef),
    taskDigest: requireDigest(artifactKind, 'taskDigest', value.taskDigest),
    skillBundleRef: requireToken(artifactKind, 'skillBundleRef', value.skillBundleRef),
    skillBundleDigest: requireDigest(artifactKind, 'skillBundleDigest', value.skillBundleDigest),
    executorDescriptorRef: requireToken(artifactKind, 'executorDescriptorRef', value.executorDescriptorRef),
    executorDescriptorDigest: requireDigest(
      artifactKind,
      'executorDescriptorDigest',
      value.executorDescriptorDigest,
    ),
    environmentRef: requireToken(artifactKind, 'environmentRef', value.environmentRef),
    environmentDigest: requireDigest(artifactKind, 'environmentDigest', value.environmentDigest),
    toolDigest: requireDigest(artifactKind, 'toolDigest', value.toolDigest),
    permissionDigest: requireDigest(artifactKind, 'permissionDigest', value.permissionDigest),
    dependencyDigest: requireDigest(artifactKind, 'dependencyDigest', value.dependencyDigest),
    registryDigest: requireDigest(artifactKind, 'registryDigest', value.registryDigest),
    workloadDigest: requireDigest(artifactKind, 'workloadDigest', value.workloadDigest),
    evaluatorEpochId: requireToken(artifactKind, 'evaluatorEpochId', value.evaluatorEpochId),
    evaluatorCapsuleReference: requireCommonReference(
      artifactKind,
      'evaluatorCapsuleReference',
      value.evaluatorCapsuleReference,
      DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
    ),
  });
}

function parseExposureObservation(
  artifactKind: SkillBenchmarkArtifactKind,
  input: unknown,
): SkillBenchmarkExposureObservationMaterial {
  const value = requireRecord(artifactKind, input, EXPOSURE_FIELDS);
  const base = requireBase(artifactKind, value, 'skill_benchmark.resource_exposed');
  return Object.freeze({
    ...base,
    assignmentId: requireToken(artifactKind, 'assignmentId', value.assignmentId),
    assignmentDigest: requireDigest(artifactKind, 'assignmentDigest', value.assignmentDigest),
    bundleDigest: requireDigest(artifactKind, 'bundleDigest', value.bundleDigest),
    evaluatorEpochId: requireToken(artifactKind, 'evaluatorEpochId', value.evaluatorEpochId),
    discoveryEvidenceRef: requireToken(artifactKind, 'discoveryEvidenceRef', value.discoveryEvidenceRef),
    discoveryEvidenceDigest: requireDigest(artifactKind, 'discoveryEvidenceDigest', value.discoveryEvidenceDigest),
    loadingEvidenceRef: requireToken(artifactKind, 'loadingEvidenceRef', value.loadingEvidenceRef),
    loadingEvidenceDigest: requireDigest(artifactKind, 'loadingEvidenceDigest', value.loadingEvidenceDigest),
    invocationEvidenceRef: requireToken(artifactKind, 'invocationEvidenceRef', value.invocationEvidenceRef),
    invocationEvidenceDigest: requireDigest(artifactKind, 'invocationEvidenceDigest', value.invocationEvidenceDigest),
    resourceCanaryRef: requireToken(artifactKind, 'resourceCanaryRef', value.resourceCanaryRef),
    resourceCanaryDigest: requireDigest(artifactKind, 'resourceCanaryDigest', value.resourceCanaryDigest),
    canaryStatus: requireEnum(artifactKind, 'canaryStatus', value.canaryStatus, [
      'clean', 'not-applicable', 'triggered',
    ] as const),
    keyPointCoverageDigest: requireDigest(artifactKind, 'keyPointCoverageDigest', value.keyPointCoverageDigest),
    keyPointOrderDigest: requireDigest(artifactKind, 'keyPointOrderDigest', value.keyPointOrderDigest),
    milestoneEvidenceDigest: requireDigest(artifactKind, 'milestoneEvidenceDigest', value.milestoneEvidenceDigest),
    finalArtifactRef: value.finalArtifactRef === null
      ? null
      : requireToken(artifactKind, 'finalArtifactRef', value.finalArtifactRef),
    finalArtifactDigest: requireNullableDigest(artifactKind, 'finalArtifactDigest', value.finalArtifactDigest),
    costMicrounits: requireUint32(artifactKind, 'costMicrounits', value.costMicrounits),
    latencyMs: requireUint32(artifactKind, 'latencyMs', value.latencyMs),
    tokenCount: requireUint32(artifactKind, 'tokenCount', value.tokenCount),
    securityProbeDigest: requireDigest(artifactKind, 'securityProbeDigest', value.securityProbeDigest),
    visibilityStatus: requireEnum(artifactKind, 'visibilityStatus', value.visibilityStatus, [
      'candidate-redacted', 'downstream', 'withheld',
    ] as const),
    canaryEpochReference: requireCommonReference(
      artifactKind,
      'canaryEpochReference',
      value.canaryEpochReference,
      DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
    ),
  });
}

function requireRawScoreAxes(
  artifactKind: SkillBenchmarkArtifactKind,
  value: unknown,
): readonly SkillBenchmarkRawScoreAxis[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_ARRAY_ENTRIES) {
    return invalidMaterial(artifactKind, 'rawScoreAxes');
  }
  return Object.freeze(value.map((entry, index) => {
    const axis = requireRecord(artifactKind, entry, [
      'dimensionCode', 'rawScore', 'measurementRef', 'measurementDigest',
    ]);
    return Object.freeze({
      dimensionCode: requireCode(artifactKind, `rawScoreAxes[${index}].dimensionCode`, axis.dimensionCode),
      rawScore: requireFiniteNumber(artifactKind, `rawScoreAxes[${index}].rawScore`, axis.rawScore),
      measurementRef: requireToken(artifactKind, `rawScoreAxes[${index}].measurementRef`, axis.measurementRef),
      measurementDigest: requireDigest(
        artifactKind,
        `rawScoreAxes[${index}].measurementDigest`,
        axis.measurementDigest,
      ),
    });
  }));
}

function parseCausalScoreObservation(
  artifactKind: SkillBenchmarkArtifactKind,
  input: unknown,
): SkillBenchmarkCausalScoreObservationMaterial {
  const value = requireRecord(artifactKind, input, SCORE_FIELDS);
  const base = requireBase(artifactKind, value, 'skill_benchmark.score_observed');
  const goldPolicy = requireEnum(artifactKind, 'goldPolicy', value.goldPolicy, GOLD_POLICIES);
  const goldIntegrityStatus = requireEnum(
    artifactKind,
    'goldIntegrityStatus',
    value.goldIntegrityStatus,
    GOLD_INTEGRITY_STATUSES,
  );
  const numeratorEligible = value.numeratorEligible;
  if (
    typeof numeratorEligible !== 'boolean'
    || goldPolicy !== 'scored'
    || goldIntegrityStatus !== 'accepted'
  ) {
    return invalidMaterial(artifactKind, 'numeratorEligible');
  }
  return Object.freeze({
    ...base,
    assignmentId: requireToken(artifactKind, 'assignmentId', value.assignmentId),
    assignmentDigest: requireDigest(artifactKind, 'assignmentDigest', value.assignmentDigest),
    outcomeRef: requireToken(artifactKind, 'outcomeRef', value.outcomeRef),
    outcomeDigest: requireDigest(artifactKind, 'outcomeDigest', value.outcomeDigest),
    scenarioGoldManifestReference: requireOwnReference(
      artifactKind,
      'scenarioGoldManifestReference',
      value.scenarioGoldManifestReference,
      SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST,
    ),
    evaluatorCapsuleReference: requireCommonReference(
      artifactKind,
      'evaluatorCapsuleReference',
      value.evaluatorCapsuleReference,
      DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
    ),
    canaryEpochReference: requireCommonReference(
      artifactKind,
      'canaryEpochReference',
      value.canaryEpochReference,
      DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
    ),
    rawOutputRef: requireToken(artifactKind, 'rawOutputRef', value.rawOutputRef),
    rawOutputDigest: requireDigest(artifactKind, 'rawOutputDigest', value.rawOutputDigest),
    deterministicResultsRef: requireToken(artifactKind, 'deterministicResultsRef', value.deterministicResultsRef),
    deterministicResultsDigest: requireDigest(
      artifactKind,
      'deterministicResultsDigest',
      value.deterministicResultsDigest,
    ),
    dynamicReferenceResultsRef: requireToken(
      artifactKind,
      'dynamicReferenceResultsRef',
      value.dynamicReferenceResultsRef,
    ),
    dynamicReferenceResultsDigest: requireDigest(
      artifactKind,
      'dynamicReferenceResultsDigest',
      value.dynamicReferenceResultsDigest,
    ),
    constraintCoverageRef: requireToken(artifactKind, 'constraintCoverageRef', value.constraintCoverageRef),
    constraintCoverageDigest: requireDigest(
      artifactKind,
      'constraintCoverageDigest',
      value.constraintCoverageDigest,
    ),
    rawScoreAxes: requireRawScoreAxes(artifactKind, value.rawScoreAxes),
    inputTokenCount: requireUint32(artifactKind, 'inputTokenCount', value.inputTokenCount),
    outputTokenCount: requireUint32(artifactKind, 'outputTokenCount', value.outputTokenCount),
    totalTokenCount: requireUint32(artifactKind, 'totalTokenCount', value.totalTokenCount),
    latencyMs: requireUint32(artifactKind, 'latencyMs', value.latencyMs),
    costMicrounits: requireUint32(artifactKind, 'costMicrounits', value.costMicrounits),
    compatibilityStatus: requireEnum(artifactKind, 'compatibilityStatus', value.compatibilityStatus, [
      'compatible', 'incompatible', 'unknown',
    ] as const),
    negativeTransferEvidenceDigest: requireNullableDigest(
      artifactKind,
      'negativeTransferEvidenceDigest',
      value.negativeTransferEvidenceDigest,
    ),
    securityProbeEvidenceDigest: requireNullableDigest(
      artifactKind,
      'securityProbeEvidenceDigest',
      value.securityProbeEvidenceDigest,
    ),
    goldPolicy,
    goldIntegrityStatus,
    numeratorEligible,
    evaluatorEpochId: requireToken(artifactKind, 'evaluatorEpochId', value.evaluatorEpochId),
  });
}

function requireValidityDomain(
  artifactKind: SkillBenchmarkArtifactKind,
  value: unknown,
): SkillBenchmarkCertificateValidityDomain {
  const domain = requireRecord(artifactKind, value, [
    'taskSetDigest', 'skillBundleDigest', 'registryDigest', 'executorDigest',
    'environmentDigest', 'dependencyDigest', 'workloadDigest', 'validityPolicyVersion',
  ]);
  return Object.freeze({
    taskSetDigest: requireDigest(artifactKind, 'validityDomain.taskSetDigest', domain.taskSetDigest),
    skillBundleDigest: requireDigest(artifactKind, 'validityDomain.skillBundleDigest', domain.skillBundleDigest),
    registryDigest: requireDigest(artifactKind, 'validityDomain.registryDigest', domain.registryDigest),
    executorDigest: requireDigest(artifactKind, 'validityDomain.executorDigest', domain.executorDigest),
    environmentDigest: requireDigest(artifactKind, 'validityDomain.environmentDigest', domain.environmentDigest),
    dependencyDigest: requireDigest(artifactKind, 'validityDomain.dependencyDigest', domain.dependencyDigest),
    workloadDigest: requireDigest(artifactKind, 'validityDomain.workloadDigest', domain.workloadDigest),
    validityPolicyVersion: requireToken(
      artifactKind,
      'validityDomain.validityPolicyVersion',
      domain.validityPolicyVersion,
    ),
  });
}

function parseEffectCertificateInput(
  artifactKind: SkillBenchmarkArtifactKind,
  input: unknown,
): SkillBenchmarkEffectCertificateInputMaterial {
  const value = requireRecord(artifactKind, input, CERTIFICATE_INPUT_FIELDS);
  const base = requireBase(artifactKind, value, 'skill_benchmark.effect_certificate_issued');
  return Object.freeze({
    ...base,
    evidenceSetDigest: requireDigest(artifactKind, 'evidenceSetDigest', value.evidenceSetDigest),
    pairedDeltaDigests: requireDigestArray(artifactKind, 'pairedDeltaDigests', value.pairedDeltaDigests, 1),
    confidenceIntervalRef: requireToken(artifactKind, 'confidenceIntervalRef', value.confidenceIntervalRef),
    confidenceIntervalDigest: requireDigest(
      artifactKind,
      'confidenceIntervalDigest',
      value.confidenceIntervalDigest,
    ),
    componentAblationDigests: requireDigestArray(
      artifactKind,
      'componentAblationDigests',
      value.componentAblationDigests,
    ),
    compatibilitySliceDigests: requireDigestArray(
      artifactKind,
      'compatibilitySliceDigests',
      value.compatibilitySliceDigests,
    ),
    negativeTransferDigests: requireDigestArray(
      artifactKind,
      'negativeTransferDigests',
      value.negativeTransferDigests,
    ),
    costSecurityDeltaDigest: requireDigest(
      artifactKind,
      'costSecurityDeltaDigest',
      value.costSecurityDeltaDigest,
    ),
    validityDomain: requireValidityDomain(artifactKind, value.validityDomain),
    expiryTriggers: requireEnumArray(
      artifactKind,
      'expiryTriggers',
      value.expiryTriggers,
      EXPIRY_TRIGGERS,
      1,
    ),
    withheldEvidenceDigests: requireDigestArray(
      artifactKind,
      'withheldEvidenceDigests',
      value.withheldEvidenceDigests,
    ),
    evaluatorEpochId: requireToken(artifactKind, 'evaluatorEpochId', value.evaluatorEpochId),
    evaluatorCapsuleReference: requireCommonReference(
      artifactKind,
      'evaluatorCapsuleReference',
      value.evaluatorCapsuleReference,
      DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
    ),
    canaryEpochReference: requireCommonReference(
      artifactKind,
      'canaryEpochReference',
      value.canaryEpochReference,
      DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
    ),
    promotionEvidenceReference: requireCommonReference(
      artifactKind,
      'promotionEvidenceReference',
      value.promotionEvidenceReference,
      DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE,
    ),
  });
}

export function parseSkillBenchmarkArtifactMaterial<TKind extends SkillBenchmarkArtifactKind>(
  artifactKind: TKind,
  input: unknown,
): SkillBenchmarkArtifactMaterialByKind[TKind] {
  switch (artifactKind) {
    case SkillBenchmarkArtifactKinds.BENCHMARK_DESIGN:
      return parseBenchmarkDesign(artifactKind, input) as SkillBenchmarkArtifactMaterialByKind[TKind];
    case SkillBenchmarkArtifactKinds.SKILL_BUNDLE_SNAPSHOT:
      return parseSkillBundleSnapshot(artifactKind, input) as SkillBenchmarkArtifactMaterialByKind[TKind];
    case SkillBenchmarkArtifactKinds.SCENARIO_GOLD_MANIFEST:
      return parseScenarioGoldManifest(artifactKind, input) as SkillBenchmarkArtifactMaterialByKind[TKind];
    case SkillBenchmarkArtifactKinds.RUN_ASSIGNMENT:
      return parseRunAssignment(artifactKind, input) as SkillBenchmarkArtifactMaterialByKind[TKind];
    case SkillBenchmarkArtifactKinds.EXPOSURE_OBSERVATION:
      return parseExposureObservation(artifactKind, input) as SkillBenchmarkArtifactMaterialByKind[TKind];
    case SkillBenchmarkArtifactKinds.CAUSAL_SCORE_OBSERVATION:
      return parseCausalScoreObservation(artifactKind, input) as SkillBenchmarkArtifactMaterialByKind[TKind];
    case SkillBenchmarkArtifactKinds.EFFECT_CERTIFICATE_INPUT:
      return parseEffectCertificateInput(artifactKind, input) as SkillBenchmarkArtifactMaterialByKind[TKind];
    default:
      return unsupportedArtifactKind(artifactKind);
  }
}

function canonicalizeSkillBenchmarkMaterial(
  artifactKind: SkillBenchmarkArtifactKind,
  input: unknown,
): Uint8Array {
  const material = parseSkillBenchmarkArtifactMaterial(artifactKind, input);
  return Uint8Array.from(canonicalBytes({ artifactKind, material }));
}

/** Build one registry that preserves the common profiles and adds this mode's profiles. */
export function createSkillBenchmarkArtifactCanonicalizerRegistry(): ArtifactCanonicalizerRegistry {
  const commonRegistry = createDeepImprovementCommonArtifactCanonicalizerRegistry();
  const sharedDefinitions: ArtifactCanonicalizerDefinition[] =
    DEEP_IMPROVEMENT_COMMON_SEALED_ARTIFACT_CONTRACT.artifactKinds.map((artifactKind) => {
      const profile = commonRegistry.describe(
        artifactKind,
        DEEP_IMPROVEMENT_COMMON_ARTIFACT_CANONICALIZATION_VERSION,
      );
      return {
        artifactKind,
        canonicalizationVersion: DEEP_IMPROVEMENT_COMMON_ARTIFACT_CANONICALIZATION_VERSION,
        mediaType: DEEP_IMPROVEMENT_COMMON_ARTIFACT_MEDIA_TYPE,
        implementationIdentity: profile.implementationIdentity,
        canonicalize: (input: unknown): Uint8Array => (
          commonRegistry.canonicalize(
            artifactKind,
            DEEP_IMPROVEMENT_COMMON_ARTIFACT_CANONICALIZATION_VERSION,
            input,
          ).bytes
        ),
      };
    });
  const ownDefinitions: ArtifactCanonicalizerDefinition[] =
    SKILL_BENCHMARK_ARTIFACT_KIND_REGISTRY.map((entry) => ({
      artifactKind: entry.artifactKind,
      canonicalizationVersion: entry.canonicalizationVersion,
      mediaType: entry.mediaType,
      implementationIdentity: 'skill-benchmark-binding-canonicalizer-v1',
      canonicalize: (input: unknown): Uint8Array => (
        canonicalizeSkillBenchmarkMaterial(entry.artifactKind, input)
      ),
    }));
  return new ArtifactCanonicalizerRegistry([...sharedDefinitions, ...ownDefinitions]);
}
