#!/usr/bin/env node
// Aggregate seat findings for one track. Usage: node process-findings.cjs <seatsDir> <track-label> <outDir>
// Reuses the same NDJSON->last-json-fence extraction as extract-findings.cjs.
const fs = require('fs');
const pathmod = require('path');
const [seatsDir, trackLabel, outDir] = process.argv.slice(2);
if (!seatsDir || !outDir) { console.error('usage: process-findings.cjs <seatsDir> <track> <outDir>'); process.exit(1); }

function extract(file) {
  let raw; try { raw = fs.readFileSync(file, 'utf8'); } catch { return { error: 'unreadable' }; }
  let text = '';
  for (const line of raw.split('\n')) {
    const t = line.trim(); if (!t) continue;
    let ev; try { ev = JSON.parse(t); } catch { continue; }
    const p = ev && ev.part;
    if (p && (p.type === 'text' || p.type === 'text-delta')) {
      if (typeof p.text === 'string') text += p.text;
      else if (typeof p.delta === 'string') text += p.delta;
    } else if (ev && ev.type === 'text' && typeof ev.text === 'string') text += ev.text;
  }
  const re = /```json\s*([\s\S]*?)```/g; let m, last = null;
  while ((m = re.exec(text)) !== null) last = m[1];
  if (!last) { const i = text.lastIndexOf('{"seat"'); if (i >= 0) last = text.slice(i); }
  if (!last) return { error: 'no json block', bytes: raw.length };
  try { return JSON.parse(last.trim()); } catch (e) { return { error: 'parse: ' + e.message, sample: last.trim().slice(0, 200) }; }
}

const seatFiles = fs.readdirSync(seatsDir).filter(f => /^[AB]\d+\.json$/.test(f)).sort();
const all = [];
const seatStatus = [];
let ok = 0, failed = 0;
for (const sf of seatFiles) {
  const id = sf.replace('.json', '');
  const r = extract(pathmod.join(seatsDir, sf));
  if (r.error) { failed++; seatStatus.push({ seat: id, status: 'FAILED', detail: r.error }); continue; }
  ok++;
  const findings = Array.isArray(r.findings) ? r.findings : [];
  seatStatus.push({ seat: id, status: 'ok', area: r.area, findings: findings.length, filesRead: (r.files_read || []).length });
  for (const f of findings) all.push({ ...f, seat: id, area: r.area });
}

const bySev = { P0: [], P1: [], P2: [] };
for (const f of all) { const s = (f.severity || 'P2').toUpperCase(); (bySev[s] || bySev.P2).push(f); }

const summary = {
  track: trackLabel, generatedFromSeats: seatFiles.length, seatsOk: ok, seatsFailed: failed,
  totals: { P0: bySev.P0.length, P1: bySev.P1.length, P2: bySev.P2.length, all: all.length },
  seatStatus,
};
fs.writeFileSync(pathmod.join(outDir, 'findings-all.json'), JSON.stringify({ summary, findings: all }, null, 2));
fs.writeFileSync(pathmod.join(outDir, 'p0p1-for-round2.json'), JSON.stringify([...bySev.P0, ...bySev.P1], null, 2));

console.log(`\n=== ${trackLabel} ===`);
console.log(`seats ok=${ok} failed=${failed} | findings P0=${bySev.P0.length} P1=${bySev.P1.length} P2=${bySev.P2.length} (total ${all.length})`);
if (failed) console.log('FAILED seats:', seatStatus.filter(s => s.status === 'FAILED').map(s => s.seat + '(' + s.detail + ')').join(', '));
console.log('\nP0/P1 (round-2 candidates):');
for (const f of [...bySev.P0, ...bySev.P1]) console.log(`  [${f.severity}] ${f.seat} ${f.file || '?'}:${f.line || 0} - ${f.title}`);
