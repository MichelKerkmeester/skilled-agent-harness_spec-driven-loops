// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Sealed Artifact Adapter
// ───────────────────────────────────────────────────────────────────

import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
  SealedArtifactStore,
  parseSealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_ARTIFACT_CANONICALIZATION_VERSION,
  DEEP_IMPROVEMENT_COMMON_ARTIFACT_KIND_REGISTRY,
  DEEP_IMPROVEMENT_COMMON_ARTIFACT_MEDIA_TYPE,
  createDeepImprovementCommonArtifactCanonicalizerRegistry,
  isDeepImprovementCommonArtifactKind,
  parseDeepImprovementCommonArtifactMaterial,
} from './deep-improvement-common-artifact-material.js';
import {
  DeepImprovementArtifactReadError,
  DeepImprovementArtifactReadFailureCodes,
  DeepImprovementCommonArtifactKinds,
} from './deep-improvement-common-sealed-artifact-types.js';

import type {
  ArtifactStoreOptions,
  SealedArtifactReference,
  VerifiedSealedArtifact,
} from '../sealed-reference-artifacts/index.js';
import type {
  DeepImprovementArtifactAccessRole,
  DeepImprovementArtifactReadPolicy,
  DeepImprovementCandidateFacingView,
  DeepImprovementCommonArtifactKind,
  DeepImprovementCommonArtifactMaterial,
  DeepImprovementCommonArtifactMaterialByKind,
  DeepImprovementCommonSealedArtifactBinding,
  DeepImprovementEvaluatorCapsuleMaterial,
  DeepImprovementPromotionEvidenceMaterial,
  DeepImprovementRawTrialOutputMaterial,
  DeepImprovementVerifiedSealedArtifact,
} from './deep-improvement-common-sealed-artifact-types.js';

const BINDING_FIELDS = new Set([
  'bindingVersion',
  'artifactKind',
  'eventReference',
  'reference',
]);
const REGISTERED_KINDS: ReadonlySet<string> = new Set(
  DEEP_IMPROVEMENT_COMMON_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind),
);
const KNOWN_ACCESS_ROLES: ReadonlySet<string> = new Set([
  'canary',
  'candidate',
  'downstream',
  'evaluator',
  'promotion',
]);
const MOST_RESTRICTIVE_ACCESS_ROLE: DeepImprovementArtifactAccessRole = 'candidate';

interface EmbeddedReferenceExpectation {
  readonly field: string;
  readonly reference: SealedArtifactReference;
  readonly expectedArtifactKind: string;
}

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
    'Deep Improvement Common sealed-artifact binding is malformed or mutable-only',
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
  artifactKind: DeepImprovementCommonArtifactKind,
  bytes: readonly number[],
): DeepImprovementCommonArtifactMaterial {
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(bytes).toString('utf8')) as unknown;
  } catch {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      'read',
      'Deep Improvement Common sealed material is not valid JSON',
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
      'Deep Improvement Common sealed material envelope is not closed',
      { artifactKind },
    );
  }
  return parseDeepImprovementCommonArtifactMaterial(artifactKind, parsed.material);
}

function parseMaterialFromVerified(
  store: SealedArtifactStore,
  verified: VerifiedSealedArtifact,
): DeepImprovementCommonArtifactMaterial {
  if (!isDeepImprovementCommonArtifactKind(verified.reference.artifact_kind)) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.INVALID_INPUT,
      'read',
      'Reference is not a Deep Improvement Common artifact kind',
      { artifactKind: verified.reference.artifact_kind },
    );
  }
  const material = parseCanonicalEnvelope(verified.reference.artifact_kind, verified.bytes);
  const derived = store.derive(verified.reference.artifact_kind, material, {
    canonicalizationVersion: DEEP_IMPROVEMENT_COMMON_ARTIFACT_CANONICALIZATION_VERSION,
    mediaType: DEEP_IMPROVEMENT_COMMON_ARTIFACT_MEDIA_TYPE,
  });
  if (
    Buffer.compare(Buffer.from(derived.bytes), Buffer.from(verified.bytes)) !== 0
    || !sameReference(derived.reference, verified.reference)
  ) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.DESCRIPTOR_CONFLICT,
      'read',
      'Deep Improvement Common material does not reproduce its sealed reference',
      { qualifiedDigest: verified.reference.qualified_digest },
    );
  }
  return material;
}

