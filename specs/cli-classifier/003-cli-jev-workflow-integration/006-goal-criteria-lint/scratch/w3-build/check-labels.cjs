'use strict';
// Orchestrator check for the drawn labels file: schema, nulls, no criterion
// text, and every hash still matching a current lint line.
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '../../../../../..');
const file = path.join(ROOT, '.skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl');
const { lintWorkspace } = require(path.join(ROOT, '.skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs'));
const KEYS = ['id', 'text_sha12', 'rubric', 'rule4_ok', 'rule5_ok', 'labeler'];
const rows = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const lint = lintWorkspace(ROOT);
const hashes = new Set(lint.records.map((r) => r.text_sha12));
const texts = new Map();
for (const f of lint.files) {
  const content = fs.readFileSync(path.join(ROOT, f.path), 'utf8').split(/\r?\n/);
  content.forEach((line, i) => texts.set(f.path + ':' + (i + 1), line));
}
let bad = 0;
let stale = 0;
let idMoved = 0;
for (const row of rows) {
  const keysOk = JSON.stringify(Object.keys(row)) === JSON.stringify(KEYS);
  const nullsOk = row.rubric === null && row.rule4_ok === null && row.rule5_ok === null && row.labeler === null;
  const idOk = /^specs\/.+\/goal\.md:\d+$/.test(row.id);
  const hashOk = /^[0-9a-f]{12}$/.test(row.text_sha12);
  if (!(keysOk && nullsOk && idOk && hashOk)) bad += 1;
  if (!hashes.has(row.text_sha12)) stale += 1;
  const rec = lint.records.find((r) => r.id === row.id);
  if (!rec || rec.text_sha12 !== row.text_sha12) idMoved += 1;
}
const maxLen = Math.max(...rows.map((r) => JSON.stringify(r).length));
console.log('rows=' + rows.length + ' bad_schema=' + bad + ' stale_hash=' + stale + ' id_moved=' + idMoved + ' max_row_chars=' + maxLen + ' distinct_hashes=' + new Set(rows.map((r) => r.text_sha12)).size);
