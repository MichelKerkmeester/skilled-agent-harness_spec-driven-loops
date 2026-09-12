// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor CLI Fallback No-Match Diagnostics Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { resultFromCliData } from '../../../hooks/lib/skill-advisor-cli-fallback.js';

const OPTIONS = { maxTokens: 80 } as never;

function build(data: Record<string, unknown>) {
  return resultFromCliData({
    data: data as never,
    options: OPTIONS,
    startedAt: 0,
    now: () => 1,
  }) as unknown as {
    status: string;
    freshness: string;
    diagnostics: Record<string, unknown> | null;
  };
}

const PASSING_RECOMMENDATION = {
  skillId: 'sk-git',
  confidence: 0.95,
  uncertainty: 0.1,
};

describe('skill advisor CLI fallback no-match diagnostics', () => {
  it('reports a live advisor with nothing to recommend as a no-match, not an outage', () => {
    const result = build({ freshness: 'live', recommendations: [] });

    expect(result.status).toBe('skipped');
    expect(result.freshness).toBe('live');
    // The advisor answered. Naming an error code or class here is what made a
    // successful empty result read as a transport failure.
    expect(result.diagnostics?.errorMessage).toBe('CLI_ADVISOR_NO_MATCH');
    expect(result.diagnostics?.reason).toBe('no_recommendation');
    expect(result.diagnostics?.errorCode).toBeUndefined();
    expect(result.diagnostics?.errorClass).toBeUndefined();
  });

  it('still reports an unreachable advisor as unavailable', () => {
    const result = build({ freshness: 'unavailable', recommendations: [] });

    expect(result.status).toBe('fail_open');
    expect(result.diagnostics?.errorMessage).toBe('CLI_ADVISOR_UNAVAILABLE');
    expect(result.diagnostics?.errorCode).toBe('NON_ZERO_EXIT');
  });

  it('leaves a successful recommendation free of diagnostics', () => {
    const result = build({ freshness: 'live', recommendations: [PASSING_RECOMMENDATION] });

    expect(result.status).toBe('ok');
    expect(result.diagnostics).toBeNull();
  });
});
