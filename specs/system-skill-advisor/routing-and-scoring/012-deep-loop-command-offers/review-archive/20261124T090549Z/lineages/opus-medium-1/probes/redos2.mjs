const m = await import(process.cwd() + '/.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts');
for (const n of [200, 800, 3200]) {
  const p = 'do not run /deep:review. '.repeat(n);
  const t = performance.now(); m.commandOnlyMentioned(p, '/deep:review'); m.typedCommandForTop('system-deep-loop', p);
  console.log('led-repeat', n, p.length, (performance.now() - t).toFixed(1) + 'ms');
}
