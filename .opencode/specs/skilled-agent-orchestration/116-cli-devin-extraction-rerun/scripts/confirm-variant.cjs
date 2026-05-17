#!/usr/bin/env node
/**
 * scripts/confirm-variant.cjs
 *
 * Reproducibility check for a single variant. Dispatches N fresh SWE 1.6 runs
 * (default 3) per fixture, scores each independently, and reports whether the
 * variant's score reproduces within tolerance vs a target baseline.
 *
 * Bypasses the loop.cjs cache layer so every run is a fresh dispatch (the
 * point of a confirmation run is to surface run-to-run variance, not echo it).
 *
 * Usage:
 *   node confirm-variant.cjs --variant v-mut-d68b487314246cd3 [--runs 3] [--mock]
 *
 * Outputs:
 *   - state/confirm/run-N/output-<fixture>.md         (per-dispatch markdown)
 *   - state/confirm/confirmation-results.jsonl        (per-run × fixture rows)
 *   - confirmation-report.md                          (verdict + reproducibility table)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PACKET_ROOT = path.resolve(__dirname, '..');
const EVAL_PACKET = path.resolve(PACKET_ROOT, '..', '114-cli-devin-swe16-prompt-optimization', '003-eval-loop');
const RIG_PACKET = path.resolve(PACKET_ROOT, '..', '114-cli-devin-swe16-prompt-optimization', '002-eval-rig');

const renderVariant = require(path.join(EVAL_PACKET, 'scripts', 'render-variant.cjs'));
const { dispatch } = require(path.join(EVAL_PACKET, 'scripts', 'dispatch-swe16.cjs'));
const { scoreVariantFixture } = require(path.join(EVAL_PACKET, 'scripts', 'score-variant.cjs'));

const CONFIRM_DIR = path.join(PACKET_ROOT, 'state', 'confirm');
const RESULTS_JSONL = path.join(CONFIRM_DIR, 'confirmation-results.jsonl');
const REPORT_OUT = path.join(PACKET_ROOT, 'confirmation-report.md');

const V2_RCAF_BASELINE = 0.5664;
const V3_TARGET = 0.5833;
const RUN_TO_RUN_TOLERANCE = 0.005;  // acceptable downward drift from v3 target

function sha256Hex(s) {
  return crypto.createHash('sha256').update(s, 'utf8').digest('hex');
}

function parseArgs() {
  const argv = process.argv.slice(2);
  const args = { variant: null, runs: 3, mock: false, fixtures: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--variant') args.variant = argv[++i];
    else if (a === '--runs') args.runs = parseInt(argv[++i], 10);
    else if (a === '--mock') args.mock = true;
    else if (a === '--fixtures') args.fixtures = argv[++i].split(',');
  }
  if (!args.variant) {
    process.stderr.write('usage: confirm-variant.cjs --variant <id> [--runs N] [--mock] [--fixtures fix-001,fix-002]\n');
    process.exit(2);
  }
  return args;
}

function listFixtures(filter) {
  const fixturesDir = path.join(RIG_PACKET, 'fixtures');
  const all = fs.readdirSync(fixturesDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.startsWith('fix-'))
    .map((e) => path.join(fixturesDir, e.name, 'task.json'))
    .filter((p) => fs.existsSync(p));
  if (filter && filter.length) {
    return all.filter((p) => filter.some((f) => p.includes(f)));
  }
  return all;
}

function loadVariant(variantId) {
  const file = path.join(EVAL_PACKET, 'variants', variantId + '.md');
  if (!fs.existsSync(file)) throw new Error('variant file not found: ' + file);
  return file;
}

function statsOf(scores) {
  const n = scores.length;
  if (n === 0) return { mean: 0, std: 0, min: 0, max: 0, range: 0 };
  const mean = scores.reduce((a, b) => a + b, 0) / n;
  const variance = scores.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  const std = Math.sqrt(variance);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  return { mean, std, min, max, range: max - min };
}

function reproducibilityVerdict(stats, runScores) {
  // PASS: all runs >= v2 RCAF baseline AND mean within tolerance of v3 target
  if (runScores.every((s) => s >= V2_RCAF_BASELINE) && stats.mean >= V3_TARGET - RUN_TO_RUN_TOLERANCE) {
    return { verdict: 'REPRODUCED', ship: true, reason: 'All runs >= v2 RCAF baseline AND mean within tolerance of v3 target' };
  }
  // ROUGH PASS: mean >= v2 RCAF + 0.02 (meaningful lift even if not at v3 peak)
  const meanLiftVsRcaf = stats.mean - V2_RCAF_BASELINE;
  if (meanLiftVsRcaf >= 0.02) {
    return { verdict: 'ROUGHLY_REPRODUCED', ship: true, reason: `Mean lift over v2 RCAF is +${meanLiftVsRcaf.toFixed(4)} (>= 0.02 confidence threshold)` };
  }
  // FAIL: did not reproduce
  return { verdict: 'NOT_REPRODUCED', ship: false, reason: `Mean ${stats.mean.toFixed(4)} did not exceed v2 RCAF baseline ${V2_RCAF_BASELINE} by >=0.02; v3 was likely run-to-run noise` };
}

async function runOneFixture(variantFile, fixturePath, runIdx, opts) {
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const variantId = path.basename(variantFile, '.md');
  const variantText = fs.readFileSync(variantFile, 'utf8');
  const variantHash = sha256Hex(variantText + '\x00' + fixturePath).slice(0, 16);

  // Render prompt
  const rendered = renderVariant.renderVariant({
    variant_template_path: variantFile,
    fixture,
  });

  // Write to temp prompt file
  const runDir = path.join(CONFIRM_DIR, `run-${String(runIdx).padStart(2, '0')}`);
  fs.mkdirSync(runDir, { recursive: true });
  const promptFile = path.join(runDir, `prompt-${fixture.id}.md`);
  fs.writeFileSync(promptFile, rendered.body);

  // Dispatch
  const t0 = Date.now();
  const dispatchResult = dispatch({
    prompt_file: promptFile,
    cwd: EVAL_PACKET,
    mock: opts.mock,
    mock_mode: opts.mock ? 'high-score' : undefined,
  });
  const dispatchMs = Date.now() - t0;

  const outputFile = path.join(runDir, `output-${fixture.id}.md`);
  fs.writeFileSync(outputFile, dispatchResult.stdout || '');

  if (!dispatchResult.ok) {
    return {
      runIdx,
      fixtureId: fixture.id,
      variantId,
      ok: false,
      error: dispatchResult.error || 'dispatch failed',
      paused: dispatchResult.paused === true,
      dispatchMs,
    };
  }

  // Score
  const swe16OutputText = dispatchResult.stdout;
  try {
    const scored = await scoreVariantFixture({
      variantId,
      variantHash: variantHash + '-run' + runIdx,  // bust grader cache per run
      fixturePath,
      swe16OutputText,
      rubricVersion: 'v1.0.0',
      mode: opts.mock ? 'mock' : 'real',
      mockMode: opts.mock ? 'high-confidence' : undefined,
    });
    return {
      runIdx,
      fixtureId: fixture.id,
      variantId,
      ok: true,
      weightedScore: scored.weightedScore,
      hard_gate_failed: scored.hard_gate_failed,
      dispatchMs,
      details: {
        d1: scored.deterministic.acceptance.score,
        d2: scored.deterministic.bundleGate.score,
        d3: scored.deterministic.cwdCheck.score,
        d4: scored.grader.score,
        d5: scored.deterministic.preplanning.score,
      },
    };
  } catch (err) {
    return {
      runIdx,
      fixtureId: fixture.id,
      variantId,
      ok: false,
      error: 'score failed: ' + err.message,
      dispatchMs,
    };
  }
}

async function main() {
  const args = parseArgs();
  const variantFile = loadVariant(args.variant);
  const fixtures = listFixtures(args.fixtures);
  process.stderr.write(`Confirmation: variant=${args.variant} runs=${args.runs} fixtures=${fixtures.length} mock=${args.mock}\n`);

  // Reset results
  fs.mkdirSync(CONFIRM_DIR, { recursive: true });
  fs.writeFileSync(RESULTS_JSONL, '');

  // Force-enable extraction for parity with v3 scoring environment
  if (!process.env.EVAL_LOOP_EXTRACT) process.env.EVAL_LOOP_EXTRACT = 'true';

  const runScores = [];        // weighted per-run aggregate
  const perRunDetails = [];     // per-run × per-fixture
  for (let r = 1; r <= args.runs; r++) {
    process.stderr.write(`\n=== Run ${r}/${args.runs} ===\n`);
    const runFixtures = [];
    for (const fp of fixtures) {
      const result = await runOneFixture(variantFile, fp, r, args);
      fs.appendFileSync(RESULTS_JSONL, JSON.stringify(result) + '\n');
      runFixtures.push(result);
      process.stderr.write(`  ${result.fixtureId}: ${result.ok ? result.weightedScore.toFixed(4) : 'FAIL ' + result.error}\n`);
      if (result.paused) {
        process.stderr.write('Pause sentinel hit — aborting confirmation run.\n');
        return;
      }
    }
    const okResults = runFixtures.filter((f) => f.ok);
    const aggregate = okResults.reduce((a, b) => a + b.weightedScore, 0) / (okResults.length || 1);
    runScores.push(aggregate);
    perRunDetails.push(runFixtures);
    process.stderr.write(`Run ${r} aggregate: ${aggregate.toFixed(4)} (${okResults.length}/${runFixtures.length} ok)\n`);
  }

  const stats = statsOf(runScores);
  const verdict = reproducibilityVerdict(stats, runScores);

  // Per-fixture variance across runs
  const fixtureIds = Array.from(new Set(perRunDetails.flat().map((r) => r.fixtureId))).sort();
  const perFixtureVar = fixtureIds.map((fid) => {
    const scores = perRunDetails.map((run) => {
      const match = run.find((r) => r.fixtureId === fid);
      return match && match.ok ? match.weightedScore : null;
    }).filter((s) => s !== null);
    return { fixtureId: fid, scores, stats: statsOf(scores) };
  });

  // Write report
  const lines = [
    '# Confirmation Report — v-mut-d68b487314246cd3 (CONTEXT framework)',
    '',
    `**Generated**: ${new Date().toISOString()}`,
    `**Variant**: ${args.variant}`,
    `**Runs**: ${args.runs}`,
    `**Fixtures per run**: ${fixtures.length}`,
    `**Mode**: ${args.mock ? 'MOCK' : 'REAL (SWE 1.6 + claude-sonnet grader)'}`,
    '',
    '## Per-run aggregate scores',
    '',
    '| Run | Aggregate score | Δ vs v3 target (0.5833) | Δ vs v2 RCAF (0.5664) |',
    '|-----|-----------------|--------------------------|------------------------|',
    ...runScores.map((s, i) => `| ${i + 1} | ${s.toFixed(4)} | ${(s - V3_TARGET >= 0 ? '+' : '') + (s - V3_TARGET).toFixed(4)} | ${(s - V2_RCAF_BASELINE >= 0 ? '+' : '') + (s - V2_RCAF_BASELINE).toFixed(4)} |`),
    '',
    '## Aggregate statistics',
    '',
    `- **Mean**: ${stats.mean.toFixed(4)}`,
    `- **Std**: ${stats.std.toFixed(4)}`,
    `- **Min**: ${stats.min.toFixed(4)}`,
    `- **Max**: ${stats.max.toFixed(4)}`,
    `- **Range**: ${stats.range.toFixed(4)}`,
    `- **v3 original**: ${V3_TARGET}`,
    `- **v2 RCAF baseline**: ${V2_RCAF_BASELINE}`,
    `- **Mean lift over v2 RCAF**: ${(stats.mean - V2_RCAF_BASELINE >= 0 ? '+' : '') + (stats.mean - V2_RCAF_BASELINE).toFixed(4)}`,
    '',
    '## Per-fixture variance',
    '',
    '| Fixture | ' + runScores.map((_, i) => 'Run ' + (i + 1)).join(' | ') + ' | Mean | Range |',
    '|---------|' + runScores.map(() => '------').join('|') + '|------|-------|',
    ...perFixtureVar.map((pf) => `| ${pf.fixtureId} | ${pf.scores.map((s) => s.toFixed(3)).join(' | ')} | ${pf.stats.mean.toFixed(3)} | ${pf.stats.range.toFixed(3)} |`),
    '',
    '## Verdict',
    '',
    `**${verdict.verdict}** — ${verdict.reason}`,
    '',
    `**Ship v1.0.6.0**: ${verdict.ship ? 'YES' : 'NO'}`,
    '',
  ];
  fs.writeFileSync(REPORT_OUT, lines.join('\n') + '\n');

  process.stderr.write(`\nConfirmation complete.\n`);
  process.stderr.write(`  Mean: ${stats.mean.toFixed(4)} (target ${V3_TARGET}, baseline ${V2_RCAF_BASELINE})\n`);
  process.stderr.write(`  Verdict: ${verdict.verdict}\n`);
  process.stderr.write(`  Ship: ${verdict.ship ? 'YES' : 'NO'}\n`);
  process.stderr.write(`  Report: ${REPORT_OUT}\n`);
}

if (require.main === module) main().catch((err) => { process.stderr.write(err.stack); process.exit(1); });

module.exports = { statsOf, reproducibilityVerdict, V2_RCAF_BASELINE, V3_TARGET };
