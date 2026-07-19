#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex SessionStart Hook Adapter
// ───────────────────────────────────────────────────────────────────

import {
  emitCodexContext,
  readCodexHookInput,
  runClaudeHookAdapter,
  runCodexHook,
} from './shared.js';

async function main(): Promise<void> {
  const input = await readCodexHookInput('SessionStart', ['session_id']);
  if (!input) return;

  const context = runClaudeHookAdapter('session-prime.js', input, 2_800);
  emitCodexContext('SessionStart', context);
}

runCodexHook(import.meta.url, main);
