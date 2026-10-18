// Runs one corpus of v1 OpenCode commands through the pre-change engine (main checkout)
// and the changed engine (this worktree) and reports any verdict that differs.
import { readFileSync } from 'node:fs';
const [mainRoot, wtRoot] = process.argv.slice(2);
const load = async (root) => {
  const m = await import(`${root}/.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`);
  return { evaluate: m.evaluate, rules: m.readHardRules(`${root}/.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`) };
};
const before = await load(mainRoot);
const after = await load(wtRoot);
const corpus = new Set();
for (const f of ['dispatch-rule-checks.test.mjs', 'dispatch-audit.test.mjs']) {
  const text = readFileSync(`${mainRoot}/.skilled/hooks/dispatch/lib/${f}`, 'utf8');
  for (const m of text.matchAll(/['"`](opencode run[^'"`\n]*)['"`]/g)) corpus.add(m[1]);
}
for (const c of [
  'opencode run -m p/m "task" </dev/null', 'opencode run "task" </dev/null', 'opencode run -m p/m "task"',
  'opencode run -m p/m --agent general "task" </dev/null', 'opencode run -m p/m "/memory:search q" </dev/null',
  'opencode run -m p/m --command memory:search q </dev/null', 'opencode run -m p/m --share "task" </dev/null',
]) corpus.add(c);
let diffs = 0;
for (const cmd of corpus) {
  const a = before.evaluate(cmd, before.rules).map((v) => `${v.id}:${v.severity}`).sort().join(',');
  const b = after.evaluate(cmd, after.rules).map((v) => `${v.id}:${v.severity}`).sort().join(',');
  if (a !== b) { diffs += 1; console.log(`DIFF ${JSON.stringify(cmd)}\n  before ${a}\n  after  ${b}`); }
}
console.log(`corpus ${corpus.size} v1 commands, ${diffs} verdict differences`);
