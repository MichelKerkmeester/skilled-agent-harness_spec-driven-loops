// Read-only: runs every hub's canary fixture through its own harness and prints one summary line per hub.
// Run from the repository root. Exit 1 when any hub has a failing case.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const BASE = path.join(process.cwd(), '.skilled/bin/lib/compiled-routing/009-parent-hub-rollout');
let total = 0;
for (const hub of fs.readdirSync(BASE).sort()) {
  const harness = path.join(BASE, hub, 'harness/build-artifacts.cjs');
  if (!fs.existsSync(harness)) continue;
  const H = require(harness);
  const { fixture, snapshot } = H.loadSnapshot();
  const rows = H.typedGold(snapshot, fixture).cases;
  let bad = 0;
  fixture.cases.forEach((c, i) => {
    const r = rows[i];
    const modes = r.targetQualifiedIds.map((q) => q.split('/')[1]);
    const ok = r.decisionAction === c.expectedAction
      && (!c.expectedSelectionKind || r.selectionKind === c.expectedSelectionKind)
      && (!c.expectedModes || JSON.stringify(modes) === JSON.stringify(c.expectedModes));
    if (!ok) { bad += 1; console.log(`  FAIL ${hub} ${c.id} ${r.decisionAction} ${r.selectionKind || '-'} ${modes.join(',')}`); }
  });
  total += bad;
  console.log(`${hub} cases ${rows.length} failures ${bad}`);
}
console.log(`all hubs failures ${total}`);
process.exit(total ? 1 : 0);
