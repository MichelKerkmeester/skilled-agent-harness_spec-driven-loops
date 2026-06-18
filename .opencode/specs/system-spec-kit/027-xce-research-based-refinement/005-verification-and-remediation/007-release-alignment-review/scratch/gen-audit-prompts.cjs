#!/usr/bin/env node
// Build read-only audit prompts: batch the doc-fixed (.md) files into seats of BATCH,
// each seat verifies the fix-commit's new values against live source.
const fs = require('fs');
const path = require('path');
const P007 = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review';
const BATCH = 8;
const tpl = fs.readFileSync(P007 + '/scratch/audit-tpl.txt', 'utf8');
const out = P007 + '/003-readme-remediation/audit';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

// doc-fixed files = .md entries in fixlist
const docs = fs.readFileSync('/tmp/fixlist.txt', 'utf8').split('\n').map(s => s.trim()).filter(s => s.endsWith('.md')).sort();
let made = 0;
for (let i = 0; i < docs.length; i += BATCH) {
  const chunk = docs.slice(i, i + BATCH);
  const seat = 'AUD' + String(made + 1).padStart(2, '0');
  const p = tpl.replace(/%SEAT%/g, seat).replace('%PATHS%', chunk.map(x => '- ' + x).join('\n'));
  fs.writeFileSync(path.join(out, seat + '.prompt.txt'), p);
  made++;
}
console.log(`${docs.length} doc-fixed files -> ${made} audit seats`);
