#!/usr/bin/env node
// Writes one iteration's delta stream and the single-record gateway event from the
// canonical iteration record. Keeps the delta and the ledger append the same bytes.
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const lineageDir = path.resolve(__dirname, '..');
const recordPath = process.argv[2];

if (!recordPath) {
  console.error('usage: emit.cjs <iteration-record.json>');
  process.exit(1);
}

const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
const nnn = String(record.iteration).padStart(3, '0');
const lines = [JSON.stringify(record)];

for (const finding of record.findingDetails || []) {
  lines.push(JSON.stringify({
    type: 'finding',
    id: finding.id,
    severity: finding.severity,
    title: finding.title,
    file: finding.file,
    iteration: record.iteration,
  }));
}

for (const ruledOut of record.ruledOutDirections || []) {
  lines.push(JSON.stringify({
    type: 'ruled_out',
    direction: ruledOut.direction,
    reason: ruledOut.reason,
    iteration: record.iteration,
  }));
}

if (record.classification) {
  lines.push(JSON.stringify({
    type: 'classification',
    detail: record.classification,
    iteration: record.iteration,
  }));
}

const deltaPath = path.join(lineageDir, 'deltas', `iter-${nnn}.jsonl`);
fs.writeFileSync(deltaPath, `${lines.join('\n')}\n`, 'utf8');

const eventPath = path.join(lineageDir, '.executor-state', `iter-${nnn}.event.json`);
fs.writeFileSync(eventPath, `${JSON.stringify(record)}\n`, 'utf8');

console.log(deltaPath);
console.log(eventPath);
