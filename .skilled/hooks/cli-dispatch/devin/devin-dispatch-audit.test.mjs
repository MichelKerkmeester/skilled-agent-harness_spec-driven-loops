// ───────────────────────────────────────────────────────────────────
// MODULE: Devin Dispatch Audit Adapter
// ───────────────────────────────────────────────────────────────────
// The Devin adapter resolves a completed exec call through the shared audit
// core, so only a command the shell actually runs as a dispatch is logged. A
// command that merely writes a dispatch into heredoc data writes no line.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, it, expect } from 'vitest';

const HERE = dirname(fileURLToPath(import.meta.url));
const AUDIT = join(HERE, 'dispatch-audit-posttooluse.mjs');
const FLAGGED_DISPATCH = 'opencode run -m p/m "x" </dev/null';
const HEREDOC_ONLY = "cat > run.sh <<'EOF'\nopencode run -m p/m x\nEOF";

function hookEnv() {
  const env = { ...process.env };
  for (const name of [
    'SYSTEM_HOOKS_DISABLED',
    'MK_HOOKS_DISABLED',
    'CLI_DISPATCH_AUDIT_DISABLED',
    'SYSTEM_DISPATCH_DISABLED',
    'SYSTEM_DISPATCH_GUARD_DISABLED',
    'MK_DISPATCH_DISABLED',
  ]) {
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

describe('Devin dispatch audit', () => {
  it('records a dispatch sent through the exec tool', () => {
    const projectDir = mkdtempSync(join(tmpdir(), 'devin-dispatch-audit-'));
    try {
      const result = runHook(AUDIT, {
        tool_name: 'exec',
        cwd: projectDir,
        session_id: 'exec-session',
        tool_input: { command: FLAGGED_DISPATCH },
        tool_response: { stdout: 'done\n', stderr: '' },
      });
      expect(result.status).toBe(0);
      expect(result.stdout).toBe('');
      const logPath = join(projectDir, '.skilled', 'logs', 'cli-dispatch-audit.log');
      expect(existsSync(logPath)).toBe(true);
      const lines = readFileSync(logPath, 'utf8').trim().split('\n');
      expect(lines).toHaveLength(1);
      expect(JSON.parse(lines[0]).runtime).toBe('devin');
    } finally {
      rmSync(projectDir, { recursive: true, force: true });
    }
  });

  it('ignores a dispatch that is only heredoc data', () => {
    const projectDir = mkdtempSync(join(tmpdir(), 'devin-dispatch-audit-'));
    try {
      const result = runHook(AUDIT, {
        tool_name: 'exec',
        cwd: projectDir,
        session_id: 'heredoc-session',
        tool_input: { command: HEREDOC_ONLY },
      });
      expect(result.status).toBe(0);
      expect(existsSync(join(projectDir, '.skilled', 'logs', 'cli-dispatch-audit.log'))).toBe(false);
    } finally {
      rmSync(projectDir, { recursive: true, force: true });
    }
  });
});
