#!/usr/bin/env node
// PreToolUse(Bash) preflight for CLI dispatch.
//
// Intercepts a composed `opencode run` / `claude -p` command BEFORE it spawns and evaluates the
// target skill's declared hard_rules (SKILL.md `hard_rules:` frontmatter). A `block`-severity
// violation denies the call with the rule's reason; `warn` violations attach an advisory and let
// the normal permission flow proceed. Runs on every Bash call, so it fast-exits on anything that
// is not a dispatch shape, and it FAILS OPEN — any internal error approves silently, never blocks.

import { readHardRules, evaluate } from '../lib/dispatch-rule-checks.mjs';
import path from 'node:path';

// Dispatch-shape registry: command pattern → the skill whose SKILL.md declares its hard_rules.
// Extend by adding an entry as new cli-* dispatch skills gain a hard_rules block.
const DISPATCH_SKILLS = [
  { test: /\bopencode\s+run\b/, skill: 'cli-opencode' },
  { test: /\bclaude\s+(-p|--print)\b/, skill: 'cli-claude-code' },
];

function approve() {
  // No output + exit 0 → defer to the normal permission flow.
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
    return approve(); // no/invalid payload → fail open
  }

  if (payload?.tool_name !== 'Bash') return approve();
  const command = payload?.tool_input?.command;
  if (typeof command !== 'string' || command.length === 0) return approve();

  // Fast-exit unless the command is a known dispatch shape.
  const match = DISPATCH_SKILLS.find((d) => d.test.test(command));
  if (!match) return approve();

  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const skillMd = path.join(projectDir, '.opencode', 'skills', match.skill, 'SKILL.md');
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

main().catch(() => approve());
