#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Alignment — CONVERGE-state Decision                                 ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  --spec-folder P [--max-iterations N] [--coverage-threshold F]    ║
// ║         [--stability-window N] [--convergence-mode default|off] [--json] ║
// ║ Output: one JSON decision object on stdout.                              ║
// ║ Exit:   0=ok, 1=script error, 3=input validation error.                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Single-shot convergence check for the deep-alignment loop, invoked once per
// iteration by the loop's own command workflow -- it does not loop
// or dispatch itself, mirroring every other runtime script in this hub
// (loop-lock.cjs, convergence.cjs, reduce-state.cjs are all single-shot CLI
// tools an external orchestrator calls repeatedly, never self-looping
// dispatchers). deep-alignment/SKILL.md's own "FORBIDDEN INVOCATION PATTERNS"
// rules out a custom bash/shell dispatcher that parallelizes lanes or
// iterations -- this script is deliberately NOT that.
//
// This is a documented manual coverage-check fallback:
// `runtime/scripts/convergence.cjs`'s loopType enum does not accept
// "alignment" (research | review | council | context only), and this script's
// scope treats that file as read-only analysis, not an edit target.
// Recommending the enum-extension is a separate design decision; performing it
// is out of scope here. The full reasoning trail lives in this loop's planning
// docs (its Affected Surfaces / Files to Change tables), kept in prose
// deliberately rather than embedded as a machine-parsed pointer.
//
// The threshold combination: coverage AND dry-run-stability must BOTH
// hold before CONVERGED is reported (never OR) -- full coverage with unstable
// findings is not done, and a stable-but-uncovered run is not done either.
// max-iterations is an INDEPENDENT hard stop applied after that AND-pair,
// regardless of its outcome.

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const { reduceAlignmentState } = require('../../runtime/scripts/reduce-alignment-state.cjs');
const { resolveArtifactRoot } = require('../../runtime/lib/deep-loop/artifact-root.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_MAX_ITERATIONS = 10;
const DEFAULT_COVERAGE_THRESHOLD = 1.0; // every discovered artifact must be checked at least once
const DEFAULT_STABILITY_WINDOW = 2; // N consecutive zero-new-findings iterations
const DEFAULT_CONVERGENCE_MODE = 'default';
const CONVERGENCE_MODES = Object.freeze(['default', 'off']);

const DECISIONS = Object.freeze({
  CONVERGED: 'CONVERGED',
  CONTINUE: 'CONTINUE',
  STOP_MAX_ITERATIONS: 'STOP_MAX_ITERATIONS',
  NOTHING_TO_CONVERGE: 'NOTHING_TO_CONVERGE',
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function inputError(message) {
  const err = new Error(message);
  err.code = 'INPUT_VALIDATION';
  return err;
}

function classifyExitCode(err) {
  return err && typeof err === 'object' && err.code === 'INPUT_VALIDATION' ? 3 : 1;
}

function readJsonlIterationRecords(stateLogPath) {
  if (!fs.existsSync(stateLogPath)) return [];
  const raw = fs.readFileSync(stateLogPath, 'utf8');
  const records = [];
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const record = JSON.parse(trimmed);
      if (record && record.type === 'iteration') records.push(record);
    } catch (_) {
      // Malformed lines are the reducer's concern (corruptionWarnings); this
      // check only needs a best-effort ordered view of well-formed iterations.
    }
  }
  return records;
}

/**
 * A lane's discovered corpus size, from the DISCOVER-state output
 * (deep-alignment-corpus.json). Absent file or absent lane entry means
 * DISCOVER has not run yet for that lane -- treated as zero, not an error,
 * so a mid-run CONVERGE check on a not-yet-discovered lane degrades to
 * "not yet covered" rather than throwing.
 *
 * @param {string} alignmentDir
 * @returns {Record<string, number>} laneId -> discovered artifact count
 */
function readCorpusSizes(alignmentDir) {
  const corpusPath = path.join(alignmentDir, 'deep-alignment-corpus.json');
  if (!fs.existsSync(corpusPath)) return {};
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(corpusPath, 'utf8'));
  } catch (_) {
    return {};
  }
  const sizes = {};
  for (const lane of Array.isArray(parsed && parsed.lanes) ? parsed.lanes : []) {
    if (lane && typeof lane.laneId === 'string' && Array.isArray(lane.artifacts)) {
      sizes[lane.laneId] = lane.artifacts.length;
    }
  }
  return sizes;
}

