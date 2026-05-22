import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

type HandlerResponse = { content: Array<{ type: string; text: string }> };

type CoverageModules = {
  closeDb: () => void;
  handleCoverageGraphConvergence: (args: Record<string, unknown>) => Promise<HandlerResponse>;
};

const originalDbDir = process.env.SPEC_KIT_DB_DIR;
const tempDirs: string[] = [];
let activeCloseDb: (() => void) | null = null;

function parseResponse(response: HandlerResponse): Record<string, unknown> {
  return JSON.parse(response.content[0]?.text ?? '{}') as Record<string, unknown>;
}

async function loadCoverageModules(): Promise<CoverageModules> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'review-depth-convergence-'));
  tempDirs.push(tempDir);
  process.env.SPEC_KIT_DB_DIR = tempDir;
  vi.resetModules();

  const dbModule = await import('../../lib/coverage-graph/coverage-graph-db.js');
  const convergenceModule = await import('../../handlers/coverage-graph/convergence.js');

  activeCloseDb = dbModule.closeDb;

  return {
    closeDb: dbModule.closeDb,
    handleCoverageGraphConvergence: convergenceModule.handleCoverageGraphConvergence,
  };
}

afterEach(() => {
  activeCloseDb?.();
  activeCloseDb = null;
  vi.resetModules();
  if (originalDbDir === undefined) {
    delete process.env.SPEC_KIT_DB_DIR;
  } else {
    process.env.SPEC_KIT_DB_DIR = originalDbDir;
  }

  while (tempDirs.length > 0) {
    const tempDir = tempDirs.pop();
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
});

describe('review-depth convergence v2 fixtures', () => {
  it('blocks graphless standard-scope STOP when fallback ledger rows are missing', async () => {
    // EXPECT: passes after phase F (006-candidate-saturation-and-graphless-gates).
    // Today convergence returns CONTINUE for zero-node review graphs.
    const syntheticReviewDepthRecord = {
      reviewDepthSchemaVersion: 2,
      reviewDepthApplicability: {
        scopeClass: 'standard',
        enforcement: 'strict',
        reason: 'graphless standard-scope fixture',
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
      searchLedger: [],
    };
    expect(syntheticReviewDepthRecord.searchCoverage.graphCoverageMode).toBe('graphless_fallback');

    const { handleCoverageGraphConvergence } = await loadCoverageModules();
    const response = parseResponse(await handleCoverageGraphConvergence({
      specFolder: 'specs/review-depth-convergence-fixture',
      loopType: 'review',
      sessionId: 'graphless-fallback-empty-ledger',
      iteration: 1,
    }));
    const data = response.data as Record<string, unknown>;
    const blockers = (data.blockers as Array<Record<string, unknown>>) ?? [];

    expect(response.status).toBe('ok');
    expect(data.decision).toBe('BLOCKED_STOP');
    expect(blockers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: expect.stringMatching(/candidateCoverageGate|graphlessFallbackGate/),
        }),
      ]),
    );
  });
});
