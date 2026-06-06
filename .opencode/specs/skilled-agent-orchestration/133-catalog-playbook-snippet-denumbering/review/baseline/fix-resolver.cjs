// For every broken markdown link in the baseline, deterministically propose the correct
// target by indexing the repo by basename and picking the candidate that best matches the
// broken reference's trailing path segments. This is the authoritative remediation source —
// DeepSeek's relative-path arithmetic was shown to be unreliable, so fixes are computed here
// and the model's claims are cross-checked against this.
const fs = require('fs');
const path = require('path');

const REVIEW = path.resolve(__dirname, '..');
const baseline = require(path.join(__dirname, 'baseline-findings.json'));

const EXCLUDE = ['node_modules', '.git', '.worktrees', 'z_archive', 'z_future', '_archive', 'review_archive'];
function excluded(p) { return EXCLUDE.some((e) => p.split(path.sep).includes(e)); }

// Build basename -> [repo-relative paths] over the active tree.
const index = new Map();
function walk(dir) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (excluded(p)) continue;
    if (e.isDirectory()) walk(p);
    else if (e.isFile()) {
      const arr = index.get(e.name) || [];
      arr.push(p);
      index.set(e.name, arr);
    }
  }
}
for (const root of ['.opencode', '.claude', '.codex']) {
  if (fs.existsSync(root)) walk(root);
}

// Rank candidates by how many trailing path segments they share with the broken ref.
function trailingOverlap(refPath, candPath) {
  const r = refPath.split('/').filter(Boolean).reverse();
  const c = candPath.split('/').filter(Boolean).reverse();
  let n = 0;
  while (n < r.length && n < c.length && r[n] === c[n]) n++;
  return n;
}

const proposals = [];
const stats = { unique: 0, ranked: 0, ambiguous: 0, no_match: 0 };
for (const b of baseline.broken) {
  const refClean = b.ref.split('#')[0].split('?')[0].replace(/\/+$/, '');
  const base = path.basename(refClean);
  const cands = (index.get(base) || []).filter((c) => !excluded(c));
  let proposed = null, confidence = 'none', candCount = cands.length;
  if (cands.length === 0) {
    stats.no_match++;
    confidence = 'no_match'; // target basename exists nowhere active → truly missing/deleted
  } else {
    const ranked = cands
      .map((c) => ({ c, score: trailingOverlap(refClean, c) }))
      .sort((a, b2) => b2.score - a.score);
    const top = ranked[0];
    const tie = ranked.filter((x) => x.score === top.score);
    const best = top.c;
    proposed = path.relative(path.dirname(b.file), best);
    if (cands.length === 1) { stats.unique++; confidence = 'unique'; }
    else if (tie.length === 1 && top.score >= 2) { stats.ranked++; confidence = 'ranked'; }
    else { stats.ambiguous++; confidence = 'ambiguous'; }
  }
  proposals.push({
    area: b.area, file: b.file, ref: b.ref, basename: base,
    candidate_count: candCount, proposed_correct_target: proposed, confidence,
  });
}

const out = { generated_by: 'fix-resolver.cjs', broken_total: baseline.broken.length, stats, proposals };
fs.writeFileSync(path.join(REVIEW, 'baseline', 'fix-proposals.json'), JSON.stringify(out, null, 2));

console.log('=== DETERMINISTIC FIX-RESOLVER ===');
console.log('broken links processed:', baseline.broken.length);
console.log('  unique target match   :', stats.unique, '(one file with that basename → confident fix)');
console.log('  ranked target match   :', stats.ranked, '(best of several by path overlap)');
console.log('  ambiguous             :', stats.ambiguous, '(multiple equally-plausible targets)');
console.log('  NO match (truly gone) :', stats.no_match, '(basename exists nowhere active)');
// Verify a proposed fix actually resolves, as a self-check
let verified = 0;
for (const p of proposals) {
  if (!p.proposed_correct_target) continue;
  if (fs.existsSync(path.join(path.dirname(p.file), p.proposed_correct_target))) verified++;
}
console.log('  proposals that RESOLVE on disk:', verified, '/', proposals.filter((p) => p.proposed_correct_target).length);
console.log('full report -> review/baseline/fix-proposals.json');
