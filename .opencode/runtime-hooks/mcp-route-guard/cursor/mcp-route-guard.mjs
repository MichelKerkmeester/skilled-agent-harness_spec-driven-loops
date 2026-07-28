#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor beforeMCPExecution Route Guard
// ───────────────────────────────────────────────────────────────────
// STATUS: confirmed live-firing under cursor-agent 2026.07.23-e383d2b; advisory only, fails open.
// Cursor's counterpart to Claude's mcp-route-guard.cjs (PreToolUse `mcp__claude_ai_.*` matcher).
//
// `beforeMCPExecution` is confirmed live-firing against cursor-agent
// 2026.07.23-e383d2b, with a real captured payload (isolated workspace, own
// mcp.json + probe hooks.json, dispatched with `--approve-mcps`).
//
// The captured payload carries the server and the tool in SEPARATE fields --
// `mcp_server_name: "sequential_thinking"` alongside a BARE
// `tool_name: "sequentialthinking"` -- unlike Claude, which packs both into a
// single `mcp__<server>__<tool>` string. The shared guard core only parses
// those two packed shapes (`mcp__<server>__<tool>` or `<server>_<tool>`), so
// forwarding Cursor's bare tool_name verbatim matches NOTHING and the guard
// silently never advises. The two fields are therefore recombined into the
// packed Claude shape before the core sees them; verified against the core
// directly, the bare form returns no advisory where the packed form does.
//
// Advisory only -- this guard never denies. FAILS OPEN: any missing payload,
// spawn error, or parse failure approves silently.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const GUARD_SCRIPT_RELATIVE = '.opencode/runtime-hooks/mcp-route-guard/claude/mcp-route-guard.cjs';
const CHILD_TIMEOUT_MS = 3_000;
const MAX_STDIO_BYTES = 1024 * 1024;

// The packed shape the shared core parses: `mcp__<server>__<tool>`.
const CLAUDE_MCP_PREFIX = 'mcp__';
const CLAUDE_MCP_SEPARATOR = '__';

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

// Recombine Cursor's split server/tool fields into the single packed string
// the shared core parses. Without a server name there is nothing to pack, so
// the bare tool name is passed through and simply will not match -- the same
// silent no-match the core already gives any unrecognized shape.
function packServerAndTool(serverName, toolName) {
  if (!serverName || !toolName) return toolName;
  return `${CLAUDE_MCP_PREFIX}${serverName}${CLAUDE_MCP_SEPARATOR}${toolName}`;
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

  const projectDir = payload?.workspace_roots?.[0] || process.cwd();
  const guardPayload = {
    tool_name: packServerAndTool(payload?.mcp_server_name, payload?.tool_name),
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => approve());
