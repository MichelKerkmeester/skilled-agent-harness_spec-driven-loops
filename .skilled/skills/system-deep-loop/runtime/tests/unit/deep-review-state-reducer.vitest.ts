// ───────────────────────────────────────────────────────────────────
// MODULE: Review State Reducer Tests
// ───────────────────────────────────────────────────────────────────

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

  it('names a severity outside the scale instead of dropping its finding in silence', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'out-of-scale-severity-proof' }));
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), '');
    const deltasDir = join(reviewDir, 'deltas');
    mkdirSync(deltasDir, { recursive: true });
    writeFileSync(
      join(deltasDir, 'iter-001.jsonl'),
      `${JSON.stringify({ type: 'finding', iteration: 1, id: 'F010', severity: 'P1', title: 'In scale', file: 'src/a.ts:1' })}\n`
      + `${JSON.stringify({ type: 'finding', iteration: 1, id: 'F011', severity: 'P3', title: 'Out of scale', file: 'src/b.ts:2' })}\n`,
    );

    const lines: string[] = [];
    const originalWrite = process.stderr.write.bind(process.stderr);
    (process.stderr as unknown as { write: (chunk: string) => boolean }).write = (chunk: string) => {
      lines.push(String(chunk));
      return true;
    };
    let result;
    try {
      result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });
    } finally {
      (process.stderr as unknown as { write: typeof originalWrite }).write = originalWrite;
    }

    // The reducer still has no tier to file it under, so the finding is dropped.
    // What changed is that the drop is now attributable to the value that caused it.
    expect(result.registry.openFindings.map((f) => f.findingId)).toEqual(['F010']);
    expect(lines.join('')).toMatch(/severity "P3" is outside the P0\/P1\/P2 scale/);
  });
});

describe('reduceReviewState — iteration numbering', () => {
  it('numbers a dashboard progress row from `iteration` when the record carries no `run`', () => {
    // `iteration` is the canonical iteration-record field and the fan-out validator
    // accepts nothing else, so a record that honours the contract must still render
    // its number in the progress table rather than the word "undefined".
    const { specFolder, reviewDir } = makeReviewDir();
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'iteration-numbering-proof' }));
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${JSON.stringify({
      type: 'iteration',
      iteration: 2,
      status: 'complete',
      focus: 'dim-iteration-only',
      newFindingsRatio: 0.5,
      findingsSummary: { P0: 0, P1: 0, P2: 0 },
    })}\n`);
    writeFileSync(join(reviewDir, 'deep-review-strategy.md'), '# Deep Review Strategy\n\nNo machine sections here at all.\n');

    const result = reduceReviewState(specFolder, { write: true, artifactDir: reviewDir });

    expect(result.dashboard).toContain('| 2 | dim-iteration-only |');
    expect(result.dashboard).not.toContain('| undefined |');
  });
});

describe('reduceReviewState: finding narrative', () => {
  it('reduces an iteration to the same findings when each finding carries a Case line', () => {
    // Every finding carries a Case line. The narrative reader must skip it: a Case
    // line is evidence for its finding, not a finding of its own.
    const reduceNarrative = (narrative: string) => {
      const { specFolder, reviewDir } = makeReviewDir();
      mkdirSync(join(reviewDir, 'iterations'), { recursive: true });
      writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'case-line-proof' }));
      writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${JSON.stringify({
        type: 'iteration',
        iteration: 1,
        status: 'complete',
        focus: 'correctness',
        newFindingsRatio: 1,
        findingsSummary: { P0: 0, P1: 1, P2: 1 },
      })}\n`);
      writeFileSync(join(reviewDir, 'iterations', 'iteration-001.md'), narrative);
      return reduceReviewState(specFolder, { write: false, artifactDir: reviewDir }).registry;
    };
    const narrative = (withCase: boolean) => [
      '# Iteration 1: Correctness',
      '',
      '## Findings',
      '',
      '### P1 Findings',
      '',
      '- **F001**: Guard compares paths lexically - `scripts/apply.cjs:12` - Use a containment test',
      ...(withCase ? ['  - Case: a path with a trailing dot-dot segment passes the guard'] : []),
      '',
      '### P2 Findings',
      '',
      '- **F002**: Stale comment - `scripts/apply.cjs:40` - Update it',
      ...(withCase ? ['  Case: reading the comment next to the call shows the old flag name'] : []),
      '',
      'Review verdict: CONDITIONAL',
      '',
    ].join('\n');

    const plain = reduceNarrative(narrative(false));
    const withCase = reduceNarrative(narrative(true));

    expect(plain.openFindingsCount).toBe(2);
    expect(withCase.openFindingsCount).toBe(plain.openFindingsCount);
    expect(withCase.openFindings.map((f) => [f.findingId, f.severity, f.title]))
      .toEqual(plain.openFindings.map((f) => [f.findingId, f.severity, f.title]));
    expect(withCase.openFindings.map((f) => f.severity)).toEqual(['P1', 'P2']);
  });
});

