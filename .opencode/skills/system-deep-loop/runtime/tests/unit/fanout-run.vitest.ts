// ───────────────────────────────────────────────────────────────────
// MODULE: Fanout Run Unit Tests
// ───────────────────────────────────────────────────────────────────

import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

import { afterEach, describe, expect, it } from 'vitest';

import {
  createHermeticEnv,
  recordScriptRun,
  replayScriptRun,
  runtimeRoot,
  spawnCjs as rawSpawnCjs,
  type HermeticEnv,
  type SpawnCjsOptions,
  type SpawnCjsResult,
} from '../helpers/spawn-cjs';
import { detectSameKindFromStack } from '../../lib/deep-loop/executor-audit.js';

const tempDirs: string[] = [];
const hermeticEnvs: HermeticEnv[] = [];
const requireCjs = createRequire(import.meta.url);

type WaitCheckpointFixture = {
  status?: string;
  nextRunAt?: string | null;
  remainingDelayMs?: number | null;
};

function makeTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

function useHermeticEnv(testId: string): HermeticEnv {
  const hermetic = createHermeticEnv(testId);
  hermeticEnvs.push(hermetic);
  return hermetic;
}

function envWithBin(hermetic: HermeticEnv, binDir: string, env: NodeJS.ProcessEnv = {}): NodeJS.ProcessEnv {
  return {
    ...hermetic.env,
    ...env,
    PATH: `${binDir}:${hermetic.env['PATH'] ?? ''}`,
  };
}

function makeBaseArtifactDir(hermetic: HermeticEnv, specFolder: string, loopType: 'research' | 'review'): string {
  const dir = join(hermetic.tmpDir, specFolder, loopType);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function isPathInside(childPath: string, parentPath: string): boolean {
  const rel = relative(resolve(parentPath), resolve(childPath));
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

function canonicalizeFanoutArgs(
  scriptPath: string,
  args: string[],
  options: SpawnCjsOptions,
): string[] {
  if (scriptPath !== fanoutRunScript) return args;
  const specIndex = args.indexOf('--spec-folder');
  const loopIndex = args.indexOf('--loop-type');
  const baseIndex = args.indexOf('--base-artifact-dir');
  if (specIndex < 0 || loopIndex < 0 || baseIndex < 0) return args;
  const cwd = options.cwd ?? runtimeRoot;
  const specFolder = args[specIndex + 1];
  const loopType = args[loopIndex + 1] as 'research' | 'review';
  const rawBaseDir = args[baseIndex + 1];
  if (!specFolder || !loopType || !rawBaseDir) return args;

  const resolvedBaseDir = resolve(cwd, rawBaseDir);
  const expectedRoot = resolve(cwd, specFolder, loopType);
  if (isPathInside(resolvedBaseDir, expectedRoot)) return args;

  const canonicalBaseDir = resolve(expectedRoot, 'fanout-test-artifacts');
  mkdirSync(canonicalBaseDir, { recursive: true });
  if (existsSync(resolvedBaseDir)) {
    cpSync(resolvedBaseDir, canonicalBaseDir, { recursive: true, force: true });
    rmSync(resolvedBaseDir, { recursive: true, force: true });
  }
  mkdirSync(resolve(resolvedBaseDir, '..'), { recursive: true });
  symlinkSync(canonicalBaseDir, resolvedBaseDir, 'dir');

  const nextArgs = [...args];
  nextArgs[baseIndex + 1] = canonicalBaseDir;
  return nextArgs;
}

function spawnCjs(
  scriptPath: string,
  args: string[] = [],
  options: SpawnCjsOptions = {},
): Promise<SpawnCjsResult> {
  return rawSpawnCjs(scriptPath, canonicalizeFanoutArgs(scriptPath, args, options), options);
}

function spawnFanout(
  testId: string,
  args: string[] = [],
  options: Omit<SpawnCjsOptions, 'cwd' | 'env'> & { env?: NodeJS.ProcessEnv } = {},
): Promise<{ hermetic: HermeticEnv; result: SpawnCjsResult }> {
  const hermetic = useHermeticEnv(testId);
  const { env, ...rest } = options;
  return spawnCjs(fanoutRunScript, args, {
    ...rest,
    cwd: hermetic.tmpDir,
    env: { ...hermetic.env, ...env },
  }).then((result) => ({ hermetic, result }));
}

/**
 * Write a stub binary at `binDir/{name}` that exits 0.
 * Used to simulate headless CLI executors without real API keys.
 */
function writeStubBinary(binDir: string, name: string): string {
  const stubPath = join(binDir, name);
  writeFileSync(
    stubPath,
    ['#!/bin/sh', 'write_fanout_artifacts', 'echo "stub-done"', 'exit 0', ''].join('\n')
      .replace('write_fanout_artifacts', writeFanoutArtifactsShell()),
    { mode: 0o755 },
  );
  return stubPath;
}

function writeNativeOpencodeStubBinary(binDir: string): string {
  const stubPath = join(binDir, 'opencode');
  writeFileSync(
    stubPath,
    [
      '#!/bin/sh',
      'payload="$*"',
      'lineage_dir=$(printf "%s\\n" "$payload" | sed -n "s/.*--fanout-lineage-artifact-dir=//p" | sed "s/[[:space:]].*//" | head -n 1)',
      'if [ -n "$lineage_dir" ]; then',
      '  mkdir -p "$lineage_dir"',
      '  printf "ok\\n" > "$lineage_dir/research.md"',
      '  printf "ok\\n" > "$lineage_dir/review-report.md"',
      'fi',
      'echo "native-stub-done"',
      'exit 0',
      '',
    ].join('\n'),
    { mode: 0o755 },
  );
  return stubPath;
}

function writeNoArtifactStubBinary(binDir: string, name: string): string {
  const stubPath = join(binDir, name);
  writeFileSync(stubPath, '#!/bin/sh\necho "stub-done-without-artifact"\nexit 0\n', { mode: 0o755 });
  return stubPath;
}

/**
 * Write a stub binary at `binDir/{name}` that exits with `code`.
 * Used to assert that a non-zero CLI exit is counted as a fan-out failure.
 */
function writeFailingStubBinary(binDir: string, name: string, code: number): string {
  const stubPath = join(binDir, name);
  writeFileSync(stubPath, `#!/bin/sh\necho "stub-fail"\nexit ${code}\n`, { mode: 0o755 });
  return stubPath;
}

function writeFlakySalvageMissStubBinary(binDir: string, name: string, counterPath: string): string {
  const stubPath = join(binDir, name);
  writeFileSync(
    stubPath,
    [
      '#!/bin/sh',
      `counter=${shellQuote(counterPath)}`,
      'lineage_dir=$(dirname "$SPECKIT_OPENCODE_STATE_DIR")',
      'if [ ! -f "$counter" ]; then',
      '  echo first > "$counter"',
      '  mkdir -p "$lineage_dir"',
      '  printf \'{"type":"iteration","iteration":1,"run":1,"status":"complete"}\\n\' > "$lineage_dir/deep-research-state.jsonl"',
      '  echo "short"',
      '  exit 1',
      'fi',
      writeFanoutArtifactsShell(),
      'echo "retry-ok"',
      'exit 0',
      '',
    ].join('\n'),
    { mode: 0o755 },
  );
  return stubPath;
}

/**
 * Write a stub binary that sleeps `seconds` then exits 0.
 * Used to assert lineages run concurrently (parallel) rather than serially.
 */
function writeSleepingStubBinary(binDir: string, name: string, seconds: number): string {
  const stubPath = join(binDir, name);
  writeFileSync(
    stubPath,
    ['#!/bin/sh', `sleep ${seconds}`, writeFanoutArtifactsShell(), 'echo "slept"', 'exit 0', ''].join('\n'),
    { mode: 0o755 },
  );
  return stubPath;
}

function writeDelayedNodeStubBinary(binDir: string, name: string, delayMs: number): string {
  const stubPath = join(binDir, name);
  writeFileSync(
    stubPath,
    [
      '#!/usr/bin/env node',
      'const fs = require("node:fs");',
      'const path = require("node:path");',
      'function lineageDir() {',
      '  const stateDir = process.env.SPECKIT_OPENCODE_STATE_DIR || process.env.SPECKIT_CLAUDE_CODE_STATE_DIR;',
      '  return stateDir ? path.dirname(stateDir) : null;',
      '}',
      'function writeArtifacts() {',
      '  const dir = lineageDir();',
      '  if (!dir) return;',
      '  fs.mkdirSync(dir, { recursive: true });',
      '  for (const file of ["research.md", "review-report.md"]) fs.writeFileSync(path.join(dir, file), "ok\\n");',
      '}',
      `setTimeout(() => { writeArtifacts(); console.log('delayed'); process.exit(0); }, ${delayMs});`,
      '',
    ].join('\n'),
    { mode: 0o755 },
  );
  return stubPath;
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function writeFanoutArtifactsShell(): string {
  return [
    'lineage_dir=""',
    'for state_dir in "$SPECKIT_OPENCODE_STATE_DIR" "$SPECKIT_CLAUDE_CODE_STATE_DIR"; do',
    '  if [ -n "$state_dir" ]; then',
    '    lineage_dir=$(dirname "$state_dir")',
    '    break',
    '  fi',
    'done',
    'if [ -n "$lineage_dir" ]; then',
    '  mkdir -p "$lineage_dir"',
    '  printf "ok\\n" > "$lineage_dir/research.md"',
    '  printf "ok\\n" > "$lineage_dir/review-report.md"',
    'fi',
  ].join('\n');
}

function writeMarkerSleepingStubBinary(binDir: string, name: string, seconds: number, markerPath: string): string {
  const stubPath = join(binDir, name);
  writeFileSync(
    stubPath,
    `#!/bin/sh\n: > ${shellQuote(markerPath)}\nsleep ${seconds}\n${writeFanoutArtifactsShell()}\necho "slept"\nexit 0\n`,
    { mode: 0o755 },
  );
  return stubPath;
}

function parseJsonFile<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf8')) as T;
}

function normalizeFanoutTiming(payload: Record<string, unknown>): Record<string, unknown> {
  const normalized = JSON.parse(JSON.stringify(payload)) as {
    results?: Array<{ duration_ms?: unknown; output?: { slotDurationMs?: unknown } }>;
  };
  for (const result of normalized.results ?? []) {
    if ('duration_ms' in result) result.duration_ms = '<DURATION_MS>';
    if (result.output && 'slotDurationMs' in result.output) result.output.slotDurationMs = '<SLOT_DURATION_MS>';
  }
  return normalized as Record<string, unknown>;
}

function waitForFile(filePath: string, timeoutMs = 5_000): Promise<void> {
  const startedAt = Date.now();
  return new Promise((resolvePromise, reject) => {
    const poll = () => {
      if (existsSync(filePath)) {
        resolvePromise();
        return;
      }
      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`timed out waiting for ${filePath}`));
        return;
      }
      setTimeout(poll, 25);
    };
    poll();
  });
}

