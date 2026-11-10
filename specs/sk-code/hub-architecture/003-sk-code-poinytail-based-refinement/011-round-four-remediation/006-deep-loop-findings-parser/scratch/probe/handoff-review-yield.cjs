'use strict';
// Measures the review-reducer rule that every narrative finding, F### bullets included,
// yields to the structured rows of its iteration. Before the build it compares the live
// reducer with the live file patched in memory. After the build it compares the copy
// saved in scratch/before/ with the live reducer. Reads only.
const fs = require('node:fs');
const path = require('node:path');
const { loadFromSource } = require('./load-source.cjs');

const reducerPath = path.resolve('.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs');
const savedPath = path.join(__dirname, '..', 'before', 'reduce-state.cjs');
const source = fs.readFileSync(reducerPath, 'utf8');
const oldLine = '      if (numberedNarrativeFindings.has(finding) && structuredRuns.has(iteration.run)) {';
let mode;
let older;
let newer;
if (source.split(oldLine).length === 2) {
  mode = 'before';
  older = require(reducerPath);
  newer = loadFromSource(source.replace(oldLine, () => '      if (structuredRuns.has(iteration.run)) {'), reducerPath);
} else if (fs.existsSync(savedPath)) {
  mode = 'after';
  older = loadFromSource(fs.readFileSync(savedPath, 'utf8'), reducerPath);
  newer = require(reducerPath);
} else {
  console.log('mode=unknown: the reducer changed and no saved copy exists in scratch/before/');
  process.exit(1);
}
const dirs = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isSymbolicLink() || !e.isDirectory() || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (fs.existsSync(path.join(p, 'deep-review-state.jsonl'))) dirs.push(p);
    walk(p);
  }
})('specs');
let same = 0, changed = 0, errors = 0, raised = 0;
for (const dir of dirs) {
  let a;
  try {
    a = older.reduceReviewState(path.dirname(dir), { write: false, lenient: true, artifactDir: dir }).registry;
  } catch {
    errors += 1;
    continue;
  }
  const b = newer.reduceReviewState(path.dirname(dir), { write: false, lenient: true, artifactDir: dir }).registry;
  if (a.openFindingsCount === b.openFindingsCount && a.resolvedFindingsCount === b.resolvedFindingsCount) same += 1;
  else {
    changed += 1;
    if (b.openFindingsCount > a.openFindingsCount) raised += 1;
    console.log(`${dir} open ${a.openFindingsCount} -> ${b.openFindingsCount}, resolved ${a.resolvedFindingsCount} -> ${b.resolvedFindingsCount}`);
  }
}
console.log(`mode=${mode} dirs=${dirs.length} same=${same} changed=${changed} raised=${raised} liveErrors=${errors}`);
