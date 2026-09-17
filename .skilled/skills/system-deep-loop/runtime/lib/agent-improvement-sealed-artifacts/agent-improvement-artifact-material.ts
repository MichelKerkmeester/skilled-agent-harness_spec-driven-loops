// MODULE: Agent Improvement Artifact Material

import { canonicalBytes } from '../event-envelope/index.js';
import {
  ArtifactCanonicalizerRegistry,
  InitialArtifactKinds,
  SealedArtifactError,
  SealedArtifactErrorCodes,
  parseSealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import {
  AgentImprovementArtifactKinds,
} from './agent-improvement-sealed-artifact-types.js';
import {
  AgentImprovementEventStems,
} from '../agent-improvement-ledger-schema/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_ARTIFACT_CANONICALIZATION_VERSION,
  DEEP_IMPROVEMENT_COMMON_ARTIFACT_KIND_REGISTRY,
  DEEP_IMPROVEMENT_COMMON_ARTIFACT_MEDIA_TYPE,
  DeepImprovementCommonArtifactKinds,
  createDeepImprovementCommonArtifactCanonicalizerRegistry,
} from '../deep-improvement-common-sealed-artifacts/index.js';

import type {
  ArtifactCanonicalizerDefinition,
  SealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import type {
  AgentImprovementArtifactDependency,
  AgentImprovementArtifactEventBinding,
  AgentImprovementArtifactKind,
  AgentImprovementArtifactKindRegistration,
  AgentImprovementArtifactLocator,
  AgentImprovementArtifactMaterial,
  AgentImprovementArtifactMaterialByKind,
  AgentImprovementArtifactMaterialBase,
  AgentImprovementAgentIrBundleMaterial,
  AgentImprovementBehaviorCoverageMaterial,
  AgentImprovementCandidateProposalMaterial,
  AgentImprovementCausalAnalysisInputMaterial,
  AgentImprovementChangeContractBundleMaterial,
  AgentImprovementDependencyKind,
  AgentImprovementExposureRingReference,
  AgentImprovementFourRingExposureMaterial,
  AgentImprovementImproverLaneReferenceMaterial,
  AgentImprovementQueryBudget,
  AgentImprovementTrialTrajectoryMaterial,
  AgentImprovementVisibilityPolicy,
} from './agent-improvement-sealed-artifact-types.js';
import type {
  AgentImprovementEventStem,
  AgentIrComponentReference,
  AgentIrInheritanceEdgeReference,
  AgentIrLocusReference,
} from '../agent-improvement-ledger-schema/index.js';

export const AGENT_IMPROVEMENT_ARTIFACT_SCHEMA_VERSION =
  'agent-improvement-artifact@1';
export const AGENT_IMPROVEMENT_ARTIFACT_CANONICALIZATION_VERSION =
  'agent-improvement-binding@1';
export const AGENT_IMPROVEMENT_ARTIFACT_MEDIA_TYPE =
  'application/vnd.openai.agent-improvement-binding+json';

const REGISTRY_ROWS = [
  [AgentImprovementArtifactKinds.BASE_AGENT_BUNDLE, 'input', 'agent-ir'],
  [AgentImprovementArtifactKinds.CHANGE_CONTRACT_BUNDLE, 'input', 'change'],
  [AgentImprovementArtifactKinds.IMPROVER_LANE_REFERENCE, 'input', 'improver'],
  [AgentImprovementArtifactKinds.CAUSAL_ANALYSIS_INPUT, 'proposal', 'causal'],
  [AgentImprovementArtifactKinds.CANDIDATE_PROPOSAL, 'proposal', 'proposal'],
  [AgentImprovementArtifactKinds.TRIAL_TRAJECTORY, 'trial', 'trial'],
  [AgentImprovementArtifactKinds.BEHAVIOR_COVERAGE, 'coverage', 'coverage'],
  [AgentImprovementArtifactKinds.FOUR_RING_EXPOSURE, 'exposure', 'exposure'],
] as const;

export const AGENT_IMPROVEMENT_ARTIFACT_KIND_REGISTRY:
  readonly AgentImprovementArtifactKindRegistration[] = Object.freeze(
    REGISTRY_ROWS.map(([artifactKind, lifecycle, materialFamily]) => Object.freeze({
      artifactKind,
      lifecycle,
      materialFamily,
      canonicalizationVersion: AGENT_IMPROVEMENT_ARTIFACT_CANONICALIZATION_VERSION,
      mediaType: AGENT_IMPROVEMENT_ARTIFACT_MEDIA_TYPE,
    })),
  );

const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;
const CODE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._/@-]{0,127}$/;
const SELECTOR_PATTERN = /^(?:#[A-Za-z0-9_-]+|[A-Za-z][A-Za-z0-9_-]*(?::[A-Za-z0-9._/#:@?=&%+\-]+)?|\/[A-Za-z0-9._~:/?#\[\]@!$&'()*+,;=%+\-]+)$/u;
const MAX_ARRAY_ITEMS = 256;
const MAX_SELECTOR_SPACES = 16;
const MAX_REASON_LENGTH = 256;

const BASE_FIELDS = [
  'schemaVersion', 'artifactId', 'dependencyReferences', 'originEvent', 'producerVersion',
  'locator', 'agentDefinitionRef', 'agentDefinitionDigest', 'agentIrRef', 'agentIrDigest',
  'agentIrSchemaVersion', 'components', 'inheritanceEdges', 'loci', 'capabilityPolicyDigest',
  'authorityPolicyDigest', 'toolConfigurationDigest', 'routingConfigurationDigest',
  'memoryConfigurationDigest', 'inferenceConfigurationDigest', 'executorConfigurationDigest',
  'parentAgentReference',
] as const;
const CHANGE_FIELDS = [
  'schemaVersion', 'artifactId', 'dependencyReferences', 'originEvent', 'producerVersion',
  'locator', 'agentIrReference', 'baseDefinitionRef', 'baseDefinitionDigest',
  'candidateDefinitionRef', 'candidateDefinitionDigest', 'changeContractRef',
  'changeContractDigest', 'patchRef', 'patchDigest', 'changedComponentIds',
  'changedClauseIds', 'inheritedClauseIds', 'intendedBehaviorDigest',
  'preservedBehaviorDigest', 'staticAssertionsDigest', 'tracePolicyDigest',
  'scenarioSetDigest', 'behavioralSemverIntent', 'operatorReference',
  'parentLineageReference',
] as const;
const IMPROVER_FIELDS = [
  'schemaVersion', 'artifactId', 'dependencyReferences', 'originEvent', 'producerVersion',
  'locator', 'experimentLineageId', 'improverModelRef', 'improverModelDigest',
  'improverBuildRef', 'improverBuildDigest', 'promptPolicyDigest', 'trainingCorpusDigest',
  'developmentCorpusDigest', 'sealedFailureCorpusDigest', 'optimizerVersion',
  'mutationOperatorReference', 'mutationOperatorVersion', 'visibilityPolicy',
  'queryBudget', 'parentCandidateReference',
] as const;
const VISIBILITY_FIELDS = [
  'candidateVisibleEvidence', 'hiddenFixtures', 'exactTerminalScores',
  'evaluatorInternals', 'terminalEvidence',
] as const;
const BUDGET_FIELDS = ['maxQueries', 'maxBytes', 'maxWallClockMs', 'maxCostMicros'] as const;
const CAUSAL_FIELDS = [
  'schemaVersion', 'artifactId', 'dependencyReferences', 'originEvent', 'producerVersion',
  'locator', 'failureClusterReference', 'failureClusterDigest',
  'firstDivergentTraceReference', 'firstDivergentTraceDigest', 'knownDefectLocusId',
  'knownDefectLocusDigest', 'counterfactualInterventionReference',
  'counterfactualInterventionDigest', 'proposalVisibleEvidenceReference',
  'proposalVisibleEvidenceDigest', 'parentCandidateReference', 'evidenceExposurePolicy',
] as const;
const PROPOSAL_FIELDS = [
  'schemaVersion', 'artifactId', 'dependencyReferences', 'originEvent', 'producerVersion',
  'locator', 'candidateId', 'candidatePackageRef', 'candidatePackageDigest',
  'candidateAgentIrRef', 'candidateAgentIrDigest', 'parentAgentReference',
  'changeContractReference', 'improverLaneReference', 'causalAnalysisReference',
  'atomicPatchLineageReference', 'atomicPatchLineageDigest', 'proposalRationaleReference',
  'proposalRationaleDigest', 'mutationOperatorReference', 'mutationOperatorVersion',
  'parentCandidateReference',
] as const;
const TRIAL_FIELDS = [
  'schemaVersion', 'artifactId', 'dependencyReferences', 'originEvent', 'producerVersion',
  'locator', 'trialId', 'candidateProposalReference', 'baselineAgentReference',
  'evaluatorCapsuleReference', 'commonRawTrialReference', 'evaluationEpochId',
  'taskManifestReference', 'taskManifestDigest', 'behaviorFamilyId',
  'semanticVariantReference', 'semanticVariantDigest', 'authorityConflictReference',
  'authorityConflictDigest', 'negativeCapabilityReference', 'negativeCapabilityDigest',
  'seed', 'executorReference', 'executorFingerprint', 'environmentReference',
  'environmentDigest', 'normalizedTraceReference', 'normalizedTraceDigest',
  'sideEffectObservationReference', 'sideEffectObservationDigest',
  'receiptPredicateReference', 'receiptPredicateDigest', 'caseOutcomeVectorDigest',
  'integrityObservationReference', 'integrityObservationDigest', 'normalizationVersion',
] as const;
const COVERAGE_FIELDS = [
  'schemaVersion', 'artifactId', 'dependencyReferences', 'originEvent', 'producerVersion',
  'locator', 'coverageId', 'evaluationEpochId', 'exposureEpochId', 'clauseDigests',
  'behaviorFamilyIds', 'authorityConflictCaseDigests', 'transitionCaseDigests',
  'sideEffectOracleDigests', 'negativeCapabilityCaseDigests', 'perturbationDigests',
  'untouchedFamilySentinelDigests', 'semanticVariantDigests', 'executorDigests',
  'rotatingCanaryReference', 'coverageManifestDigest', 'coverageOutcome',
  'criticalInvariantOutcome',
] as const;
const EXPOSURE_FIELDS = [
  'schemaVersion', 'artifactId', 'dependencyReferences', 'originEvent', 'producerVersion',
  'locator', 'manifestId', 'evaluationEpochId', 'exposureEpochId', 'rings',
  'evaluatorCapsuleReference', 'canaryEpochReference', 'hiddenAnchorCommitmentDigest',
  'leakVetoPolicyVersion',
] as const;
const RING_FIELDS = [
  'ring', 'fixtureSetReference', 'fixtureSetDigest', 'fixtureCount', 'exposureEpochId',
  'lifecycle', 'retirementReason',
] as const;
const LOCATOR_FIELDS = ['scheme', 'locatorDigest', 'selector', 'revision'] as const;
const DEPENDENCY_FIELDS = ['artifactKind', 'purpose', 'reference'] as const;
const EVENT_FIELDS = ['eventStem', 'eventId', 'payloadDigest'] as const;
const COMPONENT_FIELDS = ['componentId', 'componentKind', 'componentRef', 'componentDigest'] as const;
const EDGE_FIELDS = ['edgeId', 'parentComponentId', 'childComponentId', 'inheritanceKind', 'edgeDigest'] as const;
const LOCUS_FIELDS = ['locusId', 'componentId', 'clauseId', 'locusKind', 'mutability', 'locusRef', 'locusDigest'] as const;

const KIND_SET: ReadonlySet<string> = new Set(
  AGENT_IMPROVEMENT_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind),
);
const COMMON_KIND_SET: ReadonlySet<string> = new Set(
  DEEP_IMPROVEMENT_COMMON_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind),
);
const INITIAL_KIND_SET: ReadonlySet<string> = new Set(Object.values(InitialArtifactKinds));
const EVENT_STEM_SET: ReadonlySet<string> = new Set(AgentImprovementEventStems);
const NAMED_REFERENCE_KINDS = Object.freeze({
  parentAgent: AgentImprovementArtifactKinds.BASE_AGENT_BUNDLE,
  agentIr: AgentImprovementArtifactKinds.BASE_AGENT_BUNDLE,
  changeContract: AgentImprovementArtifactKinds.CHANGE_CONTRACT_BUNDLE,
  improverLane: AgentImprovementArtifactKinds.IMPROVER_LANE_REFERENCE,
  causalAnalysis: AgentImprovementArtifactKinds.CAUSAL_ANALYSIS_INPUT,
  candidateProposal: AgentImprovementArtifactKinds.CANDIDATE_PROPOSAL,
  failureEvidence: InitialArtifactKinds.PRIOR_RUN_OUTPUT,
  intervention: InitialArtifactKinds.CONFIGURATION,
  fixture: InitialArtifactKinds.FIXTURE,
  executor: InitialArtifactKinds.CONFIGURATION,
  rawObservation: InitialArtifactKinds.PRIOR_RUN_OUTPUT,
  evaluator: DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
  rawTrial: DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT,
  canaryEpoch: DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
} as const satisfies Readonly<Record<string, AgentImprovementDependencyKind>>);

