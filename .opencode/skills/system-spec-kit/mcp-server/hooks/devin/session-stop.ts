#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin Stop Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under `devin -p` with the documented top-level event
// arrays and nested matcher groups in .devin/hooks.v1.json.

import {
  readDevinHookInput,
  runClaudeHookAdapter,
  runDevinHook,
} from './shared.js';
import { isHookEnabled } from '../../../../../../.opencode/hooks/shared/hook-flags.mjs';

async function main(): Promise<void> {
  if (!isHookEnabled('session-lifecycle')) return undefined;
  const input = await readDevinHookInput('Stop', ['session_id']);
  if (!input) return;

  runClaudeHookAdapter('session-stop.js', input, 10_000);
}

runDevinHook(import.meta.url, main);
