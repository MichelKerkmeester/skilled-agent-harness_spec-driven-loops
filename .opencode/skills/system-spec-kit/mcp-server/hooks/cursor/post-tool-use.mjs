#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor postToolUse Hook
// ───────────────────────────────────────────────────────────────────
// STATUS: confirmed live-firing under cursor-agent 2026.07.23-e383d2b for Write and Shell tool_name payloads.
// Proxies to the Claude PostToolUse counterparts. Confirmed live via a temporary probe-hook dispatch against
// cursor-agent 2026.07.23-e383d2b: `postToolUse` fires for both `Write` and
// `Shell` tool_name payloads (plus `postToolUseFailure` for failed calls,
// not handled here -- that variant carries no `tool_output`, only
// `error_message`/`failure_type`, and none of the three chained hooks below
// read a failure shape).
//
// Per tool_name, chains to:
//   Write -> claude-posttooluse.cjs (post-edit quality checks)
//   Shell -> dispatch-audit-posttooluse.mjs (CLI dispatch audit trail)
//
// Deliberately NOT a thin proxy through shared.ts's runClaudeHookAdapter():
// both targets live outside mcp-server/hooks/claude/ (sk-code and
// cli-external-orchestration respectively), so
// runClaudeHookAdapter's `../claude/<filename>` resolution does not reach
// them. Spawns each directly by its known repo-relative path instead,
// mirroring spec-gate-enforce.mjs's plain-.mjs style. FAILS OPEN -- a
// spawn/parse error on either chained hook must never affect the tool call
// already completed, and never affects the other chained hook.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CLAUDE_POST_TOOL_USE_RELATIVE = '.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs';
const DISPATCH_AUDIT_RELATIVE = '.opencode/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs';
const CHILD_TIMEOUT_MS = 8_000;
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

function runChild(scriptAbsolutePath, payload, projectDir) {
  try {
    const result = spawnSync(process.execPath, [scriptAbsolutePath], {
      cwd: projectDir,
      input: JSON.stringify(payload),
      encoding: 'utf8',
      env: process.env,
      timeout: CHILD_TIMEOUT_MS,
      maxBuffer: MAX_STDIO_BYTES,
      killSignal: 'SIGKILL',
    });
    if (result.error) return null;
    return typeof result.stdout === 'string' ? result.stdout.trim() : null;
  } catch {
    return null;
  }
}

// Cursor's Shell tool_output is a JSON-STRINGIFIED string, e.g.
// '{"output":"...","exitCode":0}' -- not a nested object like Write's.
function parseShellToolOutput(rawToolOutput) {
  if (typeof rawToolOutput !== 'string') return {};
  try {
    const parsed = JSON.parse(rawToolOutput);
    return {
      stdout: typeof parsed.output === 'string' ? parsed.output : undefined,
      exitCode: parsed.exitCode,
    };
  } catch {
    return {};
  }
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

  const toolName = payload?.tool_name;
  const projectDir = payload?.workspace_roots?.[0] || process.cwd();
  const sessionID = payload?.session_id;

  if (toolName === 'Write') {
    const filePath = payload?.tool_input?.file_path;
    const claudeShapedPayload = {
      tool_name: 'Write',
      tool_input: { file_path: filePath },
      cwd: projectDir,
      session_id: sessionID,
    };

    const findings = runChild(
      join(projectDir, CLAUDE_POST_TOOL_USE_RELATIVE),
      claudeShapedPayload,
      projectDir,
    );
    return approve(findings || undefined);
  }

  if (toolName === 'Shell') {
    const command = payload?.tool_input?.command;
    const toolResponse = parseShellToolOutput(payload?.tool_output);
    // Normalize Shell -> Bash: dispatch-audit-posttooluse.mjs matches
    // `tool_name.toLowerCase() === 'bash'` literally -- 'shell' would not
    // match and the audit line would silently never be recorded.
    const dispatchPayload = {
      tool_name: 'Bash',
      tool_input: { command },
      cwd: projectDir,
      session_id: sessionID,
      tool_use_id: payload?.tool_use_id,
      tool_response: toolResponse,
    };
    runChild(
      join(projectDir, DISPATCH_AUDIT_RELATIVE),
      dispatchPayload,
      projectDir,
    );
    return approve();
  }

  return approve();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => approve());
