// ───────────────────────────────────────────────────────────────────
// MODULE: Alignment Suggestion Measurement Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';
import { rmSync } from 'node:fs';
import { scanText } from '../evals/score-alignment-suggestion';

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe('line scan', () => {
  it('bands each event by its decision line, not its printed percentage', () => {
    const text = [
      '   Phase 1B Alignment: 040-alpha-beta (40% match)',
      '   Warning: Moderate alignment (55%) - proceeding with caution',
      '   Phase 1B Alignment: 050-gamma (80% match)',
      '   Warning: INFRASTRUCTURE MISMATCH: Work is on .skilled/skill/',
      '   Warning: INFRASTRUCTURE ALIGNMENT WARNING',
    ].join('\n');

    expect(scanText(text)).toEqual([
      { path: 'cli', band: 'moderate', target: '040-alpha-beta', printedScore: 40, alternatives: [], hardBlock: false, pick: null },
      { path: 'cli', band: 'infrastructure', target: '050-gamma', printedScore: 80, alternatives: [], hardBlock: false, pick: null },
    ]);
  });

  it('reads a data-path low event with its alternatives and a pick', () => {
    const text = [
      '   Alignment check: 001-billing-export (0% match)',
      '',
      '   Warning: LOW ALIGNMENT WARNING (0% match)',
      '   The selected folder "001-billing-export" may not match conversation content.',
      '',
      '   Better matching alternatives:',
      '   1. 003-quantum-telemetry (100% match)',
      '   2. 002-quantum-lattice-orchard (100% match)',
      '   3. Continue with "001-billing-export" anyway',
      '   4. Abort and specify different folder',
      '   Proceeding with "001-billing-export" as requested',
    ].join('\n');

    expect(scanText(text)).toEqual([
      { path: 'data', band: 'low', target: '001-billing-export', printedScore: 0, alternatives: ['003-quantum-telemetry', '002-quantum-lattice-orchard'], hardBlock: false, pick: '001-billing-export' },
    ]);
  });

  it('counts unknown and decorated lines as nothing', () => {
    const text = [
      '   Warning: Something unrelated',
      '⚠️  LOW ALIGNMENT WARNING',
      '- below this triggers LOW ALIGNMENT WARNING',
      "console.log('   Content aligns with target folder');",
    ].join('\n');

    expect(scanText(text)).toEqual([]);
  });

  it('reads a JSON-escaped cli-path log with a hard block and no list', () => {
    const text = JSON.stringify({
      output: [
        '   Phase 1B Alignment: 001-research (0% match)',
        '',
        '   Warning: ALIGNMENT WARNING: Content may not match target folder',
        '   Target folder: 001-research (0% match)',
        '',
        '   ALIGNMENT_HARD_BLOCK: 0% alignment is below minimum non-interactive threshold (20%)',
      ].join('\n'),
    });

    expect(scanText(text)).toEqual([
      { path: 'cli', band: 'low', target: '001-research', printedScore: 0, alternatives: [], hardBlock: true, pick: null },
    ]);
  });
});
