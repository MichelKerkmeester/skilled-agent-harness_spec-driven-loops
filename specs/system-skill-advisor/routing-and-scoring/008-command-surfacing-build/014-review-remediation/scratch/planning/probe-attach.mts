// Run from the repository root: node --experimental-strip-types --no-warnings <this file>
// Calls the attach-path functions on the review's inputs and prints each result.
import { resolve } from 'node:path';
const m = await import(resolve('.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts'));
const single = (mode: string) => ({ action: 'route', selectionKind: 'single', targets: [{ workflowMode: mode }] });
const show = (label: string, value: unknown) => console.log(`${label} -> ${JSON.stringify(value)}`);
show("attachCommand(sk-doc, single sk-create-skill, 'use sk-doc to create a skill called invoice-parser, do not change anything yet')", m.attachCommand('sk-doc', single('sk-create-skill'), 'use sk-doc to create a skill called invoice-parser, do not change anything yet'));
show("attachCommand(system-deep-loop, single review, 'what did /deep:ai-council decide')", m.attachCommand('system-deep-loop', single('review'), 'what did /deep:ai-council decide'));
show("attachCommand(system-deep-loop, single review, 'run /deep:review now')", m.attachCommand('system-deep-loop', single('review'), 'run /deep:review now'));
show("typedCommandIn('see /create:skill.md for details')", m.typedCommandIn('see /create:skill.md for details'));
show("typedCommandIn('run /create:skill.')", m.typedCommandIn('run /create:skill.'));
show("typedCommandForTop('sk-doc', 'open /create:readme.md and summarise it')", m.typedCommandForTop('sk-doc', 'open /create:readme.md and summarise it'));
show("'COMMAND_POLICIES' in module", 'COMMAND_POLICIES' in m);
const policies = m.COMMAND_POLICIES ?? {};
show('tracked commands missing from COMMAND_POLICIES', Object.keys(m.TRACKED_COMMANDS).filter((c) => !(c in policies)));
show('needsMode hubs with a command row', Object.keys(m.MODE_COMMANDS).filter((hub) => m.commandRowFor(hub) !== undefined));
