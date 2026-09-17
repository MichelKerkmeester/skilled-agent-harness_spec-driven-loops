// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Ledger Schema
// ───────────────────────────────────────────────────────────────────

import {
  DEEP_IMPROVEMENT_COMMON_MODE_PAYLOAD_FIELDS,
  DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
  DEEP_IMPROVEMENT_COMMON_SHARED_ENVELOPE_FIELDS,
  createDeepImprovementCommonLedgerPayload,
  deepImprovementCommonEventDefinitions,
  isDeepImprovementCommonEventStem,
  prepareDeepImprovementCommonEvent,
} from '../deep-improvement-common-ledger-schema/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  EventTypeRegistry,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  AgentImprovementEventStems,
  AgentImprovementExtensionEventStems,
  AgentImprovementExtensionWireEventTypes,
  AgentImprovementWireEventTypes,
} from './agent-improvement-ledger-types.js';

import type {
  DeepImprovementCommonEventInput,
  DeepImprovementCommonEventStem,
  DeepImprovementCommonPayloadMap,
  DeepImprovementCommonReplayMetadata,
  DeepImprovementCommonScopeMap,
} from '../deep-improvement-common-ledger-schema/index.js';
import type {
  EventProducer,
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  AgentImprovementEventEnvelope,
  AgentImprovementEventStem,
  AgentImprovementExtensionEventStem,
  AgentImprovementLedgerPayload,
  AgentImprovementPayloadMap,
  AgentImprovementReplayMetadata,
  AgentImprovementScopeMap,
} from './agent-improvement-ledger-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC INPUTS
// ───────────────────────────────────────────────────────────────────

type ScoreBoundCommonStem =
  | 'deep_improvement_common.evaluation_epoch_sealed'
  | 'deep_improvement_common.evaluation_normalized';

export type AgentImprovementInputData<
  TStem extends AgentImprovementEventStem,
> = TStem extends ScoreBoundCommonStem
  ? Omit<AgentImprovementPayloadMap[TStem], 'scoreWriteBackendRef'> & {
    readonly scoreWriteBackendRef?: never;
  }
  : AgentImprovementPayloadMap[TStem];

export interface AgentImprovementEventInput<
  TStem extends AgentImprovementEventStem,