/**
 * Artifact-coverage percentage across all APPLICABLE lanes (a lane with zero
 * discovered artifacts contributes to neither side of the ratio -- it is
 * vacuously covered, mirroring reduce-alignment-state.cjs's own NOT_APPLICABLE
 * treatment rather than inventing a second convention).
 *
 * @param {Array<Object>} laneEntries - registry.lanes from reduceAlignmentState()
 * @param {Record<string, number>} corpusSizes - laneId -> discovered count
 * @returns {{coverage: number, checked: number, discovered: number}}
 */
function computeArtifactCoverage(laneEntries, corpusSizes) {
  let checked = 0;
  let discovered = 0;
  for (const entry of laneEntries) {
    const laneDiscovered = corpusSizes[entry.laneId] || 0;
    if (laneDiscovered === 0) continue; // vacuous lane, excluded from both sides
    discovered += laneDiscovered;
    checked += Math.min(entry.artifactsChecked, laneDiscovered);
  }
  const coverage = discovered > 0 ? checked / discovered : 1.0; // no applicable lane => trivially covered
  return { coverage, checked, discovered };
}

/**
 * Dry-run stability: the last `window` iteration records (across ALL lanes,
 * in state-log append order) must all report newFindingsRatio === 0. Fewer
 * than `window` iterations recorded yet means stability is not evaluable --
 * fail-closed to "not stable" rather than vacuously true, so a fresh run
 * can never CONVERGE on its first iteration by definition alone.
 *
 * @param {Array<Object>} iterationRecords
 * @param {number} window
 * @returns {{stable: boolean, sampleSize: number, reason: string}}
 */
