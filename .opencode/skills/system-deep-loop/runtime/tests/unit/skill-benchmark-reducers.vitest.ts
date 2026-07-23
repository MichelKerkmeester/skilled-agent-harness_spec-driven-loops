// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Reducer Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  SKILL_BENCHMARK_REDUCER_SURFACE,
  createSkillBenchmarkProjectionState,
  foldSkillBenchmarkEvents,
  isDeepFrozenProjection,
  projectSkillBenchmarkLegacyView,
  reduceSkillBenchmarkVerifiedEvent,
  verifySkillBenchmarkReducerSurface,
} from '../../lib/skill-benchmark-reducers/index.js';
import {
  SKILL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
  createSkillBenchmarkEventRegistry,
  prepareSkillBenchmarkEvent,
} from '../../lib/skill-benchmark-ledger-schema/index.js';
import {
  canonicalBytes,
  canonicalJson,
  readEvent,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';

import type {
  LedgerRecordFrame,
  VerifiedLedgerEvent,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepImprovementCommonEventStem,
  DeepImprovementCommonPayloadMap,
  DeepImprovementCommonScopeMap,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import type {
  SkillBenchmarkEventEnvelope,
  SkillBenchmarkLedgerEvent,
  SkillBenchmarkPayloadMap,
  SkillBenchmarkScopeMap,
  SkillBenchmarkSpecificEventStem,
} from '../../lib/skill-benchmark-ledger-schema/index.js';
import type {
  SkillBenchmarkProjectedResult,
} from '../../lib/skill-benchmark-reducers/index.js';

const TIMESTAMP = '2026-07-23T10:00:00.000Z';
const RUN_ID = 'run-1';
const LINEAGE_ID = 'lineage-1';
const COMMON_STREAM_ID = 'a-common-run-1';
const SKILL_STREAM_ID = 'b-skill-run-1';
const ZERO_DIGEST = '0'.repeat(64);
const registry = createSkillBenchmarkEventRegistry();

interface FixtureOptions {
  readonly compatibilityStatus?: 'compatible' | 'incompatible';
  readonly phantomScoreOutcome?: boolean;
  readonly aggregateScore?: number;
}

interface ScenarioIdentity {
  readonly scenarioId: string;
  readonly assignmentId: string;
  readonly executionId: string;
  readonly observationId: string;
}

const DEFAULT_SCENARIO_IDENTITY: ScenarioIdentity = {
  scenarioId: 'scenario-1',
  assignmentId: 'assignment-1',
  executionId: 'execution-1',
  observationId: 'observation-1',
};

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function eventHash(event: SkillBenchmarkLedgerEvent): string {
  return sha256Bytes(canonicalBytes(event));
}

function replayMetadata() {
  return {
    fingerprint_version: 1,
    final_digest: digest('skill-benchmark-replay'),
    replay_input_digests: {
      configuration: digest('configuration'),
      evaluator: digest('evaluator'),
    },
  } as const;
}

function commonScope<TStem extends DeepImprovementCommonEventStem>(
  stem: TStem,
): DeepImprovementCommonScopeMap[TStem] {
  const base = {
    runId: RUN_ID,
    lineageId: LINEAGE_ID,
    variant: 'skill-benchmark' as const,
  };
  const candidate = { ...base, candidateId: 'candidate-1' };
  if (stem === 'deep_improvement_common.evaluation_observation_recorded') {
    return {
      ...candidate,
      evaluationEpochId: 'evaluation-epoch-1',
      fixtureId: 'fixture-1',
      observationId: 'common-observation-1',
    } as DeepImprovementCommonScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.evaluation_')) {
    return {
      ...candidate,
      evaluationEpochId: 'evaluation-epoch-1',
    } as DeepImprovementCommonScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.candidate_')) {
    return candidate as DeepImprovementCommonScopeMap[TStem];
  }
  return base as DeepImprovementCommonScopeMap[TStem];
}

function skillScope<TStem extends SkillBenchmarkSpecificEventStem>(
  stem: TStem,
  identity: ScenarioIdentity = DEFAULT_SCENARIO_IDENTITY,
): SkillBenchmarkScopeMap[TStem] {
  const base = {
    runId: RUN_ID,
    lineageId: LINEAGE_ID,
    variant: 'skill-benchmark' as const,
  };
  const design = { ...base, benchmarkDesignId: 'design-1' };
  const treatment = {
    ...design,
    scenarioId: identity.scenarioId,
    assignmentId: identity.assignmentId,
  };
  const scenario = { ...treatment, executionId: identity.executionId };
  if (stem.startsWith('skill_benchmark.effect_certificate_')) {
    return { ...base, certificateId: 'certificate-1' } as SkillBenchmarkScopeMap[TStem];
  }
  if (stem === 'skill_benchmark.run_planned'
    || stem === 'skill_benchmark.run_closed') {
    return design as SkillBenchmarkScopeMap[TStem];
  }
  if (stem === 'skill_benchmark.treatment_assigned') {
    return treatment as SkillBenchmarkScopeMap[TStem];
  }
  if (stem === 'skill_benchmark.resource_exposed') {
    return {
      ...scenario,
      skillBundleId: 'skill-bundle-1',
      resourceId: 'resource-1',
    } as SkillBenchmarkScopeMap[TStem];
  }
  if (stem.startsWith('skill_benchmark.skill_')) {
    return {
      ...scenario,
      skillBundleId: 'skill-bundle-1',
    } as SkillBenchmarkScopeMap[TStem];
  }
  if (stem === 'skill_benchmark.milestone_observed') {
    return { ...scenario, milestoneId: 'milestone-1' } as SkillBenchmarkScopeMap[TStem];
  }
  if ([
    'skill_benchmark.outcome_recorded',
    'skill_benchmark.score_observed',
    'skill_benchmark.gold_integrity_recorded',
    'skill_benchmark.compatibility_observed',
    'skill_benchmark.negative_transfer_observed',
    'skill_benchmark.security_probe_recorded',
  ].includes(stem)) {
    return {
      ...scenario,
      observationId: identity.observationId,
    } as SkillBenchmarkScopeMap[TStem];
  }
  return scenario as SkillBenchmarkScopeMap[TStem];
}

function createCommonEvent<TStem extends DeepImprovementCommonEventStem>(
  stem: TStem,
  sequence: number,
  data: DeepImprovementCommonPayloadMap[TStem],
  previous: SkillBenchmarkLedgerEvent | null,
  eventId = `common-${String(sequence).padStart(3, '0')}`,
): SkillBenchmarkEventEnvelope<TStem> {
  const prepared = prepareSkillBenchmarkEvent({
    stem,
    scope: commonScope(stem),
    prevEventHash: previous === null ? ZERO_DIGEST : eventHash(previous),
    replay: replayMetadata(),
    data,
    eventId,
    streamId: COMMON_STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'skill-benchmark-reducer-fixture', version: '1' },
    authorityEpoch: 1,
    correlationId: RUN_ID,
    causationId: previous?.event_id ?? null,
    idempotencyKey: `common:${eventId}`,
  }, registry);
  return prepared.envelope as SkillBenchmarkEventEnvelope<TStem>;
}

function createSkillEvent<TStem extends SkillBenchmarkSpecificEventStem>(
  stem: TStem,
  sequence: number,
  data: SkillBenchmarkPayloadMap[TStem],
  previous: SkillBenchmarkLedgerEvent | null,
  eventId = `skill-${String(sequence).padStart(3, '0')}`,
  identity: ScenarioIdentity = DEFAULT_SCENARIO_IDENTITY,
): SkillBenchmarkEventEnvelope<TStem> {
  const prepared = prepareSkillBenchmarkEvent({
    stem,
    scope: skillScope(stem, identity),
    prevEventHash: previous === null ? ZERO_DIGEST : eventHash(previous),
    replay: replayMetadata(),
    data,
    eventId,
    streamId: SKILL_STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'skill-benchmark-reducer-fixture', version: '1' },
    authorityEpoch: 1,
    correlationId: RUN_ID,
    causationId: previous?.event_id ?? null,
    idempotencyKey: `skill:${eventId}`,
  }, registry);
  return prepared.envelope as SkillBenchmarkEventEnvelope<TStem>;
}

