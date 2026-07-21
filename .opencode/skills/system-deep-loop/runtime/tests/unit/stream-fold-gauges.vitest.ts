// ───────────────────────────────────────────────────────────────────
// MODULE: Stream-Fold Gauge Tests
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  GENESIS_RECORD_HASH,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  EventTypeRegistry,
  canonicalBytes,
  canonicalJson,
  prepareEventWrite,
  readEvent,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  COST_USAGE_EVENT_TYPE,
  GAUGE_RESULT_EVENT_TYPE,
  GaugeFamilies,
  GaugeRegistry,
  HEALTH_INPUT_EVENT_TYPE,
  NOVELTY_DISPOSITION_EVENT_TYPE,
  PROGRESS_OBLIGATION_EVENT_TYPE,
  PROGRESS_WORK_EVENT_TYPE,
  STANDARD_GAUGE_MANIFEST,
  StandardGaugeIds,
  StreamFoldGaugeErrorCodes,
  compareGaugeDark,
  createStandardGaugeRegistry,
  gaugeEvidenceEventDefinitions,
  prepareGaugeComparisonEvidence,
  prepareGaugeResultEvidence,
  recordGaugeEvidence,
  replayGauge,
  replayGaugeFromLedger,
} from '../../lib/stream-fold-gauges/index.js';

import type {
  GatewayAllowProof,
  LedgerHead,
  LedgerRecordFrame,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  TransitionAuthorizationRequest,
  VerifiedLedgerEvent,
} from '../../lib/authorized-ledger/index.js';
import type {
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
} from '../../lib/event-envelope/index.js';
import type {
  GaugeDefinition,
  GaugeEvidenceEnvelopeInput,
  GaugeReplayOutcome,
  LegacyGaugeSurface,
} from '../../lib/stream-fold-gauges/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURE CONTRACTS
// ───────────────────────────────────────────────────────────────────

const LEDGER_ID = 'stream-fold-gauge-fixture';
const AUDIT_LEDGER_ID = 'stream-fold-gauge-audit';
const TIMESTAMP = '2026-07-21T00:00:00.000Z';
const UNRELATED_EVENT_TYPE = 'deep-loop.fixture.unrelated-recorded';
const GAUGE_VERSION = '1.0.0';
const RESTART_TEST_NAME = 'emits byte-identical output in a hostile-locale child process';

const temporaryRoots: string[] = [];

interface SourceEventSpec {
  readonly eventType: string;
  readonly payload: JsonObject;
}

interface LegacySurfaceFixture {
  readonly surface: LegacyGaugeSurface;
  readonly source: string;
  readonly legacy: JsonObject;
}

const LEGACY_SURFACE_FIXTURES = [
  {
    surface: 'fanout-pool',
    source: 'runtime/scripts/fanout-pool.cjs#buildPoolGauges',
    legacy: { lag: 2, pending: 2, failed: 1, oldest_pending_lag_ms: 3_000 },
  },
  {
    surface: 'convergence',
    source: 'runtime/scripts/convergence.cjs#payload',
    legacy: {
      status: 'ok',
      graph_decision: 'STOP_BLOCKED',
      graph_decision_json: '"STOP_BLOCKED"',
      graph_signals_json: { questionCoverage: 0.75 },
      graph_blockers_json: [],
      graph_blockers_csv: '',
      graph_stop_blocked: true,
      graph_trace_json: [],
      graph_convergence_score: 0.75,
      graph_score_delta: null,
      graph_score_delta_json: 'null',
    },
  },
  {
    surface: 'coverage-signals',
    source: 'runtime/lib/coverage-graph/coverage-graph-signals.ts#ResearchConvergenceSignals',
    legacy: {
      questionCoverage: 0.75,
      claimVerificationRate: 0.5,
      contradictionDensity: 0.1,
      sourceDiversity: 0.8,
      evidenceDepth: 0.6,
    },
  },
  {
    surface: 'metrics-snapshot',
    source: 'runtime/lib/coverage-graph/coverage-graph-db.ts#CoverageSnapshot',
    legacy: {
      specFolder: 'spec-fixture',
      loopType: 'research',
      sessionId: 'session-fixture',
      iteration: 4,
      metrics: { score: 0.8 },
      nodeCount: 12,
      edgeCount: 20,
      createdAt: TIMESTAMP,
    },
  },
  {
    surface: 'observability',
    source: 'runtime/lib/deep-loop/observability-events.cjs#normalizeObservabilityEvent',
    legacy: {
      schema_version: 1,
      event_id: 'event-fixture',
      producer: 'convergence',
      stream: 'graph-convergence',
      subject: 'session-fixture',
      event: 'convergence_evaluated',
      status: 'ok',
      observed_at_iso: TIMESTAMP,
      payload: { graph_decision: 'STOP_BLOCKED' },
    },
  },
] satisfies readonly LegacySurfaceFixture[];

