// Read-only canary assertion for the sk-code fixture: one line per case, then the totals. Run from the repository root.
const path = require('path');
const H = require(path.join(process.cwd(), '.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs'));
const { fixture, snapshot } = H.loadSnapshot();
const rows = H.typedGold(snapshot, fixture).cases;
let bad = 0;
fixture.cases.forEach((c, i) => {
  const r = rows[i];
  const modes = r.targetQualifiedIds.map((q) => q.split('/')[1]);
  const ok = r.decisionAction === c.expectedAction
    && (!c.expectedSelectionKind || r.selectionKind === c.expectedSelectionKind)
    && (!c.expectedModes || JSON.stringify(modes) === JSON.stringify(c.expectedModes));
  if (!ok) bad++;
  console.log(ok ? 'OK' : 'FAIL', c.id, r.decisionAction, r.selectionKind || '-', modes.join(','));
});
console.log('cases', rows.length, 'failures', bad);
process.exit(bad ? 1 : 0);
