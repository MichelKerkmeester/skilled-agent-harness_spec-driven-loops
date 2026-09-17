// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Reducer Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH,
  deepImprovementCommonProjectionIntegrityDigest,
  foldDeepImprovementCommonEvents,
  isDeepFrozenProjection,
  projectDeepImprovementCommonCandidateView,
  projectDeepImprovementCommonLegacyView,
} from '../../lib/deep-improvement-common-reducers/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
  createDeepImprovementCommonEventRegistry,
  prepareDeepImprovementCommonEvent,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';

import type {
  DeepImprovementCommonEventEnvelope,
  DeepImprovementCommonEventStem,
  DeepImprovementCommonLedgerEvent,
  DeepImprovementCommonPayloadMap,
  DeepImprovementCommonScopeMap,
} from '../../lib/deep-improvement-common-ledger-schema/index.js';
import type {
  DeepImprovementCommonProjectedResult,
  DeepImprovementCommonProjectionState,
} from '../../lib/deep-improvement-common-reducers/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURE HELPERS
// ───────────────────────────────────────────────────────────────────

const TIMESTAMP = '2026-07-23T10:00:00.000Z';
const RUN_ID = 'run-1';
const LINEAGE_ID = 'lineage-1';
const CANDIDATE_ID = 'candidate-1';
const EVALUATION_EPOCH_ID = 'evaluation-epoch-1';
const CANARY_EPOCH_ID = 'canary-epoch-1';
const CANARY_SUITE_ID = 'canary-suite-1';
const PROMOTION_ID = 'promotion-1';
const BASELINE_ID = 'baseline-1';
const STREAM_ID = 'deep-improvement-common-run-1';
const ZERO_DIGEST = '0'.repeat(64);
const registry = createDeepImprovementCommonEventRegistry();

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function eventHash(event: DeepImprovementCommonLedgerEvent): string {
  return sha256Bytes(canonicalBytes(event));
}

function replayMetadata() {
  return {
    fingerprint_version: 1,
    final_digest: digest('replay'),
    replay_input_digests: {
      configuration: digest('configuration'),
      evaluator: digest('evaluator'),
    },
  } as const;
}

function scopeFor<TStem extends DeepImprovementCommonEventStem>(
  stem: TStem,
  candidateId = CANDIDATE_ID,
): DeepImprovementCommonScopeMap[TStem] {
  const base = {
    runId: RUN_ID,
    lineageId: LINEAGE_ID,
    variant: 'agent-improvement' as const,
  };
  const candidate = { ...base, candidateId };
  if (stem === 'deep_improvement_common.evaluation_observation_recorded') {
    return {
      ...candidate,
      evaluationEpochId: EVALUATION_EPOCH_ID,
      fixtureId: 'fixture-1',
      observationId: 'observation-1',
    } as DeepImprovementCommonScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.evaluation_')) {
    return {
      ...candidate,
      evaluationEpochId: EVALUATION_EPOCH_ID,
    } as DeepImprovementCommonScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.canary_')) {
    return {
      ...candidate,
      canaryEpochId: CANARY_EPOCH_ID,
      canarySuiteId: CANARY_SUITE_ID,
    } as DeepImprovementCommonScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.promotion_')) {
    return {
      ...candidate,
      promotionId: PROMOTION_ID,
      baselineId: BASELINE_ID,
    } as DeepImprovementCommonScopeMap[TStem];
  }
  if (stem.startsWith('deep_improvement_common.candidate_')) {
    return candidate as DeepImprovementCommonScopeMap[TStem];
  }
  return base as DeepImprovementCommonScopeMap[TStem];
}

function createEvent<TStem extends DeepImprovementCommonEventStem>(
  stem: TStem,
  sequence: number,
  data: DeepImprovementCommonPayloadMap[TStem],
  previous: DeepImprovementCommonLedgerEvent | null,
  identity: {
    readonly candidateId?: string;
    readonly eventId?: string;
  } = {},
): DeepImprovementCommonEventEnvelope<TStem> {
  const prepared = prepareDeepImprovementCommonEvent({
    stem,
    scope: scopeFor(stem, identity.candidateId),
    prevEventHash: previous === null ? ZERO_DIGEST : eventHash(previous),
    replay: replayMetadata(),
    data,
    eventId: identity.eventId
      ?? `event-${String(sequence).padStart(3, '0')}`,
    streamId: STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-improvement-common-reducer-fixture', version: '1' },
    authorityEpoch: 1,
    correlationId: RUN_ID,
    causationId: previous?.event_id ?? null,
    idempotencyKey: `common-reducer-${sequence}-${identity.eventId ?? stem}`,
  }, registry);
  return prepared.envelope as DeepImprovementCommonEventEnvelope<TStem>;
}

