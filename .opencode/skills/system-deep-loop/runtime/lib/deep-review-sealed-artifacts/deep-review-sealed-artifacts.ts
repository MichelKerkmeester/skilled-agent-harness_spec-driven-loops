// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Sealed Artifacts
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes } from '../event-envelope/index.js';
import {
  InitialArtifactKinds,
  SealedArtifactError,
  SealedArtifactErrorCodes,
  SealedArtifactStore,
  parseSealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import {
  DEEP_REVIEW_ARTIFACT_CANONICALIZATION_VERSION,
  DEEP_REVIEW_ARTIFACT_KIND_REGISTRY,
  DEEP_REVIEW_ARTIFACT_MEDIA_TYPE,
  createDeepReviewArtifactCanonicalizerRegistry,
  deepReviewMaterialFromCanonicalBytes,
} from './deep-review-artifact-material.js';
import {
  DeepReviewEventStems,
} from '../deep-review-ledger-schema/index.js';

import type {
  ArtifactStoreOptions,
  SealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import type {
  DeepReviewArtifactDependency,
  DeepReviewArtifactKind,
  DeepReviewArtifactMaterial,
  DeepReviewArtifactMaterialByKind,
  DeepReviewArtifactReadContext,
  DeepReviewSealedArtifactBinding,
  DeepReviewVerifiedSealedArtifact,
} from './deep-review-sealed-artifact-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. BINDING VALIDATION
// ───────────────────────────────────────────────────────────────────

const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;
const MAX_AUTHORITY_EPOCH = 0xffffffff;
const BINDING_FIELDS = new Set([
  'bindingVersion',
  'artifactKind',
  'eventStem',
  'eventId',
  'authorityEpoch',
  'eventReference',
  'dependencies',
  'reference',
]);
const DEPENDENCY_FIELDS = new Set(['artifactKind', 'reference']);
const REGISTERED_KINDS: ReadonlySet<string> = new Set(
  DEEP_REVIEW_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind),
);
const SUPPORTED_DEPENDENCY_KINDS: ReadonlySet<string> = new Set([
  ...REGISTERED_KINDS,
  ...Object.values(InitialArtifactKinds),
]);

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
    'Deep Review sealed-artifact binding is malformed or stale',
    { field },
  );
}

function parseDependencies(input: unknown): readonly DeepReviewArtifactDependency[] {
  if (!Array.isArray(input) || input.length > 256) return invalidBinding('dependencies');
  return Object.freeze(input.map((value) => {
    if (
      !isRecord(value)
      || Object.keys(value).length !== DEPENDENCY_FIELDS.size
      || Object.keys(value).some((field) => !DEPENDENCY_FIELDS.has(field))
      || typeof value.artifactKind !== 'string'
      || !SUPPORTED_DEPENDENCY_KINDS.has(value.artifactKind)
    ) {
      return invalidBinding('dependencies.shape');
    }
    const reference = parseSealedArtifactReference(value.reference);
    if (reference.artifact_kind !== value.artifactKind) {
      return invalidBinding('dependencies.reference.artifact_kind');
    }
    return Object.freeze({
      artifactKind: value.artifactKind as DeepReviewArtifactDependency['artifactKind'],
      reference,
    });
  }));
}

function validateReadContext(
  input: DeepReviewArtifactReadContext | undefined,
  binding: DeepReviewSealedArtifactBinding,
): void {
  if (input === undefined) return;
  if (!isRecord(input)) return invalidBinding('readContext.shape');
  const fields = new Set(['eventStem', 'eventId', 'authorityEpoch']);
  if (Object.keys(input).some((field) => !fields.has(field))) {
    return invalidBinding('readContext.shape');
  }
  if (input.eventStem !== undefined && input.eventStem !== binding.eventStem) {
    return invalidBinding('eventStem');
  }
  if (input.eventId !== undefined) {
    if (typeof input.eventId !== 'string' || !TOKEN_PATTERN.test(input.eventId)) {
      return invalidBinding('eventId');
    }
    if (input.eventId !== binding.eventId) return invalidBinding('eventId');
  }
  if (input.authorityEpoch !== undefined) {
    if (
      typeof input.authorityEpoch !== 'number'
      || !Number.isSafeInteger(input.authorityEpoch)
      || input.authorityEpoch < 0
      || input.authorityEpoch > MAX_AUTHORITY_EPOCH
      || input.authorityEpoch !== binding.authorityEpoch
    ) {
      return invalidBinding('authorityEpoch');
    }
  }
}

