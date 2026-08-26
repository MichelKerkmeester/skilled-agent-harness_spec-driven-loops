// Regression coverage for reduceReviewState's write behavior when part of its
// input is a warning-class problem rather than a hard failure. The registry,
// strategy, and dashboard are all derived from the same in-memory records
// before any file is written, so a problem confined to one output (a missing
// strategy anchor, or corrupt JSONL lines already captured as warnings) must
// not withhold the other outputs the reducer already computed successfully.
// It also covers a same-findingId content collision in the finding registry.

import { createRequire } from 'node:module';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const nodeRequire = createRequire(import.meta.url);
const { reduceReviewState } = nodeRequire('../../scripts/reduce-state.cjs') as {
  reduceReviewState: (
    specFolder: string,
    options?: Record<string, unknown>,
  ) => {
    hasCorruption: boolean;
    corruptionWarnings: unknown[];
    strategyWarning: string | null;
    registryPath: string;
    dashboardPath: string;
    strategyPath: string;
    registry: {
      openFindingsCount: number;
      openFindings: { findingId: string; severity: string; title: string; file: string | null }[];
    };
    dashboard: string;
  };
};

const scratchDirs: string[] = [];
afterEach(() => {
  while (scratchDirs.length > 0) {
    const dir = scratchDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

function makeReviewDir(): { specFolder: string; reviewDir: string } {
  const specFolder = mkdtempSync(join(tmpdir(), 'review-reducer-resilience-'));
  scratchDirs.push(specFolder);
  const reviewDir = join(specFolder, 'review');
  mkdirSync(reviewDir, { recursive: true });
  return { specFolder, reviewDir };
}

describe('reduceReviewState — degrades gracefully on warning-class problems', () => {
  it('still writes the registry and dashboard when the strategy file has no recognizable machine anchor', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'anchor-degrade-proof' }));
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), '');
    // No ANCHOR comments and no "REVIEW DIMENSIONS" heading at all -- neither
    // of replaceAnchorSection's match paths can find this section.
    writeFileSync(join(reviewDir, 'deep-review-strategy.md'), '# Deep Review Strategy\n\nNo machine sections here at all.\n');

    const result = reduceReviewState(specFolder, { write: true, artifactDir: reviewDir });

    expect(result.strategyWarning).toMatch(/Missing machine-owned anchor/);
    // Before the fix this throw propagated out of reduceReviewState and none
    // of these files were ever written.
    expect(existsSync(result.registryPath)).toBe(true);
    expect(existsSync(result.dashboardPath)).toBe(true);
    expect(readFileSync(result.registryPath, 'utf8')).toContain('"openFindingsCount"');
  });

  it('still writes the registry, strategy, and dashboard when the state log has corrupt lines, and still reports the corruption loudly', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'corruption-degrade-proof' }));
    const validIteration = JSON.stringify({
      type: 'iteration',
      iteration: 1,
      run: 1,
      status: 'complete',
      focus: 'dim-a',
      newFindingsRatio: 0.5,
      findingsSummary: { P0: 0, P1: 0, P2: 0 },
    });
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${validIteration}\nnot-json-at-all\n`);

    let thrown: (Error & { code?: string }) | null = null;
    let result: ReturnType<typeof reduceReviewState> | undefined;
    try {
      result = reduceReviewState(specFolder, { write: true, artifactDir: reviewDir });
    } catch (error) {
      thrown = error as Error & { code?: string };
    }

    // The failure is still surfaced loudly (non-zero-exit-class thrown error),
    // it is just no longer allowed to withhold output already computed from
    // the valid records.
    expect(result).toBeUndefined();
    expect(thrown).not.toBeNull();
    expect(thrown?.code).toBe('STATE_CORRUPTION');

    const registryPath = join(reviewDir, 'deep-review-findings-registry.json');
    const dashboardPath = join(reviewDir, 'deep-review-dashboard.md');
    // Before the fix, this throw happened before the write block ran, so
    // neither file would exist on disk.
    expect(existsSync(registryPath)).toBe(true);
    expect(existsSync(dashboardPath)).toBe(true);
    expect(readFileSync(dashboardPath, 'utf8')).toContain('Iteration: 1 of 5');
  });

  it('keeps two distinct findings that share a findingId but have different content instead of silently dropping one', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'id-collision-proof' }));
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), '');
    const deltasDir = join(reviewDir, 'deltas');
    mkdirSync(deltasDir, { recursive: true });
    // Same findingId ("F001"), reused across two independent iterations, but
    // pointing at two clearly distinct findings (different file, different
    // title). This mirrors an id counter that resets per iteration/dispatch.
    // (file:line is split by the reducer's own parser, so file ends up
    // without the trailing ":<line>".)
    writeFileSync(
      join(deltasDir, 'iter-001.jsonl'),
      `${JSON.stringify({ type: 'finding', iteration: 1, id: 'F001', severity: 'P1', title: 'Missing null check in parseFoo', file: 'src/foo.ts:10' })}\n`,
    );
    writeFileSync(
      join(deltasDir, 'iter-002.jsonl'),
      `${JSON.stringify({ type: 'finding', iteration: 2, id: 'F001', severity: 'P1', title: 'Unbounded recursion in parseBar', file: 'src/bar.ts:99' })}\n`,
    );

    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });

    // Before the fix, the second record's title/file were silently discarded
    // by the findingId-keyed merge and openFindingsCount stayed at 1.
    expect(result.registry.openFindingsCount).toBe(2);
    const titles = result.registry.openFindings.map((f) => f.title).sort();
    expect(titles).toEqual(['Missing null check in parseFoo', 'Unbounded recursion in parseBar']);
    const files = result.registry.openFindings.map((f) => f.file).sort();
    expect(files).toEqual(['src/bar.ts', 'src/foo.ts']);
  });
});
