// Run from the repository root: node <this file>
// Runs the brief-cost script with AI_SESSION_CHILD=1 against a scratch root whose
// stub hook records the value it received, and prints that value. Builds and
// removes its own temporary root.
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
const SCRIPT = resolve('.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs');
const root = mkdtempSync(join(tmpdir(), 'probe-cost-child-'));
try {
  const corpus = join(root, '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl');
  mkdirSync(dirname(corpus), { recursive: true });
  writeFileSync(corpus, `${JSON.stringify({ id: 'cost-live', prompt: 'live row', row_type: 'typed', split: 'none' })}\n`);
  const hook = join(root, '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js');
  mkdirSync(dirname(hook), { recursive: true });
  const seen = join(root, 'child-seen.txt');
  writeFileSync(hook, `require('node:fs').writeFileSync(${JSON.stringify(seen)}, String(process.env.AI_SESSION_CHILD ?? '<unset>'));\nprocess.stdout.write(JSON.stringify({ hookSpecificOutput: { additionalContext: 'Advisor: live · sk-doc → /create:readme' } }));\n`);
  const run = spawnSync(process.execPath, [SCRIPT, '--root', root], { encoding: 'utf8', env: { ...process.env, AI_SESSION_CHILD: '1' } });
  console.log(`script exit ${run.status}`);
  console.log(`hook saw AI_SESSION_CHILD=${readFileSync(seen, 'utf8')}`);
} finally {
  rmSync(root, { recursive: true, force: true });
}
