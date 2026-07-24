// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Artifact Material
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes } from '../event-envelope/index.js';
import {
  ArtifactCanonicalizerRegistry,
  SealedArtifactError,
  SealedArtifactErrorCodes,
  parseSealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import { DeepAlignmentArtifactKinds } from './deep-alignment-sealed-artifact-types.js';

import type {
  ArtifactCanonicalizerDefinition,
} from '../sealed-reference-artifacts/index.js';
import type {
  DeepAlignmentApplicabilityDecisionMaterial,
  DeepAlignmentArtifactDependency,
  DeepAlignmentArtifactKind,
  DeepAlignmentArtifactKindRegistration,
  DeepAlignmentArtifactLifecycle,
  DeepAlignmentArtifactLocator,
  DeepAlignmentArtifactMaterial,
  DeepAlignmentArtifactMaterialBase,
  DeepAlignmentAuthorityCapsuleMaterial,
  DeepAlignmentConvergenceSnapshotMaterial,
  DeepAlignmentDiscoveryManifestMaterial,
  DeepAlignmentExceptionInvalidation,
  DeepAlignmentFindingEvidenceMaterial,
  DeepAlignmentGovernedExceptionMaterial,
  DeepAlignmentLaneConfigurationMaterial,
  DeepAlignmentReportMaterial,
  DeepAlignmentResumeSaveHandoffMaterial,
  DeepAlignmentRuleManifestMaterial,
  DeepAlignmentTargetSnapshotMaterial,
  DeepAlignmentVerificationInputMaterial,
  DeepAlignmentVerificationInputRole,
  DeepAlignmentVerdict,
  DeepAlignmentWitnessKind,
  DeepAlignmentWitnessMatrixMaterial,
} from './deep-alignment-sealed-artifact-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. REGISTRY
// ───────────────────────────────────────────────────────────────────

export const DEEP_ALIGNMENT_ARTIFACT_CANONICALIZATION_VERSION =
  'deep-alignment-binding@1';
export const DEEP_ALIGNMENT_ARTIFACT_MEDIA_TYPE =
  'application/vnd.openai.deep-alignment-binding+json';

const REGISTRY_ROWS = [
  [DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE, 'init/scope', 'authority'],
  [DeepAlignmentArtifactKinds.LANE_CONFIGURATION, 'init/scope', 'lane'],
  [DeepAlignmentArtifactKinds.RULE_MANIFEST, 'init/scope', 'rules'],
  [DeepAlignmentArtifactKinds.APPLICABILITY_DECISION, 'iterate/check', 'applicability'],
  [DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST, 'discover', 'discovery'],
  [DeepAlignmentArtifactKinds.TARGET_SNAPSHOT, 'discover', 'target'],
  [DeepAlignmentArtifactKinds.DETECTOR_INPUT, 'iterate/check', 'verification'],
  [DeepAlignmentArtifactKinds.VERIFIER_INPUT, 'iterate/check', 'verification'],
  [DeepAlignmentArtifactKinds.WITNESS_MATRIX, 'witness/exception', 'witness'],
  [DeepAlignmentArtifactKinds.FINDING_EVIDENCE, 'iterate/check', 'finding'],
  [DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION, 'witness/exception', 'exception'],
  [DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT, 'convergence/report', 'convergence'],
  [DeepAlignmentArtifactKinds.ALIGNMENT_REPORT, 'convergence/report', 'report'],
  [DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF, 'resume/save', 'handoff'],
] as const satisfies ReadonlyArray<
  readonly [DeepAlignmentArtifactKind, DeepAlignmentArtifactLifecycle, string]
>;

export const DEEP_ALIGNMENT_ARTIFACT_KIND_REGISTRY:
  readonly DeepAlignmentArtifactKindRegistration[] = Object.freeze(
    REGISTRY_ROWS.map(([artifactKind, lifecycle, materialFamily]) => Object.freeze({
      artifactKind,
      lifecycle,
      materialFamily: materialFamily as DeepAlignmentArtifactKindRegistration['materialFamily'],
      canonicalizationVersion: DEEP_ALIGNMENT_ARTIFACT_CANONICALIZATION_VERSION,
      mediaType: DEEP_ALIGNMENT_ARTIFACT_MEDIA_TYPE,
    })),
  );

interface DeepAlignmentContentDigestDependencyRule {
  readonly field: string;
  readonly dependencyKind: DeepAlignmentArtifactKind;
  readonly match: 'content-digest';
}

interface DeepAlignmentMaterialIdentityDependencyRule {
  readonly field: string;
  readonly dependencyKind: DeepAlignmentArtifactKind;
  readonly match: 'material-identity';
  readonly dependencyDigestField: string;
  readonly dependencyIdentityField: string;
}

/** Named material claim that must resolve through a specific sealed dependency kind. */
export type DeepAlignmentNamedDependencyRule =
  | DeepAlignmentContentDigestDependencyRule
  | DeepAlignmentMaterialIdentityDependencyRule;

const NO_NAMED_DEPENDENCY_RULES: readonly DeepAlignmentNamedDependencyRule[] =
  Object.freeze([]);

const DEEP_ALIGNMENT_NAMED_DEPENDENCY_RULES: Readonly<
  Partial<Record<DeepAlignmentArtifactKind, readonly DeepAlignmentNamedDependencyRule[]>>
> = Object.freeze({
  [DeepAlignmentArtifactKinds.FINDING_EVIDENCE]: Object.freeze([
    Object.freeze({
      field: 'authorityDigest',
      dependencyKind: DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
      match: 'content-digest',
    }),
  ]),
  [DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION]: Object.freeze([
    Object.freeze({
      field: 'findingDigest',
      dependencyKind: DeepAlignmentArtifactKinds.FINDING_EVIDENCE,
      match: 'content-digest',
    }),
    Object.freeze({
      field: 'authorityDigest',
      dependencyKind: DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
      match: 'content-digest',
    }),
    Object.freeze({
      field: 'issuerId',
      dependencyKind: DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
      match: 'material-identity',
      dependencyDigestField: 'authorityDigest',
      dependencyIdentityField: 'publisherId',
    }),
  ]),
});

/** Return the cross-artifact ownership rules declared for one material parser. */
export function deepAlignmentNamedDependencyRules(
  artifactKind: DeepAlignmentArtifactKind,
): readonly DeepAlignmentNamedDependencyRule[] {
  return DEEP_ALIGNMENT_NAMED_DEPENDENCY_RULES[artifactKind]
    ?? NO_NAMED_DEPENDENCY_RULES;
}

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION CONSTANTS
// ───────────────────────────────────────────────────────────────────

const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@#-]{0,255}$/;
const CODE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,127}$/;
const SELECTOR_PATTERN = /^[^\u0000-\u001f\u007f\r\n]{1,256}$/u;
const MAX_SELECTOR_SPACES = 16;
const MAX_DIGESTS = 256;
const MAX_TOKENS = 256;
const MAX_DEPENDENCIES = 64;
const MAX_REASON_LENGTH = 4_096;

