// Read-only probe: run the authored (z_archive) classifier hub's own fixture through
// its harness, exactly as the canary runner does for served hubs, to see whether the
// authored fixture still passes with the fixed harness. Writes nothing.
// Usage: node authored-classifier-canary-probe.cjs <repo-root>
'use strict';
const path = require('node:path');

const repoRoot = path.resolve(process.argv[2] ?? '.');
const H = require(path.join(repoRoot, 'specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs'));
const { fixture, snapshot } = H.loadSnapshot();
const rows = H.typedGold(snapshot, fixture).cases;
let bad = 0;
fixture.cases.forEach((c, i) => {
  const r = rows[i];
  const modes = r.targetQualifiedIds.map((q) => q.split('/')[1]);
  const ok = r.decisionAction === c.expectedAction
    && (!c.expectedSelectionKind || r.selectionKind === c.expectedSelectionKind)
    && (!c.expectedModes || JSON.stringify(modes) === JSON.stringify(c.expectedModes));
  if (!ok) {
    bad += 1;
    console.log(`FAIL ${c.id} got=${r.decisionAction} ${r.selectionKind || '-'} ${modes.join(',')} want=${c.expectedAction} ${c.expectedSelectionKind || '-'} ${(c.expectedModes || []).join(',')}`);
  }
});
console.log(`authored classifier fixture cases=${rows.length} failures=${bad}`);
process.exit(bad ? 1 : 0);