function waitForChild(
  child: ReturnType<typeof spawn>,
): Promise<{ exitCode: number | null; signal: NodeJS.Signals | null; stdout: string; stderr: string }> {
  let stdout = '';
  let stderr = '';
  child.stdout?.setEncoding('utf8');
  child.stderr?.setEncoding('utf8');
  child.stdout?.on('data', (chunk) => { stdout += chunk; });
  child.stderr?.on('data', (chunk) => { stderr += chunk; });
  return new Promise((resolvePromise) => {
    child.on('close', (exitCode, signal) => resolvePromise({ exitCode, signal, stdout, stderr }));
  });
}

/**
 * Write a stub binary that echoes its argv and stdin so tests can assert the
 * exact dispatched arguments and prompt text.
 */
function writeEchoStubBinary(binDir: string, name: string): string {
  const stubPath = join(binDir, name);
  writeFileSync(
    stubPath,
    `#!/bin/sh\necho "ARGV: $@"\necho "STDIN_START"\ncat\necho "STDIN_END"\n${writeFanoutArtifactsShell()}\nexit 0\n`,
    { mode: 0o755 },
  );
  return stubPath;
}

afterEach(() => {
  try {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  } finally {
    while (hermeticEnvs.length > 0) {
      hermeticEnvs.pop()?.cleanup();
    }
  }
});

const fanoutRunScript = resolve(runtimeRoot, 'scripts', 'fanout-run.cjs');
const reviewWorkflowPaths = [
  resolve(runtimeRoot, '..', '..', '..', 'commands', 'deep', 'assets', 'deep-review-auto.yaml'),
  resolve(runtimeRoot, '..', '..', '..', 'commands', 'deep', 'assets', 'deep-review-confirm.yaml'),
];

type ReviewInitSessionIds = {
  config: string;
  stateLog: string;
  findingsRegistry: string;
};

function extractSingleMatch(content: string, pattern: RegExp, label: string): string {
  const match = pattern.exec(content);
  expect(match, label).not.toBeNull();
  return match?.[1] ?? '';
}

function renderReviewInitSessionIds(workflowPath: string, suppliedSessionId?: string): ReviewInitSessionIds {
  const workflow = readFileSync(workflowPath, 'utf8');
  const fallbackIsoNow = '2035-02-03T04:05:06.000Z';
  const sessionIdInit = suppliedSessionId ?? fallbackIsoNow;

  expect(workflow).toMatch(/user_inputs:[\s\S]*\n  session_id:/);
  expect(workflow).toMatch(
    /step_resolve_session_id:[\s\S]*session_id_init: "\{session_id\}"[\s\S]*session_id_init: "\{ISO_8601_NOW\}"/,
  );
  expect(workflow).not.toMatch(/sessionId:\s+"\{ISO_8601_NOW\}"/);
  expect(workflow).not.toMatch(/"sessionId":"\{ISO_8601_NOW\}"/);

  const configTemplate = extractSingleMatch(
    workflow,
    /step_create_config:[\s\S]*?sessionId:\s+"([^"]+)"/,
    'config sessionId template',
  );
  const stateLogTemplate = extractSingleMatch(
    workflow,
    /step_create_state_log:[\s\S]*?content:\s+'([^']+)'/,
    'state-log config record template',
  );
  const findingsRegistryTemplate = extractSingleMatch(
    workflow,
    /step_create_findings_registry:[\s\S]*?content:\s+'([^']+)'/,
    'findings registry template',
  );

  const renderTemplate = (template: string) => template.replaceAll('{session_id_init}', sessionIdInit);
  const extractJsonSessionId = (template: string, label: string) => extractSingleMatch(
    renderTemplate(template),
    /"sessionId":"([^"]+)"/,
    label,
  );

  return {
    config: renderTemplate(configTemplate),
    stateLog: extractJsonSessionId(stateLogTemplate, 'state-log sessionId'),
    findingsRegistry: extractJsonSessionId(findingsRegistryTemplate, 'findings registry sessionId'),
  };
}

describe('fanout-run.cjs — computeLineageTimeoutMs lineage timeout override', () => {
  const { computeLineageTimeoutMs } = requireCjs(fanoutRunScript) as {
    computeLineageTimeoutMs: (lineage: { iterations?: number; timeoutSeconds?: number }, ceilingHoursOverride?: number) => number;
  };

  it('keeps the default 4-hour cap when no override is provided (REQ-001)', () => {
    expect(computeLineageTimeoutMs({ iterations: 60, timeoutSeconds: 900 })).toBe(14_400_000);
  });

  it('uses a lineage timeout hours override within the 4-hour ceiling as the ceiling (REQ-002)', () => {
    expect(computeLineageTimeoutMs({ iterations: 60, timeoutSeconds: 900 }, 2)).toBe(7_200_000);
  });

  it('does not lengthen timeouts whose computed value is below the override ceiling', () => {
    expect(computeLineageTimeoutMs({ iterations: 2, timeoutSeconds: 60 }, 1)).toBe(240_000);
  });

  it('accepts a lineage timeout hours override exactly at the 4-hour hard ceiling', () => {
    expect(computeLineageTimeoutMs({ iterations: 60, timeoutSeconds: 900 }, 4)).toBe(14_400_000);
  });

  it('rejects a lineage timeout hours override above the 4-hour hard ceiling (full-lineage lifetime is non-disableable)', () => {
    expect(() => computeLineageTimeoutMs({ iterations: 60, timeoutSeconds: 900 }, 8)).toThrow(
      /exceeds the hard maximum of 4 hours/,
    );
  });
});

describe('fanout-run.cjs — max-iterations stop-reason tolerance', () => {
  const { isMaxIterationsStopReason, findMaxIterationsPolicyViolation } = requireCjs(fanoutRunScript) as {
    isMaxIterationsStopReason: (stopReason: unknown) => boolean;
    findMaxIterationsPolicyViolation: (input: {
      loopType: string;
      stopPolicy: string;
      lineage: { iterations: number };
      stateRead: { missing?: boolean; parseError?: string | null; records: Array<Record<string, unknown>> };
    }) => string | null;
  };

  const stateReadFor = (stopReason: unknown, iterations = 10) => ({
    missing: false,
    parseError: null,
    records: [
      ...Array.from({ length: iterations }, (_, index) => ({ type: 'iteration', iteration: index + 1 })),
      { type: 'event', event: 'synthesis_complete', totalIterations: iterations, stopReason },
    ],
  });

  it('accepts every formatting variant of the max-iterations family', () => {
    for (const variant of ['maxIterationsReached', 'max-iterations (10/10)', 'maxIterations', 'max_iterations_reached']) {
      expect(isMaxIterationsStopReason(variant)).toBe(true);
    }
  });

  it('rejects genuinely different or malformed stop reasons', () => {
    for (const other of ['converged', 'manualStop', 'error', 'userPaused', '', 'iterations-max', null, undefined, 42]) {
      expect(isMaxIterationsStopReason(other as unknown as string)).toBe(false);
    }
  });

  it('does not fail a completed lineage whose stopReason is a non-canonical max-iterations variant', () => {
    const violation = findMaxIterationsPolicyViolation({
      loopType: 'review',
      stopPolicy: 'max-iterations',
      lineage: { iterations: 10 },
      stateRead: stateReadFor('max-iterations (10/10)'),
    });
    expect(violation).toBeNull();
  });

  it('still fails a completed lineage whose stopReason indicates a different outcome', () => {
    const violation = findMaxIterationsPolicyViolation({
      loopType: 'review',
      stopPolicy: 'max-iterations',
      lineage: { iterations: 10 },
      stateRead: stateReadFor('converged'),
    });
    expect(violation).toBe('expected stopReason=maxIterationsReached, got converged');
  });
});

describe('fanout-run.cjs — observability status mapping', () => {
  const { statusForLedgerEvent } = requireCjs(fanoutRunScript) as {
    statusForLedgerEvent: (entry: Record<string, unknown>) => string;
  };

  it('maps lag-ceiling and hardening events to typed statuses', () => {
    expect(statusForLedgerEvent({ event: 'lag_ceiling_exceeded' })).toBe('warning');
    expect(statusForLedgerEvent({ event: 'lag_ceiling_exceeded', action: 'abort' })).toBe('failed');
    expect(statusForLedgerEvent({ event: 'lag_ceiling_exceeded', action: 'abort-requeue' })).toBe('warning');
    expect(statusForLedgerEvent({ event: 'lag_ceiling_abort' })).toBe('failed');
    expect(statusForLedgerEvent({ event: 'stall_detected' })).toBe('warning');
    expect(statusForLedgerEvent({ event: 'budget_cap_exceeded' })).toBe('failed');
  });
});

