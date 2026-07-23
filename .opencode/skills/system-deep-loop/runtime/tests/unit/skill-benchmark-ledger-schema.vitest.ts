// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Ledger Schema Tests
// ───────────────────────────────────────────────────────────────────

import {
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  AuthorizedLedgerErrorCodes,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
  DeepImprovementCommonEventStems,
  DeepImprovementCommonWireEventTypes,
  createDeepImprovementCommonEventRegistry,
  prepareDeepImprovementCommonEvent,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import {
  EVENT_ENVELOPE_FIELDS,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  SKILL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
  SKILL_BENCHMARK_SHARED_ENVELOPE_FIELDS,
  SkillBenchmarkEventStems,
  SkillBenchmarkSpecificEventStems,
  SkillBenchmarkWireEventTypes,
  createSkillBenchmarkEventRegistry,
  decideSkillBenchmarkCompatibility,
  prepareSkillBenchmarkEvent,
  upcastLegacySkillBenchmarkRecord,
} from '../../lib/skill-benchmark-ledger-schema/index.js';

import type {
  GatewayAllowProof,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepImprovementCommonEventInput,
  DeepImprovementCommonEventStem,
  DeepImprovementCommonPayloadMap,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import type {
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../../lib/event-envelope/index.js';
import type {
  SkillBenchmarkEventInput,
  SkillBenchmarkEventStem,
  SkillBenchmarkPayloadMap,
  SkillBenchmarkReplayMetadata,
  SkillBenchmarkScopeMap,
  SkillBenchmarkSpecificEventStem,
} from '../../lib/skill-benchmark-ledger-schema/index.js';

const TIMESTAMP = '2026-07-23T10:00:00.000Z';
const LEDGER_ID = 'skill-benchmark-shadow';
const AUDIT_LEDGER_ID = 'skill-benchmark-shadow-authorization';
const AUTHORITY = Object.freeze({ state: 'shadowing' as const, epoch: 1 });
const temporaryRoots: string[] = [];

interface Harness {
  readonly registry: EventTypeRegistry;
  readonly policies: TransitionPolicyRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function temporaryRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'skill-benchmark-schema-'));
  temporaryRoots.push(root);
  return root;
}

function createHarness(): Harness {
  const rootDirectory = temporaryRoot();
  const registry = createSkillBenchmarkEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'skill-benchmark-shadow-write',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['known-skill-benchmark-event', 'shadow-capability'],
    evaluate: (input) => {
      const knownNamespace = input.requestedEventType.startsWith(
        'skill-benchmark.ledger.',
      ) || input.requestedEventType.startsWith(
        'deep-improvement-common.ledger.',
      );
      const allowed = knownNamespace
        && input.capabilityId === 'skill-benchmark:append';
      return {
        verdict: allowed ? 'allow' : 'deny',
        reasonCode: allowed ? 'allowed' : 'policy_denied',
        matchedRuleIds: [
          'known-skill-benchmark-event',
          'shadow-capability',
        ],
      };
    },
  }]);
  const authorityProvider = (): typeof AUTHORITY => AUTHORITY;
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: LEDGER_ID,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider,
  }, ledger, policies);
  return { registry, policies, ledger, gateway };
}

function replayMetadata(label: string): SkillBenchmarkReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest(`replay:${label}`),
    replay_input_digests: {
      configuration: digest('configuration'),
      evaluator: digest('evaluator'),
    },
  };
}

function commonScope(stem: DeepImprovementCommonEventStem): JsonObject {
  const base = {
    runId: 'run-1',
    lineageId: 'lineage-1',
    variant: 'skill-benchmark',
  };
  const candidate = { ...base, candidateId: 'candidate-1' };
  if (stem.startsWith('deep_improvement_common.evaluation_')) {
    const evaluation = {
      ...candidate,
      evaluationEpochId: 'evaluation-epoch-1',
    };
    return stem === 'deep_improvement_common.evaluation_observation_recorded'
      ? {
        ...evaluation,
        fixtureId: 'fixture-1',
        observationId: 'observation-1',
      }
      : evaluation;
  }
  if (stem.startsWith('deep_improvement_common.canary_')) {
    return {
      ...candidate,
      canaryEpochId: 'canary-epoch-1',
      canarySuiteId: 'canary-suite-1',
    };
  }
  if (stem.startsWith('deep_improvement_common.promotion_')) {
    return {
      ...candidate,
      promotionId: 'promotion-1',
      baselineId: 'baseline-1',
    };
  }
  return stem.startsWith('deep_improvement_common.candidate_')
    ? candidate
    : base;
}

function specificScope(stem: SkillBenchmarkSpecificEventStem): JsonObject {
  const base = {
    runId: 'run-1',
    lineageId: 'lineage-1',
    variant: 'skill-benchmark',
  };
  const design = { ...base, benchmarkDesignId: 'design-1' };
  const treatment = {
    ...design,
    scenarioId: 'scenario-1',
    assignmentId: 'assignment-1',
  };
  const scenario = { ...treatment, executionId: 'execution-1' };
  if (stem.startsWith('skill_benchmark.effect_certificate_')) {
    return { ...base, certificateId: 'certificate-1' };
  }
  if (stem === 'skill_benchmark.run_planned'
    || stem === 'skill_benchmark.run_closed') return design;
  if (stem === 'skill_benchmark.treatment_assigned') return treatment;
  if (stem === 'skill_benchmark.resource_exposed') {
    return {
      ...scenario,
      skillBundleId: 'skill-bundle-1',
      resourceId: 'resource-1',
    };
  }
  if (stem.startsWith('skill_benchmark.skill_')) {
    return { ...scenario, skillBundleId: 'skill-bundle-1' };
  }
  if (stem === 'skill_benchmark.milestone_observed') {
    return { ...scenario, milestoneId: 'milestone-1' };
  }
  if ([
    'skill_benchmark.outcome_recorded',
    'skill_benchmark.score_observed',
    'skill_benchmark.gold_integrity_recorded',
    'skill_benchmark.compatibility_observed',
    'skill_benchmark.negative_transfer_observed',
    'skill_benchmark.security_probe_recorded',
  ].includes(stem)) {
    return { ...scenario, observationId: 'observation-1' };
  }
  return scenario;
}

