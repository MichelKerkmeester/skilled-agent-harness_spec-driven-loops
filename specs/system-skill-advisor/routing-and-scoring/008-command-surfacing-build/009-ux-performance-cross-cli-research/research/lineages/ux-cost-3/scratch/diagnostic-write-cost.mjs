// ───────────────────────────────────────────────────────────────────
// MODULE: DIAGNOSTIC APPEND COST
// ───────────────────────────────────────────────────────────────────
//
// Times persistAdvisorHookDiagnosticRecord in one process, so the number is the
// append itself rather than a hook's process start. TMPDIR stays inside this
// scratch directory. Run once with the debug gate on and once with it off.
//
// Usage: node diagnostic-write-cost.mjs
// ───────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SANDBOX = join(HERE, 'tmp-write-cost');
mkdirSync(SANDBOX, { recursive: true });
process.env.TMPDIR = SANDBOX;
process.env.SKILL_ADVISOR_DEBUG = '1';

const require = createRequire(import.meta.url);
const metrics = await import(
  join(HERE, '..', '..', '..', '..', '..', '..', '..', '..', '..',
    '.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/metrics.js')
);

const WORKSPACE = join(HERE, 'tmp-write-cost', 'workspace');
const SAMPLES = 240;
const times = [];
let lastPath = null;
for (let index = 0; index < SAMPLES; index += 1) {
  const started = process.hrtime.bigint();
  lastPath = await metrics.persistAdvisorHookDiagnosticRecord(WORKSPACE, {
    timestamp: new Date().toISOString(),
    runtime: 'claude',
    status: 'ok',
    freshness: 'live',
    durationMs: 42,
    cacheHit: true,
    skillLabel: 'sk-code',
    emittedBytes: 260,
    directivesSuppressed: false,
  });
  times.push(Number(process.hrtime.bigint() - started) / 1e6);
}

const sorted = [...times].sort((a, b) => a - b);
const pick = (q) => Number(sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))].toFixed(3));
const size = statSync(lastPath).size;
const lines = readFileSync(lastPath, 'utf8').trim().split('\n').length;
const files = readdirSync(join(SANDBOX, 'speckit-skill-advisor-metrics'));

console.log(JSON.stringify({
  samples: SAMPLES,
  firstMs: Number(times[0].toFixed(3)),
  medianMs: pick(0.5),
  p95Ms: pick(0.95),
  maxMs: pick(0.999),
  fileBytes: size,
  fileLines: lines,
  bytesPerRecord: Number((size / lines).toFixed(1)),
  filesInMetricsDir: files,
  requiredDebugEnv: process.env.SKILL_ADVISOR_DEBUG,
}, null, 2));
