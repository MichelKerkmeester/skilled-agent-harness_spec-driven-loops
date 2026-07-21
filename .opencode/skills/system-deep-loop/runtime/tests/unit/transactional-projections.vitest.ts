// ──────────────────────────────────
// MODULE: Transactional Projection Tests
// ──────────────────────────────────

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { GENESIS_RECORD_HASH } from '../../lib/authorized-ledger/index.js';
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
  FencedLeaseCoordinator,
  canonicalizeProtectedResource,
} from '../../lib/locks-and-fencing/index.js';
import {
  COST_USAGE_EVENT_TYPE,
  HEALTH_INPUT_EVENT_TYPE,
  NOVELTY_DISPOSITION_EVENT_TYPE,
  PROGRESS_OBLIGATION_EVENT_TYPE,
  PROGRESS_WORK_EVENT_TYPE,
  StandardGaugeIds,
  createStandardGaugeRegistry,
  replayGauge,
} from '../../lib/stream-fold-gauges/index.js';
import {
  CommittedSnapshotPublisher,
  ProjectionBundleRegistry,
  TransactionalProjectionEngine,
  TransactionalProjectionError,
  TransactionalProjectionErrorCodes,
  TransactionalProjectionStore,
  compareLegacyProjection,
  samePublicationManifest,
} from '../../lib/transactional-projections/index.js';

import type { LedgerRecordFrame, VerifiedLedgerEvent } from '../../lib/authorized-ledger/index.js';
import type {
  EventReadResult,
  EventTypeDefinition,
  JsonObject,
} from '../../lib/event-envelope/index.js';
import type {
  FencedLease,
  ReplayIdentity,
} from '../../lib/locks-and-fencing/index.js';
import type {
  ProjectionBundleDefinition,
  ProjectionGeneration,
  ProjectionSnapshot,
  ProjectionViewDefinition,
} from '../../lib/transactional-projections/index.js';

const LEDGER_ID = 'transactional-projection-fixture';
const AUDIT_LEDGER_ID = 'transactional-projection-audit';
const TIMESTAMP = '2026-07-21T00:00:00.000Z';
const FIXTURE_EVENT_TYPE = 'deep-loop.fixture.value-recorded';
const BUNDLE_ID = 'deep-loop.projection.atomic-bundle';
const BUNDLE_VERSION = '1.0.0';
const GAUGE_VERSION = '1.0.0';
const roots: string[] = [];

interface EventSpec {
  readonly eventType: string;
  readonly payload: JsonObject;
}

interface Clock {
  readonly now: () => Date;
  advance(ms: number): void;
}

interface Harness {
  readonly root: string;
  readonly clock: Clock;
  readonly coordinator: FencedLeaseCoordinator;
  readonly registry: EventTypeRegistry;
  readonly gauges: ReturnType<typeof createStandardGaugeRegistry>;
  readonly bundles: ProjectionBundleRegistry;
  readonly store: TransactionalProjectionStore;
  readonly engine: TransactionalProjectionEngine;
}

function validateObject(value: Readonly<JsonObject>): boolean {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function definition(
  eventType: string,
  requiredFields: readonly string[],
  optionalFields: readonly string[] = [],
): EventTypeDefinition {
  return {
    eventType,
    currentVersion: 1,
    versions: [{ version: 1, payload: { requiredFields, optionalFields, validate: validateObject } }],
    upcasters: [],
  };
}

function eventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry([
    definition(PROGRESS_WORK_EVENT_TYPE, ['state', 'work_id']),
    definition(PROGRESS_OBLIGATION_EVENT_TYPE, ['obligation_id', 'state']),
    definition(NOVELTY_DISPOSITION_EVENT_TYPE, ['claim_id', 'disposition']),
    definition(COST_USAGE_EVENT_TYPE, ['amount', 'direction', 'scope_id', 'unit']),
    definition(HEALTH_INPUT_EVENT_TYPE, ['metric', 'queue_id', 'value']),
    definition(FIXTURE_EVENT_TYPE, ['value'], ['fail']),
  ]);
}

const acceptedEvents = [
  PROGRESS_WORK_EVENT_TYPE,
  PROGRESS_OBLIGATION_EVENT_TYPE,
  NOVELTY_DISPOSITION_EVENT_TYPE,
  COST_USAGE_EVENT_TYPE,
  HEALTH_INPUT_EVENT_TYPE,
  FIXTURE_EVENT_TYPE,
].map((eventType) => ({ eventType, effectiveVersions: [1] }));

