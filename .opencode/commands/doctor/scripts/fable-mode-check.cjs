#!/usr/bin/env node
'use strict';

// Read-only /doctor fable-mode diagnostic. Renders the current fable-5 behavioral
// metrics for a deep-loop artifact dir and compares them to the captured baseline.
// It never writes — a /doctor run is read-only by contract. Exit 0 on success,
// 2 when the target dir is missing.

const fs = require('node:fs');
const path = require('node:path');
const { discoverLineages, measureLineage, aggregate } = require('../../../skills/system-spec-kit/scripts/metrics/fable-metrics.cjs');

const DEFAULT_TARGET = path.resolve(__dirname, '../../../specs/skilled-agent-orchestration/149-operate-like-fable-5/002-fable-mode-efficiency-research/research');
const DEFAULT_BASELINE = path.resolve(__dirname, '../../../skills/system-spec-kit/scripts/metrics/fable-baseline.json');

function flag(name) { const i = process.argv.indexOf(name); return i !== -1 ? process.argv[i + 1] : null; }

function main() {
  const positional = process.argv.slice(2).find((a) => a[0] !== '-');
  const target = path.resolve(flag('--dir') || positional || DEFAULT_TARGET);
  const baselinePath = path.resolve(flag('--baseline') || DEFAULT_BASELINE);

  if (!fs.existsSync(target)) {
    console.error(`STATUS=ERROR fable-mode: target not found: ${target}`);
    process.exit(2);
  }

  const lineages = discoverLineages(target).map((e) => measureLineage(e.dir, e.name));
  const cur = aggregate(lineages);
  let base = null;
  try { base = JSON.parse(fs.readFileSync(baselinePath, 'utf8')).aggregate; } catch { /* baseline is optional */ }

  const fmt = (v) => (v == null ? 'INSUFFICIENT' : String(v));
  const delta = (c, b) => (c == null || b == null ? '' : `  (Δ ${Math.round((c - b) * 100) / 100})`);

  console.log('\n/doctor fable-mode — read-only behavioral metrics');
  console.log(`target:   ${target}`);
  console.log(`baseline: ${base ? baselinePath : '(none loaded)'}\n`);
  const rows = [
    ['tool:text ratio (mean)', 'toolTextRatio_mean'],
    ['median words/msg', 'medianWordsPerMsg_median'],
    ['self-opener %', 'selfOpenerPct_mean'],
    ['unsolicited-caveat %', 'unsolicitedCaveatPct_mean'],
    ['evidence-backed completion', 'evidenceBackedCompletionRatio_mean'],
  ];
  for (const [label, key] of rows) {
    const c = cur[key];
    const b = base ? base[key] : null;
    console.log(`  ${label.padEnd(28)} ${fmt(c)}${base ? delta(c, b) : ''}${b != null ? `   [baseline ${fmt(b)}]` : ''}`);
  }
  console.log(`\n  lineages: ${cur.lineagesMeasured} (${cur.lineagesWithStream} with a rich JSON stream)`);
  console.log('  note: drift detectors, not quality scores — higher tool:text + evidence, lower words/opener/caveat = closer to the fable-5 signature.\n');
  console.log('STATUS=OK fable-mode read-only diagnostic complete');
  process.exit(0);
}

main();
