// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Artifact Material
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes } from '../event-envelope/index.js';
import {
  DeepImprovementCommonEventStems,
} from '../deep-improvement-common-ledger-schema/index.js';
import {
  ArtifactCanonicalizerRegistry,
  InitialArtifactKinds,
  SealedArtifactError,
  SealedArtifactErrorCodes,
  createArtifactCanonicalizerRegistry,
} from '../sealed-reference-artifacts/index.js';
import {
  DeepImprovementCommonArtifactKinds,
} from './deep-improvement-common-sealed-artifact-types.js';

import type {
  ArtifactCanonicalizerDefinition,
} from '../sealed-reference-artifacts/index.js';
import type {
  DeepImprovementCommonArtifactDependency,
  DeepImprovementBaselineInputMaterial,
  DeepImprovementCanaryEpochMaterial,
  DeepImprovementCandidateInputMaterial,
  DeepImprovementCommonArtifactKind,
  DeepImprovementCommonArtifactKindRegistration,
  DeepImprovementCommonArtifactLocator,
  DeepImprovementCommonArtifactMaterial,
  DeepImprovementCommonArtifactMaterialByKind,
  DeepImprovementCommonArtifactEventBinding,
  DeepImprovementCommonArtifactBaseMaterial,
  DeepImprovementEvaluatorCapsuleMaterial,
  DeepImprovementIntegrityObservation,
  DeepImprovementLeakagePolicy,
  DeepImprovementPromotionEvidenceMaterial,
  DeepImprovementRawTrialCaseObservation,
  DeepImprovementRawTrialOutputMaterial,
  DeepImprovementScoreComponent,
  DeepImprovementScoreVector,
  DeepImprovementUsageObservation,
  DeepImprovementVisibilityPolicy,
  DeepImprovementBudgetPolicy,
  DeepImprovementCommonSealedArtifactContract,
} from './deep-improvement-common-sealed-artifact-types.js';
import type { DeepImprovementCommonEventStem } from '../deep-improvement-common-ledger-schema/index.js';
import {
  parseSealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';

export const DEEP_IMPROVEMENT_COMMON_ARTIFACT_SCHEMA_VERSION =
  'deep-improvement-common-artifact@1';
export const DEEP_IMPROVEMENT_COMMON_ARTIFACT_CANONICALIZATION_VERSION =
  'deep-improvement-common-binding@1';
export const DEEP_IMPROVEMENT_COMMON_ARTIFACT_MEDIA_TYPE =
  'application/vnd.openai.deep-improvement-common-binding+json';

const REGISTRY_ROWS = [
  [DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE, 'evaluation', 'evaluator'],
  [DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT, 'evaluation', 'candidate'],
  [DeepImprovementCommonArtifactKinds.BASELINE_INPUT, 'evaluation', 'baseline'],
  [DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT, 'trial', 'trial'],
  [DeepImprovementCommonArtifactKinds.CANARY_EPOCH, 'canary', 'canary'],
  [DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE, 'promotion', 'promotion'],
] as const;

export const DEEP_IMPROVEMENT_COMMON_ARTIFACT_KIND_REGISTRY:
  readonly DeepImprovementCommonArtifactKindRegistration[] = Object.freeze(
    REGISTRY_ROWS.map(([artifactKind, lifecycle, materialFamily]) => Object.freeze({
      artifactKind,
      lifecycle,
      materialFamily,
      canonicalizationVersion: DEEP_IMPROVEMENT_COMMON_ARTIFACT_CANONICALIZATION_VERSION,
      mediaType: DEEP_IMPROVEMENT_COMMON_ARTIFACT_MEDIA_TYPE,
    })),
  );

export const DEEP_IMPROVEMENT_COMMON_SEALED_ARTIFACT_CONTRACT:
  DeepImprovementCommonSealedArtifactContract = Object.freeze({
    owner: 'deep-improvement-common',
    consumers: Object.freeze([
      'deep-improvement-common',
      'agent-improvement',
      'model-benchmark',
      'skill-benchmark',
    ] as const),
    artifactKinds: Object.freeze([
      DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT,
      DeepImprovementCommonArtifactKinds.BASELINE_INPUT,
      DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT,
      DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
      DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE,
    ] as const),
    canonicalizationVersion: DEEP_IMPROVEMENT_COMMON_ARTIFACT_CANONICALIZATION_VERSION,
    mediaType: DEEP_IMPROVEMENT_COMMON_ARTIFACT_MEDIA_TYPE,
    bindingVersion: 1,
  });

const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;
const CODE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._/@-]{0,127}$/;
const SELECTOR_PATTERN = /^(?:#[A-Za-z0-9_-]+|[A-Za-z][A-Za-z0-9_-]*(?::[A-Za-z0-9._/#:@?=&%+\-]+)?|\/[A-Za-z0-9._~:/?#\[\]@!$&'()*+,;=%+\-]+)$/u;
const MAX_DEPENDENCIES = 128;
const MAX_REFERENCES = 256;
const MAX_SCORE_COMPONENTS = 64;
const MAX_SPACES_IN_SELECTOR = 16;
const BASE_FIELDS = [
  'schemaVersion',
  'artifactId',
  'dependencyReferences',
  'originEvent',
  'producerVersion',
  'locator',
] as const;
const LOCATOR_FIELDS = ['scheme', 'locatorDigest', 'selector', 'revision'] as const;
const EVENT_FIELDS = ['eventStem', 'eventId', 'payloadDigest'] as const;
const DEPENDENCY_FIELDS = ['purpose', 'reference'] as const;
const VISIBILITY_FIELDS = [
  'candidateView',
  'hiddenFixtures',
  'exactScores',
  'evaluatorInternals',
  'terminalEvidence',
] as const;
const BUDGET_FIELDS = ['maxQueries', 'maxBytes', 'maxWallClockMs', 'maxCostMicros'] as const;
const SCORE_VECTOR_FIELDS = ['components', 'aggregateScore', 'uncertainty'] as const;
const SCORE_COMPONENT_FIELDS = [
  'dimensionCode',
  'rawScore',
  'normalizedScore',
  'weight',
] as const;
const CASE_OBSERVATION_FIELDS = [
  'caseId',
  'outputDigest',
  'outputReference',
  'scoreVectorDigest',
] as const;
const USAGE_FIELDS = [
  'inputTokens',
  'outputTokens',
  'totalTokens',
  'costMicros',
  'latencyMs',
] as const;
const INTEGRITY_FIELDS = ['status', 'detectorDigest', 'evidenceDigest'] as const;
const LEAKAGE_FIELDS = [
  'literalLeakDetection',
  'semanticLeakDetection',
  'candidateVisibleContent',
] as const;

const KIND_SET: ReadonlySet<string> = new Set(
  DEEP_IMPROVEMENT_COMMON_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind),
);
const EVENT_STEM_SET: ReadonlySet<string> = new Set(DeepImprovementCommonEventStems);

