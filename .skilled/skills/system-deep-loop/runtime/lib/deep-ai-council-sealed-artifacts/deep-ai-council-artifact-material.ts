// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Artifact Material
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes } from '../event-envelope/index.js';
import {
  ArtifactCanonicalizerRegistry,
  SealedArtifactError,
  SealedArtifactErrorCodes,
} from '../sealed-reference-artifacts/index.js';
import { DeepAiCouncilEventStems } from '../deep-ai-council-ledger-schema/index.js';
import { DeepAiCouncilArtifactKinds } from './deep-ai-council-sealed-artifact-types.js';

import type { DeepAiCouncilEventStem } from '../deep-ai-council-ledger-schema/index.js';
import type {
  ArtifactCanonicalizerDefinition,
} from '../sealed-reference-artifacts/index.js';
import type {
  DeepAiCouncilArtifactLocator,
  DeepAiCouncilArtifactKind,
  DeepAiCouncilArtifactKindRegistration,
  DeepAiCouncilArtifactMaterial,
  DeepAiCouncilArtifactMaterialBase,
  DeepAiCouncilArtifactScopeDescriptor,
  DeepAiCouncilArtifactSourceEventRange,
  DeepAiCouncilArtifactVisibility,
} from './deep-ai-council-sealed-artifact-types.js';

export const DEEP_AI_COUNCIL_ARTIFACT_CANONICALIZATION_VERSION =
  'deep-ai-council-binding@1';
export const DEEP_AI_COUNCIL_ARTIFACT_MEDIA_TYPE =
  'application/vnd.openai.deep-ai-council-binding+json';

const REGISTRY_ROWS = [
  [DeepAiCouncilArtifactKinds.TARGET_SNAPSHOT, 'init', 'input'],
  [DeepAiCouncilArtifactKinds.TASK_CLASS, 'init', 'input'],
  [DeepAiCouncilArtifactKinds.COUNCIL_STRATEGY, 'init', 'input'],
  [DeepAiCouncilArtifactKinds.PROTOCOL_POLICY, 'init', 'input'],
  [DeepAiCouncilArtifactKinds.PROMPT_CAPABILITY, 'init', 'input'],
  [DeepAiCouncilArtifactKinds.SEAT_ROSTER, 'init', 'input'],
  [DeepAiCouncilArtifactKinds.REASONING_METHOD, 'init', 'input'],
  [DeepAiCouncilArtifactKinds.BUDGET_POLICY, 'init', 'input'],
  [DeepAiCouncilArtifactKinds.CONVERGENCE_POLICY, 'init', 'input'],
  [DeepAiCouncilArtifactKinds.CONTRACT_REVISION, 'init', 'input'],
  [DeepAiCouncilArtifactKinds.CONTROL_ARM, 'init', 'input'],
  [DeepAiCouncilArtifactKinds.TEST_FIXTURE, 'init', 'input'],
  [DeepAiCouncilArtifactKinds.SEAT_PROPOSAL, 'deliberate', 'output'],
  [DeepAiCouncilArtifactKinds.CRITIQUE_RECORD, 'critique', 'output'],
  [DeepAiCouncilArtifactKinds.BLINDED_CANDIDATE, 'judge', 'output'],
  [DeepAiCouncilArtifactKinds.PAIRWISE_JUDGMENT, 'judge', 'output'],
  [DeepAiCouncilArtifactKinds.BIAS_PROBE, 'judge', 'output'],
  [DeepAiCouncilArtifactKinds.COUNTERFACTUAL_PROBE, 'judge', 'output'],
  [DeepAiCouncilArtifactKinds.STANCE_EVIDENCE, 'deliberate', 'output'],
  [DeepAiCouncilArtifactKinds.CONVERGENCE_EVIDENCE, 'converge', 'output'],
  [DeepAiCouncilArtifactKinds.SYNTHESIS, 'synthesize', 'output'],
  [DeepAiCouncilArtifactKinds.MINORITY_RECORD, 'converge', 'output'],
  [DeepAiCouncilArtifactKinds.UNRESOLVED_VALUE, 'converge', 'output'],
  [DeepAiCouncilArtifactKinds.COUNCIL_ARTIFACT, 'artifact', 'output'],
  [DeepAiCouncilArtifactKinds.TEST_GATE_EVIDENCE, 'test-gate', 'output'],
] as const;

