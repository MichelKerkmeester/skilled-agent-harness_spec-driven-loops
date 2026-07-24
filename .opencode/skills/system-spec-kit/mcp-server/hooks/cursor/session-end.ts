#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor SessionEnd Hook Adapter
// ───────────────────────────────────────────────────────────────────
//
// Delegates to the existing session-stop.js completion-evidence owner on
// Cursor's `sessionEnd` event, NOT `stop` — `stop` is confirmed live (phase
// 004 probe) to never fire under `cursor-agent -p`, while `sessionEnd` fires
// reliably with `reason`/`final_status` fields and a real transcript_path.
// This is a deliberate substitution, not a naming alias for the same event.

import {
  readCursorHookInput,
  runClaudeHookAdapter,
  runCursorHook,
  toClaudeShape,
} from './shared.js';

async function main(): Promise<void> {
  const input = await readCursorHookInput('sessionEnd', ['session_id']);
  if (!input) return;

  runClaudeHookAdapter('session-stop.js', toClaudeShape(input), 10_000);
  // sessionEnd has no permission decision to make (the session is already
  // over) -- no response envelope is emitted, matching the Codex Stop
  // adapter's precedent of firing the sentinel without echoing output.
}

runCursorHook(import.meta.url, main);
