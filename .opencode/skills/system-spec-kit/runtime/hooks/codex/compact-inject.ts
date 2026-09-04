#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex PreCompact Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under Codex CLI via `.codex/hooks.json`'s
// PreCompact event, running the compiled `dist/hooks/codex/compact-inject.js`.

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import {
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
  const input = await readCodexHookInput('PreCompact', ['session_id']);
  if (!input) {
    notifyDirectiveLifecycleBoundary({ sessionId: null, boundary: 'compact' });
    return;
  }

  runClaudeHookAdapter('compact-inject.js', input, 2_800);
}

runCodexHook(import.meta.url, main);