function invalidMaterial(artifactKind: string, field: string): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.INVALID_INPUT,
    'canonicalization',
    'Deep Improvement Common artifact material violates its closed field contract',
    { artifactKind, field },
  );
}

function unsupportedArtifactKind(artifactKind: never): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.UNSUPPORTED_ARTIFACT_KIND,
    'canonicalization',
    'Deep Improvement Common artifact kind is not registered',
    { artifactKind: String(artifactKind) },
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasExactFields(value: Record<string, unknown>, fields: readonly string[]): boolean {
  const expected = new Set(fields);
  const keys = Object.keys(value);
  return keys.length === expected.size && keys.every((key) => expected.has(key));
}

function requireRecord(
  artifactKind: DeepImprovementCommonArtifactKind,
  input: unknown,
  fields: readonly string[],
): Record<string, unknown> {
  if (!isRecord(input) || !hasExactFields(input, fields)) return invalidMaterial(artifactKind, 'shape');
  return input;
}

function requireToken(
  artifactKind: DeepImprovementCommonArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !TOKEN_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireCode(
  artifactKind: DeepImprovementCommonArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !CODE_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireDigest(
  artifactKind: DeepImprovementCommonArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !DIGEST_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireBoolean(
  artifactKind: DeepImprovementCommonArtifactKind,
  field: string,
  value: unknown,
): boolean {
  if (typeof value !== 'boolean') return invalidMaterial(artifactKind, field);
  return value;
}

function requireEnum<T extends string>(
  artifactKind: DeepImprovementCommonArtifactKind,
  field: string,
  value: unknown,
  allowed: readonly T[],
): T {
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    return invalidMaterial(artifactKind, field);
  }
  return value as T;
}

function requireUint32(
  artifactKind: DeepImprovementCommonArtifactKind,
  field: string,
  value: unknown,
): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0 || (value as number) > 0xffff_ffff) {
    return invalidMaterial(artifactKind, field);
  }
  return value as number;
}

