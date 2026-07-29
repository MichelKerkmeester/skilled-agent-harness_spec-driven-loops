#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex PreToolUse Spec Gate Enforce
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under Codex CLI via `.codex/hooks.json`'s
// PreToolUse `exec|apply_patch|edit` matcher group.
// PreToolUse enforce hook for Codex CLI -- the Codex sibling of the Claude
// spec-gate-enforce hook. Intercepts a Codex tool call BEFORE it runs and
// evaluates the shared spec-gate core's evaluateMutation() policy. A deny emits
// the same permissionDecision:'deny' envelope Codex honors (settled from the
// 0.144.2 binary schema); an advisory surfaces via additionalContext without
// overriding the permission decision. Calls the runtime-neutral core directly as
// a third consumer alongside the Claude hook and the OpenCode plugin -- no core
// change. FAILS OPEN -- any missing payload or internal error approves silently,
// so a bug here never blocks correctly-scoped work.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import * as guardCore from '../lib/spec-gate/spec-gate-core.mjs';
import { parseJsonFailOpen, readStdin } from '../lib/hook-adapter-shared.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Codex tool vocabulary -> the mutation classes the core expects. `exec` is the
// shell surface (Bash-equivalent); `apply_patch`/`edit` are file writes.
const CODEX_TOOL_MAP = { exec: 'bash', apply_patch: 'write', edit: 'edit' };

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function approve() {
  // No output + exit 0 -> defer to the normal permission flow.
  process.exit(0);
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

function filePathFrom(toolInput, projectDir) {
  if (!toolInput || typeof toolInput !== 'object') return null;
  const candidate = firstNonBlankString(toolInput.file_path, toolInput.filePath, toolInput.path);
  if (candidate !== null) return candidate;
  const paths = pathsFromPatch(toolInput.command || toolInput.input || toolInput.patch);
  if (paths.length === 0) return null;
  // Evaluate on the first path the gate would actually act on, so a multi-file
  // patch that touches any non-exempt file is judged on that file rather than an
  // exempt sibling that happens to come first.
  return paths.find((candidatePath) => !guardCore.isExemptTargetPath(candidatePath, projectDir)) || paths[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const payload = parseJsonFailOpen(await readStdin());
  if (payload === null) return approve(); // no/invalid payload -> fail open

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

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => approve());