export interface AgentImprovementNamedReferenceExpectation {
  readonly field: string;
  readonly reference: SealedArtifactReference;
  readonly expectedKind: AgentImprovementDependencyKind;
}

function invalidMaterial(artifactKind: string, field: string): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.INVALID_INPUT,
    'canonicalization',
    'Agent Improvement artifact material violates its closed field contract',
    { artifactKind, field },
  );
}

function unsupportedArtifactKind(artifactKind: never): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.UNSUPPORTED_ARTIFACT_KIND,
    'canonicalization',
    'Agent Improvement artifact kind is not registered',
    { artifactKind: String(artifactKind) },
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
  return keys.length === fields.length && keys.every((key) => expected.has(key));
}

function requireRecord(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
  fields: readonly string[],
): Record<string, unknown> {
  if (!isRecord(input) || !hasExactFields(input, fields)) return invalidMaterial(artifactKind, 'shape');
  return input;
}

function requireToken(
  artifactKind: AgentImprovementArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !TOKEN_PATTERN.test(value)) return invalidMaterial(artifactKind, field);
  return value;
}

function requireCode(
  artifactKind: AgentImprovementArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !CODE_PATTERN.test(value)) return invalidMaterial(artifactKind, field);
  return value;
}

function requireDigest(
  artifactKind: AgentImprovementArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !DIGEST_PATTERN.test(value)) return invalidMaterial(artifactKind, field);
  return value;
}

function requireBoundedReason(
  artifactKind: AgentImprovementArtifactKind,
  field: string,
  value: unknown,
): string | null {
  if (value === null) return null;
  if (
    typeof value !== 'string'
    || value.length === 0
    || value.length > MAX_REASON_LENGTH
    || /[\u0000-\u001f\u007f\r\n]/u.test(value)
  ) return invalidMaterial(artifactKind, field);
  return value;
}

function requireBooleanEnum<T extends string>(
  artifactKind: AgentImprovementArtifactKind,
  field: string,
  value: unknown,
  allowed: readonly T[],
): T {
  if (typeof value !== 'string' || !allowed.includes(value as T)) return invalidMaterial(artifactKind, field);
  return value as T;
}

function requireUint32(
  artifactKind: AgentImprovementArtifactKind,
  field: string,
  value: unknown,
): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0 || (value as number) > 0xffff_ffff) {
    return invalidMaterial(artifactKind, field);
  }
  return value as number;
}

function requireNonZeroUint32(
  artifactKind: AgentImprovementArtifactKind,
  field: string,
  value: unknown,
): number {
  const parsed = requireUint32(artifactKind, field, value);
  if (parsed === 0) return invalidMaterial(artifactKind, field);
  return parsed;
}

function requireArray<T>(
  artifactKind: AgentImprovementArtifactKind,
  field: string,
  value: unknown,
  parse: (entry: unknown, index: number) => T,
  minimum = 1,
): readonly T[] {
  if (!Array.isArray(value) || value.length < minimum || value.length > MAX_ARRAY_ITEMS) {
    return invalidMaterial(artifactKind, field);
  }
  return Object.freeze(value.map(parse));
}

function requireTokenArray(
  artifactKind: AgentImprovementArtifactKind,
  field: string,
  value: unknown,
  minimum = 1,
): readonly string[] {
  return requireArray(
    artifactKind,
    field,
    value,
    (entry, index) => requireToken(artifactKind, `${field}[${index}]`, entry),
    minimum,
  );
}

