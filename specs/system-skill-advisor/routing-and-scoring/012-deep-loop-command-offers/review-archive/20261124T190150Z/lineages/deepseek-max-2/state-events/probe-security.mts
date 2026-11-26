import { pathToFileURL } from 'node:url';

const base = '/Users/michelkerkmeester/worktrees/public/535-deep-loop-offers-traceability-review/.skilled/skills/system-skill-advisor/runtime';
const attach = await import(pathToFileURL(`${base}/lib/command-attach.ts`).href);
const cli = await import(pathToFileURL(`${base}/skill-advisor-cli.ts`).href);
const { attachCommand } = attach;
const { degradedRecommendations } = cli;

const hostileRoutes = [
  ['proto-workflow-mode', { action: 'route', selectionKind: 'single', targets: [{ workflowMode: '__proto__' }] }],
  ['constructor-workflow-mode', { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'constructor' }] }],
  ['array-route', [{ action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'review' }] }]],
  ['targets-object', { action: 'route', selectionKind: 'single', targets: { 0: { workflowMode: 'review' }, length: 1 } }],
  ['workflow-mode-number', { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 42 }] }],
  ['null-target', { action: 'route', selectionKind: 'single', targets: [null] }],
  ['proto-key-skill', { action: 'defer', selectionKind: 'none', targets: [] }],
];
for (const [id, route] of hostileRoutes) {
  let out;
  try { out = attachCommand('system-deep-loop', route, 'run a deep review on the parser') ?? '-'; } catch (error) { out = `THROW:${error instanceof Error ? error.message : String(error)}`; }
  console.log(`ROUTE ${id} -> ${out}`);
}
const protoSkill = ['__proto__', 'constructor', 'toString'];
for (const skill of protoSkill) {
  let out;
  try { out = attachCommand(skill, { action: 'defer', selectionKind: 'none', targets: [] }, 'run a deep review on the parser') ?? '-'; } catch (error) { out = `THROW:${error instanceof Error ? error.message : String(error)}`; }
  console.log(`SKILL ${skill} -> ${out}`);
}

const row = (extra) => ({ skill: 'system-deep-loop', confidence: 0.9, uncertainty: 0.1, passes_threshold: true, ...extra });
const hostileEntries = [
  ['unknown-command', [row({ typed: true, command: 'rm -rf /' })]],
  ['other-owner-command', [row({ typed: true, command: '/speckit:save' })]],
  ['injection-command', [row({ typed: true, command: '/deep:review; rm -rf /tmp/x' })]],
  ['tracked-own-command', [row({ typed: true, command: '/deep:review' })]],
  ['unknown-skill-typed-row', [row({ skill: 'not-a-skill', typed: true, command: '/deep:review' })]],
];
for (const [id, entries] of hostileEntries) {
  let out;
  try { out = JSON.stringify(degradedRecommendations(entries, 'run /deep:review on the parser')); } catch (error) { out = `THROW:${error instanceof Error ? error.message : String(error)}`; }
  console.log(`DEGRADED ${id} -> ${out}`);
}

const longPrompt = (reps, unit) => unit.repeat(reps);
const cases = [
  ['repeated-refusal-96k', longPrompt(96000 / 24, 'do not run /deep:review.')],
  ['repeated-refusal-10k', longPrompt(10000 / 24, 'do not run /deep:review.')],
  ['many-loop-words-40k', longPrompt(40000 / 20, 'run a deep review. ')],
  ['long-prefix-40k', longPrompt(40000, 'a') + ' run a deep review of the parser'],
];
for (const [id, prompt] of cases) {
  const t0 = performance.now();
  const cmd = attachCommand('system-deep-loop', { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'review' }] }, prompt) ?? '-';
  const ms = performance.now() - t0;
  console.log(`TIMING ${id} len=${prompt.length} cmd=${cmd} ms=${ms.toFixed(1)}`);
}
console.log('ADVISOR_PROMPT_MAX_CHARS', (await import(pathToFileURL(`${base}/schemas/advisor-tool-schemas.ts`).href)).ADVISOR_PROMPT_MAX_CHARS);
