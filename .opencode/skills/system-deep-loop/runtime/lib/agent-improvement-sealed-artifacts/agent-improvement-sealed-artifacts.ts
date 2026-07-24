// MODULE: Agent Improvement Sealed Artifact Adapter

import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
  SealedArtifactStore,
  parseSealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import {
  DeepImprovementArtifactReadError,
  DeepImprovementArtifactReadFailureCodes,
  DeepImprovementCommonArtifactKinds,
  DEEP_IMPROVEMENT_COMMON_SEALED_ARTIFACT_CONTRACT,
  createDeepImprovementCommonSealedArtifactStore,
  parseDeepImprovementCommonSealedArtifactBinding,
  readDeepImprovementCandidateView,
  readDeepImprovementCommonArtifact,
  readDeepImprovementPromotionEvidence,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import {
  AGENT_IMPROVEMENT_ARTIFACT_CANONICALIZATION_VERSION,
  AGENT_IMPROVEMENT_ARTIFACT_KIND_REGISTRY,
  AGENT_IMPROVEMENT_ARTIFACT_MEDIA_TYPE,
  agentImprovementNamedReferenceExpectations,
  createAgentImprovementArtifactCanonicalizerRegistry,
  isAgentImprovementArtifactKind,
  parseAgentImprovementArtifactMaterial,
} from './agent-improvement-artifact-material.js';
import {
  AgentImprovementArtifactKinds,
} from './agent-improvement-sealed-artifact-types.js';

import type {
  ArtifactStoreOptions,
  SealDescriptor,
  SealedArtifactReference,
  VerifiedSealedArtifact,
} from '../sealed-reference-artifacts/index.js';
import type {
  DeepImprovementArtifactReadPolicy,
  DeepImprovementCandidateFacingView,
  DeepImprovementCommonArtifactKind,
  DeepImprovementCommonSealedArtifactBinding,
  DeepImprovementCommonArtifactMaterialByKind,
  DeepImprovementPromotionEvidenceMaterial,
  DeepImprovementVerifiedSealedArtifact,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import type {
  AgentImprovementArtifactKind,
  AgentImprovementArtifactMaterial,
  AgentImprovementArtifactMaterialByKind,
  AgentImprovementArtifactReadPolicy,
  AgentImprovementCommonServiceBindings,
  AgentImprovementSealedArtifactBinding,
  AgentImprovementVerifiedSealedArtifact,
} from './agent-improvement-sealed-artifact-types.js';

const BINDING_FIELDS = new Set([
  'bindingVersion',
  'artifactKind',
  'eventReference',
  'reference',
]);
const REGISTERED_KINDS: ReadonlySet<string> = new Set(
  AGENT_IMPROVEMENT_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind),
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
    'Agent Improvement sealed-artifact binding is malformed or mutable-only',
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

function parseCanonicalEnvelope(
  artifactKind: AgentImprovementArtifactKind,
  bytes: readonly number[],
): AgentImprovementArtifactMaterial {
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(bytes).toString('utf8')) as unknown;
  } catch {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      'read',
      'Agent Improvement sealed material is not valid JSON',
      { artifactKind },
    );
  }
  if (
    !isRecord(parsed)
    || Object.keys(parsed).length !== 2
    || parsed.artifactKind !== artifactKind
    || !Object.prototype.hasOwnProperty.call(parsed, 'material')
  ) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
      'read',
      'Agent Improvement sealed material envelope is not closed',
      { artifactKind },
    );
  }
  return parseAgentImprovementArtifactMaterial(artifactKind, parsed.material);
}

function bindingForCommonReference(
  reference: SealedArtifactReference,
): DeepImprovementCommonSealedArtifactBinding {
  if (!Object.values(DeepImprovementCommonArtifactKinds).includes(
    reference.artifact_kind as typeof DeepImprovementCommonArtifactKinds[keyof typeof DeepImprovementCommonArtifactKinds],
  )) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.INVALID_INPUT,
      'read',
      'Reference is not a Deep Improvement Common artifact kind',
      { artifactKind: reference.artifact_kind },
    );
  }
  return Object.freeze({
    bindingVersion: 1,
    artifactKind: reference.artifact_kind as DeepImprovementCommonArtifactKind,
    eventReference: eventReference(reference),
    reference,
  });
}

function readPolicyForCommon(policy: AgentImprovementArtifactReadPolicy): DeepImprovementArtifactReadPolicy {
  return {
    consumer: policy.consumer,
    accessRole: policy.accessRole,
    now: policy.now,
    requiredEvaluationEpochId: policy.requiredEvaluationEpochId,
  };
}

function policyMismatch(field: string): never {
  throw new DeepImprovementArtifactReadError(
    DeepImprovementArtifactReadFailureCodes.EPOCH_MISMATCH,
    'Agent Improvement artifact does not satisfy its read compatibility policy',
    { field },
  );
}

