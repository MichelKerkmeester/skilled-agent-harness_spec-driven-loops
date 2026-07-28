#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Git Advisory Noise Audit                                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Measure fire rates for ordinary commands and control shapes.   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// The research that produced these rules was clear that noise is the failure mode, not missed
// detections: an advisory firing on a large share of commands is worse than none, because it
// spends attention and returns nothing. Every fire-rate figure so far has been a projection from
// reflog prevalence, which is an upper bound rather than a measurement.
//
// This replays representative command shapes against the repository as it actually stands and
// reports what fires. Not a substitute for a real invocation log, which does not exist here, but
// it does answer the question the projections could not: does the rule set stay quiet on ordinary
// work in this repository, right now.
//
// Run: node <this file> [repo-path]

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import path from 'node:path';

import {
  evaluate,
  readHardRules,
} from '../../../../runtime-hooks/dispatch/lib/dispatch-rule-checks.mjs';
import { GIT_CHECKS } from './git-rule-checks.mjs';
import { createGitContext } from './git-context.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Shapes weighted toward what the reflog says people actually run here: commit dominates,
// followed by reset and the staging commands that precede them. Deliberately includes the
// dangerous-looking-but-routine forms, because those are where a badly gated rule turns noisy.
const ORDINARY_TEMPLATE = [
  'git status',
  'git status --porcelain',
  'git diff',
  'git diff --cached',
  'git log --oneline -10',
  'git add {FILE}',
  'git add -A',
  'git add .',
  'git commit -m "fix(scope): summary"',
  'git commit --amend --no-edit',
  'git push origin main',
  'git pull --rebase',
  'git fetch origin',
  'git checkout -b feature',
  'git switch main',
  'git branch -a',
  'git stash',
  'git stash pop',
  'git reset HEAD',
  'git reset --soft HEAD~1',
  'git merge main',
  'git rebase main',
  'git show HEAD',
  'git worktree list',
  'git restore --staged {FILE}',
];

// A control group of shapes that SHOULD draw an advisory when the repository state warrants it.
// Without this, a zero fire rate on ordinary commands is ambiguous: well-gated rules and rules
// that never fire at all produce the same number, and only one of those is good news.
const SHOULD_FIRE = [
  { cmd: 'git commit -a -m "x"', needs: 'untracked files present' },
  { cmd: 'git add -u', needs: 'untracked files present' },
  { cmd: 'git add no-such-path-anywhere.xyz', needs: 'nothing' },
  { cmd: 'git merge -Xours topic', needs: 'nothing' },
  { cmd: 'git restore --source=HEAD .', needs: 'nothing' },
  { cmd: 'git push --force origin main', needs: 'nothing' },
  { cmd: 'git reflog expire --expire=now --all', needs: 'nothing' },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// The probe set has to name a path that exists in the target repository. An earlier version
// hardcoded README.md and then reported a noise problem in any repo lacking one — the rule was
// right and the measurement was wrong, which is the more dangerous of the two failures.
function ordinaryFor(ctx) {
  const real = [...ctx.tracked()][0] || '.';
  return ORDINARY_TEMPLATE.map((c) => c.replace('{FILE}', real));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const repo = path.resolve(process.argv[2] || process.cwd());
  const ctx = createGitContext(repo);
  if (!ctx.isRepo()) {
    console.error(`not a git repository: ${repo}`);
    process.exit(1);
  }

  const rules = readHardRules(path.join(repo, '.opencode', 'skills', 'sk-git', 'SKILL.md'))
    .filter((r) => GIT_CHECKS[r.check]);

  // Refuse to report a budget verdict with nothing loaded. A zero fire rate from an empty rule
  // set reads exactly like a zero fire rate from a well-gated one, and reporting the second when
  // the first is true is the precise shape of failure this rule set exists to catch.
  if (rules.length === 0) {
    console.error(`no active rules found for ${repo} — nothing to measure, so no verdict is possible`);
    console.error('check that sk-git/SKILL.md declares hard_rules and that each check is implemented');
    process.exit(2);
  }

  const perRule = new Map(rules.map((r) => [r.id, 0]));
  let commandsWithAny = 0;
  const fired = [];

  const ordinaryCommands = ordinaryFor(ctx);
  for (const cmd of ordinaryCommands) {
    const v = evaluate(cmd, rules, { checks: GIT_CHECKS, context: createGitContext(repo) });
    if (v.length > 0) {
      commandsWithAny += 1;
      fired.push({ cmd, ids: v.map((x) => x.id) });
    }
    for (const x of v) perRule.set(x.id, perRule.get(x.id) + 1);
  }

  const total = ordinaryCommands.length;
  const pct = (n) => `${((n / total) * 100).toFixed(1)}%`;

  console.log(`repository:      ${repo}`);
  console.log(`dirty entries:   ${ctx.dirtyCount()}`);
  console.log(`untracked:       ${ctx.untrackedPaths().length}`);
  console.log(`rules active:    ${rules.length}`);
  console.log(`commands probed: ${total}\n`);

  console.log('per-rule fire rate against ordinary commands:');
  for (const [id, n] of [...perRule].sort((a, b) => b[1] - a[1])) {
    const flag = n / total > 0.01 ? '  ← above the 1-in-100 per-rule budget' : '';
    console.log(`  ${String(n).padStart(3)}  ${pct(n).padStart(6)}  ${id}${flag}`);
  }

  console.log(`\naggregate: ${commandsWithAny}/${total} commands (${pct(commandsWithAny)}) draw at least one advisory`);
  if (fired.length) {
    console.log('\nwhat fired:');
    for (const f of fired) console.log(`  ${f.cmd}\n      → ${f.ids.join(', ')}`);
  }

  // Control: confirm the rules are alive. A silent rule set and a well-gated one are
  // indistinguishable from the ordinary-command numbers alone.
  console.log('\ncontrol — shapes that should draw an advisory given current state:');
  let alive = 0;
  for (const c of SHOULD_FIRE) {
    const v = evaluate(c.cmd, rules, { checks: GIT_CHECKS, context: createGitContext(repo) });
    if (v.length > 0) alive += 1;
    console.log(`  ${v.length > 0 ? 'FIRED ' : 'silent'}  ${c.cmd}   (needs: ${c.needs})`);
  }
  console.log(`  ${alive}/${SHOULD_FIRE.length} control shapes drew an advisory`);

  // The aggregate budget is the one that decides whether this gets read. Three per hundred was
  // the research's ceiling; a working tree this dirty is the hardest case the rules will meet.
  const over = commandsWithAny / total > 0.03;
  if (alive === 0) {
    console.log('\nverdict: INVALID — no control shape fired, so the quiet result proves nothing');
    process.exit(2);
  }
  console.log(`\nverdict: ${over ? 'OVER' : 'within'} the 3-in-100 aggregate budget, with the rule set confirmed live`);
  process.exit(over ? 1 : 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main();
