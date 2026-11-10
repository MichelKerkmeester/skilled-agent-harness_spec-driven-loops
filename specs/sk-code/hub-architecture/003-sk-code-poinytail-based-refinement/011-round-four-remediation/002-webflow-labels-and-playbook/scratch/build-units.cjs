// Builds dispatch-units.json and the Phase 2 task text for this phase, then proves every OLD
// text occurs exactly once in the unedited file and again at the moment its unit applies.
// Run from the repository root: node <this file> [--write] [--simulate]
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PHASE = 'specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook';
const S = `${PHASE}/scratch`;
const WF = '.skilled/skills/sk-code/sk-code-webflow';
const LABEL = /\[([a-z]+_[a-z_]+\.md)\]\(([^)]+)\)/;
const FIRST_LABEL_TASK = 13;

function count(hay, needle) {
  let n = 0;
  let i = hay.indexOf(needle);
  while (i !== -1) { n += 1; i = hay.indexOf(needle, i + 1); }
  return n;
}

const rows = fs.readFileSync(`${S}/label-rows.txt`, 'utf8').split('\n').filter(Boolean).map((row) => {
  const m = row.match(/^([^:]+):(\d+):(.*)$/);
  return { file: m[1], line: Number(m[2]), text: m[3] };
});

const original = {};
const units = [];
let taskNo = FIRST_LABEL_TASK;
for (const r of rows) {
  if (!original[r.file]) original[r.file] = fs.readFileSync(r.file, 'utf8');
  const src = original[r.file];
  const lines = src.split('\n');
  if (lines[r.line - 1] !== r.text) throw new Error(`line mismatch ${r.file}:${r.line}`);
  const lm = r.text.match(LABEL);
  const target = lm[2];
  if (!fs.existsSync(path.resolve(path.dirname(r.file), target))) throw new Error(`target missing ${r.file}:${r.line} ${target}`);
  const oldLink = lm[0];
  const newLink = `[\`${target}\`](${target})`;
  let oldText = oldLink;
  let newText = newLink;
  if (count(src, oldText) !== 1) {
    oldText = r.text;
    newText = r.text.replace(oldLink, newLink);
    if (count(src, oldText) !== 1) {
      oldText = `${lines[r.line - 2]}\n${r.text}`;
      newText = `${lines[r.line - 2]}\n${r.text.replace(oldLink, newLink)}`;
      if (count(src, oldText) !== 1) throw new Error(`no unique context ${r.file}:${r.line}`);
    }
  }
  for (const t of [oldText, newText, newLink]) if (t.includes("'")) throw new Error(`single quote in ${r.file}:${r.line}`);
  units.push({
    task: `T${String(taskNo).padStart(3, '0')}`,
    files: [r.file],
    kind: 'edit',
    oldText,
    newText,
    check: `sed -n '${r.line}p' ${r.file} | grep -cF -- '${newLink}'`,
    expect: '1',
    note: `line ${r.line}, label \`${lm[1]}\``,
  });
  taskNo += 1;
}

const PB = `${WF}/manual-testing-playbook/manual-testing-playbook.md`;
original[PB] = fs.readFileSync(PB, 'utf8');
units.push({
  task: `T${String(taskNo++).padStart(3, '0')}`,
  files: [PB],
  kind: 'edit',
  oldText: '# sk-code-webflow: Manual Testing Playbook\n\nRouting-recall corpus for',
  newText: '# sk-code-webflow: Manual Testing Playbook\n\n## 1. OVERVIEW\n\nRouting-recall corpus for',
  check: `grep -n '^## 1. OVERVIEW' ${PB}`,
  expect: '3:## 1. OVERVIEW',
  note: 'playbook root overview heading',
});

const SK = `${WF}/SKILL.md`;
original[SK] = fs.readFileSync(SK, 'utf8');
units.push({
  task: `T${String(taskNo++).padStart(3, '0')}`,
  files: [SK],
  kind: 'edit',
  oldText: 'version: 1.1.1.0',
  newText: 'version: 1.1.2.0',
  check: `grep -n '^version:' ${SK}`,
  expect: '5:version: 1.1.2.0',
  note: 'packet version',
});

