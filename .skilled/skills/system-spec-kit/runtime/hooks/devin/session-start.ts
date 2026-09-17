#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin SessionStart Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under `devin -p` with the documented top-level event
// arrays and nested matcher groups in .devin/hooks.v1.json.

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import {
  emitDevinContext,
  readDevinHookInput,
  runClaudeHookAdapter,
  runDevinHook,
} from './shared.js';
import { notifyDirectiveLifecycleBoundary } from '../claude/directive-lifecycle-boundary.js';

const require = createRequire(import.meta.url);

function sessionLifecycleHookEnabled(): boolean {
  try {
    const { isHookEnabled } = require(fileURLToPath(new URL('../../../../../../../.opencode/hooks/shared/hook-flags.cjs', import.meta.url)));
    return typeof isHookEnabled !== 'function' || isHookEnabled('session-lifecycle') !== false;
  } catch {
    return true;
  }
}

async function main(): Promise<void> {
  if (!sessionLifecycleHookEnabled()) return;
  const input = await readDevinHookInput('SessionStart', ['session_id']);
  if (!input) {
    notifyDirectiveLifecycleBoundary({ sessionId: null, boundary: 'startup' });
    return;
  }

  const context = runClaudeHookAdapter('session-prime.js', input, 2_800);
  emitDevinContext('SessionStart', context);
}

runDevinHook(import.meta.url, main);
