// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Reducer Tests
// ───────────────────────────────────────────────────────────────────

import {
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AGENT_IMPROVEMENT_REDUCER_SURFACE,
  agentImprovementProjectionIntegrityDigest,
  assertAgentImprovementProjectionState,
  createAgentImprovementProjectionState,
  foldAgentImprovementEvents,
  isDeepFrozenProjection,
  projectAgentImprovementCandidateView,
  projectAgentImprovementLegacyView,
  reduceAgentImprovementVerifiedEvent,
  verifyAgentImprovementReducerSurface,
} from '../../lib/agent-improvement-reducers/index.js';
import {
  createAgentImprovementEventRegistry,
  prepareAgentImprovementEvent,
} from '../../lib/agent-improvement-ledger-schema/index.js';
import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';

import type {
  AgentImprovementProjectionState,
  AgentImprovementEventEnvelope,
  AgentImprovementEventInput,
  AgentImprovementEventStem,
  AgentImprovementInputData,
  AgentImprovementLedgerEvent,
  AgentImprovementPayloadMap,
  AgentImprovementReplayMetadata,
  AgentImprovementScopeMap,
} from '../../lib/agent-improvement-ledger-schema/index.js';
import type {
  GatewayAllowProof,
  TransitionAuthorizationRequest,
  VerifiedLedgerEvent,
} from '../../lib/authorized-ledger/index.js';
import type {
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../../lib/event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURE HELPERS
// ───────────────────────────────────────────────────────────────────

const TIMESTAMP = '2026-07-23T10:00:00.000Z';
const RUN_ID = 'run-1';
const LINEAGE_ID = 'lineage-1';
const CANDIDATE_ID = 'candidate-1';
const EVALUATION_EPOCH_ID = 'evaluation-epoch-1';
const STREAM_ID = 'agent-improvement-run-1';
const ZERO_DIGEST = '0'.repeat(64);
const registry = createAgentImprovementEventRegistry();
const temporaryRoots: string[] = [];

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function eventHash(event: AgentImprovementLedgerEvent): string {
  return digest(event);
}

function replayMetadata(): AgentImprovementReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest('replay'),
    replay_input_digests: {
      configuration: digest('configuration'),
      evaluator: digest('evaluator'),
      manifest: digest('manifest'),
    },
  };
}

function scoreVector(aggregateScore = 1): JsonObject {
  return {
    components: [{
      dimensionCode: 'quality',
      rawScore: aggregateScore,
      normalizedScore: aggregateScore,
      weight: 0.6,
    }, {
      dimensionCode: 'safety',
      rawScore: 0.95,
      normalizedScore: 0.95,
      weight: 0.4,
    }],
    aggregateScore,
    uncertainty: 0.02,
  };
}