describe('fanout-run.cjs — per-lineage budget guard helpers', () => {
  const { evaluateLineageBudgetCap } = requireCjs(fanoutRunScript) as {
    evaluateLineageBudgetCap: (input: {
      lineage?: { iterations?: number | null };
      guards?: Record<string, unknown>;
    }) => { continue_allowed: boolean; stop_reasons: string[]; upper_bound: Record<string, number> };
  };

  it('returns the council-style continue decision and upper bound', () => {
    expect(evaluateLineageBudgetCap({
      lineage: { iterations: 5 },
      guards: { maxCostUnitsPerLineage: 5 },
    })).toMatchObject({
      continue_allowed: true,
      stop_reasons: [],
      upper_bound: { iterations: 5, estimated_cost_units: 5, max_cost_units_per_lineage: 5 },
    });

    expect(evaluateLineageBudgetCap({
      lineage: { iterations: 6 },
      guards: { maxCostUnitsPerLineage: 5 },
    })).toMatchObject({
      continue_allowed: false,
      stop_reasons: ['max_cost_units_per_lineage'],
      upper_bound: { iterations: 6, estimated_cost_units: 6, max_cost_units_per_lineage: 5 },
    });

    expect(evaluateLineageBudgetCap({
      lineage: { iterations: 2 },
      guards: { maxTokensPerLineage: 3, estimatedTokensPerIteration: 2 },
    })).toMatchObject({
      continue_allowed: false,
      stop_reasons: ['max_cost_units_per_lineage'],
      upper_bound: { iterations: 2, total_attempts: 1, estimated_cost_units: 4, max_cost_units_per_lineage: 3 },
    });
  });

  it('reserves cumulative cost for the initial attempt and every retry', () => {
    expect(evaluateLineageBudgetCap({
      lineage: { iterations: 5 },
      maxRetries: 5,
      guards: { maxCostUnitsPerLineage: 29, costUnitsPerIteration: 1 },
    })).toMatchObject({
      continue_allowed: false,
      stop_reasons: ['max_cost_units_per_lineage'],
      upper_bound: {
        iterations: 5,
        total_attempts: 6,
        estimated_cost_units: 30,
        max_cost_units_per_lineage: 29,
      },
    });
  });

  // Regression guard: DEFAULT_MAX_COST_UNITS_PER_LINEAGE must stay 72 and keep working
  // exactly as before, independent of the new aggregate cap added alongside it.
  it('keeps the unconfigured default at exactly 72 cost units (12 iterations x 1 unit x 6 attempts)', () => {
    expect(evaluateLineageBudgetCap({ lineage: {}, guards: {}, maxRetries: 5 })).toMatchObject({
      continue_allowed: true,
      stop_reasons: [],
      upper_bound: { iterations: 12, total_attempts: 6, estimated_cost_units: 72, max_cost_units_per_lineage: 72 },
    });
  });

  it('rejects the unconfigured default cap by exactly 1 unit over (13 iterations x 1 x 6 = 78 > 72)', () => {
    expect(evaluateLineageBudgetCap({ lineage: { iterations: 13 }, guards: {}, maxRetries: 5 })).toMatchObject({
      continue_allowed: false,
      stop_reasons: ['max_cost_units_per_lineage'],
      upper_bound: { iterations: 13, total_attempts: 6, estimated_cost_units: 78, max_cost_units_per_lineage: 72 },
    });
  });
});

describe('fanout-run.cjs — aggregate budget guard helpers', () => {
  const { evaluateAggregateBudgetCap, computeAggregateBudgetUpperBound } = requireCjs(fanoutRunScript) as {
    evaluateAggregateBudgetCap: (input: {
      lineages?: Array<{ label?: string; iterations?: number | null }>;
      guards?: Record<string, unknown>;
      maxRetries?: number;
    }) => { continue_allowed: boolean; stop_reasons: string[]; upper_bound: Record<string, unknown> };
    computeAggregateBudgetUpperBound: (
      lineages: Array<{ label?: string; iterations?: number | null }>,
      guards?: Record<string, unknown>,
      maxRetries?: number,
    ) => Record<string, unknown>;
  };

  it('defaults the aggregate ceiling to 288 units and sums every lineage', () => {
    const lineages = [
      { label: 'a', iterations: 10 },
      { label: 'b', iterations: 10 },
    ];
    // 10 iterations x 1 unit x 1 attempt (maxRetries 0) = 10 units per lineage -> 20 total.
    expect(evaluateAggregateBudgetCap({ lineages, guards: {}, maxRetries: 0 })).toMatchObject({
      continue_allowed: true,
      stop_reasons: [],
      upper_bound: { max_aggregate_cost_units: 288, estimated_cost_units: 20, lineage_count: 2 },
    });
  });

  it('rejects when the sum across lineages exceeds 288 even though each lineage is within its own 72-unit cap', () => {
    // 5 lineages x 60 iterations x 1 unit x 1 attempt = 60 units each (under the 72 default
    // per-lineage cap) but 300 units in aggregate (over the new 288 aggregate cap) -- proves
    // the two ceilings are independent, neither replaces the other.
    const lineages = Array.from({ length: 5 }, (_, index) => ({ label: `seat-${index}`, iterations: 60 }));
    const decision = evaluateAggregateBudgetCap({ lineages, guards: {}, maxRetries: 0 });
    expect(decision).toMatchObject({
      continue_allowed: false,
      stop_reasons: ['max_aggregate_cost_units'],
      upper_bound: { max_aggregate_cost_units: 288, estimated_cost_units: 300, lineage_count: 5 },
    });
    const perLineage = decision.upper_bound.per_lineage as Array<{ estimated_cost_units: number }>;
    for (const entry of perLineage) {
      expect(entry.estimated_cost_units).toBe(60);
      expect(entry.estimated_cost_units).toBeLessThan(72);
    }
  });

  it('honors a maxAggregateCostUnits override', () => {
    expect(evaluateAggregateBudgetCap({
      lineages: [{ label: 'a', iterations: 10 }],
      guards: { maxAggregateCostUnits: 5 },
      maxRetries: 0,
    })).toMatchObject({
      continue_allowed: false,
      stop_reasons: ['max_aggregate_cost_units'],
      upper_bound: { max_aggregate_cost_units: 5, estimated_cost_units: 10 },
    });
  });

  it('treats an empty lineage list as trivially within budget', () => {
    expect(computeAggregateBudgetUpperBound([], {}, 0)).toMatchObject({
      max_aggregate_cost_units: 288,
      estimated_cost_units: 0,
      lineage_count: 0,
    });
  });
});

describe('fanout-run.cjs — stall watchdog is non-disableable', () => {
  const { normalizeStallWatchdogMs } = requireCjs(fanoutRunScript) as {
    normalizeStallWatchdogMs: (rawConfig: Record<string, unknown>) => number;
  };

  it('defaults to 300000ms (5 minutes) when unset', () => {
    expect(normalizeStallWatchdogMs({})).toBe(300000);
  });

  it('honors a positive override', () => {
    expect(normalizeStallWatchdogMs({ stallWatchdogMs: 40 })).toBe(40);
  });

  it('rejects an explicit 0 (the old opt-out) because autonomous runs cannot disable stall detection', () => {
    expect(() => normalizeStallWatchdogMs({ stallWatchdogMs: 0 })).toThrow(/stallWatchdogMs must be greater than 0/);
  });

  it('still rejects a negative value', () => {
    expect(() => normalizeStallWatchdogMs({ stallWatchdogMs: -1 })).toThrow(/non-negative/);
  });
});

describe('fanout-run.cjs — native convergence threshold defaults', () => {
  const { buildLineageCommand } = requireCjs(fanoutRunScript) as {
    buildLineageCommand: (
      lineage: { kind: 'native'; iterations?: number },
      prompt: string,
      resolvedSandbox: string,
      resolvedPermission: string,
      options: { loopType: 'research' | 'review'; specFolder: string; lineageDir: string; convergenceThreshold?: number },
    ) => { command: string; args: string[]; input: string };
  };

  function nativeCommandInput(loopType: 'research' | 'review'): string {
    const command = buildLineageCommand(
      { kind: 'native' },
      '',
      'workspace-write',
      'default',
      { loopType, specFolder: 'specs/test-native-defaults', lineageDir: '/tmp/native-defaults' },
    );
    return command.args.at(-1) ?? '';
  }

  it('uses the research-specific 0.05 default for native dispatch when no threshold is explicit', () => {
    const input = nativeCommandInput('research');
    expect(input).toContain('--convergence=0.05');
    expect(input).toContain('convergenceThreshold: 0.05');
  });

  it('keeps the 0.1 default for review native dispatch when no threshold is explicit', () => {
    const input = nativeCommandInput('review');
    expect(input).toContain('--convergence=0.1');
    expect(input).toContain('convergenceThreshold: 0.1');
  });
});

describe('fanout-run.cjs — cli-codex adapter', () => {
  const { buildLineageCommand, isCodexBinaryAvailable } = requireCjs(fanoutRunScript) as {
    buildLineageCommand: (
      lineage: Record<string, unknown>,
      prompt: string,
      resolvedSandbox: string,
      resolvedPermission: string,
      options?: { env?: NodeJS.ProcessEnv },
    ) => { command: string; args: string[]; input: string };
    isCodexBinaryAvailable: (env?: NodeJS.ProcessEnv) => boolean;
  };

  it('builds the restored codex exec command with stdin prompt input', () => {
    const command = buildLineageCommand(
      { kind: 'cli-codex', model: 'gpt-5.6-codex', reasoningEffort: 'xhigh', serviceTier: 'fast' },
      'bounded prompt',
      'workspace-write',
      'default',
    );
    expect(command).toEqual({
      command: 'codex',
      args: [
        'exec', '--model', 'gpt-5.6-codex',
        '-c', 'model_reasoning_effort=xhigh',
        '-c', 'service_tier=fast',
        '-c', 'approval_policy=never',
        '--sandbox', 'workspace-write',
        '-',
      ],
      input: 'bounded prompt',
    });
  });

  it('fails closed before command construction when codex is absent', () => {
    const env = { ...process.env, PATH: makeTempDir('fanout-run-no-codex-') };
    expect(isCodexBinaryAvailable(env)).toBe(false);
    expect(() => buildLineageCommand(
      { kind: 'cli-codex', model: 'gpt-5.6-codex' },
      'bounded prompt',
      'workspace-write',
      'default',
      { env },
    )).toThrow(/command -v codex failed/);
  });
});

