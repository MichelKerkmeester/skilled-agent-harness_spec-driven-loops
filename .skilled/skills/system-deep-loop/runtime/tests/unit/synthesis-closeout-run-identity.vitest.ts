// MODULE: Synthesis Closeout Run Identity Tests

import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { APPEND_GATEWAY, REPOSITORY_ROOT } from '../helpers/gateway-backed-lineage';

const closeoutScript = join(dirname(fileURLToPath(import.meta.url)), '../../scripts/synthesis-closeout.cjs');
// The gateway binds each append to the checkout it runs in, so a run it accepts
// is a scratch packet beside the suite rather than a system temp one.
const SCRATCH_BASE = fileURLToPath(new URL('../.tmp/', import.meta.url));

const HEX_DIGEST = '0123456789abcdef'.repeat(4);

type LoopMode = 'research' | 'review';

function createCloseoutFixture(
  root: string,
  mode: LoopMode,
  stateRecords: Record<string, unknown>[],
  registry: Record<string, unknown>,
  config?: Record<string, unknown>,
): { artifactDir: string; eventDir: string; result: ReturnType<typeof spawnSync> } {
  const artifactDir = join(root, 'artifacts');
  const eventDir = join(root, 'events');
  fs.mkdirSync(artifactDir, { recursive: true });
  fs.mkdirSync(eventDir, { recursive: true });

  const stateLog = join(artifactDir, `deep-${mode}-state.jsonl`);
  const registryPath = join(artifactDir, mode === 'review' ? 'deep-review-findings-registry.json' : 'findings-registry.json');
  const outputPath = join(artifactDir, mode === 'review' ? 'review-report.md' : 'research.md');
  const dashboardPath = join(artifactDir, `deep-${mode}-dashboard.md`);
  fs.writeFileSync(stateLog, `${stateRecords.map((record) => JSON.stringify(record)).join('\n')}\n`);
  fs.writeFileSync(registryPath, JSON.stringify(registry));
  fs.writeFileSync(outputPath, '# Output\n');
  fs.writeFileSync(dashboardPath, '# Dashboard\n');
  if (config) fs.writeFileSync(join(artifactDir, `deep-${mode}-config.json`), JSON.stringify(config));

  const modeArgs = mode === 'research'
    ? ['--answered-count', '0', '--total-questions', '0']
    : [
        '--active-p0', '0',
        '--active-p1', '0',
        '--active-p2', '0',
        '--dimension-coverage', '1',
        '--verdict', 'PASS',
        '--release-readiness-state', 'ready',
      ];
  const result = spawnSync(process.execPath, [
    closeoutScript,
    '--mode', mode,
    '--event-dir', eventDir,
    '--artifact-dir', artifactDir,
    '--state-log', stateLog,
    '--registry', registryPath,
    '--output', outputPath,
    '--dashboard', dashboardPath,
    '--stop-reason', 'maxIterationsReached',
    ...modeArgs,
  ], { encoding: 'utf8' });

  return { artifactDir, eventDir, result };
}

type GatewayReviewRun = {
  artifactDir: string;
  eventDir: string;
  authorityRoot: string;
  sessionId: string;
  configPath: string;
  stateLogPath: string;
};

