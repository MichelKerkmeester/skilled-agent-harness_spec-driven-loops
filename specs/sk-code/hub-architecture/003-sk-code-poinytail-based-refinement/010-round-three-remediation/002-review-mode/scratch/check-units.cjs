#!/usr/bin/env node
// Confirms dispatch-units.json parses and that every edit unit's OLD text occurs
// exactly once in its file, applying earlier units to the same file first so a
// later unit is checked against the text it will actually meet.
// Run from the repository root: node <this file>
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const unitsPath = path.join(__dirname, 'dispatch-units.json');
const units = JSON.parse(fs.readFileSync(unitsPath, 'utf8'));
const EDIT = /^In (\S+), replace the exact text <<<OLD\n([\s\S]*)\nOLD>>> with <<<NEW\n([\s\S]*)\nNEW>>>$/;

const state = new Map();
let problems = 0;
let edits = 0;
for (const unit of units) {
  if (unit.files.length !== 1) {
    console.log(`PROBLEM ${unit.task}: ${unit.files.length} files`);
    problems += 1;
  }
  if (unit.kind !== 'edit') {
    continue;
  }
  const match = EDIT.exec(unit.instruction);
  if (!match) {
    console.log(`PROBLEM ${unit.task}: instruction does not parse`);
    problems += 1;
    continue;
  }
  const [, file, oldText, newText] = match;
  if (!state.has(file)) {
    state.set(file, fs.readFileSync(file, 'utf8'));
  }
  const text = state.get(file);
  const count = text.split(oldText).length - 1;
  if (count !== 1) {
    console.log(`PROBLEM ${unit.task}: OLD occurs ${count} times in ${file}`);
    problems += 1;
    continue;
  }
  state.set(file, text.replace(oldText, () => newText));
  edits += 1;
}
console.log(`units=${units.length} edits_checked=${edits} problems=${problems}`);
process.exit(problems === 0 ? 0 : 1);
