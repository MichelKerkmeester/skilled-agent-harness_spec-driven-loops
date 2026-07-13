#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex PreCompact Hook Adapter
// ───────────────────────────────────────────────────────────────────

import {
  readCodexHookInput,
  runClaudeHookAdapter,
  runCodexHook,
} from './shared.js';

async function main(): Promise<void> {
  const input = await readCodexHookInput('PreCompact', ['session_id']);
  if (!input) return;

  runClaudeHookAdapter('compact-inject.js', input, 2_800);
}

runCodexHook(import.meta.url, main);
