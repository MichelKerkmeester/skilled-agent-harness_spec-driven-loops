// ───────────────────────────────────────────────────────────────────
// MODULE: Health Degeneration Harness Contract Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import type { CycleHealthEventPayload } from '../../lib/cycle-detection/index.js';
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import {
  DEFAULT_HEALTH_POLICY,
  HEALTH_POLICY_VERSION,
  HealthAggregateStates,
  HealthHarnessError,
  HealthHarnessErrorCodes,
  HealthInputFields,
  HealthObservationProjector,
  HealthResponseActions,
  HealthSignalKinds,
  ModeHealthAdapterRegistry,
  adaptBudgetLifecyclePressure,
  adaptFrontier,
  adaptProgress,
  adaptQuality,
  adaptSemanticConcentration,
  createDefaultHealthPolicyRegistry,
  createNormalizedHealthInputs,
  observeHealthInShadow,
  replayHealthObservations,
} from '../../lib/health-degeneration-harness/index.js';
import { BudgetEventTypes } from '../../lib/hierarchical-budgets/index.js';

import type {
  BudgetPressureHealthObservation,
  FrontierStatus,
  HealthBoundaryInput,
  HealthProjectionResult,
  HealthProjectionState,
  HealthSignal,
  ModeHealthAdapterDefinition,
  QualityHealthObservation,
  RegisteredModeHealthAdapter,
} from '../../lib/health-degeneration-harness/index.js';
import type { ProjectionWatermark } from '../../lib/transactional-projections/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const RUN_ID = 'run-health-harness';
const MODE_ID = 'mode-fixture';
const LINEAGE_ID = 'lineage-health';
const REGION_ID = 'region-health';
const LEDGER_ID = 'health-ledger';

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function lastValue<T>(values: readonly T[]): T {
  const value = values.at(-1);
  if (value === undefined) throw new Error('Fixture expected a non-empty result set');
  return value;
}

const PROJECTION = Object.freeze({
  bundleId: 'health-source-bundle',
  bundleVersion: '1.0.0',
  bundleDigest: digest({ bundle: 'health-source-bundle-v1' }),
  reducerDigest: digest({ reducers: 'health-source-reducers-v1' }),
  configurationDigest: digest({ configuration: 'health-source-v1' }),
  eventRegistryDigest: digest({ registry: 'health-source-v1' }),
});

const SOURCE_VERSIONS = Object.freeze({
  semanticConcentration: 'semantic-v1',
  progress: 'progress-v1',
  frontier: 'frontier-v1',
  quality: 'quality-v1',
  budgetPressure: 'budget-v1',
  cycleEvent: 'cycle-policy-v1',
});

function adapterDefinition(): ModeHealthAdapterDefinition {
  return {
    modeId: MODE_ID,
    adapterId: 'fixture-mode-health-adapter',
    adapterVersion: '1.0.0',
    projection: PROJECTION,
    fields: {
      semanticConcentration: 'required',
      progress: 'required',
      frontier: 'required',
      quality: 'optional',
      budgetPressure: 'optional',
      cycleEvent: 'optional',
    },
    sourceVersions: {
      semanticConcentration: [SOURCE_VERSIONS.semanticConcentration],
      progress: [SOURCE_VERSIONS.progress],
      frontier: [SOURCE_VERSIONS.frontier],
      quality: [SOURCE_VERSIONS.quality],
      budgetPressure: [SOURCE_VERSIONS.budgetPressure],
      cycleEvent: [SOURCE_VERSIONS.cycleEvent],
    },
    sourceReducerDigests: {
      semanticConcentration: [digest({
        sourceId: 'semantic-gauge',
        sourceVersion: SOURCE_VERSIONS.semanticConcentration,
      })],
      progress: [digest({
        sourceId: 'progress-gauge',
        sourceVersion: SOURCE_VERSIONS.progress,
      })],
      frontier: [digest({
        sourceId: 'frontier-gauge',
        sourceVersion: SOURCE_VERSIONS.frontier,
      })],
      quality: [digest({
        sourceId: 'quality-gauge',
        sourceVersion: SOURCE_VERSIONS.quality,
      })],
      budgetPressure: [digest({
        sourceId: 'budget-receipt',
        sourceVersion: SOURCE_VERSIONS.budgetPressure,
      })],
      cycleEvent: [digest({ cyclePolicy: 1 })],
    },
  };
}

function harness(): {
  readonly adapter: RegisteredModeHealthAdapter;
  readonly adapters: ModeHealthAdapterRegistry;
  readonly projector: HealthObservationProjector;
} {
  const adapters = new ModeHealthAdapterRegistry([adapterDefinition()]);
  const adapter = adapters.resolve(MODE_ID, 'fixture-mode-health-adapter', '1.0.0');
  return {
    adapter,
    adapters,
    projector: new HealthObservationProjector(
      adapters,
      createDefaultHealthPolicyRegistry(),
      HEALTH_POLICY_VERSION,
    ),
  };
}

function recordHash(sequence: number): string {
  return digest({ ledger: LEDGER_ID, sequence });
}

function sourceProvenance(sequence: number, sourceId: string, sourceVersion: string) {
  return {
    sourceId,
    sourceVersion,
    reducerDigest: digest({ sourceId, sourceVersion }),
    watermarkSequence: sequence,
    watermarkRecordHash: recordHash(sequence),
  };
}

