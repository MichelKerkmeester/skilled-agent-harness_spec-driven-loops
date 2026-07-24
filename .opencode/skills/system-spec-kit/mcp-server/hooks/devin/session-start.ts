#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin SessionStart Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: DORMANT -- see shared.ts. Not registered against a live-firing
// event under `devin -p`; ready for a future build that adds one.

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
