// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Sealed Artifacts
// ───────────────────────────────────────────────────────────────────

import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
  SealedArtifactStore,
  parseSealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import {
  DEEP_ALIGNMENT_ARTIFACT_CANONICALIZATION_VERSION,
  DEEP_ALIGNMENT_ARTIFACT_KIND_REGISTRY,
  DEEP_ALIGNMENT_ARTIFACT_MEDIA_TYPE,
  createDeepAlignmentArtifactCanonicalizerRegistry,
  decodeDeepAlignmentArtifactBytes,
  deepAlignmentNamedDependencyRules,
  parseDeepAlignmentArtifactMaterial,
} from './deep-alignment-artifact-material.js';

import type {
  ArtifactStoreOptions,
  SealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import type {
  DeepAlignmentNamedDependencyRule,
} from './deep-alignment-artifact-material.js';
import type {
  DeepAlignmentArtifactKind,
  DeepAlignmentArtifactMaterial,
  DeepAlignmentArtifactMaterialByKind,
  DeepAlignmentArtifactDependency,
  DeepAlignmentReadOptions,
  DeepAlignmentSealedArtifactBinding,
  DeepAlignmentVerifiedSealedArtifact,
} from './deep-alignment-sealed-artifact-types.js';

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
  DEEP_ALIGNMENT_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind),
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
    'Deep Alignment sealed-artifact binding is malformed or mutable-only',
    { field },
  );
}

export function parseDeepAlignmentSealedArtifactBinding(
  input: unknown,
): DeepAlignmentSealedArtifactBinding {
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
    artifactKind: input.artifactKind as DeepAlignmentArtifactKind,
    eventReference: input.eventReference,
    reference,
  });
}

// ───────────────────────────────────────────────────────────────────
// 2. DEPENDENCY AND EPOCH VERIFICATION
// ───────────────────────────────────────────────────────────────────

function readFailure(message: string, details: Readonly<Record<string, string>>): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.INVALID_INPUT,
    'read',
    message,
    details,
  );
}

function assertReadContext(
  artifactKind: DeepAlignmentArtifactKind,
  material: DeepAlignmentArtifactMaterial,
  options: DeepAlignmentReadOptions,
): void {
  if (options.expectedAuthorityEpochId !== undefined) {
    if (
      typeof options.expectedAuthorityEpochId !== 'string'
      || options.expectedAuthorityEpochId.length === 0
      || material.authorityEpochId !== options.expectedAuthorityEpochId
    ) {
      return readFailure(
        'Deep Alignment artifact belongs to a stale or unexpected authority epoch',
        {
          artifactKind,
          reason: 'stale_authority_epoch',
        },
      );
    }
  }
  const now = options.now ?? new Date();
  if (artifactKind === 'deep-alignment-authority-capsule') {
    const authority = material as DeepAlignmentArtifactMaterialByKind['deep-alignment-authority-capsule'];
    if (authority.rollbackRef !== null) {
      return readFailure(
        'Deep Alignment authority capsule has been rolled back',
        { artifactKind, reason: 'rolled_back_authority' },
      );
    }
    if (new Date(authority.expiresAt).getTime() <= now.getTime()) {
      return readFailure(
        'Deep Alignment authority capsule has expired',
        { artifactKind, reason: 'expired_authority' },
      );
    }
  }
  if (artifactKind === 'deep-alignment-governed-exception') {
    const exception = material as DeepAlignmentArtifactMaterialByKind['deep-alignment-governed-exception'];
    if (
      exception.status === 'active'
      && new Date(exception.expiresAt).getTime() <= now.getTime()
    ) {
      return readFailure(
        'Deep Alignment governed exception has expired',
        { artifactKind, reason: 'expired_exception' },
      );
    }
  }
}

interface VerifiedDependency {
  readonly dependency: DeepAlignmentArtifactDependency;
  readonly material: DeepAlignmentArtifactMaterial;
  readonly contentDigest: string;
}

function materialField(
  artifactKind: DeepAlignmentArtifactKind,
  material: DeepAlignmentArtifactMaterial,
  field: string,
): string {
  const value = (material as unknown as Readonly<Record<string, unknown>>)[field];
  if (typeof value !== 'string') {
    return readFailure(
      'Deep Alignment named dependency field is not a bounded identity',
      { artifactKind, field, reason: 'named_dependency_field_invalid' },
    );
  }
  return value;
}

function matchingVerifiedDependency(
  rule: DeepAlignmentNamedDependencyRule,
  expectedDigest: string,
  verifiedDependencies: readonly VerifiedDependency[],
): VerifiedDependency | undefined {
  return verifiedDependencies.find((verified) => (
    verified.dependency.artifactKind === rule.dependencyKind
    && verified.contentDigest === expectedDigest
  ));
}

function verifyNamedDependencies(
  artifactKind: DeepAlignmentArtifactKind,
  material: DeepAlignmentArtifactMaterial,
  verifiedDependencies: readonly VerifiedDependency[],
): void {
  for (const rule of deepAlignmentNamedDependencyRules(artifactKind)) {
    const digestField = rule.match === 'content-digest'
      ? rule.field
      : rule.dependencyDigestField;
    const expectedDigest = materialField(artifactKind, material, digestField);
    const verified = matchingVerifiedDependency(
      rule,
      expectedDigest,
      verifiedDependencies,
    );
    if (verified === undefined) {
      return readFailure(
        'Deep Alignment named claim is not bound to a verified dependency',
        { artifactKind, field: rule.field, reason: 'named_dependency_missing' },
      );
    }
    if (rule.match === 'material-identity') {
      const claimedIdentity = materialField(artifactKind, material, rule.field);
      const actualIdentity = (
        verified.material as unknown as Readonly<Record<string, unknown>>
      )[rule.dependencyIdentityField];
      if (actualIdentity !== claimedIdentity) {
        return readFailure(
          'Deep Alignment named claim does not match its verified dependency identity',
          { artifactKind, field: rule.field, reason: 'named_dependency_mismatch' },
        );
      }
    }
  }
}

