// Compares the CLI answer the Claude hook asks for with the one the OpenCode
// plugin asks for, over every measured typed corpus row. Prints only ids and
// recommendation fields, never prompt text, and writes a JSON summary beside
// itself.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const corpusPath = join(
  root,
  '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl',
);
const cliPath = join(root, '.skilled/bin/skill-advisor.cjs');
const outPath = join(
  root,
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/residual-limits-4/scratch/cli-parity.json',
);

const rows = readFileSync(corpusPath, 'utf8')
  .split('\n')
  .filter((line) => line.trim() !== '')
  .map((line) => JSON.parse(line))
  .filter((row) => row.row_type === 'typed' && row.split === 'none');

function ask(prompt, options) {
  const payload = JSON.stringify({ prompt, options });
  const raw = execFileSync(process.execPath, [
    cliPath,
    'advisor_recommend',
    '--json',
    '-',
    '--format',
    'json',
    '--timeout-ms',
    '8000',
    '--no-warm-only',
  ], { cwd: root, input: payload, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  const parsed = JSON.parse(raw);
  const top = parsed?.data?.recommendations?.[0] ?? null;
  return {
    skill: top?.skillId ?? null,
    command: top?.command ?? null,
    policy: top?.policy ?? null,
    ambiguous: parsed?.data?.ambiguous === true,
    degraded: parsed?.data?.degraded === true,
  };
}

const hookOptions = {
  topK: 3,
  includeAttribution: false,
  includeAbstainReasons: true,
  includeCompiledRoute: true,
  compiledRouteTopOnly: true,
  confidenceThreshold: 0.8,
  uncertaintyThreshold: 0.35,
};
const pluginOptions = {
  topK: 3,
  includeAttribution: false,
  includeAbstainReasons: true,
  confidenceThreshold: 0.8,
  uncertaintyThreshold: 0.35,
};
const pluginHintedOptions = { ...pluginOptions, surfaceHint: 'opencode' };

const results = [];
for (const row of rows) {
  const hook = ask(row.prompt, hookOptions);
  const plugin = ask(row.prompt, pluginOptions);
  const hinted = ask(row.prompt, pluginHintedOptions);
  const signature = (answer) => `${answer.skill}|${answer.command}|${answer.policy}|${answer.ambiguous}`;
  results.push({
    id: row.id,
    hook,
    plugin,
    hinted,
    differsNoHint: signature(hook) !== signature(plugin),
    differsHint: signature(hook) !== signature(hinted),
  });
}

const commandDiff = (other) => results.filter((row) => row.hook.command !== row[other].command);
const policyDiff = (other) => results.filter((row) => row.hook.policy !== row[other].policy);
const skillDiff = (other) => results.filter((row) => row.hook.skill !== row[other].skill);

const summary = {
  rows: results.length,
  differsNoHint: results.filter((row) => row.differsNoHint).length,
  differsHint: results.filter((row) => row.differsHint).length,
  commandDiffNoHint: commandDiff('plugin').map((row) => row.id),
  commandDiffHint: commandDiff('hinted').map((row) => row.id),
  policyDiffNoHint: policyDiff('plugin').map((row) => row.id),
  policyDiffHint: policyDiff('hinted').map((row) => row.id),
  skillDiffNoHint: skillDiff('plugin').map((row) => row.id),
  skillDiffHint: skillDiff('hinted').map((row) => row.id),
  hookCommandRows: results.filter((row) => row.hook.command !== null).length,
  pluginCommandRows: results.filter((row) => row.plugin.command !== null).length,
  hintedCommandRows: results.filter((row) => row.hinted.command !== null).length,
};

writeFileSync(outPath, `${JSON.stringify({ summary, results }, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(summary)}\n`);
