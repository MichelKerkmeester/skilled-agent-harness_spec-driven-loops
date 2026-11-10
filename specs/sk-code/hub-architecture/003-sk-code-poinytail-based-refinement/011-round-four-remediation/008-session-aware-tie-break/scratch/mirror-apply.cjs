// Planner dry run: applies dispatch-units.json inside the scratch mirror, one unit at a time,
// and compares each unit's check output with its expect. Run from the repository root.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const MIRROR = path.join(__dirname, 'mirror');
const units = JSON.parse(fs.readFileSync(path.join(__dirname, 'dispatch-units.json'), 'utf8'));
const sh = (cmd) => spawnSync('bash', ['-c', cmd], { cwd: MIRROR, encoding: 'utf8' });
let bad = 0;
for (const u of units) {
  const target = path.join(MIRROR, u.files[0]);
  if (u.kind === 'edit') {
    const m = /<<<OLD\n([\s\S]*?)\nOLD>>> with <<<NEW\n([\s\S]*?)\nNEW>>>$/.exec(u.instruction);
    const text = fs.readFileSync(target, 'utf8');
    if (text.split(m[1]).length !== 2) { console.log(`${u.task} OLD not unique in mirror`); bad += 1; continue; }
    fs.writeFileSync(target, text.replace(m[1], () => m[2]));
  } else if (u.kind === 'create') {
    const src = / with exactly the content of (\S+)$/.exec(u.instruction)[1];
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(MIRROR, src), target);
  } else {
    const r = sh(u.instruction);
    console.log(`${u.task} run: ${(r.stdout + r.stderr).trim().split('\n').slice(-1)[0]}`);
  }
  const c = sh(u.check);
  const out = c.stdout + c.stderr;
  const ok = u.expect === 'exit 0' ? c.status === 0 : (u.expect === 'exit 1' ? c.status === 1 : out.includes(u.expect));
  if (!ok) bad += 1;
  console.log(`${u.task} ${ok ? 'OK' : 'MISMATCH'} expect=${JSON.stringify(u.expect)} got=${JSON.stringify(out.trim())}`);
}
console.log(`units ${units.length} mismatches ${bad}`);
process.exit(bad ? 1 : 0);
