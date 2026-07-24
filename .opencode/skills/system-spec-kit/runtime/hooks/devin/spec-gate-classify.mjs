#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Devin UserPromptSubmit Spec Gate Classify                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Surface the spec-folder question on a mutating turn.            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// UserPromptSubmit classify hook for Devin CLI -- the Devin sibling of the Codex
// spec-gate-classify hook. Runs the shared spec-gate core against each user turn:
// opens the session gate and surfaces the bounded Gate-3 question as
// additionalContext when the turn triggers file-mutation intent, or parses an
// answer to an already-open gate. Advisory only -- no deny capability.
//
// STATUS: DORMANT. Live-verified 2026-07-24 against installed devin 3000.2.17:
// .devin/hooks.v1.json is never consulted under `devin -p` (confirmed via a
// real dispatched tool call, and via deliberately malformed hook JSON producing
// zero parse errors -- the file isn't even read). --agent-config's own strict
// parser separately confirms `hooks` is not a valid field there either. No
// headless attachment point for this hook exists in this build. Ready and
// fail-open by design; re-run the same probe methodology before registering
// this against a future devin build that documents -p hook support.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import * as guardCore from '../../lib/spec-gate/spec-gate-core.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function approve() {
  // No output + exit 0 -> Devin proceeds with the turn unchanged.
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
  const projectDir = payload?.cwd || process.env.DEVIN_PROJECT_DIR || process.cwd();

  const result = guardCore.classifyIntent({ prompt, sessionID, projectDir, env: process.env });

  if (result.question) {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: result.question,
      },
    }));
    return process.exit(0);
  }

  return approve();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => approve());
