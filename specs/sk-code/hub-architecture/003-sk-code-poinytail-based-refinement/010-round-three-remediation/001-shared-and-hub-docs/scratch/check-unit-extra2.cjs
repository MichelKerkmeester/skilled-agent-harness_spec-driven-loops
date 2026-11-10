#!/usr/bin/env node
// Prove one dispatch unit landed. Run from the repository root:
//   node <folder>/scratch/check-unit.cjs T0NN
// An edit has landed when the file holds the NEW text and, unless NEW contains
// OLD, no longer holds the OLD text. A create has landed when the file equals
// its source. Prints LANDED <id> and exits 0, or MISSING <id> and exits 1.
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const id = process.argv[2];
const units = JSON.parse(fs.readFileSync(path.join(__dirname, 'dispatch-units-extra2.json'), 'utf8'));
const unit = units.find((u) => u.task === id);
if (!unit) {
  console.log(`UNKNOWN ${id}`);
  process.exit(2);
}

const target = unit.files[0];
let landed = false;
if (unit.kind === 'edit') {
  const oldText = fs.readFileSync(path.join(__dirname, 'units-extra2', `${id}.old.txt`), 'utf8');
  const newText = fs.readFileSync(path.join(__dirname, 'units-extra2', `${id}.new.txt`), 'utf8');
  const text = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
  if (text !== null) {
    const hasNew = newText === '' || text.includes(newText);
    const oldGone = newText.includes(oldText) || !text.includes(oldText);
    landed = hasNew && oldGone;
  }
} else if (unit.kind === 'create') {
  const source = fs.readFileSync(path.join(__dirname, 'units-extra2', `${id}.create.md`), 'utf8');
  landed = fs.existsSync(target) && fs.readFileSync(target, 'utf8') === source;
} else {
  console.log(`NOT-CHECKABLE ${id}: run its own check command`);
  process.exit(2);
}

console.log(`${landed ? 'LANDED' : 'MISSING'} ${id}`);
process.exit(landed ? 0 : 1);