function scoreVector(aggregateScore = 0.91) {
  return {
    components: [{
      dimensionCode: 'quality',
      rawScore: aggregateScore,
      normalizedScore: aggregateScore,
      weight: 0.7,
    }, {
      dimensionCode: 'security',
      rawScore: 0.9,
      normalizedScore: 0.9,
      weight: 0.3,
    }],
    aggregateScore,
    uncertainty: 0.05,
  };
}

function append<TStem extends DeepImprovementCommonEventStem>(
  events: DeepImprovementCommonLedgerEvent[],
  stem: TStem,
  data: DeepImprovementCommonPayloadMap[TStem],
): DeepImprovementCommonEventEnvelope<TStem> {
  const event = createEvent(
    stem,
    events.length + 1,
    data,
    events.at(-1) ?? null,
  );
  events.push(event);
  return event;
}

function happyEvents(): DeepImprovementCommonLedgerEvent[] {
  const events: DeepImprovementCommonLedgerEvent[] = [];
  const started = append(events, 'deep_improvement_common.run_started', {
    generation: 1,
    charterDigest: digest('charter'),
    configDigest: digest('config'),
    operatorRef: 'operator:deep-improvement',
    serviceContractVersion: 'deep-improvement-common@1',
    replayFingerprint: digest('run-replay'),
    maxIterations: 4,
  });
  const proposal = append(events, 'deep_improvement_common.candidate_proposed', {
    proposalRef: 'proposal:candidate-1',
    proposalDigest: digest('proposal'),
    mutationOperatorRef: 'operator:bounded-rewrite',
    mutationOperatorVersion: 'bounded-rewrite@1',
    parentCandidateId: null,
    targetRef: 'target:agent-1',
    targetDigest: digest('target'),
    proposalPolicyVersion: 'proposal-policy@1',
  });
  append(events, 'deep_improvement_common.candidate_generated', {
    proposalEventId: proposal.event_id,
    proposalPayloadDigest: proposal.payload.payloadDigest,
    candidateArtifactRef: 'artifact:candidate-1',
    candidateArtifactDigest: digest('candidate'),
    generationReceiptRef: 'receipt:generation-1',
    mutationOperatorRef: 'operator:bounded-rewrite',
    mutationOperatorVersion: 'bounded-rewrite@1',
  });
  const epoch = append(events, 'deep_improvement_common.evaluation_epoch_sealed', {
    evaluatorRef: 'evaluator:independent-1',
    evaluatorCapsuleDigest: digest('evaluator-capsule'),
    fixtureSetRef: 'profile:heldout-1',
    fixtureSetDigest: digest('fixture-set'),
    scorePolicyVersion: 'score-policy@1',
    scoreWriteBackendRef: DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
    evaluationBudgetRef: 'budget:evaluation-1',
  });
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
      scoreWriteBackendRef: DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
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
  append(events, 'deep_improvement_common.evaluation_verification_recorded', {
    requestEventId: verificationRequested.event_id,
    verifierRef: 'verifier:independent-1',
    verificationOutcome: 'confirmed',
    verificationEvidenceRef: 'evidence:verification-1',
    verificationEvidenceDigest: digest('verification-evidence'),
    verificationReceiptRef: 'receipt:verification-1',
  });
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
  const promotionProposal = append(
    events,
    'deep_improvement_common.promotion_proposed',
    {
      normalizedEventId: normalized.event_id,
      normalizedPayloadDigest: normalized.payload.payloadDigest,
      canaryGateEventId: canaryGate.event_id,
      canaryGatePayloadDigest: canaryGate.payload.payloadDigest,
      proposalPolicyVersion: 'promotion-proposal@1',
      requestedRollout: 'shadow',
      evidenceSetDigest: digest('promotion-evidence'),
    },
  );
  const authorization = append(
    events,
    'deep_improvement_common.promotion_authorized',
    {
      proposalEventId: promotionProposal.event_id,
      proposalPayloadDigest: promotionProposal.payload.payloadDigest,
      externalAuthorizationRef: 'transition-authorization:decision-1',
      externalAuthorizationDigest: digest('authorization'),
      authorizationPolicyVersion: 'promotion-authorization@1',
      authorizationReceiptRef: 'receipt:promotion-authorization-1',
    },
  );
  const rollout = append(
    events,
    'deep_improvement_common.promotion_shadow_started',
    {
      authorizationEventId: authorization.event_id,
      authorizationPayloadDigest: authorization.payload.payloadDigest,
      rolloutRef: 'rollout:shadow-1',
      rolloutDigest: digest('rollout'),
      startedAt: TIMESTAMP,
    },
  );
  append(events, 'deep_improvement_common.promotion_completed', {
    authorizationEventId: authorization.event_id,
    rolloutEventIds: [rollout.event_id],
    evidenceSetDigest: digest('promotion-completion-evidence'),
    completionReceiptRef: 'receipt:promotion-completion-1',
    completedAt: TIMESTAMP,
  });
  const prior = events.at(-1);
  if (prior === undefined) throw new Error('Expected a prior event');
  append(events, 'deep_improvement_common.run_completed', {
    terminalOutcome: 'completed',
    stopReason: 'converged',
    sessionOutcome: 'promoted',
    finalLedgerTailHash: eventHash(prior),
    counts: {
      candidates: 1,
      evaluations: 1,
      observations: 1,
      canaryRuns: 1,
      promotions: 1,
    },
    completionEvidenceRefs: ['evidence:completion-1'],
  });
  expect(started.stream_sequence).toBe(1);
  return events;
}

