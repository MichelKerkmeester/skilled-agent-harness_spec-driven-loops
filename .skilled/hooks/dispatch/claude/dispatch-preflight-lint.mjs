#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Claude PreToolUse Dispatch Preflight                          ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Lint a CLI dispatch command against the skill's hard rules.     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// PreToolUse(Bash) preflight for CLI dispatch.
//
// Intercepts a composed `opencode run` / `claude -p` command BEFORE it spawns and evaluates the
// target skill's declared hard rules (the `hard-rules.json` sidecar beside its SKILL.md). A
// `block`-severity violation denies the call with the rule's reason; `warn` violations attach an
// advisory and let the normal permission flow proceed. Runs on every Bash call, so it fast-exits
// on anything that is not a dispatch shape, and it FAILS OPEN — any internal error approves
// silently, never blocks.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import path from 'node:path';

import { readHardRules, evaluate } from '../lib/dispatch-rule-checks.mjs';
import { resolveDispatchPacket } from '../lib/dispatch-audit.mjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';
import { readStdin } from '../../shared/hook-adapter-shared.cjs';

// The dispatch shapes and the skill each one resolves to live in `lib/dispatch-audit.mjs`
// (`DISPATCH_SHAPES`); add new `cli-*` entries there.

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function approve() {
  // No output + exit 0 → defer to the normal permission flow.
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
    return approve(); // no/invalid payload → fail open
  }

  if (payload?.tool_name !== 'Bash') return approve();
  const command = payload?.tool_input?.command;
  if (typeof command !== 'string' || command.length === 0) return approve();

  // Fast-exit unless the command is a known dispatch shape.
  const match = resolveDispatchPacket(command);
  if (!match) return approve();

  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const skillMd = path.join(projectDir, '.skilled', 'skills', match.packetPath, 'SKILL.md');
  const rules = readHardRules(skillMd);
  if (rules.length === 0) return approve(); // nothing declared → nothing to enforce

  const violations = evaluate(command, rules);
  if (violations.length === 0) return approve();

  const blocking = violations.filter((v) => v.severity === 'block');
  const warnings = violations.filter((v) => v.severity === 'warn');

  if (blocking.length > 0) {
    const reason = `Dispatch blocked by ${match.skill} hard-rule(s):\n` +
      blocking.map((v) => `  • [${v.id}] ${v.message}`).join('\n');
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
  const advisory = `⚠ ${match.skill} dispatch hard-rule advisory:\n` +
    warnings.map((v) => `  • [${v.id}] ${v.message}`).join('\n');
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: advisory },
  }));
  return process.exit(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => approve());
