#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ codex-dispatch — runtime-owned single-shot cli-codex dispatch helper      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * codex-dispatch.cjs — the runtime's single-shot codex execution adapter.
 *
 * cli-codex mandates that `codex exec` be spawned ONLY from the deep-loop
 * runtime, never from a packet-local adapter (its single-adapter hard rule).
 * The fan-out orchestrator (fanout-run.cjs) owns multi-lineage iteration loops;
 * this helper owns the complementary case: one synchronous request/response,
 * used by measurement harnesses (e.g. the Lane C skill-benchmark live path) that
 * need a single routing-analysis reply rather than a convergence loop.
 *
 * Flag choices mirror fanout-run.cjs's codex branch (model /
 * model_reasoning_effort / service_tier / approval_policy=never / sandbox /
 * prompt-via-stdin) so both codex paths behave identically, and it adds
 * `-o <file>` last-message capture so callers get a clean reply to parse
 * instead of the full exec log.
 *
 * Kill discipline (cli-codex single-dispatch): spawnSync owns the primary
 * timeout kill; on timeout we additionally reap the dispatch's OWN child tree by
 * captured PID (`pkill -9 -P <pid>`) — never a blanket `pkill -f codex`, which
 * would kill an operator's unrelated codex sessions.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_MODEL = process.env.SKILL_BENCH_CODEX_MODEL || 'gpt-5.6-luna';
const DEFAULT_EFFORT = process.env.SKILL_BENCH_CODEX_EFFORT || 'xhigh';
const DEFAULT_TIER = process.env.SKILL_BENCH_CODEX_TIER || 'fast';
// Analysis-only by default: a benchmark subject must never edit the tree.
const DEFAULT_SANDBOX = process.env.SKILL_BENCH_CODEX_SANDBOX || 'read-only';
// xhigh/max are slow; default generous, overridable. spawnSync SIGKILLs on breach.
const DEFAULT_TIMEOUT_MS = Number(process.env.SKILL_BENCH_CODEX_TIMEOUT_MS || 480000);
const MAX_BUFFER = 32 * 1024 * 1024;

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Probe for the codex binary (cli-codex availability hard rule). A dispatch is
 * refused — not constructed — when this fails.
 *
 * @param {Object} [env] - Environment to probe under.
 * @returns {boolean} True when `command -v codex` succeeds.
 */
function isCodexAvailable(env = process.env) {
  const r = spawnSync('/bin/sh', ['-c', 'command -v codex >/dev/null 2>&1'], { env, stdio: 'ignore' });
  return r.status === 0;
}

/**
 * Reap the dispatch's own child process tree after a timeout. Scoped to the
 * captured PID and its direct children only — never a machine-wide codex sweep.
 *
 * @param {number} pid - The spawned codex PID to clean up under.
 * @returns {void}
 */
function reapOrphans(pid) {
  if (!pid) return;
  try {
    spawnSync('/bin/sh', ['-c', `pkill -9 -P ${pid} 2>/dev/null; kill -9 ${pid} 2>/dev/null`], { stdio: 'ignore' });
  } catch (_) { /* best-effort cleanup */ }
}

/**
 * Dispatch one `codex exec` request synchronously and capture its last message.
 *
 * @param {Object} [opts] - Dispatch inputs.
 * @param {string} opts.prompt - The prompt delivered on stdin.
 * @param {string} [opts.cwd] - Working/project dir for the run.
 * @param {string} [opts.model] - Model id (default env/gpt-5.6-luna).
 * @param {string} [opts.effort] - Reasoning effort (default env/xhigh).
 * @param {string} [opts.tier] - Service tier (default env/fast).
 * @param {string} [opts.sandbox] - Sandbox mode (default read-only).
 * @param {number} [opts.timeoutMs] - Per-dispatch timeout.
 * @returns {{status:(number|null), timedOut:boolean, lastMessage:string,
 *   stdout:string, stderr:string, model:string, effort:string, tier:string,
 *   sandbox:string, pid:(number|undefined), error?:string}}
 */
