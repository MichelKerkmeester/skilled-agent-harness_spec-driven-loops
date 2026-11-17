const fs = require('fs');

const L = process.argv[2];
const NOW = process.argv[3];
const SID = process.argv[4];

const base = {
  type: 'iteration',
  iteration: 5,
  runId: SID,
  sessionId: SID,
  lineageId: SID,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  run: 5,
  status: 'complete',
  focus: 'Floor risk of the two leading candidates, measured on the 35 silent rows',
  findingsCount: 7,
  newInfoRatio: 0.55,
  noveltyJustification:
    '4 of 7 findings are new row-level measurements of the floor; 2 are inferences from them and 1 restates the baseline',
  keyQuestions: [],
  answeredQuestions: [],
  ruledOut: [
    'Treating 0 of 35 as the whole risk test for candidate 2',
    'Adding a bare rewrite keyword to the human-voice class',
    'Measuring candidate 1 with a whole-file alias rewrite',
  ],
  focusTrack: 'offer-reach',
  edgeCase: 'none',
  toolsUsed: ['Read', 'Bash', 'Grep'],
  sourcesQueried: [
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/none-floor-live.jsonl',
    '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl',
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/implementation-summary.md:140',
  ],
  timestamp: NOW,
  durationMs: 600000,
  graphEvents: [],
};

const NONE =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/none-floor-live.jsonl';
const PROMPTS =
  '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl';
const S12 =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/implementation-summary.md';

const findings = [
  [
    'f-iter005-001',
    'The floor baseline at HEAD is clean: 0 of 35 silent rows carry a command, 15 return no recommendation and 20 return a skill-only head.',
    [NONE],
  ],
  [
    'f-iter005-002',
    'The doctor-family risk set for candidate 2 is exactly three rows: mns-chat-03 at 0.090611, nm-system-skilled-doctor-01 at 0.240312 and sv-03 at 0.125331.',
    [NONE],
  ],
  [
    'f-iter005-003',
    'Candidate 2 has a narrow band: an anchor must pass the 0.8 confidence gate on five rows while staying under three doctor-top rows scoring 0.09 to 0.24, which is why it ranks below a two-row alias.',
    [NONE],
  ],
  [
    'f-iter005-004',
    'Candidate 1 readme keyword is isolated: overview page appears only on cmd-create-readme-plain-tune-01.',
    [PROMPTS],
  ],
  [
    'f-iter005-005',
    'Candidate 1 must not add a bare rewrite keyword: cmd-create-diff-plain-tune-01 already carries /create:diff and is a before-and-after rewrite request, while the phrases reads like a person and score how human appear only on the human-voice row.',
    [PROMPTS],
  ],
  [
    'f-iter005-006',
    'Candidate 1 exposure is measured: 0 of 35 floor rows, 0 of the other 52 none rows, and at most 1 other tune row if the wrong keyword is chosen.',
    [NONE, PROMPTS],
  ],
  [
    'f-iter005-007',
    'The three doctor-top floor rows pass the render gate on confidence 0.82 and uncertainty 0.22 to 0.34 while scoring 0.09 to 0.24, so the floor is held by the ranking band and verification must name those row ids, not only 0 of 35.',
    [NONE, `${S12}:140`],
  ],
];

const lines = [JSON.stringify(base)];
for (const [id, label, sources] of findings) {
  lines.push(JSON.stringify({ type: 'finding', id, label, iteration: 5, sources }));
}
lines.push(
  JSON.stringify({
    type: 'ruled_out',
    direction: 'Adding a bare rewrite keyword to the human-voice alias class',
    reason: 'It would steal cmd-create-diff-plain-tune-01, which already carries /create:diff',
    iteration: 5,
  }),
);

fs.writeFileSync(`${L}/deltas/iter-005.jsonl`, `${lines.join('\n')}\n`);
fs.writeFileSync(`${L}/prompts/_iter-005-event.json`, JSON.stringify(base));
console.log(`delta lines ${lines.length}`);
