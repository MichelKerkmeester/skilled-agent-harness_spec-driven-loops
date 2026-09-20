// Deterministic applier for a {file, changes:[{old,new}]} edit plan.
// Exact-match only: each `old` must occur exactly once or the change is reported, not applied.
const fs = require('fs');
const planPath = process.argv[2];
const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
let applied = 0;
const failures = [];
for (const e of plan.edits) {
  let content;
  try { content = fs.readFileSync(e.file, 'utf8'); }
  catch (err) { failures.push({ file: e.file, reason: 'read-error: ' + err.message }); continue; }
  let fileApplied = 0;
  for (const c of e.changes) {
    const i = content.indexOf(c.old);
    if (i < 0) { failures.push({ file: e.file, reason: 'no-match', snippet: c.old.slice(0, 70) }); continue; }
    if (content.indexOf(c.old, i + 1) >= 0) { failures.push({ file: e.file, reason: 'multi-match', snippet: c.old.slice(0, 70) }); continue; }
    content = content.slice(0, i) + c.new + content.slice(i + c.old.length);
    applied++; fileApplied++;
  }
  if (fileApplied > 0) fs.writeFileSync(e.file, content);
}
console.log('APPLIED=' + applied + ' FAILED=' + failures.length);
if (failures.length) console.log(JSON.stringify(failures, null, 2));