function view(
  viewId: string,
  dependencies: readonly string[] = [],
  failOnPayload = false,
): ProjectionViewDefinition {
  return {
    viewId,
    viewVersion: '1.0.0',
    outputSchemaVersion: '1',
    reducerIdentity: `${viewId}-reducer-v1`,
    acceptedEvents,
    unknownEventPolicy: 'ignore',
    dependencies,
    configuration: { failOnPayload },
    initialState: { count: 0, latestSequence: 0 },
    reduce: (state, event, context) => {
      if (failOnPayload && event.effective.envelope.payload.fail === true) {
        throw new Error('fixture reducer failure');
      }
      return {
        count: Number(state.count) + 1,
        latestSequence: context.ledgerSequence,
      };
    },
    finalize: (state) => ({ count: state.count ?? 0, latestSequence: state.latestSequence ?? 0 }),
    validateState: (state) => Number.isSafeInteger(state.count) && Number.isSafeInteger(state.latestSequence),
    validateOutput: (output) => Number.isSafeInteger(output.count) && Number.isSafeInteger(output.latestSequence),
  };
}

function bundleDefinition(failingView = false): ProjectionBundleDefinition {
  const dashboard = 'projection.dashboard.current';
  const registry = 'projection.registry.current';
  const claims = 'projection.claim-table.current';
  const index = 'projection.index.current';
  return {
    bundleId: BUNDLE_ID,
    bundleVersion: BUNDLE_VERSION,
    projectionSchemaVersion: '1',
    views: [
      view(dashboard),
      view(registry, [dashboard]),
      view(claims, [registry], failingView),
      view(index, [claims]),
    ],
    gauges: Object.values(StandardGaugeIds).map((gaugeId) => ({ gaugeId, gaugeVersion: GAUGE_VERSION })),
  };
}

function clock(): Clock {
  let now = Date.parse(TIMESTAMP);
  return {
    now: () => new Date(now),
    advance(ms: number): void { now += ms; },
  };
}

function harness(failingView = false, bundle = bundleDefinition(failingView)): Harness {
  const root = mkdtempSync(join(tmpdir(), 'transactional-projections-'));
  roots.push(root);
  const testClock = clock();
  let id = 0;
  const coordinator = new FencedLeaseCoordinator({
    rootDirectory: root,
    now: testClock.now,
    randomId: () => `transactional-projection-${++id}`,
    retryIntervalMs: 1,
    operationTimeoutMs: 10,
  });
  const registry = eventRegistry();
  const gauges = createStandardGaugeRegistry();
  const bundles = new ProjectionBundleRegistry([bundle], gauges);
  const store = new TransactionalProjectionStore(
    { rootDirectory: root, ledgerId: LEDGER_ID, bundleId: BUNDLE_ID },
    coordinator,
  );
  const engine = new TransactionalProjectionEngine({
    store,
    bundleRegistry: bundles,
    gaugeRegistry: gauges,
    bundleId: BUNDLE_ID,
    bundleVersion: BUNDLE_VERSION,
    eventRegistryDigest: registry.digest,
  });
  return { root, clock: testClock, coordinator, registry, gauges, bundles, store, engine };
}

async function lease(h: Harness, owner = 'worker-a'): Promise<FencedLease> {
  return h.coordinator.acquire({
    resource: h.store.resource,
    ownerId: owner,
    correlationId: `${owner}-correlation`,
    ttlMs: 1_000,
    acquireTimeoutMs: 0,
  });
}

