#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin UserPromptSubmit Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: LIVE. Verified firing 2026-07-24 against devin 3000.2.17 under
// `devin -p`: SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, Stop and
// SessionEnd all fire, and the real adapters' output reaches the model. An
// earlier revision of this file claimed the hook system was dormant; that was a
// registration-schema bug in .devin/hooks.v1.json (events must be top-level with
// nested {matcher, hooks:[...]} entries), not a limitation of the CLI.

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
