// Reruns every unit check in dispatch-units.json and compares it with the unit's expected output.
// Run from the repository root: node <this file>
'use strict';
const { execSync } = require('child_process');
const units = require('./dispatch-units.json');
let ok = 0;
for (const u of units) {
  let out;
  try { out = execSync(u.check, { encoding: 'utf8', shell: '/bin/bash' }).trim(); } catch (e) { out = `exit ${e.status}: ${(e.stdout || '').trim()}`; }
  if (out === u.expect) ok += 1; else console.log(`MISMATCH ${u.task}: got ${JSON.stringify(out)} want ${JSON.stringify(u.expect)}`);
}
console.log(`${ok}/${units.length} checks matched`);
