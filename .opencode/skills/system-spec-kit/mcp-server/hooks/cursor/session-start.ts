#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor SessionStart Hook Adapter
// ───────────────────────────────────────────────────────────────────

import {
  emitCursorResponse,
  readCursorHookInput,
  runClaudeHookAdapter,
  runCursorHook,
  toClaudeShape,
} from './shared.js';

async function main(): Promise<void> {
  const input = await readCursorHookInput('sessionStart', ['session_id']);
  if (!input) return emitCursorResponse(null);

  const context = runClaudeHookAdapter('session-prime.js', toClaudeShape(input), 2_800);
  emitCursorResponse({
    permission: 'allow',
    ...(context ? { agent_message: context } : {}),
  });
}

runCursorHook(import.meta.url, main);