function appendCommon<TStem extends DeepImprovementCommonEventStem>(
  events: SkillBenchmarkLedgerEvent[],
  stem: TStem,
  data: DeepImprovementCommonPayloadMap[TStem],
): SkillBenchmarkEventEnvelope<TStem> {
  const event = createCommonEvent(
    stem,
    events.length + 1,
    data,
    events.at(-1) ?? null,
  );
  events.push(event);
  return event;
}

function appendSkill<TStem extends SkillBenchmarkSpecificEventStem>(
  events: SkillBenchmarkLedgerEvent[],
  stem: TStem,
  data: SkillBenchmarkPayloadMap[TStem],
  identity: ScenarioIdentity = DEFAULT_SCENARIO_IDENTITY,
): SkillBenchmarkEventEnvelope<TStem> {
  const event = createSkillEvent(
    stem,
    events.length + 1,
    data,
    events.at(-1) ?? null,
    undefined,
    identity,
  );
  events.push(event);
  return event;
}

function commonEvents(aggregateScore: number): SkillBenchmarkLedgerEvent[] {
  const events: SkillBenchmarkLedgerEvent[] = [];
  appendCommon(events, 'deep_improvement_common.run_started', {
    generation: 1,
    charterDigest: digest('charter'),
    configDigest: digest('config'),
    operatorRef: 'operator:skill-benchmark',
    serviceContractVersion: 'deep-improvement-common@1',
    replayFingerprint: digest('run-replay'),
    maxIterations: 4,
  });
  const proposal = appendCommon(
    events,
    'deep_improvement_common.candidate_proposed',
    {
      proposalRef: 'proposal:candidate-1',
      proposalDigest: digest('proposal'),
      mutationOperatorRef: 'operator:skill-rewrite',
      mutationOperatorVersion: 'skill-rewrite@1',
      parentCandidateId: null,
      targetRef: 'target:skill-1',
      targetDigest: digest('target'),
      proposalPolicyVersion: 'proposal-policy@1',
    },
  );
  appendCommon(events, 'deep_improvement_common.candidate_generated', {
    proposalEventId: proposal.event_id,
    proposalPayloadDigest: proposal.payload.payloadDigest,
    candidateArtifactRef: 'artifact:candidate-1',
    candidateArtifactDigest: digest('candidate'),
    generationReceiptRef: 'receipt:generation-1',
    mutationOperatorRef: 'operator:skill-rewrite',
    mutationOperatorVersion: 'skill-rewrite@1',
  });
  const epoch = appendCommon(
    events,
    'deep_improvement_common.evaluation_epoch_sealed',
    {
      evaluatorRef: 'evaluator:independent-1',
      evaluatorCapsuleDigest: digest('evaluator-capsule'),
      fixtureSetRef: 'fixture-set:heldout-1',
      fixtureSetDigest: digest('fixture-set'),
      scorePolicyVersion: 'score-policy@1',
      scoreWriteBackendRef: SKILL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
      evaluationBudgetRef: 'budget:evaluation-1',
    },
  );
  const started = appendCommon(
    events,
    'deep_improvement_common.evaluation_started',
    {
      epochSealedEventId: epoch.event_id,
      epochPayloadDigest: epoch.payload.payloadDigest,
      executionReceiptRef: 'receipt:evaluation-start-1',
      fixtureCount: 1,
      evaluatorFingerprint: digest('evaluator-fingerprint'),
    },
  );
  const observation = appendCommon(
    events,
    'deep_improvement_common.evaluation_observation_recorded',
    {
      evaluationStartedEventId: started.event_id,
      evaluatorRef: 'evaluator:independent-1',
      fixtureRef: 'fixture:heldout-1',
      rawObservationRef: 'observation:common-raw-1',
      rawObservationDigest: digest('common-raw-observation'),
      executionReceiptRef: 'receipt:common-observation-1',
      observationOutcome: 'pass',
    },
  );
  appendCommon(events, 'deep_improvement_common.evaluation_normalized', {
    observationEventIds: [observation.event_id],
    observationSetDigest: digest('common-observation-set'),
    scorePolicyVersion: 'score-policy@1',
    scorerFingerprint: digest('scorer'),
    scoreWriteBackendRef: SKILL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
    scoreVector: {
      components: [{
        dimensionCode: 'quality',
        rawScore: aggregateScore,
        normalizedScore: aggregateScore,
        weight: 1,
      }],
      aggregateScore,
      uncertainty: 0.05,
    },
    normalizationReceiptRef: 'receipt:normalization-1',
  });
  return events;
}

