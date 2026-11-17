#!/usr/bin/env node
// Re-checks a list from the repository root before it is committed. The driver
// already gated every file, but the commit must rest on evidence gathered after
// the run: a later run, a manual edit or another session could have touched a
// file since its record was written. The fact check is the one gate not rerun,
// because its verdict is in the record and a second model call would cost as
// much as the first. A restored file counts as a failure, because the list is
// not done until every file is in the layout.
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const { gates, layoutLint, houseCheck, voiceScan, alreadyDone, safeName, ORIG_DIR } = require('./rewrite-driver.cjs');

const ROOT = process.cwd();

function latestRecords(stateFile) {
  const latest = new Map();
  if (!fs.existsSync(stateFile)) return latest;
  for (const line of fs.readFileSync(stateFile, 'utf8').split('\n').filter(Boolean)) {
    const rec = JSON.parse(line);
    latest.set(rec.file, rec);
  }
  return latest;
}

function main() {
  const [listFile, stateArg] = process.argv.slice(2);
  if (!listFile) {
    console.error('usage: wave-verify.cjs <list> [state.jsonl]');
    process.exit(2);
  }
  const stateFile = stateArg || path.join(__dirname, 'state.jsonl');
  const files = fs.readFileSync(listFile, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
  const latest = latestRecords(stateFile);
  const keep = [];
  const unchanged = [];
  const problems = [];
  const restored = [];
  const missing = [];
  let factMisses = 0;

  for (const file of files) {
    const rec = latest.get(file);
    if (!rec) {
      missing.push(file);
      continue;
    }
    const diff = spawnSync('git', ['-c', 'core.fsmonitor=false', 'diff', '--quiet', 'HEAD', '--', file], { cwd: ROOT });
    if (rec.status === 'restored') {
      if (diff.status !== 0) problems.push(`${file}: recorded as restored but differs from HEAD`);
      restored.push(file);
      continue;
    }
    if (rec.status === 'unchanged') {
      const baseline = { layout: layoutLint(file), house: houseCheck(file), voice: voiceScan(file) };
      if (diff.status !== 0) problems.push(`${file}: recorded as unchanged but differs from HEAD`);
      else if (!alreadyDone(baseline)) problems.push(`${file}: recorded as unchanged but not in the layout: ${baseline.layout.problems.slice(0, 3).join(' / ')}`);
      else unchanged.push(file);
      continue;
    }
    const orig = path.join(ORIG_DIR, safeName(file));
    if (!fs.existsSync(orig)) {
      problems.push(`${file}: no saved original to compare against`);
      continue;
    }
    // Before the rewrite is committed the original is HEAD. After it, the
    // original is the commit before the rewrite, which the saved copy holds.
    const original = fs.readFileSync(orig, 'utf8');
    const now = fs.readFileSync(path.join(ROOT, file), 'utf8');
    if (rec.sha256 && crypto.createHash('sha256').update(now).digest('hex') !== rec.sha256) {
      problems.push(`${file}: differs from the text the fact check passed`);
      continue;
    }
    const baseline = { layout: layoutLint(orig), house: houseCheck(orig), voice: voiceScan(orig) };
    const g = gates(file, original, baseline);
    factMisses += g.items.filter((i) => /missing|not in the original|changed or is missing|frontmatter changed/i.test(i)).length;
    if (g.items.length) {
      problems.push(`${file}: ${g.items.join(' | ')}`);
      continue;
    }
    keep.push(file);
  }

  const failures = problems.length + missing.length + restored.length;
  console.log(JSON.stringify({ listed: files.length, pass: keep.length, unchanged: unchanged.length, restored: restored.length, missing: missing.length, problems: problems.length, factMisses, failures }));
  for (const p of problems) console.log(`PROBLEM ${p}`);
  for (const f of restored) console.log(`RESTORED ${f}`);
  for (const f of missing) console.log(`MISSING ${f}`);
  process.exit(failures ? 1 : 0);
}

main();
