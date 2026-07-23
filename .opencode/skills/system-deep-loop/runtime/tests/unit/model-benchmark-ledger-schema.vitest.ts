// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Ledger Schema Tests
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
  isDeepImprovementCommonEventStem,
  prepareDeepImprovementCommonEvent,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import {
  MODEL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
  ModelBenchmarkEventStems,
  ModelBenchmarkSpecificEventStems,
  ModelBenchmarkWireEventTypes,
  createModelBenchmarkEventRegistry,
  decideModelBenchmarkCompatibility,
  prepareModelBenchmarkEvent,
  upcastLegacyModelBenchmarkRecord,
} from '../../lib/model-benchmark-ledger-schema/index.js';
import {
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';

import type {
  GatewayAllowProof,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepImprovementCommonEventStem,
  DeepImprovementCommonPayloadMap,
  DeepImprovementCommonScopeMap,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import type {
  ModelBenchmarkEventInput,
  ModelBenchmarkEventStem,
  ModelBenchmarkPayloadMap,
  ModelBenchmarkReplayMetadata,
  ModelBenchmarkScopeMap,
  ModelBenchmarkSpecificEventStem,
  ModelBenchmarkSpecificPayloadMap,
  ModelBenchmarkSpecificScopeMap,
  ModelBenchmarkTrialScope,
  ScoreVectorObservation,
  TaskLineage,
  TrialMatrixKey,
} from '../../lib/model-benchmark-ledger-schema/index.js';
import type {
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../../lib/event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const TIMESTAMP = '2026-07-23T10:00:00.000Z';
const LEDGER_ID = 'model-benchmark-shadow';
const AUDIT_LEDGER_ID = 'model-benchmark-shadow-authorization';
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
  const root = mkdtempSync(join(tmpdir(), 'model-benchmark-schema-'));
  temporaryRoots.push(root);
  return root;
}

function createHarness(): Harness {
  const rootDirectory = temporaryRoot();
  const registry = createModelBenchmarkEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'model-benchmark-shadow-write',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['known-model-benchmark-event', 'shadow-capability'],
    evaluate: (input) => {
      const knownNamespace = input.requestedEventType.startsWith(
        'deep-improvement.model-benchmark.',
      ) || input.requestedEventType.startsWith('deep-improvement-common.ledger.');
      const allowed = knownNamespace
        && input.capabilityId === 'model-benchmark:append';
      return {
        verdict: allowed ? 'allow' : 'deny',
        reasonCode: allowed ? 'allowed' : 'policy_denied',
        matchedRuleIds: ['known-model-benchmark-event', 'shadow-capability'],
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

function replayMetadata(label: string): ModelBenchmarkReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest(`replay:${label}`),
    replay_input_digests: {
      configuration: digest('configuration'),
      evaluator: digest('evaluator'),
    },
  };
}

function commonScoreVector(): JsonObject {
  return {
    components: [{
      dimensionCode: 'quality',
      rawScore: 0.8,
      normalizedScore: 0.75,
      weight: 0.6,
    }, {
      dimensionCode: 'safety',
      rawScore: 0.9,
      normalizedScore: 0.9,
      weight: 0.4,
    }],
    aggregateScore: 0.81,
    uncertainty: 0.08,
  };
}

function commonScopeFor<TStem extends DeepImprovementCommonEventStem>(
  stem: TStem,
): DeepImprovementCommonScopeMap[TStem] {
  const base = {
    runId: 'run-1',
    lineageId: 'lineage-1',
    variant: 'model-benchmark' as const,
  };
  const candidate = { ...base, candidateId: 'candidate-1' };
  if (stem.startsWith('deep_improvement_common.evaluation_')) {
    const evaluation = { ...candidate, evaluationEpochId: 'evaluation-epoch-1' };
    if (stem === 'deep_improvement_common.evaluation_observation_recorded') {
      return {
        ...evaluation,
        fixtureId: 'fixture-1',
        observationId: 'observation-1',
      } as DeepImprovementCommonScopeMap[TStem];
    }
    return evaluation as DeepImprovementCommonScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.canary_')) {
    return {
      ...candidate,
      canaryEpochId: 'canary-epoch-1',
      canarySuiteId: 'canary-suite-1',
    } as DeepImprovementCommonScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.promotion_')) {
    return {
      ...candidate,
      promotionId: 'promotion-1',
      baselineId: 'baseline-1',
    } as DeepImprovementCommonScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.candidate_')) {
    return candidate as DeepImprovementCommonScopeMap[TStem];
  }
  return base as DeepImprovementCommonScopeMap[TStem];
}

function commonDataFor<TStem extends DeepImprovementCommonEventStem>(
  stem: TStem,
): DeepImprovementCommonPayloadMap[TStem] {
  const hash = digest(stem);
  const data: Readonly<Record<DeepImprovementCommonEventStem, JsonObject>> = {
    'deep_improvement_common.run_started': {
      generation: 1,
      charterDigest: hash,
      configDigest: hash,
      operatorRef: 'operator:model-benchmark',
      serviceContractVersion: 'deep-improvement-common@1',
      replayFingerprint: hash,
      maxIterations: 10,
    },
    'deep_improvement_common.run_resumed': {
      priorTailDigest: hash,
      sourceLineageId: 'lineage-0',
      resumeReason: 'Resume after an operator-approved pause.',
      generation: 2,
      compatibilityDecision: 'exact',
      recoveryReceiptRef: 'receipt:recovery-1',
    },
    'deep_improvement_common.run_paused': {
      pauseReason: 'Awaiting independent evaluator capacity.',
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
        observations: 2,
        canaryRuns: 1,
        promotions: 1,
      },
      completionEvidenceRefs: ['evidence:completion-1'],
    },
    'deep_improvement_common.run_aborted': {
      abortReason: 'The evaluator runtime became unavailable.',
      lastSafeEventId: 'event-12',
      evidenceRefs: ['evidence:abort-1'],
      retryable: true,
    },
    'deep_improvement_common.run_quarantined': {
      quarantineReasonCode: 'canary-leak-detected',
      quarantineEvidenceRef: 'evidence:quarantine-1',
      quarantineEvidenceDigest: hash,
      affectedCandidateIds: ['candidate-1'],
      policyVersion: 'quarantine-policy@1',
    },
    'deep_improvement_common.candidate_proposed': {
      proposalRef: 'proposal:candidate-1',
      proposalDigest: hash,
      mutationOperatorRef: 'operator:bounded-rewrite',
      mutationOperatorVersion: 'bounded-rewrite@1',
      parentCandidateId: null,
      targetRef: 'target:model-1',
      targetDigest: hash,
      proposalPolicyVersion: 'proposal-policy@1',
    },
    'deep_improvement_common.candidate_generated': {
      proposalEventId: 'event-7',
      proposalPayloadDigest: hash,
      candidateArtifactRef: 'artifact:candidate-1',
      candidateArtifactDigest: hash,
      generationReceiptRef: 'receipt:generation-1',
      mutationOperatorRef: 'operator:bounded-rewrite',
      mutationOperatorVersion: 'bounded-rewrite@1',
    },
    'deep_improvement_common.candidate_rejected': {
      candidateEventId: 'event-8',
      candidatePayloadDigest: hash,
      rejectionReasonCode: 'boundary-violation',
      evidenceRefs: ['evidence:rejection-1'],
      evidenceSetDigest: hash,
      policyVersion: 'candidate-policy@1',
    },
    'deep_improvement_common.candidate_lineage_attached': {
      parentCandidateId: 'candidate-0',
      parentCandidateDigest: hash,
      lineageEdgeRef: 'lineage-edge:candidate-0:candidate-1',
      lineageEdgeDigest: hash,
      operatorRef: 'operator:bounded-rewrite',
    },
    'deep_improvement_common.evaluation_epoch_sealed': {
      evaluatorRef: 'evaluator:independent-1',
      evaluatorCapsuleDigest: hash,
      fixtureSetRef: 'fixture-set:heldout-1',
      fixtureSetDigest: hash,
      scorePolicyVersion: 'score-policy@1',
      scoreWriteBackendRef: DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
      evaluationBudgetRef: 'budget:evaluation-1',
    },
    'deep_improvement_common.evaluation_started': {
      epochSealedEventId: 'event-11',
      epochPayloadDigest: hash,
      executionReceiptRef: 'receipt:evaluation-start-1',
      fixtureCount: 2,
      evaluatorFingerprint: hash,
    },
    'deep_improvement_common.evaluation_observation_recorded': {
      evaluationStartedEventId: 'event-12',
      evaluatorRef: 'evaluator:independent-1',
      fixtureRef: 'fixture:heldout-1',
      rawObservationRef: 'observation-artifact:observation-1',
      rawObservationDigest: hash,
      executionReceiptRef: 'receipt:observation-1',
      observationOutcome: 'pass',
    },
    'deep_improvement_common.evaluation_normalized': {
      observationEventIds: ['event-13'],
      observationSetDigest: hash,
      scorePolicyVersion: 'score-policy@1',
      scorerFingerprint: hash,
      scoreWriteBackendRef: DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
      scoreVector: commonScoreVector(),
      normalizationReceiptRef: 'receipt:normalization-1',
    },
    'deep_improvement_common.evaluation_verification_requested': {
      normalizedEventId: 'event-14',
      normalizedPayloadDigest: hash,
      verificationPolicyVersion: 'verification-policy@1',
      verifierRef: 'verifier:independent-1',
      reasonCode: 'high-impact-score',
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
      relatedEventIds: ['event-13', 'event-14'],
      reasonCode: 'evidence-conflict',
      uncertainty: 0.7,
      evidenceRefs: ['evidence:inconclusive-1'],
      evidenceSetDigest: hash,
    },
    'deep_improvement_common.evaluation_failed': {
      failedEventId: 'event-12',
      failureStage: 'execution',
      reasonCode: 'evaluator-timeout',
      failureReceiptRef: 'receipt:evaluation-failure-1',
      retryable: true,
    },
    'deep_improvement_common.canary_suite_sealed': {
      suiteRef: 'canary-suite:sealed-1',
      suiteDigest: hash,
      canaryPolicyVersion: 'canary-policy@1',
      fixtureCount: 4,
      protectedMaterialRef: 'protected-canary:epoch-1',
      protectedMaterialDigest: hash,
    },
    'deep_improvement_common.canary_executed': {
      suiteSealedEventId: 'event-19',
      suitePayloadDigest: hash,
      executionReceiptRef: 'receipt:canary-execution-1',
      canaryObservationRef: 'canary-observation:run-1',
      canaryObservationDigest: hash,
      outcome: 'pass',
    },
    'deep_improvement_common.canary_leak_detected': {
      executionEventId: 'event-20',
      leakClass: 'fixture-exposure',
      leakEvidenceRef: 'evidence:canary-leak-1',
      leakEvidenceDigest: hash,
      detectorFingerprint: hash,
      reasonCode: 'protected-fixture-match',
    },
    'deep_improvement_common.canary_drift_detected': {
      executionEventId: 'event-20',
      baselineRef: 'baseline:canary-1',
      baselineDigest: hash,
      driftEvidenceRef: 'evidence:canary-drift-1',
      driftEvidenceDigest: hash,
      driftRatio: 0.3,
      policyVersion: 'canary-drift-policy@1',
    },
    'deep_improvement_common.canary_invariant_failed': {
      executionEventId: 'event-20',
      invariantCode: 'cross-domain-isolation',
      invariantVersion: 'canary-invariant@1',
      evidenceRef: 'evidence:invariant-1',
      evidenceDigest: hash,
      reasonCode: 'isolation-check-failed',
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
      failureClasses: ['leak', 'drift'],
      evidenceSetDigest: hash,
      policyVersion: 'canary-gate@1',
      policyFingerprint: hash,
      decisionReceiptRef: 'receipt:canary-fail-1',
    },
    'deep_improvement_common.canary_vetoed': {
      gateEventId: 'event-25',
      gatePayloadDigest: hash,
      vetoReasonCode: 'canary-gate-failed',
      vetoEvidenceRef: 'evidence:veto-1',
      vetoEvidenceDigest: hash,
      quarantineRef: 'quarantine:candidate-1',
    },
    'deep_improvement_common.promotion_proposed': {
      normalizedEventId: 'event-14',
      normalizedPayloadDigest: hash,
      canaryGateEventId: 'event-24',
      canaryGatePayloadDigest: hash,
      proposalPolicyVersion: 'promotion-proposal@1',
      requestedRollout: 'shadow',
      evidenceSetDigest: hash,
    },
    'deep_improvement_common.promotion_authorized': {
      proposalEventId: 'event-27',
      proposalPayloadDigest: hash,
      externalAuthorizationRef: 'transition-authorization:decision-1',
      externalAuthorizationDigest: hash,
      authorizationPolicyVersion: 'promotion-authorization@1',
      authorizationReceiptRef: 'receipt:promotion-authorization-1',
    },
    'deep_improvement_common.promotion_denied': {
      proposalEventId: 'event-27',
      proposalPayloadDigest: hash,
      externalDecisionRef: 'transition-authorization:decision-2',
      externalDecisionDigest: hash,
      denialReasonCode: 'authorization-denied',
      decisionReceiptRef: 'receipt:promotion-denial-1',
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
      pauseReason: 'Observed rollout drift.',
      checkpointRef: 'checkpoint:promotion-1',
      checkpointDigest: hash,
    },
    'deep_improvement_common.promotion_aborted': {
      activeRolloutEventId: 'event-30',
      abortReason: 'Canary vetoed the rollout.',
      restorationRequired: true,
      decisionReceiptRef: 'receipt:promotion-abort-1',
    },
    'deep_improvement_common.promotion_baseline_restored': {
      abortedEventId: 'event-33',
      baselineRef: 'baseline:stable-1',
      baselineDigest: hash,
      restorationReceiptRef: 'receipt:baseline-restoration-1',
      restoredAt: TIMESTAMP,
    },
    'deep_improvement_common.promotion_completed': {
      authorizationEventId: 'event-28',
      rolloutEventIds: ['event-30', 'event-31'],
      evidenceSetDigest: hash,
      completionReceiptRef: 'receipt:promotion-completion-1',
      completedAt: TIMESTAMP,
    },
  };
  return data[stem] as DeepImprovementCommonPayloadMap[TStem];
}

function trialMatrixKey(): TrialMatrixKey {
  return {
    candidateId: 'candidate-1',
    modelFingerprint: digest('model-fingerprint-1'),
    executionPath: 'provider/direct',
    taskInstanceId: 'task-instance-1',
    taskFamilyId: 'task-family-1',
    pairedBlockId: 'paired-block-1',
    protocolVariant: 'standard',
    seed: 42,
    perturbationId: 'perturbation-1',
    workloadProfileId: 'workload-profile-1',
    promptRecipeFingerprint: digest('prompt-recipe-1'),
    routeFingerprint: digest('route-1'),
    frameworkFingerprint: digest('framework-1'),
    toolRecipeFingerprint: digest('tool-recipe-1'),
    attempt: 1,
  };
}

function taskLineage(): TaskLineage {
  return {
    sourceCutoffAt: TIMESTAMP,
    visibility: 'sealed',
    proposerVisibility: 'blind',
    oracleVisibility: 'known',
    parentCaseId: null,
    firstExposureAt: null,
    disclosedAt: null,
    retiredAt: null,
    replacementCaseId: null,
  };
}

function scoreObservation(): ScoreVectorObservation {
  return {
    components: [{
      dimensionCode: 'quality',
      rawScore: 0.82,
      hardFloorStatus: 'pass',
      measurementStatus: 'observed',
      uncertainty: 0.08,
      observationRef: 'observation:quality-1',
      observationDigest: digest('quality-observation-1'),
    }, {
      dimensionCode: 'safety',
      rawScore: 0.91,
      hardFloorStatus: 'pass',
      measurementStatus: 'observed',
      uncertainty: 0.04,
      observationRef: 'observation:safety-1',
      observationDigest: digest('safety-observation-1'),
    }],
    evaluatorContractHash: digest('evaluator-contract-1'),
    evaluatorFingerprint: digest('evaluator-1'),
  };
}

function specificScopeFor<TStem extends ModelBenchmarkSpecificEventStem>(
  stem: TStem,
): ModelBenchmarkSpecificScopeMap[TStem] {
  const base = {
    runId: 'run-1',
    lineageId: 'lineage-1',
    variant: 'model-benchmark' as const,
  };
  if (stem === 'model_benchmark.benchmark_capsule_sealed') {
    return { ...base, capsuleId: 'capsule-1' } as ModelBenchmarkSpecificScopeMap[TStem];
  }
  if (stem === 'model_benchmark.workload_snapshot_sealed') {
    return {
      ...base,
      workloadSnapshotId: 'workload-snapshot-1',
    } as ModelBenchmarkSpecificScopeMap[TStem];
  }
  if (stem === 'model_benchmark.benchmark_design_declared') {
    return { ...base, designId: 'design-1' } as ModelBenchmarkSpecificScopeMap[TStem];
  }
  if (stem === 'model_benchmark.trial_block_declared') {
    return {
      ...base,
      trialBlockId: 'trial-block-1',
    } as ModelBenchmarkSpecificScopeMap[TStem];
  }
  if (stem.startsWith('model_benchmark.trial_')
    || stem === 'model_benchmark.score_vector_observed'
    || stem === 'model_benchmark.usage_observed'
    || stem === 'model_benchmark.judge_observation_recorded') {
    const key = trialMatrixKey();
    return {
      ...base,
      trialId: 'trial-1',
      taskInstanceId: key.taskInstanceId,
      taskFamilyId: key.taskFamilyId,
      candidateId: key.candidateId,
      modelFingerprint: key.modelFingerprint,
      executionPath: key.executionPath,
      pairedBlockId: key.pairedBlockId,
    } as ModelBenchmarkSpecificScopeMap[TStem];
  }
  if (stem === 'model_benchmark.oracle_label_attested'
    || stem === 'model_benchmark.contamination_evidence_recorded'
    || stem === 'model_benchmark.exposure_recorded'
    || stem === 'model_benchmark.case_disclosed'
    || stem === 'model_benchmark.case_retired'
    || stem === 'model_benchmark.case_replaced') {
    return {
      ...base,
      caseId: 'case-1',
      taskInstanceId: 'task-instance-1',
      taskFamilyId: 'task-family-1',
    } as ModelBenchmarkSpecificScopeMap[TStem];
  }
  if (stem === 'model_benchmark.judge_calibration_sealed') {
    return {
      ...base,
      judgeCalibrationId: 'judge-calibration-1',
    } as ModelBenchmarkSpecificScopeMap[TStem];
  }
  if (stem.startsWith('model_benchmark.validity_')) {
    return {
      ...base,
      validityPlanId: 'validity-plan-1',
    } as ModelBenchmarkSpecificScopeMap[TStem];
  }
  if (stem.startsWith('model_benchmark.selection_')) {
    return {
      ...base,
      evidenceSetId: 'evidence-set-1',
    } as ModelBenchmarkSpecificScopeMap[TStem];
  }
  return base as ModelBenchmarkSpecificScopeMap[TStem];
}

function specificDataFor<TStem extends ModelBenchmarkSpecificEventStem>(
  stem: TStem,
): ModelBenchmarkSpecificPayloadMap[TStem] {
  const hash = digest(stem);
  const matrix = trialMatrixKey();
  const data: Readonly<Record<ModelBenchmarkSpecificEventStem, JsonObject>> = {
    'model_benchmark.run_declared': {
      generation: 1,
      benchmarkRecipeRef: 'benchmark-recipe:1',
      benchmarkRecipeDigest: hash,
      evaluatorServiceRef: 'service:deep-improvement-evaluator',
      canaryServiceRef: 'service:deep-improvement-canary',
      promotionServiceRef: 'service:deep-improvement-promotion',
      sharedServiceContractVersion: 'deep-improvement-common@1',
      replayFingerprint: hash,
    },
    'model_benchmark.benchmark_capsule_sealed': {
      capsuleRef: 'benchmark-capsule:1',
      capsuleDigest: hash,
      taskSetDigest: hash,
      taskLineage: taskLineage(),
      canarySuiteRef: 'canary-suite:1',
      canarySuiteDigest: hash,
      sealReceiptRef: 'receipt:capsule-seal-1',
    },
    'model_benchmark.workload_snapshot_sealed': {
      workloadSnapshotRef: 'workload-snapshot:1',
      workloadSnapshotDigest: hash,
      taskFamilyIds: ['task-family-1'],
      caseCount: 1,
      workloadProfileVersion: 'workload-profile@1',
      snapshotAt: TIMESTAMP,
      sealReceiptRef: 'receipt:workload-seal-1',
    },
    'model_benchmark.run_started': {
      declarationEventId: 'event-declaration-1',
      declarationPayloadDigest: hash,
      capsuleEventId: 'event-capsule-1',
      capsulePayloadDigest: hash,
      workloadEventId: 'event-workload-1',
      workloadPayloadDigest: hash,
      executionReceiptRef: 'receipt:run-start-1',
      startedAt: TIMESTAMP,
    },
    'model_benchmark.run_paused': {
      pauseReason: 'Awaiting a provider recovery window.',
      checkpointRef: 'checkpoint:run-1',
      checkpointDigest: hash,
      pendingTrialIds: ['trial-2'],
      pausedAt: TIMESTAMP,
    },
    'model_benchmark.run_resumed': {
      priorTailDigest: hash,
      resumeReason: 'Resume after provider recovery.',
      compatibilityDecision: 'exact',
      recoveryReceiptRef: 'receipt:recovery-1',
      resumedAt: TIMESTAMP,
    },
    'model_benchmark.run_closed': {
      terminalOutcome: 'completed',
      finalLedgerTailHash: hash,
      counts: {
        admittedTrials: 1,
        completedTrials: 1,
        failedTrials: 0,
        unknownTrials: 0,
        invalidatedTrials: 0,
      },
      completionEvidenceRefs: ['evidence:completion-1'],
      closedAt: TIMESTAMP,
    },
    'model_benchmark.benchmark_design_declared': {
      designRef: 'benchmark-design:1',
      designDigest: hash,
      candidateIds: ['candidate-1'],
      taskFamilyIds: ['task-family-1'],
      pairedBlockIds: ['paired-block-1'],
      protocolVariants: ['standard'],
      familyQuotaPolicyVersion: 'family-quota@1',
      designPolicyVersion: 'benchmark-design@1',
    },
    'model_benchmark.trial_block_declared': {
      taskFamilyId: 'task-family-1',
      candidateIds: ['candidate-1'],
      modelFingerprints: [matrix.modelFingerprint],
      executionPaths: [matrix.executionPath],
      pairedBlockIds: [matrix.pairedBlockId],
      protocolVariants: [matrix.protocolVariant],
      seed: matrix.seed,
      perturbationId: matrix.perturbationId,
      workloadProfileId: matrix.workloadProfileId,
      blockDigest: hash,
    },
    'model_benchmark.trial_case_admitted': {
      trialMatrixKey: matrix,
      caseRef: 'benchmark-case:1',
      caseDigest: hash,
      taskLineage: taskLineage(),
      admissionPolicyVersion: 'case-admission@1',
      admissionReasonCode: 'sealed-case-eligible',
    },
    'model_benchmark.trial_case_rejected': {
      trialMatrixKey: matrix,
      caseRef: 'benchmark-case:1',
      caseDigest: hash,
      taskLineage: taskLineage(),
      admissionPolicyVersion: 'case-admission@1',
      admissionReasonCode: 'contamination-suspected',
      rejectionEvidenceRef: 'evidence:case-rejection-1',
      rejectionEvidenceDigest: hash,
    },
    'model_benchmark.trial_dispatched': {
      trialMatrixKey: matrix,
      inputRef: 'benchmark-input:1',
      inputDigest: hash,
      dispatchReceiptRef: 'receipt:dispatch-1',
      dispatchReceiptDigest: hash,
      dispatchedAt: TIMESTAMP,
    },
    'model_benchmark.trial_completed': {
      trialMatrixKey: matrix,
      dispatchedEventId: 'event-dispatch-1',
      dispatchedPayloadDigest: hash,
      rawResultRef: 'benchmark-result:1',
      rawResultDigest: hash,
      inputDigest: hash,
      outputDigest: hash,
      completionReceiptRef: 'receipt:completion-1',
      completedAt: TIMESTAMP,
    },
    'model_benchmark.trial_failed': {
      trialMatrixKey: matrix,
      dispatchedEventId: 'event-dispatch-1',
      failureStage: 'provider',
      reasonCode: 'provider-unavailable',
      failureEvidenceRef: 'evidence:failure-1',
      failureEvidenceDigest: hash,
      failureReceiptRef: 'receipt:failure-1',
      retryable: true,
    },
    'model_benchmark.trial_unknown': {
      trialMatrixKey: matrix,
      dispatchedEventId: 'event-dispatch-1',
      reasonCode: 'provider-status-unknown',
      lastReceiptRef: 'receipt:last-known-1',
      evidenceDigest: hash,
      observedAt: TIMESTAMP,
    },
    'model_benchmark.trial_invalidated': {
      trialMatrixKey: matrix,
      sourceEventId: 'event-completion-1',
      sourcePayloadDigest: hash,
      reasonCode: 'case-disclosed',
      invalidationEvidenceRef: 'evidence:invalidation-1',
      invalidationEvidenceDigest: hash,
      invalidatedAt: TIMESTAMP,
    },
    'model_benchmark.trial_observation_recorded': {
      trialMatrixKey: matrix,
      completedEventId: 'event-completion-1',
      completedPayloadDigest: hash,
      inputDigest: hash,
      rawOutputRef: 'raw-output:trial-1',
      rawOutputDigest: hash,
      evaluatorObservationRef: 'evaluator-observation:trial-1',
      evaluatorObservationDigest: hash,
      executionReceiptRef: 'receipt:execution-1',
    },
    'model_benchmark.score_vector_observed': {
      trialMatrixKey: matrix,
      observationEventId: 'event-observation-1',
      observationPayloadDigest: hash,
      scorePolicyVersion: 'score-policy@1',
      scoreWriteBackendRef: MODEL_BENCHMARK_SCORE_WRITE_BACKEND_REF,
      scoreVector: scoreObservation(),
      scoringReceiptRef: 'receipt:scoring-1',
    },
    'model_benchmark.usage_observed': {
      trialMatrixKey: matrix,
      observationEventId: 'event-observation-1',
      usage: {
        inputTokens: 120,
        outputTokens: 80,
        reasoningTokens: 25,
        cacheReadTokens: 10,
        cacheWriteTokens: 5,
        retryCount: 0,
        realizedCostMicrounits: 2100,
        currencyCode: 'USD',
      },
      latency: {
        ttftMs: 120,
        interTokenP50Ms: 18,
        endToEndMs: 2100,
        tailP95Ms: 2500,
      },
      usageReceiptRef: 'receipt:usage-1',
      usageReceiptDigest: hash,
    },
    'model_benchmark.judge_observation_recorded': {
      trialMatrixKey: matrix,
      scoreEventId: 'event-score-1',
      scorePayloadDigest: hash,
      blindedJudgeRef: 'judge:blinded-1',
      judgeFamilyCode: 'judge-family-a',
      judgeBuildFingerprint: hash,
      promptDigest: hash,
      contextDigest: hash,
      toolDigest: hash,
      calibrationSliceId: 'calibration-slice-1',
      orderProbeOutcome: 'pass',
      styleProbeOutcome: 'pass',
      confidence: 0.86,
      uncertainty: 0.14,
      abstained: false,
      disagreementState: 'not-observed',
      observationRef: 'judge-observation:1',
      observationDigest: hash,
    },
    'model_benchmark.oracle_label_attested': {
      oracleVersion: 'oracle@1',
      labelRef: 'oracle-label:case-1',
      labelDigest: hash,
      attestationStatus: 'attested',
      confidence: 0.95,
      uncertainty: 0.05,
      priorAttestationEventId: null,
      attestationReceiptRef: 'receipt:oracle-1',
    },
    'model_benchmark.contamination_evidence_recorded': {
      contaminationStatus: 'clean',
      detectorFingerprint: hash,
      evidenceRef: 'contamination-evidence:case-1',
      evidenceDigest: hash,
      exposureEventIds: [],
      reasonCode: 'no-exposure-detected',
    },
    'model_benchmark.exposure_recorded': {
      exposureClass: 'candidate',
      exposedActorRef: 'candidate:candidate-1',
      firstExposedAt: TIMESTAMP,
      evidenceRef: 'exposure-evidence:case-1',
      evidenceDigest: hash,
    },
    'model_benchmark.case_disclosed': {
      disclosureRef: 'case-disclosure:1',
      disclosureDigest: hash,
      disclosedAt: TIMESTAMP,
      disclosurePolicyVersion: 'case-disclosure@1',
    },
    'model_benchmark.case_retired': {
      retirementReasonCode: 'case-disclosed',
      retirementEvidenceRef: 'evidence:retirement-1',
      retirementEvidenceDigest: hash,
      retiredAt: TIMESTAMP,
    },
    'model_benchmark.case_replaced': {
      replacementCaseId: 'case-2',
      replacementCaseDigest: hash,
      replacementReasonCode: 'oracle-correction',
      lineageReceiptRef: 'receipt:case-lineage-1',
    },
    'model_benchmark.judge_calibration_sealed': {
      blindedJudgeRef: 'judge:blinded-1',
      judgeFamilyCode: 'judge-family-a',
      judgeBuildFingerprint: hash,
      calibrationSliceId: 'calibration-slice-1',
      calibrationRef: 'judge-calibration:1',
      calibrationDigest: hash,
      orderProbeDigest: hash,
      styleProbeDigest: hash,
      calibrationPolicyVersion: 'judge-calibration@1',
      sealReceiptRef: 'receipt:judge-calibration-1',
    },
    'model_benchmark.validity_plan_sealed': {
      validityPlanRef: 'validity-plan:1',
      validityPlanDigest: hash,
      requiredEvidenceCodes: ['oracle', 'contamination', 'judge-calibration'],
      hardBlockerCodes: ['contamination-confirmed'],
      validityPolicyVersion: 'validity-policy@1',
      sealReceiptRef: 'receipt:validity-plan-1',
    },
    'model_benchmark.validity_card_derived': {
      state: 'valid',
      evidenceEventIds: ['event-oracle-1', 'event-calibration-1'],
      evidenceSetDigest: hash,
      blockerCodes: [],
      uncertainty: 0.08,
      derivationPolicyVersion: 'validity-policy@1',
      derivationReceiptRef: 'receipt:validity-card-1',
    },
    'model_benchmark.validity_unknown_recorded': {
      unknownCode: 'oracle-disagreement',
      requiredEvidenceRefs: ['evidence:oracle-review-1'],
      evidenceSetDigest: hash,
      blocker: true,
      recordedAt: TIMESTAMP,
    },
    'model_benchmark.selection_evidence_sealed': {
      evidenceEventIds: ['event-score-1', 'event-usage-1', 'event-judge-1'],
      evidenceSetDigest: hash,
      manifestRef: 'selection-evidence-manifest:1',
      manifestDigest: hash,
      validityCardEventIds: ['event-validity-card-1'],
      sealedAt: TIMESTAMP,
      sealReceiptRef: 'receipt:selection-evidence-1',
    },
    'model_benchmark.selection_reduction_requested': {
      sealedEvidenceEventId: 'event-selection-evidence-1',
      sealedEvidencePayloadDigest: hash,
      reducerContractVersion: 'model-benchmark-reducer@1',
      requestReceiptRef: 'receipt:reduction-request-1',
      requestedAt: TIMESTAMP,
    },
  };
  return data[stem] as ModelBenchmarkSpecificPayloadMap[TStem];
}

function scopeFor<TStem extends ModelBenchmarkEventStem>(
  stem: TStem,
): ModelBenchmarkScopeMap[TStem] {
  return isDeepImprovementCommonEventStem(stem)
    ? commonScopeFor(stem) as ModelBenchmarkScopeMap[TStem]
    : specificScopeFor(
      stem as ModelBenchmarkSpecificEventStem,
    ) as ModelBenchmarkScopeMap[TStem];
}

function dataFor<TStem extends ModelBenchmarkEventStem>(
  stem: TStem,
): ModelBenchmarkPayloadMap[TStem] {
  return isDeepImprovementCommonEventStem(stem)
    ? commonDataFor(stem) as ModelBenchmarkPayloadMap[TStem]
    : specificDataFor(
      stem as ModelBenchmarkSpecificEventStem,
    ) as ModelBenchmarkPayloadMap[TStem];
}

function eventInput<TStem extends ModelBenchmarkEventStem>(
  stem: TStem,
  index: number,
  prevEventHash: string,
): ModelBenchmarkEventInput<TStem> {
  return {
    stem,
    scope: scopeFor(stem),
    prevEventHash,
    replay: replayMetadata(stem),
    data: dataFor(stem),
    eventId: `model-benchmark-event-${index}`,
    streamId: 'model-benchmark-run-1',
    streamSequence: index,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'model-benchmark-shadow-schema', version: '1' },
    authorityEpoch: 1,
    correlationId: 'run-1',
    causationId: index === 1 ? null : `model-benchmark-event-${index - 1}`,
    idempotencyKey: `model-benchmark-event-${index}`,
  };
}

function eventInputWithDataField<TStem extends ModelBenchmarkEventStem>(
  stem: TStem,
  index: number,
  field: string,
  value: unknown,
): ModelBenchmarkEventInput<TStem> {
  const input = eventInput(stem, index, '0'.repeat(64));
  return {
    ...input,
    data: { ...input.data, [field]: value } as ModelBenchmarkPayloadMap[TStem],
  };
}

async function authorizationRequest(
  harness: Harness,
  event: EventWritePreflight,
  requestId: string,
  capabilityId = 'model-benchmark:append',
): Promise<TransitionAuthorizationRequest> {
  const policy = harness.policies.resolve('model-benchmark-shadow-write', 1);
  return {
    requestId,
    mode: 'model-benchmark',
    event,
    priorHead: await harness.ledger.getVerifiedHead(),
    priorStateVersion: 'model-benchmark-shadow@1',
    priorStateFingerprint: digest('prior-state'),
    actorId: 'model-benchmark-runtime',
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

function resignedPayload(
  payload: Readonly<JsonObject>,
  replacements: Readonly<Record<string, unknown>>,
): JsonObject {
  const next = { ...payload, ...replacements };
  const unsigned = {
    stem: next.stem,
    eventVersion: next.eventVersion,
    scope: next.scope,
    prevEventHash: next.prevEventHash,
    replay: next.replay,
    data: next.data,
  };
  return { ...next, payloadDigest: digest(unsigned) };
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 2. AUTHORIZATION, REPLAY, AND EXTENSION MATRIX
// ───────────────────────────────────────────────────────────────────

describe('model-benchmark typed ledger schema', () => {
  it('extends all common stems and appends every common and mode-specific stem', async () => {
    const harness = createHarness();
    const prepared = new Map<ModelBenchmarkEventStem, EventWritePreflight>();
    let priorHash = '0'.repeat(64);

    expect(DeepImprovementCommonEventStems).toHaveLength(35);
    expect(ModelBenchmarkSpecificEventStems).toHaveLength(32);
    expect(ModelBenchmarkEventStems).toHaveLength(67);
    expect(ModelBenchmarkEventStems.slice(0, 35)).toEqual(
      DeepImprovementCommonEventStems,
    );

    for (const [offset, stem] of ModelBenchmarkEventStems.entries()) {
      const index = offset + 1;
      let input = eventInput(stem, index, priorHash);
      if (stem === 'deep_improvement_common.promotion_proposed') {
        const normalized = prepared.get(
          'deep_improvement_common.evaluation_normalized',
        );
        if (!normalized) throw new Error('normalized scoring event missing');
        input = {
          ...input,
          prerequisiteEvent: normalized,
          data: {
            ...input.data,
            normalizedEventId: normalized.envelope.event_id,
            normalizedPayloadDigest:
              normalized.envelope.payload.payloadDigest,
          },
        } as ModelBenchmarkEventInput<typeof stem>;
      }
      const event = prepareModelBenchmarkEvent(input, harness.registry);
      prepared.set(stem, event);
      const proof = await authorize(harness, event, `request-${index}`);
      const receipt = await harness.ledger.appendAuthorized(event, proof);
      expect(receipt.authorizationRef.decision_id).toBe(
        proof.decision.decision_id,
      );
      priorHash = receipt.recordHash;
    }

    const verified = await harness.ledger.readVerifiedEvents();
    expect(verified).toHaveLength(ModelBenchmarkEventStems.length);
    expect(verified.map((entry) => entry.event.stored.envelope.event_type))
      .toEqual(ModelBenchmarkEventStems.map(
        (stem) => ModelBenchmarkWireEventTypes[stem],
      ));
    for (const [index, entry] of verified.entries()) {
      const stem = ModelBenchmarkEventStems[index];
      expect(entry.event.stored.envelope.payload.stem).toBe(stem);
      expect(entry.event.stored.envelope.payload.replay)
        .toEqual(replayMetadata(stem));
      expect(entry.frame.authorization_ref.decision_id).not.toBe('');
    }
  });

  it('produces stable canonical identity and deterministic payload digests', () => {
    const registry = createModelBenchmarkEventRegistry();
    const input = eventInput('model_benchmark.run_declared', 1, '0'.repeat(64));
    const first = prepareModelBenchmarkEvent(input, registry);
    const second = prepareModelBenchmarkEvent(input, registry);
    expect(second.identity).toEqual(first.identity);
    expect(second.canonicalDigest).toBe(first.canonicalDigest);
    expect(second.envelope.payload.payloadDigest)
      .toBe(first.envelope.payload.payloadDigest);
  });

  it('keeps common definitions closed while specializing common scope to the lane', () => {
    const registry = createModelBenchmarkEventRegistry();
    const input = eventInput(
      'deep_improvement_common.evaluation_normalized',
      1,
      '0'.repeat(64),
    );
    expect(() => prepareModelBenchmarkEvent(input, registry)).not.toThrow();
    expect(() => prepareModelBenchmarkEvent({
      ...input,
      scope: {
        ...input.scope,
        variant: 'agent-improvement',
      },
    }, registry)).toThrow(/specialized to model-benchmark/);
    expect(() => prepareModelBenchmarkEvent({
      ...input,
      data: {
        ...input.data,
        benchmarkRanking: 1,
      },
    }, registry)).toThrow();
  });

  it('rejects foreign common variants before they can land on the lane ledger', async () => {
    const harness = createHarness();
    const input = eventInput(
      'deep_improvement_common.run_started',
      1,
      '0'.repeat(64),
    );
    const foreignInput = {
      ...input,
      scope: {
        ...input.scope,
        variant: 'agent-improvement' as const,
      },
    };

    expect(() => prepareDeepImprovementCommonEvent(
      foreignInput,
      harness.registry,
    )).toThrow();

    const control = prepareDeepImprovementCommonEvent(input, harness.registry);
    const foreignEnvelope = {
      ...control.envelope,
      payload: resignedPayload(control.envelope.payload, {
        scope: foreignInput.scope,
      }),
    };
    expect(() => prepareEventWrite(
      foreignEnvelope,
      harness.registry,
    )).toThrow();

    const foreignCanonicalBytes = canonicalBytes(foreignEnvelope);
    const foreignEvent: EventWritePreflight = Object.freeze({
      envelope: foreignEnvelope,
      canonicalBytes: foreignCanonicalBytes,
      canonicalDigest: sha256Bytes(foreignCanonicalBytes),
      registryDigest: harness.registry.digest,
      identity: control.identity,
    });
    const authorization = await harness.gateway.authorize(
      await authorizationRequest(
        harness,
        foreignEvent,
        'foreign-common-variant',
      ),
    );
    if (authorization.verdict !== 'allow') {
      throw new Error(authorization.reasonCode);
    }
    await expect(harness.ledger.appendAuthorized(
      foreignEvent,
      authorization.proof,
    )).rejects.toMatchObject({
      code: AuthorizedLedgerErrorCodes.INPUT_INVALID,
    });
    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({
      sequence: 0,
    });

    const proof = await authorize(harness, control, 'model-common-variant');
    await harness.ledger.appendAuthorized(control, proof);
    const events = await harness.ledger.readVerifiedEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.event.stored.envelope.payload.scope).toMatchObject({
      variant: 'model-benchmark',
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // 3. FAIL-CLOSED VALIDATION
  // ─────────────────────────────────────────────────────────────────

  it('rejects missing identities and absent previous-event hashes', () => {
    const registry = createModelBenchmarkEventRegistry();
    const event = prepareModelBenchmarkEvent(
      eventInput('model_benchmark.run_declared', 1, '0'.repeat(64)),
      registry,
    );
    const scope = { ...(event.envelope.payload.scope as JsonObject) };
    delete scope.runId;
    const missingScope = resignedPayload(event.envelope.payload, { scope });
    expect(() => prepareEventWrite({
      ...event.envelope,
      payload: missingScope,
    }, registry)).toThrow();

    const missingPrevious = { ...event.envelope.payload };
    delete missingPrevious.prevEventHash;
    expect(() => prepareEventWrite({
      ...event.envelope,
      payload: missingPrevious,
    }, registry)).toThrow();
    expect(() => prepareEventWrite({
      ...event.envelope,
      event_id: '',
    }, registry)).toThrow();
  });

  it('rejects mutable output bodies and open nested payload shapes before append', async () => {
    const harness = createHarness();
    const completed = eventInput(
      'model_benchmark.trial_completed',
      1,
      '0'.repeat(64),
    );
    expect(() => prepareModelBenchmarkEvent({
      ...completed,
      data: {
        ...completed.data,
        rawResultRef: 'the mutable model output body is copied here',
      },
    }, harness.registry)).toThrow();

    const observed = eventInput(
      'model_benchmark.score_vector_observed',
      2,
      '0'.repeat(64),
    );
    expect(() => prepareModelBenchmarkEvent({
      ...observed,
      data: {
        ...observed.data,
        scoreVector: {
          ...observed.data.scoreVector,
          notes: 'unsealed evaluator narrative',
        },
      },
    }, harness.registry)).toThrow();
    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({
      sequence: 0,
    });
  });

  it('rejects matrix identity drift and in-place case replacement', () => {
    const registry = createModelBenchmarkEventRegistry();
    const completed = eventInput(
      'model_benchmark.trial_completed',
      1,
      '0'.repeat(64),
    );
    expect(() => prepareModelBenchmarkEvent({
      ...completed,
      data: {
        ...completed.data,
        trialMatrixKey: {
          ...completed.data.trialMatrixKey,
          candidateId: 'candidate-2',
        },
      },
    }, registry)).toThrow();

    const replaced = eventInput(
      'model_benchmark.case_replaced',
      2,
      '0'.repeat(64),
    );
    expect(() => prepareModelBenchmarkEvent({
      ...replaced,
      data: {
        ...replaced.data,
        replacementCaseId: replaced.scope.caseId,
      },
    }, registry)).toThrow();
  });

  it('rejects in-place trial and score update event types', () => {
    const registry = createModelBenchmarkEventRegistry();
    const completed = prepareModelBenchmarkEvent(
      eventInput('model_benchmark.trial_completed', 1, '0'.repeat(64)),
      registry,
    );
    expect(() => prepareEventWrite({
      ...completed.envelope,
      event_type: 'deep-improvement.model-benchmark.trial-updated',
    }, registry)).toThrow();

    const score = prepareModelBenchmarkEvent(
      eventInput('model_benchmark.score_vector_observed', 2, '0'.repeat(64)),
      registry,
    );
    expect(() => prepareEventWrite({
      ...score.envelope,
      event_type: 'deep-improvement.model-benchmark.score-vector-updated',
    }, registry)).toThrow();
  });

  it('keeps raw results separate from scores and pins the score backend', () => {
    const registry = createModelBenchmarkEventRegistry();
    const completed = eventInput(
      'model_benchmark.trial_completed',
      1,
      '0'.repeat(64),
    );
    expect(() => prepareModelBenchmarkEvent({
      ...completed,
      data: {
        ...completed.data,
        scoreVector: scoreObservation(),
      },
    }, registry)).toThrow();

    const score = eventInput(
      'model_benchmark.score_vector_observed',
      2,
      '0'.repeat(64),
    );
    expect(() => prepareModelBenchmarkEvent({
      ...score,
      data: {
        ...score.data,
        aggregateScore: 0.99,
      },
    }, registry)).toThrow();
    expect(() => prepareModelBenchmarkEvent({
      ...score,
      data: {
        ...score.data,
        scoreWriteBackendRef: 'backend:caller-selected-score',
      },
    }, registry)).toThrow();
    expect(MODEL_BENCHMARK_SCORE_WRITE_BACKEND_REF)
      .toBe('backend:deep-improvement-score');
  });

  it('requires a typed normalized scoring event before a promotion proposal', async () => {
    const harness = createHarness();
    const rawInput = eventInput(
      'model_benchmark.trial_completed',
      1,
      '0'.repeat(64),
    );
    const rawEvent = prepareModelBenchmarkEvent(rawInput, harness.registry);
    const rawProof = await authorize(harness, rawEvent, 'raw-result');
    const rawReceipt = await harness.ledger.appendAuthorized(rawEvent, rawProof);

    const proposalInput = eventInput(
      'deep_improvement_common.promotion_proposed',
      2,
      rawReceipt.recordHash,
    );
    expect(() => prepareModelBenchmarkEvent({
      ...proposalInput,
      prerequisiteEvent: rawEvent,
      data: {
        ...proposalInput.data,
        normalizedEventId: rawEvent.envelope.event_id,
        normalizedPayloadDigest: rawEvent.envelope.payload.payloadDigest,
      },
    }, harness.registry)).toThrow(/normalized scoring event/);
    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({
      sequence: 1,
    });

    const normalizedInput = eventInput(
      'deep_improvement_common.evaluation_normalized',
      2,
      rawReceipt.recordHash,
    );
    const normalized = prepareModelBenchmarkEvent(
      normalizedInput,
      harness.registry,
    );
    const normalizedProof = await authorize(
      harness,
      normalized,
      'normalized-score',
    );
    const normalizedReceipt = await harness.ledger.appendAuthorized(
      normalized,
      normalizedProof,
    );
    const proposal = prepareModelBenchmarkEvent({
      ...eventInput(
        'deep_improvement_common.promotion_proposed',
        3,
        normalizedReceipt.recordHash,
      ),
      prerequisiteEvent: normalized,
      data: {
        ...proposalInput.data,
        normalizedEventId: normalized.envelope.event_id,
        normalizedPayloadDigest:
          normalized.envelope.payload.payloadDigest,
      },
    }, harness.registry);
    const proposalProof = await authorize(harness, proposal, 'promotion-proposal');
    await harness.ledger.appendAuthorized(proposal, proposalProof);
    await expect(harness.ledger.readVerifiedEvents()).resolves.toHaveLength(3);
  });

  it('requires external transition authorization for a promoted verdict', () => {
    const registry = createModelBenchmarkEventRegistry();
    const input = eventInput(
      'deep_improvement_common.promotion_authorized',
      1,
      '0'.repeat(64),
    );
    expect(() => prepareModelBenchmarkEvent({
      ...input,
      data: {
        ...input.data,
        externalAuthorizationRef: 'score:self-issued',
      },
    }, registry)).toThrow();
    const missing = { ...input.data } as Record<string, unknown>;
    delete missing.externalAuthorizationRef;
    expect(() => prepareModelBenchmarkEvent({
      ...input,
      data: missing as ModelBenchmarkPayloadMap[
        'deep_improvement_common.promotion_authorized'
      ],
    }, registry)).toThrow();
  });

  it('denies unauthorized transitions before append', async () => {
    const harness = createHarness();
    const event = prepareModelBenchmarkEvent(
      eventInput('model_benchmark.run_declared', 1, '0'.repeat(64)),
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
  });

  it('preserves immutable prepared bytes after caller mutation', async () => {
    const harness = createHarness();
    const input = eventInput(
      'model_benchmark.trial_observation_recorded',
      1,
      '0'.repeat(64),
    );
    const event = prepareModelBenchmarkEvent(input, harness.registry);
    const original = structuredClone(event.envelope.payload.data);
    const mutable = input.data as {
      rawOutputRef: string;
      trialMatrixKey: { attempt: number };
    };
    mutable.rawOutputRef = 'raw-output:mutated';
    mutable.trialMatrixKey.attempt = 9;
    const proof = await authorize(harness, event, 'immutable-write');
    await harness.ledger.appendAuthorized(event, proof);
    const [verified] = await harness.ledger.readVerifiedEvents();
    expect(verified.event.stored.envelope.payload.data).toEqual(original);
  });

  // ─────────────────────────────────────────────────────────────────
  // 4. LEGACY COMPATIBILITY
  // ─────────────────────────────────────────────────────────────────

  it('covers all compatibility outcomes and blocks unknown stems and versions', () => {
    expect(decideModelBenchmarkCompatibility({
      format: 'model-benchmark-ledger',
      stem: 'model_benchmark.run_declared',
      eventVersion: 1,
    }).status).toBe('exact');
    expect(decideModelBenchmarkCompatibility({
      type: 'progress',
      schemaVersion: 1,
    }).status).toBe('compatible');
    expect(decideModelBenchmarkCompatibility({
      event: 'benchmark_declared',
      schemaVersion: 1,
      runId: 'run-1',
      lineageId: 'lineage-1',
    }).status).toBe('migrate');
    expect(decideModelBenchmarkCompatibility({
      event: 'model_ranked',
      schemaVersion: 1,
    }).status).toBe('pin-old-runtime');
    expect(decideModelBenchmarkCompatibility({
      event: 'unknown',
      schemaVersion: 1,
    }).status).toBe('blocked');
    expect(decideModelBenchmarkCompatibility({
      format: 'model-benchmark-ledger',
      stem: 'model_benchmark.unknown',
      eventVersion: 1,
    }).status).toBe('blocked');
    expect(decideModelBenchmarkCompatibility({
      event: 'benchmark_declared',
      schemaVersion: 99,
      runId: 'run-1',
      lineageId: 'lineage-1',
    }).status).toBe('blocked');
  });

  it('upcasts legacy trials purely and retains source and upcaster digests', () => {
    const key = trialMatrixKey();
    const record = {
      event: 'trial_result',
      schemaVersion: 1,
      runId: 'run-1',
      lineageId: 'lineage-1',
      trialId: 'trial-1',
      taskInstanceId: key.taskInstanceId,
      taskFamilyId: key.taskFamilyId,
      candidateId: key.candidateId,
      modelFingerprint: key.modelFingerprint,
      executionPath: key.executionPath,
      pairedBlockId: key.pairedBlockId,
      protocolVariant: key.protocolVariant,
      seed: key.seed,
      perturbationId: key.perturbationId,
      workloadProfileId: key.workloadProfileId,
      promptRecipeFingerprint: key.promptRecipeFingerprint,
      routeFingerprint: key.routeFingerprint,
      frameworkFingerprint: key.frameworkFingerprint,
      toolRecipeFingerprint: key.toolRecipeFingerprint,
      attempt: 1,
      rawResultRef: 'legacy-result:1',
      rawResultDigest: digest('legacy-result'),
      inputDigest: digest('legacy-input'),
      outputDigest: digest('legacy-output'),
      completedAt: TIMESTAMP,
    };
    const scope: ModelBenchmarkTrialScope = specificScopeFor(
      'model_benchmark.trial_completed',
    );
    const context = {
      scope,
      prevEventHash: '0'.repeat(64),
      replay: replayMetadata('legacy-trial'),
    };
    const first = upcastLegacyModelBenchmarkRecord(record, context);
    const second = upcastLegacyModelBenchmarkRecord(record, context);
    expect(second).toEqual(first);
    expect(first.status).toBe('migrated');
    if (first.status !== 'migrated') throw new Error(first.decision.reasonCode);
    expect(first.targetStem).toBe('model_benchmark.trial_completed');
    expect(first.originalRecordDigest).toBe(digest(record));
    expect(first.upcasterFingerprint).toMatch(/^[a-f0-9]{64}$/);

    const registry = createModelBenchmarkEventRegistry();
    expect(() => prepareModelBenchmarkEvent({
      ...eventInput('model_benchmark.trial_completed', 1, '0'.repeat(64)),
      scope,
      data: first.data as ModelBenchmarkPayloadMap[
        'model_benchmark.trial_completed'
      ],
    }, registry)).not.toThrow();
    expect(record).toEqual(expect.objectContaining({
      rawResultRef: 'legacy-result:1',
    }));
  });
});