function skillEvents(options: FixtureOptions): SkillBenchmarkLedgerEvent[] {
  const events: SkillBenchmarkLedgerEvent[] = [];
  const planned = appendSkill(events, 'skill_benchmark.run_planned', {
    designRef: 'design:benchmark-1',
    designDigest: digest('design'),
    taskSetRef: 'task-set:paired-1',
    taskSetDigest: digest('task-set'),
    skillBundleRef: 'skill-bundle:1',
    skillBundleDigest: digest('skill-bundle'),
    registryDigest: digest('registry'),
    executorDescriptorRef: 'executor:descriptor-1',
    executorDescriptorDigest: digest('executor'),
    environmentDigest: digest('environment'),
    dependencyDigest: digest('dependency'),
    workloadDigest: digest('workload'),
    randomizationSeed: 42,
    replicateCount: 1,
    designPolicyVersion: 'benchmark-design@1',
  });
  const assigned = appendSkill(events, 'skill_benchmark.treatment_assigned', {
    designEventId: planned.event_id,
    designPayloadDigest: planned.payload.payloadDigest,
    treatmentArm: 'auto-route',
    randomizationSeed: 42,
    propensity: 0.5,
    replicateIndex: 1,
    pairedReplicateId: 'pair-1',
    designCellId: 'cell-auto-route-1',
    taskRef: 'task:scenario-1',
    taskDigest: digest('task'),
    skillBundleRef: 'skill-bundle:1',
    skillBundleDigest: digest('skill-bundle'),
    executorDescriptorRef: 'executor:descriptor-1',
    executorDescriptorDigest: digest('executor'),
    environmentDigest: digest('environment'),
    assignmentReceiptRef: 'receipt:assignment-1',
  });
  const started = appendSkill(events, 'skill_benchmark.scenario_started', {
    assignmentEventId: assigned.event_id,
    assignmentPayloadDigest: assigned.payload.payloadDigest,
    taskRef: 'task:scenario-1',
    taskDigest: digest('task'),
    environmentRef: 'environment:snapshot-1',
    environmentDigest: digest('environment'),
    executorDescriptorRef: 'executor:descriptor-1',
    executorDescriptorDigest: digest('executor'),
    toolDigest: digest('tool'),
    permissionDigest: digest('permission'),
    dependencyDigest: digest('dependency'),
    workloadDigest: digest('workload'),
    executionReceiptRef: 'receipt:execution-start-1',
    startedAt: TIMESTAMP,
  });
  const discovered = appendSkill(events, 'skill_benchmark.skill_discovered', {
    scenarioStartedEventId: started.event_id,
    skillBundleRef: 'skill-bundle:1',
    skillBundleDigest: digest('skill-bundle'),
    registryDigest: digest('registry'),
    discoveryMethod: 'auto-route',
    availabilityStatus: 'available',
    discoveryEvidenceRef: 'evidence:discovery-1',
    discoveryEvidenceDigest: digest('discovery'),
  });
  const loaded = appendSkill(events, 'skill_benchmark.skill_loaded', {
    discoveredEventId: discovered.event_id,
    discoveredPayloadDigest: discovered.payload.payloadDigest,
    disclosureStage: 'instructions',
    skillBundleRef: 'skill-bundle:1',
    skillBundleDigest: digest('skill-bundle'),
    loadedResourceClasses: ['instructions'],
    loaderReceiptRef: 'receipt:loader-1',
    loadStatus: 'loaded',
  });
  appendSkill(events, 'skill_benchmark.skill_invoked', {
    loadedEventId: loaded.event_id,
    loadedPayloadDigest: loaded.payload.payloadDigest,
    invocationMode: 'auto',
    activationRef: 'activation:skill-1',
    activationDigest: digest('activation'),
    invocationReceiptRef: 'receipt:invocation-1',
    invocationStatus: 'invoked',
    failureReasonCode: null,
  });
  const milestone = appendSkill(events, 'skill_benchmark.milestone_observed', {
    scenarioStartedEventId: started.event_id,
    milestoneCode: 'validated-output',
    ordinal: 1,
    milestoneState: 'reached',
    observationRef: 'observation:milestone-1',
    observationDigest: digest('milestone'),
    complianceStatus: 'compliant',
  });
  appendSkill(events, 'skill_benchmark.trajectory_recorded', {
    scenarioStartedEventId: started.event_id,
    milestoneEventIds: [milestone.event_id],
    orderedKeyPointCodes: ['discover', 'load', 'invoke', 'validate'],
    intermediateStateDigest: digest('intermediate'),
    traceRef: 'trace:trajectory-1',
    traceDigest: digest('trajectory'),
    complianceObservationRef: 'observation:compliance-1',
    complianceObservationDigest: digest('compliance'),
  });
  const finished = appendSkill(events, 'skill_benchmark.scenario_finished', {
    startedEventId: started.event_id,
    startedPayloadDigest: started.payload.payloadDigest,
    outcomeRef: 'outcome:scenario-1',
    outcomeDigest: digest('scenario-outcome'),
    finalStateDigest: digest('final-state'),
    executionReceiptRef: 'receipt:execution-finish-1',
    terminalOutcome: 'pass',
    finishedAt: TIMESTAMP,
  });
  const outcome = appendSkill(events, 'skill_benchmark.outcome_recorded', {
    scenarioTerminalEventId: finished.event_id,
    finalStateRef: 'state:final-1',
    finalStateDigest: digest('final-state'),
    deterministicCheckSetRef: 'checks:deterministic-1',
    deterministicCheckSetDigest: digest('deterministic-checks'),
    dynamicReferenceSetRef: 'checks:dynamic-1',
    dynamicReferenceSetDigest: digest('dynamic-checks'),
    constraintCoverageRef: 'coverage:constraints-1',
    constraintCoverageDigest: digest('constraint-coverage'),
    outcomeStatus: 'pass',
  });
  const gold = appendSkill(events, 'skill_benchmark.gold_integrity_recorded', {
    goldRef: 'gold:scenario-1',
    goldDigest: digest('gold'),
    goldPolicy: 'scored',
    provenanceRef: 'provenance:gold-1',
    provenanceDigest: digest('gold-provenance'),
    coverageRatio: 1,
    integrityStatus: 'accepted',
    reasonCode: 'gold-verified',
    evaluatorRef: 'evaluator:gold-integrity-1',
    evaluatorFingerprint: digest('gold-evaluator'),
  });
  appendSkill(events, 'skill_benchmark.score_observed', {
    outcomeEventId: options.phantomScoreOutcome ? 'outcome-phantom' : outcome.event_id,
    evaluatorRef: 'evaluator:skill-benchmark-1',
    evaluatorVersion: 'evaluator@1',
    evaluatorFingerprint: digest('skill-evaluator'),
    deterministicResultsRef: 'results:deterministic-1',
    deterministicResultsDigest: digest('deterministic-results'),
    dynamicReferenceResultsRef: 'results:dynamic-1',
    dynamicReferenceResultsDigest: digest('dynamic-results'),
    rawScoreAxes: [{
      dimensionCode: 'correctness',
      rawScore: 0.8,
      measurementRef: 'measurement:correctness-1',
      measurementDigest: digest('raw-correctness'),
    }],
    constraintCoverageRef: 'coverage:constraints-1',
    constraintCoverageDigest: digest('constraint-coverage'),
    tokenCount: 500,
    latencyMs: 1_200,
    costMicrounits: 25,
    workloadDigest: digest('workload'),
    goldIntegrityEventId: gold.event_id,
    goldIntegrityPayloadDigest: gold.payload.payloadDigest,
    goldPolicy: 'scored',
    numeratorEligible: true,
    scoreWriteBackendRef: SKILL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
  });
  appendSkill(events, 'skill_benchmark.compatibility_observed', {
    scenarioStartedEventId: started.event_id,
    taskDigest: digest('task'),
    skillBundleDigest: digest('skill-bundle'),
    registryDigest: digest('registry'),
    executorDigest: digest('executor'),
    toolDigest: digest('tool'),
    permissionDigest: digest('permission'),
    environmentDigest: digest('environment'),
    dependencyDigest: digest('dependency'),
    workloadDigest: digest('workload'),
    compatibilityStatus: options.compatibilityStatus ?? 'compatible',
    evidenceRef: 'evidence:compatibility-1',
    evidenceDigest: digest('compatibility'),
  });
  appendSkill(events, 'skill_benchmark.run_closed', {
    designEventId: planned.event_id,
    scenarioTerminalEventIds: [finished.event_id],
    terminalStatus: 'closed',
    accountingRef: 'accounting:run-1',
    accountingDigest: digest('accounting'),
    closedAt: TIMESTAMP,
  });
  return events;
}

