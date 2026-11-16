#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Turn End Hook
// ───────────────────────────────────────────────────────────────────
// Vibe runs every registered post_agent hook at the end of a main turn, and the
// first deny skips the rest, so the three turn-end concerns share one entry: the
// completion part records its advisory first and never denies, then the
// ask-surface part may deny once with the reprompt Vibe injects as a retry, and
// last the hand-over part arms the relaunch. A failing part contributes nothing,
// malformed input prints nothing, and the hook never exits non-zero: a guard bug
// must never end a turn abnormally.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isCliEntry } from '../../shared/cli-entry.mjs';

const require = createRequire(import.meta.url);
const { readStdin } = require('../../shared/hook-adapter-shared.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const HOOK_DIR = dirname(fileURLToPath(import.meta.url));
const IS_CLI_ENTRY = isCliEntry(import.meta.url);

const COMPLETION_PART_PATH = resolve(
  HOOK_DIR,
  '../../../skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs',
);
const ASK_SURFACE_PART_URL = new URL(
  '../../ask-surface-guard/vibe/ask-surface-post-agent.mjs',
  import.meta.url,
).href;
const HANDOVER_PART_URL = new URL(
  '../../session-handover/vibe/handover-parts.mjs',
  import.meta.url,
).href;

// The completion part runs first so its advisory is written even when the
// ask-surface part denies and Vibe abandons the rest of the turn.
async function completionPart(payload) {
  const { buildCompletionPart } = require(COMPLETION_PART_PATH);
  return buildCompletionPart(payload);
}

async function askSurfacePart(payload) {
  const { buildAskSurfacePart } = await import(ASK_SURFACE_PART_URL);
  return buildAskSurfacePart(payload);
}

async function handoverPart(payload) {
  const { armHandoverTurnEnd } = await import(HANDOVER_PART_URL);
  return armHandoverTurnEnd(payload);
}

// The hand-over part runs last because the composer stops at the first deny, so a
// turn another part sends back is never armed and ended; it never denies itself.
const PARTS = [completionPart, askSurfacePart, handoverPart];

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compose the turn-end parts for one post_agent payload.
 *
 * @param {Object} payload - The parsed Vibe post_agent payload.
 * @param {{parts?: Array<Function>}} [options] - The part list, injectable for tests.
 * @returns {Promise<{decision: 'deny', reason: string}|null>} The one deny, or null.
 */
export async function composeTurnEnd(payload, { parts = PARTS } = {}) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  if (payload.hook_event_name !== 'post_agent') return null;

  for (const run of parts) {
    try {
      const result = await run(payload);
      if (result && result.decision === 'deny') return result;
    } catch {
      // A failing part contributes nothing; the other parts still land.
    }
  }
  return null;
}

async function main() {
  const stdinText = await readStdin();

  let payload;
  try {
    payload = JSON.parse(stdinText);
  } catch {
    return;
  }

  const deny = await composeTurnEnd(payload);
  if (!deny) return;

  process.exitCode = 0;
  process.stdout.write(`${JSON.stringify(deny)}\n`);
}

if (IS_CLI_ENTRY) {
  main().catch(() => {
    process.exitCode = 0;
  });
}