function requireDigestArray(
  artifactKind: AgentImprovementArtifactKind,
  field: string,
  value: unknown,
  minimum = 1,
): readonly string[] {
  return requireArray(
    artifactKind,
    field,
    value,
    (entry, index) => requireDigest(artifactKind, `${field}[${index}]`, entry),
    minimum,
  );
}

function requireLocator(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
): AgentImprovementArtifactLocator {
  const value = requireRecord(artifactKind, input, LOCATOR_FIELDS);
  if (!['artifact', 'file', 'ledger', 'url'].includes(String(value.scheme))) {
    return invalidMaterial(artifactKind, 'locator.scheme');
  }
  if (
    typeof value.selector !== 'string'
    || value.selector.length === 0
    || value.selector.length > 256
    || !SELECTOR_PATTERN.test(value.selector)
    || (value.selector.match(/\s/gu)?.length ?? 0) > MAX_SELECTOR_SPACES
  ) return invalidMaterial(artifactKind, 'locator.selector');
  return Object.freeze({
    scheme: value.scheme as AgentImprovementArtifactLocator['scheme'],
    locatorDigest: requireDigest(artifactKind, 'locator.locatorDigest', value.locatorDigest),
    selector: value.selector,
    revision: value.revision === null
      ? null
      : requireToken(artifactKind, 'locator.revision', value.revision),
  });
}

function requireReference(
  artifactKind: AgentImprovementArtifactKind,
  field: string,
  value: unknown,
  expectedKinds?: readonly string[],
): SealedArtifactReference {
  let reference: SealedArtifactReference;
  try {
    reference = parseSealedArtifactReference(value);
  } catch {
    return invalidMaterial(artifactKind, field);
  }
  if (expectedKinds && !expectedKinds.includes(reference.artifact_kind)) {
    return invalidMaterial(artifactKind, `${field}.artifact_kind`);
  }
  return reference;
}

function requireReferenceDigest(
  artifactKind: AgentImprovementArtifactKind,
  field: string,
  referenceValue: unknown,
  digestValue: unknown,
  expectedKinds?: readonly string[],
): SealedArtifactReference {
  const reference = requireReference(artifactKind, field, referenceValue, expectedKinds);
  const digest = requireDigest(artifactKind, `${field}.content_digest`, digestValue);
  if (reference.content_digest !== digest) return invalidMaterial(artifactKind, `${field}.content_digest`);
  return reference;
}

function requireNamedReference(
  artifactKind: AgentImprovementArtifactKind,
  field: string,
  value: unknown,
  expectedKind: AgentImprovementDependencyKind,
): SealedArtifactReference {
  return requireReference(artifactKind, field, value, [expectedKind]);
}

function requireNamedReferenceDigest(
  artifactKind: AgentImprovementArtifactKind,
  field: string,
  referenceValue: unknown,
  digestValue: unknown,
  expectedKind: AgentImprovementDependencyKind,
): SealedArtifactReference {
  return requireReferenceDigest(
    artifactKind,
    field,
    referenceValue,
    digestValue,
    [expectedKind],
  );
}

function requireEventBinding(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
): AgentImprovementArtifactEventBinding {
  const value = requireRecord(artifactKind, input, EVENT_FIELDS);
  if (typeof value.eventStem !== 'string' || !EVENT_STEM_SET.has(value.eventStem)) {
    return invalidMaterial(artifactKind, 'originEvent.eventStem');
  }
  return Object.freeze({
    eventStem: value.eventStem as AgentImprovementEventStem,
    eventId: requireToken(artifactKind, 'originEvent.eventId', value.eventId),
    payloadDigest: requireDigest(artifactKind, 'originEvent.payloadDigest', value.payloadDigest),
  });
}

function requireDependency(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
  index: number,
): AgentImprovementArtifactDependency {
  const value = requireRecord(artifactKind, input, DEPENDENCY_FIELDS);
  if (
    typeof value.artifactKind !== 'string'
    || (!KIND_SET.has(value.artifactKind)
      && !COMMON_KIND_SET.has(value.artifactKind)
      && !INITIAL_KIND_SET.has(value.artifactKind))
  ) return invalidMaterial(artifactKind, `dependencyReferences[${index}].artifactKind`);
  const reference = requireReference(artifactKind, `dependencyReferences[${index}].reference`, value.reference);
  if (reference.artifact_kind !== value.artifactKind) {
    return invalidMaterial(artifactKind, `dependencyReferences[${index}].reference.artifact_kind`);
  }
  return Object.freeze({
    artifactKind: value.artifactKind as AgentImprovementDependencyKind,
    purpose: requireCode(artifactKind, `dependencyReferences[${index}].purpose`, value.purpose),
    reference,
  });
}

function requireDependencies(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
): readonly AgentImprovementArtifactDependency[] {
  return requireArray(
    artifactKind,
    'dependencyReferences',
    input,
    (entry, index) => requireDependency(artifactKind, entry, index),
    0,
  );
}

function requireDependencyCoverage(
  artifactKind: AgentImprovementArtifactKind,
  dependencies: readonly AgentImprovementArtifactDependency[],
  requiredReferences: readonly (SealedArtifactReference | null | undefined)[],
): void {
  const covered = new Set(dependencies.map((dependency) => dependency.reference.qualified_digest));
  for (const reference of requiredReferences) {
    if (reference !== null && reference !== undefined && !covered.has(reference.qualified_digest)) {
      return invalidMaterial(artifactKind, 'dependencyReferences');
    }
  }
}

function requireBase(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
  fields: readonly string[],
): AgentImprovementArtifactMaterialBase {
  const value = requireRecord(artifactKind, input, fields);
  return {
    schemaVersion: requireToken(artifactKind, 'schemaVersion', value.schemaVersion),
    artifactId: requireToken(artifactKind, 'artifactId', value.artifactId),
    dependencyReferences: requireDependencies(artifactKind, value.dependencyReferences),
    originEvent: requireEventBinding(artifactKind, value.originEvent),
    producerVersion: requireToken(artifactKind, 'producerVersion', value.producerVersion),
    locator: requireLocator(artifactKind, value.locator),
  };
}

function requireComponent(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
  index: number,
): AgentIrComponentReference {
  const value = requireRecord(artifactKind, input, COMPONENT_FIELDS);
  return Object.freeze({
    componentId: requireToken(artifactKind, `components[${index}].componentId`, value.componentId),
    componentKind: requireBooleanEnum(artifactKind, `components[${index}].componentKind`, value.componentKind, [
      'capability', 'instruction', 'memory', 'routing', 'tool-policy', 'verifier-policy',
    ]),
    componentRef: requireToken(artifactKind, `components[${index}].componentRef`, value.componentRef),
    componentDigest: requireDigest(artifactKind, `components[${index}].componentDigest`, value.componentDigest),
  });
}

function requireInheritanceEdge(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
  index: number,
): AgentIrInheritanceEdgeReference {
  const value = requireRecord(artifactKind, input, EDGE_FIELDS);
  return Object.freeze({
    edgeId: requireToken(artifactKind, `inheritanceEdges[${index}].edgeId`, value.edgeId),
    parentComponentId: requireToken(artifactKind, `inheritanceEdges[${index}].parentComponentId`, value.parentComponentId),
    childComponentId: requireToken(artifactKind, `inheritanceEdges[${index}].childComponentId`, value.childComponentId),
    inheritanceKind: requireBooleanEnum(artifactKind, `inheritanceEdges[${index}].inheritanceKind`, value.inheritanceKind, [
      'extends', 'imports', 'overrides', 'preserves',
    ]),
    edgeDigest: requireDigest(artifactKind, `inheritanceEdges[${index}].edgeDigest`, value.edgeDigest),
  });
}

function requireLocus(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
  index: number,
): AgentIrLocusReference {
  const value = requireRecord(artifactKind, input, LOCUS_FIELDS);
  return Object.freeze({
    locusId: requireToken(artifactKind, `loci[${index}].locusId`, value.locusId),
    componentId: requireToken(artifactKind, `loci[${index}].componentId`, value.componentId),
    clauseId: value.clauseId === null ? null : requireToken(artifactKind, `loci[${index}].clauseId`, value.clauseId),
    locusKind: requireBooleanEnum(artifactKind, `loci[${index}].locusKind`, value.locusKind, [
      'capability', 'instruction', 'memory', 'routing', 'tool-policy', 'verifier-policy',
    ]),
    mutability: requireBooleanEnum(artifactKind, `loci[${index}].mutability`, value.mutability, [
      'immutable', 'mutable',
    ]),
    locusRef: requireToken(artifactKind, `loci[${index}].locusRef`, value.locusRef),
    locusDigest: requireDigest(artifactKind, `loci[${index}].locusDigest`, value.locusDigest),
  });
}

