import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

interface CarriedForwardQuestion {
  text: string;
  addedAtIteration: number;
  source: string;
}

const {
  buildCarriedForwardOpenQuestions,
  deriveNextFocusFromContinuity,
  formatCarriedForwardOpenQuestions,
} = require('../../lib/deep-loop/continuity-thread.cjs') as {
  buildCarriedForwardOpenQuestions: (input: {
    iterationFiles?: Array<Record<string, unknown>>;
    iterationRecords?: Array<Record<string, unknown>>;
    machineOpenQuestions?: Array<string | { text: string }>;
  }) => CarriedForwardQuestion[];
  deriveNextFocusFromContinuity: (input: {
    iterationFiles?: Array<Record<string, unknown>>;
    iterationRecords?: Array<Record<string, unknown>>;
    carriedForwardOpenQuestions?: CarriedForwardQuestion[];
    machineOpenQuestions?: Array<string | { text: string }>;
    terminalSentinel?: string;
  }) => string;
  formatCarriedForwardOpenQuestions: (questions: CarriedForwardQuestion[]) => string;
};

describe('continuity threading helpers', () => {
  it('builds self-owned open questions without duplicating machine-owned questions', () => {
    const questions = buildCarriedForwardOpenQuestions({
      iterationFiles: [
        {
          run: 1,
          questionsRemaining: [
            'Question C',
            'Which runtime helper should own the next focus derivation?',
          ],
        },
      ],
      iterationRecords: [
        {
          run: 2,
          openQuestions: ['Which runtime helper should own the next focus derivation?', 'How should the prompt see the thread?'],
        },
      ],
      machineOpenQuestions: [{ text: 'Question C' }],
    });

    expect(questions).toEqual([
      {
        text: 'Which runtime helper should own the next focus derivation?',
        addedAtIteration: 1,
        source: 'iteration-markdown',
      },
      {
        text: 'How should the prompt see the thread?',
        addedAtIteration: 2,
        source: 'iteration-record',
      },
    ]);
  });

  it('formats an empty carried-forward block as an explicit none marker', () => {
    expect(formatCarriedForwardOpenQuestions([])).toBe('[None yet]');
  });

  it('orders same-iteration questions by content rather than input order', () => {
    const first = buildCarriedForwardOpenQuestions({
      iterationFiles: [{ run: 1, questionsRemaining: ['Zebra follow-up', 'Alpha follow-up'] }],
      machineOpenQuestions: [{ text: 'Question C' }],
    });
    const second = buildCarriedForwardOpenQuestions({
      iterationFiles: [{ run: 1, questionsRemaining: ['Alpha follow-up', 'Zebra follow-up'] }],
      machineOpenQuestions: [{ text: 'Question C' }],
    });

    expect(first.map((question) => question.text)).toEqual(second.map((question) => question.text));
  });

  it('prefers the latest carried-forward question when deriving next focus', () => {
    const focus = deriveNextFocusFromContinuity({
      machineOpenQuestions: [{ text: 'Question C' }],
      carriedForwardOpenQuestions: [
        { text: 'Earlier thread question', addedAtIteration: 1, source: 'iteration-markdown' },
        { text: 'Later thread question', addedAtIteration: 2, source: 'iteration-markdown' },
      ],
    });

    expect(focus).toBe('Later thread question');
  });

  it('derives next focus from the latest finding when no thread question exists', () => {
    const focus = deriveNextFocusFromContinuity({
      machineOpenQuestions: [{ text: 'Question C' }],
      iterationFiles: [
        { run: 1, findings: ['Earlier answer'] },
        { run: 2, findings: ['Runtime prompt rendering is already checked.'] },
      ],
    });

    expect(focus).toBe('Follow up on: Runtime prompt rendering is already checked.');
  });

  it('falls back to the strategy question or terminal sentinel when no answer can seed focus', () => {
    expect(deriveNextFocusFromContinuity({
      machineOpenQuestions: [{ text: 'Question C' }],
      iterationFiles: [{ run: 1, findings: [] }],
    })).toBe('Question C');

    expect(deriveNextFocusFromContinuity({
      machineOpenQuestions: [],
      iterationFiles: [{ run: 1, findings: ['Resolved answer'] }],
    })).toBe('[All tracked questions are resolved]');
  });
});
