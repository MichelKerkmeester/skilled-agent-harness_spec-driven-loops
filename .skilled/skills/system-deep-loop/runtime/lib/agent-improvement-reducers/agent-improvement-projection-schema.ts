// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Projection Schema
// ───────────────────────────────────────────────────────────────────

import { canonicalJson } from '../event-envelope/index.js';
import {
  assertDeepImprovementCommonLegacyProjection,
  assertDeepImprovementCommonProjectionState,
} from '../deep-improvement-common-reducers/index.js';

import type {
  AgentImprovementArtifactRecord,
  AgentImprovementCandidateView,
  AgentImprovementChangeContract,
  AgentImprovementCoverageRecord,
  AgentImprovementDefinitionSnapshot,
  AgentImprovementExperimentRecord,
  AgentImprovementFixtureExposure,
  AgentImprovementInterventionRecord,
  AgentImprovementIrVersion,
  AgentImprovementLegacyProjection,
  AgentImprovementManifestRecord,
  AgentImprovementMutationRecord,
  AgentImprovementProjectionState,
  AgentImprovementReducerErrorCode,
  AgentImprovementTraceSliceRecord,
  AgentImprovementTransferTrial,
} from './agent-improvement-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED FIELD HELPERS
// ───────────────────────────────────────────────────────────────────

const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/u;
const UINT32_MAX = 0xffff_ffff;

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function hasFields(
  value: unknown,
  fields: readonly string[],
): value is Record<string, unknown> {
  if (!isObject(value)) return false;
  return canonicalJson(Object.keys(value).sort())
    === canonicalJson([...fields].sort());
}

function isToken(value: unknown): value is string {
  return typeof value === 'string' && SYSTEM_TOKEN_PATTERN.test(value);
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && HASH_PATTERN.test(value);
}

function isRatio(value: unknown): value is number {
  return typeof value === 'number'
    && Number.isFinite(value)
    && value >= 0
    && value <= 1;
}

function isUint32(value: unknown): value is number {
  return Number.isSafeInteger(value)
    && Number(value) >= 0
    && Number(value) <= UINT32_MAX;
}

function isTimestamp(value: unknown): value is string {
  return typeof value === 'string'
    && value.length <= 64
    && !Number.isNaN(new Date(value).getTime());
}

function isTokenArray(value: unknown): value is string[] {
  return Array.isArray(value)
    && value.every(isToken)
    && new Set(value).size === value.length;
}

function isNullableToken(value: unknown): value is string | null {
  return value === null || isToken(value);
}

function isEnum(
  value: unknown,
  values: readonly string[],
): value is string {
  return typeof value === 'string' && values.includes(value);
}

function everyRecord<T>(
  value: unknown,
  predicate: (entry: unknown) => boolean,
): value is T[] {
  return Array.isArray(value) && value.every(predicate);
}

function isComponent(value: unknown): boolean {
  return hasFields(value, [
    'componentId',
    'componentKind',
    'componentRef',
    'componentDigest',
  ])
    && isToken(value.componentId)
    && isEnum(value.componentKind, [
      'capability',
      'instruction',
      'memory',
      'routing',
      'tool-policy',
      'verifier-policy',
    ])
    && isToken(value.componentRef)
    && isDigest(value.componentDigest);
}

function isInheritanceEdge(value: unknown): boolean {
  return hasFields(value, [
    'edgeId',
    'parentComponentId',
    'childComponentId',
    'inheritanceKind',
    'edgeDigest',
  ])
    && isToken(value.edgeId)
    && isToken(value.parentComponentId)
    && isToken(value.childComponentId)
    && isEnum(value.inheritanceKind, [
      'extends',
      'imports',
      'overrides',
      'preserves',
    ])
    && isDigest(value.edgeDigest);
}

function isLocus(value: unknown): boolean {
  return hasFields(value, [
    'locusId',
    'componentId',
    'clauseId',
    'locusKind',
    'mutability',
    'locusRef',
    'locusDigest',
  ])
    && isToken(value.locusId)
    && isToken(value.componentId)
    && isNullableToken(value.clauseId)
    && isEnum(value.locusKind, [
      'capability',
      'instruction',
      'memory',
      'routing',
      'tool-policy',
      'verifier-policy',
    ])
    && isEnum(value.mutability, ['immutable', 'mutable'])
    && isToken(value.locusRef)
    && isDigest(value.locusDigest);
}

function isManifestRing(value: unknown): boolean {
  return hasFields(value, [
    'ring',
    'fixtureSetRef',
    'fixtureSetDigest',
    'fixtureCount',
  ])
    && isEnum(value.ring, ['canary', 'heldout', 'public', 'transfer'])
    && isToken(value.fixtureSetRef)
    && isDigest(value.fixtureSetDigest)
    && isUint32(value.fixtureCount);
}

// ───────────────────────────────────────────────────────────────────
// 2. PROJECTION RECORD VALIDATORS
// ───────────────────────────────────────────────────────────────────

function isDefinitionSnapshot(
  value: unknown,
): value is AgentImprovementDefinitionSnapshot {
  return hasFields(value, [
    'agentDefinitionId',
    'definitionRef',
    'definitionDigest',
    'definitionSchemaVersion',
    'capabilityPolicyRef',
    'capabilityPolicyDigest',
    'verifierPolicyRef',
    'verifierPolicyDigest',
    'toolPolicyRef',
    'toolPolicyDigest',
    'routingPolicyRef',
    'routingPolicyDigest',
    'memoryPolicyRef',
    'memoryPolicyDigest',
    'sealingReceiptRef',
    'producerEventId',
  ])
    && isToken(value.agentDefinitionId)
    && isToken(value.definitionRef)
    && isDigest(value.definitionDigest)
    && isToken(value.definitionSchemaVersion)
    && isToken(value.capabilityPolicyRef)
    && isDigest(value.capabilityPolicyDigest)
    && isToken(value.verifierPolicyRef)
    && isDigest(value.verifierPolicyDigest)
    && isToken(value.toolPolicyRef)
    && isDigest(value.toolPolicyDigest)
    && isToken(value.routingPolicyRef)
    && isDigest(value.routingPolicyDigest)
    && isToken(value.memoryPolicyRef)
    && isDigest(value.memoryPolicyDigest)
    && isToken(value.sealingReceiptRef)
    && isToken(value.producerEventId);
}

