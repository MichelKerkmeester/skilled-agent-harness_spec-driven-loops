import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runClaudeHookAdapter as runCodexHookAdapter } from '../hooks/codex/shared.js';
import { runClaudeHookAdapter as runCursorHookAdapter } from '../hooks/cursor/shared.js';
import { runClaudeHookAdapter as runDevinHookAdapter } from '../hooks/devin/shared.js';

const childProcessState = vi.hoisted(() => ({
  options: [] as Array<{ env?: Record<string, string | undefined> } | undefined>,
}));

vi.mock('node:child_process', () => ({
  spawnSync: vi.fn(
    (
      _command: string,
      _args: readonly string[],
      options?: { env?: Record<string, string | undefined> },
    ) => {
      childProcessState.options.push(options);
      return { status: 0, stdout: '{}', stderr: '' };
    },
  ),
}));

const inheritedPath = process.env.PATH ?? '/usr/bin';

beforeEach(() => {
  childProcessState.options.length = 0;
  vi.stubEnv('SPECKIT_RUNTIME', 'claude');
  vi.stubEnv('PATH', inheritedPath);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

const runtimeAdapters = [
  { name: 'Codex', runtime: 'codex', run: runCodexHookAdapter },
  { name: 'Cursor', runtime: 'cursor', run: runCursorHookAdapter },
  { name: 'Devin', runtime: 'devin', run: runDevinHookAdapter },
] as const;

describe.each(runtimeAdapters)('$name hook adapter runtime label', ({ runtime, run }) => {
  it('sets its runtime label and preserves inherited environment', () => {
    run('user-prompt-submit.js', {}, 2800);

    expect(childProcessState.options).toHaveLength(1);
    const options = childProcessState.options[0];
    expect(options?.env?.SPECKIT_RUNTIME).toBe(runtime);
    expect(options?.env?.PATH).toBe(inheritedPath);
  });
});
