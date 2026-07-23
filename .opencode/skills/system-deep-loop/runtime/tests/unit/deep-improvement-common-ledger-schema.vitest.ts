// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Ledger Schema Tests
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
  DEEP_IMPROVEMENT_COMMON_SHARED_ENVELOPE_FIELDS,
  DeepImprovementCommonEventStems,
  DeepImprovementCommonWireEventTypes,
  createDeepImprovementCommonEventRegistry,
  decideDeepImprovementCommonCompatibility,
  prepareDeepImprovementCommonEvent,
  upcastLegacyDeepImprovementCommonRecord,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import {
  EVENT_ENVELOPE_FIELDS,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';

import type {
  GatewayAllowProof,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepImprovementCommonEventInput,
  DeepImprovementCommonEventStem,
  DeepImprovementCommonPayloadMap,
  DeepImprovementCommonReplayMetadata,
  DeepImprovementCommonScopeMap,
  DeepImprovementVariant,
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
const LEDGER_ID = 'deep-improvement-common-shadow';
const AUDIT_LEDGER_ID = 'deep-improvement-common-shadow-authorization';
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
  const root = mkdtempSync(join(tmpdir(), 'deep-improvement-common-schema-'));
  temporaryRoots.push(root);
  return root;
}

function createHarness(): Harness {
  const rootDirectory = temporaryRoot();
  const registry = createDeepImprovementCommonEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'deep-improvement-common-shadow-write',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['known-common-event', 'shadow-capability'],
    evaluate: (input) => ({
      verdict: input.requestedEventType.startsWith('deep-improvement-common.ledger.')
        && input.capabilityId === 'deep-improvement-common:append'
        ? 'allow'
        : 'deny',
      reasonCode: input.requestedEventType.startsWith('deep-improvement-common.ledger.')
        && input.capabilityId === 'deep-improvement-common:append'
        ? 'allowed'
        : 'policy_denied',
      matchedRuleIds: ['known-common-event', 'shadow-capability'],
    }),
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

function replayMetadata(
  label: string,
): DeepImprovementCommonReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest(`replay:${label}`),
    replay_input_digests: {
      configuration: digest('configuration'),
      evaluator: digest('evaluator'),
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

function scopeFor<TStem extends DeepImprovementCommonEventStem>(
  stem: TStem,
  variant: DeepImprovementVariant = 'agent-improvement',
): DeepImprovementCommonScopeMap[TStem] {
  const base = {
    runId: 'run-1',
    lineageId: 'lineage-1',
    variant,
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

function dataFor<TStem extends DeepImprovementCommonEventStem>(
  stem: TStem,
): DeepImprovementCommonPayloadMap[TStem] {
  const hash = digest(stem);
  const data: Readonly<Record<DeepImprovementCommonEventStem, JsonObject>> = {
    'deep_improvement_common.run_started': {
      generation: 1,
      charterDigest: hash,
      configDigest: hash,
      operatorRef: 'operator:deep-improvement',
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
  return data[stem] as DeepImprovementCommonPayloadMap[TStem];
}

function eventInput<TStem extends DeepImprovementCommonEventStem>(
  stem: TStem,
  index: number,
  prevEventHash: string,
  variant: DeepImprovementVariant = 'agent-improvement',
): DeepImprovementCommonEventInput<TStem> {
  return {
    stem,
    scope: scopeFor(stem, variant),
    prevEventHash,
    replay: replayMetadata(stem),
    data: dataFor(stem),
    eventId: `event-${index}`,
    streamId: 'deep-improvement-common-run-1',
    streamSequence: index,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-improvement-common-shadow-schema', version: '1' },
    authorityEpoch: 1,
    correlationId: 'run-1',
    causationId: index === 1 ? null : `event-${index - 1}`,
    idempotencyKey: `deep-improvement-common-event-${index}`,
  };
}

function eventInputWithDataField<
  TStem extends DeepImprovementCommonEventStem,
>(
  stem: TStem,
  index: number,
  field: string,
  value: unknown,
): DeepImprovementCommonEventInput<TStem> {
  const input = eventInput(stem, index, '0'.repeat(64));
  return {
    ...input,
    data: { ...input.data, [field]: value } as DeepImprovementCommonPayloadMap[TStem],
  };
}

async function authorizationRequest(
  harness: Harness,
  event: EventWritePreflight,
  requestId: string,
  capabilityId = 'deep-improvement-common:append',
): Promise<TransitionAuthorizationRequest> {
  const policy = harness.policies.resolve('deep-improvement-common-shadow-write', 1);
  return {
    requestId,
    mode: 'agent-improvement',
    event,
    priorHead: await harness.ledger.getVerifiedHead(),
    priorStateVersion: 'deep-improvement-common-shadow@1',
    priorStateFingerprint: digest('prior-state'),
    actorId: 'deep-improvement-common-runtime',
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
// 2. AUTHORIZATION AND REPLAY MATRIX
// ───────────────────────────────────────────────────────────────────

describe('deep-improvement-common typed ledger schema', () => {
  it('authorizes and appends every common event stem with replay metadata', async () => {
    const harness = createHarness();
    let priorHash = '0'.repeat(64);
    for (const [offset, stem] of DeepImprovementCommonEventStems.entries()) {
      const index = offset + 1;
      const event = prepareDeepImprovementCommonEvent(
        eventInput(stem, index, priorHash),
        harness.registry,
      );
      const proof = await authorize(harness, event, `request-${index}`);
      const receipt = await harness.ledger.appendAuthorized(event, proof);
      expect(receipt.authorizationRef.decision_id).toBe(proof.decision.decision_id);
      priorHash = receipt.recordHash;
    }

    const verified = await harness.ledger.readVerifiedEvents();
    expect(verified).toHaveLength(DeepImprovementCommonEventStems.length);
    expect(verified.map((entry) => entry.event.stored.envelope.event_type)).toEqual(
      DeepImprovementCommonEventStems.map(
        (stem) => DeepImprovementCommonWireEventTypes[stem],
      ),
    );
    for (const [index, entry] of verified.entries()) {
      const stem = DeepImprovementCommonEventStems[index];
      expect(entry.event.stored.envelope.payload.stem).toBe(stem);
      expect(entry.event.stored.envelope.payload.replay).toEqual(
        replayMetadata(stem),
      );
      expect(entry.frame.authorization_ref.decision_id).not.toBe('');
    }
  });

  it('reuses the shared envelope without shadow authorization fields', () => {
    expect(DEEP_IMPROVEMENT_COMMON_SHARED_ENVELOPE_FIELDS).toEqual(
      EVENT_ENVELOPE_FIELDS,
    );
    expect(DEEP_IMPROVEMENT_COMMON_SHARED_ENVELOPE_FIELDS).not.toContain(
      'transitionAuthorizationRef',
    );
    const registry = createDeepImprovementCommonEventRegistry();
    const input = eventInput(
      'deep_improvement_common.run_started',
      1,
      '0'.repeat(64),
    );
    const first = prepareDeepImprovementCommonEvent(input, registry);
    const second = prepareDeepImprovementCommonEvent(input, registry);
    expect(second.identity).toEqual(first.identity);
    expect(second.canonicalDigest).toBe(first.canonicalDigest);
    expect(second.envelope.payload.payloadDigest).toBe(
      first.envelope.payload.payloadDigest,
    );
  });

  // ─────────────────────────────────────────────────────────────────
  // 3. FAIL-CLOSED SHAPE AND APPEND-ONLY RULES
  // ─────────────────────────────────────────────────────────────────

  it('rejects missing base and event-specific identities plus absent tail hashes', () => {
    const registry = createDeepImprovementCommonEventRegistry();
    const observation = eventInput(
      'deep_improvement_common.evaluation_observation_recorded',
      13,
      '0'.repeat(64),
    );
    const missingRun = { ...observation.scope } as Record<string, unknown>;
    delete missingRun.runId;
    expect(() => prepareDeepImprovementCommonEvent({
      ...observation,
      scope: missingRun as DeepImprovementCommonScopeMap[
        'deep_improvement_common.evaluation_observation_recorded'
      ],
    }, registry)).toThrow();

    const missingObservation = {
      ...observation.scope,
    } as Record<string, unknown>;
    delete missingObservation.observationId;
    expect(() => prepareDeepImprovementCommonEvent({
      ...observation,
      scope: missingObservation as DeepImprovementCommonScopeMap[
        'deep_improvement_common.evaluation_observation_recorded'
      ],
    }, registry)).toThrow();

    const prepared = prepareDeepImprovementCommonEvent(observation, registry);
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

  it('rejects prose in evidence references and accepts system-token references', () => {
    const registry = createDeepImprovementCommonEventRegistry();
    const mutableReference = 'mutable evaluator output with protected evidence';
    expect(mutableReference.length).toBeLessThan(256);
    expect(() => prepareDeepImprovementCommonEvent(
      eventInputWithDataField(
        'deep_improvement_common.evaluation_observation_recorded',
        13,
        'rawObservationRef',
        mutableReference,
      ),
      registry,
    )).toThrow();
    expect(() => prepareDeepImprovementCommonEvent(
      eventInputWithDataField(
        'deep_improvement_common.canary_suite_sealed',
        19,
        'protectedMaterialRef',
        mutableReference,
      ),
      registry,
    )).toThrow();
    expect(() => prepareDeepImprovementCommonEvent(
      eventInput(
        'deep_improvement_common.evaluation_observation_recorded',
        13,
        '0'.repeat(64),
      ),
      registry,
    )).not.toThrow();
    expect(() => prepareDeepImprovementCommonEvent(
      eventInput(
        'deep_improvement_common.canary_suite_sealed',
        19,
        '0'.repeat(64),
      ),
      registry,
    )).not.toThrow();
  });

  it('keeps raw observations, normalized scores, and promotion evidence separate', () => {
    const registry = createDeepImprovementCommonEventRegistry();
    const observation = eventInput(
      'deep_improvement_common.evaluation_observation_recorded',
      13,
      '0'.repeat(64),
    );
    expect(() => prepareDeepImprovementCommonEvent({
      ...observation,
      data: { ...observation.data, scoreVector: scoreVector() },
    }, registry)).toThrow();

    const normalized = eventInput(
      'deep_improvement_common.evaluation_normalized',
      14,
      '0'.repeat(64),
    );
    expect(() => prepareDeepImprovementCommonEvent({
      ...normalized,
      data: {
        ...normalized.data,
        rawObservationRef: 'observation-artifact:mutable-alias',
      },
    }, registry)).toThrow();
    expect(() => prepareDeepImprovementCommonEvent({
      ...normalized,
      data: {
        ...normalized.data,
        scoreWriteBackendRef: 'backend:alternate-score',
      },
    }, registry)).toThrow();

    const proposed = eventInput(
      'deep_improvement_common.candidate_proposed',
      7,
      '0'.repeat(64),
    );
    expect(() => prepareDeepImprovementCommonEvent({
      ...proposed,
      data: { ...proposed.data, aggregateScore: 0.99 },
    }, registry)).toThrow();
  });

  it('uses new predecessor-referencing events for candidate and observation progression', () => {
    const registry = createDeepImprovementCommonEventRegistry();
    const proposal = prepareDeepImprovementCommonEvent(
      eventInput(
        'deep_improvement_common.candidate_proposed',
        7,
        '0'.repeat(64),
      ),
      registry,
    );
    const generatedInput = eventInput(
      'deep_improvement_common.candidate_generated',
      8,
      '0'.repeat(64),
    );
    const generated = prepareDeepImprovementCommonEvent({
      ...generatedInput,
      data: {
        ...generatedInput.data,
        proposalEventId: proposal.envelope.event_id,
        proposalPayloadDigest: proposal.envelope.payload.payloadDigest,
      },
    }, registry);
    expect(generated.envelope.event_id).not.toBe(proposal.envelope.event_id);
    expect(generated.envelope.payload.data).toMatchObject({
      proposalEventId: proposal.envelope.event_id,
      proposalPayloadDigest: proposal.envelope.payload.payloadDigest,
    });

    const observation = prepareDeepImprovementCommonEvent(
      eventInput(
        'deep_improvement_common.evaluation_observation_recorded',
        13,
        '0'.repeat(64),
      ),
      registry,
    );
    const normalizedInput = eventInput(
      'deep_improvement_common.evaluation_normalized',
      14,
      observation.canonicalDigest,
    );
    const normalized = prepareDeepImprovementCommonEvent({
      ...normalizedInput,
      data: {
        ...normalizedInput.data,
        observationEventIds: [observation.envelope.event_id],
        observationSetDigest: observation.envelope.payload.payloadDigest,
      },
    }, registry);
    expect(normalized.envelope.event_id).not.toBe(observation.envelope.event_id);
    expect(normalized.envelope.payload.data).toMatchObject({
      observationEventIds: [observation.envelope.event_id],
      observationSetDigest: observation.envelope.payload.payloadDigest,
    });
    expect(observation.envelope.payload.data).toEqual(
      dataFor('deep_improvement_common.evaluation_observation_recorded'),
    );
  });

  it('rejects inconsistent run completion facts and accepts mapped pairs', () => {
    const registry = createDeepImprovementCommonEventRegistry();
    const input = eventInput(
      'deep_improvement_common.run_completed',
      4,
      '0'.repeat(64),
    );
    expect(() => prepareDeepImprovementCommonEvent({
      ...input,
      data: {
        ...input.data,
        terminalOutcome: 'aborted',
        stopReason: 'blockedStop',
      },
    }, registry)).toThrow();
    expect(() => prepareDeepImprovementCommonEvent({
      ...input,
      data: {
        ...input.data,
        terminalOutcome: 'quarantined',
        stopReason: 'blockedStop',
      },
    }, registry)).not.toThrow();
  });

  it('requires external promotion decisions instead of score self-authorization', () => {
    const registry = createDeepImprovementCommonEventRegistry();
    const authorized = eventInput(
      'deep_improvement_common.promotion_authorized',
      28,
      '0'.repeat(64),
    );
    const missingReference = {
      ...authorized.data,
    } as Record<string, unknown>;
    delete missingReference.externalAuthorizationRef;
    expect(() => prepareDeepImprovementCommonEvent({
      ...authorized,
      data: missingReference as DeepImprovementCommonPayloadMap[
        'deep_improvement_common.promotion_authorized'
      ],
    }, registry)).toThrow();
    expect(() => prepareDeepImprovementCommonEvent({
      ...authorized,
      data: {
        ...authorized.data,
        externalAuthorizationRef: 'score:self-issued',
      },
    }, registry)).toThrow();
  });

  it('denies unauthorized transitions before the append boundary', async () => {
    const harness = createHarness();
    const event = prepareDeepImprovementCommonEvent(
      eventInput(
        'deep_improvement_common.promotion_authorized',
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

  it('preserves immutable raw observation bytes after caller mutation', async () => {
    const harness = createHarness();
    const input = eventInput(
      'deep_improvement_common.evaluation_observation_recorded',
      1,
      '0'.repeat(64),
    );
    const event = prepareDeepImprovementCommonEvent(input, harness.registry);
    const originalData = structuredClone(event.envelope.payload.data);
    const mutableData = input.data as {
      rawObservationRef: string;
    };
    mutableData.rawObservationRef = 'observation-artifact:mutated-after-prepare';
    const proof = await authorize(harness, event, 'immutable-observation-request');
    await harness.ledger.appendAuthorized(event, proof);
    const [verified] = await harness.ledger.readVerifiedEvents();
    expect(verified.event.stored.envelope.payload.data).toEqual(originalData);
  });

  it('keeps downstream variant attribution closed and reusable', () => {
    const registry = createDeepImprovementCommonEventRegistry();
    for (const variant of [
      'agent-improvement',
      'model-benchmark',
      'skill-benchmark',
    ] as const) {
      expect(() => prepareDeepImprovementCommonEvent(
        eventInput(
          'deep_improvement_common.run_started',
          1,
          '0'.repeat(64),
          variant,
        ),
        registry,
      )).not.toThrow();
    }

    const invalid = eventInput(
      'deep_improvement_common.run_started',
      1,
      '0'.repeat(64),
    );
    expect(() => prepareDeepImprovementCommonEvent({
      ...invalid,
      scope: {
        ...invalid.scope,
        variant: 'custom-improvement',
      } as unknown as typeof invalid.scope,
    }, registry)).toThrow();

    const normalized = eventInput(
      'deep_improvement_common.evaluation_normalized',
      14,
      '0'.repeat(64),
    );
    expect(() => prepareDeepImprovementCommonEvent({
      ...normalized,
      data: {
        ...normalized.data,
        agentImprovement: { privateScore: 1 },
      },
    }, registry)).toThrow();
  });

  it('rejects open or ambiguous score vectors', () => {
    const registry = createDeepImprovementCommonEventRegistry();
    const input = eventInput(
      'deep_improvement_common.evaluation_normalized',
      14,
      '0'.repeat(64),
    );
    const [first] = input.data.scoreVector.components;
    expect(() => prepareDeepImprovementCommonEvent({
      ...input,
      data: {
        ...input.data,
        scoreVector: {
          ...input.data.scoreVector,
          components: [first, { ...first }],
        },
      },
    }, registry)).toThrow();
    expect(() => prepareDeepImprovementCommonEvent({
      ...input,
      data: {
        ...input.data,
        scoreVector: {
          ...input.data.scoreVector,
          rationale: 'mutable judgment narrative',
        },
      },
    }, registry)).toThrow();
  });

  // ─────────────────────────────────────────────────────────────────
  // 4. LEGACY COMPATIBILITY AND VERSION BOUNDARIES
  // ─────────────────────────────────────────────────────────────────

  it('covers compatibility outcomes and blocks unknown events and versions', () => {
    expect(decideDeepImprovementCommonCompatibility({
      format: 'deep-improvement-common-ledger',
      stem: 'deep_improvement_common.run_started',
      eventVersion: 1,
    }).status).toBe('exact');
    expect(decideDeepImprovementCommonCompatibility({
      type: 'progress',
      schemaVersion: 1,
    }).status).toBe('compatible');
    expect(decideDeepImprovementCommonCompatibility({
      eventType: 'session_start',
      schemaVersion: 1,
      sessionId: 'run-1',
      parentSessionId: 'lineage-1',
    }).status).toBe('migrate');
    expect(decideDeepImprovementCommonCompatibility({
      eventType: 'gate_evaluation',
      schemaVersion: 1,
    }).status).toBe('pin-old-runtime');
    expect(decideDeepImprovementCommonCompatibility({
      eventType: 'unknown',
      schemaVersion: 1,
    }).status).toBe('blocked');
    expect(decideDeepImprovementCommonCompatibility({
      eventType: 'session_start',
      schemaVersion: 99,
      sessionId: 'run-1',
      parentSessionId: 'lineage-1',
    }).status).toBe('blocked');
  });

  it('upcasts legacy JSONL purely with source and upcaster digests retained', () => {
    const record = {
      eventType: 'session_start',
      schemaVersion: 1,
      sessionId: 'run-1',
      parentSessionId: 'lineage-1',
      operatorId: 'legacy-operator',
      maxIterations: 5,
      details: { charter: 'legacy mutable body remains outside the typed payload' },
    };
    const context = {
      scope: scopeFor('deep_improvement_common.run_started'),
      prevEventHash: '0'.repeat(64),
      replay: replayMetadata('legacy-session-start'),
    };
    const first = upcastLegacyDeepImprovementCommonRecord(record, context);
    const second = upcastLegacyDeepImprovementCommonRecord(record, context);
    expect(second).toEqual(first);
    expect(first.status).toBe('migrated');
    if (first.status !== 'migrated') throw new Error(first.decision.reasonCode);
    expect(first.targetStem).toBe('deep_improvement_common.run_started');
    expect(first.originalRecordDigest).toBe(digest(record));
    expect(first.upcasterFingerprint).toMatch(/^[a-f0-9]{64}$/);

    expect(() => prepareDeepImprovementCommonEvent({
      ...eventInput(
        'deep_improvement_common.run_started',
        1,
        context.prevEventHash,
      ),
      scope: context.scope,
      replay: context.replay,
      data: first.data as DeepImprovementCommonPayloadMap[
        'deep_improvement_common.run_started'
      ],
    }, createDeepImprovementCommonEventRegistry())).not.toThrow();
    expect(record.details.charter).toContain('legacy mutable body');
  });

  it('keeps envelope and payload version failures independent and fail-closed', () => {
    const registry = createDeepImprovementCommonEventRegistry();
    const prepared = prepareDeepImprovementCommonEvent(
      eventInput(
        'deep_improvement_common.run_started',
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
    expect(decideDeepImprovementCommonCompatibility({
      format: 'deep-improvement-common-ledger',
      stem: 'deep_improvement_common.unknown_event',
      eventVersion: 1,
    }).status).toBe('blocked');
  });
});
