'use strict';
// Negative proof: load the runtime harness module, feed typedGold a fixture copy in which
// deem-choice-single expects cli-jev, and show the build throws. Reads only; writes nothing tracked.
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../../../../../../../..');
const HARNESS = path.join(ROOT, '.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs');
const FIXTURE = path.join(ROOT, '.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json');
const COPY = path.join(__dirname, 'canary-cases.v1.deem-expects-jev.json');

const fixture = JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));
const entry = fixture.cases.find((item) => item.id === 'deem-choice-single');
entry.expectedModes = ['cli-jev'];
entry.gold.expectedIntents = ['cli-jev'];
fs.writeFileSync(COPY, `${JSON.stringify(fixture, null, 2)}\n`);

const harness = require(HARNESS);
const { snapshot } = harness.loadSnapshot();
const mutated = JSON.parse(fs.readFileSync(COPY, 'utf8'));
try {
  harness.typedGold(snapshot, mutated);
  console.log('NO THROW: the harness accepted a wrong expectation');
  process.exit(1);
} catch (error) {
  console.log(`threw code=${error.code} message=${error.message}`);
  process.exit(error.code === 'GOLD_MISMATCH' && /^gold mismatch for deem-choice-single/.test(error.message) ? 0 : 1);
}
