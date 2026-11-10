#!/usr/bin/env node
/**
 * Rewrite cross-references after the implementation program was flattened out of
 * its old wrapper directly under the packet root and its phases were shifted by
 * three. Two transforms, applied to every phase-folder markdown doc:
 *   1. Drop the dissolved wrapper segment from absolute packet paths.
 *   2. Apply the slug renames (old numbered slug -> new numbered slug).
 * All slugs are full and unique, so the replacements never overlap or re-match.
 * The top-level packet docs and the derived JSON are handled separately (the
 * JSON is regenerated from the filesystem), so this only touches numbered phases.
 */
const fs = require('fs');
const path = require('path');

const ROOT = '.opencode/specs/system-deep-loop/065-deep-loop-innovation';
const WRAPPER = 'system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation';
const WRAPPER_TO = 'system-deep-loop/065-deep-loop-innovation';

// old numbered slug -> new numbered slug: the research effectiveness packet moved
// to slot 2, then the implementation phases shifted by three (keepers are absent).
const RENAMES = [
  ['005-deep-loop-effectiveness-and-fanout', '002-deep-loop-effectiveness-and-fanout'],
  ['000-baseline-taxonomy-and-state-census', '003-baseline-taxonomy-and-state-census'],
  ['001-architecture-coverage-and-transition-contract', '004-architecture-coverage-and-transition-contract'],
  ['002-fanout-live-tools-unblock', '005-fanout-live-tools-unblock'],
  ['003-transition-authorized-ledger-core', '006-transition-authorized-ledger-core'],
  ['004-shared-evidence-and-control-services', '007-shared-evidence-and-control-services'],
  ['005-compatibility-shadow-and-rollback-bridge', '008-compatibility-shadow-and-rollback-bridge'],
  ['006-fanout-fanin-durable-orchestration', '009-fanout-fanin-durable-orchestration'],
  ['007-novelty-claims-continuity-and-projections', '010-novelty-claims-continuity-and-projections'],
  ['008-convergence-termination-and-health', '011-convergence-termination-and-health'],
  ['009-shared-mode-contracts-and-fixtures', '012-shared-mode-contracts-and-fixtures'],
  ['010-mode-and-lane-migrations', '013-mode-and-lane-migrations'],
  ['011-staged-state-migration-and-authority-cutover', '014-staged-state-migration-and-authority-cutover'],
  ['012-legacy-writer-retirement', '015-legacy-writer-retirement'],
  ['013-whole-system-gate', '016-whole-system-gate'],
  ['014-integrate-latest-and-closeout', '017-integrate-latest-and-closeout'],
];

function rewrite(text) {
  let out = text;
  let hits = 0;
  // Full absolute wrapper path first, then any bare/relative wrapper mention maps
  // to the packet root (the dissolved wrapper's spec + manifest now live there).
  const beforeW = out;
  out = out.split(WRAPPER).join(WRAPPER_TO);
  if (out !== beforeW) hits++;
  const beforeB = out;
  out = out.split('006-recommendations-implementation').join('065-deep-loop-innovation');
  if (out !== beforeB) hits++;
  for (const [from, to] of RENAMES) {
    const before = out;
    out = out.split(from).join(to);
    if (out !== before) hits++;
  }
  return { out, hits };
}

function walk(dir, acc) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.md')) acc.push(p);
  }
  return acc;
}

// Every markdown doc under the packet except the authoring scratch tree: the
// research packets, the numbered phases, and the top-level packet docs.
const files = [];
let phaseDirs = 0;
for (const e of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (e.name === 'scratch') continue;
  const p = path.join(ROOT, e.name);
  if (e.isDirectory()) { walk(p, files); phaseDirs++; }
  else if (e.name.endsWith('.md')) files.push(p);
}

let changed = 0;
let totalHits = 0;
const samples = [];
for (const f of files) {
  const orig = fs.readFileSync(f, 'utf8');
  const { out, hits } = rewrite(orig);
  if (out !== orig) {
    fs.writeFileSync(f, out);
    changed++;
    totalHits += hits;
    if (samples.length < 6) samples.push(f.replace(ROOT + '/', ''));
  }
}
console.log(`scanned ${files.length} markdown files across ${phaseDirs.length} phase folders`);
console.log(`rewrote ${changed} files (${totalHits} transform-hits)`);
console.log('sample changed files:\n  ' + samples.join('\n  '));
