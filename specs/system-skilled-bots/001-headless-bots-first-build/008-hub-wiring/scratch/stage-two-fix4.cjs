#!/usr/bin/env node
'use strict';

// Replays the stage-two prompts through the compiled front door after the
// review 3 fix and prints one JSON line per prompt with the gold beside the
// verbatim front-door output. Read only.
// Usage: node stage-two-fix4.cjs <repo-root>

const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = process.argv[2];
if (!root) {
  process.stderr.write('usage: stage-two-fix4.cjs <repo-root>\n');
  process.exit(2);
}

const cases = [
  ['gate', 'author', 'write a new BOT.md for a nightly dependency check bot'],
  ['gate', 'run', 'run the nightly-digest bot by hand'],
  ['gate', 'schedule', 'install the launchd schedule for my nightly-digest bot'],
  ['gate', 'status', 'show me the status of my bots and their last runs'],
  ['gate', 'status', 'what is waiting in my bots inbox'],
  ['gate', 'run', "answer the release bot's needs-you question"],
  ['gate', 'run', "answer the bot's open question with yes"],
  ['new', 'run', 'run my nightly bot'],
  ['new', 'run', 'kick off the nightly-digest bot'],
  ['new', 'run', 'run the nightly bot now'],
  ['new', 'schedule', 'pause the nightly-digest bot'],
  ['new', 'schedule', 'install the schedule for the nightly-digest bot'],
  ['ood', 'defer', 'run the tests'],
  ['ood', 'defer', 'status of the build'],
  ['ood', 'defer', 'author a skill'],
  ['ood', 'defer', 'schedule a meeting for tomorrow'],
  ['ood', 'defer', 'update skilled now'],
  ['ood', 'defer', 'is my skilled install healthy'],
  ['ood', 'defer', 'schedule this bot and show its status'],
  ['ood', 'defer', 'answer this question'],
  ['ood', 'defer', 'check my email inbox'],
  ['ood', 'defer', 'answer the open question'],
  ['ood', 'defer', 'answer the open ticket'],
  ['ood', 'defer', 'answer my open questions'],
];

let failures = 0;
for (const [kind, gold, prompt] of cases) {
  let raw;
  let exit = 0;
  try {
    raw = execFileSync('node', [path.join(root, '.skilled/bin/compiled-route.cjs'), '--hub', 'system-skilled-bots', '--prompt', prompt], { encoding: 'utf8' }).trim();
  } catch (error) {
    exit = error.status;
    raw = String(error.stdout || '').trim();
  }
  let decision = {};
  try {
    decision = JSON.parse(raw);
  } catch {
    decision = {};
  }
  const modes = (decision.targets || []).map((target) => target.workflowMode);
  const got = decision.action === 'route' ? modes.join('+') : decision.action || 'unparsed';
  const match = got === gold;
  if (!match) failures += 1;
  process.stdout.write(`${JSON.stringify({ kind, gold, prompt, got, match, exit, frontDoor: decision })}\n`);
}
process.exit(failures === 0 ? 0 : 1);