interface LedgerHarness {
  readonly rootDirectory: string;
  readonly registry: EventTypeRegistry;
  readonly policies: TransitionPolicyRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
}

function validateAnyObject(payload: Readonly<JsonObject>): boolean {
  return payload !== null && !Array.isArray(payload) && typeof payload === 'object';
}

function sourceDefinition(eventType: string, requiredFields: readonly string[]): EventTypeDefinition {
  return {
    eventType,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: { requiredFields, validate: validateAnyObject },
    }],
    upcasters: [],
  };
}

function createSourceRegistry(includeGaugeEvidence = true): EventTypeRegistry {
  const definitions: EventTypeDefinition[] = [
    sourceDefinition(PROGRESS_WORK_EVENT_TYPE, ['state', 'work_id']),
    sourceDefinition(PROGRESS_OBLIGATION_EVENT_TYPE, ['obligation_id', 'state']),
    sourceDefinition(NOVELTY_DISPOSITION_EVENT_TYPE, ['claim_id', 'disposition']),
    sourceDefinition(COST_USAGE_EVENT_TYPE, ['amount', 'direction', 'scope_id', 'unit']),
    sourceDefinition(HEALTH_INPUT_EVENT_TYPE, ['metric', 'queue_id', 'value']),
    sourceDefinition(UNRELATED_EVENT_TYPE, ['value']),
  ];
  if (includeGaugeEvidence) definitions.push(...gaugeEvidenceEventDefinitions());
  return new EventTypeRegistry(definitions);
}

function envelopeInput(
  registry: EventTypeRegistry,
  index: number,
  eventType: string,
  payload: JsonObject,
): EventWritePreflight {
  return prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: `gauge-event-${index}`,
    event_type: eventType,
    event_version: 1,
    stream_id: 'gauge-fixture-stream',
    stream_sequence: index,
    occurred_at: TIMESTAMP,
    recorded_at: TIMESTAMP,
    producer: { name: 'stream-fold-gauge-tests', version: '1' },
    authority_epoch: 1,
    correlation_id: `gauge-correlation-${index}`,
    causation_id: index === 1 ? null : `gauge-event-${index - 1}`,
    idempotency_key: `gauge-idempotency-${index}`,
    payload,
  }, registry);
}

function syntheticEvents(
  registry: EventTypeRegistry,
  specs: readonly SourceEventSpec[],
): readonly VerifiedLedgerEvent[] {
  let priorHash = GENESIS_RECORD_HASH;
  return Object.freeze(specs.map((spec, offset) => {
    const sequence = offset + 1;
    const prepared = envelopeInput(registry, sequence, spec.eventType, spec.payload);
    const receipt = {
      ledger_id: LEDGER_ID,
      sequence,
      event_id: prepared.identity.eventId,
      event_type: prepared.identity.eventType,
      event_version: prepared.identity.eventVersion,
      stream_id: prepared.identity.streamId,
      stream_sequence: prepared.identity.streamSequence,
      committed_at: TIMESTAMP,
    };
    const authorizationRef = {
      audit_ledger_id: AUDIT_LEDGER_ID,
      audit_sequence: sequence,
      audit_record_hash: sha256Bytes(canonicalBytes({ audit: sequence })),
      decision_id: `decision-${sequence}`,
      decision_digest: sha256Bytes(canonicalBytes({ decision: sequence })),
      request_digest: sha256Bytes(canonicalBytes({ request: sequence })),
      policy_digest: sha256Bytes(canonicalBytes({ policy: 'allow' })),
      authority_epoch: 1,
    };
    const hashInput: Omit<LedgerRecordFrame, 'record_hash'> = {
      frame_version: 1,
      ledger_id: LEDGER_ID,
      sequence,
      prev_record_hash: priorHash,
      canonical_event_hash: prepared.canonicalDigest,
      authorization_ref: authorizationRef,
      receipt,
      canonical_event_bytes: Buffer.from(prepared.canonicalBytes).toString('base64'),
    };
    const frame: LedgerRecordFrame = Object.freeze({
      ...hashInput,
      record_hash: sha256Bytes(canonicalBytes(hashInput)),
    });
    priorHash = frame.record_hash;
    return Object.freeze({
      frame,
      event: readEvent(Uint8Array.from(prepared.canonicalBytes), registry),
    });
  }));
}

function ledgerHead(events: readonly VerifiedLedgerEvent[], sequence = events.length): LedgerHead {
  return Object.freeze({
    ledgerId: LEDGER_ID,
    sequence,
    recordHash: sequence === 0 ? GENESIS_RECORD_HASH : events[sequence - 1].frame.record_hash,
  });
}

