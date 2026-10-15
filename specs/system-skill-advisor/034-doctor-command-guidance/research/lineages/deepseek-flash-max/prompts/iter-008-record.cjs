'use strict';
// Iteration 8 record generator: routing accuracy testing design.
const fs = require('fs');
const L = process.argv[2];
const SID = 'fanout-deepseek-flash-max-1792072037811-has9cy';

const record = {
  type: 'iteration',
  iteration: 8,
  run: 8,
  runId: SID, sessionId: SID, lineageId: SID,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  newInfoRatio: 0.85,
  status: 'complete',
  focus: 'Routing-accuracy testing design on top of the existing corpus, baseline gate, reach probe and drift guard',
  findingsCount: 10,
  noveltyJustification: 'The routing-accuracy corpus, baseline gate policy, and reach-probe semantics are new evidence; the slice design composes them and adds measured seed sets.',
  keyQuestions: [
    'How should routing accuracy be tested, and which existing test seams should the harness reuse?'
  ],
  answeredQuestions: [
    'How should routing accuracy be tested, and which existing test seams should the harness reuse?'
  ],
  ruledOut: [
    'Building a new accuracy harness from scratch',
    'Reusing ci-router-vocabulary-reach.cjs unchanged for doctor commands'
  ],
  keyFindings: [
    { id: 'f-iter008-corpus-exists', title: 'Corpus infrastructure exists: 195 labeled, 66 holdout, 24 ambiguity cases with capture scripts' },
    { id: 'f-iter008-baseline-metrics', title: 'Baseline JSON pins top-1 0.7949, UNKNOWN 13, false-fire 5, holdout 0.7424' },
    { id: 'f-iter008-bounded-delta', title: 'Bounded-delta gate is existing policy; doc numbers trail the JSON baseline' },
    { id: 'f-iter008-advisor-validate', title: 'advisor_validate runs corpus, holdout, parity, safety and latency slices' },
    { id: 'f-iter008-reach-probe', title: 'Reach probe semantics: multi-word phrases, pinned allowlist, winner-sensitive' },
    { id: 'f-iter008-reach-scope-gap', title: 'Reach harness filters to mode-registry hubs, so doctor needs its own probe source' },
    { id: 'f-iter008-record-schema', title: 'Corpus record schema supports a doctor slice without changes' },
    { id: 'f-iter008-golden-set-design', title: 'Doctor golden set: onboarding, diagnostics, control and ambiguity slices seeded from measurements' },
    { id: 'f-iter008-slice-gates', title: 'Slice gates: 9/9 onboarding, 12/14 diagnostics, 10/10 controls, no new ambiguity, doctor empty-rate 0' },
    { id: 'f-iter008-ci-wiring', title: 'CI wiring: structural gates stay, outcome gate is the captured doctor slice, reach check gains a doctor mode' }
  ],
  graphEvents: [
    { type: 'node', id: 'q-accuracy', kind: 'QUESTION', label: 'Routing accuracy testing' },
    { type: 'node', id: 'f-doctor-slice', kind: 'FINDING', label: 'Doctor slice on the existing corpus' },
    { type: 'node', id: 's-baseline-json', kind: 'SOURCE', label: 'scorer eval baseline', path: '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json' },
    { type: 'node', id: 's-reach-probe', kind: 'SOURCE', label: 'router vocabulary reach probe', path: '.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs' },
    { type: 'edge', id: 'e-008-slice', source: 'f-doctor-slice', target: 'q-accuracy', relation: 'ANSWERS' },
    { type: 'edge', id: 'e-008-baseline', source: 's-baseline-json', target: 'f-doctor-slice', relation: 'SUPPORTS' },
    { type: 'edge', id: 'e-008-reach', source: 's-reach-probe', target: 'f-doctor-slice', relation: 'SUPPORTS' }
  ],
  toolsUsed: ['Read', 'Bash'],
  sourcesQueried: [
    '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json',
    '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl',
    '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl',
    '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/ambiguity-prompts.jsonl',
    '.skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md',
    '.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs'
  ],
  timestamp: new Date().toISOString()
};