function scopeFor<TStem extends SkillBenchmarkEventStem>(
  stem: TStem,
): SkillBenchmarkScopeMap[TStem] {
  return (
    (DeepImprovementCommonEventStems as readonly string[]).includes(stem)
      ? commonScope(stem as DeepImprovementCommonEventStem)
      : specificScope(stem as SkillBenchmarkSpecificEventStem)
  ) as SkillBenchmarkScopeMap[TStem];
}

function scoreVector(): JsonObject {
  return {
    components: [{
      dimensionCode: 'quality',
      rawScore: 0.8,
      normalizedScore: 0.75,
      weight: 1,
    }],
    aggregateScore: 0.75,
    uncertainty: 0.1,
  };
}

function commonData(
  stem: DeepImprovementCommonEventStem,
): DeepImprovementCommonPayloadMap[DeepImprovementCommonEventStem] {
  const hash = digest(stem);
  const data: Readonly<Record<DeepImprovementCommonEventStem, JsonObject>> = {
    'deep_improvement_common.run_started': {
      generation: 1,
      charterDigest: hash,
      configDigest: hash,
      operatorRef: 'operator:skill-benchmark',
      serviceContractVersion: 'deep-improvement-common@1',
      replayFingerprint: hash,
      maxIterations: 10,
    },
    'deep_improvement_common.run_resumed': {
      priorTailDigest: hash,
      sourceLineageId: 'lineage-0',
      resumeReason: 'Resume after an authorized pause.',
      generation: 2,
      compatibilityDecision: 'exact',
      recoveryReceiptRef: 'receipt:recovery-1',
    },
    'deep_improvement_common.run_paused': {
      pauseReason: 'Awaiting evaluator capacity.',
      checkpointRef: 'checkpoint:run-1',
      checkpointDigest: hash,
      pendingCandidateIds: ['candidate-1'],
      pausedAt: TIMESTAMP,
    },
    'deep_improvement_common.run_completed': {
      terminalOutcome: 'completed',
      stopReason: 'converged',
      sessionOutcome: 'promoted',
      finalLedgerTailHash: hash,
      counts: {
        candidates: 1,
        evaluations: 1,
        observations: 1,
        canaryRuns: 1,
        promotions: 1,
      },
      completionEvidenceRefs: ['evidence:completion-1'],
    },
    'deep_improvement_common.run_aborted': {
      abortReason: 'Evaluator unavailable.',
      lastSafeEventId: 'event-1',
      evidenceRefs: ['evidence:abort-1'],
      retryable: true,
    },
    'deep_improvement_common.run_quarantined': {
      quarantineReasonCode: 'canary-leak',
      quarantineEvidenceRef: 'evidence:quarantine-1',
      quarantineEvidenceDigest: hash,
      affectedCandidateIds: ['candidate-1'],
      policyVersion: 'quarantine@1',
    },
    'deep_improvement_common.candidate_proposed': {
      proposalRef: 'proposal:candidate-1',
      proposalDigest: hash,
      mutationOperatorRef: 'operator:skill-rewrite',
      mutationOperatorVersion: 'skill-rewrite@1',
      parentCandidateId: null,
      targetRef: 'target:skill-1',
      targetDigest: hash,
      proposalPolicyVersion: 'proposal@1',
    },
    'deep_improvement_common.candidate_generated': {
      proposalEventId: 'event-7',
      proposalPayloadDigest: hash,
      candidateArtifactRef: 'artifact:candidate-1',
      candidateArtifactDigest: hash,
      generationReceiptRef: 'receipt:generation-1',
      mutationOperatorRef: 'operator:skill-rewrite',
      mutationOperatorVersion: 'skill-rewrite@1',
    },
    'deep_improvement_common.candidate_rejected': {
      candidateEventId: 'event-8',
      candidatePayloadDigest: hash,
      rejectionReasonCode: 'invalid-candidate',
      evidenceRefs: ['evidence:rejection-1'],
      evidenceSetDigest: hash,
      policyVersion: 'candidate@1',
    },
    'deep_improvement_common.candidate_lineage_attached': {
      parentCandidateId: 'candidate-0',
      parentCandidateDigest: hash,
      lineageEdgeRef: 'lineage-edge:candidate-0:candidate-1',
      lineageEdgeDigest: hash,
      operatorRef: 'operator:skill-rewrite',
    },
    'deep_improvement_common.evaluation_epoch_sealed': {
      evaluatorRef: 'evaluator:independent-1',
      evaluatorCapsuleDigest: hash,
      fixtureSetRef: 'fixture-set:heldout-1',
      fixtureSetDigest: hash,
      scorePolicyVersion: 'score@1',
      scoreWriteBackendRef: DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
      evaluationBudgetRef: 'budget:evaluation-1',
    },
    'deep_improvement_common.evaluation_started': {
      epochSealedEventId: 'event-11',
      epochPayloadDigest: hash,
      executionReceiptRef: 'receipt:evaluation-start-1',
      fixtureCount: 1,
      evaluatorFingerprint: hash,
    },
    'deep_improvement_common.evaluation_observation_recorded': {
      evaluationStartedEventId: 'event-12',
      evaluatorRef: 'evaluator:independent-1',
      fixtureRef: 'fixture:heldout-1',
      rawObservationRef: 'observation:raw-1',
      rawObservationDigest: hash,
      executionReceiptRef: 'receipt:observation-1',
      observationOutcome: 'pass',
    },
    'deep_improvement_common.evaluation_normalized': {
      observationEventIds: ['event-13'],
      observationSetDigest: hash,
      scorePolicyVersion: 'score@1',
      scorerFingerprint: hash,
      scoreWriteBackendRef: DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
      scoreVector: scoreVector(),
      normalizationReceiptRef: 'receipt:normalization-1',
    },
    'deep_improvement_common.evaluation_verification_requested': {
      normalizedEventId: 'event-14',
      normalizedPayloadDigest: hash,
      verificationPolicyVersion: 'verification@1',
      verifierRef: 'verifier:independent-1',
      reasonCode: 'certificate-input',
    },
    'deep_improvement_common.evaluation_verification_recorded': {
      requestEventId: 'event-15',
      verifierRef: 'verifier:independent-1',
      verificationOutcome: 'confirmed',
      verificationEvidenceRef: 'evidence:verification-1',
      verificationEvidenceDigest: hash,
      verificationReceiptRef: 'receipt:verification-1',
    },
    'deep_improvement_common.evaluation_inconclusive': {
      relatedEventIds: ['event-13'],
      reasonCode: 'evidence-conflict',
      uncertainty: 0.7,
      evidenceRefs: ['evidence:inconclusive-1'],
      evidenceSetDigest: hash,
    },
    'deep_improvement_common.evaluation_failed': {
      failedEventId: 'event-12',
      failureStage: 'execution',
      reasonCode: 'timeout',
      failureReceiptRef: 'receipt:failure-1',
      retryable: true,
    },
    'deep_improvement_common.canary_suite_sealed': {
      suiteRef: 'canary-suite:sealed-1',
      suiteDigest: hash,
      canaryPolicyVersion: 'canary@1',
      fixtureCount: 1,
      protectedMaterialRef: 'protected:canary-1',
      protectedMaterialDigest: hash,
    },
    'deep_improvement_common.canary_executed': {
      suiteSealedEventId: 'event-19',
      suitePayloadDigest: hash,
      executionReceiptRef: 'receipt:canary-1',
      canaryObservationRef: 'observation:canary-1',
      canaryObservationDigest: hash,
      outcome: 'pass',
    },
    'deep_improvement_common.canary_leak_detected': {
      executionEventId: 'event-20',
      leakClass: 'gold-exposure',
      leakEvidenceRef: 'evidence:leak-1',
      leakEvidenceDigest: hash,
      detectorFingerprint: hash,
      reasonCode: 'gold-match',
    },
    'deep_improvement_common.canary_drift_detected': {
      executionEventId: 'event-20',
      baselineRef: 'baseline:canary-1',
      baselineDigest: hash,
      driftEvidenceRef: 'evidence:drift-1',
      driftEvidenceDigest: hash,
      driftRatio: 0.2,
      policyVersion: 'drift@1',
    },
    'deep_improvement_common.canary_invariant_failed': {
      executionEventId: 'event-20',
      invariantCode: 'gold-isolation',
      invariantVersion: 'gold-isolation@1',
      evidenceRef: 'evidence:invariant-1',
      evidenceDigest: hash,
      reasonCode: 'isolation-failed',
    },
    'deep_improvement_common.canary_gate_passed': {
      executionEventIds: ['event-20'],
      evidenceSetDigest: hash,
      policyVersion: 'canary-gate@1',
      policyFingerprint: hash,
      decisionReceiptRef: 'receipt:canary-pass-1',
    },
    'deep_improvement_common.canary_gate_failed': {
      executionEventIds: ['event-20'],
      failureClasses: ['leak'],
      evidenceSetDigest: hash,
      policyVersion: 'canary-gate@1',
      policyFingerprint: hash,
      decisionReceiptRef: 'receipt:canary-fail-1',
    },
    'deep_improvement_common.canary_vetoed': {
      gateEventId: 'event-25',
      gatePayloadDigest: hash,
      vetoReasonCode: 'gate-failed',
      vetoEvidenceRef: 'evidence:veto-1',
      vetoEvidenceDigest: hash,
      quarantineRef: 'quarantine:candidate-1',
    },
    'deep_improvement_common.promotion_proposed': {
      normalizedEventId: 'event-14',
      normalizedPayloadDigest: hash,
      canaryGateEventId: 'event-24',
      canaryGatePayloadDigest: hash,
      proposalPolicyVersion: 'promotion@1',
      requestedRollout: 'shadow',
      evidenceSetDigest: hash,
    },
    'deep_improvement_common.promotion_authorized': {
      proposalEventId: 'event-27',
      proposalPayloadDigest: hash,
      externalAuthorizationRef: 'transition-authorization:decision-1',
      externalAuthorizationDigest: hash,
      authorizationPolicyVersion: 'authorization@1',
      authorizationReceiptRef: 'receipt:authorization-1',
    },
    'deep_improvement_common.promotion_denied': {
      proposalEventId: 'event-27',
      proposalPayloadDigest: hash,
      externalDecisionRef: 'transition-authorization:decision-2',
      externalDecisionDigest: hash,
      denialReasonCode: 'denied',
      decisionReceiptRef: 'receipt:denial-1',
    },
    'deep_improvement_common.promotion_shadow_started': {
      authorizationEventId: 'event-28',
      authorizationPayloadDigest: hash,
      rolloutRef: 'rollout:shadow-1',
      rolloutDigest: hash,
      startedAt: TIMESTAMP,
    },
    'deep_improvement_common.promotion_canary_started': {
      authorizationEventId: 'event-28',
      authorizationPayloadDigest: hash,
      rolloutRef: 'rollout:canary-1',
      rolloutDigest: hash,
      startedAt: TIMESTAMP,
    },
    'deep_improvement_common.promotion_paused': {
      activeRolloutEventId: 'event-30',
      pauseReason: 'Observed drift.',
      checkpointRef: 'checkpoint:promotion-1',
      checkpointDigest: hash,
    },
    'deep_improvement_common.promotion_aborted': {
      activeRolloutEventId: 'event-30',
      abortReason: 'Canary vetoed rollout.',
      restorationRequired: true,
      decisionReceiptRef: 'receipt:abort-1',
    },
    'deep_improvement_common.promotion_baseline_restored': {
      abortedEventId: 'event-33',
      baselineRef: 'baseline:stable-1',
      baselineDigest: hash,
      restorationReceiptRef: 'receipt:restoration-1',
      restoredAt: TIMESTAMP,
    },
    'deep_improvement_common.promotion_completed': {
      authorizationEventId: 'event-28',
      rolloutEventIds: ['event-30'],
      evidenceSetDigest: hash,
      completionReceiptRef: 'receipt:promotion-complete-1',
      completedAt: TIMESTAMP,
    },
  };
  return data[stem] as DeepImprovementCommonPayloadMap[
    DeepImprovementCommonEventStem
  ];
}

