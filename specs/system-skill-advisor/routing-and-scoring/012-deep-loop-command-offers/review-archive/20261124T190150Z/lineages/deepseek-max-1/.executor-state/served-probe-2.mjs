import { attachCommand } from '/Users/michelkerkmeester/worktrees/public/535-deep-loop-offers-traceability-review/.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js';

const REVIEW = { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'review' }] };
const RESEARCH = { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'research' }] };
const DEFER = { action: 'defer' };

const cases = [
  ['two typed, doctor second', REVIEW, '/deep:review the parser and then /doctor:deep-loop'],
  ['subject: scorer noun', REVIEW, 'refactor the deep research scorer'],
  ['subject: multi-pass compiler', REVIEW, 'review our multi-pass compiler'],
  ['subject: loop for every PR', REVIEW, 'we need a review loop for every PR'],
  ['subject: count of a model', REVIEW, 'compare 10 iterations of the model and review the results'],
  ['two cues, defer', DEFER, 'run 5 iterations of research and review on the parser'],
  ['both modes named, defer', DEFER, 'run 5 iterations of research and review on the parser'],
  ['plural researches', RESEARCH, 'run two deep researches on vector indexes'],
  ['review loop of importer', DEFER, 'run two review loops of the importer'],
  ['negated symptom', RESEARCH, 'the deep research run is not stuck, run 5 more iterations'],
  ['plurality of past runs', REVIEW, 'the deep reviews ran overnight'],
  ['bare loop name', DEFER, 'deep loop: audit the payments flow'],
  ['writing about a loop', REVIEW, 'write a blog post about how to run a deep review'],
  ['pronoun rerun', REVIEW, "the deep review didn't finish, run it again"],
  ['pronoun with no run', REVIEW, 'run it again to reproduce the crash'],
];

for (const [label, route, prompt] of cases) {
  let out;
  try {
    out = attachCommand('system-deep-loop', route, prompt);
  } catch (err) {
    out = `THREW ${err && err.message}`;
  }
  console.log(`${label.padEnd(30)} ${String(out)}  <- ${prompt}`);
}
