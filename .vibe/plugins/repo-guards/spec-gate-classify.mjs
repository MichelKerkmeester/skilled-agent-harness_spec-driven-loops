#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: spec-gate-classify Vibe Hook
// ───────────────────────────────────────────────────────────────────
// A pre_agent hook over the runtime-neutral spec-gate core. It classifies the
// operator's prompt and persists the session's gate state, which the pre_tool
// half reads before it judges a write or edit. When the core opens the gate,
// this hook adds the deferred instruction as additional_context, so the model
// asks once at the first mutation instead of stopping on the turn that opened
// it. It never blocks: every path exits 0, and a core error is reported on
// stderr, so a guard bug never stalls a turn it could not classify.
//
// The core keys state by session id, so the payload's session_id is passed
// straight through -- the same key the pre_tool half reads. The inherited
// AI_SESSION_CHILD=1 or a parent session id in the payload marks a child
// session, which the core never holds to the spec-folder question. The core
// itself honours SYSTEM_SPEC_GATE_DISABLED, and the spec-gate hook flag
// silences this hook the same way it silences the pre_tool half.

import { allow, readPayload, runGuard, sessionDirFor, REPO_ROOT } from './lib/hook-io.mjs';
import { isHookEnabled } from '../../../.skilled/hooks/shared/hook-flags.mjs';

const CORE_PATH = '../../../.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs';

/**
 * The environment the core reads. A session is a child when either signal
 * says so: the inherited AI_SESSION_CHILD=1 that every dispatch recipe exports
 * into a headless `vibe -p` (whose payload carries no parent), or a parent
 * session id in the payload (a subagent Vibe spawned itself). Everything else,
 * including the disable switch, passes through untouched.
 * @param {object} core - The shared spec-gate core.
 * @param {object} payload - The Vibe hook payload.
 * @returns {NodeJS.ProcessEnv} A copy safe to hand to the core.
 */
function sessionEnv(core, payload) {
  const env = { ...process.env };
  const parent = payload.parent_session_id;
  if (typeof parent === 'string' && parent.trim()) env[core.CHILD_SESSION_ENV] = '1';
  return env;
}

// This hook appends context by choice. A conforming deny on pre_agent would block
// the message before the turn runs, and a strict failure blocks it too, so every
// path stays fail-open: a classifier bug must never stall a prompt it could not read.
function addContext(text) {
  process.exitCode = 0;
  process.stdout.write(`${JSON.stringify({ hook_specific_output: { additional_context: text } })}\n`);
}

async function main() {
  const payload = await readPayload();
  if (!payload || !isHookEnabled('spec-gate')) return allow();

  const prompt = typeof payload.prompt === 'string' ? payload.prompt : '';
  if (!prompt.trim()) return allow();

  const core = await import(CORE_PATH);
  const projectDir = sessionDirFor(payload.cwd);
  const sessionID = core.resolveSessionKey({ sessionId: payload.session_id });
  const env = sessionEnv(core, payload);

  const result = core.runClassifyGate({
    prompt: core.sanitizePromptForClassify(prompt),
    sessionID,
    projectDir,
    env,
    runtimeLabel: 'vibe',
  });

  // The gate is open and the core has a question for this session. The model
  // gets the deferral, never the human menu: the menu is put once, at the
  // first mutation, by the pre_tool half.
  if (!result.question) return allow();
  if (!core.shouldDeliverGate3Deferral({ sessionID, projectDir, env }).deliver) return allow();

  addContext(core.GATE_3_DEFERRED_INSTRUCTION);
  core.recordGate3NoticeDelivered({ sessionID, projectDir, env, channel: 'classify-deferral' });
  result.observe();
}

await runGuard(main, 'spec-gate-classify');
