// ───────────────────────────────────────────────────────────────────
// MODULE: Self-Check Adjudication Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { APPEND_GATEWAY, REPOSITORY_ROOT } from '../helpers/gateway-backed-lineage';

const REDUCER = resolve(import.meta.dirname, '..', '..', 'scripts', 'reduce-state.cjs');
const VERDICT = resolve(import.meta.dirname, '..', '..', 'scripts', 'review-verdict.cjs');
const HEX_DIGEST = '0123456789abcdef'.repeat(4);
const SESSION_ID = 'session-self-check-001';

type GatewayReviewRun = {
  runDirectory: string;
  eventDir: string;
  authorityRoot: string;
  stateLogPath: string;
};

type ReviewFinding = {
  findingId: string;
  severity: string;
  status: string;
  resolution?: string;
};

type ReviewRegistry = {
  openFindings: ReviewFinding[];
  resolvedFindings: ReviewFinding[];
};

type VerdictPayload = {
  verdict: string;
  active_p1: number;
  active_p2: number;
};

// The gateway binds each append to the checkout it runs in, so the run
// directory is a scratch packet whose own `review/` directory receives the
// projection it writes back from the ledger.
function createGatewayReviewRun(root: string): GatewayReviewRun {
  const runDirectory = join(root, 'packet');
  const eventDir = join(root, 'events');
  const authorityRoot = join(root, 'authority');
  for (const dir of [runDirectory, eventDir, authorityRoot]) {
    mkdirSync(dir, { recursive: true });
  }
  return {
    runDirectory,
    eventDir,
    authorityRoot,
    stateLogPath: join(runDirectory, 'review', 'deep-review-state.jsonl'),
  };
}

