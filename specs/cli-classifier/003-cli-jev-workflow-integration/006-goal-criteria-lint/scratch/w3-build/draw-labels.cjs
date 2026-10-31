'use strict';
// Orchestrator run: draw the label sample from the built lint's own records.
// Stratified by track group (the first folder under specs/) and goal kind
// (top-level, phase-parent, phase-child), proportional allocation with the
// largest remainder, a seeded shuffle inside each stratum. Scored lines only,
// one row per distinct text hash. Rows hold id and text_sha12 and nothing
// else a reader could recover the criterion text from; every label field is
// null until the operator labels under an adopted rubric.
// usage: node draw-labels.cjs <seed> <count> <out.jsonl> <summary.json>
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../../../../../..');
const { lintWorkspace } = require(path.join(ROOT, '.skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs'));
const [seedArg, countArg, outFile, summaryFile] = process.argv.slice(2);
const SEED = Number(seedArg);
const COUNT = Number(countArg);

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hasSpec = (dir) => fs.existsSync(path.join(dir, 'spec.md'));
function goalKind(goalRel) {
  const dir = path.join(ROOT, path.dirname(goalRel));
  const children = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory());
  if (children.some((e) => hasSpec(path.join(dir, e.name)))) return 'phase-parent';
  if (hasSpec(path.dirname(dir))) return 'phase-child';
  return 'top-level';
}
function splitId(id) {
  const at = id.lastIndexOf(':');
  return [id.slice(0, at), Number(id.slice(at + 1))];
}
function byId(a, b) {
  const [pa, la] = splitId(a.id);
  const [pb, lb] = splitId(b.id);
  return pa < pb ? -1 : pa > pb ? 1 : la - lb;
}

const lint = lintWorkspace(ROOT);
const seen = new Set();
const population = [];
for (const record of [...lint.records].sort(byId)) {
  if (record.class !== 'scored' || seen.has(record.text_sha12)) continue;
  seen.add(record.text_sha12);
  const goalRel = splitId(record.id)[0];
  population.push({ ...record, stratum: goalRel.split('/')[1] + '|' + goalKind(goalRel) });
}

const strata = new Map();
for (const record of population) {
  if (!strata.has(record.stratum)) strata.set(record.stratum, []);
  strata.get(record.stratum).push(record);
}
const keys = [...strata.keys()].sort();
const quotas = keys.map((key) => {
  const exact = (COUNT * strata.get(key).length) / population.length;
  return { key, size: strata.get(key).length, floor: Math.floor(exact), rest: exact - Math.floor(exact) };
});
let left = COUNT - quotas.reduce((sum, q) => sum + q.floor, 0);
for (const q of [...quotas].sort((a, b) => b.rest - a.rest || (a.key < b.key ? -1 : 1))) {
  if (left === 0) break;
  q.floor += 1;
  left -= 1;
}

const random = mulberry32(SEED);
const drawn = [];
for (const q of quotas) {
  const members = strata.get(q.key).slice();
  for (let i = members.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [members[i], members[j]] = [members[j], members[i]];
  }
  drawn.push(...members.slice(0, q.floor));
}
drawn.sort(byId);

const lines = drawn.map((r) => JSON.stringify({
  id: r.id, text_sha12: r.text_sha12, rubric: null, rule4_ok: null, rule5_ok: null, labeler: null
}));
fs.writeFileSync(outFile, lines.join('\n') + '\n');
fs.writeFileSync(summaryFile, JSON.stringify({
  seed: SEED,
  count: drawn.length,
  population_scored_distinct: population.length,
  lint_summary: lint.summary,
  strata: quotas.map((q) => ({ stratum: q.key, size: q.size, drawn: q.floor }))
}, null, 2) + '\n');
console.log('drawn=' + drawn.length + ' population=' + population.length + ' strata=' + keys.length + ' seed=' + SEED);
