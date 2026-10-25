'use strict';
// Mutual-exclusion stress driver for the shared deep-loop writer lock.
//
//   node lock-stress.cjs <rounds> [widenMs]
//
// Each round starts WORKERS processes that each take the lock ITERATIONS times.
// Inside the critical section a worker creates a marker file with an exclusive
// open. A second worker that finds the marker already there proves two writers
// held the lock at once, which is the failure that loses a JSONL record.
// With widenMs > 0 a preload delays fs.rmSync on the lock path, which widens the
// window between a reclaim verdict and its removal.

const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const GUARDS = path.resolve(
  __dirname,
  '../../../../.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs',
);
const WORKERS = 6;
const ITERATIONS = 6;

if (process.argv[2] === '--worker') {
  const [, , , lockPath, marker, overlapFile, widenMs] = process.argv;
  if (Number(widenMs) > 0) {
    const realRm = fs.rmSync;
    fs.rmSync = function (target, ...rest) {
      if (target === lockPath) {
        const until = Date.now() + Number(widenMs);
        while (Date.now() < until) { /* hold the window open */ }
      }
      return realRm.call(fs, target, ...rest);
    };
  }
  const { acquireWriterLock } = require(GUARDS);
  for (let i = 0; i < ITERATIONS; i += 1) {
    const release = acquireWriterLock(lockPath);
    let fd;
    try {
      fd = fs.openSync(marker, 'wx');
    } catch (err) {
      if (err && err.code === 'EEXIST') fs.appendFileSync(overlapFile, `${process.pid}\n`);
      else throw err;
    }
    const until = Date.now() + 2;
    while (Date.now() < until) { /* critical section */ }
    if (fd !== undefined) {
      fs.closeSync(fd);
      fs.rmSync(marker, { force: true });
    }
    release();
  }
  process.exit(0);
}

const rounds = Number(process.argv[2] || 200);
const widenMs = Number(process.argv[3] || 0);
let failures = 0;
let overlaps = 0;

function runRound() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lock-stress-'));
  const lockPath = path.join(dir, '.writer.lock');
  const marker = path.join(dir, 'inside');
  const overlapFile = path.join(dir, 'overlaps');
  const env = {
    ...process.env,
    DEEP_LOOP_WRITER_LOCK_MAX_WAIT_MS: '30000',
    DEEP_LOOP_WRITER_LOCK_RETRY_INTERVAL_MS: '2',
  };
  return new Promise((resolve) => {
    let pending = WORKERS;
    let crashed = false;
    for (let w = 0; w < WORKERS; w += 1) {
      const child = spawn(
        process.execPath,
        [__filename, '--worker', lockPath, marker, overlapFile, String(widenMs)],
        { env, stdio: 'ignore' },
      );
      child.on('exit', (code) => {
        if (code !== 0) crashed = true;
        pending -= 1;
        if (pending === 0) {
          const hit = fs.existsSync(overlapFile)
            ? fs.readFileSync(overlapFile, 'utf8').split('\n').filter(Boolean).length
            : 0;
          fs.rmSync(dir, { recursive: true, force: true });
          resolve({ hit, crashed });
        }
      });
    }
  });
}

(async () => {
  for (let r = 0; r < rounds; r += 1) {
    const { hit, crashed } = await runRound();
    overlaps += hit;
    if (hit > 0 || crashed) failures += 1;
  }
  console.log(`rounds=${rounds} widenMs=${widenMs} failures=${failures} overlaps=${overlaps}`);
  process.exit(failures === 0 ? 0 : 1);
})();