function parseAgentIrBundle(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
): AgentImprovementAgentIrBundleMaterial {
  const value = requireRecord(artifactKind, input, BASE_FIELDS);
  const base = requireBase(artifactKind, value, BASE_FIELDS);
  const parentAgentReference = value.parentAgentReference === null
    ? null
    : requireNamedReference(
      artifactKind,
      'parentAgentReference',
      value.parentAgentReference,
      NAMED_REFERENCE_KINDS.parentAgent,
    );
  requireDependencyCoverage(artifactKind, base.dependencyReferences, [parentAgentReference]);
  return Object.freeze({
    ...base,
    agentDefinitionRef: requireToken(artifactKind, 'agentDefinitionRef', value.agentDefinitionRef),
    agentDefinitionDigest: requireDigest(artifactKind, 'agentDefinitionDigest', value.agentDefinitionDigest),
    agentIrRef: requireToken(artifactKind, 'agentIrRef', value.agentIrRef),
    agentIrDigest: requireDigest(artifactKind, 'agentIrDigest', value.agentIrDigest),
    agentIrSchemaVersion: requireToken(artifactKind, 'agentIrSchemaVersion', value.agentIrSchemaVersion),
    components: requireArray(artifactKind, 'components', value.components, (entry, index) => requireComponent(artifactKind, entry, index)),
    inheritanceEdges: requireArray(artifactKind, 'inheritanceEdges', value.inheritanceEdges, (entry, index) => requireInheritanceEdge(artifactKind, entry, index), 0),
    loci: requireArray(artifactKind, 'loci', value.loci, (entry, index) => requireLocus(artifactKind, entry, index), 0),
    capabilityPolicyDigest: requireDigest(artifactKind, 'capabilityPolicyDigest', value.capabilityPolicyDigest),
    authorityPolicyDigest: requireDigest(artifactKind, 'authorityPolicyDigest', value.authorityPolicyDigest),
    toolConfigurationDigest: requireDigest(artifactKind, 'toolConfigurationDigest', value.toolConfigurationDigest),
    routingConfigurationDigest: requireDigest(artifactKind, 'routingConfigurationDigest', value.routingConfigurationDigest),
    memoryConfigurationDigest: requireDigest(artifactKind, 'memoryConfigurationDigest', value.memoryConfigurationDigest),
    inferenceConfigurationDigest: requireDigest(artifactKind, 'inferenceConfigurationDigest', value.inferenceConfigurationDigest),
    executorConfigurationDigest: requireDigest(artifactKind, 'executorConfigurationDigest', value.executorConfigurationDigest),
    parentAgentReference,
  });
}

function parseChangeContract(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
): AgentImprovementChangeContractBundleMaterial {
  const value = requireRecord(artifactKind, input, CHANGE_FIELDS);
  const base = requireBase(artifactKind, value, CHANGE_FIELDS);
  const agentIrReference = requireNamedReference(
    artifactKind,
    'agentIrReference',
    value.agentIrReference,
    NAMED_REFERENCE_KINDS.agentIr,
  );
  const parentLineageReference = value.parentLineageReference === null
    ? null
    : requireNamedReference(
      artifactKind,
      'parentLineageReference',
      value.parentLineageReference,
      NAMED_REFERENCE_KINDS.changeContract,
    );
  requireDependencyCoverage(artifactKind, base.dependencyReferences, [
    agentIrReference,
    parentLineageReference,
  ]);
  return Object.freeze({
    ...base,
    agentIrReference,
    baseDefinitionRef: requireToken(artifactKind, 'baseDefinitionRef', value.baseDefinitionRef),
    baseDefinitionDigest: requireDigest(artifactKind, 'baseDefinitionDigest', value.baseDefinitionDigest),
    candidateDefinitionRef: requireToken(artifactKind, 'candidateDefinitionRef', value.candidateDefinitionRef),
    candidateDefinitionDigest: requireDigest(artifactKind, 'candidateDefinitionDigest', value.candidateDefinitionDigest),
    changeContractRef: requireToken(artifactKind, 'changeContractRef', value.changeContractRef),
    changeContractDigest: requireDigest(artifactKind, 'changeContractDigest', value.changeContractDigest),
    patchRef: requireToken(artifactKind, 'patchRef', value.patchRef),
    patchDigest: requireDigest(artifactKind, 'patchDigest', value.patchDigest),
    changedComponentIds: requireTokenArray(artifactKind, 'changedComponentIds', value.changedComponentIds),
    changedClauseIds: requireTokenArray(artifactKind, 'changedClauseIds', value.changedClauseIds),
    inheritedClauseIds: requireTokenArray(artifactKind, 'inheritedClauseIds', value.inheritedClauseIds, 0),
    intendedBehaviorDigest: requireDigest(artifactKind, 'intendedBehaviorDigest', value.intendedBehaviorDigest),
    preservedBehaviorDigest: requireDigest(artifactKind, 'preservedBehaviorDigest', value.preservedBehaviorDigest),
    staticAssertionsDigest: requireDigest(artifactKind, 'staticAssertionsDigest', value.staticAssertionsDigest),
    tracePolicyDigest: requireDigest(artifactKind, 'tracePolicyDigest', value.tracePolicyDigest),
    scenarioSetDigest: requireDigest(artifactKind, 'scenarioSetDigest', value.scenarioSetDigest),
    behavioralSemverIntent: requireBooleanEnum(artifactKind, 'behavioralSemverIntent', value.behavioralSemverIntent, ['major', 'minor', 'patch']),
    operatorReference: requireToken(artifactKind, 'operatorReference', value.operatorReference),
    parentLineageReference,
  });
}

function requireVisibilityPolicy(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
): AgentImprovementVisibilityPolicy {
  const value = requireRecord(artifactKind, input, VISIBILITY_FIELDS);
  return Object.freeze({
    candidateVisibleEvidence: requireBooleanEnum(artifactKind, 'visibilityPolicy.candidateVisibleEvidence', value.candidateVisibleEvidence, ['commitment-only', 'bounded-diagnostic']),
    hiddenFixtures: requireBooleanEnum(artifactKind, 'visibilityPolicy.hiddenFixtures', value.hiddenFixtures, ['withheld']),
    exactTerminalScores: requireBooleanEnum(artifactKind, 'visibilityPolicy.exactTerminalScores', value.exactTerminalScores, ['withheld']),
    evaluatorInternals: requireBooleanEnum(artifactKind, 'visibilityPolicy.evaluatorInternals', value.evaluatorInternals, ['withheld']),
    terminalEvidence: requireBooleanEnum(artifactKind, 'visibilityPolicy.terminalEvidence', value.terminalEvidence, ['withheld']),
  });
}

function requireQueryBudget(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
): AgentImprovementQueryBudget {
  const value = requireRecord(artifactKind, input, BUDGET_FIELDS);
  return Object.freeze({
    maxQueries: requireNonZeroUint32(artifactKind, 'queryBudget.maxQueries', value.maxQueries),
    maxBytes: requireNonZeroUint32(artifactKind, 'queryBudget.maxBytes', value.maxBytes),
    maxWallClockMs: requireNonZeroUint32(artifactKind, 'queryBudget.maxWallClockMs', value.maxWallClockMs),
    maxCostMicros: requireUint32(artifactKind, 'queryBudget.maxCostMicros', value.maxCostMicros),
  });
}

