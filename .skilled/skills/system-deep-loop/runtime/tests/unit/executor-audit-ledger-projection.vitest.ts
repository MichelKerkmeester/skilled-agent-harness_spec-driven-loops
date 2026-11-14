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

import { writeFirstRecordExecutor } from '../../lib/deep-loop/executor-audit.js';
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