function isIrVersion(value: unknown): value is AgentImprovementIrVersion {
  return hasFields(value, [
    'agentDefinitionId',
    'agentIrId',
    'definitionSnapshotEventId',
    'definitionSnapshotPayloadDigest',
    'agentIrRef',
    'agentIrDigest',
    'agentIrSchemaVersion',
    'components',
    'inheritanceEdges',
    'loci',
    'compilerFingerprint',
    'compilationReceiptRef',
    'producerEventId',
  ])
    && isToken(value.agentDefinitionId)
    && isToken(value.agentIrId)
    && isToken(value.definitionSnapshotEventId)
    && isDigest(value.definitionSnapshotPayloadDigest)
    && isToken(value.agentIrRef)
    && isDigest(value.agentIrDigest)
    && isToken(value.agentIrSchemaVersion)
    && everyRecord(value.components, isComponent)
    && everyRecord(value.inheritanceEdges, isInheritanceEdge)
    && everyRecord(value.loci, isLocus)
    && isDigest(value.compilerFingerprint)
    && isToken(value.compilationReceiptRef)
    && isToken(value.producerEventId);
}

function isChangeContract(
  value: unknown,
): value is AgentImprovementChangeContract {
  return hasFields(value, [
    'candidateId',
    'agentChangeId',
    'agentIrEventId',
    'agentIrPayloadDigest',
    'baseDefinitionRef',
    'baseDefinitionDigest',
    'candidateDefinitionRef',
    'candidateDefinitionDigest',
    'changeContractRef',
    'changeContractDigest',
    'patchRef',
    'patchDigest',
    'intendedObligationIds',
    'preservedObligationIds',
    'affectedBehaviorFamilyIds',
    'behavioralSemverIntent',
    'contractPolicyVersion',
    'compilationReceiptRef',
    'producerEventId',
  ])
    && isToken(value.candidateId)
    && isToken(value.agentChangeId)
    && isToken(value.agentIrEventId)
    && isDigest(value.agentIrPayloadDigest)
    && isToken(value.baseDefinitionRef)
    && isDigest(value.baseDefinitionDigest)
    && isToken(value.candidateDefinitionRef)
    && isDigest(value.candidateDefinitionDigest)
    && isToken(value.changeContractRef)
    && isDigest(value.changeContractDigest)
    && isToken(value.patchRef)
    && isDigest(value.patchDigest)
    && isTokenArray(value.intendedObligationIds)
    && isTokenArray(value.preservedObligationIds)
    && isTokenArray(value.affectedBehaviorFamilyIds)
    && isEnum(value.behavioralSemverIntent, ['major', 'minor', 'patch'])
    && isToken(value.contractPolicyVersion)
    && isToken(value.compilationReceiptRef)
    && isToken(value.producerEventId);
}

function isMutation(
  value: unknown,
): value is AgentImprovementMutationRecord {
  return hasFields(value, [
    'candidateId',
    'agentChangeId',
    'mutationId',
    'lifecycle',
    'changeContractEventId',
    'changeContractPayloadDigest',
    'mutationOperatorRef',
    'mutationOperatorVersion',
    'mutationProposalRef',
    'mutationProposalDigest',
    'targetLocusIds',
    'parentCandidateId',
    'diagnosticEvidenceRefs',
    'proposalPolicyVersion',
    'proposalEventId',
    'rejectionReasonCode',
    'proposalPayloadDigest',
    'invalidLocusIds',
    'rejectionEvidenceRefs',
    'terminalEventId',
  ])
    && isToken(value.candidateId)
    && isToken(value.agentChangeId)
    && isToken(value.mutationId)
    && isEnum(value.lifecycle, ['proposed', 'rejected'])
    && isToken(value.changeContractEventId)
    && isDigest(value.changeContractPayloadDigest)
    && isToken(value.mutationOperatorRef)
    && isToken(value.mutationOperatorVersion)
    && isToken(value.mutationProposalRef)
    && isDigest(value.mutationProposalDigest)
    && isTokenArray(value.targetLocusIds)
    && isNullableToken(value.parentCandidateId)
    && isTokenArray(value.diagnosticEvidenceRefs)
    && isToken(value.proposalPolicyVersion)
    && isToken(value.proposalEventId)
    && isNullableToken(value.rejectionReasonCode)
    && (value.proposalPayloadDigest === null
      || isDigest(value.proposalPayloadDigest))
    && isTokenArray(value.invalidLocusIds)
    && isTokenArray(value.rejectionEvidenceRefs)
    && isNullableToken(value.terminalEventId);
}

function isTraceSlice(
  value: unknown,
): value is AgentImprovementTraceSliceRecord {
  return hasFields(value, [
    'candidateId',
    'evaluationEpochId',
    'behaviorFamilyId',
    'traceId',
    'evaluationObservationEventId',
    'evaluationObservationPayloadDigest',
    'traceRef',
    'traceDigest',
    'traceSliceRef',
    'traceSliceDigest',
    'failureRef',
    'failureDigest',
    'clauseIds',
    'componentIds',
    'attributionStatus',
    'attributionUncertainty',
    'producerEventId',
  ])
    && isToken(value.candidateId)
    && isToken(value.evaluationEpochId)
    && isToken(value.behaviorFamilyId)
    && isToken(value.traceId)
    && isToken(value.evaluationObservationEventId)
    && isDigest(value.evaluationObservationPayloadDigest)
    && isToken(value.traceRef)
    && isDigest(value.traceDigest)
    && isToken(value.traceSliceRef)
    && isDigest(value.traceSliceDigest)
    && isToken(value.failureRef)
    && isDigest(value.failureDigest)
    && isTokenArray(value.clauseIds)
    && isTokenArray(value.componentIds)
    && isEnum(value.attributionStatus, [
      'diagnostic',
      'insufficient-evidence',
    ])
    && isRatio(value.attributionUncertainty)
    && isToken(value.producerEventId);
}

