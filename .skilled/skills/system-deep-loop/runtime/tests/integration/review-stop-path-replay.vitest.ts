// ───────────────────────────────────────────────────────────────────
// MODULE: Review Stop Path Replay
// ───────────────────────────────────────────────────────────────────
//
// A review that stops runs one tail in order: the stop decision that named the
// reason, the terminal gates it records for that stop, and the reducer that
// turns the recorded rows into the dashboard's verdict. Each step has its own
// suite, so a contract that drifts between two of them is caught by neither:
// a gate row the gateway refuses, a stop reason the schema drops, or a verdict
// the dashboard stops printing. These cases replay the chain end to end
// against the real scripts, so the verdict is proved to follow the recorded
// stop and not the prose of the run.

import { afterEach, describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { APPEND_GATEWAY, REPOSITORY_ROOT } from '../helpers/gateway-backed-lineage';
import { namespaceArgs, runScript, runtimeRoot, uniqueNamespace } from '../helpers/spawn-cjs';

const SCRIPTS_DIR = join(runtimeRoot, 'scripts');
const TERMINAL_GATES = join(SCRIPTS_DIR, 'terminal-gates.cjs');
const REDUCE_STATE = join(SCRIPTS_DIR, 'reduce-state.cjs');
// The stop decision refuses a state log outside the repository, so a replay
// packet is a scratch packet beside the suite rather than a system temp one.
const SCRATCH_BASE = fileURLToPath(new URL('../.tmp/', import.meta.url));

const HEX_DIGEST = '0123456789abcdef'.repeat(4);

type GateRow = {
  gateId: string;
  status: string;
  reasonCode: string;
  evidenceDigest: string;
};

type TerminalGateReport = {
  status: string;
  terminal_gate_results_json: GateRow[];
  failed_required_gate_ids: string[];
};

type CliResult = {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  json: Record<string, unknown>;
};

type ReviewRun = {
  specFolder: string;
  artifactDir: string;
  authorityRoot: string;
  sessionId: string;
  generation: number;
  configPath: string;
  stateLogPath: string;
  registryPath: string;
  dashboardPath: string;
};

const scratch: string[] = [];

afterEach(() => {
  while (scratch.length > 0) {
    const dir = scratch.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

function createScratchDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), `dlr-${prefix}-`));
  scratch.push(dir);
  return dir;
}

function createScratchPacket(): string {
  mkdirSync(SCRATCH_BASE, { recursive: true });
  const dir = mkdtempSync(join(SCRATCH_BASE, 'review-stop-path-'));
  scratch.push(dir);
  return dir;
}

function lastJsonLine(stdout: string): Record<string, unknown> {
  const line = stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) ?? '{}';
  try {
    return JSON.parse(line) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function runNode(scriptPath: string, args: string[]): CliResult {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: runtimeRoot,
    encoding: 'utf8',
    env: process.env,
  });
  const stdout = result.stdout ?? '';
  return {
    exitCode: result.status,
    stdout: stdout.trim(),
    stderr: (result.stderr ?? '').trim(),
    json: lastJsonLine(stdout),
  };
}

// The gateway rebuilds the state log from its own ledger, so every row a case
// needs must be appended rather than written: a row only this test wrote is a
// row the next projection drops.
function runGateway(run: ReviewRun, row: Record<string, unknown>, name: string): CliResult {
  const eventPath = join(run.artifactDir, `${name}.json`);
  writeFileSync(eventPath, JSON.stringify(row), 'utf8');
  const result = spawnSync(process.execPath, [
    APPEND_GATEWAY,
    '--mode', 'review',
    '--run-directory', run.artifactDir,
    '--event-json', eventPath,
  ], {
    cwd: REPOSITORY_ROOT,
    encoding: 'utf8',
    env: { ...process.env, DEEP_LOOP_AUTHORITY_ROOT: run.authorityRoot },
  });
  const stdout = result.stdout ?? '';
  return {
    exitCode: result.status,
    stdout: stdout.trim(),
    stderr: (result.stderr ?? '').trim(),
    json: lastJsonLine(stdout),
  };
}

function appendRow(run: ReviewRun, row: Record<string, unknown>, name: string): void {
  const result = runGateway(run, row, name);
  expect(result.exitCode, `${name} was refused: ${result.stdout}${result.stderr}`).toBe(0);
}

