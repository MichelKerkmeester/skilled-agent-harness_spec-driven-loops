// Falsification probe: does the deterministic gate's verdict track the human/MiniMax
// SHIP/FIX labels on the existing baseline tiles? Treats FIX as the positive class
// (a tile the gate SHOULD flag). Reports a confusion matrix, precision/recall, the
// named sentinels, and per-check correlation against the audit booleans. The gate is
// the artifact under test; this is its acceptance evidence before any full generation run.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const DIST = path.resolve(HERE, '../../scratch/faithful-import/dist');
const LABELS = JSON.parse(fs.readFileSync(path.join(HERE, '_baseline-labels.json'), 'utf8'));
const GATE = path.join(HERE, 'a1-gate.mjs');

// Run the gate across every real tile (skip _ scaffolds). The gate writes <tile>.gate.json.
const tiles = fs.readdirSync(DIST)
  .filter(f => f.endsWith('.html') && !f.startsWith('_'))
  .map(f => path.join(DIST, f));

function tileId(file) {
  return path.basename(file, '.html').replace(/-glm-(\d+)$/, '-$1').replace(/-glm-/, '-');
}

console.log(`Running gate on ${tiles.length} baseline tiles ...`);
for (const t of tiles) {
  try { execFileSync('node', [GATE, t, '--arm', 'control', '--run', 'baseline'], { stdio: 'pipe' }); }
  catch (e) { console.error('gate error', tileId(t), e.message.slice(0, 120)); }
}

// Collect gate verdicts.
const gateOf = {};
for (const t of tiles) {
  const gj = t.replace(/\.html$/, '.gate.json');
  if (fs.existsSync(gj)) { try { gateOf[tileId(t)] = JSON.parse(fs.readFileSync(gj, 'utf8')); } catch {} }
}

// Confusion matrix: positive = FIX (gate predicts FAIL = positive).
let tp = 0, fp = 0, tn = 0, fn = 0;
const mis = [];
for (const [id, lab] of Object.entries(LABELS)) {
  const g = gateOf[id];
  if (!g) { mis.push(`${id}: NO GATE OUTPUT`); continue; }
  const gateFail = g.pass === false;
  const isFix = lab.verdict === 'FIX';
  if (gateFail && isFix) tp++;
  else if (gateFail && !isFix) { fp++; mis.push(`FP ${id} (gate FAIL, audit SHIP ${lab.score}) checks=${failed(g)}`); }
  else if (!gateFail && isFix) { fn++; mis.push(`FN ${id} (gate PASS, audit FIX ${lab.score}) issue=${(lab.issue||'').slice(0,60)}`); }
  else tn++;
}
const prec = tp / (tp + fp || 1), rec = tp / (tp + fn || 1);
const f1 = 2 * prec * rec / (prec + rec || 1);

function failed(g) {
  if (!g.checks) return g.error ? 'ERROR' : '';
  return Object.entries(g.checks).filter(([, v]) => v.pass === false).map(([k]) => k).join(',');
}

// Per-check correlation vs audit booleans.
function corr(checkKey, auditKey, auditPositiveWhenFalse = false) {
  let agree = 0, n = 0;
  for (const [id, lab] of Object.entries(LABELS)) {
    const g = gateOf[id]; if (!g || !g.checks) continue;
    const gateBad = g.checks[checkKey]?.pass === false;
    const auditBad = auditPositiveWhenFalse ? lab[auditKey] === false : lab[auditKey] === true;
    if (gateBad === auditBad) agree++; n++;
  }
  return `${checkKey} vs audit.${auditKey}: ${agree}/${n} agree`;
}

console.log('\n=== CONFUSION MATRIX (positive = FIX) ===');
console.log(`TP=${tp} FP=${fp} TN=${tn} FN=${fn}  (n=${tp+fp+tn+fn})`);
console.log(`precision=${prec.toFixed(2)} recall=${rec.toFixed(2)} F1=${f1.toFixed(2)}`);

console.log('\n=== SENTINELS ===');
for (const id of ['accountbeheer-4', 'oci-4', 'goedkeuringssysteem-4', 'accountbeheer-5', 'kwartaalcijfers-2']) {
  const g = gateOf[id];
  console.log(`  ${id}: gate=${g ? (g.pass ? 'PASS' : 'FAIL ['+failed(g)+']') : 'MISSING'} | audit=${LABELS[id]?.verdict} ${LABELS[id]?.score}`);
}

console.log('\n=== PER-CHECK CORRELATION ===');
console.log('  ' + corr('visualPanelOverflow', 'overflow'));
console.log('  ' + corr('bannedContrast', 'readable', true));
console.log('  ' + corr('titleBandIntrusion', 'title_at_bottom', true));

console.log('\n=== MISCLASSIFIED / MISSING ===');
mis.slice(0, 20).forEach(m => console.log('  ' + m));

fs.writeFileSync(path.join(HERE, '_probe-result.json'),
  JSON.stringify({ tp, fp, tn, fn, precision: prec, recall: rec, f1, misclassified: mis }, null, 2));
console.log('\nwrote _probe-result.json');