> {
  readonly stem: TStem;
  readonly scope: AgentImprovementScopeMap[TStem];
  readonly prevEventHash: string;
  readonly replay: AgentImprovementReplayMetadata;
  readonly data: AgentImprovementInputData<TStem>;
  readonly eventId: string;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly producer: EventProducer;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly idempotencyKey: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONTRACT TABLES
// ───────────────────────────────────────────────────────────────────

export const AGENT_IMPROVEMENT_EVENT_VERSION = 1 as const;

export const AGENT_IMPROVEMENT_SCORE_WRITE_BACKEND_REF =
  DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF;

export const AGENT_IMPROVEMENT_SHARED_ENVELOPE_FIELDS =
  DEEP_IMPROVEMENT_COMMON_SHARED_ENVELOPE_FIELDS;

export const AGENT_IMPROVEMENT_MODE_PAYLOAD_FIELDS =
  DEEP_IMPROVEMENT_COMMON_MODE_PAYLOAD_FIELDS;

type DataFieldKind =
  | 'component-references'
  | 'digest'
  | 'identifier'
  | 'identifier-array'
  | 'inheritance-edge-references'
  | 'locus-references'
  | 'manifest-ring-references'
  | 'nonempty-identifier-array'
  | 'nonempty-reference-array'
  | 'nullable-identifier'
  | 'ratio'
  | 'reference'
  | 'reference-array'
  | 'timestamp'
  | 'uint32'
  | 'version';

interface EnumFieldRule {
  readonly kind: 'enum';
  readonly values: readonly string[];
}

type DataFieldRule = DataFieldKind | EnumFieldRule;

function enumRule(...values: readonly string[]): EnumFieldRule {
  return Object.freeze({ kind: 'enum', values: Object.freeze([...values]) });
}

const DATA_FIELD_RULES = Object.freeze({
  'agent_improvement.definition_snapshot_sealed': {
    definitionRef: 'reference',
    definitionDigest: 'digest',
    definitionSchemaVersion: 'version',
    capabilityPolicyRef: 'reference',
    capabilityPolicyDigest: 'digest',
    verifierPolicyRef: 'reference',
    verifierPolicyDigest: 'digest',
    toolPolicyRef: 'reference',
    toolPolicyDigest: 'digest',
    routingPolicyRef: 'reference',
    routingPolicyDigest: 'digest',
    memoryPolicyRef: 'reference',
    memoryPolicyDigest: 'digest',
    sealingReceiptRef: 'reference',
  },
  'agent_improvement.agent_ir_compiled': {
    definitionSnapshotEventId: 'identifier',
    definitionSnapshotPayloadDigest: 'digest',
    agentIrRef: 'reference',
    agentIrDigest: 'digest',
    agentIrSchemaVersion: 'version',
    components: 'component-references',
    inheritanceEdges: 'inheritance-edge-references',
    loci: 'locus-references',
    compilerFingerprint: 'digest',
    compilationReceiptRef: 'reference',
  },
  'agent_improvement.change_contract_compiled': {
    agentIrEventId: 'identifier',
    agentIrPayloadDigest: 'digest',
    baseDefinitionRef: 'reference',
    baseDefinitionDigest: 'digest',
    candidateDefinitionRef: 'reference',
    candidateDefinitionDigest: 'digest',
    changeContractRef: 'reference',
    changeContractDigest: 'digest',
    patchRef: 'reference',
    patchDigest: 'digest',
    intendedObligationIds: 'nonempty-identifier-array',
    preservedObligationIds: 'nonempty-identifier-array',
    affectedBehaviorFamilyIds: 'nonempty-identifier-array',
    behavioralSemverIntent: enumRule('major', 'minor', 'patch'),
    contractPolicyVersion: 'version',
    compilationReceiptRef: 'reference',
  },
  'agent_improvement.mutation_proposed': {
    changeContractEventId: 'identifier',
    changeContractPayloadDigest: 'digest',
    mutationOperatorRef: 'reference',
    mutationOperatorVersion: 'version',
    mutationProposalRef: 'reference',
    mutationProposalDigest: 'digest',
    targetLocusIds: 'nonempty-identifier-array',
    parentCandidateId: 'nullable-identifier',
    diagnosticEvidenceRefs: 'reference-array',
    diagnosticEvidenceSetDigest: 'digest',
    proposalPolicyVersion: 'version',
  },
  'agent_improvement.mutation_rejected': {
    proposalEventId: 'identifier',
    proposalPayloadDigest: 'digest',
    rejectionReasonCode: 'identifier',
    invalidLocusIds: 'identifier-array',
    rejectionEvidenceRefs: 'nonempty-reference-array',
    rejectionEvidenceSetDigest: 'digest',
    policyVersion: 'version',
  },
  'agent_improvement.trace_sliced': {
    evaluationObservationEventId: 'identifier',
    evaluationObservationPayloadDigest: 'digest',
    traceRef: 'reference',
    traceDigest: 'digest',
    traceSliceRef: 'reference',
    traceSliceDigest: 'digest',
    failureRef: 'reference',
    failureDigest: 'digest',
    clauseIds: 'nonempty-identifier-array',
    componentIds: 'nonempty-identifier-array',
    slicerFingerprint: 'digest',
    attributionStatus: enumRule('diagnostic', 'insufficient-evidence'),
    attributionUncertainty: 'ratio',
    slicingReceiptRef: 'reference',
  },
  'agent_improvement.behavior_experiment_sealed': {
    traceSliceEventId: 'identifier',
    traceSlicePayloadDigest: 'digest',
    experimentPlanRef: 'reference',
    experimentPlanDigest: 'digest',
    behaviorFamilyId: 'identifier',
    scenarioSetRef: 'reference',
    scenarioSetDigest: 'digest',
    baselineExecutionRef: 'reference',
    baselineExecutionDigest: 'digest',
    candidateExecutionRef: 'reference',
    candidateExecutionDigest: 'digest',
    freshPairedExecutionReceiptRef: 'reference',
    executorRef: 'reference',
    executorFingerprint: 'digest',
    verifierRef: 'reference',
    verifierFingerprint: 'digest',
    interventionIds: 'nonempty-identifier-array',
    experimentPolicyVersion: 'version',
  },
  'agent_improvement.known_defect_injected': {
    experimentEventId: 'identifier',
    experimentPayloadDigest: 'digest',
    defectLocusId: 'identifier',
    injectionRef: 'reference',
    injectionDigest: 'digest',
    controlExecutionRef: 'reference',
    controlExecutionDigest: 'digest',
    perturbedExecutionRef: 'reference',
    perturbedExecutionDigest: 'digest',
    rawObservationRef: 'reference',
    rawObservationDigest: 'digest',
    outcome: enumRule('detected', 'inconclusive', 'missed'),
    uncertainty: 'ratio',
    injectionReceiptRef: 'reference',
  },
  'agent_improvement.counterfactual_replayed': {
    experimentEventId: 'identifier',
    experimentPayloadDigest: 'digest',
    interventionRef: 'reference',
    interventionDigest: 'digest',
    sourceTraceRef: 'reference',
    sourceTraceDigest: 'digest',
    counterfactualTraceRef: 'reference',
    counterfactualTraceDigest: 'digest',
    replayCount: 'uint32',
    rawObservationRef: 'reference',
    rawObservationDigest: 'digest',
    outcome: enumRule('changed', 'inconclusive', 'unchanged'),
    uncertainty: 'ratio',
    executionReceiptRef: 'reference',
  },
  'agent_improvement.ablation_completed': {
    experimentEventId: 'identifier',
    experimentPayloadDigest: 'digest',
    ablatedLocusIds: 'nonempty-identifier-array',
    ablationRef: 'reference',
    ablationDigest: 'digest',
    baselineExecutionRef: 'reference',
    baselineExecutionDigest: 'digest',
    ablatedExecutionRef: 'reference',
    ablatedExecutionDigest: 'digest',
    rawObservationRef: 'reference',
    rawObservationDigest: 'digest',
    outcome: enumRule('degraded', 'improved', 'inconclusive', 'unchanged'),
    uncertainty: 'ratio',
    executionReceiptRef: 'reference',
  },
  'agent_improvement.behavior_coverage_recorded': {
    experimentEventIds: 'nonempty-identifier-array',
    evidenceSetDigest: 'digest',
    clauseIds: 'nonempty-identifier-array',
    authorityConflictCaseIds: 'identifier-array',
    negativeCapabilityCaseIds: 'identifier-array',
    sideEffectOracleIds: 'identifier-array',
    semanticVariantIds: 'identifier-array',
    rawCoverageRef: 'reference',
    rawCoverageDigest: 'digest',
    coverageOutcome: enumRule('covered', 'insufficient-evidence', 'partial'),
    criticalInvariantOutcome: enumRule('fail', 'pass', 'unknown'),
    coveragePolicyVersion: 'version',
  },
  'agent_improvement.evaluation_manifest_sealed': {
    manifestRef: 'reference',
    manifestDigest: 'digest',
    manifestVersion: 'version',
    rings: 'manifest-ring-references',
    evaluatorCapsuleRef: 'reference',
    evaluatorCapsuleDigest: 'digest',
    leakVetoPolicyVersion: 'version',
    sealingReceiptRef: 'reference',
  },
  'agent_improvement.fixture_exposure_recorded': {
    manifestEventId: 'identifier',
    manifestPayloadDigest: 'digest',
    exposureKind: enumRule('activated', 'retired'),
    exposedRingCodes: 'nonempty-identifier-array',
    authorizedExposureRef: 'reference',
    authorizedExposureDigest: 'digest',
    exposureReceiptRef: 'reference',
    occurredAt: 'timestamp',
  },
  'agent_improvement.transfer_trial_recorded': {
    sourceExecutorRef: 'reference',
    sourceExecutorFingerprint: 'digest',
    targetExecutorRef: 'reference',
    targetExecutorFingerprint: 'digest',
    verifierRef: 'reference',
    verifierFingerprint: 'digest',
    behaviorFamilyIds: 'nonempty-identifier-array',
    scenarioSetRef: 'reference',
    scenarioSetDigest: 'digest',
    baselineExecutionRef: 'reference',
    baselineExecutionDigest: 'digest',
    candidateExecutionRef: 'reference',
    candidateExecutionDigest: 'digest',
    rawObservationRef: 'reference',
    rawObservationDigest: 'digest',
    transferOutcome: enumRule('fail', 'inconclusive', 'pass'),
    uncertainty: 'ratio',
    executionReceiptRef: 'reference',
  },
  'agent_improvement.behavioral_change_classified': {
    changeContractEventId: 'identifier',
    changeContractPayloadDigest: 'digest',
    normalizedEventId: 'identifier',
    normalizedPayloadDigest: 'digest',
    verificationEventId: 'identifier',
    verificationPayloadDigest: 'digest',
    canaryGateEventId: 'identifier',
    canaryGatePayloadDigest: 'digest',
    classificationPolicyVersion: 'version',
    behavioralSemver: enumRule('major', 'minor', 'patch'),
    affectedBehaviorFamilyIds: 'nonempty-identifier-array',
    regressedBehaviorFamilyIds: 'identifier-array',
    preservedObligationIds: 'nonempty-identifier-array',
    classificationEvidenceRef: 'reference',
    classificationEvidenceDigest: 'digest',
    classificationReceiptRef: 'reference',
  },
} as const satisfies Readonly<
  Record<
    AgentImprovementExtensionEventStem,
    Readonly<Record<string, DataFieldRule>>
  >
>);

const BASE_SCOPE_FIELDS = ['runId', 'lineageId', 'variant'] as const;
const DEFINITION_SCOPE_FIELDS = [
  ...BASE_SCOPE_FIELDS,
  'agentDefinitionId',
] as const;
const IR_SCOPE_FIELDS = [...DEFINITION_SCOPE_FIELDS, 'agentIrId'] as const;
const CANDIDATE_SCOPE_FIELDS = [...BASE_SCOPE_FIELDS, 'candidateId'] as const;
const CHANGE_SCOPE_FIELDS = [...CANDIDATE_SCOPE_FIELDS, 'agentChangeId'] as const;
const MUTATION_SCOPE_FIELDS = [...CHANGE_SCOPE_FIELDS, 'mutationId'] as const;
const TRACE_SCOPE_FIELDS = [
  ...CANDIDATE_SCOPE_FIELDS,
  'evaluationEpochId',
  'behaviorFamilyId',
  'traceId',
] as const;
const EXPERIMENT_SCOPE_FIELDS = [
  ...CANDIDATE_SCOPE_FIELDS,
  'experimentId',
] as const;
const INTERVENTION_SCOPE_FIELDS = [
  ...EXPERIMENT_SCOPE_FIELDS,
  'interventionId',
] as const;
const COVERAGE_SCOPE_FIELDS = [
  ...CANDIDATE_SCOPE_FIELDS,
  'evaluationEpochId',
  'behaviorFamilyId',
] as const;
const MANIFEST_SCOPE_FIELDS = [
  ...BASE_SCOPE_FIELDS,
  'evaluationEpochId',
  'manifestId',
  'exposureEpochId',
] as const;
const TRANSFER_SCOPE_FIELDS = [
  ...CANDIDATE_SCOPE_FIELDS,
  'evaluationEpochId',
  'trialId',
] as const;

const SCOPE_FIELDS = Object.freeze({
  'agent_improvement.definition_snapshot_sealed': DEFINITION_SCOPE_FIELDS,
  'agent_improvement.agent_ir_compiled': IR_SCOPE_FIELDS,
  'agent_improvement.change_contract_compiled': CHANGE_SCOPE_FIELDS,
  'agent_improvement.mutation_proposed': MUTATION_SCOPE_FIELDS,
  'agent_improvement.mutation_rejected': MUTATION_SCOPE_FIELDS,
  'agent_improvement.trace_sliced': TRACE_SCOPE_FIELDS,
  'agent_improvement.behavior_experiment_sealed': EXPERIMENT_SCOPE_FIELDS,
  'agent_improvement.known_defect_injected': INTERVENTION_SCOPE_FIELDS,
  'agent_improvement.counterfactual_replayed': INTERVENTION_SCOPE_FIELDS,
  'agent_improvement.ablation_completed': INTERVENTION_SCOPE_FIELDS,
  'agent_improvement.behavior_coverage_recorded': COVERAGE_SCOPE_FIELDS,
  'agent_improvement.evaluation_manifest_sealed': MANIFEST_SCOPE_FIELDS,
  'agent_improvement.fixture_exposure_recorded': MANIFEST_SCOPE_FIELDS,
  'agent_improvement.transfer_trial_recorded': TRANSFER_SCOPE_FIELDS,
  'agent_improvement.behavioral_change_classified': CHANGE_SCOPE_FIELDS,
} as const satisfies Readonly<
  Record<AgentImprovementExtensionEventStem, readonly string[]>
>);

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;
const MAX_REFERENCE_ARRAY_LENGTH = 256;
const MAX_COMPONENTS = 256;
const MAX_INHERITANCE_EDGES = 512;
const MAX_LOCI = 512;
const COMPONENT_FIELDS = Object.freeze([
  'componentId',
  'componentKind',
  'componentRef',
  'componentDigest',
] as const);
const INHERITANCE_EDGE_FIELDS = Object.freeze([
  'edgeId',
  'parentComponentId',
  'childComponentId',
  'inheritanceKind',
  'edgeDigest',
] as const);
const LOCUS_FIELDS = Object.freeze([
  'locusId',
  'componentId',
  'clauseId',
  'locusKind',
  'mutability',
  'locusRef',
  'locusDigest',
] as const);
const MANIFEST_RING_FIELDS = Object.freeze([
  'ring',
  'fixtureSetRef',
  'fixtureSetDigest',
  'fixtureCount',
] as const);
const COMPONENT_KINDS = new Set([
  'capability',
  'instruction',
  'memory',
  'routing',
  'tool-policy',
  'verifier-policy',
]);
const INHERITANCE_KINDS = new Set([
  'extends',
  'imports',
  'overrides',
  'preserves',
]);
const MANIFEST_RINGS = new Set([
  'canary',
  'heldout',
  'public',
  'transfer',
]);
const FORBIDDEN_MUTABLE_FIELDS = new Set([
  'body',
  'canaryBody',
  'canaryContents',
  'candidateBody',
  'content',
  'evaluatorFeedback',
  'evaluatorRationale',
  'evidenceBlob',
  'fixtureBody',
  'fixtureId',
  'fixtureIds',
  'goldContents',
  'hiddenFixtureId',
  'rationale',
  'rawBody',
  'rawEvidence',
  'rawObservation',
  'reportBody',
  'sourceText',
  'text',
  'transcript',
]);

// ───────────────────────────────────────────────────────────────────
// 3. VALIDATION
// ───────────────────────────────────────────────────────────────────

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function isSystemToken(value: unknown): value is string {
  return typeof value === 'string' && SYSTEM_TOKEN_PATTERN.test(value);
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && HASH_PATTERN.test(value);
}

function isTimestamp(value: unknown): value is string {
  return typeof value === 'string'
    && value.length <= 64
    && !Number.isNaN(new Date(value).getTime());
}

function isUint32(value: unknown): value is number {
  return Number.isSafeInteger(value)
    && (value as number) >= 0
    && (value as number) <= 0xffff_ffff;
}

function isRatio(value: unknown): value is number {
  return typeof value === 'number'
    && Number.isFinite(value)
    && value >= 0
    && value <= 1;
}

function hasExactFields(
  value: Record<string, unknown>,
  fields: readonly string[],
): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  return actual.length === expected.length
    && actual.every((field, index) => field === expected[index]);
}

