// ───────────────────────────────────────────────────────────────
// MODULE: Runtime Detection
// ───────────────────────────────────────────────────────────────
// Spec-kit local runtime detection. This used to be imported from
// system-code-graph, but startup ownership belongs with spec-kit hooks.

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
export type RuntimeId = 'claude-code' | 'copilot-cli' | 'unknown';
export type HookPolicy = 'enabled' | 'disabled_by_scope' | 'live' | 'partial' | 'unavailable' | 'unknown';

export interface RuntimeInfo {
  runtime: RuntimeId;
  hookPolicy: HookPolicy;
}

export function detectRuntime(): RuntimeInfo {
  const env = process.env;
  if (env.CLAUDE_CODE === '1' || env.CLAUDE_SESSION_ID || env.MCP_SERVER_NAME === 'context-server') {
    return { runtime: 'claude-code', hookPolicy: 'enabled' };
  }
  if (env.COPILOT_CLI === '1' || env.GITHUB_COPILOT_CLI === '1') {
    return { runtime: 'copilot-cli', hookPolicy: detectCopilotHookPolicy() };
  }
  return { runtime: 'unknown', hookPolicy: 'unknown' };
}

function detectCopilotHookPolicy(): HookPolicy {
  try {
    const settingsPath = resolve(process.cwd(), '.claude', 'settings.local.json');
    if (!existsSync(settingsPath)) return 'disabled_by_scope';
    const parsed = JSON.parse(readFileSync(settingsPath, 'utf-8')) as { hooks?: unknown };
    const hooks = parsed.hooks;
    if (!hooks || typeof hooks !== 'object') return 'disabled_by_scope';
    const hasPromptWrapper = hasCopilotWrapper(hooks, 'UserPromptSubmit', [
      '/hooks/copilot/user-prompt-submit.js',
      '.github/hooks/scripts/user-prompt-submitted.sh',
    ]);
    const hasStartupWrapper = hasCopilotWrapper(hooks, 'SessionStart', [
      '/hooks/copilot/session-prime.js',
      '.github/hooks/scripts/session-start.sh',
    ]);
    return hasPromptWrapper && hasStartupWrapper ? 'enabled' : 'disabled_by_scope';
  } catch {
    return 'unavailable';
  }
}

function hasCopilotWrapper(hooks: unknown, eventName: string, commandNeedles: string[]): boolean {
  if (typeof hooks !== 'object' || hooks === null) return false;
  const entries = (hooks as Record<string, unknown>)[eventName];
  if (!Array.isArray(entries)) return false;
  return entries.some((entry) => {
    if (typeof entry !== 'object' || entry === null) return false;
    const record = entry as Record<string, unknown>;
    const bash = record.bash;
    if (
      record.type === 'command'
      && typeof bash === 'string'
      && commandNeedles.some((needle) => bash.includes(needle))
      && typeof record.timeoutSec === 'number'
      && Number.isFinite(record.timeoutSec)
      && record.timeoutSec > 0
    ) {
      return true;
    }

    const nested = record.hooks;
    if (Array.isArray(nested)) {
      return nested.some((hook) => {
        if (typeof hook !== 'object' || hook === null) return false;
        const command = hook as Record<string, unknown>;
        const nestedCommand = command.command;
        return command.type === 'command'
          && typeof nestedCommand === 'string'
          && commandNeedles.some((needle) => nestedCommand.includes(needle))
          && typeof command.timeout === 'number'
          && Number.isFinite(command.timeout)
          && command.timeout > 0;
      });
    }
    return false;
  });
}

export function areHooksAvailable(): boolean {
  const { hookPolicy } = detectRuntime();
  return hookPolicy === 'enabled' || hookPolicy === 'live' || hookPolicy === 'partial';
}

export function getRecoveryApproach(): 'hooks' | 'tool_fallback' {
  return areHooksAvailable() ? 'hooks' : 'tool_fallback';
}
