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

// The expansive projection the review reducer derives from the frontier node
// store. Only the fields the assertions read are modelled.
type FrontierNode = {
  nodeId: string;
  parentId: string | null;
  depth: number;
  scope: string[] | string | null;
  question: string | null;
  status: string;
  reason: string | null;
  iteration: number | null;
  coveredDimensions: string[];
  nextDimension: string | null;
  visits: number;
};

type FrontierProjection = {
  nodes: FrontierNode[];
  stats: Record<string, number>;
  budget: Record<string, { allotted: number; spent: number }>;
  activeNodeId: string | null;
  activeNextDimension: string | null;
};

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
      openFindings: {
        findingId: string;
        severity: string;
        title: string;
        file: string | null;
        line?: number | null;
        lastSeen?: number;
      }[];
      terminalStop: {
        stopReason: string | null;
        totalIterations: number | null;
        timestamp: string | null;
      } | null;
      continuedFromRun: number | null;
      lineageMode: string;
      candidateCoverage: {
        covered: string[];
        ruledOut: string[];
        deferred: string[];
        blocked: string[];
        byBugClass: Record<string, { covered: boolean; ruledOut: boolean; deferred: boolean; blocked: boolean; iterations: number[] }>;
      };
      searchDebt: {
        id: string;
        iteration: number;
        targetRefs: string[];
        bugClass: string;
        disposition: string;
        rationale: string;
        evidenceRefs: string[];
        reason?: string;
        frontier?: boolean;
      }[];
      frontier?: FrontierProjection;
    };
    dashboard: string;
    strategy: string;
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

// Slicing out the one section keeps an assertion honest: the same text living in a
// neighbouring section must not satisfy it, and a missing section fails loudly
// instead of shrinking the haystack to nothing.
function sectionAfter(markdown: string, heading: string, boundary: string): string {
  const start = markdown.indexOf(heading);
  const end = start === -1 ? -1 : markdown.indexOf(boundary, start + heading.length);
  if (start === -1 || end === -1) {
    throw new Error(`Missing "${heading}" block bounded by "${boundary}"`);
  }
  return markdown.slice(start + heading.length, end);
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

  // Older and per-lineage review folders hold a state log but no config file. A missing
  // config is a warning like a corrupt line: lenient reduction proceeds on defaults, and
  // strict reduction still fails loudly, naming the file instead of a bare ENOENT.
  it('reduces a review folder with no config file on defaults, and names the file when strict', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    const iteration = JSON.stringify({
      type: 'iteration',
      iteration: 1,
      run: 1,
      status: 'complete',
      focus: 'dim-a',
      newFindingsRatio: 0.5,
      findingsSummary: { P0: 0, P1: 0, P2: 0 },
    });
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${iteration}\n`);

    const lenient = reduceReviewState(specFolder, { write: false, lenient: true, artifactDir: reviewDir });
    expect(lenient.hasCorruption).toBe(true);
    expect(JSON.stringify(lenient.corruptionWarnings)).toContain('deep-review-config.json');
    expect(lenient.dashboard).toContain('Iteration: 1');

    let thrown: (Error & { code?: string }) | null = null;
    try {
      reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });
    } catch (error) {
      thrown = error as Error & { code?: string };
    }
    expect(thrown?.code).toBe('STATE_CORRUPTION');
    expect(thrown?.message).toContain('deep-review-config.json');
    expect(thrown?.message).toContain('could not read deep-review-config.json');
    expect(thrown?.message).not.toContain('corrupt line');
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

  // A leaf next focus is a hint about where attention could go, not evidence that a
  // dimension was covered. When it names no required dimension, the first uncovered
  // one is the work that still exists, so it has to outrank the hint in both outputs.
  it('names the first uncovered dimension when the leaf next focus names no dimension', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'default-next-focus' }));
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${JSON.stringify({
      type: 'iteration',
      iteration: 1,
      run: 1,
      status: 'complete',
      focus: 'security',
      dimensions: ['security'],
      newFindingsRatio: 0.5,
      findingsSummary: { P0: 0, P1: 0, P2: 0 },
    })}\n`);
    mkdirSync(join(reviewDir, 'iterations'), { recursive: true });
    writeFileSync(join(reviewDir, 'iterations', 'iteration-001.md'), [
      '# Iteration 1: Security',
      '',
      '## Recommended Next Focus',
      '',
      'Look at the release notes wording',
      '',
    ].join('\n'));
    // The machine-owned sections are seeded the way a live strategy file carries them,
    // so the authored free text is the only candidate standing behind the section body.
    writeFileSync(join(reviewDir, 'deep-review-strategy.md'), [
      '# Deep Review Strategy',
      '',
      '<!-- ANCHOR:review-dimensions -->',
      '## 3. REVIEW DIMENSIONS (remaining)',
      '- [ ] correctness',
      '- [ ] security',
      '- [ ] traceability',
      '- [ ] maintainability',
      '<!-- /ANCHOR:review-dimensions -->',
      '',
      '<!-- ANCHOR:completed-dimensions -->',
      '## 4. COMPLETED DIMENSIONS',
      '[None yet]',
      '<!-- /ANCHOR:completed-dimensions -->',
      '',
      '<!-- ANCHOR:running-findings -->',
      '## 5. RUNNING FINDINGS',
      '- P0 (Blockers): 0',
      '<!-- /ANCHOR:running-findings -->',
      '',
      '<!-- ANCHOR:exhausted-approaches -->',
      '## 9. EXHAUSTED APPROACHES (do not retry)',
      '[None yet]',
      '<!-- /ANCHOR:exhausted-approaches -->',
      '',
      '## 11. RULED OUT DIRECTIONS',
      '[None yet]',
      '',
      '<!-- ANCHOR:next-focus -->',
      '## 11. NEXT FOCUS',
      '[None yet]',
      '<!-- /ANCHOR:next-focus -->',
      '',
    ].join('\n'));

    const result = reduceReviewState(specFolder, { write: true, artifactDir: reviewDir });
    const strategyNextFocus = sectionAfter(readFileSync(result.strategyPath, 'utf8'), '## 11. NEXT FOCUS', '<!--');
    const dashboardNextFocus = sectionAfter(result.dashboard, '## 11. NEXT FOCUS', '<!--');

    // A strategy update skipped over a missing anchor would leave the authored text
    // in the file and let the assertion below pass for the wrong reason.
    expect(result.strategyWarning).toBeNull();
    expect(strategyNextFocus).toContain('correctness');
    expect(strategyNextFocus).not.toContain('Look at the release notes wording');
    expect(dashboardNextFocus).toContain('correctness');
  });
});

