// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor CLI Fallback Envelope Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  resultFromCliData,
  skillAdvisorCliFallbackEnvelope,
} from '../../../hooks/lib/skill-advisor-cli-fallback.js';
import { renderAdvisorBrief } from '../../lib/render.js';

describe('skill advisor CLI fallback envelope', () => {
  it('normalizes advisor fallback outcomes to the shared warm-fallback shape', () => {
    const skipped = skillAdvisorCliFallbackEnvelope({ status: 'skipped', reason: 'CLI_SOCKET_ABSENT', exitCode: 75 });
    const failed = skillAdvisorCliFallbackEnvelope({ status: 'fail_open', reason: 'CLI_EXIT_1', exitCode: 1 });
    const ok = skillAdvisorCliFallbackEnvelope({ status: 'ok', exitCode: 0 });

    expect(skipped).toEqual({
      status: 'skipped',
      reason: 'socket_absent',
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

  it('renders a CLI row without command fields from the generated table', () => {
    // An older daemon sends no command, policy or owner, so the generated row
    // must supply all three for the head to name the runnable mode.
    const result = resultFromCliData({
      data: {
        freshness: 'live',
        recommendations: [
          { skillId: 'command-speckit-save', confidence: 0.89, uncertainty: 0.12 },
        ],
      },
      options: { maxTokens: 80 } as never,
      startedAt: 0,
      now: () => 1,
    });

    const rendered = renderAdvisorBrief(result);

    expect(rendered).not.toBeNull();
    expect(rendered?.split('\n')[0]).toContain('system-spec-kit → /speckit:save (start)');
  });
});