function appendReferenceScenario(
  events: SkillBenchmarkLedgerEvent[],
  planned: SkillBenchmarkEventEnvelope<'skill_benchmark.run_planned'>,
  identity: ScenarioIdentity,
  label: string,
) {
  const assigned = appendSkill(events, 'skill_benchmark.treatment_assigned', {
    designEventId: planned.event_id,
    designPayloadDigest: planned.payload.payloadDigest,
    treatmentArm: label === 'a' ? 'control' : 'auto-route',
    randomizationSeed: 42,
    propensity: 0.5,
    replicateIndex: label === 'a' ? 1 : 2,
    pairedReplicateId: 'pair-cross-scenario',
    designCellId: `cell-${label}`,
    taskRef: `task:scenario-${label}`,
    taskDigest: digest(`task-${label}`),
    skillBundleRef: 'skill-bundle:1',
    skillBundleDigest: digest('skill-bundle'),
    executorDescriptorRef: 'executor:descriptor-1',
    executorDescriptorDigest: digest('executor'),
    environmentDigest: digest('environment'),
    assignmentReceiptRef: `receipt:assignment-${label}`,
  }, identity);
  const started = appendSkill(events, 'skill_benchmark.scenario_started', {
    assignmentEventId: assigned.event_id,
    assignmentPayloadDigest: assigned.payload.payloadDigest,
    taskRef: `task:scenario-${label}`,
    taskDigest: digest(`task-${label}`),
    environmentRef: 'environment:snapshot-1',
    environmentDigest: digest('environment'),
    executorDescriptorRef: 'executor:descriptor-1',
    executorDescriptorDigest: digest('executor'),
    toolDigest: digest('tool'),
    permissionDigest: digest('permission'),
    dependencyDigest: digest('dependency'),
    workloadDigest: digest('workload'),
    executionReceiptRef: `receipt:execution-start-${label}`,
    startedAt: TIMESTAMP,
  }, identity);
  const finished = appendSkill(events, 'skill_benchmark.scenario_finished', {
    startedEventId: started.event_id,
    startedPayloadDigest: started.payload.payloadDigest,
    outcomeRef: `outcome:scenario-${label}`,
    outcomeDigest: digest(`scenario-outcome-${label}`),
    finalStateDigest: digest(`final-state-${label}`),
    executionReceiptRef: `receipt:execution-finish-${label}`,
    terminalOutcome: 'pass',
    finishedAt: TIMESTAMP,
  }, identity);
  const outcome = appendSkill(events, 'skill_benchmark.outcome_recorded', {
    scenarioTerminalEventId: finished.event_id,
    finalStateRef: `state:final-${label}`,
    finalStateDigest: digest(`final-state-${label}`),
    deterministicCheckSetRef: `checks:deterministic-${label}`,
    deterministicCheckSetDigest: digest(`deterministic-checks-${label}`),
    dynamicReferenceSetRef: `checks:dynamic-${label}`,
    dynamicReferenceSetDigest: digest(`dynamic-checks-${label}`),
    constraintCoverageRef: `coverage:constraints-${label}`,
    constraintCoverageDigest: digest(`constraint-coverage-${label}`),
    outcomeStatus: 'pass',
  }, identity);
  const gold = appendSkill(events, 'skill_benchmark.gold_integrity_recorded', {
    goldRef: `gold:scenario-${label}`,
    goldDigest: digest(`gold-${label}`),
    goldPolicy: 'scored',
    provenanceRef: `provenance:gold-${label}`,
    provenanceDigest: digest(`gold-provenance-${label}`),
    coverageRatio: 1,
    integrityStatus: 'accepted',
    reasonCode: 'gold-verified',
    evaluatorRef: 'evaluator:gold-integrity-1',
    evaluatorFingerprint: digest('gold-evaluator'),
  }, identity);
  return { outcome, gold };
}

