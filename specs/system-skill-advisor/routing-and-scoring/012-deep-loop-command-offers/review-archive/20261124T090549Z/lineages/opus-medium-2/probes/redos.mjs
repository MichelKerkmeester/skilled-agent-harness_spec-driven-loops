import * as ca from '../../../../../../../../.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts';
const route={action:'route',selectionKind:'single',targets:[{workflowMode:'review'}]};
const inputs={
 words:'review '+'the '.repeat(4000)+'iteratively',
 hyph:'a-'.repeat(5000)+'x',
 check:'check '+'a '.repeat(4000)+'for',
 rounds:'several rounds of the '+'x-'.repeat(4000),
 slashes:'/deep:review '.repeat(2000),
 apost:"'".repeat(8000)+'/deep:review',
 counts:'2 '.repeat(5000)+'iterations',
 want:"i'd like a "+'a '.repeat(4000)+'review loop',
 dont:"don't "+"x ".repeat(4000)+'/deep:review',
 orlist:'do not run '+'/a:b or '.repeat(2000)+'/deep:review',
};
for (const [k,p] of Object.entries(inputs)) { const t=performance.now(); ca.attachCommand('system-deep-loop',route,p); ca.attachCommand('system-deep-loop',{action:'defer'},p); ca.typedCommandForTop('system-deep-loop',p); console.log(k,p.length,(performance.now()-t).toFixed(1)+'ms'); }