describe('fanout-run.cjs — buildLoopPrompt identity wording', () => {
  const { buildLoopPrompt } = requireCjs(fanoutRunScript) as {
    buildLoopPrompt: (
      loopType: 'research' | 'review',
      specFolder: string,
      lineageDir: string,
      sessionId: string,
      lineage: { kind: 'cli-opencode'; label: string; model?: string },
      researchTopic?: string,
      options?: { stopPolicy?: string; convergenceThreshold?: number },
    ) => string;
  };

  it('does not claim LEAF-agent identity while preserving loop phase instructions', () => {
    for (const [loopType, agentName] of [
      ['research', 'deep-research'],
      ['review', 'deep-review'],
    ] as const) {
      const prompt = buildLoopPrompt(
        loopType,
        'specs/test-fanout-loop-identity',
        `/tmp/fanout-${loopType}-lineage`,
        `fanout-${loopType}-run-123`,
        { kind: 'cli-opencode', label: `${loopType}-seat`, model: 'opencode-go/glm-5.1' },
        loopType === 'research' ? 'test research topic' : undefined,
      );

      expect(prompt).not.toContain(`You are a ${agentName} agent`);
      expect(prompt).not.toContain(`${agentName} agent running a fan-out lineage`);
      expect(prompt).toContain(
        `You are orchestrating the ${agentName} workflow YAML as a detached fan-out lineage.`,
      );
      expect(prompt).toContain(
        'Run phase_init, phase_main_loop (to legal convergence), and phase_synthesis.',
      );
    }
  });

  it('rejects deprecated context fan-out prompt construction', () => {
    expect(() => buildLoopPrompt(
      'context' as never,
      'specs/test-fanout-loop-identity',
      '/tmp/fanout-context-lineage',
      'fanout-context-run-123',
      { kind: 'cli-opencode', label: 'context-seat', model: 'opencode-go/glm-5.1' },
    )).toThrow(/context fan-out is deprecated/);
  });
});

describe('fanout-run.cjs — review session id propagation templates', () => {
  const { buildLineageCommand } = requireCjs(fanoutRunScript) as {
    buildLineageCommand: (
      lineage: { kind: 'native'; iterations?: number },
      prompt: string,
      resolvedSandbox: string,
      resolvedPermission: string,
      options: {
        loopType: 'review';
        specFolder: string;
        lineageDir: string;
        sessionId?: string;
      },
    ) => { command: string; args: string[]; input: string };
  };

  it('uses a supplied session_id for review init artifacts and preserves the timestamp fallback', () => {
    const suppliedSessionId = 'fanout-lineage-a-run-123';

    for (const workflowPath of reviewWorkflowPaths) {
      expect(renderReviewInitSessionIds(workflowPath, suppliedSessionId)).toEqual({
        config: suppliedSessionId,
        stateLog: suppliedSessionId,
        findingsRegistry: suppliedSessionId,
      });
      expect(renderReviewInitSessionIds(workflowPath)).toEqual({
        config: '2035-02-03T04:05:06.000Z',
        stateLog: '2035-02-03T04:05:06.000Z',
        findingsRegistry: '2035-02-03T04:05:06.000Z',
      });
    }

    const withSession = buildLineageCommand(
      { kind: 'native', iterations: 2 },
      '',
      'workspace-write',
      'default',
      {
        loopType: 'review',
        specFolder: 'specs/test-session-id',
        lineageDir: '/tmp/fanout-lineage-a',
        sessionId: suppliedSessionId,
      },
    );
    const withoutSession = buildLineageCommand(
      { kind: 'native', iterations: 2 },
      '',
      'workspace-write',
      'default',
      {
        loopType: 'review',
        specFolder: 'specs/test-session-id',
        lineageDir: '/tmp/fanout-lineage-a',
      },
    );

    expect(withSession.args.at(-1)).toContain(`session_id: ${suppliedSessionId}`);
    expect(withoutSession.args.at(-1)).not.toContain('session_id:');
  });
});

describe('fanout-run.cjs — module basics', () => {
  it('exits 0 and emits ok JSON for native fanout through opencode command dispatch', async () => {
    const binDir = makeTempDir('fanout-run-native-bin-');
    writeNativeOpencodeStubBinary(binDir);
    const baseDir = makeTempDir('fanout-run-native-');
    const nativeOnlyConfig = JSON.stringify({
      executors: [{ label: 'native-a', kind: 'native', count: 1 }],
      concurrency: 2,
    });

    const { result } = await spawnFanout('module-native', [
      '--spec-folder',
      'specs/test-fanout-run-native',
      '--loop-type',
      'research',
      '--fanout-config-json',
      nativeOnlyConfig,
      '--base-artifact-dir',
      baseDir,
    ], { env: { PATH: `${binDir}:${process.env.PATH ?? ''}` } });

    expect(result.exitCode).toBe(0);
    const json = JSON.parse(result.stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as Record<string, unknown>;
    expect(json.status).toBe('ok');
    expect(json.summary).toMatchObject({ total: 1, succeeded: 1, failed: 0, all_failed: false });

    const summary = JSON.parse(readFileSync(join(baseDir, 'orchestration-summary.json'), 'utf8')) as {
      convergence?: { status?: string; reason?: string; no_new_findings?: boolean };
      gauges?: { lag?: number; pending?: number; failed?: number };
      total?: number;
      succeeded?: number;
      failed?: number;
    };
    expect(summary.total).toBe(1);
    expect(summary.succeeded).toBe(1);
    expect(summary.failed).toBe(0);
    expect(summary.gauges).toEqual({ lag: 0, pending: 0, failed: 0 });
  });

  it('logs and falls back to flat_pool when wave assignment is requested', async () => {
    const binDir = makeTempDir('fanout-run-wave-bin-');
    writeStubBinary(binDir, 'opencode');
    const baseDir = makeTempDir('fanout-run-wave-base-');
    const fanoutConfig = JSON.stringify({
      assignment_model: 'wave',
      executors: [
        {
          label: 'wave-seat',
          kind: 'cli-opencode',
          model: 'opencode-go/glm-5.1',
          assignment_model: 'wave',
          depends_on: ['prep'],
          touches: ['.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs'],
        },
      ],
      concurrency: 1,
    });
    const hermetic = useHermeticEnv('wave-fallback');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-wave',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain('REJECTED: wave assignment_model requires conflict-safety substrate');
    expect(result.stderr).toContain('REJECTED: wave assignment metadata requires conflict-safety substrate');
    const payload = JSON.parse(result.stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as {
      summary?: { succeeded?: number; failed?: number };
    };
    expect(payload.summary).toMatchObject({ succeeded: 1, failed: 0 });
    const ledgerEvents = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    const rejectedEvents = ledgerEvents.filter((event) => event.event === 'assignment_model_rejected');
    expect(rejectedEvents).toEqual([
      expect.objectContaining({
        field: 'assignment_model',
        message: 'REJECTED: wave assignment_model requires conflict-safety substrate',
        fallback_assignment_model: 'flat_pool',
        planner_status: 'dormant',
      }),
      expect.objectContaining({
        label: 'wave-seat',
        field: 'assignment_model',
        message: 'REJECTED: wave assignment_model requires conflict-safety substrate',
        fallback_assignment_model: 'flat_pool',
      }),
      expect.objectContaining({
        label: 'wave-seat',
        field: 'depends_on,touches',
        message: 'REJECTED: wave assignment metadata requires conflict-safety substrate',
        fallback_assignment_model: 'flat_pool',
      }),
    ]);
    expect(ledgerEvents.some((event) => event.event === 'started' && event.label === 'wave-seat')).toBe(true);
  });

  it('replays a native fanout cassette with a stable normalized run envelope', async () => {
    const binDir = makeTempDir('fanout-run-native-cassette-bin-');
    writeNativeOpencodeStubBinary(binDir);
    const hermetic = useHermeticEnv('native-cassette');
    const baseDir = makeBaseArtifactDir(hermetic, 'specs/cassette-fanout-native', 'research');
    const cassetteDir = makeTempDir('fanout-run-cassette-dir-');
    const cassetteId = 'fanout-native-empty';
    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'native-a', kind: 'native', count: 1 }],
      concurrency: 2,
    });
    const args = [
      '--spec-folder',
      'specs/cassette-fanout-native',
      '--loop-type',
      'research',
      '--fanout-config-json',
      fanoutConfig,
      '--base-artifact-dir',
      baseDir,
    ];
    const options = {
      cassetteDir,
      cassetteId,
      cwd: hermetic.tmpDir,
      env: envWithBin(hermetic, binDir),
      redactions: { [baseDir]: '<BASE_ARTIFACT_DIR>' },
      timeoutMs: 15_000,
    };

    const recorded = await recordScriptRun(fanoutRunScript, args, options);
    const payload = JSON.parse(recorded.cassette.envelope.stdout) as Record<string, unknown>;

    expect(recorded.result.exitCode).toBe(0);
    expect(recorded.cassette.envelope).toMatchObject({
      scriptPath: '<SCRIPT_PATH>',
      cwd: '<CWD>',
      argv: [
        '--spec-folder',
        'specs/cassette-fanout-native',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        '<BASE_ARTIFACT_DIR>',
      ],
      exitCode: 0,
      signal: null,
      timedOut: false,
    });
    expect(payload).toMatchObject({
      status: 'ok',
      run_id: '<RUN_ID>',
      results: [
        expect.objectContaining({ label: 'native-a', status: 'fulfilled' }),
      ],
      summary: {
        total: 1,
        succeeded: 1,
        failed: 0,
        all_failed: false,
      },
    });

    const replayed = await replayScriptRun(cassetteId, fanoutRunScript, args, options);
    expect(normalizeFanoutTiming(JSON.parse(replayed.normalized.stdout) as Record<string, unknown>)).toEqual(
      normalizeFanoutTiming(payload),
    );
  });

  it('exits 3 (INPUT_VALIDATION) when fanout-config-json is not valid JSON', async () => {
    const baseDir = makeTempDir('fanout-run-bad-json-');

    const { result } = await spawnFanout('module-bad-json', [
      '--spec-folder',
      'specs/test-fanout-run-bad-json',
      '--loop-type',
      'research',
      '--fanout-config-json',
      'NOT_JSON',
      '--base-artifact-dir',
      baseDir,
    ]);

    expect(result.exitCode).toBe(3);
  });

  it('exits 1 (SCRIPT_ERROR) when required args are missing', async () => {
    const { result } = await spawnFanout('module-missing-args', ['--loop-type', 'research']);

    expect(result.exitCode).toBe(3);
  });

  it('exits 3 (INPUT_VALIDATION) when --lineage-timeout-hours exceeds the 4-hour hard ceiling', async () => {
    const baseDir = makeTempDir('fanout-run-lineage-timeout-ceiling-');
    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'opus', kind: 'native', count: 1 }],
      concurrency: 1,
    });

    const { result } = await spawnFanout('module-lineage-timeout-ceiling', [
      '--spec-folder',
      'specs/test-fanout-run-lineage-timeout-ceiling',
      '--loop-type',
      'research',
      '--fanout-config-json',
      fanoutConfig,
      '--base-artifact-dir',
      baseDir,
      '--lineage-timeout-hours',
      '8',
    ]);

    expect(result.exitCode).toBe(3);
  });
});

