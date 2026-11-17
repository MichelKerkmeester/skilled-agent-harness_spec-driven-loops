const fs = require('fs');

const L = process.argv[2];
const NOW = process.argv[3];
const SID = process.argv[4];

const Q1 = 'Which runtimes hit the degraded fallback path in practice, and how often?';
const Q2 = 'What is the smallest change that makes the fallback answer carry the same command as the live answer?';

const base = {
  type: 'iteration',
  iteration: 3,
  runId: SID,
  sessionId: SID,
  lineageId: SID,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  run: 3,
  status: 'complete',
  focus: 'Degraded fallback path: which runtimes reach it, how often, and the smallest change that carries the live command',
  findingsCount: 10,
  newInfoRatio: 0.75,
  noveltyJustification:
    '8 of 10 findings are new code and measurement evidence at HEAD; 2 are projections derived from them',
  keyQuestions: [Q1, Q2],
  answeredQuestions: [Q1, Q2],
  ruledOut: [
    'Reusing degradedRecommendations alone',
    'Treating Codex as a degraded-path runtime',
    'Treating cold start as a degraded-path trigger',
  ],
  focusTrack: 'offer-reach',
  edgeCase: 'partial-success',
  toolsUsed: ['Read', 'Bash', 'Grep'],
  sourcesQueried: [
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/scratch/live-heads.txt',
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/degraded-readme.json',
    '.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1453',
    '.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1487',
    '.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:294',
    '.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:258',
    '.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:382',
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards/scratch/hook-health.json',
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/implementation-summary.md:117',
  ],
  timestamp: NOW,
  durationMs: 900000,
  graphEvents: [],
};

const CLI = '.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts';
const SUB = '.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts';
const FB = '.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts';
const DEG =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/degraded-readme.json';
const HEADS =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/scratch/live-heads.txt';
const HH =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards/scratch/hook-health.json';
const S13 =
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/implementation-summary.md';

const findings = [
  [
    'f-iter003-001',
    'The unreachable-daemon answer comes from the checked-in Python scorer, not the TypeScript scorer the daemon runs: runLocalScorer spawns skill_advisor.py with FORCE_LOCAL and the CLI 0.8/0.35 thresholds.',
    [`${CLI}:1453`, `${SUB}:294`],
  ],
  [
    'f-iter003-002',
    'degradedRecommendations collapses every row whose bare slash command is absent from the prompt into its owner skill and drops command, policy and needsMode, so plain offers, the doctor hand-off and the mode label are lost by construction.',
    [`${CLI}:1487`],
  ],
  [
    'f-iter003-003',
    'Measured at HEAD on the plain readme tune prompt: live sk-doc with /create:readme (start); unreachable endpoint system-spec-kit with no command in 644 ms, reproducing the 012 note on the current build.',
    [DEG, HEADS],
  ],
  [
    'f-iter003-004',
    'The hook reader already forwards command, policy, needsMode and ownerSkillId and maps a degraded or local-scorer envelope to stale; the loss is upstream in what the CLI emits.',
    [`${FB}:382`],
  ],
  [
    'f-iter003-005',
    'Runtimes that reach it are those whose hook runs the CLI fallback (Claude, Pi, Devin, DSH); Codex gets no brief at all because its hooks are unapproved, and OpenCode delivery is unknown so its degraded behaviour is unmeasured.',
    [`${S13}:117`],
  ],
  [
    'f-iter003-006',
    'Recorded frequency is zero realised fallback answers: 008 fail-open 0 of 5 with cold first prompt 611-844 ms, and 011 hook health rollingFailOpenRate 0 over 3 invocations; the only realised hits are deliberate socket sandboxes.',
    [HH, HEADS],
  ],
  [
    'f-iter003-007',
    'No persistent counter exists for this path: the only counter is hookHealth.rollingFailOpenRate, written only under SKILL_ADVISOR_DEBUG=1, so the real frequency is UNKNOWN outside debug runs.',
    [HH],
  ],
  [
    'f-iter003-008',
    'Cold start is no longer a trigger because the hook passes --no-warm-only and the CLI starts the daemon within its budget; what remains is a crashed or unreachable daemon, plus a socket path long enough to exceed Darwin sun_path where the CLI exits 69 with no brief.',
    [`${FB}:258`],
  ],
  [
    'f-iter003-009',
    'Smallest change: run the TypeScript fusion scorer and the same enrichCompiledRoutes step in process from runLocalScorer instead of spawning skill_advisor.py, keeping the Python spawn for a missing build and degradedRecommendations as the last resort.',
    [`${CLI}:1453`, `${CLI}:1487`],
  ],
  [
    'f-iter003-010',
    'Projected: the degraded brief then carries the live command, policy and needsMode, 27 head commands plus 1 Also line on 45 tune rows where untyped rows carry none today; the daemon path and its floors are untouched and 644 ms is the cost it replaces.',
    [DEG, HEADS],
  ],
];

const lines = [JSON.stringify(base)];
for (const [id, label, sources] of findings) {
  lines.push(JSON.stringify({ type: 'finding', id, label, iteration: 3, sources }));
}
lines.push(
  JSON.stringify({
    type: 'ruled_out',
    direction: 'Reusing degradedRecommendations alone to carry the live command',
    reason: 'The Python rows name bridge ids and the collapse drops them for untyped prompts',
    iteration: 3,
  }),
);

fs.writeFileSync(`${L}/deltas/iter-003.jsonl`, `${lines.join('\n')}\n`);
fs.writeFileSync(`${L}/prompts/_iter-003-event.json`, JSON.stringify(base));
console.log(`delta lines ${lines.length}`);
