'use strict';
// Proves every dispatch unit matches the tree. Without a flag it checks the state before
// the build: each OLD text occurs exactly once and each file to create is absent. With
// --after it checks the state after the build: each non-empty NEW text occurs exactly
// once, no OLD text remains and each created file equals its source. Reads only.
const fs = require('node:fs');
const path = require('node:path');

const after = process.argv.includes('--after');
const units = JSON.parse(fs.readFileSync(path.join(__dirname, 'dispatch-units.json'), 'utf8'));
let failures = 0;
const count = (haystack, needle) => haystack.split(needle).length - 1;
for (const unit of units) {
  const file = unit.files[0];
  let ok = false;
  let note = '';
  if (unit.kind === 'edit') {
    const oldText = fs.readFileSync(path.join(__dirname, 'units', `${unit.task}.old.txt`), 'utf8');
    const newText = fs.readFileSync(path.join(__dirname, 'units', `${unit.task}.new.txt`), 'utf8');
    const inlineOld = unit.instruction.split('<<<OLD\n')[1].split('OLD>>>')[0];
    const inlineNew = unit.instruction.split('<<<NEW\n')[1].split('NEW>>>')[0];
    const content = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    const inlineMatches = inlineOld === oldText && inlineNew === newText;
    // An empty NEW text is a deletion, proved by the OLD text being gone.
    const newCount = newText === '' ? 'empty' : count(content, newText);
    ok = inlineMatches && (after
      ? (newText === '' || newCount === 1) && count(content, oldText) === 0
      : count(content, oldText) === 1);
    note = `old=${count(content, oldText)} new=${newCount} inline=${inlineMatches}`;
  } else if (unit.kind === 'create') {
    const source = unit.instruction.match(/content of (\S+?):/)[1];
    const exists = fs.existsSync(file);
    ok = fs.existsSync(source) && (after
      ? exists && fs.readFileSync(file, 'utf8') === fs.readFileSync(source, 'utf8')
      : !exists);
    note = `target ${exists ? 'present' : 'absent'}`;
  }
  if (!ok) failures += 1;
  console.log(`${ok ? 'OK' : 'FAIL'} ${unit.task} ${file} ${note}`);
}
const phase = after ? 'after' : 'before';
console.log(failures === 0
  ? `RESULT: ${units.length} units, ${phase} state matches`
  : `RESULT: ${failures} of ${units.length} units do not match the ${phase} state`);
process.exit(failures === 0 ? 0 : 1);
