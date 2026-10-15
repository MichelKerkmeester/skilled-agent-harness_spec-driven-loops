'use strict';
// Iteration 5 record generator: feed mechanism design for doctor routing vocabulary.
const fs = require('fs');
const L = process.argv[2];
const SID = 'fanout-deepseek-flash-max-1792072037811-has9cy';

const record = {
  type: 'iteration',
  iteration: 5,
  run: 5,
  runId: SID, sessionId: SID, lineageId: SID,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  newInfoRatio: 0.75,
  status: 'complete',
  focus: 'Feed mechanism design: phrase specificity, author-signal scoring, render label, and four admission mechanisms compared',
  findingsCount: 10,
  noveltyJustification: 'Scoring and render semantics were new evidence and the mechanism verdicts are new design decisions; several code paths were already known from iterations 1 and 4.',
  keyQuestions: [
    'Should _routes.yaml trigger phrases feed the advisor, and through which mechanism would that work?'
  ],
  answeredQuestions: [
    'Should _routes.yaml trigger phrases feed the advisor, and through which mechanism would that work?'
  ],
  ruledOut: [
    'Mechanism A: harvester extension to parse _routes.yaml',
    'Mechanism B as primary: hand-written PHRASE_BOOSTS entries',
    'One bridge per doctor command instead of per route'
  ],
  keyFindings: [
    { id: 'f-iter005-phrase-specificity', title: 'Phrase specificity scores 0.7 + 0.18 per extra token, capped at 1.0' },
    { id: 'f-iter005-author-lane-admission', title: 'Bridge signals enter through the explicit-author lane, not a new path' },
    { id: 'f-iter005-command-demotion', title: 'Command-kind candidates carry a 0.08 demotion without a slash in the prompt' },
    { id: 'f-iter005-render-label', title: 'The rendered brief label comes from the recommendation name, so bridges should render runnable command strings' },
    { id: 'f-iter005-harvester-rejected', title: 'Harvester extension rejected: new root and file type in two implementations' },
    { id: 'f-iter005-boosts-rejected', title: 'Hand PHRASE_BOOSTS rejected as primary: bypasses inventory, parity and drift guard' },
    { id: 'f-iter005-allowlist-supported', title: 'Allow-list admission supports per-route ids for multi-target commands' },
    { id: 'f-iter005-generate-from-manifest', title: 'Recommended long-term: generate admission inputs from _routes.yaml and guard with CI' },
    { id: 'f-iter005-target-granularity', title: 'Input gate requires target-level bridge granularity and fully qualified names' },
    { id: 'f-iter005-arbitration-not-vocabulary', title: 'The design problem is phrase arbitration, not vocabulary authoring' }
  ],
  graphEvents: [
    { type: 'node', id: 'q-feed-mechanism', kind: 'QUESTION', label: 'Mechanism to feed doctor phrases' },
    { type: 'node', id: 'f-allowlist-route-ids', kind: 'FINDING', label: 'Per-route allow-list ids solve the collision' },
    { type: 'node', id: 's-explicit-lane-2', kind: 'SOURCE', label: 'explicit lane author loop', path: '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts' },
    { type: 'node', id: 's-render', kind: 'SOURCE', label: 'brief renderer', path: '.skilled/skills/system-skill-advisor/runtime/lib/render.ts' },
    { type: 'edge', id: 'e-005-mechanism', source: 'f-allowlist-route-ids', target: 'q-feed-mechanism', relation: 'ANSWERS' },
    { type: 'edge', id: 'e-005-lane', source: 's-explicit-lane-2', target: 'f-allowlist-route-ids', relation: 'SUPPORTS' },
    { type: 'edge', id: 'e-005-render', source: 's-render', target: 'f-allowlist-route-ids', relation: 'SUPPORTS' }
  ],
  toolsUsed: ['Read', 'Bash', 'Grep'],
  sourcesQueried: [
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts',
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts',
    '.skilled/skills/system-skill-advisor/runtime/lib/render.ts',
    '.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs',
    '.skilled/commands/doctor/_routes.yaml'
  ],
  timestamp: new Date().toISOString()
};