function hasForbiddenMutableField(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasForbiddenMutableField);
  if (!isObject(value)) return false;
  return Object.entries(value).some(([key, child]) => (
    FORBIDDEN_MUTABLE_FIELDS.has(key) || hasForbiddenMutableField(child)
  ));
}

function isTokenArray(
  value: unknown,
  requireNonEmpty = false,
): value is string[] {
  return Array.isArray(value)
    && value.length <= MAX_REFERENCE_ARRAY_LENGTH
    && (!requireNonEmpty || value.length > 0)
    && value.every(isSystemToken)
    && new Set(value).size === value.length;
}

function isComponentReferences(value: unknown): boolean {
  if (!Array.isArray(value)
    || value.length === 0
    || value.length > MAX_COMPONENTS) return false;
  const componentIds = new Set<string>();
  for (const component of value) {
    if (!isObject(component)
      || !hasExactFields(component, COMPONENT_FIELDS)
      || !isSystemToken(component.componentId)
      || !COMPONENT_KINDS.has(String(component.componentKind))
      || !isSystemToken(component.componentRef)
      || !isDigest(component.componentDigest)
      || componentIds.has(component.componentId)) return false;
    componentIds.add(component.componentId);
  }
  return true;
}

function isInheritanceEdgeReferences(value: unknown): boolean {
  if (!Array.isArray(value)
    || value.length > MAX_INHERITANCE_EDGES) return false;
  const edgeIds = new Set<string>();
  for (const edge of value) {
    if (!isObject(edge)
      || !hasExactFields(edge, INHERITANCE_EDGE_FIELDS)
      || !isSystemToken(edge.edgeId)
      || !isSystemToken(edge.parentComponentId)
      || !isSystemToken(edge.childComponentId)
      || edge.parentComponentId === edge.childComponentId
      || !INHERITANCE_KINDS.has(String(edge.inheritanceKind))
      || !isDigest(edge.edgeDigest)
      || edgeIds.has(edge.edgeId)) return false;
    edgeIds.add(edge.edgeId);
  }
  return true;
}