function parseImproverLane(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
): AgentImprovementImproverLaneReferenceMaterial {
  const value = requireRecord(artifactKind, input, IMPROVER_FIELDS);
  const base = requireBase(artifactKind, value, IMPROVER_FIELDS);
  const parentCandidateReference = value.parentCandidateReference === null
    ? null
    : requireNamedReference(
      artifactKind,
      'parentCandidateReference',
      value.parentCandidateReference,
      NAMED_REFERENCE_KINDS.candidateProposal,
    );
  requireDependencyCoverage(artifactKind, base.dependencyReferences, [
    parentCandidateReference,
  ]);
  return Object.freeze({
    ...base,
    experimentLineageId: requireToken(artifactKind, 'experimentLineageId', value.experimentLineageId),
    improverModelRef: requireToken(artifactKind, 'improverModelRef', value.improverModelRef),
    improverModelDigest: requireDigest(artifactKind, 'improverModelDigest', value.improverModelDigest),
    improverBuildRef: requireToken(artifactKind, 'improverBuildRef', value.improverBuildRef),
    improverBuildDigest: requireDigest(artifactKind, 'improverBuildDigest', value.improverBuildDigest),
    promptPolicyDigest: requireDigest(artifactKind, 'promptPolicyDigest', value.promptPolicyDigest),
    trainingCorpusDigest: requireDigest(artifactKind, 'trainingCorpusDigest', value.trainingCorpusDigest),
    developmentCorpusDigest: requireDigest(artifactKind, 'developmentCorpusDigest', value.developmentCorpusDigest),
    sealedFailureCorpusDigest: requireDigest(artifactKind, 'sealedFailureCorpusDigest', value.sealedFailureCorpusDigest),
    optimizerVersion: requireToken(artifactKind, 'optimizerVersion', value.optimizerVersion),
    mutationOperatorReference: requireToken(artifactKind, 'mutationOperatorReference', value.mutationOperatorReference),
    mutationOperatorVersion: requireToken(artifactKind, 'mutationOperatorVersion', value.mutationOperatorVersion),
    visibilityPolicy: requireVisibilityPolicy(artifactKind, value.visibilityPolicy),
    queryBudget: requireQueryBudget(artifactKind, value.queryBudget),
    parentCandidateReference,
  });
}

function parseCausalAnalysis(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
): AgentImprovementCausalAnalysisInputMaterial {
  const value = requireRecord(artifactKind, input, CAUSAL_FIELDS);
  const base = requireBase(artifactKind, value, CAUSAL_FIELDS);
  const failureClusterReference = requireNamedReferenceDigest(
    artifactKind,
    'failureClusterReference',
    value.failureClusterReference,
    value.failureClusterDigest,
    NAMED_REFERENCE_KINDS.failureEvidence,
  );
  const firstDivergentTraceReference = requireNamedReferenceDigest(
    artifactKind,
    'firstDivergentTraceReference',
    value.firstDivergentTraceReference,
    value.firstDivergentTraceDigest,
    NAMED_REFERENCE_KINDS.rawObservation,
  );
  const counterfactualInterventionReference = requireNamedReferenceDigest(
    artifactKind,
    'counterfactualInterventionReference',
    value.counterfactualInterventionReference,
    value.counterfactualInterventionDigest,
    NAMED_REFERENCE_KINDS.intervention,
  );
  const proposalVisibleEvidenceReference = requireNamedReferenceDigest(
    artifactKind,
    'proposalVisibleEvidenceReference',
    value.proposalVisibleEvidenceReference,
    value.proposalVisibleEvidenceDigest,
    NAMED_REFERENCE_KINDS.failureEvidence,
  );
  const parentCandidateReference = value.parentCandidateReference === null
    ? null
    : requireNamedReference(
      artifactKind,
      'parentCandidateReference',
      value.parentCandidateReference,
      NAMED_REFERENCE_KINDS.candidateProposal,
    );
  requireDependencyCoverage(artifactKind, base.dependencyReferences, [
    failureClusterReference,
    firstDivergentTraceReference,
    counterfactualInterventionReference,
    proposalVisibleEvidenceReference,
    parentCandidateReference,
  ]);
  return Object.freeze({
    ...base,
    failureClusterReference,
    failureClusterDigest: requireDigest(artifactKind, 'failureClusterDigest', value.failureClusterDigest),
    firstDivergentTraceReference,
    firstDivergentTraceDigest: requireDigest(artifactKind, 'firstDivergentTraceDigest', value.firstDivergentTraceDigest),
    knownDefectLocusId: requireToken(artifactKind, 'knownDefectLocusId', value.knownDefectLocusId),
    knownDefectLocusDigest: requireDigest(artifactKind, 'knownDefectLocusDigest', value.knownDefectLocusDigest),
    counterfactualInterventionReference,
    counterfactualInterventionDigest: requireDigest(artifactKind, 'counterfactualInterventionDigest', value.counterfactualInterventionDigest),
    proposalVisibleEvidenceReference,
    proposalVisibleEvidenceDigest: requireDigest(artifactKind, 'proposalVisibleEvidenceDigest', value.proposalVisibleEvidenceDigest),
    parentCandidateReference,
    evidenceExposurePolicy: requireBooleanEnum(artifactKind, 'evidenceExposurePolicy', value.evidenceExposurePolicy, ['bounded-diagnostic', 'commitment-only']),
  });
}

function parseCandidateProposal(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
): AgentImprovementCandidateProposalMaterial {
  const value = requireRecord(artifactKind, input, PROPOSAL_FIELDS);
  const base = requireBase(artifactKind, value, PROPOSAL_FIELDS);
  const parentAgentReference = requireNamedReference(
    artifactKind,
    'parentAgentReference',
    value.parentAgentReference,
    NAMED_REFERENCE_KINDS.parentAgent,
  );
  const changeContractReference = requireNamedReference(
    artifactKind,
    'changeContractReference',
    value.changeContractReference,
    NAMED_REFERENCE_KINDS.changeContract,
  );
  const improverLaneReference = requireNamedReference(
    artifactKind,
    'improverLaneReference',
    value.improverLaneReference,
    NAMED_REFERENCE_KINDS.improverLane,
  );
  const causalAnalysisReference = requireNamedReference(
    artifactKind,
    'causalAnalysisReference',
    value.causalAnalysisReference,
    NAMED_REFERENCE_KINDS.causalAnalysis,
  );
  const atomicPatchLineageReference = requireNamedReferenceDigest(
    artifactKind,
    'atomicPatchLineageReference',
    value.atomicPatchLineageReference,
    value.atomicPatchLineageDigest,
    NAMED_REFERENCE_KINDS.changeContract,
  );
  const proposalRationaleReference = requireNamedReferenceDigest(
    artifactKind,
    'proposalRationaleReference',
    value.proposalRationaleReference,
    value.proposalRationaleDigest,
    NAMED_REFERENCE_KINDS.causalAnalysis,
  );
  const parentCandidateReference = value.parentCandidateReference === null
    ? null
    : requireNamedReference(
      artifactKind,
      'parentCandidateReference',
      value.parentCandidateReference,
      NAMED_REFERENCE_KINDS.candidateProposal,
    );
  requireDependencyCoverage(artifactKind, base.dependencyReferences, [
    parentAgentReference,
    changeContractReference,
    improverLaneReference,
    causalAnalysisReference,
    atomicPatchLineageReference,
    proposalRationaleReference,
    parentCandidateReference,
  ]);
  return Object.freeze({
    ...base,
    candidateId: requireToken(artifactKind, 'candidateId', value.candidateId),
    candidatePackageRef: requireToken(artifactKind, 'candidatePackageRef', value.candidatePackageRef),
    candidatePackageDigest: requireDigest(artifactKind, 'candidatePackageDigest', value.candidatePackageDigest),
    candidateAgentIrRef: requireToken(artifactKind, 'candidateAgentIrRef', value.candidateAgentIrRef),
    candidateAgentIrDigest: requireDigest(artifactKind, 'candidateAgentIrDigest', value.candidateAgentIrDigest),
    parentAgentReference,
    changeContractReference,
    improverLaneReference,
    causalAnalysisReference,
    atomicPatchLineageReference,
    atomicPatchLineageDigest: requireDigest(artifactKind, 'atomicPatchLineageDigest', value.atomicPatchLineageDigest),
    proposalRationaleReference,
    proposalRationaleDigest: requireDigest(artifactKind, 'proposalRationaleDigest', value.proposalRationaleDigest),
    mutationOperatorReference: requireToken(artifactKind, 'mutationOperatorReference', value.mutationOperatorReference),
    mutationOperatorVersion: requireToken(artifactKind, 'mutationOperatorVersion', value.mutationOperatorVersion),
    parentCandidateReference,
  });
}

