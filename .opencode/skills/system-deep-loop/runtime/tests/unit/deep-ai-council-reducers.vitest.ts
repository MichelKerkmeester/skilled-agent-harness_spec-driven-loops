// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Reducer Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import type {
  LedgerRecordFrame,
  VerifiedLedgerEvent,
} from '../../lib/authorized-ledger/index.js';
import {
  DeepAiCouncilEventStems,
  createDeepAiCouncilEventRegistry,
  prepareDeepAiCouncilEvent,
} from '../../lib/deep-ai-council-ledger-schema/index.js';
import {
  DEEP_AI_COUNCIL_EVENT_ROUTING,
  DEEP_AI_COUNCIL_REDUCER_SURFACE,
  DeepAiCouncilReducerError,
  createDeepAiCouncilProjectionState,
  deepAiCouncilProjectionIntegrityDigest,
  foldDeepAiCouncilEvents,
  isDeepFrozenProjection,
  projectDeepAiCouncilLegacyView,
  reduceDeepAiCouncilVerifiedEvent,
  verifyDeepAiCouncilReducerSurface,
} from '../../lib/deep-ai-council-reducers/index.js';
import {
  canonicalBytes,
  canonicalJson,
  readEvent,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';

import type {
  DeepAiCouncilEventEnvelope,
  DeepAiCouncilEventStem,
  DeepAiCouncilLedgerEvent,
  DeepAiCouncilPayloadMap,
  DeepAiCouncilReplayMetadata,
  DeepAiCouncilScopeMap,
  IndependenceSnapshot,
  InformationSurface,
  RawScoreVector,
} from '../../lib/deep-ai-council-ledger-schema/index.js';
import type {
  DeepAiCouncilProjectionState,
  DeepAiCouncilReducerSurface,
} from '../../lib/deep-ai-council-reducers/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURE HELPERS
// ───────────────────────────────────────────────────────────────────

const TIMESTAMP = '2026-07-23T10:00:00.000Z';
const RUN_ID = 'run-1';
const ROUND_ID = 'round-1';
const STREAM_ID = 'deep-ai-council-run-1';
const ZERO_DIGEST = '0'.repeat(64);
const registry = createDeepAiCouncilEventRegistry();

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function replayMetadata(label: string): DeepAiCouncilReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest(`replay:${label}`),
    replay_input_digests: { configuration: digest('configuration') },
  };
}

function informationSurface(
  role: InformationSurface['role'],
): InformationSurface {
  const isGenerator = role === 'generator';
  const isOrchestrator = role === 'orchestrator';
  return {
    role,
    capabilityRefs: [`capability-${role}`],
    visibleDigests: [digest(`visible:${role}`)],
    generatorIdentityVisible: isGenerator || isOrchestrator,
    rationaleVisible: isGenerator || isOrchestrator,
    peerScoresVisible: isOrchestrator,
    voteCountsVisible: isOrchestrator,
    independentJudgmentsCommitted: role === 'scorer' || isOrchestrator,
  };
}

function rawScores(): RawScoreVector {
  return { quality: 0.8, feasibility: 0.7, novelty: 0.6, risk: 0.2 };
}

function independence(): IndependenceSnapshot {
  return {
    snapshotRef: 'independence-1',
    inputDigest: digest('independence-input'),
    calibrationRef: 'calibration-1',
    effectiveSeatCount: 2,
    dependenceMeasure: 0.2,
    marginalGain: 0.7,
  };
}

interface EventBuilder {
  readonly events: DeepAiCouncilLedgerEvent[];
  readonly push: <TStem extends DeepAiCouncilEventStem>(
    stem: TStem,
    scope: DeepAiCouncilScopeMap[TStem],
    data: DeepAiCouncilPayloadMap[TStem],
  ) => DeepAiCouncilEventEnvelope<TStem>;
  readonly tailDigest: () => string;
}

