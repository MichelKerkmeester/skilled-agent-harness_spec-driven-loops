#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin Goal Injection Hook
// ───────────────────────────────────────────────────────────────────
// Devin registers project hooks in `.devin/hooks.v1.json` and delivers the
// payload on stdin with a native `session_id`. Both `SessionStart` and
// `UserPromptSubmit` accept `additionalContext` in the `hookSpecificOutput`
// envelope, so this one adapter serves both: the bound packet goal's brief on
// every turn, plus the resend reminder while the operator copy is behind.
// Devin exposes no prompt-command surface in this repository, so this runtime
// is injection-only; binding happens on a runtime whose command carries the
// session identity, and the record is shared through the same core.
//
// Every path fails open: malformed stdin, a disabled goal plugin, or any
// core error resolves to an empty object, never a block and never an error
// surfaced to the session.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { readGoalRecord, renderGoalBrief, renderResendReminder, recordTurn, isPluginDisabled } = require('../lib/goal-core.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function emit(payload) {
  process.stdout.write(JSON.stringify(payload));
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return emit({});
  }

  if (isPluginDisabled()) return emit({});

  const eventName = typeof payload?.hook_event_name === 'string' && payload.hook_event_name
    ? payload.hook_event_name
    : 'UserPromptSubmit';
  const rawCwd = payload?.cwd ?? process.env.DEVIN_PROJECT_DIR;
  const cwd = typeof rawCwd === 'string' && rawCwd.trim() ? rawCwd : process.cwd();
  const sessionId = typeof payload?.session_id === 'string' ? payload.session_id : '';
  const options = { cwd, scope: { workspace: cwd, runtime: 'devin', sessionId } };

  try {
    const goal = readGoalRecord(options);
    if (!goal || goal.status !== 'active') return emit({});
    const brief = renderGoalBrief({ goal, runtimeLabel: 'Devin', workspace: cwd });
    if (!brief) return emit({});
    recordTurn({}, options);
    // Devin has no management command either; the reminder names the CLI line
    // that records the resend for this session.
    const reminder = renderResendReminder(goal, cwd, {
      recordCommand: `node .opencode/hooks/goal/bin/goal.cjs resent --runtime devin --session ${JSON.stringify(sessionId)} --workspace ${JSON.stringify(cwd)}`,
    });
    return emit({
      hookSpecificOutput: {
        hookEventName: eventName,
        additionalContext: reminder ? `${brief}\n${reminder}` : brief,
      },
    });
  } catch {
    return emit({});
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => emit({}));
