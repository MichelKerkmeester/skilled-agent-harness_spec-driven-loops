import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { reduceReviewState } = require('../../../../system-deep-loop/deep-review/scripts/reduce-state.cjs') as {
  reduceReviewState: (specFolder: string, options?: { write?: boolean }) => { registry: Record<string, unknown> };
};

function writeJsonl(path: string, records: Array<Record<string, unknown>>): void {
  writeFileSync(path, `${records.map((record) => JSON.stringify(record)).join('\n')}\n`, 'utf8');
}

function buildIterationRecord(iteration: number): Record<string, unknown> {
  return {
    type: 'iteration',
    iteration,
    run: iteration,
    mode: 'review',
    status: 'continue',
    focus: `candidate search ${iteration}`,
    dimensions: ['correctness'],
    filesReviewed: ['src/review-target.ts'],
    findingsCount: 0,
    findingsSummary: { P0: 0, P1: 0, P2: 0 },
    findingsNew: { P0: 0, P1: 0, P2: 0 },
    findingDetails: [],
    newFindingsRatio: 0,
    sessionId: 'review-depth-reducer-fixture',
    generation: 1,
    lineageMode: 'new',
    timestamp: `2026-05-22T00:0${iteration}:00Z`,
    durationMs: 100,
    reviewDepthSchemaVersion: 2,
    reviewDepthApplicability: {
      scopeClass: 'standard',
      enforcement: 'strict',
      reason: 'synthetic non-trivial reducer target',
      evidenceRefs: ['src/review-target.ts:1'],
    },
    targetSelection: {
      selectedTargets: ['src/review-target.ts'],
      selectionReason: 'synthetic reducer search debt target',
      discoveryMethods: ['direct_read'],
      omittedHighRiskTargets: [],
      graphStatus: 'unavailable',
      semanticSearchStatus: 'unavailable',
      evidenceRefs: ['src/review-target.ts:1'],
    },
    searchCoverage: {
      requiredBugClasses: ['state_transition', 'negative_path'],
      covered: [],
      ruledOut: [],
      deferred: ['state_transition', 'negative_path'],
      blocked: [],
      graphCoverageMode: 'graphless_fallback',
    },
    searchLedger: [
      {
        id: `SL-${iteration}`,
        dimension: 'correctness',
        targetRefs: ['src/review-target.ts'],
        bugClass: iteration === 1 ? 'state_transition' : 'negative_path',
        hypothesis: 'candidate search debt survives reducer output',
        searchActions: [
          {
            method: 'direct_read',
            queryOrPath: 'src/review-target.ts',
            result: 'deferred in synthetic fixture',
            evidenceRefs: ['src/review-target.ts:1'],
          },
        ],
        disposition: 'deferred',
        rationale: 'seeded search debt fixture',
        deferredReason: 'requires reducer registry exposure in phase E',
      },
    ],
  };
}

describe('review-depth reducer v2 fixtures', () => {
  it('exposes searchDebt registry fields after reducing deferred ledger rows', () => {
    // EXPECT: passes once search-ledger persistence and reporting land.
    // Today this assertion is intentionally red because the reducer drops search-ledger state.
    const specFolder = mkdtempSync(join(tmpdir(), 'review-depth-reducer-'));

    try {
      const reviewDir = join(specFolder, 'review');
      mkdirSync(reviewDir, { recursive: true });
      writeFileSync(join(specFolder, 'spec.md'), '# Synthetic reducer fixture\n', 'utf8');
      writeFileSync(
        join(reviewDir, 'deep-review-config.json'),
        JSON.stringify({
          specFolder,
          reviewTarget: 'Synthetic review-depth reducer fixture',
          reviewTargetType: 'spec',
          sessionId: 'review-depth-reducer-fixture',
          status: 'running',
          maxIterations: 2,
          createdAt: '2026-05-22T00:00:00Z',
        }, null, 2),
        'utf8',
      );
      writeJsonl(join(reviewDir, 'deep-review-state.jsonl'), [
        buildIterationRecord(1),
        buildIterationRecord(2),
      ]);

      const { registry } = reduceReviewState(specFolder, { write: false });

      expect(registry).toHaveProperty('candidateCoverage');
      expect(registry).toHaveProperty('searchDebt');
      expect(registry).toHaveProperty('ruledOutCandidates');
      expect(registry).toHaveProperty('cleanSearchProof');
      expect(registry).toHaveProperty('searchCoverage');
    } finally {
      rmSync(specFolder, { recursive: true, force: true });
    }
  });
});
