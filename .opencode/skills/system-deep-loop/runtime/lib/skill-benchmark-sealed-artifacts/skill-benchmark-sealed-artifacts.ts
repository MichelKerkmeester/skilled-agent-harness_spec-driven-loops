// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Sealed Artifacts
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes } from '../event-envelope/index.js';
import {
  DeepImprovementArtifactReadError,
  DeepImprovementArtifactReadFailureCodes,
  DeepImprovementCommonArtifactKinds,
  readDeepImprovementCommonArtifact,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
  SealedArtifactStore,
  parseSealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import {
  SKILL_BENCHMARK_ARTIFACT_CANONICALIZATION_VERSION,
  SKILL_BENCHMARK_ARTIFACT_KIND_REGISTRY,
  SKILL_BENCHMARK_ARTIFACT_MEDIA_TYPE,
  createSkillBenchmarkArtifactCanonicalizerRegistry,
  parseSkillBenchmarkArtifactMaterial,
} from './skill-benchmark-artifact-material.js';
import {
  SkillBenchmarkArtifactKinds,
} from './skill-benchmark-sealed-artifact-types.js';

import type {
  ArtifactStoreOptions,
  SealedArtifactReference,
  VerifiedSealedArtifact,
} from '../sealed-reference-artifacts/index.js';
import type {
  DeepImprovementArtifactReadPolicy,
  DeepImprovementCommonArtifactMaterial,
  DeepImprovementCommonArtifactKind,
  DeepImprovementCommonSealedArtifactBinding,
  DeepImprovementCanaryEpochMaterial,
  DeepImprovementEvaluatorCapsuleMaterial,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import type {
  SkillBenchmarkCausalScoreObservationMaterial,
  SkillBenchmarkArtifactKind,
  SkillBenchmarkArtifactMaterial,
  SkillBenchmarkArtifactMaterialByKind,
  SkillBenchmarkEffectCertificateInputMaterial,
  SkillBenchmarkExposureObservationMaterial,
  SkillBenchmarkRunAssignmentMaterial,
  SkillBenchmarkScenarioGoldManifestMaterial,
  SkillBenchmarkVerifiedSealedArtifact,
} from './skill-benchmark-sealed-artifact-types.js';

const BINDING_FIELDS = new Set([
  'bindingVersion',
  'artifactKind',
  'eventReference',
  'reference',
]);
const OWN_ARTIFACT_KIND_SET: ReadonlySet<string> = new Set(
  SKILL_BENCHMARK_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind),
);
const COMMON_ARTIFACT_KIND_SET: ReadonlySet<string> = new Set(
  Object.values(DeepImprovementCommonArtifactKinds),
);
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;

type VerifiedDependencyMaterial =
  | DeepImprovementCommonArtifactMaterial
  | SkillBenchmarkArtifactMaterial;

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
    'Skill Benchmark sealed-artifact binding is malformed or mutable-only',
    { field },
  );
}

function semanticFailure(
  code: keyof typeof DeepImprovementArtifactReadFailureCodes,
  message: string,
  details: Readonly<Record<string, string | number | boolean | null>> = {},
): never {
  throw new DeepImprovementArtifactReadError(
    DeepImprovementArtifactReadFailureCodes[code],
    message,
    details,
  );
}

function isOwnArtifactKind(value: string): value is SkillBenchmarkArtifactKind {
  return OWN_ARTIFACT_KIND_SET.has(value);
}

function isCommonArtifactKind(value: string): value is DeepImprovementCommonArtifactKind {
  return COMMON_ARTIFACT_KIND_SET.has(value);
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

function parseCanonicalEnvelope(
  artifactKind: SkillBenchmarkArtifactKind,
  bytes: readonly number[],
): SkillBenchmarkArtifactMaterialByKind[SkillBenchmarkArtifactKind] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(bytes).toString('utf8')) as unknown;
  } catch {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      'read',
      'Skill Benchmark sealed material is not valid JSON',
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
      'Skill Benchmark sealed material envelope is not closed',
      { artifactKind },
    );
  }
  const material = parseSkillBenchmarkArtifactMaterial(artifactKind, parsed.material);
  const expected = Uint8Array.from(canonicalBytes({ artifactKind, material }));
  if (Buffer.compare(Buffer.from(bytes), Buffer.from(expected)) !== 0) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      'read',
      'Skill Benchmark sealed material does not reproduce its canonical bytes',
      { artifactKind },
    );
  }
  return material;
}

