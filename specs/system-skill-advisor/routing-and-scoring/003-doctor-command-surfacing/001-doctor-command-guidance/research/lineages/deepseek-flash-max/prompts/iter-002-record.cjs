'use strict';
// Iteration 2 record generator: measured advisor baseline for plain-word setup/health prompts.
const fs = require('fs');
const L = process.argv[2];
const SID = 'fanout-deepseek-flash-max-1792072037811-has9cy';

const record = {
  type: 'iteration',
  iteration: 2,
  run: 2,
  runId: SID, sessionId: SID, lineageId: SID,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  newInfoRatio: 0.95,
  status: 'complete',
  focus: 'Measured advisor baseline for 12 plain-word setup and health prompts',
  findingsCount: 10,
  noveltyJustification: 'The entire sample is new measured evidence: 12 live advisor envelopes, the empty-recommendation distribution, and the two observed routes.',
  keyQuestions: [
    'What does the advisor return today for the required plain-word setup and health prompts, measured live?'
  ],
  answeredQuestions: [
    'What does the advisor return today for the required plain-word setup and health prompts, measured live?'
  ],
  ruledOut: [
    'Treating empty results as an advisor outage rather than a routing gap',
    'Attributing the check-my-git-hooks match to hooks awareness rather than the git token boost'
  ],
  keyFindings: [
    { id: 'f-iter002-sample-live', title: '12 prompts measured, all exit 0 on a live graph' },
    { id: 'f-iter002-nine-empty', title: '9 of 12 prompts return zero recommendations' },
    { id: 'f-iter002-topic-examples-empty', title: 'Three of the four topic example prompts return empty' },
    { id: 'f-iter002-git-hooks-route', title: 'check my git hooks routes to sk-git via explicit_author' },
    { id: 'f-iter002-get-started-sk-doc', title: 'help me get started routes to sk-doc on a weak lexical score' },
    { id: 'f-iter002-confidence-gate', title: 'Recommendation gate is confidence 0.8, not raw score' },
    { id: 'f-iter002-empties-live', title: 'Empty results are genuine no-route outcomes under a live graph' },
    { id: 'f-iter002-no-command-kind', title: 'No command-kind recommendation appears in the sample' },
    { id: 'f-iter002-shadow-weights', title: 'Shadow learned-weights telemetry runs read-only alongside live results' },
    { id: 'f-iter002-raw-artifacts', title: 'Raw per-prompt envelopes persisted for regression baselining' }
  ],
  graphEvents: [
    { type: 'node', id: 'q-measured-baseline', kind: 'QUESTION', label: 'Measured advisor baseline' },
    { type: 'node', id: 'f-nine-empty', kind: 'FINDING', label: '9 of 12 prompts have no advisor owner' },
    { type: 'node', id: 'f-git-hooks-sk-git', kind: 'FINDING', label: 'check my git hooks routes to sk-git' },
    { type: 'node', id: 's-measure-index', kind: 'SOURCE', label: 'measurement index', path: 'specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-index.json' },
    { type: 'node', id: 's-measure-11', kind: 'SOURCE', label: 'get-started envelope', path: 'specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-11.json' },
    { type: 'edge', id: 'e-002-empty', source: 's-measure-index', target: 'f-nine-empty', relation: 'SUPPORTS' },
    { type: 'edge', id: 'e-002-git', source: 's-measure-index', target: 'f-git-hooks-sk-git', relation: 'SUPPORTS' },
    { type: 'edge', id: 'e-002-baseline', source: 'f-nine-empty', target: 'q-measured-baseline', relation: 'ANSWERS' }
  ],
  toolsUsed: ['Bash', 'Read', 'Write'],
  sourcesQueried: [
    'specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-01.json',
    'specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-03.json',
    'specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-11.json',
    'specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-index.json'
  ],
  timestamp: new Date().toISOString()
};

const B = 'specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events';
const findings = [
  { id: 'f-iter002-sample-live', label: 'All 12 measured advisor calls exit 0 on a live graph (trustState generation 1033, confidence 0.8, uncertainty 0.35).', sources: [B + '/measure-iter2-index.json'] },
  { id: 'f-iter002-nine-empty', label: 'Nine of twelve plain-word setup/health prompts return zero recommendations, so the hook renders no-skill-matched for them.', sources: [B + '/measure-iter2-01.json', B + '/measure-iter2-04.json', B + '/measure-iter2-10.json'] },
  { id: 'f-iter002-topic-examples-empty', label: 'Three of the four topic-named example prompts (help me set up skilled, is my repo set up right, why is this rule not enforced) return empty; only check my git hooks routes.', sources: [B + '/measure-iter2-01.json', B + '/measure-iter2-02.json', B + '/measure-iter2-03.json'] },
  { id: 'f-iter002-git-hooks-route', label: 'check my git hooks routes to sk-git at confidence 0.8316, score 0.579682, dominant explicit_author, driven by the git token boost rather than hooks vocabulary.', sources: [B + '/measure-iter2-03.json', '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:37'] },
  { id: 'f-iter002-get-started-sk-doc', label: 'help me get started with this repo routes to sk-doc at confidence 0.82 with score 0.229089 via the lexical lane and a compiledRoute defer action.', sources: [B + '/measure-iter2-11.json'] },
  { id: 'f-iter002-confidence-gate', label: 'Recommendations surface on confidence (0.8) rather than raw score, so calibration behaviour matters as much as phrase coverage.', sources: [B + '/measure-iter2-11.json'] },
  { id: 'f-iter002-empties-live', label: 'Empty results carry freshness live and a current generation, proving routing gaps rather than staleness or daemon failure.', sources: [B + '/measure-iter2-10.json'] },
  { id: 'f-iter002-no-command-kind', label: 'No recommendation in the sample carries kind command; both non-empty results are skills (sk-git, sk-doc), so doctor commands are not candidates today.', sources: [B + '/measure-iter2-03.json', B + '/measure-iter2-11.json'] },
  { id: 'f-iter002-shadow-weights', label: 'Every payload carries a _shadow advisor-shadow-learned-weights-v1 block with liveWeightsFrozen true and parallel shadow scores, telemetry-only.', sources: [B + '/measure-iter2-03.json'] },
  { id: 'f-iter002-raw-artifacts', label: 'Twelve raw envelopes plus an index (exit code, duration, bytes, prompt) are persisted in the lineage for regression baselining.', sources: [B + '/measure-iter2-index.json'] }
];

const ruledOut = [
  { type: 'ruled_out', direction: 'Treating empty recommendations as an advisor outage', reason: 'All envelopes report freshness live with a current generation and exit 0.', iteration: 2 },
  { type: 'ruled_out', direction: 'Reading the check-my-git-hooks match as hooks awareness', reason: 'Dominant lane is explicit_author with the git token boost as the only contributing vocabulary.', iteration: 2 }
];

fs.writeFileSync(L + '/events/iter-002.json', JSON.stringify(record) + '\n');
const delta = [JSON.stringify(record)]
  .concat(findings.map((f) => JSON.stringify({ type: 'finding', ...f, iteration: 2 })))
  .concat(ruledOut.map((r) => JSON.stringify(r)));
fs.writeFileSync(L + '/deltas/iter-002.jsonl', delta.join('\n') + '\n');
console.log('wrote event + delta with', findings.length, 'findings');
