#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ run-packaging-refine — Lane D entry: guarded packaging benchmark+refine  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Thin executor adapter for the packaging-benchmark-refine lane (Lane D).
 *
 * The lane's loop host lives WITH the packaging under test, not in this skill:
 * a packaging root implements the contract `<root>/_loop/loop.py` (pre-flight
 * gates -> N-sample benchmark -> independent re-grade -> gap analysis ->
 * worktree propose -> guarded promote-N -> converge/kill-switch). This adapter
 * only translates loop-host flags into that contract's env/argv surface and
 * spawns python3 — it owns no loop logic, so the packaging team can evolve
 * the loop without touching deep-improvement.
 *
 * Pilot implementation: Barter Copywriter
 *   (.../AI_Systems/Barter/Copywriter — _gates/ frozen scoring surface,
 *    _gates/derive.py 3-copy derivation, benchmark/ harness + blind re-grader).
 *
 * Usage:
 *   node run-packaging-refine.cjs --packaging-root <path> [--live] [--max-iters N]
 *     [--fixtures a,b] [--variants a,b] [--held-out a,b] [--samples N]
 *     [--proposer-model id] [--grader-model id]
 *
 * SAFETY DEFAULT: without --live this runs the loop's --dry-run (gates +
 * grader-family guard + gap analysis on existing grades; zero dispatches,
 * zero edits). --live runs the real guarded loop, which dispatches models and
 * may promote an edit into an isolated git worktree branch (never the live
 * tree directly).
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// loop.py contract: env knobs + argv modes (see <root>/_loop/loop.py)
const ENV_FORWARD = {
  fixtures: 'LOOP_FIXTURES',
  variants: 'LOOP_VARIANTS',
  'held-out': 'LOOP_HELD_OUT',
  samples: 'LOOP_SAMPLES',
  'proposer-model': 'PROPOSER_MODEL',
  'grader-model': 'GRADER_MODEL',
};

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const m = /^--([a-z][a-z0-9-]*)(?:=(.*))?$/.exec(argv[i]);
    if (!m) continue;
    if (m[2] !== undefined) { args[m[1]] = m[2]; continue; }
    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith('--')) { args[m[1]] = next; i += 1; }
    else args[m[1]] = true;
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = args['packaging-root'];
  if (!root) {
    process.stderr.write('packaging-benchmark-refine: missing required --packaging-root=<path>\n');
    process.exit(2);
  }
  const loopHost = path.join(root, '_loop', 'loop.py');
  if (!fs.existsSync(loopHost)) {
    process.stderr.write(`packaging-benchmark-refine: ${loopHost} not found — the packaging root must implement the _loop/loop.py contract\n`);
    process.exit(2);
  }
  const env = { ...process.env };
  for (const [flag, envName] of Object.entries(ENV_FORWARD)) {
    if (args[flag] === undefined) continue;
    if (args[flag] === true) {
      process.stderr.write(`packaging-benchmark-refine: --${flag} requires a value
`);
      process.exit(2);
    }
    env[envName] = String(args[flag]);
  }
  const pyArgs = [loopHost];
  if (args.live) {
    pyArgs.push('--run');
    if (args['max-iters'] !== undefined) pyArgs.push('--max-iters', String(args['max-iters']));
  } else {
    pyArgs.push('--dry-run');
  }
  const res = spawnSync('python3', pyArgs, { stdio: 'inherit', encoding: 'utf8', env });
  process.exit(res.status == null ? 1 : res.status);
}

if (require.main === module) main();

module.exports = { parseArgs, ENV_FORWARD };
