// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Strategy Numbering
// ───────────────────────────────────────────────────────────────────

// Regression coverage for the section numbers the review reducer writes into a
// strategy file. A strategy started from the shipped template already numbers
// its machine-owned sections (6, 7, 10, 12). If the writer substitutes its own
// numbering for those, the file ends up with two headings per number, and a
// reader citing "strategy section 5" can no longer tell which one is meant.

import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const nodeRequire = createRequire(import.meta.url);
const { reduceReviewState } = nodeRequire('../../scripts/reduce-state.cjs') as {
  reduceReviewState: (
    specFolder: string,
    options?: Record<string, unknown>,
  ) => { strategyWarning: string | null; strategyPath: string };
};

const HERE = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = resolve(HERE, '../../../deep-review/assets/deep-review-strategy.md');

// The fenced example near the end of the template quotes strategy headings as
// sample text, so those lines are prose rather than sections of this file.
function stripFencedBlocks(markdown: string): string {
  return markdown.replace(/^```[^\n]*\n[\s\S]*?^```[^\n]*$/gm, '');
}

function headingNumbers(markdown: string): string[] {
  return [...stripFencedBlocks(markdown).matchAll(/^## (\d+[A-Za-z]?)\./gm)].map((match) => match[1]);
}

const scratchDirs: string[] = [];

function makeReviewDir(): { specFolder: string; reviewDir: string } {
  const specFolder = mkdtempSync(join(tmpdir(), 'review-strategy-numbering-'));
  scratchDirs.push(specFolder);
  const reviewDir = join(specFolder, 'review');
  mkdirSync(reviewDir, { recursive: true });
  return { specFolder, reviewDir };
}

function seedReview(reviewDir: string, strategy: string): void {
  writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'strategy-numbering' }));
  writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${JSON.stringify({
    type: 'iteration',
    iteration: 1,
    run: 1,
    status: 'complete',
    focus: 'correctness',
    dimensions: ['correctness'],
    newFindingsRatio: 0.4,
    findingsSummary: { P0: 0, P1: 1, P2: 0 },
  })}\n`);
  mkdirSync(join(reviewDir, 'iterations'), { recursive: true });
  writeFileSync(join(reviewDir, 'iterations', 'iteration-001.md'), [
    '# Iteration 1: Correctness',
    '',
    '## Recommended Next Focus',
    '',
    'Check the retry budget in the queue consumer',
    '',
  ].join('\n'));
  writeFileSync(join(reviewDir, 'deep-review-strategy.md'), strategy);
}

afterEach(() => {
  while (scratchDirs.length > 0) {
    rmSync(scratchDirs.pop() as string, { recursive: true, force: true });
  }
});

describe('deep-review strategy section numbering', () => {
  it('keeps the template section numbers when rewriting a template-derived strategy', () => {
    const template = readFileSync(TEMPLATE_PATH, 'utf8');
    const { specFolder, reviewDir } = makeReviewDir();
    seedReview(reviewDir, template);

    const result = reduceReviewState(specFolder, { write: true, artifactDir: reviewDir });
    // A warning here means a machine-owned section was left untouched, which
    // would let the numbering assertions pass over a file the reducer skipped.
    expect(result.strategyWarning).toBeNull();

    const strategy = readFileSync(result.strategyPath, 'utf8');
    const numbers = headingNumbers(strategy);
    expect(numbers.length).toBeGreaterThan(0);
    const duplicated = numbers.filter((number, index) => numbers.indexOf(number) !== index);
    expect(duplicated).toEqual([]);

    // The four machine-owned sections the reducer rewrites keep the numbers the
    // template gave them, so an operator citing one lands on the same section.
    for (const heading of [
      '## 6. COMPLETED DIMENSIONS',
      '## 7. RUNNING FINDINGS',
      '## 10. EXHAUSTED APPROACHES (do not retry)',
      '## 12. NEXT FOCUS',
    ]) {
      expect(strategy).toContain(`${heading}\n`);
    }
  });

  it('leaves a strategy that already carries the template numbers unchanged on a second pass', () => {
    const template = readFileSync(TEMPLATE_PATH, 'utf8');
    const { specFolder, reviewDir } = makeReviewDir();
    seedReview(reviewDir, template);

    const firstPass = reduceReviewState(specFolder, { write: true, artifactDir: reviewDir });
    const once = readFileSync(firstPass.strategyPath, 'utf8');

    writeFileSync(join(reviewDir, 'deep-review-strategy.md'), once);
    const secondPass = reduceReviewState(specFolder, { write: true, artifactDir: reviewDir });
    const twice = readFileSync(secondPass.strategyPath, 'utf8');

    expect(secondPass.strategyWarning).toBeNull();
    expect(twice).toBe(once);
  });
});