function validityDomain(hash: string): JsonObject {
  return {
    taskSetDigest: hash,
    skillBundleDigest: hash,
    registryDigest: hash,
    executorDigest: hash,
    environmentDigest: hash,
    dependencyDigest: hash,
    workloadDigest: hash,
    validityPolicyVersion: 'validity@1',
  };
}

function specificData(
  stem: SkillBenchmarkSpecificEventStem,
): SkillBenchmarkPayloadMap[SkillBenchmarkSpecificEventStem] {
  const hash = digest(stem);
  const data: Readonly<Record<SkillBenchmarkSpecificEventStem, JsonObject>> = {
    'skill_benchmark.run_planned': {
      designRef: 'design:benchmark-1',
      designDigest: hash,
      taskSetRef: 'task-set:paired-1',
      taskSetDigest: hash,
      skillBundleRef: 'skill-bundle:1',
      skillBundleDigest: hash,
      registryDigest: hash,
      executorDescriptorRef: 'executor:descriptor-1',
      executorDescriptorDigest: hash,
      environmentDigest: hash,
      dependencyDigest: hash,
      workloadDigest: hash,
      randomizationSeed: 42,
      replicateCount: 2,
      designPolicyVersion: 'benchmark-design@1',
    },
    'skill_benchmark.treatment_assigned': {
      designEventId: 'event:design-1',
      designPayloadDigest: hash,
      treatmentArm: 'auto-route',
      randomizationSeed: 42,
      propensity: 0.5,
      replicateIndex: 1,
      pairedReplicateId: 'pair-1',
      designCellId: 'cell-auto-route-1',
      taskRef: 'task:scenario-1',
      taskDigest: hash,
      skillBundleRef: 'skill-bundle:1',
      skillBundleDigest: hash,
      executorDescriptorRef: 'executor:descriptor-1',
      executorDescriptorDigest: hash,
      environmentDigest: hash,
      assignmentReceiptRef: 'receipt:assignment-1',
    },
    'skill_benchmark.run_closed': {
      designEventId: 'event:design-1',
      scenarioTerminalEventIds: ['event:scenario-finished-1'],
      terminalStatus: 'closed',
      accountingRef: 'accounting:run-1',
      accountingDigest: hash,
      closedAt: TIMESTAMP,
    },
    'skill_benchmark.scenario_started': {
      assignmentEventId: 'event:assignment-1',
      assignmentPayloadDigest: hash,
      taskRef: 'task:scenario-1',
      taskDigest: hash,
      environmentRef: 'environment:snapshot-1',
      environmentDigest: hash,
      executorDescriptorRef: 'executor:descriptor-1',
      executorDescriptorDigest: hash,
      toolDigest: hash,
      permissionDigest: hash,
      dependencyDigest: hash,
      workloadDigest: hash,
      executionReceiptRef: 'receipt:execution-start-1',
      startedAt: TIMESTAMP,
    },
    'skill_benchmark.scenario_finished': {
      startedEventId: 'event:scenario-started-1',
      startedPayloadDigest: hash,
      outcomeRef: 'outcome:scenario-1',
      outcomeDigest: hash,
      finalStateDigest: hash,
      executionReceiptRef: 'receipt:execution-finish-1',
      terminalOutcome: 'pass',
      finishedAt: TIMESTAMP,
    },
    'skill_benchmark.scenario_aborted': {
      startedEventId: 'event:scenario-started-1',
      startedPayloadDigest: hash,
      abortReasonCode: 'executor-timeout',
      evidenceRef: 'evidence:abort-1',
      evidenceDigest: hash,
      executionReceiptRef: 'receipt:execution-abort-1',
      retryable: true,
      abortedAt: TIMESTAMP,
    },
    'skill_benchmark.skill_discovered': {
      scenarioStartedEventId: 'event:scenario-started-1',
      skillBundleRef: 'skill-bundle:1',
      skillBundleDigest: hash,
      registryDigest: hash,
      discoveryMethod: 'auto-route',
      availabilityStatus: 'available',
      discoveryEvidenceRef: 'evidence:discovery-1',
      discoveryEvidenceDigest: hash,
    },
    'skill_benchmark.skill_loaded': {
      discoveredEventId: 'event:skill-discovered-1',
      discoveredPayloadDigest: hash,
      disclosureStage: 'instructions',
      skillBundleRef: 'skill-bundle:1',
      skillBundleDigest: hash,
      loadedResourceClasses: ['instructions'],
      loaderReceiptRef: 'receipt:loader-1',
      loadStatus: 'loaded',
    },
    'skill_benchmark.skill_invoked': {
      loadedEventId: 'event:skill-loaded-1',
      loadedPayloadDigest: hash,
      invocationMode: 'auto',
      activationRef: 'activation:skill-1',
      activationDigest: hash,
      invocationReceiptRef: 'receipt:invocation-1',
      invocationStatus: 'invoked',
      failureReasonCode: null,
    },
    'skill_benchmark.resource_exposed': {
      skillLoadedEventId: 'event:skill-loaded-1',
      resourceRef: 'resource:reference-1',
      resourceDigest: hash,
      resourceClass: 'reference',
      exposureStage: 'resources',
      canaryRef: 'canary:resource-1',
      canaryDigest: hash,
      exposureReceiptRef: 'receipt:exposure-1',
      canaryStatus: 'clean',
    },
    'skill_benchmark.milestone_observed': {
      scenarioStartedEventId: 'event:scenario-started-1',
      milestoneCode: 'validated-output',
      ordinal: 1,
      milestoneState: 'reached',
      observationRef: 'observation:milestone-1',
      observationDigest: hash,
      complianceStatus: 'compliant',
    },
    'skill_benchmark.trajectory_recorded': {
      scenarioStartedEventId: 'event:scenario-started-1',
      milestoneEventIds: ['event:milestone-1'],
      orderedKeyPointCodes: ['discover', 'load', 'invoke', 'validate'],
      intermediateStateDigest: hash,
      traceRef: 'trace:trajectory-1',
      traceDigest: hash,
      complianceObservationRef: 'observation:compliance-1',
      complianceObservationDigest: hash,
    },
    'skill_benchmark.outcome_recorded': {
      scenarioTerminalEventId: 'event:scenario-finished-1',
      finalStateRef: 'state:final-1',
      finalStateDigest: hash,
      deterministicCheckSetRef: 'checks:deterministic-1',
      deterministicCheckSetDigest: hash,
      dynamicReferenceSetRef: 'checks:dynamic-1',
      dynamicReferenceSetDigest: hash,
      constraintCoverageRef: 'coverage:constraints-1',
      constraintCoverageDigest: hash,
      outcomeStatus: 'pass',
    },
    'skill_benchmark.score_observed': {
      outcomeEventId: 'event:outcome-1',
      evaluatorRef: 'evaluator:skill-benchmark-1',
      evaluatorVersion: 'evaluator@1',
      evaluatorFingerprint: hash,
      deterministicResultsRef: 'results:deterministic-1',
      deterministicResultsDigest: hash,
      dynamicReferenceResultsRef: 'results:dynamic-1',
      dynamicReferenceResultsDigest: hash,
      rawScoreAxes: [{
        dimensionCode: 'correctness',
        rawScore: 0.8,
        measurementRef: 'measurement:correctness-1',
        measurementDigest: hash,
      }],
      constraintCoverageRef: 'coverage:constraints-1',
      constraintCoverageDigest: hash,
      tokenCount: 500,
      latencyMs: 1200,
      costMicrounits: 25,
      workloadDigest: hash,
      goldIntegrityEventId: 'event:gold-integrity-1',
      goldIntegrityPayloadDigest: hash,
      goldPolicy: 'scored',
      numeratorEligible: true,
      scoreWriteBackendRef: SKILL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
    },
    'skill_benchmark.gold_integrity_recorded': {
      goldRef: 'gold:scenario-1',
      goldDigest: hash,
      goldPolicy: 'scored',
      provenanceRef: 'provenance:gold-1',
      provenanceDigest: hash,
      coverageRatio: 1,
      integrityStatus: 'accepted',
      reasonCode: 'gold-verified',
      evaluatorRef: 'evaluator:gold-integrity-1',
      evaluatorFingerprint: hash,
    },
    'skill_benchmark.compatibility_observed': {
      scenarioStartedEventId: 'event:scenario-started-1',
      taskDigest: hash,
      skillBundleDigest: hash,
      registryDigest: hash,
      executorDigest: hash,
      toolDigest: hash,
      permissionDigest: hash,
      environmentDigest: hash,
      dependencyDigest: hash,
      workloadDigest: hash,
      compatibilityStatus: 'compatible',
      evidenceRef: 'evidence:compatibility-1',
      evidenceDigest: hash,
    },
    'skill_benchmark.negative_transfer_observed': {
      baselineAssignmentEventId: 'event:assignment-control-1',
      treatedAssignmentEventId: 'event:assignment-treated-1',
      baselineOutcomeEventId: 'event:outcome-control-1',
      treatedOutcomeEventId: 'event:outcome-treated-1',
      axisCode: 'correctness',
      rawDelta: -0.1,
      transferStatus: 'negative-transfer',
      evidenceRef: 'evidence:negative-transfer-1',
      evidenceDigest: hash,
    },
    'skill_benchmark.security_probe_recorded': {
      scenarioStartedEventId: 'event:scenario-started-1',
      probeRef: 'probe:prompt-injection-1',
      probeDigest: hash,
      compositionPathDigest: hash,
      probeOutcome: 'pass',
      evidenceRef: 'evidence:security-probe-1',
      evidenceDigest: hash,
      refusalObserved: true,
      policyVersion: 'security-probe@1',
    },
    'skill_benchmark.effect_certificate_issued': {
      normalizedScoreEventRef:
        'event:deep_improvement_common.evaluation_normalized:event-14',
      normalizedScorePayloadDigest: hash,
      goldIntegrityEventId: 'event:gold-integrity-1',
      evidenceEventIds: ['event:outcome-1', 'event:score-1'],
      evidenceSetDigest: hash,
      validityDomain: validityDomain(hash),
      confidenceIntervalRef: 'confidence-interval:certificate-1',
      confidenceIntervalDigest: hash,
      componentAblationEventIds: ['event:ablation-1'],
      compatibilityEventIds: ['event:compatibility-1'],
      issueReceiptRef: 'receipt:certificate-issue-1',
      issuedAt: TIMESTAMP,
      expiresAt: '2027-07-23T10:00:00.000Z',
    },
    'skill_benchmark.effect_certificate_withheld': {
      normalizedScoreEventRef: null,
      evidenceEventIds: ['event:outcome-1'],
      evidenceSetDigest: hash,
      validityDomain: validityDomain(hash),
      withholdingReasonCode: 'gold-pending',
      decisionReceiptRef: 'receipt:certificate-withheld-1',
      withheldAt: TIMESTAMP,
    },
    'skill_benchmark.effect_certificate_expired': {
      issuedEventId: 'event:certificate-issued-1',
      issuedPayloadDigest: hash,
      expiryTrigger: 'registry-drift',
      triggerEvidenceRef: 'evidence:registry-drift-1',
      triggerEvidenceDigest: hash,
      expiredAt: '2027-07-23T10:00:00.000Z',
    },
  };
  return data[stem] as SkillBenchmarkPayloadMap[
    SkillBenchmarkSpecificEventStem
  ];
}

