#!/usr/bin/env node
/**
 * Stage-2 dependency-ordered executor for the 026 wave-4 moves.
 * Usage:
 *   node exec-moves.js --dry    # validate sources exist, targets absent, print ordered plan
 *   node exec-moves.js --run    # execute git mv in dependency order
 * Run from the 026 spec root's parent context; resolves paths relative to SPEC_ROOT_ABS.
 */
'use strict';
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PLAN = require('./rename-plan.json');
// Worktree repo root (two-arg: allow override)
const REPO = process.env.REORG_REPO || '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public-026-reorg';
const SPEC_ROOT_REL = '.opencode/specs/' + PLAN.spec_root; // .opencode/specs/system-spec-kit/026-...
const mode = process.argv.includes('--run') ? 'run' : 'dry';

// Dependency phase for a move
function phaseOf(m) {
  if (m.kind === 'rename') return 1;                                   // wrapper-root renames (000, 005->004-code-graph)
  if (m.kind === 'sub-nest' && m.old.startsWith('004-code-graph/')) {  // 005-children regroup + kept-parent renumber
    // renumber kept parents (011/019 -> 014/015) FIRST, then sub-wrapper nests
    return /\/(011-real-world|019-system-code-graph-uplift)/.test(m.old) ? 2 : 3;
  }
  if (m.kind === 'nest') return 4;                                     // top-level -> wrappers
  if (m.kind === 'sub-nest' && m.old.startsWith('004-external-project-adoption/')) return 5; // 004 split
  if (m.kind === 'archive') return 6;                                  // 004 shell + scratch
  return 9;
}

const ordered = PLAN.moves
  .map(m => ({ ...m, phase: phaseOf(m) }))
  .sort((a, b) => a.phase - b.phase);

function abs(rel) { return path.join(REPO, SPEC_ROOT_REL, rel); }

let errors = 0;
console.log(`MODE=${mode}  REPO=${REPO}`);
console.log(`SPEC_ROOT=${SPEC_ROOT_REL}`);
console.log(`moves=${ordered.length}\n`);

for (const m of ordered) {
  const src = abs(m.old);
  const dst = abs(m.new);
  const srcExists = fs.existsSync(src);
  const dstExists = fs.existsSync(dst);
  const tag = `[P${m.phase}] ${m.kind}`;
  if (mode === 'dry') {
    let flag = '';
    if (!srcExists) { flag += ' !SRC-MISSING'; errors++; }
    if (dstExists) { flag += ' !DST-EXISTS'; errors++; }
    console.log(`${tag}  ${m.old}\n        -> ${m.new}${flag}`);
  } else {
    if (!srcExists) { console.error(`ABORT (src missing): ${m.old}`); process.exit(1); }
    if (dstExists) { console.error(`ABORT (dst exists): ${m.new}`); process.exit(1); }
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    try {
      execSync(`git mv "${SPEC_ROOT_REL}/${m.old}" "${SPEC_ROOT_REL}/${m.new}"`, { cwd: REPO, stdio: 'pipe' });
      console.log(`OK ${tag}  ${m.old} -> ${m.new}`);
    } catch (e) {
      console.error(`ABORT FAIL ${tag}  ${m.old} -> ${m.new}\n     ${e.stderr ? e.stderr.toString().trim() : e.message}`);
      process.exit(1);
    }
  }
}
console.log(`\n${mode.toUpperCase()} done. issues=${errors}`);
process.exit(errors ? 1 : 0);
