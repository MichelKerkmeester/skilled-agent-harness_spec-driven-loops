#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// Dispatch the eight README-refresh children through the shared runtime.
//
// Process construction and execution are deliberately NOT implemented here. The
// cli-pi contract is explicit that the shared deep-loop runtime owns both and that
// a packet must not add its own wrapper, spawn path or command builder, because a
// second builder is how a dispatch quietly loses `--offline`, the stdin redirect,
// or the provider-qualified model id. So this file imports the runtime's exported
// `buildLineageCommand` (which composes the cli-pi argv) and `runLineageProcess`
// (which spawns, bounds and captures it), and adds only what the runtime does not
// own: this task's prompt files, a three-way concurrency cap, and one log per child.
//
// Usage:
//   node dispatch-readmes.cjs                       # all eight, three at a time
//   node dispatch-readmes.cjs --only pi             # one child
//   node dispatch-readmes.cjs --concurrency 2
//   node dispatch-readmes.cjs --timeout-min 25
//
// Exit: 0 when every child exited 0, 2 when some failed, 3 when none ran.
// ───────────────────────────────────────────────────────────────
'use strict';

const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const PACKET = path.resolve(HERE, '..');
const ROOT = path.resolve(PACKET, '../../..');
const PROMPTS = path.join(HERE, 'prompts');
const LOGS = path.join(HERE, 'logs');
const RUNTIME = path.join(ROOT, '.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs');

const MODEL = 'glm-5.3-flash';
const EFFORT = 'high';
const SANDBOX = 'workspace-write';
const RUNTIMES = ['claude-code', 'codex', 'cursor', 'devin', 'hermes', 'jev', 'opencode', 'pi'];

// ── args ────────────────────────────────────────────────────────────────────
function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const ONLY = argValue('--only', null);
const CONCURRENCY = Math.max(1, Number(argValue('--concurrency', '3')));
const TIMEOUT_MIN = Math.max(1, Number(argValue('--timeout-min', '25')));
const TIMEOUT_MS = TIMEOUT_MIN * 60 * 1000;
const DRY = process.argv.includes('--dry-run');

// ── runtime ─────────────────────────────────────────────────────────────────
const { buildLineageCommand, isPiBinaryAvailable, runLineageProcess } = require(RUNTIME);

function childEnv() {
  return {
    ...process.env,
    // The spec-folder question is unanswerable in a dispatched child, so the gate is
    // pre-resolved both in the environment (which makes the exemption true) and in the
    // prompt (which is the only place the model can observe it).
    AI_SESSION_CHILD: '1',
    SYSTEM_SPEC_GATE_ENFORCE: '0',
    // The operator's global Pi packages load in a dispatched child, and pi-blackhole
    // compacts it mid-run: a child still reading when that fires starts over and can
    // loop without ever editing. Passive mode switches off its background workers.
    PI_BLACKHOLE_PASSIVE: 'true',
  };
}

function buildOne(runtime) {
  const promptPath = path.join(PROMPTS, `${runtime}.md`);
  if (!fs.existsSync(promptPath)) throw new Error(`missing prompt: ${promptPath}`);
  const prompt = fs.readFileSync(promptPath, 'utf8');
  const lineage = { kind: 'cli-pi', model: MODEL, reasoningEffort: EFFORT };
  const built = buildLineageCommand(lineage, prompt, SANDBOX, null, { env: process.env });
  return { runtime, promptPath, built };
}

