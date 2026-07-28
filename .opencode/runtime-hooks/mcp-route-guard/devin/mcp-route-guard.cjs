#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin PreToolUse MCP Route Guard
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under `devin -p` with the documented top-level event
// arrays and nested matcher groups in .devin/hooks.v1.json.
//
// PreToolUse advisory hook for native external MCP calls under Devin CLI -- the
// Devin sibling of the Codex/Claude mcp-route-guard hook. Reads a matched
// `mcp__.*` tool call and evaluates the runtime-neutral mcp-route-guard core; a
// match against the Code Mode manifest emits an additionalContext advisory
// nudging the call toward call_tool_chain. NEVER emits a permissionDecision --
// warn-only is the only path this guard can ever take. FAILS OPEN.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const guardCore = require('../lib/mcp-route-guard.cjs');
const { parseJsonFailOpen, readStdin } = require('../../../skills/system-spec-kit/runtime/lib/hook-adapter-shared.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function approve() {
  // No output + exit 0 -> defer to the normal permission flow.
  process.exit(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const payload = parseJsonFailOpen(await readStdin());
  if (payload === null) return approve(); // no/invalid payload -> fail open

  const toolName = payload?.tool_name;
  // Whitespace-only cwd is treated as absent so all 10 devin adapters agree.
  const workspaceCwd = payload?.cwd;
  const projectDir = typeof workspaceCwd === 'string' && workspaceCwd.trim()
    ? workspaceCwd
    : (process.env.DEVIN_PROJECT_DIR || process.cwd());

  const result = guardCore.evaluateNativeMcpCall({
    toolName,
    projectDir,
    env: process.env,
  });

  if (result.warnings && result.warnings.length > 0) {
    // Warn-only: surface the advisory without touching the permission decision.
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
