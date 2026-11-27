import { describe, expect, it } from 'vitest';

import { EXECUTOR_KINDS } from '../../../system-deep-loop/runtime/lib/deep-loop/executor-config.js';
import { DEFAULT_BUDGET } from '../lib/definition.js';
import { validatePosture } from '../lib/posture.js';
import { defaultRepoConfig } from '../lib/repo-config.js';

import type { BotDefinition } from '../lib/definition.js';

function definition(kind: string, sandbox: string | null, isolation: 'shared' | 'worktree' | null = 'shared') {
  return {
    posture: { isolation, sandbox, secrets: null },
    runtime: { kind },
    budget: { ...DEFAULT_BUDGET },
  } satisfies Pick<BotDefinition, 'posture' | 'runtime' | 'budget'>;
}

function verdict(kind: string, sandbox: string | null): string {
  const result = validatePosture(definition(kind, sandbox), defaultRepoConfig());
  return result.ok ? 'honored' : result.reason;
}

describe('posture matrix', () => {
  // One row per executor kind: what a read-only and a write-capable posture get.
  const expected: Record<string, { readOnly: string; write: string }> = {
    native: { readOnly: 'executor-kind-native', write: 'executor-kind-native' },
    'cli-codex': { readOnly: 'honored', write: 'honored' },
    'cli-claude-code': { readOnly: 'honored', write: 'posture-unhonorable' },
    'cli-opencode': { readOnly: 'honored', write: 'posture-unhonorable' },
    'cli-cursor': { readOnly: 'honored', write: 'honored' },
    'cli-devin': { readOnly: 'honored', write: 'posture-unhonorable' },
    'cli-pi': { readOnly: 'honored', write: 'posture-unhonorable' },
    'cli-deepseek-harness': { readOnly: 'honored', write: 'honored' },
    'cli-mistral-vibe': { readOnly: 'honored', write: 'posture-unhonorable' },
  };

  it('has a row for every executor kind', () => {
    expect(Object.keys(expected).sort()).toEqual([...EXECUTOR_KINDS].sort());
  });

  for (const kind of EXECUTOR_KINDS) {
    it(`${kind}: read-only ${expected[kind]?.readOnly}, workspace-write ${expected[kind]?.write}`, () => {
      expect(verdict(kind, 'read-only')).toBe(expected[kind]?.readOnly);
      expect(verdict(kind, 'workspace-write')).toBe(expected[kind]?.write);
    });
  }

  it('admits OpenCode and Mistral Vibe for read-only only, as tool gates', () => {
    for (const kind of ['cli-opencode', 'cli-mistral-vibe']) {
      expect(validatePosture(definition(kind, 'read-only'), defaultRepoConfig())).toMatchObject({
        ok: true,
        value: { posture: { sandbox: 'read-only', executorKind: kind } },
      });
      expect(verdict(kind, 'danger-full-access')).toBe('posture-unhonorable');
      // An undeclared sandbox resolves to workspace-write, which neither kind can honor.
      expect(verdict(kind, null)).toBe('posture-unhonorable');
    }
  });

  it('caps a declared danger-full-access without full access', () => {
    // cli-codex carries an OS-level sandbox, so it is the kind that can honor the class at all.
    const capped = validatePosture(definition('cli-codex', 'danger-full-access'), defaultRepoConfig());
    expect(capped).toMatchObject({
      ok: true,
      value: { posture: { sandbox: 'workspace-write' }, executor: { sandboxMode: 'workspace-write' } },
    });
    const granted = validatePosture(definition('cli-codex', 'danger-full-access'), defaultRepoConfig(), { fullAccess: true });
    expect(granted).toMatchObject({
      ok: true,
      value: { posture: { sandbox: 'danger-full-access' }, executor: { sandboxMode: 'danger-full-access' } },
    });
    // A class the definition may ask for on its own reads the same either way.
    for (const sandbox of ['read-only', 'workspace-write']) {
      expect(validatePosture(definition('cli-codex', sandbox), defaultRepoConfig())).toMatchObject({ ok: true, value: { posture: { sandbox } } });
      expect(validatePosture(definition('cli-codex', sandbox), defaultRepoConfig(), { fullAccess: true })).toMatchObject({ ok: true, value: { posture: { sandbox } } });
    }
  });

  it('honors worktree isolation and refuses undeclared isolation before any kind is weighed', () => {
    expect(validatePosture(definition('cli-codex', null, 'worktree'), defaultRepoConfig())).toMatchObject({
      ok: true,
      value: { posture: { isolation: 'worktree' } },
    });
    expect(validatePosture(definition('cli-codex', null, null), defaultRepoConfig())).toMatchObject({
      ok: false,
      reason: 'isolation-undeclared',
    });
  });

  it('states the honored posture and names the kinds that could honor a refused one', () => {
    const honored = validatePosture(definition('cli-codex', null), defaultRepoConfig());
    expect(honored).toMatchObject({ ok: true, value: { posture: { isolation: 'shared', sandbox: 'workspace-write', executorKind: 'cli-codex' } } });
    const refused = validatePosture(definition('cli-claude-code', 'workspace-write'), defaultRepoConfig());
    expect(refused).toMatchObject({ ok: false, reason: 'posture-unhonorable' });
    if (!refused.ok) expect(refused.detail).toContain('cli-codex');
  });

  it('refuses a kind the repository config does not allow', () => {
    const config = { ...defaultRepoConfig(), allowedExecutorKinds: ['cli-cursor'] };
    expect(validatePosture(definition('cli-codex', null), config)).toMatchObject({ ok: false, reason: 'executor-kind-not-allowed' });
  });
});
