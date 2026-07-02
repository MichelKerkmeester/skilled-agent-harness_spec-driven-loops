// ───────────────────────────────────────────────────────────────
// MODULE: sa-030 / sa-031 / sa-032 / sa-033 — Hook Parity Stress Test
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const REPO_ROOT = resolve(import.meta.dirname, '../../../../../../');
const CLAUDE_SETTINGS = resolve(REPO_ROOT, '.claude/settings.json');
const COPILOT_SETTINGS = resolve(REPO_ROOT, '.github/hooks/superset-notify.json');
const OPENCODE_PLUGIN = resolve(REPO_ROOT, '.opencode/plugins/mk-skill-advisor.js');

function readJson(path: string): Record<string, unknown> {
  expect(existsSync(path)).toBe(true);
  return JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>;
}

function readSource(path: string): string {
  expect(existsSync(path)).toBe(true);
  return readFileSync(path, 'utf8');
}

describe('sa-030 / sa-031 / sa-032 / sa-033 — hooks parity layer', () => {
  it('settings-driven invocation points each script-based runtime at its own compiled adapter', () => {
    const claude = readJson(CLAUDE_SETTINGS);
    const copilot = readJson(COPILOT_SETTINGS);

    expect(JSON.stringify(claude)).toContain('dist/hooks/claude/user-prompt-submit.js');
    expect(JSON.stringify(claude)).not.toContain('dist/hooks/copilot/user-prompt-submit.js');
    expect(JSON.stringify(copilot)).toContain('copilot-hook.sh userPromptSubmitted');
  });

  it('OpenCode wires the same prompt-submit and session-start equivalents through its plugin, not a settings/dist script pair', () => {
    // OpenCode has no settings.json + dist/hooks/<runtime>/*.js pattern; its
    // integration point is an auto-discovered plugin under .opencode/plugins/
    // that registers lifecycle hooks directly.
    const plugin = readSource(OPENCODE_PLUGIN);

    expect(plugin).toContain('experimental.chat.system.transform');
    expect(plugin).toContain('session.created');
  });
});