function commonBinding(
  reference: SealedArtifactReference,
): DeepImprovementCommonSealedArtifactBinding {
  if (!isCommonArtifactKind(reference.artifact_kind)) {
    return invalidBinding('commonDependency.artifact_kind');
  }
  return Object.freeze({
    bindingVersion: 1,
    artifactKind: reference.artifact_kind,
    eventReference: eventReference(reference),
    reference,
  });
}

function commonReadPolicy(
  policy: DeepImprovementArtifactReadPolicy,
): DeepImprovementArtifactReadPolicy {
  return {
    ...policy,
    consumer: 'skill-benchmark',
  };
}

function explicitReferences(
  material: SkillBenchmarkArtifactMaterial,
): readonly SealedArtifactReference[] {
  switch (material.originEvent.eventStem) {
    case 'skill_benchmark.run_planned':
    case 'skill_benchmark.skill_discovered':
    case 'skill_benchmark.gold_integrity_recorded':
      return [];
    case 'skill_benchmark.treatment_assigned':
      return [(material as SkillBenchmarkRunAssignmentMaterial).evaluatorCapsuleReference];
    case 'skill_benchmark.resource_exposed':
      return [(material as SkillBenchmarkExposureObservationMaterial).canaryEpochReference];
    case 'skill_benchmark.score_observed':
      return [
        (material as SkillBenchmarkCausalScoreObservationMaterial).scenarioGoldManifestReference,
        (material as SkillBenchmarkCausalScoreObservationMaterial).evaluatorCapsuleReference,
        (material as SkillBenchmarkCausalScoreObservationMaterial).canaryEpochReference,
      ];
    case 'skill_benchmark.effect_certificate_issued':
      return [
        (material as SkillBenchmarkEffectCertificateInputMaterial).evaluatorCapsuleReference,
        (material as SkillBenchmarkEffectCertificateInputMaterial).canaryEpochReference,
        (material as SkillBenchmarkEffectCertificateInputMaterial).promotionEvidenceReference,
      ];
    default:
      return semanticFailure('DEPENDENCY_MISMATCH', 'Unsupported Skill Benchmark event binding');
  }
}

function assertOwnReadPolicy(
  material: SkillBenchmarkArtifactMaterial,
  policy: DeepImprovementArtifactReadPolicy,
): void {
  if (
    policy.accessRole === 'candidate'
    && (
      material.originEvent.eventStem === 'skill_benchmark.resource_exposed'
      || material.originEvent.eventStem === 'skill_benchmark.score_observed'
      || material.originEvent.eventStem === 'skill_benchmark.effect_certificate_issued'
    )
  ) {
    semanticFailure(
      'LEAK_DETECTED',
      'Candidate access cannot release exposure, score, or certificate-input evidence',
    );
  }
  if (
    policy.requiredEvaluationEpochId !== undefined
    && 'evaluatorEpochId' in material
    && material.evaluatorEpochId !== policy.requiredEvaluationEpochId
  ) {
    semanticFailure('EPOCH_MISMATCH', 'Skill Benchmark artifact evaluator epoch does not match the consumer requirement', {
      expectedEpoch: policy.requiredEvaluationEpochId,
      actualEpoch: material.evaluatorEpochId,
    });
  }
}

async function assertCanaryReferenceFresh(
  store: SealedArtifactStore,
  reference: SealedArtifactReference,
  policy: DeepImprovementArtifactReadPolicy,
): Promise<void> {
  if (reference.artifact_kind !== DeepImprovementCommonArtifactKinds.CANARY_EPOCH) {
    semanticFailure('DEPENDENCY_MISMATCH', 'Skill Benchmark material does not reference a canary epoch', {
      artifactKind: reference.artifact_kind,
    });
  }
  const artifact = await readDeepImprovementCommonArtifact(
    store,
    commonBinding(reference),
    commonReadPolicy({
      ...policy,
      requireFreshCanary: true,
    }),
  );
  const canary = artifact.material as DeepImprovementCanaryEpochMaterial;
  if (canary.lifecycle !== 'active') {
    semanticFailure('STALE_CANARY', 'Skill Benchmark evidence requires an active canary epoch', {
      lifecycle: canary.lifecycle,
      canaryEpochId: canary.canaryEpochId,
    });
  }
}

