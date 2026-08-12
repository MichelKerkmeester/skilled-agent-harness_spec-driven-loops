#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex SessionStart Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under Codex CLI via `.codex/hooks.json`'s
// SessionStart event, running the compiled `dist/hooks/codex/session-start.js`.

import {
  emitCodexContext,
  readCodexHookInput,
  runClaudeHookAdapter,
  runCodexHook,
} from './shared.js';
import { notifyDirectiveLifecycleBoundary } from '../claude/directive-lifecycle-boundary.js';
import { isHookEnabled } from '../../../../../../.opencode/hooks/shared/hook-flags.mjs';

async function main(): Promise<void> {
  if (!isHookEnabled('session-lifecycle')) return undefined;
  const input = await readCodexHookInput('SessionStart', ['session_id']);
  if (!input) {
    notifyDirectiveLifecycleBoundary({ sessionId: null, boundary: 'startup' });
    return;
  }

  const context = runClaudeHookAdapter('session-prime.js', input, 2_800);
  emitCodexContext('SessionStart', context);
}

runCodexHook(import.meta.url, main);
