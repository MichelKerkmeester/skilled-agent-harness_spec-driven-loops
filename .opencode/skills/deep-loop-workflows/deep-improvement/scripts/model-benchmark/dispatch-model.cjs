#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ dispatch-model — model-agnostic CLI dispatcher for model-benchmark       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
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
 *   - Read-only by default: executors run in their non-write mode;
 *     write-capable evaluation requires DEEP_AGENT_DISPATCH_WRITE=1.
 *   - Pause sentinel is run-scoped: opts.state_dir / --state-dir /
 *     DEEP_AGENT_STATE_DIR pick the dir; falls back to the skill state/ dir.
 *   - Test-only seams (never set by production callers): opts._spawn overrides
 *     spawnSync; opts._backoff overrides the rate-limit backoff schedule.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS/REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync, execSync } = require('child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// This file lives in scripts/model-benchmark/, one level deeper
// than the original scripts/ root. SCRIPTS_ROOT is __dirname (model-benchmark/),
// so every path that reaches the skill root needs an extra '..' versus the
// pre-move scripts/-root depth. state/ and assets/ live at the skill root
// (scripts/../.. from here), NOT at scripts/.. .
const SCRIPTS_ROOT = __dirname;
// The pause sentinel is no longer pinned to this shared skill state dir.
// resolveStateDir() prefers a run-scoped dir so concurrent benchmark runs do not
// collide on one global .benchmark-pause file.
// LEGACY_STATE_DIR is the backstop only when no run-scoped dir is supplied.
const LEGACY_STATE_DIR = path.join(SCRIPTS_ROOT, '..', '..', 'state');
const PAUSE_SENTINEL_BASENAME = '.benchmark-pause';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Grader/benchmark dispatch is a read-only judgment: the model emits its verdict
// on stdout and must NOT mutate the workspace. Executors
// run in their READ-ONLY mode by default. Write-capable evaluation is an explicit
// opt-in via DEEP_AGENT_DISPATCH_WRITE=1 (e.g. an isolated temp workspace run).
/**
 * Report whether write-capable dispatch is opted in via DEEP_AGENT_DISPATCH_WRITE.
 *
 * @returns {boolean} True when the env var is '1' or 'true', else false.
 */
function writeCapableOptIn() {
  const v = process.env.DEEP_AGENT_DISPATCH_WRITE;
  return v === '1' || v === 'true';
}

/**
 * Resolve the run-scoped state directory for the pause sentinel.
 *
 * @param {Object} opts - Dispatch options; opts.state_dir takes precedence.
 * @returns {string} The chosen state directory path.
 */
function resolveStateDir(opts) {
  return (
    (opts && opts.state_dir) ||
    process.env.DEEP_AGENT_STATE_DIR ||
    LEGACY_STATE_DIR
  );
}

/**
 * Build the absolute path to the pause sentinel file for a run.
 *
 * @param {Object} opts - Dispatch options forwarded to resolveStateDir.
 * @returns {string} The pause sentinel file path.
 */
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
    } catch (err) {
      if (err && err.code === 'ENOENT') continue;
      console.warn('dispatch-model: could not parse optional config ' + file + ': ' + (err.message || err));
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
]);

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

// Synchronous sleep without a busy-wait prevents long rate-limit backoffs from
// burning a full core. Atomics.wait blocks the thread on an un-signalled buffer
// for the timeout, yielding the CPU.
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
    return path.resolve(SCRIPTS_ROOT, '..', '..', '..', '..', '..', '..');
  }
}

function detectRateLimit(combinedOutput) {
  return RATE_LIMIT_PATTERNS.some((re) => re.test(combinedOutput));
}

// Derive a provider id from a model slug's `provider/model` prefix. cli model
// ids carry the provider as a path segment (e.g. `minimax-coding-plan/MiniMax-...`
// or `anthropic/claude-...`); a bare slug with no slash has no derivable provider,
// so return null rather than guessing.
function deriveProvider(modelSlug) {
  if (typeof modelSlug !== 'string') return null;
  const slash = modelSlug.indexOf('/');
  if (slash <= 0) return null;
  return modelSlug.slice(0, slash);
}

// Coerce a candidate usage value to a finite number, or null. Token/cost fields
// are reported as null when unknown — NEVER a fabricated 0 — so downstream
// aggregation can distinguish "provider did not report usage" from "zero usage".
function finiteOrNull(v) {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  return null;
}

