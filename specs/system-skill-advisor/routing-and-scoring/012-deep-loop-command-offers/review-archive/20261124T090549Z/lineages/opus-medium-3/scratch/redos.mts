import * as m from '../../../../../../../../.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts';
const inputs = {
  words: 'run '.repeat(5000) + 'x',
  passes: 'several more extra passes of '.repeat(2000),
  quotes: "don't ".repeat(5000) + '/deep:review',
  slashes: '/deep:review '.repeat(3000),
  iters: '5 a-b-c-d iterations of '.repeat(2000),
};
for (const [k, v] of Object.entries(inputs)) {
  const t = performance.now();
  m.attachCommand('system-deep-loop', { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'review' }] }, v);
  m.typedCommandForTop('system-deep-loop', v);
  console.log(k, v.length, Math.round(performance.now() - t) + 'ms');
}