function twoScenarioReferenceFixture(
  useCrossScenarioReferences: boolean,
): SkillBenchmarkLedgerEvent[] {
  const events: SkillBenchmarkLedgerEvent[] = [];
  const planned = appendSkill(events, 'skill_benchmark.run_planned', {
    designRef: 'design:benchmark-1',
    designDigest: digest('design'),
    taskSetRef: 'task-set:paired-1',
    taskSetDigest: digest('task-set'),
    skillBundleRef: 'skill-bundle:1',
    skillBundleDigest: digest('skill-bundle'),
    registryDigest: digest('registry'),
    executorDescriptorRef: 'executor:descriptor-1',
    executorDescriptorDigest: digest('executor'),
    environmentDigest: digest('environment'),
    dependencyDigest: digest('dependency'),
    workloadDigest: digest('workload'),
    randomizationSeed: 42,
    replicateCount: 2,
    designPolicyVersion: 'benchmark-design@1',
  });
  const scenarioA = appendReferenceScenario(events, planned, {
    scenarioId: 'scenario-a',
    assignmentId: 'assignment-a',
    executionId: 'execution-a',
    observationId: 'observation-a',
  }, 'a');
  const scenarioBIdentity: ScenarioIdentity = {
    scenarioId: 'scenario-b',
    assignmentId: 'assignment-b',
    executionId: 'execution-b',
    observationId: 'observation-b',
  };
  const scenarioB = appendReferenceScenario(
    events,
    planned,
    scenarioBIdentity,
    'b',
  );
  const referenced = useCrossScenarioReferences ? scenarioA : scenarioB;
  appendSkill(events, 'skill_benchmark.score_observed', {
    outcomeEventId: referenced.outcome.event_id,
    evaluatorRef: 'evaluator:skill-benchmark-1',
    evaluatorVersion: 'evaluator@1',
    evaluatorFingerprint: digest('skill-evaluator'),
    deterministicResultsRef: 'results:deterministic-b',
    deterministicResultsDigest: digest('deterministic-results-b'),
    dynamicReferenceResultsRef: 'results:dynamic-b',
    dynamicReferenceResultsDigest: digest('dynamic-results-b'),
    rawScoreAxes: [{
      dimensionCode: 'correctness',
      rawScore: 0.8,
      measurementRef: 'measurement:correctness-b',
      measurementDigest: digest('raw-correctness-b'),
    }],
    constraintCoverageRef: 'coverage:constraints-b',
    constraintCoverageDigest: digest('constraint-coverage-b'),
    tokenCount: 500,
    latencyMs: 1_200,
    costMicrounits: 25,
    workloadDigest: digest('workload'),
    goldIntegrityEventId: referenced.gold.event_id,
    goldIntegrityPayloadDigest: referenced.gold.payload.payloadDigest,
    goldPolicy: 'scored',
    numeratorEligible: true,
    scoreWriteBackendRef: SKILL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
  }, scenarioBIdentity);
  return [...commonEvents(0.91), ...events];
}

