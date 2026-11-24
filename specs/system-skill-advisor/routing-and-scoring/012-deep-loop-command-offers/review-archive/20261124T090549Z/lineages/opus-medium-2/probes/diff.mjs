import * as ca from '../../../../../../../../.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts';
import fs from 'node:fs';
const ps=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
console.log(JSON.stringify(ps.map(p=>[ca.asksForLoopRun(p),ca.isStuckRunComplaint(p),ca.isWritingAboutTopic(p),ca.commandOnlyMentioned(p,'/deep:review'),ca.typedCommandIn(p)??null])));
