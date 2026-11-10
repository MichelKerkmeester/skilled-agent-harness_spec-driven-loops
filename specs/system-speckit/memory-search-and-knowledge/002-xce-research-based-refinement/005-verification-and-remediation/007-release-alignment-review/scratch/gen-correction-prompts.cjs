#!/usr/bin/env node
// Build per-file correction prompts from the audit wrong-list (/tmp/audit-wrong.json).
// Files are disjoint across seats (one seat per file) so concurrent writes are safe.
const fs = require('fs');
const path = require('path');
const P007 = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review';
const SPECDIR = P007 + '/003-readme-remediation';
const tpl = fs.readFileSync(P007 + '/scratch/correction-tpl.txt', 'utf8');
const out = SPECDIR + '/corrections';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const wrong = JSON.parse(fs.readFileSync('/tmp/audit-wrong.json', 'utf8'));
const byFile = {};
for (const w of wrong) (byFile[w.file] = byFile[w.file] || []).push(w);

let made = 0;
for (const file of Object.keys(byFile).sort()) {
  const corr = byFile[file].map((w, i) =>
    `${i + 1}. WRONG (now in file): ${w.new_value}\n   ACTUAL TRUTH: ${w.actual_truth}\n   EVIDENCE: ${w.evidence}`).join('\n');
  const seat = 'COR' + String(made + 1).padStart(2, '0');
  const p = tpl.replace(/%SEAT%/g, seat).replace(/%SPECDIR%/g, SPECDIR)
    .replace('%PATHS%', '- ' + file).replace('%CORRECTIONS%', corr);
  fs.writeFileSync(path.join(out, seat + '.prompt.txt'), p);
  made++;
}
console.log(`${wrong.length} wrong fixes across ${Object.keys(byFile).length} files -> ${made} correction seats`);
