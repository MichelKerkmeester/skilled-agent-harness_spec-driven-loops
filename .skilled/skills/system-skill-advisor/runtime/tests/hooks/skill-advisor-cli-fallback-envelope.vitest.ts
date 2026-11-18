// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor CLI Fallback Envelope Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  resultFromCliData,
  skillAdvisorCliFallbackEnvelope,
} from '../../../hooks/lib/skill-advisor-cli-fallback.js';
import { renderAdvisorBrief } from '../../lib/render.js';

describe('skill advisor CLI fallback envelope', () => {
  // The expected heads are the interactive ones, so a run inside a dispatched
  // child must not turn them into the child form.
  beforeEach(() => {
    vi.stubEnv('AI_SESSION_CHILD', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

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

  it('keeps the command, its policy and its owner from a CLI row', () => {
    // A daemon that already resolved the route sends all three, and a drop of
    // any one turns the head into a bare skill name the reader cannot run.
    const result = resultFromCliData({
      data: {
        freshness: 'live',
        recommendations: [
          {
            skillId: 'sk-doc',
            confidence: 0.95,
            uncertainty: 0.12,
            command: '/create:agent',
            policy: 'start',
            ownerSkillId: 'sk-doc',
          },
        ],
      },
      options: { maxTokens: 80 } as never,
      startedAt: 0,
      now: () => 1,
    });

    const rendered = renderAdvisorBrief(result);

    expect(result.recommendations[0]).toMatchObject({
      command: '/create:agent',
      policy: 'start',
      ownerSkillId: 'sk-doc',
    });
    expect(rendered?.split('\n')[0]).toContain('sk-doc → /create:agent (start)');
  });

  it('keeps a hub that needs a mode from the CLI row', () => {
    const result = resultFromCliData({
      data: {
        freshness: 'live',
        recommendations: [
          { skillId: 'system-deep-loop', confidence: 0.89, uncertainty: 0.12, needsMode: true },
        ],
      },
      options: { maxTokens: 80 } as never,
      startedAt: 0,
      now: () => 1,
    });

    const rendered = renderAdvisorBrief(result);

    expect(rendered).not.toBeNull();
    expect(rendered?.split('\n')[0]).toContain('use system-deep-loop (needs a mode)');
  });

  it('keeps the confidence-floor flag from the CLI row', () => {
    const result = resultFromCliData({
      data: {
        freshness: 'live',
        recommendations: [
          { skillId: 'sk-code', confidence: 0.82, uncertainty: 0.2, confidenceFloored: true },
          { skillId: 'sk-doc', confidence: 0.9, uncertainty: 0.1 },
        ],
      },
      options: { maxTokens: 80 } as never,
      startedAt: 0,
      now: () => 1,
    });

    const bySkill = new Map(result.recommendations.map((recommendation) => [recommendation.skill, recommendation]));
    expect(bySkill.get('sk-code')).toHaveProperty('confidenceFloored', true);
    expect(bySkill.get('sk-doc')).not.toHaveProperty('confidenceFloored');
  });
});
