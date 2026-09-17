// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Sealed Artifacts
// ───────────────────────────────────────────────────────────────────

import {
  DeepImprovementCommonArtifactKinds,
  DEEP_IMPROVEMENT_COMMON_SEALED_ARTIFACT_CONTRACT,
  createDeepImprovementCommonSealedArtifactStore,
  isDeepImprovementCommonArtifactKind,
  readDeepImprovementCommonArtifact,
  sealDeepImprovementCommonArtifact,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
  SealedArtifactStore,
  parseSealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import {
  MODEL_BENCHMARK_ARTIFACT_CANONICALIZATION_VERSION,
  MODEL_BENCHMARK_ARTIFACT_KIND_REGISTRY,
  MODEL_BENCHMARK_ARTIFACT_MEDIA_TYPE,
  createModelBenchmarkArtifactCanonicalizerRegistry,
  isModelBenchmarkArtifactKind,
  parseModelBenchmarkArtifactMaterial,
} from './model-benchmark-artifact-material.js';

import type {
  DeepImprovementArtifactReadPolicy,
  DeepImprovementCommonArtifactKind,
  DeepImprovementCommonArtifactMaterialByKind,
  DeepImprovementCommonSealedArtifactBinding,
  DeepImprovementVerifiedSealedArtifact,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import type {
  ArtifactStoreOptions,
  SealedArtifactReference,
  VerifiedSealedArtifact,
} from '../sealed-reference-artifacts/index.js';
import type {
  ModelBenchmarkArtifactKind,
  ModelBenchmarkArtifactMaterial,
  ModelBenchmarkArtifactMaterialByKind,
  ModelBenchmarkArtifactReadPolicy,
  ModelBenchmarkArtifactReadFailureCode as ReadFailureCode,
  ModelBenchmarkSealedArtifactBinding,
  ModelBenchmarkVerifiedSealedArtifact,
} from './model-benchmark-sealed-artifact-types.js';
import {
  ModelBenchmarkArtifactReadError as ModelBenchmarkReadError,
  ModelBenchmarkArtifactReadFailureCodes,
} from './model-benchmark-sealed-artifact-types.js';

const BINDING_FIELDS = new Set([
  'bindingVersion',
  'artifactKind',
  'eventReference',
  'reference',
]);
const REGISTERED_KINDS: ReadonlySet<string> = new Set(
  MODEL_BENCHMARK_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind),
);
const VISIBILITY_RESTRICTIVENESS = Object.freeze({
  public: 0,
  private: 1,
  sealed: 2,
});

type ModelBenchmarkArtifactVisibility = keyof typeof VISIBILITY_RESTRICTIVENESS;
type ModelBenchmarkArtifactAccessRole =
  NonNullable<ModelBenchmarkArtifactReadPolicy['accessRole']>;

const KNOWN_ACCESS_ROLES: ReadonlySet<string> = new Set([
  'candidate',
  'downstream',
  'evaluator',
  'scorer',
]);
const MOST_RESTRICTIVE_ACCESS_ROLE: ModelBenchmarkArtifactAccessRole = 'candidate';

export const MODEL_BENCHMARK_SUBSTRATE_IMPORTS_REAL = true as const;
export const MODEL_BENCHMARK_SHARED_ARTIFACT_CONTRACT =
  DEEP_IMPROVEMENT_COMMON_SEALED_ARTIFACT_CONTRACT;

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
    'Model Benchmark sealed-artifact binding is malformed or mutable-only',
    { field },
  );
}

function sameReference(left: SealedArtifactReference, right: SealedArtifactReference): boolean {
  return left.reference_version === right.reference_version
    && left.artifact_kind === right.artifact_kind
    && left.digest_algorithm === right.digest_algorithm
    && left.content_digest === right.content_digest
    && left.qualified_digest === right.qualified_digest
    && left.descriptor_version === right.descriptor_version
    && left.canonicalization_version === right.canonicalization_version
    && left.descriptor_digest === right.descriptor_digest;
}

function semanticFailure(
  code: ReadFailureCode,
  message: string,
  details: Readonly<Record<string, string | number | boolean | null>> = {},
): never {
  throw new ModelBenchmarkReadError(code, message, details);
}

function parseCanonicalEnvelope(
  artifactKind: ModelBenchmarkArtifactKind,
  bytes: readonly number[],
): ModelBenchmarkArtifactMaterial {
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(bytes).toString('utf8')) as unknown;
  } catch {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      'read',
      'Model Benchmark sealed material is not valid JSON',
      { artifactKind },
    );
  }
  if (
    !isRecord(parsed)
    || Object.keys(parsed).length !== 2
    || !Object.prototype.hasOwnProperty.call(parsed, 'artifactKind')
    || !Object.prototype.hasOwnProperty.call(parsed, 'material')
    || parsed.artifactKind !== artifactKind
  ) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      'read',
      'Model Benchmark sealed material envelope is not closed',
      { artifactKind },
    );
  }
  return parseModelBenchmarkArtifactMaterial(artifactKind, parsed.material);
}

