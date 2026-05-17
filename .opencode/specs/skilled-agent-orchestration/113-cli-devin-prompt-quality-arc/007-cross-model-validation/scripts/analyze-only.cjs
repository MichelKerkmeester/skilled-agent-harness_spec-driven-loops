#!/usr/bin/env node
/**
 * scripts/analyze-only.cjs
 *
 * Reads state/cross-model-results.jsonl and regenerates analysis.md
 * across all models + variants present in the JSONL. Used when the
 * harness was invoked piecewise (per-phase --append) so the latest
 * analysis.md from a single phase doesn't cover the union of data.
 *
 * No dispatching. No scoring. Pure aggregation.
 */

const fs = require('fs');
const path = require('path');
const { buildAnalysis } = require('./cross-model-confirm.cjs');

const PACKET_ROOT = path.resolve(__dirname, '..');
const RESULTS_JSONL = path.join(PACKET_ROOT, 'state', 'cross-model-results.jsonl');
const ANALYSIS_OUT = path.join(PACKET_ROOT, 'analysis.md');
const RIG_PACKET = path.resolve(PACKET_ROOT, '..', '002-eval-rig');

function listFixtures() {
  const fixturesDir = path.join(RIG_PACKET, 'fixtures');
  return fs.readdirSync(fixturesDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.startsWith('fix-'))
    .map((e) => path.join(fixturesDir, e.name, 'task.json'))
    .filter((p) => fs.existsSync(p));
}

function main() {
  if (!fs.existsSync(RESULTS_JSONL)) {
    process.stderr.write('No results JSONL at ' + RESULTS_JSONL + '\n');
    process.exit(1);
  }
  const rows = fs.readFileSync(RESULTS_JSONL, 'utf8').split('\n')
    .filter((l) => l.trim())
    .map((l) => { try { return JSON.parse(l); } catch (_) { return null; } })
    .filter(Boolean);

  // Discover models + variants from the rows
  const models = Array.from(new Set(rows.map((r) => r.model))).sort();
  const variants = Array.from(new Set(rows.map((r) => r.variantId))).sort();
  const fixtures = listFixtures();

  process.stderr.write(`Analyzing ${rows.length} rows: ${models.length} models x ${variants.length} variants\n`);
  process.stderr.write(`Models: ${models.join(', ')}\n`);
  process.stderr.write(`Variants: ${variants.join(', ')}\n`);

  const analysis = buildAnalysis(rows, models, variants, fixtures);
  fs.writeFileSync(ANALYSIS_OUT, analysis);
  process.stderr.write(`Wrote ${ANALYSIS_OUT}\n`);
}

if (require.main === module) main();
