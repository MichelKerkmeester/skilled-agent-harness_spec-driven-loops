// Builds deltas/iter-NNN.jsonl from prompts/iter-NNN-event.json plus a findings/proposals spec.
// Usage: node prompts/emit-delta.cjs <artifactDir> <iteration> <specJsonPath>
const fs = require('node:fs');
const path = require('node:path');

const [art, iterArg, specPath] = process.argv.slice(2);
const iteration = Number(iterArg);
const rec = JSON.parse(fs.readFileSync(path.join(art, `prompts/iter-${String(iteration).padStart(3, '0')}-event.json`), 'utf8'));
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));

const lines = [JSON.stringify(rec)];
for (const f of spec.findings || []) {
  lines.push(JSON.stringify({ type: 'finding', id: f.id, label: f.label, iteration, sources: f.sources }));
}
for (const p of spec.proposals || []) {
  lines.push(JSON.stringify({ type: 'frontier_proposal', parentId: p.parentId, question: p.question, scope: p.scope, evidence: p.evidence }));
}
for (const r of spec.ruledOut || []) {
  lines.push(JSON.stringify({ type: 'ruled_out', direction: r.direction, reason: r.reason, iteration }));
}
const out = path.join(art, `deltas/iter-${String(iteration).padStart(3, '0')}.jsonl`);
fs.writeFileSync(out, lines.join('\n') + '\n');
console.log(`wrote ${out} with ${lines.length} lines`);
