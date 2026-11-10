#!/usr/bin/env node
// Append phrases to a skill's authored graph-metadata.json intent_signals, or
// remove them with --remove. usage: add-signals.cjs [--remove] <skill> <phrase>...
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const args = process.argv.slice(2);
const remove = args[0] === '--remove';
if (remove) args.shift();
const [skill, ...phrases] = args;
const file = path.join(ROOT, '.skilled', 'skills', skill, 'graph-metadata.json');
const meta = JSON.parse(fs.readFileSync(file, 'utf8'));
const have = new Set(meta.intent_signals.map((s) => s.toLowerCase()));
if (remove) {
  const drop = new Set(phrases.map((p) => p.toLowerCase()));
  meta.intent_signals = meta.intent_signals.filter((s) => !drop.has(s.toLowerCase()));
} else {
  for (const p of phrases) if (!have.has(p.toLowerCase())) meta.intent_signals.push(p);
}
fs.writeFileSync(file, `${JSON.stringify(meta, null, 2)}\n`);
process.stdout.write(`${skill}: intent_signals=${meta.intent_signals.length}\n`);
