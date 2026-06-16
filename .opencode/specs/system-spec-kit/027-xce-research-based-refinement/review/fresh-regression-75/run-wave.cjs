#!/usr/bin/env node
'use strict';
// Concurrency-pool wave runner for the 027 fresh-regression-75 review.
// opencode pool (cap 2) + claude pool (cap 3) run CONCURRENTLY over pending seats.
// Batch is INTERLEAVED across executors so both pools stay busy.
// claude seats use per-seat ISOLATED config dirs (run-seat.sh) to avoid the
// shared-config-dir contention hang. Idempotent + retry-safe (failed seats leave no md).

const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const REPO = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const RT = path.join(REPO, '.opencode/specs/system-spec-kit/027-xce-research-based-refinement/review/fresh-regression-75');
const RUNSEAT = path.join(RT, 'run-seat.sh');

function arg(n, d) { const i = process.argv.indexOf(`--${n}`); if (i < 0) return d; const v = process.argv[i + 1]; return v && !v.startsWith('--') ? v : true; }
const batch = parseInt(arg('batch', '1000'), 10);
const opencodeCap = parseInt(arg('opencode-cap', '2'), 10);
const claudeCap = parseInt(arg('claude-cap', '3'), 10);
const claudeTimeout = String(arg('claude-timeout', '900'));
const opencodeTimeout = String(arg('opencode-timeout', '700'));
const claudeConfig = String(arg('claude-config', 'isolated'));
const opencodeModel = arg('opencode-model', null); // override manifest model for opencode seats (e.g. Kimi)
const opencodeVariant = String(arg('opencode-variant', 'xhigh')); // opencode reasoning variant

const only = arg('only', null); // 'opencode' | 'claude' | null (both)
const dualDrain = arg('dual-drain', false); // lend idle Opus capacity to pending GPT seats
const manifest = require(path.join(RT, 'manifest.json'));
const isDone = (s) => fs.existsSync(path.join(s.lineageDir, 'iterations', `iteration-${String(s.iter).padStart(3, '0')}.md`));
const allPending = manifest.filter((s) => !isDone(s));
const ocAll = only === 'claude' ? [] : allPending.filter((s) => s.executor === 'opencode');
const clAll = only === 'opencode' ? [] : allPending.filter((s) => s.executor === 'claude');

// Dual-drain: once the Opus lane is empty, lend its capacity to remaining GPT seats by
// overriding the executor on a cap-proportional share. The actual model is recorded per
// finding (extract-seat uses the passed model), so attribution stays honest.
if (dualDrain) {
  const oc = ocAll.splice(0);
  const unit = opencodeCap + claudeCap;
  let moved = 0;
  oc.forEach((s, i) => {
    if (i % unit < opencodeCap) ocAll.push(s);
    else { clAll.push({ ...s, executor: 'claude', model: 'claude-opus-4-8' }); moved += 1; }
  });
  console.log(`[wave] dual-drain: ${oc.length} GPT seats -> ${ocAll.length} stay opencode, ${moved} reviewed by Opus`);
}

// Interleave so a mixed batch always exercises BOTH pools.
const take = []; let a = 0; let b = 0;
while (take.length < batch && (a < ocAll.length || b < clAll.length)) {
  if (a < ocAll.length) take.push(ocAll[a++]);
  if (take.length < batch && b < clAll.length) take.push(clAll[b++]);
}
const oc = take.filter((s) => s.executor === 'opencode');
const cl = take.filter((s) => s.executor === 'claude');
console.log(`[wave] total pending=${allPending.length}; this batch=${take.length} (opencode=${oc.length} claude=${cl.length}); claudeConfig=${claudeConfig} caps oc=${opencodeCap}/cl=${claudeCap}`);

function runSeat(s) {
  const to = s.executor === 'claude' ? claudeTimeout : opencodeTimeout;
  const model = (s.executor === 'opencode' && opencodeModel) ? opencodeModel : s.model;
  const args = [RUNSEAT, s.executor, model, s.label, s.label, s.lineageDir, String(s.iter), String(s.global), s.promptFile, to];
  if (s.executor === 'claude') args.push(claudeConfig);
  return new Promise((res) => {
    const p = spawn('bash', args, { cwd: REPO, env: { ...process.env, OPENCODE_VARIANT: opencodeVariant } });
    let out = '';
    p.stdout.on('data', (d) => { out += d; });
    p.stderr.on('data', (d) => { out += d; });
    p.on('close', (code) => {
      process.stdout.write(out.split('\n').filter((l) => l.startsWith('SEAT ') || l.includes('rc=')).join('\n') + '\n');
      res({ s, code });
    });
  });
}

const fails = { opencode: 0, claude: 0 };
async function pool(items, cap) {
  let i = 0;
  async function next() {
    if (i >= items.length) return;
    const s = items[i++];
    const r = await runSeat(s);
    if (r.code !== 0) fails[s.executor] += 1;
    return next();
  }
  const starters = [];
  for (let k = 0; k < Math.min(cap, items.length); k += 1) starters.push(next());
  await Promise.all(starters);
}

(async () => {
  await Promise.all([pool(oc, opencodeCap), pool(cl, claudeCap)]);
  const remaining = manifest.filter((s) => !isDone(s)).length;
  console.log(`[wave] batch complete. failures this batch: opencode=${fails.opencode} claude=${fails.claude}. remaining pending=${remaining}/${manifest.length}`);
})();
