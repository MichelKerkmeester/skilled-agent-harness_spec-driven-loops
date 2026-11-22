#!/usr/bin/env node
'use strict';

// Scratch stage-two replay for a hub with no compiled engine in HUB_CHILD.
// Compiles the hub's SKILL.md, ROUTER.md, hub-router.json and mode-registry.json
// through the generic canonical compiler (the one `compiled-route-manifest.cjs mint`
// uses) and evaluates each prompt with that compiler's router. Writes nothing.
// usage: node stage2-replay.cjs <hubId> "<prompt>" ["<prompt>" ...]

const fs = require('node:fs');
const path = require('node:path');

const REPO = path.resolve(__dirname, '../../../../../..');
const CHILD = path.join(REPO, '.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib');
const { compileRegistry } = require(path.join(CHILD, 'registry-compiler.cjs'));
const { evaluateCanary } = require(path.join(CHILD, 'canary-router.cjs'));

const [hubId, ...prompts] = process.argv.slice(2);
const root = path.join(REPO, '.skilled/skills', hubId);
const read = (f) => fs.readFileSync(path.join(root, f));
const sourceBytes = {
  'SKILL.md': read('SKILL.md'),
  'hub-router.json': read('hub-router.json'),
  'mode-registry.json': read('mode-registry.json'),
};
const routerBytes = read('ROUTER.md');
const text = routerBytes.toString('utf8');
const idx = text.indexOf('\n## MACHINE ROUTER');
const routerMarkdown = idx >= 0 ? text.slice(idx + 1) : null;
if (routerMarkdown !== null) sourceBytes['ROUTER.md'] = routerBytes;

const snapshot = compileRegistry({
  activationGeneration: 1,
  hubRouter: JSON.parse(sourceBytes['hub-router.json']),
  registry: JSON.parse(sourceBytes['mode-registry.json']),
  routerMarkdown,
  skillMarkdown: sourceBytes['SKILL.md'].toString('utf8'),
  sourceBytes,
});

for (const prompt of prompts) {
  const { decision } = evaluateCanary(snapshot, { prompt });
  const route = decision.route || null;
  const targets = route ? route.targets.map((t) => t.destinationId.workflowMode) : [];
  process.stdout.write(`${JSON.stringify({ prompt, action: decision.action, selectionKind: route ? route.selectionKind : null, targets })}\n`);
}
