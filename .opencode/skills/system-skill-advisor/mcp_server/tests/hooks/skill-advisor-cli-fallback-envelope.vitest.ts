// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor CLI Fallback Envelope Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { skillAdvisorCliFallbackEnvelope } from '../../../hooks/lib/skill-advisor-cli-fallback.js';

describe('skill advisor CLI fallback envelope', () => {
  it('normalizes advisor fallback outcomes to the shared warm-fallback shape', () => {
    const skipped = skillAdvisorCliFallbackEnvelope({ status: 'skipped', reason: 'CLI_WARM_SOCKET_MISSING', exitCode: 75 });
    const failed = skillAdvisorCliFallbackEnvelope({ status: 'fail_open', reason: 'CLI_EXIT_1', exitCode: 1 });
    const ok = skillAdvisorCliFallbackEnvelope({ status: 'ok', exitCode: 0 });

    expect(skipped).toEqual({
      status: 'skipped',
      reason: 'warm_socket_missing',
      exitCode: 75,
      retryable: true,
    });
    expect(failed).toEqual({
      status: 'fail_open',
      reason: 'exit_1',
      exitCode: 1,
      retryable: false,
    });
    expect(ok).toEqual({
      status: 'ok',
      reason: 'ok',
      exitCode: 0,
      retryable: false,
    });
  });
});