describe('fanout-run.cjs — pool integration with stub binaries', () => {
  it('creates two isolated lineage dirs and writes orchestration summary for 2 cli-opencode lineages', async () => {
    const binDir = makeTempDir('fanout-run-bin-');
    writeStubBinary(binDir, 'opencode');

    const baseDir = makeTempDir('fanout-run-base-');

    const fanoutConfig = JSON.stringify({
      executors: [
        { label: 'lineage-a', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 },
        { label: 'lineage-b', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 },
      ],
      concurrency: 2,
    });

    const hermetic = useHermeticEnv('pool-two-lineages');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-pool',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );

    // Lineage dirs must be distinct sub-trees of lineages/
    expect(existsSync(join(baseDir, 'lineages', 'lineage-a'))).toBe(true);
    expect(existsSync(join(baseDir, 'lineages', 'lineage-b'))).toBe(true);

    // Per-lineage state dirs must exist (prevents same-kind replica lockfile collisions)
    expect(existsSync(join(baseDir, 'lineages', 'lineage-a', '.executor-state'))).toBe(true);
    expect(existsSync(join(baseDir, 'lineages', 'lineage-b', '.executor-state'))).toBe(true);

    // Orchestration summary written
    const summaryPath = join(baseDir, 'orchestration-summary.json');
    expect(existsSync(summaryPath)).toBe(true);
    const summary = JSON.parse(readFileSync(summaryPath, 'utf8')) as Record<string, unknown>;
    expect(summary['total_cli_lineages']).toBe(2);

    // Status ledger written (JSONL events)
    const ledgerPath = join(baseDir, 'orchestration-status.log');
    expect(existsSync(ledgerPath)).toBe(true);
    const lines = readFileSync(ledgerPath, 'utf8').trim().split('\n').filter(Boolean);
    expect(lines.length).toBeGreaterThan(0);
    const firstEvent = JSON.parse(lines[0]) as Record<string, unknown>;
    expect(firstEvent['event']).toBeDefined();

    // Both stubs exit 0, so the run must report success (exit 0).
    expect(result.exitCode).toBe(0);
    expect((summary as { failed?: number }).failed).toBe(0);
    expect((summary as { succeeded?: number }).succeeded).toBe(2);
  });

  it('sets distinct SPECKIT_OPENCODE_STATE_DIR for each same-kind replica to prevent lockfile collisions', async () => {
    const binDir = makeTempDir('fanout-run-lock-bin-');
    // Stub opencode writes the state-dir env var to stdout so we can assert distinctness
    const stubPath = join(binDir, 'opencode');
    writeFileSync(
      stubPath,
      `#!/bin/sh\necho "STATE_DIR=$SPECKIT_OPENCODE_STATE_DIR LINEAGE_ID=$SPECKIT_FANOUT_LINEAGE_ID"\n${writeFanoutArtifactsShell()}\nexit 0\n`,
      { mode: 0o755 },
    );

    const baseDir = makeTempDir('fanout-run-lock-base-');

    const fanoutConfig = JSON.stringify({
      executors: [
        { label: 'alpha', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 },
        { label: 'beta', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 },
      ],
      concurrency: 1,
    });

    const hermetic = useHermeticEnv('lock-state-dirs');
    await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-lock',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );

    // Each lineage must have its own .executor-state dir (distinct paths = no collision)
    const stateAlpha = join(baseDir, 'lineages', 'alpha', '.executor-state');
    const stateBeta = join(baseDir, 'lineages', 'beta', '.executor-state');
    expect(existsSync(stateAlpha)).toBe(true);
    expect(existsSync(stateBeta)).toBe(true);
    expect(stateAlpha).not.toBe(stateBeta);
  });

  it('expands a single count>1 executor into replicas each receiving a distinct SPECKIT_OPENCODE_STATE_DIR', async () => {
    const binDir = makeTempDir('fanout-run-replica-bin-');
    const stubPath = join(binDir, 'opencode');
    // The stub echoes the per-replica state-dir + lineage id so the test can assert
    // distinctness from captured stdout, not just dir existence.
    writeFileSync(
      stubPath,
      `#!/bin/sh\necho "STATE_DIR=$SPECKIT_OPENCODE_STATE_DIR LINEAGE_ID=$SPECKIT_FANOUT_LINEAGE_ID"\n${writeFanoutArtifactsShell()}\nexit 0\n`,
      { mode: 0o755 },
    );

    const baseDir = makeTempDir('fanout-run-replica-base-');

    // A SINGLE executor with count:2 — the actual same-kind-replica path via
    // expandLineages' `${label}-${replica}` suffixing.
    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'rep', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 2 }],
      concurrency: 1,
    });

    const hermetic = useHermeticEnv('replica-state-dirs');
    await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-replica',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );

    // Replicas materialize as rep-1 and rep-2.
    const stateRep1 = join(baseDir, 'lineages', 'rep-1', '.executor-state');
    const stateRep2 = join(baseDir, 'lineages', 'rep-2', '.executor-state');
    expect(existsSync(stateRep1)).toBe(true);
    expect(existsSync(stateRep2)).toBe(true);
    expect(stateRep1).not.toBe(stateRep2);

    // The stub captured the env each replica actually received; the state dir each
    // saw must be distinct (this is what the older test never verified).
    const out1 = readFileSync(join(baseDir, 'lineages', 'rep-1', 'logs', 'fanout-lineage.out'), 'utf8');
    const out2 = readFileSync(join(baseDir, 'lineages', 'rep-2', 'logs', 'fanout-lineage.out'), 'utf8');
    const dir1 = /STATE_DIR=(\S+)/.exec(out1)?.[1];
    const dir2 = /STATE_DIR=(\S+)/.exec(out2)?.[1];
    expect(dir1).toBeTruthy();
    expect(dir2).toBeTruthy();
    expect(dir1).not.toBe(dir2);
    expect(out1).toContain('LINEAGE_ID=rep-1');
    expect(out2).toContain('LINEAGE_ID=rep-2');
  });
});

