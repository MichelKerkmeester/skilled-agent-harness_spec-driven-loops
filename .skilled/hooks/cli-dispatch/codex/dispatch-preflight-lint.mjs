#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex PreToolUse Dispatch Preflight
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under Codex CLI via `.codex/hooks.json`'s
// PreToolUse `exec|Bash` matcher group.
// PreToolUse(exec) preflight for CLI dispatch under Codex CLI -- the Codex sibling
// of the Claude dispatch-preflight-lint hook. Intercepts a composed
// `opencode run` / `claude -p` command BEFORE it spawns on the exec surface and
// evaluates every dispatch in it against the hard rules its governing packet
// declares (the `hard-rules.json` sidecar beside its SKILL.md). A `block`-severity
// violation denies with the rule's reason (the same permissionDecision:'deny'
// envelope Codex honors); `warn` violations attach an advisory and let the normal
// permission flow proceed. Runs on every exec call, so it fast-exits on anything
// that is not a dispatch shape, and it FAILS OPEN -- any internal error approves
// silently, never blocks.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import path from 'node:path';

import { evaluateDispatch } from '../lib/dispatch-rule-checks.mjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';
import { readStdin } from '../../shared/hook-adapter-shared.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Codex names its shell tool `exec` up to 0.15x and `Bash` from 0.160 on.
const CODEX_SHELL_TOOLS = new Set(['exec', 'bash']);

function approve() {
  // No output + exit 0 -> defer to the normal permission flow.
  process.exit(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (!isHookEnabled('dispatch-guard')) return approve();
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return approve(); // no/invalid payload -> fail open
  }

  if (!CODEX_SHELL_TOOLS.has(String(payload?.tool_name || '').toLowerCase())) return approve();
  const command = payload?.tool_input?.command;
  if (typeof command !== 'string' || command.length === 0) return approve();

  const projectDir = payload?.cwd || process.env.CODEX_PROJECT_DIR || process.cwd();
  const skillsRoot = path.join(projectDir, '.skilled', 'skills');

  // Hold every dispatch to its own packet: one command line can carry two, and the second
  // executor's rules are not the first one's.
  const blocking = [];
  const warnings = [];
  for (const { skill, violations } of evaluateDispatch(command, skillsRoot)) {
    const denied = violations.filter((v) => v.severity === 'block');
    const advised = violations.filter((v) => v.severity === 'warn');
    if (denied.length > 0) {
      blocking.push(`Dispatch blocked by ${skill} hard-rule(s):\n` +
        denied.map((v) => `  • [${v.id}] ${v.message}`).join('\n'));
    }
    if (advised.length > 0) {
      warnings.push(`⚠ ${skill} dispatch hard-rule advisory:\n` +
        advised.map((v) => `  • [${v.id}] ${v.message}`).join('\n'));
    }
  }
  if (blocking.length === 0 && warnings.length === 0) return approve();

  if (blocking.length > 0) {
    const reason = blocking.join('\n');
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reason,
      },
    }));
    return process.exit(0);
  }

  // Warn-only: surface the advisory without overriding the permission decision.
  const advisory = warnings.join('\n');
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: advisory },
  }));
  return process.exit(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => approve());
