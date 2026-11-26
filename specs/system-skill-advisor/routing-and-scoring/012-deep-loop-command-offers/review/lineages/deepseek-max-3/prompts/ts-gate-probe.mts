import { readFileSync } from 'node:fs';
import { asksForLoopRun, isStuckRunComplaint, isWritingAboutTopic } from '/Users/michelkerkmeester/worktrees/public/535-deep-loop-offers-traceability-review/.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts';
const cases = JSON.parse(readFileSync(process.argv[2], 'utf8')).cases as Array<{ id: string; prompt: string }>;
const out = cases.map((c) => [c.id, asksForLoopRun(c.prompt), isStuckRunComplaint(c.prompt), isWritingAboutTopic(c.prompt)]);
process.stdout.write(JSON.stringify(out));