function dispatchCodex({ prompt, cwd, model, effort, tier, sandbox, timeoutMs } = {}) {
  const chosenModel = model || DEFAULT_MODEL;
  const chosenEffort = effort || DEFAULT_EFFORT;
  const chosenTier = tier || DEFAULT_TIER;
  const chosenSandbox = sandbox || DEFAULT_SANDBOX;

  if (!isCodexAvailable()) {
    return {
      status: null, timedOut: false, lastMessage: '', stdout: '', stderr: '',
      model: chosenModel, effort: chosenEffort, tier: chosenTier, sandbox: chosenSandbox,
      error: 'codex binary unavailable (command -v codex failed)',
    };
  }

  const outFile = path.join(os.tmpdir(), `codex-last-${process.pid}-${Date.now()}-${Math.floor(process.hrtime()[1])}.txt`);
  const args = [
    'exec',
    '--model', chosenModel,
    '-c', `model_reasoning_effort=${chosenEffort}`,
    '-c', `service_tier=${chosenTier}`,
    '-c', 'approval_policy=never',
    '--sandbox', chosenSandbox,
    '-o', outFile,
    '-', // read the prompt from stdin (matches the fan-out adapter)
  ];

  const res = spawnSync('codex', args, {
    cwd: cwd || process.cwd(),
    input: prompt || '',
    encoding: 'utf8',
    timeout: timeoutMs || DEFAULT_TIMEOUT_MS,
    killSignal: 'SIGKILL',
    maxBuffer: MAX_BUFFER,
    env: { ...process.env, AI_SESSION_CHILD: '1' },
  });

  const timedOut = res.signal === 'SIGKILL' || res.signal === 'SIGTERM'
    || !!(res.error && res.error.code === 'ETIMEDOUT');
  if (timedOut) reapOrphans(res.pid);

  let lastMessage = '';
  try {
    if (fs.existsSync(outFile)) lastMessage = fs.readFileSync(outFile, 'utf8');
  } catch (_) { /* fall back to stdout below */ }
  try {
    if (fs.existsSync(outFile)) fs.unlinkSync(outFile);
  } catch (_) { /* temp cleanup best-effort */ }

  return {
    status: res.status,
    timedOut,
    lastMessage: (lastMessage || '').trim(),
    stdout: res.stdout || '',
    stderr: res.stderr || '',
    model: chosenModel,
    effort: chosenEffort,
    tier: chosenTier,
    sandbox: chosenSandbox,
    pid: res.pid,
    ...(res.error && !timedOut ? { error: res.error.message } : {}),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { dispatchCodex, isCodexAvailable, DEFAULT_MODEL, DEFAULT_EFFORT, DEFAULT_TIER };

// Manual smoke test: pipe a prompt on stdin, or pass --prompt "..."; prints the
// JSON dispatch result. Used to validate flags/auth before a benchmark batch.
if (require.main === module) {
  const argv = process.argv.slice(2);
  const opts = {};
  for (let i = 0; i < argv.length; i += 1) {
    const m = /^--([a-z][a-z-]*)$/.exec(argv[i]);
    if (m && argv[i + 1] !== undefined && !argv[i + 1].startsWith('--')) { opts[m[1]] = argv[i + 1]; i += 1; }
    else if (m) opts[m[1]] = true;
  }
  const prompt = opts.prompt || fs.readFileSync(0, 'utf8');
  const out = dispatchCodex({
    prompt,
    cwd: opts.cwd,
    model: opts.model,
    effort: opts.effort,
    tier: opts.tier,
    sandbox: opts.sandbox,
    timeoutMs: opts.timeout ? Number(opts.timeout) : undefined,
  });
  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
  process.exit(out.status === 0 ? 0 : 1);
}