function isExperiment(
  value: unknown,
): value is AgentImprovementExperimentRecord {
  return hasFields(value, [
    'candidateId',
    'experimentId',
    'traceSliceEventId',
    'traceSlicePayloadDigest',
    'behaviorFamilyId',
    'experimentPlanRef',
    'experimentPlanDigest',
    'scenarioSetRef',
    'scenarioSetDigest',
    'baselineExecutionRef',
    'baselineExecutionDigest',
    'candidateExecutionRef',
    'candidateExecutionDigest',
    'executorRef',
    'executorFingerprint',
    'verifierRef',
    'verifierFingerprint',
    'interventionIds',
    'producerEventId',
  ])
    && isToken(value.candidateId)
    && isToken(value.experimentId)
    && isToken(value.traceSliceEventId)
    && isDigest(value.traceSlicePayloadDigest)
    && isToken(value.behaviorFamilyId)
    && isToken(value.experimentPlanRef)
    && isDigest(value.experimentPlanDigest)
    && isToken(value.scenarioSetRef)
    && isDigest(value.scenarioSetDigest)
    && isToken(value.baselineExecutionRef)
    && isDigest(value.baselineExecutionDigest)
    && isToken(value.candidateExecutionRef)
    && isDigest(value.candidateExecutionDigest)
    && isToken(value.executorRef)
    && isDigest(value.executorFingerprint)
    && isToken(value.verifierRef)
    && isDigest(value.verifierFingerprint)
    && isTokenArray(value.interventionIds)
    && isToken(value.producerEventId);
}

function isIntervention(
  value: unknown,
): value is AgentImprovementInterventionRecord {
  return hasFields(value, [
    'candidateId',
    'experimentId',
    'interventionId',
    'interventionKind',
    'sourceEventId',
    'sourcePayloadDigest',
    'rawObservationRef',
    'rawObservationDigest',
    'outcome',
    'uncertainty',
    'receiptRef',
    'producerEventId',
  ])
    && isToken(value.candidateId)
    && isToken(value.experimentId)
    && isToken(value.interventionId)
    && isEnum(value.interventionKind, [
      'ablation',
      'counterfactual',
      'known-defect',
    ])
    && isToken(value.sourceEventId)
    && isDigest(value.sourcePayloadDigest)
    && isToken(value.rawObservationRef)
    && isDigest(value.rawObservationDigest)
    && isEnum(value.outcome, [
      'changed',
      'degraded',
      'detected',
      'improved',
      'inconclusive',
      'missed',
      'unchanged',
    ])
    && isRatio(value.uncertainty)
    && isToken(value.receiptRef)
    && isToken(value.producerEventId);
}

function isCoverage(
  value: unknown,
): value is AgentImprovementCoverageRecord {
  return hasFields(value, [
    'candidateId',
    'evaluationEpochId',
    'behaviorFamilyId',
    'experimentEventIds',
    'clauseIds',
    'authorityConflictCaseIds',
    'negativeCapabilityCaseIds',
    'sideEffectOracleIds',
    'semanticVariantIds',
    'rawCoverageRef',
    'rawCoverageDigest',
    'evidenceSetDigest',
    'coverageOutcome',
    'criticalInvariantOutcome',
    'coveragePolicyVersion',
    'producerEventId',
  ])
    && isToken(value.candidateId)
    && isToken(value.evaluationEpochId)
    && isToken(value.behaviorFamilyId)
    && isTokenArray(value.experimentEventIds)
    && isTokenArray(value.clauseIds)
    && isTokenArray(value.authorityConflictCaseIds)
    && isTokenArray(value.negativeCapabilityCaseIds)
    && isTokenArray(value.sideEffectOracleIds)
    && isTokenArray(value.semanticVariantIds)
    && isToken(value.rawCoverageRef)
    && isDigest(value.rawCoverageDigest)
    && isDigest(value.evidenceSetDigest)
    && isEnum(value.coverageOutcome, [
      'covered',
      'insufficient-evidence',
      'partial',
    ])
    && isEnum(value.criticalInvariantOutcome, ['fail', 'pass', 'unknown'])
    && isToken(value.coveragePolicyVersion)
    && isToken(value.producerEventId);
}

function isClassification(value: unknown): boolean {
  return hasFields(value, [
    'candidateId',
    'agentChangeId',
    'changeContractEventId',
    'changeContractPayloadDigest',
    'normalizedEventId',
    'normalizedPayloadDigest',
    'verificationEventId',
    'verificationPayloadDigest',
    'canaryGateEventId',
    'canaryGatePayloadDigest',
    'classificationPolicyVersion',
    'behavioralSemver',
    'affectedBehaviorFamilyIds',
    'regressedBehaviorFamilyIds',
    'preservedObligationIds',
    'classificationEvidenceRef',
    'classificationEvidenceDigest',
    'classificationReceiptRef',
    'producerEventId',
  ])
    && isToken(value.candidateId)
    && isToken(value.agentChangeId)
    && isToken(value.changeContractEventId)
    && isDigest(value.changeContractPayloadDigest)
    && isToken(value.normalizedEventId)
    && isDigest(value.normalizedPayloadDigest)
    && isToken(value.verificationEventId)
    && isDigest(value.verificationPayloadDigest)
    && isToken(value.canaryGateEventId)
    && isDigest(value.canaryGatePayloadDigest)
    && isToken(value.classificationPolicyVersion)
    && isEnum(value.behavioralSemver, ['major', 'minor', 'patch'])
    && isTokenArray(value.affectedBehaviorFamilyIds)
    && isTokenArray(value.regressedBehaviorFamilyIds)
    && isTokenArray(value.preservedObligationIds)
    && isToken(value.classificationEvidenceRef)
    && isDigest(value.classificationEvidenceDigest)
    && isToken(value.classificationReceiptRef)
    && isToken(value.producerEventId);
}

function isManifest(
  value: unknown,
): value is AgentImprovementManifestRecord {
  return hasFields(value, [
    'evaluationEpochId',
    'manifestId',
    'exposureEpochId',
    'manifestRef',
    'manifestDigest',
    'manifestVersion',
    'rings',
    'evaluatorCapsuleRef',
    'evaluatorCapsuleDigest',
    'leakVetoPolicyVersion',
    'sealingReceiptRef',
    'producerEventId',
  ])
    && isToken(value.evaluationEpochId)
    && isToken(value.manifestId)
    && isToken(value.exposureEpochId)
    && isToken(value.manifestRef)
    && isDigest(value.manifestDigest)
    && isToken(value.manifestVersion)
    && everyRecord(value.rings, isManifestRing)
    && isToken(value.evaluatorCapsuleRef)
    && isDigest(value.evaluatorCapsuleDigest)
    && isToken(value.leakVetoPolicyVersion)
    && isToken(value.sealingReceiptRef)
    && isToken(value.producerEventId);
}