function standardSpecs(): readonly SourceEventSpec[] {
  return [
    { eventType: PROGRESS_WORK_EVENT_TYPE, payload: { work_id: 'work-a', state: 'open' } },
    { eventType: PROGRESS_OBLIGATION_EVENT_TYPE, payload: { obligation_id: 'evidence-a', state: 'open' } },
    { eventType: NOVELTY_DISPOSITION_EVENT_TYPE, payload: { claim_id: 'claim-a', disposition: 'reused' } },
    { eventType: COST_USAGE_EVENT_TYPE, payload: {
      scope_id: 'root', unit: 'tokens', direction: 'debit', amount: '900719925474099312345',
    } },
    { eventType: HEALTH_INPUT_EVENT_TYPE, payload: { queue_id: 'fanout', metric: 'pending', value: '3' } },
    { eventType: HEALTH_INPUT_EVENT_TYPE, payload: { queue_id: 'fanout', metric: 'failed', value: '1' } },
    { eventType: PROGRESS_WORK_EVENT_TYPE, payload: { work_id: 'work-a', state: 'completed' } },
    { eventType: PROGRESS_OBLIGATION_EVENT_TYPE, payload: { obligation_id: 'evidence-a', state: 'covered' } },
    { eventType: NOVELTY_DISPOSITION_EVENT_TYPE, payload: { claim_id: 'claim-b', disposition: 'contradicted' } },
    { eventType: COST_USAGE_EVENT_TYPE, payload: {
      scope_id: 'root', unit: 'tokens', direction: 'credit', amount: '5',
    } },
    { eventType: COST_USAGE_EVENT_TYPE, payload: {
      scope_id: 'root', unit: 'currency_minor', direction: 'debit', amount: '250',
    } },
    { eventType: HEALTH_INPUT_EVENT_TYPE, payload: { queue_id: 'fanout', metric: 'pending', value: '2' } },
  ];
}

function replay(
  gaugeRegistry: GaugeRegistry,
  registry: EventTypeRegistry,
  events: readonly VerifiedLedgerEvent[],
  gaugeId: string,
  checkpoint?: unknown,
  cutoff = ledgerHead(events),
): GaugeReplayOutcome {
  return replayGauge(gaugeRegistry, {
    verifiedEvents: events,
    cutoff,
    eventRegistryDigest: registry.digest,
    gaugeId,
    gaugeVersion: GAUGE_VERSION,
    checkpoint,
  });
}

function baseGaugeDefinition(overrides: Partial<GaugeDefinition> = {}): GaugeDefinition {
  return {
    gaugeId: 'deep-loop.fixture.counter',
    gaugeVersion: GAUGE_VERSION,
    family: GaugeFamilies.PROGRESS,
    acceptedEvents: [{ eventType: UNRELATED_EVENT_TYPE, effectiveVersions: [1] }],
    reducerIdentity: 'fixture-counter-v1',
    outputSchemaVersion: '1',
    configuration: {},
    numericPolicy: { representation: 'safe-integer' },
    missingValueSemantics: 'Missing events contribute zero.',
    downstreamOwner: 'test consumer',
    unknownEventPolicy: 'ignore',
    dependencies: [],
    initialAccumulator: { count: 0 },
    reduce: (state) => ({ count: Number(state.count) + 1 }),
    finalize: (state) => ({ count: state.count ?? 0 }),
    validateAccumulator: (state) => Number.isSafeInteger(state.count),
    validateOutput: (output) => Number.isSafeInteger(output.count),
    ...overrides,
  };
}

function temporaryRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'stream-fold-gauges-'));
  temporaryRoots.push(root);
  return root;
}

function evaluatePolicy(input: Readonly<PolicyEvaluationInput>): PolicyEvaluationResult {
  return input.capabilityId === 'write'
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['write-evidence'] }
    : { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: ['write-evidence'] };
}

function createHarness(): LedgerHarness {
  const rootDirectory = temporaryRoot();
  const registry = createSourceRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'gauge-evidence-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['write-evidence'],
    evaluate: evaluatePolicy,
  }]);
  const authorityProvider = () => Object.freeze({ state: 'shadowing' as const, epoch: 1 });
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: LEDGER_ID,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider,
    now: () => new Date(TIMESTAMP),
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider,
    now: () => new Date(TIMESTAMP),
  }, ledger, policies);
  return { rootDirectory, registry, policies, ledger, gateway };
}

async function requestFor(
  harness: LedgerHarness,
  event: EventWritePreflight,
  requestId: string,
  capabilityId = 'write',
): Promise<TransitionAuthorizationRequest> {
  const policy = harness.policies.resolve('gauge-evidence-policy', 1);
  return {
    requestId,
    mode: 'research',
    event,
    priorHead: await harness.ledger.getVerifiedHead(),
    priorStateVersion: 'gauge-fixture@1',
    priorStateFingerprint: sha256Bytes(canonicalBytes({ state: 'fixture' })),
    actorId: 'gauge-test',
    capabilityId,
    authorityEpoch: 1,
    policy: {
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    },
    evidenceDigest: sha256Bytes(canonicalBytes({ evidence: requestId })),
  };
}

