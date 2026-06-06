'use strict';

// Wave 2: resolve the sk-code surface-marker ambiguous links deterministically.
// A checklist under sk-code/assets/<surface>/ that links ../../references/<rest> is really
// pointing at sk-code/references/<surface>/<rest> (the per-surface reference subtree). The
// basename-ambiguity (style_guide.md exists under several surfaces) is resolved by the
// source's own surface dir. Apply only when the rebuilt target exists on disk.
// Dry-run by default; --apply to write.
const fs = require('fs');
const path = require('path');

const APPLY = process.argv.includes('--apply');
const fixes = require(path.join(__dirname, 'fix-proposals.json'));

let edits = 0, skipped = 0;
const log = [], unresolved = [];
const changed = new Set();

for (const p of fixes.proposals) {
  if (p.confidence !== 'ambiguous') continue;
  const m = p.file.match(/^\.opencode\/skills\/sk-code\/assets\/([^/]+)\//);
  if (!m) { skipped++; continue; }
  const surface = m[1]; // opencode | webflow | ...
  // ref like ../../references/<rest>  OR ../../references/<surface>/<rest>
  const rm = p.ref.match(/references\/(.+)$/);
  if (!rm) { skipped++; continue; }
  let rest = rm[1];
  if (rest.startsWith(surface + '/')) rest = rest.slice(surface.length + 1); // avoid double surface
  const target = path.join('.opencode/skills/sk-code/references', surface, rest);
  if (!fs.existsSync(target)) { unresolved.push(`${p.file}  ${p.ref} (tried ${target})`); continue; }
  const newRef = path.relative(path.dirname(p.file), target);
  let content;
  try { content = fs.readFileSync(p.file, 'utf8'); } catch { skipped++; continue; }
  const needle = '](' + p.ref + ')';
  if (!content.includes(needle)) { continue; }
  const count = content.split(needle).length - 1;
  content = content.split(needle).join('](' + newRef + ')');
  edits += count; changed.add(p.file);
  log.push(`  ${p.file.replace('.opencode/skills/sk-code/', '')}  ${p.ref} -> ${newRef} (x${count})`);
  if (APPLY) fs.writeFileSync(p.file, content);
}

console.log(`=== APPLY-AMBIGUOUS sk-code surface rule (${APPLY ? 'APPLIED' : 'DRY-RUN'}) ===`);
console.log('edits:', edits, '| files:', changed.size, '| non-sk-code ambiguous skipped:', skipped, '| surface-target-missing:', unresolved.length);
log.slice(0, 25).forEach((l) => console.log(l));
if (log.length > 25) console.log('  ... +', log.length - 25, 'more');
if (unresolved.length) { console.log('--- surface target not found (left for manual) ---'); unresolved.slice(0, 10).forEach((u) => console.log('  ' + u)); }
