#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Claude PreToolUse Git Preflight Advisory                      ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Surface a git rule at the moment the command is typed.          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// The git rules were already written down and still did not reach anyone, because they were
// surfaced by *prompt* routing while the damage happens at *command* time. This hook closes that
// gap: it reads the same `hard_rules:` frontmatter the dispatch preflight reads, evaluates it
// against the repository as it stands before the command runs, and prints a line.
//
// It advises and never blocks. Blocking belongs to the pre-commit, commit-msg and pre-push hooks,
// which own outcomes this one cannot predict. Here a false positive must cost a line of text and
// nothing more, so every path fails open: no repository, no rules, an unparseable payload, a
// check that throws, a git call that times out — all approve in silence.
//
// Three suppression tiers exist because every comparable system ships all three, and the ones
// that shipped only a global switch taught their users to flip it once and forget. See the
// environment variables below.

import path from 'node:path';
import { readHardRules, evaluate } from '../../../cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs';
import { GIT_CHECKS } from '../lib/git-rule-checks.mjs';
import { createGitContext } from '../lib/git-context.mjs';

// Only a directly visible git invocation is worth inspecting. Anything else exits before a single
// git process is spawned, which keeps the cost of this hook off every unrelated Bash command.
const GIT_SHAPE = /(?:^|[;&|]\s*)(?:\w+=\S+\s+)*git\s+(?:-C\s+\S+\s+)?[a-z-]+/;

// Firing more than this at once is a sign the rule set is miscalibrated rather than that the
// operator is in unusual trouble. Truncating keeps a single misfire from becoming a wall of text,
// which is the fastest way to teach someone to stop reading.
const MAX_ADVISORIES = 3;

function approve() {
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

/**
 * Resolve the three suppression tiers from the environment.
 *
 * - `SKGIT_ADVISORY=0` silences everything. The safety valve.
 * - `SKGIT_ADVISORY_SKIP=commit` silences a group by id prefix, which is the practical tier.
 * - `SKGIT_ADVISORY_SKIP=add-pathspec-only-ignored` silences one rule. The minimum viable tier.
 */
function suppression() {
  const off = /^(0|false|off)$/i.test(process.env.SKGIT_ADVISORY || '');
  const raw = (process.env.SKGIT_ADVISORY_SKIP || '').split(',').map((s) => s.trim()).filter(Boolean);
  return {
    off,
    silenced: (id) => raw.some((token) => id === token || id.startsWith(`${token}-`)),
  };
}

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return approve();
  }

  if (payload?.tool_name !== 'Bash') return approve();
  const command = payload?.tool_input?.command;
  if (typeof command !== 'string' || !GIT_SHAPE.test(command)) return approve();

  const tiers = suppression();
  if (tiers.off) return approve();

  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const rules = readHardRules(path.join(projectDir, '.opencode', 'skills', 'sk-git', 'SKILL.md'))
    .filter((r) => GIT_CHECKS[r.check] && !tiers.silenced(r.id));
  if (rules.length === 0) return approve();

  const ctx = createGitContext(projectDir);
  if (!ctx.isRepo()) return approve();

  const violations = evaluate(command, rules, { checks: GIT_CHECKS, context: ctx });
  if (violations.length === 0) return approve();

  const shown = violations.slice(0, MAX_ADVISORIES);
  const omitted = violations.length - shown.length;

  // The line has to name the operation the reader just invoked. A correct warning that reads as
  // a non-sequitur gets dismissed exactly like a wrong one, and that failure is about framing
  // rather than frequency.
  const subcommand = (command.match(/git\s+(?:-C\s+\S+\s+)?([a-z-]+)/) || [])[1] || 'git';
  const lines = [
    `⚠ sk-git advisory — this \`git ${subcommand}\` may not do what it appears to:`,
    ...shown.map((v) => `  • [${v.id}] ${v.message}`),
  ];
  if (omitted > 0) lines.push(`  • …and ${omitted} more; the rule set may need narrowing.`);
  lines.push('  Advisory only — the command still runs. Silence: SKGIT_ADVISORY_SKIP=<rule-id>');

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: lines.join('\n') },
  }));
  return process.exit(0);
}

main().catch(approve);
