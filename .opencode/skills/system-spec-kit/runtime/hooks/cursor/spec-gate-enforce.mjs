#!/usr/bin/env node
// preToolUse enforce hook for Cursor CLI -- the Cursor sibling of the Codex
// spec-gate-enforce hook. Intercepts a Cursor tool call BEFORE it runs and
// evaluates the shared spec-gate core's evaluateMutation() policy. Wired to
// `preToolUse` (confirmed live to fire before every tool call: Shell, Read,
// Grep, Write), NOT `beforeShellExecution` alone -- preToolUse is Cursor's
// generic pre-tool gate and covers file writes too, which beforeShellExecution
// does not. Calls the runtime-neutral core directly as a fourth consumer
// alongside the Claude hook, the OpenCode plugin, and the Codex hook -- no
// core change. FAILS OPEN -- any missing payload, unmapped tool, or internal
// error approves silently, so a bug here never blocks correctly-scoped work.
'use strict';

import * as guardCore from '../../lib/spec-gate/spec-gate-core.mjs';

// Cursor tool vocabulary -> the mutation classes the core expects, confirmed
// live via a temporary probe-hook dispatch against cursor-agent
// 2026.07.23-e383d2b. `Shell` is the shell surface (bash-equivalent); `Write`
// is the file-write surface. No distinct "Edit"/"MultiEdit" tool_name was
// observed in testing -- if Cursor later exposes one, add it here rather
// than assuming it maps the same way.
const CURSOR_TOOL_MAP = { Shell: 'bash', Write: 'write' };

function approve() {
  // {"permission":"allow"} + exit 0 -> defer to the normal flow.
  process.stdout.write(JSON.stringify({ permission: 'allow' }));
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

  const tool = CURSOR_TOOL_MAP[String(payload?.tool_name || '')];
  if (!tool) return approve();

  const projectDir = payload?.workspace_roots?.[0] || process.cwd();
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
  // would-deny). 'allow' means the gate was never open or the target was
  // exempt -- nothing to measure.
  if (result.decision !== 'allow') {
    const { stateDir } = guardCore.resolveGuardPaths(projectDir);
    guardCore.appendWarningLog(stateDir, guardCore.formatSpecGateEvent({
      runtime: 'cursor',
      sessionID,
      tool,
      filePath,
      decision: result.wouldDeny ? 'would-deny' : 'advise',
    }));
  }

  if (result.decision === 'deny') {
    process.stdout.write(JSON.stringify({
      permission: 'deny',
      user_message: result.detail,
      agent_message: result.detail,
    }));
    return process.exit(2);
  }

  if (result.decision === 'advise' && result.detail) {
    // Warn-only: surface the advisory without overriding the permission decision.
    process.stdout.write(JSON.stringify({
      permission: 'allow',
      agent_message: result.detail,
    }));
    return process.exit(0);
  }

  return approve();
}

main().catch(() => approve());
