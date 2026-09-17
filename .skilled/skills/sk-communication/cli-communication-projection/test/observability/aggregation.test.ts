// ───────────────────────────────────────────────────────────────────
// MODULE: Content-Free Telemetry Aggregation Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { aggregateLifecycleEvents } from '../../src/observability/index.js';

import type { TelemetryEvent } from '../../src/contracts/index.js';
import type { RuntimeTelemetryRecord } from '../../src/runtimes/index.js';

function telemetry(
  outcome: TelemetryEvent['outcome'],
  reasonCode: TelemetryEvent['reasonCode'],
): TelemetryEvent {
  return {
    contractKind: 'telemetry',
    schemaVersion: '1.0.0',
    eventName: 'projection-terminal',
    runtime: 'codex',
    providerId: null,
    modelId: null,
    privacyClass: 'local-offline',
    outcome,
    reasonCode,
    durations: { assemblyMs: 1, providerMs: 2, validationMs: 3, totalMs: 6 },
    byteCounts: { input: 12, output: 10 },
    attemptCount: 1,
    correlationDigest: null,
    keyRotationId: null,
  };
}

function runtimeTelemetry(
  runtime: RuntimeTelemetryRecord['runtime'],
  presentationTier: RuntimeTelemetryRecord['presentationTier'],
  status: RuntimeTelemetryRecord['status'],
  reasonCode: RuntimeTelemetryRecord['reasonCode'],
): RuntimeTelemetryRecord {
  return {
    telemetryVersion: 'runtime-telemetry/1.0.0',
    eventName: 'runtime-adapter-terminal',
    runtime,
    pathId: 'synthetic-path',
    presentationTier,
    status,
    reasonCode,
  };
}

describe('content-free lifecycle aggregation', () => {
  it('counts outcomes and rates by runtime and presentation tier', () => {
    const aggregate = aggregateLifecycleEvents([
      telemetry('accepted', 'none'),
      telemetry('rejected', 'validation-rejected'),
      telemetry('exact-original', 'timeout'),
      runtimeTelemetry('codex', 'full-projection', 'projection', 'none'),
      runtimeTelemetry('codex', 'safe-native', 'exact-original', 'cancelled'),
      runtimeTelemetry('pi', 'safe-native', 'degraded', 'atomic-replace-unavailable'),
      { eventName: 'runtime-adapter-terminal', runtime: 'codex', prompt: 'must-drop' },
    ]);

    expect(aggregate).toMatchObject({
      aggregationVersion: 'observability-aggregation/1.0.0',
      eventCount: 6,
      ignoredEventCount: 1,
      counters: {
        accepted: 2,
        rejected: 1,
        timeout: 1,
        cancelled: 1,
        fallback: 2,
        degraded: 1,
      },
      rates: {
        accepted: 0.333333,
        rejected: 0.166667,
        timeout: 0.166667,
        cancelled: 0.166667,
        fallback: 0.333333,
        degraded: 0.166667,
      },
    });
    expect(aggregate.byRuntime).toEqual([
      expect.objectContaining({ runtime: 'codex', eventCount: 5 }),
      expect.objectContaining({ runtime: 'pi', eventCount: 1 }),
    ]);
    expect(aggregate.byPresentationTier).toEqual([
      expect.objectContaining({ presentationTier: 'full-projection', eventCount: 1 }),
      expect.objectContaining({ presentationTier: 'safe-native', eventCount: 2 }),
    ]);
    expect(aggregate.byRuntimeAndPresentationTier).toEqual([
      expect.objectContaining({
        runtime: 'codex',
        presentationTier: 'full-projection',
        eventCount: 1,
      }),
      expect.objectContaining({
        runtime: 'codex',
        presentationTier: 'safe-native',
        eventCount: 1,
      }),
      expect.objectContaining({
        runtime: 'pi',
        presentationTier: 'safe-native',
        eventCount: 1,
      }),
    ]);
  });

  it('never retains event identifiers, content, or correlation values', () => {
    const canary = 'RAW_AGGREGATION_CONTENT_CANARY';
    const aggregate = aggregateLifecycleEvents([
      {
        ...telemetry('accepted', 'none'),
        correlationDigest: `hmac-sha256:${'a'.repeat(64)}`,
        keyRotationId: 'window-1',
      },
      {
        ...runtimeTelemetry('codex', 'safe-native', 'exact-original', 'runtime-failure'),
        nested: { candidateText: canary },
      },
    ]);
    const serialized = JSON.stringify(aggregate);

    expect(aggregate.eventCount).toBe(1);
    expect(aggregate.ignoredEventCount).toBe(1);
    expect(serialized).not.toContain(canary);
    expect(serialized).not.toContain('hmac-sha256');
    expect(serialized).not.toContain('window-1');
    expect(serialized).not.toContain('synthetic-path');
  });
});
