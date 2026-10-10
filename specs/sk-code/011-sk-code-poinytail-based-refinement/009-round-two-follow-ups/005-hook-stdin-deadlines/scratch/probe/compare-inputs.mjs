// Runs each of the fourteen hooks from the saved before copy and from a second tree
// with the same inputs, and reports any difference in exit status, signal or stdout.
// Usage: node compare-inputs.mjs <before .skilled/hooks dir> <root holding .skilled/hooks>
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const [, , beforeHooks, afterRoot] = process.argv;
const realSkills = path.join(path.resolve(afterRoot), '.skilled', 'skills');
const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'compare-inputs-'));
const beforeRoot = path.join(workDir, 'before');
fs.mkdirSync(path.join(beforeRoot, '.skilled'), { recursive: true });
fs.cpSync(path.resolve(beforeHooks), path.join(beforeRoot, '.skilled', 'hooks'), { recursive: true });
fs.symlinkSync(realSkills, path.join(beforeRoot, '.skilled', 'skills'));
const emptyCwd = path.join(workDir, 'cwd');
fs.mkdirSync(emptyCwd);

const FILES = [
  'classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs',
  'classifier-injection-screen/devin/classifier-injection-screen-posttooluse.mjs',
  'dispatch/claude/dispatch-preflight-lint.mjs', 'dispatch/codex/dispatch-preflight-lint.mjs',
  'dispatch/cursor/dispatch-preflight-lint.mjs', 'dispatch/devin/dispatch-preflight-lint.mjs',
  'dispatch/claude/dispatch-audit-posttooluse.mjs', 'dispatch/codex/dispatch-audit-posttooluse.mjs',
  'dispatch/devin/dispatch-audit-posttooluse.mjs', 'goal/cursor/goal-inject.mjs', 'goal/devin/goal-inject.mjs',
  'mcp-route-guard/cursor/mcp-route-guard.mjs', 'task-dispatch/cursor/task-dispatch-guard.mjs',
  'task-dispatch/claude/fable-subagent-guard.mjs',
];
const env = { ...process.env };
for (const k of Object.keys(env)) if (/_DISABLED$/.test(k)) delete env[k];
const CASES = {
  empty: { input: '' },
  invalid: { input: '{not json' },
  nonObject: { input: '123' },
  nullJson: { input: 'null' },
  ignored: { stdio: ['ignore', 'pipe', 'pipe'] },
};
let diffs = 0;
for (const file of FILES) {
  const row = [];
  for (const [name, c] of Object.entries(CASES)) {
    const out = [beforeRoot, path.resolve(afterRoot)].map((root) => {
      const r = spawnSync(process.execPath, [path.join(root, '.skilled', 'hooks', file)], {
        env, encoding: 'utf8', timeout: 15000, cwd: emptyCwd, ...(c.stdio ? { stdio: c.stdio } : { input: c.input }),
      });
      return JSON.stringify([r.status, r.signal, r.stdout]);
    });
    const same = out[0] === out[1];
    if (!same) diffs += 1;
    row.push(`${name}:${same ? 'same' : `DIFF ${out.join(' vs ')}`}`);
  }
  console.log(path.basename(path.dirname(path.dirname(file))) + '/' + path.basename(path.dirname(file)) + '/' + path.basename(file), row.join(' '));
}
fs.rmSync(workDir, { recursive: true, force: true });
console.log(`diffs=${diffs}`);
process.exit(diffs === 0 ? 0 : 1);