async function authorizeAndAppend(
  harness: LedgerHarness,
  event: EventWritePreflight,
  requestId: string,
): Promise<GatewayAllowProof> {
  const result = await harness.gateway.authorize(await requestFor(harness, event, requestId));
  expect(result.verdict).toBe('allow');
  if (result.verdict !== 'allow') throw new Error(`Expected allow, received ${result.reasonCode}`);
  await harness.ledger.appendAuthorized(event, result.proof);
  return result.proof;
}

function evidenceEnvelope(index: number): GaugeEvidenceEnvelopeInput {
  return {
    eventId: `gauge-evidence-${index}`,
    streamId: 'gauge-evidence-stream',
    streamSequence: index,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'stream-fold-gauge-tests', version: '1' },
    authorityEpoch: 1,
    correlationId: `gauge-evidence-${index}`,
    causationId: null,
    idempotencyKey: `gauge-evidence-${index}`,
  };
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

// ───────────────────────────────────────────────────────────────────
// 2. REGISTRY CONTRACT
// ───────────────────────────────────────────────────────────────────

describe('stream-fold gauge registry', () => {
  it('registers one immutable manifest entry for every standard family', () => {
    const registry = createStandardGaugeRegistry();
    expect(registry.inspect()).toHaveLength(4);
    expect(new Set(registry.inspect().map(({ family }) => family))).toEqual(
      new Set(['progress', 'novelty', 'cost', 'health']),
    );
    expect(STANDARD_GAUGE_MANIFEST).toEqual(registry.inspect());
    expect(Object.isFrozen(registry.inspect())).toBe(true);
    expect(registry.digest).toBe('fc75b4e36e55c70398d104d75f5bf96e0331085b19672e52454a201d10f4bd2f');
  });

  it('rejects duplicate identities, missing dependencies, and dependency cycles', () => {
    expect(() => new GaugeRegistry([baseGaugeDefinition(), baseGaugeDefinition()]))
      .toThrowError(expect.objectContaining({ code: StreamFoldGaugeErrorCodes.REGISTRY_DUPLICATE }));
    expect(() => new GaugeRegistry([baseGaugeDefinition({ dependencies: ['deep-loop.missing.gauge'] })]))
      .toThrowError(expect.objectContaining({ code: StreamFoldGaugeErrorCodes.REGISTRY_INCOMPLETE }));
    const first = baseGaugeDefinition({
      gaugeId: 'deep-loop.fixture.first',
      dependencies: ['deep-loop.fixture.second'],
    });
    const second = baseGaugeDefinition({
      gaugeId: 'deep-loop.fixture.second',
      dependencies: ['deep-loop.fixture.first'],
    });
    expect(() => new GaugeRegistry([first, second]))
      .toThrowError(expect.objectContaining({ code: StreamFoldGaugeErrorCodes.DEPENDENCY_CYCLE }));
  });

  it('rejects self-publication and direct ambient reducer capabilities', () => {
    expect(() => new GaugeRegistry([baseGaugeDefinition({
      acceptedEvents: [{ eventType: GAUGE_RESULT_EVENT_TYPE, effectiveVersions: [1] }],
    })])).toThrowError(expect.objectContaining({
      code: StreamFoldGaugeErrorCodes.SELF_INPUT_FORBIDDEN,
    }));
    expect(() => new GaugeRegistry([baseGaugeDefinition({
      reduce: (state) => ({ ...state, observed: Date.now() }),
    })])).toThrowError(expect.objectContaining({
      code: StreamFoldGaugeErrorCodes.AMBIENT_DEPENDENCY,
    }));
  });

  it('changes the reducer digest when fold semantics change', () => {
    const first = new GaugeRegistry([baseGaugeDefinition()]);
    const second = new GaugeRegistry([baseGaugeDefinition({
      reduce: (state) => ({ count: Number(state.count) + 2 }),
    })]);
    expect(first.resolve('deep-loop.fixture.counter', GAUGE_VERSION).reducerDigest)
      .not.toBe(second.resolve('deep-loop.fixture.counter', GAUGE_VERSION).reducerDigest);
  });
});

// ───────────────────────────────────────────────────────────────────
// 3. STANDARD FOLDS AND REPLAY
// ───────────────────────────────────────────────────────────────────

