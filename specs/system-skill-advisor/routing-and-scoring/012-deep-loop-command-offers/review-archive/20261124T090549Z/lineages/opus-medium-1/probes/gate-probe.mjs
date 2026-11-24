const m = await import(process.cwd() + '/.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts');
const ps = JSON.parse(process.argv[2]);
for (const p of ps) {
  const routed = m.attachCommand('system-deep-loop', {action:'route',selectionKind:'single',targets:[{workflowMode:'review'}]}, p);
  const routedR = m.attachCommand('system-deep-loop', {action:'route',selectionKind:'single',targets:[{workflowMode:'research'}]}, p);
  const deferred = m.attachCommand('system-deep-loop', {action:'defer'}, p);
  console.log(JSON.stringify(p), '| rev:', routed, '| res:', routedR, '| defer:', deferred, '| typedTop:', m.typedCommandForTop('system-deep-loop', p)?.command, '| asks:', m.asksForLoopRun(p), '| stuck:', m.isStuckRunComplaint(p));
}