function parseTrialTrajectory(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
): AgentImprovementTrialTrajectoryMaterial {
  const value = requireRecord(artifactKind, input, TRIAL_FIELDS);
  const base = requireBase(artifactKind, value, TRIAL_FIELDS);
  const candidateProposalReference = requireNamedReference(
    artifactKind,
    'candidateProposalReference',
    value.candidateProposalReference,
    NAMED_REFERENCE_KINDS.candidateProposal,
  );
  const baselineAgentReference = requireNamedReference(
    artifactKind,
    'baselineAgentReference',
    value.baselineAgentReference,
    NAMED_REFERENCE_KINDS.parentAgent,
  );
  const evaluatorCapsuleReference = requireNamedReference(
    artifactKind,
    'evaluatorCapsuleReference',
    value.evaluatorCapsuleReference,
    NAMED_REFERENCE_KINDS.evaluator,
  );
  const commonRawTrialReference = requireNamedReference(
    artifactKind,
    'commonRawTrialReference',
    value.commonRawTrialReference,
    NAMED_REFERENCE_KINDS.rawTrial,
  );
  const taskManifestReference = requireNamedReferenceDigest(
    artifactKind,
    'taskManifestReference',
    value.taskManifestReference,
    value.taskManifestDigest,
    NAMED_REFERENCE_KINDS.fixture,
  );
  const semanticVariantReference = requireNamedReferenceDigest(
    artifactKind,
    'semanticVariantReference',
    value.semanticVariantReference,
    value.semanticVariantDigest,
    NAMED_REFERENCE_KINDS.fixture,
  );
  const authorityConflictReference = requireNamedReferenceDigest(
    artifactKind,
    'authorityConflictReference',
    value.authorityConflictReference,
    value.authorityConflictDigest,
    NAMED_REFERENCE_KINDS.fixture,
  );
  const negativeCapabilityReference = requireNamedReferenceDigest(
    artifactKind,
    'negativeCapabilityReference',
    value.negativeCapabilityReference,
    value.negativeCapabilityDigest,
    NAMED_REFERENCE_KINDS.fixture,
  );
  const executorReference = requireNamedReference(
    artifactKind,
    'executorReference',
    value.executorReference,
    NAMED_REFERENCE_KINDS.executor,
  );
  const environmentReference = requireNamedReferenceDigest(
    artifactKind,
    'environmentReference',
    value.environmentReference,
    value.environmentDigest,
    NAMED_REFERENCE_KINDS.executor,
  );
  const normalizedTraceReference = requireNamedReferenceDigest(
    artifactKind,
    'normalizedTraceReference',
    value.normalizedTraceReference,
    value.normalizedTraceDigest,
    NAMED_REFERENCE_KINDS.rawObservation,
  );
  const sideEffectObservationReference = requireNamedReferenceDigest(
    artifactKind,
    'sideEffectObservationReference',
    value.sideEffectObservationReference,
    value.sideEffectObservationDigest,
    NAMED_REFERENCE_KINDS.rawObservation,
  );
  const receiptPredicateReference = requireNamedReferenceDigest(
    artifactKind,
    'receiptPredicateReference',
    value.receiptPredicateReference,
    value.receiptPredicateDigest,
    NAMED_REFERENCE_KINDS.intervention,
  );
  const integrityObservationReference = requireNamedReferenceDigest(
    artifactKind,
    'integrityObservationReference',
    value.integrityObservationReference,
    value.integrityObservationDigest,
    NAMED_REFERENCE_KINDS.rawObservation,
  );
  requireDependencyCoverage(artifactKind, base.dependencyReferences, [
    candidateProposalReference,
    baselineAgentReference,
    evaluatorCapsuleReference,
    commonRawTrialReference,
    taskManifestReference,
    semanticVariantReference,
    authorityConflictReference,
    negativeCapabilityReference,
    executorReference,
    environmentReference,
    normalizedTraceReference,
    sideEffectObservationReference,
    receiptPredicateReference,
    integrityObservationReference,
  ]);
  return Object.freeze({
    ...base,
    trialId: requireToken(artifactKind, 'trialId', value.trialId),
    candidateProposalReference,
    baselineAgentReference,
    evaluatorCapsuleReference,
    commonRawTrialReference,
    evaluationEpochId: requireToken(artifactKind, 'evaluationEpochId', value.evaluationEpochId),
    taskManifestReference,
    taskManifestDigest: requireDigest(artifactKind, 'taskManifestDigest', value.taskManifestDigest),
    behaviorFamilyId: requireToken(artifactKind, 'behaviorFamilyId', value.behaviorFamilyId),
    semanticVariantReference,
    semanticVariantDigest: requireDigest(artifactKind, 'semanticVariantDigest', value.semanticVariantDigest),
    authorityConflictReference,
    authorityConflictDigest: requireDigest(artifactKind, 'authorityConflictDigest', value.authorityConflictDigest),
    negativeCapabilityReference,
    negativeCapabilityDigest: requireDigest(artifactKind, 'negativeCapabilityDigest', value.negativeCapabilityDigest),
    seed: requireUint32(artifactKind, 'seed', value.seed),
    executorReference,
    executorFingerprint: requireDigest(artifactKind, 'executorFingerprint', value.executorFingerprint),
    environmentReference,
    environmentDigest: requireDigest(artifactKind, 'environmentDigest', value.environmentDigest),
    normalizedTraceReference,
    normalizedTraceDigest: requireDigest(artifactKind, 'normalizedTraceDigest', value.normalizedTraceDigest),
    sideEffectObservationReference,
    sideEffectObservationDigest: requireDigest(artifactKind, 'sideEffectObservationDigest', value.sideEffectObservationDigest),
    receiptPredicateReference,
    receiptPredicateDigest: requireDigest(artifactKind, 'receiptPredicateDigest', value.receiptPredicateDigest),
    caseOutcomeVectorDigest: requireDigest(artifactKind, 'caseOutcomeVectorDigest', value.caseOutcomeVectorDigest),
    integrityObservationReference,
    integrityObservationDigest: requireDigest(artifactKind, 'integrityObservationDigest', value.integrityObservationDigest),
    normalizationVersion: requireToken(artifactKind, 'normalizationVersion', value.normalizationVersion),
  });
}

function parseBehaviorCoverage(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
): AgentImprovementBehaviorCoverageMaterial {
  const value = requireRecord(artifactKind, input, COVERAGE_FIELDS);
  const base = requireBase(artifactKind, value, COVERAGE_FIELDS);
  const rotatingCanaryReference = requireNamedReference(
    artifactKind,
    'rotatingCanaryReference',
    value.rotatingCanaryReference,
    NAMED_REFERENCE_KINDS.canaryEpoch,
  );
  requireDependencyCoverage(artifactKind, base.dependencyReferences, [
    rotatingCanaryReference,
  ]);
  return Object.freeze({
    ...base,
    coverageId: requireToken(artifactKind, 'coverageId', value.coverageId),
    evaluationEpochId: requireToken(artifactKind, 'evaluationEpochId', value.evaluationEpochId),
    exposureEpochId: requireToken(artifactKind, 'exposureEpochId', value.exposureEpochId),
    clauseDigests: requireDigestArray(artifactKind, 'clauseDigests', value.clauseDigests),
    behaviorFamilyIds: requireTokenArray(artifactKind, 'behaviorFamilyIds', value.behaviorFamilyIds),
    authorityConflictCaseDigests: requireDigestArray(artifactKind, 'authorityConflictCaseDigests', value.authorityConflictCaseDigests),
    transitionCaseDigests: requireDigestArray(artifactKind, 'transitionCaseDigests', value.transitionCaseDigests),
    sideEffectOracleDigests: requireDigestArray(artifactKind, 'sideEffectOracleDigests', value.sideEffectOracleDigests),
    negativeCapabilityCaseDigests: requireDigestArray(artifactKind, 'negativeCapabilityCaseDigests', value.negativeCapabilityCaseDigests),
    perturbationDigests: requireDigestArray(artifactKind, 'perturbationDigests', value.perturbationDigests),
    untouchedFamilySentinelDigests: requireDigestArray(artifactKind, 'untouchedFamilySentinelDigests', value.untouchedFamilySentinelDigests),
    semanticVariantDigests: requireDigestArray(artifactKind, 'semanticVariantDigests', value.semanticVariantDigests),
    executorDigests: requireDigestArray(artifactKind, 'executorDigests', value.executorDigests),
    rotatingCanaryReference,
    coverageManifestDigest: requireDigest(artifactKind, 'coverageManifestDigest', value.coverageManifestDigest),
    coverageOutcome: requireBooleanEnum(artifactKind, 'coverageOutcome', value.coverageOutcome, ['covered', 'insufficient-evidence', 'partial']),
    criticalInvariantOutcome: requireBooleanEnum(artifactKind, 'criticalInvariantOutcome', value.criticalInvariantOutcome, ['fail', 'pass', 'unknown']),
  });
}

