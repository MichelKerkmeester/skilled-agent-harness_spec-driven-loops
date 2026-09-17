// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Runtime Adapter Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { decodeExactOriginal } from '../../src/index.js';
import {
  CodexCapabilityRecords,
  CodexRuntimePaths,
  assertRuntimeAdapterConformance,
  codexRuntimeAdapter,
} from '../../src/runtimes/index.js';
import {
  OBSERVED_AT,
  createAcceptedRenderDecision,
  createCanonicalState,
  createRejectedRenderDecision,
  createRuntimeInput,
} from './helpers.js';

import type {
  CodexRuntimeEvent,
  RuntimeAdapterInput,
  RuntimeCanonicalState,
  RuntimeConformanceCase,
} from '../../src/runtimes/index.js';

const TESTED_RUNTIME_VERSION = '0.147.0';
const TESTED_PROTOCOL_VERSION = '1.0.0';

describe('Codex runtime adapter', () => {
  it('declares a pinned client-owned App Server full-projection path', () => {
    expect(CodexCapabilityRecords).toEqual([
      expect.objectContaining({
        runtime: 'codex',
        pathId: CodexRuntimePaths.APP_SERVER,
        protocol: 'codex-app-server-json-rpc',
        presentationTier: 'full-projection',
        testedVersions: {
          runtime: TESTED_RUNTIME_VERSION,
          protocol: TESTED_PROTOCOL_VERSION,
        },
        allowedDegradationModes: ['original-only'],
      }),
    ]);
    expect(CodexCapabilityRecords[0]?.evidence).toMatchObject({
      observedAt: OBSERVED_AT,
      source: 'codex-app-server-client-observation',
    });
  });

  it('passes shared conformance for content, extensions, and cancellation', () => {
    const cases: readonly RuntimeConformanceCase<CodexRuntimeEvent>[] = [
      {
        input: createCodexInput(finalMessage()),
        expectedKind: 'assistant-message',
        expectedPhase: 'final',
        expectedTerminalStatus: 'completed',
        expectedReasonCode: 'none',
      },
      {
        input: createCodexInput({
          type: 'extension',
          eventId: 'codex-extension',
          index: 2,
          final: true,
          sourceTimestamp: OBSERVED_AT,
          namespace: 'codex.app-server',
          value: { turnState: 'completed' },
        }),
        expectedKind: 'extension',
        expectedPhase: 'final',
        expectedTerminalStatus: 'completed',
        expectedReasonCode: 'none',
        expectedExtensionNamespace: 'codex.app-server',
      },
      {
        input: createCodexInput(terminalEvent('cancelled')),
        expectedKind: 'cancellation',
        expectedPhase: 'cancelled',
        expectedTerminalStatus: 'cancelled',
        expectedReasonCode: 'cancelled',
      },
    ];

    expect(assertRuntimeAdapterConformance({
      adapter: codexRuntimeAdapter,
      cases,
    })).toMatchObject({
      runtime: 'codex',
      casesChecked: 3,
      emittedEvents: 3,
      extensionEvents: 1,
      cancellationEvents: 1,
      canonicalWrites: 0,
    });
  });

  it('accepts a validated projection through App Server client ownership', async () => {
    const result = codexRuntimeAdapter.present({
      pathId: CodexRuntimePaths.APP_SERVER,
      runtimeVersion: TESTED_RUNTIME_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision: await createAcceptedRenderDecision('Codex projection accepted.'),
    });

    expect(result).toMatchObject({
      status: 'projection',
      presentationTier: 'full-projection',
      mode: 'atomic-replace',
      reasonCode: 'none',
      originalSuppressed: true,
    });
  });

  it('rejects a projection when fidelity retains the original', async () => {
    const result = codexRuntimeAdapter.present({
      pathId: CodexRuntimePaths.APP_SERVER,
      runtimeVersion: TESTED_RUNTIME_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision: await createRejectedRenderDecision('Codex projection rejected.'),
    });

    expect(result).toMatchObject({
      status: 'exact-original',
      reasonCode: 'projection-rejected',
      projectionText: null,
      originalSuppressed: false,
    });
  });

  it('fails closed on an incompatible App Server protocol major', () => {
    const input = createCodexInput(finalMessage(), { protocolVersion: '2.0.0' });
    const result = codexRuntimeAdapter.adapt(input);

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
  ] as const)('preserves exact Codex bytes on %s', (type, reasonCode) => {
    const source = `Codex exact bytes for ${type}.`;
    const canonical = createCanonicalState(source);
    const result = codexRuntimeAdapter.adapt(createCodexInput(
      terminalEvent(type),
      { canonical },
    ));

    expect(result).toMatchObject({ status: 'exact-original', reasonCode });
    if (result.status !== 'exact-original') {
      throw new Error('Expected a terminal exact-original result.');
    }
    expect(Buffer.from(decodeExactOriginal(result.exactOriginal)).toString('utf8')).toBe(source);
  });

  it('keeps Codex telemetry content-free', async () => {
    const canary = 'CODEX_RUNTIME_CANARY_8c72';
    const renderDecision = await createAcceptedRenderDecision(canary);
    const result = codexRuntimeAdapter.present({
      pathId: CodexRuntimePaths.APP_SERVER,
      runtimeVersion: TESTED_RUNTIME_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision,
    });
    const serialized = JSON.stringify(result.telemetry);

    expect(serialized).not.toContain(canary);
    expect(serialized).not.toContain(renderDecision.exactOriginal.bytesBase64);
    expect(serialized).not.toContain('credential');
    expect(result.telemetry).toMatchObject({
      runtime: 'codex',
      pathId: CodexRuntimePaths.APP_SERVER,
      status: 'projection',
      reasonCode: 'none',
    });
  });
});

function createCodexInput(
  event: CodexRuntimeEvent,
  options: {
    readonly runtimeVersion?: string;
    readonly protocolVersion?: string;
    readonly canonical?: RuntimeCanonicalState;
  } = {},
): RuntimeAdapterInput<CodexRuntimeEvent> {
  return createRuntimeInput(event, {
    runtime: 'codex',
    runtimeVersion: options.runtimeVersion ?? TESTED_RUNTIME_VERSION,
    protocol: 'codex-app-server-json-rpc',
    protocolVersion: options.protocolVersion ?? TESTED_PROTOCOL_VERSION,
    pathId: CodexRuntimePaths.APP_SERVER,
    ...(options.canonical === undefined ? {} : { canonical: options.canonical }),
  });
}

function finalMessage(): CodexRuntimeEvent {
  return {
    type: 'agent-message',
    eventId: 'codex-agent-message',
    index: 1,
    sourceTimestamp: OBSERVED_AT,
    itemId: 'codex-item',
    toolCallId: null,
  };
}

function terminalEvent(
  type: 'cancelled' | 'disconnect' | 'error' | 'timeout',
): CodexRuntimeEvent {
  return {
    type,
    eventId: `codex-${type}`,
    index: 3,
    sourceTimestamp: OBSERVED_AT,
  };
}
