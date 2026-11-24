import { readFileSync, writeFileSync } from 'node:fs';
const m = await import(process.cwd() + '/.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts');
const ps = JSON.parse(readFileSync(process.argv[2], 'utf8'));
writeFileSync(process.argv[3], JSON.stringify(ps.map((p) => [p, m.asksForLoopRun(p), m.isStuckRunComplaint(p), m.isWritingAboutTopic(p), m.commandOnlyMentioned(p, '/deep:review')])));
