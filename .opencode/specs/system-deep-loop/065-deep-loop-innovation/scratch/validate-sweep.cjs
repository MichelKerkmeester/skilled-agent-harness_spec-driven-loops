#!/usr/bin/env node
/**
 * Validate every spec folder under the packet independently (--strict), since a
 * single --recursive pass on the root only descends one level. Reports the pass
 * count and every folder that fails, with its failing checks.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const R = path.join(REPO, '.opencode/specs/system-deep-loop/065-deep-loop-innovation');
const VALIDATE = path.join(REPO, '.opencode/skills/system-spec-kit/scripts/spec/validate.sh');

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
folders.push(R);

let pass = 0;
const fails = [];
for (const f of folders) {
  const rel = f.replace(REPO + '/', '');
  const r = spawnSync('bash', [VALIDATE, rel, '--strict'], { encoding: 'utf8' });
  const out = (r.stdout || '') + (r.stderr || '');
  if (r.status === 0) { pass++; continue; }
  const checks = out.split('\n').filter((l) => /^x |^! /.test(l)).map((l) => l.trim());
  fails.push({ folder: f.replace(R + '/', '').replace(R, '<root>'), checks });
}

console.log(`SWEEP: ${pass}/${folders.length} folders PASSED`);
if (fails.length) {
  console.log(`FAILED (${fails.length}):`);
  for (const { folder, checks } of fails) console.log(`  ${folder}\n    ${checks.join('\n    ')}`);
}
