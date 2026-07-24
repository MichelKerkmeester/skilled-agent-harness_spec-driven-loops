#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Devin PreToolUse Subagent Dispatch Guard                      ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Reject a deep-loop mode mismatch before the dispatch runs.      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// PreToolUse(run_subagent) deep-loop dispatch guard for Devin CLI -- a deliberate
// divergence from the Codex precedent, not a port. Codex folds this concern into
// its exec-shape recognizer because Codex has no native subagent-dispatch tool.
// Devin's `run_subagent` is a real, first-class dispatch tool (confirmed via
// the live CLI contract pin), so it gets a real adapter, mirroring Claude's Task
// hook instead: intercepts a run_subagent call BEFORE it dispatches and evaluates
// the same runtime-neutral policy (Deep Route mode mismatch + loop-like repeated
// hand-offs to command-owned loop executors) through the shared dispatch-guard
// core. FAILS OPEN -- any missing payload or internal error approves silently.
// STATUS: LIVE. Verified firing 2026-07-24 against devin 3000.2.17 under
// `devin -p`: SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, Stop and
// SessionEnd all fire, and the real adapters' output reaches the model. An
// earlier revision of this file claimed the hook system was dormant; that was a
// registration-schema bug in .devin/hooks.v1.json (events must be top-level with
// nested {matcher, hooks:[...]} entries), not a limitation of the CLI.
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

  if (String(payload?.tool_name || '').toLowerCase() !== 'run_subagent') return approve();

  const toolInput = payload?.tool_input || {};
  const projectDir = payload?.cwd || process.env.DEVIN_PROJECT_DIR || process.cwd();

  const result = guardCore.evaluateDispatch({
    subagentType: toolInput.subagent_type || toolInput.subagentType || toolInput.agent_type || toolInput.agentType,
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
