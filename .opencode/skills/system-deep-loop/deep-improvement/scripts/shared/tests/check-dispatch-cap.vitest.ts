import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../../');
const require = createRequire(import.meta.url);

const CHECK_SCRIPT = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/check-dispatch-cap.cjs',
);

type CheckResult = {
  allowed: boolean;
  operation: string;
  capField: string;
  countEventType: string;
  cap: number;
  currentCount: number;
  requested: number;
  projected: number;
  message: string;
};

const checker = require(CHECK_SCRIPT) as {
  OPERATIONS: Readonly<Record<string, Readonly<{ capField: string; countEventType: string; label: string }>>>;
  DEFAULT_CAPS: Readonly<Record<string, number>>;
  resolveCap: (config: Record<string, unknown> | undefined, operation: string) => number;
  countOperationEvents: (journalPath: string, operation: string) => number;
  checkDispatchCap: (input: {
    journalPath: string;
    config: Record<string, unknown>;
    operation: string;
    requested?: number;
  }) => CheckResult;
};

const journal = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs',
)) as {
  emitEvent: (journalPath: string, event: object) => { success: boolean; errors?: string[] };
};

let tmpDir: string;
let journalPath: string;
let configPath: string;

function writeConfig(dispatchCaps: Record<string, unknown> | undefined): void {
  const payload = dispatchCaps === undefined ? {} : { dispatchCaps };
  fs.writeFileSync(configPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function emitN(eventType: string, count: number): void {
  for (let index = 0; index < count; index += 1) {
    const result = journal.emitEvent(journalPath, { eventType, iteration: index + 1, details: {} });
    if (!result.success) {
      throw new Error(`Fixture setup failed to emit ${eventType}: ${(result.errors || []).join(', ')}`);
    }
  }
}

function runCli(args: string[]): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync('node', [CHECK_SCRIPT, ...args], { encoding: 'utf8', cwd: WORKSPACE_ROOT });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dispatch-cap-test-'));
  journalPath = path.join(tmpDir, 'improvement-journal.jsonl');
  configPath = path.join(tmpDir, 'agent-improvement-config.json');
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('check-dispatch-cap', () => {
  describe('operation-defaults contract', () => {
    it('ships the operator-decided defaults: 5 candidate dispatches, 15 score executions, 5 benchmark runs', () => {
      expect(checker.DEFAULT_CAPS.candidateDispatch).toBe(5);
      expect(checker.DEFAULT_CAPS.scoreExecution).toBe(15);
      expect(checker.DEFAULT_CAPS.benchmarkRun).toBe(5);
    });

    it('maps each operation to the config field and journal eventType it is counted from', () => {
      expect(checker.OPERATIONS.candidateDispatch.capField).toBe('maxCandidateDispatches');
      expect(checker.OPERATIONS.candidateDispatch.countEventType).toBe('candidate_generated');
      expect(checker.OPERATIONS.scoreExecution.capField).toBe('maxScoreExecutions');
      expect(checker.OPERATIONS.scoreExecution.countEventType).toBe('score_execution_recorded');
      expect(checker.OPERATIONS.benchmarkRun.capField).toBe('maxBenchmarkRuns');
      expect(checker.OPERATIONS.benchmarkRun.countEventType).toBe('benchmark_completed');
    });
  });

  describe('resolveCap', () => {
    it('uses the configured dispatchCaps value when present and finite', () => {
      expect(checker.resolveCap({ dispatchCaps: { maxCandidateDispatches: 9 } }, 'candidateDispatch')).toBe(9);
    });

    it('falls back to the schema default when dispatchCaps is missing entirely', () => {
      expect(checker.resolveCap({}, 'candidateDispatch')).toBe(5);
      expect(checker.resolveCap({}, 'scoreExecution')).toBe(15);
      expect(checker.resolveCap({}, 'benchmarkRun')).toBe(5);
      expect(checker.resolveCap(undefined, 'benchmarkRun')).toBe(5);
    });

    it('falls back to the schema default when the specific field is absent from dispatchCaps', () => {
      expect(checker.resolveCap({ dispatchCaps: { maxCandidateDispatches: 9 } }, 'scoreExecution')).toBe(15);
    });

    it('falls back to the schema default on a non-numeric override', () => {
      expect(checker.resolveCap({ dispatchCaps: { maxBenchmarkRuns: 'not-a-number' } }, 'benchmarkRun')).toBe(5);
      expect(checker.resolveCap({ dispatchCaps: { maxBenchmarkRuns: -3 } }, 'benchmarkRun')).toBe(5);
    });

    it('honors an explicit 0 cap (fully blocks the operation)', () => {
      expect(checker.resolveCap({ dispatchCaps: { maxBenchmarkRuns: 0 } }, 'benchmarkRun')).toBe(0);
    });
  });

  describe('countOperationEvents', () => {
    it('returns 0 when the journal does not exist yet (first check of the session)', () => {
      expect(checker.countOperationEvents(journalPath, 'candidateDispatch')).toBe(0);
    });

    it('counts only the eventType mapped to the requested operation, ignoring other journal noise', () => {
      emitN('candidate_generated', 2);
      emitN('benchmark_completed', 1);
      emitN('score_execution_recorded', 3);
      journal.emitEvent(journalPath, { eventType: 'session_start' });

      expect(checker.countOperationEvents(journalPath, 'candidateDispatch')).toBe(2);
      expect(checker.countOperationEvents(journalPath, 'benchmarkRun')).toBe(1);
      expect(checker.countOperationEvents(journalPath, 'scoreExecution')).toBe(3);
    });
  });

  describe('checkDispatchCap', () => {
    it('throws on an unknown operation', () => {
      expect(() => checker.checkDispatchCap({ journalPath, config: {}, operation: 'notAThing' })).toThrow(
        /Unknown dispatch-cap operation/,
      );
    });

    it('allows the first dispatch of a fresh session (no journal yet)', () => {
      const result = checker.checkDispatchCap({ journalPath, config: {}, operation: 'candidateDispatch' });
      expect(result.allowed).toBe(true);
      expect(result.currentCount).toBe(0);
      expect(result.projected).toBe(1);
      expect(result.cap).toBe(5);
    });

    it('allows exactly at the cap boundary (projected count equal to cap is not "exceeding")', () => {
      emitN('benchmark_completed', 4);
      const result = checker.checkDispatchCap({
        journalPath,
        config: { dispatchCaps: { maxBenchmarkRuns: 5 } },
        operation: 'benchmarkRun',
      });
      expect(result.allowed).toBe(true);
      expect(result.currentCount).toBe(4);
      expect(result.projected).toBe(5);
    });

    it('rejects candidateDispatch once the cumulative cap would be exceeded', () => {
      emitN('candidate_generated', 5);
      const result = checker.checkDispatchCap({
        journalPath,
        config: { dispatchCaps: { maxCandidateDispatches: 5 } },
        operation: 'candidateDispatch',
      });
      expect(result.allowed).toBe(false);
      expect(result.currentCount).toBe(5);
      expect(result.projected).toBe(6);
      expect(result.message).toContain('DISPATCH CAP EXCEEDED');
      expect(result.message).toContain('dispatchCaps.maxCandidateDispatches');
    });

    it('rejects benchmarkRun once the cumulative cap would be exceeded', () => {
      emitN('benchmark_completed', 5);
      const result = checker.checkDispatchCap({
        journalPath,
        config: { dispatchCaps: { maxBenchmarkRuns: 5 } },
        operation: 'benchmarkRun',
      });
      expect(result.allowed).toBe(false);
      expect(result.message).toContain('dispatchCaps.maxBenchmarkRuns');
    });

    it('rejects scoreExecution once the cumulative cap (default 15 = 5 iterations x 3 replays) would be exceeded', () => {
      emitN('score_execution_recorded', 15);
      const result = checker.checkDispatchCap({ journalPath, config: {}, operation: 'scoreExecution' });
      expect(result.allowed).toBe(false);
      expect(result.currentCount).toBe(15);
      expect(result.cap).toBe(15);
      expect(result.message).toContain('dispatchCaps.maxScoreExecutions');
    });

    it('rejects a batched replay request (requested=2) that would push the cumulative count past the cap', () => {
      // Mirrors iteration 5 under defaults: primary already recorded (13 -> after
      // 4 full iterations of 3 + this iteration's primary), replays ask for 2 more
      // against a cap of 15 tightened to 14 so the batch alone tips it over.
      emitN('score_execution_recorded', 13);
      const result = checker.checkDispatchCap({
        journalPath,
        config: { dispatchCaps: { maxScoreExecutions: 14 } },
        operation: 'scoreExecution',
        requested: 2,
      });
      expect(result.allowed).toBe(false);
      expect(result.currentCount).toBe(13);
      expect(result.requested).toBe(2);
      expect(result.projected).toBe(15);
      expect(result.cap).toBe(14);
    });

    it('allows a batched replay request (requested=2) that lands exactly on the cap', () => {
      emitN('score_execution_recorded', 13);
      const result = checker.checkDispatchCap({
        journalPath,
        config: { dispatchCaps: { maxScoreExecutions: 15 } },
        operation: 'scoreExecution',
        requested: 2,
      });
      expect(result.allowed).toBe(true);
      expect(result.projected).toBe(15);
    });

    it('proves the full 5-iteration default-cap trace: 5 candidate dispatches, 15 score executions, 5 benchmark runs all land exactly at cap and a 6th iteration is rejected on the first check', () => {
      const config = {};
      for (let iteration = 1; iteration <= 5; iteration += 1) {
        const candidateCheck = checker.checkDispatchCap({ journalPath, config, operation: 'candidateDispatch' });
        expect(candidateCheck.allowed).toBe(true);
        emitN('candidate_generated', 1);

        const primaryCheck = checker.checkDispatchCap({ journalPath, config, operation: 'scoreExecution' });
        expect(primaryCheck.allowed).toBe(true);
        emitN('score_execution_recorded', 1);

        const benchmarkCheck = checker.checkDispatchCap({ journalPath, config, operation: 'benchmarkRun' });
        expect(benchmarkCheck.allowed).toBe(true);
        emitN('benchmark_completed', 1);

        const replayCheck = checker.checkDispatchCap({ journalPath, config, operation: 'scoreExecution', requested: 2 });
        expect(replayCheck.allowed).toBe(true);
        emitN('score_execution_recorded', 2);
      }

      expect(checker.countOperationEvents(journalPath, 'candidateDispatch')).toBe(5);
      expect(checker.countOperationEvents(journalPath, 'scoreExecution')).toBe(15);
      expect(checker.countOperationEvents(journalPath, 'benchmarkRun')).toBe(5);

      // A 6th iteration's very first check (candidate dispatch) must now reject.
      const sixthIteration = checker.checkDispatchCap({ journalPath, config, operation: 'candidateDispatch' });
      expect(sixthIteration.allowed).toBe(false);
      expect(sixthIteration.message).toContain('DISPATCH CAP EXCEEDED');
    });
  });

  describe('CLI entrypoint', () => {
    it('exits 0 and prints an allowed JSON result when under the cap', () => {
      writeConfig({ maxCandidateDispatches: 5 });
      const result = runCli([`--journal=${journalPath}`, `--config=${configPath}`, '--operation=candidateDispatch']);
      expect(result.status).toBe(0);
      const parsed = JSON.parse(result.stdout.trim()) as CheckResult;
      expect(parsed.allowed).toBe(true);
      expect(parsed.cap).toBe(5);
    });

    it('exits 1 with a clear stderr error naming the cap field when the cumulative cap would be exceeded', () => {
      emitN('benchmark_completed', 5);
      writeConfig({ maxBenchmarkRuns: 5 });
      const result = runCli([`--journal=${journalPath}`, `--config=${configPath}`, '--operation=benchmarkRun']);
      expect(result.status).toBe(1);
      expect(result.stdout).toBe('');
      expect(result.stderr).toContain('DISPATCH CAP EXCEEDED');
      expect(result.stderr).toContain('dispatchCaps.maxBenchmarkRuns');
    });

    it('enforces the schema default (15) end-to-end through the real CLI path when config has no dispatchCaps at all', () => {
      emitN('score_execution_recorded', 15);
      writeConfig(undefined);
      const result = runCli([`--journal=${journalPath}`, `--config=${configPath}`, '--operation=scoreExecution']);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('cap=15');
    });

    it('honors --requested for the batched replay check via the CLI', () => {
      emitN('score_execution_recorded', 14);
      writeConfig({ maxScoreExecutions: 15 });
      const result = runCli([
        `--journal=${journalPath}`,
        `--config=${configPath}`,
        '--operation=scoreExecution',
        '--requested=2',
      ]);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('requested=2');
    });

    it('exits 2 with a usage message when required flags are missing', () => {
      const result = runCli([`--journal=${journalPath}`]);
      expect(result.status).toBe(2);
      expect(result.stderr).toContain('Usage:');
    });

    it('exits 2 on an unknown --operation value', () => {
      writeConfig({});
      const result = runCli([`--journal=${journalPath}`, `--config=${configPath}`, '--operation=notAThing']);
      expect(result.status).toBe(2);
      expect(result.stderr).toContain('Unknown --operation');
    });
  });
});
