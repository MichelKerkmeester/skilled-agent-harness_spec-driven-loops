'use strict';
// Iteration 1 record generator: writes the single-record gateway payload and the delta file.
const fs = require('fs');
const L = process.argv[2];
const SID = 'fanout-deepseek-flash-max-1792072037811-has9cy';

const record = {
  type: 'iteration',
  iteration: 1,
  run: 1,
  runId: SID, sessionId: SID, lineageId: SID,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  newInfoRatio: 0.92,
  status: 'complete',
  focus: 'Advisor architecture and routing pipeline today: CLI front door, hook brief, scorer lanes, and skill-vs-command surfacing',
  findingsCount: 12,
  noveltyJustification: '11 of 12 findings were new to this lineage and one consolidated known doc facts; the command-bridge mechanism was the materially new axis.',
  keyQuestions: [
    'How does the skill advisor resolve a prompt to a recommendation today, and which files own scoring, graph, and trigger data?',
    'How are commands surfaced to the advisor relative to skills, and do doctor commands participate in that surface at all?'
  ],
  answeredQuestions: [
    'How does the skill advisor resolve a prompt to a recommendation today, and which files own scoring, graph, and trigger data?',
    'How are commands surfaced to the advisor relative to skills, and do doctor commands participate in that surface at all?'
  ],
  ruledOut: [
    'Treating SKILL.md frontmatter trigger_phrases as a runtime routing input',
    'Assuming commands and skills share one undifferentiated surfacing pipeline'
  ],
  keyFindings: [
    { id: 'f-iter001-cli-front-door', title: 'Single daemon-backed CLI front door with stale-dist refusal' },
    { id: 'f-iter001-nine-commands', title: 'Nine stable commands, 0/1/64/69/75 exit taxonomy, degraded Python fallback' },
    { id: 'f-iter001-routing-vocab', title: 'Routing vocabulary lives in graph-metadata.json; SKILL.md frontmatter is not read' },
    { id: 'f-iter001-hook-brief', title: 'Prompt-time hook injects an advisory Advisor: brief and fails open' },
    { id: 'f-iter001-five-lane-fusion', title: 'Five-lane fusion with per-variant weight multipliers' },
    { id: 'f-iter001-explicit-command-boosts', title: 'Explicit lane maps command strings and phrases to skills and pseudo-command ids' },
    { id: 'f-iter001-command-bridge-kind', title: 'Commands are first-class kind=command projections loaded into the skill list' },
    { id: 'f-iter001-command-bridge-generation', title: '27 generated bridges from 19 command-metadata files plus 8 allow-list entries; 5 TS-active' },
    { id: 'f-iter001-no-doctor-bridges', title: 'No doctor command participates in the advisor surface today' },
    { id: 'f-iter001-command-rank-adjust', title: 'Command-kind recommendations are demoted 0.08 without a slash in the prompt' },
    { id: 'f-iter001-doctor-tune-contract', title: 'Doctor skill-advisor tune asset owns the phrase_boost_range contract' },
    { id: 'f-iter001-drift-guard-seam', title: 'Command-bridge drift guard is the CI seam for admitting new bridges' }
  ],
  graphEvents: [
    { type: 'node', id: 'q-advisor-pipeline', kind: 'QUESTION', label: 'Advisor resolution pipeline' },
    { type: 'node', id: 'q-command-surface', kind: 'QUESTION', label: 'Command vs skill surfacing' },
    { type: 'node', id: 'f-command-bridges', kind: 'FINDING', label: 'Commands are kind=command bridge projections' },
    { type: 'node', id: 'f-doctor-absent', kind: 'FINDING', label: 'No doctor bridges exist' },
    { type: 'node', id: 's-projection', kind: 'SOURCE', label: 'scorer projection.ts', path: '.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts' },
    { type: 'node', id: 's-explicit-lane', kind: 'SOURCE', label: 'explicit lane boosts', path: '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts' },
    { type: 'node', id: 's-hook-ref', kind: 'SOURCE', label: 'skill advisor hook reference', path: '.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md' },
    { type: 'edge', id: 'e-001-cmd-bridges', source: 'f-command-bridges', target: 'q-command-surface', relation: 'ANSWERS' },
    { type: 'edge', id: 'e-001-doctor-absent', source: 's-projection', target: 'f-doctor-absent', relation: 'SUPPORTS' },
    { type: 'edge', id: 'e-001-explicit', source: 's-explicit-lane', target: 'f-command-bridges', relation: 'SUPPORTS' }
  ],
  toolsUsed: ['Read', 'Bash', 'Grep', 'Glob'],
  sourcesQueried: [
    '.skilled/bin/skill-advisor.cjs',
    '.skilled/skills/system-skill-advisor/SKILL.md',
    '.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md',
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts',
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts',
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts'
  ],
  timestamp: new Date().toISOString()
};

