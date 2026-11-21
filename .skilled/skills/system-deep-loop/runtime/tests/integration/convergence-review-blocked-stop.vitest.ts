// ───────────────────────────────────────────────────────────────────
// MODULE: Convergence Review Blocked-Stop Record
// ───────────────────────────────────────────────────────────────────

// A review leaf can read a blocked stop decision and move on without running
// the separate step that records it, which leaves the block in no ledger event.
// The command that computes the decision therefore records the block itself,
// through the append gateway, once per run and blocker set: on a graph that
// holds nodes, on an empty graph, and on a graph that cannot be read.

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { APPEND_GATEWAY, REPOSITORY_ROOT } from '../helpers/gateway-backed-lineage';
import {
  cleanupNamespace,
  namespaceArgs,
  runScript,
  seedReviewNode,
  uniqueNamespace,
  type ScriptNamespace,
} from '../helpers/spawn-cjs';

const requireCjs = createRequire(import.meta.url);
const fs = requireCjs('node:fs') as typeof import('node:fs');
const { reviewBlockedStopTargetDimension } = requireCjs('../../scripts/convergence.cjs') as {
  reviewBlockedStopTargetDimension: (options: Record<string, unknown>) => string;
};

const HEX_DIGEST = '0123456789abcdef'.repeat(4);
const NINE_GATES = [
  'convergenceGate', 'dimensionCoverageGate', 'p0ResolutionGate', 'evidenceDensityGate',
  'hotspotSaturationGate', 'claimAdjudicationGate', 'fixCompletenessReplayGate',
  'candidateCoverageGate', 'graphlessFallbackGate',
];
// The stop decision refuses a state log outside the repository, so a run is a
// scratch packet beside the suite rather than a system temp one.
const SCRATCH_BASE = fileURLToPath(new URL('../.tmp/', import.meta.url));

type ReviewRun = {
  artifactDir: string;
  authorityRoot: string;
  sessionId: string;
  configPath: string;
  stateLogPath: string;
  registryPath: string;
};

const scratch: string[] = [];
const namespaces: ScriptNamespace[] = [];

