// ───────────────────────────────────────────────────────────────────
// MODULE: Review Dashboard Verdict Tests
// ───────────────────────────────────────────────────────────────────
//
// Proves the reducer's provisional verdict is the shared stop rule, not a second
// copy of it: an open search-debt obligation alone holds the verdict at
// CONDITIONAL, and a remaining P0 fails the run even while that same debt is
// still owed. A dashboard that derived its own verdict could report a pass over
// the stop the report beside it called a failure.

import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const requireCjs = createRequire(import.meta.url);
const { reduceReviewState } = requireCjs('../../scripts/reduce-state.cjs') as {
  reduceReviewState: (
    specFolder: string,
    options?: Record<string, unknown>,
  ) => {
    dashboard: string;
    registry: {
      findingsBySeverity: { P0: number; P1: number; P2: number };
      searchDebt: unknown[];
    };
  };
};

const FIXED_TS = '2026-08-23T00:00:00.000Z';

const scratchDirs: string[] = [];
afterEach(() => {
  while (scratchDirs.length > 0) {
    const dir = scratchDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

// One bug class the search path deferred, which is one open obligation the run
// still owes whatever else its findings say.
const DEFERRED_SEARCH_LEDGER = [{
  id: 'iteration-1-ssrf',
  dimension: 'security',
  targetRefs: ['src/fetch.ts'],
  bugClass: 'ssrf',
  disposition: 'deferred',
  rationale: 'outbound fetch surface not yet mapped',
  deferredReason: 'outbound fetch surface not yet mapped',
  evidenceRefs: ['src/fetch.ts:10'],
}];

function reduceIteration(severityCounts: { P0: number; P1: number; P2: number }): {
  dashboard: string;
  registry: { findingsBySeverity: { P0: number; P1: number; P2: number }; searchDebt: unknown[] };
} {
  const specFolder = mkdtempSync(join(tmpdir(), 'review-dashboard-verdict-'));
  scratchDirs.push(specFolder);
  const reviewDir = join(specFolder, 'review');
  mkdirSync(reviewDir, { recursive: true });
  writeFileSync(
    join(reviewDir, 'deep-review-config.json'),
    JSON.stringify({ maxIterations: 5, reviewTarget: 'dashboard-verdict-proof' }),
  );
  const record = {
    type: 'iteration',
    iteration: 1,
    run: 1,
    mode: 'review',
    status: 'complete',
    reviewDepthSchemaVersion: 2,
    findingsSummary: severityCounts,
    newFindingsRatio: 0,
    searchLedger: DEFERRED_SEARCH_LEDGER,
    timestamp: FIXED_TS,
  };
  writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${JSON.stringify(record)}\n`);
  return reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });
}

describe('reduceReviewState — provisional verdict', () => {
  it('holds a debt-bearing run with no P0 or P1 at CONDITIONAL', () => {
    const result = reduceIteration({ P0: 0, P1: 0, P2: 0 });

    expect(result.registry.searchDebt).toHaveLength(1);
    expect(result.registry.findingsBySeverity).toMatchObject({ P0: 0, P1: 0 });
    expect(result.dashboard).toContain('Provisional Verdict: CONDITIONAL');
    expect(result.dashboard).toContain('hasSearchDebt: true');
    expect(result.dashboard).toContain('hasAdvisories: false');
  });

  it('fails a run that still carries a P0 while its debt stays open', () => {
    const result = reduceIteration({ P0: 1, P1: 0, P2: 0 });

    expect(result.registry.searchDebt).toHaveLength(1);
    expect(result.registry.findingsBySeverity).toMatchObject({ P0: 1 });
    expect(result.dashboard).toContain('Provisional Verdict: FAIL');
    expect(result.dashboard).toContain('hasSearchDebt: true');
    expect(result.dashboard).toContain('hasAdvisories: false');
  });
});