function isExposure(
  value: unknown,
): value is AgentImprovementFixtureExposure {
  return hasFields(value, [
    'evaluationEpochId',
    'manifestId',
    'exposureEpochId',
    'manifestEventId',
    'manifestPayloadDigest',
    'exposureKind',
    'exposedRingCodes',
    'authorizedExposureRef',
    'authorizedExposureDigest',
    'exposureReceiptRef',
    'occurredAt',
    'producerEventId',
  ])
    && isToken(value.evaluationEpochId)
    && isToken(value.manifestId)
    && isToken(value.exposureEpochId)
    && isToken(value.manifestEventId)
    && isDigest(value.manifestPayloadDigest)
    && isEnum(value.exposureKind, ['activated', 'retired'])
    && isTokenArray(value.exposedRingCodes)
    && isToken(value.authorizedExposureRef)
    && isDigest(value.authorizedExposureDigest)
    && isToken(value.exposureReceiptRef)
    && isTimestamp(value.occurredAt)
    && isToken(value.producerEventId);
}

function isTransferTrial(
  value: unknown,
): value is AgentImprovementTransferTrial {
  return hasFields(value, [
    'candidateId',
    'evaluationEpochId',
    'trialId',
    'sourceExecutorRef',
    'sourceExecutorFingerprint',
    'targetExecutorRef',
    'targetExecutorFingerprint',
    'verifierRef',
    'verifierFingerprint',
    'behaviorFamilyIds',
    'scenarioSetRef',
    'scenarioSetDigest',
    'baselineExecutionRef',
    'baselineExecutionDigest',
    'candidateExecutionRef',
    'candidateExecutionDigest',
    'rawObservationRef',
    'rawObservationDigest',
    'transferOutcome',
    'uncertainty',
    'executionReceiptRef',
    'producerEventId',
  ])
    && isToken(value.candidateId)
    && isToken(value.evaluationEpochId)
    && isToken(value.trialId)
    && isToken(value.sourceExecutorRef)
    && isDigest(value.sourceExecutorFingerprint)
    && isToken(value.targetExecutorRef)
    && isDigest(value.targetExecutorFingerprint)
    && isToken(value.verifierRef)
    && isDigest(value.verifierFingerprint)
    && isTokenArray(value.behaviorFamilyIds)
    && isToken(value.scenarioSetRef)
    && isDigest(value.scenarioSetDigest)
    && isToken(value.baselineExecutionRef)
    && isDigest(value.baselineExecutionDigest)
    && isToken(value.candidateExecutionRef)
    && isDigest(value.candidateExecutionDigest)
    && isToken(value.rawObservationRef)
    && isDigest(value.rawObservationDigest)
    && isEnum(value.transferOutcome, ['fail', 'inconclusive', 'pass'])
    && isRatio(value.uncertainty)
    && isToken(value.executionReceiptRef)
    && isToken(value.producerEventId);
}

function isArtifact(
  value: unknown,
): value is AgentImprovementArtifactRecord {
  return hasFields(value, [
    'artifactId',
    'logicalArtifactId',
    'artifactKind',
    'reference',
    'digest',
    'producerEventId',
    'candidateId',
    'availability',
    'receiptRefs',
    'supersedesArtifactIds',
    'supersededByArtifactIds',
  ])
    && isToken(value.artifactId)
    && isToken(value.logicalArtifactId)
    && isEnum(value.artifactKind, [
      'agent-definition',
      'agent-ir',
      'behavior-classification',
      'behavior-coverage',
      'change-contract',
      'evaluation-manifest',
      'experiment-plan',
      'failure-gradient',
      'fixture-exposure',
      'mutation-proposal',
      'patch',
      'raw-trial',
      'trace-slice',
    ])
    && isToken(value.reference)
    && isDigest(value.digest)
    && isToken(value.producerEventId)
    && isNullableToken(value.candidateId)
    && isEnum(value.availability, [
      'available',
      'invalid',
      'superseded',
    ])
    && isTokenArray(value.receiptRefs)
    && isTokenArray(value.supersedesArtifactIds)
    && isTokenArray(value.supersededByArtifactIds);
}

// ───────────────────────────────────────────────────────────────────
// 3. COMPOSITE VALIDATION AND REFERENTIAL INTEGRITY
// ───────────────────────────────────────────────────────────────────

export class AgentImprovementReducerError extends Error {
  public readonly code: AgentImprovementReducerErrorCode;
  public readonly field: string | null;

  public constructor(
    code: AgentImprovementReducerErrorCode,
    message: string,
    field: string | null = null,
  ) {
    super(message);
    this.name = 'AgentImprovementReducerError';
    this.code = code;
    this.field = field;
    Object.setPrototypeOf(this, AgentImprovementReducerError.prototype);
  }
}

function requireEventReference(
  projection: AgentImprovementProjectionState,
  eventId: string,
  stems: readonly string[],
  payloadDigest?: string,
): void {
  const event = projection.seenEvents.find((entry) => entry.eventId === eventId);
  if (event === undefined
    || !stems.includes(event.stem)
    || (payloadDigest !== undefined && event.payloadDigest !== payloadDigest)) {
    throw new AgentImprovementReducerError(
      'referential-integrity',
      'Projected references must resolve to captured typed producer events',
      'agentImprovement',
    );
  }
}

function requireUniqueIdentity<T>(
  values: readonly T[],
  key: (entry: T) => string,
  field: string,
): void {
  const identities = values.map(key);
  if (new Set(identities).size !== identities.length) {
    throw new AgentImprovementReducerError(
      'referential-integrity',
      'Projected immutable identities must be unique within their owner',
      field,
    );
  }
}

