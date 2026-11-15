#!/usr/bin/env node
// Re-checks a wave from the repository root before it is committed. The driver
// already gated every file, but the commit must rest on evidence gathered after
// the run: a later run, a manual edit or another session could have touched a
// file since its record was written. The fact check is the one gate not rerun,
// because its verdict is in the record and a second model call would cost as
// much as the first.
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { gates, houseCheck, voiceScan, safeName, ORIG_DIR } = require('./rewrite-driver.cjs');

const ROOT = process.cwd();

function latestRecords(stateFile) {
  const latest = new Map();
  for (const line of fs.readFileSync(stateFile, 'utf8').split('\n').filter(Boolean)) {
    const rec = JSON.parse(line);
    latest.set(rec.file, rec);
  }
  return latest;
}

function main() {
  const [listFile, stateFile] = process.argv.slice(2);
  if (!listFile || !stateFile) {
    console.error('usage: wave-verify.cjs <list> <state.jsonl>');
    process.exit(2);
  }
  const files = fs.readFileSync(listFile, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
  const latest = latestRecords(stateFile);
  const keep = [];
  const problems = [];
  const restored = [];
  const missing = [];

  for (const file of files) {
    const rec = latest.get(file);
    if (!rec) {
      missing.push(file);
      continue;
    }
    const diff = spawnSync('git', ['-c', 'core.fsmonitor=false', 'diff', '--quiet', 'HEAD', '--', file], { cwd: ROOT });
    if (rec.status === 'restored' || rec.status === 'unchanged') {
      if (diff.status !== 0) problems.push(`${file}: recorded as ${rec.status} but differs from HEAD`);
      restored.push(file);
      continue;
    }
    const orig = path.join(ORIG_DIR, safeName(file));
    if (!fs.existsSync(orig)) {
      problems.push(`${file}: no saved original to compare against`);
      continue;
    }
    const head = spawnSync('git', ['-c', 'core.fsmonitor=false', 'show', `HEAD:${file}`], { cwd: ROOT, encoding: 'utf8' });
    if (head.status !== 0 || head.stdout !== fs.readFileSync(orig, 'utf8')) {
      problems.push(`${file}: the saved original is not the file at HEAD`);
      continue;
    }
    if (diff.status === 0) {
      problems.push(`${file}: recorded as a pass but identical to HEAD`);
      continue;
    }
    const now = fs.readFileSync(path.join(ROOT, file), 'utf8');
    if (rec.sha256 && require('crypto').createHash('sha256').update(now).digest('hex') !== rec.sha256) {
      problems.push(`${file}: differs from the text the fact check passed`);
      continue;
    }
    const baseline = { house: houseCheck(orig), voice: voiceScan(orig) };
    const g = gates(file, head.stdout, baseline);
    if (g.items.length) {
      problems.push(`${file}: ${g.items.join(' | ')}`);
      continue;
    }
    keep.push(file);
  }

  console.log(JSON.stringify({ listed: files.length, keep: keep.length, restored: restored.length, missing: missing.length, problems: problems.length }));
  for (const p of problems) console.log(`PROBLEM ${p}`);
  for (const f of restored) console.log(`RESTORED ${f}`);
  for (const f of missing) console.log(`MISSING ${f}`);
  for (const f of keep) console.log(`KEEP ${f}`);
  process.exit(problems.length || missing.length ? 1 : 0);
}

main();
