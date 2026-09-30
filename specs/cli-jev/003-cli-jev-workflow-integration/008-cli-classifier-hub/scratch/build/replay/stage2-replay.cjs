'use strict';
// In-memory stage-2 replay for a hub that is not admitted to compiled routing.
// Reuses the single-transport rollout compiler and router, feeding the target hub's
// bytes under the source keys that compiler expects. Nothing is written to disk.
const fs = require('node:fs');
const path = require('node:path');
const REPO = process.argv[2];
const HUB = process.argv[3];
const prompts = process.argv.slice(4);
const LIB = path.join(REPO, '.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-jev/lib');
const { compileRegistry } = require(path.join(LIB, 'registry-compiler.cjs'));
const { evaluateRoute } = require(path.join(LIB, 'router.cjs'));
const root = path.join(REPO, '.skilled/skills', HUB);
const registry = JSON.parse(fs.readFileSync(path.join(root, 'mode-registry.json'), 'utf8'));
const hubRouter = JSON.parse(fs.readFileSync(path.join(root, 'hub-router.json'), 'utf8'));
const skillMarkdown = fs.readFileSync(path.join(root, 'SKILL.md'), 'utf8');
const sourceBytes = {
  'cli-jev/SKILL.md': Buffer.from(skillMarkdown),
  'cli-jev/mode-registry.json': fs.readFileSync(path.join(root, 'mode-registry.json')),
  'cli-jev/hub-router.json': fs.readFileSync(path.join(root, 'hub-router.json')),
};
const packetSkillMarkdown = {};
for (const mode of registry.modes) {
  const md = fs.readFileSync(path.join(root, mode.packet, 'SKILL.md'), 'utf8');
  sourceBytes[`cli-jev/${mode.packet}/SKILL.md`] = Buffer.from(md);
  packetSkillMarkdown[mode.workflowMode] = md;
}
const snapshot = compileRegistry({ activationGeneration: 1, hubRouter, packetSkillMarkdown, registry, skillMarkdown, sourceBytes });
for (const prompt of prompts) {
  const result = evaluateRoute(snapshot, { prompt });
  const d = result.decision;
  const r = d.route || {};
  const modes = (r.targets || []).map((t) => (t.destinationId && t.destinationId.workflowMode) || t.workflowMode);
  console.log(JSON.stringify({ prompt, action: d.action, selectionKind: r.selectionKind || null, modes, matchedCount: ((result.trace && result.trace.matchedDetectorIds) || []).length }));
}
