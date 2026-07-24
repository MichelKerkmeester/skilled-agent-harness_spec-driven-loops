#!/usr/bin/env node
// PreToolUse enforce hook for Devin CLI -- the Devin sibling of the Claude/Codex
// spec-gate-enforce hook. Intercepts a Devin tool call BEFORE it runs and
// evaluates the shared spec-gate core's evaluateMutation() policy. A deny emits
// the same permissionDecision:'deny' envelope the Claude/Codex adapters use
// (Devin's own hookSpecificOutput envelope matches that shape); an advisory
// surfaces via additionalContext without overriding the permission decision.
// Calls the runtime-neutral core directly as a fourth consumer alongside the
// Claude hook, the OpenCode plugin, and the Codex hook -- no core change.
// FAILS OPEN -- any missing payload or internal error approves silently, so a
// bug here never blocks correctly-scoped work.
//
// STATUS: DORMANT -- see ../../../mcp-server/hooks/devin/README.md for the
// packet-wide -p hook-firing finding. Devin's `exec`/`edit` tool_input field
// names are unconfirmed (research §10 proposed skeleton, no live capture yet)
// -- this adapter tries the same file_path candidate fallbacks the Claude/Codex
// siblings already tolerate rather than assuming one exact shape.
'use strict';

import * as guardCore from '../../lib/spec-gate/spec-gate-core.mjs';

// Devin tool vocabulary -> the mutation classes the core expects. `exec` is the
// shell surface (Bash-equivalent); `edit` is the file-write surface (proposed,
// not live-confirmed -- research-devin-hooks-portability/research.md §10).
const DEVIN_TOOL_MAP = { exec: 'bash', edit: 'edit' };

function approve() {
  // No output + exit 0 -> defer to the normal permission flow.
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function filePathFrom(toolInput) {
  if (!toolInput || typeof toolInput !== 'object') return null;
  const candidate = toolInput.file_path || toolInput.filePath || toolInput.path;
  return typeof candidate === 'string' && candidate ? candidate : null;
}

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return approve(); // no/invalid payload -> fail open
  }

  const tool = DEVIN_TOOL_MAP[String(payload?.tool_name || '').toLowerCase()];
  if (!tool) return approve();

  const projectDir = payload?.cwd || process.env.DEVIN_PROJECT_DIR || process.cwd();
  const filePath = filePathFrom(payload?.tool_input);
  const sessionID = payload?.session_id;
  const result = guardCore.evaluateMutation({
    tool,
    filePath,
    sessionID,
    projectDir,
    env: process.env,
  });

  // One structured telemetry line per open-gate mutation event (advise or
  // would-deny). 'allow' means the gate was never open or the target was exempt
  // -- nothing to measure.
  if (result.decision !== 'allow') {
    const { stateDir } = guardCore.resolveGuardPaths(projectDir);
    guardCore.appendWarningLog(stateDir, guardCore.formatSpecGateEvent({
      runtime: 'devin',
      sessionID,
      tool,
      filePath,
      decision: result.wouldDeny ? 'would-deny' : 'advise',
    }));
  }

  if (result.decision === 'deny') {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: result.detail,
      },
    }));
    return process.exit(0);
  }

  if (result.decision === 'advise' && result.detail) {
    // Warn-only: surface the advisory without overriding the permission decision.
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        additionalContext: result.detail,
      },
    }));
    return process.exit(0);
  }

  return approve();
}

main().catch(() => approve());
