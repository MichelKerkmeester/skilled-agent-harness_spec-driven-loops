#!/usr/bin/env node
// Sets aside every modified changelog that does not belong to the commit being
// made, and puts them back afterwards. The trigger index reads every changelog in
// the working tree, so it must be rebuilt while only committed content is present.
// The shared git stash is not used, because other sessions push and pop it.
// Run from the repository root, only while no rewrite driver is running.
//
// Only files named in the target lists are parked. A modified changelog outside
// those lists belongs to someone else, so it is reported and left alone.
// A parked file whose committed version moved while it was parked is not put
// back, because copying it back would silently revert that newer commit.
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const HERE = __dirname;
const ROOT = process.cwd();
const LISTS_DIR = path.join(HERE, 'lists');
const PARK_DIR = path.join(HERE, 'parked');
const LEDGER = path.join(PARK_DIR, 'ledger.json');

function git(args) {
  const r = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')} failed: ${r.stderr.trim()}`);
  return r.stdout;
}

function headBlob(file) {
  const r = spawnSync('git', ['rev-parse', `HEAD:${file}`], { cwd: ROOT, encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : null;
}

function readList(file) {
  return fs.readFileSync(file, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
}

function safeName(file) {
  return file.replace(/\//g, '__');
}

function park(keepFile) {
  if (fs.existsSync(LEDGER)) throw new Error('files are already parked; restore them first');
  const keep = new Set(readList(keepFile));
  const targets = new Set();
  for (const name of fs.readdirSync(LISTS_DIR).filter((n) => n.endsWith('.txt'))) {
    for (const f of readList(path.join(LISTS_DIR, name))) targets.add(f);
  }
  const modified = git(['diff', '--name-only', 'HEAD', '--', '.skilled/skills'])
    .split('\n').filter((f) => /\/changelogs?\//.test(f));
  const foreign = modified.filter((f) => !targets.has(f));
  const parked = modified.filter((f) => targets.has(f) && !keep.has(f));
  fs.mkdirSync(PARK_DIR, { recursive: true });
  const ledger = [];
  for (const f of parked) {
    fs.copyFileSync(path.join(ROOT, f), path.join(PARK_DIR, safeName(f)));
    ledger.push({ file: f, headBlob: headBlob(f) });
  }
  fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 2));
  if (parked.length) git(['checkout', 'HEAD', '--', ...parked]);
  for (const f of foreign) console.log(`FOREIGN ${f} (modified, not a target, left in place)`);
  console.log(`parked ${parked.length}`);
}

function restore() {
  if (!fs.existsSync(LEDGER)) {
    console.log('nothing parked');
    return;
  }
  const ledger = JSON.parse(fs.readFileSync(LEDGER, 'utf8'));
  const restored = [];
  const held = [];
  for (const { file, headBlob: parkedAgainst } of ledger) {
    if (headBlob(file) !== parkedAgainst) {
      held.push(file);
      continue;
    }
    fs.copyFileSync(path.join(PARK_DIR, safeName(file)), path.join(ROOT, file));
    fs.unlinkSync(path.join(PARK_DIR, safeName(file)));
    restored.push(file);
  }
  if (restored.length) git(['reset', '-q', '--', ...restored]);
  for (const f of held) console.log(`HELD ${f} (its committed version changed while parked; copy kept in parked/)`);
  if (held.length) {
    fs.writeFileSync(LEDGER, JSON.stringify(ledger.filter((e) => held.includes(e.file)), null, 2));
    console.log(`restored ${restored.length}, held ${held.length}`);
    process.exit(1);
  }
  fs.unlinkSync(LEDGER);
  console.log(`restored ${restored.length}`);
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === 'park' && arg) park(arg);
else if (cmd === 'restore') restore();
else {
  console.error('usage: wave-park.cjs park <keep-list> | restore');
  process.exit(2);
}