async function verifyDependencies(
  store: SealedArtifactStore,
  artifactKind: DeepAlignmentArtifactKind,
  material: DeepAlignmentArtifactMaterial,
  options: DeepAlignmentReadOptions,
  visited: ReadonlySet<string>,
): Promise<void> {
  const verifiedDependencies: VerifiedDependency[] = [];
  for (const dependency of material.dependencies) {
    const qualifiedDigest = dependency.reference.qualified_digest;
    if (visited.has(qualifiedDigest)) {
      return readFailure(
        'Deep Alignment sealed-artifact dependency graph contains a cycle',
        { artifactKind: dependency.artifactKind, reason: 'dependency_cycle' },
      );
    }
    const verified = await store.readVerified(dependency.reference, dependency.artifactKind);
    const dependencyMaterial = decodeDeepAlignmentArtifactBytes(
      dependency.artifactKind,
      verified.bytes,
    );
    if (dependencyMaterial.authorityEpochId !== material.authorityEpochId) {
      return readFailure(
        'Deep Alignment artifact dependency belongs to a different authority epoch',
        { artifactKind: dependency.artifactKind, reason: 'mixed_authority_epoch' },
      );
    }
    assertReadContext(dependency.artifactKind, dependencyMaterial, options);
    await verifyDependencies(
      store,
      dependency.artifactKind,
      dependencyMaterial,
      options,
      new Set([...visited, qualifiedDigest]),
    );
    verifiedDependencies.push(Object.freeze({
      dependency,
      material: dependencyMaterial,
      contentDigest: verified.reference.content_digest,
    }));
  }
  verifyNamedDependencies(artifactKind, material, verifiedDependencies);
}

async function verifyMaterialDependencies(
  store: SealedArtifactStore,
  artifactKind: DeepAlignmentArtifactKind,
  material: DeepAlignmentArtifactMaterial,
): Promise<void> {
  await verifyDependencies(
    store,
    artifactKind,
    material,
    { expectedAuthorityEpochId: material.authorityEpochId },
    new Set(),
  );
}

function bindingFor<TKind extends DeepAlignmentArtifactKind>(
  artifactKind: TKind,
  reference: SealedArtifactReference,
): DeepAlignmentSealedArtifactBinding<TKind> {
  return Object.freeze({
    bindingVersion: 1,
    artifactKind,
    eventReference: eventReference(reference),
    reference,
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. SHARED-SEALER BINDINGS
// ───────────────────────────────────────────────────────────────────

export function createDeepAlignmentSealedArtifactStore(
  options: ArtifactStoreOptions,
): SealedArtifactStore {
  return new SealedArtifactStore(
    options,
    createDeepAlignmentArtifactCanonicalizerRegistry(),
  );
}

export async function sealDeepAlignmentArtifact<TKind extends DeepAlignmentArtifactKind>(
  store: SealedArtifactStore,
  artifactKind: TKind,
  material: DeepAlignmentArtifactMaterialByKind[TKind],
): Promise<DeepAlignmentSealedArtifactBinding<TKind>> {
  if (!REGISTERED_KINDS.has(artifactKind)) return invalidBinding('artifactKind');
  const parsed = parseDeepAlignmentArtifactMaterial(artifactKind, material);
  await verifyMaterialDependencies(store, artifactKind, parsed);
  const sealed = await store.seal(artifactKind, parsed, {
    canonicalizationVersion: DEEP_ALIGNMENT_ARTIFACT_CANONICALIZATION_VERSION,
    mediaType: DEEP_ALIGNMENT_ARTIFACT_MEDIA_TYPE,
  });
  return bindingFor(artifactKind, sealed.artifact.reference);
}

export async function readDeepAlignmentArtifact(
  store: SealedArtifactStore,
  input: unknown,
  options: DeepAlignmentReadOptions = {},
): Promise<DeepAlignmentVerifiedSealedArtifact> {
  const binding = parseDeepAlignmentSealedArtifactBinding(input);
  const artifact = await store.readVerified(binding.reference, binding.artifactKind);
  const material = decodeDeepAlignmentArtifactBytes(binding.artifactKind, artifact.bytes);
  assertReadContext(binding.artifactKind, material, options);
  await verifyDependencies(
    store,
    binding.artifactKind,
    material,
    options,
    new Set([binding.reference.qualified_digest]),
  );
  return Object.freeze({
    binding,
    descriptor: artifact.descriptor,
    bytes: artifact.bytes,
  });
}

export function deepAlignmentDependency(
  artifactKind: DeepAlignmentArtifactKind,
  reference: SealedArtifactReference,
): DeepAlignmentArtifactDependency {
  if (!REGISTERED_KINDS.has(artifactKind)) return invalidBinding('artifactKind');
  const parsed = parseSealedArtifactReference(reference);
  if (parsed.artifact_kind !== artifactKind) return invalidBinding('dependency.artifact_kind');
  return Object.freeze({ artifactKind, reference: parsed });
}
