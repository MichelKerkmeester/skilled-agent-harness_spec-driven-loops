// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Reducer Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import type {
  LedgerRecordFrame,
  VerifiedLedgerEvent,
} from '../../lib/authorized-ledger/index.js';
import {
  DeepResearchEventStems,
  createDeepResearchEventRegistry,
  prepareDeepResearchEvent,
} from '../../lib/deep-research-ledger-schema/index.js';
import {
  DEEP_RESEARCH_EVENT_ROUTING,
  DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
  DEEP_RESEARCH_REDUCER_ID,
  DEEP_RESEARCH_REDUCER_SET,
  DEEP_RESEARCH_REDUCER_SURFACE,
  DeepResearchReducerError,
  assertDeepResearchProjectionState,
  createDeepResearchProjectionState,
  deepResearchProjectionIntegrityDigest,
  foldDeepResearchEvents,
  immutableProjectionClone,
  isDeepFrozenProjection,
  projectDeepResearchLegacyView,
  verifyDeepResearchReducerSurface,
} from '../../lib/deep-research-reducers/index.js';
import {
  canonicalBytes,
  canonicalJson,
  readEvent,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';

import type {
  DeepResearchEventEnvelope,
  DeepResearchEventStem,
  DeepResearchLedgerEvent,
  DeepResearchPayloadMap,
  DeepResearchReplayMetadata,
  DeepResearchScopeMap,
} from '../../lib/deep-research-ledger-schema/index.js';
import type {
  DeepResearchProjectionState,
  DeepResearchReducerSurface,
} from '../../lib/deep-research-reducers/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURE HELPERS
// ───────────────────────────────────────────────────────────────────

const TIMESTAMP = '2026-07-21T10:00:00.000Z';
const RUN_ID = 'run-1';
const LINEAGE_ID = 'lineage-1';
const STREAM_ID = 'deep-research-run-1';
const registry = createDeepResearchEventRegistry();

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function checkpointDigest(
  projection: DeepResearchProjectionState,
  sourceTailSequence: number,
): string {
  return digest({
    projectionDigest: deepResearchProjectionIntegrityDigest(projection),
    sourceTailSequence,
  });
}

function replayMetadata(): DeepResearchReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest('replay'),
    replay_input_digests: { configuration: digest('configuration') },
  };
}

function scoreVector(): DeepResearchPayloadMap<'deep_research.branch_planned'>[
  'expectedYieldScoreVector'
] {
  return {
    expectedYield: 0.8,
    contradictionRisk: 0.2,
    impact: 0.7,
    independenceGain: 0.6,
    staleness: 0.1,
    expectedCost: 0.3,
  };
}

function createEvent<TStem extends DeepResearchEventStem>(
  stem: TStem,
  sequence: number,
  scope: DeepResearchScopeMap[TStem],
  data: DeepResearchPayloadMap[TStem],
  identity: {
    readonly eventId?: string;
    readonly streamId?: string;
  } = {},
): DeepResearchEventEnvelope<TStem> {
  const prepared = prepareDeepResearchEvent({
    stem,
    scope,
    prevEventHash: digest(`previous:${sequence}`),
    replay: replayMetadata(),
    data,
    eventId: identity.eventId ?? `event-${String(sequence).padStart(3, '0')}`,
    streamId: identity.streamId ?? STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-research-fixture', version: '1' },
    authorityEpoch: 1,
    correlationId: 'correlation-1',
    causationId: sequence === 1 ? null : `event-${String(sequence - 1).padStart(3, '0')}`,
    idempotencyKey: `idempotency-${sequence}`,
  }, registry);
  return prepared.envelope as DeepResearchEventEnvelope<TStem>;
}

function baseScope(): DeepResearchScopeMap<'deep_research.run_initialized'> {
  return { runId: RUN_ID, lineageId: LINEAGE_ID };
}

function iterationScope(iteration = 1): DeepResearchScopeMap<'deep_research.iteration_started'> {
  return { ...baseScope(), iteration };
}

