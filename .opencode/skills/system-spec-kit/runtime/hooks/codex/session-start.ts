#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex SessionStart Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under Codex CLI via `.codex/hooks.json`'s
// SessionStart event, running the compiled `dist/hooks/codex/session-start.js`.

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import {
  emitCodexContext,
  readCodexHookInput,
  runClaudeHookAdapter,
  runCodexHook,
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
  const input = await readCodexHookInput('SessionStart', ['session_id']);
  if (!input) {
    notifyDirectiveLifecycleBoundary({ sessionId: null, boundary: 'startup' });
    return;
  }

  const context = runClaudeHookAdapter('session-prime.js', input, 2_800);
  emitCodexContext('SessionStart', context);
}

runCodexHook(import.meta.url, main);
