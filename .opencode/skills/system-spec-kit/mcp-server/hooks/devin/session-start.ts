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
import { notifyDirectiveLifecycleBoundary } from '../claude/directive-lifecycle-boundary.js';
import { isHookEnabled } from '../../../../../../.opencode/hooks/shared/hook-flags.mjs';

async function main(): Promise<void> {
  if (!isHookEnabled('session-lifecycle')) return undefined;
  const input = await readDevinHookInput('SessionStart', ['session_id']);
  if (!input) {
    notifyDirectiveLifecycleBoundary({ sessionId: null, boundary: 'startup' });
    return;
  }

  const context = runClaudeHookAdapter('session-prime.js', input, 2_800);
  emitDevinContext('SessionStart', context);
}

runDevinHook(import.meta.url, main);
