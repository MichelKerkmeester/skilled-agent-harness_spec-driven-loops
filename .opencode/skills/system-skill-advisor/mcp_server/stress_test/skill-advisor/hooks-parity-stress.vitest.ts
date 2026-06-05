// ───────────────────────────────────────────────────────────────
// MODULE: sa-030 / sa-031 / sa-032 / sa-033 — Hook Parity Stress Test
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const REPO_ROOT = resolve(import.meta.dirname, '../../../../../../');
const CLAUDE_SETTINGS = resolve(REPO_ROOT, '.claude/settings.local.json');
const COPILOT_SETTINGS = resolve(REPO_ROOT, '.github/hooks/superset-notify.json');
const CODEX_SETTINGS = resolve(REPO_ROOT, '.codex/settings.json');

function readJson(path: string): Record<string, unknown> {
  expect(existsSync(path)).toBe(true);
  return JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>;
}

describe('sa-030 / sa-031 / sa-032 / sa-033 — hooks parity layer', () => {
  it('settings-driven invocation points each runtime at its own compiled adapter', () => {
    const claude = readJson(CLAUDE_SETTINGS);
    const copilot = readJson(COPILOT_SETTINGS);
    const codex = readJson(CODEX_SETTINGS);

    expect(JSON.stringify(claude)).toContain('dist/hooks/claude/user-prompt-submit.js');
    expect(JSON.stringify(claude)).not.toContain('dist/hooks/copilot/user-prompt-submit.js');
    expect(JSON.stringify(copilot)).toContain('copilot-hook.sh userPromptSubmitted');
    expect(JSON.stringify(codex)).toContain('dist/hooks/codex/user-prompt-submit.js');
    expect(JSON.stringify(codex)).toContain('dist/hooks/codex/session-start.js');
  });
});
