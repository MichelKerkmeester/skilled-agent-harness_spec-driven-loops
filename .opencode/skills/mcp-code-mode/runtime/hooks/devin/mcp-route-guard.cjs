#!/usr/bin/env node
// PreToolUse advisory hook for native external MCP calls under Devin CLI -- the
// Devin sibling of the Codex/Claude mcp-route-guard hook. Reads a matched
// `mcp__.*` tool call and evaluates the runtime-neutral mcp-route-guard core; a
// match against the Code Mode manifest emits an additionalContext advisory
// nudging the call toward call_tool_chain. NEVER emits a permissionDecision --
// warn-only is the only path this guard can ever take. FAILS OPEN.
//
// STATUS: DORMANT for two independent reasons -- see
// ../../../../system-spec-kit/mcp-server/hooks/devin/README.md for the
// packet-wide -p hook-firing finding. Additionally dormant like its Codex
// sibling: no external MCP family is registered under cli-devin today --
// re-evaluate once real MCP servers exist.
'use strict';

const guardCore = require('../../lib/mcp-route-guard.cjs');

function approve() {
  // No output + exit 0 -> defer to the normal permission flow.
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
    return approve(); // no/invalid payload -> fail open
  }

  const toolName = payload?.tool_name;
  const projectDir = payload?.cwd || process.env.DEVIN_PROJECT_DIR || process.cwd();

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

main().catch(() => approve());
