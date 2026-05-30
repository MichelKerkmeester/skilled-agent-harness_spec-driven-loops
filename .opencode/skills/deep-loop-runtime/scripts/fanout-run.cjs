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
const { spawnSync } = require('node:child_process');

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
      : '.opencode/skills/deep-research/SKILL.md';
  const agentName = loopType === 'review' ? 'deep-review' : 'deep-research';
  return [
    `You are a ${agentName} agent running a fan-out lineage.`,
    ``,
    `Read ${skillFile} and execute the ${loopType} loop with these parameters:`,
    `  spec_folder: ${specFolder}`,
    `  config.fanout_lineage_artifact_dir: ${lineageDir}`,
    `  session_id: ${sessionId}`,
    `  executor: ${lineage.kind} model=${lineage.model || 'default'}`,
    `  loop_type: ${loopType}`,
    ``,
    `The step_resolve_artifact_root step will bind artifact_dir to ${lineageDir} via the`,
    `config.fanout_lineage_artifact_dir override — do NOT run the resolveArtifactRoot node`,
    `command; bind artifact_dir directly to the override value.`,
    ``,
    `Run phase_init, phase_main_loop (to convergence), and phase_synthesis.`,
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
 * Build the subprocess command for a CLI lineage.
 * Returns { command, args, input?, env } where input is stdin content when applicable.
 */
function buildLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission) {
  const kind = lineage.kind;

  if (kind === 'cli-codex') {
    return {
      command: 'codex',
      args: [
        'exec',
        '--model',
        lineage.model || 'o4-mini',
        '-c',
        `model_reasoning_effort=${lineage.reasoningEffort || 'medium'}`,
        '-c',
        `service_tier=${lineage.serviceTier || 'default'}`,
        '-c',
        'approval_policy=never',
        '--sandbox',
        resolvedSandbox,
        '-',
      ],
      input: prompt,
    };
  }

  if (kind === 'cli-gemini') {
    return {
      command: 'gemini',
      args: [prompt, '-m', lineage.model || 'gemini-2.5-pro', '-s', resolvedSandbox, '-y', '-o', 'text'],
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
    const args = [
      'run',
      '--model',
      lineage.model || 'anthropic/claude-opus-4-8',
      '--agent',
      'general',
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
  if (loopType !== 'research' && loopType !== 'review') {
    throw inputError('loopType must be "research" or "review"');
  }
  const fanoutConfigJson = ensureString(args, 'fanoutConfigJson');
  const baseArtifactDir = ensureString(args, 'baseArtifactDir');

  const {
    parseFanoutConfig,
    expandLineages,
    resolveCodexSandboxMode,
    resolveClaudePermissionMode,
    resolveGeminiSandboxMode,
    resolveDevinPermissionMode,
  } = await import('../lib/deep-loop/executor-config.ts');

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

      const timeoutMs = computeLineageTimeoutMs(lineage);

      const result = spawnSync(command, cmdArgs, {
        cwd: process.cwd(),
        encoding: 'utf8',
        timeout: timeoutMs,
        env: { ...process.env, ...extraEnv },
        maxBuffer: 20 * 1024 * 1024,
        ...(typeof input === 'string' ? { input } : {}),
      });

      // Save subprocess stdout for salvage sweep (write failures in weak CLI executors).
      const logsDir = path.join(lineageDir, 'logs');
      fs.mkdirSync(logsDir, { recursive: true });
      const savedStdout = typeof result.stdout === 'string' ? result.stdout : '';
      fs.writeFileSync(path.join(logsDir, 'fanout-lineage.out'), savedStdout, 'utf8');

      // Recover missing iteration files from captured stdout when possible.
      const salvage = runSalvageSweep(lineageDir, loopType, savedStdout);

      const exitCode = result.status ?? (result.error ? 1 : 0);
      return { label: lineage.label, exitCode, timedOut: result.signal === 'SIGTERM', salvage };
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
