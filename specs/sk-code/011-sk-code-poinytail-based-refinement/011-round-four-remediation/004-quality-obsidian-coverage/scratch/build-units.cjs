#!/usr/bin/env node
'use strict';
// Builds the ordered dispatch units from edits.txt, replays them on copies of the
// target files, and proves each Find text is unique at the moment it is applied.
// Usage: node build-units.cjs <out-dir-for-replayed-copies>
const fs = require('node:fs');
const path = require('node:path');

const FOLDER = path.resolve(__dirname, '..');
const REPO = path.resolve(FOLDER, '../../../../..');
const REL_FOLDER = path.relative(REPO, FOLDER);
const Q = '.skilled/skills/sk-code/sk-code-quality';
const OUT = path.resolve(process.argv[2] || path.join(__dirname, 'replay'));

function count(hay, needle) {
  let n = 0;
  let i = hay.indexOf(needle);
  while (i !== -1) { n += 1; i = hay.indexOf(needle, i + needle.length); }
  return n;
}

const src = fs.readFileSync(path.join(__dirname, 'edits.txt'), 'utf8');
const blocks = src.split(/^=== /m).filter(Boolean);
const edits = blocks.map((b) => {
  const head = b.slice(0, b.indexOf('\n'));
  const m = head.match(/^(T\d{3}) (\S+) \| (.*)$/);
  const old = b.match(/<<<OLD\n([\s\S]*?)\nOLD>>>/)[1];
  const neu = b.match(/<<<NEW\n([\s\S]*?)\nNEW>>>/)[1];
  return { task: m[1], file: `${Q}/${m[2]}`, label: m[3], old, neu };
});

const originals = {};
const current = {};
for (const e of edits) {
  if (!(e.file in current)) {
    originals[e.file] = fs.readFileSync(path.join(REPO, e.file), 'utf8');
    current[e.file] = originals[e.file];
  }
}

const problems = [];
const units = [];
for (const e of edits) {
  const before = current[e.file];
  const nOrig = count(originals[e.file], e.old);
  const nNow = count(before, e.old);
  if (nOrig !== 1) problems.push(`${e.task}: OLD occurs ${nOrig} times in the original ${e.file}`);
  if (nNow !== 1) problems.push(`${e.task}: OLD occurs ${nNow} times at apply time in ${e.file}`);
  current[e.file] = before.replace(e.old, () => e.neu);
  // Pick a check fragment: a new line absent from OLD, cut at any single quote so the
  // shell command can wrap it in single quotes.
  const oldLines = new Set(e.old.split('\n'));
  const line = e.neu.split('\n').find((l) => !oldLines.has(l));
  let frag = line;
  if (frag.includes("'")) {
    const parts = frag.split("'").sort((a, b) => b.length - a.length);
    frag = parts.find((p) => count(originals[e.file], p) === 0 && count(current[e.file], p) === 1) || parts[0];
  }
  if (count(originals[e.file], frag) !== 0) problems.push(`${e.task}: check fragment already in the original file`);
  if (count(current[e.file], frag) !== 1) problems.push(`${e.task}: check fragment not unique after apply`);
  units.push({
    task: e.task,
    files: [e.file],
    kind: 'edit',
    instruction: `In ${e.file}, replace the exact text <<<OLD\n${e.old}\nOLD>>> with <<<NEW\n${e.neu}\nNEW>>>`,
    check: `grep -cF -- '${frag}' ${e.file}`,
    expect: '1',
    _label: e.label,
  });
}

// The changelog file is created between the SKILL.md and README.md edits, matching tasks.md.
const clIndex = units.findIndex((u) => u.task === 'T027');
units.splice(clIndex, 0, {
  task: 'T026',
  files: [`${Q}/changelog/v1.2.0.0.md`],
  kind: 'create',
  instruction: `Create ${Q}/changelog/v1.2.0.0.md with exactly the content of ${REL_FOLDER}/scratch/units/v1.2.0.0.md.txt`,
  check: `cmp ${REL_FOLDER}/scratch/units/v1.2.0.0.md.txt ${Q}/changelog/v1.2.0.0.md`,
  expect: 'exit 0',
});

fs.mkdirSync(OUT, { recursive: true });
for (const [file, text] of Object.entries(current)) {
  fs.writeFileSync(path.join(OUT, path.basename(file)), text);
}
const clean = units.map(({ _label, ...u }) => u);
fs.writeFileSync(path.join(__dirname, 'dispatch-units.json'), `${JSON.stringify(clean, null, 2)}\n`);
for (const u of units) console.log(`${u.task} ${u.kind} ${path.basename(u.files[0])} ${u._label || 'changelog'} | check: ${u.check}`);
console.log(problems.length ? `PROBLEMS:\n${problems.join('\n')}` : `OK: ${units.length} units, every OLD unique in the original file and at apply time`);
process.exit(problems.length ? 1 : 0);
