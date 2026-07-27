#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Claude PreToolUse Spec Gate Enforce
// ───────────────────────────────────────────────────────────────────
// STATUS: wired live to two .claude/settings.json PreToolUse matchers;
// denies an unscoped mutation while the spec gate is open.
//
// PreToolUse enforce hook for Claude Code -- wired to TWO matchers in
// .claude/settings.json: "Write|Edit" (deny-capable) and "Bash" (advise-only,
// same file). It intercepts the tool call BEFORE it runs and evaluates the
// shared spec-gate core's evaluateMutation() policy. A deny emits Claude's
// PreToolUse deny-JSON form; an advisory surfaces via additionalContext
// without overriding the permission decision. FAILS OPEN -- any missing
// payload or internal error approves silently, so a bug here never blocks
// unrelated, correctly-scoped work.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import * as guardCore from '../../lib/spec-gate/spec-gate-core.mjs';
import { parseJsonFailOpen, readStdin } from '../../lib/hook-adapter-shared.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
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
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const payload = parseJsonFailOpen(await readStdin());
  if (payload === null) return approve(); // no/invalid payload -> fail open

  const tool = String(payload?.tool_name || '').toLowerCase();
  if (tool !== 'write' && tool !== 'edit' && tool !== 'bash') return approve();

  const projectDir = payload?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
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
  // would-deny), written to a real file log -- do not depend on
  // additionalContext landing anywhere observable. 'allow' means the gate
  // was never open or the target was exempt -- nothing to measure.
  if (result.decision !== 'allow') {
    const { stateDir } = guardCore.resolveGuardPaths(projectDir);
    guardCore.appendWarningLog(stateDir, guardCore.formatSpecGateEvent({
      runtime: 'claude',
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
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => approve());
