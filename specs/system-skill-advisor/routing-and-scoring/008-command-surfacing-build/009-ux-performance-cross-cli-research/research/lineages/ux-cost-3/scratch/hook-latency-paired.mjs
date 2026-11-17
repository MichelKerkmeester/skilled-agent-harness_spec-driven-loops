// ───────────────────────────────────────────────────────────────────
// MODULE: PAIRED HOOK LATENCY
// ───────────────────────────────────────────────────────────────────
//
// Runs the advisor hook itself (not the spec-kit shim) with the debug gate off
// and on, alternating on one prompt, and reports the paired difference. The
// alternating order cancels a slow daemon spell, which a block design reads as
// the gate's cost. TMPDIR stays inside this scratch directory.
//
// Usage: node hook-latency-paired.mjs
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..', '..', '..', '..', '..', '..', '..', '..');
const HOOK = join(REPO, '.skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js');
const SANDBOX = join(HERE, 'tmp-paired');
const PAIRS = 30;
const PROMPT = 'plan the next phase of the advisor work';

if (!existsSync(HOOK)) {
  console.log(JSON.stringify({ error: 'hook_missing', path: HOOK }));
  process.exit(2);
}
mkdirSync(SANDBOX, { recursive: true });

function run(debug) {
  const env = { ...process.env, TMPDIR: SANDBOX, SPECKIT_RUNTIME: 'claude' };
  delete env.AI_SESSION_CHILD;
  delete env.SKILL_ADVISOR_DEBUG;
  if (debug) env.SKILL_ADVISOR_DEBUG = '1';
  const payload = JSON.stringify({ prompt: PROMPT, cwd: REPO, hook_event_name: 'UserPromptSubmit' });
  const started = process.hrtime.bigint();
  const result = spawnSync(process.execPath, [HOOK], { input: payload, env, encoding: 'utf8', timeout: 30000 });
  return {
    ms: Number(process.hrtime.bigint() - started) / 1e6,
    status: result.status,
  };
}

const deltas = [];
const offAll = [];
const onAll = [];
run(false);
for (let index = 0; index < PAIRS; index += 1) {
  const first = index % 2 === 0 ? false : true;
  const a = run(first);
  const b = run(!first);
  const off = first ? b : a;
  const on = first ? a : b;
  offAll.push(off.ms);
  onAll.push(on.ms);
  deltas.push(on.ms - off.ms);
}

function stats(values) {
  const sorted = [...values].sort((left, right) => left - right);
  const at = (q) => Number(sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))].toFixed(2));
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return { median: at(0.5), p25: at(0.25), p75: at(0.75), mean: Number(mean.toFixed(2)) };
}

const metricsDir = join(SANDBOX, 'speckit-skill-advisor-metrics');
const files = existsSync(metricsDir) ? readdirSync(metricsDir) : [];
const diagnostics = files.filter((name) => name.endsWith('-diagnostics.jsonl'));
let lines = 0;
for (const name of diagnostics) {
  const text = readFileSync(join(metricsDir, name), 'utf8').trim();
  lines += text === '' ? 0 : text.split('\n').length;
}

console.log(JSON.stringify({
  pairs: PAIRS,
  off: stats(offAll),
  on: stats(onAll),
  pairedDelta: stats(deltas),
  diagnosticsLines: lines,
  runsMeasured: offAll.length + onAll.length,
}, null, 2));
