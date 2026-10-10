'use strict';
// Prints one line per Obsidian playbook scenario: its routed intents and resource count.
// Run from the repository root.
const fs = require('node:fs');
const path = require('node:path');
const lib = require(path.resolve('.skilled/skills/sk-code/sk-code-opencode/assets/scripts/router_replay_lib.cjs'));
const root = path.resolve('.skilled/skills/sk-code/sk-code-obsidian');
const rows = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(file); continue; }
    if (!entry.name.endsWith('.md') || entry.name === 'manual-testing-playbook.md') continue;
    const text = fs.readFileSync(file, 'utf8');
    const id = /^id:\s*(\S+)/m.exec(text);
    const fence = /```text\n([\s\S]*?)\n```/.exec(text);
    const inline = /^-\s*Prompt:\s*`([^`]+)`/m.exec(text);
    const prompt = (fence ? fence[1] : inline ? inline[1] : '').trim();
    if (!id || !prompt) continue;
    const routed = lib.routeSkillResources({ skillRoot: root, taskText: prompt });
    rows.push(`${id[1]} intents=${routed.intents.slice().sort().join('+') || 'none'} resources=${routed.resources.length}`);
  }
}(path.join(root, 'manual-testing-playbook')));
console.log(rows.sort().join('\n'));
