#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Claude PostToolUse Decision Capture
// ───────────────────────────────────────────────────────────────────
// Append an answered question tool call to the local queue.
// PostToolUse(AskUserQuestion) capture for Claude Code.
//
// The operator's own answer is the part of a session nothing else keeps in a
// durable form: the transcript holds it as raw JSONL, and a retyped summary loses
// the exact wording. This adapter normalizes the tool's result into the shared
// queue so a later full-auto save can quote the exchange instead of reconstructing
// it. It only observes -- it prints nothing, so the tool result Claude already has
// reaches the model unchanged.
//
// FAILS OPEN -- a missing payload, a parse error, a disabled switch or a queue
// write failure exits 0 with no output, so a bug here can never break a real call.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import process from 'node:process';

import { appendRecords, normalizeAskUserQuestion } from '../lib/capture-core.mjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';
import { readStdin } from '../../shared/hook-adapter-shared.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function done() {
  // No output + exit 0 -> pure observation, nothing for Claude to act on.
  process.exit(0);
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

  if (String(payload?.tool_name ?? '') !== 'AskUserQuestion') return done();

  const projectDir = process.env.CLAUDE_PROJECT_DIR || payload?.cwd;
  if (!projectDir) return done(); // No known project directory -> fail open.

  const records = normalizeAskUserQuestion({
    runtime: 'claude',
    sessionId: payload?.session_id,
    toolUseId: payload?.tool_use_id,
    toolInput: payload?.tool_input,
    toolResponse: payload?.tool_response,
    source: 'hook',
    now: new Date().toISOString(),
  });

  if (records.length > 0) appendRecords(projectDir, payload?.session_id, records);

  return done();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => done());