function requireExposureRing(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
  index: number,
): AgentImprovementExposureRingReference {
  const value = requireRecord(artifactKind, input, RING_FIELDS);
  return Object.freeze({
    ring: requireBooleanEnum(artifactKind, `rings[${index}].ring`, value.ring, [
      'rotating-canary', 'sealed-semantic-variant', 'untouched-family-sentinel', 'visible-optimizer',
    ]),
    fixtureSetReference: requireNamedReferenceDigest(
      artifactKind,
      `rings[${index}].fixtureSetReference`,
      value.fixtureSetReference,
      value.fixtureSetDigest,
      NAMED_REFERENCE_KINDS.fixture,
    ),
    fixtureSetDigest: requireDigest(artifactKind, `rings[${index}].fixtureSetDigest`, value.fixtureSetDigest),
    fixtureCount: requireNonZeroUint32(artifactKind, `rings[${index}].fixtureCount`, value.fixtureCount),
    exposureEpochId: requireToken(artifactKind, `rings[${index}].exposureEpochId`, value.exposureEpochId),
    lifecycle: requireBooleanEnum(artifactKind, `rings[${index}].lifecycle`, value.lifecycle, ['activated', 'retired']),
    retirementReason: requireBoundedReason(artifactKind, `rings[${index}].retirementReason`, value.retirementReason),
  });
}

function parseFourRingExposure(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
): AgentImprovementFourRingExposureMaterial {
  const value = requireRecord(artifactKind, input, EXPOSURE_FIELDS);
  const base = requireBase(artifactKind, value, EXPOSURE_FIELDS);
  const rings = requireArray(
    artifactKind,
    'rings',
    value.rings,
    (entry, index) => requireExposureRing(artifactKind, entry, index),
    4,
  );
  if (rings.length !== 4 || new Set(rings.map((ring) => ring.ring)).size !== 4) {
    return invalidMaterial(artifactKind, 'rings');
  }
  const evaluatorCapsuleReference = requireNamedReference(
    artifactKind,
    'evaluatorCapsuleReference',
    value.evaluatorCapsuleReference,
    NAMED_REFERENCE_KINDS.evaluator,
  );
  const canaryEpochReference = requireNamedReference(
    artifactKind,
    'canaryEpochReference',
    value.canaryEpochReference,
    NAMED_REFERENCE_KINDS.canaryEpoch,
  );
  requireDependencyCoverage(artifactKind, base.dependencyReferences, [
    evaluatorCapsuleReference,
    canaryEpochReference,
    ...rings.map((ring) => ring.fixtureSetReference),
  ]);
  return Object.freeze({
    ...base,
    manifestId: requireToken(artifactKind, 'manifestId', value.manifestId),
    evaluationEpochId: requireToken(artifactKind, 'evaluationEpochId', value.evaluationEpochId),
    exposureEpochId: requireToken(artifactKind, 'exposureEpochId', value.exposureEpochId),
    rings,
    evaluatorCapsuleReference,
    canaryEpochReference,
    hiddenAnchorCommitmentDigest: requireDigest(artifactKind, 'hiddenAnchorCommitmentDigest', value.hiddenAnchorCommitmentDigest),
    leakVetoPolicyVersion: requireToken(artifactKind, 'leakVetoPolicyVersion', value.leakVetoPolicyVersion),
  });
}

function namedReference(
  field: string,
  reference: SealedArtifactReference,
  expectedKind: AgentImprovementDependencyKind,
): AgentImprovementNamedReferenceExpectation {
  return Object.freeze({ field, reference, expectedKind });
}

export function agentImprovementNamedReferenceExpectations(
  artifactKind: AgentImprovementArtifactKind,
  material: AgentImprovementArtifactMaterial,
): readonly AgentImprovementNamedReferenceExpectation[] {
  switch (artifactKind) {
    case AgentImprovementArtifactKinds.BASE_AGENT_BUNDLE: {
      const value = material as AgentImprovementAgentIrBundleMaterial;
      return value.parentAgentReference === null
        ? []
        : [namedReference('parentAgentReference', value.parentAgentReference, NAMED_REFERENCE_KINDS.parentAgent)];
    }
    case AgentImprovementArtifactKinds.CHANGE_CONTRACT_BUNDLE: {
      const value = material as AgentImprovementChangeContractBundleMaterial;
      return [
        namedReference('agentIrReference', value.agentIrReference, NAMED_REFERENCE_KINDS.agentIr),
        ...(value.parentLineageReference === null
          ? []
          : [namedReference(
            'parentLineageReference',
            value.parentLineageReference,
            NAMED_REFERENCE_KINDS.changeContract,
          )]),
      ];
    }
    case AgentImprovementArtifactKinds.IMPROVER_LANE_REFERENCE: {
      const value = material as AgentImprovementImproverLaneReferenceMaterial;
      return value.parentCandidateReference === null
        ? []
        : [namedReference(
          'parentCandidateReference',
          value.parentCandidateReference,
          NAMED_REFERENCE_KINDS.candidateProposal,
        )];
    }
    case AgentImprovementArtifactKinds.CAUSAL_ANALYSIS_INPUT: {
      const value = material as AgentImprovementCausalAnalysisInputMaterial;
      return [
        namedReference('failureClusterReference', value.failureClusterReference, NAMED_REFERENCE_KINDS.failureEvidence),
        namedReference('firstDivergentTraceReference', value.firstDivergentTraceReference, NAMED_REFERENCE_KINDS.rawObservation),
        namedReference(
          'counterfactualInterventionReference',
          value.counterfactualInterventionReference,
          NAMED_REFERENCE_KINDS.intervention,
        ),
        namedReference(
          'proposalVisibleEvidenceReference',
          value.proposalVisibleEvidenceReference,
          NAMED_REFERENCE_KINDS.failureEvidence,
        ),
        ...(value.parentCandidateReference === null
          ? []
          : [namedReference(
            'parentCandidateReference',
            value.parentCandidateReference,
            NAMED_REFERENCE_KINDS.candidateProposal,
          )]),
      ];
    }
    case AgentImprovementArtifactKinds.CANDIDATE_PROPOSAL: {
      const value = material as AgentImprovementCandidateProposalMaterial;
      return [
        namedReference('parentAgentReference', value.parentAgentReference, NAMED_REFERENCE_KINDS.parentAgent),
        namedReference('changeContractReference', value.changeContractReference, NAMED_REFERENCE_KINDS.changeContract),
        namedReference('improverLaneReference', value.improverLaneReference, NAMED_REFERENCE_KINDS.improverLane),
        namedReference('causalAnalysisReference', value.causalAnalysisReference, NAMED_REFERENCE_KINDS.causalAnalysis),
        namedReference(
          'atomicPatchLineageReference',
          value.atomicPatchLineageReference,
          NAMED_REFERENCE_KINDS.changeContract,
        ),
        namedReference(
          'proposalRationaleReference',
          value.proposalRationaleReference,
          NAMED_REFERENCE_KINDS.causalAnalysis,
        ),
        ...(value.parentCandidateReference === null
          ? []
          : [namedReference(
            'parentCandidateReference',
            value.parentCandidateReference,
            NAMED_REFERENCE_KINDS.candidateProposal,
          )]),
      ];
    }
    case AgentImprovementArtifactKinds.TRIAL_TRAJECTORY: {
      const value = material as AgentImprovementTrialTrajectoryMaterial;
      return [
        namedReference(
          'candidateProposalReference',
          value.candidateProposalReference,
          NAMED_REFERENCE_KINDS.candidateProposal,
        ),
        namedReference('baselineAgentReference', value.baselineAgentReference, NAMED_REFERENCE_KINDS.parentAgent),
        namedReference('evaluatorCapsuleReference', value.evaluatorCapsuleReference, NAMED_REFERENCE_KINDS.evaluator),
        namedReference('commonRawTrialReference', value.commonRawTrialReference, NAMED_REFERENCE_KINDS.rawTrial),
        namedReference('taskManifestReference', value.taskManifestReference, NAMED_REFERENCE_KINDS.fixture),
        namedReference('semanticVariantReference', value.semanticVariantReference, NAMED_REFERENCE_KINDS.fixture),
        namedReference('authorityConflictReference', value.authorityConflictReference, NAMED_REFERENCE_KINDS.fixture),
        namedReference('negativeCapabilityReference', value.negativeCapabilityReference, NAMED_REFERENCE_KINDS.fixture),
        namedReference('executorReference', value.executorReference, NAMED_REFERENCE_KINDS.executor),
        namedReference('environmentReference', value.environmentReference, NAMED_REFERENCE_KINDS.executor),
        namedReference('normalizedTraceReference', value.normalizedTraceReference, NAMED_REFERENCE_KINDS.rawObservation),
        namedReference(
          'sideEffectObservationReference',
          value.sideEffectObservationReference,
          NAMED_REFERENCE_KINDS.rawObservation,
        ),
        namedReference('receiptPredicateReference', value.receiptPredicateReference, NAMED_REFERENCE_KINDS.intervention),
        namedReference(
          'integrityObservationReference',
          value.integrityObservationReference,
          NAMED_REFERENCE_KINDS.rawObservation,
        ),
      ];
    }
    case AgentImprovementArtifactKinds.BEHAVIOR_COVERAGE: {
      const value = material as AgentImprovementBehaviorCoverageMaterial;
      return [
        namedReference('rotatingCanaryReference', value.rotatingCanaryReference, NAMED_REFERENCE_KINDS.canaryEpoch),
      ];
    }
    case AgentImprovementArtifactKinds.FOUR_RING_EXPOSURE: {
      const value = material as AgentImprovementFourRingExposureMaterial;
      return [
        ...value.rings.map((ring, index) => namedReference(
          `rings[${index}].fixtureSetReference`,
          ring.fixtureSetReference,
          NAMED_REFERENCE_KINDS.fixture,
        )),
        namedReference('evaluatorCapsuleReference', value.evaluatorCapsuleReference, NAMED_REFERENCE_KINDS.evaluator),
        namedReference('canaryEpochReference', value.canaryEpochReference, NAMED_REFERENCE_KINDS.canaryEpoch),
      ];
    }
    default:
      return unsupportedArtifactKind(artifactKind);
  }
}

