import * as ca from '../../../../../../../../.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts';
const route={action:'route',selectionKind:'single',targets:[{workflowMode:'review'}]};
for (const n of [2000,8000,32000]) {
 const inputs={ slashes:'/deep:review '.repeat(n), deepr:'deep review '.repeat(n), iters:'3 iterations '.repeat(n), orlist:'do not run '+'/a:b or '.repeat(n)+'/deep:review'};
 for (const [k,p] of Object.entries(inputs)) { const t=performance.now(); ca.attachCommand('system-deep-loop',route,p); ca.typedCommandForTop('system-deep-loop',p); console.log(n,k,p.length,(performance.now()-t).toFixed(0)+'ms'); }
}