function watermark(sequence: number): ProjectionWatermark {
  return {
    watermarkSchemaVersion: 1,
    ledgerId: LEDGER_ID,
    generationId: 'health-generation-v1',
    bundleId: PROJECTION.bundleId,
    bundleVersion: PROJECTION.bundleVersion,
    bundleDigest: PROJECTION.bundleDigest,
    reducerDigest: PROJECTION.reducerDigest,
    configurationDigest: PROJECTION.configurationDigest,
    eventRegistryDigest: PROJECTION.eventRegistryDigest,
    sequence,
    recordHash: recordHash(sequence),
    eventHash: digest({ event: sequence }),
    receiptId: `projection-receipt-${sequence}`,
    replayFingerprintDigest: digest({ replay: sequence }),
  };
}

function cycleEvent(
  state: CycleHealthEventPayload['health_state'] = 'cycle_confirmed',
  period = 1,
): CycleHealthEventPayload {
  const startCursor = {
    ledger_id: LEDGER_ID,
    sequence: 1,
    record_hash: recordHash(1),
  };
  const endCursor = {
    ledger_id: LEDGER_ID,
    sequence: 3,
    record_hash: recordHash(3),
  };
  const fingerprints = [digest({ fixed: true })];
  return {
    health_event_id: `cycle-event-${state}-${period}`,
    health_state: state,
    run_lineage_id: RUN_ID,
    detector_policy_version: SOURCE_VERSIONS.cycleEvent,
    detector_policy_digest: digest({ cyclePolicy: 1 }),
    signature_kind: state === 'cycle_confirmed' ? 'composite_state' : 'focus',
    period: state === 'cycle_cleared' ? 0 : period,
    occurrence_count: 3,
    start_cursor: startCursor,
    end_cursor: endCursor,
    start_iteration: 1,
    end_iteration: 3,
    progress_assessment: {
      gate_version: 'cycle-progress-v1',
      verdict: state === 'cycle_cleared' ? 'progress' : 'no_progress',
      basis: [state === 'cycle_cleared' ? 'independent_evidence' : 'no_progress'],
      start_iteration: 1,
      end_iteration: 3,
      path_coverage_gain_bps: state === 'cycle_cleared' ? 100 : 0,
      community_coverage_gain_bps: 0,
    },
    source_fingerprints: fingerprints,
    trace: [
      { iteration: 1, ledger_cursor: startCursor, fingerprint: fingerprints[0] },
      { iteration: 2, ledger_cursor: {
        ledger_id: LEDGER_ID,
        sequence: 2,
        record_hash: recordHash(2),
      }, fingerprint: fingerprints[0] },
      { iteration: 3, ledger_cursor: endCursor, fingerprint: fingerprints[0] },
    ],
    evidence_digest: digest({ state, period, fingerprints }),
  };
}

interface BoundaryOptions {
  readonly runId?: string;
  readonly lineageId?: string;
  readonly regionId?: string | null;
  readonly identity?: string;
  readonly textSimilarityBps?: number | null;
  readonly lowProgress?: boolean;
  readonly omitProgress?: boolean;
  readonly frontierStatus?: FrontierStatus;
  readonly quality?: Partial<QualityHealthObservation> | null;
  readonly budget?: BudgetPressureHealthObservation | null;
  readonly cycle?: CycleHealthEventPayload | null;
  readonly sourceEventIds?: readonly string[];
  readonly adapterDigest?: string;
  readonly watermarkSequence?: number;
  readonly progressReducerDigest?: string;
}

