#!/usr/bin/env node
// Re-checks one skill's wave from the repository root before it is committed.
// The driver already gated every file, but the commit must rest on evidence
// gathered after the run: a later run, a manual edit or another session could
// have touched a file since its record was written.
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const HERE = __dirname;
const ROOT = process.cwd();
const CHECKER = path.join(HERE, 'check_changelog_shape.py');
const HVR = '.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py';

// Must match the driver's naming, since this reads the originals the driver saved.
function safeName(file) {
  return file.replace(/[^A-Za-z0-9._-]+/g, '__');
}

function frontmatter(text) {
  const m = text.match(/^---\n[\s\S]*?\n---\n/);
  return m ? m[0] : '';
}

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
  const failed = [];
  const missing = [];

  for (const file of files) {
    const rec = latest.get(file);
    if (!rec) {
      missing.push(file);
      continue;
    }
    const diff = spawnSync('git', ['diff', '--quiet', 'HEAD', '--', file], { cwd: ROOT });
    if (rec.status === 'fail') {
      if (diff.status !== 0) problems.push(`${file}: recorded as failed but differs from HEAD`);
      failed.push(file);
      continue;
    }
    const orig = path.join(HERE, 'orig', safeName(file));
    if (!fs.existsSync(orig)) {
      problems.push(`${file}: no saved original to compare against`);
      continue;
    }
    if (diff.status === 0) {
      problems.push(`${file}: recorded as a pass but identical to HEAD`);
      continue;
    }
    const shape = spawnSync('python3', [CHECKER, file, '--old', orig], { cwd: ROOT, encoding: 'utf8' });
    if (shape.status !== 0) {
      let errs = [];
      try { errs = JSON.parse(shape.stdout).errors; } catch { errs = [shape.stdout.trim()]; }
      problems.push(`${file}: checker exit ${shape.status}: ${errs.join(' | ')}`);
      continue;
    }
    const hvr = spawnSync('python3', [HVR, file], { cwd: ROOT, encoding: 'utf8' });
    const hard = (hvr.stdout.match(/hard blockers:\s+(\d+)/) || [])[1];
    if (hard !== '0') {
      problems.push(`${file}: HVR hard blockers ${hard === undefined ? 'unreadable' : hard}`);
      continue;
    }
    if (frontmatter(fs.readFileSync(path.join(ROOT, file), 'utf8')) !== frontmatter(fs.readFileSync(orig, 'utf8'))) {
      problems.push(`${file}: frontmatter differs from the saved original`);
      continue;
    }
    keep.push(file);
  }

  console.log(JSON.stringify({ listed: files.length, keep: keep.length, failed: failed.length, missing: missing.length, problems: problems.length }));
  for (const p of problems) console.log(`PROBLEM ${p}`);
  for (const f of failed) console.log(`FAILED ${f}`);
  for (const f of missing) console.log(`MISSING ${f}`);
  for (const f of keep) console.log(`KEEP ${f}`);
  process.exit(problems.length || missing.length ? 1 : 0);
}

main();
