// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Shadow Parity Tests
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
import * as modelBenchmarkReducers from '../../lib/model-benchmark-reducers/index.js';
import {
  MODEL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
  createModelBenchmarkEventRegistry,
  prepareModelBenchmarkEvent,
} from '../../lib/model-benchmark-ledger-schema/index.js';
import {
  MODEL_BENCHMARK_REQUIRED_FIXTURE_SCENARIOS,
  MODEL_BENCHMARK_SHARED_PARITY_SERVICES,
  MODEL_BENCHMARK_VOLATILITY_ALLOWLIST,
  canonicalizeModelBenchmarkEventStream,
  compareModelBenchmarkEventStreams,
  compileModelBenchmarkParityManifest,
  createModelBenchmarkModeGateInput,
  createModelBenchmarkParityCaseDefinition,
  createModelBenchmarkParityExecutors,
  modelBenchmarkParityInitialStateDigest,
  parseModelBenchmarkModeGateInput,
  verifyModelBenchmarkLifecycleEventMap,
} from '../../lib/model-benchmark-shadow-parity/index.js';
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
  compileParityCaseManifest,
  runShadowParityCase,
} from '../../lib/shadow-parity/index.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
} from '../../lib/authorized-ledger/index.js';
import type {
  ModelBenchmarkEventEnvelope,
  ModelBenchmarkEventInput,
  ModelBenchmarkLedgerEvent,
  ModelBenchmarkPayloadMap,
  ModelBenchmarkReplayMetadata,
  ModelBenchmarkScopeMap,
  ModelBenchmarkSpecificEventStem,
  TaskLineage,
  TrialMatrixKey,
} from '../../lib/model-benchmark-ledger-schema/index.js';
import type {
  ModelBenchmarkParityCaseRun,
  ModelBenchmarkParityDiffClass,
  ModelBenchmarkParityFaultKind,
  ModelBenchmarkParityFixture,
  ModelBenchmarkParityFixtureScenario,
} from '../../lib/model-benchmark-shadow-parity/index.js';
import type {
  ArtifactAuthorizationContext,
  ArtifactEventMetadata,
  ArtifactEventRecorder,
  ArtifactReferenceSet,
  VerifiedArtifactEvidence,
} from '../../lib/sealed-reference-artifacts/index.js';
import type {
  ParityCaseCapsule,
  ParityCaseManifest,
} from '../../lib/shadow-parity/index.js';

const BASE_SHA = '0360360360360360360360360360360360360360';
const OTHER_BASE_SHA = '1371371371371371371371371371371371371371';
const TIMESTAMP = '2026-07-28T10:00:00.000Z';
const RUN_ID = 'model-parity-run-1';
const LINEAGE_ID = 'model-parity-lineage-1';
const CANDIDATE_ID = 'model-parity-candidate-1';
const STREAM_ID = 'model-parity-stream-1';
const ZERO_DIGEST = '0'.repeat(64);
const temporaryRoots: string[] = [];
const registry = createModelBenchmarkEventRegistry();

