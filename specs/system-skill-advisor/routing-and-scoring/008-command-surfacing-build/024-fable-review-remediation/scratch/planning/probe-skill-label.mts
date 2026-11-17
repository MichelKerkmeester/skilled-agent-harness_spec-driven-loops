// Run from the repository root:
//   node --import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs <this file>
// Planning probe for the two skill label items carried to the packet review. Part one
// renders one result through the real renderer three ways: with the label the OpenCode
// plugin always sends, with no label and with the label of a row that does not lead.
// Part two asks the real CLI for five invented prompts and counts the rows that would
// fail the renderer's bars, which is the only state in which a label taken from row 0
// names a row the head does not lead with. It removes AI_SESSION_CHILD from its own
// environment, reads no corpus file, starts no model session and writes nothing.
import { execFileSync } from 'node:child_process';

delete process.env.AI_SESSION_CHILD;
const { renderAdvisorBrief } = await import('../../../../../../../.skilled/skills/system-skill-advisor/runtime/lib/render.ts');

const head = (text: string | null): string => (text === null ? '(no brief)' : text.split('\n')[0]);
const base = { status: 'ok', freshness: 'live', ambiguous: false, metrics: { tokenCap: 80 } } as const;
const hub = { skill: 'sk-doc', confidence: 0.91, uncertainty: 0.12, passes_threshold: true, needsMode: true };
const other = { skill: 'sk-code', confidence: 0.82, uncertainty: 0.2, passes_threshold: true };
const failing = { skill: 'sk-git', confidence: 0.4, uncertainty: 0.6, passes_threshold: false };
const options = { thresholdConfig: { confidenceThreshold: 0.8, uncertaintyThreshold: 0.35 } };

const render = (recommendations: unknown[], skillLabel: string | null | undefined): string => head(
  renderAdvisorBrief({
    ...base,
    recommendations,
    ...(skillLabel === undefined ? {} : { sharedPayload: { metadata: { skillLabel } } }),
  } as never, options as never),
);

console.log(`needs-mode hub, label sent as the hub: ${render([hub, other], 'sk-doc')}`);
console.log(`needs-mode hub, no label sent: ${render([hub, other], undefined)}`);
console.log(`same head with and without the label: ${render([hub, other], 'sk-doc') === render([hub, other], undefined)}`);
console.log(`failing row 0, label taken from row 0: ${render([failing, other], 'sk-git')}`);
console.log(`failing row 0, label taken from the first passing row: ${render([failing, other], 'sk-code')}`);

const PROMPTS = [
  'use the sk-doc skill',
  'write a readme for the hooks folder',
  'review the scorer for dead code',
  'what changed in the last release',
  'plan a new feature: rate limiting for the api',
];
let rows = 0;
let belowBars = 0;
let firstRowBelowBars = 0;
for (const prompt of PROMPTS) {
  const stdout = execFileSync('node', [
    '.skilled/bin/skill-advisor.cjs', 'advisor_recommend', '--json',
    JSON.stringify({ prompt, options: { compiledRouteTopOnly: true } }), '--format', 'json',
  ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const list = JSON.parse(stdout).data?.recommendations ?? [];
  list.forEach((row: { confidence: number; uncertainty: number }, index: number) => {
    rows += 1;
    const below = row.confidence < 0.8 || row.uncertainty > 0.35;
    if (below) belowBars += 1;
    if (below && index === 0) firstRowBelowBars += 1;
  });
}
console.log(`CLI rows over ${PROMPTS.length} prompts: ${rows}, below the bars: ${belowBars}, row 0 below the bars: ${firstRowBelowBars}`);