describe('reduceReviewState: numbered finding narrative', () => {
  // The deep-review agent writes `N. **Title** -- file:line -- Description` with
  // its evidence lines indented below; older iterations use `- **F###**: ...`.
  const reduceNarrative = (
    narrative: string,
    deltaRows: Record<string, unknown>[] = [],
    laterRecords: Record<string, unknown>[] = [],
  ) => {
    const { specFolder, reviewDir } = makeReviewDir();
    mkdirSync(join(reviewDir, 'iterations'), { recursive: true });
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'numbered-shape-proof' }));
    const stateRecords = [{
      type: 'iteration',
      iteration: 1,
      status: 'complete',
      focus: 'correctness',
      newFindingsRatio: 1,
    }, ...laterRecords];
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${stateRecords.map((record) => JSON.stringify(record)).join('\n')}\n`);
    writeFileSync(join(reviewDir, 'iterations', 'iteration-001.md'), narrative);
    if (deltaRows.length > 0) {
      mkdirSync(join(reviewDir, 'deltas'), { recursive: true });
      writeFileSync(join(reviewDir, 'deltas', 'iter-001.jsonl'), `${deltaRows.map((row) => JSON.stringify(row)).join('\n')}\n`);
    }
    return reduceReviewState(specFolder, { write: false, artifactDir: reviewDir }).registry;
  };
  const numberedNarrative = (evidenceLines: string[]) => [
    '# Iteration 1: Correctness',
    '',
    '## Findings - New',
    '',
    '### P1 Findings',
    '',
    '1. **Guard compares paths lexically** -- `scripts/apply.cjs:12` -- Use a containment test',
    ...evidenceLines,
    '',
    '### P2 Findings',
    '',
    '1. **Stale comment** -- scripts/apply.cjs:40 -- Update it',
    '',
    '## Traceability Checks',
    '',
  ].join('\n');
  const summarize = (registry: ReturnType<typeof reduceNarrative>) => registry.openFindings
    .map((f) => [f.findingId, f.severity, f.title, f.file]);

  it('reads numbered findings in the shape the deep-review agent writes', () => {
    const registry = reduceNarrative(numberedNarrative([]));

    expect(registry.openFindingsCount).toBe(2);
    expect(summarize(registry)).toEqual([
      ['R1-P1-001', 'P1', 'Guard compares paths lexically', 'scripts/apply.cjs'],
      ['R1-P2-001', 'P2', 'Stale comment', 'scripts/apply.cjs'],
    ]);
  });

  it('still reads the F### bullet shape', () => {
    const registry = reduceNarrative([
      '# Iteration 1: Correctness',
      '',
      '## Findings',
      '',
      '### P1 Findings',
      '',
      '- **F001**: Guard compares paths lexically - `scripts/apply.cjs:12` - Use a containment test',
      '',
      '### P2 Findings',
      '',
      '- **F002**: Stale comment - `scripts/apply.cjs:40` - Update it',
      '',
    ].join('\n'));

    expect(summarize(registry)).toEqual([
      ['F001', 'P1', 'Guard compares paths lexically', 'scripts/apply.cjs'],
      ['F002', 'P2', 'Stale comment', 'scripts/apply.cjs'],
    ]);
  });

  it('does not count the evidence lines under a numbered finding as findings', () => {
    const registry = reduceNarrative(numberedNarrative([
      '   - Finding class: `path-guard`',
      '   - Scope proof: every caller passes a resolved path',
      '   - Affected surface hints: [`scripts/apply.cjs`]',
      '   - Case: a path with a trailing dot-dot segment passes the guard',
      '   ```json',
      '   {"type": "traceability", "finalSeverity": "P1"}',
      '   ```',
      '   1. **A nested step is not a finding** -- `scripts/apply.cjs:13` -- part of the case',
      'Finding class: `path-guard`',
      'Case: an unindented case line is still evidence',
    ]));

    expect(registry.openFindingsCount).toBe(2);
    expect(summarize(registry).map((row) => row[0])).toEqual(['R1-P1-001', 'R1-P2-001']);
  });

  it('gives a numbered finding the delta-row id, so a later resolution closes it', () => {
    const registry = reduceNarrative(numberedNarrative([]), [], [{
      type: 'iteration',
      iteration: 2,
      status: 'complete',
      focus: 'correctness',
      newFindingsRatio: 0,
      resolvedFindings: ['R1-P1-001'],
    }]);

    expect(registry.openFindingsCount).toBe(1);
    expect(summarize(registry).map((row) => row[0])).toEqual(['R1-P2-001']);
  });

  it('defers to the delta rows of an iteration that recorded them', () => {
    // The delta row words the title differently from the narrative, as live runs do,
    // so only skipping the narrative keeps the finding from being counted twice.
    const registry = reduceNarrative(numberedNarrative([]), [{
      type: 'finding',
      id: 'F-007',
      iteration: 1,
      severity: 'P1',
      status: 'active',
      title: 'Guard compares `paths` lexically',
      file: 'scripts/apply.cjs:12',
    }]);

    expect(registry.openFindingsCount).toBe(1);
    expect(summarize(registry).map((row) => row[0])).toEqual(['F-007']);
  });

  it('defers F### bullets to the delta rows of an iteration that recorded them', () => {
    // Delta rows reuse the bullet ids under reworded titles, which escape the dedup
    // key, so only skipping the narrative copy counts each finding once.
    const registry = reduceNarrative([
      '# Iteration 1: Correctness',
      '',
      '## Findings',
      '',
      '### P1 Findings',
      '',
      '- **F001**: Guard compares paths lexically - `scripts/apply.cjs:12` - Use a containment test',
      '',
      '### P2 Findings',
      '',
      '- **F002**: Stale comment - `scripts/apply.cjs:40` - Update it',
      '',
    ].join('\n'), [{
      type: 'finding',
      id: 'F001',
      iteration: 1,
      severity: 'P1',
      status: 'active',
      title: 'The path guard compares `paths` lexically',
      file: 'scripts/apply.cjs:12',
    }, {
      type: 'finding',
      id: 'F002',
      iteration: 1,
      severity: 'P2',
      status: 'active',
      title: 'A stale comment names a removed flag',
      file: 'scripts/apply.cjs:40',
    }]);

    expect(registry.openFindingsCount).toBe(2);
    expect(summarize(registry).map((row) => row[2])).toEqual([
      'The path guard compares `paths` lexically',
      'A stale comment names a removed flag',
    ]);
  });

  it('keeps an F### bullet that the delta rows of its iteration did not record', () => {
    // An iteration can record fewer delta rows than it narrates, and the narrated
    // finding then exists nowhere else, so it must stay in the registry.
    const registry = reduceNarrative([
      '# Iteration 1: Correctness',
      '',
      '## Findings',
      '',
      '### P1 Findings',
      '',
      '- **F001**: Guard compares paths lexically - `scripts/apply.cjs:12` - Use a containment test',
      '- **F002**: Plugin id reaches the vault path unchecked - `scripts/install.sh:30` - Validate it',
      '',
    ].join('\n'), [{
      type: 'finding',
      id: 'F001',
      iteration: 1,
      severity: 'P1',
      status: 'active',
      title: 'The path guard compares `paths` lexically',
      file: 'scripts/apply.cjs:12',
    }]);

    expect(registry.openFindingsCount).toBe(2);
    expect(summarize(registry).map((row) => row[0])).toEqual(['F001', 'F002']);
  });
});