function parseMaterialFromVerified(
  store: SealedArtifactStore,
  verified: VerifiedSealedArtifact,
): ModelBenchmarkArtifactMaterial {
  if (!isModelBenchmarkArtifactKind(verified.reference.artifact_kind)) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.INVALID_INPUT,
      'read',
      'Reference is not a Model Benchmark artifact kind',
      { artifactKind: verified.reference.artifact_kind },
    );
  }
  const material = parseCanonicalEnvelope(verified.reference.artifact_kind, verified.bytes);
  const derived = store.derive(verified.reference.artifact_kind, material, {
    canonicalizationVersion: MODEL_BENCHMARK_ARTIFACT_CANONICALIZATION_VERSION,
    mediaType: MODEL_BENCHMARK_ARTIFACT_MEDIA_TYPE,
  });
  if (
    Buffer.compare(Buffer.from(derived.bytes), Buffer.from(verified.bytes)) !== 0
    || !sameReference(derived.reference, verified.reference)
  ) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.DESCRIPTOR_CONFLICT,
      'read',
      'Model Benchmark material does not reproduce its sealed reference',
      { qualifiedDigest: verified.reference.qualified_digest },
    );
  }
  return material;
}

function commonBinding(
  reference: SealedArtifactReference,
): DeepImprovementCommonSealedArtifactBinding {
  return Object.freeze({
    bindingVersion: 1,
    artifactKind: reference.artifact_kind as DeepImprovementCommonArtifactKind,
    eventReference: eventReference(reference),
    reference,
  });
}

async function verifyDependencyClosure(
  store: SealedArtifactStore,
  references: readonly SealedArtifactReference[],
  visited: Set<string>,
): Promise<void> {
  for (const reference of references) {
    if (visited.has(reference.qualified_digest)) continue;
    visited.add(reference.qualified_digest);
    if (isDeepImprovementCommonArtifactKind(reference.artifact_kind)) {
      try {
        await readDeepImprovementCommonArtifact(store, commonBinding(reference));
      } catch (error: unknown) {
        if (error instanceof SealedArtifactError) {
          semanticFailure(
            ModelBenchmarkArtifactReadFailureCodes.DEPENDENCY_MISMATCH,
            'A shared deep-improvement dependency could not be verified',
            { dependency: reference.qualified_digest, cause: error.code },
          );
        }
        throw error;
      }
      continue;
    }
    let dependency: VerifiedSealedArtifact;
    try {
      dependency = await store.readVerified(reference);
    } catch (error: unknown) {
      if (error instanceof SealedArtifactError) {
        semanticFailure(
          ModelBenchmarkArtifactReadFailureCodes.DEPENDENCY_MISMATCH,
          'A sealed dependency could not be verified',
          { dependency: reference.qualified_digest, cause: error.code },
        );
      }
      throw error;
    }
    if (isModelBenchmarkArtifactKind(dependency.reference.artifact_kind)) {
      const material = parseMaterialFromVerified(store, dependency);
      await verifyDependencyClosure(
        store,
        material.dependencyReferences.map((entry) => entry.reference),
        visited,
      );
    }
  }
}

function nowFromPolicy(policy: ModelBenchmarkArtifactReadPolicy): Date {
  if (policy.now instanceof Date) return policy.now;
  if (typeof policy.now === 'function') return policy.now();
  return new Date();
}

function normalizeAccessRole(accessRole: unknown): ModelBenchmarkArtifactAccessRole {
  if (accessRole === undefined) return 'downstream';
  if (typeof accessRole !== 'string') return MOST_RESTRICTIVE_ACCESS_ROLE;
  const normalizedRole = accessRole.trim().toLowerCase();
  return KNOWN_ACCESS_ROLES.has(normalizedRole)
    ? normalizedRole as ModelBenchmarkArtifactAccessRole
    : MOST_RESTRICTIVE_ACCESS_ROLE;
}

function matrixDigestOf(material: ModelBenchmarkArtifactMaterial): string | null {
  if ('matrixMembership' in material) return material.matrixMembership.matrixDigest;
  if ('matrixDigest' in material && typeof material.matrixDigest === 'string') return material.matrixDigest;
  if ('matrixMembershipDigest' in material) return material.matrixMembershipDigest;
  return null;
}

function workloadDigestOf(material: ModelBenchmarkArtifactMaterial): string | null {
  if ('workloadProfileDigest' in material && typeof material.workloadProfileDigest === 'string') {
    return material.workloadProfileDigest;
  }
  return null;
}

