#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex PreCompact Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under Codex CLI via `.codex/hooks.json`'s
// PreCompact event, running the compiled `dist/hooks/codex/compact-inject.js`.

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
