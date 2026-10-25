#!/usr/bin/env node
// Sizes a timeout for every workflow job from its own job-level samples.
//
//   node size-timeouts.mjs [--floor <minutes>]   print the sizing table
//   node size-timeouts.mjs --assert [--floor <n>] compare the tree with the table
//
// Inputs, both written by the sampling step and kept beside this script:
//   runs/<workflow>.json   the run list for one workflow file
//   jobs/<run-id>.json     `gh run view <id> --json databaseId,conclusion,jobs`
//
// A sample is one job's own startedAt to completedAt, never a run's wall time,
// because timeout-minutes counts execution and a run's clock includes queueing.
//
// Per job:
//   successful samples >= 1   p50 = median, p100 = maximum, over successes only
//   no success, some failure  sized from the failed samples, marked failed-only
//   no sample at all          takes the floor, marked no-sample
//   fewer than 5 successes    marked thin
//   formula = max(ceil(3 x p50 minutes), ceil(2 x p100 minutes))
//   final   = max(floor, formula)
//
// The median of an even count is the mean of the two middle values. All
// arithmetic runs on integer seconds, so a ceil never lands on a float error.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const runsDir = path.join(here, 'runs');
const jobsDir = path.join(here, 'jobs');

function findRepoRoot(start) {
  let dir = start;
  for (;;) {
    if (fs.existsSync(path.join(dir, '.github', 'workflows'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) throw new Error('no .github/workflows above ' + start);
    dir = parent;
  }
}
const root = findRepoRoot(here);
const workflowsDir = path.join(root, '.github', 'workflows');

const args = process.argv.slice(2);
const assertMode = args.includes('--assert');
const floorAt = args.indexOf('--floor');

function recordedFloor() {
  const decisions = path.join(here, '..', 'decisions.md');
  if (!fs.existsSync(decisions)) return 10;
  const m = /^D6=(\d+)$/m.exec(fs.readFileSync(decisions, 'utf8'));
  return m ? Number(m[1]) : 10;
}
const floor = floorAt >= 0 ? Number(args[floorAt + 1]) : recordedFloor();
if (!Number.isInteger(floor) || floor < 1) {
  console.error('floor must be a positive integer, got ' + (args[floorAt + 1] ?? '(none)'));
  process.exit(2);
}

// The tree: every (workflow file, job id, name, timeout) in file order. Job keys
// sit at two spaces and job properties at four, which every workflow here follows.
function readTree() {
  const jobs = [];
  for (const file of fs.readdirSync(workflowsDir).filter((f) => f.endsWith('.yml')).sort()) {
    const lines = fs.readFileSync(path.join(workflowsDir, file), 'utf8').split('\n');
    const start = lines.findIndex((l) => l.startsWith('jobs:'));
    if (start < 0) continue;
    let cur = null;
    for (let i = start + 1; i < lines.length; i += 1) {
      const line = lines[i];
      if (line !== '' && !line.startsWith(' ') && !line.startsWith('#')) break;
      const key = /^  ([A-Za-z0-9_-]+):\s*$/.exec(line);
      if (key) {
        cur = { file, id: key[1], name: null, timeout: null };
        jobs.push(cur);
        continue;
      }
      if (!cur) continue;
      const name = /^    name:\s*(.*?)\s*$/.exec(line);
      if (name && cur.name === null) cur.name = name[1];
      const timeout = /^    timeout-minutes:\s*(\d+)\s*$/.exec(line);
      if (timeout) cur.timeout = Number(timeout[1]);
    }
  }
  return jobs;
}

// The name a runner reports for a job: its name: value, or its id when it has none.
// A matrix expression in the name stands for whatever the leg resolves it to.
function nameMatcher(job) {
  const label = job.name ?? job.id;
  const source = label
    .split(/\$\{\{[^}]*\}\}/)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('.+');
  return new RegExp('^' + source + '$');
}

const seconds = (job) => {
  const start = Date.parse(job.startedAt);
  const end = Date.parse(job.completedAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return null;
  if (job.startedAt.startsWith('0001') || job.completedAt.startsWith('0001')) return null;
  return Math.round((end - start) / 1000);
};

function median2(sorted) {
  // Twice the median, as an integer.
  const n = sorted.length;
  return n % 2 ? 2 * sorted[(n - 1) / 2] : sorted[n / 2 - 1] + sorted[n / 2];
}

const tree = readTree();
const byWorkflow = new Map();
for (const job of tree) {
  if (!byWorkflow.has(job.file)) byWorkflow.set(job.file, []);
  byWorkflow.get(job.file).push(job);
}

// Collect samples per (file, job id).
const samples = new Map(tree.map((j) => [j.file + '|' + j.id, { ok: [], failed: [] }]));
const unmatched = new Map();
let runsRead = 0;
let runsWithoutJobData = 0;
for (const listFile of fs.readdirSync(runsDir).filter((f) => f.endsWith('.json'))) {
  const file = listFile.replace(/\.json$/, '.yml');
  const treeJobs = byWorkflow.get(file);
  if (!treeJobs) continue; // a workflow that left the tree
  const matchers = treeJobs.map((j) => [j, nameMatcher(j)]);
  for (const run of JSON.parse(fs.readFileSync(path.join(runsDir, listFile), 'utf8'))) {
    const jobFile = path.join(jobsDir, run.databaseId + '.json');
    if (!fs.existsSync(jobFile)) continue;
    const detail = JSON.parse(fs.readFileSync(jobFile, 'utf8'));
    if (!detail.jobs || detail.jobs.length === 0) {
      runsWithoutJobData += 1;
      continue;
    }
    runsRead += 1;
    for (const jobRun of detail.jobs) {
      const hit = matchers.filter(([, re]) => re.test(jobRun.name));
      if (hit.length !== 1) {
        const key = file + ' | ' + jobRun.name + (hit.length > 1 ? ' (ambiguous)' : '');
        const entry = unmatched.get(key) ?? { n: 0, ok: [] };
        entry.n += 1;
        const s = seconds(jobRun);
        if (jobRun.conclusion === 'success' && s !== null) entry.ok.push(s);
        unmatched.set(key, entry);
        continue;
      }
      const s = seconds(jobRun);
      if (s === null) continue;
      const bucket = samples.get(file + '|' + hit[0][0].id);
      if (jobRun.conclusion === 'success') bucket.ok.push(s);
      else if (jobRun.conclusion === 'failure') bucket.failed.push(s);
    }
  }
}

function size(job) {
  const { ok, failed } = samples.get(job.file + '|' + job.id);
  const basis = ok.length > 0 ? ok : failed;
  if (basis.length === 0) {
    return { job, count: 0, p50: null, p100: null, formula: null, final: floor, marker: 'no-sample', ok };
  }
  const sorted = [...basis].sort((a, b) => a - b);
  const p50x2 = median2(sorted); // twice the median seconds
  const p100 = sorted[sorted.length - 1];
  const fromP50 = Math.ceil((3 * p50x2) / 120);
  const fromP100 = Math.ceil((2 * p100) / 60);
  const formula = Math.max(fromP50, fromP100);
  let marker = '';
  if (ok.length === 0) marker = 'failed-only';
  else if (ok.length < 5) marker = 'thin';
  return { job, count: basis.length, p50: p50x2 / 2, p100, formula, final: Math.max(floor, formula), marker, ok };
}

const rows = tree.map(size);
const minutes = (s) => (s === null ? '-' : (s / 60).toFixed(3));

if (!assertMode) {
  const lines = [
    '| workflow | job | samples | p50 | p100 | formula | final | marker | n |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ];
  for (const r of rows) {
    lines.push(
      `| ${r.job.file} | ${r.job.id} | ${r.count} | ${minutes(r.p50)} | ${minutes(r.p100)} | ${r.formula ?? '-'} | ${r.final} | ${r.marker} | ${r.count} |`,
    );
  }
  process.stdout.write(lines.join('\n') + '\n');
  process.stderr.write(
    `floor=${floor} jobs=${rows.length} runs-read=${runsRead} runs-without-job-data=${runsWithoutJobData}\n`,
  );
  for (const [key, e] of [...unmatched].sort()) {
    const best = e.ok.length ? Math.max(...e.ok) : null;
    process.stderr.write(`unmatched ${key} x${e.n}${best === null ? '' : ' max-success-min=' + (best / 60).toFixed(2)}\n`);
  }
  process.exit(0);
}

// --assert: the tree must carry exactly the table's value on every job, and no
// successful sample may use more than half of its job's timeout.
const mismatches = [];
const overHalf = [];
for (const r of rows) {
  if (r.job.timeout !== r.final) {
    mismatches.push(`${r.job.file} ${r.job.id}: tree=${r.job.timeout} table=${r.final}`);
  }
  const limit = r.job.timeout ?? r.final;
  for (const s of r.ok) {
    if (s * 2 > limit * 60) overHalf.push(`${r.job.file} ${r.job.id}: sample ${s}s over half of ${limit} min`);
  }
}
if (mismatches.length > 0) {
  console.log('values match formula: FAILED');
  for (const m of mismatches) console.log('  ' + m);
}
if (overHalf.length > 0) {
  console.log('50% rule: FAILED');
  for (const m of overHalf) console.log('  ' + m);
}
if (mismatches.length === 0) console.log('values match formula: ok');
if (overHalf.length === 0) console.log('50% rule: ok');
process.exit(mismatches.length === 0 && overHalf.length === 0 ? 0 : 1);
