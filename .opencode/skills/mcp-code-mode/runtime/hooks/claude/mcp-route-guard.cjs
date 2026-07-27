#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Claude PreToolUse MCP Route Guard
// ───────────────────────────────────────────────────────────────────
// STATUS: wired live via .claude/settings.json PreToolUse matcher
// `mcp__claude_ai_.*`; advises routing an MCP call through Code Mode on a
// match.
//
// PreToolUse advisory hook for native external MCP calls (Claude Code).
//
// Claude's counterpart to the mk-mcp-route-guard OpenCode plugin: it reads the
// PreToolUse payload for a matched `mcp__claude_ai_.*` tool call and evaluates
// the runtime-neutral mcp-route-guard core. A match against the Code Mode
// manifest emits an additionalContext advisory nudging the call toward
// call_tool_chain; every other outcome exits silently. This hook NEVER emits a
// permissionDecision -- warn-only is the only path this guard can ever take.
// FAILS OPEN -- any missing payload or internal error approves silently, so a
// bug here never blocks a correctly-routed or unrelated call.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const guardCore = require('../../lib/mcp-route-guard.cjs');
const { parseJsonFailOpen, readStdin } = require('../../../../system-spec-kit/runtime/lib/hook-adapter-shared.cjs');

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
  const projectDir = payload?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();

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
