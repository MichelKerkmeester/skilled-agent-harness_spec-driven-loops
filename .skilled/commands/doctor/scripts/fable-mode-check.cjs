#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Fable Mode Check
// ───────────────────────────────────────────────────────────────────
'use strict';

// Read-only /doctor fable-mode diagnostic. Renders the current fable-5 behavioral
// metrics for a deep-loop artifact dir and compares them to the captured baseline.
// It never writes — a /doctor run is read-only by contract.
//
// Exit 0 when at least one metric was measured (STATUS=OK). Exit 2 with
// STATUS=ERROR when the arguments are invalid, the target is missing or not a
// directory, an explicitly passed baseline cannot be loaded, or the target
// yielded no lineage or no metric at all: a report of nothing must never read
// as a passing diagnostic.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const {
  discoverLineages,
  measureLineage,
  aggregate,
} = require('../../../skills/system-spec-kit/runtime/cli/metrics/fable-metrics.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_BASELINE = path.resolve(
  __dirname,
  '../../../skills/system-spec-kit/runtime/cli/metrics/fable-baseline.json',
);

const USAGE = [
  'Usage: fable-mode-check.cjs --dir <path> [--baseline <file>]',
  '       fable-mode-check.cjs <path> [--baseline <file>]',
  '  --dir       deep-loop artifact directory: one lineage directory, or a directory',
  '              holding lineages/ (the positional <path> is the same argument)',
  '  --baseline  baseline snapshot JSON; an empty value or no flag uses the committed',
  '              fable-baseline.json, and an explicit file that fails to load is exit 2',
  '  -h, --help  print this help',
].join('\n');

const METRIC_ROWS = [
  ['tool:text ratio (mean)', 'toolTextRatio_mean'],
  ['median words/msg', 'medianWordsPerMsg_median'],
  ['self-opener %', 'selfOpenerPct_mean'],
  ['unsolicited-caveat %', 'unsolicitedCaveatPct_mean'],
  ['evidence-backed completion', 'evidenceBackedCompletionRatio_mean'],
];

// Width of the metric-label column in the report.
const LABEL_WIDTH = 28;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** @returns {never} */
function fail(message) {
  console.error(`STATUS=ERROR fable-mode: ${message}`);
  process.exit(2);
}

function usageError(message) {
  fail(`${message}\n${USAGE}`);
}

function parseArgs(argv) {
  const opts = { dir: null, baseline: null };
  let positional = null;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help') {
      console.log(USAGE);
      process.exit(0);
    }
    if (arg === '--dir' || arg === '--baseline') {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith('-')) usageError(`${arg} needs a value`);
      i++;
      opts[arg.slice(2)] = value;
    } else if (arg.startsWith('-')) {
      usageError(`unknown argument: ${arg}`);
    } else if (positional !== null) {
      usageError(`unexpected extra argument: ${arg}`);
    } else {
      positional = arg;
    }
  }
  if (opts.dir && positional) usageError('pass the target once, as --dir <path> or as <path>');
  const target = opts.dir || positional;
  if (!target) usageError('pass --dir <path>');
  // The route always passes --baseline, empty when the operator gave none, so an
  // empty value means "use the committed snapshot" rather than an explicit file.
  return { target, baseline: opts.baseline || null };
}

function readBaseline(file) {
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  const agg = parsed && parsed.aggregate;
  if (!agg || typeof agg !== 'object' || Array.isArray(agg)) {
    throw new Error('no aggregate object in the snapshot');
  }
  return agg;
}

// An explicit baseline must load. The committed default is reported when it
// cannot be read, so the operator sees why no deltas were printed.
function loadBaseline(explicitPath) {
  if (explicitPath) {
    const abs = path.resolve(explicitPath);
    try {
      return { base: readBaseline(abs), label: abs };
    } catch (err) {
      fail(`baseline could not be loaded: ${abs} (${err.message})`);
    }
  }
  try {
    return { base: readBaseline(DEFAULT_BASELINE), label: DEFAULT_BASELINE };
  } catch (err) {
    return { base: null, label: `(none loaded: ${DEFAULT_BASELINE}: ${err.message})` };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REPORT
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const target = path.resolve(args.target);
  if (!fs.existsSync(target)) fail(`target not found: ${target}`);
  if (!fs.statSync(target).isDirectory()) fail(`target is not a directory: ${target}`);
  const { base, label } = loadBaseline(args.baseline);

  const lineages = discoverLineages(target).map((e) => measureLineage(e.dir, e.name));
  const cur = aggregate(lineages);

  const fmt = (v) => (v == null ? 'INSUFFICIENT' : String(v));
  const delta = (c, b) => (c == null || b == null
    ? ''
    : `  (Δ ${Math.round((c - b) * 100) / 100})`);

  console.log('\n/doctor fable-mode — read-only behavioral metrics');
  console.log(`target:   ${target}`);
  console.log(`baseline: ${label}\n`);
  for (const [name, key] of METRIC_ROWS) {
    const c = cur[key];
    const b = base ? base[key] : null;
    const baselineNote = b != null ? `   [baseline ${fmt(b)}]` : '';
    console.log(`  ${name.padEnd(LABEL_WIDTH)} ${fmt(c)}${delta(c, b)}${baselineNote}`);
  }
  const streamed = `${cur.lineagesWithStream} with a rich JSON stream`;
  console.log(`\n  lineages: ${cur.lineagesMeasured} (${streamed})`);
  console.log('  note: drift detectors, not quality scores — higher tool:text + evidence, '
    + 'lower words/opener/caveat = closer to the fable-5 signature.\n');

  const measured = METRIC_ROWS.filter(([, key]) => cur[key] != null).length;
  if (cur.lineagesMeasured === 0 || measured === 0) {
    fail(`nothing measured (${cur.lineagesMeasured} lineage(s), every metric INSUFFICIENT); `
      + 'point --dir at a deep-loop lineage or a directory holding lineages/');
  }
  console.log('STATUS=OK fable-mode read-only diagnostic complete');
  process.exit(0);
}

main();
