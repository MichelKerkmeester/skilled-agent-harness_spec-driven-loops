// ───────────────────────────────────────────────────────────────────
// MODULE: Pinned Runtime Fixture Replay Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import { validateEventEnvelope } from '../../src/index.js';
import { createCanonicalState } from './helpers.js';
import { RUNTIME_PATH_HARNESSES } from './replay-helpers.js';

import type { RuntimeAdapterResult } from '../../src/runtimes/index.js';

const TERMINAL_FLOWS = [
  ['cancelled', 'cancelled', 'cancellation', 'cancelled'],
  ['disconnect', 'disconnected', 'error', 'failed'],
  ['error', 'runtime-failure', 'error', 'failed'],
  ['timeout', 'timeout', 'error', 'failed'],
] as const;

describe('pinned runtime fixture replay', () => {
  it('replays all six runtimes and eight paths into identical shared shapes', () => {
    expect(RUNTIME_PATH_HARNESSES).toHaveLength(8);
    expect(new Set(RUNTIME_PATH_HARNESSES.map((harness) => harness.record.runtime)).size)
      .toBe(6);

    const finalShapes = RUNTIME_PATH_HARNESSES.map((harness) => {
      const result = harness.adaptFinal();
      expect(result).toMatchObject({
        status: 'mapped',
        reasonCode: 'none',
        presentationTier: harness.record.presentationTier,
      });
      expect(result.event).toMatchObject({
        kind: 'assistant-message',
        phase: 'final',
        terminalStatus: 'completed',
      });
      expect(validateEventEnvelope(result.event).success).toBe(true);
      return sharedShape(result);
    });

    const extensionShapes = RUNTIME_PATH_HARNESSES.map((harness) => {
      const result = harness.adaptExtension();
      expect(result).toMatchObject({ status: 'mapped', reasonCode: 'none' });
      expect(result.event).toMatchObject({
        kind: 'extension',
        phase: 'final',
        payload: {},
        terminalStatus: 'completed',
      });
      expect(result.event?.extensions[harness.extensionNamespace]).toEqual({
        opaqueState: 'retained',
      });
      expect(validateEventEnvelope(result.event).success).toBe(true);
      return sharedShape(result);
    });

    expectAllEqual(finalShapes);
    expectAllEqual(extensionShapes);
  });

  it.each(TERMINAL_FLOWS)(
    'normalizes %s lifecycle fixtures identically on every path',
    (flow, reasonCode, kind, phase) => {
      const shapes = RUNTIME_PATH_HARNESSES.map((harness) => {
        const result = harness.adaptTerminal(flow);
        expect(result).toMatchObject({
          status: 'exact-original',
          reasonCode,
          event: expect.objectContaining({
            kind,
            phase,
            terminalStatus: phase,
          }),
        });
        expect(validateEventEnvelope(result.event).success).toBe(true);
        return sharedShape(result);
      });

      expectAllEqual(shapes);
    },
  );

  it('never writes canonical state and emits only allowlisted content-free telemetry', () => {
    for (const harness of RUNTIME_PATH_HARNESSES) {
      const canary = `TRANSCRIPT_${harness.record.pathId}_CANARY`;
      const frozen = Object.freeze(createCanonicalState(canary));
      const writeSpy = vi.fn();
      const canonical = new Proxy(frozen, {
        set(_target, property, value) {
          writeSpy(property, value);
          return false;
        },
      });
      const before = JSON.stringify(canonical);
      const results = [
        harness.adaptStreaming({ canonical }),
        harness.adaptFinal({ canonical }),
        harness.adaptExtension({ canonical }),
        harness.adaptTerminal('cancelled', { canonical }),
        harness.adaptTerminal('disconnect', { canonical }),
        harness.adaptTerminal('timeout', { canonical }),
      ];

      expect(writeSpy).not.toHaveBeenCalled();
      expect(JSON.stringify(canonical)).toBe(before);
      expect(Object.isFrozen(frozen)).toBe(true);
      for (const result of results) {
        const serialized = JSON.stringify(result.telemetry);
        expect(Object.keys(result.telemetry).sort()).toEqual([
          'eventName',
          'pathId',
          'presentationTier',
          'reasonCode',
          'runtime',
          'status',
          'telemetryVersion',
        ]);
        expect(serialized).not.toContain(canary);
        expect(serialized).not.toContain(canonical.exactOriginal.bytesBase64);
        expect(serialized).not.toContain('credential');
      }
    }
  });
});

function sharedShape(result: RuntimeAdapterResult) {
  const event = result.event;
  if (event === null) {
    throw new Error('Pinned replay fixture did not emit a shared event.');
  }
  const extensionValues = Object.values(event.extensions);
  return {
    resultKeys: Object.keys(result).sort(),
    generationKeys: Object.keys(result.generation).sort(),
    eventKeys: Object.keys(event).sort(),
    orderKeys: Object.keys(event.order).sort(),
    payloadKeys: Object.keys(event.payload).sort(),
    extensionCount: extensionValues.length,
    extensionValueKeys: extensionValues.flatMap((value) =>
      typeof value === 'object' && value !== null && !Array.isArray(value)
        ? Object.keys(value).sort()
        : []),
    telemetryKeys: Object.keys(result.telemetry).sort(),
    exactOriginalKeys: result.exactOriginal === null
      ? []
      : Object.keys(result.exactOriginal).sort(),
  };
}

function expectAllEqual<TValue>(values: readonly TValue[]): void {
  const first = values[0];
  if (first === undefined) {
    throw new Error('Expected at least one pinned fixture shape.');
  }
  for (const value of values.slice(1)) {
    expect(value).toEqual(first);
  }
}
