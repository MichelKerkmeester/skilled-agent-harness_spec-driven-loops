#!/usr/bin/env node
// Recomputes the always-run workflow cost table and the merge bounds from the
// saved run snapshot. Billing rule: ceil(job seconds / 60) per non-skipped job.
// Usage: node consolidation-cost.mjs          writes consolidation-cost.json and .md
//        node consolidation-cost.mjs --check  recomputes and compares with the stored JSON

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const WINDOW = join(HERE, 'window.json');
const JOBS_DIR = join(HERE, 'jobs');
const OUT_JSON = join(HERE, 'consolidation-cost.json');
const OUT_MD = join(HERE, 'consolidation-cost.md');

// The nine always-run workflows and the display names of their 13 jobs, as the
// tree's YAML declares them. A job missing from every sample is reported as no-sample.
const EXPECTED = {
  'advisory-checks.yml': ['Advisory \u2014 test suites and doc-model references'],
  'changed-packet-validation.yml': ['Spec packets touched by this PR validate clean'],
  'command-tree-parity.yml': [
    'OpenCode and Claude command trees stay identical',
    'Hermes skill and prompt copies match their sources',
  ],
  'dispatch-enforcement-guard.yml': [
    'Every declared dispatch rule is reachable and discriminates',
    'Every hook vitest suite passes',
  ],
  'gate-inputs.yml': ['Every gate input resolves under both source roots'],
  'message-contract.yml': ['Commit messages, branch names and PR description follow the templates'],
  'playbook-operator-contract.yml': ['Manual-testing-playbook operator-scenario contract'],
  'rule-canary-sync.yml': ['Load-bearing rule wording stays in sync across copies'],
  'sk-doc-script-tests.yml': [
    'sk-doc script tests',
    'Feature catalog packages validate',
    'No new broken citations',
  ],
};
const WORKFLOWS = Object.keys(EXPECTED);
// The candidate set the phase plan fixes: every always-run workflow except the
// message contract, whose context the ruleset requires.
const FRESHNESS_PLAN = WORKFLOWS.filter((w) => w !== 'message-contract.yml');
// The same set as the tree's switches assign it: command-tree-parity reads the
// tests switch and carries a push path filter, so a merge including it crosses groups.
const FRESHNESS_SWITCHED = FRESHNESS_PLAN.filter((w) => w !== 'command-tree-parity.yml');

const round2 = (x) => Math.round(x * 100) / 100;

function median(values) {
  if (values.length === 0) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function readJson(file) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(file, 'utf8'));
  } catch (err) {
    throw new Error(`cannot parse ${file}: ${err.message}`);
  }
  return parsed;
}

function seconds(start, end) {
  return (Date.parse(end) - Date.parse(start)) / 1000;
}

