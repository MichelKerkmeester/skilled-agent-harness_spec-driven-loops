#!/usr/bin/env node
// Build per-seat fixer prompts from findings-all.json. Partitions by FILE (each file ->
// exactly one seat, so concurrent seats never edit the same file), bins whole files into
// seats of <=MAX_FILES, light-filters obvious FP clusters. Seat ids: <track>F<NN>.
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const P007 = ROOT + '/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review';
const MAX_FILES = 5;

const tracks = [
  { key: 'A', findings: P007 + '/001-readmes-vs-027/review/findings-all.json', tpl: P007 + '/scratch/fix-tpl-a.txt', specdir: P007 + '/003-readme-remediation', out: P007 + '/003-readme-remediation/fixers' },
  { key: 'B', findings: P007 + '/002-code-vs-sk-code-opencode/review/findings-all.json', tpl: P007 + '/scratch/fix-tpl-b.txt', specdir: P007 + '/004-code-remediation', out: P007 + '/004-code-remediation/fixers' },
];

function isFP(track, f) {
  const title = (f.title || '') + ' ' + (f.standard_violated || '');
  const file = f.file || '';
  if (!file || !f.title) return true;
  if (track === 'B') {
    if (/\/dist\//.test(file)) return true;
    if (/feature.?catalog/i.test(title)) return true;
  }
  return false;
}

for (const t of tracks) {
  fs.rmSync(t.out, { recursive: true, force: true });
  fs.mkdirSync(t.out, { recursive: true });
  const tpl = fs.readFileSync(t.tpl, 'utf8');
  const data = JSON.parse(fs.readFileSync(t.findings, 'utf8'));
  // group fixable findings by file
  const byFile = {};
  for (const f of (data.findings || [])) {
    if (isFP(t.key, f)) continue;
    (byFile[f.file] = byFile[f.file] || []).push(f);
  }
  const files = Object.keys(byFile).sort();
  // bin whole files into seats of <=MAX_FILES
  let made = 0;
  for (let i = 0; i < files.length; i += MAX_FILES) {
    const chunk = files.slice(i, i + MAX_FILES);
    const seat = t.key + 'F' + String(made + 1).padStart(2, '0');
    const lines = [];
    for (const file of chunk) {
      for (const x of byFile[file]) {
        const detail = t.key === 'A'
          ? `stale: ${x.stale_claim || x.title} -> correct: ${x.current_truth || '(verify against live source)'}`
          : `${x.standard_violated || x.title}${x.fix_hint ? ' | fix: ' + x.fix_hint : ''}`;
        lines.push(`- [${x.severity || 'P2'}] ${x.file}:${x.line || 0} — ${x.title} | ${detail}`);
      }
    }
    let p = tpl.replace(/%SEAT%/g, seat).replace(/%SPECDIR%/g, t.specdir)
      .replace('%PATHS%', chunk.map(x => '- ' + x).join('\n')).replace('%FINDINGS%', lines.join('\n'));
    fs.writeFileSync(path.join(t.out, seat + '.prompt.txt'), p);
    made++;
  }
  console.log(`Track ${t.key}: ${files.length} files -> ${made} file-disjoint fixer seats`);
}
