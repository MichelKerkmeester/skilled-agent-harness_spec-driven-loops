import { describe, expect, it } from 'vitest';

import * as eventEnvelopeApi from '../../lib/event-envelope/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  EVENT_ENVELOPE_FIELDS,
  EVENT_TYPE_NAMESPACE_GRAMMAR,
  EnvelopeValidationError,
  EventEnvelopeError,
  EventEnvelopeErrorCodes,
  EventReadError,
  EventTypeRegistry,
  EventUpcastError,
  EventWriteError,
  RegistryValidationError,
  canonicalJson,
  prepareEventWrite,
  readEvent,
  validateEventEnvelope,
} from '../../lib/event-envelope/index.js';
import { PRODUCER_FAMILY_FIXTURES } from '../fixtures/event-envelope-producers.js';

import type {
  EventEnvelope,
  EventTypeDefinition,
  EventUpcasterDefinition,
  JsonObject,
  UpcastOutcome,
} from '../../lib/event-envelope/index.js';

const TYPE = 'deep-loop.execution.status-recorded';
const TIMESTAMP = '2026-01-01T00:00:00.000Z';

function baseEnvelope(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: 'event-001',
    event_type: TYPE,
    event_version: 3,
    stream_id: 'stream-001',
    stream_sequence: 1,
    occurred_at: TIMESTAMP,
    recorded_at: TIMESTAMP,
    producer: { name: 'event-envelope-tests', version: 'candidate-001' },
    authority_epoch: 1,
    correlation_id: 'correlation-001',
    causation_id: null,
    idempotency_key: 'idempotency-001',
    payload: { message: 'complete', severity: 'info', category: 'lifecycle' },
    ...overrides,
  };
}

function assertStringField(payload: Readonly<JsonObject>, field: string): boolean {
  return typeof payload[field] === 'string' && (payload[field] as string).length > 0;
}

function upcastOneToTwo(event: EventEnvelope): UpcastOutcome {
  return {
    envelope: {
      ...event,
      event_version: 2,
      payload: { ...event.payload, severity: 'info' },
    },
    sourceFieldMap: { message: 'message' },
    introducedFields: {
      severity: { kind: 'default', provenance: 'Legacy status records imply informational severity' },
    },
  };
}

function upcastTwoToThree(event: EventEnvelope): UpcastOutcome {
  return {
    envelope: {
      ...event,
      event_version: 3,
      payload: { ...event.payload, category: 'lifecycle' },
    },
    sourceFieldMap: { message: 'message', severity: 'severity' },
    introducedFields: {
      category: { kind: 'derived', provenance: 'Status event semantics determine the lifecycle category' },
    },
  };
}

function primaryDefinition(): EventTypeDefinition {
  return {
    eventType: TYPE,
    currentVersion: 3,
    versions: [
      {
        version: 1,
        payload: {
          requiredFields: ['message'],
          validate: (payload) => assertStringField(payload, 'message'),
        },
      },
      {
        version: 2,
        payload: {
          requiredFields: ['message', 'severity'],
          validate: (payload) =>
            assertStringField(payload, 'message') && assertStringField(payload, 'severity'),
        },
      },
      {
        version: 3,
        payload: {
          requiredFields: ['message', 'severity', 'category'],
          validate: (payload) =>
            assertStringField(payload, 'message')
            && assertStringField(payload, 'severity')
            && assertStringField(payload, 'category'),
        },
      },
    ],
    upcasters: [
      { identity: `${TYPE}@1-to-2`, fromVersion: 1, toVersion: 2, upcast: upcastOneToTwo },
      { identity: `${TYPE}@2-to-3`, fromVersion: 2, toVersion: 3, upcast: upcastTwoToThree },
    ],
  };
}

function primaryRegistry(): EventTypeRegistry {
  return new EventTypeRegistry([primaryDefinition()]);
}

function twoVersionDefinition(upcast: EventUpcasterDefinition): EventTypeDefinition {
  return {
    eventType: TYPE,
    currentVersion: 2,
    versions: [
      {
        version: 1,
        payload: {
          requiredFields: ['message'],
          validate: (payload) => assertStringField(payload, 'message'),
        },
      },
      {
        version: 2,
        payload: {
          requiredFields: ['message', 'severity'],
          validate: (payload) =>
            assertStringField(payload, 'message') && assertStringField(payload, 'severity'),
        },
      },
    ],
    upcasters: [upcast],
  };
}

