#!/usr/bin/env node
// beforeSubmitPrompt classify hook for Cursor CLI -- the Cursor sibling of the
// Codex spec-gate-classify hook. Runs the shared spec-gate core against each
// user turn: opens the session gate and surfaces the bounded Gate-3 question
// as an agent_message when the turn triggers file-mutation intent.
//
// STATUS: DORMANT, NOT WIRED. A live probe (3 separate cursor-agent -p
// dispatches including a --continue turn) confirmed `beforeSubmitPrompt`
// never fires under the installed cursor-agent CLI (2026.07.23-e383d2b) --
// there is no confirmed CLI attachment point for this hook today. This file
// exists so the mapping is ready and documented if a future cursor-agent
// build starts delivering the event; register it in .cursor/hooks.json ONLY
// after re-confirming live delivery against that build, using the same
// temporary-probe-hook methodology this file's own delivery status was
// established with. Advisory only -- no deny capability; the enforce hook
// (wired to the confirmed-firing preToolUse) is the sole deny surface. FAILS
// OPEN -- any missing payload or internal error approves silently.
'use strict';

import * as guardCore from '../../lib/spec-gate/spec-gate-core.mjs';

function approve() {
  process.stdout.write(JSON.stringify({ permission: 'allow' }));
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
  const projectDir = payload?.workspace_roots?.[0] || process.cwd();

  const result = guardCore.classifyIntent({ prompt, sessionID, projectDir, env: process.env });

  if (result.question) {
    process.stdout.write(JSON.stringify({
      permission: 'allow',
      agent_message: result.question,
    }));
    return process.exit(0);
  }

  return approve();
}

main().catch(() => approve());