// Probe an event object for usage fields at the locations OpenCode's event shape
// plausibly carries them. The live binary's usage payload is UNVERIFIED (the
// event-stream text shape is confirmed, the usage fields are not), so every
// access is defensive: any missing branch leaves the value null. Recognized
// shapes: a `usage`/`tokens` object with input/output token counts, and a
// numeric `cost`/`cost_usd`. Returns { tokens_in, tokens_out, cost_usd } with
// nulls for whatever is absent.
function probeUsageFromEvent(ev) {
  const out = { tokens_in: null, tokens_out: null, cost_usd: null };
  if (!ev || typeof ev !== 'object') return out;
  // Usage commonly hangs off the event, a nested part, or a session payload.
  const carriers = [ev, ev.part, ev.session, ev.message, ev.info].filter(
    (c) => c && typeof c === 'object',
  );
  for (const c of carriers) {
    const usage = c.usage || c.tokens || null;
    if (usage && typeof usage === 'object') {
      if (out.tokens_in == null) {
        out.tokens_in = finiteOrNull(
          usage.input != null ? usage.input
            : usage.input_tokens != null ? usage.input_tokens
              : usage.prompt_tokens != null ? usage.prompt_tokens
                : usage.tokens_in,
        );
      }
      if (out.tokens_out == null) {
        out.tokens_out = finiteOrNull(
          usage.output != null ? usage.output
            : usage.output_tokens != null ? usage.output_tokens
              : usage.completion_tokens != null ? usage.completion_tokens
                : usage.tokens_out,
        );
      }
    }
    if (out.cost_usd == null) {
      const cost = c.cost != null ? c.cost : c.cost_usd;
      if (cost && typeof cost === 'object') {
        out.cost_usd = finiteOrNull(cost.total != null ? cost.total : cost.usd);
      } else {
        out.cost_usd = finiteOrNull(cost);
      }
    }
  }
  return out;
}

// Parse a cli-opencode `--format json` stdout (newline-delimited JSON events).
// Returns { output, tokens_in, tokens_out, cost_usd, usage_parser_status }:
//   - output: assembled assistant text from `type === 'text'` events, ordered by
//     part start time (mirrors the sweep extractor shape). Empty string
//     when no text events are present.
//   - usage fields: extracted from the events when exposed, else null.
//   - usage_parser_status: 'parsed' (≥1 usage field found), 'absent' (events
//     parsed cleanly but carried no usage), or 'error' (no line parsed as JSON —
//     i.e. not an event stream / malformed / empty).
// Defensive by contract: a malformed or empty stream yields output '' and null
// usage with status 'error' so the caller can fall back to raw stdout.
function parseOpencodeStream(stdout) {
  const result = {
    output: '',
    tokens_in: null,
    tokens_out: null,
    cost_usd: null,
    usage_parser_status: 'absent',
  };
  const lines = String(stdout || '').split(/\r?\n/).filter(Boolean);
  const parts = [];
  let sawEvent = false;
  for (const line of lines) {
    let ev;
    try {
      ev = JSON.parse(line);
    } catch (_) {
      continue; // non-JSON line (e.g. a stray log) is skipped, not fatal.
    }
    sawEvent = true;
    if (ev && ev.type === 'text' && ev.part && typeof ev.part.text === 'string') {
      parts.push({ text: ev.part.text, start: (ev.part.time && ev.part.time.start) || 0 });
    }
    const usage = probeUsageFromEvent(ev);
    if (usage.tokens_in != null && result.tokens_in == null) result.tokens_in = usage.tokens_in;
    if (usage.tokens_out != null && result.tokens_out == null) result.tokens_out = usage.tokens_out;
    if (usage.cost_usd != null && result.cost_usd == null) result.cost_usd = usage.cost_usd;
  }
  if (!sawEvent) {
    // Nothing parsed as a JSON event — not an OpenCode stream. Signal 'error' so
    // the caller keeps the raw stdout as output and leaves usage null.
    result.usage_parser_status = 'error';
    return result;
  }
  parts.sort((x, y) => x.start - y.start);
  result.output = parts.map((p) => p.text).join('');
  if (result.tokens_in != null || result.tokens_out != null || result.cost_usd != null) {
    result.usage_parser_status = 'parsed';
  }
  return result;
}

