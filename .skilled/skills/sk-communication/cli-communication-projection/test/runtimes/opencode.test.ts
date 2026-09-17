// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Runtime Adapter Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { decodeExactOriginal } from '../../src/index.js';
import {
  OpenCodeCapabilityRecords,
  OpenCodeRuntimePaths,
  assertRuntimeAdapterConformance,
  openCodeRuntimeAdapter,
} from '../../src/runtimes/index.js';
import {
  OBSERVED_AT,
  createAcceptedRenderDecision,
  createCanonicalState,
  createRejectedRenderDecision,
  createRuntimeInput,
} from './helpers.js';

import type {
  OpenCodeRuntimeEvent,
  RuntimeAdapterInput,
  RuntimeCanonicalState,
  RuntimeConformanceCase,
} from '../../src/runtimes/index.js';

const TESTED_RUNTIME_VERSION = '1.18.11';
const TESTED_PROTOCOL_VERSION = '3.1.0';

describe('OpenCode runtime adapter', () => {
  it('declares a pinned stable server, SSE, and generated-client path', () => {
    expect(OpenCodeCapabilityRecords).toEqual([
      expect.objectContaining({
        runtime: 'opencode',
        pathId: OpenCodeRuntimePaths.SERVER_SSE,
        protocol: 'opencode-server-sse-stable-client',
        presentationTier: 'full-projection',
        testedVersions: {
          runtime: TESTED_RUNTIME_VERSION,
          protocol: TESTED_PROTOCOL_VERSION,
        },
      }),
    ]);
    expect(OpenCodeCapabilityRecords[0]?.evidence).toMatchObject({
      observedAt: OBSERVED_AT,
      source: 'opencode-server-openapi-sse-generated-client-observation',
    });
  });

  it('keeps provider selection outside runtime capture records', () => {
    const serialized = JSON.stringify(OpenCodeCapabilityRecords);

    expect(serialized).not.toContain('providerId');
    expect(serialized).not.toContain('modelId');
    expect(serialized).not.toContain('private-beta');
  });

  it('passes shared conformance for SSE content, extensions, and cancellation', () => {
    const cases: readonly RuntimeConformanceCase<OpenCodeRuntimeEvent>[] = [
      {
        input: createOpenCodeInput(finalMessage()),
        expectedKind: 'assistant-message',
        expectedPhase: 'final',
        expectedTerminalStatus: 'completed',
        expectedReasonCode: 'none',
      },
      {
        input: createOpenCodeInput({
          type: 'extension',
          eventId: 'opencode-extension',
          index: 2,
          final: true,
          sourceTimestamp: OBSERVED_AT,
          namespace: 'opencode.server-sse',
          value: { busState: 'idle' },
        }),
        expectedKind: 'extension',
        expectedPhase: 'final',
        expectedTerminalStatus: 'completed',
        expectedReasonCode: 'none',
        expectedExtensionNamespace: 'opencode.server-sse',
      },
      {
        input: createOpenCodeInput(terminalEvent('cancelled')),
        expectedKind: 'cancellation',
        expectedPhase: 'cancelled',
        expectedTerminalStatus: 'cancelled',
        expectedReasonCode: 'cancelled',
      },
    ];

    expect(assertRuntimeAdapterConformance({
      adapter: openCodeRuntimeAdapter,
      cases,
    })).toMatchObject({
      runtime: 'opencode',
      casesChecked: 3,
      emittedEvents: 3,
      extensionEvents: 1,
      cancellationEvents: 1,
      canonicalWrites: 0,
    });
  });

  it('accepts a validated stable-client projection', async () => {
    const result = openCodeRuntimeAdapter.present({
      pathId: OpenCodeRuntimePaths.SERVER_SSE,
      runtimeVersion: TESTED_RUNTIME_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision: await createAcceptedRenderDecision('OpenCode projection accepted.'),
    });

    expect(result).toMatchObject({
      status: 'projection',
      presentationTier: 'full-projection',
      mode: 'atomic-replace',
      originalSuppressed: true,
    });
  });

  it('rejects a projection when fidelity retains the original', async () => {
    const result = openCodeRuntimeAdapter.present({
      pathId: OpenCodeRuntimePaths.SERVER_SSE,
      runtimeVersion: TESTED_RUNTIME_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision: await createRejectedRenderDecision('OpenCode projection rejected.'),
    });

    expect(result).toMatchObject({
      status: 'exact-original',
      reasonCode: 'projection-rejected',
      projectionText: null,
      originalSuppressed: false,
    });
  });

  it('fails closed on an incompatible OpenCode runtime major', () => {
    const input = createOpenCodeInput(finalMessage(), { runtimeVersion: '2.0.0' });
    const result = openCodeRuntimeAdapter.adapt(input);

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
  ] as const)('preserves exact OpenCode bytes on %s', (type, reasonCode) => {
    const source = `OpenCode exact bytes for ${type}.`;
    const canonical = createCanonicalState(source);
    const result = openCodeRuntimeAdapter.adapt(createOpenCodeInput(
      terminalEvent(type),
      { canonical },
    ));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode });
    if (result.status !== 'exact-original') {
      throw new Error('Expected a terminal exact-original result.');
    }
    expect(Buffer.from(decodeExactOriginal(result.exactOriginal)).toString('utf8')).toBe(source);
  });

  it('keeps OpenCode telemetry content-free', async () => {
    const canary = 'OPENCODE_RUNTIME_CANARY_f34c';
    const renderDecision = await createAcceptedRenderDecision(canary);
    const result = openCodeRuntimeAdapter.present({
      pathId: OpenCodeRuntimePaths.SERVER_SSE,
      runtimeVersion: TESTED_RUNTIME_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision,
    });
    const serialized = JSON.stringify(result.telemetry);

    expect(serialized).not.toContain(canary);
    expect(serialized).not.toContain(renderDecision.exactOriginal.bytesBase64);
    expect(serialized).not.toContain('credential');
    expect(result.telemetry).toMatchObject({
      runtime: 'opencode',
      pathId: OpenCodeRuntimePaths.SERVER_SSE,
      status: 'projection',
    });
  });
});

function createOpenCodeInput(
  event: OpenCodeRuntimeEvent,
  options: {
    readonly runtimeVersion?: string;
    readonly protocolVersion?: string;
    readonly canonical?: RuntimeCanonicalState;
  } = {},
): RuntimeAdapterInput<OpenCodeRuntimeEvent> {
  return createRuntimeInput(event, {
    runtime: 'opencode',
    runtimeVersion: options.runtimeVersion ?? TESTED_RUNTIME_VERSION,
    protocol: 'opencode-server-sse-stable-client',
    protocolVersion: options.protocolVersion ?? TESTED_PROTOCOL_VERSION,
    pathId: OpenCodeRuntimePaths.SERVER_SSE,
    ...(options.canonical === undefined ? {} : { canonical: options.canonical }),
  });
}

function finalMessage(): OpenCodeRuntimeEvent {
  return {
    type: 'message-part',
    eventId: 'opencode-message-part',
    index: 1,
    final: true,
    sourceTimestamp: OBSERVED_AT,
    partId: 'opencode-part',
  };
}

function terminalEvent(
  type: 'cancelled' | 'disconnect' | 'error' | 'timeout',
): OpenCodeRuntimeEvent {
  return {
    type,
    eventId: `opencode-${type}`,
    index: 3,
    sourceTimestamp: OBSERVED_AT,
  };
}