describe('reduceReviewState — iteration numbering', () => {
  it('counts distinct run values in the dashboard after a run is redispatched', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'redispatched-run-count' }));
    const records = [2, 2, 3].map((run, index) => ({
      type: 'iteration',
      iteration: run,
      run,
      status: 'complete',
      focus: `dimension-${index + 1}`,
      newFindingsRatio: 0.5,
      findingsSummary: { P0: 0, P1: 0, P2: 0 },
    }));
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${records.map((record) => JSON.stringify(record)).join('\n')}\n`);
    writeFileSync(join(reviewDir, 'deep-review-strategy.md'), '# Deep Review Strategy\n\nNo machine sections here at all.\n');

    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });

    expect(result.dashboard).toContain('- Iteration: 2 of 5');
    expect(result.dashboard).not.toContain('- Iteration: 3 of 5');
  });

  it('shows a landed iteration as error when the still-fails row follows it', () => {
    // A landed iteration that fails verification with a reason that skips the redispatch
    // still gets the workflow's error row, and the later row replaces the landed one.
    const { specFolder, reviewDir } = makeReviewDir();
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'landed-then-error' }));
    const records = [
      { type: 'iteration', iteration: 1, run: 1, status: 'complete', focus: 'dim-1', newFindingsRatio: 0.5, findingsSummary: { P0: 0, P1: 0, P2: 0 } },
      { type: 'iteration', iteration: 2, run: 2, status: 'complete', focus: 'dim-2', newFindingsRatio: 0.4, findingsSummary: { P0: 0, P1: 1, P2: 0 } },
      { type: 'iteration', iteration: 2, run: 2, status: 'error', focus: 'dim-2', findingsCount: 0, newFindingsRatio: 0.0, findingsSummary: { P0: 0, P1: 0, P2: 0 } },
    ];
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${records.map((record) => JSON.stringify(record)).join('\n')}\n`);
    writeFileSync(join(reviewDir, 'deep-review-strategy.md'), '# Deep Review Strategy\n\nNo machine sections here at all.\n');

    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });

    expect(result.dashboard).toContain('- Iteration: 2 of 5');
    expect(result.dashboard).toContain('| 2 | dim-2 | - | 0.00 | 0/0/0 | error |');
  });

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

