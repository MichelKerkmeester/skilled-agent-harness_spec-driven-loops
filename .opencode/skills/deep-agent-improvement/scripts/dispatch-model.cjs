#!/usr/bin/env node
'use strict';

/**
 * scripts/dispatch-model.cjs
 *
 * Model-agnostic CLI dispatcher for the deep-agent-improvement model-benchmark
 * mode. Generalized from 120/003's dispatch-minimax.cjs: same interface and the
 * same rate-limit / backoff / pause-sentinel machinery, but the invocation layer
 * routes through an executor map keyed on `opts.executor` instead of being
 * hardcoded to `opencode run`.
 *
 * Interface (matches the dispatcher seam):
 *   dispatch({ prompt_file, executor, model, agent, variant, mock, mock_mode, cwd, timeout_ms })
 *     -> { ok, exit_code, stdout, stderr, attempts, paused?, pause_reason?, mock? }
 *
 * Notes:
 *   - `--variant` is forwarded ONLY when opts.variant is set. Agent-improvement
 *     holds it constant (omits it); model-benchmark may vary it as the axis.
 *   - Config (model/agent/executor/timeout/backoff) is read from
 *     improvement_config.json -> modelBenchmarkConfig when present; opts override.
 *   - Mock outputs are model-agnostic and shared with the 120/003 rig shapes.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync, execSync } = require('child_process');

const SCRIPTS_ROOT = __dirname;
const STATE_DIR = path.join(SCRIPTS_ROOT, '..', 'state');
const PAUSE_SENTINEL = path.join(STATE_DIR, '.benchmark-pause');

function loadConfig() {
  const explicit = process.env.DEEP_AGENT_IMPROVEMENT_CONFIG;
  const candidates = [
    explicit,
    path.join(SCRIPTS_ROOT, '..', 'assets', 'improvement_config.json'),
  ].filter(Boolean);
  for (const file of candidates) {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (_) {
      /* optional */
    }
  }
  return {};
}

const CONFIG = loadConfig();
const MB_CONFIG = CONFIG.modelBenchmarkConfig || {};
const TARGET = MB_CONFIG.target_model || {};
const BUDGET = MB_CONFIG.budget || {};

const DEFAULT_TIMEOUT_MS = parseInt(
  process.env.DEEP_AGENT_DISPATCH_TIMEOUT_MS || String(TARGET.timeout_ms || 600000),
  10,
);
const BACKOFF_MS = BUDGET.rate_limit_backoff_ms || [60000, 120000, 240000];
const RATE_LIMIT_PATTERNS = [
  /rate limit/i,
  /429/,
  /too many requests/i,
  /quota exceeded/i,
  /insufficient balance/i,
];

const KNOWN_EXECUTORS = new Set([
  'cli-opencode',
  'cli-claude-code',
  'cli-codex',
  'cli-gemini',
  'cli-devin',
]);

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

function repoRoot() {
  if (process.env.DEEP_AGENT_REPO_ROOT) return process.env.DEEP_AGENT_REPO_ROOT;
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
  } catch (_) {
    return path.resolve(SCRIPTS_ROOT, '..', '..', '..', '..');
  }
}

function detectRateLimit(combinedOutput) {
  return RATE_LIMIT_PATTERNS.some((re) => re.test(combinedOutput));
}

function writePauseSentinel(reason) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.writeFileSync(
    PAUSE_SENTINEL,
    JSON.stringify(
      {
        paused_at: new Date().toISOString(),
        reason,
        resume_via: 'rm state/.benchmark-pause && re-run loop-host.cjs --mode=model-benchmark',
      },
      null,
      2,
    ),
  );
}

function pauseSentinelExists() {
  return fs.existsSync(PAUSE_SENTINEL);
}

/**
 * Build the spawn spec for a given executor.
 * Returns { bin, args, input } where `input` (when set) is fed to stdin and the
 * prompt is NOT passed as a positional arg.
 */
function buildSpawnSpec(executor, promptText, resolved) {
  const { model, agent, variant, dir } = resolved;
  switch (executor) {
    case 'cli-opencode': {
      const args = ['run', '--model', model, '--agent', agent, '--dir', dir];
      if (variant) args.push('--variant', variant);
      args.push(promptText);
      return { bin: process.env.OPENCODE_BIN || 'opencode', args, input: null };
    }
    case 'cli-claude-code': {
      const args = ['-p', promptText, '--model', model, '--permission-mode', 'acceptEdits', '--output-format', 'text'];
      if (variant) args.push('--effort', variant);
      return { bin: process.env.CLAUDE_BIN || 'claude', args, input: null };
    }
    case 'cli-codex': {
      const args = ['exec', '--model', model, '-c', 'approval_policy=never', '--sandbox', 'workspace-write'];
      if (variant) args.push('-c', `model_reasoning_effort=${variant}`);
      args.push('-'); // prompt via stdin
      return { bin: process.env.CODEX_BIN || 'codex', args, input: promptText };
    }
    case 'cli-gemini': {
      const args = [promptText, '-m', model, '-y', '-o', 'text'];
      return { bin: process.env.GEMINI_BIN || 'gemini', args, input: null };
    }
    case 'cli-devin': {
      // devin reads the prompt from a file; resolved.promptFile is required.
      const args = ['--print', '--prompt-file', resolved.promptFile, '--model', model, '--permission-mode', 'auto'];
      return { bin: process.env.DEVIN_BIN || 'devin', args, input: null };
    }
    default:
      throw new Error(`Unknown executor: ${executor}`);
  }
}

