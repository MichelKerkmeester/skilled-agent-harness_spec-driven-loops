#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor SessionStart Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: confirmed live-firing under cursor-agent 2026.07.23-e383d2b; primes context via session-prime.js.

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import {
  emitCursorResponse,
  readCursorHookInput,
  runClaudeHookAdapter,
  runCursorHook,
  toClaudeShape,
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
  const input = await readCursorHookInput('sessionStart', ['session_id']);
  if (!input) {
    notifyDirectiveLifecycleBoundary({ sessionId: null, boundary: 'startup' });
    return emitCursorResponse(null);
  }

  const context = runClaudeHookAdapter('session-prime.js', toClaudeShape(input), 2_800);
  emitCursorResponse({
    permission: 'allow',
    ...(context ? { agent_message: context } : {}),
  });
}

runCursorHook(import.meta.url, main);
