#!/usr/bin/env node
'use strict';
/**
 * Normalize phase references across the packet after the implementation program
 * was flattened out of its wrapper and its phases were shifted by three.
 *
 * Two independent corrections:
 *   1. Drop the redundant parenthetical coordinate labels an authoring pass left
 *      in titles and prose. The folder path already encodes the coordinate, so
 *      the label is pure noise. A label is a SINGLE-LINE parenthetical made only
 *      of coordinate words (phase/mode/child/concern/migration/lane), digits, and
 *      separators, carrying a 3-digit number. Prose parentheticals (which contain
 *      ordinary words) are matched by neither condition and left untouched.
 *   2. Shift the padded program-phase references to the flattened numbering.
 *      ONLY the zero-padded form (phase-0NN / phase 0NN) is a program reference;
 *      the non-padded form (phase-1, "Phase 1: Setup", ANCHOR:phase-1) is a leaf's
 *      local implementation stage and MUST stay untouched.
 *
 * The shift is +3 for every old program phase, applied high-number-first so a
 * remapped value is never re-matched by a later rule. The one genuinely mixed
 * number is the migration phase itself: it appears both as a correct new
 * self-reference (near mode/migration/lane) and as a stale reference to the old
 * whole-system gate (near gate/whole-system). Keyword context resolves most; a
 * leftover reference is read by location (inside the migration subtree it is the
 * phase naming itself and is kept; elsewhere it is the old gate and is shifted).
 *
 * Usage: node normalize-phase-refs.cjs [--apply]   (default: dry-run report)
 */
const fs = require('fs');
const path = require('path');

const ROOT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const PACKET = path.join(ROOT, '.opencode/specs/system-deep-loop/065-deep-loop-innovation');
const SUBTREE = '/013-mode-and-lane-migrations/';
const APPLY = process.argv.includes('--apply');

// old program-phase number -> flattened number. The migration phase is included
// here; the whole-system gate is handled separately because its old number is the
// one the migration subtree also uses for itself, so a blind shift would be wrong.
const SHIFT = {
  '000': '003', '001': '004', '002': '005', '003': '006', '004': '007',
  '005': '008', '006': '009', '007': '010', '008': '011', '009': '012',
  '010': '013', '011': '014', '012': '015', '014': '017',
};
// high-number-first so a just-written value can't be re-matched by a later rule.
const SHIFT_KEYS = Object.keys(SHIFT).sort((a, b) => Number(b) - Number(a));

const COORD = '(?:phase|mode|migration|lane|child|concern)';
const SELF = /mode|migration|lane/i;
const GATE = /gate|whole.?system/i;

// A few references were authored with the flattened number already. They are
// recognizable because the number is followed by that same new phase's own
// distinctive name, which the old phase at that number never bore. Guard them
// from the shift so an already-correct reference is not moved off its target.
// For each number, the distinctive name of the phase that now sits at that
// number. A reference pairing the number with THIS name is already flattened and
// must not shift. Safe by construction: the phase now at a number is a different
// phase than the one that was there before, so its name never appears on a
// genuine old-scheme reference at the same number.
const PROTECT = {
  '001': '(?![- ](?:market|landscape|research\\b))',
  '002': '(?![- ]effectiveness)',
  '003': '(?![- ](?:baseline|taxonom|census))',
  '004': '(?![- ](?:architecture|coverage))',
  '005': '(?![- ](?:live.?tool|unblock))',
  '006': '(?![- ](?:envelope|ledger.?core|authorized.?ledger))',
  '007': '(?![- ](?:shared.?evidence|control.?service))',
  '008': '(?![- ](?:compatibilit|rollback.?bridge|upcaster))',
  '009': '(?![- ](?:durable|fan.?in|fanin))',
  '010': '(?![- ](?:novelt|supersession))',
  '011': '(?![- ](?:convergence|termination))',
  '012': '(?![- ](?:shared.?mode|conflict.?graph|write.?set))',
  '014': '(?![- ](?:staged.?state|authority.?cutover))',
};