/** Validate the closed event-to-seal binding without resolving artifact bytes. */
export function parseDeepReviewSealedArtifactBinding(
  input: unknown,
): DeepReviewSealedArtifactBinding {
  if (
    !isRecord(input)
    || Object.keys(input).length !== BINDING_FIELDS.size
    || Object.keys(input).some((field) => !BINDING_FIELDS.has(field))
  ) {
    return invalidBinding('shape');
  }
  if (input.bindingVersion !== 1) return invalidBinding('bindingVersion');
  if (
    typeof input.artifactKind !== 'string'
    || !REGISTERED_KINDS.has(input.artifactKind)
  ) {
    return invalidBinding('artifactKind');
  }
  if (
    typeof input.eventStem !== 'string'
    || !(DeepReviewEventStems as readonly string[]).includes(input.eventStem)
  ) {
    return invalidBinding('eventStem');
  }
  if (typeof input.eventId !== 'string' || !TOKEN_PATTERN.test(input.eventId)) {
    return invalidBinding('eventId');
  }
  if (
    typeof input.authorityEpoch !== 'number'
    || !Number.isSafeInteger(input.authorityEpoch)
    || input.authorityEpoch < 0
    || input.authorityEpoch > MAX_AUTHORITY_EPOCH
  ) {
    return invalidBinding('authorityEpoch');
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
    artifactKind: input.artifactKind as DeepReviewArtifactKind,
    eventStem: input.eventStem as DeepReviewSealedArtifactBinding['eventStem'],
    eventId: input.eventId,
    authorityEpoch: input.authorityEpoch,
    eventReference: input.eventReference,
    dependencies: parseDependencies(input.dependencies),
    reference,
  });
}

function bindingMatchesMaterial(
  binding: DeepReviewSealedArtifactBinding,
  bytes: readonly number[],
): void {
  const material = deepReviewMaterialFromCanonicalBytes(binding.artifactKind, bytes);
  validateBackedMaterialReference(material);
  if (
    material.eventStem !== binding.eventStem
    || material.eventId !== binding.eventId
    || material.authorityEpoch !== binding.authorityEpoch
    || Buffer.compare(
      Buffer.from(canonicalBytes(material.dependencies)),
      Buffer.from(canonicalBytes(binding.dependencies)),
    ) !== 0
  ) {
    return invalidBinding('binding.material');
  }
}

async function verifyDependencies(
  store: SealedArtifactStore,
  dependencies: readonly DeepReviewArtifactDependency[],
): Promise<void> {
  for (const dependency of dependencies) {
    await store.readVerified(dependency.reference, dependency.artifactKind);
  }
}

function validateBackedMaterialReference(
  material: DeepReviewArtifactMaterial,
): void {
  if (!('materialDigest' in material)) return;
  const isBacked = material.dependencies.some((dependency) => (
    dependency.reference.content_digest === material.materialDigest
    && eventReference(dependency.reference) === material.materialRef
  ));
  if (!isBacked) return invalidBinding('materialReference');
}

// ───────────────────────────────────────────────────────────────────
// 2. SHARED STORE BINDINGS
// ───────────────────────────────────────────────────────────────────

/** Construct the real shared store with Deep Review canonicalization profiles. */
export function createDeepReviewSealedArtifactStore(
  options: ArtifactStoreOptions,
): SealedArtifactStore {
  return new SealedArtifactStore(
    options,
    createDeepReviewArtifactCanonicalizerRegistry(),
  );
}

/** Seal a closed mode capsule and expose only its digest-addressed binding. */
export async function sealDeepReviewArtifact<TKind extends DeepReviewArtifactKind>(
  store: SealedArtifactStore,
  artifactKind: TKind,
  material: DeepReviewArtifactMaterialByKind[TKind],
): Promise<DeepReviewSealedArtifactBinding<TKind>> {
  if (!REGISTERED_KINDS.has(artifactKind)) return invalidBinding('artifactKind');
  const parsedMaterial = deepReviewMaterialFromCanonicalBytes(
    artifactKind,
    Array.from(canonicalBytes({ artifactKind, material })),
  ) as DeepReviewArtifactMaterialByKind[TKind];
  validateBackedMaterialReference(parsedMaterial);
  await verifyDependencies(store, parsedMaterial.dependencies);
  const sealed = await store.seal(artifactKind, parsedMaterial, {
    canonicalizationVersion: DEEP_REVIEW_ARTIFACT_CANONICALIZATION_VERSION,
    mediaType: DEEP_REVIEW_ARTIFACT_MEDIA_TYPE,
  });
  return Object.freeze({
    bindingVersion: 1,
    artifactKind,
    eventStem: parsedMaterial.eventStem,
    eventId: parsedMaterial.eventId,
    authorityEpoch: parsedMaterial.authorityEpoch,
    eventReference: eventReference(sealed.artifact.reference),
    dependencies: parsedMaterial.dependencies,
    reference: sealed.artifact.reference,
  });
}

/** Release capsule bytes only after the shared store verifies the binding and dependencies. */
export async function readDeepReviewArtifact(
  store: SealedArtifactStore,
  input: unknown,
  context?: DeepReviewArtifactReadContext,
): Promise<DeepReviewVerifiedSealedArtifact> {
  const binding = parseDeepReviewSealedArtifactBinding(input);
  validateReadContext(context, binding);
  await verifyDependencies(store, binding.dependencies);
  const artifact = await store.readVerified(binding.reference, binding.artifactKind);
  bindingMatchesMaterial(binding, artifact.bytes);
  return Object.freeze({
    binding,
    descriptor: artifact.descriptor,
    bytes: artifact.bytes,
  });
}
