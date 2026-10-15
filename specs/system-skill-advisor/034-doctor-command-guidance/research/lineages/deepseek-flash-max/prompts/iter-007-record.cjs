'use strict';
// Iteration 7 record generator: onboarding entry point design.
const fs = require('fs');
const L = process.argv[2];
const SID = 'fanout-deepseek-flash-max-1792072037811-has9cy';

const record = {
  type: 'iteration',
  iteration: 7,
  run: 7,
  runId: SID, sessionId: SID, lineageId: SID,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  newInfoRatio: 0.8,
  status: 'complete',
  focus: 'Onboarding entry-point design: fallback gap, single-route precedent, four options, and the two-layer relationship',
  findingsCount: 11,
  noveltyJustification: 'The fallback guidance gap, single-route and default-action precedents, and catalog maintenance surface are new evidence; the design verdicts follow directly.',
  keyQuestions: [
    'Should there be a dedicated onboarding or set up skilled entry point, and how should it relate to the /doctor:* family?'
  ],
  answeredQuestions: [
    'Should there be a dedicated onboarding or set up skilled entry point, and how should it relate to the /doctor:* family?'
  ],
  ruledOut: [
    'Onboarding as a /doctor:skill-advisor target',
    'Per-route bridges alone as the onboarding answer',
    'A full routing table in the hook fallback'
  ],
  keyFindings: [
    { id: 'f-iter007-fallback-gap', title: 'Fallback renders no doctor guidance, only no-skill-matched plus directives' },
    { id: 'f-iter007-single-route-precedent', title: 'Manifest sanctions single-route commands without positional targets' },
    { id: 'f-iter007-safe-default', title: 'Bare /doctor:update runs check and bare /doctor:env shows a menu' },
    { id: 'f-iter007-no-umbrella', title: 'No onboarding umbrella exists; doctor is nine per-owner diagnostics' },
    { id: 'f-iter007-batteries-exist', title: 'Read-only batteries already exist to compose the umbrella from' },
    { id: 'f-iter007-option-one', title: 'Recommended: single-route /doctor:setup umbrella with read-only battery' },
    { id: 'f-iter007-option-two-rejected', title: 'Rejected: onboarding target under /doctor:skill-advisor' },
    { id: 'f-iter007-option-three-rejected', title: 'Rejected: per-route bridges alone cannot answer generic onboarding' },
    { id: 'f-iter007-option-four-complement', title: 'Complement: one bounded fallback sentence naming the doctor entry' },
    { id: 'f-iter007-two-layer-relationship', title: 'Umbrella owns onboarding phrases; per-route bridges own diagnostics' },
    { id: 'f-iter007-maintenance-cost', title: 'New command moves catalog, route manifest and advisor admission together' }
  ],
  graphEvents: [
    { type: 'node', id: 'q-onboarding', kind: 'QUESTION', label: 'Onboarding entry point' },
    { type: 'node', id: 'f-umbrella', kind: 'FINDING', label: 'Single-route umbrella command recommended' },
    { type: 'node', id: 's-render-fallback', kind: 'SOURCE', label: 'fallback renderer', path: '.skilled/skills/system-skill-advisor/runtime/lib/render.ts' },
    { type: 'node', id: 's-commands-readme', kind: 'SOURCE', label: 'commands catalog', path: '.skilled/commands/README.txt' },
    { type: 'edge', id: 'e-007-umbrella', source: 'f-umbrella', target: 'q-onboarding', relation: 'ANSWERS' },
    { type: 'edge', id: 'e-007-fallback', source: 's-render-fallback', target: 'f-umbrella', relation: 'SUPPORTS' },
    { type: 'edge', id: 'e-007-catalog', source: 's-commands-readme', target: 'f-umbrella', relation: 'SUPPORTS' }
  ],
  toolsUsed: ['Read', 'Bash', 'Grep'],
  sourcesQueried: [
    '.skilled/skills/system-skill-advisor/runtime/lib/render.ts',
    '.skilled/commands/doctor/_routes.yaml',
    '.skilled/commands/doctor/update.md',
    '.skilled/commands/doctor/env.md',
    '.skilled/commands/README.txt',
    '.skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs'
  ],
  timestamp: new Date().toISOString()
};