function eventBuilder(): EventBuilder {
  const events: DeepAiCouncilLedgerEvent[] = [];
  let tailDigest = ZERO_DIGEST;
  const push = <TStem extends DeepAiCouncilEventStem>(
    stem: TStem,
    scope: DeepAiCouncilScopeMap[TStem],
    data: DeepAiCouncilPayloadMap[TStem],
  ): DeepAiCouncilEventEnvelope<TStem> => {
    const sequence = events.length + 1;
    const prepared = prepareDeepAiCouncilEvent({
      stem,
      scope,
      prevEventHash: tailDigest,
      replay: replayMetadata(`${stem}:${sequence}`),
      data,
      eventId: `event-${String(sequence).padStart(3, '0')}`,
      streamId: STREAM_ID,
      streamSequence: sequence,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'deep-ai-council-reducer-fixture', version: '1' },
      authorityEpoch: 1,
      correlationId: RUN_ID,
      causationId: sequence === 1
        ? null
        : `event-${String(sequence - 1).padStart(3, '0')}`,
      idempotencyKey: `council-${sequence}`,
    }, registry);
    const event = prepared.envelope as DeepAiCouncilEventEnvelope<TStem>;
    events.push(event);
    tailDigest = digest(event);
    return event;
  };
  return { events, push, tailDigest: () => tailDigest };
}

function verifiedEvent(event: DeepAiCouncilLedgerEvent): VerifiedLedgerEvent {
  const read = readEvent(canonicalBytes(event), registry);
  const hash = digest(event.event_id);
  const frame: LedgerRecordFrame = {
    frame_version: 1,
    ledger_id: 'deep-ai-council-shadow',
    sequence: event.stream_sequence,
    prev_record_hash: digest(`previous-frame:${event.stream_sequence}`),
    canonical_event_hash: read.effective.canonicalDigest,
    authorization_ref: {
      audit_ledger_id: 'deep-ai-council-shadow-authorization',
      audit_sequence: event.stream_sequence,
      audit_record_hash: hash,
      decision_id: `decision-${event.stream_sequence}`,
      decision_digest: hash,
      request_digest: hash,
      policy_digest: hash,
      authority_epoch: 1,
    },
    receipt: {
      ledger_id: 'deep-ai-council-shadow',
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

function reverseObjectKeyOrder<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((entry) => reverseObjectKeyOrder(entry)) as T;
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).reverse().map(([key, entry]) => [
        key,
        reverseObjectKeyOrder(entry),
      ]),
    ) as T;
  }
  return value;
}

function proposalData(label: string, evidenceRef: string): DeepAiCouncilPayloadMap<
  'ai_council.proposal_observed'
> {
  const hash = digest(`proposal:${label}`);
  return {
    targetVersion: 'target@1',
    responseStatus: 'returned',
    proposalDigest: hash,
    artifactRef: `proposal-artifact-${label}`,
    artifactDigest: hash,
    rawScores: rawScores(),
    rawConfidence: 0.8,
    usage: {
      receiptRef: `usage-${label}`,
      inputTokens: 100,
      outputTokens: 200,
      costMicros: 300,
    },
    evidenceRefs: [evidenceRef],
    outputSchemaVersion: 'proposal@1',
    observationDigest: hash,
    informationSurface: informationSurface('generator'),
  };
}