// Wrap a raw dispatch result in the normalized cross-executor envelope. ADD-only:
// every existing key on `raw` is preserved (callers/tests that read ok/exit_code/
// stdout/stderr/attempts/paused/etc. keep working); the envelope layers the
// model-agnostic fields on top. `output` is the clean assistant text (parsed from
// the cli-opencode event stream, else raw stdout). Token/cost stay null unless an
// executor's parser fills them.
function buildEnvelope(raw, resolved, executor, latencyMs) {
  const env = Object.assign({}, raw);
  env.latency_ms = Number.isFinite(latencyMs) ? latencyMs : null;
  env.executor = executor || null;
  env.model = (resolved && resolved.model) || null;
  env.variant = (resolved && resolved.variant) || null;
  env.provider = deriveProvider(env.model);
  // Usage is null until a parser proves otherwise. Preserve any value a caller
  // already set on raw (none do today), else default null — never fabricate.
  env.tokens_in = finiteOrNull(raw && raw.tokens_in);
  env.tokens_out = finiteOrNull(raw && raw.tokens_out);
  env.cost_usd = finiteOrNull(raw && raw.cost_usd);

  // cli-opencode emits the JSON event stream (--format json). Parse it for clean
  // assistant text + usage; fall back to raw stdout on a malformed/empty stream.
  if (!raw.mock && executor === 'cli-opencode' && typeof raw.stdout === 'string') {
    const parsed = parseOpencodeStream(raw.stdout);
    env.usage_parser_status = parsed.usage_parser_status;
    env.output = parsed.usage_parser_status === 'error'
      ? raw.stdout
      : (parsed.output || raw.stdout);
    if (parsed.tokens_in != null) env.tokens_in = parsed.tokens_in;
    if (parsed.tokens_out != null) env.tokens_out = parsed.tokens_out;
    if (parsed.cost_usd != null) env.cost_usd = parsed.cost_usd;
  } else if (env.output == null) {
    // Plain-text executors (and mock) return assistant text directly on stdout.
    env.output = typeof raw.stdout === 'string' ? raw.stdout : '';
  }
  return env;
}

// Emit a resume command that removes the real run-scoped sentinel path and
// invokes the loop-host at its shipped lane path.
/**
 * Build a copy-paste resume command that clears the sentinel and restarts the loop.
 *
 * @param {string} sentinelPath - Absolute path to the run's pause sentinel file.
 * @returns {string} A shell command string that removes the sentinel and reruns the loop-host.
 */
function buildResumeHint(sentinelPath) {
  const root = repoRoot();
  const relSentinel = path.relative(root, sentinelPath) || sentinelPath;
  const loopHost = path.join(
    '.opencode', 'skills', 'deep-loop-workflows', 'deep-improvement', 'scripts', 'shared', 'loop-host.cjs',
  );
  return `rm ${shellQuote(relSentinel)} && node ${shellQuote(loopHost)} --mode=model-benchmark --profile=<profile> --outputs-dir=<outputs-dir>`;
}

/**
 * Quote a value for POSIX shell command display.
 *
 * @param {string} value - Raw shell argument.
 * @returns {string} Single-quoted shell argument.
 */
