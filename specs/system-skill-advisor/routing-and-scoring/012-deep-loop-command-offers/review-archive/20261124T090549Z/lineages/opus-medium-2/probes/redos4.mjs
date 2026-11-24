import * as ca from '../../../../../../../../.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts';
const route={action:'route',selectionKind:'single',targets:[{workflowMode:'review'}]};
const max=Number(process.argv[2]);
for (const [k,u] of [['negcmd',"don't run /deep:review "],['fixcmd','fix the deep review '],['negated','no deep review ']]) { const p=u.repeat(Math.floor(max/u.length)); const t=performance.now(); ca.attachCommand('system-deep-loop',route,p); ca.typedCommandForTop('system-deep-loop',p); console.log(k,p.length,(performance.now()-t).toFixed(0)+'ms'); }