function bindingForMaterial<TKind extends DeepImprovementCommonArtifactKind>(
  artifactKind: TKind,
  reference: SealedArtifactReference,
): DeepImprovementCommonSealedArtifactBinding<TKind> {
  return Object.freeze({
    bindingVersion: 1,
    artifactKind,
    eventReference: eventReference(reference),
    reference,
  });
}

function embeddedReferenceExpectations(
  artifactKind: DeepImprovementCommonArtifactKind,
  material: DeepImprovementCommonArtifactMaterial,
): readonly EmbeddedReferenceExpectation[] {
  const expectations: EmbeddedReferenceExpectation[] = [];
  const seen = new Set<string>();
  const append = (
    field: string,
    reference: SealedArtifactReference,
    expectedArtifactKind = reference.artifact_kind,
  ): void => {
    const key = `${reference.qualified_digest}\u0000${expectedArtifactKind}`;
    if (seen.has(key)) return;
    seen.add(key);
    expectations.push({ field, reference, expectedArtifactKind });
  };
  const appendArray = (
    field: string,
    references: readonly SealedArtifactReference[],
  ): void => {
    references.forEach((reference, index) => append(`${field}[${index}]`, reference));
  };

  switch (artifactKind) {
    case DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE:
      break;
    case DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT: {
      const candidate = material as DeepImprovementCommonArtifactMaterialByKind[
        typeof DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT
      ];
      if (candidate.parentCandidateReference !== null) {
        append(
          'parentCandidateReference',
          candidate.parentCandidateReference,
          DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT,
        );
      }
      appendArray('sourceArtifactReferences', candidate.sourceArtifactReferences);
      break;
    }
    case DeepImprovementCommonArtifactKinds.BASELINE_INPUT: {
      const baseline = material as DeepImprovementCommonArtifactMaterialByKind[
        typeof DeepImprovementCommonArtifactKinds.BASELINE_INPUT
      ];
      append('incumbentReference', baseline.incumbentReference);
      appendArray('sourceArtifactReferences', baseline.sourceArtifactReferences);
      break;
    }
    case DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT: {
      const trial = material as DeepImprovementRawTrialOutputMaterial;
      append(
        'candidateInputReference',
        trial.candidateInputReference,
        DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT,
      );
      append(
        'baselineInputReference',
        trial.baselineInputReference,
        DeepImprovementCommonArtifactKinds.BASELINE_INPUT,
      );
      append(
        'evaluatorCapsuleReference',
        trial.evaluatorCapsuleReference,
        DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      );
      trial.caseObservations.forEach((observation, index) => {
        append(`caseObservations[${index}].outputReference`, observation.outputReference);
      });
      appendArray('traceReferences', trial.traceReferences);
      break;
    }
    case DeepImprovementCommonArtifactKinds.CANARY_EPOCH: {
      const canary = material as DeepImprovementCommonArtifactMaterialByKind[
        typeof DeepImprovementCommonArtifactKinds.CANARY_EPOCH
      ];
      if (canary.supersedesReference !== null) {
        append(
          'supersedesReference',
          canary.supersedesReference,
          DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
        );
      }
      break;
    }
    case DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE: {
      const promotion = material as DeepImprovementPromotionEvidenceMaterial;
      append(
        'candidateInputReference',
        promotion.candidateInputReference,
        DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT,
      );
      append(
        'baselineInputReference',
        promotion.baselineInputReference,
        DeepImprovementCommonArtifactKinds.BASELINE_INPUT,
      );
      append(
        'evaluatorCapsuleReference',
        promotion.evaluatorCapsuleReference,
        DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
      );
      append(
        'canaryEpochReference',
        promotion.canaryEpochReference,
        DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
      );
      append('targetRepairEvidenceReference', promotion.targetRepairEvidenceReference);
      append(
        'baselinePreservationEvidenceReference',
        promotion.baselinePreservationEvidenceReference,
      );
      append(
        'criticalDimensionEvidenceReference',
        promotion.criticalDimensionEvidenceReference,
      );
      append(
        'evaluatorIntegrityEvidenceReference',
        promotion.evaluatorIntegrityEvidenceReference,
      );
      append('canaryOutcomeEvidenceReference', promotion.canaryOutcomeEvidenceReference);
      append('uncertaintyEvidenceReference', promotion.uncertaintyEvidenceReference);
      append('costEvidenceReference', promotion.costEvidenceReference);
      append('rollbackTargetReference', promotion.rollbackTargetReference);
      break;
    }
  }

  material.dependencyReferences.forEach((dependency, index) => {
    append(`dependencyReferences[${index}].reference`, dependency.reference);
  });
  return expectations;
}