function compute() {
  if (!existsSync(WINDOW)) throw new Error(`missing ${WINDOW}`);
  const window = readJson(WINDOW);
  if (!window.perWorkflow || typeof window.perWorkflow !== 'object') {
    throw new Error('window.json has no perWorkflow object');
  }
  const names = Object.keys(window.perWorkflow).sort();
  if (JSON.stringify(names) !== JSON.stringify([...WORKFLOWS].sort())) {
    throw new Error(`window.json perWorkflow must name exactly the nine workflows, got ${names.join(', ')}`);
  }

  const workflows = [];
  const jobs = [];
  const allCheckouts = [];
  const excluded = { skippedJobs: 0, noTimestampJobs: 0, emptyRuns: 0, perWorkflow: {} };

  for (const wf of WORKFLOWS) {
    const { hours } = window.perWorkflow[wf];
    if (typeof hours !== 'number' || hours <= 0) throw new Error(`${wf}: hours must be a positive number`);
    const dir = join(JOBS_DIR, wf);
    const files = readdirSync(dir).filter((f) => f.endsWith('.json') && f !== 'index.json').sort();
    const runTotals = [];
    const perJob = new Map(EXPECTED[wf].map((n) => [n, { seconds: [], conclusions: [], checkouts: [], runIds: [] }]));
    const ex = { skippedJobs: 0, noTimestampJobs: 0, emptyRuns: 0 };

    for (const f of files) {
      const run = readJson(join(dir, f));
      if (!Array.isArray(run.jobs)) throw new Error(`${wf}/${f}: no jobs array`);
      const runId = f.replace(/\.json$/, '');
      let billed = 0;
      let counted = 0;
      for (const job of run.jobs) {
        if (typeof job.name !== 'string') throw new Error(`${wf}/${f}: job without a name`);
        if (job.conclusion === 'skipped') { ex.skippedJobs += 1; continue; }
        if (!job.startedAt || !job.completedAt) { ex.noTimestampJobs += 1; continue; }
        const s = seconds(job.startedAt, job.completedAt);
        billed += Math.ceil(s / 60);
        counted += 1;
        if (!perJob.has(job.name)) perJob.set(job.name, { seconds: [], conclusions: [], checkouts: [], runIds: [], unexpected: true });
        const rec = perJob.get(job.name);
        rec.seconds.push(s);
        rec.conclusions.push(job.conclusion);
        rec.runIds.push(runId);
        for (const step of job.steps || []) {
          if (/actions\/checkout/.test(step.name) && !/^Post /.test(step.name) && step.startedAt && step.completedAt) {
            const cs = seconds(step.startedAt, step.completedAt);
            rec.checkouts.push(cs);
            allCheckouts.push(cs);
          }
        }
      }
      if (counted === 0) { ex.emptyRuns += 1; continue; }
      runTotals.push(billed);
    }

    const runs = files.length;
    const medianBilled = median(runTotals);
    const runsPerDay = round2((runs * 24) / hours);
    workflows.push({
      workflow: wf,
      runs,
      sampledRuns: runTotals.length,
      hours,
      medianBilled,
      runsPerDay,
      billedPerDay: medianBilled === null ? null : round2(medianBilled * runsPerDay),
    });

    for (const [name, rec] of perJob) {
      const n = rec.seconds.length;
      const flags = [];
      if (n === 0) flags.push('no-sample');
      else if (rec.conclusions.every((c) => c === 'failure')) flags.push('failed-only');
      if (n > 0 && rec.checkouts.length === 0) flags.push('no-checkout');
      if (n > 0 && n < 20) flags.push('thin');
      if (rec.unexpected) flags.push('unexpected-name');
      const medianSeconds = median(rec.seconds);
      // The newest sampled run id, so a reader can open one run behind the median.
      const newestRunId = rec.runIds.length ? rec.runIds.map(Number).sort((a, b) => b - a)[0] : null;
      jobs.push({
        workflow: wf,
        job: name,
        samples: n,
        medianSeconds,
        medianBilled: medianSeconds === null ? null : Math.ceil(medianSeconds / 60),
        checkoutMedianSeconds: median(rec.checkouts),
        newestRunId,
        flags,
      });
    }
    excluded.skippedJobs += ex.skippedJobs;
    excluded.noTimestampJobs += ex.noTimestampJobs;
    excluded.emptyRuns += ex.emptyRuns;
    excluded.perWorkflow[wf] = ex;
  }

  const checkoutSeconds = median(allCheckouts);
  const checkout = { seconds: checkoutSeconds, samples: allCheckouts.length, min: Math.min(...allCheckouts), max: Math.max(...allCheckouts) };

  function bound(set) {
    const members = jobs.filter((j) => set.includes(j.workflow) && j.medianSeconds !== null);
    const sumSeconds = round2(members.reduce((a, j) => a + j.medianSeconds, 0));
    const removedCheckouts = members.length - 1;
    const mergedSeconds = round2(sumSeconds - removedCheckouts * checkoutSeconds);
    const mergedBilled = Math.ceil(mergedSeconds / 60);
    const currentBilled = members.reduce((a, j) => a + j.medianBilled, 0);
    const savingPerPush = currentBilled - mergedBilled;
    const wfs = workflows.filter((w) => set.includes(w.workflow));
    const maxRunsPerDay = Math.max(...wfs.map((w) => w.runsPerDay));
    const currentPerDay = round2(wfs.reduce((a, w) => a + (w.billedPerDay || 0), 0));
    const mergedPerDay = round2(mergedBilled * maxRunsPerDay);
    return {
      workflows: set.length,
      jobs: members.length,
      sumSeconds,
      removedCheckouts,
      mergedSeconds,
      mergedBilled,
      currentBilled,
      savingPerPush,
      maxRunsPerDay,
      savingPerDay: round2(savingPerPush * maxRunsPerDay),
      currentPerDay,
      mergedPerDay,
      savingPerDayRateAware: round2(currentPerDay - mergedPerDay),
      longestJobSeconds: Math.max(...members.map((j) => j.medianSeconds)),
    };
  }

  return {
    window: { start: window.start, end: window.end, hours: window.hours },
    workflows,
    jobs,
    checkout,
    bounds: {
      review: bound(WORKFLOWS),
      freshness: bound(FRESHNESS_PLAN),
      freshnessSwitched: bound(FRESHNESS_SWITCHED),
    },
    excluded,
  };
}

