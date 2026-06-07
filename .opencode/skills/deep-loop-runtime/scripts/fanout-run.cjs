#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Fan-Out CLI Lineage Pool Runner                      ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  CLI args (--spec-folder, --loop-type, --fanout-config-json,      ║
// ║         --base-artifact-dir).                                            ║
// ║ Output: JSON to stdout.                                                  ║
// ║ Exit:   0=all ok, 1=script error, 2=some failed, 3=all failed.          ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const {
  classifyExitCode,
  installSignalHandlers,
  maybeThrowTestFault,
  validateNamespaceValue,
} = require('./lib/cli-guards.cjs');

const {
  runCappedPool,
  appendStatusLedger,
  writeOrchestrationSummary,
} = require('./fanout-pool.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. TSX BOOTSTRAP
// ─────────────────────────────────────────────────────────────────────────────

const TSX_LOADER = path.resolve(
  __dirname,
  '..',
  '..',
  'system-spec-kit',
  'scripts',
  'node_modules',
  'tsx',
  'dist',
  'loader.mjs',
);

if (process.env.DEEP_LOOP_TSX_LOADED !== '1') {
  const child = spawnSync(
    process.execPath,
    ['--import', TSX_LOADER, __filename, ...process.argv.slice(2)],
    {
      cwd: process.cwd(),
      env: { ...process.env, DEEP_LOOP_TSX_LOADED: '1' },
      input: process.stdin.isTTY ? undefined : fs.readFileSync(0),
      encoding: 'utf8',
    },
  );
  if (child.stdout) process.stdout.write(child.stdout);
  if (child.stderr) process.stderr.write(child.stderr);
  process.exit(child.status === null ? 1 : child.status);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      throw inputError(`Unexpected positional argument: ${token}`);
    }
    const key = token.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function inputError(message) {
  const err = new Error(message);
  err.code = 'INPUT_VALIDATION';
  return err;
}

function ensureString(args, key) {
  if (!args[key] || typeof args[key] !== 'string') {
    throw inputError(`${key} is required`);
  }
  return args[key];
}

function jsonOut(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

// Per-kind first state-dir env var (used for lockfile isolation across same-kind replicas).
const SPECKIT_STATE_ENV_BY_KIND = {
  'cli-codex': 'SPECKIT_CODEX_STATE_DIR',
  'cli-gemini': 'SPECKIT_GEMINI_STATE_DIR',
  'cli-claude-code': 'SPECKIT_CLAUDE_CODE_STATE_DIR',
  'cli-opencode': 'SPECKIT_OPENCODE_STATE_DIR',
  'cli-devin': 'SPECKIT_DEVIN_STATE_DIR',
};

/**
 * Build the "run the full loop" prompt text for a CLI lineage subprocess.
 * The subprocess reads this, loads the skill, and runs the loop to convergence
 * with config.fanout_lineage_artifact_dir overriding step_resolve_artifact_root.
 */
function buildLoopPrompt(loopType, specFolder, lineageDir, sessionId, lineage) {
  const skillFile =
    loopType === 'review'
      ? '.opencode/skills/deep-review/SKILL.md'
      : loopType === 'context'
        ? '.opencode/skills/deep-context/SKILL.md'
        : '.opencode/skills/deep-research/SKILL.md';
  const agentName = loopType === 'review' ? 'deep-review' : loopType === 'context' ? 'deep-context' : 'deep-research';
  const hasIterationCap = typeof lineage.iterations === 'number' && lineage.iterations > 0;
  const stopClause = hasIterationCap
    ? 'to convergence OR config.maxIterations, whichever comes first'
    : 'to convergence';
  const params = [
    `  spec_folder: ${specFolder}`,
    `  config.fanout_lineage_artifact_dir: ${lineageDir}`,
    `  session_id: ${sessionId}`,
    `  executor: ${lineage.kind} model=${lineage.model || 'default'}`,
    `  loop_type: ${loopType}`,
  ];
  if (hasIterationCap) {
    params.push(`  config.maxIterations: ${lineage.iterations}`);
  }
  return [
    `You are a ${agentName} agent running a fan-out lineage.`,
    ``,
    `Read ${skillFile} and execute the ${loopType} loop with these parameters:`,
    ...params,
    ``,
    `The step_resolve_artifact_root step will bind artifact_dir to ${lineageDir} via the`,
    `config.fanout_lineage_artifact_dir override — do NOT run the resolveArtifactRoot node`,
    `command; bind artifact_dir directly to the override value.`,
    ``,
    `Run phase_init, phase_main_loop (${stopClause}), and phase_synthesis.`,
    `Write all outputs to ${lineageDir}. Do not touch any path outside ${lineageDir}.`,
    ``,
    `When complete, output a single line: FANOUT_LINEAGE_COMPLETE:${lineage.label}`,
  ].join('\n');
}

/**
 * Compute a generous timeout for a full lineage loop run.
 * A single iteration is timeoutSeconds; a full loop is up to iterations * timeoutSeconds.
 * We double it for safety and cap at 4 hours.
 */
function computeLineageTimeoutMs(lineage) {
  const iters = lineage.iterations || 12;
  const perIterSecs = lineage.timeoutSeconds || 900;
  return Math.min(iters * perIterSecs * 2 * 1000, 4 * 60 * 60 * 1000);
}

/**
 * Run a lineage subprocess without blocking the Node event loop.
 *
 * Resolves a spawnSync-shaped result ({ status, signal, stdout, error }) so the
 * pool's K-in-flight cap actually overlaps lineages. spawnSync blocked the single
 * thread until each child exited, serializing every lineage regardless of the
 * concurrency cap; an awaited async spawn yields to the loop so K run at once.
 *
 * On timeout the child is killed with SIGTERM and result.signal is set to
 * 'SIGTERM', preserving the timeout-as-failure signal the caller relies on.
 *
 * @param {string} command - Executable to run.
 * @param {string[]} cmdArgs - Arguments for the executable.
 * @param {Object} opts - { cwd, env, timeoutMs, maxBuffer, input? }.
 * @returns {Promise<{status:number|null, signal:string|null, stdout:string, error?:Error}>}
 */
function runLineageProcess(command, cmdArgs, opts) {
  const { cwd, env, timeoutMs, maxBuffer } = opts;
  const hasInput = typeof opts.input === 'string';

  return new Promise((resolvePromise) => {
    let child;
    try {
      child = spawn(command, cmdArgs, {
        cwd,
        env,
        stdio: [hasInput ? 'pipe' : 'ignore', 'pipe', 'pipe'],
      });
    } catch (error) {
      resolvePromise({ status: null, signal: null, stdout: '', error });
      return;
    }

    let stdout = '';
    let stdoutBytes = 0;
    let truncated = false;
    let timedOut = false;
    let settled = false;
    let spawnError;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
    }, timeoutMs);

    child.stdout?.setEncoding('utf8');
    child.stdout?.on('data', (chunk) => {
      if (truncated) return;
      stdoutBytes += Buffer.byteLength(chunk, 'utf8');
      if (stdoutBytes > maxBuffer) {
        truncated = true;
        child.kill('SIGTERM');
        return;
      }
      stdout += chunk;
    });
    // Drain stderr so the child never blocks on a full pipe; we do not capture it.
    child.stderr?.resume();

    child.on('error', (error) => {
      spawnError = error;
    });

    child.on('close', (code, signal) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      const effectiveSignal = timedOut ? 'SIGTERM' : signal;
      resolvePromise({
        status: timedOut ? null : code,
        signal: effectiveSignal,
        stdout,
        ...(spawnError ? { error: spawnError } : {}),
      });
    });

    if (hasInput) {
      child.stdin?.on('error', () => {});
      child.stdin?.end(opts.input);
    }
  });
}