function applyAgentReadPolicy(
  material: AgentImprovementArtifactMaterial,
  policy: AgentImprovementArtifactReadPolicy,
): void {
  if (
    policy.requiredEvaluationEpochId !== undefined
    && 'evaluationEpochId' in material
    && material.evaluationEpochId !== policy.requiredEvaluationEpochId
  ) policyMismatch('evaluationEpochId');
  if (
    policy.requiredExposureEpochId !== undefined
    && 'exposureEpochId' in material
    && material.exposureEpochId !== policy.requiredExposureEpochId
  ) policyMismatch('exposureEpochId');
  if (
    policy.requiredExecutorFingerprint !== undefined
    && 'executorFingerprint' in material
    && material.executorFingerprint !== policy.requiredExecutorFingerprint
  ) policyMismatch('executorFingerprint');
}

async function verifyDependencyClosure(
  store: SealedArtifactStore,
  references: readonly SealedArtifactReference[],
  visited: Set<string>,
): Promise<void> {
  for (const reference of references) {
    if (visited.has(reference.qualified_digest)) continue;
    visited.add(reference.qualified_digest);
    if (
      Object.values(DeepImprovementCommonArtifactKinds).includes(
        reference.artifact_kind as typeof DeepImprovementCommonArtifactKinds[keyof typeof DeepImprovementCommonArtifactKinds],
      )
    ) {
      await readDeepImprovementCommonArtifact(
        store,
        bindingForCommonReference(reference),
      );
      continue;
    }
    let verified: VerifiedSealedArtifact;
    try {
      verified = await store.readVerified(reference);
    } catch (error: unknown) {
      if (error instanceof SealedArtifactError) {
        throw new DeepImprovementArtifactReadError(
          DeepImprovementArtifactReadFailureCodes.DEPENDENCY_MISMATCH,
          'A sealed Agent Improvement dependency could not be verified',
          { dependency: reference.qualified_digest, cause: error.code },
        );
      }
      throw error;
    }
    if (!isAgentImprovementArtifactKind(verified.reference.artifact_kind)) continue;
    const material = parseCanonicalEnvelope(verified.reference.artifact_kind, verified.bytes);
    const derived = store.derive(
      verified.reference.artifact_kind,
      material,
      {
        canonicalizationVersion: AGENT_IMPROVEMENT_ARTIFACT_CANONICALIZATION_VERSION,
        mediaType: AGENT_IMPROVEMENT_ARTIFACT_MEDIA_TYPE,
      },
    );
    if (
      Buffer.compare(Buffer.from(derived.bytes), Buffer.from(verified.bytes)) !== 0
      || !sameReference(derived.reference, verified.reference)
    ) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.DESCRIPTOR_CONFLICT,
        'read',
        'Agent Improvement dependency does not reproduce its sealed reference',
        { qualifiedDigest: reference.qualified_digest },
      );
    }
    await verifyDependencyClosure(
      store,
      material.dependencyReferences.map((dependency) => dependency.reference),
      visited,
    );
  }
}

async function verifyNamedReferences(
  store: SealedArtifactStore,
  artifactKind: AgentImprovementArtifactKind,
  material: AgentImprovementArtifactMaterial,
): Promise<void> {
  for (const expectation of agentImprovementNamedReferenceExpectations(artifactKind, material)) {
    try {
      await store.readVerified(expectation.reference, expectation.expectedKind);
    } catch (error: unknown) {
      if (error instanceof SealedArtifactError) {
        throw new DeepImprovementArtifactReadError(
          DeepImprovementArtifactReadFailureCodes.DEPENDENCY_MISMATCH,
          'A named Agent Improvement reference does not satisfy its artifact-kind contract',
          {
            field: expectation.field,
            expectedKind: expectation.expectedKind,
            cause: error.code,
          },
        );
      }
      throw error;
    }
  }
}