function fixture(options: FixtureOptions = {}): SkillBenchmarkLedgerEvent[] {
  return [
    ...commonEvents(options.aggregateScore ?? 0.91),
    ...skillEvents(options),
  ];
}

function projected(
  events: readonly SkillBenchmarkLedgerEvent[],
): SkillBenchmarkProjectedResult {
  const result = foldSkillBenchmarkEvents(events);
  expect(result.outcome).toBe('projected');
  if (result.outcome !== 'projected') throw new Error('Expected projected result');
  return result;
}

function verifiedEvent(event: SkillBenchmarkLedgerEvent): VerifiedLedgerEvent {
  const read = readEvent(canonicalBytes(event), registry);
  const hash = digest(`frame:${event.event_id}`);
  const frame: LedgerRecordFrame = {
    frame_version: 1,
    ledger_id: 'skill-benchmark-shadow',
    sequence: event.stream_sequence,
    prev_record_hash: digest(`previous:${event.stream_sequence}`),
    canonical_event_hash: read.effective.canonicalDigest,
    authorization_ref: {
      audit_ledger_id: 'skill-benchmark-shadow-authorization',
      audit_sequence: event.stream_sequence,
      audit_record_hash: hash,
      decision_id: `decision-${event.event_id}`,
      decision_digest: hash,
      request_digest: hash,
      policy_digest: hash,
      authority_epoch: 1,
    },
    receipt: {
      ledger_id: 'skill-benchmark-shadow',
      sequence: event.stream_sequence,
      event_id: event.event_id,
      event_type: event.event_type,
      event_version: event.event_version,
      stream_id: event.stream_id,
      stream_sequence: event.stream_sequence,
      committed_at: TIMESTAMP,
    },
    canonical_event_bytes: Buffer.from(read.effective.canonicalBytes).toString('base64'),
    record_hash: hash,
  };
  return Object.freeze({ frame: Object.freeze(frame), event: read });
}