function scopeFor<TStem extends AgentImprovementEventStem>(
  stem: TStem,
  identities: {
    readonly agentDefinitionId?: string;
    readonly agentChangeId?: string;
    readonly agentIrId?: string;
    readonly candidateId?: string;
    readonly mutationId?: string;
  } = {},
): AgentImprovementScopeMap[TStem] {
  const base = {
    runId: RUN_ID,
    lineageId: LINEAGE_ID,
    variant: 'agent-improvement' as const,
  };
  const candidateId = identities.candidateId ?? CANDIDATE_ID;
  const candidate = { ...base, candidateId };
  if (stem === 'deep_improvement_common.evaluation_observation_recorded') {
    return {
      ...candidate,
      evaluationEpochId: EVALUATION_EPOCH_ID,
      fixtureId: 'fixture-1',
      observationId: 'observation-1',
    } as AgentImprovementScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.evaluation_')) {
    return {
      ...candidate,
      evaluationEpochId: EVALUATION_EPOCH_ID,
    } as AgentImprovementScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.canary_')) {
    return {
      ...candidate,
      canaryEpochId: 'canary-epoch-1',
      canarySuiteId: 'canary-suite-1',
    } as AgentImprovementScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.candidate_')) {
    return candidate as AgentImprovementScopeMap[TStem];
  }
  switch (stem) {
    case 'agent_improvement.definition_snapshot_sealed':
      return {
        ...base,
        agentDefinitionId:
          identities.agentDefinitionId ?? 'agent-definition-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.agent_ir_compiled':
      return {
        ...base,
        agentDefinitionId: 'agent-definition-1',
        agentIrId: identities.agentIrId ?? 'agent-ir-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.change_contract_compiled':
    case 'agent_improvement.behavioral_change_classified':
      return {
        ...candidate,
        agentChangeId: identities.agentChangeId ?? 'agent-change-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.mutation_proposed':
    case 'agent_improvement.mutation_rejected':
      return {
        ...candidate,
        agentChangeId: identities.agentChangeId ?? 'agent-change-1',
        mutationId: identities.mutationId ?? 'mutation-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.trace_sliced':
      return {
        ...candidate,
        evaluationEpochId: EVALUATION_EPOCH_ID,
        behaviorFamilyId: 'behavior-family-1',
        traceId: 'trace-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.behavior_experiment_sealed':
      return {
        ...candidate,
        experimentId: 'experiment-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.known_defect_injected':
    case 'agent_improvement.counterfactual_replayed':
    case 'agent_improvement.ablation_completed':
      return {
        ...candidate,
        experimentId: 'experiment-1',
        interventionId: 'intervention-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.behavior_coverage_recorded':
      return {
        ...candidate,
        evaluationEpochId: EVALUATION_EPOCH_ID,
        behaviorFamilyId: 'behavior-family-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.evaluation_manifest_sealed':
    case 'agent_improvement.fixture_exposure_recorded':
      return {
        ...base,
        evaluationEpochId: EVALUATION_EPOCH_ID,
        manifestId: 'manifest-1',
        exposureEpochId: 'exposure-epoch-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.transfer_trial_recorded':
      return {
        ...candidate,
        evaluationEpochId: EVALUATION_EPOCH_ID,
        trialId: 'trial-1',
      } as AgentImprovementScopeMap[TStem];
    default:
      return base as AgentImprovementScopeMap[TStem];
  }
}

function createEvent<TStem extends AgentImprovementEventStem>(
  stem: TStem,
  streamSequence: number,
  data: AgentImprovementInputData<TStem>,
  previous: AgentImprovementLedgerEvent | null,
  options: {
    readonly agentDefinitionId?: string;
    readonly agentChangeId?: string;
    readonly agentIrId?: string;
    readonly candidateId?: string;
    readonly eventId?: string;
    readonly mutationId?: string;
    readonly streamId?: string;
  } = {},
): AgentImprovementEventEnvelope<TStem> {
  const input: AgentImprovementEventInput<TStem> = {
    stem,
    scope: scopeFor(stem, options),
    prevEventHash: previous === null ? ZERO_DIGEST : eventHash(previous),
    replay: replayMetadata(),
    data,
    eventId: options.eventId
      ?? `event-${String(streamSequence).padStart(3, '0')}`,
    streamId: options.streamId ?? STREAM_ID,
    streamSequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'agent-improvement-reducer-fixture', version: '1' },
    authorityEpoch: 1,
    correlationId: RUN_ID,
    causationId: previous?.event_id ?? null,
    idempotencyKey:
      `agent-reducer-${options.streamId ?? STREAM_ID}-${streamSequence}`,
  };
  return prepareAgentImprovementEvent(
    input,
    registry,
  ).envelope as AgentImprovementEventEnvelope<TStem>;
}

function append<TStem extends AgentImprovementEventStem>(
  events: AgentImprovementLedgerEvent[],
  stem: TStem,
  data: AgentImprovementInputData<TStem>,
): AgentImprovementEventEnvelope<TStem> {
  const event = createEvent(
    stem,
    events.length + 1,
    data,
    events.at(-1) ?? null,
  );
  events.push(event);
  return event;
}

function definitionData(label = 'one') {
  const hash = digest(`definition:${label}`);
  return {
    definitionRef: `artifact:agent-definition-${label}`,
    definitionDigest: hash,
    definitionSchemaVersion: 'agent-definition@1',
    capabilityPolicyRef: `policy:capability-${label}`,
    capabilityPolicyDigest: hash,
    verifierPolicyRef: `policy:verifier-${label}`,
    verifierPolicyDigest: hash,
    toolPolicyRef: `policy:tool-${label}`,
    toolPolicyDigest: hash,
    routingPolicyRef: `policy:routing-${label}`,
    routingPolicyDigest: hash,
    memoryPolicyRef: `policy:memory-${label}`,
    memoryPolicyDigest: hash,
    sealingReceiptRef: `receipt:definition-${label}`,
  } as const;
}

function mutationProposalData(
  change: AgentImprovementEventEnvelope<
    'agent_improvement.change_contract_compiled'
  >,
  label = 'one',
) {
  const suffix = label === 'one' ? '1' : label;
  return {
    changeContractEventId: change.event_id,
    changeContractPayloadDigest: change.payload.payloadDigest,
    mutationOperatorRef: label === 'one'
      ? 'operator:bounded-rewrite'
      : `operator:bounded-rewrite-${label}`,
    mutationOperatorVersion: 'bounded-rewrite@1',
    mutationProposalRef: `proposal:mutation-${suffix}`,
    mutationProposalDigest: digest(
      label === 'one' ? 'mutation' : `mutation:${label}`,
    ),
    targetLocusIds: ['locus-instruction-1'],
    parentCandidateId: null,
    diagnosticEvidenceRefs: [`diagnostic:failure-${suffix}`],
    diagnosticEvidenceSetDigest: digest(
      label === 'one' ? 'diagnostic-set' : `diagnostic-set:${label}`,
    ),
    proposalPolicyVersion: 'mutation-proposal@1',
  } as const;
}

function happyEvents(
  coverage: {
    readonly coverageOutcome: 'covered' | 'partial';
    readonly criticalInvariantOutcome: 'fail' | 'pass';
  } = {
    coverageOutcome: 'covered',
    criticalInvariantOutcome: 'pass',
  },
): AgentImprovementLedgerEvent[] {
  const events: AgentImprovementLedgerEvent[] = [];
  append(events, 'deep_improvement_common.run_started', {
    generation: 1,
    charterDigest: digest('charter'),
    configDigest: digest('config'),
    operatorRef: 'operator:agent-improvement',
    serviceContractVersion: 'deep-improvement-common@1',
    replayFingerprint: digest('run-replay'),
    maxIterations: 4,
  });
  const proposal = append(
    events,
    'deep_improvement_common.candidate_proposed',
    {
      proposalRef: 'proposal:candidate-1',
      proposalDigest: digest('proposal'),
      mutationOperatorRef: 'operator:bounded-rewrite',
      mutationOperatorVersion: 'bounded-rewrite@1',
      parentCandidateId: null,
      targetRef: 'target:agent-1',
      targetDigest: digest('target'),
      proposalPolicyVersion: 'proposal-policy@1',
    },
  );
  append(events, 'deep_improvement_common.candidate_generated', {
    proposalEventId: proposal.event_id,
    proposalPayloadDigest: proposal.payload.payloadDigest,
    candidateArtifactRef: 'artifact:candidate-1',
    candidateArtifactDigest: digest('candidate'),
    generationReceiptRef: 'receipt:generation-1',
    mutationOperatorRef: 'operator:bounded-rewrite',
    mutationOperatorVersion: 'bounded-rewrite@1',
  });
  const epoch = append(
    events,
    'deep_improvement_common.evaluation_epoch_sealed',
    {
      evaluatorRef: 'evaluator:independent-1',
      evaluatorCapsuleDigest: digest('evaluator-capsule'),
      fixtureSetRef: 'profile:heldout-1',
      fixtureSetDigest: digest('fixture-set'),
      scorePolicyVersion: 'score-policy@1',
      evaluationBudgetRef: 'budget:evaluation-1',
    },
  );
  const evaluationStarted = append(
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
  const observation = append(
    events,
    'deep_improvement_common.evaluation_observation_recorded',
    {
      evaluationStartedEventId: evaluationStarted.event_id,
      evaluatorRef: 'evaluator:independent-1',
      fixtureRef: 'fixture:heldout-1',
      rawObservationRef: 'observation:raw-1',
      rawObservationDigest: digest('raw-observation'),
      executionReceiptRef: 'receipt:observation-1',
      observationOutcome: 'pass',
    },
  );
  const normalized = append(
    events,
    'deep_improvement_common.evaluation_normalized',
    {
      observationEventIds: [observation.event_id],
      observationSetDigest: digest('observation-set'),
      scorePolicyVersion: 'score-policy@1',
      scorerFingerprint: digest('scorer'),
      scoreVector: scoreVector(),
      normalizationReceiptRef: 'receipt:normalization-1',
    },
  );
  const verificationRequested = append(
    events,
    'deep_improvement_common.evaluation_verification_requested',
    {
      normalizedEventId: normalized.event_id,
      normalizedPayloadDigest: normalized.payload.payloadDigest,
      verificationPolicyVersion: 'verification-policy@1',
      verifierRef: 'verifier:independent-1',
      reasonCode: 'promotion-bound-score',
    },
  );
  const verification = append(
    events,
    'deep_improvement_common.evaluation_verification_recorded',
    {
      requestEventId: verificationRequested.event_id,
      verifierRef: 'verifier:independent-1',
      verificationOutcome: 'confirmed',
      verificationEvidenceRef: 'evidence:verification-1',
      verificationEvidenceDigest: digest('verification-evidence'),
      verificationReceiptRef: 'receipt:verification-1',
    },
  );
  const canarySuite = append(
    events,
    'deep_improvement_common.canary_suite_sealed',
    {
      suiteRef: 'canary-suite:sealed-1',
      suiteDigest: digest('canary-suite'),
      canaryPolicyVersion: 'canary-policy@1',
      fixtureCount: 2,
      protectedMaterialRef: 'protected:canary-1',
      protectedMaterialDigest: digest('protected-canary'),
    },
  );
  const canaryExecution = append(
    events,
    'deep_improvement_common.canary_executed',
    {
      suiteSealedEventId: canarySuite.event_id,
      suitePayloadDigest: canarySuite.payload.payloadDigest,
      executionReceiptRef: 'receipt:canary-execution-1',
      canaryObservationRef: 'canary-observation:1',
      canaryObservationDigest: digest('canary-observation'),
      outcome: 'pass',
    },
  );
  const canaryGate = append(
    events,
    'deep_improvement_common.canary_gate_passed',
    {
      executionEventIds: [canaryExecution.event_id],
      evidenceSetDigest: digest('canary-evidence'),
      policyVersion: 'canary-gate@1',
      policyFingerprint: digest('canary-policy'),
      decisionReceiptRef: 'receipt:canary-pass-1',
    },
  );
  const definition = append(
    events,
    'agent_improvement.definition_snapshot_sealed',
    definitionData(),
  );
  const agentIr = append(events, 'agent_improvement.agent_ir_compiled', {
    definitionSnapshotEventId: definition.event_id,
    definitionSnapshotPayloadDigest: definition.payload.payloadDigest,
    agentIrRef: 'artifact:agent-ir-1',
    agentIrDigest: digest('agent-ir'),
    agentIrSchemaVersion: 'agent-ir@1',
    components: [{
      componentId: 'component-instructions',
      componentKind: 'instruction',
      componentRef: 'agent-ir:component:instructions',
      componentDigest: digest('component-instructions'),
    }, {
      componentId: 'component-tools',
      componentKind: 'tool-policy',
      componentRef: 'agent-ir:component:tools',
      componentDigest: digest('component-tools'),
    }],
    inheritanceEdges: [{
      edgeId: 'edge-instructions-tools',
      parentComponentId: 'component-instructions',
      childComponentId: 'component-tools',
      inheritanceKind: 'preserves',
      edgeDigest: digest('edge'),
    }],
    loci: [{
      locusId: 'locus-instruction-1',
      componentId: 'component-instructions',
      clauseId: 'clause-1',
      locusKind: 'instruction',
      mutability: 'mutable',
      locusRef: 'agent-ir:locus:instruction-1',
      locusDigest: digest('locus-instruction'),
    }, {
      locusId: 'locus-tool-policy-1',
      componentId: 'component-tools',
      clauseId: null,
      locusKind: 'tool-policy',
      mutability: 'immutable',
      locusRef: 'agent-ir:locus:tool-policy-1',
      locusDigest: digest('locus-tool'),
    }],
    compilerFingerprint: digest('compiler'),
    compilationReceiptRef: 'receipt:agent-ir-compilation-1',
  });
  const change = append(
    events,
    'agent_improvement.change_contract_compiled',
    {
      agentIrEventId: agentIr.event_id,
      agentIrPayloadDigest: agentIr.payload.payloadDigest,
      baseDefinitionRef: 'artifact:agent-definition-base',
      baseDefinitionDigest: digest('base-definition'),
      candidateDefinitionRef: 'artifact:agent-definition-candidate',
      candidateDefinitionDigest: digest('candidate-definition'),
      changeContractRef: 'artifact:change-contract-1',
      changeContractDigest: digest('change-contract'),
      patchRef: 'artifact:patch-1',
      patchDigest: digest('patch'),
      intendedObligationIds: ['obligation:clarity'],
      preservedObligationIds: ['obligation:authority'],
      affectedBehaviorFamilyIds: ['behavior-family-1'],
      behavioralSemverIntent: 'patch',
      contractPolicyVersion: 'change-contract@1',
      compilationReceiptRef: 'receipt:change-contract-1',
    },
  );
  append(
    events,
    'agent_improvement.mutation_proposed',
    mutationProposalData(change),
  );
  const trace = append(events, 'agent_improvement.trace_sliced', {
    evaluationObservationEventId: observation.event_id,
    evaluationObservationPayloadDigest: observation.payload.payloadDigest,
    traceRef: 'trace:raw-1',
    traceDigest: digest('trace'),
    traceSliceRef: 'trace-slice:1',
    traceSliceDigest: digest('trace-slice'),
    failureRef: 'failure:behavior-1',
    failureDigest: digest('failure'),
    clauseIds: ['clause-1'],
    componentIds: ['component-instructions'],
    slicerFingerprint: digest('slicer'),
    attributionStatus: 'diagnostic',
    attributionUncertainty: 0.2,
    slicingReceiptRef: 'receipt:trace-slice-1',
  });
  const experiment = append(
    events,
    'agent_improvement.behavior_experiment_sealed',
    {
      traceSliceEventId: trace.event_id,
      traceSlicePayloadDigest: trace.payload.payloadDigest,
      experimentPlanRef: 'experiment-plan:1',
      experimentPlanDigest: digest('experiment-plan'),
      behaviorFamilyId: 'behavior-family-1',
      scenarioSetRef: 'scenario-set:1',
      scenarioSetDigest: digest('scenario-set'),
      baselineExecutionRef: 'execution:baseline-1',
      baselineExecutionDigest: digest('baseline-execution'),
      candidateExecutionRef: 'execution:candidate-1',
      candidateExecutionDigest: digest('candidate-execution'),
      freshPairedExecutionReceiptRef: 'receipt:paired-execution-1',
      executorRef: 'executor:primary-1',
      executorFingerprint: digest('executor'),
      verifierRef: 'verifier:isolated-1',
      verifierFingerprint: digest('verifier'),
      interventionIds: ['intervention-1'],
      experimentPolicyVersion: 'behavior-experiment@1',
    },
  );
  const defect = append(
    events,
    'agent_improvement.known_defect_injected',
    {
      experimentEventId: experiment.event_id,
      experimentPayloadDigest: experiment.payload.payloadDigest,
      defectLocusId: 'locus-instruction-1',
      injectionRef: 'defect-injection:1',
      injectionDigest: digest('defect'),
      controlExecutionRef: 'execution:control-1',
      controlExecutionDigest: digest('control'),
      perturbedExecutionRef: 'execution:perturbed-1',
      perturbedExecutionDigest: digest('perturbed'),
      rawObservationRef: 'observation:defect-1',
      rawObservationDigest: digest('defect-observation'),
      outcome: 'detected',
      uncertainty: 0.1,
      injectionReceiptRef: 'receipt:defect-injection-1',
    },
  );
  append(events, 'agent_improvement.behavior_coverage_recorded', {
    experimentEventIds: [experiment.event_id, defect.event_id],
    evidenceSetDigest: digest('coverage-evidence'),
    clauseIds: ['clause-1'],
    authorityConflictCaseIds: ['case:authority-1'],
    negativeCapabilityCaseIds: ['case:negative-capability-1'],
    sideEffectOracleIds: ['oracle:side-effect-1'],
    semanticVariantIds: ['variant:semantic-1'],
    rawCoverageRef: 'coverage:raw-1',
    rawCoverageDigest: digest('coverage'),
    coverageOutcome: coverage.coverageOutcome,
    criticalInvariantOutcome: coverage.criticalInvariantOutcome,
    coveragePolicyVersion: 'behavior-coverage@1',
  });
  const manifest = append(
    events,
    'agent_improvement.evaluation_manifest_sealed',
    {
      manifestRef: 'manifest:evaluation-1',
      manifestDigest: digest('manifest'),
      manifestVersion: 'evaluation-manifest@1',
      rings: ['public', 'heldout', 'canary', 'transfer'].map((ring) => ({
        ring,
        fixtureSetRef: `fixture-set:${ring}-1`,
        fixtureSetDigest: digest(`fixture-set:${ring}`),
        fixtureCount: 2,
      })) as AgentImprovementPayloadMap[
        'agent_improvement.evaluation_manifest_sealed'
      ]['rings'],
      evaluatorCapsuleRef: 'evaluator:capsule-1',
      evaluatorCapsuleDigest: digest('evaluator-capsule'),
      leakVetoPolicyVersion: 'leak-veto@1',
      sealingReceiptRef: 'receipt:manifest-seal-1',
    },
  );
  append(events, 'agent_improvement.fixture_exposure_recorded', {
    manifestEventId: manifest.event_id,
    manifestPayloadDigest: manifest.payload.payloadDigest,
    exposureKind: 'activated',
    exposedRingCodes: ['public'],
    authorizedExposureRef: 'exposure-authorization:1',
    authorizedExposureDigest: digest('exposure'),
    exposureReceiptRef: 'receipt:exposure-1',
    occurredAt: TIMESTAMP,
  });
  append(events, 'agent_improvement.transfer_trial_recorded', {
    sourceExecutorRef: 'executor:primary-1',
    sourceExecutorFingerprint: digest('source-executor'),
    targetExecutorRef: 'executor:transfer-1',
    targetExecutorFingerprint: digest('target-executor'),
    verifierRef: 'verifier:isolated-1',
    verifierFingerprint: digest('transfer-verifier'),
    behaviorFamilyIds: ['behavior-family-1'],
    scenarioSetRef: 'scenario-set:transfer-1',
    scenarioSetDigest: digest('transfer-scenarios'),
    baselineExecutionRef: 'execution:transfer-baseline-1',
    baselineExecutionDigest: digest('transfer-baseline'),
    candidateExecutionRef: 'execution:transfer-candidate-1',
    candidateExecutionDigest: digest('transfer-candidate'),
    rawObservationRef: 'observation:transfer-1',
    rawObservationDigest: digest('transfer-observation'),
    transferOutcome: 'pass',
    uncertainty: 0.1,
    executionReceiptRef: 'receipt:transfer-1',
  });
  append(events, 'agent_improvement.behavioral_change_classified', {
    changeContractEventId: change.event_id,
    changeContractPayloadDigest: change.payload.payloadDigest,
    normalizedEventId: normalized.event_id,
    normalizedPayloadDigest: normalized.payload.payloadDigest,
    verificationEventId: verification.event_id,
    verificationPayloadDigest: verification.payload.payloadDigest,
    canaryGateEventId: canaryGate.event_id,
    canaryGatePayloadDigest: canaryGate.payload.payloadDigest,
    classificationPolicyVersion: 'behavioral-semver@1',
    behavioralSemver: 'patch',
    affectedBehaviorFamilyIds: ['behavior-family-1'],
    regressedBehaviorFamilyIds: [],
    preservedObligationIds: ['obligation:authority'],
    classificationEvidenceRef: 'evidence:classification-1',
    classificationEvidenceDigest: digest('classification'),
    classificationReceiptRef: 'receipt:classification-1',
  });
  return events;
}

function projected(
  events: readonly AgentImprovementLedgerEvent[],
) {
  const result = foldAgentImprovementEvents(events);
  expect(result.outcome).toBe('projected');
  if (result.outcome !== 'projected') {
    throw new Error(`Expected projection: ${result.reasonCodes.join(',')}`);
  }
  return result;
}

// ───────────────────────────────────────────────────────────────────
// 2. REAL VERIFIED-EVENT HARNESS
// ───────────────────────────────────────────────────────────────────

interface Harness {
  readonly registry: EventTypeRegistry;
  readonly policies: TransitionPolicyRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
}

function createHarness(): Harness {
  const rootDirectory = mkdtempSync(
    join(tmpdir(), 'agent-improvement-reducers-'),
  );
  temporaryRoots.push(rootDirectory);
  const harnessRegistry = createAgentImprovementEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'agent-improvement-shadow-write',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['known-event'],
    evaluate: () => ({
      verdict: 'allow',
      reasonCode: 'allowed',
      matchedRuleIds: ['known-event'],
    }),
  }]);
  const authorityProvider = () => ({
    state: 'shadowing' as const,
    epoch: 1,
  });
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: 'agent-improvement-reducer-ledger',
    auditLedgerId: 'agent-improvement-reducer-audit',
    authorityProvider,
  }, harnessRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: 'agent-improvement-reducer-audit',
    authorityProvider,
  }, ledger, policies);
  return { registry: harnessRegistry, policies, ledger, gateway };
}

async function authorizationRequest(
  harness: Harness,
  event: EventWritePreflight,
): Promise<TransitionAuthorizationRequest> {
  const policy = harness.policies.resolve(
    'agent-improvement-shadow-write',
    1,
  );
  return {
    requestId: 'request-1',
    mode: 'agent-improvement',
    event,
    priorHead: await harness.ledger.getVerifiedHead(),
    priorStateVersion: 'agent-improvement-shadow@1',
    priorStateFingerprint: digest('prior-state'),
    actorId: 'agent-improvement-runtime',
    capabilityId: 'agent-improvement:append',
    authorityEpoch: 1,
    policy: {
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    },
    evidenceDigest: digest('authorization-evidence'),
  };
}

async function authorize(
  harness: Harness,
  event: EventWritePreflight,
): Promise<GatewayAllowProof> {
  const result = await harness.gateway.authorize(
    await authorizationRequest(harness, event),
  );
  expect(result.verdict).toBe('allow');
  if (result.verdict !== 'allow') throw new Error(result.reasonCode);
  return result.proof;
}

async function verifiedRunStarted(): Promise<{
  readonly event: AgentImprovementLedgerEvent;
  readonly verified: VerifiedLedgerEvent;
}> {
  const harness = createHarness();
  const envelope = createEvent(
    'deep_improvement_common.run_started',
    1,
    {
      generation: 1,
      charterDigest: digest('charter'),
      configDigest: digest('config'),
      operatorRef: 'operator:agent-improvement',
      serviceContractVersion: 'deep-improvement-common@1',
      replayFingerprint: digest('run-replay'),
      maxIterations: 4,
    },
    null,
  );
  const prepared = prepareAgentImprovementEvent({
    stem: envelope.payload.stem,
    scope: envelope.payload.scope,
    prevEventHash: envelope.payload.prevEventHash,
    replay: envelope.payload.replay,
    data: envelope.payload.data,
    eventId: envelope.event_id,
    streamId: envelope.stream_id,
    streamSequence: envelope.stream_sequence,
    occurredAt: envelope.occurred_at,
    recordedAt: envelope.recorded_at,
    producer: envelope.producer,
    authorityEpoch: envelope.authority_epoch,
    correlationId: envelope.correlation_id,
    causationId: envelope.causation_id,
    idempotencyKey: envelope.idempotency_key,
  }, harness.registry);
  const proof = await authorize(harness, prepared);
  await harness.ledger.appendAuthorized(prepared, proof);
  const verified = await harness.ledger.readVerifiedEvents();
  const first = verified[0];
  if (first === undefined) throw new Error('Expected verified event');
  return { event: envelope, verified: first };
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 3. PURE FOLD AND ADVERSARIAL REPLAY
// ───────────────────────────────────────────────────────────────────

describe('agent-improvement reducers and projections', () => {
  it('is deterministic and returns recursively frozen projections', () => {
    const events = happyEvents();
    const first = projected(events);
    const second = projected(events);

    expect(canonicalJson(first.projection)).toBe(
      canonicalJson(second.projection),
    );
    expect(first.integrityDigest).toBe(second.integrityDigest);
    expect(agentImprovementProjectionIntegrityDigest(first.projection)).toBe(
      first.integrityDigest,
    );
    expect(isDeepFrozenProjection(first)).toBe(true);
  });

  it('produces byte-identical output for reordered input', () => {
    const events = happyEvents();
    const ordered = projected(events);
    const reordered = projected([...events].reverse());

    expect(canonicalJson(reordered.projection)).toBe(
      canonicalJson(ordered.projection),
    );
    expect(reordered.integrityDigest).toBe(ordered.integrityDigest);
  });

  it('matches checkpointed replay to the complete fold oracle', () => {
    const events = happyEvents();
    const first = projected(events.slice(0, 12));
    const incremental = foldAgentImprovementEvents(events.slice(12), {
      checkpoint: first.checkpoint,
    });
    const complete = projected(events);

    expect(incremental.outcome).toBe('projected');
    if (incremental.outcome !== 'projected') {
      throw new Error('Expected incremental projection');
    }
    expect(canonicalJson(incremental.projection)).toBe(
      canonicalJson(complete.projection),
    );
    expect(incremental.integrityDigest).toBe(complete.integrityDigest);
  });

  it('folds an exact duplicate idempotently', () => {
    const events = happyEvents();
    const once = projected(events);
    const duplicate = projected([
      ...events.slice(0, 2),
      events[1],
      ...events.slice(2),
    ]);

    expect(canonicalJson(duplicate.projection)).toBe(
      canonicalJson(once.projection),
    );
    expect(duplicate.integrityDigest).toBe(once.integrityDigest);
    expect(duplicate.projection.seenEvents).toHaveLength(events.length);
  });

  it('rejects a conflicting proposal that reuses an immutable mutation id', () => {
    const events = happyEvents();
    const change = events.find((event) => (
      event.payload.stem === 'agent_improvement.change_contract_compiled'
    )) as AgentImprovementEventEnvelope<
      'agent_improvement.change_contract_compiled'
    > | undefined;
    if (change === undefined) throw new Error('Expected change contract');
    const conflicting = createEvent(
      'agent_improvement.mutation_proposed',
      events.length + 1,
      {
        ...mutationProposalData(change),
        mutationOperatorRef: 'operator:conflicting-rewrite',
        mutationProposalRef: 'proposal:mutation-conflicting',
        mutationProposalDigest: digest('mutation:conflicting'),
      },
      events.at(-1) ?? null,
      { eventId: 'event-mutation-conflict', mutationId: 'mutation-1' },
    );

    expect(() => foldAgentImprovementEvents([
      ...events,
      conflicting,
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'agentImprovement.iterationConvergence.mutations',
    }));
  });

  it('projects the single active mutation operator from its own mutation', () => {
    const variant = projected(happyEvents()).projection.agentImprovement;

    expect(variant.iterationConvergence.activeMutationId).toBe('mutation-1');
    expect(variant.modeStatus.activeMutationId).toBe('mutation-1');
    expect(variant.modeStatus.activeMutationOperatorRef).toBe(
      'operator:bounded-rewrite',
    );
  });

  it('keeps the active mutation operator in lockstep across ten proposals', () => {
    const events = happyEvents();
    const change = events.find((event) => (
      event.payload.stem === 'agent_improvement.change_contract_compiled'
    )) as AgentImprovementEventEnvelope<
      'agent_improvement.change_contract_compiled'
    > | undefined;
    if (change === undefined) throw new Error('Expected change contract');

    for (let sequence = 2; sequence <= 10; sequence += 1) {
      const label = `seq-${sequence}`;
      events.push(createEvent(
        'agent_improvement.mutation_proposed',
        events.length + 1,
        mutationProposalData(change, label),
        events.at(-1) ?? null,
        {
          eventId: `event-mutation-${sequence}`,
          mutationId: `mutation-${sequence}`,
        },
      ));
    }

    const variant = projected(events).projection.agentImprovement;
    expect(variant.iterationConvergence.activeMutationId).toBe('mutation-10');
    expect(variant.modeStatus.activeMutationId).toBe('mutation-10');
    expect(variant.modeStatus.activeMutationOperatorRef).toBe(
      'operator:bounded-rewrite-seq-10',
    );
    expect(variant.modeStatus.activeMutationOperatorRef).not.toBe(
      'operator:bounded-rewrite-seq-9',
    );
  });

  it('replays the byte-identical mutation proposal as an idempotent no-op', () => {
    const events = happyEvents();
    const mutation = events.find((event) => (
      event.payload.stem === 'agent_improvement.mutation_proposed'
    ));
    if (mutation === undefined) throw new Error('Expected mutation proposal');
    const once = projected(events);
    const replayed = projected([...events, mutation]);

    expect(canonicalJson(replayed.projection)).toBe(
      canonicalJson(once.projection),
    );
    expect(replayed.integrityDigest).toBe(once.integrityDigest);
    expect(replayed.projection.agentImprovement.iterationConvergence.mutations)
      .toHaveLength(1);
  });

  it('accepts a genuinely new mutation id without redefining prior lineage', () => {
    const events = happyEvents();
    const change = events.find((event) => (
      event.payload.stem === 'agent_improvement.change_contract_compiled'
    )) as AgentImprovementEventEnvelope<
      'agent_improvement.change_contract_compiled'
    > | undefined;
    if (change === undefined) throw new Error('Expected change contract');
    const nextMutation = createEvent(
      'agent_improvement.mutation_proposed',
      events.length + 1,
      mutationProposalData(change, 'two'),
      events.at(-1) ?? null,
      { eventId: 'event-mutation-2', mutationId: 'mutation-2' },
    );
    const result = projected([...events, nextMutation]);

    expect(
      result.projection.agentImprovement.iterationConvergence.mutations,
    ).toMatchObject([
      {
        mutationId: 'mutation-1',
        mutationOperatorRef: 'operator:bounded-rewrite',
      },
      {
        mutationId: 'mutation-2',
        mutationOperatorRef: 'operator:bounded-rewrite-two',
      },
    ]);
  });

  it('rejects AgentIR identity, locus, parent, and incumbent ownership gaps', () => {
    const projection = projected(happyEvents()).projection;
    const mutableProjection = (): AgentImprovementProjectionState => (
      JSON.parse(canonicalJson(projection)) as AgentImprovementProjectionState
    );

    const conflictingComponent = mutableProjection();
    const ir = conflictingComponent.agentImprovement.artifactIndex
      .agentIrVersions[0];
    const component = ir?.components[0];
    if (ir === undefined || component === undefined) {
      throw new Error('Expected AgentIR component');
    }
    ir.components.push({
      ...component,
      componentDigest: digest('conflicting-component'),
    });
    expect(() => assertAgentImprovementProjectionState(conflictingComponent))
      .toThrowError(expect.objectContaining({
        code: 'referential-integrity',
        field:
          'agentImprovement.artifactIndex.agentIrVersions.components.componentId',
      }));

    const immutableLocus = mutableProjection();
    immutableLocus.agentImprovement.iterationConvergence.mutations[0] = {
      ...immutableLocus.agentImprovement.iterationConvergence.mutations[0],
      targetLocusIds: ['locus-tool-policy-1'],
    };
    expect(() => assertAgentImprovementProjectionState(immutableLocus))
      .toThrowError(expect.objectContaining({
        code: 'referential-integrity',
        field: 'agentImprovement.iterationConvergence.mutations',
      }));

    const falseParent = mutableProjection();
    falseParent.agentImprovement.iterationConvergence.mutations[0] = {
      ...falseParent.agentImprovement.iterationConvergence.mutations[0],
      parentCandidateId: CANDIDATE_ID,
    };
    expect(() => assertAgentImprovementProjectionState(falseParent))
      .toThrowError(expect.objectContaining({
        code: 'referential-integrity',
        field: 'agentImprovement.iterationConvergence.mutations',
      }));

    const forgedChampion = mutableProjection();
    forgedChampion.agentImprovement.modeStatus.profileChampions.push({
      profileRef: 'profile:forged',
      candidateId: CANDIDATE_ID,
    });
    expect(() => assertAgentImprovementProjectionState(forgedChampion))
      .toThrowError(expect.objectContaining({
        code: 'referential-integrity',
        field: 'agentImprovement.modeStatus.profileChampions',
      }));
  });

  it('blocks per-stream gaps and distinct sequence reuse', () => {
    const run = createEvent(
      'deep_improvement_common.run_started',
      1,
      {
        generation: 1,
        charterDigest: digest('charter'),
        configDigest: digest('config'),
        operatorRef: 'operator:agent-improvement',
        serviceContractVersion: 'deep-improvement-common@1',
        replayFingerprint: digest('run-replay'),
        maxIterations: 4,
      },
      null,
      { streamId: 'common-stream', eventId: 'common-1' },
    );
    const definitionOne = createEvent(
      'agent_improvement.definition_snapshot_sealed',
      1,
      definitionData('one'),
      null,
      {
        streamId: 'variant-stream',
        eventId: 'variant-1',
        agentDefinitionId: 'agent-definition-1',
      },
    );
    const definitionGap = createEvent(
      'agent_improvement.definition_snapshot_sealed',
      3,
      definitionData('three'),
      definitionOne,
      {
        streamId: 'variant-stream',
        eventId: 'variant-3',
        agentDefinitionId: 'agent-definition-3',
      },
    );
    expect(foldAgentImprovementEvents([
      run,
      definitionOne,
      definitionGap,
    ])).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['cursor-gap'],
    });

    const definitionTwo = createEvent(
      'agent_improvement.definition_snapshot_sealed',
      2,
      definitionData('two'),
      definitionOne,
      {
        streamId: 'variant-stream',
        eventId: 'variant-2',
        agentDefinitionId: 'agent-definition-2',
      },
    );
    const conflictingTwo = createEvent(
      'agent_improvement.definition_snapshot_sealed',
      2,
      definitionData('two-conflict'),
      definitionOne,
      {
        streamId: 'variant-stream',
        eventId: 'variant-2-conflict',
        agentDefinitionId: 'agent-definition-2-conflict',
      },
    );
    expect(foldAgentImprovementEvents([
      run,
      definitionOne,
      definitionTwo,
      conflictingTwo,
    ])).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['event-order-invalid'],
    });
  });

  it('rejects phantom observation sources through the real fold', () => {
    const events = happyEvents();
    const traceIndex = events.findIndex(
      (event) => event.payload.stem === 'agent_improvement.trace_sliced',
    );
    const prefix = events.slice(0, traceIndex);
    const previous = prefix.at(-1) ?? null;
    const phantom = createEvent(
      'agent_improvement.trace_sliced',
      traceIndex + 1,
      {
        evaluationObservationEventId: 'event-never-captured',
        evaluationObservationPayloadDigest: digest('phantom-observation'),
        traceRef: 'trace:raw-phantom',
        traceDigest: digest('trace-phantom'),
        traceSliceRef: 'trace-slice:phantom',
        traceSliceDigest: digest('trace-slice-phantom'),
        failureRef: 'failure:phantom',
        failureDigest: digest('failure-phantom'),
        clauseIds: ['clause-1'],
        componentIds: ['component-instructions'],
        slicerFingerprint: digest('slicer-phantom'),
        attributionStatus: 'diagnostic',
        attributionUncertainty: 0.2,
        slicingReceiptRef: 'receipt:trace-slice-phantom',
      },
      previous,
    );

    expect(() => foldAgentImprovementEvents([
      ...prefix,
      phantom,
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'agentImprovement',
    }));
  });

  it('rejects a forged checkpoint tail bound to the projection digest', () => {
    const events = happyEvents();
    const first = projected(events.slice(0, 12));
    const forged = {
      ...first.checkpoint,
      sourceStreamTails: first.checkpoint.sourceStreamTails.map(
        (entry) => ({
          ...entry,
          lastSequence: entry.lastSequence + 50,
        }),
      ),
    };
    const resumed = foldAgentImprovementEvents(events.slice(12), {
      checkpoint: forged,
    });

    expect(resumed).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['checkpoint-digest-mismatch'],
    });
  });

  it('fails closed on a foreign or unknown extension variant', () => {
    const [run] = happyEvents();
    if (run === undefined) throw new Error('Expected run event');
    const foreign = {
      ...run,
      event_type: 'model-benchmark.ledger.run-started',
      payload: {
        ...run.payload,
        stem: 'model_benchmark.run_started',
      },
    };

    expect(() => foldAgentImprovementEvents([
      foreign as unknown as AgentImprovementLedgerEvent,
    ])).toThrowError(expect.objectContaining({
      code: 'event-schema-invalid',
      field: 'event',
    }));
  });

  it('keeps raw trials separate from typed scores and preserves hard vetoes', () => {
    const result = projected(happyEvents({
      coverageOutcome: 'covered',
      criticalInvariantOutcome: 'fail',
    }));
    const common = result.projection.common;
    const variant = result.projection.agentImprovement;
    const view = projectAgentImprovementCandidateView(result.projection);

    expect(common.artifactIndex.rawObservations).toHaveLength(1);
    expect(common.artifactIndex.derivedScores).toHaveLength(1);
    expect(common.artifactIndex.derivedScores[0]).toMatchObject({
      scoreWriteBackendRef: 'backend:deep-improvement-score',
      scoreVector: { aggregateScore: 1 },
    });
    expect(variant.artifactIndex.transferTrials).toHaveLength(1);
    expect(variant.artifactIndex.transferTrials[0]).not.toHaveProperty(
      'scoreVector',
    );
    expect(variant.iterationConvergence.classifications).toHaveLength(1);
    expect(variant.modeStatus).toMatchObject({
      coverageState: 'blocked',
      projectionHealth: 'blocked',
      blockingVetoCodes: ['agent-critical-invariant-failed'],
    });
    expect(view.decisionBand).toBe('blocked');
  });

  it('matches the complete frozen legacy structure without subset comparison', () => {
    const projection = projected(happyEvents()).projection;
    const legacy = projectAgentImprovementLegacyView(projection);
    const expected = Object.freeze({
      authority: 'shadow-only',
      legacyAuthority: 'unchanged',
      common: {
        authority: 'shadow-only',
        legacyAuthority: 'unchanged',
        variant: 'agent-improvement',
        runState: 'active',
        iteration: 1,
        candidateId: 'candidate-1',
        candidateStage: 'verified',
        aggregateScore: 1,
        canaryStage: 'passed',
        promotionStage: 'not-proposed',
        stopReason: null,
        sessionOutcome: null,
        hardVetoCodes: [],
      },
      activeAgentIrId: 'agent-ir-1',
      activeMutationId: 'mutation-1',
      latestClassifiedCandidateId: 'candidate-1',
      coverageState: 'covered',
      evaluatorIntegrityState: 'clean',
      projectionHealth: 'healthy',
      blockingVetoCodes: [],
    });

    expect(legacy).toEqual(expected);
    expect(Object.keys(legacy).sort()).toEqual(Object.keys(expected).sort());
    expect(isDeepFrozenProjection(legacy)).toBe(true);
  });

  it('matches the fold oracle through a real VerifiedLedgerEvent', async () => {
    const { event, verified } = await verifiedRunStarted();
    const initial = createAgentImprovementProjectionState();
    const reduced = reduceAgentImprovementVerifiedEvent(
      verified,
      initial as typeof initial & JsonObject,
    );
    const oracle = projected([event]);

    verifyAgentImprovementReducerSurface(
      AGENT_IMPROVEMENT_REDUCER_SURFACE,
      verified,
      initial,
    );
    expect(canonicalJson(reduced.state)).toBe(
      canonicalJson(oracle.projection),
    );
    expect(reduced.reducerId).toBe('agent-improvement:projection-fold');
    expect(reduced.appliedEventId).toBe(event.event_id);
  });
});