function requireImmutableIdentity<T>(
  values: readonly T[],
  key: (entry: T) => string,
  field: string,
): void {
  const records = new Map<string, string>();
  for (const value of values) {
    const identity = key(value);
    const record = canonicalJson(value);
    const existing = records.get(identity);
    if (existing !== undefined && existing !== record) {
      throw new AgentImprovementReducerError(
        'referential-integrity',
        'An established AgentIR member identity cannot change content',
        field,
      );
    }
    records.set(identity, record);
  }
}

function assertProjectionReferences(
  projection: AgentImprovementProjectionState,
): void {
  const variant = projection.agentImprovement;
  const producerIds = new Set(projection.seenEvents.map((entry) => entry.eventId));
  const commonCandidates = new Map(
    projection.common.artifactIndex.candidates.map(
      (entry) => [entry.candidateId, entry],
    ),
  );
  const commonEventById = new Map(
    projection.common.seenEvents.map((entry) => [entry.eventId, entry]),
  );
  const definitionByEventId = new Map(
    variant.artifactIndex.definitionSnapshots.map(
      (entry) => [entry.producerEventId, entry],
    ),
  );
  const irByEventId = new Map(
    variant.artifactIndex.agentIrVersions.map(
      (entry) => [entry.producerEventId, entry],
    ),
  );
  const contractByEventId = new Map(
    variant.artifactIndex.changeContracts.map(
      (entry) => [entry.producerEventId, entry],
    ),
  );
  const traceByEventId = new Map(
    variant.iterationConvergence.traceSlices.map(
      (entry) => [entry.producerEventId, entry],
    ),
  );
  const experimentByEventId = new Map(
    variant.iterationConvergence.experiments.map(
      (entry) => [entry.producerEventId, entry],
    ),
  );
  const interventionByEventId = new Map(
    variant.iterationConvergence.interventions.map(
      (entry) => [entry.producerEventId, entry],
    ),
  );

  requireUniqueIdentity(
    variant.artifactIndex.agentIrVersions,
    (entry) => entry.agentIrId,
    'agentImprovement.artifactIndex.agentIrVersions.agentIrId',
  );
  requireUniqueIdentity(
    variant.artifactIndex.changeContracts,
    (entry) => entry.agentChangeId,
    'agentImprovement.artifactIndex.changeContracts.agentChangeId',
  );
  requireUniqueIdentity(
    variant.iterationConvergence.mutations,
    (entry) => entry.mutationId,
    'agentImprovement.iterationConvergence.mutations.mutationId',
  );
  requireImmutableIdentity(
    variant.artifactIndex.agentIrVersions.flatMap(
      (entry) => entry.components,
    ),
    (entry) => entry.componentId,
    'agentImprovement.artifactIndex.agentIrVersions.components.componentId',
  );
  requireImmutableIdentity(
    variant.artifactIndex.agentIrVersions.flatMap(
      (entry) => entry.inheritanceEdges,
    ),
    (entry) => entry.edgeId,
    'agentImprovement.artifactIndex.agentIrVersions.inheritanceEdges.edgeId',
  );
  requireImmutableIdentity(
    variant.artifactIndex.agentIrVersions.flatMap((entry) => entry.loci),
    (entry) => entry.locusId,
    'agentImprovement.artifactIndex.agentIrVersions.loci.locusId',
  );

  for (const artifact of variant.artifactIndex.artifacts) {
    if (!producerIds.has(artifact.producerEventId)
      || (artifact.candidateId !== null
        && !commonCandidates.has(artifact.candidateId))) {
      throw new AgentImprovementReducerError(
        'referential-integrity',
        'Variant artifacts must cite captured producer and candidate owners',
        'agentImprovement.artifactIndex.artifacts',
      );
    }
  }
  for (const ir of variant.artifactIndex.agentIrVersions) {
    requireEventReference(
      projection,
      ir.definitionSnapshotEventId,
      ['agent_improvement.definition_snapshot_sealed'],
      ir.definitionSnapshotPayloadDigest,
    );
    const definition = definitionByEventId.get(ir.definitionSnapshotEventId);
    const componentIds = new Set(
      ir.components.map((component) => component.componentId),
    );
    const locusIds = ir.loci.map((locus) => locus.locusId);
    requireUniqueIdentity(
      ir.components,
      (component) => component.componentId,
      'agentImprovement.artifactIndex.agentIrVersions.components.componentId',
    );
    requireUniqueIdentity(
      ir.inheritanceEdges,
      (edge) => edge.edgeId,
      'agentImprovement.artifactIndex.agentIrVersions.inheritanceEdges.edgeId',
    );
    requireUniqueIdentity(
      ir.loci,
      (locus) => locus.locusId,
      'agentImprovement.artifactIndex.agentIrVersions.loci.locusId',
    );
    if (definition?.agentDefinitionId !== ir.agentDefinitionId
      || ir.inheritanceEdges.some((edge) => (
        !componentIds.has(edge.parentComponentId)
        || !componentIds.has(edge.childComponentId)
      ))
      || ir.loci.some((locus) => !componentIds.has(locus.componentId))
      || new Set(locusIds).size !== locusIds.length) {
      throw new AgentImprovementReducerError(
        'referential-integrity',
        'AgentIR members must resolve within their defining snapshot and IR owner',
        'agentImprovement.artifactIndex.agentIrVersions',
      );
    }
  }
  for (const contract of variant.artifactIndex.changeContracts) {
    requireEventReference(
      projection,
      contract.agentIrEventId,
      ['agent_improvement.agent_ir_compiled'],
      contract.agentIrPayloadDigest,
    );
    if (!commonCandidates.has(contract.candidateId)
      || !irByEventId.has(contract.agentIrEventId)) {
      throw new AgentImprovementReducerError(
        'referential-integrity',
        'Change contracts require captured candidate and AgentIR owners',
        'agentImprovement.artifactIndex.changeContracts',
      );
    }
  }
  for (const mutation of variant.iterationConvergence.mutations) {
    requireEventReference(
      projection,
      mutation.changeContractEventId,
      ['agent_improvement.change_contract_compiled'],
      mutation.changeContractPayloadDigest,
    );
    requireEventReference(
      projection,
      mutation.proposalEventId,
      ['agent_improvement.mutation_proposed'],
      mutation.proposalPayloadDigest ?? undefined,
    );
    const candidate = commonCandidates.get(mutation.candidateId);
    const contract = contractByEventId.get(mutation.changeContractEventId);
    const ir = contract === undefined
      ? undefined
      : irByEventId.get(contract.agentIrEventId);
    const mutableLocusIds = new Set(
      ir?.loci.filter((locus) => locus.mutability === 'mutable')
        .map((locus) => locus.locusId) ?? [],
    );
    if (candidate === undefined
      || contract?.candidateId !== mutation.candidateId
      || contract.agentChangeId !== mutation.agentChangeId
      || candidate.parentCandidateId !== mutation.parentCandidateId
      || mutation.targetLocusIds.some(
        (locusId) => !mutableLocusIds.has(locusId),
      )
      || mutation.invalidLocusIds.some(
        (locusId) => !mutation.targetLocusIds.includes(locusId),
      )) {
      throw new AgentImprovementReducerError(
        'referential-integrity',
        'Mutations must preserve candidate lineage and contract-owned mutable loci',
        'agentImprovement.iterationConvergence.mutations',
      );
    }
  }
  for (const trace of variant.iterationConvergence.traceSlices) {
    requireEventReference(
      projection,
      trace.evaluationObservationEventId,
      ['deep_improvement_common.evaluation_observation_recorded'],
      trace.evaluationObservationPayloadDigest,
    );
    const observation = commonEventById.get(
      trace.evaluationObservationEventId,
    );
    const candidateIrVersions = variant.artifactIndex.changeContracts
      .filter((contract) => contract.candidateId === trace.candidateId)
      .map((contract) => irByEventId.get(contract.agentIrEventId))
      .filter((ir) => ir !== undefined);
    const ownedComponentIds = new Set(candidateIrVersions.flatMap(
      (ir) => ir.components.map((component) => component.componentId),
    ));
    const ownedClauseIds = new Set(candidateIrVersions.flatMap(
      (ir) => ir.loci.flatMap(
        (locus) => locus.clauseId === null ? [] : [locus.clauseId],
      ),
    ));
    if (!commonCandidates.has(trace.candidateId)
      || observation?.candidateId !== trace.candidateId
      || observation.evaluationEpochId !== trace.evaluationEpochId
      || trace.componentIds.some(
        (componentId) => !ownedComponentIds.has(componentId),
      )
      || trace.clauseIds.some((clauseId) => !ownedClauseIds.has(clauseId))) {
      throw new AgentImprovementReducerError(
        'referential-integrity',
        'Trace slices require candidate-owned observations and AgentIR members',
        'agentImprovement.iterationConvergence.traceSlices',
      );
    }
  }
  for (const experiment of variant.iterationConvergence.experiments) {
    requireEventReference(
      projection,
      experiment.traceSliceEventId,
      ['agent_improvement.trace_sliced'],
      experiment.traceSlicePayloadDigest,
    );
    const trace = traceByEventId.get(experiment.traceSliceEventId);
    if (trace?.candidateId !== experiment.candidateId
      || trace.behaviorFamilyId !== experiment.behaviorFamilyId) {
      throw new AgentImprovementReducerError(
        'referential-integrity',
        'Experiments must own their referenced trace and behavior family',
        'agentImprovement.iterationConvergence.experiments',
      );
    }
  }
  for (const intervention of variant.iterationConvergence.interventions) {
    requireEventReference(
      projection,
      intervention.sourceEventId,
      ['agent_improvement.behavior_experiment_sealed'],
      intervention.sourcePayloadDigest,
    );
    const experiment = experimentByEventId.get(intervention.sourceEventId);
    if (experiment?.candidateId !== intervention.candidateId
      || experiment.experimentId !== intervention.experimentId) {
      throw new AgentImprovementReducerError(
        'referential-integrity',
        'Interventions must belong to their referenced candidate experiment',
        'agentImprovement.iterationConvergence.interventions',
      );
    }
  }
  for (const coverage of variant.iterationConvergence.coverage) {
    coverage.experimentEventIds.forEach((eventId) => {
      requireEventReference(
        projection,
        eventId,
        [
          'agent_improvement.behavior_experiment_sealed',
          'agent_improvement.known_defect_injected',
          'agent_improvement.counterfactual_replayed',
          'agent_improvement.ablation_completed',
        ],
      );
      const experiment = experimentByEventId.get(eventId);
      const intervention = interventionByEventId.get(eventId);
      const ownerCandidateId = experiment?.candidateId
        ?? intervention?.candidateId;
      const behaviorFamilyId = experiment?.behaviorFamilyId
        ?? (intervention === undefined
          ? undefined
          : experimentByEventId.get(
            intervention.sourceEventId,
          )?.behaviorFamilyId);
      if (ownerCandidateId !== coverage.candidateId
        || behaviorFamilyId !== coverage.behaviorFamilyId) {
        throw new AgentImprovementReducerError(
          'referential-integrity',
          'Coverage evidence must belong to its candidate and behavior family',
          'agentImprovement.iterationConvergence.coverage',
        );
      }
    });
  }
  for (const exposure of variant.artifactIndex.exposures) {
    requireEventReference(
      projection,
      exposure.manifestEventId,
      ['agent_improvement.evaluation_manifest_sealed'],
      exposure.manifestPayloadDigest,
    );
    const manifest = variant.artifactIndex.manifests.find(
      (entry) => entry.producerEventId === exposure.manifestEventId,
    );
    if (manifest?.manifestId !== exposure.manifestId
      || manifest.evaluationEpochId !== exposure.evaluationEpochId
      || manifest.exposureEpochId !== exposure.exposureEpochId) {
      throw new AgentImprovementReducerError(
        'referential-integrity',
        'Fixture exposure must belong to its referenced manifest identity',
        'agentImprovement.artifactIndex.exposures',
      );
    }
  }
  for (const trial of variant.artifactIndex.transferTrials) {
    const epoch = projection.common.iterationConvergence.evaluatorEpochs.find(
      (entry) => entry.evaluationEpochId === trial.evaluationEpochId
        && entry.candidateId === trial.candidateId,
    );
    if (!commonCandidates.has(trial.candidateId) || epoch === undefined) {
      throw new AgentImprovementReducerError(
        'referential-integrity',
        'Transfer trials require candidate-owned evaluator epochs',
        'agentImprovement.artifactIndex.transferTrials',
      );
    }
  }
  for (const classification of variant.iterationConvergence.classifications) {
    requireEventReference(
      projection,
      classification.changeContractEventId,
      ['agent_improvement.change_contract_compiled'],
      classification.changeContractPayloadDigest,
    );
    requireEventReference(
      projection,
      classification.normalizedEventId,
      ['deep_improvement_common.evaluation_normalized'],
      classification.normalizedPayloadDigest,
    );
    requireEventReference(
      projection,
      classification.verificationEventId,
      ['deep_improvement_common.evaluation_verification_recorded'],
      classification.verificationPayloadDigest,
    );
    requireEventReference(
      projection,
      classification.canaryGateEventId,
      ['deep_improvement_common.canary_gate_passed'],
      classification.canaryGatePayloadDigest,
    );
    const contract = contractByEventId.get(
      classification.changeContractEventId,
    );
    const normalized = commonEventById.get(classification.normalizedEventId);
    const verification = commonEventById.get(
      classification.verificationEventId,
    );
    const canary = commonEventById.get(classification.canaryGateEventId);
    if (contract?.candidateId !== classification.candidateId
      || contract.agentChangeId !== classification.agentChangeId
      || normalized?.candidateId !== classification.candidateId
      || verification?.candidateId !== classification.candidateId
      || canary?.candidateId !== classification.candidateId) {
      throw new AgentImprovementReducerError(
        'referential-integrity',
        'Classifications must own their contract and adjudication evidence',
        'agentImprovement.iterationConvergence.classifications',
      );
    }
  }

  const commonStatus = projection.common.modeStatus.statuses.find(
    (entry) => entry.workstream === 'agent-improvement',
  );
  const expectedChampions = [...(commonStatus?.profileIncumbents ?? [])]
    .map((entry) => ({
      profileRef: entry.profileRef,
      candidateId: entry.candidateId,
    }))
    .sort((left, right) => (
      left.profileRef < right.profileRef ? -1
        : left.profileRef > right.profileRef ? 1
          : left.candidateId < right.candidateId ? -1
            : left.candidateId > right.candidateId ? 1 : 0
    ));
  if (expectedChampions.some(
    (entry) => !commonCandidates.has(entry.candidateId),
  ) || canonicalJson(expectedChampions)
    !== canonicalJson(variant.modeStatus.profileChampions)) {
    throw new AgentImprovementReducerError(
      'referential-integrity',
      'Profile champions must preserve the common incumbent ownership map',
      'agentImprovement.modeStatus.profileChampions',
    );
  }
}

