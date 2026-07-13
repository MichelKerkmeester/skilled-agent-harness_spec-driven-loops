#!/usr/bin/env node
// PreToolUse advisory hook for native external MCP calls under Codex CLI -- the
// Codex sibling of the Claude mcp-route-guard hook. Reads a matched `mcp__.*`
// tool call and evaluates the runtime-neutral mcp-route-guard core; a match
// against the Code Mode manifest emits an additionalContext advisory nudging the
// call toward call_tool_chain. NEVER emits a permissionDecision -- warn-only is
// the only path this guard can ever take. FAILS OPEN.
//
// Dormant under Codex today: Codex's registered MCP servers are all
// `mk_`-prefixed and thus exempted by the core (isInternalServerToken), and
// there is no external Code Mode MCP under Codex to guard. This adapter activates
// only if/when an external MCP family is registered.
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
  const projectDir = payload?.cwd || process.env.CODEX_PROJECT_DIR || process.cwd();

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
