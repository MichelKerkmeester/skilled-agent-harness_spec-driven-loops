#!/usr/bin/env node
// PreToolUse(exec) preflight for CLI dispatch under Codex CLI -- the Codex sibling
// of the Claude dispatch-preflight-lint hook. Intercepts a composed
// `opencode run` / `claude -p` command BEFORE it spawns on the exec surface and
// evaluates the target skill's declared hard_rules (SKILL.md `hard_rules:`
// frontmatter). A `block`-severity violation denies with the rule's reason (the
// same permissionDecision:'deny' envelope Codex honors); `warn` violations attach
// an advisory and let the normal permission flow proceed. Runs on every exec
// call, so it fast-exits on anything that is not a dispatch shape, and it FAILS
// OPEN -- any internal error approves silently, never blocks.

import { readHardRules, evaluate } from '../../lib/dispatch-rule-checks.mjs';
import { DISPATCH_SHAPES } from '../../lib/dispatch-audit.mjs';
import path from 'node:path';

// Codex dispatches sub-agents via `codex exec -p <agent>` on the exec surface --
// a shape the shared cross-runtime core (opencode run / claude -p) does not know.
// Add it here, in the adapter, so cli-codex hard-rules are enforced on a Codex
// sub-dispatch without changing the shared dispatch core.
const CODEX_EXEC_SHAPE = {
  test: /\bcodex\s+exec\b[^\n]*\s-p\b/,
  skill: 'cli-codex',
  packetPath: 'cli-external-orchestration/cli-codex',
};
const DISPATCH_SKILLS = [...DISPATCH_SHAPES, CODEX_EXEC_SHAPE];

function approve() {
  // No output + exit 0 -> defer to the normal permission flow.
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

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
  const match = DISPATCH_SKILLS.find((d) => d.test.test(command));
  if (!match) return approve();

  const projectDir = payload?.cwd || process.env.CODEX_PROJECT_DIR || process.cwd();
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

main().catch(() => approve());
