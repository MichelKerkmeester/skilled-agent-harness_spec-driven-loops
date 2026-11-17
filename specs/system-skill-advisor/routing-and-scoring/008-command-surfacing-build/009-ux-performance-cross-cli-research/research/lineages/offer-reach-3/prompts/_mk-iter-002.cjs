const fs = require('fs');

const L = process.argv[2];
const NOW = process.argv[3];
const SID = process.argv[4];

const Q1 =
  'Would intent-signal enrichment and re-embedding of the skill graph move the remaining plain tune rows, and at what risk to the floors?';
const Q2 =
  'What does keeping the embedding vectors in step with the metadata cost, and how is drift detected?';

const base = {
  type: 'iteration',
  iteration: 2,
  runId: SID,
  sessionId: SID,
  lineageId: SID,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  run: 2,
  status: 'complete',
  focus: 'Intent-signal enrichment and re-embedding of the skill graph: rows moved, floor risk, vector drift cost',
  findingsCount: 9,
  newInfoRatio: 0.8,
  noveltyJustification:
    '7 of 9 findings are new measurements at HEAD; 1 restates the regime relation and 1 is a bounded inference from them',
  keyQuestions: [Q1, Q2],
  answeredQuestions: [Q1, Q2],
  ruledOut: [
    'Reopening rank 15 on the +5 real-embedder rows',
    'Treating the fixture 23 and real 28 as a before/after pair',
    'Adding intent text to the 14 SKILL.md descriptions',
  ],
  focusTrack: 'offer-reach',
  edgeCase: 'missing-dependency',
  toolsUsed: ['Read', 'Bash', 'Grep'],
  sourcesQueried: [
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-2.md:56',
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/real-embed-capture.json',
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/embedder-cost.json',
    '.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:737',
    '.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1413',
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:258',
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1621',
    '.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite',
  ],
  timestamp: NOW,
  durationMs: 1200000,
  graphEvents: [],
};

const LIVE =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/tune-live.jsonl';
const REAL =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/real-embed-capture.json';
const COST =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/embedder-cost.json';
const SEG2 =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-2.md';
const DB = '.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts';
const SS = '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts';
const PR = '.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts';

const findings = [
  [
    'f-iter002-001',
    'The real-embedding capture reads plain tune 28 of 45 (own 13, attached 15) and holdout 3 of 44, against the committed fixture capture 23 and 1; typed stays 44 of 44 and false offers 0 of 35.',
    [REAL],
  ],
  [
    'f-iter002-002',
    'The real capture 28 equals the brief-level 27 head commands plus 1 Also line, so the live regime is the real-embedding regime and the committed 23 is a regime gap, not a regression.',
    [LIVE, REAL],
  ],
  [
    'f-iter002-003',
    'Five tune rows move under the real embedder and all five already carried a command: doctor-env, doctor-git, symlink, speckit-handoff and speckit-plan each go top1 false to true with no loss, so the gain is top-1 exactness not reach.',
    [REAL],
  ],
  [
    'f-iter002-004',
    'None of the 17 no-command rows gains a command from re-embedding: five already have their owner in the top three behind a non-semantic block, and twelve have the owner absent or no recommendation.',
    [LIVE],
  ],
  [
    'f-iter002-005',
    'The real semantic lane embeds only the SKILL.md frontmatter description, while the fixture lane composes name, description, domains, intentSignals and derivedTriggers, so intent signals reach the cosine lane only under the fixture regime.',
    [`${DB}:737`, `${SS}:258`],
  ],
  [
    'f-iter002-006',
    'Keeping vectors in step is incremental: refresh skips a row whose vec_content_hash and vec_model_id are unchanged, so only an edited description or a changed model costs an embed call.',
    [`${DB}:1413`],
  ],
  [
    'f-iter002-007',
    'Cost at this corpus size: 60 vectors (14 skill, 46 command) at 768 dims in a 561 KB database; warm median 5.95 ms and p95 8.97 ms per embed; about 83 ms for all 14 skill descriptions and 357 ms for all 60.',
    [COST],
  ],
  [
    'f-iter002-008',
    'Drift is already detectable: per-row vec_content_hash catches text drift and readAdvisorEmbeddingStaleness compares the active pointer model and dimension against the stored summary and returns stale with a reason.',
    [`${PR}:1621`],
  ],
  [
    'f-iter002-009',
    'Rank 15 stays declined: the measured brief-level gain of enrichment and re-embedding is zero commands on the tune split, and rewriting all 14 embedded texts reranks every skill globally without a measurable floor result.',
    [SEG2, LIVE],
  ],
];

const lines = [JSON.stringify(base)];
for (const [id, label, sources] of findings) {
  lines.push(JSON.stringify({ type: 'finding', id, label, iteration: 2, sources }));
}
lines.push(
  JSON.stringify({
    type: 'ruled_out',
    direction: 'Reopening rank 15 on the real-embedder numbers alone',
    reason: 'The five moved rows already carried a command; no no-command row moves',
    iteration: 2,
  }),
);

fs.writeFileSync(`${L}/deltas/iter-002.jsonl`, `${lines.join('\n')}\n`);
fs.writeFileSync(`${L}/prompts/_iter-002-event.json`, JSON.stringify(base));
console.log(`delta lines ${lines.length}`);
