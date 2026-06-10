#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ loop-host — mode-switching entry point for deep-improvement runs         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Mode-switching entry point for deep-improvement. Routes between the
 * existing `agent-improvement` scoring path and the new `model-benchmark`
 * pipeline. This is the seam host that was previously missing
 * (deep-improvement has no loop.cjs — orchestration is journal-based).
 *
 * Backward-compat contract: with `--mode=agent-improvement` OR no
 * `--mode` flag, behavior is identical — both route to score-candidate.cjs with
 * the same arguments, so the produced score/state output is byte-identical.
 *
 * Usage:
 *   agent-improvement (default):
 *     node loop-host.cjs [--mode=agent-improvement] --candidate=<path> [--baseline=<path>] [--output=<path>]
 *   model-benchmark:
 *     node loop-host.cjs --mode=model-benchmark --profile=<path-or-id> --outputs-dir=<path> \
 *        [--output=<path>] [--state-log=<path>] [--label=<string>] [--profiles-dir=<path>] \
 *        [--scorer=<pattern|5dim>] [--grader=<noop|mock|llm>]
 *   non-dev-ai-system-refine (Lane D):
 *     node loop-host.cjs --mode=non-dev-ai-system-refine --packaging-root=<path> \
 *        [--live] [--max-iters=<n>] [--fixtures=<a,b>] [--variants=<a,b>] \
 *        [--held-out=<a,b>] [--samples=<n>] [--proposer-model=<id>] [--grader-model=<id>]
 *
 * Unknown --mode values warn to stderr and fall back to agent-improvement.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('path');
