#!/usr/bin/env node
/**
 * scripts/dispatch-swe16.cjs
 *
 * Wraps a single cli-devin dispatch against Devin's SWE 1.6 model. Handles:
 *   - Prompt-file rendering (via render-variant)
 *   - cli-devin invocation with the council-ratified flags
 *   - Timeout enforcement
 *   - Rate-limit detection + backoff (60s/120s/240s, 3-strike pause sentinel)
 *   - Result capture into a structured object
 *
 * NOT a cache layer — caller (loop.cjs) consults the cache via 002 rig.
 *
 * Usage:
 *   node scripts/dispatch-swe16.cjs <prompt-file>          Real dispatch.
 *   node scripts/dispatch-swe16.cjs --mock <prompt-file>   Mock dispatch
 *                                                          (returns canned
 *                                                          SWE 1.6 output).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync, execFileSync } = require('child_process');

const PACKET_ROOT = path.resolve(__dirname, '..');
const PAUSE_SENTINEL = path.join(PACKET_ROOT, 'state', '.eval-loop-pause');

const DEVIN_BIN = process.env.DEVIN_BIN || 'devin';
const MODEL = 'swe-1.6';
const PERMISSION_MODE = process.env.SWE16_PERMISSION_MODE || 'auto';
const DEFAULT_TIMEOUT_MS = parseInt(process.env.SWE16_TIMEOUT_MS || '600000', 10);
const BACKOFF_MS = [60000, 120000, 240000];
const RATE_LIMIT_PATTERNS = [
  /rate limit/i,
  /429/,
  /too many requests/i,
  /quota exceeded/i,
];

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

function detectRateLimit(combinedOutput) {
  return RATE_LIMIT_PATTERNS.some((re) => re.test(combinedOutput));
}

function writePauseSentinel(reason) {
  const dir = path.dirname(PAUSE_SENTINEL);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(PAUSE_SENTINEL, JSON.stringify({
    paused_at: new Date().toISOString(),
    reason,
    resume_via: 'rm state/.eval-loop-pause && node scripts/loop.cjs --resume',
  }, null, 2));
}

function pauseSentinelExists() {
  return fs.existsSync(PAUSE_SENTINEL);
}

function dispatchReal(promptFile, opts) {
  const cwd = opts.cwd || PACKET_ROOT;
  const timeout = opts.timeout_ms || DEFAULT_TIMEOUT_MS;
  // cli-devin pre-flight: verify auth (cheap noop if logged in)
  // Skip if env says so (for offline dry-runs)
  let lastStdout = '';
  let lastStderr = '';

  for (let attempt = 0; attempt < BACKOFF_MS.length + 1; attempt++) {
    const res = spawnSync(DEVIN_BIN, [
      '--print',
      '--model', MODEL,
      '--permission-mode', PERMISSION_MODE,
      '--prompt-file', promptFile,
    ], {
      cwd,
      timeout,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    lastStdout = res.stdout || '';
    lastStderr = res.stderr || '';
    if (res.status === 0) {
      return {
        ok: true,
        exit_code: 0,
        stdout: lastStdout,
        stderr: lastStderr,
        attempts: attempt + 1,
      };
    }
    const combined = lastStdout + lastStderr;
    if (detectRateLimit(combined)) {
      if (attempt < BACKOFF_MS.length) {
        const wait = BACKOFF_MS[attempt];
        process.stderr.write(`dispatch-swe16: rate limit on attempt ${attempt + 1}; backing off ${wait}ms\n`);
        const sleepEnd = Date.now() + wait;
        // Sleep without dependency
        while (Date.now() < sleepEnd) { /* busy wait, dependency-free */ }
        continue;
      }
      // 3 strikes: write pause sentinel
      writePauseSentinel('rate_limit_exhausted_3_strikes');
      return {
        ok: false,
        exit_code: res.status || -1,
        stdout: lastStdout,
        stderr: lastStderr,
        attempts: attempt + 1,
        paused: true,
        pause_reason: 'rate_limit',
      };
    }
    // Non-rate-limit failure
    return {
      ok: false,
      exit_code: res.status || -1,
      stdout: lastStdout,
      stderr: lastStderr,
      attempts: attempt + 1,
      error: 'dispatch failed (non-rate-limit)',
    };
  }
  return { ok: false, exit_code: -1, stdout: lastStdout, stderr: lastStderr, attempts: BACKOFF_MS.length + 1 };
}

