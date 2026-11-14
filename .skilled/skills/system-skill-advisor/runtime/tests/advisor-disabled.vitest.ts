// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Disabled Switch Tests
// ───────────────────────────────────────────────────────────────

// The switch is read by two callers in two processes, the daemon handler and the
// CLI client, so its exact-value rule and the envelope it builds are pinned here
// once rather than twice through each caller.

import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { advisorDisabledBy, disabledRecommendOutput } from '../lib/advisor-disabled.js';
import { resolvedUncertaintyThreshold } from '../lib/compat/contract.js';

describe('advisorDisabledBy', () => {
  it('returns null when no switch is set', () => {
    expect(advisorDisabledBy({})).toBeNull();
  });

  it.each([
    ['SYSTEM_SKILL_ADVISOR_HOOK_DISABLED'],
    ['SPECKIT_SKILL_ADVISOR_HOOK_DISABLED'],
  ])('names %s when it is set to 1', (flag) => {
    expect(advisorDisabledBy({ [flag]: '1' })).toBe(flag);
  });

  it('names the canonical switch when both are set', () => {
    expect(advisorDisabledBy({
      SYSTEM_SKILL_ADVISOR_HOOK_DISABLED: '1',
      SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: '1',
    })).toBe('SYSTEM_SKILL_ADVISOR_HOOK_DISABLED');
  });

  it.each([
    [{ SYSTEM_SKILL_ADVISOR_HOOK_DISABLED: 'true' }],
    [{ SYSTEM_SKILL_ADVISOR_HOOK_DISABLED: '0' }],
    [{ SYSTEM_SKILL_ADVISOR_DISABLED: '1' }],
    [{ SYSTEM_HOOKS_DISABLED: '1' }],
  ])('ignores %o, as the handler always has', (env) => {
    expect(advisorDisabledBy(env)).toBeNull();
  });
});

describe('disabledRecommendOutput', () => {
  it('returns null when no switch is set', () => {
    expect(disabledRecommendOutput({ prompt: 'x' }, {})).toBeNull();
  });

  it('builds the empty envelope that names the switch', () => {
    const workspaceRoot = mkdtempSync(join(tmpdir(), 'adv-off-'));
    try {
      const output = disabledRecommendOutput(
        { prompt: 'x', workspaceRoot, options: { confidenceThreshold: 0.7 } },
        { SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: '1' },
      );
      expect(output).toMatchObject({
        workspaceRoot: realpathSync.native(workspaceRoot),
        recommendations: [],
        freshness: 'unavailable',
        warnings: ['ADVISOR_DISABLED'],
        abstainReasons: ['Skill advisor disabled by SPECKIT_SKILL_ADVISOR_HOOK_DISABLED.'],
        effectiveThresholds: {
          confidenceThreshold: 0.7,
          uncertaintyThreshold: resolvedUncertaintyThreshold(),
          confidenceOnly: false,
        },
        trustState: { state: 'unavailable', reason: 'ADVISOR_DISABLED' },
      });
    } finally {
      rmSync(workspaceRoot, { recursive: true, force: true });
    }
  });
});