describe('fanout-run.cjs — non-zero CLI exit is a fan-out failure', () => {
  it('records exit 3 (all failed) when the only lineage exits non-zero', async () => {
    const binDir = makeTempDir('fanout-run-fail-bin-');
    writeFailingStubBinary(binDir, 'opencode', 2);
    const baseDir = makeTempDir('fanout-run-fail-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'lineage-fail', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 }],
      concurrency: 2,
    });

    const hermetic = useHermeticEnv('fail-all');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-fail',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );

    // A single lineage that exits non-zero means all-failed -> exit 3.
    expect(result.exitCode).toBe(3);
    const summary = JSON.parse(
      readFileSync(join(baseDir, 'orchestration-summary.json'), 'utf8'),
    ) as { failed?: number; succeeded?: number; all_failed?: boolean };
    expect(summary.failed).toBe(1);
    expect(summary.succeeded).toBe(0);
    expect(summary.all_failed).toBe(true);
  });

  it('retries a salvage-miss lineage once and exits ok when the retry succeeds', async () => {
    const binDir = makeTempDir('fanout-run-retry-bin-');
    const baseDir = makeTempDir('fanout-run-retry-base-');
    writeFlakySalvageMissStubBinary(binDir, 'opencode', join(baseDir, 'opencode.counter'));

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'flaky', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 }],
      concurrency: 1,
      maxRetries: 1,
    });

    const hermetic = useHermeticEnv('retry-salvage');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-retry',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );

    expect(result.exitCode).toBe(0);
    const summary = JSON.parse(
      readFileSync(join(baseDir, 'orchestration-summary.json'), 'utf8'),
    ) as {
      failed?: number;
      succeeded?: number;
      all_failed?: boolean;
      results?: Array<{ retry_attempts?: number; status?: string }>;
    };
    expect(summary.failed).toBe(0);
    expect(summary.succeeded).toBe(1);
    expect(summary.all_failed).toBe(false);
    const payload = JSON.parse(result.stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as {
      results?: Array<{ retry_attempts?: number; status?: string }>;
    };
    expect(payload.results?.[0]).toMatchObject({ status: 'fulfilled', retry_attempts: 1 });

    const ledgerLines = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(ledgerLines.filter((event) => event.event === 'retry_scheduled')).toEqual([
      expect.objectContaining({ label: 'flaky', retry_count: 1, failure_class: 'salvage_miss' }),
    ]);
  });

  it('treats an exit-0/no-artifact lineage as salvage-miss and fails it after retry (not fulfilled)', async () => {
    // Regression guard: a lineage that exited 0 but wrote NO artifact must be treated as a
    // salvage-miss (retried, then failed if still missing), never counted as fulfilled.
    // The stub always exits 0 and writes nothing, so this fails (exit 3) iff the invariant holds.
    const binDir = makeTempDir('fanout-run-noartifact-bin-');
    const baseDir = makeTempDir('fanout-run-noartifact-base-');
    writeNoArtifactStubBinary(binDir, 'opencode');

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'noart', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 }],
      concurrency: 1,
      maxRetries: 1,
    });

    const hermetic = useHermeticEnv('no-artifact');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-noartifact',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );

    // Exit 3 = all lineages failed; the exit-0/no-artifact lineage must NOT be fulfilled.
    expect(result.exitCode).toBe(3);
    const summary = JSON.parse(
      readFileSync(join(baseDir, 'orchestration-summary.json'), 'utf8'),
    ) as { failed?: number; succeeded?: number; all_failed?: boolean };
    expect(summary.failed).toBe(1);
    expect(summary.succeeded).toBe(0);
    expect(summary.all_failed).toBe(true);

    // The lineage must have been classified as salvage_miss and retried before failing.
    const ledgerLines = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(ledgerLines.filter((event) => event.event === 'retry_scheduled')).toEqual([
      expect.objectContaining({ label: 'noart', retry_count: 1, failure_class: 'salvage_miss' }),
    ]);
  });

  it('records exit 2 (some failed) when one of two lineages exits non-zero', async () => {
    const binDir = makeTempDir('fanout-run-mixed-bin-');
    // opencode stub fails; claude stub succeeds.
    writeFailingStubBinary(binDir, 'opencode', 5);
    writeStubBinary(binDir, 'claude');
    const baseDir = makeTempDir('fanout-run-mixed-base-');

    const fanoutConfig = JSON.stringify({
      executors: [
        { label: 'fails', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 },
        { label: 'passes', kind: 'cli-claude-code', model: 'claude-opus-4-8', count: 1 },
      ],
      concurrency: 2,
    });

    const hermetic = useHermeticEnv('mixed-failure');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-mixed',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );

    expect(result.exitCode).toBe(2);
    const summary = JSON.parse(
      readFileSync(join(baseDir, 'orchestration-summary.json'), 'utf8'),
    ) as { failed?: number; succeeded?: number; all_failed?: boolean };
    expect(summary.failed).toBe(1);
    expect(summary.succeeded).toBe(1);
    expect(summary.all_failed).toBe(false);
  });
});

describe('fanout-run.cjs — lineages run concurrently (not serialized by spawnSync)', () => {
  it('runs two ~1s lineages in roughly 1s wall-clock with concurrency 2', async () => {
    const binDir = makeTempDir('fanout-run-parallel-bin-');
    writeSleepingStubBinary(binDir, 'opencode', 1);
    const baseDir = makeTempDir('fanout-run-parallel-base-');

    const fanoutConfig = JSON.stringify({
      executors: [
        { label: 'sleep-a', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 },
        { label: 'sleep-b', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 },
      ],
      concurrency: 2,
    });

    const startedAt = Date.now();
    const hermetic = useHermeticEnv('parallel-lineages');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-parallel',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );
    const elapsedMs = Date.now() - startedAt;

    expect(result.exitCode).toBe(0);
    // Serial execution would take ~2s; parallel ~1s. Allow generous headroom for
    // process startup while still proving the two ~1s sleeps overlapped (< 1.9s).
    expect(elapsedMs).toBeLessThan(1900);
  });
});

describe('fanout-run.cjs — graceful self-stop', () => {
  it('writes a stopped partial orchestration summary when SIGTERM interrupts an in-flight run', async () => {
    const binDir = makeTempDir('fanout-run-stop-bin-');
    const hermetic = useHermeticEnv('graceful-stop');
    const baseDir = makeTempDir('fanout-run-stop-base-');
    const markerPath = join(baseDir, 'lineage-started.marker');
    writeMarkerSleepingStubBinary(binDir, 'opencode', 10, markerPath);

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'slow', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 }],
      concurrency: 1,
    });

    const fanoutArgs = canonicalizeFanoutArgs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-stop',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      { cwd: hermetic.tmpDir },
    );
    const child = spawn(
      process.execPath,
      [
        fanoutRunScript,
        ...fanoutArgs,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );

    let stdout = '';
    let stderr = '';
    child.stdout?.setEncoding('utf8');
    child.stderr?.setEncoding('utf8');
    child.stdout?.on('data', (chunk) => { stdout += chunk; });
    child.stderr?.on('data', (chunk) => { stderr += chunk; });
    const closed = new Promise<{ exitCode: number | null; signal: NodeJS.Signals | null }>((resolvePromise) => {
      child.on('close', (exitCode, signal) => resolvePromise({ exitCode, signal }));
    });

    await waitForFile(markerPath);
    child.kill('SIGTERM');

    const result = await closed;

    expect({ exitCode: result.exitCode, signal: result.signal, stdout, stderr }).toMatchObject({ exitCode: 143, signal: null });
    const summary = JSON.parse(readFileSync(join(baseDir, 'orchestration-summary.json'), 'utf8')) as {
      stopped?: boolean;
      stopped_signal?: string;
      status?: string;
      results?: Array<{ label: string; status: string }>;
      gauges?: { lag?: number; pending?: number; failed?: number };
    };
    expect(summary.stopped).toBe(true);
    expect(summary.stopped_signal).toBe('SIGTERM');
    expect(summary.status).toBe('partial');
    expect(summary.results).toEqual([expect.objectContaining({ label: 'slow', status: 'running' })]);
    expect(summary.gauges).toMatchObject({ failed: 0 });
  });
});

describe('fanout-run.cjs — persisted wait checkpoint', () => {
  function spawnWaitingFanout(args: {
    testId: string;
    binDir: string;
    baseDir: string;
    waitMs?: number;
  }): ReturnType<typeof spawn> {
    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'delayed', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 }],
      concurrency: 1,
    });
    const hermetic = useHermeticEnv(args.testId);
    const commandArgs = [
      '--spec-folder',
      `specs/${args.testId}`,
      '--loop-type',
      'research',
      '--fanout-config-json',
      fanoutConfig,
      '--base-artifact-dir',
      args.baseDir,
    ];
    if (args.waitMs !== undefined) {
      commandArgs.push('--pre-dispatch-wait-ms', String(args.waitMs));
    }
    const fanoutArgs = canonicalizeFanoutArgs(fanoutRunScript, commandArgs, { cwd: hermetic.tmpDir });
    return spawn(process.execPath, [fanoutRunScript, ...fanoutArgs], {
      cwd: hermetic.tmpDir,
      env: envWithBin(hermetic, args.binDir),
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  }

  it('persists a pre-dispatch checkpoint and delays lineage launch until it expires', async () => {
    const binDir = makeTempDir('fanout-run-wait-bin-');
    const baseDir = makeTempDir('fanout-run-wait-base-');
    const markerPath = join(baseDir, 'lineage-launched.marker');
    writeMarkerSleepingStubBinary(binDir, 'opencode', 0, markerPath);

    const child = spawnWaitingFanout({
      testId: 'pre-dispatch-wait',
      binDir,
      baseDir,
      waitMs: 350,
    });
    const closed = waitForChild(child);
    const checkpointPath = join(baseDir, 'orchestration-wait-checkpoint.json');

    await waitForFile(checkpointPath);

    const checkpoint = parseJsonFile<WaitCheckpointFixture>(checkpointPath);
    expect(checkpoint.status).toBe('waiting');
    expect(checkpoint.nextRunAt).toEqual(expect.any(String));
    expect(Number(checkpoint.remainingDelayMs)).toBeGreaterThan(0);
    expect(existsSync(markerPath)).toBe(false);

    const result = await closed;

    expect(result.exitCode).toBe(0);
    expect(existsSync(markerPath)).toBe(true);
    const finalCheckpoint = parseJsonFile<WaitCheckpointFixture>(checkpointPath);
    expect(finalCheckpoint).toMatchObject({ status: 'idle', nextRunAt: null, remainingDelayMs: null });

    const ledgerEvents = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(ledgerEvents.map((event) => event.event)).toEqual(expect.arrayContaining([
      'wait_checkpoint_persisted',
      'wait_checkpoint_cleared',
      'started',
    ]));
  });

  it('resumes a future checkpoint before dispatching lineages', async () => {
    const binDir = makeTempDir('fanout-run-resume-wait-bin-');
    const baseDir = makeTempDir('fanout-run-resume-wait-base-');
    const markerPath = join(baseDir, 'lineage-launched.marker');
    const checkpointPath = join(baseDir, 'orchestration-wait-checkpoint.json');
    writeMarkerSleepingStubBinary(binDir, 'opencode', 0, markerPath);
    writeFileSync(
      checkpointPath,
      `${JSON.stringify({
        schemaVersion: 1,
        status: 'waiting',
        nextRunAt: new Date(Date.now() + 800).toISOString(),
        remainingDelayMs: 800,
        updatedAt: new Date().toISOString(),
      })}\n`,
      'utf8',
    );

    const child = spawnWaitingFanout({
      testId: 'resume-waiting',
      binDir,
      baseDir,
    });
    const closed = waitForChild(child);

    await new Promise((resolvePromise) => setTimeout(resolvePromise, 150));
    expect(existsSync(markerPath)).toBe(false);

    const result = await closed;

    expect(result.exitCode).toBe(0);
    expect(existsSync(markerPath)).toBe(true);
    const finalCheckpoint = parseJsonFile<WaitCheckpointFixture>(checkpointPath);
    expect(finalCheckpoint).toMatchObject({ status: 'idle', nextRunAt: null, remainingDelayMs: null });

    const ledgerEvents = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    const resumeIndex = ledgerEvents.findIndex((event) => event.event === 'resume_waiting');
    const startedIndex = ledgerEvents.findIndex((event) => event.event === 'started');
    expect(resumeIndex).toBeGreaterThanOrEqual(0);
    expect(startedIndex).toBeGreaterThan(resumeIndex);
  });

  it('migrates legacy checkpoints without wait fields to the null state', async () => {
    const binDir = makeTempDir('fanout-run-legacy-wait-bin-');
    const baseDir = makeTempDir('fanout-run-legacy-wait-base-');
    const markerPath = join(baseDir, 'lineage-launched.marker');
    const checkpointPath = join(baseDir, 'orchestration-wait-checkpoint.json');
    writeMarkerSleepingStubBinary(binDir, 'opencode', 0, markerPath);
    writeFileSync(
      checkpointPath,
      `${JSON.stringify({ schemaVersion: 1, status: 'waiting', updatedAt: new Date().toISOString() })}\n`,
      'utf8',
    );

    const child = spawnWaitingFanout({
      testId: 'legacy-wait-checkpoint',
      binDir,
      baseDir,
    });
    const result = await waitForChild(child);

    expect(result.exitCode).toBe(0);
    expect(existsSync(markerPath)).toBe(true);
    const finalCheckpoint = parseJsonFile<WaitCheckpointFixture>(checkpointPath);
    expect(finalCheckpoint).toMatchObject({ status: 'idle', nextRunAt: null, remainingDelayMs: null });
  });
});

