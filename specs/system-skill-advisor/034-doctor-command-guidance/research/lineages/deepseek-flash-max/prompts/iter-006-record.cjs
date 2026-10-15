'use strict';
// Iteration 6 record generator: collision analysis.
const fs = require('fs');
const L = process.argv[2];
const SID = 'fanout-deepseek-flash-max-1792072037811-has9cy';

const record = {
  type: 'iteration',
  iteration: 6,
  run: 6,
  runId: SID, sessionId: SID, lineageId: SID,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  newInfoRatio: 0.9,
  status: 'complete',
  focus: 'Collision analysis: measured controls and candidate doctor phrases, ownership classification, and theft guards',
  findingsCount: 10,
  noveltyJustification: 'All 24 collision measurements are new evidence; the ownership classification and guard set convert the earlier design into measurable rules.',
  keyQuestions: [
    'How can doctor routing avoid stealing prompts that legitimately belong to skills?'
  ],
  answeredQuestions: [
    'How can doctor routing avoid stealing prompts that legitimately belong to skills?'
  ],
  ruledOut: [
    'Copying _routes.yaml trigger phrases verbatim into bridge signal lists',
    'Relying on the command-kind demotion to prevent prompt theft'
  ],
  keyFindings: [
    { id: 'f-iter006-controls-clean', title: 'All ten skill-shaped controls keep their incumbent skill' },
    { id: 'f-iter006-generic-verbs-risk', title: 'Controls contain generic verbs a careless phrase set could collide with' },
    { id: 'f-iter006-preexisting-ambiguity', title: 'A pre-existing system-deep-loop/sk-code ambiguity exists at 0.95/0.95' },
    { id: 'f-iter006-contested-phrases', title: 'Six candidate doctor phrases already route to their owning skill' },
    { id: 'f-iter006-empty-phrases', title: 'Three candidate phrases are empty today and safe as first-wave additions' },
    { id: 'f-iter006-wrong-owner', title: 'Two candidate phrases currently mis-route and adoption would correct them' },
    { id: 'f-iter006-verbatim-duplication', title: 'Verbatim phrase duplication produces ties and ambiguity, not handoff' },
    { id: 'f-iter006-incumbent-margins', title: 'Incumbent diagnostic routes sit at 0.82-0.95 confidence, so doctor phrases will clear the gate' },
    { id: 'f-iter006-guard-set', title: 'Arbitration guard set: phrase ownership, diagnostic 3+ token phrases, empty-first, control re-run, ambiguity budget' },
    { id: 'f-iter006-demotion-insufficient', title: 'The 0.08 command demotion is too small to serve as a theft guard' }
  ],
  graphEvents: [
    { type: 'node', id: 'q-theft', kind: 'QUESTION', label: 'Avoid stealing skill prompts' },
    { type: 'node', id: 'f-guard-set', kind: 'FINDING', label: 'Phrase-ownership guard set' },
    { type: 'node', id: 's-iter6-index', kind: 'SOURCE', label: 'collision measurement index', path: 'specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-index.json' },
    { type: 'node', id: 's-control-09', kind: 'SOURCE', label: 'worktree control envelope', path: 'specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-control-09.json' },
    { type: 'edge', id: 'e-006-guards', source: 's-iter6-index', target: 'f-guard-set', relation: 'SUPPORTS' },
    { type: 'edge', id: 'e-006-theft', source: 'f-guard-set', target: 'q-theft', relation: 'ANSWERS' }
  ],
  toolsUsed: ['Bash', 'Read', 'Write'],
  sourcesQueried: [
    'specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-index.json',
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts',
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts'
  ],
  timestamp: new Date().toISOString()
};