function buildMainEvents(): DeepAiCouncilLedgerEvent[] {
  const builder = eventBuilder();
  const base = { runId: RUN_ID, roundId: ROUND_ID };
  builder.push('ai_council.run_initialized', base, {
    target: {
      targetId: 'target-1',
      targetType: 'repository',
      artifactRef: 'target-artifact-1',
      targetVersion: 'target@1',
      contentDigest: digest('target'),
    },
    targetDigest: digest('target'),
    taskClass: 'architecture',
    configDigest: digest('config'),
    strategyDigest: digest('strategy'),
    convergencePolicyDigest: digest('convergence-policy'),
    testGatePolicyDigest: digest('test-gate-policy'),
    maxRounds: 3,
    minSeatCount: 2,
    maxSeatCount: 4,
    planningOnly: true,
    initialReplayFingerprint: digest('initial-replay'),
  });
  builder.push('ai_council.round_started', base, {
    roundNumber: 1,
    executorBoundaryRef: 'executor-boundary-1',
    seatRosterDigest: digest('seat-roster'),
    protocolVersion: 'protocol@1',
    promptPackDigest: digest('prompt-pack'),
    budgetRef: 'budget-1',
    priorRoundRef: null,
    exposurePolicyVersion: 'exposure@1',
    informationSurface: informationSurface('orchestrator'),
  });
  for (const seatNumber of [1, 2]) {
    const seatId = `seat-${seatNumber}`;
    const proposalId = `proposal-${seatNumber}`;
    builder.push('ai_council.seat_selected', { ...base, seatId }, {
      strategyLens: seatNumber === 1 ? 'security' : 'maintainability',
      mandateDigest: digest(`mandate:${seatId}`),
      vantageFingerprint: digest(`vantage:${seatId}`),
      modelFingerprint: digest(`model:${seatId}`),
      independenceGroup: `independence-${seatNumber}`,
      capabilityDigest: digest(`capability:${seatId}`),
      promptDigest: digest(`prompt:${seatId}`),
      selectionUtility: 0.8,
      selectionPolicyVersion: 'seat-selection@1',
    });
    builder.push('ai_council.seat_dispatched', { ...base, seatId }, {
      dispatchReceiptRef: `dispatch-${seatNumber}`,
      logicalBranchRef: `branch-${seatNumber}`,
      attempt: 1,
      budgetLeaseRef: `lease-${seatNumber}`,
      capabilityDigest: digest(`capability:${seatId}`),
      promptDigest: digest(`prompt:${seatId}`),
      informationSurface: informationSurface('generator'),
    });
    builder.push(
      'ai_council.proposal_observed',
      { ...base, seatId, proposalId },
      proposalData(String(seatNumber), `evidence-${seatNumber}`),
    );
  }
  builder.push('ai_council.critique_round_started', {
    ...base,
    seatId: 'seat-2',
    critiqueRoundId: 'critique-1',
  }, {
    sourceProposalIds: ['proposal-1', 'proposal-2'],
    visibleInformationPolicyVersion: 'critique@1',
    inputDigest: digest('critique-input'),
    informationSurface: informationSurface('detector'),
  });
  builder.push('ai_council.critique_recorded', {
    ...base,
    seatId: 'seat-2',
    critiqueRoundId: 'critique-1',
  }, {
    sourceProposalIds: ['proposal-1'],
    critiqueArtifactRef: 'critique-artifact-1',
    critiqueArtifactDigest: digest('critique-artifact'),
    referencedClaimRefs: ['claim-1'],
    rawSeverity: 0.6,
    rawConfidence: 0.8,
    challengeDisposition: 'contested',
    causalProposalRefs: ['proposal-1'],
    informationSurface: informationSurface('detector'),
  });
  for (const candidateNumber of [1, 2]) {
    builder.push('ai_council.candidate_blinded', {
      ...base,
      candidateId: `candidate-${candidateNumber}`,
    }, {
      sourceProposalIds: [`proposal-${candidateNumber}`],
      candidateAliasDigest: digest(`alias:${candidateNumber}`),
      shuffleSeedDigest: digest(`shuffle:${candidateNumber}`),
      visibleCandidateDigest: digest(`visible:${candidateNumber}`),
      artifactRef: `candidate-artifact-${candidateNumber}`,
      artifactDigest: digest(`candidate-artifact:${candidateNumber}`),
      targetVersion: 'target@1',
      redactionPolicyVersion: 'redaction@1',
      informationSurface: informationSurface('scorer'),
    });
  }
  for (const judgmentNumber of [1, 2]) {
    builder.push('ai_council.pairwise_judgment_recorded', {
      ...base,
      judgmentId: `judgment-${judgmentNumber}`,
    }, {
      candidateAId: 'candidate-1',
      candidateBId: 'candidate-2',
      orderToken: judgmentNumber === 1 ? 'a-first' : 'b-first',
      judgeProfileFingerprint: digest(`judge:${judgmentNumber}`),
      rawPreference: { candidateA: 0.7, candidateB: 0.2, abstain: 0.1 },
      rawConfidence: 0.8,
      judgmentStatus: 'consistent',
      inputDigest: digest(`judgment-input:${judgmentNumber}`),
      calibrationRef: `calibration-${judgmentNumber}`,
      informationSurface: informationSurface('scorer'),
      supersedesJudgmentId: null,
    });
  }
  builder.push('ai_council.adjudication_decision', base, {
    candidateSetDigest: digest('candidate-set'),
    protocolVersion: 'adjudication@1',
    rubricVersion: 'rubric@1',
    rawScores: rawScores(),
    calibratedScores: rawScores(),
    supportMass: 0.7,
    oppositionMass: 0.3,
    independence: independence(),
    minorityRefs: ['minority-1'],
    contradictionRefs: [],
    vetoFindingRefs: [],
    disposition: 'selected',
    selectedCandidateId: 'candidate-1',
    evaluatorReceiptRef: 'evaluator-1',
    sourceJudgmentIds: ['judgment-1', 'judgment-2'],
  });
  builder.push('ai_council.stance_recorded', {
    ...base,
    candidateId: 'candidate-1',
    seatId: 'seat-1',
  }, {
    candidateOrPlanRef: 'candidate-1',
    priorStanceEventId: null,
    currentStance: 'support',
    rawRationaleDigest: digest('stance'),
    evidenceRef: 'evidence-1',
    influenceObservationDigest: digest('influence'),
  });
  const deliberation = builder.push('ai_council.deliberation_synthesized', base, {
    inputEventRange: {
      firstEventId: 'event-001',
      lastEventId: `event-${String(builder.events.length).padStart(3, '0')}`,
    },
    candidateSetDigest: digest('candidate-set'),
    planDisposition: 'selected',
    selectedPlanDigest: digest('selected-plan'),
    disagreementRefs: [],
    minorityRefs: ['minority-1'],
    synthesisPolicyFingerprint: digest('synthesis-policy'),
    evaluatorFingerprint: digest('synthesis-evaluator'),
    reportDraftRef: 'report-draft-1',
    synthesisReceiptRef: 'synthesis-1',
  });
  const convergence = builder.push('ai_council.convergence_evaluated', base, {
    decision: 'converged',
    rawAgreement: 0.95,
    rawStability: 0.9,
    calibratedSupport: 0.8,
    effectiveSeatCount: 2,
    independence: independence(),
    judgeProfileRefs: ['judge-1', 'judge-2'],
    qualityWitnessRefs: ['quality-1'],
    invarianceWitnessRefs: ['invariance-1'],
    minorityRefs: ['minority-1'],
    contradictionRefs: [],
    vetoFindingRefs: [],
    requiredGateResultRefs: ['required-gate-1'],
    budgetStateRef: 'budget-state-1',
    coverageStateRef: 'coverage-state-1',
    blockerIds: [],
    recoveryOrEscalationReason: null,
  });
  builder.push('ai_council.artifact_committed', {
    ...base,
    artifactId: 'artifact-manifest-1',
  }, {
    artifactKind: 'council-manifest',
    safeRelativePath: 'ai-council/manifest.json',
    schemaVersion: 'manifest@1',
    byteDigest: digest('manifest-bytes'),
    contentDigest: digest('manifest-content'),
    requiredSectionResults: [{
      sectionId: 'recommendation',
      status: 'pass',
      evidenceDigest: digest('recommendation-section'),
    }],
    sourceEventRange: {
      firstEventId: 'event-001',
      lastEventId: convergence.event_id,
    },
    supersedesArtifactId: null,
    rollbackRef: null,
  });
  const gate = builder.push('ai_council.council_test_gate_evaluated', {
    ...base,
    gateId: 'gate-1',
  }, {
    testSuiteDigest: digest('test-suite'),
    fixtureManifestDigest: digest('fixture-manifest'),
    baselineFingerprint: digest('baseline'),
    candidateFingerprint: digest('candidate'),
    requiredCheckResults: [{
      checkId: 'required-sections',
      status: 'pass',
      resultDigest: digest('required-sections'),
    }],
    criticalFailureRefs: [],
    metamorphicCheckDigest: digest('metamorphic'),
    biasCheckDigest: digest('bias'),
    artifactCompleteness: 'complete',
    verdict: 'pass',
    gateReceiptRef: 'gate-receipt-1',
    informationSurface: informationSurface('test-gate'),
  });
  const finalTailDigest = builder.tailDigest();
  builder.push('ai_council.council_complete', base, {
    terminalStatus: 'completed',
    convergenceEventId: convergence.event_id,
    finalDeliberationEventId: deliberation.event_id,
    artifactManifestRef: 'artifact-manifest-1',
    councilTestGateEventId: gate.event_id,
    finalLedgerTailDigest: finalTailDigest,
    counts: { rounds: 1, seats: 2, proposals: 2, judgments: 2 },
    recommendationOrUserDecisionRef: 'recommendation-1',
    terminalReason: 'eligible-convergence-and-gate-pass',
  });
  return builder.events;
}

