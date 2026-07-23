// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Ledger Schema Tests
// ───────────────────────────────────────────────────────────────────

import {
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AGENT_IMPROVEMENT_SCORE_WRITE_BACKEND_REF,
  AGENT_IMPROVEMENT_SHARED_ENVELOPE_FIELDS,
  AgentImprovementEventStems,
  AgentImprovementExtensionEventStems,
  AgentImprovementWireEventTypes,
  createAgentImprovementEventRegistry,
  decideAgentImprovementCompatibility,
  prepareAgentImprovementEvent,
  upcastLegacyAgentImprovementRecord,
} from '../../lib/agent-improvement-ledger-schema/index.js';
import {
  AppendOnlyLedger,
  AuthorizedLedgerErrorCodes,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
  DEEP_IMPROVEMENT_COMMON_SHARED_ENVELOPE_FIELDS,
  DeepImprovementCommonEventStems,
  createDeepImprovementCommonEventRegistry,
  prepareDeepImprovementCommonEvent,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import {
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';

import type {
  AgentImprovementEventInput,
  AgentImprovementEventStem,
  AgentImprovementInputData,
  AgentImprovementPayloadMap,
  AgentImprovementReplayMetadata,
  AgentImprovementScopeMap,
} from '../../lib/agent-improvement-ledger-schema/index.js';
import type {
  GatewayAllowProof,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepImprovementCommonEventInput,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import type {
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../../lib/event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const TIMESTAMP = '2026-07-23T10:00:00.000Z';
const LEDGER_ID = 'agent-improvement-shadow';
const AUDIT_LEDGER_ID = 'agent-improvement-shadow-authorization';
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
  const root = mkdtempSync(join(tmpdir(), 'agent-improvement-schema-'));
  temporaryRoots.push(root);
  return root;
}

function createHarness(): Harness {
  const rootDirectory = temporaryRoot();
  const registry = createAgentImprovementEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'agent-improvement-shadow-write',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['known-agent-event', 'shadow-capability'],
    evaluate: (input) => {
      const isKnownNamespace =
        input.requestedEventType.startsWith('agent-improvement.ledger.')
        || input.requestedEventType.startsWith('deep-improvement-common.ledger.');
      const isAllowed = isKnownNamespace
        && input.capabilityId === 'agent-improvement:append';
      return {
        verdict: isAllowed ? 'allow' : 'deny',
        reasonCode: isAllowed ? 'allowed' : 'policy_denied',
        matchedRuleIds: ['known-agent-event', 'shadow-capability'],
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

function replayMetadata(label: string): AgentImprovementReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest(`replay:${label}`),
    replay_input_digests: {
      configuration: digest('configuration'),
      evaluator: digest('evaluator'),
      manifest: digest('manifest'),
    },
  };
}

function scoreVector(): JsonObject {
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

function scopeFor<TStem extends AgentImprovementEventStem>(
  stem: TStem,
): AgentImprovementScopeMap[TStem] {
  const base = {
    runId: 'run-1',
    lineageId: 'lineage-1',
    variant: 'agent-improvement' as const,
  };
  const candidate = { ...base, candidateId: 'candidate-1' };

  if (stem.startsWith('deep_improvement_common.evaluation_')) {
    const evaluation = {
      ...candidate,
      evaluationEpochId: 'evaluation-epoch-1',
    };
    if (stem === 'deep_improvement_common.evaluation_observation_recorded') {
      return {
        ...evaluation,
        fixtureId: 'fixture-1',
        observationId: 'observation-1',
      } as AgentImprovementScopeMap[TStem];
    }
    return evaluation as AgentImprovementScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.canary_')) {
    return {
      ...candidate,
      canaryEpochId: 'canary-epoch-1',
      canarySuiteId: 'canary-suite-1',
    } as AgentImprovementScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.promotion_')) {
    return {
      ...candidate,
      promotionId: 'promotion-1',
      baselineId: 'baseline-1',
    } as AgentImprovementScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.candidate_')) {
    return candidate as AgentImprovementScopeMap[TStem];
  }

  switch (stem) {
    case 'agent_improvement.definition_snapshot_sealed':
      return {
        ...base,
        agentDefinitionId: 'agent-definition-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.agent_ir_compiled':
      return {
        ...base,
        agentDefinitionId: 'agent-definition-1',
        agentIrId: 'agent-ir-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.change_contract_compiled':
    case 'agent_improvement.behavioral_change_classified':
      return {
        ...candidate,
        agentChangeId: 'agent-change-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.mutation_proposed':
    case 'agent_improvement.mutation_rejected':
      return {
        ...candidate,
        agentChangeId: 'agent-change-1',
        mutationId: 'mutation-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.trace_sliced':
      return {
        ...candidate,
        evaluationEpochId: 'evaluation-epoch-1',
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
        evaluationEpochId: 'evaluation-epoch-1',
        behaviorFamilyId: 'behavior-family-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.evaluation_manifest_sealed':
    case 'agent_improvement.fixture_exposure_recorded':
      return {
        ...base,
        evaluationEpochId: 'evaluation-epoch-1',
        manifestId: 'manifest-1',
        exposureEpochId: 'exposure-epoch-1',
      } as AgentImprovementScopeMap[TStem];
    case 'agent_improvement.transfer_trial_recorded':
      return {
        ...candidate,
        evaluationEpochId: 'evaluation-epoch-1',
        trialId: 'trial-1',
      } as AgentImprovementScopeMap[TStem];
    default:
      return base as AgentImprovementScopeMap[TStem];
  }
}

function commonData(stem: string, hash: string): JsonObject {
  const data: Readonly<Record<string, JsonObject>> = {
    'deep_improvement_common.run_started': {
      generation: 1,
      charterDigest: hash,
      configDigest: hash,
      operatorRef: 'operator:agent-improvement',
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
        observations: 1,
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
      targetRef: 'target:agent-1',
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
      scoreVector: scoreVector(),
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
  const result = data[stem];
  if (!result) throw new Error(`Missing common fixture for ${stem}`);
  return result;
}

function extensionData(stem: string, hash: string): JsonObject {
  const data: Readonly<Record<string, JsonObject>> = {
    'agent_improvement.definition_snapshot_sealed': {
      definitionRef: 'artifact:agent-definition-1',
      definitionDigest: hash,
      definitionSchemaVersion: 'agent-definition@1',
      capabilityPolicyRef: 'policy:capability-1',
      capabilityPolicyDigest: hash,
      verifierPolicyRef: 'policy:verifier-1',
      verifierPolicyDigest: hash,
      toolPolicyRef: 'policy:tool-1',
      toolPolicyDigest: hash,
      routingPolicyRef: 'policy:routing-1',
      routingPolicyDigest: hash,
      memoryPolicyRef: 'policy:memory-1',
      memoryPolicyDigest: hash,
      sealingReceiptRef: 'receipt:definition-seal-1',
    },
    'agent_improvement.agent_ir_compiled': {
      definitionSnapshotEventId: 'event-36',
      definitionSnapshotPayloadDigest: hash,
      agentIrRef: 'artifact:agent-ir-1',
      agentIrDigest: hash,
      agentIrSchemaVersion: 'agent-ir@1',
      components: [{
        componentId: 'component-instructions',
        componentKind: 'instruction',
        componentRef: 'agent-ir:component:instructions',
        componentDigest: hash,
      }, {
        componentId: 'component-tools',
        componentKind: 'tool-policy',
        componentRef: 'agent-ir:component:tools',
        componentDigest: hash,
      }],
      inheritanceEdges: [{
        edgeId: 'edge-instructions-tools',
        parentComponentId: 'component-instructions',
        childComponentId: 'component-tools',
        inheritanceKind: 'preserves',
        edgeDigest: hash,
      }],
      loci: [{
        locusId: 'locus-instruction-1',
        componentId: 'component-instructions',
        clauseId: 'clause-1',
        locusKind: 'instruction',
        mutability: 'mutable',
        locusRef: 'agent-ir:locus:instruction-1',
        locusDigest: hash,
      }, {
        locusId: 'locus-tool-policy-1',
        componentId: 'component-tools',
        clauseId: null,
        locusKind: 'tool-policy',
        mutability: 'immutable',
        locusRef: 'agent-ir:locus:tool-policy-1',
        locusDigest: hash,
      }],
      compilerFingerprint: hash,
      compilationReceiptRef: 'receipt:agent-ir-compilation-1',
    },
    'agent_improvement.change_contract_compiled': {
      agentIrEventId: 'event-37',
      agentIrPayloadDigest: hash,
      baseDefinitionRef: 'artifact:agent-definition-base',
      baseDefinitionDigest: digest('base-definition'),
      candidateDefinitionRef: 'artifact:agent-definition-candidate',
      candidateDefinitionDigest: digest('candidate-definition'),
      changeContractRef: 'artifact:change-contract-1',
      changeContractDigest: hash,
      patchRef: 'artifact:patch-1',
      patchDigest: hash,
      intendedObligationIds: ['obligation:clarity'],
      preservedObligationIds: ['obligation:authority'],
      affectedBehaviorFamilyIds: ['behavior-family-1'],
      behavioralSemverIntent: 'patch',
      contractPolicyVersion: 'change-contract@1',
      compilationReceiptRef: 'receipt:change-contract-1',
    },
    'agent_improvement.mutation_proposed': {
      changeContractEventId: 'event-38',
      changeContractPayloadDigest: hash,
      mutationOperatorRef: 'operator:bounded-rewrite',
      mutationOperatorVersion: 'bounded-rewrite@1',
      mutationProposalRef: 'proposal:mutation-1',
      mutationProposalDigest: hash,
      targetLocusIds: ['locus-instruction-1'],
      parentCandidateId: 'candidate-0',
      diagnosticEvidenceRefs: ['diagnostic:failure-1'],
      diagnosticEvidenceSetDigest: hash,
      proposalPolicyVersion: 'mutation-proposal@1',
    },
    'agent_improvement.mutation_rejected': {
      proposalEventId: 'event-39',
      proposalPayloadDigest: hash,
      rejectionReasonCode: 'immutable-locus-targeted',
      invalidLocusIds: ['locus-tool-policy-1'],
      rejectionEvidenceRefs: ['evidence:mutation-rejection-1'],
      rejectionEvidenceSetDigest: hash,
      policyVersion: 'mutation-rejection@1',
    },
    'agent_improvement.trace_sliced': {
      evaluationObservationEventId: 'event-13',
      evaluationObservationPayloadDigest: hash,
      traceRef: 'trace:raw-1',
      traceDigest: hash,
      traceSliceRef: 'trace-slice:1',
      traceSliceDigest: hash,
      failureRef: 'failure:behavior-1',
      failureDigest: hash,
      clauseIds: ['clause-1'],
      componentIds: ['component-instructions'],
      slicerFingerprint: hash,
      attributionStatus: 'diagnostic',
      attributionUncertainty: 0.3,
      slicingReceiptRef: 'receipt:trace-slice-1',
    },
    'agent_improvement.behavior_experiment_sealed': {
      traceSliceEventId: 'event-41',
      traceSlicePayloadDigest: hash,
      experimentPlanRef: 'experiment-plan:1',
      experimentPlanDigest: hash,
      behaviorFamilyId: 'behavior-family-1',
      scenarioSetRef: 'scenario-set:1',
      scenarioSetDigest: hash,
      baselineExecutionRef: 'execution:baseline-1',
      baselineExecutionDigest: hash,
      candidateExecutionRef: 'execution:candidate-1',
      candidateExecutionDigest: hash,
      freshPairedExecutionReceiptRef: 'receipt:paired-execution-1',
      executorRef: 'executor:primary-1',
      executorFingerprint: hash,
      verifierRef: 'verifier:isolated-1',
      verifierFingerprint: hash,
      interventionIds: ['intervention-1'],
      experimentPolicyVersion: 'behavior-experiment@1',
    },
    'agent_improvement.known_defect_injected': {
      experimentEventId: 'event-42',
      experimentPayloadDigest: hash,
      defectLocusId: 'locus-instruction-1',
      injectionRef: 'defect-injection:1',
      injectionDigest: hash,
      controlExecutionRef: 'execution:control-1',
      controlExecutionDigest: hash,
      perturbedExecutionRef: 'execution:perturbed-1',
      perturbedExecutionDigest: hash,
      rawObservationRef: 'observation:defect-1',
      rawObservationDigest: hash,
      outcome: 'detected',
      uncertainty: 0.1,
      injectionReceiptRef: 'receipt:defect-injection-1',
    },
    'agent_improvement.counterfactual_replayed': {
      experimentEventId: 'event-42',
      experimentPayloadDigest: hash,
      interventionRef: 'intervention:counterfactual-1',
      interventionDigest: hash,
      sourceTraceRef: 'trace:raw-1',
      sourceTraceDigest: hash,
      counterfactualTraceRef: 'trace:counterfactual-1',
      counterfactualTraceDigest: hash,
      replayCount: 3,
      rawObservationRef: 'observation:counterfactual-1',
      rawObservationDigest: hash,
      outcome: 'changed',
      uncertainty: 0.2,
      executionReceiptRef: 'receipt:counterfactual-1',
    },
    'agent_improvement.ablation_completed': {
      experimentEventId: 'event-42',
      experimentPayloadDigest: hash,
      ablatedLocusIds: ['locus-instruction-1'],
      ablationRef: 'ablation:1',
      ablationDigest: hash,
      baselineExecutionRef: 'execution:baseline-1',
      baselineExecutionDigest: hash,
      ablatedExecutionRef: 'execution:ablated-1',
      ablatedExecutionDigest: hash,
      rawObservationRef: 'observation:ablation-1',
      rawObservationDigest: hash,
      outcome: 'degraded',
      uncertainty: 0.2,
      executionReceiptRef: 'receipt:ablation-1',
    },
    'agent_improvement.behavior_coverage_recorded': {
      experimentEventIds: ['event-42', 'event-43'],
      evidenceSetDigest: hash,
      clauseIds: ['clause-1'],
      authorityConflictCaseIds: ['case:authority-1'],
      negativeCapabilityCaseIds: ['case:negative-capability-1'],
      sideEffectOracleIds: ['oracle:side-effect-1'],
      semanticVariantIds: ['variant:semantic-1'],
      rawCoverageRef: 'coverage:raw-1',
      rawCoverageDigest: hash,
      coverageOutcome: 'covered',
      criticalInvariantOutcome: 'pass',
      coveragePolicyVersion: 'behavior-coverage@1',
    },
    'agent_improvement.evaluation_manifest_sealed': {
      manifestRef: 'manifest:evaluation-1',
      manifestDigest: hash,
      manifestVersion: 'evaluation-manifest@1',
      rings: ['public', 'heldout', 'canary', 'transfer'].map((ring) => ({
        ring,
        fixtureSetRef: `fixture-set:${ring}-1`,
        fixtureSetDigest: digest(`fixture-set:${ring}`),
        fixtureCount: 2,
      })),
      evaluatorCapsuleRef: 'evaluator:capsule-1',
      evaluatorCapsuleDigest: hash,
      leakVetoPolicyVersion: 'leak-veto@1',
      sealingReceiptRef: 'receipt:manifest-seal-1',
    },
    'agent_improvement.fixture_exposure_recorded': {
      manifestEventId: 'event-47',
      manifestPayloadDigest: hash,
      exposureKind: 'activated',
      exposedRingCodes: ['public'],
      authorizedExposureRef: 'exposure-authorization:1',
      authorizedExposureDigest: hash,
      exposureReceiptRef: 'receipt:exposure-1',
      occurredAt: TIMESTAMP,
    },
    'agent_improvement.transfer_trial_recorded': {
      sourceExecutorRef: 'executor:primary-1',
      sourceExecutorFingerprint: hash,
      targetExecutorRef: 'executor:transfer-1',
      targetExecutorFingerprint: digest('target-executor'),
      verifierRef: 'verifier:isolated-1',
      verifierFingerprint: hash,
      behaviorFamilyIds: ['behavior-family-1'],
      scenarioSetRef: 'scenario-set:transfer-1',
      scenarioSetDigest: hash,
      baselineExecutionRef: 'execution:transfer-baseline-1',
      baselineExecutionDigest: hash,
      candidateExecutionRef: 'execution:transfer-candidate-1',
      candidateExecutionDigest: hash,
      rawObservationRef: 'observation:transfer-1',
      rawObservationDigest: hash,
      transferOutcome: 'pass',
      uncertainty: 0.1,
      executionReceiptRef: 'receipt:transfer-1',
    },
    'agent_improvement.behavioral_change_classified': {
      changeContractEventId: 'event-38',
      changeContractPayloadDigest: hash,
      normalizedEventId: 'event-14',
      normalizedPayloadDigest: hash,
      verificationEventId: 'event-16',
      verificationPayloadDigest: hash,
      canaryGateEventId: 'event-24',
      canaryGatePayloadDigest: hash,
      classificationPolicyVersion: 'behavioral-semver@1',
      behavioralSemver: 'patch',
      affectedBehaviorFamilyIds: ['behavior-family-1'],
      regressedBehaviorFamilyIds: [],
      preservedObligationIds: ['obligation:authority'],
      classificationEvidenceRef: 'evidence:classification-1',
      classificationEvidenceDigest: hash,
      classificationReceiptRef: 'receipt:classification-1',
    },
  };
  const result = data[stem];
  if (!result) throw new Error(`Missing extension fixture for ${stem}`);
  return result;
}

function dataFor<TStem extends AgentImprovementEventStem>(
  stem: TStem,
): AgentImprovementInputData<TStem> {
  const hash = digest(stem);
  const data = stem.startsWith('deep_improvement_common.')
    ? commonData(stem, hash)
    : extensionData(stem, hash);
  return data as AgentImprovementInputData<TStem>;
}

function eventInput<TStem extends AgentImprovementEventStem>(
  stem: TStem,
  index: number,
  prevEventHash: string,
): AgentImprovementEventInput<TStem> {
  return {
    stem,
    scope: scopeFor(stem),
    prevEventHash,
    replay: replayMetadata(stem),
    data: dataFor(stem),
    eventId: `event-${index}`,
    streamId: 'agent-improvement-run-1',
    streamSequence: index,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'agent-improvement-shadow-schema', version: '1' },
    authorityEpoch: 1,
    correlationId: 'run-1',
    causationId: index === 1 ? null : `event-${index - 1}`,
    idempotencyKey: `agent-improvement-event-${index}`,
  };
}

function withDataField<TStem extends AgentImprovementEventStem>(
  stem: TStem,
  index: number,
  field: string,
  value: unknown,
): AgentImprovementEventInput<TStem> {
  const input = eventInput(stem, index, '0'.repeat(64));
  return {
    ...input,
    data: {
      ...input.data,
      [field]: value,
    } as AgentImprovementInputData<TStem>,
  };
}

async function authorizationRequest(
  harness: Harness,
  event: EventWritePreflight,
  requestId: string,
  capabilityId = 'agent-improvement:append',
): Promise<TransitionAuthorizationRequest> {
  const policy = harness.policies.resolve('agent-improvement-shadow-write', 1);
  return {
    requestId,
    mode: 'agent-improvement',
    event,
    priorHead: await harness.ledger.getVerifiedHead(),
    priorStateVersion: 'agent-improvement-shadow@1',
    priorStateFingerprint: digest('prior-state'),
    actorId: 'agent-improvement-runtime',
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

// ───────────────────────────────────────────────────────────────────
// 2. AUTHORIZATION, REPLAY, AND EXTENSION CONTRACT
// ───────────────────────────────────────────────────────────────────

describe('agent-improvement typed ledger schema', () => {
  it('authorizes, appends, and verifies every imported and added event stem', async () => {
    const harness = createHarness();
    let priorHash = '0'.repeat(64);

    for (const [offset, stem] of AgentImprovementEventStems.entries()) {
      const index = offset + 1;
      const event = prepareAgentImprovementEvent(
        eventInput(stem, index, priorHash),
        harness.registry,
      );
      const proof = await authorize(harness, event, `request-${index}`);
      const receipt = await harness.ledger.appendAuthorized(event, proof);
      expect(receipt.authorizationRef.decision_id).toBe(
        proof.decision.decision_id,
      );
      priorHash = receipt.recordHash;
    }

    const verified = await harness.ledger.readVerifiedEvents();
    expect(verified).toHaveLength(AgentImprovementEventStems.length);
    expect(verified.map((entry) => entry.event.stored.envelope.event_type))
      .toEqual(AgentImprovementEventStems.map(
        (stem) => AgentImprovementWireEventTypes[stem],
      ));
    expect(DeepImprovementCommonEventStems).toHaveLength(35);
    expect(AgentImprovementExtensionEventStems).toHaveLength(15);
    expect(AgentImprovementEventStems).toHaveLength(50);
    for (const entry of verified) {
      expect(entry.event.stored.envelope.payload.replay).toBeDefined();
      expect(entry.frame.authorization_ref.decision_id).not.toBe('');
    }
  });

  it('reuses the common envelope and binds the score backend outside caller control', () => {
    expect(AGENT_IMPROVEMENT_SHARED_ENVELOPE_FIELDS).toBe(
      DEEP_IMPROVEMENT_COMMON_SHARED_ENVELOPE_FIELDS,
    );
    expect(AGENT_IMPROVEMENT_SCORE_WRITE_BACKEND_REF).toBe(
      DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
    );

    const registry = createAgentImprovementEventRegistry();
    const normalized = prepareAgentImprovementEvent(
      eventInput(
        'deep_improvement_common.evaluation_normalized',
        14,
        '0'.repeat(64),
      ),
      registry,
    );
    expect(normalized.envelope.payload.data.scoreWriteBackendRef).toBe(
      'backend:deep-improvement-score',
    );

    expect(() => prepareAgentImprovementEvent(
      withDataField(
        'deep_improvement_common.evaluation_normalized',
        14,
        'scoreWriteBackendRef',
        'backend:caller-selected',
      ),
      registry,
    )).toThrow(/bound by the Agent Improvement schema/);
  });

  it('produces deterministic identities, payload digests, and replay metadata', () => {
    const registry = createAgentImprovementEventRegistry();
    const input = eventInput(
      'agent_improvement.agent_ir_compiled',
      37,
      '0'.repeat(64),
    );
    const first = prepareAgentImprovementEvent(input, registry);
    const second = prepareAgentImprovementEvent(input, registry);
    expect(second.identity).toEqual(first.identity);
    expect(second.canonicalDigest).toBe(first.canonicalDigest);
    expect(second.envelope.payload.payloadDigest).toBe(
      first.envelope.payload.payloadDigest,
    );
    expect(second.envelope.payload.replay).toEqual(first.envelope.payload.replay);
  });

  // ─────────────────────────────────────────────────────────────────
  // 3. FAIL-CLOSED SHAPES AND APPEND-ONLY RULES
  // ─────────────────────────────────────────────────────────────────

  it('rejects missing identities, wrong variants, and absent tail hashes', () => {
    const registry = createAgentImprovementEventRegistry();
    const input = eventInput(
      'agent_improvement.trace_sliced',
      41,
      '0'.repeat(64),
    );
    const missingTrace = { ...input.scope } as Record<string, unknown>;
    delete missingTrace.traceId;
    expect(() => prepareAgentImprovementEvent({
      ...input,
      scope: missingTrace as AgentImprovementScopeMap[
        'agent_improvement.trace_sliced'
      ],
    }, registry)).toThrow();

    const wrongVariant = eventInput(
      'deep_improvement_common.run_started',
      1,
      '0'.repeat(64),
    );
    expect(() => prepareAgentImprovementEvent({
      ...wrongVariant,
      scope: {
        ...wrongVariant.scope,
        variant: 'skill-benchmark',
      } as unknown as typeof wrongVariant.scope,
    }, registry)).toThrow();

    const prepared = prepareAgentImprovementEvent(input, registry);
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
        variant: 'skill-benchmark',
      },
    } as unknown as DeepImprovementCommonEventInput<
      'deep_improvement_common.run_started'
    >;
    const foreignPrepared = prepareDeepImprovementCommonEvent(
      foreign,
      createDeepImprovementCommonEventRegistry(),
    );

    expect(() => prepareEventWrite(
      foreignPrepared.envelope,
      harness.registry,
    )).toThrow();
    expect(() => prepareDeepImprovementCommonEvent(
      foreign,
      harness.registry,
    )).toThrow();

    const foreignAuthorization = await harness.gateway.authorize(
      await authorizationRequest(
        harness,
        foreignPrepared,
        'foreign-variant',
      ),
    );
    expect(foreignAuthorization.verdict).toBe('deny');

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
    await expect(harness.ledger.appendAuthorized(
      foreignPrepared,
      correctProof,
    )).rejects.toMatchObject({
      code: AuthorizedLedgerErrorCodes.INPUT_INVALID,
    });
    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({
      sequence: 0,
    });
    await expect(harness.ledger.readVerifiedEvents()).resolves.toHaveLength(0);

    await harness.ledger.appendAuthorized(correctPrepared, correctProof);
    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({
      sequence: 1,
    });
    await expect(harness.ledger.readVerifiedEvents()).resolves.toHaveLength(1);
  });

  it('rejects mutable bodies and protected fixture identities before append', async () => {
    const harness = createHarness();
    const mutableBody = 'mutable agent definition and evaluator evidence '.repeat(100);
    expect(() => prepareAgentImprovementEvent(
      withDataField(
        'agent_improvement.trace_sliced',
        41,
        'traceRef',
        mutableBody,
      ),
      harness.registry,
    )).toThrow();

    const ir = eventInput(
      'agent_improvement.agent_ir_compiled',
      37,
      '0'.repeat(64),
    );
    expect(() => prepareAgentImprovementEvent({
      ...ir,
      data: {
        ...ir.data,
        components: ir.data.components.map((component, index) => index === 0
          ? { ...component, body: mutableBody }
          : component),
      },
    }, harness.registry)).toThrow();

    const manifest = eventInput(
      'agent_improvement.evaluation_manifest_sealed',
      47,
      '0'.repeat(64),
    );
    expect(() => prepareAgentImprovementEvent({
      ...manifest,
      data: {
        ...manifest.data,
        rings: manifest.data.rings.map((ring, index) => index === 0
          ? { ...ring, fixtureId: 'hidden-fixture-1' }
          : ring),
      },
    }, harness.registry)).toThrow();
    await expect(harness.ledger.getVerifiedHead()).resolves.toMatchObject({
      sequence: 0,
    });
  });

  it('rejects in-place definition, candidate, and mutation revisions', () => {
    const registry = createAgentImprovementEventRegistry();
    const change = eventInput(
      'agent_improvement.change_contract_compiled',
      38,
      '0'.repeat(64),
    );
    expect(() => prepareAgentImprovementEvent({
      ...change,
      data: {
        ...change.data,
        candidateDefinitionDigest: change.data.baseDefinitionDigest,
      },
    }, registry)).toThrow();

    const mutation = eventInput(
      'agent_improvement.mutation_proposed',
      39,
      '0'.repeat(64),
    );
    expect(() => prepareAgentImprovementEvent({
      ...mutation,
      data: {
        ...mutation.data,
        parentCandidateId: mutation.scope.candidateId,
      },
    }, registry)).toThrow();

    const prepared = prepareAgentImprovementEvent(mutation, registry);
    expect(() => prepareEventWrite({
      ...prepared.envelope,
      event_type: 'agent-improvement.ledger.mutation-updated',
    }, registry)).toThrow();
  });

  it('keeps raw observations separate from derived classifications and scores', () => {
    const registry = createAgentImprovementEventRegistry();
    const observation = eventInput(
      'deep_improvement_common.evaluation_observation_recorded',
      13,
      '0'.repeat(64),
    );
    expect(() => prepareAgentImprovementEvent({
      ...observation,
      data: {
        ...observation.data,
        scoreVector: scoreVector(),
      } as typeof observation.data,
    }, registry)).toThrow();

    const trace = eventInput(
      'agent_improvement.trace_sliced',
      41,
      '0'.repeat(64),
    );
    expect(() => prepareAgentImprovementEvent({
      ...trace,
      data: {
        ...trace.data,
        behavioralSemver: 'major',
      } as typeof trace.data,
    }, registry)).toThrow();
  });

  it('requires typed scoring, verification, and canary adjudication before verdicts', () => {
    const registry = createAgentImprovementEventRegistry();
    const proposal = eventInput(
      'deep_improvement_common.candidate_proposed',
      7,
      '0'.repeat(64),
    );
    expect(() => prepareAgentImprovementEvent({
      ...proposal,
      data: {
        ...proposal.data,
        aggregateScore: 0.99,
      } as typeof proposal.data,
    }, registry)).toThrow();

    const promotion = eventInput(
      'deep_improvement_common.promotion_proposed',
      27,
      '0'.repeat(64),
    );
    const promotionWithoutScore = {
      ...promotion.data,
    } as Record<string, unknown>;
    delete promotionWithoutScore.normalizedEventId;
    delete promotionWithoutScore.normalizedPayloadDigest;
    expect(() => prepareAgentImprovementEvent({
      ...promotion,
      data: promotionWithoutScore as typeof promotion.data,
    }, registry)).toThrow();

    const classification = eventInput(
      'agent_improvement.behavioral_change_classified',
      50,
      '0'.repeat(64),
    );
    const classificationWithoutAdjudication = {
      ...classification.data,
    } as Record<string, unknown>;
    delete classificationWithoutAdjudication.normalizedEventId;
    delete classificationWithoutAdjudication.verificationEventId;
    expect(() => prepareAgentImprovementEvent({
      ...classification,
      data: classificationWithoutAdjudication as typeof classification.data,
    }, registry)).toThrow();
  });

  it('requires a closed four-ring manifest without hidden fixture identifiers', () => {
    const registry = createAgentImprovementEventRegistry();
    const input = eventInput(
      'agent_improvement.evaluation_manifest_sealed',
      47,
      '0'.repeat(64),
    );
    expect(() => prepareAgentImprovementEvent({
      ...input,
      data: {
        ...input.data,
        rings: input.data.rings.slice(0, 3),
      },
    }, registry)).toThrow();
    expect(() => prepareAgentImprovementEvent({
      ...input,
      data: {
        ...input.data,
        rings: input.data.rings.map((ring, index) => index === 3
          ? { ...ring, ring: 'public' }
          : ring),
      },
    }, registry)).toThrow();
  });

  it('denies unauthorized transitions before the append boundary', async () => {
    const harness = createHarness();
    const event = prepareAgentImprovementEvent(
      eventInput(
        'agent_improvement.behavioral_change_classified',
        1,
        '0'.repeat(64),
      ),
      harness.registry,
    );
    const denied = await harness.gateway.authorize(
      await authorizationRequest(harness, event, 'denied-request', 'read-only'),
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

  it('preserves prepared event bytes after caller mutation', async () => {
    const harness = createHarness();
    const input = eventInput(
      'agent_improvement.trace_sliced',
      1,
      '0'.repeat(64),
    );
    const event = prepareAgentImprovementEvent(input, harness.registry);
    const originalData = structuredClone(event.envelope.payload.data);
    const mutableData = input.data as {
      traceRef: string;
    };
    mutableData.traceRef = 'trace:mutated-after-prepare';
    const proof = await authorize(harness, event, 'immutable-event-request');
    await harness.ledger.appendAuthorized(event, proof);
    const [verified] = await harness.ledger.readVerifiedEvents();
    expect(verified.event.stored.envelope.payload.data).toEqual(originalData);
  });

  // ─────────────────────────────────────────────────────────────────
  // 4. COMPATIBILITY AND VERSION BOUNDARIES
  // ─────────────────────────────────────────────────────────────────

  it('fails closed on unknown stems and independent envelope or payload versions', () => {
    expect(decideAgentImprovementCompatibility({
      format: 'agent-improvement-ledger',
      stem: 'agent_improvement.agent_ir_compiled',
      eventVersion: 1,
    }).status).toBe('exact');
    expect(decideAgentImprovementCompatibility({
      format: 'agent-improvement-ledger',
      stem: 'agent_improvement.unknown',
      eventVersion: 1,
    }).status).toBe('blocked');
    expect(decideAgentImprovementCompatibility({
      eventType: 'agent_definition_snapshot',
      schemaVersion: 99,
      sessionId: 'run-1',
      parentSessionId: 'lineage-1',
      definitionId: 'agent-definition-1',
    }).status).toBe('blocked');

    const registry = createAgentImprovementEventRegistry();
    const prepared = prepareAgentImprovementEvent(
      eventInput(
        'agent_improvement.definition_snapshot_sealed',
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
      payload: {
        ...prepared.envelope.payload,
        eventVersion: 99,
      },
    }, registry)).toThrow();
  });

  it('upcasts legacy JSONL purely with source and upcaster digests retained', () => {
    const record = {
      eventType: 'agent_definition_snapshot',
      schemaVersion: 1,
      sessionId: 'run-1',
      parentSessionId: 'lineage-1',
      definitionId: 'agent-definition-1',
      definitionRef: 'legacy:agent-definition-1',
      details: {
        definitionBody: 'Mutable legacy definition remains outside the typed payload.',
      },
    };
    const context = {
      scope: scopeFor('agent_improvement.definition_snapshot_sealed'),
      prevEventHash: '0'.repeat(64),
      replay: replayMetadata('legacy-definition'),
    };
    const first = upcastLegacyAgentImprovementRecord(record, context);
    const second = upcastLegacyAgentImprovementRecord(record, context);
    expect(second).toEqual(first);
    expect(first.status).toBe('migrated');
    if (first.status !== 'migrated') throw new Error(first.decision.reasonCode);
    expect(first.targetStem).toBe(
      'agent_improvement.definition_snapshot_sealed',
    );
    expect(first.originalRecordDigest).toBe(digest(record));
    expect(first.upcasterFingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(() => prepareAgentImprovementEvent({
      ...eventInput(
        'agent_improvement.definition_snapshot_sealed',
        1,
        context.prevEventHash,
      ),
      scope: context.scope,
      replay: context.replay,
      data: first.data as AgentImprovementPayloadMap[
        'agent_improvement.definition_snapshot_sealed'
      ],
    }, createAgentImprovementEventRegistry())).not.toThrow();
    expect(record.details.definitionBody).toContain('Mutable legacy definition');
  });
});
