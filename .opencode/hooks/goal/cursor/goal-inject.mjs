#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor SessionStart Goal Injection Hook
// ───────────────────────────────────────────────────────────────────
// STATUS: injection-only, sessionStart-once — live capability probes found
// no model-visible mid-session refresh surface for this runtime. preToolUse's
// agent_message field is returned in Cursor's JSON response but confirmed
// NOT spliced into the model-visible transcript (zero occurrences of a
// live probe marker in the raw agent-transcript JSONL), so there is no
// mid-session refresh surface. `stop` never fires under the tested CLI
// build, so no verify/continue mechanism exists either. sessionStart is
// therefore the only adapter this runtime gets.
//
// Model-visibility honesty: sessionStart's agent_message reaching the
// model is RECORDED-EVIDENCE, not a proven end-to-end guarantee. The hook
// fires and Cursor's response envelope carries the field, but a prior
// live test found the dispatched model self-reported no awareness of
// injected sessionStart content — and self-report is not a reliable
// oracle for what the model actually saw. Treat this adapter as
// "delivers the brief into Cursor's response envelope," nothing stronger.
//
// Cursor's hooks.json is the SAME file the editor reads, not a CLI-private
// config — registering here fires for editor sessions on this repo too,
// not only dispatched `cursor-agent` runs. Every path below fails open
// unconditionally: malformed/missing stdin, a disabled goal plugin, or any
// goal-core read/render error all resolve to a plain permission-allow
// no-op, never a block and never an error surfaced to the session.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { readGoalRecord, renderGoalBrief, recordTurn, isPluginDisabled } = require('../lib/goal-core.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function allow(extra) {
  process.stdout.write(JSON.stringify({ permission: 'allow', ...(extra || {}) }));
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
    return allow(); // no/invalid payload -> fail open, nothing to inject
  }

  if (isPluginDisabled()) return allow();

  const workspaceRoot = payload?.workspace_roots?.[0];
  const cwd = typeof workspaceRoot === 'string' && workspaceRoot.trim() ? workspaceRoot : process.cwd();
  const rawSessionId = payload?.session_id ?? payload?.conversation_id;
  const sessionId = typeof rawSessionId === 'string' ? rawSessionId : '';
  const options = {
    cwd,
    scope: { workspace: cwd, runtime: 'cursor', sessionId },
  };

  try {
    const goal = readGoalRecord(options);
    if (!goal || goal.status !== 'active') return allow();

    const brief = renderGoalBrief({ goal, runtimeLabel: 'Cursor' });
    if (!brief) return allow();

    recordTurn({}, options);
    return allow({ agent_message: brief });
  } catch {
    return allow(); // any goal-core error -> fail open, no injection
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => allow());
