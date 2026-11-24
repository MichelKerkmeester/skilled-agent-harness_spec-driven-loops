import { readFileSync } from 'node:fs';
import { asksForLoopRun, isStuckRunComplaint, isWritingAboutTopic } from '/Users/michelkerkmeester/worktrees/public/535-deep-loop-offers-traceability-review/.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts';
const prompts = JSON.parse(readFileSync(process.argv[2], 'utf8')) as string[];
process.stdout.write(JSON.stringify(prompts.map((p) => [asksForLoopRun(p), isStuckRunComplaint(p), isWritingAboutTopic(p)])));