const { spawnSync } = require('child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SCRIPTS_ROOT = __dirname;
const VALID_MODES = new Set(['agent-improvement', 'model-benchmark', 'skill-benchmark', 'non-dev-ai-system-refine']);

// Lane separation: planInvocation() returns BARE script names (e.g.
// 'score-candidate.cjs') to keep the backward-compat identity plan
// byte-identical. The real on-disk lane lives in sibling lane dirs relative to
// this file (now scripts/shared/). resolveScriptPath maps a bare name to its
// lane path at SPAWN time so the plan output never carries lane segments.
const LANE_A = new Set([
  'score-candidate.cjs',
  'generate-profile.cjs',
  'rollback-candidate.cjs',
  'candidate-lineage.cjs',
  'scan-integration.cjs',
  'check-mirror-drift.cjs',
  'trade-off-detector.cjs',
  'benchmark-stability.cjs',
]);
const LANE_MODEL_BENCHMARK = new Set([
  'run-benchmark.cjs',
  'dispatch-model.cjs',
]);
// Lane C (skill-benchmark): the orchestrator the run resolves to. Sub-scripts
// (router-replay, contamination-lint, d5-connectivity, parse-resource-loads,
// score-skill-benchmark, build-report) are required internally by the
// orchestrator, so only the entry script needs lane-path resolution here.
const LANE_SKILL_BENCHMARK = new Set([
  'run-skill-benchmark.cjs',
]);
// Lane D (non-dev-ai-system-refine): a thin adapter that spawns the loop
// host living WITH the packaging under test (<packaging-root>/_loop/loop.py).
// The guarded loop logic (frozen scoring surface, independent re-grade,
// worktree promote-N, kill-switches) belongs to the packaging, not this skill.
const LANE_NON_DEV_AI_SYSTEM = new Set([
  'run-non-dev-ai-system.cjs',
]);

// Optional flags loop-host forwards to run-non-dev-ai-system.cjs, in forwarding
// order. --packaging-root is required and handled separately. This list is
// exactly the surface run-non-dev-ai-system.cjs consumes (--live + its
// ENV_FORWARD map + --max-iters).
const NON_DEV_AI_SYSTEM_RUN_OPTIONS = [
  'live',
  'max-iters',
  'fixtures',
  'variants',
  'held-out',
  'samples',
  'proposer-model',
  'grader-model',
];

// Optional flags loop-host forwards to run-skill-benchmark.cjs, in forwarding
// order. --skill and --outputs-dir are required and handled separately. This
// list is exactly the set run-skill-benchmark.cjs's run() reads; forwarding a
// flag the orchestrator never consumes would be silently absorbed and mislead
// operators into thinking it has effect.
const SKILL_BENCHMARK_RUN_OPTIONS = [
  'fixtures-dir',
  'output',
  'trace-mode',
  'advisor-mode',
  'scenarios',
  'executor',
  'playbook-dir',
];

// Single source of truth for the optional model-benchmark flags loop-host
// forwards to run-benchmark.cjs (one shared benchmark option schema). Order is
// the forwarding order. --profile and --outputs-dir are required and handled
// separately. Keep this aligned with run-benchmark.cjs's accepted options.
const BENCHMARK_RUN_OPTIONS = [
  'output',
  'state-log',
  'label',
  'profiles-dir',
  'integration-report',
  'scorer',
  'grader',
  'samples',
  'allow-same-family',
];

// The fixture materializer also needs --profiles-dir so a profile passed by ID
// (not a path) resolves identically in BOTH steps. --profile and
// --outputs-dir are forwarded explicitly; this lists the remaining
// materialize-relevant pass-through flags.
const BENCHMARK_MATERIALIZE_OPTIONS = [
  'profiles-dir',
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map a bare lane script name to its on-disk path at spawn time.
 *
 * @param {string} scriptName - Bare script name (e.g. 'score-candidate.cjs')
 * @returns {string} Absolute path to the resolved lane script
 */
function resolveScriptPath(scriptName) {
  if (LANE_A.has(scriptName)) {
    return path.join(SCRIPTS_ROOT, '..', 'agent-improvement', scriptName);
  }
  if (LANE_MODEL_BENCHMARK.has(scriptName)) {
    return path.join(SCRIPTS_ROOT, '..', 'model-benchmark', scriptName);
  }
  if (LANE_SKILL_BENCHMARK.has(scriptName)) {
    return path.join(SCRIPTS_ROOT, '..', 'skill-benchmark', scriptName);
  }
  if (LANE_NON_DEV_AI_SYSTEM.has(scriptName)) {
    return path.join(SCRIPTS_ROOT, '..', 'non-dev-ai-system', scriptName);
  }
  // Other shared scripts (materialize-benchmark-fixtures, promote-candidate,
  // reduce-state, improvement-journal, mutation-coverage) live alongside this file.
  return path.join(SCRIPTS_ROOT, scriptName);
}

/**
 * Parse CLI argv into a flag map, supporting =-form and space-form values.
 *
 * @param {string[]} argv - Argument vector (without node/script entries)
 * @returns {Object<string, string|boolean>} Parsed flags keyed by name
 */
function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const entry = argv[index];
    const match = /^--([a-z][a-z0-9-]*)(?:=(.*))?$/.exec(entry);
    if (!match) continue;
    const key = match[1];
    if (match[2] !== undefined) {
      // =-form: byte-identical to the original behavior (identity contract).
      args[key] = match[2];
      continue;
    }
    // Bare --key: if the next token is a value (does not start with '--'),
    // consume it as the space-form value; otherwise it stays a boolean flag.
    // The Lane B command surface invokes loop-host with space-form
    // (--profile {p} --scorer 5dim --grader noop), so these must bind to the
    // following token rather than parse as booleans.
    const next = argv[index + 1];
    if (next !== undefined && !next.startsWith('--')) {
      args[key] = next;
      index += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
}

/**
 * Resolve a raw --mode value to a valid mode, defaulting unknown values.
 *
 * @param {string|undefined} rawMode - Raw --mode flag value
 * @returns {string} A valid mode, falling back to 'agent-improvement'
 */
function resolveMode(rawMode) {
  if (rawMode === undefined) return 'agent-improvement';
  if (VALID_MODES.has(rawMode)) return rawMode;
  process.stderr.write(`loop-host: unknown mode '${rawMode}', defaulting to 'agent-improvement'\n`);
  return 'agent-improvement';
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pure planner: map (mode, args) -> the ordered script invocations to run.
 * Planning is separated from execution so the backward-compat identity gate
 * the identity gate can assert byte-identical plans for the default and explicit
 * agent-improvement routes without spawning anything.
 *
 * @param {string} mode - Resolved run mode (agent-improvement, model-benchmark, skill-benchmark, non-dev-ai-system-refine)
 * @param {object} args - Parsed CLI args keyed by flag name
 * @returns {{ ok: true, steps: Array<{script: string, args: string[]}> } | { ok: false, error: string }}
 */
function planInvocation(mode, args) {
  if (mode === 'model-benchmark') {
    if (!args.profile || !args['outputs-dir']) {
      return { ok: false, error: 'model-benchmark: missing required --profile=<path-or-id> and --outputs-dir=<path>' };
    }
    // materialize MUST run (and succeed) before run-benchmark, else scoring
    // silently produces all-zero "missing-output" results. These scripts use
    // space-separated args.
    //
    // Both steps share one option schema (BENCHMARK_* lists) so forwarding stays
    // in sync with run-benchmark.cjs and the materializer, instead of a hand-rolled
    // per-flag chain that silently drifts.
    // run-benchmark.cjs forwards scorer/grader/integration-report so the journal
    // and report.json agree on the requested method; the materializer forwards
    // --profiles-dir so a profile-by-ID resolves identically in both steps.
    const materializeArgs = ['--profile', args.profile, '--outputs-dir', args['outputs-dir']];
    for (const opt of BENCHMARK_MATERIALIZE_OPTIONS) {
      if (args[opt] !== undefined) materializeArgs.push(`--${opt}`, String(args[opt]));
    }
    const benchArgs = ['--profile', args.profile, '--outputs-dir', args['outputs-dir']];
    for (const opt of BENCHMARK_RUN_OPTIONS) {
      if (args[opt] !== undefined) benchArgs.push(`--${opt}`, String(args[opt]));
    }
    return {
      ok: true,
      steps: [
        { script: 'materialize-benchmark-fixtures.cjs', args: materializeArgs },
        { script: 'run-benchmark.cjs', args: benchArgs },
      ],
    };
  }
  if (mode === 'skill-benchmark') {
    if (!args.skill || !args['outputs-dir']) {
      return { ok: false, error: 'skill-benchmark: missing required --skill=<skill-root-or-id> and --outputs-dir=<path>' };
    }
    // Single orchestrator step: run-skill-benchmark.cjs internally sequences
    // D5-gate -> router-replay -> (optional live) -> trace-parse -> score ->
    // report, so the plan stays one step (unlike Lane B's materialize+run pair).
    // Lane C scripts use space-separated args.
    const skillArgs = ['--skill', args.skill, '--outputs-dir', args['outputs-dir']];
    for (const opt of SKILL_BENCHMARK_RUN_OPTIONS) {
      if (args[opt] !== undefined) skillArgs.push(`--${opt}`, String(args[opt]));
    }
    return { ok: true, steps: [{ script: 'run-skill-benchmark.cjs', args: skillArgs }] };
  }
  if (mode === 'non-dev-ai-system-refine') {
    if (!args['packaging-root']) {
      return { ok: false, error: 'non-dev-ai-system-refine: missing required --packaging-root=<path>' };
    }
    // Single adapter step (Lane C shape): run-non-dev-ai-system.cjs validates the
    // _loop/loop.py contract and spawns the packaging's own guarded loop host.
    // Lane D scripts use space-separated args. --live is a boolean: forwarded
    // bare so the adapter's parser keeps it a flag, not a key/value pair.
    const refineArgs = ['--packaging-root', String(args['packaging-root'])];
    for (const opt of NON_DEV_AI_SYSTEM_RUN_OPTIONS) {
      if (args[opt] === undefined) continue;
      if (args[opt] === true) refineArgs.push(`--${opt}`);
      else refineArgs.push(`--${opt}`, String(args[opt]));
    }
    return { ok: true, steps: [{ script: 'run-non-dev-ai-system.cjs', args: refineArgs }] };
  }
  // agent-improvement (default). score-candidate.cjs uses key=value args.
  if (!args.candidate) {
    return { ok: false, error: 'agent-improvement: missing required --candidate=<path>' };
  }
  const scoreArgs = [`--candidate=${args.candidate}`];
  if (args.baseline) scoreArgs.push(`--baseline=${args.baseline}`);
  if (args.output) scoreArgs.push(`--output=${args.output}`);
  return { ok: true, steps: [{ script: 'score-candidate.cjs', args: scoreArgs }] };
}

function runNode(scriptName, scriptArgs) {
  const scriptPath = resolveScriptPath(scriptName);
  const res = spawnSync('node', [scriptPath, ...scriptArgs], {
    stdio: 'inherit',
    encoding: 'utf8',
  });
  return res.status == null ? 1 : res.status;
}

function runPlan(plan) {
  if (!plan.ok) {
    process.stderr.write(`loop-host: ${plan.error}\n`);
    return 2;
  }
  for (const step of plan.steps) {
    const exit = runNode(step.script, step.args);
    if (exit !== 0) {
      process.stderr.write(`loop-host: ${step.script} failed (exit ${exit}); aborting remaining steps\n`);
      return exit;
    }
  }
  return 0;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const mode = resolveMode(args.mode);
  process.exit(runPlan(planInvocation(mode, args)));
}

if (require.main === module) main();

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { parseArgs, resolveMode, planInvocation, resolveScriptPath, VALID_MODES, LANE_SKILL_BENCHMARK, LANE_NON_DEV_AI_SYSTEM };
