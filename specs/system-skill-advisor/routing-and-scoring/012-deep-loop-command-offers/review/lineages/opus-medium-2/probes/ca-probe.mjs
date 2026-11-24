import * as ca from '/Users/michelkerkmeester/worktrees/public/533-deep-loop-offers-deep-review/.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts';
const route=(m)=>({action:'route',selectionKind:'single',targets:[{workflowMode:m}]});
const defer={action:'defer'};
const ps=JSON.parse(process.argv[2]);
for (const [p,m] of ps){ const r = m==='defer'?defer:route(m); console.log(JSON.stringify(p),'=>',m, ca.attachCommand('system-deep-loop',r,p)??'-','| ask',ca.asksForLoopRun(p),'| typed',ca.typedCommandIn(p)??'-'); }
