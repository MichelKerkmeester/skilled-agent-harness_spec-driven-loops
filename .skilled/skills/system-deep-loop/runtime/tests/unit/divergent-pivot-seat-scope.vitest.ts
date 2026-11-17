// ───────────────────────────────────────────────────────────────────
// MODULE: Divergent Pivot Seat Output Scope Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { buildResearchPivotPreparationInput } from '../../../deep-research/scripts/divergent-research-pivot.ts';
import { buildReviewPivotPreparationInput } from '../../../deep-review/scripts/divergent-review-pivot.ts';
import { derivePivotId } from '../../lib/deep-loop/divergent-pivot.ts';
import { createHermeticEnv, type HermeticEnv } from '../helpers/spawn-cjs.js';

const environments: HermeticEnv[] = [];
const FIRST_PIVOT_ID = 'pivot-1-aaaaaaaaaaaa';

function environment(id: string): HermeticEnv {
  const value = createHermeticEnv(id);
  environments.push(value);
  return value;
}

function writeText(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
}

function writeJson(path: string, value: unknown): void {
  writeText(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(path: string, events: readonly Record<string, unknown>[]): void {
  writeText(path, events.map((event) => JSON.stringify(event)).join('\n') + (events.length > 0 ? '\n' : ''));
}

function seatReturned(pivotId: string, seatId: string, attempt?: number): Record<string, unknown> {
  return {
    event: 'pivot_seat_returned',
    pivotId,
    eventId: `${pivotId}:pivot_seat_returned:${seatId}`,
    seatId,
    ...(attempt === undefined ? {} : { attempt }),
  };
}

function pivotCompleted(pivotId: string): Record<string, unknown> {
  return {
    event: 'pivot_completed',
    pivotId,
    eventId: `${pivotId}:pivot_completed`,
    previousFocus: 'First saturated focus',
    saturatedDirections: ['First saturated focus'],
    selectedCandidate: null,
  };
}

function seedCompletedFirstPivot(artifactRoot: string): void {
  writeJsonl(
    join(artifactRoot, 'divergent', 'pivots', FIRST_PIVOT_ID, 'council', 'state.jsonl'),
    [
      seatReturned(FIRST_PIVOT_ID, 'seat-001'),
      seatReturned(FIRST_PIVOT_ID, 'seat-002'),
      seatReturned(FIRST_PIVOT_ID, 'seat-003'),
      pivotCompleted(FIRST_PIVOT_ID),
    ],
  );
}

function appendSeatReturn(artifactRoot: string, pivotId: string): void {
  writeJsonl(
    join(artifactRoot, 'divergent', 'pivots', pivotId, 'council', 'state.jsonl'),
    [seatReturned(pivotId, 'seat-001')],
  );
}

function researchOptions(artifactRoot: string): Parameters<typeof buildResearchPivotPreparationInput>[0] {
  const configPath = join(artifactRoot, 'deep-research-config.json');
  writeJson(configPath, {
    topic: 'Divergent pivot seat output scope',
    lineage: { sessionId: 'session-research-scope', generation: 1 },
  });
  const registryPath = join(artifactRoot, 'deep-research-findings-registry.json');
  writeJson(registryPath, {});
  const strategyPath = join(artifactRoot, 'deep-research-strategy.md');
  writeText(strategyPath, [
    '# Deep Research Strategy',
    '',
    '## 11. NEXT FOCUS',
    '',
    'Current saturated focus',
    '',
  ].join('\n'));
  const stateLogPath = join(artifactRoot, 'deep-research-state.jsonl');
  writeJsonl(stateLogPath, []);
  return {
    artifactRoot,
    configPath,
    stateLogPath,
    strategyPath,
    registryPath,
    currentIteration: 3,
    maxIterations: 10,
    triggerReason: 'composite_converged',
  };
}

function reviewOptions(artifactRoot: string): Parameters<typeof buildReviewPivotPreparationInput>[0] {
  const configPath = join(artifactRoot, 'deep-review-config.json');
  writeJson(configPath, {
    sessionId: 'session-review-scope',
    generation: 1,
    reviewTarget: 'src',
    reviewDimensions: [],
  });
  const registryPath = join(artifactRoot, 'deep-review-findings-registry.json');
  writeJson(registryPath, {});
  const strategyPath = join(artifactRoot, 'deep-review-strategy.md');
  writeText(strategyPath, [
    '# Deep Review Strategy',
    '',
    '## 12. NEXT FOCUS',
    '',
    'Current review dimension',
    '',
  ].join('\n'));
  const stateLogPath = join(artifactRoot, 'deep-review-state.jsonl');
  writeJsonl(stateLogPath, []);
  return {
    artifactRoot,
    configPath,
    stateLogPath,
    strategyPath,
    registryPath,
    currentIteration: 3,
    maxIterations: 10,
    triggerReason: 'all_dimensions_clean',
  };
}

afterEach(() => {
  while (environments.length > 0) {
    environments.pop()?.cleanup();
  }
});

describe('divergent pivot seat output scope', () => {
  it('counts zero seat outputs for a second pivot after a completed first pivot (research)', () => {
    const env = environment('pivot-seat-scope-research');
    const options = researchOptions(env.tmpDir);
    seedCompletedFirstPivot(options.artifactRoot);

    const first = buildResearchPivotPreparationInput(options);
    expect(first.usage.completedPivots).toBe(1);
    expect(first.usage.councilSeatOutputs).toBe(0);
    expect(first.identity.ordinal).toBe(2);

    appendSeatReturn(options.artifactRoot, derivePivotId(first.identity));
    const second = buildResearchPivotPreparationInput(options);
    expect(second.usage.councilSeatOutputs).toBe(1);
  });

  it('counts zero seat outputs for a second pivot after a completed first pivot (review)', () => {
    const env = environment('pivot-seat-scope-review');
    const options = reviewOptions(env.tmpDir);
    seedCompletedFirstPivot(options.artifactRoot);

    const first = buildReviewPivotPreparationInput(options);
    expect(first.usage.completedPivots).toBe(1);
    expect(first.usage.councilSeatOutputs).toBe(0);
    expect(first.identity.ordinal).toBe(2);

    appendSeatReturn(options.artifactRoot, derivePivotId(first.identity));
    const second = buildReviewPivotPreparationInput(options);
    expect(second.usage.councilSeatOutputs).toBe(1);
  });
});