/** Validate the closed composite without widening the imported common state. */
export function assertAgentImprovementProjectionState(
  value: unknown,
): asserts value is AgentImprovementProjectionState {
  if (!hasFields(value, [
    'schemaVersion',
    'reducerVersion',
    'codecVersion',
    'orderingPolicyVersion',
    'common',
    'agentImprovement',
    'streamFrontiers',
    'seenEvents',
  ])) {
    throw new AgentImprovementReducerError(
      'projection-field-undeclared',
      'Agent Improvement projection contains missing or undeclared fields',
      'projection',
    );
  }
  if (!isToken(value.schemaVersion)
    || !isToken(value.reducerVersion)
    || !isToken(value.codecVersion)
    || !isToken(value.orderingPolicyVersion)) {
    throw new AgentImprovementReducerError(
      'projection-field-invalid',
      'Projection version fields must be bounded version tokens',
      'projection',
    );
  }
  try {
    assertDeepImprovementCommonProjectionState(value.common);
  } catch (error: unknown) {
    throw new AgentImprovementReducerError(
      'projection-field-invalid',
      'Imported common projection failed its own closed validator',
      'common',
    );
  }
  if (!hasFields(value.agentImprovement, [
    'iterationConvergence',
    'artifactIndex',
    'modeStatus',
  ])) {
    throw new AgentImprovementReducerError(
      'projection-field-invalid',
      'Agent Improvement branch must use its closed namespaced shape',
      'agentImprovement',
    );
  }
  const variant = value.agentImprovement;
  if (!hasFields(variant.iterationConvergence, [
    'activeAgentIrId',
    'activeMutationId',
    'mutations',
    'traceSlices',
    'experiments',
    'interventions',
    'coverage',
    'classifications',
    'unresolvedEvidenceRefs',
    'blockingVetoCodes',
    'disposition',
  ])
    || !isNullableToken(variant.iterationConvergence.activeAgentIrId)
    || !isNullableToken(variant.iterationConvergence.activeMutationId)
    || !everyRecord(variant.iterationConvergence.mutations, isMutation)
    || !everyRecord(variant.iterationConvergence.traceSlices, isTraceSlice)
    || !everyRecord(variant.iterationConvergence.experiments, isExperiment)
    || !everyRecord(variant.iterationConvergence.interventions, isIntervention)
    || !everyRecord(variant.iterationConvergence.coverage, isCoverage)
    || !everyRecord(
      variant.iterationConvergence.classifications,
      isClassification,
    )
    || !isTokenArray(variant.iterationConvergence.unresolvedEvidenceRefs)
    || !isTokenArray(variant.iterationConvergence.blockingVetoCodes)
    || !isEnum(variant.iterationConvergence.disposition, [
      'blocked',
      'healthy',
      'inconclusive',
      'unassessed',
    ])) {
    throw new AgentImprovementReducerError(
      'projection-field-invalid',
      'Iteration and convergence branch failed its closed schema',
      'agentImprovement.iterationConvergence',
    );
  }
  if (!hasFields(variant.artifactIndex, [
    'definitionSnapshots',
    'agentIrVersions',
    'changeContracts',
    'manifests',
    'exposures',
    'transferTrials',
    'artifacts',
  ])
    || !everyRecord(
      variant.artifactIndex.definitionSnapshots,
      isDefinitionSnapshot,
    )
    || !everyRecord(variant.artifactIndex.agentIrVersions, isIrVersion)
    || !everyRecord(variant.artifactIndex.changeContracts, isChangeContract)
    || !everyRecord(variant.artifactIndex.manifests, isManifest)
    || !everyRecord(variant.artifactIndex.exposures, isExposure)
    || !everyRecord(variant.artifactIndex.transferTrials, isTransferTrial)
    || !everyRecord(variant.artifactIndex.artifacts, isArtifact)) {
    throw new AgentImprovementReducerError(
      'projection-field-invalid',
      'Artifact index branch failed its closed schema',
      'agentImprovement.artifactIndex',
    );
  }
  if (!hasFields(variant.modeStatus, [
    'commonStatusWorkstream',
    'activeAgentIrId',
    'activeMutationId',
    'activeMutationOperatorRef',
    'latestClassifiedCandidateId',
    'profileChampions',
    'coverageState',
    'evaluatorIntegrityState',
    'projectionHealth',
    'failureClasses',
    'blockingVetoCodes',
  ])
    || variant.modeStatus.commonStatusWorkstream !== 'agent-improvement'
    || !isNullableToken(variant.modeStatus.activeAgentIrId)
    || !isNullableToken(variant.modeStatus.activeMutationId)
    || !isNullableToken(variant.modeStatus.activeMutationOperatorRef)
    || !isNullableToken(variant.modeStatus.latestClassifiedCandidateId)
    || !everyRecord(variant.modeStatus.profileChampions, (entry): entry is {
      profileRef: string;
      candidateId: string;
    } => hasFields(entry, ['profileRef', 'candidateId'])
      && isToken(entry.profileRef)
      && isToken(entry.candidateId))
    || !isEnum(variant.modeStatus.coverageState, [
      'blocked',
      'covered',
      'partial',
      'unassessed',
    ])
    || !isEnum(variant.modeStatus.evaluatorIntegrityState, [
      'clean',
      'compromised',
      'unassessed',
    ])
    || !isEnum(variant.modeStatus.projectionHealth, [
      'blocked',
      'healthy',
      'inconclusive',
      'unassessed',
    ])
    || !isTokenArray(variant.modeStatus.failureClasses)
    || !isTokenArray(variant.modeStatus.blockingVetoCodes)) {
    throw new AgentImprovementReducerError(
      'projection-field-invalid',
      'Mode-status extension failed its closed schema',
      'agentImprovement.modeStatus',
    );
  }
  if (!everyRecord(value.streamFrontiers, (entry): entry is {
    streamId: string;
    lastSequence: number;
  } => hasFields(entry, ['streamId', 'lastSequence'])
    && isToken(entry.streamId)
    && isUint32(entry.lastSequence))
    || !everyRecord(value.seenEvents, (entry): entry is {
      eventId: string;
      eventDigest: string;
      payloadDigest: string;
      stem: string;
      streamId: string;
      streamSequence: number;
    } => hasFields(entry, [
      'eventId',
      'eventDigest',
      'payloadDigest',
      'stem',
      'streamId',
      'streamSequence',
    ])
      && isToken(entry.eventId)
      && isDigest(entry.eventDigest)
      && isDigest(entry.payloadDigest)
      && isToken(entry.stem)
      && isToken(entry.streamId)
      && isUint32(entry.streamSequence))) {
    throw new AgentImprovementReducerError(
      'projection-field-invalid',
      'Replay frontier records failed their closed schema',
      'streamFrontiers',
    );
  }
  assertProjectionReferences(value as unknown as AgentImprovementProjectionState);
}

