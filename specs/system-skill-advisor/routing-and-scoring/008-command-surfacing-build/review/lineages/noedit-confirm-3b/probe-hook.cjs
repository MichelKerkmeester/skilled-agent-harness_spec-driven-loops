// Throwaway review probe. Builds fixtures under this lineage directory, runs the
// doctor check against each, prints the verdict, then removes the fixtures.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const REPO = '/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research';
const BASE = path.join(__dirname, 'probe-hook');
const SCRIPT = path.join(REPO, '.skilled/commands/doctor/scripts/hook-wiring-check.cjs');
const MARKER = '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js';

const cases = [
  ['control: plain launch', `node ${MARKER}`],
  ['working: env unset', `env -u AI_SESSION_CHILD node ${MARKER}`],
  ['working: attached preload', `node -r./preload.cjs ${MARKER}`],
  ['working: separated require', `node --require ./preload.cjs ${MARKER}`],
  ['working: long boolean flag', `node --no-warnings ${MARKER}`],
  ['working: attached long loader', `node --experimental-loader=./x.mjs ${MARKER}`],
  ['working: separated import', `node --import tsx ${MARKER}`],
  ['working: separators with bash -c', `bash -c 'cd "$PWD" && node ${MARKER}'`],
  ['working: interactive flag', `node -i ${MARKER}`],
  ['working: flag after preload', `node -r ./preload.cjs --no-warnings ${MARKER}`],
  ['non-launch: attached eval', `node -e1 ${MARKER}`],
  ['non-launch: eval equals', `node --eval=1 ${MARKER}`],
  ['non-launch: print equals', `node --print=1 ${MARKER}`],
  ['non-launch: attached print', `node -p1 ${MARKER}`],
  ['non-launch: separated eval', `node -e "1" ${MARKER}`],
  ['non-launch: check equals', `node --check=1 ${MARKER}`],
  ['non-launch: combined pe', `node -pe "1" ${MARKER}`],
];

fs.mkdirSync(BASE, { recursive: true });
try {
  for (const [label, command] of cases) {
    const root = path.join(BASE, label.replace(/[^a-z0-9]+/gi, '-'));
    fs.mkdirSync(path.join(root, '.claude'), { recursive: true });
    fs.writeFileSync(
      path.join(root, '.claude/settings.json'),
      JSON.stringify({ hooks: { UserPromptSubmit: [{ hooks: [{ type: 'command', command }] }] } }, null, 2),
    );
    const result = spawnSync(process.execPath, [SCRIPT, '--root', root], { encoding: 'utf8' });
    process.stdout.write(`${JSON.stringify({
      label, command, code: result.status, out: result.stdout.trim(), err: result.stderr.trim(),
    })}\n`);
  }
} finally {
  fs.rmSync(BASE, { recursive: true, force: true });
}
