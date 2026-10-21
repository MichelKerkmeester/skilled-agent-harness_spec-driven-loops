#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin PreToolUse Dispatch Preflight
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under `devin -p` with the documented top-level event
// arrays and nested matcher groups in .devin/hooks.v1.json.
//
// PreToolUse(exec) preflight for CLI dispatch under Devin CLI -- the Devin sibling
// of the Codex/Claude dispatch-preflight-lint hook. Intercepts a composed
// `opencode run` / `claude -p` / `codex exec` command BEFORE it spawns on the
// shell surface and evaluates every dispatch in it against the hard rules its
// governing packet declares (the `hard-rules.json` sidecar beside its SKILL.md).
// A `block`-severity violation denies with the rule's reason; `warn` violations
// attach an advisory and let the normal permission flow proceed. FAILS OPEN --
// any internal error approves silently, never blocks.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import path from 'node:path';

import { evaluateDispatch } from '../lib/dispatch-rule-checks.mjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';
import { readStdin } from '../../shared/hook-adapter-shared.cjs';

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
  if (!isHookEnabled('dispatch-guard')) return approve();
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return approve(); // no/invalid payload -> fail open
  }

  if (String(payload?.tool_name || '').toLowerCase() !== 'exec') return approve();
  const command = payload?.tool_input?.command;
  if (typeof command !== 'string' || command.length === 0) return approve();

  // Whitespace-only cwd is treated as absent so all 10 devin adapters agree.
  const workspaceCwd = payload?.cwd;
  const projectDir = typeof workspaceCwd === 'string' && workspaceCwd.trim()
    ? workspaceCwd
    : (process.env.DEVIN_PROJECT_DIR || process.cwd());
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
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => approve());
