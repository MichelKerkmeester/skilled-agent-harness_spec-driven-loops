#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ ci-skill-derived-freshness — fleet gate: derived block matches disk       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Fails when any skill root's graph-metadata.json `derived` block is stale
// against what is actually on disk: a key_files / source_docs / entities path
// that no longer exists, or a required field gone missing. This is the drift
// the 029 research ranked highest — a `derived` block that was hand-enriched
// once and then rots as the corpus changes underneath it.
//
// It runs the regenerator's pure repair in-memory (no writes) and reports any
// root where the repaired block would differ from the committed one. Because the
// regenerator preserves authored content, a clean fleet passes byte-for-byte.
//
// Exit codes (aligned with ci-leaf-manifest-freshness / ci-skill-root-metadata):
//   0  every derived block is fresh
//   1  one or more blocks are stale (a repair would change them)
//   2  the gate could not run (skills dir missing or not a directory)

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const regen = require('./regenerate-skill-derived.cjs');

function run(argv = process.argv.slice(2)) {
  let skillsDir = regen.SKILLS_DIR;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--skills-dir') { skillsDir = path.resolve(argv[i + 1]); i += 1; }
  }

  let stat;
  try { stat = fs.statSync(skillsDir); } catch { stat = null; }
  if (!stat || !stat.isDirectory()) {
    process.stderr.write(`ci-skill-derived-freshness: skills dir not found or not a directory: ${skillsDir}\n`);
    return 2;
  }

  const roots = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules')
    .map((e) => path.join(skillsDir, e.name))
    .filter((dir) => fs.existsSync(path.join(dir, 'graph-metadata.json')));

  const stale = [];
  const errored = [];
  let checked = 0;

  for (const dir of roots) {
    const meta = JSON.parse(fs.readFileSync(path.join(dir, 'graph-metadata.json'), 'utf8'));
    if (meta.schema_version !== 2 || !meta.derived) continue;
    checked += 1;
    const { derived: repaired, changes, errors } = regen.repairDerived(dir, meta.derived);
    if (errors.length) {
      errored.push({ name: path.basename(dir), errors });
    } else if (regen.derivedChanged(meta.derived, repaired)) {
      stale.push({ name: path.basename(dir), changes });
    }
  }

  const format = argv.includes('--format') ? argv[argv.indexOf('--format') + 1] : 'text';
  if (format === 'json') {
    process.stdout.write(`${JSON.stringify({ checked, stale: stale.length, errored: errored.length, staleRoots: stale, erroredRoots: errored }, null, 2)}\n`);
  } else {
    for (const s of stale) process.stdout.write(`STALE  ${s.name}: ${(s.changes || []).join('; ')}\n`);
    for (const e of errored) process.stderr.write(`ERROR  ${e.name}: ${e.errors.join('; ')}\n`);
    process.stdout.write(`\nchecked=${checked} fresh=${checked - stale.length - errored.length} stale=${stale.length} errored=${errored.length}\n`);
  }

  if (errored.length || stale.length) return 1;
  return 0;
}

module.exports = { run };

if (require.main === module) {
  process.exit(run());
}
