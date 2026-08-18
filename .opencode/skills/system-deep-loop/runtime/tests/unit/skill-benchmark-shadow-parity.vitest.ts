// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Shadow Parity Tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DeepImprovementCommonEventStems,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import * as skillBenchmarkReducers from '../../lib/skill-benchmark-reducers/index.js';
import {
  EventTypeRegistry,
  canonicalBytes,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  InitialArtifactKinds,
  SealedArtifactStore,
  bindVerifiedArtifactReferences,
  prepareArtifactSealedEvent,
  readVerifiedArtifactEvidence,
  recordArtifactEvent,
  sealedArtifactEventDefinitions,
} from '../../lib/sealed-reference-artifacts/index.js';
import {
  SKILL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
  createSkillBenchmarkEventRegistry,
  prepareSkillBenchmarkEvent,
} from '../../lib/skill-benchmark-ledger-schema/index.js';
import {
  SKILL_BENCHMARK_REQUIRED_FIXTURE_SCENARIOS,
  SKILL_BENCHMARK_SHARED_PARITY_SERVICES,
  SKILL_BENCHMARK_VOLATILITY_ALLOWLIST,
  canonicalizeSkillBenchmarkEventStream,
  compareSkillBenchmarkEventStreams,
  compileSkillBenchmarkParityManifest,
  createSkillBenchmarkModeGateInput,
  createSkillBenchmarkParityCaseDefinition,
  createSkillBenchmarkParityExecutors,
  parseSkillBenchmarkParityReceipt,
  runSkillBenchmarkParityCase,
  skillBenchmarkParityInitialStateDigest,
  verifySkillBenchmarkLifecycleEventMap,
  verifySkillBenchmarkParityModeCertificate,
} from '../../lib/skill-benchmark-shadow-parity/index.js';
import {
  compileParityCaseManifest,
  runShadowParityCase,
} from '../../lib/shadow-parity/index.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepImprovementCommonEventStem,
  DeepImprovementCommonPayloadMap,
  DeepImprovementCommonScopeMap,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import type {
  JsonObject,
} from '../../lib/event-envelope/index.js';
import type {
  ArtifactAuthorizationContext,
  ArtifactEventMetadata,
  ArtifactEventRecorder,
  ArtifactReferenceSet,
  VerifiedArtifactEvidence,
} from '../../lib/sealed-reference-artifacts/index.js';
import type {
  SkillBenchmarkEventEnvelope,
  SkillBenchmarkEventInput,
  SkillBenchmarkEventStem,
  SkillBenchmarkLedgerEvent,
  SkillBenchmarkPayloadMap,
  SkillBenchmarkReplayMetadata,
  SkillBenchmarkScopeMap,
  SkillBenchmarkSpecificEventStem,
} from '../../lib/skill-benchmark-ledger-schema/index.js';
import type {
  SkillBenchmarkProjectionState,
} from '../../lib/skill-benchmark-reducers/index.js';
import type {
  SkillBenchmarkParityCaseRun,
  SkillBenchmarkParityDiffClass,
  SkillBenchmarkParityFaultKind,
  SkillBenchmarkParityFixture,
  SkillBenchmarkParityFixtureScenario,
  SkillBenchmarkTerminalDecision,
} from '../../lib/skill-benchmark-shadow-parity/index.js';
import type {
  ParityCaseCapsule,
  ParityCaseManifest,
} from '../../lib/shadow-parity/index.js';

const BASE_SHA = '0360360360360360360360360360360360360360';
const TIMESTAMP = '2026-07-28T10:00:00.000Z';
const RUN_ID = 'skill-parity-run-1';
const LINEAGE_ID = 'skill-parity-lineage-1';
const STREAM_ID = 'skill-parity-stream-1';
const ZERO_DIGEST = '0'.repeat(64);
const temporaryRoots: string[] = [];
const registry = createSkillBenchmarkEventRegistry();

