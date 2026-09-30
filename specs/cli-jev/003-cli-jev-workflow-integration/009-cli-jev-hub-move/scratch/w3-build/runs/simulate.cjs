'use strict';
// Scratch-only simulation: compile the proposed registry and router with the
// rollout child's own compiler and replay prompts through its router.
const fs = require('node:fs');
const path = require('node:path');
const ROOT = process.cwd();
const CHILD = path.join(ROOT, '.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier');
const { compileRegistry } = require(path.join(CHILD, 'lib/registry-compiler.cjs'));
const { evaluateRoute } = require(path.join(CHILD, 'lib/router.cjs'));
const A = path.join(ROOT, process.argv[2]);
const regB = fs.readFileSync(path.join(A, 'mode-registry.json'));
const hubB = fs.readFileSync(path.join(A, 'hub-router.json'));
const skillB = fs.readFileSync(path.join(ROOT, '.skilled/skills/cli-classifier/SKILL.md'));
const usageB = fs.readFileSync(path.join(ROOT, '.skilled/skills/cli-classifier/cli-usage/SKILL.md'));
const deemB = fs.readFileSync(path.join(ROOT, '.skilled/skills/cli-classifier/cli-deem/SKILL.md'));
const registry = JSON.parse(regB.toString('utf8'));
const hubRouter = JSON.parse(hubB.toString('utf8'));
// The unedited clone still keys its sources as cli-jev/...; the ids only feed hashes.
const sourceBytes = {
  'cli-jev/SKILL.md': skillB,
  'cli-jev/cli-usage/SKILL.md': usageB,
  'cli-jev/cli-deem/SKILL.md': deemB,
  'cli-jev/hub-router.json': hubB,
  'cli-jev/mode-registry.json': regB,
};
const snapshot = compileRegistry({
  activationGeneration: 1, hubRouter, registry,
  packetSkillMarkdown: { 'cli-jev': usageB.toString('utf8'), 'cli-deem': deemB.toString('utf8') },
  skillMarkdown: skillB.toString('utf8'), sourceBytes,
});
const prompts = fs.readFileSync(process.argv[3], 'utf8').split('\n').filter(Boolean);
for (const p of prompts) {
  const r = evaluateRoute(snapshot, { prompt: p });
  const d = r.decision;
  const t = d.action === 'route' ? d.route.targets.map((x) => `${x.destinationId.workflowMode}/${x.destinationId.packetId}`).join('+') : '';
  console.log(`${d.action}\t${d.route ? d.route.selectionKind : ''}\t${t}\t${p}`);
}
