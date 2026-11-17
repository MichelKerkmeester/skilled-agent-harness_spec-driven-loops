const fs = require('fs');

const L = process.argv[2];
const NOW = process.argv[3];
const SID = process.argv[4];

const base = {
  type: 'iteration',
  iteration: 4,
  runId: SID,
  sessionId: SID,
  lineageId: SID,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  run: 4,
  status: 'insight',
  focus: 'Validated candidate set ranked by gain per unit of floor risk, cross-checked against segments one and two',
  findingsCount: 7,
  newInfoRatio: 0.45,
  noveltyJustification:
    'The alias cause, the canary count and the segment cross-check are new; the ranked table mostly recombines earlier measurements',
  keyQuestions: [],
  answeredQuestions: [],
  ruledOut: [
    'Re-recommending the capture offered relabel, which phase 013 built',
    'Reopening rank 15 on this evidence',
    'Treating the six-row anchor candidate as one change',
    'Rendering a second head for the duplicate-suppression row',
  ],
  focusTrack: 'offer-reach',
  edgeCase: 'none',
  toolsUsed: ['Read', 'Bash', 'Grep'],
  sourcesQueried: [
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-2.md',
    '.skilled/skills/sk-doc/hub-router.json:160',
    '.skilled/skills/sk-doc/hub-router.json:240',
    '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl',
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/scratch/routes-sk-doc-after.tsv',
    '.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:392',
    '.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:451',
    '.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1453',
  ],
  timestamp: NOW,
  durationMs: 700000,
  graphEvents: [],
};

const HUB = '.skilled/skills/sk-doc/hub-router.json';
const PROMPTS =
  '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl';
const ROUTES =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/scratch/routes-sk-doc-after.tsv';
const CA = '.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts';
const AR = '.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts';
const CLI = '.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts';
const SEG2 =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-2.md';

const findings = [
  [
    'f-iter004-001',
    'The readme tune row routes to sk-create-quality-control because its wording names a quality bar, while create-readme-aliases has readme, write readme, folder readme and front-page overview but not overview page.',
    [`${HUB}:240`, PROMPTS],
  ],
  [
    'f-iter004-002',
    'The human-voice tune row routes to sk-create-quality-control from its rewrite-and-score wording, and the existing create-with-human-voice-aliases class reaches none of it.',
    [`${HUB}:160`, `${HUB}:163`],
  ],
  [
    'f-iter004-003',
    'The proposed alias wording is floor-safe: the only none rows matching overview, readme, rewrite, human, person wrote or quality bar are the two typed rows for these same commands, which must start.',
    [PROMPTS],
  ],
  [
    'f-iter004-004',
    'Ranked candidates: 1 sk-doc readme and human-voice aliases (+2 rows, zero none-row exposure); 2 plain anchors for five below-threshold commands plus a scorer row for create:skill-parent (up to +6, medium floor risk); 3 a fallback label for a hub outside MODE_COMMANDS (+2 labels); 4 in-process TypeScript scoring on the unreachable-daemon path (27 commands on degraded runs); 5 duplicate-suppression fix (+1, byte risk); 6 doctor wrong-top defaults (+2, medium-high).',
    [`${HUB}:240`, `${CA}:392`, `${AR}:451`, `${CLI}:1453`],
  ],
  [
    'f-iter004-005',
    'Not recommended: rank 15 re-embedding (0 brief-level commands), the capture offered relabel (built in phase 013), a lower threshold or higher lane weight (eliminated in segment two), and a default command for a deferring hub (fires the deep-loop near-miss row).',
    [SEG2],
  ],
  [
    'f-iter004-006',
    'Residual label gap: routeNeedsMode is limited to hubs with a MODE_COMMANDS row and sk-code has none, so speckit-implement and doctor-sk-code stay silent; this is a gap in the delivered phase 012 label, not a repeat of rank 6.',
    [`${CA}:392`],
  ],
  [
    'f-iter004-007',
    'Candidate 2 is the only candidate that can move more than two rows and also the only one whose gain depends on new scoring evidence: five of its six commands already have a scorer row, so the work is anchor wording plus re-measuring the 35 silent rows.',
    [`${CA}:189`, PROMPTS],
  ],
];

const lines = [JSON.stringify(base)];
for (const [id, label, sources] of findings) {
  lines.push(JSON.stringify({ type: 'finding', id, label, iteration: 4, sources }));
}
lines.push(
  JSON.stringify({
    type: 'ruled_out',
    direction: 'A second rendered head for the duplicate-suppression row',
    reason: 'It costs bytes on every prompt, the one budget the brief cannot grow',
    iteration: 4,
  }),
);

fs.writeFileSync(`${L}/deltas/iter-004.jsonl`, `${lines.join('\n')}\n`);
fs.writeFileSync(`${L}/prompts/_iter-004-event.json`, JSON.stringify(base));
console.log(`delta lines ${lines.length}`);
