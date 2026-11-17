// Run from the repository root: node <this file>
// Writes one .claude/settings.json prompt hook per launch shape into a scratch root,
// runs the hook-wiring check on each and prints its verdict, then runs the check
// on this repository. Builds and removes its own temporary roots.
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const HW = path.resolve('.skilled/commands/doctor/scripts/hook-wiring-check.cjs');
const M = '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js';
const shapes = [
  ['plain node', `node ${M}`],
  ['env node', `env node ${M}`],
  ['/usr/bin/env node', `/usr/bin/env node ${M}`],
  ['bash -lc', `bash -lc "node ${M}"`],
  ['zsh -c', `zsh -c 'node ${M}'`],
  ['node with a flag', `node --no-warnings ${M}`],
  ['&& stuck to the word', `cd "$PWD"&& node ${M}`],
  ['; stuck to the word', `cd /tmp; node ${M}`],
  ['the repository shape', `bash -c 'cd "\${CLAUDE_PROJECT_DIR:-$PWD}" && node ${M} || true'`],
  ['echo with a quoted script', `echo "x && node ${M}"`],
  ['echo of node', `echo node ${M}`],
];
for (const [label, command] of shapes) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'probe-hook-shapes-'));
  try {
    fs.mkdirSync(path.join(root, '.claude'));
    fs.writeFileSync(path.join(root, '.claude', 'settings.json'), JSON.stringify({ hooks: { UserPromptSubmit: [{ hooks: [{ type: 'command', command }] }] } }));
    const run = spawnSync(process.execPath, [HW, '--root', root], { encoding: 'utf8' });
    console.log(`${label}: exit ${run.status} ${run.stdout.trim()}`);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}
const here = spawnSync(process.execPath, [HW, '--root', '.'], { encoding: 'utf8' });
console.log(`this repository: exit ${here.status} ${here.stdout.trim().split('\n').join(', ')}`);
