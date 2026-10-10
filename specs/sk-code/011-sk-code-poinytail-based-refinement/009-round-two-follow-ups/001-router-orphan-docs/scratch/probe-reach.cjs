'use strict';
// Replays one prompt per newly routed Obsidian reference and prints OK or MISS for the doc it
// should reach, with the intents the router chose. Run from the repository root.
const path = require('node:path');
const lib = require(path.resolve('.skilled/skills/sk-code/sk-code-opencode/assets/scripts/router_replay_lib.cjs'));
const root = path.resolve('.skilled/skills/sk-code/sk-code-obsidian');
const probes = [
  ['What does the accessibility reference say about the focus ring on the table view?', 'references/accessibility.md'],
  ['Which theme variable should this new rule key off for the sticky header offset?', 'references/theme-variables.md'],
  ['I need plugin setup help: how do I get the dev watcher running?', 'references/setup/setup.md'],
  ['The settings migration with loadData and saveData dropped a field after the upgrade.', 'references/operations/operations.md'],
  ['Run the doc quality gate on this reference file.', 'references/quality/doc-quality-gate.md'],
  ['Run the skill reference integrity scan and tell me why it reports a dead path.', 'references/skill-reference-integrity.md'],
];
for (const [taskText, doc] of probes) {
  const routed = lib.routeSkillResources({ skillRoot: root, taskText });
  console.log(`${routed.resources.includes(doc) ? 'OK' : 'MISS'} ${doc} [${routed.intents.join('+')}]`);
}
