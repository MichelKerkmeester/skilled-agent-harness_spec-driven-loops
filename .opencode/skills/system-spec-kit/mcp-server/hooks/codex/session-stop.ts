#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Stop Hook Adapter
// ───────────────────────────────────────────────────────────────────

import {
  readCodexHookInput,
  runClaudeHookAdapter,
  runCodexHook,
} from './shared.js';

async function main(): Promise<void> {
  const input = await readCodexHookInput('Stop', ['session_id']);
  if (!input) return;

  runClaudeHookAdapter('session-stop.js', input, 10_000);
}

runCodexHook(import.meta.url, main);
