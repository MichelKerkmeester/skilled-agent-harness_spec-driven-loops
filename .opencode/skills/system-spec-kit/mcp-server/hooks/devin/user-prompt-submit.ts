#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin UserPromptSubmit Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: DORMANT -- see shared.ts. Not registered against a live-firing
// event under `devin -p`; ready for a future build that adds one.

import {
  emitNormalizedDevinContext,
  readDevinHookInput,
  runClaudeHookAdapter,
  runDevinHook,
} from './shared.js';

async function main(): Promise<void> {
  const input = await readDevinHookInput('UserPromptSubmit', ['prompt']);
  if (!input) return;

  const output = runClaudeHookAdapter('user-prompt-submit.js', input, 2_800);
  emitNormalizedDevinContext('UserPromptSubmit', output);
}

runDevinHook(import.meta.url, main);