function boundary(
  sequence: number,
  adapter: RegisteredModeHealthAdapter,
  options: BoundaryOptions = {},
): HealthBoundaryInput {
  const lowProgress = options.lowProgress ?? false;
  const frontierStatus = options.frontierStatus ?? 'eligible';
  const projectionSequence = options.watermarkSequence ?? sequence;
  const quality = options.quality === null || options.quality === undefined
    ? null
    : adaptQuality({
        normalizedScoreBps: options.quality.normalizedScoreBps ?? 7_000,
        lowerConfidenceBoundBps: options.quality.lowerConfidenceBoundBps ?? 6_500,
        baselineId: options.quality.baselineId ?? 'quality-baseline-v1',
        baselineLowerConfidenceBoundBps:
          options.quality.baselineLowerConfidenceBoundBps ?? 7_000,
        evaluatorDigest: options.quality.evaluatorDigest ?? digest({ evaluator: 'v1' }),
        rubricDigest: options.quality.rubricDigest ?? digest({ rubric: 'v1' }),
        verifierDigest: options.quality.verifierDigest ?? digest({ verifier: 'v1' }),
        calibrationDigest: options.quality.calibrationDigest ?? digest({ calibration: 'v1' }),
        candidateRef: options.quality.candidateRef ?? `candidate-${sequence}`,
        validThroughSequence: options.quality.validThroughSequence ?? sequence + 20,
        provenance: sourceProvenance(sequence, 'quality-gauge', SOURCE_VERSIONS.quality),
      });
  return {
    runId: options.runId ?? RUN_ID,
    modeId: MODE_ID,
    lineageId: options.lineageId ?? LINEAGE_ID,
    regionId: options.regionId === undefined ? REGION_ID : options.regionId,
    completedAttemptId: `attempt-${sequence}`,
    ledgerCursor: {
      ledgerId: LEDGER_ID,
      sequence,
      recordHash: recordHash(sequence),
      eventHash: digest({ event: sequence }),
    },
    projectionWatermark: watermark(projectionSequence),
    sourceEventIds: options.sourceEventIds ?? [`source-b-${sequence}`, `source-a-${sequence}`],
    sourceDigests: {
      progress: digest({ progress: sequence }),
      semantic: digest({ semantic: sequence }),
    },
    adapterId: adapter.adapterId,
    adapterVersion: adapter.adapterVersion,
    adapterDigest: options.adapterDigest ?? adapter.adapterDigest,
    replayFingerprintDigest: digest({ replayPrefix: sequence }),
    inputs: createNormalizedHealthInputs({
      semanticConcentration: adaptSemanticConcentration({
        identityKind: 'semantic_community',
        identity: options.identity ?? `community-${sequence}`,
        textSimilarityBps: options.textSimilarityBps ?? null,
        provenance: sourceProvenance(
          sequence,
          'semantic-gauge',
          SOURCE_VERSIONS.semanticConcentration,
        ),
      }),
      progress: options.omitProgress
        ? null
        : adaptProgress({
            noveltyYieldBps: lowProgress ? 500 : 8_000,
            independentEvidenceYieldBps: lowProgress ? 500 : 8_000,
            coverageGainBps: lowProgress ? 0 : 500,
            claimProgressCount: lowProgress ? 0 : 1,
            qualifyingEvidenceIds: lowProgress ? [] : [`evidence-${sequence}`],
            provenance: {
              ...sourceProvenance(sequence, 'progress-gauge', SOURCE_VERSIONS.progress),
              reducerDigest: options.progressReducerDigest ?? digest({
                sourceId: 'progress-gauge',
                sourceVersion: SOURCE_VERSIONS.progress,
              }),
            },
          }),
      frontier: adaptFrontier({
        status: frontierStatus,
        eligibleWorkCount: frontierStatus === 'eligible' ? 2 : 0,
        frontierRef: frontierStatus === 'eligible' ? `frontier-${sequence}` : null,
        provenance: sourceProvenance(sequence, 'frontier-gauge', SOURCE_VERSIONS.frontier),
      }),
      quality,
      budgetPressure: options.budget ?? null,
      cycleEvent: options.cycle ?? null,
    }),
  };
}

function applyAll(
  projector: HealthObservationProjector,
  inputs: readonly HealthBoundaryInput[],
): HealthProjectionResult[] {
  return inputs.map((input) => projector.apply(input));
}

function signalKinds(state: HealthProjectionState): string[] {
  return state.signals.map((signal) => signal.kind);
}

function activeSignals(state: HealthProjectionState): HealthSignal[] {
  return Object.values(state.activeSignals) as unknown as HealthSignal[];
}

function activeSignalKindsForLineage(
  state: HealthProjectionState,
  lineageId: string,
): string[] {
  return activeSignals(state)
    .filter((signal) => signal.scope.lineageId === lineageId)
    .map((signal) => signal.kind)
    .sort();
}

function budgetSample(
  sequence: number,
  kind: BudgetPressureHealthObservation['pressureKind'] = 'retry',
  evidenceYieldBps = kind === 'exhaustion' ? 0 : 500,
): BudgetPressureHealthObservation {
  const sourceEventType = kind === 'exhaustion'
    ? BudgetEventTypes.EXHAUSTION_RECORDED
    : kind === 'cancellation'
      ? BudgetEventTypes.RESERVATION_CANCELLED
      : BudgetEventTypes.RESERVATION_GRANTED;
  return adaptBudgetLifecyclePressure({
    eventType: sourceEventType,
    payload: {
      operation_id: `budget-decision-${sequence}`,
      request_id: `budget-request-${sequence}`,
      scope_id: MODE_ID,
      scope_path: [RUN_ID, MODE_ID],
      replay_fingerprint: digest({ budgetReplay: sequence }),
      reason_code: kind,
      before_balances: {},
      after_balances: {},
      data: {},
      outcome: {},
    },
    settledReceipt: {
      receiptId: `budget-receipt-${sequence}`,
      dispatchId: `dispatch-${sequence}`,
      replayFingerprint: digest({ receiptReplay: sequence }),
      pricingDigest: digest({ pricing: 'v1' }),
      terminalStatus: kind === 'cancellation' ? 'cancelled' : 'succeeded',
      usage: {
        tokens: { kind: 'tokens', unit: 'token', count: 100 },
        cost: {
          kind: 'cost',
          unit: 'minor-unit',
          minorUnits: 10,
          scale: 2,
          currency: 'EUR',
          pricingDigest: digest({ pricing: 'v1' }),
        },
        iterations: { kind: 'iterations', unit: 'attempt', attempts: 1 },
        wallTime: {
          kind: 'wall-time',
          unit: 'millisecond',
          durationMs: 1_000,
          deadlineMonotonicMs: 10_000,
        },
      },
    },
    pressureKind: kind,
    dimension: 'iterations',
    evidenceYieldBps,
    provenance: sourceProvenance(sequence, 'budget-receipt', SOURCE_VERSIONS.budgetPressure),
  });
}

