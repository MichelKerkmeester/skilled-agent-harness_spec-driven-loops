#!/usr/bin/env node
/**
 * scripts/converge.cjs
 *
 * Three-signal weighted-vote convergence evaluator per council-report.md.
 * Composite stopScore = plateau*0.40 + exhaustion*0.35 + MAD*0.25.
 * stopScore > 0.60 triggers STOP candidate; legal-stop bundle gates final stop.
 */

const fs = require('fs');
const path = require('path');

const PACKET_ROOT = path.resolve(__dirname, '..');
const config = require(path.join(PACKET_ROOT, 'state', 'eval-loop-config.json'));

function readState(statePath) {
  if (!fs.existsSync(statePath)) return [];
  return fs.readFileSync(statePath, 'utf8').split('\n').filter((l) => l.trim()).map((l) => {
    try { return JSON.parse(l); } catch (_) { return null; }
  }).filter(Boolean);
}

function iterationRows(rows) {
  return rows.filter((r) => r.type === 'iteration' && typeof r.variantScore === 'number');
}

function plateauSignal(iters, cfg) {
  if (iters.length < cfg.plateau_min_iters) return { value: 0, reason: 'insufficient_iters' };
  const window = iters.slice(-cfg.plateau_window - 1);
  if (window.length < 2) return { value: 0, reason: 'insufficient_window' };
  const scores = window.map((r) => r.variantScore);
  // delta over last `window` iterations
  const recent = scores.slice(1);
  const baseline = scores[0];
  const maxDelta = Math.max(...recent.map((s) => Math.abs(s - baseline)));
  // Lower delta => higher plateau signal
  if (maxDelta < cfg.plateau_delta_threshold) return { value: 1.0, reason: 'plateau_detected', max_delta: maxDelta };
  // Partial credit: scale linearly
  const ratio = Math.max(0, 1 - (maxDelta / (cfg.plateau_delta_threshold * 5)));
  return { value: ratio, reason: 'plateau_partial', max_delta: maxDelta };
}

function exhaustionSignal(iters, cfg, mutationCoverage) {
  if (iters.length < cfg.exhaustion_min_iters) return { value: 0, reason: 'insufficient_iters' };
  if (!mutationCoverage) return { value: 0, reason: 'no_coverage_data' };
  const exhausted = (mutationCoverage.exhausted_signatures || []).length;
  const proposed = (mutationCoverage.proposed_signatures || []).length;
  if (proposed === 0) return { value: 0, reason: 'no_proposals' };
  const ratio = exhausted / proposed;
  if (ratio > cfg.exhaustion_ratio_threshold) return { value: 1.0, reason: 'axis_exhausted', ratio };
  return { value: ratio / cfg.exhaustion_ratio_threshold, reason: 'partial', ratio };
}

function madSignal(iters, cfg) {
  if (iters.length < cfg.mad_min_iters) return { value: 0, reason: 'insufficient_iters' };
  const recent = iters.slice(-cfg.mad_min_iters).map((r) => r.variantScore);
  const median = recent.slice().sort((a, b) => a - b)[Math.floor(recent.length / 2)];
  const deviations = recent.map((s) => Math.abs(s - median));
  const mad = deviations.slice().sort((a, b) => a - b)[Math.floor(deviations.length / 2)];
  if (mad < cfg.mad_threshold) return { value: 1.0, reason: 'noise_floor_reached', mad };
  // Scale: closer to threshold = higher signal
  const ratio = Math.max(0, 1 - (mad / (cfg.mad_threshold * 5)));
  return { value: ratio, reason: 'partial', mad };
}

function legalStopGate(rows, bestVariant, cfg) {
  const iters = iterationRows(rows);
  // Coverage: every fixture must have >= min variants scored
  const fixtureCounts = {};
  for (const it of iters) {
    if (!it.fixtureResults) continue;
    for (const fr of it.fixtureResults) {
      fixtureCounts[fr.fixtureId] = (fixtureCounts[fr.fixtureId] || 0) + 1;
    }
  }
  const coverage = Object.values(fixtureCounts).length > 0
    && Object.values(fixtureCounts).every((c) => c >= cfg.min_variants_per_fixture);

  // Quality: best-variant score must exceed floor
  const quality = bestVariant && bestVariant.variantScore >= cfg.min_best_variant_score;

  // Budget: dispatches < cap
  let totalDispatches = 0;
  for (const it of iters) {
    if (it.fixtureResults) totalDispatches += it.fixtureResults.filter((fr) => !fr.cache_hit).length;
  }
  const budget = totalDispatches < config.budget.max_total_dispatches;

  return {
    pass: coverage && quality && budget,
    coverage,
    quality,
    budget,
    fixture_counts: fixtureCounts,
    best_score: bestVariant ? bestVariant.variantScore : null,
    total_dispatches: totalDispatches,
  };
}

function evaluateConvergence(opts) {
  const { statePath, bestVariantPath, mutationCoveragePath } = opts;
  const rows = readState(statePath);
  const iters = iterationRows(rows);
  const cfg = config.convergence;
  const bestVariant = bestVariantPath && fs.existsSync(bestVariantPath)
    ? JSON.parse(fs.readFileSync(bestVariantPath, 'utf8'))
    : null;
  const mutationCoverage = mutationCoveragePath && fs.existsSync(mutationCoveragePath)
    ? JSON.parse(fs.readFileSync(mutationCoveragePath, 'utf8'))
    : null;

  const plateau = plateauSignal(iters, cfg);
  const exhaustion = exhaustionSignal(iters, cfg, mutationCoverage);
  const mad = madSignal(iters, cfg);

  const stopScore =
    cfg.plateau_weight * plateau.value +
    cfg.exhaustion_weight * exhaustion.value +
    cfg.mad_weight * mad.value;

  const stopCandidate = stopScore > cfg.stop_score_threshold;
  const legalStop = legalStopGate(rows, bestVariant, cfg.legal_stop);

  // Minimum iters guard
  const iterCount = iters.length;
  const meetsMin = iterCount >= config.budget.min_iterations;

  const shouldStop = stopCandidate && legalStop.pass && meetsMin;

  return {
    iterCount,
    plateau,
    exhaustion,
    mad,
    stopScore: Math.round(stopScore * 10000) / 10000,
    stopCandidate,
    legalStopBundle: legalStop,
    meetsMin,
    shouldStop,
  };
}

function main() {
  const argv = process.argv.slice(2);
  const statePath = argv[0] || path.join(PACKET_ROOT, 'state', 'eval-loop-state.jsonl');
  const bestPath = path.join(PACKET_ROOT, 'state', 'best-variant.json');
  const coveragePath = path.join(PACKET_ROOT, 'state', 'mutation-coverage.json');
  const result = evaluateConvergence({
    statePath,
    bestVariantPath: bestPath,
    mutationCoveragePath: coveragePath,
  });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

if (require.main === module) main();

module.exports = { evaluateConvergence, plateauSignal, exhaustionSignal, madSignal, legalStopGate };