export const DEEP_AI_COUNCIL_ARTIFACT_KIND_REGISTRY: readonly DeepAiCouncilArtifactKindRegistration[] =
  Object.freeze(REGISTRY_ROWS.map(([artifactKind, lifecycle, materialFamily]) => Object.freeze({
    artifactKind,
    lifecycle,
    materialFamily,
    canonicalizationVersion: DEEP_AI_COUNCIL_ARTIFACT_CANONICALIZATION_VERSION,
    mediaType: DEEP_AI_COUNCIL_ARTIFACT_MEDIA_TYPE,
  })));

const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,127}$/;
const SELECTOR_PATTERN = /^(?:[A-Za-z][A-Za-z0-9._/-]*:[A-Za-z0-9._:/#\[\]-]+|#[A-Za-z0-9._:/-]+|\.[A-Za-z0-9._:/-]+|\/[A-Za-z0-9._~:/?#\[\]@!$&'()*+,;=%-]+)$/u;
const MAX_SELECTOR_SPACES = 16;
const MAX_DIGESTS = 256;
const MAX_AUTHORITY_EPOCH = 0x7fffffff;

const MATERIAL_FIELDS = [
  'artifactId',
  'materialDigest',
  'materialRef',
  'scope',
  'sourceEventRange',
  'schemaVersion',
  'policyVersion',
  'replayFingerprint',
  'authorityEpoch',
  'dependencyDigests',
  'visibility',
  'supersedesArtifactDigest',
  'locator',
  'producerVersion',
] as const;
const SCOPE_FIELDS = ['runId', 'roundId', 'artifactId'] as const;
const SOURCE_RANGE_FIELDS = ['firstEventId', 'lastEventId', 'firstStem', 'lastStem'] as const;
const LOCATOR_FIELDS = ['scheme', 'locatorDigest', 'selector', 'revision'] as const;

const REGISTERED_KINDS: ReadonlySet<string> = new Set(
  DEEP_AI_COUNCIL_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind),
);
const REGISTERED_STEMS: ReadonlySet<string> = new Set(DeepAiCouncilEventStems);

const PRIVATE_KINDS: ReadonlySet<string> = new Set([
  DeepAiCouncilArtifactKinds.PROMPT_CAPABILITY,
  DeepAiCouncilArtifactKinds.SEAT_ROSTER,
  DeepAiCouncilArtifactKinds.REASONING_METHOD,
  DeepAiCouncilArtifactKinds.SEAT_PROPOSAL,
  DeepAiCouncilArtifactKinds.CRITIQUE_RECORD,
  DeepAiCouncilArtifactKinds.STANCE_EVIDENCE,
]);
const BLINDED_KINDS: ReadonlySet<string> = new Set([
  DeepAiCouncilArtifactKinds.BLINDED_CANDIDATE,
]);
const JUDGMENT_KINDS: ReadonlySet<string> = new Set([
  DeepAiCouncilArtifactKinds.PAIRWISE_JUDGMENT,
  DeepAiCouncilArtifactKinds.BIAS_PROBE,
  DeepAiCouncilArtifactKinds.COUNTERFACTUAL_PROBE,
]);
const TEST_GATE_KINDS: ReadonlySet<string> = new Set([
  DeepAiCouncilArtifactKinds.TEST_FIXTURE,
  DeepAiCouncilArtifactKinds.TEST_GATE_EVIDENCE,
]);

function invalidMaterial(artifactKind: string, field: string): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.INVALID_INPUT,
    'canonicalization',
    'Deep AI Council artifact material violates its closed field contract',
    { artifactKind, field },
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
  return keys.length === fields.length && keys.every((field) => expected.has(field));
}

function requireRecord(
  artifactKind: DeepAiCouncilArtifactKind,
  input: unknown,
  fields: readonly string[],
): Record<string, unknown> {
  if (!isRecord(input) || !hasExactFields(input, fields)) return invalidMaterial(artifactKind, 'shape');
  return input;
}