function renderMd(r) {
  const L = [];
  L.push('# Consolidation cost (post-change snapshot)', '');
  L.push(`Generated by \`node scratch/consolidation-cost.mjs\` from \`scratch/window.json\` and \`scratch/jobs/\`. Billed minutes are ceil(seconds / 60) per non-skipped job; per-day figures are runs x 24 / hours, with each workflow's own hours from \`window.json\`.`, '');
  L.push('## Workflows', '');
  L.push('| Workflow | Runs | Median billed/run | Runs/day | Billed/day |');
  L.push('|---|---|---|---|---|');
  for (const w of r.workflows) L.push(`| \`${w.workflow}\` | ${w.runs} | ${w.medianBilled} | ${w.runsPerDay} | ${w.billedPerDay} |`);
  const totRuns = r.workflows.reduce((a, w) => a + w.runs, 0);
  const totBilled = r.workflows.reduce((a, w) => a + w.medianBilled, 0);
  const totDay = round2(r.workflows.reduce((a, w) => a + w.billedPerDay, 0));
  L.push(`| **Total** | **${totRuns}** | **${totBilled} per push** | - | **${totDay}** |`, '');
  L.push('## Jobs', '');
  L.push('| Workflow | Job | Median seconds | Median billed | Checkout |');
  L.push('|---|---|---|---|---|');
  for (const j of r.jobs) {
    const flags = j.flags.length ? `, ${j.flags.join(', ')}` : '';
    L.push(`| \`${j.workflow}\` | ${j.job.replace(/\u2014/g, '-')} | ${j.medianSeconds} (n ${j.samples}, run id: ${j.newestRunId}) | ${j.medianBilled} | ${j.checkoutMedianSeconds} s${flags} |`);
  }
  const sumS = round2(r.jobs.reduce((a, j) => a + (j.medianSeconds || 0), 0));
  const sumB = r.jobs.reduce((a, j) => a + (j.medianBilled || 0), 0);
  L.push(`| **Total** | **${r.jobs.length} jobs** | **${sumS}** | **${sumB}** | median ${r.checkout.seconds} s over ${r.checkout.samples} checkouts |`, '');
  L.push('## Bounds', '');
  for (const [k, b] of Object.entries(r.bounds)) {
    L.push(`- \`${k}\`: ${b.workflows} workflows, ${b.jobs} jobs, ${b.sumSeconds} s - ${b.removedCheckouts} x ${r.checkout.seconds} s = ${b.mergedSeconds} s = ${b.mergedBilled} billed against ${b.currentBilled}, saving ${b.savingPerPush} per push; x ${b.maxRunsPerDay} runs/day = ${b.savingPerDay} runner-min/day. Rate-aware: ${b.currentPerDay} today against ${b.mergedPerDay} merged = ${b.savingPerDayRateAware} runner-min/day. Longest single job today ${b.longestJobSeconds} s.`);
  }
  L.push('', `Excluded and counted: ${r.excluded.skippedJobs} skipped jobs, ${r.excluded.noTimestampJobs} jobs with no timestamps, ${r.excluded.emptyRuns} runs with no counted job.`, '');
  return L.join('\n');
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

const result = compute();
if (process.argv.includes('--check')) {
  if (!existsSync(OUT_JSON)) { console.error(`missing ${OUT_JSON}`); process.exit(1); }
  const stored = readJson(OUT_JSON);
  if (!deepEqual(JSON.parse(JSON.stringify(result)), stored)) {
    console.error('check: mismatch between the stored consolidation-cost.json and the recomputation');
    process.exit(1);
  }
  console.log('check: ok');
  process.exit(0);
}
writeFileSync(OUT_JSON, JSON.stringify(result, null, 2).replace(/\u2014/g, '\\u2014') + '\n');
writeFileSync(OUT_MD, renderMd(result));
console.log(`wrote ${OUT_JSON} and ${OUT_MD}`);
