#!/usr/bin/env node
'use strict';

// Scores the bots hub's playbook gold as a candidate, with the coverage floor
// enforced (admitted: false), against the runtime compiled engine. Read only.
// Usage: node evaluate-hub-candidate.cjs <repo-root>

const path = require('node:path');

const root = process.argv[2];
if (!root) {
  process.stderr.write('usage: evaluate-hub-candidate.cjs <repo-root>\n');
  process.exit(2);
}
const admission = require(path.join(root, '.skilled/bin/lib/compiled-route-admission.cjs'));
const { compiledRoute } = require(path.join(root, '.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs'));

const report = admission.evaluateHub({ hubId: 'system-skilled-bots', route: compiledRoute, admitted: false });
process.stdout.write(`verdict: ${report.verdict}\n`);
process.stdout.write(`counts: ${JSON.stringify(report.counts)}\n`);
process.stdout.write(`coverage: ${JSON.stringify(report.coverage)}\n`);
for (const scenario of report.scenarios) {
  process.stdout.write(`  ${scenario.id} ${scenario.status} gold=${scenario.goldModes.join('+')} routed=${scenario.routedModes.join('+') || '-'}${scenario.reason ? ` reason=${scenario.reason} ${scenario.detail || ''}` : ''}\n`);
}
process.exit(report.verdict === 'pass' ? 0 : 1);