function requireToken(
  artifactKind: DeepAiCouncilArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !TOKEN_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireDigest(
  artifactKind: DeepAiCouncilArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !DIGEST_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireDigestArray(
  artifactKind: DeepAiCouncilArtifactKind,
  field: string,
  value: unknown,
): readonly string[] {
  if (
    !Array.isArray(value)
    || value.length > MAX_DIGESTS
    || !value.every((entry) => typeof entry === 'string' && DIGEST_PATTERN.test(entry))
  ) {
    return invalidMaterial(artifactKind, field);
  }
  return Object.freeze([...value]);
}

function requireEnum<T extends string>(
  artifactKind: DeepAiCouncilArtifactKind,
  field: string,
  value: unknown,
  allowed: readonly T[],
): T {
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    return invalidMaterial(artifactKind, field);
  }
  return value as T;
}

function requireScope(
  artifactKind: DeepAiCouncilArtifactKind,
  input: unknown,
): DeepAiCouncilArtifactScopeDescriptor {
  const scope = requireRecord(artifactKind, input, SCOPE_FIELDS);
  const result = {
    runId: requireToken(artifactKind, 'scope.runId', scope.runId),
    roundId: requireToken(artifactKind, 'scope.roundId', scope.roundId),
    artifactId: requireToken(artifactKind, 'scope.artifactId', scope.artifactId),
  };
  return Object.freeze(result);
}

function requireSourceEventRange(
  artifactKind: DeepAiCouncilArtifactKind,
  input: unknown,
): DeepAiCouncilArtifactSourceEventRange {
  const range = requireRecord(artifactKind, input, SOURCE_RANGE_FIELDS);
  if (!REGISTERED_STEMS.has(String(range.firstStem))) {
    return invalidMaterial(artifactKind, 'sourceEventRange.firstStem');
  }
  if (!REGISTERED_STEMS.has(String(range.lastStem))) {
    return invalidMaterial(artifactKind, 'sourceEventRange.lastStem');
  }
  return Object.freeze({
    firstEventId: requireToken(artifactKind, 'sourceEventRange.firstEventId', range.firstEventId),
    lastEventId: requireToken(artifactKind, 'sourceEventRange.lastEventId', range.lastEventId),
    firstStem: range.firstStem as DeepAiCouncilEventStem,
    lastStem: range.lastStem as DeepAiCouncilEventStem,
  });
}

function requireLocator(
  artifactKind: DeepAiCouncilArtifactKind,
  input: unknown,
): DeepAiCouncilArtifactLocator {
  const locator = requireRecord(artifactKind, input, LOCATOR_FIELDS);
  const selector = locator.selector;
  if (
    typeof selector !== 'string'
    || selector.trim().length === 0
    || selector.length > 256
    || !SELECTOR_PATTERN.test(selector)
    || (selector.match(/\s/gu)?.length ?? 0) > MAX_SELECTOR_SPACES
  ) {
    return invalidMaterial(artifactKind, 'locator.selector');
  }
  return Object.freeze({
    scheme: requireEnum(artifactKind, 'locator.scheme', locator.scheme, ['artifact', 'file', 'url']),
    locatorDigest: requireDigest(artifactKind, 'locator.locatorDigest', locator.locatorDigest),
    selector,
    revision: locator.revision === null
      ? null
      : requireToken(artifactKind, 'locator.revision', locator.revision),
  });
}

function expectedVisibility(artifactKind: DeepAiCouncilArtifactKind): DeepAiCouncilArtifactVisibility[] {
  if (PRIVATE_KINDS.has(artifactKind)) return ['private-seat'];
  if (BLINDED_KINDS.has(artifactKind)) return ['blinded'];
  if (JUDGMENT_KINDS.has(artifactKind)) return ['judge'];
  if (TEST_GATE_KINDS.has(artifactKind)) return ['public', 'test-gate'];
  return ['public'];
}

function parseMaterial(
  artifactKind: DeepAiCouncilArtifactKind,
  input: unknown,
): DeepAiCouncilArtifactMaterialBase {
  const value = requireRecord(artifactKind, input, MATERIAL_FIELDS);
  const scope = requireScope(artifactKind, value.scope);
  const artifactId = requireToken(artifactKind, 'artifactId', value.artifactId);
  if (scope.artifactId !== artifactId) return invalidMaterial(artifactKind, 'scope.artifactId');
  const visibility = requireEnum(
    artifactKind,
    'visibility',
    value.visibility,
    expectedVisibility(artifactKind),
  );
  const authorityEpoch = value.authorityEpoch;
  if (
    typeof authorityEpoch !== 'number'
    || !Number.isSafeInteger(authorityEpoch)
    || authorityEpoch < 0
    || authorityEpoch > MAX_AUTHORITY_EPOCH
  ) {
    return invalidMaterial(artifactKind, 'authorityEpoch');
  }
  const supersedesArtifactDigest = value.supersedesArtifactDigest === null
    ? null
    : requireDigest(artifactKind, 'supersedesArtifactDigest', value.supersedesArtifactDigest);
  return Object.freeze({
    artifactId,
    materialDigest: requireDigest(artifactKind, 'materialDigest', value.materialDigest),
    materialRef: requireToken(artifactKind, 'materialRef', value.materialRef),
    scope,
    sourceEventRange: requireSourceEventRange(artifactKind, value.sourceEventRange),
    schemaVersion: requireToken(artifactKind, 'schemaVersion', value.schemaVersion),
    policyVersion: requireToken(artifactKind, 'policyVersion', value.policyVersion),
    replayFingerprint: requireDigest(artifactKind, 'replayFingerprint', value.replayFingerprint),
    authorityEpoch,
    dependencyDigests: requireDigestArray(artifactKind, 'dependencyDigests', value.dependencyDigests),
    visibility,
    supersedesArtifactDigest,
    locator: requireLocator(artifactKind, value.locator),
    producerVersion: requireToken(artifactKind, 'producerVersion', value.producerVersion),
  });
}

function unsupportedArtifactKind(artifactKind: never): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.UNSUPPORTED_ARTIFACT_KIND,
    'canonicalization',
    'Deep AI Council artifact kind is not registered',
    { artifactKind: String(artifactKind) },
  );
}

