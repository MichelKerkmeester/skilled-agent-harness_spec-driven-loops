import { attachCommand } from '/Users/michelkerkmeester/worktrees/public/535-deep-loop-offers-traceability-review/.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js';

const REVIEW = { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'review' }] };
const RESEARCH = { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'research' }] };
const DEFER = { action: 'defer' };

const cases = [
  ['refusal lead (review route)', REVIEW, 'skip the deep review and just answer'],
  ['control run', REVIEW, 'do a deep review of the parser'],
  ['skip-to control', REVIEW, 'skip straight to the deep review of the parser'],
  ['doctor refused (research route)', RESEARCH, "the deep research run is stuck. please don't run anything"],
  ['doctor control (research route)', RESEARCH, 'my deep research run is stuck'],
  ['plural reviews (review route)', REVIEW, 'run deep reviews on the parser and the scheduler'],
  ['mode-free plural (defer)', DEFER, 'run two deep loops on the cache layer'],
  ['routed mode guard (research route)', RESEARCH, 'run a deep loop to review the research loop config'],
  ['deferred mode guard (defer)', DEFER, 'run a deep loop to review the research loop config'],
  ['no-edit read-only run', REVIEW, "run a deep review of the parser but don't change anything"],
  ['refused cue (defer)', DEFER, 'run deep reviews on the parser, but skip the deep research'],
  ['two typed commands', REVIEW, 'run /deep:review on the parser, then /create:changelog'],
  ['how-do question', REVIEW, 'how do I run a deep review on this?'],
  ['effort complaint', REVIEW, 'the deep review loop is too slow'],
  ['effort manner', REVIEW, 'run a deep review slower'],
  ['linter passes (stage-one style)', REVIEW, 'several passes of the linter failed, review the config'],
  ['typed doctor after comma', RESEARCH, 'the deep research run is stuck, /doctor:deep-loop'],
  ['past summary (doctor)', RESEARCH, 'summarize the deep reviews from last week'],
];

for (const [label, route, prompt] of cases) {
  let out;
  try {
    out = attachCommand('system-deep-loop', route, prompt);
  } catch (err) {
    out = `THREW ${err && err.message}`;
  }
  console.log(`${label.padEnd(34)} ${String(out)}  <- ${prompt}`);
}

