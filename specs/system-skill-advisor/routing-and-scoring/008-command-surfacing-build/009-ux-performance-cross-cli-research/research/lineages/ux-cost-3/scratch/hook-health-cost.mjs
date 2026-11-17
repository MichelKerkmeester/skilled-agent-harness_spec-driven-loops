// ───────────────────────────────────────────────────────────────────
// MODULE: HOOK HEALTH WRITE COST
// ───────────────────────────────────────────────────────────────────
//
// Times the Claude prompt hook with SKILL_ADVISOR_DEBUG unset and set, on the
// same prompt, so the difference is the diagnostic write rather than routing
// work. Every run keeps TMPDIR inside this scratch directory, so the durable
// diagnostics file lands here and is inspected afterwards.
//
// Usage: node hook-health-cost.mjs
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..', '..', '..', '..', '..', '..', '..', '..');
const SHIM = join(REPO, '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js');
const SANDBOX = join(HERE, 'tmp-health-cost');
const RUNS = 4;

const PROMPTS = [
  'review the parser change before I merge it',
  'write a readme for the utils folder',
  'plan the next phase of the advisor work',
  'why is the doctor setup leg red today',
  'commit the research packet changes',
  'find out everything about how the hook renders a brief',
];

function runOnce(prompt, debug) {
  const env = { ...process.env, TMPDIR: SANDBOX, SPECKIT_RUNTIME: 'claude' };
  delete env.AI_SESSION_CHILD;
  delete env.SKILL_ADVISOR_DEBUG;
  if (debug) env.SKILL_ADVISOR_DEBUG = '1';
  const payload = JSON.stringify({ prompt, cwd: REPO, hook_event_name: 'UserPromptSubmit' });
  const started = process.hrtime.bigint();
  const result = spawnSync(process.execPath, [SHIM], {
    input: payload,
    env,
    encoding: 'utf8',
    timeout: 30000,
  });
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
  return {
    debug,
    elapsedMs: Number(elapsedMs.toFixed(2)),
    status: result.status,
    stdoutBytes: Buffer.byteLength(result.stdout ?? '', 'utf8'),
  };
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2));
}

if (!existsSync(SHIM)) {
  console.log(JSON.stringify({ error: 'shim_missing', path: SHIM }));
  process.exit(2);
}
mkdirSync(SANDBOX, { recursive: true });

const rows = [];
for (const prompt of PROMPTS) {
  // A first debug-off run warms the daemon cache so the measured pair share the same work.
  runOnce(prompt, false);
  const off = [];
  const on = [];
  for (let index = 0; index < RUNS; index += 1) {
    off.push(runOnce(prompt, false).elapsedMs);
    on.push(runOnce(prompt, true).elapsedMs);
  }
  rows.push({
    prompt,
    offMedianMs: median(off),
    onMedianMs: median(on),
    deltaMs: Number((median(on) - median(off)).toFixed(2)),
  });
}

const metricsDir = join(SANDBOX, 'speckit-skill-advisor-metrics');
const files = existsSync(metricsDir) ? readdirSync(metricsDir) : [];
const diagnostics = files.filter((name) => name.endsWith('-diagnostics.jsonl'));
let lines = 0;
let bytes = 0;
let sample = null;
for (const name of diagnostics) {
  const path = join(metricsDir, name);
  const text = readFileSync(path, 'utf8').trim();
  const count = text === '' ? 0 : text.split('\n').length;
  lines += count;
  bytes += statSync(path).size;
  if (sample === null && count > 0) sample = text.split('\n')[0];
}

console.log(JSON.stringify({
  runsPerPrompt: RUNS * 2 + 1,
  prompts: rows.length,
  medianOffMs: median(rows.map((row) => row.offMedianMs)),
  medianOnMs: median(rows.map((row) => row.onMedianMs)),
  medianDeltaMs: median(rows.map((row) => row.deltaMs)),
  rows,
  diagnosticsFiles: diagnostics.length,
  diagnosticsLines: lines,
  diagnosticsBytes: bytes,
  bytesPerRecord: lines > 0 ? Number((bytes / lines).toFixed(1)) : null,
  sampleRecord: sample,
}, null, 2));
