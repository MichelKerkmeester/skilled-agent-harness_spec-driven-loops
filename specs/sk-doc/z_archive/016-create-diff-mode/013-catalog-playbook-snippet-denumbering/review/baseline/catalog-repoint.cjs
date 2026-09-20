'use strict';

// Wave 3: repoint catalog/playbook root references to snippets that exist under a different
// slug. For each no_match in the catalog-playbook area, look inside the referenced category
// directory and fuzzy-match the (de-numbered) snippet slug by token overlap. High-confidence
// matches are proposed as repoints; the rest are reported as stale/dead for manual decision.
// Dry-run by default; --apply to write.
const fs = require('fs');
const path = require('path');

const APPLY = process.argv.includes('--apply');
const fixes = require(path.join(__dirname, 'fix-proposals.json'));

const denum = (s) => s.replace(/^[0-9]{2,3}-/, '');
const slugTokens = (s) => denum(s).replace(/\.md$/, '').split(/[-_]/).filter(Boolean);
function overlap(a, b) {
  const A = new Set(a), B = new Set(b);
  let n = 0; for (const t of A) if (B.has(t)) n++;
  return n / Math.max(A.size, B.size, 1);
}

let applied = 0; const repoints = [], dead = [];
const changed = new Set();

for (const p of fixes.proposals) {
  if (p.confidence !== 'no_match' || p.area !== 'catalog-playbook') continue;
  if (/_template\.md$|\/templates\/|\/changelog\//.test(p.file)) continue; // intentional/historical
  const refClean = p.ref.split('#')[0].split('?')[0];
  const targetAbs = path.join(path.dirname(p.file), refClean);
  const dir = path.dirname(targetAbs);
  if (!fs.existsSync(dir)) { dead.push({ ...p, reason: 'category dir missing: ' + dir }); continue; }
  const wantTok = slugTokens(path.basename(refClean));
  let best = null, bestScore = 0;
  for (const entry of fs.readdirSync(dir)) {
    if (!entry.endsWith('.md')) continue;
    const sc = overlap(wantTok, slugTokens(entry));
    if (sc > bestScore) { bestScore = sc; best = entry; }
  }
  // exact de-numbered match (score 1) or strong overlap (>=0.6) → confident repoint
  if (best && bestScore >= 0.6) {
    const newRef = path.join(path.dirname(refClean), best) + (p.ref.includes('#') ? p.ref.slice(p.ref.indexOf('#')) : '');
    let content; try { content = fs.readFileSync(p.file, 'utf8'); } catch { continue; }
    const needle = '](' + p.ref + ')';
    if (!content.includes(needle)) { continue; }
    const count = content.split(needle).length - 1;
    content = content.split(needle).join('](' + newRef + ')');
    repoints.push(`  ${p.file.replace('.opencode/skills/', '')}  ${p.ref} -> ${newRef}  [score ${bestScore.toFixed(2)}] (x${count})`);
    applied += count; changed.add(p.file);
    if (APPLY) fs.writeFileSync(p.file, content);
  } else {
    dead.push({ file: p.file, ref: p.ref, bestGuess: best, bestScore: +bestScore.toFixed(2) });
  }
}

console.log(`=== CATALOG-REPOINT (${APPLY ? 'APPLIED' : 'DRY-RUN'}) ===`);
console.log('confident repoints:', repoints.length, '| files:', changed.size, '| dead/stale (no good match):', dead.length);
console.log('\n--- repoints ---');
repoints.slice(0, 30).forEach((l) => console.log(l));
if (repoints.length > 30) console.log('  ... +', repoints.length - 30, 'more');
console.log('\n--- dead/stale (recommend remove or create) ---');
dead.slice(0, 25).forEach((d) => console.log(`  ${d.file.replace('.opencode/skills/', '')}  ${d.ref}  (best: ${d.bestGuess || 'none'} ${d.bestScore || ''})`));
if (dead.length > 25) console.log('  ... +', dead.length - 25, 'more');
fs.writeFileSync(path.join(__dirname, 'catalog-dead.json'), JSON.stringify(dead, null, 2));