const findings = [
  { id: 'f-iter008-corpus-exists', label: 'A full routing-accuracy corpus exists: labeled-prompts.jsonl (195), holdout-prompts.jsonl (66), ambiguity-prompts.jsonl (24) plus capture/scoring/build scripts, measured against a pinned environment (semantic disabled, empty DB dir, filesystem projection).', sources: ['.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1-16', '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1-3'] },
  { id: 'f-iter008-baseline-metrics', label: 'Baseline (captured 2026-10-11): full-corpus top-1 0.7949 (155/195), UNKNOWN 13, gold-none false-fire 5, holdout 0.7424, ambiguity 0.7917 at tau 0.03, with review/memory_save/delegation buckets.', sources: ['.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:17-58'] },
  { id: 'f-iter008-bounded-delta', label: 'The bounded-delta gate is existing policy (baseline minus 0.02 full corpus, minus 0.01 holdout, plus 2 UNKNOWN) and the docs call baselines the promotion gate for routing changes; the doc numbers trail the current JSON baseline, so a doctor slice capture should re-freeze both.', sources: ['.skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:33', '.skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:43-59'] },
  { id: 'f-iter008-advisor-validate', label: 'advisor_validate --confirm-heavy-run true runs corpus, holdout, parity, safety and latency slices, including a per-skill slice form; it is the release-scale check for doctor routing changes.', sources: ['.skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:63-75'] },
  { id: 'f-iter008-reach-probe', label: 'ci-router-vocabulary-reach.cjs probes multi-word declared phrases and fails phrases that do not reach their declaring hub; its allowlist pins declaredBy + phrase + wonBy so a phrase losing to a new winner still fails.', sources: ['.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:1-70'] },
  { id: 'f-iter008-reach-scope-gap', label: 'The reach harness filters to directories with mode-registry.json and ROUTER.md, so doctor commands are outside its probe surface; a doctor probe must read _routes.yaml and assert each admitted phrase reaches its declared command id.', sources: ['.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:71-90'] },
  { id: 'f-iter008-record-schema', label: 'Corpus records already support a doctor slice: id, bucket, source_type, prompt, expected skill_top_1, notes, plus margin_at_capture and tau for ambiguity cases.', sources: ['.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1-3', '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/ambiguity-prompts.jsonl:1-2'] },
  { id: 'f-iter008-golden-set-design', label: 'Proposed doctor golden set from this lineage: onboarding slice (nine measured onboarding prompts), diagnostics slice (fourteen candidate phrases), control slice (ten skill-shaped controls), ambiguity slice with expected winners and margins.', sources: ['specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-index.json', 'specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-index.json'] },
  { id: 'f-iter008-slice-gates', label: 'Slice gates: onboarding top-1 9/9, diagnostics >= 12/14 with margin >= 0.05, controls 10/10 unchanged, zero new ambiguous pairs, doctor empty-rate 0, plus bounded-delta rows against the current JSON baseline.', sources: ['.skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:59', 'specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-control-07.json'] },
  { id: 'f-iter008-ci-wiring', label: 'CI wiring: route-validate.sh and the command-bridges drift guard stay as structural gates, the captured doctor slice becomes the outcome gate, and the reach check gains a doctor probe mode.', sources: ['.skilled/commands/doctor/scripts/route-validate.sh:1-30', '.skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts:1-40'] }
];

const ruledOut = [
  { type: 'ruled_out', direction: 'Building a new accuracy harness from scratch', reason: 'The corpus, capture script, baseline gate and reach probe already exist and fit the doctor slice.', iteration: 8 },
  { type: 'ruled_out', direction: 'Reusing ci-router-vocabulary-reach.cjs unchanged for doctor commands', reason: 'Its hub filter requires mode-registry.json and ROUTER.md, which doctor commands do not have.', iteration: 8 }
];

fs.writeFileSync(L + '/events/iter-008.json', JSON.stringify(record) + '\n');
const delta = [JSON.stringify(record)]
  .concat(findings.map((f) => JSON.stringify({ type: 'finding', ...f, iteration: 8 })))
  .concat(ruledOut.map((r) => JSON.stringify(r)));
fs.writeFileSync(L + '/deltas/iter-008.jsonl', delta.join('\n') + '\n');
console.log('wrote event + delta with', findings.length, 'findings');
