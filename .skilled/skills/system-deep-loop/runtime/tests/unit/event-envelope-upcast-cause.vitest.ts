// ───────────────────────────────────────────────────────────────────
// MODULE: Event Envelope Upcast Failure Cause Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  CURRENT_ENVELOPE_VERSION,
  EventEnvelopeErrorCodes,
  EventTypeRegistry,
  EventUpcastError,
  readEvent,
} from '../../lib/event-envelope/index.js';

import type { EventEnvelope, JsonObject, UpcastOutcome } from '../../lib/event-envelope/index.js';

const TYPE = 'deep-loop.execution.status-recorded';
const TIMESTAMP = '2026-01-01T00:00:00.000Z';

function hasMessage(payload: Readonly<JsonObject>): boolean {
  return typeof payload.message === 'string' && payload.message.length > 0;
}

// The registry runs every upcaster once against a synthetic probe at registration,
// so an upcaster that always threw would be refused there. This one passes the probe
// and fails only on a real stored event, which is the path that reaches the reader.
function upcastFailingOnRealEvents(event: EventEnvelope): UpcastOutcome {
  if (event.event_id !== 'registry-probe-event') {
    throw new RangeError(`legacy payload cannot be mapped for ${event.event_id}`);
  }
  return {
    envelope: { ...event, event_version: 2, payload: { ...event.payload, severity: 'info' } },
    sourceFieldMap: { message: 'message' },
    introducedFields: {
      severity: { kind: 'default', provenance: 'Legacy status records imply informational severity' },
    },
  };
}

function registry(): EventTypeRegistry {
  return new EventTypeRegistry([{
    eventType: TYPE,
    currentVersion: 2,
    versions: [
      { version: 1, payload: { requiredFields: ['message'], validate: hasMessage } },
      {
        version: 2,
        payload: {
          requiredFields: ['message', 'severity'],
          validate: (payload) => hasMessage(payload) && typeof payload.severity === 'string',
        },
      },
    ],
    upcasters: [{ identity: `${TYPE}@1-to-2`, fromVersion: 1, toVersion: 2, upcast: upcastFailingOnRealEvents }],
  }]);
}

function storedVersionOne(): string {
  return JSON.stringify({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: 'event-001',
    event_type: TYPE,
    event_version: 1,
    stream_id: 'stream-001',
    stream_sequence: 1,
    occurred_at: TIMESTAMP,
    recorded_at: TIMESTAMP,
    producer: { name: 'event-envelope-tests', version: 'candidate-001' },
    authority_epoch: 1,
    correlation_id: 'correlation-001',
    causation_id: null,
    idempotency_key: 'idempotency-001',
    payload: { message: 'complete' },
  });
}

function captureReadError(): EventUpcastError {
  try {
    readEvent(storedVersionOne(), registry());
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(EventUpcastError);
    return error as EventUpcastError;
  }
  throw new Error('expected readEvent to reject the failing upcast');
}

describe('event envelope upcast failure cause', () => {
  it('carries the upcaster error as the cause of the upcast failure', () => {
    const error = captureReadError();

    expect(error.code).toBe(EventEnvelopeErrorCodes.UPCAST_EXECUTION_FAILED);
    expect(error.cause).toBeInstanceOf(RangeError);
    expect((error.cause as Error).message).toBe('legacy payload cannot be mapped for event-001');
  });

  it('keeps the cause out of the serialized error and its bounded details', () => {
    const error = captureReadError();

    expect(Object.keys(error)).not.toContain('cause');
    expect(JSON.stringify(error)).not.toContain('legacy payload');
    expect(error.details).toEqual({ eventType: TYPE, fromVersion: 1 });
  });
});
