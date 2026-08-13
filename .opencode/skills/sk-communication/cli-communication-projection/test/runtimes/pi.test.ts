// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Runtime Adapter Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { decodeExactOriginal } from '../../src/index.js';
import {
  PiCapabilityRecords,
  PiRuntimePaths,
  assertRuntimeAdapterConformance,
  piRuntimeAdapter,
  presentPiSynchronousTransform,
} from '../../src/runtimes/index.js';
import {
  OBSERVED_AT,
  createAcceptedRenderDecision,
  createCanonicalState,
  createRejectedRenderDecision,
  createRuntimeInput,
} from './helpers.js';

import type {
  PiRuntimeEvent,
  RuntimeAdapterInput,
  RuntimeCanonicalState,
  RuntimeConformanceCase,
} from '../../src/runtimes/index.js';

const TESTED_RUNTIME_VERSION = '0.84.1';
const TESTED_JSON_RPC_VERSION = '2.0.0';
const TESTED_TRANSFORMER_VERSION = '1.0.0';

describe('Pi runtime adapter', () => {
  it('declares async full-projection and sync safe-native paths', () => {
    expect(PiCapabilityRecords).toHaveLength(2);
    expect(PiCapabilityRecords).toEqual(expect.arrayContaining([
      expect.objectContaining({
        pathId: PiRuntimePaths.JSON_RPC,
        protocol: 'pi-json-rpc',
        presentationTier: 'full-projection',
        testedVersions: {
          runtime: TESTED_RUNTIME_VERSION,
          protocol: TESTED_JSON_RPC_VERSION,
        },
      }),
      expect.objectContaining({
        pathId: PiRuntimePaths.DISPLAY_TRANSFORMER,
        protocol: 'pi-display-transformer',
        presentationTier: 'safe-native',
        allowedDegradationModes: ['append', 'sidecar', 'original-only'],
        testedVersions: {
          runtime: TESTED_RUNTIME_VERSION,
          protocol: TESTED_TRANSFORMER_VERSION,
        },
      }),
    ]));
    expect(PiCapabilityRecords.every((record) => record.evidence.observedAt === OBSERVED_AT))
      .toBe(true);
  });

  it('passes shared conformance across async and sync capture paths', () => {
    const cases: readonly RuntimeConformanceCase<PiRuntimeEvent>[] = [
      {
        input: createPiInput(finalMessage()),
        expectedKind: 'assistant-message',
        expectedPhase: 'final',
        expectedTerminalStatus: 'completed',
        expectedReasonCode: 'none',
      },
      {
        input: createPiInput({
          type: 'extension',
          eventId: 'pi-extension',
          index: 2,
          final: true,
          sourceTimestamp: OBSERVED_AT,
          namespace: 'pi.display-transformer',
          value: { renderer: 'synchronous' },
        }, { pathId: PiRuntimePaths.DISPLAY_TRANSFORMER }),
        expectedKind: 'extension',
        expectedPhase: 'final',
        expectedTerminalStatus: 'completed',
        expectedReasonCode: 'none',
        expectedExtensionNamespace: 'pi.display-transformer',
      },
      {
        input: createPiInput(terminalEvent('cancelled')),
        expectedKind: 'cancellation',
        expectedPhase: 'cancelled',
        expectedTerminalStatus: 'cancelled',
        expectedReasonCode: 'cancelled',
      },
    ];

    expect(assertRuntimeAdapterConformance({
      adapter: piRuntimeAdapter,
      cases,
    })).toMatchObject({
      runtime: 'pi',
      casesChecked: 3,
      emittedEvents: 3,
      extensionEvents: 1,
      cancellationEvents: 1,
      canonicalWrites: 0,
    });
  });

  it('accepts an async JSON-RPC projection through client ownership', async () => {
    const result = piRuntimeAdapter.present({
      pathId: PiRuntimePaths.JSON_RPC,
      runtimeVersion: TESTED_RUNTIME_VERSION,
      protocolVersion: TESTED_JSON_RPC_VERSION,
      renderDecision: await createAcceptedRenderDecision('Pi async projection accepted.'),
    });

    expect(result).toMatchObject({
      status: 'projection',
      presentationTier: 'full-projection',
      mode: 'atomic-replace',
      originalSuppressed: true,
    });
  });

  it('rejects an async projection when fidelity retains the original', async () => {
    const result = piRuntimeAdapter.present({
      pathId: PiRuntimePaths.JSON_RPC,
      runtimeVersion: TESTED_RUNTIME_VERSION,
      protocolVersion: TESTED_JSON_RPC_VERSION,
      renderDecision: await createRejectedRenderDecision('Pi async projection rejected.'),
    });

    expect(result).toMatchObject({
      status: 'exact-original',
      reasonCode: 'projection-rejected',
      projectionText: null,
      originalSuppressed: false,
    });
  });

  it.each([
    ['append', ['append']],
    ['sidecar', ['sidecar']],
  ] as const)('uses sync safe-native %s without replacing the canonical message', async (
    mode,
    preferredDegradationModes,
  ) => {
    const result = presentPiSynchronousTransform({
      pathId: PiRuntimePaths.DISPLAY_TRANSFORMER,
      runtimeVersion: TESTED_RUNTIME_VERSION,
      protocolVersion: TESTED_TRANSFORMER_VERSION,
      renderDecision: await createAcceptedRenderDecision(`Pi safe-native ${mode}.`),
      preferredDegradationModes,
      asyncProjectionAvailable: true,
    });

    expect(result).toMatchObject({
      status: 'degraded',
      presentationTier: 'safe-native',
      mode,
      reasonCode: 'atomic-replace-unavailable',
      originalSuppressed: false,
    });
  });

  it('returns sync original-only before an asynchronous projection exists', async () => {
    const result = presentPiSynchronousTransform({
      pathId: PiRuntimePaths.DISPLAY_TRANSFORMER,
      runtimeVersion: TESTED_RUNTIME_VERSION,
      protocolVersion: TESTED_TRANSFORMER_VERSION,
      renderDecision: await createAcceptedRenderDecision('Projection is not ready yet.'),
      preferredDegradationModes: ['append'],
      asyncProjectionAvailable: false,
    });

    expect(result).toMatchObject({
      status: 'exact-original',
      presentationTier: 'safe-native',
      mode: 'original-only',
      reasonCode: 'original-selected',
      projectionText: null,
      originalSuppressed: false,
    });
  });

  it('fails closed on an incompatible Pi runtime major', () => {
    const input = createPiInput(finalMessage(), { runtimeVersion: '1.0.0' });
    const result = piRuntimeAdapter.adapt(input);

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
  ] as const)('preserves exact Pi bytes on %s', (type, reasonCode) => {
    const source = `Pi exact bytes for ${type}.`;
    const canonical = createCanonicalState(source);
    const result = piRuntimeAdapter.adapt(createPiInput(terminalEvent(type), { canonical }));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode });
    if (result.status !== 'exact-original') {
      throw new Error('Expected a terminal exact-original result.');
    }
    expect(Buffer.from(decodeExactOriginal(result.exactOriginal)).toString('utf8')).toBe(source);
  });

  it('keeps Pi telemetry content-free on the synchronous path', async () => {
    const canary = 'PI_RUNTIME_CANARY_11bc';
    const renderDecision = await createAcceptedRenderDecision(canary);
    const result = presentPiSynchronousTransform({
      pathId: PiRuntimePaths.DISPLAY_TRANSFORMER,
      runtimeVersion: TESTED_RUNTIME_VERSION,
      protocolVersion: TESTED_TRANSFORMER_VERSION,
      renderDecision,
      preferredDegradationModes: ['sidecar'],
      asyncProjectionAvailable: true,
    });
    const serialized = JSON.stringify(result.telemetry);

    expect(serialized).not.toContain(canary);
    expect(serialized).not.toContain(renderDecision.exactOriginal.bytesBase64);
    expect(serialized).not.toContain('credential');
    expect(result.telemetry).toMatchObject({
      runtime: 'pi',
      pathId: PiRuntimePaths.DISPLAY_TRANSFORMER,
      presentationTier: 'safe-native',
      status: 'degraded',
    });
  });
});

