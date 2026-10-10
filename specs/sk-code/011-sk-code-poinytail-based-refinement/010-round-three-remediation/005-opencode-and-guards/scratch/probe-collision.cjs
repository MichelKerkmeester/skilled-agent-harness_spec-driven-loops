// Read-only probe: runs candidate collision prompts through the canary harness without writing the fixture.
const path = require('path');
const H = require(path.join(process.cwd(), '.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs'));
const { fixture, snapshot } = H.loadSnapshot();
const prompts = process.argv.slice(2);
const probe = { ...fixture, cases: prompts.map((p, i) => ({ id: 'probe-' + i, prompt: p, riskSlice: 'actor:mutating:composite', expectedAction: 'route', gold: { expectedIntents: [], expectedResources: [] } })) };
const rows = H.typedGold(snapshot, probe).cases;
rows.forEach((r, i) => console.log(JSON.stringify(prompts[i]), r.decisionAction, r.selectionKind || '-', r.targetQualifiedIds.map((q) => q.split('/')[1]).join(',')));