function isLocusReferences(value: unknown): boolean {
  if (!Array.isArray(value)
    || value.length < 2
    || value.length > MAX_LOCI) return false;
  const locusIds = new Set<string>();
  const mutabilities = new Set<string>();
  for (const locus of value) {
    if (!isObject(locus)
      || !hasExactFields(locus, LOCUS_FIELDS)
      || !isSystemToken(locus.locusId)
      || !isSystemToken(locus.componentId)
      || !(locus.clauseId === null || isSystemToken(locus.clauseId))
      || !COMPONENT_KINDS.has(String(locus.locusKind))
      || !['immutable', 'mutable'].includes(String(locus.mutability))
      || !isSystemToken(locus.locusRef)
      || !isDigest(locus.locusDigest)
      || locusIds.has(locus.locusId)) return false;
    locusIds.add(locus.locusId);
    mutabilities.add(String(locus.mutability));
  }
  return mutabilities.has('immutable') && mutabilities.has('mutable');
}

function isManifestRingReferences(value: unknown): boolean {
  if (!Array.isArray(value) || value.length !== MANIFEST_RINGS.size) return false;
  const rings = new Set<string>();
  for (const ring of value) {
    if (!isObject(ring)
      || !hasExactFields(ring, MANIFEST_RING_FIELDS)
      || !MANIFEST_RINGS.has(String(ring.ring))
      || !isSystemToken(ring.fixtureSetRef)
      || !isDigest(ring.fixtureSetDigest)
      || !isUint32(ring.fixtureCount)
      || ring.fixtureCount === 0
      || rings.has(String(ring.ring))) return false;
    rings.add(String(ring.ring));
  }
  return rings.size === MANIFEST_RINGS.size;
}