function mostRestrictiveVisibility(
  left: ModelBenchmarkArtifactVisibility,
  right: ModelBenchmarkArtifactVisibility,
): ModelBenchmarkArtifactVisibility {
  return VISIBILITY_RESTRICTIVENESS[left] >= VISIBILITY_RESTRICTIVENESS[right]
    ? left
    : right;
}

function effectiveVisibilityOf(
  material: ModelBenchmarkArtifactMaterial,
): ModelBenchmarkArtifactVisibility {
  let visibility = material.visibility;
  if ('caseVisibility' in material) {
    visibility = mostRestrictiveVisibility(visibility, material.caseVisibility);
    const caseStateVisibility =
      material.contaminationStatus === 'clean'
      && (material.firstExposureAt === null || material.disclosureAt !== null)
        ? 'public'
        : 'sealed';
    visibility = mostRestrictiveVisibility(visibility, caseStateVisibility);
  }
  if ('promptVisibilityPolicy' in material) {
    const promptVisibility =
      material.promptVisibilityPolicy === 'public' ? 'public' : 'sealed';
    visibility = mostRestrictiveVisibility(visibility, promptVisibility);
  }
  if ('visibilityPolicy' in material) {
    const candidateVisibility =
      material.visibilityPolicy.candidateView === 'full' ? 'public' : 'sealed';
    visibility = mostRestrictiveVisibility(visibility, candidateVisibility);
  }
  return visibility;
}

