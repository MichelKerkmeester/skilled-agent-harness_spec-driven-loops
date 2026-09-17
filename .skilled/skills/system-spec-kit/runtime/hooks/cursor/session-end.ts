#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor SessionEnd Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: confirmed live-firing under cursor-agent 2026.07.23-e383d2b; `stop` never fires, this is the substitute.
//
// Delegates to the existing session-stop.js completion-evidence owner on
// Cursor's `sessionEnd` event, NOT `stop` — `stop` is confirmed live (phase
// 004 probe) to never fire under `cursor-agent -p`, while `sessionEnd` fires
// reliably with `reason`/`final_status` fields and a real transcript_path.
// This is a deliberate substitution, not a naming alias for the same event.

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import {
  readCursorHookInput,
  runClaudeHookAdapter,
  runCursorHook,
  toClaudeShape,
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
  const input = await readCursorHookInput('sessionEnd', ['session_id']);
  if (!input) return;

  runClaudeHookAdapter('session-stop.js', toClaudeShape(input), 10_000);
  // sessionEnd has no permission decision to make (the session is already
  // over) -- no response envelope is emitted, matching the Codex Stop
  // adapter's precedent of firing the sentinel without echoing output.
}

runCursorHook(import.meta.url, main);
