// ───────────────────────────────────────────────────────────────────
// MODULE: Core Evidence Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  MessageAssembler,
  createAssemblyTelemetryEvent,
  createCoreTelemetryEvent,
  emitCoreTelemetry,
  validateTelemetryEvent,
} from '../../src/index.js';
import {
  createGenerationKey,
  createSyntheticEvent,
  createTextOriginal,
} from './helpers.js';

import type { AssemblyTerminalResult, TelemetryEvent } from '../../src/index.js';

describe('content-free core evidence', () => {
  it('converts a terminal assembly into schema-valid keyed evidence', () => {
    const canary = 'RAW_MESSAGE_CANARY_91df2c';
    const result = completeMessage(canary);
    const emission = createAssemblyTelemetryEvent(result, {
      privacyClass: 'local-offline',
      correlation: {
        value: 'session-correlation-input',
        hmacKey: 'rotating-test-key',
        rotationId: 'rotation-2026-08-11',
      },
    });

    expect(emission.status).toBe('emitted');
    if (emission.status !== 'emitted') {
      return;
    }
    expect(validateTelemetryEvent(emission.event).success).toBe(true);
    expect(emission.event.eventName).toBe('assembly-terminal');
    expect(emission.event.outcome).toBe('accepted');
    expect(emission.event.reasonCode).toBe('none');
    expect(emission.event.correlationDigest).toMatch(/^hmac-sha256:[a-f0-9]{64}$/);
    expect(JSON.stringify(emission.event)).not.toContain(canary);
    expect(JSON.stringify(emission.event)).not.toContain('rotating-test-key');
  });

  it('rejects raw fields, free-form reasons, and unkeyed correlation digests', () => {
    const base = validInput();
    const raw = createCoreTelemetryEvent({
      ...base,
      rawText: 'RAW_TELEMETRY_CANARY_b42a',
    });
    expect(raw.status).toBe('suppressed');
    expect(raw.status === 'suppressed'
      && raw.issues.some((issue) => issue.code === 'unknown_key')).toBe(true);

    const freeForm = createCoreTelemetryEvent({
      ...base,
      reasonCode: 'raw user text is not a reason',
    });
    expect(freeForm.status).toBe('suppressed');

    const unkeyed = createCoreTelemetryEvent({
      ...base,
      correlationDigest: `sha256:${'a'.repeat(64)}`,
    });
    expect(unkeyed.status).toBe('suppressed');
  });

  it('delivers only validated events and suppresses sink exceptions', () => {
    const received: TelemetryEvent[] = [];
    const emitted = emitCoreTelemetry(validInput(), (event) => {
      received.push(event);
    });
    expect(emitted.status).toBe('emitted');
    expect(received).toHaveLength(1);
    expect(Object.isFrozen(received[0])).toBe(true);

    const failed = emitCoreTelemetry(validInput(), () => {
      throw new Error('sensitive sink detail');
    });
    expect(failed).toEqual({
      status: 'suppressed',
      reasonCode: 'sink-failed',
      issues: [{
        path: '$',
        code: 'sink_failed',
        message: 'Telemetry sink rejected the validated event.',
      }],
    });
  });
});

function completeMessage(text: string): AssemblyTerminalResult {
  const assembler = new MessageAssembler();
  const key = createGenerationKey('evidence');
  const original = createTextOriginal('evidence-original', text);
  const start = assembler.startGeneration({ key, exactOriginal: original, startedAtMs: 10 });
  if (start.status !== 'started') {
    throw new Error('Expected evidence generation to start.');
  }
  const event = createSyntheticEvent({
    key,
    eventId: 'evidence-final',
    kind: 'assistant-message',
    phase: 'final',
    terminalStatus: 'completed',
    sourceSequence: 0,
    arrivalIndex: 0,
    original,
  });
  const transition = assembler.ingestEvent({
    key,
    event,
    original,
    observedAtMs: 15,
  });
  if (transition.status !== 'terminal') {
    throw new Error('Expected evidence generation to terminate.');
  }
  return transition.result;
}

function validInput(): Record<string, unknown> {
  return {
    eventName: 'assembly-terminal',
    runtime: 'codex',
    providerId: null,
    modelId: null,
    privacyClass: 'local-offline',
    outcome: 'accepted',
    reasonCode: 'none',
    durations: {
      assemblyMs: 2,
      providerMs: 0,
      validationMs: 0,
      totalMs: 2,
    },
    byteCounts: { input: 10, output: 10 },
    attemptCount: 1,
  };
}