function assertReadPolicy(
  material: ModelBenchmarkArtifactMaterial,
  policy: ModelBenchmarkArtifactReadPolicy,
): void {
  if (
    policy.requiredEvaluatorEpochId !== undefined
    && material.evaluatorEpochId !== policy.requiredEvaluatorEpochId
  ) {
    semanticFailure(ModelBenchmarkArtifactReadFailureCodes.EPOCH_MISMATCH, 'Artifact evaluator epoch does not match the consumer requirement', {
      expectedEpoch: policy.requiredEvaluatorEpochId,
      actualEpoch: material.evaluatorEpochId,
    });
  }
  if (policy.requiredMatrixDigest !== undefined) {
    const actual = matrixDigestOf(material);
    if (actual !== policy.requiredMatrixDigest) {
      semanticFailure(ModelBenchmarkArtifactReadFailureCodes.MATRIX_MISMATCH, 'Artifact matrix identity does not match the consumer requirement', {
        expectedMatrix: policy.requiredMatrixDigest,
        actualMatrix: actual,
      });
    }
  }
  if (policy.requiredWorkloadProfileDigest !== undefined) {
    const actual = workloadDigestOf(material);
    if (actual !== policy.requiredWorkloadProfileDigest) {
      semanticFailure(ModelBenchmarkArtifactReadFailureCodes.WORKLOAD_MISMATCH, 'Artifact workload identity does not match the consumer requirement', {
        expectedWorkload: policy.requiredWorkloadProfileDigest,
        actualWorkload: actual,
      });
    }
  }
  const effectiveVisibility = effectiveVisibilityOf(material);
  if (policy.requiredVisibility !== undefined && effectiveVisibility !== policy.requiredVisibility) {
    semanticFailure(ModelBenchmarkArtifactReadFailureCodes.VISIBILITY_MISMATCH, 'Artifact visibility does not match the consumer requirement');
  }
  if (
    (policy.accessRole === 'candidate' || policy.accessRole === 'scorer')
    && effectiveVisibility !== 'public'
  ) {
    semanticFailure(
      ModelBenchmarkArtifactReadFailureCodes.VISIBILITY_MISMATCH,
      'Candidate and scorer access cannot release sealed or private benchmark evidence',
    );
  }
  if (policy.requireFresh) {
    const expiresAt = material.freshnessExpiresAt;
    if (expiresAt === null || new Date(expiresAt).getTime() <= nowFromPolicy(policy).getTime()) {
      semanticFailure(ModelBenchmarkArtifactReadFailureCodes.STALE, 'Benchmark evidence is stale or has no freshness boundary');
    }
  }
  if (policy.requireCleanContamination && 'contaminationStatus' in material) {
    if (material.contaminationStatus !== 'clean') {
      semanticFailure(ModelBenchmarkArtifactReadFailureCodes.CONTAMINATED, 'Contamination evidence is not clean');
    }
  }
  if (policy.requireValidEvidence && 'validityState' in material) {
    if (material.validityState !== 'valid') {
      semanticFailure(ModelBenchmarkArtifactReadFailureCodes.CALIBRATION_INVALID, 'Validity evidence is not admissible');
    }
  }
  if (policy.requireCompleteUsage && 'usageStatus' in material) {
    if (material.usageStatus !== 'complete') {
      semanticFailure(ModelBenchmarkArtifactReadFailureCodes.INCOMPLETE, 'Operational usage evidence is incomplete');
    }
  }
  if (
    policy.requireCompleteUsage
    && 'evidenceCompleteness' in material
    && material.evidenceCompleteness !== 'complete'
  ) {
    semanticFailure(ModelBenchmarkArtifactReadFailureCodes.INCOMPLETE, 'Selection evidence is incomplete');
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. BINDING AND STORE API
// ───────────────────────────────────────────────────────────────────

/** Validate the closed event-to-seal binding without resolving artifact bytes. */
export function parseModelBenchmarkSealedArtifactBinding<
  TKind extends ModelBenchmarkArtifactKind = ModelBenchmarkArtifactKind,
>(input: unknown): ModelBenchmarkSealedArtifactBinding<TKind> {
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
  if (reference.artifact_kind !== input.artifactKind) return invalidBinding('reference.artifact_kind');
  if (input.eventReference !== eventReference(reference)) return invalidBinding('eventReference');
  return Object.freeze({
    bindingVersion: 1,
    artifactKind: input.artifactKind as TKind,
    eventReference: input.eventReference,
    reference,
  });
}

/** Construct the real shared store with common and model profiles. */
export function createModelBenchmarkSealedArtifactStore(
  options: ArtifactStoreOptions,
): SealedArtifactStore {
  return new SealedArtifactStore(options, createModelBenchmarkArtifactCanonicalizerRegistry());
}

/** Construct the common adapter store when a caller only needs common artifacts. */
export function createModelBenchmarkCommonSealedArtifactStore(
  options: ArtifactStoreOptions,
): SealedArtifactStore {
  return createDeepImprovementCommonSealedArtifactStore(options);
}

/** Seal a model-specific material through the shared immutable store. */
export async function sealModelBenchmarkArtifact<
  TKind extends ModelBenchmarkArtifactKind,
>(
  store: SealedArtifactStore,
  artifactKind: TKind,
  material: ModelBenchmarkArtifactMaterialByKind[TKind],
): Promise<ModelBenchmarkSealedArtifactBinding<TKind>> {
  if (!REGISTERED_KINDS.has(artifactKind)) return invalidBinding('artifactKind');
  const sealed = await store.seal(artifactKind, material, {
    canonicalizationVersion: MODEL_BENCHMARK_ARTIFACT_CANONICALIZATION_VERSION,
    mediaType: MODEL_BENCHMARK_ARTIFACT_MEDIA_TYPE,
  });
  return Object.freeze({
    bindingVersion: 1,
    artifactKind,
    eventReference: eventReference(sealed.artifact.reference),
    reference: sealed.artifact.reference,
  });
}

/** Release model bytes only after the shared store and adapter checks pass. */
export async function readModelBenchmarkArtifact<
  TKind extends ModelBenchmarkArtifactKind,
>(
  store: SealedArtifactStore,
  input: unknown,
  policy: ModelBenchmarkArtifactReadPolicy = {},
): Promise<ModelBenchmarkVerifiedSealedArtifact<TKind>> {
  const binding = parseModelBenchmarkSealedArtifactBinding<TKind>(input);
  const artifact = await store.readVerified(binding.reference, binding.artifactKind);
  const material = parseMaterialFromVerified(store, artifact) as ModelBenchmarkArtifactMaterialByKind[TKind];
  await verifyDependencyClosure(
    store,
    material.dependencyReferences.map((entry) => entry.reference),
    new Set([binding.reference.qualified_digest]),
  );
  assertReadPolicy(material, {
    ...policy,
    accessRole: normalizeAccessRole(policy.accessRole),
  });
  return Object.freeze({
    binding,
    descriptor: artifact.descriptor,
    bytes: artifact.bytes,
    material,
  });
}

/** Re-export the common adapter at the mode boundary without changing semantics. */
export function sealModelBenchmarkCommonArtifact<
  TKind extends DeepImprovementCommonArtifactKind,
>(
  store: SealedArtifactStore,
  artifactKind: TKind,
  material: DeepImprovementCommonArtifactMaterialByKind[TKind],
): Promise<DeepImprovementCommonSealedArtifactBinding<TKind>> {
  return sealDeepImprovementCommonArtifact(store, artifactKind, material);
}

/** Read a common evaluator/canary/promotion artifact with its shared policy. */
export function readModelBenchmarkCommonArtifact<
  TKind extends DeepImprovementCommonArtifactKind,
>(
  store: SealedArtifactStore,
  input: DeepImprovementCommonSealedArtifactBinding<TKind> | unknown,
  policy: DeepImprovementArtifactReadPolicy = {},
): Promise<DeepImprovementVerifiedSealedArtifact<TKind>> {
  return readDeepImprovementCommonArtifact(store, input, policy);
}
