// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Sealed Artifacts
// ───────────────────────────────────────────────────────────────────

import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
  SealedArtifactStore,
  parseSealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import {
  DEEP_RESEARCH_ARTIFACT_CANONICALIZATION_VERSION,
  DEEP_RESEARCH_ARTIFACT_KIND_REGISTRY,
  DEEP_RESEARCH_ARTIFACT_MEDIA_TYPE,
  createDeepResearchArtifactCanonicalizerRegistry,
} from './deep-research-artifact-material.js';

import type {
  ArtifactStoreOptions,
  SealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import type {
  DeepResearchArtifactKind,
  DeepResearchArtifactMaterialByKind,
  DeepResearchSealedArtifactBinding,
  DeepResearchVerifiedSealedArtifact,
} from './deep-research-sealed-artifact-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. BINDING VALIDATION
// ───────────────────────────────────────────────────────────────────

const BINDING_FIELDS = new Set([
  'bindingVersion',
  'artifactKind',
  'eventReference',
  'reference',
]);
const REGISTERED_KINDS: ReadonlySet<string> = new Set(
  DEEP_RESEARCH_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind),
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
    'Deep Research sealed-artifact binding is malformed or mutable-only',
    { field },
  );
}

/** Validate the closed event-to-seal binding without resolving artifact bytes. */
export function parseDeepResearchSealedArtifactBinding(
  input: unknown,
): DeepResearchSealedArtifactBinding {
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
    artifactKind: input.artifactKind as DeepResearchArtifactKind,
    eventReference: input.eventReference,
    reference,
  });
}

// ───────────────────────────────────────────────────────────────────
// 2. SHARED STORE BINDINGS
// ───────────────────────────────────────────────────────────────────

/** Construct the real shared store with Deep Research canonicalization profiles. */
export function createDeepResearchSealedArtifactStore(
  options: ArtifactStoreOptions,
): SealedArtifactStore {
  return new SealedArtifactStore(
    options,
    createDeepResearchArtifactCanonicalizerRegistry(),
  );
}

/** Seal a closed mode material capsule and expose only its digest-addressed binding. */
export async function sealDeepResearchArtifact<TKind extends DeepResearchArtifactKind>(
  store: SealedArtifactStore,
  artifactKind: TKind,
  material: DeepResearchArtifactMaterialByKind[TKind],
): Promise<DeepResearchSealedArtifactBinding<TKind>> {
  if (!REGISTERED_KINDS.has(artifactKind)) return invalidBinding('artifactKind');
  const sealed = await store.seal(artifactKind, material, {
    canonicalizationVersion: DEEP_RESEARCH_ARTIFACT_CANONICALIZATION_VERSION,
    mediaType: DEEP_RESEARCH_ARTIFACT_MEDIA_TYPE,
  });
  return Object.freeze({
    bindingVersion: 1,
    artifactKind,
    eventReference: eventReference(sealed.artifact.reference),
    reference: sealed.artifact.reference,
  });
}

/** Release immutable capsule bytes only after the shared store verifies the exact binding. */
export async function readDeepResearchArtifact(
  store: SealedArtifactStore,
  input: unknown,
): Promise<DeepResearchVerifiedSealedArtifact> {
  const binding = parseDeepResearchSealedArtifactBinding(input);
  const artifact = await store.readVerified(binding.reference, binding.artifactKind);
  return Object.freeze({
    binding,
    descriptor: artifact.descriptor,
    bytes: artifact.bytes,
  });
}