function mainEvents(): DeepResearchLedgerEvent[] {
  const hash = digest('fixture');
  const passage = { locatorDigest: hash, selector: 'paragraph:4', passageDigest: hash };
  return [
    createEvent('deep_research.run_initialized', 1, baseScope(), {
      generation: 1,
      charterDigest: hash,
      configDigest: hash,
      executorFingerprint: hash,
      replayFingerprint: hash,
      maxIterations: 10,
      convergencePolicyVersion: 'convergence@1',
    }),
    createEvent('deep_research.question_registered', 2, {
      ...baseScope(), questionId: 'question-1',
    }, {
      normalizedQuestionDigest: hash,
      dependencyQuestionIds: [],
      requiredSourceClasses: ['primary'],
      disconfirmingQueryRecipeIds: ['query-recipe-1'],
      budgetRef: 'budget-1',
    }),
    createEvent('deep_research.branch_planned', 3, {
      ...baseScope(), questionId: 'question-1', branchId: 'branch-1',
    }, {
      semanticClusterId: 'cluster-1',
      expectedYieldScoreVector: scoreVector(),
      contradictionRisk: 0.2,
      impact: 0.7,
      independenceGain: 0.6,
      staleness: 0.1,
      expectedCost: 0.3,
      tieBreakKey: 'tie-1',
      reservationRef: 'reservation-1',
    }),
    createEvent('deep_research.branch_selected', 4, {
      ...baseScope(), questionId: 'question-1', branchId: 'branch-1',
    }, {
      semanticClusterId: 'cluster-1',
      expectedYieldScoreVector: scoreVector(),
      contradictionRisk: 0.2,
      impact: 0.7,
      independenceGain: 0.6,
      staleness: 0.1,
      expectedCost: 0.3,
      tieBreakKey: 'tie-1',
      reservationRef: 'reservation-1',
    }),
    createEvent('deep_research.iteration_started', 5, iterationScope(), {
      focusRef: 'focus-1',
      stateTailDigest: hash,
      strategyDigest: hash,
      status: 'started',
    }),
    createEvent('deep_research.source_captured', 6, {
      ...iterationScope(), sourceVersionId: 'source-version-1',
    }, {
      sourceIdentityDigest: hash,
      locator: {
        scheme: 'url',
        locatorDigest: hash,
        selector: 'https://example.test/source',
        revision: 'revision-1',
      },
      capturedAt: TIMESTAMP,
      contentDigest: digest('source-content'),
      mediaType: 'text/html',
      retrievalReceiptRef: 'retrieval-1',
      parentSourceVersionId: null,
      instructionScanResult: 'clean',
    }),
    createEvent('deep_research.evidence_admission_decided', 7, {
      ...iterationScope(),
      sourceVersionId: 'source-version-1',
      evidenceId: 'evidence-1',
    }, {
      disposition: 'admit',
      passageLocators: [passage],
      atomicClaimRefs: ['claim-1'],
      derivativeSourceGroup: 'independent-1',
      admissionPolicyVersion: 'admission@1',
      contaminationStatus: 'clean',
      reasonCode: 'independent-primary',
    }),
    createEvent('deep_research.claim_asserted', 8, {
      ...iterationScope(), claimVersionId: 'claim-version-1',
    }, {
      claimId: 'claim-1',
      normalizedClaimDigest: digest('claim-1'),
      evidenceIds: ['evidence-1'],
      independenceGroup: 'independent-1',
      rawConfidence: 0.8,
      claimStatus: 'supported',
    }),
    createEvent('deep_research.claim_relation_recorded', 9, {
      ...iterationScope(), claimVersionId: 'claim-version-2',
    }, {
      claimId: 'claim-1',
      relatedClaimVersionId: 'claim-version-1',
      evidenceIds: ['evidence-1'],
      relation: 'contradicts',
      independenceGroup: 'independent-2',
      rawConfidence: 0.6,
      claimStatus: 'supported',
    }),
    createEvent('deep_research.claim_superseded', 10, {
      ...iterationScope(), claimVersionId: 'claim-version-2',
    }, {
      priorClaimVersionId: 'claim-version-1',
      successorClaimVersionId: 'claim-version-2',
      supersessionReason: 'New admitted evidence changes the active claim version.',
      effectiveAt: TIMESTAMP,
      replacementEvidenceIds: ['evidence-1'],
      invalidationScope: 'claim-version',
    }),
    createEvent('deep_research.next_focus_selected', 11, iterationScope(), {
      obligationId: 'obligation-1',
      selectionScoreVector: scoreVector(),
      visitCooldown: 1,
      policyVersion: 'next-focus@1',
      chosenBranchId: 'branch-1',
      chosenQuestionId: null,
    }),
    createEvent('deep_research.iteration_completed', 12, iterationScope(), {
      status: 'complete',
      rawNewInfoRatio: 0.9,
      trustedEvidenceYield: 0.3,
      outputDigest: digest('iteration-output'),
      ruledOutApproachRefs: ['approach-1'],
      nextFocusCausationId: 'event-011',
    }),
    createEvent('deep_research.convergence_evaluated', 13, iterationScope(), {
      decision: 'converged',
      rawSignals: {
        newInfoRatio: 0.9,
        contradictionRisk: 0.2,
        citationDrift: 0.1,
        observationDigest: digest('raw-observation'),
      },
      trustedSignals: {
        evidenceYield: 0.3,
        independentSourceRatio: 0.8,
        supportedClaimRatio: 0.7,
        assessmentDigest: digest('trusted-assessment'),
      },
      qualityGateResults: {
        sourceDiversity: 'pass',
        contradictionResolution: 'pass',
        citationIntegrity: 'pass',
        policyVersion: 'quality@1',
        resultDigest: digest('quality-gates'),
      },
      blockerIds: [],
      policyFingerprint: digest('policy'),
      evaluatorFingerprint: digest('evaluator'),
      evidenceTailHash: digest('evidence-tail'),
      incompleteReason: null,
      recoveryReason: null,
    }),
    createEvent('deep_research.synthesis_started', 14, baseScope(), {
      admittedLedgerRevision: 'ledger-revision-1',
      selectedClaimVersionSetDigest: digest('claim-set'),
      synthesisPolicyDigest: digest('synthesis-policy'),
      reportRevision: 'report-revision-1',
      unresolvedClaimIds: [],
      contestedClaimIds: ['claim-1'],
    }),
    createEvent('deep_research.synthesis_committed', 15, baseScope(), {
      admittedLedgerRevision: 'ledger-revision-1',
      selectedClaimVersionSetDigest: digest('claim-set'),
      synthesisPolicyDigest: digest('synthesis-policy'),
      reportRevision: 'report-revision-1',
      unresolvedClaimIds: [],
      contestedClaimIds: ['claim-1'],
      reportDigest: digest('research-report'),
      citationEventIds: ['event-007'],
      synthesisReceiptRef: 'synthesis-receipt-1',
    }),
    createEvent('deep_research.memory_save_requested', 16, baseScope(), {
      targetPacket: 'packet-1',
      continuityPayloadDigest: digest('continuity-payload'),
      route: 'continuity',
      mergeMode: 'upsert',
      sourceEventRange: { firstEventId: 'event-001', lastEventId: 'event-015' },
    }),
    createEvent('deep_research.memory_save_completed', 17, baseScope(), {
      targetPacket: 'packet-1',
      continuityPayloadDigest: digest('continuity-payload'),
      route: 'continuity',
      mergeMode: 'upsert',
      sourceEventRange: { firstEventId: 'event-001', lastEventId: 'event-015' },
      persistenceReceiptRefs: ['persistence-1'],
      continuityFingerprint: digest('continuity-fingerprint'),
    }),
    createEvent('deep_research.run_completed', 18, baseScope(), {
      terminalStatus: 'completed',
      convergenceEventId: 'event-013',
      synthesisEventId: 'event-015',
      memorySaveEventId: 'event-017',
      finalLedgerTailHash: digest('ledger-tail'),
      counts: { iterations: 1, sources: 1, admittedEvidence: 1, claims: 2 },
      completionReason: 'All typed convergence and persistence evidence is present.',
      incompleteReason: null,
    }),
  ];
}