async function verifyDependencyClosure(
  store: SealedArtifactStore,
  artifactKind: DeepImprovementCommonArtifactKind,
  material: DeepImprovementCommonArtifactMaterial,
  visited: Set<string>,
): Promise<void> {
  const expectedEpoch = epochForMaterial(artifactKind, material);
  for (const expectation of embeddedReferenceExpectations(artifactKind, material)) {
    let dependency: VerifiedSealedArtifact;
    try {
      dependency = await store.readVerified(
        expectation.reference,
        expectation.expectedArtifactKind,
      );
    } catch (error: unknown) {
      if (error instanceof SealedArtifactError) {
        throw new DeepImprovementArtifactReadError(
          DeepImprovementArtifactReadFailureCodes.DEPENDENCY_MISMATCH,
          'An embedded sealed-artifact reference does not satisfy its field contract',
          {
            field: expectation.field,
            dependency: expectation.reference.qualified_digest,
            expectedArtifactKind: expectation.expectedArtifactKind,
            actualArtifactKind: expectation.reference.artifact_kind,
            cause: error.code,
          },
        );
      }
      throw error;
    }

    let dependencyMaterial: DeepImprovementCommonArtifactMaterial | undefined;
    if (isDeepImprovementCommonArtifactKind(dependency.reference.artifact_kind)) {
      dependencyMaterial = parseMaterialFromVerified(store, dependency);
    }
    if (
      dependency.reference.artifact_kind
      === DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE
    ) {
      const evaluator = dependencyMaterial as DeepImprovementEvaluatorCapsuleMaterial;
      if (evaluator.evaluatorEpochId !== expectedEpoch) {
        semanticFailure(
          'EPOCH_MISMATCH',
          'Evaluator capsule epoch does not match the consuming artifact epoch',
          {
            field: expectation.field,
            expectedEpoch,
            actualEpoch: evaluator.evaluatorEpochId,
          },
        );
      }
    }

    if (visited.has(dependency.reference.qualified_digest)) continue;
    visited.add(dependency.reference.qualified_digest);
    if (dependencyMaterial !== undefined) {
      await verifyDependencyClosure(
        store,
        dependency.reference.artifact_kind as DeepImprovementCommonArtifactKind,
        dependencyMaterial,
        visited,
      );
    }
  }
}

function epochForMaterial(
  _artifactKind: DeepImprovementCommonArtifactKind,
  material: DeepImprovementCommonArtifactMaterial,
): string {
  return 'evaluationEpochId' in material
    ? material.evaluationEpochId
    : material.evaluatorEpochId;
}

function nowFromPolicy(policy: DeepImprovementArtifactReadPolicy): Date {
  if (policy.now instanceof Date) return policy.now;
  if (typeof policy.now === 'function') return policy.now();
  return new Date();
}