function events(registry: EventTypeRegistry, specs: readonly EventSpec[]): readonly VerifiedLedgerEvent[] {
  let priorHash = GENESIS_RECORD_HASH;
  return Object.freeze(specs.map((spec, offset) => {
    const sequence = offset + 1;
    const prepared = prepareEventWrite({
      envelope_version: CURRENT_ENVELOPE_VERSION,
      event_id: `projection-event-${sequence}`,
      event_type: spec.eventType,
      event_version: 1,
      stream_id: 'projection-stream',
      stream_sequence: sequence,
      occurred_at: TIMESTAMP,
      recorded_at: TIMESTAMP,
      producer: { name: 'transactional-projection-tests', version: '1' },
      authority_epoch: 1,
      correlation_id: `projection-correlation-${sequence}`,
      causation_id: sequence === 1 ? null : `projection-event-${sequence - 1}`,
      idempotency_key: `projection-idempotency-${sequence}`,
      payload: spec.payload,
    }, registry);
    const core: Omit<LedgerRecordFrame, 'record_hash'> = {
      frame_version: 1,
      ledger_id: LEDGER_ID,
      sequence,
      prev_record_hash: priorHash,
      canonical_event_hash: prepared.canonicalDigest,
      authorization_ref: {
        audit_ledger_id: AUDIT_LEDGER_ID,
        audit_sequence: sequence,
        audit_record_hash: sha256Bytes(canonicalBytes({ audit: sequence })),
        decision_id: `decision-${sequence}`,
        decision_digest: sha256Bytes(canonicalBytes({ decision: sequence })),
        request_digest: sha256Bytes(canonicalBytes({ request: sequence })),
        policy_digest: sha256Bytes(canonicalBytes({ policy: 'allow' })),
        authority_epoch: 1,
      },
      receipt: {
        ledger_id: LEDGER_ID,
        sequence,
        event_id: prepared.identity.eventId,
        event_type: prepared.identity.eventType,
        event_version: prepared.identity.eventVersion,
        stream_id: prepared.identity.streamId,
        stream_sequence: prepared.identity.streamSequence,
        committed_at: TIMESTAMP,
      },
      canonical_event_bytes: Buffer.from(prepared.canonicalBytes).toString('base64'),
    };
    const frame = Object.freeze({ ...core, record_hash: sha256Bytes(canonicalBytes(core)) });
    priorHash = frame.record_hash;
    return Object.freeze({
      frame,
      event: readEvent(Uint8Array.from(prepared.canonicalBytes), registry),
    });
  }));
}

function standardSpecs(): readonly EventSpec[] {
  return [
    { eventType: PROGRESS_WORK_EVENT_TYPE, payload: { work_id: 'work-a', state: 'open' } },
    { eventType: PROGRESS_OBLIGATION_EVENT_TYPE, payload: { obligation_id: 'proof-a', state: 'open' } },
    { eventType: NOVELTY_DISPOSITION_EVENT_TYPE, payload: { claim_id: 'claim-a', disposition: 'novel' } },
    { eventType: COST_USAGE_EVENT_TYPE, payload: { scope_id: 'root', unit: 'tokens', direction: 'debit', amount: '17' } },
    { eventType: HEALTH_INPUT_EVENT_TYPE, payload: { queue_id: 'fanout', metric: 'pending', value: '2' } },
  ];
}

function replayIdentity(sequence: number): ReplayIdentity {
  return Object.freeze({
    fingerprintVersion: 1,
    ledgerId: LEDGER_ID,
    runId: `projection-run-${sequence}`,
    rangeStartSequence: 1,
    rangeEndSequence: sequence,
    finalDigest: sha256Bytes(canonicalBytes({ ledgerId: LEDGER_ID, sequence })),
  });
}

async function initialize(h: Harness, generationId = 'generation-live'): Promise<FencedLease> {
  const writer = await lease(h);
  await h.engine.stageRebuild({
    lease: writer,
    generationId,
    verifiedEvents: [],
    cutoffSequence: 0,
    cutoffRecordHash: GENESIS_RECORD_HASH,
    replayIdentity: null,
  });
  await h.engine.publishGeneration({ lease: writer, generationId, expectedActiveGenerationId: null });
  return writer;
}

async function applyPrefix(
  h: Harness,
  writer: FencedLease,
  source: readonly VerifiedLedgerEvent[],
  generationId = 'generation-live',
): Promise<void> {
  for (const event of source) {
    await h.engine.applyEvent({
      lease: writer,
      generationId,
      expectedWatermark: h.engine.readWatermark(generationId),
      event,
      replayIdentity: replayIdentity(event.frame.sequence),
    });
  }
}