const FAULT_CASES = Object.freeze([
  { kind: 'drop-event', expectedClass: 'missing' },
  { kind: 'extra-event', expectedClass: 'extra' },
  { kind: 'duplicate-event', expectedClass: 'duplicated' },
  { kind: 'reorder-event', expectedClass: 'reordered' },
  { kind: 'causal-link', expectedClass: 'causal-link' },
  { kind: 'payload', expectedClass: 'payload' },
  { kind: 'receipt', expectedClass: 'receipt' },
  { kind: 'artifact', expectedClass: 'artifact' },
  { kind: 'projection', expectedClass: 'projection' },
  { kind: 'authorization', expectedClass: 'unauthorized' },
  { kind: 'contamination', expectedClass: 'contamination' },
  { kind: 'evaluator-integrity', expectedClass: 'evaluator-integrity' },
  { kind: 'input-inequality', expectedClass: 'input-inequality' },
  { kind: 'latency', expectedClass: 'latency' },
  { kind: 'malformed', expectedClass: 'malformed' },
  { kind: 'nondeterministic', expectedClass: 'nondeterministic' },
  { kind: 'reference-digest', expectedClass: 'reference-digest' },
  { kind: 'resume-continuity', expectedClass: 'resume-continuity' },
  { kind: 'score', expectedClass: 'score' },
  { kind: 'shared-reference', expectedClass: 'shared-reference' },
  { kind: 'stale', expectedClass: 'stale' },
  { kind: 'telemetry-gap', expectedClass: 'telemetry-gap' },
  { kind: 'terminal-decision', expectedClass: 'terminal-decision' },
  { kind: 'unauthorized', expectedClass: 'unauthorized' },
  { kind: 'unsupported-version', expectedClass: 'unsupported-version' },
  { kind: 'usage', expectedClass: 'usage' },
  { kind: 'validity', expectedClass: 'validity' },
  { kind: 'workload', expectedClass: 'workload' },
] as const satisfies readonly Readonly<{
  kind: ModelBenchmarkParityFaultKind;
  expectedClass: ModelBenchmarkParityDiffClass;
}>[]);

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `model-benchmark-parity-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function replayMetadata(): ModelBenchmarkReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest('model-benchmark-parity-replay'),
    replay_input_digests: {
      configuration: digest('configuration'),
      evaluator: digest('evaluator'),
      manifest: digest('manifest'),
    },
  };
}

function trialMatrixKey(): TrialMatrixKey {
  return {
    candidateId: CANDIDATE_ID,
    modelFingerprint: digest('model-1'),
    executionPath: 'provider/direct',
    taskInstanceId: 'task-1',
    taskFamilyId: 'family-1',
    pairedBlockId: 'pair-1',
    protocolVariant: 'standard',
    seed: 7,
    perturbationId: 'none',
    workloadProfileId: 'workload-1',
    promptRecipeFingerprint: digest('prompt-1'),
    routeFingerprint: digest('route-1'),
    frameworkFingerprint: digest('framework-1'),
    toolRecipeFingerprint: digest('tools-1'),
    attempt: 1,
  };
}

function taskLineage(): TaskLineage {
  return {
    sourceCutoffAt: TIMESTAMP,
    visibility: 'sealed',
    proposerVisibility: 'blind',
    oracleVisibility: 'blind',
    parentCaseId: null,
    firstExposureAt: null,
    disclosedAt: null,
    retiredAt: null,
    replacementCaseId: null,
  };
}

function scopeFor<TStem extends ModelBenchmarkSpecificEventStem>(
  stem: TStem,
): ModelBenchmarkScopeMap[TStem] {
  const base = { runId: RUN_ID, lineageId: LINEAGE_ID, variant: 'model-benchmark' as const };
  const key = trialMatrixKey();
  if (stem === 'model_benchmark.benchmark_capsule_sealed') {
    return { ...base, capsuleId: 'capsule-1' } as ModelBenchmarkScopeMap[TStem];
  }
  if (stem === 'model_benchmark.workload_snapshot_sealed') {
    return { ...base, workloadSnapshotId: 'workload-1' } as ModelBenchmarkScopeMap[TStem];
  }
  if (stem === 'model_benchmark.benchmark_design_declared') {
    return { ...base, designId: 'design-1' } as ModelBenchmarkScopeMap[TStem];
  }
  if (stem === 'model_benchmark.trial_block_declared') {
    return { ...base, trialBlockId: 'block-1' } as ModelBenchmarkScopeMap[TStem];
  }
  if (stem.startsWith('model_benchmark.trial_')
    || stem === 'model_benchmark.score_vector_observed'
    || stem === 'model_benchmark.usage_observed'
    || stem === 'model_benchmark.judge_observation_recorded') {
    return {
      ...base,
      trialId: 'trial-1',
      taskInstanceId: key.taskInstanceId,
      taskFamilyId: key.taskFamilyId,
      candidateId: key.candidateId,
      modelFingerprint: key.modelFingerprint,
      executionPath: key.executionPath,
      pairedBlockId: key.pairedBlockId,
    } as ModelBenchmarkScopeMap[TStem];
  }
  if (stem === 'model_benchmark.contamination_evidence_recorded') {
    return {
      ...base,
      caseId: 'case-1',
      taskInstanceId: key.taskInstanceId,
      taskFamilyId: key.taskFamilyId,
    } as ModelBenchmarkScopeMap[TStem];
  }
  if (stem === 'model_benchmark.judge_calibration_sealed') {
    return { ...base, judgeCalibrationId: 'calibration-1' } as ModelBenchmarkScopeMap[TStem];
  }
  if (stem === 'model_benchmark.validity_plan_sealed'
    || stem === 'model_benchmark.validity_card_derived'
    || stem === 'model_benchmark.validity_unknown_recorded') {
    return { ...base, validityPlanId: 'validity-plan-1' } as ModelBenchmarkScopeMap[TStem];
  }
  if (stem === 'model_benchmark.selection_evidence_sealed'
    || stem === 'model_benchmark.selection_reduction_requested') {
    return { ...base, evidenceSetId: 'evidence-set-1' } as ModelBenchmarkScopeMap[TStem];
  }
  return base as ModelBenchmarkScopeMap[TStem];
}

function append<TStem extends ModelBenchmarkSpecificEventStem>(
  events: ModelBenchmarkLedgerEvent[],
  stem: TStem,
  data: ModelBenchmarkPayloadMap[TStem],
): ModelBenchmarkEventEnvelope<TStem> {
  const previous = events.at(-1) ?? null;
  const sequence = events.length + 1;
  const input: ModelBenchmarkEventInput<TStem> = {
    stem,
    scope: scopeFor(stem),
    data,
    prevEventHash: previous === null ? ZERO_DIGEST : digest(previous),
    replay: replayMetadata(),
    eventId: `model-parity-event-${String(sequence).padStart(3, '0')}`,
    streamId: STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'model-benchmark-parity-tests', version: '1' },
    authorityEpoch: 1,
    correlationId: `transport-${digest({ sequence }).slice(0, 16)}`,
    causationId: previous?.event_id ?? null,
    idempotencyKey: `model-parity-event-${sequence}`,
  };
  const event = prepareModelBenchmarkEvent(input, registry).envelope as ModelBenchmarkEventEnvelope<TStem>;
  events.push(event);
  return event;
}

function fullFixtureEvents(): readonly ModelBenchmarkLedgerEvent[] {
  const events: ModelBenchmarkLedgerEvent[] = [];
  const commonHash = digest('model-fixture');
  const declared = append(events, 'model_benchmark.run_declared', {
    generation: 1,
    benchmarkRecipeRef: 'benchmark-recipe:1',
    benchmarkRecipeDigest: commonHash,
    evaluatorServiceRef: 'service:evaluator',
    canaryServiceRef: 'service:canary',
    promotionServiceRef: 'service:promotion',
    sharedServiceContractVersion: 'deep-improvement-common@1',
    replayFingerprint: commonHash,
  });
  const capsule = append(events, 'model_benchmark.benchmark_capsule_sealed', {
    capsuleRef: 'capsule:1',
    capsuleDigest: commonHash,
    taskSetDigest: commonHash,
    taskLineage: taskLineage(),
    canarySuiteRef: 'canary:1',
    canarySuiteDigest: commonHash,
    sealReceiptRef: 'receipt:capsule',
  });
  const workload = append(events, 'model_benchmark.workload_snapshot_sealed', {
    workloadSnapshotRef: 'workload:1',
    workloadSnapshotDigest: commonHash,
    taskFamilyIds: ['family-1'],
    caseCount: 1,
    workloadProfileVersion: 'workload@1',
    snapshotAt: TIMESTAMP,
    sealReceiptRef: 'receipt:workload',
  });
  append(events, 'model_benchmark.run_started', {
    declarationEventId: declared.event_id,
    declarationPayloadDigest: declared.payload.payloadDigest,
    capsuleEventId: capsule.event_id,
    capsulePayloadDigest: capsule.payload.payloadDigest,
    workloadEventId: workload.event_id,
    workloadPayloadDigest: workload.payload.payloadDigest,
    executionReceiptRef: 'receipt:start',
    startedAt: TIMESTAMP,
  });
  append(events, 'model_benchmark.trial_block_declared', {
    taskFamilyId: 'family-1',
    candidateIds: [CANDIDATE_ID],
    modelFingerprints: [trialMatrixKey().modelFingerprint],
    executionPaths: [trialMatrixKey().executionPath],
    pairedBlockIds: [trialMatrixKey().pairedBlockId],
    protocolVariants: [trialMatrixKey().protocolVariant],
    seed: trialMatrixKey().seed,
    perturbationId: trialMatrixKey().perturbationId,
    workloadProfileId: trialMatrixKey().workloadProfileId,
    blockDigest: commonHash,
  });
  append(events, 'model_benchmark.trial_case_admitted', {
    trialMatrixKey: trialMatrixKey(),
    caseRef: 'case:1',
    caseDigest: commonHash,
    taskLineage: taskLineage(),
    admissionPolicyVersion: 'admission@1',
    admissionReasonCode: 'eligible',
  });
  const dispatched = append(events, 'model_benchmark.trial_dispatched', {
    trialMatrixKey: trialMatrixKey(),
    inputRef: 'input:1',
    inputDigest: commonHash,
    dispatchReceiptRef: 'receipt:dispatch',
    dispatchReceiptDigest: commonHash,
    dispatchedAt: TIMESTAMP,
  });
  const completed = append(events, 'model_benchmark.trial_completed', {
    trialMatrixKey: trialMatrixKey(),
    dispatchedEventId: dispatched.event_id,
    dispatchedPayloadDigest: dispatched.payload.payloadDigest,
    rawResultRef: 'raw-result:1',
    rawResultDigest: digest('raw-result'),
    inputDigest: commonHash,
    outputDigest: digest('raw-output'),
    completionReceiptRef: 'receipt:complete',
    completedAt: TIMESTAMP,
  });
  const observation = append(events, 'model_benchmark.trial_observation_recorded', {
    trialMatrixKey: trialMatrixKey(),
    completedEventId: completed.event_id,
    completedPayloadDigest: completed.payload.payloadDigest,
    inputDigest: commonHash,
    rawOutputRef: 'raw-output:1',
    rawOutputDigest: digest('raw-output'),
    evaluatorObservationRef: 'observation:1',
    evaluatorObservationDigest: digest('observation'),
    executionReceiptRef: 'receipt:observation',
  });
  const score = append(events, 'model_benchmark.score_vector_observed', {
    trialMatrixKey: trialMatrixKey(),
    observationEventId: observation.event_id,
    observationPayloadDigest: observation.payload.payloadDigest,
    scorePolicyVersion: 'score@1',
    scoreWriteBackendRef: MODEL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
    scoreVector: {
      components: [{
        dimensionCode: 'quality',
        rawScore: 0.95,
        hardFloorStatus: 'pass',
        measurementStatus: 'observed',
        uncertainty: 0.05,
        observationRef: 'observation:quality',
        observationDigest: digest('quality'),
      }],
      evaluatorContractHash: digest('evaluator-contract'),
      evaluatorFingerprint: digest('evaluator'),
    },
    scoringReceiptRef: 'receipt:score',
  });
  append(events, 'model_benchmark.usage_observed', {
    trialMatrixKey: trialMatrixKey(),
    observationEventId: observation.event_id,
    usage: {
      inputTokens: 10,
      outputTokens: 20,
      reasoningTokens: 5,
      cacheReadTokens: 1,
      cacheWriteTokens: 1,
      retryCount: 0,
      realizedCostMicrounits: 100,
      currencyCode: 'USD',
    },
    latency: { ttftMs: 10, interTokenP50Ms: 2, endToEndMs: 100, tailP95Ms: 150 },
    usageReceiptRef: 'receipt:usage',
    usageReceiptDigest: digest('usage'),
  });
  const judge = append(events, 'model_benchmark.judge_observation_recorded', {
    trialMatrixKey: trialMatrixKey(),
    scoreEventId: score.event_id,
    scorePayloadDigest: score.payload.payloadDigest,
    blindedJudgeRef: 'judge:blind-1',
    judgeFamilyCode: 'quality',
    judgeBuildFingerprint: digest('judge-build'),
    promptDigest: digest('judge-prompt'),
    contextDigest: digest('judge-context'),
    toolDigest: digest('judge-tools'),
    calibrationSliceId: 'calibration-slice-1',
    orderProbeOutcome: 'pass',
    styleProbeOutcome: 'pass',
    confidence: 0.9,
    uncertainty: 0.1,
    abstained: false,
    disagreementState: 'resolved',
    observationRef: 'judge-observation:1',
    observationDigest: digest('judge-observation'),
  });
  append(events, 'model_benchmark.judge_calibration_sealed', {
    blindedJudgeRef: 'judge:blind-1',
    judgeFamilyCode: 'quality',
    judgeBuildFingerprint: digest('judge-build'),
    calibrationSliceId: 'calibration-slice-1',
    calibrationRef: 'calibration:1',
    calibrationDigest: digest('calibration'),
    orderProbeDigest: digest('order-probe'),
    styleProbeDigest: digest('style-probe'),
    calibrationPolicyVersion: 'calibration@1',
    sealReceiptRef: 'receipt:calibration',
  });
  const contamination = append(events, 'model_benchmark.contamination_evidence_recorded', {
    contaminationStatus: 'clean',
    detectorFingerprint: digest('contamination-detector'),
    evidenceRef: 'contamination-evidence:1',
    evidenceDigest: digest('contamination-evidence'),
    exposureEventIds: [],
    reasonCode: 'checked',
  });
  append(events, 'model_benchmark.benchmark_design_declared', {
    designRef: 'design:1',
    designDigest: digest('matrix'),
    candidateIds: [CANDIDATE_ID],
    taskFamilyIds: ['family-1'],
    pairedBlockIds: ['pair-1'],
    protocolVariants: ['standard'],
    familyQuotaPolicyVersion: 'quota@1',
    designPolicyVersion: 'design@1',
  });
  append(events, 'model_benchmark.validity_plan_sealed', {
    validityPlanRef: 'validity-plan:1',
    validityPlanDigest: digest('validity-plan'),
    requiredEvidenceCodes: ['score', 'judge', 'contamination'],
    hardBlockerCodes: ['hard-floor', 'contamination'],
    validityPolicyVersion: 'validity@1',
    sealReceiptRef: 'receipt:validity-plan',
  });
  const validity = append(events, 'model_benchmark.validity_card_derived', {
    state: 'valid',
    evidenceEventIds: [score.event_id, judge.event_id, contamination.event_id],
    evidenceSetDigest: digest('validity-evidence'),
    blockerCodes: [],
    uncertainty: 0.05,
    derivationPolicyVersion: 'validity@1',
    derivationReceiptRef: 'receipt:validity',
  });
  const selection = append(events, 'model_benchmark.selection_evidence_sealed', {
    evidenceEventIds: [score.event_id, judge.event_id, contamination.event_id],
    evidenceSetDigest: digest('selection-evidence'),
    manifestRef: 'manifest:selection',
    manifestDigest: digest('selection-manifest'),
    validityCardEventIds: [validity.event_id],
    sealedAt: TIMESTAMP,
    sealReceiptRef: 'receipt:selection',
  });
  append(events, 'model_benchmark.selection_reduction_requested', {
    sealedEvidenceEventId: selection.event_id,
    sealedEvidencePayloadDigest: selection.payload.payloadDigest,
    reducerContractVersion: 'model-benchmark-reducer@1',
    requestReceiptRef: 'receipt:reduction',
    requestedAt: TIMESTAMP,
  });
  const prior = events.at(-1) as ModelBenchmarkLedgerEvent;
  append(events, 'model_benchmark.run_closed', {
    terminalOutcome: 'completed',
    finalLedgerTailHash: digest(prior),
    counts: {
      admittedTrials: 1,
      completedTrials: 1,
      failedTrials: 0,
      unknownTrials: 0,
      invalidatedTrials: 0,
    },
    completionEvidenceRefs: ['evidence:completion'],
    closedAt: TIMESTAMP,
  });
  return Object.freeze(events);
}

function fixtureEvents(): readonly ModelBenchmarkLedgerEvent[] {
  const selectedStems = new Set([
    'model_benchmark.run_declared',
    'model_benchmark.benchmark_capsule_sealed',
    'model_benchmark.workload_snapshot_sealed',
    'model_benchmark.run_started',
    'model_benchmark.run_closed',
  ]);
  const events: ModelBenchmarkLedgerEvent[] = [];
  for (const source of fullFixtureEvents().filter(
    (event) => selectedStems.has(event.payload.stem),
  )) {
    const previous = events.at(-1) ?? null;
    const sequence = events.length + 1;
    const data = source.payload.stem === 'model_benchmark.run_closed'
      ? { ...source.payload.data, finalLedgerTailHash: digest(previous) }
      : source.payload.data;
    const event = prepareModelBenchmarkEvent({
      stem: source.payload.stem,
      scope: source.payload.scope,
      data,
      prevEventHash: previous === null ? ZERO_DIGEST : digest(previous),
      replay: replayMetadata(),
      eventId: `model-parity-event-${String(sequence).padStart(3, '0')}`,
      streamId: STREAM_ID,
      streamSequence: sequence,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'model-benchmark-parity-tests', version: '1' },
      authorityEpoch: 1,
      correlationId: `transport-${digest({ sequence }).slice(0, 16)}`,
      causationId: previous?.event_id ?? null,
      idempotencyKey: `model-parity-event-${sequence}`,
    } as ModelBenchmarkEventInput<typeof source.payload.stem>, registry).envelope;
    events.push(event as ModelBenchmarkLedgerEvent);
  }
  return Object.freeze(events);
}

function fixture(
  scenario: ModelBenchmarkParityFixtureScenario = 'healthy-multi-model',
  fixtureId = `fixture-${scenario}`,
): ModelBenchmarkParityFixture {
  const provisional: ModelBenchmarkParityFixture = {
    fixtureId,
    scenario,
    frozenInput: {
      baseSha: BASE_SHA,
      runManifestDigest: digest({ scenario, manifest: 1 }),
      benchmarkRecipeDigest: digest('benchmark-recipe'),
      modelExecutorMatrixDigest: digest('model-executor-matrix'),
      taskFixtureSetDigest: digest('task-fixture-set'),
      anchorPolicyDigest: digest('anchor-policy'),
      diagnosticPolicyDigest: digest('diagnostic-policy'),
      evaluatorEpochDigest: digest('evaluator-epoch'),
      judgeConfigurationDigest: digest('judge-configuration'),
      workloadProfileDigest: digest('workload-profile'),
      contaminationVisibilityDigest: digest('contamination-visibility'),
      seedPolicyDigest: digest('seed-policy'),
      baselineDigest: digest('baseline'),
      commonServiceContractDigest: digest(MODEL_BENCHMARK_SHARED_PARITY_SERVICES),
      sealedArtifactContractDigest: digest(
        MODEL_BENCHMARK_SHARED_PARITY_SERVICES.sealedArtifactContract,
      ),
      initialStateDigest: digest('pending-initial-state'),
      configurationDigest: digest({ mode: 'model-benchmark', comparator: 1 }),
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
    events: fixtureEvents(),
    expectedTerminalDecision: 'completed',
    resumeEvidence: null,
    commonParityReceiptDigest: digest('common-parity-receipt'),
  };
  return Object.freeze({
    ...provisional,
    frozenInput: Object.freeze({
      ...provisional.frozenInput,
      initialStateDigest: modelBenchmarkParityInitialStateDigest(provisional),
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
    ledgerId: 'model-parity-artifacts',
    auditLedgerId: 'model-parity-artifact-audit',
    authorityProvider: () => authority,
    now: () => new Date(TIMESTAMP),
  }, eventRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: join(root, 'ledger'),
    auditLedgerId: 'model-parity-artifact-audit',
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
      streamId: 'model-parity-artifact-stream',
      streamSequence: index,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'model-parity-tests', version: '1' },
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
      actorId: 'model-parity-tests',
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
    { mode: 'model-benchmark', source: 'frozen-fixture' },
    'fixture',
  );
  const configuration = await seal(
    harness,
    InitialArtifactKinds.CONFIGURATION,
    { mode: 'model-benchmark', authority: 'legacy' },
    'configuration',
  );
  return { harness, referenceSet: bindVerifiedArtifactReferences([frozenFixture, configuration]) };
}

function capsule(
  parityFixture: ModelBenchmarkParityFixture,
  referenceSet: ArtifactReferenceSet,
): ParityCaseCapsule {
  return {
    baseSha: parityFixture.frozenInput.baseSha,
    baseDigest: digest({ baseSha: parityFixture.frozenInput.baseSha }),
    initialStateDigest: parityFixture.frozenInput.initialStateDigest,
    configurationDigest: parityFixture.frozenInput.configurationDigest,
    canonicalizationVersions: {
      event: 'model-benchmark-event@1',
      comparator: 'model-benchmark-event-comparator@1',
    },
    artifactReferenceSet: referenceSet,
    timeoutMs: 30_000,
    terminationPolicy: 'model-benchmark-bounded-shadow',
  };
}

function targetedManifest(parityFixture: ModelBenchmarkParityFixture): ParityCaseManifest {
  const definition = createModelBenchmarkParityCaseDefinition(parityFixture);
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
  parityFixture: ModelBenchmarkParityFixture,
  fault?: Readonly<{
    path: 'ledger' | 'legacy';
    kind: ModelBenchmarkParityFaultKind;
    eventIndex: number;
  }>,
): Promise<Readonly<{
  run: ModelBenchmarkParityCaseRun;
  result: Awaited<ReturnType<typeof runShadowParityCase>>;
}>> {
  const sealed = await sealedBoundary();
  const boundary = {
    ledger: sealed.harness.ledger,
    store: sealed.harness.store,
    capsule: capsule(parityFixture, sealed.referenceSet),
  };
  const run = {
    caseDefinition: createModelBenchmarkParityCaseDefinition(parityFixture),
    legacyBoundary: boundary,
    ledgerBoundary: boundary,
    fixture: parityFixture,
    executors: createModelBenchmarkParityExecutors(parityFixture, fault),
    modeCertificateVerification: { input: {} as never },
    shadowRootDirectory: join(temporaryRoot('execution'), 'shadow'),
    protectedRoots: [join(temporaryRoot('authority'), 'legacy-live')],
    deterministicRuns: 2,
  } satisfies ModelBenchmarkParityCaseRun;
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
  events: readonly ModelBenchmarkLedgerEvent[],
  path: 'ledger' | 'legacy',
): readonly ModelBenchmarkLedgerEvent[] {
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
  } as ModelBenchmarkLedgerEvent)));
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('model benchmark shadow parity', () => {
  it('pairs independent event ids while honoring the closed volatility allowlist', () => {
    const events = fixtureEvents();
    const fingerprints = events.map((_, index) => digest({ projection: index }));
    const legacy = canonicalizeModelBenchmarkEventStream(
      independentTransportEvents(events, 'legacy'),
      fingerprints,
    );
    const ledger = canonicalizeModelBenchmarkEventStream(
      independentTransportEvents(events, 'ledger'),
      fingerprints,
    );

    expect(MODEL_BENCHMARK_VOLATILITY_ALLOWLIST.map((entry) => entry.field)).toEqual([
      'occurred_at', 'recorded_at', 'correlation_id',
    ]);
    expect(legacy.map((entry) => entry.eventId)).not.toEqual(
      ledger.map((entry) => entry.eventId),
    );
    expect(compareModelBenchmarkEventStreams('fixture-independent', legacy, ledger)).toEqual([]);

    const changed = ledger.map((entry, index) => index === 3
      ? Object.freeze({ ...entry, stablePayloadDigest: digest('semantic-change') })
      : entry);
    expect(compareModelBenchmarkEventStreams(
      'fixture-independent',
      legacy,
      changed,
    ).map((entry) => entry.class)).toContain('payload');
  });

  it('rejects malformed values in every allowlisted volatility slot', () => {
    const event = fixtureEvents()[0];
    const fingerprint = digest('projection');
    expect(() => canonicalizeModelBenchmarkEventStream([{
      ...event,
      correlation_id: 'semantic-model-id',
    }], [fingerprint])).toThrow(/transport-only token grammar/);
    expect(() => canonicalizeModelBenchmarkEventStream([{
      ...event,
      recorded_at: 'not-a-timestamp',
    }], [fingerprint])).toThrow(/volatile timestamps/);
  });

  it('uses distinct implementations and preserves the common parity contract identity', () => {
    const executors = createModelBenchmarkParityExecutors(fixture());
    expect(executors.legacy).not.toBe(executors.ledger);
    expect(executors.legacyOracleImplementation).toBe('modeled-legacy-oracle');
    expect(executors.ledgerImplementation).toBe('typed-ledger-pipeline');
    expect(executors.commonParityContractId).toBe('deep-improvement-common-shadow-parity');
    expect(executors.substrateImportsReal).toBe(true);
  });

  it('runs a real zero-diff dual path through authorization, ledger, reducer, and replay', async () => {
    const parityFixture = fixture();
    const outcome = await genericRun(parityFixture);
    expect(outcome.result, JSON.stringify(outcome.result)).toMatchObject({ ok: true });
    const evidence = outcome.run.executors.evidence();
    expect(evidence).toHaveLength(4);
    expect(new Set(evidence.map((entry) => entry.implementationKind))).toEqual(new Set([
      'modeled-legacy-oracle', 'typed-ledger-pipeline',
    ]));
    expect(compareModelBenchmarkEventStreams(
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
    // despite the reducer having computed a wrong artifact digest. The
    // rebuilt harness must FAIL here.
    const realFold = modelBenchmarkReducers.foldModelBenchmarkEvents;
    const foldSpy = vi.spyOn(modelBenchmarkReducers, 'foldModelBenchmarkEvents')
      .mockImplementation((events, options) => {
        const real = realFold(events, options);
        if (real.outcome !== 'projected') return real;
        return {
          ...real,
          projection: {
            ...real.projection,
            modelBenchmark: {
              ...real.projection.modelBenchmark,
              artifactIndex: {
                artifacts: real.projection.modelBenchmark.artifactIndex.artifacts.map(
                  (artifact) => artifact.artifactKind === 'workload-snapshot'
                    ? { ...artifact, digest: digest('corrupted-workload-snapshot-digest') }
                    : artifact,
                ),
              },
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

  it('drives injected payload drift through the complete real substrate', async () => {
    const parityFixture = fixture();
    const outcome = await genericRun(parityFixture, {
      path: 'ledger',
      kind: 'payload',
      eventIndex: 3,
    });
    expect(outcome.result.ok).toBe(false);
    const legacy = outcome.run.executors.evidence()
      .find((entry) => entry.path === 'legacy')?.observations ?? [];
    const ledger = outcome.run.executors.evidence()
      .find((entry) => entry.path === 'ledger')?.observations ?? [];
    expect(compareModelBenchmarkEventStreams(
      parityFixture.fixtureId,
      legacy,
      ledger,
    ).map((entry) => entry.class)).toContain('payload');
  }, 30_000);

  it.each(FAULT_CASES)(
    'classifies $kind as exact typed $expectedClass through the real comparator',
    ({ expectedClass }) => {
      const events = fixtureEvents();
      const fingerprints = events.map((_, index) => digest({ projection: index }));
      const legacy = canonicalizeModelBenchmarkEventStream(events, fingerprints);
      const ledger = [...legacy];
      const index = 3;
      if (expectedClass === 'missing') ledger.splice(index, 1);
      else if (expectedClass === 'extra') {
        ledger.push(Object.freeze({
          ...ledger[index],
          eventId: 'model-parity-event-extra',
          logicalIdentity: Object.freeze({
            ...ledger[index].logicalIdentity,
            producerSequence: ledger.length + 1,
          }),
          producerSequence: ledger.length + 1,
        }));
      } else if (expectedClass === 'duplicated') {
        ledger.push(Object.freeze({
          ...ledger[index],
          eventId: 'model-parity-event-duplicate',
        }));
      } else if (expectedClass === 'reordered') {
        [ledger[index], ledger[index + 1]] = [ledger[index + 1], ledger[index]];
      } else {
        ledger[index] = Object.freeze({
          ...ledger[index],
          stepKey: `${ledger[index].stepKey}#${expectedClass}`,
        });
      }
      const diffs = compareModelBenchmarkEventStreams(
        'fixture-fault-classification',
        legacy,
        ledger,
      );
      expect(diffs.map((entry) => entry.class), JSON.stringify(diffs)).toContain(expectedClass);
      expect(diffs.every((entry) => entry.disposition === 'unexplained')).toBe(true);
    },
  );

  it('compiles only the exact mode-specific fixture closure', () => {
    const fixtures = MODEL_BENCHMARK_REQUIRED_FIXTURE_SCENARIOS.map(
      (scenario) => fixture(scenario, `fixture-${scenario}`),
    );
    const manifest = compileModelBenchmarkParityManifest({ baseSha: BASE_SHA, fixtures });
    expect(manifest.cases).toHaveLength(MODEL_BENCHMARK_REQUIRED_FIXTURE_SCENARIOS.length);
    expect(() => compileModelBenchmarkParityManifest({
      baseSha: BASE_SHA,
      fixtures: fixtures.slice(1),
    })).toThrow(/exact fixture scenario closure/);
  });

  it('blocks missing receipts and rejects authority-bearing gate input', () => {
    const parityFixture = fixture();
    const manifest = targetedManifest(parityFixture);
    const gate = createModelBenchmarkModeGateInput({
      manifest,
      expectedFixtureIds: [parityFixture.fixtureId],
      receipts: [],
    });
    expect(gate).toMatchObject({
      exitStatus: 'blocked',
      blockingReasonCode: 'MISSING_RECEIPT',
      cutoverAuthorized: false,
      rollbackReadinessAuthorized: false,
    });
    expect(() => parseModelBenchmarkModeGateInput({
      ...gate,
      cutoverAuthorized: true,
    })).toThrow(/cannot carry authority|digest/);
  });

  it('fails a gate handoff against a different manifest and BASE', () => {
    const parityFixture = fixture();
    const definition = createModelBenchmarkParityCaseDefinition(parityFixture);
    const otherManifest = compileParityCaseManifest({
      baseSha: OTHER_BASE_SHA,
      baselineRows: [{
        scenarioId: definition.scenarioId,
        mode: definition.mode,
        contractDigest: definition.contractDigest,
        disposition: 'protected',
      }],
      cases: [definition],
    });
    const gate = createModelBenchmarkModeGateInput({
      manifest: otherManifest,
      expectedFixtureIds: [parityFixture.fixtureId],
      receipts: [],
    });
    expect(gate.baseSha).toBe(OTHER_BASE_SHA);
    expect(gate.exitStatus).toBe('blocked');
  });

  it('proves the lifecycle map closes every shared and mode-specific event', () => {
    expect(() => verifyModelBenchmarkLifecycleEventMap()).not.toThrow();
  });
});