async function verifyReference(
  store: SealedArtifactStore,
  reference: SealedArtifactReference,
  policy: DeepImprovementArtifactReadPolicy,
  active: Set<string>,
  verified: Map<string, VerifiedDependencyMaterial>,
): Promise<VerifiedDependencyMaterial> {
  const key = reference.qualified_digest;
  if (active.has(key)) {
    semanticFailure('DEPENDENCY_MISMATCH', 'Skill Benchmark artifact dependency graph contains a cycle', {
      dependency: key,
    });
  }
  const cached = verified.get(key);
  if (cached !== undefined) return cached;
  active.add(key);
  try {
    if (isCommonArtifactKind(reference.artifact_kind)) {
      const artifact = await readDeepImprovementCommonArtifact(
        store,
        commonBinding(reference),
        commonReadPolicy(policy),
      );
      verified.set(key, artifact.material);
      return artifact.material;
    }
    if (!isOwnArtifactKind(reference.artifact_kind)) {
      return semanticFailure('DEPENDENCY_MISMATCH', 'Skill Benchmark dependency kind is not registered', {
        artifactKind: reference.artifact_kind,
      });
    }
    const artifact = await store.readVerified(reference, reference.artifact_kind);
    const material = parseCanonicalEnvelope(reference.artifact_kind, artifact.bytes);
    await verifyMaterialReferences(store, material, policy, active, verified);
    verified.set(key, material);
    return material;
  } finally {
    active.delete(key);
  }
}

async function verifyMaterialReferences(
  store: SealedArtifactStore,
  material: SkillBenchmarkArtifactMaterial,
  policy: DeepImprovementArtifactReadPolicy,
  active: Set<string>,
  verified: Map<string, VerifiedDependencyMaterial>,
): Promise<void> {
  for (const dependency of material.dependencyReferences) {
    await verifyReference(store, dependency.reference, policy, active, verified);
  }
  for (const reference of explicitReferences(material)) {
    await verifyReference(store, reference, policy, active, verified);
  }
  if ('canaryEpochReference' in material) {
    await assertCanaryReferenceFresh(store, material.canaryEpochReference, policy);
  }
  assertOwnReadPolicy(material, policy);
  if (material.originEvent.eventStem === 'skill_benchmark.score_observed') {
    const score = material as SkillBenchmarkCausalScoreObservationMaterial;
    const gold = verified.get(
      score.scenarioGoldManifestReference.qualified_digest,
    ) as SkillBenchmarkScenarioGoldManifestMaterial | undefined;
    if (
      gold === undefined
      || score.goldPolicy !== gold.goldPolicy
      || score.goldIntegrityStatus !== gold.integrityStatus
      || gold.goldPolicy !== 'scored'
      || gold.integrityStatus !== 'accepted'
      || gold.expectedCoverageRatio <= 0
    ) {
      semanticFailure('DEPENDENCY_MISMATCH', 'Score gold state must match non-empty accepted scored gold', {
        declaredGoldPolicy: score.goldPolicy,
        declaredGoldIntegrityStatus: score.goldIntegrityStatus,
        goldPolicy: gold?.goldPolicy ?? null,
        goldIntegrityStatus: gold?.integrityStatus ?? null,
        expectedCoverageRatio: gold?.expectedCoverageRatio ?? null,
      });
    }
    const evaluator = verified.get(
      score.evaluatorCapsuleReference.qualified_digest,
    ) as DeepImprovementEvaluatorCapsuleMaterial | undefined;
    if (
      evaluator === undefined
      || evaluator.evaluatorEpochId !== score.evaluatorEpochId
    ) {
      semanticFailure('EPOCH_MISMATCH', 'Skill Benchmark score evaluator epoch does not match its bound evaluator capsule', {
        expectedEpoch: evaluator?.evaluatorEpochId ?? null,
        actualEpoch: score.evaluatorEpochId,
      });
    }
  }
}