function computeDryRunStability(iterationRecords, window) {
  if (iterationRecords.length < window) {
    return { stable: false, sampleSize: iterationRecords.length, reason: `fewer than ${window} iterations recorded` };
  }
  const tail = iterationRecords.slice(-window);
  const allZero = tail.every((record) => typeof record.newFindingsRatio === 'number' && record.newFindingsRatio === 0);
  return {
    stable: allZero,
    sampleSize: tail.length,
    reason: allZero
      ? `last ${window} iteration(s) reported zero new findings`
      : `at least one of the last ${window} iteration(s) reported new findings (or an unrecognized newFindingsRatio)`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {string} specFolder
 * @param {{maxIterations?: number, coverageThreshold?: number, stabilityWindow?: number, convergenceMode?: string}} [options]
 * @returns {Object} decision payload
 */
function checkConvergence(specFolder, options = {}) {
  const maxIterations = options.maxIterations ?? DEFAULT_MAX_ITERATIONS;
  const coverageThreshold = options.coverageThreshold ?? DEFAULT_COVERAGE_THRESHOLD;
  const stabilityWindow = options.stabilityWindow ?? DEFAULT_STABILITY_WINDOW;
  const convergenceMode = options.convergenceMode ?? DEFAULT_CONVERGENCE_MODE;
  if (!CONVERGENCE_MODES.includes(convergenceMode)) {
    throw inputError(`convergenceMode must be one of: ${CONVERGENCE_MODES.join(', ')}`);
  }

  const resolvedSpecFolder = path.resolve(specFolder);
  const { artifactDir: alignmentDir } = resolveArtifactRoot(resolvedSpecFolder, 'alignment');
  const stateLogPath = path.join(alignmentDir, 'deep-alignment-state.jsonl');

  const { registry } = reduceAlignmentState(resolvedSpecFolder, { write: false });
  const iterationRecords = readJsonlIterationRecords(stateLogPath);
  const corpusSizes = readCorpusSizes(alignmentDir);

  if (registry.overall.nothingToConverge) {
    return {
      decision: DECISIONS.NOTHING_TO_CONVERGE,
      reason: 'zero applicable lanes (no lanes resolved, or every lane discovered zero artifacts)',
      iterationsRun: iterationRecords.length,
      maxIterations,
      convergenceMode,
      coverage: null,
      stability: null,
      overallVerdict: registry.overall.verdict,
    };
  }

  const { coverage, checked, discovered } = computeArtifactCoverage(registry.lanes, corpusSizes);
  const stability = computeDryRunStability(iterationRecords, stabilityWindow);
  const coverageMet = coverage >= coverageThreshold;
  const converged = convergenceMode === 'default' && coverageMet && stability.stable; // AND, never OR -- see file header
  const maxIterationsHit = iterationRecords.length >= maxIterations;

  let decision;
  if (converged) {
    decision = DECISIONS.CONVERGED;
  } else if (maxIterationsHit) {
    decision = DECISIONS.STOP_MAX_ITERATIONS; // independent hard stop regardless of the AND-pair
  } else {
    decision = DECISIONS.CONTINUE;
  }

  return {
    decision,
    reason: convergenceMode === 'off' && maxIterationsHit
      ? `convergence disabled; max-iterations (${maxIterations}) reached`
      : convergenceMode === 'off'
        ? `convergence disabled; forcing all ${maxIterations} iteration(s) (${iterationRecords.length} recorded)`
        : converged
      ? `coverage ${(coverage * 100).toFixed(1)}% >= threshold ${(coverageThreshold * 100).toFixed(1)}% AND ${stability.reason}`
      : maxIterationsHit
        ? `not converged (coverage ${(coverage * 100).toFixed(1)}%, ${stability.reason}) but max-iterations (${maxIterations}) reached`
        : `not yet converged: coverage ${(coverage * 100).toFixed(1)}% (need ${(coverageThreshold * 100).toFixed(1)}%), ${stability.reason}`,
    iterationsRun: iterationRecords.length,
    maxIterations,
    convergenceMode,
    coverage: { ratio: Math.round(coverage * 1000) / 1000, checked, discovered, threshold: coverageThreshold, met: coverageMet },
    stability: { ...stability, window: stabilityWindow },
    overallVerdict: registry.overall.verdict,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CLI
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--spec-folder') { args.specFolder = argv[i + 1]; i += 1; }
    else if (token === '--max-iterations') { args.maxIterations = Number(argv[i + 1]); i += 1; }
    else if (token === '--coverage-threshold') { args.coverageThreshold = Number(argv[i + 1]); i += 1; }
    else if (token === '--stability-window') { args.stabilityWindow = Number(argv[i + 1]); i += 1; }
    else if (token === '--convergence-mode') { args.convergenceMode = argv[i + 1]; i += 1; }
    else if (token === '--json') { args.json = true; }
    else if (token === '--help' || token === '-h') { args.help = true; }
    else { throw inputError(`Unexpected argument: ${token}`); }
  }
  return args;
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write(
      'Usage: check-convergence.cjs --spec-folder <path> [--max-iterations N] '
      + '[--coverage-threshold F] [--stability-window N] '
      + '[--convergence-mode default|off] [--json]\n',
    );
    return 0;
  }
  if (!args.specFolder) throw inputError('--spec-folder is required');

  const result = checkConvergence(args.specFolder, {
    maxIterations: Number.isFinite(args.maxIterations) ? args.maxIterations : undefined,
    coverageThreshold: Number.isFinite(args.coverageThreshold) ? args.coverageThreshold : undefined,
    stabilityWindow: Number.isFinite(args.stabilityWindow) ? args.stabilityWindow : undefined,
    convergenceMode: args.convergenceMode,
  });

  if (args.json) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } else {
    process.stdout.write(`${result.decision}: ${result.reason}\n`);
  }
  return 0;
}

if (require.main === module) {
  try {
    process.exit(main());
  } catch (err) {
    process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(classifyExitCode(err));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  DECISIONS,
  computeArtifactCoverage,
  computeDryRunStability,
  readCorpusSizes,
  readJsonlIterationRecords,
  checkConvergence,
  main,
};
