// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Sealed Artifacts
// ───────────────────────────────────────────────────────────────────

import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
  SealedArtifactStore,
  parseSealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import {
  DEEP_AI_COUNCIL_ARTIFACT_CANONICALIZATION_VERSION,
  DEEP_AI_COUNCIL_ARTIFACT_KIND_REGISTRY,
  DEEP_AI_COUNCIL_ARTIFACT_MEDIA_TYPE,
  createDeepAiCouncilArtifactCanonicalizerRegistry,
} from './deep-ai-council-artifact-material.js';

import type {
  ArtifactStoreOptions,
  SealedArtifactErrorCode,
  SealedArtifactReference,
  VerifiedSealedArtifact,
} from '../sealed-reference-artifacts/index.js';
import type {
  DeepAiCouncilArtifactKind,
  DeepAiCouncilArtifactMaterialByKind,
  DeepAiCouncilArtifactReadExpectations,
  DeepAiCouncilArtifactScopeDescriptor,
  DeepAiCouncilSealedArtifactBinding,
  DeepAiCouncilVerifiedSealedArtifact,
} from './deep-ai-council-sealed-artifact-types.js';

const BINDING_FIELDS = new Set([
  'bindingVersion',
  'artifactKind',
  'eventReference',
  'reference',
]);
const MATERIAL_FIELDS = new Set([
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
]);
const REGISTERED_KINDS: ReadonlySet<string> = new Set(
  DEEP_AI_COUNCIL_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind),
);

function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function eventReference(reference: SealedArtifactReference): string {
  return `artifact:${reference.qualified_digest}`;
}

function invalidBinding(field: string): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.INVALID_INPUT,
    'descriptor',
    'Deep AI Council sealed-artifact binding is malformed or mutable-only',
    { field },
  );
}

function invalidRead(
  field: string,
  code: SealedArtifactErrorCode = SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
): never {
  throw new SealedArtifactError(
    code,
    'read',
    'Deep AI Council sealed-artifact context cannot be verified',
    { field },
  );
}

function parseMaterialContext(
  artifact: VerifiedSealedArtifact,
  expectedKind: DeepAiCouncilArtifactKind,
): Record<string, unknown> {
  let decoded: unknown;
  try {
    decoded = JSON.parse(Buffer.from(artifact.bytes).toString('utf8')) as unknown;
  } catch {
    return invalidRead('canonical-bytes');
  }
  if (
    !isRecord(decoded)
    || Object.keys(decoded).length !== 2
    || !Object.prototype.hasOwnProperty.call(decoded, 'artifactKind')
    || !Object.prototype.hasOwnProperty.call(decoded, 'material')
    || decoded.artifactKind !== expectedKind
    || !isRecord(decoded.material)
    || Object.keys(decoded.material).length !== MATERIAL_FIELDS.size
    || Object.keys(decoded.material).some((field) => !MATERIAL_FIELDS.has(field))
  ) {
    return invalidRead('material-shape');
  }
  return decoded.material;
}

function assertScope(
  actual: unknown,
  expected: DeepAiCouncilArtifactScopeDescriptor,
): void {
  if (!isRecord(actual)) return invalidRead('scope');
  if (
    actual.runId !== expected.runId
    || actual.roundId !== expected.roundId
    || actual.artifactId !== expected.artifactId
  ) {
    return invalidRead('scope', SealedArtifactErrorCodes.EVIDENCE_CONFLICT);
  }
}

