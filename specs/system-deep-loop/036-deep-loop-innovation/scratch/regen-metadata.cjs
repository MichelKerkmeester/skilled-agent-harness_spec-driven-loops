#!/usr/bin/env node
/**
 * Regenerate description.json + graph-metadata.json for every spec folder under
 * the packet after the flatten/renumber. The docs' references changed, so both
 * the derived paths and the integrity fingerprints are stale; regenerating (not
 * hand-editing) is the only way to refresh the fingerprint the strict validator
 * checks. Processed deepest-first so a parent's children_ids derive from
 * already-refreshed child metadata. The packet-root parent is handled separately.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const R = path.join(REPO, '.opencode/specs/system-deep-loop/065-deep-loop-innovation');
const GEN = path.join(REPO, '.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js');
const BF = path.join(REPO, '.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js');

function walk(dir, acc) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'scratch') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (fs.existsSync(path.join(p, 'spec.md'))) acc.push(p);
      walk(p, acc);
    }
  }
  return acc;
}

const folders = walk(R, []);
folders.push(R); // the packet root parent itself, processed last (shallowest)
folders.sort((a, b) => b.split('/').length - a.split('/').length);

function levelOf(f) {
  const m = fs.readFileSync(path.join(f, 'spec.md'), 'utf8').match(/SPECKIT_LEVEL:\s*([0-9])/);
  return m ? m[1] : '2';
}
function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8' });
  return { status: r.status, out: (r.stderr || '') + (r.stdout || '') };
}

let ok = 0;
const fails = [];
for (const f of folders) {
  const L = levelOf(f);
  // Clear derived files first: backfill MERGES into an existing graph-metadata,
  // so a stale pre-move children list would survive. Fresh derivation from disk.
  try { fs.unlinkSync(path.join(f, 'graph-metadata.json')); } catch (_) { /* absent */ }
  try { fs.unlinkSync(path.join(f, 'description.json')); } catch (_) { /* absent */ }
  let r = run('node', [GEN, f, REPO, '--level', L]);
  if (r.status !== 0) { fails.push([f, 'gen-desc', r.out.trim().split('\n').pop()]); continue; }
  r = run('node', [BF, f]);
  if (r.status !== 0) { fails.push([f, 'backfill', r.out.trim().split('\n').pop()]); continue; }
  ok++;
}
console.log(`regenerated ${ok}/${folders.length} folders (deepest-first)`);
if (fails.length) {
  console.log(`FAILS (${fails.length}):`);
  for (const [f, step, msg] of fails) console.log(`  ${f.replace(R + '/', '')} [${step}]: ${msg}`);
}