async function runOne(job) {
  const { runtime, built } = job;
  const logPath = path.join(LOGS, `${runtime}.log`);
  const startedAt = Date.now();

  const out = await runLineageProcess(built.command, built.args, {
    cwd: ROOT,
    env: childEnv(),
    timeoutMs: TIMEOUT_MS,
    maxBuffer: 32 * 1024 * 1024,
    input: built.input,
  });

  const durationMs = Date.now() - startedAt;
  const timedOut = out.status === null && out.signal === 'SIGTERM';

  const log = [
    `# child: cli-${runtime}`,
    `# command: ${built.command} ${built.args.slice(0, -1).join(' ')} <prompt>`,
    `# model: ${MODEL}  effort: ${EFFORT}  sandbox: ${SANDBOX}`,
    `# invocationFingerprint: ${built.invocationFingerprint}`,
    `# executableVersion: ${built.effectiveConfig.executableVersion}`,
    `# promptPath: ${path.relative(ROOT, job.promptPath)}`,
    `# timeoutMs: ${TIMEOUT_MS}  durationMs: ${durationMs}  timedOut: ${timedOut}`,
    `# exitStatus: ${out.status}  signal: ${out.signal}`,
    `# stdoutBytes: ${Buffer.byteLength(out.stdout, 'utf8')}  stderrBytes: ${Buffer.byteLength(out.stderr, 'utf8')}`,
    '',
    '────── STDOUT ──────',
    out.stdout || '(empty)',
    '',
    '────── STDERR ──────',
    out.stderr || '(empty)',
  ].join('\n');
  fs.writeFileSync(logPath, log);

  return {
    runtime,
    logPath: path.relative(ROOT, logPath),
    status: out.status,
    signal: out.signal,
    timedOut,
    durationMs,
    stdoutBytes: Buffer.byteLength(out.stdout, 'utf8'),
    stderrBytes: Buffer.byteLength(out.stderr, 'utf8'),
    error: out.error ? String(out.error.message || out.error) : null,
    invocationFingerprint: built.invocationFingerprint,
  };
}

// ── main ────────────────────────────────────────────────────────────────────
(async () => {
  fs.mkdirSync(LOGS, { recursive: true });

  // cli-pi hard rule: probe before every dispatch, and refuse without constructing.
  if (!isPiBinaryAvailable(process.env)) {
    console.error('FATAL: command -v pi failed. Refusing to construct a dispatch.');
    process.exit(3);
  }

  const targets = RUNTIMES.filter((r) => !ONLY || r === ONLY);
  const jobs = targets.map(buildOne);

  for (const job of jobs) {
    const shown = job.built.args.map((a) => (a.length > 60 ? `<prompt ${a.length} chars>` : a)).join(' ');
    console.log(`cli-${job.runtime.padEnd(12)} ${job.built.command} ${shown}`);
  }
  if (DRY) {
    console.log(`\ndry run: ${jobs.length} job(s), concurrency ${CONCURRENCY}, timeout ${TIMEOUT_MIN}m`);
    process.exit(0);
  }

  console.log(`\ndispatching ${jobs.length} job(s), ${CONCURRENCY} at a time, ${TIMEOUT_MIN}m timeout each\n`);

  const results = [];
  let cursor = 0;
  async function worker(id) {
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      console.log(`[w${id}] start  cli-${job.runtime}`);
      const result = await runOne(job);
      results.push(result);
      console.log(
        `[w${id}] done   cli-${job.runtime.padEnd(12)} status=${result.status} signal=${result.signal}` +
          `${result.timedOut ? ' TIMED OUT' : ''} ${(result.durationMs / 1000).toFixed(0)}s ` +
          `stdout=${result.stdoutBytes}B -> ${result.logPath}`,
      );
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, (_, i) => worker(i + 1)));

  results.sort((a, b) => a.runtime.localeCompare(b.runtime));
  fs.writeFileSync(path.join(LOGS, 'dispatch-manifest.json'), JSON.stringify({ model: MODEL, effort: EFFORT, sandbox: SANDBOX, timeoutMs: TIMEOUT_MS, concurrency: CONCURRENCY, results }, null, 2));

  const ok = results.filter((r) => r.status === 0).length;
  console.log(`\nsummary: ${ok}/${results.length} exited 0`);
  for (const r of results) {
    if (r.status !== 0) console.log(`  FAILED cli-${r.runtime}: status=${r.status} signal=${r.signal}`);
  }
  process.exit(results.length === 0 ? 3 : ok === results.length ? 0 : 2);
})();