function storedVersionOne(overrides: Record<string, unknown> = {}): string {
  return JSON.stringify(baseEnvelope({ event_version: 1, payload: { message: 'complete' }, ...overrides }));
}

function expectCode(action: () => unknown, code: string): EventEnvelopeError {
  try {
    action();
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(EventEnvelopeError);
    expect((error as EventEnvelopeError).code).toBe(code);
    return error as EventEnvelopeError;
  }
  throw new Error(`Expected ${code}`);
}

describe('canonical event envelope', () => {
  it('freezes the exact fourteen-field outer shape and namespace grammar', () => {
    expect(EVENT_ENVELOPE_FIELDS).toHaveLength(14);
    expect(EVENT_TYPE_NAMESPACE_GRAMMAR).toContain('<domain>.<aggregate>.<event>');
    expect(Object.keys(validateEventEnvelope(baseEnvelope())).sort()).toEqual(
      [...EVENT_ENVELOPE_FIELDS].sort(),
    );
  });

  it.each(EVENT_ENVELOPE_FIELDS)('rejects a missing outer field: %s', (field) => {
    const candidate = baseEnvelope();
    delete candidate[field];
    const error = expectCode(
      () => validateEventEnvelope(candidate),
      EventEnvelopeErrorCodes.ENVELOPE_MISSING_FIELD,
    );
    expect(error).toBeInstanceOf(EnvelopeValidationError);
  });

  it('rejects unknown outer and producer keys', () => {
    expectCode(
      () => validateEventEnvelope(baseEnvelope({ unexpected: true })),
      EventEnvelopeErrorCodes.ENVELOPE_UNKNOWN_FIELD,
    );
    expectCode(
      () => validateEventEnvelope(baseEnvelope({
        producer: { name: 'producer', version: '1', extra: true },
      })),
      EventEnvelopeErrorCodes.ENVELOPE_UNKNOWN_FIELD,
    );
  });

  it.each([
    ['event_id', ''],
    ['stream_id', 7],
    ['event_version', 0],
    ['stream_sequence', -1],
    ['authority_epoch', 1.5],
    ['occurred_at', '2026-01-01T01:00:00+01:00'],
    ['recorded_at', '2026-02-30T00:00:00.000Z'],
    ['producer', 'runtime'],
    ['correlation_id', null],
    ['causation_id', ''],
    ['idempotency_key', '   '],
    ['payload', []],
  ])('rejects invalid outer scalar/nullability for %s', (field, value) => {
    expectCode(
      () => validateEventEnvelope(baseEnvelope({ [field]: value })),
      EventEnvelopeErrorCodes.ENVELOPE_INVALID_FIELD,
    );
  });

  it('rejects unsupported outer versions independently of event versions', () => {
    expectCode(
      () => validateEventEnvelope(baseEnvelope({ envelope_version: 2, event_version: 1 })),
      EventEnvelopeErrorCodes.ENVELOPE_UNSUPPORTED_VERSION,
    );
  });

  it('rejects malformed Unicode, prototype-sensitive keys, and structural limits', () => {
    expectCode(
      () => validateEventEnvelope(baseEnvelope({
        payload: { message: String.fromCharCode(0xd800) },
      })),
      EventEnvelopeErrorCodes.INVALID_UNICODE,
    );
    const polluted = JSON.parse('{"__proto__":{"polluted":true}}') as JsonObject;
    expectCode(
      () => validateEventEnvelope(baseEnvelope({ payload: polluted })),
      EventEnvelopeErrorCodes.ENVELOPE_INVALID_FIELD,
    );
    const deep: JsonObject = {};
    let cursor = deep;
    for (let index = 0; index < 70; index += 1) {
      cursor.next = {};
      cursor = cursor.next as JsonObject;
    }
    expectCode(
      () => validateEventEnvelope(baseEnvelope({ payload: deep })),
      EventEnvelopeErrorCodes.INPUT_LIMIT_EXCEEDED,
    );
  });
});