function dispatchMock(promptFile, opts) {
  // Returns a canned SWE 1.6 output that scores moderately well on the rig.
  // Different mock modes produce different output qualities.
  const mockMode = opts.mock_mode || 'default';
  const promptText = fs.readFileSync(promptFile, 'utf8');
  const promptHash = sha256Hex(promptText).slice(0, 8);

  if (mockMode === 'high-score') {
    return {
      ok: true,
      exit_code: 0,
      stdout: `<pre-plan>
1. Define formatBytes(n) with units ['B', 'KB', 'MB', 'GB'].
   - Acceptance: handles n=0, n=1500000, n=1.5e9.
   - Verification: \`npx vitest run\` exits 0.
2. Pick largest unit such that n/1024**i < 1024.
   - Acceptance: returns '1.5 MB' for 1500000.
   - Verification: assertion inline.
3. Format with toFixed(1) and append unit.
   - Acceptance: trims correctly.
   - Verification: regression test.
</pre-plan>

\`\`\`ts
export function formatBytes(n: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  if (n === 0) return '0 B';
  let i = 0; let v = n;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return v.toFixed(1) + ' ' + units[i];
}
\`\`\`

Variant hash: ${promptHash} (mock high-score)`,
      stderr: '',
      attempts: 1,
      mock: true,
    };
  }
  if (mockMode === 'low-score') {
    return {
      ok: true,
      exit_code: 0,
      stdout: `Here you go: \`export const formatBytes = vitest.computeBytes;\`. Used --reasoning-effort high.

import { defineBytes } from 'vitest/format-utils';
\`/Users/random/scratch/format.ts\``,
      stderr: '',
      attempts: 1,
      mock: true,
    };
  }
  // default: medium
  return {
    ok: true,
    exit_code: 0,
    stdout: `<pre-plan>
1. Add formatBytes function.
2. Add tests.
</pre-plan>

\`\`\`ts
export function formatBytes(n: number): string {
  if (n < 1024) return n + ' B';
  if (n < 1024*1024) return (n/1024).toFixed(1) + ' KB';
  if (n < 1024*1024*1024) return (n/1024/1024).toFixed(1) + ' MB';
  return (n/1024/1024/1024).toFixed(1) + ' GB';
}
\`\`\``,
    stderr: '',
    attempts: 1,
    mock: true,
  };
}

function dispatch(opts) {
  if (pauseSentinelExists()) {
    return {
      ok: false,
      paused: true,
      pause_reason: 'sentinel_exists',
      error: 'pause sentinel present; resume manually',
    };
  }
  if (opts.mock) {
    return dispatchMock(opts.prompt_file, opts);
  }
  return dispatchReal(opts.prompt_file, opts);
}

function main() {
  const argv = process.argv.slice(2);
  const mockIdx = argv.indexOf('--mock');
  const mockModeIdx = argv.indexOf('--mock-mode');
  const opts = {
    mock: mockIdx !== -1,
    mock_mode: mockModeIdx !== -1 ? argv[mockModeIdx + 1] : undefined,
  };
  const promptFile = argv.find((a) => !a.startsWith('--') && (a.endsWith('.md') || a.endsWith('.txt') || fs.existsSync(a)));
  if (!promptFile) {
    process.stderr.write('usage: dispatch-swe16.cjs [--mock [--mock-mode <name>]] <prompt-file>\n');
    process.exit(2);
  }
  opts.prompt_file = promptFile;
  const result = dispatch(opts);
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  process.exit(result.ok ? 0 : 1);
}

if (require.main === module) main();

module.exports = { dispatch, detectRateLimit, pauseSentinelExists, writePauseSentinel, DEFAULT_TIMEOUT_MS };
