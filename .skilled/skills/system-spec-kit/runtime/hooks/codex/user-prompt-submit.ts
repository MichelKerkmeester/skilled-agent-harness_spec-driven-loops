#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex UserPromptSubmit Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under Codex CLI via `.codex/hooks.json`'s
// UserPromptSubmit event, running the compiled `dist/hooks/codex/user-prompt-submit.js`.

import {
  emitNormalizedCodexContext,
  readCodexHookInput,
  runClaudeHookAdapter,
  runCodexHook,
} from './shared.js';
import { SHORT_HOST_STDIN_TIMEOUT_MS } from '../shared-stdin.js';

async function main(): Promise<void> {
  // Codex kills UserPromptSubmit hooks after 3 seconds, so the read ends early
  // enough to leave that budget to the advisor call after it.
  const input = await readCodexHookInput('UserPromptSubmit', ['prompt'], SHORT_HOST_STDIN_TIMEOUT_MS);
  if (!input) return;

  const output = runClaudeHookAdapter('user-prompt-submit.js', input, 2_800);
  emitNormalizedCodexContext('UserPromptSubmit', output);
}

runCodexHook(import.meta.url, main);
