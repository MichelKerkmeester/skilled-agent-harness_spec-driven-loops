// Extract the canonical iteration record (first line of a delta file) into a
// single-record event file for the append gateway. Writes only inside the lineage.
// Usage: node extract-record.cjs <delta-file> <out-file>
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const deltaPath = path.resolve(process.argv[2]);
const outPath = path.resolve(process.argv[3]);
const lines = fs.readFileSync(deltaPath, 'utf8').split(/\r?\n/).filter((line) => line.trim() !== '');
const record = JSON.parse(lines[0]);
if (record.type !== 'iteration') {
  throw new Error(`first delta record must be type=iteration, got ${record.type}`);
}
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(record), 'utf8');
console.log(`wrote ${outPath}`);
