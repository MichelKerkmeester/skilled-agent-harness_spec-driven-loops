// ───────────────────────────────────────────────────────────────────
// MODULE: Executor Audit Ledger Projection Tests
// ───────────────────────────────────────────────────────────────────
//
// A ledger-backed state log is a projection the append gateway rebuilds from
// the ledger, so the pre-dispatch executor row has to reach the ledger to
// survive the next refresh. Each test opens a real run through the gateway,
// writes the executor row, then hands the gateway the leaf's iteration record,
// which rebuilds the state log.

import { describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  appendExecutorAuditToLastRecord,
  emitDispatchFailure,
  runAuditedExecutorCommand,
  writeFirstRecordExecutor,
} from '../../lib/deep-loop/executor-audit.js';
import type { ExecutorConfig } from '../../lib/deep-loop/executor-config.js';

type Mode = 'review' | 'research';

const GATEWAY = fileURLToPath(new URL('../../scripts/append-mode-event.cjs', import.meta.url));
const REPOSITORY_ROOT = fileURLToPath(new URL('../../../../../../', import.meta.url));
const DIGEST = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

const EXECUTOR: ExecutorConfig = {
  kind: 'cli-claude-code',
  model: 'claude-opus-4-6',
  configDir: null,
  reasoningEffort: 'high',
  serviceTier: null,
  sandboxMode: null,
  timeoutSeconds: 900,
};

function runOpenEvent(mode: Mode, sessionId: string): Record<string, unknown> {
  if (mode === 'review') {
    return {
      stem: 'deep_review.run_initialized',
      scope: { runId: sessionId, sessionId, generation: 1 },
      data: {
        target: {
          targetId: 'review-target',
          targetType: 'file',
          artifactRef: 'deep-review-config.json#reviewTarget',
          sourceDigest: DIGEST,
          contentDigest: DIGEST,
        },
        lineageMode: 'fresh',
        maxIterations: 3,
        convergencePolicyVersion: 'convergence-policy@default',
        reviewModeContractDigest: DIGEST,
        initialReleaseReadinessState: 'not-assessed',
      },
    };
  }
  return {
    stem: 'deep_research.run_initialized',
    scope: { runId: sessionId, lineageId: sessionId },
    data: {
      generation: 1,
      charterDigest: DIGEST,
      configDigest: DIGEST,
      executorFingerprint: DIGEST,
      replayFingerprint: DIGEST,
      maxIterations: 3,
      convergencePolicyVersion: '1.0.0',
    },
  };
}

function leafIterationRecord(mode: Mode, sessionId: string): Record<string, unknown> {
  const shared = {
    type: 'iteration',
    iteration: 1,
    run: 1,
    mode,
    status: mode === 'review' ? 'complete' : 'insight',
    focus: 'executor identity',
    sessionId,
    timestamp: '2026-11-14T12:00:00Z',
  };
  return mode === 'review'
    ? shared
    : { ...shared, runId: sessionId, lineageId: sessionId, newInfoRatio: 0.5 };
}

function appendThroughGateway(mode: Mode, runDirectory: string, event: Record<string, unknown>): void {
  const eventPath = join(runDirectory, '..', 'event.json');
  writeFileSync(eventPath, JSON.stringify(event), 'utf8');
  const result = spawnSync(process.execPath, [
    GATEWAY, '--mode', mode, '--run-directory', runDirectory, '--event-json', eventPath,
  ], { cwd: REPOSITORY_ROOT, encoding: 'utf8' });
  expect(result.status, `${result.stdout}${result.stderr}`).toBe(0);
}

function stateRows(stateLogPath: string): Array<Record<string, unknown>> {
  return readFileSync(stateLogPath, 'utf8').trimEnd().split('\n').map((line) => JSON.parse(line));
}

