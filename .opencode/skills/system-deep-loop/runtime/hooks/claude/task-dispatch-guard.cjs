#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Claude PreToolUse Task Dispatch Guard
// ───────────────────────────────────────────────────────────────────
// STATUS: wired live via .claude/settings.json PreToolUse Task matcher;
// rejects a deep-loop mode mismatch before the dispatch runs.
//
// PreToolUse(Task) deep-loop dispatch guard for Claude Code.
//
// Claude's counterpart to the mk-deep-loop-guard OpenCode plugin: it intercepts a
// Task tool call BEFORE it dispatches and evaluates the same runtime-neutral policy
// (Deep Route mode mismatch + loop-like repeated hand-offs to command-owned loop
// executors) through the shared dispatch-guard core. A policy denial emits Claude's
// PreToolUse deny form; a warning appends to the SAME bounded state-dir log both
// runtimes share and surfaces an advisory via additionalContext without overriding
// the permission decision. FAILS OPEN -- any missing payload or internal error
// approves silently, so a bug here never blocks unrelated, correctly-routed work.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const guardCore = require('../../lib/deep-loop/dispatch-guard.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function approve() {
  // No output + exit 0 -> defer to the normal permission flow.
  process.exit(0);
}

// A `||` chain picks the first truthy VALUE, not the first valid string -- a
// truthy non-string in an earlier field would suppress a valid string in a
// later one and still resolve to undefined. This picks the first field that
// is actually a non-blank string, confirmed-canonical field first, so a
// partial/malformed payload never silently masks a real alias. Cursor's own
// task-dispatch-guard.mjs forwards its payload into this file unchanged, so
// this fix covers both runtimes.
function firstNonBlankString(...candidates) {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) return candidate;
  }
  return undefined;
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
    return approve(); // no/invalid payload -> fail open
  }

  // Normalize tool-name case: Claude emits 'Task', OpenCode 'task'.
  if (String(payload?.tool_name || '').toLowerCase() !== 'task') return approve();

  const toolInput = payload?.tool_input || {};
  const projectDir = payload?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();

  const result = guardCore.evaluateDispatch({
    subagentType: firstNonBlankString(toolInput.subagent_type, toolInput.subagentType),
    prompt: toolInput.prompt,
    sessionID: payload?.session_id,
    projectDir,
    env: process.env,
  });

  const { stateDir } = guardCore.resolveGuardPaths(projectDir);
  for (const audit of result.audits || []) guardCore.appendRejectModeDegradedAudit(stateDir, audit);
  for (const warning of result.warnings || []) guardCore.appendWarningLog(stateDir, warning);

  if (result.decision === 'reject') {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: result.detail,
      },
    }));
    return process.exit(0);
  }

  if (result.warnings && result.warnings.length > 0) {
    // Warn-only: surface the advisory without overriding the permission decision.
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        additionalContext: result.warnings.join('\n'),
      },
    }));
    return process.exit(0);
  }

  return approve();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => approve());
