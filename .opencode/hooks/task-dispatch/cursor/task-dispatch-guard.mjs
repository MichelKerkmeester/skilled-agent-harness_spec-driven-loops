#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor preToolUse Task Dispatch Guard
// ───────────────────────────────────────────────────────────────────
// STATUS: confirmed live-firing under cursor-agent 2026.07.23-e383d2b for Task tool calls; advisory/deny per shared core.
// Cursor's counterpart to Claude's task-dispatch-guard.cjs. Wired under a SEPARATE
// preToolUse array entry with `"matcher": "Task"` (a confirmed hooks.json
// schema field -- hook-contract.md §2) so it runs alongside, not instead of,
// the existing unmatched spec-gate-enforce.mjs entry that already covers
// every tool call.
//
// Confirmed live via a temporary probe-hook dispatch against cursor-agent
// 2026.07.23-e383d2b (isolated repo, custom .cursor/hooks.json wiring
// preToolUse to a logging probe, dispatched with a subagent-delegation
// prompt): a Task tool call emits `tool_name: "Task"`,
// `tool_input: {description, prompt, model, subagent_type}` -- a shape the
// existing Claude guard core already reads via `subagent_type`/
// `subagentType` (task-dispatch-guard.cjs), so this proxy forwards the
// payload as-is with no field renaming.
//
// Deliberately NOT a thin proxy through shared.ts's runClaudeHookAdapter():
// task-dispatch-guard.cjs lives under system-deep-loop/runtime/hooks/claude/,
// outside mcp-server/hooks/claude/, so runClaudeHookAdapter's
// `../claude/<filename>` resolution does not reach it. Spawns it directly by
// its known repo-relative path instead, mirroring spec-gate-enforce.mjs's
// plain-.mjs style. FAILS OPEN -- any missing payload, spawn error, or
// internal error approves silently, so a bug here never blocks a
// correctly-scoped Task dispatch.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const GUARD_SCRIPT_RELATIVE = '.opencode/hooks/task-dispatch/claude/task-dispatch-guard.cjs';
const CHILD_TIMEOUT_MS = 5_000;
const MAX_STDIO_BYTES = 1024 * 1024;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function approve(agentMessage) {
  process.stdout.write(JSON.stringify({
    permission: 'allow',
    ...(agentMessage ? { agent_message: agentMessage } : {}),
  }));
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return approve();
  }

  if (String(payload?.tool_name || '') !== 'Task') return approve();

  const projectDir = payload?.workspace_roots?.[0] || process.cwd();
  const guardPayload = {
    tool_name: 'Task',
    tool_input: payload?.tool_input || {},
    session_id: payload?.session_id,
    cwd: projectDir,
  };

  let rawOutput = null;
  try {
    const result = spawnSync(process.execPath, [join(projectDir, GUARD_SCRIPT_RELATIVE)], {
      cwd: projectDir,
      input: JSON.stringify(guardPayload),
      encoding: 'utf8',
      env: process.env,
      timeout: CHILD_TIMEOUT_MS,
      maxBuffer: MAX_STDIO_BYTES,
      killSignal: 'SIGKILL',
    });
    if (!result.error) rawOutput = typeof result.stdout === 'string' ? result.stdout.trim() : null;
  } catch {
    rawOutput = null;
  }

  if (!rawOutput) return approve();

  // task-dispatch-guard.cjs emits Claude's hookSpecificOutput envelope
  // (permissionDecision: 'deny' + permissionDecisionReason, OR
  // additionalContext for a warn-only advisory) -- translate both cases into
  // Cursor's permission envelope. Never treat plain/non-JSON output as deny.
  try {
    const parsed = JSON.parse(rawOutput);
    const hookOutput = parsed?.hookSpecificOutput;
    if (hookOutput?.permissionDecision === 'deny') {
      const reason = hookOutput.permissionDecisionReason;
      process.stdout.write(JSON.stringify({
        permission: 'deny',
        user_message: reason,
        agent_message: reason,
      }));
      return process.exit(2);
    }
    if (typeof hookOutput?.additionalContext === 'string' && hookOutput.additionalContext.trim()) {
      return approve(hookOutput.additionalContext);
    }
  } catch {
    // Non-JSON output -- fall through to plain approve.
  }

  return approve();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => approve());