function projected(events: readonly DeepAiCouncilLedgerEvent[]) {
  const result = foldDeepAiCouncilEvents(events);
  expect(result.outcome).toBe('projected');
  if (result.outcome !== 'projected') throw new Error('Expected projected fixture');
  return result;
}

// ───────────────────────────────────────────────────────────────────
// 2. PURE-FOLD AND ANTI-VACUOUS TESTS
// ───────────────────────────────────────────────────────────────────

describe('deep-ai-council reducers and projections', () => {
  it('routes every landed event stem to an owned projection plane', () => {
    expect(Object.keys(DEEP_AI_COUNCIL_EVENT_ROUTING).sort()).toEqual(
      [...DeepAiCouncilEventStems].sort(),
    );
  });

  it('replays identical ordered events to identical frozen projections and fingerprints', () => {
    const events = buildMainEvents();
    const first = projected(events);
    const second = projected(events);

    expect(canonicalJson(first.projection)).toBe(canonicalJson(second.projection));
    expect(first.integrityDigest).toBe(second.integrityDigest);
    expect(isDeepFrozenProjection(first.projection)).toBe(true);
    expect(first.projection.status).toMatchObject({
      state: 'complete',
      terminal: true,
      modeGate: 'off',
    });
  });

  it('replays key-reordered event objects to byte-identical projections and fingerprints', () => {
    const events = buildMainEvents();
    const forward = projected(events);
    const reordered = projected(events.map((event) => reverseObjectKeyOrder(event)));

    expect(canonicalJson(reordered.projection)).toBe(canonicalJson(forward.projection));
    expect(reordered.integrityDigest).toBe(forward.integrityDigest);
  });

  it('matches verified-event reducers to the fold oracle for the same ordered events', () => {
    const events = buildMainEvents();
    const oracle = projected(events);
    type ModeState = ReturnType<typeof reduceDeepAiCouncilVerifiedEvent>['state'];
    let exportedState = createDeepAiCouncilProjectionState() as ModeState;
    let surfaceState = createDeepAiCouncilProjectionState() as ModeState;

    for (const event of events) {
      const verified = verifiedEvent(event);
      const exported = reduceDeepAiCouncilVerifiedEvent(verified, exportedState);
      const declared = DEEP_AI_COUNCIL_REDUCER_SURFACE.reduce(verified, surfaceState);

      expect(exported.appliedEventId).toBe(event.event_id);
      expect(declared.appliedEventId).toBe(event.event_id);
      exportedState = exported.state;
      surfaceState = declared.state;
    }

    expect(canonicalJson(exportedState)).toBe(canonicalJson(oracle.projection));
    expect(canonicalJson(surfaceState)).toBe(canonicalJson(oracle.projection));
    expect(deepAiCouncilProjectionIntegrityDigest(
      exportedState as DeepAiCouncilProjectionState,
    )).toBe(oracle.integrityDigest);
    expect(deepAiCouncilProjectionIntegrityDigest(
      surfaceState as DeepAiCouncilProjectionState,
    )).toBe(oracle.integrityDigest);
  });

  it('validates the declared reducer surface and rejects incomplete ownership', () => {
    const event = buildMainEvents()[0];
    const verified = verifiedEvent(event);
    const initial = createDeepAiCouncilProjectionState();

    expect(() => verifyDeepAiCouncilReducerSurface(
      DEEP_AI_COUNCIL_REDUCER_SURFACE,
      verified,
      initial,
    )).not.toThrow();

    const incompleteSurface: DeepAiCouncilReducerSurface = {
      reducers: {
        ...DEEP_AI_COUNCIL_REDUCER_SURFACE.reducers,
        persistedFields: DEEP_AI_COUNCIL_REDUCER_SURFACE.reducers.persistedFields.slice(1),
      },
      reduce: DEEP_AI_COUNCIL_REDUCER_SURFACE.reduce,
    };
    expect(() => verifyDeepAiCouncilReducerSurface(
      incompleteSurface,
      verified,
      initial,
    )).toThrowError(expect.objectContaining({ code: 'projection-field-undeclared' }));
  });

  it('fails closed on a sequence gap and on out-of-order input', () => {
    const events = buildMainEvents();
    const gap = foldDeepAiCouncilEvents([events[0], events[2]]);
    const outOfOrder = foldDeepAiCouncilEvents([events[0], events[2], events[1]]);

    expect(gap).toEqual({ outcome: 'rebuild_required', reasonCodes: ['cursor-gap'] });
    expect(outOfOrder).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['event-order-invalid'],
    });
  });

  it('treats an exact duplicate as idempotent without accepting sequence conflicts', () => {
    const events = buildMainEvents();
    const result = projected([events[0], events[0], ...events.slice(1)]);

    expect(result.projection.seenEvents).toHaveLength(events.length);
    expect(result.projection.status.state).toBe('complete');
  });

  it('rejects critique evidence whose source proposal was never captured', () => {
    const builder = eventBuilder();
    const base = { runId: RUN_ID, roundId: ROUND_ID };
    builder.push('ai_council.run_initialized', base, {
      target: {
        targetId: 'target-1',
        targetType: 'repository',
        artifactRef: 'target-1',
        targetVersion: 'target@1',
        contentDigest: digest('target'),
      },
      targetDigest: digest('target'),
      taskClass: 'architecture',
      configDigest: digest('config'),
      strategyDigest: digest('strategy'),
      convergencePolicyDigest: digest('convergence'),
      testGatePolicyDigest: digest('gate'),
      maxRounds: 2,
      minSeatCount: 2,
      maxSeatCount: 3,
      planningOnly: true,
      initialReplayFingerprint: digest('replay'),
    });
    builder.push('ai_council.round_started', base, {
      roundNumber: 1,
      executorBoundaryRef: 'executor-1',
      seatRosterDigest: digest('roster'),
      protocolVersion: 'protocol@1',
      promptPackDigest: digest('prompt'),
      budgetRef: 'budget-1',
      priorRoundRef: null,
      exposurePolicyVersion: 'exposure@1',
      informationSurface: informationSurface('orchestrator'),
    });
    builder.push('ai_council.critique_round_started', {
      ...base,
      seatId: 'seat-1',
      critiqueRoundId: 'critique-1',
    }, {
      sourceProposalIds: ['proposal-never-captured'],
      visibleInformationPolicyVersion: 'critique@1',
      inputDigest: digest('critique'),
      informationSurface: informationSurface('detector'),
    });

    expect(() => foldDeepAiCouncilEvents(builder.events)).toThrowError(
      expect.objectContaining({
        code: 'phantom-source-reference',
        field: 'critique.rounds.sourceProposalIds',
      }),
    );
  });

  it('rejects a forged checkpoint tail bound to a different sequence', () => {
    const events = buildMainEvents();
    const checkpointed = projected(events.slice(0, 6));
    const forged = {
      ...checkpointed.checkpoint,
      sourceTailSequence: checkpointed.checkpoint.sourceTailSequence + 100,
    };
    const result = foldDeepAiCouncilEvents([], { checkpoint: forged });

    expect(result).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['checkpoint-digest-mismatch'],
    });
  });

  it('rejects a digest-consistent checkpoint with contradictory terminal status', () => {
    const initial = createDeepAiCouncilProjectionState();
    const projection = {
      ...initial,
      status: {
        ...initial.status,
        state: 'complete' as const,
        terminal: true,
      },
    };
    const sourceTailSequence = 0;
    const sourceTailDigest = ZERO_DIGEST;
    const checkpoint = {
      projection,
      sourceTailSequence,
      sourceTailDigest,
      integrityDigest: digest({
        projectionDigest: deepAiCouncilProjectionIntegrityDigest(projection),
        sourceTailSequence,
        sourceTailDigest,
      }),
    };

    expect(() => foldDeepAiCouncilEvents([], { checkpoint })).toThrowError(
      expect.objectContaining({
        code: 'impossible-status-transition',
        field: 'status',
      }),
    );
  });

  it('rejects an impossible lifecycle jump through the real fold', () => {
    const events = buildMainEvents();
    const impossibleGate = events.find(
      (event) => event.payload.stem === 'ai_council.council_test_gate_evaluated',
    );
    if (impossibleGate === undefined) throw new Error('Missing gate fixture');
    const builder = eventBuilder();
    builder.push(
      'ai_council.run_initialized',
      events[0].payload.scope,
      events[0].payload.data,
    );
    builder.push(
      'ai_council.council_test_gate_evaluated',
      impossibleGate.payload.scope,
      impossibleGate.payload.data,
    );

    expect(() => foldDeepAiCouncilEvents(builder.events)).toThrowError(
      expect.objectContaining({
        code: 'impossible-status-transition',
        field: 'status.provenance',
      }),
    );
  });

  it('rejects a terminal event whose ledger tail digest is forged', () => {
    const events = buildMainEvents();
    const terminal = events.at(-1) as DeepAiCouncilEventEnvelope<
      'ai_council.council_complete'
    >;
    const prefix = events.slice(0, -1);
    const builder = eventBuilder();
    for (const event of prefix) {
      builder.push(event.payload.stem, event.payload.scope, event.payload.data);
    }
    builder.push('ai_council.council_complete', terminal.payload.scope, {
      ...terminal.payload.data,
      finalLedgerTailDigest: digest('forged-tail'),
    });

    expect(() => foldDeepAiCouncilEvents(builder.events)).toThrowError(
      expect.objectContaining({
        code: 'tail-integrity-mismatch',
        field: 'status.finalLedgerTailDigest',
      }),
    );
  });

  it('rejects terminal references that point at the wrong predecessor family', () => {
    const events = buildMainEvents();
    const terminal = events.at(-1) as DeepAiCouncilEventEnvelope<
      'ai_council.council_complete'
    >;
    const deliberation = events.find(
      (event) => event.payload.stem === 'ai_council.deliberation_synthesized',
    );
    if (deliberation === undefined) throw new Error('Missing deliberation fixture');
    const builder = eventBuilder();
    for (const event of events.slice(0, -1)) {
      builder.push(event.payload.stem, event.payload.scope, event.payload.data);
    }
    builder.push('ai_council.council_complete', terminal.payload.scope, {
      ...terminal.payload.data,
      convergenceEventId: deliberation.event_id,
      finalLedgerTailDigest: builder.tailDigest(),
    });

    expect(() => foldDeepAiCouncilEvents(builder.events)).toThrowError(
      expect.objectContaining({
        code: 'phantom-source-reference',
        field: 'status.convergenceEventId',
      }),
    );
  });

  it('preserves role blinding and proposal/adjudication separation', () => {
    const result = projected(buildMainEvents());
    const serializedJudgments = canonicalJson(result.projection.blindedAdjudication);

    expect(result.projection.councilSeats.proposals).toHaveLength(2);
    expect(result.projection.blindedAdjudication.judgments).toHaveLength(2);
    expect(serializedJudgments).not.toContain('"seatId"');
    expect(serializedJudgments).not.toContain('"modelFingerprint"');
    expect(result.projection.convergence.presentation).toMatchObject({
      kind: 'blinded-plan-posterior',
      selectedCandidateId: 'candidate-1',
      minorityRefs: ['minority-1'],
    });
  });

  it('matches the complete frozen legacy view fixture without subset comparison', () => {
    const result = projected(buildMainEvents());
    const legacy = projectDeepAiCouncilLegacyView(result.projection);
    const frozenFixture = Object.freeze({
      authority: 'shadow-only',
      legacyAuthority: 'unchanged',
      roundId: 'round-1',
      status: 'complete',
      seatCount: 2,
      proposalCount: 2,
      selectedCandidateId: 'candidate-1',
      convergenceOutcome: 'converged',
      artifactIds: Object.freeze(['artifact-manifest-1']),
      gateVerdict: 'pass',
      terminal: true,
      lossyFields: Object.freeze([
        'private-seat-evidence',
        'raw-critique-signals',
        'raw-pairwise-ballots',
        'stance-lineage',
        'minority-and-veto-lineage',
      ]),
    });

    expect(canonicalJson(legacy)).toBe(canonicalJson(frozenFixture));
    expect(isDeepFrozenProjection(legacy)).toBe(true);
  });

  it('keeps hard vetoes separate from scalar support and blocks convergence', () => {
    const events = buildMainEvents();
    const convergenceIndex = events.findIndex(
      (event) => event.payload.stem === 'ai_council.convergence_evaluated',
    );
    const original = events[convergenceIndex] as DeepAiCouncilEventEnvelope<
      'ai_council.convergence_evaluated'
    >;
    const builder = eventBuilder();
    for (const event of events.slice(0, convergenceIndex)) {
      builder.push(event.payload.stem, event.payload.scope, event.payload.data);
    }
    builder.push('ai_council.convergence_evaluated', original.payload.scope, {
      ...original.payload.data,
      rawAgreement: 1,
      calibratedSupport: 1,
      vetoFindingRefs: ['hard-security-veto'],
    });
    const result = projected(builder.events);

    expect(result.projection.convergence).toMatchObject({
      eligible: false,
      outcome: 'blocked',
      hardVetoRefs: ['hard-security-veto'],
      rawAgreement: 1,
      calibratedSupport: 1,
    });
  });

  it('exposes typed reducer errors for mechanism-specific negative assertions', () => {
    expect(DeepAiCouncilReducerError.prototype).toBeInstanceOf(Error);
  });
});
