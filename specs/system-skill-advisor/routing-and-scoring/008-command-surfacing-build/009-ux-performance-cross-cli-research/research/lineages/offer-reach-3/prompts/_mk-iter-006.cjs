const fs = require('fs');

const L = process.argv[2];
const NOW = process.argv[3];
const SID = process.argv[4];

const base = {
  type: 'iteration',
  iteration: 6,
  runId: SID,
  sessionId: SID,
  lineageId: SID,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  run: 6,
  status: 'insight',
  focus: 'One measurement model for the plain-offer numbers, the final ranked list and the remaining gaps',
  findingsCount: 7,
  newInfoRatio: 0.2,
  noveltyJustification:
    'The number reconciliation and the cause-to-candidate mapping are new; the rest restates earlier measured findings',
  keyQuestions: [],
  answeredQuestions: [],
  ruledOut: [
    'Reporting a single plain recall number without its definition',
    'Treating the four needs-mode rows as fixable recall',
    'Counting the six subcommand rows as misses',
  ],
  focusTrack: 'offer-reach',
  edgeCase: 'none',
  toolsUsed: ['Read', 'Bash'],
  sourcesQueried: [
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/tune-live.jsonl',
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/real-embed-capture.json',
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/degraded-readme.json',
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/iterations/iteration-001.md',
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/iterations/iteration-004.md',
    '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:36',
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards/scratch/hook-health.json',
  ],
  timestamp: NOW,
  durationMs: 400000,
  graphEvents: [],
};

const REAL =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/real-embed-capture.json';
const LIVE =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/tune-live.jsonl';
const DEG =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/degraded-readme.json';
const IT1 =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/iterations/iteration-001.md';
const IT4 =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/iterations/iteration-004.md';
const CAP =
  '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs';
const HH =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards/scratch/hook-health.json';

const findings = [
  [
    'f-iter006-001',
    'The four plain-offer numbers are one state under four definitions: 23 fixture metric, 28 real metric, 27 head plus 1 Also rendered, and 30 projected after candidate 1.',
    [REAL, LIVE],
  ],
  [
    'f-iter006-002',
    'Of the 28 rendered commands, 22 are the exact corpus label and 6 are a documented subcommand, so exact-string metrics understate plain reach by 6 rows at HEAD.',
    [LIVE],
  ],
  [
    'f-iter006-003',
    'All 17 no-command rows map to a candidate: 1 duplicate suppression, 2 sk-doc aliases, 2 silent-hub labels, 6 below-threshold anchors and 2 wrong-top doctor rows; the remaining 4 print needs a mode by design.',
    [IT1, IT4],
  ],
  [
    'f-iter006-004',
    'Final ranking by gain per unit of risk: sk-doc aliases (+2, zero floor exposure); below-threshold anchors (up to +6, the only real floor risk); silent-hub label (+2 labels); degraded-path parity (28 commands when the daemon is down); duplicate suppression (+1); doctor wrong-top (+2, medium-high).',
    [IT4],
  ],
  [
    'f-iter006-005',
    'Verification per candidate is executable with committed scripts: compiled-route for the alias modes, the real-embedding capture for tune and false-offer lines, the advisor suite for label and duplicate changes, a new unreachable-endpoint vitest for the degraded path, and the three named floor row ids for the anchors.',
    [`${CAP}:36`, IT4],
  ],
  [
    'f-iter006-006',
    'Three gaps remain: no persistent counter for the local-scorer fallback, OpenCode degraded behaviour unmeasured, and the six subcommand labels awaiting an operator decision.',
    [HH],
  ],
  [
    'f-iter006-007',
    'Lane answers complete: (a) 17 rows and six causes by row id; (b) re-embedding declined again at 0 brief-level commands and about 83 ms for 14 skill vectors; (g) the fallback runs the Python scorer then collapses untyped rows, measured at 644 ms and 0 observed occurrences.',
    [DEG, REAL],
  ],
];

const lines = [JSON.stringify(base)];
for (const [id, label, sources] of findings) {
  lines.push(JSON.stringify({ type: 'finding', id, label, iteration: 6, sources }));
}
lines.push(
  JSON.stringify({
    type: 'ruled_out',
    direction: 'Reporting a single plain recall number without its definition',
    reason: 'The four numbers differ by metric and scoring regime and one alone misstates the built state',
    iteration: 6,
  }),
);

fs.writeFileSync(`${L}/deltas/iter-006.jsonl`, `${lines.join('\n')}\n`);
fs.writeFileSync(`${L}/prompts/_iter-006-event.json`, JSON.stringify(base));
console.log(`delta lines ${lines.length}`);