function normalizeAccessRole(accessRole: unknown): DeepImprovementArtifactAccessRole {
  if (accessRole === undefined) return 'downstream';
  if (typeof accessRole !== 'string') return MOST_RESTRICTIVE_ACCESS_ROLE;
  const normalizedRole = accessRole.trim().toLowerCase();
  return KNOWN_ACCESS_ROLES.has(normalizedRole)
    ? normalizedRole as DeepImprovementArtifactAccessRole
    : MOST_RESTRICTIVE_ACCESS_ROLE;
}

function assertConsumerCanReceive(
  artifactKind: DeepImprovementCommonArtifactKind,
  role: DeepImprovementArtifactAccessRole,
): void {
  if (
    role === 'candidate'
    && (
      artifactKind === DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE
      || artifactKind === DeepImprovementCommonArtifactKinds.BASELINE_INPUT
      || artifactKind === DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT
      || artifactKind === DeepImprovementCommonArtifactKinds.CANARY_EPOCH
      || artifactKind === DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE
    )
  ) {
    semanticFailure(
      'LEAK_DETECTED',
      'Candidate access requires a redacted view and cannot release evaluator, canary, or promotion material',
    );
  }
}

function assertCanaryMaterialFresh(
  material: DeepImprovementCommonArtifactMaterialByKind[
    typeof DeepImprovementCommonArtifactKinds.CANARY_EPOCH
  ],
  policy: DeepImprovementArtifactReadPolicy,
): void {
  if (!policy.requireFreshCanary) return;
  const now = nowFromPolicy(policy).getTime();
  if (
    (material.lifecycle !== 'sealed' && material.lifecycle !== 'active')
    || new Date(material.expiresAt).getTime() <= now
    || new Date(material.sealedAt).getTime() > now
  ) {
    semanticFailure('STALE_CANARY', 'Canary evidence is burned, retired, expired, or not yet active');
  }
}

async function assertCanaryFresh(
  store: SealedArtifactStore,
  reference: SealedArtifactReference,
  expectedEpochId: string | undefined,
  policy: DeepImprovementArtifactReadPolicy,
): Promise<void> {
  if (!isDeepImprovementCommonArtifactKind(reference.artifact_kind)) {
    semanticFailure('DEPENDENCY_MISMATCH', 'Promotion evidence does not reference a common canary epoch');
  }
  if (reference.artifact_kind !== DeepImprovementCommonArtifactKinds.CANARY_EPOCH) {
    semanticFailure('DEPENDENCY_MISMATCH', 'Promotion evidence does not reference a canary epoch');
  }
  const verified = await store.readVerified(reference, DeepImprovementCommonArtifactKinds.CANARY_EPOCH);
  const material = parseMaterialFromVerified(store, verified);
  const canary = material as DeepImprovementCommonArtifactMaterialByKind[
    typeof DeepImprovementCommonArtifactKinds.CANARY_EPOCH
  ];
  if (expectedEpochId !== undefined && canary.evaluatorEpochId !== expectedEpochId) {
    semanticFailure('EPOCH_MISMATCH', 'Canary epoch does not match the required evaluator epoch', {
      expectedEpoch: expectedEpochId,
      actualEpoch: canary.evaluatorEpochId,
    });
  }
  if (policy.requiredCanaryEpochId !== undefined && canary.canaryEpochId !== policy.requiredCanaryEpochId) {
    semanticFailure('EPOCH_MISMATCH', 'Canary epoch identity does not match the consumer requirement');
  }
  assertCanaryMaterialFresh(canary, policy);
}

