const fs = require('node:fs');
const path = require('node:path');
const dir = path.resolve(__dirname, '..');
const n = process.argv[2];
const record = JSON.parse(fs.readFileSync(path.join(dir, 'prompts', `iter-${n}.record.json`), 'utf8'));
const out = [JSON.stringify(record)];
const findings = record.findingDetails.map((f) => [f.id, f.findingClass, f.file, f.title]);
for (const [id, cluster, file, title] of findings) {
  out.push(JSON.stringify({ type: 'finding', id, severity: 'P2', cluster, file, title, iteration: record.iteration }));
}
out.push(JSON.stringify({ type: 'classification', detail: `${record.findingsCount} new P2 finding(s) in the ${record.focus} dimension.`, iteration: record.iteration }));
for (const [protocol, value] of Object.entries(record.traceabilityChecks)) {
  out.push(JSON.stringify({ type: 'traceability_check', protocol, status: value.status, iteration: record.iteration, detail: value.notes }));
}
for (const [direction, reason] of (record.ruledOut || [
  ['Traceability floor drift', 'All five pinned numbers re-derive from the committed baseline.'],
  ['Baseline scoring-date disagreement', 'Both baselines pin 2026-10-11.'],
  ['Corpus size or duplicate-id drift', '195/66/24/78 rows with unique ids.'],
  ['NC-011 stale deep-loop gate', 'Chapter expected signals match the fixed gate.'],
  ['Playbook inventory test covering routing fixtures', 'The test checks scenario rows and file inventory only.'],
])) {
  out.push(JSON.stringify({ type: 'ruled_out', direction, reason, iteration: record.iteration }));
}
fs.writeFileSync(path.join(dir, 'deltas', `iter-${n}.jsonl`), out.join('\n') + '\n');
console.log('delta rows', out.length);
