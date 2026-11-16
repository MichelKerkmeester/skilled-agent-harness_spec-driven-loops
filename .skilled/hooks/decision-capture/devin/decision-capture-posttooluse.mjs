#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin PostToolUse Decision Capture
// ───────────────────────────────────────────────────────────────────
// Queues each answered ask_user_question from Devin's PostToolUse payload. It
// reuses the Devin reader's mapping, so the live path and a later save-time
// sweep write the same key. Every failure exits 0 with no output, so the tool
// result never depends on capture.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import process from 'node:process';

import { devinAnswerRecords } from '../bin/sweep-devin.mjs';
import { appendRecords } from '../lib/capture-core.mjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';
import { readStdin } from '../../shared/hook-adapter-shared.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const QUESTION_TOOL = 'ask_user_question';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function done() {
  process.exit(0);
}

function transcriptFor(payload) {
  const toolUseId = payload.tool_use_id;
  return {
    steps: [
      {
        tool_calls: [
          {
            function_name: QUESTION_TOOL,
            tool_call_id: toolUseId,
            arguments: payload.tool_input,
          },
        ],
        observation: {
          results: [
            {
              source_call_id: toolUseId,
              content: payload.tool_response?.output,
            },
          ],
        },
      },
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (!isHookEnabled('decision-capture')) return done();

  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return done();
  }

  if (payload?.tool_name !== QUESTION_TOOL) return done();

  const sessionId = payload?.session_id;
  const toolUseId = payload?.tool_use_id;
  if (typeof sessionId !== 'string' || !sessionId) return done();
  if (typeof toolUseId !== 'string' || !toolUseId) return done();

  const payloadCwd = payload?.cwd;
  const projectDir = typeof payloadCwd === 'string' && payloadCwd.trim()
    ? payloadCwd
    : (process.env.DEVIN_PROJECT_DIR || process.cwd());

  const records = devinAnswerRecords({
    transcript: transcriptFor(payload),
    sessionId,
    now: new Date().toISOString(),
  }).map((record) => ({ ...record, source: 'hook' }));

  if (records.length > 0) appendRecords(projectDir, sessionId, records);

  return done();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

// Capture failures must not change the completed tool result or add host output.
main().catch(() => done());
