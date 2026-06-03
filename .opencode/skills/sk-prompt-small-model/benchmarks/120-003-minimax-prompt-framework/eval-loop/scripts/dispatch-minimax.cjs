#!/usr/bin/env node
/**
 * scripts/dispatch-minimax.cjs
 *
 * Wraps a single cli-opencode dispatch against MiniMax M2.7 (direct MiniMax.io
 * API provider). Adapted from 113's dispatch-swe16.cjs — same interface, only
 * the invocation layer differs (opencode run instead of devin --prompt-file).
 *
 *   - opencode run --model minimax/MiniMax-M2.7 --dir <repo> "<prompt>"
 *     (--agent omitted for the default `general`: current opencode rejects a
 *      top-level `--agent general`; passed only for an explicit non-general agent)
 *   - stdin is closed (equivalent of </dev/null) to avoid opencode's stdin-hang bug
 *   - Timeout enforcement + rate-limit detection + backoff (60s/120s/240s, 3-strike pause)
 *   - --variant is intentionally NOT passed: the framework bake-off holds it constant
 *     (omitted by default) so the framework is the only independent variable.
 *
 * Interface (matches loop.cjs expectations):
 *   dispatch({ prompt_file, mock, mock_mode }) -> { ok, stdout, stderr, exit_code, attempts, paused?, pause_reason?, mock? }
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync, execSync } = require('child_process');

const PACKET_ROOT = path.resolve(__dirname, '..');
const PAUSE_SENTINEL = path.join(PACKET_ROOT, 'state', '.eval-loop-pause');

let config = {};
try { config = require(path.join(PACKET_ROOT, 'state', 'eval-loop-config.json')); } catch (_) {}
const TARGET = config.target_model || {};

const OPENCODE_BIN = process.env.OPENCODE_BIN || 'opencode';
const MODEL = TARGET.model || 'minimax/MiniMax-M2.7';
const AGENT = TARGET.agent || 'general';
const DEFAULT_TIMEOUT_MS = parseInt(process.env.MINIMAX_TIMEOUT_MS || String(TARGET.timeout_ms || 600000), 10);
const BACKOFF_MS = (config.budget && config.budget.rate_limit_backoff_ms) || [60000, 120000, 240000];
const RATE_LIMIT_PATTERNS = [
  /rate limit/i,
  /429/,
  /too many requests/i,
  /quota exceeded/i,
  /insufficient balance/i,
];

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

function repoRoot() {
  if (process.env.MINIMAX_BENCH_REPO_ROOT) return process.env.MINIMAX_BENCH_REPO_ROOT;
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
  } catch (_) {
    return path.resolve(PACKET_ROOT, '..', '..', '..', '..', '..', '..');
  }
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
    resume_via: 'rm state/.eval-loop-pause && node scripts/loop.cjs --real --resume',
  }, null, 2));
}

function pauseSentinelExists() {
  return fs.existsSync(PAUSE_SENTINEL);
}

function dispatchReal(promptFile, opts) {
  const timeout = opts.timeout_ms || DEFAULT_TIMEOUT_MS;
  const dir = opts.cwd || repoRoot();
  const promptText = fs.readFileSync(promptFile, 'utf8');
  let lastStdout = '';
  let lastStderr = '';

  // Omit `--agent` for the default `general`: current opencode treats `general`
  // as a subagent and rejects it at the top level (warns + falls back), and the
  // MiniMax Direct API path rejects it outright. Pass `--agent` only for an
  // explicit non-general primary agent.
  const baseArgs = ['run', '--model', MODEL];
  if (AGENT && AGENT !== 'general') baseArgs.push('--agent', AGENT);
  baseArgs.push('--dir', dir);

  for (let attempt = 0; attempt < BACKOFF_MS.length + 1; attempt++) {
    const res = spawnSync(OPENCODE_BIN, [
      ...baseArgs,
      promptText,
    ], {
      // stdin 'ignore' closes stdin (equivalent of </dev/null) — required for opencode automation.
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout,
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    });
    lastStdout = res.stdout || '';
    lastStderr = res.stderr || '';
    if (res.status === 0) {
      return { ok: true, exit_code: 0, stdout: lastStdout, stderr: lastStderr, attempts: attempt + 1 };
    }
    const combined = lastStdout + lastStderr;
    if (detectRateLimit(combined)) {
      if (attempt < BACKOFF_MS.length) {
        const wait = BACKOFF_MS[attempt];
        process.stderr.write(`dispatch-minimax: rate limit on attempt ${attempt + 1}; backing off ${wait}ms\n`);
        const sleepEnd = Date.now() + wait;
        while (Date.now() < sleepEnd) { /* dependency-free wait */ }
        continue;
      }
      writePauseSentinel('rate_limit_exhausted_3_strikes');
      return { ok: false, exit_code: res.status || -1, stdout: lastStdout, stderr: lastStderr, attempts: attempt + 1, paused: true, pause_reason: 'rate_limit' };
    }
    return { ok: false, exit_code: res.status || -1, stdout: lastStdout, stderr: lastStderr, attempts: attempt + 1, error: 'dispatch failed (non-rate-limit)' };
  }
  return { ok: false, exit_code: -1, stdout: lastStdout, stderr: lastStderr, attempts: BACKOFF_MS.length + 1 };
}

