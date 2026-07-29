#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin UserPromptSubmit Goal Inject Hook
// ───────────────────────────────────────────────────────────────────
// Reads the shared cross-runtime goal state (.opencode/hooks/goal/lib/
// goal-core.cjs) and, when a goal is active, injects the rendered
// [active_goal] steering block as additionalContext on every Devin user
// turn. Records the turn against the shared goal record so the injected
// usage/iteration accounting stays live. Fails open on any missing or
// malformed payload, or internal error: a goal-hook bug must never block
// a Devin turn.

import goalCoreModule from '../lib/goal-core.cjs';

const { isPluginDisabled, readGoalRecord, renderGoalBrief, recordTurn } = goalCoreModule;

const MAX_STDIN_BYTES = 1024 * 1024;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function approve() {
  // No output + exit 0 -> Devin proceeds with no injected context.
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
  if (payload.hook_event_name !== undefined && payload.hook_event_name !== 'UserPromptSubmit') return approve();
  if (!nonBlankString(payload.prompt)) return approve();

  const cwd = resolveCwd(payload);
  const goal = readGoalRecord({ cwd });
  if (!goal || goal.status !== 'active') return approve();

  // Every genuine user turn against an active goal counts toward the shared
  // iteration/usage accounting rendered in the brief's `usage:` line.
  recordTurn({ runtime: 'devin' }, { cwd });

  const brief = renderGoalBrief({ goal, runtimeLabel: 'Devin' });
  return emitContext('UserPromptSubmit', brief);
}

main().catch(() => approve());