function isReplayMetadata(value: unknown): boolean {
  if (!isObject(value) || !hasExactFields(
    value,
    ['fingerprint_version', 'final_digest', 'replay_input_digests'],
  )) return false;
  return Number.isSafeInteger(value.fingerprint_version)
    && (value.fingerprint_version as number) > 0
    && isDigest(value.final_digest)
    && isObject(value.replay_input_digests)
    && Object.entries(value.replay_input_digests).every(
      ([key, digest]) => isSystemToken(key) && isDigest(digest),
    );
}

function isExtensionScope(
  stem: AgentImprovementExtensionEventStem,
  value: unknown,
): boolean {
  if (!isObject(value) || !hasExactFields(value, SCOPE_FIELDS[stem])) return false;
  return value.variant === 'agent-improvement'
    && Object.entries(value).every(([field, candidate]) => (
      field === 'variant' || isSystemToken(candidate)
    ));
}

function isFieldValue(rule: DataFieldRule, value: unknown): boolean {
  if (typeof rule !== 'string') return rule.values.includes(String(value));
  switch (rule) {
    case 'component-references':
      return isComponentReferences(value);
    case 'digest':
      return isDigest(value);
    case 'identifier':
    case 'reference':
    case 'version':
      return isSystemToken(value);
    case 'identifier-array':
    case 'reference-array':
      return isTokenArray(value);
    case 'inheritance-edge-references':
      return isInheritanceEdgeReferences(value);
    case 'locus-references':
      return isLocusReferences(value);
    case 'manifest-ring-references':
      return isManifestRingReferences(value);
    case 'nonempty-identifier-array':
    case 'nonempty-reference-array':
      return isTokenArray(value, true);
    case 'nullable-identifier':
      return value === null || isSystemToken(value);
    case 'ratio':
      return isRatio(value);
    case 'timestamp':
      return isTimestamp(value);
    case 'uint32':
      return isUint32(value);
  }
}

