#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin PreToolUse Spec Gate Enforce
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under `devin -p` with the documented top-level event
// arrays and nested matcher groups in .devin/hooks.v1.json.
//
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

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import * as guardCore from '../../lib/spec-gate/spec-gate-core.mjs';
import { parseJsonFailOpen, readStdin } from '../../lib/hook-adapter-shared.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Devin tool vocabulary -> the mutation classes the core expects. `exec` is the
// shell surface (Bash-equivalent); `edit` is the file-write surface (proposed,
// not live-confirmed -- research-devin-hooks-portability/research.md §10).
const DEVIN_TOOL_MAP = { exec: 'bash', edit: 'edit' };

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function approve() {
  // No output + exit 0 -> defer to the normal permission flow.
  process.exit(0);
}

// A `||` chain picks the first truthy VALUE, not the first valid string -- a
// truthy non-string in an earlier field (e.g. a stray object) would suppress
// a valid string in a later one and still resolve to null. This picks the
// first field that is actually a non-blank string, confirmed-canonical field
// first, so partial/malformed payloads never silently mask a real alias.
function firstNonBlankString(...candidates) {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) return candidate;
  }
  return null;
}

function filePathFrom(toolInput) {
  if (!toolInput || typeof toolInput !== 'object') return null;
  return firstNonBlankString(toolInput.file_path, toolInput.filePath, toolInput.path);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const payload = parseJsonFailOpen(await readStdin());
  if (payload === null) return approve(); // no/invalid payload -> fail open

  const tool = DEVIN_TOOL_MAP[String(payload?.tool_name || '').toLowerCase()];
  if (!tool) return approve();

  const sessionID = typeof payload?.session_id === 'string' ? payload.session_id : '';
  if (sessionID.trim().length === 0) return approve();

  // Match the classify producer's cwd resolution exactly: a whitespace-only
  // root is treated as absent, so producer and consumer derive the same state
  // directory for every payload shape.
  const workspaceCwd = payload?.cwd;
  const projectDir = typeof workspaceCwd === 'string' && workspaceCwd.trim()
    ? workspaceCwd
    : (process.env.DEVIN_PROJECT_DIR || process.cwd());
  const filePath = filePathFrom(payload?.tool_input);
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => approve());