/**
 * Build the subprocess command for a CLI lineage.
 * Returns { command, args, input?, env } where input is stdin content when applicable.
 */
function buildLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission) {
  const kind = lineage.kind;

  if (kind === 'cli-codex') {
    // Only emit -c service_tier when a validated tier is set; otherwise omit the
    // pair so the Codex CLI applies its own account default. Substituting the
    // literal 'default' would push a value outside the validated tier enum.
    const args = [
      'exec',
      '--model',
      lineage.model || 'o4-mini',
      '-c',
      `model_reasoning_effort=${lineage.reasoningEffort || 'medium'}`,
    ];
    if (lineage.serviceTier) {
      args.push('-c', `service_tier=${lineage.serviceTier}`);
    }
    args.push('-c', 'approval_policy=never', '--sandbox', resolvedSandbox, '-');
    return {
      command: 'codex',
      args,
      input: prompt,
    };
  }

  if (kind === 'cli-gemini') {
    // Default must stay inside GEMINI_SUPPORTED_MODELS (executor-config), since
    // the null-model lineage skips the whitelist check and reaches the CLI as-is.
    return {
      command: 'gemini',
      args: [prompt, '-m', lineage.model || 'gemini-3.1-pro-preview', '-s', resolvedSandbox, '-y', '-o', 'text'],
    };
  }

  if (kind === 'cli-claude-code') {
    const args = [
      '-p',
      prompt,
      '--model',
      lineage.model || 'claude-opus-4-8',
      '--permission-mode',
      resolvedPermission,
      '--output-format',
      'text',
    ];
    if (lineage.reasoningEffort) {
      args.push('--effort', lineage.reasoningEffort);
    }
    return { command: 'claude', args };
  }

  if (kind === 'cli-opencode') {
    // No --agent: current opencode treats `general` as a subagent and rejects it
    // on a top-level `run`. The default agent runs when none is named, and a
    // specific agent profile can be requested in the prompt body instead.
    const args = [
      'run',
      '--model',
      lineage.model || 'anthropic/claude-opus-4-8',
      '--format',
      'json',
      '--dangerously-skip-permissions',
      '--pure',
    ];
    if (lineage.reasoningEffort) {
      args.push('--variant', lineage.reasoningEffort);
    }
    args.push(prompt);
    return { command: 'opencode', args, input: '' };
  }

  if (kind === 'cli-devin') {
    return {
      command: 'devin',
      args: [
        '--print',
        '--model',
        lineage.model || 'swe-1.6',
        '--permission-mode',
        resolvedPermission,
      ],
      input: prompt,
    };
  }

  throw inputError(`Unknown CLI executor kind: ${kind}`);
}

