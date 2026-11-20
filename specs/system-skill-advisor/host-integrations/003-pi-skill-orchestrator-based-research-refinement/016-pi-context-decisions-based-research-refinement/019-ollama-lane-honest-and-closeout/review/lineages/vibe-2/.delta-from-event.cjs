// Builds deltas/iter-NNN.jsonl from the iteration event file plus extra rows.
const fs = require('fs');
const path = require('path');
const [artifactDir, iterArg, extrasArg] = process.argv.slice(2);
const n = Number(iterArg);
const pad = String(n).padStart(3, '0');
const rec = JSON.parse(fs.readFileSync(path.join(artifactDir, `.iter-${pad}-event.json`), 'utf8'));
const rows = [rec];
for (const f of rec.findingDetails ?? []) {
  rows.push({ type: 'finding', id: f.id, severity: f.severity, title: f.title, file: f.file, iteration: n });
}
for (const e of rec.graphEvents ?? []) rows.push({ ...e, iteration: n });
const extras = extrasArg ? JSON.parse(fs.readFileSync(extrasArg, 'utf8')) : [];
for (const row of extras) rows.push({ ...row, iteration: n });
const out = path.join(artifactDir, 'deltas', `iter-${pad}.jsonl`);
if (fs.existsSync(out)) throw new Error(`delta already exists: ${out}`);
fs.writeFileSync(out, rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
console.log(JSON.stringify({ delta: out, rows: rows.length }));
