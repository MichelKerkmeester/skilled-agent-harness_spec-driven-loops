// ───────────────────────────────────────────────────────────────
// MODULE: Warm CLI Fallback Envelope Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { warmCliFallbackEnvelope } from '../hooks/warm-cli-fallback-envelope.js';

describe('warm CLI fallback envelope', () => {
  it('normalizes ok, skipped, and fail-open results to one additive shape', () => {
    const ok = warmCliFallbackEnvelope({ status: 'ok', exitCode: 0 });
    const skipped = warmCliFallbackEnvelope({ status: 'skipped', reason: 'socket_absent', exitCode: 75 });
    const failed = warmCliFallbackEnvelope({ status: 'fail_open', reason: 'dist_stale_rebuild_required', exitCode: 69 });

    for (const envelope of [ok, skipped, failed]) {
      expect(envelope).toEqual({
        status: expect.stringMatching(/^(ok|skipped|fail_open)$/),
        reason: expect.any(String),
        exitCode: expect.toBeOneOf([expect.any(Number), null]),
        retryable: expect.any(Boolean),
      });
    }
    expect(ok).toMatchObject({ reason: 'ok', retryable: false });
    expect(skipped).toMatchObject({ reason: 'socket_absent', retryable: true });
    expect(failed).toMatchObject({ reason: 'dist_stale_rebuild_required', retryable: false });
  });

  it('keeps legacy transport fields additive on helper result-shaped objects', () => {
    const envelope = warmCliFallbackEnvelope({ status: 'fail_open', reason: 'timeout', exitCode: 75, timedOut: true });
    const helperResult = {
      ...envelope,
      payload: null,
      stdout: '',
      stderr: '',
      durationMs: 3,
    };

    expect(helperResult).toMatchObject({
      status: 'fail_open',
      reason: 'timeout',
      exitCode: 75,
      retryable: true,
      payload: null,
      stdout: '',
      stderr: '',
      durationMs: expect.any(Number),
    });
  });
});