const BASE_FIELDS = [
  'artifactId',
  'authorityEpochId',
  'materialDigest',
  'materialRef',
  'dependencies',
  'locator',
  'producerVersion',
] as const;
const LOCATOR_FIELDS = ['scheme', 'artifactRef', 'locatorDigest', 'selector', 'revision'] as const;
const DEPENDENCY_FIELDS = ['artifactKind', 'reference'] as const;

function invalidMaterial(artifactKind: string, field: string): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.INVALID_INPUT,
    'canonicalization',
    'Deep Alignment artifact material violates its closed field contract',
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
  return Object.keys(value).length === fields.length
    && Object.keys(value).every((field) => expected.has(field));
}

function requireRecord(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
  fields: readonly string[],
): Record<string, unknown> {
  if (!isRecord(input) || !hasExactFields(input, fields)) {
    return invalidMaterial(artifactKind, 'shape');
  }
  return input;
}

function requireToken(
  artifactKind: DeepAlignmentArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !TOKEN_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireCode(
  artifactKind: DeepAlignmentArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !CODE_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireDigest(
  artifactKind: DeepAlignmentArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !DIGEST_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireNullableDigest(
  artifactKind: DeepAlignmentArtifactKind,
  field: string,
  value: unknown,
): string | null {
  if (value === null) return null;
  return requireDigest(artifactKind, field, value);
}

function requireDigestArray(
  artifactKind: DeepAlignmentArtifactKind,
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
  artifactKind: DeepAlignmentArtifactKind,
  field: string,
  value: unknown,
  allowEmpty = false,
): readonly string[] {
  if (
    !Array.isArray(value)
    || value.length > MAX_TOKENS
    || (!allowEmpty && value.length === 0)
    || !value.every((entry) => typeof entry === 'string' && TOKEN_PATTERN.test(entry))
  ) {
    return invalidMaterial(artifactKind, field);
  }
  return Object.freeze([...value]);
}

function requireTimestamp(
  artifactKind: DeepAlignmentArtifactKind,
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

function requireReason(
  artifactKind: DeepAlignmentArtifactKind,
  field: string,
  value: unknown,
): string {
  if (
    typeof value !== 'string'
    || value.trim().length === 0
    || value.length > MAX_REASON_LENGTH
  ) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireRatio(
  artifactKind: DeepAlignmentArtifactKind,
  field: string,
  value: unknown,
): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireEnum<T extends string>(
  artifactKind: DeepAlignmentArtifactKind,
  field: string,
  value: unknown,
  allowed: readonly T[],
): T {
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    return invalidMaterial(artifactKind, field);
  }
  return value as T;
}

function requireLocator(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
): DeepAlignmentArtifactLocator {
  const locator = requireRecord(artifactKind, input, LOCATOR_FIELDS);
  if (!['artifact', 'file', 'other'].includes(String(locator.scheme))) {
    return invalidMaterial(artifactKind, 'locator.scheme');
  }
  if (
    typeof locator.selector !== 'string'
    || locator.selector.trim().length === 0
    || !SELECTOR_PATTERN.test(locator.selector)
    || (locator.selector.match(/\s/gu)?.length ?? 0) > MAX_SELECTOR_SPACES
  ) {
    return invalidMaterial(artifactKind, 'locator.selector');
  }
  return Object.freeze({
    scheme: locator.scheme as DeepAlignmentArtifactLocator['scheme'],
    artifactRef: requireToken(artifactKind, 'locator.artifactRef', locator.artifactRef),
    locatorDigest: requireDigest(artifactKind, 'locator.locatorDigest', locator.locatorDigest),
    selector: locator.selector,
    revision: locator.revision === null
      ? null
      : requireToken(artifactKind, 'locator.revision', locator.revision),
  });
}

function requireDependencies(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
  material: Readonly<Record<string, unknown>>,
): readonly DeepAlignmentArtifactDependency[] {
  if (!Array.isArray(input) || input.length > MAX_DEPENDENCIES) {
    return invalidMaterial(artifactKind, 'dependencies');
  }
  const dependencies = input.map((candidate, index) => {
    const dependency = requireRecord(
      artifactKind,
      candidate,
      DEPENDENCY_FIELDS,
    );
    if (
      typeof dependency.artifactKind !== 'string'
      || !(DEEP_ALIGNMENT_ARTIFACT_KIND_REGISTRY as readonly DeepAlignmentArtifactKindRegistration[])
        .some((entry) => entry.artifactKind === dependency.artifactKind)
    ) {
      return invalidMaterial(artifactKind, `dependencies[${index}].artifactKind`);
    }
    let reference: ReturnType<typeof parseSealedArtifactReference>;
    try {
      reference = parseSealedArtifactReference(dependency.reference);
    } catch {
      return invalidMaterial(artifactKind, `dependencies[${index}].reference`);
    }
    if (reference.artifact_kind !== dependency.artifactKind) {
      return invalidMaterial(artifactKind, `dependencies[${index}].reference.artifact_kind`);
    }
    return Object.freeze({
      artifactKind: dependency.artifactKind as DeepAlignmentArtifactKind,
      reference,
    });
  });
  for (const rule of deepAlignmentNamedDependencyRules(artifactKind)) {
    const digestField = rule.match === 'content-digest'
      ? rule.field
      : rule.dependencyDigestField;
    const expectedDigest = material[digestField];
    if (typeof expectedDigest !== 'string' || !DIGEST_PATTERN.test(expectedDigest)) {
      return invalidMaterial(artifactKind, digestField);
    }
    const matchingDependency = dependencies.some((dependency) => (
      dependency.artifactKind === rule.dependencyKind
      && dependency.reference.content_digest === expectedDigest
    ));
    if (!matchingDependency) {
      return invalidMaterial(artifactKind, `dependencies.${rule.field}`);
    }
  }
  return Object.freeze(dependencies);
}

function parseBase(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
): DeepAlignmentArtifactMaterialBase {
  if (
    !isRecord(input)
    || BASE_FIELDS.some((field) => !Object.prototype.hasOwnProperty.call(input, field))
  ) {
    return invalidMaterial(artifactKind, 'shape');
  }
  const value = input;
  return Object.freeze({
    artifactId: requireToken(artifactKind, 'artifactId', value.artifactId),
    authorityEpochId: requireToken(artifactKind, 'authorityEpochId', value.authorityEpochId),
    materialDigest: requireDigest(artifactKind, 'materialDigest', value.materialDigest),
    materialRef: requireToken(artifactKind, 'materialRef', value.materialRef),
    dependencies: requireDependencies(artifactKind, value.dependencies, value),
    locator: requireLocator(artifactKind, value.locator),
    producerVersion: requireToken(artifactKind, 'producerVersion', value.producerVersion),
  });
}

function fields(...extra: readonly string[]): readonly string[] {
  return [...BASE_FIELDS, ...extra];
}

// ───────────────────────────────────────────────────────────────────
// 3. MATERIAL PARSERS
// ───────────────────────────────────────────────────────────────────

function parseAuthorityCapsule(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
): DeepAlignmentAuthorityCapsuleMaterial {
  const value = requireRecord(artifactKind, input, fields(
    'authorityId', 'authoritySourceDigest', 'publisherId', 'compilerFingerprint',
    'ruleManifestDigest', 'applicabilityPolicyDigest', 'capabilityDigest', 'coverageDigest',
    'signatureDigest', 'expiresAt', 'rollbackRef', 'status',
  ));
  return Object.freeze({
    ...parseBase(artifactKind, value),
    authorityId: requireToken(artifactKind, 'authorityId', value.authorityId),
    authoritySourceDigest: requireDigest(artifactKind, 'authoritySourceDigest', value.authoritySourceDigest),
    publisherId: requireToken(artifactKind, 'publisherId', value.publisherId),
    compilerFingerprint: requireDigest(artifactKind, 'compilerFingerprint', value.compilerFingerprint),
    ruleManifestDigest: requireDigest(artifactKind, 'ruleManifestDigest', value.ruleManifestDigest),
    applicabilityPolicyDigest: requireDigest(
      artifactKind,
      'applicabilityPolicyDigest',
      value.applicabilityPolicyDigest,
    ),
    capabilityDigest: requireDigest(artifactKind, 'capabilityDigest', value.capabilityDigest),
    coverageDigest: requireDigest(artifactKind, 'coverageDigest', value.coverageDigest),
    signatureDigest: requireDigest(artifactKind, 'signatureDigest', value.signatureDigest),
    expiresAt: requireTimestamp(artifactKind, 'expiresAt', value.expiresAt),
    rollbackRef: value.rollbackRef === null
      ? null
      : requireToken(artifactKind, 'rollbackRef', value.rollbackRef),
    status: requireEnum(artifactKind, 'status', value.status, ['valid']),
  });
}

function parseLaneConfiguration(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
): DeepAlignmentLaneConfigurationMaterial {
  const value = requireRecord(artifactKind, input, fields(
    'laneId', 'artifactClass', 'scopeDigest', 'adapterContractDigest',
    'selectedCorpusDigest', 'omittedScopeDigest', 'unresolvedScopeDigest',
    'protectedFilesDigest',
  ));
  return Object.freeze({
    ...parseBase(artifactKind, value),
    laneId: requireToken(artifactKind, 'laneId', value.laneId),
    artifactClass: requireCode(artifactKind, 'artifactClass', value.artifactClass),
    scopeDigest: requireDigest(artifactKind, 'scopeDigest', value.scopeDigest),
    adapterContractDigest: requireDigest(
      artifactKind,
      'adapterContractDigest',
      value.adapterContractDigest,
    ),
    selectedCorpusDigest: requireDigest(
      artifactKind,
      'selectedCorpusDigest',
      value.selectedCorpusDigest,
    ),
    omittedScopeDigest: requireDigest(artifactKind, 'omittedScopeDigest', value.omittedScopeDigest),
    unresolvedScopeDigest: requireDigest(
      artifactKind,
      'unresolvedScopeDigest',
      value.unresolvedScopeDigest,
    ),
    protectedFilesDigest: requireDigest(
      artifactKind,
      'protectedFilesDigest',
      value.protectedFilesDigest,
    ),
  });
}

function parseRuleManifest(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
): DeepAlignmentRuleManifestMaterial {
  const value = requireRecord(artifactKind, input, fields(
    'manifestId', 'orderedRuleIds', 'compilerFingerprint', 'ruleIrDigest',
    'applicabilityPolicyDigest', 'ruleSchemaVersion',
  ));
  return Object.freeze({
    ...parseBase(artifactKind, value),
    manifestId: requireToken(artifactKind, 'manifestId', value.manifestId),
    orderedRuleIds: requireTokenArray(artifactKind, 'orderedRuleIds', value.orderedRuleIds),
    compilerFingerprint: requireDigest(artifactKind, 'compilerFingerprint', value.compilerFingerprint),
    ruleIrDigest: requireDigest(artifactKind, 'ruleIrDigest', value.ruleIrDigest),
    applicabilityPolicyDigest: requireDigest(
      artifactKind,
      'applicabilityPolicyDigest',
      value.applicabilityPolicyDigest,
    ),
    ruleSchemaVersion: requireToken(artifactKind, 'ruleSchemaVersion', value.ruleSchemaVersion),
  });
}

function parseApplicabilityDecision(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
): DeepAlignmentApplicabilityDecisionMaterial {
  const value = requireRecord(artifactKind, input, fields(
    'decisionId', 'laneId', 'subjectId', 'ruleId', 'subjectSnapshotDigest',
    'predicateDigest', 'targetFactDigest', 'authorityValidationDigest',
    'evaluatorFingerprint', 'result', 'reasonCode',
  ));
  return Object.freeze({
    ...parseBase(artifactKind, value),
    decisionId: requireToken(artifactKind, 'decisionId', value.decisionId),
    laneId: requireToken(artifactKind, 'laneId', value.laneId),
    subjectId: requireToken(artifactKind, 'subjectId', value.subjectId),
    ruleId: requireToken(artifactKind, 'ruleId', value.ruleId),
    subjectSnapshotDigest: requireDigest(
      artifactKind,
      'subjectSnapshotDigest',
      value.subjectSnapshotDigest,
    ),
    predicateDigest: requireDigest(artifactKind, 'predicateDigest', value.predicateDigest),
    targetFactDigest: requireDigest(artifactKind, 'targetFactDigest', value.targetFactDigest),
    authorityValidationDigest: requireDigest(
      artifactKind,
      'authorityValidationDigest',
      value.authorityValidationDigest,
    ),
    evaluatorFingerprint: requireDigest(
      artifactKind,
      'evaluatorFingerprint',
      value.evaluatorFingerprint,
    ),
    result: requireEnum(
      artifactKind,
      'result',
      value.result,
      ['applicable', 'blocked', 'not-applicable', 'unresolved'],
    ),
    reasonCode: requireCode(artifactKind, 'reasonCode', value.reasonCode),
  });
}

function parseDiscoveryManifest(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
): DeepAlignmentDiscoveryManifestMaterial {
  const value = requireRecord(artifactKind, input, fields(
    'manifestId', 'laneId', 'adapterContractDigest', 'selectedScopeDigest',
    'artifactDigests', 'omittedScopeDigest', 'unresolvedScopeDigest',
    'corpusPartitionDigest', 'watermarkDigest',
  ));
  return Object.freeze({
    ...parseBase(artifactKind, value),
    manifestId: requireToken(artifactKind, 'manifestId', value.manifestId),
    laneId: requireToken(artifactKind, 'laneId', value.laneId),
    adapterContractDigest: requireDigest(
      artifactKind,
      'adapterContractDigest',
      value.adapterContractDigest,
    ),
    selectedScopeDigest: requireDigest(artifactKind, 'selectedScopeDigest', value.selectedScopeDigest),
    artifactDigests: requireDigestArray(artifactKind, 'artifactDigests', value.artifactDigests),
    omittedScopeDigest: requireDigest(artifactKind, 'omittedScopeDigest', value.omittedScopeDigest),
    unresolvedScopeDigest: requireDigest(
      artifactKind,
      'unresolvedScopeDigest',
      value.unresolvedScopeDigest,
    ),
    corpusPartitionDigest: requireDigest(
      artifactKind,
      'corpusPartitionDigest',
      value.corpusPartitionDigest,
    ),
    watermarkDigest: requireDigest(artifactKind, 'watermarkDigest', value.watermarkDigest),
  });
}

function parseTargetSnapshot(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
): DeepAlignmentTargetSnapshotMaterial {
  const value = requireRecord(artifactKind, input, fields(
    'targetId', 'laneId', 'subjectId', 'subjectType', 'sourceVersionDigest',
    'subjectDigest', 'parentSnapshotDigest', 'snapshotDigest', 'capturedAt',
  ));
  return Object.freeze({
    ...parseBase(artifactKind, value),
    targetId: requireToken(artifactKind, 'targetId', value.targetId),
    laneId: requireToken(artifactKind, 'laneId', value.laneId),
    subjectId: requireToken(artifactKind, 'subjectId', value.subjectId),
    subjectType: requireEnum(
      artifactKind,
      'subjectType',
      value.subjectType,
      ['artifact', 'directory', 'file', 'repository', 'symbol'],
    ),
    sourceVersionDigest: requireDigest(
      artifactKind,
      'sourceVersionDigest',
      value.sourceVersionDigest,
    ),
    subjectDigest: requireDigest(artifactKind, 'subjectDigest', value.subjectDigest),
    parentSnapshotDigest: requireNullableDigest(
      artifactKind,
      'parentSnapshotDigest',
      value.parentSnapshotDigest,
    ),
    snapshotDigest: requireDigest(artifactKind, 'snapshotDigest', value.snapshotDigest),
    capturedAt: requireTimestamp(artifactKind, 'capturedAt', value.capturedAt),
  });
}

function parseVerificationInput(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
  expectedRole: DeepAlignmentVerificationInputRole,
): DeepAlignmentVerificationInputMaterial {
  const value = requireRecord(artifactKind, input, fields(
    'inputId', 'laneId', 'ruleId', 'subjectSnapshotDigest', 'applicabilityDecisionDigest',
    'inputDigest', 'sourceDigest', 'producerFingerprint', 'evidenceDigests', 'inputRole',
  ));
  return Object.freeze({
    ...parseBase(artifactKind, value),
    inputId: requireToken(artifactKind, 'inputId', value.inputId),
    laneId: requireToken(artifactKind, 'laneId', value.laneId),
    ruleId: requireToken(artifactKind, 'ruleId', value.ruleId),
    subjectSnapshotDigest: requireDigest(
      artifactKind,
      'subjectSnapshotDigest',
      value.subjectSnapshotDigest,
    ),
    applicabilityDecisionDigest: requireDigest(
      artifactKind,
      'applicabilityDecisionDigest',
      value.applicabilityDecisionDigest,
    ),
    inputDigest: requireDigest(artifactKind, 'inputDigest', value.inputDigest),
    sourceDigest: requireDigest(artifactKind, 'sourceDigest', value.sourceDigest),
    producerFingerprint: requireDigest(
      artifactKind,
      'producerFingerprint',
      value.producerFingerprint,
    ),
    evidenceDigests: requireDigestArray(artifactKind, 'evidenceDigests', value.evidenceDigests),
    inputRole: requireEnum(artifactKind, 'inputRole', value.inputRole, [expectedRole]),
  });
}

function parseWitnessMatrix(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
): DeepAlignmentWitnessMatrixMaterial {
  const value = requireRecord(artifactKind, input, fields(
    'matrixId', 'laneId', 'ruleId', 'subjectSnapshotDigest', 'witnessKinds',
    'witnessDigests', 'replayRecipeDigests', 'coverageGapDigests',
    'sourceAuthorityEpochId', 'verifierFingerprint',
  ));
  const witnessKinds = requireTokenArray(artifactKind, 'witnessKinds', value.witnessKinds);
  const allowedWitnessKinds: readonly DeepAlignmentWitnessKind[] = [
    'boundary', 'conforming', 'relational', 'stateful', 'violating',
  ];
  witnessKinds.forEach((kind, index) => {
    requireEnum(artifactKind, `witnessKinds[${index}]`, kind, allowedWitnessKinds);
  });
  return Object.freeze({
    ...parseBase(artifactKind, value),
    matrixId: requireToken(artifactKind, 'matrixId', value.matrixId),
    laneId: requireToken(artifactKind, 'laneId', value.laneId),
    ruleId: requireToken(artifactKind, 'ruleId', value.ruleId),
    subjectSnapshotDigest: requireDigest(
      artifactKind,
      'subjectSnapshotDigest',
      value.subjectSnapshotDigest,
    ),
    witnessKinds: Object.freeze(witnessKinds as readonly DeepAlignmentWitnessKind[]),
    witnessDigests: requireDigestArray(artifactKind, 'witnessDigests', value.witnessDigests),
    replayRecipeDigests: requireDigestArray(
      artifactKind,
      'replayRecipeDigests',
      value.replayRecipeDigests,
    ),
    coverageGapDigests: requireDigestArray(
      artifactKind,
      'coverageGapDigests',
      value.coverageGapDigests,
      true,
    ),
    sourceAuthorityEpochId: value.sourceAuthorityEpochId === null
      ? null
      : requireToken(artifactKind, 'sourceAuthorityEpochId', value.sourceAuthorityEpochId),
    verifierFingerprint: requireDigest(
      artifactKind,
      'verifierFingerprint',
      value.verifierFingerprint,
    ),
  });
}

function parseFindingEvidence(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
): DeepAlignmentFindingEvidenceMaterial {
  const value = requireRecord(artifactKind, input, fields(
    'findingId', 'laneId', 'ruleId', 'subjectSnapshotDigest', 'authorityDigest',
    'applicabilityDecisionDigest', 'observationDigest', 'reProbeReceiptDigest',
    'evidenceDigests', 'verifierFingerprint', 'verifiedLevel', 'evidenceClass',
    'severity', 'confidence',
  ));
  return Object.freeze({
    ...parseBase(artifactKind, value),
    findingId: requireToken(artifactKind, 'findingId', value.findingId),
    laneId: requireToken(artifactKind, 'laneId', value.laneId),
    ruleId: requireToken(artifactKind, 'ruleId', value.ruleId),
    subjectSnapshotDigest: requireDigest(
      artifactKind,
      'subjectSnapshotDigest',
      value.subjectSnapshotDigest,
    ),
    authorityDigest: requireDigest(artifactKind, 'authorityDigest', value.authorityDigest),
    applicabilityDecisionDigest: requireDigest(
      artifactKind,
      'applicabilityDecisionDigest',
      value.applicabilityDecisionDigest,
    ),
    observationDigest: requireDigest(artifactKind, 'observationDigest', value.observationDigest),
    reProbeReceiptDigest: requireDigest(
      artifactKind,
      'reProbeReceiptDigest',
      value.reProbeReceiptDigest,
    ),
    evidenceDigests: requireDigestArray(artifactKind, 'evidenceDigests', value.evidenceDigests),
    verifierFingerprint: requireDigest(
      artifactKind,
      'verifierFingerprint',
      value.verifierFingerprint,
    ),
    verifiedLevel: requireEnum(artifactKind, 'verifiedLevel', value.verifiedLevel, [
      'inconclusive', 'verified',
    ]),
    evidenceClass: requireEnum(artifactKind, 'evidenceClass', value.evidenceClass, [
      'deterministic', 'reasoning', 'relational', 'schema',
    ]),
    severity: requireEnum(artifactKind, 'severity', value.severity, [
      'P0', 'P1', 'P2', 'none',
    ]),
    confidence: requireRatio(artifactKind, 'confidence', value.confidence),
  });
}

function parseGovernedException(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
): DeepAlignmentGovernedExceptionMaterial {
  const value = requireRecord(artifactKind, input, fields(
    'exceptionId', 'findingDigest', 'laneId', 'ruleId', 'subjectSnapshotDigest',
    'authorityDigest', 'ownerId', 'issuerId', 'justificationReason', 'scopeDigest',
    'verifierFingerprint', 'issuedAt', 'expiresAt', 'status', 'invalidationTriggers',
    'invalidationReason',
  ));
  const invalidationTriggers = requireTokenArray(
    artifactKind,
    'invalidationTriggers',
    value.invalidationTriggers,
  );
  const allowedInvalidations: readonly DeepAlignmentExceptionInvalidation[] = [
    'authority-changed', 'expired', 'scope-changed', 'subject-changed', 'verifier-changed',
  ];
  invalidationTriggers.forEach((trigger, index) => {
    requireEnum(artifactKind, `invalidationTriggers[${index}]`, trigger, allowedInvalidations);
  });
  return Object.freeze({
    ...parseBase(artifactKind, value),
    exceptionId: requireToken(artifactKind, 'exceptionId', value.exceptionId),
    findingDigest: requireDigest(artifactKind, 'findingDigest', value.findingDigest),
    laneId: requireToken(artifactKind, 'laneId', value.laneId),
    ruleId: requireToken(artifactKind, 'ruleId', value.ruleId),
    subjectSnapshotDigest: requireDigest(
      artifactKind,
      'subjectSnapshotDigest',
      value.subjectSnapshotDigest,
    ),
    authorityDigest: requireDigest(artifactKind, 'authorityDigest', value.authorityDigest),
    ownerId: requireToken(artifactKind, 'ownerId', value.ownerId),
    issuerId: requireToken(artifactKind, 'issuerId', value.issuerId),
    justificationReason: requireReason(
      artifactKind,
      'justificationReason',
      value.justificationReason,
    ),
    scopeDigest: requireDigest(artifactKind, 'scopeDigest', value.scopeDigest),
    verifierFingerprint: requireDigest(
      artifactKind,
      'verifierFingerprint',
      value.verifierFingerprint,
    ),
    issuedAt: requireTimestamp(artifactKind, 'issuedAt', value.issuedAt),
    expiresAt: requireTimestamp(artifactKind, 'expiresAt', value.expiresAt),
    status: requireEnum(artifactKind, 'status', value.status, [
      'active', 'expired', 'invalidated',
    ]),
    invalidationTriggers: Object.freeze(invalidationTriggers as readonly DeepAlignmentExceptionInvalidation[]),
    invalidationReason: value.invalidationReason === null
      ? null
      : requireReason(artifactKind, 'invalidationReason', value.invalidationReason),
  });
}

function parseVerdict(
  artifactKind: DeepAlignmentArtifactKind,
  field: string,
  value: unknown,
): DeepAlignmentVerdict {
  return requireEnum(artifactKind, field, value, [
    'blocked', 'conformant', 'inconclusive', 'non-conformant', 'not-applicable', 'untested',
  ]);
}

function parseConvergenceSnapshot(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
): DeepAlignmentConvergenceSnapshotMaterial {
  const value = requireRecord(artifactKind, input, fields(
    'snapshotId', 'laneId', 'orderedInputDigests', 'coverageDigest', 'stabilityDigest',
    'findingsViewDigest', 'exceptionViewDigest', 'unresolvedFindingDigests',
    'laneVerdict', 'evaluatorVersion', 'watermarkDigest',
  ));
  return Object.freeze({
    ...parseBase(artifactKind, value),
    snapshotId: requireToken(artifactKind, 'snapshotId', value.snapshotId),
    laneId: requireToken(artifactKind, 'laneId', value.laneId),
    orderedInputDigests: requireDigestArray(
      artifactKind,
      'orderedInputDigests',
      value.orderedInputDigests,
    ),
    coverageDigest: requireDigest(artifactKind, 'coverageDigest', value.coverageDigest),
    stabilityDigest: requireDigest(artifactKind, 'stabilityDigest', value.stabilityDigest),
    findingsViewDigest: requireDigest(
      artifactKind,
      'findingsViewDigest',
      value.findingsViewDigest,
    ),
    exceptionViewDigest: requireDigest(
      artifactKind,
      'exceptionViewDigest',
      value.exceptionViewDigest,
    ),
    unresolvedFindingDigests: requireDigestArray(
      artifactKind,
      'unresolvedFindingDigests',
      value.unresolvedFindingDigests,
      true,
    ),
    laneVerdict: parseVerdict(artifactKind, 'laneVerdict', value.laneVerdict),
    evaluatorVersion: requireToken(artifactKind, 'evaluatorVersion', value.evaluatorVersion),
    watermarkDigest: requireDigest(artifactKind, 'watermarkDigest', value.watermarkDigest),
  });
}

function parseReport(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
): DeepAlignmentReportMaterial {
  const value = requireRecord(artifactKind, input, fields(
    'reportId', 'laneId', 'orderedInputDigests', 'convergenceSnapshotDigest',
    'findingsViewDigest', 'exceptionViewDigest', 'unresolvedFindingDigests',
    'laneVerdict', 'overallVerdict', 'reportDigest', 'reportRef',
    'reducerVersion', 'projectionVersion',
  ));
  return Object.freeze({
    ...parseBase(artifactKind, value),
    reportId: requireToken(artifactKind, 'reportId', value.reportId),
    laneId: requireToken(artifactKind, 'laneId', value.laneId),
    orderedInputDigests: requireDigestArray(
      artifactKind,
      'orderedInputDigests',
      value.orderedInputDigests,
    ),
    convergenceSnapshotDigest: requireDigest(
      artifactKind,
      'convergenceSnapshotDigest',
      value.convergenceSnapshotDigest,
    ),
    findingsViewDigest: requireDigest(
      artifactKind,
      'findingsViewDigest',
      value.findingsViewDigest,
    ),
    exceptionViewDigest: requireDigest(
      artifactKind,
      'exceptionViewDigest',
      value.exceptionViewDigest,
    ),
    unresolvedFindingDigests: requireDigestArray(
      artifactKind,
      'unresolvedFindingDigests',
      value.unresolvedFindingDigests,
      true,
    ),
    laneVerdict: parseVerdict(artifactKind, 'laneVerdict', value.laneVerdict),
    overallVerdict: parseVerdict(artifactKind, 'overallVerdict', value.overallVerdict),
    reportDigest: requireDigest(artifactKind, 'reportDigest', value.reportDigest),
    reportRef: requireToken(artifactKind, 'reportRef', value.reportRef),
    reducerVersion: requireToken(artifactKind, 'reducerVersion', value.reducerVersion),
    projectionVersion: requireToken(artifactKind, 'projectionVersion', value.projectionVersion),
  });
}

function parseResumeSaveHandoff(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
): DeepAlignmentResumeSaveHandoffMaterial {
  const value = requireRecord(artifactKind, input, fields(
    'handoffId', 'handoffRole', 'referenceSetDigest', 'priorLineageDigest', 'driftDigest',
    'affectedLaneDigests', 'affectedFindingDigests', 'continuityPayloadDigest',
    'offeredViewDigest', 'offeredViewRef', 'targetPacket', 'driftStatus', 'handoffVersion',
  ));
  return Object.freeze({
    ...parseBase(artifactKind, value),
    handoffId: requireToken(artifactKind, 'handoffId', value.handoffId),
    handoffRole: requireEnum(artifactKind, 'handoffRole', value.handoffRole, ['resume', 'save']),
    referenceSetDigest: requireDigest(artifactKind, 'referenceSetDigest', value.referenceSetDigest),
    priorLineageDigest: requireDigest(artifactKind, 'priorLineageDigest', value.priorLineageDigest),
    driftDigest: requireDigest(artifactKind, 'driftDigest', value.driftDigest),
    affectedLaneDigests: requireDigestArray(
      artifactKind,
      'affectedLaneDigests',
      value.affectedLaneDigests,
      true,
    ),
    affectedFindingDigests: requireDigestArray(
      artifactKind,
      'affectedFindingDigests',
      value.affectedFindingDigests,
      true,
    ),
    continuityPayloadDigest: requireDigest(
      artifactKind,
      'continuityPayloadDigest',
      value.continuityPayloadDigest,
    ),
    offeredViewDigest: requireDigest(artifactKind, 'offeredViewDigest', value.offeredViewDigest),
    offeredViewRef: requireToken(artifactKind, 'offeredViewRef', value.offeredViewRef),
    targetPacket: requireToken(artifactKind, 'targetPacket', value.targetPacket),
    driftStatus: requireEnum(artifactKind, 'driftStatus', value.driftStatus, [
      'changed', 'expired', 'missing', 'unchanged', 'unverifiable',
    ]),
    handoffVersion: requireToken(artifactKind, 'handoffVersion', value.handoffVersion),
  });
}

function unsupportedArtifactKind(artifactKind: never): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.UNSUPPORTED_ARTIFACT_KIND,
    'canonicalization',
    'Deep Alignment artifact kind is not registered',
    { artifactKind: String(artifactKind) },
  );
}

export function parseDeepAlignmentArtifactMaterial(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
): DeepAlignmentArtifactMaterial {
  switch (artifactKind) {
    case DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE:
      return parseAuthorityCapsule(artifactKind, input);
    case DeepAlignmentArtifactKinds.LANE_CONFIGURATION:
      return parseLaneConfiguration(artifactKind, input);
    case DeepAlignmentArtifactKinds.RULE_MANIFEST:
      return parseRuleManifest(artifactKind, input);
    case DeepAlignmentArtifactKinds.APPLICABILITY_DECISION:
      return parseApplicabilityDecision(artifactKind, input);
    case DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST:
      return parseDiscoveryManifest(artifactKind, input);
    case DeepAlignmentArtifactKinds.TARGET_SNAPSHOT:
      return parseTargetSnapshot(artifactKind, input);
    case DeepAlignmentArtifactKinds.DETECTOR_INPUT:
      return parseVerificationInput(artifactKind, input, 'detector');
    case DeepAlignmentArtifactKinds.VERIFIER_INPUT:
      return parseVerificationInput(artifactKind, input, 'verifier');
    case DeepAlignmentArtifactKinds.WITNESS_MATRIX:
      return parseWitnessMatrix(artifactKind, input);
    case DeepAlignmentArtifactKinds.FINDING_EVIDENCE:
      return parseFindingEvidence(artifactKind, input);
    case DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION:
      return parseGovernedException(artifactKind, input);
    case DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT:
      return parseConvergenceSnapshot(artifactKind, input);
    case DeepAlignmentArtifactKinds.ALIGNMENT_REPORT:
      return parseReport(artifactKind, input);
    case DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF:
      return parseResumeSaveHandoff(artifactKind, input);
    default:
      return unsupportedArtifactKind(artifactKind);
  }
}

function canonicalizeDeepAlignmentMaterial(
  artifactKind: DeepAlignmentArtifactKind,
  input: unknown,
): Uint8Array {
  const material = parseDeepAlignmentArtifactMaterial(artifactKind, input);
  return Uint8Array.from(canonicalBytes({ artifactKind, material }));
}

export function decodeDeepAlignmentArtifactBytes(
  artifactKind: DeepAlignmentArtifactKind,
  bytes: readonly number[],
): DeepAlignmentArtifactMaterial {
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(bytes).toString('utf8')) as unknown;
  } catch {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      'read',
      'Deep Alignment sealed bytes are not valid JSON',
      { artifactKind },
    );
  }
  const envelope = requireRecord(artifactKind, parsed, ['artifactKind', 'material']);
  if (envelope.artifactKind !== artifactKind) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.INVALID_INPUT,
      'read',
      'Deep Alignment sealed bytes contain the wrong artifact kind',
      { artifactKind },
    );
  }
  const material = parseDeepAlignmentArtifactMaterial(artifactKind, envelope.material);
  const expected = Uint8Array.from(canonicalBytes({ artifactKind, material }));
  if (Buffer.compare(Buffer.from(bytes), Buffer.from(expected)) !== 0) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      'read',
      'Deep Alignment sealed bytes do not reproduce their closed material',
      { artifactKind },
    );
  }
  return material;
}

// ───────────────────────────────────────────────────────────────────
// 4. SHARED-SEALER ADAPTER
// ───────────────────────────────────────────────────────────────────

export function createDeepAlignmentArtifactCanonicalizerRegistry(): ArtifactCanonicalizerRegistry {
  const definitions: ArtifactCanonicalizerDefinition[] =
    DEEP_ALIGNMENT_ARTIFACT_KIND_REGISTRY.map((entry) => ({
      artifactKind: entry.artifactKind,
      canonicalizationVersion: entry.canonicalizationVersion,
      mediaType: entry.mediaType,
      implementationIdentity: 'deep-alignment-binding-canonicalizer-v1',
      canonicalize: (input: unknown): Uint8Array => (
        canonicalizeDeepAlignmentMaterial(entry.artifactKind, input)
      ),
    }));
  return new ArtifactCanonicalizerRegistry(definitions);
}
