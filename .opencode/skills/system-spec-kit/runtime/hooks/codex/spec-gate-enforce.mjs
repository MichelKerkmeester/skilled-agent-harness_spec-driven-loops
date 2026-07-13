#!/usr/bin/env node
// PreToolUse enforce hook for Codex CLI -- the Codex sibling of the Claude
// spec-gate-enforce hook. Intercepts a Codex tool call BEFORE it runs and
// evaluates the shared spec-gate core's evaluateMutation() policy. A deny emits
// the same permissionDecision:'deny' envelope Codex honors (settled from the
// 0.144.2 binary schema); an advisory surfaces via additionalContext without
// overriding the permission decision. Calls the runtime-neutral core directly as
// a third consumer alongside the Claude hook and the OpenCode plugin -- no core
// change. FAILS OPEN -- any missing payload or internal error approves silently,
// so a bug here never blocks correctly-scoped work.
'use strict';

import * as guardCore from '../../lib/spec-gate/spec-gate-core.mjs';

// Codex tool vocabulary -> the mutation classes the core expects. `exec` is the
// shell surface (Bash-equivalent); `apply_patch`/`edit` are file writes.
const CODEX_TOOL_MAP = { exec: 'bash', apply_patch: 'write', edit: 'edit' };

function approve() {
  // No output + exit 0 -> defer to the normal permission flow.
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

// Codex `apply_patch` carries the target inside the patch body (tool_input.command),
// not a file_path field -- an `*** Add/Update/Delete File:` (or `*** Move to:`)
// header per affected file. Parse those out so the gate sees the real target;
// without this the enforce path reads a null filePath and treats every Codex
// patch as exempt, silently never denying.
function pathsFromPatch(patchText) {
  if (typeof patchText !== 'string') return [];
  const paths = [];
  const fileHeader = /^\*\*\* (?:Add|Update|Delete) File: (.+?)\s*$/gm;
  let match;
  while ((match = fileHeader.exec(patchText))) paths.push(match[1].trim());
  const moveTarget = patchText.match(/^\*\*\* Move to: (.+?)\s*$/m);
  if (moveTarget) paths.push(moveTarget[1].trim());
  return paths;
}

function filePathFrom(toolInput, projectDir) {
  if (!toolInput || typeof toolInput !== 'object') return null;
  const candidate = toolInput.file_path || toolInput.filePath || toolInput.path;
  if (typeof candidate === 'string' && candidate) return candidate;
  const paths = pathsFromPatch(toolInput.command || toolInput.input || toolInput.patch);
  if (paths.length === 0) return null;
  // Evaluate on the first path the gate would actually act on, so a multi-file
  // patch that touches any non-exempt file is judged on that file rather than an
  // exempt sibling that happens to come first.
  return paths.find((candidatePath) => !guardCore.isExemptTargetPath(candidatePath, projectDir)) || paths[0];
}

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return approve(); // no/invalid payload -> fail open
  }

  const tool = CODEX_TOOL_MAP[String(payload?.tool_name || '').toLowerCase()];
  if (!tool) return approve();

  const projectDir = payload?.cwd || process.env.CODEX_PROJECT_DIR || process.cwd();
  const filePath = filePathFrom(payload?.tool_input, projectDir);
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
      runtime: 'codex',
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