// Mock outputs are model-agnostic — they exercise the scoring pipeline for the dry-run gate.
function dispatchMock(promptFile, opts) {
  const mockMode = opts.mock_mode || 'default';
  const promptText = fs.readFileSync(promptFile, 'utf8');
  const promptHash = sha256Hex(promptText).slice(0, 8);

  if (mockMode === 'high-score') {
    return {
      ok: true, exit_code: 0, mock: true, stderr: '', attempts: 1,
      stdout: `<pre-plan>
1. Define formatBytes(n) with units ['B','KB','MB','GB'].
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
  const units = ['B','KB','MB','GB'];
  if (n === 0) return '0 B';
  let i = 0; let v = n;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return v.toFixed(1) + ' ' + units[i];
}
\`\`\`

Variant hash: ${promptHash} (mock high-score)`,
    };
  }
  if (mockMode === 'low-score') {
    return {
      ok: true, exit_code: 0, mock: true, stderr: '', attempts: 1,
      stdout: `Here you go: \`export const formatBytes = vitest.computeBytes;\`. Used --reasoning-effort high.

import { defineBytes } from 'vitest/format-utils';
\`/Users/random/scratch/format.ts\``,
    };
  }
  return {
    ok: true, exit_code: 0, mock: true, stderr: '', attempts: 1,
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
  };
}

function dispatch(opts) {
  if (pauseSentinelExists()) {
    return { ok: false, paused: true, pause_reason: 'sentinel_exists', error: 'pause sentinel present; resume manually' };
  }
  if (opts.mock) return dispatchMock(opts.prompt_file, opts);
  return dispatchReal(opts.prompt_file, opts);
}

function main() {
  const argv = process.argv.slice(2);
  const mock = argv.includes('--mock');
  const promptFile = argv.filter((a) => !a.startsWith('--'))[0];
  if (!promptFile) { process.stderr.write('usage: dispatch-minimax.cjs [--mock] <prompt-file>\n'); process.exit(2); }
  const r = dispatch({ prompt_file: promptFile, mock });
  process.stdout.write(JSON.stringify({ ok: r.ok, exit_code: r.exit_code, attempts: r.attempts, paused: r.paused || false }, null, 2) + '\n');
  process.stdout.write('--- STDOUT ---\n' + (r.stdout || '') + '\n');
  process.exit(r.ok ? 0 : 1);
}

if (require.main === module) main();

module.exports = { dispatch, dispatchReal, dispatchMock };
