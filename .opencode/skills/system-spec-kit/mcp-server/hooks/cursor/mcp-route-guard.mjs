#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Cursor beforeMCPExecution Route Guard                         ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Advise routing an MCP call through Code Mode on a match.        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// Cursor's counterpart to Claude's mcp-route-guard.cjs (PreToolUse `mcp__claude_ai_.*` matcher).
//
// STATUS: BUILT, UNWIRED -- NOT in .cursor/hooks.json. No MCP server is
// configured for Cursor CLI on this machine: repo `.cursor/mcp.json` does not
// exist, `~/.cursor/mcp.json` is a 0-byte empty file, and
// `cursor-agent mcp list` itself reports none configured.
// beforeMCPExecution/afterMCPExecution cannot be live-verified without a
// real, credentialed MCP server to dispatch against, and fabricating one was
// out of scope for this pass.
//
// This proxy is written defensively against the SAME `tool_name` /
// `workspace_roots` field convention confirmed live for every OTHER Cursor
// hook event (preToolUse, postToolUse, sessionStart/End) -- Cursor's hook
// payloads share that shape consistently across every event this packet has
// actually observed. That is a reasonable inference, NOT an independent
// confirmation for beforeMCPExecution specifically: no live payload for this
// event has ever been captured. Do NOT add this to .cursor/hooks.json until a
// configured MCP server lets a real payload be captured and this field-name
// assumption re-checked -- mirrors spec-gate-classify.mjs's own "register...
// ONLY after re-confirming live delivery" precedent, applied here one step
// earlier (before ANY registration, not just before trusting the result).

import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const GUARD_SCRIPT_RELATIVE = '.opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs';
const CHILD_TIMEOUT_MS = 3_000;
const MAX_STDIO_BYTES = 1024 * 1024;

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

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return approve();
  }

  const projectDir = payload?.workspace_roots?.[0] || process.cwd();
  const guardPayload = {
    tool_name: payload?.tool_name,
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

  try {
    const parsed = JSON.parse(rawOutput);
    const context = parsed?.hookSpecificOutput?.additionalContext;
    if (typeof context === 'string' && context.trim()) return approve(context);
  } catch {
    // Non-JSON output -- fall through to plain approve.
  }

  return approve();
}

main().catch(() => approve());