function requireRatio(
  artifactKind: DeepImprovementCommonArtifactKind,
  field: string,
  value: unknown,
): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireScore(
  artifactKind: DeepImprovementCommonArtifactKind,
  field: string,
  value: unknown,
): number {
  if (
    typeof value !== 'number'
    || !Number.isFinite(value)
    || value < -1_000_000
    || value > 1_000_000
  ) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireTimestamp(
  artifactKind: DeepImprovementCommonArtifactKind,
  field: string,
  value: unknown,
): string {
  if (
    typeof value !== 'string'
    || value.length > 64
    || Number.isNaN(new Date(value).getTime())
  ) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireReference(
  artifactKind: DeepImprovementCommonArtifactKind,
  field: string,
  value: unknown,
): import('../sealed-reference-artifacts/index.js').SealedArtifactReference {
  try {
    return parseSealedArtifactReference(value);
  } catch {
    return invalidMaterial(artifactKind, field);
  }
}

function requireReferenceArray(
  artifactKind: DeepImprovementCommonArtifactKind,
  field: string,
  value: unknown,
  requireNonEmpty = false,
): readonly import('../sealed-reference-artifacts/index.js').SealedArtifactReference[] {
  if (
    !Array.isArray(value)
    || value.length > MAX_REFERENCES
    || (requireNonEmpty && value.length === 0)
  ) {
    return invalidMaterial(artifactKind, field);
  }
  const references = value.map((entry, index) => requireReference(
    artifactKind,
    `${field}[${index}]`,
    entry,
  ));
  const unique = new Set(references.map((reference) => reference.qualified_digest));
  if (unique.size !== references.length) return invalidMaterial(artifactKind, field);
  return Object.freeze(references);
}

function requireLocator(
  artifactKind: DeepImprovementCommonArtifactKind,
  value: unknown,
): DeepImprovementCommonArtifactLocator {
  const locator = requireRecord(artifactKind, value, LOCATOR_FIELDS);
  const scheme = requireEnum(artifactKind, 'locator.scheme', locator.scheme, [
    'artifact',
    'file',
    'ledger',
    'url',
  ] as const);
  if (
    typeof locator.selector !== 'string'
    || locator.selector.length === 0
    || locator.selector.length > 256
    || !SELECTOR_PATTERN.test(locator.selector)
    || (locator.selector.match(/\s/gu)?.length ?? 0) > MAX_SPACES_IN_SELECTOR
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

function requireEventBinding(
  artifactKind: DeepImprovementCommonArtifactKind,
  value: unknown,
): DeepImprovementCommonArtifactEventBinding {
  const event = requireRecord(artifactKind, value, EVENT_FIELDS);
  return Object.freeze({
    eventStem: requireEnum(
      artifactKind,
      'originEvent.eventStem',
      event.eventStem,
      Array.from(EVENT_STEM_SET) as DeepImprovementCommonEventStem[],
    ),
    eventId: requireToken(artifactKind, 'originEvent.eventId', event.eventId),
    payloadDigest: requireDigest(artifactKind, 'originEvent.payloadDigest', event.payloadDigest),
  });
}

function requireDependencies(
  artifactKind: DeepImprovementCommonArtifactKind,
  value: unknown,
): readonly DeepImprovementCommonArtifactDependency[] {
  if (!Array.isArray(value) || value.length > MAX_DEPENDENCIES) {
    return invalidMaterial(artifactKind, 'dependencyReferences');
  }
  const seen = new Set<string>();
  const dependencies = value.map((entry, index) => {
    const dependency = requireRecord(artifactKind, entry, DEPENDENCY_FIELDS);
    const reference = requireReference(
      artifactKind,
      `dependencyReferences[${index}].reference`,
      dependency.reference,
    );
    if (seen.has(reference.qualified_digest)) {
      return invalidMaterial(artifactKind, 'dependencyReferences');
    }
    seen.add(reference.qualified_digest);
    return Object.freeze({
      purpose: requireToken(artifactKind, `dependencyReferences[${index}].purpose`, dependency.purpose),
      reference,
    });
  });
  return Object.freeze(dependencies);
}

function requireDependencyCoverage(
  artifactKind: DeepImprovementCommonArtifactKind,
  dependencies: readonly DeepImprovementCommonArtifactDependency[],
  references: readonly import('../sealed-reference-artifacts/index.js').SealedArtifactReference[],
  field: string,
): void {
  const dependencyDigests = new Set(
    dependencies.map((dependency) => dependency.reference.qualified_digest),
  );
  if (references.some((reference) => !dependencyDigests.has(reference.qualified_digest))) {
    return invalidMaterial(artifactKind, field);
  }
}

function requireBase(
  artifactKind: DeepImprovementCommonArtifactKind,
  value: Record<string, unknown>,
): DeepImprovementCommonArtifactBaseMaterial {
  return Object.freeze({
    schemaVersion: requireEnum(
      artifactKind,
      'schemaVersion',
      value.schemaVersion,
      [DEEP_IMPROVEMENT_COMMON_ARTIFACT_SCHEMA_VERSION] as const,
    ),
    artifactId: requireToken(artifactKind, 'artifactId', value.artifactId),
    dependencyReferences: requireDependencies(artifactKind, value.dependencyReferences),
    originEvent: requireEventBinding(artifactKind, value.originEvent),
    producerVersion: requireToken(artifactKind, 'producerVersion', value.producerVersion),
    locator: requireLocator(artifactKind, value.locator),
  });
}

function requireDigestArray(
  artifactKind: DeepImprovementCommonArtifactKind,
  field: string,
  value: unknown,
): readonly string[] {
  if (
    !Array.isArray(value)
    || value.length > MAX_REFERENCES
    || !value.every((entry) => typeof entry === 'string' && DIGEST_PATTERN.test(entry))
  ) {
    return invalidMaterial(artifactKind, field);
  }
  const unique = new Set(value);
  if (unique.size !== value.length) return invalidMaterial(artifactKind, field);
  return Object.freeze([...value]);
}

function requireVisibilityPolicy(
  artifactKind: DeepImprovementCommonArtifactKind,
  value: unknown,
): DeepImprovementVisibilityPolicy {
  const policy = requireRecord(artifactKind, value, VISIBILITY_FIELDS);
  return Object.freeze({
    candidateView: requireEnum(
      artifactKind,
      'visibilityPolicy.candidateView',
      policy.candidateView,
      ['commitment-only', 'verdict-band'] as const,
    ),
    hiddenFixtures: requireEnum(
      artifactKind,
      'visibilityPolicy.hiddenFixtures',
      policy.hiddenFixtures,
      ['withheld'] as const,
    ),
    exactScores: requireEnum(
      artifactKind,
      'visibilityPolicy.exactScores',
      policy.exactScores,
      ['withheld'] as const,
    ),
    evaluatorInternals: requireEnum(
      artifactKind,
      'visibilityPolicy.evaluatorInternals',
      policy.evaluatorInternals,
      ['withheld'] as const,
    ),
    terminalEvidence: requireEnum(
      artifactKind,
      'visibilityPolicy.terminalEvidence',
      policy.terminalEvidence,
      ['withheld'] as const,
    ),
  });
}

function requireBudgetPolicy(
  artifactKind: DeepImprovementCommonArtifactKind,
  value: unknown,
): DeepImprovementBudgetPolicy {
  const policy = requireRecord(artifactKind, value, BUDGET_FIELDS);
  return Object.freeze({
    maxQueries: requireUint32(artifactKind, 'budgetPolicy.maxQueries', policy.maxQueries),
    maxBytes: requireUint32(artifactKind, 'budgetPolicy.maxBytes', policy.maxBytes),
    maxWallClockMs: requireUint32(
      artifactKind,
      'budgetPolicy.maxWallClockMs',
      policy.maxWallClockMs,
    ),
    maxCostMicros: requireUint32(artifactKind, 'budgetPolicy.maxCostMicros', policy.maxCostMicros),
  });
}

function requireScoreVector(
  artifactKind: DeepImprovementCommonArtifactKind,
  value: unknown,
): DeepImprovementScoreVector {
  const vector = requireRecord(artifactKind, value, SCORE_VECTOR_FIELDS);
  if (!Array.isArray(vector.components) || vector.components.length === 0) {
    return invalidMaterial(artifactKind, 'rawScoreVector.components');
  }
  if (vector.components.length > MAX_SCORE_COMPONENTS) {
    return invalidMaterial(artifactKind, 'rawScoreVector.components');
  }
  const dimensions = new Set<string>();
  const components: DeepImprovementScoreComponent[] = vector.components.map((entry, index) => {
    const component = requireRecord(
      artifactKind,
      entry,
      SCORE_COMPONENT_FIELDS,
    );
    const dimensionCode = requireCode(
      artifactKind,
      `rawScoreVector.components[${index}].dimensionCode`,
      component.dimensionCode,
    );
    if (dimensions.has(dimensionCode)) {
      return invalidMaterial(artifactKind, 'rawScoreVector.components');
    }
    dimensions.add(dimensionCode);
    return Object.freeze({
      dimensionCode,
      rawScore: requireScore(
        artifactKind,
        `rawScoreVector.components[${index}].rawScore`,
        component.rawScore,
      ),
      normalizedScore: requireRatio(
        artifactKind,
        `rawScoreVector.components[${index}].normalizedScore`,
        component.normalizedScore,
      ),
      weight: requireRatio(
        artifactKind,
        `rawScoreVector.components[${index}].weight`,
        component.weight,
      ),
    });
  });
  return Object.freeze({
    components: Object.freeze(components),
    aggregateScore: requireScore(artifactKind, 'rawScoreVector.aggregateScore', vector.aggregateScore),
    uncertainty: requireRatio(artifactKind, 'rawScoreVector.uncertainty', vector.uncertainty),
  });
}

function requireCaseObservations(
  artifactKind: DeepImprovementCommonArtifactKind,
  value: unknown,
): readonly DeepImprovementRawTrialCaseObservation[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_REFERENCES) {
    return invalidMaterial(artifactKind, 'caseObservations');
  }
  const cases = new Set<string>();
  const observations = value.map((entry, index) => {
    const observation = requireRecord(artifactKind, entry, CASE_OBSERVATION_FIELDS);
    const caseId = requireToken(artifactKind, `caseObservations[${index}].caseId`, observation.caseId);
    if (cases.has(caseId)) return invalidMaterial(artifactKind, 'caseObservations');
    cases.add(caseId);
    return Object.freeze({
      caseId,
      outputDigest: requireDigest(
        artifactKind,
        `caseObservations[${index}].outputDigest`,
        observation.outputDigest,
      ),
      outputReference: requireReference(
        artifactKind,
        `caseObservations[${index}].outputReference`,
        observation.outputReference,
      ),
      scoreVectorDigest: requireDigest(
        artifactKind,
        `caseObservations[${index}].scoreVectorDigest`,
        observation.scoreVectorDigest,
      ),
    });
  });
  return Object.freeze(observations);
}

function requireUsage(
  artifactKind: DeepImprovementCommonArtifactKind,
  value: unknown,
): DeepImprovementUsageObservation {
  const usage = requireRecord(artifactKind, value, USAGE_FIELDS);
  const parsed = Object.freeze({
    inputTokens: requireUint32(artifactKind, 'usage.inputTokens', usage.inputTokens),
    outputTokens: requireUint32(artifactKind, 'usage.outputTokens', usage.outputTokens),
    totalTokens: requireUint32(artifactKind, 'usage.totalTokens', usage.totalTokens),
    costMicros: requireUint32(artifactKind, 'usage.costMicros', usage.costMicros),
    latencyMs: requireUint32(artifactKind, 'usage.latencyMs', usage.latencyMs),
  });
  if (parsed.inputTokens + parsed.outputTokens !== parsed.totalTokens) {
    return invalidMaterial(artifactKind, 'usage.totalTokens');
  }
  return parsed;
}

function requireIntegrityObservations(
  artifactKind: DeepImprovementCommonArtifactKind,
  value: unknown,
): readonly DeepImprovementIntegrityObservation[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_REFERENCES) {
    return invalidMaterial(artifactKind, 'integrityObservations');
  }
  return Object.freeze(value.map((entry, index) => {
    const observation = requireRecord(artifactKind, entry, INTEGRITY_FIELDS);
    return Object.freeze({
      status: requireEnum(
        artifactKind,
        `integrityObservations[${index}].status`,
        observation.status,
        ['confirmed', 'disputed', 'inconclusive'] as const,
      ),
      detectorDigest: requireDigest(
        artifactKind,
        `integrityObservations[${index}].detectorDigest`,
        observation.detectorDigest,
      ),
      evidenceDigest: requireDigest(
        artifactKind,
        `integrityObservations[${index}].evidenceDigest`,
        observation.evidenceDigest,
      ),
    });
  }));
}

function requireLeakagePolicy(
  artifactKind: DeepImprovementCommonArtifactKind,
  value: unknown,
): DeepImprovementLeakagePolicy {
  const policy = requireRecord(artifactKind, value, LEAKAGE_FIELDS);
  return Object.freeze({
    literalLeakDetection: requireEnum(
      artifactKind,
      'leakagePolicy.literalLeakDetection',
      policy.literalLeakDetection,
      ['required'] as const,
    ),
    semanticLeakDetection: requireEnum(
      artifactKind,
      'leakagePolicy.semanticLeakDetection',
      policy.semanticLeakDetection,
      ['required'] as const,
    ),
    candidateVisibleContent: requireEnum(
      artifactKind,
      'leakagePolicy.candidateVisibleContent',
      policy.candidateVisibleContent,
      ['withheld'] as const,
    ),
  });
}

function parseEvaluatorCapsule(
  artifactKind: typeof DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
  input: unknown,
): DeepImprovementEvaluatorCapsuleMaterial {
  const value = requireRecord(artifactKind, input, [
    ...BASE_FIELDS,
    'evaluatorEpochId',
    'evaluatorImplementationDigest',
    'evaluatorSchemaDigest',
    'rubricDigest',
    'policyDigest',
    'fixtureManifestDigest',
    'hiddenAnchorCommitmentDigest',
    'calibrationDigest',
    'normalizationDigest',
    'environmentDigest',
    'capabilityDigest',
    'visibilityPolicy',
    'budgetPolicy',
  ]);
  const base = requireBase(artifactKind, value);
  return Object.freeze({
    ...base,
    evaluatorEpochId: requireToken(artifactKind, 'evaluatorEpochId', value.evaluatorEpochId),
    evaluatorImplementationDigest: requireDigest(
      artifactKind,
      'evaluatorImplementationDigest',
      value.evaluatorImplementationDigest,
    ),
    evaluatorSchemaDigest: requireDigest(artifactKind, 'evaluatorSchemaDigest', value.evaluatorSchemaDigest),
    rubricDigest: requireDigest(artifactKind, 'rubricDigest', value.rubricDigest),
    policyDigest: requireDigest(artifactKind, 'policyDigest', value.policyDigest),
    fixtureManifestDigest: requireDigest(artifactKind, 'fixtureManifestDigest', value.fixtureManifestDigest),
    hiddenAnchorCommitmentDigest: requireDigest(
      artifactKind,
      'hiddenAnchorCommitmentDigest',
      value.hiddenAnchorCommitmentDigest,
    ),
    calibrationDigest: requireDigest(artifactKind, 'calibrationDigest', value.calibrationDigest),
    normalizationDigest: requireDigest(artifactKind, 'normalizationDigest', value.normalizationDigest),
    environmentDigest: requireDigest(artifactKind, 'environmentDigest', value.environmentDigest),
    capabilityDigest: requireDigest(artifactKind, 'capabilityDigest', value.capabilityDigest),
    visibilityPolicy: requireVisibilityPolicy(artifactKind, value.visibilityPolicy),
    budgetPolicy: requireBudgetPolicy(artifactKind, value.budgetPolicy),
  });
}

function parseCandidateInput(
  artifactKind: typeof DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT,
  input: unknown,
): DeepImprovementCandidateInputMaterial {
  const value = requireRecord(artifactKind, input, [
    ...BASE_FIELDS,
    'candidateId',
    'lineageId',
    'evaluatorEpochId',
    'parentCandidateReference',
    'mutationOperatorReference',
    'mutationOperatorVersion',
    'profileScopeDigest',
    'modelConfigurationDigest',
    'promptConfigurationDigest',
    'toolConfigurationDigest',
    'selectedFixtureManifestDigest',
    'seed',
    'sourceArtifactReferences',
  ]);
  const base = requireBase(artifactKind, value);
  const parentReference = value.parentCandidateReference === null
    ? null
    : requireReference(artifactKind, 'parentCandidateReference', value.parentCandidateReference);
  const sourceReferences = requireReferenceArray(
    artifactKind,
    'sourceArtifactReferences',
    value.sourceArtifactReferences,
    true,
  );
  requireDependencyCoverage(
    artifactKind,
    base.dependencyReferences,
    parentReference === null ? sourceReferences : [parentReference, ...sourceReferences],
    'dependencyReferences',
  );
  return Object.freeze({
    ...base,
    candidateId: requireToken(artifactKind, 'candidateId', value.candidateId),
    lineageId: requireToken(artifactKind, 'lineageId', value.lineageId),
    evaluatorEpochId: requireToken(artifactKind, 'evaluatorEpochId', value.evaluatorEpochId),
    parentCandidateReference: parentReference,
    mutationOperatorReference: requireToken(
      artifactKind,
      'mutationOperatorReference',
      value.mutationOperatorReference,
    ),
    mutationOperatorVersion: requireToken(
      artifactKind,
      'mutationOperatorVersion',
      value.mutationOperatorVersion,
    ),
    profileScopeDigest: requireDigest(artifactKind, 'profileScopeDigest', value.profileScopeDigest),
    modelConfigurationDigest: requireDigest(
      artifactKind,
      'modelConfigurationDigest',
      value.modelConfigurationDigest,
    ),
    promptConfigurationDigest: requireDigest(
      artifactKind,
      'promptConfigurationDigest',
      value.promptConfigurationDigest,
    ),
    toolConfigurationDigest: requireDigest(
      artifactKind,
      'toolConfigurationDigest',
      value.toolConfigurationDigest,
    ),
    selectedFixtureManifestDigest: requireDigest(
      artifactKind,
      'selectedFixtureManifestDigest',
      value.selectedFixtureManifestDigest,
    ),
    seed: requireUint32(artifactKind, 'seed', value.seed),
    sourceArtifactReferences: sourceReferences,
  });
}

function parseBaselineInput(
  artifactKind: typeof DeepImprovementCommonArtifactKinds.BASELINE_INPUT,
  input: unknown,
): DeepImprovementBaselineInputMaterial {
  const value = requireRecord(artifactKind, input, [
    ...BASE_FIELDS,
    'baselineId',
    'lineageId',
    'evaluatorEpochId',
    'incumbentReference',
    'profileScopeDigest',
    'modelConfigurationDigest',
    'promptConfigurationDigest',
    'toolConfigurationDigest',
    'selectedFixtureManifestDigest',
    'seed',
    'sourceArtifactReferences',
  ]);
  const base = requireBase(artifactKind, value);
  const incumbentReference = requireReference(artifactKind, 'incumbentReference', value.incumbentReference);
  const sourceReferences = requireReferenceArray(
    artifactKind,
    'sourceArtifactReferences',
    value.sourceArtifactReferences,
    true,
  );
  requireDependencyCoverage(
    artifactKind,
    base.dependencyReferences,
    [incumbentReference, ...sourceReferences],
    'dependencyReferences',
  );
  return Object.freeze({
    ...base,
    baselineId: requireToken(artifactKind, 'baselineId', value.baselineId),
    lineageId: requireToken(artifactKind, 'lineageId', value.lineageId),
    evaluatorEpochId: requireToken(artifactKind, 'evaluatorEpochId', value.evaluatorEpochId),
    incumbentReference,
    profileScopeDigest: requireDigest(artifactKind, 'profileScopeDigest', value.profileScopeDigest),
    modelConfigurationDigest: requireDigest(
      artifactKind,
      'modelConfigurationDigest',
      value.modelConfigurationDigest,
    ),
    promptConfigurationDigest: requireDigest(
      artifactKind,
      'promptConfigurationDigest',
      value.promptConfigurationDigest,
    ),
    toolConfigurationDigest: requireDigest(
      artifactKind,
      'toolConfigurationDigest',
      value.toolConfigurationDigest,
    ),
    selectedFixtureManifestDigest: requireDigest(
      artifactKind,
      'selectedFixtureManifestDigest',
      value.selectedFixtureManifestDigest,
    ),
    seed: requireUint32(artifactKind, 'seed', value.seed),
    sourceArtifactReferences: sourceReferences,
  });
}

function parseRawTrialOutput(
  artifactKind: typeof DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT,
  input: unknown,
): DeepImprovementRawTrialOutputMaterial {
  const value = requireRecord(artifactKind, input, [
    ...BASE_FIELDS,
    'trialId',
    'candidateInputReference',
    'baselineInputReference',
    'evaluatorCapsuleReference',
    'evaluationEpochId',
    'fixtureId',
    'caseObservations',
    'rawScoreVector',
    'traceReferences',
    'usage',
    'executionEnvironmentDigest',
    'integrityObservations',
    'normalizationVersion',
  ]);
  const base = requireBase(artifactKind, value);
  const candidateInputReference = requireReference(
    artifactKind,
    'candidateInputReference',
    value.candidateInputReference,
  );
  const baselineInputReference = requireReference(
    artifactKind,
    'baselineInputReference',
    value.baselineInputReference,
  );
  const evaluatorCapsuleReference = requireReference(
    artifactKind,
    'evaluatorCapsuleReference',
    value.evaluatorCapsuleReference,
  );
  const caseObservations = requireCaseObservations(artifactKind, value.caseObservations);
  const traceReferences = requireReferenceArray(artifactKind, 'traceReferences', value.traceReferences, true);
  const dependencyReferences = [
    candidateInputReference,
    baselineInputReference,
    evaluatorCapsuleReference,
    ...caseObservations.map((observation) => observation.outputReference),
    ...traceReferences,
  ];
  requireDependencyCoverage(artifactKind, base.dependencyReferences, dependencyReferences, 'dependencyReferences');
  return Object.freeze({
    ...base,
    trialId: requireToken(artifactKind, 'trialId', value.trialId),
    candidateInputReference,
    baselineInputReference,
    evaluatorCapsuleReference,
    evaluationEpochId: requireToken(artifactKind, 'evaluationEpochId', value.evaluationEpochId),
    fixtureId: requireToken(artifactKind, 'fixtureId', value.fixtureId),
    caseObservations,
    rawScoreVector: requireScoreVector(artifactKind, value.rawScoreVector),
    traceReferences,
    usage: requireUsage(artifactKind, value.usage),
    executionEnvironmentDigest: requireDigest(
      artifactKind,
      'executionEnvironmentDigest',
      value.executionEnvironmentDigest,
    ),
    integrityObservations: requireIntegrityObservations(
      artifactKind,
      value.integrityObservations,
    ),
    normalizationVersion: requireToken(
      artifactKind,
      'normalizationVersion',
      value.normalizationVersion,
    ),
  });
}

function parseCanaryEpoch(
  artifactKind: typeof DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
  input: unknown,
): DeepImprovementCanaryEpochMaterial {
  const value = requireRecord(artifactKind, input, [
    ...BASE_FIELDS,
    'canaryEpochId',
    'evaluatorEpochId',
    'suiteId',
    'lifecycle',
    'suiteManifestDigest',
    'hiddenAnchorCommitmentDigest',
    'adversarialSuiteDigest',
    'metamorphicSuiteDigest',
    'crossDomainSuiteDigest',
    'leakagePolicy',
    'freshnessWindowSeconds',
    'sealedAt',
    'expiresAt',
    'supersedesReference',
  ]);
  const base = requireBase(artifactKind, value);
  const sealedAt = requireTimestamp(artifactKind, 'sealedAt', value.sealedAt);
  const expiresAt = requireTimestamp(artifactKind, 'expiresAt', value.expiresAt);
  if (new Date(expiresAt).getTime() <= new Date(sealedAt).getTime()) {
    return invalidMaterial(artifactKind, 'expiresAt');
  }
  const supersedesReference = value.supersedesReference === null
    ? null
    : requireReference(artifactKind, 'supersedesReference', value.supersedesReference);
  requireDependencyCoverage(
    artifactKind,
    base.dependencyReferences,
    supersedesReference === null ? [] : [supersedesReference],
    'dependencyReferences',
  );
  return Object.freeze({
    ...base,
    canaryEpochId: requireToken(artifactKind, 'canaryEpochId', value.canaryEpochId),
    evaluatorEpochId: requireToken(artifactKind, 'evaluatorEpochId', value.evaluatorEpochId),
    suiteId: requireToken(artifactKind, 'suiteId', value.suiteId),
    lifecycle: requireEnum(
      artifactKind,
      'lifecycle',
      value.lifecycle,
      ['active', 'burned', 'retired', 'sealed'] as const,
    ),
    suiteManifestDigest: requireDigest(artifactKind, 'suiteManifestDigest', value.suiteManifestDigest),
    hiddenAnchorCommitmentDigest: requireDigest(
      artifactKind,
      'hiddenAnchorCommitmentDigest',
      value.hiddenAnchorCommitmentDigest,
    ),
    adversarialSuiteDigest: requireDigest(artifactKind, 'adversarialSuiteDigest', value.adversarialSuiteDigest),
    metamorphicSuiteDigest: requireDigest(artifactKind, 'metamorphicSuiteDigest', value.metamorphicSuiteDigest),
    crossDomainSuiteDigest: requireDigest(artifactKind, 'crossDomainSuiteDigest', value.crossDomainSuiteDigest),
    leakagePolicy: requireLeakagePolicy(artifactKind, value.leakagePolicy),
    freshnessWindowSeconds: requireUint32(
      artifactKind,
      'freshnessWindowSeconds',
      value.freshnessWindowSeconds,
    ),
    sealedAt,
    expiresAt,
    supersedesReference,
  });
}

function parsePromotionEvidence(
  artifactKind: typeof DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE,
  input: unknown,
): DeepImprovementPromotionEvidenceMaterial {
  const value = requireRecord(artifactKind, input, [
    ...BASE_FIELDS,
    'promotionId',
    'evaluatorEpochId',
    'candidateInputReference',
    'baselineInputReference',
    'evaluatorCapsuleReference',
    'canaryEpochReference',
    'targetRepairEvidenceReference',
    'baselinePreservationEvidenceReference',
    'criticalDimensionEvidenceReference',
    'evaluatorIntegrityEvidenceReference',
    'canaryOutcomeEvidenceReference',
    'uncertaintyEvidenceReference',
    'costEvidenceReference',
    'rollbackTargetReference',
    'targetRepair',
    'baselinePreservation',
    'criticalDimensions',
    'evaluatorIntegrity',
    'canaryOutcome',
    'uncertaintyLowerBound',
    'uncertaintyThreshold',
    'costMicros',
    'costLimitMicros',
    'unresolvedEvidenceDigests',
    'vetoEvidenceDigests',
    'admissibility',
  ]);
  const base = requireBase(artifactKind, value);
  const requiredReferences = [
    'candidateInputReference',
    'baselineInputReference',
    'evaluatorCapsuleReference',
    'canaryEpochReference',
    'targetRepairEvidenceReference',
    'baselinePreservationEvidenceReference',
    'criticalDimensionEvidenceReference',
    'evaluatorIntegrityEvidenceReference',
    'canaryOutcomeEvidenceReference',
    'uncertaintyEvidenceReference',
    'costEvidenceReference',
    'rollbackTargetReference',
  ].map((field) => requireReference(artifactKind, field, value[field]));
  requireDependencyCoverage(artifactKind, base.dependencyReferences, requiredReferences, 'dependencyReferences');
  const result: DeepImprovementPromotionEvidenceMaterial = Object.freeze({
    ...base,
    promotionId: requireToken(artifactKind, 'promotionId', value.promotionId),
    evaluatorEpochId: requireToken(artifactKind, 'evaluatorEpochId', value.evaluatorEpochId),
    candidateInputReference: requiredReferences[0]!,
    baselineInputReference: requiredReferences[1]!,
    evaluatorCapsuleReference: requiredReferences[2]!,
    canaryEpochReference: requiredReferences[3]!,
    targetRepairEvidenceReference: requiredReferences[4]!,
    baselinePreservationEvidenceReference: requiredReferences[5]!,
    criticalDimensionEvidenceReference: requiredReferences[6]!,
    evaluatorIntegrityEvidenceReference: requiredReferences[7]!,
    canaryOutcomeEvidenceReference: requiredReferences[8]!,
    uncertaintyEvidenceReference: requiredReferences[9]!,
    costEvidenceReference: requiredReferences[10]!,
    rollbackTargetReference: requiredReferences[11]!,
    targetRepair: requireEnum(artifactKind, 'targetRepair', value.targetRepair, [
      'fail',
      'inconclusive',
      'pass',
    ] as const),
    baselinePreservation: requireEnum(artifactKind, 'baselinePreservation', value.baselinePreservation, [
      'fail',
      'inconclusive',
      'pass',
    ] as const),
    criticalDimensions: requireEnum(artifactKind, 'criticalDimensions', value.criticalDimensions, [
      'fail',
      'inconclusive',
      'pass',
    ] as const),
    evaluatorIntegrity: requireEnum(artifactKind, 'evaluatorIntegrity', value.evaluatorIntegrity, [
      'fail',
      'inconclusive',
      'pass',
    ] as const),
    canaryOutcome: requireEnum(artifactKind, 'canaryOutcome', value.canaryOutcome, [
      'fail',
      'inconclusive',
      'pass',
    ] as const),
    uncertaintyLowerBound: requireRatio(
      artifactKind,
      'uncertaintyLowerBound',
      value.uncertaintyLowerBound,
    ),
    uncertaintyThreshold: requireRatio(
      artifactKind,
      'uncertaintyThreshold',
      value.uncertaintyThreshold,
    ),
    costMicros: requireUint32(artifactKind, 'costMicros', value.costMicros),
    costLimitMicros: requireUint32(artifactKind, 'costLimitMicros', value.costLimitMicros),
    unresolvedEvidenceDigests: requireDigestArray(
      artifactKind,
      'unresolvedEvidenceDigests',
      value.unresolvedEvidenceDigests,
    ),
    vetoEvidenceDigests: requireDigestArray(
      artifactKind,
      'vetoEvidenceDigests',
      value.vetoEvidenceDigests,
    ),
    admissibility: requireEnum(artifactKind, 'admissibility', value.admissibility, [
      'eligible',
      'ineligible',
    ] as const),
  });
  if (
    result.admissibility === 'eligible'
    && (
      result.targetRepair !== 'pass'
      || result.baselinePreservation !== 'pass'
      || result.criticalDimensions !== 'pass'
      || result.evaluatorIntegrity !== 'pass'
      || result.canaryOutcome !== 'pass'
      || result.uncertaintyLowerBound < result.uncertaintyThreshold
      || result.costMicros > result.costLimitMicros
      || result.unresolvedEvidenceDigests.length > 0
      || result.vetoEvidenceDigests.length > 0
    )
  ) {
    return invalidMaterial(artifactKind, 'admissibility');
  }
  return result;
}

function canonicalizeDeepImprovementMaterial(
  artifactKind: DeepImprovementCommonArtifactKind,
  input: unknown,
): Uint8Array {
  let material: DeepImprovementCommonArtifactMaterial;
  switch (artifactKind) {
    case DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE:
      material = parseEvaluatorCapsule(artifactKind, input);
      break;
    case DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT:
      material = parseCandidateInput(artifactKind, input);
      break;
    case DeepImprovementCommonArtifactKinds.BASELINE_INPUT:
      material = parseBaselineInput(artifactKind, input);
      break;
    case DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT:
      material = parseRawTrialOutput(artifactKind, input);
      break;
    case DeepImprovementCommonArtifactKinds.CANARY_EPOCH:
      material = parseCanaryEpoch(artifactKind, input);
      break;
    case DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE:
      material = parsePromotionEvidence(artifactKind, input);
      break;
    default:
      return unsupportedArtifactKind(artifactKind);
  }
  return Uint8Array.from(canonicalBytes({ artifactKind, material }));
}

export function createDeepImprovementCommonArtifactCanonicalizerRegistry():
  ArtifactCanonicalizerRegistry {
  const initialRegistry = createArtifactCanonicalizerRegistry();
  const initialDefinitions: ArtifactCanonicalizerDefinition[] = Object.values(InitialArtifactKinds)
    .map((artifactKind) => ({
      artifactKind,
      canonicalizationVersion: 'deep-loop-json@1',
      mediaType: 'application/json',
      implementationIdentity: 'deep-loop-canonical-json-v1',
      canonicalize: (input: unknown): Uint8Array => (
        initialRegistry.canonicalize(artifactKind, 'deep-loop-json@1', input).bytes
      ),
    }));
  const definitions: ArtifactCanonicalizerDefinition[] = [
    ...initialDefinitions,
    ...DEEP_IMPROVEMENT_COMMON_ARTIFACT_KIND_REGISTRY.map((entry) => ({
      artifactKind: entry.artifactKind,
      canonicalizationVersion: entry.canonicalizationVersion,
      mediaType: entry.mediaType,
      implementationIdentity: 'deep-improvement-common-binding-canonicalizer-v1',
      canonicalize: (input: unknown): Uint8Array => (
        canonicalizeDeepImprovementMaterial(entry.artifactKind, input)
      ),
    })),
  ];
  return new ArtifactCanonicalizerRegistry(definitions);
}

export function parseDeepImprovementCommonArtifactMaterial<TKind extends DeepImprovementCommonArtifactKind>(
  artifactKind: TKind,
  input: unknown,
): DeepImprovementCommonArtifactMaterialByKind[TKind] {
  if (!KIND_SET.has(artifactKind)) return invalidMaterial(artifactKind, 'artifactKind');
  switch (artifactKind) {
    case DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE:
      return parseEvaluatorCapsule(artifactKind, input) as DeepImprovementCommonArtifactMaterialByKind[TKind];
    case DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT:
      return parseCandidateInput(artifactKind, input) as DeepImprovementCommonArtifactMaterialByKind[TKind];
    case DeepImprovementCommonArtifactKinds.BASELINE_INPUT:
      return parseBaselineInput(artifactKind, input) as DeepImprovementCommonArtifactMaterialByKind[TKind];
    case DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT:
      return parseRawTrialOutput(artifactKind, input) as DeepImprovementCommonArtifactMaterialByKind[TKind];
    case DeepImprovementCommonArtifactKinds.CANARY_EPOCH:
      return parseCanaryEpoch(artifactKind, input) as DeepImprovementCommonArtifactMaterialByKind[TKind];
    case DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE:
      return parsePromotionEvidence(artifactKind, input) as DeepImprovementCommonArtifactMaterialByKind[TKind];
    default:
      return unsupportedArtifactKind(artifactKind);
  }
}

export function isDeepImprovementCommonArtifactKind(
  value: string,
): value is DeepImprovementCommonArtifactKind {
  return KIND_SET.has(value);
}
