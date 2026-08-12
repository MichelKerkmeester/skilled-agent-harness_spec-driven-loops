#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor UserPromptSubmit Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: registered for parity, delivery unconfirmed -- beforeSubmitPrompt has not fired under the tested CLI build.
//
// REGISTERED FOR PARITY, DELIVERY UNCONFIRMED AS OF THIS PASS. Prior live-fire
// research (3 separate `cursor-agent -p` dispatches including a --continue
// turn) found `beforeSubmitPrompt` never firing under the installed CLI build
// -- the sibling spec-gate-classify.mjs entry was registered on this same
// event under that same precedent ("register... ONLY after re-confirming
// live delivery" is the wiring bar, not the authoring bar). This pass
// re-tests delivery live (see the phase's own live-fire section); until
// reconfirmed, treat this adapter as dormant like its sibling.
//
// Two deliberate deviations from the session-start.ts template this file
// otherwise copies:
//
// 1. toClaudeShape() alone omits `prompt`, and the target shim
//    (user-prompt-submit.js -> system-skill-advisor's advisor brief builder)
//    fails open to `{}` with NO advisory content whenever `input.prompt` is
//    missing (see system-skill-advisor/hooks/claude/user-prompt-submit.ts
//    normalizePrompt()). Wiring this with toClaudeShape() verbatim would
//    compile and run but never actually produce an advisor brief -- a
//    silently-dead wire, not a working one. The payload below adds `prompt`
//    explicitly so the advisor logic has something to classify.
// 2. session-prime.js (session-start.ts's target) prints plain text, so
//    session-start.ts uses its raw stdout directly as agent_message.
//    user-prompt-submit.js instead prints a JSON `{hookSpecificOutput:
//    {additionalContext}}` envelope (see its own writeHookOutput()) --
//    treating that raw JSON string as agent_message verbatim would surface
//    the literal envelope text to the model instead of the brief inside it.
//    emitNormalizedCursorResponse() already exists in shared.ts for exactly
//    this unwrap, so this adapter uses it instead of the direct-string path.

import {
  emitCursorResponse,
  emitNormalizedCursorResponse,
  readCursorHookInput,
  runClaudeHookAdapter,
  runCursorHook,
  toClaudeShape,
} from './shared.js';
import { isHookEnabled } from '../../../../../../.opencode/hooks/shared/hook-flags.mjs';

async function main(): Promise<void> {
  if (!isHookEnabled('skill-advisor')) return emitCursorResponse(null);
  const input = await readCursorHookInput('beforeSubmitPrompt', ['session_id']);
  if (!input) return emitCursorResponse(null);

  const payload = { ...toClaudeShape(input), prompt: input.prompt };
  const rawOutput = runClaudeHookAdapter('user-prompt-submit.js', payload, 2_800);
  emitNormalizedCursorResponse(rawOutput);
}

runCursorHook(import.meta.url, main);