const CL = `${WF}/changelog/v1.1.2.0.md`;
const CLSRC = `${S}/units/webflow-changelog-v1.1.2.0.md`;
if (fs.existsSync(CL)) throw new Error('changelog target already exists');
units.push({
  task: `T${String(taskNo++).padStart(3, '0')}`,
  files: [CL],
  kind: 'create',
  source: CLSRC,
  check: `cmp ${CLSRC} ${CL} && echo same`,
  expect: 'same',
  note: 'changelog',
});

for (const u of units) {
  if (u.kind !== 'edit') continue;
  const n = count(original[u.files[0]], u.oldText);
  if (n !== 1) throw new Error(`${u.task} OLD occurs ${n} times in the unedited file`);
}

function instruction(u) {
  if (u.kind === 'create') {
    return `Create ${u.files[0]} with exactly the content of ${u.source}. Copy it byte for byte, for example with: cp ${u.source} ${u.files[0]}`;
  }
  return `In ${u.files[0]}, replace the exact text <<<OLD\n${u.oldText}\nOLD>>> with <<<NEW\n${u.newText}\nNEW>>>. The old text occurs exactly once in the file. Change nothing else.`;
}

const dispatch = units.map((u) => ({ task: u.task, files: u.files, kind: u.kind, instruction: instruction(u), check: u.check, expect: u.expect }));

function taskText(u) {
  if (u.kind === 'create') {
    return `- [ ] ${u.task} Create \`${u.files[0]}\` as a byte-for-byte copy of \`${u.source}\`. Run \`cp ${u.source} ${u.files[0]}\`. Check: run \`${u.check}\`. Expected: \`${u.expect}\`. (\`${u.files[0]}\`)\n`;
  }
  return [
    `- [ ] ${u.task} In \`${u.files[0]}\` (${u.note}), replace the Find text below, which occurs exactly once, with the Replace text. Change nothing else. Then run the Check command. Expected: it prints \`${u.expect}\`. (\`${u.files[0]}\`)`,
    '',
    'Find:',
    '````text',
    u.oldText,
    '````',
    'Replace:',
    '````text',
    u.newText,
    '````',
    'Check:',
    '````bash',
    u.check,
    '````',
    '',
  ].join('\n');
}

const args = process.argv.slice(2);
if (args.includes('--write')) {
  fs.writeFileSync(`${S}/dispatch-units.json`, `${JSON.stringify(dispatch, null, 2)}\n`);
  fs.writeFileSync(`${S}/phase2-tasks.md`, units.map(taskText).join('\n'));
}

if (args.includes('--simulate')) {
  // Apply every unit in order to a copy of the hub and run each check against the copy.
  const SIM = path.resolve(`${S}/sim`);
  const repo = process.cwd();
  if (!fs.existsSync(SIM)) throw new Error('make the sim copy first');
  let ok = 0;
  for (const u of units) {
    const target = path.join(SIM, u.files[0]);
    if (u.kind === 'edit') {
      const cur = fs.readFileSync(target, 'utf8');
      const n = count(cur, u.oldText);
      if (n !== 1) throw new Error(`${u.task} OLD occurs ${n} times at apply time`);
      fs.writeFileSync(target, cur.replace(u.oldText, u.newText));
    } else {
      fs.copyFileSync(path.join(repo, u.source), target);
    }
    let out;
    try { out = execSync(u.check, { cwd: SIM, encoding: 'utf8', shell: '/bin/bash' }).trim(); } catch (e) { out = `ERR ${e.status} ${e.stdout}`; }
    if (out === u.expect) ok += 1; else console.log(`MISMATCH ${u.task}: got ${JSON.stringify(out)} want ${JSON.stringify(u.expect)}`);
  }
  console.log(`simulate: ${ok}/${units.length} checks matched`);
}

console.log(`units=${units.length} label_units=${rows.length} unique_old=OK`);
