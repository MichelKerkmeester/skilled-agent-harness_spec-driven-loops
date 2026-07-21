// ───────────────────────────────────────────────────────────────────
// MODULE: Compatibility Shadow Adapter Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  CompatibilityError,
  CompatibilityErrorCodes,
  DualReadAdapter,
  StateUpcasterRegistry,
  mirrorAcceptedLegacyTransition,
  readCompatibilityEvent,
  readWithUpcastingGate,
  reconcileReadModels,
  requireExplicitStateVersion,
} from '../../lib/compatibility-shadow/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  EventReadError,
  EventTypeRegistry,
  EventUpcastError,
  EventWriteError,
  RegistryValidationError,
  canonicalJson,
  prepareEventWrite,
} from '../../lib/event-envelope/index.js';

import type {
  AcceptedLegacyTransition,
  ComparisonToken,
  DarkMirrorRecorder,
  DarkReadModel,
  LegacyReadModel,
  StateRecordCodec,
  StateRecordTypeDefinition,
  StateUpcastOutcome,
  StateUpcasterDefinition,
  VersionedStateRecord,
} from '../../lib/compatibility-shadow/index.js';
import type {
  AuthorityState,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type {
  EventEnvelope,
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
  UpcastOutcome,
} from '../../lib/event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. STATE FIXTURES
// ───────────────────────────────────────────────────────────────────

const STATE_FAMILY = 'legacy.review';
const STATE_RECORD_TYPE = 'iteration-state';
const STATE_IDENTITY = Object.freeze({ runId: 'run-001' });

function stateRecord(
  stateVersion: number,
  payload: JsonObject,
  identity: JsonObject = STATE_IDENTITY,
): VersionedStateRecord {
  return {
    family: STATE_FAMILY,
    recordType: STATE_RECORD_TYPE,
    stateVersion,
    identity,
    payload,
  };
}

function validateStateVersionOne(record: Readonly<VersionedStateRecord>): boolean {
  return typeof record.payload.phase === 'string'
    && Number.isSafeInteger(record.payload.iteration);
}

function validateStateVersionTwo(record: Readonly<VersionedStateRecord>): boolean {
  return typeof record.payload.stage === 'string'
    && Number.isSafeInteger(record.payload.iteration)
    && typeof record.payload.status === 'string';
}

function validateStateVersionThree(record: Readonly<VersionedStateRecord>): boolean {
  return validateStateVersionTwo(record)
    && typeof record.payload.category === 'string';
}

function upcastStateOneToTwo(record: Readonly<VersionedStateRecord>): StateUpcastOutcome {
  return {
    record: stateRecord(2, {
      stage: record.payload.phase,
      iteration: record.payload.iteration,
      status: 'complete',
    }, record.identity),
    sourceFieldMap: { phase: 'stage', iteration: 'iteration' },
    introducedFields: {
      status: {
        kind: 'default',
        provenance: 'Historical completed iteration rows imply completed status',
      },
    },
  };
}

function upcastStateTwoToThree(record: Readonly<VersionedStateRecord>): StateUpcastOutcome {
  return {
    record: stateRecord(3, {
      ...record.payload,
      category: 'workflow',
    }, record.identity),
    sourceFieldMap: { stage: 'stage', iteration: 'iteration', status: 'status' },
    introducedFields: {
      category: {
        kind: 'derived',
        provenance: 'The admitted record family is a workflow iteration stream',
      },
    },
  };
}

function stateDefinition(
  upcasters: readonly StateUpcasterDefinition[] = [
    {
      identity: 'legacy.review.iteration-state@1-to-2',
      fromVersion: 1,
      toVersion: 2,
      upcast: upcastStateOneToTwo,
    },
    {
      identity: 'legacy.review.iteration-state@2-to-3',
      fromVersion: 2,
      toVersion: 3,
      upcast: upcastStateTwoToThree,
    },
  ],
): StateRecordTypeDefinition {
  return {
    family: STATE_FAMILY,
    recordType: STATE_RECORD_TYPE,
    currentVersion: 3,
    versions: [
      {
        version: 1,
        validate: validateStateVersionOne,
        fixture: stateRecord(1, { phase: 'research', iteration: 1 }),
      },
      {
        version: 2,
        validate: validateStateVersionTwo,
        fixture: stateRecord(2, { stage: 'research', iteration: 1, status: 'complete' }),
      },
      {
        version: 3,
        validate: validateStateVersionThree,
        fixture: stateRecord(3, {
          stage: 'research',
          iteration: 1,
          status: 'complete',
          category: 'workflow',
        }),
      },
    ],
    upcasters,
  };
}

const stateCodec: StateRecordCodec = {
  identity: 'legacy.review.iteration-state-codec@1',
  family: STATE_FAMILY,
  recordType: STATE_RECORD_TYPE,
  decode: (source) => {
    if (source.kind !== 'iteration-state' || typeof source.run_id !== 'string') {
      throw new CompatibilityError(
        CompatibilityErrorCodes.CODEC_REJECTED,
        'Legacy state discriminator is not admitted',
      );
    }
    const stateVersion = requireExplicitStateVersion(source, 'schema_version');
    const identity = { runId: source.run_id };
    if (stateVersion === 1) {
      return stateRecord(1, {
        phase: source.phase,
        iteration: source.iteration,
      }, identity);
    }
    if (stateVersion === 2) {
      return stateRecord(2, {
        stage: source.stage,
        iteration: source.iteration,
        status: source.status,
      }, identity);
    }
    return stateRecord(stateVersion, {
      stage: source.stage,
      iteration: source.iteration,
      status: source.status,
      category: source.category,
    }, identity);
  },
};

function storedState(version: number): string {
  if (version === 1) {
    return JSON.stringify({
      schema_version: 1,
      kind: 'iteration-state',
      run_id: 'run-001',
      phase: 'research',
      iteration: 1,
    });
  }
  if (version === 2) {
    return JSON.stringify({
      schema_version: 2,
      kind: 'iteration-state',
      run_id: 'run-001',
      stage: 'research',
      iteration: 1,
      status: 'complete',
    });
  }
  return JSON.stringify({
    schema_version: version,
    kind: 'iteration-state',
    run_id: 'run-001',
    stage: 'research',
    iteration: 1,
    status: 'complete',
    category: 'workflow',
  });
}

function expectCompatibilityCode(
  action: () => unknown,
  code: string,
): CompatibilityError {
  try {
    action();
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(CompatibilityError);
    expect((error as CompatibilityError).code).toBe(code);
    return error as CompatibilityError;
  }
  throw new Error(`Expected ${code}`);
}

// ───────────────────────────────────────────────────────────────────
// 2. EVENT FIXTURES
// ───────────────────────────────────────────────────────────────────

const EVENT_TYPE = 'deep-loop.compatibility.status-recorded';
const TIMESTAMP = '2026-01-01T00:00:00.000Z';

function eventEnvelope(version: number, payload: JsonObject): EventEnvelope {
  return {
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: 'event-001',
    event_type: EVENT_TYPE,
    event_version: version,
    stream_id: 'stream-001',
    stream_sequence: 1,
    occurred_at: TIMESTAMP,
    recorded_at: TIMESTAMP,
    producer: { name: 'compatibility-tests', version: 'candidate-001' },
    authority_epoch: 7,
    correlation_id: 'correlation-001',
    causation_id: null,
    idempotency_key: 'idempotency-001',
    payload,
  };
}

function upcastEventOneToTwo(event: EventEnvelope): UpcastOutcome {
  return {
    envelope: {
      ...event,
      event_version: 2,
      payload: { ...event.payload, severity: 'info' },
    },
    sourceFieldMap: { message: 'message' },
    introducedFields: {
      severity: { kind: 'default', provenance: 'Historical status events imply info severity' },
    },
  };
}

function upcastEventTwoToThree(event: EventEnvelope): UpcastOutcome {
  return {
    envelope: {
      ...event,
      event_version: 3,
      payload: { ...event.payload, category: 'workflow' },
    },
    sourceFieldMap: { message: 'message', severity: 'severity' },
    introducedFields: {
      category: { kind: 'derived', provenance: 'The event namespace fixes the workflow category' },
    },
  };
}

function eventDefinition(): EventTypeDefinition {
  return {
    eventType: EVENT_TYPE,
    currentVersion: 3,
    versions: [
      {
        version: 1,
        payload: {
          requiredFields: ['message'],
          validate: (payload) => typeof payload.message === 'string',
        },
      },
      {
        version: 2,
        payload: {
          requiredFields: ['message', 'severity'],
          validate: (payload) =>
            typeof payload.message === 'string' && typeof payload.severity === 'string',
        },
      },
      {
        version: 3,
        payload: {
          requiredFields: ['message', 'severity', 'category'],
          validate: (payload) =>
            typeof payload.message === 'string'
            && typeof payload.severity === 'string'
            && typeof payload.category === 'string',
        },
      },
    ],
    upcasters: [
      {
        identity: 'deep-loop.compatibility.status-recorded@1-to-2',
        fromVersion: 1,
        toVersion: 2,
        upcast: upcastEventOneToTwo,
      },
      {
        identity: 'deep-loop.compatibility.status-recorded@2-to-3',
        fromVersion: 2,
        toVersion: 3,
        upcast: upcastEventTwoToThree,
      },
    ],
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. DUAL-READ AND MIRROR FIXTURES
// ───────────────────────────────────────────────────────────────────

const DARK_HEAD_HASH = 'a'.repeat(64);

function comparisonToken(overrides: Partial<ComparisonToken> = {}): ComparisonToken {
  return {
    tokenVersion: 1,
    mode: 'review',
    runId: 'run-001',
    streamId: 'stream-001',
    authorityEpoch: 7,
    correlationId: 'correlation-001',
    legacyRecordId: 'legacy-record-001',
    legacySequence: 4,
    darkLedgerId: 'dark-ledger-001',
    darkHeadSequence: 8,
    darkHeadHash: DARK_HEAD_HASH,
    ...overrides,
  };
}

function legacyModel(model: JsonObject = { status: 'complete' }): LegacyReadModel {
  return {
    model,
    recordId: 'legacy-record-001',
    sequence: 4,
    comparisonSequence: 4,
  };
}

function darkModel(
  model: JsonObject = { status: 'complete' },
  overrides: Partial<DarkReadModel> = {},
): DarkReadModel {
  return {
    model,
    ledgerId: 'dark-ledger-001',
    verifiedHeadSequence: 8,
    verifiedHeadHash: DARK_HEAD_HASH,
    comparisonSequence: 4,
    ...overrides,
  };
}

function mirrorEvent(): {
  readonly event: EventWritePreflight;
  readonly request: TransitionAuthorizationRequest;
} {
  const registry = new EventTypeRegistry([eventDefinition()]);
  const event = prepareEventWrite(
    eventEnvelope(3, { message: 'complete', severity: 'info', category: 'workflow' }),
    registry,
  );
  return {
    event,
    request: {
      requestId: 'request-001',
      mode: 'review',
      event,
      priorHead: { ledgerId: 'dark-ledger-001', sequence: 0, recordHash: '0'.repeat(64) },
      priorStateVersion: 'legacy-v1',
      priorStateFingerprint: 'b'.repeat(64),
      actorId: 'legacy-shadow-adapter',
      capabilityId: 'append-dark-event',
      authorityEpoch: 7,
      policy: { policyId: 'shadow-policy', policyVersion: 1, policyDigest: 'c'.repeat(64) },
      evidenceDigest: 'd'.repeat(64),
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. STATE UPCASTER CONTRACT
// ───────────────────────────────────────────────────────────────────

describe('state upcaster registry', () => {
  it('reads current, one-hop, and multi-hop records with stable complete traces', () => {
    const registry = new StateUpcasterRegistry([stateDefinition()]);
    const current = registry.read(storedState(3), stateCodec);
    const oneHop = registry.read(storedState(2), stateCodec);
    const multiHop = registry.read(storedState(1), stateCodec);
    const repeated = registry.read(storedState(1), stateCodec);

    expect(current.hopTrace).toHaveLength(0);
    expect(oneHop.hopTrace.map(({ fromVersion, toVersion }) => [fromVersion, toVersion]))
      .toEqual([[2, 3]]);
    expect(multiHop.hopTrace.map(({ fromVersion, toVersion }) => [fromVersion, toVersion]))
      .toEqual([[1, 2], [2, 3]]);
    expect(multiHop.effective.record).toEqual(current.effective.record);
    expect(repeated.effective.canonicalDigest).toBe(multiHop.effective.canonicalDigest);
    expect(repeated.chainIdentity).toBe(multiHop.chainIdentity);
    expect(repeated.hopTrace).toEqual(multiHop.hopTrace);
  });

  it('retains exact source bytes and immutable record identity', () => {
    const source = `  ${storedState(1)}\n`;
    const registry = new StateUpcasterRegistry([stateDefinition()]);
    const result = registry.read(source, stateCodec);

    expect(Buffer.from(result.stored.bytes).toString('utf8')).toBe(source);
    expect(result.storedVersion).toBe(1);
    expect(result.effectiveVersion).toBe(3);
    expect(result.stored.record.identity).toEqual(result.effective.record.identity);
    expect(Object.isFrozen(result.stored.record)).toBe(true);
    expect(Object.isFrozen(result.effective.record.payload)).toBe(true);
    expect(result.codecDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(result.registryDigest).toMatch(/^[a-f0-9]{64}$/);
  });

  it('orders definitions deterministically and binds fixtures and functions into the digest', () => {
    const second = {
      ...stateDefinition(),
      family: 'legacy.alignment',
      versions: stateDefinition().versions.map((version) => ({
        ...version,
        fixture: { ...version.fixture, family: 'legacy.alignment' },
      })),
      upcasters: stateDefinition().upcasters.map((upcaster) => ({
        ...upcaster,
        identity: upcaster.identity.replace('legacy.review', 'legacy.alignment'),
        upcast: (record: Readonly<VersionedStateRecord>) => {
          const result = upcaster.upcast(record);
          return {
            ...result,
            record: { ...result.record, family: 'legacy.alignment' },
          };
        },
      })),
    } satisfies StateRecordTypeDefinition;
    const firstOrder = new StateUpcasterRegistry([stateDefinition(), second]);
    const secondOrder = new StateUpcasterRegistry([second, stateDefinition()]);

    expect(firstOrder.digest).toBe(secondOrder.digest);
    expect(firstOrder.inspect().map(({ family }) => family))
      .toEqual(['legacy.alignment', 'legacy.review']);
    expect(firstOrder.inspect()[1].versions[0].fixtureDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(firstOrder.inspect()[1].upcasters[0].implementationDigest).toMatch(/^[a-f0-9]{64}$/);
  });

  it('rejects an empty or duplicate record-type registry', () => {
    expectCompatibilityCode(
      () => new StateUpcasterRegistry([]),
      CompatibilityErrorCodes.REGISTRY_INVALID_DEFINITION,
    );
    expectCompatibilityCode(
      () => new StateUpcasterRegistry([stateDefinition(), stateDefinition()]),
      CompatibilityErrorCodes.REGISTRY_DUPLICATE_RECORD_TYPE,
    );
  });

  it('rejects non-positive, duplicate, and gapped version declarations', () => {
    expectCompatibilityCode(
      () => new StateUpcasterRegistry([{ ...stateDefinition(), currentVersion: 0 }]),
      CompatibilityErrorCodes.REGISTRY_INVALID_VERSION,
    );
    expectCompatibilityCode(
      () => new StateUpcasterRegistry([{
        ...stateDefinition(),
        versions: [stateDefinition().versions[0], stateDefinition().versions[0]],
      }]),
      CompatibilityErrorCodes.REGISTRY_DUPLICATE_VERSION,
    );
    expectCompatibilityCode(
      () => new StateUpcasterRegistry([{
        ...stateDefinition(),
        versions: [stateDefinition().versions[0], stateDefinition().versions[2]],
      }]),
      CompatibilityErrorCodes.REGISTRY_UPCASTER_GAP,
    );
  });

  it('rejects non-adjacent, forked, cyclic, and missing upcaster graphs', () => {
    const oneToTwo = stateDefinition().upcasters[0];
    const twoToThree = stateDefinition().upcasters[1];
    expectCompatibilityCode(
      () => new StateUpcasterRegistry([stateDefinition([{
        ...oneToTwo,
        toVersion: 3,
      }, twoToThree])]),
      CompatibilityErrorCodes.REGISTRY_NON_ADJACENT_UPCASTER,
    );
    expectCompatibilityCode(
      () => new StateUpcasterRegistry([stateDefinition([
        oneToTwo,
        { ...oneToTwo, identity: 'legacy.review.iteration-state@1-to-2-copy' },
        twoToThree,
      ])]),
      CompatibilityErrorCodes.REGISTRY_DUPLICATE_UPCASTER,
    );
    expectCompatibilityCode(
      () => new StateUpcasterRegistry([stateDefinition([
        oneToTwo,
        { ...twoToThree, fromVersion: 2, toVersion: 1 },
      ])]),
      CompatibilityErrorCodes.REGISTRY_UPCASTER_CYCLE,
    );
    expectCompatibilityCode(
      () => new StateUpcasterRegistry([stateDefinition([oneToTwo])]),
      CompatibilityErrorCodes.REGISTRY_UPCASTER_GAP,
    );
  });

  it('rejects ambiguous unversioned, future, unknown, and malformed sources', () => {
    const registry = new StateUpcasterRegistry([stateDefinition()]);
    const unversioned = JSON.stringify({
      kind: 'iteration-state',
      run_id: 'run-001',
      phase: 'research',
      iteration: 1,
    });
    expectCompatibilityCode(
      () => registry.read(unversioned, stateCodec),
      CompatibilityErrorCodes.AMBIGUOUS_UNVERSIONED_STATE,
    );
    expectCompatibilityCode(
      () => registry.read(storedState(4), stateCodec),
      CompatibilityErrorCodes.FUTURE_STATE_VERSION,
    );
    expectCompatibilityCode(
      () => registry.read(storedState(1), { ...stateCodec, family: 'legacy.unknown' }),
      CompatibilityErrorCodes.CODEC_REJECTED,
    );
    expectCompatibilityCode(
      () => registry.read('{', stateCodec),
      CompatibilityErrorCodes.SOURCE_INVALID_JSON,
    );
  });

  it('rejects mutating and nondeterministic codecs', () => {
    const registry = new StateUpcasterRegistry([stateDefinition()]);
    const mutatingCodec: StateRecordCodec = {
      ...stateCodec,
      identity: 'legacy.review.mutating-codec@1',
      decode: (source) => {
        (source as JsonObject).mutation = true;
        return stateRecord(1, { phase: 'research', iteration: 1 });
      },
    };
    let callCount = 0;
    const nondeterministicCodec: StateRecordCodec = {
      ...stateCodec,
      identity: 'legacy.review.nondeterministic-codec@1',
      decode: () => stateRecord(1, { phase: `research-${callCount += 1}`, iteration: 1 }),
    };
    expectCompatibilityCode(
      () => registry.read(storedState(1), mutatingCodec),
      CompatibilityErrorCodes.CODEC_MUTATED_INPUT,
    );
    expectCompatibilityCode(
      () => registry.read(storedState(1), nondeterministicCodec),
      CompatibilityErrorCodes.CODEC_NON_DETERMINISTIC,
    );
  });

  it('rejects mutating, nondeterministic, throwing, and invalid-output upcasters at startup', () => {
    const base = stateDefinition().upcasters[0];
    const mutating: StateUpcasterDefinition = {
      ...base,
      identity: 'legacy.review.iteration-state@1-to-2-mutating',
      upcast: (record) => {
        (record.payload as JsonObject).mutation = true;
        return upcastStateOneToTwo(record);
      },
    };
    let counter = 0;
    const nondeterministic: StateUpcasterDefinition = {
      ...base,
      identity: 'legacy.review.iteration-state@1-to-2-nondeterministic',
      upcast: (record) => ({
        ...upcastStateOneToTwo(record),
        record: stateRecord(2, {
          stage: record.payload.phase,
          iteration: record.payload.iteration,
          status: `complete-${counter += 1}`,
        }, record.identity),
      }),
    };
    const throwing: StateUpcasterDefinition = {
      ...base,
      identity: 'legacy.review.iteration-state@1-to-2-throwing',
      upcast: () => { throw new Error('fixture rejection'); },
    };
    const invalidOutput: StateUpcasterDefinition = {
      ...base,
      identity: 'legacy.review.iteration-state@1-to-2-invalid',
      upcast: (record) => ({
        ...upcastStateOneToTwo(record),
        record: { ...upcastStateOneToTwo(record).record, stateVersion: 3 },
      }),
    };

    expectCompatibilityCode(
      () => new StateUpcasterRegistry([stateDefinition([
        mutating,
        stateDefinition().upcasters[1],
      ])]),
      CompatibilityErrorCodes.UPCAST_MUTATED_INPUT,
    );
    expectCompatibilityCode(
      () => new StateUpcasterRegistry([stateDefinition([
        nondeterministic,
        stateDefinition().upcasters[1],
      ])]),
      CompatibilityErrorCodes.UPCAST_NON_DETERMINISTIC,
    );
    expectCompatibilityCode(
      () => new StateUpcasterRegistry([stateDefinition([
        throwing,
        stateDefinition().upcasters[1],
      ])]),
      CompatibilityErrorCodes.UPCAST_EXECUTION_FAILED,
    );
    expectCompatibilityCode(
      () => new StateUpcasterRegistry([stateDefinition([
        invalidOutput,
        stateDefinition().upcasters[1],
      ])]),
      CompatibilityErrorCodes.UPCAST_INVALID_OUTPUT,
    );
  });

  it('rejects immutable identity changes, lossy maps, and ambiguous introduced fields', () => {
    const base = stateDefinition().upcasters[0];
    const identityMutation: StateUpcasterDefinition = {
      ...base,
      identity: 'legacy.review.iteration-state@1-to-2-identity-change',
      upcast: (record) => ({
        ...upcastStateOneToTwo(record),
        record: stateRecord(2, {
          stage: record.payload.phase,
          iteration: record.payload.iteration,
          status: 'complete',
        }, { runId: 'different-run' }),
      }),
    };
    const lossy: StateUpcasterDefinition = {
      ...base,
      identity: 'legacy.review.iteration-state@1-to-2-lossy',
      upcast: (record) => ({
        ...upcastStateOneToTwo(record),
        sourceFieldMap: { phase: 'stage' },
      }),
    };
    const ambiguous: StateUpcasterDefinition = {
      ...base,
      identity: 'legacy.review.iteration-state@1-to-2-ambiguous',
      upcast: (record) => ({
        ...upcastStateOneToTwo(record),
        introducedFields: {},
      }),
    };

    expectCompatibilityCode(
      () => new StateUpcasterRegistry([stateDefinition([
        identityMutation,
        stateDefinition().upcasters[1],
      ])]),
      CompatibilityErrorCodes.UPCAST_IDENTITY_MUTATION,
    );
    expectCompatibilityCode(
      () => new StateUpcasterRegistry([stateDefinition([
        lossy,
        stateDefinition().upcasters[1],
      ])]),
      CompatibilityErrorCodes.UPCAST_LOSSY_CONVERSION,
    );
    expectCompatibilityCode(
      () => new StateUpcasterRegistry([stateDefinition([
        ambiguous,
        stateDefinition().upcasters[1],
      ])]),
      CompatibilityErrorCodes.UPCAST_LOSSY_CONVERSION,
    );
  });

  it('restores the exact direct reader when the upcasting gate is disabled', () => {
    const direct = { source: 'legacy', value: 3 };
    let compatibilityCalls = 0;
    const result = readWithUpcastingGate(false, () => direct, () => {
      compatibilityCalls += 1;
      return { source: 'compatibility', value: 4 };
    });
    expect(result).toBe(direct);
    expect(compatibilityCalls).toBe(0);
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. EVENT UPCASTER COMPOSITION
// ───────────────────────────────────────────────────────────────────

describe('canonical event upcaster composition', () => {
  it('delegates current, one-hop, and multi-hop reads to the canonical envelope boundary', () => {
    const registry = new EventTypeRegistry([eventDefinition()]);
    const current = readCompatibilityEvent(JSON.stringify(eventEnvelope(3, {
      message: 'complete',
      severity: 'info',
      category: 'workflow',
    })), registry);
    const oneHop = readCompatibilityEvent(JSON.stringify(eventEnvelope(2, {
      message: 'complete',
      severity: 'info',
    })), registry);
    const multiHop = readCompatibilityEvent(JSON.stringify(eventEnvelope(1, {
      message: 'complete',
    })), registry);

    expect(current.hopTrace).toHaveLength(0);
    expect(oneHop.hopTrace).toHaveLength(1);
    expect(multiHop.hopTrace.map(({ fromVersion, toVersion }) => [fromVersion, toVersion]))
      .toEqual([[1, 2], [2, 3]]);
    expect(multiHop.effective.envelope).toEqual(current.effective.envelope);
    expect(multiHop.stored.envelope.event_version).toBe(1);
  });

  it('fails closed for future event versions and historical writes', () => {
    const registry = new EventTypeRegistry([eventDefinition()]);
    expect(() => readCompatibilityEvent(JSON.stringify(eventEnvelope(4, {
      message: 'future',
    })), registry)).toThrow(EventReadError);
    expect(() => prepareEventWrite(eventEnvelope(1, { message: 'historical' }), registry))
      .toThrow(EventWriteError);
  });

  it('rejects missing adjacent event links at registry startup', () => {
    const definition = eventDefinition();
    expect(() => new EventTypeRegistry([{ ...definition, upcasters: [definition.upcasters[0]] }]))
      .toThrow(RegistryValidationError);
  });

  it('rejects lossy event upcasters without exposing an effective event', () => {
    const definition = eventDefinition();
    const lossy = {
      ...definition.upcasters[0],
      upcast: (event: EventEnvelope): UpcastOutcome => ({
        ...upcastEventOneToTwo(event),
        sourceFieldMap: {},
      }),
    };
    const registry = new EventTypeRegistry([{
      ...definition,
      upcasters: [lossy, definition.upcasters[1]],
    }]);
    expect(() => readCompatibilityEvent(JSON.stringify(eventEnvelope(1, {
      message: 'complete',
    })), registry)).toThrow(EventUpcastError);
  });
});

// ───────────────────────────────────────────────────────────────────
// 6. DUAL-READ RECONCILIATION
// ───────────────────────────────────────────────────────────────────

describe('legacy-authoritative dual reads', () => {
  it('returns the exact legacy value and records parity for equivalent current models', async () => {
    const legacyValue = { secret: 'legacy-payload', status: 'complete' };
    const adapter = new DualReadAdapter({
      readLegacy: () => legacyValue,
      normalizeLegacy: () => legacyModel(),
      readDark: () => darkModel(),
    });

    const result = await adapter.read(comparisonToken());
    expect(result).toBe(legacyValue);
    expect(adapter.readEvidence()).toMatchObject([{
      outcome: 'parity',
      parityEligible: true,
    }]);
    expect(adapter.readEvidence()[0].legacyFingerprint)
      .toBe(adapter.readEvidence()[0].darkFingerprint);
    expect(JSON.stringify(adapter.readEvidence())).not.toContain('legacy-payload');
  });

  it('returns legacy values for divergence, dark lag, and incomparable positions', async () => {
    const cases = [
      { dark: darkModel({ status: 'failed' }), outcome: 'divergence' },
      { dark: darkModel(undefined, { comparisonSequence: 3 }), outcome: 'dark_lagging' },
      { dark: darkModel(undefined, { comparisonSequence: 5 }), outcome: 'not_comparable' },
      { dark: darkModel(undefined, { verifiedHeadSequence: 9 }), outcome: 'not_comparable' },
    ];
    for (const entry of cases) {
      const legacyValue = { case: entry.outcome };
      const adapter = new DualReadAdapter({
        readLegacy: () => legacyValue,
        normalizeLegacy: () => legacyModel(),
        readDark: () => entry.dark,
      });
      expect(await adapter.read(comparisonToken())).toBe(legacyValue);
      expect(adapter.readEvidence()[0].outcome).toBe(entry.outcome);
      expect(adapter.readEvidence()[0].parityEligible).toBe(false);
    }
  });

  it('classifies missing, unresolvable, and failed dark reads without fallback', async () => {
    const cases = [
      { readDark: () => null, outcome: 'dark_missing' },
      {
        readDark: () => { throw new CompatibilityError(
          CompatibilityErrorCodes.FUTURE_STATE_VERSION,
          'future',
        ); },
        outcome: 'dark_invalid',
      },
      { readDark: () => { throw new Error('offline'); }, outcome: 'dark_failure' },
    ];
    for (const entry of cases) {
      const legacyValue = { source: 'legacy' };
      const adapter = new DualReadAdapter({
        readLegacy: () => legacyValue,
        normalizeLegacy: () => legacyModel(),
        readDark: entry.readDark,
      });
      expect(await adapter.read(comparisonToken())).toBe(legacyValue);
      expect(adapter.readEvidence()[0].outcome).toBe(entry.outcome);
    }
  });

  it('preserves the exact legacy error when the dark read succeeds', async () => {
    const legacyError = Object.assign(new Error('legacy unavailable'), { code: 'LEGACY_READ_FAILED' });
    const adapter = new DualReadAdapter({
      readLegacy: () => { throw legacyError; },
      normalizeLegacy: () => legacyModel(),
      readDark: () => darkModel(),
    });

    await expect(adapter.read(comparisonToken())).rejects.toBe(legacyError);
    expect(adapter.readEvidence()).toMatchObject([{
      outcome: 'legacy_failure_dark_success',
      legacyErrorCode: 'LEGACY_READ_FAILED',
    }]);
  });

  it('fails compatibility closed while preserving a successful legacy read', async () => {
    const legacyValue = { source: 'legacy' };
    const adapter = new DualReadAdapter({
      readLegacy: () => legacyValue,
      normalizeLegacy: () => { throw new CompatibilityError(
        CompatibilityErrorCodes.AMBIGUOUS_UNVERSIONED_STATE,
        'ambiguous',
      ); },
      readDark: () => darkModel(),
    });

    expect(await adapter.read(comparisonToken())).toBe(legacyValue);
    expect(adapter.readEvidence()).toMatchObject([{
      outcome: 'legacy_compatibility_failure',
      legacyErrorCode: CompatibilityErrorCodes.AMBIGUOUS_UNVERSIONED_STATE,
    }]);
  });

  it('performs no dark read or normalization when dual read is disabled', async () => {
    const legacyValue = { source: 'legacy' };
    let normalizationCalls = 0;
    let darkCalls = 0;
    const adapter = new DualReadAdapter({
      readLegacy: () => legacyValue,
      normalizeLegacy: () => {
        normalizationCalls += 1;
        return legacyModel();
      },
      readDark: () => {
        darkCalls += 1;
        return darkModel();
      },
      isDualReadEnabled: () => false,
    });

    expect(await adapter.read(comparisonToken())).toBe(legacyValue);
    expect(normalizationCalls).toBe(0);
    expect(darkCalls).toBe(0);
    expect(adapter.readEvidence()).toEqual([]);
  });

  it('keeps malformed tokens and observer failures outside legacy control flow', async () => {
    const legacyValue = { source: 'legacy' };
    let darkCalls = 0;
    const adapter = new DualReadAdapter({
      readLegacy: () => legacyValue,
      normalizeLegacy: () => legacyModel(),
      readDark: () => {
        darkCalls += 1;
        return darkModel();
      },
      observe: () => { throw new Error('observer failed'); },
      evidenceCapacity: 1,
    });
    const invalid = { ...comparisonToken(), darkHeadHash: 'invalid' };

    expect(await adapter.read(invalid)).toBe(legacyValue);
    expect(darkCalls).toBe(0);
    expect(adapter.readEvidence()).toHaveLength(1);
    expect(adapter.readEvidence()[0].outcome).toBe('legacy_compatibility_failure');
  });

  it('treats throwing dual-read gates as disabled without changing legacy control flow', async () => {
    const legacyValue = { source: 'legacy' };
    let darkCalls = 0;
    const adapter = new DualReadAdapter({
      readLegacy: () => legacyValue,
      normalizeLegacy: () => legacyModel(),
      readDark: () => {
        darkCalls += 1;
        return darkModel();
      },
      isDualReadEnabled: () => { throw new Error('gate unavailable'); },
    });

    expect(await adapter.read(comparisonToken())).toBe(legacyValue);
    expect(darkCalls).toBe(0);
    expect(adapter.readEvidence()).toEqual([]);
  });

  it('classifies malformed legacy normalization as a compatibility failure', async () => {
    const legacyValue = { source: 'legacy' };
    const adapter = new DualReadAdapter({
      readLegacy: () => legacyValue,
      normalizeLegacy: () => legacyModel({ invalid: Number.NaN }),
      readDark: () => darkModel(),
    });

    expect(await adapter.read(comparisonToken())).toBe(legacyValue);
    expect(adapter.readEvidence()[0].outcome).toBe('legacy_compatibility_failure');
  });

  it('makes semantic comparison independent of JSON key insertion order', () => {
    const result = reconcileReadModels(
      comparisonToken(),
      legacyModel({ status: 'complete', count: 1 }),
      darkModel({ count: 1, status: 'complete' }),
    );
    expect(result.outcome).toBe('parity');
    expect(result.legacyFingerprint).toBe(result.darkFingerprint);
  });
});

// ───────────────────────────────────────────────────────────────────
// 7. DARK-ONLY WRITE CONTRACT
// ───────────────────────────────────────────────────────────────────

describe('dark-only mirror writes', () => {
  it('attempts one dark append after legacy acceptance and returns the exact legacy result', async () => {
    const { event, request } = mirrorEvent();
    const legacyResult = { accepted: true };
    let calls = 0;
    const recorder: DarkMirrorRecorder = {
      recordAfterLegacy: async () => {
        calls += 1;
        return { dark: true } as never;
      },
    };
    const accepted: AcceptedLegacyTransition<typeof legacyResult> = {
      result: legacyResult,
      authorityState: 'shadowing',
      authorityEpoch: 7,
    };

    const result = await mirrorAcceptedLegacyTransition(
      accepted,
      recorder,
      'review-state-jsonl',
      event,
      request,
    );
    expect(result).toBe(legacyResult);
    expect(calls).toBe(1);
  });

  it('does not retry or change legacy success when the dark recorder fails', async () => {
    const { event, request } = mirrorEvent();
    const legacyResult = { accepted: true };
    const observed: string[] = [];
    let calls = 0;
    const recorder: DarkMirrorRecorder = {
      recordAfterLegacy: async () => {
        calls += 1;
        throw Object.assign(new Error('append failed'), { code: 'DARK_APPEND_FAILED' });
      },
    };

    const result = await mirrorAcceptedLegacyTransition(
      { result: legacyResult, authorityState: 'shadowing', authorityEpoch: 7 },
      recorder,
      'review-state-jsonl',
      event,
      request,
      { observeFailure: (code) => observed.push(code) },
    );
    expect(result).toBe(legacyResult);
    expect(calls).toBe(1);
    expect(observed).toEqual(['DARK_APPEND_FAILED']);
  });

  it('fails mirror preconditions closed without exposing an authority switch', async () => {
    const { event, request } = mirrorEvent();
    const legacyResult = { accepted: true };
    const observed: string[] = [];
    let calls = 0;
    const recorder: DarkMirrorRecorder = {
      recordAfterLegacy: async <T>(_boundary, result: T) => {
        calls += 1;
        return result;
      },
    };
    const invalidAuthority = {
      result: legacyResult,
      authorityState: 'new_authoritative_reversible' as AuthorityState,
      authorityEpoch: 7,
    } as unknown as AcceptedLegacyTransition<typeof legacyResult>;

    expect(await mirrorAcceptedLegacyTransition(
      invalidAuthority,
      recorder,
      'review-state-jsonl',
      event,
      request,
      { observeFailure: (code) => observed.push(code) },
    )).toBe(legacyResult);
    expect(calls).toBe(0);
    expect(observed).toEqual(['DARK_MIRROR_PRECONDITION_FAILED']);
  });

  it('restores the legacy-only path when dark mirroring is disabled', async () => {
    const { event, request } = mirrorEvent();
    const legacyResult = { accepted: true };
    let calls = 0;
    const recorder: DarkMirrorRecorder = {
      recordAfterLegacy: async <T>(_boundary, result: T) => {
        calls += 1;
        return result;
      },
    };

    expect(await mirrorAcceptedLegacyTransition(
      { result: legacyResult, authorityState: 'legacy_authoritative', authorityEpoch: 7 },
      recorder,
      'review-state-jsonl',
      event,
      request,
      { isEnabled: () => false },
    )).toBe(legacyResult);
    expect(calls).toBe(0);
  });

  it('treats a throwing mirror gate as disabled and preserves legacy success', async () => {
    const { event, request } = mirrorEvent();
    const legacyResult = { accepted: true };
    const observed: string[] = [];
    let calls = 0;
    const recorder: DarkMirrorRecorder = {
      recordAfterLegacy: async <T>(_boundary, result: T) => {
        calls += 1;
        return result;
      },
    };

    expect(await mirrorAcceptedLegacyTransition(
      { result: legacyResult, authorityState: 'shadowing', authorityEpoch: 7 },
      recorder,
      'review-state-jsonl',
      event,
      request,
      {
        isEnabled: () => { throw new Error('gate unavailable'); },
        observeFailure: (code) => observed.push(code),
      },
    )).toBe(legacyResult);
    expect(calls).toBe(0);
    expect(observed).toEqual(['DARK_MIRROR_GATE_FAILED']);
  });

  it('rejects an event or request bound to a different legacy authority epoch', async () => {
    const { event, request } = mirrorEvent();
    const legacyResult = { accepted: true };
    let calls = 0;
    const recorder: DarkMirrorRecorder = {
      recordAfterLegacy: async <T>(_boundary, result: T) => {
        calls += 1;
        return result;
      },
    };

    expect(await mirrorAcceptedLegacyTransition(
      { result: legacyResult, authorityState: 'shadowing', authorityEpoch: 8 },
      recorder,
      'review-state-jsonl',
      event,
      request,
    )).toBe(legacyResult);
    expect(calls).toBe(0);
  });
});