// ───────────────────────────────────────────────────────────────────
// 2. HEALTHY AND COLLAPSE FIXTURES
// ───────────────────────────────────────────────────────────────────

describe('health degeneration harness', () => {
  it('keeps healthy progress and productive revisitation free of confirmed collapse', () => {
    const healthy = harness();
    const healthyResults = applyAll(
      healthy.projector,
      Array.from({ length: 8 }, (_, index) => boundary(index + 1, healthy.adapter)),
    );
    expect(healthyResults.at(-1)?.aggregate.state).toBe(HealthAggregateStates.HEALTHY);
    expect(signalKinds(healthy.projector.snapshot())).not.toContain(
      HealthSignalKinds.MODE_COLLAPSE,
    );

    const revisitation = harness();
    applyAll(
      revisitation.projector,
      Array.from({ length: 8 }, (_, index) => boundary(index + 1, revisitation.adapter, {
        identity: 'same-community',
      })),
    );
    expect(signalKinds(revisitation.projector.snapshot())).not.toContain(
      HealthSignalKinds.MODE_COLLAPSE,
    );
  });

  it('requires typed concentration and a multi-channel progress-floor violation together', () => {
    const collapsed = harness();
    applyAll(
      collapsed.projector,
      Array.from({ length: 8 }, (_, index) => boundary(index + 1, collapsed.adapter, {
        identity: 'collapsed-community',
        lowProgress: true,
      })),
    );
    expect(signalKinds(collapsed.projector.snapshot())).toContain(
      HealthSignalKinds.MODE_COLLAPSE,
    );
    const collapseSignal = collapsed.projector.snapshot().signals.find((signal) => (
      signal.kind === HealthSignalKinds.MODE_COLLAPSE
    ));
    expect(collapseSignal?.evidence.textSimilarityIgnored).toBe(true);
    expect(collapseSignal?.decisionTrace).toEqual(expect.arrayContaining([
      expect.objectContaining({ detector: 'typed_concentration', passed: true }),
      expect.objectContaining({ detector: 'multi_channel_progress_floor', passed: true }),
    ]));

    const textOnly = harness();
    applyAll(
      textOnly.projector,
      Array.from({ length: 8 }, (_, index) => boundary(index + 1, textOnly.adapter, {
        identity: `typed-community-${index}`,
        lowProgress: true,
        textSimilarityBps: 10_000,
      })),
    );
    expect(signalKinds(textOnly.projector.snapshot())).not.toContain(
      HealthSignalKinds.MODE_COLLAPSE,
    );
  });

  // ─────────────────────────────────────────────────────────────────
  // 3. CYCLE AND NOVELTY FIXTURES
  // ─────────────────────────────────────────────────────────────────

  it('consumes sibling cycle evidence verbatim and performs no cycle detection', () => {
    for (const period of [1, 2, 3, 4]) {
      const fixture = harness();
      const event = cycleEvent('cycle_confirmed', period);
      const result = fixture.projector.apply(boundary(1, fixture.adapter, { cycle: event }));
      const repetition = result.emittedSignals.find((signal) => (
        signal.kind === HealthSignalKinds.REPETITION
      ));
      expect(repetition?.evidence.cycleEvent).toEqual(event);
      expect(repetition?.evidence.consumedVerbatim).toBe(true);
      expect(repetition?.evidence.independentDetectionPerformed).toBe(false);
      expect(repetition?.evidence.cycleEvent).toMatchObject({
        period,
        source_fingerprints: event.source_fingerprints,
        start_cursor: event.start_cursor,
        end_cursor: event.end_cursor,
        progress_assessment: event.progress_assessment,
      });
    }

    const suspected = harness();
    const suspectedEvent = cycleEvent('cycle_suspected', 2);
    const suspectedResult = suspected.projector.apply(boundary(1, suspected.adapter, {
      cycle: suspectedEvent,
    }));
    expect(suspectedResult.emittedSignals.find((signal) => (
      signal.kind === HealthSignalKinds.REPETITION
    ))?.evidence.cycleEvent).toEqual(suspectedEvent);

    const cleared = harness();
    const clearedEvent = cycleEvent('cycle_cleared');
    const clearedResult = cleared.projector.apply(boundary(1, cleared.adapter, {
      cycle: clearedEvent,
    }));
    expect(clearedResult.observation.inputs.cycleEvent).toEqual(clearedEvent);
    expect(clearedResult.emittedSignals.map((signal) => signal.kind)).not.toContain(
      HealthSignalKinds.REPETITION,
    );
  });

  it('detects repeated low evidence only while eligible work remains', () => {
    const starved = harness();
    applyAll(
      starved.projector,
      Array.from({ length: 6 }, (_, index) => boundary(index + 1, starved.adapter, {
        lowProgress: true,
      })),
    );
    expect(signalKinds(starved.projector.snapshot())).toContain(
      HealthSignalKinds.NOVELTY_STARVATION,
    );

    for (const frontierStatus of ['exhausted', 'empty', 'unknown'] as const) {
      const exhausted = harness();
      applyAll(
        exhausted.projector,
        Array.from({ length: 6 }, (_, index) => boundary(index + 1, exhausted.adapter, {
          lowProgress: true,
          frontierStatus,
        })),
      );
      expect(signalKinds(exhausted.projector.snapshot())).not.toContain(
        HealthSignalKinds.NOVELTY_STARVATION,
      );
      expect(signalKinds(exhausted.projector.snapshot())).toContain(
        HealthSignalKinds.NOT_EVALUABLE,
      );
      expect(exhausted.projector.snapshot().signals.find((signal) => (
        signal.kind === HealthSignalKinds.NOT_EVALUABLE
        && signal.evidence.frontierStatus === frontierStatus
      ))).toBeDefined();
    }
  });

  // ─────────────────────────────────────────────────────────────────
  // 4. QUALITY AND BUDGET FIXTURES
  // ─────────────────────────────────────────────────────────────────

  it('detects quality decay only from comparable calibrated evidence', () => {
    const decaying = harness();
    const bounds = [6_000, 5_500, 5_000, 4_500];
    applyAll(
      decaying.projector,
      bounds.map((lowerConfidenceBoundBps, index) => boundary(index + 1, decaying.adapter, {
        quality: { lowerConfidenceBoundBps },
      })),
    );
    const decay = decaying.projector.snapshot().signals.find((signal) => (
      signal.kind === HealthSignalKinds.QUALITY_DECAY
    ));
    expect(decay).toBeDefined();
    expect(decay?.evidence.provenance).toMatchObject({
      baselineId: 'quality-baseline-v1',
      evaluatorDigest: digest({ evaluator: 'v1' }),
      rubricDigest: digest({ rubric: 'v1' }),
      verifierDigest: digest({ verifier: 'v1' }),
    });

    const incomparable = harness();
    applyAll(incomparable.projector, [
      boundary(1, incomparable.adapter, { quality: { lowerConfidenceBoundBps: 6_000 } }),
      boundary(2, incomparable.adapter, {
        quality: {
          lowerConfidenceBoundBps: 5_500,
          evaluatorDigest: digest({ evaluator: 'other' }),
        },
      }),
      boundary(3, incomparable.adapter, { quality: { lowerConfidenceBoundBps: 5_000 } }),
      boundary(4, incomparable.adapter, { quality: { lowerConfidenceBoundBps: 4_500 } }),
    ]);
    expect(signalKinds(incomparable.projector.snapshot())).not.toContain(
      HealthSignalKinds.QUALITY_DECAY,
    );
    expect(incomparable.projector.snapshot().signals.some((signal) => (
      signal.kind === HealthSignalKinds.NOT_EVALUABLE
      && signal.evidence.reason === 'quality_incomparable'
    ))).toBe(true);
  });

  it('detects typed budget pressure with low yield but never relabels exhaustion', () => {
    const thrashing = harness();
    applyAll(
      thrashing.projector,
      Array.from({ length: 4 }, (_, index) => boundary(index + 1, thrashing.adapter, {
        budget: budgetSample(index + 1),
      })),
    );
    const thrash = thrashing.projector.snapshot().signals.find((signal) => (
      signal.kind === HealthSignalKinds.BUDGET_THRASH
    ));
    expect(thrash?.evidence).toMatchObject({
      dimension: 'iterations',
      pressureCount: 3,
      evidenceYieldFloorBps: DEFAULT_HEALTH_POLICY.budgetEvidenceYieldFloorBps,
    });

    const exhausted = harness();
    applyAll(exhausted.projector, [
      boundary(1, exhausted.adapter, { budget: budgetSample(1, 'exhaustion') }),
      boundary(2, exhausted.adapter, { budget: budgetSample(2, 'exhaustion') }),
      boundary(3, exhausted.adapter, { budget: budgetSample(3, 'exhaustion') }),
      boundary(4, exhausted.adapter, { budget: budgetSample(4, 'exhaustion') }),
    ]);
    expect(signalKinds(exhausted.projector.snapshot())).not.toContain(
      HealthSignalKinds.BUDGET_THRASH,
    );
  });

  // ─────────────────────────────────────────────────────────────────
  // 5. FAIL-CLOSED AND AGGREGATION FIXTURES
  // ─────────────────────────────────────────────────────────────────

  it('fails closed for missing, stale, gapped, conflicting, and unknown-version input', () => {
    const missing = harness();
    const missingResult = missing.projector.apply(boundary(1, missing.adapter, {
      omitProgress: true,
    }));
    expect(missingResult.aggregate.state).toBe(HealthAggregateStates.CRITICAL);
    expect(missingResult.emittedSignals.map((signal) => signal.kind)).toContain(
      HealthSignalKinds.TELEMETRY_GAP,
    );
    expect(missingResult.aggregate.state).not.toBe(HealthAggregateStates.HEALTHY);

    const stale = harness();
    const staleResult = stale.projector.apply(boundary(1, stale.adapter, {
      watermarkSequence: 2,
    }));
    expect(staleResult.emittedSignals.map((signal) => signal.kind)).toContain(
      HealthSignalKinds.TELEMETRY_GAP,
    );

    const unknownReducer = harness();
    const unknownReducerResult = unknownReducer.projector.apply(boundary(
      1,
      unknownReducer.adapter,
      { progressReducerDigest: digest({ reducer: 'unknown' }) },
    ));
    expect(unknownReducerResult.emittedSignals.map((signal) => signal.kind)).toContain(
      HealthSignalKinds.TELEMETRY_GAP,
    );
    expect(unknownReducerResult.observation.validationIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'UNSUPPORTED_SOURCE_REDUCER' }),
      ]),
    );

    const gapped = harness();
    gapped.projector.apply(boundary(1, gapped.adapter));
    const gapResult = gapped.projector.apply(boundary(3, gapped.adapter));
    expect(gapResult.emittedSignals.map((signal) => signal.kind)).toContain(
      HealthSignalKinds.TELEMETRY_GAP,
    );

    const conflict = harness();
    const first = boundary(1, conflict.adapter);
    conflict.projector.apply(first);
    expect(() => conflict.projector.apply({
      ...first,
      ledgerCursor: { ...first.ledgerCursor, eventHash: digest({ conflict: true }) },
    })).toThrowError(expect.objectContaining({ code: HealthHarnessErrorCodes.EVENT_CONFLICT }));

    const unknown = harness();
    const unknownInput = boundary(1, unknown.adapter);
    expect(() => new HealthObservationProjector(
      unknown.adapters,
      createDefaultHealthPolicyRegistry(),
      'unknown-health-policy',
    )).toThrowError(expect.objectContaining({ code: HealthHarnessErrorCodes.UNSUPPORTED_POLICY }));
    expect(() => unknown.projector.apply({
      ...unknownInput,
      adapterVersion: '9.9.9',
    })).toThrowError(expect.objectContaining({ code: HealthHarnessErrorCodes.ADAPTER_UNREGISTERED }));
  });

  it('aggregates simultaneous signals deterministically and requests rather than acts', () => {
    const first = harness();
    const second = harness();
    const inputs = [6_000, 5_500, 5_000, 4_500].map(
      (lowerConfidenceBoundBps, index) => boundary(index + 1, first.adapter, {
        lowProgress: true,
        quality: { lowerConfidenceBoundBps },
      }),
    );
    const reversedEvidence = inputs.map((input) => ({
      ...input,
      sourceEventIds: [...input.sourceEventIds].reverse(),
    }));
    const firstResult = lastValue(applyAll(first.projector, inputs));
    const secondResult = lastValue(applyAll(second.projector, reversedEvidence));
    expect(firstResult.observation.observationHash).toBe(secondResult.observation.observationHash);
    expect(firstResult.aggregate).toEqual(secondResult.aggregate);
    expect(firstResult.emittedSignals.map((signal) => signal.kind)).toEqual(
      expect.arrayContaining([
        HealthSignalKinds.NOVELTY_STARVATION,
        HealthSignalKinds.QUALITY_DECAY,
      ]),
    );
    expect(firstResult.responseRequests.map((request) => request.action)).toContain(
      HealthResponseActions.REQUEST_STOP,
    );
    for (const request of firstResult.responseRequests) {
      expect(request).toMatchObject({
        authority: 'request_only',
        authorizationState: 'pending_gateway',
        gatewayDecisionId: null,
        executionDecision: null,
        executionReceipt: null,
      });
    }
  });

  // ─────────────────────────────────────────────────────────────────
  // 6. RECOVERY, REPLAY, RESUME, AND DARK FIXTURES
  // ─────────────────────────────────────────────────────────────────

  it('requires present improving optional evidence before recovering its active signal', () => {
    const fixture = harness();
    applyAll(
      fixture.projector,
      Array.from({ length: 4 }, (_, index) => boundary(index + 1, fixture.adapter, {
        budget: budgetSample(index + 1),
      })),
    );
    expect(activeSignalKindsForLineage(
      fixture.projector.snapshot(),
      LINEAGE_ID,
    )).toContain(HealthSignalKinds.BUDGET_THRASH);

    const silentResults = applyAll(fixture.projector, [
      boundary(5, fixture.adapter),
      boundary(6, fixture.adapter),
      boundary(7, fixture.adapter),
    ]);
    expect(silentResults.flatMap((result) => result.emittedSignals.map((signal) => (
      signal.kind
    )))).not.toContain(HealthSignalKinds.HEALTH_RECOVERED);
    const silentState = fixture.projector.snapshot();
    expect(activeSignalKindsForLineage(silentState, LINEAGE_ID)).toContain(
      HealthSignalKinds.BUDGET_THRASH,
    );
    expect(silentState.signals).toEqual(expect.arrayContaining([
      expect.objectContaining({
        kind: HealthSignalKinds.NOT_EVALUABLE,
        evidence: expect.objectContaining({
          reason: 'active_signal_optional_field_absent',
          missingOptionalFields: ['budgetPressure'],
        }),
      }),
    ]));

    const improvementResults = applyAll(
      fixture.projector,
      Array.from({ length: 7 }, (_, index) => boundary(index + 8, fixture.adapter, {
        budget: budgetSample(index + 8, 'normal', 8_000),
      })),
    );
    expect(improvementResults.slice(0, -1).flatMap((result) => (
      result.emittedSignals.map((signal) => signal.kind)
    ))).not.toContain(HealthSignalKinds.HEALTH_RECOVERED);
    expect(lastValue(improvementResults).emittedSignals.map((signal) => signal.kind)).toContain(
      HealthSignalKinds.HEALTH_RECOVERED,
    );
    expect(activeSignalKindsForLineage(
      fixture.projector.snapshot(),
      LINEAGE_ID,
    )).not.toContain(HealthSignalKinds.BUDGET_THRASH);
  });

  it('isolates detection, recovery streaks, aggregates, and clearing by signal scope', () => {
    const lineageA = 'lineage-a';
    const lineageB = 'lineage-b';
    const shared = harness();
    const separateA = harness();
    const separateB = harness();
    const lineageAInputs = Array.from({ length: 6 }, (_, index) => boundary(
      index + 1,
      shared.adapter,
      {
        lineageId: lineageA,
        identity: 'lineage-a-collapsed-community',
        lowProgress: true,
      },
    ));
    const lineageBInputs = Array.from({ length: 5 }, (_, index) => boundary(
      index + 7,
      shared.adapter,
      { lineageId: lineageB },
    ));

    applyAll(shared.projector, lineageAInputs);
    applyAll(separateA.projector, lineageAInputs);
    const sharedLineageAIds = activeSignals(shared.projector.snapshot())
      .filter((signal) => signal.scope.lineageId === lineageA)
      .map((signal) => signal.signalId);
    expect(activeSignalKindsForLineage(shared.projector.snapshot(), lineageA)).toEqual(
      expect.arrayContaining([
        HealthSignalKinds.MODE_COLLAPSE,
        HealthSignalKinds.NOVELTY_STARVATION,
      ]),
    );

    const sharedLineageBResults = applyAll(shared.projector, lineageBInputs.slice(0, -1));
    const separateLineageBResults = applyAll(separateB.projector, lineageBInputs.slice(0, -1));
    expect(Object.values(shared.projector.snapshot().healthyWindowStreaks)).toEqual([1]);
    sharedLineageBResults.push(shared.projector.apply(lastValue(lineageBInputs)));
    separateLineageBResults.push(separateB.projector.apply(lastValue(lineageBInputs)));
    const lineageBDegenerationKinds = new Set([
      HealthSignalKinds.MODE_COLLAPSE,
      HealthSignalKinds.NOVELTY_STARVATION,
      HealthSignalKinds.QUALITY_DECAY,
      HealthSignalKinds.BUDGET_THRASH,
      HealthSignalKinds.REPETITION,
    ]);
    const sharedLineageBKinds = sharedLineageBResults.flatMap((result) => (
      result.emittedSignals.map((signal) => signal.kind)
    ));
    const separateLineageBKinds = separateLineageBResults.flatMap((result) => (
      result.emittedSignals.map((signal) => signal.kind)
    ));
    expect(sharedLineageBKinds.filter((kind) => lineageBDegenerationKinds.has(kind))).toEqual(
      separateLineageBKinds.filter((kind) => lineageBDegenerationKinds.has(kind)),
    );
    expect(sharedLineageBKinds.filter((kind) => lineageBDegenerationKinds.has(kind))).toEqual([]);
    expect(sharedLineageBResults.every((result) => (
      result.aggregate.activeSignalIds.every((signalId) => !sharedLineageAIds.includes(signalId))
    ))).toBe(true);
    expect(lastValue(sharedLineageBResults).emittedSignals.map((signal) => signal.kind)).toContain(
      HealthSignalKinds.HEALTH_RECOVERED,
    );
    expect(lastValue(separateLineageBResults).emittedSignals.map((signal) => signal.kind)).toContain(
      HealthSignalKinds.HEALTH_RECOVERED,
    );

    const sharedState = shared.projector.snapshot();
    expect(activeSignalKindsForLineage(sharedState, lineageA)).toEqual(
      activeSignalKindsForLineage(separateA.projector.snapshot(), lineageA),
    );
    expect(activeSignalKindsForLineage(sharedState, lineageA)).toEqual(
      expect.arrayContaining([
        HealthSignalKinds.MODE_COLLAPSE,
        HealthSignalKinds.NOVELTY_STARVATION,
      ]),
    );
    expect(activeSignalKindsForLineage(sharedState, lineageB)).toEqual([]);
  });

  it('requires two healthy windows to recover and preserves prior signal history', () => {
    const fixture = harness();
    const degraded = Array.from({ length: 8 }, (_, index) => boundary(
      index + 1,
      fixture.adapter,
      { identity: 'collapsed-community', lowProgress: true },
    ));
    applyAll(fixture.projector, degraded);
    const originalSignals = fixture.projector.snapshot().signals
      .filter((signal) => signal.kind === HealthSignalKinds.MODE_COLLAPSE)
      .map((signal) => signal.signalId);
    expect(originalSignals.length).toBeGreaterThan(0);

    fixture.projector.apply(boundary(9, fixture.adapter));
    fixture.projector.apply(boundary(10, fixture.adapter));
    const firstHealthyWindow = fixture.projector.apply(boundary(11, fixture.adapter));
    expect(firstHealthyWindow.emittedSignals.map((signal) => signal.kind)).not.toContain(
      HealthSignalKinds.HEALTH_RECOVERED,
    );
    const secondHealthyWindow = fixture.projector.apply(boundary(12, fixture.adapter));
    expect(secondHealthyWindow.emittedSignals.map((signal) => signal.kind)).toContain(
      HealthSignalKinds.HEALTH_RECOVERED,
    );
    expect(secondHealthyWindow.aggregate.state).toBe(HealthAggregateStates.RECOVERED);
    const state = fixture.projector.snapshot();
    expect(Object.keys(state.activeSignals)).toHaveLength(0);
    expect(originalSignals.every((signalId) => state.signals.some((signal) => (
      signal.signalId === signalId
    )))).toBe(true);
  });

  it('matches incremental replay, resumes from a verified snapshot, and deduplicates actions', () => {
    const continuous = harness();
    const inputs = Array.from({ length: 8 }, (_, index) => boundary(
      index + 1,
      continuous.adapter,
      {
        identity: 'replay-community',
        lowProgress: index < 6,
      },
    ));
    applyAll(continuous.projector, inputs);
    const continuousState = continuous.projector.snapshot();
    const replayedState = replayHealthObservations(
      inputs,
      continuous.adapters,
      createDefaultHealthPolicyRegistry(),
      HEALTH_POLICY_VERSION,
    );
    expect(replayedState.projectionHash).toBe(continuousState.projectionHash);
    expect(replayedState.observations.map((entry) => entry.observationHash)).toEqual(
      continuousState.observations.map((entry) => entry.observationHash),
    );

    const firstHalf = harness();
    applyAll(firstHalf.projector, inputs.slice(0, 4));
    const resumed = new HealthObservationProjector(
      firstHalf.adapters,
      createDefaultHealthPolicyRegistry(),
      HEALTH_POLICY_VERSION,
      firstHalf.projector.snapshot(),
    );
    applyAll(resumed, inputs.slice(4));
    expect(resumed.snapshot().projectionHash).toBe(continuousState.projectionHash);

    const duplicateHarness = harness();
    const collapseInputs = Array.from({ length: 6 }, (_, index) => boundary(
      index + 1,
      duplicateHarness.adapter,
      { identity: 'duplicate-community', lowProgress: true },
    ));
    const results = applyAll(duplicateHarness.projector, collapseInputs);
    const original = lastValue(results);
    const beforeDuplicate = duplicateHarness.projector.snapshot();
    const duplicate = duplicateHarness.projector.apply(lastValue(collapseInputs));
    expect(duplicate.status).toBe('idempotent');
    expect(duplicate.observation.observationHash).toBe(original.observation.observationHash);
    expect(duplicate.responseRequests.map((request) => request.requestId)).toEqual(
      original.responseRequests.map((request) => request.requestId),
    );
    expect(duplicateHarness.projector.snapshot().projectionHash).toBe(
      beforeDuplicate.projectionHash,
    );
  });

  it('keeps shadow observation beside the exact authoritative legacy result', () => {
    const fixture = harness();
    const legacy = Object.freeze({
      decision: 'CONTINUE',
      fanIn: 'legacy-fan-in',
      allocation: 'legacy-allocation',
      budget: 'legacy-budget',
      dispatches: ['legacy-dispatch'],
    });
    const shadow = observeHealthInShadow(
      legacy,
      fixture.projector,
      boundary(1, fixture.adapter),
    );
    expect(shadow.legacyResult).toBe(legacy);
    expect(shadow.authority).toBe('legacy_unchanged');
    for (let sequence = 2; sequence <= 5; sequence += 1) {
      fixture.projector.apply(boundary(sequence, fixture.adapter, {
        identity: 'shadow-collapse',
        lowProgress: true,
      }));
    }
    const degradedShadow = observeHealthInShadow(
      legacy,
      fixture.projector,
      boundary(6, fixture.adapter, {
        identity: 'shadow-collapse',
        lowProgress: true,
      }),
    );
    expect(degradedShadow.legacyResult).toBe(legacy);
    expect(degradedShadow.healthResult.emittedSignals.map((signal) => signal.kind)).toContain(
      HealthSignalKinds.NOVELTY_STARVATION,
    );
    expect(legacy).toEqual({
      decision: 'CONTINUE',
      fanIn: 'legacy-fan-in',
      allocation: 'legacy-allocation',
      budget: 'legacy-budget',
      dispatches: ['legacy-dispatch'],
    });
  });

  it('retains explicit policy windows, bounds, and action vocabulary', () => {
    expect(DEFAULT_HEALTH_POLICY).toMatchObject({
      observationWindow: 8,
      minimumComparableSamples: 4,
      collapseConcentrationCount: 6,
      noveltyWindow: 6,
      noveltyLowYieldCount: 4,
      qualityComparableSamples: 3,
      qualityDecayDeltaBps: 1_000,
      budgetDecisionWindow: 8,
      budgetPressureCount: 3,
      budgetPressureRatioBps: 3_000,
      healthyWindowsToRecover: 2,
    });
    expect(Object.values(HealthInputFields)).toHaveLength(6);
    expect(Object.values(HealthResponseActions).sort()).toEqual([
      'observe',
      'pause_mode',
      'pause_region',
      'quarantine_candidate',
      'repair_telemetry',
      'request_stop',
      'reseed_frontier',
    ]);
    expect(HealthHarnessError).toBeDefined();
  });
});