function generation(h: Harness, generationId: string): ProjectionGeneration {
  return h.store.read().state.generations[generationId] as unknown as ProjectionGeneration;
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('transactional projection bundle registry', () => {
  it('freezes dependency order and reducer/configuration digests', () => {
    const h = harness();
    const manifest = h.bundles.inspect()[0]!;
    expect(manifest.dependencyOrder.indexOf('projection.dashboard.current'))
      .toBeLessThan(manifest.dependencyOrder.indexOf('projection.registry.current'));
    expect(manifest.dependencyOrder.indexOf('projection.registry.current'))
      .toBeLessThan(manifest.dependencyOrder.indexOf('projection.claim-table.current'));
    expect(manifest.dependencyOrder.indexOf('projection.claim-table.current'))
      .toBeLessThan(manifest.dependencyOrder.indexOf('projection.index.current'));
    expect(manifest.bundleDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(manifest.reducerDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(manifest.configurationDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(Object.isFrozen(manifest)).toBe(true);
  });

  it('rejects duplicate identities and cyclic dependencies', () => {
    const gauges = createStandardGaugeRegistry();
    const duplicate = bundleDefinition();
    expect(() => new ProjectionBundleRegistry([{ ...duplicate, views: [duplicate.views[0]!, duplicate.views[0]!] }], gauges))
      .toThrowError(TransactionalProjectionError);
    const cyclic = bundleDefinition();
    expect(() => new ProjectionBundleRegistry([{
      ...cyclic,
      views: [view('projection.dashboard.current', ['projection.registry.current']), view('projection.registry.current', ['projection.dashboard.current'])],
    }], gauges)).toThrowError(expect.objectContaining({ code: TransactionalProjectionErrorCodes.DEPENDENCY_CYCLE }));
  });

  it('rejects a finalizer whose canonical output drifts across identical calls', () => {
    const gauges = createStandardGaugeRegistry();
    let invocation = 0;
    const unstable = {
      ...view('projection.dashboard.current'),
      finalize: () => ({ count: ++invocation, latestSequence: 0 }),
    };
    const candidate = bundleDefinition();
    expect(() => new ProjectionBundleRegistry([{
      ...candidate,
      views: [unstable, ...candidate.views.slice(1)],
    }], gauges)).toThrowError(TransactionalProjectionError);
  });
});

describe('one commit and one cutoff', () => {
  it('publishes every view, gauge, receipt, and watermark at one inclusive cutoff', async () => {
    const h = harness();
    const writer = await initialize(h);
    const source = events(h.registry, standardSpecs());
    await applyPrefix(h, writer, source);
    const snapshot = h.engine.readSnapshot();
    expect(snapshot.cutoffSequence).toBe(source.length);
    expect(snapshot.applyReceipt?.sequence).toBe(source.length);
    for (const member of Object.values(snapshot.views)) {
      expect((member as JsonObject).generationId).toBe(snapshot.generationId);
      expect((member as JsonObject).cutoffSequence).toBe(snapshot.cutoffSequence);
      expect((member as JsonObject).cutoffRecordHash).toBe(snapshot.cutoffRecordHash);
    }
    for (const member of Object.values(snapshot.gauges)) {
      expect((member as JsonObject).generationId).toBe(snapshot.generationId);
      expect((member as JsonObject).cutoffSequence).toBe(snapshot.cutoffSequence);
      expect((member as JsonObject).cutoffRecordHash).toBe(snapshot.cutoffRecordHash);
    }
  });

  it('aborts the complete unit when any view or precommit boundary fails', async () => {
    const h = harness(true);
    const writer = await initialize(h);
    const [event] = events(h.registry, [{ eventType: FIXTURE_EVENT_TYPE, payload: { value: 1, fail: true } }]);
    const before = canonicalJson(h.store.read().state);
    await expect(h.engine.applyEvent({
      lease: writer,
      generationId: 'generation-live',
      expectedWatermark: h.engine.readWatermark(),
      event: event!,
      replayIdentity: replayIdentity(1),
    })).rejects.toMatchObject({ code: TransactionalProjectionErrorCodes.REDUCER_FAILURE });
    expect(canonicalJson(h.store.read().state)).toBe(before);

    for (const fault of [
      { afterViewPrepared: () => { throw new Error('view fault'); } },
      { afterGaugePrepared: () => { throw new Error('gauge fault'); } },
      { afterReceiptPrepared: () => { throw new Error('receipt fault'); } },
      { afterWatermarkPrepared: () => { throw new Error('watermark fault'); } },
      { beforeCommit: () => { throw new Error('commit fault'); } },
    ]) {
      const safe = harness();
      const safeWriter = await initialize(safe);
      const [safeEvent] = events(safe.registry, [{ eventType: FIXTURE_EVENT_TYPE, payload: { value: 1 } }]);
      const safeBefore = canonicalJson(safe.store.read().state);
      await expect(safe.engine.applyEvent({
        lease: safeWriter,
        generationId: 'generation-live',
        expectedWatermark: safe.engine.readWatermark(),
        event: safeEvent!,
        replayIdentity: replayIdentity(1),
        faultInjection: fault,
      })).rejects.toThrow();
      expect(canonicalJson(safe.store.read().state)).toBe(safeBefore);
    }
  });
});

describe('conflict-detecting idempotency and recovery', () => {
  it('returns the original receipt after crash-after-commit and rejects changed effective bytes/version', async () => {
    const h = harness();
    const writer = await initialize(h);
    const [event] = events(h.registry, [{ eventType: FIXTURE_EVENT_TYPE, payload: { value: 1 } }]);
    await expect(h.engine.applyEvent({
      lease: writer,
      generationId: 'generation-live',
      expectedWatermark: h.engine.readWatermark(),
      event: event!,
      replayIdentity: replayIdentity(1),
      faultInjection: { afterCommit: () => { throw new Error('lost response'); } },
    })).rejects.toThrow('lost response');
    const stored = generation(h, 'generation-live').receipts['1'];
    const committedVersion = h.store.read().stateVersion;
    const retried = await h.engine.applyEvent({
      lease: writer,
      generationId: 'generation-live',
      expectedWatermark: { ...h.engine.readWatermark(), sequence: 0 },
      event: event!,
      replayIdentity: replayIdentity(1),
    });
    expect(retried).toEqual(stored);
    expect(h.store.read().stateVersion).toBe(committedVersion);

    const alternateReplay = {
      ...replayIdentity(1),
      runId: 'projection-run-retry',
      finalDigest: 'b'.repeat(64),
    };
    const replayRetried = await h.engine.applyEvent({
      lease: writer,
      generationId: 'generation-live',
      expectedWatermark: h.engine.readWatermark(),
      event: event!,
      replayIdentity: alternateReplay,
    });
    expect(replayRetried).toEqual(stored);
    expect(h.store.read().stateVersion).toBe(committedVersion);

    const changedRead: EventReadResult = { ...event!.event, effectiveVersion: 2 };
    await expect(h.engine.applyEvent({
      lease: writer,
      generationId: 'generation-live',
      expectedWatermark: h.engine.readWatermark(),
      event: { frame: event!.frame, event: changedRead },
      replayIdentity: replayIdentity(1),
    })).rejects.toMatchObject({ code: TransactionalProjectionErrorCodes.IDEMPOTENCY_CONFLICT });

    const changedBytes = {
      ...event!.frame,
      canonical_event_bytes: Buffer.from('{"changed":true}', 'utf8').toString('base64'),
    };
    await expect(h.engine.applyEvent({
      lease: writer,
      generationId: 'generation-live',
      expectedWatermark: h.engine.readWatermark(),
      event: { frame: changedBytes, event: event!.event },
      replayIdentity: replayIdentity(1),
    })).rejects.toMatchObject({ code: TransactionalProjectionErrorCodes.LEDGER_CORRUPTION });
    expect(h.store.read().stateVersion).toBe(committedVersion);
  });

  it('resumes only when ledger, generation, bundle digests, cutoff, and replay provenance verify', async () => {
    const h = harness();
    const writer = await initialize(h);
    const source = events(h.registry, standardSpecs().slice(0, 2));
    await applyPrefix(h, writer, source);
    expect(h.engine.planResume(source, replayIdentity(2))).toMatchObject({ mode: 'resume', nextSequence: 3 });
    expect(h.engine.planResume(source, { ...replayIdentity(2), finalDigest: 'f'.repeat(64) })).toEqual({
      mode: 'rebuild', reasonCode: 'REPLAY_PROVENANCE_MISMATCH',
    });
    const corrupt = [{ ...source[0]!, frame: { ...source[0]!.frame, record_hash: 'e'.repeat(64) } }, source[1]!];
    expect(h.engine.planResume(corrupt, replayIdentity(2))).toMatchObject({ mode: 'rebuild' });
  });

  it('turns durable store corruption into a rebuild decision', async () => {
    const h = harness();
    await initialize(h);
    const resource = canonicalizeProtectedResource(h.store.resource);
    const path = join(h.root, 'fenced-protected-state-v1', `${resource.resourceDigest}.json`);
    const raw = readFileSync(path, 'utf8');
    writeFileSync(path, raw.replace('"storeSchemaVersion":1', '"storeSchemaVersion":2'));
    expect(h.engine.planResume([], null)).toEqual({ mode: 'rebuild', reasonCode: 'STORE_CORRUPTION' });
  });

  it('rejects a receipt whose durable bytes no longer verify', async () => {
    const h = harness();
    const writer = await initialize(h);
    const source = events(h.registry, standardSpecs().slice(0, 1));
    await applyPrefix(h, writer, source);
    const stored = h.store.read();
    const corrupted = JSON.parse(canonicalJson(stored.state));
    corrupted.generations['generation-live'].receipts['1'].inputDigest = 'a'.repeat(64);
    await h.store.replace(writer, stored.stateVersion, corrupted, stored.replayIdentity);
    expect(h.engine.planResume(source, replayIdentity(1))).toEqual({
      mode: 'rebuild', reasonCode: TransactionalProjectionErrorCodes.GENERATION_INVALID,
    });
  });
});

describe('serialized fenced writers', () => {
  it('rejects a stale lease and a concurrent state-version race without partial effects', async () => {
    const h = harness();
    const stale = await initialize(h);
    h.clock.advance(2_000);
    const current = await lease(h, 'worker-b');
    const source = events(h.registry, standardSpecs().slice(0, 2));
    const before = canonicalJson(h.store.read().state);
    await expect(h.engine.applyEvent({
      lease: stale,
      generationId: 'generation-live',
      expectedWatermark: h.engine.readWatermark(),
      event: source[0]!,
      replayIdentity: replayIdentity(1),
    })).rejects.toMatchObject({ code: TransactionalProjectionErrorCodes.WRITER_CONFLICT });
    expect(canonicalJson(h.store.read().state)).toBe(before);

    const expected = h.engine.readWatermark();
    const first = h.engine.applyEvent({
      lease: current,
      generationId: 'generation-live',
      expectedWatermark: expected,
      event: source[0]!,
      replayIdentity: replayIdentity(1),
    });
    const second = h.engine.applyEvent({
      lease: current,
      generationId: 'generation-live',
      expectedWatermark: expected,
      event: source[0]!,
      replayIdentity: replayIdentity(1),
    });
    const settled = await Promise.allSettled([first, second]);
    expect(settled.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    expect(h.engine.readWatermark().sequence).toBe(1);
    expect(Object.keys(generation(h, 'generation-live').receipts)).toEqual(['1']);
  });
});

describe('deterministic rebuild and atomic publication', () => {
  it('builds byte-identical canonical content across fresh generations and swaps one pointer', async () => {
    const h = harness();
    const writer = await initialize(h, 'generation-old');
    const source = events(h.registry, standardSpecs());
    const identity = replayIdentity(source.length);
    const first = await h.engine.stageRebuild({
      lease: writer,
      generationId: 'generation-new-a',
      verifiedEvents: source,
      cutoffSequence: source.length,
      cutoffRecordHash: source.at(-1)!.frame.record_hash,
      replayIdentity: identity,
    });
    const second = await h.engine.stageRebuild({
      lease: writer,
      generationId: 'generation-new-b',
      verifiedEvents: source,
      cutoffSequence: source.length,
      cutoffRecordHash: source.at(-1)!.frame.record_hash,
      replayIdentity: identity,
    });
    expect(first.canonicalProjectionHash).toBe(second.canonicalProjectionHash);
    expect(h.engine.readSnapshot().generationId).toBe('generation-old');
    const heldOld = h.engine.readSnapshot();
    const published = await h.engine.publishGeneration({
      lease: writer,
      generationId: 'generation-new-b',
      expectedActiveGenerationId: 'generation-old',
    });
    expect(heldOld.generationId).toBe('generation-old');
    expect(heldOld.cutoffSequence).toBe(0);
    expect(published.generationId).toBe('generation-new-b');
    expect(published.cutoffSequence).toBe(source.length);
    const rolledBack = await h.engine.rollbackGeneration({
      lease: writer,
      generationId: 'generation-old',
      expectedActiveGenerationId: 'generation-new-b',
    });
    expect(rolledBack.generationId).toBe('generation-old');
    expect(rolledBack.cutoffSequence).toBe(0);
  });

  it('preserves canonical hashes across restart boundaries and JSON key insertion order', async () => {
    const rebuilt = harness();
    const rebuiltWriter = await initialize(rebuilt, 'generation-old');
    const payloadA: JsonObject = { value: 1, fail: false };
    const sourceA = events(rebuilt.registry, [
      { eventType: FIXTURE_EVENT_TYPE, payload: payloadA },
      ...standardSpecs(),
    ]);
    const rebuiltGeneration = await rebuilt.engine.stageRebuild({
      lease: rebuiltWriter,
      generationId: 'generation-rebuilt',
      verifiedEvents: sourceA,
      cutoffSequence: sourceA.length,
      cutoffRecordHash: sourceA.at(-1)!.frame.record_hash,
      replayIdentity: replayIdentity(sourceA.length),
    });

    const resumed = harness();
    const resumedWriter = await initialize(resumed);
    const payloadB: JsonObject = {};
    payloadB.fail = false;
    payloadB.value = 1;
    const sourceB = events(resumed.registry, [
      { eventType: FIXTURE_EVENT_TYPE, payload: payloadB },
      ...standardSpecs(),
    ]);
    await applyPrefix(resumed, resumedWriter, sourceB.slice(0, 2));
    expect(resumed.engine.planResume(sourceB, replayIdentity(2))).toMatchObject({ mode: 'resume', nextSequence: 3 });
    await applyPrefix(resumed, resumedWriter, sourceB.slice(2));
    expect(sourceA.map((event) => event.frame.record_hash)).toEqual(sourceB.map((event) => event.frame.record_hash));
    expect(resumed.engine.readSnapshot().canonicalProjectionHash).toBe(rebuiltGeneration.canonicalProjectionHash);
  });

  it('rebuilds a bounded 250-event prefix without weakening sequential cutoffs', async () => {
    const h = harness();
    const writer = await initialize(h, 'generation-old');
    const specs = Array.from({ length: 250 }, (_, index) => ({
      eventType: FIXTURE_EVENT_TYPE,
      payload: { value: index },
    }));
    const source = events(h.registry, specs);
    const rebuilt = await h.engine.stageRebuild({
      lease: writer,
      generationId: 'generation-250',
      verifiedEvents: source,
      cutoffSequence: source.length,
      cutoffRecordHash: source.at(-1)!.frame.record_hash,
      replayIdentity: replayIdentity(source.length),
    });
    expect(rebuilt.watermark.sequence).toBe(250);
    expect(Object.keys(rebuilt.receipts)).toHaveLength(250);
    expect(Object.values(rebuilt.views).every(
      (entry) => (entry as JsonObject).cutoffSequence === 250,
    )).toBe(true);
  });

  it('matches every frozen standard gauge fold exactly', async () => {
    const h = harness();
    const writer = await initialize(h);
    const source = events(h.registry, standardSpecs());
    await applyPrefix(h, writer, source);
    const snapshot = h.engine.readSnapshot();
    for (const gaugeId of Object.values(StandardGaugeIds)) {
      const pure = replayGauge(h.gauges, {
        verifiedEvents: source,
        cutoff: { ledgerId: LEDGER_ID, sequence: source.length, recordHash: source.at(-1)!.frame.record_hash },
        eventRegistryDigest: h.registry.digest,
        gaugeId,
        gaugeVersion: GAUGE_VERSION,
      });
      const materialization = snapshot.gauges[gaugeId] as JsonObject;
      expect(canonicalJson(materialization.accumulator)).toBe(canonicalJson(pure.accumulator));
      expect(canonicalJson(materialization.output)).toBe(canonicalJson(pure.result.output));
      expect(materialization.accumulatorHash).toBe(pure.result.accumulatorHash);
      expect(materialization.outputHash).toBe(pure.result.outputHash);
    }
  });

  it('rejects sequence gaps, schema drift, and mixed-cutoff materializations', async () => {
    const h = harness();
    const writer = await initialize(h);
    const source = events(h.registry, standardSpecs().slice(0, 2));
    await expect(h.engine.applyEvent({
      lease: writer,
      generationId: 'generation-live',
      expectedWatermark: h.engine.readWatermark(),
      event: source[1]!,
      replayIdentity: replayIdentity(2),
    })).rejects.toMatchObject({ code: TransactionalProjectionErrorCodes.SEQUENCE_GAP });
    const changedVersion = { ...source[0]!.event, effectiveVersion: 2 };
    await expect(h.engine.applyEvent({
      lease: writer,
      generationId: 'generation-live',
      expectedWatermark: h.engine.readWatermark(),
      event: { frame: source[0]!.frame, event: changedVersion },
      replayIdentity: replayIdentity(1),
    })).rejects.toMatchObject({ code: TransactionalProjectionErrorCodes.UNSUPPORTED_EVENT_VERSION });

    const stored = h.store.read();
    const rawGeneration = stored.state.generations['generation-live'] as unknown as ProjectionGeneration;
    const viewId = 'projection.dashboard.current';
    const mixed = JSON.parse(canonicalJson(stored.state));
    mixed.generations['generation-live'].views[viewId].cutoffSequence = 99;
    await h.store.replace(writer, stored.stateVersion, mixed, null);
    expect(() => h.engine.readSnapshot()).toThrowError(expect.objectContaining({ code: TransactionalProjectionErrorCodes.MIXED_CUTOFF }));
    expect(rawGeneration.watermark.sequence).toBe(0);
  });
});

describe('dark publication and legacy authority', () => {
  it('cannot advance canonical state when delivery fails or retries', async () => {
    const h = harness();
    const writer = await initialize(h);
    const source = events(h.registry, standardSpecs().slice(0, 1));
    await applyPrefix(h, writer, source);
    const publisher = new CommittedSnapshotPublisher(h.engine);
    const before = canonicalJson(h.store.read().state);
    const firstManifest = publisher.manifest();
    const failed = await publisher.deliver(async () => { throw new Error('sink unavailable'); });
    const delivered = await publisher.deliver(async () => undefined);
    const secondManifest = publisher.manifest();
    expect(failed.status).toBe('delivery-failed');
    expect(delivered.status).toBe('delivered');
    expect(samePublicationManifest(firstManifest, secondManifest)).toBe(true);
    expect(canonicalJson(h.store.read().state)).toBe(before);
  });

  it('returns the exact legacy object and excludes UUID/time metadata from replay authority', async () => {
    const h = harness();
    await initialize(h);
    const snapshot = h.engine.readSnapshot();
    const legacy = { status: 'legacy-authoritative', value: 7 };
    const first = compareLegacyProjection({
      surface: 'observability',
      legacyResult: legacy,
      projectionValue: { status: 'shadow', value: 7 },
      snapshot,
      legacyMetadata: { eventId: 'random-uuid-a', observedAt: '2099-01-01T00:00:00.000Z' },
    });
    const second = compareLegacyProjection({
      surface: 'observability',
      legacyResult: legacy,
      projectionValue: { status: 'shadow', value: 7 },
      snapshot,
      legacyMetadata: { eventId: 'random-uuid-b', observedAt: '1970-01-01T00:00:00.000Z' },
    });
    expect(first.legacyResult).toBe(legacy);
    expect(first.evidence.legacyAuthority).toBe(true);
    expect(first.evidence.legacyManifestDigest).toBe(second.evidence.legacyManifestDigest);
    expect(first.evidence.cutoffRecordHash).toBe(snapshot.cutoffRecordHash);
  });

  it('keeps held snapshots immutable while later committed events advance the live generation', async () => {
    const h = harness();
    const writer = await initialize(h);
    const source = events(h.registry, standardSpecs().slice(0, 2));
    await applyPrefix(h, writer, source.slice(0, 1));
    const held: ProjectionSnapshot = h.engine.readSnapshot();
    await applyPrefix(h, writer, source.slice(1));
    expect(held.cutoffSequence).toBe(1);
    expect(h.engine.readSnapshot().cutoffSequence).toBe(2);
    expect(Object.isFrozen(held)).toBe(true);
  });
});
