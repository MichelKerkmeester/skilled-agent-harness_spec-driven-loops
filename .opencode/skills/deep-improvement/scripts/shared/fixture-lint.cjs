#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ fixture-lint — gradeable-fixture classification (teaching T6)            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Pilot teaching T6 (spec 143): a held-out fixture that answers with a
 * clarifying question produces no deliverable and cannot be graded — and naive
 * gate code turns that measurement gap into a false kill-switch. This lint
 * classifies fixtures from their RECORDED outputs (the honest signal: what the
 * system actually produced) so interactive/uncontracted fixtures are barred
 * from held-out sets BEFORE any paid dispatch.
 *
 * Usage:
 *   node fixture-lint.cjs --outputs-dir <dir> --fixtures a,b,c [--ext .md]
 *
 * Classification per fixture (across every recorded output file matching
 * `<id>*<ext>`):
 *   deliverable   - at least one recorded output has a high-confidence
 *                   <DELIVERABLE> region
 *   uncontracted  - outputs exist but none carries the contract (medium/low)
 *   unrecorded    - no outputs found (cannot classify; record one first)
 *
 * Exit 0 when every fixture classifies `deliverable`; exit 1 otherwise (so the
 * lint can gate held-out lists in CI and loop pre-flights).
 */

const fs = require('node:fs');
const path = require('node:path');
const { extractDeliverable } = require('./extract-deliverable.cjs');

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

function classifyFixture(outputsDir, id, ext) {
  const files = fs.existsSync(outputsDir)
    ? fs.readdirSync(outputsDir).filter((f) => f.startsWith(id + '.') && f.endsWith(ext))
    : [];
  if (files.length === 0) return { id, classification: 'unrecorded', outputs: 0 };
  let best = 'low';
  for (const f of files) {
    const { confidence } = extractDeliverable(fs.readFileSync(path.join(outputsDir, f), 'utf8'));
    if (confidence === 'high') return { id, classification: 'deliverable', outputs: files.length };
    if (confidence === 'medium') best = 'medium';
  }
  return { id, classification: 'uncontracted', outputs: files.length, best_confidence: best };
}

function lintFixtures(outputsDir, fixtureIds, ext) {
  return fixtureIds.map((id) => classifyFixture(outputsDir, id, ext));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args['outputs-dir'] || !args.fixtures) {
    process.stderr.write('Usage: node fixture-lint.cjs --outputs-dir <dir> --fixtures a,b,c [--ext .md]\n');
    process.exit(2);
  }
  const results = lintFixtures(args['outputs-dir'], String(args.fixtures).split(','), args.ext || '.md');
  for (const r of results) {
    process.stdout.write(`${JSON.stringify(r)}\n`);
  }
  const bad = results.filter((r) => r.classification !== 'deliverable');
  if (bad.length > 0) {
    process.stderr.write(`fixture-lint: ${bad.length} fixture(s) not gradeable (${bad.map((b) => `${b.id}:${b.classification}`).join(', ')}) — interactive or uncontracted fixtures must not be used as held-out gates (spec 143 T6)\n`);
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = { classifyFixture, lintFixtures };
