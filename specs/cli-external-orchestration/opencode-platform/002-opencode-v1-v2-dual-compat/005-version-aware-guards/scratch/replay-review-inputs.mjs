const root = process.argv[2];
const { evaluate, readHardRules } = await import(`${root}/.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`);
const { clearOpencodeVersionCache } = await import(`${root}/.skilled/hooks/dispatch/lib/opencode-version.mjs`);
const rules = readHardRules(`${root}/.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`);
const cases = [
  ['F1 quoted v2', `"opencode2" run --model p/m --agent build "/memory:search q" </dev/null`, {}],
  ['F1 bash -c v2', `bash -c 'opencode2 run --model p/m "/memory:search q" </dev/null'`, {}],
  ['F1 sh -c v2', `sh -c "opencode2 run --model p/m '/memory:search q' </dev/null"`, {}],
  ['F2 OPENCODE_BIN=opencode, runs opencode2', `opencode2 run --model p/m --agent build "/memory:search q" </dev/null`, { OPENCODE_BIN: 'opencode' }],
  ['v1 slash still blocks', `opencode run --model p/m --agent build "/memory:search q" </dev/null`, {}],
  ['path-qualified -> unknown', `/usr/local/bin/opencode run --model p/m "/memory:search q" </dev/null`, {}],
];
for (const [label, cmd, env] of cases) {
  clearOpencodeVersionCache();
  const saved = process.env.OPENCODE_BIN;
  if (env.OPENCODE_BIN) process.env.OPENCODE_BIN = env.OPENCODE_BIN; else delete process.env.OPENCODE_BIN;
  const v = evaluate(cmd, rules).map((x) => `${x.id}:${x.severity}`);
  if (saved === undefined) delete process.env.OPENCODE_BIN; else process.env.OPENCODE_BIN = saved;
  console.log(label.padEnd(42), JSON.stringify(v));
}
