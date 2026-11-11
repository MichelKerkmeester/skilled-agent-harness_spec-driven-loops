#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Command-Hook env-secret-guard Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: wired through hook-registry.json as a PreToolUse and a PostToolUse
// hook for Claude Code, Codex and Devin, and as preToolUse and postToolUse for
// Cursor.
//
// One file serves the four runtimes that run a hook as a command reading the
// tool call as JSON on stdin. Claude, Codex and Devin take the PreToolUse deny
// envelope. Cursor marks its payload with workspace_roots and takes its own
// permission envelope. Before a shell call it also records the project's
// dotenv files; after the call it undoes a dotenv write and reports a dotenv
// value in the output. The policy lives in the shared core. FAILS OPEN: a
// payload that cannot be read, or an internal error, allows the call, so a
// guard bug can never stop an agent from working.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const guardCore = require('../lib/env-secret-guard.cjs');
const guardWatch = require('../lib/env-secret-watch.cjs');
const { parseJsonFailOpen, readStdin } = require('../../shared/hook-adapter-shared.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Cursor names its events in camelCase and carries conversation_id, and some
// builds leave out workspace_roots, so any one marker is enough. The other
// three runtimes send `PreToolUse`, which rules Cursor out whatever else the
// payload carries.
function isCursor(payload) {
  const event = payload?.hook_event_name;
  if (event === 'PreToolUse' || event === 'PostToolUse') return false;
  return event === 'preToolUse'
    || event === 'postToolUse'
    || Array.isArray(payload?.workspace_roots)
    || typeof payload?.conversation_id === 'string';
}

function allow(payload) {
  // Cursor expects an explicit answer; the other runtimes defer to their
  // normal permission flow on no output and exit 0.
  if (isCursor(payload)) process.stdout.write(JSON.stringify({ permission: 'allow' }));
  process.exit(0);
}

function deny(payload, reason) {
  if (isCursor(payload)) {
    process.stdout.write(JSON.stringify({ permission: 'deny', user_message: reason, agent_message: reason }));
    process.exit(2);
  }
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason },
  }));
  process.exit(0);
}

// After a call nothing can be refused any more, so the notice travels as
// context the runtime shows the model.
function notify(payload, message) {
  if (isCursor(payload)) {
    process.stdout.write(JSON.stringify({ permission: 'allow', agent_message: message }));
  } else {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: message },
    }));
  }
  process.exit(0);
}

function isAfterCall(payload) {
  return /^posttooluse$/i.test(String(payload?.hook_event_name || ''));
}

function sessionDir(payload) {
  const cursorRoot = payload?.workspace_roots?.[0];
  if (typeof payload?.cwd === 'string' && payload.cwd.trim()) return payload.cwd;
  if (typeof cursorRoot === 'string' && cursorRoot.trim()) return cursorRoot;
  const { CLAUDE_PROJECT_DIR, CODEX_PROJECT_DIR, DEVIN_PROJECT_DIR } = process.env;
  return CLAUDE_PROJECT_DIR || CODEX_PROJECT_DIR || DEVIN_PROJECT_DIR || process.cwd();
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const payload = parseJsonFailOpen(await readStdin());
  if (payload === null || !guardCore.isGuardEnabled()) return allow(payload);
  const tool = payload?.tool_name;
  const cwd = sessionDir(payload);
  if (isAfterCall(payload)) {
    const output = payload?.tool_response ?? payload?.tool_output;
    const review = guardWatch.reviewToolResult({ tool, output, cwd });
    return review.message ? notify(payload, review.message) : allow(payload);
  }
  const result = guardCore.evaluateToolCall({ tool, input: payload?.tool_input, cwd });
  if (result.decision === 'deny') return deny(payload, result.reason);
  if (guardCore.SHELL_TOOLS.has(String(tool || '').toLowerCase())) {
    try {
      guardWatch.snapshotDotenv(cwd);
    } catch {
      // No record means the after-call check reports nothing; the call still runs.
    }
  }
  return allow(payload);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch((error) => {
  process.stderr.write(`env-secret-guard: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(0);
});
