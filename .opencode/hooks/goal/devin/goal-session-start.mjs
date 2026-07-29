#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin SessionStart Goal Restore Hook
// ───────────────────────────────────────────────────────────────────
// Re-injects the active goal brief as SessionStart context so a new Devin
// session picks up an already-active shared goal without a manual re-set --
// the SessionStart counterpart to goal-inject.mjs's per-turn injection.
// Read-only against the shared goal core: never mutates goal state, never
// calls recordTurn (a session start is not a turn). Fails open on any
// missing or malformed payload, or internal error.

import goalCoreModule from '../lib/goal-core.cjs';

const { isPluginDisabled, readGoalRecord, renderGoalBrief } = goalCoreModule;

const MAX_STDIN_BYTES = 1024 * 1024;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function approve() {
  // No output + exit 0 -> Devin proceeds with no injected startup context.
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

function emitContext(eventName, context) {
  if (!nonBlankString(context)) return approve();
  process.stdout.write(`${JSON.stringify({
    hookSpecificOutput: { hookEventName: eventName, additionalContext: context },
  })}\n`);
  return process.exit(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (isPluginDisabled()) return approve();

  const payload = parsePayload(await readStdin());
  if (!payload) return approve();
  if (payload.hook_event_name !== undefined && payload.hook_event_name !== 'SessionStart') return approve();
  if (!nonBlankString(payload.session_id)) return approve();

  const cwd = resolveCwd(payload);
  const goal = readGoalRecord({ cwd });
  if (!goal || goal.status !== 'active') return approve();

  const brief = renderGoalBrief({ goal, runtimeLabel: 'Devin' });
  return emitContext('SessionStart', brief);
}

main().catch(() => approve());
