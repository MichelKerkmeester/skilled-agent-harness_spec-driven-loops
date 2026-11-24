import * as ca from '../../../../../../../../.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts';
for (const p of JSON.parse(process.argv[2])) {
  const t = ca.typedCommandForTop('system-deep-loop', p);
  console.log(JSON.stringify(p), '| attach(review route)=', ca.attachCommand('system-deep-loop',{action:'route',selectionKind:'single',targets:[{workflowMode:'review'}]},p)??'-', '| typedForTop=', t?.command??'-', '| stuck', ca.isStuckRunComplaint(p), '| noEdit', ca.isNoEditRequest(p));
}
