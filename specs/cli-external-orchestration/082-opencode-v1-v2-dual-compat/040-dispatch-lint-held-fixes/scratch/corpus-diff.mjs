// Compares the dispatch engine before and after this phase on one command corpus.
// Usage: node corpus-diff.mjs <before-root> <after-root>
// The corpus is every quoted string in the pre-change dispatch suites that names an executor,
// plus the earlier v1 `opencode run` parity corpus, so a verdict that moves is either one a
// finding names or a regression.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const [beforeRoot, afterRoot] = process.argv.slice(2);
const SKILLS = join(afterRoot, '.skilled', 'skills');

const load = async (root) => ({
  audit: await import(join(root, '.skilled/hooks/dispatch/lib/dispatch-audit.mjs')),
  checks: await import(join(root, '.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs')),
});

const SUITES = [
  '.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs',
  '.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs',
  '.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts',
  '.skilled/hooks/dispatch/codex/codex-shell-tool.test.mjs',
];
const EXECUTOR = /\b(?:opencode\d*|claude|codex|devin|cursor-agent|pi|hermes|jev|jev-mcp)\b/;
const corpus = new Set();
for (const suite of SUITES) {
  const text = readFileSync(join(beforeRoot, suite), 'utf8');
  for (const m of text.matchAll(/'((?:\\.|[^'\\\n])*)'|"((?:\\.|[^"\\\n])*)"|`((?:\\.|[^`\\])*)`/g)) {
    const raw = m[1] ?? m[2] ?? m[3];
    if (!raw || raw.length < 6 || raw.includes('${') || !EXECUTOR.test(raw)) continue;
    corpus.add(raw.replace(/\\n/g, '\n').replace(/\\(["'`\\])/g, '$1'));
  }
}
for (const c of [
  'opencode run -m p/m "task" </dev/null', 'opencode run "task" </dev/null', 'opencode run -m p/m "task"',
  'opencode run -m p/m --agent general "task" </dev/null', 'opencode run -m p/m "/memory:search q" </dev/null',
  'opencode run -m p/m --command memory:search q </dev/null', 'opencode run -m p/m --share "task" </dev/null',
]) corpus.add(c);

const before = await load(beforeRoot);
const after = await load(afterRoot);

function verdicts(engine, command) {
  const inspected = engine.audit.inspectDispatch(command);
  const shape = engine.audit.matchDispatchShape(command);
  const resolved = engine.audit.resolveDispatchPacket(command);
  const all = typeof engine.audit.resolveDispatchPackets === 'function'
    ? engine.audit.resolveDispatchPackets(command).map((entry) => entry.skill)
    : (resolved ? [resolved.skill] : []);
  const rules = [];
  for (const skill of new Set(['cli-opencode', ...all])) {
    const entry = engine.audit.DISPATCH_SHAPES.find((d) => d.skill === skill);
    if (!entry) continue;
    const hard = engine.checks.readHardRules(join(SKILLS, entry.packetPath, 'SKILL.md'));
    for (const v of engine.checks.evaluate(command, hard, { version: 'v1' })) rules.push(`${skill}/${v.id}:${v.severity}`);
  }
  return {
    inspect: `${inspected.kind}${inspected.executor ? `:${inspected.executor}` : ''}`,
    audit: shape?.skill ?? null,
    packets: all.join(',') || null,
    rules: [...new Set(rules)].sort().join(' '),
  };
}

let diffs = 0;
for (const command of corpus) {
  const a = verdicts(before, command);
  const b = verdicts(after, command);
  const moved = Object.keys(a).filter((key) => a[key] !== b[key]);
  if (moved.length === 0) continue;
  diffs += 1;
  console.log(`DIFF ${JSON.stringify(command)}`);
  for (const key of moved) console.log(`  ${key}: ${JSON.stringify(a[key])} -> ${JSON.stringify(b[key])}`);
}
console.log(`corpus ${corpus.size} commands, ${diffs} with a changed verdict`);