function projected(
  events: readonly DeepImprovementCommonLedgerEvent[],
): DeepImprovementCommonProjectedResult {
  const result = foldDeepImprovementCommonEvents(events);
  expect(result.outcome).toBe('projected');
  if (result.outcome !== 'projected') {
    throw new Error(`Expected projection: ${result.reasonCodes.join(',')}`);
  }
  return result;
}

function checkpointDigest(
  projection: DeepImprovementCommonProjectionState,
  sourceTailSequence: number,
): string {
  return digest({
    projectionDigest: deepImprovementCommonProjectionIntegrityDigest(projection),
    sourceTailSequence,
  });
}

// ───────────────────────────────────────────────────────────────────
// 2. PURE FOLD AND REPLAY TESTS
// ───────────────────────────────────────────────────────────────────

describe('deep-improvement-common reducers and projections', () => {
  it('produces byte-identical immutable state and fingerprints for equal input', () => {
    const events = happyEvents();
    const first = projected(events);
    const second = projected(events);

    expect(canonicalJson(first.projection)).toBe(canonicalJson(second.projection));
    expect(first.integrityDigest).toBe(second.integrityDigest);
    expect(first.checkpoint.integrityDigest).toBe(
      second.checkpoint.integrityDigest,
    );
    expect(isDeepFrozenProjection(first)).toBe(true);
    expect(DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH).toMatchObject({
      projectionKey: 'common',
    });
    expect(DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH.eventStems).toContain(
      'deep_improvement_common.evaluation_normalized',
    );
  });

  it('matches checkpointed replay to the complete replay oracle', () => {
    const events = happyEvents();
    const first = projected(events.slice(0, 9));
    const incremental = foldDeepImprovementCommonEvents(events.slice(9), {
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

  // ─────────────────────────────────────────────────────────────────
  // 3. NON-VACUOUS FAIL-CLOSED TESTS
  // ─────────────────────────────────────────────────────────────────

  it('blocks sequence gaps and distinct out-of-order events', () => {
    const events = happyEvents();
    const gap = foldDeepImprovementCommonEvents([events[0], events[2]]);
    expect(gap).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['cursor-gap'],
    });

    const duplicateSequence = createEvent(
      'deep_improvement_common.candidate_proposed',
      2,
      {
        proposalRef: 'proposal:candidate-2',
        proposalDigest: digest('proposal-2'),
        mutationOperatorRef: 'operator:bounded-rewrite',
        mutationOperatorVersion: 'bounded-rewrite@1',
        parentCandidateId: null,
        targetRef: 'target:agent-2',
        targetDigest: digest('target-2'),
        proposalPolicyVersion: 'proposal-policy@1',
      },
      events[1],
      { candidateId: 'candidate-2', eventId: 'event-002-conflict' },
    );
    const outOfOrder = foldDeepImprovementCommonEvents([
      events[0],
      events[1],
      duplicateSequence,
    ]);
    expect(outOfOrder).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['event-order-invalid'],
    });
  });

  it('folds a literal exact duplicate idempotently', () => {
    const events = happyEvents();
    const foldedOnce = foldDeepImprovementCommonEvents(events);
    const foldedWithDuplicate = foldDeepImprovementCommonEvents([
      ...events.slice(0, 2),
      events[1],
      ...events.slice(2),
    ]);

    expect(foldedOnce.outcome).toBe('projected');
    expect(foldedWithDuplicate.outcome).toBe('projected');
    if (foldedOnce.outcome !== 'projected'
      || foldedWithDuplicate.outcome !== 'projected') {
      throw new Error('Expected exact-duplicate replay to remain projected');
    }
    expect(canonicalJson(foldedWithDuplicate.projection)).toBe(
      canonicalJson(foldedOnce.projection),
    );
    expect(foldedWithDuplicate.integrityDigest).toBe(
      foldedOnce.integrityDigest,
    );
    expect(foldedWithDuplicate.checkpoint.sourceTailSequence).toBe(
      foldedOnce.checkpoint.sourceTailSequence,
    );
    expect(foldedWithDuplicate.projection.seenEvents).toHaveLength(
      events.length,
    );
    expect(foldedWithDuplicate.projection.cursors).toEqual(
      foldedOnce.projection.cursors,
    );
  });

  it('rejects a phantom proposal source through the real fold', () => {
    const events = happyEvents();
    const phantom = createEvent(
      'deep_improvement_common.candidate_generated',
      3,
      {
        proposalEventId: 'event-never-captured',
        proposalPayloadDigest: digest('phantom-proposal'),
        candidateArtifactRef: 'artifact:candidate-1',
        candidateArtifactDigest: digest('candidate'),
        generationReceiptRef: 'receipt:generation-1',
        mutationOperatorRef: 'operator:bounded-rewrite',
        mutationOperatorVersion: 'bounded-rewrite@1',
      },
      events[1],
    );

    expect(() => foldDeepImprovementCommonEvents([
      events[0],
      events[1],
      phantom,
    ])).toThrowError(expect.objectContaining({
      code: 'referential-integrity',
      field: 'payload.data',
    }));
  });

  it('rejects a checkpoint whose authenticated source tail was forged', () => {
    const events = happyEvents();
    const checkpointed = projected(events.slice(0, 5));
    expect(checkpointed.checkpoint.integrityDigest).toBe(
      checkpointDigest(
        checkpointed.projection,
        checkpointed.checkpoint.sourceTailSequence,
      ),
    );
    const forged = {
      ...checkpointed.checkpoint,
      sourceTailSequence: 500,
    };
    const resumed = foldDeepImprovementCommonEvents([events[5]], {
      checkpoint: forged,
    });

    expect(resumed).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['checkpoint-digest-mismatch'],
    });
  });

  it('rejects authorization after a terminal promotion denial', () => {
    const events = happyEvents().slice(0, 13);
    const promotionProposal = events[12] as DeepImprovementCommonEventEnvelope<
      'deep_improvement_common.promotion_proposed'
    >;
    const denied = append(events, 'deep_improvement_common.promotion_denied', {
      proposalEventId: promotionProposal.event_id,
      proposalPayloadDigest: promotionProposal.payload.payloadDigest,
      externalDecisionRef: 'transition-authorization:decision-denied',
      externalDecisionDigest: digest('denial'),
      denialReasonCode: 'operator-denied',
      decisionReceiptRef: 'receipt:promotion-denial-1',
    });
    const authorization = createEvent(
      'deep_improvement_common.promotion_authorized',
      denied.stream_sequence + 1,
      {
        proposalEventId: promotionProposal.event_id,
        proposalPayloadDigest: promotionProposal.payload.payloadDigest,
        externalAuthorizationRef: 'transition-authorization:late-approval',
        externalAuthorizationDigest: digest('late-approval'),
        authorizationPolicyVersion: 'promotion-authorization@1',
        authorizationReceiptRef: 'receipt:late-approval',
      },
      denied,
    );

    expect(() => foldDeepImprovementCommonEvents([
      ...events,
      authorization,
    ])).toThrowError(expect.objectContaining({
      code: 'impossible-status-transition',
      field: 'iterationConvergence.promotions.stage',
    }));
  });

  it('keeps raw observations separate from derived scores and preserves hard vetoes', () => {
    const events = happyEvents().slice(0, 7);
    const observation = events[5] as DeepImprovementCommonEventEnvelope<
      'deep_improvement_common.evaluation_observation_recorded'
    >;
    const canarySuite = append(
      events,
      'deep_improvement_common.canary_suite_sealed',
      {
        suiteRef: 'canary-suite:sealed-veto',
        suiteDigest: digest('canary-suite-veto'),
        canaryPolicyVersion: 'canary-policy@1',
        fixtureCount: 1,
        protectedMaterialRef: 'protected:canary-veto',
        protectedMaterialDigest: digest('protected-canary-veto'),
      },
    );
    const execution = append(events, 'deep_improvement_common.canary_executed', {
      suiteSealedEventId: canarySuite.event_id,
      suitePayloadDigest: canarySuite.payload.payloadDigest,
      executionReceiptRef: 'receipt:canary-veto-execution',
      canaryObservationRef: 'canary-observation:veto',
      canaryObservationDigest: digest('canary-veto-observation'),
      outcome: 'fail',
    });
    append(events, 'deep_improvement_common.canary_gate_failed', {
      executionEventIds: [execution.event_id],
      failureClasses: ['security-regression'],
      evidenceSetDigest: digest('security-regression-evidence'),
      policyVersion: 'canary-gate@1',
      policyFingerprint: digest('canary-gate-policy'),
      decisionReceiptRef: 'receipt:canary-failed',
    });
    const highScore = append(
      events,
      'deep_improvement_common.evaluation_normalized',
      {
        observationEventIds: [observation.event_id],
        observationSetDigest: digest('observation-set-v2'),
        scorePolicyVersion: 'score-policy@2',
        scorerFingerprint: digest('scorer-v2'),
        scoreWriteBackendRef: DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF,
        scoreVector: scoreVector(1),
        normalizationReceiptRef: 'receipt:normalization-v2',
      },
    );
    const result = projected(events);
    const commonStatus = result.projection.modeStatus.statuses.find(
      (status) => status.workstream === 'deep-improvement-common',
    );

    expect(result.projection.artifactIndex.rawObservations).toHaveLength(1);
    expect(result.projection.artifactIndex.derivedScores).toHaveLength(2);
    expect(result.projection.artifactIndex.rawObservations[0]).not.toHaveProperty(
      'scoreVector',
    );
    expect(result.projection.artifactIndex.derivedScores.at(-1)).toMatchObject({
      producerEventId: highScore.event_id,
      scorePolicyVersion: 'score-policy@2',
      scoreVector: { aggregateScore: 1 },
    });
    expect(commonStatus).toMatchObject({
      state: 'blocked',
      blockingVetoCodes: ['security-regression'],
    });

    const forgedPass = createEvent(
      'deep_improvement_common.canary_gate_passed',
      events.length + 1,
      {
        executionEventIds: [execution.event_id],
        evidenceSetDigest: digest('forged-pass-evidence'),
        policyVersion: 'canary-gate@2',
        policyFingerprint: digest('forged-pass-policy'),
        decisionReceiptRef: 'receipt:forged-pass',
      },
      events.at(-1) ?? null,
    );
    expect(() => foldDeepImprovementCommonEvents([
      ...events,
      forgedPass,
    ])).toThrowError(expect.objectContaining({
      code: 'impossible-status-transition',
      field: 'iterationConvergence.hardVetoes',
    }));
  });

  // ─────────────────────────────────────────────────────────────────
  // 4. COMPLETE LEGACY-VIEW PARITY
  // ─────────────────────────────────────────────────────────────────

  it('matches the complete frozen legacy fixture without subset comparison', () => {
    const legacy = projectDeepImprovementCommonLegacyView(
      projected(happyEvents()).projection,
    );
    const expected = Object.freeze({
      authority: 'shadow-only',
      legacyAuthority: 'unchanged',
      variant: 'agent-improvement',
      runState: 'completed',
      iteration: 1,
      candidateId: 'candidate-1',
      candidateStage: 'verified',
      aggregateScore: 0.91,
      canaryStage: 'passed',
      promotionStage: 'shipped',
      stopReason: 'converged',
      sessionOutcome: 'promoted',
      hardVetoCodes: [],
    });

    expect(legacy).toEqual(expected);
    expect(Object.keys(legacy).sort()).toEqual(Object.keys(expected).sort());
    expect(isDeepFrozenProjection(legacy)).toBe(true);
    expect(() => {
      Object.assign(legacy, { aggregateScore: 0 });
    }).toThrow(TypeError);
  });

  it('derives a closed candidate view without hidden evaluator or evidence fields', () => {
    const view = projectDeepImprovementCommonCandidateView(
      projected(happyEvents()).projection,
    );
    const serialized = canonicalJson(view);

    expect(view).toEqual({
      authority: 'derived-redacted',
      workstream: 'deep-improvement-common',
      runState: 'completed',
      iteration: 1,
      candidateStage: 'verified',
      canaryStage: 'passed',
      promotionStage: 'shipped',
      decisionBand: 'terminal',
    });
    expect(serialized).not.toMatch(
      /digest|evaluator|evidence|fixture|observation|receipt|ref/iu,
    );
    expect(isDeepFrozenProjection(view)).toBe(true);
  });
});
