// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Adapter Edge-Case Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import { applyDisplayPresentation } from '../../src/clients/index.js';
import {
  ClaudeCapabilityRecords,
  ClaudeRuntimePaths,
  CursorRuntimePaths,
  OpenCodeRuntimePaths,
  PiRuntimePaths,
  createClaudeRuntimeAdapter,
  createRuntimeCapabilityMatrix,
  presentPiSynchronousTransform,
  resolveRuntimeCapability,
} from '../../src/runtimes/index.js';
import {
  OBSERVED_AT,
  createAcceptedRenderDecision,
  createCanonicalState,
} from './helpers.js';
import { RUNTIME_PATH_HARNESSES } from './replay-helpers.js';

import type { RuntimeCapabilityRecord } from '../../src/runtimes/index.js';

describe('runtime adapter edge cases', () => {
  it('reconnects without changing the result of a replayed event', () => {
    const harness = harnessFor(OpenCodeRuntimePaths.SERVER_SSE);
    const canonical = Object.freeze(createCanonicalState('Reconnect replay original.'));
    const before = JSON.stringify(canonical);
    const connected = harness.adaptEvent({
      type: 'server-connected',
      eventId: 'opencode-connected-before',
      index: 0,
      sourceTimestamp: OBSERVED_AT,
    }, { canonical });
    const replayedInput = {
      type: 'message-part',
      eventId: 'opencode-replayed-part',
      index: 1,
      final: false,
      sourceTimestamp: OBSERVED_AT,
      partId: 'opencode-replayed-part',
    } as const;
    const first = harness.adaptEvent(replayedInput, { canonical });
    const disconnected = harness.adaptTerminal('disconnect', { canonical });
    const reconnected = harness.adaptEvent({
      type: 'server-connected',
      eventId: 'opencode-connected-after',
      index: 2,
      sourceTimestamp: OBSERVED_AT,
    }, { canonical });
    const replay = harness.adaptEvent(replayedInput, { canonical });

    expect(connected.event).toMatchObject({ kind: 'extension', phase: 'created' });
    expect(disconnected).toMatchObject({
      status: 'exact-original',
      reasonCode: 'disconnected',
    });
    expect(reconnected.event).toMatchObject({ kind: 'extension', phase: 'created' });
    expect(replay).toEqual(first);
    expect(JSON.stringify(canonical)).toBe(before);
  });

  it('fails closed on an unsupported protocol major or missing capability', async () => {
    const harness = RUNTIME_PATH_HARNESSES.find(
      (candidate) => candidate.record.presentationTier === 'full-projection',
    );
    if (harness === undefined) {
      throw new Error('Expected a full-projection harness.');
    }
    const decision = await createAcceptedRenderDecision('Compatibility edge projection.');
    const incompatible = harness.present(decision, {
      protocolVersion: nextMajor(harness.record.testedVersions.protocol),
    });
    const missing = createClaudeRuntimeAdapter([]).present({
      pathId: ClaudeRuntimePaths.HEADLESS,
      runtimeVersion: ClaudeCapabilityRecords[0]?.testedVersions.runtime ?? '0.0.0',
      protocolVersion: ClaudeCapabilityRecords[0]?.testedVersions.protocol ?? '0.0.0',
      renderDecision: decision,
    });

    expect(incompatible).toMatchObject({
      status: 'exact-original',
      reasonCode: 'incompatible-protocol-major',
      originalSuppressed: false,
    });
    expect(missing).toMatchObject({
      status: 'exact-original',
      presentationTier: 'safe-native',
      reasonCode: 'unsupported-path',
      originalSuppressed: false,
    });
  });

  it('preserves the exact original after a partial stream disconnects', () => {
    const harness = harnessFor(ClaudeRuntimePaths.HEADLESS);
    const canonical = Object.freeze(createCanonicalState('Partial stream exact original.'));
    const before = JSON.stringify(canonical);
    const partial = harness.adaptStreaming({ canonical });
    const disconnected = harness.adaptTerminal('disconnect', { canonical });

    expect(partial).toMatchObject({
      status: 'mapped',
      event: expect.objectContaining({
        kind: 'assistant-message-delta',
        phase: 'streaming',
        terminalStatus: 'none',
      }),
    });
    expect(disconnected).toMatchObject({
      status: 'exact-original',
      reasonCode: 'disconnected',
      event: expect.objectContaining({ terminalStatus: 'failed' }),
    });
    expect(disconnected.exactOriginal).toBe(canonical.exactOriginal);
    expect(JSON.stringify(canonical)).toBe(before);
  });

  it('retains an extension unknown to the shared extractor under its namespace', () => {
    const harness = harnessFor(CursorRuntimePaths.ACP);
    const result = harness.adaptExtension();

    expect(result).toMatchObject({
      status: 'mapped',
      event: expect.objectContaining({ kind: 'extension', payload: {} }),
    });
    expect(result.event?.extensions).toEqual({
      [harness.extensionNamespace]: { opaqueState: 'retained' },
    });
  });

  it('keeps earlier Claude interactive chunks visible during batch delivery', async () => {
    const harness = harnessFor(ClaudeRuntimePaths.INTERACTIVE);
    const earlierChunks = ['Earlier chunk one.', 'Earlier chunk two.'];
    const nativeOriginal = 'Native interactive message.';
    const appended: string[] = [];
    const first = harness.adaptEvent({
      type: 'message-display',
      eventId: 'claude-interactive-part-1',
      index: 0,
      final: false,
      sourceTimestamp: OBSERVED_AT,
    });
    const second = harness.adaptEvent({
      type: 'message-display',
      eventId: 'claude-interactive-part-2',
      index: 1,
      final: false,
      sourceTimestamp: OBSERVED_AT,
    });
    const final = harness.adaptEvent({
      type: 'message-display',
      eventId: 'claude-interactive-final',
      index: 2,
      final: true,
      sourceTimestamp: OBSERVED_AT,
    });
    const outcome = harness.present(
      await createAcceptedRenderDecision('Claude interactive batch projection.'),
      { preferredDegradationModes: ['append'] },
    );
    const application = applyDisplayPresentation({
      messageId: 'claude-interactive-message',
      outcome,
      ownership: {
        ownsCompleteMessage: true,
        ownsAtomicRenderDecision: false,
      },
      surface: {
        commitAtomicReplacement: vi.fn(() => true),
        appendAfterOriginal: vi.fn((replacement) => {
          appended.push(replacement.projectionText);
          return true;
        }),
      },
    });

    expect([first.event?.phase, second.event?.phase, final.event?.phase])
      .toEqual(['streaming', 'streaming', 'final']);
    expect(earlierChunks).toEqual(['Earlier chunk one.', 'Earlier chunk two.']);
    expect(nativeOriginal).toBe('Native interactive message.');
    expect(appended).toEqual(['Claude interactive batch projection.']);
    expect(application).toMatchObject({
      status: 'degraded',
      mode: 'append',
      originalVisible: true,
    });
  });

  it('keeps Pi synchronous output original-only until async projection exists', async () => {
    const decision = await createAcceptedRenderDecision('Pi async projection not ready.');
    const result = presentPiSynchronousTransform({
      pathId: PiRuntimePaths.DISPLAY_TRANSFORMER,
      runtimeVersion: '0.84.1',
      protocolVersion: '1.0.0',
      renderDecision: decision,
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

  it('recomputes an unjustified declared tier to safe-native original-only', () => {
    const base = ClaudeCapabilityRecords[0];
    if (base === undefined) {
      throw new Error('Expected a pinned Claude capability.');
    }
    const unjustified: RuntimeCapabilityRecord = {
      ...base,
      presentationTier: 'full-projection',
      allowedDegradationModes: ['append', 'sidecar', 'original-only'],
      evidence: {
        ...base.evidence,
        atomicRenderDecision: { state: 'unknown', confidence: 'unknown' },
        safePresentationBoundary: { state: 'unknown', confidence: 'unknown' },
        append: { state: 'yes', confidence: 'confirmed' },
        sidecar: { state: 'yes', confidence: 'confirmed' },
      },
    };
    const entry = createRuntimeCapabilityMatrix([unjustified])[0];
    if (entry === undefined) {
      throw new Error('Expected a normalized capability entry.');
    }
    const resolution = resolveRuntimeCapability(
      entry,
      entry.testedVersions.runtime,
      entry.testedVersions.protocol,
    );

    expect(entry).toMatchObject({
      presentationTier: 'safe-native',
      degradationPolicy: 'original-only',
      allowedDegradationModes: ['original-only'],
    });
    expect(resolution).toMatchObject({
      compatible: true,
      presentationTier: 'safe-native',
      degradationPolicy: 'original-only',
      reasonCode: 'none',
    });
  });
});

function harnessFor(pathId: string) {
  const harness = RUNTIME_PATH_HARNESSES.find(
    (candidate) => candidate.record.pathId === pathId,
  );
  if (harness === undefined) {
    throw new Error(`Expected runtime harness for '${pathId}'.`);
  }
  return harness;
}

function nextMajor(version: string): string {
  const major = Number(version.split('.')[0]);
  if (!Number.isSafeInteger(major)) {
    throw new Error(`Expected a semantic version, received '${version}'.`);
  }
  return `${major + 1}.0.0`;
}
