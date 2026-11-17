// Run from the repository root: node <this file>
// Feeds hand-built event streams to the transcript scorer's workflowPath and
// hand-built heads to parseOffer, and prints what each returns today. Reads two
// source files and one folder listing, starts nothing and writes nothing. The facts
// `mode`, `policy` and `checkoutDir` are ones the classifier does not read yet.
import { existsSync, readFileSync } from 'node:fs';
import { workflowPath } from '../../../../../../../.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs';
import { parseOffer } from '../../../../../../../.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs';

const event = (seq, kind, fields = {}) => ({ seq, kind, path: null, command: null, text: null, ...fields });
const path = (label, events, facts) => console.log(`${label}: ${workflowPath(events, facts)}`);

path('shell cat of the owner entry document, no write',
  [event(0, 'shell', { command: 'cat .skilled/skills/sk-doc/SKILL.md' })],
  { command: '/create:agent', owner: 'sk-doc', wrote: false });
path('shell cat of the command document, then a write',
  [event(0, 'shell', { command: 'cat .opencode/commands/create/agent.md' }), event(1, 'write', { path: '.opencode/agents/x.md' })],
  { command: '/create:agent', owner: 'sk-doc', wrote: true });
path('read of the Pi prompt mirror, no write',
  [event(0, 'read', { path: '.pi/prompts/create-agent.md' })],
  { command: '/create:agent', owner: 'sk-doc', wrote: false });
path('read of the Codex prompt mirror, no write',
  [event(0, 'read', { path: '.codex/prompts/create-agent.md' })],
  { command: '/create:agent', owner: 'sk-doc', wrote: false });
path('read of another mode under the right hub, then a write',
  [event(0, 'read', { path: '.skilled/skills/sk-doc/sk-create-readme/SKILL.md' }), event(1, 'write', { path: '.opencode/agents/x.md' })],
  { command: '/create:agent', owner: 'sk-doc', wrote: true, mode: 'sk-create-agent' });
path('temp-file write, then the owner entry document, then a repository write',
  [event(0, 'write', { path: '/tmp/notes.txt', command: 'echo x > /tmp/notes.txt' }), event(1, 'read', { path: '.skilled/skills/sk-doc/SKILL.md' }), event(2, 'write', { path: 'README.md' })],
  { command: '/create:readme', owner: 'sk-doc', wrote: true, mode: 'sk-create-readme', checkoutDir: '/repo' });
path('ask row, the model asked and wrote nothing',
  [event(0, 'text', { text: 'COMMAND: [/deep:review] → offered\nDo you want me to start /deep:review on the parser?' })],
  { command: '/deep:review', owner: 'system-deep-loop', wrote: false, mode: 'review', policy: 'ask' });

const ambiguous = 'Advisor: live; ambiguous: sk-code 0.95/0.12 vs sk-doc → /create:manual-testing-playbook (start) 0.82/0.12 pass.';
console.log(`parseOffer on a head whose command belongs to the partner: ${JSON.stringify(parseOffer(ambiguous))}`);

const offerSource = readFileSync('.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs', 'utf8');
const briefPattern = new RegExp(offerSource.match(/const BRIEF_PATTERN = \/(.+)\/;/)[1]);
console.log(`brief pattern matches the no-match fallback head: ${briefPattern.test('Advisor: no skill matched.')}`);
console.log(`brief pattern matches a tool result that quotes a head: ${briefPattern.test(JSON.stringify({ role: 'tool', content: 'the hook prints "Advisor: live; use sk-doc 0.95/0.12 pass."' }))}`);

const assets = '.skilled/commands/create/assets';
console.log(`create-sk-skill-confirm.yaml exists: ${existsSync(`${assets}/create-sk-skill-confirm.yaml`)}`);
console.log(`create-skill-confirm.yaml exists: ${existsSync(`${assets}/create-skill-confirm.yaml`)}`);