describe('fanout-run.cjs — progress heartbeat', () => {
  it('emits a stall_detected alert when a lineage event stream goes quiet', async () => {
    const binDir = makeTempDir('fanout-run-stall-watchdog-bin-');
    writeDelayedNodeStubBinary(binDir, 'opencode', 180);
    const baseDir = makeTempDir('fanout-run-stall-watchdog-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'quiet', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 }],
      concurrency: 1,
      stallWatchdogMs: 40,
    });

    const hermetic = useHermeticEnv('stall-watchdog');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-stall-watchdog',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );

    expect(result.exitCode).toBe(0);
    const ledgerEvents = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(ledgerEvents.filter((event) => event.event === 'stall_detected')).toEqual([
      expect.objectContaining({
        label: 'quiet',
        severity: 'warning',
        metric: 'time_since_last_lineage_event',
        stall_watchdog_ms: 40,
      }),
    ]);

    const observabilityEvents = readFileSync(join(baseDir, 'observability-events.jsonl'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(observabilityEvents).toContainEqual(expect.objectContaining({
      event: 'stall_detected',
      status: 'warning',
      subject: expect.objectContaining({ label: 'quiet' }),
    }));
  });

  it('detects a silent child even while host progress heartbeats continue', async () => {
    const binDir = makeTempDir('fanout-run-heartbeat-watchdog-bin-');
    writeDelayedNodeStubBinary(binDir, 'opencode', 180);
    const baseDir = makeTempDir('fanout-run-heartbeat-watchdog-base-');

    const fanoutConfig = JSON.stringify({
      executors: [
        {
          label: 'quiet-with-heartbeats',
          kind: 'cli-opencode',
          model: 'opencode-go/glm-5.1',
          count: 1,
        },
      ],
      concurrency: 1,
      progressHeartbeatSeconds: 0.01,
      stallWatchdogMs: 40,
    });

    const hermetic = useHermeticEnv('heartbeat-watchdog-interaction');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-heartbeat-watchdog',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );

    expect(result.exitCode).toBe(0);
    const ledgerEvents = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);

    expect(ledgerEvents.some((event) => event.event === 'progress')).toBe(true);
    expect(ledgerEvents.filter((event) => event.event === 'stall_detected')).toEqual([
      expect.objectContaining({
        label: 'quiet-with-heartbeats',
        metric: 'time_since_last_lineage_event',
        stall_watchdog_ms: 40,
      }),
    ]);
  });

  it('emits progress events for a long lineage when cadence is configured', async () => {
    const binDir = makeTempDir('fanout-run-progress-bin-');
    writeSleepingStubBinary(binDir, 'opencode', 1);
    const baseDir = makeTempDir('fanout-run-progress-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'slow', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 }],
      concurrency: 1,
      progressHeartbeatSeconds: 0.05,
    });

    const hermetic = useHermeticEnv('progress-enabled');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-progress',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );

    expect(result.exitCode).toBe(0);
    const ledgerEvents = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    const progressEvents = ledgerEvents.filter((event) => event.event === 'progress');
    expect(progressEvents.length).toBeGreaterThan(0);
    expect(progressEvents[0]).toEqual(expect.objectContaining({
      label: 'slow',
      duration_ms: expect.any(Number),
      gauges: expect.objectContaining({ lag: 1, pending: 0, failed: 0 }),
    }));
  });

  it('does not emit progress events when cadence is left disabled', async () => {
    const binDir = makeTempDir('fanout-run-progress-disabled-bin-');
    writeSleepingStubBinary(binDir, 'opencode', 1);
    const baseDir = makeTempDir('fanout-run-progress-disabled-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'slow', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 }],
      concurrency: 1,
    });

    const hermetic = useHermeticEnv('progress-disabled');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-progress-disabled',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );

    expect(result.exitCode).toBe(0);
    const ledgerEvents = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(ledgerEvents.some((event) => event.event === 'progress')).toBe(false);
  });
});

describe('fanout-run.cjs — per-lineage budget cap', () => {
  it('halts an over-budget lineage before spawning the executor', async () => {
    const binDir = makeTempDir('fanout-run-budget-bin-');
    const baseDir = makeTempDir('fanout-run-budget-base-');
    const markerPath = join(baseDir, 'spawned.marker');
    writeMarkerSleepingStubBinary(binDir, 'opencode', 0, markerPath);

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'expensive', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1, iterations: 5 }],
      concurrency: 1,
      maxCostUnitsPerLineage: 3,
    });

    const hermetic = useHermeticEnv('budget-cap');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-budget-cap',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );

    expect(result.exitCode).toBe(3);
    expect(existsSync(markerPath)).toBe(false);
    const ledgerEvents = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(ledgerEvents.filter((event) => event.event === 'budget_cap_exceeded')).toEqual([
      expect.objectContaining({
        label: 'expensive',
        severity: 'error',
        stop_reasons: ['max_cost_units_per_lineage'],
        upper_bound: expect.objectContaining({
          iterations: 5,
          total_attempts: 6,
          estimated_cost_units: 30,
          max_cost_units_per_lineage: 3,
        }),
      }),
    ]);

    const payload = JSON.parse(result.stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as {
      summary?: { failed?: number; all_failed?: boolean };
      results?: Array<{ status?: string; error?: { message?: string; retryable?: boolean } }>;
    };
    expect(payload.summary).toMatchObject({ failed: 1, all_failed: true });
    expect(payload.results?.[0]).toMatchObject({
      status: 'rejected',
      error: { retryable: false, message: expect.stringContaining('exceeds configured budget cap') },
    });
  });
});

describe('fanout-run.cjs — aggregate budget cap', () => {
  it('halts the whole run before spawning any executor when the aggregate budget is exceeded', async () => {
    const binDir = makeTempDir('fanout-run-aggregate-budget-bin-');
    const baseDir = makeTempDir('fanout-run-aggregate-budget-base-');
    const markerPath = join(baseDir, 'spawned.marker');
    writeMarkerSleepingStubBinary(binDir, 'opencode', 0, markerPath);

    const fanoutConfig = JSON.stringify({
      // 5 replicas x 12 default iterations x 1 unit x 6 attempts (fan-out default
      // maxRetries: 5) = 72 units each -- AT, not over, the per-lineage default cap --
      // but 360 units in aggregate, over the new 288 aggregate cap. Proves the aggregate
      // check is independent of (and fires ahead of) the unrelated per-lineage cap.
      executors: [{ label: 'expensive', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 5 }],
      concurrency: 1,
    });

    const hermetic = useHermeticEnv('aggregate-budget-cap');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-aggregate-budget-cap',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );

    expect(result.exitCode).toBe(3);
    expect(existsSync(markerPath)).toBe(false);
    const ledgerEvents = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(ledgerEvents.filter((event) => event.event === 'aggregate_budget_cap_exceeded')).toEqual([
      expect.objectContaining({
        severity: 'error',
        stop_reasons: ['max_aggregate_cost_units'],
        upper_bound: expect.objectContaining({
          max_aggregate_cost_units: 288,
          estimated_cost_units: 360,
          lineage_count: 5,
        }),
      }),
    ]);
    // No 'started' event for any replica: the aggregate check fired before the pool
    // dispatched a single lineage.
    expect(ledgerEvents.some((event) => event.event === 'started')).toBe(false);
  });
});

