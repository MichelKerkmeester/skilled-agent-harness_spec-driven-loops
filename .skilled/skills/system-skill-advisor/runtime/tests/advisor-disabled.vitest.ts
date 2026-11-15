// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Disabled Switch Tests
// ───────────────────────────────────────────────────────────────

// The switch is read by two callers in two processes, the daemon handler and the
// CLI client, so its exact-value rule and the envelope it builds are pinned here
// once rather than twice through each caller.

import { mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, describe, expect, it } from 'vitest';

import { ADVISOR_DISABLED_FLAGS, advisorDisabledBy, disabledRecommendOutput } from '../lib/advisor-disabled.js';
import { resolvedUncertaintyThreshold } from '../lib/compat/contract.js';

describe('advisorDisabledBy', () => {
  it('returns null when no switch is set', () => {
    expect(advisorDisabledBy({}, {})).toBeNull();
  });

  it.each([
    ['SYSTEM_SKILL_ADVISOR_HOOK_DISABLED'],
    ['SPECKIT_SKILL_ADVISOR_HOOK_DISABLED'],
  ])('names %s when it is set to 1', (flag) => {
    expect(advisorDisabledBy({ [flag]: '1' }, {})).toBe(flag);
  });

  it('names the canonical switch when both are set', () => {
    expect(advisorDisabledBy({
      SYSTEM_SKILL_ADVISOR_HOOK_DISABLED: '1',
      SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: '1',
    }, {})).toBe('SYSTEM_SKILL_ADVISOR_HOOK_DISABLED');
  });

  it.each([
    [{ SYSTEM_SKILL_ADVISOR_HOOK_DISABLED: '0' }],
    [{ SYSTEM_SKILL_ADVISOR_DISABLED: '' }],
  ])('ignores %o, as the hooks do', (env) => {
    expect(advisorDisabledBy(env, {})).toBeNull();
  });

  it.each([
    [{ SYSTEM_SKILL_ADVISOR_HOOK_DISABLED: 'true' }, 'SYSTEM_SKILL_ADVISOR_HOOK_DISABLED'],
    [{ SYSTEM_SKILL_ADVISOR_DISABLED: '1' }, 'SYSTEM_SKILL_ADVISOR_DISABLED'],
    [{ SYSTEM_SKILL_ADVISOR_DISABLED: 'ON' }, 'SYSTEM_SKILL_ADVISOR_DISABLED'],
    [{ SYSTEM_HOOKS_DISABLED: '1' }, 'SYSTEM_HOOKS_DISABLED'],
  ])('names the switch for %o, as the hooks do', (env, flag) => {
    expect(advisorDisabledBy(env, {})).toBe(flag);
  });

  it('takes its names from the hooks resolver', () => {
    expect(ADVISOR_DISABLED_FLAGS).toEqual(expect.arrayContaining([
      'SYSTEM_HOOKS_DISABLED',
      'SYSTEM_SKILL_ADVISOR_DISABLED',
      'SYSTEM_SKILL_ADVISOR_HOOK_DISABLED',
      'SPECKIT_SKILL_ADVISOR_HOOK_DISABLED',
    ]));
  });
});

describe('advisorDisabledBy with a flags file', () => {
  const folder = mkdtempSync(join(tmpdir(), 'adv-flags-'));
  const flagsFile = join(folder, 'hook-flags.env');
  writeFileSync(flagsFile, 'SYSTEM_SKILL_ADVISOR_DISABLED=1\n');

  afterAll(() => {
    rmSync(folder, { recursive: true, force: true });
  });

  it('reads the file when the environment names no config', () => {
    expect(advisorDisabledBy({ HOOK_FLAGS_CONFIG: flagsFile })).toBe('SYSTEM_SKILL_ADVISOR_DISABLED');
  });

  it('lets an environment value of 0 win over the file', () => {
    expect(advisorDisabledBy({ HOOK_FLAGS_CONFIG: flagsFile, SYSTEM_SKILL_ADVISOR_DISABLED: '0' })).toBeNull();
  });

  it('reads no file when the caller passes an explicit config', () => {
    expect(advisorDisabledBy({ HOOK_FLAGS_CONFIG: flagsFile }, {})).toBeNull();
  });
});

describe('disabledRecommendOutput', () => {
  it('returns null when no switch is set', () => {
    expect(disabledRecommendOutput({ prompt: 'x' }, {}, {})).toBeNull();
  });

  it('builds the empty envelope that names the switch', () => {
    const workspaceRoot = mkdtempSync(join(tmpdir(), 'adv-off-'));
    try {
      const output = disabledRecommendOutput(
        { prompt: 'x', workspaceRoot, options: { confidenceThreshold: 0.7 } },
        { SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: '1' },
        {},
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
