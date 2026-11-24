import { attachCommand } from '/Users/michelkerkmeester/worktrees/public/535-deep-loop-offers-traceability-review/.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js';

const REVIEW = { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'review' }] };
const DEFER = { action: 'defer' };

const shapes = [
  ['10k single letter', 'a'.repeat(10000)],
  ['10k repeated "deep "', 'deep '.repeat(2000)],
  ['10k repeated "not "', 'not '.repeat(2500)],
  ['10k repeated "skip "', 'skip '.repeat(2000)],
  ['10k nested clauses', 'run a deep review '.repeat(555)],
  ['10k refusal tail', 'run a deep review of the parser '.repeat(1) + 'do not '.repeat(1400)],
  ['96k prompt', 'review '.repeat(13714)],
];

for (const [label, prompt] of shapes) {
  const started = process.hrtime.bigint();
  let out;
  try {
    out = attachCommand('system-deep-loop', REVIEW, prompt);
  } catch (err) {
    out = `THREW ${err && err.message}`;
  }
  const ms = Number(process.hrtime.bigint() - started) / 1e6;
  const deferred = attachCommand('system-deep-loop', DEFER, prompt);
  console.log(`${label.padEnd(24)} ${ms.toFixed(1)}ms  review=${String(out)}  defer=${String(deferred)}  len=${prompt.length}`);
}