describe('deterministic type and version registry', () => {
  it('enumerates every payload contract and stable adjacent chain', () => {
    const registry = primaryRegistry();
    const [entry] = registry.inspect();
    expect(entry.supportedVersions).toEqual([1, 2, 3]);
    expect(entry.payloadContracts[2].requiredFields).toEqual(['category', 'message', 'severity']);
    expect(entry.payloadContracts[2].validatorDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(entry.payloadContracts[2].schemaDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(entry.upcasters.map((upcaster) => upcaster.fromVersion)).toEqual([1, 2]);
    expect(registry.digest).toMatch(/^[a-f0-9]{64}$/);
  });

  it('binds validator semantics into each schema digest and the registry digest', () => {
    const acceptsAnyMessage = (payload: Readonly<JsonObject>): boolean =>
      typeof payload.message === 'string';
    const acceptsOnlyComplete = (payload: Readonly<JsonObject>): boolean =>
      payload.message === 'complete';
    const definitionFor = (validate: (payload: Readonly<JsonObject>) => boolean): EventTypeDefinition => ({
      eventType: TYPE,
      currentVersion: 1,
      versions: [{ version: 1, payload: { requiredFields: ['message'], validate } }],
      upcasters: [],
    });

    const broad = new EventTypeRegistry([definitionFor(acceptsAnyMessage)]);
    const narrow = new EventTypeRegistry([definitionFor(acceptsOnlyComplete)]);
    expect(broad.inspect()[0].payloadContracts[0].validatorDigest).not.toBe(
      narrow.inspect()[0].payloadContracts[0].validatorDigest,
    );
    expect(broad.inspect()[0].payloadContracts[0].schemaDigest).not.toBe(
      narrow.inspect()[0].payloadContracts[0].schemaDigest,
    );
    expect(broad.digest).not.toBe(narrow.digest);
  });

  it('deep-freezes public registry descriptions and rejects post-construction mutation', () => {
    const registry = primaryRegistry();
    const resolved = registry.resolve(TYPE);
    const originalDigest = registry.digest;

    expect(Object.isFrozen(registry)).toBe(true);
    expect(Object.isFrozen(resolved)).toBe(true);
    expect(Object.isFrozen(resolved.supportedVersions)).toBe(true);
    expect(Object.isFrozen(resolved.payloadContracts)).toBe(true);
    expect(Object.isFrozen(resolved.payloadContracts[0].requiredFields)).toBe(true);
    expect(() => {
      (registry as unknown as { digest: string }).digest = 'tampered';
    }).toThrow(TypeError);
    expect(() => {
      (resolved.supportedVersions as number[]).push(4);
    }).toThrow(TypeError);
    expect(() => {
      (resolved.payloadContracts[0].requiredFields as string[])[0] = 'tampered';
    }).toThrow(TypeError);
    expect(registry.digest).toBe(originalDigest);
    expect(registry.resolve(TYPE).supportedVersions).toEqual([1, 2, 3]);
  });

  it('does not expose callable upcasters or mutable maps through the public registry surface', () => {
    const registry = primaryRegistry();
    const publicRegistry = registry as unknown as Record<string, unknown>;
    const publicApi = eventEnvelopeApi as unknown as Record<string, unknown>;
    const resolved = registry.resolve(TYPE);

    expect(publicRegistry.chain).toBeUndefined();
    expect(publicApi.readBoundaryUpcasterChain).toBeUndefined();
    expect(resolved).not.toBeInstanceOf(Map);
    expect(resolved.payloadContracts.some((contract) => contract instanceof Map)).toBe(false);
    expect(resolved.upcasters.every((upcaster) =>
      Object.values(upcaster).every((value) => typeof value !== 'function'))).toBe(true);
  });

  it('rejects duplicate and aliased event registrations', () => {
    expectCode(
      () => new EventTypeRegistry([primaryDefinition(), primaryDefinition()]),
      EventEnvelopeErrorCodes.REGISTRY_DUPLICATE_EVENT_TYPE,
    );
    expectCode(
      () => new EventTypeRegistry([{ ...primaryDefinition(), aliases: ['legacy.status'] }]),
      EventEnvelopeErrorCodes.REGISTRY_ALIAS_FORBIDDEN,
    );
  });

  it('normalizes malformed definitions into typed registry failures', () => {
    const malformed = {
      eventType: TYPE,
      currentVersion: 1,
      versions: [{ version: 1, payload: { validate: () => true } }],
      upcasters: [],
    } as unknown as EventTypeDefinition;
    const error = expectCode(
      () => new EventTypeRegistry([malformed]),
      EventEnvelopeErrorCodes.REGISTRY_INCOMPLETE_DEFINITION,
    );
    expect(error).toBeInstanceOf(RegistryValidationError);
  });

  it('rejects gaps, missing links, non-adjacent edges, cycles, and duplicate edges', () => {
    expectCode(
      () => new EventTypeRegistry([{
        ...primaryDefinition(),
        versions: primaryDefinition().versions.filter(({ version }) => version !== 2),
      }]),
      EventEnvelopeErrorCodes.REGISTRY_UPCASTER_GAP,
    );
    expectCode(
      () => new EventTypeRegistry([twoVersionDefinition({
        identity: 'missing-link-placeholder', fromVersion: 2, toVersion: 3, upcast: upcastOneToTwo,
      })]),
      EventEnvelopeErrorCodes.REGISTRY_UPCASTER_GAP,
    );
    expectCode(
      () => new EventTypeRegistry([{
        ...primaryDefinition(),
        upcasters: [
          { identity: 'direct', fromVersion: 1, toVersion: 3, upcast: upcastOneToTwo },
          primaryDefinition().upcasters[1],
        ],
      }]),
      EventEnvelopeErrorCodes.REGISTRY_UPCASTER_NON_ADJACENT,
    );
    expectCode(
      () => new EventTypeRegistry([{
        ...twoVersionDefinition({
          identity: 'forward', fromVersion: 1, toVersion: 2, upcast: upcastOneToTwo,
        }),
        upcasters: [
          { identity: 'forward', fromVersion: 1, toVersion: 2, upcast: upcastOneToTwo },
          { identity: 'back', fromVersion: 2, toVersion: 1, upcast: upcastOneToTwo },
        ],
      }]),
      EventEnvelopeErrorCodes.REGISTRY_UPCASTER_CYCLE,
    );
    expectCode(
      () => new EventTypeRegistry([{
        ...twoVersionDefinition({
          identity: 'first', fromVersion: 1, toVersion: 2, upcast: upcastOneToTwo,
        }),
        upcasters: [
          { identity: 'first', fromVersion: 1, toVersion: 2, upcast: upcastOneToTwo },
          { identity: 'second', fromVersion: 1, toVersion: 2, upcast: upcastOneToTwo },
        ],
      }]),
      EventEnvelopeErrorCodes.REGISTRY_DUPLICATE_UPCASTER,
    );
  });

  it('rejects an upcaster that mutates its input during registration', () => {
    const mutatingInput = (event: EventEnvelope): UpcastOutcome => {
      (event.payload as JsonObject).message = 'mutated';
      return {
        envelope: { ...event, event_version: 2, payload: { ...event.payload, severity: 'info' } },
        sourceFieldMap: { message: 'message' },
        introducedFields: {
          severity: { kind: 'default', provenance: 'Declared legacy default' },
        },
      };
    };
    expectCode(
      () => new EventTypeRegistry([twoVersionDefinition({
        identity: 'mutating-input', fromVersion: 1, toVersion: 2, upcast: mutatingInput,
      })]),
      EventEnvelopeErrorCodes.REGISTRY_UPCASTER_MUTATES_INPUT,
    );
  });
});

describe('current-only write boundary', () => {
  it('returns canonical bytes, digest, registry identity, and append identity without reparsing payloads', () => {
    const registry = primaryRegistry();
    const result = prepareEventWrite(baseEnvelope(), registry);
    expect(Buffer.from(result.canonicalBytes).toString('utf8')).toBe(canonicalJson(result.envelope));
    expect(result.canonicalDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(result.registryDigest).toBe(registry.digest);
    expect(result.identity).toEqual({
      eventId: 'event-001',
      eventType: TYPE,
      eventVersion: 3,
      streamId: 'stream-001',
      streamSequence: 1,
      authorityEpoch: 1,
      idempotencyKey: 'idempotency-001',
    });
  });

  it.each([1, 2, 4])('rejects caller-selected non-current version %s', (eventVersion) => {
    const error = expectCode(
      () => prepareEventWrite(baseEnvelope({ event_version: eventVersion }), primaryRegistry()),
      EventEnvelopeErrorCodes.WRITE_VERSION_NOT_CURRENT,
    );
    expect(error).toBeInstanceOf(EventWriteError);
  });

  it('rejects unknown types and invalid current payloads', () => {
    expectCode(
      () => prepareEventWrite(baseEnvelope({ event_type: 'deep-loop.unknown.event' }), primaryRegistry()),
      EventEnvelopeErrorCodes.REGISTRY_UNKNOWN_EVENT_TYPE,
    );
    expectCode(
      () => prepareEventWrite(baseEnvelope({ payload: { message: 'complete' } }), primaryRegistry()),
      EventEnvelopeErrorCodes.PAYLOAD_MISSING_FIELD,
    );
  });
});

describe('read-time adjacent upcasting', () => {
  it('preserves stored bytes and returns stable current output with an ordered hop trace', () => {
    const registry = primaryRegistry();
    const stored = storedVersionOne();
    const result = readEvent(stored, registry);
    expect(Buffer.from(result.stored.bytes).toString('utf8')).toBe(stored);
    expect(result.storedVersion).toBe(1);
    expect(result.effectiveVersion).toBe(3);
    expect(result.effective.envelope.payload).toEqual({
      message: 'complete', severity: 'info', category: 'lifecycle',
    });
    expect(result.hopTrace.map(({ fromVersion, toVersion }) => [fromVersion, toVersion])).toEqual([
      [1, 2], [2, 3],
    ]);
    expect(result.chainIdentity).toMatch(/^[a-f0-9]{64}$/);
    expect(Object.isFrozen(result.stored.envelope)).toBe(true);
    expect(Object.isFrozen(result.effective.envelope)).toBe(true);
  });

  it('is byte-stable across repeated reads and validates current events without transforms', () => {
    const registry = primaryRegistry();
    const first = readEvent(storedVersionOne(), registry);
    const second = readEvent(storedVersionOne(), registry);
    expect(first.effective.canonicalBytes).toEqual(second.effective.canonicalBytes);
    expect(first.chainIdentity).toBe(second.chainIdentity);
    expect(first.hopTrace).toEqual(second.hopTrace);

    const current = readEvent(JSON.stringify(baseEnvelope()), registry);
    expect(current.hopTrace).toEqual([]);
    expect(current.effectiveVersion).toBe(3);
  });

  it('fails closed on unknown type, future event version, unsupported outer version, and invalid stored payload', () => {
    expectCode(
      () => readEvent(storedVersionOne({ event_type: 'deep-loop.unknown.event' }), primaryRegistry()),
      EventEnvelopeErrorCodes.REGISTRY_UNKNOWN_EVENT_TYPE,
    );
    const future = expectCode(
      () => readEvent(storedVersionOne({ event_version: 4 }), primaryRegistry()),
      EventEnvelopeErrorCodes.READ_FUTURE_EVENT_VERSION,
    );
    expect(future).toBeInstanceOf(EventReadError);
    expectCode(
      () => readEvent(storedVersionOne({ envelope_version: 2 }), primaryRegistry()),
      EventEnvelopeErrorCodes.ENVELOPE_UNSUPPORTED_VERSION,
    );
    expectCode(
      () => readEvent(storedVersionOne({ payload: {} }), primaryRegistry()),
      EventEnvelopeErrorCodes.PAYLOAD_MISSING_FIELD,
    );
  });

  it('fails closed on invalid hop output', () => {
    const invalid = (event: EventEnvelope): UpcastOutcome => ({
      envelope: { ...event, event_version: 2, payload: { message: event.payload.message } },
      sourceFieldMap: { message: 'message' },
    });
    const registry = new EventTypeRegistry([twoVersionDefinition({
      identity: 'invalid-hop', fromVersion: 1, toVersion: 2, upcast: invalid,
    })]);
    const error = expectCode(
      () => readEvent(storedVersionOne(), registry),
      EventEnvelopeErrorCodes.UPCAST_INVALID_OUTPUT,
    );
    expect(error).toBeInstanceOf(EventUpcastError);
  });

  it('fails closed on immutable identity mutation', () => {
    const mutating = (event: EventEnvelope): UpcastOutcome => ({
      envelope: {
        ...event,
        event_id: 'rewritten',
        event_version: 2,
        payload: { ...event.payload, severity: 'info' },
      },
      sourceFieldMap: { message: 'message' },
      introducedFields: {
        severity: { kind: 'default', provenance: 'Declared legacy default' },
      },
    });
    const registry = new EventTypeRegistry([twoVersionDefinition({
      identity: 'identity-mutating', fromVersion: 1, toVersion: 2, upcast: mutating,
    })]);
    expectCode(
      () => readEvent(storedVersionOne(), registry),
      EventEnvelopeErrorCodes.UPCAST_IDENTITY_MUTATION,
    );
  });

  it('fails closed on lossy conversion and ambiguous defaults', () => {
    const lossy = (event: EventEnvelope): UpcastOutcome => ({
      envelope: { ...event, event_version: 2, payload: { message: 'lost', severity: 'info' } },
      sourceFieldMap: {},
      introducedFields: {
        message: { kind: 'derived', provenance: 'Replacement' },
        severity: { kind: 'default', provenance: 'Declared legacy default' },
      },
    });
    const lossyRegistry = new EventTypeRegistry([twoVersionDefinition({
      identity: 'lossy', fromVersion: 1, toVersion: 2, upcast: lossy,
    })]);
    expectCode(
      () => readEvent(storedVersionOne(), lossyRegistry),
      EventEnvelopeErrorCodes.UPCAST_LOSSY_CONVERSION,
    );

    const ambiguous = (event: EventEnvelope): UpcastOutcome => ({
      envelope: { ...event, event_version: 2, payload: { ...event.payload, severity: 'info' } },
      sourceFieldMap: { message: 'message' },
    });
    const ambiguousRegistry = new EventTypeRegistry([twoVersionDefinition({
      identity: 'ambiguous', fromVersion: 1, toVersion: 2, upcast: ambiguous,
    })]);
    expectCode(
      () => readEvent(storedVersionOne(), ambiguousRegistry),
      EventEnvelopeErrorCodes.UPCAST_AMBIGUOUS_DEFAULT,
    );
  });

  it('rejects nondeterministic upcasters during registration', () => {
    let toggle = false;
    const unstable = (event: EventEnvelope): UpcastOutcome => {
      toggle = !toggle;
      return {
        envelope: {
          ...event,
          event_version: 2,
          payload: { ...event.payload, severity: toggle ? 'info' : 'warning' },
        },
        sourceFieldMap: { message: 'message' },
        introducedFields: {
          severity: { kind: 'derived', provenance: 'Unstable test transform' },
        },
      };
    };
    expectCode(
      () => new EventTypeRegistry([twoVersionDefinition({
        identity: 'unstable', fromVersion: 1, toVersion: 2, upcast: unstable,
      })]),
      EventEnvelopeErrorCodes.REGISTRY_UPCASTER_NON_DETERMINISTIC,
    );
  });
});

describe('dark producer-family fixtures and sibling handoff', () => {
  const definitions: EventTypeDefinition[] = PRODUCER_FAMILY_FIXTURES.map((fixture) => ({
    eventType: fixture.eventType,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: {
        requiredFields: Object.keys(fixture.payload),
        validate: () => true,
      },
    }],
    upcasters: [],
  }));
  const registry = new EventTypeRegistry(definitions);

  it.each(PRODUCER_FAMILY_FIXTURES)('carries $family content only under payload', (fixture) => {
    const result = prepareEventWrite(baseEnvelope({
      event_type: fixture.eventType,
      event_version: 1,
      payload: fixture.payload,
    }), registry);
    expect(result.envelope.payload).toEqual(fixture.payload);
    for (const producerKey of Object.keys(fixture.payload)) {
      if (!EVENT_ENVELOPE_FIELDS.includes(producerKey as typeof EVENT_ENVELOPE_FIELDS[number])) {
        expect(Object.prototype.hasOwnProperty.call(result.envelope, producerKey)).toBe(false);
      }
    }
  });

  it('gives authorization and ledger consumers complete metadata and bytes without payload reparsing', () => {
    const fixture = PRODUCER_FAMILY_FIXTURES[0];
    const preflight = prepareEventWrite(baseEnvelope({
      event_type: fixture.eventType,
      event_version: 1,
      payload: fixture.payload,
    }), registry);
    const authorizationInput = {
      digest: preflight.canonicalDigest,
      ...preflight.identity,
    };
    const ledgerInput = Uint8Array.from(preflight.canonicalBytes);
    expect(authorizationInput.eventType).toBe(fixture.eventType);
    expect(authorizationInput.authorityEpoch).toBe(1);
    expect(ledgerInput.byteLength).toBeGreaterThan(0);
  });
});
