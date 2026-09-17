// ───────────────────────────────────────────────────────────────────
// MODULE: CLI Live Preflight
// ───────────────────────────────────────────────────────────────────

import { realpathSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import { isPathInside } from './worktree-fixture';

export type LivePreflight =
  | { readonly ready: true; readonly reason: null }
  | { readonly ready: false; readonly reason: string };

function hasCodexRuntimeSignal(env: NodeJS.ProcessEnv): string | null {
  const key = Object.keys(env).find((name) => name === 'CODEX_SESSION_ID' || name.startsWith('CODEX_'));
  return key ?? null;
}

export function preflightCodexLive(input: {
  readonly enabled: boolean;
  readonly env: NodeJS.ProcessEnv;
  readonly runtimeRoot: string;
}): LivePreflight {
  if (!input.enabled) {
    return { ready: false, reason: 'live probe disabled: set DEEP_LOOP_CLI_CODEX_LIVE=1' };
  }

  const runtimeSignal = hasCodexRuntimeSignal(input.env);
  if (runtimeSignal) {
    return { ready: false, reason: `self-invocation guard: ${runtimeSignal} is set` };
  }

  let dependencyRoot: string;
  try {
    dependencyRoot = realpathSync(join(input.runtimeRoot, 'node_modules'));
  } catch {
    return { ready: false, reason: 'dependency missing: runtime/node_modules has no realpath' };
  }
  if (!isPathInside(dependencyRoot, input.runtimeRoot)) {
    return { ready: false, reason: `dependency isolation failed: node_modules resolves to ${dependencyRoot}` };
  }

  const available = spawnSync('/bin/sh', ['-c', 'command -v codex >/dev/null 2>&1'], {
    env: input.env,
    stdio: 'ignore',
    timeout: 1_000,
  });
  if (available.status !== 0) {
    return { ready: false, reason: 'dependency missing: command -v codex failed' };
  }

  const auth = spawnSync('codex', ['login', 'status'], {
    env: input.env,
    encoding: 'utf8',
    timeout: 2_000,
    input: '',
  });
  if (auth.error?.message.includes('ETIMEDOUT')) {
    return { ready: false, reason: 'authentication preflight timed out after 2000ms' };
  }
  if (auth.status !== 0) {
    return { ready: false, reason: 'authentication unavailable: codex login status failed' };
  }
  return { ready: true, reason: null };
}