describe('skill-benchmark reducers', () => {
  it('is deterministic and deeply immutable across repeated full folds', () => {
    const events = fixture();
    const first = projected(events);
    const second = projected(events);

    expect(canonicalJson(first)).toBe(canonicalJson(second));
    expect(first.integrityDigest).toBe(second.integrityDigest);
    expect(isDeepFrozenProjection(first)).toBe(true);
    expect(() => {
      Object.assign(first.projection.modeStatus, { state: 'blocked' });
    }).toThrow(TypeError);
  });

  it('canonicalizes caller input order to byte-identical projections', () => {
    const events = fixture();
    const ordered = projected(events);
    const reversed = projected([...events].reverse());

    expect(canonicalJson(reversed)).toBe(canonicalJson(ordered));
    expect(reversed.integrityDigest).toBe(ordered.integrityDigest);
  });

  it('blocks a gap against its stream own tail', () => {
    const events = fixture();
    const missingSkillSequenceTwo = events.filter(
      (event) => !(event.stream_id === SKILL_STREAM_ID
        && event.stream_sequence === 2),
    );
    expect(foldSkillBenchmarkEvents(missingSkillSequenceTwo)).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['cursor-gap'],
    });
  });

  it('returns event-order-invalid for a distinct event behind its stream tail', () => {
    const events = fixture();
    const initial = projected(events.filter(
      (event) => event.stream_sequence === 1,
    ));
    const duplicateSequence = createSkillEvent(
      'skill_benchmark.run_planned',
      1,
      skillEvents({})[0].payload.data,
      null,
      'skill-conflicting-sequence',
    );
    expect(foldSkillBenchmarkEvents([duplicateSequence], {
      checkpoint: initial.checkpoint,
    })).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['event-order-invalid'],
    });
  });

  it('raises duplicate-event-conflict for one event id with different bytes', () => {
    const planned = skillEvents({})[0] as
      SkillBenchmarkEventEnvelope<'skill_benchmark.run_planned'>;
    const conflicting = createSkillEvent(
      'skill_benchmark.run_planned',
      planned.stream_sequence,
      {
        ...planned.payload.data,
        designRef: 'design:benchmark-conflict',
        designDigest: digest('design-conflict'),
      },
      null,
      planned.event_id,
    );

    expect(() => foldSkillBenchmarkEvents([planned, conflicting])).toThrowError(
      expect.objectContaining({
        code: 'duplicate-event-conflict',
        field: 'seenEvents',
      }),
    );
  });

  it('rejects a raw score whose outcome producer was never folded', () => {
    expect(() => foldSkillBenchmarkEvents(fixture({
      phantomScoreOutcome: true,
    }))).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'payload.data',
    }));
  });

  it('rejects score references owned by a different scenario', () => {
    expect(() => foldSkillBenchmarkEvents(
      twoScenarioReferenceFixture(true),
    )).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'payload.data',
    }));
  });

  it('accepts score references owned by the same scenario', () => {
    const result = projected(twoScenarioReferenceFixture(false));
    expect(result.projection.artifactIndex.rawMeasurements).toEqual([
      expect.objectContaining({
        scenarioId: 'scenario-b',
        assignmentId: 'assignment-b',
        executionId: 'execution-b',
        observationId: 'observation-b',
      }),
    ]);
  });

  it.each([
    {
      label: 'schema',
      options: { expectedSchemaVersion: 'skill-benchmark-projection@future' },
      reasonCode: 'projection-schema-mismatch',
    },
    {
      label: 'reducer',
      options: { expectedReducerVersion: 'skill-benchmark-reducer@future' },
      reasonCode: 'reducer-version-mismatch',
    },
    {
      label: 'codec',
      options: { expectedCodecVersion: 'canonical-json@future' },
      reasonCode: 'codec-version-mismatch',
    },
    {
      label: 'ordering policy',
      options: { expectedOrderingPolicyVersion: 'per-stream-logical-order@future' },
      reasonCode: 'ordering-policy-mismatch',
    },
  ])('blocks a mismatched $label version', ({ options, reasonCode }) => {
    expect(foldSkillBenchmarkEvents(fixture(), options)).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: [reasonCode],
    });
  });

  it('folds an exact duplicate event idempotently', () => {
    const events = fixture();
    const withoutDuplicate = projected(events);
    const withDuplicate = projected([...events, events.at(-1)!]);

    expect(canonicalJson(withDuplicate)).toBe(canonicalJson(withoutDuplicate));
  });

  it('rejects a checkpoint with a forged per-stream tail', () => {
    const result = projected(fixture());
    const forged = {
      ...result.checkpoint,
      sourceTails: result.checkpoint.sourceTails.map((tail) => (
        tail.streamId === SKILL_STREAM_ID
          ? { ...tail, sequence: tail.sequence + 1 }
          : tail
      )),
    };

    expect(foldSkillBenchmarkEvents([], { checkpoint: forged })).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['checkpoint-digest-mismatch'],
    });
  });

  it('fails closed on an unknown Skill Benchmark extension event', () => {
    const known = skillEvents({})[0];
    const unknown = {
      ...known,
      event_type: 'skill-benchmark.ledger.future-event',
      payload: {
        ...known.payload,
        stem: 'skill_benchmark.future_event',
      },
    } as unknown as SkillBenchmarkLedgerEvent;

    expect(() => foldSkillBenchmarkEvents([unknown])).toThrowError(
      expect.objectContaining({
        code: 'event-schema-invalid',
        field: 'event',
      }),
    );
  });

  it('keeps raw measurements distinct from normalized rankings', () => {
    const result = projected(fixture());
    const raw = result.projection.artifactIndex.rawMeasurements[0];
    const ranking = result.projection.artifactIndex.derivedRankings[0];

    expect(raw).toMatchObject({
      rawScoreAxes: [{ dimensionCode: 'correctness', rawScore: 0.8 }],
      scoreWriteBackendRef: 'backend:deep-improvement-score',
      numeratorEligible: true,
    });
    expect(raw).not.toHaveProperty('aggregateScore');
    expect(raw).not.toHaveProperty('rank');
    expect(ranking).toMatchObject({
      normalizedScoreEventId: 'common-007',
      aggregateScore: 0.91,
      rank: 1,
      eligible: true,
    });
    expect(result.projection.iterationConvergence).toMatchObject({
      collectionComplete: true,
      scoringComplete: true,
      certificateReady: true,
    });
  });

  it('keeps a hard veto authoritative over a perfect weighted aggregate', () => {
    const result = projected(fixture({
      compatibilityStatus: 'incompatible',
      aggregateScore: 1,
    }));
    const ranking = result.projection.artifactIndex.derivedRankings[0];

    expect(ranking).toMatchObject({
      aggregateScore: 1,
      eligible: false,
      rank: null,
      blockingVetoCodes: ['compatibility-incompatible'],
    });
    expect(result.projection.modeStatus).toMatchObject({
      state: 'blocked',
      scoringState: 'blocked',
      compatibilityState: 'incompatible',
    });
    expect(result.projection.iterationConvergence.certificateReady).toBe(false);
  });

  it('matches the mode-contract reducer surface to the full fold oracle', () => {
    const commonStarted = commonEvents(0.91)[0];
    const verified = verifiedEvent(commonStarted);
    const initial = createSkillBenchmarkProjectionState();

    verifySkillBenchmarkReducerSurface(
      SKILL_BENCHMARK_REDUCER_SURFACE,
      verified,
      initial,
    );
    const reduced = reduceSkillBenchmarkVerifiedEvent(
      verified,
      initial as Parameters<typeof reduceSkillBenchmarkVerifiedEvent>[1],
    );
    const oracle = projected([commonStarted]);

    expect(canonicalJson(reduced.state)).toBe(canonicalJson(oracle.projection));
    expect(reduced.reducerId).toBe('skill-benchmark:projection-fold');
  });

  it('projects the complete frozen shadow-only legacy comparison shape', () => {
    const legacy = projectSkillBenchmarkLegacyView(projected(fixture()).projection);
    const expectedKeys = [
      'authority',
      'blockerCodes',
      'certificateReady',
      'certificateState',
      'collectionComplete',
      'common',
      'legacyAuthority',
      'modeState',
      'rankings',
      'rawMeasurementCount',
      'runState',
      'scenarioCount',
      'scoringComplete',
      'scoringState',
    ].sort();

    expect(Object.keys(legacy).sort()).toEqual(expectedKeys);
    expect(legacy).toMatchObject({
      authority: 'shadow-only',
      legacyAuthority: 'unchanged',
      scenarioCount: 1,
      rawMeasurementCount: 1,
    });
    expect(isDeepFrozenProjection(legacy)).toBe(true);
  });
});
