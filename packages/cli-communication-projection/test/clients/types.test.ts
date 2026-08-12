// ───────────────────────────────────────────────────────────────────
// MODULE: Client Presentation Contract Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import {
  applyDisplayPresentation,
  applySidecarPresentation,
  canClaimFullProjectionParity,
} from '../../src/clients/index.js';
import { createCanonicalState } from '../runtimes/helpers.js';

import type {
  RuntimeDegradedPresentation,
  RuntimeExactOriginalPresentation,
  RuntimeProjectionPresentation,
} from '../../src/runtimes/index.js';

describe('client presentation contract', () => {
  it.each([
    [true, true, true],
    [true, false, false],
    [false, true, false],
    [false, false, false],
  ])('requires complete-message=%s and atomic-decision=%s for parity', (
    ownsCompleteMessage,
    ownsAtomicRenderDecision,
    expected,
  ) => {
    expect(canClaimFullProjectionParity({
      ownsCompleteMessage,
      ownsAtomicRenderDecision,
    })).toBe(expected);
  });

  it('never writes through the exact-original boundary on any client path', () => {
    const writeSpy = vi.fn();
    const canonical = Object.freeze(createCanonicalState('Frozen canonical client state.'));
    const exactOriginal = new Proxy(canonical.exactOriginal, {
      set(_target, property, value) {
        writeSpy(property, value);
        return false;
      },
    });
    const projection: RuntimeProjectionPresentation = {
      status: 'projection',
      mode: 'atomic-replace',
      reasonCode: 'none',
      presentationTier: 'full-projection',
      exactOriginal,
      projectionText: 'Projection text.',
      originalSuppressed: true,
      telemetry: telemetry('projection'),
    };
    const append: RuntimeDegradedPresentation = {
      status: 'degraded',
      mode: 'append',
      reasonCode: 'atomic-replace-unavailable',
      presentationTier: 'safe-native',
      exactOriginal,
      projectionText: 'Append text.',
      originalSuppressed: false,
      telemetry: telemetry('degraded'),
    };
    const sidecar: RuntimeDegradedPresentation = {
      ...append,
      mode: 'sidecar',
      projectionText: 'Sidecar text.',
    };
    const originalOnly: RuntimeExactOriginalPresentation = {
      status: 'exact-original',
      mode: 'original-only',
      reasonCode: 'original-selected',
      presentationTier: 'safe-native',
      exactOriginal,
      projectionText: null,
      originalSuppressed: false,
      telemetry: telemetry('exact-original'),
    };
    const surface = {
      commitAtomicReplacement: vi.fn(() => true),
      appendAfterOriginal: vi.fn(() => true),
    };

    expect(() => applyDisplayPresentation({
      messageId: 'projection',
      outcome: projection,
      ownership: { ownsCompleteMessage: true, ownsAtomicRenderDecision: true },
      surface,
    })).not.toThrow();
    expect(() => applyDisplayPresentation({
      messageId: 'append',
      outcome: append,
      ownership: { ownsCompleteMessage: false, ownsAtomicRenderDecision: false },
      surface,
    })).not.toThrow();
    expect(() => applyDisplayPresentation({
      messageId: 'original',
      outcome: originalOnly,
      ownership: { ownsCompleteMessage: false, ownsAtomicRenderDecision: false },
      surface,
    })).not.toThrow();
    expect(() => applySidecarPresentation({
      messageId: 'sidecar',
      outcome: sidecar,
      surface: { presentProjection: vi.fn(() => true) },
    })).not.toThrow();
    expect(writeSpy).not.toHaveBeenCalled();
    expect(canonical.transcriptRevision).toBe('transcript-r1');
    expect(canonical.toolInputRevision).toBe('tool-input-r1');
    expect(canonical.toolResultRevision).toBe('tool-result-r1');
    expect(canonical.futureContextRevision).toBe('context-r1');
  });
});

function telemetry(status: 'degraded' | 'exact-original' | 'projection') {
  return {
    telemetryVersion: 'runtime-telemetry/1.0.0',
    eventName: 'runtime-adapter-terminal',
    runtime: 'claude',
    pathId: 'client-contract-test',
    presentationTier: status === 'projection' ? 'full-projection' : 'safe-native',
    status,
    reasonCode: status === 'projection' ? 'none' : 'atomic-replace-unavailable',
  } as const;
}