describe('reduceReviewState — dashboard iteration rows', () => {
  it('shows a corrected attempt once when its run value is not a number', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'corrected-attempt' }));
    const attempt = (run: string, focus: string) => JSON.stringify({
      type: 'iteration',
      iteration: 1,
      run,
      focus,
      dimensions: ['correctness'],
      newFindingsRatio: 0.5,
      status: 'complete',
    });
    writeFileSync(
      join(reviewDir, 'deep-review-state.jsonl'),
      `${attempt('attempt-a', 'first attempt')}\n${attempt('attempt-b', 'corrected attempt')}\n`,
    );
    writeFileSync(join(reviewDir, 'deep-review-strategy.md'), '# Deep Review Strategy\n');

    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });

    expect(result.dashboard).toContain('corrected attempt');
    expect(result.dashboard).not.toContain('first attempt');
  });
});

describe('reduceReviewState — re-verified findings at shifted lines', () => {
  it('folds a moved line into the first row and keeps a reused id with another title', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'shifted-line-proof' }));
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), '');
    const deltasDir = join(reviewDir, 'deltas');
    mkdirSync(deltasDir, { recursive: true });
    const row = (iteration: number, id: string, title: string, line: number) => JSON.stringify({
      type: 'finding',
      iteration,
      id,
      severity: 'P1',
      title,
      file: `src/guard.cjs:${line}`,
    });
    writeFileSync(
      join(deltasDir, 'iter-001.jsonl'),
      `${row(1, 'R1-P1-001', 'Guard compares paths lexically', 27)}\n`
      + `${row(1, 'R1-P1-002', 'First title', 10)}\n`,
    );
    writeFileSync(
      join(deltasDir, 'iter-002.jsonl'),
      `${row(2, 'R1-P1-001', 'Guard compares paths lexically', 24)}\n`
      + `${row(2, 'R1-P1-002', 'Another title', 10)}\n`,
    );

    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });
    const rows = result.registry.openFindings;

    // The same id, file and title is one finding even when its line moved. The first
    // row stays canonical and only lastSeen advances.
    expect(result.registry.openFindingsCount).toBe(3);
    const moved = rows.filter((finding) => finding.findingId === 'R1-P1-001');
    expect(moved).toHaveLength(1);
    expect(moved[0].line).toBe(27);
    expect(moved[0].lastSeen).toBe(2);

    // The reused id with a different title is a different finding, so both survive.
    expect(rows.filter((finding) => finding.findingId === 'R1-P1-002')).toHaveLength(2);
  });
});

describe('reduceReviewState: an extension reopens a completed run', () => {
  it('keeps continuedFromRun and reports no terminal stop when an extended row follows synthesis_complete', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'extension-proof', lineageMode: 'completed-continue', continuedFromRun: 2, status: 'initialized' }));
    const rows = [
      { type: 'iteration', iteration: 1, run: 1, status: 'complete', focus: 'correctness', newFindingsRatio: 0.5, findingsSummary: { P0: 0, P1: 0, P2: 0 } },
      { type: 'iteration', iteration: 2, run: 2, status: 'complete', focus: 'security', newFindingsRatio: 0.2, findingsSummary: { P0: 0, P1: 0, P2: 0 } },
      { type: 'event', event: 'synthesis_complete', stopReason: 'converged', totalIterations: 2, timestamp: '2026-11-17T00:00:00Z' },
      { type: 'event', event: 'extended', sessionId: 's-1', generation: 1, lineageMode: 'completed-continue', continuedFromRun: 2, timestamp: '2026-11-17T01:00:00Z' },
    ];
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
    writeFileSync(join(reviewDir, 'deep-review-strategy.md'), '# Deep Review Strategy\n\nNo machine sections here at all.\n');
    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });
    expect(result.registry.terminalStop).toBeNull();
    expect(result.registry.continuedFromRun).toBe(2);
    expect(result.registry.lineageMode).toBe('completed-continue');
  });
});

