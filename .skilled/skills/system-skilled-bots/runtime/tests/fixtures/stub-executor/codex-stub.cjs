'use strict';

// A stand-in for the codex binary, put first on PATH by the runner tests so
// the real deep-loop command builder, environment filter and audited spawn
// run end to end while no model is ever called. It reads the prompt from
// stdin, as codex does, and acts on `STUB:` directive lines in it. It leaves
// a receipt under $HOME so a test can see whether it ran and what it saw.

const fs = require('node:fs');
const path = require('node:path');

if (process.argv.includes('--version')) {
  process.stdout.write('codex-cli 0.0.0-stub\n');
  process.exit(0);
}

const home = process.env.HOME || '/nonexistent';
const prompt = fs.readFileSync(0, 'utf8');
const runId = process.env.SKILLED_BOT_RUN_ID || 'no-run-marker';

fs.mkdirSync(path.join(home, 'stub-receipts'), { recursive: true });
// Written through a rename so a test polling for the receipt never parses a half-written file.
const receiptPath = path.join(home, 'stub-receipts', `${runId}.json`);
fs.writeFileSync(`${receiptPath}.tmp`, JSON.stringify({ pid: process.pid, argv: process.argv.slice(2), cwd: process.cwd(), env: process.env, prompt }));
fs.renameSync(`${receiptPath}.tmp`, receiptPath);

function directive(name) {
  const line = prompt.split('\n').find((entry) => entry.startsWith(`STUB:${name}`));
  return line === undefined ? null : line.slice(`STUB:${name}`.length).replace(/^=/, '');
}

function sleepSeconds(seconds, unlessFlag) {
  const until = Date.now() + seconds * 1000;
  const cell = new Int32Array(new SharedArrayBuffer(4));
  while (Date.now() < until) {
    if (unlessFlag && fs.existsSync(path.join(home, 'fast-flag'))) return;
    Atomics.wait(cell, 0, 0, 100);
  }
}

const tamper = directive('tamper');
if (tamper !== null) {
  // Try every path the checkout and the child's own environment can reach.
  const walk = (dir, depth) => {
    if (depth > 6) return;
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'switches' || entry.name === 'needs-you') fs.rmSync(full, { recursive: true, force: true });
        else walk(full, depth + 1);
      }
    }
  };
  walk(process.cwd(), 0);
  for (const key of ['XDG_STATE_HOME']) {
    if (process.env[key]) fs.rmSync(path.join(process.env[key], 'system-skilled-bots'), { recursive: true, force: true });
  }
  fs.mkdirSync(path.join(process.cwd(), 'needs-you'), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), 'needs-you', 'forged.json'), '{"forged":true}');
}

const sleep = directive('sleep');
if (sleep !== null) sleepSeconds(Number(sleep), false);
const sleepUnlessFlag = directive('sleep-unless-flag');
if (sleepUnlessFlag !== null) sleepSeconds(Number(sleepUnlessFlag), true);

// STUB:park-edit=<file> edits its working folder and asks; once the prompt
// carries an answer it requires that edit to still be there, the way a
// resumed run continues parked work, and exits 7 when it is gone.
const parkEdit = directive('park-edit');
if (parkEdit !== null) {
  const edited = path.join(process.cwd(), parkEdit);
  if (!prompt.split('\n').some((line) => line.startsWith('Answer: '))) {
    fs.writeFileSync(edited, 'parked work\n');
    process.stdout.write(`edited ${parkEdit}\n[NEEDS-DECISION] Keep the parked edit?\n`);
    process.exit(0);
  }
  if (!fs.existsSync(edited)) {
    process.stdout.write(`parked edit ${parkEdit} missing from ${process.cwd()}\n`);
    process.exit(7);
  }
  fs.writeFileSync(`${edited}.resumed`, 'continued\n');
  process.stdout.write(`continued ${parkEdit}\nstub done\n`);
  process.exit(0);
}

if (directive('decide-empty') !== null) process.stdout.write('[NEEDS-DECISION] \n');
const decide = directive('decide');
if (decide !== null) {
  process.stdout.write(`working...\n[NEEDS-DECISION] ${decide}\n`);
  const options = prompt.split('\n').filter((line) => line.startsWith('STUB:option=')).map((line) => line.slice('STUB:option='.length));
  for (const option of options) process.stdout.write(`[OPTION] ${option}\n`);
}

process.stdout.write('stub done\n');
const exitCode = directive('exit');
process.exit(exitCode === null ? 0 : Number(exitCode));
