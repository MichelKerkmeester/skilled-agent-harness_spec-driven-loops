// Spawn-timing harness: measures whole-process cost the way the hook pays it.
// Usage: node spawn-timing.mjs <runs> <label> -- <command> [args...]
import { spawnSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';

const runs = Number(process.argv[2]);
const label = process.argv[3];
const separator = process.argv.indexOf('--');
if (!Number.isFinite(runs) || separator === -1) {
  throw new Error('usage: node spawn-timing.mjs <runs> <label> -- <command> [args...]');
}
const command = process.argv[separator + 1];
const args = process.argv.slice(separator + 2);
const timings = [];
for (let i = 0; i < runs; i += 1) {
  const start = performance.now();
  const result = spawnSync(command, args, { encoding: 'utf8', timeout: 30_000 });
  const elapsedMs = performance.now() - start;
  timings.push(elapsedMs);
  process.stdout.write(`${JSON.stringify({
    label,
    run: i,
    elapsedMs,
    status: result.status,
    stdoutTail: (result.stdout ?? '').trim().split('\n').at(-1) ?? '',
  })}\n`);
}
const sorted = [...timings].sort((a, b) => a - b);
const percentile = (p) => sorted[Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1)];
process.stdout.write(`${JSON.stringify({
  label,
  summary: true,
  n: sorted.length,
  median: percentile(0.5),
  worst: sorted.at(-1),
  best: sorted[0],
})}\n`);
