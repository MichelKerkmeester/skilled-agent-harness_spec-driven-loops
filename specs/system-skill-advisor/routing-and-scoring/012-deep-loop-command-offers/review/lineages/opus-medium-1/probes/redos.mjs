const m = await import(process.cwd() + '/.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts');
const N = Number(process.argv[2] || 2000);
const cases = {
  words: 'review '.repeat(N),
  aword: 'a '.repeat(N) + 'x',
  checkfor: 'check ' + 'x '.repeat(N) + 'for',
  dashes: 'a-'.repeat(N),
  iterRun: 'run ' + 'more '.repeat(N) + 'iterations',
  slashes: '/deep:review '.repeat(N/10),
  ofthe: 'rounds of the ' + 'x-'.repeat(N),
  quoteword: "don't ".repeat(N) + 'run /deep:review',
  orlist: 'do not run ' + '/a:b or '.repeat(N/4) + '/deep:review',
  iteratively: 'review ' + 'a '.repeat(N) + 'iterativelyx',
};
for (const [k, p] of Object.entries(cases)) {
  const t = performance.now();
  m.asksForLoopRun(p); m.isStuckRunComplaint(p); m.commandOnlyMentioned(p, '/deep:review'); m.typedCommandIn(p);
  m.attachCommand('system-deep-loop', {action:'defer'}, p);
  console.log(k, p.length, (performance.now() - t).toFixed(1) + 'ms');
}