const {
  runSalvageSweep,
  extractTextFromOpencodeJson,
} = require('./fanout-salvage.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();
  const specFolder = validateNamespaceValue(ensureString(args, 'specFolder'), 'specFolder', inputError);
  const loopType = ensureString(args, 'loopType');
  if (loopType !== 'research' && loopType !== 'review' && loopType !== 'context') {
    throw inputError('loopType must be "research", "review", or "context"');
  }
  const fanoutConfigJson = ensureString(args, 'fanoutConfigJson');
  const baseArtifactDir = ensureString(args, 'baseArtifactDir');
  // Defense-in-depth: baseArtifactDir is host-provided, but reject path-traversal
  // segments so a malformed value cannot relocate fanout artifacts outside its tree.
  if (baseArtifactDir.split(/[\\/]/).includes('..')) {
    throw inputError('baseArtifactDir must not contain ".." path segments');
  }

  const {
    parseFanoutConfig,
    expandLineages,
    resolveCodexSandboxMode,
    resolveClaudePermissionMode,
    resolveGeminiSandboxMode,
    resolveDevinPermissionMode,
  } = await import('../lib/deep-loop/executor-config.ts');
  const { buildExecutorDispatchEnv, detectSameKindFromStack, CLI_DISPATCH_STACK_ENV } = await import('../lib/deep-loop/executor-audit.ts');

  installSignalHandlers(() => {});
  maybeThrowTestFault();

  let rawConfig;
  try {
    rawConfig = JSON.parse(fanoutConfigJson);
  } catch {
    throw inputError('fanoutConfigJson is not valid JSON');
  }

  const fanoutConfig = parseFanoutConfig(rawConfig);
  const allLineages = expandLineages(fanoutConfig);

  // Fan-out pool handles CLI lineages only; native lineages are dispatched by the YAML step.
  const cliLineages = allLineages.filter((l) => l.kind !== 'native');

  if (cliLineages.length === 0) {
    jsonOut({ status: 'ok', message: 'no CLI lineages to spawn', results: [], summary: { total: 0, succeeded: 0, failed: 0, all_failed: false } });
    return;
  }

  const lineagesDir = path.join(baseArtifactDir, 'lineages');
  const ledgerPath = path.join(baseArtifactDir, 'orchestration-status.log');
  const summaryPath = path.join(baseArtifactDir, 'orchestration-summary.json');
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  fs.mkdirSync(lineagesDir, { recursive: true });

  const { results, summary } = await runCappedPool({
    items: cliLineages,
    concurrency: fanoutConfig.concurrency,
    onEvent: (event) => appendStatusLedger(ledgerPath, event),
    worker: async (lineage) => {
      const lineageDir = path.join(lineagesDir, lineage.label);
      const stateDir = path.join(lineageDir, '.executor-state');
      fs.mkdirSync(lineageDir, { recursive: true });
      fs.mkdirSync(stateDir, { recursive: true });

      const sessionId = `fanout-${lineage.label}-${runId}`;
      const prompt = buildLoopPrompt(loopType, specFolder, lineageDir, sessionId, lineage);

      // Sandbox resolution stays write-capable by default even for review lineages:
      // the review subprocess writes its own iteration artifacts (iterations/iteration-NNN.md,
      // deep-review-state.jsonl, review-report.md, resource-map.md) INTO lineageDir, so a
      // blanket read-only default would break those writes. The lineageDir-only write boundary
      // is enforced by the prompt ('Do not touch any path outside lineageDir') rather than by a
      // narrower sandbox; a path-scoped workspace-write would be the stronger fix if the CLIs
      // exposed one. Callers can still pass an explicit sandboxMode to override.
      const resolvedSandbox = resolveCodexSandboxMode(lineage.sandboxMode);
      const resolvedPermission = resolveClaudePermissionMode(lineage.sandboxMode);
      const resolvedGeminiSandbox = resolveGeminiSandboxMode(lineage.sandboxMode);
      const resolvedDevinPermission = resolveDevinPermissionMode(lineage.sandboxMode);

      const effectiveSandbox = lineage.kind === 'cli-gemini' ? resolvedGeminiSandbox : resolvedSandbox;
      const effectivePermission = lineage.kind === 'cli-devin' ? resolvedDevinPermission : resolvedPermission;

      const { command, args: cmdArgs, input } = buildLineageCommand(
        lineage,
        prompt,
        effectiveSandbox,
        effectivePermission,
      );

      // Isolate per-kind state dirs so same-kind replicas do not collide on lockfiles.
      const stateEnvKey = SPECKIT_STATE_ENV_BY_KIND[lineage.kind];
      const extraEnv = {
        SPECKIT_FANOUT_LINEAGE_ID: lineage.label,
        ...(stateEnvKey ? { [stateEnvKey]: stateDir } : {}),
      };

      // Recursion guard (fail closed): refuse to spawn when this executor kind is
      // already on the INHERITED dispatch stack — i.e. a seat that itself runs the loop
      // tried to fan out the SAME kind again. Only the stack layer is checked here: the
      // orchestrator legitimately runs inside one of these runtimes, so the runtime-env
      // (e.g. OPENCODE_SESSION_ID) and ancestry layers would false-positive on the
      // first-level dispatch. The stack is empty at top level and only carries a kind
      // once a parent fanout stamped it via buildExecutorDispatchEnv for its child.
      if (detectSameKindFromStack(process.env[CLI_DISPATCH_STACK_ENV], lineage.kind)) {
        throw new Error(
          `recursive ${lineage.kind} dispatch blocked for lineage ${lineage.label}: ${lineage.kind} already on ${CLI_DISPATCH_STACK_ENV}`,
        );
      }

      // Stamp the dispatch stack with this lineage's executor kind so a seat that
      // tries to recursively launch the same kind is detectable by the runtime
      // recursion guard (detectSameKindFromStack reads SPECKIT_CLI_DISPATCH_STACK).
      // buildExecutorDispatchEnv filters the parent env to the per-kind allowlist,
      // so the SPECKIT_* lineage/state-dir keys are applied AFTER the filter to
      // preserve the per-replica lockfile isolation they provide.
      const dispatchEnv = { ...buildExecutorDispatchEnv(lineage, process.env), ...extraEnv };

      const timeoutMs = computeLineageTimeoutMs(lineage);

      const result = await runLineageProcess(command, cmdArgs, {
        cwd: process.cwd(),
        timeoutMs,
        env: dispatchEnv,
        maxBuffer: 20 * 1024 * 1024,
        ...(typeof input === 'string' ? { input } : {}),
      });

      // Save subprocess stdout for salvage sweep (write failures in weak CLI executors).
      const logsDir = path.join(lineageDir, 'logs');
      fs.mkdirSync(logsDir, { recursive: true });
      const savedStdout = typeof result.stdout === 'string' ? result.stdout : '';
      fs.writeFileSync(path.join(logsDir, 'fanout-lineage.out'), savedStdout, 'utf8');

      // Recover missing iteration files from captured stdout when possible. Runs
      // BEFORE the failure throw below so iteration recovery is never lost.
      const salvage = runSalvageSweep(lineageDir, loopType, savedStdout);

      const exitCode = result.status ?? (result.error ? 1 : 0);
      const timedOut = result.signal === 'SIGTERM';

      // A lineage whose CLI exits non-zero or is killed by the timeout is a FAILURE,
      // not a success. Throw so the pool settles this item as rejected and counts it
      // in summary.failed/all_failed, which drives the process exit code. Returning a
      // plain object here would let the pool record any completed worker as fulfilled
      // regardless of the underlying CLI exit, masking failed/timed-out lineages.
      if (timedOut || exitCode !== 0) {
        const failure = new Error(
          `lineage ${lineage.label} ${timedOut ? 'timed out' : `exited with code ${exitCode}`}`,
        );
        failure.label = lineage.label;
        failure.exitCode = exitCode;
        failure.timedOut = timedOut;
        failure.salvage = salvage;
        throw failure;
      }

      return { label: lineage.label, exitCode, timedOut, salvage };
    },
  });

  writeOrchestrationSummary(summaryPath, {
    run_id: runId,
    loop_type: loopType,
    spec_folder: specFolder,
    base_artifact_dir: baseArtifactDir,
    total_cli_lineages: cliLineages.length,
    ...summary,
  });

  const exitCode = summary.all_failed ? 3 : summary.failed > 0 ? 2 : 0;
  jsonOut({ status: exitCode === 0 ? 'ok' : 'partial', run_id: runId, results, summary });
  process.exit(exitCode);
}

main().catch((err) => {
  const code = classifyExitCode(err);
  jsonOut({
    status: 'error',
    error: err instanceof Error ? err.message : String(err),
    code: err && err.code ? err.code : 'SCRIPT_ERROR',
  });
  if (code === 1) {
    process.stderr.write(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err), stack: err && err.stack }) + '\n',
    );
  }
  process.exit(code);
});
