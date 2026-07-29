#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin Stop Goal Verify/Continue Hook
// ───────────────────────────────────────────────────────────────────
// Runs the shared heuristic verifier (goal-core.cjs's verifyGoalHeuristic)
// against the active goal at Stop time. When the verdict is not-met and
// iteration budget remains, returns Devin's confirmed Stop continuation
// contract -- a bare {"decision":"block","reason":"..."} on stdout, at the
// top level (not nested in hookSpecificOutput), mirroring Claude Code's own
// Stop contract. This shape is not a guess: a live capability probe returned
// exactly this envelope and a real Devin session transcript showed the
// `reason` text injected verbatim as a synthetic user turn, with the agent
// producing a genuine new turn in response.
//
// Honors `stop_hook_active` as the loop guard (same field/semantics Claude
// Code uses) so a forced continuation's own Stop firing is never blocked
// again. Fails open on any missing/malformed payload or internal error: a
// goal-hook bug must never force an unwanted continuation, nor block a
// genuine stop.

import { readFileSync } from 'node:fs';
import goalCoreModule from '../lib/goal-core.cjs';

const {
  isPluginDisabled, readGoalRecord, verifyGoalHeuristic, recordTurn, sanitizeInlineText,
} = goalCoreModule;

const MAX_STDIN_BYTES = 1024 * 1024;
// Sane loop cap when the goal record carries no explicit maxAutoTurns: caps
// forced Stop continuations even if turnsUsed otherwise never advances.
const DEFAULT_MAX_AUTO_TURNS = 20;
const MAX_REASON_CHARS = 600;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function approve() {
  // No output + exit 0 -> the Stop event finishes normally (real stop).
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  let total = 0;
  for await (const chunk of process.stdin) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.length;
    if (total > MAX_STDIN_BYTES) {
      process.stdin.destroy();
      return '';
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function parsePayload(raw) {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function nonBlankString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function resolveCwd(payload) {
  const raw = nonBlankString(payload.cwd) ? payload.cwd.trim() : '';
  return raw || process.env.DEVIN_PROJECT_DIR || process.cwd();
}

// Devin's hook input type declares `last_assistant_message`, but real Devin
// Stop payloads observed in this repo omit it -- only Claude's Stop hook
// actually sends it. Prefer it when present (in case a newer Devin build adds
// it), else fall back to reading the `transcript_path` file directly: its
// schema is `{schema_version, session_id, agent, steps, final_metrics}` with
// each step carrying `source`/`message`, so the last agent turn's text is
// recoverable there.
function lastAgentMessageFromTranscript(transcriptPath) {
  try {
    const parsed = JSON.parse(readFileSync(transcriptPath, 'utf8'));
    const steps = Array.isArray(parsed?.steps) ? parsed.steps : [];
    for (let index = steps.length - 1; index >= 0; index -= 1) {
      const step = steps[index];
      if (step && step.source === 'agent' && nonBlankString(step.message)) return step.message;
    }
    return '';
  } catch {
    return '';
  }
}

function transcriptTextFrom(payload) {
  if (nonBlankString(payload.last_assistant_message)) return payload.last_assistant_message;
  if (nonBlankString(payload.transcript_path)) return lastAgentMessageFromTranscript(payload.transcript_path);
  return '';
}

function emitBlock(reason) {
  process.stdout.write(`${JSON.stringify({ decision: 'block', reason })}\n`);
  return process.exit(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (isPluginDisabled()) return approve();

  const payload = parsePayload(await readStdin());
  if (!payload) return approve();
  if (payload.hook_event_name !== undefined && payload.hook_event_name !== 'Stop') return approve();
  if (!nonBlankString(payload.session_id)) return approve();
  if (payload.stop_hook_active === true) return approve();

  const cwd = resolveCwd(payload);
  const goal = readGoalRecord({ cwd });
  if (!goal || goal.status !== 'active') return approve();

  const transcriptText = transcriptTextFrom(payload);
  const result = verifyGoalHeuristic({ goal, transcriptText });
  if (result.verdict !== 'not-met') return approve();

  const cap = Number.isFinite(goal.maxAutoTurns) && goal.maxAutoTurns > 0
    ? Math.trunc(goal.maxAutoTurns)
    : DEFAULT_MAX_AUTO_TURNS;
  const turnsUsed = Number.isFinite(goal.turnsUsed) ? goal.turnsUsed : 0;
  if (turnsUsed >= cap) return approve();

  // Charge this forced continuation against the same shared iteration
  // counter goal-inject.mjs advances, so the budget check above stays
  // meaningful across both real user turns and Stop-forced continuations.
  recordTurn({ runtime: 'devin' }, { cwd });

  const reason = sanitizeInlineText(
    `Goal not yet met (${result.reason}). Continue toward: ${goal.objective}`,
    MAX_REASON_CHARS,
  );
  return emitBlock(reason);
}

main().catch(() => approve());