describe('fanout-run.cjs — slot overrun accounting', () => {
  it('records skippedCount 0 and slotDurationMs for a fast completed lineage', async () => {
    const binDir = makeTempDir('fanout-run-fast-slot-bin-');
    writeStubBinary(binDir, 'opencode');
    const baseDir = makeTempDir('fanout-run-fast-slot-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'fast', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 }],
      concurrency: 1,
      progressHeartbeatSeconds: 1,
    });

    const hermetic = useHermeticEnv('fast-slot-accounting');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-fast-slot',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );

    expect(result.exitCode).toBe(0);
    const ledgerEvents = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    const completed = ledgerEvents.find((event) => event.event === 'completed' && event.label === 'fast');
    expect(completed).toEqual(expect.objectContaining({
      skippedCount: 0,
      slotDurationMs: expect.any(Number),
    }));
    expect(Number(completed?.slotDurationMs)).toBeGreaterThan(0);
  });

  it('records missed fixed-rate slots without launching catch-up lineages', async () => {
    const binDir = makeTempDir('fanout-run-overrun-slot-bin-');
    writeDelayedNodeStubBinary(binDir, 'opencode', 3_100);
    const baseDir = makeTempDir('fanout-run-overrun-slot-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'overrun', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 }],
      concurrency: 1,
      progressHeartbeatSeconds: 1,
    });

    const hermetic = useHermeticEnv('overrun-slot-accounting');
    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-overrun-slot',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );

    expect(result.exitCode).toBe(0);
    const ledgerEvents = readFileSync(join(baseDir, 'orchestration-status.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    const startedEvents = ledgerEvents.filter((event) => event.event === 'started' && event.label === 'overrun');
    const completedEvents = ledgerEvents.filter((event) => event.event === 'completed' && event.label === 'overrun');
    expect(startedEvents).toHaveLength(1);
    expect(completedEvents).toHaveLength(1);
    expect(completedEvents[0]).toEqual(expect.objectContaining({
      skippedCount: 2,
      slotDurationMs: expect.any(Number),
    }));
    expect(Number(completedEvents[0].slotDurationMs)).toBeGreaterThanOrEqual(3_000);

    const payload = JSON.parse(result.stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as {
      results?: Array<{ output?: { skippedCount?: number; slotDurationMs?: number } }>;
    };
    expect(payload.results?.[0]?.output).toEqual(expect.objectContaining({
      skippedCount: 2,
      slotDurationMs: expect.any(Number),
    }));
  });
});

describe('fanout-run.cjs — buildLineageCommand / buildLoopPrompt via echo stub', () => {
  async function runOpencodeEcho(
    lineage: Record<string, unknown>,
    loopType: 'research' | 'review',
  ): Promise<{ stdout: string; baseDir: string }> {
    const binDir = makeTempDir('fanout-run-echo-bin-');
    writeEchoStubBinary(binDir, 'opencode');
    const baseDir = makeTempDir('fanout-run-echo-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ ...lineage, kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 }],
      concurrency: 1,
    });

    const hermetic = useHermeticEnv(`echo-${String(lineage['label'] ?? 'lineage')}`);
    await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-echo',
        '--loop-type',
        loopType,
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env: envWithBin(hermetic, binDir),
        timeoutMs: 15_000,
      },
    );

    const label = String(lineage['label']);
    const stdout = readFileSync(
      join(baseDir, 'lineages', label, 'logs', 'fanout-lineage.out'),
      'utf8',
    );
    return { stdout, baseDir };
  }

  it('omits --variant from opencode argv when reasoningEffort is unset', async () => {
    const { stdout } = await runOpencodeEcho({ label: 'no-variant' }, 'research');
    const argvLine = stdout.split('\n').find((l) => l.startsWith('ARGV:')) ?? '';
    expect(argvLine).not.toContain('--variant');
  });

  it('includes --variant in opencode argv when reasoningEffort is set', async () => {
    const { stdout } = await runOpencodeEcho({ label: 'with-variant', reasoningEffort: 'high' }, 'research');
    const argvLine = stdout.split('\n').find((l) => l.startsWith('ARGV:')) ?? '';
    expect(argvLine).toContain('--variant high');
  });

  it('adds config.maxIterations to the prompt when lineage.iterations is set (A3)', async () => {
    const { stdout } = await runOpencodeEcho({ label: 'capped', iterations: 4 }, 'research');
    expect(stdout).toContain('config.maxIterations: 4');
    expect(stdout).toContain('whichever comes first');
  });

  it('omits config.maxIterations from the prompt when iterations is null (A3)', async () => {
    const { stdout } = await runOpencodeEcho({ label: 'uncapped' }, 'research');
    expect(stdout).not.toContain('config.maxIterations');
    expect(stdout).toContain('(to legal convergence)');
  });
});

describe('fanout-run.cjs — recursion-guard dispatch stack (SPECKIT_CLI_DISPATCH_STACK)', () => {
  /**
   * Write a stub that echoes the dispatch-stack env var (and the per-replica
   * state-dir env) so the test can assert the spawned seat's environment.
   */
  function writeStackEchoStub(binDir: string, name: string): string {
    const stubPath = join(binDir, name);
    writeFileSync(
      stubPath,
      '#!/bin/sh\necho "DISPATCH_STACK=$SPECKIT_CLI_DISPATCH_STACK"\n'
        + 'echo "STATE_DIR=$SPECKIT_OPENCODE_STATE_DIR"\n'
        + `echo "LINEAGE_ID=$SPECKIT_FANOUT_LINEAGE_ID"\n${writeFanoutArtifactsShell()}\nexit 0\n`,
      { mode: 0o755 },
    );
    return stubPath;
  }

  async function runOpencodeSeat(
    parentStack: string | undefined,
  ): Promise<string> {
    const binDir = makeTempDir('fanout-run-stack-bin-');
    writeStackEchoStub(binDir, 'opencode');
    const baseDir = makeTempDir('fanout-run-stack-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'seat-a', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 }],
      concurrency: 1,
    });

    const hermetic = useHermeticEnv(`stack-${parentStack ?? 'empty'}`);
    const env = envWithBin(hermetic, binDir);
    if (parentStack === undefined) {
      delete env['SPECKIT_CLI_DISPATCH_STACK'];
    } else {
      env['SPECKIT_CLI_DISPATCH_STACK'] = parentStack;
    }

    await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-stack',
        '--loop-type',
        'research',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      { cwd: hermetic.tmpDir, env, timeoutMs: 15_000 },
    );

    return readFileSync(
      join(baseDir, 'lineages', 'seat-a', 'logs', 'fanout-lineage.out'),
      'utf8',
    );
  }

  it('stamps the dispatched CLI seat env with its kind when the parent stack is empty', async () => {
    const stdout = await runOpencodeSeat(undefined);
    const stackLine = stdout.split('\n').find((l) => l.startsWith('DISPATCH_STACK=')) ?? '';
    expect(stackLine).toBe('DISPATCH_STACK=cli-opencode');
  });

  it('appends the kind onto an existing parent dispatch stack (cross-kind chain)', async () => {
    const stdout = await runOpencodeSeat('cli-claude-code');
    const stackLine = stdout.split('\n').find((l) => l.startsWith('DISPATCH_STACK=')) ?? '';
    expect(stackLine).toBe('DISPATCH_STACK=cli-claude-code:cli-opencode');
  });

  it('preserves per-replica state-dir + lineage-id env after the dispatch-env allowlist filter', async () => {
    const stdout = await runOpencodeSeat(undefined);
    const stateLine = stdout.split('\n').find((l) => l.startsWith('STATE_DIR=')) ?? '';
    const lineageLine = stdout.split('\n').find((l) => l.startsWith('LINEAGE_ID=')) ?? '';
    // buildExecutorDispatchEnv strips non-allowlisted keys; these SPECKIT_* keys
    // are reapplied after the filter, so they must still reach the seat.
    expect(stateLine).toMatch(/STATE_DIR=.+\.executor-state$/);
    expect(lineageLine).toBe('LINEAGE_ID=seat-a');
  });

  it('demonstrates the guard end-to-end: the stamped kind is detected as same-kind recursion', async () => {
    // The seat env carries the spawned kind; a nested same-kind dispatch from
    // inside that seat would hit this exact check.
    const stdout = await runOpencodeSeat(undefined);
    const stackLine = stdout.split('\n').find((l) => l.startsWith('DISPATCH_STACK=')) ?? '';
    const stack = stackLine.slice('DISPATCH_STACK='.length);

    expect(detectSameKindFromStack(stack, 'cli-opencode')).toBe(true);
    expect(detectSameKindFromStack(stack, 'cli-claude-code')).toBe(false);
  });
});

describe('fanout-run.cjs — cli-claude-code configDir env', () => {
  function writeClaudeEnvStub(binDir: string): string {
    const stubPath = join(binDir, 'claude');
    writeFileSync(
      stubPath,
      `#!/bin/sh\necho "ARGV: $@"\necho "CLAUDE_CONFIG_DIR=$CLAUDE_CONFIG_DIR"\n${writeFanoutArtifactsShell()}\nexit 0\n`,
      { mode: 0o755 },
    );
    return stubPath;
  }

  async function runClaudeSeat(lineage: Record<string, unknown>): Promise<{ home: string; stdout: string }> {
    const binDir = makeTempDir('fanout-run-claude-env-bin-');
    writeClaudeEnvStub(binDir);
    const baseDir = makeTempDir('fanout-run-claude-env-base-');

    const fanoutConfig = JSON.stringify({
      executors: [{ label: 'fable', kind: 'cli-claude-code', model: 'claude-fable-5', count: 1, ...lineage }],
      concurrency: 1,
    });

    const hermetic = useHermeticEnv(`claude-${String(lineage['configDir'] ?? 'default')}`);
    const env = envWithBin(hermetic, binDir);
    delete env['CLAUDE_CONFIG_DIR'];

    const result = await spawnCjs(
      fanoutRunScript,
      [
        '--spec-folder',
        'specs/test-fanout-run-claude-env',
        '--loop-type',
        'review',
        '--fanout-config-json',
        fanoutConfig,
        '--base-artifact-dir',
        baseDir,
      ],
      {
        cwd: hermetic.tmpDir,
        env,
        timeoutMs: 15_000,
      },
    );

    expect(result.exitCode).toBe(0);
    return {
      home: hermetic.home,
      stdout: readFileSync(join(baseDir, 'lineages', 'fable', 'logs', 'fanout-lineage.out'), 'utf8'),
    };
  }

  it('injects expanded CLAUDE_CONFIG_DIR for a cli-claude-code lineage with configDir', async () => {
    const { home, stdout } = await runClaudeSeat({ configDir: '~/.claude-account2' });
    expect(stdout).toContain(`CLAUDE_CONFIG_DIR=${join(home, '.claude-account2')}`);
    expect(stdout).toContain('--model claude-fable-5');
  });

  it('leaves CLAUDE_CONFIG_DIR absent when configDir is unset', async () => {
    const { stdout } = await runClaudeSeat({});
    expect(stdout).toContain('CLAUDE_CONFIG_DIR=');
    expect(stdout).not.toContain('.claude-account2');
  });
});