const findings = [
  { id: 'f-iter007-fallback-gap', label: 'An unmatched prompt renders only "Advisor: no skill matched." plus the directives and hygiene block; there is no doctor-guidance sentence in the fallback path.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/render.ts:476-487', 'specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-01.json'] },
  { id: 'f-iter007-single-route-precedent', label: 'The manifest states that a command owning one route needs no positional target, so a single-route onboarding command avoids the doctor input gate.', sources: ['.skilled/commands/doctor/_routes.yaml:12'] },
  { id: 'f-iter007-safe-default', label: 'Bare /doctor:update already runs the read-only check action and bare /doctor:env shows a selection menu, giving a safe-default precedent for an umbrella.', sources: ['.skilled/commands/doctor/update.md:6-13', '.skilled/commands/doctor/env.md:25-30'] },
  { id: 'f-iter007-no-umbrella', label: 'No /setup command exists; the doctor family is nine per-owner diagnostics, so onboarding prompts currently have nowhere to land.', sources: ['.skilled/commands/README.txt:46', '.skilled/commands/README.txt:158-171'] },
  { id: 'f-iter007-batteries-exist', label: 'The read-only batteries an umbrella would compose already exist: sk-code-setup-check.cjs, git-setup-check.cjs, advisor_status, runtime-mirror --check scripts and trigger-index --check.', sources: ['.skilled/commands/doctor/_routes.yaml:228-247', '.skilled/commands/doctor/_routes.yaml:204-212'] },
  { id: 'f-iter007-option-one', label: 'Option 1 recommended: a single-route /doctor:setup umbrella runs the read-only battery across owners, prints repair commands per failing leg, and matches the /doctor:update default-action pattern.', sources: ['.skilled/commands/doctor/update.md:6-13', '.skilled/commands/README.txt:166-171'] },
  { id: 'f-iter007-option-two-rejected', label: 'Option 2 rejected: an onboarding target under /doctor:skill-advisor mismatches ownership (battery spans sk-git, sk-code, spec-kit, advisor) and still requires an explicit target.', sources: ['.skilled/commands/doctor/skill-advisor.md:13-19'] },
  { id: 'f-iter007-option-three-rejected', label: 'Option 3 rejected as sole answer: per-route bridges cannot answer generic onboarding phrases, which have no single route and currently return empty.', sources: ['specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-06.json'] },
  { id: 'f-iter007-option-four-complement', label: 'Option 4 complement: one short fallback sentence naming the doctor entry surface when no skill matched, kept minimal because fallback text injects on every empty result.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/render.ts:110-118'] },
  { id: 'f-iter007-two-layer-relationship', label: 'Two-layer relationship: the umbrella owns onboarding phrases; per-route bridges own specific diagnostics like check my git hooks under the iteration 6 arbitration guards.', sources: ['.skilled/commands/doctor/_routes.yaml:285-289', 'specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-control-01.json'] },
  { id: 'f-iter007-maintenance-cost', label: 'Adding a command moves three gates together: the commands/README.txt group count and display name, _routes.yaml plus route-validate.sh, and advisor admission; command-catalog-mirror-check.cjs enforces catalog consistency.', sources: ['.skilled/commands/README.txt:46', '.skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs:202-220'] }
];

const ruledOut = [
  { type: 'ruled_out', direction: 'Onboarding as a /doctor:skill-advisor target', reason: 'Owner mismatch (battery spans four owners) and the input gate still requires an explicit target.', iteration: 7 },
  { type: 'ruled_out', direction: 'Per-route bridges alone as the onboarding answer', reason: 'Generic onboarding phrases have no single route and would still return empty.', iteration: 7 },
  { type: 'ruled_out', direction: 'A full routing table in the hook fallback', reason: 'Fallback text injects on every unmatched prompt; it must stay one bounded sentence.', iteration: 7 }
];

fs.writeFileSync(L + '/events/iter-007.json', JSON.stringify(record) + '\n');
const delta = [JSON.stringify(record)]
  .concat(findings.map((f) => JSON.stringify({ type: 'finding', ...f, iteration: 7 })))
  .concat(ruledOut.map((r) => JSON.stringify(r)));
fs.writeFileSync(L + '/deltas/iter-007.jsonl', delta.join('\n') + '\n');
console.log('wrote event + delta with', findings.length, 'findings');