function dataFor<TStem extends SkillBenchmarkEventStem>(
  stem: TStem,
): SkillBenchmarkPayloadMap[TStem] {
  return (
    (DeepImprovementCommonEventStems as readonly string[]).includes(stem)
      ? commonData(stem as DeepImprovementCommonEventStem)
      : specificData(stem as SkillBenchmarkSpecificEventStem)
  ) as SkillBenchmarkPayloadMap[TStem];
}

function eventInput<TStem extends SkillBenchmarkEventStem>(
  stem: TStem,
  index: number,
  prevEventHash: string,
): SkillBenchmarkEventInput<TStem> {
  return {
    stem,
    scope: scopeFor(stem),
    prevEventHash,
    replay: replayMetadata(stem),
    data: dataFor(stem),
    eventId: `event-${index}`,
    streamId: 'skill-benchmark-run-1',
    streamSequence: index,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'skill-benchmark-shadow-schema', version: '1' },
    authorityEpoch: 1,
    correlationId: 'run-1',
    causationId: index === 1 ? null : `event-${index - 1}`,
    idempotencyKey: `skill-benchmark-event-${index}`,
  };
}

function eventInputWithDataField<
  TStem extends SkillBenchmarkSpecificEventStem,
>(
  stem: TStem,
  index: number,
  field: string,
  value: unknown,
): SkillBenchmarkEventInput<TStem> {
  const input = eventInput(stem, index, '0'.repeat(64));
  return {
    ...input,
    data: { ...input.data, [field]: value } as SkillBenchmarkPayloadMap[TStem],
  };
}

