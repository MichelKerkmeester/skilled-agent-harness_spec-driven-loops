#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: spec-gate Vibe Hook
// ───────────────────────────────────────────────────────────────────
// A strict pre_tool hook over the runtime-neutral spec-gate core. It refuses a
// write or edit while the session's spec-folder gate is open and unanswered,
// and annotates a shell call the core judges but never denies. Every other call
// is allowed. A core error allows and is reported on stderr, so a guard bug
// never blocks a call it could not judge.
//
// The core decides the gate from a per-session state file keyed by the session
// id, not from the tool call. A live Vibe session opens that gate at a surface
// that sees the operator's prompt: pre_agent carries the prompt text, while
// pre_tool does not. spec-gate-classify.mjs is that pass: it runs
// classifyIntent and persists `open`; this hook only reads the result. The
// payload fixtures seed the same `open` record under the gitignored runtime
// state directory, because a pre_tool-only run has no prompt to classify; run
// .vibe/plugins/repo-guards/fixtures/spec-gate/seed-state.mjs first.
//
// The shared core's deny is opt-in through SYSTEM_SPEC_GATE_ENFORCE. A
// pre_tool hook's only channel is a deny, so this hook supplies the opt-in
// when the operator has not set a value; an explicit value still decides.
// SYSTEM_SPEC_GATE_DISABLED and the spec-gate hook flags silence it.

import { allow, deny, readPayload, runGuard, sessionDirFor, toCoreCall, REPO_ROOT } from './lib/hook-io.mjs';
import { isHookEnabled } from '../../../.skilled/hooks/shared/hook-flags.mjs';

const CORE_PATH = '../../../.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs';

// Only a tool that mutates is judged. A read has no target the gate covers.
const GUARDED_TOOLS = new Set(['write', 'edit', 'bash']);

/**
 * The environment the core reads. A session is a child when either signal
 * says so: the inherited AI_SESSION_CHILD=1 that every dispatch recipe exports
 * into a headless `vibe -p` (whose payload carries no parent), or a parent
 * session id in the payload (a subagent Vibe spawned itself). A child has no
 * operator turn to answer the spec-folder question, so the core must never
 * deny it. The core's deny is opt-in, and a pre_tool hook cannot ask, so this
 * seam supplies the opt-in unless the operator chose a value. An explicit `0`
 * keeps the core advisory.
 * @param {object} core - The shared spec-gate core.
 * @param {object} payload - The Vibe hook payload.
 * @returns {NodeJS.ProcessEnv} A copy safe to hand to the core.
 */
function sessionEnv(core, payload) {
  const env = { ...process.env };
  const parent = payload.parent_session_id;
  if (typeof parent === 'string' && parent.trim()) env[core.CHILD_SESSION_ENV] = '1';
  if (env[core.ENFORCE_ENV] === undefined) env[core.ENFORCE_ENV] = '1';
  return env;
}

async function main() {
  const payload = await readPayload();
  if (!payload || !isHookEnabled('spec-gate')) return allow();

  const call = toCoreCall(payload);
  if (!GUARDED_TOOLS.has(call.tool)) return allow();

  const core = await import(CORE_PATH);
  const result = core.runEnforceGate({
    tool: call.tool,
    filePath: call.input.file_path,
    sessionID: payload.session_id,
    projectDir: sessionDirFor(payload.cwd),
    env: sessionEnv(core, payload),
    runtimeKey: 'vibe',
  });

  if (result.decision === 'deny') return deny(result.detail);
  if (result.decision === 'advise' && result.detail) {
    // Vibe ignores the context field on pre_tool; system_message is the one
    // field its runner shows, as a UI note to the operator. Nothing here can
    // reach the model, so the note is not recorded as a delivered question.
    process.stdout.write(`${JSON.stringify({ system_message: result.detail })}\n`);
    return;
  }
  return allow();
}

await runGuard(main, 'spec-gate');
