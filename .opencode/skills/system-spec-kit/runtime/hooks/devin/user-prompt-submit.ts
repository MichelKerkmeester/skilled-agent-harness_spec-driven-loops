#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin UserPromptSubmit Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under `devin -p` with the documented top-level event
// arrays and nested matcher groups in .devin/hooks.v1.json.

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