function hasValidAgentIrReferences(data: Readonly<JsonObject>): boolean {
  const components = data.components as readonly Record<string, unknown>[];
  const edges = data.inheritanceEdges as readonly Record<string, unknown>[];
  const loci = data.loci as readonly Record<string, unknown>[];
  const componentIds = new Set(components.map((component) => component.componentId));
  return edges.every((edge) => (
    componentIds.has(edge.parentComponentId)
    && componentIds.has(edge.childComponentId)
  )) && loci.every((locus) => componentIds.has(locus.componentId));
}

function hasValidExtensionSemantics(
  stem: AgentImprovementExtensionEventStem,
  scope: Readonly<JsonObject>,
  data: Readonly<JsonObject>,
): boolean {
  switch (stem) {
    case 'agent_improvement.agent_ir_compiled':
      return hasValidAgentIrReferences(data);
    case 'agent_improvement.change_contract_compiled':
      return data.baseDefinitionDigest !== data.candidateDefinitionDigest;
    case 'agent_improvement.mutation_proposed':
      return data.parentCandidateId === null
        || data.parentCandidateId !== scope.candidateId;
    case 'agent_improvement.counterfactual_replayed':
      return (data.replayCount as number) > 0;
    case 'agent_improvement.evaluation_manifest_sealed':
      return true;
    case 'agent_improvement.fixture_exposure_recorded':
      return (data.exposedRingCodes as readonly string[]).every(
        (ring) => MANIFEST_RINGS.has(ring),
      );
    case 'agent_improvement.transfer_trial_recorded':
      return data.sourceExecutorRef !== data.targetExecutorRef;
    case 'agent_improvement.behavioral_change_classified': {
      const affected = new Set(data.affectedBehaviorFamilyIds as readonly string[]);
      return (data.regressedBehaviorFamilyIds as readonly string[]).every(
        (familyId) => affected.has(familyId),
      );
    }
    default:
      return true;
  }
}

