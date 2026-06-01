#!/usr/bin/env node
'use strict';

/**
 * scripts/dispatch-model.cjs
 *
 * Model-agnostic CLI dispatcher for the deep-improvement model-benchmark
 * mode. Generalized from the original MiniMax-only dispatcher: same interface and the
 * same rate-limit / backoff / pause-sentinel machinery, but the invocation layer
 * routes through an executor map keyed on `opts.executor` instead of being
 * hardcoded to `opencode run`.
 *
 * Interface (matches the dispatcher seam):
 *   dispatch({ prompt_file, executor, model, agent, variant, state_dir, mock, mock_mode, cwd, timeout_ms })
 *     -> { ok, exit_code, stdout, stderr, attempts, paused?, pause_reason?, sentinel_path?, mock? }
 *
 * Notes:
 *   - `--variant` is forwarded ONLY when opts.variant is set. Agent-improvement
 *     holds it constant (omits it); model-benchmark may vary it as the axis.
 *   - Config (model/agent/executor/timeout/backoff) is read from
 *     improvement_config.json -> modelBenchmarkConfig when present; opts override.
 *   - Mock outputs are model-agnostic and shared with the model-benchmark rig shapes.
 *   - Read-only by default (F-P1-1): executors run in their non-write mode;
 *     write-capable evaluation requires DEEP_AGENT_DISPATCH_WRITE=1.
 *   - Pause sentinel is run-scoped (F-P1-14): opts.state_dir / --state-dir /
 *     DEEP_AGENT_STATE_DIR pick the dir; falls back to the skill state/ dir.
 *   - Test-only seams (never set by production callers): opts._spawn overrides
 *     spawnSync; opts._backoff overrides the rate-limit backoff schedule.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync, execSync } = require('child_process');

// This file lives in scripts/model-benchmark/, one level deeper
// than the original scripts/ root. SCRIPTS_ROOT is __dirname (model-benchmark/),
// so every path that reaches the skill root needs an extra '..' versus the
// pre-move scripts/-root depth. state/ and assets/ live at the skill root
// (scripts/../.. from here), NOT at scripts/.. .
const SCRIPTS_ROOT = __dirname;
// F-P1-14 (014 review): the pause sentinel is no longer pinned to this shared
// skill state dir. resolveStateDir() prefers a packet-local dir (opts.state_dir
// / --state-dir / DEEP_AGENT_STATE_DIR) so concurrent benchmark runs under
// different spec folders do not collide on one global .benchmark-pause file.
// LEGACY_STATE_DIR is the backstop only when no run-scoped dir is supplied.
const LEGACY_STATE_DIR = path.join(SCRIPTS_ROOT, '..', '..', 'state');
const PAUSE_SENTINEL_BASENAME = '.benchmark-pause';

// F-P1-1 (014 review): grader/benchmark dispatch is a read-only judgment — the
// model emits its verdict on stdout and must NOT mutate the workspace. Executors
// run in their READ-ONLY mode by default. Write-capable evaluation is an explicit
// opt-in via DEEP_AGENT_DISPATCH_WRITE=1 (e.g. an isolated temp workspace run).
function writeCapableOptIn() {
  const v = process.env.DEEP_AGENT_DISPATCH_WRITE;
  return v === '1' || v === 'true';
}

function resolveStateDir(opts) {
  return (
    (opts && opts.state_dir) ||
    process.env.DEEP_AGENT_STATE_DIR ||
    LEGACY_STATE_DIR
  );
}

function pauseSentinelPath(opts) {
  return path.join(resolveStateDir(opts), PAUSE_SENTINEL_BASENAME);
}

function loadConfig() {
  const explicit = process.env.DEEP_AGENT_IMPROVEMENT_CONFIG;
  const candidates = [
    explicit,
    path.join(SCRIPTS_ROOT, '..', '..', 'assets', 'agent-improvement', 'improvement_config.json'),
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

// F-P2-9 (122 review): synchronous sleep WITHOUT a busy-wait. The prior
// `while (Date.now() < end) {}` spin burned a full core for 60-240s during
// rate-limit backoff. Atomics.wait blocks the thread on an un-signalled buffer
// for the timeout, yielding the CPU. Falls back to a bounded spin only if
// Atomics is unavailable.
function sleepSync(ms) {
  if (ms <= 0) return;
  try {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
  } catch (_) {
    const end = Date.now() + ms;
    while (Date.now() < end) { /* fallback only */ }
  }
}