function createPiInput(
  event: PiRuntimeEvent,
  options: {
    readonly pathId?: string;
    readonly runtimeVersion?: string;
    readonly protocolVersion?: string;
    readonly canonical?: RuntimeCanonicalState;
  } = {},
): RuntimeAdapterInput<PiRuntimeEvent> {
  const pathId = options.pathId ?? PiRuntimePaths.JSON_RPC;
  const isTransformer = pathId === PiRuntimePaths.DISPLAY_TRANSFORMER;
  return createRuntimeInput(event, {
    runtime: 'pi',
    runtimeVersion: options.runtimeVersion ?? TESTED_RUNTIME_VERSION,
    protocol: isTransformer ? 'pi-display-transformer' : 'pi-json-rpc',
    protocolVersion: options.protocolVersion
      ?? (isTransformer ? TESTED_TRANSFORMER_VERSION : TESTED_JSON_RPC_VERSION),
    pathId,
    ...(options.canonical === undefined ? {} : { canonical: options.canonical }),
  });
}

function finalMessage(): PiRuntimeEvent {
  return {
    type: 'message-end',
    eventId: 'pi-message-end',
    index: 1,
    sourceTimestamp: OBSERVED_AT,
  };
}

function terminalEvent(
  type: 'cancelled' | 'disconnect' | 'error' | 'timeout',
): PiRuntimeEvent {
  return {
    type,
    eventId: `pi-${type}`,
    index: 3,
    sourceTimestamp: OBSERVED_AT,
  };
}
