// ───────────────────────────────────────────────────────────────
// MODULE: Directive Lifecycle Adapter Parity Tests
// ───────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { lstatSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const packageRoot = resolve(import.meta.dirname, '..');
const repoRoot = resolve(packageRoot, '../../../..');
const FULL = 'Advisor: live; use sk-code 0.91/0.23 pass.\nDirectives:\n- Comment hygiene';
const ROUTE_ONLY = 'Advisor: live; use sk-code 0.91/0.23 pass.';
let tempDir = '';

function targetStub(): string {
  tempDir ||= mkdtempSync(join(tmpdir(), 'directive-adapter-stub-'));
  const path = join(tempDir, 'advisor-target.mjs');
  writeFileSync(path, "process.stdin.resume(); process.stdin.on('end', () => { const mode=process.env.DIRECTIVE_TEST_MODE; if(mode==='malformed') return process.stdout.write('{bad'); if(mode==='timeout') return setTimeout(()=>{},4000); process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:'UserPromptSubmit',additionalContext:process.env.DIRECTIVE_TEST_CONTEXT}})+'\\n'); });\n");
  return path;
}

function runtimeCase(runtime: 'claude' | 'codex' | 'cursor' | 'devin') {
  const hookPath = join(packageRoot, 'dist', 'hooks', runtime, 'user-prompt-submit.js');
  if (runtime === 'cursor') {
    return {
      hookPath,
      payload: {
        hook_event_name: 'beforeSubmitPrompt',
        prompt: 'implement feature',
        session_id: 's1',
        transcript_path: '/tmp/transcript.jsonl',
        workspace_roots: [repoRoot],
      },
      contextFrom(output: Record<string, unknown>) {
        return output.agent_message;
      },
    };
  }
  return {
    hookPath,
    payload: {
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement feature',
      session_id: 's1',
      transcript_path: '/tmp/transcript.jsonl',
      cwd: repoRoot,
    },
    contextFrom(output: Record<string, unknown>) {
      return (output.hookSpecificOutput as Record<string, unknown>)?.additionalContext;
    },
  };
}

function invokeResult(
  runtime: 'claude' | 'codex' | 'cursor' | 'devin',
  context: string,
  options: { mode?: string; payload?: Record<string, unknown> } = {},
) {
  const testCase = runtimeCase(runtime);
  const result = spawnSync(process.execPath, [testCase.hookPath], {
    cwd: repoRoot,
    input: JSON.stringify(options.payload ?? testCase.payload),
    encoding: 'utf8',
    timeout: 6_000,
    env: {
      ...process.env,
      SPECKIT_USER_PROMPT_TARGET: targetStub(),
      DIRECTIVE_TEST_CONTEXT: context,
      ...(options.mode ? { DIRECTIVE_TEST_MODE: options.mode } : {}),
    },
  });
  let parsed: Record<string, unknown> = {};
  try { parsed = JSON.parse(result.stdout) as Record<string, unknown>; } catch { parsed = {}; }
  return {
    status: result.status,
    stderr: result.stderr,
    context: String(testCase.contextFrom(parsed) ?? ''),
    output: parsed,
  };
}

function invoke(runtime: 'claude' | 'codex' | 'cursor' | 'devin', context: string): string {
  const result = invokeResult(runtime, context);
  expect(result.status, result.stderr).toBe(0);
  return result.context;
}

afterEach(() => {
  if (tempDir) rmSync(tempDir, { recursive: true, force: true });
  tempDir = '';
});

describe('registered adapter payload and envelope parity', () => {
  it.each(['claude', 'codex', 'cursor', 'devin'] as const)(
    '%s preserves full, route-only, and boundary-full context',
    (runtime) => {
      expect(invoke(runtime, FULL)).toBe(FULL);
      expect(invoke(runtime, ROUTE_ONLY)).toBe(ROUTE_ONLY);
      expect(invoke(runtime, FULL)).toBe(FULL);
    },
  );

  it.each(['claude', 'codex', 'cursor', 'devin'] as const)(
    '%s fails open on malformed and timed-out advisor children',
    (runtime) => {
      const malformed = invokeResult(runtime, FULL, { mode: 'malformed' });
      const timedOut = invokeResult(runtime, FULL, { mode: 'timeout' });
      expect(malformed.status, malformed.stderr).toBe(0);
      expect(timedOut.status, timedOut.stderr).toBe(0);
      expect(malformed.context).toBe('');
      expect(timedOut.context).toBe('');
    },
    20_000,
  );

  it.each(['claude', 'codex', 'cursor', 'devin'] as const)(
    '%s handles missing native fields without malformed model context',
    (runtime) => {
      const result = invokeResult(runtime, FULL, { payload: {} });
      expect(result.status, result.stderr).toBe(0);
      expect(result.context).not.toContain('[object Object]');
    },
  );

  it.each(['claude', 'codex', 'cursor', 'devin'] as const)(
    '%s discovery path preserves its documented direct-entry behavior',
    (runtime) => {
      const mirror = join(repoRoot, `.${runtime}`, 'hooks', 'user-prompt-submit.js');
      expect(lstatSync(mirror).isSymbolicLink()).toBe(true);
      expect(realpathSync(mirror)).toBe(join(packageRoot, 'dist', 'hooks', runtime, 'user-prompt-submit.js'));
      const direct = spawnSync(process.execPath, [mirror], {
        cwd: repoRoot,
        input: JSON.stringify(runtimeCase(runtime).payload),
        encoding: 'utf8',
        timeout: 5_000,
      });
      expect(direct.status, direct.stderr).toBe(0);
      if (runtime === 'claude') expect(direct.stdout).toContain('hookSpecificOutput');
      else expect(direct.stdout).toBe('');
    },
  );
});