function canonicalizeAgentImprovementMaterial(
  artifactKind: AgentImprovementArtifactKind,
  input: unknown,
): Uint8Array {
  let material: AgentImprovementArtifactMaterial;
  switch (artifactKind) {
    case AgentImprovementArtifactKinds.BASE_AGENT_BUNDLE:
      material = parseAgentIrBundle(artifactKind, input);
      break;
    case AgentImprovementArtifactKinds.CHANGE_CONTRACT_BUNDLE:
      material = parseChangeContract(artifactKind, input);
      break;
    case AgentImprovementArtifactKinds.IMPROVER_LANE_REFERENCE:
      material = parseImproverLane(artifactKind, input);
      break;
    case AgentImprovementArtifactKinds.CAUSAL_ANALYSIS_INPUT:
      material = parseCausalAnalysis(artifactKind, input);
      break;
    case AgentImprovementArtifactKinds.CANDIDATE_PROPOSAL:
      material = parseCandidateProposal(artifactKind, input);
      break;
    case AgentImprovementArtifactKinds.TRIAL_TRAJECTORY:
      material = parseTrialTrajectory(artifactKind, input);
      break;
    case AgentImprovementArtifactKinds.BEHAVIOR_COVERAGE:
      material = parseBehaviorCoverage(artifactKind, input);
      break;
    case AgentImprovementArtifactKinds.FOUR_RING_EXPOSURE:
      material = parseFourRingExposure(artifactKind, input);
      break;
    default:
      return unsupportedArtifactKind(artifactKind);
  }
  return Uint8Array.from(canonicalBytes({ artifactKind, material }));
}

export function createAgentImprovementArtifactCanonicalizerRegistry(): ArtifactCanonicalizerRegistry {
  const commonRegistry = createDeepImprovementCommonArtifactCanonicalizerRegistry();
  const commonDefinitions: ArtifactCanonicalizerDefinition[] = [
    ...Object.values(InitialArtifactKinds).map((artifactKind) => {
      const profile = commonRegistry.describe(artifactKind, 'deep-loop-json@1');
      return {
        artifactKind,
        canonicalizationVersion: profile.canonicalizationVersion,
        mediaType: profile.mediaType,
        implementationIdentity: profile.implementationIdentity,
        canonicalize: (input: unknown): Uint8Array => (
          commonRegistry.canonicalize(artifactKind, profile.canonicalizationVersion, input).bytes
        ),
      };
    }),
    ...DEEP_IMPROVEMENT_COMMON_ARTIFACT_KIND_REGISTRY.map((entry) => {
      const profile = commonRegistry.describe(
        entry.artifactKind,
        DEEP_IMPROVEMENT_COMMON_ARTIFACT_CANONICALIZATION_VERSION,
      );
      return {
        artifactKind: entry.artifactKind,
        canonicalizationVersion: profile.canonicalizationVersion,
        mediaType: profile.mediaType,
        implementationIdentity: profile.implementationIdentity,
        canonicalize: (input: unknown): Uint8Array => (
          commonRegistry.canonicalize(entry.artifactKind, profile.canonicalizationVersion, input).bytes
        ),
      };
    }),
  ];
  const agentDefinitions: ArtifactCanonicalizerDefinition[] = AGENT_IMPROVEMENT_ARTIFACT_KIND_REGISTRY.map((entry) => ({
    artifactKind: entry.artifactKind,
    canonicalizationVersion: entry.canonicalizationVersion,
    mediaType: entry.mediaType,
    implementationIdentity: 'agent-improvement-binding-canonicalizer-v1',
    canonicalize: (input: unknown): Uint8Array => (
      canonicalizeAgentImprovementMaterial(entry.artifactKind, input)
    ),
  }));
  return new ArtifactCanonicalizerRegistry([...commonDefinitions, ...agentDefinitions]);
}

export function parseAgentImprovementArtifactMaterial<TKind extends AgentImprovementArtifactKind>(
  artifactKind: TKind,
  input: unknown,
): AgentImprovementArtifactMaterialByKind[TKind] {
  if (!KIND_SET.has(artifactKind)) return invalidMaterial(artifactKind, 'artifactKind');
  switch (artifactKind) {
    case AgentImprovementArtifactKinds.BASE_AGENT_BUNDLE:
      return parseAgentIrBundle(artifactKind, input) as AgentImprovementArtifactMaterialByKind[TKind];
    case AgentImprovementArtifactKinds.CHANGE_CONTRACT_BUNDLE:
      return parseChangeContract(artifactKind, input) as AgentImprovementArtifactMaterialByKind[TKind];
    case AgentImprovementArtifactKinds.IMPROVER_LANE_REFERENCE:
      return parseImproverLane(artifactKind, input) as AgentImprovementArtifactMaterialByKind[TKind];
    case AgentImprovementArtifactKinds.CAUSAL_ANALYSIS_INPUT:
      return parseCausalAnalysis(artifactKind, input) as AgentImprovementArtifactMaterialByKind[TKind];
    case AgentImprovementArtifactKinds.CANDIDATE_PROPOSAL:
      return parseCandidateProposal(artifactKind, input) as AgentImprovementArtifactMaterialByKind[TKind];
    case AgentImprovementArtifactKinds.TRIAL_TRAJECTORY:
      return parseTrialTrajectory(artifactKind, input) as AgentImprovementArtifactMaterialByKind[TKind];
    case AgentImprovementArtifactKinds.BEHAVIOR_COVERAGE:
      return parseBehaviorCoverage(artifactKind, input) as AgentImprovementArtifactMaterialByKind[TKind];
    case AgentImprovementArtifactKinds.FOUR_RING_EXPOSURE:
      return parseFourRingExposure(artifactKind, input) as AgentImprovementArtifactMaterialByKind[TKind];
    default:
      return unsupportedArtifactKind(artifactKind);
  }
}

export function isAgentImprovementArtifactKind(
  value: string,
): value is AgentImprovementArtifactKind {
  return KIND_SET.has(value);
}

export type AgentImprovementCommonBindingKind =
  | AgentImprovementDependencyKind
  | AgentImprovementArtifactKind;

export const AGENT_IMPROVEMENT_COMMON_ARTIFACT_MEDIA_TYPE_ALIAS =
  DEEP_IMPROVEMENT_COMMON_ARTIFACT_MEDIA_TYPE;