function isExtensionData(
  stem: AgentImprovementExtensionEventStem,
  value: unknown,
): boolean {
  if (!isObject(value) || hasForbiddenMutableField(value)) return false;
  const rules = DATA_FIELD_RULES[stem];
  if (!hasExactFields(value, Object.keys(rules))) return false;
  return Object.entries(rules).every(([field, rule]) => (
    isFieldValue(rule, value[field])
  ));
}

function digestPayloadInput(
  stem: AgentImprovementEventStem,
  scope: JsonObject,
  prevEventHash: string,
  replay: JsonObject,
  data: JsonObject,
): string {
  return sha256Bytes(canonicalBytes({
    stem,
    eventVersion: AGENT_IMPROVEMENT_EVENT_VERSION,
    scope,
    prevEventHash,
    replay,
    data,
  }));
}

function isExtensionPayload(
  stem: AgentImprovementExtensionEventStem,
  payload: Readonly<JsonObject>,
): boolean {
  if (!isAgentImprovementExtensionEventStem(payload.stem)
    || payload.stem !== stem
    || payload.eventVersion !== AGENT_IMPROVEMENT_EVENT_VERSION) return false;
  if (!isExtensionScope(stem, payload.scope)
    || !isDigest(payload.prevEventHash)
    || !isReplayMetadata(payload.replay)
    || !isExtensionData(stem, payload.data)) return false;
  if (!hasValidExtensionSemantics(
    stem,
    payload.scope as JsonObject,
    payload.data as JsonObject,
  )) return false;
  return payload.payloadDigest === digestPayloadInput(
    stem,
    payload.scope as JsonObject,
    payload.prevEventHash as string,
    payload.replay as JsonObject,
    payload.data as JsonObject,
  );
}

function assertAgentImprovementScope(scope: Readonly<JsonObject>): void {
  if (scope.variant !== 'agent-improvement') {
    throw new TypeError('Agent Improvement events require the agent-improvement variant.');
  }
}

function normalizeCommonData<TStem extends DeepImprovementCommonEventStem>(
  stem: TStem,
  data: AgentImprovementInputData<TStem>,
): DeepImprovementCommonPayloadMap[TStem] {
  if (stem === 'deep_improvement_common.evaluation_epoch_sealed'
    || stem === 'deep_improvement_common.evaluation_normalized') {
    if (Object.prototype.hasOwnProperty.call(data, 'scoreWriteBackendRef')) {
      throw new TypeError('The score write backend is bound by the Agent Improvement schema.');
    }
    return {
      ...data,
      scoreWriteBackendRef: AGENT_IMPROVEMENT_SCORE_WRITE_BACKEND_REF,
    } as DeepImprovementCommonPayloadMap[TStem];
  }
  return data as DeepImprovementCommonPayloadMap[TStem];
}

// ───────────────────────────────────────────────────────────────────
// 4. REGISTRY AND EVENT PREPARATION
// ───────────────────────────────────────────────────────────────────

function extensionEventDefinition(
  stem: AgentImprovementExtensionEventStem,
): EventTypeDefinition {
  return {
    eventType: AgentImprovementExtensionWireEventTypes[stem],
    currentVersion: AGENT_IMPROVEMENT_EVENT_VERSION,
    versions: [{
      version: AGENT_IMPROVEMENT_EVENT_VERSION,
      payload: {
        requiredFields: AGENT_IMPROVEMENT_MODE_PAYLOAD_FIELDS,
        validate: (payload) => isExtensionPayload(stem, payload),
      },
    }],
    upcasters: [],
  };
}

function narrowCommonEventDefinition(
  definition: EventTypeDefinition,
): EventTypeDefinition {
  return {
    ...definition,
    versions: definition.versions.map((version) => ({
      ...version,
      payload: {
        ...version.payload,
        validate: (payload) => {
          assertAgentImprovementScope(
            payload.scope as Readonly<JsonObject>,
          );
          return version.payload.validate(payload);
        },
      },
    })),
  };
}

export function createAgentImprovementEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry(agentImprovementEventDefinitions());
}

