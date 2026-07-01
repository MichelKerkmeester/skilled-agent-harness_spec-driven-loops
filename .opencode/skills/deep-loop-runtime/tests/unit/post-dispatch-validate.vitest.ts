import { describe, expect, it, vi } from 'vitest';

import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  persistJudgeCardUnlessQuarantined,
  PostDispatchValidationError,
  runJudgeWithHardening,
  runOptionalVerificationPass,
  type JudgePersistenceSurface,
  validateIterationOutputs,
  validateOrThrow,
} from '../../lib/deep-loop/post-dispatch-validate.js';
import { createHermeticEnv } from '../helpers/spawn-cjs';

type TempPaths = {
  tempDir: string;
  iterationFile: string;
  stateLogPath: string;
};

/**
 * Creates temporary paths for post-dispatch-validate test fixtures.
 */
function withTempPaths(run: (paths: TempPaths) => void): void {
  const tempDir = mkdtempSync(join(tmpdir(), 'post-dispatch-validate-'));
  const iterationFile = join(tempDir, 'iteration-001.md');
  const stateLogPath = join(tempDir, 'state.jsonl');

  try {
    run({ tempDir, iterationFile, stateLogPath });
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

describe('post-dispatch-validate', () => {
  it('returns ok when the iteration file exists and the appended JSONL line has all required fields', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"event"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;

      writeFileSync(
        stateLogPath,
        `${'{"type":"event"}\n'}${'{"type":"iteration","iteration":1,"newInfoRatio":0.4,"status":"continue","focus":"coverage"}\n'}`,
        'utf8',
      );

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
        }),
      ).toEqual({ ok: true });
    });
  });

  it('rejects schema-valid records when the state-log route proof has the wrong mode', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"event"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;
      const record = {
        type: 'iteration',
        iteration: 1,
        newInfoRatio: 0.4,
        status: 'continue',
        focus: 'coverage',
        mode: 'review',
        target_agent: 'deep-research',
        agent_definition_loaded: true,
        resolved_route: 'Resolved route: mode=research target_agent=deep-research',
      };

      writeFileSync(stateLogPath, `${readFileSync(stateLogPath, 'utf8')}${JSON.stringify(record)}\n`, 'utf8');

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
          routeProof: {
            mode: 'research',
            targetAgent: 'deep-research',
            resolvedRoute: 'Resolved route: mode=research target_agent=deep-research',
          },
        }),
      ).toEqual({
        ok: false,
        reason: 'route_proof_mismatch',
        details: "state_log.mode='review' expected 'research'",
      });
    });
  });

  it('rejects schema-valid records when the delta route proof has the wrong target agent', () => {
    withTempPaths(({ tempDir, iterationFile, stateLogPath }) => {
      const deltaFilePath = join(tempDir, 'iter-001.jsonl');
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"event"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;
      const stateRecord = {
        type: 'iteration',
        iteration: 1,
        newInfoRatio: 0.4,
        status: 'continue',
        focus: 'coverage',
        mode: 'research',
        target_agent: 'deep-research',
        agent_definition_loaded: true,
        resolved_route: 'Resolved route: mode=research target_agent=deep-research',
      };
      const deltaRecord = {
        ...stateRecord,
        target_agent: 'deep-review',
      };

      writeFileSync(stateLogPath, `${readFileSync(stateLogPath, 'utf8')}${JSON.stringify(stateRecord)}\n`, 'utf8');
      writeFileSync(deltaFilePath, `${JSON.stringify(deltaRecord)}\n`, 'utf8');

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
          deltaFilePath,
          routeProof: {
            mode: 'research',
            targetAgent: 'deep-research',
            resolvedRoute: 'Resolved route: mode=research target_agent=deep-research',
          },
        }),
      ).toEqual({
        ok: false,
        reason: 'route_proof_mismatch',
        details: "delta.target_agent='deep-review' expected 'deep-research'",
      });
    });
  });

  it('stamps byte log region metadata onto a validated iteration record', () => {
    const hermetic = createHermeticEnv('post-dispatch-log-region');
    try {
      const iterationFile = join(hermetic.tmpDir, 'iteration-001.md');
      const stateLogPath = join(hermetic.tmpDir, 'state.jsonl');
      writeFileSync(iterationFile, '# Iteration 1\n\nTranscript body\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"event","event":"started"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;
      const record = {
        type: 'iteration',
        iteration: 1,
        newInfoRatio: 0.4,
        status: 'continue',
        focus: 'coverage',
      };

      writeFileSync(stateLogPath, `${readFileSync(stateLogPath, 'utf8')}${JSON.stringify(record)}\n`, 'utf8');

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
        }),
      ).toEqual({ ok: true });

      const lines = readFileSync(stateLogPath, 'utf8').trim().split(/\r?\n/);
      const stamped = JSON.parse(lines[lines.length - 1] ?? '{}') as Record<string, unknown>;
      expect(stamped.logOffset).toBe(previousStateLogSize);
      expect(stamped.logSize).toBeGreaterThan(0);
      expect(stamped.logPath).toBe(stateLogPath);

      const slice = readFileSync(String(stamped.logPath))
        .subarray(Number(stamped.logOffset), Number(stamped.logOffset) + Number(stamped.logSize))
        .toString('utf8');
      expect(slice).toContain('"type":"iteration"');
      expect(slice).toContain('"logOffset"');
      expect(slice).toContain('"logSize"');
      expect(slice).toContain('"logPath"');
    } finally {
      hermetic.cleanup();
    }
  });

  it('validates the current append when an older JSONL line is malformed', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 2\n\nTranscript body\n', 'utf8');
      writeFileSync(
        stateLogPath,
        [
          '{"type":"config","mode":"review"}',
          '{"type":"event"',
          '{"type":"event","event":"previous_valid"}',
          '',
        ].join('\n'),
        'utf8',
      );
      const previousStateLogSize = statSync(stateLogPath).size;
      const record = {
        type: 'iteration',
        iteration: 2,
        newInfoRatio: 0.4,
        status: 'continue',
        focus: 'coverage',
      };

      writeFileSync(stateLogPath, `${readFileSync(stateLogPath, 'utf8')}${JSON.stringify(record)}\n`, 'utf8');

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
        }),
      ).toEqual({ ok: true });

      const lines = readFileSync(stateLogPath, 'utf8').trim().split(/\r?\n/);
      const stamped = JSON.parse(lines[lines.length - 1] ?? '{}') as Record<string, unknown>;
      expect(stamped.logOffset).toBe(previousStateLogSize);
      expect(stamped.logSize).toBeGreaterThan(0);
    });
  });

  it('returns iteration_file_missing when the iteration file does not exist', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(stateLogPath, '{"type":"iteration","iteration":1,"newInfoRatio":0.4,"status":"continue","focus":"coverage"}\n', 'utf8');

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize: 0,
          requiredJsonlFields: ['type'],
        }),
      ).toEqual({
        ok: false,
        reason: 'iteration_file_missing',
        details: iterationFile,
      });
    });
  });

  it('returns iteration_file_empty when the iteration file has zero bytes', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '', 'utf8');
      writeFileSync(stateLogPath, '{"type":"iteration","iteration":1,"newInfoRatio":0.4,"status":"continue","focus":"coverage"}\n', 'utf8');

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize: 0,
          requiredJsonlFields: ['type'],
        }),
      ).toEqual({
        ok: false,
        reason: 'iteration_file_empty',
        details: iterationFile,
      });
    });
  });

  it('returns jsonl_not_appended when the state log size does not grow', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"iteration","iteration":1}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type'],
        }),
      ).toEqual({
        ok: false,
        reason: 'jsonl_not_appended',
        details: `no new records since ${previousStateLogSize} bytes`,
      });
    });
  });

  it('returns jsonl_missing_fields when the last JSONL line omits a required field', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"event"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;

      writeFileSync(stateLogPath, '{"type":"event"}\n{"type":"iteration","iteration":1,"status":"continue","focus":"coverage"}\n', 'utf8');

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
        }),
      ).toEqual({
        ok: false,
        reason: 'jsonl_missing_fields',
        details: 'missing: newInfoRatio',
      });
    });
  });

  it('accepts the canonical review prompt record without findingDetails for a clean iteration', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"config","mode":"review"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;
      const record = {
        type: 'iteration',
        iteration: 1,
        mode: 'review',
        run: 'run-001',
        status: 'complete',
        focus: 'correctness',
        dimensions: ['correctness'],
        filesReviewed: ['path/to/file.ts:42'],
        findingsCount: 0,
        findingsSummary: { P0: 0, P1: 0, P2: 0 },
        findingsNew: [],
        traceabilityChecks: {},
        newFindingsRatio: 0,
        sessionId: 'session-001',
        generation: 1,
        lineageMode: 'new',
        timestamp: '2026-04-30T00:00:00Z',
        durationMs: 120000,
        graphEvents: [],
      };

      writeFileSync(stateLogPath, `${readFileSync(stateLogPath, 'utf8')}${JSON.stringify(record)}\n`, 'utf8');

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: [
            'type',
            'iteration',
            'mode',
            'run',
            'status',
            'focus',
            'dimensions',
            'filesReviewed',
            'findingsCount',
            'findingsSummary',
            'findingsNew',
            'findingDetails',
            'newFindingsRatio',
            'sessionId',
            'generation',
            'lineageMode',
            'timestamp',
            'durationMs',
          ],
        }),
      ).toEqual({ ok: true });
    });
  });

  it('still requires findingDetails when a review record reports findings', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"config","mode":"review"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;
      const record = {
        type: 'iteration',
        iteration: 1,
        mode: 'review',
        run: 'run-001',
        status: 'complete',
        focus: 'correctness',
        dimensions: ['correctness'],
        filesReviewed: ['path/to/file.ts:42'],
        findingsCount: 1,
        findingsSummary: { P0: 0, P1: 1, P2: 0 },
        findingsNew: { P0: 0, P1: 1, P2: 0 },
        newFindingsRatio: 0.5,
        sessionId: 'session-001',
        generation: 1,
        lineageMode: 'new',
        timestamp: '2026-04-30T00:00:00Z',
        durationMs: 120000,
      };

      writeFileSync(stateLogPath, `${readFileSync(stateLogPath, 'utf8')}${JSON.stringify(record)}\n`, 'utf8');

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: [
            'type',
            'iteration',
            'mode',
            'run',
            'status',
            'focus',
            'dimensions',
            'filesReviewed',
            'findingsCount',
            'findingsSummary',
            'findingsNew',
            'findingDetails',
            'newFindingsRatio',
            'sessionId',
            'generation',
            'lineageMode',
            'timestamp',
            'durationMs',
          ],
        }),
      ).toEqual({
        ok: false,
        reason: 'jsonl_missing_fields',
        details: 'missing: findingDetails',
      });
    });
  });

  it('returns executor_missing for non-native executors when the iteration record lacks executor provenance', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"event"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;

      writeFileSync(
        stateLogPath,
        `${'{"type":"event"}\n'}${'{"type":"iteration","iteration":1,"newInfoRatio":0.4,"status":"continue","focus":"coverage"}\n'}`,
        'utf8',
      );

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
          executorKind: 'cli-claude-code',
        }),
      ).toEqual({
        ok: false,
        reason: 'executor_missing',
        details: "missing executor provenance for non-native executor kind 'cli-claude-code'",
      });
    });
  });

  it('allows native executor validation to pass without executor provenance for back-compat', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"event"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;

      writeFileSync(
        stateLogPath,
        `${'{"type":"event"}\n'}${'{"type":"iteration","iteration":1,"newInfoRatio":0.4,"status":"continue","focus":"coverage"}\n'}`,
        'utf8',
      );

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
          executorKind: 'native',
        }),
      ).toEqual({ ok: true });
    });
  });

  it('returns dispatch_failure_logged when the latest JSONL record is a dispatch_failure event', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(stateLogPath, '{"type":"event"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;

      writeFileSync(
        stateLogPath,
        `${'{"type":"event"}\n'}${'{"type":"event","event":"dispatch_failure","iteration":1,"reason":"crash","detail":"worker exited","timestamp":"2026-04-18T12:00:00Z"}\n'}`,
        'utf8',
      );

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
          executorKind: 'cli-claude-code',
        }),
      ).toEqual({
        ok: false,
        reason: 'dispatch_failure_logged',
        details: 'dispatch_failure:crash:worker exited',
      });
    });
  });

  it('repairs a malformed trailing JSONL line before validation', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"event"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;

      writeFileSync(stateLogPath, '{"type":"event"}\n{"type":"iteration"\n', 'utf8');

      const result = validateIterationOutputs({
        iterationFile,
        stateLogPath,
        previousStateLogSize,
        requiredJsonlFields: ['type'],
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toBe('jsonl_not_appended');
      }
      expect(readFileSync(stateLogPath, 'utf8')).toBe('{"type":"event"}\n');
    });
  });

  it('validateOrThrow throws PostDispatchValidationError on a bad result', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '', 'utf8');
      writeFileSync(stateLogPath, '{"type":"iteration"}\n', 'utf8');

      expect(() =>
        validateOrThrow({
          iterationFile,
          stateLogPath,
          previousStateLogSize: 0,
          requiredJsonlFields: ['type'],
        }),
      ).toThrow(PostDispatchValidationError);
    });
  });

  it('validateOrThrow returns void when validation succeeds', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"event"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;

      writeFileSync(
        stateLogPath,
        `${'{"type":"event"}\n'}${'{"type":"iteration","iteration":1,"newInfoRatio":0.4,"status":"continue","focus":"coverage"}\n'}`,
        'utf8',
      );

      expect(
        validateOrThrow({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
        }),
      ).toBeUndefined();
    });
  });

  it('marks verification-enabled bad code output as degraded in JSONL', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(
        iterationFile,
        [
          '# Iteration 1',
          '',
          '```typescript',
          'export function broken() {',
          '  return 1;',
          '```',
          '',
        ].join('\n'),
        'utf8',
      );
      writeFileSync(stateLogPath, '{"type":"event"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;

      writeFileSync(
        stateLogPath,
        `${'{"type":"event"}\n'}${'{"type":"iteration","iteration":1,"newInfoRatio":0.4,"status":"continue","focus":"coverage"}\n'}`,
        'utf8',
      );

      const result = validateIterationOutputs({
        iterationFile,
        stateLogPath,
        previousStateLogSize,
        requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
        recipeConfig: {
          verification_enabled: true,
          verification_languages: ['typescript'],
          verification_threshold: 0.5,
        },
      });

      expect(result).toEqual({
        ok: false,
        reason: 'verification_degraded',
        details: 'verification confidence 0.00 below threshold 0.50',
      });
      expect(readFileSync(stateLogPath, 'utf8')).toContain('"event":"verification_degraded"');
      expect(readFileSync(stateLogPath, 'utf8')).toContain('"status":"degraded"');
    });
  });

  it('passes verification-enabled good code output', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(
        iterationFile,
        [
          '# Iteration 1',
          '',
          '```typescript',
          'export function add(left: number, right: number): number {',
          '  return left + right;',
          '}',
          '```',
          '',
        ].join('\n'),
        'utf8',
      );
      writeFileSync(stateLogPath, '{"type":"event"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;

      writeFileSync(
        stateLogPath,
        `${'{"type":"event"}\n'}${'{"type":"iteration","iteration":1,"newInfoRatio":0.4,"status":"continue","focus":"coverage"}\n'}`,
        'utf8',
      );

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
          recipeConfig: {
            verification_enabled: true,
            verification_languages: ['typescript'],
            verification_threshold: 0.5,
          },
        }),
      ).toEqual({ ok: true });
      expect(readFileSync(stateLogPath, 'utf8')).not.toContain('"event":"verification_degraded"');
    });
  });

  it('keeps verification disabled as a no-op for backward compatibility', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(
        iterationFile,
        [
          '# Iteration 1',
          '',
          '```typescript',
          'export function broken() {',
          '  return 1;',
          '```',
          '',
        ].join('\n'),
        'utf8',
      );
      writeFileSync(stateLogPath, '{"type":"event"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;

      writeFileSync(
        stateLogPath,
        `${'{"type":"event"}\n'}${'{"type":"iteration","iteration":1,"newInfoRatio":0.4,"status":"continue","focus":"coverage"}\n'}`,
        'utf8',
      );

      expect(
        validateIterationOutputs({
          iterationFile,
          stateLogPath,
          previousStateLogSize,
          requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
          recipeConfig: {
            verification_enabled: false,
            verification_languages: ['typescript'],
          },
        }),
      ).toEqual({ ok: true });
      expect(runOptionalVerificationPass(iterationFile, { verification_enabled: false })).toEqual({
        ok: true,
        skipped: true,
        reason: 'verification_disabled',
      });
    });
  });

  it('passes with no warning when a valid evidence contract is present', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      const record = {
        type: 'iteration',
        iteration: 1,
        newInfoRatio: 0.4,
        status: 'continue',
        focus: 'coverage',
        evidence: {
          claim_class: 'confirmed',
          would_confirm: 'rerun the gate and read the exit code',
          gate_delta: '351 -> 357 passing',
          scope_state: 'in_scope',
          child_result_verified: true,
        },
      };
      writeFileSync(stateLogPath, `${'{"type":"event"}\n'}${JSON.stringify(record)}\n`, 'utf8');

      const result = validateIterationOutputs({
        iterationFile,
        stateLogPath,
        previousStateLogSize: 0,
        requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
      });

      expect(result.ok).toBe(true);
      const evidenceWarnings = (result.warnings ?? []).filter((w) => w.code.startsWith('evidence_contract'));
      expect(evidenceWarnings).toHaveLength(0);
    });
  });

  it('warns but stays ok:true when the evidence contract is malformed', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      const record = {
        type: 'iteration',
        iteration: 1,
        newInfoRatio: 0.4,
        status: 'continue',
        focus: 'coverage',
        evidence: { claim_class: 'speculative', child_result_verified: 'yes' },
      };
      writeFileSync(stateLogPath, `${'{"type":"event"}\n'}${JSON.stringify(record)}\n`, 'utf8');

      const result = validateIterationOutputs({
        iterationFile,
        stateLogPath,
        previousStateLogSize: 0,
        requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
      });

      expect(result.ok).toBe(true);
      const evidenceWarnings = (result.warnings ?? []).filter((w) => w.code === 'evidence_contract_malformed');
      expect(evidenceWarnings.length).toBeGreaterThan(0);
      expect(evidenceWarnings.some((w) => w.fieldPath === 'evidence.claim_class')).toBe(true);
    });
  });

  it('passes with no evidence warning when the metadata is absent (backward compatible)', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      const record = {
        type: 'iteration',
        iteration: 1,
        newInfoRatio: 0.4,
        status: 'continue',
        focus: 'coverage',
      };
      writeFileSync(stateLogPath, `${'{"type":"event"}\n'}${JSON.stringify(record)}\n`, 'utf8');

      const result = validateIterationOutputs({
        iterationFile,
        stateLogPath,
        previousStateLogSize: 0,
        requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
      });

      expect(result.ok).toBe(true);
      const evidenceWarnings = (result.warnings ?? []).filter((w) => w.code.startsWith('evidence_contract'));
      expect(evidenceWarnings).toHaveLength(0);
    });
  });

  it('recovers a transient judge model failure inside the retry window', async () => {
    let calls = 0;

    const result = await runJudgeWithHardening({
      maxAttempts: 2,
      backoffMs: 0,
      fastTimeoutMs: 100,
      slowTimeoutMs: 200,
      invoke: async () => {
        calls += 1;
        if (calls === 1) {
          throw new Error('temporary model outage');
        }
        return '{"overall_score":0.82,"verdict":"pass"}';
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.card).toMatchObject({ overall_score: 0.82, verdict: 'pass' });
    }
    expect(result.attempts).toBe(2);
    expect(result.failures).toEqual([
      expect.objectContaining({ attempt: 1, kind: 'model_error', fastTimedOut: false }),
    ]);
    expect(calls).toBe(2);
  });

  it('clears the fast judge timeout timer after immediate rejection', async () => {
    vi.useFakeTimers();
    try {
      const result = await runJudgeWithHardening({
        fastTimeoutMs: 100,
        slowTimeoutMs: 200,
        invoke: async () => {
          throw new Error('immediate rejection');
        },
      });

      expect(result.ok).toBe(false);
      expect(vi.getTimerCount()).toBe(0);
      await vi.advanceTimersByTimeAsync(100);
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('strips markdown fences and parses judge JSON without issuing a fallback card', async () => {
    const result = await runJudgeWithHardening({
      invoke: async () => '```json\n{"overall_score":0.73,"verdict":"continue"}\n```',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.card).toMatchObject({ overall_score: 0.73, verdict: 'continue' });
      expect(result.card.quarantined).toBeUndefined();
    }
    expect(result.formatStripRetries).toBe(1);
    expect(result.failures).toEqual([]);
  });

  it('keeps the slow-path escape hatch after the fast judge timeout fires', async () => {
    vi.useFakeTimers();
    try {
      const resultPromise = runJudgeWithHardening({
        fastTimeoutMs: 5,
        slowTimeoutMs: 50,
        invoke: () =>
          new Promise((resolveJudge) => {
            setTimeout(() => resolveJudge('{"overall_score":0.91,"verdict":"pass"}'), 20);
          }),
      });

      await vi.advanceTimersByTimeAsync(5);
      await vi.advanceTimersByTimeAsync(15);
      const result = await resultPromise;

      expect(result.ok).toBe(true);
      expect(result.fastTimeouts).toBe(1);
      expect(result.slowTimeouts).toBe(0);
      if (result.ok) {
        expect(result.card).toMatchObject({ overall_score: 0.91, verdict: 'pass' });
      }
    } finally {
      vi.useRealTimers();
    }
  });

  it('issues a quarantined neutral fallback card after exhausted parse retries', async () => {
    const result = await runJudgeWithHardening({
      maxAttempts: 2,
      backoffMs: 0,
      invoke: async () => '```json\nnot-json\n```',
      fallbackReason: 'judge unavailable',
      now: () => '2026-06-28T00:00:00.000Z',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.card).toMatchObject({
        type: 'judge_fallback_card',
        fallback: true,
        quarantined: true,
        score: 0.5,
        confidence: 0,
        reason: 'judge unavailable',
        metadata: {
          attempts: 2,
          maxAttempts: 2,
          failureKind: 'parse_error',
          formatStripRetries: 2,
          fastTimeouts: 0,
          slowTimeouts: 0,
          generatedAt: '2026-06-28T00:00:00.000Z',
        },
      });
      expect(result.card.metadata.failures).toHaveLength(2);
    }
  });

  it('does not write quarantined fallback cards to persistence, convergence, or coverage surfaces', async () => {
    const fallback = await runJudgeWithHardening({
      maxAttempts: 1,
      invoke: async () => 'not-json',
    });
    expect(fallback.ok).toBe(false);
    if (fallback.ok) {
      throw new Error('expected fallback card');
    }

    const writes: JudgePersistenceSurface[] = [];
    const result = await persistJudgeCardUnlessQuarantined(fallback.card, {
      persistence: (_card, surface) => {
        writes.push(surface);
      },
      convergence: (_card, surface) => {
        writes.push(surface);
      },
      coverage: (_card, surface) => {
        writes.push(surface);
      },
    });

    expect(writes).toEqual([]);
    expect(result).toEqual({
      persisted: false,
      writtenSurfaces: [],
      skippedSurfaces: ['persistence', 'convergence', 'coverage'],
      reason: 'quarantined',
    });
  });

  it('skips post-dispatch state writes for quarantined judge records when enabled', () => {
    withTempPaths(({ iterationFile, stateLogPath }) => {
      writeFileSync(iterationFile, '# Iteration 1\n', 'utf8');
      writeFileSync(stateLogPath, '{"type":"event"}\n', 'utf8');
      const previousStateLogSize = statSync(stateLogPath).size;
      const record = {
        type: 'iteration',
        iteration: 1,
        newInfoRatio: 0.4,
        status: 'continue',
        focus: 'coverage',
        fallback: true,
        quarantined: true,
      };
      writeFileSync(stateLogPath, `${readFileSync(stateLogPath, 'utf8')}${JSON.stringify(record)}\n`, 'utf8');
      const beforeValidation = readFileSync(stateLogPath, 'utf8');

      const result = validateIterationOutputs({
        iterationFile,
        stateLogPath,
        previousStateLogSize,
        requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
        recipeConfig: {
          judge_quarantine_enabled: true,
          verification_enabled: true,
          verification_threshold: 1,
        },
      });

      expect(result).toEqual({
        ok: true,
        warnings: [
          {
            code: 'judge_card_quarantined',
            detail: 'quarantined judge card skipped before post-dispatch writes',
            fieldPath: 'quarantined',
          },
        ],
      });
      expect(readFileSync(stateLogPath, 'utf8')).toBe(beforeValidation);
    });
  });
});
