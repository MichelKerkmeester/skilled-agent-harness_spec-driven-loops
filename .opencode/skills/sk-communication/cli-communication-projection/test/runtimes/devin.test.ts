// ───────────────────────────────────────────────────────────────────
// MODULE: Devin Runtime Adapter Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { decodeExactOriginal } from '../../src/index.js';
import {
  DevinCapabilityRecords,
  DevinRuntimePaths,
  assertRuntimeAdapterConformance,
  devinRuntimeAdapter,
} from '../../src/runtimes/index.js';
import {
  OBSERVED_AT,
  createAcceptedRenderDecision,
  createCanonicalState,
  createRejectedRenderDecision,
  createRuntimeInput,
} from './helpers.js';

import type {
  DevinRuntimeEvent,
  RuntimeAdapterInput,
  RuntimeCanonicalState,
  RuntimeConformanceCase,
} from '../../src/runtimes/index.js';

const TESTED_RUNTIME_VERSION = '3000.4.16';
const TESTED_PROTOCOL_VERSION = '1.0.0';

describe('Devin runtime adapter', () => {
  it('declares an independent pinned ACP full-projection path', () => {
    expect(DevinCapabilityRecords).toEqual([
      expect.objectContaining({
        runtime: 'devin',
        pathId: DevinRuntimePaths.ACP,
        protocol: 'devin-agent-client-protocol',
        presentationTier: 'full-projection',
        testedVersions: {
          runtime: TESTED_RUNTIME_VERSION,
          protocol: TESTED_PROTOCOL_VERSION,
        },
      }),
    ]);
    expect(DevinCapabilityRecords[0]?.evidence.observedAt).toBe(OBSERVED_AT);
  });

  it('passes shared conformance and retains Devin extension provenance', () => {
    const cases: readonly RuntimeConformanceCase<DevinRuntimeEvent>[] = [
      {
        input: createDevinInput(finalMessage()),
        expectedKind: 'assistant-message',
        expectedPhase: 'final',
        expectedTerminalStatus: 'completed',
        expectedReasonCode: 'none',
      },
      {
        input: createDevinInput({
          type: 'extension',
          eventId: 'devin-extension',
          index: 2,
          final: true,
          sourceTimestamp: OBSERVED_AT,
          namespace: 'devin.acp.extension',
          value: { slashCommand: 'advertised' },
        }),
        expectedKind: 'extension',
        expectedPhase: 'final',
        expectedTerminalStatus: 'completed',
        expectedReasonCode: 'none',
        expectedExtensionNamespace: 'devin.acp.extension',
      },
      {
        input: createDevinInput(terminalEvent('cancelled')),
        expectedKind: 'cancellation',
        expectedPhase: 'cancelled',
        expectedTerminalStatus: 'cancelled',
        expectedReasonCode: 'cancelled',
      },
    ];

    expect(assertRuntimeAdapterConformance({
      adapter: devinRuntimeAdapter,
      cases,
    })).toMatchObject({
      runtime: 'devin',
      casesChecked: 3,
      emittedEvents: 3,
      extensionEvents: 1,
      cancellationEvents: 1,
      canonicalWrites: 0,
    });
  });

  it('maps ACP tool lifecycle without promoting content into extensions', () => {
    const result = devinRuntimeAdapter.adapt(createDevinInput({
      type: 'tool-call',
      eventId: 'devin-tool-call',
      index: 1,
      sourceTimestamp: OBSERVED_AT,
      toolCallId: 'devin-tool',
    }));

    expect(result.event).toMatchObject({
      kind: 'tool-call',
      phase: 'created',
      toolCallId: 'devin-tool',
      extensions: {},
    });
  });

  it('accepts a validated ACP client projection', async () => {
    const result = devinRuntimeAdapter.present({
      pathId: DevinRuntimePaths.ACP,
      runtimeVersion: TESTED_RUNTIME_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision: await createAcceptedRenderDecision('Devin projection accepted.'),
    });

    expect(result).toMatchObject({
      status: 'projection',
      presentationTier: 'full-projection',
      mode: 'atomic-replace',
      originalSuppressed: true,
    });
  });

  it('rejects a projection when fidelity retains the original', async () => {
    const result = devinRuntimeAdapter.present({
      pathId: DevinRuntimePaths.ACP,
      runtimeVersion: TESTED_RUNTIME_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision: await createRejectedRenderDecision('Devin projection rejected.'),
    });

    expect(result).toMatchObject({
      status: 'exact-original',
      reasonCode: 'projection-rejected',
      projectionText: null,
      originalSuppressed: false,
    });
  });

  it('fails closed on an incompatible ACP protocol major', () => {
    const input = createDevinInput(finalMessage(), { protocolVersion: '2.0.0' });
    const result = devinRuntimeAdapter.adapt(input);

    expect(result).toMatchObject({
      status: 'exact-original',
      reasonCode: 'incompatible-protocol-major',
      event: null,
    });
    expect(result.exactOriginal).toBe(input.canonical.exactOriginal);
  });

  it.each([
    ['cancelled', 'cancelled'],
    ['disconnect', 'disconnected'],
    ['timeout', 'timeout'],
    ['error', 'runtime-failure'],
  ] as const)('preserves exact Devin bytes on %s', (type, reasonCode) => {
    const source = `Devin exact bytes for ${type}.`;
    const canonical = createCanonicalState(source);
    const result = devinRuntimeAdapter.adapt(createDevinInput(terminalEvent(type), { canonical }));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode });
    if (result.status !== 'exact-original') {
      throw new Error('Expected a terminal exact-original result.');
    }
    expect(Buffer.from(decodeExactOriginal(result.exactOriginal)).toString('utf8')).toBe(source);
  });

  it('keeps Devin telemetry content-free', async () => {
    const canary = 'DEVIN_RUNTIME_CANARY_638f';
    const renderDecision = await createAcceptedRenderDecision(canary);
    const result = devinRuntimeAdapter.present({
      pathId: DevinRuntimePaths.ACP,
      runtimeVersion: TESTED_RUNTIME_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision,
    });
    const serialized = JSON.stringify(result.telemetry);

    expect(serialized).not.toContain(canary);
    expect(serialized).not.toContain(renderDecision.exactOriginal.bytesBase64);
    expect(serialized).not.toContain('credential');
    expect(result.telemetry).toMatchObject({ runtime: 'devin', status: 'projection' });
  });
});

function createDevinInput(
  event: DevinRuntimeEvent,
  options: {
    readonly runtimeVersion?: string;
    readonly protocolVersion?: string;
    readonly canonical?: RuntimeCanonicalState;
  } = {},
): RuntimeAdapterInput<DevinRuntimeEvent> {
  return createRuntimeInput(event, {
    runtime: 'devin',
    runtimeVersion: options.runtimeVersion ?? TESTED_RUNTIME_VERSION,
    protocol: 'devin-agent-client-protocol',
    protocolVersion: options.protocolVersion ?? TESTED_PROTOCOL_VERSION,
    pathId: DevinRuntimePaths.ACP,
    ...(options.canonical === undefined ? {} : { canonical: options.canonical }),
  });
}

function finalMessage(): DevinRuntimeEvent {
  return {
    type: 'agent-message-chunk',
    eventId: 'devin-agent-message',
    index: 1,
    final: true,
    sourceTimestamp: OBSERVED_AT,
  };
}

function terminalEvent(
  type: 'cancelled' | 'disconnect' | 'error' | 'timeout',
): DevinRuntimeEvent {
  return {
    type,
    eventId: `devin-${type}`,
    index: 3,
    sourceTimestamp: OBSERVED_AT,
  };
}
