#!/usr/bin/env node
/**
 * Refresh description.json + graph-metadata.json only for the folders whose docs
 * actually changed. Editing a doc invalidates its stored integrity fingerprint,
 * so the metadata must be regenerated (not hand-edited). Scoped to changed folders
 * so untouched trees (e.g. the read-only research phases) keep their existing
 * metadata and timestamps instead of churning. Deepest-first so a parent derives
 * its children list from already-refreshed child metadata.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync, execSync } = require('child_process');

const REPO = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const REL = '.opencode/specs/system-deep-loop/065-deep-loop-innovation';
const R = path.join(REPO, REL);
const GEN = path.join(REPO, '.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js');
const BF = path.join(REPO, '.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js');

// Every changed markdown doc under the packet (staged or not), excluding tooling.
const changed = execSync(`git -C "${REPO}" diff HEAD --name-only -- "${REL}"`, { encoding: 'utf8' })
  .split('\n')
  .filter((f) => f.endsWith('.md') && !f.includes('/scratch/'));

const dirs = [...new Set(changed.map((f) => path.join(REPO, path.dirname(f))))]
  .filter((d) => fs.existsSync(path.join(d, 'spec.md')));
dirs.sort((a, b) => b.split('/').length - a.split('/').length);

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
for (const f of dirs) {
  const L = levelOf(f);
  try { fs.unlinkSync(path.join(f, 'graph-metadata.json')); } catch (_) { /* absent */ }
  try { fs.unlinkSync(path.join(f, 'description.json')); } catch (_) { /* absent */ }
  let r = run('node', [GEN, f, REPO, '--level', L]);
  if (r.status !== 0) { fails.push([f, 'gen-desc', r.out.trim().split('\n').pop()]); continue; }
  r = run('node', [BF, f]);
  if (r.status !== 0) { fails.push([f, 'backfill', r.out.trim().split('\n').pop()]); continue; }
  ok++;
}
console.log(`regenerated ${ok}/${dirs.length} changed folders (deepest-first)`);
if (fails.length) {
  console.log(`FAILS (${fails.length}):`);
  for (const [f, step, msg] of fails) console.log(`  ${f.replace(R + '/', '')} [${step}]: ${msg}`);
}