const B = 'specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events';
const findings = [
  { id: 'f-iter006-controls-clean', label: 'All ten skill-shaped controls keep their incumbent skill: sk-git x3, sk-doc x2, system-spec-kit, sk-prompt, sk-code, memory:save trio.', sources: [B + '/measure-iter6-control-01.json', B + '/measure-iter6-control-08.json', B + '/measure-iter6-index.json'] },
  { id: 'f-iter006-generic-verbs-risk', label: 'Controls contain generic verbs a careless doctor phrase set could collide with: set up a new git worktree and update the changelog, so doctor phrases must be multi-token and diagnostic.', sources: [B + '/measure-iter6-control-09.json', B + '/measure-iter6-control-10.json'] },
  { id: 'f-iter006-preexisting-ambiguity', label: 'run a deep review of this spec already returns system-deep-loop and sk-code tied at confidence 0.95 (0.8209 vs 0.8227), a baseline ambiguity any admission must not grow.', sources: [B + '/measure-iter6-control-07.json'] },
  { id: 'f-iter006-contested-phrases', label: 'Six candidate doctor phrases already route to the owning skill rather than a doctor diagnostic: git family to sk-git, sk-code surface to sk-code, advisor wrong-skill to system-skill-advisor, trigger index drift to system-spec-kit.', sources: [B + '/measure-iter6-doctor-02.json', B + '/measure-iter6-doctor-06.json'] },
  { id: 'f-iter006-empty-phrases', label: 'Three candidate phrases return empty today and carry zero theft risk as first-wave additions: disable comment hygiene gate, runtime mirror drift, skill budget audit.', sources: [B + '/measure-iter6-doctor-05.json', B + '/measure-iter6-doctor-11.json', B + '/measure-iter6-doctor-14.json'] },
  { id: 'f-iter006-wrong-owner', label: 'Two candidate phrases mis-route today: new skill not appearing in advisor results to sk-doc, and Code Mode broken to mcp-code-mode plus sk-code, where the doctor diagnostics are the intended surfaces.', sources: [B + '/measure-iter6-doctor-09.json', B + '/measure-iter6-doctor-12.json'] },
  { id: 'f-iter006-verbatim-duplication', label: 'Verbatim duplication is the theft mechanism: a three-token doctor phrase scoring 1.0 would compete with the incumbent skill evidence as a tie or ambiguity rather than a clean handoff.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:71-74', B + '/measure-iter6-doctor-02.json'] },
  { id: 'f-iter006-incumbent-margins', label: 'Incumbent diagnostic routes sit at 0.82-0.95 confidence, so admitted doctor phrases with 3+ tokens can be expected to clear the 0.8 gate.', sources: [B + '/measure-iter6-doctor-01.json'] },
  { id: 'f-iter006-guard-set', label: 'Arbitration guards: phrase ownership, 3+ token diagnostic phrases, empty phrases first, post-admission control re-run with unchanged top skills, and zero new ambiguous pairs.', sources: [B + '/measure-iter6-index.json'] },
  { id: 'f-iter006-demotion-insufficient', label: 'The 0.08 command demotion applies only to slashless prompts and is small relative to full-specificity phrases, so it cannot serve as the theft guard.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:776-777'] }
];

const ruledOut = [
  { type: 'ruled_out', direction: 'Copying _routes.yaml trigger phrases verbatim into bridge signal lists', reason: 'Measured incumbents show verbatim duplication lands as a tie or ambiguity, not a handoff.', iteration: 6 },
  { type: 'ruled_out', direction: 'Relying on the command-kind demotion to prevent theft', reason: 'The 0.08 demotion only applies without a slash and is small relative to phrase specificity.', iteration: 6 }
];

fs.writeFileSync(L + '/events/iter-006.json', JSON.stringify(record) + '\n');
const delta = [JSON.stringify(record)]
  .concat(findings.map((f) => JSON.stringify({ type: 'finding', ...f, iteration: 6 })))
  .concat(ruledOut.map((r) => JSON.stringify(r)));
fs.writeFileSync(L + '/deltas/iter-006.jsonl', delta.join('\n') + '\n');
console.log('wrote event + delta with', findings.length, 'findings');