// A pure coordinate label: single-line, only coordinate tokens/digits/separators,
// carrying a coordinate word and a 3-digit number.
const LABEL = new RegExp(
  `[ \\t]*\\(` +
  `(?=[^)\\n]*${COORD})` +
  `(?=[^)\\n]*\\d{3})` +
  `(?:[ \\t\\d,/-]|${COORD})+\\)`,
  'gi',
);

function stripLabels(text, stats) {
  return text.replace(LABEL, (m) => { stats.labels.push(m.trim()); return ''; });
}

function fixMigrationNumber(text, stats, inSubtree) {
  // Case-insensitive match, case-preserving rewrite so a capitalized reference stays capitalized.
  return text.replace(/(phase)([- ])013(?![0-9])/gi, (m, p, sep, offset, str) => {
    const ctx = str.slice(Math.max(0, offset - 40), offset + 45);
    const self = SELF.test(ctx);
    const gate = GATE.test(ctx);
    if (gate && !self) { stats.gate++; return `${p}${sep}016`; }
    if (self && !gate) { stats.self++; return m; }
    if (inSubtree) { stats.ambKeep++; return m; }
    stats.ambShift.push(ctx.replace(/\s+/g, ' ').trim());
    return `${p}${sep}016`;
  });
}

function shiftPadded(text, stats) {
  for (const oldN of SHIFT_KEYS) {
    // Case-insensitive match, case-preserving rewrite; refs appear as both
    // "phase-NNN" and "Phase-NNN" (sentence-start / table-header).
    const re = new RegExp(`(phase)([- ])${oldN}(?![0-9])${PROTECT[oldN] || ''}`, 'gi');
    text = text.replace(re, (m, p, sep) => { stats.shift[oldN] = (stats.shift[oldN] || 0) + 1; return `${p}${sep}${SHIFT[oldN]}`; });
  }
  return text;
}

// The two research phases are read-only inputs whose bodies embed raw tool logs
// and their own study-local "phase N" mentions; their references are not the
// implementation program's, so they are left out of the shift entirely.
const SKIP_TOP = /^00[12]-/;

function walk(dir, acc, depth) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'scratch') continue;
    if (depth === 0 && SKIP_TOP.test(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc, depth + 1);
    else if (e.name.endsWith('.md')) acc.push(p);
  }
  return acc;
}

const files = walk(PACKET, [], 0);
const stats = { labels: [], gate: 0, self: 0, ambKeep: 0, ambShift: [], shift: {}, filesChanged: 0 };

for (const f of files) {
  const inSubtree = f.includes(SUBTREE);
  const orig = fs.readFileSync(f, 'utf8');
  let out = stripLabels(orig, stats);
  out = fixMigrationNumber(out, stats, inSubtree);
  out = shiftPadded(out, stats);
  if (out !== orig) { stats.filesChanged++; if (APPLY) fs.writeFileSync(f, out); }
}

console.log(`${APPLY ? 'APPLIED' : 'DRY-RUN'} over ${files.length} markdown files; ${stats.filesChanged} would change.\n`);
console.log(`Labels stripped: ${stats.labels.length}`);
const uniqLabels = [...new Set(stats.labels)].sort();
console.log(`  distinct label shapes (${uniqLabels.length}) — verify ALL are pure coordinate noise:`);
uniqLabels.forEach((l) => console.log(`    ${l}`));
console.log(`\nMigration-phase number (013): ${stats.gate} -> 016 (gate kw), ${stats.self} kept 013 (self kw), ${stats.ambKeep} kept 013 (subtree default), ${stats.ambShift.length} -> 016 (non-subtree default)`);
console.log(`  non-subtree ambiguous defaulted to 016 (review these):`);
[...new Set(stats.ambShift)].slice(0, 25).forEach((a) => console.log(`    …${a}…`));
console.log(`\n+3 shift counts (old -> new):`);
for (const k of SHIFT_KEYS) console.log(`  phase-${k} -> phase-${SHIFT[k]}: ${stats.shift[k] || 0}`);
