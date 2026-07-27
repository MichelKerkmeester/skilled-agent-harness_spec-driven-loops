#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin SessionStart Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under `devin -p` with the documented top-level event
// arrays and nested matcher groups in .devin/hooks.v1.json.

import {
  emitDevinContext,
  readDevinHookInput,
  runClaudeHookAdapter,
  runDevinHook,
} from './shared.js';

async function main(): Promise<void> {
  const input = await readDevinHookInput('SessionStart', ['session_id']);
  if (!input) return;

  const context = runClaudeHookAdapter('session-prime.js', input, 2_800);
  emitDevinContext('SessionStart', context);
}

runDevinHook(import.meta.url, main);