async function applyReadPolicy(
  artifactKind: DeepImprovementCommonArtifactKind,
  material: DeepImprovementCommonArtifactMaterial,
  policy: DeepImprovementArtifactReadPolicy,
): Promise<void> {
  if (policy.requiredEvaluationEpochId !== undefined) {
    const actualEpoch = epochForMaterial(artifactKind, material);
    if (actualEpoch !== policy.requiredEvaluationEpochId) {
      semanticFailure('EPOCH_MISMATCH', 'Artifact evaluator epoch does not match the consumer requirement', {
        expectedEpoch: policy.requiredEvaluationEpochId,
        actualEpoch,
      });
    }
  }
  if (artifactKind === DeepImprovementCommonArtifactKinds.CANARY_EPOCH) {
    assertCanaryMaterialFresh(
      material as DeepImprovementCommonArtifactMaterialByKind[
        typeof DeepImprovementCommonArtifactKinds.CANARY_EPOCH
      ],
      policy,
    );
  }
}

function assertPromotionAdmissible(material: DeepImprovementPromotionEvidenceMaterial): void {
  if (
    material.admissibility !== 'eligible'
    || material.targetRepair !== 'pass'
    || material.baselinePreservation !== 'pass'
    || material.criticalDimensions !== 'pass'
    || material.evaluatorIntegrity !== 'pass'
    || material.canaryOutcome !== 'pass'
    || material.uncertaintyLowerBound < material.uncertaintyThreshold
    || material.costMicros > material.costLimitMicros
    || material.unresolvedEvidenceDigests.length > 0
    || material.vetoEvidenceDigests.length > 0
  ) {
    semanticFailure('PROMOTION_INELIGIBLE', 'Promotion evidence is not admissible for promotion');
  }
}

