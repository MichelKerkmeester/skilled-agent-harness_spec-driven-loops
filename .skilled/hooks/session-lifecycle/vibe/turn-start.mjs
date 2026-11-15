#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Turn Start Hook
// ───────────────────────────────────────────────────────────────────
// Vibe delivers one JSON payload on stdin at pre_agent and reads one optional
// additional_context line back. This hook composes the turn-start parts in a
// fixed order, each in its own try/catch, so one failing part contributes
// nothing and the rest still land. The pending completion advisory is delivered
// first, then the compaction context a new journal entry re-arms, then the
// advisor brief, then the save reminder a new operator answer raises; later
// turn-start concerns join this list rather than registering their own pre_agent
// entry, which keeps the order fixed here instead of by hook registration order.
// It never blocks and never exits
// non-zero: malformed input or a failing part contributes nothing, and an
// empty result prints nothing at all.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { takeNudge } from '../../decision-capture/lib/capture-core.mjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';
import { buildAdvisorPart } from '../../../skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs';
import { buildCompactionPart } from './compaction-context.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

// The completion part runs at turn end and leaves its advisory here; this
// composer consumes it on the next turn. Both resolve the file from the
// session's own project root, so a scratch run cannot deliver another
// session's advisory.
const PENDING_ADVISORY_RELATIVE_PATH = '.skilled/skills/.state/completion-sentinel/vibe-pending-advisory.txt';
const DEFAULT_PROJECT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const HANDOVER_PART_URL = new URL(
  '../../session-handover/vibe/handover-parts.mjs',
  import.meta.url,
).href;

function pendingCompletionAdvisoryPart(payload) {
  if (isHookEnabled('completion') === false) return '';
  const projectDir = typeof payload.cwd === 'string' && payload.cwd ? payload.cwd : DEFAULT_PROJECT_DIR;
  const target = join(projectDir, PENDING_ADVISORY_RELATIVE_PATH);

  let detail;
  try {
    detail = readFileSync(target, 'utf8').trim();
  } catch {
    return '';
  }
  // The advisory is delivered once per file. A file that cannot be removed
  // would ride every later turn, so it is dropped rather than repeated.
  try {
    unlinkSync(target);
  } catch {
    return '';
  }
  return detail ? `[completion-evidence] ${detail}` : '';
}

// An answer only reaches a decision record through a save, so a new pending
// answer deserves one reminder rather than a silently growing backlog. The
// counter reports a session's pending count once per rise, so the next turn at
// the same count adds nothing and a save that drains the queue starts over.
export function buildSaveNudgePart(payload, { core = { takeNudge } } = {}) {
  if (isHookEnabled('decision-capture') === false) return '';
  const sessionId = typeof payload.session_id === 'string' ? payload.session_id.trim() : '';
  if (!sessionId) return '';

  const projectDir = typeof payload.cwd === 'string' && payload.cwd ? payload.cwd : DEFAULT_PROJECT_DIR;
  const count = core.takeNudge(projectDir, sessionId);
  if (!Number.isInteger(count) || count <= 0) return '';
  return `[decision-capture] ${count} operator answer(s) captured this session are not in a decision record yet. Run /speckit:save to record them.`;
}

// The hand-over module is imported when its part runs, so a load error costs that
// one part and the parts before it still land.
async function handoverPart(payload) {
  const { buildHandoverContextPart } = await import(HANDOVER_PART_URL);
  return buildHandoverContextPart(payload);
}

const PARTS = [
  (payload) => pendingCompletionAdvisoryPart(payload),
  // The compaction part runs before the advisor part, so the receipt it
  // re-arms is already advanced when the advisor decides what to deliver.
  (payload) => buildCompactionPart(payload),
  (payload) => buildAdvisorPart(payload),
  (payload) => buildSaveNudgePart(payload),
  // The hand-over part runs last, so its claim or nudge text ends the context.
  handoverPart,
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function readStdin() {
  process.stdin.setEncoding('utf8');
  let text = '';
  for await (const chunk of process.stdin) text += chunk;
  return text;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compose the turn-start context for one pre_agent payload.
 *
 * @param {Object} payload - The parsed Vibe pre_agent payload.
 * @param {{parts?: Array<Function>}} [options] - The part list, injectable for tests.
 * @returns {Promise<string>} The joined parts, or an empty string.
 */
export async function composeTurnStart(payload, { parts = PARTS } = {}) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return '';
  if (payload.hook_event_name !== 'pre_agent') return '';

  const texts = [];
  for (const build of parts) {
    try {
      const text = String(await build(payload) ?? '').trim();
      if (text) texts.push(text);
    } catch {
      // A failing part contributes nothing; the other parts still land.
    }
  }
  return texts.join('\n\n');
}

async function main() {
  const stdinText = await readStdin();

  let payload;
  try {
    payload = JSON.parse(stdinText);
  } catch {
    return;
  }

  const text = await composeTurnStart(payload);
  if (!text) return;

  process.exitCode = 0;
  process.stdout.write(`${JSON.stringify({ hook_specific_output: { additional_context: text } })}\n`);
}

if (IS_CLI_ENTRY) {
  main().catch(() => {
    process.exitCode = 0;
  });
}
