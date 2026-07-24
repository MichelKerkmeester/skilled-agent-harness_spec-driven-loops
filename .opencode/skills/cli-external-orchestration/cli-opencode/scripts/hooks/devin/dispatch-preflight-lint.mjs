#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Devin PreToolUse Dispatch Preflight                           ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Lint a CLI dispatch command against the skill's hard rules.     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// PreToolUse(exec) preflight for CLI dispatch under Devin CLI -- the Devin sibling
// of the Codex/Claude dispatch-preflight-lint hook. Intercepts a composed
// `opencode run` / `claude -p` / `codex exec -p` command BEFORE it spawns on the
// shell surface and evaluates the target skill's declared hard_rules (SKILL.md
// `hard_rules:` frontmatter). A `block`-severity violation denies with the rule's
// reason; `warn` violations attach an advisory and let the normal permission flow
// proceed. FAILS OPEN -- any internal error approves silently, never blocks.
// STATUS: LIVE. Verified firing 2026-07-24 against devin 3000.2.17 under
// `devin -p`: SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, Stop and
// SessionEnd all fire, and the real adapters' output reaches the model. An
// earlier revision of this file claimed the hook system was dormant; that was a
// registration-schema bug in .devin/hooks.v1.json (events must be top-level with
// nested {matcher, hooks:[...]} entries), not a limitation of the CLI.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readHardRules, evaluate } from '../../lib/dispatch-rule-checks.mjs';
import { DISPATCH_SHAPES } from '../../lib/dispatch-audit.mjs';
import path from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function approve() {
  // No output + exit 0 -> defer to the normal permission flow.
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return approve(); // no/invalid payload -> fail open
  }

  if (String(payload?.tool_name || '').toLowerCase() !== 'exec') return approve();
  const command = payload?.tool_input?.command;
  if (typeof command !== 'string' || command.length === 0) return approve();

  // Fast-exit unless the command is a known dispatch shape.
  const match = DISPATCH_SHAPES.find((d) => d.test.test(command));
  if (!match) return approve();

  const projectDir = payload?.cwd || process.env.DEVIN_PROJECT_DIR || process.cwd();
  const skillMd = path.join(projectDir, '.opencode', 'skills', match.packetPath, 'SKILL.md');
  const rules = readHardRules(skillMd);
  if (rules.length === 0) return approve(); // nothing declared -> nothing to enforce

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