function canonicalizeDeepAiCouncilMaterial(
  artifactKind: DeepAiCouncilArtifactKind,
  input: unknown,
): Uint8Array {
  let material: DeepAiCouncilArtifactMaterial;
  switch (artifactKind) {
    case DeepAiCouncilArtifactKinds.TARGET_SNAPSHOT:
    case DeepAiCouncilArtifactKinds.TASK_CLASS:
    case DeepAiCouncilArtifactKinds.COUNCIL_STRATEGY:
    case DeepAiCouncilArtifactKinds.PROTOCOL_POLICY:
    case DeepAiCouncilArtifactKinds.PROMPT_CAPABILITY:
    case DeepAiCouncilArtifactKinds.SEAT_ROSTER:
    case DeepAiCouncilArtifactKinds.REASONING_METHOD:
    case DeepAiCouncilArtifactKinds.BUDGET_POLICY:
    case DeepAiCouncilArtifactKinds.CONVERGENCE_POLICY:
    case DeepAiCouncilArtifactKinds.CONTRACT_REVISION:
    case DeepAiCouncilArtifactKinds.CONTROL_ARM:
    case DeepAiCouncilArtifactKinds.TEST_FIXTURE:
    case DeepAiCouncilArtifactKinds.SEAT_PROPOSAL:
    case DeepAiCouncilArtifactKinds.CRITIQUE_RECORD:
    case DeepAiCouncilArtifactKinds.BLINDED_CANDIDATE:
    case DeepAiCouncilArtifactKinds.PAIRWISE_JUDGMENT:
    case DeepAiCouncilArtifactKinds.BIAS_PROBE:
    case DeepAiCouncilArtifactKinds.COUNTERFACTUAL_PROBE:
    case DeepAiCouncilArtifactKinds.STANCE_EVIDENCE:
    case DeepAiCouncilArtifactKinds.CONVERGENCE_EVIDENCE:
    case DeepAiCouncilArtifactKinds.SYNTHESIS:
    case DeepAiCouncilArtifactKinds.MINORITY_RECORD:
    case DeepAiCouncilArtifactKinds.UNRESOLVED_VALUE:
    case DeepAiCouncilArtifactKinds.COUNCIL_ARTIFACT:
    case DeepAiCouncilArtifactKinds.TEST_GATE_EVIDENCE:
      material = parseMaterial(artifactKind, input);
      break;
    default:
      return unsupportedArtifactKind(artifactKind);
  }
  return Uint8Array.from(canonicalBytes({ artifactKind, material }));
}

export function createDeepAiCouncilArtifactCanonicalizerRegistry(): ArtifactCanonicalizerRegistry {
  const definitions: ArtifactCanonicalizerDefinition[] =
    DEEP_AI_COUNCIL_ARTIFACT_KIND_REGISTRY.map((entry) => ({
      artifactKind: entry.artifactKind,
      canonicalizationVersion: entry.canonicalizationVersion,
      mediaType: entry.mediaType,
      implementationIdentity: 'deep-ai-council-binding-canonicalizer-v1',
      canonicalize: (input: unknown): Uint8Array => (
        canonicalizeDeepAiCouncilMaterial(entry.artifactKind, input)
      ),
    }));
  return new ArtifactCanonicalizerRegistry(definitions);
}
