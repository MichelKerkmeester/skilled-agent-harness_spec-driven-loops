// ───────────────────────────────────────────────────────────────────
// MODULE: Next Focus Iteration Verdict Tests
// ───────────────────────────────────────────────────────────────────
//
// A review iteration closes with `## Next Focus` and then the mandatory
// `Review verdict:` self-report line, with no heading between them. A section read
// to the next heading takes the verdict in with the focus, and collapsing the block
// to a single line turned the focus fields into a run-on paragraph ending in a
// verdict about the iteration that produced them. The projected focus is what a
// reader and the next run both take as the work to do next, so it must carry the
// focus fields and their line breaks, and stop where the verdict begins.

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const requireCjs = createRequire(import.meta.url);
const { reduceReviewState } = requireCjs('../../scripts/reduce-state.cjs') as {
  reduceReviewState: (
    specFolder: string,
    options?: Record<string, unknown>,
  ) => { strategy: string; dashboard: string };
};

const FOCUS_LINES = [
  '- Dimension: `maintainability`.',
  '- Focus area: the reducer\'s Next Focus projection.',
  '- Required evidence: the strategy\'s section carries these three fields on three lines.',
];

const ITERATION_FILE = `# Review Iteration 001

## Dispatcher

- Mode: review; dimension \`maintainability\`.

## Findings - New

None.

## Next Focus

${FOCUS_LINES.join('\n')}

Review verdict: CONDITIONAL
`;

const STRATEGY_FILE = `# Deep Review Strategy

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] maintainability

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:completed-dimensions -->
## 6. COMPLETED DIMENSIONS
[None yet]

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 7. RUNNING FINDINGS
- P0 (Blockers): 0

<!-- /ANCHOR:running-findings -->
<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
[None yet]

<!-- /ANCHOR:exhausted-approaches -->
## 11. RULED OUT DIRECTIONS
[None yet]

<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
- [None yet]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Fixture packet.
`;

const FIXED_TS = '2026-08-23T00:00:00.000Z';

const scratchDirs: string[] = [];
afterEach(() => {
  while (scratchDirs.length > 0) {
    const dir = scratchDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

// Reads the section as a reader sees it: the non-empty lines under the heading,
// with the anchor comments that bracket it dropped.
function nextFocusLines(markdown: string): string[] {
  const section = markdown.match(/##\s+\d+\.\s+NEXT FOCUS\s*\n([\s\S]*?)(?=\n\s*\n<!-- \/ANCHOR:next-focus -->|\n##\s|$)/i);
  if (!section) throw new Error('Next Focus section is missing from the projection');
  return section[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('<!--'));
}

function reduceIterationWithoutStrategyBlock(): { strategy: string; dashboard: string } {
  const specFolder = mkdtempSync(join(tmpdir(), 'next-focus-iteration-verdict-'));
  scratchDirs.push(specFolder);
  const reviewDir = join(specFolder, 'review');
  const iterationDir = join(reviewDir, 'iterations');
  mkdirSync(iterationDir, { recursive: true });
  writeFileSync(
    join(reviewDir, 'deep-review-config.json'),
    JSON.stringify({ maxIterations: 3, reviewTarget: 'next-focus-projection-proof' }),
  );
  const record = {
    type: 'iteration',
    iteration: 1,
    run: 1,
    mode: 'review',
    status: 'complete',
    reviewDepthSchemaVersion: 2,
    findingsSummary: { P0: 0, P1: 0, P2: 0 },
    newFindingsRatio: 0,
    timestamp: FIXED_TS,
  };
  writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${JSON.stringify(record)}\n`);
  writeFileSync(join(iterationDir, 'iteration-001.md'), ITERATION_FILE);
  writeFileSync(join(reviewDir, 'deep-review-strategy.md'), STRATEGY_FILE);
  return reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });
}

describe('reduceReviewState — Next Focus projection', () => {
  it('carries the iteration focus lines and drops the review verdict line', () => {
    const result = reduceIterationWithoutStrategyBlock();

    expect(nextFocusLines(result.strategy)).toEqual(FOCUS_LINES);
    expect(nextFocusLines(result.dashboard)).toEqual(FOCUS_LINES);
    expect(result.strategy).not.toContain('Review verdict');
    expect(result.dashboard).not.toContain('Review verdict');
  });
});
