#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex UserPromptSubmit Hook Adapter
// ───────────────────────────────────────────────────────────────────

import {
  emitNormalizedCodexContext,
  readCodexHookInput,
  runClaudeHookAdapter,
  runCodexHook,
} from './shared.js';

async function main(): Promise<void> {
  const input = await readCodexHookInput('UserPromptSubmit', ['prompt']);
  if (!input) return;

  const output = runClaudeHookAdapter('user-prompt-submit.js', input, 2_800);
  emitNormalizedCodexContext('UserPromptSubmit', output);
}

runCodexHook(import.meta.url, main);
