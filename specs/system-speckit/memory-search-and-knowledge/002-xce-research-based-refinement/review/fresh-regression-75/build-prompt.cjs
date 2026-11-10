#!/usr/bin/env node
'use strict';
// Render one seat prompt from _contract.txt + substitutions. Reusable for smoke + full run.
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.join(
  '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public',
  '.opencode/specs/system-spec-kit/027-xce-research-based-refinement/review/fresh-regression-75',
);
function arg(n, d) { const i = process.argv.indexOf(`--${n}`); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d; }
const label = arg('label'); const angle = arg('angle', ''); const slice = arg('slice', '');
const dimension = arg('dimension', 'correctness'); const model = arg('model', ''); const iter = arg('iter', '1');
if (!label) { console.error('need --label'); process.exit(2); }
const contract = fs.readFileSync(path.join(ROOT, 'prompts', '_contract.txt'), 'utf8');
const out = contract
  .replaceAll('{LABEL}', label).replaceAll('{ANGLE}', angle).replaceAll('{SLICE}', slice)
  .replaceAll('{DIMENSION}', dimension).replaceAll('{MODEL}', model);
const file = path.join(ROOT, 'prompts', `${label}__iter${String(iter).padStart(2, '0')}.txt`);
fs.writeFileSync(file, out);
process.stdout.write(file + '\n');