/** Validate the complete shadow-only legacy comparison structure. */
export function assertAgentImprovementLegacyProjection(
  value: unknown,
): asserts value is AgentImprovementLegacyProjection {
  if (!hasFields(value, [
    'authority',
    'legacyAuthority',
    'common',
    'activeAgentIrId',
    'activeMutationId',
    'latestClassifiedCandidateId',
    'coverageState',
    'evaluatorIntegrityState',
    'projectionHealth',
    'blockingVetoCodes',
  ])
    || value.authority !== 'shadow-only'
    || value.legacyAuthority !== 'unchanged'
    || !isNullableToken(value.activeAgentIrId)
    || !isNullableToken(value.activeMutationId)
    || !isNullableToken(value.latestClassifiedCandidateId)
    || !isEnum(value.coverageState, [
      'blocked',
      'covered',
      'partial',
      'unassessed',
    ])
    || !isEnum(value.evaluatorIntegrityState, [
      'clean',
      'compromised',
      'unassessed',
    ])
    || !isEnum(value.projectionHealth, [
      'blocked',
      'healthy',
      'inconclusive',
      'unassessed',
    ])
    || !isTokenArray(value.blockingVetoCodes)) {
    throw new AgentImprovementReducerError(
      'projection-field-invalid',
      'Legacy view does not match its complete closed schema',
      'legacyProjection',
    );
  }
  assertDeepImprovementCommonLegacyProjection(value.common);
}

