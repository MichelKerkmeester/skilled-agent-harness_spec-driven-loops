// Planner check: dispatch-units.json parses, and every edit unit's OLD text occurs exactly once in its file.
// Run from the repository root: node <folder>/scratch/check-units.cjs
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const units = JSON.parse(fs.readFileSync(path.join(__dirname, 'dispatch-units.json'), 'utf8'));
let bad = 0;
let edits = 0;
for (const u of units) {
  if (u.kind !== 'edit') continue;
  edits += 1;
  const m = /<<<OLD\n([\s\S]*?)\nOLD>>> with <<<NEW\n/.exec(u.instruction);
  if (!m || u.files.length !== 1) { bad += 1; console.log(`${u.task}: instruction has no OLD block or not one file`); continue; }
  const text = fs.readFileSync(u.files[0], 'utf8');
  const count = text.split(m[1]).length - 1;
  if (count !== 1) { bad += 1; console.log(`${u.task}: OLD occurs ${count} times in ${u.files[0]}`); }
}
console.log(`units ${units.length}, edit units ${edits}, OLD not unique ${bad}`);
process.exit(bad ? 1 : 0);
