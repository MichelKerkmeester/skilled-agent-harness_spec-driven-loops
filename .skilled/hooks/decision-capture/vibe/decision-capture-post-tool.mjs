#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Post-Tool Decision Capture
// ───────────────────────────────────────────────────────────────────
// Append an answered question tool call to the local queue.
//
// The operator's own answer is the part of a session nothing else keeps in a
// durable form: the journal holds it behind the runtime's own envelope, and a
// retyped summary loses the exact wording. This adapter normalizes the tool
// result through the same mapper the save-time sweep uses, so the live hook and
// a later sweep write one key for one answer instead of two records. It only
// observes -- it prints nothing, so the tool result the model already has
// reaches it unchanged.
//
// FAILS OPEN -- a missing payload, a parse error, a disabled switch or a queue
// write failure exits 0 with no output, so a bug here can never break a real
// call.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import process from 'node:process';

import { isQuestionTool, vibeAnswerRecords } from '../bin/sweep-vibe.mjs';
import { appendRecords } from '../lib/capture-core.mjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';
import { readStdin } from '../../shared/hook-adapter-shared.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function done() {
  // No output + exit 0 -> pure observation, nothing for Vibe to act on.
  process.exit(0);
}

// The payload names the directory the session ran in, which is the checkout the
// queue belongs to; the hook's own cwd is the runtime's business.
function projectDirFor(payload) {
  const cwd = payload?.cwd;
  if (typeof cwd === 'string' && cwd.trim()) return cwd;
  return process.cwd();
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (!isHookEnabled('decision-capture')) return done(); // kill-switch: full no-op

  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return done(); // no/invalid payload -> fail open
  }

  if (!isQuestionTool(payload?.tool_name)) return done();

  const sessionId = payload?.session_id;
  const toolUseId = payload?.tool_call_id;
  if (typeof sessionId !== 'string' || !sessionId) return done();
  if (typeof toolUseId !== 'string' || !toolUseId) return done();

  // tool_output is already the tool result's structured content, the object the
  // runtime dumps from the question result, so the mapper reads it directly.
  const records = vibeAnswerRecords({
    toolUseId,
    toolInput: payload?.tool_input,
    toolResponse: payload?.tool_output,
    sessionId,
    source: 'hook',
    now: new Date().toISOString(),
  });

  if (records.length > 0) appendRecords(projectDirFor(payload), sessionId, records);

  return done();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => done());