async function authorizationRequest(
  harness: Harness,
  event: EventWritePreflight,
  requestId: string,
  capabilityId = 'skill-benchmark:append',
): Promise<TransitionAuthorizationRequest> {
  const policy = harness.policies.resolve('skill-benchmark-shadow-write', 1);
  return {
    requestId,
    mode: 'skill-benchmark',
    event,
    priorHead: await harness.ledger.getVerifiedHead(),
    priorStateVersion: 'skill-benchmark-shadow@1',
    priorStateFingerprint: digest('prior-state'),
    actorId: 'skill-benchmark-runtime',
    capabilityId,
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
  requestId: string,
): Promise<GatewayAllowProof> {
  const result = await harness.gateway.authorize(
    await authorizationRequest(harness, event, requestId),
  );
  expect(result.verdict).toBe('allow');
  if (result.verdict !== 'allow') throw new Error(result.reasonCode);
  return result.proof;
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('skill-benchmark typed ledger schema', () => {
  it('extends every common stem with exactly the benchmark-specific vocabulary', () => {
    expect(SkillBenchmarkSpecificEventStems).toHaveLength(21);
    expect(SkillBenchmarkEventStems).toHaveLength(
      DeepImprovementCommonEventStems.length
        + SkillBenchmarkSpecificEventStems.length,
    );
    expect(SkillBenchmarkEventStems.slice(
      0,
      DeepImprovementCommonEventStems.length,
    )).toEqual(DeepImprovementCommonEventStems);
    expect(createSkillBenchmarkEventRegistry().inspect()).toHaveLength(
      SkillBenchmarkEventStems.length,
    );
  });

  it('authorizes, appends, and verifies every common and benchmark stem', async () => {
    const harness = createHarness();
    let priorHash = '0'.repeat(64);
    for (const [offset, stem] of SkillBenchmarkEventStems.entries()) {
      const index = offset + 1;
      const event = prepareSkillBenchmarkEvent(
        eventInput(stem, index, priorHash),
        harness.registry,
      );
      const proof = await authorize(harness, event, `request-${index}`);
      const receipt = await harness.ledger.appendAuthorized(event, proof);
      priorHash = receipt.recordHash;
    }

    const verified = await harness.ledger.readVerifiedEvents();
    expect(verified).toHaveLength(SkillBenchmarkEventStems.length);
    expect(verified.map((entry) => entry.event.stored.envelope.event_type))
      .toEqual(SkillBenchmarkEventStems.map(
        (stem) => SkillBenchmarkWireEventTypes[stem],
      ));
    for (const [index, entry] of verified.entries()) {
      const stem = SkillBenchmarkEventStems[index];
      expect(entry.event.stored.envelope.payload.stem).toBe(stem);
      expect(entry.event.stored.envelope.payload.replay)
        .toEqual(replayMetadata(stem));
      expect(entry.frame.authorization_ref.decision_id).not.toBe('');
    }
  });

  it('keeps common envelope shapes closed and the score backend pinned', () => {
    expect(SKILL_BENCHMARK_SHARED_ENVELOPE_FIELDS).toEqual(
      EVENT_ENVELOPE_FIELDS,
    );
    expect(SKILL_BENCHMARK_SCORE_WRITE_BACKEND_REF).toBe(
      DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
    );
    for (const stem of DeepImprovementCommonEventStems) {
      expect(SkillBenchmarkWireEventTypes[stem]).toBe(
        DeepImprovementCommonWireEventTypes[stem],
      );
    }

    const registry = createSkillBenchmarkEventRegistry();
    const common = eventInput(
      'deep_improvement_common.run_started',
      1,
      '0'.repeat(64),
    );
    expect(() => prepareSkillBenchmarkEvent({
      ...common,
      scope: {
        ...common.scope,
        variant: 'agent-improvement',
      },
    } as unknown as typeof common, registry)).toThrow();
  });

  it('rejects foreign common variants before durable append', async () => {
    const harness = createHarness();
    const common = eventInput(
      'deep_improvement_common.run_started',
      1,
      '0'.repeat(64),
    );
    const foreign = {
      ...common,
      scope: {
        ...common.scope,
        variant: 'agent-improvement',
      },
    } as unknown as DeepImprovementCommonEventInput<
      'deep_improvement_common.run_started'
    >;
    const foreignPrepared = prepareDeepImprovementCommonEvent(
      foreign,
      createDeepImprovementCommonEventRegistry(),
    );
    const foreignForLane = Object.freeze({
      ...foreignPrepared,
      registryDigest: harness.registry.digest,
    });

    expect(() => prepareEventWrite(
      foreignForLane.envelope,
      harness.registry,
    )).toThrow();
    expect(() => prepareDeepImprovementCommonEvent(
      foreign,
      harness.registry,
    )).toThrow();

    const foreignProof = await authorize(
      harness,
      foreignForLane,
      'foreign-variant',
    );
    await expect(harness.ledger.appendAuthorized(
      foreignForLane,
      foreignProof,
    )).rejects.toThrow();
    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({
      sequence: 0,
    });
    await expect(harness.ledger.readVerifiedEvents()).resolves.toHaveLength(0);

    const correctPrepared = prepareDeepImprovementCommonEvent(
      common as unknown as DeepImprovementCommonEventInput<
        'deep_improvement_common.run_started'
      >,
      harness.registry,
    );
    const correctProof = await authorize(
      harness,
      correctPrepared,
      'correct-variant',
    );
    await harness.ledger.appendAuthorized(correctPrepared, correctProof);
    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({
      sequence: 1,
    });
    await expect(harness.ledger.readVerifiedEvents()).resolves.toHaveLength(1);
  });

  it('produces deterministic payload and canonical digests', () => {
    const registry = createSkillBenchmarkEventRegistry();
    const input = eventInput(
      'skill_benchmark.score_observed',
      1,
      '0'.repeat(64),
    );
    const first = prepareSkillBenchmarkEvent(input, registry);
    const second = prepareSkillBenchmarkEvent(input, registry);
    expect(second.identity).toEqual(first.identity);
    expect(second.canonicalDigest).toBe(first.canonicalDigest);
    expect(second.envelope.payload.payloadDigest).toBe(
      first.envelope.payload.payloadDigest,
    );
  });

  it('rejects missing identities and absent previous-event hashes', () => {
    const registry = createSkillBenchmarkEventRegistry();
    const score = eventInput(
      'skill_benchmark.score_observed',
      1,
      '0'.repeat(64),
    );
    const missingRun = { ...score.scope } as Record<string, unknown>;
    delete missingRun.runId;
    expect(() => prepareSkillBenchmarkEvent({
      ...score,
      scope: missingRun as typeof score.scope,
    }, registry)).toThrow();

    const missingObservation = { ...score.scope } as Record<string, unknown>;
    delete missingObservation.observationId;
    expect(() => prepareSkillBenchmarkEvent({
      ...score,
      scope: missingObservation as typeof score.scope,
    }, registry)).toThrow();

    const prepared = prepareSkillBenchmarkEvent(score, registry);
    const payload = { ...prepared.envelope.payload };
    delete payload.prevEventHash;
    expect(() => prepareEventWrite({
      ...prepared.envelope,
      payload,
    }, registry)).toThrow();
    expect(() => prepareEventWrite({
      ...prepared.envelope,
      event_id: '',
    }, registry)).toThrow();
  });

  it('rejects mutable output bodies through evidence-bearing fields', async () => {
    const harness = createHarness();
    const mutableOutput = 'mutable benchmark output '.repeat(150);
    expect(() => prepareSkillBenchmarkEvent(
      eventInputWithDataField(
        'skill_benchmark.trajectory_recorded',
        1,
        'traceRef',
        mutableOutput,
      ),
      harness.registry,
    )).toThrow();

    const score = eventInput(
      'skill_benchmark.score_observed',
      1,
      '0'.repeat(64),
    );
    expect(() => prepareSkillBenchmarkEvent({
      ...score,
      data: {
        ...score.data,
        rawScoreAxes: [{
          ...score.data.rawScoreAxes[0],
          measurementRef: mutableOutput,
        }],
      },
    }, harness.registry)).toThrow();
    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({
      sequence: 0,
    });
  });

  it('separates raw outcomes, raw score axes, normalized scores, and verdicts', () => {
    const registry = createSkillBenchmarkEventRegistry();
    const outcome = eventInput(
      'skill_benchmark.outcome_recorded',
      1,
      '0'.repeat(64),
    );
    expect(() => prepareSkillBenchmarkEvent({
      ...outcome,
      data: { ...outcome.data, aggregateScore: 0.9 },
    }, registry)).toThrow();

    const score = eventInput(
      'skill_benchmark.score_observed',
      2,
      '0'.repeat(64),
    );
    expect(() => prepareSkillBenchmarkEvent({
      ...score,
      data: { ...score.data, rank: 1, promoted: true },
    }, registry)).toThrow();
    expect(() => prepareSkillBenchmarkEvent({
      ...score,
      data: {
        ...score.data,
        scoreWriteBackendRef: 'backend:caller-selected',
      },
    }, registry)).toThrow();

    const certificate = eventInput(
      'skill_benchmark.effect_certificate_issued',
      3,
      '0'.repeat(64),
    );
    expect(() => prepareSkillBenchmarkEvent({
      ...certificate,
      data: {
        ...certificate.data,
        normalizedScoreEventRef:
          'event:skill_benchmark.score_observed:event-raw-score-1',
      },
    }, registry)).toThrow();
    expect(() => prepareSkillBenchmarkEvent(certificate, registry)).not.toThrow();
  });

  it('blocks pending or structural-only gold from a positive numerator', () => {
    const registry = createSkillBenchmarkEventRegistry();
    for (const goldPolicy of ['pending', 'structural-only'] as const) {
      const score = eventInput(
        'skill_benchmark.score_observed',
        1,
        '0'.repeat(64),
      );
      expect(() => prepareSkillBenchmarkEvent({
        ...score,
        data: { ...score.data, goldPolicy, numeratorEligible: true },
      }, registry)).toThrow();
      expect(() => prepareSkillBenchmarkEvent({
        ...score,
        data: { ...score.data, goldPolicy, numeratorEligible: false },
      }, registry)).not.toThrow();
    }

    const gold = eventInput(
      'skill_benchmark.gold_integrity_recorded',
      2,
      '0'.repeat(64),
    );
    expect(() => prepareSkillBenchmarkEvent({
      ...gold,
      data: {
        ...gold.data,
        goldPolicy: 'pending',
        integrityStatus: 'accepted',
        coverageRatio: 1,
      },
    }, registry)).toThrow();
  });

  it('rejects in-place scenario and paired-result rewrites', () => {
    const registry = createSkillBenchmarkEventRegistry();
    const scenario = prepareSkillBenchmarkEvent(
      eventInput(
        'skill_benchmark.scenario_finished',
        1,
        '0'.repeat(64),
      ),
      registry,
    );
    expect(() => prepareEventWrite({
      ...scenario.envelope,
      event_type: 'skill-benchmark.ledger.scenario-updated',
    }, registry)).toThrow();

    const transfer = eventInput(
      'skill_benchmark.negative_transfer_observed',
      2,
      '0'.repeat(64),
    );
    expect(() => prepareSkillBenchmarkEvent({
      ...transfer,
      data: {
        ...transfer.data,
        treatedOutcomeEventId: transfer.data.baselineOutcomeEventId,
      },
    }, registry)).toThrow();
  });

  it('denies unauthorized transitions before append', async () => {
    const harness = createHarness();
    const event = prepareSkillBenchmarkEvent(
      eventInput(
        'skill_benchmark.score_observed',
        1,
        '0'.repeat(64),
      ),
      harness.registry,
    );
    const denied = await harness.gateway.authorize(
      await authorizationRequest(
        harness,
        event,
        'denied-request',
        'read-only',
      ),
    );
    expect(denied.verdict).toBe('deny');
    await expect(harness.ledger.appendAuthorized(
      event,
      undefined as unknown as GatewayAllowProof,
    )).rejects.toMatchObject({
      code: AuthorizedLedgerErrorCodes.AUTHORIZATION_REQUIRED,
    });
    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({
      sequence: 0,
    });
    await expect(harness.ledger.readVerifiedEvents()).resolves.toHaveLength(0);
  });

  it('supports the complete treatment lattice with paired assignment facts', () => {
    const registry = createSkillBenchmarkEventRegistry();
    for (const treatmentArm of [
      'auto-route',
      'compatibility-boundary',
      'component-ablation',
      'control',
      'distractor',
      'forced-activation',
      'no-skill',
      'placebo',
    ] as const) {
      const assignment = eventInput(
        'skill_benchmark.treatment_assigned',
        1,
        '0'.repeat(64),
      );
      expect(() => prepareSkillBenchmarkEvent({
        ...assignment,
        data: { ...assignment.data, treatmentArm },
      }, registry)).not.toThrow();
    }
  });

  it('fails closed on unknown stems and every version boundary', () => {
    expect(decideSkillBenchmarkCompatibility({
      format: 'skill-benchmark-ledger',
      stem: 'skill_benchmark.run_planned',
      eventVersion: 1,
    }).status).toBe('exact');
    expect(decideSkillBenchmarkCompatibility({
      format: 'skill-benchmark-ledger',
      stem: 'deep_improvement_common.run_started',
      eventVersion: 1,
    }).status).toBe('exact');
    expect(decideSkillBenchmarkCompatibility({
      type: 'progress',
      schemaVersion: 1,
    }).status).toBe('compatible');
    expect(decideSkillBenchmarkCompatibility({
      eventType: 'ranking_published',
      schemaVersion: 1,
    }).status).toBe('pin-old-runtime');
    expect(decideSkillBenchmarkCompatibility({
      eventType: 'unknown',
      schemaVersion: 1,
    }).status).toBe('blocked');
    expect(decideSkillBenchmarkCompatibility({
      eventType: 'benchmark_run_planned',
      schemaVersion: 99,
      runId: 'run-1',
      lineageId: 'lineage-1',
      benchmarkDesignId: 'design-1',
    }).status).toBe('blocked');

    const registry = createSkillBenchmarkEventRegistry();
    const prepared = prepareSkillBenchmarkEvent(
      eventInput(
        'skill_benchmark.run_planned',
        1,
        '0'.repeat(64),
      ),
      registry,
    );
    expect(() => prepareEventWrite({
      ...prepared.envelope,
      envelope_version: 99,
    }, registry)).toThrow();
    expect(() => prepareEventWrite({
      ...prepared.envelope,
      event_version: 99,
    }, registry)).toThrow();
    expect(() => prepareEventWrite({
      ...prepared.envelope,
      payload: { ...prepared.envelope.payload, eventVersion: 99 },
    }, registry)).toThrow();
  });

  it('classifies stable legacy planning records for migration', () => {
    expect(decideSkillBenchmarkCompatibility({
      eventType: 'benchmark_run_planned',
      schemaVersion: 1,
      runId: 'run-1',
      lineageId: 'lineage-1',
      benchmarkDesignId: 'design-1',
    })).toMatchObject({
      status: 'migrate',
      reasonCode: 'registered-pure-upcaster',
    });
  });

  it('pins legacy planning records without stable design identity', () => {
    expect(decideSkillBenchmarkCompatibility({
      eventType: 'benchmark_run_planned',
      schemaVersion: 1,
    })).toMatchObject({
      status: 'pin-old-runtime',
      reasonCode: 'stable-design-identity-missing',
    });
  });

  it('upcasts registered legacy planning records without mutating source facts', () => {
    const record = {
      eventType: 'benchmark_run_planned',
      schemaVersion: 1,
      runId: 'run-1',
      lineageId: 'lineage-1',
      benchmarkDesignId: 'design-1',
      randomizationSeed: 42,
      replicateCount: 2,
      designPolicyVersion: 'legacy-design@1',
      details: {
        transcript: 'mutable legacy material remains outside typed payloads',
      },
    };
    const context = {
      scope: {
        runId: 'run-1',
        lineageId: 'lineage-1',
        variant: 'skill-benchmark' as const,
        benchmarkDesignId: 'design-1',
      },
      prevEventHash: '0'.repeat(64),
      replay: replayMetadata('legacy-design'),
    };
    const first = upcastLegacySkillBenchmarkRecord(record, context);
    const second = upcastLegacySkillBenchmarkRecord(record, context);
    expect(second).toEqual(first);
    expect(first.status).toBe('migrated');
    if (first.status !== 'migrated') throw new Error(first.decision.reasonCode);
    expect(first.targetStem).toBe('skill_benchmark.run_planned');
    expect(first.originalRecordDigest).toBe(digest(record));
    expect(first.upcasterFingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(() => prepareSkillBenchmarkEvent({
      ...eventInput(
        'skill_benchmark.run_planned',
        1,
        context.prevEventHash,
      ),
      scope: context.scope,
      replay: context.replay,
      data: first.data as SkillBenchmarkPayloadMap[
        'skill_benchmark.run_planned'
      ],
    }, createSkillBenchmarkEventRegistry())).not.toThrow();
    expect(record.details.transcript).toContain('mutable legacy material');
  });
});