function assertReadExpectations(
  material: Record<string, unknown>,
  expectations: DeepAiCouncilArtifactReadExpectations,
): void {
  if (
    expectations.expectedAuthorityEpoch !== undefined
    && material.authorityEpoch !== expectations.expectedAuthorityEpoch
  ) {
    return invalidRead('authorityEpoch', SealedArtifactErrorCodes.EVIDENCE_CONFLICT);
  }
  if (
    expectations.expectedReplayFingerprint !== undefined
    && material.replayFingerprint !== expectations.expectedReplayFingerprint
  ) {
    return invalidRead('replayFingerprint', SealedArtifactErrorCodes.EVIDENCE_CONFLICT);
  }
  if (expectations.expectedScope !== undefined) {
    assertScope(material.scope, expectations.expectedScope);
  }
  if (
    expectations.allowedVisibility !== undefined
    && (typeof material.visibility !== 'string'
      || !expectations.allowedVisibility.includes(material.visibility as never))
  ) {
    return invalidRead('visibility', SealedArtifactErrorCodes.EVIDENCE_CONFLICT);
  }
  if (!Array.isArray(material.dependencyDigests)) return invalidRead('dependencyDigests');
  for (const dependency of expectations.requiredDependencyReferences ?? []) {
    if (!material.dependencyDigests.includes(dependency.content_digest)) {
      return invalidRead('dependencyDigests', SealedArtifactErrorCodes.EVIDENCE_CONFLICT);
    }
  }
}

/** Validate the closed event-to-seal binding without resolving artifact bytes. */
export function parseDeepAiCouncilSealedArtifactBinding(
  input: unknown,
): DeepAiCouncilSealedArtifactBinding {
  if (
    !isRecord(input)
    || Object.keys(input).length !== BINDING_FIELDS.size
    || Object.keys(input).some((field) => !BINDING_FIELDS.has(field))
  ) {
    return invalidBinding('shape');
  }
  if (input.bindingVersion !== 1) return invalidBinding('bindingVersion');
  if (typeof input.artifactKind !== 'string' || !REGISTERED_KINDS.has(input.artifactKind)) {
    return invalidBinding('artifactKind');
  }
  const reference = parseSealedArtifactReference(input.reference);
  if (reference.artifact_kind !== input.artifactKind) {
    return invalidBinding('reference.artifact_kind');
  }
  if (input.eventReference !== eventReference(reference)) {
    return invalidBinding('eventReference');
  }
  return Object.freeze({
    bindingVersion: 1,
    artifactKind: input.artifactKind as DeepAiCouncilArtifactKind,
    eventReference: input.eventReference,
    reference,
  });
}

/** Construct the shared store with only Deep AI Council canonicalization profiles. */
export function createDeepAiCouncilSealedArtifactStore(
  options: ArtifactStoreOptions,
): SealedArtifactStore {
  return new SealedArtifactStore(
    options,
    createDeepAiCouncilArtifactCanonicalizerRegistry(),
  );
}

/** Seal a closed mode material capsule and expose only its digest-addressed binding. */
export async function sealDeepAiCouncilArtifact<TKind extends DeepAiCouncilArtifactKind>(
  store: SealedArtifactStore,
  artifactKind: TKind,
  material: DeepAiCouncilArtifactMaterialByKind[TKind],
): Promise<DeepAiCouncilSealedArtifactBinding<TKind>> {
  if (!REGISTERED_KINDS.has(artifactKind)) return invalidBinding('artifactKind');
  const sealed = await store.seal(artifactKind, material, {
    canonicalizationVersion: DEEP_AI_COUNCIL_ARTIFACT_CANONICALIZATION_VERSION,
    mediaType: DEEP_AI_COUNCIL_ARTIFACT_MEDIA_TYPE,
  });
  return Object.freeze({
    bindingVersion: 1,
    artifactKind,
    eventReference: eventReference(sealed.artifact.reference),
    reference: sealed.artifact.reference,
  });
}

/** Resolve dependencies and context, then release bytes verified by the shared store. */
export async function readDeepAiCouncilArtifact(
  store: SealedArtifactStore,
  input: unknown,
  expectations: DeepAiCouncilArtifactReadExpectations = {},
): Promise<DeepAiCouncilVerifiedSealedArtifact> {
  const binding = parseDeepAiCouncilSealedArtifactBinding(input);
  const artifact = await store.readVerified(binding.reference, binding.artifactKind);
  const material = parseMaterialContext(artifact, binding.artifactKind);
  for (const dependency of expectations.requiredDependencyReferences ?? []) {
    await store.readVerified(dependency, dependency.artifact_kind);
  }
  assertReadExpectations(material, expectations);
  return Object.freeze({
    binding,
    descriptor: artifact.descriptor,
    bytes: artifact.bytes,
  });
}