function dispatchReal(opts) {
  const executor = opts.executor || TARGET.executor || 'cli-opencode';
  if (!KNOWN_EXECUTORS.has(executor)) {
    return { ok: false, exit_code: -1, stdout: '', stderr: '', attempts: 0, error: `unknown executor: ${executor}` };
  }
  const timeout = opts.timeout_ms || DEFAULT_TIMEOUT_MS;
  const dir = opts.cwd || repoRoot();
  const promptText = fs.readFileSync(opts.prompt_file, 'utf8');
  const resolved = {
    model: opts.model || TARGET.model || 'minimax/MiniMax-M2.7',
    agent: opts.agent || TARGET.agent || 'general',
    variant: opts.variant || null,
    dir,
    promptFile: opts.prompt_file,
  };

  let lastStdout = '';
  let lastStderr = '';

  for (let attempt = 0; attempt < BACKOFF_MS.length + 1; attempt++) {
    const spec = buildSpawnSpec(executor, promptText, resolved);
    const res = spawnSync(spec.bin, spec.args, {
      // stdin: feed prompt text for stdin-based executors (codex); otherwise close it
      // ('ignore' == </dev/null) to avoid opencode's stdin-hang bug.
      input: spec.input == null ? undefined : spec.input,
      stdio: spec.input == null ? ['ignore', 'pipe', 'pipe'] : ['pipe', 'pipe', 'pipe'],
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
        process.stderr.write(`dispatch-model: rate limit on attempt ${attempt + 1}; backing off ${wait}ms\n`);
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
function dispatchMock(opts) {
  const mockMode = opts.mock_mode || 'default';
  const promptText = fs.readFileSync(opts.prompt_file, 'utf8');
  const promptHash = sha256Hex(promptText).slice(0, 8);

  if (mockMode === 'high-score') {
    return {
      ok: true, exit_code: 0, mock: true, stderr: '', attempts: 1,
      stdout: `<pre-plan>
1. Define formatBytes(n) with units ['B','KB','MB','GB'].
   - Acceptance: handles n=0, n=1500000, n=1.5e9.
   - Verification: \`npx vitest run\` exits 0.
2. Pick largest unit such that n/1024**i < 1024.
3. Format with toFixed(1) and append unit.
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
      stdout: `Here you go: \`export const formatBytes = vitest.computeBytes;\`. Used --reasoning-effort high.`,
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
  return (n/1024/1024).toFixed(1) + ' MB';
}
\`\`\``,
  };
}

function dispatch(opts) {
  if (pauseSentinelExists()) {
    return { ok: false, paused: true, pause_reason: 'sentinel_exists', error: 'pause sentinel present; resume manually' };
  }
  if (opts.mock) return dispatchMock(opts);
  return dispatchReal(opts);
}

function parseArgs(argv) {
  const args = { mock: false };
  for (const entry of argv) {
    if (entry === '--mock') args.mock = true;
    else if (entry.startsWith('--executor=')) args.executor = entry.slice('--executor='.length);
    else if (entry.startsWith('--model=')) args.model = entry.slice('--model='.length);
    else if (entry.startsWith('--agent=')) args.agent = entry.slice('--agent='.length);
    else if (entry.startsWith('--variant=')) args.variant = entry.slice('--variant='.length);
    else if (entry.startsWith('--mock-mode=')) args.mock_mode = entry.slice('--mock-mode='.length);
    else if (!entry.startsWith('--') && !args.prompt_file) args.prompt_file = entry;
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.prompt_file) {
    process.stderr.write('usage: dispatch-model.cjs [--executor=cli-opencode] [--model=...] [--agent=...] [--variant=...] [--mock] [--mock-mode=...] <prompt-file>\n');
    process.exit(2);
  }
  const r = dispatch(args);
  process.stdout.write(JSON.stringify({ ok: r.ok, exit_code: r.exit_code, attempts: r.attempts, paused: r.paused || false }, null, 2) + '\n');
  process.stdout.write('--- STDOUT ---\n' + (r.stdout || '') + '\n');
  process.exit(r.ok ? 0 : 1);
}

if (require.main === module) main();

module.exports = { dispatch, dispatchReal, dispatchMock, buildSpawnSpec, KNOWN_EXECUTORS };
