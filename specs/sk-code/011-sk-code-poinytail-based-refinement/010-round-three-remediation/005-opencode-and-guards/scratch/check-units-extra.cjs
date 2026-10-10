// Planner check: dispatch-units-extra.json parses, and every extra edit's OLD text occurs exactly
// once in its file after the 79 main units, whether or not the chain has applied them yet.
// Run from the repository root: node <folder>/scratch/check-units-extra.cjs
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const OLD_NEW = /<<<OLD\n([\s\S]*?)\nOLD>>> with <<<NEW\n([\s\S]*?)\nNEW>>>$/;
const load = (name) => JSON.parse(fs.readFileSync(path.join(__dirname, name), 'utf8'));
const main = load('dispatch-units.json');
const extra = load('dispatch-units-extra.json');
function postChain(file) {
  let text = fs.readFileSync(file, 'utf8');
  for (const u of main) {
    if (u.kind !== 'edit' || u.files[0] !== file) continue;
    const [, oldText, newText] = OLD_NEW.exec(u.instruction);
    if (text.includes(oldText)) text = text.replace(oldText, newText);
  }
  return text;
}
let bad = 0;
let edits = 0;
for (const u of extra) {
  if (u.kind !== 'edit') continue;
  edits += 1;
  const m = OLD_NEW.exec(u.instruction);
  if (!m || u.files.length !== 1) { bad += 1; console.log(`${u.task}: no OLD block or not one file`); continue; }
  const file = u.files[0];
  // The changelog does not exist until the main chain creates it from its scratch copy.
  const text = fs.existsSync(file) ? postChain(file) : fs.readFileSync(path.join(__dirname, 'units', path.basename(file)), 'utf8');
  const count = text.split(m[1]).length - 1;
  if (count !== 1) { bad += 1; console.log(`${u.task}: OLD occurs ${count} times in ${file}`); }
}
console.log(`extra units ${extra.length}, edit units ${edits}, OLD not unique ${bad}`);
process.exit(bad ? 1 : 0);
