#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Stop Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under Codex CLI via `.codex/hooks.json`'s
// Stop event, running the compiled `dist/hooks/codex/session-stop.js`.

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import {
  readCodexHookInput,
  runClaudeHookAdapter,
  runCodexHook,
} from './shared.js';

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
  const input = await readCodexHookInput('Stop', ['session_id']);
  if (!input) return;

  runClaudeHookAdapter('session-stop.js', input, 10_000);
}

runCodexHook(import.meta.url, main);
