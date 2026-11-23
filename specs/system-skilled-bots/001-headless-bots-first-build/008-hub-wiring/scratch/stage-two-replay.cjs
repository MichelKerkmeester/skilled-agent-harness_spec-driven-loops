#!/usr/bin/env node
'use strict';

// Replays prompts through the bots hub's stage-two keyword block, read only.
//
// The compiled front door serves only hubs that have a compiled engine and an
// activation manifest, and this hub has neither, so it answers every prompt with
// the legacy sentinel. This replay uses the repository's own committed stage-two
// scorer (the one leaf-route-replay.cjs runs over every compiled hub) against
// this hub's root ROUTER.md, so the intent each prompt selects is computed by the
// shared code rather than by hand. It also runs compiled-route.cjs per prompt and
// prints its output verbatim, so the sentinel is on record beside the replay.

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = process.argv[2];
if (!root) {
  process.stderr.write('usage: stage-two-replay.cjs <repo-root>\n');
  process.exit(2);
}
const replay = require(path.join(root, '.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs'));
const routerText = fs.readFileSync(path.join(root, '.skilled/skills/system-skilled-bots/ROUTER.md'), 'utf8');
const router = replay.parseRouter(routerText);

const INTENT_TO_MODE = { AUTHOR: 'author', RUN: 'run', SCHEDULE: 'schedule', STATUS: 'status' };

const prompts = [
  ['mode', 'author', 'author a bot that summarizes open pull requests every morning'],
  ['mode', 'run', 'run the bot nightly-digest now'],
  ['mode', 'schedule', 'schedule a bot to run on weekdays at nine'],
  ['mode', 'status', 'what is the bot status and when was the last bot run'],
  ['explainer', 'status', 'show bot status and the last bot run'],
  ['verb', 'status', 'what do the bots need from me in the bot inbox'],
  ['verb', 'run', "answer the bot's open question with yes"],
  ['tie', 'status+schedule', 'schedule a bot and then check its bot status'],
  ['defer', 'none', 'help with my headless bots'],
  ['ood', 'none', 'run the tests'],
  ['ood', 'none', 'schedule a meeting'],
  ['ood', 'none', 'status of the build'],
  ['ood', 'none', 'author a skill'],
  ['ood', 'none', 'check my email inbox'],
  ['ood', 'none', 'answer this question'],
];

for (const [kind, gold, prompt] of prompts) {
  const scores = replay.scoreIntents(prompt.toLowerCase(), router.intents);
  const selected = replay.selectIntents(scores);
  const modes = selected.map((intent) => INTENT_TO_MODE[intent] || intent);
  let compiled;
  try {
    compiled = execFileSync('node', [path.join(root, '.skilled/bin/compiled-route.cjs'), '--hub', 'system-skilled-bots', '--prompt', prompt], { encoding: 'utf8' }).trim();
  } catch (error) {
    compiled = `ERROR exit=${error.status} ${String(error.stdout || '').trim()}`;
  }
  const nonZero = Object.fromEntries(scores.map((entry) => [entry.intent, entry.score]));
  process.stdout.write(`${JSON.stringify({ kind, gold, prompt, intents: selected, modes, scores: nonZero, compiledRoute: compiled })}\n`);
}