/** Validate the closed event-to-seal binding without resolving artifact bytes. */
export function parseAgentImprovementSealedArtifactBinding<TKind extends AgentImprovementArtifactKind = AgentImprovementArtifactKind>(
  input: unknown,
): AgentImprovementSealedArtifactBinding<TKind> {
  if (
    !isRecord(input)
    || Object.keys(input).length !== BINDING_FIELDS.size
    || Object.keys(input).some((field) => !BINDING_FIELDS.has(field))
  ) return invalidBinding('shape');
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

/** Construct the agent extension store with common canonicalizers and the shared immutable sealer. */
export function createAgentImprovementSealedArtifactStore(
  options: ArtifactStoreOptions,
): SealedArtifactStore {
  return new SealedArtifactStore(options, createAgentImprovementArtifactCanonicalizerRegistry());
}

/** Backward-compatible name for callers that need the composed common store. */
export const createAgentImprovementCommonSealedArtifactStore =
  createAgentImprovementSealedArtifactStore;

/** Seal one closed agent material capsule through the shared immutable store. */
export async function sealAgentImprovementArtifact<TKind extends AgentImprovementArtifactKind>(
  store: SealedArtifactStore,
  artifactKind: TKind,
  material: AgentImprovementArtifactMaterialByKind[TKind],
): Promise<AgentImprovementSealedArtifactBinding<TKind>> {
  if (!REGISTERED_KINDS.has(artifactKind)) return invalidBinding('artifactKind');
  const sealed = await store.seal(artifactKind, material, {
    canonicalizationVersion: AGENT_IMPROVEMENT_ARTIFACT_CANONICALIZATION_VERSION,
    mediaType: AGENT_IMPROVEMENT_ARTIFACT_MEDIA_TYPE,
  });
  return Object.freeze({
    bindingVersion: 1,
    artifactKind,
    eventReference: eventReference(sealed.artifact.reference),
    reference: sealed.artifact.reference,
  });
}

/** Release agent bytes only after binding, canonical material, dependencies, and policy pass. */
export async function readAgentImprovementArtifact<TKind extends AgentImprovementArtifactKind>(
  store: SealedArtifactStore,
  input: unknown,
  policy: AgentImprovementArtifactReadPolicy = {},
): Promise<AgentImprovementVerifiedSealedArtifact<TKind>> {
  const binding = parseAgentImprovementSealedArtifactBinding<TKind>(input);
  const verified = await store.readVerified(binding.reference, binding.artifactKind);
  const material = parseCanonicalEnvelope(binding.artifactKind, verified.bytes);
  const derived = store.derive(binding.artifactKind, material, {
    canonicalizationVersion: AGENT_IMPROVEMENT_ARTIFACT_CANONICALIZATION_VERSION,
    mediaType: AGENT_IMPROVEMENT_ARTIFACT_MEDIA_TYPE,
  });
  if (
    Buffer.compare(Buffer.from(derived.bytes), Buffer.from(verified.bytes)) !== 0
    || !sameReference(derived.reference, verified.reference)
  ) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.DESCRIPTOR_CONFLICT,
      'read',
      'Agent Improvement material does not reproduce its sealed reference',
      { qualifiedDigest: verified.reference.qualified_digest },
    );
  }
  await verifyNamedReferences(store, binding.artifactKind, material);
  await verifyDependencyClosure(
    store,
    material.dependencyReferences.map((dependency) => dependency.reference),
    new Set([binding.reference.qualified_digest]),
  );
  applyAgentReadPolicy(material, policy);
  return Object.freeze({
    binding,
    descriptor: verified.descriptor,
    bytes: verified.bytes,
  });
}

export function parseAgentImprovementCommonSealedArtifactBinding<TKind extends DeepImprovementCommonArtifactKind = DeepImprovementCommonArtifactKind>(
  input: unknown,
): DeepImprovementCommonSealedArtifactBinding<TKind> {
  return parseDeepImprovementCommonSealedArtifactBinding<TKind>(input);
}

export async function readAgentImprovementCommonArtifact<TKind extends DeepImprovementCommonArtifactKind>(
  store: SealedArtifactStore,
  input: DeepImprovementCommonSealedArtifactBinding<TKind> | unknown,
  policy: AgentImprovementArtifactReadPolicy = {},
): Promise<DeepImprovementVerifiedSealedArtifact<TKind>> {
  return readDeepImprovementCommonArtifact(store, input, readPolicyForCommon(policy));
}

export async function readAgentImprovementCandidateView(
  store: SealedArtifactStore,
  input: DeepImprovementCommonSealedArtifactBinding<typeof DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE> | unknown,
  policy: AgentImprovementArtifactReadPolicy = {},
): Promise<DeepImprovementCandidateFacingView> {
  return readDeepImprovementCandidateView(store, input, readPolicyForCommon(policy));
}

export async function readAgentImprovementPromotionEvidence(
  store: SealedArtifactStore,
  input: DeepImprovementCommonSealedArtifactBinding<typeof DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE> | unknown,
  policy: AgentImprovementArtifactReadPolicy = {},
): Promise<DeepImprovementVerifiedSealedArtifact<typeof DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE>> {
  return readDeepImprovementPromotionEvidence(store, input, readPolicyForCommon(policy));
}

export type AgentImprovementCommonEvaluatorMaterial =
  DeepImprovementCommonArtifactMaterialByKind[typeof DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE];
export type AgentImprovementCommonPromotionMaterial = DeepImprovementPromotionEvidenceMaterial;
export type AgentImprovementCommonDescriptor = SealDescriptor;
export type AgentImprovementCommonServiceBinding = AgentImprovementCommonServiceBindings;

export const AGENT_IMPROVEMENT_COMMON_SEALED_ARTIFACT_CONTRACT =
  DEEP_IMPROVEMENT_COMMON_SEALED_ARTIFACT_CONTRACT;

export {
  DeepImprovementArtifactReadError,
  DeepImprovementArtifactReadFailureCodes,
  DeepImprovementCommonArtifactKinds,
  createDeepImprovementCommonSealedArtifactStore,
};