function runOpenRow(): Record<string, unknown> {
  return {
    stem: 'deep_review.run_initialized',
    scope: { runId: SESSION_ID, sessionId: SESSION_ID, generation: 1 },
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

// One iteration that raised two findings of the same tier, so the two
// adjudications below are the only thing that can separate them.
function iterationRow(): Record<string, unknown> {
  return {
    stem: 'deep_review.iteration_recorded',
    scope: { runId: SESSION_ID, sessionId: SESSION_ID },
    data: {
      record: {
        type: 'iteration',
        iteration: 1,
        run: 1,
        mode: 'review',
        status: 'complete',
        focus: 'correctness',
        findingsCount: 2,
        findingsSummary: { P0: 0, P1: 2, P2: 0 },
        newFindingsRatio: 1,
        findingDetails: [
          { id: 'F001', severity: 'P1', title: 'Unchecked index in parseFoo', file: 'src/foo.ts:10' },
          { id: 'F002', severity: 'P1', title: 'Missing timeout on fetchBar', file: 'src/bar.ts:20' },
        ],
      },
    },
  };
}

function claimAdjudicationRow(findingId: string, finalSeverity: string): Record<string, unknown> {
  return {
    stem: 'deep_review.claim_adjudication',
    scope: { runId: SESSION_ID, sessionId: SESSION_ID },
    data: {
      mode: 'review',
      run: 1,
      passed: true,
      activeP0P1: 0,
      missingPackets: [],
      reason: null,
      sessionId: SESSION_ID,
      generation: 1,
      findingId,
      finalSeverity,
    },
  };
}

function appendEvent(
  run: GatewayReviewRun,
  name: string,
  row: Record<string, unknown>,
): ReturnType<typeof spawnSync> {
  const eventPath = join(run.eventDir, `${name}.json`);
  writeFileSync(eventPath, JSON.stringify(row), 'utf8');
  return spawnSync(process.execPath, [
    APPEND_GATEWAY,
    '--mode', 'deep-review',
    '--run-directory', run.runDirectory,
    '--event-json', eventPath,
  ], {
    cwd: REPOSITORY_ROOT,
    encoding: 'utf8',
    env: { ...process.env, DEEP_LOOP_AUTHORITY_ROOT: run.authorityRoot },
  });
}

function readProjectedRows(stateLogPath: string): Array<Record<string, unknown>> {
  return readFileSync(stateLogPath, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

describe('self-check adjudication through the append gateway', () => {
  it('projects the finding and final severity a gate summary adjudicates', () => {
    const root = mkdtempSync(join(tmpdir(), 'self-check-adjudication-'));
    try {
      const run = createGatewayReviewRun(root);

      const openResult = appendEvent(run, 'run-open', runOpenRow());
      expect(openResult.status, `${openResult.stdout}\n${openResult.stderr}`).toBe(0);

      const claimResult = appendEvent(run, 'claim-adjudication', claimAdjudicationRow('F001', 'P2'));
      expect(claimResult.status, `${claimResult.stdout}\n${claimResult.stderr}`).toBe(0);

      const adjudication = readProjectedRows(run.stateLogPath)
        .find((row) => row.event === 'claim_adjudication');
      expect(adjudication).toBeDefined();
      expect(adjudication).toMatchObject({
        findingId: 'F001',
        finalSeverity: 'P2',
      });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  // A finding the self-check disproved is not work left to do: it has to leave
  // the open set, or a run with nothing left to fix still reads as holding a P1
  // that no reader can find in the code.
  it('retires a disproved claim as a false positive and keeps the re-ranked one open', () => {
    const root = mkdtempSync(join(tmpdir(), 'self-check-adjudication-'));
    try {
      const run = createGatewayReviewRun(root);
      const reviewDir = join(run.runDirectory, 'review');
      mkdirSync(reviewDir, { recursive: true });

      const openResult = appendEvent(run, 'run-open', runOpenRow());
      expect(openResult.status, `${openResult.stdout}\n${openResult.stderr}`).toBe(0);

      const iterationResult = appendEvent(run, 'iteration-1', iterationRow());
      expect(iterationResult.status, `${iterationResult.stdout}\n${iterationResult.stderr}`).toBe(0);

      const downgraded = appendEvent(run, 'adjudicate-F001', claimAdjudicationRow('F001', 'P2'));
      expect(downgraded.status, `${downgraded.stdout}\n${downgraded.stderr}`).toBe(0);

      const disproved = appendEvent(run, 'adjudicate-F002', claimAdjudicationRow('F002', 'none'));
      expect(disproved.status, `${disproved.stdout}\n${disproved.stderr}`).toBe(0);

      // The reducer reads its config beside the log, and the projection only
      // ever writes rows, so the file the run started from is written here.
      writeFileSync(
        join(reviewDir, 'deep-review-config.json'),
        JSON.stringify({ maxIterations: 5, reviewTarget: 'self-check-false-positive' }),
        'utf8',
      );
      const reduceResult = spawnSync(process.execPath, [
        REDUCER,
        run.runDirectory,
        '--artifact-dir', reviewDir,
      ], {
        cwd: REPOSITORY_ROOT,
        encoding: 'utf8',
      });
      expect(reduceResult.status, `${reduceResult.stdout}\n${reduceResult.stderr}`).toBe(0);

      const registryPath = join(reviewDir, 'deep-review-findings-registry.json');
      const registry = JSON.parse(readFileSync(registryPath, 'utf8')) as ReviewRegistry;
      const active = registry.openFindings.filter((finding) => finding.status === 'active');
      expect(active.filter((finding) => finding.severity === 'P1')).toHaveLength(0);
      expect(active.map((finding) => [finding.findingId, finding.severity])).toEqual([['F001', 'P2']]);
      expect(registry.resolvedFindings.map((finding) => [finding.findingId, finding.resolution]))
        .toEqual([['F002', 'false_positive']]);

      const verdictResult = spawnSync(process.execPath, [
        VERDICT,
        '--registry-path', registryPath,
        '--state-log', run.stateLogPath,
      ], {
        cwd: REPOSITORY_ROOT,
        encoding: 'utf8',
      });
      expect(verdictResult.status, `${verdictResult.stdout}\n${verdictResult.stderr}`).toBe(0);
      const verdict = JSON.parse(verdictResult.stdout) as VerdictPayload;
      expect(verdict).toMatchObject({ active_p1: 0, active_p2: 1, verdict: 'PASS' });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
