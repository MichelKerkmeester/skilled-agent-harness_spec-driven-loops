// ───────────────────────────────────────────────────────────────────
// MODULE: Client Sidecar Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import { applySidecarPresentation } from '../../src/clients/index.js';
import {
  ClaudeRuntimePaths,
  claudeRuntimeAdapter,
} from '../../src/runtimes/index.js';
import {
  TESTED_CLAUDE_VERSION,
  TESTED_PROTOCOL_VERSION,
  createAcceptedRenderDecision,
  createRejectedRenderDecision,
} from '../runtimes/helpers.js';

describe('sidecar presentation', () => {
  it('shows the projection separately while leaving the original visible', async () => {
    const nativeMessage = 'The native original stays untouched.';
    let sidecarMessage: string | null = null;
    const presentProjection = vi.fn((projection: { readonly projectionText: string }) => {
      sidecarMessage = projection.projectionText;
      return true;
    });
    const outcome = await createSidecarOutcome('Validated sidecar projection.');

    const result = applySidecarPresentation({
      messageId: 'message-sidecar',
      outcome,
      surface: { presentProjection },
    });

    expect(nativeMessage).toBe('The native original stays untouched.');
    expect(sidecarMessage).toBe(outcome.projectionText);
    expect(presentProjection).toHaveBeenCalledWith({
      messageId: 'message-sidecar',
      projectionText: outcome.projectionText,
    });
    expect(result).toMatchObject({
      status: 'degraded',
      mode: 'sidecar',
      reasonCode: 'atomic-replace-unavailable',
      originalVisible: true,
      projectionVisible: true,
    });
  });

  it('falls back to original-only when the separate view rejects the projection', async () => {
    const outcome = await createSidecarOutcome('Rejected sidecar commit.');
    const result = applySidecarPresentation({
      messageId: 'message-sidecar-failed',
      outcome,
      surface: { presentProjection: vi.fn(() => false) },
    });

    expect(result).toMatchObject({
      status: 'exact-original',
      mode: 'original-only',
      reasonCode: 'sidecar-commit-failed',
      originalVisible: true,
      projectionVisible: false,
    });
  });

  it('does not open a sidecar for an exact-original outcome', async () => {
    const presentProjection = vi.fn(() => true);
    const outcome = claudeRuntimeAdapter.present({
      pathId: ClaudeRuntimePaths.INTERACTIVE,
      runtimeVersion: TESTED_CLAUDE_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision: await createRejectedRenderDecision('Retain the native original.'),
      preferredDegradationModes: ['sidecar'],
    });

    const result = applySidecarPresentation({
      messageId: 'message-original-only',
      outcome,
      surface: { presentProjection },
    });

    expect(presentProjection).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      status: 'exact-original',
      mode: 'original-only',
      reasonCode: 'projection-rejected',
      originalVisible: true,
      projectionVisible: false,
    });
  });
});

async function createSidecarOutcome(source: string) {
  const outcome = claudeRuntimeAdapter.present({
    pathId: ClaudeRuntimePaths.INTERACTIVE,
    runtimeVersion: TESTED_CLAUDE_VERSION,
    protocolVersion: TESTED_PROTOCOL_VERSION,
    renderDecision: await createAcceptedRenderDecision(source),
    preferredDegradationModes: ['sidecar'],
  });
  if (outcome.status !== 'degraded' || outcome.mode !== 'sidecar') {
    throw new Error('Expected a sidecar client fixture.');
  }
  return outcome;
}
