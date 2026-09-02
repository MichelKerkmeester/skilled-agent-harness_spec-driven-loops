#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ MODULE: Sharded test runner — completes a suite a single run cannot      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// The suite runs files serially in one reused worker, and that worker eventually
// spins on a CPU-bound rehash storm and never returns. The module it stops at is
// innocent and so are the ones after it: the cost belongs to the accumulated
// process, not to any test. Splitting the run gives each shard its own worker, so
// nothing accumulates far enough to reach that point.
//
// Shards run one at a time on purpose. Running them together contends for the
// same temporary directories and the same databases, which produces failures that
// belong to the harness rather than to the code.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const shardCount = Number.parseInt(process.env.SPECKIT_TEST_SHARDS ?? '12', 10);
if (!Number.isInteger(shardCount) || shardCount < 1) {
  console.error(`[sharded] SPECKIT_TEST_SHARDS must be a positive integer, got ${process.env.SPECKIT_TEST_SHARDS}`);
  process.exit(2);
}

const runner = fileURLToPath(new URL('./run-tests.mjs', import.meta.url));
const passthrough = process.argv.slice(2);
const summary = [];
let failedShards = 0;

for (let shard = 1; shard <= shardCount; shard += 1) {
  const started = Date.now();
  const result = spawnSync(process.execPath, [runner, ...passthrough, `--shard=${shard}/${shardCount}`], {
    stdio: ['ignore', 'inherit', 'inherit'],
    env: process.env,
  });
  const elapsedMs = Date.now() - started;
  const status = result.status ?? -1;
  if (status !== 0) failedShards += 1;
  summary.push({ shard, status, elapsedMs });
  console.log(`[sharded] shard ${shard}/${shardCount} exited ${status} after ${Math.round(elapsedMs / 1000)}s`);
}

const totalSeconds = Math.round(summary.reduce((sum, row) => sum + row.elapsedMs, 0) / 1000);
console.log(`[sharded] ${shardCount} shard(s), ${failedShards} failing, ${totalSeconds}s total`);
// A shard that times out is not a pass, so its non-zero status has to survive.
process.exit(failedShards > 0 ? 1 : 0);