/** Validate the closed event-to-seal binding without resolving artifact bytes. */
export function parseDeepImprovementCommonSealedArtifactBinding<TKind extends DeepImprovementCommonArtifactKind = DeepImprovementCommonArtifactKind>(
  input: unknown,
): DeepImprovementCommonSealedArtifactBinding<TKind> {
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

/** Construct the shared immutable store with common canonicalization profiles. */
export function createDeepImprovementCommonSealedArtifactStore(
  options: ArtifactStoreOptions,
): SealedArtifactStore {
  return new SealedArtifactStore(
    options,
    createDeepImprovementCommonArtifactCanonicalizerRegistry(),
  );
}

/** Seal one closed common material through the shared immutable store. */
export async function sealDeepImprovementCommonArtifact<
  TKind extends DeepImprovementCommonArtifactKind,
>(
  store: SealedArtifactStore,
  artifactKind: TKind,
  material: DeepImprovementCommonArtifactMaterialByKind[TKind],
): Promise<DeepImprovementCommonSealedArtifactBinding<TKind>> {
  if (!REGISTERED_KINDS.has(artifactKind)) return invalidBinding('artifactKind');
  const sealed = await store.seal(artifactKind, material, {
    canonicalizationVersion: DEEP_IMPROVEMENT_COMMON_ARTIFACT_CANONICALIZATION_VERSION,
    mediaType: DEEP_IMPROVEMENT_COMMON_ARTIFACT_MEDIA_TYPE,
  });
  return bindingForMaterial(artifactKind, sealed.artifact.reference);
}

async function readReference(
  store: SealedArtifactStore,
  reference: SealedArtifactReference,
  expectedKind?: DeepImprovementCommonArtifactKind,
): Promise<{
  readonly verified: VerifiedSealedArtifact;
  readonly material: DeepImprovementCommonArtifactMaterial;
}> {
  const verified = await store.readVerified(reference, expectedKind);
  const material = parseMaterialFromVerified(store, verified);
  return { verified, material };
}

/** Release common bytes only after the binding, material, dependency closure, and access policy pass. */
export async function readDeepImprovementCommonArtifact<
  TKind extends DeepImprovementCommonArtifactKind,
>(
  store: SealedArtifactStore,
  input: DeepImprovementCommonSealedArtifactBinding<TKind> | unknown,
  policy: DeepImprovementArtifactReadPolicy = {},
): Promise<DeepImprovementVerifiedSealedArtifact<TKind>> {
  const binding = parseDeepImprovementCommonSealedArtifactBinding<TKind>(input);
  const accessRole = normalizeAccessRole(policy.accessRole);
  const effectivePolicy: DeepImprovementArtifactReadPolicy = {
    ...policy,
    accessRole,
    requireFreshCanary: policy.requireFreshCanary
      ?? (accessRole === 'canary' || accessRole === 'promotion'),
  };
  assertConsumerCanReceive(binding.artifactKind, accessRole);
  const { verified, material } = await readReference(store, binding.reference, binding.artifactKind);
  await verifyDependencyClosure(
    store,
    binding.artifactKind,
    material,
    new Set([binding.reference.qualified_digest]),
  );
  await applyReadPolicy(binding.artifactKind, material, effectivePolicy);
  if (
    effectivePolicy.requiredCanaryEpochId !== undefined
    && binding.artifactKind === DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE
  ) {
    const promotion = material as DeepImprovementPromotionEvidenceMaterial;
    await assertCanaryFresh(
      store,
      promotion.canaryEpochReference,
      promotion.evaluatorEpochId,
      effectivePolicy,
    );
  }
  return Object.freeze({
    binding,
    descriptor: verified.descriptor,
    bytes: verified.bytes,
    material: material as DeepImprovementCommonArtifactMaterialByKind[TKind],
  });
}

/** Read a promotion input with the stricter canary and admissibility contract. */
export async function readDeepImprovementPromotionEvidence(
  store: SealedArtifactStore,
  input: DeepImprovementCommonSealedArtifactBinding<typeof DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE> | unknown,
  policy: DeepImprovementArtifactReadPolicy = {},
): Promise<DeepImprovementVerifiedSealedArtifact<typeof DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE>> {
  const verified = await readDeepImprovementCommonArtifact<
    typeof DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE
  >(
    store,
    input,
    {
      ...policy,
      accessRole: 'promotion',
      requireFreshCanary: true,
    },
  );
  const material = verified.material as DeepImprovementPromotionEvidenceMaterial;
  await assertCanaryFresh(store, material.canaryEpochReference, material.evaluatorEpochId, {
    ...policy,
    accessRole: 'promotion',
    requireFreshCanary: true,
  });
  assertPromotionAdmissible(material);
  return verified;
}

/** Return only commitments and bounded budget information to a candidate generator. */
export async function readDeepImprovementCandidateView(
  store: SealedArtifactStore,
  input: DeepImprovementCommonSealedArtifactBinding<typeof DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE> | unknown,
  policy: DeepImprovementArtifactReadPolicy = {},
): Promise<DeepImprovementCandidateFacingView> {
  const binding = parseDeepImprovementCommonSealedArtifactBinding(input);
  if (binding.artifactKind !== DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE) {
    return invalidBinding('candidate-view-kind');
  }
  const verified = await readDeepImprovementCommonArtifact(
    store,
    binding,
    { ...policy, accessRole: 'evaluator' },
  );
  const material = verified.material as DeepImprovementEvaluatorCapsuleMaterial;
  return Object.freeze({
    viewVersion: 1,
    artifactKind: DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
    evaluatorEpochId: material.evaluatorEpochId,
    evaluatorCommitmentDigest: material.evaluatorImplementationDigest,
    fixtureManifestCommitmentDigest: material.fixtureManifestDigest,
    hiddenAnchorCommitmentDigest: material.hiddenAnchorCommitmentDigest,
    calibrationCommitmentDigest: material.calibrationDigest,
    normalizationCommitmentDigest: material.normalizationDigest,
    visibilityPolicy: Object.freeze({
      candidateView: material.visibilityPolicy.candidateView,
      hiddenFixtures: material.visibilityPolicy.hiddenFixtures,
      exactScores: material.visibilityPolicy.exactScores,
      evaluatorInternals: material.visibilityPolicy.evaluatorInternals,
    }),
    budgetPolicy: Object.freeze({
      maxQueries: material.budgetPolicy.maxQueries,
      maxBytes: material.budgetPolicy.maxBytes,
    }),
  });
}