export function createAgentImprovementLedgerPayload<
  TStem extends AgentImprovementEventStem,
>(
  stem: TStem,
  scope: AgentImprovementScopeMap[TStem],
  prevEventHash: string,
  replay: AgentImprovementReplayMetadata,
  data: AgentImprovementInputData<TStem>,
): AgentImprovementLedgerPayload<TStem> {
  assertAgentImprovementScope(scope);
  if (isDeepImprovementCommonEventStem(stem)) {
    // The runtime stem guard guarantees common-stem values; TypeScript cannot narrow the generic from a value guard.
    return createDeepImprovementCommonLedgerPayload(
      stem,
      scope as unknown as DeepImprovementCommonScopeMap[typeof stem],
      prevEventHash,
      replay as DeepImprovementCommonReplayMetadata,
      normalizeCommonData(stem, data as AgentImprovementInputData<typeof stem>),
    ) as unknown as AgentImprovementLedgerPayload<TStem>;
  }
  const payloadDigest = digestPayloadInput(
    stem,
    scope,
    prevEventHash,
    replay,
    data as JsonObject,
  );
  return Object.freeze({
    stem,
    eventVersion: AGENT_IMPROVEMENT_EVENT_VERSION,
    scope,
    prevEventHash,
    payloadDigest,
    replay,
    data,
  }) as AgentImprovementLedgerPayload<TStem>;
}

export function prepareAgentImprovementEvent<
  TStem extends AgentImprovementEventStem,
>(
  input: AgentImprovementEventInput<TStem>,
  registry: EventTypeRegistry,
): EventWritePreflight {
  assertAgentImprovementScope(input.scope);
  if (isDeepImprovementCommonEventStem(input.stem)) {
    const commonInput = {
      ...input,
      scope: input.scope as unknown as DeepImprovementCommonScopeMap[typeof input.stem],
      replay: input.replay as DeepImprovementCommonReplayMetadata,
      data: normalizeCommonData(
        input.stem,
        input.data as AgentImprovementInputData<typeof input.stem>,
      ),
    } as DeepImprovementCommonEventInput<typeof input.stem>;
    return prepareDeepImprovementCommonEvent(commonInput, registry);
  }

  const payload = createAgentImprovementLedgerPayload(
    input.stem,
    input.scope,
    input.prevEventHash,
    input.replay,
    input.data,
  );
  const envelope: AgentImprovementEventEnvelope<TStem> = {
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: input.eventId,
    event_type: AgentImprovementWireEventTypes[input.stem],
    event_version: AGENT_IMPROVEMENT_EVENT_VERSION,
    stream_id: input.streamId,
    stream_sequence: input.streamSequence,
    occurred_at: input.occurredAt,
    recorded_at: input.recordedAt,
    producer: input.producer,
    authority_epoch: input.authorityEpoch,
    correlation_id: input.correlationId,
    causation_id: input.causationId,
    idempotency_key: input.idempotencyKey,
    payload,
  };
  return prepareEventWrite(envelope, registry);
}

export function agentImprovementEventDefinitions():
readonly EventTypeDefinition[] {
  return Object.freeze([
    ...deepImprovementCommonEventDefinitions().map(
      narrowCommonEventDefinition,
    ),
    ...AgentImprovementExtensionEventStems.map(extensionEventDefinition),
  ]);
}

export function agentImprovementPayloadDigest<
  TStem extends AgentImprovementEventStem,
>(
  payload: Readonly<{
    stem: TStem;
    eventVersion: 1;
    scope: AgentImprovementScopeMap[TStem];
    prevEventHash: string;
    replay: AgentImprovementReplayMetadata;
    data: AgentImprovementInputData<TStem>;
  }>,
): string {
  const normalizedData = isDeepImprovementCommonEventStem(payload.stem)
    ? normalizeCommonData(
      payload.stem,
      payload.data as AgentImprovementInputData<typeof payload.stem>,
    )
    : payload.data;
  return digestPayloadInput(
    payload.stem,
    payload.scope,
    payload.prevEventHash,
    payload.replay,
    normalizedData as JsonObject,
  );
}

export function isAgentImprovementExtensionEventStem(
  value: JsonValue,
): value is AgentImprovementExtensionEventStem {
  return typeof value === 'string'
    && (AgentImprovementExtensionEventStems as readonly string[]).includes(value);
}

export function isAgentImprovementEventStem(
  value: JsonValue,
): value is AgentImprovementEventStem {
  return typeof value === 'string'
    && (AgentImprovementEventStems as readonly string[]).includes(value);
}