/** Validate the intentionally small candidate-facing projection. */
export function assertAgentImprovementCandidateView(
  value: unknown,
): asserts value is AgentImprovementCandidateView {
  if (!hasFields(value, [
    'authority',
    'workstream',
    'candidateStage',
    'coverageState',
    'decisionBand',
  ])
    || value.authority !== 'derived-redacted'
    || value.workstream !== 'agent-improvement'
    || !(value.candidateStage === null || isEnum(value.candidateStage, [
      'evaluating',
      'failed',
      'generated',
      'inconclusive',
      'proposed',
      'rejected',
      'scored',
      'verified',
    ]))
    || !isEnum(value.coverageState, [
      'blocked',
      'covered',
      'partial',
      'unassessed',
    ])
    || !isEnum(value.decisionBand, [
      'blocked',
      'eligible',
      'pending',
      'terminal',
    ])) {
    throw new AgentImprovementReducerError(
      'projection-field-invalid',
      'Candidate view does not match its closed redacted schema',
      'candidateView',
    );
  }
}

/** Clone canonical JSON and recursively freeze the clone. */
export function immutableProjectionClone<T>(value: T): Readonly<T> {
  const clone = JSON.parse(canonicalJson(value)) as T;
  const freeze = (candidate: unknown): void => {
    if (candidate !== null && typeof candidate === 'object') {
      Object.values(candidate).forEach(freeze);
      Object.freeze(candidate);
    }
  };
  freeze(clone);
  return clone;
}

/** Check that every nested projection collection and object is frozen. */
export function isDeepFrozenProjection(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return true;
  return Object.isFrozen(value)
    && Object.values(value).every(isDeepFrozenProjection);
}
