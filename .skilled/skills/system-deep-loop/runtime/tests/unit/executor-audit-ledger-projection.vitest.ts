// ───────────────────────────────────────────────────────────────────
// MODULE: Executor Audit Ledger Projection Tests
// ───────────────────────────────────────────────────────────────────
//
// A ledger-backed state log is a projection the append gateway rebuilds from
// the ledger, so the pre-dispatch executor row has to reach the ledger to
// survive the next refresh. Each test opens a real run through the gateway,
// writes the executor row, then hands the gateway the leaf's iteration record,
// which rebuilds the state log. The failure, verification and write-containment
// rows get the same check, and the executor check is run against the opening row.

import { describe, expect, it, vi } from 'vitest';

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
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
import { validateIterationOutputs } from '../../lib/deep-loop/post-dispatch-validate.js';
import { REPOSITORY_ROOT } from '../helpers/gateway-backed-lineage.js';
import { enforceWriteContainment, snapshotOutOfScopeDirtyPaths } from '../../lib/deep-loop/write-containment.js';

type Mode = 'review' | 'research';

const GATEWAY = fileURLToPath(new URL('../../scripts/append-mode-event.cjs', import.meta.url));
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

describe('the verification and write-containment rows on a ledger-backed state log', () => {
  function openRun(mode: Mode, root: string): { runDirectory: string; stateLogPath: string; sessionId: string } {
    const runDirectory = join(root, mode);
    mkdirSync(runDirectory, { recursive: true });
    const sessionId = `session-diagnostics-${mode}`;
    appendThroughGateway(mode, runDirectory, runOpenEvent(mode, sessionId));
    return { runDirectory, stateLogPath: join(runDirectory, `deep-${mode}-state.jsonl`), sessionId };
  }

  // git must answer for the fixture repository, never for the worktree the suite runs in.
  function git(repoRoot: string, args: string[]): void {
    const env = { ...process.env };
    for (const key of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE']) delete env[key];
    const result = spawnSync('git', ['-c', 'core.hooksPath=/dev/null', '-C', repoRoot, ...args], { encoding: 'utf8', env });
    expect(result.status, result.stderr).toBe(0);
  }

  // A run whose state log sits inside the lane's artifact directory, with an operator draft that
  // is dirty before the dispatch and changes again during it, and a stray lane write to a clean
  // tracked file.
  function containmentRun(mode: Mode, root: string) {
    git(root, ['init', '-q']);
    git(root, ['config', 'user.email', 'test@local']);
    git(root, ['config', 'user.name', 'test']);
    git(root, ['config', 'core.excludesFile', '/dev/null']);
    writeFileSync(join(root, 'tracked-outside.txt'), 'ORIGINAL\n');
    const artifactDir = join(root, 'artifact');
    mkdirSync(artifactDir);
    writeFileSync(join(artifactDir, 'seed.md'), 'seed\n');
    git(root, ['add', '-A']);
    git(root, ['commit', '-q', '-m', 'baseline']);
    const run = openRun(mode, artifactDir);
    writeFileSync(join(root, 'operator-notes.md'), 'NOTES_DRAFT_1\n');
    const preDispatchDirtyPaths = snapshotOutOfScopeDirtyPaths({ repoRoot: root, artifactDir, captureContentDir: artifactDir });
    writeFileSync(join(root, 'operator-notes.md'), 'NOTES_DRAFT_2\n');
    writeFileSync(join(root, 'tracked-outside.txt'), 'LANE_WROTE_THIS\n');
    return { ...run, artifactDir, preDispatchDirtyPaths };
  }

  it.each(['review', 'research'] as const)('keeps the %s verification_degraded row through a projection refresh', (mode) => {
    const root = mkdtempSync(join(tmpdir(), 'diagnostic-ledger-'));
    try {
      const run = openRun(mode, root);
      const previousStateLogSize = statSync(run.stateLogPath).size;
      appendThroughGateway(mode, run.runDirectory, leafIterationRecord(mode, run.sessionId));
      const iterationFile = join(root, 'iteration-001.md');
      writeFileSync(iterationFile, ['# Iteration 1', '', '```typescript', 'export function broken() {', '  return 1;', '```', ''].join('\n'));

      const result = validateIterationOutputs({
        iterationFile,
        stateLogPath: run.stateLogPath,
        previousStateLogSize,
        requiredJsonlFields: ['type', 'iteration'],
        recipeConfig: { verification_enabled: true, verification_languages: ['typescript'], verification_threshold: 0.5 },
        sessionId: run.sessionId,
      });
      expect(result).toMatchObject({ ok: false, reason: 'verification_degraded' });
      appendThroughGateway(mode, run.runDirectory, { ...leafIterationRecord(mode, run.sessionId), iteration: 2, run: 2 });

      const degraded = stateRows(run.stateLogPath).filter((row) => row.event === 'verification_degraded');
      expect(degraded).toHaveLength(1);
      expect(degraded[0]).toMatchObject({
        type: 'event',
        status: 'degraded',
        language: 'typescript',
        threshold: 0.5,
        reason: 'verification_degraded',
        detail: 'verification confidence 0.00 below threshold 0.50',
      });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it.each(['review', 'research'] as const)('keeps the %s containment rows through a projection refresh', (mode) => {
    const root = mkdtempSync(join(tmpdir(), 'diagnostic-ledger-'));
    try {
      const run = containmentRun(mode, root);
      enforceWriteContainment({
        repoRoot: root,
        artifactDir: run.artifactDir,
        preDispatchDirtyPaths: run.preDispatchDirtyPaths,
        baselineContentRoot: run.artifactDir,
        stateLogPath: run.stateLogPath,
        sessionId: run.sessionId,
        iteration: 1,
        label: `${mode}-i1-g1`,
      });
      appendThroughGateway(mode, run.runDirectory, leafIterationRecord(mode, run.sessionId));

      const rows = stateRows(run.stateLogPath);
      const violations = rows.filter((row) => row.event === 'containment_violation');
      const contested = rows.filter((row) => row.event === 'containment_contested');
      expect(violations).toHaveLength(1);
      expect(violations[0]).toMatchObject({
        type: 'event',
        severity: 'error',
        iteration: 1,
        label: `${mode}-i1-g1`,
        violations: [{ path: 'tracked-outside.txt' }],
      });
      expect(contested).toHaveLength(1);
      expect(contested[0]).toMatchObject({
        type: 'event',
        severity: 'warning',
        iteration: 1,
        paths: [{ path: 'operator-notes.md' }],
      });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('writes a containment row straight into a ledger-backed log when the run names no session id', () => {
    const root = mkdtempSync(join(tmpdir(), 'diagnostic-ledger-'));
    const stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    try {
      const run = containmentRun('review', root);
      expect(() => enforceWriteContainment({
        repoRoot: root,
        artifactDir: run.artifactDir,
        preDispatchDirtyPaths: run.preDispatchDirtyPaths,
        baselineContentRoot: run.artifactDir,
        stateLogPath: run.stateLogPath,
        iteration: 1,
      })).not.toThrow();

      const rows = stateRows(run.stateLogPath);
      expect(rows.filter((row) => row.event === 'containment_violation')).toHaveLength(1);
      expect(rows.filter((row) => row.event === 'containment_contested')).toHaveLength(1);
      expect(stderr.mock.calls.map(([line]) => String(line)).join('')).toContain('no session id scopes the containment_violation row');
    } finally {
      stderr.mockRestore();
      rmSync(root, { recursive: true, force: true });
    }
  });

  it.each(['review', 'research'] as const)('accepts the %s executor from the opening row of a ledger-backed log', (mode) => {
    const root = mkdtempSync(join(tmpdir(), 'diagnostic-ledger-'));
    try {
      const run = openRun(mode, root);
      writeFirstRecordExecutor(run.stateLogPath, EXECUTOR, 1, run.sessionId);
      const previousStateLogSize = statSync(run.stateLogPath).size;
      appendThroughGateway(mode, run.runDirectory, leafIterationRecord(mode, run.sessionId));
      const iterationFile = join(root, 'iteration-001.md');
      writeFileSync(iterationFile, '# Iteration 1\n');

      const result = validateIterationOutputs({
        iterationFile,
        stateLogPath: run.stateLogPath,
        previousStateLogSize,
        requiredJsonlFields: ['type', 'iteration'],
        executorKind: 'cli-claude-code',
      });
      expect(result.ok, JSON.stringify(result)).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('still reports executor_missing on a ledger-backed log whose opening row names no executor', () => {
    const root = mkdtempSync(join(tmpdir(), 'diagnostic-ledger-'));
    try {
      const run = openRun('review', root);
      const previousStateLogSize = statSync(run.stateLogPath).size;
      appendThroughGateway('review', run.runDirectory, leafIterationRecord('review', run.sessionId));
      const iterationFile = join(root, 'iteration-001.md');
      writeFileSync(iterationFile, '# Iteration 1\n');

      expect(validateIterationOutputs({
        iterationFile,
        stateLogPath: run.stateLogPath,
        previousStateLogSize,
        requiredJsonlFields: ['type', 'iteration'],
        executorKind: 'cli-claude-code',
      })).toMatchObject({ ok: false, reason: 'executor_missing' });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
