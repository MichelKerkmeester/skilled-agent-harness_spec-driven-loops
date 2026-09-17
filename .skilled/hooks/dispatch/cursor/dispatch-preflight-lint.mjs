#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: dispatch-preflight-lint Cursor adapter (translation shim)     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Give Cursor the same pre-execution refusal the Claude host has.  ║
// ║          Cursor previously carried only a post-tool-use file, so a wrong  ║
// ║          cli-* dispatch typed in a Cursor session was recorded after the  ║
// ║          fact and never stopped. This spawns the Claude adapter with a    ║
// ║          Claude-shaped payload and translates its envelope into Cursor's  ║
// ║          permission envelope, so the rules, severities and engine stay in ║
// ║          exactly one place. FAILS OPEN: any internal error approves.      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { isHookEnabled } from '../../shared/hook-flags.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const LINT_SCRIPT_RELATIVE = '.skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs';
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

// Cursor delivers a shell call as tool_name "Shell"; the shared engine reads Claude's
// "Bash" shape. The command field is identical, so only the name needs translating.
function commandFrom(payload) {
  const input = payload?.tool_input;
  if (input && typeof input === 'object' && typeof input.command === 'string') return input.command;
  if (typeof payload?.command === 'string') return payload.command;
  return '';
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (!isHookEnabled('dispatch')) return approve();

  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return approve();
  }

  const command = commandFrom(payload);
  if (!command) return approve();

  const projectDir = payload?.workspace_roots?.[0] || process.cwd();
  const lintPayload = {
    tool_name: 'Bash',
    tool_input: { command },
    session_id: payload?.session_id,
    cwd: projectDir,
  };

  let rawOutput = null;
  try {
    const result = spawnSync(process.execPath, [join(projectDir, LINT_SCRIPT_RELATIVE)], {
      cwd: projectDir,
      input: JSON.stringify(lintPayload),
      encoding: 'utf8',
      env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
      timeout: CHILD_TIMEOUT_MS,
      maxBuffer: MAX_STDIO_BYTES,
      killSignal: 'SIGKILL',
    });
    if (!result.error) rawOutput = typeof result.stdout === 'string' ? result.stdout.trim() : null;
  } catch {
    rawOutput = null;
  }

  if (!rawOutput) return approve();

  // The Claude adapter emits a hookSpecificOutput envelope: permissionDecision 'deny'
  // with a reason for a blocking rule, or additionalContext for a warn-only advisory.
  // Plain or non-JSON output is never treated as a refusal.
  try {
    const hookOutput = JSON.parse(rawOutput)?.hookSpecificOutput;
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

main().catch(() => approve());
