// Proves the deep-review-state projection contract folds ledger events into the
// exact legacy rows the real deep-review reducer consumes. The load-bearing
// check is not that the fold is self-consistent but that the REAL consumer
// (reduceReviewState) reads the projected file without a corruption warning and
// derives the iterations that were folded — a mirror of the consumer would not
// catch a row shape the consumer actually rejects.

import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { createDeepReviewStateProjectionContract } from '../../lib/legacy-projections/deep-review-state-contract.js';

import type { EventReadResult } from '../../lib/event-envelope/index.js';

const require_ = createRequire(import.meta.url);
// The consumer is shipped as CommonJS; require it through createRequire so the
// projected file is exercised by the same code path the runtime uses.
const { reduceReviewState } = require_('../../scripts/reduce-state.cjs') as {
  reduceReviewState: (
    specFolder: string,
    options?: Record<string, unknown>,
  ) => { hasCorruption: boolean; corruptionWarnings: unknown[]; dashboard: string };
};

// A minimal event carrying only the fields the contract's reduce() reads:
// effective.envelope.{event_type, occurred_at, payload:{stem, scope, data}}.
function reviewEvent(
  stem: string,
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string,
): EventReadResult {
  return {
    effective: {
      envelope: {
        event_type: `deep-review.ledger.${stem.replace(/^deep_review\./, '')}`,
        occurred_at: occurredAt,
        payload: { stem, scope, data },
      },
    },
  } as unknown as EventReadResult;
}

const FIXED_TS = '2026-08-23T00:00:00.000Z';

// The event sequence a single deep-review run produces: initialization, two
// dimension passes, and completion. Two passes so a dropped iteration row is
// visible as a count change, not just a missing single row.
function foldFixtureRun(): string {
  const contract = createDeepReviewStateProjectionContract();
  const events: EventReadResult[] = [
    reviewEvent('deep_review.run_initialized', { runId: 'rev-1', generation: 1 }, { maxIterations: 5 }, FIXED_TS),
    reviewEvent('deep_review.dimension_pass_completed', {}, { passNumber: 1, passStatus: 'complete', nextFocusRef: 'dim-a' }, FIXED_TS),
    reviewEvent('deep_review.dimension_pass_completed', {}, { passNumber: 2, passStatus: 'complete', nextFocusRef: 'dim-b' }, FIXED_TS),
    reviewEvent('deep_review.run_completed', {}, { terminalStatus: 'completed' }, FIXED_TS),
  ];
  let state = contract.base.state;
  for (const event of events) {
    state = contract.reduce(state, event);
  }
  return new TextDecoder().decode(contract.serialize(state));
}

const scratchDirs: string[] = [];
afterEach(() => {
  while (scratchDirs.length > 0) {
    const dir = scratchDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('deep-review-state projection contract', () => {
  it('folds review ledger events into the legacy row shapes the reducer parses', () => {
    const lines = foldFixtureRun().trimEnd().split('\n').map((line) => JSON.parse(line));

    expect(lines).toHaveLength(4);

    expect(lines[0]).toMatchObject({ type: 'config', topic: 'rev-1', maxIterations: 5 });
    expect(lines[1]).toMatchObject({ type: 'iteration', iteration: 1, run: 1, status: 'complete', focus: 'dim-a' });
    expect(lines[2]).toMatchObject({ type: 'iteration', iteration: 2, run: 2, status: 'complete', focus: 'dim-b' });
    expect(lines[3]).toMatchObject({ type: 'event', event: 'run_completed', terminalStatus: 'completed' });

    // Every projected line must be a standalone JSON object — the legacy jsonl
    // contract the reducer's line-by-line parser depends on.
    for (const line of lines) {
      expect(typeof line).toBe('object');
      expect(line.timestamp).toBe(FIXED_TS);
    }
  });

  it('produces a file the real deep-review reducer reads without corruption and with the folded iterations', () => {
    const specFolder = mkdtempSync(join(tmpdir(), 'review-projection-'));
    scratchDirs.push(specFolder);
    const reviewDir = join(specFolder, 'review');
    mkdirSync(reviewDir, { recursive: true });
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'projection-proof' }));
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), foldFixtureRun());

    const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });

    expect(result.hasCorruption).toBe(false);
    expect(result.corruptionWarnings).toHaveLength(0);
    // The dashboard reports the iteration count the reducer derived from the
    // projected rows. Two dimension passes were folded, so the count is 2; when
    // the contract's iteration rows are suppressed (negative control) this drops
    // to 0 and the assertion fails, proving the check observes the fold.
    expect(result.dashboard).toContain('Iteration: 2 of 5');
  });
});