function verifiedEvent(event: DeepResearchLedgerEvent): VerifiedLedgerEvent {
  const read = readEvent(canonicalBytes(event), registry);
  const hash = digest(event.event_id);
  const frame: LedgerRecordFrame = {
    frame_version: 1,
    ledger_id: 'deep-research-shadow',
    sequence: event.stream_sequence,
    prev_record_hash: digest(`previous-frame:${event.stream_sequence}`),
    canonical_event_hash: read.effective.canonicalDigest,
    authorization_ref: {
      audit_ledger_id: 'deep-research-shadow-authorization',
      audit_sequence: event.stream_sequence,
      audit_record_hash: hash,
      decision_id: `decision-${event.stream_sequence}`,
      decision_digest: hash,
      request_digest: hash,
      policy_digest: hash,
      authority_epoch: 1,
    },
    receipt: {
      ledger_id: 'deep-research-shadow',
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

function projected(events: readonly DeepResearchLedgerEvent[]) {
  const result = foldDeepResearchEvents(events);
  expect(result.outcome).toBe('projected');
  if (result.outcome !== 'projected') throw new Error('Expected projected fixture result');
  return result;
}

function quarantinedPrefix(): DeepResearchLedgerEvent[] {
  const events = mainEvents();
  const cleanSource = events[5] as DeepResearchEventEnvelope<
    'deep_research.source_captured'
  >;
  const flaggedSource = createEvent(
    'deep_research.source_captured',
    6,
    cleanSource.payload.scope,
    { ...cleanSource.payload.data, instructionScanResult: 'flagged' },
  );
  return [...events.slice(0, 5), flaggedSource];
}

function completionEvent(
  terminalStatus: DeepResearchPayloadMap<'deep_research.run_completed'>['terminalStatus'],
): DeepResearchEventEnvelope<'deep_research.run_completed'> {
  return createEvent('deep_research.run_completed', 18, baseScope(), {
    terminalStatus,
    convergenceEventId: 'event-013',
    synthesisEventId: 'event-015',
    memorySaveEventId: 'event-017',
    finalLedgerTailHash: digest(`ledger-tail-${terminalStatus}`),
    counts: { iterations: 1, sources: 1, admittedEvidence: 1, claims: 2 },
    completionReason: terminalStatus === 'incomplete'
      ? null
      : `The run completed with ${terminalStatus} status.`,
    incompleteReason: terminalStatus === 'incomplete'
      ? 'The run stopped before satisfying all completion requirements.'
      : null,
  });
}

// ───────────────────────────────────────────────────────────────────
// 2. DETERMINISM AND PROJECTION TESTS
// ───────────────────────────────────────────────────────────────────

describe('deep-research reducers and projections', () => {
  it('routes every real typed-ledger stem into a declared projection plane', () => {
    expect(Object.keys(DEEP_RESEARCH_EVENT_ROUTING).sort()).toEqual(
      [...DeepResearchEventStems].sort(),
    );
    expect(DEEP_RESEARCH_REDUCER_SET.persistedFields).toHaveLength(13);
    expect(new Set(DEEP_RESEARCH_REDUCER_SET.persistedFields).size).toBe(13);
  });

  it('replays reordered input to byte-identical projections and integrity digests', () => {
    const events = mainEvents();
    const forward = projected(events);
    const reordered = projected([
      ...events.filter((_, index) => index % 2 === 1).reverse(),
      ...events.filter((_, index) => index % 2 === 0).reverse(),
    ]);

    expect(canonicalJson(reordered.projection)).toBe(canonicalJson(forward.projection));
    expect(reordered.integrityDigest).toBe(forward.integrityDigest);
    expect(isDeepFrozenProjection(forward.projection)).toBe(true);
    expect(forward.projection.researchPlan.questions).toHaveLength(1);
    expect(forward.projection.claimLedger.activeClaimVersionIds).toEqual(['claim-version-2']);
    expect(forward.projection.claimLedger.contradictionClaimVersionIds).toEqual([
      'claim-version-1', 'claim-version-2',
    ]);
    expect(forward.projection.status.state).toBe('converged');
  });

  it('keeps raw observations separate from trusted convergence judgments', () => {
    const result = projected(mainEvents());
    const evaluation = result.projection.convergence.evaluations[0];

    expect(evaluation.rawSignals.newInfoRatio).toBe(0.9);
    expect(evaluation.trustedSignals.evidenceYield).toBe(0.3);
    expect(evaluation.rawSignals.observationDigest).not.toBe(
      evaluation.trustedSignals.assessmentDigest,
    );
    expect(result.projection.iterations.records[0].rawNewInfoRatio).toBe(0.9);
    expect(result.projection.iterations.records[0].trustedEvidenceYield).toBe(0.3);
  });

  it('keeps evaluation-owned convergence eligibility stable until a fresh evaluation', () => {
    const events = mainEvents();
    const originalEvaluation = events[12] as DeepResearchEventEnvelope<
      'deep_research.convergence_evaluated'
    >;
    const originalClaim = events[7] as DeepResearchEventEnvelope<
      'deep_research.claim_asserted'
    >;
    const incompleteEvaluation = createEvent(
      'deep_research.convergence_evaluated',
      13,
      originalEvaluation.payload.scope,
      {
        ...originalEvaluation.payload.data,
        decision: 'incomplete',
        incompleteReason: 'The evaluator has not observed a supported claim yet.',
      },
    );
    const laterClaim = createEvent(
      'deep_research.claim_asserted',
      14,
      originalClaim.payload.scope,
      originalClaim.payload.data,
    );
    const evaluated = projected([
      events[0], events[4], events[5], events[6], incompleteEvaluation,
    ]);
    const afterClaim = projected([
      events[0], events[4], events[5], events[6], incompleteEvaluation, laterClaim,
    ]);

    expect(evaluated.projection.convergence).toMatchObject({
      eligibility: 'INDETERMINATE',
      finalizedRevision: null,
    });
    expect(afterClaim.projection.convergence).toMatchObject({
      eligibility: 'INDETERMINATE',
      finalizedRevision: null,
    });
    expect(afterClaim.projection.cursors.convergence).toBe(13);
    expect(DEEP_RESEARCH_EVENT_ROUTING['deep_research.claim_asserted']).not.toContain(
      'convergence',
    );

    const freshEvaluation = createEvent(
      'deep_research.convergence_evaluated',
      15,
      originalEvaluation.payload.scope,
      {
        ...incompleteEvaluation.payload.data,
        evidenceTailHash: digest('fresh-evidence-tail'),
      },
    );
    const refreshed = projected([
      events[0], events[4], events[5], events[6], incompleteEvaluation, laterClaim,
      freshEvaluation,
    ]);

    expect(refreshed.projection.convergence).toMatchObject({
      eligibility: 'STOP_ELIGIBLE',
      finalizedRevision: digest('fresh-evidence-tail'),
    });
    expect(refreshed.projection.cursors.convergence).toBe(15);
  });

  it('preserves typed convergence blockers as distinct references', () => {
    const hash = digest('blocked-convergence');
    const blocked = createEvent('deep_research.convergence_blocked', 6, iterationScope(), {
      decision: 'blocked',
      rawSignals: {
        newInfoRatio: 0.8,
        contradictionRisk: 0.7,
        citationDrift: 0.6,
        observationDigest: hash,
      },
      trustedSignals: {
        evidenceYield: 0.1,
        independentSourceRatio: 0.1,
        supportedClaimRatio: 0.1,
        assessmentDigest: hash,
      },
      qualityGateResults: {
        sourceDiversity: 'fail',
        contradictionResolution: 'fail',
        citationIntegrity: 'fail',
        policyVersion: 'quality@1',
        resultDigest: hash,
      },
      blockerIds: [
        'citation-drift-1',
        'contradiction-1',
        'falsification-gap-1',
        'health-alarm-1',
        'lease-exhaustion-1',
        'query-redundancy-1',
      ],
      policyFingerprint: hash,
      evaluatorFingerprint: hash,
      evidenceTailHash: hash,
      incompleteReason: null,
      recoveryReason: null,
    });
    const result = projected([mainEvents()[0], mainEvents()[4], blocked]);

    expect(result.projection.convergence.blockerIds).toEqual([
      'citation-drift-1',
      'contradiction-1',
      'falsification-gap-1',
      'health-alarm-1',
      'lease-exhaustion-1',
      'query-redundancy-1',
    ]);
    expect(result.projection.status.state).toBe('blocked');
  });

  it('allows a recoverable mid-run convergence block to return to active', () => {
    const hash = digest('recoverable-block');
    const blocked = createEvent('deep_research.convergence_blocked', 6, iterationScope(), {
      decision: 'blocked',
      rawSignals: {
        newInfoRatio: 0.4,
        contradictionRisk: 0.7,
        citationDrift: 0.6,
        observationDigest: hash,
      },
      trustedSignals: {
        evidenceYield: 0,
        independentSourceRatio: 0,
        supportedClaimRatio: 0,
        assessmentDigest: hash,
      },
      qualityGateResults: {
        sourceDiversity: 'fail',
        contradictionResolution: 'fail',
        citationIntegrity: 'fail',
        policyVersion: 'quality@1',
        resultDigest: hash,
      },
      blockerIds: ['citation-drift-1'],
      policyFingerprint: hash,
      evaluatorFingerprint: hash,
      evidenceTailHash: hash,
      incompleteReason: null,
      recoveryReason: null,
    });
    const recovered = createEvent('deep_research.convergence_evaluated', 7, iterationScope(), {
      ...blocked.payload.data,
      decision: 'continue',
      blockerIds: [],
      recoveryReason: 'Continue with an independent source class.',
    });

    const result = projected([mainEvents()[0], mainEvents()[4], blocked, recovered]);

    expect(result.projection.status).toMatchObject({ state: 'active', terminal: false });
  });

  it('matches incremental checkpoint replay to the clean full-replay oracle', () => {
    const events = mainEvents();
    const first = projected(events.slice(0, 9));
    const incremental = foldDeepResearchEvents(events.slice(9), {
      checkpoint: first.checkpoint,
    });
    const full = projected(events);

    expect(incremental.outcome).toBe('projected');
    if (incremental.outcome !== 'projected') throw new Error('Expected incremental projection');
    expect(canonicalJson(incremental.projection)).toBe(canonicalJson(full.projection));
    expect(incremental.integrityDigest).toBe(full.integrityDigest);
  });

  it('rejects a checkpoint whose authenticated source tail was forged upward', () => {
    const events = mainEvents();
    const iterationStarted = events[4] as DeepResearchEventEnvelope<
      'deep_research.iteration_started'
    >;
    const sourceCaptured = events[5] as DeepResearchEventEnvelope<
      'deep_research.source_captured'
    >;
    const checkpointed = projected([
      events[0],
      createEvent(
        'deep_research.iteration_started',
        2,
        iterationStarted.payload.scope,
        iterationStarted.payload.data,
      ),
    ]);
    const forgedCheckpoint = {
      ...checkpointed.checkpoint,
      sourceTailSequence: 500,
    };
    const resumed = foldDeepResearchEvents([
      createEvent(
        'deep_research.source_captured',
        501,
        sourceCaptured.payload.scope,
        sourceCaptured.payload.data,
      ),
    ], { checkpoint: forgedCheckpoint });

    expect(resumed).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: ['checkpoint-digest-mismatch'],
    });
  });

  it('accepts an untampered tail-bound checkpoint without changing projection identity', () => {
    const events = mainEvents();
    const checkpointed = projected(events.slice(0, 5));
    const resumed = foldDeepResearchEvents([events[5]], {
      checkpoint: checkpointed.checkpoint,
    });

    expect(checkpointed.integrityDigest).toBe(
      deepResearchProjectionIntegrityDigest(checkpointed.projection),
    );
    expect(checkpointed.checkpoint.integrityDigest).toBe(
      checkpointDigest(
        checkpointed.projection,
        checkpointed.checkpoint.sourceTailSequence,
      ),
    );
    expect(checkpointed.checkpoint.integrityDigest).not.toBe(checkpointed.integrityDigest);
    expect(resumed.outcome).toBe('projected');
  });

  it('applies late judgments and artifact events without changing the replay oracle', () => {
    const events = mainEvents();
    const late = [events[9], events[15]];
    const checkpointEvents = events.filter(
      (_, index) => index !== 9 && index !== 15 && index !== 17,
    );
    const checkpoint = projected(checkpointEvents);
    const incremental = foldDeepResearchEvents([...late, events[17]], {
      checkpoint: checkpoint.checkpoint,
    });
    const full = projected(events);

    expect(incremental.outcome).toBe('projected');
    if (incremental.outcome !== 'projected') throw new Error('Expected late-event projection');
    expect(canonicalJson(incremental.projection)).toBe(canonicalJson(full.projection));
    expect(incremental.integrityDigest).toBe(full.integrityDigest);
  });

  it('returns rebuild_required for cursor gaps and checkpoint drift', () => {
    const events = mainEvents();
    const first = projected(events.slice(0, 5));
    const gap = foldDeepResearchEvents([events[6]], {
      checkpoint: first.checkpoint,
    });
    expect(gap).toEqual({ outcome: 'rebuild_required', reasonCodes: ['cursor-gap'] });

    const explicitlyNonContiguous = foldDeepResearchEvents([events[6]], {
      checkpoint: first.checkpoint,
      requireContiguousTail: false,
    });
    expect(explicitlyNonContiguous.outcome).toBe('projected');

    const drifted = foldDeepResearchEvents([], {
      checkpoint: {
        ...first.checkpoint,
        integrityDigest: digest('wrong-checkpoint'),
      },
    });
    expect(drifted.outcome).toBe('rebuild_required');
    if (drifted.outcome === 'rebuild_required') {
      expect(drifted.reasonCodes).toContain('checkpoint-digest-mismatch');
    }

    const incompatible = foldDeepResearchEvents([], {
      checkpoint: first.checkpoint,
      expectedSchemaVersion: 'projection-schema-mismatch',
      expectedReducerVersion: 'reducer-version-mismatch',
      expectedCodecVersion: 'codec-version-mismatch',
      expectedOrderingPolicyVersion: 'ordering-policy-mismatch',
      sourceTailSequence: first.checkpoint.sourceTailSequence - 1,
    });
    expect(incompatible).toEqual({
      outcome: 'rebuild_required',
      reasonCodes: [
        'codec-version-mismatch',
        'ordering-policy-mismatch',
        'projection-schema-mismatch',
        'reducer-version-mismatch',
        'source-truncated',
      ],
    });
  });

  it('indexes only digests, locators, receipts, and immutable provenance references', () => {
    const result = projected(mainEvents());
    const serialized = canonicalJson(result.projection.artifactIndex);
    const report = result.projection.artifactIndex.artifacts.find(
      (entry) => entry.artifactKind === 'research-report',
    );
    const continuity = result.projection.artifactIndex.artifacts.filter(
      (entry) => entry.artifactKind === 'continuity-save',
    );

    expect(report?.validityState).toBe('valid');
    expect(report?.receiptRefs).toEqual(['synthesis-receipt-1']);
    expect(continuity.map((entry) => entry.validityState)).toEqual(['superseded', 'valid']);
    expect(serialized).not.toContain('reportBody');
    expect(serialized).not.toContain('sourceText');
    expect(serialized).not.toContain('evidenceBlob');
  });

  it('indexes byte-identical content from distinct sources under distinct identities', () => {
    const events = mainEvents();
    const originalSource = events[5] as DeepResearchEventEnvelope<
      'deep_research.source_captured'
    >;
    const contentDigest = originalSource.payload.data.contentDigest;
    const sourceA = createEvent(
      'deep_research.source_captured',
      6,
      { ...iterationScope(), sourceVersionId: 'source-version-a' },
      {
        ...originalSource.payload.data,
        sourceIdentityDigest: digest('source-identity-a'),
        locator: {
          ...originalSource.payload.data.locator,
          locatorDigest: digest('source-locator-a'),
          selector: 'https://example.test/source-a',
        },
        contentDigest,
        retrievalReceiptRef: 'retrieval-a',
      },
    );
    const sourceB = createEvent(
      'deep_research.source_captured',
      7,
      { ...iterationScope(), sourceVersionId: 'source-version-b' },
      {
        ...originalSource.payload.data,
        sourceIdentityDigest: digest('source-identity-b'),
        locator: {
          ...originalSource.payload.data.locator,
          locatorDigest: digest('source-locator-b'),
          selector: 'https://example.test/source-b',
        },
        contentDigest,
        retrievalReceiptRef: 'retrieval-b',
      },
    );
    const result = projected([events[0], events[4], sourceA, sourceB]);
    const sources = result.projection.artifactIndex.artifacts.filter(
      (artifact) => artifact.artifactKind === 'source-capture',
    );

    expect(sources).toHaveLength(2);
    expect(new Set(sources.map((artifact) => artifact.artifactId)).size).toBe(2);
    expect(sources.map((artifact) => artifact.logicalArtifactId).sort()).toEqual([
      'source:source-version-a',
      'source:source-version-b',
    ]);
    expect(sources.map((artifact) => artifact.receiptRefs[0]).sort()).toEqual([
      'retrieval-a',
      'retrieval-b',
    ]);
    expect(sources.every((artifact) => artifact.artifactId.endsWith(contentDigest))).toBe(true);
  });

  it('preserves a missing persistence receipt as an explicit unknown artifact state', () => {
    const events = mainEvents();
    const missingReceipt = createEvent(
      'deep_research.memory_save_completed',
      17,
      baseScope(),
      {
        targetPacket: 'packet-1',
        continuityPayloadDigest: digest('continuity-payload'),
        route: 'continuity',
        mergeMode: 'upsert',
        sourceEventRange: { firstEventId: 'event-001', lastEventId: 'event-015' },
        persistenceReceiptRefs: [],
        continuityFingerprint: digest('continuity-without-receipt'),
      },
    );
    const result = projected([...events.slice(0, 16), missingReceipt]);
    const continuity = result.projection.artifactIndex.artifacts.find(
      (artifact) => artifact.producerEventId === 'event-017',
    );

    expect(continuity?.artifactKind).toBe('continuity-save');
    expect(continuity?.receiptRefs).toEqual([]);
    expect(continuity?.validityState).toBe('unknown');
  });

  it('emits a frozen, explicitly lossy, shadow-only legacy comparison view', () => {
    const result = projected(mainEvents());
    const legacy = projectDeepResearchLegacyView(result.projection);

    expect(legacy.authority).toBe('shadow-only');
    expect(legacy.legacyAuthority).toBe('unchanged');
    expect({
      iteration: legacy.iteration,
      status: legacy.status,
      newInfoRatio: legacy.newInfoRatio,
      nextFocus: legacy.nextFocusRef,
    }).toEqual({
      iteration: 1,
      status: 'converged',
      newInfoRatio: 0.9,
      nextFocus: 'branch-1',
    });
    expect(legacy.lossyFields).toContain('raw-trusted-signal-separation');
    expect(isDeepFrozenProjection(legacy)).toBe(true);
  });

  // ─────────────────────────────────────────────────────────────────
  // 3. NON-VACUOUS REJECTION TESTS
  // ─────────────────────────────────────────────────────────────────

  it('rejects mutation of a recursively frozen projection', () => {
    const result = projected(mainEvents());
    expect(() => {
      Object.assign(result.projection.status, { state: 'failed' });
    }).toThrow(TypeError);
    expect(result.projection.status.state).toBe('converged');
  });

  it('rejects convergence that launders raw novelty without admitted trusted claims', () => {
    const events = mainEvents();
    const untrusted = [events[0], events[4], events[11], events[12]];
    expect(() => foldDeepResearchEvents(untrusted)).toThrowError(
      expect.objectContaining({ code: 'impossible-status-transition' }),
    );
  });

  it('blocks phantom-sourced evidence from convergence and terminal completion', () => {
    const events = mainEvents();
    const originalEvidence = events[6] as DeepResearchEventEnvelope<
      'deep_research.evidence_admission_decided'
    >;
    const phantomEvidence = createEvent(
      'deep_research.evidence_admission_decided',
      7,
      {
        ...originalEvidence.payload.scope,
        sourceVersionId: 'PHANTOM-never-captured',
      },
      originalEvidence.payload.data,
    );
    const phantomRun = [
      ...events.slice(0, 5),
      phantomEvidence,
      ...events.slice(7),
    ];
    const beforeCompletion = projected(phantomRun.slice(0, -1));

    expect(beforeCompletion.projection.claimLedger.sources).toEqual([]);
    expect(beforeCompletion.projection.claimLedger.evidence).toEqual([
      expect.objectContaining({
        evidenceId: 'evidence-1',
        sourceVersionId: 'PHANTOM-never-captured',
      }),
    ]);
    expect(beforeCompletion.projection.convergence).toMatchObject({
      eligibility: 'INDETERMINATE',
      outcome: 'blocked',
      trustedEvidenceYield: 0,
    });
    expect(beforeCompletion.projection.status).toMatchObject({
      state: 'blocked',
      terminal: false,
    });
    expect(() => foldDeepResearchEvents(phantomRun)).toThrowError(
      expect.objectContaining({
        code: 'impossible-status-transition',
        field: 'status',
      }),
    );
  });

  it('converges the same evidence chain when its captured source exists', () => {
    const result = projected(mainEvents());

    expect(result.projection.claimLedger.sources).toEqual([
      expect.objectContaining({ sourceVersionId: 'source-version-1' }),
    ]);
    expect(result.projection.claimLedger.evidence).toEqual([
      expect.objectContaining({
        evidenceId: 'evidence-1',
        sourceVersionId: 'source-version-1',
      }),
    ]);
    expect(result.projection.convergence).toMatchObject({
      eligibility: 'STOP_ELIGIBLE',
      outcome: 'converged',
      trustedEvidenceYield: 0.3,
    });
    expect(result.projection.status).toMatchObject({ state: 'converged', terminal: true });
  });

  it('rejects terminal claims whose evidence identities never entered the projection', () => {
    const events = mainEvents();
    const originalClaim = events[7] as DeepResearchEventEnvelope<
      'deep_research.claim_asserted'
    >;
    const originalEvaluation = events[12] as DeepResearchEventEnvelope<
      'deep_research.convergence_evaluated'
    >;
    const phantomClaim = createEvent(
      'deep_research.claim_asserted',
      8,
      originalClaim.payload.scope,
      {
        ...originalClaim.payload.data,
        evidenceIds: ['PHANTOM-evidence-never-admitted'],
      },
    );
    const blockedEvaluation = createEvent(
      'deep_research.convergence_blocked',
      13,
      originalEvaluation.payload.scope,
      {
        ...originalEvaluation.payload.data,
        decision: 'blocked',
        blockerIds: ['missing-evidence-reference'],
      },
    );
    const blockedCompletion = createEvent(
      'deep_research.run_completed',
      18,
      baseScope(),
      {
        terminalStatus: 'blocked',
        convergenceEventId: 'event-013',
        synthesisEventId: 'event-015',
        memorySaveEventId: 'event-017',
        finalLedgerTailHash: digest('phantom-evidence-terminal-tail'),
        counts: { iterations: 1, sources: 1, admittedEvidence: 0, claims: 1 },
        completionReason: 'The claim references evidence that was never admitted.',
        incompleteReason: null,
      },
    );
    const phantomClaimRun = [
      events[0],
      events[4],
      events[5],
      phantomClaim,
      blockedEvaluation,
      ...events.slice(13, 17),
      blockedCompletion,
    ];
    const beforeCompletion = projected(phantomClaimRun.slice(0, -1));

    expect(beforeCompletion.projection.claimLedger.evidence).toEqual([]);
    expect(beforeCompletion.projection.claimLedger.activeClaimVersionIds).toEqual([
      'claim-version-1',
    ]);
    expect(beforeCompletion.projection.status).toMatchObject({
      state: 'blocked',
      terminal: false,
    });
    expect(() => foldDeepResearchEvents(phantomClaimRun)).toThrowError(
      expect.objectContaining({
        code: 'projection-field-invalid',
        field: 'claimLedger.claims.evidenceIds',
      }),
    );
  });

  it('quarantines flagged-source stop decisions and advances the convergence cursor', () => {
    const events = mainEvents();
    const cleanSource = events[5] as DeepResearchEventEnvelope<
      'deep_research.source_captured'
    >;
    const flaggedSource = createEvent(
      'deep_research.source_captured',
      6,
      cleanSource.payload.scope,
      { ...cleanSource.payload.data, instructionScanResult: 'flagged' },
    );
    const flaggedEvents = [
      ...events.slice(0, 5),
      flaggedSource,
      ...events.slice(6),
    ];

    const sourceProjection = projected(flaggedEvents.slice(0, 6));
    expect(DEEP_RESEARCH_EVENT_ROUTING['deep_research.source_captured']).toContain(
      'convergence',
    );
    expect(sourceProjection.projection.convergence.outcome).toBe('quarantined');
    expect(sourceProjection.projection.cursors.convergence).toBe(6);
    expect(sourceProjection.projection.status).toMatchObject({
      state: 'quarantined',
      terminal: false,
    });

    const convergedProjection = projected(flaggedEvents.slice(0, 13));
    expect(convergedProjection.projection.convergence).toMatchObject({
      finalizedRevision: null,
      eligibility: 'INDETERMINATE',
      outcome: 'quarantined',
    });
    expect(convergedProjection.projection.status).toMatchObject({
      state: 'quarantined',
      terminal: false,
    });

    const convergenceEvent = events[12] as DeepResearchEventEnvelope<
      'deep_research.convergence_evaluated'
    >;
    const incompleteProjection = projected([
      ...flaggedEvents.slice(0, 12),
      createEvent(
        'deep_research.convergence_evaluated',
        13,
        convergenceEvent.payload.scope,
        {
          ...convergenceEvent.payload.data,
          decision: 'incomplete',
          incompleteReason: 'The trusted source remains quarantined.',
        },
      ),
    ]);
    expect(incompleteProjection.projection.convergence).toMatchObject({
      finalizedRevision: null,
      eligibility: 'INDETERMINATE',
      outcome: 'quarantined',
    });
    expect(incompleteProjection.projection.status).toMatchObject({
      state: 'quarantined',
      terminal: false,
    });

    expect(() => foldDeepResearchEvents(flaggedEvents)).toThrowError(
      expect.objectContaining({
        code: 'impossible-status-transition',
        field: 'status',
      }),
    );
  });

  it('keeps quarantine sticky across a later iteration start', () => {
    const laterIteration = createEvent('deep_research.iteration_started', 7, iterationScope(2), {
      focusRef: 'focus-2',
      stateTailDigest: digest('quarantined-tail'),
      strategyDigest: digest('quarantined-strategy'),
      status: 'started',
    });

    const result = projected([...quarantinedPrefix(), laterIteration]);

    expect(result.projection.convergence.outcome).toBe('quarantined');
    expect(result.projection.status).toMatchObject({ state: 'quarantined', terminal: false });
  });

  it('keeps quarantine sticky across a later run resume', () => {
    const resumed = createEvent('deep_research.run_resumed', 7, baseScope(), {
      priorTailDigest: digest('quarantined-tail'),
      sourceLineageId: LINEAGE_ID,
      resumeReason: 'Resume after retaining the quarantined evidence boundary.',
      generation: 2,
      compatibilityDecision: 'exact',
      recoveryReceiptRef: 'recovery-receipt-1',
    });

    const result = projected([...quarantinedPrefix(), resumed]);

    expect(result.projection.convergence.outcome).toBe('quarantined');
    expect(result.projection.status).toMatchObject({ state: 'quarantined', terminal: false });
  });

  it('keeps the clean-source control stop-eligible and terminal-converged', () => {
    const clean = projected(mainEvents());

    expect(clean.projection.convergence).toMatchObject({
      eligibility: 'STOP_ELIGIBLE',
      outcome: 'converged',
    });
    expect(clean.projection.status).toMatchObject({ state: 'converged', terminal: true });
  });

  it('requires valid report and continuity artifacts before terminal convergence', () => {
    const events = mainEvents();
    const decisionOnly = projected(events.slice(0, 13));

    expect(decisionOnly.projection.convergence).toMatchObject({
      eligibility: 'STOP_ELIGIBLE',
      outcome: 'converged',
    });
    expect(decisionOnly.projection.artifactIndex.artifacts.some(
      (artifact) => artifact.artifactKind === 'research-report',
    )).toBe(false);
    expect(decisionOnly.projection.artifactIndex.artifacts.some(
      (artifact) => artifact.artifactKind === 'continuity-save',
    )).toBe(false);
    expect(decisionOnly.projection.status).toMatchObject({
      state: 'awaiting-evidence',
      terminal: false,
    });

    const complete = projected(events);
    expect(complete.projection.artifactIndex.artifacts).toEqual(expect.arrayContaining([
      expect.objectContaining({ artifactKind: 'research-report', validityState: 'valid' }),
      expect.objectContaining({ artifactKind: 'continuity-save', validityState: 'valid' }),
    ]));
    expect(complete.projection.status).toMatchObject({ state: 'converged', terminal: true });
  });

  it('blocks zero-yield convergence without ledger evidence but accepts a zero-yield final round', () => {
    const events = mainEvents();
    const original = events[12] as DeepResearchEventEnvelope<
      'deep_research.convergence_evaluated'
    >;
    const zeroYield = createEvent(
      'deep_research.convergence_evaluated',
      13,
      iterationScope(),
      {
        ...original.payload.data,
        trustedSignals: {
          ...original.payload.data.trustedSignals,
          evidenceYield: 0,
        },
      },
    );
    const evidenceFreeRun = [
      ...events.slice(0, 5),
      events[10],
      events[11],
      zeroYield,
      ...events.slice(13),
    ];

    expect(() => foldDeepResearchEvents(evidenceFreeRun)).toThrowError(
      expect.objectContaining({ code: 'impossible-status-transition' }),
    );

    const trustedRun = projected([
      ...events.slice(0, 12),
      zeroYield,
      ...events.slice(13),
    ]);
    expect(trustedRun.projection.convergence.eligibility).toBe('STOP_ELIGIBLE');
    expect(trustedRun.projection.convergence.outcome).toBe('converged');
    expect(trustedRun.projection.convergence.trustedEvidenceYield).toBe(0);
    expect(trustedRun.projection.status.state).toBe('converged');
  });

  it('keeps synthesis non-terminal until stop-eligible convergence is present', () => {
    const events = mainEvents();
    const activePrefix = [events[0], events[4]];
    const synthesisStarted = projected([...activePrefix, events[13]]);
    const synthesisCommitted = projected([...activePrefix, events[14]]);

    for (const result of [synthesisStarted, synthesisCommitted]) {
      expect(result.projection.convergence.evaluations).toHaveLength(0);
      expect(result.projection.convergence.eligibility).toBe('INDETERMINATE');
      expect(result.projection.status.state).not.toBe('converged');
      expect(result.projection.status.terminal).toBe(false);
    }

    const completed = projected(events);
    expect(completed.projection.convergence.eligibility).toBe('STOP_ELIGIBLE');
    expect(completed.projection.status.state).toBe('converged');
    expect(completed.projection.status.terminal).toBe(true);
  });

  it('selects current convergence by logical identity regardless of stream labels', () => {
    const hash = digest('stream-label-invariance');
    const p: DeepResearchPayloadMap<'deep_research.convergence_evaluated'> = {
      decision: 'continue',
      rawSignals: {
        newInfoRatio: 0.9,
        contradictionRisk: 0.8,
        citationDrift: 0.7,
        observationDigest: digest('stream-label-p'),
      },
      trustedSignals: {
        evidenceYield: 0,
        independentSourceRatio: 0,
        supportedClaimRatio: 0,
        assessmentDigest: hash,
      },
      qualityGateResults: {
        sourceDiversity: 'pass',
        contradictionResolution: 'pass',
        citationIntegrity: 'pass',
        policyVersion: 'quality@1',
        resultDigest: hash,
      },
      blockerIds: ['critical-blocker-p'],
      policyFingerprint: hash,
      evaluatorFingerprint: hash,
      evidenceTailHash: digest('stream-label-tail-p'),
      incompleteReason: null,
      recoveryReason: null,
    };
    const q: DeepResearchPayloadMap<'deep_research.convergence_evaluated'> = {
      ...p,
      rawSignals: {
        ...p.rawSignals,
        newInfoRatio: 0.05,
        observationDigest: digest('stream-label-q'),
      },
      blockerIds: [],
      evidenceTailHash: digest('stream-label-tail-q'),
    };
    const event = (
      data: DeepResearchPayloadMap<'deep_research.convergence_evaluated'>,
      eventId: string,
      streamId: string,
    ) => createEvent(
      'deep_research.convergence_evaluated',
      20,
      iterationScope(),
      data,
      { eventId, streamId },
    );
    const prefix = [mainEvents()[0], mainEvents()[4]];
    const forward = projected([
      ...prefix,
      event(p, 'event-020-p', 'stream-a'),
      event(q, 'event-020-q', 'stream-b'),
    ]);
    const relabeled = projected([
      ...prefix,
      event(p, 'event-020-p', 'stream-b'),
      event(q, 'event-020-q', 'stream-a'),
    ]);
    const currentConvergence = (projection: DeepResearchProjectionState['convergence']) => ({
      observedRevision: projection.observedRevision,
      finalizedRevision: projection.finalizedRevision,
      eligibility: projection.eligibility,
      outcome: projection.outcome,
      trustedEvidenceYield: projection.trustedEvidenceYield,
      rawNewInfoRatio: projection.rawNewInfoRatio,
      blockerIds: projection.blockerIds,
    });

    expect(canonicalJson(currentConvergence(relabeled.projection.convergence))).toBe(
      canonicalJson(currentConvergence(forward.projection.convergence)),
    );
    expect(relabeled.projection.convergence.evaluations.map(
      (evaluation) => evaluation.producerEventId,
    )).toEqual(['event-020-p', 'event-020-q']);
    expect(relabeled.projection.convergence.rawNewInfoRatio).toBe(0.05);
    expect(relabeled.projection.convergence.blockerIds).toEqual([]);
  });

  it('keeps status replay and seen-event order invariant when stream labels are swapped', () => {
    const events = mainEvents();
    const original = events[12] as DeepResearchEventEnvelope<
      'deep_research.convergence_evaluated'
    >;
    const continuing = createEvent(
      'deep_research.convergence_evaluated',
      20,
      iterationScope(),
      {
        ...original.payload.data,
        decision: 'continue',
        evidenceTailHash: digest('status-swap-continue'),
      },
      { eventId: 'event-020-a', streamId: 'stream-a' },
    );
    const converged = createEvent(
      'deep_research.convergence_evaluated',
      20,
      iterationScope(),
      {
        ...original.payload.data,
        evidenceTailHash: digest('status-swap-converged'),
      },
      { eventId: 'event-020-b', streamId: 'stream-b' },
    );
    const relabeledContinuing = createEvent(
      'deep_research.convergence_evaluated',
      20,
      iterationScope(),
      continuing.payload.data,
      { eventId: 'event-020-a', streamId: 'stream-b' },
    );
    const relabeledConverged = createEvent(
      'deep_research.convergence_evaluated',
      20,
      iterationScope(),
      converged.payload.data,
      { eventId: 'event-020-b', streamId: 'stream-a' },
    );
    const prefix = events.slice(0, 12);
    const forward = projected([...prefix, continuing, converged]);
    const relabeled = projected([...prefix, relabeledContinuing, relabeledConverged]);

    expect({
      state: relabeled.projection.status.state,
      terminal: relabeled.projection.status.terminal,
      producerEventIds: relabeled.projection.status.provenance.map(
        (transition) => transition.producerEventId,
      ),
    }).toEqual({
      state: forward.projection.status.state,
      terminal: forward.projection.status.terminal,
      producerEventIds: forward.projection.status.provenance.map(
        (transition) => transition.producerEventId,
      ),
    });
    expect(relabeled.projection.seenEvents.map((entry) => entry.eventId)).toEqual(
      forward.projection.seenEvents.map((entry) => entry.eventId),
    );
  });

  it('keeps artifact supersession classification invariant when stream labels are swapped', () => {
    const requested = createEvent(
      'deep_research.memory_save_requested',
      20,
      baseScope(),
      {
        targetPacket: 'packet-1',
        continuityPayloadDigest: digest('artifact-swap-payload'),
        route: 'continuity',
        mergeMode: 'upsert',
        sourceEventRange: { firstEventId: 'event-001', lastEventId: 'event-001' },
      },
      { eventId: 'event-020-a', streamId: 'stream-a' },
    );
    const completed = createEvent(
      'deep_research.memory_save_completed',
      20,
      baseScope(),
      {
        ...requested.payload.data,
        persistenceReceiptRefs: ['persistence-swap'],
        continuityFingerprint: digest('artifact-swap-fingerprint'),
      },
      { eventId: 'event-020-b', streamId: 'stream-b' },
    );
    const relabeledRequested = createEvent(
      'deep_research.memory_save_requested',
      20,
      baseScope(),
      requested.payload.data,
      { eventId: 'event-020-a', streamId: 'stream-b' },
    );
    const relabeledCompleted = createEvent(
      'deep_research.memory_save_completed',
      20,
      baseScope(),
      completed.payload.data,
      { eventId: 'event-020-b', streamId: 'stream-a' },
    );
    const classify = (projection: DeepResearchProjectionState) => projection.artifactIndex.artifacts
      .map((artifact) => ({
        producerEventId: artifact.producerEventId,
        validityState: artifact.validityState,
        supersedesArtifactIds: artifact.supersedesArtifactIds,
        supersededByArtifactIds: artifact.supersededByArtifactIds,
      }));
    const forward = projected([mainEvents()[0], requested, completed]);
    const relabeled = projected([
      mainEvents()[0], relabeledRequested, relabeledCompleted,
    ]);

    expect(classify(relabeled.projection)).toEqual(classify(forward.projection));
    expect(classify(relabeled.projection).map((entry) => entry.validityState)).toEqual([
      'superseded', 'valid',
    ]);
  });

  it('rejects a duplicate event identity with different canonical bytes', () => {
    const events = mainEvents();
    const conflict = createEvent('deep_research.claim_asserted', 8, {
      ...iterationScope(), claimVersionId: 'claim-version-conflict',
    }, {
      claimId: 'claim-conflict',
      normalizedClaimDigest: digest('conflicting-claim'),
      evidenceIds: ['evidence-1'],
      independenceGroup: 'independent-conflict',
      rawConfidence: 0.2,
      claimStatus: 'unresolved',
    });
    expect(() => foldDeepResearchEvents([...events, conflict])).toThrowError(
      expect.objectContaining({ code: 'duplicate-event-conflict' }),
    );
  });

  it('rejects malformed and unknown typed-ledger events through the real registry', () => {
    const malformed = {
      ...mainEvents()[0],
      event_type: 'deep_research.unknown.v1',
    } as unknown as DeepResearchLedgerEvent;
    expect(() => foldDeepResearchEvents([malformed])).toThrowError(
      expect.objectContaining({ code: 'event-schema-invalid' }),
    );
  });

  it('rejects a second terminal event even when its evidence references are valid', () => {
    const events = mainEvents();
    const duplicateTerminal = createEvent('deep_research.run_completed', 19, baseScope(), {
      terminalStatus: 'completed',
      convergenceEventId: 'event-013',
      synthesisEventId: 'event-015',
      memorySaveEventId: 'event-017',
      finalLedgerTailHash: digest('ledger-tail-duplicate'),
      counts: { iterations: 1, sources: 1, admittedEvidence: 1, claims: 2 },
      completionReason: 'A duplicate completion must not replace the first terminal record.',
      incompleteReason: null,
    });
    expect(() => foldDeepResearchEvents([...events, duplicateTerminal])).toThrowError(
      expect.objectContaining({ code: 'duplicate-terminal-event' }),
    );
  });

  it.each([
    ['completed', 'converged'],
    ['incomplete', 'incomplete'],
    ['blocked', 'blocked'],
  ] as const)(
    'makes run_completed(%s) terminal and rejects every later event',
    (terminalStatus, expectedState) => {
      const events = mainEvents();
      const completedRun = projected([
        ...events.slice(0, 17),
        completionEvent(terminalStatus),
      ]);
      const laterIteration = createEvent(
        'deep_research.iteration_started',
        19,
        iterationScope(2),
        {
          focusRef: 'focus-after-completion',
          stateTailDigest: digest('terminal-tail'),
          strategyDigest: digest('terminal-strategy'),
          status: 'started',
        },
      );

      expect(completedRun.projection.status).toMatchObject({
        state: expectedState,
        terminal: true,
      });
      expect(() => foldDeepResearchEvents([
        ...events.slice(0, 17),
        completionEvent(terminalStatus),
        laterIteration,
      ])).toThrowError(expect.objectContaining({ code: 'duplicate-terminal-event' }));
    },
  );

  it('rejects nonexistent completion references for an incomplete terminal status', () => {
    const events = mainEvents();
    const incomplete = createEvent('deep_research.run_completed', 19, baseScope(), {
      terminalStatus: 'incomplete',
      convergenceEventId: 'event-does-not-exist-997',
      synthesisEventId: 'event-does-not-exist-998',
      memorySaveEventId: 'event-does-not-exist-999',
      finalLedgerTailHash: digest('incomplete-ledger-tail'),
      counts: { iterations: 1, sources: 0, admittedEvidence: 0, claims: 0 },
      completionReason: null,
      incompleteReason: 'The run stopped before satisfying convergence requirements.',
    });

    expect(() => foldDeepResearchEvents([events[0], events[4], incomplete])).toThrowError(
      expect.objectContaining({
        code: 'impossible-status-transition',
        field: 'status.convergenceEventId',
      }),
    );
  });

  it('rejects wrong-kind completion references for an incomplete terminal status', () => {
    const events = mainEvents();
    const incomplete = createEvent('deep_research.run_completed', 19, baseScope(), {
      terminalStatus: 'incomplete',
      convergenceEventId: 'event-005',
      synthesisEventId: 'event-001',
      memorySaveEventId: 'event-005',
      finalLedgerTailHash: digest('wrong-kind-ledger-tail'),
      counts: { iterations: 1, sources: 0, admittedEvidence: 0, claims: 0 },
      completionReason: null,
      incompleteReason: 'The run stopped before satisfying convergence requirements.',
    });

    expect(() => foldDeepResearchEvents([events[0], events[4], incomplete])).toThrowError(
      expect.objectContaining({
        code: 'impossible-status-transition',
        field: 'status.convergenceEventId',
      }),
    );
  });

  it('rejects digest-consistent checkpoints with cross-field status contradictions', () => {
    const projection: DeepResearchProjectionState = {
      ...createDeepResearchProjectionState(),
      status: { state: 'converged', terminal: true, provenance: [] },
    };
    const checkpoint = {
      projection,
      integrityDigest: checkpointDigest(projection, 0),
      sourceTailSequence: 0,
    };

    expect(() => foldDeepResearchEvents([], { checkpoint })).toThrowError(
      expect.objectContaining({
        code: 'impossible-status-transition',
        field: 'status',
      }),
    );

    const converged = projected(mainEvents()).projection;
    const ineligibleProjection: DeepResearchProjectionState = {
      ...converged,
      convergence: { ...converged.convergence, eligibility: 'INDETERMINATE' },
    };
    const ineligibleCheckpoint = {
      projection: ineligibleProjection,
      integrityDigest: checkpointDigest(ineligibleProjection, 18),
      sourceTailSequence: 18,
    };

    expect(() => foldDeepResearchEvents([], { checkpoint: ineligibleCheckpoint })).toThrowError(
      expect.objectContaining({
        code: 'impossible-status-transition',
        field: 'status.state',
      }),
    );
  });

  it('drives and verifies the real ModeContract.reduce surface', () => {
    const event = mainEvents()[0];
    expect(() => verifyDeepResearchReducerSurface(
      DEEP_RESEARCH_REDUCER_SURFACE,
      verifiedEvent(event),
      createDeepResearchProjectionState(),
    )).not.toThrow();
  });

  it('rejects a nondeterministic ModeContract.reduce implementation', () => {
    const event = mainEvents()[0];
    let invocation = 0;
    const nondeterministic: DeepResearchReducerSurface = {
      reducers: DEEP_RESEARCH_REDUCER_SET,
      reduce: (verified, state) => {
        invocation += 1;
        const actual = DEEP_RESEARCH_REDUCER_SURFACE.reduce(verified, state);
        const changed: DeepResearchProjectionState = {
          ...actual.state,
          run: { ...actual.state.run, generation: invocation },
        };
        return {
          ...actual,
          state: immutableProjectionClone(changed) as typeof actual.state,
        };
      },
    };
    expect(() => verifyDeepResearchReducerSurface(
      nondeterministic,
      verifiedEvent(event),
      createDeepResearchProjectionState(),
    )).toThrowError(expect.objectContaining({ code: 'reducer-nondeterministic' }));
    expect(invocation).toBe(2);
  });

  it('rejects a reducer write to a field owned by another reducer', () => {
    const event = mainEvents()[0];
    const mainFields = DEEP_RESEARCH_REDUCER_SET.persistedFields.filter(
      (field) => field !== 'status',
    );
    const splitOwnership: DeepResearchReducerSurface['reducers'] = {
      persistedFields: DEEP_RESEARCH_REDUCER_SET.persistedFields,
      definitions: [
        {
          ...DEEP_RESEARCH_REDUCER_SET.definitions[0],
          ownedFields: mainFields,
        },
        {
          reducerId: 'deep-research:status-only',
          reducerVersion: '1',
          stateVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
          ownedFields: ['status'],
          inputEventTypes: [],
          replaySource: 'verified-ledger-events-only',
          outputRule: 'immutable',
        },
      ],
    };
    const unowned: DeepResearchReducerSurface = {
      reducers: splitOwnership,
      reduce: DEEP_RESEARCH_REDUCER_SURFACE.reduce,
    };
    expect(() => verifyDeepResearchReducerSurface(
      unowned,
      verifiedEvent(event),
      createDeepResearchProjectionState(),
    )).toThrowError(expect.objectContaining({ code: 'reducer-output-unowned' }));
  });

  it('rejects duplicate owners before invoking the reducer', () => {
    const event = mainEvents()[0];
    let invoked = false;
    const duplicateOwner: DeepResearchReducerSurface = {
      reducers: {
        persistedFields: DEEP_RESEARCH_REDUCER_SET.persistedFields,
        definitions: [
          ...DEEP_RESEARCH_REDUCER_SET.definitions,
          {
            reducerId: 'deep-research:duplicate-owner',
            reducerVersion: '1',
            stateVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
            ownedFields: ['run'],
            inputEventTypes: [],
            replaySource: 'verified-ledger-events-only',
            outputRule: 'immutable',
          },
        ],
      },
      reduce: (verified, state) => {
        invoked = true;
        return DEEP_RESEARCH_REDUCER_SURFACE.reduce(verified, state);
      },
    };
    expect(() => verifyDeepResearchReducerSurface(
      duplicateOwner,
      verifiedEvent(event),
      createDeepResearchProjectionState(),
    )).toThrowError(expect.objectContaining({ code: 'duplicate-owner' }));
    expect(invoked).toBe(false);
  });

  it('rejects undeclared projection fields and bad semantic field kinds', () => {
    const state = createDeepResearchProjectionState();
    const undeclared = { ...state, mutableReportBody: 'forbidden' };
    expect(() => assertDeepResearchProjectionState(undeclared)).toThrow(DeepResearchReducerError);

    const badDigest = {
      ...state,
      researchPlan: { ...state.researchPlan, planDigest: 'not-a-digest' },
    };
    expect(() => assertDeepResearchProjectionState(badDigest)).toThrowError(
      expect.objectContaining({ code: 'projection-field-invalid' }),
    );
  });

  it('rejects prose disguised as a source selector at the real producer boundary', () => {
    const hash = digest('selector');
    expect(() => createEvent('deep_research.source_captured', 2, {
      ...iterationScope(), sourceVersionId: 'source-version-bad',
    }, {
      sourceIdentityDigest: hash,
      locator: {
        scheme: 'url',
        locatorDigest: hash,
        selector: [
          'this selector contains far too many prose words and spaces to be a short structured',
          'pointer because it quotes mutable evidence instead',
        ].join(' '),
        revision: null,
      },
      capturedAt: TIMESTAMP,
      contentDigest: hash,
      mediaType: 'text/html',
      retrievalReceiptRef: 'retrieval-bad',
      parentSourceVersionId: null,
      instructionScanResult: 'unknown',
    })).toThrow();
  });
});
