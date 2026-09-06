// Renders the classified rows into the markdown tables the inventory publishes, so a re-run
// regenerates the document body instead of inviting a hand edit that drifts from the data.
import { readFileSync, writeFileSync } from 'node:fs';
const rows = readFileSync('classified.tsv', 'utf8').trim().split('\n').slice(1).map(l => {
  const [path, bytes, cls, lines, han, punct, disposition, reason] = l.split('\t');
  return { path, bytes: +bytes, cls, lines: +lines, han: +han, punct: +punct, disposition, reason };
});
const esc = s => s.replace(/\|/g, '\\|');
const out = [];
for (const d of ['adapt', 'translate', 'port', 'drop']) {
  const g = rows.filter(r => r.disposition === d);
  const bytes = g.reduce((s, r) => s + r.bytes, 0);
  const han = g.reduce((s, r) => s + r.han, 0);
  out.push(`### ${d.toUpperCase()} (${g.length} files, ${bytes.toLocaleString('en-US')} bytes, ${han.toLocaleString('en-US')} Han)\n`);
  out.push('| File | Bytes | Lines | Han | Reason |');
  out.push('|------|------:|------:|----:|--------|');
  const byReason = new Map();
  for (const r of g) {
    if (!byReason.has(r.reason)) byReason.set(r.reason, []);
    byReason.get(r.reason).push(r);
  }
  for (const [reason, list] of byReason) {
    for (const r of list) {
      out.push(`| \`${esc(r.path)}\` | ${r.bytes.toLocaleString('en-US')} | ${r.cls === 'binary' ? '-' : r.lines} | ${r.cls === 'binary' ? '-' : r.han} | ${esc(reason)} |`);
    }
  }
  out.push('');
}
writeFileSync('tables.md', out.join('\n'));
console.log('rows=' + rows.length);
