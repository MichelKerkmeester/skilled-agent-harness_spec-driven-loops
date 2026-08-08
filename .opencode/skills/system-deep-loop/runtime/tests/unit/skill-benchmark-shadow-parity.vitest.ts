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
  SkillBenchmarkParityCaseRun,
  SkillBenchmarkParityDiffClass,
  SkillBenchmarkParityFaultKind,
  SkillBenchmarkParityFixture,
  SkillBenchmarkParityFixtureScenario,
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
): SkillBenchmarkEventEnvelope<TStem> {
  const prior = events.at(-1) ?? null;
  const sequence = events.length + 1;
  const event = prepareSkillBenchmarkEvent({
    stem,
    scope: commonScope(stem),
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
): SkillBenchmarkEventEnvelope<TStem> {
  const prior = events.at(-1) ?? null;
  const sequence = events.length + 1;
  const input: SkillBenchmarkEventInput<TStem> = {
    stem,
    scope: skillScope(stem),
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

function fixture(
  scenario: SkillBenchmarkParityFixtureScenario = 'full-skill',
  fixtureId = `fixture-${scenario}`,
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
    events: executionFixtureEvents(),
    expectedTerminalDecision: 'completed',
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

  it('proves the lifecycle map closes shared and skill-specific events', () => {
    expect(DeepImprovementCommonEventStems.length).toBeGreaterThan(0);
    expect(() => verifySkillBenchmarkLifecycleEventMap()).not.toThrow();
  });
});