describe('standard gauge folds', () => {
  it('rebuilds progress, novelty, cost, and health from explicit ledger facts', () => {
    const sourceRegistry = createSourceRegistry();
    const gaugeRegistry = createStandardGaugeRegistry();
    const events = syntheticEvents(sourceRegistry, standardSpecs());
    expect(ledgerHead(events)).toEqual({
      ledgerId: LEDGER_ID,
      sequence: 12,
      recordHash: '6f8f1092575320a0aafe6bc713a3023b7d1ededfef4cb9d43bc97395a451786f',
    });

    expect(replay(gaugeRegistry, sourceRegistry, events, StandardGaugeIds.PROGRESS).result.output)
      .toMatchObject({
        totalWork: 1,
        openWork: 0,
        completedWork: 1,
        totalObligations: 1,
        coveredObligations: 1,
        acceptedEvents: 4,
      });
    expect(replay(gaugeRegistry, sourceRegistry, events, StandardGaugeIds.NOVELTY).result.output)
      .toMatchObject({ reused: 1, contradicted: 1, novel: 0, superseded: 0, unknown: 0 });
    expect(replay(gaugeRegistry, sourceRegistry, events, StandardGaugeIds.COST).result.output)
      .toMatchObject({
        totalsByScope: {
          root: { tokens: '900719925474099312340', currency_minor: '250' },
        },
      });
    expect(replay(gaugeRegistry, sourceRegistry, events, StandardGaugeIds.HEALTH).result.output)
      .toMatchObject({
        totalsByMetric: { pending: '2', failed: '1', retried: '0', integrity_refused: '0' },
      });
  });

  it('uses ledger sequence as the immutable novelty window', () => {
    const sourceRegistry = createSourceRegistry();
    const events = syntheticEvents(sourceRegistry, standardSpecs());
    const gaugeRegistry = createStandardGaugeRegistry({
      noveltyWindowStartSequence: 9,
      noveltyWindowEndSequence: 9,
    });
    expect(replay(gaugeRegistry, sourceRegistry, events, StandardGaugeIds.NOVELTY).result.output)
      .toMatchObject({ contradicted: 1, reused: 0, firstIncludedSequence: 9, lastIncludedSequence: 9 });
  });

  it('ignores unrelated verified events only under the declared policy', () => {
    const sourceRegistry = createSourceRegistry();
    const events = syntheticEvents(sourceRegistry, [
      { eventType: UNRELATED_EVENT_TYPE, payload: { value: 'unrelated' } },
    ]);
    const standard = replay(
      createStandardGaugeRegistry(),
      sourceRegistry,
      events,
      StandardGaugeIds.PROGRESS,
    );
    expect(standard.result.output).toMatchObject({ totalWork: 0, acceptedEvents: 0 });

    const rejecting = new GaugeRegistry([baseGaugeDefinition({
      acceptedEvents: [{ eventType: PROGRESS_WORK_EVENT_TYPE, effectiveVersions: [1] }],
      unknownEventPolicy: 'reject',
    })]);
    expect(() => replay(rejecting, sourceRegistry, events, 'deep-loop.fixture.counter'))
      .toThrowError(expect.objectContaining({ code: StreamFoldGaugeErrorCodes.UNSUPPORTED_EVENT }));
  });

  it('rejects unsupported accepted-event versions before yielding a result', () => {
    const sourceRegistry = createSourceRegistry();
    const events = syntheticEvents(sourceRegistry, [
      { eventType: UNRELATED_EVENT_TYPE, payload: { value: 'fixture' } },
    ]);
    const gaugeRegistry = new GaugeRegistry([baseGaugeDefinition({
      acceptedEvents: [{ eventType: UNRELATED_EVENT_TYPE, effectiveVersions: [2] }],
    })]);
    expect(() => replay(gaugeRegistry, sourceRegistry, events, 'deep-loop.fixture.counter'))
      .toThrowError(expect.objectContaining({
        code: StreamFoldGaugeErrorCodes.UNSUPPORTED_EVENT_VERSION,
      }));
  });

  it.each([
    ['cost amount', COST_USAGE_EVENT_TYPE, {
      scope_id: 'root', unit: 'tokens', direction: 'debit', amount: '01',
    }, StandardGaugeIds.COST, StreamFoldGaugeErrorCodes.INVALID_UNIT],
    ['cost unit', COST_USAGE_EVENT_TYPE, {
      scope_id: 'root', unit: 'seconds', direction: 'debit', amount: '1',
    }, StandardGaugeIds.COST, StreamFoldGaugeErrorCodes.INVALID_UNIT],
    ['health metric', HEALTH_INPUT_EVENT_TYPE, {
      queue_id: 'fanout', metric: 'healthy', value: '1',
    }, StandardGaugeIds.HEALTH, StreamFoldGaugeErrorCodes.INVALID_UNIT],
    ['novelty disposition', NOVELTY_DISPOSITION_EVENT_TYPE, {
      claim_id: 'claim-a', disposition: 'maybe',
    }, StandardGaugeIds.NOVELTY, StreamFoldGaugeErrorCodes.INVALID_PAYLOAD],
  ] as const)('fails closed on invalid %s', (_label, eventType, payload, gaugeId, code) => {
    const sourceRegistry = createSourceRegistry();
    const events = syntheticEvents(sourceRegistry, [{ eventType, payload }]);
    expect(() => replay(createStandardGaugeRegistry(), sourceRegistry, events, gaugeId))
      .toThrowError(expect.objectContaining({ code }));
  });

  it('rejects sequence gaps and hash forks before reducer execution', () => {
    const sourceRegistry = createSourceRegistry();
    const events = syntheticEvents(sourceRegistry, standardSpecs().slice(0, 2));
    const forked = ([{
      ...events[0],
      frame: { ...events[0].frame, prev_record_hash: 'f'.repeat(64) },
    }] as unknown) as VerifiedLedgerEvent[];
    expect(() => replay(
      createStandardGaugeRegistry(),
      sourceRegistry,
      forked,
      StandardGaugeIds.PROGRESS,
      undefined,
      { ledgerId: LEDGER_ID, sequence: 1, recordHash: forked[0].frame.record_hash },
    )).toThrowError(expect.objectContaining({ code: StreamFoldGaugeErrorCodes.STREAM_INTEGRITY }));
  });

  it('supports empty and long exact streams without host numeric coercion', () => {
    const sourceRegistry = createSourceRegistry();
    const gaugeRegistry = createStandardGaugeRegistry();
    const empty = replay(
      gaugeRegistry,
      sourceRegistry,
      [],
      StandardGaugeIds.COST,
      undefined,
      ledgerHead([], 0),
    );
    expect(empty.result.output).toEqual({ acceptedEvents: 0, totalsByScope: {} });

    const specs = Array.from({ length: 200 }, () => ({
      eventType: COST_USAGE_EVENT_TYPE,
      payload: { scope_id: 'root', unit: 'tool_uses', direction: 'debit', amount: '1' },
    }));
    const events = syntheticEvents(sourceRegistry, specs);
    expect(replay(gaugeRegistry, sourceRegistry, events, StandardGaugeIds.COST).result.output)
      .toMatchObject({ totalsByScope: { root: { tool_uses: '200' } } });
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. CHECKPOINTS AND PROCESS RESTARTS
// ───────────────────────────────────────────────────────────────────

describe('checkpoint and restart parity', () => {
  it('matches full replay for every prefix and records incremental work', () => {
    const sourceRegistry = createSourceRegistry();
    const gaugeRegistry = createStandardGaugeRegistry();
    const events = syntheticEvents(sourceRegistry, standardSpecs());
    for (const gaugeId of Object.values(StandardGaugeIds)) {
      const full = replay(gaugeRegistry, sourceRegistry, events, gaugeId);
      for (let split = 0; split <= events.length; split += 1) {
        const prefix = replay(
          gaugeRegistry,
          sourceRegistry,
          events,
          gaugeId,
          undefined,
          ledgerHead(events, split),
        );
        const incremental = replay(
          gaugeRegistry,
          sourceRegistry,
          events,
          gaugeId,
          prefix.checkpoint,
        );
        expect(incremental.accumulatorBytes).toEqual(full.accumulatorBytes);
        expect(incremental.outputBytes).toEqual(full.outputBytes);
        expect(incremental.result.computationMode).toBe('incremental');
        expect(incremental.result.eventsProcessed).toBe(events.length - split);
      }
    }
  });

  it.each([
    ['checkpointSchemaVersion', 2, 'malformed'],
    ['ledgerId', 'different-ledger', 'identity-mismatch'],
    ['lastSequence', 99, 'malformed'],
    ['lastRecordHash', 'f'.repeat(64), 'prefix-mismatch'],
    ['gaugeRegistryDigest', 'f'.repeat(64), 'definition-mismatch'],
    ['gaugeVersion', '2.0.0', 'identity-mismatch'],
    ['reducerDigest', 'f'.repeat(64), 'definition-mismatch'],
    ['configurationDigest', 'f'.repeat(64), 'definition-mismatch'],
    ['eventRegistryDigest', 'f'.repeat(64), 'event-registry-mismatch'],
    ['accumulatorHash', 'f'.repeat(64), 'accumulator-corrupt'],
  ] as const)('rebuilds from genesis when checkpoint %s drifts', (field, value, rejectionCode) => {
    const sourceRegistry = createSourceRegistry();
    const gaugeRegistry = createStandardGaugeRegistry();
    const events = syntheticEvents(sourceRegistry, standardSpecs());
    const prefix = replay(
      gaugeRegistry,
      sourceRegistry,
      events,
      StandardGaugeIds.PROGRESS,
      undefined,
      ledgerHead(events, 4),
    );
    const mutated = { ...prefix.checkpoint, [field]: value };
    const rebuilt = replay(
      gaugeRegistry,
      sourceRegistry,
      events,
      StandardGaugeIds.PROGRESS,
      mutated,
    );
    const full = replay(gaugeRegistry, sourceRegistry, events, StandardGaugeIds.PROGRESS);
    expect(rebuilt.result.computationMode).toBe('full-rebuild');
    expect(rebuilt.result.checkpointProvenance).toMatchObject({ status: 'rejected', rejectionCode });
    expect(rebuilt.outputBytes).toEqual(full.outputBytes);
  });

  it('rebuilds when canonical accumulator bytes are corrupt', () => {
    const sourceRegistry = createSourceRegistry();
    const gaugeRegistry = createStandardGaugeRegistry();
    const events = syntheticEvents(sourceRegistry, standardSpecs());
    const prefix = replay(
      gaugeRegistry,
      sourceRegistry,
      events,
      StandardGaugeIds.HEALTH,
      undefined,
      ledgerHead(events, 6),
    );
    const bytes = Buffer.from(prefix.checkpoint.accumulatorBytesBase64, 'base64');
    bytes[bytes.length - 1] ^= 1;
    const mutated = {
      ...prefix.checkpoint,
      accumulatorBytesBase64: bytes.toString('base64'),
      accumulatorHash: sha256Bytes(bytes),
    };
    const rebuilt = replay(
      gaugeRegistry,
      sourceRegistry,
      events,
      StandardGaugeIds.HEALTH,
      mutated,
    );
    expect(rebuilt.result.checkpointProvenance).toMatchObject({
      status: 'rejected',
      rejectionCode: 'accumulator-corrupt',
    });
  });

  it(RESTART_TEST_NAME, () => {
    const childMode = process.env.STREAM_FOLD_GAUGE_CHILD === '1';
    const originalLocaleCompare = String.prototype.localeCompare;
    if (childMode) {
      String.prototype.localeCompare = function hostileLocaleCompare(
        this: string,
        other: string,
      ): number {
        return this < other ? 1 : this > other ? -1 : 0;
      } as typeof String.prototype.localeCompare;
    }
    try {
      const sourceRegistry = createSourceRegistry();
      const events = syntheticEvents(sourceRegistry, standardSpecs());
      const bytes = Buffer.from(replay(
        createStandardGaugeRegistry(),
        sourceRegistry,
        events,
        StandardGaugeIds.COST,
      ).resultBytes).toString('base64');
      if (childMode) {
        expect(bytes).toBe(process.env.STREAM_FOLD_GAUGE_EXPECTED);
        return;
      }
      const vitestBin = fileURLToPath(new URL(
        '../../../../system-spec-kit/mcp-server/node_modules/.bin/vitest',
        import.meta.url,
      ));
      const configPath = fileURLToPath(new URL('../../vitest.config.ts', import.meta.url));
      const child = spawnSync(vitestBin, [
        'run',
        '--config',
        configPath,
        fileURLToPath(import.meta.url),
        '-t',
        RESTART_TEST_NAME,
      ], {
        encoding: 'utf8',
        env: {
          ...process.env,
          LANG: 'tr_TR.UTF-8',
          LC_ALL: 'tr_TR.UTF-8',
          STREAM_FOLD_GAUGE_CHILD: '1',
          STREAM_FOLD_GAUGE_EXPECTED: bytes,
        },
      });
      expect(child.status, child.stdout + child.stderr).toBe(0);
    } finally {
      String.prototype.localeCompare = originalLocaleCompare;
    }
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. FINGERPRINTS, DARK COMPARISON, AND PUBLICATION
// ───────────────────────────────────────────────────────────────────

describe('replay fingerprints and dark evidence', () => {
  it('binds a ledger replay to the shipped replay-fingerprint identity', async () => {
    const harness = createHarness();
    const first = envelopeInput(harness.registry, 1, COST_USAGE_EVENT_TYPE, {
      scope_id: 'root', unit: 'tokens', direction: 'debit', amount: '7',
    });
    const second = envelopeInput(harness.registry, 2, COST_USAGE_EVENT_TYPE, {
      scope_id: 'root', unit: 'tokens', direction: 'debit', amount: '5',
    });
    await authorizeAndAppend(harness, first, 'append-cost-1');
    await authorizeAndAppend(harness, second, 'append-cost-2');

    const input = {
      ledger: harness.ledger,
      eventRegistry: harness.registry,
      gaugeRegistry: createStandardGaugeRegistry(),
      gaugeId: StandardGaugeIds.COST,
      gaugeVersion: GAUGE_VERSION,
      runId: 'gauge-cost-run',
    };
    const firstReplay = await replayGaugeFromLedger(input);
    const secondReplay = await replayGaugeFromLedger(input);
    expect(firstReplay.result.replayFingerprintDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(firstReplay.resultBytes).toEqual(secondReplay.resultBytes);
    expect(firstReplay.result.output).toMatchObject({ totalsByScope: { root: { tokens: '12' } } });
  });

  it.each(LEGACY_SURFACE_FIXTURES)(
    'keeps $surface legacy output authoritative during parity comparison',
    ({ surface, source, legacy }) => {
      const outcome = compareGaugeDark(
        surface,
        legacy,
        legacy,
        StandardGaugeIds.HEALTH,
        GAUGE_VERSION,
      );
      expect(outcome.legacyResult).toBe(legacy);
      expect(source).toMatch(/^runtime\//);
      expect(outcome.evidence.legacyHash).toBe(sha256Bytes(canonicalBytes(legacy)));
      expect(outcome.evidence).toMatchObject({ parity: true, differingPaths: [] });
    },
  );

  it('emits bounded hashes and paths rather than compared values on mismatch', () => {
    const legacy = { pending: 2, nested: { failed: 1 } };
    const outcome = compareGaugeDark(
      'fanout-pool',
      legacy,
      { pending: 3, nested: { failed: 2 } },
      StandardGaugeIds.HEALTH,
      GAUGE_VERSION,
    );
    expect(outcome.legacyResult).toBe(legacy);
    expect(outcome.evidence).toMatchObject({
      parity: false,
      differingPaths: ['$.nested.failed', '$.pending'],
    });
    expect(canonicalJson(outcome.evidence)).not.toContain('"failed":1');
  });

  it('prepares typed canonical result and comparison evidence', () => {
    const sourceRegistry = createSourceRegistry();
    const events = syntheticEvents(sourceRegistry, standardSpecs());
    const result = replay(
      createStandardGaugeRegistry(),
      sourceRegistry,
      events,
      StandardGaugeIds.PROGRESS,
    ).result;
    const comparison = compareGaugeDark(
      'convergence',
      { completedWork: 1 },
      { completedWork: 1 },
      result.gaugeId,
      result.gaugeVersion,
    ).evidence;
    const resultEvent = prepareGaugeResultEvidence(result, evidenceEnvelope(1), sourceRegistry);
    const comparisonEvent = prepareGaugeComparisonEvidence(
      comparison,
      evidenceEnvelope(2),
      sourceRegistry,
    );
    expect(readEvent(Uint8Array.from(resultEvent.canonicalBytes), sourceRegistry)
      .effective.envelope.event_type).toBe(GAUGE_RESULT_EVENT_TYPE);
    expect(readEvent(Uint8Array.from(comparisonEvent.canonicalBytes), sourceRegistry)
      .effective.envelope.event_type).toBe('deep-loop.gauge.comparison-recorded');
  });

  it('records durable evidence only through an exact gateway allow', async () => {
    const harness = createHarness();
    const source = envelopeInput(harness.registry, 1, PROGRESS_WORK_EVENT_TYPE, {
      work_id: 'work-a', state: 'completed',
    });
    await authorizeAndAppend(harness, source, 'append-progress');
    const gaugeRegistry = createStandardGaugeRegistry();
    const before = await replayGaugeFromLedger({
      ledger: harness.ledger,
      eventRegistry: harness.registry,
      gaugeRegistry,
      gaugeId: StandardGaugeIds.PROGRESS,
      gaugeVersion: GAUGE_VERSION,
      runId: 'gauge-progress-before-publication',
    });
    const event = prepareGaugeResultEvidence(before.result, evidenceEnvelope(2), harness.registry);
    const request = await requestFor(harness, event, 'publish-gauge-result');
    const published = await recordGaugeEvidence(harness.gateway, harness.ledger, { event, request });
    expect(published.status).toBe('appended');
    expect((await harness.ledger.getVerifiedHead()).sequence).toBe(2);

    const after = await replayGaugeFromLedger({
      ledger: harness.ledger,
      eventRegistry: harness.registry,
      gaugeRegistry,
      gaugeId: StandardGaugeIds.PROGRESS,
      gaugeVersion: GAUGE_VERSION,
      runId: 'gauge-progress-after-publication',
    });
    expect(after.outputBytes).toEqual(before.outputBytes);
    expect(after.result.sourceEventCount).toBe(2);
  });

  it('fails closed on publication denial without appending a domain frame', async () => {
    const harness = createHarness();
    const sourceRegistry = createSourceRegistry();
    const events = syntheticEvents(sourceRegistry, standardSpecs().slice(0, 1));
    const result = replay(
      createStandardGaugeRegistry(),
      sourceRegistry,
      events,
      StandardGaugeIds.PROGRESS,
    ).result;
    const event = prepareGaugeResultEvidence(result, evidenceEnvelope(1), harness.registry);
    const request = await requestFor(harness, event, 'deny-gauge-result', 'read-only');
    await expect(recordGaugeEvidence(harness.gateway, harness.ledger, { event, request }))
      .rejects.toMatchObject({ code: StreamFoldGaugeErrorCodes.PUBLICATION_DENIED });
    expect((await harness.ledger.getVerifiedHead()).sequence).toBe(0);
  });
});
