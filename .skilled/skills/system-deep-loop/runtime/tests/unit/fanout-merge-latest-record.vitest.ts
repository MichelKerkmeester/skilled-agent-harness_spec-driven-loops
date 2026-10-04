// MODULE: Fanout Merge Latest Iteration Tests

import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  reconstructResearchRegistryFromState,
  reconstructReviewRegistryFromState,
} = require('../../scripts/fanout-merge.cjs');

describe('fanout-merge latest iteration records', () => {
  it('reconstructs research findings from only the latest record per iteration', () => {
    const registry = reconstructResearchRegistryFromState([
      {
        type: 'iteration',
        iteration: 1,
        run: 1,
        findingsCount: 1,
        keyFindings: [{ id: 'F-OLD', title: 'Superseded research finding' }],
      },
      {
        type: 'iteration',
        iteration: 1,
        run: 1,
        findingsCount: 1,
        keyFindings: [{ id: 'F-NEW', title: 'Corrected research finding' }],
      },
      {
        type: 'iteration',
        iteration: 2,
        run: 2,
        findingsCount: 1,
        keyFindings: [{ id: 'F-NEXT', title: 'Next iteration finding' }],
      },
    ], 'research-lineage');

    expect(registry?.keyFindings.map((finding: { id: string }) => finding.id)).toEqual(['F-NEW', 'F-NEXT']);
  });

  it('reconstructs review findings from the latest iteration while preserving later iterations with the same run id', () => {
    const registry = reconstructReviewRegistryFromState([
      {
        type: 'iteration',
        iteration: 1,
        run: 'run-001',
        findingDetails: [{ id: 'R1-P1-OLD', severity: 'P1', title: 'Superseded review finding' }],
      },
      {
        type: 'iteration',
        iteration: 1,
        run: 'run-001',
        findingDetails: [{ id: 'R1-P1-NEW', severity: 'P1', title: 'Corrected review finding' }],
      },
      {
        type: 'iteration',
        iteration: 2,
        run: 'run-001',
        findingDetails: [{ id: 'R2-P2-NEW', severity: 'P2', title: 'Next iteration finding' }],
      },
    ], 'review-lineage');

    expect(registry?.openFindings.map((finding: { findingId: string }) => finding.findingId)).toEqual([
      'R1-P1-NEW',
      'R2-P2-NEW',
    ]);
  });
});
