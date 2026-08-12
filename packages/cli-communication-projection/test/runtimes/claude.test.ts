// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Runtime Adapter Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { decodeExactOriginal } from '../../src/index.js';
import {
  ClaudeCapabilityRecords,
  ClaudeRuntimePaths,
  claudeRuntimeAdapter,
} from '../../src/runtimes/index.js';
import {
  TESTED_CLAUDE_VERSION,
  TESTED_PROTOCOL_VERSION,
  createAcceptedRenderDecision,
  createCanonicalState,
  createClaudeInput,
  createRejectedRenderDecision,
  finalMessage,
} from './helpers.js';

import type { ClaudeRuntimeEvent } from '../../src/runtimes/index.js';

describe('Claude runtime adapter', () => {
  it('declares pinned headless full-projection and interactive safe-native paths', () => {
    expect(ClaudeCapabilityRecords).toHaveLength(2);
    expect(ClaudeCapabilityRecords).toEqual(expect.arrayContaining([
      expect.objectContaining({
        pathId: ClaudeRuntimePaths.HEADLESS,
        presentationTier: 'full-projection',
        testedVersions: {
          runtime: TESTED_CLAUDE_VERSION,
          protocol: TESTED_PROTOCOL_VERSION,
        },
      }),
      expect.objectContaining({
        pathId: ClaudeRuntimePaths.INTERACTIVE,
        presentationTier: 'safe-native',
        allowedDegradationModes: ['append', 'sidecar', 'original-only'],
      }),
    ]));
    expect(ClaudeCapabilityRecords.every((record) =>
      record.evidence.observedAt === '2026-08-12T00:00:00.000Z')).toBe(true);
  });

  it('accepts a validated headless projection through atomic complete-message ownership', async () => {
    const renderDecision = await createAcceptedRenderDecision('Headless projection accepted.');
    const result = claudeRuntimeAdapter.present({
      pathId: ClaudeRuntimePaths.HEADLESS,
      runtimeVersion: TESTED_CLAUDE_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision,
    });

    expect(result).toMatchObject({
      status: 'projection',
      presentationTier: 'full-projection',
      mode: 'atomic-replace',
      reasonCode: 'none',
      originalSuppressed: true,
    });
  });

  it('rejects a headless projection when the render decision retains the original', async () => {
    const renderDecision = await createRejectedRenderDecision();
    const result = claudeRuntimeAdapter.present({
      pathId: ClaudeRuntimePaths.HEADLESS,
      runtimeVersion: TESTED_CLAUDE_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision,
    });

    expect(result).toMatchObject({
      status: 'exact-original',
      presentationTier: 'full-projection',
      mode: 'original-only',
      reasonCode: 'projection-rejected',
      projectionText: null,
      originalSuppressed: false,
    });
  });

  it.each([
    ['append', ['append']],
    ['sidecar', ['sidecar']],
  ] as const)('uses safe-native %s without suppressing the original', async (mode, preferred) => {
    const renderDecision = await createAcceptedRenderDecision(`Safe native ${mode}.`);
    const result = claudeRuntimeAdapter.present({
      pathId: ClaudeRuntimePaths.INTERACTIVE,
      runtimeVersion: TESTED_CLAUDE_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision,
      preferredDegradationModes: preferred,
    });

    expect(result).toMatchObject({
      status: 'degraded',
      presentationTier: 'safe-native',
      mode,
      reasonCode: 'atomic-replace-unavailable',
      originalSuppressed: false,
    });
  });

  it('selects safe-native original-only explicitly', async () => {
    const renderDecision = await createAcceptedRenderDecision('Keep this original available.');
    const result = claudeRuntimeAdapter.present({
      pathId: ClaudeRuntimePaths.INTERACTIVE,
      runtimeVersion: TESTED_CLAUDE_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision,
      preferredDegradationModes: ['original-only'],
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

  it('fails closed before mapping an incompatible runtime major', () => {
    const input = createClaudeInput(finalMessage(), { runtimeVersion: '3.0.0' });
    const result = claudeRuntimeAdapter.adapt(input);

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
  ] as const)('maps Claude %s to a typed exact-original outcome', (type, reasonCode) => {
    const source = `Exact bytes for ${type}.`;
    const canonical = createCanonicalState(source);
    const event: ClaudeRuntimeEvent = {
      type,
      eventId: `claude-${type}`,
      index: 2,
      sourceTimestamp: '2026-08-12T00:00:00.000Z',
    };
    const result = claudeRuntimeAdapter.adapt(createClaudeInput(event, { canonical }));

    expect(result).toMatchObject({
      status: 'exact-original',
      reasonCode,
      event: expect.objectContaining({ terminalStatus: type === 'cancelled' ? 'cancelled' : 'failed' }),
    });
    if (result.status !== 'exact-original') {
      throw new Error('Expected a terminal exact-original result.');
    }
    expect(Buffer.from(decodeExactOriginal(result.exactOriginal)).toString('utf8')).toBe(source);
  });

  it('keeps runtime telemetry free of transcript, projection, and credential canaries', async () => {
    const canary = 'RAW_RUNTIME_CANARY_2a71';
    const renderDecision = await createAcceptedRenderDecision(canary);
    const result = claudeRuntimeAdapter.present({
      pathId: ClaudeRuntimePaths.INTERACTIVE,
      runtimeVersion: TESTED_CLAUDE_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision,
      preferredDegradationModes: ['append'],
    });
    const serialized = JSON.stringify(result.telemetry);

    expect(serialized).not.toContain(canary);
    expect(serialized).not.toContain(renderDecision.exactOriginal.bytesBase64);
    expect(serialized).not.toContain('credential');
    expect(result.telemetry).toEqual({
      telemetryVersion: 'runtime-telemetry/1.0.0',
      eventName: 'runtime-adapter-terminal',
      runtime: 'claude',
      pathId: ClaudeRuntimePaths.INTERACTIVE,
      presentationTier: 'safe-native',
      status: 'degraded',
      reasonCode: 'atomic-replace-unavailable',
    });
  });
});
