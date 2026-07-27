#!/usr/bin/env node
/**
 * scripts/loop-v2.cjs
 *
 * Thin wrapper that invokes the 113/003 loop runner with EVAL_LOOP_EXTRACT=true
 * and the live claude-sonnet grader. State + iteration files write to 113/005/state
 * and 113/005/iterations (NOT 113/003's state dir) so the v1 baseline is preserved.
 *
 * Strategy: change cwd to 113/005, run loop, then loop writes to its PACKET_ROOT/state.
 * loop.cjs derives PACKET_ROOT from __dirname so we cannot change it directly;
 * the right move is to copy the loop runner to 113/005 as a one-line forwarder...
 *
 * Simpler: copy the iteration outputs from 113/003/state to 113/005/state after each
 * iter completes. But that's racy.
 *
 * Cleanest: run the loop from 113/003 (state goes to 113/003/state), then
 * post-process: move the new artifacts to 113/005/state.
 *
 * Implementation: invoke 113/003 loop with env vars set; tail state for new rows;
 * mirror them to 113/005/state after loop completes. This keeps 003 loop unchanged.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PACKET_ROOT = path.resolve(__dirname, '..');
const LOOP_PACKET_ROOT = path.resolve(PACKET_ROOT, '..', '003-eval-loop');
const LOOP_BIN = path.join(LOOP_PACKET_ROOT, 'scripts', 'loop.cjs');

const STATE_DIR_116 = path.join(PACKET_ROOT, 'state');
const ITERATIONS_DIR_116 = path.join(PACKET_ROOT, 'iterations');

const STATE_DIR_003 = path.join(LOOP_PACKET_ROOT, 'state');
const ITERATIONS_DIR_003 = path.join(LOOP_PACKET_ROOT, 'iterations');

function parseArgs(argv) {
  const out = { mock: false, maxIters: null, mockMode: null, resume: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--mock') out.mock = true;
    else if (argv[i] === '--real') out.mock = false;
    else if (argv[i] === '--max-iters') out.maxIters = parseInt(argv[++i], 10);
    else if (argv[i] === '--mock-mode') out.mockMode = argv[++i];
    else if (argv[i] === '--resume') out.resume = true;
  }
  return out;
}

function snapshotState003() {
  // Capture the 003 state filenames + sizes before the run so we know what's new
  const snap = { exists: fs.existsSync(STATE_DIR_003), files: {} };
  if (!snap.exists) return snap;
  for (const f of fs.readdirSync(STATE_DIR_003)) {
    const abs = path.join(STATE_DIR_003, f);
    if (fs.statSync(abs).isFile()) {
      snap.files[f] = fs.statSync(abs).size;
    }
  }
  return snap;
}

function archive003State(snapshot) {
  // After the run, copy 003 state files into 113/005/state (replacing any prior 113/005 state)
  fs.mkdirSync(STATE_DIR_116, { recursive: true });
  if (fs.existsSync(STATE_DIR_003)) {
    for (const f of fs.readdirSync(STATE_DIR_003)) {
      const src = path.join(STATE_DIR_003, f);
      if (fs.statSync(src).isFile()) {
        // Anchor extension match to end so '.json' inside '.jsonl' doesn't double-suffix.
        const dst = path.join(STATE_DIR_116, f.replace(/\.(jsonl|json|md)$/, '-v2.$1'));
        fs.copyFileSync(src, dst);
      }
    }
  }
  fs.mkdirSync(ITERATIONS_DIR_116, { recursive: true });
  if (fs.existsSync(ITERATIONS_DIR_003)) {
    for (const f of fs.readdirSync(ITERATIONS_DIR_003)) {
      const src = path.join(ITERATIONS_DIR_003, f);
      if (fs.statSync(src).isFile()) {
        const dst = path.join(ITERATIONS_DIR_116, f.replace(/\.md$/, '-v2.md'));
        fs.copyFileSync(src, dst);
      }
    }
  }
}

function clear003StateForFreshRun() {
  // Remove 003 state + iteration files so the loop starts clean
  // (003's prior run artifacts already committed in 113-005-eval-loop)
  if (fs.existsSync(STATE_DIR_003)) {
    for (const f of fs.readdirSync(STATE_DIR_003)) {
      const abs = path.join(STATE_DIR_003, f);
      if (fs.statSync(abs).isFile() && f !== 'eval-loop-config.json') {
        try { fs.unlinkSync(abs); } catch (_) {}
      }
    }
    // Clear in-flight subdirectory too
    const inFlight = path.join(STATE_DIR_003, 'in-flight');
    if (fs.existsSync(inFlight)) {
      for (const f of fs.readdirSync(inFlight)) {
        try { fs.unlinkSync(path.join(inFlight, f)); } catch (_) {}
      }
    }
  }
  if (fs.existsSync(ITERATIONS_DIR_003)) {
    for (const f of fs.readdirSync(ITERATIONS_DIR_003)) {
      if (f.endsWith('.md')) {
        try { fs.unlinkSync(path.join(ITERATIONS_DIR_003, f)); } catch (_) {}
      }
    }
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  // Set env for the loop child
  const env = {
    ...process.env,
    EVAL_LOOP_EXTRACT: 'true',
    EVAL_LOOP_SKIP_ITER1_REVIEW: 'true',
  };

  process.stdout.write('loop-v2: clearing 003 state for fresh run\n');
  clear003StateForFreshRun();

  const loopArgs = [LOOP_BIN];
  if (args.mock) {
    loopArgs.push('--mock');
    if (args.mockMode) loopArgs.push('--mock-mode', args.mockMode);
  } else {
    loopArgs.push('--real');
  }
  if (args.maxIters) loopArgs.push('--max-iters', String(args.maxIters));
  if (args.resume) loopArgs.push('--resume');

  process.stdout.write('loop-v2: invoking ' + loopArgs.join(' ') + '\n');
  process.stdout.write('loop-v2: env EVAL_LOOP_EXTRACT=true  EVAL_LOOP_SKIP_ITER1_REVIEW=true\n');

  const res = spawnSync('node', loopArgs, {
    env,
    stdio: 'inherit',
  });

  process.stdout.write(`loop-v2: child exited ${res.status}\n`);

  process.stdout.write('loop-v2: archiving 003 state to 113/005/state (with -v2 suffix)\n');
  archive003State();

  process.exit(res.status || 0);
}

if (require.main === module) main();

module.exports = { main, archive003State, clear003StateForFreshRun };