// A review run the gateway accepts: the artifact directory carries the mode's
// own name, so the gateway projects the state log into it instead of a nested
// copy the reducer never reads.
function createGatewayReviewRun(root: string): GatewayReviewRun {
  const artifactDir = join(root, 'review');
  const eventDir = join(root, 'events');
  const authorityRoot = join(root, 'authority');
  for (const dir of [artifactDir, eventDir, authorityRoot]) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const sessionId = `run-identity-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const run: GatewayReviewRun = {
    artifactDir,
    eventDir,
    authorityRoot,
    sessionId,
    configPath: join(artifactDir, 'deep-review-config.json'),
    stateLogPath: join(artifactDir, 'deep-review-state.jsonl'),
  };

  fs.writeFileSync(run.configPath, JSON.stringify({
    topic: 'Review: run identity',
    mode: 'review',
    sessionId,
    parentSessionId: null,
    lineageMode: 'new',
    generation: 1,
    maxIterations: 7,
    convergenceThreshold: 0.1,
    stopPolicy: 'convergence',
  }));
  fs.writeFileSync(join(artifactDir, 'deep-review-findings-registry.json'), JSON.stringify({
    sessionId,
    generation: 1,
    openFindings: [],
    resolvedFindings: [],
    repeatedFindings: [],
  }));
  fs.writeFileSync(join(artifactDir, 'review-report.md'), '# Review\n');
  fs.writeFileSync(join(artifactDir, 'deep-review-dashboard.md'), '# Dashboard\n');
  return run;
}

function runOpenRow(run: GatewayReviewRun): Record<string, unknown> {
  return {
    stem: 'deep_review.run_initialized',
    scope: { runId: run.sessionId, sessionId: run.sessionId, generation: 1 },
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

function iterationRow(run: GatewayReviewRun, iteration: number): Record<string, unknown> {
  return {
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
    sessionId: run.sessionId,
    generation: 1,
    lineageMode: 'new',
  };
}

function stageEvent(run: GatewayReviewRun, name: string, row: Record<string, unknown>): string {
  const eventPath = join(run.eventDir, `${name}.json`);
  fs.writeFileSync(eventPath, JSON.stringify(row));
  return eventPath;
}

// Every row of a gateway-backed run is appended, never written: the projection
// rebuilds the state log from the ledger and would drop a row the ledger never
// produced.
function appendEvent(run: GatewayReviewRun, eventPath: string): ReturnType<typeof spawnSync> {
  return spawnSync(process.execPath, [
    APPEND_GATEWAY,
    '--mode', 'review',
    '--run-directory', run.artifactDir,
    '--event-json', eventPath,
  ], {
    cwd: REPOSITORY_ROOT,
    encoding: 'utf8',
    env: { ...process.env, DEEP_LOOP_AUTHORITY_ROOT: run.authorityRoot },
  });
}

function runCloseout(run: GatewayReviewRun): ReturnType<typeof spawnSync> {
  return spawnSync(process.execPath, [
    closeoutScript,
    '--mode', 'review',
    '--event-dir', run.eventDir,
    '--artifact-dir', run.artifactDir,
    '--state-log', run.stateLogPath,
    '--registry', join(run.artifactDir, 'deep-review-findings-registry.json'),
    '--output', join(run.artifactDir, 'review-report.md'),
    '--dashboard', join(run.artifactDir, 'deep-review-dashboard.md'),
    '--stop-reason', 'maxIterationsReached',
    '--active-p0', '0',
    '--active-p1', '0',
    '--active-p2', '0',
    '--dimension-coverage', '1',
    '--verdict', 'PASS',
    '--release-readiness-state', 'ready',
  ], { encoding: 'utf8' });
}

function readStateRows(stateLogPath: string): Array<Record<string, unknown>> {
  return fs.readFileSync(stateLogPath, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

function readSynthesisEvent(eventDir: string): Record<string, unknown> & { eventName: string } {
  const eventPath = ['synthesis_complete.json', 'synthesis_incomplete.json']
    .map((name) => join(eventDir, name))
    .find((candidate) => fs.existsSync(candidate));
  if (!eventPath) throw new Error(`closeout did not write a synthesis event: ${eventDir}`);
  return {
    ...(JSON.parse(fs.readFileSync(eventPath, 'utf8')) as Record<string, unknown>),
    eventName: path.basename(eventPath, '.json'),
  };
}

function readScope(event: Record<string, unknown>): Record<string, unknown> {
  return event.scope as Record<string, unknown>;
}

describe('synthesis-closeout run identity', () => {
  it('scopes a review synthesis event by the config session id', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'synthesis-closeout-review-identity-'));
    try {
      const fixture = createCloseoutFixture(root, 'review', [
        { type: 'iteration', iteration: 1, findingsCount: 0 },
      ], {
        openFindings: [],
        resolvedFindings: [],
        repeatedFindings: [],
      }, {
        sessionId: 'session-review-001',
        parentSessionId: null,
      });

      expect(fixture.result.status, `${fixture.result.stdout}\n${fixture.result.stderr}`).toBe(0);
      const event = readSynthesisEvent(fixture.eventDir);
      expect(event.eventName).toBe('synthesis_complete');
      const scope = readScope(event);
      expect(scope.runId).toBe('session-review-001');
      expect(scope.sessionId).toBe('session-review-001');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('scopes a research synthesis event by the config session and parent session ids', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'synthesis-closeout-research-identity-'));
    try {
      const fixture = createCloseoutFixture(root, 'research', [
        { type: 'iteration', iteration: 1, findingsCount: 0 },
      ], {
        keyFindings: [],
        metrics: { sourceFindings: 0, reconstructionGaps: 0 },
      }, {
        sessionId: 'session-research-002',
        parentSessionId: 'session-parent-002',
      });

      expect(fixture.result.status, `${fixture.result.stdout}\n${fixture.result.stderr}`).toBe(0);
      const event = readSynthesisEvent(fixture.eventDir);
      expect(event.eventName).toBe('synthesis_complete');
      const scope = readScope(event);
      expect(scope.runId).toBe('session-research-002');
      expect(scope.lineageId).toBe('session-parent-002');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('reads the nested lineage block a research config is written with', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'synthesis-closeout-research-lineage-'));
    try {
      const fixture = createCloseoutFixture(root, 'research', [
        { type: 'iteration', iteration: 1, findingsCount: 0 },
      ], {
        keyFindings: [],
        metrics: { sourceFindings: 0, reconstructionGaps: 0 },
      }, {
        topic: 'nested lineage run',
        lineage: { sessionId: 'session-research-003', parentSessionId: null },
      });

      expect(fixture.result.status, `${fixture.result.stdout}\n${fixture.result.stderr}`).toBe(0);
      const event = readSynthesisEvent(fixture.eventDir);
      expect(event.eventName).toBe('synthesis_complete');
      const scope = readScope(event);
      expect(scope.runId).toBe('session-research-003');
      expect(scope.lineageId).toBe('session-research-003');
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('falls back to the artifact folder name when the run has no config', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'synthesis-closeout-no-config-'));
    try {
      const fixture = createCloseoutFixture(root, 'research', [
        { type: 'iteration', iteration: 1, findingsCount: 0 },
      ], {
        keyFindings: [],
        metrics: { sourceFindings: 0, reconstructionGaps: 0 },
      });

      expect(fixture.result.status, `${fixture.result.stdout}\n${fixture.result.stderr}`).toBe(0);
      const event = readSynthesisEvent(fixture.eventDir);
      expect(event.eventName).toBe('synthesis_complete');
      const scope = readScope(event);
      expect(scope.runId).toBe(path.basename(fixture.artifactDir));
      expect(scope.lineageId).toBe(path.basename(fixture.artifactDir));
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('appends the review synthesis event under the config session id', () => {
    fs.mkdirSync(SCRATCH_BASE, { recursive: true });
    const root = fs.mkdtempSync(path.join(SCRATCH_BASE, 'synthesis-closeout-gateway-'));
    try {
      const run = createGatewayReviewRun(root);
      const runOpen = appendEvent(run, stageEvent(run, 'run-open', runOpenRow(run)));
      expect(runOpen.status, `${runOpen.stdout}\n${runOpen.stderr}`).toBe(0);
      const iteration = appendEvent(run, stageEvent(run, 'iteration-1', iterationRow(run, 1)));
      expect(iteration.status, `${iteration.stdout}\n${iteration.stderr}`).toBe(0);

      const closeout = runCloseout(run);
      expect(closeout.status, `${closeout.stdout}\n${closeout.stderr}`).toBe(0);

      const synthesis = appendEvent(run, join(run.eventDir, 'synthesis_complete.json'));
      expect(synthesis.status, `${synthesis.stdout}\n${synthesis.stderr}`).toBe(0);

      const config = JSON.parse(fs.readFileSync(run.configPath, 'utf8')) as { sessionId: string };
      const recorded = readStateRows(run.stateLogPath).filter((row) => row.event === 'synthesis_complete');
      expect(recorded).toHaveLength(1);
      expect(recorded[0].sessionId).toBe(config.sessionId);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }, 240_000);
});
