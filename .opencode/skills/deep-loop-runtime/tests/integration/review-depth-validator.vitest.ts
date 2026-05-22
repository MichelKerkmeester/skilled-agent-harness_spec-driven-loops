import { mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  PostDispatchValidationError,
  validateIterationOutputs,
  validateOrThrow,
} from '../../lib/deep-loop/post-dispatch-validate.js';

type TempPaths = {
  tempDir: string;
  iterationFile: string;
  stateLogPath: string;
  deltaFilePath: string;
};

function withTempPaths(run: (paths: TempPaths) => void): void {
  const tempDir = mkdtempSync(join(tmpdir(), 'review-depth-validator-'));
  const iterationFile = join(tempDir, 'iteration-003.md');
  const stateLogPath = join(tempDir, 'deep-review-state.jsonl');
  const deltaFilePath = join(tempDir, 'iter-002.jsonl');

  try {
    run({ tempDir, iterationFile, stateLogPath, deltaFilePath });
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function reviewDepthRecord(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    type: 'iteration',
    iteration: 3,
    mode: 'review',
    run: 3,
    status: 'continue',
    focus: 'correctness candidate search',
    dimensions: ['correctness'],
    filesReviewed: ['src/review-target.ts'],
    findingsCount: 0,
    findingsSummary: { P0: 0, P1: 0, P2: 0 },
    findingsNew: { P0: 0, P1: 0, P2: 0 },
    findingDetails: [],
    newFindingsRatio: 0,
    sessionId: 'review-depth-validator-fixture',
    generation: 1,
    lineageMode: 'new',
    timestamp: '2026-05-22T00:00:00Z',
    durationMs: 100,
    reviewDepthSchemaVersion: 2,
    reviewDepthApplicability: {
      scopeClass: 'standard',
      enforcement: 'strict',
      reason: 'non-trivial review target',
      evidenceRefs: ['src/review-target.ts:1'],
    },
    targetSelection: {
      selectedTargets: ['src/review-target.ts'],
      selectionReason: 'synthetic high-risk target',
      discoveryMethods: ['direct_read'],
      omittedHighRiskTargets: [],
      graphStatus: 'unavailable',
      semanticSearchStatus: 'unavailable',
      evidenceRefs: ['src/review-target.ts:1'],
    },
    searchCoverage: {
      requiredBugClasses: ['state_transition'],
      covered: [],
      ruledOut: [],
      deferred: ['state_transition'],
      blocked: [],
      graphCoverageMode: 'graphless_fallback',
    },
    searchLedger: [
      {
        id: 'SL-001',
        dimension: 'correctness',
        targetRefs: ['src/review-target.ts'],
        bugClass: 'state_transition',
        hypothesis: 'state transition can skip validation',
        searchActions: [
          {
            method: 'direct_read',
            queryOrPath: 'src/review-target.ts',
            result: 'no conclusive evidence in synthetic fixture',
            evidenceRefs: ['src/review-target.ts:1'],
          },
        ],
        disposition: 'deferred',
        rationale: 'requires phase D validator enforcement',
        deferredReason: 'seeded for future validator enforcement',
      },
    ],
    ...overrides,
  };
}

function writeIterationFixture(
  paths: TempPaths,
  stateRecord: Record<string, unknown>,
  deltaRecord: Record<string, unknown>,
): number {
  writeFileSync(paths.iterationFile, '# Iteration 3\n\nSynthetic review-depth validator fixture.\n', 'utf8');
  writeFileSync(paths.stateLogPath, '{"type":"event","event":"start"}\n', 'utf8');
  const previousStateLogSize = statSync(paths.stateLogPath).size;
  writeFileSync(paths.stateLogPath, `{"type":"event","event":"start"}\n${JSON.stringify(stateRecord)}\n`, 'utf8');
  writeFileSync(paths.deltaFilePath, `${JSON.stringify(deltaRecord)}\n`, 'utf8');
  return previousStateLogSize;
}

describe('review-depth validator v2 fixtures', () => {
  it.todo('v2 record with reviewDepthSchemaVersion:2 and missing searchLedger for non-trivial scope must fail');

  it.todo('v2 record with uncited ledger row (evidenceRefs:[]) must fail');

  it.todo('v2 record with broken linkedFindingId must fail');

  it.todo('v2 record with shallow findingDetails on active finding must fail');

  it('state-log/delta iteration-id mismatch must fail', () => {
    // EXPECT: passes after phase D (004-validator-v2-enforcement).
    // Today the validator only requires any delta iteration record, so this assertion is intentionally red.
    withTempPaths((paths) => {
      const previousStateLogSize = writeIterationFixture(
        paths,
        reviewDepthRecord({ iteration: 3, run: 3 }),
        { type: 'iteration', iteration: 2, run: 2, status: 'continue' },
      );

      const input = {
        iterationFile: paths.iterationFile,
        stateLogPath: paths.stateLogPath,
        previousStateLogSize,
        requiredJsonlFields: ['type', 'iteration', 'status', 'focus'],
        deltaFilePath: paths.deltaFilePath,
      };

      expect(validateIterationOutputs(input)).toEqual({
        ok: false,
        reason: 'delta_iteration_id_mismatch',
        details: 'state-log iteration 3 does not match delta iteration 2',
      });
      expect(() => validateOrThrow(input)).toThrow(PostDispatchValidationError);
    });
  });
});
