// ───────────────────────────────────────────────────────────────────
// MODULE: Phase Status Payload Capture
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import { collectSessionData } from '../extractors/collect-session-data';
import { normalizeInputData, validateInputData } from '../utils/input-normalizer';

describe('phase and status capture', () => {
  it('accepts explicit phase, status, and completion fields without unknown-field warnings', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const rawPayload = {
      sessionSummary: 'Completed the render-layer fixes and verified the final save output.',
      phase: 'IMPLEMENTATION',
      status: 'COMPLETED',
      completionPercent: 100,
    };

    try {
      validateInputData(rawPayload, 'test-packet');
      expect(
        warnSpy.mock.calls.some((call) => call.join(' ').includes('Unknown field in input data'))
      ).toBe(false);

      const normalized = normalizeInputData(rawPayload);
      expect((normalized as Record<string, unknown>).projectPhase).toBe('IMPLEMENTATION');
      expect((normalized as Record<string, unknown>).sessionStatus).toBe('COMPLETED');
      expect((normalized as Record<string, unknown>).completionPercent).toBe(100);

      const sessionData = await collectSessionData({
        _source: 'file',
        ...normalized,
      } as never, 'test-packet');

      expect(sessionData.PROJECT_PHASE).toBe('IMPLEMENTATION');
      expect(sessionData.SESSION_STATUS).toBe('COMPLETED');
      expect(sessionData.COMPLETION_PERCENT).toBe(100);
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('falls back to contextType-derived phase and git-derived status when explicit fields are absent', async () => {
    const sessionData = await collectSessionData({
      _source: 'file',
      sessionSummary: 'The packet still has working-tree edits to finish.',
      contextType: 'review',
      repositoryState: 'dirty',
    } as never, 'test-packet');

    expect(sessionData.PROJECT_PHASE).toBe('REVIEW');
    expect(sessionData.SESSION_STATUS).toBe('IN_PROGRESS');
    expect(sessionData.COMPLETION_PERCENT).toBe(95);
  });

  // A save payload classifies the session, so these read the session list. The
  // document list aliases review to research and has no debugging or decision;
  // reading it here would move each of these sessions to a different phase.
  it.each([
    ['planning', 'PLANNING'],
    ['debugging', 'DEBUGGING'],
    ['decision', 'PLANNING'],
  ])('derives the phase for a %s session from the session list', async (contextType, phase) => {
    validateInputData({ sessionSummary: 'A session summary.', contextType }, 'test-packet');
    const sessionData = await collectSessionData({
      _source: 'file',
      sessionSummary: 'A session summary.',
      contextType,
    } as never, 'test-packet');

    expect(sessionData.PROJECT_PHASE).toBe(phase);
  });
});
