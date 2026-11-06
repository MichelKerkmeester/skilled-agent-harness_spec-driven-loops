// Read-only: evaluates every canary case with the harness router in memory.
// Nothing is written. The fixture is read and the snapshot is recomputed in memory.
const path = require('path');
const ROOT = '/Users/michelkerkmeester/MEGA/Development/Skilled';
const P = path.join(ROOT, '.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration');
const mod = require(path.join(P, 'harness/build-artifacts.cjs'));
const { evaluateRoute } = require(path.join(P, 'lib/router.cjs'));
const fixture = require(path.join(P, 'fixtures/canary-cases.v1.json'));
const { snapshot } = mod.loadSnapshot();
let pass = 0;
let fail = 0;
for (const c of fixture.cases) {
  const d = evaluateRoute(snapshot, { prompt: c.prompt }).decision;
  const targets = (d.route && d.route.targets) || [];
  const modes = targets.map((t) => t.destinationId.workflowMode);
  const actionOk = d.action === c.expectedAction;
  const modesOk = c.expectedModes === undefined || JSON.stringify(modes) === JSON.stringify(c.expectedModes);
  const ok = actionOk && modesOk;
  if (ok) pass += 1; else fail += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${c.id} action=${d.action} modes=${JSON.stringify(modes)} expected=${c.expectedAction}/${JSON.stringify(c.expectedModes)}`);
}
console.log(`summary pass=${pass} fail=${fail} total=${fixture.cases.length}`);
