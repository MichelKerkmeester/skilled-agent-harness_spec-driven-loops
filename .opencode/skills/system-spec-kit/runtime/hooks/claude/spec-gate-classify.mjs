#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Claude UserPromptSubmit Spec Gate Classify
// ───────────────────────────────────────────────────────────────────
// STATUS: wired live via .claude/settings.json UserPromptSubmit matcher;
// surfaces the spec-folder question on a mutating turn.
//
// UserPromptSubmit classify hook for Claude Code.
//
// Runs the shared spec-gate core against each user turn: opens the session
// gate and surfaces the bounded Gate-3 question when the turn triggers
// file-mutation intent, or parses an answer to an already-open gate. This
// hook only ever emits additionalContext -- it has no deny capability; the
// enforce hook (spec-gate-enforce.mjs) is the one surface that can deny.
// FAILS OPEN -- any missing payload or internal error approves silently, so a
// bug here never blocks or corrupts the turn it observes.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import * as guardCore from '../lib/spec-gate/spec-gate-core.mjs';
import { parseJsonFailOpen, readStdin } from '../lib/hook-adapter-shared.mjs';

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function approve() {
  // No output + exit 0 -> Claude proceeds with the turn unchanged.
  process.exit(0);
}

// ───────────────────────────────────────────────────────────────────
// 3. MAIN
// ───────────────────────────────────────────────────────────────────

async function main() {
  const payload = parseJsonFailOpen(await readStdin());
  if (payload === null) return approve(); // no/invalid payload -> fail open

  const prompt = typeof payload?.prompt === 'string' ? payload.prompt : '';
  const sessionID = payload?.session_id;
  const projectDir = payload?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();

  const result = guardCore.classifyIntent({ prompt, sessionID, projectDir, env: process.env });

  if (result.question) {
    const { stateDir } = guardCore.resolveGuardPaths(projectDir);
    const lifecycleEpoch = guardCore.currentGate3LifecycleEpoch(sessionID);
    const observeArgs = {
      question: result.question,
      sessionID,
      lifecycleEpoch,
      gateState: guardCore.readGateState(stateDir, sessionID),
      env: process.env,
      emitted: true,
      runtime: 'Claude Code',
      receipt: guardCore.buildGate3ObservedReceipt(lifecycleEpoch),
    };
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: result.question,
      },
    }), () => {
      guardCore.observeGate3QuestionDelivery(observeArgs);
      process.exit(0);
    });
    return;
  }

  return approve();
}

// ───────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ───────────────────────────────────────────────────────────────────

main().catch((error) => {
  // Fail-open by contract, but a swallowed failure hides a broken hook; report it.
  process.stderr.write(`spec-gate-classify: ${error instanceof Error ? error.message : String(error)}\n`);
  approve();
});
