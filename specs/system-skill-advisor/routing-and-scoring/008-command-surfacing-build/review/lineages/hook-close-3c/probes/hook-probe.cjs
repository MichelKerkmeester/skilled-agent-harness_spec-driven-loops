const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const base = path.join(__dirname, 'hook-roots');
const marker = '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js';
const cases = [
  ['env-file-spaced', `node --env-file vars ${marker}`],
  ['env-file-equals', `node --env-file=vars ${marker}`],
  ['bash-o-pipefail', `bash -o pipefail -c 'node ${marker}'`],
  ['bash-O-extglob', `bash -O extglob -c 'node ${marker}'`],
  ['if-guard', `if [ -f vars ]; then node ${marker}; fi`],
  ['command-builtin', `command node ${marker}`],
  ['env-split', `env -S 'node ${marker}'`],
  ['exec-in-bash', `bash -c 'exec node ${marker}'`],
  ['sh-c', `sh -c 'node ${marker}'`],
  ['quoted-prefix', `node "\${CLAUDE_PROJECT_DIR:-$PWD}"/${marker}`],
  ['subshell-cd', `(cd . && node ${marker})`],
  ['attached-c-quote', `bash -c'node ${marker}'`],
];
for (const [label, command] of cases) {
  const root = path.join(base, label);
  fs.rmSync(root, { recursive: true, force: true });
  fs.mkdirSync(path.join(root, '.claude'), { recursive: true });
  fs.writeFileSync(path.join(root, '.claude/settings.json'), JSON.stringify({ hooks: { UserPromptSubmit: [{ hooks: [{ type: 'command', command }] }] } }, null, 2));
  const result = spawnSync(process.execPath, ['.skilled/commands/doctor/scripts/hook-wiring-check.cjs', '--root', root], { encoding: 'utf8' });
  console.log(JSON.stringify({ label, command, code: result.status, out: result.stdout.trim(), err: result.stderr.trim() }));
}