describe('reduceReviewState: configured custom dimensions', () => {
  // The registry keeps the configured custom dimensions beside the canonical four,
  // and the declared return type only models the canonical surface, so the test
  // reads those extra keys through an explicit shape.
  type CoverageRegistry = {
    dimensionCoverage: Record<string, boolean>;
    openFindings: { findingId: string; title: string; dimension: string | null }[];
  };
  const asCoverageRegistry = (result: ReturnType<typeof reduceReviewState>) =>
    result.registry as unknown as CoverageRegistry;

  it('tracks and covers a configured custom dimension after the canonical four', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({
      maxIterations: 5,
      reviewTarget: 'custom-dims',
      reviewDimensions: ['correctness', 'performance'],
    }));
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${JSON.stringify({
      type: 'iteration',
      iteration: 1,
      run: 1,
      status: 'complete',
      focus: 'performance',
      dimensions: ['performance'],
      newFindingsRatio: 0.5,
      findingsSummary: { P0: 0, P1: 0, P2: 0 },
    })}\n`);

    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });
    const coverage = asCoverageRegistry(result).dimensionCoverage;

    expect(Object.keys(coverage)).toEqual(['correctness', 'security', 'traceability', 'maintainability', 'performance']);
    expect(coverage.performance).toBe(true);
    expect(coverage.correctness).toBe(false);
    expect(result.dashboard).toContain('| performance | covered |');
  });

  // The iteration addressed a canonical dimension first, so only a match against the
  // configured custom name, not the first-addressed fallback, can attribute the finding.
  it('attributes a finding that names a custom dimension to it, not to the first addressed one', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({
      maxIterations: 5,
      reviewTarget: 'custom-dims',
      reviewDimensions: ['correctness', 'performance'],
    }));
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${JSON.stringify({
      type: 'iteration',
      iteration: 1,
      run: 1,
      status: 'complete',
      focus: 'mixed pass',
      dimensions: ['correctness', 'performance'],
      newFindingsRatio: 1,
      findingsSummary: { P0: 0, P1: 1, P2: 0 },
    })}\n`);
    mkdirSync(join(reviewDir, 'iterations'), { recursive: true });
    writeFileSync(join(reviewDir, 'iterations', 'iteration-001.md'), [
      '# Iteration 1: Mixed pass',
      '',
      '## Findings - New',
      '',
      '### P1 Findings',
      '',
      '1. **Performance: hot loop allocates per row** -- `src/loop.cjs:10` -- Each row allocates a temporary buffer',
      '',
      '## Assessment',
      '',
      'Dimensions addressed: correctness, performance',
      '',
    ].join('\n'));

    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });
    const [finding] = asCoverageRegistry(result).openFindings;

    expect(finding.dimension).toBe('performance');
  });

  it('keeps the canonical keys unchanged for a canonical-subset config', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({
      maxIterations: 5,
      reviewTarget: 'custom-dims',
      reviewDimensions: ['correctness', 'security'],
    }));
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${JSON.stringify({
      type: 'iteration',
      iteration: 1,
      run: 1,
      status: 'complete',
      focus: 'correctness',
      dimensions: ['correctness'],
      newFindingsRatio: 0.5,
      findingsSummary: { P0: 0, P1: 0, P2: 0 },
    })}\n`);

    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });
    const coverage = asCoverageRegistry(result).dimensionCoverage;

    expect(Object.keys(coverage)).toEqual(['correctness', 'security', 'traceability', 'maintainability']);
  });
});

describe('reduceReviewState expansive frontier', () => {
  // The expansive depth mode is the only thing that makes the reducer read the
  // node store, so every case here writes the mode into the config.
  function writeExpansiveConfig(reviewDir: string) {
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({
      maxIterations: 10,
      reviewTarget: 'expansive-frontier',
      reviewDimensions: ['correctness', 'security'],
      antiConvergence: { depthMode: 'expansive' },
    }));
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), '');
  }

  function writeStore(reviewDir: string, rows: Record<string, unknown>[]) {
    writeFileSync(
      join(reviewDir, 'frontier-nodes.jsonl'),
      `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`,
    );
  }

  function nodeRow(overrides: Record<string, unknown>): Record<string, unknown> {
    return {
      parentId: null,
      depth: 1,
      scope: ['src'],
      question: 'Does the stop path keep its reason?',
      status: 'open',
      reason: null,
      iteration: 1,
      ...overrides,
    };
  }

  function iterationRecord(iteration: number, focus: string, dimensions: string[], extra: Record<string, unknown> = {}) {
    return JSON.stringify({
      type: 'iteration',
      iteration,
      run: iteration,
      status: 'complete',
      focus,
      dimensions,
      newFindingsRatio: 0.5,
      findingsSummary: { P0: 0, P1: 0, P2: 0 },
      ...extra,
    });
  }

  // A missing projection would otherwise surface as a confusing `undefined`
  // property read in every assertion below.
  function readFrontier(result: ReturnType<typeof reduceReviewState>): FrontierProjection {
    const frontier = result.registry.frontier;
    if (!frontier) throw new Error('expected the expansive depth mode to project a frontier');
    return frontier;
  }

  // The machine-owned sections are seeded the way a live strategy file carries
  // them, so an untouched anchor cannot quiet a next-focus assertion.
  function writeStrategy(reviewDir: string) {
    writeFileSync(join(reviewDir, 'deep-review-strategy.md'), [
      '# Deep Review Strategy',
      '',
      '<!-- ANCHOR:review-dimensions -->',
      '## 3. REVIEW DIMENSIONS (remaining)',
      '- [ ] correctness',
      '- [ ] security',
      '- [ ] traceability',
      '- [ ] maintainability',
      '<!-- /ANCHOR:review-dimensions -->',
      '',
      '<!-- ANCHOR:completed-dimensions -->',
      '## 4. COMPLETED DIMENSIONS',
      '[None yet]',
      '<!-- /ANCHOR:completed-dimensions -->',
      '',
      '<!-- ANCHOR:running-findings -->',
      '## 5. RUNNING FINDINGS',
      '- P0 (Blockers): 0',
      '<!-- /ANCHOR:running-findings -->',
      '',
      '<!-- ANCHOR:exhausted-approaches -->',
      '## 9. EXHAUSTED APPROACHES (do not retry)',
      '[None yet]',
      '<!-- /ANCHOR:exhausted-approaches -->',
      '',
      '## 11. RULED OUT DIRECTIONS',
      '[None yet]',
      '',
      '<!-- ANCHOR:next-focus -->',
      '## 11. NEXT FOCUS',
      '[None yet]',
      '<!-- /ANCHOR:next-focus -->',
      '',
    ].join('\n'));
  }

  // A leaf focus naming an uncovered dimension is what the base pick would
  // otherwise hand the next iteration, so it is the candidate to lose.
  function writeLeafFocus(reviewDir: string, focus: string) {
    mkdirSync(join(reviewDir, 'iterations'), { recursive: true });
    writeFileSync(join(reviewDir, 'iterations', 'iteration-001.md'), [
      '# Iteration 1: Correctness',
      '',
      '## Recommended Next Focus',
      '',
      focus,
      '',
    ].join('\n'));
  }

  it('projects one open node into the frontier and one deferred search-debt entry', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeExpansiveConfig(reviewDir);
    writeStore(reviewDir, [nodeRow({ nodeId: 'F-1-001' })]);

    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });
    const frontier = readFrontier(result);

    expect(frontier.nodes).toHaveLength(1);
    expect(frontier.activeNodeId).toBe('F-1-001');
    expect(frontier.activeNextDimension).toBe('correctness');
    expect(result.registry.searchDebt).toHaveLength(1);
    expect(result.registry.searchDebt[0]).toMatchObject({
      id: 'frontier-F-1-001',
      bugClass: 'frontier:F-1-001',
      disposition: 'deferred',
      reason: 'frontier node open',
      frontier: true,
      targetRefs: ['src'],
      evidenceRefs: ['frontier-nodes.jsonl#F-1-001'],
    });
    expect(result.registry.candidateCoverage.deferred).toEqual(['frontier:F-1-001']);
    expect(result.registry.candidateCoverage.byBugClass['frontier:F-1-001'].deferred).toBe(true);
  });

  it('reduces the same store to byte-identical frontier and search debt', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeExpansiveConfig(reviewDir);
    // Rows are written out of nodeId order so the projection's own ordering, not
    // the file's, is what the two runs have to agree on.
    writeStore(reviewDir, [
      nodeRow({ nodeId: 'F-1-002', depth: 2, iteration: 2, scope: ['src', 'lib'] }),
      nodeRow({ nodeId: 'F-1-001' }),
    ]);

    const first = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });
    const second = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });

    expect(JSON.stringify(second.registry.frontier)).toBe(JSON.stringify(first.registry.frontier));
    expect(JSON.stringify(second.registry.searchDebt)).toBe(JSON.stringify(first.registry.searchDebt));
  });

  it('closes an exhausted node and derives an answered one, reporting neither as debt', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeExpansiveConfig(reviewDir);
    writeStore(reviewDir, [
      nodeRow({ nodeId: 'F-1-001', status: 'exhausted', reason: 'budget', iteration: 2 }),
      nodeRow({ nodeId: 'F-1-002', question: 'Is the parser covered on all sides?' }),
    ]);
    // The review universe is the canonical four plus any configured extras, so
    // an answered node has to carry evidence for all four of them.
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${[
      iterationRecord(1, 'parser pass one', ['correctness', 'security'], { frontierNodeId: 'F-1-002' }),
      iterationRecord(2, 'parser pass two', ['traceability', 'maintainability'], { frontierNodeId: 'F-1-002' }),
    ].join('\n')}\n`);

    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });
    const frontier = readFrontier(result);

    expect(frontier.nodes.map((node) => [node.nodeId, node.status])).toEqual([
      ['F-1-001', 'exhausted'],
      ['F-1-002', 'answered'],
    ]);
    expect(frontier.nodes[1].coveredDimensions).toEqual(['correctness', 'security', 'traceability', 'maintainability']);
    expect(result.registry.searchDebt.filter((entry) => entry.frontier)).toEqual([]);
    expect(result.registry.candidateCoverage.deferred.filter((bugClass) => bugClass.startsWith('frontier:'))).toEqual([]);
    expect(result.registry.candidateCoverage.blocked.filter((bugClass) => bugClass.startsWith('frontier:'))).toEqual([]);
    expect(result.registry.candidateCoverage.covered).toContain('frontier:F-1-002');
  });

  it('attributes a reworded focus through the store and keeps a longer node id out', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeExpansiveConfig(reviewDir);
    // The node was seeded open, then marked active on iteration 2 — that row is
    // what attributes the reworded focus, which never echoed the marker.
    writeStore(reviewDir, [
      nodeRow({ nodeId: 'F-1-001', iteration: 1 }),
      nodeRow({ nodeId: 'F-1-001', status: 'active', iteration: 2 }),
    ]);
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${[
      iterationRecord(2, 'went over the parser edge cases', ['correctness']),
      iterationRecord(3, 'Review of Frontier node F-1-001: security', ['security']),
      iterationRecord(4, 'Frontier node F-1-0012 maintainability sweep', ['maintainability']),
    ].join('\n')}\n`);

    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });
    const [node] = readFrontier(result).nodes;

    expect(node.status).toBe('active');
    expect(node.coveredDimensions).toEqual(['correctness', 'security']);
    expect(node.nextDimension).toBe('traceability');
    expect(node.visits).toBe(2);
  });

  it('leaves the frontier out of a default run that happens to carry a store file', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({
      maxIterations: 10,
      reviewTarget: 'default-frontier-absent',
      reviewDimensions: ['correctness', 'security'],
    }));
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), '');
    writeStore(reviewDir, [nodeRow({ nodeId: 'F-1-001' })]);

    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });

    expect('frontier' in result.registry).toBe(false);
    expect(result.registry.searchDebt).toEqual([]);
    expect(result.registry.candidateCoverage.deferred).toEqual([]);
  });

  it('hands next focus to the active frontier node, and keeps the pivot and blocked-stop overrides ahead of it', () => {
    const frontierFocus = 'Frontier node F-1-001 (depth 1, scope src, lib): Does the stop path keep its reason? - review the correctness dimension';

    // An open node outranks the leaf focus, which here names an uncovered
    // dimension and would otherwise be picked verbatim.
    const { specFolder, reviewDir } = makeReviewDir();
    writeExpansiveConfig(reviewDir);
    writeStrategy(reviewDir);
    writeLeafFocus(reviewDir, 'security');
    writeStore(reviewDir, [nodeRow({ nodeId: 'F-1-001', scope: ['src', 'lib'] })]);

    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });
    const strategyFocus = sectionAfter(result.strategy, '## 11. NEXT FOCUS', '<!--');
    const dashboardFocus = sectionAfter(result.dashboard, '## 11. NEXT FOCUS', '<!--');

    // A skipped strategy anchor would leave the authored text behind and let the
    // next assertion pass for the wrong reason.
    expect(result.strategyWarning).toBeNull();
    expect(readFrontier(result).activeNodeId).toBe('F-1-001');
    expect(strategyFocus).toContain(frontierFocus);
    expect(strategyFocus).not.toContain('security');
    expect(dashboardFocus).toContain(frontierFocus);

    // A completed pivot's current focus is the run's own latest decision, so it
    // outranks the node the frontier would dispatch.
    const pivotFocus = 'pivot focus on the scheduler';
    const pivotRun = makeReviewDir();
    writeExpansiveConfig(pivotRun.reviewDir);
    writeStrategy(pivotRun.reviewDir);
    writeLeafFocus(pivotRun.reviewDir, 'security');
    writeStore(pivotRun.reviewDir, [nodeRow({ nodeId: 'F-1-001', scope: ['src', 'lib'] })]);
    mkdirSync(join(pivotRun.reviewDir, 'divergent', 'pivots', 'pivot-1-a1b2', 'council'), { recursive: true });
    writeFileSync(
      join(pivotRun.reviewDir, 'divergent', 'pivots', 'pivot-1-a1b2', 'council', 'state.jsonl'),
      `${JSON.stringify({
        event: 'pivot_completed',
        pivotId: 'pivot-1-a1b2',
        previousFocus: 'correctness',
        currentFocus: pivotFocus,
        selectedCandidate: null,
      })}\n`,
    );

    const pivotResult = reduceReviewState(pivotRun.specFolder, { write: false, artifactDir: pivotRun.reviewDir });
    const pivotStrategyFocus = sectionAfter(pivotResult.strategy, '## 11. NEXT FOCUS', '<!--');
    const pivotDashboardFocus = sectionAfter(pivotResult.dashboard, '## 11. NEXT FOCUS', '<!--');

    expect(readFrontier(pivotResult).activeNodeId).toBe('F-1-001');
    expect(pivotStrategyFocus).toContain(pivotFocus);
    expect(pivotStrategyFocus).not.toContain(frontierFocus);
    expect(pivotDashboardFocus).toContain(pivotFocus);

    // With every node terminal there is no node to dispatch, so the leaf focus
    // returns. The frontier is still projected, which is what makes the absence
    // of a node the reason the leaf wins rather than a missing projection.
    const terminalRun = makeReviewDir();
    writeExpansiveConfig(terminalRun.reviewDir);
    writeStrategy(terminalRun.reviewDir);
    writeLeafFocus(terminalRun.reviewDir, 'security');
    writeStore(terminalRun.reviewDir, [nodeRow({ nodeId: 'F-1-001', status: 'exhausted', reason: 'budget' })]);

    const terminalResult = reduceReviewState(terminalRun.specFolder, { write: false, artifactDir: terminalRun.reviewDir });
    const terminalStrategyFocus = sectionAfter(terminalResult.strategy, '## 11. NEXT FOCUS', '<!--');
    const terminalDashboardFocus = sectionAfter(terminalResult.dashboard, '## 11. NEXT FOCUS', '<!--');

    expect(readFrontier(terminalResult).activeNodeId).toBeNull();
    expect(terminalStrategyFocus).toContain('security');
    expect(terminalStrategyFocus).not.toContain('Frontier node');
    expect(terminalDashboardFocus).toContain('security');
    expect(terminalDashboardFocus).not.toContain('Frontier node');

    // A blocked stop is the loop's latest event, so it still outranks the node.
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${JSON.stringify({
      type: 'event',
      event: 'blocked_stop',
      run: 2,
      timestamp: '2026-06-19T00:30:00.000Z',
      blockedBy: ['evidence_gate'],
      recoveryStrategy: 'collect the missing evidence',
    })}\n`);

    const blockedResult = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });
    const blockedFocus = sectionAfter(blockedResult.strategy, '## 11. NEXT FOCUS', '<!--');

    expect(readFrontier(blockedResult).activeNodeId).toBe('F-1-001');
    expect(blockedFocus).toContain('BLOCKED on:');
    expect(blockedFocus).not.toContain(frontierFocus);
  });

  it('reports frontier size, pruned nodes, revisits and per-band budget on the dashboard', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeExpansiveConfig(reviewDir);
    writeStore(reviewDir, [
      nodeRow({ nodeId: 'F-1-001', scope: ['src', 'lib'], iteration: 1 }),
      nodeRow({
        nodeId: 'F-1-002',
        depth: 2,
        scope: 'src/parser',
        question: 'Is the parser covered on all sides?',
        status: 'pruned',
        reason: 'duplicate',
        iteration: 2,
      }),
    ]);
    // Two visits that covered the same dimension are depth spent twice on ground
    // the run had already walked, which is what the revisit count has to show.
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${[
      iterationRecord(1, 'Frontier node F-1-001: correctness', ['correctness'], { frontierNodeId: 'F-1-001' }),
      iterationRecord(2, 'Frontier node F-1-001: correctness again', ['correctness'], { frontierNodeId: 'F-1-001' }),
    ].join('\n')}\n`);

    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });
    const frontier = readFrontier(result);
    const section = sectionAfter(result.dashboard, '## 10B. FRONTIER', '<!--');

    expect(section).toContain('- Frontier size: 2 nodes (1 open, 0 active, 0 answered, 0 exhausted, 0 blocked)');
    expect(section).toContain('- Pruned nodes: 1');
    expect(section).toContain('- Revisits: 1');
    expect(section).toContain('- Budget depth1: 2 of 5 iterations spent');
    expect(section).toContain('- Active node: F-1-001 (security)');
    expect(frontier.budget.depth1).toEqual({ allotted: 5, spent: 2 });
  });

  // A node owes one pass per configured dimension, so a partly reviewed node must
  // stay open and keep steering until the last of them lands.
  it('keeps a node open with two of four dimensions covered and answers it at four', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({
      maxIterations: 20,
      reviewTarget: 'expansive-frontier',
      reviewDimensions: ['correctness', 'security', 'traceability', 'maintainability'],
      antiConvergence: { depthMode: 'expansive' },
    }));
    writeStore(reviewDir, [nodeRow({ nodeId: 'F-1-001' })]);
    const partial = [
      iterationRecord(1, 'Frontier node F-1-001: correctness', ['correctness']),
      iterationRecord(2, 'Frontier node F-1-001: security', ['security']),
    ];
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${partial.join('\n')}\n`);
    const halfway = readFrontier(reduceReviewState(specFolder, { write: false, artifactDir: reviewDir }));
    expect(halfway.nodes[0]).toMatchObject({
      status: 'open',
      coveredDimensions: ['correctness', 'security'],
      nextDimension: 'traceability',
    });
    expect(halfway.activeNextDimension).toBe('traceability');

    const all = partial.concat([
      iterationRecord(3, 'Frontier node F-1-001: traceability', ['traceability']),
      iterationRecord(4, 'Frontier node F-1-001: maintainability', ['maintainability']),
    ]);
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${all.join('\n')}\n`);
    const done = readFrontier(reduceReviewState(specFolder, { write: false, artifactDir: reviewDir }));
    expect(done.nodes[0]).toMatchObject({ status: 'answered', nextDimension: null });
    expect(done.activeNodeId).toBeNull();
  });

  it('renders no frontier section into a default run', () => {
    const { specFolder, reviewDir } = makeReviewDir();
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({
      maxIterations: 10,
      reviewTarget: 'default-no-frontier-section',
      reviewDimensions: ['correctness', 'security'],
    }));
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), '');
    writeStore(reviewDir, [nodeRow({ nodeId: 'F-1-001' })]);

    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });

    expect(result.dashboard).not.toContain('10B. FRONTIER');
    expect(result.dashboard).not.toContain('ANCHOR:frontier');
  });
});
