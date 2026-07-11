#!/usr/bin/env node
// UserPromptSubmit classify hook for Claude Code.
//
// Runs the shared spec-gate core against each user turn: opens the session
// gate and surfaces the bounded Gate-3 question when the turn triggers
// file-mutation intent, or parses an answer to an already-open gate. This
// hook only ever emits additionalContext -- it has no deny capability; the
// enforce hook (spec-gate-enforce.mjs) is the one surface that can deny.
// FAILS OPEN -- any missing payload or internal error approves silently, so a
// bug here never blocks or corrupts the turn it observes.
'use strict';

import * as guardCore from '../../lib/spec-gate/spec-gate-core.mjs';

function approve() {
  // No output + exit 0 -> Claude proceeds with the turn unchanged.
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return approve(); // no/invalid payload -> fail open
  }

  const prompt = typeof payload?.prompt === 'string' ? payload.prompt : '';
  const sessionID = payload?.session_id;
  const projectDir = payload?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();

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

main().catch(() => approve());