function shellQuote(value) {
  return "'" + String(value).replace(/'/g, "'\\''") + "'";
}

/**
 * Write the pause sentinel file recording why dispatch paused.
 *
 * @param {string} reason - Human-readable pause reason recorded in the sentinel.
 * @param {Object} opts - Dispatch options used to resolve the sentinel path.
 * @returns {string} The path of the sentinel file that was written.
 */
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

/**
 * Report whether a pause sentinel file exists for the run.
 *
 * @param {Object} opts - Dispatch options used to resolve the sentinel path.
 * @returns {boolean} True when the sentinel file exists, else false.
 */
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
  // Read-only is the default; write-capable is the explicit opt-in.
  const writeCapable = writeCapableOptIn();
  switch (executor) {
    case 'cli-opencode': {
      // opencode `run` does not auto-approve arbitrary edits, so no write-grant
      // flag is added; routing is preserved unchanged.
      // Omit `--agent` for the default `general`: current opencode treats `general`
      // as a subagent and rejects it at the top level (warns + falls back), and
      // token-plan providers (MiniMax, Xiaomi MiMo) reject it outright. Pass
      // `--agent` only for an explicit non-general primary agent.
      const args = ['run', '--model', model, '--dir', dir];
      if (agent && agent !== 'general') args.push('--agent', agent);
      if (variant) args.push('--variant', variant);
      // Emit the newline-delimited JSON event stream so the envelope parser can
      // assemble clean assistant text and read usage (tokens/cost) when the
      // events expose it. Placed after model/variant, before the prompt, to keep
      // every flag ahead of the positional prompt arg.
      args.push('--format', 'json');
      // opencode run accepts the prompt as a positional argument; keeping flags
      // before it avoids changing argv parsing while preserving current output.
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
    default:
      throw new Error(`Unknown executor: ${executor}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run a real executor dispatch with rate-limit backoff and pause-sentinel handling.
 *
 * @param {Object} opts - Dispatch options (prompt_file, executor, model, variant, cwd, timeout_ms, etc.).
 * @returns {Object} The normalized dispatch envelope (ok, exit_code, stdout, stderr, attempts, paused, ...).
 */
function dispatchReal(opts) {
  // Wall-clock start for the normalized envelope's latency_ms (per-dispatch,
  // inclusive of retries/backoff — the real elapsed cost of getting a result).
  const t0 = Date.now();
  const executor = opts.executor || TARGET.executor || 'cli-opencode';
  if (!KNOWN_EXECUTORS.has(executor)) {
    return buildEnvelope(
      { ok: false, exit_code: -1, stdout: '', stderr: '', attempts: 0, error: `unknown executor: ${executor}` },
      { model: opts.model || null, variant: opts.variant || null },
      executor,
      Date.now() - t0,
    );
  }
  const timeout = opts.timeout_ms || DEFAULT_TIMEOUT_MS;
  const dir = opts.cwd || repoRoot();
  // Injectable spawn for tests that assert cwd reaches the spawn layer.
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
      // Set cwd for every executor so non-opencode CLIs do not silently inherit
      // the host process cwd.
      cwd: dir,
      // Close stdin for executors that receive the prompt through argv to avoid
      // opencode's stdin-hang bug.
      input: spec.input == null ? undefined : spec.input,
      stdio: spec.input == null ? ['ignore', 'pipe', 'pipe'] : ['pipe', 'pipe', 'pipe'],
      timeout,
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    });
    lastStdout = res.stdout || '';
    lastStderr = res.stderr || '';
    if (res.status === 0) {
      return buildEnvelope({ ok: true, exit_code: 0, stdout: lastStdout, stderr: lastStderr, attempts: attempt + 1 }, resolved, executor, Date.now() - t0);
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
/**
 * Return canned model-agnostic output for a dry-run dispatch, shaped by mock_mode.
 *
 * @param {Object} opts - Dispatch options; opts.mock_mode selects high-score/low-score/default.
 * @returns {Object} A mock dispatch result (ok, exit_code, mock, stdout, stderr, attempts).
 */
function dispatchMock(opts) {
  const t0 = Date.now();
  const mockMode = opts.mock_mode || 'default';
  const promptText = fs.readFileSync(opts.prompt_file, 'utf8');
  const promptHash = sha256Hex(promptText).slice(0, 8);

  if (mockMode === 'high-score') {
    return buildEnvelope({
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
    }, { model: opts.model || null, variant: opts.variant || null }, opts.executor || null, Date.now() - t0);
  }
  if (mockMode === 'low-score') {
    return buildEnvelope({
      ok: true, exit_code: 0, mock: true, stderr: '', attempts: 1,
      stdout: `Here you go: \`export const formatBytes = vitest.computeBytes;\`. Used --reasoning-effort high.`,
    }, { model: opts.model || null, variant: opts.variant || null }, opts.executor || null, Date.now() - t0);
  }
  return buildEnvelope({
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
  }, { model: opts.model || null, variant: opts.variant || null }, opts.executor || null, Date.now() - t0);
}

/**
 * Top-level dispatch: honor an existing pause sentinel, then route to mock or real.
 *
 * @param {Object} opts - Dispatch options (prompt_file, executor, model, mock, mock_mode, etc.).
 * @returns {Object} The dispatch result envelope from the mock or real path.
 */
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
  // Surface failure diagnostics so non-interactive callers can diagnose a
  // failed executor run without instrumenting this module.
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  dispatch,
  dispatchReal,
  dispatchMock,
  buildSpawnSpec,
  buildEnvelope,
  parseOpencodeStream,
  deriveProvider,
  KNOWN_EXECUTORS,
  resolveStateDir,
  pauseSentinelPath,
  writePauseSentinel,
  pauseSentinelExists,
  buildResumeHint,
  writeCapableOptIn,
};