const findings = [
  { id: 'f-iter005-phrase-specificity', label: 'Fed phrases score by phraseSpecificity: one token 0.7, +0.18 per extra token, capped 1.0, so a three-token doctor phrase scores 1.0 on an exact mention.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:71-74'] },
  { id: 'f-iter005-author-lane-admission', label: 'Bridge keywords and intentSignals are consumed in the explicit-author lane with phraseSpecificity and author-evidence, so admission reuses the strongest existing lane rather than adding a scoring path.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:358-376'] },
  { id: 'f-iter005-command-demotion', label: 'Command-kind recommendations are demoted 0.08 when the prompt has no slash; the handicap is uniform across command bridges and does not block strong phrase matches.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:776-777'] },
  { id: 'f-iter005-render-label', label: 'The brief renders "Advisor: <freshness>; use <label> conf/unc pass." with the label from metadata or the recommendation name, so a doctor bridge name should be the runnable command form.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/render.ts:170', '.skilled/skills/system-skill-advisor/runtime/lib/render.ts:439-447'] },
  { id: 'f-iter005-harvester-rejected', label: 'Harvester extension is rejected: both harvesters are hard-scoped to skill roots and references/assets subdirs, requiring a new root, file type, YAML parsing in two languages and new gate semantics.', sources: ['.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:44', '.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts:170'] },
  { id: 'f-iter005-boosts-rejected', label: 'Hand-written PHRASE_BOOSTS entries are rejected as primary because they bypass the command inventory, generated projections, Python parity and the drift guard; retain only for bounded negative disambiguation.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:107-200'] },
  { id: 'f-iter005-allowlist-supported', label: 'Allow-list admission is supported today and its ids are free-form while uniqueness is per id, so /doctor:git targets can take distinct ids such as command-doctor-git-setup without collision; regeneration writes both TS and Python projections.', sources: ['.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:100-130', '.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:240-290'] },
  { id: 'f-iter005-generate-from-manifest', label: 'Recommended long-term shape: generate admission inputs from _routes.yaml so the manifest stays canonical, with route-validate asserting the generated bridge set and the drift guard keeping projections byte-stable.', sources: ['.skilled/commands/doctor/_routes.yaml:36-38', '.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:399-420'] },
  { id: 'f-iter005-target-granularity', label: 'The doctor input gate refuses inferred targets, so bridge granularity must be per route with a fully qualified rendered name such as /doctor:git setup.', sources: ['.skilled/commands/doctor/git.md:13-18'] },
  { id: 'f-iter005-arbitration-not-vocabulary', label: 'Measured contrast shows the design problem is arbitration: check my git hooks routed to sk-git at 0.83 while _routes.yaml already declares the near-identical check my git hooks setup phrase.', sources: ['specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-03.json', '.skilled/commands/doctor/_routes.yaml:285-289'] }
];

const ruledOut = [
  { type: 'ruled_out', direction: 'Mechanism A: harvester extension to parse _routes.yaml', reason: 'Both harvesters are scoped to skill roots and markdown frontmatter; a new root and file type would need new code in two implementations.', iteration: 5 },
  { type: 'ruled_out', direction: 'Mechanism B as primary: hand-written PHRASE_BOOSTS entries', reason: 'Bypasses the command inventory, generated projections, Python parity and the drift guard.', iteration: 5 },
  { type: 'ruled_out', direction: 'One bridge per doctor command instead of per route', reason: 'The input gate requires the rendered guidance to name a target, so granularity must be per route.', iteration: 5 }
];

fs.writeFileSync(L + '/events/iter-005.json', JSON.stringify(record) + '\n');
const delta = [JSON.stringify(record)]
  .concat(findings.map((f) => JSON.stringify({ type: 'finding', ...f, iteration: 5 })))
  .concat(ruledOut.map((r) => JSON.stringify(r)));
fs.writeFileSync(L + '/deltas/iter-005.jsonl', delta.join('\n') + '\n');
console.log('wrote event + delta with', findings.length, 'findings');