/** Validate the closed event-to-seal binding without resolving artifact bytes. */
export function parseSkillBenchmarkSealedArtifactBinding<TKind extends SkillBenchmarkArtifactKind = SkillBenchmarkArtifactKind>(
  input: unknown,
): import('./skill-benchmark-sealed-artifact-types.js').SkillBenchmarkSealedArtifactBinding<TKind> {
  if (
    !isRecord(input)
    || Object.keys(input).length !== BINDING_FIELDS.size
    || Object.keys(input).some((field) => !BINDING_FIELDS.has(field))
  ) {
    return invalidBinding('shape');
  }
  if (input.bindingVersion !== 1) return invalidBinding('bindingVersion');
  if (typeof input.artifactKind !== 'string' || !OWN_ARTIFACT_KIND_SET.has(input.artifactKind)) {
    return invalidBinding('artifactKind');
  }
  if (typeof input.eventReference !== 'string' || !TOKEN_PATTERN.test(input.eventReference)) {
    return invalidBinding('eventReference');
  }
  let reference: SealedArtifactReference;
  try {
    reference = parseSealedArtifactReference(input.reference);
  } catch {
    return invalidBinding('reference');
  }
  if (reference.artifact_kind !== input.artifactKind) {
    return invalidBinding('reference.artifact_kind');
  }
  if (input.eventReference !== eventReference(reference)) {
    return invalidBinding('eventReference');
  }
  return Object.freeze({
    bindingVersion: 1,
    artifactKind: input.artifactKind as TKind,
    eventReference: input.eventReference,
    reference,
  });
}

/** Construct the real shared store with common and Skill Benchmark profiles. */
export function createSkillBenchmarkSealedArtifactStore(
  options: ArtifactStoreOptions,
): SealedArtifactStore {
  return new SealedArtifactStore(
    options,
    createSkillBenchmarkArtifactCanonicalizerRegistry(),
  );
}

/** Seal one closed mode material through the shared immutable store. */
export async function sealSkillBenchmarkArtifact<TKind extends SkillBenchmarkArtifactKind>(
  store: SealedArtifactStore,
  artifactKind: TKind,
  material: SkillBenchmarkArtifactMaterialByKind[TKind],
): Promise<import('./skill-benchmark-sealed-artifact-types.js').SkillBenchmarkSealedArtifactBinding<TKind>> {
  if (!OWN_ARTIFACT_KIND_SET.has(artifactKind)) return invalidBinding('artifactKind');
  const parsedMaterial = parseSkillBenchmarkArtifactMaterial(artifactKind, material);
  await verifyMaterialReferences(store, parsedMaterial, {}, new Set(), new Map());
  const sealed = await store.seal(artifactKind, parsedMaterial, {
    canonicalizationVersion: SKILL_BENCHMARK_ARTIFACT_CANONICALIZATION_VERSION,
    mediaType: SKILL_BENCHMARK_ARTIFACT_MEDIA_TYPE,
  });
  return Object.freeze({
    bindingVersion: 1,
    artifactKind,
    eventReference: eventReference(sealed.artifact.reference),
    reference: sealed.artifact.reference,
  });
}

/** Release mode bytes only after the shared store and all referenced adapters verify them. */
export async function readSkillBenchmarkArtifact<TKind extends SkillBenchmarkArtifactKind>(
  store: SealedArtifactStore,
  input: unknown,
  policy: DeepImprovementArtifactReadPolicy = {},
): Promise<SkillBenchmarkVerifiedSealedArtifact<TKind>> {
  const binding = parseSkillBenchmarkSealedArtifactBinding<TKind>(input);
  const artifact = await store.readVerified(binding.reference, binding.artifactKind);
  const material = parseCanonicalEnvelope(binding.artifactKind, artifact.bytes);
  if (!sameReference(binding.reference, artifact.reference)) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.DESCRIPTOR_CONFLICT,
      'read',
      'Skill Benchmark binding reference does not match the verified artifact',
    );
  }
  await verifyMaterialReferences(
    store,
    material,
    policy,
    new Set([binding.reference.qualified_digest]),
    new Map(),
  );
  return Object.freeze({
    binding,
    descriptor: artifact.descriptor,
    bytes: artifact.bytes,
  });
}

export type SkillBenchmarkArtifactReadOptions = DeepImprovementArtifactReadPolicy;

export type SkillBenchmarkEffectCertificateInput = SkillBenchmarkEffectCertificateInputMaterial;
