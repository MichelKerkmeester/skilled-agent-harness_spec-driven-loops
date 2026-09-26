import { describe, expect, it } from 'vitest';
import {
  BudgetError,
  STATE_PLUS_QUESTION_LIMIT,
  TOTAL_TOKEN_LIMIT,
  estimateTokens,
  planBatches,
} from '../src/domain/budget.js';
import type { QuestionMap } from '../src/domain/question.js';

function questions(count: number, instructions: string): QuestionMap {
  const map: Record<string, QuestionMap[string]> = {};
  for (let index = 0; index < count; index += 1) {
    map[`q${index}`] = { type: 'noul', instructions };
  }
  return map;
}

describe('estimateTokens', () => {
  it('overestimates rather than underestimates plain prose', () => {
    const text = 'the quick brown fox jumps over the lazy dog';
    expect(estimateTokens(text)).toBeGreaterThan(text.length / 4);
  });

  it('counts every non-ascii character as a whole token', () => {
    expect(estimateTokens('日本語')).toBe(3);
  });

  it('is zero for empty text', () => {
    expect(estimateTokens('')).toBe(0);
  });
});

describe('planBatches', () => {
  it('keeps a small set of questions in one request', () => {
    const plan = planBatches('const a = 1;', questions(5, 'Is this code correct?'), 8);
    expect(plan.batches).toHaveLength(1);
    expect(Object.keys(plan.batches[0] ?? {})).toHaveLength(5);
  });

  it('refuses a state that leaves no room for the longest question', () => {
    const state = 'x'.repeat(STATE_PLUS_QUESTION_LIMIT * 4);
    expect(() => planBatches(state, questions(1, 'Is this fine?'), 8)).toThrow(BudgetError);
  });

  it('splits questions across requests when they do not fit beside the state', () => {
    const state = 'word '.repeat(4000);
    const plan = planBatches(state, questions(400, 'a'.repeat(2000)), 64);
    expect(plan.batches.length).toBeGreaterThan(1);
    const total = plan.batches.reduce((sum, batch) => sum + Object.keys(batch).length, 0);
    expect(total).toBe(400);
  });

  it('never packs a request over the total limit', () => {
    const state = 'word '.repeat(1000);
    const plan = planBatches(state, questions(300, 'b'.repeat(1500)), 64);
    for (const batch of plan.batches) {
      const cost =
        plan.stateTokens +
        Object.entries(batch).reduce(
          (sum, [name, question]) => sum + estimateTokens(name) + estimateTokens(JSON.stringify(question)),
          0,
        );
      expect(cost).toBeLessThanOrEqual(TOTAL_TOKEN_LIMIT);
    }
  });

  it('refuses to fan out past the request ceiling', () => {
    const state = 'word '.repeat(4000);
    expect(() => planBatches(state, questions(400, 'a'.repeat(2000)), 2)).toThrow(BudgetError);
  });

  it('refuses an empty question set', () => {
    expect(() => planBatches('state', {}, 8)).toThrow(BudgetError);
  });
});
