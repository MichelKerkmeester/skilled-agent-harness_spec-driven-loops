// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor Runtime Adapter Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { decodeExactOriginal } from '../../src/index.js';
import {
  CursorCapabilityRecords,
  CursorRuntimePaths,
  DevinCapabilityRecords,
  assertRuntimeAdapterConformance,
  cursorRuntimeAdapter,
} from '../../src/runtimes/index.js';
import {
  OBSERVED_AT,
  createAcceptedRenderDecision,
  createCanonicalState,
  createRejectedRenderDecision,
  createRuntimeInput,
} from './helpers.js';

import type {
  CursorRuntimeEvent,
  RuntimeAdapterInput,
  RuntimeCanonicalState,
  RuntimeConformanceCase,
} from '../../src/runtimes/index.js';

const TESTED_RUNTIME_VERSION = '2026.8.4';
const TESTED_PROTOCOL_VERSION = '1.0.0';

describe('Cursor runtime adapter', () => {
  it('declares an independent pinned ACP full-projection path', () => {
    expect(CursorCapabilityRecords).toEqual([
      expect.objectContaining({
        runtime: 'cursor',
        pathId: CursorRuntimePaths.ACP,
        protocol: 'cursor-agent-client-protocol',
        presentationTier: 'full-projection',
        testedVersions: {
          runtime: TESTED_RUNTIME_VERSION,
          protocol: TESTED_PROTOCOL_VERSION,
        },
      }),
    ]);
    expect(CursorCapabilityRecords[0]?.evidence.observedAt).toBe(OBSERVED_AT);
    expect(CursorCapabilityRecords[0]).not.toEqual(DevinCapabilityRecords[0]);
  });

  it('passes shared conformance and retains Cursor extension provenance', () => {
    const cases: readonly RuntimeConformanceCase<CursorRuntimeEvent>[] = [
      {
        input: createCursorInput(finalMessage()),
        expectedKind: 'assistant-message',
        expectedPhase: 'final',
        expectedTerminalStatus: 'completed',
        expectedReasonCode: 'none',
      },
      {
        input: createCursorInput({
          type: 'extension',
          eventId: 'cursor-extension',
          index: 2,
          final: true,
          sourceTimestamp: OBSERVED_AT,
          namespace: 'cursor.acp.ask-question',
          value: { requestState: 'answered' },
        }),
        expectedKind: 'extension',
        expectedPhase: 'final',
        expectedTerminalStatus: 'completed',
        expectedReasonCode: 'none',
        expectedExtensionNamespace: 'cursor.acp.ask-question',
      },
      {
        input: createCursorInput(terminalEvent('cancelled')),
        expectedKind: 'cancellation',
        expectedPhase: 'cancelled',
        expectedTerminalStatus: 'cancelled',
        expectedReasonCode: 'cancelled',
      },
    ];

    expect(assertRuntimeAdapterConformance({
      adapter: cursorRuntimeAdapter,
      cases,
    })).toMatchObject({
      runtime: 'cursor',
      casesChecked: 3,
      emittedEvents: 3,
      extensionEvents: 1,
      cancellationEvents: 1,
      canonicalWrites: 0,
    });
  });

  it('maps ACP tool lifecycle without promoting content into extensions', () => {
    const result = cursorRuntimeAdapter.adapt(createCursorInput({
      type: 'tool-result',
      eventId: 'cursor-tool-result',
      index: 1,
      sourceTimestamp: OBSERVED_AT,
      toolCallId: 'cursor-tool',
    }));

    expect(result.event).toMatchObject({
      kind: 'tool-result',
      phase: 'final',
      toolCallId: 'cursor-tool',
      extensions: {},
    });
  });

  it('accepts a validated ACP client projection', async () => {
    const result = cursorRuntimeAdapter.present({
      pathId: CursorRuntimePaths.ACP,
      runtimeVersion: TESTED_RUNTIME_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision: await createAcceptedRenderDecision('Cursor projection accepted.'),
    });

    expect(result).toMatchObject({
      status: 'projection',
      presentationTier: 'full-projection',
      mode: 'atomic-replace',
      originalSuppressed: true,
    });
  });

  it('rejects a projection when fidelity retains the original', async () => {
    const result = cursorRuntimeAdapter.present({
      pathId: CursorRuntimePaths.ACP,
      runtimeVersion: TESTED_RUNTIME_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision: await createRejectedRenderDecision('Cursor projection rejected.'),
    });

    expect(result).toMatchObject({
      status: 'exact-original',
      reasonCode: 'projection-rejected',
      projectionText: null,
      originalSuppressed: false,
    });
  });

  it('fails closed on an incompatible Cursor runtime major', () => {
    const input = createCursorInput(finalMessage(), { runtimeVersion: '2027.0.0' });
    const result = cursorRuntimeAdapter.adapt(input);

    expect(result).toMatchObject({
      status: 'exact-original',
      reasonCode: 'incompatible-runtime-major',
      event: null,
    });
    expect(result.exactOriginal).toBe(input.canonical.exactOriginal);
  });

  it.each([
    ['cancelled', 'cancelled'],
    ['disconnect', 'disconnected'],
    ['timeout', 'timeout'],
    ['error', 'runtime-failure'],
  ] as const)('preserves exact Cursor bytes on %s', (type, reasonCode) => {
    const source = `Cursor exact bytes for ${type}.`;
    const canonical = createCanonicalState(source);
    const result = cursorRuntimeAdapter.adapt(createCursorInput(terminalEvent(type), { canonical }));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode });
    if (result.status !== 'exact-original') {
      throw new Error('Expected a terminal exact-original result.');
    }
    expect(Buffer.from(decodeExactOriginal(result.exactOriginal)).toString('utf8')).toBe(source);
  });

  it('keeps Cursor telemetry content-free', async () => {
    const canary = 'CURSOR_RUNTIME_CANARY_c117';
    const renderDecision = await createAcceptedRenderDecision(canary);
    const result = cursorRuntimeAdapter.present({
      pathId: CursorRuntimePaths.ACP,
      runtimeVersion: TESTED_RUNTIME_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision,
    });
    const serialized = JSON.stringify(result.telemetry);

    expect(serialized).not.toContain(canary);
    expect(serialized).not.toContain(renderDecision.exactOriginal.bytesBase64);
    expect(serialized).not.toContain('credential');
    expect(result.telemetry).toMatchObject({ runtime: 'cursor', status: 'projection' });
  });
});

function createCursorInput(
  event: CursorRuntimeEvent,
  options: {
    readonly runtimeVersion?: string;
    readonly protocolVersion?: string;
    readonly canonical?: RuntimeCanonicalState;
  } = {},
): RuntimeAdapterInput<CursorRuntimeEvent> {
  return createRuntimeInput(event, {
    runtime: 'cursor',
    runtimeVersion: options.runtimeVersion ?? TESTED_RUNTIME_VERSION,
    protocol: 'cursor-agent-client-protocol',
    protocolVersion: options.protocolVersion ?? TESTED_PROTOCOL_VERSION,
    pathId: CursorRuntimePaths.ACP,
    ...(options.canonical === undefined ? {} : { canonical: options.canonical }),
  });
}

function finalMessage(): CursorRuntimeEvent {
  return {
    type: 'agent-message-chunk',
    eventId: 'cursor-agent-message',
    index: 1,
    final: true,
    sourceTimestamp: OBSERVED_AT,
  };
}

function terminalEvent(
  type: 'cancelled' | 'disconnect' | 'error' | 'timeout',
): CursorRuntimeEvent {
  return {
    type,
    eventId: `cursor-${type}`,
    index: 3,
    sourceTimestamp: OBSERVED_AT,
  };
}