afterEach(async () => {
  for (const dir of scratch.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
  for (const namespace of namespaces.splice(0)) await cleanupNamespace(namespace);
});

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

function gatewayEnv(run: ReviewRun): NodeJS.ProcessEnv {
  return { ...process.env, DEEP_LOOP_AUTHORITY_ROOT: run.authorityRoot };
}

function appendRow(run: ReviewRun, row: Record<string, unknown>, name: string): void {
  const eventPath = join(run.artifactDir, `.${name}.json`);
  fs.writeFileSync(eventPath, JSON.stringify(row), 'utf8');
  const result = spawnSync(process.execPath, [
    APPEND_GATEWAY, '--mode', 'review', '--run-directory', run.artifactDir, '--event-json', eventPath,
  ], { cwd: REPOSITORY_ROOT, encoding: 'utf8', env: gatewayEnv(run) });
  fs.rmSync(eventPath, { force: true });
  expect(result.status, `${name} was refused: ${result.stdout}${result.stderr}`).toBe(0);
}

// Two completed iterations cover the only configured dimension with no open
// P0 or P1, so the run holds a clean stop candidate and the legal-stop gates
// decide it. The artifact directory carries the mode's name, which puts the
// gateway's state projection at the state log the decision reads.
function createReviewRun(options: { expansiveNextDimension?: string } = {}): ReviewRun {
  fs.mkdirSync(SCRATCH_BASE, { recursive: true });
  const specFolder = fs.mkdtempSync(join(SCRATCH_BASE, 'review-blocked-stop-'));
  scratch.push(specFolder);
  const artifactDir = join(specFolder, 'review');
  fs.mkdirSync(artifactDir);
  const authorityRoot = join(specFolder, 'authority');
  fs.mkdirSync(authorityRoot, { mode: 0o700 });
  const sessionId = `blocked-stop-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const run: ReviewRun = {
    artifactDir,
    authorityRoot,
    sessionId,
    configPath: join(artifactDir, 'deep-review-config.json'),
    stateLogPath: join(artifactDir, 'deep-review-state.jsonl'),
    registryPath: join(artifactDir, 'deep-review-findings-registry.json'),
  };

  fs.writeFileSync(run.configPath, JSON.stringify({
    mode: 'review',
    sessionId,
    generation: 1,
    lineageMode: 'new',
    reviewTarget: 'the stop path',
    reviewTargetType: 'files',
    reviewDimensions: ['correctness'],
    reviewScopeFiles: ['src/app.ts'],
    maxIterations: 7,
    convergenceThreshold: 0.1,
    stopPolicy: 'convergence',
    stuckThreshold: 4,
    antiConvergence: {
      convergenceMode: 'default',
      ...(options.expansiveNextDimension ? { depthMode: 'expansive' } : {}),
    },
  }), 'utf8');
  fs.writeFileSync(run.registryPath, JSON.stringify({
    sessionId,
    generation: 1,
    openFindings: [],
    resolvedFindings: [],
    dimensionCoverage: { correctness: true },
    findingsBySeverity: { P0: 0, P1: 0, P2: 2 },
    ...(options.expansiveNextDimension
      ? { frontier: { activeNextDimension: options.expansiveNextDimension } }
      : {}),
  }), 'utf8');

  appendRow(run, {
    stem: 'deep_review.run_initialized',
    scope: { runId: sessionId, sessionId, generation: 1 },
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
  }, 'run-open');
  for (const iteration of [1, 2]) {
    appendRow(run, {
      type: 'iteration',
      iteration,
      run: iteration,
      mode: 'review',
      status: 'complete',
      focus: 'correctness',
      dimensions: ['correctness'],
      findingsCount: 0,
      findingsSummary: { P0: 0, P1: 0, P2: 0 },
      findingsNew: [],
      findingDetails: [],
      traceabilityChecks: {},
      newFindingsRatio: 0.05,
      sessionId,
      generation: 1,
      lineageMode: 'new',
    }, `iteration-${iteration}`);
  }
  return run;
}

function decide(namespace: ScriptNamespace, run: ReviewRun, extra: string[] = [], env: NodeJS.ProcessEnv = {}) {
  return runScript('convergence', [
    ...namespaceArgs(namespace),
    '--stop-decision',
    '--iteration', '3',
    '--config-path', run.configPath,
    '--state-log', run.stateLogPath,
    '--registry-path', run.registryPath,
    ...extra,
  ], { env: { ...gatewayEnv(run), ...env } });
}

function reviewNamespace(): ScriptNamespace {
  const namespace = uniqueNamespace('convergence', 'review');
  namespaces.push(namespace);
  return namespace;
}

// Each ledger frame carries the accepted event as base64 canonical bytes.
function ledgerEvents(run: ReviewRun): Array<Record<string, unknown>> {
  const framesDir = join(run.artifactDir, 'deep-review-ledger', 'frames');
  return fs.readdirSync(framesDir).sort()
    .map((frame) => JSON.parse(fs.readFileSync(join(framesDir, frame), 'utf8')) as { canonical_event_bytes: string })
    .map((frame) => JSON.parse(Buffer.from(frame.canonical_event_bytes, 'base64').toString('utf8')) as Record<string, unknown>)
    .filter((event) => event.event_type === 'deep-review.ledger.blocked-stop-recorded');
}

function projectedBlockedStops(run: ReviewRun): Array<Record<string, unknown>> {
  return fs.readFileSync(run.stateLogPath, 'utf8').split('\n').filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>)
    .filter((row) => row.type === 'event' && row.event === 'blocked_stop');
}

function blockedStopData(run: ReviewRun): Record<string, unknown> {
  const events = ledgerEvents(run);
  expect(events).toHaveLength(1);
  return (events[0].payload as { data: Record<string, unknown> }).data;
}

// ───────────────────────────────────────────────────────────────────
// 2. TESTS
// ───────────────────────────────────────────────────────────────────

describe('review blocked-stop target dimension', () => {
  const review = (missingDimensions: string[], unfinishedCoreProtocols: string[] = []) => ({ missingDimensions, unfinishedCoreProtocols });
  const decisionInput = (depthMode: string, facts: Record<string, unknown>) => ({ config: { maxIterations: 3, depthMode }, review: facts });

  it('steers the last iteration under the cap to traceability when core protocols are unfinished', () => {
    expect(reviewBlockedStopTargetDimension({
      input: decisionInput('default', review(['security'], ['spec_code'])),
      registry: {},
      config: {},
      iteration: 3,
    })).toBe('traceability');
  });

  it('takes the active frontier dimension under expansive depth', () => {
    expect(reviewBlockedStopTargetDimension({
      input: decisionInput('expansive', review(['security'])),
      registry: { frontier: { activeNextDimension: 'maintainability' } },
      config: {},
      iteration: 2,
    })).toBe('maintainability');
  });

  it('takes the first uncovered dimension, else names every dimension covered', () => {
    const at = (missing: string[]) => reviewBlockedStopTargetDimension({
      input: decisionInput('default', review(missing)),
      registry: {},
      config: {},
      iteration: 2,
    });
    expect(at(['security', 'maintainability'])).toBe('security');
    expect(at([])).toBe('all-dimensions-covered');
  });
});

describe('convergence.cjs --record-blocked-stop for review', () => {
  it('records one blocked_stop_recorded event the gateway accepts for a blocked review stop', () => {
    const run = createReviewRun({ expansiveNextDimension: 'security' });
    const result = decide(reviewNamespace(), run, ['--record-blocked-stop']);
    expect(result.exitCode, `${result.stdout}${result.stderr}`).toBe(0);
    const stopDecision = result.json.stop_decision as { decision: string; blockedBy: string[] };
    expect(stopDecision.decision).toBe('BLOCKED');
    expect(stopDecision.blockedBy).toEqual(['hotspotSaturationGate']);
    expect(result.json.blocked_stop_record).toMatchObject({ status: 'recorded', run: 3 });

    const data = blockedStopData(run);
    expect(data).toMatchObject({
      blockedGateIds: ['hotspotSaturationGate'],
      activeFindingCounts: { candidates: 2, adjudicated: 0, p0: 0, p1: 0, p2: 2 },
      recoveryStrategy: 'hotspot-saturation-gate',
      targetDimensionId: 'security',
      originatingConvergenceEventId: `graph-${run.sessionId}-g1-i3`,
      appendPosition: 3,
      graphBlockerDetail: [],
    });
    const gateResults = data.gateResults as Array<{ gateId: string; status: string }>;
    expect(gateResults.map((row) => row.gateId)).toEqual(NINE_GATES);
    expect(gateResults.filter((row) => row.status === 'fail').map((row) => row.gateId)).toEqual(['hotspotSaturationGate']);
    expect(gateResults.filter((row) => row.status === 'unknown').map((row) => row.gateId))
      .toEqual(['candidateCoverageGate', 'graphlessFallbackGate']);
    expect(String(data.recoveryHint)).not.toBe('');

    const projected = projectedBlockedStops(run);
    expect(projected).toHaveLength(1);
    expect(projected[0]).toMatchObject({ run: 3, blockedBy: ['hotspotSaturationGate'] });
  }, 240_000);

  it('writes no second event when the same run is decided again', () => {
    const run = createReviewRun();
    const namespace = reviewNamespace();
    expect(decide(namespace, run, ['--record-blocked-stop']).exitCode).toBe(0);
    const again = decide(namespace, run, ['--record-blocked-stop']);
    expect(again.exitCode, again.stderr).toBe(0);
    expect(again.json.blocked_stop_record).toMatchObject({ status: 'already_recorded', run: 3 });
    expect(ledgerEvents(run)).toHaveLength(1);
  }, 240_000);

  it('names every dimension covered when no dimension is left to steer to', () => {
    const run = createReviewRun();
    expect(decide(reviewNamespace(), run, ['--record-blocked-stop']).exitCode).toBe(0);
    expect(blockedStopData(run).targetDimensionId).toBe('all-dimensions-covered');
  }, 240_000);

  it('records a block only the graph raises, with a fail row for its blocker', () => {
    const run = createReviewRun();
    const namespace = reviewNamespace();
    // One dimension node that nothing covers: the graph blocks the stop while
    // every legal-stop gate passes.
    expect(seedReviewNode(namespace).exitCode).toBe(0);
    const result = decide(namespace, run, ['--record-blocked-stop']);
    expect(result.exitCode, `${result.stdout}${result.stderr}`).toBe(0);
    const stopDecision = result.json.stop_decision as { decision: string; reasonDetail: string; blockedBy: string[] };
    expect(stopDecision).toMatchObject({ decision: 'BLOCKED', reasonDetail: 'graphStopBlocked', blockedBy: ['uncovered_dimensions'] });

    const data = blockedStopData(run);
    const gateResults = data.gateResults as Array<{ gateId: string; status: string }>;
    expect(gateResults.map((row) => row.gateId)).toEqual([...NINE_GATES, 'uncovered_dimensions']);
    expect(gateResults.filter((row) => row.status === 'fail').map((row) => row.gateId)).toEqual(['uncovered_dimensions']);
    expect((data.graphBlockerDetail as unknown[]).length).toBe(1);
  }, 240_000);

  it('records the block when the graph cannot be read', () => {
    const run = createReviewRun();
    const result = decide(reviewNamespace(), run, ['--record-blocked-stop'], { DEEP_LOOP_TEST_FAULT: 'db' });
    expect(result.exitCode, `${result.stdout}${result.stderr}`).toBe(0);
    expect(typeof result.json.graph_error).toBe('string');
    expect((result.json.stop_decision as { decision: string }).decision).toBe('BLOCKED');
    expect(result.json.blocked_stop_record).toMatchObject({ status: 'recorded', run: 3 });
    expect(ledgerEvents(run)).toHaveLength(1);
  }, 240_000);

  it('records nothing without the flag', () => {
    const run = createReviewRun();
    const result = decide(reviewNamespace(), run);
    expect((result.json.stop_decision as { decision: string }).decision).toBe('BLOCKED');
    expect('blocked_stop_record' in result.json).toBe(false);
    expect(ledgerEvents(run)).toHaveLength(0);
  }, 240_000);
});
