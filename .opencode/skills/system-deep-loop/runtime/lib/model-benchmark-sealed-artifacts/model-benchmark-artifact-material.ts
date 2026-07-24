// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Artifact Material
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes } from '../event-envelope/index.js';
import {
  ArtifactCanonicalizerRegistry,
  InitialArtifactKinds,
  SealedArtifactError,
  SealedArtifactErrorCodes,
  createArtifactCanonicalizerRegistry,
  parseSealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import {
  DeepImprovementCommonArtifactKinds,
  createDeepImprovementCommonArtifactCanonicalizerRegistry,
  DEEP_IMPROVEMENT_COMMON_ARTIFACT_CANONICALIZATION_VERSION,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import { ModelBenchmarkEventStems } from '../model-benchmark-ledger-schema/index.js';
import { ModelBenchmarkArtifactKinds } from './model-benchmark-sealed-artifact-types.js';

import type {
  ArtifactCanonicalizerDefinition,
} from '../sealed-reference-artifacts/index.js';
import type {
  ModelBenchmarkArtifactBaseMaterial,
  ModelBenchmarkArtifactDependency,
  ModelBenchmarkArtifactEventBinding,
  ModelBenchmarkArtifactKind,
  ModelBenchmarkArtifactKindRegistration,
  ModelBenchmarkArtifactLocator,
  ModelBenchmarkArtifactMaterial,
  ModelBenchmarkArtifactMaterialByKind,
  ModelBenchmarkAdaptiveDiagnosticSelectionArtifactMaterial,
  ModelBenchmarkCommonAnchorSelectionArtifactMaterial,
  ModelBenchmarkContaminationLineageArtifactMaterial,
  ModelBenchmarkLatencyEvidence,
  ModelBenchmarkMatrixMembership,
  ModelBenchmarkModelCellInputArtifactMaterial,
  ModelBenchmarkRawCellOutputArtifactMaterial,
  ModelBenchmarkRecipeArtifactMaterial,
  ModelBenchmarkRunManifestArtifactMaterial,
  ModelBenchmarkScoringMatrixArtifactMaterial,
  ModelBenchmarkSelectionEvidenceArtifactMaterial,
  ModelBenchmarkUsageEvidence,
  ModelBenchmarkValidityEvidenceArtifactMaterial,
  ModelBenchmarkVisibilityPolicy,
  ModelBenchmarkWorkloadEvidenceArtifactMaterial,
} from './model-benchmark-sealed-artifact-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. REGISTRY
// ───────────────────────────────────────────────────────────────────

export const MODEL_BENCHMARK_ARTIFACT_SCHEMA_VERSION =
  'model-benchmark-artifact@1';
export const MODEL_BENCHMARK_ARTIFACT_CANONICALIZATION_VERSION =
  'model-benchmark-binding@1';
export const MODEL_BENCHMARK_ARTIFACT_MEDIA_TYPE =
  'application/vnd.openai.model-benchmark-binding+json';

const REGISTRY_ROWS = [
  [ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE, 'recipe', 'recipe'],
  [ModelBenchmarkArtifactKinds.RUN_MANIFEST, 'run', 'run'],
  [ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT, 'cell', 'matrix'],
  [ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT, 'cell', 'matrix'],
  [ModelBenchmarkArtifactKinds.SCORING_MATRIX, 'scoring', 'scoring'],
  [ModelBenchmarkArtifactKinds.COMMON_ANCHOR_SELECTION, 'evidence', 'selection'],
  [ModelBenchmarkArtifactKinds.ADAPTIVE_DIAGNOSTIC_SELECTION, 'evidence', 'diagnostic'],
  [ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE, 'evidence', 'validity'],
  [ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE, 'evidence', 'contamination'],
  [ModelBenchmarkArtifactKinds.WORKLOAD_EVIDENCE, 'evidence', 'workload'],
  [ModelBenchmarkArtifactKinds.SELECTION_EVIDENCE, 'scoring', 'selection'],
] as const;

export const MODEL_BENCHMARK_ARTIFACT_KIND_REGISTRY:
  readonly ModelBenchmarkArtifactKindRegistration[] = Object.freeze(
    REGISTRY_ROWS.map(([artifactKind, lifecycle, materialFamily]) => Object.freeze({
      artifactKind,
      lifecycle,
      materialFamily,
      canonicalizationVersion: MODEL_BENCHMARK_ARTIFACT_CANONICALIZATION_VERSION,
      mediaType: MODEL_BENCHMARK_ARTIFACT_MEDIA_TYPE,
    })),
  );

// ───────────────────────────────────────────────────────────────────
// 2. CLOSED FIELD VALIDATION
// ───────────────────────────────────────────────────────────────────

const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;
const CODE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._/@-]{0,127}$/;
const SELECTOR_PATTERN = /^(?:#[A-Za-z0-9_-]+|[A-Za-z][A-Za-z0-9_-]*(?::[A-Za-z0-9._/#:@?=&%+\-]+)?|\/[A-Za-z0-9._~:/?#\[\]@!$&'()*+,;=%+\-]+)$/u;
const MAX_DEPENDENCIES = 128;
const MAX_REFERENCES = 256;
const MAX_DIGESTS = 256;
const MAX_SELECTOR_SPACES = 16;

const BASE_FIELDS = [
  'schemaVersion',
  'artifactId',
  'evaluatorEpochId',
  'visibility',
  'dependencyReferences',
  'originEvent',
  'producerVersion',
  'locator',
  'freshnessExpiresAt',
] as const;
const LOCATOR_FIELDS = ['scheme', 'locatorDigest', 'selector', 'revision'] as const;
const DEPENDENCY_FIELDS = ['purpose', 'reference'] as const;
const EVENT_FIELDS = ['eventStem', 'eventId', 'payloadDigest'] as const;
const VISIBILITY_POLICY_FIELDS = [
  'candidateView',
  'hiddenCaseContent',
  'exactScores',
  'protectedJudgeEvidence',
  'evaluatorInternals',
  'terminalEvidence',
] as const;
const USAGE_FIELDS = [
  'inputTokens',
  'outputTokens',
  'reasoningTokens',
  'cacheReadTokens',
  'cacheWriteTokens',
  'realizedCostMicros',
  'errorCostMicros',
  'abstentionCostMicros',
] as const;
const LATENCY_FIELDS = [
  'ttftMs',
  'interTokenP50Ms',
  'endToEndMs',
  'tailP95Ms',
  'throughputTokensPerSecond',
  'sloViolationCount',
] as const;
const MATRIX_MEMBERSHIP_FIELDS = [
  'matrixDigest',
  'modelId',
  'executorId',
  'taskFamilyId',
  'taskInstanceId',
  'anchorClass',
  'pairedBlockId',
  'trialMatrixKey',
] as const;
const TRIAL_MATRIX_KEY_FIELDS = [
  'candidateId',
  'modelFingerprint',
  'executionPath',
  'taskInstanceId',
  'taskFamilyId',
  'pairedBlockId',
  'protocolVariant',
  'seed',
  'perturbationId',
  'workloadProfileId',
  'promptRecipeFingerprint',
  'routeFingerprint',
  'frameworkFingerprint',
  'toolRecipeFingerprint',
  'attempt',
] as const;

function invalidMaterial(artifactKind: string, field: string): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.INVALID_INPUT,
    'canonicalization',
    'Model Benchmark artifact material violates its closed field contract',
    { artifactKind, field },
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
  const keys = Object.keys(value);
  return keys.length === expected.size && keys.every((key) => expected.has(key));
}

function requireRecord(
  artifactKind: ModelBenchmarkArtifactKind,
  input: unknown,
  fields: readonly string[],
): Record<string, unknown> {
  if (!isRecord(input) || !hasExactFields(input, fields)) {
    return invalidMaterial(artifactKind, 'shape');
  }
  return input;
}

function requireToken(
  artifactKind: ModelBenchmarkArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !TOKEN_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireCode(
  artifactKind: ModelBenchmarkArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !CODE_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireDigest(
  artifactKind: ModelBenchmarkArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !DIGEST_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireDigestArray(
  artifactKind: ModelBenchmarkArtifactKind,
  field: string,
  value: unknown,
  allowEmpty = false,
): readonly string[] {
  if (
    !Array.isArray(value)
    || value.length > MAX_DIGESTS
    || (!allowEmpty && value.length === 0)
    || !value.every((entry) => typeof entry === 'string' && DIGEST_PATTERN.test(entry))
  ) {
    return invalidMaterial(artifactKind, field);
  }
  return Object.freeze([...value]);
}

function requireTokenArray(
  artifactKind: ModelBenchmarkArtifactKind,
  field: string,
  value: unknown,
  allowEmpty = false,
): readonly string[] {
  if (
    !Array.isArray(value)
    || value.length > MAX_REFERENCES
    || (!allowEmpty && value.length === 0)
    || !value.every((entry) => typeof entry === 'string' && TOKEN_PATTERN.test(entry))
  ) {
    return invalidMaterial(artifactKind, field);
  }
  return Object.freeze([...value]);
}

function requireReference(
  artifactKind: ModelBenchmarkArtifactKind,
  field: string,
  value: unknown,
): import('../sealed-reference-artifacts/index.js').SealedArtifactReference {
  try {
    return parseReference(value);
  } catch {
    return invalidMaterial(artifactKind, field);
  }
}

function parseReference(
  value: unknown,
): import('../sealed-reference-artifacts/index.js').SealedArtifactReference {
  return parseSealedArtifactReference(value);
}

function requireReferenceArray(
  artifactKind: ModelBenchmarkArtifactKind,
  field: string,
  value: unknown,
  allowEmpty = false,
): readonly import('../sealed-reference-artifacts/index.js').SealedArtifactReference[] {
  if (
    !Array.isArray(value)
    || value.length > MAX_REFERENCES
    || (!allowEmpty && value.length === 0)
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

function requireEnum<T extends string>(
  artifactKind: ModelBenchmarkArtifactKind,
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
  artifactKind: ModelBenchmarkArtifactKind,
  field: string,
  value: unknown,
): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0 || (value as number) > 4_294_967_295) {
    return invalidMaterial(artifactKind, field);
  }
  return value as number;
}

function requireNullableUint32(
  artifactKind: ModelBenchmarkArtifactKind,
  field: string,
  value: unknown,
): number | null {
  return value === null ? null : requireUint32(artifactKind, field, value);
}

function requireNonNegativeNumber(
  artifactKind: ModelBenchmarkArtifactKind,
  field: string,
  value: unknown,
): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireRatio(
  artifactKind: ModelBenchmarkArtifactKind,
  field: string,
  value: unknown,
): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireTimestamp(
  artifactKind: ModelBenchmarkArtifactKind,
  field: string,
  value: unknown,
): string {
  if (
    typeof value !== 'string'
    || value.length > 64
    || Number.isNaN(Date.parse(value))
  ) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireNullableTimestamp(
  artifactKind: ModelBenchmarkArtifactKind,
  field: string,
  value: unknown,
): string | null {
  return value === null ? null : requireTimestamp(artifactKind, field, value);
}

function requireNullableToken(
  artifactKind: ModelBenchmarkArtifactKind,
  field: string,
  value: unknown,
): string | null {
  return value === null ? null : requireToken(artifactKind, field, value);
}

function requireBoolean(
  artifactKind: ModelBenchmarkArtifactKind,
  field: string,
  value: unknown,
): boolean {
  if (typeof value !== 'boolean') return invalidMaterial(artifactKind, field);
  return value;
}

function requireLocator(
  artifactKind: ModelBenchmarkArtifactKind,
  input: unknown,
): ModelBenchmarkArtifactLocator {
  const value = requireRecord(artifactKind, input, LOCATOR_FIELDS);
  const scheme = requireEnum(artifactKind, 'locator.scheme', value.scheme, [
    'artifact',
    'file',
    'ledger',
    'url',
  ] as const);
  if (
    typeof value.selector !== 'string'
    || value.selector.length === 0
    || value.selector.length > 256
    || !SELECTOR_PATTERN.test(value.selector)
    || (value.selector.match(/\s/gu)?.length ?? 0) > MAX_SELECTOR_SPACES
  ) {
    return invalidMaterial(artifactKind, 'locator.selector');
  }
  return Object.freeze({
    scheme,
    locatorDigest: requireDigest(artifactKind, 'locator.locatorDigest', value.locatorDigest),
    selector: value.selector,
    revision: value.revision === null
      ? null
      : requireToken(artifactKind, 'locator.revision', value.revision),
  });
}

function parseEventBinding(
  artifactKind: ModelBenchmarkArtifactKind,
  input: unknown,
): ModelBenchmarkArtifactEventBinding {
  const value = requireRecord(artifactKind, input, EVENT_FIELDS);
  return Object.freeze({
    eventStem: requireEnum(artifactKind, 'originEvent.eventStem', value.eventStem, ModelBenchmarkEventStems),
    eventId: requireToken(artifactKind, 'originEvent.eventId', value.eventId),
    payloadDigest: requireDigest(artifactKind, 'originEvent.payloadDigest', value.payloadDigest),
  });
}

function parseDependencies(
  artifactKind: ModelBenchmarkArtifactKind,
  input: unknown,
): readonly ModelBenchmarkArtifactDependency[] {
  if (!Array.isArray(input) || input.length > MAX_DEPENDENCIES) {
    return invalidMaterial(artifactKind, 'dependencyReferences');
  }
  const dependencies = input.map((entry, index) => {
    const value = requireRecord(artifactKind, entry, DEPENDENCY_FIELDS);
    return Object.freeze({
      purpose: requireToken(artifactKind, `dependencyReferences[${index}].purpose`, value.purpose),
      reference: requireReference(artifactKind, `dependencyReferences[${index}].reference`, value.reference),
    });
  });
  const unique = new Set(dependencies.map((entry) => entry.reference.qualified_digest));
  if (unique.size !== dependencies.length) return invalidMaterial(artifactKind, 'dependencyReferences');
  return Object.freeze(dependencies);
}

function parseBase(
  artifactKind: ModelBenchmarkArtifactKind,
  input: unknown,
): ModelBenchmarkArtifactBaseMaterial & Record<string, unknown> {
  if (
    !isRecord(input)
    || BASE_FIELDS.some((field) => !Object.prototype.hasOwnProperty.call(input, field))
  ) {
    return invalidMaterial(artifactKind, 'shape');
  }
  const value = input;
  return Object.freeze({
    schemaVersion: requireToken(artifactKind, 'schemaVersion', value.schemaVersion),
    artifactId: requireToken(artifactKind, 'artifactId', value.artifactId),
    evaluatorEpochId: requireToken(artifactKind, 'evaluatorEpochId', value.evaluatorEpochId),
    visibility: requireEnum(artifactKind, 'visibility', value.visibility, [
      'private',
      'public',
      'sealed',
    ] as const),
    dependencyReferences: parseDependencies(artifactKind, value.dependencyReferences),
    originEvent: parseEventBinding(artifactKind, value.originEvent),
    producerVersion: requireToken(artifactKind, 'producerVersion', value.producerVersion),
    locator: requireLocator(artifactKind, value.locator),
    freshnessExpiresAt: requireNullableTimestamp(
      artifactKind,
      'freshnessExpiresAt',
      value.freshnessExpiresAt,
    ),
  });
}

function parseVisibilityPolicy(
  artifactKind: ModelBenchmarkArtifactKind,
  input: unknown,
): ModelBenchmarkVisibilityPolicy {
  const value = requireRecord(artifactKind, input, VISIBILITY_POLICY_FIELDS);
  return Object.freeze({
    candidateView: requireEnum(artifactKind, 'visibilityPolicy.candidateView', value.candidateView, [
      'commitment-only',
      'verdict-band',
      'full',
    ] as const),
    hiddenCaseContent: requireEnum(artifactKind, 'visibilityPolicy.hiddenCaseContent', value.hiddenCaseContent, ['withheld'] as const),
    exactScores: requireEnum(artifactKind, 'visibilityPolicy.exactScores', value.exactScores, ['withheld'] as const),
    protectedJudgeEvidence: requireEnum(artifactKind, 'visibilityPolicy.protectedJudgeEvidence', value.protectedJudgeEvidence, ['withheld'] as const),
    evaluatorInternals: requireEnum(artifactKind, 'visibilityPolicy.evaluatorInternals', value.evaluatorInternals, ['withheld'] as const),
    terminalEvidence: requireEnum(artifactKind, 'visibilityPolicy.terminalEvidence', value.terminalEvidence, ['withheld'] as const),
  });
}

function parseUsage(
  artifactKind: ModelBenchmarkArtifactKind,
  input: unknown,
): ModelBenchmarkUsageEvidence {
  const value = requireRecord(artifactKind, input, USAGE_FIELDS);
  return Object.freeze({
    inputTokens: requireNullableUint32(artifactKind, 'usage.inputTokens', value.inputTokens),
    outputTokens: requireNullableUint32(artifactKind, 'usage.outputTokens', value.outputTokens),
    reasoningTokens: requireNullableUint32(artifactKind, 'usage.reasoningTokens', value.reasoningTokens),
    cacheReadTokens: requireNullableUint32(artifactKind, 'usage.cacheReadTokens', value.cacheReadTokens),
    cacheWriteTokens: requireNullableUint32(artifactKind, 'usage.cacheWriteTokens', value.cacheWriteTokens),
    realizedCostMicros: requireNullableUint32(artifactKind, 'usage.realizedCostMicros', value.realizedCostMicros),
    errorCostMicros: requireNullableUint32(artifactKind, 'usage.errorCostMicros', value.errorCostMicros),
    abstentionCostMicros: requireNullableUint32(artifactKind, 'usage.abstentionCostMicros', value.abstentionCostMicros),
  });
}

function parseLatency(
  artifactKind: ModelBenchmarkArtifactKind,
  input: unknown,
): ModelBenchmarkLatencyEvidence {
  const value = requireRecord(artifactKind, input, LATENCY_FIELDS);
  return Object.freeze({
    ttftMs: requireNullableUint32(artifactKind, 'latency.ttftMs', value.ttftMs),
    interTokenP50Ms: requireNullableUint32(artifactKind, 'latency.interTokenP50Ms', value.interTokenP50Ms),
    endToEndMs: requireNullableUint32(artifactKind, 'latency.endToEndMs', value.endToEndMs),
    tailP95Ms: requireNullableUint32(artifactKind, 'latency.tailP95Ms', value.tailP95Ms),
    throughputTokensPerSecond: value.throughputTokensPerSecond === null
      ? null
      : requireNonNegativeNumber(artifactKind, 'latency.throughputTokensPerSecond', value.throughputTokensPerSecond),
    sloViolationCount: requireUint32(artifactKind, 'latency.sloViolationCount', value.sloViolationCount),
  });
}

function parseTrialMatrixKey(
  artifactKind: ModelBenchmarkArtifactKind,
  input: unknown,
): ModelBenchmarkMatrixMembership['trialMatrixKey'] {
  const value = requireRecord(artifactKind, input, TRIAL_MATRIX_KEY_FIELDS);
  return Object.freeze({
    candidateId: requireToken(artifactKind, 'trialMatrixKey.candidateId', value.candidateId),
    modelFingerprint: requireDigest(artifactKind, 'trialMatrixKey.modelFingerprint', value.modelFingerprint),
    executionPath: requireCode(artifactKind, 'trialMatrixKey.executionPath', value.executionPath),
    taskInstanceId: requireToken(artifactKind, 'trialMatrixKey.taskInstanceId', value.taskInstanceId),
    taskFamilyId: requireToken(artifactKind, 'trialMatrixKey.taskFamilyId', value.taskFamilyId),
    pairedBlockId: requireToken(artifactKind, 'trialMatrixKey.pairedBlockId', value.pairedBlockId),
    protocolVariant: requireCode(artifactKind, 'trialMatrixKey.protocolVariant', value.protocolVariant),
    seed: requireUint32(artifactKind, 'trialMatrixKey.seed', value.seed),
    perturbationId: requireToken(artifactKind, 'trialMatrixKey.perturbationId', value.perturbationId),
    workloadProfileId: requireToken(artifactKind, 'trialMatrixKey.workloadProfileId', value.workloadProfileId),
    promptRecipeFingerprint: requireDigest(artifactKind, 'trialMatrixKey.promptRecipeFingerprint', value.promptRecipeFingerprint),
    routeFingerprint: requireDigest(artifactKind, 'trialMatrixKey.routeFingerprint', value.routeFingerprint),
    frameworkFingerprint: requireDigest(artifactKind, 'trialMatrixKey.frameworkFingerprint', value.frameworkFingerprint),
    toolRecipeFingerprint: requireDigest(artifactKind, 'trialMatrixKey.toolRecipeFingerprint', value.toolRecipeFingerprint),
    attempt: requireUint32(artifactKind, 'trialMatrixKey.attempt', value.attempt),
  });
}

function parseMatrixMembership(
  artifactKind: ModelBenchmarkArtifactKind,
  input: unknown,
): ModelBenchmarkMatrixMembership {
  const value = requireRecord(artifactKind, input, MATRIX_MEMBERSHIP_FIELDS);
  return Object.freeze({
    matrixDigest: requireDigest(artifactKind, 'matrixMembership.matrixDigest', value.matrixDigest),
    modelId: requireToken(artifactKind, 'matrixMembership.modelId', value.modelId),
    executorId: requireToken(artifactKind, 'matrixMembership.executorId', value.executorId),
    taskFamilyId: requireToken(artifactKind, 'matrixMembership.taskFamilyId', value.taskFamilyId),
    taskInstanceId: requireToken(artifactKind, 'matrixMembership.taskInstanceId', value.taskInstanceId),
    anchorClass: requireEnum(artifactKind, 'matrixMembership.anchorClass', value.anchorClass, [
      'common-anchor',
      'adaptive-diagnostic',
      'none',
    ] as const),
    pairedBlockId: requireToken(artifactKind, 'matrixMembership.pairedBlockId', value.pairedBlockId),
    trialMatrixKey: parseTrialMatrixKey(artifactKind, value.trialMatrixKey),
  });
}

function parseRecipe(
  artifactKind: typeof ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE,
  input: unknown,
): ModelBenchmarkRecipeArtifactMaterial {
  const value = requireRecord(artifactKind, input, [
    ...BASE_FIELDS,
    'profileId', 'profileVersion', 'mode', 'modelDescriptorsDigest',
    'executorDescriptorsDigest', 'frameworkDigest', 'promptReferenceDigest',
    'fixtureManifestDigest', 'taskFamilyManifestDigest', 'samplePolicyDigest',
    'seedPolicyDigest', 'matrixOrderingDigest', 'scoringConfigurationDigest',
    'correctnessGateDigest', 'reportingGroupCode', 'workloadProfileDigest',
    'visibilityPolicy', 'modelExecutionCrossing',
  ]);
  return Object.freeze({
    ...parseBase(artifactKind, value),
    profileId: requireToken(artifactKind, 'profileId', value.profileId),
    profileVersion: requireToken(artifactKind, 'profileVersion', value.profileVersion),
    mode: requireEnum(artifactKind, 'mode', value.mode, ['model-benchmark'] as const),
    modelDescriptorsDigest: requireDigest(artifactKind, 'modelDescriptorsDigest', value.modelDescriptorsDigest),
    executorDescriptorsDigest: requireDigest(artifactKind, 'executorDescriptorsDigest', value.executorDescriptorsDigest),
    frameworkDigest: requireDigest(artifactKind, 'frameworkDigest', value.frameworkDigest),
    promptReferenceDigest: requireDigest(artifactKind, 'promptReferenceDigest', value.promptReferenceDigest),
    fixtureManifestDigest: requireDigest(artifactKind, 'fixtureManifestDigest', value.fixtureManifestDigest),
    taskFamilyManifestDigest: requireDigest(artifactKind, 'taskFamilyManifestDigest', value.taskFamilyManifestDigest),
    samplePolicyDigest: requireDigest(artifactKind, 'samplePolicyDigest', value.samplePolicyDigest),
    seedPolicyDigest: requireDigest(artifactKind, 'seedPolicyDigest', value.seedPolicyDigest),
    matrixOrderingDigest: requireDigest(artifactKind, 'matrixOrderingDigest', value.matrixOrderingDigest),
    scoringConfigurationDigest: requireDigest(artifactKind, 'scoringConfigurationDigest', value.scoringConfigurationDigest),
    correctnessGateDigest: requireDigest(artifactKind, 'correctnessGateDigest', value.correctnessGateDigest),
    reportingGroupCode: requireCode(artifactKind, 'reportingGroupCode', value.reportingGroupCode),
    workloadProfileDigest: requireDigest(artifactKind, 'workloadProfileDigest', value.workloadProfileDigest),
    visibilityPolicy: parseVisibilityPolicy(artifactKind, value.visibilityPolicy),
    modelExecutionCrossing: requireEnum(artifactKind, 'modelExecutionCrossing', value.modelExecutionCrossing, [
      'independent',
      'complete-stack',
    ] as const),
  });
}

function parseRunManifest(
  artifactKind: typeof ModelBenchmarkArtifactKinds.RUN_MANIFEST,
  input: unknown,
): ModelBenchmarkRunManifestArtifactMaterial {
  const value = requireRecord(artifactKind, input, [
    ...BASE_FIELDS,
    'runId', 'recipeReference', 'recipeDigest', 'modelSetDigest',
    'executorSetDigest', 'frameworkDigest', 'fixtureManifestDigest',
    'samplePolicyDigest', 'seedPolicyDigest', 'matrixOrderingDigest',
    'scoringPolicyDigest', 'workloadProfileDigest', 'matrixMembershipDigest',
    'cellReferences', 'reportingGroupCode', 'completeness',
  ]);
  return Object.freeze({
    ...parseBase(artifactKind, value),
    runId: requireToken(artifactKind, 'runId', value.runId),
    recipeReference: requireReference(artifactKind, 'recipeReference', value.recipeReference),
    recipeDigest: requireDigest(artifactKind, 'recipeDigest', value.recipeDigest),
    modelSetDigest: requireDigest(artifactKind, 'modelSetDigest', value.modelSetDigest),
    executorSetDigest: requireDigest(artifactKind, 'executorSetDigest', value.executorSetDigest),
    frameworkDigest: requireDigest(artifactKind, 'frameworkDigest', value.frameworkDigest),
    fixtureManifestDigest: requireDigest(artifactKind, 'fixtureManifestDigest', value.fixtureManifestDigest),
    samplePolicyDigest: requireDigest(artifactKind, 'samplePolicyDigest', value.samplePolicyDigest),
    seedPolicyDigest: requireDigest(artifactKind, 'seedPolicyDigest', value.seedPolicyDigest),
    matrixOrderingDigest: requireDigest(artifactKind, 'matrixOrderingDigest', value.matrixOrderingDigest),
    scoringPolicyDigest: requireDigest(artifactKind, 'scoringPolicyDigest', value.scoringPolicyDigest),
    workloadProfileDigest: requireDigest(artifactKind, 'workloadProfileDigest', value.workloadProfileDigest),
    matrixMembershipDigest: requireDigest(artifactKind, 'matrixMembershipDigest', value.matrixMembershipDigest),
    cellReferences: requireReferenceArray(artifactKind, 'cellReferences', value.cellReferences),
    reportingGroupCode: requireCode(artifactKind, 'reportingGroupCode', value.reportingGroupCode),
    completeness: requireEnum(artifactKind, 'completeness', value.completeness, [
      'complete',
      'incomplete',
      'quarantined',
    ] as const),
  });
}

function parseCellInput(
  artifactKind: typeof ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT,
  input: unknown,
): ModelBenchmarkModelCellInputArtifactMaterial {
  const value = requireRecord(artifactKind, input, [
    ...BASE_FIELDS,
    'runId', 'cellId', 'matrixMembership', 'modelDescriptorDigest',
    'executorDescriptorDigest', 'providerIdentityDigest', 'buildVariantDigest',
    'resolvedCapabilityDigest', 'permissionFingerprintDigest', 'workflowPrefixDigest',
    'environmentSnapshotDigest', 'frameworkTemplateDigest', 'fixtureDigest',
    'sampleId', 'seed', 'promptVisibilityPolicy', 'workloadProfileDigest',
    'prerequisiteReferences',
  ]);
  return Object.freeze({
    ...parseBase(artifactKind, value),
    runId: requireToken(artifactKind, 'runId', value.runId),
    cellId: requireToken(artifactKind, 'cellId', value.cellId),
    matrixMembership: parseMatrixMembership(artifactKind, value.matrixMembership),
    modelDescriptorDigest: requireDigest(artifactKind, 'modelDescriptorDigest', value.modelDescriptorDigest),
    executorDescriptorDigest: requireDigest(artifactKind, 'executorDescriptorDigest', value.executorDescriptorDigest),
    providerIdentityDigest: requireDigest(artifactKind, 'providerIdentityDigest', value.providerIdentityDigest),
    buildVariantDigest: requireDigest(artifactKind, 'buildVariantDigest', value.buildVariantDigest),
    resolvedCapabilityDigest: requireDigest(artifactKind, 'resolvedCapabilityDigest', value.resolvedCapabilityDigest),
    permissionFingerprintDigest: requireDigest(artifactKind, 'permissionFingerprintDigest', value.permissionFingerprintDigest),
    workflowPrefixDigest: requireDigest(artifactKind, 'workflowPrefixDigest', value.workflowPrefixDigest),
    environmentSnapshotDigest: requireDigest(artifactKind, 'environmentSnapshotDigest', value.environmentSnapshotDigest),
    frameworkTemplateDigest: requireDigest(artifactKind, 'frameworkTemplateDigest', value.frameworkTemplateDigest),
    fixtureDigest: requireDigest(artifactKind, 'fixtureDigest', value.fixtureDigest),
    sampleId: requireToken(artifactKind, 'sampleId', value.sampleId),
    seed: requireUint32(artifactKind, 'seed', value.seed),
    promptVisibilityPolicy: requireEnum(artifactKind, 'promptVisibilityPolicy', value.promptVisibilityPolicy, [
      'public',
      'sealed',
      'withheld',
    ] as const),
    workloadProfileDigest: requireDigest(artifactKind, 'workloadProfileDigest', value.workloadProfileDigest),
    prerequisiteReferences: requireReferenceArray(artifactKind, 'prerequisiteReferences', value.prerequisiteReferences, true),
  });
}

function parseRawCellOutput(
  artifactKind: typeof ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT,
  input: unknown,
): ModelBenchmarkRawCellOutputArtifactMaterial {
  const value = requireRecord(artifactKind, input, [
    ...BASE_FIELDS,
    'runId', 'cellId', 'matrixDigest', 'inputReference', 'responseDigest',
    'responseReference', 'trajectoryDigest', 'trajectoryReference', 'toolTraceDigest',
    'toolTraceReference', 'itemObservationReferences', 'scoreVectorDigest',
    'judgeObservationDigest', 'usageStatus', 'usage', 'latency', 'errorCode',
    'abstained', 'retryCount', 'integrityStatus', 'workloadProfileDigest',
  ]);
  return Object.freeze({
    ...parseBase(artifactKind, value),
    runId: requireToken(artifactKind, 'runId', value.runId),
    cellId: requireToken(artifactKind, 'cellId', value.cellId),
    matrixDigest: requireDigest(artifactKind, 'matrixDigest', value.matrixDigest),
    inputReference: requireReference(artifactKind, 'inputReference', value.inputReference),
    responseDigest: requireDigest(artifactKind, 'responseDigest', value.responseDigest),
    responseReference: requireReference(artifactKind, 'responseReference', value.responseReference),
    trajectoryDigest: requireDigest(artifactKind, 'trajectoryDigest', value.trajectoryDigest),
    trajectoryReference: requireReference(artifactKind, 'trajectoryReference', value.trajectoryReference),
    toolTraceDigest: requireDigest(artifactKind, 'toolTraceDigest', value.toolTraceDigest),
    toolTraceReference: requireReference(artifactKind, 'toolTraceReference', value.toolTraceReference),
    itemObservationReferences: requireReferenceArray(artifactKind, 'itemObservationReferences', value.itemObservationReferences),
    scoreVectorDigest: requireDigest(artifactKind, 'scoreVectorDigest', value.scoreVectorDigest),
    judgeObservationDigest: requireDigest(artifactKind, 'judgeObservationDigest', value.judgeObservationDigest),
    usageStatus: requireEnum(artifactKind, 'usageStatus', value.usageStatus, ['complete', 'missing', 'partial'] as const),
    usage: parseUsage(artifactKind, value.usage),
    latency: parseLatency(artifactKind, value.latency),
    errorCode: requireNullableToken(artifactKind, 'errorCode', value.errorCode),
    abstained: requireBoolean(artifactKind, 'abstained', value.abstained),
    retryCount: requireUint32(artifactKind, 'retryCount', value.retryCount),
    integrityStatus: requireEnum(artifactKind, 'integrityStatus', value.integrityStatus, ['confirmed', 'disputed', 'inconclusive'] as const),
    workloadProfileDigest: requireDigest(artifactKind, 'workloadProfileDigest', value.workloadProfileDigest),
  });
}

function parseScoringMatrix(
  artifactKind: typeof ModelBenchmarkArtifactKinds.SCORING_MATRIX,
  input: unknown,
): ModelBenchmarkScoringMatrixArtifactMaterial {
  const value = requireRecord(artifactKind, input, [
    ...BASE_FIELDS,
    'runReference', 'matrixDigest', 'rawObservationReferences', 'itemRowsDigest',
    'familyRowsDigest', 'modelExecutorCrossingsDigest', 'anchorMembershipDigest',
    'adaptiveDiagnosticMembershipDigest', 'rubricAxisObservationsDigest',
    'judgeCalibrationDigest', 'pairedDeltasDigest', 'uncertaintyDigest',
    'multiplicityTreatmentDigest', 'selectionState', 'winnerModelId',
  ]);
  return Object.freeze({
    ...parseBase(artifactKind, value),
    runReference: requireReference(artifactKind, 'runReference', value.runReference),
    matrixDigest: requireDigest(artifactKind, 'matrixDigest', value.matrixDigest),
    rawObservationReferences: requireReferenceArray(artifactKind, 'rawObservationReferences', value.rawObservationReferences),
    itemRowsDigest: requireDigest(artifactKind, 'itemRowsDigest', value.itemRowsDigest),
    familyRowsDigest: requireDigest(artifactKind, 'familyRowsDigest', value.familyRowsDigest),
    modelExecutorCrossingsDigest: requireDigest(artifactKind, 'modelExecutorCrossingsDigest', value.modelExecutorCrossingsDigest),
    anchorMembershipDigest: requireDigest(artifactKind, 'anchorMembershipDigest', value.anchorMembershipDigest),
    adaptiveDiagnosticMembershipDigest: requireDigest(artifactKind, 'adaptiveDiagnosticMembershipDigest', value.adaptiveDiagnosticMembershipDigest),
    rubricAxisObservationsDigest: requireDigest(artifactKind, 'rubricAxisObservationsDigest', value.rubricAxisObservationsDigest),
    judgeCalibrationDigest: requireDigest(artifactKind, 'judgeCalibrationDigest', value.judgeCalibrationDigest),
    pairedDeltasDigest: requireDigest(artifactKind, 'pairedDeltasDigest', value.pairedDeltasDigest),
    uncertaintyDigest: requireDigest(artifactKind, 'uncertaintyDigest', value.uncertaintyDigest),
    multiplicityTreatmentDigest: requireDigest(artifactKind, 'multiplicityTreatmentDigest', value.multiplicityTreatmentDigest),
    selectionState: requireEnum(artifactKind, 'selectionState', value.selectionState, ['BLOCKED', 'INCONCLUSIVE', 'TIE', 'WINNER'] as const),
    winnerModelId: requireNullableToken(artifactKind, 'winnerModelId', value.winnerModelId),
  });
}

function parseCommonAnchorSelection(
  artifactKind: typeof ModelBenchmarkArtifactKinds.COMMON_ANCHOR_SELECTION,
  input: unknown,
): ModelBenchmarkCommonAnchorSelectionArtifactMaterial {
  const value = requireRecord(artifactKind, input, [
    ...BASE_FIELDS,
    'runReference', 'matrixDigest', 'commonAnchorReferences', 'taskFamilyIds',
    'familyCoverageDigest', 'selectionPolicyDigest', 'confirmatoryStatus',
    'exclusionReasonCodes',
  ]);
  return Object.freeze({
    ...parseBase(artifactKind, value),
    runReference: requireReference(artifactKind, 'runReference', value.runReference),
    matrixDigest: requireDigest(artifactKind, 'matrixDigest', value.matrixDigest),
    commonAnchorReferences: requireReferenceArray(artifactKind, 'commonAnchorReferences', value.commonAnchorReferences),
    taskFamilyIds: requireTokenArray(artifactKind, 'taskFamilyIds', value.taskFamilyIds),
    familyCoverageDigest: requireDigest(artifactKind, 'familyCoverageDigest', value.familyCoverageDigest),
    selectionPolicyDigest: requireDigest(artifactKind, 'selectionPolicyDigest', value.selectionPolicyDigest),
    confirmatoryStatus: requireEnum(artifactKind, 'confirmatoryStatus', value.confirmatoryStatus, ['confirmatory', 'diagnostic-only', 'inconclusive'] as const),
    exclusionReasonCodes: requireTokenArray(artifactKind, 'exclusionReasonCodes', value.exclusionReasonCodes, true),
  });
}

function parseAdaptiveDiagnosticSelection(
  artifactKind: typeof ModelBenchmarkArtifactKinds.ADAPTIVE_DIAGNOSTIC_SELECTION,
  input: unknown,
): ModelBenchmarkAdaptiveDiagnosticSelectionArtifactMaterial {
  const value = requireRecord(artifactKind, input, [
    ...BASE_FIELDS,
    'runReference', 'matrixDigest', 'selectedCaseReferences', 'familyQuotaDigest',
    'informationInputsDigest', 'selectionPolicyDigest', 'propensityDigest',
    'confirmatoryStatus', 'exclusionReasonCodes',
  ]);
  return Object.freeze({
    ...parseBase(artifactKind, value),
    runReference: requireReference(artifactKind, 'runReference', value.runReference),
    matrixDigest: requireDigest(artifactKind, 'matrixDigest', value.matrixDigest),
    selectedCaseReferences: requireReferenceArray(artifactKind, 'selectedCaseReferences', value.selectedCaseReferences),
    familyQuotaDigest: requireDigest(artifactKind, 'familyQuotaDigest', value.familyQuotaDigest),
    informationInputsDigest: requireDigest(artifactKind, 'informationInputsDigest', value.informationInputsDigest),
    selectionPolicyDigest: requireDigest(artifactKind, 'selectionPolicyDigest', value.selectionPolicyDigest),
    propensityDigest: requireDigest(artifactKind, 'propensityDigest', value.propensityDigest),
    confirmatoryStatus: requireEnum(artifactKind, 'confirmatoryStatus', value.confirmatoryStatus, ['blocked', 'non-confirmatory', 'confirmatory'] as const),
    exclusionReasonCodes: requireTokenArray(artifactKind, 'exclusionReasonCodes', value.exclusionReasonCodes, true),
  });
}

function parseValidityEvidence(
  artifactKind: typeof ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE,
  input: unknown,
): ModelBenchmarkValidityEvidenceArtifactMaterial {
  const value = requireRecord(artifactKind, input, [
    ...BASE_FIELDS,
    'matrixDigest', 'candidateId', 'taskFamilyId', 'judgeCalibrationReference',
    'judgeCalibrationDigest', 'rubricAxisValidationDigest', 'oracleUncertainty',
    'protocolRobustnessDigest', 'validityPolicyDigest', 'validityState',
    'blockerCodes',
  ]);
  return Object.freeze({
    ...parseBase(artifactKind, value),
    matrixDigest: requireDigest(artifactKind, 'matrixDigest', value.matrixDigest),
    candidateId: requireToken(artifactKind, 'candidateId', value.candidateId),
    taskFamilyId: requireToken(artifactKind, 'taskFamilyId', value.taskFamilyId),
    judgeCalibrationReference: requireReference(artifactKind, 'judgeCalibrationReference', value.judgeCalibrationReference),
    judgeCalibrationDigest: requireDigest(artifactKind, 'judgeCalibrationDigest', value.judgeCalibrationDigest),
    rubricAxisValidationDigest: requireDigest(artifactKind, 'rubricAxisValidationDigest', value.rubricAxisValidationDigest),
    oracleUncertainty: requireRatio(artifactKind, 'oracleUncertainty', value.oracleUncertainty),
    protocolRobustnessDigest: requireDigest(artifactKind, 'protocolRobustnessDigest', value.protocolRobustnessDigest),
    validityPolicyDigest: requireDigest(artifactKind, 'validityPolicyDigest', value.validityPolicyDigest),
    validityState: requireEnum(artifactKind, 'validityState', value.validityState, ['blocked', 'invalid', 'unknown', 'valid'] as const),
    blockerCodes: requireTokenArray(artifactKind, 'blockerCodes', value.blockerCodes, true),
  });
}

function parseContaminationLineage(
  artifactKind: typeof ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE,
  input: unknown,
): ModelBenchmarkContaminationLineageArtifactMaterial {
  const value = requireRecord(artifactKind, input, [
    ...BASE_FIELDS,
    'caseId', 'sourceDate', 'firstExposureAt', 'disclosureAt', 'retiredAt',
    'caseVisibility', 'contaminationStatus', 'matchedEvidenceDigest',
    'semanticEvidenceDigest', 'disclosureEvidenceDigest', 'replacementCaseReference',
    'referenceModelDifficultyDigest', 'evidenceReferences',
  ]);
  return Object.freeze({
    ...parseBase(artifactKind, value),
    caseId: requireToken(artifactKind, 'caseId', value.caseId),
    sourceDate: requireTimestamp(artifactKind, 'sourceDate', value.sourceDate),
    firstExposureAt: requireNullableTimestamp(artifactKind, 'firstExposureAt', value.firstExposureAt),
    disclosureAt: requireNullableTimestamp(artifactKind, 'disclosureAt', value.disclosureAt),
    retiredAt: requireNullableTimestamp(artifactKind, 'retiredAt', value.retiredAt),
    caseVisibility: requireEnum(artifactKind, 'caseVisibility', value.caseVisibility, ['private', 'public', 'sealed'] as const),
    contaminationStatus: requireEnum(artifactKind, 'contaminationStatus', value.contaminationStatus, ['clean', 'confirmed', 'suspected', 'unknown'] as const),
    matchedEvidenceDigest: requireDigest(artifactKind, 'matchedEvidenceDigest', value.matchedEvidenceDigest),
    semanticEvidenceDigest: requireDigest(artifactKind, 'semanticEvidenceDigest', value.semanticEvidenceDigest),
    disclosureEvidenceDigest: requireDigest(artifactKind, 'disclosureEvidenceDigest', value.disclosureEvidenceDigest),
    replacementCaseReference: value.replacementCaseReference === null
      ? null
      : requireReference(artifactKind, 'replacementCaseReference', value.replacementCaseReference),
    referenceModelDifficultyDigest: requireDigest(artifactKind, 'referenceModelDifficultyDigest', value.referenceModelDifficultyDigest),
    evidenceReferences: requireReferenceArray(artifactKind, 'evidenceReferences', value.evidenceReferences),
  });
}

function parseWorkloadEvidence(
  artifactKind: typeof ModelBenchmarkArtifactKinds.WORKLOAD_EVIDENCE,
  input: unknown,
): ModelBenchmarkWorkloadEvidenceArtifactMaterial {
  const value = requireRecord(artifactKind, input, [
    ...BASE_FIELDS,
    'runReference', 'workloadProfileDigest', 'contextLength', 'concurrency',
    'trafficShapeDigest', 'outputLength', 'prefixReuseRatio', 'multiTurnCount',
    'latency', 'usageStatus', 'usage', 'switchingOverheadMicros',
  ]);
  return Object.freeze({
    ...parseBase(artifactKind, value),
    runReference: requireReference(artifactKind, 'runReference', value.runReference),
    workloadProfileDigest: requireDigest(artifactKind, 'workloadProfileDigest', value.workloadProfileDigest),
    contextLength: requireUint32(artifactKind, 'contextLength', value.contextLength),
    concurrency: requireUint32(artifactKind, 'concurrency', value.concurrency),
    trafficShapeDigest: requireDigest(artifactKind, 'trafficShapeDigest', value.trafficShapeDigest),
    outputLength: requireUint32(artifactKind, 'outputLength', value.outputLength),
    prefixReuseRatio: requireRatio(artifactKind, 'prefixReuseRatio', value.prefixReuseRatio),
    multiTurnCount: requireUint32(artifactKind, 'multiTurnCount', value.multiTurnCount),
    latency: parseLatency(artifactKind, value.latency),
    usageStatus: requireEnum(artifactKind, 'usageStatus', value.usageStatus, ['complete', 'missing', 'partial'] as const),
    usage: parseUsage(artifactKind, value.usage),
    switchingOverheadMicros: requireNullableUint32(artifactKind, 'switchingOverheadMicros', value.switchingOverheadMicros),
  });
}

function parseSelectionEvidence(
  artifactKind: typeof ModelBenchmarkArtifactKinds.SELECTION_EVIDENCE,
  input: unknown,
): ModelBenchmarkSelectionEvidenceArtifactMaterial {
  const value = requireRecord(artifactKind, input, [
    ...BASE_FIELDS,
    'matrixReference', 'matrixDigest', 'validityEvidenceReferences',
    'workloadEvidenceReferences', 'anchorEvidenceReference',
    'diagnosticEvidenceReference', 'reductionPolicyDigest', 'evidenceCompleteness',
    'qualityGateStatus', 'operationalGateStatus', 'selectionState',
  ]);
  return Object.freeze({
    ...parseBase(artifactKind, value),
    matrixReference: requireReference(artifactKind, 'matrixReference', value.matrixReference),
    matrixDigest: requireDigest(artifactKind, 'matrixDigest', value.matrixDigest),
    validityEvidenceReferences: requireReferenceArray(artifactKind, 'validityEvidenceReferences', value.validityEvidenceReferences),
    workloadEvidenceReferences: requireReferenceArray(artifactKind, 'workloadEvidenceReferences', value.workloadEvidenceReferences),
    anchorEvidenceReference: requireReference(artifactKind, 'anchorEvidenceReference', value.anchorEvidenceReference),
    diagnosticEvidenceReference: requireReference(artifactKind, 'diagnosticEvidenceReference', value.diagnosticEvidenceReference),
    reductionPolicyDigest: requireDigest(artifactKind, 'reductionPolicyDigest', value.reductionPolicyDigest),
    evidenceCompleteness: requireEnum(artifactKind, 'evidenceCompleteness', value.evidenceCompleteness, ['complete', 'incomplete', 'quarantined'] as const),
    qualityGateStatus: requireEnum(artifactKind, 'qualityGateStatus', value.qualityGateStatus, ['blocked', 'fail', 'pass', 'unknown'] as const),
    operationalGateStatus: requireEnum(artifactKind, 'operationalGateStatus', value.operationalGateStatus, ['blocked', 'fail', 'pass', 'unknown'] as const),
    selectionState: requireEnum(artifactKind, 'selectionState', value.selectionState, ['BLOCKED', 'INCONCLUSIVE', 'TIE', 'WINNER'] as const),
  });
}

function unsupportedArtifactKind(artifactKind: never): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.UNSUPPORTED_ARTIFACT_KIND,
    'canonicalization',
    'Model Benchmark artifact kind is not registered',
    { artifactKind: String(artifactKind) },
  );
}

function canonicalizeModelBenchmarkMaterial(
  artifactKind: ModelBenchmarkArtifactKind,
  input: unknown,
): Uint8Array {
  let material: ModelBenchmarkArtifactMaterial;
  switch (artifactKind) {
    case ModelBenchmarkArtifactKinds.BENCHMARK_RECIPE:
      material = parseRecipe(artifactKind, input);
      break;
    case ModelBenchmarkArtifactKinds.RUN_MANIFEST:
      material = parseRunManifest(artifactKind, input);
      break;
    case ModelBenchmarkArtifactKinds.MODEL_CELL_INPUT:
      material = parseCellInput(artifactKind, input);
      break;
    case ModelBenchmarkArtifactKinds.RAW_CELL_OUTPUT:
      material = parseRawCellOutput(artifactKind, input);
      break;
    case ModelBenchmarkArtifactKinds.SCORING_MATRIX:
      material = parseScoringMatrix(artifactKind, input);
      break;
    case ModelBenchmarkArtifactKinds.COMMON_ANCHOR_SELECTION:
      material = parseCommonAnchorSelection(artifactKind, input);
      break;
    case ModelBenchmarkArtifactKinds.ADAPTIVE_DIAGNOSTIC_SELECTION:
      material = parseAdaptiveDiagnosticSelection(artifactKind, input);
      break;
    case ModelBenchmarkArtifactKinds.VALIDITY_EVIDENCE:
      material = parseValidityEvidence(artifactKind, input);
      break;
    case ModelBenchmarkArtifactKinds.CONTAMINATION_LINEAGE:
      material = parseContaminationLineage(artifactKind, input);
      break;
    case ModelBenchmarkArtifactKinds.WORKLOAD_EVIDENCE:
      material = parseWorkloadEvidence(artifactKind, input);
      break;
    case ModelBenchmarkArtifactKinds.SELECTION_EVIDENCE:
      material = parseSelectionEvidence(artifactKind, input);
      break;
    default:
      return unsupportedArtifactKind(artifactKind);
  }
  return Uint8Array.from(canonicalBytes({ artifactKind, material }));
}

// ───────────────────────────────────────────────────────────────────
// 3. COMPOSED REAL-SEALER REGISTRY
// ───────────────────────────────────────────────────────────────────

export function createModelBenchmarkArtifactCanonicalizerRegistry(): ArtifactCanonicalizerRegistry {
  const initialRegistry = createArtifactCanonicalizerRegistry();
  const commonRegistry = createDeepImprovementCommonArtifactCanonicalizerRegistry();
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
  const commonDefinitions: ArtifactCanonicalizerDefinition[] = Object.values(
    DeepImprovementCommonArtifactKinds,
  ).map((artifactKind) => ({
    artifactKind,
    canonicalizationVersion: DEEP_IMPROVEMENT_COMMON_ARTIFACT_CANONICALIZATION_VERSION,
    mediaType: 'application/vnd.openai.deep-improvement-common-binding+json',
    implementationIdentity: 'deep-improvement-common-binding-canonicalizer-v1',
    canonicalize: (input: unknown): Uint8Array => (
      commonRegistry.canonicalize(
        artifactKind,
        DEEP_IMPROVEMENT_COMMON_ARTIFACT_CANONICALIZATION_VERSION,
        input,
      ).bytes
    ),
  }));
  const modelDefinitions: ArtifactCanonicalizerDefinition[] =
    MODEL_BENCHMARK_ARTIFACT_KIND_REGISTRY.map((entry) => ({
      artifactKind: entry.artifactKind,
      canonicalizationVersion: entry.canonicalizationVersion,
      mediaType: entry.mediaType,
      implementationIdentity: 'model-benchmark-binding-canonicalizer-v1',
      canonicalize: (input: unknown): Uint8Array => (
        canonicalizeModelBenchmarkMaterial(entry.artifactKind, input)
      ),
    }));
  return new ArtifactCanonicalizerRegistry([
    ...initialDefinitions,
    ...commonDefinitions,
    ...modelDefinitions,
  ]);
}

export function parseModelBenchmarkArtifactMaterial<TKind extends ModelBenchmarkArtifactKind>(
  artifactKind: TKind,
  input: unknown,
): ModelBenchmarkArtifactMaterialByKind[TKind] {
  if (!MODEL_BENCHMARK_ARTIFACT_KIND_REGISTRY.some((entry) => entry.artifactKind === artifactKind)) {
    return invalidMaterial(artifactKind, 'artifactKind');
  }
  const material = canonicalizeModelBenchmarkMaterial(artifactKind, input);
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(material).toString('utf8')) as unknown;
  } catch {
    return invalidMaterial(artifactKind, 'material');
  }
  if (!isRecord(parsed) || Object.keys(parsed).length !== 2 || parsed.artifactKind !== artifactKind) {
    return invalidMaterial(artifactKind, 'envelope');
  }
  return parsed.material as ModelBenchmarkArtifactMaterialByKind[TKind];
}

export function isModelBenchmarkArtifactKind(
  value: string,
): value is ModelBenchmarkArtifactKind {
  return MODEL_BENCHMARK_ARTIFACT_KIND_REGISTRY.some((entry) => entry.artifactKind === value);
}
