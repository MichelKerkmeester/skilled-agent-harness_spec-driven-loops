// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Dispatch Adapters - Shell Tool Names
// ───────────────────────────────────────────────────────────────────
// Codex renamed its shell tool from `exec` to `Bash` in 0.160 and now hands
// PostToolUse a plain string where it used to hand `{stdout, stderr}`. Both
// adapters must keep firing under either name and either response shape.

import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..', '..', '..', '..');
const LINT = join(HERE, 'dispatch-preflight-lint.mjs');
const AUDIT = join(HERE, 'dispatch-audit-posttooluse.mjs');
const FLAGGED_DISPATCH = 'opencode run -m p/m --agent general "x" </dev/null';

function hookEnv() {
  const env = { ...process.env };
  for (const name of ['SYSTEM_HOOKS_DISABLED', 'MK_HOOKS_DISABLED', 'CLI_DISPATCH_AUDIT_DISABLED']) {
    delete env[name];
  }
  return env;
}

function runHook(script, payload) {
  return spawnSync(process.execPath, [script], {
    input: JSON.stringify(payload),
    encoding: 'utf8',
    env: hookEnv(),
    timeout: 15000,
  });
}

describe('Codex dispatch preflight lint', () => {
  it.each(['exec', 'Bash'])('lints a dispatch sent through the %s tool', (toolName) => {
    const result = runHook(LINT, {
      tool_name: toolName,
      cwd: REPO_ROOT,
      tool_input: { command: FLAGGED_DISPATCH },
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('no-bare-agent-general');
  });

  it('ignores a tool that is not the Codex shell', () => {
    const result = runHook(LINT, {
      tool_name: 'apply_patch',
      cwd: REPO_ROOT,
      tool_input: { command: FLAGGED_DISPATCH },
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toBe('');
  });
});

describe('Codex dispatch audit', () => {
  it.each([
    ['exec', { stdout: 'done\n', stderr: '' }],
    ['Bash', 'done\n'],
  ])('records a dispatch sent through the %s tool', (toolName, toolResponse) => {
    const projectDir = mkdtempSync(join(tmpdir(), 'codex-dispatch-audit-'));
    try {
      const result = runHook(AUDIT, {
        tool_name: toolName,
        cwd: projectDir,
        session_id: 'shell-tool-session',
        tool_input: { command: FLAGGED_DISPATCH },
        tool_response: toolResponse,
      });
      expect(result.status).toBe(0);
      expect(result.stdout).toBe('');
      const logPath = join(projectDir, '.skilled', 'logs', 'cli-dispatch-audit.log');
      expect(existsSync(logPath)).toBe(true);
      const line = JSON.parse(readFileSync(logPath, 'utf8').trim().split('\n').pop());
      expect(line.runtime).toBe('codex');
    } finally {
      rmSync(projectDir, { recursive: true, force: true });
    }
  });
});