function repoRoot() {
  if (process.env.DEEP_AGENT_REPO_ROOT) return process.env.DEEP_AGENT_REPO_ROOT;
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
  } catch (_) {
    return path.resolve(SCRIPTS_ROOT, '..', '..', '..', '..', '..');
  }
}

function detectRateLimit(combinedOutput) {
  return RATE_LIMIT_PATTERNS.some((re) => re.test(combinedOutput));
}

// P2 (014-review traceability-3-5): emit a resume command that actually works — it removes
// the REAL sentinel path (which is now run-scoped, not always state/) and invokes
// the loop-host at its shipped lane path scripts/shared/loop-host.cjs.
function buildResumeHint(sentinelPath) {
  const root = repoRoot();
  const relSentinel = path.relative(root, sentinelPath) || sentinelPath;
  const loopHost = path.join(
    '.opencode', 'skills', 'deep-improvement', 'scripts', 'shared', 'loop-host.cjs',
  );
  return `rm ${relSentinel} && node ${loopHost} --mode=model-benchmark --profile=<profile> --outputs-dir=<outputs-dir>`;
}

function writePauseSentinel(reason, opts) {
  const sentinelPath = pauseSentinelPath(opts);
  fs.mkdirSync(path.dirname(sentinelPath), { recursive: true });
  fs.writeFileSync(
    sentinelPath,
    JSON.stringify(
      {
        paused_at: new Date().toISOString(),
        reason,
        sentinel_path: sentinelPath,
        resume_via: buildResumeHint(sentinelPath),
      },
      null,
      2,
    ),
  );
  return sentinelPath;
}

function pauseSentinelExists(opts) {
  return fs.existsSync(pauseSentinelPath(opts));
}

/**
 * Build the spawn spec for a given executor.
 * Returns { bin, args, input } where `input` (when set) is fed to stdin and the
 * prompt is NOT passed as a positional arg.
 */