const findings = [
  { id: 'f-iter001-cli-front-door', label: 'The advisor has exactly one front door: .skilled/bin/skill-advisor.cjs spawns runtime/dist/runtime/skill-advisor-cli.js and refuses a stale dist with exit 69 (75 warm-only).', sources: ['.skilled/bin/skill-advisor.cjs:22-23', '.skilled/bin/skill-advisor.cjs:70-83', '.skilled/bin/skill-advisor.cjs:105-109'] },
  { id: 'f-iter001-nine-commands', label: 'Nine stable daemon-backed command ids over one CLI, exit taxonomy 0/1/64/69/75, with a degraded local Python scorer fallback.', sources: ['.skilled/skills/system-skill-advisor/SKILL.md:318-336'] },
  { id: 'f-iter001-routing-vocab', label: 'Skill routing vocabulary lives in graph-metadata.json intent_signals plus derived.trigger_phrases; SKILL.md frontmatter trigger_phrases are not read by runtime routing, and doc frontmatter triggers require SPECKIT_ADVISOR_DOC_TRIGGERS=true.', sources: ['.skilled/skills/system-skill-advisor/SKILL.md:338', '.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts:36'] },
  { id: 'f-iter001-hook-brief', label: 'The prompt hook runs kill-switch, prompt gate, one bounded advisor_recommend call, and renders an advisory Advisor: brief with fail-open fallback statuses; raw prompt text is never persisted.', sources: ['.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:33-43'] },
  { id: 'f-iter001-five-lane-fusion', label: 'Scoring is a five-lane fusion (explicit_author, lexical, graph_causal, derived_generated, semantic_shadow) with per-variant weight multipliers around 0.95-1.04.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:169-177', '.skilled/skills/system-skill-advisor/runtime/lib/scorer/weights-config.ts:15-21'] },
  { id: 'f-iter001-explicit-command-boosts', label: 'The explicit lane PHRASE_BOOSTS table maps command strings to skills and pseudo-command ids (e.g. /speckit:save to memory:save 1.6) and contains no /doctor:* entry.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:117-119'] },
  { id: 'f-iter001-command-bridge-kind', label: 'Commands are already first-class kind=command projections: hand-authored CommandBridgeProjection entries plus a generated bridge block loaded into both SQLite and filesystem projections.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:75-151', '.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1127', '.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1205'] },
  { id: 'f-iter001-command-bridge-generation', label: 'derive-command-bridges.cjs produces 27 bridges from 19 command-metadata.json files plus 8 allow-list entries; only 5 are TypeScript-active and 15 Python-active, and most are routingEnabled=false.', sources: ['.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:28-40', '.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1-10'] },
  { id: 'f-iter001-no-doctor-bridges', label: 'No doctor command participates in the advisor surface: projection.ts has zero doctor references and .skilled/commands/doctor/ carries no command-metadata.json input for the bridge generator.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts', '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:108-109'] },
  { id: 'f-iter001-command-rank-adjust', label: 'Command-kind recommendations are demoted by 0.08 during fusion ordering when the prompt contains no slash, an existing guard against natural-language command float.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:776-777', '.skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts:47'] },
  { id: 'f-iter001-doctor-tune-contract', label: 'PHRASE_BOOST_BOUND mirrors the doctor skill-advisor proposal validator phrase-range contract, making /doctor:skill-advisor the sanctioned tuning surface for advisor phrase boosts.', sources: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:107-112', '.skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml'] },
  { id: 'f-iter001-drift-guard-seam', label: 'A command-bridges drift guard test compares the generated projection, generator dump and allow-list, providing the CI seam for admitting doctor bridges.', sources: ['.skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts:1-40'] }
];

const ruledOut = [
  { type: 'ruled_out', direction: 'Treating SKILL.md frontmatter trigger_phrases as a routing input', reason: 'The runtime reads graph-metadata.json intent_signals and derived.trigger_phrases; SKILL.md frontmatter is not read by any routing reader.', iteration: 1 },
  { type: 'ruled_out', direction: 'Assuming commands and skills are surfaced by one undifferentiated pipeline', reason: 'Commands implement kind=command projections with routingEnabled flags and a slash-presence rank adjustment.', iteration: 1 }
];

fs.writeFileSync(L + '/events/iter-001.json', JSON.stringify(record) + '\n');
const delta = [JSON.stringify(record)]
  .concat(findings.map((f) => JSON.stringify({ type: 'finding', ...f, iteration: 1 })))
  .concat(ruledOut.map((r) => JSON.stringify(r)));
fs.writeFileSync(L + '/deltas/iter-001.jsonl', delta.join('\n') + '\n');
console.log('wrote event + delta with', findings.length, 'findings');