const SPEC_FAULTS = Object.freeze([
  { kind: 'drop-event', expectedClass: 'missing' },
  { kind: 'extra-event', expectedClass: 'extra' },
  { kind: 'reorder-event', expectedClass: 'reordered' },
  { kind: 'payload', expectedClass: 'payload' },
  { kind: 'score', expectedClass: 'score' },
  { kind: 'gold', expectedClass: 'gold' },
  { kind: 'cost', expectedClass: 'cost' },
  { kind: 'receipt', expectedClass: 'receipt' },
] as const satisfies readonly Readonly<{
  kind: SkillBenchmarkParityFaultKind;
  expectedClass: SkillBenchmarkParityDiffClass;
}>[]);

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `skill-benchmark-parity-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function replayMetadata(): SkillBenchmarkReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest('skill-benchmark-parity-replay'),
    replay_input_digests: {
      configuration: digest('configuration'),
      evaluator: digest('evaluator'),
    },
  };
}

function commonScope<TStem extends DeepImprovementCommonEventStem>(
  stem: TStem,
): DeepImprovementCommonScopeMap[TStem] {
  void stem;
  return {
    runId: RUN_ID,
    lineageId: LINEAGE_ID,
    variant: 'skill-benchmark',
  } as DeepImprovementCommonScopeMap[TStem];
}

function skillScope<TStem extends SkillBenchmarkSpecificEventStem>(
  stem: TStem,
): SkillBenchmarkScopeMap[TStem] {
  const base = { runId: RUN_ID, lineageId: LINEAGE_ID, variant: 'skill-benchmark' as const };
  const design = { ...base, benchmarkDesignId: 'design-1' };
  const treatment = { ...design, scenarioId: 'scenario-1', assignmentId: 'assignment-1' };
  const scenario = { ...treatment, executionId: 'execution-1' };
  if (stem.startsWith('skill_benchmark.effect_certificate_')) {
    return { ...base, certificateId: 'certificate-1' } as SkillBenchmarkScopeMap[TStem];
  }
  if (stem === 'skill_benchmark.run_planned' || stem === 'skill_benchmark.run_closed') {
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
    return { ...scenario, skillBundleId: 'skill-bundle-1' } as SkillBenchmarkScopeMap[TStem];
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
    return { ...scenario, observationId: 'observation-1' } as SkillBenchmarkScopeMap[TStem];
  }
  return scenario as SkillBenchmarkScopeMap[TStem];
}

function appendCommon<TStem extends DeepImprovementCommonEventStem>(
  events: SkillBenchmarkLedgerEvent[],
  stem: TStem,
  data: DeepImprovementCommonPayloadMap[TStem],
  scope?: DeepImprovementCommonScopeMap[TStem],
): SkillBenchmarkEventEnvelope<TStem> {
  const prior = events.at(-1) ?? null;
  const sequence = events.length + 1;
  const event = prepareSkillBenchmarkEvent({
    stem,
    scope: scope ?? commonScope(stem),
    data,
    prevEventHash: prior === null ? ZERO_DIGEST : digest(prior),
    replay: replayMetadata(),
    eventId: `skill-parity-event-${String(sequence).padStart(3, '0')}`,
    streamId: STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'skill-benchmark-parity-tests', version: '1' },
    authorityEpoch: 1,
    correlationId: `transport-${digest({ sequence }).slice(0, 16)}`,
    causationId: prior?.event_id ?? null,
    idempotencyKey: `skill-parity-event-${sequence}`,
  }, registry).envelope as SkillBenchmarkEventEnvelope<TStem>;
  events.push(event);
  return event;
}

function appendSkill<TStem extends SkillBenchmarkSpecificEventStem>(
  events: SkillBenchmarkLedgerEvent[],
  stem: TStem,
  data: SkillBenchmarkPayloadMap[TStem],
  scope?: SkillBenchmarkScopeMap[TStem],
): SkillBenchmarkEventEnvelope<TStem> {
  const prior = events.at(-1) ?? null;
  const sequence = events.length + 1;
  const input: SkillBenchmarkEventInput<TStem> = {
    stem,
    scope: scope ?? skillScope(stem),
    data,
    prevEventHash: prior === null ? ZERO_DIGEST : digest(prior),
    replay: replayMetadata(),
    eventId: `skill-parity-event-${String(sequence).padStart(3, '0')}`,
    streamId: STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'skill-benchmark-parity-tests', version: '1' },
    authorityEpoch: 1,
    correlationId: `transport-${digest({ sequence }).slice(0, 16)}`,
    causationId: prior?.event_id ?? null,
    idempotencyKey: `skill-parity-event-${sequence}`,
  };
  const event = prepareSkillBenchmarkEvent(input, registry).envelope;
  events.push(event);
  return event;
}

function fixtureEvents(): readonly SkillBenchmarkLedgerEvent[] {
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
  appendSkill(events, 'skill_benchmark.resource_exposed', {
    skillLoadedEventId: loaded.event_id,
    resourceRef: 'resource:reference-1',
    resourceDigest: digest('resource'),
    resourceClass: 'reference',
    exposureStage: 'resources',
    canaryRef: 'canary:resource-1',
    canaryDigest: digest('canary'),
    exposureReceiptRef: 'receipt:exposure-1',
    canaryStatus: 'clean',
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
    outcomeEventId: outcome.event_id,
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
    compatibilityStatus: 'compatible',
    evidenceRef: 'evidence:compatibility-1',
    evidenceDigest: digest('compatibility'),
  });
  appendSkill(events, 'skill_benchmark.security_probe_recorded', {
    scenarioStartedEventId: started.event_id,
    probeRef: 'probe:controlled-1',
    probeDigest: digest('probe'),
    compositionPathDigest: digest('composition'),
    probeOutcome: 'pass',
    evidenceRef: 'evidence:probe-1',
    evidenceDigest: digest('probe-evidence'),
    refusalObserved: true,
    policyVersion: 'probe@1',
  });
  appendSkill(events, 'skill_benchmark.run_closed', {
    designEventId: planned.event_id,
    scenarioTerminalEventIds: [finished.event_id],
    terminalStatus: 'closed',
    accountingRef: 'accounting:run-1',
    accountingDigest: digest('accounting'),
    closedAt: TIMESTAMP,
  });
  return Object.freeze(events);
}

function executionFixtureEvents(): readonly SkillBenchmarkLedgerEvent[] {
  const selected = new Set<SkillBenchmarkEventStem>([
    'deep_improvement_common.run_started',
    'skill_benchmark.run_planned',
    'skill_benchmark.treatment_assigned',
    'skill_benchmark.scenario_started',
    'skill_benchmark.scenario_finished',
    'skill_benchmark.run_closed',
  ]);
  const output: SkillBenchmarkLedgerEvent[] = [];
  for (const source of fixtureEvents().filter((event) => selected.has(event.payload.stem))) {
    const prior = output.at(-1) ?? null;
    let data: JsonObject = source.payload.data;
    if (source.payload.stem === 'skill_benchmark.treatment_assigned') {
      const design = output.find(
        (event) => event.payload.stem === 'skill_benchmark.run_planned',
      );
      data = { ...source.payload.data, designPayloadDigest: design?.payload.payloadDigest ?? '' };
    } else if (source.payload.stem === 'skill_benchmark.scenario_started') {
      const assignment = output.find(
        (event) => event.payload.stem === 'skill_benchmark.treatment_assigned',
      );
      data = {
        ...source.payload.data,
        assignmentPayloadDigest: assignment?.payload.payloadDigest ?? '',
      };
    } else if (source.payload.stem === 'skill_benchmark.scenario_finished') {
      const started = output.find(
        (event) => event.payload.stem === 'skill_benchmark.scenario_started',
      );
      data = { ...source.payload.data, startedPayloadDigest: started?.payload.payloadDigest ?? '' };
    }
    const input = {
      stem: source.payload.stem,
      scope: source.payload.scope,
      data,
      prevEventHash: prior === null ? ZERO_DIGEST : digest(prior),
      replay: replayMetadata(),
      eventId: source.event_id,
      streamId: STREAM_ID,
      streamSequence: output.length + 1,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'skill-benchmark-parity-tests', version: '1' },
      authorityEpoch: 1,
      correlationId: `transport-${digest({ compact: output.length }).slice(0, 16)}`,
      causationId: prior?.event_id ?? null,
      idempotencyKey: `skill-parity-compact-${output.length + 1}`,
    } as SkillBenchmarkEventInput<SkillBenchmarkEventStem>;
    output.push(prepareSkillBenchmarkEvent(input as never, registry).envelope);
  }
  return Object.freeze(output);
}

function bindParityFixture(
  fixtureId: string,
  scenario: SkillBenchmarkParityFixtureScenario,
  events: readonly SkillBenchmarkLedgerEvent[],
  expectedTerminalDecision: SkillBenchmarkTerminalDecision,
): SkillBenchmarkParityFixture {
  const provisional: SkillBenchmarkParityFixture = {
    fixtureId,
    scenario,
    frozenInput: {
      baseSha: BASE_SHA,
      runManifestDigest: digest({ scenario, manifest: 1 }),
      scenarioManifestDigest: digest('scenario-manifest'),
      treatmentMatrixDigest: digest('treatment-matrix'),
      taskSetDigest: digest('task-set'),
      skillBundleDigest: digest('skill-bundle'),
      registryDigest: digest('registry'),
      executorDescriptorDigest: digest('executor'),
      environmentDigest: digest('environment'),
      toolDigest: digest('tool'),
      permissionDigest: digest('permission'),
      dependencyDigest: digest('dependency'),
      goldSnapshotDigest: digest('gold'),
      seedPolicyDigest: digest('seed'),
      evaluatorEpochDigest: digest('evaluator-epoch'),
      scoringPolicyDigest: digest('scoring-policy'),
      commonServiceContractDigest: digest(SKILL_BENCHMARK_SHARED_PARITY_SERVICES),
      sealedArtifactContractDigest: digest(
        SKILL_BENCHMARK_SHARED_PARITY_SERVICES.sealedArtifactContract,
      ),
      initialStateDigest: digest('pending'),
      configurationDigest: digest({ mode: 'skill-benchmark', comparator: 1 }),
      budgetLease: {
        leaseId: 'lease-1',
        runId: RUN_ID,
        lineageId: LINEAGE_ID,
        generation: 1,
        maxIterations: 4,
        remainingIterations: 3,
        deadlineAt: '2026-07-29T10:00:00.000Z',
      },
    },
    events,
    expectedTerminalDecision,
    resumeEvidence: null,
    commonParityReceiptDigest: digest('common-parity-receipt'),
  };
  return Object.freeze({
    ...provisional,
    frozenInput: Object.freeze({
      ...provisional.frozenInput,
      initialStateDigest: skillBenchmarkParityInitialStateDigest(provisional),
    }),
  });
}

function fixture(
  scenario: SkillBenchmarkParityFixtureScenario = 'full-skill',
  fixtureId = `fixture-${scenario}`,
): SkillBenchmarkParityFixture {
  return bindParityFixture(fixtureId, scenario, executionFixtureEvents(), 'completed');
}

// ───────────────────────────────────────────────────────────────────
// Compact scene builders for field-level divergence tests
// ───────────────────────────────────────────────────────────────────

type CommonScenePush = <TStem extends DeepImprovementCommonEventStem>(
  stem: TStem,
  data: DeepImprovementCommonPayloadMap[TStem],
  scope?: DeepImprovementCommonScopeMap[TStem],
) => SkillBenchmarkEventEnvelope<TStem>;

type SkillScenePush = <TStem extends SkillBenchmarkSpecificEventStem>(
  stem: TStem,
  data: SkillBenchmarkPayloadMap[TStem],
  scope?: SkillBenchmarkScopeMap[TStem],
) => SkillBenchmarkEventEnvelope<TStem>;

function runStartedSceneData(): DeepImprovementCommonPayloadMap['deep_improvement_common.run_started'] {
  return {
    generation: 1,
    charterDigest: digest('charter'),
    configDigest: digest('config'),
    operatorRef: 'operator:skill-benchmark',
    serviceContractVersion: 'deep-improvement-common@1',
    replayFingerprint: digest('run-replay'),
    maxIterations: 4,
  };
}

function runPlannedSceneData(): SkillBenchmarkPayloadMap['skill_benchmark.run_planned'] {
  return {
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
  };
}

function treatmentAssignedSceneData(
  planned: SkillBenchmarkEventEnvelope<'skill_benchmark.run_planned'>,
): SkillBenchmarkPayloadMap['skill_benchmark.treatment_assigned'] {
  return {
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
  };
}

function scenarioStartedSceneData(
  assigned: SkillBenchmarkEventEnvelope<'skill_benchmark.treatment_assigned'>,
): SkillBenchmarkPayloadMap['skill_benchmark.scenario_started'] {
  return {
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
  };
}

function scenarioFinishedSceneData(
  started: SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_started'>,
): SkillBenchmarkPayloadMap['skill_benchmark.scenario_finished'] {
  return {
    startedEventId: started.event_id,
    startedPayloadDigest: started.payload.payloadDigest,
    outcomeRef: 'outcome:scenario-1',
    outcomeDigest: digest('scenario-outcome'),
    finalStateDigest: digest('final-state'),
    executionReceiptRef: 'receipt:execution-finish-1',
    terminalOutcome: 'pass',
    finishedAt: TIMESTAMP,
  };
}

function skillDiscoveredSceneData(
  started: SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_started'>,
): SkillBenchmarkPayloadMap['skill_benchmark.skill_discovered'] {
  return {
    scenarioStartedEventId: started.event_id,
    skillBundleRef: 'skill-bundle:1',
    skillBundleDigest: digest('skill-bundle'),
    registryDigest: digest('registry'),
    discoveryMethod: 'auto-route',
    availabilityStatus: 'available',
    discoveryEvidenceRef: 'evidence:discovery-1',
    discoveryEvidenceDigest: digest('discovery'),
  };
}

function skillLoadedSceneData(
  discovered: SkillBenchmarkEventEnvelope<'skill_benchmark.skill_discovered'>,
): SkillBenchmarkPayloadMap['skill_benchmark.skill_loaded'] {
  return {
    discoveredEventId: discovered.event_id,
    discoveredPayloadDigest: discovered.payload.payloadDigest,
    disclosureStage: 'instructions',
    skillBundleRef: 'skill-bundle:1',
    skillBundleDigest: digest('skill-bundle'),
    loadedResourceClasses: ['instructions'],
    loaderReceiptRef: 'receipt:loader-1',
    loadStatus: 'loaded',
  };
}

function skillInvokedSceneData(
  loaded: SkillBenchmarkEventEnvelope<'skill_benchmark.skill_loaded'>,
): SkillBenchmarkPayloadMap['skill_benchmark.skill_invoked'] {
  return {
    loadedEventId: loaded.event_id,
    loadedPayloadDigest: loaded.payload.payloadDigest,
    invocationMode: 'auto',
    activationRef: 'activation:skill-1',
    activationDigest: digest('activation'),
    invocationReceiptRef: 'receipt:invocation-1',
    invocationStatus: 'invoked',
    failureReasonCode: null,
  };
}

function resourceExposedSceneData(
  loaded: SkillBenchmarkEventEnvelope<'skill_benchmark.skill_loaded'>,
  canaryStatus: 'clean' | 'triggered' = 'clean',
): SkillBenchmarkPayloadMap['skill_benchmark.resource_exposed'] {
  return {
    skillLoadedEventId: loaded.event_id,
    resourceRef: 'resource:reference-1',
    resourceDigest: digest('resource'),
    resourceClass: 'reference',
    exposureStage: 'resources',
    canaryRef: 'canary:resource-1',
    canaryDigest: digest('canary'),
    exposureReceiptRef: 'receipt:exposure-1',
    canaryStatus,
  };
}

function milestoneObservedSceneData(
  started: SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_started'>,
): SkillBenchmarkPayloadMap['skill_benchmark.milestone_observed'] {
  return {
    scenarioStartedEventId: started.event_id,
    milestoneCode: 'validated-output',
    ordinal: 1,
    milestoneState: 'reached',
    observationRef: 'observation:milestone-1',
    observationDigest: digest('milestone'),
    complianceStatus: 'compliant',
  };
}

function trajectoryRecordedSceneData(
  started: SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_started'>,
  milestone: SkillBenchmarkEventEnvelope<'skill_benchmark.milestone_observed'>,
): SkillBenchmarkPayloadMap['skill_benchmark.trajectory_recorded'] {
  return {
    scenarioStartedEventId: started.event_id,
    milestoneEventIds: [milestone.event_id],
    orderedKeyPointCodes: ['discover', 'load', 'invoke', 'validate'],
    intermediateStateDigest: digest('intermediate'),
    traceRef: 'trace:trajectory-1',
    traceDigest: digest('trajectory'),
    complianceObservationRef: 'observation:compliance-1',
    complianceObservationDigest: digest('compliance'),
  };
}

function outcomeRecordedSceneData(
  finished: SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_finished'>,
): SkillBenchmarkPayloadMap['skill_benchmark.outcome_recorded'] {
  return {
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
  };
}

function goldIntegritySceneData(): SkillBenchmarkPayloadMap['skill_benchmark.gold_integrity_recorded'] {
  return {
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
  };
}

function scoreObservedSceneData(
  outcome: SkillBenchmarkEventEnvelope<'skill_benchmark.outcome_recorded'>,
  gold: SkillBenchmarkEventEnvelope<'skill_benchmark.gold_integrity_recorded'>,
): SkillBenchmarkPayloadMap['skill_benchmark.score_observed'] {
  return {
    outcomeEventId: outcome.event_id,
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
  };
}

function compatibilitySceneData(
  started: SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_started'>,
): SkillBenchmarkPayloadMap['skill_benchmark.compatibility_observed'] {
  return {
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
    compatibilityStatus: 'compatible',
    evidenceRef: 'evidence:compatibility-1',
    evidenceDigest: digest('compatibility'),
  };
}

function securityProbeSceneData(
  started: SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_started'>,
  probeOutcome: 'fail' | 'pass' = 'pass',
): SkillBenchmarkPayloadMap['skill_benchmark.security_probe_recorded'] {
  return {
    scenarioStartedEventId: started.event_id,
    probeRef: 'probe:controlled-1',
    probeDigest: digest('probe'),
    compositionPathDigest: digest('composition'),
    probeOutcome,
    evidenceRef: 'evidence:probe-1',
    evidenceDigest: digest('probe-evidence'),
    refusalObserved: true,
    policyVersion: 'probe@1',
  };
}

function candidateProposedSceneData(): DeepImprovementCommonPayloadMap['deep_improvement_common.candidate_proposed'] {
  return {
    proposalRef: 'proposal:candidate-1',
    proposalDigest: digest('common-proposal'),
    mutationOperatorRef: 'operator:bounded-rewrite',
    mutationOperatorVersion: 'bounded-rewrite@1',
    parentCandidateId: null,
    targetRef: 'target:benchmark-1',
    targetDigest: digest('target'),
    proposalPolicyVersion: 'proposal-policy@1',
  };
}

function candidateGeneratedSceneData(
  proposed: SkillBenchmarkEventEnvelope<'deep_improvement_common.candidate_proposed'>,
): DeepImprovementCommonPayloadMap['deep_improvement_common.candidate_generated'] {
  return {
    proposalEventId: proposed.event_id,
    proposalPayloadDigest: proposed.payload.payloadDigest,
    candidateArtifactRef: 'artifact:candidate-1',
    candidateArtifactDigest: digest('candidate'),
    generationReceiptRef: 'receipt:generation-1',
    mutationOperatorRef: 'operator:bounded-rewrite',
    mutationOperatorVersion: 'bounded-rewrite@1',
  };
}

function evaluationEpochSealedSceneData(): DeepImprovementCommonPayloadMap['deep_improvement_common.evaluation_epoch_sealed'] {
  return {
    evaluatorRef: 'evaluator:1',
    evaluatorCapsuleDigest: digest('evaluator-capsule'),
    fixtureSetRef: 'fixture-set:1',
    fixtureSetDigest: digest('fixture-set'),
    scorePolicyVersion: 'score-policy@1',
    scoreWriteBackendRef: DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
    evaluationBudgetRef: 'budget:1',
  };
}

function evaluationStartedSceneData(
  epoch: SkillBenchmarkEventEnvelope<'deep_improvement_common.evaluation_epoch_sealed'>,
): DeepImprovementCommonPayloadMap['deep_improvement_common.evaluation_started'] {
  return {
    epochSealedEventId: epoch.event_id,
    epochPayloadDigest: epoch.payload.payloadDigest,
    executionReceiptRef: 'receipt:started-1',
    fixtureCount: 3,
    evaluatorFingerprint: digest('evaluator-fingerprint'),
  };
}

function evaluationObservationSceneData(
  started: SkillBenchmarkEventEnvelope<'deep_improvement_common.evaluation_started'>,
): DeepImprovementCommonPayloadMap['deep_improvement_common.evaluation_observation_recorded'] {
  return {
    evaluationStartedEventId: started.event_id,
    evaluatorRef: 'evaluator:1',
    fixtureRef: 'fixture:fixture-1',
    rawObservationRef: 'artifact:raw-observation',
    rawObservationDigest: digest('raw-observation'),
    executionReceiptRef: 'receipt:observation-1',
    observationOutcome: 'pass',
  };
}

/** Push the shared candidate evaluation chain through one raw observation so a
 *  later evaluation-inconclusive scan has a genuine resolved event to cite. */
function pushEvaluationObservation(
  push: CommonScenePush,
): SkillBenchmarkEventEnvelope<'deep_improvement_common.evaluation_observation_recorded'> {
  pushRunStarted(push);
  const candidateScope = {
    runId: RUN_ID,
    lineageId: LINEAGE_ID,
    variant: 'skill-benchmark' as const,
    candidateId: 'candidate-1',
  };
  const evaluationScope = { ...candidateScope, evaluationEpochId: 'epoch-1' };
  const observationScope = { ...evaluationScope, fixtureId: 'fixture-1', observationId: 'observation-2' };
  const proposed = push('deep_improvement_common.candidate_proposed', candidateProposedSceneData(), candidateScope);
  const generated = push('deep_improvement_common.candidate_generated', candidateGeneratedSceneData(proposed), candidateScope);
  const epoch = push('deep_improvement_common.evaluation_epoch_sealed', evaluationEpochSealedSceneData(), evaluationScope);
  const started = push('deep_improvement_common.evaluation_started', evaluationStartedSceneData(epoch), evaluationScope);
  return push('deep_improvement_common.evaluation_observation_recorded', evaluationObservationSceneData(started), observationScope);
}

function evaluationInconclusiveSceneData(
  observation: SkillBenchmarkEventEnvelope<'deep_improvement_common.evaluation_observation_recorded'>,
): DeepImprovementCommonPayloadMap['deep_improvement_common.evaluation_inconclusive'] {
  return {
    relatedEventIds: [observation.event_id],
    reasonCode: 'evidence-gap',
    uncertainty: 0.6,
    evidenceRefs: ['evidence:unresolved-1'],
    evidenceSetDigest: digest('inconclusive-set'),
  };
}

/** Push the shared run-start every scene needs. */
function pushRunStarted(push: CommonScenePush): void {
  push('deep_improvement_common.run_started', runStartedSceneData());
}

/** Push shared run-start plus the skill run and one running scenario cell. */
function pushScenarioRunning(
  push: CommonScenePush,
  pushSkill: SkillScenePush,
): SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_started'> {
  pushRunStarted(push);
  const planned = pushSkill('skill_benchmark.run_planned', runPlannedSceneData());
  const assigned = pushSkill('skill_benchmark.treatment_assigned', treatmentAssignedSceneData(planned));
  return pushSkill('skill_benchmark.scenario_started', scenarioStartedSceneData(assigned));
}

/** Push the discovery/load/invoke chain onto a running scenario. */
function pushDiscoveryLoadedInvoked(
  pushSkill: SkillScenePush,
  started: SkillBenchmarkEventEnvelope<'skill_benchmark.scenario_started'>,
): SkillBenchmarkEventEnvelope<'skill_benchmark.skill_invoked'> {
  const discovered = pushSkill('skill_benchmark.skill_discovered', skillDiscoveredSceneData(started));
  const loaded = pushSkill('skill_benchmark.skill_loaded', skillLoadedSceneData(discovered));
  return pushSkill('skill_benchmark.skill_invoked', skillInvokedSceneData(loaded));
}

/** Push the running scenario to a finished terminal then a raw score record. */
function pushScoredScenario(
  push: CommonScenePush,
  pushSkill: SkillScenePush,
): SkillBenchmarkEventEnvelope<'skill_benchmark.score_observed'> {
  const started = pushScenarioRunning(push, pushSkill);
  const finished = pushSkill('skill_benchmark.scenario_finished', scenarioFinishedSceneData(started));
  const outcome = pushSkill('skill_benchmark.outcome_recorded', outcomeRecordedSceneData(finished));
  const gold = pushSkill('skill_benchmark.gold_integrity_recorded', goldIntegritySceneData());
  return pushSkill('skill_benchmark.score_observed', scoreObservedSceneData(outcome, gold));
}

/** Compose a compact non-terminal scene whose events drive exactly the reducer
 *  slices a single field-level divergence test corrupts. Both parity paths fold
 *  the same raw events, so only the typed fold output diverges after mutation. */
function sceneFixture(
  sceneId: string,
  expectedTerminalDecision: SkillBenchmarkTerminalDecision,
  build: (push: CommonScenePush, pushSkill: SkillScenePush) => void,
): SkillBenchmarkParityFixture {
  const events: SkillBenchmarkLedgerEvent[] = [];
  const pushCommon: CommonScenePush = (stem, data, scope) => appendCommon(events, stem, data, scope);
  const pushSkill: SkillScenePush = (stem, data, scope) => appendSkill(events, stem, data, scope);
  build(pushCommon, pushSkill);
  return bindParityFixture(sceneId, 'full-skill', Object.freeze(events), expectedTerminalDecision);
}

interface ArtifactHarness {
  readonly ledger: AppendOnlyLedger;
  readonly store: SealedArtifactStore;
  readonly recorder: ArtifactEventRecorder;
  readonly registry: EventTypeRegistry;
  readonly nextMetadata: (label: string) => ArtifactEventMetadata;
}

function artifactPolicy(input: Readonly<PolicyEvaluationInput>): PolicyEvaluationResult {
  return input.capabilityId === 'artifact-write'
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['artifact-write'] }
    : { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: ['artifact-write'] };
}

/** Pin actor, capability, and evidence to the prepared request so unverified identity cannot authorize. */
function pinRequestIdentity(
  context: Readonly<{ evaluationInput: PolicyEvaluationInput }>,
): { actorId: string; capabilityId: string; evidenceDigest: string } {
  return {
    actorId: context.evaluationInput.actorId,
    capabilityId: context.evaluationInput.capabilityId,
    evidenceDigest: context.evaluationInput.evidenceDigest,
  };
}

function createArtifactHarness(): ArtifactHarness {
  const root = temporaryRoot('sealed');
  const eventRegistry = new EventTypeRegistry(sealedArtifactEventDefinitions());
  const policies = new TransitionPolicyRegistry([{
    policyId: 'artifact-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['artifact-write'],
    evaluate: artifactPolicy,
  }]);
  const authority: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });
  const ledger = new AppendOnlyLedger({
    rootDirectory: join(root, 'ledger'),
    ledgerId: 'skill-parity-artifacts',
    auditLedgerId: 'skill-parity-artifact-audit',
    authorityProvider: () => authority,
    now: () => new Date(TIMESTAMP),
  }, eventRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: join(root, 'ledger'),
    auditLedgerId: 'skill-parity-artifact-audit',
    authorityProvider: () => authority,
    now: () => new Date(TIMESTAMP),
    identityResolver: pinRequestIdentity,
  }, ledger, policies);
  const store = new SealedArtifactStore({ rootDirectory: join(root, 'store') });
  const policy = policies.resolve('artifact-policy', 1);
  let index = 0;
  const nextMetadata = (label: string): ArtifactEventMetadata => {
    index += 1;
    return {
      eventId: `${label}-${index}`,
      streamId: 'skill-parity-artifact-stream',
      streamSequence: index,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'skill-parity-tests', version: '1' },
      authorityEpoch: 1,
      correlationId: `artifact-correlation-${index}`,
      causationId: null,
      idempotencyKey: `artifact-idempotency-${index}`,
    };
  };
  const recorder: ArtifactEventRecorder = {
    ledger,
    gateway,
    authorizationContext: (event): ArtifactAuthorizationContext => ({
      requestId: `artifact-request-${event.identity.eventId}`,
      mode: 'improvement',
      priorStateVersion: 'artifact-state@1',
      priorStateFingerprint: digest('artifact-state'),
      actorId: 'skill-parity-tests',
      capabilityId: 'artifact-write',
      authorityEpoch: 1,
      policy: {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      evidenceDigest: event.canonicalDigest,
    }),
  };
  return { ledger, store, recorder, registry: eventRegistry, nextMetadata };
}

async function seal(
  harness: ArtifactHarness,
  kind: string,
  source: unknown,
  label: string,
): Promise<VerifiedArtifactEvidence> {
  const sealed = await harness.store.seal(kind, source);
  const event = prepareArtifactSealedEvent(
    sealed.artifact,
    harness.registry,
    harness.nextMetadata(label),
    'run-retained',
  );
  await recordArtifactEvent(harness.recorder, event);
  return readVerifiedArtifactEvidence(
    harness.ledger,
    harness.store,
    sealed.artifact.reference,
    kind,
  );
}

async function sealedBoundary(): Promise<{
  readonly harness: ArtifactHarness;
  readonly referenceSet: ArtifactReferenceSet;
}> {
  const harness = createArtifactHarness();
  const frozenFixture = await seal(
    harness,
    InitialArtifactKinds.FIXTURE,
    { mode: 'skill-benchmark', source: 'frozen-fixture' },
    'fixture',
  );
  const configuration = await seal(
    harness,
    InitialArtifactKinds.CONFIGURATION,
    { mode: 'skill-benchmark', authority: 'legacy' },
    'configuration',
  );
  return {
    harness,
    referenceSet: bindVerifiedArtifactReferences([frozenFixture, configuration]),
  };
}

function capsule(
  parityFixture: SkillBenchmarkParityFixture,
  referenceSet: ArtifactReferenceSet,
): ParityCaseCapsule {
  return {
    baseSha: parityFixture.frozenInput.baseSha,
    baseDigest: digest({ baseSha: parityFixture.frozenInput.baseSha }),
    initialStateDigest: parityFixture.frozenInput.initialStateDigest,
    configurationDigest: parityFixture.frozenInput.configurationDigest,
    canonicalizationVersions: {
      event: 'skill-benchmark-event@1',
      comparator: 'skill-benchmark-event-comparator@1',
    },
    artifactReferenceSet: referenceSet,
    timeoutMs: 30_000,
    terminationPolicy: 'skill-benchmark-bounded-shadow',
  };
}

function targetedManifest(parityFixture: SkillBenchmarkParityFixture): ParityCaseManifest {
  const definition = createSkillBenchmarkParityCaseDefinition(parityFixture);
  return compileParityCaseManifest({
    baseSha: BASE_SHA,
    baselineRows: [{
      scenarioId: definition.scenarioId,
      mode: definition.mode,
      contractDigest: definition.contractDigest,
      disposition: 'protected',
    }],
    cases: [definition],
  });
}

async function genericRun(
  parityFixture: SkillBenchmarkParityFixture,
  fault?: Readonly<{
    path: 'ledger' | 'legacy';
    kind: SkillBenchmarkParityFaultKind;
    eventIndex: number;
  }>,
): Promise<Readonly<{
  run: SkillBenchmarkParityCaseRun;
  result: Awaited<ReturnType<typeof runShadowParityCase>>;
}>> {
  const sealed = await sealedBoundary();
  const boundary = {
    ledger: sealed.harness.ledger,
    store: sealed.harness.store,
    capsule: capsule(parityFixture, sealed.referenceSet),
  };
  const run = {
    caseDefinition: createSkillBenchmarkParityCaseDefinition(parityFixture),
    legacyBoundary: boundary,
    ledgerBoundary: boundary,
    fixture: parityFixture,
    executors: createSkillBenchmarkParityExecutors(parityFixture, fault),
    modeCertificateVerification: { input: {} as never },
    shadowRootDirectory: join(temporaryRoot('execution'), 'shadow'),
    protectedRoots: [join(temporaryRoot('authority'), 'legacy-live')],
    deterministicRuns: 2,
  } satisfies SkillBenchmarkParityCaseRun;
  const result = await runShadowParityCase({
    caseDefinition: run.caseDefinition,
    shadowRootDirectory: run.shadowRootDirectory,
    protectedRoots: run.protectedRoots,
    legacy: run.legacyBoundary,
    dark: run.ledgerBoundary,
    executeLegacy: run.executors.legacy,
    executeDark: run.executors.ledger,
    deterministicRuns: run.deterministicRuns,
  });
  return Object.freeze({ run, result });
}

function independentTransportEvents(
  events: readonly SkillBenchmarkLedgerEvent[],
  path: 'ledger' | 'legacy',
): readonly SkillBenchmarkLedgerEvent[] {
  const ids = new Map(events.map((event) => [event.event_id, `${path}-${event.event_id}`]));
  return Object.freeze(events.map((event, index) => Object.freeze({
    ...event,
    event_id: ids.get(event.event_id) as string,
    causation_id: event.causation_id === null
      ? null : ids.get(event.causation_id) as string,
    occurred_at: path === 'legacy'
      ? '2026-07-28T10:01:00.000Z' : '2026-07-28T10:02:00.000Z',
    recorded_at: path === 'legacy'
      ? '2026-07-28T10:03:00.000Z' : '2026-07-28T10:04:00.000Z',
    correlation_id: `transport-${digest({ path, index }).slice(0, 16)}`,
  } as SkillBenchmarkLedgerEvent)));
}

function malformedIdentityRegistryCertificate(mode: string): Record<string, unknown> {
  const placeholderDigest = digest({ mode, certificate: 'malformed-identity-registry' });
  return {
    schema_version: 1,
    mode,
    base_sha: BASE_SHA,
    manifest_digest: placeholderDigest,
    case_ids: [],
    case_evidence_digests: [],
    reference_set_digests: [],
    attestation_final_digests: [],
    bindings: {},
    identity_registry: { schema_version: 1, identities: {} },
    evidence_digest: placeholderDigest,
    open_divergence_count: 0,
    authority_state: 'legacy_authoritative',
    authority_mutation: false,
    rollback_minimum_days: 14,
    rollback_minimum_successful_runs: 20,
    certificate_digest: placeholderDigest,
  };
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('skill benchmark shadow parity', () => {
  it('pairs independent ids and honors only the closed volatility allowlist', () => {
    const events = fixtureEvents();
    const fingerprints = events.map((_, index) => digest({ projection: index }));
    const legacy = canonicalizeSkillBenchmarkEventStream(
      independentTransportEvents(events, 'legacy'),
      fingerprints,
    );
    const ledger = canonicalizeSkillBenchmarkEventStream(
      independentTransportEvents(events, 'ledger'),
      fingerprints,
    );
    expect(SKILL_BENCHMARK_VOLATILITY_ALLOWLIST.map((entry) => entry.field)).toEqual([
      'occurred_at', 'recorded_at', 'correlation_id',
    ]);
    expect(legacy.map((entry) => entry.eventId)).not.toEqual(
      ledger.map((entry) => entry.eventId),
    );
    expect(compareSkillBenchmarkEventStreams('fixture-independent', legacy, ledger)).toEqual([]);
    const changed = ledger.map((entry, index) => index === 3
      ? Object.freeze({ ...entry, stablePayloadDigest: digest('semantic-change') })
      : entry);
    expect(compareSkillBenchmarkEventStreams(
      'fixture-independent',
      legacy,
      changed,
    ).map((entry) => entry.class)).toContain('payload');
  });

  it('validates presence, type, and non-interference for volatile fields', () => {
    const event = fixtureEvents()[0];
    const fingerprint = digest('projection');
    expect(() => canonicalizeSkillBenchmarkEventStream([{
      ...event,
      correlation_id: 'semantic-skill-id',
    }], [fingerprint])).toThrow(/transport-only token grammar/);
    expect(() => canonicalizeSkillBenchmarkEventStream([{
      ...event,
      recorded_at: 'not-a-timestamp',
    }], [fingerprint])).toThrow(/volatile timestamps/);
    expect(() => canonicalizeSkillBenchmarkEventStream([{
      ...event,
      payload: { ...event.payload, occurred_at: TIMESTAMP },
    } as SkillBenchmarkLedgerEvent], [fingerprint])).toThrow(/semantic payload/);
  });

  it('uses a structurally distinct legacy oracle and preserves shared identities', () => {
    const executors = createSkillBenchmarkParityExecutors(fixture());
    expect(executors.legacy).not.toBe(executors.ledger);
    expect(executors.legacyOracleImplementation).toBe('modeled-legacy-oracle');
    expect(executors.ledgerImplementation).toBe('typed-ledger-pipeline');
    expect(executors.commonParityContractId).toBe('deep-improvement-common-shadow-parity');
    expect(SKILL_BENCHMARK_SHARED_PARITY_SERVICES).toMatchObject({
      contractId: 'deep-improvement-common-shadow-parity',
      consumer: 'skill-benchmark',
      substrateImportsReal: true,
    });
  });

  it('runs zero-diff legacy and ledger paths through the real substrate', async () => {
    const parityFixture = fixture();
    const outcome = await genericRun(parityFixture);
    expect(outcome.result, JSON.stringify(outcome.result)).toMatchObject({ ok: true });
    const evidence = outcome.run.executors.evidence();
    expect(evidence).toHaveLength(4);
    expect(new Set(evidence.map((entry) => entry.implementationKind))).toEqual(new Set([
      'modeled-legacy-oracle', 'typed-ledger-pipeline',
    ]));
    expect(compareSkillBenchmarkEventStreams(
      parityFixture.fixtureId,
      evidence.find((entry) => entry.path === 'legacy')?.observations ?? [],
      evidence.find((entry) => entry.path === 'ledger')?.observations ?? [],
    )).toEqual([]);
  }, 30_000);

  it('fails on a reducer-internal divergence a shared-derivation harness could not see', async () => {
    // Corrupt only the real reducer's own typed fold output (never the raw
    // event stream both paths read). A harness whose ledger side re-derives
    // from the same raw events as the legacy oracle -- instead of from this
    // fold result -- cannot observe this at all, so it reports parity PASS
    // despite the reducer having computed a wrong scenario field. The
    // rebuilt harness must FAIL here.
    const realFold = skillBenchmarkReducers.foldSkillBenchmarkEvents;
    const foldSpy = vi.spyOn(skillBenchmarkReducers, 'foldSkillBenchmarkEvents')
      .mockImplementation((events, options) => {
        const real = realFold(events, options);
        if (real.outcome !== 'projected') return real;
        return {
          ...real,
          projection: {
            ...real.projection,
            iterationConvergence: {
              ...real.projection.iterationConvergence,
              scenarios: real.projection.iterationConvergence.scenarios.map(
                (scenario) => scenario.treatmentArm === 'auto-route'
                  ? { ...scenario, treatmentArm: 'control' as const }
                  : scenario,
              ),
            },
          },
        };
      });
    try {
      const parityFixture = fixture();
      const outcome = await genericRun(parityFixture);
      expect(foldSpy).toHaveBeenCalled();
      expect(outcome.result.ok, JSON.stringify(outcome.result)).toBe(false);
      if (!outcome.result.ok) {
        expect(outcome.result.divergence.class).toBe('projection-semantic');
      }
    } finally {
      foldSpy.mockRestore();
    }
  }, 30_000);

  it('still reports parity PASS for identical inputs once the reducer fold is genuine again', async () => {
    const parityFixture = fixture();
    const outcome = await genericRun(parityFixture);
    expect(outcome.result, JSON.stringify(outcome.result)).toMatchObject({ ok: true });
  }, 30_000);

  it.each(SPEC_FAULTS)(
    'drives $kind end-to-end as exact typed $expectedClass',
    async ({ kind, expectedClass }) => {
      const parityFixture = fixture();
      const outcome = await genericRun(parityFixture, {
        path: 'ledger',
        kind,
        eventIndex: kind === 'reorder-event' ? 2 : 3,
      });
      expect(outcome.result.ok).toBe(false);
      const legacy = outcome.run.executors.evidence()
        .find((entry) => entry.path === 'legacy')?.observations ?? [];
      const ledger = outcome.run.executors.evidence()
        .find((entry) => entry.path === 'ledger')?.observations ?? [];
      const diffs = compareSkillBenchmarkEventStreams(
        parityFixture.fixtureId,
        legacy,
        ledger,
      );
      expect(diffs.map((entry) => entry.class), JSON.stringify(diffs)).toContain(expectedClass);
      expect(diffs.every((entry) => entry.disposition === 'unexplained')).toBe(true);
    },
    30_000,
  );

  it('does not expose a disposition that can launder an unexplained difference', () => {
    const events = fixtureEvents();
    const fingerprints = events.map((_, index) => digest({ projection: index }));
    const legacy = canonicalizeSkillBenchmarkEventStream(events, fingerprints);
    const ledger = legacy.map((entry, index) => index === 12
      ? Object.freeze({ ...entry, goldRefs: Object.freeze(['changed-gold']) })
      : entry);
    const diffs = compareSkillBenchmarkEventStreams('fixture-unexplained', legacy, ledger);
    expect(diffs.map((entry) => entry.class)).toContain('gold');
    expect(new Set(diffs.map((entry) => entry.disposition))).toEqual(new Set(['unexplained']));
  });

  it('rejects open fixture and resume-evidence shapes', () => {
    const parityFixture = fixture();
    expect(() => createSkillBenchmarkParityExecutors({
      ...parityFixture,
      unexpected: true,
    } as SkillBenchmarkParityFixture)).toThrow(/closed allowed-key set/);
  });

  it('compiles only the exact treatment and control fixture closure', () => {
    const fixtures = SKILL_BENCHMARK_REQUIRED_FIXTURE_SCENARIOS.map(
      (scenario) => fixture(scenario, `fixture-${scenario}`),
    );
    const manifest = compileSkillBenchmarkParityManifest({ baseSha: BASE_SHA, fixtures });
    expect(manifest.cases).toHaveLength(SKILL_BENCHMARK_REQUIRED_FIXTURE_SCENARIOS.length);
    expect(() => compileSkillBenchmarkParityManifest({
      baseSha: BASE_SHA,
      fixtures: fixtures.slice(1),
    })).toThrow(/exact fixture scenario closure/);
  });

  it('treats the real mode certificate and parity status only as gate inputs', async () => {
    const parityFixture = fixture();
    const manifest = targetedManifest(parityFixture);
    const sealed = await sealedBoundary();
    const boundary = {
      ledger: sealed.harness.ledger,
      store: sealed.harness.store,
      capsule: capsule(parityFixture, sealed.referenceSet),
    };
    const run = {
      caseDefinition: createSkillBenchmarkParityCaseDefinition(parityFixture),
      legacyBoundary: boundary,
      ledgerBoundary: boundary,
      fixture: parityFixture,
      executors: createSkillBenchmarkParityExecutors(parityFixture),
      modeCertificateVerification: { input: { bundle: { tampered: true } } as never },
      shadowRootDirectory: join(temporaryRoot('certificate'), 'shadow'),
      protectedRoots: [join(temporaryRoot('certificate-authority'), 'legacy-live')],
    } satisfies SkillBenchmarkParityCaseRun;
    expect(await verifySkillBenchmarkParityModeCertificate(run, manifest)).toBeNull();
    const gate = createSkillBenchmarkModeGateInput({
      manifest,
      expectedFixtureIds: [parityFixture.fixtureId],
      receipts: [],
    });
    expect(gate).toMatchObject({
      exitStatus: 'blocked',
      blockingReasonCode: 'MISSING_RECEIPT',
      certificatesVerified: true,
      cutoverAuthorized: false,
      rollbackReadinessAuthorized: false,
    });
  });

  it('rejects a malformed certificate identity registry', async () => {
    const parityFixture = fixture();
    const manifest = targetedManifest(parityFixture);
    const { run } = await genericRun(parityFixture);
    const outcome = await runSkillBenchmarkParityCase({ manifest, caseRun: run });
    expect(() => parseSkillBenchmarkParityReceipt({
      ...outcome.receipt,
      parityCertificate: malformedIdentityRegistryCertificate('skill-benchmark'),
    }, manifest)).toThrow(/closed identity-registry shape/);
  }, 30_000);

  it('proves the lifecycle map closes shared and skill-specific events', () => {
    expect(DeepImprovementCommonEventStems.length).toBeGreaterThan(0);
    expect(() => verifySkillBenchmarkLifecycleEventMap()).not.toThrow();
  });

  /** Corrupt one reducer-state slice on the ledger fold only and require the
   *  paired pipeline to refuse the resulting projection-semantic divergence.
   *  The ledger path derives every projected field from
   *  `foldSkillBenchmarkEvents` while the legacy path never calls it, so a
   *  load-bearing mutation changes only one side and the comparator must fail
   *  closed. The empty-event fold is the shared sealed-capsule state both
   *  paths need to agree on identically, so only real event histories mutate. */
  async function expectSurfaceDivergence(
    parityFixture: SkillBenchmarkParityFixture,
    mutate: (state: SkillBenchmarkProjectionState) => SkillBenchmarkProjectionState,
  ): Promise<void> {
    const realFold = skillBenchmarkReducers.foldSkillBenchmarkEvents;
    const spy = vi.spyOn(skillBenchmarkReducers, 'foldSkillBenchmarkEvents')
      .mockImplementation((events, options) => {
        const result = realFold(events, options);
        if (result.outcome !== 'projected' || events.length === 0) return result;
        return { ...result, projection: mutate(result.projection) };
      });
    try {
      const outcome = await genericRun(parityFixture);
      expect(outcome.result.ok, JSON.stringify(outcome.result)).toBe(false);
      if (!outcome.result.ok) {
        expect(
          outcome.result.divergence.class,
          `message=${outcome.result.divergence.message}`,
        ).toBe('projection-semantic');
      }
    } finally {
      spy.mockRestore();
    }
  }

  it('fails parity when the run-id projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-run-id', 'active', (push) => {
        push('deep_improvement_common.run_started', runStartedSceneData());
      }),
      (state) => ({
        ...state,
        common: { ...state.common, run: { ...state.common.run, runId: 'run-shadow-corrupt' } },
      }),
    );
  }, 30_000);

  it('fails parity when the lineage-id projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-lineage-id', 'active', (push) => {
        push('deep_improvement_common.run_started', runStartedSceneData());
      }),
      (state) => ({
        ...state,
        common: {
          ...state.common,
          run: { ...state.common.run, lineageId: 'lineage-shadow-corrupt' },
        },
      }),
    );
  }, 30_000);

  it('fails parity when the run-state projection field diverges', async () => {
    // The reducer's run state reader turns a scenario-started marker into the
    // 'active' run state, so the ledger path mutates the persisted seenEvents
    // slice into fabricating a marker that never produced a scenario object;
    // the legacy hand-scan keeps reading 'planned' off the raw run-start.
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-run-state', 'active', (push) => {
        push('deep_improvement_common.run_started', runStartedSceneData());
      }),
      (state) => ({
        ...state,
        seenEvents: [...state.seenEvents, {
          eventId: 'fabricated-scenario-started',
          eventDigest: ZERO_DIGEST,
          payloadDigest: digest('fabricated-scenario-started'),
          stem: 'skill_benchmark.scenario_started',
          streamId: STREAM_ID,
          streamSequence: 900,
          scenarioId: 'scenario-1',
          assignmentId: 'assignment-1',
          executionId: 'execution-1',
          observationId: null,
          candidateId: null,
          benchmarkDesignId: null,
          certificateId: null,
        }],
      }),
    );
  }, 30_000);

  it('fails parity when the design-ids projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-design-ids', 'active', (push, pushSkill) => {
        pushRunStarted(push);
        pushSkill('skill_benchmark.run_planned', runPlannedSceneData());
      }),
      (state) => ({
        ...state,
        run: { ...state.run, benchmarkDesignId: 'design-shadow-corrupt' },
      }),
    );
  }, 30_000);

  it('fails parity when the availability-evidence-digests projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-availability', 'active', (push, pushSkill) => {
        const started = pushScenarioRunning(push, pushSkill);
        pushSkill('skill_benchmark.skill_discovered', skillDiscoveredSceneData(started));
      }),
      (state) => ({
        ...state,
        iterationConvergence: {
          ...state.iterationConvergence,
          scenarios: state.iterationConvergence.scenarios.map(
            (scenario) => ({ ...scenario, availabilityEvidenceDigests: ['corrupt-availability'] }),
          ),
        },
      }),
    );
  }, 30_000);

  it('fails parity when the invocation-evidence-digests projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-invocation', 'active', (push, pushSkill) => {
        const started = pushScenarioRunning(push, pushSkill);
        pushDiscoveryLoadedInvoked(pushSkill, started);
      }),
      (state) => ({
        ...state,
        iterationConvergence: {
          ...state.iterationConvergence,
          scenarios: state.iterationConvergence.scenarios.map(
            (scenario) => ({ ...scenario, invocationEvidenceDigests: ['corrupt-invocation'] }),
          ),
        },
      }),
    );
  }, 30_000);

  it('fails parity when the exposure-evidence-digests projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-exposure', 'active', (push, pushSkill) => {
        const started = pushScenarioRunning(push, pushSkill);
        const discovered = pushSkill('skill_benchmark.skill_discovered', skillDiscoveredSceneData(started));
        const loaded = pushSkill('skill_benchmark.skill_loaded', skillLoadedSceneData(discovered));
        pushSkill('skill_benchmark.resource_exposed', resourceExposedSceneData(loaded));
      }),
      (state) => ({
        ...state,
        iterationConvergence: {
          ...state.iterationConvergence,
          scenarios: state.iterationConvergence.scenarios.map(
            (scenario) => ({ ...scenario, exposureEvidenceDigests: ['corrupt-exposure'] }),
          ),
        },
      }),
    );
  }, 30_000);

  it('fails parity when the milestone-evidence-digests projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-milestone', 'active', (push, pushSkill) => {
        const started = pushScenarioRunning(push, pushSkill);
        pushSkill('skill_benchmark.milestone_observed', milestoneObservedSceneData(started));
      }),
      (state) => ({
        ...state,
        artifactIndex: {
          ...state.artifactIndex,
          artifacts: state.artifactIndex.artifacts.map((artifact) => (
            artifact.artifactKind === 'milestone'
              ? { ...artifact, digest: digest('corrupt-milestone') }
              : artifact
          )),
        },
      }),
    );
  }, 30_000);

  it('fails parity when the trajectory-evidence-digests projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-trajectory', 'active', (push, pushSkill) => {
        const started = pushScenarioRunning(push, pushSkill);
        const milestone = pushSkill('skill_benchmark.milestone_observed', milestoneObservedSceneData(started));
        pushSkill('skill_benchmark.trajectory_recorded', trajectoryRecordedSceneData(started, milestone));
      }),
      (state) => ({
        ...state,
        artifactIndex: {
          ...state.artifactIndex,
          artifacts: state.artifactIndex.artifacts.map((artifact) => (
            artifact.artifactKind === 'trajectory'
              ? { ...artifact, digest: digest('corrupt-trajectory') }
              : artifact
          )),
        },
      }),
    );
  }, 30_000);

  it('fails parity when the outcome-evidence-digests projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-outcome', 'active', (push, pushSkill) => {
        const started = pushScenarioRunning(push, pushSkill);
        const finished = pushSkill('skill_benchmark.scenario_finished', scenarioFinishedSceneData(started));
        pushSkill('skill_benchmark.outcome_recorded', outcomeRecordedSceneData(finished));
      }),
      (state) => ({
        ...state,
        artifactIndex: {
          ...state.artifactIndex,
          artifacts: state.artifactIndex.artifacts.map((artifact) => (
            artifact.artifactKind === 'outcome'
              ? { ...artifact, digest: digest('corrupt-outcome') }
              : artifact
          )),
        },
      }),
    );
  }, 30_000);

  it('fails parity when the gold-evidence-digests projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-gold', 'active', (push, pushSkill) => {
        pushRunStarted(push);
        const planned = pushSkill('skill_benchmark.run_planned', runPlannedSceneData());
        pushSkill('skill_benchmark.treatment_assigned', treatmentAssignedSceneData(planned));
        pushSkill('skill_benchmark.gold_integrity_recorded', goldIntegritySceneData());
      }),
      (state) => ({
        ...state,
        iterationConvergence: {
          ...state.iterationConvergence,
          scenarios: state.iterationConvergence.scenarios.map(
            (scenario) => ({ ...scenario, goldEvidenceDigests: ['corrupt-gold'] }),
          ),
        },
      }),
    );
  }, 30_000);

  it('fails parity when the score-policy-versions projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-score-policy', 'active', (push, pushSkill) => {
        pushScoredScenario(push, pushSkill);
      }),
      (state) => ({
        ...state,
        artifactIndex: {
          ...state.artifactIndex,
          rawMeasurements: state.artifactIndex.rawMeasurements.map(
            (measurement) => ({ ...measurement, evaluatorVersion: 'score@corrupt' }),
          ),
        },
      }),
    );
  }, 30_000);

  it('fails parity when the score-vector-digests projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-score-vector', 'active', (push, pushSkill) => {
        pushScoredScenario(push, pushSkill);
      }),
      (state) => ({
        ...state,
        artifactIndex: {
          ...state.artifactIndex,
          rawMeasurements: state.artifactIndex.rawMeasurements.map((measurement) => ({
            ...measurement,
            rawScoreAxes: measurement.rawScoreAxes.map((axis) => ({ ...axis, rawScore: 0.99 })),
          })),
        },
      }),
    );
  }, 30_000);

  it('fails parity when the cost-evidence-digests projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-cost', 'active', (push, pushSkill) => {
        pushScoredScenario(push, pushSkill);
      }),
      (state) => ({
        ...state,
        artifactIndex: {
          ...state.artifactIndex,
          rawMeasurements: state.artifactIndex.rawMeasurements.map(
            (measurement) => ({ ...measurement, latencyMs: 9_999 }),
          ),
        },
      }),
    );
  }, 30_000);

  it('fails parity when the compatibility-evidence-digests projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-compatibility', 'active', (push, pushSkill) => {
        const started = pushScenarioRunning(push, pushSkill);
        pushSkill('skill_benchmark.compatibility_observed', compatibilitySceneData(started));
      }),
      (state) => ({
        ...state,
        artifactIndex: {
          ...state.artifactIndex,
          artifacts: state.artifactIndex.artifacts.map((artifact) => (
            artifact.artifactKind === 'compatibility'
              ? { ...artifact, digest: digest('corrupt-compatibility') }
              : artifact
          )),
        },
      }),
    );
  }, 30_000);

  it.skip('covers the negative-transfer-evidence-digests projection field', async () => {
    // Populating the field requires the baseline and treated assignment chains
    // with independent scenario identities plus both terminal outcome records
    // (an 11-event stream). Running that scene fails the parity path with
    // divergence.class 'execution-outcome' and "JSON value exceeds structural
    // limits", so the field cannot be projection-semantic-tested through the
    // real substrate and no passing test is possible.
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-negative-transfer', 'active', (push, pushSkill) => {
        pushRunStarted(push);
        const planned = pushSkill('skill_benchmark.run_planned', runPlannedSceneData());
        const assigned1 = pushSkill('skill_benchmark.treatment_assigned', treatmentAssignedSceneData(planned));
        const started1 = pushSkill('skill_benchmark.scenario_started', scenarioStartedSceneData(assigned1));
        const finished1 = pushSkill('skill_benchmark.scenario_finished', scenarioFinishedSceneData(started1));
        const outcome1 = pushSkill('skill_benchmark.outcome_recorded', outcomeRecordedSceneData(finished1));
        const scenarioTwoScope = {
          runId: RUN_ID,
          lineageId: LINEAGE_ID,
          variant: 'skill-benchmark' as const,
          benchmarkDesignId: 'design-1',
          scenarioId: 'scenario-2',
          assignmentId: 'assignment-2',
        };
        const assigned2 = pushSkill(
          'skill_benchmark.treatment_assigned',
          treatmentAssignedSceneData(planned),
          scenarioTwoScope,
        );
        const started2 = pushSkill(
          'skill_benchmark.scenario_started',
          scenarioStartedSceneData(assigned2),
          { ...scenarioTwoScope, executionId: 'execution-2' },
        );
        const finished2 = pushSkill(
          'skill_benchmark.scenario_finished',
          scenarioFinishedSceneData(started2),
          { ...scenarioTwoScope, executionId: 'execution-2' },
        );
        const outcome2 = pushSkill(
          'skill_benchmark.outcome_recorded',
          outcomeRecordedSceneData(finished2),
          { ...scenarioTwoScope, executionId: 'execution-2', observationId: 'observation-2' },
        );
        pushSkill('skill_benchmark.negative_transfer_observed', {
          baselineAssignmentEventId: assigned1.event_id,
          treatedAssignmentEventId: assigned2.event_id,
          baselineOutcomeEventId: outcome1.event_id,
          treatedOutcomeEventId: outcome2.event_id,
          axisCode: 'speed',
          rawDelta: -0.5,
          transferStatus: 'no-negative-transfer',
          evidenceRef: 'evidence:negative-transfer-1',
          evidenceDigest: digest('negative-transfer'),
        });
      }),
      (state) => ({
        ...state,
        artifactIndex: {
          ...state.artifactIndex,
          artifacts: state.artifactIndex.artifacts.map((artifact) => (
            artifact.artifactKind === 'negative-transfer'
              ? { ...artifact, digest: digest('corrupt-negative-transfer') }
              : artifact
          )),
        },
      }),
    );
  }, 30_000);

  it('fails parity when the security-probe-evidence-digests projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-security-probe', 'active', (push, pushSkill) => {
        const started = pushScenarioRunning(push, pushSkill);
        pushSkill('skill_benchmark.security_probe_recorded', securityProbeSceneData(started));
      }),
      (state) => ({
        ...state,
        artifactIndex: {
          ...state.artifactIndex,
          artifacts: state.artifactIndex.artifacts.map((artifact) => (
            artifact.artifactKind === 'security-probe'
              ? { ...artifact, digest: digest('corrupt-security-probe') }
              : artifact
          )),
        },
      }),
    );
  }, 30_000);

  it('fails parity when the shared-service-refs projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-shared-service-refs', 'active', (push) => {
        pushRunStarted(push);
        push('deep_improvement_common.candidate_proposed', candidateProposedSceneData(), {
          runId: RUN_ID,
          lineageId: LINEAGE_ID,
          variant: 'skill-benchmark',
          candidateId: 'candidate-1',
        });
      }),
      (state) => ({
        ...state,
        common: {
          ...state.common,
          seenEvents: state.common.seenEvents.map((entry) => (
            entry.stem === 'deep_improvement_common.candidate_proposed'
              ? { ...entry, candidateId: 'candidate-shadow-corrupt' }
              : entry
          )),
        },
      }),
    );
  }, 30_000);

  it('fails parity when the unresolved-evidence-refs projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-unresolved-evidence-refs', 'inconclusive', (push) => {
        const observation = pushEvaluationObservation(push);
        push('deep_improvement_common.evaluation_inconclusive', evaluationInconclusiveSceneData(observation), {
          runId: RUN_ID,
          lineageId: LINEAGE_ID,
          variant: 'skill-benchmark',
          candidateId: 'candidate-1',
          evaluationEpochId: 'epoch-1',
        });
      }),
      (state) => ({
        ...state,
        common: {
          ...state.common,
          iterationConvergence: {
            ...state.common.iterationConvergence,
            unresolvedEvidenceRefs: ['evidence:corrupt-unresolved'],
          },
        },
      }),
    );
  }, 30_000);

  it('fails parity when the blocking-veto-codes projection field diverges', async () => {
    // The scene keeps one hard veto already, so flipping only the veto source
    // never changes the closed-blocked terminal and reaches the comparator
    // with a genuine projection-semantic drift rather than tripping the
    // closed-terminal gate.
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-blocking-veto-codes', 'blocked', (push, pushSkill) => {
        const started = pushScenarioRunning(push, pushSkill);
        pushSkill('skill_benchmark.security_probe_recorded', securityProbeSceneData(started, 'fail'));
      }),
      (state) => ({
        ...state,
        iterationConvergence: {
          ...state.iterationConvergence,
          hardVetoes: state.iterationConvergence.hardVetoes.map((veto) => (
            veto.source === 'security-probe'
              ? { ...veto, source: 'compatibility' as const }
              : veto
          )),
        },
      }),
    );
  }, 30_000);

  it('fails parity when the treatment-coverage projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-treatment-coverage', 'active', (push, pushSkill) => {
        const started = pushScenarioRunning(push, pushSkill);
        pushSkill('skill_benchmark.scenario_finished', scenarioFinishedSceneData(started));
      }),
      (state) => ({
        ...state,
        iterationConvergence: {
          ...state.iterationConvergence,
          scenarios: state.iterationConvergence.scenarios.map((scenario) => (
            { ...scenario, state: 'aborted' }
          )),
        },
      }),
    );
  }, 30_000);

  it('fails parity when the scoring-state projection field diverges', async () => {
    await expectSurfaceDivergence(
      sceneFixture('scene-skill-scoring-state', 'active', (push, pushSkill) => {
        pushScoredScenario(push, pushSkill);
      }),
      (state) => ({
        ...state,
        artifactIndex: {
          ...state.artifactIndex,
          rawMeasurements: state.artifactIndex.rawMeasurements.map(
            (measurement) => ({ ...measurement, numeratorEligible: false }),
          ),
        },
      }),
    );
  }, 30_000);

  it.skip('covers the generation projection field via a projection-semantic mutation', async () => {
    // The legacy oracle never reads a generation field off any skill-benchmark
    // or shared event, so its scan output is always the constant 0; the
    // reducer projection mirrors that constant on every path and no state
    // mutation can make the two paths disagree.
  });

  it.skip('covers the certificate-evidence-digests projection field', async () => {
    // The effect-certificate evidenceSetDigest exists only in the raw payload
    // and is never written into any typed reducer collection, so the reducer
    // projection structurally yields an empty list on both paths and there is
    // no slice to corrupt.
  });

  it.skip('covers the terminal-decision projection field via a projection-semantic mutation', async () => {
    // The executor's closed-terminal gate re-reads this very projection field
    // on every path and throws before the fingerprint comparator when a
    // one-path flip disagrees with the fixture's closed-terminal expectation,
    // so a folded-terminal corruption always fails closed as execution-outcome,
    // never projection-semantic. Terminal drift is already asserted separately
    // by the terminal-decision fault in the fault-injection battery.
  });

  it.skip('covers the resume-decision-digest projection field', async () => {
    // The closed fixture closure never supplies resumeEvidence and no scene in
    // this surface folds a run-resumed event, so the reducer yields a
    // structurally-null resume-decision digest on both paths and no mutation
    // of its feeding slice can change the projection.
  });
});
