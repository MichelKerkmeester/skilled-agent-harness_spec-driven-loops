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
import { isHookEnabled } from '../../../../../../.opencode/hooks/shared/hook-flags.mjs';

async function main(): Promise<void> {
  if (!isHookEnabled('skill-advisor')) return undefined;
  const input = await readCodexHookInput('UserPromptSubmit', ['prompt']);
  if (!input) return;

  const output = runClaudeHookAdapter('user-prompt-submit.js', input, 2_800);
  emitNormalizedCodexContext('UserPromptSubmit', output);
}

runCodexHook(import.meta.url, main);
