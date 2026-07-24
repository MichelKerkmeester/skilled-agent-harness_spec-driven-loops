#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin Stop Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: DORMANT -- see ./README.md.

import {
  readDevinHookInput,
  runClaudeHookAdapter,
  runDevinHook,
} from './shared.js';

async function main(): Promise<void> {
  const input = await readDevinHookInput('Stop', ['session_id']);
  if (!input) return;

  runClaudeHookAdapter('session-stop.js', input, 10_000);
}

runDevinHook(import.meta.url, main);
