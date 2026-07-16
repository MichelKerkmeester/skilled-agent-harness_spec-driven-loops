#!/usr/bin/env node
'use strict';
/**
 * Safety net for the phase-reference normalization: a phase's distinctive name
 * should sit next to that phase's number. Any pairing of a distinctive name with
 * a different number is either a reference the shift missed, a reference the
 * shift moved wrongly, or a pre-existing authoring error — all worth surfacing.
 * Research phases are excluded (their bodies carry unrelated study-local numbers).
 */
const fs = require('fs');
const path = require('path');
const PACKET = path.join('/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public', '.opencode/specs/system-deep-loop/065-deep-loop-innovation');
const SKIP = /^00[12]-/;

// distinctive name -> the number the flattened phase bearing it sits at.
const OWN = {
  baseline: '003', census: '003', taxonomy: '003',
  architecture: '004', coverage: '004',
  envelope: '006', 'ledger-core': '006',
  'shared-evidence': '007', 'control-service': '007',
  compatibility: '008', upcaster: '008', 'rollback-bridge': '008',
  durable: '009',
  novelty: '010', supersession: '010',
  convergence: '011', termination: '011',
  'conflict-graph': '012', 'write-set': '012',
  'staged-state': '014',
  retirement: '015', 'legacy-writer': '015',
  'whole-system': '016',
  closeout: '017',
};

function walk(dir, acc, depth) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'scratch') continue;
    if (depth === 0 && SKIP.test(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc, depth + 1);
    else if (e.name.endsWith('.md')) acc.push(p);
  }
  return acc;
}

const files = walk(PACKET, [], 0);
const flags = [];
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  for (const [w, want] of Object.entries(OWN)) {
    const re = new RegExp(`phase[- ](0[0-9][0-9])[- ]${w}`, 'gi');
    let m;
    while ((m = re.exec(t))) {
      if (m[1] !== want) flags.push(`${f.replace(PACKET + '/', '')}: phase-${m[1]} ${w} (want ${want})`);
    }
  }
}
const uniq = [...new Set(flags)];
console.log(uniq.length ? `MISMATCHES (${uniq.length}):\n  ${uniq.join('\n  ')}` : 'CLEAN — every distinctive name sits next to its correct phase number');