describe('writeFirstRecordExecutor on a ledger-backed state log', () => {
  it.each(['review', 'research'] as const)('keeps the %s executor row through a projection refresh', (mode) => {
    const root = mkdtempSync(join(tmpdir(), 'executor-audit-ledger-'));
    try {
      const runDirectory = join(root, mode);
      mkdirSync(runDirectory);
      const stateLogPath = join(runDirectory, `deep-${mode}-state.jsonl`);
      const sessionId = `session-executor-${mode}`;
      appendThroughGateway(mode, runDirectory, runOpenEvent(mode, sessionId));

      writeFirstRecordExecutor(stateLogPath, EXECUTOR, 1, sessionId);
      appendThroughGateway(mode, runDirectory, leafIterationRecord(mode, sessionId));
      // A second audit of the same iteration finds the row and appends nothing.
      writeFirstRecordExecutor(stateLogPath, EXECUTOR, 1, sessionId);

      const rows = stateRows(stateLogPath);
      const opening = rows.filter((row) => row.type === 'iteration_start' && row.iteration === 1);
      expect(opening).toHaveLength(1);
      expect(opening[0].executor).toMatchObject({ kind: 'cli-claude-code', model: 'claude-opus-4-6' });
      expect(rows.at(-1)).toMatchObject({ type: 'iteration', iteration: 1 });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('refuses a ledger-backed write that names no session id', () => {
    const root = mkdtempSync(join(tmpdir(), 'executor-audit-ledger-'));
    try {
      const runDirectory = join(root, 'review');
      mkdirSync(runDirectory);
      appendThroughGateway('review', runDirectory, runOpenEvent('review', 'session-executor-none'));
      const stateLogPath = join(runDirectory, 'deep-review-state.jsonl');
      const before = readFileSync(stateLogPath, 'utf8');

      expect(() => writeFirstRecordExecutor(stateLogPath, EXECUTOR, 1)).toThrow('needs the run session id');
      expect(readFileSync(stateLogPath, 'utf8')).toBe(before);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe('the failure rows and the post-dispatch audit on a ledger-backed state log', () => {
  function openRun(mode: Mode): { root: string; runDirectory: string; stateLogPath: string; sessionId: string } {
    const root = mkdtempSync(join(tmpdir(), 'executor-audit-ledger-'));
    const runDirectory = join(root, mode);
    mkdirSync(runDirectory);
    const sessionId = `session-writers-${mode}`;
    appendThroughGateway(mode, runDirectory, runOpenEvent(mode, sessionId));
    return { root, runDirectory, stateLogPath: join(runDirectory, `deep-${mode}-state.jsonl`), sessionId };
  }

  it.each(['review', 'research'] as const)('keeps one %s dispatch_failure row through a projection refresh', (mode) => {
    const run = openRun(mode);
    try {
      emitDispatchFailure(run.stateLogPath, EXECUTOR, 'crash', 1, 'executor exited with status 3', 'rate limit', run.sessionId);
      // The same failure again matches the row the projection wrote back, so it adds nothing.
      emitDispatchFailure(run.stateLogPath, EXECUTOR, 'crash', 1, 'executor exited with status 3', 'rate limit', run.sessionId);
      appendThroughGateway(mode, run.runDirectory, leafIterationRecord(mode, run.sessionId));

      const failures = stateRows(run.stateLogPath).filter((row) => row.event === 'dispatch_failure');
      expect(failures).toHaveLength(1);
      expect(failures[0]).toMatchObject({
        type: 'event',
        reason: 'crash',
        iteration: 1,
        executorUnavailable: true,
        matchedMarker: 'rate limit',
        executor: { kind: 'cli-claude-code', model: 'claude-opus-4-6' },
      });
    } finally {
      rmSync(run.root, { recursive: true, force: true });
    }
  });

  it.each(['review', 'research'] as const)('keeps the %s receipt write failure rows through a projection refresh', (mode) => {
    const run = openRun(mode);
    try {
      const notADirectory = join(run.root, 'not-a-directory');
      writeFileSync(notADirectory, 'x', 'utf8');
      runAuditedExecutorCommand({
        command: process.execPath,
        args: ['-e', 'process.exit(0)'],
        cwd: run.root,
        timeoutSeconds: 10,
        stateLogPath: run.stateLogPath,
        executor: EXECUTOR,
        iteration: 1,
        guardContext: { env: { PATH: process.env.PATH, HOME: process.env.HOME }, ancestryCmdlines: [], statePaths: [] },
        receiptDir: join(notADirectory, 'receipts'),
        dispatchId: `${mode}-i1-g1`,
        sessionId: run.sessionId,
      });
      appendThroughGateway(mode, run.runDirectory, leafIterationRecord(mode, run.sessionId));

      const failures = stateRows(run.stateLogPath).filter((row) => row.event === 'dispatch_receipt_write_failed');
      expect(failures.map((row) => row.phase)).toEqual(['intent', 'completion']);
    } finally {
      rmSync(run.root, { recursive: true, force: true });
    }
  });

  it.each(['review', 'research'] as const)('keeps the %s post-dispatch executor audit through a projection refresh', (mode) => {
    const run = openRun(mode);
    try {
      appendThroughGateway(mode, run.runDirectory, leafIterationRecord(mode, run.sessionId));
      appendExecutorAuditToLastRecord(run.stateLogPath, EXECUTOR, run.sessionId);
      // A second audit finds the opening row and appends nothing.
      const afterAudit = readFileSync(run.stateLogPath, 'utf8');
      appendExecutorAuditToLastRecord(run.stateLogPath, EXECUTOR, run.sessionId);
      expect(readFileSync(run.stateLogPath, 'utf8')).toBe(afterAudit);
      appendThroughGateway(mode, run.runDirectory, { ...leafIterationRecord(mode, run.sessionId), iteration: 2, run: 2 });

      const opening = stateRows(run.stateLogPath).filter((row) => row.type === 'iteration_start' && row.iteration === 1);
      expect(opening).toHaveLength(1);
      expect(opening[0].executor).toMatchObject({ kind: 'cli-claude-code', model: 'claude-opus-4-6' });
    } finally {
      rmSync(run.root, { recursive: true, force: true });
    }
  });

  it('writes a failure row straight into a ledger-backed log when the run names no session id', () => {
    const run = openRun('review');
    try {
      emitDispatchFailure(run.stateLogPath, EXECUTOR, 'timeout', 1, 'deadline exceeded');
      expect(stateRows(run.stateLogPath).filter((row) => row.event === 'dispatch_failure')).toHaveLength(1);
    } finally {
      rmSync(run.root, { recursive: true, force: true });
    }
  });
});
