// Read-only trial, run from the repository root. Strips a "finished a <x> run" clause from every
// system-deep-loop scenario prompt and asks the hub's compiled router whether the decision changes.
// It measures how many prompts a context-strip rule would touch before anyone builds one.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = process.cwd();
const hubLib = '.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop';
const router = require(path.join(root, hubLib, 'lib/canary-router.cjs'));
const { snapshot } = require(path.join(root, hubLib, 'harness/build-artifacts.cjs')).loadSnapshot();
const STRIP = /\b(?:we |i )?(?:just )?(?:finished|completed|ran) (?:a|an|the|our) [a-z-]+(?: [a-z-]+)? (?:run|loop|session)\b\.?/gi;

// The admission CLI exits 1 while the hub drifts, so read its report without trusting the exit code.
const run = spawnSync('node', ['.skilled/bin/compiled-route-admission.cjs', '--hub', 'system-deep-loop', '--json'], { encoding: 'utf8' });
const report = JSON.parse(run.stdout);
let prompts = 0;
let changed = 0;
for (const scenario of report.hubs[0].scenarios) {
  const text = fs.readFileSync(path.join(root, '.skilled/skills/system-deep-loop', scenario.file), 'utf8');
  const match = /^- Prompt: `([^`]*)`/m.exec(text);
  if (!match) continue;
  prompts += 1;
  const stripped = match[1].replace(STRIP, '');
  if (stripped === match[1]) continue;
  changed += 1;
  const before = router.evaluateCanary(snapshot, { prompt: match[1] }).decision.action;
  const after = router.evaluateCanary(snapshot, { prompt: stripped }).decision.action;
  console.log(`${scenario.id}: ${before} -> ${after}`);
}
console.log(`prompts ${prompts} changed ${changed}`);
