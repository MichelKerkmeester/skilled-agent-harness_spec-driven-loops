// Composed degraded-CLI timing: one fresh process per prompt, paying the CLI's
// own module cost first, then either the in-process handler (proposed) or the
// Python spawn (today). Mirrors the two degraded shapes inside the hook budget.
import { performance } from 'node:perf_hooks';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, '.skilled/skills/system-skill-advisor/runtime/dist/runtime');
const CORPUS = path.join(ROOT, '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl');
const SAMPLE_IDS = [
  'cmd-create-readme-plain-tune-01',
  'cmd-doctor-setup-plain-tune-01',
  'cmd-create-agent-plain-tune-01',
  'cmd-speckit-save-plain-tune-01',
  'cmd-doctor-mcp-plain-tune-01',
  'cmd-speckit-implement-plain-tune-01',
  'cmd-create-repo-rule-plain-tune-01',
  'cmd-doctor-sk-skill-plain-tune-01',
  'cmd-create-readme-typed-01',
  'cmd-doctor-setup-typed-01',
];
const OPTIONS = {
  topK: 3,
  includeAttribution: false,
  includeAbstainReasons: true,
  includeCompiledRoute: true,
  compiledRouteTopOnly: true,
  confidenceThreshold: 0.8,
  uncertaintyThreshold: 0.35,
};

const mode = process.argv[2] ?? 'proposed';
const index = Number(process.argv[3] ?? 0);
const rows = readFileSync(CORPUS, 'utf8')
  .split('\n')
  .filter((line) => line.trim() !== '')
  .map((line) => JSON.parse(line))
  .filter((row) => SAMPLE_IDS.includes(row.id));
for (const row of rows) {
  if (row.split === 'holdout') throw new Error(`refusing holdout row ${row.id}`);
}
const measured = SAMPLE_IDS.map((id) => rows.find((row) => row.id === id));
let prompt = measured[index].prompt;
if (mode.endsWith('-long')) {
  const filler = 'context for the request ';
  let text = `${prompt} `;
  while (text.length < 10_000 - filler.length) text += filler;
  prompt = text.slice(0, 10_000);
}

const cliStart = performance.now();
await import(path.join(DIST, 'skill-advisor-cli.js'));
const cliImportMs = performance.now() - cliStart;

let answer;
if (mode.startsWith('proposed')) {
  const handlerStart = performance.now();
  const { handleAdvisorRecommend } = await import(path.join(DIST, 'handlers/advisor-recommend.js'));
  const handlerImportMs = performance.now() - handlerStart;
  const callStart = performance.now();
  const response = await handleAdvisorRecommend({ workspaceRoot: ROOT, prompt, options: OPTIONS });
  const handlerMs = performance.now() - callStart;
  const recs = JSON.parse(response.content[0].text)?.data?.recommendations ?? [];
  answer = {
    cliImportMs,
    handlerImportMs,
    handlerMs,
    top: recs[0]?.skillId ?? null,
    command: recs[0]?.command ?? null,
  };
} else {
  const { runAdvisorSubprocess } = await import(path.join(DIST, 'lib/subprocess.js'));
  const spawnStart = performance.now();
  const result = await runAdvisorSubprocess(prompt, {
    workspaceRoot: ROOT,
    timeoutMs: 5000,
    thresholdConfig: { confidenceThreshold: 0.8, uncertaintyThreshold: 0.35 },
  });
  const spawnMs = performance.now() - spawnStart;
  answer = { cliImportMs, spawnMs, ok: result.ok, top: result.recommendations[0]?.skill ?? null };
}
process.stdout.write(`${JSON.stringify({
  mode,
  index,
  id: measured[index].id,
  split: measured[index].split,
  chars: prompt.length,
  ...answer,
  totalMs: performance.now(),
})}\n`);
