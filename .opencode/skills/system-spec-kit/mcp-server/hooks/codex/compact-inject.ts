#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex PreCompact Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under Codex CLI via `.codex/hooks.json`'s
// PreCompact event, running the compiled `dist/hooks/codex/compact-inject.js`.

import {
  readCodexHookInput,
  runClaudeHookAdapter,
  runCodexHook,
} from './shared.js';
import { notifyDirectiveLifecycleBoundary } from '../claude/directive-lifecycle-boundary.js';
import { isHookEnabled } from '../../../../../../.opencode/hooks/shared/hook-flags.mjs';

async function main(): Promise<void> {
  if (!isHookEnabled('session-lifecycle')) return undefined;
  const input = await readCodexHookInput('PreCompact', ['session_id']);
  if (!input) {
    notifyDirectiveLifecycleBoundary({ sessionId: null, boundary: 'compact' });
    return;
  }

  runClaudeHookAdapter('compact-inject.js', input, 2_800);
}

runCodexHook(import.meta.url, main);
