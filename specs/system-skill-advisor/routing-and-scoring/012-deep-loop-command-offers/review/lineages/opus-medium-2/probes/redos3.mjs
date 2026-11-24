import * as ca from '../../../../../../../../.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts';
const route={action:'route',selectionKind:'single',targets:[{workflowMode:'review'}]};
for (const n of [1000,4000,16000]) {
 const inputs={ negated:"no deep review ".repeat(n), negcmd:"don't run /deep:review ".repeat(n), fixcmd:"fix the deep review ".repeat(n)};
 for (const [k,p] of Object.entries(inputs)) { const t=performance.now(); ca.attachCommand('system-deep-loop',route,p); ca.typedCommandForTop('system-deep-loop',p); console.log(n,k,p.length,(performance.now()-t).toFixed(0)+'ms'); }
}
