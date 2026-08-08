#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex UserPromptSubmit Spec Gate Classify
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under Codex CLI via `.codex/hooks.json`'s
// second UserPromptSubmit hook group, run directly as source.
// UserPromptSubmit classify hook for Codex CLI -- the Codex sibling of the Claude
// spec-gate-classify hook. Runs the shared spec-gate core against each user turn:
// opens the session gate and surfaces the bounded Gate-3 question as
// additionalContext when the turn triggers file-mutation intent, or parses an
// answer to an already-open gate. Advisory only -- no deny capability; the
// enforce hook is the sole deny surface. FAILS OPEN -- any missing payload or
// internal error approves silently.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import * as guardCore from '../lib/spec-gate/spec-gate-core.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function approve() {
  // No output + exit 0 -> Codex proceeds with the turn unchanged.
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return approve(); // no/invalid payload -> fail open
  }

  const prompt = typeof payload?.prompt === 'string' ? payload.prompt : '';
  const sessionID = payload?.session_id;
  const projectDir = payload?.cwd || process.env.CODEX_PROJECT_DIR || process.cwd();

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
      runtime: 'Codex',
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

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => approve());
