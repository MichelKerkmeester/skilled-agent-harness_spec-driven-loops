const fs = require('fs');

const L = process.argv[2];
const NOW = process.argv[3];
const SID = process.argv[4];

const Q = 'Which plain tune rows of command-prompts.jsonl still get no command after phase 012, and what is the cause per row id?';

const base = {
  type: 'iteration',
  iteration: 1,
  runId: SID,
  sessionId: SID,
  lineageId: SID,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  run: 1,
  status: 'complete',
  focus: 'Which plain tune rows still get no command after phase 012, and why, by row id',
  findingsCount: 10,
  newInfoRatio: 0.85,
  noveltyJustification:
    '9 of 10 findings are new per-row cause measurements at HEAD; 1 is a projection derived from them',
  keyQuestions: [Q],
  answeredQuestions: [Q],
  ruledOut: [
    'Reading attachedMetrics.plain.tune as a brief-offer count',
    'Counting the six doctor subcommand labels as wrong offers',
    'Counting a rank-2 command as offered by the brief',
  ],
  focusTrack: 'offer-reach',
  edgeCase: 'contradictory-evidence',
  toolsUsed: ['Read', 'Bash', 'Grep'],
  sourcesQueried: [
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/tune-live.jsonl',
    '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl',
    '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json',
    '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:491',
    '.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:15',
    '.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:451',
    '.skilled/skills/system-skill-advisor/runtime/lib/render.ts:533',
  ],
  timestamp: NOW,
  durationMs: 900000,
  graphEvents: [],
};

const LIVE =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/tune-live.jsonl';
const CA = '.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts';
const AR = '.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts';
const RD = '.skilled/skills/system-skill-advisor/runtime/lib/render.ts';
const CAP =
  '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs';

const findings = [
  [
    'f-iter001-001',
    '27 of 45 plain tune rows render a command on the brief head, 1 more only through the Also doctor line, 17 render none.',
    [LIVE, `${RD}:533`],
  ],
  [
    'f-iter001-002',
    'Every one of the 27 head commands is the expected command family: 21 exact, 6 a documented subcommand; zero wrong-command offers on the plain tune split.',
    [LIVE, `${CA}:74`],
  ],
  [
    'f-iter001-003',
    'The capture offered flag is bridge-row reach, not a rendered command, and disagrees with the live head on six tune rows.',
    [`${CAP}:491`],
  ],
  [
    'f-iter001-004',
    'Cause 1 duplicate suppression, 1 row: cmd-create-agent-plain-tune-01 routes sk-doc to sk-create-agent while the create:agent row already ranks second carrying /create:agent, so the hub command is withheld and the single-head renderer drops rank 2.',
    [`${AR}:451`, `${RD}:533`],
  ],
  [
    'f-iter001-005',
    'Cause 2 routed mode without a command, 2 rows: cmd-create-readme-plain-tune-01 and cmd-create-with-human-voice-plain-tune-01 both route sk-doc to sk-create-quality-control, a mode absent from MODE_COMMANDS.',
    [`${CA}:21`],
  ],
  [
    'f-iter001-006',
    'Cause 3 needs-mode label, 4 rows: create-repo-rule, doctor-sk-skill, speckit-complete and speckit-save top sk-doc with action defer and print sk-doc (needs a mode).',
    [`${CA}:392`, `${RD}:550`],
  ],
  [
    'f-iter001-007',
    'Cause 4 silent defer or route, 2 rows: speckit-implement defers and doctor-sk-code routes on sk-code, which is absent from MODE_COMMANDS so needsMode stays null.',
    [`${CA}:392`],
  ],
  [
    'f-iter001-008',
    'Cause 5 no recommendation, 6 rows: create-skill-parent, doctor-install, doctor-setup, doctor-speckit, doctor-update and speckit-search return zero recommendations; five of the six commands have scorerRow true.',
    [`${CA}:189`, LIVE],
  ],
  [
    'f-iter001-009',
    'Cause 6 top skill without a command, 2 rows: doctor-mcp tops mcp-code-mode with no route and doctor-skill-advisor tops system-skill-advisor, whose command has seven subcommands.',
    [LIVE],
  ],
  [
    'f-iter001-010',
    'Projection: fixing every cause takes plain tune head reach from 27 to 45, and the causes are separately ranked because their cost and floor risk differ.',
    [LIVE],
  ],
];

const lines = [JSON.stringify(base)];
for (const [id, label, sources] of findings) {
  lines.push(JSON.stringify({ type: 'finding', id, label, iteration: 1, sources }));
}
lines.push(
  JSON.stringify({
    type: 'ruled_out',
    direction: 'Reading attachedMetrics.plain.tune as a brief-offer count',
    reason: 'It counts bridge-row reach and disagrees with the live head on six rows',
    iteration: 1,
  }),
);

fs.writeFileSync(`${L}/deltas/iter-001.jsonl`, `${lines.join('\n')}\n`);
fs.writeFileSync(`${L}/prompts/_iter-001-event.json`, JSON.stringify(base));
console.log(`delta lines ${lines.length}`);
