// ───────────────────────────────────────────────────────────────────
// MODULE: Client Display Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import { applyDisplayPresentation } from '../../src/clients/index.js';
import {
  ClaudeRuntimePaths,
  claudeRuntimeAdapter,
} from '../../src/runtimes/index.js';
import {
  TESTED_CLAUDE_VERSION,
  TESTED_PROTOCOL_VERSION,
  createAcceptedRenderDecision,
} from '../runtimes/helpers.js';

describe('client-owned display presentation', () => {
  it('atomically replaces one complete visible message', async () => {
    let visibleMessage = 'Native original remains visible until commit.';
    const commitAtomicReplacement = vi.fn((replacement: {
      readonly messageId: string;
      readonly projectionText: string;
    }) => {
      visibleMessage = replacement.projectionText;
      return true;
    });
    const appendAfterOriginal = vi.fn(() => true);
    const outcome = await createFullProjectionOutcome('Validated complete projection.');

    const result = applyDisplayPresentation({
      messageId: 'message-atomic',
      outcome,
      ownership: {
        ownsCompleteMessage: true,
        ownsAtomicRenderDecision: true,
      },
      surface: { commitAtomicReplacement, appendAfterOriginal },
    });

    expect(commitAtomicReplacement).toHaveBeenCalledOnce();
    expect(commitAtomicReplacement).toHaveBeenCalledWith({
      messageId: 'message-atomic',
      projectionText: outcome.projectionText,
    });
    expect(appendAfterOriginal).not.toHaveBeenCalled();
    expect(visibleMessage).toBe(outcome.projectionText);
    expect(result).toEqual({
      clientContractVersion: 'client-presentation/1.0.0',
      status: 'projection',
      mode: 'atomic-replace',
      reasonCode: 'none',
      originalVisible: false,
      projectionVisible: true,
    });
  });

  it('keeps the original when complete-message or atomic ownership is absent', async () => {
    const commitAtomicReplacement = vi.fn(() => true);
    const appendAfterOriginal = vi.fn(() => true);
    const outcome = await createFullProjectionOutcome('Ownership-gated projection.');

    const result = applyDisplayPresentation({
      messageId: 'message-no-ownership',
      outcome,
      ownership: {
        ownsCompleteMessage: true,
        ownsAtomicRenderDecision: false,
      },
      surface: { commitAtomicReplacement, appendAfterOriginal },
    });

    expect(commitAtomicReplacement).not.toHaveBeenCalled();
    expect(appendAfterOriginal).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      status: 'exact-original',
      mode: 'original-only',
      reasonCode: 'atomic-replace-unavailable',
      originalVisible: true,
      projectionVisible: false,
    });
  });

  it('never suppresses the original when the atomic commit fails', async () => {
    const outcome = await createFullProjectionOutcome('Uncommitted projection.');
    const result = applyDisplayPresentation({
      messageId: 'message-failed-commit',
      outcome,
      ownership: {
        ownsCompleteMessage: true,
        ownsAtomicRenderDecision: true,
      },
      surface: {
        commitAtomicReplacement: vi.fn(() => false),
        appendAfterOriginal: vi.fn(() => true),
      },
    });

    expect(result).toMatchObject({
      status: 'exact-original',
      mode: 'original-only',
      reasonCode: 'display-commit-failed',
      originalVisible: true,
      projectionVisible: false,
    });
  });

  it('applies an adapter-selected append without replacing the original', async () => {
    const appendAfterOriginal = vi.fn(() => true);
    const outcome = claudeRuntimeAdapter.present({
      pathId: ClaudeRuntimePaths.INTERACTIVE,
      runtimeVersion: TESTED_CLAUDE_VERSION,
      protocolVersion: TESTED_PROTOCOL_VERSION,
      renderDecision: await createAcceptedRenderDecision('Safe append projection.'),
      preferredDegradationModes: ['append'],
    });

    const result = applyDisplayPresentation({
      messageId: 'message-append',
      outcome,
      ownership: {
        ownsCompleteMessage: false,
        ownsAtomicRenderDecision: false,
      },
      surface: {
        commitAtomicReplacement: vi.fn(() => true),
        appendAfterOriginal,
      },
    });

    expect(appendAfterOriginal).toHaveBeenCalledOnce();
    expect(result).toMatchObject({
      status: 'degraded',
      mode: 'append',
      reasonCode: 'atomic-replace-unavailable',
      originalVisible: true,
      projectionVisible: true,
    });
  });
});

async function createFullProjectionOutcome(source: string) {
  const outcome = claudeRuntimeAdapter.present({
    pathId: ClaudeRuntimePaths.HEADLESS,
    runtimeVersion: TESTED_CLAUDE_VERSION,
    protocolVersion: TESTED_PROTOCOL_VERSION,
    renderDecision: await createAcceptedRenderDecision(source),
  });
  if (outcome.status !== 'projection') {
    throw new Error('Expected a full-projection client fixture.');
  }
  return outcome;
}