function stateRows(run: ReviewRun): Array<Record<string, unknown>> {
  return readFileSync(run.stateLogPath, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

// A review artifact directory is its own projection root: the gateway writes
// the state log beside the ledger when the directory carries the mode's name,
// which is also the directory the reducer reads.
function createReviewRun(): ReviewRun {
  const specFolder = createScratchPacket();
  const artifactDir = join(specFolder, 'review');
  mkdirSync(artifactDir);
  const authorityRoot = createScratchDir('review-stop-path-authority');
  const sessionId = `stop-path-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const generation = 1;
  const run: ReviewRun = {
    specFolder,
    artifactDir,
    authorityRoot,
    sessionId,
    generation,
    configPath: join(artifactDir, 'deep-review-config.json'),
    stateLogPath: join(artifactDir, 'deep-review-state.jsonl'),
    registryPath: join(artifactDir, 'deep-review-findings-registry.json'),
    dashboardPath: join(artifactDir, 'deep-review-dashboard.md'),
  };

  writeFileSync(run.configPath, JSON.stringify({
    topic: 'Review: the stop path',
    mode: 'review',
    sessionId,
    parentSessionId: null,
    lineageMode: 'new',
    generation,
    reviewTarget: 'the stop path',
    reviewTargetType: 'files',
    reviewDimensions: ['correctness'],
    reviewScopeFiles: ['src/app.ts'],
    maxIterations: 7,
    convergenceThreshold: 0.1,
    stopPolicy: 'convergence',
    stuckThreshold: 2,
    antiConvergence: { convergenceMode: 'default', divergent: {} },
  }), 'utf8');

  // The finding is recorded outside the reviewed scope, so the scope gate has
  // a reason to fail that no severity count can supply: a verdict that reads
  // FAIL here can only have come from the recorded gate rows.
  writeFileSync(run.registryPath, JSON.stringify({
    sessionId,
    generation,
    lineageMode: 'new',
    openFindings: [{
      findingId: 'finding-out-of-scope',
      severity: 'P1',
      title: 'Finding recorded outside the reviewed scope',
      file: 'src/elsewhere.ts',
      line: 4,
    }],
    resolvedFindings: [],
    dimensionCoverage: { correctness: true },
    findingsBySeverity: { P0: 0, P1: 1, P2: 0 },
    openFindingsCount: 1,
    resolvedFindingsCount: 0,
    convergenceScore: 0,
  }), 'utf8');

  return run;
}

function runOpenRow(run: ReviewRun): Record<string, unknown> {
  return {
    stem: 'deep_review.run_initialized',
    scope: { runId: run.sessionId, sessionId: run.sessionId, generation: run.generation },
    data: {
      target: {
        targetId: 'review-target',
        targetType: 'file',
        artifactRef: 'deep-review-config.json#reviewTarget',
        sourceDigest: HEX_DIGEST,
        contentDigest: HEX_DIGEST,
      },
      lineageMode: 'fresh',
      maxIterations: 7,
      convergencePolicyVersion: 'convergence-policy@default',
      reviewModeContractDigest: HEX_DIGEST,
      initialReleaseReadinessState: 'not-assessed',
    },
  };
}

function iterationRow(
  run: ReviewRun,
  iteration: number,
  status: 'complete' | 'error',
): Record<string, unknown> {
  return {
    type: 'iteration',
    iteration,
    run: iteration,
    mode: 'review',
    status,
    focus: 'correctness',
    dimensions: ['correctness'],
    findingsCount: 0,
    findingsSummary: { P0: 0, P1: 0, P2: 0 },
    findingsNew: [],
    findingDetails: [],
    traceabilityChecks: {},
    newFindingsRatio: status === 'complete' ? 0.05 : 0,
    sessionId: run.sessionId,
    generation: run.generation,
    lineageMode: 'new',
  };
}

function terminalGatesRow(
  run: ReviewRun,
  stopReason: string,
  report: { gateResults: GateRow[]; failedRequiredGateIds: string[] },
  appendPosition: number,
): Record<string, unknown> {
  return {
    stem: 'deep_review.terminal_gates_recorded',
    scope: {
      runId: run.sessionId,
      sessionId: run.sessionId,
      generation: run.generation,
      iterationId: `iteration-${appendPosition}`,
    },
    data: {
      stopReason,
      gateResults: report.gateResults,
      failedRequiredGateIds: report.failedRequiredGateIds,
      appendPosition,
    },
  };
}

function readTerminalGates(run: ReviewRun): TerminalGateReport {
  const result = runNode(TERMINAL_GATES, [
    '--config-path', run.configPath,
    '--state-log', run.stateLogPath,
    '--registry-path', run.registryPath,
  ]);
  expect(result.exitCode, result.stderr).toBe(0);
  const report = result.json as unknown as TerminalGateReport;
  expect(report.status).toBe('ok');
  expect(report.failed_required_gate_ids.length).toBeGreaterThan(0);
  return report;
}

function reduceRun(run: ReviewRun): string {
  const result = runNode(REDUCE_STATE, [
    run.specFolder,
    '--artifact-dir', run.artifactDir,
    '--create-missing-anchors',
  ]);
  expect(result.exitCode, result.stderr).toBe(0);
  return readFileSync(run.dashboardPath, 'utf8');
}

describe('review stop path', () => {
  it('fails the verdict from the gates a three-error stop records', () => {
    const run = createReviewRun();
    appendRow(run, runOpenRow(run), 'run-open');
    for (const iteration of [1, 2, 3]) {
      appendRow(run, iterationRow(run, iteration, 'error'), `iteration-${iteration}`);
    }

    const namespace = uniqueNamespace('convergence', 'review');
    const decision = runScript('convergence', [
      ...namespaceArgs(namespace),
      '--stop-decision',
      '--config-path', run.configPath,
      '--state-log', run.stateLogPath,
      '--registry-path', run.registryPath,
    ]);
    expect(decision.exitCode, decision.stderr).toBe(0);
    const stopDecision = decision.json.stop_decision as {
      decision: string;
      stopReason: string | null;
      reasonDetail: string;
    };
    expect(stopDecision.decision).toBe('STOP');
    expect(stopDecision.stopReason).toBe('error');
    expect(stopDecision.reasonDetail).toBe('consecutiveFailures');

    const report = readTerminalGates(run);
    expect(report.failed_required_gate_ids).toContain('scope');
    appendRow(run, terminalGatesRow(run, 'error', {
      gateResults: report.terminal_gate_results_json,
      failedRequiredGateIds: report.failed_required_gate_ids,
    }, 3), 'terminal-gates');

    const dashboard = reduceRun(run);
    expect(dashboard).toContain('- Provisional Verdict: FAIL');
    expect(dashboard).toContain(
      `- Failed required gates at stop: ${report.failed_required_gate_ids.join(', ')}`,
    );

    const recorded = stateRows(run).filter(
      (row) => row.type === 'event' && row.event === 'terminal_gates',
    );
    expect(recorded).toHaveLength(1);
    expect(recorded[0]).toMatchObject({
      stopReason: 'error',
      failedRequiredGateIds: report.failed_required_gate_ids,
    });
  }, 240_000);

  it('carries the duration stop reason onto the projected row with a failing verdict', () => {
    const run = createReviewRun();
    appendRow(run, runOpenRow(run), 'run-open');
    for (const iteration of [1, 2]) {
      appendRow(run, iterationRow(run, iteration, 'complete'), `iteration-${iteration}`);
    }

    const report = readTerminalGates(run);
    expect(report.failed_required_gate_ids).toContain('scope');
    appendRow(run, terminalGatesRow(run, 'maxDurationReached', {
      gateResults: report.terminal_gate_results_json,
      failedRequiredGateIds: report.failed_required_gate_ids,
    }, 2), 'terminal-gates');

    const dashboard = reduceRun(run);
    expect(dashboard).toContain('- Provisional Verdict: FAIL');
    expect(dashboard).toContain(
      `- Failed required gates at stop: ${report.failed_required_gate_ids.join(', ')}`,
    );

    const recorded = stateRows(run).filter(
      (row) => row.type === 'event' && row.event === 'terminal_gates',
    );
    expect(recorded).toHaveLength(1);
    expect(recorded[0]).toMatchObject({ stopReason: 'maxDurationReached' });
  }, 240_000);

  it('keeps the verdict off FAIL for a manual stop whose gates all pass', () => {
    const run = createReviewRun();
    appendRow(run, runOpenRow(run), 'run-open');
    appendRow(run, iterationRow(run, 1, 'complete'), 'iteration-1');

    const passingGates: GateRow[] = ['evidence', 'scope', 'coverage'].map((gateId) => ({
      gateId,
      status: 'pass',
      reasonCode: `gate-passed-${gateId}`,
      evidenceDigest: HEX_DIGEST,
    }));
    appendRow(run, terminalGatesRow(run, 'manualStop', {
      gateResults: passingGates,
      failedRequiredGateIds: [],
    }, 1), 'terminal-gates');

    const dashboard = reduceRun(run);
    expect(dashboard).toContain('- Provisional Verdict: ');
    expect(dashboard).not.toContain('Provisional Verdict: FAIL');
    expect(dashboard).not.toContain('Failed required gates at stop:');

    const recorded = stateRows(run).filter(
      (row) => row.type === 'event' && row.event === 'terminal_gates',
    );
    expect(recorded).toHaveLength(1);
    expect(recorded[0]).toMatchObject({
      stopReason: 'manualStop',
      failedRequiredGateIds: [],
    });
  }, 240_000);
});