function buildSpawnSpec(executor, promptText, resolved) {
  const { model, agent, variant, dir } = resolved;
  // F-P1-1: read-only is the default; write-capable is the explicit opt-in.
  const writeCapable = writeCapableOptIn();
  switch (executor) {
    case 'cli-opencode': {
      // opencode `run` does not auto-approve arbitrary edits, so no write-grant
      // flag is added; routing is preserved unchanged.
      const args = ['run', '--model', model, '--agent', agent, '--dir', dir];
      if (variant) args.push('--variant', variant);
      args.push(promptText);
      return { bin: process.env.OPENCODE_BIN || 'opencode', args, input: null };
    }
    case 'cli-claude-code': {
      // Read-only judgment: --permission-mode plan blocks file writes. acceptEdits
      // (write-capable) only when DEEP_AGENT_DISPATCH_WRITE opt-in is set.
      const permissionMode = writeCapable ? 'acceptEdits' : 'plan';
      const args = ['-p', promptText, '--model', model, '--permission-mode', permissionMode, '--output-format', 'text'];
      if (variant) args.push('--effort', variant);
      return { bin: process.env.CLAUDE_BIN || 'claude', args, input: null };
    }
    case 'cli-codex': {
      // Read-only judgment: --sandbox read-only blocks workspace writes/shell.
      // workspace-write only when the write opt-in is set.
      const sandbox = writeCapable ? 'workspace-write' : 'read-only';
      const args = ['exec', '--model', model, '-c', 'approval_policy=never', '--sandbox', sandbox];
      if (variant) args.push('-c', `model_reasoning_effort=${variant}`);
      args.push('-'); // prompt via stdin
      return { bin: process.env.CODEX_BIN || 'codex', args, input: promptText };
    }
    case 'cli-gemini': {
      // -y / --yolo auto-approves writes/shell. Omit it for the read-only default;
      // add it only under the write opt-in.
      const args = [promptText, '-m', model, '-o', 'text'];
      if (writeCapable) args.push('-y');
      return { bin: process.env.GEMINI_BIN || 'gemini', args, input: null };
    }
    case 'cli-devin': {
      // devin reads the prompt from a file; resolved.promptFile is required.
      // `auto` is the read-only default (auto-approves read-only tools, prompts on
      // write/exec — non-interactive => writes blocked). `dangerous` (auto-approve
      // all) only under the write opt-in.
      const permissionMode = writeCapable ? 'dangerous' : 'auto';
      const args = ['--print', '--prompt-file', resolved.promptFile, '--model', model, '--permission-mode', permissionMode];
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
  // Injectable spawn for tests (F-P1-1 regression asserts cwd reaches the spawn layer).
  const spawnFn = opts._spawn || spawnSync;
  // Test-only backoff override (mirrors the _spawn seam): lets the pause-sentinel
  // regression exhaust the backoff schedule without real 60-240s sleeps. Production
  // callers never set _backoff, so the configured BACKOFF_MS schedule is used.
  const backoff = Array.isArray(opts._backoff) ? opts._backoff : BACKOFF_MS;
  const promptText = fs.readFileSync(opts.prompt_file, 'utf8');
  const resolved = {
    model: opts.model || TARGET.model || 'minimax-coding-plan/MiniMax-M2.7-highspeed',
    agent: opts.agent || TARGET.agent || 'general',
    variant: opts.variant || null,
    dir,
    promptFile: opts.prompt_file,
  };

  let lastStdout = '';
  let lastStderr = '';

  for (let attempt = 0; attempt < backoff.length + 1; attempt++) {
    const spec = buildSpawnSpec(executor, promptText, resolved);
    const res = spawnFn(spec.bin, spec.args, {
      // F-P1-1 (122 review): set cwd for EVERY executor. Previously only cli-opencode
      // forwarded `--dir dir` and spawnSync had no cwd opt, so cli-claude-code/codex/
      // gemini/devin silently ran in the host process cwd. Honor `dir` for all.
      cwd: dir,
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
      if (attempt < backoff.length) {
        const wait = backoff[attempt];
        process.stderr.write(`dispatch-model: rate limit on attempt ${attempt + 1}; backing off ${wait}ms\n`);
        sleepSync(wait);
        continue;
      }
      const sentinelPath = writePauseSentinel('rate_limit_exhausted_3_strikes', opts);
      return { ok: false, exit_code: res.status || -1, stdout: lastStdout, stderr: lastStderr, attempts: attempt + 1, paused: true, pause_reason: 'rate_limit', sentinel_path: sentinelPath };
    }
    return { ok: false, exit_code: res.status || -1, stdout: lastStdout, stderr: lastStderr, attempts: attempt + 1, error: 'dispatch failed (non-rate-limit)' };
  }
  return { ok: false, exit_code: -1, stdout: lastStdout, stderr: lastStderr, attempts: backoff.length + 1 };
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
  if (pauseSentinelExists(opts)) {
    const sentinelPath = pauseSentinelPath(opts);
    return { ok: false, paused: true, pause_reason: 'sentinel_exists', sentinel_path: sentinelPath, error: `pause sentinel present (${sentinelPath}); resume manually` };
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
    else if (entry.startsWith('--state-dir=')) args.state_dir = entry.slice('--state-dir='.length);
    else if (!entry.startsWith('--') && !args.prompt_file) args.prompt_file = entry;
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.prompt_file) {
    process.stderr.write('usage: dispatch-model.cjs [--executor=cli-opencode] [--model=...] [--agent=...] [--variant=...] [--state-dir=...] [--mock] [--mock-mode=...] <prompt-file>\n');
    process.exit(2);
  }
  const r = dispatch(args);
  // P2 (014-review maintainability-8-4): surface failure diagnostics. Previously a failed
  // executor run printed only {ok,exit_code,attempts,paused} + STDOUT, so the
  // error/pause_reason/sentinel_path fields and stderr were swallowed and the
  // failure was undiagnosable without instrumenting the module.
  process.stdout.write(JSON.stringify({
    ok: r.ok,
    exit_code: r.exit_code,
    attempts: r.attempts,
    paused: r.paused || false,
    pause_reason: r.pause_reason || null,
    sentinel_path: r.sentinel_path || null,
    error: r.error || null,
  }, null, 2) + '\n');
  process.stdout.write('--- STDOUT ---\n' + (r.stdout || '') + '\n');
  process.stdout.write('--- STDERR ---\n' + (r.stderr || '') + '\n');
  process.exit(r.ok ? 0 : 1);
}

if (require.main === module) main();

module.exports = {
  dispatch,
  dispatchReal,
  dispatchMock,
  buildSpawnSpec,
  KNOWN_EXECUTORS,
  resolveStateDir,
  pauseSentinelPath,
  writePauseSentinel,
  pauseSentinelExists,
  buildResumeHint,
  writeCapableOptIn,
};
